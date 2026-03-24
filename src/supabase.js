// ─── Real Supabase Client ─────────────────────────────────────────────────────
// Reads REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY from .env
// If the env vars are missing or invalid, falls back to mock localStorage mode
// so the app still works during development without a Supabase project.

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || ''

// ─── Detect if real credentials are configured ────────────────────────────────
const isConfigured =
  SUPABASE_URL.startsWith('https://') &&
  SUPABASE_ANON_KEY.length > 20

if (!isConfigured) {
  console.warn(
    '[FitSense] Supabase credentials not found in .env — using mock localStorage mode.\n' +
    'Add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY to your .env file to enable real database.'
  )
}

// ─── Real Supabase client (used when credentials are present) ─────────────────
const realClient = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null

// ─── Mock client (fallback — localStorage only) ───────────────────────────────
const getMockDb = () => {
  const db = localStorage.getItem('fitsense_mock_db')
  return db ? JSON.parse(db) : {
    health_metrics: [],
    diet_plans: [],
    workout_plans: [],
    daily_tasks: [],
    progress_tracking: [],
    workout_streaks: [],
    fatigue_chat_logs: []
  }
}

const saveMockDb = (db) => {
  localStorage.setItem('fitsense_mock_db', JSON.stringify(db))
}

class MockQuery {
  constructor(table) {
    this.table = table
    this.db = getMockDb()
    this.result = [...(this.db[table] || [])]
    this.upsertData = null
  }
  select() { return this }
  eq(col, val) {
    this.result = this.result.filter(item => item[col] === val)
    return this
  }
  gte(col, val) {
    this.result = this.result.filter(item => item[col] >= val)
    return this
  }
  order(col, options) {
    this.result.sort((a, b) => {
      const aVal = a[col] || ''
      const bVal = b[col] || ''
      if (options?.ascending) return aVal > bVal ? 1 : -1
      return aVal < bVal ? 1 : -1
    })
    return this
  }
  limit(n) {
    this.result = this.result.slice(0, n)
    return this
  }
  async single() {
    if (this.upsertData) return { data: this.upsertData, error: null }
    const res = this.result[0]
    if (!res) return { data: null, error: { code: 'PGRST116', message: 'Not found' } }
    return { data: res, error: null }
  }
  async insert(data) {
    const entry = { ...data, id: Date.now(), created_at: new Date().toISOString() }
    this.db[this.table] = this.db[this.table] || []
    this.db[this.table].push(entry)
    saveMockDb(this.db)
    return { data: entry, error: null }
  }
  update(data) {
    for (const item of this.result) {
      const idx = this.db[this.table].findIndex(d => d.id === item.id)
      if (idx !== -1) {
        this.db[this.table][idx] = { ...this.db[this.table][idx], ...data }
      }
    }
    saveMockDb(this.db)
    return this
  }
  upsert(data, options) {
    const entry = { ...data, id: Date.now(), updated_at: new Date().toISOString() }
    this.db[this.table] = this.db[this.table] || []
    const idx = this.db[this.table].findIndex(item =>
      item.user_id === data.user_id &&
      (!data.task_date || item.task_date === data.task_date) &&
      (!data.log_date || item.log_date === data.log_date)
    )
    if (idx >= 0) {
      entry.id = this.db[this.table][idx].id
      entry.created_at = this.db[this.table][idx].created_at
      this.db[this.table][idx] = { ...this.db[this.table][idx], ...entry }
    } else {
      entry.created_at = new Date().toISOString()
      this.db[this.table].push(entry)
    }
    saveMockDb(this.db)
    this.upsertData = entry
    return { ...this, async single() { return { data: entry, error: null } }, select() { return this } }
  }
  async then(resolve) {
    resolve({ data: this.result, error: null })
  }
}

const mockClient = {
  auth: {
    getSession: async () => {
      const u = localStorage.getItem('fitsense_user')
      if (u) return { data: { session: { user: JSON.parse(u) } } }
      return { data: { session: null } }
    },
    onAuthStateChange: (cb) => {
      const u = localStorage.getItem('fitsense_user')
      setTimeout(() => cb(u ? 'SIGNED_IN' : 'SIGNED_OUT', u ? { user: JSON.parse(u) } : null), 10)
      return { data: { subscription: { unsubscribe: () => {} } } }
    },
    signUp: async ({ email, password, options }) => {
      const newUser = {
        id: 'usr_' + Date.now(),
        email,
        user_metadata: { full_name: options?.data?.full_name || 'User' },
        created_at: new Date().toISOString()
      }
      localStorage.setItem('fitsense_user', JSON.stringify(newUser))
      return { data: { user: newUser, session: { user: newUser } }, error: null }
    },
    signInWithPassword: async ({ email }) => {
      const existing = localStorage.getItem('fitsense_user')
      let user = existing ? JSON.parse(existing) : {
        id: 'usr_' + Date.now(),
        email,
        user_metadata: { full_name: 'User' },
        created_at: new Date().toISOString()
      }
      localStorage.setItem('fitsense_user', JSON.stringify(user))
      return { data: { user }, error: null }
    },
    signOut: async () => {
      localStorage.removeItem('fitsense_user')
      return { error: null }
    },
  },
  from: (table) => new MockQuery(table)
}

// ─── Export the active client ─────────────────────────────────────────────────
export const supabase = realClient || mockClient

// Export a flag so components can know which mode they are in
export const isSupabaseConnected = isConfigured
