import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame, Zap, Dumbbell, Utensils, TrendingUp, ChevronRight, Activity, ArrowUpRight } from 'lucide-react'
import AppLayout from './AppLayout'
import { useAuth } from './AuthContext'
import { useHealthMetrics, useTodayTasks, useWeeklyTasks, useWorkoutStreak } from './useData'
import { calculateDisciplineScore, calculateWeeklyScore, getMotivationalMessage } from './disciplineScore'
import { calculateBMI } from './fitnessCalculator'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
})

function StatCard({ label, value, sub, icon: Icon, color, delay }) {
  return (
    <motion.div {...fade(delay)} className="stat-card p-5 group cursor-default">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ background: color + '18', border: `1px solid ${color}20` }}>
          <Icon className="w-4.5 h-4.5" style={{ color }} />
        </div>
        {sub && <span className="badge badge-brand text-[10px]">{sub}</span>}
      </div>
      <div className="font-display text-4xl text-white tracking-wide tabular-nums">{value}</div>
      <div className="font-body text-white/45 text-xs mt-1.5 tracking-wide uppercase">{label}</div>
    </motion.div>
  )
}

const QUICK_ACTIONS = [
  { label: 'Diet Plan', sub: 'Macro tracking', icon: Utensils, path: '/diet', color: '#22c55e' },
  { label: 'Workout', sub: 'Training plan', icon: Dumbbell, path: '/transformation', color: '#0ea5e9' },
  { label: 'Tracker', sub: 'Daily habits', icon: Activity, path: '/tracker', color: '#000000' },
  { label: 'Progress', sub: 'Analytics', icon: TrendingUp, path: '/progress', color: '#a855f7' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: metrics } = useHealthMetrics()
  const { data: todayTasks } = useTodayTasks()
  const { data: weeklyTasks } = useWeeklyTasks()
  const { data: streak } = useWorkoutStreak()

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Athlete'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

  const dayScore = todayTasks ? calculateDisciplineScore(todayTasks) : null
  const weekScore = weeklyTasks?.length ? calculateWeeklyScore(weeklyTasks) : null
  const bmi = metrics ? calculateBMI(metrics.weight_kg, metrics.height_cm) : null

  const TODAY_ITEMS = todayTasks ? [
    { label: 'Workout', done: todayTasks.workout_completed, color: '#0ea5e9' },
    { label: 'Meals', done: todayTasks.breakfast_completed && todayTasks.lunch_completed && todayTasks.dinner_completed, color: '#22c55e' },
    { label: 'Water', done: todayTasks.water_intake_ml >= todayTasks.water_goal_ml, progress: Math.min(100, (todayTasks.water_intake_ml / todayTasks.water_goal_ml) * 100), sub: `${todayTasks.water_intake_ml}ml / ${todayTasks.water_goal_ml}ml`, color: '#000000' },
    { label: 'Steps', done: todayTasks.steps_count >= todayTasks.steps_goal, progress: Math.min(100, (todayTasks.steps_count / todayTasks.steps_goal) * 100), sub: `${todayTasks.steps_count?.toLocaleString()} / ${todayTasks.steps_goal?.toLocaleString()}`, color: '#a855f7' },
  ] : []

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <motion.div {...fade(0)}>
          <p className="section-label mb-2">{greeting}</p>
          <div className="flex items-end gap-4 flex-wrap">
            <h1 className="font-display text-6xl lg:text-7xl text-white tracking-wide leading-none">
              {firstName.toUpperCase()}
              <span className="text-gradient-brand ml-3">⚡</span>
            </h1>
            {dayScore && (
              <span className="badge badge-brand mb-2">{dayScore.grade} Today</span>
            )}
          </div>
          {dayScore && (
            <p className="font-body text-white/45 mt-3 text-sm">{getMotivationalMessage(dayScore.pct)}</p>
          )}
        </motion.div>

        {/* Profile Setup CTA */}
        {!metrics && (
          <motion.div {...fade(0.05)}
            className="relative overflow-hidden rounded-2xl p-6 flex items-center justify-between gap-4"
            style={{ background: 'linear-gradient(135deg, rgba(14, 165, 233,0.12), rgba(2, 132, 199,0.06))', border: '1px solid rgba(14, 165, 233,0.2)' }}>
            <div className="absolute top-0 right-0 w-64 h-full opacity-5"
              style={{ background: 'radial-gradient(circle at 100% 50%, #0ea5e9, transparent)' }} />
            <div>
              <p className="font-body text-white font-semibold">Complete your health profile</p>
              <p className="font-body text-white/45 text-sm mt-0.5">Set up your metrics to unlock personalized AI plans</p>
            </div>
            <button onClick={() => navigate('/profile-setup')}
              className="btn-brand flex-shrink-0 flex items-center gap-2 px-5 py-2.5 text-sm">
              Set Up <ArrowUpRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Discipline Score" value={dayScore ? `${dayScore.pct}%` : '—'} sub={dayScore?.grade} icon={Zap} color="#0ea5e9" delay={0.1} />
          <StatCard label="Weekly Score" value={weekScore ? `${weekScore.pct}%` : '—'} sub={weekScore?.grade} icon={Flame} color="#ef4444" delay={0.15} />
          <StatCard label="Workout Streak" value={streak?.current_streak ?? '—'} sub="days" icon={Dumbbell} color="#22c55e" delay={0.2} />
          <StatCard label="BMI" value={bmi?.bmi ?? '—'} sub={bmi?.category} icon={Activity} color="#000000" delay={0.25} />
        </div>

        {/* Quick Actions */}
        <motion.div {...fade(0.3)}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl text-white tracking-wide">QUICK ACCESS</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {QUICK_ACTIONS.map(({ label, sub, icon: Icon, path, color }) => (
              <button key={path} onClick={() => navigate(path)}
                className="group stat-card p-5 flex flex-col items-start gap-3 text-left">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: color + '18', border: `1px solid ${color}22` }}>
                  <Icon className="w-4.5 h-4.5" style={{ color }} />
                </div>
                <div>
                  <div className="font-body text-white font-semibold text-sm">{label}</div>
                  <div className="font-body text-white/35 text-xs mt-0.5">{sub}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Today's Progress */}
        {todayTasks && (
          <motion.div {...fade(0.35)}
            className="rounded-2xl p-6"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl text-white tracking-wide">TODAY'S PROGRESS</h2>
              <button onClick={() => navigate('/tracker')}
                className="font-body text-brand-400 hover:text-brand-300 text-sm flex items-center gap-1 transition-colors">
                Full Tracker <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-5">
              {TODAY_ITEMS.map(item => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: item.done ? item.color : 'rgba(255,255,255,0.12)' }} />
                      <span className="font-body text-sm text-white/70">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.sub && <span className="font-mono text-xs text-white/30">{item.sub}</span>}
                      {!item.sub && (
                        <span className={`badge text-[10px] ${item.done ? 'badge-brand' : ''}`}
                          style={!item.done ? { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.06)' } : {}}>
                          {item.done ? '✓ Done' : 'Pending'}
                        </span>
                      )}
                    </div>
                  </div>
                  {item.progress !== undefined && (
                    <div className="progress-bar ml-4">
                      <motion.div className="progress-fill"
                        initial={{ width: 0 }} animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                        style={{ background: item.done ? item.color : `${item.color}60` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Metrics Summary */}
        {metrics && (
          <motion.div {...fade(0.4)} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Daily Calories', value: `${metrics.tdee?.toLocaleString()} kcal`, tag: 'TDEE' },
              { label: 'Current Weight', value: `${metrics.weight_kg} kg`, tag: metrics.fitness_goal?.replace('_', ' ').toUpperCase() },
              { label: 'Basal Metabolic Rate', value: `${metrics.bmr?.toLocaleString()} kcal`, tag: 'BMR' },
            ].map(item => (
              <div key={item.label} className="rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="badge badge-brand mb-3">{item.tag}</div>
                <div className="font-display text-3xl text-white tracking-wide tabular-nums">{item.value}</div>
                <div className="font-body text-white/40 text-xs mt-1.5">{item.label}</div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </AppLayout>
  )
}
