import { useNavigate } from 'react-router-dom';
import { COLORS } from '../lib/constants';

export function BackButton({ to }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => (to ? navigate(to) : window.history.length > 1 ? navigate(-1) : navigate('/'))}
      style={{
        width: 38, height: 38, background: '#1a1a1a', border: `1px solid ${COLORS.borderAlt}`,
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: '#888', fontSize: 15, flexShrink: 0,
      }}
      title="חזרה"
    >←</button>
  );
}
