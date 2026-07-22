// lib/vendor/assignmentWords.ts
// TDW_04.5 · P4 — the confirmation vocabulary's ONE HOME.
//
// The crew page and the owner's sheet now describe the SAME three states. If
// each screen spelled them itself they would drift, and the two people looking
// at one booking would read different words for one fact. This is F8(d)'s
// argument (the slot-word hoist) applied to confirmation states.
//
// FOUNDER VETO, CLOSED. Exact bytes.
//
// "Can't make it" rather than "Declined" is deliberate and founder-ruled: it is
// the exact phrase the crew member tapped. Echoing their words back to the owner
// is more honest than converting them into a verdict, and it keeps one
// vocabulary across both surfaces.

export type ConfirmationState = 'pending' | 'confirmed' | 'declined';

export const CONFIRMATION_WORDS: Record<string, string> = {
  pending:   'Awaiting confirmation',
  confirmed: 'Confirmed',
  declined:  "Can't make it",
};

/** An unknown state reads as awaiting — never blank, never the raw enum. */
export function confirmationWord(state: string | null | undefined): string {
  return CONFIRMATION_WORDS[String(state || 'pending')] || CONFIRMATION_WORDS.pending;
}

// THE RING VOCABULARY, closed across two surfaces at CE-58 and reused here
// rather than re-picked: hollow = awaiting · solid brass = confirmed ·
// terracotta = can't make it. One gold per screen is untouched — none of these
// is gold.
export const CONFIRMATION_TONE: Record<string, string> = {
  pending:   'var(--atelier-ink-mute)',
  confirmed: 'var(--atelier-label)',
  declined:  '#E07B5C',
};

export function confirmationTone(state: string | null | undefined): string {
  return CONFIRMATION_TONE[String(state || 'pending')] || CONFIRMATION_TONE.pending;
}

// ── TDW_04.5 P4 rider — THE FAILURE MUST SPEAK ──────────────────────────────
// The first cut swallowed every failure into the empty state with the comment
// "the empty state is honest when the read fails". It is not. An empty state is
// honest only when it is TRUE — a 404, a 500 and a genuinely empty board all
// rendered identically, so the screen told the owner something it did not know.
//
// This is F-04.110's class, rebuilt in the same sitting that cured it: there,
// the composer read `message` while the server wrote `error`, and a specific
// refusal became "Something went wrong." Same disease, different swallow.
//
// The register is the estate's own: `Could not save crew.` (crewCommit) and the
// founder-vetoed `Could not add. Try again.` (rosterMint). "Could not" over
// "Couldn't" is a correction to the executor's own proposal, made for that
// consistency; one word to change if the founder prefers his.
export const ASSIGNMENTS_ERROR_MSG = 'Could not load assignments.';
