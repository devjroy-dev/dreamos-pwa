#!/usr/bin/env node
/**
 * TDW_09 · F-09.32 · F-09.33 · F-09.34 · F-09.35 — THE SURFACE PROOF
 *
 * WHAT THIS BENCH IS FOR. The founder's walk of 2026-08-05 found the vendor app
 * legible on Espresso and, on Editorial Paper, "borderless, stateless, formless".
 * Two studio pages rendered blank. The cause was never one bad colour: it was a
 * HALF-FINISHED ADOPTION — `lib/vendor/theme.ts` authored and per-theme-solved
 * every role these surfaces needed, and the surfaces reached past them for
 * hardcoded literals that render identically on both themes.
 *
 * WHY THE CELLS ASSERT RATIOS AND NOT VALUES (R-S3, verbatim: "the bench asserts
 * the >=3:1 property on the composited pair, both themes — never the alpha").
 * An alpha is a means; the readable pair is the end. A cell pinned to `0.58`
 * goes red on a re-tune the founder asked for and stays green on a re-tune that
 * breaks the page. So every number below is COMPUTED here, from the values read
 * out of the production token file, and compared against the bar.
 *
 * METHOD-RIDES-THE-NUMBER: every ratio prints its own derivation chain
 * (page -> +scrim -> +sheet -> the pair) so a reader can check it by hand.
 *
 * BARS: 4.5:1 body text · 3:1 large text and non-text UI (WCAG 1.4.11 — "visual
 * information required to identify user interface components").
 */
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.env.TDW_PWA || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const probe of ['lib/vendor/theme.ts', 'app/globals.css']) {
  if (!fs.existsSync(path.join(ROOT, probe))) {
    console.error(`REFUSED — ${ROOT} is not a dreamos-pwa clone: ${probe} absent.`);
    process.exit(3); // F-39.47/F-39.55: a refusal exits 3 — named, never a FAIL, never in a base
  }
}
const read = (rel) => {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) { console.error(`REFUSED — stale read set: ${rel} absent.`); process.exit(3); /* F-39.47/F-39.55: a refusal exits 3 — named, never a FAIL, never in a base */ }
  return fs.readFileSync(abs, 'utf8');
};
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const code = (rel) => strip(read(rel));

let pass = 0, fail = 0;
const ok = (name, cond, why = '') => {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.log(`  FAIL ${name}`); if (why) console.log(`        ${why}`); }
};
const H = (t) => console.log(`\n══ ${t} ══\n`);

// ── the compositor ────────────────────────────────────────────────────────────
const hex = (h) => { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
const parse = (s) => {
  if (s.startsWith('#')) return { c: hex(s), a: 1 };
  const m = s.match(/rgba?\(([^)]+)\)/); const p = m[1].split(',').map(x => parseFloat(x.trim()));
  return { c: [p[0], p[1], p[2]], a: p.length > 3 ? p[3] : 1 };
};
const over = (fg, bg) => fg.c.map((v, i) => fg.a * v + (1 - fg.a) * bg[i]);
const lum = (c) => { const f = c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2]; };
const ratio = (a, b) => { const L1 = lum(a), L2 = lum(b); const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1]; return (hi + 0.05) / (lo + 0.05); };
const r2 = (n) => Math.round(n * 100) / 100;
const px = (c) => '#' + c.map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();

// ── read the tokens OUT OF PRODUCTION, never a copy ───────────────────────────
// RE-READ PER CALL, deliberately. A module-level snapshot of the token file makes
// every mutation cell below VACUOUS: the mutation rewrites production source and
// the reader under test keeps answering from a copy taken before it. Caught by
// §M.1/§M.2 going green over a boundary that had been put back under the bar —
// the mutation section catching a defect in the bench that owns it.
function tokens(setName) {
  const THEME = read('lib/vendor/theme.ts');
  const block = THEME.split(`export const ${setName}: ThemeTokens = {`)[1].split('\n};')[0];
  const grab = (key) => {
    const m = block.match(new RegExp(`\\b${key}\\s*:\\s*'([^']+)'`));
    assert.ok(m, `${setName}.${key} not found in lib/vendor/theme.ts`);
    return m[1];
  };
  return { pageBg: grab('pageBg'), scrim: grab('scrim'), sheet: grab('sheet'), ink: grab('ink'),
           inkMute: grab('inkMute'), inputBg: grab('inputBg'), inputBorder: grab('inputBorder') };
}
/** page -> +scrim -> +sheet : the surface an open sheet's contents actually sit on. */
function sheetSurface(t) {
  const page = parse(t.pageBg).c;
  const veil = over(parse(t.scrim), page);
  return { page, veil, sheet: over(parse(t.sheet), veil) };
}

const SETS = { DARK: tokens('DARK'), LIGHT: tokens('LIGHT') };  // snapshot for the static cells
const SHEET = 'app/vendor/studio/team/page.tsx';
const DEMO_SHEET = 'app/demo/vendor/[handle]/studio/team/page.tsx';
const CTX = 'lib/vendor/ThemeContext.tsx';
const CSS = 'app/globals.css';

console.log('════════════════════════════════════════════════════════════');
console.log('TDW_09 SURFACE PROOF — the vendor lane on BOTH themes');
console.log('════════════════════════════════════════════════════════════');

// ═════════════════════════════════════════════════════════════════════════════
H('§1 · THE FIELD BOUNDARY EARNS THE 3:1 UI BAR — ON BOTH THEMES (R-S3)');

for (const [name, t] of Object.entries(SETS)) {
  const s = sheetSurface(t);
  const edge = over(parse(t.inputBorder), s.sheet);
  const r = ratio(edge, s.sheet);
  console.log(`       ${name}: page ${px(s.page)} -> +scrim ${px(s.veil)} -> +sheet ${px(s.sheet)} | edge ${px(edge)} = ${r2(r)}:1`);
  ok(`§1.${name === 'DARK' ? 1 : 2} the ${name === 'DARK' ? 'Espresso' : 'Paper'} field edge clears 3:1 against the sheet it sits on`,
    r >= 3.0,
    `measured ${r2(r)}:1 — a control whose edge is under the bar is not identifiable as a control`);
}

// A literal-only pass IS the failure mode this sitting exists to end: the fill
// cannot carry the box on paper, so the edge is load-bearing and must be proven
// separately from it. This cell states that in numbers rather than in prose.
for (const [name, t] of Object.entries(SETS)) {
  const s = sheetSurface(t);
  const fill = over(parse(t.inputBg), s.sheet);
  console.log(`       ${name}: fill ${px(fill)} vs sheet = ${r2(ratio(fill, s.sheet))}:1 (why the EDGE is load-bearing)`);
}
ok('§1.3 the fill alone does NOT reach the bar on either theme — recorded, so nobody "simplifies" the edge away',
  Object.values(SETS).every(t => { const s = sheetSurface(t); return ratio(over(parse(t.inputBg), s.sheet), s.sheet) < 3.0; }));

// ═════════════════════════════════════════════════════════════════════════════
H('§2 · THE INK ROLES READ FROM THE TOKEN FILE — BOTH THEMES CLEAR THE BODY BAR');

for (const [name, t] of Object.entries(SETS)) {
  const s = sheetSurface(t);
  const mute = over(parse(t.inkMute), s.sheet);
  const ink  = over(parse(t.ink), s.sheet);
  console.log(`       ${name}: label ${px(mute)} = ${r2(ratio(mute, s.sheet))}:1 | form ink ${px(ink)} = ${r2(ratio(ink, s.sheet))}:1`);
  ok(`§2.${name === 'DARK' ? 1 : 2} the ${name === 'DARK' ? 'Espresso' : 'Paper'} label role clears the 4.5 body bar on the sheet`,
    ratio(mute, s.sheet) >= 4.5);
}
// THE DEFECT, IN ONE CELL: the literal the sheet used to carry, measured on both.
{
  const LIT = 'rgba(248,247,245,0.45)';
  const rows = Object.entries(SETS).map(([n, t]) => {
    const s = sheetSurface(t); return [n, ratio(over(parse(LIT), s.sheet), s.sheet)];
  });
  rows.forEach(([n, r]) => console.log(`       the RETIRED literal ${LIT} on ${n} = ${r2(r)}:1`));
  ok('§2.3 the retired label literal failed the body bar on BOTH themes — not just on paper',
    rows.every(([, r]) => r < 4.5),
    'if this ever passes, the literal was not the defect and this sitting misdiagnosed');
}

// ═════════════════════════════════════════════════════════════════════════════
// ═══ §3–§7 RETIRED-WITH-THE-READER — P7.2 ZIP 1b (CE-39, 2026-09-04) ════════════
// These five sections read `app/vendor/studio/team/page.tsx` — the Edit Member sheet — DELETED
// at the flip (R-39.24, arm (a)). A twin EXISTS: the sheet crossed into the shell as
// `MemberSheet` in `components/worklist/StudioSheets.tsx`, which carries all four token roles
// these cells were written for. But the assertions pin the OLD surface's BYTE FORMS
// (`backgroundColor: 'var(--atelier-input-bg)'`, `D.border`, `fontSize:` literals), and the
// shell sheet expresses the same discipline through CSS rungs and classes (`var(--wl-t1)`,
// `.wl-fi`, `.wl-fl`) with ZERO size literals. Re-pointing the read alone yields 31 failures;
// loosening the regexes until they pass would turn a bench that proves something into a bench
// that fits a surface.
//
// CHAIR RULING: retire the five sections with their assertions quoted in
// `docs/reports/P72_ZIP1b_RETIRED_CELLS.md`, and open F-39.83 — a fresh token-discipline bench
// against `StudioSheets.tsx` in Block 09, written FROM THE MOCK'S TOKENS rather than ported
// from this sheet's bytes. 13 cells retired here; §1–§2 and §8 stay, on live subjects.
// ═══════════════════════════════════════════════════════════════════════════════

// §M.7/M.8 (mutations over the deleted sheet) RETIRED-WITH-THE-READER at P7.2 ZIP 1b: it reads
// `app/vendor/studio/team/page.tsx`, DELETED at the flip. Quoted in
// docs/reports/P72_ZIP1b_RETIRED_CELLS.md; F-39.83 carries the question forward.
// ═════════════════════════════════════════════════════════════════════════════
H('§9 · THE CENSUS INSTRUMENT IS THE RESIDUE OWNER (R-S1 · PROPERTY-OVER-ROSTER)');

const CENSUS = fs.existsSync(path.join(ROOT, 'scripts/tdw09_surface_census.mjs'))
  ? read('scripts/tdw09_surface_census.mjs') : '';   // soft, same reason as §6.3
ok('§9.1 the instrument is committed and runnable from any working directory',
  CENSUS !== '');
ok('§9.2 it finds the species by NORMALIZED NUMERIC PARSE, never by spelling',
  /NORMALIZED NUMERIC PARSE/.test(CENSUS) && /const RGBA = \/rgba\?\\\(/.test(CENSUS));
ok('§9.3 it refuses with a named reason outside a pwa clone — not a silent zero',
  /REFUSED — /.test(CENSUS));
ok('§9.4 its held-out surface carries its reasons in-file, so the exclusion is arguable',
  /HELD_OUT/.test(CENSUS) && /pinned="dark"/.test(CENSUS));

// ═════════════════════════════════════════════════════════════════════════════
H('§M · MUTATIONS OVER PRODUCTION SOURCE — RED AT THE BROKEN TREE, BOTH WAYS');

function okMutate(name, rel, from, to, assertFn, guards) {
  const abs = path.join(ROOT, rel);
  const orig = fs.readFileSync(abs, 'utf8');
  const n = orig.split(from).length - 1;
  if (n !== 1) { fail++; console.log(`  FAIL ${name}`); console.log(`        anchor must appear EXACTLY ONCE in ${rel} (found ${n})`); return; }
  fs.writeFileSync(abs, orig.replace(from, to));
  let red = false;
  try { assertFn(); } catch { red = true; }
  fs.writeFileSync(abs, orig);
  ok(name, red, `mutating ${rel} did not red ${guards} — the cell is vacuous`);
}

okMutate('§M.1 §1.1/§1.2 red if the espresso boundary is put back under the bar',
  'lib/vendor/theme.ts', "inputBorder:'rgba(201,168,76,0.52)'", "inputBorder:'rgba(201,168,76,0.28)'",
  () => { const t = tokens('DARK'); const s = sheetSurface(t);
          assert.ok(ratio(over(parse(t.inputBorder), s.sheet), s.sheet) >= 3.0); }, '§1.1');

okMutate('§M.2 §1.1/§1.2 red if the PAPER boundary is put back under the bar',
  'lib/vendor/theme.ts', "inputBorder:'rgba(122,56,40,0.58)'", "inputBorder:'rgba(122,56,40,0.28)'",
  () => { const t = tokens('LIGHT'); const s = sheetSurface(t);
          assert.ok(ratio(over(parse(t.inputBorder), s.sheet), s.sheet) >= 3.0); }, '§1.2');

// §M.7/M.8 (mutations over the deleted sheet) RETIRED-WITH-THE-READER at P7.2 ZIP 1b: it reads
// `app/vendor/studio/team/page.tsx`, DELETED at the flip. Quoted in
// docs/reports/P72_ZIP1b_RETIRED_CELLS.md; F-39.83 carries the question forward.
// §M.7/M.8 (mutations over the deleted sheet) RETIRED-WITH-THE-READER at P7.2 ZIP 1b: it reads
// `app/vendor/studio/team/page.tsx`, DELETED at the flip. Quoted in
// docs/reports/P72_ZIP1b_RETIRED_CELLS.md; F-39.83 carries the question forward.
okMutate('§M.6 §5.2 reds if globals.css drifts from the token owner again (F-09.35)',
  CSS, '--atelier-input-border:rgba(122,56,40,0.58)', '--atelier-input-border:rgba(122,56,40,0.22)',
  () => { const m = code(CSS).match(/html\.theme-light\s*\{[\s\S]*?--atelier-input-border:\s*([^;]+);/);
          assert.strictEqual(m[1].trim(), SETS.LIGHT.inputBorder); }, '§5.2');

// §M.7/M.8 (mutations over the deleted sheet) RETIRED-WITH-THE-READER at P7.2 ZIP 1b: it reads
// `app/vendor/studio/team/page.tsx`, DELETED at the flip. Quoted in
// docs/reports/P72_ZIP1b_RETIRED_CELLS.md; F-39.83 carries the question forward.
console.log('\n════════════════════════════════════════════════════════════');
console.log(`tdw09_surface: ${pass} passed, ${fail} failed`);
console.log('════════════════════════════════════════════════════════════');
process.exit(fail ? 1 : 0);
