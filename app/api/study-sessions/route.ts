import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { database } from '@/lib/database-supabase'
import { SecurityUtils } from '@/lib/security'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

// GET /api/study-sessions - Get user's study sessions
export async function GET(request: NextRequest) {
  const ip = SecurityUtils.getClientIP(request)
  const userAgent = request.headers.get('user-agent') || ''

  try {
    // Rate limiting
    const rateLimitCheck = SecurityUtils.checkRateLimit(`study-sessions:${ip}`, 30, 60 * 1000) // 30 per minute
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { detail: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Get token from header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { detail: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userId = payload.sub as string

    // Get user's study sessions
    const sessions = await database.getUserStudySessions(userId)

    return NextResponse.json({
      sessions: sessions.map(session => ({
        id: session.id,
        subject: session.subject,
        durationMinutes: session.duration_minutes,
        topicsCovered: session.topics_covered,
        sessionDate: session.session_date,
        createdAt: session.created_at
      }))
    })

  } catch (error) {
    console.error('Study sessions fetch error:', error)
    SecurityUtils.logSecurityEvent({
      type: 'suspicious_activity',
      ip,
      userAgent,
      details: { endpoint: 'study-sessions', error: error instanceof Error ? error.message : 'unknown' }
    })
    
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/study-sessions - Create new study session
export async function POST(request: NextRequest) {
  const ip = SecurityUtils.getClientIP(request)
  const userAgent = request.headers.get('user-agent') || ''

  try {
    // Rate limiting
    const rateLimitCheck = SecurityUtils.checkRateLimit(`study-sessions-create:${ip}`, 20, 60 * 1000) // 20 per minute
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { detail: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Get token from header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { detail: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userId = payload.sub as string

    // Parse request body
    const body = await request.json()
    const { subject, durationMinutes, topicsCovered, sessionDate } = body

    // Validate input
    if (!subject || !durationMinutes || !sessionDate) {
      return NextResponse.json(
        { detail: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (durationMinutes <= 0) {
      return NextResponse.json(
        { detail: 'Duration must be positive' },
        { status: 400 }
      )
    }

    // Create study session
    const session = await database.createStudySession({
      userId,
      subject,
      durationMinutes,
      topicsCovered: topicsCovered || [],
      sessionDate: new Date(sessionDate)
    })

    return NextResponse.json({
      session: {
        id: session.id,
        subject: session.subject,
        durationMinutes: session.duration_minutes,
        topicsCovered: session.topics_covered,
        sessionDate: session.session_date,
        createdAt: session.created_at
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Study session creation error:', error)
    SecurityUtils.logSecurityEvent({
      type: 'suspicious_activity',
      ip,
      userAgent,
      details: { endpoint: 'study-sessions-create', error: error instanceof Error ? error.message : 'unknown' }
    })
    
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    )
  }
}