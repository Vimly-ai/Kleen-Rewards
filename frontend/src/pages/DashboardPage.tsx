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

  const getUniqueMotivationalQuote = async (category: 'early' | 'ontime' | 'late') => {
    try {
      // Get quotes based on category and time
      const quotes = {
        early: [
          { text: "The early bird catches the worm! Your dedication sets you apart.", author: "System Kleen" },
          { text: "Success is where preparation meets opportunity - and you're prepared!", author: "System Kleen" },
          { text: "Champions start their day before the rest of the world wakes up.", author: "System Kleen" },
          { text: "Your commitment to excellence shines brighter than the morning sun!", author: "System Kleen" },
          { text: "Early birds don't just catch worms - they catch opportunities!", author: "System Kleen" },
        ],
        ontime: [
          { text: "Punctuality is the politeness of kings. You're royalty today!", author: "System Kleen" },
          { text: "Perfect timing! You're exactly where you need to be.", author: "System Kleen" },
          { text: "Consistency breeds excellence. Keep up the great work!", author: "System Kleen" },
          { text: "Right on time means right on track for success!", author: "System Kleen" },
          { text: "Reliability is a superpower - and you've got it!", author: "System Kleen" },
        ],
        late: [
          { text: "Every champion faces setbacks. What matters is how you bounce back!", author: "System Kleen" },
          { text: "Tomorrow is a new opportunity to shine. We believe in you!", author: "System Kleen" },
          { text: "Progress, not perfection. You're here and that's what counts!", author: "System Kleen" },
          { text: "The best time to plant a tree was yesterday. The second best time is now!", author: "System Kleen" },
          { text: "Your presence makes a difference, no matter what time you arrive.", author: "System Kleen" },
        ]
      };

      // For now, just return a random quote from the category
      // In a full implementation, we'd track which quotes the user has seen
      const categoryQuotes = quotes[category];
      const randomQuote = categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
      return randomQuote;
    } catch (error) {
      console.error('Error getting motivational quote:', error);
      return { text: "Every day is a new opportunity to excel!", author: "System Kleen" };
    }
  };

  const showCheckInSuccess = (points: number, type: 'early' | 'ontime' | 'late', quote: any) => {
    const messages = {
      early: `🌅 Early Bird Success! +${points} points earned!`,
      ontime: `⏰ Perfect Timing! +${points} point earned!`,
      late: `📅 Better Late Than Never! Thanks for checking in!`
    };

    // Show success toast
    toast.success(messages[type]);

    // Show motivational quote in a separate toast after a delay
    setTimeout(() => {
      toast(
        <div className="p-2">
          <p className="font-medium text-gray-800 mb-2">💪 Daily Motivation</p>
          <p className="text-sm text-gray-600 italic">"{quote.text}"</p>
          <p className="text-xs text-gray-500 mt-1">- {quote.author}</p>
        </div>,
        { duration: 6000 }
      );
    }, 1500);
  };

  const performCheckIn = async () => {
    if (!dbUser?.id || checkingIn) return;
    
    setCheckingIn(true);
    try {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes since midnight
      const checkInWindowStart = 6 * 60; // 06:00 in minutes
      const checkInWindowEnd = 9 * 60; // 09:00 in minutes
      const earlyEnd = 7 * 60 + 45; // 07:45 in minutes  
      const onTimeEnd = 8 * 60 + 1; // 08:01 in minutes

      // Check if within allowed check-in window
      if (currentTime < checkInWindowStart || currentTime > checkInWindowEnd) {
        toast.error('Check-in is only allowed between 6:00 AM - 9:00 AM MST');
        setCheckingIn(false);
        return;
      }

      // Determine check-in type and points based on precise time
      let checkInType: 'early' | 'ontime' | 'late';
      let pointsEarned: number;
      let motivationCategory: 'early' | 'ontime' | 'late';
      
      if (currentTime <= earlyEnd) {
        checkInType = 'early';
        pointsEarned = 2;
        motivationCategory = 'early';
      } else if (currentTime <= onTimeEnd) {
        checkInType = 'ontime';
        pointsEarned = 1;
        motivationCategory = 'ontime';
      } else {
        checkInType = 'late';
        pointsEarned = 0;
        motivationCategory = 'late';
      }

      // Get a motivational quote they haven't seen
      const motivationalQuote = await getUniqueMotivationalQuote(motivationCategory);

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
      
      // Show success message with motivational quote
      showCheckInSuccess(pointsEarned, checkInType, motivationalQuote);
    } catch (error: any) {
      console.error('Check-in failed:', error);
      toast.error('Check-in failed. Please try again.');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleDemoCheckIn = () => {
    // Demo function for development - bypasses QR scanner
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
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <div className="text-center">
                <QrCode className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready to Check In?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Check-in Window: 6:00 AM - 9:00 AM MST
                </p>
                <div className="bg-white rounded-lg p-3 mb-4 text-xs text-gray-600">
                  <p><strong>🌅 Early (before 7:45 AM):</strong> 2 points</p>
                  <p><strong>⏰ On-Time (7:46 - 8:01 AM):</strong> 1 point</p>
                  <p><strong>📅 Late (8:02 - 9:00 AM):</strong> 0 points</p>
                </div>
                <button
                  onClick={() => setShowQRScanner(true)}
                  disabled={checkingIn}
                  className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 shadow-lg"
                >
                  <QrCode className="h-5 w-5" />
                  <span>{checkingIn ? 'Processing...' : 'Scan QR Code to Check In'}</span>
                </button>
                
                {/* Development/Demo Mode - Remove in production */}
                {import.meta.env.DEV && (
                  <button
                    onClick={handleDemoCheckIn}
                    disabled={checkingIn}
                    className="w-full mt-2 bg-gray-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    Demo Check-in (Dev Only)
                  </button>
                )}
              </div>
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