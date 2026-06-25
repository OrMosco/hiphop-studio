import { useState } from 'react';
import { Btn } from '../components/Btn';
import { COLORS, ADMIN_PASSWORD } from '../lib/constants';

export function AdminGate({ onSuccess, onBack }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (value === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div dir="rtl" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 28px', background: COLORS.bg }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.textPrimary, textAlign: 'right', marginBottom: 8 }}>
        כניסת מנהלת
      </div>
      <div style={{ fontSize: 14, color: '#666', textAlign: 'right', marginBottom: 22 }}>
        הכניסי סיסמה כדי להמשיך
      </div>

      <form onSubmit={submit}>
        <input
          type="password"
          value={value}
          onChange={e => { setValue(e.target.value); setError(false); }}
          autoFocus
          style={{
            width: '100%',
            background: COLORS.card,
            border: `1px solid ${error ? '#ff7a7a' : COLORS.border}`,
            borderRadius: 14,
            padding: '15px 18px',
            color: COLORS.textPrimary,
            fontSize: 16,
            textAlign: 'right',
            marginBottom: 14,
            outline: 'none',
          }}
          placeholder="סיסמה"
        />

        {error && (
          <div style={{ color: '#ff7a7a', fontSize: 13, textAlign: 'right', marginBottom: 14 }}>
            סיסמה שגויה
          </div>
        )}

        <Btn type="submit" variant="primary" size="md" fullWidth>
          כניסה
        </Btn>
        <div style={{ marginTop: 10 }}>
          <Btn type="button" variant="ghost" size="sm" fullWidth onClick={onBack}>
            חזרה
          </Btn>
        </div>
      </form>
    </div>
  );
}
