import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'
import { useAuth } from './AuthContext'

// ============================================
// useHealthMetrics
// ============================================
export function useHealthMetrics() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()
    setData(data)
    setError(error?.code === 'PGRST116' ? null : error)
    setLoading(false)
  }, [user])

  useEffect(() => { fetch() }, [fetch])
  return { data, loading, error, refetch: fetch }
}

// ============================================
// useDietPlan
// ============================================
export function useDietPlan() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('diet_plans')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    setData(data)
    setLoading(false)
  }, [user])

  useEffect(() => { fetch() }, [fetch])
  return { data, loading, refetch: fetch }
}

// ============================================
// useWorkoutPlan
// ============================================
export function useWorkoutPlan() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    setData(data)
    setLoading(false)
  }, [user])

  useEffect(() => { fetch() }, [fetch])
  return { data, loading, refetch: fetch }
}

// ============================================
// useTodayTasks
// ============================================
export function useTodayTasks() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().split('T')[0]

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('user_id', user.id)
      .eq('task_date', today)
      .single()
    setData(data)
    setLoading(false)
  }, [user, today])

  const upsert = async (updates) => {
    const { data: result, error } = await supabase
      .from('daily_tasks')
      .upsert({ user_id: user.id, task_date: today, ...updates }, { onConflict: 'user_id,task_date' })
      .select()
      .single()
    if (!error) setData(result)
    return { data: result, error }
  }

  useEffect(() => { fetch() }, [fetch])
  return { data, loading, refetch: fetch, upsert }
}

// ============================================
// useProgress
// ============================================
export function useProgress(limit = 30) {
  const { user } = useAuth()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('progress_tracking')
      .select('*')
      .eq('user_id', user.id)
      .order('log_date', { ascending: false })
      .limit(limit)
    setData(data || [])
    setLoading(false)
  }, [user, limit])

  const logProgress = async (entry) => {
    const { data: result, error } = await supabase
      .from('progress_tracking')
      .upsert({ user_id: user.id, ...entry }, { onConflict: 'user_id,log_date' })
      .select()
      .single()
    if (!error) fetch()
    return { data: result, error }
  }

  useEffect(() => { fetch() }, [fetch])
  return { data, loading, refetch: fetch, logProgress }
}

// ============================================
// useWeeklyTasks — last 7 days for discipline score
// ============================================
export function useWeeklyTasks() {
  const { user } = useAuth()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetchWeek = async () => {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const { data } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', user.id)
        .gte('task_date', sevenDaysAgo.toISOString().split('T')[0])
        .order('task_date', { ascending: false })
      setData(data || [])
      setLoading(false)
    }
    fetchWeek()
  }, [user])

  return { data, loading }
}

// ============================================
// useWorkoutStreak
// ============================================
export function useWorkoutStreak() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetch = async () => {
      const { data } = await supabase
        .from('workout_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single()
      setData(data)
      setLoading(false)
    }
    fetch()
  }, [user])

  return { data, loading }
}
