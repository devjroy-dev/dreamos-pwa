// lib/circle/pollCopy.ts
// THE ONE HOME for every poll-facing byte, both surfaces.
//
// TDW_14 · D-3b · C-4.
//
// ── WHY THIS FILE EXISTS ─────────────────────────────────────────────────────
// Polls render on TWO surfaces that share no styling vocabulary: the member's
// coplanner threads index (GOLD/CREAM/FROST_PANEL, from CircleSessionContext)
// and the bride's circle bloom (FT/FS/FI + roomInk props, from lib/frost/tokens).
// A shared component would have to thread two token systems through one tree and
// would be worse than two renderers.
//
// THE COPY IS THE PART THAT MUST NOT FORK. Twelve bytes were frozen at the
// founder's veto (CE-33, 2026-08-13, 「 approve all recommendations 」). If each
// surface carried its own string literal, the freeze would be enforceable only
// by reading both files and hoping — and the estate has paid for that shape
// before (`circlePermissions.js` was extracted for exactly it, one plane over).
// So: two renderers, ONE vocabulary. A cell pins the bytes here and asserts no
// surface carries a literal of its own, which makes the veto mechanical rather
// than aspirational.
//
// ── THE BYTES ARE THE FOUNDER'S AND THEY ARE FROZEN AT THE CHARACTER ────────
// APPROVED-COPY-CARRIES-ITS-HASH: vetoed copy is frozen at the byte, not at the
// runtime value. Nothing below is edited, softened, re-punctuated or
// "improved" without a new veto. `scripts/tdw14_d3b_polls.proof.mjs` §1 asserts
// every one of them character for character and reds on a single character's
// drift; its mutation leg proves that is not decorative.
//
// TWO OF THE TWELVE LIVE SERVER-SIDE, NOT HERE, and that is deliberate:
//   ②  'A poll needs between 2 and 4 options.'  — dream-os src/api/circle/polls.js
//   ⑩  'This poll has closed.'                  — dream-os src/api/circle/polls.js
// They are API refusals the server must speak whether or not a browser is
// listening, so duplicating them here would be a SECOND HOME for a byte that
// already has one — the disease this file exists to prevent, reintroduced by the
// file meant to prevent it. They are frozen at their own sites by
// `b14_d3_polls_bench` §3.4 and §4.3, which became frozen-copy cells in the same
// delivery as this file (CE-33's standing note). This comment is the pointer
// that keeps the twelve readable as one set from either end.
//
// ── TWO EXPECTED-ZEROS, RATIFIED, RECORDED SO THEY ARE NOT "FORGOTTEN" ─────
//   ⑪  A member whose `can_see_vendors` is off sees a linked event's name and
//       date and simply not its vendor. THERE IS NO BYTE. A line saying "some
//       details are hidden" advertises a wall to someone who was not looking for
//       one. The absence is the ruling; `§4` asserts no such string exists.
//   ⑫  A poll's question and option labels are the bride's or the member's own
//       words. We never put words in her poll. No default, no placeholder text,
//       no "e.g." — asserted by the same cell.

/** ① The affordance that opens a poll. Both surfaces. */
export const POLL_ASK = 'Ask the circle';

/** ③ An option she has not chosen yet. */
export const POLL_TAP_TO_CHOOSE = 'Tap to choose';

/** ④ The option she picked. Reads correctly aloud, and says whose. */
export const POLL_YOUR_CHOICE = 'Your choice';

/** ⑨ No polls exist. A full stop, not a second invitation — ① is already on screen. */
export const POLL_EMPTY = 'No polls yet.';

/**
 * ⑤ The tally line. A FRACTION, never a bar: she can see who is still to answer
 * without the UI implying a deadline, and most polls carry no `closes_at` at all.
 */
export function pollTally(n: number, total: number): string {
  return `${n} of ${total} voted`;
}

/**
 * ⑥ Rendered ONLY when `closes_at` is non-null. No countdown, no urgency — the
 * server holds the actual refusal (⑩), so this line informs and never threatens.
 */
export function pollCloses(time: string): string {
  return `Closes ${time}`;
}

/** ⑦ After close, one option ahead. The spec asked for the winner "crowned quietly"; two words is quiet. */
export function pollWinner(option: string): string {
  return `${option} won`;
}

/**
 * ⑧ After close, a tie. The founder's word was NO crown on a tie — this states
 * it plainly rather than performing suspense.
 *
 * THE BYTE EXTENDS BY COMMA, which is the veto's own wording and the reason this
 * is a function rather than a two-slot template: THREE-WAY AND FOUR-WAY TIES ARE
 * REACHABLE — a poll may carry up to four options and every one of them can hold
 * an equal count. A two-argument signature would have been correct for the
 * example and wrong for the feature.
 */
export function pollTie(options: string[]): string {
  const list = options.length > 2
    ? `${options.slice(0, -1).join(', ')} and ${options[options.length - 1]}`
    : options.join(' and ');
  return `It's a tie — ${list}`;
}
