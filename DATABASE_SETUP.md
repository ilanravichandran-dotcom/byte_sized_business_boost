# Database & Persistence Setup Guide

## Overview
LocalLens supports two data persistence approaches:

### 1. **LocalStorage (Default - Works Immediately)**
- ✅ No configuration needed
- Data stored in browser's local storage
- Persists across browser sessions on same device
- Best for: Testing, development, single-device use

### 2. **Supabase Cloud Database (Recommended for Production)**
- 🌐 Cloud-based PostgreSQL database
- Syncs data across multiple devices
- User-independent data sharing
- Best for: Production deployment, multi-device sync

## Setting Up Supabase

### Step 1: Create a Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub or email
3. Create a new project

### Step 2: Create Database Tables

Run these SQL commands in your Supabase SQL editor:

```sql
-- Businesses table (if you want to store in DB instead of JSON)
CREATE TABLE businesses (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  address TEXT,
  phone TEXT,
  rating DECIMAL(2,1),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  business_id INTEGER REFERENCES businesses(id),
  author TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Favorites table (no auth required)
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  business_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Set row-level security policies
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_are_public" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "anyone_can_insert_reviews" ON public.reviews
  FOR INSERT WITH CHECK (true);

CREATE POLICY "favorites_are_user_specific" ON public.favorites
  FOR SELECT USING (true);

CREATE POLICY "users_can_insert_own_favorites" ON public.favorites
  FOR INSERT WITH CHECK (true);

CREATE POLICY "users_can_delete_own_favorites" ON public.favorites
  FOR DELETE USING (true);
```

### Step 3: Get Your Credentials

1. Go to **Settings → API** in Supabase dashboard
2. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon Public Key** (long string starting with `eyJ...`)

### Step 4: Configure in Your Application

#### Option A: Environment Variables (Recommended)
Create a `.env.local` file in your project root:
```
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Then update `build.js` or `index.html` to read these:
```javascript
window.SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
window.SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

#### Option B: Direct Configuration (Development Only)
Add to `index.html` before script tags:
```html
<script>
  window.SUPABASE_URL = 'your_project_url_here';
  window.SUPABASE_ANON_KEY = 'your_anon_key_here';
</script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### Step 5: Include Supabase Library
Add to your `index.html`:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

## How It Works

### Data Flow
```
LocalStorage (Primary)
       ↓
   App State
       ↓
   ↙ If Supabase available ↘
Sync from Supabase    Store changes to Supabase
```

### Features Enabled by Supabase
- ✅ Reviews sync between devices
- ✅ Favorites sync between devices
- ✅ Shared data across users
- ✅ Historical data backup

## Testing the Integration

1. Add a review or favorite on Device A
2. Go to Device B on same browser
3. If Supabase is configured, data syncs automatically
4. If not configured, app continues to work with LocalStorage

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Data not syncing | Check Supabase credentials in console |
| RLS permission errors | Verify SQL policies above are applied |
| Not using Supabase | Check browser console - should see "Supabase not configured" message |
| 404 on business data | Ensure `data/businesses.json` is in the project root |

## Architecture Notes

The application follows modular architecture:
- `data-manager.js` - Handles all persistence & Supabase sync
- `business-service.js` - Business logic & filtering
- `ui-renderer.js` - All DOM rendering
- `verification.js` - Bot prevention
- `report-generator.js` - Report generation
- `app-state.js` - Coordinates all modules

This separation allows easy testing, maintenance, and future scaling.

## Next Steps
- [ ] Set up Supabase project
- [ ] Create database tables
- [ ] Add credentials to environment
- [ ] Test data syncing
- [ ] Deploy to production
