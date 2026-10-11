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

// Credits sold per pack (used for the credits card progress dots)
export const PACK_SIZE = 4;

// Stable palette index for a uuid / string id
export const colorIndex = (id = '') =>
  [...String(id)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 0);
