// Security utilities and helpers

import { NextRequest } from 'next/server'

export class SecurityUtils {
  // Rate limiting store (in production, use Redis)
  private static rateLimitStore = new Map<string, { count: number; resetTime: number }>()

  // Check rate limit for IP address
  static checkRateLimit(
    identifier: string, 
    maxRequests: number = 5, 
    windowMs: number = 15 * 60 * 1000 // 15 minutes
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const key = `rate_limit:${identifier}`
    
    let record = this.rateLimitStore.get(key)
    
    // Reset if window has passed
    if (!record || now > record.resetTime) {
      record = { count: 0, resetTime: now + windowMs }
      this.rateLimitStore.set(key, record)
    }
    
    record.count++
    const remaining = Math.max(0, maxRequests - record.count)
    const allowed = record.count <= maxRequests
    
    return { allowed, remaining, resetTime: record.resetTime }
  }

  // Get client IP address
  static getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const remoteAddr = request.headers.get('remote-addr')
    
    if (forwarded) {
      return forwarded.split(',')[0].trim()
    }
    
    return realIP || remoteAddr || 'unknown'
  }

  // Get device fingerprint
  static getDeviceFingerprint(request: NextRequest): string {
    const userAgent = request.headers.get('user-agent') || ''
    const acceptLanguage = request.headers.get('accept-language') || ''
    const acceptEncoding = request.headers.get('accept-encoding') || ''
    
    // Create a simple fingerprint (in production, use more sophisticated methods)
    const fingerprint = Buffer.from(
      `${userAgent}|${acceptLanguage}|${acceptEncoding}`
    ).toString('base64')
    
    return fingerprint.substring(0, 32)
  }

  // Sanitize input to prevent XSS
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
  }

  // Validate CSRF token (simple implementation)
  static validateCSRFToken(token: string, sessionToken: string): boolean {
    // In production, implement proper CSRF token validation
    return token === sessionToken
  }

  // Check for suspicious patterns
  static detectSuspiciousActivity(request: NextRequest): {
    suspicious: boolean
    reasons: string[]
  } {
    const reasons: string[] = []
    const userAgent = request.headers.get('user-agent') || ''
    const referer = request.headers.get('referer') || ''
    
    // Check for bot-like user agents
    const botPatterns = [
      /bot/i, /crawler/i, /spider/i, /scraper/i,
      /curl/i, /wget/i, /python/i, /java/i
    ]
    
    if (botPatterns.some(pattern => pattern.test(userAgent))) {
      reasons.push('Bot-like user agent detected')
    }
    
    // Check for missing or suspicious referer
    if (!referer && request.method === 'POST') {
      reasons.push('Missing referer on POST request')
    }
    
    // Check for rapid requests (basic check)
    const ip = this.getClientIP(request)
    const rateLimitCheck = this.checkRateLimit(`suspicious:${ip}`, 10, 60000) // 10 requests per minute
    
    if (!rateLimitCheck.allowed) {
      reasons.push('Too many requests from IP')
    }
    
    return {
      suspicious: reasons.length > 0,
      reasons
    }
  }

  // Generate secure random token
  static generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    
    return result
  }

  // Hash sensitive data (for logging/analytics)
  static hashSensitiveData(data: string): string {
    // Simple hash for demo - use proper crypto in production
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36)
  }

  // Validate password against common attack patterns
  static validatePasswordSecurity(password: string): {
    secure: boolean
    warnings: string[]
  } {
    const warnings: string[] = []
    
    // Check for SQL injection patterns
    const sqlPatterns = [
      /['";\\|*%<>{}[\]]/i,
      /(union|select|insert|delete|update|drop|create|alter|exec|execute)/i
    ]
    
    if (sqlPatterns.some(pattern => pattern.test(password))) {
      warnings.push('Password contains potentially dangerous characters')
    }
    
    // Check for script injection
    if (/<script|javascript:|on\w+=/i.test(password)) {
      warnings.push('Password contains script-like content')
    }
    
    // Check for extremely long passwords (potential DoS)
    if (password.length > 200) {
      warnings.push('Password is unusually long')
    }
    
    return {
      secure: warnings.length === 0,
      warnings
    }
  }

  // Clean up rate limit store (call periodically)
  static cleanupRateLimitStore(): void {
    const now = Date.now()
    
    for (const [key, record] of this.rateLimitStore.entries()) {
      if (now > record.resetTime) {
        this.rateLimitStore.delete(key)
      }
    }
  }

  // Log security event (in production, send to security monitoring)
  static logSecurityEvent(event: {
    type: 'login_attempt' | 'signup_attempt' | 'suspicious_activity' | 'rate_limit_exceeded'
    ip: string
    userAgent: string
    details: Record<string, any>
    timestamp?: Date
  }): void {
    const logEntry = {
      ...event,
      timestamp: event.timestamp || new Date(),
      id: this.generateSecureToken(16)
    }
    
    // In production, send to logging service
    console.log('Security Event:', JSON.stringify(logEntry, null, 2))
  }
}