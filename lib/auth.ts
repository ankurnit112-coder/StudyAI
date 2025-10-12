// Authentication utilities and API calls
import { jwtDecode } from 'jwt-decode'
import { ApiErrorHandler } from './api-error-handler'

// Enhanced error types
export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'AuthError'
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network connection failed') {
    super(message)
    this.name = 'NetworkError'
  }
}

export interface User {
  id: number
  email: string
  name: string
  role: 'student' | 'admin'
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
  rememberMe?: boolean
}

export interface SignupData {
  name: string
  email: string
  password: string
  role: 'student'
  currentClass?: number
  schoolName?: string
}

// API Base URL - use Next.js API routes
// Force use window.location.origin in production to ensure correct URL
const API_BASE_URL = typeof window !== 'undefined' 
  ? window.location.origin 
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000')

// Debug logging for API URL
if (typeof window !== 'undefined') {
  console.log('API_BASE_URL:', API_BASE_URL)
  console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)
  console.log('window.location.origin:', window.location.origin)
}

class AuthService {
  private static instance: AuthService
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private refreshPromise: Promise<string | null> | null = null
  private retryCount = 0
  private maxRetries = 3

  private constructor() {
    // Initialize tokens from storage if available
    if (typeof window !== 'undefined') {
      // Check localStorage first (remember me), then sessionStorage
      this.accessToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
      this.refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token')
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
      const response = await this.fetchWithRetry(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        await ApiErrorHandler.handleApiResponse(response)
        // This will throw an error with the proper message
      }

      const tokens: AuthTokens = await response.json()
      
      // Store tokens with remember me preference
      this.setTokens(tokens.access_token, tokens.refresh_token, credentials.rememberMe)
      
      // Save email for convenience if remember me is checked
      if (credentials.rememberMe) {
        this.saveRememberedEmail(credentials.email)
      }
      
      // Reset retry count on successful login
      this.retryCount = 0
      
      // Decode user info from token
      const user = this.getUserFromToken(tokens.access_token)
      return user
    } catch (error) {
      console.error('Login error:', error)
      
      // Use the error handler to provide user-friendly messages
      const friendlyMessage = ApiErrorHandler.handleAuthError(error)
      throw new Error(friendlyMessage)
    }
  }

  async signup(signupData: SignupData): Promise<User> {
    try {
      const response = await this.fetchWithRetry(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      })

      if (!response.ok) {
        await ApiErrorHandler.handleApiResponse(response)
        // This will throw an error with the proper message
      }

      const tokens: AuthTokens = await response.json()
      
      // Store tokens (signup should default to remember me for convenience)
      this.setTokens(tokens.access_token, tokens.refresh_token, true)
      
      // Reset retry count on successful signup
      this.retryCount = 0
      
      // Decode user info from token
      const user = this.getUserFromToken(tokens.access_token)
      return user
    } catch (error) {
      console.error('Signup error:', error)
      
      // Use the error handler to provide user-friendly messages
      const friendlyMessage = ApiErrorHandler.handleAuthError(error)
      throw new Error(friendlyMessage)
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.accessToken) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
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

    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = this.performTokenRefresh()
    const result = await this.refreshPromise
    this.refreshPromise = null
    return result
  }

  private async performTokenRefresh(): Promise<string | null> {
    try {
      const response = await this.fetchWithRetry(`${API_BASE_URL}/api/auth/refresh`, {
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
      // Preserve the remember me setting when refreshing tokens
      const currentRememberMe = this.isRememberMeEnabled() || 
        (typeof window !== 'undefined' && localStorage.getItem('access_token') !== null)
      this.setTokens(tokens.access_token, tokens.refresh_token, currentRememberMe)
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
      const decoded: { exp: number } = jwtDecode(this.accessToken)
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

  private setTokens(accessToken: string, refreshToken: string, rememberMe?: boolean): void {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    
    if (typeof window !== 'undefined') {
      if (rememberMe) {
        // Use localStorage for persistent storage (survives browser restart)
        localStorage.setItem('access_token', accessToken)
        localStorage.setItem('refresh_token', refreshToken)
        localStorage.setItem('remember_me', 'true')
      } else {
        // Use sessionStorage for session-only storage (cleared on browser close)
        sessionStorage.setItem('access_token', accessToken)
        sessionStorage.setItem('refresh_token', refreshToken)
        // Clear any existing localStorage tokens
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('remember_me')
      }
    }
  }

  private clearTokens(): void {
    this.accessToken = null
    this.refreshToken = null
    
    if (typeof window !== 'undefined') {
      // Clear from both localStorage and sessionStorage
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('remember_me')
      sessionStorage.removeItem('access_token')
      sessionStorage.removeItem('refresh_token')
    }
  }

  private getUserFromToken(token: string): User {
    const decoded: {
      sub: number
      email: string
      name: string
      role: 'student' | 'admin'
      current_class?: number
      school_name?: string
    } = jwtDecode(token)
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
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Add any additional headers from options
    if (options.headers) {
      Object.assign(headers, options.headers)
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

  // Email memory methods
  saveRememberedEmail(email: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('remembered_email', email)
    }
  }

  getRememberedEmail(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('remembered_email')
    }
    return null
  }

  clearRememberedEmail(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('remembered_email')
    }
  }

  isRememberMeEnabled(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('remember_me') === 'true'
    }
    return false
  }

  // Enhanced fetch with retry logic and better error handling
  private async fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        })

        clearTimeout(timeoutId)
        return response
      } catch (error) {
        // Don't retry on abort or certain errors
        if (error instanceof Error && error.name === 'AbortError') {
          throw new NetworkError('Request timeout')
        }

        // Don't retry on the last attempt
        if (attempt === this.maxRetries) {
          throw new NetworkError(`Network request failed after ${this.maxRetries + 1} attempts`)
        }

        // Exponential backoff: wait 1s, 2s, 4s
        const delay = Math.pow(2, attempt) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    // This should never be reached, but TypeScript requires it
    throw new NetworkError(`Network request failed after ${this.maxRetries + 1} attempts`)
  }

  // Check if user is online
  isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true
  }

  // Get user preferences
  getUserPreferences(): {
    rememberMe: boolean
    rememberedEmail: string | null
    theme?: string
    language?: string
  } {
    if (typeof window === 'undefined') {
      return { rememberMe: false, rememberedEmail: null }
    }

    return {
      rememberMe: this.isRememberMeEnabled(),
      rememberedEmail: this.getRememberedEmail(),
      theme: localStorage.getItem('theme') || 'light',
      language: localStorage.getItem('language') || 'en'
    }
  }

  // Clear all user data (for complete logout)
  clearAllUserData(): void {
    if (typeof window === 'undefined') return

    // Clear auth tokens
    this.clearTokens()
    
    // Clear remembered data
    this.clearRememberedEmail()
    
    // Clear other user preferences if needed
    const keysToKeep = ['theme', 'language'] // Keep UI preferences
    const allKeys = Object.keys(localStorage)
    
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key)
      }
    })
  }

  // Validate token expiry
  getTokenExpiry(): Date | null {
    if (!this.accessToken) return null

    try {
      const decoded: { exp: number } = jwtDecode(this.accessToken)
      return new Date(decoded.exp * 1000)
    } catch {
      return null
    }
  }

  // Check if token expires soon (within 5 minutes)
  isTokenExpiringSoon(): boolean {
    const expiry = this.getTokenExpiry()
    if (!expiry) return true

    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000)
    return expiry <= fiveMinutesFromNow
  }
}

export const authService = AuthService.getInstance()