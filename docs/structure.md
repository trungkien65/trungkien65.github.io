# Frontend Structure

## Directory Layout

```
src/
├── atoms/          # Jotai atoms – state definitions
├── hooks/          # React hooks – game logic, orchestration
├── lib/            # Shared utilities, hooks (debounce, media query)
├── components/
│   ├── layout/     # Header, Sidebar – Astro
│   ├── ui/         # Reusable UI – Astro
│   └── 2048/       # Ball game – React (BallBoard, Ball)
├── layouts/        # Layout wrappers (DashboardLayout)
├── pages/          # Astro routes
├── styles/         # Global CSS (theme, ballgame)
├── theme/          # Theme logic (applyTheme)
└── utils/          # Pure functions (ballPhysics)
```

## Import Conventions

- **Alias**: `@/` → `src/`
- **Components**: `import { Button } from "@/components/ui"`
- **Layouts**: `import { DashboardLayout } from "@/layouts"`
- **Atoms**: `import { ballsAtom } from "@/atoms/ballGame"`

## File Naming

- **Astro**: PascalCase – `Sidebar.astro`, `Button.astro`
- **React**: PascalCase – `BallBoard.tsx`, `Ball.tsx`
- **Hooks**: camelCase with `use` prefix – `useBallGame.ts`
- **Utils**: camelCase – `ballPhysics.ts`

## Island Strategy

| Component | Type | Reason |
|-----------|------|--------|
| Sidebar, Header | Astro | Static, no state needed |
| Button, Card, Modal | Astro | No complex interactivity |
| BallBoard, Ball | React | Game state, physics loop |
| ThemeToggle | Astro | Can use inline script |
