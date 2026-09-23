// lib/worklist/ownNumberFlow.ts · CE-45 · G6-1 · CUT ONE (FE_1).
// EVERY NEW VENDOR-FACING BYTE OF THE OWN-NUMBER FLOW, ONE HOME.
//
// ⚠ EVERY VALUE HERE IS THE FOUNDER'S, as written in the copy table of
// 2026-09-24 (read-first (iv), O1 to O11, eighteen slots) and approved by him in
// one word ("ok", relayed by CE-45 the same day). b120 §1.1 pins each by sha.
// O12 was not consumed by this cut and has no slot. Until this delivery every
// value was `null`, and the gate below kept the room a shell.
//
// ⚠ AND A NULL IS A MECHANISM, NOT A TODO. `flowBytesReady()` below is read by
// the room before it draws anything of the flow: while ANY byte is still null,
// the room renders its shell exactly as before, whatever the door says. So a
// screen can never reach a vendor with an invented word on it (the chair's
// ruling of 2026-09-24: "a screen whose byte is owed renders the shell until the
// byte is his"; c-45.3: a scope stated in prose carries a mechanism). The rung
// plants placeholder bytes into a COPY of this file to drive the flow, and
// restores it byte for byte; the tree never holds a placeholder.
//
// The NUMBER home (`lib/worklist/ownNumber.ts`) is untouched: it is the shell's,
// pinned by b73 against the veto sheet both ways. The flow is a second screen
// with its own home, not a third key on the shell's.
//
// NO PERSONA NAME in any value that lands here (b40 C32's law, R-37.70).

export type OwnNumberFlowCopy = {
  /** O1  · the consent screen's heading */
  consentHead: string | null;
  /** O2  · the shared way, in her words (her Business app stays; chats and contacts come across if she allows; broadcast lists stop; app messages stay free) */
  sharedWay: string | null;
  /** O2b · the button that opens Meta's screen for the shared way */
  sharedGo: string | null;
  /** O3  · the moved way, FIRST statement (her number runs only through us) */
  movedWay: string | null;
  /** O3b · the button that leads to the moved way's second confirmation */
  movedGo: string | null;
  /** O4  · the moved way, SECOND confirmation, with the consequence (§7b constraint 1, twice-stated) */
  movedConfirm: string | null;
  /** O4b · the button that opens Meta's screen for the moved way */
  movedConfirmGo: string | null;
  /** O5  · a personal (not Business) WhatsApp number cannot be shared */
  personalNumber: string | null;
  /** O6  · who pays: Meta bills her own card, shown before she connects (FQ2 (a)) */
  whoPays: string | null;
  /** O8  · cancel, on both consent screens */
  cancel: string | null;
  /** O9  · while connecting (and, on the shared way, keep the Business app open) */
  connecting: string | null;
  /** O10a · state: pending */
  pending: string | null;
  /** O10b · state: active */
  active: string | null;
  /** O10c · state: suspended, with the auto-pause notice (§7b constraint 3) */
  suspended: string | null;
  /** O10d · state: moved out */
  movedOut: string | null;
  /** O10e · she stopped part-way through Meta's screens */
  stopped: string | null;
  /** O10f · Meta reported an error (her session id is shown beside it, as data) */
  metaError: string | null;
  /** O11 · the thirty-second code expired before we could use it */
  expired: string | null;
};

export const FLOW: OwnNumberFlowCopy = {
  consentHead:    'Two ways to connect your number',
  sharedWay:      'Keep your WhatsApp Business app. Your number works in the app and here at the same time. If you allow it, your chats from the last six months and your contacts come across. Broadcast lists stop working, and messages you send from the app stay free.',
  sharedGo:       'Connect and keep my app',
  movedWay:       'Or move your number here completely, so it runs only through The Dream Wedding.',
  movedGo:        'Move my number',
  movedConfirm:   'Once it moves, this number stops working in your WhatsApp app. Are you sure?',
  movedConfirmGo: 'Yes, move it',
  personalNumber: 'A personal WhatsApp number cannot be kept in the app. Use a WhatsApp Business number, or a new number for your business.',
  whoPays:        'Meta charges for these messages and bills your own card, not us.',
  cancel:         'Not now',
  connecting:     'Connecting your number. If you are keeping your app, keep WhatsApp Business open on your phone.',
  pending:        'We are finishing the connection. This can take a few minutes.',
  active:         'Enquiries to this number are now answered here, in your voice.',
  suspended:      'Paused. Meta flagged messages from this number, so we have stopped sending from it until its rating recovers.',
  movedOut:       'This number is no longer connected here.',
  stopped:        'You stopped before finishing, so nothing was connected.',
  metaError:      'Meta could not finish connecting your number. If you contact us, quote the code below.',
  expired:        'That took too long to finish. Please try again.',
};

/** True only when EVERY flow byte is the founder's. One null keeps the room a shell. */
export function flowBytesReady(copy: OwnNumberFlowCopy = FLOW): boolean {
  return Object.values(copy).every((v) => typeof v === 'string' && v.length > 0);
}
