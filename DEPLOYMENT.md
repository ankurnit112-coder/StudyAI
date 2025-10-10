# StudyAI Deployment Guide

## 🚀 Quick Deployment to Vercel

### Method 1: GitHub Integration (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new
   - Sign in with your GitHub account

2. **Import Repository**
   - Select "Import Git Repository"
   - Choose your StudyAI repository: `ankurnit112-coder/StudyAI`
   - Click "Import"

3. **Configure Project**
   - Project Name: `studyai` (or your preferred name)
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

4. **Environment Variables**
   Add these in the Vercel dashboard:
   ```
   JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-nextauth-secret-key-for-production
   NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at: `https://your-project-name.vercel.app`

### Method 2: Vercel CLI

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? studyai
# - Directory? ./
```

### Method 3: Manual Upload

1. Build the project locally:
   ```bash
   npm run build
   ```

2. Upload the `.next` folder to Vercel dashboard

## 🔧 Post-Deployment Configuration

### 1. Custom Domain (Optional)
- Go to your project settings in Vercel
- Add your custom domain
- Configure DNS records as instructed

### 2. Environment Variables
Ensure these are set in Vercel dashboard:

**Required:**
- `JWT_SECRET`: Strong secret key (min 32 characters)
- `NEXTAUTH_URL`: Your deployed URL
- `NEXTAUTH_SECRET`: NextAuth secret key
- `NEXT_PUBLIC_API_URL`: Your deployed URL
- `NODE_ENV`: production

**Optional (for enhanced features):**
- `DATABASE_URL`: When you add a real database
- `REDIS_URL`: For rate limiting and caching
- `SMTP_*`: For email notifications

### 3. Verify Deployment

After deployment, test these endpoints:
- `https://your-domain.vercel.app` - Home page
- `https://your-domain.vercel.app/auth/signin` - Sign in
- `https://your-domain.vercel.app/auth/signup` - Sign up
- `https://your-domain.vercel.app/api/health` - API health check
- `https://your-domain.vercel.app/dashboard` - Dashboard (after login)

## 🔒 Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] NEXTAUTH_SECRET is set
- [ ] Environment variables are configured
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] Security headers are active
- [ ] Rate limiting is working

## 📊 Performance Optimization

Your app is already optimized with:
- ✅ Static page generation
- ✅ Code splitting
- ✅ Image optimization
- ✅ Bundle optimization
- ✅ Caching headers
- ✅ Compression enabled

## 🐛 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check environment variables are set
   - Verify all dependencies are installed
   - Check build logs in Vercel dashboard

2. **Authentication Not Working**
   - Verify JWT_SECRET is set
   - Check NEXTAUTH_URL matches your domain
   - Ensure API routes are accessible

3. **API Routes 404**
   - Verify file structure in `app/api/`
   - Check route.ts files are properly named
   - Ensure functions are exported correctly

## 📈 Monitoring

After deployment, monitor:
- Response times
- Error rates
- User authentication success
- API endpoint performance

## 🔄 Updates

To update your deployment:
1. Push changes to your GitHub repository
2. Vercel will automatically redeploy
3. Or use `vercel --prod` for manual deployment

## 🎯 Next Steps

After successful deployment:
1. Test all functionality
2. Set up monitoring
3. Configure custom domain
4. Add real database (optional)
5. Set up email service (optional)
6. Add analytics tracking