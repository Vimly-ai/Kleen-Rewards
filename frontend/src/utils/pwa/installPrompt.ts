/**
 * PWA Install Prompt Manager
 * Handles app installation prompts and detection
 */

export interface InstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export interface InstallState {
  canInstall: boolean
  isInstalled: boolean
  isStandalone: boolean
  installPrompt: InstallPromptEvent | null
  platform: 'desktop' | 'mobile' | 'unknown'
}

class InstallPromptManager {
  private deferredPrompt: InstallPromptEvent | null = null
  private isInstalled = false
  private callbacks: {
    onInstallPromptAvailable?: (event: InstallPromptEvent) => void
    onInstallSuccess?: () => void
    onInstallDismissed?: () => void
    onAppInstalled?: () => void
  } = {}

  constructor() {
    this.setupEventListeners()
    this.detectInstallation()
  }

  /**
   * Set up event listeners for install events
   */
  private setupEventListeners(): void {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('Install prompt available')
      e.preventDefault()
      this.deferredPrompt = e as InstallPromptEvent
      this.callbacks.onInstallPromptAvailable?.(this.deferredPrompt)
    })

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      console.log('App was installed')
      this.isInstalled = true
      this.deferredPrompt = null
      this.callbacks.onAppInstalled?.()
    })

    // Listen for orientation changes (might indicate installation)
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.detectInstallation()
      }, 500)
    })
  }

  /**
   * Detect if the app is already installed
   */
  private detectInstallation(): void {
    const isStandalone = this.isStandalone()
    const wasInstalled = this.isInstalled

    this.isInstalled = isStandalone

    // If installation status changed, notify callbacks
    if (!wasInstalled && this.isInstalled) {
      this.callbacks.onAppInstalled?.()
    }
  }

  /**
   * Show install prompt
   */
  async showInstallPrompt(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
    if (!this.deferredPrompt) {
      console.warn('Install prompt not available')
      return 'unavailable'
    }

    try {
      // Show the install prompt
      await this.deferredPrompt.prompt()

      // Wait for user choice
      const choiceResult = await this.deferredPrompt.userChoice
      
      console.log('Install prompt result:', choiceResult.outcome)

      if (choiceResult.outcome === 'accepted') {
        this.callbacks.onInstallSuccess?.()
      } else {
        this.callbacks.onInstallDismissed?.()
      }

      // Clear the deferred prompt
      this.deferredPrompt = null

      return choiceResult.outcome
    } catch (error) {
      console.error('Error showing install prompt:', error)
      return 'unavailable'
    }
  }

  /**
   * Check if install prompt is available
   */
  canInstall(): boolean {
    return !!this.deferredPrompt && !this.isInstalled
  }

  /**
   * Check if app is running in standalone mode
   */
  isStandalone(): boolean {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    )
  }

  /**
   * Check if app is installed
   */
  isAppInstalled(): boolean {
    return this.isInstalled || this.isStandalone()
  }

  /**
   * Get platform type
   */
  getPlatform(): 'desktop' | 'mobile' | 'unknown' {
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      return 'mobile'
    } else if (/windows|macintosh|linux/i.test(userAgent)) {
      return 'desktop'
    }
    
    return 'unknown'
  }

  /**
   * Get current install state
   */
  getInstallState(): InstallState {
    return {
      canInstall: this.canInstall(),
      isInstalled: this.isAppInstalled(),
      isStandalone: this.isStandalone(),
      installPrompt: this.deferredPrompt,
      platform: this.getPlatform()
    }
  }

  /**
   * Set callbacks for install events
   */
  setCallbacks(callbacks: {
    onInstallPromptAvailable?: (event: InstallPromptEvent) => void
    onInstallSuccess?: () => void
    onInstallDismissed?: () => void
    onAppInstalled?: () => void
  }): void {
    this.callbacks = { ...this.callbacks, ...callbacks }
  }

  /**
   * Check if platform supports PWA installation
   */
  isPWASupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window
  }

  /**
   * Get installation instructions for the platform
   */
  getInstallInstructions(): {
    platform: string
    instructions: string[]
  } {
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (/iphone|ipad|ipod/i.test(userAgent)) {
      return {
        platform: 'iOS Safari',
        instructions: [
          'Tap the Share button at the bottom of the screen',
          'Scroll down and tap "Add to Home Screen"',
          'Tap "Add" to install the app'
        ]
      }
    } else if (/android/i.test(userAgent)) {
      if (/chrome/i.test(userAgent)) {
        return {
          platform: 'Android Chrome',
          instructions: [
            'Tap the menu button (⋮) in the top right',
            'Tap "Add to Home screen"',
            'Tap "Add" to install the app'
          ]
        }
      } else {
        return {
          platform: 'Android Browser',
          instructions: [
            'Look for the "Add to Home Screen" option in your browser menu',
            'Follow the prompts to install the app'
          ]
        }
      }
    } else if (/windows/i.test(userAgent)) {
      return {
        platform: 'Windows',
        instructions: [
          'Click the install button (⊕) in the address bar',
          'Or click the menu button and select "Install Employee Rewards"',
          'Follow the installation prompts'
        ]
      }
    } else if (/macintosh/i.test(userAgent)) {
      return {
        platform: 'macOS',
        instructions: [
          'Click the install button (⊕) in the address bar',
          'Or go to browser menu and select "Install Employee Rewards"',
          'Follow the installation prompts'
        ]
      }
    }

    return {
      platform: 'Unknown',
      instructions: [
        'Look for an install or "Add to Home Screen" option in your browser',
        'Follow the prompts to install the app'
      ]
    }
  }

  /**
   * Track install prompt usage for analytics
   */
  trackInstallPrompt(action: 'shown' | 'accepted' | 'dismissed'): void {
    // Send analytics event
    if ('gtag' in window) {
      (window as any).gtag('event', 'pwa_install_prompt', {
        action,
        platform: this.getPlatform(),
        timestamp: Date.now()
      })
    }

    console.log('PWA Install Prompt:', action)
  }

  /**
   * Check if browser supports installation
   */
  static isInstallationSupported(): boolean {
    return (
      'serviceWorker' in navigator &&
      'BeforeInstallPromptEvent' in window
    )
  }

  /**
   * Get browser-specific install instructions
   */
  static getBrowserInstallSupport(): {
    supported: boolean
    browser: string
    version?: string
  } {
    const userAgent = navigator.userAgent
    
    // Chrome/Chromium-based browsers
    if (/Chrome\/(\d+)/.test(userAgent)) {
      const version = userAgent.match(/Chrome\/(\d+)/)?.[1]
      return {
        supported: parseInt(version || '0') >= 68,
        browser: 'Chrome',
        version
      }
    }
    
    // Edge
    if (/Edg\/(\d+)/.test(userAgent)) {
      const version = userAgent.match(/Edg\/(\d+)/)?.[1]
      return {
        supported: parseInt(version || '0') >= 79,
        browser: 'Edge',
        version
      }
    }
    
    // Firefox
    if (/Firefox\/(\d+)/.test(userAgent)) {
      const version = userAgent.match(/Firefox\/(\d+)/)?.[1]
      return {
        supported: false, // Firefox doesn't support PWA installation prompts
        browser: 'Firefox',
        version
      }
    }
    
    // Safari
    if (/Safari\//.test(userAgent) && !/Chrome/.test(userAgent)) {
      return {
        supported: false, // Safari doesn't support automatic install prompts
        browser: 'Safari'
      }
    }
    
    return {
      supported: false,
      browser: 'Unknown'
    }
  }
}

// Singleton instance
export const installPromptManager = new InstallPromptManager()

// Utility functions
export const installUtils = {
  /**
   * Show install prompt
   */
  showPrompt: () => installPromptManager.showInstallPrompt(),

  /**
   * Check if can install
   */
  canInstall: () => installPromptManager.canInstall(),

  /**
   * Check if installed
   */
  isInstalled: () => installPromptManager.isAppInstalled(),

  /**
   * Check if standalone
   */
  isStandalone: () => installPromptManager.isStandalone(),

  /**
   * Get platform
   */
  getPlatform: () => installPromptManager.getPlatform(),

  /**
   * Get install state
   */
  getState: () => installPromptManager.getInstallState(),

  /**
   * Set callbacks
   */
  setCallbacks: (callbacks: Parameters<typeof installPromptManager.setCallbacks>[0]) => 
    installPromptManager.setCallbacks(callbacks),

  /**
   * Get install instructions
   */
  getInstructions: () => installPromptManager.getInstallInstructions(),

  /**
   * Track install events
   */
  track: (action: 'shown' | 'accepted' | 'dismissed') => 
    installPromptManager.trackInstallPrompt(action),

  /**
   * Check if PWA supported
   */
  isSupported: () => installPromptManager.isPWASupported(),

  /**
   * Get browser support info
   */
  getBrowserSupport: InstallPromptManager.getBrowserInstallSupport
}

export default installUtils