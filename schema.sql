-- =============================================
-- FitSence Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS PROFILE TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- HEALTH METRICS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.health_metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  height_cm NUMERIC(5,2) NOT NULL,
  weight_kg NUMERIC(5,2) NOT NULL,
  hemoglobin NUMERIC(4,2),
  blood_sugar NUMERIC(5,2),
  activity_level TEXT NOT NULL CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active')),
  fitness_goal TEXT NOT NULL CHECK (fitness_goal IN ('lean_body', 'muscle_gain', 'fat_loss', 'bulk')),
  bmi NUMERIC(5,2),
  bmr NUMERIC(7,2),
  tdee NUMERIC(7,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DIET PLANS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.diet_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  daily_calories INTEGER NOT NULL,
  protein_g INTEGER NOT NULL,
  carbs_g INTEGER NOT NULL,
  fat_g INTEGER NOT NULL,
  plan_data JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- WORKOUT PLANS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.workout_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_name TEXT NOT NULL,
  goal TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced', 'extreme')),
  plan_data JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DAILY TASKS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.daily_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_date DATE NOT NULL DEFAULT CURRENT_DATE,
  workout_completed BOOLEAN DEFAULT FALSE,
  breakfast_completed BOOLEAN DEFAULT FALSE,
  lunch_completed BOOLEAN DEFAULT FALSE,
  dinner_completed BOOLEAN DEFAULT FALSE,
  snacks_completed BOOLEAN DEFAULT FALSE,
  water_intake_ml INTEGER DEFAULT 0,
  water_goal_ml INTEGER DEFAULT 3000,
  steps_count INTEGER DEFAULT 0,
  steps_goal INTEGER DEFAULT 10000,
  custom_tasks JSONB DEFAULT '[]',
  discipline_score NUMERIC(5,4) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, task_date)
);

-- =============================================
-- PROGRESS TRACKING TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.progress_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg NUMERIC(5,2),
  body_fat_pct NUMERIC(5,2),
  notes TEXT,
  photos JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, log_date)
);

-- =============================================
-- WORKOUT STREAK TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.workout_streaks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_workout_date DATE,
  total_workouts INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- =============================================
-- TRIGGER: Auto-create profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  INSERT INTO public.workout_streaks (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- TRIGGER: Update updated_at timestamps
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_health_metrics_updated_at
  BEFORE UPDATE ON public.health_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_daily_tasks_updated_at
  BEFORE UPDATE ON public.daily_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- FATIGUE CHAT LOGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.fatigue_chat_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'bot')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast per-user lookups
CREATE INDEX IF NOT EXISTS fatigue_chat_logs_user_id_idx ON public.fatigue_chat_logs(user_id, created_at DESC);

-- Row Level Security: users can only see their own chat logs
ALTER TABLE public.fatigue_chat_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own chat logs"
  ON public.fatigue_chat_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own chat logs"
  ON public.fatigue_chat_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat logs"
  ON public.fatigue_chat_logs FOR DELETE
  USING (auth.uid() = user_id);

