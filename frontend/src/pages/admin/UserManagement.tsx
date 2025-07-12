import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../lib/queryClient'
import { useBulkUserUpdate, useAwardBonusPoints } from '../../queries/userQueries'
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { Avatar } from '../../components/ui/Avatar'
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  Mail, 
  MoreVertical,
  Check,
  X,
  Gift,
  Eye,
  Edit
} from 'lucide-react'
import { clsx } from 'clsx'
import type { User } from '../../types'

const USER_STATUSES = [
  { key: 'all', label: 'All Users', color: 'bg-gray-100 text-gray-800' },
  { key: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { key: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800' },
  { key: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
  { key: 'suspended', label: 'Suspended', color: 'bg-gray-100 text-gray-800' }
]

const USER_ROLES = [
  { key: 'employee', label: 'Employee' },
  { key: 'admin', label: 'Admin' },
  { key: 'super_admin', label: 'Super Admin' }
]

export default function AdminUserManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showBonusModal, setShowBonusModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [bonusPoints, setBonusPoints] = useState('')
  const [bonusReason, setBonusReason] = useState('')

  const bulkUpdateMutation = useBulkUserUpdate()
  const awardBonusMutation = useAwardBonusPoints()

  const { data: usersData, isLoading } = useQuery({
    queryKey: queryKeys.admin.users(currentPage, searchTerm || undefined),
    queryFn: async () => {
      // Mock data - replace with actual API call
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'sarah.johnson@company.com',
          name: 'Sarah Johnson',
          role: 'employee',
          company: 'Tech Corp',
          department: 'Engineering',
          status: 'approved',
          created: '2024-01-15T00:00:00Z',
          updated: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          email: 'mike.chen@company.com',
          name: 'Mike Chen',
          role: 'employee',
          company: 'Tech Corp',
          department: 'Design',
          status: 'approved',
          created: '2024-01-16T00:00:00Z',
          updated: '2024-01-16T00:00:00Z'
        },
        {
          id: '3',
          email: 'emily.davis@company.com',
          name: 'Emily Davis',
          role: 'employee',
          company: 'Tech Corp',
          department: 'Marketing',
          status: 'pending',
          created: '2024-01-17T00:00:00Z',
          updated: '2024-01-17T00:00:00Z'
        }
      ]
      
      let filteredUsers = mockUsers
      
      if (searchTerm) {
        filteredUsers = filteredUsers.filter(user =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.department?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      if (statusFilter !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.status === statusFilter)
      }
      
      return {
        users: filteredUsers,
        total: filteredUsers.length,
        hasMore: false
      }
    }
  })

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (!usersData) return
    
    if (selectedUsers.length === usersData.users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(usersData.users.map(user => user.id))
    }
  }

  const handleBulkStatusUpdate = async (status: User['status']) => {
    if (selectedUsers.length === 0) return
    
    await bulkUpdateMutation.mutateAsync({
      userIds: selectedUsers,
      updates: { status }
    })
    
    setSelectedUsers([])
  }

  const handleAwardBonus = async () => {
    if (!selectedUser || !bonusPoints || !bonusReason) return
    
    await awardBonusMutation.mutateAsync({
      userId: selectedUser.id,
      points: parseInt(bonusPoints),
      reason: bonusReason,
      awardedBy: 'current-admin-id' // This should come from current admin user
    })
    
    setShowBonusModal(false)
    setSelectedUser(null)
    setBonusPoints('')
    setBonusReason('')
  }

  const getStatusBadge = (status: User['status']) => {
    const statusConfig = USER_STATUSES.find(s => s.key === status)
    return (
      <Badge className={statusConfig?.color || 'bg-gray-100 text-gray-800'}>
        {statusConfig?.label || status}
      </Badge>
    )
  }

  const getRoleBadge = (role: User['role']) => {
    const colors = {
      employee: 'bg-blue-100 text-blue-800',
      admin: 'bg-purple-100 text-purple-800',
      super_admin: 'bg-red-100 text-red-800'
    }
    
    return (
      <Badge className={colors[role]}>
        {USER_ROLES.find(r => r.key === role)?.label || role}
      </Badge>
    )
  }

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading users..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-primary-600" />
            User Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage employee accounts and permissions
          </p>
        </div>
        
        <Button className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Invite User
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search users by name, email, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              {USER_STATUSES.map((status) => (
                <button
                  key={status.key}
                  onClick={() => setStatusFilter(status.key)}
                  className={clsx(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    statusFilter === status.key
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Card className="border-primary-200 bg-primary-50">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-primary-900">
                  {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => handleBulkStatusUpdate('approved')}
                  className="flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  Approve
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => handleBulkStatusUpdate('rejected')}
                  className="flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Reject
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setSelectedUsers([])}
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={usersData ? selectedUsers.length === usersData.users.length : false}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usersData?.users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <Avatar src={undefined} alt={user.name} size="small" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.department || 'Not assigned'}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.created).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => {
                          setSelectedUser(user)
                          setShowBonusModal(true)
                        }}
                        className="flex items-center gap-1"
                      >
                        <Gift className="w-3 h-3" />
                        Bonus
                      </Button>
                      
                      <Button
                        variant="secondary"
                        size="small"
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {usersData && usersData.hasMore && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {usersData.users.length} of {usersData.total} users
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="small"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Award Bonus Points Modal */}
      <Modal
        isOpen={showBonusModal}
        onClose={() => {
          setShowBonusModal(false)
          setSelectedUser(null)
          setBonusPoints('')
          setBonusReason('')
        }}
        title="Award Bonus Points"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="text-center">
              <Avatar src={undefined} alt={selectedUser.name} size="large" className="mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">
                {selectedUser.name}
              </h3>
              <p className="text-gray-600">{selectedUser.email}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bonus Points
                </label>
                <Input
                  type="number"
                  value={bonusPoints}
                  onChange={(e) => setBonusPoints(e.target.value)}
                  placeholder="Enter points amount"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <textarea
                  value={bonusReason}
                  onChange={(e) => setBonusReason(e.target.value)}
                  placeholder="Reason for awarding bonus points..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowBonusModal(false)
                  setSelectedUser(null)
                  setBonusPoints('')
                  setBonusReason('')
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAwardBonus}
                disabled={!bonusPoints || !bonusReason || awardBonusMutation.isPending}
                isLoading={awardBonusMutation.isPending}
                className="flex-1"
              >
                Award Points
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}