import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

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

    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

    // Check current table status
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
      status: 'ready_for_migration',
      message: 'Database migration information prepared',
      supabaseUrl,
      dashboardUrl: `${supabaseUrl.replace('https://', 'https://app.')}/project/_/sql`,
      summary: {
        total: tables.length,
        existing: existingTables.length,
        missing: missingTables.length,
        needsMigration: missingTables.length > 0
      },
      tables: tableStatus,
      migrationSQL: migrationSQL,
      instructions: {
        title: "Database Migration Steps",
        steps: [
          {
            step: 1,
            title: "Open Supabase Dashboard",
            description: "Go to your Supabase project dashboard",
            action: `Visit: ${supabaseUrl.replace('https://', 'https://app.')}/project/_/sql`
          },
          {
            step: 2,
            title: "Open SQL Editor",
            description: "Click on 'SQL Editor' in the left sidebar"
          },
          {
            step: 3,
            title: "Create New Query",
            description: "Click 'New Query' button"
          },
          {
            step: 4,
            title: "Copy Migration SQL",
            description: "Copy the SQL provided in this response"
          },
          {
            step: 5,
            title: "Execute Migration",
            description: "Paste the SQL and click 'Run' or press Ctrl+Enter"
          },
          {
            step: 6,
            title: "Verify Success",
            description: "Check that all tables are created successfully"
          }
        ],
        expectedResults: [
          "✅ CREATE EXTENSION (uuid-ossp)",
          "✅ CREATE TYPE (user_role, theme_type)",
          "✅ CREATE TABLE (users, user_sessions, academic_records, study_sessions, predictions, study_recommendations)",
          "✅ CREATE INDEX (multiple indexes for performance)",
          "✅ CREATE FUNCTION (helper functions)"
        ]
      }
    })

  } catch (error) {
    console.error('Migration preparation error:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Failed to prepare migration',
      error: error instanceof Error ? error.message : 'Unknown error',
      fallbackInstructions: {
        title: "Manual Migration Required",
        steps: [
          "1. Check your environment variables",
          "2. Go to Supabase Dashboard → SQL Editor",
          "3. Copy content from supabase/migrations/001_initial_schema.sql",
          "4. Paste and run in SQL Editor"
        ]
      }
    }, { status: 500 })
  }
}

export async function GET() {
  return POST() // Same logic for GET requests
}