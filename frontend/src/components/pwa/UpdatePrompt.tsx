/**
 * PWA Update Prompt Component
 * Handles service worker updates and app version management
 */

import React, { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { swUtils } from '../../utils/pwa/serviceWorker'

interface UpdatePromptProps {
  className?: string
  onUpdate?: () => void
  onDismiss?: () => void
}

export const UpdatePrompt: React.FC<UpdatePromptProps> = ({
  className = '',
  onUpdate,
  onDismiss
}) => {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [version, setVersion] = useState<string | null>(null)
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null)

  useEffect(() => {
    // Check for service worker support
    if (!swUtils.isSupported()) {
      return
    }

    let updateCheckInterval: NodeJS.Timeout

    // Register service worker with update detection
    const initializeServiceWorker = async () => {
      try {
        await swUtils.register({
          onUpdate: () => {
            console.log('Service worker update available')
            setUpdateAvailable(true)
          },
          onSuccess: async (registration) => {
            console.log('Service worker registered successfully')
            
            // Get current version
            const currentVersion = await swUtils.getVersion()
            setVersion(currentVersion)
            
            // Set up periodic update checks (every 30 minutes)
            updateCheckInterval = setInterval(async () => {
              console.log('Checking for service worker updates...')
              setLastCheckTime(new Date())
              await swUtils.checkForUpdates()
            }, 30 * 60 * 1000)
            
            // Initial update check
            setTimeout(async () => {
              await swUtils.checkForUpdates()
            }, 5000)
          },
          onError: (error) => {
            console.error('Service worker registration failed:', error)
          }
        })
      } catch (error) {
        console.error('Failed to initialize service worker:', error)
      }
    }

    initializeServiceWorker()

    // Cleanup
    return () => {
      if (updateCheckInterval) {
        clearInterval(updateCheckInterval)
      }
    }
  }, [])

  const handleUpdate = async () => {
    setIsUpdating(true)
    
    try {
      // Skip waiting and update immediately
      await swUtils.skipWaiting()
      
      // Reload the page to activate the new service worker
      window.location.reload()
    } catch (error) {
      console.error('Failed to update app:', error)
      setIsUpdating(false)
    }
    
    onUpdate?.()
  }

  const handleDismiss = () => {
    setUpdateAvailable(false)
    onDismiss?.()
  }

  const handleCheckForUpdates = async () => {
    setLastCheckTime(new Date())
    const hasUpdate = await swUtils.checkForUpdates()
    if (hasUpdate) {
      setUpdateAvailable(true)
    }
  }

  if (!updateAvailable) {
    return null
  }

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <Card className="p-4 shadow-lg max-w-sm bg-white border-l-4 border-l-green-500">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="flex-grow min-w-0">
            <h4 className="text-sm font-medium text-gray-900">
              App Update Available
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              A new version of the app is ready to install
            </p>
            {version && (
              <p className="text-xs text-gray-400 mt-1">
                Current version: {version}
              </p>
            )}
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-500"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="mt-4 flex gap-2">
          <Button
            size="sm"
            onClick={handleUpdate}
            disabled={isUpdating}
            className="flex-1"
          >
            {isUpdating ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </div>
            ) : (
              'Update Now'
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
          >
            Later
          </Button>
        </div>
      </Card>
    </div>
  )
}

// Component for manual update checking (for settings page)
export const UpdateChecker: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isChecking, setIsChecking] = useState(false)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)
  const [version, setVersion] = useState<string | null>(null)
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    // Get current version on mount
    const getCurrentVersion = async () => {
      const currentVersion = await swUtils.getVersion()
      setVersion(currentVersion)
    }
    
    getCurrentVersion()
  }, [])

  const handleCheckForUpdates = async () => {
    setIsChecking(true)
    setLastCheck(new Date())
    
    try {
      const hasUpdate = await swUtils.checkForUpdates()
      setUpdateAvailable(hasUpdate)
      
      if (hasUpdate) {
        // Show update notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('App Update Available', {
            body: 'A new version of Employee Rewards is ready to install.',
            icon: '/icon-192.png'
          })
        }
      }
    } catch (error) {
      console.error('Failed to check for updates:', error)
    } finally {
      setIsChecking(false)
    }
  }

  const handleClearCache = async () => {
    try {
      const success = await swUtils.clearCaches()
      if (success) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to clear cache:', error)
    }
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">App Updates</h3>
        <div className="flex items-center gap-2">
          {updateAvailable && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Update Available
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Version
          </label>
          <p className="text-sm text-gray-600">
            {version || 'Unknown'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Check
          </label>
          <p className="text-sm text-gray-600">
            {lastCheck ? lastCheck.toLocaleString() : 'Never'}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleCheckForUpdates}
            disabled={isChecking}
            className="flex items-center"
          >
            {isChecking && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isChecking ? 'Checking...' : 'Check for Updates'}
          </Button>

          <Button
            variant="secondary"
            onClick={handleClearCache}
          >
            Clear Cache
          </Button>
        </div>

        {updateAvailable && (
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-green-800">
                  Update Available
                </h4>
                <p className="text-sm text-green-700 mt-1">
                  A new version is ready to install. Refresh the page to update.
                </p>
                <Button
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="mt-2"
                >
                  Refresh Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}