-- SQL Schema for Supabase Profiles Table with Row Level Security (RLS)
-- Copy and run this script in your Supabase SQL Editor (https://supabase.com/dashboard)

-- 1. Create public profiles table linked to Supabase Auth users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    location TEXT NOT NULL,
    education TEXT NOT NULL,
    degree TEXT NOT NULL,
    university TEXT NOT NULL,
    graduation_year TEXT NOT NULL,
    experience_level TEXT NOT NULL,
    skills TEXT NOT NULL,
    preferred_roles TEXT NOT NULL,
    preferred_locations TEXT NOT NULL,
    work_preference TEXT NOT NULL DEFAULT 'Hybrid',
    
    -- Optional fields
    resume_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    expected_salary TEXT,
    avatar_url TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- 4. RLS Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 5. RLS Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
