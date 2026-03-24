import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckSquare, Droplets, Footprints, Dumbbell, Utensils, Plus, X, Zap } from 'lucide-react'
import AppLayout from './AppLayout'
import { useTodayTasks } from './useData'
import { calculateDisciplineScore, getMotivationalMessage } from './disciplineScore'

function ProgressRing({ pct, size = 90, stroke = 7, color = '#0ea5e9' }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.7s ease', filter: `drop-shadow(0 0 6px ${color}60)` }} />
    </svg>
  )
}

function TaskToggle({ label, done, onToggle, icon: Icon, color }) {
  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left"
      style={done
        ? { backgroundColor: color + '12', borderColor: color + '30', boxShadow: `inset 0 0 20px ${color}08` }
        : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
        style={done ? { background: color + '25' } : { background: 'rgba(255,255,255,0.06)' }}>
        <Icon className="w-4 h-4" style={{ color: done ? color : 'rgba(255,255,255,0.4)' }} />
      </div>
      <span className={`font-body font-medium text-sm flex-1 transition-colors ${done ? 'text-white' : 'text-white/50'}`}>{label}</span>
      <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
        style={done ? { background: color, borderColor: color } : { borderColor: 'rgba(255,255,255,0.15)' }}>
        {done && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </motion.button>
  )
}

function NumericTracker({ label, value, onChange, goal, unit, color, icon: Icon }) {
  const pct = Math.min(100, Math.round((value / goal) * 100))
  const step = unit === 'ml' ? 250 : 1000

  return (
    <div className="rounded-2xl p-5"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: color + '18' }}>
            <Icon className="w-3.5 h-3.5" style={{ color }} />
          </div>
          <span className="font-body text-white/60 text-sm">{label}</span>
        </div>
        <span className="badge" style={{ background: color + '15', color, border: `1px solid ${color}25`, fontSize: 10 }}>{pct}%</span>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => onChange(Math.max(0, value - step))}
          className="w-9 h-9 rounded-xl font-mono text-white/60 hover:text-white text-lg transition-all flex items-center justify-center hover:scale-110"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>−</button>
        <div className="flex-1 text-center">
          <span className="font-display text-3xl text-white tabular-nums">{value.toLocaleString()}</span>
          <span className="font-body text-white/25 text-xs ml-1.5">{unit}</span>
        </div>
        <button onClick={() => onChange(Math.min(goal * 2, value + step))}
          className="w-9 h-9 rounded-xl font-mono text-white/60 hover:text-white text-lg transition-all flex items-center justify-center hover:scale-110"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>+</button>
      </div>
      <div className="progress-bar">
        <motion.div className="progress-fill"
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ background: pct >= 100 ? color : `linear-gradient(90deg, ${color}80, ${color})`, boxShadow: pct >= 90 ? `0 0 8px ${color}60` : 'none' }} />
      </div>
      <div className="font-body text-white/20 text-xs mt-2 text-right">Goal: {goal.toLocaleString()} {unit}</div>
    </div>
  )
}

export default function DailyTracker() {
  const { data: tasks, loading, upsert } = useTodayTasks()
  const [saving, setSaving] = useState(false)
  const [newTask, setNewTask] = useState('')
  const [localTasks, setLocalTasks] = useState(null)

  useEffect(() => {
    if (tasks && !localTasks) setLocalTasks(tasks)
  }, [tasks]) // eslint-disable-line

  const current = localTasks || tasks || {
    workout_completed: false,
    breakfast_completed: false,
    lunch_completed: false,
    dinner_completed: false,
    snacks_completed: false,
    water_intake_ml: 0,
    water_goal_ml: 3000,
    steps_count: 0,
    steps_goal: 10000,
    custom_tasks: [],
  }

  const score = calculateDisciplineScore(current)

  const toggle = async (field) => {
    const updated = { ...current, [field]: !current[field] }
    setLocalTasks(updated)
    setSaving(true)
    await upsert(updated)
    setSaving(false)
  }

  const updateNumeric = async (field, value) => {
    const updated = { ...current, [field]: value }
    setLocalTasks(updated)
    await upsert(updated)
  }

  const addCustomTask = async () => {
    if (!newTask.trim()) return
    const tasks_list = [...(current.custom_tasks || []), { text: newTask.trim(), completed: false, id: Date.now() }]
    const updated = { ...current, custom_tasks: tasks_list }
    setLocalTasks(updated)
    setNewTask('')
    await upsert(updated)
  }

  const toggleCustomTask = async (id) => {
    const tasks_list = (current.custom_tasks || []).map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    const updated = { ...current, custom_tasks: tasks_list }
    setLocalTasks(updated)
    await upsert(updated)
  }

  const removeCustomTask = async (id) => {
    const tasks_list = (current.custom_tasks || []).filter(t => t.id !== id)
    const updated = { ...current, custom_tasks: tasks_list }
    setLocalTasks(updated)
    await upsert(updated)
  }

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
          <p className="section-label mb-2">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <div className="flex items-center justify-between">
            <h1 className="font-display text-5xl text-white tracking-wide">DAILY TRACKER</h1>
            {saving && (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
                <span className="font-body text-white/30 text-xs">Saving…</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Discipline Score Card */}
        <motion.div {...fade(0.1)}
          className="rounded-2xl p-6 flex items-center gap-6"
          style={{ background: `linear-gradient(135deg, ${score.color}0d, rgba(8,15,26,0.8))`, border: `1px solid ${score.color}25` }}>
          <div className="relative flex-shrink-0">
            <ProgressRing pct={score.pct} color={score.color} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-xl text-white tabular-nums">{score.pct}%</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="section-label mb-1">Discipline Score</p>
            <div className="font-display text-3xl tracking-wide" style={{ color: score.color }}>{score.grade.toUpperCase()}</div>
            <p className="font-body text-white/45 text-sm mt-1">{getMotivationalMessage(score.pct)}</p>
          </div>
        </motion.div>

        {/* Core Tasks */}
        <motion.div {...fade(0.15)} className="rounded-2xl p-5"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="section-label mb-3">Core Tasks</p>
          <div className="space-y-2">
            <TaskToggle label="Workout Completed" done={current.workout_completed} onToggle={() => toggle('workout_completed')} icon={Dumbbell} color="#0ea5e9" />
            <TaskToggle label="Breakfast" done={current.breakfast_completed} onToggle={() => toggle('breakfast_completed')} icon={Utensils} color="#22c55e" />
            <TaskToggle label="Lunch" done={current.lunch_completed} onToggle={() => toggle('lunch_completed')} icon={Utensils} color="#22c55e" />
            <TaskToggle label="Dinner" done={current.dinner_completed} onToggle={() => toggle('dinner_completed')} icon={Utensils} color="#22c55e" />
            <TaskToggle label="Snacks" done={current.snacks_completed} onToggle={() => toggle('snacks_completed')} icon={Utensils} color="#84cc16" />
          </div>
        </motion.div>

        {/* Water + Steps */}
        <motion.div {...fade(0.2)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumericTracker label="Water Intake" value={current.water_intake_ml} onChange={v => updateNumeric('water_intake_ml', v)} goal={current.water_goal_ml} unit="ml" color="#000000" icon={Droplets} />
          <NumericTracker label="Steps" value={current.steps_count} onChange={v => updateNumeric('steps_count', v)} goal={current.steps_goal} unit="steps" color="#a855f7" icon={Footprints} />
        </motion.div>

        {/* Custom Tasks */}
        <motion.div {...fade(0.25)} className="rounded-2xl p-5"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="section-label mb-4">Custom Tasks</p>
          <div className="flex gap-2 mb-4">
            <input value={newTask} onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustomTask()}
              placeholder="Add a task (press Enter)" maxLength={60}
              className="input-premium flex-1 px-4 py-3 text-sm" />
            <button onClick={addCustomTask}
              className="btn-brand w-11 h-11 flex items-center justify-center flex-shrink-0">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {(!current.custom_tasks || current.custom_tasks.length === 0) && (
            <p className="font-body text-white/20 text-sm text-center py-6">No custom tasks yet. Add one above!</p>
          )}

          <div className="space-y-2">
            {(current.custom_tasks || []).map(task => (
              <motion.div key={task.id}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 rounded-xl border transition-all"
                style={task.completed
                  ? { background: 'rgba(14, 165, 233,0.08)', borderColor: 'rgba(14, 165, 233,0.2)' }
                  : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
                <button onClick={() => toggleCustomTask(task.id)}
                  className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all"
                  style={task.completed ? { background: '#0ea5e9', borderColor: '#0ea5e9' } : { borderColor: 'rgba(255,255,255,0.2)' }}>
                  {task.completed && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </button>
                <span className={`font-body text-sm flex-1 ${task.completed ? 'text-white/35 line-through' : 'text-white/80'}`}>{task.text}</span>
                <button onClick={() => removeCustomTask(task.id)} className="text-white/20 hover:text-red-400 transition-colors p-1">
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  )
}
