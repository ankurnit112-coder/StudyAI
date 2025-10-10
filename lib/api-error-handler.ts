// API Error handling utilities

export interface ApiError {
  message: string
  code: string
  statusCode: number
  details?: Record<string, unknown>
}

export class ApiErrorHandler {
  static handleAuthError(error: unknown): string {
    if (error instanceof Error) {
      // Network errors
      if (error.name === 'NetworkError' || error.message.includes('fetch')) {
        return 'Unable to connect to the server. Please check your internet connection.'
      }
      
      // Auth-specific errors
      if (error.message.includes('Invalid email or password')) {
        return 'Invalid email or password. Please try again.'
      }
      
      if (error.message.includes('Account is temporarily locked')) {
        return 'Account is temporarily locked due to multiple failed attempts. Please try again later.'
      }
      
      if (error.message.includes('Account is deactivated')) {
        return 'Your account has been deactivated. Please contact support.'
      }
      
      if (error.message.includes('email already exists')) {
        return 'An account with this email already exists. Please sign in instead.'
      }
      
      if (error.message.includes('Too many')) {
        return 'Too many attempts. Please wait a moment before trying again.'
      }
      
      return error.message
    }
    
    return 'An unexpected error occurred. Please try again.'
  }

  static handleApiResponse(response: Response): Promise<any> {
    if (!response.ok) {
      return response.json().then(
        (errorData: { detail?: string }) => {
          throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`)
        },
        () => {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
      )
    }
    
    return response.json()
  }

  static isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      // Network errors are retryable
      if (error.name === 'NetworkError' || error.message.includes('fetch')) {
        return true
      }
      
      // Timeout errors are retryable
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        return true
      }
    }
    
    return false
  }

  static getErrorSeverity(error: unknown): 'low' | 'medium' | 'high' | 'critical' {
    if (error instanceof Error) {
      // Critical errors
      if (error.message.includes('Internal server error')) {
        return 'critical'
      }
      
      // High severity
      if (error.message.includes('Account is deactivated') || 
          error.message.includes('Authentication required')) {
        return 'high'
      }
      
      // Medium severity
      if (error.message.includes('Invalid email or password') ||
          error.message.includes('Account is temporarily locked')) {
        return 'medium'
      }
    }
    
    return 'low'
  }

  static shouldShowToUser(error: unknown): boolean {
    if (error instanceof Error) {
      // Don't show internal server errors to users
      if (error.message.includes('Internal server error')) {
        return false
      }
      
      // Don't show technical errors
      if (error.message.includes('JWT') || 
          error.message.includes('Token') ||
          error.message.includes('Database')) {
        return false
      }
    }
    
    return true
  }

  static formatErrorForLogging(error: unknown, context?: Record<string, unknown>): {
    message: string
    stack?: string
    context?: Record<string, unknown>
    timestamp: string
    severity: string
  } {
    return {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context,
      timestamp: new Date().toISOString(),
      severity: this.getErrorSeverity(error)
    }
  }

  static createUserFriendlyMessage(error: unknown): string {
    const baseMessage = this.handleAuthError(error)
    
    // Add helpful suggestions based on error type
    if (baseMessage.includes('Invalid email or password')) {
      return `${baseMessage}\n\nTips:\n• Check your email spelling\n• Ensure caps lock is off\n• Try resetting your password if you've forgotten it`
    }
    
    if (baseMessage.includes('temporarily locked')) {
      return `${baseMessage}\n\nFor security, accounts are temporarily locked after multiple failed attempts. This helps protect your account from unauthorized access.`
    }
    
    if (baseMessage.includes('internet connection')) {
      return `${baseMessage}\n\nPlease check:\n• Your internet connection\n• Try refreshing the page\n• Contact support if the problem persists`
    }
    
    return baseMessage
  }
}