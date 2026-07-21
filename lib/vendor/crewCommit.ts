// lib/vendor/crewCommit.ts
// TDW_04.5 P1 #6 (CE Ruling №10) — the day-sheet crew picker's COMMIT LOGIC.
//
// Framework-agnostic and browser-free by design (native-implications clause: no React,
// no DOM, no storage APIs) so the Expo port inherits it and the proof can drive it in
// plain node. The component (CalendarCrewSheet) is a thin UI shell over these two
// functions; the proof (scripts/crewCommit.proof.ts) drives them with mocked deps.

/** The full-array SET the picker PATCHes: the toggled-on ids, deduped, order-stable. */
export function crewSetFrom(selected: Iterable<string>): string[] {
  return Array.from(new Set(selected));
}

/** The backend's PATCH response, narrowed to what commit cares about. `conflict` rides
 *  on ok:true as an ADVISORY (member_clash) — never a refusal (Ruling №3). */
export type CrewCommitResponse =
  | { ok: true; event?: unknown; conflict?: { message?: string } | null }
  | { ok: false; error: string };

export interface CrewCommitDeps {
  /** The REAL updateEvent (lib/vendor/api/vendor). Structural: id + { assigned_member_ids }. */
  updateEvent: (id: string, body: { assigned_member_ids: string[] }) => Promise<CrewCommitResponse>;
  onToast: (msg: string, kind?: 'success' | 'error') => void;
  onRefresh: () => void;
  onClose: () => void;
}

export const CREW_SAVED_MSG = 'Crew updated';
export const CREW_ERROR_MSG = 'Could not save crew.';

/**
 * Commit the crew SET for a booking through the BACKEND's write path (never client-side).
 * ONE PATCH, the whole toggled set. The response is interpreted per Ruling №3:
 *   · ok:false            -> an error toast; the sheet stays open to retry.
 *   · ok:true + conflict  -> the write LANDED; conflict.message is surfaced VERBATIM-BARE
 *                            as a NON-BLOCKING success notice (never a confirm dialog).
 *   · ok:true (no clash)  -> a plain "Crew updated" success notice.
 *
 * F-04.88 DORMANCY, on the record: a crew-only write returns conflict==null TODAY
 * (occupancy.js:551 short-circuits touchesSpatial before the member_clash block), so the
 * clash branch does not fire in production yet. This surfacing is BYTE-READY — the day the
 * core cure lands (touchesSpatial learns members are spatial), conflict.message arrives and
 * this branch renders it, no picker change needed. The proof exercises the branch with a
 * MOCKED conflict, exactly as #4's bench proved the renderer over a constructed payload.
 */
export async function commitCrew(
  eventId: string,
  selected: Iterable<string>,
  deps: CrewCommitDeps,
): Promise<void> {
  const set = crewSetFrom(selected);
  const r = await deps.updateEvent(eventId, { assigned_member_ids: set });
  if (r.ok) {
    const adv = (r as { conflict?: { message?: string } | null }).conflict;
    if (adv && adv.message) {
      deps.onToast(adv.message, 'success'); // the clash, verbatim-bare, non-blocking (dormant today)
    } else {
      deps.onToast(CREW_SAVED_MSG, 'success');
    }
    deps.onRefresh();
    deps.onClose();
  } else {
    const err = (r as { error?: string }).error;
    deps.onToast(err || CREW_ERROR_MSG, 'error');
    // sheet stays open — nothing landed
  }
}
