// scripts/tdw15_p3_pulse.proof.mjs
// ─────────────────────────────────────────────────────────────────────────────
// TDW_15 · P3 · ZIP 2 — THE PULSE (R-1 arm (a), narrowed to the pulse alone).
//
// P3.3 (moments on the 07 image discipline) IS NOT IN THIS ZIP AND HAS NO CELLS
// HERE. Its cure eats two lines that `tdw13_d4_extraction` holds as VERBATIM
// relocated bytes under F-1, and that canary's allowlist "grows by RULING and
// one entry at a time, never by widening a pattern" (its own header; R-34.54 is
// the eighth entry's precedent). A ninth and tenth entry are a chair's to rule.
// The limb was built, floored, and WITHDRAWN at the gate — see the handover.
//
//   node scripts/tdw15_p3_pulse.proof.mjs [TREE_ROOT]
//
// ── THESE CELLS ARE STRUCTURAL, AND THAT IS DISCLOSED, NOT HIDDEN ───────────
// Both subjects live inside 'use client' React modules that cannot compile or
// render standalone in plain node — the bands.proof.ts header states the same
// limitation about CalendarBands.tsx and it is the estate's precedent for saying
// so out loud. The behavioural half of this delivery (the day-boundary cure) IS
// really executed, at scripts/tdw15_p3_daystogo.proof.ts.
//
// So every cell below asserts a SURFACE — a guard, an absence, a symbol reached
// — and never a line number and never where a constant lives (F-15.12).
//
// ── COUNTED COMMENT-STRIPPED, for the reason the Dream census gives ─────────
// The cure's own headers name the shapes they cure. An instrument that reads the
// paragraph describing the disease as the disease is a broken instrument, and
// this one reddened on a cured tree once before it was stripped (R-33.10: the
// instrument is itself subject to the both-ways standard).
//
// ── BOTH-WAYS ───────────────────────────────────────────────────────────────
// Pass an UNCURED tree root to see the reds. Mutations that must redden, all of
// PRODUCTION code: drop the `pulse.ceiling>0` guard · give the fill a literal 0.9
// instead of the named threshold · put a text child in the pulse.
//
// ONE INSTRUMENT PROPERTY, DISCLOSED: the block locator anchors on the guard
// string, so removing the guard blinds §1.3 and §1.4 as well as reddening §1.2.
// That is OVER-reporting, never under-reporting — the safe direction — but it is
// named here rather than discovered by the next reader.
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
  s.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '')      // JSX comment expressions
   .replace(/\/\*[\s\S]*?\*\//g, '')
   .replace(/^[ \t]*\/\/.*$/gm, '');

const read = (rel) => stripComments(fs.readFileSync(path.join(ROOT, rel), 'utf8'));

const SANCTUARY = 'app/(frost)/frost/canvas/sanctuary/page.tsx';

console.log('\nTDW_15 P3 · PULSE + MOMENTS PROOF — tree: ' + ROOT + '\n');

// ═══ §1 — THE PULSE ═════════════════════════════════════════════════════════
console.log('§1  the budget pulse');
const sanc = read(SANCTUARY);

// The pulse's JSX block: from its guard to the end of the element it guards.
const pulseBlock = (() => {
  const i = sanc.indexOf('{pulse&&pulse.ceiling>0');
  if (i < 0) return null;
  return sanc.slice(i, i + 700);
})();

cell('§1.1 the pulse rides the EXISTING envelopes reader — no new fetch, no new literal (F-15.16)', () => {
  if (!/import\s*\{[^}]*\bfetchEnvelopes\b/.test(sanc)) return 'fetchEnvelopes is not imported';
  if (!/from\s*'[^']*lib\/frost\/journey'/.test(sanc)) return 'not reached through lib/frost/journey';
  const literals = (sanc.match(/dream-os-production\.up\.railway\.app/g) || []).length;
  if (literals !== 3) return `naked API literals moved: ${literals} (3 stood at 94dd738, all pre-existing; this delivery adds none)`;
  return true;
});

cell('§1.2 THE ABSENCE RULE (C-4) — the element is guarded on a POSITIVE ceiling', () => {
  if (!pulseBlock) return 'no pulse block found';
  return /\{pulse&&pulse\.ceiling>0/.test(pulseBlock) || 'the ceiling>0 guard is gone — it would render an empty track at zero envelopes';
});

cell('§1.3 the fill branches on the NAMED threshold, not a loose literal', () => {
  if (!pulseBlock) return 'no pulse block found';
  if (!/PULSE_THRESHOLD/.test(pulseBlock)) return 'the fill does not reference the named threshold';
  if (!/const\s+PULSE_THRESHOLD\s*=\s*0\.9\b/.test(sanc)) return 'PULSE_THRESHOLD is not declared at 0.9';
  return true;
});

cell('§1.4 WORDLESS (C-3) — the pulse renders no text child a bride could read', () => {
  if (!pulseBlock) return 'no pulse block found';
  const upToClose = pulseBlock.slice(0, pulseBlock.indexOf('})()}') + 5);
  const textChild = />[ \t]*[A-Za-z₹%][^<>]*</.exec(upToClose);
  return textChild === null || `a text child appeared: ${JSON.stringify(textChild[0].slice(0, 40))}`;
});

cell('§1.5 the approved masthead is otherwise BYTE-UNTOUCHED (R-1 as narrowed)', () => {
  for (const needle of [
    'mornings to I do',                       // C-6, never re-authored
    'days since you said yes',                // the signal line
    "{name===null?'\\u00A0':<>Hello, ",       // the greeting
    'fontSize:FT.numeral',                    // the numeral
  ]) if (!sanc.includes(needle)) return `the masthead lost: ${needle}`;
  return true;
});

cell('§1.6 THE WALL — no member-facing surface reaches an envelope byte', () => {
  for (const rel of ['app/coplanner/page.tsx', 'components/frost/blooms/circle.tsx']) {
    const src = read(rel);
    if (/fetchEnvelopes|budget_envelopes|amount_inr/.test(src)) return `${rel} reaches envelope data`;
  }
  return true;
});

console.log('\n─────────────────────────────────────────────');
console.log(`  PASS ${pass}   FAIL ${fail}\n`);
process.exit(fail ? 1 : 0);
