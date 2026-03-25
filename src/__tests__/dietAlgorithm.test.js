import { generateDietPlan, getMealTimings } from '../dietAlgorithm';

describe('Diet Plan Generation Algorithms', () => {
  test('generateDietPlan should return correctly structured plan', () => {
    const dailyCalories = 2500;
    const macros = { protein: 200, carbs: 300, fat: 80 };
    const goal = 'fat_loss';
    
    const plan = generateDietPlan(dailyCalories, macros, goal);
    
    expect(plan.dailyTarget.calories).toBe(dailyCalories);
    expect(plan.meals).toHaveProperty('breakfast');
    expect(plan.meals).toHaveProperty('lunch');
    expect(plan.meals).toHaveProperty('dinner');
    expect(plan.meals).toHaveProperty('snacks');
    
    expect(plan.meals.breakfast.items.length).toBeGreaterThan(0);
    expect(plan.dailyActual).toHaveProperty('cal');
  });

  test('generateDietPlan handles different goals correctly', () => {
    const dailyCalories = 2500;
    const macros = { protein: 180, carbs: 280, fat: 75 };
    
    const fatLossPlan = generateDietPlan(dailyCalories, macros, 'fat_loss');
    const bulkPlan = generateDietPlan(dailyCalories, macros, 'bulk');
    
    const fatLossItems = fatLossPlan.meals.breakfast.items.map(i => i.name.toLowerCase());
    const bulkItems = bulkPlan.meals.breakfast.items.map(i => i.name.toLowerCase());
    
    expect(fatLossItems).not.toEqual(bulkItems);
  });

  test('getMealTimings returns correct schedule for activity level', () => {
    const sedentary = getMealTimings('sedentary');
    const very_active = getMealTimings('very_active');
    
    expect(sedentary.breakfast).toBe('8:00 AM');
    expect(very_active.breakfast).toBe('6:30 AM');
  });
});
