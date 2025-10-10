// Input validation utilities

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export class Validator {
  // Email validation
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = []
    
    if (!email) {
      errors.push('Email is required')
      return { isValid: false, errors }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address')
    }

    // Check for common typos
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']
    const domain = email.split('@')[1]?.toLowerCase()
    
    if (domain) {
      const suggestions = commonDomains.filter(d => 
        d.includes(domain) || domain.includes(d.substring(0, 3))
      )
      
      if (suggestions.length > 0 && !commonDomains.includes(domain)) {
        errors.push(`Did you mean ${suggestions[0]}?`)
      }
    }

    return { isValid: errors.length === 0, errors }
  }

  // Password validation with strength checking
  static validatePassword(password: string): ValidationResult {
    const errors: string[] = []
    
    if (!password) {
      errors.push('Password is required')
      return { isValid: false, errors }
    }

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }

    if (password.length > 128) {
      errors.push('Password must be less than 128 characters')
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }

    // Check for common weak passwords
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey'
    ]
    
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('This password is too common. Please choose a stronger password')
    }

    // Check for sequential characters
    if (/123456|abcdef|qwerty/i.test(password)) {
      errors.push('Avoid using sequential characters in your password')
    }

    return { isValid: errors.length === 0, errors }
  }

  // Name validation
  static validateName(name: string): ValidationResult {
    const errors: string[] = []
    
    if (!name) {
      errors.push('Name is required')
      return { isValid: false, errors }
    }

    if (name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long')
    }

    if (name.length > 50) {
      errors.push('Name must be less than 50 characters')
    }

    if (!/^[a-zA-Z\s'-]+$/.test(name)) {
      errors.push('Name can only contain letters, spaces, hyphens, and apostrophes')
    }

    return { isValid: errors.length === 0, errors }
  }

  // School name validation
  static validateSchoolName(schoolName: string): ValidationResult {
    const errors: string[] = []
    
    if (schoolName && schoolName.length > 100) {
      errors.push('School name must be less than 100 characters')
    }

    return { isValid: errors.length === 0, errors }
  }

  // Class validation
  static validateClass(currentClass: number): ValidationResult {
    const errors: string[] = []
    
    if (currentClass < 9 || currentClass > 12) {
      errors.push('Class must be between 9 and 12')
    }

    return { isValid: errors.length === 0, errors }
  }

  // Rate limiting validation
  static validateRateLimit(attempts: number, maxAttempts: number = 5): ValidationResult {
    const errors: string[] = []
    
    if (attempts >= maxAttempts) {
      errors.push('Too many attempts. Please try again later')
    }

    return { isValid: errors.length === 0, errors }
  }

  // Comprehensive signup validation
  static validateSignupData(data: {
    name: string
    email: string
    password: string
    confirmPassword: string
    role: string
    currentClass?: number
    schoolName?: string
  }): ValidationResult {
    const allErrors: string[] = []

    // Validate each field
    const nameResult = this.validateName(data.name)
    const emailResult = this.validateEmail(data.email)
    const passwordResult = this.validatePassword(data.password)

    allErrors.push(...nameResult.errors)
    allErrors.push(...emailResult.errors)
    allErrors.push(...passwordResult.errors)

    // Check password confirmation
    if (data.password !== data.confirmPassword) {
      allErrors.push('Passwords do not match')
    }

    // Validate role
    if (!['student', 'admin'].includes(data.role)) {
      allErrors.push('Invalid role selected')
    }

    // Validate class if provided
    if (data.currentClass !== undefined) {
      const classResult = this.validateClass(data.currentClass)
      allErrors.push(...classResult.errors)
    }

    // Validate school name if provided
    if (data.schoolName) {
      const schoolResult = this.validateSchoolName(data.schoolName)
      allErrors.push(...schoolResult.errors)
    }

    return { isValid: allErrors.length === 0, errors: allErrors }
  }

  // Login validation
  static validateLoginData(data: {
    email: string
    password: string
  }): ValidationResult {
    const allErrors: string[] = []

    if (!data.email) {
      allErrors.push('Email is required')
    }

    if (!data.password) {
      allErrors.push('Password is required')
    }

    // Basic email format check for login
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      allErrors.push('Please enter a valid email address')
    }

    return { isValid: allErrors.length === 0, errors: allErrors }
  }

  // Calculate password strength score (0-100)
  static calculatePasswordStrength(password: string): {
    score: number
    feedback: string[]
  } {
    let score = 0
    const feedback: string[] = []

    if (password.length >= 8) {
      score += 20
    } else {
      feedback.push('Use at least 8 characters')
    }

    if (/[a-z]/.test(password)) {
      score += 15
    } else {
      feedback.push('Add lowercase letters')
    }

    if (/[A-Z]/.test(password)) {
      score += 15
    } else {
      feedback.push('Add uppercase letters')
    }

    if (/\d/.test(password)) {
      score += 15
    } else {
      feedback.push('Add numbers')
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 15
    } else {
      feedback.push('Add special characters')
    }

    // Bonus points for length
    if (password.length >= 12) score += 10
    if (password.length >= 16) score += 10

    // Penalty for common patterns
    if (/123456|abcdef|qwerty/i.test(password)) {
      score -= 20
      feedback.push('Avoid common patterns')
    }

    return { score: Math.max(0, Math.min(100, score)), feedback }
  }
}