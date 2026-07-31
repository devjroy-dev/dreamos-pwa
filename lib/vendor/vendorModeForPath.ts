// lib/vendor/vendorModeForPath.ts
//
// TDW_07 MICRO-2 · F-07.30 — THE VENDOR SHELL HAS ONE PATH AUTHORITY.
//
// THE DEFECT THIS CLOSES. Three files independently answered "which panel does this path
// belong to?", and they did not agree:
//
//   app/vendor/layout.tsx::panelIndexForPath      prefix match   → correct
//   components/vendor/BottomNav.tsx::modeFromPathname  prefix match   → correct
//   components/vendor/Header.tsx  (inline)        ENUMERATED list → WRONG
//
// Header's list carried `/vendor/discover/leads`, `/vendor/discover` (exact) and
// `/vendor/discover/submit`, and nothing else. So `/vendor/discover/profile` fell through
// to `return 'studio'` and the vendor stood on his Discover Profile reading a STUDIO pill,
// while the swipe pager beneath him believed — correctly — that he was on the Discover
// panel. Founder-found on device, 2026-07-31.
//
// THE FINDING'S SHARPEST FORM, and the reason an allow-list was always going to rot:
// Header.tsx:195 renders a drawer item whose handler is
// `router.push('/vendor/discover/profile')`. THE SAME COMPONENT NAVIGATED TO A ROUTE ITS
// OWN CLASSIFIER DID NOT RECOGNISE. That is not two files drifting apart over time; it is
// one file disagreeing with itself, and no amount of care keeps a hand-maintained list in
// step with the routes a product grows.
//
// P4b then added a second casualty: `/vendor/discover/preview` was minted into a shell
// whose list nobody thought to extend, because the list is invisible from the route being
// added. That is the shape of the whole defect — the cost of an enumeration is paid by
// whoever ships next, not by whoever wrote it.
//
// ── THIS IS THE THIRD APPLICATION OF ONE PATTERN ──────────────────────────────────────
//   F4        one rate predicate      (rateMet)   — score, meter and gate had three copies
//   F-07.15   one completeness score  (server)    — CommandBar re-implemented it and drifted
//   F-07.30   one path classifier     (this file) — three copies, one wrong
// Every instance is the same disease: a question answered in more than one place drifts,
// and the copy that is not the authority is the one that lies.
//
// ── WHY A LEAF ────────────────────────────────────────────────────────────────────────
// This module imports nothing at runtime. `VendorMode` is a `import type`, erased at
// compile, so it adds no edge to the graph. That is deliberate and it is a lesson paid for
// in this block: F4's predicate was first sited inside `profileScore.js`, which closed a
// require cycle with `discover.js` and made the gate throw
// `profileScore.rateMet is not a function` under one load order. Header already imports
// BottomNav (for `ModePill`) and the layout already imports BottomNav; putting the
// classifier in any of the three would have threaded the shared function through the
// existing edges. A leaf cannot participate in a cycle.

import type { VendorMode } from '@/hooks/vendor/useVendorMode';

// The Discover panel's route prefixes. Adding a Discover surface means adding it HERE, in
// the one place, and every consumer — pill, bottom nav, and swipe pager — follows.
//
// PREFIX, NEVER EXACT. `/vendor/discover/profile`, `/vendor/discover/preview`,
// `/vendor/discover/submit`, `/vendor/discover/leads` and every future sub-route classify
// from their root without anyone remembering to enumerate them.
const DISCOVER_ROOTS = [
  '/vendor/discover',
  '/vendor/portfolio',
  '/vendor/couture',
  '/vendor/featured',
  '/vendor/collab',
] as const;

/**
 * The one classifier. Which of the three vendor panels does this path belong to?
 *
 * Kept byte-for-byte equivalent to the two PREFIX implementations it replaces
 * (layout.tsx::panelIndexForPath and BottomNav.tsx::modeFromPathname), so this change
 * moves no behaviour on any route those two already agreed about. What it moves is
 * Header, which was the outlier.
 */
export function vendorModeForPath(pathname: string): VendorMode {
  if (pathname === '/vendor' || pathname.startsWith('/vendor/auth')) return 'ai';
  if (DISCOVER_ROOTS.some((root) => pathname.startsWith(root))) return 'discover';
  return 'studio';   // calendar, list, more, settings, contracts, tds, studio
}

/**
 * The same answer as a panel index, for the horizontal pager.
 *
 * DERIVED FROM THE CLASSIFIER, never re-authored — the pager and the pill cannot disagree
 * about a route because there is only one decision and this is a projection of it.
 * Order is the shell's own: STUDIO(0) · AI(1) · DISCOVER(2).
 */
export function panelIndexForPath(pathname: string): number {
  const mode = vendorModeForPath(pathname);
  return mode === 'ai' ? 1 : mode === 'discover' ? 2 : 0;
}
