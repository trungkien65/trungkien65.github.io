# Release Skill

Checklist before release / deploy.

## Build

- [ ] `pnpm build` – succeeds, no errors
- [ ] Output `dist/` – check structure
- [ ] Bundle size – no sudden increase

## Lint

- [ ] `pnpm biome:check` – pass
- [ ] `pnpm biome:fix` – run before commit

## Runtime

- [ ] No `console.log` / `console.debug` in production code
- [ ] No `debugger` statements
- [ ] No errors in browser console (dev + preview)

## Optimized Bundle

- [ ] Islands load only when needed – `client:load` / `client:visible`
- [ ] No unused imports – tree-shaking
- [ ] Assets optimized – images, fonts

## Documentation

- [ ] README updated if changes
- [ ] CHANGELOG / version bump if needed
