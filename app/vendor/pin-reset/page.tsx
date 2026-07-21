'use client';
// app/vendor/pin-reset/page.tsx
// F-05.11 — the forgot-PIN reset rail (vendor lane).
// Reached from the "Forgot PIN?" affordance on /vendor/pin-login.
//
// Three steps, one self-contained screen (same chrome as pin / pin-login):
//   phone → forgotPin(phone)          — server sends a purpose='reset' OTP (Meta live)
//   otp   → verifyResetOtp(phone,otp) — purpose:'reset'; server CLEARS any lockout
//           (auth.js:335) and returns {vendor_id, access_token, ...}
//   pin   → setPinWithToken(...)      — sends the fresh access_token as a Bearer
//           (F-05.13 forward-compat, Fork B); server ignores it today
//
// On set-pin success (Fork D): write the normal {id, pin_set:true} vendor session
// and replace('/vendor') — phone possession is proven and the new PIN double-entered,
// so pin-login re-entry would be friction without security (cookie+tokens minted).
//
// Session: nothing is written to localStorage until set-pin succeeds. The phone is
// prefilled from any existing session (present when arriving from pin-login) purely
// as a convenience; a store-less direct visitor simply types it.
//
// W-1: all rendered strings here are product copy under founder veto (see the veto
// list shipped with this delta). No agent/soul/voice surface is touched.

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/lib/api';
import { forgotPin, verifyResetOtp, setPinWithToken } from '@/lib/vendor/api/vendor';

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

type Step = 'phone' | 'otp' | 'pin';

export default function VendorPinResetPage() {
  const router = useRouter();

  const [step,    setStep]    = useState<Step>('phone');
  const [phone,   setPhone]   = useState('');
  const [otp,     setOtp]     = useState(['', '', '', '', '', '']);
  const [pin,     setPin]     = useState(['', '', '', '']);
  const [confirm, setConfirm] = useState(['', '', '', '']);
  const [stage,   setStage]   = useState<'pin' | 'confirm'>('pin');

  // Carried from verify-otp's response body into the set-pin step.
  const [vendorId,     setVendorId]     = useState('');
  const [userId,       setUserId]       = useState('');
  const [accessToken,  setAccessToken]  = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  // F-04.94 CURE 2b: the reset rail hits /verify-otp (purpose:'reset'), whose
  // response carries tier/name/category (auth.js:369-371). Capture them here so
  // the session write below restores the real feature flags instead of defaulting
  // a Prestige vendor down to 'essential'. (pin-login's endpoint does NOT carry
  // these — see F-04.96; that path is unfixable in the frontend.)
  const [tier,     setTier]     = useState('');
  const [vName,    setVName]    = useState('');
  const [category, setCategory] = useState('');

  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState('');
  const [slide,   setSlide]   = useState(() => Math.floor(Math.random() * FALLBACK_SLIDES.length));
  const [slides,  setSlides]  = useState<string[]>(FALLBACK_SLIDES);

  const otpRefs     = useRef<(HTMLInputElement | null)[]>([]);
  const pinRefs     = useRef<(HTMLInputElement | null)[]>([]);
  const confirmRefs = useRef<(HTMLInputElement | null)[]>([]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2800); };

  // Prefill the phone from any existing session (arriving from pin-login).
  useEffect(() => {
    const s = readVendorSession();
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
      const res = await forgotPin(e164);
      if (res.ok) {
        setStep('otp');
        setOtp(['', '', '', '', '', '']);
        setTimeout(() => otpRefs.current[0]?.focus(), 120);
      } else {
        showToast(res.error || 'Could not send reset code. Try again.');
      }
    } catch { showToast('Network error. Try again.'); }
    finally { setLoading(false); }
  }, [phone]);

  // ── Step 2: verify the reset OTP ──────────────────────────────────────────
  const verifyCode = useCallback(async (otpStr: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await verifyResetOtp(phone.trim(), otpStr);
      if (res.ok && res.vendor_id) {
        setVendorId(res.vendor_id);
        setUserId(res.user_id || '');
        setAccessToken(res.access_token || '');
        setRefreshToken(res.refresh_token || '');
        setTier(res.tier || '');
        setVName(res.name || '');
        setCategory(res.category || '');
        setStep('pin');
        setStage('pin');
        setPin(['', '', '', '']);
        setConfirm(['', '', '', '']);
        setTimeout(() => pinRefs.current[0]?.focus(), 120);
      } else {
        setShaking(true); setTimeout(() => setShaking(false), 400);
        showToast(res.error || "That code didn't work. Try again.");
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
      showToast("PINs don't match — try again");
      setConfirm(['', '', '', '']); setStage('pin'); setPin(['', '', '', '']);
      setTimeout(() => pinRefs.current[0]?.focus(), 80);
      return;
    }
    setLoading(true);
    try {
      const res = await setPinWithToken(vendorId, pinStr, accessToken);
      if (res.ok) {
        // F-05.11-δ: persist the auth token from verify-otp into the session so
        // /vendor's JWT verify (app/vendor/page.tsx:415) passes. Mirrors pin-login's
        // success write exactly — WITHOUT access_token here, getVendorSession() yields
        // a token-less session, /vendor 401s on verify, and bounces to landing (the
        // live-witness defect). Also mirror the standalone token keys, as pin-login does.
        try { localStorage.setItem('access_token', accessToken); } catch {}
        try { localStorage.setItem('refresh_token', refreshToken || accessToken); } catch {}
        const existing = readVendorSession() || {};
        const updated = {
          ...existing,
          id:            vendorId,
          user_id:       userId || existing.user_id,
          phone:         phone.trim(),
          name:          vName    || existing.name     || null,
          tier:          tier     || existing.tier     || 'essential',
          category:      category || existing.category || null,
          access_token:  accessToken,
          refresh_token: refreshToken || accessToken,
          pin_set:       true,
          _v:            2,
        };
        writeVendorSession(updated);
        router.replace('/vendor');
      } else {
        showToast(res.error || 'Could not set your PIN. Try again.');
      }
    } catch { showToast('Network error. Try again.'); }
    finally { setLoading(false); }
  }, [pin, confirm, vendorId, userId, accessToken, refreshToken, phone, router]);

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
    step === 'phone' ? "We'll send a reset code to your WhatsApp."
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
            <p style={{ fontFamily:"'Jost',sans-serif",fontWeight:200,fontSize:6,letterSpacing:'0.32em',textTransform:'uppercase',color:GOLD,margin:'0 0 24px' }}>MAKER PORTAL</p>
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

            <p onClick={() => { if (!loading) router.replace('/vendor/pin-login'); }}
              style={{ fontFamily:"'Jost',sans-serif",fontWeight:200,fontSize:8,letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(248,247,245,0.25)',textAlign:'center',cursor:'pointer',touchAction:'manipulation',marginTop:4 }}
            >Back to PIN entry</p>
          </div>
        </div>
      </div>
    </>
  );
}
