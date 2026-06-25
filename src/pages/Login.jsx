// pages/Login.jsx
import Btn from '../components/Btn'

export default function Login({ phone, setPhone, onLogin }) {
  return (
    <section style={{ maxWidth: 420, margin: '60px auto', padding: '0 28px' }}>
      <h2 style={{ fontWeight: 900, fontSize: 38, margin: '0 0 8px' }}>ברוכה השבה.</h2>
      <p style={{ color: '#888', marginBottom: 28, lineHeight: 1.6 }}>
        הזיני את מספר הטלפון שלך כדי לראות את הכניסות ולהירשם לשיעורים.
      </p>

      <label style={{ fontSize: 13, color: '#888', fontWeight: 700 }}>מספר טלפון</label>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onLogin()}
        placeholder="050-0000000"
        dir="ltr"
        style={{
          width: '100%', marginTop: 8, marginBottom: 20, padding: '16px',
          background: '#0d0f13', border: '1px solid #222831', borderRadius: 4,
          color: '#fff', fontSize: 16, fontFamily: 'inherit', outline: 'none', textAlign: 'right',
        }}
      />

      <Btn full onClick={onLogin}>המשך</Btn>

      {/* TODO: להחליף ב-Supabase OTP אמיתי */}
      <p style={{ color: '#555', fontSize: 13, marginTop: 20, textAlign: 'center' }}>
        (כרגע: הדגמה בלבד — בלי אימות אמיתי)
      </p>
    </section>
  )
}
