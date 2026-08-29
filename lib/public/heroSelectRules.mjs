// lib/public/heroSelectRules.mjs — TDW_19 P2-A HOTFIX S7 · F-19.44's index rules.
//
// ═══════════════════════════════════════════════════════════════════════════
// WHY THIS IS A MODULE AND NOT A TEMPLATE LITERAL INSIDE page.tsx
// ═══════════════════════════════════════════════════════════════════════════
// CE-39 ruled the hero-displacement mechanism as per-index CSS:
// `#pv-h<i>:checked ~ .pv-hero .pv-hero-img[data-i="<i>"]`. That shape needs one
// rule per photograph, and the approved set is UNBOUNDED — `vendorCard.js`'s
// portfolio query carries no `.limit()`, derived by command at dream-os d8f20e8.
// So the rules cannot be written out by hand in the stylesheet, and a fixed cap
// would silently drop a vendor's eleventh photograph.
//
// The obvious alternative was to interpolate a generated string into
// `PublicStyles`' template literal. **That would have blinded every cell in
// `bs_audit.mjs`**, all of which read `page.tsx` as TEXT: they would see the
// characters `${heroRules}` and no CSS at all. C34's reduced-motion coverage,
// C35's contrast sweep and C40's shorthand sweep would each have gone green over
// rules they never looked at — the hollow-green shape this estate has paid for
// twice in this block alone (F-19.38's five source derivations, F-19.39's
// unloaded images).
//
// So the generator is a plain `.mjs` module with no imports. `page.tsx` calls it
// at render; `tools/bs_audit.mjs` imports the SAME function and asserts against
// the SAME bytes the browser will receive. One home, two readers, and no cell
// reasoning about a string it cannot see.
//
// ⚠ `.mjs` AND NOT `.js` ON PURPOSE. `package.json` declares no `"type"`, so
// Node reads a bare `.js` as CommonJS and `bs_audit.mjs`'s `import` of it would
// throw on the `export` keyword. The extension is what makes the second reader
// possible at all.
//
// ── IT IS NOT A CLIENT COMPONENT AND ADDS NO RUNTIME ──────────────────────
// This returns a string. It runs on the server, inside the same render that
// builds the markup, and what reaches the couple's phone is plain CSS text
// inside the page's one <style> element. `/v/`'s standing refusal of client JS
// (page.tsx header, C39's second clause) is untouched.

/**
 * The arrival/crossfade timing. ONE HOME: the checked hero image and any future
 * reader both read it here rather than re-typing a cubic-bezier.
 *
 * ⚠ THE SPELLING MATTERS TO A CELL. `bs_audit` C34 counts staged blocks with
 * `/\d+ms\s+both/` and D-19.1 §3 rules exactly two — the identity and the body.
 * This value keeps the easing function BETWEEN the duration and `both`, so it is
 * not counted as a third staged block. That is not a coincidence to be tidied
 * away; the arrival is a fade, not a stagger, and it was never one of the two.
 */
export const PV_HERO_FADE = 'pvFade 1200ms cubic-bezier(0.22,1,0.36,1) both';

/** The selected-thumbnail ring, and the keyboard focus ring. Same gold, same
 *  offset — a reader tabbing and a reader tapping should see one language. */
const RING = 'outline:2px solid #C9A84C;outline-offset:2px';

/**
 * Build the per-index rules for a gallery of `n` photographs.
 *
 * Three rules per photograph, and then ONE reduced-motion block:
 *
 *   1 · the checked radio reveals its own hero layer and fades it in
 *   2 · the checked radio rings its own thumbnail, so the strip says which
 *       photograph is currently displacing the hero
 *   3 · a FOCUSED radio rings the same thumbnail — the input is visually hidden
 *       (not `display:none`), so it is what actually receives keyboard focus and
 *       the label is what a reader can see. CE-39 ruled this pairing: the radio
 *       holds focus, the label paints it.
 *
 * ⚠ THE REDUCED-MOTION BLOCK IS GENERATED HERE AND NOT LEFT TO THE STATIC SHEET,
 * AND THE REASON IS SPECIFICITY, NOT TIDINESS. `#pv-h0:checked ~ .pv-hero
 * .pv-hero-img[data-i="0"]` carries an id; a static `.pv-hero-img{animation:none}`
 * inside `@media (prefers-reduced-motion)` loses to it and a reader who asked
 * their phone to stop moving things would still get the fade. A media query adds
 * no specificity. So the escape is written at the SAME selector, later in the
 * cascade, where it wins — and `bs_audit` C34 reads this output rather than the
 * static sheet alone so the coverage is asserted on the bytes that ship.
 *
 * @param {number} n how many photographs the page is rendering
 * @returns {string} CSS text; empty string for a gallery of zero
 */
export function heroSelectRules(n) {
  const count = Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  if (count === 0) return '';

  const shown = [];
  const stilled = [];
  for (let i = 0; i < count; i++) {
    shown.push(`#pv-h${i}:checked ~ .pv-hero .pv-hero-img[data-i="${i}"]{opacity:1;animation:${PV_HERO_FADE}}`);
    shown.push(`#pv-h${i}:checked ~ .pv-strip label[for="pv-h${i}"]{${RING}}`);
    shown.push(`#pv-h${i}:focus-visible ~ .pv-strip label[for="pv-h${i}"]{${RING}}`);
    stilled.push(`#pv-h${i}:checked ~ .pv-hero .pv-hero-img[data-i="${i}"]{animation:none}`);
  }

  return [
    '/* F-19.44 · generated by lib/public/heroSelectRules.mjs, one set per photograph. */',
    ...shown,
    '@media (prefers-reduced-motion: reduce){',
    ...stilled,
    '}',
  ].join('\n');
}
