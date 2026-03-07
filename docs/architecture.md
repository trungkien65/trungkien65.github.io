# Architecture Overview

The project uses Astro with React islands, Jotai for state, and Tailwind for styling.

## 1. Astro Island Architecture

- **Static-first**: `output: "static"` – no SSR, builds to static HTML.
- **Astro components**: `.astro` – render HTML at build time, no JS runtime needed.
- **React islands**: `client:load` – hydrate only when interactivity is needed (game, theme toggle).
- **Principle**: Use Astro for layout/static; use React only when state/interactivity is needed.

```astro
<!-- Astro wrapper: import React island + styles -->
<BallBoardReact client:load />
```

## 2. Jotai State Management

- **Atoms**: `src/atoms/` – define state (balls, score, gameStatus).
- **Not used**: Redux, Context API.
- **Hooks**: `useAtomValue`, `useSetAtom` – read/write state in React components.
- **Principle**: State separated from UI; business logic in hooks, not in atoms.

```ts
// atoms/ballGame.ts
export const ballsAtom = atom<Ball[]>([])
export const scoreAtom = atom(0)
export const gameStatusAtom = atom<GameStatus>("idle")
```

## 3. Tailwind Styling

- **CSS variables**: `theme.css` – colors (light/dark) via `data-theme`.
- **Utility-first**: Limit `@apply`; prefer direct classes.
- **Components**: `components/ui/` – Button, Card, Modal – use Tailwind classes.
- **Principle**: No inline styles except for dynamic values (position, transform).

## 4. UI Component Structure

```
src/components/
├── layout/     # Header, Sidebar – Astro
├── ui/         # Button, Card, Modal, etc. – Astro
└── 2048/       # Ball game – React (BallBoard, Ball)
```

- **Layout**: Astro – no hydration needed.
- **UI**: Astro – export via `index.ts` for clean imports.
- **Game**: React – needs state and interactivity.

## 5. Game Physics Logic Separation

- **`utils/ballPhysics.ts`**: Pure functions: radius, collision, gravity, clamp.
- **`hooks/useBallGame.ts`**: Physics loop, spawn, merge, score – uses atoms.
- **`atoms/ballGame.ts`**: State data only.
- **Principle**: Physics is React-independent; can be tested in isolation.

```
utils/ballPhysics.ts  →  hooks/useBallGame.ts  →  atoms/ballGame.ts
     (pure functions)        (orchestration)           (state)
```
