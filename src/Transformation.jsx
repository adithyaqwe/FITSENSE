import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dumbbell, RefreshCw, Clock, Flame } from 'lucide-react'
import AppLayout from './AppLayout'
import { useAuth } from './AuthContext'
import { useHealthMetrics, useWorkoutPlan } from './useData'
import { generateWorkoutPlan } from './workoutGenerator'
import { supabase } from './supabase'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const DAY_COLORS = {
  Monday: '#000000', Tuesday: '#0ea5e9', Wednesday: '#22c55e',
  Thursday: '#a855f7', Friday: '#ef4444', Saturday: '#eab308', Sunday: '#6b7280',
}

const GOAL_OPTIONS = [
  { value: 'fat_loss', label: 'Fat Loss', emoji: '🔥' },
  { value: 'muscle_gain', label: 'Muscle Gain', emoji: '💪' },
  { value: 'lean_body', label: 'Lean Body', emoji: '⚡' },
  { value: 'bulk', label: 'Bulk', emoji: '🏋️' },
]

const LEVEL_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'extreme', label: 'Extreme' },
]

function ExerciseRow({ exercise, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0 group">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs text-white/30 flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.05)' }}>
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="font-body text-white font-medium text-sm">{exercise.name}</div>
        </div>
        <div className="font-body text-white/35 text-xs mt-0.5">{exercise.muscle} · {exercise.equipment}</div>
      </div>
      <div className="flex gap-4 flex-shrink-0">
        <div className="text-center">
          <div className="font-mono text-brand-400 text-sm font-bold">{exercise.sets}</div>
          <div className="font-body text-white/25 text-xs">sets</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-white text-sm font-bold">{exercise.reps}</div>
          <div className="font-body text-white/25 text-xs">reps</div>
        </div>
        <div className="text-center hidden sm:block">
          <div className="font-mono text-white/45 text-sm">{exercise.rest}</div>
          <div className="font-body text-white/25 text-xs">rest</div>
        </div>
      </div>
    </motion.div>
  )
}

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }
})

export default function Transformation() {
  const { user } = useAuth()
  const { data: metrics } = useHealthMetrics()
  const { data: savedPlan, refetch } = useWorkoutPlan()
  const [generating, setGenerating] = useState(false)
  const [currentPlan, setCurrentPlan] = useState(null)
  const [selectedDay, setSelectedDay] = useState(() => {
    const d = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return d[new Date().getDay()]
  })

  const activePlan = currentPlan || savedPlan?.plan_data
  const todayWorkout = activePlan?.week?.[selectedDay]

  const generatePlan = async (goal, level) => {
    if (!metrics) return
    setGenerating(true)
    const targetGoal = goal || metrics.fitness_goal
    const targetLevel = level || null // Only pass if manually selected
    const plan = generateWorkoutPlan(targetGoal, metrics.activity_level, targetLevel)
    
    await supabase.from('workout_plans').update({ is_active: false }).eq('user_id', user.id)
    const { error } = await supabase.from('workout_plans').insert({
      user_id: user.id, plan_name: plan.planName, goal: plan.goal,
      plan_data: plan, is_active: true, // removed 'level: plan.level' as it causes schema errors if column doesn't exist
    })
    
    if (error) console.error("Error saving plan:", error);
    
    setCurrentPlan(plan);
    if (!error) refetch();
    setGenerating(false)
  }

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div {...fade(0)} className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="section-label mb-2">Training</p>
            <h1 className="font-display text-5xl text-white tracking-wide">TRANSFORMATION</h1>
            <p className="font-body text-white/40 text-sm mt-1">Your personalized weekly workout program</p>
            {activePlan && (
              <div className="flex flex-col gap-4 mt-5 bg-white/2 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="section-label min-w-[60px]">Select Goal</span>
                  <div className="flex gap-2 flex-wrap">
                    {GOAL_OPTIONS.map(g => (
                      <button 
                        key={g.value} 
                        onClick={() => generatePlan(g.value, activePlan.level)}
                        className={`badge transition-all hover:scale-105 active:scale-95 ${activePlan.goal === g.value ? 'badge-brand px-4 py-1.5' : 'bg-white/5 text-white/30 hover:bg-white/10 hover:text-white/60'}`}
                      >
                        <span className="text-base mr-1">{g.emoji}</span> {g.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap border-t border-white/5 pt-3">
                  <span className="section-label min-w-[60px]">Intensity</span>
                  <div className="flex gap-2 flex-wrap">
                    {LEVEL_OPTIONS.map(l => (
                      <button 
                        key={l.value} 
                        onClick={() => generatePlan(activePlan.goal, l.value)}
                        className={`badge transition-all hover:scale-105 active:scale-95 ${activePlan.level === l.value ? 'badge-brand px-4 py-1.5' : 'bg-white/5 text-white/30 hover:bg-white/10 hover:text-white/60'}`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <button onClick={() => generatePlan(activePlan?.goal, activePlan?.level)} disabled={!metrics || generating}
            className="btn-brand flex items-center gap-2.5 px-5 py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed">
            <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
            {generating ? 'Generating…' : activePlan ? 'Regenerate' : 'Generate Program'}
          </button>
        </motion.div>

        {/* No profile */}
        {!metrics && (
          <motion.div {...fade(0.1)} className="rounded-2xl p-12 text-center"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <Dumbbell className="w-7 h-7 text-white/20" />
            </div>
            <p className="font-body text-white/40 text-sm">Complete your health profile to generate a workout program.</p>
          </motion.div>
        )}

        {/* No plan yet */}
        {metrics && !activePlan && !generating && (
          <motion.div {...fade(0.1)} className="rounded-2xl p-12 text-center"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'rgba(14, 165, 233,0.1)', border: '1px solid rgba(14, 165, 233,0.2)' }}>
              <Flame className="w-7 h-7 text-brand-400" />
            </div>
            <p className="font-body text-white font-semibold mb-2">Ready to transform?</p>
            <p className="font-body text-white/40 text-sm mb-6">Generate your personalized weekly workout program</p>
            <button onClick={() => generatePlan()} className="btn-brand px-8 py-3 text-sm mx-auto">Start Transformation</button>
          </motion.div>
        )}

        {generating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl p-12 text-center"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(14, 165, 233,0.15)' }}>
            <div className="w-10 h-10 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="font-body text-white/50 text-sm">Building your transformation program…</p>
          </motion.div>
        )}

        {/* Active Plan */}
        {activePlan && !generating && (
          <div className="grid lg:grid-cols-3 gap-5">
            {/* Day selector */}
            <div className="space-y-2">
              <p className="section-label mb-3">Weekly Split</p>
              {DAYS.map(day => {
                const w = activePlan.week?.[day]
                const color = DAY_COLORS[day]
                const isActive = selectedDay === day
                const isRest = w?.type === 'rest'
                return (
                  <button key={day} onClick={() => setSelectedDay(day)}
                    className="w-full text-left p-3.5 rounded-xl border transition-all"
                    style={isActive
                      ? { background: `${color}15`, borderColor: `${color}40`, boxShadow: `0 0 20px ${color}10` }
                      : { background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{w?.emoji || '💪'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="section-label">{day}</div>
                        <div className={`font-body text-sm font-medium mt-0.5 truncate ${isActive ? 'text-white' : 'text-white/60'}`}>{w?.name}</div>
                      </div>
                      {!isRest && w?.duration > 0 && (
                        <div className="flex items-center gap-1 text-white/25 flex-shrink-0">
                          <Clock className="w-3 h-3" />
                          <span className="font-mono text-xs">{w.duration}m</span>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Workout Detail */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {todayWorkout && (
                  <motion.div key={`${selectedDay}-${activePlan?.generatedAt}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      {/* Header */}
                      <div className="p-6 border-b border-white/5"
                        style={{ background: `linear-gradient(135deg, ${DAY_COLORS[selectedDay]}10, transparent)` }}>
                        <div className="flex items-center gap-4">
                          <span className="text-4xl">{todayWorkout.emoji}</span>
                          <div>
                            <p className="section-label mb-1">{selectedDay}</p>
                            <h3 className="font-display text-3xl text-white tracking-wide">{todayWorkout.name?.toUpperCase()}</h3>
                          </div>
                        </div>
                        {todayWorkout.duration > 0 && (
                          <div className="flex gap-5 mt-4">
                            <div className="flex items-center gap-2 text-white/40 text-sm font-body">
                              <Clock className="w-4 h-4" />
                              ~{todayWorkout.duration} minutes
                            </div>
                            <div className="flex items-center gap-2 text-white/40 text-sm font-body">
                              <Dumbbell className="w-4 h-4" />
                              {todayWorkout.exercises?.length} exercises
                            </div>
                          </div>
                        )}
                      </div>

                      {todayWorkout.type === 'rest' ? (
                        <div className="p-12 text-center">
                          <p className="text-5xl mb-4">😴</p>
                          <p className="font-body text-white font-medium">Rest & Recovery Day</p>
                          <p className="font-body text-white/40 text-sm mt-2">{todayWorkout.notes}</p>
                        </div>
                      ) : (
                        <div className="p-6 space-y-6">
                          {/* Warmup */}
                          {todayWorkout.warmup?.length > 0 && (
                            <div>
                              <p className="section-label mb-3">Warm-up</p>
                              <div className="space-y-1.5">
                                {todayWorkout.warmup.map((item, i) => (
                                  <div key={i} className="flex items-center gap-2.5 font-body text-sm text-white/55">
                                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400/50 flex-shrink-0" />
                                    {item}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Exercises */}
                          <div>
                            <p className="section-label mb-2">Exercises</p>
                            {todayWorkout.exercises?.map((exercise, i) => (
                              <ExerciseRow key={i} exercise={exercise} index={i} />
                            ))}
                          </div>

                          {/* Cooldown */}
                          {todayWorkout.cooldown?.length > 0 && (
                            <div>
                              <p className="section-label mb-3">Cool-down</p>
                              <div className="space-y-1.5">
                                {todayWorkout.cooldown.map((item, i) => (
                                  <div key={i} className="flex items-center gap-2.5 font-body text-sm text-white/55">
                                    <div className="w-1.5 h-1.5 rounded-full bg-black/50 flex-shrink-0" />
                                    {item}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

    </AppLayout>
  )
}
