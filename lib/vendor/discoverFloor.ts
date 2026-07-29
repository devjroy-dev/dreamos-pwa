// lib/vendor/discoverFloor.ts — THE PHOTO FLOOR, ONE HOME ON THIS SIDE OF THE WIRE.
//
// TDW_07 P2 · CE ruling §F. Before this file the pwa held the number TWICE, on one
// screen, in two different notations:
//   · app/vendor/discover/page.tsx:176  a branch gate  `portfolioTotal < 5`
//   · app/vendor/discover/page.tsx:194  the WORD       "Upload at least five pieces"
// The 5→6 raise at src/lib/vendor/discover.js:6 would have left both saying five while
// the server rejected at six — a vendor told to do one thing and refused for doing it.
// That is the F-05.20 class (eleven independent fallbacks, one of them wrong) with the
// added cruelty that one of the copies was spelled out in English.
//
// TWO LAYERS, and only one of them is the authority:
//   1. THE MECHANISM — getDiscoverStatus now returns `min_portfolio_images`, read from
//      the enforcing constant itself. When the response carries it, it WINS. A number
//      the server sends is a number that cannot drift from the number the server
//      enforces, because they are the same object.
//   2. THE FALLBACK — the constant below, for a client running against a backend
//      deployed before that field existed. Cross-repo import is impossible, so this
//      comment IS the binding: if src/lib/vendor/discover.js:6 ever moves again, this
//      line moves with it. That is the honest form of comment-binding — a stated
//      fallback under a real mechanism, never a second source of truth.
export const DISCOVER_PHOTO_FLOOR = 6;

/**
 * The floor to render, preferring what the server said.
 * Callers pass the status response's `min_portfolio_images` (which may be undefined).
 */
export function photoFloor(fromServer?: number | null): number {
  return typeof fromServer === 'number' && fromServer > 0 ? fromServer : DISCOVER_PHOTO_FLOOR;
}
