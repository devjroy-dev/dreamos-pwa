// Small pure formatters. Locked to "Rs" currency prefix per Rule V7.
//
// ── TDW_09 · THE ONE MONEY HOME (R-U25 / R-U27 / R-U30) ──────────────────────
// Twenty-four functions across this repo emitted currency in their own dialect.
// Seven used K/L/Cr shorthand and about thirteen used the rupee glyph, both of
// which the money-register law forbids on any rendered byte. They consolidate
// HERE. `formatRs` is the only thing permitted to build a money string, and
// `fitMoneySize` is the only sanctioned answer to "it does not fit".
//
// HOW THE CENSUS WAS DERIVED, stated in the same breath as the number, because a
// figure whose method is not stated is unratifiable (F-07.95's law; chair
// correction No.12; executor D-14): the first census matched FUNCTION NAMES and
// reported twelve. It missed `amountWordsAdjacent` twelve lines below the clean
// `fmtINR` in cabinet.ts, missed `fmt` in admin/revenue purely for being
// differently named, and could not see inline JSX at all. The corrected census
// matches EMISSION, comments stripped, and scripts/tdw09_money.proof.mjs asserts
// that property rather than a roster of filenames.

import { CURRENCY_PREFIX } from './tokens';

export function formatRs(value: number | string | null | undefined): string {
  const n = typeof value === 'string' ? parseFloat(value) : (value ?? 0);
  if (!isFinite(n as number)) return `${CURRENCY_PREFIX} 0`;
  return `${CURRENCY_PREFIX} ${Number(n).toLocaleString('en-IN')}`;
}

/**
 * The whole figure, or a smaller whole figure — never a clipped one.
 *
 * R-U24's no-truncation clause: a money figure renders WHOLE or not at all.
 * "Rs 1,25,0…" is a worse lie than "1.25L" ever was, because the reader cannot
 * tell it is incomplete. This is the sanctioned instrument for FIXED-WIDTH cells
 * that cannot reflow — the Hub's brass Ledger being the specimen that forced it,
 * a ~120px cell whose own comment used to argue compaction was a design need.
 * Compaction was the thing the law forbade; type size is free.
 *
 * A LIST ROW SHOULD NOT CALL THIS. Rows reflow (R-U28) — wrap the figure, do not
 * shrink it, because shrinking text in a row that had room is a cost paid for
 * nothing.
 *
 * The estimate is deliberately conservative. It runs on the server too, where no
 * measurement API exists, so it must never over-promise: a figure one step smaller
 * than strictly necessary is correct; one step too large is clipped, and clipping
 * is the violation.
 */
export function fitMoneySize(
  text: string,
  containerPx: number,
  maxPx: number,
  minPx: number,
  widthRatio = 0.5,
): number {
  if (!isFinite(containerPx) || containerPx <= 0) return minPx;
  for (let px = Math.round(maxPx); px >= Math.round(minPx); px -= 1) {
    if (text.length * widthRatio * px <= containerPx) return px;
  }
  return Math.round(minPx);
}

/**
 * True when the smallest dignified step still cannot hold the figure — the caller
 * must reflow rather than render. Exported so a cell can BRANCH instead of
 * silently clipping, which is the whole point of the clause.
 */
export function moneyNeedsReflow(
  text: string, containerPx: number, minPx: number, widthRatio = 0.5,
): boolean {
  return text.length * widthRatio * minPx > containerPx;
}

// "2026-05-12" → "12 May" (short, no year). Returns input on parse failure.
export function formatShortDate(iso: string | null | undefined): string {
  if (!iso) return '';
  // Parse loosely — accept YYYY-MM-DD or full ISO.
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const year = parseInt(m[1], 10);
  const month = parseInt(m[2], 10) - 1;
  const day = parseInt(m[3], 10);
  const d = new Date(Date.UTC(year, month, day));
  if (isNaN(d.getTime())) return iso;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${day} ${months[month]}`;
}

// "2026-05-12" → "12 May 2026" — used in primer text where year matters.
export function formatLongDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  return `${formatShortDate(iso)} ${m[1]}`;
}

// ── F-2c.w5 · A TIMESTAMP IS NOT A DATE, AND `formatLongDate` KNOWS ONLY DATES ─
// WITNESSED ON THE FOUNDER'S WALK, 2026-09-02 at 03:25 IST: he completed a task
// and the row landed under the heading `Done today` reading
// 「Completed 1 Sep 2026」. The section and the label disagreed by a day, on the
// same row, at the same instant.
//
// BOTH WERE RIGHT ABOUT DIFFERENT CLOCKS. `formatLongDate` REGEX-SLICES the
// leading `YYYY-MM-DD` off the raw string — for a `timestamptz` that is the UTC
// date, and 03:25 IST is 21:55 UTC the day before. `TeamTabs`' `isToday` builds
// a `Date` and compares `getDate()`, which is LOCAL. One surface, two zones.
//
// ⚠ `formatLongDate` IS NOT THE THING TO FIX. Its slice is exactly right for a
// plain `date` column — `due_date`, `event_date` — which carries no zone at all,
// and localising those would drag a wedding across midnight for anyone west of
// UTC. The defect is handing it a TIMESTAMP. So the conversion happens first,
// and the word shape keeps its one home below.
/** A timestamp's calendar day IN THE USER'S OWN ZONE, as `YYYY-MM-DD`. Feed this
    to `formatLongDate` whenever the value is a `timestamptz` rather than a
    `date`. Returns '' on an unparseable value, never a wrong day. */
export function localDateIso(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Today as YYYY-MM-DD in the user's local zone.
export function todayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
