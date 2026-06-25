// pages/Admin.jsx
import { useState } from 'react'
import { Avatar } from '../components/Avatar'
import Btn from '../components/Btn'
import { grad, BLUE, BLUE2, AV_COLORS, MOCK_STUDENTS, MOCK_SESSIONS } from '../lib/constants'

function Stat({ label, value, accent, warn }) {
  return (
    <div style={{ border: '1px solid #181d24', borderRadius: 8, padding: '18px 20px', background: accent ? 'linear-gradient(120deg,#08131f,#0d0f13)' : '#0d0f13' }}>
      <div style={{
        fontWeight: 900, fontSize: 34, lineHeight: 1,
        color: warn ? '#ff7a7a' : '#fff',
        background: accent ? grad : 'none',
        WebkitBackgroundClip: accent ? 'text' : 'initial',
        WebkitTextFillColor: accent ? 'transparent' : 'initial',
      }}>{value}</div>
      <div style={{ color: '#888', fontSize: 13, marginTop: 6 }}>{label}</div>
    </div>
  )
}

export default function Admin() {
  const [tab, setTab]           = useState('sessions')
  const [students, setStudents] = useState(MOCK_STUDENTS)
  const [sessions, setSessions] = useState(MOCK_SESSIONS)
  const [openSession, setOpen]  = useState('sun-1')

  const byId = (id) => students.find((s) => s.id === id)

  const togglePresent = (sessionId, studentId) => {
    setSessions((prev) => prev.map((s) => {
      if (s.id !== sessionId) return s
      const isPresent = s.present.includes(studentId)
      // מוריד/מחזיר כניסה
      setStudents((sts) => sts.map((st) =>
        st.id === studentId
          ? { ...st, credits: isPresent ? st.credits + 1 : Math.max(0, st.credits - 1) }
          : st
      ))
      return { ...s, present: isPresent ? s.present.filter((i) => i !== studentId) : [...s.present, studentId] }
    }))
  }

  const addCredits = (studentId, n) =>
    setStudents((prev) => prev.map((s) => s.id === studentId ? { ...s, credits: Math.max(0, s.credits + n) } : s))

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#0A0C0F', color: '#fff', fontFamily: "'Heebo', system-ui, sans-serif" }}>
      <style>{`* { box-sizing: border-box; } @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;900&display=swap');`}</style>

      {/* נב ניהול */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 28px', borderBottom: '1px solid #14181e',
        position: 'sticky', top: 0, background: 'rgba(10,12,15,.9)', backdropFilter: 'blur(12px)', zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name="נטעלי" colorIndex={0} size={36} />
          <div>
            <div style={{ fontWeight: 900, fontSize: 17, lineHeight: 1.1 }}>שלום נטעלי 👋</div>
            <div style={{ color: '#888', fontSize: 12 }}>ניהול · היפ הופ נשים אפק</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: '#5BE584', fontWeight: 700, background: '#0e1f15', padding: '6px 12px', borderRadius: 20, border: '1px solid #1f5132' }}>
          מסך מנהלת
        </div>
      </nav>

      {/* סטאטס */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 28px 0',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: 14 }}>
        <Stat label="תלמידות פעילות"        value={students.length} />
        <Stat label="רשומות לראשון הקרוב"   value={sessions[0].registered.length} accent />
        <Stat label='סה"כ כניסות במאגר'     value={students.reduce((a, s) => a + s.credits, 0)} />
        <Stat label="נגמרו להן כניסות"      value={students.filter((s) => s.credits === 0).length} warn />
      </section>

      {/* טאבים */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 28px 0', display: 'flex', gap: 8 }}>
        <Btn variant={tab === 'sessions' ? 'solid' : 'dark'} onClick={() => setTab('sessions')}>שיעורים והרשמות</Btn>
        <Btn variant={tab === 'students' ? 'solid' : 'dark'} onClick={() => setTab('students')}>כל התלמידות</Btn>
      </div>

      {/* שיעורים */}
      {tab === 'sessions' && (
        <section style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 28px 60px' }}>
          {sessions.map((sess) => {
            const open = openSession === sess.id
            return (
              <div key={sess.id} style={{ border: open ? `1px solid ${BLUE}` : '1px solid #181d24',
                borderRadius: 8, marginBottom: 14, overflow: 'hidden', background: open ? '#08131f' : '#0d0f13' }}>
                <div onClick={() => setOpen(open ? null : sess.id)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', cursor: 'pointer', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div>
                      <div style={{ fontWeight: 900, fontSize: 18, background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ראשון {sess.date}</div>
                      <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>
                        {sess.registered.length} רשומות · {sess.present.length} הגיעו
                        {sess.label && <span style={{ color: BLUE2, marginInlineStart: 8 }}>· {sess.label}</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                      {sess.registered.slice(0, 4).map((id, i) => {
                        const st = byId(id)
                        return st ? (
                          <div key={id} style={{ marginInlineStart: i === 0 ? 0 : -8, border: '2px solid #0d0f13', borderRadius: '50%' }}>
                            <Avatar name={st.name} colorIndex={i} size={28} />
                          </div>
                        ) : null
                      })}
                      {sess.registered.length > 4 && (
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1a1f27', color: '#9bd',
                          fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: '2px solid #0d0f13', marginInlineStart: -8 }}>+{sess.registered.length - 4}</div>
                      )}
                    </div>
                    <span style={{ color: '#666', fontSize: 18 }}>{open ? '▲' : '▼'}</span>
                  </div>
                </div>

                {open && (
                  <div style={{ borderTop: '1px solid #16203044', padding: '8px 14px 18px' }}>
                    {sess.registered.length === 0
                      ? <div style={{ color: '#666', fontSize: 14, padding: '16px 8px' }}>אף אחת עדיין לא נרשמה.</div>
                      : sess.registered.map((id) => {
                          const st = byId(id)
                          if (!st) return null
                          const present = sess.present.includes(id)
                          return (
                            <div key={id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '12px 8px', borderBottom: '1px solid #12161c', gap: 10 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Avatar name={st.name} colorIndex={st.id % AV_COLORS.length} />
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: 15 }}>{st.name}</div>
                                  <div style={{ color: '#777', fontSize: 12, direction: 'ltr', textAlign: 'right' }}>{st.phone}</div>
                                </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 12, color: st.credits === 0 ? '#ff7a7a' : '#888' }}>{st.credits} כניסות</span>
                                <Btn small variant={present ? 'green' : 'ghost'} onClick={() => togglePresent(sess.id, id)}>
                                  {present ? '✓ הגיעה' : 'סמני נוכחות'}
                                </Btn>
                              </div>
                            </div>
                          )
                        })
                    }
                  </div>
                )}
              </div>
            )
          })}
        </section>
      )}

      {/* תלמידות */}
      {tab === 'students' && (
        <section style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 28px 60px' }}>
          <div style={{ border: '1px solid #181d24', borderRadius: 8, overflow: 'hidden' }}>
            {students.map((st, i) => (
              <div key={st.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px', gap: 10,
                borderBottom: i < students.length - 1 ? '1px solid #12161c' : 'none',
                background: st.credits === 0 ? '#160d0d22' : 'transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <Avatar name={st.name} colorIndex={st.id % AV_COLORS.length} size={38} />
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
                    <Btn small variant="ghost" onClick={() => addCredits(st.id, -1)}>−</Btn>
                    <Btn small variant="solid" onClick={() => addCredits(st.id, 4)}>+ חבילה (4)</Btn>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ color: '#666', fontSize: 13, marginTop: 16, lineHeight: 1.6 }}>
            💡 כשתלמידה משלמת ב‑PayBox, לחצי "+ חבילה" כדי להוסיף לה 4 כניסות. סימון "הגיעה" מוריד כניסה אוטומטית.
          </p>
        </section>
      )}
    </div>
  )
}
