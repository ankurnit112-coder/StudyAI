#!/usr/bin/env node

/**
 * Supabase Migration Helper
 * Helps migrate from mock database to Supabase
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🗄️ StudyAI Supabase Migration Helper\n')

const checks = []

// Check 1: Supabase dependencies installed
function checkSupabaseDependencies() {
  const packagePath = path.join(process.cwd(), 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  
  const requiredDeps = ['@supabase/supabase-js', '@supabase/ssr']
  const hasAllDeps = requiredDeps.every(dep => 
    packageJson.dependencies[dep] || packageJson.devDependencies[dep]
  )
  
  checks.push({
    name: 'Supabase Dependencies',
    status: hasAllDeps ? 'PASS' : 'FAIL',
    message: hasAllDeps ? 'Supabase packages installed' : 'Run: npm install @supabase/supabase-js @supabase/ssr'
  })
}

// Check 2: Environment variables configured
function checkEnvironmentVariables() {
  const envLocal = fs.existsSync('.env.local')
  let hasSupabaseVars = false
  
  if (envLocal) {
    const envContent = fs.readFileSync('.env.local', 'utf8')
    hasSupabaseVars = envContent.includes('NEXT_PUBLIC_SUPABASE_URL') && 
                     envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  
  checks.push({
    name: 'Environment Variables',
    status: hasSupabaseVars ? 'PASS' : 'WARN',
    message: hasSupabaseVars ? 'Supabase environment variables configured' : 'Add Supabase environment variables to .env.local'
  })
}

// Check 3: Migration files exist
function checkMigrationFiles() {
  const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql')
  const exists = fs.existsSync(migrationPath)
  
  checks.push({
    name: 'Migration Files',
    status: exists ? 'PASS' : 'FAIL',
    message: exists ? 'Database migration file ready' : 'Migration file missing'
  })
}

// Check 4: Supabase configuration files
function checkSupabaseConfig() {
  const supabaseLib = fs.existsSync('lib/supabase.ts')
  const supabaseDatabase = fs.existsSync('lib/database-supabase.ts')
  
  const configsExist = supabaseLib && supabaseDatabase
  
  checks.push({
    name: 'Supabase Configuration',
    status: configsExist ? 'PASS' : 'FAIL',
    message: configsExist ? 'Supabase configuration files ready' : 'Missing Supabase configuration files'
  })
}

// Check 5: API routes updated
function checkApiRoutes() {
  const authRoutes = ['login', 'signup', 'logout', 'refresh', 'me']
  let routesUpdated = 0
  
  authRoutes.forEach(route => {
    const routePath = path.join(process.cwd(), 'app', 'api', 'auth', route, 'route.ts')
    if (fs.existsSync(routePath)) {
      const content = fs.readFileSync(routePath, 'utf8')
      if (content.includes('database-supabase')) {
        routesUpdated++
      }
    }
  })
  
  checks.push({
    name: 'API Routes Updated',
    status: routesUpdated === authRoutes.length ? 'PASS' : 'WARN',
    message: `${routesUpdated}/${authRoutes.length} auth routes updated for Supabase`
  })
}

// Check 6: New API endpoints
function checkNewApiEndpoints() {
  const newEndpoints = ['academic-records', 'study-sessions']
  const endpointsExist = newEndpoints.filter(endpoint => 
    fs.existsSync(path.join(process.cwd(), 'app', 'api', endpoint, 'route.ts'))
  )
  
  checks.push({
    name: 'New API Endpoints',
    status: endpointsExist.length === newEndpoints.length ? 'PASS' : 'WARN',
    message: `${endpointsExist.length}/${newEndpoints.length} new API endpoints created`
  })
}

// Generate migration checklist
function generateMigrationChecklist() {
  const checklist = `
# 📋 Supabase Migration Checklist

## Pre-Migration Steps
- [ ] Create Supabase project at https://supabase.com
- [ ] Copy Project URL and API keys
- [ ] Add environment variables to .env.local
- [ ] Run database migration in Supabase SQL Editor

## Environment Variables Needed
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
\`\`\`

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
`

  fs.writeFileSync('MIGRATION-CHECKLIST.md', checklist.trim())
  console.log('📋 Generated MIGRATION-CHECKLIST.md')
}

// Run all checks
function runChecks() {
  checkSupabaseDependencies()
  checkEnvironmentVariables()
  checkMigrationFiles()
  checkSupabaseConfig()
  checkApiRoutes()
  checkNewApiEndpoints()
  
  // Display results
  console.log('📋 Migration Readiness Check:\n')
  
  checks.forEach(check => {
    const icon = check.status === 'PASS' ? '✅' : check.status === 'WARN' ? '⚠️' : '❌'
    console.log(`${icon} ${check.name}: ${check.message}`)
  })
  
  const passed = checks.filter(c => c.status === 'PASS').length
  const warnings = checks.filter(c => c.status === 'WARN').length
  const failed = checks.filter(c => c.status === 'FAIL').length
  
  console.log(`\n📊 Summary: ${passed} passed, ${warnings} warnings, ${failed} failed`)
  
  if (failed === 0) {
    console.log('\n🚀 Ready for Supabase migration!')
    console.log('\nNext steps:')
    console.log('1. Create Supabase project at https://supabase.com')
    console.log('2. Add environment variables')
    console.log('3. Run database migration')
    console.log('4. Test the application')
    console.log('\nSee SUPABASE-SETUP.md for detailed instructions')
  } else {
    console.log('\n⚠️  Please fix the failed checks before migrating')
  }
  
  // Generate checklist
  generateMigrationChecklist()
}

// Run the checks
runChecks()