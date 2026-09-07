'use client';
// app/vendor/(shell)/contracts/screen.tsx — THE CONTRACTS ROOM, AS A VENDOR USES IT.
//
// ── G3.2 SITTING 3 · R-40.120 · R-40.101 · R-40.121 ─────────────────────────
// This file REPLACES the room (kickoff §1: screen.tsx may be replaced, not
// patched). The ratified mock is `docs/mocks/G32_S3_PROTOTYPE.html`, walked by
// the founder on his phone and said yes to on 2026-09-07; every surface byte here
// is a byte from that prototype, and the two that are not are marked ⚠ VETO.
//
// THE JOURNEY IS LINEAR AND VISIBLE (the founder's brief):
//   Policies (once) → New agreement (a client, or a name and a number) → This
//   agreement (couple, functions, fee, what's included, policies for this couple,
//   what's printed) → Preview and send → Sent → Signed → Deposit received →
//   The date is held. A progress thread on the record shows where she is.
//
// WHAT CROSSED FROM SITTING 2 BY NAME AND NOT BY RE-DERIVATION (R-40.117, the
// relay): the profile sheet's mechanics — seeds under her answers, never over
// (`{ ...seeds, ...stored }`); provenance held in `savedKeys` rather than diffed;
// closed vocabularies as controls (`ChoiceRow`); placeholders from the door with
// `{name}` from the session; the omitted delivery rows and `requiredRows` following
// the trade's basis (R-G32.21). Their identifiers are kept so `b57` can still find
// them. What changed is the register on the surface, every label's meaning line,
// and where the sheet sits.
//
// ── F-40.199's CLASS, AT SCALE, AND ITS STANDING CURE FOR THIS FILE ──────────
// The first cut wrote backslash-u escapes (for ’ — é …) inside JSX TEXT and JSX
// ATTRIBUTE strings, where nothing interprets an escape — a vendor read the nine
// raw characters of an apostrophe on her own screen (the founder's walk,
// 2026-09-07; 35 sites). Every such escape in this file is now THE CHARACTER
// ITSELF, in string literals too, so there is one convention and no context to
// get wrong. b57 §11 reds on any backslash-u escape returning.
//
// THREE THINGS THIS ROOM NO LONGER DOES:
//   · draw a Venue/City pair on the record — they wrote `terms.venue`/`terms.city`
//     and nothing read them (F-40.242). Functions carry their own venue and city.
//   · lose typing on a scrim tap — every field saves on blur (R-40.120 C9,
//     F-40.246). `Save and finish later` retires.
//   · route a composed, sent contract back to the record — it opens on its status
//     (F-40.245), where signed → deposit → the date is held can actually be reached.

import { useEffect, useRef, useState } from 'react';
import { INK_DEEP } from '@/lib/vendor/theme';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Fab } from '@/components/worklist/Fab';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { fetchAllContracts, requestContractUpload, finalizeContract,
         updateContract, sendContract, fetchContractDownload, cancelContract,
         requestContractPreview, sendContractToCouple, markContractDeposit, updateClientPhone,
         fetchTypedClients, composeContract, fillContract, fetchCabinet,
         fetchContractProfile, saveContractProfile, fetchAnnexMap, fetchMe,
         fetchStandardAgreement } from '@/lib/vendor/api/vendor';
import { formatRs } from '@/lib/vendor/format';
import type { Contract, Client, ContractProfileFields, AnnexOption,
              AnnexMapResponse } from '@/lib/vendor/types/vendor';

// ── TOKENS. The room's own type register; Cormorant for the room's word and each
// screen's title (the ratified mock's `--wl-t1`), DM Sans for everything read.
const A = {
  ink: 'var(--atelier-ink)', inkSoft: 'var(--atelier-ink-soft)', inkMute: 'var(--atelier-ink-mute)',
  inkFade: 'var(--atelier-ink-fade)', accent: 'var(--atelier-accent-text)',
  metal: 'var(--role-metal)', green: 'var(--role-positive)', red: 'var(--role-critical)', caution: 'var(--role-caution)',
  hair: 'var(--atelier-card-border)',
} as const;
const F = {
  title: 'var(--font-cormorant), Georgia, serif',
  body:  'var(--font-dm-sans), system-ui, sans-serif',
} as const;

// ── F-40.116 · THE STATE WORD IS THE DATABASE'S, TITLE-CASED. A positive list;
// `contracts_state_check` allows exactly these four.
const STATE_WORD: Record<string, string> = {
  draft: 'Draft', sent: 'Sent', signed: 'Signed', cancelled: 'Cancelled',
};
const stateWord = (s: string) => STATE_WORD[s] ?? s;

// ══ THE POLICY SHEET — every row carries a meaning line (kickoff §2: no row ships
// without one). Keys are the register's tokens (v2, v3 §5); labels and `why` are
// the founder's bytes from the prototype.
const NEEDED_ROWS = ['vendor_signatory_name', 'deposit_refundable', 'gst_treatment', 'gst_pct'];
const CLOSED_ROWS: Record<string, [string, string][]> = {
  deposit_refundable: [['no', 'No'], ['yes', 'Yes']],
  gst_treatment:      [['inclusive', 'Included'], ['exclusive', 'Added on top']],
};
type ProfileRow = { key: string; label: string; unit?: string; why: string; text?: boolean; numeric?: boolean };
type ProfileSection = { head: string; rows: ProfileRow[]; onTheDay?: string; foot?: string };

const PROFILE_SECTIONS: ProfileSection[] = [
  { head: 'Your business', rows: [
    { key: 'vendor_category_words', label: 'What you do', why: 'How your business is described in the agreement — “a makeup and hair business”.' },
    { key: 'vendor_signatory_name', label: 'Who signs for you', why: 'The name on your signature line. Usually you.' },
    // F-40.266: the name clause 12.2 promises — a PROFILE token beside the signatory (register v3 §0-ter).
    { key: 'named_professional',    label: 'Who attends', why: 'The person the couple is booking to be there in person. Leave it empty and the agreement makes no such promise.' },
    { key: 'vendor_credit_role',    label: 'Credited as', why: 'How your name appears on the couple’s wedding page and in the agreement, e.g. Makeup by Swati Roy.' },
  ] },
  { head: 'What is not included', rows: [
    { key: 'exclusions',      label: 'Never included', why: 'Things couples sometimes expect that you don’t provide unless agreed separately. Printed as not included.' },
    { key: 'meals_provision', label: 'Meals on a long day', why: 'What the couple provides for you and your team when a function runs long.' },
  ] },
  { head: 'Money', rows: [
    // register v3 §5 — one sentence, hers, printed as written (R-40.121)
    { key: 'travel_and_stay_terms', label: 'Travel and stay', why: 'In your own words. Prints exactly as written when a function is outside your city.', text: true },
    { key: 'overtime_rate',     label: 'Extra hours', unit: 'Rs', why: 'What you charge for each hour beyond the hours in your agreement.', numeric: true },
    { key: 'overtime_unit',     label: 'Charged per', why: 'hour, or half-day.' },
    { key: 'late_grace_days',   label: 'Late after', unit: 'days', why: 'How many days after a due date a payment counts as late.', numeric: true },
    { key: 'late_interest_pct', label: 'Late charge', unit: '% per month', why: 'Interest you may add to a late payment, for each month it stays unpaid.', numeric: true },
  ] },
  { head: 'If plans change', rows: [
    { key: 'postpone_notice_days',   label: 'Postpone notice', unit: 'days', why: 'How many days before the first function the couple must tell you to move the dates.', numeric: true },
    { key: 'postpone_window_months', label: 'Move within', unit: 'months', why: 'If the couple postpones, how many months later you’ll still honour the booking.', numeric: true },
    // The four slab labels are generated from her thresholds — see `slabLabels`.
    { key: 'cancel_tier_1_pct', label: 'More than 90 days before', unit: '% you keep', why: 'If they cancel this early, the share of the fee you keep.', numeric: true },
    { key: 'cancel_tier_2_pct', label: '60–90 days before', unit: '% you keep', why: '', numeric: true },
    { key: 'cancel_tier_3_pct', label: '30–60 days before', unit: '% you keep', why: '', numeric: true },
    { key: 'cancel_tier_4_pct', label: 'Under 30 days before', unit: '% you keep', why: '', numeric: true },
    { key: 'refund_days',       label: 'Refund within', unit: 'days', why: 'If you owe them money back, how many days you take to pay it.', numeric: true },
    { key: 'deposit_refundable', label: 'Is the deposit refundable?', why: 'Whether the deposit comes back if they cancel. Most vendors say no.' },
  ] },
  { head: 'What you deliver', rows: [
    { key: 'delivery_days',    label: 'Delivered within', unit: 'days', why: 'Counted from the last function.', numeric: true },
    { key: 'delivery_method',  label: 'How', why: 'A private online gallery, a drive, handed over in person.' },
    { key: 'link_live_days',   label: 'Link stays live', unit: 'days', why: 'How long the couple can download before the link expires.', numeric: true },
    { key: 'revision_rounds',  label: 'Rounds of changes', why: 'How many rounds of edits are included in the fee.', numeric: true },
    { key: 'revision_rate',    label: 'Each further round', unit: 'Rs', why: 'What you charge for a round beyond those.', numeric: true },
    { key: 'archive_months',   label: 'Files kept for', unit: 'months', why: 'How long you keep the originals before you may delete them.', numeric: true },
  ], onTheDay: 'You deliver on the day, so there’s nothing to set here.' },
  { head: 'Publication', rows: [
    { key: 'takedown_days',    label: 'Take down within', unit: 'days', why: 'If a guest asks to be removed from a published photo, how many days you take.', numeric: true },
    { key: 'fm_window_months', label: 'Move dates within', unit: 'months', why: 'After a flood, curfew or illness, how long both sides look for new dates before either can walk away.', numeric: true },
  ] },
  { head: 'Tax', rows: [
    { key: 'gst_treatment', label: 'GST', why: 'Whether your fee already includes GST, or GST is added on top.' },
    { key: 'gst_pct',       label: 'Rate', unit: '%', why: 'Your GST rate. Leave it empty if you’re not registered — the tax clause is then left out.', numeric: true },
  ], foot: 'Your GSTIN lives in Settings. Add it there and the tax clause prints.' },
];

/** The four cancellation labels, built from her own thresholds where she has them. */
function slabLabels(f: ContractProfileFields): [string, string, string, string] {
  const d = (k: string, fallback: string) => { const v = (f[k] || '').trim(); return v === '' ? fallback : v; };
  const t1 = d('cancel_tier_1_days', '90'), t2 = d('cancel_tier_2_days', '60'), t3 = d('cancel_tier_3_days', '30');
  return [`More than ${t1} days before`, `${t2}–${t1} days before`, `${t3}–${t2} days before`, `Under ${t3} days before`];
}

// ══ THE CLAUSE SWITCHES — keys are the renderer's `CLAUSE_SWITCHES`, read at
// `contract.terms.clauses.<key>`; absent is ON (`switchOn`). `publication` is not
// here and must never be: clause 10 has no switch anywhere in the estate.
const CLAUSE_SWITCHES: { key: string; label: string }[] = [
  { key: 'extra_hours',        label: 'Extra hours' },
  { key: 'late_payment',       label: 'Late payment charge' },
  { key: 'tax_block',          label: 'Tax clause' },
  { key: 'named_professional', label: 'You attend personally' },
  { key: 'portfolio_use',      label: 'Use their photos in your portfolio' },
  { key: 'accommodation',      label: 'Travel and stay' },
];
function switchOn(terms: Record<string, unknown>, key: string): boolean {
  const s = (terms.clauses as Record<string, unknown> | undefined) || {};
  return s[key] !== false;
}

/** A manual function as the room writes it — the shape `contractSource.manualFunctions` reads (register v3 §3). */
type ManualFn = { title: string; date: string; time?: string; venue?: string; city?: string };
function manualFns(terms: Record<string, unknown>): ManualFn[] {
  const m = terms.functions_manual;
  return Array.isArray(m) ? (m as ManualFn[]).filter(f => f && f.title && f.date) : [];
}
/** Every function the room can see, with its place — events-linked entries at
 *  `terms.functions` (keyed by event id) and the manual rows. The renderer's
 *  `placeOf` reads the same two. */
function fnPlaces(terms: Record<string, unknown>): { city?: string }[] {
  const keyed = Object.values((terms.functions as Record<string, { city?: string }> | undefined) || {});
  return [...keyed, ...manualFns(terms)];
}

/** CLAUSE 5'S GATE — a fact, not a control. Open only where a function is outside
 *  her city; an unknown city leaves it shut. */
function outstationGate(terms: Record<string, unknown>, vendorCity: string | null): boolean {
  const base = String(vendorCity || '').trim().toLowerCase();
  if (!base) return false;
  return fnPlaces(terms).some((k) => {
    const c = String((k && k.city) || '').trim().toLowerCase();
    return c !== '' && c !== base;
  });
}

// ══ WHAT IS NEEDED BEFORE SHE CAN SEND. Derived from the same places the renderer
// reads; the door refuses on none of them yet, so the room is the one home for now.
type RequiredRow = { key: string; label: string; value: string | null; where: 'record' | 'policies' };
function requiredRows(
  c: Contract, terms: Record<string, unknown>, depositPct: string,
  savedPhone: string, profile: ContractProfileFields,
  deliveryBasis: 'days' | 'on_the_day' = 'days',
): RequiredRow[] {
  const t = (v: unknown) => { const s = v === null || v === undefined ? '' : String(v).trim(); return s === '' ? null : s; };
  const n = fnPlaces(terms).length;
  // `where` is the screen a tap on the missing row opens — the founder's ruling on
  // the walk: a list that names a blank must also take her to it.
  return [
    { key: 'phone',     label: 'Their WhatsApp number',            value: t(savedPhone), where: 'record' },
    { key: 'functions', label: 'At least one function and its date', value: n > 0 ? String(n) : null, where: 'record' },
    { key: 'fee',       label: 'Your fee',                          value: t(terms.fee_total) ?? (c.invoice_id ? 'From your invoice' : null), where: 'record' },
    { key: 'deposit',   label: 'The deposit',                       value: t(depositPct), where: 'record' },
    ...(deliveryBasis === 'on_the_day' ? [] : [{ key: 'delivery_days', label: 'Delivered within (in your policies)', value: t(profile.delivery_days), where: 'policies' as const }]),
    { key: 'vendor_signatory_name', label: 'Who signs for you (in your policies)', value: t(profile.vendor_signatory_name), where: 'policies' },
  ];
}

type PickRow = { key: string; id: string | null; name: string; phone: string | null; from: 'client' | 'cabinet' };
type View = 'room' | 'policies' | 'overrides' | 'newPerson' | 'pick' | 'record' | 'send' | 'after';

// ── PRIMITIVES ───────────────────────────────────────────────────────────────
const SCRIM: React.CSSProperties = { position: 'fixed', inset: 0, background: 'var(--atelier-overlay)', zIndex: 20, display: 'flex', alignItems: 'flex-end' };
const SHEET: React.CSSProperties = {
  width: '100%', maxHeight: '82dvh', overflowY: 'auto', WebkitOverflowScrolling: 'touch',
  background: 'var(--atelier-sheet-bg)', borderTop: `0.5px solid var(--atelier-sheet-border)`,
  padding: '14px 16px calc(28px + env(safe-area-inset-bottom))', display: 'flex', flexDirection: 'column', gap: 4,
};
const GRAB: React.CSSProperties = { width: 36, height: 3, borderRadius: 2, background: 'var(--atelier-label)', margin: '0 auto 12px' };
const H3: React.CSSProperties = { fontFamily: F.title, fontWeight: 500, fontSize: 17, lineHeight: 1.3, color: A.ink, margin: '22px 0 4px' };
const HINT: React.CSSProperties = { fontFamily: F.body, fontWeight: 400, fontSize: 13, lineHeight: 1.45, color: A.inkMute, margin: '2px 0 8px' };
const TAP: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left',
  padding: '14px 0', border: 0, borderBottom: `0.5px solid ${A.hair}`, background: 'transparent', color: A.ink,
  fontFamily: F.body, fontWeight: 400, fontSize: 15, lineHeight: 1.35, cursor: 'pointer',
};
const SUB: React.CSSProperties = { display: 'block', fontFamily: F.body, fontSize: 12.5, lineHeight: 1.4, color: A.inkMute, marginTop: 2 };
const RIGHT: React.CSSProperties = { fontFamily: F.body, fontWeight: 500, fontSize: 12, color: A.inkMute, whiteSpace: 'nowrap', flexShrink: 0 };
const BTN: React.CSSProperties = { display: 'block', width: '100%', padding: '14px 0', marginTop: 12, borderRadius: 2, fontFamily: F.body, fontWeight: 500, fontSize: 14, cursor: 'pointer', textAlign: 'center' };
const CTA: React.CSSProperties   = { ...BTN, background: A.accent, color: 'var(--role-ink-deep)', border: 0 };
const GHOST: React.CSSProperties = { ...BTN, background: 'transparent', color: A.accent, border: `0.5px solid ${A.accent}` };
const QUIET: React.CSSProperties = { ...BTN, background: 'transparent', color: A.inkMute, border: `0.5px solid ${A.hair}` };
const INPUT: React.CSSProperties = {
  width: '100%', marginTop: 6, padding: '9px 10px', boxSizing: 'border-box', background: 'var(--atelier-input-bg)',
  border: `0.5px solid ${A.hair}`, borderRadius: 2, color: A.ink, fontFamily: F.body, fontWeight: 400, fontSize: 15, lineHeight: 1.4, outline: 'none',
  caretColor: A.accent,
};
const TAG: React.CSSProperties = { fontFamily: F.body, fontWeight: 500, fontSize: 11, lineHeight: 1, color: A.caution, whiteSpace: 'nowrap' };

const Blk = ({ children }: { children: React.ReactNode }) => <div style={{ padding: '0 16px' }}>{children}</div>;
const Scroll = ({ children, fab }: { children: React.ReactNode; fab?: boolean }) => (
  <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: fab ? 110 : 40, WebkitOverflowScrolling: 'touch' }}>{children}</div>
);

/** A screen's header: back chevron, title in Cormorant, one line under it. */
function Head({ title, sub, onBack }: { title: string; sub?: string; onBack?: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px 12px', borderBottom: `0.5px solid ${A.hair}`, flexShrink: 0 }}>
      {onBack && (
        <button type="button" onClick={onBack} aria-label="Back"
                style={{ background: 'none', border: 0, color: A.ink, fontFamily: F.body, fontSize: 22, lineHeight: 1, padding: '0 4px 0 0', cursor: 'pointer', width: 28 }}>{'‹'}</button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.title, fontWeight: 500, fontSize: 22, lineHeight: 1.1, color: A.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
        {sub ? <div style={{ fontFamily: F.body, fontSize: 11, lineHeight: 1.3, color: A.inkMute, letterSpacing: '0.02em' }}>{sub}</div> : null}
      </div>
    </div>
  );
}

/** One row of a form: label, an optional unit, an optional tag, the meaning line, the control.
 *  `required` names the ACT the blank blocks (`Needed to send`); `mark` names a value's
 *  PROVENANCE (hers / suggested / needed) — two statements, both kept. */
const MARK_WORD: Record<'Yours' | 'Default' | 'Needed', string> = { Yours: 'Yours', Default: 'Suggested', Needed: 'Needed to send' };
const MARK_COLOUR: Record<string, string> = { Yours: A.green, Default: A.inkFade, Needed: A.caution };
function Field({ label, unit, why, value, placeholder, onChange, onBlur, readOnly, required, mark, inputMode, multiline }: {
  label: string; unit?: string; why?: string; value: string; placeholder?: string;
  onChange?: (v: string) => void; onBlur?: () => void; readOnly?: boolean; required?: string;
  mark?: 'Yours' | 'Default' | 'Needed' | null; inputMode?: 'numeric' | 'tel' | 'decimal'; multiline?: boolean;
}) {
  const control = readOnly
    ? <div style={{ fontFamily: F.body, fontSize: 15, lineHeight: 1.4, color: value ? A.ink : A.inkFade, marginTop: 2 }}>{value || placeholder || ''}</div>
    : multiline
      ? <textarea value={value} placeholder={placeholder} onChange={e => onChange?.(e.target.value)} onBlur={onBlur}
                  style={{ ...INPUT, resize: 'none', minHeight: 64 }} />
      : <input value={value} placeholder={placeholder} inputMode={inputMode} onChange={e => onChange?.(e.target.value)} onBlur={onBlur} style={INPUT} />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '11px 0', borderBottom: `0.5px solid ${A.hair}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, fontFamily: F.body, fontWeight: 500, fontSize: 14, lineHeight: 1.3, color: A.ink }}>
        <span>{label}{unit ? <span style={{ fontWeight: 400, fontSize: 12, color: 'var(--atelier-ink-dim)' }}> {unit}</span> : null}</span>
        {required ? <span style={TAG}>{required}</span>
          : mark ? <span style={{ ...TAG, color: MARK_COLOUR[mark] }}>{MARK_WORD[mark]}</span> : null}
      </div>
      {why ? <div style={{ fontFamily: F.body, fontSize: 12.5, lineHeight: 1.4, color: A.inkMute }}>{why}</div> : null}
      {control}
    </div>
  );
}

/** A closed vocabulary, drawn as a control. The KEY is stored (clause 4.2 reads
 *  `inclusive`/`exclusive`); the LABEL is what she reads. */
function ChoiceRow({ label, why, options, value, mark, onPick }: {
  label: string; why?: string; options: [string, string][]; value: string;
  mark?: 'Yours' | 'Default' | 'Needed' | null; onPick: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '11px 0', borderBottom: `0.5px solid ${A.hair}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, fontFamily: F.body, fontWeight: 500, fontSize: 14, color: A.ink }}>
        <span>{label}</span>
        {mark ? <span style={{ ...TAG, color: MARK_COLOUR[mark] }}>{MARK_WORD[mark]}</span> : null}
      </div>
      {why ? <div style={{ fontFamily: F.body, fontSize: 12.5, lineHeight: 1.4, color: A.inkMute }}>{why}</div> : null}
      <div style={{ display: 'inline-flex', alignSelf: 'flex-start', border: `0.5px solid ${A.hair}`, borderRadius: 2, overflow: 'hidden', marginTop: 6 }}>
        {options.map(([key, text]) => (
          <button key={key} type="button" onClick={() => onPick(key)}
                  style={{ fontFamily: F.body, fontWeight: 500, fontSize: 13, padding: '9px 14px', border: 0, cursor: 'pointer',
                           background: value === key ? 'var(--atelier-row-hover)' : 'transparent', color: value === key ? A.ink : 'var(--atelier-ink-dim)' }}>{text}</button>
        ))}
      </div>
    </div>
  );
}

/** The client's first name, from the composed title's first half — the room's one way to it. */
function clientFirstName(c: Contract): string {
  const whole = String(c.title || '').split(' — ')[0].trim();
  return whole.split(/\s+/)[0] || whole;
}
function clientName(c: Contract): string { return String(c.title || '').split(' — ')[0].trim(); }

/** A composed contract carries a deposit percentage; an uploaded one cannot — a fact, not a heuristic. */
function isComposed(c: Contract) { return c.deposit_pct !== null && c.deposit_pct !== undefined; }

/** Where she is on the thread — derived, no schema (R-40.120 C8). */
function stage(c: Contract): number {
  if (c.state === 'cancelled') return 7;
  if (c.state === 'signed' && c.deposit_received_at) return 6;
  if (c.state === 'signed') return 5;
  if (c.state === 'sent') return 3;
  return 1;
}
const THREAD_STEPS: [string, string][] = [
  ['Policies', 'set once'], ['This agreement', 'couple, dates, fee, what’s included'], ['Preview', 'read it as they will'],
  ['Sent', 'to their WhatsApp'], ['Signed', 'they read and agree'], ['Deposit received', 'you mark it'], ['The date is held', ''],
];
function Thread({ c, policiesSet }: { c: Contract; policiesSet: boolean }) {
  const st = stage(c);
  const cur = st >= 6 ? 6 : st >= 5 ? 4 : st >= 3 ? 3 : 1;
  const doneUpto = st >= 6 ? 6 : st >= 5 ? 4 : st >= 3 ? 3 : policiesSet ? 0 : -1;
  return (
    <div style={{ margin: '14px 16px 4px', display: 'flex', flexDirection: 'column' }}>
      {THREAD_STEPS.map(([w, s], i) => {
        const done = i <= doneUpto && i !== cur, here = i === cur;
        const dotStyle: React.CSSProperties = {
          width: 10, height: 10, borderRadius: '50%', marginTop: 5, flexShrink: 0, position: 'relative',
          border: `1.5px solid ${done ? A.green : here ? A.metal : A.inkFade}`, background: done ? A.green : here ? A.metal : 'transparent',
        };
        return (
          <div key={w} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', minHeight: 30 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={dotStyle} />
              {i < THREAD_STEPS.length - 1 && <div style={{ width: 1.5, flex: 1, minHeight: 14, background: A.hair, marginTop: 2 }} />}
            </div>
            <div style={{ fontFamily: F.body, fontSize: 13, lineHeight: 1.4, color: here ? A.ink : done ? A.inkSoft : A.inkMute, fontWeight: here ? 500 : 400 }}>
              {w}
              {i === 0 && !policiesSet ? <span style={{ display: 'block', fontSize: 12, color: A.inkMute, fontWeight: 400 }}>not set up yet — suggested values are used until you do</span> : null}
              {here && s ? <span style={{ display: 'block', fontSize: 12, color: A.inkMute, fontWeight: 400 }}>{s}</span> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ContractsScreen() {
  const { toast, show } = useToast();
  const { session } = useVendorSession();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('room');
  const [saving, setSaving] = useState(false);
  const [vendorCity, setVendorCity] = useState<string | null>(null);

  // upload arm (unchanged mechanism; clause 16's paper path)
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<Contract | null>(null);   // an UPLOADED contract's detail sheet

  // the fork and the picker — three states, three bytes (F-40.138)
  const [startOpen, setStartOpen] = useState(false);
  const [pickState, setPickState] = useState<'loading' | 'failed' | 'ready'>('loading');
  const [clients, setClients]     = useState<PickRow[]>([]);
  const [newName, setNewName]     = useState('');
  const [newPhone, setNewPhone]   = useState('');

  // the record
  const [record, setRecord]         = useState<Contract | null>(null);
  const [terms, setTerms]           = useState<Record<string, unknown>>({});
  const [annexes, setAnnexes]       = useState<Record<string, boolean>>({});
  const [depositPct, setDepositPct] = useState<string>('');
  const [promoted, setPromoted]     = useState(false);
  // `phone` is what she is typing; `savedPhone` is what the row holds. Send consults the row.
  const [phone, setPhone]           = useState('');
  const [savedPhone, setSavedPhone] = useState('');
  const [fnOpen, setFnOpen]         = useState(false);
  const [moreOpen, setMoreOpen]     = useState(false);
  const [fnDraft, setFnDraft]       = useState<ManualFn>({ title: '', date: '', time: '', venue: '', city: '' });

  // the profile sheet — `{}` is a legal answer and the commonest
  const [profileState, setProfileState] = useState<'loading' | 'failed' | 'ready'>('loading');
  const [profile, setProfile]           = useState<ContractProfileFields>({});
  const [savedKeys, setSavedKeys]       = useState<Set<string>>(new Set());
  const [policiesSet, setPoliciesSet]   = useState(false);
  // the per-couple sheet writes here, never to the profile
  const [overrides, setOverrides]       = useState<ContractProfileFields>({});

  // the annex map — `mapped` is the door's, and the surface changes shape on it
  const [annexState, setAnnexState] = useState<'loading' | 'failed' | 'ready'>('loading');
  const [annexMap, setAnnexMap]     = useState<AnnexMapResponse | null>(null);

  useEffect(() => {
    fetchAllContracts().then(r => { if (r.ok) setContracts((r as { contracts: Contract[] }).contracts); })
      .finally(() => setLoading(false));
    fetchMe().then(r => { if (r.ok) setVendorCity(r.vendor.city || null); }).catch(() => {});
    // The room's card says SET UP or EDIT on a fact — whether she has saved anything.
    fetchContractProfile().then(r => {
      if ('ok' in r && r.ok) { const f = (r as { fields: ContractProfileFields }).fields || {}; setProfile(f); setSavedKeys(new Set(Object.keys(f))); setPoliciesSet(Object.keys(f).length > 0); }
    }).catch(() => {});
    // The map is read here by name rather than through `loadAnnexMap` (declared
    // below): the effect runs once at mount and the record's open re-reads it.
    fetchAnnexMap().then(r => {
      if (!('ok' in r) || !r.ok) { setAnnexState('failed'); return; }
      setAnnexMap(r as AnnexMapResponse); setAnnexState('ready');
    }).catch(() => setAnnexState('failed'));
  }, []);

  const seeds = annexMap?.defaults ?? {};
  const basis = annexMap?.delivery_basis ?? 'days';
  /** The effective policies for a record: seeds under hers under this couple's — the source's `effectiveProfile`, with the seeds the sheet shows. */
  const effective = (): ContractProfileFields => ({ ...seeds, ...profile, ...overrides });

  function go(v: View) { setView(v); setStartOpen(false); }

  // ── READS ──────────────────────────────────────────────────────────────────
  async function loadAnnexMap() {
    setAnnexState('loading');
    const r = await fetchAnnexMap();
    if (!('ok' in r) || !r.ok) { setAnnexState('failed'); return; }
    setAnnexMap(r as AnnexMapResponse);
    setAnnexState('ready');
  }
  async function openProfile(over: boolean) {
    go(over ? 'overrides' : 'policies');
    setProfileState('loading');
    const r = await fetchContractProfile();
    if (!('ok' in r) || !r.ok) { setProfileState('failed'); return; }
    const stored = (r as { fields: ContractProfileFields }).fields || {};
    // ⚠ THE SEEDS GO UNDER HER ANSWERS, NEVER OVER THEM — R-40.114, carried from
    // sitting 2 by name (R-40.117). Her row wins every collision; `savedKeys` is
    // what lets the marks tell a seed from an answer. The renderer reads
    // `contract_profiles.fields` alone, so a seed she never saves never reaches
    // paper — which is why the sheet holds the merge and posts it whole.
    const seedsNow = annexMap?.defaults ?? {};
    setSavedKeys(new Set(Object.keys(stored)));
    setProfile({ ...seedsNow, ...stored });
    setPoliciesSet(Object.keys(stored).length > 0);
    setProfileState('ready');
  }
  async function loadClientPhone(clientId: string) {
    if (!session?.id) return;
    const r = await fetchTypedClients(session.id);
    if (!r.ok) return;
    const hit = (r as { clients: Client[] }).clients.find(c => c.id === clientId);
    const p = (hit && hit.phone) || '';
    setPhone(p); setSavedPhone(p);
  }
  async function openPicker() {
    go('pick');
    if (!session?.id) { setPickState('failed'); return; }
    if (clients.length) { setPickState('ready'); return; }
    setPickState('loading');
    const [typed, cab] = await Promise.all([fetchTypedClients(session.id), fetchCabinet(session.id)]);
    if (!typed.ok || !cab.ok) { setPickState('failed'); return; }
    const rows: PickRow[] = (typed as { clients: Client[] }).clients.map(c => ({ key: `c:${c.id}`, id: c.id, name: c.name, phone: c.phone, from: 'client' as const }));
    const seen = new Set(rows.map(r => (r.phone || '').trim()).filter(Boolean));
    (cab.clients ?? []).forEach(b => {
      const name = (b.client || '').trim(); const phone = (b.phone || '').trim();
      if (!name) return;
      if (phone && seen.has(phone)) return;
      if (phone) seen.add(phone);
      rows.push({ key: `b:${b.id}`, id: null, name, phone: phone || null, from: 'cabinet' });
    });
    setClients(rows); setPickState('ready');
  }

  /** Open a record from a row: everything reads OUT OF THE ROW; nothing is retyped. */
  function openRecord(c: Contract) {
    setRecord(c);
    const t = (c.terms as Record<string, unknown>) ?? {};
    setTerms(t);
    setAnnexes(c.annexes ?? {});
    setOverrides(((t.policy_overrides as ContractProfileFields) ?? {}));
    setDepositPct(c.deposit_pct === null || c.deposit_pct === undefined ? '' : String(c.deposit_pct));
    setPhone(''); setSavedPhone('');
    if (c.client_id) void loadClientPhone(c.client_id);
    void loadAnnexMap();
    setSelected(null);
    go(isComposed(c) && c.state !== 'draft' ? 'after' : 'record');   // F-40.245
  }

  // ── WRITES ─────────────────────────────────────────────────────────────────
  /** THE ONLY WRITER of the blanks from this surface; the row's echo lands in state. */
  async function fill(patch: { terms?: Record<string, unknown>; annexes?: Record<string, boolean>; deposit_pct?: number | null }, revert?: () => void) {
    if (!record) return false;
    setSaving(true);
    const res = await fillContract(record.id, patch);
    setSaving(false);
    if (!res.ok) { revert?.(); show((res as { error?: string }).error ?? 'That could not be saved.', 'error'); return false; }
    const c = (res as { contract: Contract }).contract;
    setRecord(c);
    setTerms((c.terms as Record<string, unknown>) ?? {});
    setAnnexes(c.annexes ?? {});
    setContracts(prev => prev.map(x => (x.id === c.id ? c : x)));
    return true;
  }
  /** Autosave on blur (R-40.120 C9): text fields save when she leaves them. */
  async function saveText() {
    if (!record) return;
    const pct = depositPct.trim() === '' ? null : Number(depositPct);
    await fill({ terms, deposit_pct: pct });
  }
  /** The number is written to the CLIENT, its one home, and only when it changed. */
  async function savePhone() {
    if (!record || !record.client_id) return;
    if (!(phone.trim() && phone.trim() !== savedPhone.trim())) return;
    const pr = await updateClientPhone(record.client_id, phone.trim());
    if (!pr.ok) { show((pr as { error?: string }).error ?? 'That number could not be saved.', 'error'); return; }
    setSavedPhone(phone.trim());
    setClients(prev => prev.map(r => (r.id === record.client_id ? { ...r, phone: phone.trim() } : r)));
  }
  async function toggleAnnex(key: string) {
    if (!record || saving) return;
    const prev = annexes; const next = { ...annexes, [key]: !annexes[key] };
    setAnnexes(next);
    await fill({ annexes: next }, () => setAnnexes(prev));
  }
  async function toggleClause(key: string) {
    if (!record || saving) return;
    const prev = terms;
    const clauses = { ...((terms.clauses as Record<string, boolean> | undefined) || {}) };
    clauses[key] = !switchOn(terms, key);
    const next = { ...terms, clauses };
    setTerms(next);
    await fill({ terms: next }, () => setTerms(prev));
  }
  async function addFn() {
    if (!record) return;
    if (!fnDraft.title.trim() || !fnDraft.date.trim()) { show('A function needs a name and a date.', 'error'); return; }
    const next = { ...terms, functions_manual: [...manualFns(terms), { ...fnDraft, title: fnDraft.title.trim(), city: (fnDraft.city || '').trim() || (vendorCity || '') }] };
    setTerms(next); setFnOpen(false);
    setFnDraft({ title: '', date: '', time: '', venue: '', city: '' });
    await fill({ terms: next });
  }
  async function removeFn(i: number) {
    const list = manualFns(terms).filter((_, j) => j !== i);
    const next = { ...terms, functions_manual: list };
    setTerms(next);
    await fill({ terms: next });
  }
  async function doSaveProfile() {
    setSaving(true);
    const r = await saveContractProfile(profile);
    setSaving(false);
    if (!('ok' in r) || !r.ok) { show((r as { error?: string }).error ?? 'That could not be saved.', 'error'); return; }
    const f = (r as { fields: ContractProfileFields }).fields || {};
    setProfile(f); setSavedKeys(new Set(Object.keys(f))); setPoliciesSet(Object.keys(f).length > 0);
    go(record ? 'record' : 'room'); show('Policies saved', 'success');
  }
  async function doSaveOverrides(clear: boolean) {
    const ov = clear ? {} : overrides;
    const next = { ...terms, policy_overrides: ov };
    setOverrides(ov); setTerms(next);
    if (await fill({ terms: next })) { go('record'); show(clear ? 'Back to your policies' : 'Saved for this agreement only', 'success'); }
  }
  async function doCompose(row: PickRow) {
    setSaving(true);
    const res = await composeContract(row.id ? { client_id: row.id } : { name: row.name, phone: row.phone });
    setSaving(false);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); return; }
    const r = res as { contract: Contract; promoted?: boolean };
    setContracts(prev => [r.contract, ...prev]);
    setPromoted(r.promoted === true);
    openRecord(r.contract);
    if (r.promoted === true) show('Added to your clients', 'success');
  }
  async function doNewPerson() {
    const n = newName.trim(), p = newPhone.trim();
    if (!n || !p) { show('A name and a number are both needed.', 'error'); return; }
    await doCompose({ key: 'n', id: null, name: n, phone: p, from: 'cabinet' });
    setNewName(''); setNewPhone('');
  }
  async function doPreview(c: Contract) {
    setSaving(true);
    const res = await requestContractPreview(c.id);
    setSaving(false);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); return; }
    window.open((res as { pdf_url: string }).pdf_url, '_blank');
  }
  /** The door renders v4 with labelled placeholders; the room opens the url it gets back (never the door in a tab — F-40.152). */
  async function doStandard() {
    setSaving(true);
    const res = await fetchStandardAgreement();
    setSaving(false);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); return; }
    window.open((res as { pdf_url: string }).pdf_url, '_blank');
  }
  async function doSendToCouple(c: Contract) {
    setSaving(true);
    const res = await sendContractToCouple(c.id);
    setSaving(false);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); return; }
    const r = res as { sign_url: string; sent: boolean };
    // Never a false done: while the template is dark nothing was sent, and the link goes to the clipboard.
    if (r.sent) show(`Sent to ${clientFirstName(c)}`, 'success');
    else { try { await navigator.clipboard.writeText(r.sign_url); show('Link copied — sending is not open yet', 'success'); } catch { show(r.sign_url, 'success'); } }
    const list = await fetchAllContracts();
    if (list.ok) {
      const all = (list as { contracts: Contract[] }).contracts; setContracts(all);
      const fresh = all.find(x => x.id === c.id); if (fresh) { setRecord(fresh); go('after'); }
    }
  }
  async function doDeposit(c: Contract) {
    setSaving(true);
    const res = await markContractDeposit(c.id, true);
    setSaving(false);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); return; }
    const u = (res as { contract: Contract }).contract;
    setContracts(prev => prev.map(x => (x.id === c.id ? u : x))); setRecord(u);
    show('The date is held', 'success');
  }
  async function doCancel(c: Contract) {
    setSaving(true);
    const res = await cancelContract(c.id);
    setSaving(false);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); return; }
    show('Cancelled', 'success');
    const list = await fetchAllContracts();
    if (list.ok) setContracts((list as { contracts: Contract[] }).contracts);
    setSelected(null); setRecord(null); go('room');
  }
  async function doDownload(c: Contract) {
    const res = await fetchContractDownload(c.id);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); return; }
    window.open((res as { download_url: string }).download_url, '_blank');
  }
  async function doUpload() {
    if (!title.trim() || !file || uploading) return;
    setUploading(true); setUploadProgress('Getting upload URL…');
    try {
      const urlRes = await requestContractUpload(title.trim(), file.name);
      if (!urlRes.ok) { show((urlRes as { error?: string }).error ?? 'Failed', 'error'); setUploading(false); return; }
      const { contract_id, upload_url } = urlRes as { contract_id: string; upload_url: string };
      setUploadProgress('Uploading file…');
      const up = await fetch(upload_url, { method: 'PUT', body: file, headers: { 'Content-Type': 'application/pdf' } });
      if (!up.ok) { show('Upload failed — check the file is a PDF', 'error'); setUploading(false); return; }
      setUploadProgress('Finishing…');
      const fin = await finalizeContract(contract_id);
      if (!fin.ok) { show((fin as { error?: string }).error ?? 'Failed', 'error'); setUploading(false); return; }
      show('Contract saved', 'success');
      setContracts(prev => [(fin as { contract: Contract }).contract, ...prev]);
      setUploadOpen(false); setTitle(''); setFile(null);
    } catch { show('Upload failed', 'error'); }
    setUploading(false); setUploadProgress('');
  }
  async function doMarkSent(c: Contract) {
    setSaving(true);
    const res = await sendContract(c.id);
    if (!res.ok) show((res as { error?: string }).error ?? 'Failed', 'error');
    else { show('Marked as sent', 'success'); setContracts(prev => prev.map(x => x.id === c.id ? (res as { contract: Contract }).contract : x)); setSelected(null); }
    setSaving(false);
  }
  /** MARK SIGNED is for an UPLOADED contract only (R-G32.14): a composed one is signed by the couple, with a witness. */
  async function doMarkSigned(c: Contract) {
    setSaving(true);
    const res = await updateContract(c.id, { state: 'signed', signed_at: new Date().toISOString() });
    if (!res.ok) show((res as { error?: string }).error ?? 'Failed', 'error');
    else { show('Marked as signed', 'success'); setContracts(prev => prev.map(x => x.id === c.id ? (res as { contract: Contract }).contract : x)); setSelected(null); }
    setSaving(false);
  }

  // ── MARKS AND PLACEHOLDERS (sitting 2's mechanics, carried) ────────────────
  function markFor(key: string, over: boolean): 'Yours' | 'Default' | 'Needed' | null {
    if (over) return (overrides[key] ?? '') !== '' ? 'Yours' : null;
    if (savedKeys.has(key)) return 'Yours';
    if (seeds[key] !== undefined && (profile[key] ?? '') !== '') return 'Default';
    if (NEEDED_ROWS.includes(key)) return 'Needed';
    return null;
  }
  function placeholderFor(key: string): string {
    const raw = (annexMap?.placeholders ?? {})[key];
    if (!raw) return 'Not filled';
    return raw.replace('{name}', session?.name || 'your name');
  }
  const feeOf = () => { const s = String(terms.fee_total ?? '').trim(); return s === '' ? null : Number(s); };
  // F-40.256: `formatRs` already carries `Rs` — the one money home — so nothing here prefixes it again.
  const depositRs = () => { const f = feeOf(); const p = Number(depositPct); return f && p ? formatRs(Math.round(f * p / 100)) : ''; };

  // ── THE NEEDED LIST, FILLED WHERE IT IS NAMED (R-40.124 / R-40.125) ─────────
  // One field per blank, with the same meaning line and the same writer as the
  // record: the number to the client, fee/deposit through /fill on blur, a
  // function through the sheet, a policy row through the profile door — ONE row,
  // saved on blur as `{ ...seeds, ...profile, [key]: v }` so her other answers
  // and the seeds ride with it (R-40.114), never the whole sheet on screen.
  async function savePolicyRow(key: string, v: string) {
    const next = { ...seeds, ...profile, [key]: v };
    setProfile(next);
    const r = await saveContractProfile(next);
    if (!('ok' in r) || !r.ok) { show((r as { error?: string }).error ?? 'That could not be saved.', 'error'); return; }
    const f = (r as { fields: ContractProfileFields }).fields || {};
    setProfile(f); setSavedKeys(new Set(Object.keys(f))); setPoliciesSet(Object.keys(f).length > 0);
  }
  function neededField(r: RequiredRow) {
    const need = 'Needed';
    switch (r.key) {
      case 'phone':
        return <Field key={r.key} label="Their WhatsApp number" required={need} why="The agreement is sent here. It’s saved on their client record." value={phone} placeholder="98xxx xxxxx" inputMode="tel" onChange={setPhone} onBlur={() => void savePhone()} />;
      case 'functions':
        return (
          <div key={r.key} style={{ padding: '11px 0', borderBottom: `0.5px solid ${A.hair}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: F.body, fontWeight: 500, fontSize: 14, color: A.ink }}><span>{r.label}</span><span style={TAG}>{need}</span></div>
            <div style={{ fontFamily: F.body, fontSize: 12.5, lineHeight: 1.4, color: A.inkMute }}>Each function is a row on the agreement.</div>
            <button type="button" onClick={() => setFnOpen(true)} style={{ ...GHOST, marginTop: 8 }}>Add a function</button>
          </div>
        );
      case 'fee':
        return <Field key={r.key} label="Your fee" unit="Rs" required={need} why="For everything in the agreement, before GST." value={String(terms.fee_total ?? '')} placeholder="e.g. 45000" inputMode="numeric" onChange={v => setTerms({ ...terms, fee_total: v.replace(/[^0-9]/g, '') })} onBlur={() => void saveText()} />;
      case 'deposit':
        return <Field key={r.key} label="Deposit" unit="% of the fee" required={need} why="Paid on signing. It’s what holds the dates." value={depositPct} placeholder="30" inputMode="numeric" onChange={v => setDepositPct(v.replace(/[^0-9.]/g, ''))} onBlur={() => void saveText()} />;
      default: {
        // a policy row: ONE field from the sheet's own register, written to her policies
        const row = PROFILE_SECTIONS.flatMap(sec => sec.rows).find(x => x.key === r.key);
        if (!row) return null;
        const v = profile[r.key] ?? '';
        const opts = CLOSED_ROWS[r.key];
        if (opts) return <ChoiceRow key={r.key} label={row.label} why={row.why} options={opts} value={v} mark="Needed" onPick={val => void savePolicyRow(r.key, val)} />;
        return <Field key={r.key} label={row.label} unit={row.unit} required={need} why={row.why} value={v} placeholder={placeholderFor(r.key)} inputMode={row.numeric ? 'decimal' : undefined} multiline={row.text}
                      onChange={val => setProfile({ ...profile, [r.key]: val })} onBlur={() => void savePolicyRow(r.key, profile[r.key] ?? '')} />;
      }
    }
  }

  // ═══════════════════════ SCREENS ═══════════════════════════════════════════
  // ⚠ THE SCREENS BELOW ARE CALLED AS FUNCTIONS, NEVER MOUNTED AS `<Room />`. A
  // function declared inside a component is a new component identity on every
  // render; mounting it would remount its subtree on each keystroke and every
  // input would lose focus. `Room()` returns JSX into ONE tree.

  // ── S0 · THE ROOM — the policies card first and persistent (R-40.120 C3) ──
  function Room() {
    return (
      <>
        <Scroll fab>
          <div style={{ margin: '16px 16px 0', padding: '14px 14px 12px', border: `0.5px solid ${A.hair}`, borderRadius: 2, background: 'var(--atelier-card-bg)' }}>
            <div style={{ fontFamily: F.title, fontWeight: 500, fontSize: 17, lineHeight: 1.25, color: A.ink }}>
              {policiesSet ? 'Your contract policies' : 'Set up your contract policies'}
            </div>
            <div style={{ ...HINT, margin: '3px 0 0' }}>
              {policiesSet
                ? 'Your prices, notice periods and what’s never included. They go onto every agreement you send.'
                : 'Once. Then every agreement starts filled in, and you only add the couple, the dates and the fee.'}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
              <button type="button" onClick={() => void openProfile(false)} style={{ background: 'none', border: 0, padding: 0, fontFamily: F.body, fontWeight: 500, fontSize: 13, color: A.accent, cursor: 'pointer' }}>{policiesSet ? 'Edit' : 'Set up'}</button>
              <button type="button" disabled={saving} onClick={() => void doStandard()} style={{ background: 'none', border: 0, padding: 0, fontFamily: F.body, fontWeight: 500, fontSize: 13, color: A.accent, cursor: 'pointer' }}>{policiesSet ? 'See the standard agreement' : 'See the standard agreement first'}</button>
            </div>
          </div>
          {loading ? (
            <div style={{ ...HINT, padding: '40px 16px', textAlign: 'center' }}>Loading…</div>
          ) : contracts.length === 0 ? (
            <div style={{ padding: '80px 32px 0', textAlign: 'center' }}>
              <div style={{ fontFamily: F.title, fontWeight: 500, fontSize: 24, lineHeight: 1.2, color: A.ink }}>No agreements yet.</div>
              <div style={{ ...HINT, marginTop: 6 }}>Start one from a client, or from a name and a number.</div>
            </div>
          ) : (
            <div style={{ marginTop: 18 }}>
              {contracts.map(c => {
                const fns = manualFns((c.terms as Record<string, unknown>) ?? {});
                const fee = (c.terms as Record<string, unknown> | undefined)?.fee_total;
                const st = stage(c);
                const pillColour = st >= 5 ? A.green : st === 3 ? A.metal : st === 7 ? A.red : 'var(--atelier-ink-dim)';
                return (
                  <div key={c.id} onClick={() => (isComposed(c) ? openRecord(c) : setSelected(c))}
                       style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: `0.5px solid ${A.hair}`, cursor: 'pointer' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: 15, lineHeight: 1.25, color: A.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{isComposed(c) ? clientName(c) : c.title}</div>
                      <div style={{ fontFamily: F.body, fontSize: 12.5, lineHeight: 1.3, color: A.inkMute }}>
                        {isComposed(c)
                          ? `${fns[0] ? `${fns[0].title} · ${fns[0].date}` : 'No dates yet'}${fee ? ` · ${formatRs(Number(fee))}` : ''}`
                          : `Uploaded · ${new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                      </div>
                    </div>
                    <span style={{ fontFamily: F.body, fontWeight: 500, fontSize: 11, lineHeight: 1, padding: '5px 8px', borderRadius: 2, border: `0.5px solid ${pillColour}`, color: pillColour, whiteSpace: 'nowrap' }}>
                      {st === 6 ? 'Date held' : stateWord(c.state)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Scroll>
        <Fab label="New contract" onClick={() => setStartOpen(true)} />
      </>
    );
  }

  // ── S1 · YOUR POLICIES / POLICIES FOR THIS COUPLE — one sheet, two homes ─
  function PolicySheet({ over }: { over: boolean }) {
    const src = over ? overrides : profile;
    const under: ContractProfileFields = over ? { ...seeds, ...profile } : {};
    const setter = (k: string, v: string) => (over ? setOverrides({ ...overrides, [k]: v }) : setProfile({ ...profile, [k]: v }));
    const omitted = annexMap?.omitted ?? [];
    return (
      <>
        <Head title={over ? `Policies for ${record ? clientFirstName(record) : 'this couple'}` : 'Your contract policies'}
              sub={over ? undefined : 'Every agreement starts from these'} onBack={() => go(over ? 'record' : record ? 'record' : 'room')} />
        <Scroll>
          <Blk>
            {over
              ? <div style={{ margin: '12px 0 4px', padding: '10px 12px', borderLeft: `2px solid ${A.metal}`, fontFamily: F.body, fontSize: 13, lineHeight: 1.45, color: A.inkSoft, background: 'var(--atelier-row-hover)' }}>These are your policies. Changes here apply to this agreement only.</div>
              : <div style={{ ...HINT, marginTop: 12 }}>Asked once, used on every agreement. Anything you leave empty is left out of the agreement — nothing prints blank.{annexMap?.seeded ? ` Suggested values are starting points for a ${seeds.vendor_category_words || 'business like yours'}; keep them or change them.` : ''}</div>}
            {profileState === 'loading' && <div style={HINT}>Loading…</div>}
            {profileState === 'failed' && <div style={{ ...HINT, color: A.red }}>We couldn’t load your policies.</div>}
            {profileState === 'ready' && PROFILE_SECTIONS.map(sec => {
              const rows = sec.rows.filter(r => !omitted.includes(r.key));
              if (rows.length === 0 && sec.onTheDay && basis === 'on_the_day') {
                return <div key={sec.head}><div style={H3}>{sec.head}</div><div style={HINT}>{sec.onTheDay}</div></div>;
              }
              return (
                <div key={sec.head}>
                  <div style={H3}>{sec.head}</div>
                  {rows.map((row, i) => {
                    const label = sec.head === 'If plans change' && i >= 2 && i <= 5 ? slabLabels({ ...under, ...src })[i - 2] : row.label;
                    const v = src[row.key] ?? '';
                    const opts = CLOSED_ROWS[row.key];
                    if (opts) {
                      return <ChoiceRow key={row.key} label={label} why={row.why} options={opts} mark={markFor(row.key, over)}
                                        value={(v !== '' ? v : under[row.key]) ?? ''} onPick={val => setter(row.key, val)} />;
                    }
                    return (
                      <Field key={row.key} label={label} unit={row.unit} why={row.why} value={v} mark={markFor(row.key, over)}
                             placeholder={under[row.key] || placeholderFor(row.key)}
                             inputMode={row.numeric ? 'decimal' : undefined} multiline={row.text}
                             onChange={val => setter(row.key, val)} />
                    );
                  })}
                  {sec.foot ? <div style={{ ...HINT, marginTop: 8 }}>{sec.foot}</div> : null}
                </div>
              );
            })}
            {profileState === 'ready' && (over
              ? <>
                  <button type="button" disabled={saving} onClick={() => void doSaveOverrides(false)} style={CTA}>Save for this agreement</button>
                  <button type="button" disabled={saving} onClick={() => void doSaveOverrides(true)} style={QUIET}>Use my policies as they are</button>
                </>
              : <button type="button" disabled={saving} onClick={() => void doSaveProfile()} style={CTA}>Save my policies</button>)}
          </Blk>
        </Scroll>
      </>
    );
  }

  // ── S2 · THE FORK, SOMEONE NEW, FROM A CLIENT ────────────────────────────
  function NewPerson() {
    return (
      <>
        <Head title="Someone new" sub="A name and a number is enough" onBack={() => go('room')} />
        <Scroll>
          <Blk>
            <Field label="Their name" why="The bride or groom you’re speaking to. Their partner’s name comes later." value={newName} placeholder="e.g. Priya Sharma" onChange={setNewName} />
            <Field label="WhatsApp number" why="Where the agreement is sent. It goes on their client record too — you type it once." value={newPhone} placeholder="98xxx xxxxx" inputMode="tel" onChange={setNewPhone} />
            <button type="button" disabled={saving} onClick={() => void doNewPerson()} style={CTA}>Start the agreement</button>
            <div style={HINT}>She’s added to your Clients the moment you tap this.</div>
          </Blk>
        </Scroll>
      </>
    );
  }
  function Pick() {
    return (
      <>
        <Head title="From a client" onBack={() => go('room')} />
        <Scroll>
          <Blk>
            {pickState === 'loading' ? <div style={{ ...HINT, marginTop: 12 }}>Loading…</div>
              : pickState === 'failed' ? <div style={{ ...HINT, marginTop: 12, color: A.red }}>We couldn’t load your clients.</div>
              : clients.length === 0 ? <div style={{ ...HINT, marginTop: 12 }}>No one to choose from yet.</div>
              : clients.map(c => (
                <button key={c.key} type="button" disabled={saving} onClick={() => void doCompose(c)} style={TAP}>
                  <span>{c.name}<span style={SUB}>{c.phone || 'No number yet'}</span></span>
                  <span style={RIGHT}>{c.from === 'client' ? 'Client' : 'Cabinet'}</span>
                </button>
              ))}
            <div style={{ ...HINT, marginTop: 12 }}>People you’ve booked or confirmed in your Cabinet show here too. Picking one adds her to your clients.</div>
            <button type="button" onClick={() => go('newPerson')} style={GHOST}>Someone not on this list</button>
          </Blk>
        </Scroll>
      </>
    );
  }

  // ── S3 · THE AGREEMENT ────────────────────────────────────────────────────
  function Record() {
    const c = record!;
    const p = effective();
    const fns = manualFns(terms);
    const hasOv = Object.keys(overrides).some(k => (overrides[k] ?? '') !== '');
    const policyBlanks = requiredRows(c, terms, depositPct, savedPhone, p, basis).filter(r => r.value === null && r.where === 'policies');
    const policyGap = policyBlanks.length ? `Still needed to send: ${policyBlanks.map(r => r.label.replace(' (in your policies)', '')).join(', ')}.` : '';
    const offered = annexMap?.offered ?? [];
    const first = clientFirstName(c);
    return (
      <>
        <Head title={clientName(c)} sub={stateWord(c.state)} onBack={() => go('room')} />
        <Scroll>
          <Thread c={c} policiesSet={policiesSet} />
          <Blk>
            <div style={H3}>The couple</div>
            <Field label="Name" value={clientName(c)} readOnly />
            <Field label="WhatsApp number" required={savedPhone ? undefined : 'Needed to send'}
                   why="The agreement is sent here. It’s saved on their client record." value={phone} placeholder="98xxx xxxxx" inputMode="tel"
                   onChange={setPhone} onBlur={() => void savePhone()} />
            <Field label="Partner’s name" why="Both names go on the agreement; either can sign." value={String(terms.partner_2_name ?? '')} placeholder="Not filled"
                   onChange={v => setTerms({ ...terms, partner_2_name: v })} onBlur={() => void saveText()} />
            {promoted && <div style={{ ...HINT, color: A.green }}>Added to your clients.</div>}

            <div style={H3}>Functions and dates</div>
            <div style={HINT}>Each function is a row on the agreement. A function outside {vendorCity || 'your city'} brings your travel and stay terms in.</div>
            {fns.map((f, i) => (
              <div key={`${f.title}-${i}`} style={{ padding: '10px 0', borderBottom: `0.5px solid ${A.hair}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <div>
                  <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: 14, color: A.ink }}>{f.title}</div>
                  <div style={{ fontFamily: F.body, fontSize: 12.5, color: A.inkMute }}>{f.date}{f.time ? ` · ${f.time}` : ''}{f.venue ? ` · ${f.venue}` : ''}{f.city ? `, ${f.city}` : ''}</div>
                </div>
                <button type="button" onClick={() => void removeFn(i)} aria-label="Remove" style={{ background: 'none', border: 0, color: A.inkFade, fontSize: 18, cursor: 'pointer' }}>{'×'}</button>
              </div>
            ))}
            {fns.length === 0 && fnPlaces(terms).length === 0 && <div style={{ ...HINT, color: A.caution }}>No functions yet — at least one is needed to send.</div>}
            <button type="button" onClick={() => setFnOpen(true)} style={GHOST}>Add a function</button>

            <div style={H3}>Fee and deposit</div>
            <Field label="Your fee" unit="Rs" required={String(terms.fee_total ?? '').trim() ? undefined : 'Needed to send'} why="For everything in the agreement, before GST."
                   value={String(terms.fee_total ?? '')} placeholder="e.g. 45000" inputMode="numeric"
                   onChange={v => setTerms({ ...terms, fee_total: v.replace(/[^0-9]/g, '') })} onBlur={() => void saveText()} />
            <Field label="Deposit" unit="% of the fee" why={`Paid on signing. It’s what holds the dates${depositRs() ? ` — ${depositRs()} here` : ''}.`}
                   value={depositPct} placeholder="30" inputMode="numeric"
                   onChange={v => setDepositPct(v.replace(/[^0-9.]/g, ''))} onBlur={() => void saveText()} />

            <div style={H3}>What’s included</div>
            <div style={HINT}>Each service you attach gets its own page, with hours, team and what you hand over. Anything not attached is not included.</div>
            {annexState === 'loading' && <div style={HINT}>Loading…</div>}
            {annexState === 'failed' && <div style={{ ...HINT, color: A.red }}>We couldn’t load your services.</div>}
            {annexState === 'ready' && annexMap && (annexMap.mapped ? (
              <>
                {offered.map((a: AnnexOption) => (
                  <button key={a.key} type="button" disabled={saving} onClick={() => void toggleAnnex(a.key)} style={TAP}>
                    <span>{a.label}<span style={SUB}>Your trade — attached unless you say otherwise</span></span>
                    <span style={{ ...RIGHT, color: annexes[a.key] ? A.green : A.inkMute }}>{annexes[a.key] ? 'Attached' : 'Not attached'}</span>
                  </button>
                ))}
                <button type="button" onClick={() => setMoreOpen(true)} style={TAP}>
                  <span>Add another service<span style={SUB}>Photography, décor, planning, mehendi, venue, or something else</span></span>
                  <span style={{ color: A.inkFade, fontSize: 18 }}>{'›'}</span>
                </button>
              </>
            ) : (
              /* ⚠ VETO — a byte not on the prototype: the unmapped trade (2 of 29 vendors). */
              <>
                <div style={HINT}>We don’t have your trade on file yet, so nothing is attached. Pick what you provide.</div>
                {annexMap.offered.map((a: AnnexOption) => (
                  <button key={a.key} type="button" disabled={saving} onClick={() => void toggleAnnex(a.key)} style={TAP}>
                    <span>{a.label}</span>
                    <span style={{ ...RIGHT, color: annexes[a.key] ? A.green : A.inkMute }}>{annexes[a.key] ? 'Attached' : 'Not attached'}</span>
                  </button>
                ))}
              </>
            ))}

            {/* R-40.126: one prominent tap, no guessing the path. A card, not a row — and when a
                policy is still Needed it says so here, on the record, before Preview finds it. */}
            <div style={{ margin: '22px 0 0', padding: '14px 14px 12px', border: `0.5px solid ${policyGap ? A.caution : A.metal}`, borderRadius: 2, background: 'var(--atelier-card-bg)' }}>
              <div style={{ fontFamily: F.title, fontWeight: 500, fontSize: 17, lineHeight: 1.25, color: A.ink }}>Your policies for {first}</div>
              <div style={{ ...HINT, margin: '3px 0 0' }}>
                {hasOv ? 'Some policies are changed for this agreement only. Your saved policies are untouched.' : 'These are your policies. Change any of them here and it applies to this agreement only.'}
              </div>
              {policyGap ? <div style={{ ...HINT, color: A.caution, margin: '6px 0 0' }}>{policyGap}</div> : null}
              <button type="button" onClick={() => void openProfile(true)} style={{ ...CTA, marginTop: 10 }}>
                {policiesSet ? `See or change them for ${first}` : 'Suggested values are being used — set yours'}
              </button>
            </div>

            <div style={H3}>What’s printed</div>
            <div style={HINT}>These clauses are yours to leave out for this couple. Everything else always prints.</div>
            {CLAUSE_SWITCHES.map(sw => {
              if (sw.key === 'accommodation' && !outstationGate(terms, vendorCity)) return null;
              if (sw.key === 'tax_block' && !(p.gst_pct && p.gst_treatment)) return null;
              const meta =
                sw.key === 'extra_hours' ? (p.overtime_rate && p.overtime_unit ? `Rs ${p.overtime_rate} an ${p.overtime_unit}` : 'Set your rate in policies')
                : sw.key === 'late_payment' ? (p.late_interest_pct && p.late_grace_days ? `${p.late_interest_pct}% a month after ${p.late_grace_days} days` : 'Set it in policies')
                : sw.key === 'tax_block' ? `${p.gst_pct}% · ${p.gst_treatment === 'inclusive' ? 'included' : 'added on top'}`
                : sw.key === 'named_professional' ? (p.named_professional ? `${p.named_professional} attends; a substitute only if ill` : 'Set Who attends in your policies — nothing prints until you do')
                : sw.key === 'portfolio_use' ? 'They can say no now or later'
                : `On — a function is outside ${vendorCity}. ${p.travel_and_stay_terms || ''}`;
              const on = switchOn(terms, sw.key);
              return (
                <button key={sw.key} type="button" disabled={saving} onClick={() => void toggleClause(sw.key)} style={TAP}>
                  <span>{sw.label}<span style={SUB}>{meta}</span></span>
                  <span style={{ ...RIGHT, color: on ? A.green : A.inkMute }}>{on ? 'Printed' : 'Left out'}</span>
                </button>
              );
            })}
            {!(p.gst_pct && p.gst_treatment) && <div style={HINT}>Tax clause: left out — add your GST rate in your policies and your GSTIN in Settings.</div>}
            {/* ⚠ VETO — a byte not on the prototype. Clause 10 has no switch anywhere in the estate; the line stands where one would be looked for. */}
            <div style={HINT}>The wedding page isn’t a switch here — that one is {first}’s, in her own account.</div>

            <button type="button" style={{ ...GHOST, marginTop: 22 }} onClick={() => go('send')}>Preview and send</button>
            <div style={{ ...HINT, textAlign: 'center' }}>Everything here saves as you type.</div>
          </Blk>
        </Scroll>
      </>
    );
  }

  // ── S5 · PREVIEW AND SEND ─────────────────────────────────────────────────
  function Send() {
    const c = record!;
    const p = effective();
    const missing = requiredRows(c, terms, depositPct, savedPhone, p, basis).filter(r => r.value === null);
    const fns = manualFns(terms);
    const first = clientFirstName(c);
    const feeS = String(terms.fee_total ?? '').trim();
    return (
      <>
        <Head title="Preview and send" sub={clientName(c)} onBack={() => go('record')} />
        <Scroll>
          <Blk>
            <div style={H3}>What {first} will receive</div>
            <Field label="Between" value={`${session?.name || 'You'} and ${clientName(c)}${terms.partner_2_name ? ` and ${String(terms.partner_2_name)}` : ''}`} readOnly />
            <Field label="Functions" value={fns.length ? fns.map(f => `${f.title} · ${f.date}`).join(', ') : (fnPlaces(terms).length ? `${fnPlaces(terms).length} from the calendar` : '')} placeholder="None yet" readOnly />
            <Field label="Fee" value={feeS ? `${formatRs(Number(feeS))}${depositRs() ? `, deposit ${depositRs()} on signing` : ''}` : ''} placeholder="Not filled" readOnly />
            <Field label="Included" value={(annexMap?.offered ?? []).concat(annexMap?.others ?? []).filter(a => annexes[a.key]).map(a => a.label).join(', ')} placeholder="Nothing attached" readOnly />
            <Field label="Signed for you by" value={p.vendor_signatory_name || ''} placeholder="Not set — in your policies" readOnly />
            <button type="button" disabled={saving} onClick={() => void doPreview(c)} style={GHOST}>Read the PDF</button>
            {missing.length ? (
              <>
                <div style={H3}>Before you can send</div>
                {/* R-40.124: each blank is filled HERE, where it is named — never a tap that leaves the screen.
                    R-40.125: a policy blank is one field, never the 28-row sheet. The same writers as the record. */}
                {missing.map(r => neededField(r))}
                <div style={{ ...HINT, marginTop: 10 }}>Fill these and the send button appears here.</div>
              </>
            ) : (
              <>
                <div style={H3}>Send</div>
                <div style={HINT}>{first} gets a WhatsApp message with a link. She reads the whole agreement, taps <i>I agree</i>, and confirms with a code sent to the same number. You’ll see it here the moment she does.</div>
                <button type="button" disabled={saving} onClick={() => void doSendToCouple(c)} style={CTA}>Send to {first} on WhatsApp</button>
                <div style={{ ...HINT, textAlign: 'center' }}>Until sending opens at Meta, this copies the link for you to paste.</div>
              </>
            )}
          </Blk>
        </Scroll>
      </>
    );
  }

  // ── S6 · AFTER SENDING — sent · signed · deposit · the date is held (F-40.245) ─
  function After() {
    const c = record!;
    const st = stage(c);
    const first = clientFirstName(c);
    const dep = c.deposit_pct && (c.terms as Record<string, unknown> | undefined)?.fee_total
      ? formatRs(Math.round(Number((c.terms as Record<string, unknown>).fee_total) * c.deposit_pct / 100)) : 'The deposit';
    return (
      <>
        <Head title={clientName(c)} sub={st === 6 ? 'Date held' : stateWord(c.state)} onBack={() => go('room')} />
        <Scroll>
          <Thread c={c} policiesSet={policiesSet} />
          <Blk>
            {st === 3 && <><div style={H3}>Waiting for {first}</div><div style={HINT}>She has the link on WhatsApp. When she agrees, this changes on its own. You can still read the PDF; you can’t change it now — cancel and start again if something’s wrong.</div></>}
            {st === 5 && <>
              <div style={H3}>{first} signed</div>
              <div style={HINT}>The agreement is sealed with her code. {dep} is now due to you — she pays you directly, by UPI or bank, as printed on the agreement. Nothing comes through TDW.</div>
              <button type="button" disabled={saving} onClick={() => void doDeposit(c)} style={CTA}>Mark the deposit received</button>
            </>}
            {st === 6 && <><div style={H3}>The date is held</div><div style={HINT}>Deposit received{c.deposit_received_at ? ` on ${new Date(c.deposit_received_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : ''}. Her dates are yours on the calendar. Both of you can download the signed copy any time.</div></>}
            {st === 7 && <><div style={H3}>Cancelled</div><div style={HINT}>Nothing was taken. Start a new one whenever you’re ready.</div></>}
            <button type="button" disabled={saving} onClick={() => void doPreview(c)} style={GHOST}>Read the PDF</button>
            {st < 7 && <button type="button" disabled={saving} onClick={() => void doCancel(c)} style={QUIET}>Cancel this agreement</button>}
          </Blk>
        </Scroll>
      </>
    );
  }

  const canUpload = title.trim().length > 0 && file !== null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', minHeight: 0 }}>
      <Toast toast={toast} />
      {view === 'room' && Room()}
      {view === 'policies' && PolicySheet({ over: false })}
      {view === 'overrides' && record && PolicySheet({ over: true })}
      {view === 'newPerson' && NewPerson()}
      {view === 'pick' && Pick()}
      {view === 'record' && record && Record()}
      {view === 'send' && record && Send()}
      {view === 'after' && record && After()}

      {/* ══ THE FORK — from a client, someone new, or a PDF of her own ══ */}
      {startOpen && (
        <div style={SCRIM} onClick={() => setStartOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={SHEET}>
            <div style={GRAB} />
            <div style={{ fontFamily: F.title, fontWeight: 500, fontSize: 22, lineHeight: 1.15, color: A.ink, marginBottom: 4 }}>Start an agreement</div>
            <button type="button" onClick={() => void openPicker()} style={TAP}><span>From a client<span style={SUB}>Someone already in your Clients or booked in your Cabinet</span></span><span style={{ color: A.inkFade, fontSize: 18 }}>{'›'}</span></button>
            <button type="button" onClick={() => go('newPerson')} style={TAP}><span>Someone new<span style={SUB}>A name and a WhatsApp number. She becomes a client as you go.</span></span><span style={{ color: A.inkFade, fontSize: 18 }}>{'›'}</span></button>
            <button type="button" onClick={() => { setStartOpen(false); setUploadOpen(true); setTitle(''); setFile(null); }} style={TAP}><span>Upload my own PDF<span style={SUB}>If you already have a signed or preferred contract</span></span><span style={{ color: A.inkFade, fontSize: 18 }}>{'›'}</span></button>
            <div style={{ ...HINT, marginTop: 12 }}>The standard agreement is the wedding-services contract every TDW vendor sends. <button type="button" onClick={() => { setStartOpen(false); void doStandard(); }} style={{ background: 'none', border: 0, padding: 0, font: 'inherit', color: A.accent, cursor: 'pointer' }}>Read it</button> before you fill anything.</div>
          </div>
        </div>
      )}

      {/* ══ ADD A FUNCTION — the manual arm's writer (R-40.118) ══ */}
      {fnOpen && record && (
        <div style={SCRIM} onClick={() => setFnOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={SHEET}>
            <div style={GRAB} />
            <div style={{ fontFamily: F.title, fontWeight: 500, fontSize: 22, lineHeight: 1.15, color: A.ink, marginBottom: 4 }}>Add a function</div>
            <Field label="Function" value={fnDraft.title} placeholder="e.g. Sangeet, Wedding, Reception" onChange={v => setFnDraft({ ...fnDraft, title: v })} />
            <div style={{ padding: '11px 0', borderBottom: `0.5px solid ${A.hair}` }}>
              <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: 14, color: A.ink }}>Date</div>
              <input type="date" value={fnDraft.date} onChange={e => setFnDraft({ ...fnDraft, date: e.target.value })} style={INPUT} />
            </div>
            <div style={{ padding: '11px 0', borderBottom: `0.5px solid ${A.hair}` }}>
              <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: 14, color: A.ink }}>Start time</div>
              <div style={{ fontFamily: F.body, fontSize: 12.5, color: A.inkMute }}>When you need to be there.</div>
              <input type="time" value={fnDraft.time || ''} onChange={e => setFnDraft({ ...fnDraft, time: e.target.value })} style={INPUT} />
            </div>
            <Field label="Venue" value={fnDraft.venue || ''} placeholder="e.g. The Leela, Gurugram" onChange={v => setFnDraft({ ...fnDraft, venue: v })} />
            <Field label="City" why={`If it isn’t ${vendorCity || 'your city'}, your travel and stay terms print.`} value={fnDraft.city || ''} placeholder={vendorCity || ''} onChange={v => setFnDraft({ ...fnDraft, city: v })} />
            <button type="button" disabled={saving} onClick={() => void addFn()} style={CTA}>Add</button>
          </div>
        </div>
      )}

      {/* ══ ADD ANOTHER SERVICE — the other six annexes ══ */}
      {moreOpen && record && annexMap && (
        <div style={SCRIM} onClick={() => setMoreOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={SHEET}>
            <div style={GRAB} />
            <div style={{ fontFamily: F.title, fontWeight: 500, fontSize: 22, lineHeight: 1.15, color: A.ink, marginBottom: 4 }}>Add another service</div>
            <div style={HINT}>Only if you’re providing it. Each one adds a page to the agreement.</div>
            {annexMap.others.map((a: AnnexOption) => (
              <button key={a.key} type="button" disabled={saving} onClick={() => void toggleAnnex(a.key)} style={TAP}>
                <span>{a.label}</span>
                <span style={{ ...RIGHT, color: annexes[a.key] ? A.green : A.inkMute }}>{annexes[a.key] ? 'Attached' : 'Not attached'}</span>
              </button>
            ))}
            <button type="button" onClick={() => setMoreOpen(false)} style={QUIET}>Done</button>
          </div>
        </div>
      )}

      {/* ══ UPLOAD — clause 16's paper path, unchanged in mechanism ══ */}
      {uploadOpen && (
        <div style={SCRIM} onClick={() => !uploading && setUploadOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={SHEET}>
            <div style={GRAB} />
            <div style={{ fontFamily: F.title, fontWeight: 500, fontSize: 22, lineHeight: 1.15, color: A.ink, marginBottom: 4 }}>Upload my own PDF</div>
            <Field label="Title" value={title} placeholder="e.g. Booking contract — Priya Sharma" onChange={setTitle} />
            <div style={{ padding: '11px 0' }}>
              <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: 14, color: A.ink }}>The PDF</div>
              <input ref={fileRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={e => setFile(e.target.files?.[0] || null)} />
              <button type="button" onClick={() => fileRef.current?.click()} style={{ ...INPUT, textAlign: 'left', cursor: 'pointer', color: file ? A.ink : A.inkMute }}>{file ? file.name : 'Choose a PDF…'}</button>
            </div>
            {uploading && <div style={HINT}>{uploadProgress}</div>}
            <button type="button" onClick={() => void doUpload()} disabled={!canUpload || uploading} style={CTA}>{uploading ? uploadProgress || 'Uploading…' : 'Upload'}</button>
          </div>
        </div>
      )}

      {/* ══ AN UPLOADED CONTRACT'S SHEET — download, mark sent, mark signed, cancel ══ */}
      {selected && (
        <div style={SCRIM} onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} style={SHEET}>
            <div style={GRAB} />
            <div style={{ fontFamily: F.title, fontWeight: 500, fontSize: 22, lineHeight: 1.15, color: A.ink, marginBottom: 4 }}>{selected.title}</div>
            <div style={HINT}>{stateWord(selected.state)}{selected.file_size ? ` · ${Math.round(selected.file_size / 1024)} KB` : ''}{selected.sent_at ? ` · sent ${new Date(selected.sent_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : ''}{selected.signed_at ? ` · signed ${new Date(selected.signed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : ''}</div>
            <button type="button" onClick={() => void doDownload(selected)} className="atelier-fab" style={{ ...CTA, color: INK_DEEP }}>Download</button>
            {selected.state === 'draft' && <button type="button" disabled={saving} onClick={() => void doMarkSent(selected)} style={GHOST}>Mark as sent</button>}
            {selected.state === 'sent' && !isComposed(selected) && <button type="button" disabled={saving} onClick={() => void doMarkSigned(selected)} style={GHOST}>Mark as signed</button>}
            {selected.state === 'sent' && isComposed(selected) && <div style={{ ...HINT, color: A.red }}>This one was filled here and is signed by the couple. Mark signed is for a contract you uploaded.</div>}
            {selected.state !== 'cancelled' && <button type="button" disabled={saving} onClick={() => void doCancel(selected)} style={QUIET}>Cancel</button>}
          </div>
        </div>
      )}
    </div>
  );
}
