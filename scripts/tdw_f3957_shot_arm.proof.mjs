#!/usr/bin/env node
// scripts/tdw_f3957_shot_arm.proof.mjs
// F-39.57 · THE MOCK SHOT ARM READS PAPER GEOMETRY OFF THE FRAME
//
// The finding: `tools/mock_shot.cjs` shot every frame at 374 (390 if primary) x 844 in
// dark and light. S2's subject is an A4 DOCUMENT, and all three of those constants are
// wrong for paper. The chair ruled the arm WIDENS by opt-in read out of the file —
// `data-shot-width`, `data-shot-height`, `data-shot-modes` on the frame — rather than by
// a second arm or a table of per-file exceptions living beside it.
//
// ── WHAT THIS PROOF ASSERTS, AND WHY IT DOES NOT LAUNCH A BROWSER ───────────
// The claim that earns the widening is A NEGATIVE ONE: every pre-existing frame resolves
// to the SAME (width, height, mode) tuples it resolved to before, so all 78 committed
// captures keep their names and their bytes. That is a claim about the arm's RESOLUTION,
// and resolution is a pure function of the file's text. Shooting 84 real frames to prove
// it would take minutes of Chromium on every floor run to re-derive an answer that
// arithmetic already has — and the empirical run was done once, at the sitting, and is
// recorded in the delivery: 78 of 78 shas byte-identical across the change.
//
// So this cell reimplements NOTHING. It requires the arm's own file, extracts its own
// `shotOf`, and drives it over the real mocks in docs/mocks/. If the arm's regex moves,
// this moves with it.
//
// ── THE MUTATION, AND WHAT MAKES IT NOT HOLLOW ──────────────────────────────
// §4 edits the production arm so a declared width stops overriding the primary rule, and
// re-runs THIS script in a fresh process. On the uncured tree the paper frames resolve to
// two widths and the cell goes RED. A cell that passed on the uncured tree would be
// proving that the attribute is read, not that it GOVERNS.
//
// EXIT: 0 pass · 1 fail · 2 error · 3 refused. (S4's channel, CE-39.)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const SELF = fileURLToPath(import.meta.url);
const ROOT = path.join(path.dirname(SELF), '..');
const CELLS_ONLY = process.argv.includes('--cells-only');

let pass = 0, fail = 0;
const ok = (n, c, d) => {
  if (c) { pass++; console.log('  ok   ' + n); }
  else { fail++; console.log('  FAIL ' + n + (d ? '  \u2192 ' + d : '')); }
};
const sec = (t) => console.log('\n' + t);

const ARM_REL = 'tools/mock_shot.cjs';
const ARM = path.join(ROOT, ARM_REL);
const MOCKS = path.join(ROOT, 'docs/mocks');

// ── THE ARM'S OWN FUNCTIONS, LIFTED — never retyped ──────────────────────────
// `mock_shot.cjs` is a CommonJS script with a top-level IIFE that launches a browser, so
// it cannot simply be imported. Its three pure functions are extracted by name and
// evaluated. This is the comment-blindness law's sibling: assert against what the file
// SAYS, not against a copy of what it said when this cell was written.
function armFns() {
  const src = fs.readFileSync(ARM, 'utf8');
  const grab = (name) => {
    const at = src.indexOf('function ' + name + '(');
    if (at < 0) throw new Error('arm has no function ' + name + '() \u2014 ' + ARM_REL);
    // brace-match from the header's opening brace
    let i = src.indexOf('{', at), depth = 0;
    for (let j = i; j < src.length; j++) {
      if (src[j] === '{') depth++;
      else if (src[j] === '}') { depth--; if (depth === 0) return src.slice(at, j + 1); }
    }
    throw new Error('unbalanced braces reading ' + name + '() \u2014 ' + ARM_REL);
  };
  const body = [grab('framesOf'), grab('primaryOf'), grab('shotOf')].join('\n');
  // eslint-disable-next-line no-new-func
  return new Function(body + '\nreturn { framesOf, primaryOf, shotOf };')();
}

// The resolution the arm performs per frame, read out of the arm's loop rather than
// assumed. If someone edits the loop and not this line, §3's paper cell fails.
function resolveLine() {
  const src = fs.readFileSync(ARM, 'utf8');
  const m = /const widths = ([^\n]+)\n/.exec(src);
  return m ? m[1].trim() : '';
}

function tuples(file) {
  const { framesOf, primaryOf, shotOf } = armFns();
  const html = fs.readFileSync(file, 'utf8');
  const ids = framesOf(html);
  const primary = new Set(primaryOf(ids));
  const out = [];
  for (const id of ids) {
    const g = shotOf(html, id);
    const widths = g.width ? [g.width] : (primary.has(id) ? [374, 390] : [374]);
    const height = g.height || 844;
    const modes = g.modes || ['dark', 'light'];
    for (const w of widths) for (const mode of modes) out.push({ id, w, height, mode });
  }
  return out;
}

const mockFiles = () => fs.readdirSync(MOCKS).filter((f) => f.endsWith('-mock.html')).sort()
  .map((f) => path.join(MOCKS, f));

// ═══ §1 · THE ARM IS PRESENT AND CARRIES THE OPT-IN ═════════════════════════
sec('\u00a71 \u00b7 the arm');
let armSrc = '';
try { armSrc = fs.readFileSync(ARM, 'utf8'); }
catch { console.log('REFUSED \u2014 ' + ARM_REL + ' is absent'); process.exit(3); }

ok('the arm declares shotOf()', /function shotOf\(/.test(armSrc));
for (const a of ['data-shot-width', 'data-shot-height', 'data-shot-modes']) {
  ok('the arm reads ' + a, armSrc.includes(a.replace('data-shot-', "'data-shot-' + name")) ||
    armSrc.includes(a) || /pick\('(width|height|modes)'\)/.test(armSrc), 'attribute not read');
}
ok('the filename shape is unmoved', armSrc.includes("stem + '__' + id + '__' + mode + '__' + w"),
  'the capture name moved \u2014 78 committed PNGs would be orphaned');

// ═══ §2 · THE LEGACY FRAMES RESOLVE EXACTLY AS BEFORE ═══════════════════════
// The pre-widening arm's rule, written out ONCE here as the thing being compared against.
// This is the only place in the file that restates old behaviour, and it restates it as a
// SPECIFICATION rather than as a copy of the implementation.
sec('\u00a72 \u00b7 the legacy frames \u2014 no capture may move');
const LEGACY = ['books-register-mock.html', 'studio-rooms-mock.html',
  'studio-sheets-mock.html', 'today-working-mock.html', 'today-stature-mock.html'];

let legacyTuples = 0, legacyFrames = 0, drift = [];
for (const name of LEGACY) {
  const file = path.join(MOCKS, name);
  if (!fs.existsSync(file)) { console.log('  SKIP ' + name + ' \u2014 absent'); continue; }
  const { framesOf, primaryOf } = armFns();
  const html = fs.readFileSync(file, 'utf8');
  const ids = framesOf(html);
  const primary = new Set(primaryOf(ids));
  legacyFrames += ids.length;
  const want = [];
  for (const id of ids) {
    for (const w of (primary.has(id) ? [374, 390] : [374]))
      for (const mode of ['dark', 'light']) want.push(id + '|' + w + '|844|' + mode);
  }
  const got = tuples(file).map((t) => t.id + '|' + t.w + '|' + t.height + '|' + t.mode);
  legacyTuples += want.length;
  if (want.join(',') !== got.join(',')) drift.push(name);
}
ok('every legacy frame resolves to its pre-widening tuples', drift.length === 0,
  drift.join(', '));
// COUNTS ARE ASSERTED, NOT PRINTED. A census that only prints cannot fail, and the whole
// point of the widening was that nothing below moves.
ok('legacy frame count is 26', legacyFrames === 26, 'saw ' + legacyFrames);
ok('legacy capture count is 78', legacyTuples === 78, 'saw ' + legacyTuples);
ok('no legacy frame declares a shot attribute', LEGACY.every((n) => {
  const f = path.join(MOCKS, n);
  return !fs.existsSync(f) || !/data-shot-(width|height|modes)/.test(fs.readFileSync(f, 'utf8'));
}), 'a legacy mock grew an opt-in');

// ═══ §3 · THE PAPER FRAMES ══════════════════════════════════════════════════
sec('\u00a73 \u00b7 the paper frames');
const PAPER = path.join(MOCKS, 'invoice-document-mock.html');
if (!fs.existsSync(PAPER)) {
  console.log('  FAIL invoice-document-mock.html is absent'); fail++;
} else {
  const t = tuples(PAPER);
  const ids = [...new Set(t.map((x) => x.id))];
  // ── AMENDED BY LABEL — G2, COUNT MOVED · RATIFY-OR-REVERT ────────────────
  // SIX BECAME SEVEN when `S3-seal` joined this mock (R-G2.8, the seal on the
  // invoice). The G2 seat shipped that frame WITHOUT RUNNING THIS PROOF and so
  // shipped this red undetected — e-8, owned here at the site of the damage.
  //
  // THE PROPERTY THIS SECTION EXISTS FOR IS THE PAPER OPT-IN: that a declared
  // width overrides the primary rule, so N paper frames yield N captures and not
  // 2N. That property is TRUE of all seven and is asserted below unchanged; only
  // the arity moved. The count is kept rather than deleted because it catches a
  // frame that VANISHES, which the per-capture cells cannot.
  ok('seven frames', ids.length === 7, 'saw ' + ids.length + ': ' + ids.join(' '));
  ok('two headers x two shapes plus two state variants',
    ['S1-city', 'S1-addr', 'S1-paid', 'S1-cancelled', 'S2-city', 'S2-addr']
      .every((i) => ids.includes(i)), ids.join(' '));
  // A4 at 96dpi. The height matters as much as the width: a 794x844 capture is a
  // cropped sheet, and a cropped sheet that says nothing about being cropped is the
  // hollow green this cell exists to refuse.
  ok('every paper capture is 794 x 1123', t.every((x) => x.w === 794 && x.height === 1123),
    JSON.stringify(t.find((x) => x.w !== 794 || x.height !== 1123) || {}));
  ok('every paper capture is one mode, "paper"',
    t.every((x) => x.mode === 'paper'), [...new Set(t.map((x) => x.mode))].join(','));
  // THE GOVERNING CLAIM: N frames, N captures. THREE of the seven ids are PRIMARY
  // by the shape-prefix rule — S1-city, S2-city and now S3-seal, which is the only
  // `S3-` frame and therefore primary by construction — so an arm that read the
  // attribute but let the primary rule keep its say would emit TEN, not seven.
  // The margin this cell detects got WIDER with the new frame, not narrower.
  ok('seven frames yield seven captures, not ten', t.length === 7, 'saw ' + t.length);
  ok('the declared width overrides the primary rule',
    /geom\.width \? \[geom\.width\]/.test(resolveLine()), resolveLine());
}

// ═══ §4 · THE MUTATION ══════════════════════════════════════════════════════
// Cured tree green; uncured tree red on exactly the cure. Process boundary, restore
// verified byte-for-byte.
if (!CELLS_ONLY) {
  sec('\u00a74 \u00b7 mutation \u2014 the primary rule takes its say back');
  const before = fs.readFileSync(ARM);
  const src = before.toString('utf8');
  const FROM = 'const widths = geom.width ? [geom.width] : (primary.has(id) ? [374, 390] : [374]);';
  const TO = 'const widths = primary.has(id) ? [374, 390] : [374];';
  if (!src.includes(FROM)) {
    console.log('  FAIL mutation site not found \u2014 the resolve line moved'); fail++;
  } else {
    fs.writeFileSync(ARM, src.replace(FROM, TO));
    const r = spawnSync(process.execPath, [SELF, '--cells-only'], { encoding: 'utf8' });
    fs.writeFileSync(ARM, before);
    const restored = fs.readFileSync(ARM);
    ok('the uncured arm goes RED', r.status !== 0, 'exit ' + r.status);
    ok('the arm is restored byte-for-byte', Buffer.compare(before, restored) === 0);
  }
}

// ═══ VERDICT ════════════════════════════════════════════════════════════════
console.log('\n' + (fail === 0 ? 'GREEN' : 'RED') + ' \u2014 f3957 shot arm ' + pass + '/' + (pass + fail));
process.exit(fail === 0 ? 0 : 1);
