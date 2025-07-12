// Centralized error handling utilities

import { toast } from 'sonner'

// Error types
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  PERMISSION = 'PERMISSION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  RATE_LIMIT = 'RATE_LIMIT',
  UNKNOWN = 'UNKNOWN'
}

// Custom error class
export class AppError extends Error {
  constructor(
    public type: ErrorType,
    public message: string,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// Error messages
const ERROR_MESSAGES: Record<ErrorType, string> = {
  [ErrorType.NETWORK]: 'Network error. Please check your connection.',
  [ErrorType.AUTH]: 'Authentication failed. Please sign in again.',
  [ErrorType.VALIDATION]: 'Invalid input. Please check your data.',
  [ErrorType.PERMISSION]: 'You do not have permission to perform this action.',
  [ErrorType.NOT_FOUND]: 'The requested resource was not found.',
  [ErrorType.SERVER]: 'Server error. Please try again later.',
  [ErrorType.RATE_LIMIT]: 'Too many requests. Please slow down.',
  [ErrorType.UNKNOWN]: 'An unexpected error occurred.'
}

// Parse error type from various sources
export function parseErrorType(error: any): ErrorType {
  // Check for network errors
  if (error.message?.includes('fetch') || error.message?.includes('network')) {
    return ErrorType.NETWORK
  }

  // Check for auth errors
  if (error.status === 401 || error.code === 'auth/unauthorized') {
    return ErrorType.AUTH
  }

  // Check for permission errors
  if (error.status === 403 || error.code === 'auth/forbidden') {
    return ErrorType.PERMISSION
  }

  // Check for validation errors
  if (error.status === 400 || error.code?.includes('validation')) {
    return ErrorType.VALIDATION
  }

  // Check for not found errors
  if (error.status === 404) {
    return ErrorType.NOT_FOUND
  }

  // Check for rate limit errors
  if (error.status === 429) {
    return ErrorType.RATE_LIMIT
  }

  // Check for server errors
  if (error.status >= 500) {
    return ErrorType.SERVER
  }

  return ErrorType.UNKNOWN
}

// Main error handler
export function handleError(error: any, showToast: boolean = true): AppError {
  console.error('Error occurred:', error)

  let appError: AppError

  // If it's already an AppError, use it
  if (error instanceof AppError) {
    appError = error
  } else {
    // Parse the error type
    const errorType = parseErrorType(error)
    
    // Get user-friendly message
    const message = error.message || ERROR_MESSAGES[errorType]
    
    // Create AppError
    appError = new AppError(
      errorType,
      message,
      error.code,
      error.details || error.response?.data
    )
  }

  // Show toast notification if requested
  if (showToast) {
    toast.error(appError.message, {
      duration: 5000,
      action: appError.type === ErrorType.AUTH ? {
        label: 'Sign In',
        onClick: () => window.location.href = '/auth'
      } : undefined
    })
  }

  // Log to error tracking service (e.g., Sentry)
  if (import.meta.env.PROD) {
    logErrorToService(appError)
  }

  return appError
}

// Log errors to external service
function logErrorToService(error: AppError) {
  // TODO: Implement Sentry or similar error tracking
  // For now, just log to console in production
  console.error('Production error:', {
    type: error.type,
    message: error.message,
    code: error.code,
    details: error.details,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  })
}

// Error boundary fallback component
export function ErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={resetError}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

// Async error wrapper
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  options?: {
    showToast?: boolean
    fallback?: T
    errorMessage?: string
  }
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    const appError = handleError(error, options?.showToast ?? true)
    
    if (options?.errorMessage) {
      appError.message = options.errorMessage
    }
    
    if (options?.fallback !== undefined) {
      return options.fallback
    }
    
    throw appError
  }
}

// React hook for error handling
export function useErrorHandler() {
  const handleAppError = (error: any) => {
    return handleError(error, true)
  }

  return { handleError: handleAppError }
}

// Global error monitoring setup
export function setupGlobalErrorMonitoring() {
  // Capture unhandled errors
  window.addEventListener('error', (event) => {
    const error = new AppError(
      parseErrorType(event.error),
      event.error?.message || event.message || 'Unhandled JavaScript error',
      undefined,
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      }
    )
    
    handleError(error, false) // Don't show toast for unhandled errors
  })

  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = new AppError(
      ErrorType.UNKNOWN,
      `Unhandled Promise Rejection: ${event.reason}`,
      undefined,
      {
        reason: event.reason,
        stack: event.reason?.stack
      }
    )
    
    handleError(error, false) // Don't show toast for unhandled rejections
    event.preventDefault() // Prevent console error
  })

  // Capture network errors from fetch
  const originalFetch = window.fetch
  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args)
      
      if (!response.ok) {
        const error = new AppError(
          parseErrorType({ status: response.status }),
          `HTTP ${response.status}: ${response.statusText}`,
          response.status.toString(),
          {
            url: args[0],
            status: response.status,
            statusText: response.statusText
          }
        )
        
        throw error
      }
      
      return response
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      
      // Network or other fetch error
      throw new AppError(
        ErrorType.NETWORK,
        'Network request failed',
        undefined,
        {
          url: args[0],
          originalError: error
        }
      )
    }
  }
}

// Error recovery strategies
export class ErrorRecovery {
  private static retryAttempts = new Map<string, number>()
  private static maxRetries = 3
  private static backoffDelay = 1000 // 1 second

  static async withRetry<T>(
    fn: () => Promise<T>,
    key: string,
    options?: {
      maxRetries?: number
      backoffDelay?: number
      shouldRetry?: (error: any) => boolean
    }
  ): Promise<T> {
    const maxRetries = options?.maxRetries ?? this.maxRetries
    const backoffDelay = options?.backoffDelay ?? this.backoffDelay
    const shouldRetry = options?.shouldRetry ?? ((error) => 
      error instanceof AppError && 
      [ErrorType.NETWORK, ErrorType.SERVER].includes(error.type)
    )

    const attempts = this.retryAttempts.get(key) ?? 0

    try {
      const result = await fn()
      this.retryAttempts.delete(key) // Reset on success
      return result
    } catch (error) {
      if (attempts >= maxRetries || !shouldRetry(error)) {
        this.retryAttempts.delete(key)
        throw error
      }

      this.retryAttempts.set(key, attempts + 1)
      
      // Exponential backoff
      const delay = backoffDelay * Math.pow(2, attempts)
      await new Promise(resolve => setTimeout(resolve, delay))
      
      return this.withRetry(fn, key, options)
    }
  }

  static clearRetryState(key?: string) {
    if (key) {
      this.retryAttempts.delete(key)
    } else {
      this.retryAttempts.clear()
    }
  }
}

// Performance impact monitoring for errors
export function monitorErrorImpact() {
  let errorCount = 0
  let lastErrorTime = 0
  
  const originalHandleError = handleError
  
  window.handleError = (error: any, showToast: boolean = true) => {
    errorCount++
    const now = Date.now()
    
    // Alert if too many errors in short time (potential cascade)
    if (now - lastErrorTime < 5000 && errorCount > 3) {
      console.warn('Error cascade detected! Multiple errors in short time:')
      console.warn(`Errors: ${errorCount}, Time window: ${now - lastErrorTime}ms`)
      
      // Could trigger emergency fallback UI here
    }
    
    lastErrorTime = now
    
    // Reset counter after 30 seconds
    setTimeout(() => {
      errorCount = Math.max(0, errorCount - 1)
    }, 30000)
    
    return originalHandleError(error, showToast)
  }
}

// User-friendly error messages with context
export function getContextualErrorMessage(error: AppError, context?: string): string {
  const baseMessage = error.message
  
  switch (context) {
    case 'check-in':
      if (error.type === ErrorType.NETWORK) {
        return 'Unable to check in due to network issues. Your check-in will be retried automatically.'
      }
      if (error.type === ErrorType.VALIDATION) {
        return 'Check-in failed: Invalid location or time. Please try scanning the QR code again.'
      }
      break
      
    case 'reward-redemption':
      if (error.type === ErrorType.VALIDATION) {
        return 'Cannot redeem reward: Insufficient points or reward unavailable.'
      }
      if (error.type === ErrorType.NETWORK) {
        return 'Redemption failed due to network issues. Your points have not been deducted.'
      }
      break
      
    case 'profile-update':
      if (error.type === ErrorType.VALIDATION) {
        return 'Profile update failed: Please check that all required fields are filled correctly.'
      }
      break
  }
  
  return baseMessage
}

// Debug mode error details
export function getErrorDebugInfo(error: AppError) {
  if (!import.meta.env.DEV) return null
  
  return {
    type: error.type,
    message: error.message,
    code: error.code,
    details: error.details,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    memory: (performance as any).memory ? {
      used: Math.round((performance as any).memory.usedJSHeapSize / 1048576),
      total: Math.round((performance as any).memory.totalJSHeapSize / 1048576)
    } : null
  }
}