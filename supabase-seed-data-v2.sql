-- =============================================================================
-- ENTERPRISE EMPLOYEE REWARDS SYSTEM - COMPREHENSIVE SEED DATA V2.0
-- =============================================================================
-- 
-- This seed data populates the enhanced Employee Rewards system with:
-- • Comprehensive rewards catalog with categories
-- • Advanced achievement system with progressive badges
-- • Rich system settings and configuration
-- • Sample analytics and engagement data
-- • Team structures and notifications
-- • Motivational content and quotes
--
-- Run this after the schema V2.0 has been successfully applied
-- =============================================================================

-- =============================================================================
-- SECTION 1: REWARD CATEGORIES AND REWARDS
-- =============================================================================

-- Ensure reward categories exist (already inserted in schema, but adding for completeness)
INSERT INTO public.reward_categories (name, description, display_order, icon, color_theme) VALUES
('Food & Beverages', 'Coffee, lunch, and food-related rewards', 1, '🍕', '#FF6B6B'),
('Time Off', 'PTO, flexible hours, and time-related benefits', 2, '🏖️', '#4ECDC4'),
('Professional Development', 'Learning, courses, and skill development', 3, '📚', '#45B7D1'),
('Recognition', 'Awards, certificates, and acknowledgments', 4, '🏆', '#FFA726'),
('Wellness', 'Health, fitness, and wellbeing rewards', 5, '💪', '#66BB6A'),
('Technology', 'Gadgets, software, and tech accessories', 6, '💻', '#AB47BC'),
('Gift Cards', 'Various gift cards and vouchers', 7, '🎁', '#EC407A'),
('Experiences', 'Events, activities, and special experiences', 8, '🎢', '#FF7043')
ON CONFLICT (name) DO NOTHING;

-- Enhanced rewards with proper category assignments
INSERT INTO public.rewards (
    name, description, long_description, category_id, legacy_category, 
    points_cost, original_price, quantity_available, max_per_user, max_per_month,
    tags, is_active, is_featured, priority_level, terms, fine_print, expiry_days
) VALUES

-- Food & Beverages Category
(
    'Premium Coffee Experience', 
    '$15 Starbucks gift card with specialty drink guide', 
    'Treat yourself to premium coffee with this $15 Starbucks gift card. Includes access to our curated specialty drink guide with seasonal recommendations and barista tips.',
    (SELECT id FROM public.reward_categories WHERE name = 'Food & Beverages'),
    'weekly',
    75, 15.00, -1, 2, 50,
    '{"coffee", "starbucks", "beverages", "premium"}',
    true, true, 8,
    'Valid at any Starbucks location. Digital delivery via email within 24 hours.',
    'Gift card expires 12 months from issue date. Cannot be combined with other offers.',
    90
),

(
    'Team Pizza Party', 
    'Pizza lunch for your team (up to 8 people)', 
    'Bring your team together with a delicious pizza lunch! Choose from local favorites including vegetarian and gluten-free options. Perfect for celebrating milestones or just building team spirit.',
    (SELECT id FROM public.reward_categories WHERE name = 'Food & Beverages'),
    'monthly',
    200, 80.00, 3, 1, 5,
    '{"team", "pizza", "lunch", "celebration"}',
    true, false, 6,
    'Must coordinate with admin for scheduling. Dietary restrictions accommodated.',
    'Subject to vendor availability. 48-hour advance notice required.',
    60
),

(
    'Healthy Snack Box', 
    'Curated box of healthy snacks for the week', 
    'Fuel your productivity with a weekly delivery of premium healthy snacks. Each box contains 15-20 items including nuts, dried fruits, protein bars, and other nutritious options.',
    (SELECT id FROM public.reward_categories WHERE name = 'Food & Beverages'),
    'weekly',
    50, 25.00, 20, 4, 20,
    '{"healthy", "snacks", "nutrition", "wellness"}',
    true, false, 4,
    'Delivered to your desk every Monday. Dietary preferences accommodated.',
    'Contents may vary based on seasonal availability.',
    30
),

-- Time Off Category
(
    'Flexible Start Time', 
    'Choose your start time for one week', 
    'Take control of your schedule! Start your workday anytime between 7 AM and 10 AM for one full week. Perfect for those important personal appointments or just sleeping in.',
    (SELECT id FROM public.reward_categories WHERE name = 'Time Off'),
    'weekly',
    100, 0.00, -1, 1, 10,
    '{"flexible", "schedule", "start_time", "work_life_balance"}',
    true, true, 7,
    'Subject to manager approval and business needs. Must be used within 30 days.',
    'Cannot be used during critical business periods or all-hands meetings.',
    30
),

(
    'Mental Health Day', 
    'One additional paid mental health day', 
    'Prioritize your wellbeing with a dedicated mental health day. Use it for therapy, meditation, nature walks, or simply recharging. Your mental health matters to us.',
    (SELECT id FROM public.reward_categories WHERE name = 'Time Off'),
    'monthly',
    150, 0.00, -1, 2, 8,
    '{"mental_health", "wellness", "pto", "self_care"}',
    true, true, 9,
    'Must be approved by manager. Can be used within 90 days of redemption.',
    'Not deducted from regular PTO balance. Requires 24-hour advance notice except for emergencies.',
    90
),

(
    'Long Weekend Package', 
    'Friday OR Monday off for a 3-day weekend', 
    'Extend your weekend with an extra day off! Choose either Friday or Monday to create the perfect long weekend for travel, hobbies, or quality time with family.',
    (SELECT id FROM public.reward_categories WHERE name = 'Time Off'),
    'monthly',
    120, 0.00, -1, 1, 15,
    '{"long_weekend", "friday", "monday", "extended_break"}',
    true, false, 5,
    'Subject to manager approval. Must be used within 60 days.',
    'Cannot be used during month-end closing or critical project deadlines.',
    60
),

-- Professional Development Category
(
    'Online Course Scholarship', 
    '$100 towards any online course or certification', 
    'Invest in your future! Use this scholarship for Coursera, Udemy, LinkedIn Learning, or any accredited online course. Includes access to our career development resource library.',
    (SELECT id FROM public.reward_categories WHERE name = 'Professional Development'),
    'quarterly',
    250, 100.00, -1, 2, 5,
    '{"education", "courses", "certification", "skill_development"}',
    true, true, 8,
    'Must be pre-approved by manager. Receipts required for reimbursement within 30 days.',
    'Course must be relevant to current role or career development path.',
    180
),

(
    'Conference Attendance Credit', 
    '$300 towards industry conference registration', 
    'Expand your network and stay current with industry trends! This credit covers registration for most major industry conferences. Travel and accommodation sold separately.',
    (SELECT id FROM public.reward_categories WHERE name = 'Professional Development'),
    'annual',
    600, 300.00, 5, 1, 3,
    '{"conference", "networking", "industry", "learning"}',
    true, true, 9,
    'Manager approval required. Must submit conference summary report within 2 weeks.',
    'Conference must be directly related to job function. Additional travel costs not covered.',
    365
),

(
    'Mentorship Program Access', 
    '3-month access to executive mentorship program', 
    'Fast-track your career with personalized mentorship from senior executives. Includes monthly 1-on-1 sessions, goal setting, and career planning resources.',
    (SELECT id FROM public.reward_categories WHERE name = 'Professional Development'),
    'quarterly',
    400, 500.00, 8, 1, 2,
    '{"mentorship", "leadership", "career_development", "executive"}',
    true, true, 10,
    'Commitment to full 3-month program required. Mentor matching based on availability.',
    'Participants must maintain good standing and attend all scheduled sessions.',
    90
),

-- Recognition Category
(
    'Employee Spotlight Feature', 
    'Featured profile in company newsletter and website', 
    'Shine in the spotlight! Your achievements will be featured in the monthly company newsletter, website, and social media. Includes professional photo session.',
    (SELECT id FROM public.reward_categories WHERE name = 'Recognition'),
    'monthly',
    150, 0.00, 3, 1, 3,
    '{"spotlight", "recognition", "newsletter", "achievement"}',
    true, false, 6,
    'Includes professional photo session and interview. Published within 30 days.',
    'Content subject to company editorial review and approval.',
    30
),

(
    'Excellence Award Certificate', 
    'Personalized achievement certificate with $50 bonus', 
    'Receive a beautiful, personalized certificate recognizing your outstanding contributions, plus a $50 gift card to celebrate your achievement.',
    (SELECT id FROM public.reward_categories WHERE name = 'Recognition'),
    'quarterly',
    200, 50.00, -1, 2, 10,
    '{"certificate", "achievement", "excellence", "bonus"}',
    true, false, 5,
    'Certificate includes personal message from CEO. Gift card delivered within 48 hours.',
    'Certificate suitable for framing and professional display.',
    120
),

(
    'VIP Parking for a Month', 
    'Reserved VIP parking spot closest to entrance', 
    'Park like a VIP! Enjoy the closest parking spot to the main entrance for a full month. Includes personalized parking sign with your name.',
    (SELECT id FROM public.reward_categories WHERE name = 'Recognition'),
    'monthly',
    100, 0.00, 1, 1, 1,
    '{"parking", "vip", "reserved", "convenience"}',
    true, true, 7,
    'Valid for 30 days from activation. Spot assignment based on availability.',
    'Must display provided parking permit. Transferring permit prohibited.',
    30
),

-- Wellness Category
(
    'Gym Membership Reimbursement', 
    '$50 towards gym or fitness membership', 
    'Invest in your health! Use this credit towards any gym membership, fitness classes, or wellness program. Includes access to our corporate wellness resources.',
    (SELECT id FROM public.reward_categories WHERE name = 'Wellness'),
    'monthly',
    125, 50.00, -1, 1, 15,
    '{"fitness", "gym", "health", "wellness"}',
    true, false, 4,
    'Valid for any fitness facility or wellness program. Receipts required.',
    'Membership must be active for minimum 30 days to qualify for reimbursement.',
    90
),

(
    'Massage Therapy Session', 
    '60-minute therapeutic massage at local spa', 
    'Relax and rejuvenate with a professional 60-minute massage at our partner spa. Choose from Swedish, deep tissue, or therapeutic styles.',
    (SELECT id FROM public.reward_categories WHERE name = 'Wellness'),
    'monthly',
    180, 120.00, 10, 1, 8,
    '{"massage", "spa", "relaxation", "therapy"}',
    true, true, 8,
    'Must schedule within 60 days. 24-hour cancellation policy applies.',
    'Available at partner location only. Valid ID required for appointment.',
    60
),

(
    'Ergonomic Workspace Upgrade', 
    '$75 towards ergonomic office accessories', 
    'Improve your workspace comfort and productivity! Credit can be used for ergonomic chairs, standing desks, keyboard trays, or other approved office wellness items.',
    (SELECT id FROM public.reward_categories WHERE name = 'Wellness'),
    'quarterly',
    200, 75.00, -1, 1, 8,
    '{"ergonomic", "workspace", "office", "productivity"}',
    true, false, 5,
    'Must be approved ergonomic equipment. Installation assistance available.',
    'Equipment becomes company property. Must remain in assigned workspace.',
    180
),

-- Technology Category
(
    'Wireless Earbuds', 
    'Premium wireless earbuds for work and leisure', 
    'Upgrade your audio experience with high-quality wireless earbuds. Perfect for calls, music, and focus. Includes noise cancellation and premium carrying case.',
    (SELECT id FROM public.reward_categories WHERE name = 'Technology'),
    'quarterly',
    300, 150.00, 15, 1, 5,
    '{"earbuds", "wireless", "audio", "technology"}',
    true, true, 7,
    'Includes 1-year warranty and premium carrying case. Multiple color options available.',
    'Device setup and support available through IT department.',
    90
),

(
    'Software License', 
    'Annual license for productivity or creative software', 
    'Boost your productivity with professional software! Choose from popular options like Adobe Creative Suite, Microsoft Office 365, or specialized industry tools.',
    (SELECT id FROM public.reward_categories WHERE name = 'Technology'),
    'annual',
    400, 200.00, -1, 1, 3,
    '{"software", "license", "productivity", "creative"}',
    true, false, 6,
    'Must be approved software for business use. License valid for 12 months.',
    'Software must be installed on company-approved devices only.',
    365
),

(
    'Portable Charger Kit', 
    'High-capacity portable charger with multiple cables', 
    'Never run out of power! This kit includes a 20,000mAh portable battery, wireless charging pad, and cables for all major device types.',
    (SELECT id FROM public.reward_categories WHERE name = 'Technology'),
    'weekly',
    80, 40.00, 25, 1, 10,
    '{"charger", "portable", "battery", "convenience"}',
    true, false, 3,
    'Includes carrying case and multiple cable types. 2-year manufacturer warranty.',
    'Compatible with all major smartphone and tablet brands.',
    120
),

-- Gift Cards Category
(
    'Amazon Gift Card - $25', 
    '$25 Amazon gift card for anything you need', 
    'The ultimate flexibility reward! Use this $25 Amazon gift card for anything from books and electronics to household items and groceries.',
    (SELECT id FROM public.reward_categories WHERE name = 'Gift Cards'),
    'weekly',
    60, 25.00, -1, 2, 25,
    '{"amazon", "gift_card", "flexible", "shopping"}',
    true, false, 4,
    'Digital delivery within 24 hours. No expiration date.',
    'Cannot be redeemed for cash. Amazon terms and conditions apply.',
    365
),

(
    'Restaurant Gift Card - $50', 
    '$50 gift card to popular local restaurants', 
    'Enjoy a great meal at one of our partner restaurants! Choose from fine dining, casual favorites, or family-friendly options throughout the city.',
    (SELECT id FROM public.reward_categories WHERE name = 'Gift Cards'),
    'monthly',
    150, 50.00, -1, 1, 15,
    '{"restaurant", "dining", "local", "food"}',
    true, true, 6,
    'Valid at 50+ partner restaurants. Digital or physical card available.',
    'Gratuity not included. Some restrictions may apply during peak dining times.',
    180
),

(
    'Streaming Service Credit', 
    '3 months of premium streaming service', 
    'Enjoy premium entertainment! Choose from Netflix, Disney+, Spotify Premium, or other popular streaming services. Perfect for unwinding after a productive day.',
    (SELECT id FROM public.reward_categories WHERE name = 'Gift Cards'),
    'quarterly',
    100, 45.00, -1, 1, 10,
    '{"streaming", "entertainment", "netflix", "spotify"}',
    true, false, 4,
    'Account setup assistance available. Valid for new or existing accounts.',
    'Auto-renewal not included. Service terms and conditions apply.',
    90
),

-- Experiences Category
(
    'Local Adventure Package', 
    'Tickets to local attractions and activities', 
    'Explore your city! Package includes tickets to museums, galleries, theaters, or outdoor activities. Perfect for a fun weekend adventure.',
    (SELECT id FROM public.reward_categories WHERE name = 'Experiences'),
    'monthly',
    180, 75.00, 8, 1, 5,
    '{"local", "adventure", "tickets", "attractions"}',
    true, true, 7,
    'Choose from 20+ local partners. Tickets valid for 6 months.',
    'Subject to venue availability and seasonal schedules.',
    180
),

(
    'Cooking Class Experience', 
    'Hands-on cooking class with professional chef', 
    'Learn new culinary skills in a fun, interactive environment! Classes include ingredients, recipes, and a delicious meal to enjoy.',
    (SELECT id FROM public.reward_categories WHERE name = 'Experiences'),
    'quarterly',
    250, 125.00, 12, 1, 4,
    '{"cooking", "class", "chef", "culinary"}',
    true, false, 6,
    'Includes all ingredients and take-home recipes. Various cuisine styles available.',
    'Dietary restrictions accommodated with advance notice.',
    120
),

(
    'Professional Networking Event', 
    'Admission to exclusive industry networking event', 
    'Expand your professional network at high-quality industry events. Includes admission, appetizers, and access to exclusive speaker sessions.',
    (SELECT id FROM public.reward_categories WHERE name = 'Experiences'),
    'quarterly',
    200, 100.00, 6, 1, 3,
    '{"networking", "professional", "industry", "career"}',
    true, false, 8,
    'Events scheduled quarterly in major business districts. Business attire required.',
    'RSVP required 1 week in advance. Limited to confirmed industry professionals.',
    90
);

-- =============================================================================
-- SECTION 2: BADGE CATEGORIES AND ACHIEVEMENT SYSTEM
-- =============================================================================

-- Ensure badge categories exist
INSERT INTO public.badge_categories (name, description, display_order, color_theme) VALUES
('Getting Started', 'Welcome and onboarding achievements', 1, '#4CAF50'),
('Consistency', 'Regular check-in and attendance badges', 2, '#2196F3'),
('Milestones', 'Point and achievement milestones', 3, '#FF9800'),
('Special Events', 'Holiday and special occasion badges', 4, '#9C27B0'),
('Leadership', 'Team and leadership achievements', 5, '#795548'),
('Excellence', 'Top performance and exceptional achievements', 6, '#FFD700')
ON CONFLICT (name) DO NOTHING;

-- Comprehensive badge system with progressive difficulty
INSERT INTO public.badges (
    name, description, category_id, icon, icon_color, background_color, 
    rarity, criteria_type, criteria_value, criteria_config,
    is_secret, is_repeatable, max_level, points_reward, difficulty_level,
    estimated_time_days, prerequisite_badges
) VALUES

-- Getting Started Badges
(
    'Welcome Aboard', 
    'Complete your first check-in and start your journey!', 
    (SELECT id FROM public.badge_categories WHERE name = 'Getting Started'),
    '🎉', '#FFD700', '#FFFFFF',
    'common', 'checkins', 1, '{"description": "First check-in milestone"}',
    false, false, 1, 5, 1, 1, '{}'
),

(
    'Profile Complete', 
    'Fill out your complete employee profile', 
    (SELECT id FROM public.badge_categories WHERE name = 'Getting Started'),
    '👤', '#4CAF50', '#F1F8E9',
    'common', 'special', 1, '{"type": "profile_completion"}',
    false, false, 1, 10, 1, 1, '{}'
),

(
    'First Week Warrior', 
    'Check in every day during your first week', 
    (SELECT id FROM public.badge_categories WHERE name = 'Getting Started'),
    '⚔️', '#FF9800', '#FFF3E0',
    'uncommon', 'streak', 7, '{"description": "First week perfect attendance"}',
    false, false, 1, 25, 3, 7, '{}'
),

-- Consistency Badges (Progressive Levels)
(
    'Early Bird Bronze', 
    'Check in early for 5 consecutive days', 
    (SELECT id FROM public.badge_categories WHERE name = 'Consistency'),
    '🌅', '#CD7F32', '#FFF8E1',
    'common', 'streak', 5, '{"check_in_type": "early"}',
    false, true, 3, 10, 2, 5, '{}'
),

(
    'Early Bird Silver', 
    'Check in early for 15 consecutive days', 
    (SELECT id FROM public.badge_categories WHERE name = 'Consistency'),
    '🌅', '#C0C0C0', '#F3E5F5',
    'uncommon', 'streak', 15, '{"check_in_type": "early"}',
    false, true, 3, 25, 4, 15, '{}'
),

(
    'Early Bird Gold', 
    'Check in early for 30 consecutive days', 
    (SELECT id FROM public.badge_categories WHERE name = 'Consistency'),
    '🌅', '#FFD700', '#FFFDE7',
    'rare', 'streak', 30, '{"check_in_type": "early"}',
    false, true, 3, 50, 6, 30, '{}'
),

(
    'Punctuality Pro', 
    'Never miss a check-in for 20 consecutive days', 
    (SELECT id FROM public.badge_categories WHERE name = 'Consistency'),
    '⏰', '#2196F3', '#E3F2FD',
    'uncommon', 'streak', 20, '{"description": "Perfect punctuality streak"}',
    false, false, 1, 30, 4, 20, '{}'
),

(
    'Dedication Master', 
    'Maintain a 60-day check-in streak', 
    (SELECT id FROM public.badge_categories WHERE name = 'Consistency'),
    '💎', '#9C27B0', '#F3E5F5',
    'epic', 'streak', 60, '{"description": "Ultimate dedication streak"}',
    false, false, 1, 100, 8, 60, '{}'
),

(
    'Century Club', 
    'Achieve a 100-day check-in streak', 
    (SELECT id FROM public.badge_categories WHERE name = 'Consistency'),
    '💯', '#4CAF50', '#E8F5E8',
    'legendary', 'streak', 100, '{"description": "Legendary consistency achievement"}',
    false, false, 1, 200, 10, 100, '{}'
),

-- Milestone Badges (Points-based)
(
    'Point Collector', 
    'Earn your first 100 points', 
    (SELECT id FROM public.badge_categories WHERE name = 'Milestones'),
    '🎯', '#FF5722', '#FFF3E0',
    'common', 'points', 100, '{"description": "First major point milestone"}',
    false, false, 1, 15, 2, 30, '{}'
),

(
    'Rising Star', 
    'Earn 500 total points', 
    (SELECT id FROM public.badge_categories WHERE name = 'Milestones'),
    '⭐', '#FF9800', '#FFF8E1',
    'uncommon', 'points', 500, '{"description": "Rising star performer"}',
    false, false, 1, 30, 4, 90, '{}'
),

(
    'Point Powerhouse', 
    'Earn 1,000 total points', 
    (SELECT id FROM public.badge_categories WHERE name = 'Milestones'),
    '⚡', '#2196F3', '#E3F2FD',
    'rare', 'points', 1000, '{"description": "Major point achievement"}',
    false, false, 1, 75, 6, 180, '{}'
),

(
    'Elite Performer', 
    'Earn 2,500 total points', 
    (SELECT id FROM public.badge_categories WHERE name = 'Milestones'),
    '👑', '#9C27B0', '#F3E5F5',
    'epic', 'points', 2500, '{"description": "Elite level performance"}',
    false, false, 1, 150, 8, 365, '{}'
),

(
    'Legendary Achiever', 
    'Earn 5,000 total points', 
    (SELECT id FROM public.badge_categories WHERE name = 'Milestones'),
    '🏆', '#FFD700', '#FFFDE7',
    'legendary', 'points', 5000, '{"description": "Legendary achievement level"}',
    true, false, 1, 300, 10, 730, '{}'
),

-- Check-in Frequency Badges
(
    'Team Player', 
    'Complete 50 total check-ins', 
    (SELECT id FROM public.badge_categories WHERE name = 'Milestones'),
    '🤝', '#4CAF50', '#E8F5E8',
    'common', 'checkins', 50, '{"description": "Regular participation milestone"}',
    false, false, 1, 20, 3, 60, '{}'
),

(
    'Committed Member', 
    'Complete 150 total check-ins', 
    (SELECT id FROM public.badge_categories WHERE name = 'Milestones'),
    '🎖️', '#FF5722', '#FFF3E0',
    'uncommon', 'checkins', 150, '{"description": "High commitment level"}',
    false, false, 1, 50, 5, 180, '{}'
),

(
    'Company Legend', 
    'Complete 365 total check-ins', 
    (SELECT id FROM public.badge_categories WHERE name = 'Milestones'),
    '🌟', '#FF9800', '#FFF8E1',
    'epic', 'checkins', 365, '{"description": "Year of dedication"}',
    false, false, 1, 100, 8, 365, '{}'
),

-- Special Event Badges
(
    'Holiday Spirit', 
    'Check in on 5 different company holidays', 
    (SELECT id FROM public.badge_categories WHERE name = 'Special Events'),
    '🎄', '#E91E63', '#FCE4EC',
    'uncommon', 'special', 5, '{"type": "holiday_checkins"}',
    false, false, 1, 40, 4, 365, '{}'
),

(
    'Weekend Warrior', 
    'Check in on 10 different weekends', 
    (SELECT id FROM public.badge_categories WHERE name = 'Special Events'),
    '⚔️', '#795748', '#EFEBE9',
    'rare', 'special', 10, '{"type": "weekend_checkins"}',
    false, false, 1, 60, 6, 180, '{}'
),

(
    'Midnight Oil', 
    'Check in after 8 PM on 5 occasions', 
    (SELECT id FROM public.badge_categories WHERE name = 'Special Events'),
    '🕰️', '#3F51B5', '#E8EAF6',
    'rare', 'special', 5, '{"type": "late_checkins", "after": "20:00"}',
    true, false, 1, 75, 7, 90, '{}'
),

-- Leadership Badges
(
    'Mentor', 
    'Help onboard 3 new team members', 
    (SELECT id FROM public.badge_categories WHERE name = 'Leadership'),
    '🎓', '#607D8B', '#ECEFF1',
    'rare', 'special', 3, '{"type": "mentoring"}',
    false, false, 1, 100, 7, 180, '{}'
),

(
    'Team Builder', 
    'Organize 5 team activities or events', 
    (SELECT id FROM public.badge_categories WHERE name = 'Leadership'),
    '🏗️', '#795748', '#EFEBE9',
    'epic', 'special', 5, '{"type": "team_building"}',
    false, false, 1, 150, 8, 365, '{}'
),

(
    'Innovation Champion', 
    'Submit 3 approved improvement suggestions', 
    (SELECT id FROM public.badge_categories WHERE name = 'Leadership'),
    '💡', '#FF9800', '#FFF8E1',
    'rare', 'special', 3, '{"type": "innovation"}',
    false, false, 1, 125, 6, 180, '{}'
),

-- Excellence Badges (Secret/Special)
(
    'Perfect Month', 
    'Complete every check-in in a calendar month', 
    (SELECT id FROM public.badge_categories WHERE name = 'Excellence'),
    '🌕', '#FFD700', '#FFFDE7',
    'epic', 'special', 1, '{"type": "perfect_month"}',
    true, true, 1, 200, 9, 30, '{}'
),

(
    'Department Champion', 
    'Achieve highest points in your department for a month', 
    (SELECT id FROM public.badge_categories WHERE name = 'Excellence'),
    '🥇', '#FFD700', '#FFFDE7',
    'legendary', 'special', 1, '{"type": "department_leader"}',
    true, true, 1, 250, 10, 30, '{}'
),

(
    'Company MVP', 
    'Achieve highest overall points for a quarter', 
    (SELECT id FROM public.badge_categories WHERE name = 'Excellence'),
    '👑', '#FFD700', '#FFFDE7',
    'legendary', 'special', 1, '{"type": "company_mvp"}',
    true, true, 1, 500, 10, 90, '{}'
);

-- =============================================================================
-- SECTION 3: ENHANCED SYSTEM SETTINGS
-- =============================================================================

-- Additional system settings beyond what's in the schema
INSERT INTO public.system_settings (
    setting_key, setting_value, default_value, description, category, 
    data_type, validation_rules, is_public, requires_restart
) VALUES

-- Advanced Points Settings
('birthday_bonus_points', '50', '50', 'Bonus points awarded on employee birthday', 'points', 'integer', '{"min": 0, "max": 200}', true, false),
('anniversary_bonus_points', '100', '100', 'Bonus points for work anniversary', 'points', 'integer', '{"min": 0, "max": 500}', true, false),
('referral_bonus_points', '200', '200', 'Points for successful employee referral', 'points', 'integer', '{"min": 0, "max": 1000}', true, false),
('perfect_week_bonus', '10', '10', 'Bonus points for perfect attendance week', 'points', 'integer', '{"min": 0, "max": 50}', true, false),
('comeback_bonus_points', '5', '5', 'Bonus points for returning after absence', 'points', 'integer', '{"min": 0, "max": 25}', true, false),

-- Gamification Settings
('max_daily_points', '10', '10', 'Maximum points earnable per day', 'points', 'integer', '{"min": 1, "max": 50}', true, false),
('point_expiry_months', '12', '12', 'Months before earned points expire', 'points', 'integer', '{"min": 6, "max": 60}', true, false),
('leaderboard_refresh_minutes', '15', '15', 'Minutes between leaderboard updates', 'general', 'integer', '{"min": 5, "max": 60}', false, false),
('badge_notification_delay_hours', '1', '1', 'Hours to wait before badge notifications', 'notifications', 'integer', '{"min": 0, "max": 24}', false, false),

-- Advanced Timing Settings
('early_bird_start', '05:30', '05:30', 'Earliest time for early bird bonus', 'timing', 'time', '{}', true, false),
('late_cutoff_time', '12:00', '12:00', 'Latest time for any check-in', 'timing', 'time', '{}', true, false),
('weekend_check_in_enabled', 'true', 'true', 'Allow weekend check-ins', 'timing', 'boolean', '{}', true, false),
('holiday_check_in_enabled', 'false', 'false', 'Allow holiday check-ins', 'timing', 'boolean', '{}', true, false),
('makeup_window_hours', '48', '48', 'Hours allowed for makeup check-ins', 'timing', 'integer', '{"min": 0, "max": 168}', true, false),

-- Social and Team Features
('team_challenges_enabled', 'true', 'true', 'Enable department team challenges', 'features', 'boolean', '{}', true, false),
('social_sharing_enabled', 'true', 'true', 'Allow sharing achievements on social media', 'features', 'boolean', '{}', true, false),
('peer_recognition_enabled', 'true', 'true', 'Allow peer-to-peer recognition', 'features', 'boolean', '{}', true, false),
('public_leaderboard_enabled', 'true', 'true', 'Show public leaderboards', 'features', 'boolean', '{}', true, false),

-- Notification Preferences
('achievement_email_enabled', 'true', 'true', 'Send email for new achievements', 'notifications', 'boolean', '{}', true, false),
('weekly_summary_enabled', 'true', 'true', 'Send weekly progress summaries', 'notifications', 'boolean', '{}', true, false),
('milestone_celebration_enabled', 'true', 'true', 'Celebrate major milestones publicly', 'notifications', 'boolean', '{}', true, false),
('reminder_frequency_days', '3', '3', 'Days between check-in reminders', 'notifications', 'integer', '{"min": 1, "max": 7}', true, false),

-- Advanced Security Settings
('ip_whitelist_enabled', 'false', 'false', 'Enable IP address whitelisting', 'security', 'boolean', '{}', false, true),
('device_registration_required', 'false', 'false', 'Require device registration for check-ins', 'security', 'boolean', '{}', false, false),
('location_verification_enabled', 'false', 'false', 'Require location verification', 'security', 'boolean', '{}', false, false),
('suspicious_activity_threshold', '5', '5', 'Failed attempts before security review', 'security', 'integer', '{"min": 3, "max": 20}', false, false),

-- Analytics and Reporting
('analytics_retention_days', '730', '730', 'Days to retain detailed analytics data', 'general', 'integer', '{"min": 90, "max": 2555}', false, false),
('performance_calculation_frequency', 'daily', 'daily', 'How often to recalculate performance metrics', 'general', 'string', '{}', false, false),
('engagement_score_weight_checkins', '0.4', '0.4', 'Weight of check-ins in engagement calculation', 'general', 'decimal', '{"min": 0.0, "max": 1.0}', false, false),
('engagement_score_weight_points', '0.3', '0.3', 'Weight of points in engagement calculation', 'general', 'decimal', '{"min": 0.0, "max": 1.0}', false, false),
('engagement_score_weight_social', '0.3', '0.3', 'Weight of social activity in engagement calculation', 'general', 'decimal', '{"min": 0.0, "max": 1.0}', false, false);

-- =============================================================================
-- SECTION 4: ENHANCED MOTIVATIONAL QUOTES
-- =============================================================================

-- Additional motivational quotes with rich categorization
INSERT INTO public.motivational_quotes (quote_text, author, category, tags, weight, is_featured) VALUES

-- Innovation and Creativity
('Innovation distinguishes between a leader and a follower.', 'Steve Jobs', 'innovation', '{"leadership", "creativity", "distinction"}', 2, true),
('The only way to make sense out of change is to plunge into it, move with it, and join the dance.', 'Alan Watts', 'innovation', '{"change", "adaptation", "growth"}', 1, false),
('Creativity is intelligence having fun.', 'Albert Einstein', 'innovation', '{"creativity", "intelligence", "fun"}', 2, false),
('Innovation is taking two things that exist and putting them together in a new way.', 'Tom Freston', 'innovation', '{"creativity", "combination", "newness"}', 1, false),

-- Leadership Excellence
('A leader is one who knows the way, goes the way, and shows the way.', 'John C. Maxwell', 'leadership', '{"guidance", "example", "direction"}', 2, true),
('The function of leadership is to produce more leaders, not more followers.', 'Ralph Nader', 'leadership', '{"development", "empowerment", "growth"}', 1, false),
('Leadership is not about being in charge. It is about taking care of those in your charge.', 'Simon Sinek', 'leadership', '{"care", "responsibility", "service"}', 2, false),
('The art of leadership is saying no, not saying yes. It is very easy to say yes.', 'Tony Blair', 'leadership', '{"decision_making", "priorities", "focus"}', 1, false),

-- Teamwork and Collaboration
('Alone we can do so little; together we can do so much.', 'Helen Keller', 'teamwork', '{"collaboration", "unity", "strength"}', 2, true),
('Coming together is a beginning, staying together is progress, working together is success.', 'Henry Ford', 'teamwork', '{"collaboration", "progress", "success"}', 2, true),
('Teamwork is the ability to work together toward a common vision.', 'Andrew Carnegie', 'teamwork', '{"vision", "collaboration", "unity"}', 1, false),
('Individual commitment to a group effort—that is what makes a team work.', 'Vince Lombardi', 'teamwork', '{"commitment", "effort", "dedication"}', 1, false),

-- Personal Growth and Success
('The only impossible journey is the one you never begin.', 'Tony Robbins', 'success', '{"journey", "beginning", "possibility"}', 2, false),
('Success is not the key to happiness. Happiness is the key to success.', 'Albert Schweitzer', 'success', '{"happiness", "fulfillment", "perspective"}', 2, true),
('Don''t be afraid to give up the good to go for the great.', 'John D. Rockefeller', 'success', '{"ambition", "courage", "excellence"}', 1, false),
('The future belongs to those who believe in the beauty of their dreams.', 'Eleanor Roosevelt', 'success', '{"dreams", "belief", "future"}', 1, false),

-- Motivation and Drive
('Your limitation—it''s only your imagination.', 'Unknown', 'motivation', '{"limitations", "imagination", "mindset"}', 2, false),
('Push yourself, because no one else is going to do it for you.', 'Unknown', 'motivation', '{"self_motivation", "personal_responsibility", "drive"}', 2, false),
('Great things never come from comfort zones.', 'Unknown', 'motivation', '{"comfort_zone", "growth", "challenge"}', 2, true),
('Dream it. Wish it. Do it.', 'Unknown', 'motivation', '{"dreams", "action", "achievement"}', 1, false),
('The harder you work for something, the greater you''ll feel when you achieve it.', 'Unknown', 'motivation', '{"hard_work", "achievement", "satisfaction"}', 1, false),

-- Excellence and Quality
('Excellence is not a skill, it''s an attitude.', 'Ralph Marston', 'general', '{"excellence", "attitude", "mindset"}', 2, false),
('Quality is not an act, it is a habit.', 'Aristotle', 'general', '{"quality", "habits", "consistency"}', 1, false),
('Strive not to be a success, but rather to be of value.', 'Albert Einstein', 'general', '{"value", "service", "purpose"}', 1, false),
('Excellence is never an accident. It is always the result of high intention, sincere effort, and intelligent execution.', 'Aristotle', 'general', '{"excellence", "intention", "effort"}', 2, true),

-- Daily Inspiration
('Today is a perfect day to start living your dreams.', 'Unknown', 'motivation', '{"today", "dreams", "beginning"}', 1, false),
('Every expert was once a beginner.', 'Unknown', 'motivation', '{"growth", "learning", "expertise"}', 1, false),
('The best time to plant a tree was 20 years ago. The second best time is now.', 'Chinese Proverb', 'motivation', '{"timing", "action", "opportunity"}', 2, false),
('You are never too old to set another goal or to dream a new dream.', 'C.S. Lewis', 'motivation', '{"age", "goals", "dreams"}', 1, false);

-- =============================================================================
-- SECTION 5: TEAMS AND ORGANIZATIONAL STRUCTURE
-- =============================================================================

-- Update existing teams with enhanced information
UPDATE public.teams SET 
    description = 'Central support team handling general operations and cross-departmental initiatives',
    team_color = '#607D8B',
    monthly_checkin_goal = 22,
    quarterly_points_goal = 600
WHERE name = 'General Team';

UPDATE public.teams SET 
    description = 'Senior leadership team focused on strategic planning and organizational growth',
    team_color = '#795548',
    monthly_checkin_goal = 20,
    quarterly_points_goal = 550
WHERE name = 'Management Team';

UPDATE public.teams SET 
    description = 'Technology infrastructure and digital transformation specialists',
    team_color = '#3F51B5',
    monthly_checkin_goal = 21,
    quarterly_points_goal = 580
WHERE name = 'IT Team';

UPDATE public.teams SET 
    description = 'Human resources and employee experience champions',
    team_color = '#E91E63',
    monthly_checkin_goal = 20,
    quarterly_points_goal = 500
WHERE name = 'HR Team';

UPDATE public.teams SET 
    description = 'Revenue generation and client relationship management',
    team_color = '#4CAF50',
    monthly_checkin_goal = 25,
    quarterly_points_goal = 750
WHERE name = 'Sales Team';

UPDATE public.teams SET 
    description = 'Operational excellence and process optimization',
    team_color = '#FF9800',
    monthly_checkin_goal = 23,
    quarterly_points_goal = 650
WHERE name = 'Operations Team';

-- Add additional specialized teams
INSERT INTO public.teams (name, description, department, team_color, monthly_checkin_goal, quarterly_points_goal) VALUES
('Customer Success', 'Client satisfaction and retention specialists', 'Customer Success', '#00BCD4', 24, 700),
('Marketing', 'Brand development and market engagement team', 'Marketing', '#9C27B0', 22, 600),
('Finance', 'Financial planning and analysis experts', 'Finance', '#FF5722', 20, 550),
('Research & Development', 'Innovation and product development team', 'R&D', '#2196F3', 21, 580),
('Quality Assurance', 'Excellence in product and service delivery', 'QA', '#8BC34A', 23, 630),
('Training & Development', 'Employee growth and skill development', 'Training', '#FFC107', 20, 500);

-- =============================================================================
-- SECTION 6: SAMPLE NOTIFICATIONS AND ALERTS
-- =============================================================================

-- System-wide welcome notification
INSERT INTO public.notifications (
    title, message, notification_type, priority, send_in_app, send_email,
    action_url, action_label, icon, scheduled_for
) VALUES (
    'Welcome to the Enhanced Rewards System!',
    'We''ve upgraded our employee rewards system with new features including advanced badges, team challenges, and enhanced rewards catalog. Explore the new features and start earning!',
    'info', 'normal', true, true,
    '/dashboard', 'Explore Features', '🎉',
    timezone('utc'::text, now())
);

-- Achievement system announcement
INSERT INTO public.notifications (
    title, message, notification_type, priority, send_in_app, 
    action_url, action_label, icon, scheduled_for
) VALUES (
    'New Achievement System Available!',
    'Discover our new progressive badge system with over 25 unique achievements to unlock. From Bronze to Legendary - how far can you go?',
    'achievement', 'normal', true,
    '/badges', 'View Badges', '🏆',
    timezone('utc'::text, now()) + INTERVAL '1 hour'
);

-- Wellness program notification
INSERT INTO public.notifications (
    title, message, notification_type, priority, send_in_app,
    role_filter, action_url, action_label, icon, scheduled_for
) VALUES (
    'New Wellness Rewards Available',
    'Check out our expanded wellness rewards including gym memberships, massage therapy, and ergonomic workspace upgrades. Invest in your health and productivity!',
    'info', 'normal', true,
    '{"employee", "manager"}', '/rewards?category=wellness', 'Browse Wellness', '💪',
    timezone('utc'::text, now()) + INTERVAL '2 hours'
);

-- =============================================================================
-- SECTION 7: SAMPLE ANALYTICS EVENTS
-- =============================================================================

-- Insert sample analytics events for testing and demonstration
INSERT INTO public.analytics_events (
    event_type, event_category, event_name, event_data, event_value,
    user_agent, device_type, event_timestamp
) VALUES
('system_upgrade', 'system_event', 'schema_v2_deployment', 
 '{"version": "2.0", "features": ["advanced_badges", "enhanced_rewards", "analytics"], "migration_success": true}', 
 0, 'System/1.0', 'unknown', timezone('utc'::text, now())),

('feature_announcement', 'admin_action', 'new_features_announced',
 '{"features": ["badge_system", "team_challenges", "wellness_rewards"], "notification_sent": true}',
 0, 'Admin-Panel/2.0', 'desktop', timezone('utc'::text, now())),

('catalog_update', 'system_event', 'rewards_catalog_enhanced',
 '{"new_rewards_count": 25, "categories_added": 8, "total_active_rewards": 35}',
 25, 'System/1.0', 'unknown', timezone('utc'::text, now()));

-- =============================================================================
-- SECTION 8: SAMPLE PERFORMANCE METRICS
-- =============================================================================

-- Insert baseline performance metrics
INSERT INTO public.performance_metrics (
    metric_name, metric_category, metric_value, metric_unit,
    dimension_data, period_start, period_end, aggregation_level
) VALUES
('system_readiness_score', 'performance', 98.5, 'percentage',
 '{"component": "database", "version": "2.0"}',
 CURRENT_DATE, CURRENT_DATE, 'daily'),

('feature_adoption_rate', 'engagement', 0.0, 'percentage',
 '{"feature": "advanced_badges", "rollout": "initial"}',
 CURRENT_DATE, CURRENT_DATE, 'daily'),

('rewards_catalog_completeness', 'business', 100.0, 'percentage',
 '{"categories": 8, "total_rewards": 35}',
 CURRENT_DATE, CURRENT_DATE, 'daily'),

('user_onboarding_completion', 'engagement', 0.0, 'percentage',
 '{"system_version": "2.0", "enhanced_features": true}',
 CURRENT_DATE, CURRENT_DATE, 'daily');

-- =============================================================================
-- FINAL VERIFICATION AND NOTES
-- =============================================================================

-- Verify all categories have rewards
SELECT 
    rc.name as category_name,
    COUNT(r.id) as reward_count,
    COUNT(r.id) FILTER (WHERE r.is_active = true) as active_rewards
FROM public.reward_categories rc
LEFT JOIN public.rewards r ON rc.id = r.category_id
GROUP BY rc.id, rc.name
ORDER BY rc.display_order;

-- Verify badge progression makes sense
SELECT 
    bc.name as category_name,
    COUNT(b.id) as badge_count,
    COUNT(b.id) FILTER (WHERE b.rarity = 'common') as common_badges,
    COUNT(b.id) FILTER (WHERE b.rarity = 'legendary') as legendary_badges
FROM public.badge_categories bc
LEFT JOIN public.badges b ON bc.id = b.category_id
GROUP BY bc.id, bc.name
ORDER BY bc.display_order;

-- =============================================================================
-- DEPLOYMENT NOTES
-- =============================================================================

/*
DEPLOYMENT CHECKLIST:
□ 1. Backup existing database before applying schema changes
□ 2. Run schema V2.0 first, then this seed data
□ 3. Verify all foreign key relationships are intact
□ 4. Test sample queries on views to ensure performance
□ 5. Update application code to utilize new features
□ 6. Monitor system performance after deployment
□ 7. Train admin users on new features and capabilities
□ 8. Announce new features to employees with proper onboarding

MONITORING RECOMMENDATIONS:
- Monitor engagement metrics for adoption of new features
- Track badge earning patterns to ensure proper difficulty balance
- Review redemption patterns for new reward categories
- Monitor system performance with increased data volume
- Track notification delivery rates and user engagement

FUTURE ENHANCEMENTS:
- Add machine learning for personalized reward recommendations
- Implement advanced team challenge mechanics
- Add integration with external wellness platforms
- Expand social features with peer recognition
- Add mobile app push notification support
- Implement advanced analytics dashboard for admins
*/

-- =============================================================================
-- END OF SEED DATA
-- =============================================================================