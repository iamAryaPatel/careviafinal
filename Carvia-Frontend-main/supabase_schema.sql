-- Supabase Profiles Table Schema for Carvia
-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  location text,
  education text,
  degree text,
  university text,
  graduation_year text,
  experience_level text,
  skills text,
  preferred_roles text,
  preferred_locations text,
  work_preference text,
  resume_url text,
  linkedin_url text,
  github_url text,
  portfolio_url text,
  expected_salary text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policy: Users can view their own profile
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Policy: Users can insert/update their own profile
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- Trigger to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger on_profile_updated
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();
