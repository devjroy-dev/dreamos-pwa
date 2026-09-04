// scripts/lib/stripComments.cjs
// ═══════════════════════════════════════════════════════════════════════════════
// A DECLARED MIRROR OF `scripts/lib/stripComments.mjs` — NOT A SECOND HOME.
// ═══════════════════════════════════════════════════════════════════════════════
//
// THE SOURCE IS THE `.mjs`. This file exists for ONE reason and it is not a
// mechanism reason: `scripts/b40_worklist_shell_bench.js` is CommonJS and cannot
// `require` an ES module synchronously, and its cells are synchronous. The FORK
// IS THE MODULE SYSTEM, NEVER THE RULE. The scan below is `stripComments.mjs`'s
// own body, unedited but for the `export` keyword.
//
// ⚠ THE NEXT PERSON WHO EDITS THE SCAN EDITS THE `.mjs` FIRST AND COPIES HERE.
//   Editing this file alone does not change what the estate strips; it only
//   makes the two disagree, which is the whole disease F-07.74 cured.
//
// ── WHY IT WAS MINTED (CE-39 · 2c-Studio · arm (ii), founder-ruled) ──────────
// F-39.39: a `//` line comment in `app/vendor/studio/team/page.tsx` containing
// `/crew/*` was read by b40's OWN stripper as a block-comment opener. It paired
// with the next real `*/` seventy-four lines later and swallowed the `<Header/>`
// mount, the loading arm, the empty arm and the member list. C58 — the pwa half
// of R-39.7, a FOUNDER ruling — went green over a restored Prestige gate placed
// inside that window; the same gate outside it reddened. The census in
// `INTERIM_VENDOR_MOUNTS` counted the stripped file and recorded zero mounts on
// a page that carries one.
//
// b40 was carrying `.replace(/\/\*[\s\S]*?\*\//g, '')` — which is exactly
// `NAIVE_RETIRED`, the rule the `.mjs` exports for VACUITY TWINS and for nothing
// else. That regex is DELETED at b40, not amended: a rule the home publishes in
// order to condemn does not get a second life as a fallback.
//
// c-39.49 (chair, on the record): b41's `lineStrip` was named as the cure while
// this home already existed and already cured the specimen. `lineStrip` is
// itself the second hand-rolled stripper, minted under the same CJS pressure.
// It is NOT touched by this delivery — b41 stays as it is and comes out of the
// nineteen-reader debt class with its own sitting.
//
// ── THE PIN ─────────────────────────────────────────────────────────────────
// `scripts/tdw_f0774_stripper.proof.mjs` §SIB pinned two members — this repo's
// `.mjs` and dream-os `scripts/lib/stripComments.js`. THIS FILE JOINS IT as the
// third, and the invocation canary (F-07.99) covers it: a ported-but-uncalled
// mirror is the exact failure that regime exists to catch, and F-07.52 already
// proved it can fool the estate for a whole block.
//
// ── THE TWO KNOWN HOLES TRAVEL WITH THE RULE ────────────────────────────────
// H1 (JSX text apostrophes, under-strips) and H2 (regex literals, over-strips)
// are the `.mjs`'s own declared limits and are inherited here unchanged. They
// close only with a real lexer; the compiler-based census instrument beside the
// `.mjs` re-adjudicates the class on demand. Inheriting a NAMED hole is the
// point of a mirror — inventing a different one would be the defect.
// ═══════════════════════════════════════════════════════════════════════════════

'use strict';

function stripComments(src) {
  let out = '';
  let i = 0, inBlock = false, inLine = false, inStr = null;
  while (i < src.length) {
    const c = src[i], n = src[i + 1];
    if (inLine) { if (c === '\n') { inLine = false; out += c; } i++; continue; }
    if (inBlock) { if (c === '*' && n === '/') { inBlock = false; i += 2; } else { if (c === '\n') out += c; i++; } continue; }
    if (inStr) { if (c === '\\') { out += c + (n || ''); i += 2; continue; } if (c === inStr) inStr = null; out += c; i++; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = c; out += c; i++; continue; }
    if (c === '/' && n === '/') { inLine = true; i += 2; continue; }
    if (c === '/' && n === '*') {
      const prev = out.replace(/[ \t]+$/, '').slice(-1);
      if (prev === '' || '(){};,=:+&|?!\n[<'.includes(prev)) { inBlock = true; i += 2; continue; }
    }
    out += c; i++;
  }
  return out;
}

/** The naive rule this module retired. Exported for VACUITY TWINS only — a cell
 *  proves the naive rule WOULD swallow the specimen the real one keeps.
 *  Never use this to strip anything. */
const NAIVE_RETIRED = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '');

module.exports = { stripComments, NAIVE_RETIRED };
