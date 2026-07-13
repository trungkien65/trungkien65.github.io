---
name: code-review
description: Checklist for reviewing code changes in this Astro + Tailwind (+ optional React islands) project. Use when reviewing a diff or PR in this repo.
---

# Code Review Skill

Checklist when reviewing code in this Astro + Tailwind project (`@astrojs/react` is
installed for optional React islands; no global state library is used).

## Security

- [ ] No XSS – sanitize user input, avoid `set:html` / `dangerouslySetInnerHTML` arbitrarily
- [ ] No sensitive data exposure – API keys, tokens
- [ ] No injection – validate input

## Performance

- [ ] No unnecessary re-renders in React islands – memo, useCallback when needed
- [ ] No bundle bloat – lazy load islands if component is heavy
- [ ] No blocking main thread – long-running work uses requestAnimationFrame or a worker

## Tailwind Usage

- [ ] No duplicate classes – extract component if repeated
- [ ] No inline style when Tailwind can be used
- [ ] Responsive correct – mobile-first

## Astro Island Misuse

- [ ] No `client:load` for static content – use only when interactivity is needed
- [ ] No full page hydration – small, targeted islands
- [ ] `client:visible` / `client:idle` when possible instead of `client:load`
- [ ] Prefer plain Astro + a vanilla `<script>` over a React island when no component
      state/effects are needed

## Readability

- [ ] Clear naming – variables, functions, components
- [ ] Reasonable structure – logic separated from UI
- [ ] Comments for complex logic

## Barrel Imports

- [ ] `components/ui/*`, `components/layout/*`, `layouts/*` – import from the folder's
      `index.ts` barrel, never a direct file path (enforced by `biome.json`'s
      `noRestrictedImports`; new files added to these folders must be added to that list too)
