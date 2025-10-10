import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { database } from '@/lib/database'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const cookieStore = await cookies()
    
    // Get token from header or cookies
    let token = authHeader?.replace('Bearer ', '')
    if (!token) {
      token = cookieStore.get('access_token')?.value
    }

    if (!token) {
      return NextResponse.json(
        { detail: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userId = parseInt(payload.sub as string)

    // Find user
    const user = await database.getUserById(userId)
    if (!user || !user.isActive) {
      return NextResponse.json(
        { detail: 'User not found or inactive' },
        { status: 401 }
      )
    }

    // Return user info (excluding sensitive data)
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      currentClass: user.currentClass,
      schoolName: user.schoolName,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    })

  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { detail: 'Invalid or expired token' },
      { status: 401 }
    )
  }
}