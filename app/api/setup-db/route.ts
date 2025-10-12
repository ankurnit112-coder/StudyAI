import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Check if tables exist
    const tables = ['users', 'user_sessions', 'academic_records', 'study_sessions', 'predictions', 'study_recommendations']
    const tableStatus = []
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*', { count: 'exact' })
          .limit(1)
        
        if (error) {
          tableStatus.push({ table, status: 'missing', error: error.message })
        } else {
          tableStatus.push({ table, status: 'exists', count: data?.length || 0 })
        }
      } catch (err) {
        tableStatus.push({ table, status: 'error', error: err instanceof Error ? err.message : 'Unknown error' })
      }
    }

    // Get user count
    let userCount = 0
    try {
      const { count } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
      userCount = count || 0
    } catch (error) {
      // Table doesn't exist yet
    }

    return NextResponse.json({
      status: 'success',
      message: 'Database status checked',
      supabaseUrl,
      tables: tableStatus,
      userCount,
      needsMigration: tableStatus.some(t => t.status === 'missing'),
      migrationInstructions: {
        step1: 'Go to your Supabase Dashboard → SQL Editor',
        step2: 'Copy the content from supabase/migrations/001_initial_schema.sql',
        step3: 'Paste it in the SQL Editor and click Run',
        step4: 'Refresh this endpoint to verify tables are created'
      }
    })

  } catch (error) {
    console.error('Database setup error:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Database setup failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}