// pages/Dashboard.jsx
import Btn from '../components/Btn'
import { AvatarStack } from '../components/Avatar'
import { PAYBOX_LINK, grad, BLUE, BLUE2, MOCK_UPCOMING } from '../lib/constants'

export default function Dashboard({ student, credits, booked, onToggle }) {
  const lowCredits = credits <= 1

  return (
    <section style={{ maxWidth: 800, margin: '0 auto', padding: '40px 28px' }}>

      {/* באנר כניסות */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16,
        background: 'linear-gradient(100deg,#0a1828,#0d0f13)',
        border: `1px solid ${lowCredits ? '#4a2a16' : '#16324a'}`,
        borderRadius: 10, padding: '26px 30px', marginBottom: 36,
      }}>
        <div>
          <div style={{ color: '#999', fontSize: 15 }}>היי {student.name} 👋</div>
          <div style={{ fontWeight: 900, fontSize: 38, lineHeight: 1.1, marginTop: 4 }}>
            נשארו לך {credits}{' '}
            <span style={{ background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              כניסות
            </span>
          </div>
          {lowCredits && (
            <div style={{ color: '#ffb27a', fontSize: 13, marginTop: 6 }}>
              ⚠ הכניסות עומדות להיגמר — אולי הזמן לטעון?
            </div>
          )}
        </div>
        <a href={PAYBOX_LINK} target="_blank" rel="noopener noreferrer">
          <Btn>טעינת כניסות ב‑PayBox</Btn>
        </a>
      </div>

      {/* כותרת שיעורים */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 700, background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          הרשמה לשיעורים
        </span>
        <div style={{ flex: 1, height: 1, background: '#16191f' }} />
      </div>
      <p style={{ color: '#888', margin: '0 0 24px', fontSize: 14 }}>
        ראשון 20:00 עם נטעלי. לחיצה נרשמת (כניסה אחת), לחיצה נוספת מבטלת.
      </p>

      {/* כרטיסי שיעורים */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 14 }}>
        {MOCK_UPCOMING.map((c) => {
          const isBooked = booked.includes(c.id)
          const canBook  = credits > 0 || isBooked
          const names    = isBooked && !c.attendees.includes(student.name)
            ? [student.name, ...c.attendees]
            : c.attendees

          return (
            <div key={c.id} style={{
              border: isBooked ? `1px solid ${BLUE}` : '1px solid #181d24',
              background: isBooked ? '#08131f' : '#0d0f13',
              borderRadius: 8, padding: 22, opacity: canBook ? 1 : 0.45,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 900, fontSize: 20, background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  ראשון
                </span>
                <span style={{ fontWeight: 700 }}>{c.date}</span>
              </div>
              <div style={{ color: '#888', fontSize: 14, margin: '8px 0 4px' }}>20:00 · נטעלי</div>
              {c.label
                ? <div style={{ color: BLUE2, fontSize: 12, fontWeight: 700 }}>{c.label}</div>
                : <div style={{ height: 14 }} />
              }
              <div style={{ margin: '16px 0', minHeight: 34 }}>
                <AvatarStack names={names} />
              </div>
              <Btn
                full
                variant={isBooked ? 'ghost' : 'solid'}
                disabled={!canBook}
                onClick={() => onToggle(c.id)}
              >
                {isBooked ? '✓ רשומה — ביטול' : 'הרשמה · כניסה אחת'}
              </Btn>
            </div>
          )
        })}
      </div>
    </section>
  )
}
