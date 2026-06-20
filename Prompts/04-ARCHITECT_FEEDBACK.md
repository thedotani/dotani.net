# Architect Feedback — Dotani.net (Jun 2026)

Concise audit of `Prompts/` and the live codebase. `temp-files/` excluded per instruction.

---

## Prompts Folder — Critical Review

### What works

| Doc | Strength |
|-----|----------|
| `00-MASTER_AGENT_CONTROL_PROMPT.md` | Clear agent roles, CMS-first principles, sensible build order |
| `01-Website_Master_Wireframe.md` | Complete IA: 9 page types, responsive wireframes, reusable block inventory |
| `02-CMS_Architecture_and_AI_Build_Prompt.md` | Correct vision: singleton settings, composable pages, section blocks |

### What is broken or stale

1. **Doc 03 is outdated.** Still references `dotaninet/` and "ready for CMS structuring." Reality: npm workspaces monorepo (`apps/web`, `apps/studio`), Sanity schemas built, Cloudflare adapter configured, build passes.

2. **Filename drift in Doc 00.** Points to `02-CMS_Architecture_and_Build.md` — actual file is `02-CMS_Architecture_and_AI_Build_Prompt.md`. Agents will miss the CMS spec.

3. **Wireframe ↔ CMS gap.** Wireframe defines blocks with no schema or frontend yet:
   - Intro / Value block (What I Do / Who This Is For)
   - Profile Highlight
   - FAQ accordion
   - Logo strip
   - Filter chips, pagination, related-content blocks

4. **CMS spec ↔ implementation gap.** Doc 02 requires `tool` content type and Profile Highlight section — neither exists in `apps/studio`.

5. **No seed source of truth.** `scripts/seed-content.mjs` expects `Prompts/seed_new.js` — file is deleted. Seed pipeline is broken.

6. **No definition of done.** Prompts describe vision and setup but lack acceptance criteria, env/deploy runbook, or content migration checklist.

7. **Wireframe size risk.** `01` at ~1,650 lines is too heavy for repeated agent reads. Needs a 1-page priority summary (MVP vs Phase 2).

---

## Project Status — Where We Actually Are

**Verdict: Strong foundation (~65%), incomplete product (~35% pages/features).**

### Built and working

- **Monorepo** — `apps/web` (Astro 6 + Tailwind 4 + Cloudflare) + `apps/studio` (Sanity 6)
- **CMS core** — `siteSettings` (brand, menus, header, footer, theme, SEO), `page` builder, 9 section schemas, 5 content types (`service`, `portfolio`, `caseStudy`, `testimonial`, `blogPost`)
- **Studio polish** — custom structure, theme, UX plugins, hex colors, universal menu, SEO/AEO fields
- **Homepage** — fully section-driven from Sanity (`index.astro` switch/map pattern)
- **Global shell** — CMS-driven header, footer, mobile nav, dark/light toggle, back-to-top
- **Listings** — `/services`, `/portfolio` with CMS content (but hardcoded page heroes)
- **Detail pages** — `/services/[slug]`, `/portfolio/[slug]`
- **Contact API** — Turnstile + Resend wired (`/api/contact`)
- **Deploy path** — `npm run build` succeeds; Wrangler config present

### Not built (wireframe promises these)

| Missing | Impact |
|---------|--------|
| `/profile`, `/contact`, `/booking` routes | 3 of 9 page types absent |
| Case study frontend | Schema exists, zero routes |
| Blog frontend | Schema exists, zero routes |
| `tool` content type | Spec'd in Doc 02, not implemented |
| `profileHighlightSection`, FAQ, intro/value sections | Home wireframe sections missing |
| Generic CMS page route (`/[slug]`) | Only `home` slug is consumed; Studio exposes homepage singleton only |
| Shared `PageSections` renderer | Section switch duplicated; other pages can't reuse it |
| Portable Text renderer | Detail pages flatten rich text to first block — data loss |
| Sticky Book CTA, WhatsApp float | Wireframe utility elements absent |
| Portfolio filters / pagination | Wireframe feature absent |
| 404 page | Broken slugs redirect to `/404` which doesn't exist |
| TypeGen / Visual Editing | No type safety or live preview |

### Architecture violations (fix before launch)

1. **Hardcoded listing copy** — `services/index.astro` and `portfolio/index.astro` use static titles/descriptions. Violates CMS-first rule from Docs 00 and 02.

2. **Split page strategies** — Home is block-composed; Services/Portfolio are bespoke Astro templates. Should converge on one pattern.

3. **Dataset inconsistency** — Studio → `staging`; web `sanity.ts` defaults to `production` (`.env` overrides). Easy to edit content that the site never reads.

4. **SSR + `getStaticPaths` mismatch** — Build warns paths are ignored. Pick prerender for content pages or drop `getStaticPaths`.

5. **Seed broken** — Cannot bootstrap staging content without restoring seed source.

---

## Design & UX (2026 bar)

**Positives:** Fraunces + Inter pairing, CSS-variable theme system, dark mode, responsive section components, cohesive card/button patterns in `global.css`.

**Gaps:** No motion/scroll polish, no image optimization pipeline (raw Sanity URLs), placeholder SVGs still in use, detail pages feel template-thin vs wireframe depth (galleries, metrics, related content under-rendered).

---

## Top 5 risks if we ship now

1. Content editors can only manage the homepage — not Contact, Profile, or Booking as pages.
2. Broken seed = empty or partial staging dataset.
3. Rich text content will render incorrectly on service/portfolio detail pages.
4. Dataset mismatch = "I edited Studio but the site didn't change."
5. No 404, no blog/case-study routes = dead links from nav and related-content fields.

---

## Confirmed decisions (Jun 2026)

| Topic | Decision |
|-------|----------|
| Scope | **Full 9-page wireframe** |
| Blog | **Later** (post-launch) |
| Case studies | **Before launch** |
| Booking | **Cal.com link/section now**; full embed page later |
| Datasets | `staging` = dev · `production` = live |
| Assets | Final files → `/assets` folder; placeholders OK in dev |
| Domain | **`next.dotani.net`** for preview · **`dotani.net`** at launch |

See `05-COMPLETION_PLAN.md` and `06-LAUNCH_CHECKLIST.md` for execution path.