import type { APIRoute } from 'astro'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME_MAX = 100
const MESSAGE_MAX = 5000
const SUBJECT_MAX = 100

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, '')
}

function encodeEntities(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

function sanitizeSubject(s: string): string {
  return s.replace(/[\r\n]/g, '').slice(0, SUBJECT_MAX)
}

const RATE_LIMIT = 5
const RATE_TTL = 3600

function rateLimitKey(ip: string): string {
  return `rate:contact:${ip}`
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env ?? {}

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
  const kv = env.SESSION as { get: (k: string) => Promise<string | null>; put: (k: string, v: string, opts: { expirationTtl: number }) => Promise<void> } | undefined

  if (kv) {
    const count = parseInt(await kv.get(rateLimitKey(ip)) || '0', 10)
    if (count >= RATE_LIMIT) {
      return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    await kv.put(rateLimitKey(ip), String(count + 1), { expirationTtl: RATE_TTL })
  }

  const formData = await request.formData()
  const name = (formData.get('name') as string || '').trim()
  const email = (formData.get('email') as string || '').trim()
  const message = (formData.get('message') as string || '').trim()
  const turnstileToken = formData.get('cf-turnstile-response') as string

  const errors: string[] = []
  if (!name) errors.push('Name is required')
  else if (name.length > NAME_MAX) errors.push(`Name must be ${NAME_MAX} characters or fewer`)
  if (!email) errors.push('Email is required')
  else if (!EMAIL_REGEX.test(email)) errors.push('Invalid email format')
  if (!message) errors.push('Message is required')
  else if (message.length > MESSAGE_MAX) errors.push(`Message must be ${MESSAGE_MAX} characters or fewer`)
  if (!turnstileToken) errors.push('Please complete the security check')

  if (errors.length) {
    return new Response(JSON.stringify({ error: errors.join('. ') }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const cleanName = encodeEntities(stripHtml(name))
  const cleanMessage = encodeEntities(stripHtml(message))
  const cleanEmail = encodeEntities(stripHtml(email))

  const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: turnstileToken,
    }),
  })

  const turnstileData = await turnstileResponse.json()
  if (!turnstileData.success) {
    return new Response(JSON.stringify({ error: 'Turnstile verification failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const subject = sanitizeSubject(`New contact form submission from ${cleanName}`)

  const resendResponse = await fetch('https://api.resend.com/v1/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'contact@dotani.net',
      to: env.CONTACT_TO_EMAIL,
      subject,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${cleanName}</p>
        <p><strong>Email:</strong> ${cleanEmail}</p>
        <p><strong>Message:</strong> ${cleanMessage}</p>
      `,
    }),
  })

  if (!resendResponse.ok) {
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
