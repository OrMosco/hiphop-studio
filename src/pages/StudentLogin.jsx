import { useState } from 'react';
import { Btn } from '../components/Btn';
import { StatusBar } from '../components/StatusBar';
import { COLORS, MOCK_STUDENTS } from '../lib/constants';

export function StudentLogin({ onBack, onSuccess }) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const student = MOCK_STUDENTS.find(s => s.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''));
    if (student) {
      onSuccess(student);
    } else {
      setError(true);
    }
  };

  return (
    <div className="fade-up" dir="rtl" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      {/* ── Nav ── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '18px 28px 0' }}>
        <button
          onClick={onBack}
          style={{
            width: 38, height: 38,
            background: '#1a1a1a', border: `1px solid ${COLORS.borderAlt}`,
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#888', fontSize: 15, flexShrink: 0,
          }}
          title="חזרה"
        >
          ←
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 28px' }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.textPrimary, textAlign: 'right', marginBottom: 8 }}>
          כניסת תלמידות
        </div>
        <div style={{ fontSize: 14, color: '#666', textAlign: 'right', marginBottom: 26 }}>
          הכניסי את מספר הטלפון שלך כדי להמשיך
        </div>

        <form onSubmit={submit}>
          <input
            type="tel"
            value={phone}
            onChange={e => { setPhone(e.target.value); setError(false); }}
            autoFocus
            placeholder="050-0000000"
            style={{
              width: '100%',
              background: COLORS.card,
              border: `1px solid ${error ? '#ff7a7a' : COLORS.border}`,
              borderRadius: 14,
              padding: '15px 18px',
              color: COLORS.textPrimary,
              fontSize: 16,
              textAlign: 'right',
              direction: 'ltr',
              marginBottom: 14,
              outline: 'none',
            }}
          />

          {error && (
            <div style={{ color: '#ff7a7a', fontSize: 13, textAlign: 'right', marginBottom: 14 }}>
              לא מצאנו תלמידה עם מספר הטלפון הזה
            </div>
          )}

          <Btn type="submit" variant="primary" size="md" fullWidth>
            כניסה
          </Btn>
        </form>
      </div>
    </div>
  );
}
