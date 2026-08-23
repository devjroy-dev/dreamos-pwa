// scripts/tdw15_p3_pulse.proof.mjs
// ─────────────────────────────────────────────────────────────────────────────
// AMENDED, LABELLED — TDW_15 · P3 · ZIP 4 (F-15.22, CE-35, 2026-08-21)
// THE PULSE WAS WITHDRAWN BY FOUNDER WORD. THIS BENCH RETIRES WITH ITS READER.
//
// ── CARRIED BY NAME ─────────────────────────────────────────────────────────
// The filename says "pulse" and its subject no longer exists. It is KEPT rather
// than renamed, deliberately: a rename drops one floor-set entry and adds
// another, and the estate's idiom is to carry a name and tell the truth in the
// header (FROST_BLOOMS is carried stale by name for the same reason). What this
// file now proves is the WITHDRAWAL — that the masthead came back to its
// approved bytes whole, and that nothing of the addition was left behind.
//
// ── WHAT WAS WITHDRAWN, AND WHY ─────────────────────────────────────────────
// F-15.22: the wordless hairline idiom FAILS ON-GLASS COMPREHENSION outside the
// envelope rows' context — witnessed on the founder's own device. The idiom is
// legible in the expenses bloom because the rows around it say what it measures;
// alone under a masthead it says nothing a reader can decode. The design was
// sound in its reasoning and wrong on the glass, which is what walking a surface
// is for. His word is the cure and the withdrawal is whole.
//
// ── COUNTS DISCLOSED (RETIRE-WITH-THE-READER) ───────────────────────────────
//   BEFORE: 6 cells.  AFTER: 5 cells.
//   RETIRED — 4, all reading a subject that no longer exists:
//     §1.1 the pulse rides the existing envelopes reader (F-15.16)
//     §1.2 the absence rule (C-4), guarded on a positive ceiling
//     §1.3 the fill branches on the named threshold
//     §1.4 wordless (C-3), no text child
//   KEPT — 2, whose subjects outlived the pulse:
//     §1.5 -> §2   the masthead's own elements
//     §1.6 -> §3   THE WALL
//   ADDED — 3, and they are STRONGER than what they replace:
//     §1  byte-identity to the approved bytes, out of git rather than by eye
//     §4  no pulse residue survives anywhere in the file
//     §5  F-15.19 DISSOLVED — the 0.9 threshold has exactly one home again
//
// A RETIREMENT IS NOT A DELETION. Each retired cell is named above with what it
// used to assert, so a later reader can see that four greens went away because
// their reader did, not because they had become inconvenient.
//
//   node scripts/tdw15_p3_pulse.proof.mjs [TREE_ROOT]
//
// ── BOTH-WAYS ───────────────────────────────────────────────────────────────
// Pass a tree with the pulse still in it (the pre-withdrawal tip 6111bb9) and
// §1, §4 and §5 go RED — the withdrawal's own cells, reddening on the presence
// of exactly what was withdrawn. §2 and §3 stay green there, which is the
// control: they were never the pulse's cells.
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'fs';
import path from 'path';
import { execSync } from 'node:child_process';

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

const raw  = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const read = (rel) => stripComments(raw(rel));

const SANCTUARY = 'app/(frost)/frost/canvas/sanctuary/page.tsx';

// The approved bytes: the tree the founder's masthead veto was given against,
// and the last tip at which this file carried no addition. Read out of git
// rather than out of a constant, for the reason cell §1 exists at all.
const APPROVED = '94dd738';

console.log('\nTDW_15 P3 · THE PULSE WITHDRAWAL (F-15.22) — tree: ' + ROOT + '\n');

cell('§1 THE MASTHEAD IS BACK TO ITS APPROVED BYTES — byte-identical at ' + APPROVED, () => {
  let old;
  try {
    old = execSync(`git show ${APPROVED}:"${SANCTUARY}"`,
      { cwd: ROOT, encoding: 'utf8', maxBuffer: 1e8 });
  } catch {
    return `git show failed at ${APPROVED} — without the approved tree this cell would be vacuous, so it FAILS rather than passing`;
  }
  const now = raw(SANCTUARY);
  if (now === old) return true;

  // ── AMENDED AT R-36.11, ONE LINE, LABELLED ────────────────────────────────
  // This is a BYTE-PIN on a whole 4,300-line page, and that severity is the
  // point: F-15.22 withdrew the budget pulse and the masthead had to return to
  // approved bytes exactly. R-36.11 then ordered ONE line changed in this file —
  // the `useFrostMode` import repointed from `../../../layout` to the extracted
  // context, because a layout may not export a hook under Next 16.
  //
  // THE PIN IS NOT LOOSENED. It admits exactly that one ruled substitution and
  // nothing else: the old import line must be GONE, the new one PRESENT, and
  // every other byte still identical. A second edit to this page reddens here,
  // which is what the pin was built for.
  {
    const OLD_IMPORT = "import { useFrostMode } from '../../../layout';";
    const NEW_IMPORT = "import { useFrostMode } from '@/lib/frost/FrostCtx'; // R-36.11: the context left the layout";
    if (old.includes(OLD_IMPORT) && now.includes(NEW_IMPORT)
        && now.replace(NEW_IMPORT, OLD_IMPORT) === old) return true;
  }

  // Report the SHAPE of the difference, not merely its existence: a reader
  // chasing this needs to know whether something was left behind or lost.
  const a = old.split('\n'), b = now.split('\n');
  const extra = b.filter((l) => !a.includes(l));
  return `not identical (${a.length} -> ${b.length} lines); first unmatched: ${JSON.stringify(extra[0] ?? '(none)').slice(0, 120)}`;
});

cell("§2 the masthead's own elements all survive the withdrawal", () => {
  const s = read(SANCTUARY);
  for (const needle of [
    'mornings to I do',          // C-6, never re-authored
    'days since you said yes',   // the signal line
    'Hello, ',                   // the greeting
    'fontSize:FT.numeral',       // the numeral
  ]) if (!s.includes(needle)) return `the masthead lost: ${needle}`;
  return true;
});

cell('§3 THE WALL — no member-facing surface reaches an envelope byte', () => {
  for (const rel of ['app/coplanner/page.tsx', 'components/frost/blooms/circle.tsx']) {
    const src = read(rel);
    if (/fetchEnvelopes|budget_envelopes|amount_inr/.test(src)) return `${rel} reaches envelope data`;
  }
  return true;
});

cell('§4 NO RESIDUE — the withdrawal is whole, not partial', () => {
  const s = read(SANCTUARY);
  for (const [sym, what] of [
    ['PULSE_THRESHOLD', 'the threshold constant'],
    ['setPulse',        'the state setter'],
    ['fetchEnvelopes',  'the envelopes read'],
    ['BudgetEnvelope',  'the envelope type import'],
  ]) if (s.includes(sym)) return `${what} was left behind (${sym})`;
  return true;
});

cell('§5 F-15.19 DISSOLVED — the 0.9 threshold has exactly ONE home again', () => {
  const expenses = read('components/frost/blooms/expenses.tsx');
  if (!/HAIR_THRESHOLD/.test(expenses)) return 'the surviving home lost its constant';
  const sanc = read(SANCTUARY);
  if (/0\.9\b/.test(sanc)) return 'a bare 0.9 survives in the conductor — the duplication did not dissolve';
  return true;
});

console.log('\n─────────────────────────────────────────────');
console.log(`  PASS ${pass}   FAIL ${fail}\n`);
process.exit(fail ? 1 : 0);
