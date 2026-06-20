# 03: Project Setup & Current State

Monorepo: Astro frontend + Sanity Studio + Cloudflare Pages. Windows/PowerShell workflow.

---

## Repository layout

```
D:\Labs\dotani\
├── apps/
│   ├── web/          # Astro 6 site (Cloudflare adapter)
│   └── studio/       # Sanity Studio 6
├── scripts/          # build, deploy, seed
├── assets/           # final brand images (upload to Sanity from here)
├── Prompts/          # specs, plans, checklists
├── package.json      # npm workspaces root
└── wrangler.jsonc    # Cloudflare Pages config
```

**GitHub:** `https://github.com/thedotani/dotani.net.git`

**Sanity project:** `tmw5kvr6` · org `Dotani`

---

## Datasets

| Environment | Dataset | When |
|-------------|---------|------|
| Local dev | `staging` | Always during build |
| Preview (`next.dotani.net`) | `staging` | Until content approved |
| Live (`dotani.net`) | `production` | Launch cutover |

Studio (`apps/studio/sanity.config.ts`) uses `staging`.
Web reads `PUBLIC_SANITY_DATASET` from `apps/web/.env`.

---

## Commands (run from repo root)

```powershell
cd D:\Labs\dotani

# Dev servers
npm run dev          # Astro → http://localhost:4321
npm run studio       # Sanity → http://localhost:3333

# Seed staging content
npm run seed:generate
npm run seed:import

# Production seed (explicit confirmation required)
npm run seed:import:production

# Build & deploy
npm run build
npm run deploy
```

---

## Environment variables (`apps/web/.env`)

```env
PUBLIC_SANITY_PROJECT_ID=tmw5kvr6
PUBLIC_SANITY_DATASET=staging

PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...

RESEND_API_KEY=...
CONTACT_TO_EMAIL=online@dotani.net

PUBLIC_CALCOM_USERNAME=dotani
```

Cloudflare Pages: set the same vars per environment (`staging` for `next.dotani.net`, `production` for `dotani.net`).

---

## What's built

- CMS schemas: `siteSettings`, `page`, 9 section types, 5 content types
- Homepage: CMS section-driven
- Routes: `/`, `/services`, `/services/[slug]`, `/portfolio`, `/portfolio/[slug]`
- Contact API: Turnstile + Resend
- Global shell: header, footer, mobile nav, theme toggle

## What's in progress

See `05-COMPLETION_PLAN.md` — full 9-page wireframe, case studies, unified page architecture.

---

## Deploy targets

| URL | Purpose |
|-----|---------|
| `next.dotani.net` | Staging preview (Cloudflare Pages) |
| `dotani.net` | Production launch |

Studio: `npm run deploy --workspace apps/studio`

---

## Rules

- Do not hardcode content that belongs in Sanity
- Use reusable section blocks, not bespoke page layouts
- `staging` for dev; never edit production casually
- Final images go in `/assets` → upload to Sanity Media Library