'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PWD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? '';
const G = '#C44058';
const INK = '#F0EAE0';
const SOFT = 'rgba(240,234,224,0.5)';
const BORDER = 'rgba(255,255,255,0.12)';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  function handleLogin() {
    setLoading(true); setError('');
    setTimeout(() => {
      if (password === PWD) {
        localStorage.setItem('admin_session', 'true');
        router.replace('/admin');
      } else {
        setError('Incorrect password.');
        setLoading(false);
      }
    }, 400);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(165deg, #213650 0%, #18293E 50%, #122031 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontWeight: 400, fontSize: 28, color: INK, marginBottom: 7 }}>The Dream Wedding</p>
          <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: 9, color: G, letterSpacing: '0.34em', textTransform: 'uppercase' }}>Control Room</p>
          <div style={{ height: '0.5px', background: `linear-gradient(to right, transparent, ${G}55, transparent)`, marginTop: 20 }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 600, fontSize: 9, color: SOFT, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>Password</p>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            autoFocus
            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: `0.5px solid ${BORDER}`, borderRadius: 10, padding: '14px 16px', fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: 15, color: INK, outline: 'none', minHeight: 52 }}
          />
        </div>

        {error && <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: '#E0574E', marginBottom: 12 }}>{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading || !password}
          style={{ width: '100%', background: !password || loading ? 'rgba(196,64,88,0.25)' : G, border: 'none', borderRadius: 10, padding: '16px 0', fontFamily: '"Jost", sans-serif', fontWeight: 600, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: !password || loading ? 'rgba(240,234,224,0.4)' : INK, minHeight: 52, cursor: !password || loading ? 'not-allowed' : 'pointer', marginTop: 4 }}
        >
          {loading ? 'Entering…' : 'Enter'}
        </button>
      </div>
    </div>
  );
}
