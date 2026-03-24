-- =============================================
-- FitSence Row Level Security Policies
-- Run AFTER schema.sql
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_streaks ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PROFILES POLICIES
-- =============================================
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- =============================================
-- HEALTH METRICS POLICIES
-- =============================================
CREATE POLICY "Users can view own health metrics"
  ON public.health_metrics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health metrics"
  ON public.health_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health metrics"
  ON public.health_metrics FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own health metrics"
  ON public.health_metrics FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- DIET PLANS POLICIES
-- =============================================
CREATE POLICY "Users can view own diet plans"
  ON public.diet_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diet plans"
  ON public.diet_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diet plans"
  ON public.diet_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own diet plans"
  ON public.diet_plans FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- WORKOUT PLANS POLICIES
-- =============================================
CREATE POLICY "Users can view own workout plans"
  ON public.workout_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout plans"
  ON public.workout_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout plans"
  ON public.workout_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout plans"
  ON public.workout_plans FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- DAILY TASKS POLICIES
-- =============================================
CREATE POLICY "Users can view own daily tasks"
  ON public.daily_tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily tasks"
  ON public.daily_tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily tasks"
  ON public.daily_tasks FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================
-- PROGRESS TRACKING POLICIES
-- =============================================
CREATE POLICY "Users can view own progress"
  ON public.progress_tracking FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.progress_tracking FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.progress_tracking FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================
-- WORKOUT STREAKS POLICIES
-- =============================================
CREATE POLICY "Users can view own streaks"
  ON public.workout_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks"
  ON public.workout_streaks FOR UPDATE
  USING (auth.uid() = user_id);
