import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData()
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const message = formData.get('message') as string
  const turnstileToken = formData.get('cf-turnstile-response') as string

  // Verify Turnstile token
  const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: import.meta.env.TURNSTILE_SECRET_KEY,
      response: turnstileToken,
    }),
  })

  const turnstileData = await turnstileResponse.json()
  if (!turnstileData.success) {
    return new Response(JSON.stringify({ error: 'Turnstile verification failed' }), { status: 400 })
  }

  // Send email via Resend
  const resendResponse = await fetch('https://api.resend.com/v1/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'contact@dotani.net',
      to: import.meta.env.CONTACT_TO_EMAIL,
      subject: `New contact form submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    }),
  })

  if (!resendResponse.ok) {
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 })
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}