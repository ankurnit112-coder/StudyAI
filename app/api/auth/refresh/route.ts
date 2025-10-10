import { NextRequest, NextResponse } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { database } from '@/lib/database'
import { SecurityUtils } from '@/lib/security'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

interface RefreshRequest {
  refresh_token: string
}

export async function POST(request: NextRequest) {
  const ip = SecurityUtils.getClientIP(request)
  // userAgent currently unused but kept for future logging implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const userAgent = request.headers.get('user-agent') || ''
  
  try {
    // Rate limiting for refresh requests
    const rateLimitCheck = SecurityUtils.checkRateLimit(`refresh:${ip}`, 10, 60 * 1000) // 10 per minute
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { detail: 'Too many refresh attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body: RefreshRequest = await request.json()
    const { refresh_token } = body

    if (!refresh_token) {
      return NextResponse.json(
        { detail: 'Refresh token is required' },
        { status: 400 }
      )
    }

    // Verify refresh token
    const { payload } = await jwtVerify(refresh_token, JWT_SECRET)
    
    if (payload.type !== 'refresh') {
      return NextResponse.json(
        { detail: 'Invalid token type' },
        { status: 401 }
      )
    }

    const userId = parseInt(payload.sub as string)
    
    // Find user by ID
    const user = await database.getUserById(userId)
    if (!user || !user.isActive) {
      return NextResponse.json(
        { detail: 'User not found or inactive' },
        { status: 401 }
      )
    }

    const rememberMe = payload.remember_me as boolean

    // Create new access token
    const accessTokenExpiry = rememberMe ? '7d' : '1h'
    const accessToken = await new SignJWT({
      sub: user.id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      current_class: user.currentClass,
      school_name: user.schoolName,
      remember_me: rememberMe
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(accessTokenExpiry)
      .sign(JWT_SECRET)

    // Create new refresh token (rotate refresh tokens for security)
    const refreshTokenExpiry = rememberMe ? '30d' : '7d'
    const newRefreshToken = await new SignJWT({
      sub: user.id.toString(),
      type: 'refresh',
      remember_me: rememberMe
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(refreshTokenExpiry)
      .sign(JWT_SECRET)

    // Update cookies
    const cookieStore = await cookies()
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60
    }

    cookieStore.set('access_token', accessToken, cookieOptions)
    cookieStore.set('refresh_token', newRefreshToken, cookieOptions)

    return NextResponse.json({
      access_token: accessToken,
      refresh_token: newRefreshToken,
      token_type: 'Bearer',
      expires_in: rememberMe ? 7 * 24 * 60 * 60 : 60 * 60
    })

  } catch (error) {
    console.error('Token refresh error:', error)
    
    // Clear invalid cookies
    const cookieStore = await cookies()
    cookieStore.delete('access_token')
    cookieStore.delete('refresh_token')
    
    return NextResponse.json(
      { detail: 'Invalid or expired refresh token' },
      { status: 401 }
    )
  }
}