// lib/cache/invalidate.ts
// Pub/sub slice invalidation for form-driven writes.
//
// Problem: the SSE done event with `refresh: true` triggers context refetch
// for chat-driven mutations. Form-driven writes (POST/PATCH/DELETE from UI)
// bypass chat, so they need their own invalidation signal.
//
// Usage:
//   After a successful write: invalidateSlice('leads')
//   Hooks subscribe on mount via subscribeToSlice().

export type Slice = 'leads' | 'clients' | 'invoices' | 'expenses' | 'events' | 'cabinet'; // 'cabinet' added TDW_03 P2 (raw-cabinet loader key)

type Listener = () => void;
const listeners = new Map<Slice, Set<Listener>>();

function getOrCreate(slice: Slice): Set<Listener> {
  if (!listeners.has(slice)) listeners.set(slice, new Set());
  return listeners.get(slice)!;
}

// TDW_04 A4.1 (F-04.20, founder-smoke-caught): the bus used to DROP an
// invalidation when no hook for that slice was mounted — exactly what happens
// when a deferred write commits AFTER navigation away (F-04.14's flush). The
// write landed; the notification died in an empty room; the returning screen
// served its stale cache and the vendor read it as a cancelled action. The bus
// now keeps a debt ledger: undeliverable invalidations are remembered, and the
// next mounting hook for that slice consumes the debt and refetches.
const dirty = new Set<Slice>();

/** Call after any successful POST / PATCH / DELETE for the given slice. */
export function invalidateSlice(slice: Slice): void {
  const subs = listeners.get(slice);
  if (!subs || subs.size === 0) { dirty.add(slice); return; }
  dirty.delete(slice);
  subs.forEach(fn => fn());
}

/** Consume the dirty flag for a slice — true means "a write landed while you
    weren't looking; refetch". Mounting hooks call this once. */
export function consumeDirty(slice: Slice): boolean {
  return dirty.delete(slice);
}

/** Invalidate all slices — e.g. after a bulk import. */
export function invalidateAll(): void {
  listeners.forEach(subs => subs.forEach(fn => fn()));
}

/**
 * Subscribe to invalidation events for a single slice.
 * Returns an unsubscribe function — call it in your useEffect cleanup.
 *
 * @example
 *   useEffect(() => subscribeToSlice('leads', refresh), [refresh]);
 */
export function subscribeToSlice(slice: Slice, listener: Listener): () => void {
  const subs = getOrCreate(slice);
  subs.add(listener);
  return () => subs.delete(listener);
}
