// Security configuration and utilities

// Content Security Policy
export const CSP_HEADER = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", 'https://clerk.com', 'https://*.clerk.accounts.dev'],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'img-src': ["'self'", 'data:', 'https:', 'blob:'],
  'connect-src': [
    "'self'",
    'https://*.supabase.co',
    'wss://*.supabase.co',
    'https://clerk.com',
    'https://*.clerk.accounts.dev'
  ],
  'frame-src': ["'self'", 'https://clerk.com', 'https://*.clerk.accounts.dev'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'upgrade-insecure-requests': []
}

// Security headers
export const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
}

// Input validation utilities
export const validateInput = {
  // Sanitize string input
  sanitizeString: (input: string): string => {
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/[<>]/g, '')
  },

  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Validate UUID format
  isValidUUID: (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  },

  // Validate employee ID format
  isValidEmployeeId: (id: string): boolean => {
    const employeeIdRegex = /^[A-Z0-9]{4,10}$/
    return employeeIdRegex.test(id)
  },

  // Validate points value
  isValidPoints: (points: number): boolean => {
    return Number.isInteger(points) && points >= 0 && points <= 1000000
  },

  // Validate date format
  isValidDate: (date: string): boolean => {
    const parsed = new Date(date)
    return !isNaN(parsed.getTime())
  }
}

// Rate limiting configuration
export const RATE_LIMITS = {
  checkIn: {
    maxAttempts: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many check-in attempts. Please try again later.'
  },
  redemption: {
    maxAttempts: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many redemption requests. Please try again later.'
  },
  api: {
    maxAttempts: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many requests. Please slow down.'
  }
}

// Simple in-memory rate limiter
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map()

  check(key: string, limit: typeof RATE_LIMITS[keyof typeof RATE_LIMITS]): boolean {
    const now = Date.now()
    const attempt = this.attempts.get(key)

    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(key, {
        count: 1,
        resetTime: now + limit.windowMs
      })
      return true
    }

    if (attempt.count >= limit.maxAttempts) {
      return false
    }

    attempt.count++
    return true
  }

  reset(key: string): void {
    this.attempts.delete(key)
  }
}

export const rateLimiter = new RateLimiter()

// Secure data sanitization for display
export const sanitizeForDisplay = (data: any): any => {
  if (typeof data === 'string') {
    return validateInput.sanitizeString(data)
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeForDisplay)
  }
  
  if (data && typeof data === 'object') {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeForDisplay(value)
    }
    return sanitized
  }
  
  return data
}

// Password strength checker
export const checkPasswordStrength = (password: string): {
  score: number
  feedback: string[]
} => {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) score++
  else feedback.push('Password should be at least 8 characters long')

  if (password.length >= 12) score++
  
  if (/[a-z]/.test(password)) score++
  else feedback.push('Add lowercase letters')
  
  if (/[A-Z]/.test(password)) score++
  else feedback.push('Add uppercase letters')
  
  if (/[0-9]/.test(password)) score++
  else feedback.push('Add numbers')
  
  if (/[^A-Za-z0-9]/.test(password)) score++
  else feedback.push('Add special characters')

  return { score, feedback }
}

// Secure session configuration
export const SESSION_CONFIG = {
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  checkInterval: 5 * 60 * 1000, // Check every 5 minutes
  warnBefore: 5 * 60 * 1000, // Warn 5 minutes before expiry
}