# Launch Checklist — Dotani.net

Use this to track progress toward full wireframe on `next.dotani.net`, then `dotani.net`.

**Scope:** 9 pages · case studies yes · blog no · Cal.com link only · staging/prod datasets

---

## Global (every page)

- [ ] Header: logo, nav, CTA, theme toggle — all from `siteSettings`
- [ ] Footer: 4-column layout, socials, copyright — from CMS
- [ ] Mobile nav + overlay
- [ ] Dark / light mode from CMS defaults
- [ ] Theme colors from CMS (not hardcoded)
- [ ] SEO title + description per page
- [ ] No hardcoded marketing copy in Astro files
- [ ] 404 page works
- [ ] All nav links resolve (zero dead links)

---

## Page 1 — Home `/`

- [ ] Hero (eyebrow, name, positioning, CTAs, image)
- [ ] Trust / stats strip
- [ ] Intro / value block (What I Do + Who This Is For)
- [ ] Featured services (auto from CMS)
- [ ] Featured portfolio (auto from CMS)
- [ ] Why Me
- [ ] Profile highlight snapshot
- [ ] Stats / impact strip
- [ ] Testimonials (auto)
- [ ] Final CTA
- [ ] Contact section (form + Turnstile)
- [ ] Booking section (Cal.com link)
- [ ] Sections reorderable in Studio without deploy

---

## Page 2 — Services `/services`

- [ ] CMS-driven page hero (title, excerpt, eyebrow)
- [ ] All services listed from CMS
- [ ] Service cards: icon, title, description, link
- [ ] Optional FAQ section at bottom

---

## Page 3 — Single Service `/services/[slug]`

- [ ] Full Portable Text description
- [ ] Features, deliverables, best for, timeframe
- [ ] Related portfolio items
- [ ] Related testimonials
- [ ] CTA to contact / booking
- [ ] Breadcrumbs

---

## Page 4 — Portfolio `/portfolio`

- [ ] CMS-driven page hero
- [ ] Grid of portfolio items
- [ ] Category filter chips
- [ ] Card: thumbnail, title, category, result, link

---

## Page 5 — Single Portfolio `/portfolio/[slug]`

- [ ] Full project detail from CMS
- [ ] Gallery, metrics, key points
- [ ] Link to case study (if exists)
- [ ] Related services
- [ ] Breadcrumbs

---

## Page 6 — Case Study `/case-studies/[slug]`

- [ ] Dedicated route (schema exists)
- [ ] Full narrative layout per wireframe
- [ ] Linked from portfolio items
- [ ] Results / metrics section
- [ ] CTA to contact / booking

---

## Page 7 — Profile `/profile`

- [ ] CMS page with sections (hero, bio, experience, skills, CTA)
- [ ] Portrait image
- [ ] Wireframe content blocks covered

---

## Page 8 — Contact `/contact`

- [ ] CMS page with contact section
- [ ] Form submits via `/api/contact`
- [ ] Turnstile works
- [ ] Resend delivers email (staging + prod keys)
- [ ] Direct contact details visible

---

## Page 9 — Booking `/booking`

- [ ] CMS page: hero + supporting copy
- [ ] Cal.com **link** button (not embed — embed is post-launch)
- [ ] Session details / what to expect copy

---

## Utilities (wireframe §0)

- [ ] Back to top
- [ ] Sticky book CTA (CMS toggle)
- [ ] WhatsApp quick contact (CMS toggle)

---

## Infrastructure

- [ ] `npm run build` — clean
- [ ] `npm run seed:import` — works
- [ ] Studio on `staging` dataset
- [ ] Web dev on `staging` dataset
- [ ] Deployed to `next.dotani.net`
- [ ] Production dataset seeded before `dotani.net` cutover
- [ ] `/assets` folder populated → uploaded to Sanity

---

## Explicitly deferred (not launch blockers)

- [ ] Blog index + post routes
- [ ] Booking Cal.com calendar embed
- [ ] `tool` content type
- [ ] Newsletter block
- [ ] Sanity TypeGen
- [ ] Visual Editing / Presentation tool