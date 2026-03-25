const HealthReport = require('../models/HealthReport');

const generateGymPlan = (data) => {
    const { bmi, sugarLevel, injuries } = data;
    let plan = {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    days.forEach((day, index) => {
        if (day === 'Sunday') {
            plan[day] = ['Rest Day', 'Light Stretching'];
            return;
        }

        let exercises = [];

        // Core logic based on BMI
        if (bmi > 25) {
            exercises.push('30 mins Cardio (Walking/Jogging)');
            exercises.push('High Repetition Strength Training');
        } else if (bmi < 18.5) {
            exercises.push('Heavy Weight Lifting (Compound movements)');
            exercises.push('Minimal Cardio');
        } else {
            exercises.push('Balanced Strength Training');
            exercises.push('15 mins HIIT');
        }

        // Health condition adjustments
        if (sugarLevel === 'High') {
            exercises = exercises.filter(e => !e.includes('HIIT'));
            exercises.push('Moderate Intensity Steady State Cardio');
        }

        // Injury adjustments
        if (injuries.includes('Knee')) {
            exercises = exercises.filter(e => !e.includes('Jogging'));
            exercises.push('Swimming or Cycling');
        }
        if (injuries.includes('Back')) {
            exercises.push('Plank (if comfortable)', 'Bird Dog Exercise');
            exercises = exercises.filter(e => !e.includes('Heavy Weight Lifting'));
        }

        plan[day] = exercises;
    });

    return plan;
};

const generateDietPlan = (data) => {
    const { bmi, sugarLevel, hemoglobin } = data;
    let plan = {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    days.forEach(day => {
        let meals = ['Breakfast: Oats & Fruits', 'Lunch: Rice, Dal, Veggies', 'Dinner: Grilled Chicken/Paneer & Salad'];

        if (bmi > 25) {
            meals[1] = 'Lunch: Salads, Lean Protein, Brown Rice (Small portion)';
            meals[2] = 'Dinner: Clear Soup & Steamed Veggies';
        }

        if (sugarLevel === 'High') {
            meals = meals.map(m => m + ' (No added sugar, use Stevia if needed)');
            meals.push('Snack: Handful of Walnuts/Almonds');
        }

        if (hemoglobin < 12) {
            meals.push('Add: Spinach, Beetroot Juice, Pomegranate');
        }

        plan[day] = meals;
    });

    return plan;
};

exports.submitReport = async (req, res) => {
    try {
        const { bmi, sugarLevel, hemoglobin, injuries } = req.body;

        const gymPlan = generateGymPlan({ bmi, sugarLevel, injuries });
        const dietPlan = generateDietPlan({ bmi, sugarLevel, hemoglobin });

        const report = await HealthReport.create({
            user: req.user._id,
            bmi,
            sugarLevel,
            hemoglobin,
            injuries,
            generatedPlan: {
                gym: gymPlan,
                diet: dietPlan,
            },
        });

        res.status(201).json({
            status: 'success',
            data: {
                report,
            },
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getReports = async (req, res) => {
    try {
        const reports = await HealthReport.find({ user: req.user._id }).sort('-createdAt');
        res.status(200).json({
            status: 'success',
            results: reports.length,
            data: {
                reports,
            },
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
