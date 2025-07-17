export interface User {
  id: string;
  email: string;
  name: string;
  role: 'employee' | 'admin' | 'super_admin';
  company: string;
  department?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  approvedBy?: string;
  approvedAt?: string;
  created: string;
  updated: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  settings: {
    checkInWindow: {
      start: string;
      end: string;
      timezone: string;
    };
    pointsConfig: {
      early: number;
      onTime: number;
      late: number;
    };
    streakBonuses: Record<number, number>;
  };
  created: string;
  updated: string;
}

export interface Department {
  id: string;
  name: string;
  company: string;
  created: string;
  updated: string;
}

export interface CheckIn {
  id: string;
  user: string;
  checkInTime: string;
  type: 'early' | 'ontime' | 'late';
  pointsEarned: number;
  qrCodeData: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  bonusReason?: string;
  created: string;
  updated: string;
}

export interface BonusPoint {
  id: string;
  user: string;
  points: number;
  reason: string;
  awardedBy: string;
  created: string;
  updated: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  criteria: Record<string, any>;
  created: string;
  updated: string;
}

export interface UserBadge {
  id: string;
  user: string;
  badge: string;
  unlockedAt: string;
  created: string;
  updated: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: 'weekly' | 'monthly' | 'quarterly' | 'annual';
  icon: string;
  available: boolean;
  company: string;
  created: string;
  updated: string;
}

export interface RewardRedemption {
  id: string;
  user: string;
  reward: string;
  pointsCost: number;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  completedAt?: string;
  notes?: string;
  created: string;
  updated: string;
}

export interface QRCode {
  id: string;
  code: string;
  validFrom: string;
  validUntil: string;
  company: string;
  createdBy: string;
  rotationStrategy: 'daily' | 'weekly' | 'monthly' | 'manual';
  created: string;
  updated: string;
}

export interface UserStats {
  totalPoints: number;
  weeklyPoints: number;
  monthlyPoints: number;
  quarterlyPoints: number;
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  recentCheckIns: CheckIn[];
  recentBonusPoints: BonusPoint[];
  badges: UserBadge[];
  redemptions: RewardRedemption[];
}

export interface CheckInResult {
  success: boolean;
  message: string;
  pointsEarned: number;
  type: 'early' | 'ontime' | 'late';
  currentStreak: number;
  quote: {
    text: string;
    author: string;
  };
}

export interface Activity {
  id: string;
  type: 'check_in' | 'points_earned' | 'achievement' | 'achievement_unlocked' | 'bonus_points' | 'reward_redeemed' | 'streak_milestone' | 'level_up' | 'admin_action';
  title: string;
  description: string;
  timestamp: Date;
  points?: number;
  metadata?: Record<string, any>;
}

export interface Transaction {
  id: string;
  user: string;
  type: 'earned' | 'spent' | 'bonus' | 'refund';
  amount: number;
  description: string;
  relatedTo?: string;
  created: string;
  updated: string;
}

export interface Notification {
  id: string;
  user: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  created: string;
  updated: string;
}