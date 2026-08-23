'use client';
// lib/frost/FrostCtx.tsx
//
// ═════════════════════════════════════════════════════════════════════════════
// WHY THIS FILE EXISTS: A LAYOUT MAY ONLY EXPORT WHAT NEXT SAYS IT MAY
// ═════════════════════════════════════════════════════════════════════════════
// `app/(frost)/layout.tsx` held three exports besides its default — the
// `FrostModeCtx` interface, and `useFrostMode`. Next 16 validates the export
// surface of a `layout.tsx` and refuses anything outside its permitted set:
//
//     Type error: Layout "app/(frost)/layout.tsx" does not match the required
//     types of a Next.js Layout. "useFrostMode" is not a valid Layout export field.
//
// THE EXPORT IS OLD (b004d2c, ARC OB). THE BUILD FAILURE IS NEW, and the two
// facts are not the same fact — which is the whole lesson of this rider.
//
// ── HOW IT WAS ARMED, recorded because I got it wrong first ──────────────────
// My first reading was that `ce86164`'s move to Next 16 + `--webpack` surfaced a
// latent defect, and that ANY build after it would have failed. THE CHAIR
// BISECTED AND THAT ARM IS DEAD: four cold builds with a font harness showed
// `a534329` GREEN, the tip RED, and a SliceRow-only revert GREEN.
//
// THE ACTUAL TRIGGER: TDW_16 R2 gave `components/vendor/slices/SliceRow.tsx` an
// import of `istDayKey` from `lib/frost/tokens` — R-35.23's one IST home, ruled
// and correct. `app/(frost)/layout.tsx:13` imports that SAME module. The new
// edge couples the vendor graph to the frost layout, and the coupling is what
// wakes the layout validator on an export that had been sleeping since ARC OB.
//
// So: the invalid export is old ink, and this delivery armed it. Both halves are
// true and neither excuses the other. UN-COUPLING WAS REFUSED BY NAME — the IST
// import stays exactly as ruled, because a second IST semantic in the vendor
// lane would be a real defect traded for a build-order accident.
//
// ── WHAT THIS FILE DOES AND DOES NOT DO ──────────────────────────────────────
// MODULE EXTRACTION ONLY. Zero copy, zero behaviour delta. The context, its
// default value and the hook move here byte-for-byte, with their reasoning; the
// layout keeps its default export and nothing else, and imports what it needs.
// Six consumers repoint their import path and not one line of their logic.

import { createContext, useContext } from 'react';
import { HomeModeKey, ContentMode, ModeDescriptor, MuseLook, MODES } from './tokens';

export interface FrostModeCtx {
  homeMode:       HomeModeKey;
  contentMode:    ContentMode;
  mode:           ModeDescriptor;
  look:           MuseLook;
  setHomeMode:    (m: HomeModeKey) => void;
  setContentMode: (c: ContentMode) => void;
}

// ── F-09.160 · THE FIFTH SEAT OF THE SINGLE-THEME RULING (TDW_09 atelier) ──────
// MOVED HERE VERBATIM WITH ITS DEFAULT. The Wine-only ruling pinned four seats,
// all in lib/frost/tokens.ts: getV2Tokens, museLookFromHomeMode, getFrostMode,
// setFrostMode. THIS default was the fifth and it was left reading 'E3' — the
// LIGHT theme. It is inert while the provider wraps every consumer, which it
// does today. It is also byte-for-byte the shape of the defect the ruling's
// second seat cured: a light literal sitting upstream of a pinned reader,
// waiting for the one render that does not reach the provider.
// Pinned to Wine, deliberately NOT deleted — the context still needs a default,
// and a default that disagrees with the ruling is a trap with a fuse in it.
export const FrostCtx = createContext<FrostModeCtx>({
  homeMode:       'E1A',
  contentMode:    'dream',
  mode:           MODES['E1A'],
  look:           'E1',
  setHomeMode:    () => {},
  setContentMode: () => {},
});

export const useFrostMode = () => useContext(FrostCtx);
