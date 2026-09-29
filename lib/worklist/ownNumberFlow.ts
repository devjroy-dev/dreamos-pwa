// lib/worklist/ownNumberFlow.ts · CE-45 · G6-1 · CUT ONE (FE_1).
// EVERY NEW VENDOR-FACING BYTE OF THE OWN-NUMBER FLOW, ONE HOME.
//
// ⚠ EVERY VALUE HERE IS THE FOUNDER'S, as written in the copy table of
// 2026-09-24 (read-first (iv), O1 to O11, eighteen slots) and approved by him in
// one word ("ok", relayed by CE-45 the same day). b120 §1.1 pins each by sha.
// FE_2 (2026-09-24): five slots renamed by the founder ("keep my app" did not say what it meant; his words,
// "Use it on my phone and in TDW app", then "ok" to the matching set): consentHead, sharedWay, sharedGo,
// movedWay, movedGo. The other thirteen are unchanged.
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
  // CE-46 G6-4 · THE ROOM FINISHED (F-b, F-c, F-e, F-f ruled 28 September 2026). {number} is her display number, DATA.
  /** R1 · the way line on the box, shared (F-e, his words) */
  wayShared: string | null;
  /** R2 · the way line on the box, moved (F-e, his words) */
  wayMoved: string | null;
  /** R3 · the button under the box (the kickoff's words) */
  remove: string | null;
  /** R4 · the sheet, shared way (F-b) */
  removeShared: string | null;
  /** R5 · the sheet, moved way (F-b) */
  removeMoved: string | null;
  /** R6 · the sheet's destructive button, second and outlined (F-b) */
  removeGo: string | null;
  /** R7 · the sheet's cancel (F-b) */
  removeCancel: string | null;
  /** R8 · while removing: no control (PROPOSED, for his yes) */
  removing: string | null;
  /** R9 · Meta refused: nothing changed (PROPOSED, for his yes) */
  removeRefused: string | null;
  /** R10 · S6, shared way only, until Meta says she disconnected (F-c) */
  finishInApp: string | null;
};

export const FLOW: OwnNumberFlowCopy = {
  consentHead:    'How should your number work?',
  sharedWay:      'On your phone and in TDW app. Your number keeps working in WhatsApp Business on your phone, and TDW answers on it too. If you allow it, your chats from the last six months and your contacts come across. Broadcast lists stop working, and messages you send from your phone stay free.',
  sharedGo:       'Use it on my phone and in TDW app',
  movedWay:       'Only in TDW app. Your number runs only through TDW, and stops working in WhatsApp on your phone.',
  movedGo:        'Use it only in TDW app',
  movedConfirm:   'Once it moves, this number stops working in your WhatsApp app. Are you sure?',
  movedConfirmGo: 'Yes, move it',
  personalNumber: 'A personal WhatsApp number cannot be kept in the app. Use a WhatsApp Business number, or a new number for your business.',
  whoPays:        'Meta charges for these messages and bills your own card, not us.',
  cancel:         'Not now',
  connecting:     'Connecting your number. If you are keeping your app, keep WhatsApp Business open on your phone.',
  pending:        'We are finishing the connection. This can take a few minutes.',
  // F-44.172 (his final words, 25 September; R-45.30): "in your voice" replaced. Its truth half is held by R-45.32
  // (flag.own_number stays off for every vendor but DEV440 until 2b makes answering real).
  // CE-46 G6-4 F-f (ruled 28 Sept 2026): the kickoff's line REPLACES F-44.172's.
  active:         'Connected. TDW answers for you on this number.',
  suspended:      'Paused. Meta flagged messages from this number, so we have stopped sending from it until its rating recovers.',
  movedOut:       'This number is no longer connected here.',
  stopped:        'You stopped before finishing, so nothing was connected.',
  metaError:      'Meta could not finish connecting your number. If you contact us, quote the code below.',
  expired:        'That took too long to finish. Please try again.',
  wayShared:      'Works on your phone and in TDW app.',
  wayMoved:       'Works only in TDW app.',
  remove:         'Remove this number',
  removeShared:   'TDW will stop answering on {number}. Your WhatsApp Business app keeps working. To finish, open WhatsApp Business: Settings, Account, Business Platform, Disconnect.',
  removeMoved:    'TDW will stop answering on {number} and it will stop working through TDW. To use it in the WhatsApp app again, set it up there with this number.',
  removeGo:       'Remove',
  removeCancel:   'Cancel',
  removing:       'Removing your number.',
  removeRefused:  'This number could not be removed just now. Nothing has changed. Please try again.',
  finishInApp:    'Finish removing {number} in WhatsApp Business: Settings, Account, Business Platform, Disconnect.',
};

/** Pure: a FLOW line with her number put in. The number is data, never copy. */
export function withNumber(line: string | null, number: string): string {
  return String(line || '').split('{number}').join(number);
}

/** True only when EVERY flow byte is the founder's. One null keeps the room a shell. */
export function flowBytesReady(copy: OwnNumberFlowCopy = FLOW): boolean {
  return Object.values(copy).every((v) => typeof v === 'string' && v.length > 0);
}
