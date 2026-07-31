'use client';
// components/demo/DemoClaimSheet.tsx
//
// ── F-07.60 · THE CLAIM SHEET, ONE HOME ──────────────────────────────────────
// Extracted VERBATIM from app/demo/vendor/[handle]/page.tsx:263–313 at adf573d
// (the landing's own claim sheet) plus its submit hand, handleClaim, from :87–117.
//
// WHY IT MOVED. The header's Claim control ran
//     router.push(`/demo/vendor/${handle}?claim=1`)
// — a FULL navigation off whatever demo surface the vendor was standing on, onto
// the marketing landing, which then auto-opened this sheet as an overlay. A vendor
// inside the dark studio lost the studio to reach a form. The sheet is the thing he
// wanted; the landing was only where the sheet happened to live. So the sheet moved
// here, and every surface opens it IN PLACE.
//
// WHAT IS FROZEN AND WHY (CE-117's frozen-copy law, at the BYTE):
//   · every user-facing string below is the founder's vetoed byte — including the
//     `&apos;` ENTITIES at "didn't" and "We'll" (the entity is the byte, not the
//     glyph it renders), the U+2026 in "Sending…", and the U+2192 in "Claim Studio →".
//   · ":284"'s two sentences are ONE text node pair around a single `<br />`. They
//     are not two strings and must never be split into two.
//   · the geometry — zIndex 100 (scrim) / 101 (panel), position:fixed on both — is
//     carried VERBATIM per the CE's z-index ruling. The eight demo pages that mount
//     <Toast/> at zIndex 9999 can paint over this sheet; that overlap is FILED as an
//     observation to Block 08 and is deliberately NOT cured here.
//   · the POST target, method, headers and body shape are the proven pipe. Untouched.
//
// C2, RATIFIED VACUITY (CE ruling): the panel's `onClick={e => e.stopPropagation()}`
// travels byte-identical. It guards nothing today — the panel is a SIBLING of the
// scrim, not a child, so a click on the panel never bubbled through the scrim in the
// first place. No cell in the bench asserts its effect. It is recorded here so that
// nobody later "fixes" a no-op into a behaviour change.
//
// THE ORDER OF THE THREE STATES IS LOAD-BEARING — see the F-07.37 comment below.

import { useState } from 'react';

// Byte-identical to the constant this markup lived beside
// (app/demo/vendor/[handle]/page.tsx:16 at adf573d, and lib/demo/api.ts:7).
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://dream-os-production.up.railway.app';

// ── DISCLOSED DEVIATION 1 · THE FONT STACK IS LAYERED, NOT COPIED ────────────
// The landing declared these as LITERAL family names ("'Cormorant Garamond', …")
// because the landing — and only the landing — @imports those families from the
// Google CSS API in its own <style> block (page.tsx:140). The other EIGHTEEN
// surfaces this sheet now opens on get their fonts from next/font/google in the
// root layout, which self-hosts them under HASHED family names exposed only as CSS
// variables (app/layout.tsx:13–39). A literal "Cormorant Garamond" on the studio
// route resolves to nothing and falls through to Georgia.
//
// So the stack lists the variable FIRST and the literal SECOND. On the studio the
// variable wins; on the landing the variable ALSO wins (the root layout sets these
// vars on <html>, which the landing is inside) and resolves to the same typeface at
// the same weights — next/font loads Cormorant 300 italic, DM Sans 300, Jost 300/400,
// every face this sheet asks for. The literal survives as the belt to that braces.
// This is a rendering-fidelity fix, not a copy change: zero user-facing bytes move.
const F = {
  script: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
  body:   "var(--font-dm-sans), 'DM Sans', system-ui, sans-serif",
  label:  "var(--font-jost), 'Jost', system-ui, sans-serif",
};

// ── DISCLOSED DEVIATION 2 · THE PLACEHOLDER COLOUR TRAVELS WITH THE SHEET ────
// The phone input's placeholder was coloured by a GLOBAL rule in the landing's own
// <style> block (page.tsx:145 — `input::placeholder { color: rgba(240,230,210,0.3) }`).
// That rule does not exist on the eighteen other surfaces, so the extracted sheet
// would have rendered "00000 00000" in the browser's default grey there. The rule
// comes along, scoped to this input by class so it cannot reach any other field.
// The VALUE is unchanged from the landing's.
const PLACEHOLDER_CLASS = 'tdw-demo-claim-phone';

interface Props {
  open:       boolean;
  onClose:    () => void;
  handle:     string;
  /**
   * THE WIRE-HAZARD SEAM (CE-ruled, cell-required).
   *
   * The submit body's identity field was `vendor?.display_name ?? handle`, closing
   * over the LANDING's fetched vendor object. Eighteen of the nineteen surfaces have
   * no such object — the header carries `vendorName: string | null`, sourced on every
   * one of them from useDemoContext(handle) → `vendor?.display_name ?? null`, which is
   * the SAME value the landing computes. So the sheet takes the name as a prop and
   * mints `vendorName ?? handle` below: byte-equivalent to the old payload on every
   * caller, empty-string case included (`??` catches null/undefined only, both then
   * and now). The server does `vendor_name || handle` regardless
   * (dream-os src/api/demo/vendor.js:271) — but this seam is exactly where
   * "the POST is unchanged" would have quietly stopped being true, so it is benched.
   */
  vendorName: string | null;
}

export function DemoClaimSheet({ open, onClose, handle, vendorName }: Props) {
  const [claimPhone,   setClaimPhone]   = useState('');
  const [claimSending, setClaimSending] = useState(false);
  // F-07.37: a failed claim now has somewhere true to land.
  const [claimError,   setClaimError]   = useState(false);
  const [claimDone,    setClaimDone]    = useState(false);

  // The scrim's verb, unchanged: dismiss AND reset every state, so the next open is
  // a fresh sheet rather than a stale done-screen. The parent owns only `open`.
  function dismiss() {
    setClaimDone(false);
    setClaimError(false);
    setClaimPhone('');
    onClose();
  }

  async function handleClaim() {
    if (!claimPhone.trim() || claimSending) return;
    setClaimSending(true);
    // ── F-07.37 CURED · THE SCREEN HALF ───────────────────────────────────────
    // THIS BLOCK READ: `catch { /* silent — still show success */ }` followed by
    // an unconditional `setClaimDone(true)`. Both halves lied. The catch swallowed
    // network failure, and `res.ok` was never checked at all — so a 4xx/5xx
    // resolved normally and still ran the success screen. A vendor whose claim
    // never landed was shown "we'll be in touch" and then waited for a call that
    // could not come, because the row the founder's queue reads was never written.
    //
    // The server half shipped in P5's backend ZIP: the route returns 502 with
    // `ok:false` instead of `ok:true` (src/api/demo/vendor.js). This is the screen
    // learning to believe it. THE CURE TRAVELLED WITH THE MARKUP — moving a sheet
    // must never quietly un-cure the finding that was proven inside it.
    //
    // P5 is why it matters now: demo_lead_alert's {{3}} points real, unregistered
    // vendors at this exact flow. It is the first thing we ever say to them.
    try {
      const res = await fetch(`${API_BASE}/api/v2/demo/vendor/${handle}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: claimPhone.trim(), vendor_name: vendorName ?? handle }),
      });
      const data = await res.json().catch(() => ({} as any));
      if (!res.ok || data?.ok === false) throw new Error(`claim refused: ${res.status}`);
      setClaimDone(true);
    } catch {
      setClaimError(true);
    }
    setClaimSending(false);
  }

  if (!open) return null;

  return (
    <>
      <style>{`.${PLACEHOLDER_CLASS}::placeholder { color: rgba(240,230,210,0.3); }`}</style>
      <div onClick={dismiss} style={{ position:'fixed', inset:0, zIndex:100, background:'rgba(12,10,9,0.5)' }} />
      <div onClick={e => e.stopPropagation()} style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:101, background:'rgba(12,10,9,0.88)', backdropFilter:'blur(28px)', WebkitBackdropFilter:'blur(28px)', borderTop:'0.5px solid rgba(255,255,255,0.12)', borderRadius:'20px 20px 0 0', padding:`20px 24px calc(env(safe-area-inset-bottom, 16px) + 24px)` }}>
        {/* F-07.37 — THE FAILURE HAS A SCREEN. Ordered FIRST so a failed claim can
            never fall through into the welcome. The line is deliberately plain and
            actionable: it does not apologise, it does not blame the vendor, and it
            does not promise a follow-up we have no row to make. */}
        {claimError ? (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ fontFamily:F.script, fontStyle:'italic', fontWeight:300, fontSize:26, color:'rgba(248,247,245,0.95)', marginBottom:12 }}>That didn&apos;t go through.</div>
            <div style={{ fontFamily:F.body, fontWeight:300, fontSize:14, color:'rgba(248,247,245,0.55)', lineHeight:1.7, marginBottom:20 }}>Something went wrong on our end. Please try again.</div>
            <button
              onClick={() => { setClaimError(false); }}
              style={{ padding:'12px 28px', background:'rgba(248,247,245,0.92)', border:'none', borderRadius:10, fontFamily:F.label, fontSize:10, fontWeight:300, letterSpacing:'0.22em', textTransform:'uppercase', color:'#0C0A09', cursor:'pointer' }}
            >Try again</button>
          </div>
        ) : claimDone ? (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ fontFamily:F.script, fontStyle:'italic', fontWeight:300, fontSize:32, color:'rgba(248,247,245,0.95)', marginBottom:12 }}>Welcome to TDW.</div>
            <div style={{ fontFamily:F.body, fontWeight:300, fontSize:14, color:'rgba(248,247,245,0.55)', lineHeight:1.7 }}>Our team will reach out shortly.<br />We verify every profile personally.</div>
          </div>
        ) : (
          <>
            <div style={{ fontFamily:F.script, fontStyle:'italic', fontWeight:300, fontSize:22, color:'rgba(248,247,245,0.9)', marginBottom:4 }}>Claim Your Studio.</div>
            <div style={{ fontFamily:F.body, fontWeight:300, fontSize:13, color:'rgba(248,247,245,0.45)', marginBottom:20 }}>Enter your number. We&apos;ll reach out on WhatsApp.</div>
            <div style={{ display:'flex', alignItems:'center', borderBottom:'1px solid rgba(255,255,255,0.2)', marginBottom:20 }}>
              <span style={{ fontFamily:F.body, fontWeight:300, fontSize:13, color:'rgba(248,247,245,0.45)', paddingRight:12, borderRight:'1px solid rgba(255,255,255,0.15)', marginRight:12 }}>+91</span>
              <input
                className={PLACEHOLDER_CLASS}
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="00000 00000"
                value={claimPhone}
                onChange={e => setClaimPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                style={{ flex:1, background:'transparent', border:'none', outline:'none', fontFamily:F.body, fontWeight:300, fontSize:15, color:'rgba(248,247,245,0.9)', padding:'8px 0' }}
              />
            </div>
            <button
              onClick={e => { e.stopPropagation(); handleClaim(); }}
              disabled={claimPhone.length < 10 || claimSending}
              style={{ width:'100%', height:52, background: claimPhone.length >= 10 && !claimSending ? '#C9A84C' : 'rgba(201,168,76,0.3)', border:'none', borderRadius:100, cursor: claimPhone.length >= 10 && !claimSending ? 'pointer' : 'default', fontFamily:F.label, fontSize:10, fontWeight:400, letterSpacing:'0.2em', textTransform:'uppercase', color: claimPhone.length >= 10 && !claimSending ? '#0C0A09' : 'rgba(12,10,9,0.4)' }}
            >
              {claimSending ? 'Sending…' : 'Claim Studio →'}
            </button>
          </>
        )}
      </div>
    </>
  );
}
