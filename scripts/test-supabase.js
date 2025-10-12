// Simple script to test Supabase connection
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase environment variables')
      console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
      console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅ Set' : '❌ Missing')
      return
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    // Test connection by querying users table
    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .limit(1)
    
    if (error) {
      console.error('❌ Database connection failed:', error.message)
      return
    }
    
    console.log('✅ Database connection successful!')
    console.log(`📊 Total users in database: ${count}`)
    
    if (data && data.length > 0) {
      console.log('👤 Sample user found:', {
        id: data[0].id,
        email: data[0].email,
        name: data[0].name
      })
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
  }
}

testSupabaseConnection()