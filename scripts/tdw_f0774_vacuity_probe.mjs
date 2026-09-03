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
/* ── AMENDMENT, TDW_13 D-7 (2026-08-13): THE SUBJECT IS THE SURFACE ──────────
   This probe plants forbidden specimens at two `accept="image/*"` sites and
   proves the cured benches can still see them. Both sites were in
   sanctuary/page.tsx; D-5 moved them out with their rooms — the Moments upload
   and the Muse upload — and the probe STOPPED, loudly and correctly, saying it
   expected two sites and found zero.

   That STOP is the probe working. It refused to run rather than plant into a
   file where its anchor no longer existed, which is exactly the behaviour a
   probe should have when the tree moves underneath it. It is re-anchored here,
   not softened: the two sites are named at their new homes, derived by census
   (`grep -c 'accept="image/\*"'` → moments.tsx 1, muse.tsx 1, sanctuary 0), and
   the count assertion stays hard at two.

   See components/frost/_shared/SURFACE.md. */
const SANCT = path.join(ROOT, 'app/(frost)/frost/canvas/sanctuary/page.tsx');
/* The two bite openers, one per file. The probe writes and restores BOTH. */
const BITE_FILES = [
  'components/frost/blooms/moments.tsx',
  'components/frost/blooms/muse.tsx',
].map((r) => path.join(ROOT, r));
const BENCHES = ['tdw07_p6_fold', 'tdw07_p4b_body'];

// ── the guard. A dirty tree means the probe cannot prove it restored anything.
//
// ── F-19.16 · THE DECLARED-DIRT ESCAPE ──────────────────────────────────────
//
// This refusal is correct and it stays. It is also, on its own, the reason the
// whole pwa floor could not gate a delivery tree: A DELIVERY TREE IS DIRTY BY
// DEFINITION, R-33.7 forbids the executor the commit that would clean it, and
// this bench is the one file in `scripts/` that stops on dirt — so its red was
// unavoidable on the one tree the floor exists to measure, and every pwa
// delivery since has had to state a hand-rolled measurement method instead.
//
// `scripts/run-floor.sh --delivery <manifest>` exports the manifest's absolute
// path as `TDW_FLOOR_DELIVERY_MANIFEST`. Read here, and ONLY here, because the
// runner is the one manifest home and this is the one bench that refuses.
//
// WHAT THE ESCAPE DOES NOT DO. It does not weaken the restore proof by one
// byte. The probe already reads every bite file's ORIGINAL bytes into
// `ORIGINALS` before it plants anything, and `restore()` writes those bytes back
// and re-reads to confirm byte-identity — that check never depended on `git`
// and does not depend on it now. What `git status` was standing in for was a
// different question: *can this probe tell its own plant from your unbanked
// work?* Under a manifest the answer is yes, by name, which is a stronger
// answer than a clean tree ever gave — a clean tree proves only that nothing
// was there, while a manifest proves that what is there was declared.
//
// THE ESCAPE IS NARROW AND LOUD. Dirt outside the manifest still STOPS, exactly
// as before. The runner has already refused the same set before reaching this
// bench, so this is the second of two independent checks and not a substitute
// for one — and running the probe standalone on a dirty tree, with no manifest
// in the environment, behaves precisely as it always has.
const DECLARED_MANIFEST = process.env.TDW_FLOOR_DELIVERY_MANIFEST || '';
// The `git` call gets its own try and NOTHING ELSE SHARES IT. When the manifest
// parse lived inside the same block, any throw from it printed the git STOP text
// — a wrong reason for a real refusal, which is the failure mode this estate
// calls laundering an assumption into a verdict.
//
// ⚠ TRAILING NEWLINES ONLY — NEVER `.trim()`. Porcelain's first two columns are
// the status field and an unmodified-in-index file's line begins with a SPACE
// (` M path`). A whole-string `.trim()` eats that space on the FIRST LINE ONLY,
// so `slice(3)` then removes one character too many and the path arrives as
// `cripts/run-floor.sh` — which is in no manifest, so the escape refused a
// delivery it had been handed correctly. The old code trimmed too, and it was
// harmless there because `dirty` was only ever PRINTED. The moment it became
// something the code reasons about, the trim became a defect. Witnessed on the
// first run of the escape, not reasoned about.
// ── §4-3 · `-uall`, AND THE ENUMERATION HAS TWO HOMES ─────────────────────
// Bare `--porcelain` COLLAPSES an untracked directory to a single trailing-slash entry, so
// a delivery adding `app/vendor/(shell)/storefront/page.tsx` reads as `app/vendor/(shell)/storefront/`. A manifest is
// a FILE table by its own header, so the two can never match and this probe refused a
// correct delivery — naming three directories that contain nothing but declared files. It
// is `run-floor.sh`'s identical defect, found in the same run.
//
// ⚠ AND THAT IS THE ENTRY, NOT THE FLAG. F-19.16's own header promises "ONE MANIFEST HOME,
// ONE ENV NAME, one bench that reads it" — and the MANIFEST does have one home. THE DIRT
// ENUMERATION HAS TWO: this file and `scripts/run-floor.sh`, in two languages, each with
// its own `git status --porcelain` and its own parsing of the three-character prefix. They
// agreed for as long as nobody handed them a case they read differently, and an untracked
// DIRECTORY was that case. Cured identically in both, which is a cure applied twice rather
// than a duplication removed; unifying them means a shared helper across bash and node and
// is priced, not attempted inside a crossing.
//
// `-uall` cannot loosen the check: it only ever expands a directory into the files it
// holds, so a path outside the manifest stays outside it — and an UNDECLARED file inside a
// declared directory, which the collapsed form hid, is now caught.
let dirty = null;
try {
  dirty = execSync('git status --porcelain -uall', { cwd: ROOT, encoding: 'utf8' }).replace(/\n+$/, '');
} catch {
  console.log('STOP — could not run `git status` to prove the tree is clean. Nothing was touched.');
  process.exit(3); // F-39.47/F-39.55: a refusal exits 3 — named, never a FAIL, never in a base
}
{
  if (dirty) {
    // Rename entries carry `old -> new` and BOTH sides are dirt a manifest must
    // account for — the same parse the runner uses, for the same reason.
    const dirtyPaths = dirty.split('\n').map((l) => l.slice(3).replace(/^"|"$/g, ''))
      .flatMap((p) => (p.includes(' -> ') ? p.split(' -> ') : [p]))
      .map((p) => p.trim()).filter(Boolean);
    let declared = null;
    if (DECLARED_MANIFEST && fs.existsSync(DECLARED_MANIFEST)) {
      declared = new Set(fs.readFileSync(DECLARED_MANIFEST, 'utf8')
        .split('\n').map((l) => l.replace(/#.*/, '').trim()).filter(Boolean));
    }
    const undeclared = declared ? dirtyPaths.filter((p) => !declared.has(p)) : dirtyPaths;
    if (undeclared.length) {
      console.log('STOP — the tree is dirty. This probe writes to production source and');
      console.log('restores it; on a dirty tree it cannot prove the restore was clean.');
      if (declared) {
        console.log('These paths are NOT in ' + DECLARED_MANIFEST + ':');
        console.log(undeclared.map((p) => '  ' + p).join('\n'));
      } else {
        console.log('Commit or stash first, or declare the dirt with');
        console.log('`bash scripts/run-floor.sh --delivery <manifest>` [F-19.16].');
        console.log(dirty);
      }
      process.exit(3); // F-39.47/F-39.55: a refusal exits 3 — named, never a FAIL, never in a base
    }
    console.log(`[F-19.16] ${dirtyPaths.length} dirty path(s), all declared in ${DECLARED_MANIFEST} — proceeding.`);
  }
}

const ORIGINALS = new Map(BITE_FILES.map((f) => [f, fs.readFileSync(f, 'utf8')]));

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
const SITES = BITE_FILES.map((f) => ({
  file: f,
  at: [...ORIGINALS.get(f).matchAll(/accept="image\/\*"/g)].map((m) => m.index),
}));
const totalSites = SITES.reduce((n, s) => n + s.at.length, 0);
if (totalSites !== 2) {
  console.log(`STOP — expected 2 accept="image/*" bite sites, found ${totalSites}.`);
  for (const s of SITES) console.log(`  ${path.relative(ROOT, s.file)}: ${s.at.length}`);
  console.log('The probe is anchored to those two sites; re-derive before trusting it.');
  process.exit(1);
}

const PLANTED = new Map(SITES.map(({ file, at }) => {
  let src = ORIGINALS.get(file);
  for (const i of [...at].reverse()) {
    const cut = i + 120;
    src = src.slice(0, cut) + PAYLOAD + src.slice(cut);
  }
  return [file, src];
}));

let restored = false;
const restore = () => {
  if (restored) return;
  let all = true;
  for (const [f, orig] of ORIGINALS) {
    fs.writeFileSync(f, orig);
    if (fs.readFileSync(f, 'utf8') !== orig) all = false;
  }
  restored = all;
  console.log(`\nbite files restored byte-identical: ${restored}`);
  if (!restored) console.log('*** RESTORE FAILED — `git checkout -- components/` NOW ***');
};
process.on('exit', restore);
process.on('SIGINT', () => { restore(); process.exit(130); });

let totalReds = 0;
try {
  for (const [f, src] of PLANTED) fs.writeFileSync(f, src);

  if (NAIVE) {
    console.log('--naive: reproducing the DISEASE. The benches are read as shipped; to');
    console.log('reproduce the original zero-reds you must also restore the retired rule');
    console.log('in scripts/lib/stripComments.mjs. This flag plants only.\n');
  }

  for (const b of BENCHES) {
    console.log(`\n──────── ${b} · specimens planted at both bite sites ────────`);
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
