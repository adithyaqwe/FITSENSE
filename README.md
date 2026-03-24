# FitSence - Fitness & Health Transformation Platform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A free [Supabase](https://supabase.com) account

### 1. Create Supabase Project
1. Go to https://supabase.com and create a new project
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Then run `supabase/policies.sql`
4. Go to **Project Settings → API** and copy your `Project URL` and `anon public` key

### 2. Setup Frontend
```bash
cd frontend
npm install
```

Create `.env` file in `/frontend`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run the App
```bash
npm run dev
```

---

## 📁 Project Structure

```
/FitSence
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Full page views
│   │   ├── context/          # Auth & App context
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Helper utilities
│   │   ├── algorithms/       # Core fitness algorithms
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── supabase/
│   ├── schema.sql            # Database tables
│   └── policies.sql          # Row Level Security
│
└── README.md
```

---

## 🔐 Authentication
- Email/Password via Supabase Auth
- Protected routes
- Session persistence
- Row Level Security on all tables

## 🧠 Algorithms (no external APIs)
- BMI Calculator
- TDEE / Calorie Calculator (Mifflin-St Jeor)
- Macro Splitter (protein/carbs/fat by goal)
- Meal Plan Generator (rule-based)
- Workout Generator (split by goal + level)
- Discipline Score Engine

## 📊 Features
- ✅ Health Profile with BMI
- ✅ Auto-generated Diet Plan
- ✅ Weekly Workout Program
- ✅ Daily Task Tracker
- ✅ Discipline Score (daily/weekly/monthly)
- ✅ Progress Dashboard with Charts
- ✅ Transformation Streak Tracker
