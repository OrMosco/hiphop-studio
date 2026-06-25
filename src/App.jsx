import { useState } from 'react';
import { Home }      from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import './index.css';

export default function App() {
  const [screen, setScreen] = useState('home'); // 'home' | 'dashboard' | 'admin'

  return (
    <div style={{ maxWidth: 390, margin: '0 auto', minHeight: '100vh', background: '#0d0d0d' }}>
      {screen === 'home' && (
        <Home onEnter={() => setScreen('dashboard')} />
      )}
      {screen === 'dashboard' && (
        <Dashboard onBack={() => setScreen('home')} />
      )}
    </div>
  );
}
