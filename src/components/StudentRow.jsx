import { Avatar } from './Avatar';
import { Btn } from './Btn';
import { COLORS, PACK_SIZE, colorIndex } from '../lib/constants';

// One student row in /admin → "כל התלמידות". Wraps on narrow screens:
// name/email on the first line, credits + buttons on the next.
export function StudentRow({ student: st, name, last, busy, onAdjust }) {
  const btn = { padding: '6px 10px', fontSize: 12, whiteSpace: 'nowrap' };
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px clamp(12px, 4vw, 20px)', columnGap: 12, rowGap: 10,
      borderBottom: last ? 'none' : `1px solid ${COLORS.border}`,
      background: st.credits === 0 ? 'rgba(255,77,77,0.05)' : 'transparent',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 200px', minWidth: 0 }}>
        <Avatar name={name} index={colorIndex(st.id)} size={36} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
          <div style={{ color: '#777', fontSize: 12, direction: 'ltr', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {st.phone || st.email}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '0 1 auto', marginInlineStart: 'auto', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <div style={{ textAlign: 'center', minWidth: 44 }}>
          <div style={{ fontWeight: 900, fontSize: 22, lineHeight: 1.1, color: st.credits === 0 ? '#ff7a7a' : '#fff' }}>{st.credits}</div>
          <div style={{ fontSize: 10, color: '#777' }}>כניסות</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Btn variant="outline" size="sm" style={btn} disabled={busy || st.credits === 0} onClick={() => onAdjust(-1)}>−</Btn>
          <Btn variant="outline" size="sm" style={btn} disabled={busy} onClick={() => onAdjust(1)}>+1</Btn>
          <Btn variant="primary" size="sm" style={btn} disabled={busy} onClick={() => onAdjust(PACK_SIZE)}>+ חבילה ({PACK_SIZE})</Btn>
        </div>
      </div>
    </div>
  );
}
