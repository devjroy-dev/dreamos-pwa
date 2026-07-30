// lib/vendor/reorder.ts
// TDW_07 P3 · Cure B's ordering arithmetic, extracted so it can be PROVEN rather
// than shape-asserted. The doctrine this sitting minted: when an interaction
// cannot be witnessed from the build container, the surface ships a deterministic
// equivalent that CAN be proven by cells. A pure function is the provable part —
// no DOM, no pointer, no device. The harness exercises it exhaustively.
//
// RN-portable by construction: pure array arithmetic, no browser API.

/**
 * Move the item at `from` by `delta` places, returning a NEW array.
 * Out-of-range moves return the input UNCHANGED — refusing at the ends is the
 * same fail-closed posture the server takes on an incomplete id list, and it is
 * why the buttons disable rather than silently no-op on a valid-looking tap.
 */
export function moveIndex<T>(items: T[], from: number, delta: number): T[] {
  const to = from + delta;
  if (from < 0 || from >= items.length) return items;
  if (to   < 0 || to   >= items.length) return items;
  const next = items.slice();
  next.splice(to, 0, next.splice(from, 1)[0]);
  return next;
}

/** True when a move in this direction is legal — the buttons' disabled state. */
export function canMove(length: number, index: number, delta: number): boolean {
  const to = index + delta;
  return index >= 0 && index < length && to >= 0 && to < length;
}
