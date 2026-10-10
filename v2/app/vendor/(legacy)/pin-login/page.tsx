'use client';
// app/vendor/pin-login/page.tsx
// Vendor PIN entry — same aesthetic as couple/pin-login.
// tdw.works's wall behind a frosted-glass panel (CE-47 LAND-1 package 2; it was editorial photographs).
// Routed to after OTP verify on the landing page for Makers.
// Uses vendor pin-login endpoint. Redirects to /vendor on success.

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

// iOS Safari may have thrown on localStorage.setItem during landing sign-in, so
// the session can live only in the first-party cookie. Read both; write both.
const SESSION_COOKIE = 'tdw_vendor_session';

// CE-47 LAND-1 package 2: where a check sends a vendor out, it sends her to the vendor sign-in, never the couples' page.
const VENDOR_SIGNIN = '/?role=vendor-signin';

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

export default function VendorPinLoginPage() {
  const router = useRouter();
  const [pin,      setPin]      = useState(['', '', '', '']);
  const [shaking,  setShaking]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [toast,    setToast]    = useState('');
  const [attempts, setAttempts] = useState(0);
  const [name,     setName]     = useState('');
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2800); };

  useEffect(() => {
    // Read session from localStorage; fall back to the first-party cookie that
    // the landing login mirrors to (covers iOS Safari where localStorage.setItem
    // threw during sign-in, so the session only exists in the cookie).
    const s = readVendorSession();
    if (!s?.id || !s?.pin_set) { router.replace(VENDOR_SIGNIN); return; }
    if (s?.name) setName(s.name as string);
    pinRefs.current[0]?.focus();
  }, [router]);


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
            router.replace(VENDOR_SIGNIN);
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


  const firstName = name?.split(' ')[0] || '';

  return (
    <>
      {toast && <div className="wg-toast" role="status">{toast}</div>}
      <WorksBackdrop label="Enter your PIN">
        <p className="wg-h">
          {firstName ? 'Welcome back, ' + firstName + '.' : 'Welcome back.'}
        </p>
        <p className="wg-sub">Enter your PIN to continue.</p>
        <div className={'wg-digits' + (shaking ? ' wg-shake' : '')}>
          {pin.map((d, i) => (
            <input key={i} ref={el => { pinRefs.current[i] = el; }}
              type="tel" inputMode="numeric" maxLength={1} value={d}
              autoComplete="one-time-code"
              aria-label={'PIN digit ' + (i + 1)}
              onChange={e => handleInput(i, e.target.value)}
              onKeyDown={e => { if (e.key === 'Backspace') handleBackspace(i, d); }}
              className="wg-otp wg-pin" disabled={loading} />
          ))}
        </div>
        {loading && <p className="wg-note">Verifying…</p>}
        <p onClick={() => { router.push('/vendor/pin-reset'); }}
          className="wg-link"
        >Forgot PIN?</p>
      </WorksBackdrop>
    </>
  );
}
