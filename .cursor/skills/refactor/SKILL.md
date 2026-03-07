# Refactor Skill

Checklist when refactoring code in the project.

## Simplify Components

- [ ] Component too long (>150 lines) → split
- [ ] Component does too much → single responsibility
- [ ] Too many props → group into object or context

## Move Logic to Hooks

- [ ] Business logic in component → extract `useXxx` hook
- [ ] Complex useEffect → move to hook
- [ ] Related state + effect → custom hook

## Move State to Atoms

- [ ] useState shared between components → Jotai atom
- [ ] Deep prop drilling → atom
- [ ] State needs persist / share → atom

## Extract Utilities

- [ ] Pure logic → `utils/` or `lib/`
- [ ] Function used in multiple places → extract
- [ ] Constants → separate file or with utils

## DRY

- [ ] Code repeated 2+ times → extract
- [ ] Similar components → composition or props
- [ ] Magic numbers → named constants
