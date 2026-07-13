---
name: testing
description: Checklist for writing tests in this Astro project (auth, learn flashcards/quiz, dev-tools, React islands). Use when adding or reviewing test coverage in this repo.
---

# Testing Skill

Checklist when writing tests in the project.

## Pure Utility Tests

- [ ] Functions in `src/lib/` (e.g. `lib/utils.ts`, `lib/http/cookies.ts`) – test in isolation,
      no DOM/network required
- [ ] Edge cases – empty input, boundary values, invalid input

## Auth Flow Tests

- [ ] `lib/auth/guard.ts` – `hasAuthTokenForGuard`, `getSafeAuthNextPath` (open-redirect
      guard), `ensureAuthForGuard` refresh/redirect branches
- [ ] Token persistence – `lib/api/auth` cookie helpers

## Feature Logic Tests (learn: flashcards/quiz/radicals)

- [ ] Deck/session state transitions – e.g. next card, correct/incorrect answer, reset
- [ ] Random/shuffle logic – deterministic given a seed, or bounds-checked

## React Island Tests (when a `.tsx` island is added)

- [ ] Component render – correct output given props
- [ ] State transitions inside the island – `useState`/`useReducer` updates as expected
- [ ] No dependency on a global store – island should be testable in isolation

## Test Structure

- Unit tests: `*.test.ts` or `*.spec.ts` next to file
- Or: `__tests__/` in corresponding directory
- Framework: Vitest (Astro integration) or equivalent
