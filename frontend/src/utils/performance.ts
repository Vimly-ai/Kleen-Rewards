// Performance monitoring utilities

// Web Vitals metrics tracking
interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}

interface ErrorInfo {
  message: string
  stack?: string
  timestamp: number
  url: string
  userAgent: string
}

interface MeasurementData {
  name: string
  startTime: number
  endTime?: number
  duration?: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private observer: PerformanceObserver | null = null
  private errors: ErrorInfo[] = []
  private measurements: MeasurementData[] = []
  private initialized = false

  constructor() {
    // Don't auto-initialize to allow for controlled initialization
  }

  public initialize() {
    if (this.initialized) return
    
    this.initialized = true
    this.initializePerformanceObserver()
    this.trackPageLoad()
    this.setupErrorTracking()
  }

  public isInitialized(): boolean {
    return this.initialized
  }

  private initializePerformanceObserver() {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.processPerformanceEntry(entry)
        }
      })

      try {
        // Observe various performance metrics
        this.observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] })
      } catch (error) {
        console.warn('PerformanceObserver not fully supported:', error)
      }
    }
  }

  private processPerformanceEntry(entry: PerformanceEntry) {
    const timestamp = Date.now()

    switch (entry.entryType) {
      case 'navigation':
        const navEntry = entry as PerformanceNavigationTiming
        this.addMetric('FCP', navEntry.loadEventEnd - navEntry.fetchStart, timestamp)
        break

      case 'paint':
        if (entry.name === 'first-contentful-paint') {
          this.addMetric('FCP', entry.startTime, timestamp)
        }
        break

      case 'largest-contentful-paint':
        this.addMetric('LCP', entry.startTime, timestamp)
        break
    }
  }

  private addMetric(name: string, value: number, timestamp: number) {
    const rating = this.getRating(name, value)
    this.metrics.push({ name, value, rating, timestamp })

    // Log in development
    if (import.meta.env.DEV) {
      console.log(`Performance metric - ${name}: ${value.toFixed(2)}ms (${rating})`)
    }

    // Send to analytics in production
    if (import.meta.env.PROD) {
      this.sendToAnalytics({ name, value, rating, timestamp })
    }
  }

  private getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = {
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      TTFB: { good: 800, poor: 1800 }
    }

    const threshold = thresholds[name as keyof typeof thresholds]
    if (!threshold) return 'good'

    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
  }

  private trackPageLoad() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        // Use setTimeout to ensure all resources are loaded
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
          
          if (perfData) {
            const metrics = {
              'DNS Lookup': perfData.domainLookupEnd - perfData.domainLookupStart,
              'TCP Connection': perfData.connectEnd - perfData.connectStart,
              'TLS Handshake': perfData.secureConnectionStart ? perfData.connectEnd - perfData.secureConnectionStart : 0,
              'Request': perfData.responseStart - perfData.requestStart,
              'Response': perfData.responseEnd - perfData.responseStart,
              'DOM Processing': perfData.domComplete - perfData.domLoading,
              'Load Event': perfData.loadEventEnd - perfData.loadEventStart,
              'Total Load Time': perfData.loadEventEnd - perfData.fetchStart
            }

            Object.entries(metrics).forEach(([name, value]) => {
              if (value > 0) {
                this.addMetric(name, value, Date.now())
              }
            })
          }
        }, 0)
      })
    }
  }

  private sendToAnalytics(metric: PerformanceMetric) {
    // TODO: Implement analytics service integration
    // This could be Google Analytics, Mixpanel, etc.
    console.log('Analytics metric:', metric)
  }

  private setupErrorTracking() {
    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      this.recordError({
        message: event.message,
        stack: event.error?.stack,
        timestamp: Date.now(),
        url: event.filename || window.location.href,
        userAgent: navigator.userAgent
      })
    })

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.recordError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      })
    })
  }

  // Performance measurement methods
  public markStart(name: string): void {
    const existing = this.measurements.find(m => m.name === name && !m.endTime)
    if (existing) {
      console.warn(`Performance mark '${name}' already started`)
      return
    }

    this.measurements.push({
      name,
      startTime: performance.now()
    })

    if ('performance' in window && 'mark' in performance) {
      performance.mark(`${name}-start`)
    }
  }

  public markEnd(name: string): void {
    const measurement = this.measurements.find(m => m.name === name && !m.endTime)
    if (!measurement) {
      console.warn(`No start mark found for '${name}'`)
      return
    }

    measurement.endTime = performance.now()
    measurement.duration = measurement.endTime - measurement.startTime

    if ('performance' in window && 'mark' in performance) {
      performance.mark(`${name}-end`)
    }
  }

  public measure(name: string): MeasurementData | null {
    const measurement = this.measurements.find(m => m.name === name && m.endTime)
    if (!measurement) {
      console.warn(`No completed measurement found for '${name}'`)
      return null
    }

    if ('performance' in window && 'measure' in performance) {
      try {
        performance.measure(name, `${name}-start`, `${name}-end`)
      } catch (error) {
        console.warn(`Failed to create performance measure for '${name}':`, error)
      }
    }

    return measurement
  }

  public recordError(error: Error | ErrorInfo): void {
    const errorInfo: ErrorInfo = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    } : error

    this.errors.push(errorInfo)

    // Keep only last 50 errors to prevent memory leaks
    if (this.errors.length > 50) {
      this.errors = this.errors.slice(-50)
    }
  }

  // Public methods
  public getMetrics(): {
    measurements: MeasurementData[]
    errors: ErrorInfo[]
    resourceTiming: PerformanceResourceTiming[]
    vitals: PerformanceMetric[]
  } {
    return {
      measurements: [...this.measurements],
      errors: [...this.errors],
      resourceTiming: this.getResourceTiming(),
      vitals: [...this.metrics]
    }
  }

  public getResourceTiming(): PerformanceResourceTiming[] {
    if ('performance' in window && 'getEntriesByType' in performance) {
      return performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    }
    return []
  }

  public getErrors(): ErrorInfo[] {
    return [...this.errors]
  }

  public getMeasurements(): MeasurementData[] {
    return [...this.measurements]
  }

  public getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(metric => metric.name === name)
  }

  public clearMetrics(): void {
    this.metrics = []
    this.measurements = []
    this.errors = []
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  }
}

// Bundle size analyzer
export function analyzeBundleSize() {
  if ('performance' in window) {
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    
    const jsFiles = entries.filter(entry => 
      entry.name.includes('.js') && !entry.name.includes('node_modules')
    )

    const cssFiles = entries.filter(entry => 
      entry.name.includes('.css')
    )

    const totalJSSize = jsFiles.reduce((total, entry) => 
      total + (entry.transferSize || 0), 0
    )

    const totalCSSSize = cssFiles.reduce((total, entry) => 
      total + (entry.transferSize || 0), 0
    )

    return {
      jsFiles: jsFiles.length,
      cssFiles: cssFiles.length,
      totalJSSize: Math.round(totalJSSize / 1024), // KB
      totalCSSSize: Math.round(totalCSSSize / 1024), // KB
      largestJS: jsFiles.reduce((largest, entry) => 
        (entry.transferSize || 0) > (largest.transferSize || 0) ? entry : largest
      , jsFiles[0])
    }
  }

  return null
}

// Memory usage monitoring
export function getMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576 * 100) / 100, // MB
      total: Math.round(memory.totalJSHeapSize / 1048576 * 100) / 100, // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1048576 * 100) / 100 // MB
    }
  }
  return null
}

// React component performance wrapper
export function measureComponentRender<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  componentName: string
) {
  return function MeasuredComponent(props: T) {
    const startTime = performance.now()
    
    React.useEffect(() => {
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      if (renderTime > 16) { // Warn if render takes longer than one frame
        console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms`)
      }
    })

    return React.createElement(Component, props)
  }
}

// Lazy loading observer
export function createLazyLoadObserver(callback: () => void) {
  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            callback()
          }
        })
      },
      { threshold: 0.1 }
    )
  }
  return null
}

// Export singleton instance
export const performance = new PerformanceMonitor()

// Cleanup function for app unmount
export function cleanupPerformanceMonitoring() {
  performance.destroy()
}

// Bundle analysis for development
export async function analyzeBundleInDev() {
  if (import.meta.env.DEV) {
    const bundleData = analyzeBundleSize()
    const memoryData = getMemoryUsage()
    
    console.group('📊 Bundle Analysis')
    console.log('Bundle Size:', bundleData)
    console.log('Memory Usage:', memoryData)
    console.log('Performance Metrics:', performance.getMetrics())
    console.groupEnd()
  }
}

// Real-time performance monitoring hook for React
export function usePerformanceMonitoring() {
  React.useEffect(() => {
    if (!performance.isInitialized()) {
      performance.initialize()
    }

    const interval = setInterval(() => {
      const memoryData = getMemoryUsage()
      if (memoryData && memoryData.used > 100) { // Alert if using more than 100MB
        console.warn('High memory usage detected:', memoryData)
      }
    }, 30000) // Check every 30 seconds

    return () => {
      clearInterval(interval)
    }
  }, [])

  return {
    getMetrics: () => performance.getMetrics(),
    recordError: (error: Error) => performance.recordError(error),
    markStart: (name: string) => performance.markStart(name),
    markEnd: (name: string) => performance.markEnd(name),
    measure: (name: string) => performance.measure(name)
  }
}

// Performance budget checker
export function checkPerformanceBudget() {
  const budgets = {
    totalJSSize: 500, // KB
    totalCSSSize: 100, // KB
    maxRenderTime: 16, // ms (one frame)
    maxMemoryUsage: 150, // MB
    maxErrors: 0
  }

  const bundleData = analyzeBundleSize()
  const memoryData = getMemoryUsage()
  const metrics = performance.getMetrics()
  
  const violations = []

  if (bundleData && bundleData.totalJSSize > budgets.totalJSSize) {
    violations.push(`JS bundle size (${bundleData.totalJSSize}KB) exceeds budget (${budgets.totalJSSize}KB)`)
  }

  if (bundleData && bundleData.totalCSSSize > budgets.totalCSSSize) {
    violations.push(`CSS bundle size (${bundleData.totalCSSSize}KB) exceeds budget (${budgets.totalCSSSize}KB)`)
  }

  if (memoryData && memoryData.used > budgets.maxMemoryUsage) {
    violations.push(`Memory usage (${memoryData.used}MB) exceeds budget (${budgets.maxMemoryUsage}MB)`)
  }

  if (metrics.errors.length > budgets.maxErrors) {
    violations.push(`Error count (${metrics.errors.length}) exceeds budget (${budgets.maxErrors})`)
  }

  return {
    passed: violations.length === 0,
    violations,
    budgets,
    actual: {
      jsSize: bundleData?.totalJSSize || 0,
      cssSize: bundleData?.totalCSSSize || 0,
      memoryUsage: memoryData?.used || 0,
      errorCount: metrics.errors.length
    }
  }
}