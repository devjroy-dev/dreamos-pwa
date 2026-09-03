'use client';
// app/vendor/pin-login/page.tsx
// Vendor PIN entry — same aesthetic as couple/pin-login.
// Editorial images + carousel + frosted glass overlay.
// Routed to after OTP verify on the landing page for Makers.
// Uses vendor pin-login endpoint. Redirects to /vendor on success.

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/lib/api';

// iOS Safari may have thrown on localStorage.setItem during landing sign-in, so
// the session can live only in the first-party cookie. Read both; write both.
const SESSION_COOKIE = 'tdw_vendor_session';

function readVendorSession(): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem('vendor_web_session') || localStorage.getItem('vendor_session');
    if (raw) return JSON.parse(raw);
  } catch { /* fall through */ }
  try {
    const m = document.cookie.split('; ').find(r => r.startsWith(SESSION_COOKIE + '='));
    if (m) return JSON.parse(decodeURIComponent(m.split('=').slice(1).join('=')));
  } catch { /* ignore */ }
  return null;
}

function writeVendorSession(session: Record<string, unknown>): void {
  try {
    localStorage.setItem('vendor_web_session', JSON.stringify(session));
    localStorage.setItem('vendor_session',     JSON.stringify(session));
  } catch { /* iOS storage blocked — cookie covers it */ }
  try {
    document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(JSON.stringify(session))}; max-age=${7 * 24 * 60 * 60}; path=/; SameSite=Lax; Secure`;
  } catch { /* ignore */ }
}

const GOLD = '#C9A84C';
const FALLBACK_SLIDES: string[] = [
  'https://res.cloudinary.com/dccso5ljv/image/upload/IMG_2544.PNG_cyeqlj',
  'https://res.cloudinary.com/dccso5ljv/image/upload/Facetune_14-05-2026-11-06-49_qs4dg6',
  'https://res.cloudinary.com/dccso5ljv/image/upload/Facetune_24-03-2026-22-59-53_f2tfsy',
];

export default function VendorPinLoginPage() {
  const router = useRouter();
  const [pin,      setPin]      = useState(['', '', '', '']);
  const [shaking,  setShaking]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [toast,    setToast]    = useState('');
  const [attempts, setAttempts] = useState(0);
  const [slide,    setSlide]    = useState(() => Math.floor(Math.random() * FALLBACK_SLIDES.length));
  const [slides,   setSlides]   = useState<string[]>(FALLBACK_SLIDES);
  const [name,     setName]     = useState('');
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2800); };

  useEffect(() => {
    // Read session from localStorage; fall back to the first-party cookie that
    // the landing login mirrors to (covers iOS Safari where localStorage.setItem
    // threw during sign-in, so the session only exists in the cookie).
    const s = readVendorSession();
    if (!s?.id || !s?.pin_set) { router.replace('/'); return; }
    if (s?.name) setName(s.name as string);
    pinRefs.current[0]?.focus();
  }, [router]);

  useEffect(() => {
    fetch(API_BASE + '/api/v2/landing-slides')
      .then(r => r.json())
      .then(d => { if (d.slides?.length) setSlides(d.slides.map((p: { image_url: string }) => p.image_url)); })
      .catch(() => {});
    const t = setInterval(() => setSlide(p => (p + 1) % (slides.length || FALLBACK_SLIDES.length)), 4500);
    return () => clearInterval(t);
  }, [slides.length]);

  const verify = useCallback(async (pinStr: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const session = readVendorSession() || {};
      const r = await fetch(API_BASE + '/api/v2/vendor/auth/pin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: session.phone, pin: pinStr }),
      });
      const d = await r.json();
      if (d.ok) {
        if (d.access_token)  { try { localStorage.setItem('access_token', d.access_token); } catch {} }
        if (d.refresh_token) { try { localStorage.setItem('refresh_token', d.refresh_token); } catch {} }
        const existing = readVendorSession() || {};
        // Write stamped vendor session for dreamai session hardening.
        // F-04.96: pin-login now returns name/category/tier (verify-otp's dialect), so
        // read tier off THIS login response — a returning PIN sign-in on a cleared
        // session no longer floors a Prestige vendor to 'essential'. Existing session
        // is the fallback only when a field is absent from the response.
        const updated = {
          ...existing,
          id:         d.vendor_id  || existing.id,
          user_id:    d.user_id    || existing.user_id,
          name:       d.name     || existing.name     || existing.vendorName || null,
          phone:      session.phone,
          tier:       d.tier     || existing.tier     || 'essential',
          category:   d.category || existing.category || null,
          access_token:  d.access_token,
          refresh_token: d.refresh_token || d.access_token,
          pin_set: true,
          _v: 2,
        };
        writeVendorSession(updated);
        router.replace('/vendor');
      } else {
        const next = attempts + 1; setAttempts(next);
        setShaking(true); setTimeout(() => setShaking(false), 400);
        setPin(['', '', '', '']); pinRefs.current[0]?.focus();
        if (next >= 5) {
          showToast('Too many attempts.');
          setTimeout(() => {
            localStorage.removeItem('vendor_web_session');
            localStorage.removeItem('vendor_session');
            router.replace('/');
          }, 1800);
        } else {
          showToast('Incorrect PIN. ' + (5 - next) + ' attempt' + (5 - next === 1 ? '' : 's') + ' left.');
        }
      }
    } catch { showToast('Network error. Try again.'); }
    finally { setLoading(false); }
  }, [loading, attempts, router]);

  const handleInput = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const v = val.slice(-1);
    setPin(prev => {
      const n = [...prev]; n[idx] = v;
      if (idx === 3 && v) setTimeout(() => verify([...n].join('')), 80);
      return n;
    });
    if (v && idx < 3) pinRefs.current[idx + 1]?.focus();
  };

  const handleBackspace = (idx: number, val: string) => {
    if (val === '' && idx > 0) {
      setPin(prev => { const n = [...prev]; n[idx - 1] = ''; return n; });
      pinRefs.current[idx - 1]?.focus();
    }
  };

  const inputStyle: React.CSSProperties = {
    width: 52, height: 62, background: 'transparent', border: 'none', outline: 'none',
    borderBottom: '2px solid ' + GOLD,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400, fontSize: 25, lineHeight: 1.5, color: '#F0E6D2', textAlign: 'center',
    touchAction: 'manipulation', caretColor: GOLD,
  };

  const firstName = name?.split(' ')[0] || '';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400&family=Jost:wght@200;300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; background: #0C0A09; }
        @keyframes pinFadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pinShake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-32px) translateX(-50%)} to{opacity:1;transform:translateY(0) translateX(-50%)} }
        input[type=tel]::-webkit-outer-spin-button, input[type=tel]::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>

      {toast && (
        <div style={{ position:'fixed',top:24,left:'50%',transform:'translateX(-50%)',background:'rgba(201,168,76,0.12)',backdropFilter:'blur(12px)',border:'0.5px solid rgba(201,168,76,0.3)',color:GOLD,fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize: 16, lineHeight: 1.5,padding:'10px 20px',borderRadius:100,zIndex:9999,whiteSpace:'nowrap',animation:'slideDown 280ms cubic-bezier(0.22,1,0.36,1)' }}>{toast}</div>
      )}


      {/* ── TDW_09 MICRO-2 · F-09.72 · R-M6 — INVARIANT WHOLE. THE LANDING IS THE LAW ──
          THE DISEASE, in the founder's words: this screen could not be read. The
          arithmetic: its ground was PINNED (body #0C0A09 and the inset div below,
          both hardcoded) while its ink read TOKENS THAT FLIP WITH THEME. On
          Editorial Paper --atelier-ink-dim becomes rgba(26,15,8,0.62) — dark ink —
          over a ground that never lightens. Measured over a typical slide the
          sub-lines fell to 1.13:1. They were not dim. They were gone.
          THERE ARE TWO WAYS TO MAKE A COHERENT PAIR AND THE FIRST BUILD TOOK THE
          WRONG ONE. R-M3(b) unpinned the GROUND — panel to var(--atelier-sheet-top),
          which resolves #F5F2EE on Paper. Legible, benchable, and a cream block
          sitting next to a landing page that is theme-invariant dark. The founder
          vetoed it on his walk and R-M6 re-ruled: app/(landing)/page.tsx is the
          product's reference surface for every photo-slide gate — photo forward,
          dark scrim, ink pinned — and this screen matches it. So the INK pins
          instead, and the panel returns to the bytes it always had.
          EVERYTHING HERE IS NOW A LITERAL — ground, ink, gold and the panel's own
          edge. That is the point: an invariant surface has no travelling half, so
          the pair cannot come apart on a theme flip the way it did. It is also why
          this file passes the pinned-ground cell honestly rather than by exemption,
          and it is the shape the couple PIN screens already ship.
          MEASURED, over the WORST CASE — a blown-out white slide region at 0.55
          under the 0.45 page scrim under this 0.3 panel, compositing to rgb(63,62,61).
          backdrop-filter blurs that region without moving its mean, so the blur buys
          nothing and is not credited. Derived by command, not estimated:
            heading / PIN digits  #F0E6D2                 8.61:1
            sub-lines             rgba(240,230,210,0.65)  4.69:1
            gold                  #C9A84C                 4.67:1
          THE SUB-LINE RUNG IS 0.65, NOT 0.58. The chair's re-ruling proposed 0.58
          (theme.ts's inkMute); measured on this ground it lands at 4.08:1 and fails
          the bar. 0.52, which is what actually shipped before this sitting, lands at
          3.60:1 — so the dark theme was under the bar over a bright slide all along
          and nobody had measured it. 0.65 is theme.ts's inkSoft rung and clears.
          THE GOLD IS PINNED TOO, and it has to be: var(--role-metal) resolves
          #826A27 on Paper, which is dark gold on a dark panel. "Gold stays" means
          it stays GOLD, which on an invariant surface means it stops being a token.
          MECHANISM (F-06.85's law): every number above is a function of THREE
          alphas — the slide's 0.55, the scrim's 0.45 and this panel's 0.3, all in
          this file. Move any one of them and every number is re-derived.
          scripts/tdw09_roles.proof.mjs cell ⑨ parses all three from this file and
          recomputes rather than trusting the comment; the comment is the reader's
          copy, the cell is the guard.
          RADIUS: R-M2 ruled the VENDOR TRIO — this file, pin-reset, pin, moving
          together. The couple screens were already this shape; not one byte crosses. */}
      <div style={{ position:'fixed',inset:0,background:'#0C0A09',overflow:'hidden' }}>
        {slides.map((src, i) => (
          <div key={i} style={{ position:'absolute',inset:0,backgroundImage:'url(' + src + ')',backgroundSize:'cover',backgroundPosition:'center',opacity: i === slide ? 0.55 : 0,transition:'opacity 1200ms ease' }} />
        ))}
        <div style={{ position:'absolute',inset:0,background:'rgba(12,10,9,0.45)' }} />
        <div style={{ position:'absolute',bottom:0,left:0,right:0,animation:'pinFadeIn 400ms cubic-bezier(0.22,1,0.36,1)' }}>
          <div style={{ background:'rgba(12,10,9,0.3)',backdropFilter:'blur(28px)',WebkitBackdropFilter:'blur(28px)',borderTop:'0.5px solid rgba(201,168,76,0.52)',borderRadius:'20px 20px 0 0',padding:'28px 32px calc(env(safe-area-inset-bottom, 16px) + 32px)' }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontWeight:300,fontSize: 16, lineHeight: 1.5,color:'rgba(240,230,210,0.65)',margin:'0 0 2px' }}>The Dream Wedding</p>
            <p style={{ fontFamily:"'Jost',sans-serif",fontWeight:200,fontSize: 8,letterSpacing:'0.32em',textTransform:'uppercase',color:GOLD,margin:'0 0 24px' }}>MAKER PORTAL</p>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize: 25,color:'#F0E6D2',margin:'0 0 4px',lineHeight:1.15 }}>
              {firstName ? 'Welcome back, ' + firstName + '.' : 'Welcome back.'}
            </p>
            <p style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize: 16, lineHeight: 1.5,color:'rgba(240,230,210,0.65)',margin:'0 0 28px' }}>Enter your PIN to continue.</p>
            <div style={{ display:'flex',justifyContent:'center',gap:16,marginBottom:32,animation: shaking ? 'pinShake 320ms cubic-bezier(0.22,1,0.36,1)' : 'none' }}>
              {pin.map((d, i) => (
                <input key={i} ref={el => { pinRefs.current[i] = el; }}
                  type="tel" inputMode="numeric" maxLength={1} value={d}
                  autoComplete="one-time-code"
                  onChange={e => handleInput(i, e.target.value)}
                  onKeyDown={e => { if (e.key === 'Backspace') handleBackspace(i, d); }}
                  style={inputStyle} disabled={loading} />
              ))}
            </div>
            {loading && <p style={{ fontFamily:"'Jost',sans-serif",fontWeight:200,fontSize: 9,letterSpacing:'0.2em',textTransform:'uppercase',color:GOLD,textAlign:'center',marginBottom:20 }}>Verifying…</p>}
            <p onClick={() => { router.push('/vendor/pin-reset'); }}
              style={{ fontFamily:"'Jost',sans-serif",fontWeight:200,fontSize: 8,letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(240,230,210,0.65)',textAlign:'center',cursor:'pointer',touchAction:'manipulation' }}
            >Forgot PIN?</p>
          </div>
        </div>
      </div>
    </>
  );
}
