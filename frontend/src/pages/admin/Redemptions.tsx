import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../lib/queryClient'
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { Avatar } from '../../components/ui/Avatar'
import { 
  Gift, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Package,
  Filter,
  Calendar,
  Eye
} from 'lucide-react'
import { clsx } from 'clsx'
import { toast } from 'sonner'
import { DEMO_TRANSACTIONS, DEMO_REWARDS, DEMO_USERS } from '../../services/demoData'
import type { Transaction } from '../../services/demoData'

const REDEMPTION_STATUSES = [
  { key: 'all', label: 'All Requests', color: 'bg-gray-100 text-gray-800' },
  { key: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  { key: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  { key: 'completed', label: 'Completed', color: 'bg-blue-100 text-blue-800', icon: Package },
  { key: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle }
]

export default function AdminRedemptions() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedRedemption, setSelectedRedemption] = useState<Transaction | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [actionReason, setActionReason] = useState('')
  const [processingId, setProcessingId] = useState<string | null>(null)

  const { data: redemptionsData, isLoading, refetch } = useQuery({
    queryKey: queryKeys.admin.redemptions(statusFilter),
    queryFn: async () => {
      // Filter redemption transactions from demo data
      let redemptions = DEMO_TRANSACTIONS.filter(t => t.type === 'redemption')
      
      if (statusFilter !== 'all') {
        redemptions = redemptions.filter(r => r.status === statusFilter)
      }
      
      // Sort by date, newest first
      redemptions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      
      return {
        redemptions,
        total: redemptions.length,
        pending: redemptions.filter(r => r.status === 'pending').length,
        approved: redemptions.filter(r => r.status === 'approved').length,
        completed: redemptions.filter(r => r.status === 'completed').length,
        rejected: redemptions.filter(r => r.status === 'rejected').length
      }
    }
  })

  const handleUpdateStatus = async (redemptionId: string, newStatus: string, reason?: string) => {
    setProcessingId(redemptionId)
    
    try {
      // In a real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      const statusLabels = {
        approved: 'approved',
        rejected: 'rejected',
        completed: 'marked as completed'
      }
      
      toast.success(
        <div>
          <p className="font-medium">Redemption {statusLabels[newStatus as keyof typeof statusLabels]}!</p>
          {reason && <p className="text-sm">Reason: {reason}</p>}
        </div>
      )
      
      setShowDetailsModal(false)
      setSelectedRedemption(null)
      setActionReason('')
      refetch()
    } catch (error) {
      toast.error('Failed to update redemption status')
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const config = REDEMPTION_STATUSES.find(s => s.key === status)
    const Icon = config?.icon
    
    return (
      <Badge className={clsx(config?.color || 'bg-gray-100 text-gray-800', 'flex items-center gap-1')}>
        {Icon && <Icon className="w-3 h-3" />}
        {config?.label || status}
      </Badge>
    )
  }

  const getRedemptionDetails = (redemption: Transaction) => {
    const user = DEMO_USERS.find(u => u.id === redemption.userId)
    const reward = redemption.rewardId ? DEMO_REWARDS.find(r => r.id === redemption.rewardId) : null
    
    return { user, reward }
  }

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading redemptions..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Gift className="w-7 h-7 text-primary-600" />
            Reward Redemptions
          </h1>
          <p className="text-gray-600 mt-1">
            Manage employee reward redemption requests
          </p>
        </div>
        
        {/* Stats */}
        <div className="flex gap-2">
          {redemptionsData && (
            <>
              <Badge className="bg-yellow-100 text-yellow-800">
                {redemptionsData.pending} Pending
              </Badge>
              <Badge className="bg-green-100 text-green-800">
                {redemptionsData.approved} Approved
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                {redemptionsData.completed} Completed
              </Badge>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700">Filter by Status</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {REDEMPTION_STATUSES.map((status) => (
              <button
                key={status.key}
                onClick={() => setStatusFilter(status.key)}
                className={clsx(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                  statusFilter === status.key
                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {status.icon && <status.icon className="w-4 h-4" />}
                {status.label}
                {redemptionsData && status.key !== 'all' && (
                  <span className="ml-1 text-xs">
                    ({redemptionsData[status.key as keyof typeof redemptionsData] || 0})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Redemptions Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reward
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {redemptionsData?.redemptions.map((redemption) => {
                const { user, reward } = getRedemptionDetails(redemption)
                const isProcessing = processingId === redemption.id
                
                return (
                  <tr key={redemption.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Avatar 
                          src={user?.avatarUrl} 
                          alt={user?.name || 'User'} 
                          size="small" 
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user?.name || 'Unknown User'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">
                        {redemption.description.replace('Redeemed: ', '')}
                      </div>
                      {reward && (
                        <div className="text-sm text-gray-500">
                          {reward.category}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {Math.abs(redemption.amount)} pts
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {redemption.createdAt.toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {redemption.createdAt.toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(redemption.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => {
                            setSelectedRedemption(redemption)
                            setShowDetailsModal(true)
                          }}
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                        
                        {redemption.status === 'pending' && (
                          <>
                            <Button
                              variant="primary"
                              size="small"
                              onClick={() => handleUpdateStatus(redemption.id, 'approved')}
                              disabled={isProcessing}
                              className="flex items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="small"
                              onClick={() => {
                                setSelectedRedemption(redemption)
                                setShowDetailsModal(true)
                              }}
                              disabled={isProcessing}
                              className="flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" />
                              Reject
                            </Button>
                          </>
                        )}
                        
                        {redemption.status === 'approved' && (
                          <Button
                            variant="primary"
                            size="small"
                            onClick={() => handleUpdateStatus(redemption.id, 'completed')}
                            disabled={isProcessing}
                            className="flex items-center gap-1"
                          >
                            <Package className="w-3 h-3" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {redemptionsData?.redemptions.length === 0 && (
          <div className="text-center py-12">
            <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No redemptions found
            </h3>
            <p className="text-gray-600">
              {statusFilter === 'all' 
                ? 'No reward redemptions have been made yet.'
                : `No ${statusFilter} redemptions found.`}
            </p>
          </div>
        )}
      </Card>

      {/* Redemption Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedRedemption(null)
          setActionReason('')
        }}
        title="Redemption Details"
        size="lg"
      >
        {selectedRedemption && (() => {
          const { user, reward } = getRedemptionDetails(selectedRedemption)
          
          return (
            <div className="space-y-6">
              {/* User Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Employee Information</h4>
                <div className="flex items-center space-x-3">
                  <Avatar src={user?.avatarUrl} alt={user?.name || 'User'} size="medium" />
                  <div>
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                    <p className="text-sm text-gray-500">{user?.department}</p>
                  </div>
                </div>
              </div>
              
              {/* Reward Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Reward Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Item:</span>
                    <span className="font-medium">{selectedRedemption.description.replace('Redeemed: ', '')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Points Cost:</span>
                    <span className="font-medium">{Math.abs(selectedRedemption.amount)} points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{reward?.category || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Request Date:</span>
                    <span className="font-medium">{selectedRedemption.createdAt.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    {getStatusBadge(selectedRedemption.status)}
                  </div>
                </div>
              </div>
              
              {/* Action Section */}
              {selectedRedemption.status === 'pending' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Action Reason (Optional)
                  </label>
                  <textarea
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    placeholder="Add a note about this action..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                  />
                </div>
              )}
              
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowDetailsModal(false)
                    setSelectedRedemption(null)
                    setActionReason('')
                  }}
                  className="flex-1"
                >
                  Close
                </Button>
                
                {selectedRedemption.status === 'pending' && (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => handleUpdateStatus(selectedRedemption.id, 'approved', actionReason)}
                      className="flex-1"
                    >
                      Approve Request
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        if (!actionReason) {
                          toast.error('Please provide a reason for rejection')
                          return
                        }
                        handleUpdateStatus(selectedRedemption.id, 'rejected', actionReason)
                      }}
                      className="flex-1"
                    >
                      Reject Request
                    </Button>
                  </>
                )}
                
                {selectedRedemption.status === 'approved' && (
                  <Button
                    variant="primary"
                    onClick={() => handleUpdateStatus(selectedRedemption.id, 'completed', actionReason)}
                    className="flex-1"
                  >
                    Mark as Completed
                  </Button>
                )}
              </div>
            </div>
          )
        })()}
      </Modal>
    </div>
  )
}