# Development Runbook

## Setup

```bash
pnpm install
pnpm dev
```

## Run dev server

- `pnpm dev` – Astro dev server
- Default: `http://localhost:4321`

## Lint & Format

```bash
pnpm biome:check   # Check
pnpm biome:fix     # Auto-fix
```

## Add new component

1. **Astro UI**: Create `src/components/ui/ComponentName.astro`, export in `index.ts`
2. **React island**: Create `src/components/.../Component.tsx`, wrap in `.astro` with `client:load`
3. **Atom**: Add `src/atoms/...` if new state is needed

## Add page

- Create file in `src/pages/` – routing is automatic by file path.
