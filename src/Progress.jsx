import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Plus, Scale, Calendar, Flame, Award, X } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import AppLayout from './AppLayout'
import { useProgress, useWeeklyTasks, useWorkoutStreak } from './useData'
import { calculateWeeklyScore } from './disciplineScore'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl p-3 font-body text-sm"
      style={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)' }}>
      <p className="text-white/40 text-xs mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} className="font-medium" style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }
})

export default function Progress() {
  const { data: progressData, logProgress } = useProgress(30)
  const { data: weeklyTasks } = useWeeklyTasks()
  const { data: streak } = useWorkoutStreak()

  const [showLogForm, setShowLogForm] = useState(false)
  const [logForm, setLogForm] = useState({ weight_kg: '', body_fat_pct: '', notes: '' })
  const [saving, setSaving] = useState(false)

  const weekScore = weeklyTasks?.length ? calculateWeeklyScore(weeklyTasks) : null

  const chartData = [...(progressData || [])].reverse().map(p => ({
    date: new Date(p.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: p.weight_kg,
    bodyFat: p.body_fat_pct,
  }))

  const weekDisciplineData = weeklyTasks?.slice(0, 7).reverse().map(t => ({
    day: new Date(t.task_date).toLocaleDateString('en-US', { weekday: 'short' }),
    score: Math.round(
      ((t.workout_completed ? 30 : 0) +
      (t.breakfast_completed ? 10 : 0) +
      (t.lunch_completed ? 10 : 0) +
      (t.dinner_completed ? 10 : 0) +
      (t.water_intake_ml >= t.water_goal_ml ? 20 : 0) +
      (t.steps_count >= t.steps_goal ? 15 : 0)) / 95 * 100
    ),
  })) || []

  const handleLogSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await logProgress({
      log_date: new Date().toISOString().split('T')[0],
      weight_kg: logForm.weight_kg ? parseFloat(logForm.weight_kg) : null,
      body_fat_pct: logForm.body_fat_pct ? parseFloat(logForm.body_fat_pct) : null,
      notes: logForm.notes || null,
    })
    setLogForm({ weight_kg: '', body_fat_pct: '', notes: '' })
    setShowLogForm(false)
    setSaving(false)
  }

  const latest = progressData?.[0]
  const oldest = progressData?.[progressData.length - 1]
  const weightChange = latest && oldest && latest !== oldest
    ? Math.round((latest.weight_kg - oldest.weight_kg) * 10) / 10 : null

  const STATS = [
    { label: 'Current Weight', value: latest?.weight_kg ? `${latest.weight_kg} kg` : '—', icon: Scale, color: '#0ea5e9' },
    { label: 'Weight Change', value: weightChange !== null ? `${weightChange > 0 ? '+' : ''}${weightChange} kg` : '—', sub: progressData?.length > 1 ? `${progressData.length} entries` : '', icon: TrendingUp, color: weightChange < 0 ? '#22c55e' : '#ef4444' },
    { label: 'Workout Streak', value: `${streak?.current_streak ?? 0}d`, icon: Flame, color: '#0ea5e9' },
    { label: 'Weekly Score', value: weekScore ? `${weekScore.pct}%` : '—', sub: weekScore?.grade, icon: Award, color: '#a855f7' },
  ]

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div {...fade(0)} className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="section-label mb-2">Analytics</p>
            <h1 className="font-display text-5xl text-white tracking-wide">PROGRESS</h1>
            <p className="font-body text-white/40 text-sm mt-1">Track your transformation over time</p>
          </div>
          <button onClick={() => setShowLogForm(!showLogForm)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-body text-sm font-semibold transition-all ${
              showLogForm ? 'text-white/60 hover:text-white' : 'btn-brand'
            }`}
            style={showLogForm ? { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' } : {}}>
            {showLogForm ? <><X className="w-4 h-4" />Cancel</> : <><Plus className="w-4 h-4" />Log Today</>}
          </button>
        </motion.div>

        {/* Log Form */}
        {showLogForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6"
            style={{ background: 'rgba(14, 165, 233,0.05)', border: '1px solid rgba(14, 165, 233,0.25)' }}>
            <h3 className="font-display text-xl text-white tracking-wide mb-5">LOG TODAY'S PROGRESS</h3>
            <form onSubmit={handleLogSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="section-label block mb-2">Weight (kg)</label>
                <input type="number" step="0.1" value={logForm.weight_kg}
                  onChange={e => setLogForm(f => ({ ...f, weight_kg: e.target.value }))}
                  placeholder="75.5" className="input-premium w-full px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="section-label block mb-2">Body Fat %</label>
                <input type="number" step="0.1" value={logForm.body_fat_pct}
                  onChange={e => setLogForm(f => ({ ...f, body_fat_pct: e.target.value }))}
                  placeholder="18.5" className="input-premium w-full px-4 py-3 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="section-label block mb-2">Notes</label>
                <input type="text" value={logForm.notes}
                  onChange={e => setLogForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Feeling strong today…" className="input-premium w-full px-4 py-3 text-sm" />
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <button type="submit" disabled={saving} className="btn-brand flex-1 py-3 text-sm disabled:opacity-50">
                  {saving ? 'Saving…' : 'Save Entry'}
                </button>
                <button type="button" onClick={() => setShowLogForm(false)}
                  className="px-6 py-3 rounded-xl font-body text-sm text-white/50 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Stats Row */}
        <motion.div {...fade(0.1)} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(stat => (
            <div key={stat.label} className="stat-card p-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: stat.color + '18', border: `1px solid ${stat.color}22` }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div className="font-display text-3xl text-white tabular-nums">{stat.value}</div>
              <div className="font-body text-white/40 text-xs mt-1 uppercase tracking-wide">{stat.label}</div>
              {stat.sub && <div className="font-body text-white/25 text-xs mt-0.5">{stat.sub}</div>}
            </div>
          ))}
        </motion.div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Weight Chart */}
          <motion.div {...fade(0.2)} className="rounded-2xl p-6"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h2 className="font-display text-xl text-white tracking-wide mb-0.5">WEIGHT TREND</h2>
            <p className="font-body text-white/30 text-xs mb-5">Last 30 days</p>
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'DM Sans' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'DM Sans' }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke="#0ea5e9" strokeWidth={2.5}
                    dot={{ fill: '#0ea5e9', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: '#0ea5e9', stroke: 'rgba(14, 165, 233,0.3)', strokeWidth: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center gap-2">
                <Scale className="w-8 h-8 text-white/10" />
                <p className="font-body text-white/20 text-sm">Log entries to see your trend</p>
              </div>
            )}
          </motion.div>

          {/* Discipline Chart */}
          <motion.div {...fade(0.25)} className="rounded-2xl p-6"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h2 className="font-display text-xl text-white tracking-wide mb-0.5">WEEKLY DISCIPLINE</h2>
            <p className="font-body text-white/30 text-xs mb-5">Last 7 days score</p>
            {weekDisciplineData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weekDisciplineData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'DM Sans' }} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'DM Sans' }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="score" name="Score (%)" radius={[6, 6, 0, 0]}>
                    {weekDisciplineData.map((entry, i) => (
                      <Cell key={i} fill={entry.score >= 80 ? '#22c55e' : entry.score >= 50 ? '#0ea5e9' : '#ef4444'} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center gap-2">
                <TrendingUp className="w-8 h-8 text-white/10" />
                <p className="font-body text-white/20 text-sm">Track daily tasks to see scores</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Progress Log */}
        {progressData?.length > 0 && (
          <motion.div {...fade(0.3)} className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="p-5 border-b border-white/5">
              <h2 className="font-display text-xl text-white tracking-wide">PROGRESS LOG</h2>
            </div>
            <div className="divide-y" style={{ '--tw-divide-opacity': 1 }}>
              {progressData.slice(0, 10).map(entry => (
                <div key={entry.id} className="flex items-center gap-4 p-4 hover:bg-white/2 transition-colors">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <Calendar className="w-4 h-4 text-white/30" />
                  </div>
                  <div className="flex-1">
                    <p className="font-body text-white text-sm font-medium">
                      {new Date(entry.log_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    {entry.notes && <p className="font-body text-white/30 text-xs mt-0.5">{entry.notes}</p>}
                  </div>
                  <div className="flex gap-5 text-right">
                    {entry.weight_kg && (
                      <div>
                        <div className="font-mono text-brand-400 text-sm">{entry.weight_kg} kg</div>
                        <div className="font-body text-white/25 text-xs">weight</div>
                      </div>
                    )}
                    {entry.body_fat_pct && (
                      <div>
                        <div className="font-mono text-black text-sm">{entry.body_fat_pct}%</div>
                        <div className="font-body text-white/25 text-xs">body fat</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  )
}
