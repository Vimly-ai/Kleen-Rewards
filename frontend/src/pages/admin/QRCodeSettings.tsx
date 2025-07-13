import React, { useState, useEffect } from 'react'
import { QrCode, RefreshCw, Settings, Clock, Award, Shield, Copy, Download } from 'lucide-react'
import { toast } from 'sonner'
import QRCode from 'qrcode'
import { useData } from '../../contexts/DataContext'
import { withErrorHandling } from '../../utils/errorHandler'

interface QRCodeConfig {
  id: string
  code: string
  url: string
  isActive: boolean
  createdAt: Date
  expiresAt: Date | null
  usageCount: number
}

interface CheckInSettings {
  timeWindow: {
    startTime: string // "06:00"
    endTime: string   // "09:00"
    timezone: string  // "America/Denver"
  }
  pointsConfig: {
    earlyBirdTime: string     // "07:45"
    earlyBirdPoints: number   // 2
    onTimeEndTime: string     // "08:01"
    onTimePoints: number      // 1
    latePoints: number        // 0
  }
  bonuses: {
    perfectWeek: number       // 5
    tenDayStreak: number      // 10
  }
}

export default function QRCodeSettings() {
  const { user } = useData()
  const [activeQRCode, setActiveQRCode] = useState<QRCodeConfig | null>(null)
  const [qrCodeHistory, setQrCodeHistory] = useState<QRCodeConfig[]>([])
  const [settings, setSettings] = useState<CheckInSettings>({
    timeWindow: {
      startTime: "06:00",
      endTime: "09:00",
      timezone: "America/Denver"
    },
    pointsConfig: {
      earlyBirdTime: "07:45",
      earlyBirdPoints: 2,
      onTimeEndTime: "08:01",
      onTimePoints: 1,
      latePoints: 0
    },
    bonuses: {
      perfectWeek: 5,
      tenDayStreak: 10
    }
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [qrImageUrl, setQrImageUrl] = useState<string>('')

  useEffect(() => {
    loadQRCodeData()
    loadSettings()
  }, [])

  useEffect(() => {
    if (activeQRCode) {
      generateQRImage(activeQRCode.url)
    }
  }, [activeQRCode])

  const loadQRCodeData = async () => {
    await withErrorHandling(async () => {
      // Load from localStorage or use demo data
      const storedCode = localStorage.getItem('systemkleen_active_qr_code')
      
      if (storedCode) {
        const qrCode = JSON.parse(storedCode)
        setActiveQRCode({
          ...qrCode,
          createdAt: new Date(qrCode.createdAt),
          expiresAt: qrCode.expiresAt ? new Date(qrCode.expiresAt) : null
        })
      } else {
        // Demo QR code
        const mockActiveCode: QRCodeConfig = {
          id: 'qr-001',
          code: 'SK2024-MAIN-001',
          url: 'https://systemkleen.com/checkin/SK2024-MAIN-001',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          expiresAt: null,
          usageCount: 156
        }
        
        // Save to localStorage so QR scanner works
        localStorage.setItem('systemkleen_active_qr_code', JSON.stringify(mockActiveCode))
        setActiveQRCode(mockActiveCode)
      }
      
      // Load history
      const storedHistory = localStorage.getItem('systemkleen_qr_history')
      if (storedHistory) {
        const history = JSON.parse(storedHistory)
        setQrCodeHistory(history.map((qr: any) => ({
          ...qr,
          createdAt: new Date(qr.createdAt),
          expiresAt: qr.expiresAt ? new Date(qr.expiresAt) : null
        })))
      } else {
        const mockHistory: QRCodeConfig[] = [
          {
            id: 'qr-old-001',
            code: 'SK2023-DEC-001',
            url: 'https://systemkleen.com/checkin/SK2023-DEC-001',
            isActive: false,
            createdAt: new Date('2023-12-01'),
            expiresAt: new Date('2023-12-31'),
            usageCount: 450
          }
        ]
        setQrCodeHistory(mockHistory)
      }
    })
  }

  const loadSettings = async () => {
    await withErrorHandling(async () => {
      // In production, load from database
      // For now, using default values set in state
    })
  }

  const generateQRImage = async (url: string) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrImageUrl(qrDataUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  const generateNewQRCode = async () => {
    setIsGenerating(true)
    
    await withErrorHandling(async () => {
      // Generate unique code
      const timestamp = Date.now().toString(36).toUpperCase()
      const random = Math.random().toString(36).substring(2, 8).toUpperCase()
      const newCode = `SK${new Date().getFullYear()}-${timestamp}-${random}`
      const newUrl = `https://systemkleen.com/checkin/${newCode}`
      
      const newQRCode: QRCodeConfig = {
        id: `qr-${Date.now()}`,
        code: newCode,
        url: newUrl,
        isActive: true,
        createdAt: new Date(),
        expiresAt: null,
        usageCount: 0
      }
      
      // Deactivate current code
      if (activeQRCode) {
        const deactivatedCode = {
          ...activeQRCode,
          isActive: false,
          expiresAt: new Date()
        }
        setQrCodeHistory([deactivatedCode, ...qrCodeHistory])
      }
      
      setActiveQRCode(newQRCode)
      
      toast.success(
        <div>
          <p className="font-medium">New QR Code Generated!</p>
          <p className="text-sm">Code: {newCode}</p>
        </div>
      )
    })
    
    setIsGenerating(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const downloadQRCode = () => {
    if (!qrImageUrl || !activeQRCode) return
    
    const link = document.createElement('a')
    link.download = `systemkleen-qr-${activeQRCode.code}.png`
    link.href = qrImageUrl
    link.click()
    
    toast.success('QR Code downloaded!')
  }

  const saveSettings = async () => {
    await withErrorHandling(async () => {
      // In production, save to database
      localStorage.setItem('checkInSettings', JSON.stringify(settings))
      toast.success('Settings saved successfully!')
    })
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <QrCode className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">QR Code Management</h1>
              <p className="text-gray-600">Manage check-in QR codes and settings</p>
            </div>
          </div>
        </div>

        {/* Active QR Code */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Active QR Code</h2>
            
            {activeQRCode && (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-center mb-6">
                  {qrImageUrl && (
                    <img src={qrImageUrl} alt="QR Code" className="w-64 h-64" />
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Code ID</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-medium">{activeQRCode.code}</p>
                      <button
                        onClick={() => copyToClipboard(activeQRCode.code)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">URL</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm break-all">{activeQRCode.url}</p>
                      <button
                        onClick={() => copyToClipboard(activeQRCode.url)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="font-medium">{activeQRCode.createdAt.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Usage Count</p>
                      <p className="font-medium">{activeQRCode.usageCount}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={downloadQRCode}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={generateNewQRCode}
                    disabled={isGenerating}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    Generate New
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Security Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Information</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-blue-900">QR Code Security</p>
                  <ul className="text-sm text-blue-800 mt-2 space-y-1">
                    <li>• Each QR code has a unique identifier</li>
                    <li>• Codes can be regenerated if compromised</li>
                    <li>• All check-ins are logged with timestamps</li>
                    <li>• Invalid QR codes are rejected automatically</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="font-medium text-amber-900 mb-2">When to Generate a New Code:</p>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• If you suspect the current code has been compromised</li>
                <li>• When changing office locations</li>
                <li>• As part of regular security rotation (monthly recommended)</li>
                <li>• After terminating an employee who had access</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Check-in Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Check-in Settings</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Time Window Settings */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Time Window
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in Start Time
                </label>
                <input
                  type="time"
                  value={settings.timeWindow.startTime}
                  onChange={(e) => setSettings({
                    ...settings,
                    timeWindow: { ...settings.timeWindow, startTime: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in End Time
                </label>
                <input
                  type="time"
                  value={settings.timeWindow.endTime}
                  onChange={(e) => setSettings({
                    ...settings,
                    timeWindow: { ...settings.timeWindow, endTime: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select
                  value={settings.timeWindow.timezone}
                  onChange={(e) => setSettings({
                    ...settings,
                    timeWindow: { ...settings.timeWindow, timezone: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="America/Denver">Mountain Time (MST/MDT)</option>
                  <option value="America/Chicago">Central Time (CST/CDT)</option>
                  <option value="America/New_York">Eastern Time (EST/EDT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PST/PDT)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Points Configuration */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Points Configuration
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Early Bird Cutoff
                  </label>
                  <input
                    type="time"
                    value={settings.pointsConfig.earlyBirdTime}
                    onChange={(e) => setSettings({
                      ...settings,
                      pointsConfig: { ...settings.pointsConfig, earlyBirdTime: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Early Points
                  </label>
                  <input
                    type="number"
                    value={settings.pointsConfig.earlyBirdPoints}
                    onChange={(e) => setSettings({
                      ...settings,
                      pointsConfig: { ...settings.pointsConfig, earlyBirdPoints: parseInt(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    On-Time Cutoff
                  </label>
                  <input
                    type="time"
                    value={settings.pointsConfig.onTimeEndTime}
                    onChange={(e) => setSettings({
                      ...settings,
                      pointsConfig: { ...settings.pointsConfig, onTimeEndTime: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    On-Time Points
                  </label>
                  <input
                    type="number"
                    value={settings.pointsConfig.onTimePoints}
                    onChange={(e) => setSettings({
                      ...settings,
                      pointsConfig: { ...settings.pointsConfig, onTimePoints: parseInt(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Late Check-in Points
                </label>
                <input
                  type="number"
                  value={settings.pointsConfig.latePoints}
                  onChange={(e) => setSettings({
                    ...settings,
                    pointsConfig: { ...settings.pointsConfig, latePoints: parseInt(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-3">Bonus Points</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Perfect Week
                    </label>
                    <input
                      type="number"
                      value={settings.bonuses.perfectWeek}
                      onChange={(e) => setSettings({
                        ...settings,
                        bonuses: { ...settings.bonuses, perfectWeek: parseInt(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      10-Day Streak
                    </label>
                    <input
                      type="number"
                      value={settings.bonuses.tenDayStreak}
                      onChange={(e) => setSettings({
                        ...settings,
                        bonuses: { ...settings.bonuses, tenDayStreak: parseInt(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={saveSettings}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Save Settings
          </button>
        </div>
      </div>

      {/* QR Code History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">QR Code History</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expired
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {qrCodeHistory.map((code) => (
                <tr key={code.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                    {code.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {code.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {code.expiresAt?.toLocaleDateString() || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {code.usageCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Expired
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}