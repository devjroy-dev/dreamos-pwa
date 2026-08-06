// lib/vendor/controls.ts — control affordances that must not be re-invented per surface.
//
// TDW_09 · F-09.33 · R-S4 — THE DROPDOWN THAT DID NOT LOOK LIKE ONE.
// `appearance:'none'` on a native <select> strips the platform chevron and puts
// NOTHING in its place. Inside a box that was itself invisible on Editorial Paper
// (F-09.32/F-09.34) the result was a control with no affordance that it was a
// control: the founder's walk read the Role field as a line of text.
//
// The ruling is STYLED-NATIVE, not a bespoke picker: the OS picker is the correct
// mobile affordance, the nine <option> labels survive byte-identical, and no new
// gesture is minted on a surface whose own comment records "zero new gestures".
//
// THE CHEVRON IS DRAWN, NOT FONT-BASED. An inline SVG data-URI renders identically
// wherever the sheet renders and needs no icon package on a path that has none.
// It is stroked in `currentColor` so it INHERITS the field's ink and therefore
// themes for free — a chevron hardcoded to a colour would be the very species this
// sitting exists to end.
//
// MECHANISM (F-06.85's law): the padding-right below reserves room for the glyph at
// the geometry set here. If the chevron's box changes, that padding is re-derived.

import type { CSSProperties } from 'react';

const CHEVRON_BOX = 34; // px of right padding reserved for the glyph
const CHEVRON = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none">' +
    '<path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>' +
  '</svg>',
);

/**
 * Give a native <select> back its affordance without giving up the OS picker.
 * Pass the surface's own field style; the returned object keeps every byte of it
 * and adds only the glyph, the room for it, and the pointer.
 */
export function selectStyle(base: CSSProperties): CSSProperties {
  return {
    ...base,
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    cursor: 'pointer',
    paddingRight: CHEVRON_BOX,
    backgroundImage: `url("data:image/svg+xml,${CHEVRON}")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: `right 13px center`,
  };
}

// ═══ TDW_09 · PACKAGE 1 · B-2 — THE INTERACTION PRIMITIVES (staged, carrier named) ═══
//
// STAGED API WITH A NAMED CARRIER — NOT wire-or-delete's class, and the
// distinction is stated per the P-1(a) ruling: F-09.80's law targets an exported
// CHECK with no caller at its own delivery (a guard that guards nothing). These
// three are FOUNDATIONS chartered to land consumer-zero by S1 §5's own
// sequencing (additive, screenshot-identical), with their ADOPTER NAMED IN THIS
// COMMENT per the CE-201 named-carrier law:
//
//   CARRIER: PACKAGE 2 — the five-doors nav remap sitting. Its charter folds
//   S6 Tier-1 №1: pressedStyle onto the 29 tap-highlight-suppression sites first
//   (F-09.21), touchBox44 onto the vendor chat chips first (F-09.22), rowBaseline
//   onto the F-09.16 mirror sites per F-3(b) with R-X24's re-shot numbers as
//   acceptance. If P2's charter drops any primitive, its retirement is a NAMED
//   LINE in that sitting's delivery, never a silent orphan — the carrier inherits
//   the corpse duty with the API (the P-1 rider, chair-ruled).
//
// Consuming any of these in Package 1 would be a rendered delta on a sitting
// whose bar is ZERO VISUAL CHANGE; the deltas are lawful only under their filed
// findings, which is exactly what P2's charter carries.

/** F-09.21's cure shape — the pressed acknowledgment (spec P6's own numbers:
 *  scale .98, 80ms). MECHANISM (F-06.85): the estate suppressed the native tap
 *  flash at 29 sites (`WebkitTapHighlightColor: 'transparent'`) and replaced it
 *  with a pressed state in 9 of 148 interactive files — the founder's
 *  「 insensitive 」 is the missing acknowledgment, not latency. The transform
 *  arm is DROPPED under `prefers-reduced-motion`; the opacity arm stays, because
 *  reduced motion is not a request for zero feedback. */
export function pressedStyle(pressed: boolean, reducedMotion: boolean): CSSProperties {
  if (!pressed) return {};
  return reducedMotion
    ? { opacity: 0.82, transition: 'opacity 80ms ease-out' }
    : { transform: 'scale(0.98)', opacity: 0.9, transition: 'transform 80ms ease-out, opacity 80ms ease-out' };
}

/** F-09.22's cure shape — the 44px minimum touch box WITHOUT moving a visible
 *  pixel: transparent padding grows the hit area while the visual height stays
 *  the surface's own (the standard cure that preserves the aesthetic; the worst
 *  verified offenders are the vendor chat's 30–32px suggestion chips).
 *  `visualHeight` is the control's current rendered height; the returned padding
 *  splits the deficit across top and bottom. At or above the floor it returns {}
 *  — adopting this on a compliant control is a no-op by construction. */
export const TOUCH_FLOOR = 44; // px — the 44pt/48dp class floor, F-09.22
export function touchBox44(visualHeight: number): CSSProperties {
  if (visualHeight >= TOUCH_FLOOR) return {};
  const pad = (TOUCH_FLOOR - visualHeight) / 2;
  return { paddingTop: pad, paddingBottom: pad, marginTop: -pad, marginBottom: -pad, boxSizing: 'content-box' };
}

/** R-X24's Row primitive — F-09.16's cure shape, magnitude-independent by
 *  construction: same-line text rows align on BASELINE (never center), every
 *  text node takes the shared line-height (1.5) so line-boxes agree, and glyphs/
 *  emoji sit in FIXED SQUARE SLOTS (rowGlyphSlot) instead of participating in
 *  text alignment. Acceptance when adopted = the founder's re-shot rows with the
 *  small text ON the line (R-X24's measured 5–6px and 1px specimens are the
 *  before-numbers). */
export function rowBaseline(): CSSProperties {
  return { display: 'flex', alignItems: 'baseline', lineHeight: 1.5 };
}
export function rowGlyphSlot(size: number): CSSProperties {
  return { display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
           width: size, height: size, flex: 'none', alignSelf: 'center' };
}
