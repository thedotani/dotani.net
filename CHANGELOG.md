# Changelog

All notable changes to the Dotani project are documented here.

Each entry links to a **git checkpoint** you can restore to if something breaks.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## How to use

- **Auto-updates** after significant commits (via git hook) or run `npm run changelog:sync`
- **Manual milestone:** `npm run changelog:checkpoint -- "Your milestone title"`
- **Roll back:** `npm run changelog:revert -- <checkpoint-id>` then follow the instructions
- **Force any commit into the log:** add `[changelog]` to the commit message

## [Unreleased]

### Changed

- **Complete CSS architecture rewrite** — Replaced 2,719-line monolithic `global.css` with 6 focused files: `tokens.css`, `base.css`, `layout.css`, `components.css`, `pages.css`, and thin `global.css` import chain
- **Self-hosted fonts** — Inter + Fraunces downloaded as woff2, eliminating Google Fonts requests and FOIT flicker
- **Dark minimal design system** — Linear/Vercel-inspired aesthetic with CSS custom property tokens for light/dark themes, minimal color accents, clean typography
- **8 UI primitives** — Button, Card, Badge, Input, Tag, LinkChip, SectionHeader, Divider in `components/ui/`
- **Layout component refactor** — Header, Footer, MobileNav, ThemeToggle, SocialLinks extracted to `components/layout/`, Header component created with hamburger toggle + scroll JS
- **Motion system simplified** — Removed Lenis smooth scroll, parallax, scroll progress; kept scroll-reveal (fadeUp), card spotlight, and back-to-top
- **Removed `lenis` dependency** — No longer needed after motion simplification

- Stats section: auto-width metrics with universal `--space-card-gap`, min-width 7rem, no justify-between
- Section header: restructured to `title+gap+tagline+gap+link` single flex flow using universal gap
- Master Card: tag-pill moved after overlay in DOM order + z-index so it stays visible on hover
- CMS section width options: reduced to `Full` and `Half` only; missing/empty defaults to site container width
- Half-width sections: lone half defaults to container width; paired halves render as flex row with universal gap

### Redesign

- Premium futuristic editorial visual system overhaul
- Design tokens: deeper dark backgrounds (#080d19), refined card surfaces, layered shadow system with `--shadow-glow`
- **Card system redesign**: holographic gradient borders, cursor-tracking spotlight, animated accents across all card types
- MasterCard: holographic border on hover, radial spotlight follows cursor, image zoom+brightness+saturate, gradient overlay, animated tag pill reveal, title color transition
- Listing cards: holographic shimmer top accent line, cursor spotlight, deeper dark glass with inset highlights, stronger hover lift (translateY -10px)
- Testimonial cards: floating gradient quote mark with floatQuote animation, holographic top accent, gradient avatar fallback
- Metric cards: conic gradient border glow on hover, enhanced dark mode glass
- Service badge: conic gradient glow ring on hover with borderRotate animation
- Tag pills: gradient background with glow shadow on hover
- Link chips: holographic shimmer sweep on hover
- Detail panels: animated top accent line reveal on hover
- Card spotlight JS: tracks cursor position for interactive radial gradient on all `[data-card-spotlight]` elements
- Typography: stronger display scale (hero 2rem→4rem), `text-wrap: balance` on headings, tighter leading (1.05)
- Spacing: generous section rhythm (`--space-section-gap`), wider container padding, larger card inner spacing
- Hero section: larger viewport height (88vh), cinematic gradient orbs with 32rem glow, slower pulse animation
- Cards: rounded-xl→rounded-1.25rem, layered dark mode gradients with glass blur, premium hover lift (translateY -4px)
- Testimonials: oversized decorative quote mark (5rem), deeper glass blur, refined opacity transitions
- Link chips: glass morphism backdrop-blur(10px→12px), refined hover glow shadows
- Service badges: subtler gradient, refined hover shadow spread
- Listing cards: premium hover scale (1.015), gradient top-line reveal, stronger dark mode glass effect
- Buttons: bolder font-semibold, slower 300ms transitions, tighter active scale
- Block sections: expanded padding (14→28 units), larger gaps between content blocks
- Hero entrance animations: slower stagger (1.2s), deeper blur (10px), more cinematic easing
- Footer: refined border opacity, generous padding, subtle gradient overlay
- Dark mode: richer body background, stronger inset card highlights, refined border opacities
- Motion: unified 300-400ms transitions, `--motion-ease-out` token for future use

## [2026-06-21-initialize-ai-agent-operating-system-claude-curs] — 2026-06-21

> **Checkpoint:** `checkpoint/2026-06-21-initialize-ai-agent-operating-system-claude-curs` · **Commit:** `b4dd7e0` · **Restore:** `git checkout checkpoint/2026-06-21-initialize-ai-agent-operating-system-claude-curs`

### Added

- Initialize AI agent operating system (Claude + Cursor rules + skills)
  - 88 files, 731 lines changed

## [2026-06-20-feat-unified-cms-sections-studio-ux-and-frontend] — 2026-06-20

> **Checkpoint:** `checkpoint/2026-06-20-feat-unified-cms-sections-studio-ux-and-frontend` · **Commit:** `b03e54d` · **Restore:** `git checkout checkpoint/2026-06-20-feat-unified-cms-sections-studio-ux-and-frontend`

### Added

- unified CMS sections, studio UX, and frontend polish
  - _feat: unified CMS sections, studio UX, and frontend polish_
  - 132 files, 21473 lines changed

## [2026-06-19-feat-add-automated-changelog-with-git-checkpoint] — 2026-06-19

> **Checkpoint:** `checkpoint/2026-06-19-feat-add-automated-changelog-with-git-checkpoint` · **Commit:** `85607de` · **Restore:** `git checkout checkpoint/2026-06-19-feat-add-automated-changelog-with-git-checkpoint`

### Added

- add automated changelog with git checkpoint rollback [changelog]
  - _feat: add automated changelog with git checkpoint rollback [changelog]_
  - 6 files, 861 lines changed

## [2026-06-17-fix-monorepo-workspace-configuration] — 2026-06-17

> **Checkpoint:** `checkpoint/2026-06-17-fix-monorepo-workspace-configuration` · **Commit:** `ff6a7d6` · **Restore:** `git checkout checkpoint/2026-06-17-fix-monorepo-workspace-configuration`

### Fixed

- Fix monorepo workspace configuration
  - 2 files, 19865 lines changed

## [2026-06-17-add-tailwind-design-system-layout-typography-and] — 2026-06-17

> **Checkpoint:** `checkpoint/2026-06-17-add-tailwind-design-system-layout-typography-and` · **Commit:** `bb6949d` · **Restore:** `git checkout checkpoint/2026-06-17-add-tailwind-design-system-layout-typography-and`

### Added

- Add Tailwind design system, layout, typography, and Sanity image seeding
  - 29 files, 2065 lines changed

## [2026-06-17-restructure-into-astro-web-and-sanity-studio-mon] — 2026-06-17

> **Checkpoint:** `checkpoint/2026-06-17-restructure-into-astro-web-and-sanity-studio-mon` · **Commit:** `a88930d` · **Restore:** `git checkout checkpoint/2026-06-17-restructure-into-astro-web-and-sanity-studio-mon`

### Added

- Restructure into Astro web and Sanity studio monorepo
  - 52 files, 53 lines changed

## [2026-06-17-deploy-astro-ssr-worker-on-cloudflare-pages-buil] — 2026-06-17

> **Checkpoint:** `checkpoint/2026-06-17-deploy-astro-ssr-worker-on-cloudflare-pages-buil` · **Commit:** `884e98f` · **Restore:** `git checkout checkpoint/2026-06-17-deploy-astro-ssr-worker-on-cloudflare-pages-buil`

### Added

- Deploy Astro SSR worker on Cloudflare Pages builds
  - 11 files, 92 lines changed

## [2026-06-17-save-current-website-state-before-architecture-c] — 2026-06-17

> **Checkpoint:** `checkpoint/2026-06-17-save-current-website-state-before-architecture-c` · **Commit:** `5490780` · **Restore:** `git checkout checkpoint/2026-06-17-save-current-website-state-before-architecture-c`

### Added

- Save current website state before architecture cleanup
  - 28 files, 18764 lines changed

## [2026-06-17-stabilize-astro-sanity-integration-and-productio] — 2026-06-17

> **Checkpoint:** `checkpoint/2026-06-17-stabilize-astro-sanity-integration-and-productio` · **Commit:** `4ae6a51` · **Restore:** `git checkout checkpoint/2026-06-17-stabilize-astro-sanity-integration-and-productio`

### Added

- Stabilize Astro Sanity integration and production readiness
  - 14 files, 50956 lines changed

## [2026-06-17-add-cautious-sanity-seed-pipeline-for-staging-fi] — 2026-06-17

> **Checkpoint:** `checkpoint/2026-06-17-add-cautious-sanity-seed-pipeline-for-staging-fi` · **Commit:** `217aaa2` · **Restore:** `git checkout checkpoint/2026-06-17-add-cautious-sanity-seed-pipeline-for-staging-fi`

### Added

- Add cautious Sanity seed pipeline for staging-first imports
  - 6 files, 1833 lines changed

## [2026-06-17-add-pages-bindings-and-config-download-script] — 2026-06-17

> **Checkpoint:** `checkpoint/2026-06-17-add-pages-bindings-and-config-download-script` · **Commit:** `1d65a06` · **Restore:** `git checkout checkpoint/2026-06-17-add-pages-bindings-and-config-download-script`

### Added

- Add Pages bindings and config download script
  - 3 files, 55 lines changed

## [2026-06-17-add-root-astro-config-for-cloudflare-pages-monor] — 2026-06-17

> **Checkpoint:** `checkpoint/2026-06-17-add-root-astro-config-for-cloudflare-pages-monor` · **Commit:** `0e4614c` · **Restore:** `git checkout checkpoint/2026-06-17-add-root-astro-config-for-cloudflare-pages-monor`

### Added

- Add root Astro config for Cloudflare Pages monorepo builds
  - 1 files, 12 lines changed

## [2026-06-17-add-wrangler-pages-build-output-config-for-monor] — 2026-06-17

> **Checkpoint:** `checkpoint/2026-06-17-add-wrangler-pages-build-output-config-for-monor` · **Commit:** `0c5193d` · **Restore:** `git checkout checkpoint/2026-06-17-add-wrangler-pages-build-output-config-for-monor`

### Added

- Add wrangler Pages build output config for monorepo
  - 1 files, 7 lines changed

## [2026-06-17-build-website-and-integrations] — 2026-06-17

> **Checkpoint:** `checkpoint/2026-06-17-build-website-and-integrations` · **Commit:** `03986da` · **Restore:** `git checkout checkpoint/2026-06-17-build-website-and-integrations`

### Added

- Build website and integrations
  - 24 files, 6193 lines changed

## [2026-06-15-initial-commit-from-astro] — 2026-06-15

> **Checkpoint:** `checkpoint/2026-06-15-initial-commit-from-astro` · **Commit:** `0422674` · **Restore:** `git checkout checkpoint/2026-06-15-initial-commit-from-astro`

### Added

- "Initial commit from Astro"
  - 11 files, 4983 lines changed

