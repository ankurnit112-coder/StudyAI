#!/usr/bin/env node

// Database migration runner
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Load environment variables
dotenv.config()

async function runMigration() {
  try {
    console.log('🚀 Running StudyAI Database Migration...\n')
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase environment variables')
      console.log('Please ensure these are set in your .env file:')
      console.log('- NEXT_PUBLIC_SUPABASE_URL')
      console.log('- SUPABASE_SERVICE_ROLE_KEY')
      return
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    console.log('✅ Connected to Supabase')
    console.log('🔗 URL:', supabaseUrl)
    
    // Read migration file
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql')
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Migration file not found:', migrationPath)
      return
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    console.log('📄 Migration file loaded:', migrationPath)
    
    // Note: Supabase client doesn't support raw SQL execution for security
    // The migration needs to be run through the Supabase Dashboard
    console.log('\n⚠️  IMPORTANT: Supabase requires manual migration execution')
    console.log('📋 Please follow these steps:')
    console.log('   1. Go to your Supabase Dashboard: https://supabase.com/dashboard')
    console.log('   2. Select your project: voikwzedrbvkqkzkknqu')
    console.log('   3. Go to SQL Editor')
    console.log('   4. Copy the content from: supabase/migrations/001_initial_schema.sql')
    console.log('   5. Paste it in the SQL Editor')
    console.log('   6. Click "Run" to execute the migration')
    
    // Test if tables already exist
    console.log('\n🔍 Checking if migration is needed...')
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .limit(1)
      
      if (!error) {
        console.log('✅ Tables already exist! Migration may have been run already.')
        console.log(`📊 Current user count: ${data?.length || 0}`)
        return
      }
    } catch (err) {
      console.log('📋 Tables not found - migration needed')
    }
    
    console.log('\n🔧 After running the migration, you can test with:')
    console.log('   npm run test:db')
    console.log('   npm run test:auth')
    
  } catch (error) {
    console.error('❌ Migration setup failed:', error.message)
  }
}

runMigration()