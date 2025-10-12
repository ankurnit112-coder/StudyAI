import { NextResponse } from 'next/server'
import { database } from '@/lib/database-supabase'

export async function GET() {
  try {
    // Test database connection by getting user stats
    const stats = await database.getUserStats()
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      stats,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database test error:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}