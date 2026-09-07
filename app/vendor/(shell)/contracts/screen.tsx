// R-37.84 (3): Cormorant italic dies in room prose. ZIP 7 moved the `script` ROLE to the
// body family; what survived was `fontStyle: italic` set beside it — italic sans, which
// still reads as the old voice. The mock's screen four killed the pairing, not just the
// family. Italic survives only where a surface sets it WITHOUT the script role.
'use client';
// app/vendor/contracts/screen.tsx — THE CONTRACTS BODY, NO CHROME.
//
// ── §4-4 · CONTRACTS CROSSES · R-38.11 · R-38.12 ───────────────────────────
// Two routes render this module and neither owns it: `app/w/contracts/page.tsx` mounts it
// inside `WorklistShell`, and `app/vendor/contracts/page.tsx` survives as the untouched
// fallback and supplies the old `<Header/>` itself. IMPORTED by both, copied by neither.
//
// ── THE `Header` IMPORT IS GONE FROM THIS FILE AND ITS ABSENCE IS ASSERTED ──
// S2's `SliceShell` finding: a conditional does not remove a module from a bundle; only not
// importing it does. The mount lives at the fallback ROUTE.
//
// ── THE MASTHEAD ROW RETIRES WHOLE, WHICH IS DIFFERENT FROM ITS TWO SIBLINGS ─
// Portfolio's and Couture's rows kept their right halves because those carried the only way
// to add a photo and the only way to add a slot. THIS row is a chevron and the word
// 「CONTRACTS」 and nothing else — no action rides on it — so inside the shell it goes
// entirely, hairline included. F-38.18's kin: founder-vetoed prose retires WITH the surface
// it described, and a row kept for symmetry with its siblings would be chrome kept for the
// look of the diff.
//
// ── `vendorName` LEFT WITH THE MOUNT, AND SO DID EVERY PROP ────────────────
// It was the component's ONLY parameter and it fed only `<Header>`. Derived, not assumed:
// after the lift the signature was empty. This body reads its own data through the API
// client and needs nothing from either route.
//
// ── THE DECLARED GAPS ──────────────────────────────────────────────────────
// The body carries the rooms' older type register and F-38.22's colour literals (R-38.12).
// Its upload and detail sheets are full-cover `position:fixed` with live catchers, which
// R-38.22 has ruled the estate's standing sheet behaviour. The FAB reads the tree (F-38.59).

import { useEffect, useState, useRef } from 'react';
import { INK_DEEP } from '@/lib/vendor/theme';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Fab } from '@/components/worklist/Fab';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { fetchAllContracts, requestContractUpload, finalizeContract,
         updateContract, sendContract, fetchContractDownload, cancelContract,
         requestContractPreview, sendContractToCouple, markContractDeposit, updateClientPhone,
         fetchTypedClients, composeContract, fillContract, fetchCabinet,
         fetchContractProfile, saveContractProfile, fetchAnnexMap, fetchMe } from '@/lib/vendor/api/vendor';
// TDW_09 R-U25: the ONE money home. A second formatter here would be a second
// way to write Rs 18,000, and the estate has spent a finding on that already.
import { formatRs } from '@/lib/vendor/format';
import type { Contract, Client, ContractProfileFields, AnnexOption,
              AnnexMapResponse } from '@/lib/vendor/types/vendor';

// ── THE ANNEXES ARE NO LONGER TYPED HERE — RULING F8, ONE HOME ─────────────
// ⚠ A SEVEN-NAME LITERAL STOOD AT THIS SPOT AND ITS OWN COMMENT SAID WHY IT
// SHOULD NOT: *a name typed twice would be two homes for one heading.* It was
// typed twice anyway — here and at `contractPdf.js` — and the comment describing
// a category map that did not exist had governed nothing for two sittings.
//
// The headings and the map now live in `src/lib/contractAnnex.js`, below both
// readers and importing neither, and reach this room through
// `GET /api/v2/vendor/contracts/annex-map`. The room asks; it does not know.
//
// ⚠ WHICH MEANS THE ROOM CANNOT ANSWER FROM MEMORY WHEN THE READ FAILS, and
// that is a property rather than a cost: a hardcoded fallback list would be the
// third home, and it would draw seven annexes for a vendor whose real offer the
// room had just failed to learn.

const A = {
  // R-37.74 arm (iii): the interactive half of the old `brass`. Buttons, chips, carets
  // and active states read this; the wordmark, section headers and hairlines keep `brass`.
  interactive:     'var(--atelier-accent-text)',
  interactiveWarm: 'var(--atelier-accent-text)',
  ink: 'var(--atelier-ink)', inkSoft: 'var(--atelier-ink-soft)', inkMute: 'var(--atelier-ink-mute)',
  brass: 'var(--role-metal)', brassWarm: 'var(--atelier-label)', green: 'var(--role-positive)', red: 'var(--role-critical)',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script: 'var(--font-dm-sans), system-ui, sans-serif' /* R-37.76 (3)+(7): Cormorant is RETIRED FROM PROSE. The rooms were setting body copy in Cormorant italic while the shell set it in DM Sans, and that — not size — is why they read as two font worlds. One family, one job. Cormorant's feature use survives where a surface deliberately calls for it. */,
  body: 'var(--font-dm-sans), system-ui, sans-serif',
  label: 'var(--font-jost), system-ui, sans-serif',
} as const;

const STATE_COLOR: Record<string, string> = {
  draft: A.inkMute, sent: A.brassWarm, signed: A.green, cancelled: A.red,
};

// ── F-40.116 · THE STATE WORD IS THE DATABASE'S, TITLE-CASED ────────────────
// This room printed `{c.state}` RAW, so it said `draft` in lowercase while the
// invoice document — the other paper the same couple receives — said `Unpaid`.
// One estate, two vocabularies for one kind of fact.
//
// ⚠ A POSITIVE LIST, for the reason `invoicePdf.js:57` gives for its own: an
// unknown fifth state must fall through to something HONEST rather than be
// captioned by a default that assumes. `contracts_state_check` allows exactly
// these four, so the fallback is unreachable today and is kept anyway — the
// day it becomes reachable is the day it matters.
// Veto sheet rows 1–4, founder-vetoed 2026-09-06.
const STATE_WORD: Record<string, string> = {
  draft: 'Draft', sent: 'Sent', signed: 'Signed', cancelled: 'Cancelled',
};
const stateWord = (s: string) => STATE_WORD[s] ?? s;

// ── THE DEPOSIT LINE — veto rows 5-8 ───────────────────────────────────────
// ⚠ `deposit_pct === null` MEANS NOT SET AND NEVER ZERO. The CHECK forbids zero
// precisely so the two cannot be confused; the room says `No deposit set` rather
// than drawing `Rs 0`, which would be a figure nobody entered.
//
// ⚠ AND A CANCELLED CONTRACT'S DEPOSIT IS `not taken`, NOT `cancelled`. Saying
// cancelled twice on one row tells a vendor nothing; the money under clause 5 is
// a question for her, and the row states the fact rather than the verdict.
function depositLine(c: Contract, fee: number | null): string {
  if (c.deposit_pct === null || c.deposit_pct === undefined) return 'No deposit set';
  const amount = fee === null ? null : Math.round((fee * c.deposit_pct) / 100);
  const money = amount === null ? `${c.deposit_pct}%` : `Rs ${formatRs(amount)}`;
  if (c.state === 'cancelled') return `Deposit ${money} \u00b7 not taken`;
  if (c.deposit_received_at) {
    const d = new Date(c.deposit_received_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    return `Deposit ${money} \u00b7 received ${d}`;
  }
  return `Deposit ${money} \u00b7 awaiting`;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', boxSizing: 'border-box',
  background: 'var(--atelier-input-bg)', border: '0.5px solid var(--atelier-input-border)', borderRadius: 2,
  fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.ink, outline: 'none',
  caretColor: A.interactive,
};
const labelStyle: React.CSSProperties = {
  fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.inkMute,
  letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 6,
};


// ══ THE PROFILE SHEET — Q1–Q10, ratified frame `R4-profile` ════════════════
//
// ⚠ EVERY LABEL BELOW IS A VETOED BYTE AND EVERY KEY BESIDE IT IS THE REGISTER'S
// OWN TOKEN NAME. The two are deliberately different vocabularies and the split
// is the whole design: the token names are the INSTRUMENT'S — `cancel_tier_2_pct`,
// `late_interest_pct`, `fm_window_months` — and a vendor should never meet one.
// She meets 「60–90 days before」. The register says so in as many words at Q6.
//
// ⚠ AND TDW AUTHORS NOT ONE OF THE VALUES. Not a price, not a percentage, not a
// day-count. This table is labels and keys; every value on the sheet came from
// her, and a blank one prints as a blank (R-40.88, and Q2 says it to her face).
//
// ⚠ THE KEYS WERE READ OUT OF `TDW_19_CONTRACT_FIELD_REGISTER_v2.md`, NOT
// INVENTED HERE — §1 `vendor_signatory_name`, §4 `overtime_rate`/`overtime_unit`/
// `late_grace_days`/`late_interest_pct`/`gst_treatment`/`gst_pct`, §5
// `travel_terms`, §6 the postpone and cancel families, §7 the delivery family,
// §8 `meals_provision`/`takedown_days`/`fm_window_months`. `contractSource.js`
// already reads `gst_pct` and `gst_treatment` off this exact object, which is
// the proof that the shape is the estate's and not this file's.
type ProfileRow = { key: string; label: string };
type ProfileSection = { head: string; rows: ProfileRow[] };

const PROFILE_SECTIONS: ProfileSection[] = [
  { head: 'Your business', rows: [
    { key: 'vendor_category_words', label: 'What you do' },
    { key: 'vendor_signatory_name', label: 'Who signs' },
    { key: 'vendor_credit_role',    label: 'Credited as' },
  ] },
  { head: 'What is not included', rows: [
    { key: 'exclusions',      label: 'Never included' },
    { key: 'meals_provision', label: 'Meals on a long day' },
  ] },
  { head: 'Money', rows: [
    { key: 'travel_terms',      label: 'Travel and stay' },
    { key: 'overtime_rate',     label: 'Extra hours' },
    { key: 'overtime_unit',     label: 'Charged per' },
    { key: 'late_grace_days',   label: 'Late after' },
    { key: 'late_interest_pct', label: 'Late charge' },
  ] },
  // ⚠ THE FOUR SLAB LABELS ARE GENERATED, NOT TYPED — see `slabLabels` below.
  // They are listed here with the ratified wording so the section reads in order
  // and so a reader can see the shape; the render replaces the four.
  { head: 'If plans change', rows: [
    { key: 'postpone_notice_days',   label: 'Postpone notice' },
    { key: 'postpone_window_months', label: 'Move within' },
    { key: 'cancel_tier_1_pct',      label: 'More than 90 days before' },
    { key: 'cancel_tier_2_pct',      label: '60\u201390 days before' },
    { key: 'cancel_tier_3_pct',      label: '30\u201360 days before' },
    { key: 'cancel_tier_4_pct',      label: 'Under 30 days before' },
    { key: 'refund_days',            label: 'Refund within' },
    { key: 'deposit_refundable',     label: 'Is the deposit refundable?' },
  ] },
  { head: 'What you deliver', rows: [
    { key: 'delivery_days',    label: 'Delivered within' },
    { key: 'delivery_method',  label: 'How' },
    { key: 'link_live_days',   label: 'Link stays live' },
    { key: 'revision_rounds',  label: 'Rounds of changes' },
    { key: 'revision_rate',    label: 'Each further round' },
    { key: 'archive_months',   label: 'Files kept for' },
  ] },
  { head: 'Publication', rows: [
    { key: 'takedown_days',    label: 'Take down within' },
    { key: 'fm_window_months', label: 'Move dates within' },
  ] },
  { head: 'Tax', rows: [
    { key: 'gst_treatment', label: 'GST' },
    { key: 'gst_pct',       label: 'Rate' },
  ] },
];

/**
 * THE FOUR CANCELLATION LABELS, BUILT FROM HER OWN THRESHOLDS.
 *
 * ⚠ THE REGISTER CARRIES THREE `cancel_tier_N_days` TOKENS AND THE SHEET ASKS
 * FOR NONE OF THEM — the frame has eight rows in this section and not eleven.
 * So the thresholds are read where they exist and the ratified wording stands
 * where they do not. That is not TDW authoring a policy: 90 / 60 / 30 are the
 * bytes the founder vetoed on `R4-profile`, and the moment she has her own
 * numbers the labels are hers.
 *
 * ⚠ AND THE FOURTH LABEL HAS NO THRESHOLD OF ITS OWN, because it is the
 * remainder — everything under tier 3. It reads the same number tier 3 opens on,
 * which is why there are four slabs and three thresholds and not four of each.
 */
function slabLabels(f: ContractProfileFields): [string, string, string, string] {
  const d = (k: string, fallback: string) => {
    const v = (f[k] || '').trim();
    return v === '' ? fallback : v;
  };
  const t1 = d('cancel_tier_1_days', '90');
  const t2 = d('cancel_tier_2_days', '60');
  const t3 = d('cancel_tier_3_days', '30');
  return [
    `More than ${t1} days before`,
    `${t2}\u2013${t1} days before`,
    `${t3}\u2013${t2} days before`,
    `Under ${t3} days before`,
  ];
}

// ══ THE CLAUSE SWITCHES — T1-clauses, veto rows 16–29 ══════════════════════
//
// ⚠ EVERY KEY BELOW WAS READ OUT OF `src/lib/contractPdf.js` AT `6e590ec`, NOT
// AGREED IN A KICKOFF AND NOT INVENTED HERE. The renderer's `CLAUSE_SWITCHES`
// is the six, in this order, and it reads them at `contract.terms.clauses.<key>`
// through its own `switchOn`. A key spelled differently on this plane would be a
// switch a vendor moves and a document that never notices.
//
// ⚠ AND THE DEFAULT IS ON. `switchOn` returns true unless the value is EXPLICITLY
// `false` — an absent switch is a vendor who has not touched it, not one who
// turned it off. A default of off here would make her contract quietly thinner
// than the surface she reviewed, and the two planes would disagree about a
// document nobody had edited.
//
// ⚠ `publication` IS NOT IN THIS LIST AND MUST NEVER BE ADDED. Clause 10 has no
// switch: a Vendor's toggle governs whether a clause is PRINTED, never whether
// the Client's consent is ON. The renderer's header says it, `b56` reds on a
// mutation that adds it, and row 22 says it to the vendor in her own words at
// the one place the absence is conspicuous.
const CLAUSE_SWITCHES: { key: string; label: string }[] = [
  { key: 'accommodation',      label: 'Accommodation and travel' },
  { key: 'late_payment',       label: 'Late payment charge' },
  { key: 'extra_hours',        label: 'Extra hours' },
  { key: 'tax_block',          label: 'Tax block' },
  { key: 'named_professional', label: 'A named professional' },
  { key: 'portfolio_use',      label: 'Portfolio use' },
];

/** The renderer's `switchOn`, and it is the same sentence in two languages
 *  because there is no third place to put it: `contractPdf.js` cannot be
 *  imported here and this room cannot ask a door for six booleans it already
 *  holds on the row. The twin is named so a later seat changing one goes
 *  looking for the other. */
function switchOn(terms: Record<string, unknown>, key: string): boolean {
  const s = (terms.clauses as Record<string, unknown> | undefined) || {};
  return s[key] !== false;
}

/**
 * CLAUSE 5'S GATE — A FACT, NOT A CONTROL.
 *
 * ⚠ THE SWITCH CAN CLOSE THIS GATE AND CAN NEVER OPEN IT. v4 omits clause 5
 * whole where no function is outside the Vendor's city, so an in-city wedding
 * prints no accommodation clause whatever the switch says. The row therefore
 * renders only when the gate is open, and the switch beside it is a WAIVER — a
 * vendor who lives near the venue, or has family there.
 *
 * ⚠ IT READS THE RECORD THE ROOM ALREADY HOLDS. `terms.functions` is keyed by
 * event id with `venue` and `city` on each — the same object the renderer's
 * clause 3 table reads — and `vendors.city` arrives on `GET /me`. No door
 * returns the fact and none is asked for one: the chair's second arm.
 *
 * ⚠ THE TWIN IS `contractPdf.js:393` AND IT IS NAMED RATHER THAN FORGOTTEN.
 * That copy iterates the EVENTS and looks each up by id; this one iterates the
 * TERMS, because the room has no event list. The difference is real and bounded:
 * a `terms.functions` entry whose event was deleted counts here and not there,
 * which can only ever draw a row the document then omits — the safe direction,
 * and the opposite mistake would hide a clause she is entitled to.
 */
function outstationGate(terms: Record<string, unknown>, vendorCity: string | null): boolean {
  const fns = (terms.functions as Record<string, { city?: string }> | undefined) || {};
  const base = String(vendorCity || '').trim().toLowerCase();
  if (!base) return false;
  return Object.values(fns).some((k) => {
    const c = String((k && k.city) || '').trim().toLowerCase();
    return c !== '' && c !== base;
  });
}

// ══ WHAT IS NEEDED BEFORE SHE CAN SEND — T3-preview, rows 40–41 ════════════
//
// ⚠ THE REGISTER NAMES SIX AND THE DOOR REFUSES ON NONE OF THEM YET. Packet 2
// rebuilt the renderer and did not touch `src/api/vendor/contracts.js`; the
// `{ code: 'required_missing', fields }` refusal the kickoff's ladder named does
// not exist at `6e590ec` — census run, zero hits in `src/`. So this list is the
// ROOM'S, derived from the row and the profile it already holds, and it is a
// SECOND home for a rule the door does not yet carry rather than a duplicate of
// one it does. When the refusal ships, this reads it and the derivation goes.
//
// ⚠ EACH ROW IS DERIVED FROM THE SAME PLACE THE RENDERER WOULD READ IT, so the
// two cannot disagree about a document nobody has edited:
//   · the number    — `clients.phone`, through the row, never the input box
//   · the functions — `terms.functions`, the renderer's clause 3 source
//   · the fee       — `terms.fee_total`, OR an invoice, which `deriveMoney`
//                     prefers when one exists (`invoice.amount_total ?? T.fee_total`)
//   · the deposit   — `contracts.deposit_pct`; `null` is NOT SET and never zero
//   · delivery      — `delivery_days`, PROFILE, REQUIRED at v4 because clause 4.7
//                     and clause 11 both add days to a period that must exist
//   · who signs     — `vendor_signatory_name`, PROFILE, REQUIRED at v4 by ruling
//                     F7: a seal that names the Client and not the Vendor is half
//                     a witness
type RequiredRow = { label: string; value: string | null };

function requiredRows(
  c: Contract, terms: Record<string, unknown>, depositPct: string,
  savedPhone: string, profile: ContractProfileFields,
): RequiredRow[] {
  const t = (v: unknown) => {
    const s = v === null || v === undefined ? '' : String(v).trim();
    return s === '' ? null : s;
  };
  const fns = (terms.functions as Record<string, { city?: string }> | undefined) || {};
  return [
    { label: 'Her number',        value: t(savedPhone) },
    { label: 'Functions and dates', value: Object.keys(fns).length > 0 ? String(Object.keys(fns).length) : null },
    { label: 'Fee',               value: t(terms.fee_total) ?? (c.invoice_id ? 'From your invoice' : null) },
    { label: 'Deposit',           value: t(depositPct) },
    { label: 'Delivered within',  value: t(profile.delivery_days) },
    { label: 'Who signs for you', value: t(profile.vendor_signatory_name) },
  ];
}

/** One row of the picker's union. `id` is a `public.clients` id, or NULL for a
 *  binder — and the null is the whole difference: a null id means the tap will
 *  promote. Frames `R4-pick`, `R4-pick-empty`, `R4-pick-failed`. */
type PickRow = { key: string; id: string | null; name: string; phone: string | null; from: 'client' | 'cabinet' };

const SCRIM: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'var(--atelier-overlay)', zIndex: 20,
  display: 'flex', alignItems: 'flex-end',
};
const SHEET: React.CSSProperties = {
  width: '100%', background: 'var(--atelier-sheet-bg)',
  borderTop: '0.5px solid var(--atelier-sheet-border)',
  padding: '20px 24px calc(24px + env(safe-area-inset-bottom))',
  display: 'flex', flexDirection: 'column', gap: 12,
};
const GRAB: React.CSSProperties = { display: 'flex', justifyContent: 'center', marginBottom: 4 };
const GRABBAR: React.CSSProperties = { width: 36, height: 3, borderRadius: 2, background: 'var(--atelier-label)' };
const OPT: React.CSSProperties = {
  padding: '15px 0', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer',
  borderBottom: '0.5px solid var(--atelier-card-border)',
  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontWeight: 300, fontSize: 16,
  lineHeight: 1.5, color: 'var(--atelier-ink)',
};
const GROUP: React.CSSProperties = {
  fontFamily: 'var(--font-jost), system-ui, sans-serif', fontWeight: 300, fontSize: 8,
  letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--atelier-ink-mute)',
  paddingTop: 14, marginBottom: 2, borderTop: '0.5px solid var(--atelier-card-border)',
};
const NOTE: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontWeight: 300, fontSize: 16,
  lineHeight: 1.5, color: 'var(--atelier-ink-mute)',
};
const BTN: React.CSSProperties = {
  padding: '13px 0', borderRadius: 2, cursor: 'pointer', marginTop: 4,
  fontFamily: 'var(--font-jost), system-ui, sans-serif', fontWeight: 300, fontSize: 9,
  letterSpacing: '0.32em', textTransform: 'uppercase',
};
const CTA: React.CSSProperties   = { ...BTN, background: 'var(--atelier-accent-text)', border: 'none', color: 'var(--role-ink-deep)', fontWeight: 400 };
const GHOST: React.CSSProperties = { ...BTN, background: 'transparent', border: '0.5px solid var(--atelier-accent-text)', color: 'var(--atelier-accent-text)' };
const QUIET: React.CSSProperties = { ...BTN, background: 'transparent', border: '0.5px solid var(--atelier-card-border)', color: 'var(--atelier-ink-mute)' };

/** ⚠ THE PLACEHOLDER IS THE BLANK'S OWN WORDS, NOT A GREY DASH.
 *  `Not filled` / `Not set` / `Venue not filled` are veto rows 20, 22 and 27 —
 *  a field that named itself as empty rather than an em dash a vendor has to
 *  interpret. `readOnly` is for a value the ROW already holds: it is shown
 *  because the agreement prints it, and not editable because editing it here
 *  would be a second home for a fact the client record owns. */
function Field({ label, value, placeholder, onChange, readOnly, required }: {
  label: string; value: string; placeholder?: string;
  onChange?: (v: string) => void; readOnly?: boolean; required?: string;
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 14, padding: '7px 0' }}>
      <div style={{ fontFamily: 'var(--font-jost), system-ui, sans-serif', fontWeight: 300, fontSize: 12, color: 'var(--atelier-ink-mute)', flexShrink: 0 }}>
        {label}
        {/* The mark is a SENTENCE FRAGMENT, not a glyph. `*` says "required" and
            nothing else; `Needed to send` says which act needs it, which is the
            only true statement available about a document whose blanks are legal. */}
        {required ? (
          <span style={{ marginLeft: 8, fontFamily: 'var(--font-jost), system-ui, sans-serif',
                         fontWeight: 300, fontSize: 8, letterSpacing: '0.32em',
                         textTransform: 'uppercase', color: 'var(--role-caution)' }}>{required}</span>
        ) : null}
      </div>
      {readOnly ? (
        <div style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontWeight: 300, fontSize: 16, color: 'var(--atelier-ink)', textAlign: 'right' }}>{value}</div>
      ) : (
        <input value={value} placeholder={placeholder} onChange={e => onChange?.(e.target.value)}
               style={{
                 flex: 1, minWidth: 0, textAlign: 'right', background: 'transparent', border: 'none', outline: 'none',
                 fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontWeight: 300, fontSize: 16,
                 color: 'var(--atelier-ink)', caretColor: 'var(--atelier-accent-text)',
               }} />
      )}
    </div>
  );
}

/**
 * ⚠ THE FRAMES SAY 「Priya」 AND THE ROOM MUST NOT. Every ratified sentence on
 * the tailoring surfaces names the worked example — *what Priya signs*, *what
 * Priya will receive* — because a mock has one couple and a room has all of
 * them. The byte is the sentence; the name is the row's.
 *
 * ⚠ AND IT IS THE COMPOSED TITLE'S FIRST HALF, WHICH IS ALREADY THIS ROOM'S ONE
 * WAY TO A CLIENT'S NAME. `record.title` is generated as `<client> — wedding
 * services` (veto row 10) and the record's own 「Your client」 field reads it the
 * same way, with the same dash. A second source here — a `clients` fetch, a
 * `terms` key — would be a second home for a name the row already carries.
 */
function clientFirstName(c: Contract): string {
  const whole = String(c.title || '').split(' \u2014 ')[0].trim();
  return whole.split(/\s+/)[0] || whole;
}

/**
 * ONE ANNEX, WITH ITS MARK. Veto row 34's two bytes.
 *
 * ⚠ THE MARK IS A STATEMENT, NOT A CONTROL, AND THE WHOLE ROW IS THE CONTROL.
 * The ratified frame draws a check to the left and the state word beneath the
 * title; a tap anywhere on the row toggles it, because a 16-pixel checkbox on a
 * phone is a control that refuses half the taps aimed at it.
 */
function AnnexRow({ annex, on, disabled, onToggle }: {
  annex: AnnexOption; on: boolean; disabled?: boolean; onToggle: () => void;
}) {
  return (
    <button type="button" disabled={disabled} onClick={onToggle}
            style={{ ...OPT, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span>{annex.label}</span>
      <span style={{ ...labelStyle, marginBottom: 0, color: on ? 'var(--role-positive)' : 'var(--atelier-ink-mute)' }}>
        {on ? 'Attached' : 'Not attached'}
      </span>
    </button>
  );
}

/**
 * THE LINE UNDER A CLAUSE SWITCH, AND EVERY ONE OF IT IS HERS.
 *
 * ⚠ THE FRAME SHOWS 「1.5% a month after 7 days」 AND 「Rs 4,000 an hour」 AND TDW
 * AUTHORS NEITHER NUMBER. They are `late_interest_pct` / `late_grace_days` and
 * `overtime_rate` / `overtime_unit` out of her profile — the same four tokens the
 * renderer interpolates into clauses 4.6 and 4.7 — so the line she reads beside
 * the switch is the sentence the document will print, in short.
 *
 * ⚠ A LINE WITH A MISSING NUMBER IS ABSENT, NOT HALF-WRITTEN. `f`'s rule on the
 * paper, applied to the room: the renderer omits clause 4.7 whole when either
 * value is unset, so a caption reading 「% a month after days」 would describe a
 * clause that is not going to print.
 *
 * ⚠ AND TWO OF THE SIX HAVE NO CAPTION AT ALL. `A named professional` and
 * `Portfolio use` are the two rows cut from the ratified frame for the fold and
 * rejoined by the founder's ruling; neither has a vetoed sub-line, so neither
 * gets one. A caption invented to fill a column would be a byte nobody passed.
 */
function clauseMeta(key: string, p: ContractProfileFields, vendorCity: string | null): string | null {
  const v = (k: string) => {
    const s = (p[k] || '').trim();
    return s === '' ? null : s;
  };
  if (key === 'accommodation') {
    // Row 25 — a STATE, not a control, and it says why the row arrived on.
    return vendorCity ? `On \u2014 a function is outside ${vendorCity}` : null;
  }
  if (key === 'late_payment') {
    const pct = v('late_interest_pct'), days = v('late_grace_days');
    return pct && days ? `${pct}% a month after ${days} days` : null;
  }
  if (key === 'extra_hours') {
    const rate = v('overtime_rate'), unit = v('overtime_unit');
    return rate && unit ? `Rs ${rate} an ${unit}` : null;
  }
  if (key === 'tax_block') {
    // Row 28 POINTS AT SETTINGS AND NOT AT ITSELF. `vendors.gstin` has one home
    // already and a second entry point here would be a second home for a tax
    // number — the same reasoning as the ratified Q9.
    const treatment = v('gst_treatment'), pct = v('gst_pct');
    return treatment && pct ? `${pct}% \u00b7 ${treatment}` : 'Absent \u2014 add your GSTIN in Settings';
  }
  return null;
}

/** One clause, its caption and its switch. The whole row is the control, for the
 *  reason `AnnexRow` gives: a small target on a phone refuses half the taps. */
function ClauseRow({ label, meta, on, disabled, onToggle }: {
  label: string; meta: string | null; on: boolean; disabled?: boolean; onToggle: () => void;
}) {
  return (
    <button type="button" disabled={disabled} onClick={onToggle}
            style={{ ...OPT, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 14 }}>
      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, textAlign: 'left' }}>
        <span>{label}</span>
        {meta ? (
          <span style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontWeight: 300,
                         fontSize: 13, lineHeight: 1.4, color: 'var(--atelier-ink-mute)' }}>{meta}</span>
        ) : null}
      </span>
      <span style={{ fontFamily: 'var(--font-jost), system-ui, sans-serif', fontWeight: 300, fontSize: 8,
                     letterSpacing: '0.32em', textTransform: 'uppercase', flexShrink: 0,
                     color: on ? 'var(--role-positive)' : 'var(--atelier-ink-mute)' }}>
        {on ? 'Printed' : 'Not printed'}
      </span>
    </button>
  );
}

export function ContractsScreen() {
  const { toast, show } = useToast();
  // ⚠ THE SESSION IS READ HERE AND NOT PASSED IN. This body's own header records
  // that every prop left with the shell mount — it reads its own data through the
  // API client and needs nothing from either route. The clients roster is the
  // first read here that needs a vendor id, and `resolveVendor` mode B means the
  // path id must match the JWT's: it is a second ADDRESS, never a second authority.
  const { session } = useVendorSession();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contract | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  // ── G3.2 part 2 · the fork and the record ─────────────────────────────────
  const [startOpen, setStartOpen] = useState(false);
  const [pickOpen, setPickOpen]   = useState(false);
  // ── THE UNION, AND ITS STATE — R-G32.17, F-40.138 ─────────────────────────
  // ⚠ THREE STATES, THREE BYTES, ONE KEY. The first cut rendered `Loading…`
  // whenever `clients.length === 0`, so IN FLIGHT, FAILED and GENUINELY EMPTY all
  // read one word forever — and the walk hit the third while the room said the
  // first. A control that says something untrue about its own condition is
  // s-G11.2's class, and this was its fifth instance in this arc.
  const [pickState, setPickState] = useState<'loading' | 'failed' | 'ready'>('loading');
  const [clients, setClients]     = useState<PickRow[]>([]);
  const [record, setRecord]       = useState<Contract | null>(null);
  // ⚠ THE VALUE TYPE WIDENS TO `unknown` AT SITTING 2, AND THAT IS A FACT ABOUT
  // THE ROW RATHER THAN A LOOSENING. `contracts.terms` is jsonb and the renderer
  // reads two NESTED objects out of it — `terms.clauses` (six booleans) and
  // `terms.functions` (keyed by event id, carrying `venue` and `city`). A
  // `Record<string, string>` could not hold either, and the record's text fields
  // still read and write strings through `Field`. The narrowing happens where a
  // value is used, not where the row is typed.
  const [terms, setTerms]         = useState<Record<string, unknown>>({});
  const [annexes, setAnnexes]     = useState<Record<string, boolean>>({});
  const [depositPct, setDepositPct] = useState<string>('');
  const [promoted, setPromoted]     = useState(false);
  // R-40.74 — the one mandatory field. Held here while she types; written to
  // `clients.phone` through the existing client writer on save, never to `terms`.
  const [phone, setPhone]           = useState('');
  // ⚠ TWO PIECES OF STATE FOR ONE FACT, AND THE SPLIT IS THE POINT.
  // `phone` is what she is TYPING. `savedPhone` is what the row HOLDS. The walk's
  // second defect was gating Send on the first: typing a number made Send appear
  // instantly, she tapped it, and the door — which reads the ROW — answered `No
  // number to send to.` A control whose condition and whose door consult different
  // sources is a control that lies about itself.
  const [savedPhone, setSavedPhone] = useState('');

  // ── G3.2 sitting 2 · THE PROFILE SHEET (Q1–Q10) ───────────────────────────
  // ⚠ THREE STATES, NOT A LENGTH — F-40.138's law, applied at its second door.
  // `{}` is a LEGAL answer here and the commonest one: a vendor who has never
  // opened this sheet has an empty profile, and that is not a failure and not a
  // spinner. Keying the sheet on `Object.keys(profile).length` would collapse in
  // flight, failed and never-filled into one screen, which is exactly what the
  // picker did before its cure.
  const [profileOpen, setProfileOpen]   = useState(false);
  const [profileState, setProfileState] = useState<'loading' | 'failed' | 'ready'>('loading');
  const [profile, setProfile]           = useState<ContractProfileFields>({});

  // ── THE ANNEX CHOOSER (T2 / T2-unmapped) ──────────────────────────────────
  // ⚠ `mapped` IS THE DOOR'S, AND THE SURFACE CHANGES SHAPE ON IT. It is held
  // as its own field rather than derived from `offered.length`, because the door
  // returns all seven in `offered` for an unmapped vendor too — a length here
  // would read `7` for both the vendor whose trade we know and the vendor whose
  // trade we do not, and draw the wrong surface for one of them.
  const [annexState, setAnnexState] = useState<'loading' | 'failed' | 'ready'>('loading');
  const [annexMap, setAnnexMap]     = useState<AnnexMapResponse | null>(null);

  // ── THE TAILORING SURFACES — T1-clauses and T3-preview ────────────────────
  const [clausesOpen, setClausesOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  // ⚠ HER CITY IS CLAUSE 5'S GATE AND IT IS NOT ON THE SESSION. `VendorSession`
  // carries id, name, phone and tier and no city; `GET /me` is its one home and
  // the room reads it once, on mount. `null` until it lands, and `outstationGate`
  // returns false on a blank base — so the accommodation row is ABSENT while the
  // fact is unknown rather than drawn on a guess. Absent, never greyed, and the
  // same rule applied to a fact instead of a control.
  const [vendorCity, setVendorCity] = useState<string | null>(null);

  useEffect(() => {
    // ── ALL FOUR STATES — F-40.115, R-G32.15 ──────────────────────────────
    // `fetchAllContracts` is `fetchContracts` with `include_cancelled=1`. The
    // door's default still hides cancelled rows and every other caller keeps it;
    // only this room asks for the whole set, because only this room draws the
    // cancelled section at the foot.
    fetchAllContracts().then(r => { if (r.ok) setContracts((r as { contracts: Contract[] }).contracts); })
      .finally(() => setLoading(false));
    // The gate's base city. A failed read leaves it null and clause 5's row stays
    // away — the honest picture when the room does not know where she is.
    fetchMe().then(r => { if (r.ok) setVendorCity(r.vendor.city || null); }).catch(() => {});
  }, []);

  async function doUpload() {
    if (!title.trim() || !file || uploading) return;
    setUploading(true); setUploadProgress('Getting upload URL…');
    try {
      const urlRes = await requestContractUpload(title.trim(), file.name);
      if (!urlRes.ok) { show((urlRes as { error?: string }).error ?? 'Failed', 'error'); setUploading(false); return; }
      const { contract_id, upload_url } = urlRes as { contract_id: string; upload_url: string };
      setUploadProgress('Uploading file…');
      const uploadRes = await fetch(upload_url, { method: 'PUT', body: file, headers: { 'Content-Type': 'application/pdf' } });
      if (!uploadRes.ok) { show('Upload failed — check file is a valid PDF', 'error'); setUploading(false); return; }
      setUploadProgress('Finalizing…');
      const finalRes = await finalizeContract(contract_id);
      if (!finalRes.ok) { show((finalRes as { error?: string }).error ?? 'Finalize failed', 'error'); setUploading(false); return; }
      show('Contract saved', 'success');
      setContracts(prev => [(finalRes as { contract: Contract }).contract, ...prev]);
      setUploadOpen(false); setTitle(''); setFile(null);
    } catch { show('Upload failed', 'error'); }
    setUploading(false); setUploadProgress('');
  }

  async function doDownload(contract: Contract) {
    const res = await fetchContractDownload(contract.id);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); return; }
    window.open((res as { download_url: string }).download_url, '_blank');
  }
  async function doSend(contract: Contract) {
    setSaving(true);
    const res = await sendContract(contract.id);
    if (!res.ok) show((res as { error?: string }).error ?? 'Failed', 'error');
    else { show('Marked as sent', 'success'); setContracts(prev => prev.map(c => c.id === contract.id ? (res as { contract: Contract }).contract : c)); setSelected(null); }
    setSaving(false);
  }
  async function doMarkSigned(contract: Contract) {
    setSaving(true);
    const res = await updateContract(contract.id, { state: 'signed', signed_at: new Date().toISOString() });
    if (!res.ok) show((res as { error?: string }).error ?? 'Failed', 'error');
    else { show('Marked as signed', 'success'); setContracts(prev => prev.map(c => c.id === contract.id ? (res as { contract: Contract }).contract : c)); setSelected(null); }
    setSaving(false);
  }
  /** ⚠ A FACT, NOT A HEURISTIC. A contract this room COMPOSED carries a deposit
   *  percentage; one a vendor UPLOADED carries none, and cannot — `composeContract`
   *  is the only writer that sets it. Guessing from the title or the storage path
   *  would be a heuristic, and the first row it guessed wrong about would be one
   *  where a vendor could assert a signature she has no witness for. */
  function isComposed(c: Contract) {
    return c.deposit_pct !== null && c.deposit_pct !== undefined;
  }

  /** The record opens on a contract and reads its blanks OUT OF THE ROW.
   *  Nothing is retyped that the row already holds — the whole point of the
   *  composer, and the sentence at veto row 33 says so to the vendor. */
  function openRecord(c: Contract) {
    setRecord(c);
    setTerms((c.terms as Record<string, unknown>) ?? {});
    setAnnexes(c.annexes ?? {});
    setDepositPct(c.deposit_pct === null || c.deposit_pct === undefined ? '' : String(c.deposit_pct));
    // ⚠ **F-40.161 — THIS SEEDED FROM THE PICKER'S ROWS, WHICH ARE EMPTY.**
    // `clients` is populated only by `openPicker`. A record opened FROM THE LIST —
    // which is every record after the first — found an empty array, so the field
    // read `Not filled` whatever the client actually held, and `known` was `''`, so
    // every save re-PATCHed a number that was already there.
    //
    // The number's home is the CLIENT, so the record reads it from the client. One
    // read, on open, and `savedPhone` is what the Send gate consults — never the
    // input box.
    setPhone('');
    setSavedPhone('');
    if (c.client_id) void loadClientPhone(c.client_id);
    // ── THE MAP IS FETCHED PER OPEN, NOT PER ROOM MOUNT ─────────────────────
    // ⚠ IT IS A FACT ABOUT HER TRADE, WHICH CAN CHANGE, AND IT IS CHEAP: one
    // read of a frozen constant behind an already-resolved vendor row. Fetching
    // it once at mount would mean a vendor who set her category in Settings and
    // came straight here would meet the map she had before she answered.
    void loadAnnexMap();
    // ⚠ AND THE PROFILE IS READ HERE TOO, because the record's own card is drawn
    // from it — 「Set your policies once」 is not a permanent fixture, it is a
    // statement about whether she has. Read before it is drawn, never after.
    void (async () => {
      const r = await fetchContractProfile();
      if ('ok' in r && r.ok) setProfile((r as { fields: ContractProfileFields }).fields || {});
    })();
    setSelected(null);
  }

  /** ⚠ TWO READS, ONE LIST, AND THE SECOND IS NOT OPTIONAL.
   *  `fetchTypedClients` returns `public.clients` — which was EMPTY on the walk.
   *  `fetchCabinet().clients` returns the binders the ESTATE ALREADY CALLS
   *  CLIENTS: `cabinet.js:75` filters on `CLIENT_STAGE_WORDS`
   *  (`client · booked · confirmed · signed · advance · paid`) server-side, so
   *  this room does not re-decide who counts and could not drift from the
   *  Cabinet's own answer.
   *
   *  ⚠ DEDUPED ON PHONE, matching `resolveOrCreateClient`'s own dedup key. A
   *  person who is both a client row and a binder appears ONCE, marked `Client`,
   *  because picking her adds nothing. If the two homes ever disagree, the client
   *  row wins — it is the one the FK points at.
   */
  /** The client's own number, from its one home. */
  async function loadClientPhone(clientId: string) {
    if (!session?.id) return;
    const r = await fetchTypedClients(session.id);
    if (!r.ok) return;
    const hit = (r as { clients: Client[] }).clients.find(c => c.id === clientId);
    const p = (hit && hit.phone) || '';
    setPhone(p);
    setSavedPhone(p);
  }

  // ── THE PROFILE SHEET ─────────────────────────────────────────────────────
  /** ⚠ THE READ IS ITS OWN CALL AND IT RUNS EVERY OPEN. A profile cached from
   *  the first open would go stale the moment she saved from another device, and
   *  this sheet posts the WHOLE object — so a stale read would silently write
   *  back a value she had already changed. Cheap read, correct write. */
  async function openProfile() {
    setProfileOpen(true);
    setProfileState('loading');
    const r = await fetchContractProfile();
    if (!('ok' in r) || !r.ok) { setProfileState('failed'); return; }
    // `{}` is a real answer and it is READY, never empty-as-failure.
    setProfile((r as { fields: ContractProfileFields }).fields || {});
    setProfileState('ready');
  }

  /** ⚠ ONE POST, AND IT IS NOT OPTIMISTIC. The clause switches save on the tap
   *  because a switch that waits reads as broken; a twenty-eight-field sheet
   *  with an explicit `Save my policies` is the opposite case — she has pressed
   *  a button and is entitled to know whether it took. The sheet stays open on a
   *  refusal with her typing intact, and closes only on the door's yes.
   *
   *  ⚠ AND THE DOOR'S ECHO IS WHAT LANDS IN STATE, never the object we sent.
   *  `contract_profiles.fields` is upserted wholesale and the row is what the
   *  renderer will read; trusting the local copy would be this plane asserting a
   *  write it did not witness. */
  async function doSaveProfile() {
    setSaving(true);
    const r = await saveContractProfile(profile);
    setSaving(false);
    if (!('ok' in r) || !r.ok) {
      show((r as { error?: string }).error ?? 'That could not be saved.', 'error');
      return;
    }
    setProfile((r as { fields: ContractProfileFields }).fields || {});
    setProfileOpen(false);
    show('Saved', 'success');
  }

  // ── THE ANNEX CHOOSER ─────────────────────────────────────────────────────
  /** ⚠ NO FALLBACK LIST ON FAILURE, AND THAT IS THE POINT. The room used to
   *  carry its own seven names, so it could always draw something; it can no
   *  longer, and a failed read now says so instead of drawing a plausible list
   *  the door never sent. F-40.138's law is that failed and empty are different
   *  sentences — here failed and *guessed* would have been the same picture. */
  async function loadAnnexMap() {
    setAnnexState('loading');
    const r = await fetchAnnexMap();
    if (!('ok' in r) || !r.ok) { setAnnexState('failed'); return; }
    setAnnexMap(r as AnnexMapResponse);
    setAnnexState('ready');
  }

  /** THE ONLY WRITER of `annexes` from this surface, and it saves on the tap.
   *  ⚠ OPTIMISTIC, WITH A REVERT ON REFUSAL AND THE DOOR'S ECHO ON SUCCESS —
   *  the storefront switch's posture verbatim (`screen.tsx` toggle, R-G31.7).
   *  A checkbox that waits for a round trip reads as a checkbox that did not
   *  take; a checkbox that never checks the answer is the class F-40.180 filed. */
  async function toggleAnnex(key: string) {
    if (!record || saving) return;
    const next = { ...annexes, [key]: !annexes[key] };
    setAnnexes(next);
    setSaving(true);
    const res = await fillContract(record.id, { annexes: next });
    setSaving(false);
    if (!res.ok) {
      setAnnexes(annexes);
      show((res as { error?: string }).error ?? 'That could not be saved.', 'error');
      return;
    }
    const c = (res as { contract: Contract }).contract;
    setAnnexes(c.annexes ?? {});
    setContracts(prev => prev.map(x => (x.id === c.id ? c : x)));
  }

  /** THE ONLY WRITER of `terms.clauses` from this surface, and it saves on the
   *  tap — the storefront switch's posture, for the same reason: a switch that
   *  waits for a Save reads as a switch that did not take.
   *
   *  ⚠ IT WRITES AN EXPLICIT `false` AND AN EXPLICIT `true`, never a delete. The
   *  renderer's `switchOn` treats ABSENT as ON, so removing the key to turn a
   *  clause off would turn it back on. The two planes agree only because both
   *  say `!== false` and this one only ever stores a boolean. */
  async function toggleClause(key: string) {
    if (!record || saving) return;
    const prev = terms;
    const clauses = { ...((terms.clauses as Record<string, boolean> | undefined) || {}) };
    clauses[key] = !switchOn(terms, key);
    const next = { ...terms, clauses };
    setTerms(next);
    setSaving(true);
    const res = await fillContract(record.id, { terms: next });
    setSaving(false);
    if (!res.ok) {
      setTerms(prev);
      show((res as { error?: string }).error ?? 'That could not be saved.', 'error');
      return;
    }
    const c = (res as { contract: Contract }).contract;
    setTerms((c.terms as Record<string, unknown>) ?? {});
    setContracts(list => list.map(x => (x.id === c.id ? c : x)));
  }

  async function openPicker() {
    setStartOpen(false);
    setPickOpen(true);
    if (!session?.id) { setPickState('failed'); return; }
    if (clients.length) { setPickState('ready'); return; }
    setPickState('loading');
    const [typed, cab] = await Promise.all([fetchTypedClients(session.id), fetchCabinet(session.id)]);
    // EITHER read failing is a FAILURE, never an empty list. Half a union
    // presented as the whole one is the lie this cure exists to end.
    if (!typed.ok || !cab.ok) { setPickState('failed'); return; }
    const rows: PickRow[] = (typed as { clients: Client[] }).clients.map(c => ({
      key: `c:${c.id}`, id: c.id, name: c.name, phone: c.phone, from: 'client' as const,
    }));
    const seen = new Set(rows.map(r => (r.phone || '').trim()).filter(Boolean));
    (cab.clients ?? []).forEach(b => {
      const name = (b.client || '').trim();
      const phone = (b.phone || '').trim();
      if (!name) return;                       // a binder with no name names nobody
      if (phone && seen.has(phone)) return;    // already a client row
      if (phone) seen.add(phone);
      rows.push({ key: `b:${b.id}`, id: null, name, phone: phone || null, from: 'cabinet' });
    });
    setClients(rows);
    setPickState('ready');
  }

  async function doCompose(row: PickRow) {
    setSaving(true);
    // A client row travels as an id; a binder travels as a name and a phone and
    // is PROMOTED at the door, through `resolveOrCreateClient` — the estate's
    // only allowed door to creating a client, and the one that carries the phone
    // dedup (R-G32.17).
    const res = await composeContract(
      row.id ? { client_id: row.id } : { name: row.name, phone: row.phone });
    setSaving(false);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); return; }
    const r = res as { contract: Contract; promoted?: boolean };
    setContracts(prev => [r.contract, ...prev]);
    setPickOpen(false);
    // ⚠ THE CONFIRMATION IS THE SERVER'S FACT, NEVER `row.from === 'cabinet'`.
    // The resolver dedups on phone, so picking a binder for someone who already
    // has a client row adds nothing — and saying `Added to your clients.` then
    // would be a true-looking sentence about a thing that did not happen.
    setPromoted(r.promoted === true);
    openRecord(r.contract);
  }

  /** THE ONLY WRITER of the blanks from this surface. `PATCH /fill` refuses on a
   *  signed contract at the door, and the record does not offer the controls
   *  either — two refusals for one rule, and the door's is the one that counts. */
  async function doSaveFill(close: boolean) {
    if (!record) return;
    setSaving(true);
    const pct = depositPct.trim() === '' ? null : Number(depositPct);
    const res = await fillContract(record.id, { terms, annexes, deposit_pct: pct });
    // ⚠ THE NUMBER IS WRITTEN TO THE CLIENT, NOT INTO THIS CONTRACT. R-40.74's
    // one home. Only when it actually changed — a PATCH on every save would be a
    // write she did not make.
    // Against what the ROW holds, not against an array that may never have loaded.
    if (record.client_id && phone.trim() && phone.trim() !== savedPhone.trim()) {
      const pr = await updateClientPhone(record.client_id, phone.trim());
      if (!pr.ok) {
        setSaving(false);
        // The door returns 409 PHONE_COLLISION when the number already belongs to
        // another of her clients — a real mistake, and it gets the door's own
        // sentence rather than a generic failure.
        show((pr as { error?: string }).error ?? 'That number could not be saved.', 'error');
        return;
      }
      // ⚠ `savedPhone` ADVANCES ONLY HERE — after the door said yes. Advancing it
      // on the keystroke would put the two-sources bug straight back, one layer in.
      setSavedPhone(phone.trim());
      setClients(prev => prev.map(r => (r.id === record.client_id ? { ...r, phone: phone.trim() } : r)));
    }
    setSaving(false);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); return; }
    const c = (res as { contract: Contract }).contract;
    setContracts(prev => prev.map(x => (x.id === c.id ? c : x)));
    setRecord(close ? null : c);
    if (close) show('Saved', 'success');
  }

  /** ⚠ ASK, THEN OPEN. The door renders, stores and signs; the room opens the url
   *  it gets back. `window.open` on the DOOR was F-40.152 — a new tab carries no
   *  JWT and every press returned `no_token`. */
  async function doPreview(contract: Contract) {
    setSaving(true);
    const res = await requestContractPreview(contract.id);
    setSaving(false);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); return; }
    window.open((res as { pdf_url: string }).pdf_url, '_blank');
  }

  async function doSendToCouple(contract: Contract) {
    setSaving(true);
    const res = await sendContractToCouple(contract.id);
    setSaving(false);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); return; }
    const r = res as { sign_url: string; sent: boolean };
    // ⚠ NEVER A FALSE DONE. The template is dark by two gates, so nothing was
    // sent and the toast does not say it was. The link goes to the clipboard so
    // the founder can paste it by hand — exactly how `/consent/` is walked today,
    // and the honest shape until `CONTRACT_SIGN_SEND_ENABLED` opens.
    if (r.sent) show('Sent to the couple', 'success');
    else {
      try { await navigator.clipboard.writeText(r.sign_url); show('Link copied \u2014 sending is not open yet', 'success'); }
      catch { show(r.sign_url, 'success'); }
    }
    setSelected(null);
    const list = await fetchAllContracts();
    if (list.ok) setContracts((list as { contracts: Contract[] }).contracts);
  }

  async function doDeposit(contract: Contract) {
    setSaving(true);
    const res = await markContractDeposit(contract.id, true);
    setSaving(false);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); return; }
    const updated = (res as { contract: Contract }).contract;
    setContracts(prev => prev.map(c => (c.id === contract.id ? updated : c)));
    setSelected(updated);
  }

  async function doCancel(contract: Contract) {
    setSaving(true);
    const res = await cancelContract(contract.id);
    if (!res.ok) show((res as { error?: string }).error ?? 'Failed', 'error');
    else { show('Contract cancelled', 'success'); setContracts(prev => prev.filter(c => c.id !== contract.id)); setSelected(null); }
    setSaving(false);
  }
  const canUpload = title.trim().length > 0 && file !== null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Toast toast={toast} />

      {/* ── THE ROW RETIRES WHOLE INSIDE THE SHELL, HAIRLINE INCLUDED ────────
          Chevron plus the word 「CONTRACTS」 and nothing else. WorklistShell already prints
          the room's word and the two nav seats are the way back, so every byte in this row
          is said better one element above it. Portfolio and Couture kept their rows because
          an ACTION rode on each; nothing rides on this one, and keeping it for symmetry
          with its siblings would be chrome kept for the look of the diff. */}
      

      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>Loading…</div>
        </div>
      ) : contracts.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center', gap: 6 }}>
          <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 20, color: 'var(--atelier-ink)', lineHeight: 1.2 }}>No contracts yet.</div>
          <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>Tap the + to upload your first.</div>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 110 }}>
          {contracts.map(c => (
            <div key={c.id} onClick={() => (isComposed(c) && c.state !== 'signed' && c.state !== 'cancelled' ? openRecord(c) : setSelected(c))} style={{
              padding: '16px var(--slice-inset, 24px)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 16,
              borderBottom: '0.5px solid var(--atelier-card-border)',
            }}>
              <span style={{
                flexShrink: 0, width: 32, textAlign: 'center',
                fontFamily: F.display, fontWeight: 400, fontSize: 20, color: A.brassWarm, lineHeight: 1,
              }}>§</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F.script, fontWeight: 500, fontSize: 16, color: A.ink, letterSpacing: '0.005em', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, color: 'var(--atelier-label)', letterSpacing: '0.28em', textTransform: 'uppercase', marginTop: 4 }}>
                  {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {c.file_size ? ` · ${Math.round(c.file_size / 1024)} KB` : ''}
                </div>
              </div>
              <span style={{
                fontFamily: F.label, fontWeight: 400, fontSize: 8, color: STATE_COLOR[c.state],
                letterSpacing: '0.28em', textTransform: 'uppercase',
                border: `0.5px solid ${STATE_COLOR[c.state]}`, borderRadius: 2, padding: '4px 9px', flexShrink: 0,
              }}>{stateWord(c.state)}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── CE-39 S2/8 · F-39.4 · A FIFTH AND SIXTH SEAT, FOUND BY RETIRING A SKIP ──
          This file inherited SliceShell's 46-at-120 when it crossed, and that was correct at
          F-38.59. F-39.4 gave the estate ONE seat — 56 at GRID.fab.bottom, reached through
          components/worklist/Fab.tsx — so an inherited number is now a second home for a
          fact that has one. NOT FOUND BY A WALK AND NOT BY THE HOTFIX: found the moment
          C39's inShell skip was retired, which is the ruling that let the cell see its own
          exemption. The founder saw Calendar; the cell then named these two.
          The /vendor arm keeps its 82 and DECLARES itself, so the exemption is claimed in
          the markup rather than inferred from proximity. */}
      {/* ⚠ THE FAB NOW OPENS A FORK, AND THE UPLOAD SHEET IS ONE ARM OF IT.
          `Upload contract` was the whole of `+` when a contract WAS a PDF. It is
          still a door — clause 12's last line is that a couple who would rather
          sign on paper can — but it is no longer the only one, and a `+` that
          went straight to an upload would hide the composer entirely. Veto rows
          11-15, frame `R4-start`. */}
      {<Fab label="New contract" onClick={() => setStartOpen(true)} />}

      {uploadOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--atelier-overlay)', zIndex: 20, display: 'flex', alignItems: 'flex-end' }} onClick={() => !uploading && setUploadOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%',
            background: 'var(--atelier-sheet-bg)',
            backdropFilter: 'blur(40px) saturate(1.8)', WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
            borderTop: '0.5px solid var(--atelier-sheet-border)',
            padding: '20px 24px calc(24px + env(safe-area-inset-bottom))',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
              <div style={{ width: 36, height: 3, borderRadius: 2, background: 'var(--atelier-label)' }} />
            </div>
            <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass }}>New Contract</div>
            <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 20, color: 'var(--atelier-ink)', lineHeight: 1.15, marginBottom: 4 }}>Upload PDF</div>

            <div><div style={labelStyle}>Title *</div><input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="Booking contract — Priya Sharma" /></div>
            <div>
              <div style={labelStyle}>PDF File *</div>
              <input ref={fileRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={e => setFile(e.target.files?.[0] || null)} />
              <button type="button" onClick={() => fileRef.current?.click()} style={{
                width: '100%', padding: '12px 14px',
                background: 'var(--atelier-input-bg)',
                border: '0.5px solid var(--atelier-input-border)', borderRadius: 2, cursor: 'pointer',
                // R-37.86 per-site verdict: KEEP. Italic here marks an EMPTY field and normal a filled
                // one — that is STATE, the job a placeholder colour does, not the prose voice the
                // mock's screen four killed. Converting it would delete a signal.
                fontFamily: F.script, fontStyle: file ? 'normal' : 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5,
                color: file ? A.ink : A.inkMute, textAlign: 'left',
              }}>
                {file ? file.name : 'Choose a PDF…'}
              </button>
            </div>
            {(!canUpload && !uploading) && <div style={{ fontFamily: F.script, fontSize: 16, lineHeight: 1.5, color: A.red, marginTop: 2 }}>Title and PDF are required.</div>}
            {uploading && <div style={{ fontFamily: F.script, fontSize: 16, lineHeight: 1.5, color: A.brassWarm }}>{uploadProgress}</div>}

            <button type="button" onClick={doUpload} disabled={!canUpload || uploading} className="atelier-fab" style={{
              padding: '14px 0', borderRadius: 2, cursor: (canUpload && !uploading) ? 'pointer' : 'default',
              border: '0.5px solid var(--atelier-label)',
              fontFamily: F.label, fontWeight: 400, fontSize: 10, color: INK_DEEP,
              letterSpacing: '0.42em', textTransform: 'uppercase',
              opacity: (canUpload && !uploading) ? 1 : 0.5, marginTop: 6,
            }}>{uploading ? uploadProgress || 'Uploading…' : 'Upload'}</button>
          </div>
        </div>
      )}

      {/* ══ THE FORK — veto rows 11-15, frame `R4-start` ══════════════════ */}
      {startOpen && (
        <div style={SCRIM} onClick={() => setStartOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={SHEET}>
            <div style={GRAB}><div style={GRABBAR} /></div>
            <div style={{ ...labelStyle, letterSpacing: '0.42em', fontSize: 9, color: A.brass }}>New</div>
            <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 20, color: 'var(--atelier-ink)', lineHeight: 1.15 }}>Start a contract</div>
            <button type="button" onClick={() => void openPicker()} style={OPT}>Fill the standard agreement</button>
            <button type="button" onClick={() => { setStartOpen(false); setUploadOpen(true); setTitle(''); setFile(null); }} style={OPT}>Upload my own PDF</button>
            {/* R-40.51, founder-ruled 2026-09-06. The proposed byte said `the one
                your lawyer passed`; the lawyer was TDW's, not hers, and `passed`
                is a claim she never made. */}
            <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute, marginTop: 2 }}>
              The standard wedding-services agreement. You fill your prices and policies once.
            </div>
          </div>
        </div>
      )}

      {/* ══ THE CLIENT PICKER ═══════════════════════════════════════════════
          ⚠ THROUGH `fetchTypedClients`, NEVER `fetchClients`. The latter maps
          BINDER ids out of `engine.records`, and `POST /compose` looks its id up
          in `public.clients` — every row would 404. Two planes, two id spaces,
          one word. Derived by reading `binderToClient`, not by trusting a name. */}
      {pickOpen && (
        <div style={SCRIM} onClick={() => setPickOpen(false)}>
          {/* `70vh` is the same trap one size down — F-40.154. The picker is a
              list and can be long; on iOS its foot would sit under the address
              bar exactly as the record's did. */}
          <div onClick={e => e.stopPropagation()} style={{ ...SHEET, maxHeight: '80dvh', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <div style={GRAB}><div style={GRABBAR} /></div>
            <div style={{ ...labelStyle, letterSpacing: '0.42em', fontSize: 9, color: A.brass }}>New</div>
            <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 20, color: 'var(--atelier-ink)', lineHeight: 1.15 }}>Your client</div>
            {pickState === 'loading' ? (
              /* R1 — the byte is KEPT and its KEY changed. A later seat reading
                 this word should find F-40.138, not just the string. */
              <div style={NOTE}>Loading&#8230;</div>
            ) : pickState === 'failed' ? (
              /* R2 — us failing. Never the empty sentence: the walk was shown a
                 spinner while the truth was an empty plane, and the opposite
                 mistake would tell a vendor with a full Cabinet she has nobody. */
              <div style={{ ...NOTE, color: A.red }}>We couldn&#8217;t load your clients.</div>
            ) : clients.length === 0 ? (
              /* R3 — reachable ONLY when there are no client rows AND no
                 client-stage binders, which is the one condition under which it
                 is true. */
              <div style={NOTE}>No one to choose from yet. Add a client, or book someone in your Cabinet.</div>
            ) : (
              <>
                {clients.map(c => (
                  <button key={c.key} type="button" disabled={saving} onClick={() => void doCompose(c)}
                          style={{ ...OPT, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                    <span>{c.name}</span>
                    {/* R5 / R6 — one word, and it carries the ruling's visibility.
                        She can see WHICH TAPS WILL GROW HER CLIENTS ROOM before she
                        makes one; R7 only confirms it afterwards. */}
                    <span style={{ ...labelStyle, marginBottom: 0, flexShrink: 0 }}>
                      {c.from === 'client' ? 'Client' : 'Cabinet'}
                    </span>
                  </button>
                ))}
                <div style={NOTE}>People you&#8217;ve booked or confirmed in your Cabinet are here too. Picking one adds her to your clients.</div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ══ THE RECORD — veto rows 16-41, frames `R4-record-blank` / `-filled` ══
          ⚠ EVERY BLANK PRINTS AS A BLANK AND NEVER AS `N/A` OR A ZERO. The field
          register's §4 rule 3, said to the vendor at row 23 and obeyed by the
          renderer at `contractPdf.js`'s `BLANK`. A greyed `0%` in the deposit
          field would be a figure nobody entered.

          ── F-40.154 · THE SHEET CUT ON iOS, AND `100vh` IS WHY ────────────────
          `SCRIM` is `position: fixed; inset: 0`, which on iOS Safari resolves
          against the LARGE viewport — the one that exists only while the address
          bar is hidden. A full-cover child then runs under the bar and its last
          rows are unreachable: the record cutting, and the DRAFT line riding up
          under the masthead. `alignItems: 'stretch'` made it worse by forcing the
          child to that wrong height instead of letting it size to content.

          ⚠ NO VIEWPORT TOKEN EXISTS IN THIS ESTATE — derived, not assumed.
          `100dvh`, `92dvh` and `88dvh` appear as literals across `app/crew`,
          `app/terms`, `app/admin` and the demo tree, and
          `demo/vendor/[handle]/list/[slice]` already pairs `maxHeight: 88dvh`
          with `overflowY: auto`. That IS the estate's pattern, and this sheet
          should have taken it at the first cut. `dvh` is the DYNAMIC viewport: it
          shrinks when the bar appears, so the foot is always reachable. */}
      {record && (
        <div style={SCRIM} onClick={() => setRecord(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', maxHeight: '88dvh', background: 'var(--atelier-sheet-bg)',
            borderTop: '0.5px solid var(--atelier-sheet-border)',
            padding: '20px 24px calc(24px + env(safe-area-inset-bottom))',
            display: 'flex', flexDirection: 'column', gap: 10,
            overflowY: 'auto', WebkitOverflowScrolling: 'touch',
          }}>
            <div style={GRAB}><div style={GRABBAR} /></div>
            <div style={{ ...labelStyle, letterSpacing: '0.42em', fontSize: 9, color: A.brass }}>{stateWord(record.state)}</div>
            <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 20, color: 'var(--atelier-ink)', lineHeight: 1.15 }}>The agreement</div>

            <div style={GROUP}>Who this is between</div>
            <Field label="Your client" value={record.title.split(' \u2014 ')[0]} readOnly />
            {/* P1 / P2 — the ONE mark on this record, and it names the ACT the field
                serves rather than asserting a rule. Mandatory to the send, never to
                the document: v3's blanks print as blanks by the register's §4 rule 3,
                and a red asterisk on a contract field would be the form arguing with
                the instrument. There is no second mark and there will not be one. */}
            <Field label="Her number" required="Needed to send" value={phone} placeholder="Not filled"
                   onChange={v => setPhone(v)} />
            <Field label="Second partner&#8217;s name" value={String(terms.partner_2_name ?? '')} placeholder="Not filled"
                   onChange={v => setTerms({ ...terms, partner_2_name: v })} />
            <div style={NOTE}>Filled from your client&#8217;s record. Nothing here was typed twice.</div>
            <div style={NOTE}>We send the agreement here. It goes on her record too, so you only type it once.</div>
            {/* R7 — shown ONLY when the server says a row was created. The
                resolver dedups on phone, so a binder pick for someone already a
                client adds nothing and this line stays away. */}
            {promoted && (
              <div style={{ ...NOTE, color: A.green }}>Added to your clients.</div>
            )}

            <div style={GROUP}>The dates</div>
            <Field label="Venue" value={String(terms.venue ?? '')} placeholder="Venue not filled"
                   onChange={v => setTerms({ ...terms, venue: v })} />
            <Field label="City" value={String(terms.city ?? '')} placeholder="Not filled"
                   onChange={v => setTerms({ ...terms, city: v })} />
            <div style={NOTE}>Blank fields print as blanks. Fill what applies.</div>

            <div style={GROUP}>Money</div>
            <Field label="Fee" value={String(terms.fee_total ?? '')} placeholder="Not filled"
                   onChange={v => setTerms({ ...terms, fee_total: v.replace(/[^0-9]/g, '') })} />
            <Field label="Deposit" value={depositPct} placeholder="Not set"
                   onChange={v => setDepositPct(v.replace(/[^0-9.]/g, ''))} />
            <div style={NOTE}>30% holds the dates. Change it if you want.</div>
            <div style={NOTE}>Add your GSTIN to print the tax block.</div>

            {/* ══ THE ANNEX CHOOSER — T2-annexes / T2-unmapped, rows 30-35, 42-43 ══
                ⚠ IT RENDERS UNDER THE RECORD'S OWN RATIFIED GROUP HEAD rather
                than behind a new row, and that is a decision about bytes: every
                navigation label this room could have grown here would have been
                a string the founder's pass never saw. 「Annexes」 is veto row 35
                and it is already the head of this group.

                ⚠ ROW 39 RETIRES, AND ITS RETIREMENT IS THE MAP LANDING.
                *From your profile — change it here for this couple only.* was
                true while nothing decided which annexes a vendor was offered.
                The offer now comes from her CATEGORY through `annex-map`, so
                that sentence had become a statement about a mechanism that does
                not exist — R-40.104's class, and the cure is the same one: the
                byte goes with the fact it described. Rows 35 and 43 are the
                ratified sentences that replace it, and each is true of the
                surface it stands under. */}
            <div style={GROUP}>Annexes</div>
            <div style={NOTE}>
              An annex is a page of its own on the agreement. Attach one and its terms are part of what {clientFirstName(record)} signs;
              leave it off and clause 2.2 says that service is not included.
            </div>
            {annexState === 'loading' && <div style={NOTE}>Loading&#8230;</div>}
            {/* R-40.113 — R2's shape, one noun over. F-40.138's law is that
                failed has its OWN sentence and never shares one with empty. */}
            {annexState === 'failed' && <div style={NOTE}>We couldn&#8217;t load your annexes.</div>}
            {annexState === 'ready' && annexMap && (
              <>
                {/* ⚠ ONE HEAD OR TWO, AND THE DOOR DECIDES WHICH. For a vendor
                    whose trade is not on file the mapped surface would stand
                    「Offered for your trade」 over nothing — an empty section
                    under a section head, F-40.138's shape in different chrome.
                    So the SURFACE changes, not merely its contents. */}
                <div style={GROUP}>{annexMap.mapped ? 'Offered for your trade' : 'All annexes'}</div>
                {annexMap.offered.map((a: AnnexOption) => (
                  <AnnexRow key={a.key} annex={a} on={annexes[a.key] === true}
                            disabled={saving} onToggle={() => void toggleAnnex(a.key)} />
                ))}
                {annexMap.mapped && annexMap.others.length > 0 && (
                  <>
                    <div style={GROUP}>Add another</div>
                    {annexMap.others.map((a: AnnexOption) => (
                      <AnnexRow key={a.key} annex={a} on={annexes[a.key] === true}
                                disabled={saving} onToggle={() => void toggleAnnex(a.key)} />
                    ))}
                  </>
                )}
                <div style={NOTE}>
                  {annexMap.mapped
                    ? 'The first list is what your trade usually attaches. It is a suggestion and never a rule \u2014 attach any of them, and Annex G is there for work the others do not name.'
                    : 'We do not have your trade on file, so all seven are here. Attach whatever fits \u2014 Annex G covers work the others do not name.'}
                </div>
              </>
            )}

            {/* ══ VETO ROWS 30-31 · THE CARD FINALLY HAS SOMEWHERE TO GO ══════
                ⚠ IT IS DRAWN ON EVERY RECORD, NOT ONLY A BLANK ONE, AND THAT IS
                RULED — R-G32.20. `R4-record-filled` was drawn at sitting 1,
                BEFORE `R4-profile` existed; rider 2 added the sheet afterwards,
                so that frame's silence about this card is the silence of a frame
                with no sheet to point at, not a ruling that the card disappears.
                A policy settable once and never correctable is the failure. */}
            <div style={GROUP}>Set your policies once</div>
            <div style={NOTE}>Your prices, your cancellation slab, your delivery times. Asked once, used on every contract.</div>
            <button type="button" onClick={() => void openProfile()} style={GHOST}>Set your policies once</button>

            {/* ── THE TAILORING SURFACES JOIN THE ROOM (v4 §0) ──────────────
                ⚠ EACH IS ENTERED BY ITS OWN RATIFIED TITLE AND NOTHING ELSE.
                「What she receives」 is veto row 17 and 「What Priya will receive」
                is row 36; a row invented to point at a surface would be a byte
                the founder's pass never saw, on a delivery whose §4 said to
                expect none. T1 carries row 29 through to T3, which is where the
                Send lives under the v4 arc. */}
            <div style={GROUP}>The agreement</div>
            <button type="button" onClick={() => setClausesOpen(true)} style={OPT}>What she receives</button>
            <button type="button" onClick={() => setPreviewOpen(true)} style={OPT}>What {clientFirstName(record)} will receive</button>

            <button type="button" disabled={saving} onClick={() => void doPreview(record)} style={GHOST}>Preview the PDF</button>
            {/* ⚠ R-40.74 / the chair's P4 — **SEND IS ABSENT UNTIL A NUMBER EXISTS**,
                never disabled-and-greyed. This arc has refused the greyed control
                six times (the publish switch, the reel, the eight hub rows); a
                refusal drawn as something tappable is worse than no control. The
                line stands where the button would be, and the button appears the
                moment she has somewhere to send it. */}
            {/* ⚠ THE GATE IS `savedPhone`, NEVER `phone`. The door reads the ROW;
                if this read the input box, typing a number would summon a Send that
                the door then refuses — which is exactly what the walk hit. Send
                appears when there IS somewhere to send to, not when she has typed
                one. Still absent rather than greyed (the chair's P4).

                ⚠ AND AT SITTING 2 THE GATE WIDENS TO ALL SIX, THROUGH THE SAME
                `requiredRows` T3 READS. Two Sends with two different conditions
                would be one act with two opinions: this one would appear the
                moment she had a number, `T3-preview` would say four fields were
                missing, and whichever she pressed first would decide which was
                telling the truth. F-40.161's lesson is exactly that — a control
                whose condition and whose door consult different sources lies
                about itself — and a second control on the same plane is the same
                disease between two surfaces.

                ⚠ THE LINE STAYS ONLY FOR THE CASE THAT HAS A RATIFIED BYTE. When
                something OTHER than the number is missing there is nothing here
                at all: the row above opens the checklist, which names the field
                by name. Absence is the refusal (R-40.88's own shape), and four
                invented sentences would be four bytes nobody passed. */}
            {(() => {
              const missing = requiredRows(record, terms, depositPct, savedPhone, profile)
                .filter(r => r.value === null);
              if (missing.length === 0) {
                return <button type="button" disabled={saving} onClick={() => void doSendToCouple(record)} style={CTA}>Send to the couple</button>;
              }
              if (missing.some(r => r.label === 'Her number')) {
                return <div style={{ ...NOTE, paddingTop: 12 }}>Add her number to send this.</div>;
              }
              return null;
            })()}
            <button type="button" disabled={saving} onClick={() => void doSaveFill(true)} style={QUIET}>Save and finish later</button>
          </div>
        </div>
      )}

      {/* ══ THE PROFILE SHEET — `R4-profile`, Q1–Q10 ═════════════════════════
          The PROFILE tokens' first surface. Every `__________` a couple has ever
          seen on one of these agreements is one of the twenty-eight fields below,
          and the instrument has been correct in substance and blank in policy
          since the day it shipped because this sheet did not exist.

          ⚠ IT IS BOUNDED IN `dvh` LIKE ITS TWO SIBLINGS — F-40.154. Twenty-eight
          rows is the longest sheet in this room by some way, and `vh` does not
          shrink when the browser bar appears, so the foot of a long sheet becomes
          unreachable on iOS at exactly the point where it carries the Save. */}
      {profileOpen && (
        <div style={SCRIM} onClick={() => !saving && setProfileOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            ...SHEET, maxHeight: '88dvh', overflowY: 'auto', WebkitOverflowScrolling: 'touch', gap: 10,
          }}>
            <div style={GRAB}><div style={GRABBAR} /></div>
            <div style={{ ...labelStyle, letterSpacing: '0.42em', fontSize: 9, color: A.brass }}>Contracts</div>
            <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 20, color: 'var(--atelier-ink)', lineHeight: 1.15 }}>Your policies</div>
            {/* Q2 — and it is the sheet's own honesty about itself. R-40.88 omits
                a clause whose fields are unset, so a blank row here is not an
                unfinished form; it is a clause the agreement will not carry. */}
            <div style={NOTE}>Asked once. Used on every contract you fill. Leave anything blank and it prints as a blank.</div>

            {/* ⚠ THREE STATES, THREE SENTENCES, ONE KEY — and `ready` with an
                empty object is the COMMONEST of them, not a fourth. */}
            {profileState === 'loading' && <div style={NOTE}>Loading&#8230;</div>}
            {/* R-40.113, with the annex surface's. Q1–Q10 mint the sheet's
                twenty-eight labels, its title, its note and its Save. */}
            {profileState === 'failed' && <div style={NOTE}>We couldn&#8217;t load your policies.</div>}

            {profileState === 'ready' && (
              <>
                {PROFILE_SECTIONS.map(sec => (
                  <div key={sec.head}>
                    <div style={GROUP}>{sec.head}</div>
                    {sec.rows.map((row, i) => {
                      // ⚠ THE FOUR SLAB LABELS ARE HERS WHEN SHE HAS THRESHOLDS.
                      // The register's `cancel_tier_N_pct` tokens are what the
                      // instrument prints; a vendor meets a range of days and
                      // never a token name. Q6 says so in as many words.
                      const label = sec.head === 'If plans change' && i >= 2 && i <= 5
                        ? slabLabels(profile)[i - 2]
                        : row.label;
                      return (
                        <Field key={row.key} label={label} value={profile[row.key] ?? ''}
                               placeholder="Not filled"
                               onChange={v => setProfile({ ...profile, [row.key]: v })} />
                      );
                    })}
                    {/* Q9 POINTS AT SETTINGS AND NOT AT ITSELF. `vendors.gstin`
                        lives on the vendor row and has one home already; a second
                        entry point here would be a second home for a tax number.
                        The same reasoning the tailoring surface gives at row 28. */}
                    {sec.head === 'Tax' && (
                      <div style={NOTE}>Add your GSTIN in Settings to print the tax block.</div>
                    )}
                  </div>
                ))}
                <button type="button" disabled={saving} onClick={() => void doSaveProfile()} style={CTA}>Save my policies</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ══ THE CLAUSE LIST — `T1-clauses`, veto rows 16–29 ══════════════════
          Today the composer fills blanks and nothing else: no clause toggle, no
          choice about what leaves. Every switch here decides whether a clause is
          PRINTED, and rows 18 and 22 say so twice on purpose — one sentence at
          the top would be read once and forgotten by the row where the
          misreading would actually cost something. */}
      {clausesOpen && record && (
        <div style={SCRIM} onClick={() => !saving && setClausesOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            ...SHEET, maxHeight: '88dvh', overflowY: 'auto', WebkitOverflowScrolling: 'touch', gap: 10,
          }}>
            <div style={GRAB}><div style={GRABBAR} /></div>
            <div style={{ ...labelStyle, letterSpacing: '0.42em', fontSize: 9, color: A.brass }}>The agreement</div>
            <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 20, color: 'var(--atelier-ink)', lineHeight: 1.15 }}>What she receives</div>
            <div style={NOTE}>
              This decides which clauses are printed on {clientFirstName(record)}&#8217;s agreement &#8212; never whether her consent is on.
            </div>

            <div style={GROUP}>Always printed</div>
            <Field label="Parties, dates, fee, deposit" value="Required" readOnly />
            <Field label="Photographs and the wedding page" value="Printed" readOnly />
            {/* ⚠ ROW 22 STANDS WHERE A SWITCH IS CONSPICUOUSLY ABSENT, and clause
                10 has none anywhere in the estate. The renderer's own header
                forbids `publication` from `CLAUSE_SWITCHES` and `b56` reds on a
                mutation that adds it. The row is drawn with no control at all —
                not a disabled one — because a greyed switch beside a consent
                clause is precisely the misreading row 18 exists to prevent. */}
            <div style={NOTE}>There is no switch here for the wedding page. That one is {clientFirstName(record)}&#8217;s, in her own account.</div>

            <div style={GROUP}>Yours to choose</div>
            {CLAUSE_SWITCHES.map(sw => {
              // ⚠ CLAUSE 5'S ROW RENDERS ONLY WHEN THE GATE IS OPEN. An in-city
              // wedding prints no accommodation clause whatever the switch says,
              // so a switch drawn there would be a control with no effect — and
              // this arc has refused that seven times now.
              if (sw.key === 'accommodation' && !outstationGate(terms, vendorCity)) return null;
              return (
                <ClauseRow key={sw.key} label={sw.label}
                           meta={clauseMeta(sw.key, profile, vendorCity)}
                           on={switchOn(terms, sw.key)} disabled={saving}
                           onToggle={() => void toggleClause(sw.key)} />
              );
            })}

            <button type="button" onClick={() => { setClausesOpen(false); setPreviewOpen(true); }} style={GHOST}>
              See what {clientFirstName(record)} will receive
            </button>
          </div>
        </div>
      )}

      {/* ══ WHAT THE CLIENT WILL RECEIVE — `T3-preview`, rows 36–41 ══════════
          ⚠ THE ONE SURFACE IN THE ESTATE THAT SAYS *WHY* SOMETHING IS ABSENT,
          and it is a Vendor surface and never a Client one. R-40.88 forbids the
          document from explaining its own omissions, so a clause missing from
          her agreement is never a surprise to the Client — she never knew it
          could be there. It must never be a surprise to the Vendor.

          ⚠ AND THERE IS NO SEND WHILE A REQUIRED FIELD IS UNFILLED. Not a
          disabled one: the control is ABSENT and the line stands where it would
          have been (row 41, the chair's change). A greyed control is a thing she
          keeps tapping. */}
      {previewOpen && record && (
        <div style={SCRIM} onClick={() => !saving && setPreviewOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            ...SHEET, maxHeight: '88dvh', overflowY: 'auto', WebkitOverflowScrolling: 'touch', gap: 10,
          }}>
            <div style={GRAB}><div style={GRABBAR} /></div>
            <div style={{ ...labelStyle, letterSpacing: '0.42em', fontSize: 9, color: A.brass }}>The agreement</div>
            <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 20, color: 'var(--atelier-ink)', lineHeight: 1.15 }}>
              What {clientFirstName(record)} will receive
            </div>

            <div style={GROUP}>Needed before you can send</div>
            {requiredRows(record, terms, depositPct, savedPhone, profile).map(r => (
              <Field key={r.label} label={r.label} value={r.value ?? 'Not filled'} readOnly />
            ))}

            <button type="button" disabled={saving} onClick={() => void doPreview(record)} style={GHOST}>Preview the PDF</button>

            {/* ⚠ THE REFUSAL NAMES THE MISSING FIELD ONLY WHERE A RATIFIED BYTE
                EXISTS FOR IT — the number (P4) and the signatory (row 41). For
                the other four the checklist above has already said which row
                reads `Not filled`, and the ABSENCE of Send is the refusal.
                Authoring four more sentences here would be four bytes the
                founder's pass never saw. */}
            {(() => {
              const missing = requiredRows(record, terms, depositPct, savedPhone, profile)
                .filter(r => r.value === null);
              if (missing.length === 0) {
                return (
                  <button type="button" disabled={saving} onClick={() => void doSendToCouple(record)} style={CTA}>
                    Send to the couple
                  </button>
                );
              }
              if (missing.some(r => r.label === 'Her number')) {
                return <div style={{ ...NOTE, paddingTop: 12 }}>Add her number to send this.</div>;
              }
              if (missing.some(r => r.label === 'Who signs for you')) {
                return <div style={{ ...NOTE, paddingTop: 12 }}>Add who signs for you to send this. It goes on the agreement and on the seal.</div>;
              }
              return null;
            })()}
          </div>
        </div>
      )}

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--atelier-overlay)', zIndex: 20, display: 'flex', alignItems: 'flex-end' }} onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%',
            background: 'var(--atelier-sheet-bg)',
            backdropFilter: 'blur(40px) saturate(1.8)', WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
            borderTop: '0.5px solid var(--atelier-sheet-border)',
            padding: '20px 24px calc(24px + env(safe-area-inset-bottom))',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
              <div style={{ width: 36, height: 3, borderRadius: 2, background: 'var(--atelier-label)' }} />
            </div>
            <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 20, color: 'var(--atelier-ink)', lineHeight: 1.2 }}>{selected.title}</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{
                fontFamily: F.label, fontWeight: 400, fontSize: 8, color: STATE_COLOR[selected.state],
                letterSpacing: '0.28em', textTransform: 'uppercase',
                border: `0.5px solid ${STATE_COLOR[selected.state]}`, borderRadius: 2, padding: '4px 9px',
              }}>{stateWord(selected.state)}</span>
              {selected.file_size && <span style={{ fontFamily: F.script, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>{Math.round(selected.file_size/1024)} KB</span>}
              {selected.sent_at && <span style={{ fontFamily: F.script, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>Sent {new Date(selected.sent_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
              {selected.signed_at && <span style={{ fontFamily: F.script, fontSize: 16, lineHeight: 1.5, color: A.green }}>Signed {new Date(selected.signed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
            </div>
            {selected.notes && <div style={{ fontFamily: F.script, fontSize: 16, color: A.inkSoft, lineHeight: 1.5 }}>{selected.notes}</div>}

            {/* ── THE COMPOSED CONTRACT'S OWN CONTROLS ────────────────────────
                Preview goes through `renderContract`, the ONE call site, so what
                she sees is what the couple will see — rendered from the row, never
                served from a stored draft that could predate her last edit. */}
            {isComposed(selected) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 2 }}>
                {selected.state === 'signed' && (
                  <div style={{ ...labelStyle, marginBottom: 0, color: A.green }}>
                    {selected.deposit_received_at
                      ? `Received ${new Date(selected.deposit_received_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                      : depositLine(selected, null).replace(/^Deposit /, 'Awaiting ').replace(/ \u00b7 awaiting$/, '')}
                  </div>
                )}
                {/* Veto row 51 — master §7 said to a vendor in her own room, rather
                    than left to be inferred from the absence of a pay button. */}
                {selected.state === 'signed' && !selected.deposit_received_at && (
                  <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>
                    {/* ⚠ F-40.199 · `\u2014` IN JSX TEXT IS NINE CHARACTERS, NOT A DASH.
                        A vendor has been reading `She pays you directly \u2014 UPI or bank`
                        on her own screen. Nothing interprets a unicode escape here —
                        it is only a string-literal notation, and this position is not a
                        string literal. The census found eight escape sites in this file
                        and this is the ONLY one outside a literal, template or regex;
                        the other seven are correct and are untouched, including
                        `:714`'s `.split(' \u2014 ')`, whose dash must stay byte-identical
                        to the one the title writer emits. */}
                    She pays you directly &#8212; UPI or bank, as printed on the agreement. Nothing comes through this platform.
                  </div>
                )}
                {selected.state === 'signed' && !selected.deposit_received_at && (
                  <button type="button" onClick={() => doDeposit(selected)} disabled={saving} style={{
                    padding: '12px 0', background: 'transparent',
                    border: `0.5px solid ${A.green}`, borderRadius: 2, cursor: 'pointer',
                    fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.green,
                    letterSpacing: '0.32em', textTransform: 'uppercase',
                  }}>Mark the deposit received</button>
                )}
                {selected.state === 'signed' && selected.deposit_received_at && (
                  <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkSoft }}>
                    The date is held.
                  </div>
                )}
                <button type="button" onClick={() => void doPreview(selected)} style={{
                  padding: '12px 0', background: 'transparent',
                  border: '0.5px solid var(--atelier-accent-text)', borderRadius: 2, cursor: 'pointer',
                  fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.interactive,
                  letterSpacing: '0.32em', textTransform: 'uppercase',
                }}>Preview the PDF</button>
                {selected.state !== 'signed' && selected.state !== 'cancelled' && (
                  <button type="button" onClick={() => doSendToCouple(selected)} disabled={saving} style={{
                    padding: '12px 0', background: 'var(--atelier-accent-text)',
                    border: 'none', borderRadius: 2, cursor: 'pointer',
                    fontFamily: F.label, fontWeight: 400, fontSize: 9, color: INK_DEEP,
                    letterSpacing: '0.32em', textTransform: 'uppercase',
                  }}>Send to the couple</button>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
              <button type="button" onClick={() => doDownload(selected)} className="atelier-fab" style={{
                flex: '1 1 100%', padding: '13px 0', borderRadius: 2, cursor: 'pointer',
                border: '0.5px solid var(--atelier-label)',
                fontFamily: F.label, fontWeight: 400, fontSize: 10, color: INK_DEEP,
                letterSpacing: '0.42em', textTransform: 'uppercase',
              }}>Download</button>
              {selected.state === 'draft' && (
                <button type="button" onClick={() => doSend(selected)} disabled={saving} style={{
                  flex: 1, padding: '12px 0', background: 'transparent',
                  border: '0.5px solid rgba(201,168,76,0.5)', borderRadius: 2, cursor: 'pointer',
                  fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.interactiveWarm,
                  letterSpacing: '0.32em', textTransform: 'uppercase',
                }}>Mark Sent</button>
              )}
              {/* ── R-G32.14 / F12 · `MARK SIGNED` IS FOR AN UPLOADED CONTRACT ──
                  KEPT, because clause 12's last line is that a couple who would
                  rather sign on paper can, and the vendor is the only witness to
                  that. REFUSED on a COMPOSED one, because a vendor asserting a
                  signature with no OTP witness and no digest is the estate's own
                  F-04.71 costume class wearing a button — the sealed PDF's
                  fingerprint would be a claim about a signing that never
                  happened.
                  `isComposed` is the test and it is a FACT, not a heuristic: a
                  composed contract has a deposit percentage and an uploaded one
                  has none. */}
              {selected.state === 'sent' && !isComposed(selected) && (
                <button type="button" onClick={() => doMarkSigned(selected)} disabled={saving} style={{
                  flex: 1, padding: '12px 0', background: 'transparent',
                  border: `0.5px solid ${A.green}`, borderRadius: 2, cursor: 'pointer',
                  fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.green,
                  letterSpacing: '0.32em', textTransform: 'uppercase',
                }}>Mark Signed</button>
              )}
              {/* ⚠ A SENTENCE, NOT A GREYED BUTTON. s-G11.2's shape for the fifth
                  time in this arc: a refusal drawn as something tappable is worse
                  than no control. Veto row 47. */}
              {selected.state === 'sent' && isComposed(selected) && (
                <div style={{
                  flex: '1 1 100%', padding: 12, borderRadius: 2,
                  border: `0.5px solid ${A.red}`,
                  fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.red,
                }}>This one was filled here and is signed by the couple. Mark signed is for a contract you uploaded.</div>
              )}
              {selected.state !== 'cancelled' && (
                <button type="button" onClick={() => doCancel(selected)} disabled={saving} style={{
                  flex: 1, padding: '12px 0', background: 'transparent',
                  border: '0.5px solid rgba(224,123,92,0.4)', borderRadius: 2, cursor: 'pointer',
                  fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.red,
                  letterSpacing: '0.32em', textTransform: 'uppercase',
                }}>Cancel</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
