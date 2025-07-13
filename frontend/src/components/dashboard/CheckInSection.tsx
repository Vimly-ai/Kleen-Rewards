import { useState, useEffect } from 'react'
import { QrCode } from 'lucide-react'
import { toast } from 'sonner'
import QRScanner from '../QRScanner'
import { useData } from '../../contexts/DataContext'
import SupabaseService from '../../services/supabase'
import QRCodeService from '../../services/qrCodeService'
import { withErrorHandling } from '../../utils/errorHandler'

interface CheckInSectionProps {
  hasCheckedInToday: boolean
  onCheckInSuccess: () => void
}

export function CheckInSection({ hasCheckedInToday, onCheckInSuccess }: CheckInSectionProps) {
  const { user: dbUser, refreshUser } = useData()
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)
  const [lastCheckInAttempt, setLastCheckInAttempt] = useState<number>(0)
  
  // Debug user data
  useEffect(() => {
    console.log('CheckInSection - dbUser:', dbUser)
    console.log('CheckInSection - hasCheckedInToday:', hasCheckedInToday)
  }, [dbUser, hasCheckedInToday])

  const getUniqueMotivationalQuote = async (category: 'early' | 'ontime' | 'late') => {
    const quotes = {
      early: [
        { text: "The early bird catches the worm! Your dedication sets you apart.", author: "System Kleen" },
        { text: "Success is where preparation meets opportunity - and you're prepared!", author: "System Kleen" },
        { text: "Champions start their day before the rest of the world wakes up.", author: "System Kleen" },
        { text: "Your commitment to excellence shines brighter than the morning sun!", author: "System Kleen" },
        { text: "Early birds don't just catch worms - they catch opportunities!", author: "System Kleen" },
        { text: "Rise and shine! Your dedication today builds tomorrow's success.", author: "System Kleen" },
        { text: "The sunrise rewards those who greet it. Well done, champion!", author: "System Kleen" },
        { text: "Your early arrival sets the tone for an exceptional day ahead!", author: "System Kleen" },
        { text: "Leaders rise early, and today you're leading by example!", author: "System Kleen" },
        { text: "Dawn brings new possibilities, and you're here to seize them all!", author: "System Kleen" }
      ],
      ontime: [
        { text: "Punctuality is the politeness of kings. You're royalty today!", author: "System Kleen" },
        { text: "Perfect timing! You're exactly where you need to be.", author: "System Kleen" },
        { text: "Consistency breeds excellence. Keep up the great work!", author: "System Kleen" },
        { text: "Right on time means right on track for success!", author: "System Kleen" },
        { text: "Reliability is a superpower - and you've got it!", author: "System Kleen" },
        { text: "On time, every time - that's the mark of a true professional!", author: "System Kleen" },
        { text: "Your punctuality today paves the way for tomorrow's achievements!", author: "System Kleen" },
        { text: "Showing up on time shows you value yourself and others. Excellent!", author: "System Kleen" },
        { text: "Consistent commitment creates lasting success. You're building it daily!", author: "System Kleen" },
        { text: "Time management is life management - and you're mastering both!", author: "System Kleen" }
      ],
      late: [
        { text: "Every champion faces setbacks. What matters is how you bounce back!", author: "System Kleen" },
        { text: "Tomorrow is a new opportunity to shine. We believe in you!", author: "System Kleen" },
        { text: "Progress, not perfection. You're here and that's what counts!", author: "System Kleen" },
        { text: "The best time to plant a tree was yesterday. The second best time is now!", author: "System Kleen" },
        { text: "Your presence makes a difference, no matter what time you arrive.", author: "System Kleen" },
        { text: "Better late than never - your contribution today still matters!", author: "System Kleen" },
        { text: "Every step forward is progress. Keep moving in the right direction!", author: "System Kleen" },
        { text: "Today's delay doesn't define tomorrow's success. Keep pushing forward!", author: "System Kleen" },
        { text: "You showed up, and that takes courage. Tomorrow is yours to conquer!", author: "System Kleen" },
        { text: "Great things take time. Your journey continues, one day at a time!", author: "System Kleen" }
      ]
    }

    const categoryQuotes = quotes[category]
    // Keep track of recently used quotes to avoid repetition
    const recentQuotesKey = `recent_quotes_${category}`
    const recentQuotes = JSON.parse(localStorage.getItem(recentQuotesKey) || '[]')
    
    // Filter out recently used quotes
    const availableQuotes = categoryQuotes.filter(q => !recentQuotes.includes(q.text))
    
    // If all quotes have been used, reset
    if (availableQuotes.length === 0) {
      localStorage.setItem(recentQuotesKey, '[]')
      return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)]
    }
    
    // Select a random quote from available ones
    const selectedQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)]
    
    // Store this quote as recently used (keep last 3)
    recentQuotes.push(selectedQuote.text)
    if (recentQuotes.length > 3) {
      recentQuotes.shift()
    }
    localStorage.setItem(recentQuotesKey, JSON.stringify(recentQuotes))
    
    return selectedQuote
  }


  const handleCheckIn = async () => {
    console.log('handleCheckIn called', { dbUser, hasCheckedInToday, checkingIn })
    
    if (!dbUser?.id || hasCheckedInToday || checkingIn) {
      console.log('Check-in blocked:', { 
        noUser: !dbUser?.id, 
        alreadyCheckedIn: hasCheckedInToday, 
        processing: checkingIn 
      })
      return
    }

    // Prevent multiple check-ins within 5 seconds
    const now = Date.now()
    if (now - lastCheckInAttempt < 5000) {
      console.log('Check-in attempt too soon, ignoring')
      return
    }
    setLastCheckInAttempt(now)

    setCheckingIn(true)
    
    await withErrorHandling(async () => {
      // Check if within allowed time window
      const windowCheck = QRCodeService.isWithinCheckInWindow()
      if (!windowCheck.allowed) {
        const settings = QRCodeService.getCheckInSettings()
        toast.error(
          <div>
            <p className="font-medium">Check-in window closed</p>
            <p className="text-sm">{windowCheck.message}</p>
            <p className="text-xs mt-1">Current time: {windowCheck.currentTime.toLocaleTimeString('en-US', { timeZone: settings.timeWindow.timezone })}</p>
          </div>,
          { duration: 5000 }
        )
        setCheckingIn(false)
        return
      }
      
      // Calculate points based on check-in time
      const { points, type } = QRCodeService.calculatePoints()

      const quote = await getUniqueMotivationalQuote(type)
      
      // Calculate bonuses
      let bonusPoints = 0
      const currentStreak = dbUser.current_streak || 0
      const newStreakDay = currentStreak + 1
      
      // Perfect week bonus (every 7 days)
      if (newStreakDay % 7 === 0) {
        bonusPoints += 5
      }
      
      // 10-day streak bonus (every 10 days)
      if (newStreakDay % 10 === 0) {
        bonusPoints += 10
      }
      
      const checkInData = {
        check_in_time: windowCheck.currentTime.toISOString(),
        points_earned: points + bonusPoints,
        check_in_type: type,
        streak_day: newStreakDay
      }

      await SupabaseService.createCheckIn(dbUser.id, checkInData)
      
      // Show success message with bonuses
      let successMessage: string
      let toastType: 'success' | 'warning' = 'success'
      let totalPoints = points + bonusPoints
      
      if (type === 'early') {
        successMessage = `🌅 Early Bird Check-in Complete!`
      } else if (type === 'ontime') {
        successMessage = `⏰ Perfect Timing Check-in!`
      } else {
        successMessage = `📌 Check-in Recorded`
        toastType = 'warning'
      }
      
      // Build detailed points message
      let pointsDetails = `<div class="mt-2 space-y-1">`
      pointsDetails += `<p class="text-sm font-medium">✨ Base Points: +${points}</p>`
      
      if (bonusPoints > 0) {
        if (newStreakDay % 10 === 0) {
          pointsDetails += `<p class="text-sm font-medium">🔥 10-Day Streak Bonus: +10 points</p>`
        }
        if (newStreakDay % 7 === 0 && newStreakDay % 10 !== 0) {
          pointsDetails += `<p class="text-sm font-medium">🎯 Perfect Week Bonus: +5 points</p>`
        }
      }
      
      pointsDetails += `<p class="text-sm font-bold mt-2 pt-2 border-t">💰 Total Points Earned: +${totalPoints}</p>`
      pointsDetails += `</div>`
      
      // Add time information
      const settings = QRCodeService.getCheckInSettings()
      const checkInTime = windowCheck.currentTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: settings.timeWindow.timezone 
      })
      
      if (toastType === 'success') {
        toast.success(
          <div>
            <p className="font-semibold text-lg">{successMessage}</p>
            <p className="text-sm text-gray-600 mt-1">Checked in at {checkInTime} MST</p>
            <div dangerouslySetInnerHTML={{ __html: pointsDetails }} />
            <div className="mt-3 p-2 bg-green-50 rounded">
              <p className="text-xs text-green-700">Current Streak: {newStreakDay} days 🔥</p>
            </div>
          </div>,
          { duration: 6000 }
        )
      } else {
        toast.warning(
          <div>
            <p className="font-semibold text-lg">{successMessage}</p>
            <p className="text-sm text-gray-600 mt-1">Checked in at {checkInTime} MST</p>
            <div dangerouslySetInnerHTML={{ __html: pointsDetails }} />
            <div className="mt-3 p-2 bg-yellow-50 rounded">
              <p className="text-xs text-yellow-700">💡 Tip: Check in before 8:02 AM to earn points!</p>
              <p className="text-xs text-yellow-700 mt-1">Current Streak: {newStreakDay} days</p>
            </div>
          </div>,
          { duration: 6000 }
        )
      }
      
      // Show motivational quote after a delay
      setTimeout(() => {
        toast.custom(
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-lg max-w-md">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">💪</div>
              <div className="flex-1">
                <p className="font-bold text-sm mb-2">Daily Motivation</p>
                <p className="text-sm italic leading-relaxed">"{quote.text}"</p>
                <p className="text-xs mt-2 opacity-90">- {quote.author}</p>
              </div>
            </div>
          </div>,
          { duration: 8000, position: 'top-center' }
        )
      }, 2500)
      
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
    console.log('QR Scan received data:', data)
    
    // Close scanner immediately to prevent multiple scans
    setShowQRScanner(false)
    
    // Validate QR code using the service
    const validation = QRCodeService.validateQRCode(data)
    console.log('QR validation result:', validation)
    
    if (validation.valid && validation.code) {
      console.log('Valid QR code scanned:', validation.code)
      toast.info('Processing check-in...', { duration: 2000 })
      
      // Small delay to ensure scanner is fully closed
      setTimeout(async () => {
        try {
          await handleCheckIn()
        } catch (error) {
          console.error('Check-in error:', error)
          toast.error('Failed to complete check-in. Please try again.')
        }
      }, 500)
    } else {
      console.error('Invalid QR code:', validation.error)
      toast.error(
        <div>
          <p className="font-medium">Invalid QR Code</p>
          <p className="text-sm">{validation.error || 'Please scan the official System Kleen check-in QR code located at your workstation.'}</p>
        </div>,
        { duration: 4000 }
      )
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
          
          {(import.meta.env.DEV || localStorage.getItem('demoMode') === 'true') && (
            <button
              onClick={handleDemoCheckIn}
              disabled={checkingIn}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition disabled:opacity-50 text-sm"
            >
              Demo Check-In (Test)
            </button>
          )}
        </div>
      </div>

      {showQRScanner && (
        <QRScanner
          isOpen={showQRScanner}
          onScanSuccess={handleQRScan}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  )
}