import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database-supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body
    
    if (action === 'test-signup') {
      // Test creating a user
      const testUser = await database.createUser({
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        password: 'test-password-123',
        role: 'student',
        currentClass: 12,
        schoolName: 'Test School',
        isActive: true,
        emailVerified: false,
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
      
      return NextResponse.json({
        status: 'success',
        message: 'Test user created successfully',
        user: {
          id: testUser.id,
          email: testUser.email,
          name: testUser.name
        }
      })
    }
    
    if (action === 'test-login') {
      // Test getting a user
      const user = await database.getUserByEmail('test@example.com')
      
      return NextResponse.json({
        status: 'success',
        message: 'User lookup successful',
        userExists: !!user,
        user: user ? {
          id: user.id,
          email: user.email,
          name: user.name
        } : null
      })
    }
    
    return NextResponse.json({
      status: 'error',
      message: 'Invalid action'
    }, { status: 400 })
    
  } catch (error) {
    console.error('Auth test error:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Authentication test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}