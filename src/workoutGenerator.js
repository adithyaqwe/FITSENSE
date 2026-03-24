// =============================================
// FitSense Workout Generator
// Rule-based algorithm from user payload
// =============================================

export function generateWorkoutPlan(fitnessGoal, rawActivityLevel) {
  // Map our UI's rawActivityLevel (sedentary, light, etc) to string values the user logic expects
  let level = "beginner";
  if (['extremely_active'].includes(rawActivityLevel)) level = "extreme";
  else if (['very_active'].includes(rawActivityLevel)) level = "advanced";
  else if (['moderately_active'].includes(rawActivityLevel)) level = "intermediate";

  // Hardcoded DB from user
  const db = {
    beginner: {
      chest: [
        { name: "Push-ups", sets: 3, reps: "10-15" },
        { name: "Dumbbell Press", sets: 3, reps: "10-12" },
      ],
      back: [
        { name: "Dumbbell Rows", sets: 3, reps: "10-12" },
        { name: "Lat Pulldowns", sets: 3, reps: "10-15" },
      ],
      legs: [
        { name: "Bodyweight Squats", sets: 3, reps: "15-20" },
        { name: "Lunges", sets: 3, reps: "10-12/leg" },
      ],
      shoulders: [
        { name: "Dumbbell Overhead Press", sets: 3, reps: "10-12" },
        { name: "Lateral Raises", sets: 3, reps: "12-15" },
      ],
      arms: [
        { name: "Bicep Curls", sets: 3, reps: "12-15" },
        { name: "Tricep Dips", sets: 3, reps: "10-15" },
      ],
      core: [
        { name: "Plank", sets: 3, reps: "30-45 sec" },
        { name: "Crunches", sets: 3, reps: "15-20" },
      ],
      cardio: [
        { name: "Brisk Walking", sets: 1, reps: "30 min" },
        { name: "Cycling", sets: 1, reps: "20 min" },
      ],
    },
    intermediate: {
      chest: [
        { name: "Barbell Bench Press", sets: 4, reps: "8-10" },
        { name: "Incline Dumbbell Press", sets: 3, reps: "10-12" },
      ],
      back: [
        { name: "Pull-ups", sets: 4, reps: "to failure" },
        { name: "Barbell Rows", sets: 4, reps: "8-10" },
      ],
      legs: [
        { name: "Barbell Squats", sets: 4, reps: "8-10" },
        { name: "Romanian Deadlifts", sets: 4, reps: "10-12" },
      ],
      shoulders: [
        { name: "Military Press", sets: 4, reps: "8-10" },
        { name: "Face Pulls", sets: 3, reps: "12-15" },
      ],
      arms: [
        { name: "Barbell Curls", sets: 3, reps: "10-12" },
        { name: "Skull Crushers", sets: 3, reps: "10-12" },
      ],
      core: [
        { name: "Hanging Leg Raises", sets: 3, reps: "12-15" },
        { name: "Russian Twists", sets: 3, reps: "20/side" },
      ],
      cardio: [
        { name: "HIIT Sprints", sets: 6, reps: "30s sprint/1m walk" },
        { name: "Stairmaster", sets: 1, reps: "20 min" },
      ],
    },
    advanced: {
      chest: [
        { name: "Weighted Dips", sets: 4, reps: "8-10" },
        { name: "Pause Bench Press", sets: 4, reps: "5-8" },
      ],
      back: [
        { name: "Weighted Pull-ups", sets: 4, reps: "8-10" },
        { name: "Deadlifts", sets: 4, reps: "5-8" },
      ],
      legs: [
        { name: "Front Squats", sets: 4, reps: "6-8" },
        { name: "Bulgarian Split Squats", sets: 3, reps: "8-10/leg" },
      ],
      shoulders: [
        { name: "Overhead Pin Press", sets: 4, reps: "6-8" },
        { name: "Lateral Raises (Heavy)", sets: 4, reps: "10-12" },
      ],
      arms: [
        { name: "Preacher Curls", sets: 4, reps: "8-10" },
        { name: "Close Grip Bench", sets: 4, reps: "6-8" },
      ],
      core: [
        { name: "Ab Wheel Rollouts", sets: 4, reps: "10-15" },
        { name: "Dragon Flags", sets: 3, reps: "to failure" },
      ],
      cardio: [
        { name: "Concept2 Rower Sprints", sets: 8, reps: "500m" },
        { name: "Assault Bike", sets: 1, reps: "15 min intervals" },
      ],
    },
    extreme: {
      chest: [
        { name: "One-arm Pushups", sets: 4, reps: "8-10/arm" },
        { name: "Heavy Weighted Dips", sets: 5, reps: "6-8" },
        { name: "Incline Bench Press (Heavy)", sets: 4, reps: "5-6" },
      ],
      back: [
        { name: "Muscle-ups", sets: 4, reps: "5-8" },
        { name: "Heavy Block Pulls", sets: 4, reps: "4-6" },
        { name: "Front Lever Holds", sets: 4, reps: "15-20 sec" },
      ],
      legs: [
        { name: "Heavy Back Squats", sets: 5, reps: "3-5" },
        { name: "Pistol Squats", sets: 4, reps: "10/leg" },
        { name: "Box Jumps (High)", sets: 4, reps: "8-10" },
      ],
      shoulders: [
        { name: "Handstand Pushups", sets: 4, reps: "8-12" },
        { name: "Heavy Push Press", sets: 5, reps: "4-6" },
      ],
      arms: [
        { name: "Strict Barbell Curls", sets: 5, reps: "6-8" },
        { name: "Weighted Tricep Dips", sets: 5, reps: "8-10" },
      ],
      core: [
        { name: "Human Flag Practice", sets: 4, reps: "10 sec/side" },
        { name: "L-sit Holds", sets: 4, reps: "20-30 sec" },
      ],
      cardio: [
        { name: "100 Burpees for Time", sets: 1, reps: "ASAP" },
        { name: "Murph WOD (weighted vest)", sets: 1, reps: "Full" },
      ],
    },
  };

  const plan = db[level];

  const weeklySchedule = {
    Monday: { name: "Chest & Triceps", emoji: "🏋️", type: "strength", exercises: [...plan.chest, ...plan.arms], duration: 45 },
    Tuesday: { name: "Back & Biceps", emoji: "💪", type: "strength", exercises: [...plan.back, ...plan.arms], duration: 45 },
    Wednesday: { name: "Active Recovery", emoji: "🧘", type: "recovery", exercises: plan.cardio, duration: 30 },
    Thursday: { name: "Legs & Core", emoji: "🦵", type: "strength", exercises: [...plan.legs, ...plan.core], duration: 50 },
    Friday: { name: "Shoulders & Arms", emoji: "🎯", type: "strength", exercises: [...plan.shoulders, ...plan.arms], duration: 45 },
    Saturday: { name: "Full Body HIIT", emoji: "⚡", type: "cardio", exercises: [...plan.core, ...plan.cardio], duration: 40 },
    Sunday: { name: "Rest Day", emoji: "😴", type: "rest", exercises: [], duration: 0, notes: "Complete rest and recovery." },
  };

  // Add warmups and cooldowns to match the properties our UI components expect
  for (const day in weeklySchedule) {
    if (weeklySchedule[day].type !== 'rest') {
      weeklySchedule[day].warmup = [
        '5-10 min light cardio',
        'Dynamic stretches',
        'Warmup sets for first exercise'
      ];
      weeklySchedule[day].cooldown = [
        '5 min static stretching',
        'Foam rolling',
        'Deep breathing'
      ];
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
