'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin } from '@/lib/admin-api/_base';

// ── F-07.84 CURED — THE CREDENTIAL HAS LEFT THE CLIENT ───────────────────────
// THIS FILE READ, until this delivery:
//     const PWD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? '';
//     if (password === PWD) { localStorage.setItem('admin_session','true'); }
// Two defects in three lines. Next inlines every NEXT_PUBLIC_* into the public
// bundle, so wherever that var was set the LIVE admin password was served to
// every visitor of the site — view-source was the whole attack. And the gate it
// guarded was a localStorage boolean, so anyone with devtools could type one
// line and own the panel without knowing any password at all.
//
// The password now goes to the BACKEND and nothing comes back that contains it.
// The var is gone from source; deleting it on Vercel is the founder's step.
//
// REFUSED IN INK, and recorded here so it is never proposed again: setting the
// Vercel var to the ROTATED value would have published a live credential to
// replace a dead one. That is not a fix. It was never performed.
//
// ── VETO PENDING — ONE STRING (the packet's only new byte of copy) ───────────
// NETWORK_FAIL below is the LE's DRAFT, not an approved byte. A fetch can now
// fail in a way this screen could not fail before, and "Incorrect password."
// cannot honestly describe a 502 — that sentence would blame the operator for
// the server being down. The founder words it in one line and this constant is
// the only thing that changes.
const NETWORK_FAIL = 'Could not reach the server. Try again.';
const WRONG_PWD    = 'Incorrect password.';

// Frozen bytes, unchanged from before this delivery — the design-system palette
// this screen has always used. Moved with the header rewrite, not re-authored.
const G      = '#C44058';
const INK    = '#F0EAE0';
const SOFT   = 'rgba(240,234,224,0.5)';
const BORDER = 'rgba(255,255,255,0.12)';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleLogin() {
    setLoading(true); setError('');
    try {
      const result = await adminLogin(password);
      if (result.ok === true) {
        router.replace('/admin');
        return;
      }
      // 401 is a wrong password. Anything else (503 mis-provisioned, 5xx, CORS)
      // is the server's problem, not the operator's, and is not reported as a
      // bad password — the F-07.37 claimed-truth class applied to a login screen.
      setError(result.status === 401 ? WRONG_PWD : NETWORK_FAIL);
    } catch {
      setError(NETWORK_FAIL);
    }
    setLoading(false);
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
