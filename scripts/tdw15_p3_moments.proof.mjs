// scripts/tdw15_p3_moments.proof.mjs
// ─────────────────────────────────────────────────────────────────────────────
// TDW_15 · P3.3 · ZIP 3 — MOMENTS ON THE 07 IMAGE DISCIPLINE.
//
//   node scripts/tdw15_p3_moments.proof.mjs [TREE_ROOT]
//
// ── STRUCTURAL CELLS, DISCLOSED NOT HIDDEN ──────────────────────────────────
// `components/frost/blooms/moments.tsx` is a 'use client' React module and
// cannot render standalone in plain node (the bands.proof.ts precedent states
// the same limitation about CalendarBands.tsx, and this estate says it out loud
// rather than letting a reader assume more than the cells prove). Every cell
// below asserts a SURFACE — a symbol reached, a variant served, an absence —
// never a line number and never where a constant lives (F-15.12).
//
// THE HARD GUARANTEE FOR THIS LIMB IS NOT HERE, IT IS IN THE CANARY.
// `tdw13_d4_extraction` holds every relocated line of this file and its
// allowlist grew by exactly two, granted one at a time by R-35.25 with each
// entry's presence in the pre-extraction corpus re-verified mechanically by its
// own cell 2a0 on every run. An ELEVENTH eaten line still reddens it. That is
// what stops this delivery from having widened a bar it was not given.
//
// ── COUNTED COMMENT-STRIPPED ────────────────────────────────────────────────
// The cure's own header names the shape it replaces. An instrument that reads
// the paragraph describing the disease as the disease is a broken instrument
// (R-33.10; the Dream census's own note is the estate precedent) — and the
// sibling pulse proof reddened on a cured tree once, before it was stripped.
//
// ── BOTH-WAYS ───────────────────────────────────────────────────────────────
// Pass an UNCURED tree root to see the reds. Mutations that must redden, all of
// PRODUCTION code: revert either call site to the raw `image_url`/`fullImg` ·
// re-declare a variant width here instead of reaching the one home · drop the
// LQIP layer.
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(process.argv[2] || path.join(import.meta.dirname, '..'));

let pass = 0, fail = 0;
const cell = (name, fn) => {
  let ok = false, why = '';
  try { const r = fn(); ok = (r === true); if (!ok) why = String(r); }
  catch (e) { ok = false; why = e?.message ?? String(e); }
  if (ok) { pass++; console.log('  PASS  ' + name); }
  else { fail++; console.log('  FAIL  ' + name + '  —  ' + why); }
};

const stripComments = (s) =>
  s.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '')
   .replace(/\/\*[\s\S]*?\*\//g, '')
   .replace(/^[ \t]*\/\/.*$/gm, '');

const read = (rel) => stripComments(fs.readFileSync(path.join(ROOT, rel), 'utf8'));

const MOMENTS = 'components/frost/blooms/moments.tsx';

console.log('\nTDW_15 P3.3 · MOMENTS IMAGE DISCIPLINE — tree: ' + ROOT + '\n');
const mom = read(MOMENTS);

cell('§1 the ONE home is reached, never re-implemented', () => {
  if (!/import\s*\{\s*imgUrl\s*,\s*lqipUrl\s*\}\s*from\s*'@\/lib\/frost-api\/img'/.test(mom))
    return 'imgUrl/lqipUrl not imported from the addressed home';
  if (/w_800|w_1600|w_200|w_24|e_blur|q_auto|f_auto/.test(mom))
    return 'a variant string was re-declared here — lib/img.ts holds the table once';
  return true;
});

cell('§2 the grid tile serves the CARD variant over an LQIP wash', () => {
  if (!/src=\{lqipUrl\(m\.image_url\)\}/.test(mom)) return 'no LQIP layer on the tile';
  if (!/src=\{imgUrl\(m\.image_url,\s*'card'\)\}/.test(mom)) return 'the tile does not serve the card variant';
  return true;
});

cell('§3 the viewer serves the FULL variant', () =>
  /src=\{imgUrl\(fullImg,\s*'full'\)\}/.test(mom) || 'the viewer does not serve the full variant');

cell('§4 NO RAW ORIGINAL survives on any img element', () => {
  const raw = /<img[^>]*src=\{(?:m\.image_url|fullImg)\}/.exec(mom);
  return raw === null || `a raw original is still served: ${JSON.stringify(raw[0].slice(0, 60))}`;
});

cell('§5 the LQIP layer is decorative, not a second announcement of the caption', () => {
  const lq = /<img[^>]*src=\{lqipUrl\(m\.image_url\)\}[^>]*>/.exec(mom);
  if (!lq) return 'no LQIP element found';
  if (!/aria-hidden/.test(lq[0])) return 'the wash is not aria-hidden — a screen reader would meet it twice';
  if (!/alt=""/.test(lq[0])) return 'the wash carries a non-empty alt';
  return true;
});

cell('§6 EVERY CAPABILITY IS KEPT — the relocation\'s own promise (F-1)', () => {
  for (const [needle, what] of [
    ['setFullImg', 'tap-to-zoom'],
    ['saved_by_role', 'the Circle chip'],
    ['fmtDate', 'the date stamp'],
  ]) if (!mom.includes(needle)) return `${what} was lost`;
  return true;
});

console.log('\n─────────────────────────────────────────────');
console.log(`  PASS ${pass}   FAIL ${fail}\n`);
process.exit(fail ? 1 : 0);
