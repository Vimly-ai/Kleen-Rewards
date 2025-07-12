import { useState } from 'react'
import { useAdminStore } from '../../stores/adminStore'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Badge } from '../ui/Badge'
import { 
  Settings, 
  Save, 
  X, 
  Clock, 
  Shield, 
  Bell, 
  Users,
  DollarSign,
  Globe,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react'
import { clsx } from 'clsx'

const SETTING_CATEGORIES = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'checkin', label: 'Check-in Rules', icon: Clock },
  { id: 'points', label: 'Points & Rewards', icon: DollarSign },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'features', label: 'Features', icon: Users }
]

const TIMEZONES = [
  'America/New_York',
  'America/Chicago', 
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Australia/Sydney'
]

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' }
]

export function AdminSettings() {
  const { settings, pendingChanges, updateSettings, savePendingChanges, discardPendingChanges, settingsLoading } = useAdminStore()
  const [activeCategory, setActiveCategory] = useState('general')
  const [showPasswordPolicy, setShowPasswordPolicy] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  
  const handleInputChange = (category: string, field: string, value: any) => {
    updateSettings({
      [category]: {
        ...settings[category as keyof typeof settings],
        [field]: value
      }
    })
  }
  
  const handleNestedInputChange = (category: string, parent: string, field: string, value: any) => {
    updateSettings({
      [category]: {
        ...settings[category as keyof typeof settings],
        [parent]: {
          ...(settings[category as keyof typeof settings] as any)[parent],
          [field]: value
        }
      }
    })
  }
  
  const handleSave = async () => {
    setSaveStatus('saving')
    try {
      await savePendingChanges()
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }
  
  const handleDiscard = () => {
    discardPendingChanges()
    setSaveStatus('idle')
  }
  
  const hasPendingChanges = Object.keys(pendingChanges).length > 0
  
  const getStatusIcon = () => {
    switch (saveStatus) {
      case 'saving': return <Clock className="w-4 h-4 animate-spin" />
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'error': return <AlertCircle className="w-4 h-4 text-red-600" />
      default: return <Save className="w-4 h-4" />
    }
  }
  
  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <Input
            value={settings.general.companyName}
            onChange={(e) => handleInputChange('general', 'companyName', e.target.value)}
            placeholder="Enter company name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {TIMEZONES.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={settings.general.language}
            onChange={(e) => handleInputChange('general', 'language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Format
          </label>
          <select
            value={settings.general.dateFormat}
            onChange={(e) => handleInputChange('general', 'dateFormat', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>
    </div>
  )
  
  const renderCheckInSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-medium text-gray-900">Check-in System</h4>
          <p className="text-sm text-gray-600">Configure check-in rules and bonuses</p>
        </div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.checkIn.enabled}
            onChange={(e) => handleInputChange('checkIn', 'enabled', e.target.checked)}
            className="sr-only"
          />
          <div className={clsx(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
            settings.checkIn.enabled ? 'bg-primary-600' : 'bg-gray-200'
          )}>
            <span className={clsx(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              settings.checkIn.enabled ? 'translate-x-6' : 'translate-x-1'
            )} />
          </div>
        </label>
      </div>
      
      {settings.checkIn.enabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-in Start Time
            </label>
            <Input
              type="time"
              value={settings.checkIn.startTime}
              onChange={(e) => handleInputChange('checkIn', 'startTime', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-in End Time
            </label>
            <Input
              type="time"
              value={settings.checkIn.endTime}
              onChange={(e) => handleInputChange('checkIn', 'endTime', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Early Bonus (minutes before start)
            </label>
            <Input
              type="number"
              value={settings.checkIn.earlyBonusMinutes}
              onChange={(e) => handleInputChange('checkIn', 'earlyBonusMinutes', parseInt(e.target.value))}
              min="0"
              max="60"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Early Bonus Points
            </label>
            <Input
              type="number"
              value={settings.checkIn.earlyBonusPoints}
              onChange={(e) => handleInputChange('checkIn', 'earlyBonusPoints', parseInt(e.target.value))}
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Late Penalty (minutes after end)
            </label>
            <Input
              type="number"
              value={settings.checkIn.latePenaltyMinutes}
              onChange={(e) => handleInputChange('checkIn', 'latePenaltyMinutes', parseInt(e.target.value))}
              min="0"
            />
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.checkIn.weekendEnabled}
                onChange={(e) => handleInputChange('checkIn', 'weekendEnabled', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable weekend check-ins</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.checkIn.holidayEnabled}
                onChange={(e) => handleInputChange('checkIn', 'holidayEnabled', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable holiday check-ins</span>
            </label>
          </div>
        </div>
      )}
    </div>
  )
  
  const renderPointsSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Point Values</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-in Points
            </label>
            <Input
              type="number"
              value={settings.points.checkInPoints}
              onChange={(e) => handleInputChange('points', 'checkInPoints', parseInt(e.target.value))}
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Referral Points
            </label>
            <Input
              type="number"
              value={settings.points.referralPoints}
              onChange={(e) => handleInputChange('points', 'referralPoints', parseInt(e.target.value))}
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Birthday Points
            </label>
            <Input
              type="number"
              value={settings.points.birthdayPoints}
              onChange={(e) => handleInputChange('points', 'birthdayPoints', parseInt(e.target.value))}
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anniversary Points
            </label>
            <Input
              type="number"
              value={settings.points.anniversaryPoints}
              onChange={(e) => handleInputChange('points', 'anniversaryPoints', parseInt(e.target.value))}
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Daily Points
            </label>
            <Input
              type="number"
              value={settings.points.maxDailyPoints}
              onChange={(e) => handleInputChange('points', 'maxDailyPoints', parseInt(e.target.value))}
              min="0"
            />
          </div>
        </div>
      </div>
      
      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-medium text-gray-900">Point Expiration</h4>
            <p className="text-sm text-gray-600">Configure when points expire</p>
          </div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.points.pointsExpiration}
              onChange={(e) => handleInputChange('points', 'pointsExpiration', e.target.checked)}
              className="sr-only"
            />
            <div className={clsx(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              settings.points.pointsExpiration ? 'bg-primary-600' : 'bg-gray-200'
            )}>
              <span className={clsx(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                settings.points.pointsExpiration ? 'translate-x-6' : 'translate-x-1'
              )} />
            </div>
          </label>
        </div>
        
        {settings.points.pointsExpiration && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiration Days
            </label>
            <Input
              type="number"
              value={settings.points.expirationDays}
              onChange={(e) => handleInputChange('points', 'expirationDays', parseInt(e.target.value))}
              min="1"
              max="3650"
              className="w-48"
            />
            <p className="text-sm text-gray-500 mt-1">
              Points will expire after {settings.points.expirationDays} days
            </p>
          </div>
        )}
      </div>
    </div>
  )
  
  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h4>
          <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
        </div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.security.twoFactorRequired}
            onChange={(e) => handleInputChange('security', 'twoFactorRequired', e.target.checked)}
            className="sr-only"
          />
          <div className={clsx(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
            settings.security.twoFactorRequired ? 'bg-primary-600' : 'bg-gray-200'
          )}>
            <span className={clsx(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              settings.security.twoFactorRequired ? 'translate-x-6' : 'translate-x-1'
            )} />
          </div>
        </label>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Session Timeout (minutes)
        </label>
        <Input
          type="number"
          value={settings.security.sessionTimeout}
          onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
          min="5"
          max="480"
          className="w-48"
        />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-medium text-gray-900">Password Policy</h4>
            <p className="text-sm text-gray-600">Configure password requirements</p>
          </div>
          <Button
            variant="secondary"
            size="small"
            onClick={() => setShowPasswordPolicy(!showPasswordPolicy)}
            className="flex items-center gap-2"
          >
            {showPasswordPolicy ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPasswordPolicy ? 'Hide' : 'Show'}
          </Button>
        </div>
        
        {showPasswordPolicy && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Length
              </label>
              <Input
                type="number"
                value={settings.security.passwordPolicy.minLength}
                onChange={(e) => handleNestedInputChange('security', 'passwordPolicy', 'minLength', parseInt(e.target.value))}
                min="6"
                max="50"
                className="w-32"
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.security.passwordPolicy.requireUppercase}
                  onChange={(e) => handleNestedInputChange('security', 'passwordPolicy', 'requireUppercase', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Require uppercase letters</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.security.passwordPolicy.requireNumbers}
                  onChange={(e) => handleNestedInputChange('security', 'passwordPolicy', 'requireNumbers', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Require numbers</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.security.passwordPolicy.requireSpecialChars}
                  onChange={(e) => handleNestedInputChange('security', 'passwordPolicy', 'requireSpecialChars', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Require special characters</span>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Expiration (days)
              </label>
              <Input
                type="number"
                value={settings.security.passwordPolicy.expirationDays}
                onChange={(e) => handleNestedInputChange('security', 'passwordPolicy', 'expirationDays', parseInt(e.target.value))}
                min="30"
                max="365"
                className="w-32"
              />
            </div>
          </div>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Login Attempts
        </label>
        <Input
          type="number"
          value={settings.security.maxLoginAttempts}
          onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
          min="3"
          max="10"
          className="w-32"
        />
      </div>
    </div>
  )
  
  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'general': return renderGeneralSettings()
      case 'checkin': return renderCheckInSettings()
      case 'points': return renderPointsSettings()
      case 'security': return renderSecuritySettings()
      default: return <div>Coming soon...</div>
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-7 h-7 text-primary-600" />
            System Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Configure system-wide settings and preferences
          </p>
        </div>
        
        {/* Save/Cancel Actions */}
        {hasPendingChanges && (
          <div className="flex items-center gap-3">
            <Badge className="bg-yellow-100 text-yellow-800">
              <Info className="w-3 h-3 mr-1" />
              Unsaved Changes
            </Badge>
            
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="small"
                onClick={handleDiscard}
                disabled={saveStatus === 'saving'}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Discard
              </Button>
              
              <Button
                size="small"
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className="flex items-center gap-2"
              >
                {getStatusIcon()}
                {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Navigation */}
        <Card className="lg:col-span-1">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
            <nav className="space-y-2">
              {SETTING_CATEGORIES.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={clsx(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                      activeCategory === category.id
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {category.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </Card>
        
        {/* Settings Content */}
        <Card className="lg:col-span-3">
          <div className="p-6">
            {renderCategoryContent()}
          </div>
        </Card>
      </div>
      
      {/* Status Messages */}
      {saveStatus === 'success' && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Settings saved successfully
        </div>
      )}
      
      {saveStatus === 'error' && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Failed to save settings
        </div>
      )}
    </div>
  )
}