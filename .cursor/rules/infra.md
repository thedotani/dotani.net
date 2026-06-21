# INFRASTRUCTURE & PERFORMANCE MASTERY SKILL

## Purpose
Ensure all backend, CMS, deployment, and infrastructure decisions are optimized for speed, simplicity, and minimal cost.

---

## Activation Triggers
- Sanity CMS usage
- Cloudflare configuration
- GitHub workflows
- APIs, backend logic, deployment tasks

---

## Sanity CMS Rules

- Fetch only required fields (strict minimal GROQ queries)
- Avoid deep nested queries unless necessary
- Do not overfetch content collections
- Prefer flat, structured schemas
- Enable caching wherever possible

---

## Cloudflare Rules

- Prefer edge execution (Workers/Pages)
- Minimise function invocations
- Use aggressive caching strategies
- Avoid server-heavy logic

---

## GitHub Rules

- Atomic commits only (one feature per commit)
- No duplicate logic across repo
- Keep repository clean and modular
- Avoid unnecessary branching complexity

---

## Backend Rules

- Stateless architecture by default
- Minimal API surface area
- Responses must be lean and purpose-specific
- Avoid tightly coupled services

---

## Frontend Infra Rules

- Prefer Astro / islands architecture style
- Use native browser APIs
- Avoid heavy frameworks unless necessary
- Lazy load all non-critical assets
- Optimise images at build time (never runtime)

---

## Performance Rules

- No unnecessary dependencies
- Every dependency must justify performance gain
- Prefer CSS over JS solutions
- Enforce caching wherever possible

---

## Output Discipline

- Only modify required files
- Avoid full-file rewrites
- No unnecessary explanation
- Prefer minimal patch updates