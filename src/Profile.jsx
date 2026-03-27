import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Save, CheckCircle } from 'lucide-react'
import AppLayout from './AppLayout'
import { useAuth } from './AuthContext'
import { useHealthMetrics } from './useData'
import { supabase } from './supabase'
import { calculateFitnessProfile, calculateBMI } from './fitnessCalculator'

const ACTIVITY_OPTS = [
  ['sedentary', 'Sedentary'],
  ['lightly_active', 'Lightly Active'],
  ['moderately_active', 'Moderately Active'],
  ['very_active', 'Very Active'],
  ['extremely_active', 'Extremely Active'],
]

const GOAL_OPTS = [
  ['lean_body', 'Lean Body'],
  ['fat_loss', 'Fat Loss'],
  ['muscle_gain', 'Muscle Gain'],
  ['bulk', 'Bulk'],
]

const inputClass = 'input-premium w-full px-4 py-3 text-sm'
const selectClass = 'input-premium w-full px-4 py-3 text-sm appearance-none bg-dark-900'

export default function Profile() {
  const { user } = useAuth()
  const { data: metrics, refetch } = useHealthMetrics()
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { if (metrics) setForm({ ...metrics }) }, [metrics])

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const profile = calculateFitnessProfile({
        age: parseInt(form.age),
        gender: form.gender,
        heightCm: parseFloat(form.height_cm),
        weightKg: parseFloat(form.weight_kg),
        activityLevel: form.activity_level,
        fitnessGoal: form.fitness_goal,
      })
      const { error } = await supabase.from('health_metrics').upsert({
        user_id: user.id,
        age: parseInt(form.age),
        gender: form.gender,
        height_cm: parseFloat(form.height_cm),
        weight_kg: parseFloat(form.weight_kg),
        hemoglobin: form.hemoglobin ? parseFloat(form.hemoglobin) : null,
        blood_sugar: form.blood_sugar ? parseFloat(form.blood_sugar) : null,
        activity_level: form.activity_level,
        fitness_goal: form.fitness_goal,
        bmi: profile.bmi,
        bmr: profile.bmr,
        tdee: profile.tdee,
      }, { onConflict: 'user_id' })
      if (error) throw error
      refetch()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.message)
    }
    setSaving(false)
  }

  const bmi = form.weight_kg && form.height_cm ? calculateBMI(parseFloat(form.weight_kg), parseFloat(form.height_cm)) : null
  const initials = user?.user_metadata?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || user?.email?.[0]?.toUpperCase() || 'U'

  const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }
  })

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-5">
        {/* Header */}
        <motion.div {...fade(0)}>
          <p className="section-label mb-2">Account</p>
          <h1 className="font-display text-5xl text-white tracking-wide">PROFILE</h1>
          <p className="font-body text-white/40 text-sm mt-1">Update your health metrics and goals</p>
        </motion.div>

        {/* User Card */}
        <motion.div {...fade(0.1)} className="rounded-2xl p-5 flex items-center gap-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-display text-2xl text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(14, 165, 233,0.3), rgba(2, 132, 199,0.2))' }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-body text-white font-semibold">{user?.user_metadata?.full_name || 'User'}</p>
            <p className="font-body text-white/40 text-sm truncate">{user?.email}</p>
            <p className="font-mono text-white/20 text-xs mt-0.5">Member since {new Date(user?.created_at).toLocaleDateString()}</p>
          </div>
          {bmi && (
            <div className="text-right flex-shrink-0">
              <div className="font-display text-3xl text-white">{bmi.bmi}</div>
              <div className="font-body text-xs" style={{ color: bmi.color }}>{bmi.category}</div>
              <div className="section-label mt-0.5">BMI</div>
            </div>
          )}
        </motion.div>

        {/* Form */}
        <motion.form {...fade(0.15)} onSubmit={handleSave} className="space-y-4">
          {/* Personal Info */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="section-label mb-4">Personal Info</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="section-label block mb-2">Age</label>
                <input type="number" min="10" max="100" value={form.age || ''} onChange={e => update('age', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="section-label block mb-2">Gender</label>
                <select value={form.gender || ''} onChange={e => update('gender', e.target.value)} className={selectClass} style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Body Metrics */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="section-label mb-4">Body Metrics</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="section-label block mb-2">Height (cm)</label>
                <input type="number" value={form.height_cm || ''} onChange={e => update('height_cm', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="section-label block mb-2">Weight (kg)</label>
                <input type="number" step="0.1" value={form.weight_kg || ''} onChange={e => update('weight_kg', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="section-label block mb-2">Hemoglobin (g/dL)</label>
                <input type="number" step="0.1" value={form.hemoglobin || ''} onChange={e => update('hemoglobin', e.target.value)} placeholder="Optional" className={inputClass} />
              </div>
              <div>
                <label className="section-label block mb-2">Blood Sugar (mg/dL)</label>
                <input type="number" value={form.blood_sugar || ''} onChange={e => update('blood_sugar', e.target.value)} placeholder="Optional" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Training Profile */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(14, 165, 233, 0.08)', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
            <p className="section-label mb-4" style={{ color: '#38bdf8' }}>Training Profile</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="section-label block mb-2">Activity Level</label>
                <select value={form.activity_level || ''} onChange={e => update('activity_level', e.target.value)} className={selectClass} style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <option value="">Select</option>
                  {ACTIVITY_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="section-label block mb-2">Fitness Goal</label>
                <select value={form.fitness_goal || ''} onChange={e => update('fitness_goal', e.target.value)} className={selectClass} style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <option value="">Select</option>
                  {GOAL_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Calculated Stats */}
          {metrics && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'BMR', value: `${metrics.bmr?.toLocaleString()}`, unit: 'kcal' },
                { label: 'TDEE', value: `${metrics.tdee?.toLocaleString()}`, unit: 'kcal' },
                { label: 'BMI', value: metrics.bmi, unit: bmi?.category },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-4 text-center"
                  style={{ background: 'rgba(14, 165, 233,0.06)', border: '1px solid rgba(14, 165, 233,0.12)' }}>
                  <div className="font-display text-2xl text-brand-400 tabular-nums">{s.value}</div>
                  <div className="font-mono text-brand-600 text-xs">{s.unit}</div>
                  <div className="section-label mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className="font-body text-red-400 text-sm px-1">{error}</p>
          )}

          <button type="submit" disabled={saving}
            className="btn-brand w-full flex items-center justify-center gap-2 py-4 text-sm disabled:opacity-50">
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : saved ? (
              <><CheckCircle className="w-4 h-4" /> Saved!</>
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </motion.form>
      </div>
    </AppLayout>
  )
}
