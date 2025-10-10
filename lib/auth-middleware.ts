import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: number
    email: string
    name: string
    role: 'student' | 'admin'
    currentClass?: number
    schoolName?: string
  }
}

export async function authenticateRequest(request: NextRequest): Promise<{
  user: any | null
  error: string | null
}> {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return { user: null, error: 'No token provided' }
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)
    
    const user = {
      id: payload.sub as number,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as 'student' | 'admin',
      currentClass: payload.current_class as number | undefined,
      schoolName: payload.school_name as string | undefined
    }

    return { user, error: null }
  } catch (error) {
    return { user: null, error: 'Invalid or expired token' }
  }
}

export function requireAuth(handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const { user, error } = await authenticateRequest(request)
    
    if (error || !user) {
      return NextResponse.json(
        { detail: error || 'Authentication required' },
        { status: 401 }
      )
    }

    // Add user to request object
    const authenticatedRequest = request as AuthenticatedRequest
    authenticatedRequest.user = user

    return handler(authenticatedRequest)
  }
}

export function requireRole(roles: string[]) {
  return function(handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
    return async (request: NextRequest) => {
      const { user, error } = await authenticateRequest(request)
      
      if (error || !user) {
        return NextResponse.json(
          { detail: error || 'Authentication required' },
          { status: 401 }
        )
      }

      if (!roles.includes(user.role)) {
        return NextResponse.json(
          { detail: 'Insufficient permissions' },
          { status: 403 }
        )
      }

      const authenticatedRequest = request as AuthenticatedRequest
      authenticatedRequest.user = user

      return handler(authenticatedRequest)
    }
  }
}