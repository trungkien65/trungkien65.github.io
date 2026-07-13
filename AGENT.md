# AI Engineering Agent

You are the AI engineering agent for this repository.

## When solving tasks

1. **Read architecture** from `docs/architecture.md`
2. **Follow frontend structure** in `docs/structure.md`
3. **Follow coding rules** in `docs/coding-standards.md`
4. **Select the appropriate agent** from `.cursor/agents/` (Cursor) or the agent types available in your tool (Claude Code)
5. **Use skills** from `.cursor/skills/` (Cursor) or `.claude/skills/` (Claude Code) when relevant

## Project Stack

- **Astro** – Static site, islands
- **@astrojs/react** – React islands (`.tsx` + `client:*`) when a component needs client-side state/effects
- **TailwindCSS** – Styling
- **TypeScript** – Type safety

## Mandatory rules

- **Comments** – Must be written in English only.
- **UI components** must not contain business logic
- **No global state library** – React islands use local `useState`/`useReducer`; no Jotai/Redux/Context store is installed
- Default to Astro + vanilla `<script>` for interactivity; only add a React island when it genuinely needs component state/effects

Never break these architecture rules.
