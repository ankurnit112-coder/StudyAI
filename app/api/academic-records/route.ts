import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { database } from '@/lib/database-supabase'
import { SecurityUtils } from '@/lib/security'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

// GET /api/academic-records - Get user's academic records
export async function GET(request: NextRequest) {
  const ip = SecurityUtils.getClientIP(request)
  const userAgent = request.headers.get('user-agent') || ''

  try {
    // Rate limiting
    const rateLimitCheck = SecurityUtils.checkRateLimit(`academic-records:${ip}`, 30, 60 * 1000) // 30 per minute
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

    // Get user's academic records
    const records = await database.getUserAcademicRecords(userId)

    return NextResponse.json({
      records: records.map(record => ({
        id: record.id,
        subject: record.subject,
        marks: record.marks,
        maxMarks: record.max_marks,
        examType: record.exam_type,
        examDate: record.exam_date,
        createdAt: record.created_at
      }))
    })

  } catch (error) {
    console.error('Academic records fetch error:', error)
    SecurityUtils.logSecurityEvent({
      type: 'suspicious_activity',
      ip,
      userAgent,
      details: { endpoint: 'academic-records', error: error instanceof Error ? error.message : 'unknown' }
    })
    
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/academic-records - Create new academic record
export async function POST(request: NextRequest) {
  const ip = SecurityUtils.getClientIP(request)
  const userAgent = request.headers.get('user-agent') || ''

  try {
    // Rate limiting
    const rateLimitCheck = SecurityUtils.checkRateLimit(`academic-records-create:${ip}`, 10, 60 * 1000) // 10 per minute
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
    const { subject, marks, maxMarks, examType, examDate } = body

    // Validate input
    if (!subject || marks === undefined || !maxMarks || !examType || !examDate) {
      return NextResponse.json(
        { detail: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (marks < 0 || maxMarks <= 0 || marks > maxMarks) {
      return NextResponse.json(
        { detail: 'Invalid marks values' },
        { status: 400 }
      )
    }

    // Create academic record
    const record = await database.createAcademicRecord({
      userId,
      subject,
      marks,
      maxMarks,
      examType,
      examDate: new Date(examDate)
    })

    return NextResponse.json({
      record: {
        id: record.id,
        subject: record.subject,
        marks: record.marks,
        maxMarks: record.max_marks,
        examType: record.exam_type,
        examDate: record.exam_date,
        createdAt: record.created_at
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Academic record creation error:', error)
    SecurityUtils.logSecurityEvent({
      type: 'suspicious_activity',
      ip,
      userAgent,
      details: { endpoint: 'academic-records-create', error: error instanceof Error ? error.message : 'unknown' }
    })
    
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    )
  }
}