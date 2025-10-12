# 🚀 StudyAI Complete Setup Guide

## ✅ Environment Variables Status

All environment variables have been configured with your Supabase credentials:

### 📋 Your Supabase Configuration
- **Project URL**: `https://voikwzedrbvkqkzkknqu.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` ✅
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` ✅
- **JWT Secret**: `d390eb4598b8fbbcbc55e6efada6bd05c1ba4a28de4848ccf56cd8b223844e9b` ✅

## 🔧 Step-by-Step Setup

### Step 1: Verify Environment Variables
```bash
npm run test:env
```
Should show all variables as ✅ set.

### Step 2: Run Database Migration
**IMPORTANT**: This must be done manually in Supabase Dashboard

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select Your Project**: `voikwzedrbvkqkzkknqu`
3. **Open SQL Editor**: Click on "SQL Editor" in the sidebar
4. **Copy Migration SQL**: Copy the entire content from `supabase/migrations/001_initial_schema.sql`
5. **Paste and Run**: Paste in the SQL Editor and click "Run"

### Step 3: Verify Database Setup
```bash
npm run test:db
```
Should show all tables as ✅ exists.

### Step 4: Test Authentication Flow
```bash
npm run test:auth
```
Should show successful database connection.

### Step 5: Set Vercel Environment Variables

**Go to Vercel Dashboard**: https://vercel.com/dashboard
1. Select your **StudyAI** project
2. Go to **Settings** → **Environment Variables**
3. Add these variables (copy from `.env.vercel`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://voikwzedrbvkqkzkknqu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvaWt3emVkcmJ2a3FremtrbnF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNjk1ODAsImV4cCI6MjA3NTc0NTU4MH0.sT9In39arAh5GWSlxYLWs2nRhvmVObKgVKW4IwUJw2Y
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvaWt3emVkcmJ2a3FremtrbnF1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDE2OTU4MCwiZXhwIjoyMDc1NzQ1NTgwfQ.TyNoTFuStpIbdguQrGILlEVvt9HR915pt_C4DVwPPzs
JWT_SECRET=d390eb4598b8fbbcbc55e6efada6bd05c1ba4a28de4848ccf56cd8b223844e9b
NEXTAUTH_SECRET=37526ba760c9633d054fcf525bf37ef8137d43742da4c6fd8c6a765587f14eb4
NEXT_PUBLIC_API_URL=https://studyai-4ft01gvu2-ankurnit112-5736s-projects.vercel.app
NEXTAUTH_URL=https://studyai-4ft01gvu2-ankurnit112-5736s-projects.vercel.app
```

### Step 6: Deploy to Production
```bash
npm run build
vercel --prod
```

## 🧪 Testing Your Deployment

### Test Endpoints (After Deployment)

1. **Health Check**: 
   ```
   https://your-app.vercel.app/api/health
   ```

2. **Database Status**: 
   ```
   https://your-app.vercel.app/api/setup-db
   ```

3. **Test Authentication**: 
   ```
   POST https://your-app.vercel.app/api/test-auth-flow
   Body: {"action": "test-signup"}
   ```

### Test User Registration & Login

1. **Visit Your App**: Go to your deployed URL
2. **Sign Up**: Try creating a new account
3. **Sign In**: Try logging in with the account
4. **Dashboard**: Verify you can access the dashboard

## 🔍 Troubleshooting

### If Authentication Fails:

1. **Check Vercel Environment Variables**:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Ensure all variables are set for "Production"

2. **Check Database Tables**:
   - Visit `/api/setup-db` endpoint
   - Should show all tables as "exists"

3. **Check Supabase Dashboard**:
   - Go to Supabase → Table Editor
   - Verify tables exist: users, user_sessions, academic_records, etc.

### If Database Connection Fails:

1. **Verify Supabase Credentials**:
   ```bash
   npm run test:env
   ```

2. **Check Supabase Project Status**:
   - Go to Supabase Dashboard
   - Ensure project is active and not paused

3. **Run Migration Again**:
   - Copy `supabase/migrations/001_initial_schema.sql`
   - Paste in Supabase SQL Editor
   - Click "Run"

## 📊 Expected Results

### After Complete Setup:

✅ **Environment Variables**: All set in local and Vercel
✅ **Database**: All tables created and accessible
✅ **Authentication**: Sign up and login working
✅ **API Endpoints**: All responding correctly
✅ **Health Check**: All systems showing "healthy"

### User Flow Should Work:
1. User visits app
2. User can sign up with email/password
3. User gets redirected to dashboard
4. User can add academic records
5. User can view predictions and analytics

## 🎯 Current Status

- **Local Environment**: ✅ Configured
- **Database Schema**: ⚠️ Needs manual migration in Supabase
- **Vercel Environment**: ⚠️ Needs manual setup in dashboard
- **Authentication System**: ✅ Ready (after database migration)

## 🚀 Quick Start Commands

```bash
# Test everything locally
npm run test:env && npm run test:db && npm run test:auth

# Build and deploy
npm run build && vercel --prod

# After deployment, test production
curl https://your-app.vercel.app/api/health
```

Your StudyAI application is ready to go live! 🎓