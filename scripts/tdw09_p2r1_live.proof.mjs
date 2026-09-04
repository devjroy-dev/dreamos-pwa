// scripts/tdw09_p2r1_live.proof.mjs — TDW_09 P2 RIDER 1, THE LIVE REMAINDER
//
// ORIGIN AND RULING. This file is the surviving two cells of `tdw09_p2r1.proof.mjs`
// (F-09.91 arm (b): the books door + the room word). That bench read four subjects; THREE
// were DELETED at the flip (R-39.24, arm (a)): `components/vendor/Cabinet.tsx`,
// `components/vendor/VictorModeChip.tsx` and `app/vendor/page.tsx`, the old chat home.
// Chair ruling, P7.2 ZIP 1b (2026-09-04): the Cabinet and VictorModeChip cells retire, the
// `globals.css` reads stay; a bench that is 11/13 corpse retires at the FILE grain with its
// live cells re-homed here VERBATIM. The 11 retired assertions are quoted in
// `docs/reports/P72_ZIP1b_RETIRED_CELLS.md`.
//
// LIVE-TWIN CHECK, derived at 039d005: `cab-orn`, `cabEmber`, `tdw-open-books` and
// `VictorModeChip` return ZERO hits across `app/vendor/(shell)` and `components/worklist`.
// The books door is now a Rooms tile and a nav seat, not an event on a crest; the room word
// is the drawer's, not a chip's. Neither has a twin these cells could be re-keyed onto.
//
// WHAT THESE TWO STILL WATCH: `app/globals.css` — the retired crest's CSS stays retired, and
// the Cabinet SHEET rules survive whole. The sheet rules are LIVE: `.dd-cab .cab-sheet` is
// still the books sheet's shape, and a stray re-adding `bottom: 76px` or `.cab-orn` would
// re-enter the estate through the stylesheet even with every component gone.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const R = (p) => readFileSync(join(ROOT, p), 'utf8');
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
let pass = 0, fail = 0;
const cell = (id, ok, msg) => { if (ok) { pass++; console.log(`  PASS ${id} ${msg}`); } else { fail++; console.log(`  FAIL ${id} ${msg}`); } };

console.log('\n\u2460 F-09.91(b): the crest stays retired, the sheet rules survive');
{
  const css = R('app/globals.css');
  const cssSrc = strip(css);
  cell('1.4', !/\.cab-orn\s*\{/.test(cssSrc) && !/bottom:\s*76px/.test(cssSrc) && !/cabEmber/.test(cssSrc.replace(/cabEmber[^{]*\{[^}]*\}/g, m => m)) || (!/\.cab-orn/.test(cssSrc) && !/@keyframes cabEmber/.test(cssSrc)),
    'the fixed-offset rule (bottom:76px) + crest CSS + cabEmber are gone');
  cell('1.5', /\.dd-cab \.cab-sheet\{/.test(css) && /cab-grip/.test(css),
    'the SHEET rules survive whole (only the handle died)');
}

console.log(`\n tdw09_p2r1_live: ${pass} passed, ${fail} failed (total ${pass + fail}) `);
if (fail) process.exit(1);
