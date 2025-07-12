import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useCurrentUser, useUpdateUserProfile } from '../../queries/userQueries'
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { User, Shield, Save, Edit, X } from 'lucide-react'

export default function AdminProfile() {
  const { user: clerkUser } = useUser()
  const { data: dbUser, isLoading } = useCurrentUser()
  const updateProfileMutation = useUpdateUserProfile()
  
  const [isEditing, setIsEditing] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: '',
    department: ''
  })

  React.useEffect(() => {
    if (dbUser) {
      setProfileForm({
        name: dbUser.name,
        department: dbUser.department || ''
      })
    }
  }, [dbUser])

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

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading profile..." />
  }

  if (!dbUser) {
    return <div className="text-center py-12">Profile not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <User className="w-7 h-7 text-primary-600" />
          Admin Profile
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your administrator account
        </p>
      </div>

      <Card>
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Profile Information
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
                  onClick={() => setIsEditing(false)}
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

          <div className="text-center mb-6">
            <Avatar 
              src={clerkUser?.imageUrl} 
              alt={dbUser.name}
              size="xl"
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-medium text-gray-900">
              {clerkUser?.firstName || dbUser.name}
            </h3>
            <p className="text-gray-600">{dbUser.email}</p>
            <div className="mt-2 flex justify-center">
              <Badge variant="primary" className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Administrator
              </Badge>
            </div>
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
              <div className="grid grid-cols-1 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500">Full Name</div>
                  <div className="text-gray-900">{dbUser.name}</div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500">Email</div>
                  <div className="text-gray-900">{dbUser.email}</div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500">Company</div>
                  <div className="text-gray-900">{dbUser.company}</div>
                </div>
                
                {dbUser.department && (
                  <div className="border rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-500">Department</div>
                    <div className="text-gray-900">{dbUser.department}</div>
                  </div>
                )}
                
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500">Role</div>
                  <div className="text-gray-900 capitalize">{dbUser.role.replace('_', ' ')}</div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500">Member Since</div>
                  <div className="text-gray-900">{new Date(dbUser.created).toLocaleDateString()}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}