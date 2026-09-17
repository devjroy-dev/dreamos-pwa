// lib/worklist/packages.ts — CE-43 · LC-2 · THE PACKAGE BYTES, ONE HOME.
//
// FOUNDER VETO 2026-09-17 (on the chair's lean): YES to every string in the LC-2 read-first §6,
// with two changes (Q2 in the quote body only; P10's third option reads "Handover date").
// THE RECORD IS IN THE TREE: dream-os docs/handovers/TDW_CE43_LC2_P3_HANDOVER.md, Appendix
// (F-43.84, c-43.15). Every byte below is copied from that appendix; none is coined here.
//
// WIRE-OR-DELETE AT BIRTH. Only the bytes a shipped packet RENDERS live here. Packet 3 adds A2's
// `Booking confirmed` and `Advance paid`, A12, A13, C4, C5, F29, and D3/D4 on the Invoices room
// (F-43.86 (c2)). A2's `Send quote`, A10, A11, Q1 and D1/D2 arrive with packet 4.
//
// F26 (chair, 2026-09-17): each schedule label carries the package's OWN share; the words
// are verbatim, the number is data. At 30/30 the lines equal the vetoed bytes exactly.
//
// PACKAGE_FAILURES: the eight packet 2 failure bytes, vetoed YES 2026-09-17 under C-43.16.
//
// The act byte for every control that cannot run yet is NOT typed here: it is
// `COPY.launchingSoon` in lib/solutions/copy.ts (R-42.12 AMENDED, one home).
// The room's label is the registry's (lib/worklist/rooms.ts, `packages`, byte P1).

export const PACKAGES = {
  /** P2 · the room's eyebrow. */
  eyebrow: 'Your packages',
  /** P3 · the sub-head. C-43.15 (chair, under the founder's "go with your lean"): one reads
   *  "1 package", any other count "{n} packages". Presentation of the vetoed byte, not copy. */
  sub: (n: number) => `What you offer · ${n} ${n === 1 ? 'package' : 'packages'}`,
  /** P4 · no packages at all. */
  empty: 'No packages yet. Add one to quote a couple.',
  /** P5 · the default marker. */
  defaultMark: 'Default',
  /** P6 · the room's controls (packet 1: each answers Launching soon.). */
  add: 'Add package',
  edit: 'Edit',
  del: 'Delete',
  setDefault: 'Set as default',
  /** P11 · a package with no fee yet (every seed starts this way). */
  feeUnset: 'Fee not set',
  /** P6 · the edit sheet's two controls. */
  save: 'Save',
  cancel: 'Cancel',
  /** P7 · the delete confirm. */
  deleteConfirm: 'Delete this package? Quotes already sent keep their copy.',
  /** P8 · the edit fields. */
  fName: 'Name',
  fDescription: 'Description',
  fIncluded: "What's included",
  fItem: 'Item',
  fDetail: 'Detail',
  fAddItem: 'Add item',
  fFee: 'Fee',
  /** P9 · the schedule fields. */
  fDeposit: 'Deposit on booking (%)',
  fMiddle: 'Middle payment (%)',
  fTakeMiddle: 'Take a middle payment',
  /** P10 · the delivery field (the founder's change: the third option reads "Handover date"). */
  fDelivery: 'Delivery',
  dOnTheDay: 'On the event date',
  dDays: 'Days after the event',
  dHandover: 'Handover date',
  fDays: 'Days',
  /** P12 · the toasts. */
  saved: 'Package saved.',
  deleted: 'Package deleted.',
  defaultSet: 'Default set.',
} as const;

/** The packet 2 failure and gate lines, vetoed YES 2026-09-17 (C-43.16). */
export const PACKAGE_FAILURES = {
  saveFailed: 'Could not save the package.',
  deleteFailed: 'Could not delete the package.',
  defaultFailed: 'Could not set the default.',
  defaultRace: 'Another change landed first. Try again.',
  attachFailed: 'Could not attach the package.',
  nameGate: 'Give the package a name to save it.',
  remainderGate: 'Leave part of the fee for the remainder.',
  fieldGate: 'Check the highlighted field.',
} as const;

/** The package card on the lead detail (A1, A2 first control). */
export const LEAD_PACKAGE = {
  /** A1 · the card's eyebrow. */
  eyebrow: 'Package',
  /** A2 · the attach and booking controls (the quote control arrives with packet 4). */
  attach: 'Attach package',
  change: 'Change package',
  bookingConfirmed: 'Booking confirmed',
  advancePaid: 'Advance paid',
  /** A3 · the attach sheet's title. */
  sheetTitle: 'Attach a package',
  /** A4 · the attach fields. */
  fPackage: 'Package',
  fFee: 'Fee for this couple',
  fHandover: 'Handover date',
  /** A6 · the fold tell (C-43.3). */
  folded: 'The event is under a month away, so the middle payment is part of the final one.',
  /** A7 · the count tell (F10). */
  counted: 'Counted from the wedding date.',
  /** A8 · the delivery line. */
  delivery: (date: string) => `Delivery · ${date}`,
  /** A9 · the refusals; the fourth line is F25's, chair-approved. */
  refusals: {
    no_package: 'Attach a package first.',
    no_fee: 'Set the fee first.',
    no_wedding_date: 'Add the wedding date first.',
    no_handover_date: 'Add the handover date first.',
  },
} as const;

// ── A5 · THE SCHEDULE LINES, WITH THE PACKAGE'S OWN SHARES (F26) ──────────────
/** The label for one schedule part. At 30/30 these are the vetoed bytes exactly. */
export function scheduleLabel(kind: 'deposit' | 'middle' | 'final', pct: number): string {
  if (kind === 'deposit') return `Deposit, ${pct}% of the fee, on booking`;
  if (kind === 'middle') return `${pct}% one month before the first function (optional)`;
  return 'The remainder, on delivery, before the work is handed over';
}

// ── R-42.13 · THE FULL MONTH ────────────────────────────────────────────────────
// `22 November 2026`. A `date` column carries no zone, so it is read in UTC (the reason
// paymentReminders.ts gives). Not `Intl`: `en-IN` prints September as `Sept`.
const FULL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'] as const;
export function packageDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(`${String(iso).slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getUTCDate()} ${FULL_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** The IST calendar day of a timestamp (`paid_at` is stored as a timestamptz and arrives in UTC). */
export function istDateOf(ts: string | null | undefined): string | null {
  if (!ts) return null;
  const t = new Date(ts).getTime();
  if (Number.isNaN(t)) return null;
  return new Date(t + 330 * 60 * 1000).toISOString().slice(0, 10);
}

/** One A5 row: `{label} · {Rs} · {date}`. The money arrives from the server. */
export function scheduleRow(kind: 'deposit' | 'middle' | 'final', pct: number, amountText: string, isoDate: string): string {
  return `${scheduleLabel(kind, pct)} · ${amountText} · ${packageDate(isoDate)}`;
}

// ── THE ROOM'S BAR NUMERALS (F21) ────────────────────────────────────────────────
/** Shares while the fee is unset (`30 · 30 · 40`), whole-rupee figures once it is set. */
export function splitNumerals(parts: Array<{ pct: number; amount: number | null }>, rs: (n: number) => string): string {
  const priced = parts.length > 0 && parts.every((p) => typeof p.amount === 'number');
  return parts.map((p) => (priced ? rs(p.amount as number) : String(p.pct))).join(' · ');
}

/** The booking sheet (A12) and its outcomes (A13, F29). */
export const BOOKING = {
  /** A12 · the sheet's title and its confirm control. */
  confirm: 'Confirm booking',
  /** A12 · the date the advance arrived (advance_paid only). */
  receivedOn: 'Advance received on',
  /** A13 · the booking landed. */
  booked: 'Booked. The client, the event and the invoice are ready.',
  /** F29 · anything that is not an A9 refusal. */
  failed: 'Could not confirm the booking.',
} as const;

/** D3 / D4 · a payment marked on a booking's invoice (F17, F-43.86 (c2)). The amounts and the
 *  dates arrive from the server; the dates render with the full month (R-42.13). */
export function paymentMarked(p: { client: string; label: string; amount: string; date: string; nextDue: string | null }): string {
  if (!p.nextDue) return `Payment marked: ${p.client} · paid in full.`;
  return `Payment marked: ${p.client} · ${p.label} · ${p.amount} · ${p.date}. Next due ${p.nextDue}.`;
}

/** The re-shaped Clients Add sheet (R-43.5). C1 to C5. */
export const CLIENT_BOOKING = {
  /** C1 · kept. */
  title: 'New client',
  /** C2 · the fields, in order. */
  name: 'Name',
  phone: 'Phone',
  weddingDate: 'Wedding date',
  pkg: 'Package',
  fee: 'Fee',
  advance: 'Advance received',
  receivedOn: 'Received on',
  /** C3 · kept. */
  submit: 'Add client',
  /** C4 · the walk-in is booked. */
  added: 'Added. The client, the event and the invoice are ready.',
  /** C5 · the lead was saved but the booking did not finish. */
  savedAsLead: 'Saved as a lead. Finish the booking from Leads.',
} as const;
