// v2/lib/worklist/calendarRoom.ts · CE-47 · FE-6 L5 · THE REWORKED CALENDAR'S NEW WORDS, ONE HOME.
// The founder's verdict on mock 10 (V14 as ruled "+ New event", V15), with the founder's type ruling kept.
export const CAL = {
  add: 'New event',                                   // the pill reads "+ New event" (the same words as Events)
  booked: 'Booked', goodDates: 'Good dates',          // V15, the legend
  blocked: 'Blocked',                                 // the grid's dashed ring, named (the chair's a: nothing unnamed)
  showGood: 'Show good dates', hideGood: 'Hide good dates',
} as const;
const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** "12 December 2026" from "2026-12-12" (full month, R-42.13). */
export function fullDay(d: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || ''); return m ? `${Number(m[3])} ${MONTH[Number(m[2]) - 1]} ${m[1]}` : d;
}
