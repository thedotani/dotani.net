# AI COST CONTROL & EFFICIENCY ENGINE

## Purpose
Minimise token usage, file reads, and redundant operations while maintaining correctness and speed.

---

## Activation Triggers
- Any coding task
- Debugging
- Refactoring
- Multi-file operations

---

## File Access Rules

- Open only required files
- Never scan entire project unless necessary
- Avoid repeated reads of same files
- Do not re-analyse unchanged code

---

## Change Discipline

- Single-line fix → change only that line
- Small feature → only related files
- Large feature → break into phases
- Never rewrite full files for small edits

---

## Cost Awareness Rules

- Every request is resource-limited
- Avoid duplicate reasoning cycles
- Avoid repeated explanations
- Avoid unnecessary search or analysis loops

---

## Output Rules

- Be concise
- No filler explanations
- No redundant code dumps
- Provide only required patch or solution

---

## Safety Rules

- Ask before expensive operations (refactors, rewrites)
- Prefer incremental improvement over full redesign
- Preserve working code unless explicitly told otherwise