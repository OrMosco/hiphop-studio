// lib/constants.js
// -----------------------------------------------------------
// כל הקבועים המרכזיים במקום אחד
// -----------------------------------------------------------

// PayBox — תחליפי ב-ID האמיתי של נטעלי
export const PAYBOX_LINK = 'https://link.payboxapp.com/pay/YOUR_ID'

// עיצוב
export const grad   = 'linear-gradient(95deg,#22D3EE,#3B82F6)'
export const BLUE   = '#3B82F6'
export const BLUE2  = '#22D3EE'
export const AV_COLORS = ['#3B82F6','#22D3EE','#6366F1','#0EA5E9','#8B5CF6','#14B8A6']

// השיעור הקבוע
export const FIXED_CLASS = {
  day:   'ראשון',
  time:  '20:00',
  coach: 'נטעלי',
  location: 'קיבוץ אפק',
}

// -----------------------------------------------------------
// נתוני דמה — ימחקו כשמחברים Supabase
// -----------------------------------------------------------
export const MOCK_STUDENT = {
  id: 99,
  name: 'נועה',
  phone: '050-1234567',
  credits: 3,
}

export const MOCK_UPCOMING = [
  { id: 'sun-1', date: '23.06', label: 'ראשון הקרוב', attendees: ['שיר','תמר','רוני','מאיה','ליה'] },
  { id: 'sun-2', date: '30.06', label: '',             attendees: ['דנה','יעל','תמר'] },
  { id: 'sun-3', date: '07.07', label: '',             attendees: ['רוני'] },
  { id: 'sun-4', date: '14.07', label: '',             attendees: [] },
]

export const MOCK_STUDENTS = [
  { id: 1, name: 'שיר לוי',   phone: '050-1112233', credits: 2 },
  { id: 2, name: 'תמר כהן',   phone: '052-4455667', credits: 4 },
  { id: 3, name: 'רוני אבני', phone: '054-7788990', credits: 0 },
  { id: 4, name: 'מאיה גל',   phone: '053-1239876', credits: 1 },
  { id: 5, name: 'ליה שדה',   phone: '058-6543210', credits: 3 },
  { id: 6, name: 'דנה פז',    phone: '050-9871234', credits: 2 },
  { id: 7, name: 'יעל מור',   phone: '052-3456789', credits: 4 },
]

export const MOCK_SESSIONS = [
  { id: 'sun-1', date: '23.06', label: 'ראשון הקרוב', registered: [1,2,4,5,6], present: [] },
  { id: 'sun-2', date: '30.06', label: '',             registered: [2,7,5],     present: [] },
  { id: 'sun-3', date: '07.07', label: '',             registered: [1],         present: [] },
  { id: 'sun-4', date: '14.07', label: '',             registered: [],          present: [] },
]
