// =============================================
// FitSense Diet Plan Generator
// Rule-based algorithm from user payload
// =============================================

export function generateDietPlan(dailyCalories, macros, rawGoal) {
  // Map our UI goals (fat_loss, etc) to string keys used in user's algorithm
  const goalMap = {
    'fat_loss': 'fatLoss',
    'fat loss': 'fatLoss',
    'fatloss': 'fatLoss',
    'muscle_gain': 'muscleGain',
    'muscle gain': 'muscleGain',
    'muscle gaining': 'muscleGain',
    'musle gain': 'muscleGain',
    'musle gaining': 'muscleGain',
    'lean_body': 'lean',
    'lean body': 'lean',
    'lean': 'lean',
    'bulk': 'bulk'
  }
  const goal = goalMap[rawGoal] || 'lean';

  const plans = {
    fatLoss: {
      breakfast: [
        { item: "Classic Grapefruit & Poached Eggs", portion: "1/2 Grapefruit, 3 Eggs", cal: 260, p: 18, c: 15, f: 15 },
        { item: "Black Coffee or Green Tea", portion: "1 cup", cal: 5, p: 0, c: 1, f: 0 },
        { item: "Oatmeal (Dietitian's Prep)", portion: "40g oats + cinnamon", cal: 150, p: 5, c: 27, f: 3 },
      ],
      lunch: [
        { item: "Grilled Lean Chicken Breast", portion: "200g", cal: 330, p: 62, c: 0, f: 7 },
        { item: "Large Garden Salad + Olive Oil", portion: "2 cups + 1 tbsp oil", cal: 140, p: 2, c: 5, f: 14 },
        { item: "Boiled Sweet Potato", portion: "100g", cal: 90, p: 1, c: 20, f: 0 },
      ],
      dinner: [
        { item: "Baked White Fish (or Tofu)", portion: "200g", cal: 200, p: 40, c: 0, f: 4 },
        { item: "Steamed Asparagus", portion: "200g", cal: 40, p: 4, c: 8, f: 0 },
        { item: "Lemon juice & herbs", portion: "1 serving", cal: 5, p: 0, c: 1, f: 0 },
      ],
      snacks: [
        { item: "Raw Almonds (Soaked)", portion: "20g", cal: 115, p: 4, c: 4, f: 10 },
        { item: "Green Apple", portion: "1 medium", cal: 95, p: 0, c: 25, f: 0 },
      ],
    },
    muscleGain: {
      breakfast: [
        { item: "Top Dietitian's Power Oatmeal", portion: "100g oats, honey, walnuts", cal: 450, p: 12, c: 65, f: 18 },
        { item: "Whole Eggs (Farm Fresh)", portion: "4 eggs", cal: 280, p: 24, c: 2, f: 20 },
        { item: "Whole Milk", portion: "250ml", cal: 150, p: 8, c: 12, f: 8 },
      ],
      lunch: [
        { item: "Classic Beef Steak (or Soya)", portion: "250g", cal: 500, p: 65, c: 0, f: 25 },
        { item: "Brown Rice", portion: "200g cooked", cal: 220, p: 5, c: 45, f: 2 },
        { item: "Steamed Spinach", portion: "150g", cal: 35, p: 4, c: 5, f: 0 },
      ],
      dinner: [
        { item: "Roasted Chicken Thighs", portion: "250g", cal: 420, p: 55, c: 0, f: 22 },
        { item: "Whole Wheat Pasta", portion: "150g cooked", cal: 220, p: 8, c: 44, f: 1 },
        { item: "Avocado", portion: "1/2 medium", cal: 120, p: 1, c: 6, f: 11 },
      ],
      snacks: [
        { item: "Cottage Cheese (Paneer)", portion: "200g", cal: 200, p: 28, c: 6, f: 8 },
        { item: "Banana", portion: "1 large", cal: 110, p: 1, c: 28, f: 0 },
      ],
    },
    lean: {
      breakfast: [
        { item: "Egg White & Spinach Omelette", portion: "5 whites + 1 whole", cal: 160, p: 24, c: 2, f: 5 },
        { item: "Sprouted Grain Bread", portion: "2 slices", cal: 160, p: 8, c: 30, f: 2 },
        { item: "Matcha Tea", portion: "1 cup", cal: 5, p: 0, c: 1, f: 0 },
      ],
      lunch: [
        { item: "Turkey Breast (or Lentils)", portion: "200g", cal: 220, p: 48, c: 0, f: 2 },
        { item: "Quinoa Bowl", portion: "150g cooked", cal: 165, p: 6, c: 30, f: 3 },
        { item: "Cucumber & Bell Peppers", portion: "150g", cal: 30, p: 1, c: 6, f: 0 },
      ],
      dinner: [
        { item: "Wild Caught Salmon", portion: "180g", cal: 350, p: 40, c: 0, f: 20 },
        { item: "Broccoli Florets", portion: "200g", cal: 55, p: 4, c: 10, f: 0 },
        { item: "Wild Rice", portion: "100g cooked", cal: 100, p: 4, c: 21, f: 0 },
      ],
      snacks: [
        { item: "Greek Yogurt", portion: "150g", cal: 90, p: 15, c: 6, f: 0 },
        { item: "Mixed Berries", portion: "100g", cal: 50, p: 1, c: 12, f: 0 },
      ],
    },
    bulk: {
      breakfast: [
        { item: "Old School Mass Shake", portion: "Oats, PB, Whey, Banana", cal: 850, p: 45, c: 90, f: 30 },
        { item: "Whole Eggs", portion: "5 eggs", cal: 350, p: 30, c: 2, f: 25 },
        { item: "Sourdough Toast with Butter", portion: "2 slices", cal: 250, p: 6, c: 35, f: 10 },
      ],
      lunch: [
        { item: "Heavy Ribeye Steak", portion: "300g", cal: 650, p: 70, c: 0, f: 45 },
        { item: "White Rice (Traditional Builder)", portion: "300g cooked", cal: 390, p: 8, c: 86, f: 1 },
        { item: "Mixed Veggies in Olive Oil", portion: "200g", cal: 150, p: 5, c: 10, f: 10 },
      ],
      dinner: [
        { item: "Half Roasted Chicken", portion: "400g meat", cal: 600, p: 80, c: 0, f: 30 },
        { item: "Mashed Potatoes (Whole milk & butter)", portion: "300g", cal: 400, p: 8, c: 65, f: 12 },
        { item: "Dense Wheat Bread", portion: "2 slices", cal: 200, p: 8, c: 38, f: 2 },
      ],
      snacks: [
        { item: "Handful Mixed Nuts", portion: "100g", cal: 580, p: 18, c: 20, f: 52 },
        { item: "Protein Bar / Mass Gainer", portion: "1 serving", cal: 400, p: 30, c: 50, f: 10 },
      ],
    },
  };

  const rawMeals = plans[goal] || plans['lean'];

  // Formatting logic to adapt the user's data structure to exactly what DietPlanner expects
  const mapMeals = (arr) => arr.map(m => ({
    name: m.item,
    grams: parseInt(m.portion), // naive extraction, UI relies mostly on `name` and `unit`
    unit: m.portion,
    macros: { cal: m.cal, protein: m.p, carbs: m.c, fat: m.f }
  }))

  const calculateTotal = (arr) => arr.reduce((acc, m) => ({
    cal: acc.cal + m.cal,
    protein: acc.protein + m.p,
    carbs: acc.carbs + m.c,
    fat: acc.fat + m.f
  }), { cal: 0, protein: 0, carbs: 0, fat: 0 })

  const formattedMeals = {
    breakfast: { items: mapMeals(rawMeals.breakfast), totalMacros: calculateTotal(rawMeals.breakfast) },
    lunch: { items: mapMeals(rawMeals.lunch), totalMacros: calculateTotal(rawMeals.lunch) },
    dinner: { items: mapMeals(rawMeals.dinner), totalMacros: calculateTotal(rawMeals.dinner) },
    snacks: { items: mapMeals(rawMeals.snacks), totalMacros: calculateTotal(rawMeals.snacks) },
  };

  const actualTotals = calculateTotal([...rawMeals.breakfast, ...rawMeals.lunch, ...rawMeals.dinner, ...rawMeals.snacks]);

  return {
    dailyTarget: { calories: dailyCalories, ...macros },
    dailyActual: actualTotals,
    meals: formattedMeals,
    generatedAt: new Date().toISOString()
  }
}

export function getMealTimings(activityLevel) {
  const timings = {
    sedentary:          { breakfast: '8:00 AM', lunch: '1:00 PM', snacks: '4:00 PM', dinner: '7:00 PM' },
    lightly_active:     { breakfast: '7:30 AM', lunch: '12:30 PM', snacks: '3:30 PM', dinner: '7:00 PM' },
    moderately_active:  { breakfast: '7:00 AM', lunch: '12:00 PM', snacks: '3:00 PM', dinner: '6:30 PM' },
    very_active:        { breakfast: '6:30 AM', lunch: '11:30 AM', snacks: '3:00 PM', dinner: '6:00 PM' },
    extremely_active:   { breakfast: '6:00 AM', lunch: '11:00 AM', snacks: '2:30 PM', dinner: '5:30 PM' },
  }
  return timings[activityLevel] || timings.moderately_active
}
