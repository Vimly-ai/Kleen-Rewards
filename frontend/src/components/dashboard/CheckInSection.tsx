import { useState } from 'react'
import { QrCode } from 'lucide-react'
import { toast } from 'sonner'
import QRScanner from '../QRScanner'
import { useData } from '../../contexts/DataContext'
import SupabaseService from '../../services/supabase'
import { withErrorHandling } from '../../utils/errorHandler'

interface CheckInSectionProps {
  hasCheckedInToday: boolean
  onCheckInSuccess: () => void
}

export function CheckInSection({ hasCheckedInToday, onCheckInSuccess }: CheckInSectionProps) {
  const { user: dbUser, refreshUser } = useData()
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)

  const getUniqueMotivationalQuote = async (category: 'early' | 'ontime' | 'late') => {
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
    return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)]
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
        { duration: 8000 }
      )
    }, 2000)
  }

  const handleCheckIn = async () => {
    if (!dbUser?.id || hasCheckedInToday) return

    setCheckingIn(true)
    
    await withErrorHandling(async () => {
      const now = new Date()
      const mstTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Denver" }))
      const hour = mstTime.getHours()
      
      let type: 'early' | 'ontime' | 'late'
      let points: number

      if (hour < 6) {
        type = 'early'
        points = 10
      } else if (hour <= 9) {
        type = 'ontime'
        points = 5
      } else {
        type = 'late'
        points = 0
      }

      const quote = await getUniqueMotivationalQuote(type)
      
      const checkInData = {
        user_id: dbUser.id,
        check_in_time: mstTime.toISOString(),
        points_earned: points,
        check_in_type: type,
        streak_day: type === 'late' ? 0 : dbUser.current_streak + 1
      }

      await SupabaseService.createCheckIn(checkInData)
      
      showCheckInSuccess(points, type, quote)
      await refreshUser()
      onCheckInSuccess()
    }, {
      errorMessage: 'Failed to check in. Please try again.'
    })

    setCheckingIn(false)
  }

  const handleDemoCheckIn = async () => {
    if (import.meta.env.DEV) {
      await handleCheckIn()
    }
  }

  const handleQRScan = async (data: string) => {
    if (data === 'systemkleen-checkin' || data.includes('systemkleen')) {
      setShowQRScanner(false)
      await handleCheckIn()
    } else {
      toast.error('Invalid QR code. Please scan the correct check-in code.')
    }
  }

  if (hasCheckedInToday) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-lg font-medium text-green-800 mb-2">
              You're all checked in for today!
            </h3>
            <p className="text-green-600">
              Great job staying consistent! Come back tomorrow to continue your streak.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="text-center">
        <QrCode className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Check In?</h3>
        <p className="text-gray-600 mb-6">
          Scan the QR code at your workstation or use the button below for demo purposes.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => setShowQRScanner(true)}
            disabled={checkingIn}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {checkingIn ? 'Checking In...' : 'Scan QR Code'}
          </button>
          
          {import.meta.env.DEV && (
            <button
              onClick={handleDemoCheckIn}
              disabled={checkingIn}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition disabled:opacity-50 text-sm"
            >
              Demo Check-In (Dev Only)
            </button>
          )}
        </div>
      </div>

      {showQRScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  )
}