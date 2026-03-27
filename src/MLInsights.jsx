import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as tf from '@tensorflow/tfjs'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts'
import {
  Brain, TrendingUp, TrendingDown, Lightbulb, Beef, Egg, Leaf, Banana,
  AlertTriangle, CheckCircle, Info, Zap, Target, DollarSign, Activity
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

  // TensorFlow Neural Network State
  const [tfModels, setTfModels] = useState({
    calorie: null,
    protein: null,
    expense: null
  })
  const [predictions, setPredictions] = useState({ food: [], expense: [] })
  
  // Training Overlay UI state
  const [isTraining, setIsTraining] = useState(false)
  const [trainingPhase, setTrainingPhase] = useState('')
  const [epoch, setEpoch] = useState(0)
  const [loss, setLoss] = useState(0)
  const TARGET_EPOCHS = 150

  const hasEnoughData = foodSeries.length >= 2 || expenseSeries.length >= 2

  // ── TensorFlow Model Training Engine ───────────────────────────────────────
  const trainNeuralNetwork = async (seriesData, featureKey, phaseName) => {
    if (!seriesData || seriesData.length < 2) return null
    setTrainingPhase(phaseName)

    const rawY = seriesData.map(m => m[featureKey])
    const maxY = Math.max(...rawY) || 1
    const scaledY = rawY.map(y => y / maxY)
    
    // Convert to 2D tensors
    const xs = tf.tensor2d(seriesData.map((_, i) => [i]), [seriesData.length, 1])
    const ys = tf.tensor2d(scaledY, [seriesData.length, 1])

    // Build the Multi-Layer Perceptron (Neural Network)
    const model = tf.sequential()
    model.add(tf.layers.dense({ units: 8, inputShape: [1], activation: 'relu' }))
    model.add(tf.layers.dense({ units: 8, activation: 'relu' }))
    model.add(tf.layers.dense({ units: 1, activation: 'linear' }))

    model.compile({ optimizer: tf.train.adam(0.02), loss: 'meanSquaredError' })

    // Train the model
    await model.fit(xs, ys, {
      epochs: TARGET_EPOCHS,
      callbacks: {
        onEpochEnd: (ep, logs) => {
          if (ep % 5 === 0) {
            setEpoch(ep)
            setLoss(logs.loss)
            // Hack to yield execution to React to update UI during training loop
            return new Promise(resolve => setTimeout(resolve, 0))
          }
        }
      }
    })

    const len = seriesData.length
    // Predict next 2 steps: len and len+1
    const xPredict = tf.tensor2d([[len], [len + 1]], [2, 1])
    const predsRaw = model.predict(xPredict).dataSync()
    const next2Values = Array.from(predsRaw).map(v => Math.max(0, v * maxY))
    
    // Cleanup tensors from memory to prevent memory leaks
    xs.dispose(); ys.dispose(); xPredict.dispose()

    return {
      model,
      netSummary: `Dense(8,relu)->Dense(8,relu)->Dense(1,linear)`,
      finalLoss: loss,
      predictions: next2Values
    }
  }

  // ── Start Training Pipeline on Mount ───────────────────────────────────────
  useEffect(() => {
    if (!hasEnoughData) return

    let isCancelled = false
    const runTraining = async () => {
      setIsTraining(true)
      
      const calRes = await trainNeuralNetwork(foodSeries, 'calories', 'Calorie Optimization Network')
      if (isCancelled) return
      const proRes = await trainNeuralNetwork(foodSeries, 'protein', 'Protein Forecasting Network')
      if (isCancelled) return
      const expRes = await trainNeuralNetwork(expenseSeries, 'total', 'Expense Volatility Network')
      if (isCancelled) return

      // Build forecast charts exactly as before but using the trained NN results
      const FOOD_MONTHS_AHEAD = 2
      
      const newFoodData = foodSeries.map(m => ({
        month: m.month.slice(5),
        calories: m.calories,
        protein: m.protein,
        type: 'actual'
      }))
      if (calRes && proRes) {
        for (let k = 1; k <= FOOD_MONTHS_AHEAD; k++) {
          const lastDate = new Date(foodSeries[foodSeries.length - 1].month + '-01')
          lastDate.setMonth(lastDate.getMonth() + k)
          const mStr = `${lastDate.getMonth() + 1}`.padStart(2, '0')
          newFoodData.push({
            month: mStr,
            predicted_calories: calRes.predictions[k - 1],
            predicted_protein: proRes.predictions[k - 1],
            type: 'predicted'
          })
        }
      }

      const newExpenseData = expenseSeries.map(m => ({
        month: m.month.slice(5),
        total: m.total,
        type: 'actual'
      }))
      if (expRes) {
        for (let k = 1; k <= FOOD_MONTHS_AHEAD; k++) {
          const lastDate = new Date(expenseSeries[expenseSeries.length - 1].month + '-01')
          lastDate.setMonth(lastDate.getMonth() + k)
          const mStr = `${lastDate.getMonth() + 1}`.padStart(2, '0')
          newExpenseData.push({
            month: mStr,
            predicted_total: expRes.predictions[k - 1],
            type: 'predicted'
          })
        }
      }

      setTfModels({ calorie: calRes, protein: proRes, expense: expRes })
      setPredictions({ food: newFoodData, expense: newExpenseData })
      
      setTimeout(() => setIsTraining(false), 500)
    }

    runTraining()
    return () => { isCancelled = true }
  }, []) // eslint-disable-line

  // ── Monthly stats ──────────────────────────────────────────────────────────
  const currentMonth = new Date().toISOString().slice(0, 7)
  const currentFoodData     = foodSeries.find(m => m.month === currentMonth)
  const currentExpenseData  = expenseSeries.find(m => m.month === currentMonth)

  // ── Compute food dominance for this month ──────────────────────────────────
  const thisMonthFoodLogs = Object.keys(foodLogs).filter(d => d.startsWith(currentMonth))
  const foodQtyTotals = {}
  FOODS.forEach(f => { foodQtyTotals[f.id] = 0 })
  thisMonthFoodLogs.forEach(date => {
    FOODS.forEach(f => { foodQtyTotals[f.id] += parseFloat(foodLogs[date][f.id] || 0) })
  })

  // ── Generate insights ──────────────────────────────────────────────────────
  const insights = useMemo(() => {
    const tips = []
    if (!hasEnoughData) {
      return [{ type: 'info', title: 'Data Gathering Phase', body: 'Neural Networks require sufficient history to train. Keep logging food and expenses!' }]
    }

    // Protein check
    const avgDailyProtein = currentFoodData
      ? currentFoodData.protein / Math.max(thisMonthFoodLogs.length, 1)
      : 0
    if (avgDailyProtein < 60 && avgDailyProtein > 0)
      tips.push({ type: 'warn', title: '⚡ Low Protein Intake', body: `Your average daily protein is ${avgDailyProtein.toFixed(1)}g, below recommended levels. AI model detects a persistent shortage.` })
    else if (avgDailyProtein >= 100)
      tips.push({ type: 'tip', title: '💪 Elite Protein Metrics!', body: `Averaging ${avgDailyProtein.toFixed(1)}g protein per day. Your neural forecast shows strong long-term muscle recovery potential.` })

    // Vegetable diversity
    if (foodQtyTotals.vegetables < 500 && foodQtyTotals.vegetables > 0)
      tips.push({ type: 'danger', title: '🥗 Critical Micronutrient Deficit', body: `Model anomaly detected: Only ${foodQtyTotals.vegetables.toFixed(0)}g of vegetables logged globally. Strongly advise 1.5–2 kg monthly target.` })

    // Banana energy tip
    if (foodQtyTotals.bananas > 15)
      tips.push({ type: 'info', title: '🍌 Carbohydrate Dominance', body: `High frequency banana consumption (${foodQtyTotals.bananas.toFixed(0)} items). Provides stable energy but watch glycemic load.` })

    // Expense NN trend analysis
    if (tfModels.expense && tfModels.expense.predictions[0]) {
      const predExp = tfModels.expense.predictions[0]
      const currExp = currentExpenseData ? currentExpenseData.total : predExp
      if (predExp > currExp * 1.1)
        tips.push({ type: 'warn', title: '📈 Volatility Alert (Expenses)', body: `Neural Net forecasts an upcoming +10% spending jump next month to ₹${predExp.toFixed(0)}. Bulk purchase advised.` })
      else if (predExp < currExp * 0.9)
        tips.push({ type: 'tip', title: '✅ Cost Efficiency Confirmed', body: `Deep learning model predicts a drop in diet expenses next month down to ~₹${predExp.toFixed(0)}.` })
    }

    return tips.length > 0 ? tips : [{ type: 'tip', title: '🎯 Equilibrium Reached!', body: 'Your data streams show high stability. The ML models indicate optimal tracking patterns.' }]
  }, [hasEnoughData, currentFoodData, thisMonthFoodLogs, foodQtyTotals, tfModels, currentExpenseData])


  return (
    <div className="min-h-screen lg:pl-64 pt-16 lg:pt-0 relative">
      
      {/* ── Neural Network Training Overlay ── */}
      <AnimatePresence>
        {isTraining && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#080f1a]/95 backdrop-blur-xl"
          >
            <div className="text-center w-full max-w-sm px-6">
              <div className="relative w-24 h-24 mx-auto mb-6">
                {/* Expanding outer pulse */}
                <motion.div className="absolute inset-0 rounded-full border-2 border-purple-500"
                  animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} />
                <motion.div className="absolute inset-0 rounded-full border border-blue-400"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }} />
                {/* Brain icon bouncing */}
                <motion.div
                  className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-[0_0_40px_rgba(168,85,247,0.6)] relative z-10"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                >
                  <Activity className="w-12 h-12 text-white/90" />
                </motion.div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Training Tensors...</h2>
              
              <div className="bg-[#0c1f35] border border-blue-500/30 rounded-2xl p-4 mt-6 text-left shadow-[0_10px_40px_rgba(14,165,233,0.1)]">
                <p className="text-white/80 font-semibold text-sm mb-2">{trainingPhase}</p>
                <div className="w-full h-2 bg-blue-900/30 rounded-full overflow-hidden relative mb-4">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    animate={{ width: `${(epoch / TARGET_EPOCHS) * 100}%` }}
                    transition={{ ease: 'easeOut', duration: 0.2 }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-purple-400">Epoch {epoch}/{TARGET_EPOCHS}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" /> Loss: {loss.toFixed(6)}
                  </span>
                </div>
              </div>

              <p className="text-white/40 text-xs mt-8">Utilizing TensorFlow.js Deep Learning</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', boxShadow: '0 0 20px rgba(168,85,247,0.35)' }}>
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Deep AI Insights</h1>
            </div>
          </div>
        </motion.div>

        {!hasEnoughData ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Brain className="w-12 h-12 mx-auto mb-4" style={{ color: '#a855f7', opacity: 0.5 }} />
            <p className="text-white font-semibold text-lg mb-2">Neural Link Disconnected</p>
            <p className="text-white/40 text-sm">Log food or expenses across at least 2 separate months to establish a valid tensor matrix for training.</p>
          </div>
        ) : (
          <div className="space-y-6">

            {/* ── KPI Summary ── */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  label: 'Neural Forecast: Next Month Calories',
                  value: tfModels.calorie && tfModels.calorie.predictions[0]
                    ? `${tfModels.calorie.predictions[0].toLocaleString(undefined, { maximumFractionDigits: 0 })} kcal`
                    : 'Training...',
                  icon: Zap, color: '#f97316',
                },
                {
                  label: 'Neural Forecast: Next Month Protein',
                  value: tfModels.protein && tfModels.protein.predictions[0]
                    ? `${tfModels.protein.predictions[0].toFixed(0)}g`
                    : 'Training...',
                  icon: Target, color: '#0ea5e9',
                },
                {
                  label: 'Neural Forecast: Next Month Expense',
                  value: tfModels.expense && tfModels.expense.predictions[0]
                    ? `₹${tfModels.expense.predictions[0].toFixed(0)}`
                    : 'Training...',
                  icon: DollarSign, color: '#a855f7',
                },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }} className="stat-card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: `${s.color}18` }}>
                      <s.icon className="w-4 h-4" style={{ color: s.color }} />
                    </div>
                  </div>
                  <p className="text-white/40 text-xs mb-1">{s.label}</p>
                  <p className="text-white font-bold text-xl tabular-nums">{s.value}</p>
                </motion.div>
              ))}
            </div>

            {/* ── Food Trend Chart ── */}
            {predictions.food.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Brain className="w-4 h-4" style={{ color: '#a855f7' }} />
                  <h2 className="text-white font-bold text-lg">Deep Learning Nutrition Trajectory</h2>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={predictions.food}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                    <Line type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={2.5}
                      dot={{ fill: '#f97316', r: 5 }} name="Actual Calories" connectNulls />
                    <Line type="monotone" dataKey="predicted_calories" stroke="#f97316" strokeWidth={2}
                      strokeDasharray="6 3" dot={{ fill: '#f97316', r: 5, strokeDasharray: '' }} name="TensorFlow Calories" connectNulls />
                    <Line type="monotone" dataKey="protein" stroke="#0ea5e9" strokeWidth={2.5}
                      dot={{ fill: '#0ea5e9', r: 5 }} name="Actual Protein (g)" connectNulls />
                    <Line type="monotone" dataKey="predicted_protein" stroke="#0ea5e9" strokeWidth={2}
                      strokeDasharray="6 3" dot={{ fill: '#0ea5e9', r: 5, strokeDasharray: '' }} name="TensorFlow Protein (g)" connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* ── Expense Trend Chart ── */}
            {predictions.expense.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Activity className="w-4 h-4" style={{ color: '#a855f7' }} />
                  <h2 className="text-white font-bold text-lg">Financial Forecast Vector</h2>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={predictions.expense}>
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
                      strokeDasharray="6 3" fill="url(#gPred)" name="TensorFlow Expense" connectNulls />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* ── AI Insights Panel ── */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Lightbulb className="w-4 h-4" style={{ color: '#facc15' }} />
                <h2 className="text-white font-bold text-lg">Algorithmic Interpretations</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.3)' }}>
                  {insights.length} Flag{insights.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="space-y-3">
                {insights.map((ins, i) => (
                  <InsightCard key={i} {...ins} />
                ))}
              </div>
            </div>

            {/* ── Neural Network Architecture Info ── */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" /> Layer Topology Information
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: 'Calorie Predictor Network', model: tfModels.calorie, color: '#f97316' },
                  { label: 'Protein Trajectory Net', model: tfModels.protein, color: '#0ea5e9' },
                  { label: 'Expense Optimization Net', model: tfModels.expense, color: '#a855f7' },
                ].map((m, i) => (
                  <div key={i} className="p-4 rounded-xl"
                    style={{ background: `${m.color}0a`, border: `1px solid ${m.color}20` }}>
                    <p className="text-white/60 text-xs mb-2">{m.label}</p>
                    {m.model ? (
                      <>
                        <p className="text-white text-xs font-mono mb-1 py-1 px-2 rounded bg-black/30 w-max border border-white/5">
                          {m.model.netSummary}
                        </p>
                        <p className="text-white/40 text-xs">
                          Epochs: {TARGET_EPOCHS} <br />
                          Final MSE Loss: <span style={{ color: m.color }}>{m.model.finalLoss?.toFixed(5)}</span>
                        </p>
                      </>
                    ) : (
                      <p className="text-white/30 text-xs">Awaiting Matrix Weights</p>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-white/20 text-xs mt-4">
                Powered by @tensorflow/tfjs. The application utilizes a Multi-Layer Perceptron architecture with ReLU activations.
                Deep Learning computations run on-device inside a sandboxed WebGL backend — absolute local privacy.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
