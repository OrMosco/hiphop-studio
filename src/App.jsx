import { useState } from 'react';
import { Home }         from './pages/Home';
import { StudentLogin } from './pages/StudentLogin';
import { Dashboard }    from './pages/Dashboard';
import { Admin }        from './pages/Admin';
import { AdminGate }    from './pages/AdminGate';
import './index.css';

export default function App() {
  const [screen, setScreen]   = useState('home'); // 'home' | 'login' | 'dashboard' | 'adminGate' | 'admin'
  const [student, setStudent] = useState(null);

  if (screen === 'adminGate') {
    return (
      <AdminGate
        onSuccess={() => setScreen('admin')}
        onBack={() => setScreen('home')}
      />
    );
  }

  if (screen === 'admin') {
    return <Admin onBack={() => setScreen('home')} />;
  }

  return (
    <div style={{ maxWidth: 390, margin: '0 auto', minHeight: '100vh', background: '#0d0d0d' }}>
      {screen === 'home' && (
        <Home onEnter={() => setScreen('login')} onAdmin={() => setScreen('adminGate')} />
      )}
      {screen === 'login' && (
        <StudentLogin
          onBack={() => setScreen('home')}
          onSuccess={(s) => { setStudent(s); setScreen('dashboard'); }}
        />
      )}
      {screen === 'dashboard' && (
        <Dashboard student={student} onBack={() => setScreen('home')} />
      )}
    </div>
  );
}
