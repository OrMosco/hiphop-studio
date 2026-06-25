// components/Avatar.jsx
import { AV_COLORS } from '../lib/constants'

export function Avatar({ name, colorIndex = 0, size = 32 }) {
  return (
    <div
      title={name}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: AV_COLORS[colorIndex % AV_COLORS.length],
        color: '#fff', fontWeight: 700, fontSize: size * 0.42,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {name[0]}
    </div>
  )
}

export function AvatarStack({ names }) {
  if (!names.length) {
    return <div style={{ color: '#555', fontSize: 13 }}>אף אחת עדיין לא נרשמה — תהיי הראשונה ✨</div>
  }
  const shown = names.slice(0, 5)
  const extra = names.length - shown.length
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
        {shown.map((n, i) => (
          <div key={i} style={{ marginInlineStart: i === 0 ? 0 : -10, border: '2px solid #0d0f13', borderRadius: '50%' }}>
            <Avatar name={n} colorIndex={i} />
          </div>
        ))}
        {extra > 0 && (
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: '#1a1f27', color: '#9bd',
            fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #0d0f13', marginInlineStart: -10,
          }}>+{extra}</div>
        )}
      </div>
      <span style={{ color: '#888', fontSize: 13, marginInlineStart: 10 }}>{names.length} רשומות</span>
    </div>
  )
}
