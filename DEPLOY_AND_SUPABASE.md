Supabase & Netlify Deployment Guide

If you want reviews and favorites to persist in a central database and share across devices, integrate with Supabase and deploy the site to Netlify (free tiers available).

1. Create a Supabase project
   - Go to https://supabase.com and create a free project.
   - In your project Settings → API, copy the `URL` and the `anon` (public) key.

2. Create the required tables (SQL)
   - Open the SQL editor in Supabase and run the following:

```sql
create table reviews (
  id uuid primary key default gen_random_uuid(),
  business_id int not null,
  author text,
  rating int,
  comment text,
  date date,
  created_at timestamptz default now()
);

create table favorites (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  business_id int not null,
  created_at timestamptz default now()
);
```

3. Configure the site to use Supabase
   - In `index.html` replace the placeholder `window.SUPABASE_URL` and `window.SUPABASE_ANON_KEY` values with your project's values for quick testing.
   - For production on Netlify, you can set the values in Site settings → Build & deploy → Environment → Environment variables and inject them during a build step, or edit `index.html` before deploying. (This project is a static site — including anon keys in the client is common for demo apps but less secure for production.)

4. Deploy to Netlify (free)
   - Option A (recommended): Push this repo to GitHub and connect your GitHub repo in Netlify (New site from Git).
     - Set the publish directory to the repository root (no build command required).
     - If you used environment variables, Netlify will inject them during deploy.

   - Option B (quick demo): Drag and drop the project folder into Netlify's "Sites → Add new site → Deploy manually" page.

5. How it works in this project
   - The application will continue to work in local-only mode if Supabase is not configured.
   - When Supabase is configured, the app will:
     - Fetch reviews and favorites from Supabase and merge them into the local data on startup.
     - Save new reviews to the `reviews` table.
     - Save/remove favorites in the `favorites` table tied to a per-client id stored in localStorage.

Security note: The example uses the Supabase client with the anon key from the browser. For production workloads you should secure write access with server-side endpoints or Row Level Security (RLS) policies in Supabase.

## Building and deploying on Netlify (finalizing)

This repo includes a minimal build step that injects your Supabase environment variables into the static `index.html` during the Netlify build.

1. Add environment variables in Netlify
   - In your Netlify site, go to Site settings → Build & deploy → Environment → Environment variables.
   - Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` with your project values.

2. Build command & publish directory
   - Netlify will run `npm run build` (the repository includes `package.json` and `build.js` to generate `index.html`).
   - The publish directory is the repository root (`/`) — this is configured in `netlify.toml`.

3. Local testing
   - To test locally without deploying, you can either:
     - Run `npm run build` locally (requires Node.js) to generate `index.html` with values from your shell environment: 

```bash
SUPABASE_URL='https://your-project-ref.supabase.co' SUPABASE_ANON_KEY='your-anon-key' npm run build
python3 -m http.server 8000
```

     - Or edit `index.html.template` and replace placeholders manually for quick tests.

4. Notes
   - The anon key is public-facing; it's acceptable for demo apps but secure apps should use server-side endpoints or RLS.
   - This build step is intentionally tiny to avoid introducing heavy build tooling.

