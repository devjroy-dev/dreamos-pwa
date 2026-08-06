// scripts/tdw09_p2b_vocab.proof.mjs — PHASE B FIRST DELIVERABLE: THE PARITY ARBITER
//
// F-5 = (a): one vocabulary, two repos, ONE arbiter — this file. It reads the
// pwa home AND the dream-os mirror side-by-side and asserts the ten lists equal
// term-for-term, order included. RED-at-uncured is provable by reverting either
// file alone. When the sibling repo is absent (CI without the pair), the cross
// cells REFUSE WITH A NAMED REASON and exit RED — an unreachable arbiter must
// never read as parity (F-09.30's refuse-never-crash + the independent-method
// law: a check whose failure mode is a silent green is not a check).
//
// Sibling discovery: $TDW_DREAMOS, else ../dream-os relative to this repo root.

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OS_ROOT = process.env.TDW_DREAMOS ?? join(ROOT, '..', 'dream-os');
let pass = 0, fail = 0;
const cell = (id, ok, msg) => { if (ok) { pass++; console.log(`  PASS ${id} ${msg}`); } else { fail++; console.log(`  FAIL ${id} ${msg}`); } };

// Parse a vocabulary object out of source bytes: category → [terms], order kept.
function parseLists(src) {
  const body = src.match(/TAG_VOCABULARY[^=]*=\s*\{([\s\S]*?)\n\}/);
  if (!body) return null;
  const lists = {};
  for (const m of body[1].matchAll(/(\w[\w-]*):\s*\[([^\]]*)\]/g)) {
    lists[m[1]] = [...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1]);
  }
  return lists;
}

const EXPECT_CATEGORIES = ['photography', 'makeup', 'decor', 'catering', 'venue', 'mehndi', 'choreography', 'music', 'planning'];
const EXPECT_COUNTS = { photography: 10, makeup: 10, decor: 10, catering: 10, venue: 10, mehndi: 8, choreography: 7, music: 8, planning: 6 };

console.log('\n── §1 · the pwa home carries the vetoed lists ──');
// Refuse-never-crash (F-09.30): this bench's own both-ways run deletes the
// home; an absent subject must red its cells, not stack-trace.
const pwaPath = join(ROOT, 'lib/shared/tagVocabulary.ts');
const pwaSrc = existsSync(pwaPath) ? readFileSync(pwaPath, 'utf8') : '';
if (!pwaSrc) cell('1.0', false, `REFUSED: pwa home absent at ${pwaPath}`);
const pwa = parseLists(pwaSrc);
cell('1.1', !!pwa, 'pwa TAG_VOCABULARY parses');
EXPECT_CATEGORIES.forEach((c, i) =>
  cell(`1.2.${i + 1}`, pwa?.[c]?.length === EXPECT_COUNTS[c], `${c}: ${pwa?.[c]?.length ?? 0}/${EXPECT_COUNTS[c]} terms`));
cell('1.3', pwa && !('other' in pwa), "'other' stays honestly list-free (the veto's own parenthetical)");
cell('1.4', /normalizeTag[\s\S]*trim\(\)\.toLowerCase\(\)/.test(pwaSrc), 'the one normal form: trim + case-fold');
cell('1.5', pwaSrc.includes('src/lib/shared/tagVocabulary.js'), 'the pwa header names its mirror (binding, direction 1)');

console.log('\n── §2 · the dream-os mirror, cross-repo (THE ARBITER) ──');
const osPath = join(OS_ROOT, 'src/lib/shared/tagVocabulary.js');
if (!existsSync(osPath)) {
  // Named refusal — three reds, never a crash, never a silent green.
  cell('2.1', false, `REFUSED: sibling repo not found at ${osPath} (set TDW_DREAMOS) — parity UNPROVEN`);
  cell('2.2', false, 'REFUSED: mirror lists unread');
  cell('2.3', false, 'REFUSED: mirror binding unread');
} else {
  const osSrc = readFileSync(osPath, 'utf8');
  const os = parseLists(osSrc);
  cell('2.1', !!os, 'mirror TAG_VOCABULARY parses');
  let equal = !!os && !!pwa && EXPECT_CATEGORIES.length === Object.keys(os).length;
  const diffs = [];
  for (const c of EXPECT_CATEGORIES) {
    const a = JSON.stringify(pwa?.[c] ?? null), b = JSON.stringify(os?.[c] ?? null);
    if (a !== b) { equal = false; diffs.push(c); }
  }
  cell('2.2', equal, diffs.length ? `PARITY BROKEN in: ${diffs.join(', ')}` : 'ten lists equal term-for-term, order included');
  cell('2.3', osSrc.includes('lib/shared/tagVocabulary.ts') && /normalizeTag[\s\S]*trim\(\)\.toLowerCase\(\)/.test(osSrc),
    'the mirror names its source (direction 2) and carries the same normal form');
}

console.log(`\n════ tdw09_p2b_vocab: ${pass} passed, ${fail} failed (total ${pass + fail}) ════`);
process.exit(fail === 0 ? 0 : 1);
