import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database-supabase'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { action, email, newPassword } = await request.json()
    
    if (action === 'reset-password' && email && newPassword) {
      // Reset password for a specific user
      const hashedPassword = await bcrypt.hash(newPassword, 12)
      
      // Update the user's password with properly hashed version
      const result = await database.updateUserPassword(email, hashedPassword)
      
      if (result) {
        // Reset login attempts
        await database.resetLoginAttempts(email)
        
        return NextResponse.json({
          success: true,
          message: 'Password reset successfully',
          email
        })
      } else {
        return NextResponse.json({
          success: false,
          message: 'User not found'
        }, { status: 404 })
      }
    }
    
    if (action === 'fix-all-users') {
      // This is a one-time fix for all existing users with double-hashed passwords
      // Set a default password that users can change later
      const defaultPassword = 'TempPassword123!'
      const hashedPassword = await bcrypt.hash(defaultPassword, 12)
      
      const result = await database.fixExistingUsersPasswords(hashedPassword)
      
      return NextResponse.json({
        success: true,
        message: 'All existing users fixed',
        defaultPassword: defaultPassword,
        affectedUsers: result,
        instructions: [
          'All existing users now have the temporary password: TempPassword123!',
          'Users should log in with this password and change it immediately',
          'New signups will continue to work normally'
        ]
      })
    }
    
    return NextResponse.json({
      success: false,
      message: 'Invalid action. Use "reset-password" or "fix-all-users"'
    }, { status: 400 })
    
  } catch (error) {
    console.error('Fix existing users error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fix users',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Fix Existing Users Endpoint',
    usage: {
      'Reset specific user': 'POST with { "action": "reset-password", "email": "user@example.com", "newPassword": "newpass" }',
      'Fix all users': 'POST with { "action": "fix-all-users" }'
    }
  })
}