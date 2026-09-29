// lib/worklist/book.ts · DESIGN-1 · STAGE 4 · THE ONE-TAP BOOK (the founder, docs/review/REPORT.md §3 and his answers).
//
// One home for the Book sheet's words and the little it derives, so the sheet computes nothing a bench cannot read:
//   · every function date goes on the calendar as its own event (the server writes them: dream-os promotion.js);
//   · the invoice is offered ticked and cannot be unticked (a booking always makes one);
//   · with no package yet, she picks one, or "No package, enter an amount", in the same sheet;
//   · the payment plan is one sentence, with "Change plan" one tap from it;
//   · no message goes by itself: a ready confirmation draft sits in its own box (R-46.17), sent only on her tap;
//   · a 10-second Undo, and Cancel booking on the client's page, asking before removing events and an unpaid invoice.
import { formatRs } from '@/lib/vendor/format';
import { packageDate } from '@/v2/lib/worklist/packages';
import type { LeadScheduleRow } from '@/v2/lib/vendor/api/vendor';

export const UNDO_SECONDS = 10;
export const MAX_DATES = 12;

export const BOOK = {
  title: 'Book',
  datesHead: 'Dates',
  datesNote: 'Each date goes on your calendar as its own event.',
  dateLabel: (n: number) => `Date ${n}`,
  whatLabel: 'What (optional)',
  whatPlaceholder: 'Haldi, Sangeet, Wedding',
  addDate: 'Add a date',
  removeDate: 'Remove',
  needDate: 'Add at least one date.',
  packageHead: 'Package',
  noPackage: 'No package, enter an amount',
  amountLabel: 'Amount',
  advanceLabel: 'Advance received',
  needPackage: 'Pick a package, or enter an amount.',
  needAmount: 'Enter the amount.',
  needAdvance: 'Enter the advance received, no more than the amount.',
  planHead: 'Payment plan',
  changePlan: 'Change plan',
  invoiceLine: (amount: number | null) => (amount ? `Invoice for ${formatRs(amount)}` : 'Invoice'),
  invoiceNote: 'Every booking gets an invoice.',
  confirm: 'Confirm booking',
  // after the booking, in the same sheet
  bookedTitle: 'Booked',
  bookedLine: (name: string, dates: number, invoice: string | null) =>
    `${name} is booked. ${dates === 1 ? 'The date is' : dates === 2 ? 'Both dates are' : `All ${dates} dates are`} on your calendar${invoice ? `, and invoice ${invoice} is ready` : ''}.`,
  draftHead: (first: string) => `A confirmation for ${first}`,
  draftNote: 'Nothing has been sent. Copy it, or send it on WhatsApp yourself.',
  sendWa: 'Send on WhatsApp',
  undo: (s: number) => `Undo (${s})`,
  undone: 'Booking undone.',
  undoFailed: 'Could not undo. Cancel the booking from the client’s page.',
  done: 'Done',
  // Cancel booking, on the client's page
  cancel: 'Cancel booking',
  cancelTitle: (name: string) => `Cancel ${name}’s booking?`,
  cancelLine: 'The client goes back to your enquiries.',
  removeEvents: (n: number) => (n === 1 ? 'Also remove the date from your calendar' : `Also remove the ${n} dates from your calendar`),
  removeInvoice: (n: string) => `Also remove the unpaid invoice ${n}`,
  invoiceKept: (n: string) => `Invoice ${n} has payments on it, so it stays.`,
  keep: 'Keep booking',
  cancelled: 'Booking cancelled.',
  cancelFailed: 'Could not cancel the booking.',
  reading: 'Reading the booking…',
} as const;

export type DateRow = { date: string; title: string };

const isDateKey = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);

/** The dates the sheet sends: each well-formed date once, its title trimmed (none when blank). */
export function functionsOf(rows: readonly DateRow[]): { date: string; title?: string }[] {
  const seen = new Set<string>();
  const out: { date: string; title?: string }[] = [];
  for (const r of rows) {
    if (!isDateKey(r.date) || seen.has(r.date)) continue;
    seen.add(r.date);
    const t = r.title.trim();
    out.push(t ? { date: r.date, title: t } : { date: r.date });
  }
  return out.slice(0, MAX_DATES);
}

/** The payment plan as one sentence: "Rs 24,000 on booking, Rs 24,000 on 22 November 2026 and Rs 32,000 on 5 February 2027." */
export function planSentence(rows: readonly LeadScheduleRow[]): string {
  const parts = rows.map((r, i) => `${formatRs(r.amount)} ${i === 0 && r.kind === 'deposit' ? 'on booking' : `on ${packageDate(r.due_on)}`}`);
  if (!parts.length) return '';
  return (parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`) + '.';
}

/** "20, 21 and 22 December 2026" when the dates share a month; otherwise each date in full. */
export function datesText(dates: readonly string[]): string {
  const ds = [...dates].filter(isDateKey).sort();
  if (!ds.length) return '';
  const full = ds.map((d) => packageDate(d));
  const sameMonth = ds.every((d) => d.slice(0, 7) === ds[0].slice(0, 7));
  const list = sameMonth ? [...ds.slice(0, -1).map((d) => String(Number(d.slice(8, 10)))), full[full.length - 1]] : full;
  return list.length === 1 ? list[0] : `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`;
}

/** The ready confirmation: her words to send, or not. No dash, no sales line. */
export function confirmationDraft(p: { first: string; dates: readonly string[]; total: number | null; invoice: string | null }): string {
  const when = datesText(p.dates);
  const money = p.total ? ` The booking amount is ${formatRs(p.total)}${p.invoice ? `, invoice ${p.invoice}` : ''}.` : '';
  return `Hi ${p.first}, your booking is confirmed${when ? ` for ${when}` : ''}.${money} Thank you!`;
}

/** The first name, for a greeting. */
export function firstName(name: string | null | undefined): string {
  const t = String(name || '').trim().split(/\s+|&/)[0];
  return t || 'there';
}

/** A wa.me link that opens WhatsApp with the draft; with no number, WhatsApp asks her who to send it to. */
export function waLink(phone: string | null | undefined, text: string): string {
  const digits = String(phone || '').replace(/\D/g, '');
  const to = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${to}?text=${encodeURIComponent(text)}`;
}
