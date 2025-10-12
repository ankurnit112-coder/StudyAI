# 📋 Supabase Migration Checklist

## Pre-Migration Steps
- [ ] Create Supabase project at https://supabase.com
- [ ] Copy Project URL and API keys
- [ ] Add environment variables to .env.local
- [ ] Run database migration in Supabase SQL Editor

## Environment Variables Needed
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

## Migration Steps
1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create new project
   - Note down credentials

2. **Set Environment Variables**
   - Update .env.local with Supabase credentials
   - Update Vercel environment variables for production

3. **Run Database Migration**
   - Copy contents of supabase/migrations/001_initial_schema.sql
   - Paste in Supabase SQL Editor
   - Execute the migration

4. **Test the Migration**
   - Run: npm run build
   - Run: npm run dev
   - Test signup/signin functionality
   - Verify data appears in Supabase dashboard

5. **Deploy to Production**
   - Update Vercel environment variables
   - Deploy and test production

## Verification
- [ ] Users can sign up and sign in
- [ ] Data persists in Supabase dashboard
- [ ] Academic records API works
- [ ] Study sessions API works
- [ ] No console errors

## Rollback Plan
If issues occur, you can temporarily switch back by:
1. Change imports from 'database-supabase' to 'database' in API routes
2. Redeploy
3. Fix issues and retry migration

## Support
- Supabase Documentation: https://supabase.com/docs
- StudyAI Setup Guide: SUPABASE-SETUP.md