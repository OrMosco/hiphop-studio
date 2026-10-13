import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Home }         from './pages/Home';
import { StudentLogin } from './pages/StudentLogin';
import { Dashboard }    from './pages/Dashboard';
import { Admin }        from './pages/Admin';
import { useAuth }      from './lib/auth';
import { isSupabaseConfigured } from './lib/supabase';
import { COLORS } from './lib/constants';
import './index.css';

function Centered({ children }) {
  return (
    <div dir="rtl" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.textMuted, padding: 28, textAlign: 'center' }}>
      {children}
    </div>
  );
}

function RequireAuth({ admin = false, children }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  if (loading || (user && !profile)) return <Centered>טוען…</Centered>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (admin && !profile.is_admin) return <Centered>אין לך הרשאת ניהול.</Centered>;
  return children;
}

const Mobile = ({ children }) => (
  <div style={{ maxWidth: 390, margin: '0 auto', minHeight: '100vh', background: COLORS.bg }}>{children}</div>
);

export default function App() {
  if (!isSupabaseConfigured) {
    return <Centered>Supabase לא מוגדר. העתיקי את ‎.env.example‎ ל־‎.env.local‎ ומלאי את הערכים.</Centered>;
  }
  return (
    <Routes>
      <Route path="/"          element={<Mobile><Home /></Mobile>} />
      <Route path="/login"     element={<Mobile><StudentLogin /></Mobile>} />
      <Route path="/dashboard" element={<RequireAuth><Mobile><Dashboard /></Mobile></RequireAuth>} />
      <Route path="/admin"     element={<RequireAuth admin><Admin /></RequireAuth>} />
      <Route path="*"          element={<Navigate to="/" replace />} />
    </Routes>
  );
}
