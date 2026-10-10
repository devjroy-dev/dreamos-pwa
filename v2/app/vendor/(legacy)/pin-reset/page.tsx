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
import WorksBackdrop from '@/app/works/WorksBackdrop';

// CE-47 LAND-1 package 2 (the founder, 10 Oct 2026): this screen wears tdw.works's look. The works wall behind a
// frosted-glass panel, headed by the mark (TDW, tdw.works under it), in tdw.works's fonts and colours
// (app/works/WorksBackdrop.tsx, the one home tdw.works draws from; app/works/glass.css). Only the look moved: the
// steps, the fetches, the session reads and writes, the checks and the words are the same code. The one door that
// moved is the chair's ruling: where a check sent her to "/", the couples' front page, it now sends her to the vendor
// sign-in (VENDOR_SIGNIN); the checks themselves are unchanged.
import { forgotPin, verifyResetOtp, setPinWithToken } from '@/v2/lib/vendor/api/vendor';

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

  const otpRefs     = useRef<(HTMLInputElement | null)[]>([]);
  const pinRefs     = useRef<(HTMLInputElement | null)[]>([]);
  const confirmRefs = useRef<(HTMLInputElement | null)[]>([]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2800); };

  // Prefill the phone from any existing session (arriving from pin-login).
  useEffect(() => {
    const s = readVendorSession();
    if (s && typeof s.phone === 'string') setPhone(s.phone);
  }, []);


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
        showToast(res.error || "That code didn’t work. Try again.");
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
      {toast && <div className="wg-toast" role="status">{toast}</div>}
      <WorksBackdrop label="Reset your PIN">
        <p className="wg-h">{heading}</p>
        <p className="wg-sub">{subtext}</p>

        {step === 'phone' && (
          <>
            <div>
              <input
                type="tel" inputMode="tel" value={phone}
                placeholder="WhatsApp number"
                onChange={e => setPhone(e.target.value.replace(/[^\d+]/g, ''))}
                onKeyDown={e => { if (e.key === 'Enter') sendCode(); }}
                aria-label="WhatsApp number"
                className="wg-in wg-phone" disabled={loading} />
            </div>
            <p onClick={() => { if (!loading) sendCode(); }}
              className="wg-go" aria-disabled={loading}
            >Send reset code →</p>
          </>
        )}

        {step === 'otp' && (
          <>
            <div className={'wg-digits' + (shaking ? ' wg-shake' : '')}>
              {otp.map((d, i) => (
                <input key={i} ref={el => { otpRefs.current[i] = el; }}
                  type="tel" inputMode="numeric" maxLength={1} value={d}
                  autoComplete="one-time-code"
                  aria-label={'Code digit ' + (i + 1)}
                  onChange={e => handleOtpInput(i, e.target.value)}
                  onKeyDown={e => { if (e.key === 'Backspace') handleBackspace(i, d, 6, otpRefs, setOtp); }}
                  className="wg-otp" disabled={loading} />
              ))}
            </div>
            <p onClick={() => { if (!loading) sendCode(); }}
              className="wg-link"
            >Resend code</p>
          </>
        )}

        {step === 'pin' && stage === 'pin' && (
          <div className="wg-digits">
            {pin.map((d, i) => (
              <input key={i} ref={el => { pinRefs.current[i] = el; }}
                type="tel" maxLength={1} value={d}
                aria-label={'PIN digit ' + (i + 1)}
                onChange={e => handlePinInput(i, e.target.value)}
                onKeyDown={e => { if (e.key === 'Backspace') handleBackspace(i, d, 4, pinRefs, setPin); }}
                className="wg-otp wg-pin" disabled={loading} />
            ))}
          </div>
        )}

        {step === 'pin' && stage === 'confirm' && (
          <div className={'wg-digits' + (shaking ? ' wg-shake' : '')}>
            {confirm.map((d, i) => (
              <input key={i} ref={el => { confirmRefs.current[i] = el; }}
                type="tel" maxLength={1} value={d}
                aria-label={'Confirm PIN digit ' + (i + 1)}
                onChange={e => handleConfirmInput(i, e.target.value)}
                onKeyDown={e => { if (e.key === 'Backspace') handleBackspace(i, d, 4, confirmRefs, setConfirm); }}
                className="wg-otp wg-pin" disabled={loading} />
            ))}
          </div>
        )}

        {loading && (
          <p className="wg-note">{loadingLabel}</p>
        )}

        <p onClick={() => { if (!loading) router.replace('/vendor/pin-login'); }}
          className="wg-link"
        >Back to PIN entry</p>
      </WorksBackdrop>
    </>
  );
}
