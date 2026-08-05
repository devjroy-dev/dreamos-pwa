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
