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
    const { data: existing } = await supabase.from('daily_tasks').select('id').eq('user_id', user.id).eq('task_date', today).maybeSingle();
    let res;
    if (existing) {
      res = await supabase.from('daily_tasks').update(updates).eq('id', existing.id).select().single();
    } else {
      res = await supabase.from('daily_tasks').insert({ user_id: user.id, task_date: today, ...updates }).select().single();
    }
    if (!res.error) setData(res.data)
    else console.error("Error saving daily task", res.error)
    return res
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
      
    const localData = JSON.parse(localStorage.getItem(`progress_${user.id}`) || '[]');
    let merged = [...(data || []), ...localData];
    const map = new Map();
    merged.forEach(x => map.set(x.log_date, x));
    merged = Array.from(map.values()).sort((a,b) => new Date(b.log_date) - new Date(a.log_date));

    setData(merged.slice(0, limit))
    setLoading(false)
  }, [user, limit])

  const logProgress = async (entry) => {
    let res = { error: null };
    try {
      const { data: existing, error: selectErr } = await supabase.from('progress_tracking').select('id').eq('user_id', user.id).eq('log_date', entry.log_date).maybeSingle();
      if (selectErr) throw selectErr;
      
      if (existing) {
        res = await supabase.from('progress_tracking').update(entry).eq('id', existing.id).select().single();
      } else {
        res = await supabase.from('progress_tracking').insert({ user_id: user.id, ...entry }).select().single();
      }
    } catch (err) {
      res.error = err;
    }
    
    if (res.error) {
      console.warn("Using local storage fallback due to DB error:", res.error);
      const k = `progress_${user.id}`;
      const localData = JSON.parse(localStorage.getItem(k) || '[]');
      const existingIdx = localData.findIndex(x => x.log_date === entry.log_date);
      if (existingIdx >= 0) localData[existingIdx] = { ...localData[existingIdx], ...entry };
      else localData.push({ id: Date.now().toString(), log_date: entry.log_date, weight_kg: entry.weight_kg, notes: entry.notes });
      localStorage.setItem(k, JSON.stringify(localData));
    }
    
    fetch()
    return res
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
