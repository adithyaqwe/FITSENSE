import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import {
  IndianRupee, Plus, Calendar, TrendingUp, ShoppingCart, PieChart as PieIcon,
  Check, Beef, Egg, Leaf, Banana, Wallet, Droplet, Square, Wheat
} from 'lucide-react'

// ─── Food items & colors ─────────────────────────────────────────────────────
const ITEMS = [
  { id: 'eggs',       label: 'Eggs',       icon: Egg,    color: '#eab308', unit: '₹' },
  { id: 'chicken',    label: 'Chicken',    icon: Beef,   color: '#f97316', unit: '₹' },
  { id: 'vegetables', label: 'Vegetables', icon: Leaf,   color: '#22c55e', unit: '₹' },
  { id: 'bananas',    label: 'Bananas',    icon: Banana, color: '#facc15', unit: '₹' },
  { id: 'paneer',     label: 'Paneer',     icon: Square, color: '#fdba74', unit: '₹' },
  { id: 'soya_chunks',label: 'Soya Chunks',icon: Wheat,  color: '#d97706', unit: '₹' },
  { id: 'milk',       label: 'Milk',       icon: Droplet,color: '#bae6fd', unit: '₹' },
]
const CHART_COLORS = ['#eab308', '#f97316', '#22c55e', '#facc15', '#fdba74', '#d97706', '#bae6fd']

// ─── helpers ─────────────────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().slice(0, 10)

function loadExpenses() {
  try { return JSON.parse(localStorage.getItem('fst_expense_logs') || '{}') } catch { return {} }
}
function saveExpenses(data) { localStorage.setItem('fst_expense_logs', JSON.stringify(data)) }

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'rgba(10,18,32,0.97)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 14px' }}>
      <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontSize: 13, fontWeight: 600 }}>
          {p.name}: ₹{p.value}
        </p>
      ))}
    </div>
  )
}

export default function ExpenseTracker() {
  const [logs, setLogs]     = useState(() => loadExpenses())
  const [date, setDate]     = useState(todayStr())
  const [form, setForm]     = useState({ eggs: '', chicken: '', vegetables: '', bananas: '', paneer: '', soya_chunks: '', milk: '' })
  const [saved, setSaved]   = useState(false)
  const [activeTab, setActiveTab] = useState('log')

  useEffect(() => { saveExpenses(logs) }, [logs])

  // daily total
  const dayEntry = logs[date] || {}
  const dailyTotal = useMemo(() =>
    ITEMS.reduce((acc, it) => acc + (parseFloat(dayEntry[it.id] || 0)), 0).toFixed(2)
  , [dayEntry])

  // monthly data
  const monthlyData = useMemo(() => {
    const now = new Date(date)
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const totals = {}
    const daily = []
    Object.keys(logs).filter(d => d.startsWith(prefix)).sort().forEach(d => {
      const entry = logs[d]
      const row = { date: d.slice(8) }
      let rowTotal = 0
      ITEMS.forEach(it => {
        const v = parseFloat(entry[it.id] || 0)
        row[it.label] = +v.toFixed(2)
        totals[it.id] = +((totals[it.id] || 0) + v).toFixed(2)
        rowTotal += v
      })
      row.Total = +rowTotal.toFixed(2)
      daily.push(row)
    })
    const monthlyTotal = Object.values(totals).reduce((a, b) => a + b, 0)
    return { totals, daily, monthlyTotal: +monthlyTotal.toFixed(2) }
  }, [logs, date])

  const pieData = ITEMS.map((it, i) => ({
    name: it.label, value: monthlyData.totals[it.id] || 0, color: CHART_COLORS[i]
  })).filter(d => d.value > 0)

  const handleSave = () => {
    const entry = {}
    ITEMS.forEach(it => { if (form[it.id]) entry[it.id] = parseFloat(form[it.id]) || 0 })
    setLogs(prev => ({ ...prev, [date]: { ...(prev[date] || {}), ...entry } }))
    setForm({ eggs: '', chicken: '', vegetables: '', bananas: '', paneer: '', soya_chunks: '', milk: '' })
    setSaved(true)
    setTimeout(() => setSaved(false), 2400)
  }

  const TABS = [
    { id: 'log',     label: 'Log Expenses' },
    { id: 'daily',   label: 'Daily View'   },
    { id: 'monthly', label: 'Monthly View' },
  ]

  return (
    <div className="min-h-screen lg:pl-64 pt-16 lg:pt-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #b45309)', boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}>
              <IndianRupee className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Expense Tracker</h1>
              <p className="text-white/40 text-sm">Track diet spending · Daily & monthly budgets · Insights</p>
            </div>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Spent Today', value: `₹${dailyTotal}`, icon: Wallet, color: '#f59e0b' },
            { label: 'Monthly Total', value: `₹${monthlyData.monthlyTotal}`, icon: TrendingUp, color: '#a855f7' },
            { label: 'Biggest Item', value: (() => {
                const t = monthlyData.totals; const max = Object.keys(t).sort((a,b) => t[b]-t[a])[0]
                return max ? ITEMS.find(i => i.id === max)?.label || '—' : '—'
              })(), icon: ShoppingCart, color: '#0ea5e9' },
            { label: 'Days Tracked', value: monthlyData.daily.length, icon: Calendar, color: '#22c55e' },
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
              style={activeTab === t.id ? { background: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(180,83,9,0.15))', border: '1px solid rgba(245,158,11,0.3)' } : {}}>
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── LOG EXPENSES TAB ── */}
          {activeTab === 'log' && (
            <motion.div key="log" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="glass rounded-2xl p-6 mb-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white font-bold text-lg">Add Expense Entry</h2>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white/40" />
                    <input type="date" value={date} onChange={e => setDate(e.target.value)}
                      className="input-premium px-3 py-1.5 text-sm"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {ITEMS.map(item => {
                    const Icon = item.icon
                    const val = parseFloat(form[item.id] || 0)
                    return (
                      <div key={item.id} className="rounded-2xl p-4"
                        style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${item.color}20` }}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                            style={{ background: `${item.color}20` }}>
                            <Icon className="w-4 h-4" style={{ color: item.color }} />
                          </div>
                          <p className="text-white font-semibold text-sm">{item.label}</p>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">₹</span>
                          <input
                            type="number" min="0" step="0.5" placeholder="Amount"
                            value={form[item.id]}
                            onChange={e => setForm(prev => ({ ...prev, [item.id]: e.target.value }))}
                            className="input-premium w-full pl-7 pr-3 py-2 text-sm" />
                        </div>
                        {val > 0 && (
                          <p className="text-xs mt-2" style={{ color: item.color }}>₹{val.toFixed(2)} entered</p>
                        )}
                      </div>
                    )
                  })}
                </div>

                <button onClick={handleSave}
                  className="mt-6 w-full btn-brand py-3 flex items-center justify-center gap-2 text-sm"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #b45309)' }}>
                  {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Plus className="w-4 h-4" /> Save Expenses</>}
                </button>
              </div>

              {/* Today's records */}
              {Object.keys(dayEntry).length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">Today's Expenses — {date}</h3>
                  <div className="space-y-3">
                    {ITEMS.filter(it => dayEntry[it.id]).map(item => {
                      const Icon = item.icon
                      return (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-xl"
                          style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${item.color}15` }}>
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4" style={{ color: item.color }} />
                            <span className="text-white text-sm font-medium">{item.label}</span>
                          </div>
                          <span className="text-white font-bold text-sm">₹{(+dayEntry[item.id]).toFixed(2)}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-4 pt-4 flex justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-white/50 text-sm">Total for {date}</span>
                    <span className="text-amber-400 font-bold text-lg">₹{dailyTotal}</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── DAILY VIEW TAB ── */}
          {activeTab === 'daily' && (
            <motion.div key="daily" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white font-bold text-lg">Daily Spending — {date}</h2>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)}
                    className="input-premium px-3 py-1.5 text-sm" />
                </div>
                {Object.keys(dayEntry).length === 0 ? (
                  <p className="text-white/30 text-center py-10">No expenses for {date}. Log some first!</p>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={ITEMS.filter(it => dayEntry[it.id]).map(it => ({
                        name: it.label,
                        Amount: +(+dayEntry[it.id]).toFixed(2),
                        fill: it.color
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false}
                          tickFormatter={v => `₹${v}`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="Amount" fill="#f59e0b" radius={[6, 6, 0, 0]}>
                          {ITEMS.filter(it => dayEntry[it.id]).map((it, i) => (
                            <Cell key={i} fill={it.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                      {ITEMS.map(item => {
                        const Icon = item.icon
                        const v = +dayEntry[item.id] || 0
                        const total = parseFloat(dailyTotal)
                        const pct = total > 0 ? ((v / total) * 100).toFixed(0) : 0
                        return (
                          <div key={item.id} className="rounded-xl p-3"
                            style={{ background: `${item.color}10`, border: `1px solid ${item.color}25` }}>
                            <div className="flex items-center gap-2 mb-2">
                              <Icon className="w-4 h-4" style={{ color: item.color }} />
                              <span className="text-white/60 text-xs">{item.label}</span>
                            </div>
                            <p className="text-white font-bold text-base">₹{v.toFixed(2)}</p>
                            <div className="progress-bar mt-2">
                              <div className="progress-fill" style={{ width: `${pct}%`, background: item.color }} />
                            </div>
                            <p className="text-xs mt-1" style={{ color: item.color }}>{pct}% of today</p>
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

              {/* Area chart: total daily spending */}
              <div className="glass rounded-2xl p-6">
                <h2 className="text-white font-bold text-lg mb-6">Monthly Spending Trend</h2>
                {monthlyData.daily.length === 0 ? (
                  <p className="text-white/30 text-center py-10">No data for this month yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={monthlyData.daily}>
                      <defs>
                        <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false}
                        tickFormatter={v => `₹${v}`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="Total" stroke="#f59e0b" strokeWidth={2.5}
                        fill="url(#gTotal)" name="Total" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Stacked bar + Pie */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">Spending Breakdown</h3>
                  {pieData.length === 0 ? (
                    <p className="text-white/30 text-center py-8">No data.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                          paddingAngle={3} dataKey="value">
                          {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: 'rgba(10,18,32,0.97)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 }}
                          itemStyle={{ color: '#fff', fontSize: 12 }}
                          formatter={v => `₹${v}`} />
                        <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="glass rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">Monthly Item Totals</h3>
                  <div className="space-y-3">
                    {ITEMS.map(item => {
                      const Icon = item.icon
                      const v = monthlyData.totals[item.id] || 0
                      const pct = monthlyData.monthlyTotal > 0 ? ((v / monthlyData.monthlyTotal) * 100).toFixed(0) : 0
                      return (
                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl"
                          style={{ background: `${item.color}0d`, border: `1px solid ${item.color}20` }}>
                          <Icon className="w-4 h-4 flex-shrink-0" style={{ color: item.color }} />
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="text-white/70 text-xs">{item.label}</span>
                              <span className="text-white font-bold text-sm">₹{v.toFixed(2)}</span>
                            </div>
                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: `${pct}%`, background: item.color }} />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <div className="flex justify-between p-3 rounded-xl mt-2"
                      style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
                      <span className="text-amber-400 font-semibold text-sm">Monthly Grand Total</span>
                      <span className="text-amber-400 font-bold text-lg">₹{monthlyData.monthlyTotal}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stacked bar: category-wise per day */}
              {monthlyData.daily.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">Daily Category Breakdown</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={monthlyData.daily}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false}
                        tickFormatter={v => `₹${v}`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                      {ITEMS.map((item, i) => (
                        <Bar key={item.id} dataKey={item.label} stackId="a" fill={item.color}
                          radius={i === ITEMS.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
                      ))}
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
