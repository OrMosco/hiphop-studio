import { useState } from 'react';
import { Avatar } from '../components/Avatar';
import { Btn } from '../components/Btn';
import { COLORS, MOCK_STUDENTS, MOCK_SESSIONS } from '../lib/constants';

function Stat({ label, value, accent, warn }) {
  return (
    <div style={{
      border: `1px solid ${COLORS.border}`,
      borderRadius: 14,
      padding: '18px 20px',
      background: accent ? 'rgba(232,255,0,0.06)' : COLORS.card,
    }}>
      <div style={{
        fontWeight: 900, fontSize: 34, lineHeight: 1,
        color: warn ? '#ff7a7a' : (accent ? COLORS.primary : COLORS.textPrimary),
      }}>{value}</div>
      <div style={{ color: '#888', fontSize: 13, marginTop: 6 }}>{label}</div>
    </div>
  );
}

export function Admin({ onBack }) {
  const [tab, setTab]           = useState('sessions');
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [present, setPresent]   = useState({}); // { [sessionId]: string[] of studentIds }
  const [openSession, setOpen]  = useState(MOCK_SESSIONS[0]?.id ?? null);

  const byId = (id) => students.find(s => s.id === id);

  const togglePresent = (sessionId, studentId) => {
    setPresent(prev => {
      const current  = prev[sessionId] ?? [];
      const isThere   = current.includes(studentId);
      const nextList  = isThere ? current.filter(id => id !== studentId) : [...current, studentId];

      setStudents(sts => sts.map(st =>
        st.id === studentId
          ? { ...st, credits: isThere ? st.credits + 1 : Math.max(0, st.credits - 1) }
          : st
      ));

      return { ...prev, [sessionId]: nextList };
    });
  };

  const addCredits = (studentId, n) =>
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, credits: Math.max(0, s.credits + n) } : s));

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: COLORS.bg, color: '#fff', fontFamily: "'Heebo', system-ui, sans-serif" }}>
      {/* נב ניהול */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 28px', borderBottom: `1px solid ${COLORS.border}`,
        position: 'sticky', top: 0, background: 'rgba(13,13,13,.9)', backdropFilter: 'blur(12px)', zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name="נטעלי" index={0} size={36} />
          <div>
            <div style={{ fontWeight: 900, fontSize: 17, lineHeight: 1.1 }}>שלום נטעלי 👋</div>
            <div style={{ color: '#888', fontSize: 12 }}>ניהול · היפ הופ נשים אפק</div>
          </div>
        </div>
        <button
          onClick={onBack}
          style={{
            width: 38, height: 38,
            background: '#1a1a1a', border: `1px solid ${COLORS.borderAlt}`,
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#888', fontSize: 15, flexShrink: 0,
          }}
          title="חזרה"
        >
          ←
        </button>
      </nav>

      {/* סטאטס */}
      <section style={{
        maxWidth: 1000, margin: '0 auto', padding: '28px 28px 0',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: 14,
      }}>
        <Stat label="תלמידות פעילות"      value={students.length} />
        <Stat label="רשומות לראשון הקרוב" value={MOCK_SESSIONS[0]?.registeredIds.length ?? 0} accent />
        <Stat label='סה"כ כניסות במאגר'   value={students.reduce((a, s) => a + s.credits, 0)} />
        <Stat label="נגמרו להן כניסות"    value={students.filter(s => s.credits === 0).length} warn />
      </section>

      {/* טאבים */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 28px 0', display: 'flex', gap: 8 }}>
        <Btn variant={tab === 'sessions' ? 'primary' : 'secondary'} size="sm" onClick={() => setTab('sessions')}>שיעורים והרשמות</Btn>
        <Btn variant={tab === 'students' ? 'primary' : 'secondary'} size="sm" onClick={() => setTab('students')}>כל התלמידות</Btn>
      </div>

      {/* שיעורים */}
      {tab === 'sessions' && (
        <section style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 28px 60px' }}>
          {MOCK_SESSIONS.map((sess) => {
            const open       = openSession === sess.id;
            const presentIds = present[sess.id] ?? [];
            return (
              <div key={sess.id} style={{
                border: open ? `1px solid rgba(232,255,0,0.3)` : `1px solid ${COLORS.border}`,
                borderRadius: 14, marginBottom: 14, overflow: 'hidden',
                background: open ? 'rgba(232,255,0,0.04)' : COLORS.card,
              }}>
                <div
                  onClick={() => setOpen(open ? null : sess.id)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', cursor: 'pointer', gap: 12 }}
                >
                  <div>
                    <div style={{ fontWeight: 900, fontSize: 18, color: COLORS.primary }}>{sess.label}</div>
                    <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>
                      {sess.registeredIds.length} רשומות · {presentIds.length} הגיעו
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                      {sess.registeredIds.slice(0, 4).map((id, i) => {
                        const st = byId(id);
                        return st ? (
                          <div key={id} style={{ marginInlineStart: i === 0 ? 0 : -8, border: `2px solid ${COLORS.card}`, borderRadius: '50%' }}>
                            <Avatar name={st.name} index={i} size={28} border={COLORS.card} />
                          </div>
                        ) : null;
                      })}
                      {sess.registeredIds.length > 4 && (
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%', background: '#1a1f27', color: '#9bd',
                          fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: `2px solid ${COLORS.card}`, marginInlineStart: -8,
                        }}>+{sess.registeredIds.length - 4}</div>
                      )}
                    </div>
                    <span style={{ color: '#666', fontSize: 18 }}>{open ? '▲' : '▼'}</span>
                  </div>
                </div>

                {open && (
                  <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: '8px 14px 18px' }}>
                    {sess.registeredIds.length === 0
                      ? <div style={{ color: '#666', fontSize: 14, padding: '16px 8px' }}>אף אחת עדיין לא נרשמה.</div>
                      : sess.registeredIds.map((id) => {
                          const st = byId(id);
                          if (!st) return null;
                          const isPresent = presentIds.includes(id);
                          return (
                            <div key={id} style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '12px 8px', borderBottom: `1px solid ${COLORS.border}`, gap: 10,
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Avatar name={st.name} index={Number(st.id)} />
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: 15 }}>{st.name}</div>
                                  <div style={{ color: '#777', fontSize: 12, direction: 'ltr', textAlign: 'right' }}>{st.phone}</div>
                                </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 12, color: st.credits === 0 ? '#ff7a7a' : '#888' }}>{st.credits} כניסות</span>
                                <Btn variant={isPresent ? 'primary' : 'outline'} size="sm" onClick={() => togglePresent(sess.id, id)}>
                                  {isPresent ? '✓ הגיעה' : 'סמני נוכחות'}
                                </Btn>
                              </div>
                            </div>
                          );
                        })
                    }
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* תלמידות */}
      {tab === 'students' && (
        <section style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 28px 60px' }}>
          <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 14, overflow: 'hidden' }}>
            {students.map((st, i) => (
              <div key={st.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px', gap: 10,
                borderBottom: i < students.length - 1 ? `1px solid ${COLORS.border}` : 'none',
                background: st.credits === 0 ? 'rgba(255,77,77,0.05)' : 'transparent',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <Avatar name={st.name} index={Number(st.id)} size={38} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{st.name}</div>
                    <div style={{ color: '#777', fontSize: 13, direction: 'ltr', textAlign: 'right' }}>{st.phone}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ textAlign: 'center', minWidth: 60 }}>
                    <div style={{ fontWeight: 900, fontSize: 24, color: st.credits === 0 ? '#ff7a7a' : '#fff' }}>{st.credits}</div>
                    <div style={{ fontSize: 11, color: '#777' }}>כניסות</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Btn variant="outline" size="sm" onClick={() => addCredits(st.id, -1)}>−</Btn>
                    <Btn variant="primary" size="sm" onClick={() => addCredits(st.id, 4)}>+ חבילה (4)</Btn>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ color: '#666', fontSize: 13, marginTop: 16, lineHeight: 1.6 }}>
            💡 כשתלמידה משלמת ב-PayBox, לחצי "+ חבילה" כדי להוסיף לה 4 כניסות. סימון "הגיעה" מוריד כניסה אוטומטית.
          </p>
        </section>
      )}
    </div>
  );
}
