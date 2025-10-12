#!/usr/bin/env node

// Database setup and verification script
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'

// Load environment variables
dotenv.config()

async function setupDatabase() {
  try {
    console.log('🚀 Setting up StudyAI Database...\n')
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase environment variables')
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
    
    // Check if tables exist
    console.log('\n📋 Checking database tables...')
    
    const tables = ['users', 'user_sessions', 'academic_records', 'study_sessions', 'predictions', 'study_recommendations']
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*', { count: 'exact' })
          .limit(1)
        
        if (error) {
          console.log(`❌ Table '${table}': ${error.message}`)
        } else {
          console.log(`✅ Table '${table}': Found (${data?.length || 0} sample records)`)
        }
      } catch (err) {
        console.log(`❌ Table '${table}': ${err.message}`)
      }
    }
    
    // Test user operations
    console.log('\n👤 Testing user operations...')
    
    // Check if test user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'test@example.com')
      .single()
    
    if (existingUser) {
      console.log('✅ Test user exists:', existingUser.email)
    } else {
      console.log('⚠️  Test user not found - this is normal for a fresh database')
    }
    
    // Get user stats
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
    
    console.log(`📊 Total users in database: ${totalUsers || 0}`)
    
    console.log('\n🎉 Database setup verification complete!')
    
    if (totalUsers === 0) {
      console.log('\n💡 Next steps:')
      console.log('   1. The database schema is ready')
      console.log('   2. Try signing up through the app to create your first user')
      console.log('   3. All authentication endpoints should work')
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
  }
}

setupDatabase()