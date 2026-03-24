# FitSense - AI-Powered Fitness & Health Transformation Platform

> A full-stack fitness app with AI fatigue chatbot, workout plans, diet tracking, discipline scoring, and more — powered by React and Supabase.

---

## 🚀 Getting Started (Run Locally)

### Prerequisites
- [Node.js 18+](https://nodejs.org) installed
- A free [Supabase](https://supabase.com) account

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/adithyaqwe/FITSENSE.git
cd FITSENSE
```

---

### Step 2 — Set Up Supabase

1. Go to [https://supabase.com](https://supabase.com) and **create a new project**
2. In your project dashboard, open the **SQL Editor**
3. Copy and paste the contents of `schema.sql` → click **Run**
4. Then copy and paste the contents of `policies.sql` → click **Run**
5. Go to **Project Settings → API** and copy:
   - `Project URL`
   - `anon public` key

---

### Step 3 — Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then open `.env` and fill in your Supabase values:

```
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

### Step 4 — Install Dependencies & Run

```bash
npm install
npm start
```

The app will open at **http://localhost:3000** 🎉

---

## 📁 Project Structure

```
/FITSENSE
├── public/                   # Static assets
├── src/
│   ├── components/           # Reusable UI components
│   ├── pages/                # Full page views
│   ├── context/              # Auth & App context
│   ├── hooks/                # Custom React hooks
│   ├── utils/                # Helper utilities
│   └── App.jsx               # Root component
├── schema.sql                # Database tables (run in Supabase SQL Editor)
├── policies.sql              # Row Level Security policies
├── .env.example              # Environment variable template
└── package.json
```

---

## 🔐 Authentication

- Email/Password sign-up & login via Supabase Auth
- Protected routes (redirects unauthenticated users)
- Persistent sessions
- Row Level Security (RLS) on all database tables

---

## 🧠 Core Algorithms (No External APIs)

| Algorithm | Description |
|---|---|
| BMI Calculator | Body Mass Index from height/weight |
| TDEE Calculator | Total Daily Energy Expenditure (Mifflin-St Jeor) |
| Macro Splitter | Protein/Carbs/Fat ratios by goal |
| Meal Plan Generator | Rule-based diet plan |
| Workout Generator | Split by goal + fitness level |
| Discipline Score Engine | Daily/Weekly/Monthly scoring |

---

## 📊 Features

- ✅ Health Profile with BMI Analysis
- ✅ Auto-generated Personalized Diet Plan
- ✅ Weekly Workout Program
- ✅ Daily Task Tracker
- ✅ Discipline Score (daily/weekly/monthly)
- ✅ Progress Dashboard with Charts
- ✅ Transformation Streak Tracker
- ✅ AI Fatigue Chatbot

---

## 🛠️ Tech Stack

- **Frontend:** React 18, React Router, Recharts, Framer Motion
- **Backend/DB:** Supabase (PostgreSQL + Auth + Realtime)
- **Styling:** Tailwind CSS

---

## ❓ Troubleshooting

**App shows blank page / auth errors?**
→ Make sure your `.env` file has the correct Supabase URL and anon key.

**Database errors?**
→ Make sure you ran both `schema.sql` AND `policies.sql` in the Supabase SQL Editor.

**`npm install` fails?**
→ Make sure you're using Node.js 18 or higher. Run `node -v` to check.
