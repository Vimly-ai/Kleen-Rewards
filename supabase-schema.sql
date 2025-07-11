-- Supabase Database Schema for Employee Rewards System
-- Run these commands in the Supabase SQL Editor

-- Create employees table (users synced from Clerk)
CREATE TABLE IF NOT EXISTS public.employees (
    id text PRIMARY KEY, -- Clerk user ID
    email text UNIQUE NOT NULL,
    name text NOT NULL,
    first_name text,
    last_name text,
    employee_id text UNIQUE NOT NULL,
    department text DEFAULT 'General',
    hire_date date NOT NULL,
    role text CHECK (role IN ('employee', 'admin')) DEFAULT 'employee',
    status text CHECK (status IN ('active', 'inactive', 'pending')) DEFAULT 'active',
    points_balance integer DEFAULT 0,
    total_points_earned integer DEFAULT 0,
    current_streak integer DEFAULT 0,
    longest_streak integer DEFAULT 0,
    last_check_in timestamp with time zone,
    phone text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create check_ins table
CREATE TABLE IF NOT EXISTS public.check_ins (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
    check_in_time timestamp with time zone NOT NULL,
    points_earned integer NOT NULL,
    check_in_type text CHECK (check_in_type IN ('early', 'ontime', 'late')) NOT NULL,
    location text,
    streak_day integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create rewards table
CREATE TABLE IF NOT EXISTS public.rewards (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text NOT NULL,
    category text CHECK (category IN ('weekly', 'monthly', 'quarterly', 'annual', 'special')) NOT NULL,
    availability text CHECK (availability IN ('available', 'unavailable')) DEFAULT 'available',
    points_cost integer NOT NULL,
    quantity_available integer DEFAULT -1, -- -1 means unlimited
    is_active boolean DEFAULT true,
    image_url text,
    terms text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create redemptions table
CREATE TABLE IF NOT EXISTS public.redemptions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
    reward_id uuid REFERENCES public.rewards(id) ON DELETE CASCADE NOT NULL,
    points_spent integer NOT NULL,
    status text CHECK (status IN ('pending', 'approved', 'rejected', 'fulfilled')) DEFAULT 'pending',
    requested_date timestamp with time zone NOT NULL,
    processed_date timestamp with time zone,
    processed_by text REFERENCES public.employees(id),
    rejection_reason text,
    fulfillment_notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create badges table
CREATE TABLE IF NOT EXISTS public.badges (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text NOT NULL,
    icon text NOT NULL, -- emoji or icon class
    criteria_type text CHECK (criteria_type IN ('streak', 'points', 'checkins', 'special')) NOT NULL,
    criteria_value integer NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS public.user_badges (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
    badge_id uuid REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
    earned_date timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, badge_id) -- Prevent duplicate badges
);

-- Create motivational_quotes table
CREATE TABLE IF NOT EXISTS public.motivational_quotes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    quote_text text NOT NULL,
    author text,
    category text CHECK (category IN ('motivation', 'success', 'teamwork', 'general')) DEFAULT 'general',
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create system_settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key text UNIQUE NOT NULL,
    setting_value text NOT NULL,
    description text NOT NULL,
    category text CHECK (category IN ('points', 'timing', 'general', 'company')) DEFAULT 'general',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create point_transactions table
CREATE TABLE IF NOT EXISTS public.point_transactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
    transaction_type text CHECK (transaction_type IN ('earned', 'spent', 'adjusted', 'refunded')) NOT NULL,
    points_amount integer NOT NULL, -- can be negative
    reference_type text CHECK (reference_type IN ('checkin', 'redemption', 'admin_adjustment', 'bonus')) NOT NULL,
    reference_id text NOT NULL, -- ID of related record
    description text NOT NULL,
    created_by text REFERENCES public.employees(id), -- for admin adjustments
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON public.check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_date ON public.check_ins(check_in_time);
CREATE INDEX IF NOT EXISTS idx_redemptions_user_id ON public.redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_status ON public.redemptions(status);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_user_id ON public.point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_role ON public.employees(role);
CREATE INDEX IF NOT EXISTS idx_employees_points ON public.employees(points_balance);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_check_ins_updated_at BEFORE UPDATE ON public.check_ins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON public.rewards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_redemptions_updated_at BEFORE UPDATE ON public.redemptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_badges_updated_at BEFORE UPDATE ON public.badges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_motivational_quotes_updated_at BEFORE UPDATE ON public.motivational_quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_point_transactions_updated_at BEFORE UPDATE ON public.point_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security on all tables
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motivational_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (for now, allow all authenticated users)
-- In production, you'd want more restrictive policies

-- Employees policies
CREATE POLICY "Allow authenticated users to view employees" ON public.employees FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow users to update their own record" ON public.employees FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow users to insert their own record" ON public.employees FOR INSERT TO authenticated WITH CHECK (true);

-- Check-ins policies
CREATE POLICY "Allow authenticated users to view check-ins" ON public.check_ins FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow users to insert check-ins" ON public.check_ins FOR INSERT TO authenticated WITH CHECK (true);

-- Rewards policies
CREATE POLICY "Allow authenticated users to view rewards" ON public.rewards FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow admins to manage rewards" ON public.rewards FOR ALL TO authenticated USING (true);

-- Redemptions policies
CREATE POLICY "Allow authenticated users to view redemptions" ON public.redemptions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow users to create redemptions" ON public.redemptions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow admins to update redemptions" ON public.redemptions FOR UPDATE TO authenticated USING (true);

-- Badges policies
CREATE POLICY "Allow authenticated users to view badges" ON public.badges FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to view user badges" ON public.user_badges FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow system to award badges" ON public.user_badges FOR INSERT TO authenticated WITH CHECK (true);

-- Motivational quotes policies
CREATE POLICY "Allow authenticated users to view quotes" ON public.motivational_quotes FOR SELECT TO authenticated USING (true);

-- System settings policies
CREATE POLICY "Allow authenticated users to view settings" ON public.system_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow admins to manage settings" ON public.system_settings FOR ALL TO authenticated USING (true);

-- Point transactions policies
CREATE POLICY "Allow authenticated users to view point transactions" ON public.point_transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow system to create point transactions" ON public.point_transactions FOR INSERT TO authenticated WITH CHECK (true);