---
name: react-architect-skills
description: React and TanStack Router folder structure and feature-module architecture. Use when writing, reviewing, or refactoring React code for structure, naming, colocation, encapsulation, and layer separation. Triggers on React folder structure, naming rules, module boundaries, or architecture decisions.
license: MIT
metadata:
  author: paul-devv
  version: "1.1.0"
---

# React Feature Module Architecture

Guidelines for React feature-module layout, layer separation (Data / Domain / Integration / Presentational), naming, and cross-module boundaries.

## When to Apply

Use this skill when:

- Defining or reviewing React folder structure and module boundaries
- Naming files, folders, or layers (components, containers, pages, hooks, utils)
- Deciding where code belongs (colocation, encapsulation, layer separation)
- Designing pure component props (no redundant/optional params) or cross-module communication

**When to load the full guide:** For tasks that involve **module boundaries**, **layer layout**, **naming conventions**, or **cross-module communication**, read **[AGENTS.md](AGENTS.md)** in full before proceeding.

**Do NOT load AGENTS.md** for single-file renames, style-only changes, or when only fixing a typo or a single component’s logic.

## Quick Reference

| Layer | Folders | Purpose |
|-------|---------|---------|
| Data | `api/`, `stores/` | API hooks, cache keys, stores for cross-component state |
| Domain | `hooks/`, `utils/`, `types/`, `contexts/` | Business logic, pure utils, types, DI |
| Integration | `containers/`, `pages/` | Data + UI wiring, route entry, layout |
| Presentational | `components/` | Pure UI, props-down/events-up, no optional/redundant props |

- **Naming**: kebab-case for files and folders; suffixes like `-page`, `-container`, `-context`, `.types`, `.schema`, `use-*` for hooks.
- **Modules**: Domain-first boundaries (e.g. `user-profile`, `order-processing`); flat structure; direct imports from source files (no barrel `index.ts`); enforce boundaries via ESLint rules.
- **Pure components**: Pass primitives/specific values, not full data shapes; required props only; validate undefined in parent.

Full guide (principles, module structure, layer rules, naming, common module, cross-module communication, testing): **[AGENTS.md](AGENTS.md)**.
