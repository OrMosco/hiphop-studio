// components/Btn.jsx
import { grad } from '../lib/constants'

const styles = (variant, full, disabled) => {
  const base = {
    fontFamily: 'inherit',
    fontWeight: 700,
    fontSize: 15,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    padding: '14px 28px',
    borderRadius: 3,
    transition: 'transform .12s ease, opacity .12s',
    width: full ? '100%' : 'auto',
    opacity: disabled ? 0.4 : 1,
  }
  const map = {
    solid: { ...base, background: grad, color: '#031018' },
    ghost: { ...base, background: 'transparent', color: '#fff', border: '1px solid #2a313b' },
    dark:  { ...base, background: '#15191f', color: '#fff' },
    green: { ...base, background: '#16331f', color: '#5BE584', border: '1px solid #1f5132' },
  }
  return map[variant] || map.solid
}

export default function Btn({ children, onClick, variant = 'solid', full, disabled, small }) {
  const s = styles(variant, full, disabled)
  if (small) { s.fontSize = 13; s.padding = '8px 14px' }
  return (
    <button
      style={s}
      onClick={disabled ? undefined : onClick}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.97)')}
      onMouseUp={(e)   => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {children}
    </button>
  )
}
