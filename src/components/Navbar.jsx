// components/Navbar.jsx
import { grad } from '../lib/constants'
import Btn from './Btn'

export default function Navbar({ student, credits, onHome, onDash }) {
  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '20px 28px', borderBottom: '1px solid #14181e',
      position: 'sticky', top: 0, background: 'rgba(10,12,15,.85)',
      backdropFilter: 'blur(12px)', zIndex: 50,
    }}>
      <div onClick={onHome} style={{ fontWeight: 900, fontSize: 22, cursor: 'pointer', lineHeight: 1.1 }}>
        היפ הופ נשים
        <span style={{ background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> אפק</span>
      </div>

      {student ? (
        <Btn variant="ghost" onClick={onDash}>{student.name} · {credits} ⚡</Btn>
      ) : null}
    </nav>
  )
}
