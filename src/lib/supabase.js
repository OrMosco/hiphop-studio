// lib/supabase.js
// -----------------------------------------------------------
// כשמחברים Supabase אמיתי:
// 1. צרי קובץ .env.local בשורש הפרויקט
// 2. הוסיפי:
//    VITE_SUPABASE_URL=https://xxxx.supabase.co
//    VITE_SUPABASE_ANON_KEY=your-anon-key
// -----------------------------------------------------------

import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  || ''
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl
  ? createClient(supabaseUrl, supabaseKey)
  : null   // null כשאין עדיין חיבור — האפליקציה עובדת עם נתוני דמה
