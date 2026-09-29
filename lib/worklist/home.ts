// lib/worklist/home.ts — DESIGN-1 · STAGE 2 · EVERY WORD HOME SAYS, ONE HOME.
//
// Home is the day's work, in the order a vendor acts on it (docs/review/REPORT.md §3, "What a vendor sees
// first"): Check a date, Reply to, Today (with This week), Money due. The pinned rooms moved to More; the
// "open items" numeral, the kind line and the Done today table retired (each repeated what a list already
// showed). Plain words, sentence case, no dashes (REPORT.md §5 and W1).

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
  replyAll:      'See every new enquiry',

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

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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

/** "3 min ago", "3 h ago", "2 days ago": how long an enquiry has waited. */
export function agoWords(iso: string | null | undefined, now: number = Date.now()): string {
  const t = iso ? Date.parse(iso) : NaN;
  if (!isFinite(t)) return '';
  const min = Math.max(0, Math.round((now - t) / 60000));
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? '1 day ago' : `${d} days ago`;
}

/** A wire word as a vendor reads it: "shoot" is "Shoot", "part_paid" is "Part paid". */
export function sentence(w: string | null | undefined): string {
  if (!w) return '';
  const t = w.replace(/_/g, ' ');
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** The enquiry states that still want an answer; booked and lost do not. */
export const OPEN_ENQUIRY = new Set(['new', 'contacted', 'quoted']);
