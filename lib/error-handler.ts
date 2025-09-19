// Centralized error handling for StudyAI

export interface ErrorInfo {
  message: string
  stack?: string
  componentStack?: string
  timestamp: number
  url: string
  userAgent: string
}

export class StudyAIError extends Error {
  public readonly code: string
  public readonly context?: Record<string, any>

  constructor(message: string, code: string = 'UNKNOWN_ERROR', context?: Record<string, any>) {
    super(message)
    this.name = 'StudyAIError'
    this.code = code
    this.context = context
  }
}

// Error codes for different types of errors
export const ERROR_CODES = {
  NAVIGATION_ERROR: 'NAVIGATION_ERROR',
  IMAGE_LOAD_ERROR: 'IMAGE_LOAD_ERROR',
  API_ERROR: 'API_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  COMPONENT_ERROR: 'COMPONENT_ERROR',
} as const

// Global error handler
export function handleError(error: Error | StudyAIError, context?: Record<string, any>) {
  const errorInfo: ErrorInfo = {
    message: error.message,
    stack: error.stack,
    timestamp: Date.now(),
    url: typeof window !== 'undefined' ? window.location.href : 'server',
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('StudyAI Error:', errorInfo, context)
  }

  // In production, you would send this to an error reporting service
  // Example: Sentry, LogRocket, etc.
  if (process.env.NODE_ENV === 'production') {
    // sendToErrorReportingService(errorInfo, context)
  }

  return errorInfo
}

// Specific error handlers
export const errorHandlers = {
  navigation: (error: Error, href?: string) => {
    return handleError(
      new StudyAIError(
        `Navigation failed: ${error.message}`,
        ERROR_CODES.NAVIGATION_ERROR,
        { href }
      )
    )
  },

  imageLoad: (src: string, fallbackSrc?: string) => {
    return handleError(
      new StudyAIError(
        `Failed to load image: ${src}`,
        ERROR_CODES.IMAGE_LOAD_ERROR,
        { src, fallbackSrc }
      )
    )
  },

  api: (error: Error, endpoint?: string, method?: string) => {
    return handleError(
      new StudyAIError(
        `API request failed: ${error.message}`,
        ERROR_CODES.API_ERROR,
        { endpoint, method }
      )
    )
  },

  validation: (field: string, value: any, rule: string) => {
    return handleError(
      new StudyAIError(
        `Validation failed for ${field}: ${rule}`,
        ERROR_CODES.VALIDATION_ERROR,
        { field, value, rule }
      )
    )
  },

  component: (componentName: string, error: Error) => {
    return handleError(
      new StudyAIError(
        `Component error in ${componentName}: ${error.message}`,
        ERROR_CODES.COMPONENT_ERROR,
        { componentName }
      )
    )
  }
}

// Performance monitoring
export function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): T | Promise<T> {
  const start = performance.now()
  
  try {
    const result = fn()
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = performance.now() - start
        console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`)
      })
    } else {
      const duration = performance.now() - start
      console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`)
      return result
    }
  } catch (error) {
    const duration = performance.now() - start
    console.error(`Performance: ${name} failed after ${duration.toFixed(2)}ms`, error)
    throw error
  }
}

// Retry mechanism for failed operations
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxRetries) {
        throw lastError
      }
      
      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }
  
  throw lastError!
}