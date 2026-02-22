# Byte-Sized Business Boost

FBLA Coding & Programming Competition 2025–2026 — a small web app to discover and support local businesses.

This repository contains a static, client-side application built with HTML, CSS, and vanilla JavaScript. It ships with sample business data and an optional small build step to inject Supabase environment variables for Netlify deployments.

---

## Quick links

- Live entry point: [index.html](index.html)
- Build template: [index.html.template](index.html.template)
- Build script: [build.js](build.js)
- Deployment config: [netlify.toml](netlify.toml)
- Sample data: [data/businesses.json](data/businesses.json)

---

## What this app does

- Browse local businesses by category (food, retail, services)
- Search, sort, and filter business listings
- View details, read and submit reviews (1–5 stars)
- Save favorites (persisted to localStorage)
- View special deals/coupons attached to businesses
- Optional Supabase sync for reviews and favorites (client-side anon key)

---

## Requirements

- A modern web browser (Chrome, Firefox, Edge, Safari)
- Node.js (optional, only required for the tiny build step)
- Python (optional, for a simple local static server) or any static file server

Note: The app runs fine by opening `index.html` directly, or by serving the directory over HTTP (recommended for fetch() access to `data/businesses.json`).

---

## Local development & testing

1. Open `index.html` directly in your browser (quickest demo).

2. Or serve locally (recommended so `fetch('data/businesses.json')` works):

```bash
# using Python 3 (works on Windows with python3 or python)
python -m http.server 8000

# then open http://localhost:8000
```

3. Optional: run the build step to inject Supabase env vars into `index.html` (requires Node.js):

```bash
# set environment variables and run the build script (Unix / Windows PowerShell examples)
SUPABASE_URL='https://your-project-ref.supabase.co' SUPABASE_ANON_KEY='your-anon-key' npm run build

# On Windows PowerShell:
$env:SUPABASE_URL='https://your-project-ref.supabase.co'; $env:SUPABASE_ANON_KEY='your-anon-key'; npm run build

# Serve after build:
python -m http.server 8000
```

The build step uses `index.html.template` and `build.js` to generate `index.html` with the supplied environment variables. If you do not run the build, the app still works in local-only mode using the included sample data and localStorage.

---

## Supabase integration (optional)

This app can optionally persist reviews and favorites to Supabase. See [DEPLOY_AND_SUPABASE.md](DEPLOY_AND_SUPABASE.md) for full instructions. In short:

- Create a Supabase project and add `reviews` and `favorites` tables (SQL provided in `DEPLOY_AND_SUPABASE.md`).
- Provide `SUPABASE_URL` and `SUPABASE_ANON_KEY` to the build step or set them as environment variables in Netlify.
- When configured, the app will attempt to initialize a Supabase client and sync reviews/favorites on startup; otherwise it uses localStorage only.

Security note: the anon key is public-facing and acceptable for demos. For production, protect writes via server-side endpoints or Supabase Row Level Security (RLS).

---

## Deploying to Netlify

The repository includes a minimal Netlify configuration (`netlify.toml`). Recommended approach:

1. Push the repo to GitHub and connect it to Netlify (New site from Git).
2. In Netlify Site settings → Build & deploy → Environment variables, add `SUPABASE_URL` and `SUPABASE_ANON_KEY` if you want Supabase enabled.
3. Netlify build command: `npm run build` (this runs `node build.js`). Publish directory: `/` (repo root).

Alternatively, use Netlify's drag-and-drop deploy for a quick demo (no build step).

---

## File overview

```
byte_sized_business_boost/
├── index.html                # Generated or direct HTML entry
├── index.html.template       # Template used by build.js to inject env vars
├── build.js                  # Tiny Node script to inject SUPABASE_* env vars
├── package.json              # Scripts: `npm run build`, `npm start`
├── netlify.toml              # Netlify publish config
├── styles.css                # Styles
├── script.js                 # App logic (reviews, favorites, verification, supabase sync)
├── data/businesses.json      # Sample business data (fetched when served over HTTP)
└── README.md
```

---

## Notes for maintainers

- `script.js` contains the app logic and a `SAMPLE_BUSINESSES` array used when no external data is available.
- The app will try to fetch `data/businesses.json` when served over HTTP and fall back to `SAMPLE_BUSINESSES` otherwise.
- Favorites and reviews are stored in `localStorage` and optionally synced to Supabase when configured.

---

## License & authors

Created by Ilan Ravichandran, Prahast Pondugula, and Daniel Li for the FBLA competition.

Feel free to adapt this project for demos, learning, or competition use. Cite the authors when reusing substantial portions.

