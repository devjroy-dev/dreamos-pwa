'use client';
// ─────────────────────────────────────────────────────────────────────────────
// components/frost/EnquirySheet.tsx
// TDW_07 P5 — THE ENQUIRY SHEET.
//
// One tap on Enquire opens this; it prefills from her profile, she confirms or
// corrects, and it posts to POST /api/v2/discover/enquire — THEN hands off to
// WhatsApp (F1(a), CE-ruled: the sheet posts, then the wa.me handoff runs, so
// the pipeline is fed AND the only path that has ever worked keeps working).
//
// ── THE READ-ONLY ASYMMETRY IS THE HONEST PART OF THIS FILE ─────────────────
// `functions` and `budget` land on `leads.event_types` / `leads.budget_max` for
// a REAL vendor. `demo_leads` has NO column for either (13 columns, witnessed).
// So on a DEMO card those two rows render display-only.
//
// CE-ruled 2026-07-31, and the reasoning is worth keeping where the code is: a
// sheet that shows a field, lets her EDIT it, posts, and silently discards the
// edit is the costume class in form-shape. She corrects her budget, the door
// throws the correction away, and nothing in the interface ever says so.
// Display-and-confirm is honest. Edit-and-discard is not.
//
// ── NO localStorage IN THIS FILE ────────────────────────────────────────────
// Session comes from `getCoupleSession()` (lib/frost-api/_base.ts:127), the one
// authority — which carries the `tdw_couple_session` COOKIE FALLBACK that
// protocol §4 names settled for iOS Safari. A raw storage read has no fallback
// and loses the session on exactly the devices the fallback exists to rescue.
//
// RN-PORTABLE (spec §6): presentational over a typed client, no <form>, no
// browser-only API in the logic. Pointer/press handlers only.
import React from 'react';
import { API_BASE, getCoupleSession } from '@/lib/frost-api/_base';
import { fetchCoupleMe } from '@/lib/frost-api/couple';
import { BUDGET_BANDS, bandForAmount } from '@/lib/frost/budgetBands';

export interface EnquirySheetVendor {
  id: string;
  name: string | null;
  is_demo?: boolean;
}

export interface EnquiryResult {
  /**
   * F-07.45 SURFACE ARM. `ok` is the SERVER's fact about whether the enquiry
   * EXISTS where the vendor will find it (the lead row / the demo_leads row) —
   * it is no longer hardcoded true at the door, so V6's failure toast is
   * reachable for the first time.
   */
  ok: boolean;
  sent?: boolean;
  /**
   * Whether the WhatsApp PING left. INDEPENDENT of `ok` by ruling: the toast
   * claims the ROW, not the PING, and the enquiry reaches his Leads tab either
   * way. Carried so the fact is witnessable rather than inferred; it drives NO
   * copy — a visible line about a refused ping would be a NEW user-facing
   * string and belongs in a veto slot, not in a build.
   */
  vendor_notified?: boolean;
  /** The typed refusal code when the ping did not leave (e.g. 'window_closed'). */
  notify_refusal?: string | null;
  enquiry_saved?: boolean;
}

interface Props {
  vendor: EnquirySheetVendor;
  /** The wa.me destination. F1(a): opened AFTER the post, never instead of it. */
  enquireLink: string | null;
  onClose: () => void;
  onDone: (r: EnquiryResult) => void;
}

// FOUNDER-VETOED 2026-07-31, byte-exact. A change here needs a new veto.
const LABEL_FUNCTIONS = 'Functions';
const LABEL_DATE      = 'Wedding date';
const LABEL_CITY      = 'City';
const LABEL_BUDGET    = 'Budget';
const SUBMIT_WORD     = 'Send enquiry';
// ── FORK B (CE-ruled) · THE FROZEN CONFIRMATION, RE-HOMED ────────────────────
// These two are the V6 vetoed toasts, BYTE-IDENTICAL to sanctuary:1806's
// success arms. They are not new copy: the founder's word moved WHERE they
// render, not WHAT they say. The `enquiry_saved` conditional is the same one.
// The FAILURE arm ('Could not send. Try again.') deliberately does NOT move —
// it stays a toast, byte-and-firing untouched, because it is F-07.45's arm.
const CONFIRM_SAVED   = 'Enquiry sent ✦ saved in Vendors';
const CONFIRM_PLAIN   = 'Enquiry sent';
// The one NEW string this sitting ships. Founder-vetoed verbatim 2026-07-31.
const CONTINUE_WORD   = 'Continue on WhatsApp';
const EXPECTATION     = 'Replies on WhatsApp, usually within a day.';

const FF = {
  script: "'Cormorant Garamond',serif",
  label:  "'Jost',sans-serif",
  body:   "'DM Sans',sans-serif",
};

// The one gold on this screen belongs to the submit control (§3: one gold per
// screen, Enquire owns it). Nothing else here may use it.
const GOLD = '#C9A84C';

const rowStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  gap: 12, padding: '13px 0',
  borderBottom: '0.5px solid rgba(255,255,255,0.10)',
};
const labelStyle: React.CSSProperties = {
  fontFamily: FF.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.18em',
  textTransform: 'uppercase', color: 'rgba(248,247,245,0.42)', flexShrink: 0,
};
const valueStyle: React.CSSProperties = {
  fontFamily: FF.body, fontWeight: 300, fontSize: 14,
  color: 'rgba(248,247,245,0.92)', textAlign: 'right', minWidth: 0,
};

export default function EnquirySheet({ vendor, enquireLink, onClose, onDone }: Props) {
  const isDemo = !!vendor.is_demo;

  // ── PREFILL NEVER BLOCKS THE RENDER ────────────────────────────────────────
  // The body was gated behind `loading`, and `loading` waited on fetchCoupleMe —
  // one of the six endpoints returning 403 under F-07.44. So the sheet waited on
  // a round-trip that could not succeed, and the founder watched it arrive late.
  // The comment below already said "prefill is a courtesy"; the code made it a
  // precondition. Fields render at once and fill in if the profile arrives.
  const [entered, setEntered]   = React.useState(false);
  const [sending, setSending]   = React.useState(false);
  const [functions, setFunctions] = React.useState<string>('');
  const [weddingDate, setWeddingDate] = React.useState<string>('');
  const [city, setCity]         = React.useState<string>('');
  const [band, setBand]         = React.useState<string | null>(null);
  const [bandOpen, setBandOpen] = React.useState(false);
  // FORK B: the sheet no longer vanishes on success. `done` holds the server's
  // own result and turns this surface into the confirming one.
  const [done, setDone] = React.useState<EnquiryResult | null>(null);

  // One frame after mount, flip to the resting transform — the sheet RISES
  // rather than appearing. Without it the sheet popped in while the panel beneath
  // was still playing its own 340ms slide, and two animations disagreeing is what
  // the founder saw as the form "rising from behind the enquire card".
  React.useEffect(() => {
    const t = setTimeout(() => setEntered(true), 16);
    return () => clearTimeout(t);
  }, []);

  const session = React.useMemo(() => getCoupleSession(), []);
  const coupleId = session?.id || undefined;

  // ── PREFILL ───────────────────────────────────────────────────────────────
  // `CoupleMe` carries wedding_date, wedding_city and budget_total — witnessed
  // at lib/types/bride.ts:24-32. It carries NO functions field, so that row
  // starts EMPTY and editable: there is nothing to prefill it from, and an
  // invented default would be a claim about her wedding she never made.
  React.useEffect(() => {
    let alive = true;
    (async () => {
      if (!coupleId) return;
      try {
        const r = await fetchCoupleMe(coupleId);
        if (!alive || !r?.couple) return;
        setWeddingDate(r.couple.wedding_date || '');
        setCity(r.couple.wedding_city || '');
        const b = bandForAmount(r.couple.budget_total);
        setBand(b ? b.value : null);
      } catch (err) {
        // ── P2 SCOPE (CE Ruling 3) · THE SWALLOWED BODY IS NOW LOUD ────────────
        // This catch discarded the ONE byte that identified the failure. The
        // prefill 403 was diagnosed from a Content-Length in a screenshot because
        // the message never reached a log: 'No couple profile found.' (the auth
        // identity resolved to no couple) and 'Forbidden.' (the id did not match)
        // are different diseases and this line made them the same silence.
        // The MECHANISM cure is the AUTH SITTING's by name — the shared
        // `access_token` key that lets a vendor login overwrite a bride's token.
        // Prefill stays a courtesy: its absence still never blocks the enquiry.
        console.warn(
          `[enquiry] prefill unavailable for couple ${coupleId} — ` +
          `${err instanceof Error ? err.message : String(err)}. ` +
          'The sheet renders empty and editable; the enquiry is unaffected.',
        );
      }
    })();
    return () => { alive = false; };
  }, [coupleId]);

  const bandLabel = React.useMemo(
    () => BUDGET_BANDS.find((b) => b.value === band)?.label ?? null,
    [band],
  );

  async function submit() {
    if (sending) return;
    setSending(true);
    let result: EnquiryResult = { ok: false };
    try {
      const res = await fetch(`${API_BASE}/api/v2/discover/enquire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendor_id:  vendor.id,
          couple_id:  coupleId,
          bride_name: session?.name || undefined,
          // THE FOUR. Sent only where the door can honestly land them — the two
          // read-only rows on a demo card are never posted, because the demo leg
          // has no column for them and posting would invite exactly the
          // edit-and-discard this sheet's shape exists to prevent.
          functions:    isDemo ? undefined : splitFunctions(functions),
          wedding_date: weddingDate || undefined,
          city:         city || undefined,
          budget_band:  isDemo ? undefined : (band ?? undefined),
        }),
      });
      // res.ok is CHECKED. A 4xx resolves normally from fetch, and an unchecked
      // await is how the old sanctuary handler told brides "Vendor notified"
      // over three different refusals (F-07.39).
      if (!res.ok) throw new Error(`enquire refused: ${res.status}`);
      const data = await res.json().catch(() => ({} as Record<string, unknown>));
      if (data && (data as { ok?: boolean }).ok === false) throw new Error('enquire reported failure');
      result = {
        ok: true,
        sent: (data as { sent?: boolean }).sent,
        vendor_notified: (data as { vendor_notified?: boolean }).vendor_notified,
        notify_refusal: (data as { notify_refusal?: string | null }).notify_refusal ?? null,
        enquiry_saved: (data as { enquiry_saved?: boolean }).enquiry_saved,
      };
      // The ping's fate is LOGGED, never rendered. It is the line the founder's
      // walk reads to witness F-07.45's transport arm end to end, and it is the
      // only place a refused ping is visible on this surface by design.
      if (result.vendor_notified === false) {
        console.warn(
          `[enquiry] stored, but the vendor's WhatsApp ping did not leave ` +
          `(refusal: ${result.notify_refusal ?? 'unknown'}). His Leads tab still has it.`,
        );
      }
    } catch {
      result = { ok: false };
    }
    setSending(false);

    // ── F1(b) CURED (CE-ruled, Option 3) · THE AUTO-FIRE IS DEAD ─────────────
    // This handler used to open the wa.me window itself, unasked, in the same
    // tick as the POST. Two channels opened from one tap: the enquiry landed in
    // our pipeline AND WhatsApp took the screen, so she could not tell which of
    // the two had actually reached the vendor. The link SURVIVES — it is the
    // vendor line's arrival contract — but it is now a DELIBERATE affordance she
    // taps, rendered in the done-state below, never a thing that happens to her.
    //
    // The demo species reaches this with `enquireLink === null` by construction
    // (both mints null it: couple/discover.js's demo branch and demo/vendor.js),
    // so a demo card renders the confirmation and NO affordance. That is the
    // F-07.54 cure showing through the surface.
    if (result.ok) setDone(result);
    onDone(result);
  }

  return (
    <>
      <div
        onClick={onClose}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        style={{ position: 'fixed', inset: 0, zIndex: 120, background: 'rgba(12,10,9,0.55)', touchAction: 'auto',
                 opacity: entered ? 1 : 0, transition: 'opacity 260ms ease' }}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        // ── GESTURE ISOLATION — ONE HOME, EVERY MOUNT ────────────────────────
        // Both surfaces that host this sheet sit inside gesture-owning
        // containers: the canvas deck's drawer has onTouchStart/Move/End for
        // drag-to-dismiss, and sanctuary's DiscoverRoom root has its own touch
        // handlers plus `touchAction:'none'`. Without this, a touch on a FIELD
        // bubbles up and is read as a deck swipe — which is precisely how the
        // card vanished the moment the founder tapped an input.
        //
        // Isolating HERE rather than at each mount means a third surface
        // inherits the fix instead of rediscovering the bug. `touchAction:'auto'`
        // re-enables native input behaviour that an ancestor's 'none' suppresses.
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        style={{
          touchAction: 'auto',
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 121,
          background: 'rgba(12,10,9,0.90)',
          backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
          borderTop: '0.5px solid rgba(255,255,255,0.12)',
          borderRadius: '20px 20px 0 0',
          padding: '20px 24px calc(env(safe-area-inset-bottom, 16px) + 22px)',
          maxHeight: '82vh', overflowY: 'auto',
          transform: entered ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 340ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.18)' }} />
        </div>

        <div style={{ fontFamily: FF.script, fontStyle: 'italic', fontWeight: 300, fontSize: 24, color: 'rgba(248,247,245,0.95)', marginBottom: 2 }}>
          {vendor.name || 'This vendor'}
        </div>
        <div style={{ fontFamily: FF.body, fontWeight: 300, fontSize: 13, color: 'rgba(248,247,245,0.42)', marginBottom: 16 }}>
          {EXPECTATION}
        </div>

        {done ? (
          /* ── FORK B · THE DONE-STATE ─────────────────────────────────────────
             The confirming surface. It renders the frozen string (same
             `enquiry_saved` conditional as the toast it replaces) and, ONLY when
             a lawful address exists, the affordance. No wa.me link is derivable
             for a demo row, so a demo card ends here with the confirmation alone.
             The sheet's single gold moves from the submit button to this control,
             which keeps the one-gold-per-screen house law exactly satisfied. */
          <div style={{ paddingTop: 4 }}>
            <div style={{ fontFamily: FF.body, fontWeight: 300, fontSize: 15, color: 'rgba(248,247,245,0.92)', marginBottom: 4 }}>
              {done.enquiry_saved ? CONFIRM_SAVED : CONFIRM_PLAIN}
            </div>
            <div style={{ fontFamily: FF.body, fontWeight: 300, fontSize: 13, color: 'rgba(248,247,245,0.42)', marginBottom: 20 }}>
              {EXPECTATION}
            </div>
            {enquireLink && (
              <button
                onClick={() => { try { window.open(enquireLink, '_blank'); } catch { /* popup blocked; the enquiry is already stored */ } }}
                style={{
                  width: '100%', padding: '14px 0',
                  background: GOLD, border: 'none', borderRadius: 10,
                  fontFamily: FF.label, fontSize: 10, fontWeight: 300,
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: '#0C0A09', cursor: 'pointer', touchAction: 'manipulation',
                }}
              >
                {CONTINUE_WORD}
              </button>
            )}
          </div>
        ) : (
          <>
            {/* FUNCTIONS — read-only on a demo card (no demo_leads column) */}
            <div style={rowStyle}>
              <span style={labelStyle}>{LABEL_FUNCTIONS}</span>
              {isDemo ? (
                <span style={{ ...valueStyle, color: 'rgba(248,247,245,0.55)' }}>{functions || '—'}</span>
              ) : (
                <input
                  value={functions}
                  onChange={(e) => setFunctions(e.target.value)}
                  placeholder="Mehendi, Sangeet…"
                  style={{ ...valueStyle, background: 'none', border: 'none', outline: 'none', flex: 1 }}
                />
              )}
            </div>

            <div style={rowStyle}>
              <span style={labelStyle}>{LABEL_DATE}</span>
              <input
                type="date"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                style={{ ...valueStyle, background: 'none', border: 'none', outline: 'none', colorScheme: 'dark' }}
              />
            </div>

            <div style={rowStyle}>
              <span style={labelStyle}>{LABEL_CITY}</span>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="—"
                style={{ ...valueStyle, background: 'none', border: 'none', outline: 'none', flex: 1 }}
              />
            </div>

            {/* BUDGET — read-only on a demo card (no demo_leads column) */}
            <div style={{ ...rowStyle, borderBottom: 'none' }}>
              <span style={labelStyle}>{LABEL_BUDGET}</span>
              {isDemo ? (
                <span style={{ ...valueStyle, color: 'rgba(248,247,245,0.55)' }}>{bandLabel || '—'}</span>
              ) : (
                <button
                  onClick={() => setBandOpen((v) => !v)}
                  style={{ ...valueStyle, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {bandLabel || '—'}
                </button>
              )}
            </div>

            {bandOpen && !isDemo && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '4px 0 12px' }}>
                {BUDGET_BANDS.map((b) => (
                  <button
                    key={b.label}
                    onClick={() => { setBand(b.value); setBandOpen(false); }}
                    style={{
                      padding: '7px 12px', borderRadius: 8, cursor: 'pointer',
                      fontFamily: FF.body, fontWeight: 300, fontSize: 12,
                      background: band === b.value ? 'rgba(248,247,245,0.14)' : 'transparent',
                      border: '0.5px solid rgba(255,255,255,0.16)',
                      color: 'rgba(248,247,245,0.86)',
                    }}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={submit}
              disabled={sending}
              style={{
                width: '100%', marginTop: 18, padding: '14px 0',
                background: GOLD, border: 'none', borderRadius: 10,
                fontFamily: FF.label, fontSize: 10, fontWeight: 300,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: '#0C0A09', cursor: sending ? 'default' : 'pointer',
                opacity: sending ? 0.6 : 1, touchAction: 'manipulation',
              }}
            >
              {SUBMIT_WORD}
            </button>
          </>
        )}
      </div>
    </>
  );
}

/**
 * "Mehendi, Sangeet" → ['Mehendi','Sangeet'].
 * Mirrors the door's own `normalizeFunctions` contract: blanks are dropped, and
 * an empty result is `undefined` — absent, never an empty ARRAY write, because
 * an empty array claims she told us she has no functions.
 */
function splitFunctions(raw: string): string[] | undefined {
  const parts = raw.split(',').map((s) => s.trim()).filter(Boolean);
  return parts.length ? parts : undefined;
}
