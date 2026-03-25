// =============================================
// FitSense Workout Generator
// AI-Tailored algorithm by goal & level
// =============================================

export function generateWorkoutPlan(fitnessGoal, rawActivityLevel) {
  // 1. Determine Fitness Level
  let level = "beginner";
  if (['extremely_active'].includes(rawActivityLevel)) level = "extreme";
  else if (['very_active'].includes(rawActivityLevel)) level = "advanced";
  else if (['moderately_active'].includes(rawActivityLevel)) level = "intermediate";

  // 2. Goal-Specific Tuning Parameters
  const tuning = {
    fat_loss: { repRange: "15-20", setMult: 3, rest: "45s", cardioBonus: 10 },
    muscle_gain: { repRange: "8-12", setMult: 4, rest: "90s", cardioBonus: 0 },
    bulk: { repRange: "5-8", setMult: 5, rest: "120s", cardioBonus: -5 },
    lean_body: { repRange: "10-15", setMult: 4, rest: "60s", cardioBonus: 5 },
  }[fitnessGoal] || { repRange: "10-12", setMult: 3, rest: "60s", cardioBonus: 0 };

  // 3. Exercise Database (Shared)
  const db = {
    beginner: {
      chest: [{ name: "Push-ups", muscle: "Chest", equipment: "Bodyweight" }, { name: "Dumbbell Press", muscle: "Chest", equipment: "Dumbbells" }],
      back: [{ name: "Dumbbell Rows", muscle: "Back", equipment: "Dumbbells" }, { name: "Lat Pulldowns", muscle: "Back/Lats", equipment: "Cable" }],
      legs: [{ name: "Bodyweight Squats", muscle: "Legs", equipment: "Bodyweight" }, { name: "Lunges", muscle: "Legs", equipment: "Bodyweight" }],
      shoulders: [{ name: "Dumbbell Overhead Press", muscle: "Shoulders", equipment: "Dumbbells" }, { name: "Lateral Raises", muscle: "Shoulders", equipment: "Dumbbells" }],
      arms: [{ name: "Bicep Curls", muscle: "Biceps", equipment: "Dumbbells" }, { name: "Tricep Dips", muscle: "Triceps", equipment: "Bench" }],
      core: [{ name: "Plank", muscle: "Core", equipment: "Bodyweight" }, { name: "Crunches", muscle: "Core", equipment: "Bodyweight" }],
      cardio: [{ name: "Brisk Walking", muscle: "Heart", equipment: "None" }, { name: "Cycling", muscle: "Heart", equipment: "Bike" }],
    },
    intermediate: {
      chest: [{ name: "Barbell Bench Press", muscle: "Chest", equipment: "Barbell" }, { name: "Incline Dumbbell Press", muscle: "Chest", equipment: "Dumbbells" }],
      back: [{ name: "Pull-ups", muscle: "Back", equipment: "Bar/Bodyweight" }, { name: "Barbell Rows", muscle: "Back", equipment: "Barbell" }],
      legs: [{ name: "Barbell Squats", muscle: "Legs", equipment: "Barbell" }, { name: "Romanian Deadlifts", muscle: "Posterior Chain", equipment: "Barbell" }],
      shoulders: [{ name: "Military Press", muscle: "Shoulders", equipment: "Barbell" }, { name: "Face Pulls", muscle: "Shoulders", equipment: "Cable" }],
      arms: [{ name: "Barbell Curls", muscle: "Biceps", equipment: "Barbell" }, { name: "Skull Crushers", muscle: "Triceps", equipment: "Barbell/Dumbbells" }],
      core: [{ name: "Hanging Leg Raises", muscle: "Core", equipment: "Bar" }, { name: "Russian Twists", muscle: "Core", equipment: "Medicine Ball" }],
      cardio: [{ name: "HIIT Sprints", muscle: "Heart", equipment: "Treadmill" }, { name: "Stairmaster", muscle: "Heart", equipment: "Machine" }],
    },
    advanced: {
      chest: [{ name: "Weighted Dips", muscle: "Chest/Triceps", equipment: "Dip Bar + Weight" }, { name: "Pause Bench Press", muscle: "Chest", equipment: "Barbell" }],
      back: [{ name: "Weighted Pull-ups", muscle: "Back", equipment: "Bar + Weight" }, { name: "Deadlifts", muscle: "Full Body", equipment: "Barbell" }],
      legs: [{ name: "Front Squats", muscle: "Legs/Core", equipment: "Barbell" }, { name: "Bulgarian Split Squats", muscle: "Legs", equipment: "Dumbbells" }],
      shoulders: [{ name: "Overhead Pin Press", muscle: "Shoulders", equipment: "Rack" }, { name: "Lateral Raises (Heavy)", muscle: "Shoulders", equipment: "Dumbbells" }],
      arms: [{ name: "Preacher Curls", muscle: "Biceps", equipment: "Bench" }, { name: "Close Grip Bench", muscle: "Triceps", equipment: "Barbell" }],
      core: [{ name: "Ab Wheel Rollouts", muscle: "Core", equipment: "Ab Wheel" }, { name: "Dragon Flags", muscle: "Core", equipment: "Bench" }],
      cardio: [{ name: "Concept2 Rower Sprints", muscle: "Full Body", equipment: "Rower" }, { name: "Assault Bike", muscle: "Full Body", equipment: "Assault Bike" }],
    },
    extreme: {
      chest: [{ name: "One-arm Pushups", muscle: "Chest", equipment: "Bodyweight" }, { name: "Heavy Weighted Dips", muscle: "Chest", equipment: "Dip Bar" }, { name: "Incline Bench Press (Heavy)", muscle: "Chest", equipment: "Barbell" }],
      back: [{ name: "Muscle-ups", muscle: "Back/Arms", equipment: "Bar" }, { name: "Heavy Block Pulls", muscle: "Back", equipment: "Barbell" }, { name: "Front Lever Holds", muscle: "Core/Back", equipment: "Bar" }],
      legs: [{ name: "Heavy Back Squats", muscle: "Legs", equipment: "Barbell" }, { name: "Pistol Squats", muscle: "Legs", equipment: "Bodyweight" }, { name: "Box Jumps (High)", muscle: "Legs", equipment: "Box" }],
      shoulders: [{ name: "Handstand Pushups", muscle: "Shoulders", equipment: "Floor/Wall" }, { name: "Heavy Push Press", muscle: "Shoulders", equipment: "Barbell" }],
      arms: [{ name: "Strict Barbell Curls", muscle: "Biceps", equipment: "Barbell" }, { name: "Weighted Tricep Dips", muscle: "Triceps", equipment: "Bar" }],
      core: [{ name: "Human Flag Practice", muscle: "Core/Lateral", equipment: "Vertical Bar" }, { name: "L-sit Holds", muscle: "Core", equipment: "Floor/Bar" }],
      cardio: [{ name: "100 Burpees for Time", muscle: "Heart", equipment: "Floor" }, { name: "Murph WOD (weighted vest)", muscle: "Full Body", equipment: "Everything" }],
    },
  };

  const videoMap = {
    "Push-ups": "https://www.youtube.com/embed/IODxDxX7oi4",
    "Dumbbell Press": "https://www.youtube.com/embed/VmByADxun-8",
    "Dumbbell Rows": "https://www.youtube.com/embed/5PoOp6PQ9Ic",
    "Lat Pulldowns": "https://www.youtube.com/embed/CAwf7n6Luuc",
    "Bodyweight Squats": "https://www.youtube.com/embed/aclHkVaku9U",
    "Lunges": "https://www.youtube.com/embed/wrwwXE_67NI",
    "Dumbbell Overhead Press": "https://www.youtube.com/embed/M2rwvNhSj00",
    "Lateral Raises": "https://www.youtube.com/embed/3VcKaXpzqRo",
    "Bicep Curls": "https://www.youtube.com/embed/ykJmrZ5v0Oo",
    "Tricep Dips": "https://www.youtube.com/embed/2z8JmcrW-As",
    "Plank": "https://www.youtube.com/embed/B296mZDhrP4",
    "Crunches": "https://www.youtube.com/embed/Xyd_fa5zoEU",
    "Barbell Bench Press": "https://www.youtube.com/embed/rT7DgCr-3pg",
    "Pull-ups": "https://www.youtube.com/embed/eGo4IYlbE5g",
    "Barbell Rows": "https://www.youtube.com/embed/RQU8wZad-00",
    "Barbell Squats": "https://www.youtube.com/embed/1oed-UmAxFs",
    "Deadlifts": "https://www.youtube.com/embed/op9kVnSso6Q",
    "Military Press": "https://www.youtube.com/embed/2yjwxtZ4D_w",
    "HIIT Sprints": "https://www.youtube.com/embed/6i7BvPPr1_w",
  };

  // 4. Generate the Week
  const basePlan = db[level];
  const applyTuning = (exs) => exs.map(ex => ({
    ...ex,
    sets: tuning.setMult,
    reps: tuning.repRange,
    rest: tuning.rest,
    videoUrl: videoMap[ex.name] || `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(ex.name + ' exercise demo')}`
  }));

  const weeklySchedule = {
    Monday: { name: "Chest & Triceps", emoji: "🏋️", type: "strength", exercises: applyTuning([...basePlan.chest, ...basePlan.arms]), duration: 45 + tuning.cardioBonus },
    Tuesday: { name: "Back & Biceps", emoji: "💪", type: "strength", exercises: applyTuning([...basePlan.back, ...basePlan.arms]), duration: 45 + tuning.cardioBonus },
    Wednesday: { name: "Active Recovery", emoji: "🧘", type: "recovery", exercises: applyTuning(basePlan.cardio), duration: 30 + tuning.cardioBonus },
    Thursday: { name: "Legs & Core", emoji: "🦵", type: "strength", exercises: applyTuning([...basePlan.legs, ...basePlan.core]), duration: 50 + tuning.cardioBonus },
    Friday: { name: "Shoulders & Arms", emoji: "🎯", type: "strength", exercises: applyTuning([...basePlan.shoulders, ...basePlan.arms]), duration: 45 + tuning.cardioBonus },
    Saturday: { name: "Full Body HIIT", emoji: "⚡", type: "cardio", exercises: applyTuning([...basePlan.core, ...basePlan.cardio]), duration: 40 + tuning.cardioBonus },
    Sunday: { name: "Rest Day", emoji: "😴", type: "rest", exercises: [], duration: 0, notes: "Complete rest and recovery." },
  };

  // 5. Add meta info
  for (const day in weeklySchedule) {
    if (weeklySchedule[day].type !== 'rest') {
      weeklySchedule[day].warmup = ['5-10 min light cardio', 'Dynamic stretches', 'Warmup sets'];
      weeklySchedule[day].cooldown = ['5 min static stretching', 'Foam rolling'];
    }
  }

  return {
    planName: `${level.charAt(0).toUpperCase() + level.slice(1)} ${fitnessGoal.replace('_', ' ')} Program`,
    goal: fitnessGoal,
    level,
    week: weeklySchedule,
    generatedAt: new Date().toISOString(),
  };
}
