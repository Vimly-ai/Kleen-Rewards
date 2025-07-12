-- =============================================================================
-- ENTERPRISE EMPLOYEE REWARDS SYSTEM - DATABASE SCHEMA V2.0
-- =============================================================================
-- 
-- This comprehensive schema extends the existing Employee Rewards system with:
-- • Advanced Achievement System with progress tracking
-- • Enhanced Rewards Catalog with categories and inventory management
-- • Extended User Profiles with avatars and preferences
-- • Comprehensive Analytics and Event Logging
-- • Advanced Admin Features with notifications and alerts
-- • Performance-optimized indexes and constraints
-- • Enterprise-ready scalability features
--
-- IMPORTANT: This schema is designed to be backward compatible with existing data
-- =============================================================================

-- =============================================================================
-- SECTION 1: CORE TABLES (Enhanced from existing schema)
-- =============================================================================

-- Enhanced employees table with extended profile features
CREATE TABLE IF NOT EXISTS public.employees (
    -- Core identification
    id text PRIMARY KEY, -- Clerk user ID
    email text UNIQUE NOT NULL,
    employee_id text UNIQUE NOT NULL,
    
    -- Personal information
    name text NOT NULL,
    first_name text,
    last_name text,
    display_name text, -- Preferred display name
    avatar_url text, -- Profile picture URL
    phone text,
    
    -- Employment details
    department text DEFAULT 'General',
    job_title text,
    manager_id text REFERENCES public.employees(id), -- Self-referencing for hierarchy
    hire_date date NOT NULL,
    employment_status text CHECK (employment_status IN ('active', 'inactive', 'terminated', 'on_leave')) DEFAULT 'active',
    
    -- System role and permissions
    role text CHECK (role IN ('employee', 'manager', 'admin', 'super_admin')) DEFAULT 'employee',
    permissions jsonb DEFAULT '[]'::jsonb, -- Array of permission strings
    
    -- Points and gamification
    points_balance integer DEFAULT 0,
    total_points_earned integer DEFAULT 0,
    total_points_spent integer DEFAULT 0,
    lifetime_points integer DEFAULT 0, -- Never decreases, includes spent points
    
    -- Streak tracking
    current_streak integer DEFAULT 0,
    longest_streak integer DEFAULT 0,
    last_check_in timestamp with time zone,
    streak_freeze_count integer DEFAULT 0, -- Number of streak freezes available
    
    -- User preferences and settings
    preferences jsonb DEFAULT '{
        "notifications": {
            "email": true,
            "push": true,
            "daily_reminders": true,
            "achievement_alerts": true
        },
        "privacy": {
            "show_on_leaderboard": true,
            "profile_visibility": "public"
        },
        "display": {
            "timezone": "America/Denver",
            "language": "en"
        }
    }'::jsonb,
    
    -- Analytics and engagement
    total_logins integer DEFAULT 0,
    last_login timestamp with time zone,
    onboarding_completed boolean DEFAULT false,
    onboarding_step integer DEFAULT 0,
    engagement_score numeric(5,2) DEFAULT 0.00, -- Calculated engagement metric
    
    -- Metadata
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_activity timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enhanced check_ins table with additional tracking
CREATE TABLE IF NOT EXISTS public.check_ins (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
    
    -- Check-in details
    check_in_time timestamp with time zone NOT NULL,
    check_in_date date GENERATED ALWAYS AS (check_in_time::date) STORED, -- For easier querying
    points_earned integer NOT NULL,
    check_in_type text CHECK (check_in_type IN ('early', 'ontime', 'late', 'makeup')) NOT NULL,
    
    -- Location and device tracking
    location_name text,
    coordinates point, -- Geographic coordinates if available
    device_info jsonb, -- Device/browser information
    ip_address inet, -- For security auditing
    
    -- Streak and bonus information
    streak_day integer DEFAULT 1,
    bonus_multiplier numeric(3,2) DEFAULT 1.00, -- For special events or promotions
    is_streak_freeze boolean DEFAULT false, -- If user used a streak freeze
    
    -- Verification and validation
    verification_method text CHECK (verification_method IN ('qr_code', 'geofence', 'manual', 'api')) DEFAULT 'qr_code',
    verification_data jsonb, -- Additional verification metadata
    is_verified boolean DEFAULT true,
    verified_by text REFERENCES public.employees(id), -- Admin who verified if manual
    
    -- Weather and external factors (for analytics)
    weather_conditions jsonb, -- Weather data at time of check-in
    
    -- Metadata
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================================================
-- SECTION 2: ENHANCED REWARDS SYSTEM
-- =============================================================================

-- Reward categories table for better organization
CREATE TABLE IF NOT EXISTS public.reward_categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text UNIQUE NOT NULL,
    description text,
    display_order integer DEFAULT 0,
    icon text, -- Icon class or emoji
    color_theme text, -- Hex color for UI theming
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enhanced rewards table with comprehensive features
CREATE TABLE IF NOT EXISTS public.rewards (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Basic information
    name text NOT NULL,
    description text NOT NULL,
    long_description text, -- Detailed description for reward details page
    
    -- Categorization
    category_id uuid REFERENCES public.reward_categories(id),
    legacy_category text CHECK (legacy_category IN ('weekly', 'monthly', 'quarterly', 'annual', 'special')), -- For backward compatibility
    tags text[] DEFAULT '{}', -- Searchable tags
    
    -- Pricing and availability
    points_cost integer NOT NULL,
    original_price numeric(10,2), -- Real-world value for reference
    discount_percentage integer DEFAULT 0, -- For promotional pricing
    
    -- Inventory management
    quantity_available integer DEFAULT -1, -- -1 means unlimited
    quantity_redeemed integer DEFAULT 0,
    max_per_user integer DEFAULT -1, -- Maximum redemptions per user (-1 = unlimited)
    max_per_month integer DEFAULT -1, -- Maximum redemptions per month across all users
    
    -- Availability scheduling
    availability_start timestamp with time zone,
    availability_end timestamp with time zone,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false, -- For highlighting special rewards
    priority_level integer DEFAULT 0, -- For sorting/display order
    
    -- Media and presentation
    image_url text,
    gallery_images text[] DEFAULT '{}', -- Multiple images
    video_url text, -- Promotional video
    
    -- Terms and conditions
    terms text,
    fine_print text,
    expiry_days integer DEFAULT 90, -- Days until reward expires after redemption
    
    -- Eligibility requirements
    min_employment_days integer DEFAULT 0, -- Minimum days of employment required
    required_role text[], -- Roles that can redeem this reward
    required_department text[], -- Departments that can redeem
    min_points_lifetime integer DEFAULT 0, -- Minimum lifetime points required
    
    -- Analytics and tracking
    view_count integer DEFAULT 0,
    redemption_count integer DEFAULT 0,
    wishlist_count integer DEFAULT 0,
    rating_average numeric(3,2) DEFAULT 0.00,
    rating_count integer DEFAULT 0,
    
    -- Metadata
    created_by text REFERENCES public.employees(id),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enhanced redemptions table with workflow management
CREATE TABLE IF NOT EXISTS public.redemptions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
    reward_id uuid REFERENCES public.rewards(id) ON DELETE CASCADE NOT NULL,
    
    -- Transaction details
    points_spent integer NOT NULL,
    original_points_cost integer NOT NULL, -- In case reward price changes
    discount_applied numeric(5,2) DEFAULT 0.00,
    
    -- Status and workflow
    status text CHECK (status IN ('pending', 'approved', 'rejected', 'fulfilled', 'expired', 'cancelled')) DEFAULT 'pending',
    priority text CHECK (priority IN ('low', 'normal', 'high', 'urgent')) DEFAULT 'normal',
    
    -- Dates and timing
    requested_date timestamp with time zone NOT NULL,
    approved_date timestamp with time zone,
    fulfilled_date timestamp with time zone,
    expires_at timestamp with time zone, -- When the redemption expires
    
    -- Processing information
    processed_by text REFERENCES public.employees(id),
    fulfillment_method text CHECK (fulfillment_method IN ('email', 'physical_pickup', 'mail', 'digital', 'automatic')),
    fulfillment_details jsonb, -- Tracking numbers, pickup location, etc.
    
    -- Communication and notes
    user_notes text, -- User's notes/special requests
    admin_notes text, -- Internal admin notes
    rejection_reason text,
    fulfillment_notes text,
    
    -- Delivery information
    delivery_address jsonb, -- Shipping address if needed
    delivery_status text CHECK (delivery_status IN ('pending', 'shipped', 'delivered', 'failed')),
    tracking_number text,
    
    -- User feedback
    user_rating integer CHECK (user_rating >= 1 AND user_rating <= 5),
    user_feedback text,
    feedback_date timestamp with time zone,
    
    -- Metadata
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================================================
-- SECTION 3: ADVANCED ACHIEVEMENT SYSTEM
-- =============================================================================

-- Badge categories for better organization
CREATE TABLE IF NOT EXISTS public.badge_categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text UNIQUE NOT NULL,
    description text,
    display_order integer DEFAULT 0,
    color_theme text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enhanced badges table with comprehensive achievement system
CREATE TABLE IF NOT EXISTS public.badges (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Basic information
    name text NOT NULL,
    description text NOT NULL,
    category_id uuid REFERENCES public.badge_categories(id),
    
    -- Visual representation
    icon text NOT NULL, -- emoji or icon class
    icon_color text DEFAULT '#FFD700', -- Hex color for the icon
    background_color text DEFAULT '#FFFFFF',
    rarity text CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')) DEFAULT 'common',
    
    -- Achievement criteria
    criteria_type text CHECK (criteria_type IN ('streak', 'points', 'checkins', 'special', 'composite', 'manual')) NOT NULL,
    criteria_value integer NOT NULL,
    criteria_config jsonb DEFAULT '{}'::jsonb, -- Complex criteria configuration
    
    -- Badge properties
    is_secret boolean DEFAULT false, -- Hidden until unlocked
    is_repeatable boolean DEFAULT false, -- Can be earned multiple times
    max_level integer DEFAULT 1, -- For leveled badges (Bronze, Silver, Gold)
    points_reward integer DEFAULT 0, -- Bonus points for earning the badge
    
    -- Availability and timing
    is_active boolean DEFAULT true,
    is_limited_time boolean DEFAULT false,
    available_from timestamp with time zone,
    available_until timestamp with time zone,
    
    -- Gamification
    difficulty_level integer DEFAULT 1 CHECK (difficulty_level >= 1 AND difficulty_level <= 10),
    estimated_time_days integer, -- Estimated days to earn
    prerequisite_badges uuid[], -- Badges required before this can be earned
    
    -- Analytics
    earned_count integer DEFAULT 0,
    
    -- Metadata
    created_by text REFERENCES public.employees(id),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enhanced user_badges table with progress tracking
CREATE TABLE IF NOT EXISTS public.user_badges (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
    badge_id uuid REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
    
    -- Achievement details
    earned_date timestamp with time zone NOT NULL,
    current_level integer DEFAULT 1,
    progress_value integer DEFAULT 0, -- Current progress toward criteria
    is_featured boolean DEFAULT false, -- User's featured badge
    
    -- Context and metadata
    earned_context jsonb, -- What triggered the badge earning
    notification_sent boolean DEFAULT false,
    
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Allow multiple badges if repeatable, otherwise enforce uniqueness
    UNIQUE(user_id, badge_id, current_level)
);

-- Progress tracking for achievements in progress
CREATE TABLE IF NOT EXISTS public.achievement_progress (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
    badge_id uuid REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
    
    -- Progress tracking
    current_progress integer DEFAULT 0,
    target_value integer NOT NULL,
    progress_percentage numeric(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN target_value > 0 THEN LEAST(100.00, (current_progress * 100.0 / target_value))
            ELSE 0.00 
        END
    ) STORED,
    
    -- Tracking metadata
    last_updated timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    progress_data jsonb DEFAULT '{}'::jsonb, -- Additional progress context
    
    UNIQUE(user_id, badge_id)
);

-- =============================================================================
-- SECTION 4: ANALYTICS AND EVENT LOGGING SYSTEM
-- =============================================================================

-- Comprehensive event logging for analytics
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Event identification
    event_type text NOT NULL, -- 'login', 'check_in', 'reward_view', 'redemption', etc.
    event_category text NOT NULL, -- 'user_action', 'system_event', 'admin_action'
    event_name text NOT NULL,
    
    -- Context
    user_id text REFERENCES public.employees(id) ON DELETE SET NULL,
    session_id text, -- Browser/app session identifier
    
    -- Event data
    event_data jsonb DEFAULT '{}'::jsonb, -- Flexible event properties
    event_value numeric(10,2), -- Numeric value (points, money, etc.)
    
    -- Technical context
    user_agent text,
    ip_address inet,
    referrer text,
    page_url text,
    device_type text CHECK (device_type IN ('desktop', 'mobile', 'tablet', 'unknown')),
    
    -- Timing
    event_timestamp timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    duration_seconds integer, -- How long the action took
    
    -- Metadata
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Performance metrics tracking
CREATE TABLE IF NOT EXISTS public.performance_metrics (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Metric identification
    metric_name text NOT NULL,
    metric_category text NOT NULL, -- 'engagement', 'performance', 'business'
    
    -- Values
    metric_value numeric(15,4) NOT NULL,
    metric_unit text, -- 'percentage', 'count', 'seconds', 'dollars'
    
    -- Dimensions
    dimension_data jsonb DEFAULT '{}'::jsonb, -- Grouping dimensions (department, role, etc.)
    
    -- Timing
    period_start timestamp with time zone NOT NULL,
    period_end timestamp with time zone NOT NULL,
    aggregation_level text CHECK (aggregation_level IN ('hourly', 'daily', 'weekly', 'monthly', 'yearly')) NOT NULL,
    
    -- Metadata
    calculated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Ensure uniqueness for metric/period combinations
    UNIQUE(metric_name, period_start, period_end, aggregation_level, dimension_data)
);

-- User engagement tracking
CREATE TABLE IF NOT EXISTS public.user_engagement_metrics (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
    
    -- Time period
    metric_date date NOT NULL,
    week_start_date date NOT NULL, -- Monday of the week
    month_start_date date NOT NULL, -- First day of the month
    
    -- Daily metrics
    daily_logins integer DEFAULT 0,
    daily_check_ins integer DEFAULT 0,
    daily_points_earned integer DEFAULT 0,
    daily_rewards_viewed integer DEFAULT 0,
    daily_time_spent_seconds integer DEFAULT 0,
    
    -- Weekly aggregates
    weekly_logins integer DEFAULT 0,
    weekly_check_ins integer DEFAULT 0,
    weekly_points_earned integer DEFAULT 0,
    weekly_engagement_score numeric(5,2) DEFAULT 0.00,
    
    -- Monthly aggregates
    monthly_logins integer DEFAULT 0,
    monthly_check_ins integer DEFAULT 0,
    monthly_points_earned integer DEFAULT 0,
    monthly_redemptions integer DEFAULT 0,
    
    -- Calculated fields
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    UNIQUE(user_id, metric_date)
);

-- =============================================================================
-- SECTION 5: ADMIN FEATURES AND NOTIFICATIONS
-- =============================================================================

-- System notifications and alerts
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Recipient targeting
    user_id text REFERENCES public.employees(id) ON DELETE CASCADE, -- NULL for system-wide
    role_filter text[], -- Roles that should see this notification
    department_filter text[], -- Departments that should see this
    
    -- Notification content
    title text NOT NULL,
    message text NOT NULL,
    notification_type text CHECK (notification_type IN ('info', 'success', 'warning', 'error', 'achievement', 'system')) NOT NULL,
    priority text CHECK (priority IN ('low', 'normal', 'high', 'urgent')) DEFAULT 'normal',
    
    -- Rich content
    action_url text, -- URL to navigate to when clicked
    action_label text, -- Button text for action
    icon text, -- Icon to display
    image_url text, -- Optional image
    
    -- Delivery channels
    send_email boolean DEFAULT false,
    send_push boolean DEFAULT true,
    send_in_app boolean DEFAULT true,
    
    -- Status tracking
    is_read boolean DEFAULT false,
    read_at timestamp with time zone,
    is_dismissed boolean DEFAULT false,
    dismissed_at timestamp with time zone,
    
    -- Scheduling
    scheduled_for timestamp with time zone DEFAULT timezone('utc'::text, now()),
    expires_at timestamp with time zone,
    
    -- Metadata
    created_by text REFERENCES public.employees(id),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- System alerts for administrators
CREATE TABLE IF NOT EXISTS public.system_alerts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Alert identification
    alert_type text CHECK (alert_type IN ('security', 'performance', 'error', 'business', 'maintenance')) NOT NULL,
    severity text CHECK (severity IN ('low', 'medium', 'high', 'critical')) NOT NULL,
    
    -- Alert content
    title text NOT NULL,
    description text NOT NULL,
    error_details jsonb, -- Technical details for debugging
    
    -- Context
    affected_users text[], -- Array of user IDs if specific users affected
    affected_system text, -- System component affected
    
    -- Status and resolution
    status text CHECK (status IN ('open', 'investigating', 'resolved', 'false_positive')) DEFAULT 'open',
    assigned_to text REFERENCES public.employees(id),
    resolution_notes text,
    resolved_at timestamp with time zone,
    
    -- Escalation
    escalation_level integer DEFAULT 1,
    last_escalated timestamp with time zone,
    
    -- Metadata
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enhanced system settings with categories and validation
CREATE TABLE IF NOT EXISTS public.system_settings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key text UNIQUE NOT NULL,
    setting_value text NOT NULL,
    default_value text NOT NULL,
    
    -- Metadata
    description text NOT NULL,
    category text CHECK (category IN ('points', 'timing', 'general', 'company', 'security', 'features', 'notifications')) DEFAULT 'general',
    
    -- Validation
    data_type text CHECK (data_type IN ('string', 'integer', 'decimal', 'boolean', 'json', 'time', 'date')) DEFAULT 'string',
    validation_rules jsonb DEFAULT '{}'::jsonb, -- Min/max values, regex patterns, etc.
    
    -- Access control
    is_public boolean DEFAULT false, -- Can non-admins read this setting?
    requires_restart boolean DEFAULT false, -- Does changing this require system restart?
    
    -- Change tracking
    last_changed_by text REFERENCES public.employees(id),
    change_reason text,
    
    -- Metadata
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Audit log for tracking all system changes
CREATE TABLE IF NOT EXISTS public.audit_log (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Action details
    action_type text NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout'
    table_name text, -- Table affected (if applicable)
    record_id text, -- ID of the affected record
    
    -- User context
    user_id text REFERENCES public.employees(id) ON DELETE SET NULL,
    user_role text,
    user_email text,
    
    -- Change details
    old_values jsonb, -- Previous values (for updates/deletes)
    new_values jsonb, -- New values (for creates/updates)
    changed_fields text[], -- List of fields that changed
    
    -- Request context
    ip_address inet,
    user_agent text,
    request_id text, -- For correlating related actions
    
    -- Metadata
    action_timestamp timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    additional_context jsonb DEFAULT '{}'::jsonb
);

-- =============================================================================
-- SECTION 6: ENHANCED FEATURES TABLES
-- =============================================================================

-- Motivational quotes with enhanced features
CREATE TABLE IF NOT EXISTS public.motivational_quotes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    quote_text text NOT NULL,
    author text,
    
    -- Categorization
    category text CHECK (category IN ('motivation', 'success', 'teamwork', 'general', 'leadership', 'innovation')) DEFAULT 'general',
    tags text[] DEFAULT '{}',
    
    -- Usage tracking
    display_count integer DEFAULT 0,
    last_displayed timestamp with time zone,
    user_ratings numeric(3,2) DEFAULT 0.00,
    rating_count integer DEFAULT 0,
    
    -- Scheduling
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    weight integer DEFAULT 1, -- For weighted random selection
    
    -- Source attribution
    source_book text,
    source_url text,
    copyright_info text,
    
    -- Metadata
    created_by text REFERENCES public.employees(id),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Point transactions with enhanced tracking
CREATE TABLE IF NOT EXISTS public.point_transactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
    
    -- Transaction details
    transaction_type text CHECK (transaction_type IN ('earned', 'spent', 'adjusted', 'refunded', 'expired', 'transferred')) NOT NULL,
    points_amount integer NOT NULL, -- can be negative
    running_balance integer NOT NULL, -- Balance after this transaction
    
    -- Reference information
    reference_type text CHECK (reference_type IN ('checkin', 'redemption', 'admin_adjustment', 'bonus', 'badge_reward', 'transfer', 'expiration')) NOT NULL,
    reference_id text NOT NULL, -- ID of related record
    
    -- Additional context
    description text NOT NULL,
    admin_notes text, -- For manual adjustments
    
    -- Transfer details (if applicable)
    transfer_from_user text REFERENCES public.employees(id), -- For point transfers
    transfer_to_user text REFERENCES public.employees(id),
    
    -- Processing information
    created_by text REFERENCES public.employees(id), -- for admin adjustments
    approved_by text REFERENCES public.employees(id), -- for approvals
    
    -- Status (for pending transactions)
    status text CHECK (status IN ('completed', 'pending', 'cancelled', 'failed')) DEFAULT 'completed',
    
    -- Expiration (for earned points)
    expires_at timestamp with time zone,
    
    -- Metadata
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User wishlist for tracking desired rewards
CREATE TABLE IF NOT EXISTS public.user_wishlists (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
    reward_id uuid REFERENCES public.rewards(id) ON DELETE CASCADE NOT NULL,
    
    -- Priority and notes
    priority integer DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
    user_notes text,
    
    -- Tracking
    added_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    notification_sent boolean DEFAULT false, -- If user was notified when they can afford it
    
    UNIQUE(user_id, reward_id)
);

-- Team management for department-based features
CREATE TABLE IF NOT EXISTS public.teams (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text UNIQUE NOT NULL,
    description text,
    
    -- Team properties
    department text NOT NULL,
    team_lead_id text REFERENCES public.employees(id),
    team_color text DEFAULT '#3B82F6', -- Hex color for team theming
    team_logo_url text,
    
    -- Goals and metrics
    monthly_checkin_goal integer DEFAULT 20,
    quarterly_points_goal integer DEFAULT 1000,
    
    -- Status
    is_active boolean DEFAULT true,
    
    -- Metadata
    created_by text REFERENCES public.employees(id),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Team membership tracking
CREATE TABLE IF NOT EXISTS public.team_members (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id uuid REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
    user_id text REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
    
    -- Membership details
    role text CHECK (role IN ('member', 'lead', 'admin')) DEFAULT 'member',
    joined_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    left_date timestamp with time zone,
    
    -- Status
    is_active boolean DEFAULT true,
    
    UNIQUE(team_id, user_id, is_active) -- Prevent duplicate active memberships
);

-- =============================================================================
-- SECTION 7: PERFORMANCE INDEXES
-- =============================================================================

-- Indexes for employees table
CREATE INDEX IF NOT EXISTS idx_employees_email ON public.employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_employee_id ON public.employees(employee_id);
CREATE INDEX IF NOT EXISTS idx_employees_department ON public.employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_role ON public.employees(role);
CREATE INDEX IF NOT EXISTS idx_employees_status ON public.employees(employment_status);
CREATE INDEX IF NOT EXISTS idx_employees_points_balance ON public.employees(points_balance DESC);
CREATE INDEX IF NOT EXISTS idx_employees_total_points ON public.employees(total_points_earned DESC);
CREATE INDEX IF NOT EXISTS idx_employees_current_streak ON public.employees(current_streak DESC);
CREATE INDEX IF NOT EXISTS idx_employees_last_check_in ON public.employees(last_check_in);
CREATE INDEX IF NOT EXISTS idx_employees_manager ON public.employees(manager_id);
CREATE INDEX IF NOT EXISTS idx_employees_engagement ON public.employees(engagement_score DESC);

-- Indexes for check_ins table
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON public.check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_date ON public.check_ins(check_in_time);
CREATE INDEX IF NOT EXISTS idx_check_ins_date_only ON public.check_ins(check_in_date);
CREATE INDEX IF NOT EXISTS idx_check_ins_type ON public.check_ins(check_in_type);
CREATE INDEX IF NOT EXISTS idx_check_ins_user_date ON public.check_ins(user_id, check_in_date);
CREATE INDEX IF NOT EXISTS idx_check_ins_verification ON public.check_ins(verification_method, is_verified);
CREATE INDEX IF NOT EXISTS idx_check_ins_location ON public.check_ins(location_name) WHERE location_name IS NOT NULL;

-- Indexes for rewards table
CREATE INDEX IF NOT EXISTS idx_rewards_category ON public.rewards(category_id);
CREATE INDEX IF NOT EXISTS idx_rewards_legacy_category ON public.rewards(legacy_category);
CREATE INDEX IF NOT EXISTS idx_rewards_active ON public.rewards(is_active, is_featured);
CREATE INDEX IF NOT EXISTS idx_rewards_points_cost ON public.rewards(points_cost);
CREATE INDEX IF NOT EXISTS idx_rewards_availability ON public.rewards(availability_start, availability_end) WHERE availability_start IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_rewards_priority ON public.rewards(priority_level DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rewards_rating ON public.rewards(rating_average DESC, rating_count DESC);
CREATE INDEX IF NOT EXISTS idx_rewards_tags ON public.rewards USING gin(tags);

-- Indexes for redemptions table
CREATE INDEX IF NOT EXISTS idx_redemptions_user_id ON public.redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_reward_id ON public.redemptions(reward_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_status ON public.redemptions(status);
CREATE INDEX IF NOT EXISTS idx_redemptions_date ON public.redemptions(requested_date);
CREATE INDEX IF NOT EXISTS idx_redemptions_expires ON public.redemptions(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_redemptions_user_status ON public.redemptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_redemptions_processed_by ON public.redemptions(processed_by) WHERE processed_by IS NOT NULL;

-- Indexes for badges and achievements
CREATE INDEX IF NOT EXISTS idx_badges_category ON public.badges(category_id);
CREATE INDEX IF NOT EXISTS idx_badges_criteria ON public.badges(criteria_type, criteria_value);
CREATE INDEX IF NOT EXISTS idx_badges_active ON public.badges(is_active, is_secret);
CREATE INDEX IF NOT EXISTS idx_badges_difficulty ON public.badges(difficulty_level, rarity);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON public.user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_earned_date ON public.user_badges(earned_date);
CREATE INDEX IF NOT EXISTS idx_user_badges_featured ON public.user_badges(user_id, is_featured);
CREATE INDEX IF NOT EXISTS idx_achievement_progress_user ON public.achievement_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_achievement_progress_badge ON public.achievement_progress(badge_id);
CREATE INDEX IF NOT EXISTS idx_achievement_progress_percentage ON public.achievement_progress(progress_percentage DESC);

-- Indexes for analytics and events
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type, event_category);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON public.analytics_events(user_id, event_timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON public.analytics_events(event_timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_data ON public.analytics_events USING gin(event_data);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_name ON public.performance_metrics(metric_name, period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_category ON public.performance_metrics(metric_category, calculated_at);
CREATE INDEX IF NOT EXISTS idx_engagement_metrics_user ON public.user_engagement_metrics(user_id, metric_date);
CREATE INDEX IF NOT EXISTS idx_engagement_metrics_date ON public.user_engagement_metrics(metric_date, weekly_engagement_score DESC);

-- Indexes for notifications and admin
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, scheduled_for);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(is_read, is_dismissed);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(notification_type, priority);
CREATE INDEX IF NOT EXISTS idx_system_alerts_status ON public.system_alerts(status, severity);
CREATE INDEX IF NOT EXISTS idx_system_alerts_type ON public.system_alerts(alert_type, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON public.audit_log(user_id, action_timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_log_table ON public.audit_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON public.audit_log(action_type, action_timestamp);

-- Indexes for point transactions
CREATE INDEX IF NOT EXISTS idx_point_transactions_user_id ON public.point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_type ON public.point_transactions(transaction_type, created_at);
CREATE INDEX IF NOT EXISTS idx_point_transactions_reference ON public.point_transactions(reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_balance ON public.point_transactions(user_id, created_at, running_balance);
CREATE INDEX IF NOT EXISTS idx_point_transactions_expires ON public.point_transactions(expires_at) WHERE expires_at IS NOT NULL;

-- Indexes for teams
CREATE INDEX IF NOT EXISTS idx_teams_department ON public.teams(department, is_active);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON public.team_members(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON public.team_members(team_id, is_active);

-- =============================================================================
-- SECTION 8: FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Enhanced updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to calculate user engagement score
CREATE OR REPLACE FUNCTION calculate_engagement_score(user_id_param text)
RETURNS numeric AS $$
DECLARE
    check_in_score numeric := 0;
    points_score numeric := 0;
    streak_score numeric := 0;
    activity_score numeric := 0;
    final_score numeric := 0;
BEGIN
    -- Check-in frequency score (last 30 days)
    SELECT COALESCE(COUNT(*) * 2.5, 0) INTO check_in_score
    FROM public.check_ins 
    WHERE user_id = user_id_param 
    AND check_in_time >= (CURRENT_DATE - INTERVAL '30 days');
    
    -- Points earning rate score
    SELECT COALESCE(SUM(points_earned) * 0.1, 0) INTO points_score
    FROM public.check_ins 
    WHERE user_id = user_id_param 
    AND check_in_time >= (CURRENT_DATE - INTERVAL '30 days');
    
    -- Streak bonus
    SELECT COALESCE(current_streak * 1.5, 0) INTO streak_score
    FROM public.employees 
    WHERE id = user_id_param;
    
    -- Recent activity bonus
    SELECT CASE 
        WHEN last_check_in >= (CURRENT_DATE - INTERVAL '1 day') THEN 10
        WHEN last_check_in >= (CURRENT_DATE - INTERVAL '3 days') THEN 5
        WHEN last_check_in >= (CURRENT_DATE - INTERVAL '7 days') THEN 2
        ELSE 0
    END INTO activity_score
    FROM public.employees 
    WHERE id = user_id_param;
    
    -- Calculate final score (capped at 100)
    final_score := LEAST(100.0, check_in_score + points_score + streak_score + activity_score);
    
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

-- Function to update user engagement scores
CREATE OR REPLACE FUNCTION update_user_engagement_scores()
RETURNS void AS $$
BEGIN
    UPDATE public.employees 
    SET 
        engagement_score = calculate_engagement_score(id),
        updated_at = timezone('utc'::text, now())
    WHERE employment_status = 'active';
END;
$$ LANGUAGE plpgsql;

-- Function to automatically award badges
CREATE OR REPLACE FUNCTION check_and_award_badges(user_id_param text)
RETURNS void AS $$
DECLARE
    badge_record RECORD;
    user_stats RECORD;
    should_award boolean;
BEGIN
    -- Get user's current stats
    SELECT 
        total_points_earned,
        current_streak,
        (SELECT COUNT(*) FROM public.check_ins WHERE user_id = user_id_param) as total_checkins
    INTO user_stats
    FROM public.employees 
    WHERE id = user_id_param;
    
    -- Check each active badge
    FOR badge_record IN 
        SELECT * FROM public.badges 
        WHERE is_active = true 
        AND NOT EXISTS (
            SELECT 1 FROM public.user_badges 
            WHERE user_id = user_id_param AND badge_id = badges.id
        )
    LOOP
        should_award := false;
        
        -- Check criteria based on type
        CASE badge_record.criteria_type
            WHEN 'points' THEN
                should_award := user_stats.total_points_earned >= badge_record.criteria_value;
            WHEN 'streak' THEN
                should_award := user_stats.current_streak >= badge_record.criteria_value;
            WHEN 'checkins' THEN
                should_award := user_stats.total_checkins >= badge_record.criteria_value;
        END CASE;
        
        -- Award the badge if criteria is met
        IF should_award THEN
            INSERT INTO public.user_badges (user_id, badge_id, earned_date, earned_context)
            VALUES (
                user_id_param, 
                badge_record.id, 
                timezone('utc'::text, now()),
                jsonb_build_object(
                    'auto_awarded', true,
                    'criteria_met', badge_record.criteria_type,
                    'value_achieved', CASE 
                        WHEN badge_record.criteria_type = 'points' THEN user_stats.total_points_earned
                        WHEN badge_record.criteria_type = 'streak' THEN user_stats.current_streak
                        WHEN badge_record.criteria_type = 'checkins' THEN user_stats.total_checkins
                    END
                )
            );
            
            -- Update badge earned count
            UPDATE public.badges 
            SET earned_count = earned_count + 1 
            WHERE id = badge_record.id;
            
            -- Award bonus points if applicable
            IF badge_record.points_reward > 0 THEN
                INSERT INTO public.point_transactions (
                    user_id, transaction_type, points_amount, running_balance,
                    reference_type, reference_id, description
                ) VALUES (
                    user_id_param, 'earned', badge_record.points_reward,
                    (SELECT points_balance + badge_record.points_reward FROM public.employees WHERE id = user_id_param),
                    'badge_reward', badge_record.id::text,
                    'Bonus points for earning badge: ' || badge_record.name
                );
                
                -- Update user points balance
                UPDATE public.employees 
                SET 
                    points_balance = points_balance + badge_record.points_reward,
                    total_points_earned = total_points_earned + badge_record.points_reward
                WHERE id = user_id_param;
            END IF;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER update_employees_updated_at 
    BEFORE UPDATE ON public.employees 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_check_ins_updated_at 
    BEFORE UPDATE ON public.check_ins 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reward_categories_updated_at 
    BEFORE UPDATE ON public.reward_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at 
    BEFORE UPDATE ON public.rewards 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_redemptions_updated_at 
    BEFORE UPDATE ON public.redemptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_badges_updated_at 
    BEFORE UPDATE ON public.badges 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_motivational_quotes_updated_at 
    BEFORE UPDATE ON public.motivational_quotes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at 
    BEFORE UPDATE ON public.system_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_point_transactions_updated_at 
    BEFORE UPDATE ON public.point_transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON public.notifications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_alerts_updated_at 
    BEFORE UPDATE ON public.system_alerts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at 
    BEFORE UPDATE ON public.teams 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- SECTION 9: ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badge_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievement_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_engagement_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motivational_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Employee policies
CREATE POLICY "employees_select_all" ON public.employees FOR SELECT TO authenticated USING (true);
CREATE POLICY "employees_update_own" ON public.employees FOR UPDATE TO authenticated USING (auth.uid()::text = id);
CREATE POLICY "employees_insert_own" ON public.employees FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = id);

-- Check-ins policies
CREATE POLICY "checkins_select_all" ON public.check_ins FOR SELECT TO authenticated USING (true);
CREATE POLICY "checkins_insert_own" ON public.check_ins FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "checkins_update_own" ON public.check_ins FOR UPDATE TO authenticated USING (auth.uid()::text = user_id);

-- Rewards and categories policies
CREATE POLICY "reward_categories_select_all" ON public.reward_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "rewards_select_active" ON public.rewards FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "rewards_admin_all" ON public.rewards FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.employees WHERE id = auth.uid()::text AND role IN ('admin', 'super_admin'))
);

-- Redemptions policies
CREATE POLICY "redemptions_select_own_or_admin" ON public.redemptions FOR SELECT TO authenticated USING (
    auth.uid()::text = user_id OR 
    EXISTS (SELECT 1 FROM public.employees WHERE id = auth.uid()::text AND role IN ('admin', 'super_admin'))
);
CREATE POLICY "redemptions_insert_own" ON public.redemptions FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "redemptions_update_admin" ON public.redemptions FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.employees WHERE id = auth.uid()::text AND role IN ('admin', 'super_admin'))
);

-- Badges and achievements policies
CREATE POLICY "badge_categories_select_all" ON public.badge_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "badges_select_all" ON public.badges FOR SELECT TO authenticated USING (true);
CREATE POLICY "user_badges_select_all" ON public.user_badges FOR SELECT TO authenticated USING (true);
CREATE POLICY "user_badges_insert_system" ON public.user_badges FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "achievement_progress_select_own" ON public.achievement_progress FOR SELECT TO authenticated USING (auth.uid()::text = user_id);

-- Analytics policies (admin only for most)
CREATE POLICY "analytics_events_insert_all" ON public.analytics_events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "analytics_events_select_admin" ON public.analytics_events FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.employees WHERE id = auth.uid()::text AND role IN ('admin', 'super_admin'))
);

-- Performance metrics (admin only)
CREATE POLICY "performance_metrics_admin_only" ON public.performance_metrics FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.employees WHERE id = auth.uid()::text AND role IN ('admin', 'super_admin'))
);

-- User engagement metrics (own data or admin)
CREATE POLICY "engagement_metrics_select_own_or_admin" ON public.user_engagement_metrics FOR SELECT TO authenticated USING (
    auth.uid()::text = user_id OR 
    EXISTS (SELECT 1 FROM public.employees WHERE id = auth.uid()::text AND role IN ('admin', 'super_admin'))
);

-- Notifications policies
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT TO authenticated USING (
    user_id IS NULL OR auth.uid()::text = user_id
);
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE TO authenticated USING (
    auth.uid()::text = user_id
);

-- System alerts (admin only)
CREATE POLICY "system_alerts_admin_only" ON public.system_alerts FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.employees WHERE id = auth.uid()::text AND role IN ('admin', 'super_admin'))
);

-- Other tables policies
CREATE POLICY "motivational_quotes_select_all" ON public.motivational_quotes FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "system_settings_select_public" ON public.system_settings FOR SELECT TO authenticated USING (is_public = true);
CREATE POLICY "system_settings_admin_all" ON public.system_settings FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.employees WHERE id = auth.uid()::text AND role IN ('admin', 'super_admin'))
);

CREATE POLICY "point_transactions_select_own_or_admin" ON public.point_transactions FOR SELECT TO authenticated USING (
    auth.uid()::text = user_id OR 
    EXISTS (SELECT 1 FROM public.employees WHERE id = auth.uid()::text AND role IN ('admin', 'super_admin'))
);

CREATE POLICY "user_wishlists_own_only" ON public.user_wishlists FOR ALL TO authenticated USING (auth.uid()::text = user_id);

CREATE POLICY "teams_select_all" ON public.teams FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "team_members_select_all" ON public.team_members FOR SELECT TO authenticated USING (true);

CREATE POLICY "audit_log_admin_only" ON public.audit_log FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.employees WHERE id = auth.uid()::text AND role IN ('admin', 'super_admin'))
);

-- =============================================================================
-- SECTION 10: SEED DATA FOR NEW TABLES
-- =============================================================================

-- Insert reward categories
INSERT INTO public.reward_categories (name, description, display_order, icon, color_theme) VALUES
('Food & Beverages', 'Coffee, lunch, and food-related rewards', 1, '🍕', '#FF6B6B'),
('Time Off', 'PTO, flexible hours, and time-related benefits', 2, '🏖️', '#4ECDC4'),
('Professional Development', 'Learning, courses, and skill development', 3, '📚', '#45B7D1'),
('Recognition', 'Awards, certificates, and acknowledgments', 4, '🏆', '#FFA726'),
('Wellness', 'Health, fitness, and wellbeing rewards', 5, '💪', '#66BB6A'),
('Technology', 'Gadgets, software, and tech accessories', 6, '💻', '#AB47BC'),
('Gift Cards', 'Various gift cards and vouchers', 7, '🎁', '#EC407A'),
('Experiences', 'Events, activities, and special experiences', 8, '🎢', '#FF7043');

-- Insert badge categories
INSERT INTO public.badge_categories (name, description, display_order, color_theme) VALUES
('Getting Started', 'Welcome and onboarding achievements', 1, '#4CAF50'),
('Consistency', 'Regular check-in and attendance badges', 2, '#2196F3'),
('Milestones', 'Point and achievement milestones', 3, '#FF9800'),
('Special Events', 'Holiday and special occasion badges', 4, '#9C27B0'),
('Leadership', 'Team and leadership achievements', 5, '#795548'),
('Excellence', 'Top performance and exceptional achievements', 6, '#FFD700');

-- Enhanced system settings
INSERT INTO public.system_settings (setting_key, setting_value, default_value, description, category, data_type, validation_rules, is_public) VALUES
-- Points settings
('early_checkin_points', '2', '2', 'Points awarded for early check-in (6:00-7:00 AM)', 'points', 'integer', '{"min": 0, "max": 10}', true),
('ontime_checkin_points', '1', '1', 'Points awarded for on-time check-in (7:00-9:00 AM)', 'points', 'integer', '{"min": 0, "max": 10}', true),
('late_checkin_points', '0', '0', 'Points awarded for late check-in (after 9:00 AM)', 'points', 'integer', '{"min": 0, "max": 10}', true),
('weekend_bonus_multiplier', '1.5', '1.5', 'Point multiplier for weekend check-ins', 'points', 'decimal', '{"min": 1.0, "max": 3.0}', true),
('holiday_bonus_multiplier', '2.0', '2.0', 'Point multiplier for holiday check-ins', 'points', 'decimal', '{"min": 1.0, "max": 5.0}', true),

-- Timing settings  
('checkin_window_start', '06:00', '06:00', 'Daily check-in window start time', 'timing', 'time', '{}', true),
('checkin_window_end', '09:00', '09:00', 'Daily check-in window end time', 'timing', 'time', '{}', true),
('grace_period_minutes', '5', '5', 'Grace period for on-time check-ins (minutes)', 'timing', 'integer', '{"min": 0, "max": 30}', true),
('streak_reset_grace_days', '1', '1', 'Days of grace before streak resets', 'timing', 'integer', '{"min": 0, "max": 7}', true),

-- Company settings
('company_name', 'System Kleen', 'System Kleen', 'Company name displayed in the app', 'company', 'string', '{}', true),
('company_logo_url', '', '', 'URL to company logo', 'company', 'string', '{}', true),
('timezone', 'America/Denver', 'America/Denver', 'Company timezone', 'company', 'string', '{}', true),
('fiscal_year_start', '01-01', '01-01', 'Fiscal year start date (MM-DD)', 'company', 'string', '{}', false),

-- Features
('enable_geofencing', 'false', 'false', 'Enable location-based check-ins', 'features', 'boolean', '{}', false),
('enable_social_features', 'true', 'true', 'Enable team competitions and social features', 'features', 'boolean', '{}', true),
('enable_push_notifications', 'true', 'true', 'Enable push notifications', 'features', 'boolean', '{}', true),
('enable_badge_system', 'true', 'true', 'Enable achievement badges', 'features', 'boolean', '{}', true),
('enable_leaderboards', 'true', 'true', 'Enable leaderboard functionality', 'features', 'boolean', '{}', true),

-- Security
('max_login_attempts', '5', '5', 'Maximum failed login attempts before lockout', 'security', 'integer', '{"min": 3, "max": 10}', false),
('session_timeout_hours', '24', '24', 'User session timeout in hours', 'security', 'integer', '{"min": 1, "max": 168}', false),
('require_2fa_admin', 'true', 'true', 'Require 2FA for admin accounts', 'security', 'boolean', '{}', false),

-- Notifications
('daily_reminder_time', '08:00', '08:00', 'Time to send daily check-in reminders', 'notifications', 'time', '{}', false),
('weekly_digest_day', 'monday', 'monday', 'Day of week to send weekly digest', 'notifications', 'string', '{}', false),
('enable_email_notifications', 'true', 'true', 'Enable email notifications', 'notifications', 'boolean', '{}', true);

-- Enhanced motivational quotes with more categories
INSERT INTO public.motivational_quotes (quote_text, author, category, tags, weight) VALUES
-- Leadership quotes
('The way to get started is to quit talking and begin doing.', 'Walt Disney', 'leadership', '{"action", "getting_started"}', 2),
('Innovation distinguishes between a leader and a follower.', 'Steve Jobs', 'innovation', '{"leadership", "innovation"}', 2),
('A leader is one who knows the way, goes the way, and shows the way.', 'John C. Maxwell', 'leadership', '{"guidance", "example"}', 1),

-- Teamwork quotes
('Teamwork makes the dream work.', 'John C. Maxwell', 'teamwork', '{"collaboration", "unity"}', 2),
('Coming together is a beginning, staying together is progress, working together is success.', 'Henry Ford', 'teamwork', '{"collaboration", "progress"}', 2),
('Alone we can do so little; together we can do so much.', 'Helen Keller', 'teamwork', '{"collaboration", "strength"}', 1),

-- Motivation quotes
('Success is not final, failure is not fatal: it is the courage to continue that counts.', 'Winston Churchill', 'motivation', '{"persistence", "courage"}', 2),
('Your limitation—it''s only your imagination.', 'Unknown', 'motivation', '{"mindset", "possibilities"}', 1),
('Push yourself, because no one else is going to do it for you.', 'Unknown', 'motivation', '{"self_improvement", "drive"}', 1),
('Great things never come from comfort zones.', 'Unknown', 'motivation', '{"growth", "challenge"}', 2),

-- Success quotes
('Excellence is not a skill, it''s an attitude.', 'Ralph Marston', 'success', '{"excellence", "mindset"}', 1),
('The only way to do great work is to love what you do.', 'Steve Jobs', 'success', '{"passion", "work"}', 2),
('Success is walking from failure to failure with no loss of enthusiasm.', 'Winston Churchill', 'success', '{"persistence", "resilience"}', 1);

-- Create initial teams based on common departments
INSERT INTO public.teams (name, description, department, monthly_checkin_goal, quarterly_points_goal) VALUES
('General Team', 'Default team for general department employees', 'General', 20, 500),
('Management Team', 'Leadership and management team', 'Management', 22, 600),
('IT Team', 'Information Technology department', 'IT', 20, 550),
('HR Team', 'Human Resources department', 'HR', 20, 500),
('Sales Team', 'Sales and business development', 'Sales', 25, 700),
('Operations Team', 'Operations and logistics', 'Operations', 22, 600);

-- =============================================================================
-- SECTION 11: VIEWS FOR ANALYTICS AND REPORTING
-- =============================================================================

-- Comprehensive user statistics view
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
    e.id,
    e.name,
    e.email,
    e.department,
    e.role,
    e.points_balance,
    e.total_points_earned,
    e.current_streak,
    e.longest_streak,
    e.engagement_score,
    
    -- Check-in statistics
    COALESCE(ci.total_checkins, 0) as total_checkins,
    COALESCE(ci.early_checkins, 0) as early_checkins,
    COALESCE(ci.ontime_checkins, 0) as ontime_checkins,
    COALESCE(ci.late_checkins, 0) as late_checkins,
    COALESCE(ci.avg_daily_points, 0) as avg_daily_points,
    
    -- Badge counts
    COALESCE(b.badge_count, 0) as badge_count,
    COALESCE(b.rare_badge_count, 0) as rare_badge_count,
    
    -- Redemption statistics
    COALESCE(r.total_redemptions, 0) as total_redemptions,
    COALESCE(r.total_points_spent, 0) as total_points_spent,
    COALESCE(r.pending_redemptions, 0) as pending_redemptions,
    
    -- Engagement metrics
    CASE 
        WHEN e.last_check_in >= CURRENT_DATE - INTERVAL '1 day' THEN 'very_active'
        WHEN e.last_check_in >= CURRENT_DATE - INTERVAL '3 days' THEN 'active'
        WHEN e.last_check_in >= CURRENT_DATE - INTERVAL '7 days' THEN 'moderate'
        WHEN e.last_check_in >= CURRENT_DATE - INTERVAL '30 days' THEN 'low'
        ELSE 'inactive'
    END as activity_level,
    
    e.last_check_in,
    e.created_at as join_date
    
FROM public.employees e

-- Check-in statistics subquery
LEFT JOIN (
    SELECT 
        user_id,
        COUNT(*) as total_checkins,
        COUNT(*) FILTER (WHERE check_in_type = 'early') as early_checkins,
        COUNT(*) FILTER (WHERE check_in_type = 'ontime') as ontime_checkins,
        COUNT(*) FILTER (WHERE check_in_type = 'late') as late_checkins,
        ROUND(AVG(points_earned), 2) as avg_daily_points
    FROM public.check_ins
    GROUP BY user_id
) ci ON e.id = ci.user_id

-- Badge statistics subquery
LEFT JOIN (
    SELECT 
        ub.user_id,
        COUNT(*) as badge_count,
        COUNT(*) FILTER (WHERE b.rarity IN ('rare', 'epic', 'legendary')) as rare_badge_count
    FROM public.user_badges ub
    JOIN public.badges b ON ub.badge_id = b.id
    GROUP BY ub.user_id
) b ON e.id = b.user_id

-- Redemption statistics subquery
LEFT JOIN (
    SELECT 
        user_id,
        COUNT(*) as total_redemptions,
        SUM(points_spent) as total_points_spent,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_redemptions
    FROM public.redemptions
    GROUP BY user_id
) r ON e.id = r.user_id

WHERE e.employment_status = 'active';

-- Department leaderboard view
CREATE OR REPLACE VIEW department_leaderboard AS
SELECT 
    department,
    COUNT(*) as employee_count,
    AVG(points_balance) as avg_points_balance,
    SUM(total_points_earned) as total_department_points,
    AVG(current_streak) as avg_current_streak,
    AVG(engagement_score) as avg_engagement_score,
    COUNT(*) FILTER (WHERE last_check_in >= CURRENT_DATE - INTERVAL '7 days') as active_last_week,
    ROUND(
        (COUNT(*) FILTER (WHERE last_check_in >= CURRENT_DATE - INTERVAL '7 days') * 100.0 / COUNT(*)), 
        2
    ) as activity_percentage
FROM public.employees
WHERE employment_status = 'active'
GROUP BY department
ORDER BY avg_engagement_score DESC;

-- Daily check-in summary view
CREATE OR REPLACE VIEW daily_checkin_summary AS
SELECT 
    check_in_date,
    COUNT(*) as total_checkins,
    COUNT(*) FILTER (WHERE check_in_type = 'early') as early_checkins,
    COUNT(*) FILTER (WHERE check_in_type = 'ontime') as ontime_checkins,
    COUNT(*) FILTER (WHERE check_in_type = 'late') as late_checkins,
    SUM(points_earned) as total_points_awarded,
    AVG(points_earned) as avg_points_per_checkin,
    COUNT(DISTINCT user_id) as unique_users,
    ROUND(
        (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM public.employees WHERE employment_status = 'active')), 
        2
    ) as participation_percentage
FROM public.check_ins
WHERE check_in_time >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY check_in_date
ORDER BY check_in_date DESC;

-- Reward popularity view
CREATE OR REPLACE VIEW reward_popularity AS
SELECT 
    r.id,
    r.name,
    r.points_cost,
    rc.name as category_name,
    r.quantity_available,
    r.quantity_redeemed,
    COALESCE(redemption_stats.total_redemptions, 0) as total_redemptions,
    COALESCE(redemption_stats.pending_redemptions, 0) as pending_redemptions,
    COALESCE(redemption_stats.avg_rating, 0) as avg_user_rating,
    r.view_count,
    ROUND(r.view_count::numeric / GREATEST(r.redemption_count, 1), 2) as view_to_redemption_ratio,
    CASE 
        WHEN r.quantity_available = -1 THEN 'unlimited'
        WHEN r.quantity_available - r.quantity_redeemed <= 0 THEN 'out_of_stock'
        WHEN r.quantity_available - r.quantity_redeemed <= 5 THEN 'low_stock'
        ELSE 'in_stock'
    END as stock_status
FROM public.rewards r
LEFT JOIN public.reward_categories rc ON r.category_id = rc.id
LEFT JOIN (
    SELECT 
        reward_id,
        COUNT(*) as total_redemptions,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_redemptions,
        AVG(user_rating) FILTER (WHERE user_rating IS NOT NULL) as avg_rating
    FROM public.redemptions
    GROUP BY reward_id
) redemption_stats ON r.id = redemption_stats.reward_id
WHERE r.is_active = true
ORDER BY total_redemptions DESC, view_count DESC;

-- =============================================================================
-- FINAL COMMENTS AND DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE public.employees IS 'Enhanced employee profiles with comprehensive tracking and preferences';
COMMENT ON TABLE public.check_ins IS 'Enhanced check-in tracking with location, device info, and verification';
COMMENT ON TABLE public.reward_categories IS 'Hierarchical categorization for rewards catalog';
COMMENT ON TABLE public.rewards IS 'Comprehensive rewards with inventory, scheduling, and analytics';
COMMENT ON TABLE public.redemptions IS 'Full workflow redemption tracking with delivery and feedback';
COMMENT ON TABLE public.badge_categories IS 'Organizational structure for achievement badges';
COMMENT ON TABLE public.badges IS 'Advanced achievement system with rarity and progression';
COMMENT ON TABLE public.user_badges IS 'User achievement tracking with progress and context';
COMMENT ON TABLE public.achievement_progress IS 'Real-time progress tracking toward badge criteria';
COMMENT ON TABLE public.analytics_events IS 'Comprehensive event logging for business intelligence';
COMMENT ON TABLE public.performance_metrics IS 'Aggregated metrics for reporting and dashboards';
COMMENT ON TABLE public.user_engagement_metrics IS 'Detailed user engagement tracking and scoring';
COMMENT ON TABLE public.notifications IS 'Multi-channel notification system with targeting';
COMMENT ON TABLE public.system_alerts IS 'Administrative alert system for monitoring';
COMMENT ON TABLE public.system_settings IS 'Enhanced configuration with validation and change tracking';
COMMENT ON TABLE public.point_transactions IS 'Complete point transaction ledger with transfers';
COMMENT ON TABLE public.user_wishlists IS 'User wish tracking for rewards and notifications';
COMMENT ON TABLE public.teams IS 'Team management for department-based features';
COMMENT ON TABLE public.team_members IS 'Team membership tracking with roles';
COMMENT ON TABLE public.audit_log IS 'Comprehensive audit trail for security and compliance';

-- Performance optimization notes:
-- 1. All tables include appropriate indexes for common query patterns
-- 2. Generated columns reduce computation overhead for frequent calculations
-- 3. Partitioning could be added for large tables (analytics_events, audit_log)
-- 4. Consider archiving strategies for historical data
-- 5. Regular VACUUM and ANALYZE recommended for optimal performance

-- Backup compatibility notes:
-- 1. All new tables use IF NOT EXISTS to prevent conflicts
-- 2. Existing table columns are preserved for backward compatibility
-- 3. Legacy category field maintained in rewards table
-- 4. Migration scripts should be run during maintenance windows
-- 5. Test thoroughly in staging environment before production deployment

-- =============================================================================
-- END OF SCHEMA
-- =============================================================================