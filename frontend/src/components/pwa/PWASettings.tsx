/**
 * PWA Settings Page Component
 * Comprehensive settings panel for PWA features
 */

import React from 'react'
import { Card } from '../ui/Card'
import { NotificationSettings } from './NotificationSettings'
import { UpdateChecker } from './UpdatePrompt'
import { OfflineIndicator } from './OfflineIndicator'
import { useInstallPrompt } from './InstallPrompt'

interface PWASettingsProps {
  className?: string
}

export const PWASettings: React.FC<PWASettingsProps> = ({
  className = ''
}) => {
  const {
    canInstall,
    isInstalled,
    isStandalone,
    platform,
    install,
    isSupported,
    instructions
  } = useInstallPrompt()

  const handleManualInstall = async () => {
    if (canInstall) {
      await install()
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* PWA Overview */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Progressive Web App Settings
        </h2>
        <p className="text-gray-600 mb-6">
          Configure your PWA experience with offline support, push notifications, and native app features.
        </p>

        {/* Installation Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 border rounded-lg">
            <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
              isInstalled ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <svg className={`w-6 h-6 ${isInstalled ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
            </div>
            <h3 className="font-medium text-gray-900">Installation</h3>
            <p className={`text-sm ${isInstalled ? 'text-green-600' : 'text-gray-500'}`}>
              {isInstalled ? 'Installed' : 'Web Version'}
            </p>
          </div>

          <div className="text-center p-4 border rounded-lg">
            <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
              isStandalone ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <svg className={`w-6 h-6 ${isStandalone ? 'text-blue-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900">Display Mode</h3>
            <p className={`text-sm ${isStandalone ? 'text-blue-600' : 'text-gray-500'}`}>
              {isStandalone ? 'Standalone' : 'Browser'}
            </p>
          </div>

          <div className="text-center p-4 border rounded-lg">
            <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
            </div>
            <h3 className="font-medium text-gray-900">Platform</h3>
            <p className="text-sm text-purple-600 capitalize">
              {platform}
            </p>
          </div>
        </div>

        {/* Installation Actions */}
        {!isInstalled && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-900">
                  Install for Better Experience
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  Install the app for offline access, push notifications, and native features.
                </p>
              </div>
              {canInstall && isSupported && (
                <button
                  onClick={handleManualInstall}
                  className="ml-3 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Install Now
                </button>
              )}
            </div>

            {/* Manual Instructions */}
            {(!canInstall || !isSupported) && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <h5 className="text-sm font-medium text-blue-900 mb-2">
                  Manual Installation ({instructions.platform}):
                </h5>
                <ol className="text-sm text-blue-800 space-y-1">
                  {instructions.instructions.map((instruction, index) => (
                    <li key={index} className="flex">
                      <span className="mr-2 font-medium">{index + 1}.</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Notification Settings */}
      <NotificationSettings />

      {/* Update Management */}
      <UpdateChecker />

      {/* Offline Status */}
      <OfflineIndicator showDetails />

      {/* PWA Features Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          PWA Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Core Features</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Offline support with smart caching
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Push notifications for achievements
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Background sync for check-ins
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Automatic app updates
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Native Integration</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                App shortcuts for quick actions
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Share target integration
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                File handling capabilities
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Platform-specific optimizations
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Browser Compatibility */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Browser Compatibility
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium text-gray-900">Feature</th>
                <th className="text-center py-2 font-medium text-gray-900">Chrome</th>
                <th className="text-center py-2 font-medium text-gray-900">Firefox</th>
                <th className="text-center py-2 font-medium text-gray-900">Safari</th>
                <th className="text-center py-2 font-medium text-gray-900">Edge</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-100">
                <td className="py-2 text-gray-900">Service Workers</td>
                <td className="text-center py-2">
                  <span className="text-green-600">✓</span>
                </td>
                <td className="text-center py-2">
                  <span className="text-green-600">✓</span>
                </td>
                <td className="text-center py-2">
                  <span className="text-green-600">✓</span>
                </td>
                <td className="text-center py-2">
                  <span className="text-green-600">✓</span>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 text-gray-900">Install Prompts</td>
                <td className="text-center py-2">
                  <span className="text-green-600">✓</span>
                </td>
                <td className="text-center py-2">
                  <span className="text-red-600">✗</span>
                </td>
                <td className="text-center py-2">
                  <span className="text-yellow-600">Manual</span>
                </td>
                <td className="text-center py-2">
                  <span className="text-green-600">✓</span>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 text-gray-900">Push Notifications</td>
                <td className="text-center py-2">
                  <span className="text-green-600">✓</span>
                </td>
                <td className="text-center py-2">
                  <span className="text-green-600">✓</span>
                </td>
                <td className="text-center py-2">
                  <span className="text-green-600">✓</span>
                </td>
                <td className="text-center py-2">
                  <span className="text-green-600">✓</span>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 text-gray-900">Background Sync</td>
                <td className="text-center py-2">
                  <span className="text-green-600">✓</span>
                </td>
                <td className="text-center py-2">
                  <span className="text-red-600">✗</span>
                </td>
                <td className="text-center py-2">
                  <span className="text-red-600">✗</span>
                </td>
                <td className="text-center py-2">
                  <span className="text-green-600">✓</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          * Manual installation available for all browsers via "Add to Home Screen" or browser menu options
        </p>
      </Card>
    </div>
  )
}