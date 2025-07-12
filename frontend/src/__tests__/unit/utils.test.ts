import { describe, it, expect, vi, beforeEach } from 'vitest'
import { performance } from '../../utils/performance'
import { handleError } from '../../utils/errorHandler'
import { validateInput } from '../../utils/validation'

describe('Performance Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    performance.initialize()
  })

  it('should initialize performance monitoring', () => {
    expect(performance.isInitialized()).toBe(true)
  })

  it('should mark and measure performance', () => {
    performance.markStart('test-operation')
    performance.markEnd('test-operation')
    const measurement = performance.measure('test-operation')
    
    expect(measurement).toBeDefined()
    expect(measurement.duration).toBeGreaterThanOrEqual(0)
  })

  it('should record errors', () => {
    const error = new Error('Test error')
    performance.recordError(error)
    
    const errors = performance.getErrors()
    expect(errors).toHaveLength(1)
    expect(errors[0].message).toBe('Test error')
  })

  it('should get performance metrics', () => {
    performance.markStart('test-metric')
    performance.markEnd('test-metric')
    performance.measure('test-metric')
    
    const metrics = performance.getMetrics()
    expect(metrics.measurements).toBeDefined()
    expect(metrics.errors).toBeDefined()
    expect(metrics.resourceTiming).toBeDefined()
  })
})

describe('Error Handler', () => {
  it('should handle errors properly', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const error = new Error('Test error')
    
    handleError(error, false)
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error occurred'),
      expect.objectContaining({
        message: 'Test error',
        timestamp: expect.any(String)
      })
    )
    
    consoleSpy.mockRestore()
  })

  it('should handle network errors differently', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const networkError = new Error('Network error')
    networkError.name = 'NetworkError'
    
    handleError(networkError, false)
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Network error'),
      expect.any(Object)
    )
    
    consoleSpy.mockRestore()
  })
})

describe('Validation Utils', () => {
  it('should validate email addresses', () => {
    expect(validateInput('test@example.com', 'email')).toBe(true)
    expect(validateInput('invalid-email', 'email')).toBe(false)
    expect(validateInput('', 'email')).toBe(false)
  })

  it('should validate required fields', () => {
    expect(validateInput('valid text', 'required')).toBe(true)
    expect(validateInput('', 'required')).toBe(false)
    expect(validateInput('   ', 'required')).toBe(false)
  })

  it('should validate minimum length', () => {
    expect(validateInput('longtext', { type: 'minLength', value: 5 })).toBe(true)
    expect(validateInput('short', { type: 'minLength', value: 10 })).toBe(false)
  })

  it('should validate numbers', () => {
    expect(validateInput('123', 'number')).toBe(true)
    expect(validateInput('123.45', 'number')).toBe(true)
    expect(validateInput('not-a-number', 'number')).toBe(false)
  })

  it('should validate positive numbers', () => {
    expect(validateInput('123', 'positiveNumber')).toBe(true)
    expect(validateInput('0', 'positiveNumber')).toBe(false)
    expect(validateInput('-123', 'positiveNumber')).toBe(false)
  })
})