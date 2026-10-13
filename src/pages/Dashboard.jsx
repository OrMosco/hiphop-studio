import { useCallback, useEffect, useState } from 'react';
import { Btn }         from '../components/Btn';
import { AvatarStack } from '../components/Avatar';
import { BackButton }  from '../components/BackButton';
import { COLORS, PRICES, PAYMENT_LINKS, PACK_SIZE } from '../lib/constants';
import { fetchUpcomingSessions, register, unregister, sessionLabel, sessionTime, isPast } from '../lib/api';
import { useAuth } from '../lib/auth';

function CreditsCard({ student }) {
  // Dots show progress through the current pack; a balance above one pack shows all dots full.
  const credits = Math.max(0, student.credits ?? 0);
  const total   = Math.max(PACK_SIZE, credits);
  const filled  = credits;
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div style={{
      margin:'0 20px 22px',
      background: COLORS.card,
      border: '1px solid rgba(232,255,0,0.18)',
      borderRadius: 22,
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 20% 0%,rgba(232,255,0,0.06) 0%,transparent 60%)', pointerEvents:'none' }} />

      <div style={{ fontSize:11, fontWeight:700, color:'#666', letterSpacing:'1px', textAlign:'right', marginBottom:14 }}>
        כניסות שנותרו
      </div>

      {/* Big number */}
      <div style={{ display:'flex', alignItems:'flex-end', gap:6, justifyContent:'flex-end', marginBottom:18 }}>
        <span style={{ fontSize:15, fontWeight:500, color:'#555', paddingBottom:8 }}>/ {total}</span>
        <span style={{ fontSize:80, fontWeight:900, color:COLORS.primary, lineHeight:1, letterSpacing:'-3px' }}>
          {student.credits}
        </span>
      </div>

      {/* Progress dots */}
      <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginBottom:22 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            width: 11, height: 11, borderRadius: '50%',
            background: i < total - filled ? COLORS.border : COLORS.primary,
          }} />
        ))}
      </div>

      {!showOptions ? (
        <Btn
          variant="primary"
          size="md"
          fullWidth
          onClick={() => setShowOptions(true)}
        >
          טעינת כניסות
        </Btn>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {[
            { key: 'pack4',  label: `כרטיסיית ${PACK_SIZE} כניסות`, variant: 'primary' },
            { key: 'single', label: 'כניסה בודדת',                 variant: 'outline' },
          ].map(({ key, label, variant }) => {
            const url = PAYMENT_LINKS[key];
            return (
              <Btn
                key={key}
                variant={variant}
                size="md"
                fullWidth
                disabled={!url}
                style={url ? undefined : { opacity: 0.45, cursor: 'not-allowed' }}
                onClick={() => url && window.open(url, '_blank', 'noopener,noreferrer')}
              >
                {label} — ₪{PRICES[key]}{url ? '' : ' (בקרוב)'}
              </Btn>
            );
          })}
          <div style={{ fontSize:12, color:COLORS.textMuted, textAlign:'center', lineHeight:1.5 }}>
            אחרי התשלום בביט, נטעלי מוסיפה את הכניסות ידנית — האישור תוך זמן קצר.
          </div>
          <Btn
            variant="ghost"
            size="sm"
            fullWidth
            onClick={() => setShowOptions(false)}
          >
            ביטול
          </Btn>
        </div>
      )}
    </div>
  );
}

function SessionCard({ session, isRegistered, onToggle, busy }) {
  const participants = session.participants;
  const locked = isPast(session.starts_at) || busy;

  return (
    <div style={{
      margin:'0 20px 12px',
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 18,
      padding: 18,
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>

        {/* Status pill / register button */}
        {isRegistered ? (
          <button
            onClick={locked ? undefined : onToggle}
            disabled={locked}
            title="לביטול ההרשמה"
            style={{
              display:'flex', alignItems:'center', gap:6,
              background:'rgba(134,239,172,0.1)',
              padding:'5px 12px', borderRadius:20,
              border:'1px solid rgba(134,239,172,0.2)',
              cursor:'pointer',
            }}
          >
            <svg width="9" height="9" viewBox="0 0 9 9">
              <circle cx="4.5" cy="4.5" r="4.5" fill={COLORS.green}/>
            </svg>
            <span style={{ fontSize:11, fontWeight:700, color:COLORS.green }}>רשומה</span>
          </button>
        ) : (
          <Btn variant="outline" size="sm" onClick={onToggle} disabled={locked}>
            הרשמה <span style={{ fontSize:14, lineHeight:1 }}>+</span>
          </Btn>
        )}

        {/* Date & time */}
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:14, fontWeight:600, color:'#bbb' }}>{sessionLabel(session.starts_at)}</div>
          <div style={{
            fontSize:26, fontWeight:900, lineHeight:1.1, letterSpacing:'-0.5px',
            color: isRegistered ? COLORS.primary : '#888',
          }}>
            {sessionTime(session.starts_at)}
          </div>
        </div>
      </div>

      {/* Participants row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:12, color:'#555' }}>{participants.length} נרשמו</span>
        <AvatarStack students={participants} max={3} size={26} cardBg={COLORS.card} />
      </div>
    </div>
  );
}

export function Dashboard() {
  const { user, profile: student, signOut } = useAuth();
  const [sessions, setSessions] = useState(null);
  const [busyId, setBusyId]     = useState(null);
  const [error, setError]       = useState(null);

  const load = useCallback(() =>
    fetchUpcomingSessions({ limit: 6 })
      .then(setSessions)
      .catch(e => setError(e.message)), []);
  useEffect(() => { load(); }, [load]);

  const toggle = async (session, isRegistered) => {
    setBusyId(session.id); setError(null);
    try {
      await (isRegistered ? unregister : register)(session.id, user.id);
      await load();
    } catch (e) { setError(e.message); }
    finally { setBusyId(null); }
  };

  const name = student.full_name || 'תלמידה';

  return (
    <div className="fade-up">
      {/* ── Nav ── */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 28px 22px' }}>
        {/* Avatar */}
        <div style={{
          width:38, height:38, borderRadius:'50%',
          background: COLORS.secondary,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:16, fontWeight:800, color:'#fff', flexShrink:0,
        }}>
          {name[0]}
        </div>

        <div style={{ fontSize:17, fontWeight:700, color:COLORS.textPrimary }}>לוח בקרה</div>

        <BackButton to="/" />
      </div>

      {/* ── Greeting ── */}
      <div style={{ padding:'0 28px 22px' }}>
        <div style={{ fontSize:28, fontWeight:800, color:COLORS.textPrimary, lineHeight:1.2 }}>
          שלום, {name}
        </div>
        <div style={{ fontSize:14, color:'#666', marginTop:6 }}>
          ברוכה הבאה לסטודיו ·{' '}
          <button onClick={signOut} style={{ background:'none', border:'none', color:'#888', textDecoration:'underline', cursor:'pointer', padding:0, fontSize:14 }}>התנתקות</button>
        </div>
      </div>

      {/* ── Credits ── */}
      <CreditsCard student={student} />

      {/* ── Upcoming classes ── */}
      <div style={{ padding:'0 28px 12px' }}>
        <div style={{ fontSize:18, fontWeight:800, color:COLORS.textPrimary, textAlign:'right' }}>
          שיעורים קרובים
        </div>
      </div>

      {error && <div style={{ margin:'0 28px 12px', color:'#ff7a7a', fontSize:13, textAlign:'right' }}>{error}</div>}
      {sessions === null && <div style={{ margin:'0 28px', color:'#666', textAlign:'right' }}>טוען…</div>}
      {sessions?.length === 0 && <div style={{ margin:'0 28px', color:'#666', textAlign:'right' }}>אין שיעורים מתוכננים כרגע.</div>}
      {sessions?.map(s => {
        const isRegistered = s.participants.some(p => p.id === user.id);
        return (
          <SessionCard
            key={s.id}
            session={s}
            isRegistered={isRegistered}
            busy={busyId === s.id}
            onToggle={() => toggle(s, isRegistered)}
          />
        );
      })}

      <div style={{ height:44 }} />
    </div>
  );
}
