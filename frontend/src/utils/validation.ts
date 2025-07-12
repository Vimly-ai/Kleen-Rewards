// Input validation and sanitization utilities

export const validation = {
  // Email validation
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  },

  // Name validation (letters, spaces, hyphens, apostrophes)
  name: (name: string): boolean => {
    const nameRegex = /^[a-zA-Z\s\-']+$/
    return nameRegex.test(name.trim()) && name.trim().length >= 2 && name.trim().length <= 50
  },

  // Points validation (positive integers only)
  points: (points: string | number): boolean => {
    const num = typeof points === 'string' ? parseInt(points, 10) : points
    return Number.isInteger(num) && num > 0 && num <= 10000
  },

  // Department validation
  department: (dept: string): boolean => {
    const deptRegex = /^[a-zA-Z0-9\s\-&]+$/
    return deptRegex.test(dept.trim()) && dept.trim().length >= 2 && dept.trim().length <= 30
  },

  // Reason validation (for bonus points, notes, etc.)
  reason: (reason: string): boolean => {
    const cleanReason = reason.trim()
    return cleanReason.length >= 3 && cleanReason.length <= 500
  },

  // URL validation
  url: (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
}

export const sanitize = {
  // Basic HTML sanitization - removes potential XSS
  html: (input: string): string => {
    const div = document.createElement('div')
    div.textContent = input
    return div.innerHTML
  },

  // Sanitize user input for database/API
  text: (input: string): string => {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML brackets
      .slice(0, 1000) // Limit length
  },

  // Sanitize email
  email: (email: string): string => {
    return email.trim().toLowerCase()
  },

  // Sanitize numeric input
  number: (input: string | number): number => {
    const num = typeof input === 'string' ? parseFloat(input) : input
    return isNaN(num) ? 0 : Math.max(0, Math.min(num, 999999))
  }
}

export const validate = {
  // Comprehensive form validation
  userProfile: (data: {
    name?: string
    email?: string
    department?: string
  }): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (data.name && !validation.name(data.name)) {
      errors.push('Name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes')
    }

    if (data.email && !validation.email(data.email)) {
      errors.push('Please enter a valid email address')
    }

    if (data.department && !validation.department(data.department)) {
      errors.push('Department must be 2-30 characters and contain only letters, numbers, spaces, hyphens, and &')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  },

  // Bonus points validation
  bonusPoints: (data: {
    points?: string | number
    reason?: string
  }): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (data.points && !validation.points(data.points)) {
      errors.push('Points must be a positive integer between 1 and 10,000')
    }

    if (data.reason && !validation.reason(data.reason)) {
      errors.push('Reason must be 3-500 characters long')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  },

  // Search input validation
  search: (query: string): { isValid: boolean; sanitized: string } => {
    const sanitized = sanitize.text(query).slice(0, 100)
    return {
      isValid: sanitized.length >= 1,
      sanitized
    }
  }
}

// Rate limiting utility
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map()
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}

  isAllowed(key: string): boolean {
    const now = Date.now()
    const attempts = this.attempts.get(key) || []
    
    // Remove old attempts outside the time window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs)
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false
    }
    
    // Add current attempt
    recentAttempts.push(now)
    this.attempts.set(key, recentAttempts)
    
    return true
  }

  reset(key: string): void {
    this.attempts.delete(key)
  }
}

// Global rate limiter instances
export const apiRateLimiter = new RateLimiter(10, 60 * 1000) // 10 requests per minute
export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000) // 5 attempts per 15 minutes