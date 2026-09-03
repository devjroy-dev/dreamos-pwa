// lib/worklist/feed.ts — DID THE FEED ANSWER? ONE HOME FOR THE ONE FACT.
//
// ── WHY THIS FILE EXISTS  [R-38.17 as amended at c-38.14] ───────────────────
//
// Today's masthead has one status slot and two vetoed bytes for it, and choosing between
// them is not a copy decision — it is a question about whether an instrument answered:
//
//   · the feed has NOT answered  ->  `todayNotLive`, and NO NUMERAL
//   · the feed answered with zero ->  `todayNothingYet`, with the numeral it returned
//
// The chair amended his own byte to get here (c-38.14). R-38.17 first put
// 「Nothing needs you yet.」 on the surface unconditionally, and the Phase 1 seat filed
// F-38.31: that sentence asserts an absence NOTHING HAS CHECKED. The same objection
// convicts the t0 numeral standing beside it — a `0` no instrument produced is the
// identical claim in digits.
//
// ── PHASE 4 · THE READ LANDED, AND THE SHAPE DID NOT CHANGE ─────────────────
// The Phase 1 body returned `{ responded: false, openItems: null }` and said, in its own
// comment, that Phase 4 would replace the body and nothing else. That held: `responded`
// and `openItems` keep their meanings exactly, `app/w/today/page.tsx`'s numeral gate is
// the same expression it was, and the only addition is `today` — the body itself, which
// the cards and the tile counts need and the masthead does not.
//
//   · `responded` is true ONLY on a 200 that carried a countable body. A network error,
//     a 401, a malformed body and `ok:false` all leave it FALSE, because each of those is
//      「no reading」 and the not-reading line is the honest thing to print for all of
//     them. Fail closed, the same direction app/w/layout.tsx's guard fails.
//   · `openItems` is the SUM OF `counts`' FIVE VALUES and nothing else (§3 property 2).
//     A real 0 is a real reading and is the state `todayNothingYet` exists for.
//
// ── ⚠ THE SUM IS COMPUTED HERE AND NOWHERE ELSE ─────────────────────────────
// §3 property 2 is explicit that NO TOTAL SHIPS on the wire: the endpoint stays ignorant
// of presentation arithmetic, and the client sums. That makes this function the one home
// for the numeral, and `sumCounts` is exported ONLY so the bench can mutate it and watch
// the masthead move. A second `reduce` over `counts` anywhere in the tree is a second
// home for the same figure and the b40 cell reddens on it.
//
// ── ⚠ ONE RESPONSE, TWO SURFACES  [R-37.63 ①] ───────────────────────────────
// Today's masthead and the Rooms tile counts must read THE SAME RESPONSE — not merely
// the same endpoint. Two mounts issuing two requests can be served two different bodies
// across a write, and the vendor then sees a tile saying 11 beside a feed holding 12.
// So the promise is memoised at module scope and both surfaces await the SAME object.
// `refreshToday()` is the only way to drop it, and it exists for the verbs: a card that
// writes must invalidate the reading it wrote against, or the surface keeps showing the
// state it just changed.
'use strict';

import { useEffect, useState } from 'react';
import { fetchWorklistToday } from '@/lib/vendor/api/vendor';
import type { AttentionKind, WorklistTodayResponse } from '@/lib/vendor/types/vendor';

export interface TodayFeed {
  /** True only when a reading actually came back. Never true by default, ever. */
  responded: boolean;
  /** The sum of `counts`' five values. `null` whenever `responded` is false — never coerced to 0. */
  openItems: number | null;
  /** The body, for the cards and the tile counts. `null` whenever `responded` is false. */
  today: WorklistTodayResponse | null;
}

const NO_READING: TodayFeed = { responded: false, openItems: null, today: null };

/**
 * THE MASTHEAD NUMERAL, DERIVED — §3 property 2.
 *
 * FIVE VALUES, AND THE BENCH MUTATES THIS FUNCTION TO PROVE IT. Summing four is the
 * defect this is factored out for: it is a one-character edit, it produces a plausible
 * smaller number, and no cell that only checked 「the numeral renders」 would catch it.
 */
export function sumCounts(counts: Record<AttentionKind, number> | null | undefined): number {
  if (!counts) return 0;
  return (counts.lead_unanswered ?? 0)
       + (counts.invoice_due ?? 0)
       + (counts.events_today ?? 0)
       + (counts.contract_unsigned ?? 0)
       + (counts.team_tasks ?? 0);
}

/**
 * IS THE BODY A READING? Shape-checked before it is believed.
 *
 * A 200 carrying `{ok:false}` or a body missing `counts` is NOT a reading, and calling it
 * one would put a numeral on the masthead built from `undefined ?? 0` — a zero no
 * instrument produced, which is F-38.31 arriving by a different road.
 */
function isReading(b: unknown): b is WorklistTodayResponse {
  const r = b as WorklistTodayResponse | null;
  return !!r && r.ok === true
    && typeof r.has_any === 'boolean'
    && !!r.counts && !!r.needs_attention && !!r.done_today;
}

let pending: Promise<TodayFeed> | null = null;

// ── F-39.56 · THE INVALIDATION HAS TO REACH A MOUNTED SURFACE ───────────────
// CE-39 2c wired `refreshToday()` to navigation and to focus, and it was right about
// the door. It was not enough. `useTodayFeed` read the memo in a `useEffect` with an
// EMPTY dependency array, so it read once per MOUNT and never again — and dropping
// `pending` under a hook that is never going to look at it again changes nothing a
// vendor can see. MEASURED at CE-39 smalls A: twenty tab-returns to `/w/today`,
// ZERO fetches. The door opened onto a surface that had stopped listening.
//
// So invalidation is now something a mounted hook can HEAR. `version` counts drops;
// `listeners` is who to tell. The hook subscribes for its lifetime and re-reads when
// the count moves.
//
// ── WHY A COUNTER AND A SET, RATHER THAN THE HOOK POLLING ──────────────────
// A hook that re-read on an interval would fetch for vendors who are doing nothing,
// and one that re-read on every render would fetch in a loop. The count changes
// exactly when the memo is dropped — which is exactly when a re-read is owed — and
// N mounted subscribers awaiting one dropped memo produce ONE request, because
// `readToday()` re-memoises on the first call and the rest await that same promise.
// The one-response-two-surfaces law (R-37.63 ①) therefore survives the cure intact.
//
// `readAt` is when the current reading SETTLED, and it exists for the staleness gate
// below. It is set on resolve rather than on request so an in-flight read is never
// mistaken for a fresh one.
let version = 0;
let readAt = 0;
const listeners = new Set<() => void>();

/** Subscribe to invalidations. Returns the unsubscribe. Exported for the hook only. */
export function subscribeToday(fn: () => void): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

/** The invalidation counter. Exported so a bench can witness it without a fetch. */
export function todayVersion(): number { return version; }

/** THE ONE READ. Both surfaces await this same promise, so both see one body. */
export function readToday(): Promise<TodayFeed> {
  if (!pending) {
    pending = fetchWorklistToday()
      .then((body) => (isReading(body)
        ? { responded: true, openItems: sumCounts(body.counts), today: body }
        : NO_READING))
      // FAIL CLOSED. Every failure mode collapses to 「no reading」, which is the state
      // `todayNotLive` exists for. A caught error must never become a zero.
      .catch(() => NO_READING);
    // F-39.56 · stamped on SETTLE, not on request — an in-flight read is not a fresh
    // one, and a focus arriving mid-flight must not be told the reading is young.
    // Stamped on the failure path too: a fail-closed reading is still a reading that
    // just happened, and re-asking every 30s because the last one failed is a retry
    // loop nobody designed.
    pending.then(() => { readAt = Date.now(); });
  }
  return pending;
}

/**
 * Drop the memoised reading. THE ONE DOOR, and until CE-39 2c it had no callers.
 *
 * ── F-39.26 · THE DOOR WAS BUILT AND NEVER WIRED ────────────────────────────
 * Its previous line read 「The verbs call this after a write commits」 — in the
 * present tense, about something no verb did. A sweep of both repos found ZERO
 * callers. `pending` is module-scope, so a fresh mount of `useTodayFeed` awaits
 * the SAME settled promise and the vendor sees the state she just changed.
 *
 * A doc comment in the present tense about behaviour that does not exist is the
 * hardest kind of stale ink to catch, because it reads as a description and
 * functions as a promise. Recorded rather than quietly corrected.
 *
 * ── THE TWO CALLERS IT HAS NOW, AND WHY THEY ARE THE SAME DOOR ──────────────
 *   · `components/worklist/WorklistShell.tsx` — on every shell navigation and
 *     on return-to-focus. Covers the whole surface without any verb knowing the
 *     feed exists.
 *   · the money verbs in `lib/vendor/api/vendor.ts`, after a write commits.
 *     Covers the case navigation does not: a write and a read on ONE route.
 *
 * NO VERB-SPECIFIC HACK. Both call THIS function; the memo has one way in and
 * one way out. The alternative — each verb patching the cached body — is two
 * derivations of one reading, which is the disease this memo was built to cure.
 */
export function refreshToday(opts?: { ifOlderThan?: number }): void {
  // ── F-39.56 · THE STALENESS GATE, AND WHO IT IS FOR ────────────────────────
  // `ifOlderThan` is for FOCUS and for nothing else. A vendor who alt-tabs four times
  // in ten seconds has changed nothing, and now that invalidation actually reaches a
  // mounted surface, an ungated focus arm would turn each of those returns into a
  // request. Ruled: refetch on focus only if the reading is older than 30s.
  //
  // THE MONEY VERBS PASS NO OPTIONS AND MUST NOT. Their write is precisely the event
  // a threshold cannot know about — a reading two seconds old is WRONG the moment an
  // invoice is paid against it. Unconditional is the correct behaviour there, and it
  // is the default, so a caller gets it by writing nothing.
  if (opts?.ifOlderThan != null && readAt > 0 && Date.now() - readAt < opts.ifOlderThan) return;
  pending = null;
  version += 1;
  // A listener that throws must not stop the others hearing. The memo is already
  // dropped by this line, so the worst case is a surface that misses one notification
  // and re-reads on its next.
  for (const fn of listeners) { try { fn(); } catch { /* one deaf surface, not all */ } }
}

/**
 * THE ONE SITE THAT ANSWERS 「has Today read anything?」.
 *
 * A HOOK NOW, AS lib/worklist/feed.ts's own Phase 1 comment said it would become. It
 * starts at `NO_READING` on every mount, which is not a placeholder: before the request
 * settles, nothing HAS been read, and that is exactly what the masthead should say.
 */
export function useTodayFeed(): TodayFeed {
  const [feed, setFeed] = useState<TodayFeed>(NO_READING);
  useEffect(() => {
    let live = true;
    const read = () => { readToday().then((f) => { if (live) setFeed(f); }); };
    read();
    // F-39.56 · THE SUBSCRIPTION IS THE CURE. Without it this effect's empty
    // dependency array means one read per mount, forever, and every `refreshToday()`
    // drops a memo that nothing left alive is going to ask for again.
    // NO RE-PRIME: the listener calls the SAME `readToday()` the mount called, so
    // there is one way into the memo and the hook holds no second copy of the reading.
    const off = subscribeToday(read);
    return () => { live = false; off(); };
  }, []);
  return feed;
}
