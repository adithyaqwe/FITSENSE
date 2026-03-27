import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const s = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await s.from('progress_tracking').insert([{
    user_id: '12345678-1234-1234-1234-123456789012', 
    log_date: '2026-03-26', 
    weight_kg: 80,
    body_fat_pct: 12,
    notes: 'test'
  }]);
  console.log('INSERT RESULT:', data, 'ERROR:', error);
}

test();
