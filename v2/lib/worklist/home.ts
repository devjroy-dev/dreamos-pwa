// lib/worklist/home.ts — DESIGN-1 · STAGE 2 · EVERY WORD HOME SAYS, ONE HOME.
//
// Home is the day's work, in the order a vendor acts on it (docs/review/REPORT.md §3, "What a vendor sees
// first"): Check a date, Reply to, Today (with This week), Money due. The pinned rooms moved to More; the
// "open items" numeral, the kind line and the Done today table retired (each repeated what a list already
// showed). Plain words, sentence case, no dashes (REPORT.md §5 and W1).

/** How many enquiries Today's "Reply to" draws before the link to all of them (CE-47 FE-8, the founder's walk of 1 Oct 2026). */
export const REPLY_SHOWN = 3;

export const HOME = {
  checkHead:     'Check a date',
  checkLabel:    'Date',
  checkButton:   'Check',
  checkBusy:     'Checking',
  checkFailed:   'Could not read that date just now. Try again.',
  answerFree:    'Free all day',
  answerBooked:  'Booked',
  answerEnquiry: 'Enquiry',
  askedBy:       (name: string) => `${name} asked for this date`,
  alsoAsked:     (names: string) => `Also asked for by ${names}`,
  blocked:       (reason: string | null) => (reason ? `Blocked: ${reason}` : 'Blocked'),
  goodDate:      'A good date for weddings',
  openCalendar:  'Open in calendar',

  replyHead:     'Reply to',
  replyNone:     'No new enquiries.',
  replyNoMessage: 'No message yet',
  // CE-47 FE-8 (the chair's ruling of 2 Oct 2026): after the first three, one last row, "See all N", N the real count
  replyAll:      (n: string) => `See all ${n}`,

  todayHead:     'Today',
  todayNone:     'Nothing booked today.',
  weekButton:    'This week',
  weekHide:      'Hide this week',
  weekNone:      'Nothing else booked this week.',
  placeUnset:    'Place not set',

  moneyHead:     'Money due',
  moneyNone:     'Nothing owed right now.',
  moneyLine:     (owed: string, clients: number, next: string | null) =>
    `${owed} owed · ${clients} ${clients === 1 ? 'client' : 'clients'}${next ? ` · next due ${next}` : ''}`,

} as const;

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** "14 Feb" from an ISO date, read off the string (no zone can move it). */
export function shortDate(iso: string | null | undefined): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
  return m ? `${parseInt(m[3], 10)} ${MONTHS[parseInt(m[2], 10) - 1]}` : '';
}

/** "Sunday 14 Feb 2027" for the date a vendor checked. */
export function longDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return `${DAYS[d.getUTCDay()]} ${+m[3]} ${MONTHS[+m[2] - 1]} ${m[1]}`;
}

/** "Monday 28 September", Home's head line: the IST day the feed was cut for, never the device's clock. */
export function todayLine(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  const LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${DAYS[d.getUTCDay()]} ${+m[3]} ${LONG[+m[2] - 1]}`;
}

/** "Tue 29 Sep" for a day heading in the week list. */
export function dayHeading(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return `${DAYS[d.getUTCDay()].slice(0, 3)} ${+m[3]} ${MONTHS[+m[2] - 1]}`;
}

/** CLOCK WORDS (the founder, 30 Sept 2026): every clock time the app draws is 12-hour with am or pm, lower case, no
 *  leading zero: "7:00 pm", "10:00 am", "12:00 pm", and midnight "12:00 am". Never "19:00". One home for every drawn time.
 *  clockWords takes a stored time ("19:05", "19:05:00"); clockAt takes a moment and reads it in India (UTC+5:30). */
export function clockWords(t: string | null | undefined): string {
  const m = /^(\d{1,2}):(\d{2})/.exec(String(t ?? ''));
  if (!m) return '';
  const h = +m[1], min = m[2];
  if (h > 23 || +min > 59) return '';
  return `${h % 12 === 0 ? 12 : h % 12}:${min} ${h < 12 ? 'am' : 'pm'}`;
}
export function clockAt(ms: number): string {
  if (!isFinite(ms)) return '';
  const d = new Date(ms + 330 * 60000);
  return clockWords(`${d.getUTCHours()}:${String(d.getUTCMinutes()).padStart(2, '0')}`);
}
/** A moment as the date and the clock, both in words, in India: "3 October 2026, 7:00 pm". */
export function dateTimeWords(iso: string | null | undefined): string {
  const t = iso ? Date.parse(iso) : NaN;
  if (!isFinite(t)) return '';
  const d = new Date(t + 330 * 60000);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${clockAt(t)}`;
}
/** A moment's calendar day in India, with its weekday: "Saturday 3 October 2026" (CE-47, FE-8, the chair's ruling 3:
 *  the one home for the weekday date the FE-6 stand-in drew; longDate reads the India day, so no zone can move it). */
export function dayDateWords(iso: string | null | undefined): string {
  const t = iso ? Date.parse(iso) : NaN;
  if (!isFinite(t)) return '';
  return longDate(new Date(t + 330 * 60000).toISOString().slice(0, 10));
}

/** WHEN, IN WORDS (CE-46, the chair's ruling on ages, 30 Sept 2026): no "3 min ago" or "1w ago". An item from today (IST)
 *  shows its time, "10:40 am" (clockAt); an older one its date with the month written out, "28 September"; one from another year adds
 *  the year, "28 September 2025". One home: agoWords (Today) and relativeTouch (Clients) both read it. */
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export function whenWords(iso: string | null | undefined, now: number = Date.now()): string {
  const t = iso ? Date.parse(iso) : NaN;
  if (!isFinite(t)) return '';
  const ist = (ms: number) => new Date(ms + 330 * 60000);   // IST is UTC+5:30, no daylight saving
  const a = ist(t), b = ist(now);
  const day = (d: Date) => `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
  if (day(a) === day(b)) return clockAt(t);   // the founder: "10:40 am", never "10:40"
  const dm = `${a.getUTCDate()} ${MONTHS_LONG[a.getUTCMonth()]}`;
  return a.getUTCFullYear() === b.getUTCFullYear() ? dm : `${dm} ${a.getUTCFullYear()}`;
}

/** When an enquiry arrived, in whenWords (was "3 min ago", CE-46). The name is kept for its one caller. */
export function agoWords(iso: string | null | undefined, now: number = Date.now()): string {
  return whenWords(iso, now);
}

/** A wire word as a vendor reads it: "shoot" is "Shoot", "part_paid" is "Part paid". */
export function sentence(w: string | null | undefined): string {
  if (!w) return '';
  const t = w.replace(/_/g, ' ');
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** The enquiry states that still want an answer; booked and lost do not. */
export const OPEN_ENQUIRY = new Set(['new', 'contacted', 'quoted']);
