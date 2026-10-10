'use client';
// app/vendor/pin/page.tsx
// First-time PIN setup for vendors who just verified OTP.
// Shown when pin_set=false after OTP verify on the landing page.
// Mirrors app/(auth)/couple/pin/page.tsx — same UX, vendor session keys.
//
// Guard: must have a vendor session with pin_set=false.
//        If pin_set=true already → redirect to /vendor/pin-login.
//        If no session → redirect to /.
//
// On success: marks pin_set=true in session, redirects to /vendor.

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/lib/api';
import WorksBackdrop from '@/app/works/WorksBackdrop';

// CE-47 LAND-1 package 2 (the founder, 10 Oct 2026): this screen wears tdw.works's look. The works wall behind a
// frosted-glass panel, headed by the mark (TDW, tdw.works under it), in tdw.works's fonts and colours
// (app/works/WorksBackdrop.tsx, the one home tdw.works draws from; app/works/glass.css). Only the look moved: the
// steps, the fetches, the session reads and writes, the checks and the words are the same code. The one door that
// moved is the chair's ruling: where a check sent her to "/", the couples' front page, it now sends her to the vendor
// sign-in (VENDOR_SIGNIN); the checks themselves are unchanged.

const SESSION_COOKIE = 'tdw_vendor_session';

// CE-47 LAND-1 package 2: where a check sends a vendor out, it sends her to the vendor sign-in, never the couples' page.
const VENDOR_SIGNIN = '/?role=vendor-signin';

function readVendorSession(): Record<string, unknown> {
  try {
    const raw = localStorage.getItem('vendor_web_session') || localStorage.getItem('vendor_session');
    if (raw) return JSON.parse(raw);
  } catch { /* fall through */ }
  try {
    const m = document.cookie.split('; ').find(r => r.startsWith(SESSION_COOKIE + '='));
    if (m) return JSON.parse(decodeURIComponent(m.split('=').slice(1).join('=')));
  } catch { /* ignore */ }
  return {};
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

export default function VendorPinPage() {
  const router = useRouter();
  const [pin,     setPin]     = useState(['', '', '', '']);
  const [confirm, setConfirm] = useState(['', '', '', '']);
  const [stage,   setStage]   = useState<'pin' | 'confirm'>('pin');
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState('');
  const pinRefs     = useRef<(HTMLInputElement | null)[]>([]);
  const confirmRefs = useRef<(HTMLInputElement | null)[]>([]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2800); };

  // Guard: need a session; if already has PIN → skip to pin-login
  useEffect(() => {
    try {
      const s = readVendorSession();
      if (!s?.id) { router.replace(VENDOR_SIGNIN); return; }
      if (s?.pin_set) { router.replace('/vendor/pin-login'); return; }
    } catch { router.replace(VENDOR_SIGNIN); return; }
    pinRefs.current[0]?.focus();
  }, []);


  const submit = useCallback(async () => {
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
      const session = readVendorSession();
      const r = await fetch(API_BASE + '/api/v2/vendor/auth/set-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendor_id: session.id || session.vendorId, pin: pinStr }),
      });
      const d = await r.json();
      if (d.ok) {
        const updated = { ...session, pin_set: true, _v: 2 };
        writeVendorSession(updated);
        router.replace('/vendor');
      } else {
        showToast(d.error || 'Could not set PIN. Try again.');
      }
    } catch { showToast('Network error. Try again.'); }
    finally { setLoading(false); }
  }, [pin, confirm, router]);

  // Auto-submit when confirm is full
  useEffect(() => {
    if (confirm.every(d => d) && stage === 'confirm') submit();
  }, [confirm, stage, submit]);

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
    idx: number, val: string,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    if (val === '' && idx > 0) {
      setter(prev => { const n = [...prev]; n[idx - 1] = ''; return n; });
      refs.current[idx - 1]?.focus();
    }
  };


  return (
    <>
      {toast && <div className="wg-toast" role="status">{toast}</div>}
      <WorksBackdrop label="Create your PIN">
        <p className="wg-h">
          {stage === 'pin' ? 'Create your PIN.' : 'Confirm your PIN.'}
        </p>
        <p className="wg-sub">
          {stage === 'pin' ? 'Four digits. Quick access every time.' : 'Enter the same PIN again.'}
        </p>

        {stage === 'pin' && (
          <div className="wg-digits">
            {pin.map((d, i) => (
              <input key={i} ref={el => { pinRefs.current[i] = el; }}
                type="tel" maxLength={1} value={d}
                aria-label={'PIN digit ' + (i + 1)}
                onChange={e => handlePinInput(i, e.target.value)}
                onKeyDown={e => { if (e.key === 'Backspace') handleBackspace(i, d, pinRefs, setPin); }}
                className="wg-otp wg-pin" disabled={loading} />
            ))}
          </div>
        )}

        {stage === 'confirm' && (
          <div className={'wg-digits' + (shaking ? ' wg-shake' : '')}>
            {confirm.map((d, i) => (
              <input key={i} ref={el => { confirmRefs.current[i] = el; }}
                type="tel" maxLength={1} value={d}
                aria-label={'Confirm PIN digit ' + (i + 1)}
                onChange={e => handleConfirmInput(i, e.target.value)}
                onKeyDown={e => { if (e.key === 'Backspace') handleBackspace(i, d, confirmRefs, setConfirm); }}
                className="wg-otp wg-pin" disabled={loading} />
            ))}
          </div>
        )}

        {loading && (
          <p className="wg-note">
            Setting PIN…
          </p>
        )}
      </WorksBackdrop>
    </>
  );
}
