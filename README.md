# AI Skills

Reusable capabilities for AI coding agents. This repository provides procedural knowledge (skills) that help agents accomplish React, and frontend tasks more effectively.

## What are skills?

Skills are reusable capabilities for AI agents. They provide procedural knowledge that helps agents accomplish specific tasks more effectively—think of them as plugins or extensions that enhance what your AI agent can do. Learn more in the [Skills documentation](https://skills.sh/docs) and [FAQ](https://skills.sh/docs/faq).

## Included skills

| Skill | Description |
|-------|-------------|
| **vercel-react-best-practices** | React performance optimization guidelines from Vercel Engineering. 40+ rules across async, bundle, client data, re-renders, rendering, JS performance, and advanced patterns. |
| **react-skills** | React and TanStack Router folder structure guidelines. Feature-module architecture, colocation, encapsulation, and separation of concerns. |

## Installation

### Via Skills CLI (when published)

If this repo is published as a skill on the skills ecosystem:

```bash
npx skills add <owner>/skills
```

Replace `<owner>` with the GitHub org or username. This installs the skill and makes it available to your AI agent.

### Manual setup (Cursor)

Copy or link the skill into your Cursor skills directory:

- **Cursor**: `.cursor/skills/` — copy the desired skill folder (e.g. `vercel-react-best-practices`) so that `SKILL.md` and `rules/` (if any) are present.
- **Agents**: `.agents/skills/` — same structure for agent runtimes that read from `.agents/skills/`.

## Compatibility

Skills in this repo are designed to work with AI coding agents that support skill definitions, including:

- **Cursor**
- Claude Code
- Windsurf
- Others that read `SKILL.md` and rule files

Check each skill’s `SKILL.md` for triggers and when to apply it.

## Repository structure

```
skills/
├── README.md           # This file
├── AGENTS.md           # Guidance for agents working in this repo
├── .cursor/skills/     # Cursor skill bundles (SKILL.md + rules)
│   └── vercel-react-best-practices/
│       ├── SKILL.md
│       └── rules/
└── .agents/skills/     # Agent skill bundles (same layout)
```

Each skill folder contains:

- **SKILL.md** — Skill definition (name, description, when to use, quick reference).
- **rules/** — Optional markdown rule files referenced by the skill.
- **AGENTS.md** — Optional full compiled guide for that skill.

## How to use

1. Install the skill (CLI or manual copy as above).
2. In your agent or IDE, refer to the skill by name when working on relevant tasks (e.g. React performance, folder structure).
3. For **vercel-react-best-practices**, use the rule prefixes (`async-`, `bundle-`, `client-`, `rerender-`, `rendering-`, `js-`, `advanced-`) when asking the agent to apply or review specific patterns.

## Telemetry

If you install via `npx skills add`, the [skills CLI](https://skills.sh/docs) may collect anonymous telemetry (e.g. aggregate install counts for the leaderboard). No personal or usage data is collected. You can opt out; see the [CLI documentation](https://skills.sh/docs/faq#can-i-opt-out-of-telemetry) for options.

## Reporting issues

Skills are maintained in this repository. Please open an issue or pull request on this repo for bugs, suggestions, or contributions.

## License

See each skill’s `SKILL.md` for its license (e.g. MIT).
