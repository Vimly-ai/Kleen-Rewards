-- Supabase Seed Data for Employee Rewards System
-- Run this after the schema is created

-- Insert initial rewards
INSERT INTO public.rewards (name, description, category, points_cost, quantity_available, is_active, terms) VALUES
('Coffee Gift Card', '$10 Starbucks gift card - fuel your day!', 'weekly', 50, -1, true, 'Valid at any Starbucks location. Digital delivery via email.'),
('Premium Parking Spot', 'Reserved parking spot for one week', 'weekly', 75, 5, true, 'Valid for one week from approval date. Spot assignment based on availability.'),
('Work From Home Day', 'One additional work from home day', 'weekly', 80, -1, true, 'Subject to manager approval and business needs. Must be used within 30 days.'),
('Extra PTO Day', 'One additional paid time off day', 'monthly', 100, -1, true, 'Must be approved by manager. Can be used within 90 days of redemption.'),
('Team Lunch', 'Catered lunch for your team (up to 8 people)', 'monthly', 150, 2, true, 'Includes lunch for up to 8 team members. Must coordinate with admin for scheduling.'),
('Half Day Off', 'Leave 4 hours early or come in 4 hours late', 'monthly', 120, -1, true, 'Subject to manager approval. Must be used within 60 days.'),
('Quarterly Recognition Award', '$100 Amazon gift card + certificate', 'quarterly', 250, 3, true, 'Includes printed certificate and digital gift card delivery.'),
('Professional Development Budget', '$200 towards courses, books, or conferences', 'quarterly', 300, 5, true, 'Must be pre-approved by manager. Receipts required for reimbursement.'),
('Annual Bonus Day', 'One full paid day off for personal use', 'annual', 500, -1, true, 'Can be used any time within the year. Manager approval required.'),
('Employee of the Year Package', '$500 gift card + reserved parking for 3 months', 'annual', 800, 1, true, 'Includes $500 Amazon gift card and premium parking spot for 3 months.');

-- Insert initial badges
INSERT INTO public.badges (name, description, icon, criteria_type, criteria_value, is_active) VALUES
('Welcome Aboard', 'Complete your first check-in', '🎉', 'checkins', 1, true),
('Early Bird', 'Check in early for 5 consecutive days', '🌅', 'streak', 5, true),
('Consistency Champion', 'Maintain a 10-day check-in streak', '🏆', 'streak', 10, true),
('Dedication Master', 'Achieve a 30-day check-in streak', '💎', 'streak', 30, true),
('Point Collector', 'Earn your first 100 points', '🎯', 'points', 100, true),
('Rising Star', 'Earn 500 total points', '⭐', 'points', 500, true),
('Team Player', 'Complete 50 check-ins', '🤝', 'checkins', 50, true),
('Company Legend', 'Complete 200 check-ins', '👑', 'checkins', 200, true);

-- Insert motivational quotes
INSERT INTO public.motivational_quotes (quote_text, author, category, is_active) VALUES
('Success is not final, failure is not fatal: it is the courage to continue that counts.', 'Winston Churchill', 'motivation', true),
('The way to get started is to quit talking and begin doing.', 'Walt Disney', 'motivation', true),
('Innovation distinguishes between a leader and a follower.', 'Steve Jobs', 'success', true),
('Teamwork makes the dream work.', 'John C. Maxwell', 'teamwork', true),
('Excellence is not a skill, it''s an attitude.', 'Ralph Marston', 'general', true),
('The only way to do great work is to love what you do.', 'Steve Jobs', 'motivation', true),
('Coming together is a beginning, staying together is progress, working together is success.', 'Henry Ford', 'teamwork', true),
('Your limitation—it''s only your imagination.', 'Unknown', 'motivation', true),
('Push yourself, because no one else is going to do it for you.', 'Unknown', 'motivation', true),
('Great things never come from comfort zones.', 'Unknown', 'success', true);

-- Insert system settings
INSERT INTO public.system_settings (setting_key, setting_value, description, category) VALUES
('early_checkin_points', '2', 'Points awarded for early check-in (6:00-7:00 AM)', 'points'),
('ontime_checkin_points', '1', 'Points awarded for on-time check-in (7:00-9:00 AM)', 'points'),
('late_checkin_points', '0', 'Points awarded for late check-in (after 9:00 AM)', 'points'),
('checkin_window_start', '06:00', 'Daily check-in window start time', 'timing'),
('checkin_window_end', '09:00', 'Daily check-in window end time', 'timing'),
('company_name', 'System Kleen', 'Company name displayed in the app', 'company'),
('timezone', 'America/Denver', 'Company timezone (MST)', 'timing'),
('streak_reset_grace_days', '1', 'Days of grace before streak resets', 'general');

-- Note: Employee data will be automatically created when users log in via Clerk