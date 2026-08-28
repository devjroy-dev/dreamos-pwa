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
    // One miss branch only — two would be two grounds to drift.
    const misses = (code.match(/if \(!card\)/g) || []).length;
    if (misses !== 1) bad.push(`${misses} miss branches, expected exactly 1`);
    bad.length === 0
      ? P('C25 /v/ renders a designed page for a miss', 'one branch, shared ground, no status code')
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

console.log('');
console.log(`${pass} PASS \u00b7 ${fail} FAIL`);
process.exit(fail === 0 ? 0 : 1);
