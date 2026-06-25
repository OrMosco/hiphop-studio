// pages/Home.jsx
import Btn from '../components/Btn'
import { grad, FIXED_CLASS } from '../lib/constants'

export default function Home({ onStudent }) {
  return (
    <section style={{ maxWidth: 760, margin: '0 auto', padding: '70px 28px 40px', textAlign: 'center' }}>
      <div style={{
        fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 22,
        background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        ◆ קיבוץ אפק · עם {FIXED_CLASS.coach}
      </div>

      <h1 style={{ fontWeight: 900, fontSize: 'clamp(44px, 12vw, 92px)', lineHeight: 0.98, margin: 0 }}>
        היפ הופ<br />
        <span style={{ background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>נשים</span>
      </h1>

      <p style={{ color: '#9aa3ad', fontSize: 18, marginTop: 22, lineHeight: 1.6 }}>
        קהילת ריקוד לנשים בקיבוץ אפק. נכנסות, נרשמות לשיעור, באות לרקוד.
      </p>

      {/* כרטיס השיעור הקרוב */}
      <div style={{
        margin: '40px auto 0', maxWidth: 460, borderRadius: 12,
        border: '1px solid #16324a', background: 'linear-gradient(120deg,#0a1828,#0d0f13)',
        padding: '26px 28px', textAlign: 'right',
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#22D3EE', letterSpacing: '0.1em', marginBottom: 14 }}>
          ● השיעור הקרוב
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: 32, background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {FIXED_CLASS.day}
            </div>
          </div>
          <div style={{ width: 1, height: 48, background: '#1c222a' }} />
          <div>
            <div style={{ fontWeight: 900, fontSize: 28 }}>{FIXED_CLASS.time}</div>
            <div style={{ color: '#888', fontSize: 14 }}>עם {FIXED_CLASS.coach} · {FIXED_CLASS.location}</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 36 }}>
        <Btn onClick={onStudent}>כניסת תלמידות →</Btn>
      </div>

      <div style={{ marginTop: 18, color: '#667', fontSize: 13 }}>
        חדשה כאן? דברי עם נטעלי כדי להירשם 💬
      </div>
    </section>
  )
}
