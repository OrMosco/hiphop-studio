import { useState }   from 'react';
import { Btn }         from '../components/Btn';
import { AvatarStack } from '../components/Avatar';
import { StatusBar }   from '../components/StatusBar';
import {
  COLORS,
  FIXED_CLASS,
  PRICES,
  PAYBOX_URL,
  MOCK_SESSIONS,
  MOCK_STUDENTS,
  MOCK_CURRENT_STUDENT,
} from '../lib/constants';

function CreditsCard({ student }) {
  const total = 4; // credits per pack
  const used  = total - student.credits;

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
            background: i < used ? COLORS.border : COLORS.primary,
          }} />
        ))}
      </div>

      <Btn
        variant="primary"
        size="md"
        fullWidth
        onClick={() => window.open(PAYBOX_URL, '_blank')}
      >
        טעינת כניסות — ₪{PRICES.pack4} ל-4
      </Btn>
    </div>
  );
}

function SessionCard({ session, isBooked, onBook, currentStudentId }) {
  const participants = MOCK_STUDENTS.filter(s => session.registeredIds.includes(s.id));
  const alreadyIn    = session.registeredIds.includes(currentStudentId);

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
        {alreadyIn || isBooked ? (
          <div style={{
            display:'flex', alignItems:'center', gap:6,
            background:'rgba(134,239,172,0.1)',
            padding:'5px 12px', borderRadius:20,
            border:'1px solid rgba(134,239,172,0.2)',
          }}>
            <svg width="9" height="9" viewBox="0 0 9 9">
              <circle cx="4.5" cy="4.5" r="4.5" fill={COLORS.green}/>
            </svg>
            <span style={{ fontSize:11, fontWeight:700, color:COLORS.green }}>רשומה</span>
          </div>
        ) : (
          <Btn variant="outline" size="sm" onClick={onBook}>
            הרשמה <span style={{ fontSize:14, lineHeight:1 }}>+</span>
          </Btn>
        )}

        {/* Date & time */}
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:14, fontWeight:600, color:'#bbb' }}>{session.label}</div>
          <div style={{
            fontSize:26, fontWeight:900, lineHeight:1.1, letterSpacing:'-0.5px',
            color: alreadyIn || isBooked ? COLORS.primary : '#888',
          }}>
            {FIXED_CLASS.time}
          </div>
        </div>
      </div>

      {/* Participants row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:12, color:'#555' }}>{session.registeredIds.length} נרשמו</span>
        <AvatarStack students={participants} max={3} size={26} cardBg={COLORS.card} />
      </div>
    </div>
  );
}

export function Dashboard({ onBack }) {
  const student = MOCK_CURRENT_STUDENT;
  const [booked, setBooked] = useState({});

  const toggle = (id) => setBooked(b => ({ ...b, [id]: !b[id] }));

  return (
    <div className="fade-up">
      <StatusBar />

      {/* ── Nav ── */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 28px 22px' }}>
        {/* Avatar */}
        <div style={{
          width:38, height:38, borderRadius:'50%',
          background: COLORS.secondary,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:16, fontWeight:800, color:'#fff', flexShrink:0,
        }}>
          {student.name[0]}
        </div>

        <div style={{ fontSize:17, fontWeight:700, color:COLORS.textPrimary }}>לוח בקרה</div>

        {/* Back */}
        <button
          onClick={onBack}
          style={{
            width:38, height:38,
            background:'#1a1a1a', border:`1px solid ${COLORS.borderAlt}`,
            borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
            cursor:'pointer', color:'#888', fontSize:15, flexShrink:0,
          }}
          title="חזרה"
        >
          ←
        </button>
      </div>

      {/* ── Greeting ── */}
      <div style={{ padding:'0 28px 22px' }}>
        <div style={{ fontSize:28, fontWeight:800, color:COLORS.textPrimary, lineHeight:1.2 }}>
          שלום, {student.name}
        </div>
        <div style={{ fontSize:14, color:'#666', marginTop:6 }}>ברוכה הבאה לסטודיו</div>
      </div>

      {/* ── Credits ── */}
      <CreditsCard student={student} />

      {/* ── Upcoming classes ── */}
      <div style={{ padding:'0 28px 12px' }}>
        <div style={{ fontSize:18, fontWeight:800, color:COLORS.textPrimary, textAlign:'right' }}>
          שיעורים קרובים
        </div>
      </div>

      {MOCK_SESSIONS.map(s => (
        <SessionCard
          key={s.id}
          session={s}
          isBooked={!!booked[s.id]}
          onBook={() => toggle(s.id)}
          currentStudentId={student.id}
        />
      ))}

      <div style={{ height:44 }} />
    </div>
  );
}
