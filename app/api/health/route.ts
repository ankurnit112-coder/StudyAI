import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check application health
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
      },
      checks: {
        api: 'healthy',
        database: await checkDatabase(),
        ml_backend: await checkMLBackend(),
      }
    }

    // Determine overall health status
    const allChecksHealthy = Object.values(healthCheck.checks).every(
      status => status === 'healthy'
    )

    return NextResponse.json(
      healthCheck,
      { status: allChecksHealthy ? 200 : 503 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    )
  }
}

async function checkDatabase(): Promise<string> {
  try {
    // Test actual Supabase connection
    const { database } = await import('@/lib/database-supabase')
    
    // Try to get user stats to test database connectivity
    const stats = await database.getUserStats()
    
    // If we can get stats, database is working
    if (typeof stats.totalUsers === 'number') {
      return 'healthy'
    }
    
    return 'unhealthy - connection failed'
  } catch (error) {
    console.error('Database health check error:', error)
    return `unhealthy - ${error instanceof Error ? error.message : 'unknown error'}`
  }
}

async function checkMLBackend(): Promise<string> {
  try {
    // For now, we don't have a separate ML backend, so we'll mark it as healthy
    // In the future, this would check an actual ML service
    return 'healthy'
  } catch {
    return 'unhealthy'
  }
}