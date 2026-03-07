# Testing Skill

Checklist when writing tests in the project.

## Game Logic Tests

- [ ] `utils/ballPhysics.ts` – `getRadius`, `doBallsCollide`, `clampBallInBoard`
- [ ] Merge logic – 2 balls same value → merge, score adds
- [ ] Spawn logic – random value, position within board

## State Management Tests

- [ ] Atoms – initial state, derived values
- [ ] Hooks – `useBallGame` spawn, reset, physics update
- [ ] State transitions – idle → playing → gameover

## Component Render Tests

- [ ] Ball – render correct value, position
- [ ] BallBoard – render balls, preview
- [ ] UI components – render with props

## Test Structure

- Unit tests: `*.test.ts` or `*.spec.ts` next to file
- Or: `__tests__/` in corresponding directory
- Framework: Vitest (Astro integration) or equivalent
