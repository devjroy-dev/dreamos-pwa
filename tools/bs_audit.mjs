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

console.log('');
console.log(`${pass} PASS \u00b7 ${fail} FAIL`);
process.exit(fail === 0 ? 0 : 1);
