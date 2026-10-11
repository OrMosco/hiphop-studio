import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Btn } from '../components/Btn';
import { BackButton } from '../components/BackButton';
import { COLORS } from '../lib/constants';
import { useAuth } from '../lib/auth';

export function StudentLogin() {
  const { user, signInWithGoogle } = useAuth();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';
  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { setError(null); }, []);
  if (user) return <Navigate to={from} replace />;

  const login = async () => {
    setBusy(true);
    const { error } = await signInWithGoogle(from);
    if (error) { setError(error.message); setBusy(false); }
  };

  return (
    <div className="fade-up" dir="rtl" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '18px 28px 0' }}>
        <BackButton to="/" />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 28px' }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.textPrimary, textAlign: 'right', marginBottom: 8 }}>
          כניסת תלמידות
        </div>
        <div style={{ fontSize: 14, color: '#666', textAlign: 'right', marginBottom: 26 }}>
          התחברי בלחיצה אחת עם חשבון Google שלך
        </div>
        <Btn variant="primary" size="md" fullWidth onClick={login} disabled={busy}>
          {busy ? 'מעבירה ל-Google…' : 'התחברות עם Google'}
        </Btn>
        {error && <div style={{ color: '#ff7a7a', fontSize: 13, textAlign: 'right', marginTop: 14 }}>{error}</div>}
      </div>
    </div>
  );
}
