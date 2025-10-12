# 🔧 Database Fix Instructions

## Problem
The Supabase database tables haven't been created yet, causing the "Could not find the table 'public.users'" error.

## Quick Fix (2 minutes)

### Step 1: Open Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your StudyAI project

### Step 2: Run the Migration
1. Click on **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Copy the entire content from `supabase/migrations/001_initial_schema.sql`
4. Paste it into the SQL Editor
5. Click **"Run"** (or press Ctrl+Enter)

### Step 3: Verify Success
You should see messages like:
- ✅ CREATE EXTENSION
- ✅ CREATE TYPE
- ✅ CREATE TABLE (for each table)
- ✅ CREATE INDEX (for each index)

### Step 4: Test the Fix
1. Go back to your app: https://studyai-9bvgwfgrn-ankurnit112-5736s-projects.vercel.app
2. Try signing up with a new account
3. It should work without errors now!

## What This Creates
The migration creates these essential tables:
- `users` - User accounts and profiles
- `user_sessions` - Login sessions and tokens
- `academic_records` - Student grades and scores
- `study_sessions` - Study time tracking
- `predictions` - AI predictions for exam scores
- `study_recommendations` - Personalized study suggestions

## Alternative: Use Supabase CLI (Advanced)
If you have Supabase CLI installed:
```bash
supabase db reset
```

## Verification
After running the migration, you can verify it worked by:
1. Visiting: https://studyai-9bvgwfgrn-ankurnit112-5736s-projects.vercel.app/api/setup-db
2. You should see all tables with status "exists"

---

**Need help?** The migration file is located at `supabase/migrations/001_initial_schema.sql` in your project.