import { useCallback, useEffect, useState } from 'react';
import { Avatar } from '../components/Avatar';
import { Btn } from '../components/Btn';
import { BackButton } from '../components/BackButton';
import { COLORS, PACK_SIZE, colorIndex } from '../lib/constants';
import { fetchAdminSessions, fetchStudents, adjustCredits, setAttendance, sessionLabel, sessionTime } from '../lib/api';
import { useAuth } from '../lib/auth';

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

export function Admin() {
  const { profile, refreshProfile } = useAuth();
  const [tab, setTab]           = useState('sessions');
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [openSession, setOpen]  = useState(null);
  const [busy, setBusy]         = useState(null);
  const [error, setError]       = useState(null);

  const load = useCallback(async () => {
    try {
      const [st, ss] = await Promise.all([fetchStudents(), fetchAdminSessions()]);
      setStudents(st); setSessions(ss);
      setOpen(o => o ?? (ss.find(x => new Date(x.starts_at) > new Date()) ?? ss[ss.length - 1])?.id ?? null);
    } catch (e) { setError(e.message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const byId = (id) => students.find(s => s.id === id);
  const name = (st) => st?.full_name || st?.email || '?';

  const run = async (key, fn) => {
    setBusy(key); setError(null);
    try { await fn(); await load(); if (key.includes(profile.id)) refreshProfile(); }
    catch (e) { setError(e.message); }
    finally { setBusy(null); }
  };
  const togglePresent = (sessionId, studentId, isPresent) =>
    run(`att:${sessionId}:${studentId}`, () => setAttendance(sessionId, studentId, !isPresent));
  const addCredits = (studentId, n) =>
    run(`cr:${studentId}`, () => adjustCredits(studentId, n, n > 0 ? 'purchase' : 'adjustment'));

  const nextSession = sessions.find(x => new Date(x.starts_at) > new Date());

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: COLORS.bg, color: '#fff', fontFamily: "'Heebo', system-ui, sans-serif" }}>
      {/* נב ניהול */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 28px', borderBottom: `1px solid ${COLORS.border}`,
        position: 'sticky', top: 0, background: 'rgba(13,13,13,.9)', backdropFilter: 'blur(12px)', zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name={name(profile)} index={0} size={36} />
          <div>
            <div style={{ fontWeight: 900, fontSize: 17, lineHeight: 1.1 }}>שלום {name(profile).split(' ')[0]} 👋</div>
            <div style={{ color: '#888', fontSize: 12 }}>ניהול · היפ הופ נשים אפק</div>
          </div>
        </div>
        <BackButton to="/" />
      </nav>

      {/* סטאטס */}
      <section style={{
        maxWidth: 1000, margin: '0 auto', padding: '28px 28px 0',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: 14,
      }}>
        <Stat label="תלמידות פעילות"      value={students.length} />
        <Stat label="רשומות לראשון הקרוב" value={nextSession?.participants.length ?? 0} accent />
        <Stat label='סה"כ כניסות במאגר'   value={students.reduce((a, s) => a + s.credits, 0)} />
        <Stat label="נגמרו להן כניסות"    value={students.filter(s => s.credits === 0).length} warn />
      </section>

      {error && <div style={{ maxWidth: 1000, margin: '16px auto 0', padding: '0 28px', color: '#ff7a7a', fontSize: 13 }}>{error}</div>}

      {/* טאבים */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 28px 0', display: 'flex', gap: 8 }}>
        <Btn variant={tab === 'sessions' ? 'primary' : 'secondary'} size="sm" onClick={() => setTab('sessions')}>שיעורים והרשמות</Btn>
        <Btn variant={tab === 'students' ? 'primary' : 'secondary'} size="sm" onClick={() => setTab('students')}>כל התלמידות</Btn>
      </div>

      {/* שיעורים */}
      {tab === 'sessions' && (
        <section style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 28px 60px' }}>
          {sessions.length === 0 && <div style={{ color: '#666' }}>אין שיעורים. הוסיפי שיעורים בטבלת sessions ב-Supabase.</div>}
          {sessions.map((sess) => {
            const open       = openSession === sess.id;
            const presentIds = sess.presentIds;
            const regIds     = sess.participants.map(p => p.id);
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
                    <div style={{ fontWeight: 900, fontSize: 18, color: COLORS.primary }}>{sessionLabel(sess.starts_at)} · {sessionTime(sess.starts_at)}</div>
                    <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>
                      {regIds.length} רשומות · {presentIds.length} הגיעו
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                      {regIds.slice(0, 4).map((id, i) => {
                        const st = byId(id);
                        return st ? (
                          <div key={id} style={{ marginInlineStart: i === 0 ? 0 : -8, border: `2px solid ${COLORS.card}`, borderRadius: '50%' }}>
                            <Avatar name={name(st)} index={i} size={28} border={COLORS.card} />
                          </div>
                        ) : null;
                      })}
                      {regIds.length > 4 && (
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%', background: '#1a1f27', color: '#9bd',
                          fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: `2px solid ${COLORS.card}`, marginInlineStart: -8,
                        }}>+{regIds.length - 4}</div>
                      )}
                    </div>
                    <span style={{ color: '#666', fontSize: 18 }}>{open ? '▲' : '▼'}</span>
                  </div>
                </div>

                {open && (
                  <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: '8px 14px 18px' }}>
                    {regIds.length === 0
                      ? <div style={{ color: '#666', fontSize: 14, padding: '16px 8px' }}>אף אחת עדיין לא נרשמה.</div>
                      : regIds.map((id) => {
                          const st = byId(id);
                          if (!st) return null;
                          const isPresent = presentIds.includes(id);
                          return (
                            <div key={id} style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '12px 8px', borderBottom: `1px solid ${COLORS.border}`, gap: 10,
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Avatar name={name(st)} index={colorIndex(st.id)} />
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: 15 }}>{name(st)}</div>
                                  <div style={{ color: '#777', fontSize: 12, direction: 'ltr', textAlign: 'right' }}>{st.phone || st.email}</div>
                                </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 12, color: st.credits === 0 ? '#ff7a7a' : '#888' }}>{st.credits} כניסות</span>
                                <Btn variant={isPresent ? 'primary' : 'outline'} size="sm" disabled={busy === `att:${sess.id}:${id}`} onClick={() => togglePresent(sess.id, id, isPresent)}>
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
                  <Avatar name={name(st)} index={colorIndex(st.id)} size={38} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{name(st)}</div>
                    <div style={{ color: '#777', fontSize: 13, direction: 'ltr', textAlign: 'right' }}>{st.phone || st.email}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ textAlign: 'center', minWidth: 60 }}>
                    <div style={{ fontWeight: 900, fontSize: 24, color: st.credits === 0 ? '#ff7a7a' : '#fff' }}>{st.credits}</div>
                    <div style={{ fontSize: 11, color: '#777' }}>כניסות</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Btn variant="outline" size="sm" disabled={busy === `cr:${st.id}` || st.credits === 0} onClick={() => addCredits(st.id, -1)}>−</Btn>
                    <Btn variant="outline" size="sm" disabled={busy === `cr:${st.id}`} onClick={() => addCredits(st.id, 1)}>+1</Btn>
                    <Btn variant="primary" size="sm" disabled={busy === `cr:${st.id}`} onClick={() => addCredits(st.id, PACK_SIZE)}>+ חבילה ({PACK_SIZE})</Btn>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ color: '#666', fontSize: 13, marginTop: 16, lineHeight: 1.6 }}>
            💡 אחרי תשלום של ₪65 בביט על כניסה בודדת, לחצי "+1". אחרי תשלום על כרטיסייה, לחצי "+ חבילה (4)". סימון "הגיעה" מוריד כניסה אוטומטית.
          </p>
        </section>
      )}
    </div>
  );
}
