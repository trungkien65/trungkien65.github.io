# Frontend Structure

## Directory Layout

```
src/
├── lib/            # Shared utilities, API clients, auth, http (cookies), devTools config
├── components/
│   ├── layout/     # Header, Sidebar – Astro
│   ├── ui/         # Reusable UI – Astro
│   ├── learn/      # Flashcard, Quiz, RadicalCard, ReviewFlow – Astro
│   └── devTools/
│       ├── *.astro   # Shell: ToolPanel, ToolRenderer, ToolCard
│       └── tools/     # React islands, one per dev tool (client:visible)
├── layouts/        # Layout wrappers (DashboardLayout, PublicLayout)
├── pages/          # Astro routes
├── scripts/        # Vanilla <script> entry points (vocab-learn, radicals-page, ...)
├── styles/         # Global CSS (theme)
└── theme/          # Theme logic (applyTheme)
```

React islands (`.tsx`, hydrated via `client:*`) live under the relevant
`components/<feature>/` directory (e.g. `components/devTools/tools/`) rather than in a
generic `react/` folder. Their hooks (pure logic + state) live in `lib/<feature>/hooks/`.

## Import Conventions

- **Alias**: `@/` → `src/`
- **Components**: `import { Button } from "@/components/ui"`
- **Layouts**: `import { DashboardLayout } from "@/layouts"`

## File Naming

- **Astro**: PascalCase – `Sidebar.astro`, `Button.astro`
- **React**: PascalCase – `Counter.tsx`
- **Hooks**: camelCase with `use` prefix – `useCounter.ts`
- **Utils**: camelCase – `cn.ts`

## Island Strategy

| Component | Type | Reason |
|-----------|------|--------|
| Sidebar, Header | Astro | Static, no state needed |
| Button, Card, Modal | Astro | No complex interactivity |
| ThemeToggle | Astro | Can use inline script |
| Dev-tools panels (Base64, Hash, JSON Formatter, ...) | React (`.tsx`, `client:visible`) | Per-tool state, only hydrates when its tab is shown |
