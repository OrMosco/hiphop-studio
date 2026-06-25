// ─── Design Tokens ────────────────────────────────────────────────────────────
export const COLORS = {
  bg:        '#0d0d0d',
  card:      '#141414',
  cardHover: '#1a1a1a',
  elevated:  '#1e1e1e',
  border:    '#242424',
  borderAlt: '#2a2a2a',
  primary:   '#e8ff00',   // yellow-green accent
  secondary: '#ff4d80',   // pink accent
  green:     '#86efac',
  blue:      '#7dd3fc',
  yellow:    '#fbbf24',
  purple:    '#c084fc',
  textPrimary: '#f5f5f5',
  textMuted:   '#888888',
  textDim:     '#666666',
  textFaint:   '#555555',
};

// ─── PayBox ───────────────────────────────────────────────────────────────────
export const PAYBOX_URL = 'https://payboxapp.page.link/YOUR_ID'; // החלף ב-ID של נטעלי

// ─── Fixed class ─────────────────────────────────────────────────────────────
export const FIXED_CLASS = {
  day:      'ראשון',
  time:     '20:00',
  teacher:  'נטעלי',
  location: 'קיבוץ אפק',
};

// ─── Pricing ─────────────────────────────────────────────────────────────────
export const PRICES = {
  single: 65,
  pack4:  210,
};

// ─── Avatar palette (cycles by index) ────────────────────────────────────────
export const AVATAR_COLORS = [
  { bg: COLORS.secondary, text: '#fff'    },
  { bg: COLORS.primary,   text: '#0d0d0d' },
  { bg: COLORS.blue,      text: '#0d0d0d' },
  { bg: COLORS.green,     text: '#0d0d0d' },
  { bg: COLORS.yellow,    text: '#0d0d0d' },
  { bg: COLORS.purple,    text: '#fff'    },
];

// ─── Mock data (replace with Supabase queries) ────────────────────────────────
export const MOCK_STUDENTS = [
  { id: '1', name: 'נועה',   phone: '050-0000001', credits: 3 },
  { id: '2', name: 'מיה',    phone: '050-0000002', credits: 4 },
  { id: '3', name: 'שירה',   phone: '050-0000003', credits: 1 },
  { id: '4', name: 'רוני',   phone: '050-0000004', credits: 2 },
  { id: '5', name: 'דנה',    phone: '050-0000005', credits: 4 },
  { id: '6', name: 'תמר',    phone: '050-0000006', credits: 0 },
];

export const MOCK_SESSIONS = [
  { id: 's1', date: '2025-06-29', label: 'ראשון, 29 ביוני', registeredIds: ['1','2','3','4','5','6','7','8'] },
  { id: 's2', date: '2025-07-06', label: 'ראשון, 6 ביולי',  registeredIds: ['2','4','5','6','7'] },
  { id: 's3', date: '2025-07-13', label: 'ראשון, 13 ביולי', registeredIds: ['3','6','7'] },
];

// Current logged-in student (mock — replace with Supabase auth)
export const MOCK_CURRENT_STUDENT = MOCK_STUDENTS[0];
