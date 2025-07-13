import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useData } from '../../contexts/DataContext'
import { useUpdateUserProfile, useUserStats } from '../../queries/userQueries'
import { useAppStore } from '../../stores/appStore'
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { StatCard } from '../../components/ui/StatCard'
import { AvatarSelector } from '../../components/employee/AvatarSelector'
import { ActivityTimeline } from '../../components/employee/ActivityTimeline'
import { 
  User, 
  Mail, 
  Building, 
  Settings, 
  Bell, 
  Moon, 
  Sun, 
  Monitor,
  Shield,
  Edit,
  Save,
  X,
  Calendar,
  Star,
  Trophy,
  Zap,
  Activity,
  Clock,
  Target
} from 'lucide-react'
import { clsx } from 'clsx'

export default function EmployeeProfile() {
  const { user: clerkUser } = useUser()
  const { user: dbUser, loading: isLoading } = useData()
  const { data: userStats } = useUserStats(dbUser?.id || '')
  const updateProfileMutation = useUpdateUserProfile()
  const { theme, setTheme, preferences, updatePreferences } = useAppStore()
  
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'activity'>('overview')
  const [currentAvatar, setCurrentAvatar] = useState('default-1')
  const [profileForm, setProfileForm] = useState({
    name: '',
    department: ''
  })

  // Initialize form when data loads
  useEffect(() => {
    if (dbUser) {
      setProfileForm({
        name: dbUser.name,
        department: dbUser.department || ''
      })
    }
  }, [dbUser])
  
  // Get real user activities from their data
  const userActivities = []
  
  // Add achievements as activities
  if (userStats?.badges) {
    userActivities.push(...userStats.badges.map((badge, index) => ({
      id: `achievement-${index}`,
      type: 'achievement_unlocked' as const,
      title: 'Achievement Unlocked',
      description: `You unlocked a new achievement!`,
      timestamp: new Date(badge.unlockedAt),
      points: 100
    })))
  }
  
  // For now, we'll show empty state for new users until they have real activities
  // In a full implementation, this would include:
  // - Check-in history from database
  // - Point transactions
  // - Reward redemptions
  // - Level ups
  // - Streak milestones

  const handleSaveProfile = async () => {
    if (!dbUser) return

    try {
      await updateProfileMutation.mutateAsync({
        id: dbUser.id,
        name: profileForm.name,
        department: profileForm.department
      })
      setIsEditing(false)
    } catch (error) {
      // Error handled by mutation
    }
  }
  
  const handleAvatarChange = (avatarId: string) => {
    setCurrentAvatar(avatarId)
    // In real app, this would save to backend
  }

  const handleCancelEdit = () => {
    if (dbUser) {
      setProfileForm({
        name: dbUser.name,
        department: dbUser.department || ''
      })
    }
    setIsEditing(false)
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator'
      case 'super_admin': return 'Super Administrator'
      case 'employee': return 'Employee'
      default: return 'Employee'
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'primary'
      case 'super_admin': return 'success'
      default: return 'secondary'
    }
  }

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading profile..." />
  }

  if (!dbUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Profile not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Profile & Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your account, preferences, and view your activity
            </p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={clsx(
              'py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2',
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            )}
          >
            <User className="w-4 h-4" />
            Profile Overview
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={clsx(
              'py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2',
              activeTab === 'settings'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            )}
          >
            <Settings className="w-4 h-4" />
            Settings & Preferences
          </button>
          
          <button
            onClick={() => setActiveTab('activity')}
            className={clsx(
              'py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2',
              activeTab === 'activity'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            )}
          >
            <Activity className="w-4 h-4" />
            Activity Timeline
          </button>
        </nav>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Profile Stats */}
          {userStats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Points"
                value={userStats.totalPoints}
                icon={<Star className="w-6 h-6" />}
                color="primary"
              />
              
              <StatCard
                title="Current Streak"
                value={userStats.currentStreak}
                icon={<Zap className="w-6 h-6" />}
                color="warning"
                format={(val) => `${val} days`}
              />
              
              <StatCard
                title="Achievements"
                value={userStats.badges?.length || 0}
                icon={<Trophy className="w-6 h-6" />}
                color="success"
              />
              
              <StatCard
                title="Check-ins"
                value={userStats.totalCheckIns || 0}
                icon={<Calendar className="w-6 h-6" />}
                color="neutral"
              />
            </div>
          )}
          
          {/* Profile Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Profile */}
            <Card>
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Personal Information
                  </h2>
                  {!isEditing ? (
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={handleCancelEdit}
                        className="flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                      <Button
                        size="small"
                        onClick={handleSaveProfile}
                        isLoading={updateProfileMutation.isPending}
                        className="flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <Input
                          value={profileForm.name}
                          onChange={(e) => setProfileForm(prev => ({ 
                            ...prev, 
                            name: e.target.value 
                          }))}
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Department
                        </label>
                        <Input
                          value={profileForm.department}
                          onChange={(e) => setProfileForm(prev => ({ 
                            ...prev, 
                            department: e.target.value 
                          }))}
                          placeholder="Enter your department"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-700">Full Name</div>
                          <div className="text-gray-900">{dbUser.name}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-700">Email</div>
                          <div className="text-gray-900">{dbUser.email}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-700">Company</div>
                          <div className="text-gray-900">{dbUser.company || 'System Kleen'}</div>
                        </div>
                      </div>
                      
                      {dbUser.department && (
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-700">Department</div>
                            <div className="text-gray-900">{dbUser.department}</div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-700">Role</div>
                          <Badge variant={getRoleBadgeVariant(dbUser.role)}>
                            {getRoleDisplayName(dbUser.role)}
                          </Badge>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>
            
            {/* Avatar Selection */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Avatar & Appearance
                </h2>
                
                <AvatarSelector
                  currentAvatar={currentAvatar}
                  onAvatarChange={handleAvatarChange}
                  userPoints={userStats?.totalPoints || 0}
                  unlockedAchievements={userStats?.badges?.map(b => b.id) || []}
                />
              </div>
            </Card>
          </div>
        </>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* App Preferences */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                App Preferences
              </h2>
              
              <div className="space-y-6">
                {/* Theme Selection */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'light', label: 'Light', icon: Sun },
                      { key: 'dark', label: 'Dark', icon: Moon },
                      { key: 'system', label: 'System', icon: Monitor }
                    ].map((themeOption) => (
                      <button
                        key={themeOption.key}
                        onClick={() => setTheme(themeOption.key as any)}
                        className={clsx(
                          'flex items-center gap-2 p-3 rounded-lg border transition-all',
                          theme === themeOption.key
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 dark:border-primary-400'
                            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                        )}
                      >
                        <themeOption.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{themeOption.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notification Preferences */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notifications
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Sound notifications</span>
                      <input
                        type="checkbox"
                        checked={preferences.soundEnabled}
                        onChange={(e) => updatePreferences({ soundEnabled: e.target.checked })}
                        className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary-600 focus:ring-primary-500"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Auto check-in reminders</span>
                      <input
                        type="checkbox"
                        checked={preferences.autoCheckIn}
                        onChange={(e) => updatePreferences({ autoCheckIn: e.target.checked })}
                        className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary-600 focus:ring-primary-500"
                      />
                    </label>
                  </div>
                </div>

                {/* Display Preferences */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Display</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Enable animations</span>
                      <input
                        type="checkbox"
                        checked={preferences.animationsEnabled}
                        onChange={(e) => updatePreferences({ animationsEnabled: e.target.checked })}
                        className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary-600 focus:ring-primary-500"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Compact mode</span>
                      <input
                        type="checkbox"
                        checked={preferences.compactMode}
                        onChange={(e) => updatePreferences({ compactMode: e.target.checked })}
                        className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary-600 focus:ring-primary-500"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Account Information */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Account Information
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Member Since</div>
                    <div className="text-gray-900">
                      {new Date(dbUser.created_at || dbUser.created || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Last Updated</div>
                    <div className="text-gray-900">
                      {new Date(dbUser.updated_at || dbUser.updated || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">User ID</div>
                    <div className="text-gray-900 text-xs font-mono">
                      {dbUser.id}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Status</div>
                    <div className="text-gray-900 capitalize">
                      {dbUser.status}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'activity' && (
        <ActivityTimeline
          activities={userActivities}
          loading={false}
          onLoadMore={() => {}}
          hasMore={false}
        />
      )}
    </div>
  )
}