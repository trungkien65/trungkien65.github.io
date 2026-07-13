# Architecture Overview

The project uses Astro (static output) with Tailwind for styling. `@astrojs/react` is
installed so React islands are available whenever a feature needs client-side state or
interactivity; most of the site is still plain Astro with vanilla `<script>` blocks.

## 1. Astro Island Architecture

- **Static-first**: `output: "static"` – no SSR, builds to static HTML.
- **Astro components**: `.astro` – render HTML at build time, no JS runtime needed.
- **React islands**: `.tsx` components hydrated with `client:*` directives (`client:load`,
  `client:visible`, `client:idle`) – opt in only when a piece of UI genuinely needs
  React state/effects.
- **Vanilla scripts**: `<script>` blocks in `.astro` files (see `src/scripts/`) – used for
  simple DOM interactivity (theme toggle, tab switching, auth guard) that doesn't need React.
- **Principle**: Default to Astro for layout/static content and vanilla scripts for light
  interactivity; reach for a React island only when component-local state/effects justify it.

```astro
---
import Counter from "@/components/example/Counter"
---
<Counter client:load />
```

## 2. State Management

- No global state library is installed (no Jotai/Redux/Context store).
- React islands manage their own state with `useState`/`useReducer`; keep it local to the
  island unless multiple islands genuinely need to share it.
- Cross-page/persisted state (auth tokens, theme) goes through plain modules in `src/lib/`
  (e.g. `lib/auth/`, `lib/http/cookies.ts`), not component state.

## 3. Tailwind Styling

- **CSS variables**: `theme.css` – colors (light/dark) via `data-theme`.
- **Utility-first**: Limit `@apply`; prefer direct classes.
- **Components**: `components/ui/` – Button, Card, Modal – use Tailwind classes.
- **Principle**: No inline styles except for dynamic values (position, transform).

## 4. UI Component Structure

```
src/components/
├── layout/           # Header, Sidebar – Astro
├── ui/               # Button, Card, Modal, etc. – Astro
├── learn/            # Flashcard, Quiz, RadicalCard – Astro
└── devTools/
    ├── ToolPanel.astro, ToolRenderer.astro, ToolCard.astro  # Astro shell
    └── tools/         # One React island per tool (client:visible), state in
                        # src/lib/devTools/hooks/use<Tool>.ts
```

- **Layout**: Astro – no hydration needed.
- **UI**: Astro – export via `index.ts` for clean imports.
- New React islands should live next to the feature they belong to (e.g.
  `components/<feature>/Widget.tsx`) rather than in a generic `react/` folder.
- **Example**: `components/devTools/tools/` – each dev tool is a small React island
  (`client:visible`, only hydrates once its tab panel is shown) backed by a
  `lib/devTools/hooks/use<Tool>.ts` hook that holds the pure logic + state.
