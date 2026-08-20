// scripts/tdw15_p3_daystogo.proof.ts
// ─────────────────────────────────────────────────────────────────────────────
// TDW_15 · P3 · ZIP 2 — THE PWA DAY-BOUNDARY CURE (F-15.17, R-35.23).
//
// Run via `scripts/run-tdw15-p3-daystogo-proof.sh` (the pwa has no test runner;
// the bands.proof.ts / crewCommit.proof.ts precedent, same harness). The wrapper
// compiles with `noEmitOnError`, so a type error stops the run rather than
// slipping past it.
//
// THIS PROOF IMPORTS THE REAL `lib/frost/tokens`. The canon itself is under
// test — not a re-declaration of it.
//
// ── EVERY CLOCK HERE IS A FIXTURE CLOCK ─────────────────────────────────────
// Not one cell reads the wall. A bench for a midnight bug that can only fail at
// midnight is not a bench. `withClock` swaps globalThis.Date for a fixed-instant
// stand-in and restores it in a `finally`; the no-arg constructor and Date.now()
// return the fixture and EVERY OTHER FORM DELEGATES TO THE REAL CONSTRUCTOR, so
// date-string parsing — the actual subject — is untouched by the fake.
//
// ── THE TZ CELLS ARE CHILD PROCESSES, AND THEY HAVE TO BE ───────────────────
// The ruled semantic is a PROPERTY: the answer depends only on the wall instant,
// never on the device's timezone. `process.env.TZ` is read by V8 once, so it
// cannot be varied in-process. §4 therefore re-executes THIS COMPILED FILE under
// four zones with TDW_PROBE set, at one fixed instant, and asserts all four
// print the same number. On the uncured tree they do not.
//
// ── BOTH-WAYS ───────────────────────────────────────────────────────────────
// Cured tree GREEN. Revert `daysUntilIst` in lib/frost/tokens.ts to the
// device-local `.setHours(0,0,0,0)` shape and §2/§3/§4 go RED; re-point
// app/coplanner/page.tsx at a local copy and §5 goes RED. Both are mutations of
// PRODUCTION code, never of test setup.
//
// FIXTURES DERIVED BY COMMAND, NEVER DRAFTED. Wedding 2027-02-14:
//   from IST 2026-08-20 -> 178   ·   from IST 2026-08-21 -> 177
//   2026-08-20T18:29:59Z = IST 2026-08-20 (23:59:59)
//   2026-08-20T18:30:00Z = IST 2026-08-21 (00:00:00)   <- the boundary
//   2026-08-20T20:00:00Z = IST 2026-08-21 (01:30)      <- inside the window
//     where a UTC-or-device basis and the IST basis disagree by exactly one day
// ─────────────────────────────────────────────────────────────────────────────

import { daysUntilIst, istDayKey, daysUntil } from '../lib/frost/tokens';
import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const WEDDING = '2027-02-14';
const IN_WINDOW = '2026-08-20T20:00:00Z';   // 01:30 IST on the 21st

// ── the fixture clock ────────────────────────────────────────────────────────
function withClock<T>(iso: string, fn: () => T): T {
  const Real = Date;
  const fixed = new Real(iso).getTime();
  function FakeDate(this: unknown, ...args: unknown[]) {
    if (args.length === 0) return new Real(fixed);
    return new (Real as any)(...(args as []));
  }
  (FakeDate as any).prototype = Real.prototype;
  (FakeDate as any).now = () => fixed;
  (FakeDate as any).parse = Real.parse;
  (FakeDate as any).UTC = Real.UTC;
  (globalThis as any).Date = FakeDate;
  try { return fn(); } finally { (globalThis as any).Date = Real; }
}

// ── THE PROBE ARM — this same file, re-executed under a foreign TZ ───────────
// Kept above the reporting harness so a probe run prints ONE line and nothing
// else. The parent parses that line; anything else is a failed probe, not a
// silent pass.
if (process.env.TDW_PROBE) {
  const at = process.env.TDW_PROBE_NOW as string;
  const out = withClock(at, () => daysUntilIst(WEDDING));
  process.stdout.write(String(out));
  process.exit(0);
}

let pass = 0, fail = 0;
const ok = (c: boolean, m: string) => {
  if (c) { pass++; console.log('  PASS  ' + m); }
  else { fail++; console.log('  FAIL  ' + m); }
};

// The device-local basis that STOOD in all three copies, reproduced ONLY as the
// thing being disagreed with. Cells compare against it rather than against a
// bare literal, so a cell cannot pass by coincidence.
function deviceLocalBasis(weddingDate: string, nowMs: number): number {
  const today = new Date(nowMs); today.setHours(0, 0, 0, 0);
  const t = new Date(weddingDate); t.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((t.getTime() - today.getTime()) / 86400000));
}

console.log('\nTDW_15 P3 · PWA DAY-BOUNDARY PROOF (F-15.17 / R-35.23)\n');

console.log('§1  the IST day key turns at IST midnight, not at the device\'s');
ok(istDayKey(new Date('2026-08-20T18:29:59Z')) === '2026-08-20',
  '18:29:59Z on the 20th is still IST 2026-08-20');
ok(istDayKey(new Date('2026-08-20T18:30:00Z')) === '2026-08-21',
  '18:30:00Z on the 20th has become IST 2026-08-21  [the boundary]');
ok(istDayKey(new Date('2026-11-19T00:00:00+05:30')) === '2026-11-19',
  'an explicit +05:30 instant (DEMO_WEDDING\'s shape) keeps its own IST day');
ok(istDayKey(new Date('nonsense')) === null,
  'an unparseable instant is null, never a wrong key');

console.log('\n§2  daysUntilIst — the ruled semantic');
{
  const before = withClock('2026-08-20T18:29:59Z', () => daysUntilIst(WEDDING));
  const after  = withClock('2026-08-20T18:30:00Z', () => daysUntilIst(WEDDING));
  ok(before !== null && after !== null && (before as number) - (after as number) === 1,
    `the number decrements by EXACTLY ONE across the IST midnight instant (${before} -> ${after})`);
}
{
  const ist = withClock(IN_WINDOW, () => daysUntilIst(WEDDING));
  const dev = deviceLocalBasis(WEDDING, new Date(IN_WINDOW).getTime());
  ok(ist === 177, `THE CURE — inside the window the answer is IST (got ${ist}, expected 177)`);
  ok(dev !== 177,
    `and it DISAGREES with the device-local basis (${dev}) — if this ever matches, this cell has stopped measuring the mechanism`);
}
ok(withClock('2026-08-20T06:00:00Z', () => daysUntilIst(WEDDING)) === 178,
  'NO REGRESSION — outside the window the number is 178, as it always was');

console.log('\n§3  the two emptinesses, and the ruled clamp');
ok(withClock(IN_WINDOW, () => daysUntilIst('2020-01-01')) === 0,
  'a wedding already PAST clamps to 0 (the ruled divergence from buildNudge)');
ok(withClock(IN_WINDOW, () => daysUntilIst(null)) === null,
  'an ABSENT date is null');
ok(withClock(IN_WINDOW, () => daysUntilIst(undefined)) === null,
  'undefined is null — coplanner\'s arm, preserved not widened');
ok(withClock(IN_WINDOW, () => daysUntilIst(null)) !== withClock(IN_WINDOW, () => daysUntilIst('2020-01-01')),
  'null and 0 are DIFFERENT ANSWERS and are never conflated');
ok(withClock(IN_WINDOW, () => daysUntil(new Date(WEDDING))) === 177,
  'daysUntil (the masthead\'s reader) rides the same home and returns a bare number');

console.log('\n§4  TZ-INVARIANCE — one instant, four devices, ONE number');
{
  const self = process.argv[1];
  const zones = ['Asia/Kolkata', 'UTC', 'America/New_York', 'Pacific/Auckland'];
  const answers: Record<string, string> = {};
  let probeFailed = '';
  for (const tz of zones) {
    try {
      answers[tz] = execFileSync(process.execPath, [self], {
        env: { ...process.env, TZ: tz, TDW_PROBE: '1', TDW_PROBE_NOW: IN_WINDOW },
        encoding: 'utf8',
      }).trim();
    } catch (e) { probeFailed = tz + ': ' + String(e); }
  }
  ok(probeFailed === '', `all four probes executed (${probeFailed || 'clean'})`);
  const distinct = Array.from(new Set(Object.values(answers)));
  ok(distinct.length === 1,
    `all four devices agree: ${JSON.stringify(answers)}`);
  ok(distinct.length === 1 && distinct[0] === '177',
    `and they agree on the IST answer, 177 (got ${JSON.stringify(distinct)})`);
  ok(answers['America/New_York'] !== undefined &&
     deviceLocalBasis(WEDDING, new Date(IN_WINDOW).getTime()) !== undefined,
    'the westward device is in the set — the half of F-15.17 the dream-os bench could not reach');
}

console.log('\n§5  ONE HOME — the fold, asserted at the source');
// SOURCE-TEXT CELLS, AND THE LIMITATION IS DISCLOSED RATHER THAN HIDDEN.
// app/coplanner/page.tsx is a 'use client' React page and cannot compile
// standalone in plain node (the bands.proof.ts precedent states the same thing
// about CalendarBands.tsx). These two assert the SURFACE — that one home exists
// and the defect shape is gone — never an address, never a line (F-15.12).
//
// The wrapper `cd`s to the repo root, so cwd is the tree under test; that is
// also what makes the proof honest when the floor runs it from elsewhere.
//
// AND THEY ARE COUNTED COMMENT-STRIPPED. The first draft of these cells reddened
// on a CURED tree, because the cure's own headers NAME `.setHours(0,0,0,0)` as
// the defect they cure — the instrument was reading the paragraph that describes
// the disease as the disease. Same class as the Dream census's own note ("a raw
// count let the artifact inflate the census it describes") and as R-33.10's law
// that an instrument is itself subject to the both-ways standard. Caught by the
// run, not by a grep over it.
//
// The stripper is deliberately simple and its limitation is stated: a `//` inside
// a string literal would be over-stripped. No cell below depends on one.
{
  const root = process.cwd();
  const stripComments = (src: string) =>
    src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^[ \t]*\/\/.*$/gm, '');
  const read = (rel: string) => stripComments(fs.readFileSync(path.join(root, rel), 'utf8'));
  const cop = read('app/coplanner/page.tsx');
  ok(/daysUntilIst/.test(cop) && !/function\s+daysUntil\s*\(/.test(cop),
    'app/coplanner/page.tsx calls the one home and declares no local copy');
  ok(!/setHours\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)/.test(cop),
    'and the device-local flattening is gone from it entirely');
  const tok = read('lib/frost/tokens.ts');
  ok(!/setHours\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)/.test(tok),
    'the one home carries no device-local flattening either');
}

console.log('\n─────────────────────────────────────────────');
console.log(`  PASS ${pass}   FAIL ${fail}\n`);
process.exit(fail ? 1 : 0);
