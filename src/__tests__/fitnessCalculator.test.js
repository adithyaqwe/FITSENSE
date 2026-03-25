import { calculateBMI, calculateTDEE, calculateMacros } from '../fitnessCalculator';

describe('Fitness Calculator Algorithms', () => {
  test('calculateBMI should return correct value and category', () => {
    // Normal weight
    const normal = calculateBMI(70, 175);
    expect(normal.bmi).toBe(22.9);
    expect(normal.category).toBe('Normal Weight');
    
    // Overweight
    const overweight = calculateBMI(85, 175);
    expect(overweight.bmi).toBe(27.8);
    expect(overweight.category).toBe('Overweight');
    
    // Obese
    const obese = calculateBMI(100, 175);
    expect(obese.bmi).toBe(32.7);
    expect(obese.category).toBe('Obese');
    
    // Underweight
    const underweight = calculateBMI(50, 175);
    expect(underweight.bmi).toBe(16.3);
    expect(underweight.category).toBe('Underweight');
  });

  test('calculateTDEE should handle different activity levels', () => {
    // Male, 25yr, 75kg, 180cm
    const weighKg = 75;
    const heightCm = 180;
    const age = 25;
    const gender = 'male';
    
    const sedentary = calculateTDEE(weighKg, heightCm, age, gender, 'sedentary');
    const very_active = calculateTDEE(weighKg, heightCm, age, gender, 'very_active');
    
    expect(very_active).toBeGreaterThan(sedentary);
  });

  test('calculateMacros should adjust calories based on goal', () => {
    const tdee = 2500;
    
    const fatLoss = calculateMacros(tdee, 'fat_loss');
    expect(fatLoss.calories).toBe(2000);
    
    const muscleGain = calculateMacros(tdee, 'muscle_gain');
    expect(muscleGain.calories).toBe(2800);
    
    const maintenance = calculateMacros(tdee, 'maintenance');
    expect(maintenance.calories).toBe(2500);
  });
});
