import { useState, useEffect } from 'react'
import { useRewards, useUserRedemptions, useRedeemReward } from '../../queries/rewardQueries'
import { useData } from '../../contexts/DataContext'
import { useUserStats } from '../../queries/userQueries'
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { AnimatedCounter } from '../../components/ui/AnimatedCounter'
import { RewardFilters } from '../../components/employee/RewardFilters'
import { RewardCard } from '../../components/employee/RewardCard'
import { WishlistButton } from '../../components/employee/WishlistButton'
import { 
  Gift, 
  Star, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Filter, 
  Heart,
  Sparkles,
  TrendingUp,
  Zap,
  Grid,
  List,
  Eye
} from 'lucide-react'
import { clsx } from 'clsx'
import type { Reward } from '../../types'

interface FilterState {
  search: string
  categories: string[]
  priceRange: [number, number]
  availability: 'all' | 'available' | 'limited'
  sortBy: 'popularity' | 'price_low' | 'price_high' | 'newest'
}

interface EnhancedReward extends Reward {
  category: string
  availability: 'available' | 'limited' | 'sold_out'
  popularity?: number
  expiresAt?: Date
  vendor?: string
  tags?: string[]
  discount?: number
  originalPrice?: number
  isWishlisted?: boolean
}

const REDEMPTION_STATUS_CONFIG = {
  pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  approved: { color: 'bg-blue-100 text-blue-800', label: 'Approved' },
  completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
  rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' }
}

export default function EmployeeRewards() {
  const [selectedReward, setSelectedReward] = useState<EnhancedReward | null>(null)
  const [showRedemptionModal, setShowRedemptionModal] = useState(false)
  const [showRewardDetails, setShowRewardDetails] = useState(false)
  const [activeTab, setActiveTab] = useState<'marketplace' | 'wishlist' | 'redeemed'>('marketplace')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [wishlist, setWishlist] = useState<string[]>([])
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categories: [],
    priceRange: [0, 10000],
    availability: 'all',
    sortBy: 'popularity'
  })

  const { user, loading: userLoading } = useData()
  const { data: userStats } = useUserStats(user?.id || '')
  const { data: rawRewards, isLoading: rewardsLoading } = useRewards()
  const { data: redemptions, isLoading: redemptionsLoading } = useUserRedemptions(user?.id || '')
  const redeemMutation = useRedeemReward()
  
  // Debug logging
  useEffect(() => {
    console.log('Rewards Debug:', { 
      rawRewards, 
      rewardsLoading, 
      userLoading,
      user 
    })
  }, [rawRewards, rewardsLoading, userLoading, user])
  
  // Mock enhanced reward data - in real app this would come from API
  const rewards: EnhancedReward[] = rawRewards?.map(reward => ({
    ...reward,
    category: 'food', // Mock category
    availability: Math.random() > 0.8 ? 'limited' : 'available' as const,
    popularity: Math.random(),
    vendor: 'Partner Store',
    tags: ['popular', 'limited-time'],
    isWishlisted: wishlist.includes(reward.id)
  })) || []

  const userPoints = userStats?.totalPoints || 0

  // Filter and sort rewards
  const filteredRewards = rewards.filter(reward => {
    if (filters.search && !reward.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    if (filters.categories.length > 0 && !filters.categories.includes(reward.category)) {
      return false
    }
    if (reward.pointsCost < filters.priceRange[0] || reward.pointsCost > filters.priceRange[1]) {
      return false
    }
    if (filters.availability !== 'all' && reward.availability !== filters.availability) {
      return false
    }
    return true
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price_low':
        return a.pointsCost - b.pointsCost
      case 'price_high':
        return b.pointsCost - a.pointsCost
      case 'popularity':
        return (b.popularity || 0) - (a.popularity || 0)
      case 'newest':
      default:
        return 0
    }
  })
  
  const wishlistRewards = rewards.filter(reward => wishlist.includes(reward.id))
  
  const handleRedeemReward = async () => {
    if (!selectedReward || !user) return

    try {
      await redeemMutation.mutateAsync({
        userId: user.id,
        rewardId: selectedReward.id
      })
      setShowRedemptionModal(false)
      setSelectedReward(null)
    } catch (error) {
      // Error is handled by the mutation
    }
  }
  
  const handleWishlistToggle = async (reward: EnhancedReward) => {
    setWishlist(prev => 
      prev.includes(reward.id)
        ? prev.filter(id => id !== reward.id)
        : [...prev, reward.id]
    )
  }
  
  const handleViewDetails = (reward: EnhancedReward) => {
    setSelectedReward(reward)
    setShowRewardDetails(true)
  }

  const canAffordReward = (reward: EnhancedReward) => userPoints >= reward.pointsCost

  if (userLoading || rewardsLoading) {
    return <LoadingSpinner size="large" text="Loading rewards marketplace..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  Rewards Marketplace
                </h1>
                <p className="text-gray-600">
                  Discover amazing rewards and redeem your hard-earned points
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 bg-white/60 rounded-lg px-3 py-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  {filteredRewards.length} rewards available
                </span>
              </div>
              
              {wishlist.length > 0 && (
                <div className="flex items-center gap-2 bg-white/60 rounded-lg px-3 py-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {wishlist.length} in wishlist
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <div className="text-right">
              <div className="text-sm text-gray-600 flex items-center gap-1">
                <Zap className="w-4 h-4" />
                Your Points
              </div>
              <AnimatedCounter
                value={userPoints}
                size="xl"
                className="text-3xl font-bold text-purple-600"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="small"
                onClick={() => setViewMode('grid')}
                className="p-2"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="small"
                onClick={() => setViewMode('list')}
                className="p-2"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={clsx(
              'py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2',
              activeTab === 'marketplace'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            <Gift className="w-4 h-4" />
            Marketplace
            <Badge variant="secondary" className="text-xs">
              {filteredRewards.length}
            </Badge>
          </button>
          
          <button
            onClick={() => setActiveTab('wishlist')}
            className={clsx(
              'py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2',
              activeTab === 'wishlist'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            <Heart className="w-4 h-4" />
            Wishlist
            {wishlist.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {wishlist.length}
              </Badge>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('redeemed')}
            className={clsx(
              'py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2',
              activeTab === 'redeemed'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            <CheckCircle className="w-4 h-4" />
            My Redemptions
            {redemptions && redemptions.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {redemptions.length}
              </Badge>
            )}
          </button>
        </nav>
      </div>

      {activeTab === 'marketplace' && (
        <>
          {/* Filters */}
          <RewardFilters
            filters={filters}
            onFiltersChange={setFilters}
            totalResults={filteredRewards.length}
          />

          {/* Rewards Grid/List */}
          {filteredRewards.length > 0 ? (
            <div className={clsx(
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            )}>
              {filteredRewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  userPoints={userPoints}
                  onRedeem={() => {
                    setSelectedReward(reward)
                    setShowRedemptionModal(true)
                  }}
                  onWishlist={() => handleWishlistToggle(reward)}
                  onViewDetails={() => handleViewDetails(reward)}
                  compact={viewMode === 'list'}
                />
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No rewards found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters to see more rewards.
                </p>
                <Button
                  onClick={() => setFilters({
                    search: '',
                    categories: [],
                    priceRange: [0, 10000],
                    availability: 'all',
                    sortBy: 'popularity'
                  })}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          )}
        </>
      )}
      
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          {wishlistRewards.length > 0 ? (
            <div className={clsx(
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            )}>
              {wishlistRewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  userPoints={userPoints}
                  onRedeem={() => {
                    setSelectedReward(reward)
                    setShowRedemptionModal(true)
                  }}
                  onWishlist={() => handleWishlistToggle(reward)}
                  onViewDetails={() => handleViewDetails(reward)}
                  compact={viewMode === 'list'}
                />
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-gray-600">
                  Start adding rewards to your wishlist to keep track of items you want!
                </p>
                <Button
                  onClick={() => setActiveTab('marketplace')}
                  className="mt-4"
                >
                  Browse Rewards
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
      
      {activeTab === 'redeemed' && (
        <div className="space-y-4">
          {redemptions && redemptions.length > 0 ? (
            redemptions.map((redemption) => (
              <Card key={redemption.id}>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        Reward Redemption
                      </h3>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        <span>Points: {redemption.pointsCost}</span>
                        <span>
                          Redeemed: {new Date(redemption.created).toLocaleDateString()}
                        </span>
                      </div>
                      {redemption.notes && (
                        <p className="mt-2 text-sm text-gray-600">
                          {redemption.notes}
                        </p>
                      )}
                    </div>
                    
                    <Badge 
                      className={REDEMPTION_STATUS_CONFIG[redemption.status].color}
                    >
                      {REDEMPTION_STATUS_CONFIG[redemption.status].label}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No redemptions yet
                </h3>
                <p className="text-gray-600">
                  You haven't redeemed any rewards yet. Browse available rewards to get started!
                </p>
                <Button
                  onClick={() => setActiveTab('marketplace')}
                  className="mt-4"
                >
                  Browse Rewards
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Redemption Confirmation Modal */}
      <Modal
        isOpen={showRedemptionModal}
        onClose={() => {
          setShowRedemptionModal(false)
          setSelectedReward(null)
        }}
        title="Confirm Redemption"
      >
        {selectedReward && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Gift className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {selectedReward.name}
              </h3>
              <p className="text-gray-600 mt-1">
                {selectedReward.description}
              </p>
              {selectedReward.vendor && (
                <p className="text-sm text-gray-500 mt-1">
                  by {selectedReward.vendor}
                </p>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cost:</span>
                <span className="font-bold text-lg text-primary-600">
                  {selectedReward.pointsCost.toLocaleString()} points
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-600">Your Balance:</span>
                <AnimatedCounter
                  value={userPoints}
                  className="font-medium"
                  suffix=" points"
                />
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t">
                <span className="text-gray-600">After Redemption:</span>
                <span className={clsx(
                  'font-medium',
                  userPoints - selectedReward.pointsCost >= 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                )}>
                  {(userPoints - selectedReward.pointsCost).toLocaleString()} points
                </span>
              </div>
            </div>
            
            {!canAffordReward(selectedReward) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">
                  You don't have enough points for this reward. 
                  You need {(selectedReward.pointsCost - userPoints).toLocaleString()} more points.
                </p>
              </div>
            )}
            
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowRedemptionModal(false)
                  setSelectedReward(null)
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRedeemReward}
                disabled={!canAffordReward(selectedReward) || redeemMutation.isPending}
                isLoading={redeemMutation.isPending}
                className="flex-1"
              >
                Redeem Now
              </Button>
            </div>
          </div>
        )}
      </Modal>
      
      {/* Reward Details Modal */}
      <Modal
        isOpen={showRewardDetails}
        onClose={() => {
          setShowRewardDetails(false)
          setSelectedReward(null)
        }}
        title="Reward Details"
        size="lg"
      >
        {selectedReward && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                <Gift className="w-10 h-10 text-gray-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedReward.name}
                </h3>
                <p className="text-gray-600 mt-1">
                  {selectedReward.description}
                </p>
                {selectedReward.vendor && (
                  <p className="text-sm text-gray-500 mt-1">
                    by {selectedReward.vendor}
                  </p>
                )}
              </div>
              <WishlistButton
                isWishlisted={selectedReward.isWishlisted || false}
                onToggle={() => handleWishlistToggle(selectedReward)}
                variant="icon"
              />
            </div>
            
            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Points Required</h4>
                <div className="text-2xl font-bold text-primary-600">
                  {selectedReward.pointsCost.toLocaleString()}
                </div>
                {selectedReward.originalPrice && selectedReward.discount && (
                  <div className="text-sm text-gray-500">
                    Originally ${selectedReward.originalPrice} ({selectedReward.discount}% off)
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Availability</h4>
                <Badge variant={AVAILABILITY_CONFIG[selectedReward.availability].badge.variant}>
                  {AVAILABILITY_CONFIG[selectedReward.availability].badge.label}
                </Badge>
                {selectedReward.expiresAt && (
                  <div className="text-sm text-gray-500 mt-1">
                    Expires {selectedReward.expiresAt.toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
            
            {/* Tags */}
            {selectedReward.tags && selectedReward.tags.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedReward.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowRewardDetails(false)
                  setShowRedemptionModal(true)
                }}
                disabled={!canAffordReward(selectedReward) || selectedReward.availability === 'sold_out'}
                className="flex-1"
              >
                Redeem Reward
              </Button>
              <WishlistButton
                isWishlisted={selectedReward.isWishlisted || false}
                onToggle={() => handleWishlistToggle(selectedReward)}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

const AVAILABILITY_CONFIG = {
  available: {
    badge: { variant: 'success' as const, label: 'Available' },
    canRedeem: true
  },
  limited: {
    badge: { variant: 'warning' as const, label: 'Limited Time' },
    canRedeem: true
  },
  sold_out: {
    badge: { variant: 'error' as const, label: 'Sold Out' },
    canRedeem: false
  }
}