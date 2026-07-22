// lib/vendor/slotWords.ts
// TDW_04.5 · P3 — THE SLOT VOCABULARY'S ONE HOME (CE ruling F8(d), the chair's shape).
//
// These four words used to live as three file-local consts inside
// `components/vendor/CalendarDaySheet.tsx` — exported to nobody, and therefore
// impossible to reuse. P3's crew page needs the same words on a public route that
// cannot import a session-bound vendor component, and the fork was ruled:
//
//   (a) export them FROM the day sheet   — rejected: a guarded file becomes a
//                                          growing export surface.
//   (b) re-declare them on the crew page — rejected: F-04.104's convicted class
//                                          (one rule, written twice, drifting by a
//                                          clause and taking two different paths).
//   (c) ship the WORD from the backend   — rejected: that mints a second home
//                                          server-side — the same disease in a
//                                          backend coat.
//   (d) HOIST. One map, one file, two importers.  ← ruled
//
// The slot ENUM itself is still `deriveSlot`'s (dream-os `src/lib/vendor/eventWrite.js`
// :187-200: morning < 12:00, noon < 16:00, evening, and full_day for an untimed
// occupying booking). This file does not decide what a slot IS. It decides only how a
// slot is SPELLED for a human, and that is the only thing it may ever decide.

/** The three *choosable* slots — the ones a vendor can block or file into. */
export const SLOT_LABELS: { key: 'morning' | 'noon' | 'evening'; label: string }[] = [
  { key: 'morning', label: 'Morning' },
  { key: 'noon',    label: 'Noon' },
  { key: 'evening', label: 'Evening' },
];

/** Reading order down a day. `null` is the unslotted tail, and stays last. */
export const SLOT_ORDER = ['morning', 'noon', 'evening', 'full_day', null] as (string | null)[];

/** Every slot a row can actually carry, including the two the vendor cannot pick. */
export const SLOT_HEADINGS: Record<string, string> = {
  morning: 'Morning', noon: 'Noon', evening: 'Evening', full_day: 'Full day', _none: 'Unslotted',
};

/**
 * One slot value -> its word, or null when there is nothing honest to say.
 *
 * Returns NULL rather than a placeholder for an absent or unknown slot: a crew
 * member's day card would rather show no word than a word the estate invented. The day
 * sheet's own '_none' heading is a different job — it labels a GROUP that exists, so it
 * keeps its own key above.
 */
export function slotWord(slot: string | null | undefined): string | null {
  if (!slot) return null;
  return SLOT_HEADINGS[slot] ?? null;
}

// ── TDW_04.5 P4 rider — the CALL TIME's one home ────────────────────────────
// Founder-caught at the seal walk: the crew page rendered `19:00` and the
// owner's sheet `19:00:00`, for the same booking. The sheet exists precisely to
// mirror the crew page, so the two reading differently is the drift this file
// was created to prevent — the same argument as F8(d)'s slot-word hoist, now
// applied to the field beside it.
//
// MOVED, not rewritten: byte-identical to the copy that lived at
// app/crew/[token]/page.tsx:73. `when` vocabulary belongs together, and this
// file was already imported by both surfaces, so the hoist adds no new import
// anywhere.
export function hhmm(t: string | null) {
  if (!t) return null;
  const m = /^(\d{2}):(\d{2})/.exec(t);
  return m ? `${m[1]}:${m[2]}` : t;
}
