// =============================================
// FitSense Discipline Score Engine
// =============================================

/**
 * Calculate discipline score for a day
 * @param {Object} tasks - completed task statuses
 * @returns {{ score: number, pct: number, grade: string, color: string }}
 */
export function calculateDisciplineScore(tasks) {
  const taskWeights = {
    workout_completed: 30,
    breakfast_completed: 10,
    lunch_completed: 10,
    dinner_completed: 10,
    snacks_completed: 5,
    water_goal: 20,  // water_intake_ml >= water_goal_ml
    steps_goal: 15,  // steps_count >= steps_goal
  }

  let earned = 0
  const total = Object.values(taskWeights).reduce((a, b) => a + b, 0)

  if (tasks.workout_completed) earned += taskWeights.workout_completed
  if (tasks.breakfast_completed) earned += taskWeights.breakfast_completed
  if (tasks.lunch_completed) earned += taskWeights.lunch_completed
  if (tasks.dinner_completed) earned += taskWeights.dinner_completed
  if (tasks.snacks_completed) earned += taskWeights.snacks_completed
  if (tasks.water_intake_ml >= tasks.water_goal_ml) earned += taskWeights.water_goal
  if (tasks.steps_count >= tasks.steps_goal) earned += taskWeights.steps_goal

  // Add custom task completion
  if (tasks.custom_tasks?.length) {
    const customTotal = tasks.custom_tasks.length
    const customCompleted = tasks.custom_tasks.filter(t => t.completed).length
    const customBonus = Math.round((customCompleted / customTotal) * 5)
    earned += customBonus
  }

  const pct = Math.min(100, Math.round((earned / total) * 100))

  let grade, color
  if (pct >= 90) { grade = 'Elite'; color = '#0ea5e9' }
  else if (pct >= 75) { grade = 'Strong'; color = '#22c55e' }
  else if (pct >= 60) { grade = 'Decent'; color = '#000000' }
  else if (pct >= 40) { grade = 'Weak'; color = '#eab308' }
  else { grade = 'Poor'; color = '#ef4444' }

  return { score: earned, total, pct, grade, color }
}

/**
 * Calculate weekly discipline score from array of daily tasks
 * @param {Array} weeklyTasks - array of daily_tasks records
 * @returns {Object}
 */
export function calculateWeeklyScore(weeklyTasks) {
  if (!weeklyTasks?.length) return { pct: 0, grade: 'No Data', daysLogged: 0 }

  const scores = weeklyTasks.map(day => calculateDisciplineScore(day))
  const avgPct = Math.round(scores.reduce((a, b) => a + b.pct, 0) / scores.length)

  let grade
  if (avgPct >= 85) grade = 'Elite Week'
  else if (avgPct >= 70) grade = 'Strong Week'
  else if (avgPct >= 50) grade = 'Average Week'
  else grade = 'Needs Work'

  return {
    pct: avgPct,
    grade,
    daysLogged: weeklyTasks.length,
    dailyBreakdown: scores,
  }
}

/**
 * Calculate workout streak
 * @param {Array} taskHistory - sorted by date descending
 * @returns {{ current: number, longest: number }}
 */
export function calculateStreak(taskHistory) {
  if (!taskHistory?.length) return { current: 0, longest: 0 }

  let current = 0
  let longest = 0
  let streak = 0

  const today = new Date().toDateString()

  for (let i = 0; i < taskHistory.length; i++) {
    const task = taskHistory[i]
    if (task.workout_completed) {
      streak++
      longest = Math.max(longest, streak)
      if (i === 0) current = streak
    } else {
      if (i === 0) current = 0
      streak = 0
    }
  }

  return { current, longest }
}

/**
 * Get motivational message based on score
 */
export function getMotivationalMessage(pct) {
  if (pct >= 90) return "🔥 You're unstoppable! Elite performance today."
  if (pct >= 75) return "💪 Solid work. Keep this momentum going!"
  if (pct >= 60) return "👍 Good effort. Push a little harder tomorrow."
  if (pct >= 40) return "⚡ Average day. You can do better. Stay focused."
  return "😤 Rough day? Reset and come back stronger."
}
