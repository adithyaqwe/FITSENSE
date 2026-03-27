// =============================================
// FitSense Workout Generator
// AI-Tailored algorithm by goal & level
// =============================================

export function generateWorkoutPlan(fitnessGoal, rawActivityLevel, manualLevel) {
  // 1. Determine Fitness Level
  let level = manualLevel || "beginner";
  if (!manualLevel) {
    if (['extremely_active', 'athlete'].includes(rawActivityLevel)) level = "extreme";
    else if (['very_active'].includes(rawActivityLevel)) level = "advanced";
    else if (['moderately_active'].includes(rawActivityLevel)) level = "intermediate";
  }

  // Sanitize goal input
  const sanitizedGoal = (fitnessGoal || '').toLowerCase().replace(/_/g, ' ');
  const goalMap = {
    'fat loss': 'fat_loss',
    'fatloss': 'fat_loss',
    'muscle gain': 'muscle_gain',
    'muscle gaining': 'muscle_gain',
    'musle gain': 'muscle_gain',
    'musle gaining': 'muscle_gain',
    'lean body': 'lean_body',
    'lean': 'lean_body',
    'bulk': 'bulk'
  }
  const mainGoal = goalMap[sanitizedGoal] || fitnessGoal;

  // 2. Goal-Specific Tuning Parameters
  const tuning = {
    fat_loss: { repRange: "15-20", setMult: 3, rest: "45s", cardioBonus: 10, focus: "Endurance" },
    muscle_gain: { repRange: "8-12", setMult: 4, rest: "90s", cardioBonus: 0, focus: "Hypertrophy" },
    bulk: { repRange: "5-8", setMult: 5, rest: "120s", cardioBonus: -5, focus: "Power/Strength" },
    lean_body: { repRange: "10-15", setMult: 4, rest: "60s", cardioBonus: 5, focus: "Tone/Stamina" },
  }[mainGoal] || { repRange: "10-12", setMult: 3, rest: "60s", cardioBonus: 0, focus: "Balanced" };

  // 3. Exercise Database (Shared + Goal Specific) - World Class Coach Edition
  const baseDb = {
    beginner: {
      chest: [{ name: "Machine Chest Press", muscle: "Chest", equipment: "Machine" }, { name: "Incline Push-Ups", muscle: "Chest", equipment: "Bodyweight" }],
      back: [{ name: "Seated Cable Rows", muscle: "Back", equipment: "Cable" }, { name: "Assisted Pull-Up Machine", muscle: "Back/Lats", equipment: "Machine" }],
      legs: [{ name: "Goblet Squats", muscle: "Legs", equipment: "Kettlebell" }, { name: "Leg Press Machine", muscle: "Legs", equipment: "Machine" }],
      shoulders: [{ name: "Seated Dumbbell Press", muscle: "Shoulders", equipment: "Dumbbells" }, { name: "Machine Lateral Raises", muscle: "Shoulders", equipment: "Machine" }],
      arms: [{ name: "Cable Bicep Curls", muscle: "Biceps", equipment: "Cable" }, { name: "Rope Tricep Pushdowns", muscle: "Triceps", equipment: "Cable" }],
      core: [{ name: "Forearm Plank", muscle: "Core", equipment: "Bodyweight" }, { name: "Bird-Dog Extensions", muscle: "Core", equipment: "Bodyweight" }],
      cardio: [{ name: "Steady State Treadmill Walk", muscle: "Heart", equipment: "Treadmill" }, { name: "Stationary Bike Sprints", muscle: "Heart", equipment: "Bike" }],
    },
    intermediate: {
      chest: [{ name: "Barbell Bench Press (RPE 8)", muscle: "Chest", equipment: "Barbell" }, { name: "Incline Dumbbell Flyes", muscle: "Chest", equipment: "Dumbbells" }, { name: "Pec Deck Machine", muscle: "Chest", equipment: "Machine" }],
      back: [{ name: "Barbell Pendlay Rows", muscle: "Back", equipment: "Barbell" }, { name: "Wide-Grip Lat Pulldowns", muscle: "Back", equipment: "Cable" }, { name: "Face Pulls", muscle: "Rear Delts/Back", equipment: "Cable" }],
      legs: [{ name: "Barbell Back Squats", muscle: "Legs", equipment: "Barbell" }, { name: "Romanian Deadlifts (RDL)", muscle: "Posterior Chain", equipment: "Barbell" }, { name: "Walking Lunges", muscle: "Quads", equipment: "Dumbbells" }],
      shoulders: [{ name: "Standing Military Press", muscle: "Shoulders", equipment: "Barbell" }, { name: "Cable Lateral Raises", muscle: "Shoulders", equipment: "Cable" }],
      arms: [{ name: "EZ-Bar Preacher Curls", muscle: "Biceps", equipment: "EZ-Bar" }, { name: "Overhead Dumbbell Tricep Extension", muscle: "Triceps", equipment: "Dumbbell" }, { name: "Hammer Curls", muscle: "Biceps/Forearms", equipment: "Dumbbells" }],
      core: [{ name: "Hanging Knee Raises", muscle: "Core", equipment: "Bar" }, { name: "Cable Woodchoppers", muscle: "Core", equipment: "Cable" }],
      cardio: [{ name: "Rowing Machine Intervals", muscle: "Heart", equipment: "Rower" }, { name: "Stairmaster", muscle: "Heart", equipment: "Machine" }],
    },
    advanced: {
      chest: [{ name: "Deficit Push-ups (Weighted)", muscle: "Chest/Triceps", equipment: "Plates/Vest" }, { name: "Pause Bench Press (3s pause)", muscle: "Chest", equipment: "Barbell" }, { name: "Decline Cable Crossovers", muscle: "Chest", equipment: "Cable" }],
      back: [{ name: "Weighted Pull-ups (Pronated)", muscle: "Back", equipment: "Bar + Weight" }, { name: "Meadows Rows", muscle: "Back", equipment: "Barbell" }, { name: "Straight-arm Pulldowns", muscle: "Back", equipment: "Cable" }],
      legs: [{ name: "Front Squats (Olympic Stance)", muscle: "Legs/Core", equipment: "Barbell" }, { name: "Bulgarian Split Squats", muscle: "Legs", equipment: "Dumbbells" }, { name: "Glute-Ham Raises (GHR)", muscle: "Posterior Chain", equipment: "Machine/Floor" }],
      shoulders: [{ name: "Seated Arnold Press", muscle: "Shoulders", equipment: "Dumbbells" }, { name: "Lean-Away Cable Lateral Raises", muscle: "Shoulders", equipment: "Cable" }],
      arms: [{ name: "Spider Curls (EZ-Bar)", muscle: "Biceps", equipment: "Bench/EZ-Bar" }, { name: "Skull Crushers to Close-Grip Bench", muscle: "Triceps", equipment: "Barbell" }, { name: "Reverse EZ-Bar Curls", muscle: "Brachialis", equipment: "Barbell" }],
      core: [{ name: "Toes-to-Bar", muscle: "Core", equipment: "Bar" }, { name: "Ab Wheel Rollouts (From Feet)", muscle: "Core", equipment: "Ab Wheel" }],
      cardio: [{ name: "Tabata Sprints", muscle: "Full Body", equipment: "Assault Bike" }, { name: "Heavy Sled Push/Pull", muscle: "Full Body", equipment: "Sled" }],
    },
    extreme: {
      chest: [{ name: "Plyometric Clapping Push-ups", muscle: "Chest", equipment: "Bodyweight" }, { name: "Ring Dips (Weighted)", muscle: "Chest", equipment: "Rings" }, { name: "Heavy Floor Press", muscle: "Chest", equipment: "Barbell" }],
      back: [{ name: "Strict Muscle-Ups", muscle: "Back/Arms", equipment: "Bar/Rings" }, { name: "Heavy Rack Pulls (Above Knee)", muscle: "Back", equipment: "Barbell" }, { name: "Front Lever Holds", muscle: "Core/Back", equipment: "Bar" }],
      legs: [{ name: "Heavy Zercher Squats", muscle: "Legs", equipment: "Barbell" }, { name: "Pistol Squats (Weighted)", muscle: "Legs", equipment: "Kettlebell" }, { name: "Box Jumps (Max Depth)", muscle: "Legs", equipment: "Box" }],
      shoulders: [{ name: "Handstand Push-Ups (Strict)", muscle: "Shoulders", equipment: "Wall" }, { name: "Heavy Push Press", muscle: "Shoulders", equipment: "Barbell" }, { name: "Bradford Press", muscle: "Shoulders", equipment: "Barbell" }],
      arms: [{ name: "Strict Cheat Curls (Heavy Eccentric)", muscle: "Biceps", equipment: "Barbell" }, { name: "JM Press", muscle: "Triceps", equipment: "Barbell" }],
      core: [{ name: "Dragon Flags", muscle: "Core", equipment: "Bench" }, { name: "Human Flag Progressions", muscle: "Core/Lateral", equipment: "Vertical Bar" }, { name: "Weighted L-sit Holds", muscle: "Core", equipment: "Floor/Bar" }],
      cardio: [{ name: "100 Burpees for Time", muscle: "Heart", equipment: "Floor" }, { name: "Concept2 Rower 500m Max Sprint", muscle: "Full Body", equipment: "Rower" }],
    },
  };

  const plan = baseDb[level];

  // Goals-Specific Modification logic
  const modifyForGoal = (exs) => exs.map(ex => {
    let finalReps = tuning.repRange;
    let finalSets = tuning.setMult;
    let finalRest = tuning.rest;
    
    // Level-Specific Overrides (Different stages get different volume & reps)
    if (level === 'beginner') {
      finalSets = Math.max(2, finalSets - 1);
      finalReps = "12-15";
      finalRest = "90s";
    } else if (level === 'advanced') {
      finalSets += 1;
      finalReps = "6-10";
      finalRest = "120s";
    } else if (level === 'extreme') {
      finalSets += 2;
      finalReps = "3-6";
      finalRest = "180s";
    }
    
    // Muscle gain tweaks
    if (mainGoal === 'muscle_gain' || mainGoal === 'bulk') {
      if (ex.equipment === 'Barbell' || ex.equipment === 'Dumbbells') {
        finalSets += 1; // Extra set for hypertrophy/bulk on heavy lifts
      }
    }

    return {
      ...ex,
      sets: finalSets,
      reps: finalReps,
      rest: finalRest,
    }
  });

  const weeklySchedule = {
    Monday: { name: `Chest & Triceps (${tuning.focus})`, emoji: "🏋️", type: "strength", exercises: modifyForGoal([...plan.chest, ...plan.arms]), duration: 45 + tuning.cardioBonus },
    Tuesday: { name: `Back & Biceps (${tuning.focus})`, emoji: "💪", type: "strength", exercises: modifyForGoal([...plan.back, ...plan.arms]), duration: 45 + tuning.cardioBonus },
    Wednesday: { name: "Active Recovery", emoji: "🧘", type: "recovery", exercises: modifyForGoal(plan.cardio), duration: 30 + tuning.cardioBonus },
    Thursday: { name: `Legs & Core (${tuning.focus})`, emoji: "🦵", type: "strength", exercises: modifyForGoal([...plan.legs, ...plan.core]), duration: 50 + tuning.cardioBonus },
    Friday: { name: `Shoulders & Arms (${tuning.focus})`, emoji: "🎯", type: "strength", exercises: modifyForGoal([...plan.shoulders, ...plan.arms]), duration: 45 + tuning.cardioBonus },
    Saturday: { name: `Full Body HIIT (${tuning.focus})`, emoji: "⚡", type: "cardio", exercises: modifyForGoal([...plan.core, ...plan.cardio]), duration: 40 + tuning.cardioBonus },
    Sunday: { name: "Rest Day", emoji: "😴", type: "rest", exercises: [], duration: 0, notes: "Complete rest and recover for maximum muscle growth." },
  };

  for (const day in weeklySchedule) {
    if (weeklySchedule[day].type !== 'rest') {
      weeklySchedule[day].warmup = ['5-10 min light cardio', 'Dynamic stretches', 'Warmup sets'];
      weeklySchedule[day].cooldown = ['5 min static stretching', 'Foam rolling'];
    }
  }

  return {
    planName: `${level.charAt(0).toUpperCase() + level.slice(1)} ${mainGoal.replace('_', ' ')} Program`,
    goal: mainGoal,
    level,
    week: weeklySchedule,
    generatedAt: new Date().toISOString(),
  };
}
