'use client';
// app/vendor/login/page.tsx
// Self-contained vendor login — no cross-domain handoff required.
// Flow:
//   PHONE → OTP → PIN        (returning user — PIN already set)
//   PHONE → OTP → SET_PIN    (first web login — set a new PIN)

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import { getVendorSession, setVendorSession } from '@/lib/vendor/session';
import { sendOtp, verifyOtp, fetchMe } from '@/lib/vendor/api/vendor';
import { postJson } from '@/lib/vendor/api/_base';

const API = 'https://dream-os-production.up.railway.app';

const D = {
  bg: '#111111', card: '#1C1C1C',
  border: 'rgba(226,222,216,0.1)',
  muted: 'rgba(248,247,245,0.45)',
  cream: '#F8F7F5', gold: '#C9A84C', red: '#E07070',
};
const F = {
  display: 'var(--font-cormorant), Georgia, serif',
  label:   'var(--font-jost), system-ui, sans-serif',
  body:    'var(--font-dm-sans), system-ui, sans-serif',
};

type Step = 'PHONE' | 'OTP' | 'PIN' | 'SET_PIN' | 'CONFIRM_PIN';

interface PendingSession {
  vendor_id:     string;
  user_id:       string;
  access_token:  string;
  refresh_token: string;
  pin_set:       boolean;
}

export default function LoginPage() {
  const router = useRouter();

  const [step,       setStep]       = useState<Step>('PHONE');
  const [phone,      setPhone]      = useState('+91');
  const [otp,        setOtp]        = useState('');
  const [pin,        setPin]        = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [error,      setError]      = useState<string | null>(null);
  const [busy,       setBusy]       = useState(false);
  const [shake,      setShake]      = useState(false);

  const pending  = useRef<PendingSession | null>(null);
  const pinRefs  = useRef<(HTMLInputElement | null)[]>([]);
  const confRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { if (getVendorSession()) router.replace('/vendor'); }, [router]);

  useEffect(() => {
    if (step === 'PIN' || step === 'SET_PIN') {
      setPin(['', '', '', '']);
      setTimeout(() => pinRefs.current[0]?.focus(), 100);
    }
    if (step === 'CONFIRM_PIN') {
      setConfirmPin(['', '', '', '']);
      setTimeout(() => confRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  // ── Step 1: send OTP ──────────────────────────────────────────────────
  async function handlePhone() {
    const p = phone.trim();
    if (!/^\+[0-9]{8,15}$/.test(p)) {
      setError('Enter your number with country code — e.g. +918757788550');
      return;
    }
    setError(null); setBusy(true);
    try {
      const res = await sendOtp(p);
      if (!res.ok) { setError(res.error ?? 'Could not send OTP. Try again.'); return; }
      setStep('OTP');
    } catch { setError('Could not reach the server. Try again.'); }
    finally { setBusy(false); }
  }

  // ── Step 2: verify OTP → decide PIN or SET_PIN ───────────────────────
  async function handleOtp() {
    const code = otp.trim();
    if (!/^\d{6}$/.test(code)) { setError('Enter the 6-digit code from WhatsApp.'); return; }
    setError(null); setBusy(true);
    try {
      const res = await verifyOtp(phone.trim(), code);
      if (!res.ok || !res.access_token) {
        setError(res.error ?? 'Incorrect code. Try again.');
        return;
      }
      pending.current = {
        vendor_id:    res.vendor_id!,
        user_id:      res.user_id!,
        access_token: res.access_token,
        refresh_token: res.refresh_token ?? '',
        pin_set:      !!res.pin_set,
      };
      // Route to PIN entry or PIN setup
      setStep(res.pin_set ? 'PIN' : 'SET_PIN');
    } catch { setError('Could not reach the server. Try again.'); }
    finally { setBusy(false); }
  }

  // ── Finalise session after successful PIN ─────────────────────────────
  async function finaliseSession(access_token: string, refresh_token: string) {
    const p = pending.current!;
    // Fetch full vendor profile
    try {
      // Temporarily set session so fetchMe can auth
      setVendorSession({
        id: p.vendor_id, user_id: p.user_id, name: null,
        phone: phone.trim(), tier: 'essential',
        access_token, refresh_token,
      });
      const me = await fetchMe();
      setVendorSession({
        id:    p.vendor_id,
        user_id: p.user_id,
        name:  me.ok ? (me.vendor.name ?? null) : null,
        phone: phone.trim(),
        tier:  me.ok ? (me.vendor.tier ?? 'essential') : 'essential',
        access_token,
        refresh_token,
      });
    } catch {
      setVendorSession({
        id: p.vendor_id, user_id: p.user_id, name: null,
        phone: phone.trim(), tier: 'essential',
        access_token, refresh_token,
      });
    }
    router.replace('/vendor');
  }

  // ── Step 3a: enter existing PIN ───────────────────────────────────────
  const handlePin = useCallback(async (pinStr: string) => {
    if (busy) return;
    setBusy(true); setError(null);
    try {
      const res = await postJson<{ ok: boolean; access_token?: string; refresh_token?: string; error?: string; reason?: string }>(
        '/api/v2/vendor/auth/pin-login',
        { phone: phone.trim(), pin: pinStr }
      );
      if (!res.ok) {
        triggerShake();
        setPin(['', '', '', '']);
        pinRefs.current[0]?.focus();
        if (res.reason === 'pin_locked') {
          setError(res.error ?? 'Too many attempts. Use Forgot PIN.');
        } else {
          setError(res.error ?? 'Incorrect PIN.');
        }
        return;
      }
      await finaliseSession(res.access_token!, res.refresh_token!);
    } catch { setError('Could not reach server. Try again.'); triggerShake(); }
    finally { setBusy(false); }
  }, [busy, phone]);

  // ── Step 3b: set new PIN ──────────────────────────────────────────────
  const handleSetPin = useCallback((pinStr: string) => {
    setStep('CONFIRM_PIN');
  }, []);

  // ── Step 3c: confirm new PIN ──────────────────────────────────────────
  const handleConfirmPin = useCallback(async (confirmStr: string) => {
    const pinStr = pin.join('');
    if (confirmStr !== pinStr) {
      triggerShake();
      setConfirmPin(['', '', '', '']);
      confRefs.current[0]?.focus();
      setError("PINs don't match — try again.");
      setStep('SET_PIN');
      return;
    }
    if (busy) return;
    setBusy(true); setError(null);
    try {
      const res = await postJson<{ ok: boolean; error?: string }>(
        '/api/v2/vendor/auth/set-pin',
        { vendor_id: pending.current!.vendor_id, pin: pinStr }
      );
      if (!res.ok) { setError(res.error ?? 'Could not set PIN. Try again.'); return; }
      await finaliseSession(pending.current!.access_token, pending.current!.refresh_token);
    } catch { setError('Could not reach server. Try again.'); }
    finally { setBusy(false); }
  }, [pin, busy, phone]);

  // ── PIN input handler ─────────────────────────────────────────────────
  function handlePinInput(
    idx: number, val: string,
    arr: string[], setArr: (a: string[]) => void,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>,
    onComplete: (s: string) => void
  ) {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...arr]; next[idx] = digit;
    setArr(next);
    if (digit && idx < 3) refs.current[idx + 1]?.focus();
    if (digit && idx === 3) {
      const full = next.join('');
      if (full.length === 4) setTimeout(() => onComplete(full), 80);
    }
  }

  function handlePinBackspace(
    idx: number, val: string,
    arr: string[], setArr: (a: string[]) => void,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) {
    if (!val && idx > 0) {
      const next = [...arr]; next[idx - 1] = '';
      setArr(next);
      refs.current[idx - 1]?.focus();
    }
  }

  // ── PIN dot input UI ──────────────────────────────────────────────────
  function PinInputs({
    values, setValues, refs, onComplete, shake: doShake,
  }: {
    values: string[];
    setValues: (a: string[]) => void;
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>;
    onComplete: (s: string) => void;
    shake?: boolean;
  }) {
    return (
      <div style={{
        display: 'flex', gap: 16, justifyContent: 'center',
        animation: doShake ? 'pinShake 320ms ease' : 'none',
      }}>
        {values.map((v, i) => (
          <input
            key={i}
            ref={el => { refs.current[i] = el; }}
            type="tel" maxLength={1} value={v}
            onChange={e => handlePinInput(i, e.target.value, values, setValues, refs, onComplete)}
            onKeyDown={e => {
              if (e.key === 'Backspace') handlePinBackspace(i, v, values, setValues, refs);
            }}
            style={{
              width: 56, height: 64, background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${v ? D.gold : D.border}`, borderRadius: 14,
              outline: 'none', fontFamily: F.body, fontWeight: 400,
              fontSize: 28, color: D.cream, textAlign: 'center',
              caretColor: D.gold,
            }}
            disabled={busy}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes pinShake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-5px)}
          80%{transform:translateX(5px)}
        }
      `}</style>
      <main style={{
        minHeight: '100dvh',
        background: 'linear-gradient(160deg, #0E0D0B 0%, #111111 45%, #0D0E0B 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* Wordmark */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: F.label, fontWeight: 200, fontSize: 9, color: D.gold, letterSpacing: '0.4em', textTransform: 'uppercase' }}>
              thedreamai · wedding
            </span>
            <span style={{ fontFamily: F.display, fontWeight: 300, fontSize: 28, color: D.cream, textAlign: 'center' }}>
              {step === 'PHONE'       && 'Sign in'}
              {step === 'OTP'         && 'Check WhatsApp'}
              {step === 'PIN'         && 'Enter your PIN'}
              {step === 'SET_PIN'     && 'Create a PIN'}
              {step === 'CONFIRM_PIN' && 'Confirm your PIN'}
            </span>
          </div>

          {/* PHONE */}
          {step === 'PHONE' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.muted, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                Phone number
              </label>
              <input
                type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !busy && handlePhone()}
                placeholder="+918757788550" autoFocus
                style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)', border: `1px solid ${D.border}`, borderRadius: 14, outline: 'none', fontFamily: F.body, fontWeight: 400, fontSize: 16, color: D.cream, caretColor: D.gold }}
              />
              <Btn onClick={handlePhone} busy={busy}>{busy ? 'Sending…' : 'Send WhatsApp code'}</Btn>
            </div>
          )}

          {/* OTP */}
          {step === 'OTP' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 14, color: D.muted, lineHeight: 1.6, textAlign: 'center', margin: 0 }}>
                Code sent to <span style={{ color: D.cream }}>{phone}</span> on WhatsApp
              </p>
              <input
                type="text" inputMode="numeric" autoComplete="one-time-code"
                value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyDown={e => e.key === 'Enter' && !busy && handleOtp()}
                placeholder="000000" autoFocus
                style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)', border: `1px solid ${D.border}`, borderRadius: 14, outline: 'none', fontFamily: F.body, fontWeight: 400, fontSize: 24, color: D.cream, caretColor: D.gold, letterSpacing: '0.3em', textAlign: 'center' }}
              />
              <Btn onClick={handleOtp} busy={busy}>{busy ? 'Verifying…' : 'Verify code'}</Btn>
              <button type="button" onClick={() => { setStep('PHONE'); setOtp(''); setError(null); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.muted, letterSpacing: '0.2em', textTransform: 'uppercase', alignSelf: 'center', marginTop: 4 }}>
                Use a different number
              </button>
            </div>
          )}

          {/* PIN — returning user */}
          {step === 'PIN' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 13, color: D.muted, textAlign: 'center', margin: 0 }}>
                Enter your 4-digit PIN
              </p>
              <PinInputs
                values={pin} setValues={setPin}
                refs={pinRefs} onComplete={handlePin} shake={shake}
              />
              <button type="button"
                onClick={() => { setStep('OTP'); setOtp(''); setError(null); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.muted, letterSpacing: '0.2em', textTransform: 'uppercase', alignSelf: 'center' }}>
                Forgot PIN? Send new code
              </button>
            </div>
          )}

          {/* SET_PIN — first time */}
          {step === 'SET_PIN' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 13, color: D.muted, textAlign: 'center', margin: 0 }}>
                Choose a 4-digit PIN for quick sign-in
              </p>
              <PinInputs
                values={pin} setValues={setPin}
                refs={pinRefs} onComplete={handleSetPin} shake={shake}
              />
            </div>
          )}

          {/* CONFIRM_PIN */}
          {step === 'CONFIRM_PIN' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 13, color: D.muted, textAlign: 'center', margin: 0 }}>
                Enter your PIN again to confirm
              </p>
              <PinInputs
                values={confirmPin} setValues={setConfirmPin}
                refs={confRefs} onComplete={handleConfirmPin} shake={shake}
              />
            </div>
          )}

          {error && (
            <p style={{ fontFamily: F.body, fontSize: 13, color: D.red, textAlign: 'center', margin: 0 }}>
              {error}
            </p>
          )}

        </div>
      </main>
    </>
  );
}

function Btn({ onClick, busy, children }: { onClick: () => void | Promise<void>; busy: boolean; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} disabled={busy} style={{
      padding: '14px 16px',
      background: busy ? 'rgba(201,168,76,0.4)' : '#C9A84C',
      border: 'none', borderRadius: 14, cursor: busy ? 'default' : 'pointer',
      fontFamily: 'var(--font-jost), system-ui, sans-serif', fontWeight: 400, fontSize: 11,
      color: busy ? 'rgba(17,17,17,0.6)' : '#111111', letterSpacing: '0.25em', textTransform: 'uppercase',
    }}>{children}</button>
  );
}
