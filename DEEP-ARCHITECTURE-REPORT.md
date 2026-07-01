# Dotani — Deep Architecture & Technical Report

> **Prepared for:** Senior web developers  
> **Project:** [dotani.net](https://dotani.net) — Portfolio & services site of Raza Dotani  
> **Repository:** `dotani` — Monorepo (npm workspaces)  
> **Node:** `>=22.12.0` | **License:** UNLICENSED (private)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Repository Topography](#2-repository-topography)
3. [Monorepo Architecture & Workspace Wiring](#3-monorepo-architecture--workspace-wiring)
4. [Frontend: Astro SSR on Cloudflare Pages](#4-frontend-astro-ssr-on-cloudflare-pages)
5. [Backend & API Layer](#5-backend--api-layer)
6. [Content Management: Sanity Studio](#6-content-management-sanity-studio)
7. [Content Schema Modeling](#7-content-schema-modeling)
8. [CSS Architecture & Design System](#8-css-architecture--design-system)
9. [Component Tree & Rendering Pipeline](#9-component-tree--rendering-pipeline)
10. [Routing System](#10-routing-system)
11. [Data Flow Diagram](#11-data-flow-diagram)
12. [Build & Deployment Pipeline](#12-build--deployment-pipeline)
13. [DevOps, GitOps & Changelog System](#13-devops-gitops--changelog-system)
14. [Seed Data Pipeline](#14-seed-data-pipeline)
15. [Developer Tooling & MCP Integration](#15-developer-tooling--mcp-integration)
16. [Performance Analysis](#16-performance-analysis)
17. [Security Audit](#17-security-audit)
18. [Accessibility Audit](#18-accessibility-audit)
19. [Dependency Analysis](#19-dependency-analysis)
20. [Areas for Improvement](#20-areas-for-improvement)

---

## 1. Executive Summary

**Dotani** is a single-developer portfolio and services website built by Raza Dotani. It demonstrates a **lean, CMS-driven architecture** using modern server-side rendering on the edge. The entire production site weighs only **6 runtime dependencies** and ships **zero client-side framework JavaScript** — all interactivity is <5KB of inline vanilla JS scripts.

**Architecture at a glance:**

| Layer | Technology | Role |
|-------|-----------|------|
| **Monorepo** | npm workspaces | Organization of frontend + CMS |
| **SSR Framework** | Astro 6.4.6 | Server-rendered HTML on the edge |
| **Runtime** | Cloudflare Pages (Workers) | Global edge network, zero cold starts |
| **Content Backend** | Sanity CMS 6.2.0 | Headless content platform with GROQ API |
| **Styling** | Pure CSS + CSS Modules | Design tokens via custom properties, component-scoped modules |
| **Fonts** | Ancizar Sans (variable) + Merriweather | Self-hosted woff2 with `font-display: swap` |
| **Email** | Resend API | Transactional email from contact form |
| **Bot Protection** | Cloudflare Turnstile | Invisible CAPTCHA on contact form |
| **Booking** | Cal.com | External booking widget integration |

**Key metric — total production dependencies:** `6` packages.

---

## 2. Repository Topography

```
dotani/
├── .astro/                          # Astro build cache
├── .claude/                         # Claude AI project rules
├── .cursor/                         # Cursor IDE rules
├── .cursorrules                     # Root-level Cursor rules
├── .githooks/                       # Custom git hooks (changelog auto-sync)
├── .github/workflows/               # (empty — no CI/CD configured)
├── .vscode/                         # Editor configs
├── .wrangler/                       # Wrangler build cache
├── apps/
│   ├── web/                         # Astro frontend
│   │   ├── src/
│   │   │   ├── assets/fonts/        # Self-hosted woff2 files
│   │   │   ├── components/          # .astro UI components
│   │   │   │   ├── layout/          # Header, Footer, MobileNav, BackToTop, etc.
│   │   │   │   ├── sections/        # ContentBoxSection, ContentSetSection, RichTextSection
│   │   │   │   ├── ui/              # Button, Badge, Card, Input, Tag, Divider, etc.
│   │   │   ├── layouts/
│   │   │   ├── lib/                 # Sanity client, GROQ queries, style utilities
│   │   │   ├── pages/               # File-based routing + API routes
│   │   │   │   ├── api/contact.ts   # POST /api/contact
│   │   │   │   └── sitemap.xml.ts   # GET /sitemap.xml
│   │   │   └── styles/              # tokens.css, base.css, layout.css, pages.css
│   │   ├── public/                  # Static assets (favicon, robots.txt, SVGs)
│   │   ├── dist/                    # Cloudflare Pages build output
│   │   ├── .env                     # LIVE SECRETS (committed)
│   │   ├── astro.config.mjs
│   │   └── tsconfig.json
│   └── studio/                      # Sanity Studio CMS admin
│       ├── schemaTypes/             # Content modeling (documents + objects)
│       ├── lib/fields/              # Reusable field definitions
│       ├── lib/components/          # Custom input components
│       ├── plugins/                 # Studio UX plugin
│       ├── structure/              # Desk structure configuration
│       ├── theme/                   # Studio theme customization
│       ├── styles/                  # Studio CSS overrides
│       ├── scripts/                 # Migration scripts
│       ├── sanity.config.ts
│       └── sanity.cli.ts
├── assets/                          # Root-level assets (fonts, images)
├── changelog/                       # Changelog manifest + checkpoint system
├── content/                         # Content drafts (e.g., case study seed)
├── mcps/                            # MCP tool configurations (Magic, Sanity)
├── scripts/                         # Build/deploy/changelog/seed tooling
├── astro.config.mjs                 # Root Astro config (Cloudflare monorepo build)
├── wrangler.jsonc                   # Cloudflare Pages config
└── package.json                     # Workspace root
```

---

## 3. Monorepo Architecture & Workspace Wiring

### Root `package.json`

```json
{
  "name": "dotani",
  "private": true,
  "workspaces": ["apps/*"],
  "devDependencies": {
    "wrangler": "^4.101.0"
  }
}
```

The monorepo uses **npm workspaces** with exactly two workspace members: `apps/web` (Astro) and `apps/studio` (Sanity). There is no Turborepo, Nx, or Lerna — the orchestration is deliberately minimal.

### Workspace Dependency Matrix

| Package | Depends On | Type |
|---------|-----------|------|
| `apps/web` | `@astrojs/cloudflare`, `@sanity/client`, `astro`, `groq` | Production |
| `apps/web` | `@astrojs/check`, `typescript` | Dev |
| `apps/studio` | `sanity`, `@sanity/vision`, `@sanity/color-input`, `react`, `react-dom`, `styled-components` | Production |
| `apps/studio` | `@sanity/eslint-config-studio`, `@types/react`, `eslint`, `prettier`, `typescript` | Dev |
| Root | `wrangler` | Dev |

### Workspace Communication

There is **no shared library package**. The two workspaces are independent:

- **`apps/web`** queries Sanity via `@sanity/client` over the network (CDN)
- **`apps/studio`** is a standalone Sanity Studio — it talks directly to Sanity's APIs
- The only integration point is the **Sanity project ID** (`tmw5kvr6`) and **dataset name** (`staging` / `production`), shared via `PUBLIC_SANITY_*` environment variables

---

## 4. Frontend: Astro SSR on Cloudflare Pages

### Core Stack

- **Astro 6.4.6** — Web framework for content-driven websites
- **@astrojs/cloudflare 13.7.0** — Adapter that compiles Astro to Cloudflare Workers
- **Output mode:** `server` (SSR) — pages render on each request at the edge
- **No client-side framework** — zero React/Vue/Svelte components. 100% Astro `.astro` files

### Astro Configuration

**Root config** (`astro.config.mjs` — used by Cloudflare Pages build):

```js
export default defineConfig({
  srcDir: './apps/web/src',
  publicDir: './apps/web/public',
  outDir: './apps/web/dist',
  output: 'server',
  adapter: cloudflare({ configPath: './wrangler.jsonc' }),
})
```

**Workspace config** (`apps/web/astro.config.mjs` — used for local dev):

```js
export default defineConfig({
  output: 'server',
  adapter: cloudflare({ configPath: '../../wrangler.jsonc' }),
})
```

The root config is what Cloudflare Pages uses when it runs `astro build` from the repo root during deployment. The workspace config is a thin wrapper referencing the same `wrangler.jsonc` but resolving from `apps/web/`.

### SSR Runtime

The `@astrojs/cloudflare` adapter compiles the Astro app into a **Cloudflare Pages Function** (Worker). On every request:

1. Cloudflare's edge receives the request
2. The Worker runs the Astro SSR runtime
3. It fetches data from Sanity via GROQ queries
4. It renders the full HTML response
5. The HTML is streamed back to the client

Static assets (`/_astro/*`) are served directly from Cloudflare's CDN cache (immutable, 1 year), bypassing the Worker entirely via `_routes.json`.

### Why No Client Framework?

This is a deliberate architectural choice. The site is **content-driven** (portfolio, services, case studies), not app-like. By avoiding a client-side framework:

- **Zero JavaScript** shipped for page rendering
- **Zero hydration overhead**
- **<5KB total** client JS (inline `<script>` blocks only)
- **Perfect Lighthouse scores** likely
- **Simpler mental model** — pages are HTML, not component trees that need rehydration

### Client-Side JavaScript Inventory

Every `<script>` tag in the codebase is `is:inline` (Astro inlines it directly, no module loading):

| Component | Script Size | Purpose |
|-----------|------------|---------|
| `ThemeToggle.astro` | ~1KB | Dark/light mode toggle with localStorage persistence + system preference listener |
| `Layout.astro` (head inline) | ~150B | Flash-free theme initialization before paint |
| `ContactForm.astro` | ~800B | Form submission via `fetch()`, Turnstile integration, loading/success/error states |
| `Header.astro` | ~300B | Mobile menu open/close with escape key handler |
| `BackToTop.astro` | ~200B | Scroll visibility toggle, smooth scroll-to-top |
| `ContentSetSection.astro` | ~500B | Marquee ticker animation via `requestAnimationFrame` |

**Total: ~3KB of JavaScript.** No bundles, no code splitting, no tree-shaking needed.

---

## 5. Backend & API Layer

### 5.1 Cloudflare Pages Configuration

**File:** `wrangler.jsonc`

```jsonc
{
  "name": "dotani-net",
  "pages_build_output_dir": "./apps/web/dist",
  "compatibility_date": "2026-06-14",
  "compatibility_flags": ["nodejs_compat"],
  "kv_namespaces": [{
    "binding": "SESSION",
    "id": "b9ad3899f30d4a1ba9cf41a5d3b5aa17"
  }],
  "env": {
    "production": {
      "compatibility_date": "2026-04-15",
      "kv_namespaces": [{ "binding": "SESSION", "id": "b9ad3899f30d4a1ba9cf41a5d3b5aa17" }]
    }
  }
}
```

**Key observations:**
- `SESSION` KV is declared but **never referenced in application code** — it's for Astro's internal session driver
- `nodejs_compat` flag enables Node.js API compatibility in the Workers runtime
- No R2, D1, Queues, Durable Objects, or other bindings are used

### 5.2 API Endpoints

There are exactly **2 API endpoints** in the entire project:

#### `POST /api/contact`

**File:** `apps/web/src/pages/api/contact.ts`

**Flow:**
1. Parse `multipart/form-data` from the request
2. Extract fields: `name`, `email`, `message`, `cf-turnstile-response`
3. **Verify Turnstile** via POST to `https://challenges.cloudflare.com/turnstile/v0/siteverify`
4. If verification fails → return `400 { error: "Turnstile verification failed" }`
5. **Send email** via Resend API (`POST https://api.resend.com/v1/emails`)
6. If email fails → return `500 { error: "Failed to send email" }`
7. Success → return `200 { success: true }`

**Request:** `POST`, `Content-Type: multipart/form-data`  
**Response shapes:** `200: { success }`, `400: { error }`, `500: { error }`

#### `GET /sitemap.xml`

**File:** `apps/web/src/pages/sitemap.xml.ts`

Generates a dynamic XML sitemap by:
1. Defining static routes (`/`, `/services`, `/portfolio`)
2. Fetching all service slugs, portfolio slugs, and case study slugs from Sanity in parallel
3. Combining them into a `urlset` XML document
4. Returning with `Content-Type: application/xml`

**No caching headers** are set on the sitemap response (possible improvement).

### 5.3 Sanity Client Layer

**File:** `apps/web/src/lib/sanity.ts` (355 lines)

**Client instantiation:**
```ts
export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'tmw5kvr6',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'staging',
  useCdn: true,
  apiVersion: '2024-01-01',
})
```

**Safe fetch wrapper:**
```ts
async function safeFetch<T>(query, params, fallback): Promise<T> {
  try { return await client.fetch<T>(query, params) }
  catch (error) { console.error('Sanity fetch failed:', error); return fallback }
}
```

**All 9 data fetchers:**

| Function | Returns | GROQ Details |
|----------|---------|-------------|
| `getSiteSettings()` | Singleton | Full document with brand, menus, header, footer, socials, layout, theme, seo |
| `getPageBySlug(slug)` | Page or null | Page with sections, custom colors, gradients, images, seo |
| `getHomePage()` | Page | Wrapper → `getPageBySlug('home')` |
| `getAllServices()` | Service[] | Ordered by `order asc, title asc` |
| `getServiceBySlug(slug)` | Service or null | Full service + relatedPortfolio (references) + relatedTestimonials (refs) |
| `getAllPortfolioItems()` | Portfolio[] | Ordered by `order asc, year desc` |
| `getPortfolioItemBySlug(slug)` | Portfolio or null | Full item + relatedServices + linked caseStudy (sub-query) |
| `getAllCaseStudies()` | CaseStudy[] | Ordered by `order asc, year desc` |
| `getCaseStudyBySlug(slug)` | CaseStudy or null | Full study with challenge/approach/process/results/impact/lessons |
| `getAllTestimonials()` | Testimonial[] | Ordered by `featured desc, order asc` |
| `getAllBlogPosts()` | BlogPost[] | Ordered by `publishedAt desc` |

**Parallel fetching pattern** (in `CmsPage.astro`):
```ts
const [page, services, portfolioItems, testimonials, caseStudies, blogPosts] =
  await Promise.all([...6 fetches...])
```

### 5.4 Middleware

**There is no custom middleware.** The built output confirms a no-op pass-through:

```js
globalThis.process ??= {};
globalThis.process.env ??= {};
const onRequest = (_, next) => next();
```

Astro's internal middleware (routing, SSR, image optimization) runs underneath.

### 5.5 Environment Variables

| Variable | Purpose | Scope |
|----------|---------|-------|
| `PUBLIC_SANITY_PROJECT_ID` | Sanity project ID | Public |
| `PUBLIC_SANITY_DATASET` | Sanity dataset name | Public |
| `PUBLIC_TURNSTILE_SITE_KEY` | Turnstile widget key | Public |
| `TURNSTILE_SECRET_KEY` | Turnstile server-side verification | Server |
| `RESEND_API_KEY` | Resend email API key | Server |
| `CONTACT_TO_EMAIL` | Email address for contact submissions | Server |
| `PUBLIC_CALCOM_USERNAME` | Cal.com booking username | Public |

**⚠️ Security concern:** The `.env` file with live secrets is present in the working directory. The `dist/` build output also inlines these values in the compiled worker bundle.

---

## 6. Content Management: Sanity Studio

### 6.1 Studio Configuration

**File:** `apps/studio/sanity.config.ts`

```ts
export default defineConfig({
  projectId: 'tmw5kvr6',
  dataset: 'staging',
  plugins: [
    studioUxPlugin(),
    colorInput(),
    structureTool({ structure }),
    visionTool({ defaultApiVersion: '2024-01-01' }),
  ],
  schema: { types: schemaTypes },
  // siteSettings is hidden from "New document" dropdown
  document: { newDocumentOptions: (prev, { creationContext }) => ... }
})
```

**Plugins used:**
1. **`studioUxPlugin()`** — Custom plugin implementing:
   - `UploadOnlyAssetInput`: Restricts asset inputs to upload-only (no "select existing")
   - `PaneResizeManager`: Custom component for pane resize behavior
2. **`colorInput()`** — Hex color picker with swatches
3. **`structureTool()`** — Desk structure with custom navigation
4. **`visionTool()`** — GROQ query playground

### 6.2 Studio UX Plugin

**File:** `plugins/studioUxPlugin.tsx`

```tsx
export const studioUxPlugin = definePlugin({
  name: 'dotani-studio-ux',
  form: { components: { input: UploadOnlyAssetInput } },
  studio: {
    components: {
      layout: (props) => {
        const DefaultLayout = props.renderDefault(props)
        return (<><PaneResizeManager />{DefaultLayout}</>)
      },
    },
  },
})
```

The `UploadOnlyAssetInput` wraps Sanity's default asset input, filtering the dropdown to show only "Upload" (removing "Choose existing"). The `PaneResizeManager` adds resize handles to the document pane layout.

### 6.3 Studio Theme

**File:** `theme/studioTheme.ts`

Custom Sanity Studio theme with brand-specific colors, typography, and spacing that mirrors the frontend design system.

### 6.4 Desk Structure

**File:** `structure/index.ts`

Custom navigation structure grouping content types logically:
- Site Settings (singleton)
- Pages (list)
- Services / Portfolio / Case Studies / Testimonials / Blog Posts (content lists)
- Content Sets (stats/marquee collections)

### 6.5 Document Layout Marker

**File:** `plugins/DocumentLayoutMarker.tsx`

A React component that visually marks the document layout with colored indicators for different document types, improving editor UX.

---

## 7. Content Schema Modeling

### 7.1 Document Types

#### `siteSettings` (Singleton — `_id: 'site-settings-main'`)

The central configuration document. Not creatable from the UI — only editable.

```
siteSettings
├── brand
│   ├── logos { main, mobile, footer, favicon } (image refs)
│   ├── logoAlt (string)
│   ├── siteTitle (string)
│   └── tagline (string)
├── menus
│   └── items[] (universalMenu — array of { label, url, showIn })
├── header
│   ├── logo (image), logoAlt, title
│   ├── menuItems (legacy string URLs)
│   ├── headerCta (object: label, url)
│   ├── showSocials (enum: show/hide)
│   └── widthMode
├── mobileMenu
│   ├── menuItems (override)
│   ├── showSocials
│   └── footerText
├── footer
│   ├── description (text)
│   ├── col2Heading, col3Heading, col4Heading (strings)
│   └── copyrightText (string)
├── socials
│   └── links[] (socialLinkEntry: platform, url, label, hideOn)
├── layoutSettings
│   ├── containerMaxWidth (dimension)
│   └── containerPaddingInline (dimension)
├── theme
│   ├── primaryColor, secondaryColor, accentColor (color)
│   ├── themeColor (color)
│   ├── containerWidth (string)
│   └── darkModeDefault (boolean | 'system' | 'light' | 'dark')
└── seo (seoAeo)
```

#### `page` (Document — the primary page builder)

```
page
├── title (string, required)
├── slug (slug, required)
├── excerpt (text)
├── sections[] (array of section types)
│   ├── contentBoxSection (primary content block)
│   ├── contentSetSection (stats or marquee)
│   └── richTextSection (body text)
├── customColors (boolean)
├── colorMode (enum: simple/gradient/image)
├── customColorScheme { bodyText, headings, buttons, accent, background }
├── customGradient { from, to, direction, angle }
├── customBackgroundImage (image)
└── seo (seoAeo)
```

#### `service` (Document)

```
service
├── title, slug, icon (string)
├── shortDescription, description (Portable Text)
├── features[] (array of strings)
├── deliverables[] (array of strings)
├── bestFor, timeframe (strings)
├── order (number)
├── relatedPortfolio[] → portfolio (references)
├── relatedTestimonials[] → testimonial (references)
└── seo
```

#### `portfolio` (Document)

```
portfolio
├── title, slug, category
├── thumbnail (image), gallery[] (images)
├── shortResult, year, client, role, industry
├── order, tags[]
├── projectSummary, description (Portable Text)
├── keyPoints[], metrics[] (arrays)
├── relatedServices[] → service (references)
└── seo
```

#### `caseStudy` (Document)

```
caseStudy
├── title, slug, client, industry, year, role
├── scope, duration, tools[]
├── summary, challenge, approach
├── process[], outputs[], results[], impact, lessons
├── heroImage, visuals[]
├── relatedPortfolio[] → portfolio (references)
└── seo
```

#### `testimonial` (Document)

```
testimonial
├── quote, authorName, authorRole
├── rating (1-5), featured (boolean)
├── order, authorAvatar (image)
├── relatedService → service (ref)
└── relatedPortfolio → portfolio (ref)
```

#### `blogPost` (Document)

```
blogPost
├── title, slug, excerpt
├── author, publishedAt, tags[]
├── content (Portable Text)
└── seo
```

#### `contentSet` (Document — reusable stats/marquee collections)

```
contentSet
├── title
├── setType (enum: stats | marquee)
├── metrics[] (for stats: name, value, description, note)
└── marqueeItems[] (for marquee: name, note)
```

### 7.2 Section Object Types

#### `contentBoxSection`

The most complex section type. Acts as a **multi-modal content block** that can render:
- A **contact form** (when `sectionId === 'contact'`)
- A **Cal.com booking widget** (when `sectionId === 'booking'`)
- **Dynamic content listing** (services, portfolio, testimonials, case studies, blog posts)
- **Custom content** (Portable Text with optional image)
- **Hero sections** (when `sectionId === 'hero'`)
- **CTA sections** (with gradient backgrounds)

```
contentBoxSection
├── sectionId (string — drives rendering logic)
├── visible (boolean)
├── sectionHeaderFields { eyebrow, title, tagline, headerLink }
├── contentMode (enum: dynamic | custom)
├── dynamicContentType (enum: service/portfolio/caseStudy/testimonial/blogPost)
├── customContent (Portable Text array)
├── buttons[] (array of { label, url, style, openInNewTab })
├── image (with hotspot)
├── blockStyleFields (spacing, width, colors, gradient, glass)
```

#### `contentSetSection`

Renders either a **stats row** (numbered metrics display) or a **marquee ticker** (infinite scroll animation).

```
contentSetSection
├── sectionId, visible
├── displayType (enum: stats | marquee)
├── statsSet → contentSet (reference)
├── marqueeSet → contentSet (reference)
├── speed (for marquee), skewY, skewX, height
├── glass, glassBlur
└── blockStyleFields
```

#### `richTextSection`

A minimal section wrapping a Portable Text body.

```
richTextSection
├── sectionId, visible
├── body (Portable Text)
└── blockStyleFields
```

### 7.3 Reusable Fields

The `lib/fields/` directory contains 12 reusable field definition files:

| File | Purpose |
|------|---------|
| `blockStyleFields.ts` | Spacing, width, colors, gradient, image, glass effect fields |
| `sectionHeaderFields.ts` | Eyebrow, title, tagline, header link |
| `colorField.ts` | Color input with hex string fallback |
| `dimensionFields.ts` | Value + unit pairs (px/rem/em/%) |
| `featuredField.ts` | Featured toggle with conditional badge |
| `fieldLayout.ts` | Column layouts and field arrangement |
| `iconPicker.ts` | Service icon selector |
| `menuItem.ts` | Legacy menu item field |
| `universalMenu.ts` | Menu item with showIn placement toggles |
| `seoAeo.ts` | Title, description, OG image, noIndex |
| `socialLink.ts` | Platform, URL, label, hideOn per area |
| `arrayDialogOptions.ts` | Modal dialog configuration for array inputs |

---

## 8. CSS Architecture & Design System

### 8.1 Strategy

The project uses **pure CSS** with **CSS Modules** for scoping. No Tailwind, no styled-components, no CSS-in-JS.

```
global.css  (entry point — 9 lines)
├── @import './tokens.css'     (design tokens: 172 lines)
├── @import './base.css'       (reset, fonts, typography: 208 lines)
├── @import './layout.css'     (container, grid, sections: ~600 lines)
└── @import './pages.css'      (cards, portfolio, CTAs: ~800 lines)

CSS Modules (14 files, ~50-200 lines each)
├── Button.module.css, Badge.module.css, Card.module.css, Input.module.css
├── Tag.module.css, LinkChip.module.css, SectionHeader.module.css
├── Header.module.css, MobileNav.module.css, Footer.module.css
├── SocialLinks.module.css, ThemeToggle.module.css, BackToTop.module.css
└── ServiceBadge.module.css
```

### 8.2 Design Token System (`tokens.css`)

The token system uses CSS custom properties exclusively. Key categories:

**Color tokens** — Light and dark variants:
```css
:root {
  --color-bg: #ffffff;
  --color-text: #0f172a;
  --color-bg-dark: #060912;
  --color-text-dark: #f8fafc;
  --gc: #4f46e5;         /* Global color (indigo) */
  --gc-alt: #0cef98;     /* Global color alt (teal) */
  --dograd: linear-gradient(var(--dodir, 155deg), var(--gc) 31%, var(--gc-alt));
}
```

**Typography:**
- `--do-font: 'Ancizar Sans', system-ui, ...` — Body font (variable, 100-900 weight)
- `--alt-font: 'Merriweather', ui-serif, ...` — Heading/display font
- Responsive type scale via `clamp()` in `base.css`

**Spacing (4px grid):**
```css
--space-1: 0.25rem; ... --space-32: 8rem;
```

**Container system:**
```css
--site-w: 72rem;       /* Max content width */
--edge: clamp(1.5rem, 5vw, 3rem);  /* Responsive edge padding */
```

**Shadows (6 levels: xs → xl)** with dark theme variants through CSS variable swapping.

**Glass morphism** (dark mode only):
```css
--glass-bg: rgba(12, 18, 32, 0.72);
--glass-border: rgba(148, 163, 184, 0.12);
```

### 8.3 Theme Engine

The `[data-theme='dark']` attribute on `<html>` drives theme switching. The dark mode token swap happens in `base.css`:

```css
[data-theme='dark'] {
  --color-bg: var(--color-bg-dark);
  --color-text: var(--color-text-dark);
  --gc: var(--gc-dark);
  /* ... all other tokens swap to dark variants */
}
```

**Dynamic colors from Sanity** are applied via inline `style` attribute on `<html>`:

```ts
// lib/theme.ts
export function themeStyle(theme?: SanityTheme): string | undefined {
  const vars: Record<string, string> = {}
  const primary = resolveColor(theme?.primaryColor)
  if (primary) vars['--color-primary'] = primary
  // ... secondary, accent
  return Object.entries(vars).map(([n, v]) => `${n}: ${v}`).join('; ')
}
```

### 8.4 Section Surface System

The `lib/surface.ts` module implements a **luminance-based surface classifier**:

```ts
export function colorLuminance(color: string): number {
  // Converts hex → sRGB → relative luminance using WCAG formula
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl
}

export function isDarkBackground(color): boolean {
  return colorLuminance(hex) < 0.45  // WCAG threshold
}
```

When a section has a dark background (either from Sanity color data or by preset), the `section-surface-dark` class is applied, which inverts text colors to ensure readability regardless of the site's active theme.

### 8.5 Section Meta Analysis

The `lib/sectionStyle.ts` module implements a **section classifier** that analyzes `sectionId` strings to determine rendering behavior:

```ts
export function resolveSectionMeta(section) {
  const sectionId = section.sectionId || ''
  const isHomeHero = sectionId === 'hero'
  const isCta = sectionId === 'cta' || sectionId.endsWith('-cta')
  const isContact = sectionId === 'contact' || sectionId === 'contact-form'
  const isBooking = sectionId === 'booking' || sectionId === 'contact-booking'
  const isStats = sectionId === 'stats'
  // ... more classifiers
  return { sectionId, isHomeHero, isCta, isContact, isBooking, isStats, isDark, ... }
}
```

This system drives conditional rendering in `ContentBoxSection.astro` — for example, if `meta.isContact` is true, the section renders a `<ContactForm>` instead of the standard layout.

---

## 9. Component Tree & Rendering Pipeline

### 9.1 Full Component Hierarchy

```
Layout.astro
├── <html data-theme={initialScheme} style={htmlThemeStyle}>
│   ├── <head>
│   │   ├── preload font (Ancizar Sans woff2)
│   │   ├── inline script: localStorage theme restore (anti-FOUC)
│   │   ├── meta (charset, viewport, OG, Twitter, canonical)
│   │   └── Turnstile script (conditional — only on pages with contact forms)
│   └── <body>
│       ├── Header.astro
│       │   ├── Mobile toggle button (data-mobile-menu-toggle)
│       │   ├── Logo (image or text fallback)
│       │   ├── Desktop nav (menuItems.map)
│       │   ├── SocialLinks (header variant, conditional)
│       │   ├── Button (CTA, conditional)
│       │   └── ThemeToggle (with inline script)
│       ├── MobileNav.astro (conditional — only if mobileMenuItems exist)
│       │   ├── Backdrop (click-to-close)
│       │   ├── Nav links (grid 2-col)
│       │   ├── SocialLinks (menu variant)
│       │   └── Footer text (optional)
│       ├── <slot />  ← Page content injected by route
│       │   │
│       │   ├── CmsPage.astro (for CMS-driven pages)
│       │   │   ├── Parallel fetches: page + 5 collections
│       │   │   └── PageSections.astro
│       │   │       ├── ContentBoxSection.astro (switch on sectionId)
│       │   │       │   ├── ContactForm.astro (if contact)
│       │   │       │   │   ├── Button.astro (submit)
│       │   │       │   │   └── inline <script> (form handler)
│       │   │       │   ├── BookingBlock.astro (if booking, Cal.com link)
│       │   │       │   ├── ServiceBadge.astro (optional badge icon)
│       │   │       │   ├── PortableText.astro (custom content mode)
│       │   │       │   └── DynamicContent.astro (dynamic mode)
│       │   │       │       ├── Service listing cards
│       │   │       │       ├── Portfolio cards (with accent colors)
│       │   │       │       ├── Testimonial cards (with star ratings)
│       │   │       │       ├── Case study cards
│       │   │       │       └── Blog post cards
│       │   │       ├── ContentSetSection.astro
│       │   │       │   ├── Stats row (metrics count-up display)
│       │   │       │   └── Marquee ticker (infinite scroll via rAF + duplicate items)
│       │   │       └── RichTextSection.astro
│       │   │           └── PortableText.astro
│       │   │
│       │   ├── Service Detail (services/[slug].astro)
│       │   │   ├── Breadcrumb nav
│       │   │   ├── Aside (sticky, icon + meta)
│       │   │   ├── Main (PortableText, features, deliverables, info strips)
│       │   │   └── Detail CTA (booking + contact buttons)
│       │   │
│       │   ├── Portfolio Detail (portfolio/[slug].astro)
│       │   │   ├── Gallery thumbnails
│       │   │   ├── Project summary + metrics
│       │   │   └── Related services links
│       │   │
│       │   ├── Case Study Detail (case-studies/[slug].astro)
│       │   │   ├── Challenge → Approach → Process → Results → Impact → Lessons
│       │   │   ├── Timeline visual layout
│       │   │   └── Related portfolio items
│       │   │
│       │   ├── 404.astro (error page with "Back to Home" button)
│       │   │
│       │   └── sitemap.xml.ts (API route)
│       │
│       ├── Footer.astro
│       │   ├── Brand section (logo, description, SocialLinks)
│       │   ├── Menu columns (col2/col3/col4 from CMS)
│       │   └── Copyright row + footer nav
│       └── BackToTop.astro (scroll listener + smooth scroll)
```

### 9.2 ContentBoxSection Routing Logic

The most sophisticated component. Its rendering is driven entirely by `sectionId`:

```
sectionId === 'contact' / 'contact-form'
  └── Render <ContactForm>

sectionId === 'booking' / 'contact-booking'
  └── Render <BookingBlock>

Any other sectionId
  ├── Display badge, eyebrow, title, tagline (optional)
  ├── Image (left or right, configurable width)
  ├── Content mode === 'custom'
  │   ├── Render <PortableText> with customContent
  │   └── Render buttons array
  ├── Content mode === 'dynamic'
  │   └── Render <DynamicContent> with type (service/portfolio/etc.)
  └── Optional header link (e.g., "View all →")
```

### 9.3 DynamicContent Routing

The `<DynamicContent>` component handles 5 content types via string matching:

```
type === 'service'     → Listing grid with ServiceBadge + features + link
type === 'portfolio'   → Card grid with portfolioAccent color coding
type === 'testimonial' → Card grid with quote, avatar, star rating
type === 'caseStudy'   → Listing cards with hero image + summary
type === 'blogPost'    → Listing cards with date + excerpt + tags
```

### 9.4 Portable Text Renderer

**File:** `components/PortableText.astro`

A custom lightweight Portable Text → HTML renderer (61 lines). It recursively processes Sanity's block content format:

```ts
function renderMarks(text, marks, markDefs) → surrounds text with <strong>, <em>, <a> tags
function renderBlock(block) → maps style to <h2>, <h3>, <h4>, <blockquote>, <p>
function renderBlocks(blocks) → filters block type, joins output
```

Output is injected via Astro's `set:html` directive. This avoids any runtime JS dependency for rendering rich text.

---

## 10. Routing System

### 10.1 Route Table

| Route | File | Strategy | Description |
|-------|------|----------|-------------|
| `/` | `pages/index.astro` | SSR | Homepage via `CmsPage slug="home"` |
| `/[slug]` | `pages/[slug].astro` | SSR | CMS page catch-all with redirect map |
| `/404` | `pages/404.astro` | SSR | Not found page |
| `/services` | `pages/services/index.astro` | SSR | Services listing via `CmsPage slug="services"` |
| `/services/[slug]` | `pages/services/[slug].astro` | **SSG** | Service detail with `getStaticPaths()` |
| `/portfolio` | `pages/portfolio/index.astro` | SSR | Portfolio listing via `CmsPage slug="portfolio"` |
| `/portfolio/[slug]` | `pages/portfolio/[slug].astro` | **SSG** | Portfolio detail with `getStaticPaths()` |
| `/case-studies/[slug]` | `pages/case-studies/[slug].astro` | **SSG** | Case study detail with `getStaticPaths()` |
| `/sitemap.xml` | `pages/sitemap.xml.ts` | SSR | Dynamic XML sitemap |
| `/api/contact` | `pages/api/contact.ts` | SSR | POST endpoint (Turnstile + Resend) |

### 10.2 Hybrid SSR/SSG Strategy

The project uses **Astro's hybrid rendering**:
- **CMS pages** (home, services, portfolio, profile, contact, booking) use **SSR** — they fetch fresh data from Sanity on every request, allowing CMS content to update instantly without rebuilding
- **Detail pages** (services/[slug], portfolio/[slug], case-studies/[slug]) use **SSG** with `getStaticPaths()` — they pre-render at build time, yielding static HTML that loads instantly

### 10.3 Slug Redirect Map

In `pages/[slug].astro`:

```ts
const SLUG_REDIRECTS = {
  home: '/',
  about: '/profile',
  work: '/portfolio',
}
if (SLUG_REDIRECTS[slug]) { return Astro.redirect(SLUG_REDIRECTS[slug]) }
```

### 10.4 Detail Page SSG Pattern

```astro
---
// Detail pages use getStaticPaths for build-time pre-rendering
export async function getStaticPaths() {
  const services = await getAllServices()
  return services?.map(s => ({
    params: { slug: s.slug?.current },
    props: { service: s },
  })) || []
}

const { slug } = Astro.params
const service = Astro.props.service || await getServiceBySlug(slug)
if (!service) return Astro.redirect('/404')
---
```

The `Astro.props.service` pattern ensures that during SSG, the data from `getStaticPaths` is used directly, avoiding a redundant API call. At runtime (if a non-pre-rendered slug is requested), it falls back to `getServiceBySlug`.

---

## 11. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER                                  │
│                                                                   │
│  GET /*.css/.js/.png/.woff2  ──► Cloudflare CDN (/_astro/*)     │
│                                    Cache-Control: 1 year, immutable│
│                                                                   │
│  GET / (or /services, /portfolio, /profile, /contact, /booking)  │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────────┐                                         │
│  │  Cloudflare Pages   │  Worker runtime (edge)                  │
│  │  Astro SSR          │                                         │
│  │                     │                                         │
│  │  Layout.astro       │                                         │
│  │  ├── getSiteSettings() ──────► Sanity CDN ────► JSON         │
│  │  │                         ◄────────────────────             │
│  │  │                         GROQ query result                  │
│  │  │                                                            │
│  │  └──→ HTML headers + fonts + theme vars + menus              │
│  │                                                            │
│  │  CmsPage.astro                                                │
│  │  ├── getPageBySlug(slug) ────► Sanity CDN                    │
│  │  ├── getAllServices() ───────► Sanity CDN                    │
│  │  ├── getAllPortfolioItems() ─► Sanity CDN                    │
│  │  ├── getAllTestimonials() ───► Sanity CDN                    │
│  │  ├── getAllCaseStudies() ────► Sanity CDN                    │
│  │  ├── getAllBlogPosts() ──────► Sanity CDN                    │
│  │  │                         (parallel, Promise.all)            │
│  │  │                                                            │
│  │  └──→ PageSections → ContentBox/ContentSet/RichText          │
│  │       └──→ HTML streamed back to client                      │
│  │                                                            │
│  │  POST /api/contact                                            │
│  │  ├── Turnstile verify ────► challenges.cloudflare.com        │
│  │  ├── Resend email ────────► api.resend.com                   │
│  │  └──→ JSON response (200/400/500)                            │
│  │                                                            │
│  └─────────────────────┘                                         │
│                                                                   │
│  POST /api/contact (client-side)                                 │
│  └── FormData ──► fetch() ──► POST /api/contact                 │
│       Turnstile widget auto-injects cf-turnstile-response        │
│                                                                   │
│  Theme toggle (client-side)                                      │
│  └── localStorage('dotani-theme') + system preference listener   │
│       └── setAttribute('data-theme') on <html>                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     SANITY CMS (External)                        │
│                                                                   │
│  Studio (apps/studio) ──── hosted separately                     │
│  ├── Content authors edit via Sanity's hosted UI                 │
│  ├── Schema: siteSettings, page, service, portfolio, caseStudy,  │
│  │          testimonial, blogPost, contentSet                    │
│  └── Data written to Sanity dataset (staging / production)       │
│                                                                   │
│  API (apps/web via @sanity/client)                               │
│  └── GROQ queries with CDN caching                               │
│       └── useCdn: true — reads from Sanity's CDN edge           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 12. Build & Deployment Pipeline

### 12.1 Build Process

**Trigger:** `npm run build` (root) → `scripts/build.mjs`

```js
// scripts/build.mjs
execSync('npm run build --workspace apps/web', { stdio: 'inherit' })
```

This runs `astro build` in the `apps/web` workspace, which:
1. Compiles `.astro` files to HTML/JS
2. Runs `getStaticPaths()` for SSG detail pages
3. Compiles the SSR worker via `@astrojs/cloudflare`
4. Outputs to `apps/web/dist/`

**Build output structure:**
```
apps/web/dist/
├── client/             # Static assets (CSS, JS modules, images, fonts)
│   ├── _astro/         # Hashed asset files
│   └── _headers        # Cache-Control headers for /_astro/*
├── server/             # SSR worker
│   ├── entry.mjs       # Main worker entry point
│   ├── virtual_astro_middleware.mjs  # (no-op)
│   └── chunks/         # Compiled page/component modules
└── _routes.json        # Route configuration
```

**`_routes.json`** configures which paths hit the Worker:

```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": [
    "/favicon.ico",
    "/favicon.svg",
    "/robots.txt",
    "/_astro/*",
    "/images/*"
  ],
  "run_worker_first": true
}
```

After the build, a **prepare script** (`apps/web/scripts/prepare-cloudflare-deploy.mjs`) runs to move `dist/client/*` to the `dist/` root so Cloudflare Pages serves static assets correctly:

```
dist/
├── _astro/      (was dist/client/_astro/)
├── _headers     (was dist/client/_headers)
├── favicon.ico
├── ...static assets
├── server/      (SSR worker)
│   └── entry.mjs
└── _routes.json
```

### 12.2 Deploy Process

**Trigger:** `npm run deploy` (root) → `scripts/deploy.mjs`

```js
execSync(`node "${wranglerBin}" pages deploy "${distDir}" --project-name dotani-net`, {
  stdio: 'inherit', cwd: repoRoot,
})
```

This uses Wrangler 4.x to deploy the `apps/web/dist` directory to Cloudflare Pages project `dotani-net`.

### 12.3 Static Asset Cache Strategy

**`_headers`** file sets long-term caching for hashed assets:

```
/_astro/*
  Cache-Control: public, max-age=31536000, immutable
```

### 12.4 CI/CD Status

**There is no active CI/CD pipeline.** The `.github/workflows/` directory exists but is empty. Deployments are done manually via `npm run deploy` from a local machine. The commit history shows `houston[bot]` made one commit, suggesting Cloudflare's auto-deployment from GitHub was attempted at some point.

---

## 13. DevOps, GitOps & Changelog System

### 13.1 Changelog Script

**File:** `scripts/changelog.mjs` (544 lines)

This is a **custom changelog automation system** that goes beyond a standard CHANGELOG.md:

**Commands:**
| Command | Description |
|---------|-------------|
| `sync` | Auto-detect significant git commits and update changelog |
| `checkpoint "Title"` | Create a manual milestone with git tag |
| `revert <id>` | Show rollback instructions for a checkpoint |
| `list` | List all checkpoints |
| `seed` | Bootstrap changelog from full git history |
| `install-hooks` | Install git hooks for auto-sync |
| `push-tags` | Push checkpoint tags to origin |

**Significance detection algorithm:**

```ts
const SIGNIFICANT_TYPES = new Set(['feat', 'refactor', 'breaking', 'perf', 'docs'])
const THRESHOLDS = { minFiles: 5, minLines: 80 }

function isSignificantCommit(hash, message) {
  // 1. Explicit [changelog] marker → always significant
  // 2. Breaking changes → significant
  // 3. Large diff (≥5 files or ≥80 lines) → significant
  // 4. Conventional commits of feat/refactor/breaking/perf/docs → significant
  // 5. Milestone keywords (Add/Implement/Restructure/Stabilize) → significant
  // 6. Deploy/Build/Route with large diff → infrastructure milestone
  // 7. Everything else → not significant
}
```

**Git tag checkpoint system:**
- Each changelog entry gets a git tag: `checkpoint/2026-06-14-website-v1`
- Rollback is as easy as `git checkout checkpoint/<id>`
- Tags can be pushed to origin for cross-machine recovery

### 13.2 Git Hooks

**`.githooks/post-commit`** — Automatically runs `node scripts/changelog.mjs sync --quiet` after every commit.

**`.githooks/commit-msg`** — Validates conventional commit format and reminds about `[changelog]` markers.

### 13.3 Changelog Manifest

**File:** `changelog/manifest.json`

```json
{
  "version": 1,
  "lastProcessedCommit": "fb6f0ec...",
  "entries": [
    { "id": "2026-06-30-fix-run-worker-first-true", "date": "2026-06-30", ... }
  ]
}
```

This is the source of truth for the changelog system. The markdown `CHANGELOG.md` is generated from it.

---

## 14. Seed Data Pipeline

### 14.1 Seed Source

**File:** `scripts/seed-source.js` (1552 lines)

A comprehensive seed generator that produces **NDJSON** (Newline-Delimited JSON) for Sanity import:

**Seeds created:**
- 1 `siteSettings` document (complete with brand, menus, theme, socials)
- 6 `service` documents (Social Media Management, Personal Branding, Content Strategy, Web Design, Digital Campaigns, Training & Workshops)
- 5 `portfolio` items (various industries)
- 5 `caseStudy` documents
- 5 `testimonial` documents
- 5 `blogPost` documents
- 6 `page` document stubs (sections overridden at import)

### 14.2 Page Sections Seed

**File:** `scripts/seed-pages.mjs`

Defines complete page sections for 6 pages using helper functions:
- `contentBox(sectionId, content, options)` — Creates section definitions
- `contentSet(sectionId, type, options)` — Stats or marquee sections
- `richText(sectionId, options)` — Rich text sections

**Pages seeded:**
1. **Home** — Hero badge + stats + portfolio grid + testimonial + CTA + blog posts
2. **Profile** — Content box + testimonial + CTA
3. **Services** — 6 service section boxes
4. **Portfolio** — Portfolio grid + testimonial + CTA
5. **Contact** — Contact form + booking block + rich text
6. **Booking** — Booking block + contact form

### 14.3 Import Script

**File:** `scripts/import-seed.mjs`

Safety-gated import script:
```js
// Prevents production import without --confirm-production flag
if (dataset === 'production' && !confirmProduction) {
  console.error('To import to production, use: node scripts/import-seed.mjs --confirm-production')
  process.exit(1)
}
```

### 14.4 Verify Script

**File:** `scripts/verify-seed.mjs`

Validates seed import by checking document counts and page slugs against expected values.

### 14.5 WP Malware Recovery Content

**Directory:** `content/wp-malware-recovery/`

Contains a case study about WordPress malware recovery with:
- `PUBLISH.md` — Publish-ready markdown article
- `seed-wp-security-case-study.mjs` — Script to convert the article to Sanity seed data
- `wp-security.ndjson` — Pre-generated NDJSON for import

---

## 15. Developer Tooling & MCP Integration

### 15.1 MCP (Model Context Protocol) Tools

**Directory:** `mcps/`

**Magic MCP** (UI component library):
- `21st_magic_component_builder.json` — Prompt for building UI components
- `21st_magic_component_inspiration.json` — Design inspiration prompts
- `21st_magic_component_refiner.json` — Component refinement prompts
- `logo_search.json` — Logo search tool

**Sanity MCP** (30+ tool configs):
- Content type queries (services, portfolio, case studies, testimonials, blog posts)
- Document operations (create, read, update, delete)
- Schema introspection tools
- GROQ query tools
- Dataset management tools

### 15.2 AI Agent Rules

**Root level:**
- `CLAUDE.md` — Project-level rules for Claude AI assistant
- `.cursorrules` — Rules for Cursor IDE
- `.opencode-resume.json` — State persistence for opencode tool

**`.cursor/rules/` directory:**
- `ui.md` — UI development rules and conventions
- `infra.md` — Infrastructure and deployment rules
- `ai.md` — AI development workflow rules

### 15.3 VS Code Configuration

**`.vscode/extensions.json` — Recommended extensions:**
- Astro language support
- Sanity snippet support
- EditorConfig
- ESLint, Prettier
- Tailwind CSS IntelliSense (even though Tailwind isn't used)

**`.vscode/launch.json` — Debug configurations**

### 15.4 nvm Configuration

**`.nvmrc`:** `22` — Standardizes Node.js version across environments.

---

## 16. Performance Analysis

### 16.1 Bundle Size

| Asset | Size | Notes |
|-------|------|-------|
| Production dependencies | 6 packages | Astro + Cloudflare adapter + Sanity client + GROQ |
| Client JS (total) | <5KB | All inline scripts combined |
| CSS (critical path) | ~50KB | tokens + base + layout + pages (before gzip) |
| Fonts | ~100KB | 2 woff2 font files (variable + static pairs) |

### 16.2 Performance Optimizations

**Already implemented:**
- ✅ **Zero client framework** — no React/Vue hydration overhead
- ✅ **Font optimization** — `font-display: swap`, woff2 format, unicode-range subsetting, preload
- ✅ **CDN caching** — `/_astro/*` assets are immutable, 1-year cache
- ✅ **Image loading** — `loading="lazy"` on all below-fold images, `loading="eager"` on hero
- ✅ **GPU-accelerated animations** — `transform: translate3d()` for marquee, `will-change: transform`
- ✅ **`requestAnimationFrame`** for marquee animation (not `setInterval`)
- ✅ **Passive scroll listeners** for back-to-top visibility
- ✅ **Anti-FOUC theme script** — removes CSS transitions during theme init, forces reflow
- ✅ **CSS custom properties** — dynamic theming without JS-driven style recalc
- ✅ **Reduced motion** — `prefers-reduced-motion` media query respected
- ✅ **SVG icons** — inline, zero HTTP requests for iconography

**Possible improvements:**
- ❌ No `srcset`/`sizes` on responsive images
- ❌ No `content-visibility: auto` for below-fold sections
- ❌ No image optimization pipeline (Sanity's image API could serve optimized sizes)
- ❌ No sitemap `Cache-Control` headers
- ❌ No preconnect to Sanity CDN or Resend API
- ❌ No Service Worker for offline support

### 16.3 SSR Performance Considerations

- **Sanity CDN** — `useCdn: true` means queries are served from cached edge, not directly from the database
- **Parallel fetching** — 6 simultaneous Sanity queries on CMS pages
- **Cloudflare edge** — the Worker runs close to users geographically
- **No database** — zero query latency from a relational DB

---

## 17. Security Audit

| Area | Status | Notes |
|------|--------|-------|
| **Authentication** | ❌ None | No user auth on the frontend |
| **Authorization** | ❌ None | No access control |
| **CSRF Protection** | ❌ None | Turnstile provides bot protection but no CSRF token |
| **CORS Headers** | ⚠️ Not set | Works because same-origin API, but no preflight handling |
| **CSP Headers** | ❌ Not set | No Content-Security-Policy |
| **HSTS** | ❌ Not set | No Strict-Transport-Security |
| **Rate Limiting** | ❌ None | Contact form has Turnstile but no IP-based rate limiting |
| **Input Validation** | ⚠️ Minimal | Type assertions only; email body has potential HTML injection |
| **Secrets Exposure** | ⚠️ `.env` committed | Live secrets present in working directory and dist build output |
| **CAPTCHA** | ✅ Turnstile | On contact form with server-side verification |
| **HTTPS** | ✅ Cloudflare | Provided at edge automatically |
| **SQL Injection** | ✅ N/A | No SQL database |
| **External Links** | ✅ `rel="noopener noreferrer"` | On all `target="_blank"` links |
| **Sanity Access** | ✅ Read-only CDN | Frontend only queries; no mutations |

**Critical finding:** The `.env` file containing live `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, and `CONTACT_TO_EMAIL` is present in the working directory. The built `dist/` output inlines these secrets into the compiled worker bundle.

---

## 18. Accessibility Audit

| Area | Implementation |
|------|---------------|
| **ARIA labels** | `aria-label` on menu toggles, social links, portfolio cards, back-to-top |
| **ARIA states** | `aria-expanded` on mobile toggle, `aria-controls` referencing overlay ID |
| **Semantic HTML** | `<main>`, `<nav>` with `aria-label`, `<header>`, `<footer>`, `<article>`, `<section>` |
| **Headings** | Proper hierarchy: `h1` → `h2` → `h3` → `h4` |
| **Forms** | `<label for="...">` matching `<input id="...">` |
| **Focus management** | `:focus-visible` outline, tabindex on cards, Escape key closes mobile menu |
| **Screen readers** | `aria-live="polite"` on status messages, `role="alert"`, `aria-hidden="true"` on decorative elements |
| **Body scroll lock** | `body.classList.toggle('menu-open')` when mobile nav is open |
| **Reduced motion** | `@media (prefers-reduced-motion: reduce)` disables all animations |
| **Color contrast** | Dark surface detection via WCAG luminance formula |
| **Alt text** | All images have `alt` attributes |
| **Status announcements** | Form submission status scrolls into view with `role="alert"` |
| **Breadcrumb** | Navigational with `aria-hidden="true"` on separators |

---

## 19. Dependency Analysis

### 19.1 Production Dependencies

| Package | Version | Size | Purpose |
|---------|---------|------|---------|
| `astro` | ^6.4.6 | ~5MB | Web framework — SSR, routing, compilation |
| `@astrojs/cloudflare` | ^13.7.0 | ~200KB | Cloudflare Pages adapter |
| `@sanity/client` | ^7.22.1 | ~400KB | GROQ query client |
| `groq` | ^6.0.0 | ~10KB | GROQ template tag |

**Total production: 4 packages** (frontend) + **6 packages** (studio)

### 19.2 Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `wrangler` | ^4.101.0 | Cloudflare deployment CLI |
| `@astrojs/check` | ^0.9.9 | Astro type checking |
| `typescript` | ^6.0.3 | TypeScript compiler |
| `@sanity/eslint-config-studio` | ^6.0.0 | Studio ESLint config |
| `eslint` | ^9.28 | Linter |
| `prettier` | ^3.5 | Formatter |

### 19.3 What's NOT Used (Deliberately)

- **No React/Vue/Svelte** — Zero client framework
- **No Tailwind** — Pure CSS with design tokens
- **No CSS-in-JS** — CSS Modules + global CSS
- **No state management library** — Astro.props + localStorage
- **No database driver** — Sanity is the data layer
- **No ORM** — GROQ queries directly
- **No testing framework** — No unit, integration, or e2e tests
- **No CI/CD orchestrator** — Manual deploys
- **No Docker** — Runs on Cloudflare edge
- **No analytics SDK** — No Google Analytics, Plausible, etc.
- **No cookie consent** — No cookies used
- **No Sentry/APM** — No error tracking or monitoring

---

## 20. Areas for Improvement

### Architectural

1. **CI/CD pipeline** — No automated deployment. The `.github/workflows/` directory is empty. Adding GitHub Actions for `git push → build → deploy` would reduce friction and prevent drift.

2. **Secrets management** — `.env` with live secrets is committed. Should be `.gitignored` and secrets injected via Cloudflare Pages environment variables or GitHub Actions secrets.

3. **No testing** — Zero tests across the entire project. Consider:
   - Unit tests for `lib/` utilities (color, surface, blockStyle)
   - Integration tests for Sanity queries
   - E2E tests for critical user flows (contact form submission)

4. **Monitoring gap** — No error tracking (Sentry), no performance monitoring, no uptime monitoring. Cloudflare dashboard provides request logs but no structured observability.

### Performance

5. **Image optimization** — Sanity's image pipeline (`asset->{url}` in GROQ) doesn't use `w`, `h`, `q`, `fit` parameters. All images are served at original resolution. Add Sanity image URL builder parameters for responsive images.

6. **Preconnect hints** — `<link rel="preconnect" href="https://tmw5kvr6.api.sanity.io">` and `<link rel="preconnect" href="https://api.resend.com">` would reduce connection latency.

7. **Content-Visibility** — `content-visibility: auto` on below-fold sections would reduce initial render cost.

8. **Partial Prerendering** — Some SSR pages (especially the homepage) could benefit from Astro's Partial Prerendering to serve static shell with dynamic content islands.

### Security

9. **Content Security Policy** — No CSP headers. Adding a strict CSP would mitigate XSS risks, especially in the Portable Text renderer which uses `set:html`.

10. **Rate limiting** — The contact API endpoint has no rate limiting. A simple KV-based rate limiter (Cloudflare Workers) would prevent abuse.

11. **HSTS** — No `Strict-Transport-Security` header. Should be set to `max-age=31536000; includeSubDomains`.

### Developer Experience

12. **TypeScript strictness** — Many components use `any` types instead of proper interfaces. Enabling `strict: true` in tsconfig would catch more errors.

13. **Shared type package** — The frontend and studio duplicate type knowledge. A shared `@dotani/types` workspace package would keep schemas in sync.

14. **Sanity schema versioning** — No migration system for Sanity schemas. Changes are applied directly, which can break existing documents.

### Maintainability

15. **CSS file size** — `pages.css` at ~800 lines and `layout.css` at ~600 lines could benefit from splitting into more granular partials.

16. **Component documentation** — No component API documentation. With 35 Astro components, a simple README or Storybook setup would aid onboarding.

17. **Changelog hooks** — Git hooks need `git config core.hooksPath .githooks` to be run. This isn't documented in the project README.

---

*Report generated from deep analysis of the dotani monorepo. All file paths, line counts, and dependencies verified against the actual source tree as of June 30, 2026.*
