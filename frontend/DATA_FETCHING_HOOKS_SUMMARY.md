# Data Fetching Hooks Summary - Employee Rewards Frontend

This document summarizes all the React hooks that fetch user data, statistics, achievements, and check-ins in the Employee Rewards frontend application.

## 1. Check-In Related Hooks
**Location**: `/src/queries/checkInQueries.ts`

### `useUserCheckIns(userId: string, limit?: number)`
- Fetches user's check-in history
- Query key: `['checkIns', 'list', userId, limit]`
- Stale time: 2 minutes
- Returns: Array of check-ins

### `useTodaysCheckIn(userId: string)`
- Fetches today's check-in status for a user
- Query key: `['checkIns', 'today', userId]`
- Stale time: 1 minute
- Refetch interval: 5 minutes
- Returns: Today's check-in data or null

### `useCheckInHistory(userId: string, page: number = 1)`
- Fetches paginated check-in history
- Query key: `['checkIns', 'history', userId, page]`
- Page size: 20 items
- Stale time: 5 minutes
- Returns: Object with checkIns array, page number, and hasMore flag

### `useCheckIn()`
- Mutation hook for performing check-ins
- Accepts: userId, qrCodeData, and optional location
- Invalidates: check-ins list, today's check-in, user stats, and leaderboard
- Returns: Check-in result with points earned and current streak

### `useCheckInAnalytics(period: 'week' | 'month' | 'quarter' = 'week')`
- Admin hook for check-in analytics
- Query key: `['checkInAnalytics', period]`
- Stale time: 10 minutes
- Refetch interval: 15 minutes
- Returns: Analytics data for the specified period

### `useManualCheckIn()`
- Admin mutation hook for creating manual check-ins
- Accepts: userId, checkInTime, points, reason, adminId
- Invalidates: user's check-ins and stats

## 2. User Statistics Hooks
**Location**: `/src/queries/userQueries.ts`

### `useCurrentUser()`
- Fetches the currently authenticated user
- Query key: `['user', 'current']`
- Stale time: 10 minutes
- Retry: 2 attempts
- Returns: Current user object

### `useUserProfile(userId: string)`
- Fetches a specific user's profile
- Query key: `['user', 'profile', userId]`
- Stale time: 5 minutes
- Returns: User profile data

### `useUserStats(userId: string)`
- Fetches comprehensive user statistics
- Query key: `['user', 'stats', userId]`
- Refetch interval: 2 minutes
- Returns: UserStats object including:
  - totalCheckIns
  - totalPoints
  - currentStreak
  - longestStreak
  - averageCheckInTime
  - recentAchievements count
  - rank
  - weeklyProgress
  - badges array
  - level
  - pointsBalance

### `useUpdateUserProfile()`
- Mutation hook for updating user profile
- Updates cache and invalidates user queries
- Shows success/error notifications

### `useAwardBonusPoints()`
- Admin mutation hook for awarding bonus points
- Accepts: userId, points, reason, awardedBy
- Invalidates: user stats and leaderboard

### `useBulkUserUpdate()`
- Admin mutation hook for bulk user updates
- Accepts: array of userIds and update object
- Returns: count of successful and failed updates

## 3. Rewards and Redemptions Hooks
**Location**: `/src/queries/rewardQueries.ts`

### `useRewards(category?: string)`
- Fetches available rewards, optionally filtered by category
- Query key: `['rewards', 'list', category]`
- Stale time: 10 minutes
- Returns: Array of available rewards

### `useReward(rewardId: string)`
- Fetches details for a specific reward
- Query key: `['rewards', 'detail', rewardId]`
- Stale time: 15 minutes
- Returns: Single reward object

### `useUserRedemptions(userId: string)`
- Fetches user's reward redemption history
- Query key: `['rewards', 'redemptions', userId]`
- Stale time: 2 minutes
- Returns: Array of redemptions

### `useRedeemReward()`
- Mutation hook for redeeming rewards
- Accepts: userId and rewardId
- Invalidates: user redemptions, stats, and reward details
- Handles insufficient points and unavailability errors

### `useCreateReward()`
- Admin mutation hook for creating new rewards
- Invalidates all reward queries
- Returns: Created reward object

### `useUpdateReward()`
- Admin mutation hook for updating rewards
- Updates specific reward cache
- Invalidates reward lists

### `useUpdateRedemption()`
- Admin mutation hook for approving/rejecting redemptions
- Accepts: redemptionId, status, notes, adminId
- Status options: 'approved', 'rejected', 'completed'

## 4. Leaderboard Data
**Location**: `/src/pages/shared/Leaderboard.tsx`

### Inline `useQuery` for Leaderboard
- Query key: `['leaderboard', selectedPeriod]`
- Currently uses mock data (TODO: replace with actual API)
- Returns: Array of LeaderboardEntry objects containing:
  - id, name, avatar
  - totalPoints, weeklyPoints, monthlyPoints
  - currentStreak, rank, department

**Note**: The actual leaderboard fetching logic exists in:
- `SupabaseService.getLeaderboard(limit)` - Returns top users by points
- `queryKeys.leaderboard` is defined but no dedicated hook exists yet

## 5. Achievements/Badges Data
**Location**: `/src/pages/employee/Achievements.tsx`

### Inline `useQuery` for Achievements
- Query key: `['achievements', user?.id]`
- Currently uses mock data (TODO: replace with actual API)
- Returns: Array of Achievement objects

**Actual badge/achievement methods in `SupabaseService`**:
- `getUserBadges(userId)` - Fetches user's earned badges
- `awardBadge(userId, badgeId)` - Awards a badge to a user
- `createBadge(badgeData)` - Creates a new badge (admin)
- `updateBadge(id, updates)` - Updates badge details (admin)

## Query Key Structure
All query keys follow a consistent factory pattern defined in `/src/lib/queryClient.ts`:

```typescript
queryKeys = {
  user: {
    all: ['user'],
    current: () => ['user', 'current'],
    profile: (id) => ['user', 'profile', id],
    stats: (id) => ['user', 'stats', id]
  },
  checkIns: {
    all: ['checkIns'],
    list: (userId, limit?) => ['checkIns', 'list', userId, limit],
    today: (userId) => ['checkIns', 'today', userId],
    history: (userId, page) => ['checkIns', 'history', userId, page]
  },
  rewards: {
    all: ['rewards'],
    list: (category?) => ['rewards', 'list', category],
    detail: (id) => ['rewards', 'detail', id],
    redemptions: (userId) => ['rewards', 'redemptions', userId]
  },
  leaderboard: {
    all: ['leaderboard'],
    list: (period) => ['leaderboard', 'list', period]
  },
  admin: {
    all: ['admin'],
    users: (page, search?, status?) => ['admin', 'users', page, search, status],
    analytics: (period) => ['admin', 'analytics', period],
    settings: () => ['admin', 'settings'],
    redemptions: (status?) => ['admin', 'redemptions', status]
  }
}
```

## Missing Dedicated Hooks
The following data fetching functionality exists in services but lacks dedicated React Query hooks:

1. **Leaderboard Hook** - Currently implemented inline, should have a dedicated `useLeaderboard(period, limit)` hook
2. **Achievements/Badges Hooks** - Need dedicated hooks like:
   - `useUserBadges(userId)`
   - `useAllBadges()`
   - `useAwardBadge()`
3. **Company/QR Code Hooks** - Query keys exist but no hooks implemented
4. **Admin Analytics Hooks** - More comprehensive admin data fetching hooks

## Service Layer
All hooks use `SupabaseService` (with fallback to demo data) located at `/src/services/supabase.ts`. The service handles:
- Authentication state
- Demo mode fallback
- Error handling
- Data transformation

## Notification Integration
Most mutation hooks integrate with the notification store (`useNotifications`) to show success/error messages to users.