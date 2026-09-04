#!/usr/bin/env node
// scripts/tdw09_home_live.proof.mjs — TDW_09 O-2, THE LIVE REMAINDER
//
// ORIGIN AND RULING. This file is the surviving eight cells of `tdw09_home.proof.mjs`, the
// old home's acceptance bench. That bench's subject was `app/vendor/page.tsx` — the Victor
// chat home — DELETED at the flip (R-39.24, arm (a)); 57 of its 65 cells read that page or
// `components/vendor/OnboardingOverlay.tsx`, deleted with it. Chair ruling, P7.2 ZIP 1b
// (2026-09-04): a bench that is 57/65 corpse is retired at the FILE grain, its live cells
// re-homed here VERBATIM (assertions byte-identical, section ids kept), the 57 retired
// assertions quoted in the ZIP 1b handover ledger. The old file is deleted in the same cut.
//
// LIVE-TWIN CHECK behind that ruling, derived at 039d005 by grep across `app/vendor/(shell)`
// and `components/worklist`: `WaitingZone`, `WeekStrip`, `FirstRunExemplars`, `EnquiryCard`
// and `QUICK_ACTIONS` return ZERO hits. The home's zones, its first-run exemplars and its
// retired card/actions left the estate with the page; the shell's Today room is a different
// surface with its own cells (b40), not a twin. Nothing here was re-keyed onto it.
//
// WHAT THESE EIGHT STILL WATCH — all four subjects are live at this tip:
//   §6  `hooks/vendor/useVendorData.ts` — `useTodayData`, its own cache row, the leads slice
//       it rides, and the subscription it takes on that slice.
//   §7  `app/demo/vendor/[handle]/studio/page.tsx` — the demo twin-comment's re-point.
//   §8  `components/vendor/InputBar.tsx` — R-O19's vetoed placeholder, and the retired one.
//   §10 W-1's guard: no slice call entered the chat wire (`hooks/vendor/useChat.ts`).
//
// Method, unchanged from the origin bench: SOURCE-PROPERTY cells, not runtime behaviour.
// Runnable from any working directory (Q-SP-5): node scripts/tdw09_home_live.proof.mjs [root]

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

function findRoot(start) {
  let d = start;
  for (let i = 0; i < 8; i++) {
    if (existsSync(join(d, 'package.json'))) return d;
    const up = dirname(d);
    if (up === d) break;
    d = up;
  }
  throw new Error('could not locate a repo root (no package.json found walking up)');
}


const ROOT = process.argv[2]
  ? resolve(process.argv[2])
  : findRoot(dirname(fileURLToPath(import.meta.url)));

// HEAD GUARD — the same one the apply block uses. A bench pointed at the wrong
// repo returns confident nonsense; this makes that failure loud.
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
if (pkg.name !== 'web') {
  console.error(`WRONG REPO  package.json name is "${pkg.name}", expected "web". STOP.`);
  process.exit(2);
}

const read = (rel) => {
  const p = join(ROOT, rel);
  return existsSync(p) ? readFileSync(p, 'utf8') : null;
};
const codeOf = (s) => (s
  ? s.replace(/\{?\/\*[\s\S]*?\*\/\}?/g, '')
     .split('\n').filter((l) => !l.trim().startsWith('//')).join('\n')
  : s);

const INPUT = read('components/vendor/InputBar.tsx');
const HOOKS = read('hooks/vendor/useVendorData.ts');
const CHAT  = read('hooks/vendor/useChat.ts');
const DEMO  = read('app/demo/vendor/[handle]/studio/page.tsx');
const CHAT_CODE = codeOf(CHAT);

let pass = 0, fail = 0, cures = 0, guards = 0;
const reds = [];
function cell(section, name, ok, kind = 'cure', why) {
  if (kind === 'cure') cures++; else guards++;
  if (ok) { pass++; return; }
  fail++; reds.push(`[${kind}] ${section}  ${name}${why ? `  ${why}` : ''}`);
}
const has  = (s, needle) => !!s && s.includes(needle);
const none = (s, needle) => !!s && !s.includes(needle);

// ── §6 · THE TODAY SLICE, VERBATIM FROM tdw09_home.proof.mjs ─────────────────
cell('6', 'useTodayData exists',            has(HOOKS, 'export function useTodayData'));
const TODAY_HOOK = (HOOKS || '').split('export function useTodayData')[1] || '';
cell('6', 'it rides the leads slice',       /useLoader<TodayResponse>\([\s\S]{0,200}?'leads',/.test(TODAY_HOOK));
cell('6', 'with its own cache row',         /'today',/.test(TODAY_HOOK));
cell('6', 'it subscribes to that slice',    /subscribeToSlice\('leads'/.test(TODAY_HOOK));

// ── §7 · THE DEMO TWIN-COMMENT ──────────────────────────────────────────────
cell('7', 'the demo twin-comment is re-pointed', has(DEMO, 'THREE, NOT FOUR'));

// ── §8 · THE VETOED PLACEHOLDER (R-O19) ─────────────────────────────────────
cell('8', 'placeholder (R-O19)',    has(INPUT, 'Ask anything\u2026') && none(INPUT, 'Ask DreamAi\u2026'));

// ── §10 · W-1 HELD ──────────────────────────────────────────────────────────
cell('10', 'no slice call entered the chat wire', none(CHAT_CODE, 'invalidateSlice'), 'guard');
cell('10', 'useChat still refreshes its own context', has(CHAT, 'refreshContext()'), 'guard');

const total = pass + fail;
console.log(`\nTDW_09 O-2 · home LIVE remainder @ ${ROOT}`);
console.log(`${pass}/${total} cells green  (${cures} cure · ${guards} guard)`);
if (fail) {
  console.log(`\nRED (${fail}):`);
  for (const r of reds) console.log(`   ${r}`);
  process.exit(1);
}
console.log('ALL GREEN\n');
