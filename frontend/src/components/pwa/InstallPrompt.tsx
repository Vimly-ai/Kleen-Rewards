/**
 * PWA Install Prompt Component
 * Shows installation prompt and manages PWA installation state
 */

import React, { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { installUtils } from '../../utils/pwa/installPrompt'
import type { InstallState } from '../../utils/pwa/installPrompt'

interface InstallPromptProps {
  className?: string
  showMinimized?: boolean
  onInstall?: () => void
  onDismiss?: () => void
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({
  className = '',
  showMinimized = false,
  onInstall,
  onDismiss
}) => {
  const [installState, setInstallState] = useState<InstallState>({
    canInstall: false,
    isInstalled: false,
    isStandalone: false,
    installPrompt: null,
    platform: 'unknown'
  })
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)

  useEffect(() => {
    // Check if user has already dismissed the prompt
    const dismissed = localStorage.getItem('install-prompt-dismissed')
    if (dismissed) {
      setIsDismissed(true)
    }

    // Update install state
    const updateState = () => {
      setInstallState(installUtils.getState())
    }

    updateState()

    // Set up callbacks
    installUtils.setCallbacks({
      onInstallPromptAvailable: () => {
        updateState()
        if (!isDismissed) {
          setIsVisible(true)
        }
      },
      onInstallSuccess: () => {
        setIsInstalling(false)
        setIsVisible(false)
        onInstall?.()
      },
      onInstallDismissed: () => {
        setIsInstalling(false)
      },
      onAppInstalled: () => {
        updateState()
        setIsVisible(false)
        onInstall?.()
      }
    })

    // Check install state periodically
    const interval = setInterval(updateState, 5000)
    return () => clearInterval(interval)
  }, [isDismissed, onInstall])

  const handleInstall = async () => {
    setIsInstalling(true)
    installUtils.track('shown')
    
    const result = await installUtils.showPrompt()
    
    if (result === 'accepted') {
      installUtils.track('accepted')
    } else if (result === 'dismissed') {
      installUtils.track('dismissed')
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('install-prompt-dismissed', 'true')
    onDismiss?.()
  }

  const handleRemindLater = () => {
    setIsVisible(false)
    // Show again in 24 hours
    setTimeout(() => {
      if (!installState.isInstalled) {
        setIsVisible(true)
      }
    }, 24 * 60 * 60 * 1000)
  }

  // Don't show if already installed or dismissed
  if (installState.isInstalled || !installState.canInstall || isDismissed || !isVisible) {
    return null
  }

  const instructions = installUtils.getInstructions()

  if (showMinimized) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Card className="p-4 shadow-lg max-w-sm bg-white border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-sm font-medium text-gray-900">
                Install App
              </p>
              <p className="text-xs text-gray-500">
                Quick access from your home screen
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleInstall}
              disabled={isInstalling}
              className="flex-shrink-0"
            >
              {isInstalling ? 'Installing...' : 'Install'}
            </Button>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-gray-400 hover:text-gray-500"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 ${className}`}>
      <Card className="w-full max-w-md bg-white shadow-xl">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 mr-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Install Employee Rewards
              </h3>
              <p className="text-sm text-gray-500">
                Add to your {installState.platform === 'mobile' ? 'home screen' : 'desktop'}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Benefits:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Instant access from your {installState.platform === 'mobile' ? 'home screen' : 'desktop'}
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Works offline with cached data
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Push notifications for achievements and updates
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Faster loading and smoother experience
              </li>
            </ul>
          </div>

          {/* Show manual instructions for unsupported browsers */}
          {!installUtils.isSupported() && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                Manual Installation ({instructions.platform})
              </h4>
              <ol className="text-sm text-blue-800 space-y-1">
                {instructions.instructions.map((instruction, index) => (
                  <li key={index} className="flex">
                    <span className="mr-2">{index + 1}.</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleInstall}
              disabled={isInstalling}
              className="flex-1"
            >
              {isInstalling ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Installing...
                </div>
              ) : (
                'Install Now'
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={handleRemindLater}
              className="px-4"
            >
              Later
            </Button>
            <Button
              variant="ghost"
              onClick={handleDismiss}
              className="px-4"
            >
              No Thanks
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Hook for using install prompt state
export const useInstallPrompt = () => {
  const [installState, setInstallState] = useState<InstallState>(installUtils.getState())

  useEffect(() => {
    const updateState = () => {
      setInstallState(installUtils.getState())
    }

    updateState()

    installUtils.setCallbacks({
      onInstallPromptAvailable: updateState,
      onInstallSuccess: updateState,
      onAppInstalled: updateState
    })

    const interval = setInterval(updateState, 5000)
    return () => clearInterval(interval)
  }, [])

  return {
    ...installState,
    install: installUtils.showPrompt,
    isSupported: installUtils.isSupported(),
    instructions: installUtils.getInstructions()
  }
}