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
    // In a real implementation, you would check your database connection
    // For now, we'll simulate a database check
    return 'healthy'
  } catch {
    return 'unhealthy'
  }
}

async function checkMLBackend(): Promise<string> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    
    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    const response = await fetch(`${backendUrl}/health`, {
      method: 'GET',
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    
    if (response.ok) {
      return 'healthy'
    } else {
      return 'unhealthy'
    }
  } catch {
    return 'unhealthy'
  }
}