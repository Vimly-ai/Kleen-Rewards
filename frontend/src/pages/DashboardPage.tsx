import { useUser } from '@clerk/clerk-react';
import { Clock, Flame, Calendar, Star, QrCode } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import QRScanner from '../components/QRScanner';
import { useData } from '../contexts/DataContext';
import SupabaseService from '../services/supabase';

export function DashboardPage() {
  const { user: clerkUser } = useUser();
  const { user: dbUser, loading } = useData();
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [recentCheckIns, setRecentCheckIns] = useState<any[]>([]);
  const [checkingIn, setCheckingIn] = useState(false);

  useEffect(() => {
    if (dbUser?.id) {
      checkTodaysCheckIn();
      loadRecentCheckIns();
    }
  }, [dbUser]);

  const checkTodaysCheckIn = async () => {
    if (!dbUser?.id) return;
    
    try {
      const todayCheckIn = await SupabaseService.getTodaysCheckIn(dbUser.id);
      setHasCheckedInToday(!!todayCheckIn);
    } catch (error) {
      console.error('Error checking today\'s check-in:', error);
    }
  };

  const loadRecentCheckIns = async () => {
    if (!dbUser?.id) return;
    
    try {
      const checkIns = await SupabaseService.getUserCheckIns(dbUser.id, 5);
      setRecentCheckIns(checkIns);
    } catch (error) {
      console.error('Error loading recent check-ins:', error);
    }
  };

  const performCheckIn = async () => {
    if (!dbUser?.id || checkingIn) return;
    
    setCheckingIn(true);
    try {
      // Determine check-in type based on current time
      const now = new Date();
      const hour = now.getHours();
      let checkInType: 'early' | 'ontime' | 'late';
      let pointsEarned: number;
      
      if (hour >= 6 && hour < 7) {
        checkInType = 'early';
        pointsEarned = 2;
      } else if (hour >= 7 && hour < 9) {
        checkInType = 'ontime';
        pointsEarned = 1;
      } else {
        checkInType = 'late';
        pointsEarned = 0;
      }

      // Create check-in record
      await SupabaseService.createCheckIn(dbUser.id, {
        check_in_time: now.toISOString(),
        points_earned: pointsEarned,
        check_in_type: checkInType,
        streak_day: (dbUser.current_streak || 0) + 1
      });

      // Update user points and streak
      await SupabaseService.updateUser(dbUser.id, {
        points_balance: (dbUser.points_balance || 0) + pointsEarned,
        total_points_earned: (dbUser.total_points_earned || 0) + pointsEarned,
        current_streak: (dbUser.current_streak || 0) + 1,
        longest_streak: Math.max(dbUser.longest_streak || 0, (dbUser.current_streak || 0) + 1),
        last_check_in: now.toISOString()
      });

      setHasCheckedInToday(true);
      await loadRecentCheckIns();
      
      toast.success(`Check-in successful! You earned ${pointsEarned} points.`);
    } catch (error: any) {
      console.error('Check-in failed:', error);
      toast.error('Check-in failed. Please try again.');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleDemoCheckIn = () => {
    performCheckIn();
  };

  const handleQRScan = (qrData: string) => {
    // Process QR code data for check-in
    console.log('QR Code scanned:', qrData);
    
    // Validate QR code (in real app, this would verify against server)
    if (qrData.includes('systemkleen-checkin') || qrData.includes('check-in')) {
      performCheckIn();
    } else {
      toast.error('Invalid QR code. Please scan the correct check-in QR code.');
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getNextRewardTier = () => {
    const points = dbUser?.points_balance || 0;
    if (points < 25) return { name: 'Monthly Rewards', needed: 25 - points };
    if (points < 75) return { name: 'Quarterly Rewards', needed: 75 - points };
    if (points < 300) return { name: 'Annual Rewards', needed: 300 - points };
    return { name: 'Legend Status', needed: 0 };
  };

  const nextTier = getNextRewardTier();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {greeting()}, {clerkUser?.firstName || dbUser?.name || 'Employee'}!
            </h1>
            <p className="mt-1 text-primary-100">
              Ready to earn some points today?
            </p>
          </div>
          <div className="text-right">
            <p className="text-primary-100 text-sm">Total Points</p>
            <p className="text-3xl font-bold">{dbUser?.points_balance || 0}</p>
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setShowQRScanner(true)}
                className="flex items-center justify-center space-x-2 bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                <QrCode className="h-5 w-5" />
                <span>Scan QR Code</span>
              </button>
              
              <button
                onClick={handleDemoCheckIn}
                disabled={checkingIn}
                className="bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {checkingIn ? 'Checking in...' : 'Manual Check-in'}
              </button>
            </div>
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
                  width: `${Math.max(10, ((dbUser?.points_balance || 0) / ((dbUser?.points_balance || 0) + nextTier.needed)) * 100)}%`
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
              <p className="text-2xl font-bold text-gray-900">{dbUser?.current_streak || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Earned</p>
              <p className="text-2xl font-bold text-gray-900">{dbUser?.total_points_earned || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Best Streak</p>
              <p className="text-2xl font-bold text-gray-900">{dbUser?.longest_streak || 0}</p>
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
              <p className="text-2xl font-bold text-gray-900">{recentCheckIns.length}</p>
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
          {recentCheckIns && recentCheckIns.length > 0 ? (
            <div className="space-y-3">
              {recentCheckIns.slice(0, 5).map((checkIn) => (
                <div key={checkIn.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className={`p-1 rounded-full ${
                      checkIn.check_in_type === 'early' ? 'bg-green-100' :
                      checkIn.check_in_type === 'ontime' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Clock className={`h-4 w-4 ${
                        checkIn.check_in_type === 'early' ? 'text-green-600' :
                        checkIn.check_in_type === 'ontime' ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {format(new Date(checkIn.check_in_time), 'MMM d, h:mm a')}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{checkIn.check_in_type}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-primary-600">
                    +{checkIn.points_earned}
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

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScanSuccess={handleQRScan}
      />
    </div>
  );
}