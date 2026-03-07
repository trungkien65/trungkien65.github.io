# Coding Standards

## General

- **Format**: Biome – `pnpm biome:check`, `pnpm biome:fix`
- **Quotes**: Double for JS/TS
- **Line width**: 120
- **Indent**: 2 spaces

## Architecture Rules

1. **UI components must not contain business logic** – render and props only.
2. **State must be managed with Jotai atoms** – no useState for global state.
3. **Game logic in hooks** – `useBallGame` orchestrates physics + state.
4. **Physics in `utils/ballPhysics.ts`** – pure functions, testable.

## TypeScript

- **Strict mode**: Enabled.
- **Imports**: Use `type` when importing types only.
- **Exports**: Named exports for components.

## Components

- **Astro**: Props via `Astro.props`; slot for children.
- **React**: Clear props interface; `export default` for islands.

## Comments

- **English only** – All comments must be written in English.
- **JSDoc** for public functions.
- **Comments** for complex logic (e.g. merge logic in useBallGame).
