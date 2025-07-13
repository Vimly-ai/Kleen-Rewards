/**
 * Demo Service - Provides rich demo data for showcasing the application
 * This service creates realistic demo accounts and data without affecting production
 */

import { addDays, subDays, startOfMonth, endOfMonth, format } from 'date-fns'

export interface DemoUser {
  id: string
  email: string
  name: string
  role: 'employee' | 'admin' | 'super_admin'
  department: string
  avatar?: string
  joinDate: Date
}

export interface DemoStats {
  totalCheckIns: number
  totalPoints: number
  currentStreak: number
  longestStreak: number
  averageCheckInTime: string
  recentAchievements: number
  rank: number
  weeklyProgress: number
  badges: Array<{
    id: string
    name: string
    description: string
    icon: string
    unlockedAt: string
  }>
  level: number
  pointsBalance: number
}

// Demo accounts
export const DEMO_ACCOUNTS = {
  employee: {
    email: 'demo.employee@systemkleen.demo',
    password: 'DemoEmployee123!',
    user: {
      id: 'demo-emp-001',
      email: 'demo.employee@systemkleen.demo',
      name: 'Sarah Johnson',
      role: 'employee' as const,
      department: 'Operations',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      joinDate: subDays(new Date(), 180)
    }
  },
  admin: {
    email: 'demo.admin@systemkleen.demo',
    password: 'DemoAdmin123!',
    user: {
      id: 'demo-admin-001',
      email: 'demo.admin@systemkleen.demo',
      name: 'Michael Chen',
      role: 'admin' as const,
      department: 'Management',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      joinDate: subDays(new Date(), 365)
    }
  }
}

// Generate realistic check-in history
function generateCheckInHistory(userId: string, days: number) {
  const checkIns = []
  const today = new Date()
  
  for (let i = 0; i < days; i++) {
    const date = subDays(today, i)
    const dayOfWeek = date.getDay()
    
    // Skip weekends for more realistic data
    if (dayOfWeek === 0 || dayOfWeek === 6) continue
    
    // Random chance of missing a day (10%)
    if (Math.random() < 0.1) continue
    
    // Random check-in time between 6:30 AM and 9:30 AM
    const checkInHour = 6 + Math.floor(Math.random() * 3)
    const checkInMinute = Math.floor(Math.random() * 60)
    const checkInTime = new Date(date)
    checkInTime.setHours(checkInHour, checkInMinute, 0, 0)
    
    // Points calculation
    let points = 50 // base points
    if (checkInHour < 7) points += 20 // early bird bonus
    if (i < 7 && checkIns.length === i) points += 10 // streak bonus
    
    checkIns.push({
      id: `check-${userId}-${i}`,
      userId,
      checkInTime: checkInTime.toISOString(),
      location: 'Main Office',
      pointsEarned: points,
      streakDays: Math.min(i + 1, 7),
      isOnTime: checkInHour < 8
    })
  }
  
  return checkIns
}

// Generate achievements for demo users
function generateAchievements(isAdmin: boolean) {
  const baseAchievements = [
    {
      id: 'early-bird',
      title: 'Early Bird',
      description: 'Check in before 7 AM for 5 consecutive days',
      icon: '🌅',
      progress: 100,
      maxProgress: 100,
      unlocked: true,
      unlockedAt: subDays(new Date(), 45).toISOString(),
      points: 100,
      category: 'punctuality'
    },
    {
      id: 'streak-master',
      title: 'Streak Master',
      description: 'Maintain a 30-day check-in streak',
      icon: '🔥',
      progress: 100,
      maxProgress: 100,
      unlocked: true,
      unlockedAt: subDays(new Date(), 20).toISOString(),
      points: 200,
      category: 'consistency'
    },
    {
      id: 'team-player',
      title: 'Team Player',
      description: 'Help 5 colleagues with their tasks',
      icon: '🤝',
      progress: 100,
      maxProgress: 100,
      unlocked: true,
      unlockedAt: subDays(new Date(), 60).toISOString(),
      points: 150,
      category: 'teamwork'
    },
    {
      id: 'perfect-month',
      title: 'Perfect Month',
      description: 'Check in every working day for a full month',
      icon: '📅',
      progress: 85,
      maxProgress: 100,
      unlocked: false,
      points: 300,
      category: 'consistency'
    },
    {
      id: 'rising-star',
      title: 'Rising Star',
      description: 'Earn 1000 points in a single month',
      icon: '⭐',
      progress: 780,
      maxProgress: 1000,
      unlocked: false,
      points: 250,
      category: 'performance'
    }
  ]
  
  if (isAdmin) {
    baseAchievements.push({
      id: 'leadership',
      title: 'Leadership Excellence',
      description: 'Successfully manage a team of 10+ employees',
      icon: '👑',
      progress: 100,
      maxProgress: 100,
      unlocked: true,
      unlockedAt: subDays(new Date(), 90).toISOString(),
      points: 500,
      category: 'leadership'
    })
  }
  
  return baseAchievements
}

// Generate activity timeline
function generateActivities(userId: string, isAdmin: boolean) {
  const activities = []
  const today = new Date()
  
  // Today's check-in
  activities.push({
    id: `act-${userId}-1`,
    type: 'check_in' as const,
    title: 'Daily Check-in',
    description: 'Checked in at 7:15 AM - Early bird bonus!',
    timestamp: new Date(today.setHours(7, 15, 0, 0)),
    points: 70
  })
  
  // Recent achievements
  activities.push({
    id: `act-${userId}-2`,
    type: 'achievement_unlocked' as const,
    title: 'Achievement Unlocked',
    description: 'Earned "Streak Master" - 30 day streak!',
    timestamp: subDays(today, 2),
    points: 200
  })
  
  // Bonus points
  activities.push({
    id: `act-${userId}-3`,
    type: 'bonus_points' as const,
    title: 'Bonus Points Received',
    description: 'Excellence in customer service',
    timestamp: subDays(today, 5),
    points: 150,
    awardedBy: 'Michael Chen'
  })
  
  if (isAdmin) {
    // Admin-specific activities
    activities.push({
      id: `act-${userId}-4`,
      type: 'admin_action' as const,
      title: 'Awarded Bonus Points',
      description: 'Recognized team member for outstanding performance',
      timestamp: subDays(today, 1),
      targetUser: 'Sarah Johnson'
    })
    
    activities.push({
      id: `act-${userId}-5`,
      type: 'admin_action' as const,
      title: 'Approved New User',
      description: 'Approved registration for new team member',
      timestamp: subDays(today, 3),
      targetUser: 'New Employee'
    })
  }
  
  // More check-ins
  for (let i = 1; i <= 5; i++) {
    const checkInDate = subDays(today, i)
    if (checkInDate.getDay() === 0 || checkInDate.getDay() === 6) continue
    
    activities.push({
      id: `act-${userId}-check-${i}`,
      type: 'check_in' as const,
      title: 'Daily Check-in',
      description: `Checked in at ${7 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} AM`,
      timestamp: checkInDate,
      points: 50 + Math.floor(Math.random() * 20)
    })
  }
  
  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

// Generate leaderboard data
export function generateLeaderboard() {
  const employees = [
    { name: 'Sarah Johnson', points: 3420, streak: 28, rank: 1, change: 0, department: 'Operations' },
    { name: 'Alex Rodriguez', points: 3380, streak: 24, rank: 2, change: 1, department: 'Sales' },
    { name: 'Emily Watson', points: 3250, streak: 21, rank: 3, change: -1, department: 'Marketing' },
    { name: 'James Miller', points: 3100, streak: 19, rank: 4, change: 2, department: 'IT' },
    { name: 'Lisa Chen', points: 2980, streak: 18, rank: 5, change: 0, department: 'Finance' },
    { name: 'Robert Taylor', points: 2850, streak: 15, rank: 6, change: -2, department: 'Operations' },
    { name: 'Maria Garcia', points: 2720, streak: 14, rank: 7, change: 1, department: 'HR' },
    { name: 'David Brown', points: 2600, streak: 12, rank: 8, change: -1, department: 'Sales' },
    { name: 'Jennifer Lee', points: 2480, streak: 11, rank: 9, change: 0, department: 'Marketing' },
    { name: 'Chris Anderson', points: 2350, streak: 10, rank: 10, change: 0, department: 'IT' }
  ]
  
  return employees
}

// Get demo user stats
export function getDemoUserStats(userType: 'employee' | 'admin'): DemoStats {
  const isAdmin = userType === 'admin'
  
  console.log('[DemoService] Getting demo stats for:', userType)
  
  const stats = {
    totalCheckIns: isAdmin ? 245 : 152,
    totalPoints: isAdmin ? 4850 : 3420,
    currentStreak: isAdmin ? 15 : 28,
    longestStreak: isAdmin ? 45 : 32,
    averageCheckInTime: isAdmin ? '7:45 AM' : '7:15 AM',
    recentAchievements: isAdmin ? 6 : 3,
    rank: isAdmin ? 0 : 1, // Admins don't have rank
    weeklyProgress: isAdmin ? 85 : 92,
    badges: generateAchievements(isAdmin).filter(a => a.unlocked).map(a => ({
      id: a.id,
      name: a.title,
      description: a.description,
      icon: a.icon,
      unlockedAt: a.unlockedAt!
    })),
    level: isAdmin ? 8 : 6,
    pointsBalance: isAdmin ? 2150 : 1620
  }
  
  console.log('[DemoService] Returning stats:', stats)
  return stats
}

// Get demo activities
export function getDemoActivities(userId: string, userType: 'employee' | 'admin') {
  return generateActivities(userId, userType === 'admin')
}

// Get demo check-ins
export function getDemoCheckIns(userId: string) {
  return generateCheckInHistory(userId, 60)
}

// Get demo achievements
export function getDemoAchievements(userType: 'employee' | 'admin') {
  return generateAchievements(userType === 'admin')
}

// Check if current user is a demo user
export function isDemoUser(email?: string | null): boolean {
  if (!email) return false
  return email.endsWith('@systemkleen.demo')
}

// Get demo mode from localStorage
export function isDemoMode(): boolean {
  return localStorage.getItem('demoMode') === 'true'
}

// Set demo mode
export function setDemoMode(enabled: boolean): void {
  if (enabled) {
    localStorage.setItem('demoMode', 'true')
  } else {
    localStorage.removeItem('demoMode')
  }
}

// Get current demo user
export function getCurrentDemoUser(): DemoUser | null {
  const demoUserId = localStorage.getItem('demoUserId')
  if (!demoUserId) return null
  
  if (demoUserId === DEMO_ACCOUNTS.employee.user.id) {
    return DEMO_ACCOUNTS.employee.user
  } else if (demoUserId === DEMO_ACCOUNTS.admin.user.id) {
    return DEMO_ACCOUNTS.admin.user
  }
  
  return null
}

// Set current demo user
export function setCurrentDemoUser(userType: 'employee' | 'admin' | null): void {
  if (!userType) {
    localStorage.removeItem('demoUserId')
    localStorage.removeItem('demoUserType')
    return
  }
  
  const user = DEMO_ACCOUNTS[userType].user
  localStorage.setItem('demoUserId', user.id)
  localStorage.setItem('demoUserType', userType)
}

// Demo analytics data for admin dashboard
export function getDemoAnalytics() {
  const currentMonth = new Date()
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  
  return {
    overview: {
      totalEmployees: 42,
      activeToday: 38,
      averageCheckInTime: '7:32 AM',
      onTimeRate: 89.5
    },
    trends: {
      daily: Array.from({ length: 7 }, (_, i) => ({
        date: format(subDays(new Date(), 6 - i), 'EEE'),
        checkIns: 35 + Math.floor(Math.random() * 8),
        onTime: 30 + Math.floor(Math.random() * 8)
      })),
      monthly: Array.from({ length: 6 }, (_, i) => ({
        month: format(subDays(new Date(), (5 - i) * 30), 'MMM'),
        totalPoints: 45000 + Math.floor(Math.random() * 10000),
        activeUsers: 38 + Math.floor(Math.random() * 5)
      }))
    },
    departments: [
      { name: 'Operations', employees: 12, avgPoints: 3200, checkInRate: 92 },
      { name: 'Sales', employees: 8, avgPoints: 2900, checkInRate: 88 },
      { name: 'Marketing', employees: 6, avgPoints: 3100, checkInRate: 90 },
      { name: 'IT', employees: 5, avgPoints: 3300, checkInRate: 95 },
      { name: 'Finance', employees: 4, avgPoints: 2800, checkInRate: 87 },
      { name: 'HR', employees: 3, avgPoints: 3000, checkInRate: 91 },
      { name: 'Management', employees: 4, avgPoints: 3500, checkInRate: 93 }
    ]
  }
}