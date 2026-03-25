import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine, AreaChart, Area
} from 'recharts'
import {
  Brain, TrendingUp, TrendingDown, Lightbulb, Beef, Egg, Leaf, Banana,
  AlertTriangle, CheckCircle, Info, Zap, Target, DollarSign
} from 'lucide-react'

// ─── Load stored data ─────────────────────────────────────────────────────────
function loadFood()    { try { return JSON.parse(localStorage.getItem('fst_food_logs') || '{}') } catch { return {} } }
function loadExpense() { try { return JSON.parse(localStorage.getItem('fst_expense_logs') || '{}') } catch { return {} } }

// ─── Nutritional reference ────────────────────────────────────────────────────
const FOODS = [
  { id: 'chicken',    label: 'Chicken',    icon: Beef,   color: '#f97316', per100: { protein: 31, calories: 165 } },
  { id: 'eggs',       label: 'Eggs',       icon: Egg,    color: '#eab308', perItem: { protein: 7.8, calories: 93 } },
  { id: 'vegetables', label: 'Vegetables', icon: Leaf,   color: '#22c55e', per100: { protein: 2.5, calories: 35 } },
  { id: 'bananas',    label: 'Bananas',    icon: Banana, color: '#facc15', perItem: { protein: 1.3, calories: 105 } },
]

function calcNutrition(food, qty) {
  if (!qty) return { protein: 0, calories: 0 }
  if (food.perItem) return { protein: food.perItem.protein * qty, calories: food.perItem.calories * qty }
  return { protein: food.per100.protein * qty / 100, calories: food.per100.calories * qty / 100 }
}

// ─── Simple Linear Regression ─────────────────────────────────────────────────
function linearRegression(points) {
  if (points.length < 2) return null
  const n = points.length
  const sumX = points.reduce((a, _, i) => a + i, 0)
  const sumY = points.reduce((a, p) => a + p, 0)
  const sumXY = points.reduce((a, p, i) => a + i * p, 0)
  const sumX2 = points.reduce((a, _, i) => a + i * i, 0)
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  return { slope, intercept }
}

function predict(model, x) {
  if (!model) return null
  return +(model.slope * x + model.intercept).toFixed(2)
}

// ─── Derive monthly summaries ─────────────────────────────────────────────────
function getMonthKey(d) { return d.slice(0, 7) } // yyyy-mm

function buildMonthlyFoodSeries(logs) {
  const byMonth = {}
  Object.keys(logs).sort().forEach(date => {
    const mk = getMonthKey(date)
    if (!byMonth[mk]) byMonth[mk] = { month: mk, protein: 0, calories: 0 }
    FOODS.forEach(f => {
      const qty = parseFloat(logs[date][f.id] || 0)
      const n = calcNutrition(f, qty)
      byMonth[mk].protein += n.protein
      byMonth[mk].calories += n.calories
    })
  })
  return Object.values(byMonth).map(m => ({
    ...m, protein: +m.protein.toFixed(1), calories: +m.calories.toFixed(0)
  }))
}

function buildMonthlyExpenseSeries(logs) {
  const byMonth = {}
  Object.keys(logs).sort().forEach(date => {
    const mk = getMonthKey(date)
    if (!byMonth[mk]) byMonth[mk] = { month: mk, total: 0 }
    const entry = logs[date]
    byMonth[mk].total += Object.values(entry).reduce((a, v) => a + parseFloat(v || 0), 0)
  })
  return Object.values(byMonth).map(m => ({ ...m, total: +m.total.toFixed(2) }))
}

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

// ─── Insight card ──────────────────────────────────────────────────────────────
function InsightCard({ type, title, body, icon: Icon }) {
  const styles = {
    tip:     { bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.2)',  color: '#4ade80' },
    warn:    { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', color: '#fbbf24' },
    info:    { bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.2)', color: '#38bdf8' },
    danger:  { bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.2)',  color: '#f87171' },
  }
  const s = styles[type] || styles.info
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
      className="flex gap-3 p-4 rounded-2xl"
      style={{ background: s.bg, border: `1px solid ${s.border}` }}>
      <div className="flex-shrink-0 mt-0.5">
        {Icon ? <Icon className="w-4 h-4" style={{ color: s.color }} />
          : type === 'tip' ? <CheckCircle className="w-4 h-4" style={{ color: s.color }} />
          : type === 'warn' ? <AlertTriangle className="w-4 h-4" style={{ color: s.color }} />
          : <Info className="w-4 h-4" style={{ color: s.color }} />}
      </div>
      <div>
        <p className="text-white font-semibold text-sm mb-0.5">{title}</p>
        <p className="text-white/60 text-xs leading-relaxed">{body}</p>
      </div>
    </motion.div>
  )
}

export default function MLInsights() {
  const foodLogs    = loadFood()
  const expenseLogs = loadExpense()

  const foodSeries    = useMemo(() => buildMonthlyFoodSeries(foodLogs),    [])
  const expenseSeries = useMemo(() => buildMonthlyExpenseSeries(expenseLogs), [])

  // Build regression models
  const calorieModel  = useMemo(() => linearRegression(foodSeries.map(m => m.calories)), [foodSeries])
  const proteinModel  = useMemo(() => linearRegression(foodSeries.map(m => m.protein)), [foodSeries])
  const expenseModel  = useMemo(() => linearRegression(expenseSeries.map(m => m.total)), [expenseSeries])

  // Predict next 2 months for food
  const FOOD_MONTHS_AHEAD = 2
  const foodPredChartData = useMemo(() => {
    const base = foodSeries.map((m, i) => ({
      month: m.month.slice(5),
      calories: m.calories,
      protein: m.protein,
      type: 'actual'
    }))
    for (let k = 1; k <= FOOD_MONTHS_AHEAD; k++) {
      const idx = foodSeries.length - 1 + k
      const predMonth = (() => {
        const last = foodSeries.length > 0 ? new Date(foodSeries[foodSeries.length - 1].month + '-01') : new Date()
        last.setMonth(last.getMonth() + k)
        return `${last.getMonth() + 1}`.padStart(2, '0')
      })()
      base.push({
        month: predMonth,
        predicted_calories: Math.max(0, predict(calorieModel, idx)),
        predicted_protein: Math.max(0, predict(proteinModel, idx)),
        type: 'predicted'
      })
    }
    return base
  }, [foodSeries, calorieModel, proteinModel])

  // Predict next 2 months for expenses
  const expensePredChartData = useMemo(() => {
    const base = expenseSeries.map((m, i) => ({
      month: m.month.slice(5),
      total: m.total,
      type: 'actual'
    }))
    for (let k = 1; k <= FOOD_MONTHS_AHEAD; k++) {
      const idx = expenseSeries.length - 1 + k
      const predMonth = (() => {
        const last = expenseSeries.length > 0 ? new Date(expenseSeries[expenseSeries.length - 1].month + '-01') : new Date()
        last.setMonth(last.getMonth() + k)
        return `${last.getMonth() + 1}`.padStart(2, '0')
      })()
      base.push({
        month: predMonth,
        predicted_total: Math.max(0, predict(expenseModel, idx)),
        type: 'predicted'
      })
    }
    return base
  }, [expenseSeries, expenseModel])

  // ── Monthly stats ──────────────────────────────────────────────────────────
  const currentMonth = new Date().toISOString().slice(0, 7)
  const currentFoodData     = foodSeries.find(m => m.month === currentMonth)
  const prevFoodData        = foodSeries.length > 1 ? foodSeries[foodSeries.length - 2] : null
  const currentExpenseData  = expenseSeries.find(m => m.month === currentMonth)
  const prevExpenseData     = expenseSeries.length > 1 ? expenseSeries[expenseSeries.length - 2] : null

  // ── Compute food dominance for this month ──────────────────────────────────
  const thisMonthFoodLogs = Object.keys(foodLogs).filter(d => d.startsWith(currentMonth))
  const foodQtyTotals = {}
  FOODS.forEach(f => { foodQtyTotals[f.id] = 0 })
  thisMonthFoodLogs.forEach(date => {
    FOODS.forEach(f => { foodQtyTotals[f.id] += parseFloat(foodLogs[date][f.id] || 0) })
  })

  const thisMonthExpenseLogs = Object.keys(expenseLogs).filter(d => d.startsWith(currentMonth))
  const expenseTotals = {}
  FOODS.forEach(f => { expenseTotals[f.id] = 0 })
  thisMonthExpenseLogs.forEach(date => {
    FOODS.forEach(f => { expenseTotals[f.id] += parseFloat(expenseLogs[date][f.id] || 0) })
  })
  const totalExpense = Object.values(expenseTotals).reduce((a, b) => a + b, 0)

  // ── Generate insights ──────────────────────────────────────────────────────
  const insights = useMemo(() => {
    const tips = []
    if (thisMonthFoodLogs.length === 0 && thisMonthExpenseLogs.length === 0) {
      return [{ type: 'info', title: 'No data yet', body: 'Log some food and expenses first to get personalized AI insights.' }]
    }

    // Protein check (goal: ≥100g protein/day average)
    const avgDailyProtein = currentFoodData
      ? currentFoodData.protein / Math.max(thisMonthFoodLogs.length, 1)
      : 0
    if (avgDailyProtein < 60)
      tips.push({ type: 'warn', title: '⚡ Low Protein Intake', body: `Your average daily protein is ${avgDailyProtein.toFixed(1)}g, below the recommended 60g+. Add more eggs and chicken to hit your targets.` })
    else if (avgDailyProtein >= 100)
      tips.push({ type: 'tip', title: '💪 Excellent Protein Intake!', body: `Great job! You're averaging ${avgDailyProtein.toFixed(1)}g protein per day — keep it up for muscle growth and recovery.` })

    // Chicken cost dominance
    const chickenPct = totalExpense > 0 ? (expenseTotals.chicken / totalExpense) * 100 : 0
    if (chickenPct > 55)
      tips.push({ type: 'warn', title: '🍗 Chicken Spending High', body: `Chicken accounts for ${chickenPct.toFixed(0)}% of your monthly diet budget. Consider replacing some meals with eggs (more protein/₹) to save money.` })

    // Vegetable diversity
    if (foodQtyTotals.vegetables < 500)
      tips.push({ type: 'danger', title: '🥗 Increase Vegetable Intake', body: `You've only logged ${foodQtyTotals.vegetables.toFixed(0)}g of vegetables this month. Aim for at least 1.5–2 kg/month for micronutrients and fibre.` })

    // Banana energy tip
    if (foodQtyTotals.bananas > 15)
      tips.push({ type: 'info', title: '🍌 High Banana Consumption', body: `You've had ${foodQtyTotals.bananas.toFixed(0)} bananas this month — great for quick energy, but watch added sugar if you're cutting weight.` })

    // Expense trend
    if (expenseModel && expenseModel.slope > 100)
      tips.push({ type: 'warn', title: '📈 Expense Trend Rising', body: `Your diet expenses are trending up ~₹${expenseModel.slope.toFixed(0)} per month. Consider buying vegetables in bulk or swapping expensive items for egg-based meals.` })
    else if (expenseModel && expenseModel.slope < -50)
      tips.push({ type: 'tip', title: '✅ Great Cost Control!', body: `Your monthly diet expenses are trending downward by ₹${Math.abs(expenseModel.slope).toFixed(0)}/month. Keep it up!` })

    // Calorie trend
    if (calorieModel && calorieModel.slope > 200)
      tips.push({ type: 'info', title: '🔥 Calorie Intake Rising', body: `Your calorie consumption is trending upward. If you're bulking this is fine — otherwise consider portion control on high-calorie items.` })

    // Egg efficiency tip
    const eggCost = expenseTotals.eggs
    const eggProtein = calcNutrition(FOODS.find(f => f.id === 'eggs'), foodQtyTotals.eggs).protein
    if (eggCost > 0 && eggProtein > 0)
      tips.push({ type: 'tip', title: '🥚 Egg Efficiency Score', body: `You get ~${(eggProtein / eggCost * 10).toFixed(1)}g protein per ₹10 of eggs — eggs are one of the best protein-per-rupee foods in your diet.` })

    return tips.length > 0 ? tips : [{ type: 'tip', title: '🎯 Diet on track!', body: 'Your food and expense data looks balanced. Keep logging daily for more personalized AI suggestions.' }]
  }, [foodSeries, expenseSeries, currentFoodData, currentExpenseData, thisMonthFoodLogs, thisMonthExpenseLogs])

  const hasEnoughData = foodSeries.length >= 1 || expenseSeries.length >= 1

  return (
    <div className="min-h-screen lg:pl-64 pt-16 lg:pt-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', boxShadow: '0 0 20px rgba(168,85,247,0.35)' }}>
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">ML Insights</h1>
              <p className="text-white/40 text-sm">Linear regression · Trend forecasting · Smart suggestions</p>
            </div>
          </div>
          <div className="mt-3 px-3 py-2 rounded-xl inline-flex items-center gap-2"
            style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)' }}>
            <Zap className="w-3.5 h-3.5" style={{ color: '#c084fc' }} />
            <span className="text-xs" style={{ color: '#c084fc' }}>
              Predictions use linear regression on your historical data
            </span>
          </div>
        </motion.div>

        {!hasEnoughData ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Brain className="w-12 h-12 mx-auto mb-4" style={{ color: '#a855f7', opacity: 0.5 }} />
            <p className="text-white font-semibold text-lg mb-2">Not enough data yet</p>
            <p className="text-white/40 text-sm">Log food or expenses in the other dashboards first. Come back here once you have some history!</p>
          </div>
        ) : (
          <div className="space-y-6">

            {/* ── KPI Summary ── */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  label: 'Predicted Next Month Calories',
                  value: calorieModel && foodSeries.length > 0
                    ? `${Math.max(0, predict(calorieModel, foodSeries.length)).toLocaleString()} kcal`
                    : 'Need more data',
                  icon: Zap, color: '#f97316',
                  delta: calorieModel ? (calorieModel.slope > 0 ? 'up' : 'down') : null
                },
                {
                  label: 'Predicted Next Month Protein',
                  value: proteinModel && foodSeries.length > 0
                    ? `${Math.max(0, predict(proteinModel, foodSeries.length)).toFixed(0)}g`
                    : 'Need more data',
                  icon: Target, color: '#0ea5e9',
                  delta: proteinModel ? (proteinModel.slope > 0 ? 'up' : 'down') : null
                },
                {
                  label: 'Predicted Next Month Expense',
                  value: expenseModel && expenseSeries.length > 0
                    ? `₹${Math.max(0, predict(expenseModel, expenseSeries.length)).toFixed(0)}`
                    : 'Need more data',
                  icon: DollarSign, color: '#a855f7',
                  delta: expenseModel ? (expenseModel.slope > 0 ? 'up' : 'down') : null
                },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }} className="stat-card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: `${s.color}18` }}>
                      <s.icon className="w-4 h-4" style={{ color: s.color }} />
                    </div>
                    {s.delta && (
                      s.delta === 'up'
                        ? <TrendingUp className="w-4 h-4 text-red-400" />
                        : <TrendingDown className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <p className="text-white/40 text-xs mb-1">{s.label}</p>
                  <p className="text-white font-bold text-xl tabular-nums">{s.value}</p>
                </motion.div>
              ))}
            </div>

            {/* ── Food Trend Chart ── */}
            {foodPredChartData.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Brain className="w-4 h-4" style={{ color: '#a855f7' }} />
                  <h2 className="text-white font-bold text-lg">Nutrition Forecast (Linear Regression)</h2>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={foodPredChartData}>
                    <defs>
                      <linearGradient id="actualLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                    <Line type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={2.5}
                      dot={{ fill: '#f97316', r: 5 }} name="Actual Calories" connectNulls />
                    <Line type="monotone" dataKey="predicted_calories" stroke="#f97316" strokeWidth={2}
                      strokeDasharray="6 3" dot={{ fill: '#f97316', r: 5, strokeDasharray: '' }} name="Predicted Calories" connectNulls />
                    <Line type="monotone" dataKey="protein" stroke="#0ea5e9" strokeWidth={2.5}
                      dot={{ fill: '#0ea5e9', r: 5 }} name="Actual Protein (g)" connectNulls />
                    <Line type="monotone" dataKey="predicted_protein" stroke="#0ea5e9" strokeWidth={2}
                      strokeDasharray="6 3" dot={{ fill: '#0ea5e9', r: 5, strokeDasharray: '' }} name="Predicted Protein (g)" connectNulls />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-white/30 text-xs mt-2 text-center">Dashed lines = ML-predicted values for upcoming months</p>
              </div>
            )}

            {/* ── Expense Trend Chart ── */}
            {expensePredChartData.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-4 h-4" style={{ color: '#a855f7' }} />
                  <h2 className="text-white font-bold text-lg">Expense Forecast (Linear Regression)</h2>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={expensePredChartData}>
                    <defs>
                      <linearGradient id="gActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gPred" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false}
                      tickFormatter={v => `₹${v}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                    <Area type="monotone" dataKey="total" stroke="#a855f7" strokeWidth={2.5}
                      fill="url(#gActual)" name="Actual Expense" connectNulls />
                    <Area type="monotone" dataKey="predicted_total" stroke="#f59e0b" strokeWidth={2}
                      strokeDasharray="6 3" fill="url(#gPred)" name="Predicted Expense" connectNulls />
                  </AreaChart>
                </ResponsiveContainer>
                <p className="text-white/30 text-xs mt-2 text-center">Dashed area = ML-predicted spending for upcoming months</p>
              </div>
            )}

            {/* ── AI Insights Panel ── */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Lightbulb className="w-4 h-4" style={{ color: '#facc15' }} />
                <h2 className="text-white font-bold text-lg">Smart Recommendations</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.3)' }}>
                  {insights.length} Insight{insights.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="space-y-3">
                {insights.map((ins, i) => (
                  <InsightCard key={i} {...ins} />
                ))}
              </div>
            </div>

            {/* ── Model info ── */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">📐 Model Information</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: 'Calorie Model', model: calorieModel, unit: 'kcal/month', color: '#f97316' },
                  { label: 'Protein Model', model: proteinModel, unit: 'g/month',    color: '#0ea5e9' },
                  { label: 'Expense Model', model: expenseModel, unit: '₹/month',    color: '#a855f7' },
                ].map((m, i) => (
                  <div key={i} className="p-4 rounded-xl"
                    style={{ background: `${m.color}0a`, border: `1px solid ${m.color}20` }}>
                    <p className="text-white/60 text-xs mb-2">{m.label}</p>
                    {m.model ? (
                      <>
                        <p className="text-white text-sm font-mono mb-1">
                          y = <span style={{ color: m.color }}>{m.model.slope.toFixed(1)}</span>x + {m.model.intercept.toFixed(1)}
                        </p>
                        <p className="text-white/40 text-xs">
                          Trend: {m.model.slope > 0 ? '↑ Rising' : '↓ Falling'} {Math.abs(m.model.slope).toFixed(1)} {m.unit}
                        </p>
                      </>
                    ) : (
                      <p className="text-white/30 text-xs">Need ≥2 data points</p>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-white/20 text-xs mt-4">
                Method: Ordinary Least Squares Linear Regression on monthly aggregates.
                All computations run locally in your browser — no data leaves your device.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
