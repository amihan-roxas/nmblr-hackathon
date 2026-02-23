# CLAUDE.md

## Project Overview

**ResourceCycle** — a hackathon project that connects donors (with surplus items) to seekers (schools/orphanages) with AI-generated SDG impact statements. Built with TypeScript, React 19, and Vite 7.

### Categories
- Tech Equipment
- Furniture

### User Flows

**Flow 1: Donator**
1. Lands on "Donate" page
2. Fills out form: item name, quantity, category, photo, optional "Urgent" flag
3. AI Impact Forecaster generates a live impact card (e.g. "Your 5 laptops could support 5 students — SDG 4: Quality Education")
4. Submits donation → item appears in masonry grid, impact dashboard updates

**Flow 2: Seeker (School / Orphanage)**
1. Lands on item grid
2. Filters by category (Tech Equipment / Furniture)
3. Browses Pinterest-style masonry layout (urgent items pulse red at top)
4. Clicks "Claim" → modal with item summary + AI impact statement
5. "Claim via Email" → mailto: link pre-filled with item details, request, and impact line

### AI Role
- Generates impact predictions when donors post (tied to UN SDGs)
- Displays same impact data to seekers when they claim
- Bridge that turns surplus into social impact

## Tech Stack

- **Framework:** React 19 with TypeScript (~5.9)
- **Bundler:** Vite 7 (`@vitejs/plugin-react`)
- **Styling:** Tailwind CSS 4 (`@tailwindcss/vite`)
- **State:** Zustand
- **Linting:** ESLint 9 (flat config) with `typescript-eslint`, `react-hooks`, and `react-refresh` plugins
- **Module System:** ESM (`"type": "module"`)

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Type-check with `tsc -b` then build with Vite
- `npm run lint` — Run ESLint
- `npm run preview` — Preview production build

## Project Structure

```
src/
  main.tsx          # App entry point (React StrictMode)
  App.tsx           # Root component
  App.css           # App styles
  index.css         # Global styles
  assets/           # Static assets (images, svgs)
public/             # Public static files
```

## TypeScript Configuration

- **Target:** ES2022 (app), ES2023 (node/vite config)
- **Strict mode** enabled with `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- `verbatimModuleSyntax` is on — use `import type` for type-only imports
- `erasableSyntaxOnly` is on — avoid enums and parameter properties; use `as const` objects or union types instead
- JSX transform: `react-jsx` (no need to import React in every file)

## Code Conventions

- Functional components only (no class components)
- Use `useState`, `useEffect`, and other hooks directly
- File extensions: `.tsx` for components, `.ts` for utilities/types
- Imports use `.tsx`/`.ts` extensions where needed (bundler module resolution)
