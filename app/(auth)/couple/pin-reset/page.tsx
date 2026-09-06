'use client';
// app/(auth)/couple/pin-reset/page.tsx
// F-05.11-γ — the forgot-PIN reset rail, COUPLE lane.
// Reached from the "Forgot PIN?" affordance on /couple/pin-login.
//
// ── A DECLARED DRIFT PAIR (F-04.104's class, ruled fork E1) ──────────────────────────
//   THE OTHER RAIL:  app/vendor/pin-reset/page.tsx  (F-05.11, sealed at pwa 93f624a)
// This file is a SIBLING of that one, not a shared component. The couple/vendor lanes
// already ship sibling pages three times over (pin, pin-login, onboarding), and a
// lane-parameterised component here would need config for session keys, cookie name,
// three API paths, redirect target, eyebrow copy AND the vendor-only tier/name/category
// capture that the couple verify-otp response does not carry — a lot of branching for two
// callers. So: two homes that CAN diverge, where the cure is that each one SAYS SO.
// IF YOU CHANGE THE FLOW IN ONE, CHANGE THE OTHER. No build step will catch you.
// The failure this comment exists to prevent is not divergence; it is SILENT divergence.
//
// ── THE THREE STEPS (server contract pre-witnessed at CE-40, not re-derived here) ────
//   phone → POST /api/v2/couple/auth/forgot-pin   — sends a purpose='reset' OTP as the
//           Meta AUTHENTICATION template `tdw_couple_reset_otp` on the BRIDE lane's own
//           PNID (otpSend.js). The bride line is live at +917011788380 since CE-54.
//   otp   → POST /api/v2/couple/auth/verify-otp   — purpose:'reset'; the server CLEARS
//           any lockout (auth.js:309-313) and returns {couple_id, user_id, pin_set, name,
//           access_token, refresh_token}. Forgot-PIN is the ruled ESCAPE HATCH from
//           lockout, never a warning — all copy here frames it as the way out.
//   pin   → POST /api/v2/couple/auth/set-pin      — {couple_id, pin}, PLUS the fresh
//           access_token as a Bearer.
//
// ── WHY THE BEARER ON set-pin (binding, fork G2 + CE-40 Fork B) ──────────────────────
// The couple set-pin endpoint is UNAUTHENTICATED today — bare couple_id, the comment at
// auth.js:351 confesses it. That is F-05.28, the couple twin of F-05.13, filed at CE-64
// and cured in its own coordinated sitting paired with the vendor half. This rail sends
// the token FROM BIRTH so that when the server guard lands it does not break, and so this
// rail is not a third bare caller to hunt down. Zero cost today: the server ignores it.
//
// ── F-05.11-δ IS BINDING HERE (the law this rail must not break) ─────────────────────
// The vendor rail's live-witness defect: set-pin success wrote a token-LESS session
// {id, phone, pin_set}, and the next JWT verify 401'd straight back to landing. The
// session write below is the δ shape — full and token-carrying, mirroring pin-login's
// success write exactly. Never the pre-δ shape.
//
// ── SESSION / iOS ───────────────────────────────────────────────────────────────────
// Nothing is written to storage until set-pin succeeds. Writes go to localStorage AND the
// first-party cookie (cookie-before-localStorage law, protocol §4): iOS Safari may throw
// on setItem during sign-in, and localStorage-only in new code is forbidden by name.
//
// ── W-1 ─────────────────────────────────────────────────────────────────────────────
// Every rendered string here is product copy under founder veto, recorded and ratified at
// this sitting's veto ledger (V1-V4). No agent/soul/voice surface is touched.

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '../../../../lib/api';

const SESSION_COOKIE = 'tdw_couple_session';

function readCoupleSession(): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem('couple_web_session') || localStorage.getItem('couple_session');
    if (raw) return JSON.parse(raw);
  } catch { /* fall through */ }
  try {
    const m = document.cookie.split('; ').find(r => r.startsWith(SESSION_COOKIE + '='));
    if (m) return JSON.parse(decodeURIComponent(m.split('=').slice(1).join('=')));
  } catch { /* ignore */ }
  return null;
}

function writeCoupleSession(session: Record<string, unknown>): void {
  try {
    localStorage.setItem('couple_web_session', JSON.stringify(session));
    localStorage.setItem('couple_session',     JSON.stringify(session));
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

type Step = 'phone' | 'otp' | 'pin';

export default function CouplePinResetPage() {
  const router = useRouter();

  const [step,    setStep]    = useState<Step>('phone');
  const [phone,   setPhone]   = useState('');
  const [otp,     setOtp]     = useState(['', '', '', '', '', '']);
  const [pin,     setPin]     = useState(['', '', '', '']);
  const [confirm, setConfirm] = useState(['', '', '', '']);
  const [stage,   setStage]   = useState<'pin' | 'confirm'>('pin');

  // Carried from verify-otp's response body into the set-pin step.
  const [coupleId,     setCoupleId]     = useState('');
  const [userId,       setUserId]       = useState('');
  const [accessToken,  setAccessToken]  = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  // The couple verify-otp carries `name` (auth.js:345, from users!inner(name)) but NOT
  // tier/category — that trio is the vendor response's, and the vendor rail's F-04.94
  // capture has no couple equivalent. Named so the sibling's shape is not copied blind.
  const [cName, setCName] = useState('');

  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState('');
  const [slide,   setSlide]   = useState(() => Math.floor(Math.random() * FALLBACK_SLIDES.length));
  const [slides,  setSlides]  = useState<string[]>(FALLBACK_SLIDES);

  const otpRefs     = useRef<(HTMLInputElement | null)[]>([]);
  const pinRefs     = useRef<(HTMLInputElement | null)[]>([]);
  const confirmRefs = useRef<(HTMLInputElement | null)[]>([]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2800); };

  // Prefill the phone from any existing session (arriving from pin-login). A store-less
  // direct visitor simply types it.
  useEffect(() => {
    const s = readCoupleSession();
    if (s && typeof s.phone === 'string') setPhone(s.phone);
  }, []);

  // Carousel (identical to pin / pin-login).
  useEffect(() => {
    fetch(API_BASE + '/api/v2/landing-slides')
      .then(r => r.json())
      .then(d => { if (d.slides?.length) setSlides(d.slides.map((p: { image_url: string }) => p.image_url)); })
      .catch(() => {});
    const t = setInterval(() => setSlide(p => (p + 1) % (slides.length || FALLBACK_SLIDES.length)), 4500);
    return () => clearInterval(t);
  }, [slides.length]);

  // ── Step 1: send the reset code ───────────────────────────────────────────
  const sendCode = useCallback(async () => {
    const e164 = phone.trim();
    if (e164.length < 8) { showToast('Enter your WhatsApp number.'); return; }
    setLoading(true);
    try {
      const r = await fetch(API_BASE + '/api/v2/couple/auth/forgot-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: e164 }),
      });
      const d = await r.json();
      if (d.ok) {
        setStep('otp');
        setOtp(['', '', '', '', '', '']);
        setTimeout(() => otpRefs.current[0]?.focus(), 120);
      } else {
        showToast(d.error || 'Could not send reset code. Try again.');
      }
    } catch { showToast('Network error. Try again.'); }
    finally { setLoading(false); }
  }, [phone]);

  // ── Step 2: verify the reset OTP ──────────────────────────────────────────
  const verifyCode = useCallback(async (otpStr: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const r = await fetch(API_BASE + '/api/v2/couple/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), otp: otpStr, purpose: 'reset' }),
      });
      const d = await r.json();
      if (d.ok && d.couple_id) {
        setCoupleId(d.couple_id);
        setUserId(d.user_id || '');
        setAccessToken(d.access_token || '');
        setRefreshToken(d.refresh_token || '');
        setCName(d.name || '');
        setStep('pin');
        setStage('pin');
        setPin(['', '', '', '']);
        setConfirm(['', '', '', '']);
        setTimeout(() => pinRefs.current[0]?.focus(), 120);
      } else {
        setShaking(true); setTimeout(() => setShaking(false), 400);
        showToast(d.error || "That code didn’t work. Try again.");
        setOtp(['', '', '', '', '', '']);
        setTimeout(() => otpRefs.current[0]?.focus(), 80);
      }
    } catch { showToast('Network error. Try again.'); }
    finally { setLoading(false); }
  }, [phone, loading]);

  // ── Step 3: set the new PIN ───────────────────────────────────────────────
  const submitPin = useCallback(async () => {
    const pinStr     = pin.join('');
    const confirmStr = confirm.join('');
    if (pinStr.length < 4 || confirmStr.length < 4) return;
    if (pinStr !== confirmStr) {
      setShaking(true); setTimeout(() => setShaking(false), 400);
      showToast("PINs don’t match — try again");
      setConfirm(['', '', '', '']); setStage('pin'); setPin(['', '', '', '']);
      setTimeout(() => pinRefs.current[0]?.focus(), 80);
      return;
    }
    setLoading(true);
    try {
      const r = await fetch(API_BASE + '/api/v2/couple/auth/set-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // F-05.28 forward-compat — see the header. Ignored by the server today.
          'Authorization': 'Bearer ' + accessToken,
        },
        body: JSON.stringify({ couple_id: coupleId, pin: pinStr }),
      });
      const d = await r.json();
      if (d.ok) {
        // F-05.11-δ: persist the auth token from verify-otp into the session so the next
        // JWT verify passes. WITHOUT access_token here the session is token-less, /frost
        // 401s, and the bride bounces to landing — the vendor lane's live-witness defect,
        // which must not be re-earned on this lane. Standalone token keys mirrored too,
        // exactly as pin-login does.
        try { localStorage.setItem('access_token', accessToken); } catch {}
        try { localStorage.setItem('refresh_token', refreshToken || accessToken); } catch {}
        const existing = readCoupleSession() || {};
        const updated = {
          ...existing,
          id:            coupleId,
          userId:        userId || existing.userId,
          user_id:       userId || existing.user_id,
          phone:         phone.trim(),
          name:          cName || existing.name || null,
          access_token:  accessToken,
          refresh_token: refreshToken || accessToken,
          pin_set:       true,
          _v:            2,
        };
        writeCoupleSession(updated);
        router.replace('/frost');
      } else {
        showToast(d.error || 'Could not set PIN. Try again.');
      }
    } catch { showToast('Network error. Try again.'); }
    finally { setLoading(false); }
  }, [pin, confirm, coupleId, userId, accessToken, refreshToken, cName, phone, router]);

  // Auto-submit OTP when all six are filled.
  useEffect(() => {
    const s = otp.join('');
    if (step === 'otp' && s.length === 6) verifyCode(s);
  }, [otp, step, verifyCode]);

  // Auto-submit PIN when confirm is full.
  useEffect(() => {
    if (step === 'pin' && stage === 'confirm' && confirm.every(d => d)) submitPin();
  }, [confirm, stage, step, submitPin]);

  // ── Input handlers ────────────────────────────────────────────────────────
  const handleOtpInput = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const digits = val.replace(/\D/g, '');
    if (digits.length > 1) {
      const n = [...otp];
      for (let i = 0; i < 6; i++) n[i] = digits[i] || '';
      setOtp(n);
      otpRefs.current[Math.min(digits.length, 5)]?.focus();
      return;
    }
    const v = digits.slice(-1);
    setOtp(prev => { const n = [...prev]; n[idx] = v; return n; });
    if (v && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handlePinInput = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const v = val.slice(-1);
    setPin(prev => { const n = [...prev]; n[idx] = v; return n; });
    if (v && idx < 3) pinRefs.current[idx + 1]?.focus();
    if (v && idx === 3) {
      setTimeout(() => { setStage('confirm'); setTimeout(() => confirmRefs.current[0]?.focus(), 60); }, 60);
    }
  };

  const handleConfirmInput = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const v = val.slice(-1);
    setConfirm(prev => { const n = [...prev]; n[idx] = v; return n; });
    if (v && idx < 3) confirmRefs.current[idx + 1]?.focus();
  };

  const handleBackspace = (
    idx: number, val: string, max: number,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    if (val === '' && idx > 0) {
      setter(prev => { const n = [...prev]; n[idx - 1] = ''; return n; });
      refs.current[idx - 1]?.focus();
    }
  };

  const otpInputStyle: React.CSSProperties = {
    width: 40, height: 54, background: 'transparent', border: 'none', outline: 'none',
    borderBottom: '2px solid ' + GOLD,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400, fontSize: 24, color: '#F8F7F5', textAlign: 'center',
    touchAction: 'manipulation', caretColor: GOLD,
  };
  const pinInputStyle: React.CSSProperties = {
    width: 48, height: 58, background: 'transparent', border: 'none', outline: 'none',
    borderBottom: '2px solid ' + GOLD,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400, fontSize: 26, color: '#F8F7F5', textAlign: 'center',
    touchAction: 'manipulation', caretColor: GOLD,
  };
  const phoneInputStyle: React.CSSProperties = {
    width: '100%', height: 54, background: 'transparent', border: 'none', outline: 'none',
    borderBottom: '2px solid ' + GOLD,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400, fontSize: 20, color: '#F8F7F5', textAlign: 'center',
    letterSpacing: '0.04em', touchAction: 'manipulation', caretColor: GOLD,
  };

  const heading =
    step === 'phone' ? 'Reset your PIN.'
    : step === 'otp' ? 'Enter the code.'
    : stage === 'pin' ? 'Set a new PIN.'
    : 'Confirm your PIN.';

  const subtext =
    step === 'phone' ? "We’ll send a reset code to your WhatsApp."
    : step === 'otp' ? 'Sent to your WhatsApp. Valid for 5 minutes.'
    : stage === 'pin' ? 'Four digits. Quick access every time.'
    : 'Enter the same PIN again.';

  const loadingLabel =
    step === 'phone' ? 'Sending…'
    : step === 'otp' ? 'Verifying…'
    : 'Setting PIN…';

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
        <div style={{ position:'fixed',top:24,left:'50%',transform:'translateX(-50%)',background:'rgba(201,168,76,0.12)',backdropFilter:'blur(12px)',border:'0.5px solid rgba(201,168,76,0.3)',color:GOLD,fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:13,padding:'10px 20px',borderRadius:100,zIndex:9999,whiteSpace:'nowrap',animation:'slideDown 280ms cubic-bezier(0.22,1,0.36,1)' }}>{toast}</div>
      )}

      <div style={{ position:'fixed',inset:0,background:'#0C0A09',overflow:'hidden' }}>
        {slides.map((src, i) => (
          <div key={i} style={{ position:'absolute',inset:0,backgroundImage:'url(' + src + ')',backgroundSize:'cover',backgroundPosition:'center',opacity: i === slide ? 0.55 : 0,transition:'opacity 1200ms ease' }} />
        ))}
        <div style={{ position:'absolute',inset:0,background:'rgba(12,10,9,0.45)' }} />
        <div style={{ position:'absolute',bottom:0,left:0,right:0,animation:'pinFadeIn 400ms cubic-bezier(0.22,1,0.36,1)' }}>
          <div style={{ background:'rgba(12,10,9,0.3)',backdropFilter:'blur(28px)',WebkitBackdropFilter:'blur(28px)',borderTop:'0.5px solid rgba(255,255,255,0.1)',borderRadius:'20px 20px 0 0',padding:'28px 32px calc(env(safe-area-inset-bottom, 16px) + 32px)' }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontWeight:300,fontSize:15,color:'rgba(248,247,245,0.5)',margin:'0 0 2px' }}>The Dream Wedding</p>
            <p style={{ fontFamily:"'Jost',sans-serif",fontWeight:200,fontSize:6,letterSpacing:'0.32em',textTransform:'uppercase',color:GOLD,margin:'0 0 24px' }}>DREAMER PORTAL</p>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize:26,color:'#F8F7F5',margin:'0 0 4px',lineHeight:1.15 }}>{heading}</p>
            <p style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:13,color:'rgba(248,247,245,0.4)',margin:'0 0 28px' }}>{subtext}</p>

            {step === 'phone' && (
              <>
                <div style={{ marginBottom: 28 }}>
                  <input
                    type="tel" inputMode="tel" value={phone}
                    placeholder="WhatsApp number"
                    onChange={e => setPhone(e.target.value.replace(/[^\d+]/g, ''))}
                    onKeyDown={e => { if (e.key === 'Enter') sendCode(); }}
                    style={phoneInputStyle} disabled={loading} />
                </div>
                <p onClick={() => { if (!loading) sendCode(); }}
                  style={{ fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:12,letterSpacing:'0.14em',textTransform:'uppercase',color: loading ? 'rgba(201,168,76,0.4)' : GOLD,textAlign:'center',cursor:'pointer',touchAction:'manipulation',padding:'6px 0',marginBottom:8 }}
                >Send reset code →</p>
              </>
            )}

            {step === 'otp' && (
              <>
                <div style={{ display:'flex',justifyContent:'center',gap:12,marginBottom:28,animation: shaking ? 'pinShake 320ms cubic-bezier(0.22,1,0.36,1)' : 'none' }}>
                  {otp.map((d, i) => (
                    <input key={i} ref={el => { otpRefs.current[i] = el; }}
                      type="tel" inputMode="numeric" maxLength={1} value={d}
                      autoComplete="one-time-code"
                      onChange={e => handleOtpInput(i, e.target.value)}
                      onKeyDown={e => { if (e.key === 'Backspace') handleBackspace(i, d, 6, otpRefs, setOtp); }}
                      style={otpInputStyle} disabled={loading} />
                  ))}
                </div>
                <p onClick={() => { if (!loading) sendCode(); }}
                  style={{ fontFamily:"'Jost',sans-serif",fontWeight:200,fontSize:9,letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(248,247,245,0.35)',textAlign:'center',cursor:'pointer',touchAction:'manipulation',marginBottom:8 }}
                >Resend code</p>
              </>
            )}

            {step === 'pin' && stage === 'pin' && (
              <div style={{ display:'flex',justifyContent:'center',gap:16,marginBottom:32 }}>
                {pin.map((d, i) => (
                  <input key={i} ref={el => { pinRefs.current[i] = el; }}
                    type="tel" maxLength={1} value={d}
                    onChange={e => handlePinInput(i, e.target.value)}
                    onKeyDown={e => { if (e.key === 'Backspace') handleBackspace(i, d, 4, pinRefs, setPin); }}
                    style={pinInputStyle} disabled={loading} />
                ))}
              </div>
            )}

            {step === 'pin' && stage === 'confirm' && (
              <div style={{ display:'flex',justifyContent:'center',gap:16,marginBottom:32,animation: shaking ? 'pinShake 320ms cubic-bezier(0.22,1,0.36,1)' : 'none' }}>
                {confirm.map((d, i) => (
                  <input key={i} ref={el => { confirmRefs.current[i] = el; }}
                    type="tel" maxLength={1} value={d}
                    onChange={e => handleConfirmInput(i, e.target.value)}
                    onKeyDown={e => { if (e.key === 'Backspace') handleBackspace(i, d, 4, confirmRefs, setConfirm); }}
                    style={pinInputStyle} disabled={loading} />
                ))}
              </div>
            )}

            {loading && (
              <p style={{ fontFamily:"'Jost',sans-serif",fontWeight:200,fontSize:9,letterSpacing:'0.2em',textTransform:'uppercase',color:GOLD,textAlign:'center',marginBottom:16 }}>{loadingLabel}</p>
            )}

            <p onClick={() => { if (!loading) router.replace('/couple/pin-login'); }}
              style={{ fontFamily:"'Jost',sans-serif",fontWeight:200,fontSize:8,letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(248,247,245,0.25)',textAlign:'center',cursor:'pointer',touchAction:'manipulation',marginTop:4 }}
            >Back to PIN entry</p>
          </div>
        </div>
      </div>
    </>
  );
}
