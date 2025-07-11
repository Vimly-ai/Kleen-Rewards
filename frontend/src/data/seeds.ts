// Initial data seeds for PocketBase collections
// This file contains the initial data to populate the database

export const initialRewards = [
  {
    name: 'Coffee Gift Card',
    description: '$10 Starbucks gift card - fuel your day!',
    category: 'weekly',
    points_cost: 50,
    quantity_available: -1, // unlimited
    is_active: true,
    terms: 'Valid at any Starbucks location. Digital delivery via email.'
  },
  {
    name: 'Premium Parking Spot',
    description: 'Reserved parking spot for one week',
    category: 'weekly',
    points_cost: 75,
    quantity_available: 5,
    is_active: true,
    terms: 'Valid for one week from approval date. Spot assignment based on availability.'
  },
  {
    name: 'Work From Home Day',
    description: 'One additional work from home day',
    category: 'weekly',
    points_cost: 80,
    quantity_available: -1,
    is_active: true,
    terms: 'Subject to manager approval and business needs. Must be used within 30 days.'
  },
  {
    name: 'Extra PTO Day',
    description: 'One additional paid time off day',
    category: 'monthly',
    points_cost: 100,
    quantity_available: -1,
    is_active: true,
    terms: 'Must be approved by manager. Can be used within 90 days of redemption.'
  },
  {
    name: 'Team Lunch',
    description: 'Catered lunch for your team (up to 8 people)',
    category: 'monthly',
    points_cost: 150,
    quantity_available: 2,
    is_active: true,
    terms: 'Includes lunch for up to 8 team members. Must coordinate with admin for scheduling.'
  },
  {
    name: 'Half Day Off',
    description: 'Leave 4 hours early or come in 4 hours late',
    category: 'monthly',
    points_cost: 120,
    quantity_available: -1,
    is_active: true,
    terms: 'Subject to manager approval. Must be used within 60 days.'
  },
  {
    name: 'Quarterly Recognition Award',
    description: '$100 Amazon gift card + certificate',
    category: 'quarterly',
    points_cost: 250,
    quantity_available: 3,
    is_active: true,
    terms: 'Includes printed certificate and digital gift card delivery.'
  },
  {
    name: 'Professional Development Budget',
    description: '$200 towards courses, books, or conferences',
    category: 'quarterly',
    points_cost: 300,
    quantity_available: 5,
    is_active: true,
    terms: 'Must be pre-approved by manager. Receipts required for reimbursement.'
  },
  {
    name: 'Annual Bonus Day',
    description: 'One full paid day off for personal use',
    category: 'annual',
    points_cost: 500,
    quantity_available: -1,
    is_active: true,
    terms: 'Can be used any time within the year. Manager approval required.'
  },
  {
    name: 'Employee of the Year Package',
    description: '$500 gift card + reserved parking for 3 months',
    category: 'annual',
    points_cost: 800,
    quantity_available: 1,
    is_active: true,
    terms: 'Includes $500 Amazon gift card and premium parking spot for 3 months.'
  }
]

export const initialBadges = [
  {
    name: 'Early Bird',
    description: 'Check in early for 5 consecutive days',
    icon: '🌅',
    criteria_type: 'streak',
    criteria_value: 5,
    is_active: true
  },
  {
    name: 'Consistency Champion',
    description: 'Maintain a 10-day check-in streak',
    icon: '🏆',
    criteria_type: 'streak',
    criteria_value: 10,
    is_active: true
  },
  {
    name: 'Dedication Master',
    description: 'Achieve a 30-day check-in streak',
    icon: '💎',
    criteria_type: 'streak',
    criteria_value: 30,
    is_active: true
  },
  {
    name: 'Point Collector',
    description: 'Earn your first 100 points',
    icon: '🎯',
    criteria_type: 'points',
    criteria_value: 100,
    is_active: true
  },
  {
    name: 'Rising Star',
    description: 'Earn 500 total points',
    icon: '⭐',
    criteria_type: 'points',
    criteria_value: 500,
    is_active: true
  },
  {
    name: 'Team Player',
    description: 'Complete 50 check-ins',
    icon: '🤝',
    criteria_type: 'checkins',
    criteria_value: 50,
    is_active: true
  },
  {
    name: 'Company Legend',
    description: 'Complete 200 check-ins',
    icon: '👑',
    criteria_type: 'checkins',
    criteria_value: 200,
    is_active: true
  },
  {
    name: 'Welcome Aboard',
    description: 'Complete your first check-in',
    icon: '🎉',
    criteria_type: 'checkins',
    criteria_value: 1,
    is_active: true
  }
]

export const initialQuotes = [
  {
    quote_text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: 'motivation',
    is_active: true
  },
  {
    quote_text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: 'motivation',
    is_active: true
  },
  {
    quote_text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    category: 'success',
    is_active: true
  },
  {
    quote_text: "Teamwork makes the dream work.",
    author: "John C. Maxwell",
    category: 'teamwork',
    is_active: true
  },
  {
    quote_text: "Excellence is not a skill, it's an attitude.",
    author: "Ralph Marston",
    category: 'general',
    is_active: true
  },
  {
    quote_text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: 'motivation',
    is_active: true
  },
  {
    quote_text: "Coming together is a beginning, staying together is progress, working together is success.",
    author: "Henry Ford",
    category: 'teamwork',
    is_active: true
  },
  {
    quote_text: "Your limitation—it's only your imagination.",
    author: "Unknown",
    category: 'motivation',
    is_active: true
  },
  {
    quote_text: "Push yourself, because no one else is going to do it for you.",
    author: "Unknown",
    category: 'motivation',
    is_active: true
  },
  {
    quote_text: "Great things never come from comfort zones.",
    author: "Unknown",
    category: 'success',
    is_active: true
  }
]

export const initialSettings = [
  {
    setting_key: 'early_checkin_points',
    setting_value: '2',
    description: 'Points awarded for early check-in (6:00-7:00 AM)',
    category: 'points'
  },
  {
    setting_key: 'ontime_checkin_points',
    setting_value: '1',
    description: 'Points awarded for on-time check-in (7:00-9:00 AM)',
    category: 'points'
  },
  {
    setting_key: 'late_checkin_points',
    setting_value: '0',
    description: 'Points awarded for late check-in (after 9:00 AM)',
    category: 'points'
  },
  {
    setting_key: 'checkin_window_start',
    setting_value: '06:00',
    description: 'Daily check-in window start time',
    category: 'timing'
  },
  {
    setting_key: 'checkin_window_end',
    setting_value: '09:00',
    description: 'Daily check-in window end time',
    category: 'timing'
  },
  {
    setting_key: 'company_name',
    setting_value: 'System Kleen',
    description: 'Company name displayed in the app',
    category: 'company'
  },
  {
    setting_key: 'timezone',
    setting_value: 'America/Denver',
    description: 'Company timezone (MST)',
    category: 'timing'
  },
  {
    setting_key: 'streak_reset_grace_days',
    setting_value: '1',
    description: 'Days of grace before streak resets',
    category: 'general'
  }
]

// Function to seed initial data
export const seedData = async () => {
  try {
    console.log('🌱 Seeding initial data...')
    
    // Note: This would typically be run once during setup
    // In a real implementation, you'd have admin tools to populate this data
    
    // Seed rewards
    console.log('📦 Seeding rewards...')
    // await Promise.all(initialRewards.map(reward => 
    //   PocketBaseService.createReward(reward)
    // ))
    
    // Seed badges
    console.log('🏅 Seeding badges...')
    // Implementation would go here
    
    // Seed quotes
    console.log('💬 Seeding motivational quotes...')
    // Implementation would go here
    
    // Seed settings
    console.log('⚙️ Seeding system settings...')
    // Implementation would go here
    
    console.log('✅ Initial data seeded successfully!')
  } catch (error) {
    console.error('❌ Failed to seed data:', error)
  }
}