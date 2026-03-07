# Code Review Skill

Checklist when reviewing code in the Astro + React + Jotai project.

## Security

- [ ] No XSS – sanitize user input, avoid `dangerouslySetInnerHTML` arbitrarily
- [ ] No sensitive data exposure – API keys, tokens
- [ ] No injection – validate input

## Performance

- [ ] No unnecessary re-renders – memo, useCallback when needed
- [ ] No bundle bloat – lazy load islands if component is heavy
- [ ] No blocking main thread – physics loop uses requestAnimationFrame or reasonable interval

## Tailwind Usage

- [ ] No duplicate classes – extract component if repeated
- [ ] No inline style when Tailwind can be used
- [ ] Responsive correct – mobile-first

## Astro Island Misuse

- [ ] No `client:load` for static content – use only when interactivity is needed
- [ ] No full page hydration – small, targeted islands
- [ ] `client:visible` / `client:idle` when possible instead of `client:load`

## Readability

- [ ] Clear naming – variables, functions, components
- [ ] Reasonable structure – logic separated from UI
- [ ] Comments for complex logic
