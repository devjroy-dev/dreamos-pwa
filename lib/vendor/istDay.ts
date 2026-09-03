// lib/vendor/istDay.ts — THE ONE IST DAY HOME IN THE PWA. P7.2 (CE-39, 2026-09-04), FORK 6.
//
// WHY. dream-os has had one for a month (`src/lib/vendor/istClock.js`) and every server-side
// "today" reads it. The pwa had none: five sites answered "what is today" with
// `new Date().toISOString().slice(0, 10)`, which is the UTC day — wrong from midnight to
// 05:30 IST, the hours a vendor is least likely to notice and most likely to be filing the
// last invoice of the day. F-P3.8's class: the same rule in two homes with two answers.
//
// WHAT. A mirror of istClock.js's two day functions, one-for-one, so a reader of either repo
// finds the same names doing the same arithmetic. `istDateOf` and `istDayWindowUtc` are NOT
// mirrored: no pwa reader needs them yet, and an unread export is a second rule waiting for a
// second answer. Add them here, from istClock.js, when a reader appears.
//
// F-39.69 (due-today refused after 23:30 IST) is HELD for reproduction on P7.2's card; the
// five sites below are cured because they ARE the class, not because one of them has been
// proven to be the finding:
//   SliceShell.tsx      the events "this week"/"later" filter (four reads, two sites)
//   AddSheet.tsx        the expense-date default
//   invoices/body.tsx   the overdue badge (`due_date < today`) — found in the build, same class
export const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/** Today's date in IST, as `YYYY-MM-DD`. */
export function istTodayISO(now: number = Date.now()): string {
  return new Date(now + IST_OFFSET_MS).toISOString().split('T')[0];
}

/** `days` from today in IST, as `YYYY-MM-DD`. Negative values look backwards. */
export function istPlusDaysISO(days: number, now: number = Date.now()): string {
  return new Date(now + IST_OFFSET_MS + days * 86400000).toISOString().split('T')[0];
}
