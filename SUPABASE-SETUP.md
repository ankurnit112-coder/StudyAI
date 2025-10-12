# 🗄️ Supabase Database Migration Guide

## 🎯 Overview

This guide will help you migrate from the mock database to a production-ready Supabase PostgreSQL database with authentication, real-time features, and Row Level Security (RLS).

## 🚀 Quick Setup Steps

### 1. Create Supabase Project

1. **Go to Supabase**
   - Visit: https://supabase.com
   - Sign up/Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Choose your organization
   - Project name: `studyai` (or your preferred name)
   - Database password: Generate a strong password
   - Region: Choose closest to your users
   - Click "Create new project"

3. **Wait for Setup**
   - Project creation takes 2-3 minutes
   - You'll get a dashboard with your project details

### 2. Get Your Supabase Credentials

In your Supabase project dashboard:

1. **Go to Settings → API**
2. **Copy these values:**
   - Project URL: `https://your-project-id.supabase.co`
   - Anon (public) key: `eyJ...` (starts with eyJ)
   - Service role key: `eyJ...` (starts with eyJ, different from anon)

### 3. Set Environment Variables

Update your environment files:

#### `.env.local` (for development):
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Keep existing variables
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-for-development
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

#### Vercel Environment Variables:
Add these in your Vercel dashboard → Settings → Environment Variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 4. Run Database Migration

1. **Go to Supabase Dashboard**
   - Navigate to SQL Editor
   - Click "New Query"

2. **Run Migration Script**
   - Copy the contents of `supabase/migrations/001_initial_schema.sql`
   - Paste into the SQL editor
   - Click "Run" to execute

3. **Verify Tables Created**
   - Go to Table Editor
   - You should see: `users`, `user_sessions`, `academic_records`, `study_sessions`, `predictions`, `study_recommendations`

### 5. Test the Integration

1. **Build and Test Locally**
   ```bash
   npm run build
   npm run dev
   ```

2. **Test Authentication**
   - Go to http://localhost:3000/auth/signup
   - Create a test account
   - Verify it appears in Supabase → Table Editor → users

3. **Test API Endpoints**
   - Sign in to get a token
   - Test `/api/academic-records` and `/api/study-sessions`

## 🔧 Database Schema Overview

### Core Tables

#### `users`
- **Purpose**: Store user accounts and profiles
- **Key Features**: 
  - UUID primary keys
  - Password hashing
  - Account locking mechanism
  - User preferences (JSON)
  - Row Level Security enabled

#### `user_sessions`
- **Purpose**: Track user login sessions
- **Key Features**:
  - JWT refresh token storage
  - Device and IP tracking
  - Session expiration
  - Automatic cleanup

#### `academic_records`
- **Purpose**: Store exam results and grades
- **Key Features**:
  - Subject-wise marks tracking
  - Multiple exam types support
  - Performance analytics ready

#### `study_sessions`
- **Purpose**: Track study time and topics
- **Key Features**:
  - Duration tracking
  - Topics covered (array)
  - Study pattern analysis

#### `predictions` & `study_recommendations`
- **Purpose**: AI-powered insights and recommendations
- **Key Features**:
  - ML model integration ready
  - Confidence scoring
  - Personalized recommendations

### Security Features

#### Row Level Security (RLS)
- **Enabled on all tables**
- **Users can only access their own data**
- **Automatic policy enforcement**

#### Built-in Functions
- `increment_login_attempts()` - Handle failed logins
- `reset_login_attempts()` - Reset on successful login
- `is_account_locked()` - Check account status
- `cleanup_expired_sessions()` - Maintenance function

## 🔒 Security Configuration

### Authentication Flow
1. **User Registration**: Creates user in `users` table
2. **Login**: Validates credentials, creates session
3. **JWT Tokens**: Custom JWT with Supabase session tracking
4. **Session Management**: Automatic cleanup and validation

### Data Protection
- **Encrypted at Rest**: Supabase handles encryption
- **SSL/TLS**: All connections encrypted
- **Row Level Security**: User data isolation
- **API Rate Limiting**: Built into our endpoints

## 📊 Monitoring & Analytics

### Built-in Supabase Features
- **Real-time Database**: Live updates
- **Database Logs**: Query performance
- **API Analytics**: Request tracking
- **User Management**: Built-in auth UI

### Custom Analytics
- User registration trends
- Study session patterns
- Academic performance tracking
- Prediction accuracy metrics

## 🚀 Advanced Features

### Real-time Subscriptions
```typescript
// Example: Real-time academic records
const { data, error } = await supabase
  .from('academic_records')
  .select('*')
  .eq('user_id', userId)
  .on('INSERT', payload => {
    console.log('New record added:', payload.new)
  })
  .subscribe()
```

### Edge Functions (Optional)
- Deploy serverless functions to Supabase Edge
- Handle complex business logic
- ML model inference

### Storage Integration
- File uploads (profile pictures, documents)
- Automatic image optimization
- CDN distribution

## 🔄 Migration Benefits

### Before (Mock Database)
- ❌ In-memory storage (data lost on restart)
- ❌ No persistence
- ❌ No real user management
- ❌ No scalability
- ❌ No backup/recovery

### After (Supabase)
- ✅ PostgreSQL database (production-ready)
- ✅ Automatic backups
- ✅ Real-time capabilities
- ✅ Built-in authentication
- ✅ Row Level Security
- ✅ Global CDN
- ✅ Monitoring & analytics
- ✅ Scalable infrastructure

## 🐛 Troubleshooting

### Common Issues

#### Connection Errors
- **Issue**: Can't connect to Supabase
- **Solution**: Check environment variables are set correctly

#### RLS Policy Errors
- **Issue**: "Row Level Security policy violation"
- **Solution**: Ensure user is authenticated and accessing own data

#### Migration Errors
- **Issue**: SQL migration fails
- **Solution**: Run migration script step by step, check for syntax errors

#### Authentication Issues
- **Issue**: JWT tokens not working
- **Solution**: Verify JWT_SECRET is consistent across environments

### Debug Commands

```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL

# Test database connection
npm run test:db

# View Supabase logs
# Go to Supabase Dashboard → Logs
```

## 📈 Performance Optimization

### Database Indexes
- All foreign keys indexed
- Email and session tokens indexed
- Query performance optimized

### Connection Pooling
- Supabase handles connection pooling
- Automatic scaling based on load

### Caching Strategy
- Supabase Edge caching
- Client-side query caching
- Real-time invalidation

## 🎯 Next Steps

After successful migration:

1. **Deploy to Production**
   - Update Vercel environment variables
   - Deploy and test

2. **Enable Advanced Features**
   - Real-time subscriptions
   - File storage
   - Edge functions

3. **Monitor Performance**
   - Set up alerts
   - Monitor query performance
   - Track user metrics

4. **Backup Strategy**
   - Supabase handles automatic backups
   - Consider additional backup strategies for critical data

## 🎉 Success Indicators

Your migration is successful when:
- ✅ All API endpoints work with real data
- ✅ User registration and login functional
- ✅ Data persists between sessions
- ✅ Academic records and study sessions save correctly
- ✅ No console errors related to database
- ✅ Supabase dashboard shows active connections

**Congratulations! You now have a production-ready database powering your StudyAI application!** 🚀