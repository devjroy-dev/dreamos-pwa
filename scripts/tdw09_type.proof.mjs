#!/usr/bin/env node
/**
 * TDW_09 · T-1 — THE TYPE PROOF (Q-2, ruled at CE-194)
 *
 * WHY THIS EXISTS. The type pass moved 412 sites across 62 files and shipped with
 * NOTHING in the floor guarding it. The census instrument was runnable, so
 * Q-SP-5 was technically met — but runnable is not asserted, and an unguarded
 * sixty-two-file property erodes one convenient exception at a time. The gap was
 * the executor's own, reported in its packet rather than discovered later.
 *
 * WHAT IT ASSERTS, AND WHAT IT REFUSES TO ASSERT (R-T1-AMENDED as ratified at Q-3).
 * Every cell reads `scripts/tdw09_type_census.mjs`'s OWN OUTPUT and tests a
 * PROPERTY. Not one integer is quoted. The reason is written in this arc's blood:
 * a same-line grep produced 103/156 where the truth was 251/8, a chair certified
 * it by the same method, and a founder ruled on the wrong number. A cell pinned
 * to `331` would red the first honest run after the next surface ships, and a
 * cell pinned to `287` is ALREADY false — the pass consumed it. The register's
 * size is a witnessed datum for the ledger; it is not a bar.
 *
 * THE INSTRUMENT IS IMPORTED, NEVER REIMPLEMENTED. A bench that re-derived the
 * engraved test would be a second implementation free to drift from the one the
 * cure used — which is how a census and a cure stop agreeing without either
 * being wrong on its own terms.
 */
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
process.on('uncaughtException', (e) => { console.error('BENCH THREW (unexpected):', e && e.stack || e); process.exit(2); }); // F-39.67: top-level await has no .catch and its rejection surfaces as an uncaught exception (measured, not unhandledRejection); a throw is an ERROR (2), never node's 1

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const CENSUS_PATH = path.join(HERE, 'tdw09_type_census.mjs');

if (!fs.existsSync(CENSUS_PATH)) {
  console.error('REFUSED — scripts/tdw09_type_census.mjs is absent. This bench asserts that');
  console.error('instrument\'s output and has nothing to say without it.');
  process.exit(3); // F-39.47/F-39.55: a refusal exits 3 — named, never a FAIL, never in a base
}

let pass = 0, fail = 0;
const ok = (name, cond, why = '') => {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.log(`  FAIL ${name}`); if (why) console.log(`        ${why}`); }
};
const H = (t) => console.log(`\n══ ${t} ══\n`);

/** Re-import the instrument fresh so a mutation of production source reaches it.
 *  A module-level snapshot makes every mutation cell below vacuous — the specimen
 *  for that is in this arc's own record (tdw09_surface §M.1/§M.2, caught green). */
async function read(root = REPO) {
  process.env.TDW_PWA = root;
  const m = await import(`${CENSUS_PATH}?t=${Date.now()}${Math.random()}`);
  return { m, c: m.census() };
}

console.log('════════════════════════════════════════════════════════════');
console.log('TDW_09 T-1 · TYPE PROOF — properties, never integers');
console.log('════════════════════════════════════════════════════════════');

const { m: M, c: C } = await read();
const under = C.body.filter(b => b.size < M.BODY_FLOOR);
const subReg = C.engraved.filter(e => e.size < M.REGISTER_FLOOR);
const rungCount = M.RUNGS.register.length + M.RUNGS.body.length;

console.log(`       lanes ${M.LANES.join(' ')}`);
console.log(`       sites ${C.engraved.length + C.body.length} · engraved ${C.engraved.length} · body ${C.body.length}`);
console.log(`       declared sizes ${C.sizes.size} · rungs ${rungCount}`);

// ═════════════════════════════════════════════════════════════════════════════
H('§A · THE BODY FLOOR HOLDS (R-T4, the blanket arm)');

if (under.length) under.slice(0, 12).forEach(b => console.log(`       ${b.file}:${b.line}  ${b.size}px`));
ok('§A.1 no non-engraved site renders below the body floor',
  under.length === 0,
  `${under.length} site(s) under ${M.BODY_FLOOR}px — the arm the founder ruled 「 broad 」 has been breached`);

ok('§A.2 the floor is the one the ruling names, not one this bench invented',
  M.BODY_FLOOR === 16);

// ═════════════════════════════════════════════════════════════════════════════
H('§B · THE ENGRAVED REGISTER SURVIVES, EXEMPT (R-T1 · R-T2 · Q-3)');

// NOT a count. The register must merely still EXIST — a pass that "fixed" the
// labels by raising them to 16px would satisfy §A and destroy the voice the
// founder kept in his own words. This cell is what stands between those two.
ok('§B.1 the engraved register is non-empty — the voice the founder kept still exists',
  C.engraved.length > 0,
  'zero engraved sites means the register was swept into the body, not exempted');

ok('§B.2 the register is genuinely EXEMPT — it still lives below the body floor',
  C.engraved.some(e => e.size < M.BODY_FLOOR),
  'an exemption that renders at or above the floor is not an exemption, it is a coincidence');

if (subReg.length) subReg.slice(0, 12).forEach(e => console.log(`       ${e.file}:${e.line}  ${e.size}px`));
ok('§B.3 no engraved site renders below the register floor (R-T2)',
  subReg.length === 0,
  `${subReg.length} site(s) under ${M.REGISTER_FLOOR}px — the same voice rendered past legibility`);

// ═════════════════════════════════════════════════════════════════════════════
H('§C · THE SCALE IS A SCALE (R-T4 — "a scale, not 287 hand-edits")');

ok('§C.1 every declared size resolves to a named rung',
  C.sizes.size <= rungCount,
  `${C.sizes.size} declared sizes against ${rungCount} rungs — ad-hoc sizes have re-entered`);

const allRungs = new Set([...M.RUNGS.register, ...M.RUNGS.body]);
const strays = [...C.sizes.keys()].filter(s => !allRungs.has(s));
if (strays.length) console.log(`       strays: ${strays.join(', ')}`);
ok('§C.2 and every declared size IS one of the rungs, not merely as few as them',
  strays.length === 0,
  'a size count that matches by accident is not a scale');

ok('§C.3 the instrument resolves nothing into ambiguity',
  C.unresolved.length === 0,
  'a style object the scanner cannot read is a site nobody is guarding');

// ═════════════════════════════════════════════════════════════════════════════
H('§D · THE INSTRUMENT IS THE AUTHORITY, AND SAYS SO');

const SRC = fs.readFileSync(CENSUS_PATH, 'utf8');
ok('§D.1 the census refuses with a named reason rather than reporting a silent zero',
  /REFUSED — /.test(SRC) && /not a measurement, it is a broken read set/.test(SRC));
ok('§D.2 it carries the inversion in its own header, so the next reader inherits the tuition',
  /INVERTED/.test(SRC) && /103\/156/.test(SRC) && /SAME[\s*]+SOURCE LINE/.test(SRC),
  'the header is the only place the next reader will meet the 103/156 tuition');
ok('§D.3 the applier lives beside the census — one implementation, not two',
  /--apply/.test(SRC) && /rungFor\(size, engraved\)/.test(SRC));
ok('§D.4 the size pattern accepts fractional sizes (D-1: `fontSize: 10.5` broke four files)',
  /\\d\{1,2\}\(\?:\\\.\\d\+\)\?/.test(SRC),
  'an integer-only pattern strands the fraction and writes lineHeight: 1.5.5');

// ═════════════════════════════════════════════════════════════════════════════
H('§M · MUTATIONS OVER PRODUCTION SOURCE — RED AT THE BROKEN TREE, BOTH WAYS');

async function okMutate(name, rel, from, to, check, guards) {
  const abs = path.join(REPO, rel);
  const orig = fs.readFileSync(abs, 'utf8');
  const n = orig.split(from).length - 1;
  if (n !== 1) { fail++; console.log(`  FAIL ${name}`); console.log(`        anchor must appear EXACTLY ONCE in ${rel} (found ${n})`); return; }
  fs.writeFileSync(abs, orig.replace(from, to));
  let red = false;
  try { await check(); } catch { red = true; }
  fs.writeFileSync(abs, orig);
  ok(name, red, `mutating ${rel} did not red ${guards} — the cell is vacuous`);
}

// A real surface, mutated in production source: one body site pushed back under
// the floor. The specimen is the sheet the founder walked twice.
// §M.1 RETIRED-WITH-THE-READER at P7.2 ZIP 1b (CE-39, 2026-09-04). §0.2: its specimen was
// `app/vendor/studio/team/page.tsx`, DELETED at the flip. The surface that replaced it,
// `components/worklist/StudioSheets.tsx` (MemberSheet), carries ZERO `fontSize` literals — it
// types entirely through the CSS rungs (`var(--wl-t1)`, `.wl-fi`, `.wl-fl`), so no site exists
// with the size tuple this cell mutates; rewriting the fragment would mean inventing a literal
// on a token-driven surface. Assertion and both fragments quoted in
// docs/reports/P72_ZIP1b_RETIRED_CELLS.md. F-39.83 opens the token-discipline bench that asks
// this question in the rung vocabulary instead.

// The cell §B.1 exists for exactly this: a "cure" that raises the labels too.
// §M.2 — mutated on a surface whose register population is EXACTLY ONE, derived,
// not chosen by eye. The first draft mutated a single label on the Edit Member
// sheet and went green: that surface carries three engraved sites, so raising one
// left the property intact and the cell proved nothing. A mutation that cannot
// move the thing it guards is the vacuous-green failure mode this section exists
// to catch, and it caught itself.
await okMutate('§M.2 §B.2 reds when a surface\'s whole register is swept into the body',
  'components/vendor/ListSlicePicker.tsx',
  "fontFamily: 'var(--font-jost)', fontWeight: 300, fontSize: 9,",
  "fontFamily: 'var(--font-jost)', fontWeight: 300, fontSize: 16,",
  async () => {
    const { m, c } = await read();
    assert.ok(c.engraved.some(e => e.file.endsWith('ListSlicePicker.tsx') && e.size < m.BODY_FLOOR));
  },
  '§B.2');

// §M.3 RETIRED-WITH-THE-READER at P7.2 ZIP 1b (CE-39, 2026-09-04). §0.2: its specimen was
// `app/vendor/studio/team/page.tsx`, DELETED at the flip. The surface that replaced it,
// `components/worklist/StudioSheets.tsx` (MemberSheet), carries ZERO `fontSize` literals — it
// types entirely through the CSS rungs (`var(--wl-t1)`, `.wl-fi`, `.wl-fl`), so no site exists
// with the size tuple this cell mutates; rewriting the fragment would mean inventing a literal
// on a token-driven surface. Assertion and both fragments quoted in
// docs/reports/P72_ZIP1b_RETIRED_CELLS.md. F-39.83 opens the token-discipline bench that asks
// this question in the rung vocabulary instead.
// §M.4 RETIRED-WITH-THE-READER at P7.2 ZIP 1b (CE-39, 2026-09-04). §0.2: its specimen was
// `app/vendor/studio/team/page.tsx`, DELETED at the flip. The surface that replaced it,
// `components/worklist/StudioSheets.tsx` (MemberSheet), carries ZERO `fontSize` literals — it
// types entirely through the CSS rungs (`var(--wl-t1)`, `.wl-fi`, `.wl-fl`), so no site exists
// with the size tuple this cell mutates; rewriting the fragment would mean inventing a literal
// on a token-driven surface. Assertion and both fragments quoted in
// docs/reports/P72_ZIP1b_RETIRED_CELLS.md. F-39.83 opens the token-discipline bench that asks
// this question in the rung vocabulary instead.

console.log('\n════════════════════════════════════════════════════════════');
console.log(`tdw09_type: ${pass} passed, ${fail} failed`);
console.log('════════════════════════════════════════════════════════════');
process.exit(fail ? 1 : 0);
