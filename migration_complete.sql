-- =============================================
-- FitSense Complete Database Migration
-- Run this in Supabase SQL Editor
-- Project: fouamqukwblpyipqstfk
-- =============================================

-- STEP 1: Add missing activity_level column to health_metrics
ALTER TABLE public.health_metrics
ADD COLUMN IF NOT EXISTS activity_level TEXT NOT NULL DEFAULT 'sedentary'
CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'));

-- STEP 2: Create missing fatigue_chat_logs table
CREATE TABLE IF NOT EXISTS public.fatigue_chat_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'bot')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast per-user lookups
CREATE INDEX IF NOT EXISTS fatigue_chat_logs_user_id_idx 
  ON public.fatigue_chat_logs(user_id, created_at DESC);

-- Row Level Security for fatigue_chat_logs
ALTER TABLE public.fatigue_chat_logs ENABLE ROW LEVEL SECURITY;

-- STEP 3: Enable RLS on all tables (safe to re-run)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_streaks ENABLE ROW LEVEL SECURITY;

-- STEP 4: Apply all RLS policies safely
DO $$ BEGIN

  -- profiles
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users can view own profile') THEN
    CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users can update own profile') THEN
    CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users can insert own profile') THEN
    CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;

  -- health_metrics
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='health_metrics' AND policyname='Users can view own health metrics') THEN
    CREATE POLICY "Users can view own health metrics" ON public.health_metrics FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='health_metrics' AND policyname='Users can insert own health metrics') THEN
    CREATE POLICY "Users can insert own health metrics" ON public.health_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='health_metrics' AND policyname='Users can update own health metrics') THEN
    CREATE POLICY "Users can update own health metrics" ON public.health_metrics FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='health_metrics' AND policyname='Users can delete own health metrics') THEN
    CREATE POLICY "Users can delete own health metrics" ON public.health_metrics FOR DELETE USING (auth.uid() = user_id);
  END IF;

  -- diet_plans
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='diet_plans' AND policyname='Users can view own diet plans') THEN
    CREATE POLICY "Users can view own diet plans" ON public.diet_plans FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='diet_plans' AND policyname='Users can insert own diet plans') THEN
    CREATE POLICY "Users can insert own diet plans" ON public.diet_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='diet_plans' AND policyname='Users can update own diet plans') THEN
    CREATE POLICY "Users can update own diet plans" ON public.diet_plans FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='diet_plans' AND policyname='Users can delete own diet plans') THEN
    CREATE POLICY "Users can delete own diet plans" ON public.diet_plans FOR DELETE USING (auth.uid() = user_id);
  END IF;

  -- workout_plans
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='workout_plans' AND policyname='Users can view own workout plans') THEN
    CREATE POLICY "Users can view own workout plans" ON public.workout_plans FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='workout_plans' AND policyname='Users can insert own workout plans') THEN
    CREATE POLICY "Users can insert own workout plans" ON public.workout_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='workout_plans' AND policyname='Users can update own workout plans') THEN
    CREATE POLICY "Users can update own workout plans" ON public.workout_plans FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='workout_plans' AND policyname='Users can delete own workout plans') THEN
    CREATE POLICY "Users can delete own workout plans" ON public.workout_plans FOR DELETE USING (auth.uid() = user_id);
  END IF;

  -- daily_tasks
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='daily_tasks' AND policyname='Users can view own daily tasks') THEN
    CREATE POLICY "Users can view own daily tasks" ON public.daily_tasks FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='daily_tasks' AND policyname='Users can insert own daily tasks') THEN
    CREATE POLICY "Users can insert own daily tasks" ON public.daily_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='daily_tasks' AND policyname='Users can update own daily tasks') THEN
    CREATE POLICY "Users can update own daily tasks" ON public.daily_tasks FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  -- progress_tracking
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='progress_tracking' AND policyname='Users can view own progress') THEN
    CREATE POLICY "Users can view own progress" ON public.progress_tracking FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='progress_tracking' AND policyname='Users can insert own progress') THEN
    CREATE POLICY "Users can insert own progress" ON public.progress_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='progress_tracking' AND policyname='Users can update own progress') THEN
    CREATE POLICY "Users can update own progress" ON public.progress_tracking FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  -- workout_streaks
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='workout_streaks' AND policyname='Users can view own streaks') THEN
    CREATE POLICY "Users can view own streaks" ON public.workout_streaks FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='workout_streaks' AND policyname='Users can update own streaks') THEN
    CREATE POLICY "Users can update own streaks" ON public.workout_streaks FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='workout_streaks' AND policyname='Users can insert own streaks') THEN
    CREATE POLICY "Users can insert own streaks" ON public.workout_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- fatigue_chat_logs
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='fatigue_chat_logs' AND policyname='Users can insert own chat logs') THEN
    CREATE POLICY "Users can insert own chat logs" ON public.fatigue_chat_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='fatigue_chat_logs' AND policyname='Users can view own chat logs') THEN
    CREATE POLICY "Users can view own chat logs" ON public.fatigue_chat_logs FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='fatigue_chat_logs' AND policyname='Users can delete own chat logs') THEN
    CREATE POLICY "Users can delete own chat logs" ON public.fatigue_chat_logs FOR DELETE USING (auth.uid() = user_id);
  END IF;

END $$;

-- VERIFY: Show all tables and their RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
