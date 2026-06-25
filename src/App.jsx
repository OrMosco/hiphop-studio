// App.jsx
import { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import { MOCK_STUDENT } from './lib/constants'

export default function App() {
  const [view, setView]       = useState('home') // home | login | dash | admin
  const [student, setStudent] = useState(null)
  const [phone, setPhone]     = useState('')
  const [booked, setBooked]   = useState(['sun-1'])
  const [credits, setCredits] = useState(MOCK_STUDENT.credits)

  const login = () => {
    // TODO: החלף ב-Supabase OTP אמיתי
    setStudent({ ...MOCK_STUDENT, phone: phone || MOCK_STUDENT.phone })
    setView('dash')
  }

  const toggleBook = (id) => {
    if (booked.includes(id)) {
      setBooked(booked.filter((b) => b !== id))
      setCredits((c) => c + 1)
    } else if (credits > 0) {
      setBooked([...booked, id])
      setCredits((c) => c - 1)
    }
  }

  // /admin — נסתר, רק לנטעלי
  if (view === 'admin') return <Admin />

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#0A0C0F', color: '#fff', fontFamily: "'Heebo', system-ui, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;900&display=swap');
        ::selection { background:#3B82F6; color:#fff; }
      `}</style>

      <Navbar
        student={student}
        credits={credits}
        onHome={() => setView('home')}
        onDash={() => setView('dash')}
      />

      {view === 'home'  && <Home onStudent={() => setView('login')} />}
      {view === 'login' && <Login phone={phone} setPhone={setPhone} onLogin={login} />}
      {view === 'dash'  && student && (
        <Dashboard student={student} credits={credits} booked={booked} onToggle={toggleBook} />
      )}

      <footer style={{ borderTop: '1px solid #14181e', padding: '40px 28px', marginTop: 80, color: '#555', fontSize: 14, textAlign: 'center' }}>
        היפ הופ נשים אפק · קיבוץ אפק · עם נטעלי
        {/* קישור נסתר למנהלת */}
        <span onClick={() => setView('admin')} style={{ marginInlineStart: 16, cursor: 'pointer', opacity: 0.15 }}>⚙</span>
      </footer>
    </div>
  )
}
