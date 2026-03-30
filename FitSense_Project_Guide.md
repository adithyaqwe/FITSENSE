# FitSense: Team-Based Project Division & Viva Guide

## Overview
FitSense is a premium AI-powered fitness and diet management application built with **React**, **Supabase**, and **TensorFlow.js**. The project is divided into 4 key modules, each focusing on a specific aspect of user health and tracking.

---

## 🏗️ Module 1: Core Architecture, Auth & User Experience
**Assigned to: Member 1**

### 📂 Components & Files
- **App.jsx & AppLayout.jsx:** The "Skeleton" of the project. Manages routes and the glassmorphism layout (Sidebar, Header, Main Content).
- **AuthContext.jsx & supabase.js:** The "Security Guard." Manages user authentication (Login/Signup) and connects the frontend to the Supabase database.
- **Login.jsx & Signup.jsx:** The "Entry Point." Provides interactive forms for users to create/access accounts with error handling.
- **Sidebar.jsx:** The "Navigation Map." A dynamic, responsive menu with hover effects and glass-morphism styling.
- **ProfileSetup.jsx:** The "Onboarding Specialist." Collects initial data like weight, height, and goals to personalize the app experience.

### ❓ Viva Questions & Answers
1.  **Q: Why use Supabase for authentication instead of a custom Express backend?**
    *   **A:** Supabase provides built-in, secure authentication (JWT) and a real-time database, reducing development time and ensuring enterprise-grade security for user passwords and data.
2.  **Q: What is the purpose of `AuthContext`?**
    *   **A:** It provides a centralized global state using React Context API, making the user's authentication status (`user`, `session`) available to all protected components without "prop-drilling."
3.  **Q: Explain the "Glassmorphism" effect in your CSS.**
    *   **A:** It uses `backdrop-filter: blur()`, `rgba()` semi-transparent backgrounds, and thin borders (`border: 1px solid rgba(255,255,255,0.1)`) to create a frosted-glass look inspired by Apple’s design language.

---

## ⚡ Module 2: Fitness Intelligence & Workout Synthesis
**Assigned to: Member 2**

### 📂 Components & Files
- **FitnessTest.jsx:** The "Assessor." A 7-stage test (Pushups, Squats, etc.) that evaluates current fitness levels using video guides.
- **Transformation.jsx:** The "Coach." Generates a personalized workout plan based on the user's goal (Weight Loss, Muscle Gain, or Stamina).
- **workoutGenerator.js:** The "Brain." An algorithm that takes user fitness metrics and outputs specific sets, reps, and exercise routines.
- **fitnessCalculator.js:** The "Math Lab." Calculates complex health metrics like BMI, Body Fat %, and TDEE (Total Daily Energy Expenditure).
- **Progress.jsx:** The "Tracker." Visualizes weight trends and workout completion rates using **Recharts**.

### ❓ Viva Questions & Answers
1.  **Q: How does the Workout Generation algorithm work?**
    *   **A:** It uses a rule-based logic in `workoutGenerator.js` that maps fitness goals and intensity levels (Beginner to Advanced) to specific muscle-group rotations and volume (Sets/Reps).
2.  **Q: Why do you have a 7-stage Fitness Test?**
    *   **A:** To provide a baseline assessment. By testing endurance, strength, and stamina, the app can adapt the workout difficulty to prevent overtraining or injury.
3.  **Q: How is the Progress data stored?**
    *   **A:** Each workout entry is stored in a `fitness_logs` table in Supabase, which is then queried and mapped to the Recharts LineChart for visualization.

---

## 🥗 Module 3: Nutritional Engine & ML Insights
**Assigned to: Member 3**

### 📂 Components & Files
- **FoodTracker.jsx:** The "Nutritionist." Allows users to log daily food intake and calculates calories, protein, carbs, and fats.
- **DietPlanner.jsx:** The "Meal Designer." Generates meal plans according to the user's physical profile and caloric needs.
- **dietAlgorithm.js:** The "Chef." Calculates macro ratios (e.g., higher protein for muscle gain, lower carbs for weight loss).
- **MLInsights.jsx:** The "Analyst." Uses **TensorFlow.js** to identify patterns in the user's habits and provides predictive health alerts.
- **DailyTracker.jsx:** The "Dashboard Overview." Shows a daily summary of calories burned vs. calories consumed.

### ❓ Viva Questions & Answers
1.  **Q: What is the role of TensorFlow.js in the ML Insights module?**
    *   **A:** It runs a lightweight neural network in the browser to analyze logged data. It predicts how many days it will take to reach a goal or alerts users if their nutrition is inconsistent.
2.  **Q: How do you handle calorie calculation in `FoodTracker`?**
    *   **A:** The app integrates a database of foods. When a user logs an item, it multiplies the quantity by the calorie-per-unit value and updates the daily progress bar dynamically.
3.  **Q: Explain the Diet Algorithm logic.**
    *   **A:** It first calculates TDEE (Total Daily Energy Expenditure). Then, based on the goal (Bulking/Cutting), it applies a caloric surplus or deficit and splits the result into Macros (40/30/30 ratio typically).

---

## 🤖 Module 4: Financial Wellness & AI Recovery Butler
**Assigned to: Member 4**

### 📂 Components & Files
- **ExpenseTracker.jsx:** The "Accountant." Tracks spending on gym memberships, supplements, and food to correlate fitness spend with progress.
- **FatigueChatbot.jsx:** The "Mental Coach." An AI chatbot that asks about sleep, soreness, and fatigue to recommend rest or training adjustments.
- **AIBotAvatar.jsx:** The "Face of the App." A custom-designed SVG animation that moves, blinks, and reacts while the chatbot is typing.
- **disciplineScore.js:** The "Judge." Calculates a score (0-100) based on how consistently the user logs food, workouts, and sleep.
- **useData.js:** The "Data Bridge." A custom React Hook that fetches and caches data from Supabase to keep the UI fast.

### ❓ Viva Questions & Answers
1.  **Q: Why include an Expense Tracker in a fitness app?**
    *   **A:** Fitness is expensive. Correlation between health spending and actual results helps users understand their "Return on Investment" (ROI) for health goals.
2.  **Q: How does the Fatigue Chatbot help a user?**
    *   **A:** It uses a recovery algorithm to calculate a "Fatigue Level." If a user reports low sleep and high muscle soreness, the bot suggests a "Deload Week" or active recovery like yoga.
3.  **Q: Describe the logic behind the "Discipline Score."**
    *   **A:** It’s a weighted average. Logging a workout adds points, skipping a meal entry subtracts points, and sticking to the budget adds "Consistency" bonus points.
