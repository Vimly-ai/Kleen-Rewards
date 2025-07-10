import { useUser } from '@clerk/clerk-react';
import { Clock, Flame, Calendar, Star, QrCode } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function DashboardPage() {
  const { user } = useUser();

  // Mock stats for now (replace with actual backend integration later)
  const stats = {
    totalPoints: 245,
    weeklyPoints: 28,
    monthlyPoints: 115,
    currentStreak: 7,
    lastCheckIn: new Date().toISOString(),
    weeklyCheckIns: 4,
    monthlyAverage: 18,
    totalCheckIns: 67,
    rank: 3,
    recentCheckIns: [
      {
        id: '1',
        checkInTime: new Date().toISOString(),
        type: 'early' as const,
        pointsEarned: 2
      }
    ]
  };

  const handleCheckIn = async () => {
    // Mock check-in for now
    toast.success('Check-in successful! You earned 2 points.');
  };

  const handleDemoCheckIn = () => {
    // For demo purposes, simulate check-in
    handleCheckIn();
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getNextRewardTier = () => {
    const points = stats?.totalPoints || 0;
    if (points < 25) return { name: 'Monthly Rewards', needed: 25 - points };
    if (points < 75) return { name: 'Quarterly Rewards', needed: 75 - points };
    if (points < 300) return { name: 'Annual Rewards', needed: 300 - points };
    return { name: 'Legend Status', needed: 0 };
  };

  const nextTier = getNextRewardTier();

  const hasCheckedInToday = false; // Mock for now

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {greeting()}, {user?.firstName || 'Employee'}!
            </h1>
            <p className="mt-1 text-primary-100">
              Ready to earn some points today?
            </p>
          </div>
          <div className="text-right">
            <p className="text-primary-100 text-sm">Total Points</p>
            <p className="text-3xl font-bold">{stats.totalPoints}</p>
          </div>
        </div>
      </div>

      {/* Check-in Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Check-in</h2>
        
        {hasCheckedInToday ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Already checked in today!
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Great job! Come back tomorrow for your next check-in.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <QrCode className="h-6 w-6 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Check-in Window: 6:00 AM - 9:00 AM MST
                  </p>
                  <p className="text-sm text-gray-500">
                    Scan the QR code to earn points
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleDemoCheckIn}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Demo Check-in (Click to Test)
            </button>
          </div>
        )}

        {/* Progress to Next Tier */}
        {nextTier.needed > 0 && (
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Next: {nextTier.name}</span>
              <span className="text-gray-600">{nextTier.needed} points needed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.max(10, ((stats?.totalPoints || 0) / ((stats?.totalPoints || 0) + nextTier.needed)) * 100)}%`
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Flame className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.currentStreak || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.weeklyPoints || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.monthlyPoints || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Check-ins</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalCheckIns || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Check-ins</h2>
        </div>
        <div className="p-6">
          {stats?.recentCheckIns && stats.recentCheckIns.length > 0 ? (
            <div className="space-y-3">
              {stats.recentCheckIns.slice(0, 5).map((checkIn) => (
                <div key={checkIn.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className={`p-1 rounded-full ${
                      checkIn.type === 'early' ? 'bg-green-100' :
                      checkIn.type === 'ontime' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Clock className={`h-4 w-4 ${
                        checkIn.type === 'early' ? 'text-green-600' :
                        checkIn.type === 'ontime' ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {format(new Date(checkIn.checkInTime), 'MMM d, h:mm a')}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{checkIn.type}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-primary-600">
                    +{checkIn.pointsEarned}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No check-ins yet. Start your journey today!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}