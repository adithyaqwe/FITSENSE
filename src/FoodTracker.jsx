import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import {
  Utensils, Plus, Calendar, TrendingUp, Scale, Flame, Award,
  ChevronDown, Check, X, Loader2, Beef, Egg, Leaf, Banana, Droplet, Square, Wheat, ArrowLeft
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useHealthMetrics } from './useData'

// ─── Food nutrition data ──────────────────────────────────────────────────────
const FOODS = [
  {
    id: 'chicken', label: 'Chicken', unit: 'g', icon: Beef, color: '#f97316',
    per100: { protein: 31, calories: 165 }
  },
  {
    id: 'eggs', label: 'Eggs', unit: 'pcs', icon: Egg, color: '#eab308',
    per100: { protein: 13, calories: 155 }, perItem: { protein: 7.8, calories: 93 }
  },
  {
    id: 'vegetables', label: 'Vegetables', unit: 'g', icon: Leaf, color: '#22c55e',
    per100: { protein: 2.5, calories: 35 }
  },
  {
    id: 'bananas', label: 'Bananas', unit: 'pcs', icon: Banana, color: '#facc15',
    per100: { protein: 1.1, calories: 89 }, perItem: { protein: 1.3, calories: 105 }
  },
  {
    id: 'paneer', label: 'Paneer', unit: 'g', icon: Square, color: '#fdba74',
    per100: { protein: 18, calories: 265 }
  },
  {
    id: 'soya_chunks', label: 'Soya Chunks', unit: 'g', icon: Wheat, color: '#d97706',
    per100: { protein: 52, calories: 345 }
  },
  {
    id: 'milk', label: 'Milk', unit: 'ml', icon: Droplet, color: '#bae6fd',
    per100: { protein: 3.4, calories: 60 }
  },
]

const CHART_COLORS = ['#f97316', '#eab308', '#22c55e', '#facc15', '#fdba74', '#d97706', '#bae6fd']

// ─── Helpers ──────────────────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().slice(0, 10)

function calcNutrition(food, qty) {
  if (!qty || isNaN(qty)) return { protein: 0, calories: 0 }
  if (food.perItem) {
    return { protein: +(food.perItem.protein * qty).toFixed(1), calories: +(food.perItem.calories * qty).toFixed(0) }
  }
  return {
    protein: +(food.per100.protein * qty / 100).toFixed(1),
    calories: +(food.per100.calories * qty / 100).toFixed(0)
  }
}

function loadFromStorage() {
  try { return JSON.parse(localStorage.getItem('fst_food_logs') || '{}') } catch { return {} }
}
function saveToStorage(data) {
  localStorage.setItem('fst_food_logs', JSON.stringify(data))
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'rgba(10,18,32,0.97)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 14px' }}>
      <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontSize: 13, fontWeight: 600 }}>{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

export default function FoodTracker() {
  const navigate = useNavigate()
  const { data: metrics } = useHealthMetrics()
  const targetProtein = metrics?.weight_kg ? Math.round(metrics.weight_kg * 2.0) : 0
  const targetCalories = metrics?.tdee ? Math.round(metrics.tdee) : 0

  const [logs, setLogs] = useState(() => loadFromStorage())
  const [date, setDate] = useState(todayStr())
  const [form, setForm] = useState({ chicken: '', eggs: '', vegetables: '', bananas: '', paneer: '', soya_chunks: '', milk: '' })
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('log') // log | daily | monthly

  // persist
  useEffect(() => { saveToStorage(logs) }, [logs])

  // today's data
  const todayLog = logs[date] || {}
  const dailyTotal = useMemo(() => {
    let protein = 0, calories = 0
    FOODS.forEach(f => {
      const qty = parseFloat(todayLog[f.id] || 0)
      const n = calcNutrition(f, qty)
      protein += n.protein
      calories += n.calories
    })
    return { protein: +protein.toFixed(1), calories: +calories.toFixed(0) }
  }, [todayLog])

  // monthly data
  const monthlyData = useMemo(() => {
    const now = new Date(date)
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const totals = {}; const daily = []
    Object.keys(logs).filter(d => d.startsWith(prefix)).sort().forEach(d => {
      const entry = logs[d]
      const row = { date: d.slice(8), protein: 0, calories: 0 }
      FOODS.forEach(f => {
        const qty = parseFloat(entry[f.id] || 0)
        const n = calcNutrition(f, qty)
        row.protein += n.protein
        row.calories += n.calories
        totals[f.id] = (totals[f.id] || 0) + qty
      })
      row.protein = +row.protein.toFixed(1)
      row.calories = +row.calories.toFixed(0)
      daily.push(row)
    })
    return { totals, daily }
  }, [logs, date])

  const monthlyPieData = FOODS.map((f, i) => ({
    name: f.label,
    value: +((monthlyData.totals[f.id] || 0).toFixed(1)),
    color: CHART_COLORS[i]
  })).filter(d => d.value > 0)

  const handleSave = () => {
    const entry = {}
    FOODS.forEach(f => { if (form[f.id]) entry[f.id] = parseFloat(form[f.id]) || 0 })
    setLogs(prev => ({ ...prev, [date]: { ...(prev[date] || {}), ...entry } }))
    setForm({ chicken: '', eggs: '', vegetables: '', bananas: '', paneer: '', soya_chunks: '', milk: '' })
    setSaved(true)
    setTimeout(() => setSaved(false), 2400)
  }

  const TABS = [
    { id: 'log', label: 'Log Food' },
    { id: 'daily', label: 'Daily Summary' },
    { id: 'monthly', label: 'Monthly View' },
  ]

  return (
    <div className="min-h-screen lg:pl-64 pt-16 lg:pt-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 space-y-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-white/40 hover:text-brand-400 transition-colors group mb-2"
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-brand-500/10 border border-white/5 group-hover:border-brand-500/20">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-body text-xs font-medium tracking-wide uppercase">Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 0 20px rgba(34,197,94,0.3)' }}>
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white uppercase tracking-wide">Food Tracker</h1>
              <p className="text-white/40 text-sm">Log daily meals · Track nutrition · Monitor trends</p>
            </div>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: targetProtein ? `Protein Focus (${metrics.weight_kg}kg)` : 'Protein Today', value: targetProtein ? `${dailyTotal.protein} / ${targetProtein}g` : `${dailyTotal.protein}g`, icon: Scale, color: '#0ea5e9' },
            { label: targetCalories ? 'Calorie Goal' : 'Calories Today', value: targetCalories ? `${dailyTotal.calories} / ${targetCalories}` : dailyTotal.calories, icon: Flame, color: '#f97316' },
            { label: 'Days Logged', value: Object.keys(monthlyData.daily).length || monthlyData.daily.length, icon: Calendar, color: '#a855f7' },
            { label: 'Monthly kcal', value: monthlyData.daily.reduce((a, r) => a + r.calories, 0), icon: TrendingUp, color: '#22c55e' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }} className="stat-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: `${s.color}18` }}>
                  <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                </div>
                <span className="text-white/40 text-xs">{s.label}</span>
              </div>
              <p className="text-white text-xl font-bold tabular-nums">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${activeTab === t.id ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
              style={activeTab === t.id ? { background: 'linear-gradient(135deg, rgba(34,197,94,0.25), rgba(22,163,74,0.15))', border: '1px solid rgba(34,197,94,0.25)' } : {}}>
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── LOG FOOD TAB ── */}
          {activeTab === 'log' && (
            <motion.div key="log" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="glass rounded-2xl p-6 mb-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white font-bold text-lg">Add Food Entry</h2>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white/40" />
                    <input type="date" value={date} onChange={e => setDate(e.target.value)}
                      className="input-premium px-3 py-1.5 text-sm"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {FOODS.map(food => {
                    const Icon = food.icon
                    const qty = parseFloat(form[food.id] || 0)
                    const n = calcNutrition(food, qty)
                    return (
                      <div key={food.id} className="rounded-2xl p-4"
                        style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${food.color}20` }}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                            style={{ background: `${food.color}20` }}>
                            <Icon className="w-4 h-4" style={{ color: food.color }} />
                          </div>
                          <div>
                            <p className="text-white font-semibold text-sm">{food.label}</p>
                            <p className="text-white/30 text-xs">per {food.unit}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 items-center mb-2">
                          <input
                            type="number" min="0" placeholder={`Qty (${food.unit})`}
                            value={form[food.id]}
                            onChange={e => setForm(prev => ({ ...prev, [food.id]: e.target.value }))}
                            className="input-premium flex-1 px-3 py-2 text-sm" />
                        </div>
                        {qty > 0 && (
                          <div className="flex gap-3 mt-1">
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${food.color}15`, color: food.color }}>
                              {n.protein}g protein
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#f9731615', color: '#f97316' }}>
                              {n.calories} kcal
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <button onClick={handleSave}
                  className="mt-6 w-full btn-brand py-3 flex items-center justify-center gap-2 text-sm"
                  style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                  {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Plus className="w-4 h-4" /> Save Entry</>}
                </button>
              </div>

              {/* Today's logged data */}
              {Object.keys(todayLog).length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">Today's Log — {date}</h3>
                  <div className="space-y-3">
                    {FOODS.filter(f => todayLog[f.id]).map(food => {
                      const Icon = food.icon
                      const qty = todayLog[food.id]
                      const n = calcNutrition(food, qty)
                      return (
                        <div key={food.id} className="flex items-center justify-between p-3 rounded-xl"
                          style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${food.color}15` }}>
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4" style={{ color: food.color }} />
                            <span className="text-white text-sm font-medium">{food.label}</span>
                            <span className="text-white/30 text-xs">{qty} {food.unit}</span>
                          </div>
                          <div className="flex gap-3 text-xs">
                            <span style={{ color: '#0ea5e9' }}>{n.protein}g prot</span>
                            <span style={{ color: '#f97316' }}>{n.calories} kcal</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-4 pt-4 flex justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-white/50 text-sm">Daily Total</span>
                    <div className="flex gap-4 text-sm font-bold">
                      <span style={{ color: '#0ea5e9' }}>{dailyTotal.protein}g {targetProtein ? `/ ${targetProtein}g` : ''} protein</span>
                      <span style={{ color: '#f97316' }}>{dailyTotal.calories} {targetCalories ? `/ ${targetCalories}` : ''} kcal</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── DAILY SUMMARY TAB ── */}
          {activeTab === 'daily' && (
            <motion.div key="daily" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white font-bold text-lg">Daily Intake — {date}</h2>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)}
                    className="input-premium px-3 py-1.5 text-sm" />
                </div>
                {Object.keys(todayLog).length === 0 ? (
                  <p className="text-white/30 text-center py-10">No data for {date}. Log some food first!</p>
                ) : (
                  <>
                    {/* Bar Chart */}
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={FOODS.filter(f => todayLog[f.id]).map(f => {
                        const n = calcNutrition(f, todayLog[f.id])
                        return { name: f.label, Protein: n.protein, Calories: n.calories, fill: f.color }
                      })}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                        <Bar dataKey="Protein" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="Calories" fill="#f97316" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>

                    {/* Nutrition breakdown */}
                    <div className="grid grid-cols-4 gap-3 mt-6">
                      {FOODS.filter(f => todayLog[f.id]).map(food => {
                        const Icon = food.icon
                        const n = calcNutrition(food, todayLog[food.id])
                        return (
                          <div key={food.id} className="rounded-xl p-3 text-center"
                            style={{ background: `${food.color}10`, border: `1px solid ${food.color}25` }}>
                            <Icon className="w-5 h-5 mx-auto mb-1" style={{ color: food.color }} />
                            <p className="text-white/50 text-xs mb-1">{food.label}</p>
                            <p className="text-white font-bold text-sm">{todayLog[food.id]} {food.unit}</p>
                            <p className="text-xs mt-1" style={{ color: food.color }}>{n.calories} kcal</p>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* ── MONTHLY VIEW TAB ── */}
          {activeTab === 'monthly' && (
            <motion.div key="monthly" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-6">
              {/* Line chart: monthly calorie trend */}
              <div className="glass rounded-2xl p-6">
                <h2 className="text-white font-bold text-lg mb-6">Monthly Calorie & Protein Trend</h2>
                {monthlyData.daily.length === 0 ? (
                  <p className="text-white/30 text-center py-10">No data for this month yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={monthlyData.daily}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                      <Line type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={2.5}
                        dot={{ fill: '#f97316', r: 4, strokeWidth: 0 }} name="Calories" />
                      <Line type="monotone" dataKey="protein" stroke="#0ea5e9" strokeWidth={2.5}
                        dot={{ fill: '#0ea5e9', r: 4, strokeWidth: 0 }} name="Protein (g)" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Pie chart + totals */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">Monthly Consumption Split</h3>
                  {monthlyPieData.length === 0 ? (
                    <p className="text-white/30 text-center py-8">No data.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={monthlyPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                          paddingAngle={3} dataKey="value">
                          {monthlyPieData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: 'rgba(10,18,32,0.97)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 }}
                          itemStyle={{ color: '#fff', fontSize: 12 }} />
                        <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="glass rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">Monthly Totals</h3>
                  <div className="space-y-3">
                    {FOODS.map((food, i) => {
                      const Icon = food.icon
                      const total = +(monthlyData.totals[food.id] || 0).toFixed(1)
                      return (
                        <div key={food.id} className="flex items-center justify-between p-3 rounded-xl"
                          style={{ background: `${food.color}10`, border: `1px solid ${food.color}20` }}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" style={{ color: food.color }} />
                            <span className="text-white/80 text-sm">{food.label}</span>
                          </div>
                          <span className="text-white font-bold text-sm">{total} {food.unit}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Monthly bar comparison */}
              {monthlyData.daily.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">Monthly Nutritional Comparison</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={monthlyData.daily}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                      <Bar dataKey="calories" name="Calories" fill="#f97316" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="protein" name="Protein (g)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
