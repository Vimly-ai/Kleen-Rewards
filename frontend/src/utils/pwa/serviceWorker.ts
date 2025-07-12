/**
 * Service Worker Registration and Management Utilities
 */

export interface ServiceWorkerConfig {
  onUpdate?: (registration: ServiceWorkerRegistration) => void
  onSuccess?: (registration: ServiceWorkerRegistration) => void
  onError?: (error: Error) => void
}

class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null
  private config: ServiceWorkerConfig = {}

  /**
   * Register the service worker
   */
  async register(swUrl = '/sw.js', config: ServiceWorkerConfig = {}): Promise<boolean> {
    this.config = config

    if (!('serviceWorker' in navigator)) {
      console.warn('Service worker not supported in this browser')
      return false
    }

    try {
      // Register the service worker
      this.registration = await navigator.serviceWorker.register(swUrl, {
        scope: '/'
      })

      console.log('Service worker registered successfully:', this.registration.scope)

      // Set up event listeners
      this.setupEventListeners()

      // Check for updates
      this.checkForUpdates()

      this.config.onSuccess?.(this.registration)
      return true
    } catch (error) {
      console.error('Service worker registration failed:', error)
      this.config.onError?.(error as Error)
      return false
    }
  }

  /**
   * Unregister the service worker
   */
  async unregister(): Promise<boolean> {
    if (!this.registration) {
      return true
    }

    try {
      const success = await this.registration.unregister()
      if (success) {
        this.registration = null
        console.log('Service worker unregistered successfully')
      }
      return success
    } catch (error) {
      console.error('Service worker unregistration failed:', error)
      return false
    }
  }

  /**
   * Update the service worker
   */
  async update(): Promise<boolean> {
    if (!this.registration) {
      console.warn('No service worker registration found')
      return false
    }

    try {
      await this.registration.update()
      console.log('Service worker update triggered')
      return true
    } catch (error) {
      console.error('Service worker update failed:', error)
      return false
    }
  }

  /**
   * Skip waiting and activate new service worker
   */
  async skipWaiting(): Promise<void> {
    if (!this.registration?.waiting) {
      return
    }

    // Send skip waiting message to service worker
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
  }

  /**
   * Get service worker version
   */
  async getVersion(): Promise<string | null> {
    if (!this.registration?.active) {
      return null
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel()
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.version || null)
      }

      this.registration!.active!.postMessage(
        { type: 'GET_VERSION' },
        [messageChannel.port2]
      )
    })
  }

  /**
   * Clear all caches
   */
  async clearCaches(): Promise<boolean> {
    if (!this.registration?.active) {
      return false
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel()
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.success || false)
      }

      this.registration!.active!.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      )
    })
  }

  /**
   * Pre-cache specific URLs
   */
  async cacheUrls(urls: string[]): Promise<boolean> {
    if (!this.registration?.active) {
      return false
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel()
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.success || false)
      }

      this.registration!.active!.postMessage(
        { type: 'CACHE_URLS', payload: { urls } },
        [messageChannel.port2]
      )
    })
  }

  /**
   * Check if there's an update available
   */
  async checkForUpdates(): Promise<boolean> {
    if (!this.registration) {
      return false
    }

    try {
      await this.registration.update()
      return !!this.registration.waiting
    } catch (error) {
      console.error('Failed to check for updates:', error)
      return false
    }
  }

  /**
   * Get current registration
   */
  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration
  }

  /**
   * Check if service worker is supported
   */
  static isSupported(): boolean {
    return 'serviceWorker' in navigator
  }

  /**
   * Check if app is running in standalone mode (installed)
   */
  static isStandalone(): boolean {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    )
  }

  /**
   * Get connection status
   */
  static getConnectionStatus(): {
    online: boolean
    effectiveType?: string
    downlink?: number
    rtt?: number
  } {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    
    return {
      online: navigator.onLine,
      effectiveType: connection?.effectiveType,
      downlink: connection?.downlink,
      rtt: connection?.rtt
    }
  }

  private setupEventListeners(): void {
    if (!this.registration) return

    // Listen for service worker updates
    this.registration.addEventListener('updatefound', () => {
      const newWorker = this.registration!.installing
      if (!newWorker) return

      console.log('New service worker found, installing...')

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          console.log('New service worker installed, update available')
          this.config.onUpdate?.(this.registration!)
        }
      })
    })

    // Listen for controlling service worker changes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service worker controller changed, reloading page...')
      window.location.reload()
    })

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      this.handleServiceWorkerMessage(event.data)
    })
  }

  private handleServiceWorkerMessage(data: any): void {
    switch (data.type) {
      case 'CACHE_UPDATED':
        console.log('Cache updated:', data.payload)
        break
      case 'OFFLINE_FALLBACK':
        console.log('Using offline fallback:', data.payload)
        break
      case 'SYNC_COMPLETED':
        console.log('Background sync completed:', data.payload)
        break
      default:
        console.log('Unknown service worker message:', data)
    }
  }
}

// Singleton instance
export const serviceWorkerManager = new ServiceWorkerManager()

// Utility functions
export const swUtils = {
  /**
   * Register service worker with default configuration
   */
  register: (config?: ServiceWorkerConfig) => serviceWorkerManager.register('/sw.js', config),

  /**
   * Unregister service worker
   */
  unregister: () => serviceWorkerManager.unregister(),

  /**
   * Update service worker
   */
  update: () => serviceWorkerManager.update(),

  /**
   * Skip waiting for new service worker
   */
  skipWaiting: () => serviceWorkerManager.skipWaiting(),

  /**
   * Get service worker version
   */
  getVersion: () => serviceWorkerManager.getVersion(),

  /**
   * Clear all caches
   */
  clearCaches: () => serviceWorkerManager.clearCaches(),

  /**
   * Cache specific URLs
   */
  cacheUrls: (urls: string[]) => serviceWorkerManager.cacheUrls(urls),

  /**
   * Check for updates
   */
  checkForUpdates: () => serviceWorkerManager.checkForUpdates(),

  /**
   * Check if service worker is supported
   */
  isSupported: ServiceWorkerManager.isSupported,

  /**
   * Check if app is installed (standalone mode)
   */
  isInstalled: ServiceWorkerManager.isStandalone,

  /**
   * Get connection information
   */
  getConnection: ServiceWorkerManager.getConnectionStatus
}

export default swUtils