#!/usr/bin/env node
// scripts/tdw_f0774_vacuity_probe.mjs
// ═════════════════════════════════════════════════════════════════════════════
// THE PLANT-INSIDE-THE-BITE PROBE — the evidence behind F-07.74's 21 class-(a)
// findings, shipped so it can be re-run. TDW_STRIPPER_CANARY
// ═════════════════════════════════════════════════════════════════════════════
// WHAT IT PROVES. A canary proves the stripper does not eat live code. It does
// NOT prove that the cells downstream would have noticed if it had. This probe
// asks the second question directly: it plants each exposed bench's OWN
// forbidden specimens inside sanctuary's two former false bites and re-runs the
// bench. A cell that stays GREEN over its planted specimen was acquitting over
// code it could not see.
//
// THE RESULT AT 5535e24, before the cure:
//   tdw07_p6_fold   60/60  ZERO REDS   ← twelve absence-cells, all vacuous
//   tdw07_p4b_body 125/125 ZERO REDS   ← nine absence-cells, all vacuous
// and after it: 48/60 and 116/125 — 21 REDs, one per hollow green.
//
// THIS IS THE MUTATION LEDGER'S SHAPE, and it obeys the same discipline: it
// mutates PRODUCTION source, runs, then restores byte-identical and VERIFIES the
// restore before exiting. It refuses to start on a dirty tree, because a probe
// that cannot tell its own plant from your unbanked work is a probe that can
// destroy it.
//
//   node scripts/tdw_f0774_vacuity_probe.mjs           (expects REDs = cured)
//   node scripts/tdw_f0774_vacuity_probe.mjs --naive   (expects NONE = uncured)
//
// EXIT: 0 when the probe reddened the benches (the cure sees the plant), 1 when
// it did not. Under --naive the polarity inverts: that flag exists to reproduce
// the DISEASE, so zero reds is the expected, and passing, result there.
// ═════════════════════════════════════════════════════════════════════════════
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync, execFileSync } from 'child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NAIVE = process.argv.includes('--naive');
const SANCT = path.join(ROOT, 'app/(frost)/frost/canvas/sanctuary/page.tsx');
const BENCHES = ['tdw07_p6_fold', 'tdw07_p4b_body'];

// ── the guard. A dirty tree means the probe cannot prove it restored anything.
try {
  const dirty = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' }).trim();
  if (dirty) {
    console.log('STOP — the tree is dirty. This probe writes to production source and');
    console.log('restores it; on a dirty tree it cannot prove the restore was clean.');
    console.log('Commit or stash first. Nothing was touched.\n' + dirty);
    process.exit(1);
  }
} catch {
  console.log('STOP — could not run `git status` to prove the tree is clean. Nothing was touched.');
  process.exit(1);
}

const ORIGINAL = fs.readFileSync(SANCT, 'utf8');

// ── the plant. Every token below is something a cell in one of the two benches
// asserts is ABSENT from sanctuary. Derived from those cells, not invented.
const PAYLOAD = `
function DiscImageDots(){}
const cyclePhoto=()=>{};
const undoSkip=()=>{};
setUndoStack(1);
function DiscPeekNav(){}
const waRaw='917982159047';
const uu=e.routing_handle||e.vendor_id;
const nextImg=React.useCallback(()=>{},[]);
const prevImg=React.useCallback(()=>{},[]);
function FeaturedEyebrow(){}
function IgChip(){}
if(vendors.length < 3){}
{hasActiveFilters ? (
<span>Lock Date</span>
<span>\u20b9 1.5L Cr</span>
<Spinner/>
const SWIPE_THRESHOLD=1;
const OVERLAY_DISMISS=1;
const haptic = 1;
const [imageIdx, setImageIdx] = useState(0);
`;

// The two bite openers, located by their own text rather than by a stored
// character offset — offsets rot the moment anyone edits the file above them.
const OPENERS = [...ORIGINAL.matchAll(/accept="image\/\*"/g)].map(m => m.index);
if (OPENERS.length !== 2) {
  console.log(`STOP — expected 2 accept="image/*" sites in sanctuary, found ${OPENERS.length}.`);
  console.log('The probe is anchored to those two sites; re-derive before trusting it.');
  process.exit(1);
}

let planted = ORIGINAL;
for (const at of [...OPENERS].reverse()) {
  const cut = at + 120;
  planted = planted.slice(0, cut) + PAYLOAD + planted.slice(cut);
}

let restored = false;
const restore = () => {
  if (restored) return;
  fs.writeFileSync(SANCT, ORIGINAL);
  restored = fs.readFileSync(SANCT, 'utf8') === ORIGINAL;
  console.log(`\nsanctuary restored byte-identical: ${restored}`);
  if (!restored) console.log('*** RESTORE FAILED — `git checkout -- app/` NOW ***');
};
process.on('exit', restore);
process.on('SIGINT', () => { restore(); process.exit(130); });

let totalReds = 0;
try {
  fs.writeFileSync(SANCT, planted);

  if (NAIVE) {
    console.log('--naive: reproducing the DISEASE. The benches are read as shipped; to');
    console.log('reproduce the original zero-reds you must also restore the retired rule');
    console.log('in scripts/lib/stripComments.mjs. This flag plants only.\n');
  }

  for (const b of BENCHES) {
    console.log(`\n──────── ${b} · specimens planted inside both former bites ────────`);
    let out = '';
    try { out = execFileSync('node', [path.join(ROOT, 'scripts', `${b}.proof.mjs`)], { cwd: ROOT, encoding: 'utf8' }); }
    catch (e) { out = (e.stdout || '') + (e.stderr || ''); }
    const reds = out.split('\n').filter(l => /FAIL/.test(l));
    totalReds += reds.length;
    console.log(out.trim().split('\n').slice(-1)[0]);
    console.log(reds.length
      ? `${reds.length} RED — each one a cell that CAN see the plant:\n` + reds.join('\n')
      : 'ZERO REDS — every absence-cell acquitted over the planted specimen.');
  }
} finally {
  restore();
}

console.log(`\ntotal reds: ${totalReds}`);
if (NAIVE) {
  console.log('--naive run: no assertion is made on the count. Compare it against the');
  console.log('cured run above the flag; the difference IS the finding.');
  process.exit(0);
}
if (!restored) process.exit(1);
if (totalReds === 0) {
  console.log('RED — the cured benches did NOT see the plant. The vacuity has returned:');
  console.log('either the stripper reverted or these cells stopped reading stripped source.');
  process.exit(1);
}
console.log('GREEN — the cure sees what the disease hid. 21 reds at the sitting that minted them.');
process.exit(0);
