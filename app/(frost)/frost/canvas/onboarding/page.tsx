'use client';
// app/(frost)/frost/canvas/onboarding/page.tsx
// ARC OB · charter OB-P · THE BRIDE FORM — two mandatory fields, four optional.
//
// ═══ SERVER-TRUTH DOCTRINE (OB-P §5) ════════════════════════════════════════
// This form holds NO copy of the predicate's rules and NO refusal sentence of
// its own. BRIDE_FIELDS = ['name','budget'] lives in dream-os
// (src/lib/onboardingPredicate.js) and reaches here only as data: the GET's
// `onboarding.missing[]` and the 400's `missing[]`. The client asks and obeys.
//
// WHAT STOOD HERE, and why it could not stay:
//   · IT COLLECTED NO NAME AT ALL. wedding_date, partner_name, wedding_city and
//     budget, and not one box for the bride's own name — which is the precise
//     mechanism by which 11 of 28 brides are on file nameless.
//   · Its header declared 「 All fields optional — mirrors WA dodge behaviour 」
//     and its own subhead said so to the bride. Under R-OB.6 that is true of the
//     four; under BRIDE_FIELDS it was never true of the two.
//   · F-OB.11 — it reached the estate by a RAW fetch against a hardcoded
//     `const API = 'https://...'`, bypassing lib/frost-api/_base.ts, whose own
//     header says every call goes through it. CURED HERE, which is the wholesale
//     replacement the chair's shelf-filing named as the one condition for this
//     page entering my radius. Declared, not slipped in.
//
// ═══ TWO RESIDENT BYTES RETIRED BY RULING, NOT BY TASTE ═════════════════════
// R-OB.2 is NO GRACE TURNS and the redirect is MANDATORY. A door that renders a
// 「 Skip for now 」 button is not a mandatory door, and 「 Everything is
// optional — skip anything you're not ready for 」 is a promise the predicate
// now refuses to keep. Both are REMOVED. The subhead keeps its true half
// verbatim — a subtraction from a vetoed byte, never a fresh sentence, because
// minting a replacement is the founder's pen and not mine. If he wants the
// removed clause replaced rather than merely cut, that is a fresh veto.
//
// APPROVED-COPY-CARRIES-ITS-HASH. 「 Name 」 and 「 Wedding Budget (Approx). 」
// are founder-signed 2026-08-13 and frozen at the byte, the trailing period
// included. Every other string on this page is resident and carried unchanged.

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet, apiPost, getCoupleSession } from '@/lib/frost-api/_base';
import { ApiClientError } from '@/lib/types/common';

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
  bg:     '#0C0405',
  card:   'rgba(255,255,255,0.04)',
  gold:   '#C9A84C',
  ink:    '#F8F7F5',
  mute:   'rgba(248,247,245,0.45)',
  border: 'rgba(248,247,245,0.1)',
};

interface CoupleMe {
  ok: boolean;
  couple?: {
    wedding_date?: string | null;
    wedding_city?: string | null;
    budget_total?: number | null;
    onboarding?: { complete: boolean; missing: string[] };
  };
}

export default function BrideOnboardingPage() {
  const router = useRouter();

  const [loading,     setLoading]     = useState(true);
  const [firstName,   setFirstName]   = useState('');
  const [missing,     setMissing]     = useState<string[]>([]);
  const [refusal,     setRefusal]     = useState('');

  const [name,        setName]        = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [weddingCity, setWeddingCity] = useState('');
  const [budgetRaw,   setBudgetRaw]   = useState('');

  const [submitting,  setSubmitting]  = useState(false);
  const [toast,       setToast]       = useState('');
  const [done,        setDone]        = useState(false);

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000); };

  // THE PARSER, CARRIED VERBATIM (F-4 ratified: reuse, single numeric field, no
  // ranges). A range cannot satisfy `moneyPresent`, which demands one number
  // strictly greater than zero, and inventing a midpoint rule client-side would
  // be a second definition of a budget.
  const parseBudget = (raw: string): number | null => {
    const cleaned = raw.trim().toUpperCase().replace(/,/g, '').replace(/RS\.?\s*/i, '');
    const lakh = cleaned.match(/^(\d+(?:\.\d+)?)\s*L$/);
    if (lakh)  return Math.round(parseFloat(lakh[1]) * 100000);
    const cr   = cleaned.match(/^(\d+(?:\.\d+)?)\s*CR$/);
    if (cr)    return Math.round(parseFloat(cr[1]) * 10000000);
    const num  = parseInt(cleaned, 10);
    return Number.isFinite(num) && num > 0 ? num : null;
  };

  useEffect(() => {
    let live = true;
    setFirstName(getBrideName());
    (async () => {
      try {
        const me = await apiGet<CoupleMe>('/api/v2/couple/me');
        if (!live) return;
        const c = me.couple;
        if (c?.onboarding?.complete) { router.replace('/frost'); return; }
        if (c) {
          setWeddingDate(c.wedding_date || '');
          setWeddingCity(c.wedding_city || '');
          setBudgetRaw(c.budget_total ? String(c.budget_total) : '');
          setMissing(c.onboarding?.missing || []);
        }
        setName(getBrideName());
      } catch (e) {
        if (!live) return;
        if (e instanceof ApiClientError && (e.status === 401 || e.status === 403)) {
          showToast('Session expired. Please sign in again.');
          window.location.replace('/');
          return;
        }
        showToast('Could not connect. Try again.');
      }
      if (live) setLoading(false);
    })();
    return () => { live = false; };
  }, [router]);

  const submit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    setRefusal('');

    const body: Record<string, unknown> = {};
    if (name.trim())        body.name          = name.trim();
    if (weddingDate.trim()) body.wedding_date  = weddingDate.trim();
    if (weddingCity.trim()) body.wedding_city  = weddingCity.trim();
    const budget = parseBudget(budgetRaw);
    if (budget)             body.budget_total  = budget;

    try {
      await apiPost<{ ok: boolean }>('/api/v2/couple/onboarding', body);
      setDone(true);
    } catch (e) {
      if (e instanceof ApiClientError) {
        if (e.status === 401 || e.status === 403) {
          showToast('Session expired. Please sign in again.');
          setSubmitting(false);
          return;
        }
        // THE SERVER'S SENTENCE AND ITS MACHINE FIELDS. `body` rides the error
        // precisely so this branch exists: the sentence is already
        // founder-vetoed at the endpoint and is RENDERED, never re-worded, and
        // `missing[]` is what marks the boxes. Narrowed at the point of use —
        // the error carries `unknown` on purpose, so a server that answers in a
        // shape this client did not expect degrades to the sentence alone
        // rather than throwing inside a catch.
        const refusalBody = e.body as { missing?: string[] } | undefined;
        if (e.status === 400 && Array.isArray(refusalBody?.missing)) {
          setMissing(refusalBody.missing);
        }
        setRefusal(e.message);
        setSubmitting(false);
        return;
      }
      showToast('Could not connect. Try again.');
    }
    setSubmitting(false);
  }, [name, weddingDate, weddingCity, budgetRaw, submitting]);

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

  // The marker renders from the SERVER's missing[], never from a local rule
  // about which boxes look empty. 「 Still needed 」 is the vendor sheet's
  // signed byte, REUSED rather than minted a second time.
  const Label = ({ text, field }: { text: string; field: string }) => (
    <label style={lbl}>
      {text}
      {missing.includes(field) && (
        <span style={{ color: T.gold, marginLeft: 8 }}>Still needed</span>
      )}
    </label>
  );

  if (loading) {
    return <div style={{ position: 'fixed', inset: 0, background: T.bg }} aria-busy="true" />;
  }

  // ── Done screen ──────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: T.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px' }}>
        <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 300, fontSize:22, color: T.ink, margin: '0 0 12px', textAlign: 'center', lineHeight: 1.15 }}>
          {firstName ? `You're all set, ${firstName}.` : "You're all set."}
        </p>
        <p style={{ fontFamily: '"DM Sans", system-ui, sans-serif', fontWeight: 300, fontSize:16, color: T.mute, textAlign: 'center', lineHeight: 1.7, margin: '0 0 40px', maxWidth: 300 }}>
          Your wedding space is ready. Let&apos;s begin.
        </p>
        <button
          onClick={() => router.replace('/frost')}
          style={{ width: '100%', maxWidth: 340, height: 54, background: T.gold, border: 'none', borderRadius: 100, fontFamily: '"Jost", system-ui, sans-serif', fontWeight: 400, fontSize:11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#0C0405', cursor: 'pointer' }}
        >
          Open my space →
        </button>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────
  return (
    <div style={{ position: 'fixed', inset: 0, background: T.bg, overflowY: 'auto' }}>

      {toast && (
        <div style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', background: 'rgba(201,168,76,0.12)', border: `0.5px solid ${T.gold}`, borderRadius: 100, padding: '10px 20px', fontFamily: '"Jost", system-ui, sans-serif', fontSize:16, color: T.gold, whiteSpace: 'nowrap', zIndex: 99 }}>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: 440, margin: '0 auto', padding: 'calc(env(safe-area-inset-top, 0px) + 52px) 28px calc(env(safe-area-inset-bottom, 0px) + 40px)' }}>

        <p style={{ fontFamily: '"Jost", system-ui, sans-serif', fontWeight: 200, fontSize:9, letterSpacing: '0.32em', textTransform: 'uppercase', color: T.gold, margin: '0 0 16px' }}>
          The Dream Wedding
        </p>
        <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 300, fontSize:22, color: T.ink, lineHeight: 1.15, margin: '0 0 8px' }}>
          {firstName ? `Hi ${firstName}.` : 'Welcome.'}
        </p>
        <p style={{ fontFamily: '"DM Sans", system-ui, sans-serif', fontWeight: 300, fontSize:16, color: T.mute, lineHeight: 1.7, margin: '0 0 40px' }}>
          Tell us a little about your wedding.
        </p>

        {/* THE SERVER'S REFUSAL — verbatim, above the boxes it is about */}
        {refusal && (
          <p style={{ fontFamily: '"DM Sans", system-ui, sans-serif', fontWeight: 300, fontSize: 16, lineHeight: 1.6, color: T.gold, background: 'rgba(201,168,76,0.08)', border: `0.5px solid ${T.gold}`, borderRadius: 8, padding: '12px 16px', margin: '0 0 32px' }}>
            {refusal}
          </p>
        )}

        <Label text="Name" field="name" />
        <input value={name} onChange={e => setName(e.target.value)} style={inp} />

        <label style={lbl}>When is the big day?</label>
        <input
          type="date"
          value={weddingDate}
          onChange={e => setWeddingDate(e.target.value)}
          style={{ ...inp, colorScheme: 'dark' }}
        />

        {/* PARTNER NAME — FOUNDER VETO-DELETE, 2026-08-13. The label 「 And
            who's the lucky person? 」 and its 「 Their name 」 placeholder are
            RETIRED, not hidden: a control commented out is a control the next
            reader restores by accident.

            THE COLUMN AND ITS OTHER WRITERS ARE UNTOUCHED. couples.partner_name
            still exists, PATCH /couple/me still writes it, and the bride agent's
            save_wedding_detail still writes it from a turn. What retires is THIS
            FORM'S claim on the field — RETIRE-WITH-THE-READER cuts the reader,
            never the column underneath it, and a DDL drop would be its own micro
            with its own census. The endpoint continues to ACCEPT partner_name
            from any caller that sends it; this one simply stops asking. */}

        <label style={lbl}>Where are the functions taking place?</label>
        <input
          value={weddingCity}
          onChange={e => setWeddingCity(e.target.value)}
          placeholder="City or venue"
          style={inp}
        />

        <Label text="Wedding Budget (Approx)." field="budget" />
        <input
          value={budgetRaw}
          onChange={e => setBudgetRaw(e.target.value)}
          placeholder="e.g. 30L, 1Cr, Rs 25,00,000"
          style={inp}
        />

        <button
          onClick={submit}
          disabled={submitting}
          style={{ width: '100%', height: 54, background: submitting ? `rgba(201,168,76,0.4)` : T.gold, border: 'none', borderRadius: 100, fontFamily: '"Jost", system-ui, sans-serif', fontWeight: 400, fontSize:11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#0C0405', cursor: submitting ? 'default' : 'pointer', transition: 'all 200ms ease', marginBottom: 12 }}
        >
          {submitting ? 'Saving…' : 'Continue →'}
        </button>

        <p style={{ fontFamily: '"DM Sans", system-ui, sans-serif', fontSize:16, fontWeight: 300, color: T.mute, textAlign: 'center', marginTop: 20, fontStyle: 'italic', lineHeight: 1.6, opacity: 0.7 }}>
          You can always update these details later in Settings.
        </p>

      </div>
    </div>
  );
}
