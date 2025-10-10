import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { database } from '@/lib/database'
import { Validator } from '@/lib/validation'
import { SecurityUtils } from '@/lib/security'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

interface SignupRequest {
  name: string
  email: string
  password: string
  role: 'student'
  currentClass?: number
  schoolName?: string
}

export async function POST(request: NextRequest) {
  const ip = SecurityUtils.getClientIP(request)
  const userAgent = request.headers.get('user-agent') || ''
  
  try {
    // Rate limiting for signup
    const rateLimitCheck = SecurityUtils.checkRateLimit(`signup:${ip}`, 3, 60 * 60 * 1000) // 3 per hour
    if (!rateLimitCheck.allowed) {
      SecurityUtils.logSecurityEvent({
        type: 'rate_limit_exceeded',
        ip,
        userAgent,
        details: { endpoint: 'signup' }
      })
      
      return NextResponse.json(
        { detail: 'Too many signup attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body: SignupRequest = await request.json()
    const { name, email, password, role, currentClass, schoolName } = body

    // Comprehensive validation (skip confirmPassword check for API)
    const validation = Validator.validateSignupData({
      name,
      email,
      password,
      confirmPassword: password, // API assumes frontend already validated this
      role,
      currentClass,
      schoolName
    })

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

    // Check if user already exists
    const existingUser = await database.getUserByEmail(email)
    if (existingUser) {
      SecurityUtils.logSecurityEvent({
        type: 'signup_attempt',
        ip,
        userAgent,
        details: { email, success: false, reason: 'email_exists' }
      })
      
      return NextResponse.json(
        { detail: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const newUser = await database.createUser({
      email: email.toLowerCase(),
      name: SecurityUtils.sanitizeInput(name.trim()),
      password: hashedPassword,
      role,
      currentClass,
      schoolName: schoolName ? SecurityUtils.sanitizeInput(schoolName) : undefined,
      isActive: true,
      emailVerified: false, // In production, implement email verification
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      }
    })

    // Create tokens (signup defaults to remember me for better UX)
    const accessToken = await new SignJWT({
      sub: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      current_class: newUser.currentClass,
      school_name: newUser.schoolName,
      remember_me: true
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    const refreshToken = await new SignJWT({
      sub: newUser.id,
      type: 'refresh',
      remember_me: true
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(JWT_SECRET)

    // Set secure HTTP-only cookies
    const cookieStore = cookies()
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    }

    cookieStore.set('access_token', accessToken, cookieOptions)
    cookieStore.set('refresh_token', refreshToken, cookieOptions)

    // Create session record
    await database.createSession({
      userId: newUser.id,
      refreshToken,
      deviceInfo: SecurityUtils.getDeviceFingerprint(request),
      ipAddress: ip,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      isActive: true
    })

    // Log successful signup
    SecurityUtils.logSecurityEvent({
      type: 'signup_attempt',
      ip,
      userAgent,
      details: { email: newUser.email, success: true }
    })

    // TODO: Send welcome email and email verification
    // await sendWelcomeEmail(newUser.email, newUser.name)
    // await sendEmailVerification(newUser.email, newUser.id)

    return NextResponse.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: 7 * 24 * 60 * 60, // 7 days in seconds
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        currentClass: newUser.currentClass,
        schoolName: newUser.schoolName,
        emailVerified: newUser.emailVerified
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Signup error:', error)
    SecurityUtils.logSecurityEvent({
      type: 'signup_attempt',
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