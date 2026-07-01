
Deploy to Cloudflare (step by step)

Prerequisites

- GitHub repository connected to Cloudflare Pages
- Node.js installed locally

Steps:

1. Open terminal in project root: D:\Labs\dotani

2. Build the project:

   npm run build 

3. Preview locally (optional):

   npm run preview
   
4. Deploy to Cloudflare:

   git add .
   git commit -m "Your changes"
   git push origin main

5. Cloudflare auto-deploys when you push to main branch

If you need to set up deployment:

- Go to Cloudflare Dashboard → Pages → Create Project
- Connect your GitHub repository
- Set build command: npm run build
- Set output directory: apps/web/dist

===

Styling roadmap

Work in this order. Finish each step and check it before moving on.

───

Phase 1 — Foundation (≈1–2 hours)

Step 1. Install Tailwind
• Add @astrojs/tailwind + tailwindcss to apps/web
• Wire it in astro.config.mjs
• Check: npm run dev starts with no errors

Step 2. Global styles
• Add src/styles/global.css with Tailwind directives
• Import it once in a shared layout (next step)
• Set base defaults: smooth fonts, antialiased, sensible body background/text
• Check: utility classes like flex and rounded-lg visibly work on the page

Step 3. Create Layout.astro
• Move shared <html>, <head>, header, footer out of index.astro
• Use the layout on home, services, and portfolio pages
• Check: all routes still render; no duplicated header/footer code

───

Phase 2 — Design tokens (≈1 hour)

Step 4. Define CSS variables
In global.css, set defaults:

--color-primary
--color-secondary
--color-accent
--color-heading
--color-muted
--color-border
--color-bg
--color-text

Step 5. Connect Sanity theme
• Read siteSettings.theme in Layout.astro
• Inject colors as CSS variables on <html> or <body>
• Map Tailwind colors to those variables (primary, secondary, etc.)
• Check: change primaryColor in Studio → site color updates after refresh

Step 6. Clean up component styles
• Remove duplicate per-file .text-heading, .text-muted, etc.
• Keep only component-specific styles
• Fix @apply usage now that Tailwind exists
• Check: buttons, headings, and borders look consistent across sections

───

Phase 3 — Visual polish (≈2–3 hours)

Step 7. Typography
• Pick one font pairing (e.g. Inter + a serif for headings)
• Load via Google Fonts or self-host
• Set in global.css / Tailwind fontFamily
• Check: page no longer looks like system default fonts

Step 8. Section rhythm
• Standardize: container max-w-7xl, section padding, card shadows, hover states
• Touch each section component once (Hero, Services, Portfolio, etc.)
• Check: page scroll feels cohesive, not “random blocks”

Step 9. Images in Sanity
• Add logo, hero image, portfolio thumbnails in Studio (staging)
• Check: home page looks like a real site, not a wireframe

───

Phase 4 — Verify & ship (≈30 min)

Step 10. Preview staging
• PUBLIC_SANITY_DATASET=staging in apps/web/.env
• Review: /, /services, /portfolio, one detail page each
• Check: responsive on mobile + desktop

Step 11. Build & deploy
• npm run build passes
• Deploy to Cloudflare Pages
• Check: live site matches local preview

Step 12. Production content (when ready)
• npm run seed:import:production only after you approve staging
• Re-add/upload images if needed on production dataset

───

What to do right now

Start with Step 1 only.
When Tailwind is working and you can see flex/spacing take effect, say “Step 1 done” and we’ll do Step 2 together.

───

Rules while we go

┌──────────────────┬───────────────────────────────┐
│ Do               │ Don’t                         │
├──────────────────┼───────────────────────────────┤
│ One step at a    │ Skip ahead to polish before   │
│ time             │ Tailwind works                │
├──────────────────┼───────────────────────────────┤
│ Test on staging  │ Import to production early    │
│ dataset          │                               │
├──────────────────┼───────────────────────────────┤
│ Keep layout in   │ Make every spacing value CMS- │
│ code             │ editable                      │
├──────────────────┼───────────────────────────────┤
│ Commit after     │ One giant styling commit      │
│ each phase       │                               │
└──────────────────┴───────────────────────────────┘

---

**“You are working in a repo that already contains 4 instruction documents in the root directory.
Start by reading all `.md` files once and building a single internal project blueprint. Do not re-read them repeatedly.

Then proceed in this order:**

1. Analyse current codebase + setup state (Astro + Sanity already installed).
2. Map CMS architecture from `02-CMS_Architecture_and_AI_Build_Prompt.md`.
3. Map site structure from `01-Website_Master_Wireframe.md`.
4. Respect setup state from `03-PowerShell_Setup_Astro_Sanity_Cloudflare.md`.
5. Follow execution rules from `00-MASTER_AGENT_CONTROL_PROMPT.md`.

---

**Rules:**

* Do NOT hardcode content that belongs in Sanity.
* Build CMS-first architecture before UI work.
* Use reusable section/block system (no static pages).
* Keep components dumb and CMS-driven.
* Do not repeatedly reopen or re-parse all docs; use a single internal summary.
* Ask only one question if blocked; otherwise proceed.

---

**First task:**
Create a concise internal architecture plan:

* CMS structure
* Content types
* Section/block system
* Astro rendering strategy
* Folder structure

Then pause for review before implementation.”

===

Yes — **conceptually it is aligned**, but fix these three things before it starts writing files like a caffeinated intern:

1. **Keep `page.ts` as the main flexible builder**, but do not rely on a catch-all `[slug].astro` for everything. Use it only where truly needed.
2. **Keep `siteSettings` as a singleton**, and move header/footer/theme there, not into scattered globals.
3. **Use section blocks as the real system**, with shared base fields and section-specific options.

The plan is good. The garbled text is just output ugliness, not a structural problem.
**Proceed with implementation.**

===

You are taking over a partially completed project in this repo.

Current state:
- Astro project already exists.
- Sanity Studio already exists and runs locally.
- Sanity MCP is authenticated.
- The repo already contains 4 instruction documents in the root:
  00-MASTER_AGENT_CONTROL_PROMPT.md
  01-Website_Master_Wireframe.md
  02-CMS_Architecture_and_AI_Build_Prompt.md
  03-PowerShell_Setup_Astro_Sanity_Cloudflare.md

What has already been done:
- Base Sanity schema structure started.
- siteSettings.ts exists.
- sectionFields.ts exists.
- Section schemas started:
  heroSection.ts
  statsSection.ts
  servicesSection.ts
  portfolioSection.ts
  whyMeSection.ts
  testimonialsSection.ts
  finalCtaSection.ts
- section index exists
- page.ts exists
- schemaTypes index exists, but the build stopped mid-process because free-model quota was hit.

Your job now:
1. Read the 4 root .md files once only.
2. Build a single internal project blueprint.
3. Do not re-read those docs repeatedly.
4. Continue from the current schema work, not from scratch.

What to do next, in order:
1. Create the missing content types in Sanity:
   - service
   - portfolio
   - caseStudy
   - testimonial
   - blogPost only if needed
2. Check and fix any schema export/import issues.
3. Set up the Sanity schema registry properly.
4. Wire Astro to Sanity with minimal query helpers.
5. Create reusable section components in Astro.
6. Map page.sections[] to section components.
7. Add only the minimum routing needed for now.

Hard rules:
- Do not repeat architecture planning.
- Do not restart the project from scratch.
- Do not reread all markdown files every time.
- Do not ask for confirmation unless truly blocked.
- Do not hardcode CMS content into Astro.
- Keep components dumb.
- Keep CMS as the source of truth.
- Prefer patching existing files over creating new patterns.
- If something is already done, continue from there.

Token-saving workflow rules:
- One planning pass only.
- One implementation pass per task batch.
- No heavy thinking loops.
- No repeated repo scans.
- No “let me analyse the whole project again”.
- No broad refactors unless a file is broken.
- If a task can be done with a small patch, do only the patch.

Task style:
- Work in short, direct execution steps.
- Return only what changed.
- Keep the build moving forward.

First move:
- Inspect the current schema files already created.
- Fix the schema registry.
- Then create the missing content types.
- Stop after that and report the exact next step needed.


===

# Master Controller Prompt

## ROLE
You are an execution-only coding agent.
Do not plan, redesign, or summarise.
Do not reread instruction docs unless a specific broken file explicitly depends on it
The repository state is the source of truth.

## WORK MODE
You will receive only one phase at a time.
Execute only that phase.
Do not jump ahead.
Do not touch unrelated files.
Do not refactor working code.
Do not create new architecture.

## GLOBAL RULES
- Open only files needed for the current phase.
- Open no more than 3 files per phase unless explicitly required.
- Prefer small patches over broad rewrites.
- Stop after one clear milestone.
- Report only:
  1) what was completed
  2) what remains in this phase
- If blocked, ask one precise question only.

## LAYER RULES
- Planning is done outside this agent.
- This agent is build/patch only.
- Micro-fixes may use tiny changes only.
- No repo-wide scans unless the phase explicitly requires it.

## PHASE INPUT FORMAT
PHASE: <number + name>
GOAL: <one sentence>
TARGET FILES: <only if known>
CONSTRAINTS: <short list>
OUTPUT: <file-only | diff-only | patch-only>

## STOP RULE
Finish the phase and stop.
Do not continue into the next phase.

---

# PHASE: 6A — Form UI Creation

GOAL: Add a minimal contact form and booking entry point to the existing site.

TARGET FILES:
- Existing section/component files only
- New contact form component if needed
- New contact page if needed

CONSTRAINTS:
- No integration wiring yet
- No backend logic yet
- No redesign
- Keep it minimal and consistent with current UI
- Open no more than 3 files unless explicitly required
- Do not touch unrelated pages/components

TASKS:
1. Create a simple contact form UI.
2. Add name, email, message fields.
3. Add a submit button with placeholder behaviour if needed.
4. Add a booking CTA or simple booking section pointing to Cal.com.
5. Keep the structure ready for later integration wiring.

OUTPUT:
patch-only

STOP AFTER:
The contact form UI exists and the booking CTA is present.

---

# PHASE: 6 — Forms and Integrations
GOAL: Wire contact forms, booking, email handling, analytics, and protection.
TARGET FILES: Form components, API/actions, integration config files
CONSTRAINTS:
- Use existing tools only (Resend, Cal.com, Turnstile, Cloudflare)
- No custom backend logic
- Keep forms simple and robust
OUTPUT: file-only or patch-only

---

# PHASE: 5 — Global UI and Site Settings
GOAL: Finalise header, footer, navigation, theme, CTA, and global UI from siteSettings.
TARGET FILES: siteSettings schema, layout components, header/footer components
CONSTRAINTS:
- All global UI must be CMS-controlled
- No hardcoded content
- No new design concepts
OUTPUT: patch-only

---

# PHASE: 3 — Route Completion
GOAL: Complete all required Astro routes for existing content types.
TARGET FILES: src/pages/**
CONSTRAINTS:
- Only routes that map to existing schemas
- No layout redesign
- No styling improvements
- Keep routing minimal and functional
OUTPUT: file-only

---

# PHASE: 2 — Content Model Completion
GOAL: Finalise Sanity schemas so all content types and sections are fully usable and editorially complete.
TARGET FILES: Sanity schema files only
CONSTRAINTS:
- No Astro changes
- Add previews, validations, references if missing
- Keep schemas aligned with existing section components
- No new architecture patterns
OUTPUT: file-only or patch-only

---

# PHASE: 1 — Stabilisation and Cleanup
**GOAL:** Stabilise the current build by fixing broken or incomplete code left from the interrupted session.
**TARGET FILES:** Sanity schema registry, section schemas, existing Astro section components, sanity client files.
**CONSTRAINTS:**
- Do not redesign architecture
- Do not reread instruction .md files
- Do not refactor working code
- Fix only what is broken or incomplete
**OUTPUT:** patch-only

===

# Sanity CMS Schema UI Enhancement

You are an expert **website designer, front-end systems thinker, and Sanity CMS architect**. Your task is to examine the design ideas and UI layout references inside the folder **`temp-files/cms-ui`** and transform each Sanity schema document pane into a **high-end, modern, polished, and highly usable CMS interface**.

The goal is not just to “fix” the layouts. The goal is to **design and build a production-grade schema UI system** that feels elegant, powerful, modular, and intuitive for real editorial use.

---

## Core Objective

For every schema/document pane shown in the reference layouts:

- Preserve the **information architecture** and the core intent of the original wireframes
- Convert the layout into a **professional CMS interface**
- Use **universal UI patterns first**, and only introduce custom components when the schema genuinely requires them
- Make the interface feel **modern, dynamic, scalable, and editorially efficient**
- Improve the visual hierarchy, spacing, form usability, and interaction quality
- Ensure the design is suitable for a **Sanity-based content management system**

---

## Design Principles

### 1) General UI quality
- Use a **clean, modern, minimal admin-panel aesthetic**
- Keep the interface **consistent, balanced, and responsive-looking**
- Prefer **clear visual hierarchy** over decorative styling
- Maintain strong alignment, spacing discipline, and section separation
- Use subtle borders, soft backgrounds, and polished input states
- Make the interface feel premium, but not overdesigned

### 2) Layout behaviour
- Follow the wireframe logic in the reference images
- The **top query items** on each document pane should sit in a **left sticky narrow column**, as shown in the sketches
- The main editable content should remain in the larger right-side area
- Use a structure that works well for:
  - simple fields
  - grouped fields
  - tabbed sections
  - collapsible subsections
  - repeatable collections
  - pop-up editors
  - settings panels
- Keep the layout flexible enough to support many schema types

### 3) Interactive behaviour
When adding or editing items such as new links, list items, gallery entries, menu entries, repeated blocks, or nested values:

- Use **proper popups, modals, drawers, or overlays**
- Do **not** allow awkward inline expansion that breaks the layout
- When a popup, modal, subsection editor, or element editor is open:
  - the content beneath it must be **unscrollable**
  - the content beneath it must be **unclickable**
  - background interaction must be blocked until the popup is closed
- Use focus-lock / scroll-lock behaviour that feels like a professional CMS
- Make the add/edit flow feel intentional and controlled, not clumsy

---

## Visual Styling Rules

### Colour handling
Where colours are used:
- Keep them **professionally controlled**
- Use a coherent palette
- Avoid random or childish colour use
- Include a **hex value display + colour picker** wherever colour selection is relevant
- Let users easily preview, choose, and copy colours
- Present colour fields in a tidy, product-quality way

### Labels and inputs
- Field labels should usually remain visible
- Place labels **inside the field as placeholder text only when that improves usability**
- Do not force placeholder-only labelling if it reduces clarity
- Use the most readable and practical label placement for each field type

### Buttons and controls
- Use consistent button sizes, shapes, spacing, and states
- Make “Add New”, “Edit”, “Save”, “Remove”, and similar actions look polished and clear
- Use elegant destructive-action styling where needed
- Make controls feel native to a serious CMS product

---

## Universal Schema Enhancements

Across all relevant schemas, include or improve these features where useful:

### 1) SEO / AEO section
Add a dedicated universal **SEO** section to each schema, but make it modern and AI-ready, not just traditional SEO.

This section should be designed for **AEO (Answer Engine Optimisation)** and broader discoverability, meaning it should support:
- concise search-friendly titles
- meta descriptions
- slug handling
- canonical URLs
- social preview fields
- structured data support where appropriate
- query-intent-friendly summaries
- content summaries for AI retrieval
- optional FAQ / Q&A patterns where relevant
- semantic metadata fields that support modern search and AI systems

Do **not** promise impossible ranking outcomes. Instead, make the SEO/AEO system as strong and technically sound as possible **without harming CMS usability or content quality**.

### 2) Socials handling
Create a **dedicated socials section in Site Settings**.

- Remove the social links option from other places
- In other relevant areas such as header, footer, and mobile menu, only provide a simple:
  - `Socials: Show / Hide`
- Keep the actual social link management centralised in the dedicated socials area

### 3) Icon picker
Add an **icon picker** only where it is genuinely useful and contextually required
- Do not add it everywhere by default
- Use it for navigation, buttons, social entries, feature blocks, or similar cases where icons improve clarity

### 4) Featured image and gallery
For each post type or content type where visual content is relevant:
- add a **featured image** field
- add a **gallery** field where appropriate
- use a clean media management pattern
- keep upload/edit/reorder interactions elegant and predictable

### 5) Featured toggle
Where a field, block, item, or entry has a **“featured”** toggle:
- interpret it as a flag for prominence, highlight, priority, or special styling
- make the UI explain that clearly through layout or helper text
- ensure the meaning is visually obvious and editor-friendly

---

## Schema-Level UX Expectations

Design the schema UI so it feels like a real professional content tool:

- Section headers should be clear and scannable
- Nested groups should be visually separated
- Repeated content should be easy to scan and reorder
- Advanced options should be discoverable without overwhelming the user
- Important fields should feel prominent
- Optional fields should be visually secondary
- Use collapsible groups where they improve usability
- Support both simple and complex schemas cleanly

---

## Technical and Product Direction

Think like a Sanity expert and a serious CMS builder.

The result should:
- be technically practical
- be scalable across many schema types
- support reusable patterns
- reduce editor friction
- avoid clutter
- feel like a refined content platform, not a rough prototype

Where possible, use:
- modular field groups
- repeatable blocks
- structured editors
- modal-based item editing
- polished settings sections
- accessible interaction states

Avoid:
- messy inline expansion
- inconsistent components
- weak spacing
- random custom styling
- overly decorative UI
- features that look nice but reduce editing efficiency

---

## Output Expectations

Using the layouts and ideas in **`temp-files/cms-ui`**, create each schema/document pane as a:

- modern
- clear
- polished
- technically strong
- highly usable
- visually balanced

Sanity CMS interface design.

The final result should feel like a **high-end editorial CMS system** built by someone who understands both **design quality** and **real-world content operations**.

End of prompt.

If you have legacy menu/logo data in another dataset (e.g. production), run the same scripts there:

cd apps/studio
npx sanity exec scripts/migrate-menus.mjs --with-user-token
npx sanity exec scripts/migrate-brand-logos.mjs --with-user-token


===

Now we need some design improvements and critical changes. You make your most tailored skills and plugin for design active and in action.
FIRST HARD RULE: The entire project is built and to be built with "mobile-first" approach. I mean that Always remember that. and if something major or worth adding is added, modified, fixed or improved, update the changelog in the root folder. and also have some temp record or memory of this process, so in case your requests or tokens quota reach the limit and you leave abrutly, you will remember from where to resume instead of starting from scratch, if possible.
---
THE CHANGES:
---
- on the home page, the stats section is weird. make the mertics auto, i mean each stats item (metric) should adapt auto width with universal gap between, it mean if there are 3 metrics, all 3 should be in the same row with auto width, with min-width 7rem, max-width 30rem (not required but if you want you can set max width). - in the general/common sections, the section 'title',  'tagline' and 'link' have no space between. make them like this. 'title+gap+tagline+gap+link' (by gap i mean universal/root gap).
- make a universal, master card system only if you think, it is a better idea. if master card is better option for the website health, speed and overall performance, consider it. if it is so, when card has featured image, make it 'image+content'. if card has 'tag-pill' make it over the featured image. make the 'tag-pill' auto width, not full width. make sure that tag-pill remains over the 'overlay' which is visibl on hover. give the card a subtle border. if the card doesn't have image, tag-pill stays on it place, right before the title. if card has icon  (service-badge), make it inline with title; 'badge+title', if no badge, title is full is normal, full width.
- add a new option to sections in cms. where width have options 'inherit, full, small, medium, large', make it 'full, half' only. so full will adapt full 100vw width, half will take 50% or 50% - gap.. and if niether full, nor half is selected, by default it will adapt the site wide (container) width. if two sections having half width each, both will be placed in same row. means half+gap+half. if one is set to half width, the following or followed one is not half, the half one will be still automatically full container width. perhaps the parent container of sections  will be flex or grid, with universal gap, only if you think it is good idea. make sure all these changes are implemented and reflected everywhre across the website frontend and backend.
- footer global (by default) sections:
  (this is this way because of mobile first approach)
  1. branding/logo section: 
     [ logo+description ]
     [ socials ]
  2. menus section:
     [ col 2 ]
     [ col 3 ] + gap + [ col 4 ]
  3. copyright section:
      (center aligned)
     [ copyright text ]
     [ footer menu ]
  (new change in footer: remove the socials section and place the socials inside footer branding section)
- footer on mobile (by default): 
  [ branding / logo section ]
  [ col2 ]
  [ col3 ]+gap+[ col4 ]
  [ copyright ]
- footer on tablet: the branding/logo section full width as on mobile, means no change, while the rest three columns (section) are in row with auto or min-wdith like this:
  [ branding / logo section ] (no change)
  [ col2 ]+gap+[ col3 ]+gap+[ col4 ]
  [ copyright text ] + space between + [ footer menu ]
    (no alignment)
- footer on desktop:
  [ branding min-width 33% ]+gap+[ col2 ]+gap+[ col3 ]+gap+[ col4 ]
    (with global gap, and sapce betweet)
    (no grow, no shrink, cols 2-4 take the space in which each fits better, with space-between. make section/col heading creative. and if a column has links or menu, make sure they are not right text aligned. if a col/section or column is empty or have no content, disappear it entirely, despite if it has heading.)
  [ copyright section ] (no change, same as tablet)

=== 

**Your Role:** Your a modern web designer and award-winning content workflow and infrastructure architect. You are highly professionally recognized for building modern and future ready cms systems.

**Your Task:**

CHANGES IN SANITY CMS:

# New Schema (post-type)

create a new schema (post type) for i don't know the right name but i mean something that carry sets for stats (metrics) and marquee items with fields:
  - Select: () stats,  () marquee
    If stats is selected, show these fields:
    [+add mertic] (when click, a new metric will be added with these fields):
    stat name (post title)
    - number/value/count
    - one line description
    - small note (optional)
    if click [+add metric] a new metric will be added.
    ---
    If marquee is selected, show these fields:
    marquee name (post title),
    - name
    - small note
    [+add item]
    ---
  Note: this post type (scheme) has no SEO, not visible in search engines (with caution, it must not affect other SEO powered post types)

---

# Page New Setup

each page (not post) should have this setting:
1. info
   - title
   - slug
   - excerpt
3. content
4. style
5. SEO
---
## Tab: Content
Repeatable (inline buttons for adding the content):
[add content box] [add (name of the post type that carries stats and marquee sets)] [add rich text]
Keep showing this [add ...] buttons row above and below every section OR make it sticky inside the content tab.
when clicked any, add the section down, not popup but right next section on the page.

### When 'add content box' is clicked open this:
(this section type 'content box' will replace the old custom sections like the ones on home page). 
This master/global content box wiill have:
  - content box header (sec-header): icon/badge + eyebrow + title + tagline + link
  - content box content (sec-desc): () dynamic & () Custom. if dynamic, show a dropdown list of the post types (services, portfolio items, case studies, testimonials, blog posts. not pages). whatever is selected from the dropdown, that will be shown on front. If custom, show a rich text box. show sec-img, sec-cta.
  - content box cta buttons (sec-cta) "ONLY Show if sec-content is custom, if sec-content is dynamic, don't show.
  - content box image (sec-img): image of the content box on the right by default, 40% wide by default (on front design), with options: left / right and width (custom). These side and width options will be applied only on tablet and desktop frontend design, not mobile. if image on side, the rest content from sec-header to sec-cta everything on other side.
  General rules for the content box:
  - options: sapcing (global gap by default and custom block and inline), width (side-wide/container width by default, full (100vw), half).
  - custom color setting toggle: off by default, if on, show background and text color options. for background, use options 'solid color, gradient, image'
  - if a field is left blank or empty, it won't be shown and would be hidden on front.
  ---

### When 'the unnamed post-type (for stats & marquee sets)' is clicked open this section:
- Select: () Stats,  () marquee
  a. if stats is selected, open a dropdown list of the stats sets and select a stats set.
  b. if marquee is selected:
    1. open a dropdown list of the marquee sets and select a marquee set.
    2. show fields: [speed] [skewY+value-field+deg] [skewX+value-field+deg (add this field only if required or worth it)] [height/hight]
- Styling: same as content box and additionally a checkbox for 'Glass' [], [if glass checkbox is ticked/checked show this field: 'glass value' (value means the effect size or the blur size, i don't know correct name for this field)]

### When 'add rich text' (you can name this section correctly), show this:
1. Rich Text box like WordPress editor
2. Styling

===

# OpenCode Prompt

Redesign the **front-end only** of my personal brand website to feel **premium, modern, creative, and ahead of its time** — like a site that could realistically be built in **2030**.

Keep the current structure and content intent, but upgrade the visual system completely. **Do not reread or refactor the whole project**; focus only on the UI/UX and presentation layer.

## What to improve

* Turn the homepage into a **high-end editorial / agency-style experience**.
* Use **bold typography, stronger hierarchy, cleaner spacing, and more intentional layout rhythm**.
* Make the design feel **future-ready, immersive, and polished**, not just “dark and fancy”.
* Add **subtle motion, depth, glass / soft glow accents, and smooth hover states** where appropriate.
* Improve sections so they feel more **distinct, dynamic, and premium**: hero, services, work, testimonials, CTA, and contact.
* Make the site feel better on **desktop and mobile**.

## Design direction

* Style: **luxury dark mode, futuristic editorial, minimal but expressive**.
* Visual language: **soft gradients, refined shadows, layered cards, cinematic spacing, sleek surfaces**.
* Typography: stronger display headlines, cleaner body text, better contrast.
* Layout: more premium grids, better section separation, fewer flat blocks.
* Interactions: smooth transitions, refined hover behaviour, tasteful animations.

## Constraints

* **Mobile-first is mandatory** — design, spacing, typography, and interactions must be conceived for mobile first, then progressively enhanced for tablet and desktop.
* **Preserve existing content and brand identity**.
* **Do not change the site’s purpose or page structure unnecessarily**.
* Avoid generic template design.
* Keep it **fast, elegant, and production-friendly**.

## Goal

Make the website look like a **2026–2030 level personal brand site**: confident, modern, creative, and memorable — the kind of design people would immediately remember.


===

Now the issues, still exist:
- remove this css style(s) at all:
  .section-surface-dark .section-heading, .section-surface-dark .section-tagline, .section-surface-dark h2, .section-surface-dark h3, .section-surface-dark p {..}
- in section, the "section-header-bar" class, the heading and tagline both are in same row, looking weird, make it either direction column, or give heading full width.
- in section, when it has image, it is not rightly placed as per the sanity backend setting, instead it wrongly stands/falls after the content, while it was supposed to either on right or left as per setting.
- in section, 'section-container' should have padding-block (moderate).
- remove the 'max-w-2xl' width, instead do this: if the already available setting "section width" > full or half is selected, make it 100vw full and 50%-[gap] half, if not (none) selected, no defined width is needed additionally. 
- for all sections (i mean section by default), make inline margin auto.
- for single portfolio and single case study,
  - make the post header on left (max 33%) sticy on desktop, while the content (post body) on right,
  - show the content and main parts minimalistic look, not card-heavy style. 

===
