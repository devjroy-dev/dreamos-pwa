'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getVendorSession, setVendorSession } from '@/lib/vendor/session';
import { sendOtp, verifyOtp, fetchMe } from '@/lib/vendor/api/vendor';

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

type Step = 'PHONE' | 'OTP';

export default function LoginPage() {
  const router = useRouter();
  const [step,  setStep]  = useState<Step>('PHONE');
  const [phone, setPhone] = useState('+91');
  const [otp,   setOtp]   = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy,  setBusy]  = useState(false);

  useEffect(() => { if (getVendorSession()) router.replace('/vendor'); }, [router]);

  async function handlePhone() {
    const p = phone.trim();
    if (!/^\+[0-9]{8,15}$/.test(p)) { setError('Enter your number with country code — e.g. +918757788550'); return; }
    setError(null); setBusy(true);
    try {
      const res = await sendOtp(p);
      if (!res.ok) { setError(res.error ?? 'Could not send OTP. Try again.'); return; }
      setStep('OTP');
    } catch { setError('Could not reach the server. Try again.'); }
    finally { setBusy(false); }
  }

  async function handleOtp() {
    const code = otp.trim();
    if (!/^\d{6}$/.test(code)) { setError('Enter the 6-digit code from WhatsApp.'); return; }
    setError(null); setBusy(true);
    try {
      const res = await verifyOtp(phone.trim(), code);
      if (!res.ok || !res.access_token) { setError(res.error ?? 'Incorrect code. Try again.'); return; }
      // Save temp session so fetchMe can use the token via fetchWithAuth
      setVendorSession({
        id: res.vendor_id!, user_id: res.user_id!, name: null,
        phone: phone.trim(), tier: 'essential',
        access_token: res.access_token, refresh_token: res.refresh_token ?? '',
      });
      // Fetch real vendor data to get actual tier and name
      const me = await fetchMe();
      if (me.ok) {
        setVendorSession({
          id: res.vendor_id!, user_id: res.user_id!,
          name: me.vendor.name ?? null,
          phone: phone.trim(),
          tier: me.vendor.tier ?? 'essential',
          access_token: res.access_token, refresh_token: res.refresh_token ?? '',
        });
        router.replace('/vendor');
      } else {
        router.replace('/vendor');
      }
    } catch { setError('Could not reach the server. Try again.'); }
    finally { setBusy(false); }
  }

  return (
    <main style={{
      minHeight: '100dvh',
      background: 'linear-gradient(160deg, #0E0D0B 0%, #111111 45%, #0D0E0B 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* Wordmark */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: F.label, fontWeight: 200, fontSize: 9, color: D.gold, letterSpacing: '0.4em', textTransform: 'uppercase' }}>thedreamai · wedding</span>
          <span style={{ fontFamily: F.display, fontWeight: 300, fontSize: 28, color: D.cream, textAlign: 'center' }}>Sign in</span>
        </div>

        {step === 'PHONE' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.muted, letterSpacing: '0.25em', textTransform: 'uppercase' }}>Phone number</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !busy && handlePhone()}
              placeholder="+918757788550" autoFocus
              style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)', border: `1px solid ${D.border}`, borderRadius: 14, outline: 'none', fontFamily: F.body, fontWeight: 400, fontSize: 16, color: D.cream, caretColor: D.gold }} />
            <Btn onClick={handlePhone} busy={busy}>{busy ? 'Sending…' : 'Send WhatsApp code'}</Btn>
          </div>
        )}

        {step === 'OTP' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 14, color: D.muted, lineHeight: 1.6, textAlign: 'center', margin: 0 }}>
              Code sent to <span style={{ color: D.cream }}>{phone}</span> on WhatsApp
            </p>
            <input type="text" inputMode="numeric" autoComplete="one-time-code"
              value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onKeyDown={e => e.key === 'Enter' && !busy && handleOtp()}
              placeholder="000000" autoFocus
              style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)', border: `1px solid ${D.border}`, borderRadius: 14, outline: 'none', fontFamily: F.body, fontWeight: 400, fontSize: 24, color: D.cream, caretColor: D.gold, letterSpacing: '0.3em', textAlign: 'center' }} />
            <Btn onClick={handleOtp} busy={busy}>{busy ? 'Verifying…' : 'Verify & sign in'}</Btn>
            <button type="button" onClick={() => { setStep('PHONE'); setOtp(''); setError(null); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.muted, letterSpacing: '0.2em', textTransform: 'uppercase', alignSelf: 'center', marginTop: 4 }}>
              Use a different number
            </button>
          </div>
        )}

        {error && <p style={{ fontFamily: F.body, fontSize: 13, color: D.red, textAlign: 'center', margin: 0 }}>{error}</p>}
      </div>
    </main>
  );
}

function Btn({ onClick, busy, children }: { onClick: () => void | Promise<void>; busy: boolean; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} disabled={busy} style={{
      padding: '14px 16px', background: busy ? 'rgba(201,168,76,0.4)' : '#C9A84C',
      border: 'none', borderRadius: 14, cursor: busy ? 'default' : 'pointer',
      fontFamily: 'var(--font-jost), system-ui, sans-serif', fontWeight: 400, fontSize: 11,
      color: busy ? 'rgba(17,17,17,0.6)' : '#111111', letterSpacing: '0.25em', textTransform: 'uppercase',
    }}>{children}</button>
  );
}
