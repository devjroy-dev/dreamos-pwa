#!/usr/bin/env node
// scripts/tdw13_d1_dead_tree.proof.mjs
//
// TDW_13 · D-1 · THE DEAD-TREE DELETION (F-13.1 + F-13.2) — the bench.
//
// This is an ABSENCE bench, which is the easiest kind to write dishonestly: a
// cell that looks for something that no longer exists passes whether or not the
// cure ever happened, and it passes just as happily if the path was misspelled
// from the first line. So every absence cell here is paired with a NON-VACUITY
// control that runs the identical machinery against a path that MUST still be
// there. If the control cannot find sanctuary, the bench declares itself broken
// instead of reporting green.
//
// THE FORK TRAP THIS BENCH EXISTS TO STAND OVER:
//   app/(frost)/frost/canvas/journey/  — DELETED (a dead route tree)
//   lib/frost/journey.ts               — ALIVE, 638 lines, 41 exports, the
//                                        couple API client sanctuary imports
// They share a name and nothing else. A future hand told to "delete journey"
// takes the wrong one and the bride app loses its data layer. Cells 4a–4c are
// that hand's tripwire and they are the reason this bench outlives the sitting.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const R = (p) => path.join(ROOT, p);

let pass = 0, fail = 0;
const results = [];
function ok(name, cond, detail) {
  if (cond) { pass++; results.push(['ok  ', name]); }
  else { fail++; results.push(['FAIL', name + (detail ? ' — ' + detail : '')]); }
  return !!cond;
}

const exists = (p) => fs.existsSync(R(p));
const sha = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex');

// ── the subjects, enumerated by path, never by a glob that could quietly
//    match nothing. File+count census, not line-pinned (counts drift, paths don't).
const DELETED_FILES = [
  'app/(frost)/frost/canvas/dream/page.tsx',
  'app/(frost)/frost/canvas/journey/page.tsx',
  'app/(frost)/frost/canvas/journey/circle/page.tsx',
  'app/(frost)/frost/canvas/journey/circle/[memberId]/page.tsx',
  'app/(frost)/frost/canvas/journey/events/page.tsx',
  'app/(frost)/frost/canvas/journey/expenses/page.tsx',
  'app/(frost)/frost/canvas/journey/moments/page.tsx',
  'app/(frost)/frost/canvas/journey/people/page.tsx',
  'app/(frost)/frost/canvas/journey/reminders/page.tsx',
  'app/(frost)/frost/canvas/journey/settings/page.tsx',
  'app/(frost)/frost/canvas/journey/vendors/page.tsx',
];
const DELETED_DIRS = [
  'app/(frost)/frost/canvas/journey',
  'app/(frost)/frost/canvas/dream',
];
// Survivors — the non-vacuity controls. If ANY of these has gone missing, the
// absence cells below are meaningless and the bench says so.
const SURVIVORS = [
  'app/(frost)/layout.tsx',
  'app/(frost)/frost/page.tsx',
  'app/(frost)/frost/canvas/sanctuary/page.tsx',
  'app/(frost)/frost/canvas/muse/page.tsx',
  'app/(frost)/frost/canvas/surprise/page.tsx',
  'app/(frost)/frost/canvas/onboarding/page.tsx',
  'app/(frost)/frost/canvas/discover/page.tsx',
];

// ═════════════════════════════════════════════════════════════════════════════
// 0 — NON-VACUITY CONTROLS. These run first. If they fail, nothing below counts.
// ═════════════════════════════════════════════════════════════════════════════
const controlsHeld = SURVIVORS.every(exists);
ok('0a. control: every surviving frost route is still on disk',
   controlsHeld, SURVIVORS.filter(p => !exists(p)).join(' | ') || '—');
ok('0b. control: the existence check can return false (a path that never existed)',
   !exists('app/(frost)/frost/canvas/__no_such_room__/page.tsx'));
if (!controlsHeld) {
  console.log('\n  BENCH ABORTED — the non-vacuity controls failed. Absence cells');
  console.log('  cannot be trusted when the machinery cannot find what survives.\n');
  process.exit(1);
}

// ═════════════════════════════════════════════════════════════════════════════
// 1 — the dead route tree is gone
// ═════════════════════════════════════════════════════════════════════════════
for (const d of DELETED_DIRS) ok(`1. directory absent: ${d}`, !exists(d));
let fileMisses = 0;
for (const f of DELETED_FILES) if (exists(f)) fileMisses++;
ok(`2. all ${DELETED_FILES.length} enumerated route files are absent`,
   fileMisses === 0, `${fileMisses} still present`);

// file+count census of what remains
const frostFiles = [];
(function walk(dir) {
  for (const e of fs.readdirSync(R(dir), { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) walk(p); else frostFiles.push(p);
  }
})('app/(frost)');
ok('3. the (frost) tree holds exactly the 7 surviving files and no others',
   frostFiles.length === SURVIVORS.length && SURVIVORS.every(s => frostFiles.includes(s)),
   `found ${frostFiles.length}: ${frostFiles.join(', ')}`);

// ═════════════════════════════════════════════════════════════════════════════
// 4 — THE FORK-TRAP GUARD. The live client must survive, intact and imported.
// ═════════════════════════════════════════════════════════════════════════════
const CLIENT = 'lib/frost/journey.ts';
ok('4a. the LIVE client lib/frost/journey.ts still exists', exists(CLIENT));
const clientSrc = exists(CLIENT) ? fs.readFileSync(R(CLIENT), 'utf8') : '';
const clientExports = (clientSrc.match(/^export /gm) || []).length;
ok('4b. it is intact, not a stub left behind by a careless delete',
   clientExports >= 40, `${clientExports} exports`);
const sanctuary = fs.readFileSync(R('app/(frost)/frost/canvas/sanctuary/page.tsx'), 'utf8');
ok('4c. sanctuary still imports from it — the data layer is wired, not orphaned',
   /from '.*lib\/frost\/journey'/.test(sanctuary));

// ═════════════════════════════════════════════════════════════════════════════
// 5 — zero inbound, estate-wide, with its own control
// ═════════════════════════════════════════════════════════════════════════════
const SCAN_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json', '.css', '.md']);
const scanned = [];
(function walk(dir) {
  let entries;
  try { entries = fs.readdirSync(R(dir), { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.next' || e.name === '.git') continue;
    const p = dir === '.' ? e.name : `${dir}/${e.name}`;
    if (e.isDirectory()) walk(p);
    else if (SCAN_EXT.has(path.extname(e.name))) scanned.push(p);
  }
})('.');

const SELF = 'scripts/tdw13_d1_dead_tree.proof.mjs';
function refsTo(needle, { benches = false } = {}) {
  const hits = [];
  for (const f of scanned) {
    if (f === SELF) continue;               // the bench names the routes by design
    const isBench = f.startsWith('scripts/');
    if (isBench !== benches) continue;
    let src; try { src = fs.readFileSync(R(f), 'utf8'); } catch { continue; }
    if (src.includes(needle)) hits.push(f);
  }
  return hits;
}
ok('5a. control: the reference scanner is non-vacuous (it finds canvas/sanctuary)',
   refsTo('canvas/sanctuary').length > 0);
ok('5b. control: the scanner covered a real tree, not an empty list',
   scanned.length > 50, `${scanned.length} files scanned`);

/* PRODUCT code must not reference the deleted routes — that is the navigational
   claim, and it is what "zero inbound" means.
   BENCHES may, and one deliberately does: tdw09_frost_parity's cell 1.1b names
   all eleven so their RETURN is caught. Written first as one undifferentiated
   scan, this cell reported that guard as a caller and would have pressured a
   future hand into deleting the very tripwire standing over the deletion. A
   bench naming a corpse is not a caller; it is a witness, and the two are
   separated here by axis rather than by an exception list. */
const journeyRefs = refsTo('canvas/journey');
const dreamRefs   = refsTo('canvas/dream');
ok('5c. zero PRODUCT references to the deleted route canvas/journey',
   journeyRefs.length === 0, journeyRefs.join(' | '));
ok('5d. zero PRODUCT references to the deleted route canvas/dream',
   dreamRefs.length === 0, dreamRefs.join(' | '));
ok('5e. the return-guard is in place — a bench still names these routes so a revival reds',
   refsTo('canvas/journey', { benches: true }).length > 0,
   'no bench watches for their return');

// ═════════════════════════════════════════════════════════════════════════════
// 6 — NON-VACUITY BY PRODUCTION MUTATION
// For a deletion the mutation is RESTORATION: put a subject back and the absence
// cells must go red. A cell that stays green with the file on disk proves nothing.
// ═════════════════════════════════════════════════════════════════════════════
const CANARY_FILE = 'app/(frost)/frost/canvas/journey/page.tsx';
const CANARY_DIR  = 'app/(frost)/frost/canvas/journey';
const CLIENT_PRE  = sha(clientSrc);

const mutLines = [];
let mutBit = 0, mutDead = 0;

// M1 — restore a deleted route file
fs.mkdirSync(R(CANARY_DIR), { recursive: true });
fs.writeFileSync(R(CANARY_FILE), 'export default function X(){return null;}', 'utf8');
{
  const dirGone  = !exists(CANARY_DIR);
  const fileGone = !exists(CANARY_FILE);
  const censusHeld = (() => {
    const f = []; (function w(d){ for (const e of fs.readdirSync(R(d), {withFileTypes:true})) { const p=`${d}/${e.name}`; if(e.isDirectory()) w(p); else f.push(p); } })('app/(frost)');
    return f.length === SURVIVORS.length;
  })();
  const held = dirGone || fileGone || censusHeld;
  if (held) { mutDead++; mutLines.push(['DEAD', 'M1 · a deleted route is restored — an absence cell STILL PASSED']); }
  else { mutBit++; mutLines.push(['bite', 'M1 · a deleted route is restored → cells 1/2/3 went red']); }
}
fs.rmSync(R(CANARY_DIR), { recursive: true, force: true });

// M2 — gut the LIVE client (the fork trap actually springing)
fs.writeFileSync(R(CLIENT), '// gutted\n', 'utf8');
{
  const src = fs.readFileSync(R(CLIENT), 'utf8');
  const held = (src.match(/^export /gm) || []).length >= 40;
  if (held) { mutDead++; mutLines.push(['DEAD', 'M2 · the live client is gutted — cell 4b STILL PASSED']); }
  else { mutBit++; mutLines.push(['bite', 'M2 · the live client is gutted → cell 4b went red']); }
}
fs.writeFileSync(R(CLIENT), clientSrc, 'utf8');

// M3 — delete the live client outright
fs.rmSync(R(CLIENT));
{
  const held = exists(CLIENT);
  if (held) { mutDead++; mutLines.push(['DEAD', 'M3 · the live client is deleted — cell 4a STILL PASSED']); }
  else { mutBit++; mutLines.push(['bite', 'M3 · the live client is deleted → cell 4a went red']); }
}
fs.writeFileSync(R(CLIENT), clientSrc, 'utf8');

// le3 — checksum-restore proof over every path this harness wrote or deleted
const CLIENT_POST = sha(fs.readFileSync(R(CLIENT), 'utf8'));
const canaryGone  = !exists(CANARY_DIR);
const restored = CLIENT_PRE === CLIENT_POST && canaryGone;

// ── report ───────────────────────────────────────────────────────────────────
console.log('');
for (const [tag, line] of results) console.log(`  ${tag} ${line}`);
console.log('');
console.log('  ── mutation leg (restoration is the mutation for a deletion) ──');
for (const [tag, line] of mutLines) console.log(`  ${tag} ${line}`);
console.log('');
console.log(`  le3 restore: lib/frost/journey.ts ${CLIENT_PRE.slice(0,12)} → ${CLIENT_POST.slice(0,12)} · ${CLIENT_PRE===CLIENT_POST?'IDENTICAL':'DIVERGED'}`);
console.log(`               canary path removed: ${canaryGone ? 'YES' : 'NO — LEFT BEHIND'}`);
console.log('');

const total = results.length;
const green = fail === 0 && mutDead === 0 && restored;
console.log('══════════════════════════════════════════════════════════════');
console.log(`tdw13_d1_dead_tree: ${pass} passed, ${fail} failed`);
console.log(`  total ${total} · run ${total} · skipped 0 · in-process, no network, no browser`);
console.log(`  mutations 3 · biting ${mutBit} · dead ${mutDead}`);
console.log(`VERDICT: ${green ? 'GREEN' : 'RED'}`);
console.log('══════════════════════════════════════════════════════════════');
process.exit(green ? 0 : 1);
