// =============================================
// FitSense Core Fitness Algorithms
// Pure JavaScript - No external dependencies
// =============================================

export function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null;
  const hm = heightCm / 100;
  const bmiVal = parseFloat((weightKg / (hm * hm)).toFixed(1));
  const category = getBMICategory(bmiVal);
  return { bmi: bmiVal, category: category.label, color: category.color };
}

export function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: "Underweight", color: "#60a5fa" };
  if (bmi < 25) return { label: "Normal Weight", color: "#00f5a0" };
  if (bmi < 30) return { label: "Overweight", color: "#0ea5e9" };
  return { label: "Obese", color: "#ef4444" };
}

export function calculateTDEE(weightKg, heightCm, age, gender, activityLevel) {
  let bmr =
    gender === "male"
      ? 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age
      : 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age;
      
  const multipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9,
  };
  
  return Math.round(bmr * (multipliers[activityLevel] || 1.55));
}

export function calculateMacros(tdee, goal) {
  let calories = tdee;
  // Map goals from our UI (fat_loss, lean_body, muscle_gain, bulk) 
  // to the user's exact calorie math (+300 for muscle_gain, +600 for bulk, etc)
  if (goal === "fat_loss") calories = tdee - 500;
  else if (goal === "lean_body" || goal === "lean") calories = tdee - 250;
  else if (goal === "muscle_gain") calories = tdee + 300;
  else if (goal === "bulk") calories = tdee + 600;
  
  const protein = Math.round((calories * 0.3) / 4);
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.round((calories * 0.45) / 4);
  
  return { calories, protein, fat, carbs };
}

export function calculateFitnessProfile({ age, gender, heightCm, weightKg, activityLevel, fitnessGoal }) {
  const bmiResult = calculateBMI(weightKg, heightCm);
  const tdee = calculateTDEE(weightKg, heightCm, age, gender, activityLevel);
  const macros = calculateMacros(tdee, fitnessGoal);
  
  return { 
    bmi: bmiResult?.bmi, 
    bmiCategory: bmiResult?.category, 
    bmr: tdee, // Keeping property names consistent for the UI
    tdee, 
    targetCalories: macros.calories, 
    macros 
  };
}
