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

    // Check current status
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

    const missingTables = tableStatus.filter(t => t.status === 'missing')
    const existingTables = tableStatus.filter(t => t.status === 'exists')

    return NextResponse.json({
      status: missingTables.length > 0 ? 'needs_migration' : 'ready',
      message: missingTables.length > 0 
        ? 'Database needs migration - tables are missing' 
        : 'Database is ready - all tables exist',
      supabaseUrl,
      summary: {
        total: tables.length,
        existing: existingTables.length,
        missing: missingTables.length
      },
      tables: tableStatus,
      instructions: missingTables.length > 0 ? {
        title: "Quick Fix Instructions",
        steps: [
          "1. Go to your Supabase Dashboard → SQL Editor",
          "2. Click 'New Query'",
          "3. Copy content from supabase/migrations/001_initial_schema.sql",
          "4. Paste it in SQL Editor and click 'Run'",
          "5. Refresh this endpoint to verify"
        ],
        migrationFile: "supabase/migrations/001_initial_schema.sql",
        dashboardUrl: `${supabaseUrl.replace('https://', 'https://app.')}/project/_/sql`
      } : null
    })

  } catch (error) {
    console.error('Database fix check error:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Failed to check database status',
      error: error instanceof Error ? error.message : 'Unknown error',
      instructions: {
        title: "Manual Fix Required",
        steps: [
          "1. Check your environment variables (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)",
          "2. Go to Supabase Dashboard → SQL Editor",
          "3. Run the migration from supabase/migrations/001_initial_schema.sql"
        ]
      }
    }, { status: 500 })
  }
}

export async function GET() {
  return POST() // Same logic for GET requests
}