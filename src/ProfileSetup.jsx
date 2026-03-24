import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { useAuth } from './AuthContext'
import { supabase } from './supabase'
import { calculateFitnessProfile } from './fitnessCalculator'

const STEPS = ['Personal Info', 'Body Metrics', 'Health Markers', 'Your Goal']

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
  { value: 'lightly_active', label: 'Lightly Active', desc: '1-3 days/week' },
  { value: 'moderately_active', label: 'Moderately Active', desc: '3-5 days/week' },
  { value: 'very_active', label: 'Very Active', desc: '6-7 days/week' },
  { value: 'extremely_active', label: 'Extremely Active', desc: 'Physical job + training' },
]

const GOAL_OPTIONS = [
  { value: 'lean_body', label: 'Lean Body', desc: 'Toned, defined physique', emoji: '⚡' },
  { value: 'fat_loss', label: 'Fat Loss', desc: 'Burn fat, preserve muscle', emoji: '🔥' },
  { value: 'muscle_gain', label: 'Muscle Gain', desc: 'Build size and strength', emoji: '💪' },
  { value: 'bulk', label: 'Bulk', desc: 'Maximum mass building', emoji: '🏋️' },
]

const inputClass = 'input-premium w-full px-4 py-3 text-sm'

export default function ProfileSetup() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    age: '', gender: '', height_cm: '', weight_kg: '',
    hemoglobin: '', blood_sugar: '', activity_level: '', fitness_goal: '',
  })

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const canAdvance = () => {
    if (step === 0) return form.age && form.gender
    if (step === 1) return form.height_cm && form.weight_kg && form.activity_level
    if (step === 2) return true
    if (step === 3) return form.fitness_goal
    return false
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError('')
    try {
      const profile = calculateFitnessProfile({
        age: parseInt(form.age), gender: form.gender,
        heightCm: parseFloat(form.height_cm), weightKg: parseFloat(form.weight_kg),
        activityLevel: form.activity_level, fitnessGoal: form.fitness_goal,
      })
      const { error } = await supabase.from('health_metrics').upsert({
        user_id: user.id,
        age: parseInt(form.age), gender: form.gender,
        height_cm: parseFloat(form.height_cm), weight_kg: parseFloat(form.weight_kg),
        hemoglobin: form.hemoglobin ? parseFloat(form.hemoglobin) : null,
        blood_sugar: form.blood_sugar ? parseFloat(form.blood_sugar) : null,
        activity_level: form.activity_level, fitness_goal: form.fitness_goal,
        bmi: profile.bmi, bmr: profile.bmr, tdee: profile.tdee,
      }, { onConflict: 'user_id' })
      if (error) throw error
      navigate('/dashboard')
    } catch (e) {
      setError(e.message)
      setSaving(false)
    }
  }

  const pct = ((step) / STEPS.length) * 100

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(14, 165, 233,0.055) 0%, transparent 70%)' }} />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="w-full max-w-lg relative">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              border: '1px solid rgba(14, 165, 233, 0.4)',
            }}>
            <Zap className="w-4 h-4 text-white" fill="currentColor" />
          </div>
          <span className="font-display text-2xl tracking-[0.25em] text-[#e0f2fe] drop-shadow-[0_0_10px_rgba(14, 165, 233,0.5)] border-b-2 border-brand-500 pb-1">FITSENSE</span>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center gap-1 mb-4">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-1 flex-1 last:flex-none">
                <motion.div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 border-2 transition-all duration-300"
                  style={i < step
                    ? { background: '#0ea5e9', borderColor: '#0ea5e9', color: 'white' }
                    : i === step
                    ? { background: 'rgba(14, 165, 233,0.15)', borderColor: '#0ea5e9', color: '#38bdf8' }
                    : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.2)' }}>
                  {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </motion.div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-px transition-colors duration-500"
                    style={{ background: i < step ? '#0ea5e9' : 'rgba(255,255,255,0.08)' }} />
                )}
              </div>
            ))}
          </div>
          <div>
            <p className="section-label">Step {step + 1} of {STEPS.length}</p>
            <p className="font-body text-white font-semibold mt-0.5">{STEPS[step]}</p>
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl p-7 mb-5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>

            {/* Step 0 – Personal */}
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="font-display text-3xl text-white tracking-wide">PERSONAL INFO</h2>
                <div>
                  <label className="section-label block mb-2">Age</label>
                  <input type="number" min="10" max="100" value={form.age} onChange={e => update('age', e.target.value)}
                    placeholder="25" className={inputClass} />
                </div>
                <div>
                  <label className="section-label block mb-3">Gender</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['male', 'female', 'other'].map(g => (
                      <button key={g} onClick={() => update('gender', g)}
                        className="py-3 rounded-xl font-body text-sm font-medium capitalize transition-all border-2"
                        style={form.gender === g
                          ? { background: 'rgba(14, 165, 233,0.15)', borderColor: '#0ea5e9', color: 'white' }
                          : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1 – Body */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="font-display text-3xl text-white tracking-wide">BODY METRICS</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="section-label block mb-2">Height (cm)</label>
                    <input type="number" value={form.height_cm} onChange={e => update('height_cm', e.target.value)}
                      placeholder="175" className={inputClass} />
                  </div>
                  <div>
                    <label className="section-label block mb-2">Weight (kg)</label>
                    <input type="number" value={form.weight_kg} onChange={e => update('weight_kg', e.target.value)}
                      placeholder="75" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="section-label block mb-3">Activity Level</label>
                  <div className="space-y-2">
                    {ACTIVITY_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => update('activity_level', opt.value)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all border-2 text-left"
                        style={form.activity_level === opt.value
                          ? { background: 'rgba(14, 165, 233,0.12)', borderColor: 'rgba(14, 165, 233,0.4)', color: 'white' }
                          : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
                        <span className="font-body text-sm font-medium">{opt.label}</span>
                        <span className="font-body text-xs opacity-60">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 – Health */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-3xl text-white tracking-wide">HEALTH MARKERS</h2>
                  <p className="font-body text-white/40 text-sm mt-1">Optional — helps personalize your plan</p>
                </div>
                <div>
                  <label className="section-label block mb-2">Hemoglobin (g/dL)</label>
                  <input type="number" step="0.1" value={form.hemoglobin} onChange={e => update('hemoglobin', e.target.value)}
                    placeholder="13.5" className={inputClass} />
                  <p className="font-body text-white/25 text-xs mt-1.5">Normal: 12–17 g/dL</p>
                </div>
                <div>
                  <label className="section-label block mb-2">Blood Sugar (mg/dL)</label>
                  <input type="number" value={form.blood_sugar} onChange={e => update('blood_sugar', e.target.value)}
                    placeholder="90" className={inputClass} />
                  <p className="font-body text-white/25 text-xs mt-1.5">Fasting normal: 70–100 mg/dL</p>
                </div>
              </div>
            )}

            {/* Step 3 – Goal */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="font-display text-3xl text-white tracking-wide">YOUR GOAL</h2>
                <div className="grid grid-cols-2 gap-3">
                  {GOAL_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => update('fitness_goal', opt.value)}
                      className="flex flex-col items-start p-4 rounded-xl transition-all text-left border-2"
                      style={form.fitness_goal === opt.value
                        ? { background: 'rgba(14, 165, 233,0.12)', borderColor: 'rgba(14, 165, 233,0.4)' }
                        : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
                      <span className="text-2xl mb-3">{opt.emoji}</span>
                      <span className="font-body text-sm font-semibold text-white">{opt.label}</span>
                      <span className="font-body text-xs text-white/40 mt-0.5">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && <p className="font-body text-red-400 text-sm mb-4 text-center">{error}</p>}

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-body text-sm text-white/50 hover:text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}
          <button
            onClick={step < STEPS.length - 1 ? () => setStep(s => s + 1) : handleSubmit}
            disabled={!canAdvance() || saving}
            className="btn-brand flex-1 flex items-center justify-center gap-2 py-3 text-sm disabled:opacity-40">
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>{step < STEPS.length - 1 ? 'Continue' : 'Start Transformation'}<ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
