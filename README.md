# היפ הופ נשים אפק — Studio App

אתר ניהול לסטודיו ריקוד היפ הופ לנשים בקיבוץ אפק.

## סטאטוס
**חזית בלבד — נתוני דמה.** הבאקאנד (Supabase) עדיין לא מחובר.

---

## מבנה הפרויקט

```
src/
├── lib/
│   ├── constants.js     ← PayBox link, צבעים, נתוני דמה, FIXED_CLASS
│   └── supabase.js      ← Supabase client (ריק עד חיבור)
├── components/
│   ├── Btn.jsx          ← כפתור עם 4 variants
│   ├── Avatar.jsx       ← Avatar + AvatarStack (עיגולי משתתפות)
│   └── Navbar.jsx       ← ניווט עליון
├── pages/
│   ├── Home.jsx         ← לנדינג: כותרת + כרטיס שיעור קרוב
│   ├── Login.jsx        ← כניסה עם טלפון בלבד (TODO: OTP)
│   ├── Dashboard.jsx    ← אזור תלמידה: כניסות + הרשמה לשיעורים
│   └── Admin.jsx        ← מסך נטעלי: נוכחות + ניהול כניסות
└── App.jsx              ← ניתוב בין המסכים
```

---

## שיעור קבוע
- **יום:** ראשון
- **שעה:** 20:00
- **מורה:** נטעלי
- **מיקום:** קיבוץ אפק

---

## מחירים
| חבילה | מחיר |
|-------|------|
| כניסה בודדת | ₪65 |
| חבילת 4 כניסות | ₪210 |

תשלום דרך **PayBox** בלבד (ללא Stripe). קישור PayBox מוגדר ב-`src/lib/constants.js`.

---

## זרימת שימוש

### תלמידה
1. מגיעה ללנדינג → רואה השיעור הקרוב (ראשון 20:00)
2. לוחצת "כניסת תלמידות" → מזינה טלפון → כניסה
3. רואה כמה כניסות נשארו + כפתור "טעינת כניסות ב-PayBox"
4. נרשמת לשיעורים הקרובים (כל הרשמה מורידה כניסה)
5. רואה מי עוד רשומה (עיגולי אווטאר)

### נטעלי (מנהלת)
1. נכנסת דרך האייקון ⚙ בתחתית האתר (נסתר)
2. רואה סיכום: תלמידות, רשומות לשיעור, כניסות שנגמרו
3. פותחת שיעור → מסמנת "הגיעה" → מורד כניסה אוטומטית
4. כשתלמידה משלמת ב-PayBox → לוחצת "+ חבילה (4)"

---

## TODO — שלבים הבאים לחבר ל-Claude Code

### 1. Supabase
```sql
-- טבלאות לבנות:
create table students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text unique not null,
  credits int default 0,
  created_at timestamptz default now()
);

create table sessions (
  id uuid primary key default gen_random_uuid(),
  date date not null,  -- תמיד יום ראשון
  created_at timestamptz default now()
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id),
  session_id uuid references sessions(id),
  present boolean default false,
  created_at timestamptz default now(),
  unique(student_id, session_id)
);
```

### 2. אימות
- Supabase Phone OTP (SMS) במקום ה-mock הנוכחי ב-Login.jsx
- תחליפי את `// TODO: החלף ב-Supabase OTP אמיתי` ב-Login.jsx

### 3. PayBox
- תחליפי `YOUR_ID` ב-`src/lib/constants.js` עם ה-ID של נטעלי ב-PayBox

### 4. Vercel Deploy
```bash
npm install -g vercel
vercel
```

### 5. וידאו (בעתיד)
- העלאה ל-YouTube (לא רשום/פרטי)
- הטמעה עם `<iframe>` בדף נפרד `/videos`

---

## הרצה מקומית
```bash
npm install
npm run dev
```

## Deploy
```bash
npm run build
vercel --prod
```
