# Handoff: Hip-Hop Studio — UI Redesign

## Overview
עיצוב מחדש של ממשק הסטודיו לריקוד היפהופ לנשים בקיבוץ אפק.  
שני מסכים ראשיים: **דף הבית** ו**לוח הבקרה לתלמידות**.

---

## About the Design Files
הקבצים בתיקייה זו הם **קומפוננטות React מוכנות** המשקפות את העיצוב המלא.  
המשימה: להחליף את קבצי `src/` הקיימים בפרויקט `hiphop-studio` בקבצים אלה.

---

## Fidelity
**High-fidelity** — עיצוב פיקסל-פרפקט עם צבעים, טיפוגרפיה ומרווחים סופיים.  
יש לשחזר את ממשק המשתמש בדיוק לפי הקוד המצורף.

---

## Design Tokens

| Token         | Value     | Usage                        |
|---------------|-----------|------------------------------|
| `bg`          | `#0d0d0d` | רקע ראשי                    |
| `card`        | `#141414` | רקע כרטיסים                 |
| `elevated`    | `#1e1e1e` | כרטיסים מורמים               |
| `border`      | `#242424` | גבולות                      |
| `primary`     | `#e8ff00` | צהוב-ירוק — אקסנט ראשי      |
| `secondary`   | `#ff4d80` | ורוד — אקסנט שני            |
| `textPrimary` | `#f5f5f5` | טקסט ראשי                   |
| `textMuted`   | `#888888` | טקסט משני                   |
| `green`       | `#86efac` | אישור / "רשומה"             |
| Font          | **Rubik** (Google Fonts) — weights 400–900 |

---

## Screens

### 1. Home (`src/pages/Home.jsx`)
**מטרה:** לנדינג — מציג את השיעור הקרוב וכניסה לתלמידות.

**Layout (RTL):**
- `StatusBar` — סרגל סטטוס מוק (9:41, אייקוני סיגנל/סוללה)
- **Nav** — `justify-content: space-between` | שמאל: כפתור ⚙ (נסתר לאדמין) | ימין: שם + תג HHS
- **Hero** — `font-size: 62px`, `font-weight: 900`, 3 שורות:
  - "היפהופ" בצבע `primary` (#e8ff00)
  - "לנשים" בלבן
  - "קיבוץ אפק" בצבע `secondary` (#ff4d80)
- **Class card** — `background: #141414`, `border-radius: 22px`, כולל:
  - נקודת פולס מונפשת + תווית "בקרוב"
  - תאריך ושעה גדולה (48px)
  - `AvatarStack` עם משתתפות + מיקום
- **כפתורים** — primary "כניסת תלמידות" + secondary "פרטים על השיעור"
- **Price card** — מוסתר כברירת מחדל, מתגלה בלחיצה על "פרטים":
  - ₪210 / 4 כניסות | ₪65 כניסה בודדת

### 2. Dashboard (`src/pages/Dashboard.jsx`)
**מטרה:** אזור תלמידה — כניסות + הרשמה לשיעורים.

**Layout (RTL):**
- `StatusBar`
- **Nav** — אווטאר ורוד + "לוח בקרה" + כפתור חזרה עגול
- **Greeting** — "שלום, [שם]" `font-size: 28px, font-weight: 800`
- **Credits card** — `border: 1px solid rgba(232,255,0,0.18)` עם glow רדיאלי:
  - מספר גדול 80px בצבע primary
  - נקודות progress (מלאות = primary, ריקות = #242424)
  - כפתור "טעינת כניסות" פותח PayBox
- **Session cards** (3) — כל כרטיס:
  - תאריך + שעה
  - פיל "רשומה" (ירוק) או כפתור "הרשמה +" (outline)
  - `AvatarStack` עם 3 אווטאר + overflow count

---

## Interactions & Behavior

| Action | Result |
|--------|--------|
| לחיצה "כניסת תלמידות" | ניווט ל-Dashboard |
| לחיצה "פרטים על השיעור" | toggle כרטיס מחירים (fadeUp animation) |
| לחיצה "הרשמה +" | מחליף לפיל "רשומה" (state local) |
| לחיצה "טעינת כניסות" | `window.open(PAYBOX_URL, '_blank')` |
| לחיצה ← (חזרה) | חזרה ל-Home |
| לחיצה ⚙ (נסתר) | ניווט לאדמין (TODO) |

**Animations:**
- `fadeUp`: `opacity 0→1`, `translateY 18px→0`, `0.35s ease`
- `pulse`: נקודת "בקרוב" — `opacity 1→0.5→1`, `2s infinite`

---

## Files to Replace / Add

```
src/
├── App.jsx                          ← החלף
├── index.css                        ← החלף
├── lib/
│   └── constants.js                 ← החלף
├── components/
│   ├── Avatar.jsx                   ← החלף
│   ├── Btn.jsx                      ← החלף
│   └── StatusBar.jsx                ← חדש — הוסף
└── pages/
    ├── Home.jsx                     ← החלף
    └── Dashboard.jsx                ← החלף
```

> קבצים שלא נגענו בהם: `Login.jsx`, `Admin.jsx`, `Navbar.jsx`, `supabase.js`

---

## Next Steps (TODO)

1. **PayBox** — החלף `YOUR_ID` ב-`src/lib/constants.js` עם ה-ID של נטעלי
2. **Supabase** — חבר את `supabase.js` והחלף את `MOCK_*` בקריאות אמיתיות
3. **OTP Login** — עדכן `Login.jsx` עם Supabase Phone Auth
4. **Admin screen** — חבר את כפתור ⚙ ל-`Admin.jsx`
5. **Deploy** — `npm run build && vercel --prod`

---

## Backend setup (Supabase + Google sign-in)
1. `cp .env.example .env.local` and fill in `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.
2. Run `supabase/migrations/0001_init.sql` (SQL editor or `supabase db push`), then optionally `supabase/seed.sql`.
3. Enable the Google provider in Supabase Auth and add redirect URLs (`http://localhost:5173/**`, production URL).
4. Make an admin: `update public.profiles set is_admin = true where email = '...';`
