import { COLORS } from '../lib/constants';

const VARIANTS = {
  primary: {
    background: COLORS.primary,
    color: COLORS.bg,
    border: 'none',
  },
  secondary: {
    background: 'transparent',
    color: COLORS.textMuted,
    border: `1.5px solid ${COLORS.border}`,
  },
  outline: {
    background: `rgba(232,255,0,0.08)`,
    color: COLORS.primary,
    border: `1px solid rgba(232,255,0,0.25)`,
  },
  ghost: {
    background: 'none',
    color: COLORS.textMuted,
    border: 'none',
  },
};

const SIZES = {
  sm: { fontSize: 11, padding: '5px 12px', borderRadius: 20 },
  md: { fontSize: 15, padding: '15px 24px', borderRadius: 15 },
  lg: { fontSize: 17, padding: '17px 24px', borderRadius: 15 },
};

/**
 * @param {'primary'|'secondary'|'outline'|'ghost'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} fullWidth
 */
export function Btn({ variant = 'primary', size = 'md', fullWidth = false, children, style, ...props }) {
  const v = VARIANTS[variant] ?? VARIANTS.primary;
  const s = SIZES[size] ?? SIZES.md;

  return (
    <button
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        width: fullWidth ? '100%' : undefined,
        fontWeight: 700,
        letterSpacing: '0.2px',
        transition: 'opacity 0.15s',
        ...v,
        ...s,
        ...style,
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      {...props}
    >
      {children}
    </button>
  );
}
