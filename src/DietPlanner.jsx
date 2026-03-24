import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Utensils, RefreshCw, Coffee, Sun, Moon, Apple, ChevronDown, ChevronUp } from 'lucide-react'
import AppLayout from './AppLayout'
import { useAuth } from './AuthContext'
import { useHealthMetrics, useDietPlan } from './useData'
import { generateDietPlan, getMealTimings } from './dietAlgorithm'
import { calculateMacros } from './fitnessCalculator'
import { supabase } from './supabase'

const MEAL_ICONS = { breakfast: Coffee, lunch: Sun, dinner: Moon, snacks: Apple }
const MEAL_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snacks: 'Snacks' }
const MACRO_COLORS = { Protein: '#000000', Carbs: '#0ea5e9', Fat: '#eab308' }

function MacroBar({ protein, carbs, fat, total }) {
  const pPct = Math.round((protein * 4 / total) * 100)
  const cPct = Math.round((carbs * 4 / total) * 100)
  const fPct = Math.round((fat * 9 / total) * 100)
  return (
    <div className="space-y-3">
      <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5">
        <motion.div className="bg-black/80 rounded-l-full" initial={{ width: 0 }} animate={{ width: `${pPct}%` }} transition={{ duration: 0.8 }} title={`Protein ${pPct}%`} />
        <motion.div className="bg-brand-500" initial={{ width: 0 }} animate={{ width: `${cPct}%` }} transition={{ duration: 0.8, delay: 0.1 }} title={`Carbs ${cPct}%`} />
        <motion.div className="bg-yellow-500 rounded-r-full" initial={{ width: 0 }} animate={{ width: `${fPct}%` }} transition={{ duration: 0.8, delay: 0.2 }} title={`Fat ${fPct}%`} />
      </div>
      <div className="flex gap-4 text-xs font-body">
        <span className="text-black">Protein {pPct}%</span>
        <span className="text-brand-400">Carbs {cPct}%</span>
        <span className="text-yellow-400">Fat {fPct}%</span>
      </div>
    </div>
  )
}

function MealCard({ mealKey, meal, timing }) {
  const [open, setOpen] = useState(false)
  const Icon = MEAL_ICONS[mealKey]
  const { totalMacros, items } = meal

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <button onClick={() => setOpen(!open)}
        className="w-full p-5 flex items-center gap-4 hover:bg-white/2 transition-colors text-left">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(14, 165, 233,0.12)', border: '1px solid rgba(14, 165, 233,0.15)' }}>
          <Icon className="w-5 h-5 text-brand-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-body font-semibold text-white text-sm">{MEAL_LABELS[mealKey]}</h3>
            {timing && <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 10 }}>{timing}</span>}
          </div>
          <p className="font-mono text-brand-400 text-xs">{totalMacros.cal} kcal</p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="hidden sm:flex gap-3 text-xs font-mono">
            <span className="text-black">P:{totalMacros.protein}g</span>
            <span className="text-brand-400">C:{totalMacros.carbs}g</span>
            <span className="text-yellow-400">F:{totalMacros.fat}g</span>
          </div>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            {open ? <ChevronUp className="w-3.5 h-3.5 text-white/40" /> : <ChevronDown className="w-3.5 h-3.5 text-white/40" />}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="p-5 space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/4 last:border-0">
                  <div>
                    <span className="font-body text-white/80 text-sm">{item.name}</span>
                    <span className="font-mono text-white/25 text-xs ml-2">{item.grams}{item.unit === 'g' ? 'g' : ` ${item.unit}`}</span>
                  </div>
                  <div className="flex gap-3 text-xs font-mono">
                    <span className="text-white/40">{item.macros.cal} kcal</span>
                    <span className="text-black hidden sm:block">P:{item.macros.protein}g</span>
                    <span className="text-brand-400 hidden sm:block">C:{item.macros.carbs}g</span>
                    <span className="text-yellow-400 hidden sm:block">F:{item.macros.fat}g</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }
})

export default function DietPlanner() {
  const { user } = useAuth()
  const { data: metrics } = useHealthMetrics()
  const { data: savedPlan, refetch } = useDietPlan()
  const [generating, setGenerating] = useState(false)
  const [currentPlan, setCurrentPlan] = useState(null)

  const activePlan = currentPlan || savedPlan?.plan_data

  const generatePlan = async () => {
    if (!metrics) return
    setGenerating(true)
    const macrosObj = calculateMacros(metrics.tdee, metrics.fitness_goal)
    const targetCal = macrosObj.calories
    const plan = generateDietPlan(targetCal, macrosObj, metrics.fitness_goal)
    await supabase.from('diet_plans').update({ is_active: false }).eq('user_id', user.id)
    const { error } = await supabase.from('diet_plans').insert({
      user_id: user.id,
      daily_calories: targetCal,
      protein_g: macrosObj.protein,
      carbs_g: macrosObj.carbs,
      fat_g: macrosObj.fat,
      plan_data: plan,
      is_active: true,
    })
    if (!error) { setCurrentPlan(plan); refetch() }
    setGenerating(false)
  }

  const timings = metrics ? getMealTimings(metrics.activity_level) : {}

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div {...fade(0)} className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="section-label mb-2">Nutrition</p>
            <h1 className="font-display text-5xl text-white tracking-wide">DIET PLAN</h1>
            <p className="font-body text-white/40 text-sm mt-1">AI-generated meals based on your metrics</p>
          </div>
          <button onClick={generatePlan} disabled={!metrics || generating}
            className="btn-brand flex items-center gap-2.5 px-6 py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed">
            <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
            {generating ? 'Generating…' : activePlan ? 'Regenerate' : 'Generate Plan'}
          </button>
        </motion.div>

        {/* No profile */}
        {!metrics && (
          <motion.div {...fade(0.1)} className="rounded-2xl p-12 text-center"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <Utensils className="w-7 h-7 text-white/20" />
            </div>
            <p className="font-body text-white/40 text-sm">Complete your health profile to generate a personalized diet plan.</p>
          </motion.div>
        )}

        {/* No plan yet */}
        {metrics && !activePlan && !generating && (
          <motion.div {...fade(0.1)} className="rounded-2xl p-12 text-center"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'rgba(14, 165, 233,0.1)', border: '1px solid rgba(14, 165, 233,0.2)' }}>
              <Utensils className="w-7 h-7 text-brand-400" />
            </div>
            <p className="font-body text-white font-semibold mb-2">No diet plan yet</p>
            <p className="font-body text-white/40 text-sm mb-6">Click "Generate Plan" to create your personalized AI meal plan</p>
            <button onClick={generatePlan} className="btn-brand px-8 py-3 text-sm mx-auto">Generate My Plan</button>
          </motion.div>
        )}

        {generating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl p-12 text-center"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(14, 165, 233,0.15)' }}>
            <div className="w-10 h-10 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="font-body text-white/50 text-sm">Generating your personalized plan…</p>
          </motion.div>
        )}

        {/* Active Plan */}
        {activePlan && !generating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-5">
            {/* Daily Targets */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 className="font-display text-2xl text-white tracking-wide mb-5">DAILY TARGETS</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'Calories', value: activePlan.dailyTarget?.calories, unit: 'kcal', color: '#0ea5e9' },
                  { label: 'Protein', value: activePlan.dailyTarget?.protein, unit: 'g', color: '#000000' },
                  { label: 'Carbs', value: activePlan.dailyTarget?.carbs, unit: 'g', color: '#0ea5e9' },
                  { label: 'Fat', value: activePlan.dailyTarget?.fat, unit: 'g', color: '#eab308' },
                ].map(item => (
                  <div key={item.label} className="rounded-xl p-4 text-center"
                    style={{ background: item.color + '0d', border: `1px solid ${item.color}20` }}>
                    <div className="font-display text-3xl tabular-nums" style={{ color: item.color }}>{item.value}</div>
                    <div className="font-mono text-xs mt-0.5" style={{ color: item.color + 'aa' }}>{item.unit}</div>
                    <div className="font-body text-white/35 text-xs mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
              <MacroBar
                protein={activePlan.dailyTarget?.protein}
                carbs={activePlan.dailyTarget?.carbs}
                fat={activePlan.dailyTarget?.fat}
                total={activePlan.dailyTarget?.calories} />
            </div>

            {/* Meals */}
            <div className="space-y-3">
              {['breakfast', 'lunch', 'dinner', 'snacks'].map(mealKey =>
                activePlan.meals?.[mealKey] && (
                  <MealCard key={mealKey} mealKey={mealKey} meal={activePlan.meals[mealKey]} timing={timings[mealKey]} />
                )
              )}
            </div>

            <p className="font-body text-white/20 text-xs text-center pb-2">
              Generated {activePlan.generatedAt ? new Date(activePlan.generatedAt).toLocaleDateString() : ''}. Regenerate daily for variety.
            </p>
          </motion.div>
        )}
      </div>
    </AppLayout>
  )
}
