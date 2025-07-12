/**
 * Offline Indicator Component
 * Shows connection status and offline capabilities
 */

import React, { useState, useEffect } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { offlineUtils, SyncStats } from '../../utils/pwa/offlineStorage'

interface OfflineIndicatorProps {
  className?: string
  showDetails?: boolean
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  className = '',
  showDetails = false
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [syncStats, setSyncStats] = useState<SyncStats>({
    pendingActions: 0,
    completedActions: 0,
    failedActions: 0,
    lastSyncTime: 0,
    isOnline: navigator.onLine
  })
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    const updateSyncStats = async () => {
      const stats = await offlineUtils.getStats()
      setSyncStats(stats)
    }

    // Set up event listeners
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Set up sync listener
    const unsubscribeSync = offlineUtils.onSync((stats) => {
      setSyncStats(stats)
      setIsSyncing(false)
    })

    // Initial updates
    updateOnlineStatus()
    updateSyncStats()

    // Periodic stats update
    const interval = setInterval(updateSyncStats, 10000)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
      unsubscribeSync()
      clearInterval(interval)
    }
  }, [])

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      await offlineUtils.sync()
    } catch (error) {
      console.error('Sync failed:', error)
      setIsSyncing(false)
    }
  }

  const handleClearOfflineData = async () => {
    if (confirm('Are you sure you want to clear all offline data? This action cannot be undone.')) {
      await offlineUtils.clearAll()
      const stats = await offlineUtils.getStats()
      setSyncStats(stats)
    }
  }

  const getConnectionIcon = () => {
    if (isOnline) {
      return (
        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      )
    } else {
      return (
        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM4 1a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
      )
    }
  }

  const formatLastSync = (timestamp: number) => {
    if (!timestamp) return 'Never'
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
  }

  // Simple indicator for general use
  if (!showDetails && isOnline && syncStats.pendingActions === 0) {
    return null
  }

  if (!showDetails) {
    return (
      <div className={`fixed bottom-4 left-4 z-40 ${className}`}>
        <Card className="p-3 shadow-lg bg-white">
          <div className="flex items-center gap-2">
            {getConnectionIcon()}
            <span className={`text-sm font-medium ${isOnline ? 'text-green-700' : 'text-red-700'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
            {syncStats.pendingActions > 0 && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-orange-600">
                  {syncStats.pendingActions} pending
                </span>
              </>
            )}
          </div>
        </Card>
      </div>
    )
  }

  // Detailed view for settings page
  return (
    <Card className={`${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Connection & Sync Status
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center gap-3">
            {getConnectionIcon()}
            <div>
              <p className={`font-medium ${isOnline ? 'text-green-700' : 'text-red-700'}`}>
                {isOnline ? 'Connected' : 'Offline'}
              </p>
              <p className="text-sm text-gray-500">
                {isOnline 
                  ? 'All features available'
                  : 'Working with cached data'
                }
              </p>
            </div>
          </div>

          {/* Sync Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {syncStats.pendingActions}
              </p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {syncStats.completedActions}
              </p>
              <p className="text-sm text-gray-500">Synced</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {syncStats.failedActions}
              </p>
              <p className="text-sm text-gray-500">Failed</p>
            </div>
          </div>

          {/* Last Sync */}
          <div>
            <p className="text-sm font-medium text-gray-700">Last Sync</p>
            <p className="text-sm text-gray-500">
              {formatLastSync(syncStats.lastSyncTime)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleSync}
              disabled={!isOnline || isSyncing}
              className="flex items-center"
            >
              {isSyncing && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>

            {isExpanded && (
              <Button
                variant="secondary"
                onClick={handleClearOfflineData}
              >
                Clear Offline Data
              </Button>
            )}
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Offline Capabilities</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  View cached dashboard data
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Queue check-ins for later sync
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Browse rewards and achievements
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Automatic sync when reconnected
                </li>
              </ul>

              {syncStats.pendingActions > 0 && (
                <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-orange-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h5 className="text-sm font-medium text-orange-800">
                        Pending Actions
                      </h5>
                      <p className="text-sm text-orange-700">
                        {syncStats.pendingActions} actions are waiting to be synced when you're back online.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}