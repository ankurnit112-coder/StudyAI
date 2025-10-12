#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'

// Load environment variables
dotenv.config()

async function migrateDatabase() {
  try {
    console.log('🚀 Starting StudyAI Database Migration...\n')
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase environment variables')
      console.log('Please ensure these are set in your .env.local:')
      console.log('- NEXT_PUBLIC_SUPABASE_URL')
      console.log('- SUPABASE_SERVICE_ROLE_KEY')
      return false
    }
    
    console.log('✅ Environment variables found')
    console.log('🔗 Supabase URL:', supabaseUrl)
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    console.log('✅ Connected to Supabase')
    
    // Read the migration file
    console.log('📄 Reading migration file...')
    const migrationSQL = fs.readFileSync('supabase/migrations/001_initial_schema.sql', 'utf8')
    
    // Split SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && s !== '')
    
    console.log(`📊 Found ${statements.length} SQL statements to execute\n`)
    
    let successCount = 0
    let errorCount = 0
    const errors = []
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      const statementPreview = statement.substring(0, 50).replace(/\s+/g, ' ') + '...'
      
      try {
        console.log(`⏳ [${i + 1}/${statements.length}] ${statementPreview}`)
        
        // Use the SQL query method
        const { data, error } = await supabase.rpc('exec_sql', { 
          query: statement + ';' 
        }).catch(async () => {
          // Fallback: try direct query for simple statements
          if (statement.toUpperCase().startsWith('CREATE TABLE') || 
              statement.toUpperCase().startsWith('CREATE EXTENSION') ||
              statement.toUpperCase().startsWith('CREATE TYPE') ||
              statement.toUpperCase().startsWith('CREATE INDEX')) {
            return await supabase.from('_').select('*').limit(0) // This will fail but we can catch specific errors
          }
          throw new Error('Cannot execute statement')
        })
        
        if (error) {
          console.log(`   ❌ Error: ${error.message}`)
          errors.push({ statement: statementPreview, error: error.message })
          errorCount++
        } else {
          console.log(`   ✅ Success`)
          successCount++
        }
      } catch (err) {
        console.log(`   ⚠️  Skipped: ${err.message}`)
        errorCount++
        errors.push({ statement: statementPreview, error: err.message })
      }
    }
    
    console.log(`\n📊 Migration Results:`)
    console.log(`   ✅ Successful: ${successCount}`)
    console.log(`   ❌ Failed: ${errorCount}`)
    
    if (errors.length > 0) {
      console.log(`\n⚠️  Errors encountered:`)
      errors.forEach((err, i) => {
        console.log(`   ${i + 1}. ${err.statement}`)
        console.log(`      Error: ${err.error}`)
      })
    }
    
    // Verify tables were created
    console.log('\n🔍 Verifying database tables...')
    
    const tables = ['users', 'user_sessions', 'academic_records', 'study_sessions', 'predictions', 'study_recommendations']
    let tablesCreated = 0
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*', { count: 'exact' })
          .limit(1)
        
        if (error) {
          console.log(`   ❌ Table '${table}': ${error.message}`)
        } else {
          console.log(`   ✅ Table '${table}': Ready`)
          tablesCreated++
        }
      } catch (err) {
        console.log(`   ❌ Table '${table}': ${err.message}`)
      }
    }
    
    console.log(`\n🎯 Tables Status: ${tablesCreated}/${tables.length} created`)
    
    if (tablesCreated === tables.length) {
      console.log('\n🎉 Database migration completed successfully!')
      console.log('🚀 Your authentication system is now ready to use!')
      return true
    } else {
      console.log('\n⚠️  Some tables were not created. Manual intervention may be required.')
      console.log('\n💡 Manual Migration Instructions:')
      console.log('1. Go to your Supabase Dashboard → SQL Editor')
      console.log('2. Copy the entire content from supabase/migrations/001_initial_schema.sql')
      console.log('3. Paste it in the SQL Editor and click Run')
      console.log('4. All tables should be created successfully')
      return false
    }
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message)
    console.log('\n💡 Please try the manual migration approach:')
    console.log('1. Go to your Supabase Dashboard → SQL Editor')
    console.log('2. Copy content from supabase/migrations/001_initial_schema.sql')
    console.log('3. Paste and run in SQL Editor')
    return false
  }
}

// Run the migration
migrateDatabase().then(success => {
  if (success) {
    console.log('\n✨ Migration complete! Try signing up in your app now.')
  } else {
    console.log('\n🔧 Please complete the migration manually as described above.')
  }
  process.exit(success ? 0 : 1)
})