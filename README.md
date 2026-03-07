# Todo List - Task management with Astro

A simple and elegant Todo List application built with Astro.

## Features

- ✅ Add, delete and mark tasks as complete
- 💾 Store data in localStorage
- 📊 Statistics: Total, Completed, Remaining
- 🌙 Dark mode support
- 📱 Responsive design
- ⚡ Static site - easy to host

## Installation

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

Site will run at `http://localhost:4321`

## Build

```bash
pnpm build
```

Output will be in the `dist/` folder - ready to deploy to any static hosting (Vercel, Netlify, GitHub Pages, etc.)

## Deploy

### Vercel
```bash
vercel deploy
```

### Netlify
```bash
netlify deploy --prod
```

### GitHub Pages

Project is configured with GitHub Actions to automatically deploy to GitHub Pages.

**How to deploy:**

1. Push code to GitHub repository
2. Go to Settings > Pages in the repository
3. Select Source: "GitHub Actions"
4. Each push to `main` branch will automatically build and deploy

Or if you want to deploy manually:

```bash
pnpm build
# Then push the dist/ folder to gh-pages branch
```

## Structure

```
├── src/
│   ├── components/
│   │   └── TodoList.astro      # Todo List component
│   ├── layouts/
│   │   └── Layout.astro         # Main layout
│   └── pages/
│       └── index.astro          # Home page
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions workflow
├── astro.config.mjs
└── package.json
```

## License

MIT
