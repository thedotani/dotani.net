# Dotani.net — Content & CMS Operations Guide

**Purpose:** Living reference for how content should be structured, linked, and published.  
**Use in Notion:** Import this file (Settings → Import → Markdown) or paste sections into pages.  
**Last updated:** June 2026

---

## How to import into Notion

1. In Notion: **Settings & members → Import → Markdown**
2. Select this file (`07-CONTENT_OPERATIONS_GUIDE.md`)
3. Notion will convert headings, tables, quotes, and checklists automatically
4. Optional: pin this page in your **Dotani.net** workspace sidebar

> **Tip:** Split into sub-pages later if it grows — e.g. *Case Studies*, *Publishing*, *Environments*.

---

# 1. Portfolio & Case Studies

> **Core rule:** Case studies are for **depth and proof**. Portfolio items are for **discovery and scanning**. Not every project needs both.

## Relationship models

| Model | When to use | Example |
| --- | --- | --- |
| **1 portfolio → 1 case study** | Default. Most projects. | Zara Leather portfolio card → one Instagram transformation case study |
| **2–3 portfolio → 1 case study** | One big client; several deliverable cards, one story | Website + Social + Campaign cards → single “Client X” case study |
| **Portfolio only (no case study)** | NDA work, logo-only, too thin, or no measurable outcome | Mention in grid; no deep-dive page |
| **1 portfolio → multiple case studies** | Avoid for solo consultant sites | Only if workstreams are truly separate (rare) |

## Decision checklist (before publishing a case study)

- [ ] Clear **challenge** (what was broken or missing)
- [ ] Clear **approach** (how you thought about it)
- [ ] Clear **results** (numbers, outcomes, or named impact)
- [ ] Story can stand alone without the portfolio card
- [ ] You are comfortable showing client name (or have permission)

**Quick test:** *Would a prospect learn something useful in 3 minutes?*  
If no → keep as portfolio item only.

## How linking works on the site

| Where | What happens |
| --- | --- |
| **Studio** | Link is set on **Case Study → Relations → Related Portfolio Items** |
| **Portfolio page** | Shows **Read Full Case Study** when a case study references that item |
| **Portfolio document** | Does **not** link to case studies directly (link is one-way from case study) |

## Volume guidance

| Tier | Count | Case study? |
| --- | --- | --- |
| **Flagship** | 3–8 projects | Full case study |
| **Supporting** | 5–10 projects | Optional shorter story or none |
| **Mentions / logos** | As needed | No case study |

**Aim for quality over quantity.** Five strong case studies beat twenty thin ones.

---

# 2. CMS Pages (what editors control)

## Composable pages (section builder)

These pages are built by stacking sections in Studio. Reorder without code deploy.

| Page | Route | Studio document |
| --- | --- | --- |
| Home | `/` | Homepage |
| Services overview | `/services` | Services Page |
| Portfolio overview | `/portfolio` | Portfolio Page |
| Profile | `/profile` | Profile Page |
| Contact | `/contact` | Contact Page |
| Booking | `/booking` | Booking Page |

## Detail pages (content documents)

| Type | Route | Edited in |
| --- | --- | --- |
| Service | `/services/[slug]` | Content Library → Services |
| Portfolio item | `/portfolio/[slug]` | Content Library → Portfolio |
| Case study | `/case-studies/[slug]` | Content Library → Case Studies |

## Global (every page)

Edited in **Site Settings**: header, footer, menus, theme colours, social links, SEO defaults.

---

# 3. Environments & Datasets

| Environment | Dataset | URL (planned) |
| --- | --- | --- |
| Local dev | `staging` | `localhost:4321` |
| Preview | `staging` | `next.dotani.net` |
| Live | `production` | `dotani.net` |

**Rules:**

- Edit and review in **staging** first
- Import seed to production only when ready to launch: `npm run seed:import:production`
- Never assume Studio and website use the same dataset — check `PUBLIC_SANITY_DATASET` in `apps/web/.env`

---

# 4. Assets (images & files)

Final brand files go in repo folder: `/assets`

| File | Use |
| --- | --- |
| `logo-main` | Header |
| `logo-mobile` | Mobile header |
| `logo-footer` | Footer |
| `favicon` | Browser tab |
| `portrait` | Hero / profile |
| `portfolio/*` | Project thumbnails |
| `og-image.jpg` (1200×630) | Social sharing default |

**Workflow:**

1. Drop files in `/assets`
2. Upload to Sanity Media Library (manual or `npm run seed:images --workspace apps/studio`)
3. Assign in Site Settings or content documents
4. Placeholders in `apps/web/public/images/` stay until Sanity assets are live

---

# 5. Booking & Contact

| Feature | Current setup | Later |
| --- | --- | --- |
| Contact form | `/contact` page + homepage section; Turnstile + Resend | — |
| Booking | Cal.com **link** on `/booking` and booking sections | Full calendar embed (post-launch) |
| Header CTA | **Book a Call** → `/booking` | — |

**Do not** embed Cal.com calendar until Phase 2/post-launch unless explicitly planned.

---

# 6. Studio & seed commands

```powershell
cd D:\Labs\dotani

npm run studio          # Sanity Studio → localhost:3333
npm run dev             # Website → localhost:4321

npm run seed:generate   # Build seed.ndjson from scripts/seed-source.js
npm run seed:import     # Import into staging
npm run seed:verify     # Check document counts

npm run build           # Production build test
```

---

# 7. Content principles (non-negotiable)

1. **CMS-first** — marketing copy lives in Sanity, not in Astro files
2. **One section system** — pages use reusable blocks (hero, services grid, contact, etc.)
3. **Rich text** — use Studio editor blocks; site renders full Portable Text
4. **SEO per page** — fill SEO tab on pages and flagship content
5. **Nav matches reality** — every menu link must resolve (no dead routes)

---

# 8. Publishing checklist (single case study)

- [ ] Portfolio item exists (title, thumbnail, outcome line, slug)
- [ ] Case study linked to correct portfolio item(s)
- [ ] Challenge, approach, process, results, impact filled
- [ ] Hero image or visual gallery added (or acceptable placeholder noted)
- [ ] SEO title + description set
- [ ] Preview on staging: portfolio → case study flow works
- [ ] Client name / details approved

---

# 9. Publishing checklist (site-wide before launch)

- [ ] All 6 CMS pages populated and sections visible
- [ ] Nav: Home, Services, Portfolio, Profile, Contact, Booking
- [ ] Contact form sends email (staging keys tested)
- [ ] Theme colours and logos set in Site Settings
- [ ] `npm run seed:verify` passes on staging
- [ ] Production dataset seeded and `PUBLIC_SANITY_DATASET=production` on live

---

# 10. Deferred (do not block launch)

- Blog posts & RSS
- Cal.com full embed on `/booking`
- `tool` content type
- Newsletter block
- Portfolio filter chips (optional polish)

---

## Related project docs

| File | Contents |
| --- | --- |
| `04-ARCHITECT_FEEDBACK.md` | Audit & confirmed scope |
| `05-COMPLETION_PLAN.md` | Build phases |
| `06-LAUNCH_CHECKLIST.md` | Per-page done criteria |
| `03-PowerShell_Setup_Astro_Sanity_Cloudflare.md` | Commands & env vars |

---

*Add new rules to this file as decisions are made. Keep it short, actionable, and table-friendly for Notion.*