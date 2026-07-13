# Coding Standards

## General

- **Format**: Biome – `pnpm biome:check`, `pnpm biome:fix`
- **Quotes**: Double for JS/TS
- **Line width**: 120
- **Indent**: 2 spaces

## Architecture Rules

1. **UI components must not contain business logic** – render and props only.
2. **No global state library is installed** – React islands use local `useState`/`useReducer`;
   don't reach for prop drilling across unrelated islands, extract shared logic into `src/lib/`
   instead.
3. **Prefer Astro + vanilla scripts** – only add a React island (`.tsx` + `client:*`) when a
   component genuinely needs client-side state/effects.
4. **Barrel imports for `components/ui/`, `components/layout/`, `layouts/`** – always import
   from the folder's `index.ts`, never a direct file path. Enforced by `biome.json`'s
   `linter.rules.nursery.noRestrictedImports` (path-list, not a glob — add new files in these
   folders to that list, and to the folder's `index.ts`, when you create them).

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
- **Comments** for complex logic (e.g. token refresh flow in `lib/auth/guard.ts`).
