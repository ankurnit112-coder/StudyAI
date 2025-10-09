// Authentication utilities and API calls
import { jwtDecode } from 'jwt-decode'

export interface User {
  id: number
  email: string
  name: string
  role: 'student' | 'parent' | 'admin'
  currentClass?: number
  schoolName?: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  name: string
  email: string
  password: string
  role: 'student' | 'parent'
  currentClass?: number
  schoolName?: string
}

// API Base URL - adjust based on your backend deployment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class AuthService {
  private static instance: AuthService
  private accessToken: string | null = null
  private refreshToken: string | null = null

  private constructor() {
    // Initialize tokens from localStorage if available
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token')
      this.refreshToken = localStorage.getItem('refresh_token')
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Login failed')
      }

      const tokens: AuthTokens = await response.json()
      
      // Store tokens
      this.setTokens(tokens.access_token, tokens.refresh_token)
      
      // Decode user info from token
      const user = this.getUserFromToken(tokens.access_token)
      return user
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async signup(signupData: SignupData): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Signup failed')
      }

      const tokens: AuthTokens = await response.json()
      
      // Store tokens
      this.setTokens(tokens.access_token, tokens.refresh_token)
      
      // Decode user info from token
      const user = this.getUserFromToken(tokens.access_token)
      return user
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.accessToken) {
        await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.clearTokens()
    }
  }

  async refreshAccessToken(): Promise<string | null> {
    if (!this.refreshToken) {
      return null
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      })

      if (!response.ok) {
        this.clearTokens()
        return null
      }

      const tokens: AuthTokens = await response.json()
      this.setTokens(tokens.access_token, tokens.refresh_token)
      return tokens.access_token
    } catch (error) {
      console.error('Token refresh error:', error)
      this.clearTokens()
      return null
    }
  }

  getCurrentUser(): User | null {
    if (!this.accessToken) {
      return null
    }

    try {
      return this.getUserFromToken(this.accessToken)
    } catch (error) {
      console.error('Error getting current user:', error)
      this.clearTokens()
      return null
    }
  }

  isAuthenticated(): boolean {
    if (!this.accessToken) {
      return false
    }

    try {
      const decoded: any = jwtDecode(this.accessToken)
      const currentTime = Date.now() / 1000
      return decoded.exp > currentTime
    } catch (error) {
      console.error('Token validation error:', error)
      this.clearTokens()
      return false
    }
  }

  getAccessToken(): string | null {
    return this.accessToken
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('refresh_token', refreshToken)
    }
  }

  private clearTokens(): void {
    this.accessToken = null
    this.refreshToken = null
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  }

  private getUserFromToken(token: string): User {
    const decoded: any = jwtDecode(token)
    return {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      currentClass: decoded.current_class,
      schoolName: decoded.school_name,
    }
  }

  // API helper method with automatic token refresh
  async apiCall(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${API_BASE_URL}${endpoint}`
    
    // Add authorization header if token exists
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`
    }

    let response = await fetch(url, {
      ...options,
      headers,
    })

    // If unauthorized, try to refresh token
    if (response.status === 401 && this.refreshToken) {
      const newToken = await this.refreshAccessToken()
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`
        response = await fetch(url, {
          ...options,
          headers,
        })
      }
    }

    return response
  }
}

export const authService = AuthService.getInstance()