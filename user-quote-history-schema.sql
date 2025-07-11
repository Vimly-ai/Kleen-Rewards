-- Add table to track which quotes users have seen
-- Run this in Supabase SQL Editor after the main schema

-- Create user_quote_history table
CREATE TABLE IF NOT EXISTS public.user_quote_history (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
    quote_text text NOT NULL,
    quote_author text,
    category text CHECK (category IN ('early', 'ontime', 'late', 'motivation', 'success', 'teamwork', 'general')) NOT NULL,
    shown_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, quote_text) -- Prevent same quote from being shown to same user twice
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_quote_history_user_id ON public.user_quote_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quote_history_category ON public.user_quote_history(category);

-- Enable Row Level Security
ALTER TABLE public.user_quote_history ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Allow users to view their own quote history" ON public.user_quote_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow system to insert quote history" ON public.user_quote_history FOR INSERT TO authenticated WITH CHECK (true);

-- Add updated_at trigger
CREATE TRIGGER update_user_quote_history_updated_at BEFORE UPDATE ON public.user_quote_history FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();