import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handleError, parseErrorType, ErrorType, AppError, withErrorHandling } from '../errorHandler'

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn()
  }
}))

describe('errorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    console.error = vi.fn()
  })

  describe('parseErrorType', () => {
    it('should identify network errors', () => {
      const error = { message: 'fetch error' }
      expect(parseErrorType(error)).toBe(ErrorType.NETWORK)
    })

    it('should identify auth errors', () => {
      const error = { status: 401 }
      expect(parseErrorType(error)).toBe(ErrorType.AUTH)
    })

    it('should identify permission errors', () => {
      const error = { status: 403 }
      expect(parseErrorType(error)).toBe(ErrorType.PERMISSION)
    })

    it('should identify validation errors', () => {
      const error = { status: 400 }
      expect(parseErrorType(error)).toBe(ErrorType.VALIDATION)
    })

    it('should identify not found errors', () => {
      const error = { status: 404 }
      expect(parseErrorType(error)).toBe(ErrorType.NOT_FOUND)
    })

    it('should identify rate limit errors', () => {
      const error = { status: 429 }
      expect(parseErrorType(error)).toBe(ErrorType.RATE_LIMIT)
    })

    it('should identify server errors', () => {
      const error = { status: 500 }
      expect(parseErrorType(error)).toBe(ErrorType.SERVER)
    })

    it('should default to unknown for unrecognized errors', () => {
      const error = { status: 999 }
      expect(parseErrorType(error)).toBe(ErrorType.UNKNOWN)
    })
  })

  describe('handleError', () => {
    it('should return AppError for regular errors', () => {
      const error = new Error('Test error')
      const result = handleError(error, false)

      expect(result).toBeInstanceOf(AppError)
      expect(result.message).toBe('Test error')
      expect(result.type).toBe(ErrorType.UNKNOWN)
    })

    it('should preserve existing AppError', () => {
      const appError = new AppError(ErrorType.AUTH, 'Auth failed')
      const result = handleError(appError, false)

      expect(result).toBe(appError)
    })

    it('should log errors to console', () => {
      const error = new Error('Test error')
      handleError(error, false)

      expect(console.error).toHaveBeenCalledWith('Error occurred:', error)
    })
  })

  describe('withErrorHandling', () => {
    it('should return successful result', async () => {
      const successFn = vi.fn().mockResolvedValue('success')
      const result = await withErrorHandling(successFn)

      expect(result).toBe('success')
      expect(successFn).toHaveBeenCalled()
    })

    it('should handle errors and throw AppError', async () => {
      const errorFn = vi.fn().mockRejectedValue(new Error('Test error'))
      
      await expect(withErrorHandling(errorFn)).rejects.toThrow(AppError)
    })

    it('should return fallback value on error', async () => {
      const errorFn = vi.fn().mockRejectedValue(new Error('Test error'))
      const result = await withErrorHandling(errorFn, { fallback: 'fallback' })

      expect(result).toBe('fallback')
    })

    it('should use custom error message', async () => {
      const errorFn = vi.fn().mockRejectedValue(new Error('Original error'))
      
      try {
        await withErrorHandling(errorFn, { errorMessage: 'Custom error' })
      } catch (error) {
        expect(error).toBeInstanceOf(AppError)
        expect((error as AppError).message).toBe('Custom error')
      }
    })

    it('should control toast display', async () => {
      const errorFn = vi.fn().mockRejectedValue(new Error('Test error'))
      
      try {
        await withErrorHandling(errorFn, { showToast: false })
      } catch (error) {
        // Toast should not be called when showToast is false
        const { toast } = await import('sonner')
        expect(toast.error).not.toHaveBeenCalled()
      }
    })
  })

  describe('AppError', () => {
    it('should create error with all properties', () => {
      const error = new AppError(
        ErrorType.AUTH,
        'Auth failed',
        'AUTH_001',
        { userId: '123' }
      )

      expect(error.type).toBe(ErrorType.AUTH)
      expect(error.message).toBe('Auth failed')
      expect(error.code).toBe('AUTH_001')
      expect(error.details).toEqual({ userId: '123' })
      expect(error.name).toBe('AppError')
    })

    it('should inherit from Error', () => {
      const error = new AppError(ErrorType.UNKNOWN, 'Test error')
      expect(error).toBeInstanceOf(Error)
    })
  })
})