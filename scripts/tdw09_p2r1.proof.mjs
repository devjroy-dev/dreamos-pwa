// scripts/tdw09_p2r1.proof.mjs — TDW_09 P2 · RIDER 1: the books door + the room word
// Charter: F-09.91 arm (b) FOUNDER-RULED (「 option b 」) + the founder's room-
// reminder ask, same walk. Both-ways: each subject reverted alone at 8715a69.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const R = (p) => readFileSync(join(ROOT, p), 'utf8');
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
let pass = 0, fail = 0;
const cell = (id, ok, msg) => { if (ok) { pass++; console.log(`  PASS ${id} ${msg}`); } else { fail++; console.log(`  FAIL ${id} ${msg}`); } };

console.log('\n── §1 · F-09.91(b): the crest retired, the strip is the door ──');
{
  const cab = R('components/vendor/Cabinet.tsx');
  const cabSrc = strip(cab);
  cell('1.1', !/cab-orn/.test(cabSrc) && !/function lift\(/.test(cabSrc) && !/lifting/.test(cabSrc),
    'the crest button + lift() + lifting state are gone from code');
  cell('1.2', cabSrc.includes("addEventListener('tdw-open-books'") && cabSrc.includes('removeEventListener'),
    'Cabinet listens for tdw-open-books, with cleanup (the positive pair)');
  cell('1.3', cab.includes('F-09.91'), 'the tombstone names the finding');
  const css = R('app/globals.css');
  const cssSrc = strip(css);
  cell('1.4', !/\.cab-orn\s*\{/.test(cssSrc) && !/bottom:\s*76px/.test(cssSrc) && !/cabEmber/.test(cssSrc.replace(/cabEmber[^{]*\{[^}]*\}/g, m => m)) || (!/\.cab-orn/.test(cssSrc) && !/@keyframes cabEmber/.test(cssSrc)),
    'the fixed-offset rule (bottom:76px) + crest CSS + cabEmber are gone');
  cell('1.5', /\.dd-cab \.cab-sheet\{/.test(css) && /cab-grip/.test(css),
    'the SHEET rules survive whole (only the handle died)');
  const home = R('app/vendor/page.tsx');
  const homeSrc = strip(home);
  cell('1.6', homeSrc.includes("new CustomEvent('tdw-open-books')") && homeSrc.includes('aria-label="Open your books"'),
    'the ledger strip dispatches the event and says what it opens');
  cell('1.7', homeSrc.includes('onKeyDown') && /role="button" tabIndex=\{0\}/.test(homeSrc),
    'keyboard door too — Enter/Space open the books');
  cell('1.8', /onPointerDown=\{\(\) => setPressed\(true\)\}[\s\S]{0,400}pressedStyle\(pressed, reducedMotion\)/.test(homeSrc),
    'the strip wears F-09.21 pressed (suppression with replacement)');
}

console.log('\n── §2 · the room, named on the risen chat ──');
{
  const chip = strip(R('components/vendor/VictorModeChip.tsx'));
  cell('2.1', /onMode\?: \(m: VictorMode \| null\) => void/.test(chip) && /onMode\?\.\(mode\)/.test(chip),
    'the chip publishes its room (optional, additive — one control, one truth)');
  const home = R('app/vendor/page.tsx');
  const homeSrc = strip(home);
  cell('2.2', homeSrc.includes('onMode={setVictorRoom}'),
    'home mirrors the chip, never calls the hook twice');
  // TDW_09 P2-R2 — LABELLED AMENDMENT, COUNT PRESERVED (2 → 2). R1's two-
  // register masthead was founder-walked and re-ruled to arm (a): ONE house
  // small-caps register, HUE + WORD distinguishing the rooms. The cells follow
  // the ruling; an italic reappearing at this site is now the red.
  cell('2.3', !/fontStyle: 'italic'/.test(homeSrc.split("victorRoom === 'business'")[1]?.slice(0, 900) ?? "fontStyle: 'italic'")
           && /victorRoom === 'business'[\s\S]{0,200}T\.accent : A\.brassWarm/.test(homeSrc),
    "one register — Business brass, no italic arm survives at the masthead (founder arm (a))");
  cell('2.4', /victorRoom === 'business' \? 'Business' : victorRoom === 'advisor' \? 'Advisor' : 'Chat'/.test(homeSrc),
    "Advisor in primary ink, unknown room falls back to the standing 'Chat' byte");
  cell('2.5', home.includes("chip's vetoed pair"),
    'the words are the chip\u2019s own vetoed pair — no new vocabulary, stated in-comment');
}

console.log(`\n════ tdw09_p2r1: ${pass} passed, ${fail} failed (total ${pass + fail}) ════`);
process.exit(fail === 0 ? 0 : 1);
