---
name: refactor
description: Checklist for refactoring components, hooks, and utilities in this Astro + Tailwind project. Use when simplifying or restructuring existing code in this repo.
---

# Refactor Skill

Checklist when refactoring code in the project.

## Simplify Components

- [ ] Component too long (>150 lines) → split
- [ ] Component does too much → single responsibility
- [ ] Too many props → group into object or context

## Move Logic to Hooks (React islands only)

- [ ] Business logic in a React component → extract `useXxx` hook
- [ ] Complex `useEffect` → move to hook
- [ ] Related state + effect → custom hook

## Keep State Local

- [ ] No global state library is installed – prefer local `useState`/`useReducer` in the
      island that owns the state
- [ ] Deep prop drilling across unrelated islands → reconsider component boundaries
      instead of reaching for a new state library
- [ ] Cross-page/persisted state (auth, theme) → plain module in `src/lib/`, not component state

## Extract Utilities

- [ ] Pure logic → `src/lib/` or a feature-local `utils/`
- [ ] Function used in multiple places → extract
- [ ] Constants → separate file or with utils

## DRY

- [ ] Code repeated 2+ times → extract
- [ ] Similar components → composition or props
- [ ] Magic numbers → named constants
