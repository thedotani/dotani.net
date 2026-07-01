import { defineMiddleware } from 'astro:middleware'
import SECURITY_HEADERS from './lib/security-headers.json'

export const onRequest = defineMiddleware(async ({ request }, next) => {
  const response = await next()
  const headers = new Headers(response.headers)

  if (!import.meta.env.DEV) {
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
      headers.set(key, value)
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
})