'use client';
// app/plan/page.tsx — CE-42 · SEAT D3 · /plan SITTING 2 · R-41.94, THE PUBLIC INTAKE.
//
// A stranger opens thedreamwedding.in/plan, fills the sheet, gives a phone and a
// name, verifies by the bride-line OTP, and the request lands with origin='public'
// and a couple_id. Four screens, light only, one arm, no shell.
//
// ── THE ORDER IS THE WHOLE ARCHITECTURE (FORK 1, ruled a) ───────────────────
// S1 sheet → S2 phone + name → S3 code → POST → S4 sent → /couple/onboarding.
// The door is INSIDE requireCoupleAuth, so at Send she holds no session and the
// sheet's Send CANNOT post on this lane: it hands the body back and this page
// keeps it. `useOtpSignup` is called with a ROUTER SHIM whose push only RECORDS
// the destination, so the POST lands between `persistSession` and the navigation
// rather than racing it — and `lib/auth/otpSignup.ts` is not touched by one byte
// to make that true, because `OtpSignupDeps.router` was already typed as nothing
// more than `{ push }`.
//
// THE SHIM IS ALSO THE SUCCESS WITNESS, and that is not a trick. `verifyOtp` has
// exactly one path that pushes and every failure path returns after `showToast`,
// so a recorded href IS a verified session. Reading `access_token` back out of
// storage would have been the alternative and it is worse: iOS can throw on the
// write, and `persistSession` swallows that throw by design.
//
// FORK C(a): she is a fresh mint with no PIN and no name on file, so
// `coupleNeedsOnboarding` is true and the destination is /couple/onboarding. This
// page does not name that route — it forwards whatever the mint chose, so the day
// the destination is re-ruled it is re-ruled in one file.
//
// TOKENS — R-42.6, no colour the estate does not hold. Nine values, nine homes,
// transcribed from the ratified frame (TDW_CE42_D5_PLAN_FRAME_v2.html) and
// re-verified against the tree at this cut. They are cited BY SELECTOR, never by
// line: F-42.136 caught the frame's own cites rotted eleven lines, and F-42.61
// settled that a cross-file line number cannot stay true for longer than one edit.
//   #F8F7F5  app/layout.tsx PUBLIC_BG · app/v/[code]/page.tsx `.pv` ground
//   #0C0A09  app/layout.tsx LANDING_BG · `.pv` ink
//   #403B36  app/v/[code]/page.tsx `.pv-sealfacts`   second ink
//   #6B6560  app/v/[code]/page.tsx `.pv-demo`        captions, Resend, Back
//   #EDEAE4  app/v/[code]/page.tsx `.pv-hero`        panel edges
//   #F2EFE9  app/v/[code]/page.tsx `.pv-cta:active`  the pressed state only
//   #C9A84C  app/v/[code]/page.tsx `.pv-cta`         border and focus ring
//   #7A621C  app/v/[code]/page.tsx `.pv-cta`         the action's ink
// Opacity is applied to #0C0A09 only and never to make a new hue. ONE GOLD PER
// SCREEN, on the action; Resend is an ink hairline, because a second metal would
// make the two actions read as equals.

import React, { Suspense, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AssistanceSheet, { SHEET_BYTES, TDW_WA_LINK, type SheetPalette } from '@/app/components/couple/AssistanceSheet';
import { ASSIST_ROWS, submitPublicAssistanceRequest, type AssistRequestBody } from '@/lib/frost-api/assistance';
import { markAssistRequested } from '@/lib/frost/assistPopup';
import { useOtpSignup } from '@/lib/auth/otpSignup';
import { API_BASE } from '@/lib/frost-api/_base';

// ── this page's own bytes, one home ─────────────────────────────────────────
// P1–P4 and the two headings are the chair's, vetoed at D5's read-first. The nine
// field and action bytes were vetoed at D3 s2 AS DRAWN with one change: `Back`
// carries no chevron — the glyph is chrome and the byte is the word.
const P = {
  p1:         'Tell us what you need.',
  p2:         'Your phone and name, so we can reach you.',
  p3:         'Enter the code we sent on WhatsApp.',
  p4:         'Sent. We\u2019ll message you on WhatsApp.',
  almost:     'Almost there.',
  check:      'Check WhatsApp.',
  nameLabel:  'Your first name',
  namePh:     'First name',
  phoneLabel: 'Phone number',
  phonePh:    '00000 00000',
  sendCode:   'Send code',
  codeLabel:  '6-digit code',
  verify:     'Verify',
  resend:     'Resend the code',
  back:       'Back',
  dial:       '+91',
};

const GROUND   = '#F8F7F5';
const INK      = '#0C0A09';
const INK_2    = '#403B36';
const INK_3    = '#6B6560';
const HAIR     = '#EDEAE4';
const PRESS    = '#F2EFE9';
const GOLD     = '#C9A84C';
const GOLD_INK = '#7A621C';
const INK_50   = 'rgba(12,10,9,.50)';
const INK_38   = 'rgba(12,10,9,.38)';
const INK_12   = 'rgba(12,10,9,.12)';
const INK_10   = 'rgba(12,10,9,.10)';
const INK_03   = 'rgba(12,10,9,.03)';

// `.pv-cta` transcribed — .5px gold hairline, 2px radius, #7A621C ink, 44 min-height,
// 12px/500/.04em. ONE DEVIATION, NAMED: /v/ declares inline-flex because its CTA sits
// under prose; here it is the screen's one action and runs full width. Nothing else moves.
const CTA: React.CSSProperties = {
  marginTop: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 44,
  padding: '12px 22px', border: `.5px solid ${GOLD}`, borderRadius: 2, color: GOLD_INK,
  textDecoration: 'none', fontWeight: 500, fontSize: 12, lineHeight: 1.4, letterSpacing: '.04em',
  fontFamily: "'DM Sans',sans-serif", cursor: 'pointer', touchAction: 'manipulation',
};
const CTA_PRESS: React.CSSProperties = { background: PRESS };
// A secondary action is ink, not metal.
const ALT: React.CSSProperties = {
  marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 44,
  padding: '12px 22px', border: `.5px solid ${INK_12}`, borderRadius: 2, color: INK_3,
  textDecoration: 'none', fontWeight: 400, fontSize: 12, letterSpacing: '.04em',
  fontFamily: "'DM Sans',sans-serif", cursor: 'pointer', touchAction: 'manipulation',
};
const FIELD: React.CSSProperties = {
  background: INK_03, border: `1px solid ${INK_12}`, borderRadius: 6, padding: '11px 13px',
  fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: INK, outline: 'none', width: '100%',
};
const LBL: React.CSSProperties = {
  fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.22em',
  textTransform: 'uppercase', color: INK_50, margin: '14px 0 7px',
};
const HEADING: React.CSSProperties = { fontFamily: "'Italianno',cursive", color: INK, lineHeight: 1 };
const LEDE: React.CSSProperties = {
  fontFamily: "'Fraunces',serif", fontStyle: 'italic', fontWeight: 300,
  fontFeatureSettings: '"opsz" 9', fontSize: 16, color: INK_2, lineHeight: 1.6, marginTop: 2,
};
const REFUSAL: React.CSSProperties = {
  fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: GOLD_INK, textAlign: 'center', marginTop: 10, lineHeight: 1.5,
};

const LIGHT: SheetPalette = {
  bg: GROUND, ink: INK, inkSoft: INK_2, inkMute: INK_38,
  line: INK_10, rowBg: INK_03, rowBdr: INK_12,
  checkOn: INK, refusalInk: GOLD_INK, onTdwInk: INK_2,
  colorScheme: 'light',
  cta: CTA, ctaPress: CTA_PRESS,
  outlineBtn: { ...ALT, display: 'flex' },
};

// FORK D, ruled: `?city=` and `?date=YYYY-MM-DD` ONLY, malformed ignored. `area` and
// `brief` are REFUSED — a link that pre-writes a stranger's own words back at her can
// be forged to put words in her request, and she would sign her name under them.
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
function readPrefill(get: (k: string) => string | null): { city?: string; date?: string } {
  const out: { city?: string; date?: string } = {};
  const city = (get('city') || '').trim();
  if (city) out.city = city.slice(0, 80);
  const date = (get('date') || '').trim();
  // Shape AND value: `2027-02-31` matches the shape and is not a day, and a native
  // date control fed one silently renders empty, which reads as a link that did nothing.
  if (ISO_DATE.test(date)) {
    const d = new Date(date + 'T00:00:00');
    if (!isNaN(d.getTime()) && date === d.toISOString().slice(0, 10)) out.date = date;
  }
  return out;
}

type Screen = 'sheet' | 'phone' | 'otp' | 'sent';

function PlanInner() {
  const router = useRouter();
  const params = useSearchParams();
  const prefill = useMemo(() => readPrefill((k) => params.get(k)), [params]);

  const [screen, setScreen]   = useState<Screen>('sheet');
  const [body, setBody]       = useState<AssistRequestBody | null>(null);
  const [name, setName]       = useState('');
  const [phone, setPhone]     = useState('');
  const [otp, setOtp]         = useState<string[]>(['', '', '', '', '', '']);
  const [refusal, setRefusal] = useState('');
  const [busy, setBusy]       = useState(false);
  const [pressed, setPressed] = useState('');
  const [lost, setLost]       = useState(false);   // the POST failed after she was verified
  const [sentCats, setSentCats] = useState<string[]>([]);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  // Where the mint decided she goes. `useOtpSignup` pushes exactly once, on the one
  // path where the session was written; every refusal returns after showToast.
  const destination = useRef<string | null>(null);

  const { sendOtp, verifyOtp } = useOtpSignup({
    role: 'Dreamer',                     // never 'Maker' from this door
    country: { dialCode: P.dial },       // Q3: fixed +91, no picker
    phone,
    otp,
    screen: 'join_phone',                // so sendOtp's own setScreen resolves to the code screen
    joinName: name,
    joinCategory: '',
    showToast: (m: string) => setRefusal(m),
    setScreen: () => { setScreen('otp'); setOtp(['', '', '', '', '', '']); },
    router: { push: (href: string) => { destination.current = href; } },
    apiBase: API_BASE,
  });

  const digits = phone.replace(/\D/g, '').slice(0, 10);
  const canSendCode = name.trim() !== '' && digits.length === 10;
  const canVerify   = otp.every(d => d !== '');

  const clear = () => { if (refusal) setRefusal(''); };

  async function onSendCode() {
    if (busy || !canSendCode) return;
    setBusy(true);
    setRefusal('');
    // R-37.15: the door that COLLECTED the name is the only door that spends it, and
    // this one collected it two fields up.
    try { await sendOtp(digits, name); } finally { setBusy(false); }
  }

  async function fileIt() {
    if (!body) return false;
    try {
      const out = await submitPublicAssistanceRequest(body);
      if (!out || !out.ok) return false;
      // FORK 6, ruled: the popup flag is an existing write with one home, called from
      // a second caller. Under Fork C(a) she reaches /frost, and unset it would put
      // the sanctuary's popup in front of a woman who filed thirty seconds ago.
      markAssistRequested();
      return true;
    } catch { return false; }
  }

  async function onVerify() {
    if (busy || !canVerify) return;
    setBusy(true);
    setRefusal('');
    try {
      destination.current = null;
      await verifyOtp();
      const href = destination.current;
      if (!href) return;                       // refused; verifyOtp already set the reason
      const filed = await fileIt();
      if (!filed) { setLost(true); setRefusal(SHEET_BYTES.failure); return; }
      // The card names what she READ on the sheet. `category` is the estate's token
      // (src/agent/categories.js); ASSIST_ROWS is the one place it is turned back into
      // the couple's own word, and this side does not keep a second copy of that map.
      setSentCats((body?.items || []).map(i => ASSIST_ROWS.find(r => r.category === i.category)?.label || i.category));
      setScreen('sent');
      // FORK 2, ruled: she reads the confirmation for a beat, then the mint's own
      // destination. N = 1500ms, founder-ruled and overruled on the walk if it reads fast.
      window.setTimeout(() => router.push(href), 1500);
    } finally { setBusy(false); }
  }

  async function onResend() {
    if (busy) return;
    setBusy(true);
    setRefusal('');
    try { await sendOtp(digits, name); } finally { setBusy(false); }
  }

  function setOtpAt(i: number, v: string) {
    clear();
    const d = v.replace(/\D/g, '').slice(-1);
    setOtp(prev => prev.map((x, k) => (k === i ? d : x)));
    if (d && i < 5) otpRefs.current[i + 1]?.focus();
  }
  function otpKey(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  }

  const column = (inner: React.ReactNode) => (
    <div style={{ minHeight: '100vh', background: GROUND, color: INK }}>
      {/* the 430px cap — app/v/[code]/page.tsx `.pv-card`, the public column this estate already keeps */}
      <div style={{ maxWidth: 430, margin: '0 auto' }}>{inner}</div>
    </div>
  );

  const back = (to: Screen) => (
    <div role="button" onClick={() => { clear(); setScreen(to); }}
      style={{ fontFamily: "'Jost',sans-serif", fontWeight: 300, fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: INK_3, marginBottom: 14, cursor: 'pointer', display: 'inline-block' }}>
      {P.back}
    </div>
  );

  const cta = (label: string, on: () => void, enabled: boolean, key: string) => (
    <div role="button" aria-disabled={!enabled || busy} onClick={on}
      onPointerDown={() => setPressed(key)} onPointerUp={() => setPressed('')} onPointerLeave={() => setPressed('')}
      style={{ ...CTA, ...(pressed === key ? CTA_PRESS : null), opacity: enabled && !busy ? 1 : .45 }}>
      {label}
    </div>
  );

  if (screen === 'sheet' || screen === 'sent') {
    const isSent = screen === 'sent';
    return (
      <AssistanceSheet
        palette={LIGHT}
        copy={{
          title:       P.p1,              // Q1: P1 takes #7's slot on /plan ONLY
          lede:        SHEET_BYTES.lede,  // #8, kept beneath
          sentHeading: P.p4,
          sentLede:    '',
          sentCard:    '',
        }}
        signedIn={false}
        requireCity
        prefill={prefill}
        initialSent={isSent ? { categories: sentCats, city: body?.city || '', date: body?.wedding_date || '' } : null}
        submit={async (b) => { setBody(b); setScreen('phone'); return 'held'; }}
        chrome={column}
      />
    );
  }

  if (screen === 'phone') {
    return column(
      <div style={{ padding: '18px 20px 40px' }}>
        <div style={{ paddingBottom: 14, borderBottom: `.5px solid ${INK_10}` }}>
          {back('sheet')}
          <div style={{ ...HEADING, fontSize: 38 }}>{P.almost}</div>
          <div style={LEDE}>{P.p2}</div>
        </div>
        <div style={LBL}>{P.nameLabel}</div>
        <input value={name} onChange={e => { clear(); setName(e.target.value.slice(0, 80)); }} placeholder={P.namePh} autoComplete="given-name" style={FIELD} />

        <div style={LBL}>{P.phoneLabel}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ ...FIELD, width: 'auto', flex: '0 0 auto', color: INK_2 }}>{P.dial}</div>
          <input value={phone} onChange={e => { clear(); setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); }}
            placeholder={P.phonePh} inputMode="numeric" autoComplete="tel-national" aria-label={P.phoneLabel} style={FIELD} />
        </div>

        {cta(P.sendCode, onSendCode, canSendCode, 'send')}
        {refusal && <div style={REFUSAL}>{refusal}</div>}
        <div style={{ ...REFUSAL, color: INK_50 }}>{SHEET_BYTES.fine}</div>
      </div>
    );
  }

  // screen === 'otp'
  return column(
    <div style={{ padding: '18px 20px 40px' }}>
      <div style={{ paddingBottom: 14, borderBottom: `.5px solid ${INK_10}` }}>
        {back('phone')}
        <div style={{ ...HEADING, fontSize: 38 }}>{P.check}</div>
        <div style={LEDE}>{P.p3}</div>
      </div>
      <div style={LBL}>{P.codeLabel}</div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
        {otp.map((d, i) => (
          <input key={i} ref={el => { otpRefs.current[i] = el; }} value={d}
            onChange={e => setOtpAt(i, e.target.value)} onKeyDown={e => otpKey(i, e)}
            inputMode="numeric" aria-label={`${P.codeLabel} ${i + 1}`}
            style={{ ...FIELD, flex: 1, width: 'auto', textAlign: 'center', fontSize: 20, padding: '13px 0' }} />
        ))}
      </div>

      {/* THE REQUEST WAS NOT LOST AND SHE IS NOT TOLD IT WAS. She is verified — the
          session is written — and only the filing failed, so #21's own sentence stands
          and #21's own advice (message us) is the control beneath it. Verify is gone
          from this state deliberately: the code has been spent and offering it again
          would return 'Incorrect code.' for a fault that is not hers. F-42.140: a
          retry that re-files without re-verifying is owed and is not this sitting's. */}
      {!lost && cta(P.verify, onVerify, canVerify, 'verify')}
      {refusal && <div style={REFUSAL}>{refusal}</div>}
      {lost ? (
        <a href={TDW_WA_LINK} target="_blank" rel="noreferrer" style={ALT}>{SHEET_BYTES.messageTdw}</a>
      ) : (
        <div role="button" aria-disabled={busy} onClick={onResend} style={{ ...ALT, opacity: busy ? .45 : 1 }}>{P.resend}</div>
      )}
    </div>
  );
}

// `useSearchParams` requires a Suspense boundary in the app router, or the whole
// route opts into client-side rendering at build time. This page is in the sitemap
// and robots serves it, so the boundary is the arm that keeps it prerenderable —
// `force-dynamic` would make the estate's most crawlable new page pay per hit.
// The fallback is null: nothing is drawn twice and no spinner flashes at a stranger.
export default function PlanPage() {
  return (
    <Suspense fallback={null}>
      <PlanInner />
    </Suspense>
  );
}
