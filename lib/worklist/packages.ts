// lib/worklist/packages.ts — CE-43 · LC-2 · THE PACKAGE BYTES, ONE HOME.
//
// FOUNDER VETO 2026-09-17 (on the chair's lean): YES to every string in the LC-2
// read-first §6 as written, with two changes (Q2 in the quote body only; P10's third
// option reads "Handover date"). Recorded in docs/handovers/TDW_CE43_LC2_P1_HANDOVER.md.
//
// WIRE-OR-DELETE AT BIRTH. Only the bytes packet 1 RENDERS live here. The rest of the
// vetoed set (P7 to P10, P12, A3 to A13, C4, C5, Q1, D1 to D4) arrives in the packet
// that first renders it, verbatim from the veto record, so no byte sits in the tree
// with no reader.
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
} as const;

/** The package card on the lead detail (A1, A2 first control). */
export const LEAD_PACKAGE = {
  /** A1 · the card's eyebrow. */
  eyebrow: 'Package',
  /** A2 · the first control; the rest of A2 arrives with packets 2 and 3. */
  attach: 'Attach package',
} as const;

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
