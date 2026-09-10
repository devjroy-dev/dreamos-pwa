// lib/worklist/shoots.ts
// CE-42 · SEAT R7 · 4c-1 — G5.2 THE SHOOT BOARD, IN REFERRALS & PARTNERS (R-42.8, ruling F).
//
// ── EVERY STRING HERE WAS VETOED, AS PROPOSED ─────────────────────────────────
// `docs/mocks/shoot-board-mock.html`, frames S1-room · S1-empty · S2-sheet ·
// C1-sheet, vetoed by the chair 2026-09-10 (NEW STRINGS (7) — "vetoed as
// proposed"). One home for all seven; the room and the one composer read them.
// Every OTHER word on the shoot board is the Collab room's own (Interested ·
// Pass · the poster line · the composer's labels) and is read from where it
// already lives, never retyped here.
//
// ⚠ ONE DRAWING, CORRECTED TO THE SHIPPED BYTE: the S1-room frame drew
// `2h ago`; the Collab card's `timeAgo` says `2hr ago`, and the shoot card
// reads that function (lib/vendor/collabFormat.ts). The frame was the error.

export const SHOOTS = {
  sectionTitle: 'Shoots',
  postAction:   'Post a shoot',       // the room's action AND the sheet's title — one string
  openToYou:    'Open to you',
  yourShoots:   'Your shoots',
  none:         'No shoots open to you yet.',
  shootType:    'Shoot type',
} as const;

/** `{n} of {m} cast` — filled items over items. Vetoed as proposed. */
export function castLine(filled: number, total: number): string {
  return `${filled} of ${total} cast`;
}
