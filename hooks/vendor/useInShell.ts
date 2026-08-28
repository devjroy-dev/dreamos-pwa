'use client';
// hooks/vendor/useInShell.ts — ONE DERIVATION OF "AM I INSIDE THE SHELL?", ONE HOME.
//
// ── M-FINISH S2 · §4-3 · WHY IT MOVED, AND WHY IT IS A MOVE AND NOT A FORK ──
// This hook was authored at S2 §4-1 inside `components/vendor/slices/SliceShell.tsx`,
// because at that moment the list family was the only thing that needed it. Storefront,
// Portfolio and Couture need it now — every crossed room is mounted from TWO route trees
// and every one of them has chrome that belongs to exactly one of them — and NONE of the
// three is in the slice family.
//
// ⚠ IMPORTING IT FROM `SliceShell.tsx` WOULD HAVE BEEN THE S2 DEFECT WITH THE NAMES
// CHANGED. That file defines `SliceShell`, `SliceDoor`, `SliceRow`'s neighbours and imports
// `DetailSheet`; a named import reaches the whole module, and whether the bundler then
// drops the rest is a question about the bundler, not a guarantee this estate holds. S2
// paid to learn that a surface's bundle is not what the source looks like it should be
// (`{chrome && <Header/>}` rendered correctly and still shipped the old masthead into six
// rooms). A three-line hook with one dependency does not get to drag a room's whole
// neighbouring family in behind it on a hope about tree-shaking.
//
// ⚠ AND IT DOES NOT GO IN `lib/worklist/`, WHICH IS THE OBVIOUS WRONG ANSWER. That
// directory is branch-side; `SliceShell.tsx` is main-side and still calls this. A main-side
// component reading a branch-side module is the direction D-2 forbids, and it is the same
// reason `copy.ts` was NOT made the one home for the six door labels at S2 §4-1. `hooks/
// vendor/` is main-side, so both trees may read it and neither inverts.
//
// ── IT IS DERIVED FROM THE ROUTE, NOT PASSED ────────────────────────────────
// The route IS the authority on which tree mounted this component; a prop is a second
// statement of the same fact and can disagree with it. D-38.1 is why the cells assert what
// the surface DOES at each route rather than whether a prop was spelled correctly.
import { usePathname } from 'next/navigation';

export function useInShell(): boolean {
  const pathname = usePathname();
  return !!pathname && pathname.startsWith('/w/');
}
