'use client';

// lib/frost/photoPager.ts
//
// TDW_07 P4b-FINAL · F1b, THIRD ARTIFACT — THE PHOTO CAROUSEL HAS ONE HOME.
//
// FOUNDER'S CONTRACT, 2026-07-31, which defines the preview and supersedes ruling (iii):
//   "the entire reason to have see what couples see is to give the vendors the preview of a
//    full bleed photo carousel, made up of their images… the right mechanics is full bleed
//    image — tapping reveals the card — tapping outside card area removes it."
//
// So the preview is not a still with a card on it. It is the deck's carousel, pointed at
// one vendor. That makes the paging mechanics shared property, and this file is where they
// live: the canvas card and the vendor's preview call the SAME hook over the SAME constants.
//
// ── WHY THIS FILE EXISTS AT ALL: THE DEFECT IT CLOSES ────────────────────────────────
// P4b extracted the overlay's CONTENT into VendorProfileView and proved, with identity
// cells, that both mounts render one component over one shaper. Every one of those cells
// was true. The preview still shipped broken, because the photo carousel was never inside
// the component — it lived one layer above, in the canvas's card layer, and the preview's
// mount silently re-created that layer as a static background.
//
// The executor's boundary was correct per its ledger and the result was still a parity
// break, because the question asked was "what does the overlay CONTAIN?" and the question
// that mattered was "what does the surface DO?". CE-116 ratified that as the control
// inventory law's SECOND CLAUSE, and this file is the first extraction performed under it.
//
// ── THE DECK'S VERBS, ENUMERATED BEFORE ANY BYTE MOVED (CE-116 clause 2) ─────────────
//   1. tap                          → toggle the card                  SHARED (both mounts)
//   2. double-tap                   → save to Muse, spawn heart        CANVAS ONLY
//   3. swipe horizontal             → next / previous PHOTO            SHARED (both mounts)
//   4. swipe up                     → next VENDOR                      CANVAS ONLY
//   5. swipe down                   → previous VENDOR                  CANVAS ONLY
//   6. swipe down while card shown  → dismiss the card                 SHARED (both mounts)
//   7. drag the sheet down          → dismiss the card                 CANVAS ONLY (its chrome)
//   8. swipe up in blind mode       → next blind item                  CANVAS ONLY
//
// FIVE OF EIGHT ARE DECK-ONLY AND STAY AT THE DECK. A vendor looking at his own profile has
// no next vendor, no Muse to save himself into, and no blind mode. Hauling those in would
// make this module a deck simulator with dead branches; leaving them out is the boundary,
// and the boundary is stated here so the next reader finds a decision rather than a gap.
//
// WHAT MOVED IS 1, 3 and 6 — the classification that decides WHICH verb a touch was, plus
// the photo cursor itself. The canvas keeps its dispatch and calls into this for the shared
// verbs; nothing about verbs 2, 4, 5, 7, 8 changed.
//
// ── THE GESTURE-STABILITY PROOF (chair-restated, since bytes must move) ──────────────
// The spec's §3 guardrail asks for byte-identical gesture mechanics through P1/P6. An
// extraction cannot leave bytes where they were, so the chair restated the law's object:
// what must not move is the COUPLE'S MECHANICS, not the byte positions. The proof is three
// parts and anything short of all three is not a proof:
//   (a) every gesture token and threshold value asserted IDENTICAL at this new home
//       — b07/tdw07 cells pin all six constants by value and the dispatch by behaviour
//   (b) the canvas's remaining chrome byte-diffed exactly as P3 and P4b did it
//   (c) the founder's deck walk as the affordance witness — a bench proves the numbers
//       survived, never that the deck still feels right under a thumb

import { useCallback, useState } from 'react';

// ── THE CONSTANTS, MOVED VERBATIM FROM THE CANVAS ────────────────────────────────────
// These are the couple's mechanics. Every value is byte-identical to what the deck carried
// at the P4b-FINAL charter tip; the canvas now imports them back rather than declaring its
// own, so a future tuning pass cannot move one mount's feel and leave the other behind.
export const SWIPE_THRESHOLD = 45;
export const SWIPE_VELOCITY  = 0.3;
export const TAP_MAX_MOVE    = 10;
export const TAP_MAX_TIME    = 250;
export const DOUBLE_TAP_MS   = 280;
export const OVERLAY_DISMISS = 80;

// The deck's haptic. Moved with the constants because a tap that buzzes on one mount and
// not the other is a difference in mechanics, not in decoration.
export const haptic = (ms: number) => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(ms); } catch { /* unsupported — silence is correct */ }
  }
};

export type Gesture =
  | { kind: 'tap' }
  | { kind: 'swipe'; axis: 'x' | 'y'; dir: -1 | 1 }
  | { kind: 'none' };

/**
 * WAS THIS TOUCH A TAP, A SWIPE, OR NEITHER?
 *
 * Lifted from the canvas's `onTouchEnd` with its comparisons preserved exactly:
 *   · a tap is small in BOTH axes and short in time
 *   · a swipe must beat EITHER the distance threshold OR the velocity threshold — the
 *     `<=` on both is the deck's own, so a slow short drag is still "none"
 *   · the dominant axis wins, and `absY > absX` is the deck's tie-break (a perfectly
 *     diagonal drag reads as horizontal, which is what the deck always did)
 *
 * `dir` is the sign of the movement: -1 is left/up, +1 is right/down.
 */
export function classifyGesture(dx: number, dy: number, dt: number): Gesture {
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);

  if (absX < TAP_MAX_MOVE && absY < TAP_MAX_MOVE && dt < TAP_MAX_TIME) {
    return { kind: 'tap' };
  }

  const velocity = Math.max(absX, absY) / Math.max(dt, 1);
  if (Math.max(absX, absY) <= SWIPE_THRESHOLD && velocity <= SWIPE_VELOCITY) {
    return { kind: 'none' };
  }

  if (absY > absX) return { kind: 'swipe', axis: 'y', dir: dy < 0 ? -1 : 1 };
  return { kind: 'swipe', axis: 'x', dir: dx < 0 ? -1 : 1 };
}

/**
 * Does this horizontal movement advance the carousel, and which way?
 *
 * THIS IS THE `:746` DISPATCH, verbatim in behaviour: `dx < -SWIPE_THRESHOLD` is next,
 * `dx > SWIPE_THRESHOLD` is previous, and anything between is nothing. Extracted as its own
 * function so both mounts obey one rule rather than two copies of one comparison.
 */
export function photoStepFor(dx: number): -1 | 0 | 1 {
  if (dx < -SWIPE_THRESHOLD) return 1;    // finger left → next photo
  if (dx >  SWIPE_THRESHOLD) return -1;   // finger right → previous photo
  return 0;
}

/**
 * THE PHOTO CURSOR — one implementation, both mounts.
 *
 * `dissolveKey` exists so the consumer can re-key its <img> and get the deck's cross-fade;
 * it increments on every successful move, exactly as the canvas incremented its own.
 *
 * BOUNDED, AND THE BOUND IS THE CALLER'S DATA. There is no cap here. The founder retired
 * the five-photo display rule ("couples should be able to see all approved photos on
 * discover"), so the carousel runs to `photoCount - 1` and the only ceiling is the
 * portfolio's own twenty. A cap asserted here would be the retired rule growing back in a
 * new house.
 */
export function usePhotoPager(photoCount: number) {
  const [imageIdx, setImageIdx]       = useState(0);
  const [dissolveKey, setDissolveKey] = useState(0);

  const nextImage = useCallback(() => {
    setImageIdx((i) => {
      if (i >= photoCount - 1) return i;      // at the end — the deck does not wrap
      setDissolveKey((k) => k + 1); haptic(4);
      return i + 1;
    });
  }, [photoCount]);

  const prevImage = useCallback(() => {
    setImageIdx((i) => {
      if (i <= 0) return i;                   // at the start — the deck does not wrap
      setDissolveKey((k) => k + 1); haptic(4);
      return i - 1;
    });
  }, []);

  // The deck resets the cursor when the vendor changes. The preview has one vendor and
  // never calls this, but it is the pager's own concern and belongs with the pager.
  const resetToFirst = useCallback(() => { setImageIdx(0); setDissolveKey((k) => k + 1); }, []);

  /** Apply a horizontal drag to the cursor. Returns whether it moved. */
  const applyHorizontalDrag = useCallback((dx: number) => {
    const step = photoStepFor(dx);
    if (step === 1)  { nextImage(); return true; }
    if (step === -1) { prevImage(); return true; }
    return false;
  }, [nextImage, prevImage]);

  return { imageIdx, setImageIdx, dissolveKey, setDissolveKey,
           nextImage, prevImage, resetToFirst, applyHorizontalDrag };
}
