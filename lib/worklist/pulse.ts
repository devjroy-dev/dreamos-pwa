// lib/worklist/pulse.ts
// TDW_19 · G4.4 · R8-2 — THE DEMAND PULSE, glass side.
//
// The room renders. This file DECIDES. Everything the card has an opinion about
// — how many rows it shows, whether a figure wears a `+`, whether the noun is
// singular, how a date is written — lives here as a pure function over the
// wire's own shape, so `b70` drives the shipped rule instead of a restatement of
// it. The screen calls `pulseLines()` and maps the result to elements; it
// computes nothing, and §2.4 asserts that it cannot start.
//
// ⚠ NOTHING HERE FORMATS MONEY, AND THAT IS THE SITTING'S SHAPE, NOT AN
// OVERSIGHT. R-41.114's wallet law binds the RATE NUDGE, which master G4.4 lists
// beside the pulse and which is not in this acceptance. The pulse counts checks
// and never prices them. `b70` §3.4 keeps this file free of a figure that could
// read as a rupee.

/** One row of `GET /api/v2/vendor/availability/pulse`, verbatim off the wire. */
export type PulseDate = { date: string; checks: number };

export type DatePulse = {
  ok: boolean;
  window_days: number;
  /** ONE flag for the WHOLE response. See `pulseLines`. */
  truncated: boolean;
  dates: PulseDate[];
  total: number;
};

/** What the card draws: a figure and the words beside it, already decided. */
export type PulseLine = {
  /** React key. The date, which is unique in the fold by construction. */
  key: string;
  /** `3`, or `48+` when the read was capped. Rendered in the display face. */
  figure: string;
  /** `checks on 4 December`. The vetoed noun, then the vetoed preposition, then
   *  the date. Never a whole line concatenated from a number this file
   *  formatted, so the register's bytes stay the register's. */
  text: string;
};

// ── HOW MANY ROWS THE CARD SHOWS ──────────────────────────────────────────
// PROPOSED AT THE FRAME, **RULED AT R8-2's CLOSE**. The chair ruled the READ's
// cap (1000 rows) first and this second, so for one packet the card's depth was
// the only unruled number on the surface. It is three: the number the frame was
// vetoed at. Named here rather than spelled in the screen so a later ruling is
// one edit in one file, and so `b70` §1.7 can drive it.
//
// ⚠ THE WIRE IS NOT CAPPED TO THREE AND MUST NOT BE. The door returns every date
// in the window, sorted, because the briefing rider (γ, ruled) reads the SAME
// response and may want a different depth. A server-side top-3 would have made
// the second reader impossible without a second door.
export const PULSE_CARD_ROWS = 3;

// ── THE YEAR ───────────────────────────────────────────────────────────────
// A card about the last seven days does not need to say 2026 on a date three
// months out; the year is noise she reads past. But a 2028 muhurat rendered as
// `4 December` would read as THIS season, which is a different date and a
// different decision. So the year returns beyond the horizon below.
const YEAR_HORIZON_DAYS = 334; // eleven months

/**
 * `4 December`, or `4 December 2028` beyond the horizon.
 *
 * ⚠ UTC, AND THE REASON IS A BUG SOMEBODY ELSE ALREADY PAID FOR. The leaf's own
 * `humanDate` (app/v/[code]/date/page.tsx:127) carries the same note: `date` is
 * a CALENDAR date with no zone, and `new Date('2026-12-04')` parsed in local
 * time renders **3 December** for every reader west of Greenwich. The market
 * this serves sits east of it, so the defect would never have shown on the
 * founder's own device — which is exactly the kind that ships.
 *
 * Two homes for one rendering is a real cost and it is taken deliberately: the
 * leaf is a server component whose formatter is page-local, and importing a
 * public-leaf internal into a vendor room would tie a stranger's page to hers.
 * `b70` §1.5 pins BOTH to the same output so they cannot drift apart in silence.
 */
export function pulseDateLabel(iso: string, now: Date = new Date()): string {
  const d = new Date(iso + 'T00:00:00Z');
  if (Number.isNaN(d.getTime())) return iso;
  const far = Math.abs(d.getTime() - now.getTime()) / 86400000 > YEAR_HORIZON_DAYS;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    ...(far ? { year: 'numeric' } : {}),
    timeZone: 'UTC',
  });
}

/**
 * The wire's rows, decided into the card's lines.
 *
 * ⚠ `truncated` IS ONE FLAG FOR THE RESPONSE AND EVERY FIGURE WEARS THE `+` OR
 * NONE DOES (ruled at R8-2). The rows the door's 1000-cap cut off could have
 * belonged to ANY date, so every count is a floor together. Applying the `+`
 * per-row would claim we know which dates were complete, and we do not.
 *
 * ⚠ AND THE `+` PLURALISES. `1+ check` is false — the figure means «at least
 * one», so the noun follows the ceiling and not the floor. Singular survives in
 * exactly one case: an honest, untruncated count of one.
 */
export function pulseLines(
  pulse: Pick<DatePulse, 'dates' | 'truncated'> | null | undefined,
  copy: { one: string; many: string },
  now: Date = new Date(),
  rows: number = PULSE_CARD_ROWS,
): PulseLine[] {
  if (!pulse || !Array.isArray(pulse.dates)) return [];
  const trunc = pulse.truncated === true;
  return pulse.dates
    .filter((d) => d && typeof d.date === 'string' && Number(d.checks) > 0)
    .slice(0, rows)
    .map((d) => ({
      key: d.date,
      figure: `${d.checks}${trunc ? '+' : ''}`,
      text: `${d.checks === 1 && !trunc ? copy.one : copy.many} ${pulseDateLabel(d.date, now)}`,
    }));
}
