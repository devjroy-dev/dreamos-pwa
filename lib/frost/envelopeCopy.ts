// lib/frost/envelopeCopy.ts
// ─────────────────────────────────────────────────────────────────────────────
// TDW_15 · P2 (R-35.9) — THE ENVELOPE ROOM'S WORDS, ALL OF THEM.
//
// ── FOUNDER-VETOED, 2026-08-18, ALL NINE ────────────────────────────────────
// Executed in-chat per the veto-slot law (protocol §10.6): the four ruled
// strings chair-checked against R-34.30's stance, the five chrome bytes taken
// to a founder veto because they sat OUTSIDE the pre-ruled set. Discharged
// 「 all five chrome bytes approved as recommended, S1–S4 standing 」.
// A change to any byte below needs a NEW veto, never a judgement call.
//
// ── THE SET IS CLOSED ───────────────────────────────────────────────────────
// Nine bytes, and the room renders no user-facing word that is not one of them.
// That is not tidiness, it is the cure for this block's own owned defect: P1
// authored `Edit` and `Remove` in the build and owed them afterwards. A tenth
// string this build discovers it needs is a RAISED FORK, not an authored
// string. `eventCopy.ts` is the precedent for the home.
//
// ── WHAT IS DELIBERATELY ABSENT, BY RULING ──────────────────────────────────
//   · NO seed envelope names (R-34.30, R-34.31). The room opens empty and the
//     canonical eleven are THE PICKER, never rows written on her behalf.
//   · The 90% signal is WORDLESS (R-34.30). It is a hue change on the hairline
//     and nothing else — no label, no percentage, no warning tone. `spent` is
//     an honest FLOOR and not a total (R-34.22: a filed receipt with a NULL
//     amount contributes zero), so a number rendered beside it would claim a
//     precision the data does not have. The silence is the honesty.
//   · NOTHING at the envelope for a photo receipt (R-34.30). S3 sits on the
//     RECEIPT ROW, once, and never at the envelope.
//
// ── REGISTER ────────────────────────────────────────────────────────────────
// No money figure lives here. Every rupee this room renders goes through
// `formatRs` (lib/vendor/format) — `Rs 1,25,000`, grouped Indian digits, no
// glyph, no L/k short form. A money string in a copy file is how a register
// cure grows a home it cannot find.
// ─────────────────────────────────────────────────────────────────────────────

export const ENVELOPE_COPY = {
  // ── CHROME · founder veto 2026-08-18 ──────────────────────────────────────
  /** 1 · The fourth ExpenseSlice tab. Short noun, matching its three live
   *  siblings — `My expenses` · `Vendors` · `Receipts`. */
  tab: 'Envelopes',
  /** 2 · The create sheet's title. */
  sheetTitle: 'New envelope',
  /** 3 · The name field's placeholder. It says "or" because the eleven sit
   *  above it as the picker: she taps one, or she writes her own. */
  namePlaceholder: 'Or name your own',
  /** 4 · The ceiling field's label. NOT "budget" and NOT "limit" — the column
   *  is a ceiling she chose, and nothing in this room refuses a spend that
   *  passes it. */
  amountLabel: 'Amount set aside',
  /** 5 · The file affordance on a receipt row. One verb. */
  file: 'File',

  // ── THE FOUR RULED STRINGS · R-34.30, chair-checked ───────────────────────
  /** S1 · The envelope list's empty state. The room opens empty by ruling, so
   *  this line is what stands where seeded names would have been. */
  emptyEnvelopes: "Envelopes hold what you’ve set aside. Make your first.",
  /** S2 · The unfiled tray's empty state. It says the GOOD state quietly: an
   *  empty tray is the finished condition, not a missing feature. */
  emptyTray: "Everything’s filed.",
  /** S3 · On the receipt row, once. R-34.22's untyped emptiness, reported
   *  rather than complained about: there is no OCR on any plane (R-34.7), so a
   *  photo without an amount is the NORMAL state of a freshly filed receipt.
   *  Never an error tone, never at the envelope. */
  photoUntyped: 'Photo filed. Amount not typed yet.',
  /** S4 · The delete confirm's consequence line. It is TRUE and mechanical:
   *  `couple_receipts_envelope_id_fkey` is ON DELETE SET NULL, so her receipts
   *  unfile rather than dying with the bucket. She is told the real consequence
   *  before she confirms, not after. */
  deleteConsequence: 'Its receipts go back to the tray.',
} as const;
