// R-37.84 (3): Cormorant italic dies in room prose. ZIP 7 moved the `script` ROLE to the
// body family; what survived was `fontStyle: italic` set beside it — italic sans, which
// still reads as the old voice. The mock’s screen four killed the pairing, not just the
// family. Italic survives only where a surface sets it WITHOUT the script role.
'use client';
// components/vendor/slices/SliceRow.tsx — TDW_03 P1
// Row grammar + the shared atelier tokens/helpers for the five slices.
// EVERYTHING here is extracted VERBATIM from app/vendor/list/[slice]/page.tsx
// (the 774-line monofile) — commit 1 of the P1 split. No behavior change.
// P4 adds swipe/bulk affordances; P3 adds draft chips. Not here.

import type { ListSlice, DoorSlice } from '@/hooks/vendor/useLastSlice';
// R-G51.16 — the chip's byte comes from the copy home, never spelled here.
import { RF } from '@/v2/lib/worklist/referrals';
import { WP } from '@/lib/worklist/weddingPages';
import { istDayKey } from '@/lib/frost/tokens'; // R-35.23's IST home — one semantic, one home
import { formatRs } from '@/lib/vendor/format'; // TDW_09 R-U25: the one money home
import { CREW_WORDS } from '@/v2/lib/worklist/crew';

export const A = {
  // R-37.74 arm (iii): the interactive half of the old `brass`. Buttons, chips, carets
  // and active states read this; the wordmark, section headers and hairlines keep `brass`.
  interactive:     'var(--atelier-accent-text)',
  interactiveWarm: 'var(--atelier-accent-text)',
  ink:       'var(--atelier-ink)',
  inkSoft:   'var(--atelier-ink-soft)',
  inkMute:   'var(--atelier-ink-mute)',
  inkDim:    'var(--atelier-ink-dim)',
  brass:     'var(--atelier-accent-text)',
  brassWarm: 'var(--atelier-label)',
  brassLine: 'var(--atelier-card-border)',
  green:     'var(--role-positive)',
  red:       'var(--role-critical)',
} as const;
// ── CE-45 · FE-2 · TYPE_1 · THE FAMILY TAKES THE APP'S OWN TYPE ─────────────────
// `F` named four faces (Italiana, Jost, DM Sans twice) and every call site set its own size,
// weight, line-height and tracking beside it: the old dress FE-1's audit measured (e-108 for
// what that audit could not see). It is retired, not aliased, so the compiler found every caller.
// `T` names the six rungs of lib/worklist/theme.ts and nothing else. Each is the `font`
// SHORTHAND (theme.ts typeCss), so a site that takes one cannot also set a size, a face or a
// weight of its own; the family's sheets mount inside `.wl` (SheetLayer.tsx mountNode), where
// the shell emits the rung variables. t0 is Today's numeral and is not offered here.
export const T = {
  t1: 'var(--wl-t1)',
  t2: 'var(--wl-t2)',
  t3: 'var(--wl-t3)',
  // DESIGN-1: the row's name (16/500) and the button (15/600), the two rungs the review's scale adds.
  tn: 'var(--wl-tn)',
  tb: 'var(--wl-tb)',
  t4: 'var(--wl-t4)',
  t5: 'var(--wl-t5)',
} as const;

export const LABELS: Record<DoorSlice, string> = { clients: 'Clients', leads: 'Enquiries', invoices: 'Invoices', events: 'Events', expenses: 'Expenses', notes: 'Notes' };
export const GLYPHS: Record<ListSlice, string> = { clients: 'C', leads: 'L', invoices: 'I', events: '◐', expenses: '×' };

// State pill color per state — used as colored border + colored text
export function stateColor(slice: ListSlice, state: string | undefined): string {
  if (!state) return A.inkMute;
  const s = state.toLowerCase();
  if (slice === 'leads') {
    if (s === 'new') return A.brassWarm;
    if (s === 'contacted' || s === 'quoted') return A.brass;
    if (s === 'booked') return A.green;
    if (s === 'lost') return A.red;
  }
  if (slice === 'invoices') {
    if (s === 'paid') return A.green;
    if (s === 'advance_paid') return A.brass;
    if (s === 'unpaid') return A.brassWarm;
    if (s === 'overdue') return A.red;
    if (s === 'cancelled') return A.inkMute;
  }
  if (slice === 'events') {
    if (s === 'cancelled') return A.red;
    if (s === 'completed') return A.green;
    return A.brassWarm;
  }
  return A.brassWarm;
}

export interface Row {
  id: string; primary: string; secondary?: string; meta?: string;
  badge?: string; badgeAlert?: boolean; phone?: string; client_phone?: string;
  aiPrimer: string; deletePrimer: string;
  /** ── R-G51.13 / F-40.119 · `verbatim` — THE ROW DECLARES ITS VALUE IS A
   *  SENTENCE, AND `cap()` SKIPS IT.
   *
   *  `cap()` title-cases every detail value, and that is RIGHT for the values
   *  this array has always carried: `new` -> `New`, `peer_referral` ->
   *  `Peer Referral`. It is WRONG the moment a value is a person's own words.
   *  G5.1's referral note shipped reading "Booked That Weekend, She's Asking
   *  About Feb." — the vendor's sentence, dressed as a headline.
   *
   *  ⚠ THE OPT-OUT LIVES ON THE ROW, NOT IN THE HELPER. Widening `cap()` to
   *  guess at sentences (length? punctuation? spaces?) would change every slice
   *  in the estate on a heuristic, and the first value it guessed wrong about
   *  would be someone's name. The ROW knows what it holds; the helper cannot.
   *  Default false, so every existing row is untouched by construction.
   *
   *  Found by the founder's walk and by nothing else: every cell asserted the
   *  note reached the wire, none asserted what the glass did to it after. */
  detail: { label: string; value: string; verbatim?: boolean }[];
  /** R1(b) cross-plane chip (CE-ruled): display-only whisper — "the other
      plane also knows this person". Reads, never writes. Absence means "no
      phone match", never "no twin". */
  crossChip?: string;
  /** TDW_04 A3 (L-3): where the chip jumps — the twin's canonical slice. */
  crossChipHref?: string;
  /** TDW_04 A3 (L-3): the binder this row names (events carry it on the wire). */
  twinBinderId?: string;
  /** DESIGN-1 · STAGE 2: the crew on this function, in words (lib/worklist/crew.ts crewWords); null when nobody
      is on it, which the row draws as "No crew yet" in the critical ink. Absent on every other slice. */
  crew?: { words: string | null };
  /** TDW_04 A1: the lead's wishbone wire (missing cells) — the detail sheet
      renders tappable chips into the WishboneSheet when present. */
  draftMissing?: string[];
  /** TDW_04 A2: invoices stash — the outstanding amount the mark-paid swipe pays. */
  payAmount?: number;
  /** CE-43 LC-2 packet 3 · F-43.86 (a1): this invoice is a booking's (lead_package_id set).
   *  F16 hides Remove schedule on it; F17's mark-paid speaks D3/D4 for it. */
  isPackage?: boolean;
  /** TDW_04 A3 masthead stashes — the RAW figures behind the row, filled by the
      slice module that fetched them. The shell derives mastheads from these,
      never by parsing the formatted strings above (a masthead that reads its own
      display text is a masthead that lies the moment formatting changes). */
  /** M-LEADS-TRUTH: the lead arrived through The Dream Wedding. Renders the TDW
      mark beside the state pill. Display-only — F-04.7's fence holds, no editor
      grows on this row. */
  tdw?: boolean;
  /** BLOCK 19 G5.1 (R-G51.5): this lead has already been forwarded to a peer, or
      IS the peer's copy of someone else's forward. Either way the control is not
      offered again — a lead is the landing place of at most one forward, and a
      button that cannot succeed is the lying-control class filed twice here.
      The fact rides the ROW rather than being re-derived in the shell from a
      Lead the shell does not hold. */
  forwarded?: boolean;
  /** R-G51.16: this lead is the PEER'S COPY of someone else's forward — it
      arrived from a peer. Distinct from `forwarded`, which is true on BOTH sides
      and gates the control; this one gates the chip, and only the receiving side
      wears it. Two facts, two fields: collapsing them would put a chip on the
      sender's row that read as though the work had come TO her. */
  referralIn?: boolean;
  /** BLOCK 19 G1.3 (F-40.211, R-40.103): this lead was born on a WEDDING PAGE —
      `wedding_guest` (the gallery download) or `wedding_team` (Book the same
      team). ONE FLAG FOR BOTH: from the list's five-foot view they are one
      provenance, and the detail row already says which. */
  weddingLead?: boolean;
  /** M-LEADGATE-RECUT (R-37.23): the wire's POSITIVE statement that this row's
      mode-to-connect was withheld for tier. Read from the payload, never
      inferred from an absent phone — page-trusts-the-wire, and an inference
      from absence cannot tell "withheld" from "she never gave one". */
  redacted?: boolean;
  /** F-16.25 (R-37.21): the band's FLOOR in whole rupees. A floor with a NULL
      ceiling is the open top band; both null is silence. */
  budgetMin?: number | null;
  pipelineValue?: number;   // leads: budget_max · expenses: amount
  sortDate?: string | null; // events: event_date · expenses: expense_date (ISO)
}

// M-LEADS-TRUTH · the ARRIVAL date. Founder copy, approved 2026-08-22, frozen at
// the character: day + short month, en-IN, no year — '21 Aug'.
// DELIBERATELY NOT fmtDate BELOW, which renders '21 Aug 2026'. The year is what
// makes a WEDDING date read like a wedding date, and a lead row already carries
// one of those on the same line. Dropping it is how the eye tells the two apart.
//
// ── AMENDED AT R2 (arm 2 ruled) · IT WAS WRONG TWICE, AND ONLY ONE WAS FILED ──
// The byte that stood here was `d.toLocaleDateString('en-IN', {…})`.
//
//   1. LOCALE. Its two siblings below — fmtDate and fmtLeadDate — never construct
//      a Date and never call a locale API; they regex the ISO and index a month
//      array. A locale call's output depends on the runtime's ICU data, which
//      can differ between server render and client hydration. This is the
//      defect class NOTE 35 names.
//   2. TIMEZONE — THE ONE THAT ACTUALLY MOVES A RENDERED DATE, and it was not
//      filed. `created_at` and `engagements.updated_at` are timestamptz;
//      `new Date(iso).toLocaleDateString()` renders in the BROWSER'S zone.
//      Sarah's enquiry is 2026-08-21T18:12:47+00:00 = 23:42 IST, SAME DAY — so
//      the walk that sealed M-LEADS-TRUTH could not have caught this. Every
//      enquiry after 18:30 UTC rendered one day late to an Indian vendor.
//
// ARM 1 WAS REFUSED BY NAME: slicing the raw ISO would match the siblings'
// letter and render the UTC calendar day, which is a DIFFERENT wrongness for an
// IST audience — consistency bought with a new bug.
//
// SO THIS READS THROUGH THE ESTATE'S ONE IST HOME. `istDayKey` is R-35.23's
// cure for F-15.17 (lib/frost/tokens.ts): it takes the IST calendar day of an
// instant as a 'YYYY-MM-DD' key, and its header names the three
// "simplifications" that put the bug straight back. This surface does not get a
// second IST semantic; it arrives at the one that exists. L1's new row reads
// through THIS function for the same reason — `tdw_enquired_at` must not be born
// with a third date path.
//
// FIRST CROSSING, STATED: no vendor surface has imported from lib/frost/tokens
// before. It is a leaf module with zero imports of its own and no server-only
// marker, so the named export tree-shakes and the vendor bundle takes the
// function, not the token tables.
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export function fmtArrival(iso: string | null | undefined) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const key = istDayKey(d);              // 'YYYY-MM-DD' in IST — the one home
  if (!key) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!m) return '';
  return `${parseInt(m[3])} ${MONTHS_SHORT[parseInt(m[2]) - 1]}`;
}
// NOTE, queued not taken: fmtDate and fmtLeadDate below each hold their OWN
// inline copy of this month array. Three copies is a tidy this sitting has no
// ruling for, and their bytes are not in R2's charge. Filed, visible, untouched.

// TDW_09 R-U25: the name stays for its importers; the string comes from the one home.
export function fmtRs(n: number | null | undefined) { return n == null ? 'Not set' : formatRs(n); }
export function fmtDate(iso: string | null | undefined) {
  if (!iso) return '—';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  return `${parseInt(m[3])} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(m[2])-1]} ${m[1]}`;
}
export function fmtLeadDate(iso: string | null | undefined, precision?: 'day' | 'month' | 'year' | null) {
  if (!iso) return '—';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const monthAbbr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(m[2])-1];
  if (precision === 'year') return m[1];
  if (precision === 'month') return `${monthAbbr} ${m[1]}`;
  return `${parseInt(m[3])} ${monthAbbr} ${m[1]}`;
}

// Title-case a value from the API — "new" → "New", "unpaid" → "Unpaid",
// "Delhi NCR" stays "Delhi NCR" (already correct), "—" stays "—".
export function cap(s: string | null | undefined): string {
  if (!s || s === '—') return s ?? '—';
  // DESIGN-1 · W4: a hyphen is kept, so an invoice number reads "TDW-0003" here as it does on
  // Today (it was split to "TDW 0003": one number, two spellings).
  return s.split(/[\s_]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// WhatsApp icon — defined outside JSX to avoid path string parsing issues
export const WaIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M7.5 0C3.358 0 0 3.358 0 7.5c0 1.32.344 2.56.946 3.634L0 15l3.99-1.046A7.46 7.46 0 007.5 15C11.642 15 15 11.642 15 7.5S11.642 0 7.5 0zm0 13.75a6.21 6.21 0 01-3.17-.868l-.228-.135-2.357.557.584-2.296-.148-.235A6.21 6.21 0 011.25 7.5C1.25 4.048 4.048 1.25 7.5 1.25S13.75 4.048 13.75 7.5 10.952 13.75 7.5 13.75zM10.9 9.1c-.186-.093-1.1-.543-1.27-.604-.17-.062-.294-.093-.418.093-.124.186-.48.604-.588.728-.108.124-.217.14-.403.047-.186-.094-.786-.29-1.497-.924-.553-.494-.926-1.104-1.035-1.29-.108-.186-.011-.287.082-.38.084-.083.186-.217.279-.325.093-.108.124-.186.186-.31.062-.124.031-.233-.015-.326-.047-.093-.418-1.01-.573-1.382-.151-.364-.304-.315-.418-.321-.108-.006-.232-.007-.356-.007-.124 0-.326.047-.497.233-.17.186-.651.636-.651 1.551 0 .916.667 1.8.76 1.924.093.124 1.312 2.003 3.179 2.81.444.192.79.306.06.391.446.141.852.122.874.055.268-.053 1.1-.45.255-.886.155-.324.155-.81.108-.885.047-.062-.17-.124-.357-.217z"/>
  </svg>
);

// ── Row · Atelier ────────────────────────────────────────────────
// CRITICAL: state pill always renders the SAME WAY regardless of whether
// city/date/phone fields are populated. Geometry is fixed: monogram glyph
// + name + italic Cormorant detail line + state pill on the right. When
// detail values are missing we render an em-dash placeholder so the
// pill never floats in empty space — same chrome anchors every row.
export function SliceRow({ row, slice, onSelect }: { row: Row; slice: ListSlice; onSelect: () => void }) {
  const A = {
    ink: 'var(--atelier-ink)', inkSoft: 'var(--atelier-ink-soft)', inkMute: 'var(--atelier-ink-mute)',
    brass: 'var(--role-metal)', brassWarm: 'var(--atelier-label)', green: 'var(--role-positive)', red: 'var(--role-critical)',
    // R-37.74 arm (iii): the interactive half of the old `brass`. This local map SHADOWS the
    // module-level A above, so the split has to land in both — a shadowed const is exactly
    // where a token split goes quietly wrong.
    interactive:     'var(--atelier-accent-text)',
    interactiveWarm: 'var(--atelier-accent-text)',
  };

  // ── DESIGN-1 · THE ONE ROW (docs/review/REPORT.md §3, findings P8 and P14) ─────────────────
  // At least 64 high. Line 1 the name, on its own line. Line 2 one line of facts, where the
  // provenance tags (TDW, Referral, Wedding) and the twin's note ride as words instead of boxes
  // that squeezed the name ("Aanya Kapo…"). One thing on the right: the status, a sentence-case
  // pill coloured by meaning. The letter column (L, I, ◐) carried no meaning and is gone.
  // The twin note keeps its words and loses its separate link line: its href was the room,
  // never the record, and the one row has no third line. Name and facts wrap rather than cut: at
  // the phone's large text setting nothing is cut off (the founder's rule).
  const detailParts = [row.secondary, row.meta].filter(Boolean) as string[];
  const tags = [row.tdw ? 'TDW' : '', row.referralIn ? RF.chipReferral : '', row.weddingLead ? WP.chipWedding : ''].filter(Boolean);
  const facts = [...detailParts.map(cap), ...tags, row.crossChip || ''].filter(Boolean);
  const detailLine = facts.join(' · ');

  const pillColor = stateColor(slice, row.badge);

  return (
    // `data-row-id` is a DOM HOOK AND NOTHING ELSE — no behaviour, no styling, no prop
    // threaded down. F-39.11's focus arm needs to find one row in the list without the
    // list knowing anything about the URL, and an attribute is the smallest thing that
    // does that. It ships in both trees because it is inert in both.
    <div data-row-id={row.id} style={{
      display: 'flex', alignItems: 'center',
      borderBottom: '1px solid var(--atelier-card-border)',
    }}>
      <button type="button" onClick={onSelect} style={{
        flex: 1, minWidth: 0, minHeight: 64,
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px 12px var(--slice-inset, 16px)',
        background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div data-row-name="" style={{
            font: T.tn,
            color: A.ink,
            overflowWrap: 'anywhere',
          }}>{row.primary}</div>
          <div data-row-facts="" style={{
            font: T.t4,
            color: A.inkMute,
            marginTop: 4,
            overflowWrap: 'anywhere',
          }}>{detailLine}{row.crew && (<>{detailLine ? ' \u00b7 ' : ''}{row.crew.words
            ? <span data-row-crew="">{row.crew.words}</span>
            : <span data-row-crew="" style={{ color: 'var(--role-critical)' }}>{CREW_WORDS.none}</span>}</>)}</div>
        </div>

        {/* The one thing on the right: the status, in sentence case. */}
        {row.badge && (
          <span style={{
            font: T.t5,
            flexShrink: 0,
            color: pillColor,
            border: `1px solid ${pillColor}`,
            borderRadius: 999,
            padding: '4px 12px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}>{cap(row.badge)}</span>
        )}
      </button>

      {/* WhatsApp + Call buttons — clients only, when phone exists */}
      {slice === 'clients' && row.phone && (
        <div style={{ display: 'flex', gap: 8, paddingRight: 16, flexShrink: 0 }}>
          <a href={`https://wa.me/${row.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            aria-label={`WhatsApp ${row.primary}`}
            style={{
              font: T.t3,
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'transparent',
              border: '0.5px solid var(--role-positive)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              color: A.green,
            }}><WaIcon /></a>
          <a href={`tel:${row.phone}`}
            onClick={e => e.stopPropagation()}
            aria-label={`Call ${row.primary}`}
            style={{
              font: T.t3,
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'var(--atelier-input-bg)',
              border: '0.5px solid var(--atelier-sheet-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              color: A.interactiveWarm,
            }}>☎</a>
        </div>
      )}
    </div>
  );
}
