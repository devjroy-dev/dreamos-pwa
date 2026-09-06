// lib/circle/assignCopy.ts
// THE ONE HOME for every delegation-facing byte, both surfaces.
//
// TDW_14 · D-4b · C-5.
//
// ── WHY THIS FILE EXISTS, AND WHY IT IS NOT pollCopy.ts ─────────────────────
// Same disease, same cure, one file over. Delegation renders on TWO surfaces
// that share no styling vocabulary: the bride's events bloom (Fraunces/Italianno
// + roomInk props, from lib/frost/tokens) and the member's co-planner home
// (GOLD/CREAM/FROST_PANEL, from CircleSessionContext). A shared component would
// thread two token systems through one tree and be worse than two renderers.
//
// THE COPY IS THE PART THAT MUST NOT FORK. Seven bytes were frozen at the
// founder's sheet (CE-33, ratified 2026-08-14). If each surface carried its own
// literal the freeze would be enforceable only by reading both files and hoping.
// So: two renderers, ONE vocabulary — pollCopy's pattern, deliberately, because
// the estate has already paid for this shape and a second pattern would be a
// second thing to learn.
//
// IT IS A SEPARATE FILE FROM pollCopy AND THAT IS THE RULING, not an accident.
// pollCopy's header names its own subject: "every poll-facing byte". A
// delegation byte living in a file whose first line says polls is a byte nobody
// will find. One home per subject, not one home per feature area.
//
// ── THE BYTES ARE THE FOUNDER'S AND THEY ARE FROZEN AT THE CHARACTER ────────
// APPROVED-COPY-CARRIES-ITS-HASH: vetoed copy is frozen at the byte, not at the
// runtime value. Nothing below is edited, softened, re-punctuated or "improved"
// without a new veto. `scripts/tdw14_d4b_delegation.proof.mjs` §1 asserts every
// one of them character for character and reds on a single character's drift;
// its mutation leg proves that is not decorative.
//
// ── FOUR ARE STRINGS. THREE ARE RULINGS ABOUT SHAPE. ───────────────────────
// The sheet froze seven bytes Ⓐ–Ⓖ and only four of them are words:
//
//   Ⓐ ASSIGN_ASK        'Ask someone'        the bride's affordance
//   Ⓑ ASSIGN_PICKER_HEAD'Who's doing this?'  the picker's head
//   Ⓒ ASSIGN_NO_ONE     'No one'             the picker's un-assign row
//   Ⓔ ASSIGN_TRAY_HEAD  'Yours'              the member's tray
//
// Ⓓ, Ⓕ and Ⓖ are ratified EXPECTED-ZEROS. There is deliberately no constant
// for any of them, and the absence is the ruling rather than an oversight:
//
//   Ⓓ · THE NAME ALONE. An assigned item renders the member's own name and
//       NOTHING ELSE — no "Assigned to", no "Owner:", no chip label, no verb.
//       A label in front of a name explains a relationship the screen has
//       already made obvious, and the bride chose that name herself. §4 of the
//       proof asserts no such prefix string exists on the surface.
//   Ⓕ · NO EMPTY RENDER. When a member holds nothing the tray does not render
//       at all — no heading over an empty box, no "Nothing yet." A tray that
//       announces its own emptiness tells her she has been passed over. Note
//       this is the OPPOSITE of ⑨ POLL_EMPTY one file over, and deliberately:
//       a poll's empty state sits beside the affordance that fills it, so it
//       reads as an invitation. A member cannot assign herself anything, so the
//       same shape here would read as an absence of trust.
//   Ⓖ · THE EXISTING STATE CONTROL. She marks done with the control the surface
//       already carries. No new verb, no new byte, no second vocabulary for a
//       thing the estate already knows how to say.
//
// ── ONE MORE EXPECTED-ZERO, RATIFIED, RECORDED SO IT IS NOT "FORGOTTEN" ────
// AN ASSIGNMENT DOES NOT NOTIFY (R-D4.3, founder's word at the sheet, and
// D-4a's server half carries no send site at all). So there is no byte here for
// a nudge, a toast, or a "she's been told" reassurance — because she has not
// been told, and a line implying otherwise would be the copy lying about the
// wire. When the send ships it brings its own sheet and its own veto.

/** Ⓐ The affordance that delegates a journey item. The bride's surface. */
export const ASSIGN_ASK = 'Ask someone';

/** Ⓑ The picker's head. A question, because she is choosing a person and the
 *  screen should sound like the thought she is already having. */
export const ASSIGN_PICKER_HEAD = "Who’s doing this?";

/** Ⓒ The un-assign row, and it sits in the SAME list as the names rather than
 *  as a destructive action elsewhere: taking a task back is a choice among the
 *  same choices, not an undo. */
export const ASSIGN_NO_ONE = 'No one';

/** Ⓔ The member's tray. Two syllables; the whole feature from her side is
 *  "these are mine", and Ⓕ means she never sees this word over nothing. */
export const ASSIGN_TRAY_HEAD = 'Yours';
