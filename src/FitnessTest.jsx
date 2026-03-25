import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Activity, ChevronRight, ChevronLeft, Save, HelpCircle } from 'lucide-react'
import { useAuth } from './AuthContext'
import { supabase } from './supabase'
import AppLayout from './AppLayout'

const TEST_CARDS = [
  { id: 'pushups', name: 'Push-ups', unit: 'reps', desc: 'Chest and triceps endurance (unbroken)', color: '#0ea5e9', tip: 'Keep your body in a straight line from head to heels.' },
  { id: 'plank', name: 'Forearm Plank', unit: 'sec', desc: 'Core stability and endurance', color: '#8b5cf6', tip: 'Do not let your hips sag or rise too high.' },
  { id: 'squats', name: 'Bodyweight Squats', unit: 'reps', desc: 'Lower body muscular endurance (1 min)', color: '#10b981', tip: 'Keep your chest up and weight on your heels.' },
  { id: 'flexibility', name: 'Sit & Reach', unit: 'cm', desc: 'Hamstring and lower back flexibility', color: '#f59e0b', tip: 'Reach as far as possible without bouncing.' },
]

export default function FitnessTest() {
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [values, setValues] = useState({ pushups: '', plank: '', squats: '', flexibility: '' })
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState(null)

  const current = TEST_CARDS[step]

  const calculateScore = () => {
    const p = parseInt(values.pushups) || 0
    const pl = parseInt(values.plank) || 0
    const s = parseInt(values.squats) || 0
    const f = parseInt(values.flexibility) || 0
    
    let score = 0
    if (p > 10) score += 20; if (p > 25) score += 20; if (p > 40) score += 10
    if (pl > 30) score += 10; if (pl > 60) score += 15; if (pl > 120) score += 10
    if (s > 20) score += 10; if (s > 40) score += 10; if (s > 60) score += 10
    if (f > 0) score += 10; if (f > 10) score += 5
    
    return Math.min(score, 100)
  }

  const handleFinish = async () => {
    setSaving(true)
    const score = calculateScore()
    setResult(score)
    try {
      await supabase.from('daily_logs').insert({
        user_id: user.id,
        log_date: new Date().toISOString().split('T')[0],
        notes: `Fitness Assessment: Pushups: ${values.pushups}, Plank: ${values.plank}s, Squats: ${values.squats}, Flexibility: ${values.flexibility}cm. Score: ${score}`
      })
    } catch (e) {
      console.error(e)
    }
    setSaving(false)
  }

  return (
    <AppLayout>
      <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-brand-500" />
            </div>
            <h1 className="font-display text-3xl text-white tracking-wider">FITNESS TEST</h1>
          </div>
          <p className="text-white/40 font-body text-sm max-w-xl">
            Essential assessment for gym progress. Retest every 4 weeks to track your strength, endurance, and flexibility.
          </p>
        </div>

        {!result ? (
          <div className="max-w-2xl mx-auto py-12">
            {/* Progress bar */}
            <div className="w-full h-1 bg-white/5 rounded-full mb-12 flex">
              {TEST_CARDS.map((_, i) => (
                <div key={i} className={`flex-1 h-full rounded-full transition-all duration-500 ${i <= step ? 'bg-brand-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]' : ''}`} />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-premium p-8 rounded-3xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                  <Activity size={180} />
                </div>

                <div className="relative z-10">
                  <span className="text-brand-400 font-mono text-xs font-bold tracking-widest uppercase mb-4 block">Test {step + 1} of 4</span>
                  <h2 className="text-4xl font-display text-white mb-2" style={{ color: current.color }}>{current.name}</h2>
                  <p className="text-white/60 mb-8 max-w-md">{current.desc}</p>

                  <div className="flex items-end gap-4 mb-10">
                    <div className="flex-1">
                      <label className="section-label block mb-3">Your Result ({current.unit})</label>
                      <input 
                        type="number"
                        value={values[current.id]}
                        onChange={e => setValues(prev => ({ ...prev, [current.id]: e.target.value }))}
                        placeholder="0"
                        className="input-premium w-full text-4xl py-4"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 flex gap-3 border border-white/5">
                    <HelpCircle className="w-5 h-5 text-brand-400 flex-shrink-0" />
                    <p className="text-xs text-white/40 leading-relaxed italic">{current.tip}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-8">
              <button 
                onClick={() => setStep(s => s - 1)}
                disabled={step === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white/40 hover:text-white transition-all disabled:opacity-0"
              >
                <ChevronLeft size={20} /> Back
              </button>
              <button 
                onClick={step === 3 ? handleFinish : () => setStep(s => s + 1)}
                className="flex items-center gap-2 btn-brand px-8 py-3"
              >
                {step === 3 ? (saving ? 'Saving...' : 'Finish Assessment') : 'Next Test'} <ChevronRight size={20} />
              </button>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto py-12 text-center"
          >
            <div className="glass-premium p-10 rounded-full w-48 h-48 mx-auto flex flex-col items-center justify-center border-4 border-brand-500 shadow-[0_0_30px_rgba(14,165,233,0.3)] mb-8">
              <span className="text-5xl font-display text-white">{result}</span>
              <span className="text-xs text-brand-400 font-bold">SCORE</span>
            </div>

            <h2 className="text-3xl font-display text-white mb-4">ASSESSMENT COMPLETE</h2>
            <p className="text-white/50 mb-10">
              {result > 80 ? "Elite Level! You're in peak condition." : result > 50 ? "Solid Base! Keep training to reach elite status." : "Good Start! Consistency is key to improvement."}
            </p>

            <button onClick={() => window.location.reload()} className="btn-brand px-10 py-4 w-full">
              Done & Update Profile
            </button>
          </motion.div>
        )}
      </div>
    </AppLayout>
  )
}
