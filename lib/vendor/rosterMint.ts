// lib/vendor/rosterMint.ts
// TDW_04.5 P4 · defect A's cure (CE-59) — the Roster row action's LOGIC.
//
// Framework-agnostic and browser-free by design (native-implications clause: no
// React, no DOM, no storage APIs), following the crewCommit precedent exactly:
// the component is a thin UI shell over this function, and the proof drives it
// in plain node with mocked deps.
//
// ── MINT ONLY (the ruling) ──────────────────────────────────────────────────
// This does ONE thing: it asks the bridge door for the external's team_members
// row. It does NOT assign anybody to anything.
//
// That restraint is the whole design. The bridge row lands with active:true, so
// the instant it exists the external appears in every picker the estate already
// ships — the day sheet's, the band pip's — and assignment happens there, on the
// witnessed rails, through the events PATCH that routes to eventWrite. Adding an
// assignment surface here would have meant a second path to the calendar, which
// is precisely what the one-writer law forbids.
//
// IDEMPOTENT BY CONSTRUCTION: the door returns the same row and the same
// page_token on a re-tap (`created:false`). A vendor who taps twice is TOLD THE
// SAME THING, because the same thing is true — they are on the crew list. A
// second sentence for the second tap would be reporting on the door's internals
// rather than on the vendor's world.

/** The bridge door's response, narrowed to what the row action cares about. */
export type MintResponse =
  | { ok: true; member: { id: string }; created: boolean }
  | { ok: false; error?: string };

export interface MintDeps {
  /** The REAL bridgeRosterEntry (lib/vendor/api/roster). Structural: id -> response. */
  bridge: (rosterId: string) => Promise<MintResponse>;
  /** Called with the sentence to show, and whether it went well. */
  onResult: (message: string, kind: 'success' | 'error') => void;
  /** Refresh the roster so any derived state re-reads. */
  onRefresh: () => void;
}

// FOUNDER VETO, CLOSED (CE-59 relay). Exact bytes.
export const MINT_ACTION_LABEL = 'Add to crew';
// D1 (founder veto, shape (b)): once the identity exists the label FLIPS. The
// row stops offering an action that has already happened — it reports a state.
export const MINT_DONE_LABEL   = 'On crew';
export const MINT_SUCCESS_MSG  = "They're on your crew list — assign them from any booking.";
export const MINT_ERROR_MSG    = 'Could not add. Try again.';

/**
 * Mint-or-return the external's crew identity for ONE roster row.
 *
 * Success and idempotent re-tap are the SAME outcome to the vendor: both mean
 * "they are on your crew list". `created` is the door's bookkeeping, not the
 * vendor's news.
 *
 * A thrown request (network, 503 pre-0096, a roster row that isn't yours) lands
 * on the error sentence. The row stays where it is so the vendor can retry —
 * nothing is optimistically flipped, because the crew list is the truth and this
 * screen does not get to guess at it.
 */
export async function mintCrewIdentity(rosterId: string, deps: MintDeps): Promise<boolean> {
  try {
    const res = await deps.bridge(rosterId);
    if (!res || res.ok !== true) {
      deps.onResult(MINT_ERROR_MSG, 'error');
      return false;
    }
    deps.onResult(MINT_SUCCESS_MSG, 'success');
    deps.onRefresh();
    return true;
  } catch {
    deps.onResult(MINT_ERROR_MSG, 'error');
    return false;
  }
}
