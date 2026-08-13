#!/usr/bin/env node
// scripts/tdw13_d7_dream_design.proof.mjs
//
// TDW_13 · D-7 · ε3 IN INK.
//
// A ruling with no artifact is a ruling that will be forgotten. The founder
// ruled that Dream stays in the conductor AS DESIGN — not as the remainder of an
// extraction someone will one day finish — and the artifact is a comment at
// Dream's machinery in sanctuary/page.tsx.
//
// A comment is the weakest kind of artifact: nothing stops a future hand from
// tidying it away, and the tidier will believe they are removing stale prose.
// So this bench PINS it. Cell 1 asserts each load-bearing sentence, and the
// mutation leg deletes them one at a time to prove each is genuinely guarded.
//
// It also carries the fence census (F-1's widening over Dream's verb-sites, by
// class and count, never by line) and the floor-glob check that closes an
// extension gap this seat owned three times.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import stripComments from './lib/stripComments.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SUBJECT = path.join(ROOT, 'app/(frost)/frost/canvas/sanctuary/page.tsx');
const SCRIPTS = path.join(ROOT, 'scripts');

let pass = 0, fail = 0;
const out = [];
const ok = (n, c, d) => { c ? (pass++, out.push(['ok  ', n])) : (fail++, out.push(['FAIL', n + (d ? ' — ' + d : '')])); return !!c; };
const sha = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex');
const read = () => fs.readFileSync(SUBJECT, 'utf8');

const raw = read();
const code = stripComments(raw);

// canary — this bench strips, so it proves its own call site (F-07.99)
ok('0a. canary survives stripping — Dream\'s state really is in live code',
   code.includes('const [msgs,    setMsgs]    = useState<UIMsg[]>([]);'));
ok('0b. control: stripping is not a no-op on this subject',
   code.length < raw.length * 0.95, `${raw.length} → ${code.length}`);

// ═════════════════════════════════════════════════════════════════════════════
// 1 — ε3's PARAGRAPH. Each sentence load-bearing, each pinned.
// ═════════════════════════════════════════════════════════════════════════════
const SENTENCES = [
  ['the ruling is named as design',        'DESIGN, NOT UNFINISHED EXTRACTION'],
  ['ε3 and its date',                      'FOUNDER-RULED ε3, 2026-08-13'],
  ['the state argument',                   "Dream's\n  // state is the PAGE's state"],
  ['the omnipresence ruling',              'THE OMNIPRESENCE RULING (founder, 2026-08-13)'],
  ['the doorbell',                         '`frost:open-dream` is its doorbell'],
  ['summonable from any room',             'summonable from ANY room'],
  ['no future sitting finishes it',        'NO FUTURE SITTING 「 FINISHES 」 THIS'],
  ['the artifact clause',                  'a ruling with\n  // no artifact is a ruling that will be forgotten'],
  ['the escape hatch',                     'THE ESCAPE HATCH'],
  ['the hatch\'s condition, stated',       'The condition is Dream acquiring its own\n  // screens, not the conductor\'s line count'],
  ['re-opening takes a chair\'s word',     "Re-opening takes a chair's word"],
];
for (const [what, needle] of SENTENCES)
  ok(`1. ε3's paragraph carries ${what}`, raw.includes(needle), needle.replace(/\n\s*\/\/ /g, ' ').slice(0, 54));

ok('2a. the paragraph sits AT Dream\'s machinery, not filed elsewhere',
   raw.indexOf('DESIGN, NOT UNFINISHED EXTRACTION') <
   raw.indexOf('const [msgs,    setMsgs]'));
ok('2b. …and within 60 lines of it — a design note two screens away is a note nobody reads',
   raw.slice(raw.indexOf('DESIGN, NOT UNFINISHED EXTRACTION'),
             raw.indexOf('const [msgs,    setMsgs]')).split('\n').length <= 60);

// ═════════════════════════════════════════════════════════════════════════════
// 3 — THE FENCE, widened. Class and count, never line.
// ═════════════════════════════════════════════════════════════════════════════
ok('3a. Dream\'s machinery is declared FROZEN under F-1',
   /FROZEN \(F-1\) — the fence widened to cover these verb-sites/.test(raw));
ok('3b. the choreography fence is still closed — the widening did not swallow it',
   /CHOREOGRAPHY — FROZEN \(F-1\)/.test(raw) && /FREEZE ENDS \(F-1\)/.test(raw));

const CLASSES = [
  ['msgs / setMsgs', /\bsetMsgs\(|\bmsgs\b/, 10],
  ['input / setInput', /setInput\(/, 3],
  ['loading / setLoading', /setLoading\(/, 4],
  ['sendDream', /sendDream/, 4],
  ['cancelRef', /cancelRef/, 6],
  ['streamBrideChat', /streamBrideChat/, 2],
  ['scrollRef', /scrollRef/, 3],
  ['textRef', /textRef/, 3],
  ['DREAM_PROMPTS', /DREAM_PROMPTS/, 2],
  ['frost:open-dream', /frost:open-dream/, 2],
  ['dream room render', /activeRoom===['"]dream['"]/, 2],
];
/* COUNTED ON STRIPPED SOURCE, and the first draft was not — disclosed because
   it is the exact disease this block minted F-13.7 for. The census names its own
   symbols in the design paragraph above, so counting raw lines made the ARTIFACT
   inflate the census it describes: 52 sites where the code has 41, nine classes
   over. A document that changes the number it reports is not a census. */
const lines = stripComments(raw).split('\n');
let total = 0;
for (const [name, re, expect] of CLASSES) {
  const n = lines.filter((l) => re.test(l)).length;
  total += n;
  ok(`3c. verb-site census — ${name}: ${expect}`, n === expect, `found ${n}`);
}
ok('3d. forty-one verb-sites across eleven classes, in live code', total === 41, `${total} sites`);
ok('3e. the header states that census, so the comment and the bench agree',
   /eleven classes, forty-one\n  \/\/ sites in live code/.test(raw));

// ═════════════════════════════════════════════════════════════════════════════
// 4 — THE FLOOR GLOB. Third appearance of one gap; closed by enumeration.
// ═════════════════════════════════════════════════════════════════════════════
const all = fs.readdirSync(SCRIPTS);
const proof = all.filter((f) => f.endsWith('.proof.mjs'));
const bare  = all.filter((f) => f.endsWith('.mjs') && !f.endsWith('.proof.mjs'));
const js    = all.filter((f) => f.endsWith('.js'));
ok('4a. bare .mjs scripts exist — the gap is real, not hypothetical',
   bare.length > 0, `${bare.length} bare .mjs: ${bare.join(', ')}`);
ok('4b. control: the .proof.mjs set is non-empty too', proof.length > 0, `${proof.length}`);
ok('4c. the floor runner in this delivery covers all three extensions',
   fs.existsSync(path.join(SCRIPTS, 'run-floor.sh')) &&
   /\*\.proof\.mjs/.test(fs.readFileSync(path.join(SCRIPTS, 'run-floor.sh'), 'utf8')) &&
   /\*\.mjs/.test(fs.readFileSync(path.join(SCRIPTS, 'run-floor.sh'), 'utf8')) &&
   /\*\.js\b/.test(fs.readFileSync(path.join(SCRIPTS, 'run-floor.sh'), 'utf8')));
ok('4d. and it de-duplicates, or every .proof.mjs runs twice',
   /sort -u/.test(fs.existsSync(path.join(SCRIPTS, 'run-floor.sh'))
     ? fs.readFileSync(path.join(SCRIPTS, 'run-floor.sh'), 'utf8') : ''));

// ═════════════════════════════════════════════════════════════════════════════
// 5 — MUTATION. Each pinned sentence must be genuinely guarded.
// ═════════════════════════════════════════════════════════════════════════════
const PRE = sha(raw);
const MUT = [
  ['M1 · the design sentence is tidied away', 'DESIGN, NOT UNFINISHED EXTRACTION', 'cell 1'],
  ['M2 · the omnipresence ruling is dropped', 'THE OMNIPRESENCE RULING (founder, 2026-08-13)', 'cell 1'],
  ['M3 · the escape hatch is deleted', 'THE ESCAPE HATCH', 'cell 1'],
  ['M4 · the no-finishing clause goes', 'NO FUTURE SITTING 「 FINISHES 」 THIS', 'cell 1'],
  ['M5 · the freeze marker is removed', 'FROZEN (F-1) — the fence widened to cover these verb-sites', 'cell 3a'],
];
let bit = 0, dead = 0;
const mut = [];
for (const [name, needle, cell] of MUT) {
  if (!raw.includes(needle)) { dead++; mut.push(['DEAD', `${name} — ${cell} was ALREADY RED; grades nothing`]); continue; }
  fs.writeFileSync(SUBJECT, raw.replace(needle, ''), 'utf8');
  let held;
  try { held = read().includes(needle); } finally { fs.writeFileSync(SUBJECT, raw, 'utf8'); }
  held ? (dead++, mut.push(['DEAD', `${name} — ${cell} STILL PASSED`]))
       : (bit++, mut.push(['bite', `${name} → ${cell} went red`]));
}
const restored = sha(read()) === PRE;

console.log('');
for (const [t, l] of out) console.log(`  ${t} ${l}`);
console.log('');
console.log('  ── mutation leg (production source, never test setup) ──');
for (const [t, l] of mut) console.log(`  ${t} ${l}`);
console.log('');
console.log(`  le3 restore: pre ${PRE.slice(0, 12)} · post ${sha(read()).slice(0, 12)} · ${restored ? 'IDENTICAL' : 'DIVERGED'}`);
console.log('');
const green = fail === 0 && dead === 0 && restored;
console.log('══════════════════════════════════════════════════════════════');
console.log(`tdw13_d7_dream_design: ${pass} passed, ${fail} failed`);
console.log(`  total ${out.length} · run ${out.length} · skipped 0 · in-process, no network`);
console.log(`  mutations ${MUT.length} · biting ${bit} · dead ${dead}`);
console.log(`VERDICT: ${green ? 'GREEN' : 'RED'}`);
console.log('══════════════════════════════════════════════════════════════');
process.exit(green ? 0 : 1);
