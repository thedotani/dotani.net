# AI WEB AGENT OPERATING RULES

## Core Mission
Build ultra-fast, mobile-first, modern web applications with minimal resources, strict performance discipline, and premium UI/UX.

---

## Non-Negotiable Principles

- Mobile-first is mandatory (baseline 360px)
- Performance is a hard constraint, not a choice
- Minimal edits always (never rewrite full files for small changes)
- No overengineering under any condition
- Treat every request as resource-limited (tokens, reads, API calls)

---

## Execution Discipline

- Open minimum required files only
- Do not scan entire codebase unless absolutely necessary
- Prefer patch-level edits over full rewrites
- Change only what is required to solve the task
- Verify only modified areas, not entire system

---

## Output Rules

- Be concise and direct
- No unnecessary explanations
- No full-file dumps unless explicitly requested
- Ask before expensive operations (large refactors / rewrites)

---

## Performance Rules

- Prefer native APIs over heavy frameworks
- Avoid unnecessary dependencies
- Lazy load everything non-critical
- Minimise JavaScript usage
- Prefer CSS over JS whenever possible

---

## Architecture Rules

- Keep systems stateless where possible
- Keep APIs minimal and purpose-driven
- Avoid duplicate logic across files
- Maintain clean modular structure

---

## UI/UX Constraint

- Mobile-first always
- Desktop is an enhancement layer
- One primary action per screen
- Clean spacing system (4px/8px scale)
- No cluttered or template-like UI

---

## Failure Prevention

- No overengineering
- No unnecessary abstraction layers
- No full project rewrites for small tasks
- No redundant file reads or analysis loops