#!/usr/bin/env node
// tools/bs_audit.mjs — TDW_19 P0-B · THE CONTRACT GATE (kickoff §2, §5).
//
// One paste:  node tools/bs_audit.mjs
// Digest:     node tools/bs_audit.mjs --print-digest
//
// ═══════════════════════════════════════════════════════════════════════════
// WHY IT RUNS BARE WHEN wl_audit.mjs REFUSES TO
// ═══════════════════════════════════════════════════════════════════════════
// `tools/wl_audit.mjs` exits 2 with no URL, and its own header explains why:
// an instrument that passes when it did nothing is the shape a gate exists to
// refuse. That reasoning is about a SERVED TREE — its subject is a deploy, so
// with no URL it has no subject.
//
// THIS INSTRUMENT'S SUBJECT IS SOURCE. `lib/solutions/types.ts` and
// `lib/solutions/copy.ts` are on disk beside it. Running bare is not running
// with nothing to look at; it is running with the whole subject present. So the
// kickoff's "runs bare" and wl_audit's refusal are not in tension, and this file
// imports NOTHING from wl_audit (kickoff §2) — not its helpers, not its corpus.
//
// IT LIVES IN tools/ AND NOT scripts/ FOR THE SAME REASON wl_audit DOES:
// `scripts/run-floor.sh:32` globs `scripts/*.proof.mjs scripts/*.mjs
// scripts/*.js` and runs every hit bare. This is an instrument over one block's
// contract, not a floor bench, and enrolling it would move the pwa floor's named
// base for a reason that has nothing to do with the floor.
//
// ═══════════════════════════════════════════════════════════════════════════
// GATE SOUNDNESS — the parse aborts rather than under-reporting
// ═══════════════════════════════════════════════════════════════════════════
// D-38.1: a cell that asserts a thing is PRESENT has not asserted the thing
// WORKS, and an instrument that cannot prove it looked everywhere does not get
// to say ABSENT. This parser reads TypeScript as text because TS types are
// erased at runtime and there is nothing to import. If the count of shapes it
// PARSED does not equal the count of `export type … = {` declarations it can
// SEE, it prints GATE-UNSOUND and exits 2 having printed no verdicts at all —
// not one PASS, not one FAIL. A partial verdict set is the failure mode this
// preamble exists to prevent.

'use strict';

import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT      = join(dirname(fileURLToPath(import.meta.url)), '..');
const TYPES     = join(ROOT, 'lib/solutions/types.ts');
const COPY      = join(ROOT, 'lib/solutions/copy.ts');
const SELF      = fileURLToPath(import.meta.url);

const PRINT_DIGEST = process.argv.includes('--print-digest');

let pass = 0, fail = 0;
const P = (n, why) => { console.log('PASS  ' + n + (why ? '  — ' + why : '')); pass++; };
const F = (n, why) => { console.log('FAIL  ' + n + '  — ' + why); fail++; };

const unsound = (why) => {
  console.error('GATE-UNSOUND  — ' + why);
  console.error('No verdicts printed. An instrument that cannot prove it looked everywhere');
  console.error('does not get to report on what it found.');
  process.exit(2);
};

// ── SOURCES ────────────────────────────────────────────────────────────────
let typesSrc, copySrc, selfSrc;
try {
  typesSrc = readFileSync(TYPES, 'utf8');
  copySrc  = readFileSync(COPY,  'utf8');
  selfSrc  = readFileSync(SELF,  'utf8');
} catch (e) {
  unsound('could not read a subject file: ' + e.message);
}

// ── THE COMMENT STRIP, AND WHY IT IS ITSELF CHECKED ────────────────────────
// types.ts documents its own parse contract by QUOTING the declaration form
// inside a comment. A naive regex over the raw file counts that quotation as a
// declaration and the shape count comes out wrong — so comments are stripped
// first. The strip is then verified: if any `//` or `/*` survives into the
// stripped text, the strip did not do its job and the whole run is unsound
// rather than quietly working on a corrupted subject.
function strip(src) {
  const noBlocks = src.replace(/\/\*[\s\S]*?\*\//g, '');
  return noBlocks
    .split('\n')
    .filter((l) => !l.trim().startsWith('//'))
    .map((l) => l.replace(/\s\/\/.*$/, ''))
    .join('\n');
}

const typesCode = strip(typesSrc);
const copyCode  = strip(copySrc);
if (/\/\/|\/\*/.test(typesCode)) unsound('comment strip left comment markers in types.ts');
if (/\/\/|\/\*/.test(copyCode))  unsound('comment strip left comment markers in copy.ts');

// ── THE PARSE ──────────────────────────────────────────────────────────────
const DECL = /^export type ([A-Za-z][A-Za-z0-9_]*) = \{$/;
const FIELD = /^\s*(?:readonly\s+)?([A-Za-z_][A-Za-z0-9_]*)\??:\s*.+;$/;

const declLines = typesCode.split('\n').filter((l) => DECL.test(l)).length;
const seenDecls = (typesCode.match(/export type\s+[A-Za-z][A-Za-z0-9_]*\s*=\s*\{/g) || []).length;
if (declLines !== seenDecls) {
  unsound(`${seenDecls} object-type declarations visible but ${declLines} match the parse contract ` +
          '(opening brace must be on the declaration line)');
}
if (declLines === 0) unsound('no object-type declarations found in types.ts');

const shapes = {};
{
  const lines = typesCode.split('\n');
  let current = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const d = line.match(DECL);
    if (d) {
      if (current) unsound(`nested or unterminated declaration at line ${i + 1}`);
      current = d[1];
      shapes[current] = [];
      continue;
    }
    if (current === null) continue;
    if (line === '};') { current = null; continue; }
    if (line.trim() === '') continue;
    if (/[{}]/.test(line)) {
      unsound(`inline nested object literal in ${current} at line ${i + 1} — ` +
              'the parse contract requires every nested shape to be its own named type');
    }
    const f = line.match(FIELD);
    if (!f) unsound(`unparseable field in ${current} at line ${i + 1}: ${JSON.stringify(line)}`);
    shapes[current].push(f[1]);
  }
  if (current !== null) unsound(`declaration ${current} never closed with a column-1 '};'`);
}

const parsedCount = Object.keys(shapes).length;
if (parsedCount !== declLines) {
  unsound(`parsed ${parsedCount} shapes but saw ${declLines} declarations`);
}
for (const [name, fields] of Object.entries(shapes)) {
  if (fields.length === 0) unsound(`shape ${name} parsed with zero fields`);
}

// ── THE CANONICAL RENDERING — identical algorithm to contract.js:canonical() ─
function canonical(s) {
  return Object.keys(s)
    .sort()
    .map((name) => name + '{' + s[name].slice().sort().join(',') + '}')
    .join('\n');
}
const digest = createHash('sha256').update(canonical(shapes), 'utf8').digest('hex');

if (PRINT_DIGEST) {
  console.log(digest);
  process.exit(0);
}

console.log(`COVERAGE  ${parsedCount} shapes, ` +
            `${Object.values(shapes).reduce((a, f) => a + f.length, 0)} fields parsed from lib/solutions/types.ts; ` +
            `${declLines}/${seenDecls} declarations matched the parse contract`);
console.log('');

// ═══════════════════════════════════════════════════════════════════════════
// CELLS
// ═══════════════════════════════════════════════════════════════════════════

// ── C1 · the seven R-19.3 payload types, asserted against the RULING ───────
// The expected list is written HERE, from the ruling, and not read out of the
// parsed shapes. A cell that takes its expectation from the thing it is testing
// passes on every tree including the broken one (D-38.1).
{
  const RULED = ['GoogleStatus', 'DomainStatus', 'DomainSearchResult', 'SeoReport',
                 'MarketingDraft', 'ProofDoc', 'Benchmark'];
  const absent = RULED.filter((n) => !(n in shapes));
  absent.length === 0
    ? P('C1  seven ruled payload types declared', RULED.length + '/7')
    : F('C1  seven ruled payload types declared', 'absent: ' + absent.join(', '));
}

// ── C2 · the digest literal in types.ts equals the computed digest ─────────
{
  const m = typesCode.match(/export const CONTRACT_DIGEST = '([a-f0-9]{64}|PENDING)';/);
  if (!m) F('C2  CONTRACT_DIGEST literal present and well-formed', 'no 64-hex (or PENDING) literal found');
  else if (m[1] === 'PENDING') F('C2  CONTRACT_DIGEST literal matches computed', 'literal is still PENDING — run --print-digest and paste into BOTH repos');
  else if (m[1] !== digest) F('C2  CONTRACT_DIGEST literal matches computed', `literal ${m[1].slice(0, 12)}… but computed ${digest.slice(0, 12)}…`);
  else P('C2  CONTRACT_DIGEST literal matches computed', digest.slice(0, 12) + '…');
}

// ── C3 · the money-unit class, covered separately because the digest cannot ─
// The digest is over field NAMES, so a retype from paise to rupees would slip
// through it silently. R-19.3 fixes every money field as a paise integer, and
// the enforcement is the NAME: anything that smells of money must end in Paise.
{
  const SMELLS = /price|amount|fee|cost|rupee|inr|paise/i;
  const offenders = [];
  for (const [type, fields] of Object.entries(shapes)) {
    for (const f of fields) {
      if (SMELLS.test(f) && !/Paise$/.test(f)) offenders.push(`${type}.${f}`);
    }
  }
  const money = Object.entries(shapes).flatMap(([t, fs]) => fs.filter((f) => /Paise$/.test(f)).map((f) => `${t}.${f}`));
  if (offenders.length) F('C3  every money field name ends in Paise', 'offenders: ' + offenders.join(', '));
  else if (money.length === 0) F('C3  every money field name ends in Paise', 'no money field found at all — the cell had nothing to assert on');
  else P('C3  every money field name ends in Paise', money.join(', '));
}

// ── C4 · the money register on rendered bytes ──────────────────────────────
// No glyph, no shorthand, and NO MONEY STRING BUILT IN COPY. `formatRs` in
// lib/vendor/format.ts is the estate's one money home; a copy file that carries
// `Rs ` in a template is a second one growing quietly.
{
  const bad = [];
  if (/\u20B9/.test(copySrc))                 bad.push('rupee glyph in copy.ts');
  if (/\u20B9/.test(typesSrc))                bad.push('rupee glyph in types.ts');
  if (/\bRs\s*\$?\{/.test(copyCode))          bad.push('money string interpolated in copy.ts');
  if (/\b\d+\s?(?:k|L|Cr)\b/.test(copyCode))  bad.push('k/L/Cr shorthand in copy.ts');
  bad.length === 0
    ? P('C4  money register clean', 'no glyph, no shorthand, no money string built in copy')
    : F('C4  money register clean', bad.join('; '));
}

// ── C5 · no persona names in product chrome ────────────────────────────────
{
  const PERSONAS = ['Victor', 'Donna', 'Harvey', 'Mira', 'Eliza', 'Operator'];
  const hits = PERSONAS.filter((p) => new RegExp('\\b' + p + '\\b').test(copyCode));
  hits.length === 0
    ? P('C5  no persona names in copy', PERSONAS.length + ' names checked')
    : F('C5  no persona names in copy', 'found: ' + hits.join(', '));
}

// ── C6 · row labels are nouns of ≤2 words (R-19.6) ────────────────────────
{
  const block = copyCode.match(/export const ROWS = \{([\s\S]*?)\} as const;/);
  if (!block) F('C6  row labels \u22642 words', 'ROWS block not found');
  else {
    const labels = [...block[1].matchAll(/:\s*'([^']*)'/g)].map((m) => m[1]);
    if (labels.length !== 6) F('C6  row labels \u22642 words', `expected 6 rows, found ${labels.length}`);
    else {
      const over = labels.filter((l) => l.trim().split(/\s+/).length > 2);
      over.length === 0
        ? P('C6  row labels \u22642 words', labels.join(' \u00b7 '))
        : F('C6  row labels \u22642 words', 'over: ' + over.join(', '));
    }
  }
}

// ── C7 · buttons are spec §9's set exactly, each ≤2 words ─────────────────
{
  const SPEC9 = ['Connect', 'Disconnect', 'Get', 'Renew', 'Make', 'Share'];
  const block = copyCode.match(/export const BUTTONS = \{([\s\S]*?)\} as const;/);
  if (!block) F('C7  buttons match spec \u00a79', 'BUTTONS block not found');
  else {
    const vals = [...block[1].matchAll(/:\s*'([^']*)'/g)].map((m) => m[1]);
    const extra   = vals.filter((v) => !SPEC9.includes(v));
    const missing = SPEC9.filter((v) => !vals.includes(v));
    const over    = vals.filter((v) => v.trim().split(/\s+/).length > 2);
    (extra.length || missing.length || over.length)
      ? F('C7  buttons match spec \u00a79', [
          extra.length   ? 'unapproved: ' + extra.join(', ')   : '',
          missing.length ? 'missing: '    + missing.join(', ') : '',
          over.length    ? 'over 2 words: ' + over.join(', ')  : '',
        ].filter(Boolean).join('; '))
      : P('C7  buttons match spec \u00a79', vals.join(' \u00b7 '));
  }
}

// ── C8 · chips: spec §9's six present, and any seventh NAMED not hidden ────
// `coming` is proposed by this seat under R-19.5 and is NOT in the founder's
// approved set. The cell passes with it present, because a proposal is a
// legitimate thing to ship pending veto — but it prints it every run so it
// cannot become approved by nobody noticing.
{
  const SPEC9 = ['Not connected', 'Connected', 'Needs attention', 'Searching', 'Live', 'Expired'];
  const block = copyCode.match(/export const CHIPS = \{([\s\S]*?)\} as const;/);
  if (!block) F('C8  chips cover spec \u00a79', 'CHIPS block not found');
  else {
    const vals = [...block[1].matchAll(/:\s*'([^']*)'/g)].map((m) => m[1]);
    const missing = SPEC9.filter((v) => !vals.includes(v));
    const beyond  = vals.filter((v) => !SPEC9.includes(v));
    if (missing.length) F('C8  chips cover spec \u00a79', 'missing: ' + missing.join(', '));
    else P('C8  chips cover spec \u00a79',
           `all six present${beyond.length ? ' \u00b7 PROPOSED BEYOND THE APPROVED SET, awaiting veto: ' + beyond.join(', ') : ''}`);
  }
}

// ── C9 · the subdomain transform against the parity fixture ───────────────
// The fixture literals are the cross-repo contract: `contract.js` carries the
// same table and asserts its own implementation against the same expected
// values, so neither repo reads the other and a change to either side reddens
// that side alone. Reimplemented here from the ruling rather than imported, so
// the cell does not pass by importing the thing it is testing.
{
  const FIXTURE = [
    ['DEV550', 'dev550.thedreamwedding.in'],
    ['dev550', 'dev550.thedreamwedding.in'],
    ['AB-CD', 'ab-cd.thedreamwedding.in'],
    ['  PADDED  ', 'padded.thedreamwedding.in'],
    ['', null],
    [null, null],
  ];
  const declared = copyOfFixture(typesCode);
  if (!declared) F('C9  subdomain fixture is the ruled table', 'SUBDOMAIN_FIXTURE not found in types.ts');
  else {
    const want = JSON.stringify(FIXTURE);
    const got  = JSON.stringify(declared);
    got === want
      ? P('C9  subdomain fixture is the ruled table', FIXTURE.length + ' cases, lowercase + trim + null-in-null-out')
      : F('C9  subdomain fixture is the ruled table', 'declared table differs from the ruling: ' + got);
  }
}

function copyOfFixture(src) {
  const m = src.match(/export const SUBDOMAIN_FIXTURE[\s\S]*?=\s*\[([\s\S]*?)\]\s*as const;/);
  if (!m) return null;
  const rows = [...m[1].matchAll(/\[\s*(null|'(?:[^']*)')\s*,\s*(null|'(?:[^']*)')\s*\]/g)];
  const lit = (t) => (t === 'null' ? null : t.slice(1, -1));
  return rows.map((r) => [lit(r[1]), lit(r[2])]);
}

// ── C10 · this seat's copy does not reach into the S2 seat's copy ─────────
// kickoff §2 contention AND the one-home law, asserted rather than promised.
{
  const reaches = /from\s+'@?\/?[^']*worklist\/copy'/.test(copyCode) ||
                  /require\([^)]*worklist\/copy/.test(copyCode);
  reaches
    ? F('C10 copy.ts does not import lib/worklist/copy', 'it does — S2 owns that file')
    : P('C10 copy.ts does not import lib/worklist/copy', 'no import, no merge');
}

// ── C11 · this instrument does not import wl_audit (kickoff §2) ───────────
// ⚠ THE FIRST CUT OF THIS CELL CONVICTED ITSELF, and it is kept as a note
// because it is D-38.1's corollary running in reverse. The pattern was
// `/^\s*import[\s\S]*?wl_audit/m` — and `[\s\S]*?` spans the whole file, so any
// `import` line ANYWHERE followed by the string `wl_audit` ANYWHERE matched.
// The header of this very file discusses wl_audit at length, so the cell went
// RED on a file with zero shared code. A cell whose pattern reaches past its
// subject reports on the wrong thing in both directions: this one cried wolf,
// and the same shape would have passed a real import sitting above a file with
// no mention of the name. The statements are now scanned as statements.
{
  const statements = selfSrc.match(/^\s*import\s[^\n;]*(?:;|$)/gm) || [];
  const requires   = selfSrc.match(/require\(\s*['"][^'"]*['"]\s*\)/g) || [];
  const offending  = [...statements, ...requires].filter((s) => /wl_audit/.test(s));
  offending.length
    ? F('C11 bs_audit imports nothing from wl_audit', 'found: ' + offending.join(' | '))
    : P('C11 bs_audit imports nothing from wl_audit',
        `${statements.length} imports + ${requires.length} requires scanned, zero shared code`);
}

// ── C12 · spec §6's refusal is structural, not a promise ─────────────────
// "No SEO score out of 100" is enforced by there being nowhere to put one.
{
  const seo = shapes.SeoReport || [];
  const scoreish = seo.filter((f) => /score|grade|rating|outOf/i.test(f));
  scoreish.length === 0
    ? P('C12 SeoReport carries no score field', seo.length + ' fields, none scoring')
    : F('C12 SeoReport carries no score field', 'found: ' + scoreish.join(', '));
}

// ── C13 · the six slugs, in spec §0's delivery order, in both homes ───────
{
  const ORDER = ['google', 'website', 'seo', 'marketing', 'proof', 'benchmarks'];
  const rowsBlock = copyCode.match(/export const ROWS = \{([\s\S]*?)\} as const;/);
  const eyeBlock  = copyCode.match(/export const ROW_EYEBROWS = \{([\s\S]*?)\} as const;/);
  const keysOf = (b) => (b ? [...b[1].matchAll(/^\s*([a-z]+):/gm)].map((m) => m[1]) : null);
  const rk = keysOf(rowsBlock), ek = keysOf(eyeBlock);
  if (!rk || !ek) F('C13 six slugs in delivery order, both homes', 'a block was not found');
  else if (JSON.stringify(rk) !== JSON.stringify(ORDER)) F('C13 six slugs in delivery order, both homes', 'ROWS order: ' + rk.join(','));
  else if (JSON.stringify(ek) !== JSON.stringify(ORDER)) F('C13 six slugs in delivery order, both homes', 'ROW_EYEBROWS order: ' + ek.join(','));
  else P('C13 six slugs in delivery order, both homes', ORDER.join(' \u2192 '));
}

// ── C14 · every row has an empty state, because R-19.2 makes it the product ─
{
  const ORDER = ['google', 'website', 'seo', 'marketing', 'proof', 'benchmarks'];
  const missing = ORDER.filter((s) => !new RegExp('\\b' + s + 'Empty\\s*:').test(copyCode));
  missing.length === 0
    ? P('C14 every row declares an empty state', '6/6')
    : F('C14 every row declares an empty state', 'missing: ' + missing.map((m) => m + 'Empty').join(', '));
}

// ═══════════════════════════════════════════════════════════════════════════
// SURFACE CELLS (step 3) — the six rows, the index, and the chrome
// ═══════════════════════════════════════════════════════════════════════════
// These read SOURCE, and say so. A rendered-DOM assertion needs a served tree,
// which is `wl_render`'s job and the founder's frames'. D-38.1 in full: **none
// of these cells asserts that a surface LOOKS right.** They assert it cannot be
// wrong in the specific ways this block can be wrong. The founder's frames
// remain the real-session evidence.

const SURFACES = ['google', 'website', 'seo', 'marketing', 'proof', 'benchmarks'];
const surfaceSrc = {};
let surfacesReadable = true;
for (const s of SURFACES) {
  try { surfaceSrc[s] = readFileSync(join(ROOT, `app/w/support/${s}/page.tsx`), 'utf8'); }
  catch { surfacesReadable = false; surfaceSrc[s] = null; }
}
let indexSrc = null, piecesSrc = null, routesSrc = null, clientSrc = null;
try {
  indexSrc  = readFileSync(join(ROOT, 'app/w/support/page.tsx'), 'utf8');
  piecesSrc = readFileSync(join(ROOT, 'components/solutions/SolutionsPieces.tsx'), 'utf8');
  routesSrc = readFileSync(join(ROOT, 'lib/solutions/routes.ts'), 'utf8');
  clientSrc = readFileSync(join(ROOT, 'lib/solutions/client.ts'), 'utf8');
} catch { surfacesReadable = false; }

// ── C15 · all seven surfaces exist ────────────────────────────────────────
{
  const missing = SURFACES.filter((s) => !surfaceSrc[s]);
  (surfacesReadable && missing.length === 0)
    ? P('C15 six surfaces + the index exist', SURFACES.join(', '))
    : F('C15 six surfaces + the index exist', missing.length ? 'missing: ' + missing.join(', ') : 'a shared file was unreadable');
}

// ── C16 · THE ADDRESS BOOK (R-38.1's shape, ratified by CE-38) ────────────
// C31's shape in this seat's own gate. `/w/support` cannot go through
// `roomHref` — these are not rooms and `rooms.ts` is S2's — so without this cell
// six scattered literals would grow exactly where R-38.1 just finished deleting
// four. The one home is `lib/solutions/routes.ts`.
{
  const files = { ...surfaceSrc, 'app/w/support/page.tsx': indexSrc, 'components/solutions/SolutionsPieces.tsx': piecesSrc, 'lib/solutions/client.ts': clientSrc };
  const offenders = [];
  for (const [name, src] of Object.entries(files)) {
    if (!src) continue;
    if (/['"`]\/w\/support/.test(strip(src))) offenders.push(name);
  }
  const declared = routesSrc && /SOLUTIONS_INDEX_HREF = '\/w\/support'/.test(strip(routesSrc));
  if (!declared) F('C16 no /w/support literal outside surfaceHref', 'routes.ts does not declare the base');
  else if (offenders.length) F('C16 no /w/support literal outside surfaceHref', 'literals in: ' + offenders.join(', '));
  else P('C16 no /w/support literal outside surfaceHref', 'one home: lib/solutions/routes.ts');
}

// ── C17 · NO SURFACE TOUCHES t0 ───────────────────────────────────────────
// theme.ts:46 — "ONE ELEMENT PER APP", the Today masthead numeral. A second t0
// anywhere is a second masthead.
{
  const offenders = Object.entries({ ...surfaceSrc, index: indexSrc, pieces: piecesSrc })
    .filter(([, src]) => src && /var\(--wl-t0\)/.test(src)).map(([n]) => n);
  offenders.length === 0
    ? P('C17 no surface spends t0', 'the masthead numeral stays the only one')
    : F('C17 no surface spends t0', 'found in: ' + offenders.join(', '));
}

// ── C18 · AT MOST ONE t1 PER SURFACE, AND IT IS THE SHELL'S ───────────────
{
  const offenders = Object.entries({ ...surfaceSrc, index: indexSrc, pieces: piecesSrc })
    .filter(([, src]) => src && /var\(--wl-t1\)/.test(src)).map(([n]) => n);
  offenders.length === 0
    ? P('C18 no surface declares its own t1', 'the shell owns the page title')
    : F('C18 no surface declares its own t1', 'found in: ' + offenders.join(', '));
}

// ── C19 · EVERY SURFACE IS SESSION-GUARDED ────────────────────────────────
// A surface that skipped it would render chrome to a signed-out visitor and then
// fail its fetch — which is also how a public route gets created by accident.
{
  const bad = SURFACES.filter((s) => {
    const src = surfaceSrc[s];
    return !src || !/useVendorSession/.test(src) || !/router\.replace\('\/'\)/.test(src);
  });
  const idxOk = indexSrc && /useVendorSession/.test(indexSrc) && /router\.replace\('\/'\)/.test(indexSrc);
  (bad.length === 0 && idxOk)
    ? P('C19 every surface + the index is session-guarded', '7/7 redirect to / without a session')
    : F('C19 every surface + the index is session-guarded', bad.concat(idxOk ? [] : ['index']).join(', '));
}

// ── C20 · NO MONEY STRING, NO PERSONA NAME ───────────────────────────────
// Not a total ban on JSX text — row labels are structural and argued at their
// sites. This refuses the two classes that actually leak.
{
  const files = { ...surfaceSrc, index: indexSrc, pieces: piecesSrc };
  const bad = [];
  for (const [name, src] of Object.entries(files)) {
    if (!src) continue;
    if (/\u20B9/.test(src)) bad.push(`${name}: rupee glyph`);
    if (/\bRs\s*[{$\d]/.test(src)) bad.push(`${name}: money string built inline`);
    for (const p of ['Victor', 'Donna', 'Harvey', 'Mira', 'Eliza']) {
      if (new RegExp('\\b' + p + '\\b').test(strip(src))) bad.push(`${name}: persona "${p}"`);
    }
  }
  bad.length === 0
    ? P('C20 no money string or persona name in any surface', `${Object.keys(files).length} files scanned`)
    : F('C20 no money string or persona name in any surface', bad.join('; '));
}

// ── C21 · THE FOOTER CONSUMES S2's STRINGS AND EDITS NOTHING ─────────────
// CE-38 relay #1 item 6. The one row on the index that reaches a human survives,
// by READING `lib/worklist/copy.ts`, never editing it. The class name is part of
// the contract too — b40 C10's tap-target census maps this file to
// `wl-supportaction`, and renaming it reddened S2's bench.
{
  const usesBody   = indexSrc && /WL\.supportBody/.test(indexSrc);
  const usesAction = indexSrc && /WL\.supportAction/.test(indexSrc);
  const usesNumber = indexSrc && /supportWaNumber\(\)/.test(indexSrc);
  const inlineNum  = indexSrc && /wa\.me\/\d/.test(indexSrc);
  const keepsClass = indexSrc && /className="wl-supportaction"/.test(indexSrc);
  (usesBody && usesAction && usesNumber && !inlineNum && keepsClass)
    ? P('C21 the WhatsApp footer survives, on S2\u2019s strings and its own class',
        'supportBody + supportAction read, supportWaNumber() called, wl-supportaction kept for b40 C10')
    : F('C21 the WhatsApp footer survives, on S2\u2019s strings and its own class',
        [!usesBody && 'supportBody unused', !usesAction && 'supportAction unused',
         !usesNumber && 'supportWaNumber() not called', inlineNum && 'NUMBER INLINE (F-09.190)',
         !keepsClass && 'wl-supportaction renamed — b40 C10 census breaks'].filter(Boolean).join('; '));
}

// ── C22 · NO SURFACE RAW-FETCHES ─────────────────────────────────────────
// `lib/vendor/api/vendor.ts:3` — *screen components import from here, never raw
// fetch*. A `fetch()` in a surface is a second auth path that works until the
// refresh logic changes underneath it.
{
  const offenders = Object.entries({ ...surfaceSrc, index: indexSrc })
    .filter(([, src]) => src && /\bfetch\s*\(/.test(strip(src))).map(([n]) => n);
  const clientUsesBase = clientSrc && /from '@\/lib\/vendor\/api\/_base'/.test(clientSrc);
  (offenders.length === 0 && clientUsesBase)
    ? P('C22 no surface raw-fetches; the client rides _base', 'one auth home')
    : F('C22 no surface raw-fetches; the client rides _base',
        offenders.length ? 'raw fetch in: ' + offenders.join(', ') : 'client.ts does not import _base');
}

// ── C23 · EVERY CHIP RENDERED COMES FROM THE COPY HOME ───────────────────
{
  const chipFromCopy = piecesSrc && /CHIPS\[state\]/.test(piecesSrc);
  const litChip = piecesSrc && /(>|\s)(Not connected|Needs attention|Coming)</.test(piecesSrc);
  (chipFromCopy && !litChip)
    ? P('C23 chip text comes from CHIPS, never a literal', 'one copy home for all seven')
    : F('C23 chip text comes from CHIPS, never a literal', litChip ? 'a chip word is hardcoded in the component' : 'CHIPS[state] not used');
}

// ── C24 · THE REGISTER CARRIES EVERY SHIPPED STRING, VERBATIM ─────────────
// The founder gets ONE pass (spec §9), and he reads the register, not the code.
// A register missing a string means a byte ships that no veto ever saw; a
// register showing a DIFFERENT byte is worse, because he approves one thing and
// another goes out.
//
// This cell caught exactly that on its first run: the register had
// `another vendor's numbers` with a straight apostrophe where `copy.ts` ships
// `\u2019`. One character, invisible on the page, and the approval would have
// been for a string that does not exist.
{
  let reg = null;
  try { reg = readFileSync(join(ROOT, 'docs/COPY_REGISTER_TDW19.md'), 'utf8'); } catch { /* reported below */ }
  if (!reg) F('C24 the copy register carries every shipped string', 'docs/COPY_REGISTER_TDW19.md not found');
  else {
    const re = /^\s+([a-zA-Z_]+):\s+'((?:[^'\\]|\\.)*)',?\s*$/gm;
    const missing = [];
    let m, total = 0;
    while ((m = re.exec(copyCode)) !== null) {
      total++;
      // The source carries `\u2019` escapes; the register carries the character.
      const shipped = m[2].replace(/\\u2019/g, '\u2019').replace(/\\'/g, "'");
      if (!reg.includes(shipped)) missing.push(m[1]);
    }
    if (total === 0) F('C24 the copy register carries every shipped string', 'no strings parsed from copy.ts — the cell had nothing to assert');
    else if (missing.length) F('C24 the copy register carries every shipped string', `${missing.length} absent or altered: ${missing.join(', ')}`);
    else P('C24 the copy register carries every shipped string', `${total}/${total} verbatim`);
  }
}

// ── C25 · F-19.19 · THE PUBLIC MISS IS A DESIGNED PAGE, NOT A FRAMEWORK 404 ──
// The founder walked `/v/<unknown>` and got Next's raw 404 — a developer
// artefact shown to a couple who tapped a friend's WhatsApp link. `notFound()`
// with no `app/not-found.tsx` anywhere in the tree is what produced it.
//
// Absent and paused reach the same branch by construction, not by coincidence:
// the door returns one indistinguishable body for absent, paused AND inactive
// (b44 §4.4), and `fetchCard` returns null on any non-ok response — so there is
// exactly one `if (!card)` and no path on which they could diverge. This cell
// asserts the branch renders, sits on the shared stylesheet, and shows no
// status code.
{
  let pv = null;
  try { pv = readFileSync(join(ROOT, 'app/v/[code]/page.tsx'), 'utf8'); } catch { /* reported */ }
  if (!pv) F('C25 /v/ renders a designed page for a miss', 'app/v/[code]/page.tsx not found');
  else {
    const code = strip(pv);
    const bad = [];
    if (/\bnotFound\s*\(/.test(code))            bad.push('still calls notFound()');
    if (/from 'next\/navigation'/.test(code))    bad.push("still imports next/navigation");
    if (!/if \(!card\)/.test(code))              bad.push('no single miss branch');
    if (!/PublicStyles/.test(code))              bad.push('the miss branch does not share the card stylesheet');
    if (/\b404\b/.test(code))                    bad.push('a status code is visible in the rendered output');
    // §3-3, PAGE SIDE. The door proves absent/paused/inactive are byte-identical
    // ON THE WIRE (b44 §4.4). This is the same property at the edge: the render
    // for a miss must mention nothing about a vendor, so the enriched card —
    // hero, prose, price, strip — gives a miss no new way to betray itself.
    // ⚠ ANCHORED ON `<main`, AND THE FIRST CUT WAS NOT. A bare
    // `if \(!card\) \{ … \}` matches the FIRST such branch, which since P2-A is
    // `generateMetadata`'s — so the cell ran green while testing a subject that
    // structurally cannot contain `pv-strip`. Passing on the wrong branch is
    // D-38.1's class, found by diffing this branch against P0-B's bytes and
    // getting a difference that was the regex's, not the page's.
    const missRender = (code.match(/if \(!card\) \{\s*return \(\s*<main[\s\S]*?\n  \}/) || [''])[0];
    if (!missRender) bad.push('the RENDER miss branch could not be read');
    if (/card\.|hero|photos|starting_price|pv-strip|pv-hero/.test(missRender))
      bad.push('the miss render reaches for card data');
    // ⚠ LABELLED AMENDMENT (TDW_19 P2-A §3-2) — THE EXPECTED COUNT MOVES 1 → 2,
    // AND THE REASON IS AT SITE RATHER THAN IN A COMMIT MESSAGE.
    //
    // At P0-B this route had ONE function and therefore one miss branch, and
    // "two would be two grounds to drift" was exactly right. P2-A gives the
    // route `generateMetadata`, because the WhatsApp link preview is half of
    // what this page is FOR — and metadata cannot be produced through the body's
    // return. So a second miss branch is now STRUCTURALLY REQUIRED, and a cell
    // demanding one would be demanding a page that crashes on an unknown handle.
    //
    // THE RISK THE OLD COUNT WAS GUARDING DID NOT GO AWAY; IT MOVED. Two miss
    // branches that drift would let a link preview name a business the page
    // refuses to show — the enumeration oracle leaking through metadata instead
    // of through a status code. That is now C28's subject, aimed at the leak
    // itself rather than at a proxy for it. This cell keeps the count so a THIRD
    // branch still announces itself.
    const misses = (code.match(/if \(!card\)/g) || []).length;
    if (misses !== 2) bad.push(`${misses} miss branches, expected exactly 2 (body + generateMetadata)`);
    bad.length === 0
      ? P('C25 /v/ renders a designed page for a miss', 'body + metadata branches, shared ground, no status code')
      : F('C25 /v/ renders a designed page for a miss', bad.join('; '));
  }
}

// ── C26 · F-19.20 · A WITHHELD DOOR LOOKS WITHHELD ────────────────────────
// The founder pressed `Connect` and nothing happened. The button WAS disabled —
// but hardcoded, which is right today only by accident: it would still be dead
// the day the key is set, and R-19.5's whole point is that turning a row on is
// setting a key, not shipping a build. `disabled` must come from `gates()`.
{
  const WITH_BUTTONS = ['google', 'website', 'marketing', 'proof'];
  const bad = [];
  for (const s of WITH_BUTTONS) {
    const src = surfaceSrc[s];
    if (!src) { bad.push(`${s}: unreadable`); continue; }
    const code = strip(src);
    if (/disabled>/.test(code))                    bad.push(`${s}: a hardcoded 'disabled' survives`);
    if (!/disabled=\{!live\}/.test(code))          bad.push(`${s}: button not driven by the gate`);
    if (!/fetchGateLive\('/.test(code))            bad.push(`${s}: never reads gates()`);
    if (!/useState\(false\)/.test(code))           bad.push(`${s}: gate does not default closed`);
    if (!/COPY\.withheldNote/.test(code))          bad.push(`${s}: no note beside the withheld control`);
  }
  bad.length === 0
    ? P('C26 every withheld button is gate-driven and says so', `${WITH_BUTTONS.length} surfaces, default closed`)
    : F('C26 every withheld button is gate-driven and says so', bad.join('; '));
}

// ── C27 · F-19.21 · NO SURFACE IMPLIES AN ADDRESS THAT RESOLVES ───────────
// The Website surface printed `<handle>.thedreamwedding.in` in body type as
// though it were live. The founder opened one: DEPLOYMENT_NOT_FOUND. No
// wildcard DNS exists — P2 infrastructure and a founder-side Vercel action.
{
  const src = surfaceSrc.website;
  const bad = [];
  if (!src) bad.push('website surface unreadable');
  else {
    const code = strip(src);
    if (/className="sol-addr"/.test(code))          bad.push('the address still uses the live-address class');
    if (!/className="sol-reserved"/.test(code))     bad.push('the reserved-name class is not used');
    if (!/COPY\.websiteAddressPending/.test(code))  bad.push('the row does not state when the address arrives');
    if (!/COPY\.websiteAddressNote/.test(code))     bad.push('no sentence disclaiming that it resolves');
    if (/<a [^>]*sol-reserved/.test(code))          bad.push('the reserved name is a link');
  }
  // And the muted colour is the affordance — a reserved name must not read as ink.
  if (piecesSrc && !/\.sol-reserved\{[^}]*--atelier-ink-mute/.test(piecesSrc)) {
    bad.push('the reserved name is not muted');
  }
  bad.length === 0
    ? P('C27 the web address is shown as reserved, never as live', 'muted, unlinked, with its arrival stated')
    : F('C27 the web address is shown as reserved, never as live', bad.join('; '));
}

// ── C28 · THE MISS DOES NOT LEAK THROUGH THE LINK PREVIEW ────────────────────
// C25's old count guarded drift between two miss branches by forbidding the
// second. P2-A requires the second, so the guard moves to the leak: metadata for
// an unknown, paused or inactive handle must name no business, carry no image,
// and ask not to be indexed. A title reading "Quiet Co · Decor · Delhi" in a
// WhatsApp preview answers "does this handle exist?" just as loudly as a 404 body
// would, and the door's byte-identical miss (b44 §4.4) would be undone at the edge.
{
  let pv = null;
  try { pv = readFileSync(join(ROOT, 'app/v/[code]/page.tsx'), 'utf8'); } catch { /* reported */ }
  if (!pv) F('C28 the miss leaks nothing through metadata', 'app/v/[code]/page.tsx not found');
  else {
    const code = strip(pv);
    const bad = [];
    if (!/export async function generateMetadata/.test(code)) bad.push('no generateMetadata on the route');
    // The miss return, isolated: everything between the metadata miss branch and
    // its closing brace. Asserting on THAT rather than on the whole file is what
    // stops the card's own og:image from satisfying this cell.
    const m = code.match(/if \(!card\) \{\s*return \{([^}]*)\}/);
    if (!m) bad.push('the metadata miss branch could not be read');
    else {
      const miss = m[1];
      if (/business_name|card\./.test(miss))     bad.push('the miss names the vendor');
      if (/images|openGraph|og:/.test(miss))      bad.push('the miss carries an image');
      if (!/robots/.test(miss))                   bad.push('the miss does not ask to be unindexed');
    }
    bad.length === 0
      ? P('C28 the miss leaks nothing through metadata', 'no name, no image, not indexed')
      : F('C28 the miss leaks nothing through metadata', bad.join('; '));
  }
}

// ── C29 · THE HERO REACHES THE OG CARD ───────────────────────────────────────
// This page exists to be forwarded. An `og:image` that is absent, or that is a
// site logo rather than her work, is the product failing at the only moment it
// was built for — and it is invisible on the page itself, so nothing else in
// this repo would catch it.
{
  let pv = null;
  try { pv = readFileSync(join(ROOT, 'app/v/[code]/page.tsx'), 'utf8'); } catch { /* reported */ }
  if (!pv) F('C29 the OG card is built from her own hero', 'app/v/[code]/page.tsx not found');
  else {
    const code = strip(pv);
    const bad = [];
    if (!/openGraph:/.test(code))                       bad.push('no openGraph block');
    // ⚠ SCOPED TO EACH BLOCK, AND THE FIRST CUT WAS NOT. A file-wide
    // `/images:\s*hero\s*\?/` is satisfied by EITHER of the two `images:` sites,
    // so gutting `openGraph.images` to `[]` left the cell green on the strength
    // of `twitter.images` — a mutation that applied, changed the product, and
    // reddened nothing. Each block is extracted and asserted on its own.
    const og = (code.match(/openGraph:\s*\{[\s\S]*?\n    \}/) || [''])[0];
    const tw = (code.match(/twitter:\s*\{[\s\S]*?\n    \}/) || [''])[0];
    if (!og) bad.push('the openGraph block could not be read');
    else if (!/images:\s*hero\s*\?/.test(og))          bad.push('og:image is not the hero');
    if (!tw) bad.push('the twitter block could not be read');
    else if (!/images:\s*hero\s*\?/.test(tw))          bad.push('the twitter image is not the hero');
    if (!/heroOf\(/.test(code))                         bad.push('the hero is not derived from the approved set');
    if (!/twitter:/.test(code))                         bad.push('no twitter card');
    if (!/alternates:\s*\{\s*canonical/.test(code))    bad.push('no canonical URL');
    // The money never travels in a preview: a price out of the register and out
    // of her control, quoted by a stranger's phone.
    if (/starting_price/.test((code.match(/export async function generateMetadata[\s\S]*?\n\}/) || [''])[0]))
      bad.push('the price reaches the link preview');
    bad.length === 0
      ? P('C29 the OG card is built from her own hero', 'og + twitter + canonical, image off heroOf, no money')
      : F('C29 the OG card is built from her own hero', bad.join('; '));
  }
}

// ── C30 · ONE COUPLE-FACING CARD, AND /v/ MOUNTS IT ─────────────────────────
// The third band §2-4: "/v/ renders through VendorProfileView's shape — reuse it
// or extract its core into a shared component both call; two drifting profile
// designs is the disease." This cell refuses the re-declaration: `/v/` must
// mount `VendorProfileContent`, on the CREAM palette, and must not grow its own
// name/about/price markup beside it.
{
  let pv = null;
  try { pv = readFileSync(join(ROOT, 'app/v/[code]/page.tsx'), 'utf8'); } catch { /* reported */ }
  if (!pv) F('C30 /v/ mounts the one card, on cream', 'app/v/[code]/page.tsx not found');
  else {
    const code = strip(pv);
    const bad = [];
    if (!/<VendorProfileContent/.test(code))              bad.push('the shared core is not mounted');
    if (!/PROFILE_PALETTE\.onCream/.test(code))           bad.push('not mounted on the cream ground');
    if (/PROFILE_PALETTE\.onGlass/.test(code))            bad.push('the public page reaches for the deck ground');
    if (!/nameAs="h1"/.test(code))                        bad.push('the name is not this surface\u2019s t1');
    // A second implementation announces itself as markup this page should not own.
    if (/<h2[\s>]/.test(code))                            bad.push('the page declares its own heading markup');
    if (/formatRs|Starting at/.test(code))                bad.push('the page builds its own money line');
    if (/force-dynamic/.test(code))                       bad.push('force-dynamic was not retired');
    if (!/export const revalidate/.test(code))            bad.push('no revalidate — the page is not static-friendly');
    bad.length === 0
      ? P('C30 /v/ mounts the one card, on cream', 'shared core, cream ground, h1, revalidate on')
      : F('C30 /v/ mounts the one card, on cream', bad.join('; '));
  }
}

// ── C31 · THE PAGE POLICES NEITHER APPROVAL NOR THE RATE, AND MUST NOT ───────
// Both are the DOOR's, asserted at `b44` §7.1 and §7.6: only approved rows are
// fetched, and `rate_display=false` nulls `starting_price` before it reaches the
// wire. A page that filtered again would be a second home for a ruling — and the
// second home is the one that gets forgotten when the first changes. What this
// cell asserts is the ABSENCE of a second gate, plus the presence of the null
// guard that is genuinely the page's (an absent price renders nothing at all).
{
  let pv = null, core = null;
  try { pv = readFileSync(join(ROOT, 'app/v/[code]/page.tsx'), 'utf8'); } catch { /* reported */ }
  try { core = readFileSync(join(ROOT, 'components/shared/VendorProfileContent.tsx'), 'utf8'); } catch { /* reported */ }
  if (!pv || !core) F('C31 approval and rate stay the door\u2019s rulings', 'a source file is missing');
  else {
    const code = strip(pv);
    const c = strip(core);
    const bad = [];
    if (/approval_state|approved/.test(code))   bad.push('the page re-filters on approval');
    if (/rate_display/.test(code))              bad.push('the page re-reads the rate switch');
    if (!/startingPrice\s*!=\s*null/.test(c))  bad.push('the core lost the null-renders-nothing guard');
    if (/\u20B9/.test(code) || /\u20B9/.test(c)) bad.push('the rupee glyph reached a couple-facing byte');
    if (/\b\d+(\.\d+)?\s?(k|L|Cr)\b/.test(code)) bad.push('shorthand money on the public page');
    bad.length === 0
      ? P('C31 approval and rate stay the door\u2019s rulings', 'no second gate; null still renders nothing; register clean')
      : F('C31 approval and rate stay the door\u2019s rulings', bad.join('; '));
  }
}

// ── C32 · W-1 · THE PAGE CAN BE ACTED ON ─────────────────────────────────────
// The founder walk found a storefront with nothing to tap. Every instrument was
// green: the core was mounted, the ground was cream, the OG image derived from
// the hero. Not one cell asked whether a couple could DO anything.
//
// This is that cell. It asserts the button reaches EVERY vendor via the wire's
// one contact field, and — the half that matters — that the page never builds a
// wa.me target out of a raw phone number, which is how a personal number would
// reach an open URL if a later seat "simplified" this.
{
  let pv = null;
  try { pv = readFileSync(join(ROOT, 'app/v/[code]/page.tsx'), 'utf8'); } catch { /* reported */ }
  if (!pv) F('C32 the page can be acted on', 'app/v/[code]/page.tsx not found');
  else {
    const code = strip(pv);
    const bad = [];
    if (!/card\.enquire_link/.test(code))        bad.push('the page does not read enquire_link');
    if (!/className="pv-cta"/.test(code))        bad.push('no enquire affordance renders');
    if (/enquiry_phone/.test(code))              bad.push('the page still reads the raw phone datum');
    if (/wa\.me\/\$\{/.test(code))              bad.push('the page builds its own wa.me target');
    // ⚠ THE GATE CHECK WAS SINGLE-LINE AND THE GATE IS NOT. `{wa && (` and
    // `className="pv-cta"` sit on different lines, so `[^\n]*` could never match
    // the regression this cell exists to catch: re-gating the button on is_demo
    // applied cleanly and reddened nothing. The CONDITION is extracted instead —
    // everything between the JSX open and the anchor tag.
    const ctaGate = (code.match(/\{[^{}]*&&\s*\(\s*\n\s*<a className="pv-cta"/) || [''])[0];
    if (!ctaGate)                          bad.push('the enquire affordance has no readable render condition');
    else if (/is_demo/.test(ctaGate))      bad.push('the button is still gated on is_demo');
    bad.length === 0
      ? P('C32 the page can be acted on', 'one contact field, every vendor, no target built here')
      : F('C32 the page can be acted on', bad.join('; '));
  }
}

// ── C33 · W-2 · THE HERO'S HEIGHT IS DERIVED FROM A REQUIREMENT ──────────────
// CE-38: the hero must leave the name and city visible without scrolling on a
// 390 column — "derive the ratio from that requirement (not a taste number),
// state it at site, and the photo strip follows the same law."
//
// A cell cannot see a screen. What it CAN refuse is the shape of a taste number:
// an unbounded aspect-ratio hero, a strip sized as a percentage of the viewport,
// and `vh` where `svh` is the only unit that accounts for browser chrome — which
// is precisely the ~100px that would push the name below the fold.
{
  let pv = null;
  try { pv = readFileSync(join(ROOT, 'app/v/[code]/page.tsx'), 'utf8'); } catch { /* reported */ }
  if (!pv) F('C33 the hero and strip are bounded by the fold law', 'app/v/[code]/page.tsx not found');
  else {
    const hero = (pv.match(/\.pv-hero\{[^}]*\}/) || [''])[0];
    const strip = (pv.match(/\.pv-strip img\{[^}]*\}/) || [''])[0];
    const bad = [];
    if (!hero)  bad.push('no .pv-hero rule');
    else {
      if (!/height:\s*min\(/.test(hero))   bad.push('the hero height is not capped by min()');
      if (!/svh/.test(hero))               bad.push('the hero uses vh, which ignores browser chrome');
      if (!/min-height:/.test(hero))       bad.push('no floor on very short viewports');
      if (/aspect-ratio/.test(hero))       bad.push('the hero is sized by ratio, so it is unbounded on tall phones');
    }
    if (!strip) bad.push('no .pv-strip img rule');
    else {
      // A percentage basis is what made the strip a second slideshow.
      if (/flex:\s*0\s+0\s+\d+%/.test(strip)) bad.push('the strip is sized as a percentage of the viewport');
      const px = (strip.match(/flex:\s*0\s+0\s+(\d+)px/) || [])[1];
      if (!px)                    bad.push('the strip has no fixed thumbnail width');
      else if (Number(px) > 140)  bad.push(`thumbnails at ${px}px read as a gallery, not a glance`);
    }
    // The arithmetic must be READABLE, not just correct — a derived number with
    // no derivation at site is a taste number wearing a formula.
    if (!/reserved below the hero/.test(pv)) bad.push('the derivation is not stated at site');
    bad.length === 0
      ? P('C33 the hero and strip are bounded by the fold law', 'min() + svh + floor; strip is a fixed-px glance; arithmetic at site')
      : F('C33 the hero and strip are bounded by the fold law', bad.join('; '));
  }
}

// ── C34 · W-4 · THE PAGE ARRIVES, AND DOES NOT TRAP A READER WHO REFUSED ─────
// "starts abruptly, ends abruptly, has nothing… no transition" — the founder,
// on a page whose stylesheet contained no @keyframes at all. Absence of motion
// is invisible to every other instrument in this estate; nothing would have
// noticed.
//
// THE SECOND HALF IS THE ONE THAT COULD HURT SOMEONE. Every element here
// animates from opacity 0 with `both` fill. Without a reduced-motion rule, a
// reader who has asked their phone to stop moving things would be held at
// opacity 0 forever — a blank page, served to the people least able to
// troubleshoot it. Motion is an enhancement; this cell is what keeps it one.
{
  let pv = null;
  try { pv = readFileSync(join(ROOT, 'app/v/[code]/page.tsx'), 'utf8'); } catch { /* reported */ }
  if (!pv) F('C34 the page arrives, and reduced-motion still gets all of it', 'app/v/[code]/page.tsx not found');
  else {
    const bad = [];
    const frames = (pv.match(/@keyframes\s+\w+/g) || []);
    if (frames.length < 2)                      bad.push('fewer than two keyframes — nothing arrives');
    const delays = (pv.match(/\d+ms\s+both/g) || []);
    if (delays.length < 4)                      bad.push('no staggered arrival across the movements');
    if (!/prefers-reduced-motion/.test(pv))     bad.push('NO REDUCED-MOTION ESCAPE — opacity:0 would be permanent');
    // ⚠ ASSERTED IN THE MARKUP, NOT THE STYLESHEET. The first cut tested each
    // class name against the whole file, so deleting `className="pv-close"` from
    // the JSX left the cell green on the strength of the `.pv-close{...}` rule
    // still sitting in the <style> block — a page with a stylesheet for a close
    // it no longer renders. Same for the rule and the gradient.
    const markup = strip(pv).split('function PublicStyles')[0];
    if (!/className="pv-close"/.test(markup)) bad.push('the page renders no close');
    if (!/className="pv-rule"/.test(markup))  bad.push('no section break between the movements');
    if (!/className="pv-fade"/.test(markup))  bad.push('the hero still stops at a hard edge');
    // The reduced-motion rule must actually cover the animated elements, not
    // merely exist — a media query naming one class would pass a bare presence
    // check and still strand the rest at opacity 0.
    const rm = (pv.match(/@media \(prefers-reduced-motion: reduce\)\{[^}]*\}/) || [''])[0];
    for (const cls of ['pv-hero', 'pv-body', 'pv-cta', 'pv-strip', 'pv-close']) {
      if (rm && !rm.includes(cls)) bad.push(`reduced-motion does not cover .${cls}`);
    }
    bad.length === 0
      ? P('C34 the page arrives, and reduced-motion still gets all of it', `${frames.length} keyframes, ${delays.length} staged, escape covers every animated block`)
      : F('C34 the page arrives, and reduced-motion still gets all of it', bad.join('; '));
  }
}

console.log('');
console.log(`${pass} PASS \u00b7 ${fail} FAIL`);
process.exit(fail === 0 ? 0 : 1);
