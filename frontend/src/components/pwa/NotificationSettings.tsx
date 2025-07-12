/**
 * PWA Notification Settings Component
 * Manages push notification preferences and subscription
 */

import React, { useState, useEffect } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { useNotificationService } from '../../services/notifications'
import { useNotifications } from '../../stores/notificationStore'

interface NotificationPreferences {
  achievements: boolean
  rewards: boolean
  checkinReminders: boolean
  adminAnnouncements: boolean
  pointsUpdates: boolean
  systemMaintenance: boolean
}

interface NotificationSettingsProps {
  className?: string
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  className = ''
}) => {
  const { service, subscribe, unsubscribe, isSubscribed, testNotification } = useNotificationService()
  const { success, error } = useNotifications()
  
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    achievements: true,
    rewards: true,
    checkinReminders: true,
    adminAnnouncements: true,
    pointsUpdates: false,
    systemMaintenance: true
  })
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    const checkStatus = async () => {
      setPermission(Notification.permission)
      const isSubbed = await isSubscribed()
      setSubscribed(isSubbed)
    }

    checkStatus()
    
    // Load saved preferences
    const savedPreferences = localStorage.getItem('notification-preferences')
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences))
      } catch (error) {
        console.warn('Failed to load notification preferences:', error)
      }
    }
  }, [isSubscribed])

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const subscription = await subscribe()
      if (subscription) {
        setSubscribed(true)
        setPermission('granted')
        success('Notifications enabled successfully!')
      } else {
        error('Failed to enable notifications')
      }
    } catch (err) {
      console.error('Subscription failed:', err)
      error('Failed to enable notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleUnsubscribe = async () => {
    setLoading(true)
    try {
      const success = await unsubscribe()
      if (success) {
        setSubscribed(false)
      }
    } catch (err) {
      console.error('Unsubscribe failed:', err)
      error('Failed to disable notifications')
    } finally {
      setLoading(false)
    }
  }

  const handlePreferenceChange = async (key: keyof NotificationPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    
    // Save to localStorage
    localStorage.setItem('notification-preferences', JSON.stringify(newPreferences))
    
    // Update server preferences if subscribed
    if (subscribed) {
      try {
        await service.updatePreferences(newPreferences)
      } catch (error) {
        console.error('Failed to update server preferences:', error)
      }
    }
  }

  const handleTestNotification = async () => {
    setLoading(true)
    try {
      await testNotification()
    } catch (err) {
      console.error('Test notification failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return {
          color: 'text-green-600',
          bg: 'bg-green-50',
          text: 'Enabled',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )
        }
      case 'denied':
        return {
          color: 'text-red-600',
          bg: 'bg-red-50',
          text: 'Blocked',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM4 1a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          )
        }
      default:
        return {
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          text: 'Not Set',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )
        }
    }
  }

  const permissionStatus = getPermissionStatus()

  const preferenceOptions = [
    {
      key: 'achievements' as keyof NotificationPreferences,
      label: 'Achievement Unlocks',
      description: 'Get notified when you unlock new achievements',
      icon: '🏆'
    },
    {
      key: 'rewards' as keyof NotificationPreferences,
      label: 'New Rewards Available',
      description: 'Notifications when new rewards become available to claim',
      icon: '🎁'
    },
    {
      key: 'checkinReminders' as keyof NotificationPreferences,
      label: 'Check-in Reminders',
      description: 'Daily reminders to check in and earn points',
      icon: '📅'
    },
    {
      key: 'adminAnnouncements' as keyof NotificationPreferences,
      label: 'Admin Announcements',
      description: 'Important announcements from administrators',
      icon: '📢'
    },
    {
      key: 'pointsUpdates' as keyof NotificationPreferences,
      label: 'Points Updates',
      description: 'Every time you earn or spend points',
      icon: '⭐'
    },
    {
      key: 'systemMaintenance' as keyof NotificationPreferences,
      label: 'System Maintenance',
      description: 'Notifications about scheduled maintenance',
      icon: '🔧'
    }
  ]

  return (
    <Card className={`${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Push Notifications
          </h3>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${permissionStatus.bg} ${permissionStatus.color}`}>
            {permissionStatus.icon}
            <span className="ml-2">{permissionStatus.text}</span>
          </div>
        </div>

        {/* Main Toggle */}
        <div className="mb-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">
                Enable Push Notifications
              </h4>
              <p className="text-sm text-gray-500">
                Receive real-time notifications for achievements, rewards, and updates
              </p>
            </div>
            <div className="flex items-center gap-3">
              {subscribed && permission === 'granted' && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleTestNotification}
                  disabled={loading}
                >
                  Test
                </Button>
              )}
              <Button
                onClick={subscribed ? handleUnsubscribe : handleSubscribe}
                disabled={loading || permission === 'denied'}
                className={subscribed ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {subscribed ? 'Disabling...' : 'Enabling...'}
                  </div>
                ) : (
                  subscribed ? 'Disable Notifications' : 'Enable Notifications'
                )}
              </Button>
            </div>
          </div>

          {permission === 'denied' && (
            <div className="mt-3 p-3 bg-red-50 rounded-lg">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-red-800">
                    Notifications Blocked
                  </h4>
                  <p className="text-sm text-red-700 mt-1">
                    Notifications are blocked in your browser. To enable them, click the icon in your address bar or go to your browser settings.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notification Preferences */}
        {subscribed && permission === 'granted' && (
          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              Notification Types
            </h4>
            <div className="space-y-4">
              {preferenceOptions.map((option) => (
                <div key={option.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{option.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {option.label}
                      </p>
                      <p className="text-sm text-gray-500">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={preferences[option.key]}
                      onChange={(e) => handlePreferenceChange(option.key, e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Browser Information */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">
            Browser Support
          </h4>
          <div className="text-sm text-gray-600 space-y-2">
            <div className="flex items-center">
              <span className="w-24 font-medium">Browser:</span>
              <span>{navigator.userAgent.match(/(?:Chrome|Firefox|Safari|Edge)\/[0-9.]+/)?.[0] || 'Unknown'}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 font-medium">Support:</span>
              <span className={`font-medium ${
                'Notification' in window ? 'text-green-600' : 'text-red-600'
              }`}>
                {'Notification' in window ? 'Supported' : 'Not Supported'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-24 font-medium">Permission:</span>
              <span className={`font-medium ${permissionStatus.color}`}>
                {permissionStatus.text}
              </span>
            </div>
          </div>

          {!('Notification' in window) && (
            <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
              <div className="flex">
                <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h5 className="text-sm font-medium text-yellow-800">
                    Notifications Not Supported
                  </h5>
                  <p className="text-sm text-yellow-700">
                    Your browser doesn't support push notifications. Consider using a modern browser like Chrome, Firefox, or Safari.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}