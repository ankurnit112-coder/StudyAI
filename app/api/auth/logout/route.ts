import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { database } from '@/lib/database-supabase'
import { SecurityUtils } from '@/lib/security'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

// In production, maintain a blacklist of invalidated tokens
const tokenBlacklist = new Set<string>()

export async function POST(request: NextRequest) {
  const ip = SecurityUtils.getClientIP(request)
  const userAgent = request.headers.get('user-agent') || ''
  
  try {
    const authHeader = request.headers.get('authorization')
    const cookieStore = await cookies()
    
    // Get token from header or cookies
    let token = authHeader?.replace('Bearer ', '')
    if (!token) {
      token = cookieStore.get('access_token')?.value
    }

    let userId: string | null = null

    if (token) {
      try {
        // Verify token before blacklisting
        const { payload } = await jwtVerify(token, JWT_SECRET)
        userId = payload.sub as string
        
        // Add token to blacklist (in production, use Redis or database)
        tokenBlacklist.add(token)
        
        // Also blacklist refresh token if available
        const refreshToken = cookieStore.get('refresh_token')?.value
        if (refreshToken) {
          tokenBlacklist.add(refreshToken)
          
          // Invalidate all sessions for this user
          if (userId) {
            await database.invalidateAllUserSessions(userId)
          }
        }
      } catch {
        // Token is already invalid, no need to blacklist
        console.log('Token already invalid during logout')
      }
    }

    // Log logout event
    if (userId) {
      SecurityUtils.logSecurityEvent({
        type: 'login_attempt', // Using login_attempt type for logout as well
        ip,
        userAgent,
        details: { userId, action: 'logout', success: true }
      })
    }

    // Clear HTTP-only cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/',
      maxAge: 0 // Expire immediately
    }

    cookieStore.set('access_token', '', cookieOptions)
    cookieStore.set('refresh_token', '', cookieOptions)

    return NextResponse.json({
      message: 'Successfully logged out'
    })

  } catch (error) {
    console.error('Logout error:', error)
    
    // Still clear cookies even if there's an error
    const cookieStore = await cookies()
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/',
      maxAge: 0
    }

    cookieStore.set('access_token', '', cookieOptions)
    cookieStore.set('refresh_token', '', cookieOptions)

    return NextResponse.json({
      message: 'Logged out with errors'
    }, { status: 200 }) // Still return success for UX
  }
}

// Utility function to check if token is blacklisted (internal use only)
// Currently unused but kept for future implementation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isTokenBlacklisted(token: string): boolean {
  return tokenBlacklist.has(token)
}