'use client';
// lib/vendor/undo.ts — TDW_04 A2: optimistic-write + 30s undo (F2's cure).
//
// MECHANISM (documented executor choice, flagged in the sitting handover):
// DEFERRED-FIRE. The UI applies optimistically at once; the WRITE fires when
// the 30s window lapses (or when flushed early — page hide/unload/another
// pending action on the same row). UNDO cancels the pending write and reverts
// the optimistic UI. Chosen because reversal doors do not exist for every
// mutation (leads have no un-delete; invoices no un-pay) — deferred-fire is
// the only mechanism that makes UNDO honest on EVERY slice with zero new
// backend surface. Where a REAL reversal door exists (binder /unarchive),
// callers may commit immediately and wire undo to the door instead — the
// hide/unarchive pair does exactly that.
//
// F2's actual cure rides the commit: every committed write invalidates its
// slice through the bus (never a raw refetch), so the list refetches within a
// tick — the "no post-delete refetch" defect dies here.

import { invalidateSlice, type Slice } from '@/lib/vendor/cache/invalidate';

export const UNDO_WINDOW_MS = 30_000;

type Pending = {
  id: number;
  timer: ReturnType<typeof setTimeout>;
  commit: () => Promise<void>;
  revert: () => void;
  slice: Slice;
  committed: boolean;
};

const pendings = new Map<number, Pending>();
let seq = 0;

async function fire(p: Pending) {
  if (p.committed) return;
  p.committed = true;
  clearTimeout(p.timer);
  pendings.delete(p.id);
  try {
    await p.commit();
  } finally {
    // Bus, not raw fetch — F2's cure. Invalidate even on failure so the list
    // re-reads truth rather than trusting the optimistic state.
    invalidateSlice(p.slice);
  }
}

/** Queue a deferred write. Returns { undo } — call undo() inside the window to
    cancel the write and revert the UI. The optimistic apply is the CALLER's
    (done before calling — this manager owns timing, not rendering). */
export function queueUndoable(opts: {
  slice: Slice;
  commit: () => Promise<void>;
  revert: () => void;
  windowMs?: number;
}): { undo: () => void; flush: () => void } {
  const id = ++seq;
  const p: Pending = {
    id,
    slice: opts.slice,
    commit: opts.commit,
    revert: opts.revert,
    committed: false,
    timer: setTimeout(() => { void fire(p); }, opts.windowMs
      ?? ((typeof window !== 'undefined' && (window as unknown as { __UNDO_MS?: number }).__UNDO_MS) || UNDO_WINDOW_MS)), // __UNDO_MS: executor-pass seam — harness shortens the window to assert the deferred fire; absent in prod use
  };
  pendings.set(id, p);
  return {
    undo: () => {
      if (p.committed) return;
      clearTimeout(p.timer);
      pendings.delete(id);
      p.revert();
    },
    flush: () => { void fire(p); },
  };
}

/** Flush every pending write NOW (navigation away, page hide) — an undo window
    is a courtesy, never a data-loss vector. */
export function flushAllPending(): void {
  for (const p of Array.from(pendings.values())) void fire(p);
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flushAllPending);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushAllPending();
  });
}
