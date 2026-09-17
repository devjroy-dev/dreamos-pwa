// lib/worklist/packages.ts — CE-43 · LC-2 · THE PACKAGE BYTES, ONE HOME.
//
// FOUNDER VETO 2026-09-17 (on the chair's lean): YES to every string in the LC-2
// read-first §6 as written, with two changes (Q2 in the quote body only; P10's third
// option reads "Handover date"). Recorded in docs/handovers/TDW_CE43_LC2_P1_HANDOVER.md.
//
// WIRE-OR-DELETE AT BIRTH. Only the bytes a shipped packet RENDERS live here. Packet 2
// adds P6's Save and Cancel, P7 to P10, P12, A2's `Change package`, A3 to A9 and A9's
// fourth line (F25). The rest (A2's quote and booking controls, A10 to A13, C4, C5, Q1,
// D1 to D4) arrives in the packet that first renders it, verbatim from the veto record.
//
// F26 (chair, 2026-09-17): each schedule label carries the package's OWN share; the words
// are verbatim, the number is data. At 30/30 the lines equal the vetoed bytes exactly.
//
// NEW AT PACKET 2, PENDING THE CHAIR'S VETO (C-43.16 delegation): the eight lines in
// PACKAGE_FAILURES. None ships in a final ZIP until ruled.
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

/** PENDING THE CHAIR (new at packet 2). Failure and gate lines the vetoed set does not carry. */
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
  /** A2 · the attach controls (the quote and booking controls arrive with packets 3 and 4). */
  attach: 'Attach package',
  change: 'Change package',
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

/** The re-shaped Clients Add sheet (R-43.5). C1, C2, C3. */
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
} as const;
