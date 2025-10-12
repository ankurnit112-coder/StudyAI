import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database-supabase'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body
    
    if (action === 'test-signup') {
      // Test creating a user
      const testEmail = `test-${Date.now()}@example.com`
      const testUser = await database.createUser({
        email: testEmail,
        name: 'Test User',
        password: 'TestPassword123!',
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
          name: testUser.name,
          role: testUser.role,
          currentClass: testUser.currentClass
        }
      })
    }
    
    if (action === 'test-login') {
      // Test getting a user and password verification
      const user = await database.getUserByEmailWithPassword('test@example.com')
      
      if (!user) {
        return NextResponse.json({
          status: 'info',
          message: 'Default test user not found',
          suggestion: 'Try creating a user first or use the signup endpoint'
        })
      }
      
      // Test password verification
      const isValidPassword = await bcrypt.compare('password', user.password)
      
      return NextResponse.json({
        status: 'success',
        message: 'User lookup and password verification successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        passwordValid: isValidPassword
      })
    }
    
    if (action === 'test-stats') {
      // Test getting user stats
      const stats = await database.getUserStats()
      
      return NextResponse.json({
        status: 'success',
        message: 'Database stats retrieved successfully',
        stats
      })
    }
    
    if (action === 'cleanup-test-users') {
      // This would require a custom cleanup function
      return NextResponse.json({
        status: 'info',
        message: 'Cleanup functionality not implemented for safety',
        suggestion: 'Test users can be removed manually from Supabase dashboard'
      })
    }
    
    return NextResponse.json({
      status: 'error',
      message: 'Invalid action',
      availableActions: ['test-signup', 'test-login', 'test-stats', 'cleanup-test-users']
    }, { status: 400 })
    
  } catch (error) {
    console.error('Auth test error:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Authentication test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      suggestion: 'Check if database tables exist and Supabase credentials are correct'
    }, { status: 500 })
  }
}