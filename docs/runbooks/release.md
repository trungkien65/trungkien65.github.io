# Release Runbook

## Pre-release Checklist

- [ ] `pnpm build` – build succeeds
- [ ] `pnpm biome:check` – no lint errors
- [ ] No `console.log` / `debugger` in code
- [ ] No runtime errors in console (dev + preview)
- [ ] Reasonable bundle size (check output)

## Build

```bash
pnpm build
```

Output: `dist/`

## Preview

```bash
pnpm preview
```

## Deploy

- GitHub Actions: `.github/workflows/deploy.yml`
- See `DEPLOY.md` for detailed deploy instructions.
