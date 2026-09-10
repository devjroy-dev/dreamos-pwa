// lib/vendor/collabFormat.ts
// CE-42 · SEAT R7 · 4c-1 — THE COLLAB POST'S WORDS, ONE HOME FOR TWO ROOMS.
//
// These four lived as locals in app/vendor/(shell)/collab/screen.tsx. The shoot
// board (Referrals & partners) draws the same post, so they MOVED here rather
// than being typed a second time. Bytes are the Collab room's own, with ONE
// ruled change:
//
// ── THE DATE IS THE FULL MONTH (CE-42 veto of the 4c-1 frames) ──────────────
// `18 October 2026`, never `18 Oct` — and never `18 Sept`, which is what the old
// `toLocaleDateString('en-IN', { month: 'short' })` rendered for September
// (the F-42.112 byte the S2 veto sheet ruled against). en-GB long, read in UTC
// because `event_date` is a DATE, not an instant — the `pulseDateLabel` method
// (lib/worklist/pulse.ts), with the year always on.
import { formatRs } from '@/lib/vendor/format'; // TDW_09 R-U25: the one money home

export function fmtDate(dateStr: string): string {
  const d = new Date(String(dateStr).slice(0, 10) + 'T00:00:00Z');
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export function fmtBudget(amount?: number, period?: string): string {
  if (!amount) return 'Budget TBD';
  // TDW_09 R-U28: one branch, one home — the 1L threshold was the shorthand's only
  // reason to exist. List row, so it reflows.
  const f = formatRs(amount);
  if (period === 'per_day')   return `${f}/day`;
  if (period === 'per_shoot') return `${f}/shoot`;
  return f;
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hrs  = Math.floor(diff / 3600000);
  if (hrs < 1)  return 'Just now';
  if (hrs < 24) return `${hrs}hr ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── THE EVENT-TYPE LABELS, VETOED (CE-42 ruling on departures 1 & 2) ────────
// `type.replace(/_/g,' ')` was a mechanical derivation, never a vetoed byte. The
// chair vetoed these five in sentence case: Pre-wedding · Editorial · Brand shoot ·
// Portrait · Other. `wedding` and `engagement` are one word each — sentence case
// of a one-word token is the word, so they are derived, named here, not minted.
// LOOKUP FIRST: a token not in the map (a requirement type on the Collab card's
// "{Type} needed" line) keeps the derivation it always had, byte-unchanged.
export const EVENT_TYPE_LABEL: Readonly<Record<string, string>> = Object.freeze({
  wedding:     'Wedding',
  pre_wedding: 'Pre-wedding',
  engagement:  'Engagement',
  editorial:   'Editorial',
  brand_shoot: 'Brand shoot',
  portrait:    'Portrait',
  other:       'Other',
});

export function fmtType(t: string): string {
  return EVENT_TYPE_LABEL[t] ?? t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/** The server's seven event types, in the CHECK's order (0048). The one composer
 *  offers the shoot pair or the other five, never both — the pair itself is read
 *  off GET /requirement-types, not restated here. */
export const EVENT_TYPES = ['wedding', 'pre_wedding', 'engagement', 'editorial', 'brand_shoot', 'portrait', 'other'] as const;
export const PAYMENT_PERIODS = ['per_day', 'per_shoot', 'total', 'tbd'] as const;

/** The anonymised poster line, the Collab card's bytes (`Posted by a … · …`). */
export function postedBy(category: string, iso: string): string {
  return `Posted by a ${category} \u00B7 ${timeAgo(iso ?? '')}`;
}
