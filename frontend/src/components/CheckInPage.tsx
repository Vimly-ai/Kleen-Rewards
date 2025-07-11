import React, { useState, useEffect } from 'react'
import { QrCode, Camera, Clock } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import SupabaseService from '../services/supabase'
import { toast } from 'sonner'
import SimpleQRScanner from './SimpleQRScanner'

export function CheckInPage() {
  const { user: dbUser, loading } = useData()
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)

  useEffect(() => {
    if (dbUser?.id) {
      checkTodaysCheckIn()
    }
  }, [dbUser])

  const checkTodaysCheckIn = async () => {
    if (!dbUser?.id) return
    
    try {
      const todayCheckIn = await SupabaseService.getTodaysCheckIn(dbUser.id)
      setHasCheckedInToday(!!todayCheckIn)
    } catch (error) {
      console.error('Error checking today\'s check-in:', error)
    }
  }

  const getUniqueMotivationalQuote = async (category: 'early' | 'ontime' | 'late') => {
    try {
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
      }

      const categoryQuotes = quotes[category]
      const randomQuote = categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)]
      return randomQuote
    } catch (error) {
      console.error('Error getting motivational quote:', error)
      return { text: "Every day is a new opportunity to excel!", author: "System Kleen" }
    }
  }

  const showCheckInSuccess = (points: number, type: 'early' | 'ontime' | 'late', quote: any) => {
    const messages = {
      early: `🌅 Early Bird Success! +${points} points earned!`,
      ontime: `⏰ Perfect Timing! +${points} point earned!`,
      late: `📅 Better Late Than Never! Thanks for checking in!`
    }

    toast.success(messages[type])

    setTimeout(() => {
      toast(
        <div className="p-2">
          <p className="font-medium text-gray-800 mb-2">💪 Daily Motivation</p>
          <p className="text-sm text-gray-600 italic">"{quote.text}"</p>
          <p className="text-xs text-gray-500 mt-1">- {quote.author}</p>
        </div>,
        { duration: 6000 }
      )
    }, 1500)
  }

  const performCheckIn = async () => {
    if (!dbUser?.id || checkingIn) return
    
    setCheckingIn(true)
    try {
      const now = new Date()
      const currentTime = now.getHours() * 60 + now.getMinutes()
      const checkInWindowStart = 6 * 60 // 06:00
      const checkInWindowEnd = 9 * 60 // 09:00
      const earlyEnd = 7 * 60 + 45 // 07:45
      const onTimeEnd = 8 * 60 + 1 // 08:01

      // Check if within allowed check-in window
      if (currentTime < checkInWindowStart || currentTime > checkInWindowEnd) {
        toast.error('Check-in is only allowed between 6:00 AM - 9:00 AM MST')
        setCheckingIn(false)
        return
      }

      // Determine check-in type and points
      let checkInType: 'early' | 'ontime' | 'late'
      let pointsEarned: number
      let motivationCategory: 'early' | 'ontime' | 'late'
      
      if (currentTime <= earlyEnd) {
        checkInType = 'early'
        pointsEarned = 2
        motivationCategory = 'early'
      } else if (currentTime <= onTimeEnd) {
        checkInType = 'ontime'
        pointsEarned = 1
        motivationCategory = 'ontime'
      } else {
        checkInType = 'late'
        pointsEarned = 0
        motivationCategory = 'late'
      }

      // Get motivational quote
      const motivationalQuote = await getUniqueMotivationalQuote(motivationCategory)

      // Create check-in record
      await SupabaseService.createCheckIn(dbUser.id, {
        check_in_time: now.toISOString(),
        points_earned: pointsEarned,
        check_in_type: checkInType,
        streak_day: (dbUser.current_streak || 0) + 1
      })

      // Update user points and streak
      await SupabaseService.updateUser(dbUser.id, {
        points_balance: (dbUser.points_balance || 0) + pointsEarned,
        total_points_earned: (dbUser.total_points_earned || 0) + pointsEarned,
        current_streak: (dbUser.current_streak || 0) + 1,
        longest_streak: Math.max(dbUser.longest_streak || 0, (dbUser.current_streak || 0) + 1),
        last_check_in: now.toISOString()
      })

      setHasCheckedInToday(true)
      showCheckInSuccess(pointsEarned, checkInType, motivationalQuote)
    } catch (error: any) {
      console.error('Check-in failed:', error)
      toast.error('Check-in failed. Please try again.')
    } finally {
      setCheckingIn(false)
    }
  }

  const handleQRScan = (qrData: string) => {
    console.log('QR Code scanned:', qrData)
    
    if (qrData.includes('systemkleen-checkin') || qrData.includes('check-in')) {
      performCheckIn()
    } else {
      toast.error('Invalid QR code. Please scan the correct check-in QR code.')
    }
  }

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Denver'
    }) + ' MST'
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
            <QrCode className="h-8 w-8 text-blue-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Employee Check-In</h2>
          <p className="text-gray-600 mb-6">Check in to earn points and maintain your streak!</p>
          
          {hasCheckedInToday ? (
            <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-green-800 text-lg font-semibold">✅ Already Checked In Today!</div>
              <p className="text-green-600 mt-2">Great job maintaining your streak!</p>
              <p className="text-sm text-green-600 mt-1">
                Current streak: {dbUser?.current_streak || 0} days
              </p>
            </div>
          ) : (
            <>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">Current Time</p>
                <p className="text-lg font-semibold">{getCurrentTime()}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Point System</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="font-semibold text-green-800">Early (6:00-7:45 AM)</div>
                    <div className="text-green-600">2 Points</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-semibold text-blue-800">On Time (7:46-8:01 AM)</div>
                    <div className="text-blue-600">1 Point</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-semibold text-gray-800">Late (8:02-9:00 AM)</div>
                    <div className="text-gray-600">0 Points</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 mb-6">
                <div className="text-center">
                  <Camera className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Ready to Check In?
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Scan the office QR code to check in
                  </p>
                  <button
                    onClick={() => setShowQRScanner(true)}
                    disabled={checkingIn}
                    className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 shadow-lg"
                  >
                    <QrCode className="h-5 w-5" />
                    <span>{checkingIn ? 'Processing...' : 'Open QR Scanner'}</span>
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-500 text-center">
                Check-in window: 6:00 AM - 9:00 AM MST only
              </p>
            </>
          )}
        </div>
      </div>

      {/* QR Scanner Modal */}
      <SimpleQRScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScanSuccess={handleQRScan}
      />
    </div>
  )
}

export default CheckInPage