'use client';
// app/(frost)/frost/canvas/onboarding/page.tsx
// Bride web onboarding — shown when onboarding_state = 'new'.
// Redirected here from sanctuary/page.tsx auth guard.
//
// Captures the same fields as WhatsApp bride onboarding:
//   wedding_date, partner_name, wedding_city, budget_total
//
// All fields optional — mirrors WA dodge behaviour.
// On submit → POST /api/v2/couple/onboarding → onboarding_state = 'complete'
// On done   → router.replace('/frost')

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const API = 'https://dream-os-production.up.railway.app';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

function getCoupleId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('couple_session') || localStorage.getItem('couple_web_session');
    return raw ? JSON.parse(raw)?.id : null;
  } catch { return null; }
}

function getBrideName(): string {
  if (typeof window === 'undefined') return '';
  try {
    const raw = localStorage.getItem('couple_session') || localStorage.getItem('couple_web_session');
    if (raw) {
      const s = JSON.parse(raw);
      return (s?.user_name || s?.bride_name || s?.name || '').trim().split(' ')[0];
    }
  } catch {}
  return '';
}

// ── Frost design tokens (hardcoded to avoid token import complexity) ─────────
const T = {
  bg:     '#0C0405',          // dream mode dark bg
  card:   'rgba(255,255,255,0.04)',
  gold:   '#C9A84C',
  ink:    '#F8F7F5',
  mute:   'rgba(248,247,245,0.45)',
  border: 'rgba(248,247,245,0.1)',
};

export default function BrideOnboardingPage() {
  const router = useRouter();
  const firstName = typeof window !== 'undefined' ? getBrideName() : '';

  const [weddingDate,  setWeddingDate]  = useState('');
  const [partnerName,  setPartnerName]  = useState('');
  const [weddingCity,  setWeddingCity]  = useState('');
  const [budgetRaw,    setBudgetRaw]    = useState('');
  const [submitting,   setSubmitting]   = useState(false);
  const [toast,        setToast]        = useState('');
  const [done,         setDone]         = useState(false);

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000); };

  const parseBudget = (raw: string): number | null => {
    const cleaned = raw.trim().toUpperCase().replace(/,/g, '').replace(/RS\.?\s*/i, '');
    const lakh = cleaned.match(/^(\d+(?:\.\d+)?)\s*L$/);
    if (lakh)  return Math.round(parseFloat(lakh[1]) * 100000);
    const cr   = cleaned.match(/^(\d+(?:\.\d+)?)\s*CR$/);
    if (cr)    return Math.round(parseFloat(cr[1]) * 10000000);
    const num  = parseInt(cleaned, 10);
    return Number.isFinite(num) && num > 0 ? num : null;
  };

  const submit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);

    const token    = getToken();
    const coupleId = getCoupleId();

    if (!token || !coupleId) {
      showToast('Session expired. Please sign in again.');
      setSubmitting(false);
      window.location.replace('/');
      return;
    }

    const body: Record<string, unknown> = {};
    if (weddingDate.trim())  body.wedding_date  = weddingDate.trim();
    if (partnerName.trim())  body.partner_name  = partnerName.trim();
    if (weddingCity.trim())  body.wedding_city  = weddingCity.trim();
    const budget = parseBudget(budgetRaw);
    if (budget)              body.budget_total  = budget;

    try {
      const res = await fetch(`${API}/api/v2/couple/onboarding`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body:    JSON.stringify(body),
      });
      const d = await res.json();
      // ── F-07.71 PARTIALLY CURED · THE AUTH BRANCH, BY LANE PARITY ───────────
      // FOUNDER VETO 2026-08-01, verbatim 「 b 」: this site adopts its sibling's
      // SHIPPED status branch — app/(auth)/couple/onboarding/page.tsx:153-157 —
      // and the string below is that sibling's byte, moved not authored. Zero new
      // copy; the V3 lane-parity precedent (the founder's own reasoning when he
      // ruled "Forgot PIN?" identical on both lanes).
      //
      // WHAT THIS LINE DID. It read `d.error` with no status check and toasted
      // the SERVER's raw string. `/api/v2/couple/onboarding` sits behind
      // requireCoupleAuth (onboarding.js:58), so on the auth sitting's own
      // specimen a bride was shown "No couple profile found." — a sentence
      // written for a log, on her phone. F-05.28's V1 ruling says the raw
      // "Unauthorised." must never reach a bride; the raw 403 twin was reaching
      // her already, which is how this was found.
      //
      // THE REMAINDER IS FILED, NOT PAPERED. The fallthrough below still renders
      // `d.error` for NON-auth failures (a 500 "Could not fetch profile.", a
      // 400). That half stays OPEN under F-07.71 for its own small cure — named
      // here so the next reader inherits the gap instead of assuming this line
      // closed it.
      if (res.status === 401 || res.status === 403) {
        showToast('Session expired. Please sign in again.');
        setSubmitting(false);
        return;
      }
      if (!d.ok) { showToast(d.error || 'Something went wrong. Try again.'); setSubmitting(false); return; }
      setDone(true);
    } catch {
      showToast('Could not connect. Try again.');
    }
    setSubmitting(false);
  }, [weddingDate, partnerName, weddingCity, budgetRaw, submitting]);

  // ── Styles ──────────────────────────────────────────────────────────────────
  const inp: React.CSSProperties = {
    width: '100%', background: 'transparent',
    border: 'none', borderBottom: `1px solid ${T.border}`,
    outline: 'none', color: T.ink,
    fontFamily: '"DM Sans", system-ui, sans-serif',
    fontWeight: 300, fontSize: 16,
    padding: '10px 0', marginBottom: 24,
    boxSizing: 'border-box',
  };
  const lbl: React.CSSProperties = {
    fontFamily: '"Jost", system-ui, sans-serif',
    fontWeight: 200, fontSize: 9, letterSpacing: '0.22em',
    textTransform: 'uppercase', color: T.mute,
    display: 'block', marginBottom: 8,
  };

  // ── Done screen ──────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: T.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px' }}>
        <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 34, color: T.ink, margin: '0 0 12px', textAlign: 'center', lineHeight: 1.15 }}>
          {firstName ? `You're all set, ${firstName}.` : "You're all set."}
        </p>
        <p style={{ fontFamily: '"DM Sans", system-ui, sans-serif', fontWeight: 300, fontSize: 14, color: T.mute, textAlign: 'center', lineHeight: 1.7, margin: '0 0 40px', maxWidth: 300 }}>
          Your wedding space is ready. Let&apos;s begin.
        </p>
        <button
          onClick={() => router.replace('/frost')}
          style={{ width: '100%', maxWidth: 340, height: 54, background: T.gold, border: 'none', borderRadius: 100, fontFamily: '"Jost", system-ui, sans-serif', fontWeight: 400, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#0C0405', cursor: 'pointer' }}
        >
          Open my space →
        </button>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────
  return (
    <div style={{ position: 'fixed', inset: 0, background: T.bg, overflowY: 'auto' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', background: 'rgba(201,168,76,0.12)', border: `0.5px solid ${T.gold}`, borderRadius: 100, padding: '10px 20px', fontFamily: '"Jost", system-ui, sans-serif', fontSize: 12, color: T.gold, whiteSpace: 'nowrap', zIndex: 99 }}>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: 440, margin: '0 auto', padding: 'calc(env(safe-area-inset-top, 0px) + 52px) 28px calc(env(safe-area-inset-bottom, 0px) + 40px)' }}>

        {/* Header */}
        <p style={{ fontFamily: '"Jost", system-ui, sans-serif', fontWeight: 200, fontSize: 8, letterSpacing: '0.32em', textTransform: 'uppercase', color: T.gold, margin: '0 0 16px' }}>
          The Dream Wedding
        </p>
        <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 30, color: T.ink, lineHeight: 1.15, margin: '0 0 8px' }}>
          {firstName ? `Hi ${firstName}.` : 'Welcome.'}
        </p>
        <p style={{ fontFamily: '"DM Sans", system-ui, sans-serif', fontWeight: 300, fontSize: 13, color: T.mute, lineHeight: 1.7, margin: '0 0 40px' }}>
          Tell us a little about your wedding. Everything is optional — skip anything you&apos;re not ready for.
        </p>

        {/* Wedding date */}
        <label style={lbl}>When is the big day?</label>
        <input
          type="date"
          value={weddingDate}
          onChange={e => setWeddingDate(e.target.value)}
          style={{ ...inp, colorScheme: 'dark' }}
        />

        {/* Partner name */}
        <label style={lbl}>And who&apos;s the lucky person?</label>
        <input
          value={partnerName}
          onChange={e => setPartnerName(e.target.value)}
          placeholder="Their name"
          style={inp}
        />

        {/* City */}
        <label style={lbl}>Where are the functions taking place?</label>
        <input
          value={weddingCity}
          onChange={e => setWeddingCity(e.target.value)}
          placeholder="City or venue"
          style={inp}
        />

        {/* Budget */}
        <label style={lbl}>Budget — ballpark is fine</label>
        <input
          value={budgetRaw}
          onChange={e => setBudgetRaw(e.target.value)}
          placeholder="e.g. 30L, 1Cr, Rs 25,00,000"
          style={inp}
        />

        {/* Buttons */}
        <button
          onClick={submit}
          disabled={submitting}
          style={{ width: '100%', height: 54, background: submitting ? `rgba(201,168,76,0.4)` : T.gold, border: 'none', borderRadius: 100, fontFamily: '"Jost", system-ui, sans-serif', fontWeight: 400, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#0C0405', cursor: submitting ? 'default' : 'pointer', transition: 'all 200ms ease', marginBottom: 12 }}
        >
          {submitting ? 'Saving…' : 'Continue →'}
        </button>

        <button
          onClick={() => { router.replace('/frost'); }}
          style={{ width: '100%', height: 44, background: 'transparent', border: `0.5px solid ${T.border}`, borderRadius: 100, fontFamily: '"Jost", system-ui, sans-serif', fontWeight: 200, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.mute, cursor: 'pointer' }}
        >
          Skip for now
        </button>

        <p style={{ fontFamily: '"DM Sans", system-ui, sans-serif', fontSize: 11, fontWeight: 300, color: T.mute, textAlign: 'center', marginTop: 20, fontStyle: 'italic', lineHeight: 1.6, opacity: 0.7 }}>
          You can always update these details later in Settings.
        </p>

      </div>
    </div>
  );
}
