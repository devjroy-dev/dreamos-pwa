'use client';
// components/vendor/slices/SliceRow.tsx — TDW_03 P1
// Row grammar + the shared atelier tokens/helpers for the five slices.
// EVERYTHING here is extracted VERBATIM from app/vendor/list/[slice]/page.tsx
// (the 774-line monofile) — commit 1 of the P1 split. No behavior change.
// P4 adds swipe/bulk affordances; P3 adds draft chips. Not here.

import type { ListSlice } from '@/hooks/vendor/useLastSlice';

export const A = {
  ink:       'var(--atelier-ink)',
  inkSoft:   'var(--atelier-ink-soft)',
  inkMute:   'var(--atelier-ink-mute)',
  inkDim:    'var(--atelier-ink-dim)',
  brass:     'var(--atelier-accent-text)',
  brassWarm: 'var(--atelier-label)',
  brassLine: 'rgba(201,168,76,0.18)',
  green:     '#7FBE85',
  red:       '#E07B5C',
} as const;
export const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script:  'var(--font-cormorant), Georgia, serif',
  body:    'var(--font-dm-sans), system-ui, sans-serif',
  label:   'var(--font-jost), system-ui, sans-serif',
} as const;

export const LABELS: Record<ListSlice, string> = { clients: 'Clients', leads: 'Leads', invoices: 'Invoices', events: 'Events', expenses: 'Expenses' };
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
  detail: { label: string; value: string }[];
  /** R1(b) cross-plane chip (CE-ruled): display-only whisper — "the other
      plane also knows this person". Reads, never writes. Absence means "no
      phone match", never "no twin". */
  crossChip?: string;
  /** TDW_04 A3 (L-3): where the chip jumps — the twin's canonical slice. */
  crossChipHref?: string;
  /** TDW_04 A3 (L-3): the binder this row names (events carry it on the wire). */
  twinBinderId?: string;
  /** TDW_04 A1: the lead's wishbone wire (missing cells) — the detail sheet
      renders tappable chips into the WishboneSheet when present. */
  draftMissing?: string[];
  /** TDW_04 A2: invoices stash — the outstanding amount the mark-paid swipe pays. */
  payAmount?: number;
  /** TDW_04 A3 masthead stashes — the RAW figures behind the row, filled by the
      slice module that fetched them. The shell derives mastheads from these,
      never by parsing the formatted strings above (a masthead that reads its own
      display text is a masthead that lies the moment formatting changes). */
  pipelineValue?: number;   // leads: budget_max · expenses: amount
  sortDate?: string | null; // events: event_date · expenses: expense_date (ISO)
}

export function fmtRs(n: number | null | undefined) { return n == null ? 'Rs —' : `Rs ${n.toLocaleString('en-IN')}`; }
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
  return s.split(/[\s_-]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
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
    brass: '#C9A84C', brassWarm: 'var(--atelier-label)', green: '#7FBE85', red: '#E07B5C',
  };

  // Build detail line — always has content, never blank
  const detailParts = [row.secondary, row.meta].filter(Boolean) as string[];
  const detailLine = detailParts.length > 0 ? detailParts.map(cap).join(' · ') : '—';

  const pillColor = stateColor(slice, row.badge);

  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      borderBottom: '0.5px solid var(--atelier-card-border)',
    }}>
      <button type="button" onClick={onSelect} style={{
        flex: 1, minWidth: 0,
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '15px 16px 15px 22px',
        background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
      }}>
        {/* Monogram glyph — always present, anchors left edge */}
        <span style={{
          flexShrink: 0, width: 28, textAlign: 'center',
          fontFamily: F.display, fontWeight: 400, fontSize: 22,
          color: A.brassWarm, lineHeight: 1,
        }}>{GLYPHS[slice]}</span>

        {/* Name + detail line */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: F.script, fontWeight: 500, fontSize: 18,
            color: A.ink, letterSpacing: '0.005em', lineHeight: 1.15,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{row.primary}</div>
          <div style={{
            fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 12,
            color: A.inkMute, letterSpacing: '0.01em', marginTop: 3,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{detailLine}</div>
          {row.crossChip && (
            // TDW_04 A3 (L-3): the chip is TAPPABLE when it knows where the twin
            // lives — tap jumps to the twin's canonical slice. Still display-only:
            // it reads and links, it never writes (the R2 boundary — dispatch may
            // announce, never link a spine; that spine waits for TDW_16).
            row.crossChipHref ? (
              <a href={row.crossChipHref} onClick={e => e.stopPropagation()} style={{
                display: 'inline-block', textDecoration: 'none',
                fontFamily: F.label, fontWeight: 300, fontSize: 9,
                color: A.brassWarm, letterSpacing: '0.08em', textTransform: 'uppercase',
                marginTop: 4, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{row.crossChip} ›</a>
            ) : (
              <div style={{
                fontFamily: F.label, fontWeight: 300, fontSize: 9,
                color: A.inkMute, letterSpacing: '0.08em', textTransform: 'uppercase',
                marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{row.crossChip}</div>
            )
          )}
        </div>

        {/* State pill — same chrome regardless of detail-line content */}
        {row.badge && (
          <span style={{
            flexShrink: 0,
            fontFamily: F.label, fontWeight: 400, fontSize: 8,
            color: pillColor,
            letterSpacing: '0.32em', textTransform: 'uppercase',
            border: `0.5px solid ${pillColor}`,
            borderRadius: 2,
            padding: '4px 9px',
            minWidth: 56, textAlign: 'center',
          }}>{row.badge}</span>
        )}
      </button>

      {/* WhatsApp + Call buttons — clients only, when phone exists */}
      {slice === 'clients' && row.phone && (
        <div style={{ display: 'flex', gap: 6, paddingRight: 16, flexShrink: 0 }}>
          <a href={`https://wa.me/${row.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            aria-label={`WhatsApp ${row.primary}`}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(127,190,133,0.10)',
              border: '0.5px solid rgba(127,190,133,0.42)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none',
              fontFamily: F.display, fontSize: 14, color: A.green, lineHeight: 1,
            }}><WaIcon /></a>
          <a href={`tel:${row.phone}`}
            onClick={e => e.stopPropagation()}
            aria-label={`Call ${row.primary}`}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--atelier-input-bg)',
              border: '0.5px solid var(--atelier-sheet-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none',
              fontFamily: F.display, fontSize: 14, color: A.brassWarm, lineHeight: 1,
            }}>☎</a>
        </div>
      )}
    </div>
  );
}
