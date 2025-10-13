import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database-supabase'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()
    
    console.log('Test signup - Input:', { email, name, passwordLength: password?.length })
    
    // Check if user already exists
    const existingUser = await database.getUserByEmail(email)
    console.log('Existing user check:', existingUser ? 'User exists' : 'User does not exist')
    
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'User already exists',
        existingUser: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name
        }
      })
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log('Password hashed successfully')
    
    // Create user
    const newUser = await database.createUser({
      email: email.toLowerCase(),
      name: name.trim(),
      password: hashedPassword,
      role: 'student',
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
    
    console.log('User created:', { id: newUser.id, email: newUser.email })
    
    // Test login immediately
    const loginUser = await database.getUserByEmailWithPassword(email)
    console.log('Login test - User found:', loginUser ? 'Yes' : 'No')
    
    if (loginUser) {
      const passwordMatch = await bcrypt.compare(password, loginUser.password)
      console.log('Password match test:', passwordMatch)
      
      return NextResponse.json({
        success: true,
        message: 'User created and login test successful',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name
        },
        loginTest: {
          userFound: true,
          passwordMatch
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'User created but login test failed',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name
        },
        loginTest: {
          userFound: false,
          passwordMatch: false
        }
      })
    }
    
  } catch (error) {
    console.error('Test signup error:', error)
    return NextResponse.json({
      success: false,
      message: 'Test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test signup endpoint - use POST with email, password, and name'
  })
}