#!/usr/bin/env node
// scripts/tdw_f3944_preflight_verdict.proof.mjs
// ═════════════════════════════════════════════════════════════════════════════
// F-39.44 — THE GATE INSTRUMENT PRINTED "STOP" AND RETURNED "GO".
// ═════════════════════════════════════════════════════════════════════════════
// `tools/preflight.sh` ended `exit 0` unconditionally, under BOTH branches of its
// own verdict. It printed
//
//     PREFLIGHT NOT CLEAR — resolve the lines above before any number goes in a handover.
//
// and then handed its caller a zero. Under this estate's floor-method law — THE
// EXIT CODE IS THE VERDICT, never the printed text — every wrapper that gated on
// preflight saw CLEAR forever, on every tree, always.
//
// THE CLASS, NAMED (CE-39 band 5): an instrument CORRECT ABOUT ITS OWN SUBJECT
// and WRONG ABOUT WHAT IT IS READ TO MEAN, with nothing above it asking the
// second question. The site is what makes this instance bite: preflight is the
// instrument the estate runs FIRST, before every sitting, to decide whether any
// other number can be trusted.
//
// ── THIS IS THE TWIN, AND IT IS AUTHORED RATHER THAN PORTED ────────────────
// dream-os carries `scripts/b50_preflight_verdict_bench.js` over its own copy.
// The two benches ask the same three questions of two forked files, and each
// pins the other's block in its §3. Neither is a copy of the other's bytes:
// F-07.52 tried one-home-by-verbatim-port and the ported copy was never called,
// so this estate's rule is that a twin proves the same PROPERTY at its own site,
// never that it reproduces the same TEXT.
//
// ── WHY THE CELLS DRIVE THE SCRIPT'S OWN BYTES ─────────────────────────────
// F-07.99: a definition held and never invoked fooled this estate for a whole
// block. A cell that re-implements the verdict block and tests the replica proves
// nothing about the file. So §2 SLICES the verdict block out of the live
// `tools/preflight.sh` and EXECUTES IT, twice, under both values of `WARN`. If a
// seat restores `exit 0` tomorrow, the WARN=1 arm returns zero and §2.2 reds.
//
// NO STRIPPER HERE, DELIBERATELY. This bench's only subject is a shell script,
// which the estate's comment conventions do not cover and `stripComments` does
// not parse. It imports nothing from `scripts/lib/`, carries no canary, and
// `tdw_f0774_stripper.proof.mjs` §6.2 is the cell that keeps that honest — a
// canary marker without a stripper import is an offence there.
// ═════════════════════════════════════════════════════════════════════════════
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PREFLIGHT = 'tools/preflight.sh';
const raw = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

let pass = 0, fail = 0, skip = 0;
const ok = (label, cond, detail) => {
  if (cond) { pass++; console.log(`  ok   ${label}`); }
  else { fail++; console.log(`  FAIL ${label}`); if (detail) console.log(`       ${detail}`); }
};
const named_skip = (label, why) => { skip++; console.log(`  SKIP ${label}\n       ${why}`); };
const sec = (t) => console.log(`\n${t}`);

console.log('F-39.44 — the preflight verdict reaches the exit code');

// THE SLICE, by its own opening token rather than by a line number
// (path-over-range): a line count would rot the first time a warning is added
// above it, which is the one edit this file must survive.
const OPEN = 'if [ "$WARN" = "0" ]; then';
const src = raw(PREFLIGHT);
const at = src.indexOf(OPEN);
const block = at >= 0 ? src.slice(at) : '';

// ═════════════════════════════════════════════════════════════════════════════
sec('§1 · THE SHAPE — the verdict is derived from WARN, and nothing overrides it');

ok('§1.1 the verdict block is locatable by its own opening token (non-vacuity)',
  at >= 0 && block.includes('PREFLIGHT NOT CLEAR'),
  'the branch that chooses the sentence has moved or been renamed; this bench is reading the wrong region and every cell below is about nothing');

ok('§1.2 the script ends by exiting WARN, not a constant',
  /\nexit "\$WARN"\s*$/.test(src),
  'the tail no longer derives its exit from the verdict variable');

ok('§1.3 no unconditional `exit 0` survives inside the verdict block',
  !/\bexit 0\b/.test(block),
  'a constant exit has grown back below the verdict — F-39.44 exactly');

const warnSites = (src.match(/^\s*WARN=1\s*$/gm) || []).length;
ok(`§1.4 every warning site feeds the one variable the exit reads (${warnSites} sites)`,
  warnSites >= 3,
  'the warning sites and the exit have drifted apart, or the sites are gone');

// ═════════════════════════════════════════════════════════════════════════════
sec('§2 · BOTH WAYS — the shipped bytes are EXECUTED under each verdict');

// `say` and `line` are the script's own output helpers, defined above the slice.
// Stubbed because this cell's subject is the EXIT CODE, not the prose; the prose
// is §1.1's business. `$1` carries the verdict in, so the block under test is the
// shipped block and nothing around it is authored.
const drive = (warn) => spawnSync(
  'bash',
  ['-c', 'say(){ :; }; line(){ :; }; WARN="$1";\n' + block, 'proof', String(warn)],
  { encoding: 'utf8' },
).status;

const clear = drive(0);
const notClear = drive(1);

ok('§2.1 WARN=0 — a clear preflight exits 0 (the cure does not break the green arm)',
  clear === 0,
  `a clean tree now exits ${clear}; the cure would refuse every sitting`);

ok('§2.2 WARN=1 — a NOT CLEAR preflight exits NON-ZERO',
  notClear !== 0,
  `THE F-39.44 DEFECT IS BACK: the block printed its refusal and returned ${notClear}. `
  + 'Every wrapper gating on this instrument reads CLEAR on a tree it just refused.');

ok('§2.3 the two arms genuinely differ — the cell is not passing on a constant',
  clear !== notClear,
  'both arms returned the same code, so §2.1 and §2.2 cannot both be measuring the verdict');

// ═════════════════════════════════════════════════════════════════════════════
sec('§3 · ONE VERDICT, TWO REPOS — the forked file, pinned at the block');

// The two files differ ABOVE this point by design: dream-os carries the F-39.p2
// build-artifact lore this repo has no use for. What may not differ is the part
// that decides what the instrument MEANS.
{
  const SIB = ['../dream-os/tools/preflight.sh', '../../dream-os/tools/preflight.sh'];
  const found = SIB.map((p) => path.resolve(ROOT, p)).find((p) => fs.existsSync(p));
  if (!found) {
    named_skip('§3.1 cross-repo verdict identity — dream-os sibling clone not present',
      'the twin could not be read from this container; the identity is UNPROVEN here and is '
      + 'proven in dream-os by scripts/b50_preflight_verdict_bench.js §3. '
      + 'A skip, counted and named — never a pass.');
  } else {
    const twin = fs.readFileSync(found, 'utf8');
    const twinAt = twin.indexOf(OPEN);
    ok('§3.1 both repos carry the SAME verdict block, byte-identical',
      twinAt >= 0 && twin.slice(twinAt) === block,
      'the verdict has drifted between the two copies — the class is cured on one repo and '
      + 'standing on the other, which is F-07.52 one repo over');
  }
}

// ═════════════════════════════════════════════════════════════════════════════
const total = pass + fail;
console.log(`\n${fail ? 'RED' : 'GREEN'} — tdw_f3944_preflight_verdict ${pass}/${total}${skip ? ` (${skip} NAMED SKIP)` : ''}`);
process.exit(fail ? 1 : 0);
