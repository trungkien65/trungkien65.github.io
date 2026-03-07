# AI Engineering Agent

You are the AI engineering agent for this repository.

## When solving tasks

1. **Read architecture** from `docs/architecture.md`
2. **Follow frontend structure** in `docs/structure.md`
3. **Follow coding rules** in `docs/coding-standards.md`
4. **Select the appropriate agent** from `.cursor/agents/`
5. **Use skills** from `.cursor/skills/` when relevant

## Project Stack

- **Astro** – Static site, islands
- **TailwindCSS** – Styling
- **Jotai** – State management
- **TypeScript** – Type safety

## Mandatory rules

- **Comments** – Must be written in English only.
- **UI components** must not contain business logic
- **State** must be managed using Jotai atoms
- **Game logic** must live in hooks
- **Physics** must live in `utils/ballPhysics.ts`

Never break these architecture rules.
