import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { database } from '@/lib/database-supabase'
import { Validator } from '@/lib/validation'
import { SecurityUtils } from '@/lib/security'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export async function POST(request: NextRequest) {
  const ip = SecurityUtils.getClientIP(request)
  const userAgent = request.headers.get('user-agent') || ''
  
  try {
    // Check for suspicious activity
    const suspiciousCheck = SecurityUtils.detectSuspiciousActivity(request)
    if (suspiciousCheck.suspicious) {
      SecurityUtils.logSecurityEvent({
        type: 'suspicious_activity',
        ip,
        userAgent,
        details: { reasons: suspiciousCheck.reasons }
      })
    }

    // Rate limiting
    const rateLimitCheck = SecurityUtils.checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000)
    if (!rateLimitCheck.allowed) {
      SecurityUtils.logSecurityEvent({
        type: 'rate_limit_exceeded',
        ip,
        userAgent,
        details: { endpoint: 'login' }
      })
      
      return NextResponse.json(
        { detail: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body: LoginRequest = await request.json()
    const { email, password, rememberMe = false } = body

    // Validate input
    const validation = Validator.validateLoginData({ email, password })
    if (!validation.isValid) {
      return NextResponse.json(
        { detail: validation.errors[0] },
        { status: 400 }
      )
    }

    // Security check on password
    const passwordSecurity = SecurityUtils.validatePasswordSecurity(password)
    if (!passwordSecurity.secure) {
      SecurityUtils.logSecurityEvent({
        type: 'suspicious_activity',
        ip,
        userAgent,
        details: { warnings: passwordSecurity.warnings, email }
      })
    }

    // Check if account is locked
    const isLocked = await database.isAccountLocked(email)
    if (isLocked) {
      return NextResponse.json(
        { detail: 'Account is temporarily locked due to multiple failed attempts. Please try again later.' },
        { status: 423 }
      )
    }

    // Find user with password hash
    console.log('Looking for user with email:', email.toLowerCase())
    const user = await database.getUserByEmailWithPassword(email)
    console.log('User found:', user ? 'Yes' : 'No')
    
    if (!user) {
      await database.incrementLoginAttempts(email)
      SecurityUtils.logSecurityEvent({
        type: 'login_attempt',
        ip,
        userAgent,
        details: { email, success: false, reason: 'user_not_found' }
      })
      
      return NextResponse.json(
        { detail: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if user is active
    if (!user.isActive) {
      SecurityUtils.logSecurityEvent({
        type: 'login_attempt',
        ip,
        userAgent,
        details: { email, success: false, reason: 'account_inactive' }
      })
      
      return NextResponse.json(
        { detail: 'Account is deactivated. Please contact support.' },
        { status: 401 }
      )
    }

    // Verify password
    console.log('Verifying password for user:', user.email)
    const isValidPassword = await bcrypt.compare(password, user.password)
    console.log('Password valid:', isValidPassword)
    
    if (!isValidPassword) {
      await database.incrementLoginAttempts(email)
      SecurityUtils.logSecurityEvent({
        type: 'login_attempt',
        ip,
        userAgent,
        details: { email, success: false, reason: 'invalid_password' }
      })
      
      return NextResponse.json(
        { detail: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Update last login
    await database.updateLastLogin(user.id)

    // Create tokens with different expiration based on rememberMe
    const accessTokenExpiry = rememberMe ? '7d' : '1h'
    const refreshTokenExpiry = rememberMe ? '30d' : '7d'

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

    const refreshToken = await new SignJWT({
      sub: user.id.toString(),
      type: 'refresh',
      remember_me: rememberMe
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(refreshTokenExpiry)
      .sign(JWT_SECRET)

    // Set secure HTTP-only cookies for additional security
    const cookieStore = await cookies()
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60 // 30 days or 7 days
    }

    cookieStore.set('access_token', accessToken, cookieOptions)
    cookieStore.set('refresh_token', refreshToken, cookieOptions)

    // Create session record
    await database.createSession({
      userId: user.id,
      refreshToken,
      deviceInfo: SecurityUtils.getDeviceFingerprint(request),
      ipAddress: ip,
      expiresAt: new Date(Date.now() + (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000),
      isActive: true
    })

    // Log successful login
    SecurityUtils.logSecurityEvent({
      type: 'login_attempt',
      ip,
      userAgent,
      details: { email, success: true, rememberMe }
    })

    return NextResponse.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: rememberMe ? 7 * 24 * 60 * 60 : 60 * 60, // seconds
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        currentClass: user.currentClass,
        schoolName: user.schoolName,
        emailVerified: user.emailVerified
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    SecurityUtils.logSecurityEvent({
      type: 'login_attempt',
      ip,
      userAgent,
      details: { success: false, error: error instanceof Error ? error.message : 'unknown' }
    })
    
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    )
  }
}