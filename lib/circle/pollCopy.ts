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
//   ⑪  THERE IS NO BYTE, AND AT M-TRUST (2026-08-14) THERE IS NO WALL EITHER.
//       This entry read: 「 a member whose `can_see_vendors` is off sees a linked
//       event's name and date and simply not its vendor 」. The founder retired
//       that flag — 「 1- mehek always sees the vendor info 」 — so the expected-
//       zero survives with a stronger reason than it had. It was ratified because
//       a line saying "some details are hidden" advertises a wall to someone who
//       was not looking for one; it now holds because there is no wall on vendors
//       to advertise. `§4` asserts no such string exists, unchanged.
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

// ═══════════════════════════════════════════════════════════════════════════
// TDW_14 D-3c — THE CREATE SHEET. Nine bytes, ratified whole 2026-08-14
// (CE-33, founder: 「 all stand 」). BRIDE-ONLY by founder ruling: a member
// votes in the circle, she does not convene it, so the co-planner strip never
// imports anything below.
// ═══════════════════════════════════════════════════════════════════════════
//
// ── ⑫ BINDS THIS WHOLE SHEET: LABELS ABOVE, NEVER PLACEHOLDERS INSIDE ──────
// A placeholder is example words sitting in her question until she overwrites
// them, which is exactly what ⑫ refused. The invite panel one file over uses
// `placeholder="e.g. Mom, Priya, Anjali"` and is NOT precedent here — it is a
// different, separately-vetoed surface, and the distinction is the ruling.
//
// ── THE OPENING CONTROL NEEDS NO BYTE, AND THAT IS THE POINT ───────────────
// ① `POLL_ASK` was vetoed as "the affordance that opens a poll". D-3b rendered
// it as an eyebrow because there was no affordance yet. It now becomes tappable
// and the sheet's head reuses it. The byte never moved; it finally does the job
// it was approved for, which is why line 1 of D-3c's sheet cost nothing.

/** A · the sheet's head. Reuses ① — the sheet IS what the label promised. */
export const POLL_SHEET_HEAD = POLL_ASK;

/** B · the label ABOVE the question field. Hers, not ours. */
export const POLL_QUESTION_LABEL = 'Your question';

/** C · the label above the choices. Not "Options" — that is the API's word. */
export const POLL_CHOICES_LABEL = 'Choices';

/** D · adds a choice. Mirrors C so the control names its own result. */
export const POLL_ADD_CHOICE = 'Add a choice';

/** F · submit. One word; the whole feature is one verb and A set it up. */
export const POLL_SUBMIT = 'Ask';

/** G · submit, in flight. Same word, present tense — the estate's `Sending…`. */
export const POLL_SUBMITTING = 'Asking…';

/** H · cancel. Plain: she may be abandoning a typo, not a thought. */
export const POLL_CANCEL = 'Cancel';

/** I · the optional close-time switch. ⑥ owns the DISPLAY byte; this names the switch. */
export const POLL_ADD_CLOSING = 'Add a closing time';

// ── E AND TWO MORE ARE RATIFIED EXPECTED-ZEROS ────────────────────────────
// There is deliberately NO constant for any of these, and their absence is the
// ruling rather than an oversight:
//
//   E · AT FOUR CHOICES the add control simply greys. ② already says "A poll
//       needs between 2 and 4 options." at the server. Repeating it on a
//       disabled button explains a wall she has just hit instead of one she is
//       approaching.
//   · SUBMIT STAYS DISABLED until a question and two choices exist. No
//       client-side refusal byte: a form that greys its own button never has to
//       say no, and ② remains the contract for a caller that bypasses the form.
//   · NO HELPER TEXT anywhere. The invite panel earns its one line because a
//       phone number's consequence is non-obvious; nothing here has a hidden
//       consequence.
//
// `scripts/tdw14_d3b_polls.proof.mjs` §9 asserts each of these absences, so a
// later hand cannot add the reassuring sentence the founder declined.
//
// ── NOT BUILT, AND NAMED SO IT IS NOT MISTAKEN FOR AN OVERSIGHT ────────────
// The sheet has NO delete and NO edit. A poll, once asked, stands until it
// closes. D-3a built no such door and the founder was offered one; taking a
// question back is a separate charter, not a byte.

// ═══════════════════════════════════════════════════════════════════════════
// TDW_14 D-3e — UNMAKING A POLL. Five bytes, ratified whole 2026-08-14
// (founder: 「 all stand 」 · 「 only delete. no edit needed 」).
// ═══════════════════════════════════════════════════════════════════════════
//
// ── THESE MIRROR A SHIPPED, ALREADY-VETOED PATTERN ────────────────────────
// `components/frost/blooms/people.tsx` removes a circle member with:
//     "Remove {name}?" · "They'll lose access to your Circle, Muse board, and
//     DreamAi." · Remove / Removing… / Keep
// Matching a shape the founder has already approved beats inventing a second
// one, so the head, the consequence line, the destructive verb and its
// in-flight form all take that sibling's grammar rather than a new voice.
//
// ── WHY `Keep` AND NOT `Cancel` ───────────────────────────────────────────
// `POLL_CANCEL` ('Cancel') is the CREATE sheet's dismiss, where nothing exists
// yet and she is abandoning a draft. Here something exists and she is choosing
// to KEEP it. Two different acts, two different words — and `Keep` is the
// sibling's byte, character for character.
//
// BRIDE-ONLY, like create: a member votes in the circle, she does not convene
// it and cannot unmake it. The co-planner strip imports none of these.

/** J · the affordance on a poll card. The WORD, not a bin glyph — the sibling uses words. */
export const POLL_DELETE = 'Delete';

/** K · the confirm head. Mirrors "Remove {name}?" — not the question's own text,
 *  which in a head would read as if it were being asked again. */
export const POLL_DELETE_CONFIRM = 'Delete this poll?';

/** L · the consequence, and it is REAL and INVISIBLE: 0124 cascades every vote
 *  with the poll. She should know before, not discover after. */
export const POLL_DELETE_BODY = 'The votes go with it.';

/** M · the destructive action, in flight. Same word as J. */
export const POLL_DELETING = 'Deleting…';

/** N · the dismiss. BYTE-IDENTICAL to the sibling's. */
export const POLL_KEEP = 'Keep';

// ── TWO RATIFIED EXPECTED-ZEROS ───────────────────────────────────────────
//   · NO TOAST on success. The poll vanishing IS the confirmation. `people.tsx`
//     toasts because the member leaves a list she may not be watching; a poll
//     card she has just tapped is under her thumb.
//   · NO SEPARATE WORD FOR A CLOSED POLL. Founder-confirmed: deleting a decided
//     poll takes the same byte as deleting a live one.
