// lib/vendor/settleWords.ts
// TDW_04.5 · P5 — THE MONEY LOOP'S VOCABULARY AND ITS ONE PIECE OF LOGIC.
//
// Framework-agnostic and browser-free by design (native-implications clause: no
// React, no DOM, no storage APIs), following the rosterMint / crewCommit
// precedent exactly — the components are thin shells over this file, and the
// proof drives it in plain node.
//
// ── WHY THE WORDS LIVE HERE ─────────────────────────────────────────────────
// Three surfaces speak them: the team-payments board, the Log Payment sheet, and
// the Settle row on the responses page. F8(d)'s argument, applied again — two
// screens, one spelling. A vetoed string copied is a vetoed string that will
// drift, and copy drift on a money surface is how a vendor stops trusting the
// number.
//
// ── FOUNDER VETO, CLOSED (CE relay ②). EXACT BYTES. ─────────────────────────
// Every string below carries his YES verbatim. Nothing here is a paraphrase and
// nothing is assembled at the call site.

/** The stub's own words. */
export const SETTLE_TITLE        = 'Settle up';
export const AMOUNT_LABEL        = 'Amount (Rs)';
export const FUNCTION_LABEL      = 'Which function?';
export const NO_WEDDING_OPTION   = 'Not linked to a wedding';
export const LOG_ACTION          = 'Log it';
export const NOTHING_TO_SETTLE   = 'Nothing to settle yet.';

/** The By-wedding board's words. */
export const BY_WEDDING_LABEL    = 'By wedding';
export const SUBTOTAL_LABEL      = 'Subtotal';
export const NOTHING_OWED        = 'Nothing owed on this wedding.';
export const NO_PAYOUTS          = 'No payouts yet.';
/** P2's already-vetoed word, REUSED rather than re-minted (bands.js ships null). */
export const UNTITLED_WEDDING    = 'Untitled wedding';

/** The suggestion's words. */
export const EDIT_BEFORE_SAVING  = 'Edit before saving.';
export const NO_RATE_ON_FILE     = 'No rate on file';
export const NO_AMOUNT_QUOTED    = 'No amount quoted';

// ── THE SUGGESTION LINE ─────────────────────────────────────────────────────
// FOUNDER-RULED UNIT: PER FUNCTION, not per calendar day. His domain truth, and
// it overturned the executor's derivation: `daily_rate_inr`'s real-world
// semantic is PER ENGAGEMENT. An MUA does three functions in one day and charges
// three makeups, not one day's fee — so the "overcharge" a per-date count would
// have prevented is, in this market, the CORRECT bill.
//
// The WORD follows the ARITHMETIC it describes. Saying "days" over a count of
// functions would be the app telling the vendor something untrue about its own
// number (F-04.114's law), so the line says functions because it counts
// functions.
export function suggestionLine(amountInr: number, functions: number, rateInr: number): string {
  return `Rs ${fmt(amountInr)} suggested — ${functions} functions at Rs ${fmt(rateInr)} each`;
}

/** Indian digit grouping, the estate's one presentation of a rupee figure. */
export function fmt(n: number): string {
  return Number(n).toLocaleString('en-IN');
}

/**
 * The wedding's name for the screen.
 *
 * The WIRE ships null for a wedding whose binder cannot be named (the engine hop
 * is decoration and fails soft). The SCREEN needs a word. That translation
 * happens here, once, so the board and the picker cannot disagree about what an
 * unnamed wedding is called.
 */
export function weddingLabel(title: string | null | undefined): string {
  return title && title.trim() !== '' ? title : UNTITLED_WEDDING;
}

// ── THE STUB'S LOGIC ────────────────────────────────────────────────────────

export interface SettleDraft {
  /** The counterparty's team_members id. NOT NULL at the DB — no id, no payout. */
  teamMemberId: string | null;
  /** Rupees, as typed. Empty until the vendor types — there is no quote source. */
  amount: string;
  /** The function the vendor PICKED. Null is lawful and means the loose lane. */
  linkedEventId: string | null;
  description: string;
  /** `collab:<post_id>` when the stub was opened from a connection. */
  notes: string | null;
}

export interface SettleResult { ok: boolean; error?: string }

export interface SettleDeps {
  /** The REAL logPayment (lib/vendor/api/vendor). Structural. */
  log: (body: {
    team_member_id: string; amount_inr: number; description?: string;
    linked_event_id?: string; notes?: string;
  }) => Promise<{ ok: boolean; error?: string } | { ok: boolean }>;
  onResult: (message: string, kind: 'success' | 'error') => void;
  onDone: () => void;
}

export const SETTLE_SUCCESS_MSG = 'Payment logged';
export const SETTLE_ERROR_MSG   = 'Could not log the payment. Try again.';

/** The collab thread's marker. Acceptance item 7 greps for exactly this shape. */
export function collabNote(postId: string): string {
  return `collab:${postId}`;
}

/**
 * Is this draft loggable? The gate is the DB's own NOT NULL plus a positive
 * amount — the two things the server would refuse anyway, asked here so the
 * button can be honest about being disabled instead of failing on tap.
 *
 * A MISSING FUNCTION IS NOT A BLOCKER. Per the ruling (C1+C2), no pick is a
 * lawful answer: the payout lands in the loose lane, labelled. The vendor is
 * never forced to invent a wedding to record money he actually owes.
 */
export function canSettle(d: SettleDraft): boolean {
  return !!d.teamMemberId && Number(d.amount) > 0;
}

/**
 * Log one settlement.
 *
 * SUGGEST-NEVER-COMMIT lives at the call site, not here: this function writes
 * only what it is handed. Whatever the suggestion proposed, the number that
 * travels is the number in the field the vendor could edit.
 */
export async function settle(draft: SettleDraft, deps: SettleDeps): Promise<boolean> {
  if (!canSettle(draft)) return false;
  try {
    const res = await deps.log({
      team_member_id:  draft.teamMemberId as string,
      amount_inr:      Number(draft.amount),
      description:     draft.description.trim() || undefined,
      linked_event_id: draft.linkedEventId || undefined,
      notes:           draft.notes || undefined,
    });
    if (!res || !res.ok) {
      deps.onResult(SETTLE_ERROR_MSG, 'error');
      return false;
    }
    deps.onResult(SETTLE_SUCCESS_MSG, 'success');
    deps.onDone();
    return true;
  } catch {
    deps.onResult(SETTLE_ERROR_MSG, 'error');
    return false;
  }
}
