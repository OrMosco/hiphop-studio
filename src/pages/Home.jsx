import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Btn }       from '../components/Btn';
import { AvatarStack } from '../components/Avatar';
import { COLORS, FIXED_CLASS, PRICES } from '../lib/constants';
import { fetchUpcomingSessions, sessionLabel, sessionTime } from '../lib/api';
import { useAuth } from '../lib/auth';

export function Home() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [nextSession, setNext] = useState(undefined); // undefined = loading, null = none

  useEffect(() => {
    // next session = first one that hasn't started yet
    fetchUpcomingSessions({ limit: 3 })
      .then(list => setNext(list.find(s => new Date(s.starts_at) > new Date()) ?? null))
      .catch(err => { console.error(err); setNext(null); });
  }, []);

  const participants = nextSession?.participants ?? [];
  const onEnter = () => navigate(user ? '/dashboard' : '/login');

  return (
    <div className="fade-up">

      {/* ── Nav ── */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 28px 24px' }}>
        {isAdmin ? <button
          onClick={() => navigate('/admin')}
          style={{ background:'none', border:'none', cursor:'pointer', color:'#333', fontSize:19, padding:4, lineHeight:1 }}
        >
          ⚙
        </button> : <span />}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:14, fontWeight:600, color:'#888', letterSpacing:'0.3px' }}>אפק</span>
          <div style={{ background:COLORS.primary, color:COLORS.bg, fontSize:12, fontWeight:900, padding:'5px 11px', borderRadius:7, letterSpacing:'0.8px' }}>
            HHS
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <div style={{ padding:'0 28px 36px' }}>
        <div style={{ fontSize:62, fontWeight:900, lineHeight:1.0, letterSpacing:'-1px', color:COLORS.textPrimary, textAlign:'right' }}>
          <span style={{ color:COLORS.primary }}>היפהופ</span><br />
          <span>לנשים</span><br />
          <span style={{ color:COLORS.secondary }}>קיבוץ אפק</span>
        </div>
        <div style={{ marginTop:16, fontSize:14, color:COLORS.textDim, textAlign:'right', lineHeight:1.7 }}>
          כל {FIXED_CLASS.day} בשעה {FIXED_CLASS.time} · {FIXED_CLASS.location}<br />
          <span style={{ color:COLORS.textMuted }}>עם {FIXED_CLASS.teacher}</span>
        </div>
      </div>

      {/* ── Upcoming class card ── */}
      <div style={{
        margin:'0 20px 28px',
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 22,
        padding: 22,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow spots */}
        <div style={{ position:'absolute', top:-30, left:-30, width:160, height:160, background:'radial-gradient(circle,rgba(232,255,0,0.07) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-20, right:-20, width:120, height:120, background:'radial-gradient(circle,rgba(255,77,128,0.06) 0%,transparent 70%)', pointerEvents:'none' }} />

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:COLORS.primary, animation:'pulse 2s infinite' }} />
            <span style={{ fontSize:11, fontWeight:700, color:COLORS.primary, letterSpacing:'0.5px' }}>בקרוב</span>
          </div>
          <span style={{ fontSize:12, fontWeight:700, color:'#888', background:'#1e1e1e', padding:'4px 12px', borderRadius:20, border:`1px solid ${COLORS.borderAlt}` }}>
            השיעור הקרוב
          </span>
        </div>

        {/* Date & time */}
        <div style={{ textAlign:'right', marginBottom:18 }}>
          <div style={{ fontSize:16, fontWeight:600, color:'#bbb', marginBottom:4 }}>{nextSession ? sessionLabel(nextSession.starts_at) : nextSession === null ? 'אין שיעור מתוכנן' : 'טוען…'}</div>
          <div style={{ fontSize:48, fontWeight:900, color:COLORS.primary, lineHeight:1, letterSpacing:'-1px' }}>{nextSession ? sessionTime(nextSession.starts_at) : FIXED_CLASS.time}</div>
        </div>

        {/* Location + avatars */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <AvatarStack students={participants} max={5} size={28} cardBg={COLORS.card} />
            <span style={{ fontSize:12, color:'#666', marginRight:4 }}>
              {participants.length > 5 ? `+${participants.length - 5}` : ''}
            </span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ fontSize:13, fontWeight:600, color:'#666' }}>{nextSession?.location ?? FIXED_CLASS.location}</span>
            <svg width="13" height="16" viewBox="0 0 13 16" fill="none">
              <path d="M6.5 0C3.46 0 1 2.46 1 5.5C1 9.63 6.5 16 6.5 16C6.5 16 12 9.63 12 5.5C12 2.46 9.54 0 6.5 0ZM6.5 7.5C5.4 7.5 4.5 6.6 4.5 5.5C4.5 4.4 5.4 3.5 6.5 3.5C7.6 3.5 8.5 4.4 8.5 5.5C8.5 6.6 7.6 7.5 6.5 7.5Z" fill="#666"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ── CTA Buttons ── */}
      <div style={{ padding:'0 20px', display:'flex', flexDirection:'column', gap:11 }}>
        <Btn variant="primary" size="lg" fullWidth onClick={onEnter}>
          {user ? 'לוח הבקרה שלי' : 'כניסת תלמידות'}
        </Btn>
        <Btn variant="secondary" size="md" fullWidth onClick={() => setShowDetails(d => !d)}>
          {showDetails ? 'סגור פרטים ↑' : 'פרטים על השיעור'}
        </Btn>
      </div>

      {/* ── Price card (toggled) ── */}
      {showDetails && (
        <div className="fade-up" style={{
          margin:'16px 20px 0',
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
          padding:'16px 20px',
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center',
        }}>
          <div style={{ textAlign:'left' }}>
            <div style={{ fontSize:22, fontWeight:900, color:COLORS.primary }}>₪{PRICES.pack4}</div>
            <div style={{ fontSize:11, color:'#555', marginTop:2 }}>חבילת 4 כניסות</div>
          </div>
          <div style={{ width:1, height:36, background:COLORS.border }} />
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:22, fontWeight:900, color:COLORS.textPrimary }}>₪{PRICES.single}</div>
            <div style={{ fontSize:11, color:'#555', marginTop:2 }}>כניסה בודדת</div>
          </div>
        </div>
      )}

      <div style={{ height:40 }} />
    </div>
  );
}
