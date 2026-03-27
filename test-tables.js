import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const s = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function check() {
  const tables = ['health_metrics', 'diet_plans', 'workout_plans', 'daily_tasks', 'progress_tracking', 'workout_streaks'];
  
  for (const table of tables) {
    const { error } = await s.from(table).select('id').limit(1);
    console.log(`${table}: ${error ? 'MISSING (' + error.code + ')' : 'OK'}`);
  }
}

check();
