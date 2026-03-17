# Tradefolk — Claude Instructions

## Project Overview
Tradefolk is a community barter/exchange marketplace built with React + Vite. Users list goods and services to trade with one another. The entire app currently lives in a single component file.

## Stack
- **Framework:** React 18 with Vite 5
- **Language:** JSX (no TypeScript)
- **Styling:** Inline styles and CSS (`src/index.css`)
- **Entry:** `src/main.jsx` → `src/exchange-app.jsx`

## Dev Commands
```bash
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview production build
```

## Architecture Notes
- All app logic is in `src/exchange-app.jsx` (single large component file)
- Mock data (LISTINGS, CATEGORIES) is defined at the top of that file
- No routing library — views are controlled by local state
- No backend or API — all data is in-memory

## Code Conventions
- Functional components with hooks only (no class components)
- Inline styles are used heavily throughout the file
- Placeholder images are generated as inline SVG data URIs via `makePlaceholder()`
- Category color theming driven by the `CATEGORIES` array

## Key Data Structures
- `LISTINGS` — array of listing objects with fields: `id`, `name`, `avatar`, `category`, `title`, `desc`, `type` (goods|service), `rating`, `trades`, `neighbourhood`, `mapPos`, `photos`, optional `accountType`/`businessName`/`businessType`/`socials`
- `CATEGORIES` — array of `{ id, label, icon, color }`

## Do Not
- Do not add a build system, bundler config, or test framework unless explicitly requested
- Do not split `exchange-app.jsx` into multiple files unless explicitly requested
- Do not introduce TypeScript, a CSS framework, or a routing library unless explicitly requested
