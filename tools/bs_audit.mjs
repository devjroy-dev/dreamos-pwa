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

import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
// ⚠ THE SAME FUNCTION THE PAGE CALLS, NOT A TRANSCRIPTION OF IT (F-19.44).
// `app/v/[code]/page.tsx` interpolates this generator's output into its one
// <style> element, so the per-photograph index rules exist only at render. Every
// other cell in this file reads the page as TEXT and would see the characters
// `${heroSelectRules(heroCount)}` and no CSS at all. Importing the module is what
// keeps C34, C40, C41 and C42 asserting the bytes that ship rather than a string
// they cannot parse — the INDEPENDENT-METHOD LAW's first clause, obeyed by using
// the subject itself instead of a second copy of it that could drift.
import { heroSelectRules, PV_HERO_FADE } from '../lib/public/heroSelectRules.mjs';

const ROOT      = join(dirname(fileURLToPath(import.meta.url)), '..');
const TYPES     = join(ROOT, 'lib/solutions/types.ts');
const COPY      = join(ROOT, 'lib/solutions/copy.ts');
const SELF      = fileURLToPath(import.meta.url);

const PRINT_DIGEST = process.argv.includes('--print-digest');

let pass = 0, fail = 0, inco = 0;
const P = (n, why) => { console.log('PASS  ' + n + (why ? '  — ' + why : '')); pass++; };
const F = (n, why) => { console.log('FAIL  ' + n + '  — ' + why); fail++; };
// ⚠ INCONCLUSIVE IS A THIRD VERDICT AND IT IS NOT A PASS (F-19.37's shape).
// C41 and C42 drive a real browser over a fixture. If the browser cannot launch
// at all — no chromium in the environment — the honest answer is that nothing
// was looked at. Calling that FAIL would red the gate over a missing binary and
// teach a founder to push through a red; calling it PASS is the hollow green
// this estate has paid for repeatedly. So it is named, counted separately, and
// printed in the tally, and the delivery's verify line refuses a non-zero count.
// It does NOT move the exit code: the exit code answers "is anything broken",
// and an instrument that did not run has not answered that question either way.
const I = (n, why) => { console.log('INCO  ' + n + '  — ' + why); inco++; };

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

// ── RETIRED WITH THEIR SUBJECT — R-40.23 / R-G11.18, founder-ruled 2026-09-04 ──
// SEVEN CELLS RETIRE HERE: C6 (row labels ≤2 words), C13 (the six slugs in
// delivery order, both homes), C15 (six surfaces + the index exist), C19 (every
// surface is session-guarded), C22 (no surface raw-fetches), C26 (a withheld
// door looks withheld), C27 (no surface implies an address that resolves).
//
// EVERY ONE OF THEM WAS KEYED TO THE SIX R-19.2 SURFACES — by slug list, by file
// path, or by both — and the six retired with their reader in this delivery:
// `app/vendor/(shell)/support/{google,website,seo,marketing,proof,benchmarks}`,
// `SURFACE_SLUGS`, `surfaceHref`, `ROWS`, `ROW_EYEBROWS`, `SurfaceRow` and
// `lib/solutions/client.ts` (whose every fetcher served exactly those six and
// the index, leaving it with zero product readers).
//
// THEY ARE DELETED, NOT LOOSENED, AND THE DIFFERENCE IS THE WHOLE NOTE. A cell
// rewritten to "pass when the file is absent" is a green that means nothing;
// a cell whose subject no longer exists has no honest assertion left to make.
// Retire with the reader — the estate's standing law, and the same motion the
// six pages themselves took.
//
// ⚠ C6 IS THE ONE THAT YIELDED A RULE, NOT JUST A SUBJECT, AND IT IS SAID OUT
// LOUD. It pinned R-19.6's "row labels are nouns of ≤2 words". Four of R-40.1's
// nine break it — `Contracts & deposits`, `Referrals & partners`, `Open dates &
// rates`, `Your own number`. The founder ruled those names BY NAME, so the rule
// yields to the ruling rather than the ruling being trimmed to fit the rule.
// Nothing replaces C6 in this sitting: a length cell over nine founder-vetoed
// bytes would assert taste the founder has already exercised.
//
// WHAT DID NOT RETIRE: every cell not keyed to the six stands untouched —
// C1–C5, C7–C12, C14, C16–C18, C20, C21, C23–C25, C28–C42. The public-lane
// cells (C25, C28–C42) never read a surface slug and are unaffected.

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
    // AMENDED, LABELLED — 2026-09-05. A chip beyond spec §9's six is now one of
    // TWO things and the cell says which: `Open` was vetoed by the founder on
    // his G1.1 walk, `coming` is still a proposal under R-19.5. Printing both as
    // "awaiting veto" would have been false about one of them, and a line that
    // is false about a byte the founder already ruled is how a veto gets asked
    // for twice.
    const VETOED_BEYOND = ['Open'];
    const vetoed   = beyond.filter((v) => VETOED_BEYOND.includes(v));
    const proposed = beyond.filter((v) => !VETOED_BEYOND.includes(v));
    if (missing.length) F('C8  chips cover spec \u00a79', 'missing: ' + missing.join(', '));
    else P('C8  chips cover spec \u00a79',
           `all six present${vetoed.length ? ' \u00b7 VETOED beyond the set: ' + vetoed.join(', ') : ''}` +
           `${proposed.length ? ' \u00b7 PROPOSED, awaiting veto: ' + proposed.join(', ') : ''}`);
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
  try { surfaceSrc[s] = readFileSync(join(ROOT, `app/vendor/(shell)/support/${s}/page.tsx`), 'utf8'); }
  catch { surfacesReadable = false; surfaceSrc[s] = null; }
}
let indexSrc = null, piecesSrc = null, routesSrc = null, clientSrc = null;
try {
  indexSrc  = readFileSync(join(ROOT, 'app/vendor/(shell)/support/page.tsx'), 'utf8');
  piecesSrc = readFileSync(join(ROOT, 'components/solutions/SolutionsPieces.tsx'), 'utf8');
  routesSrc = readFileSync(join(ROOT, 'lib/solutions/routes.ts'), 'utf8');
  clientSrc = readFileSync(join(ROOT, 'lib/solutions/client.ts'), 'utf8');
} catch { surfacesReadable = false; }

// ── C16 · THE ADDRESS BOOK (R-38.1's shape, ratified by CE-38) ────────────
// C31's shape in this seat's own gate. `/w/support` cannot go through
// `roomHref` — these are not rooms and `rooms.ts` is S2's — so without this cell
// six scattered literals would grow exactly where R-38.1 just finished deleting
// four. The one home is `lib/solutions/routes.ts`.
{
  const files = { ...surfaceSrc, 'app/vendor/(shell)/support/page.tsx': indexSrc, 'components/solutions/SolutionsPieces.tsx': piecesSrc, 'lib/solutions/client.ts': clientSrc };
  const offenders = [];
  for (const [name, src] of Object.entries(files)) {
    if (!src) continue;
    if (/['"`]\/vendor\/support/.test(strip(src))) offenders.push(name);
  }
  const declared = routesSrc && /SOLUTIONS_INDEX_HREF = '\/vendor\/support'/.test(strip(routesSrc));
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
    // ⚠ `[^}]*` COULD NOT SEE PAST A NESTED OBJECT. The miss return grew
    // `other: { 'tdw-build': BUILD }` for W2-6's cure, and the character class
    // stopped at that inner brace — so `robots` fell outside the captured text
    // and this cell reported a page defect that did not exist. Balanced to the
    // end of the return statement instead.
    const m = code.match(/if \(!card\) \{\s*(return \{[\s\S]*?\};)/);
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
    // ⚠ THE FLEX ITEM MOVED (W4-1). Wrapping each thumbnail in an anchor made
    // `.pv-strip a` the flex child; the image inside is no longer flexed at all.
    // This cell read `.pv-strip img` for the basis and correctly reddened — the
    // guard caught its own subject moving out from under it, which is the whole
    // reason it was written against the rule rather than against a screenshot.
    // It now reads whichever element actually flexes.
    //
    // ⚠ AND IT MOVED AGAIN (F-19.44, F-19.p3). The anchor became a `<label>`.
    // The comment above already says the right thing — *read whichever element
    // actually flexes* — but the code under it did not: it named two tag
    // spellings and picked between them, so the third spelling fell through to
    // `.pv-strip img`, which no longer carries `flex:` at all, and the cell
    // reported "no fixed thumbnail width" against a page that had one.
    // A roster of the tags a seat happened to think of, twice.
    //
    // Now the tag is DERIVED FROM THE MARKUP, the same way C37 derives it: the
    // direct child of `.pv-strip` is the flex item, whatever it is called. This
    // cell and C37 ask different questions of that element — this one about the
    // fold, that one about F-19.38's minimum — and neither has to be edited the
    // next time the wrapper changes.
    const stripChild = (() => {
      const mk = strip(pv).split('function PublicStyles')[0];
      const blk = mk.match(/className="pv-strip"[\s\S]{0,1200}/);
      return blk ? (blk[0].match(/<([a-z]+)[\s>]/) || [])[1] : null;
    })();
    const stripItem = stripChild
      ? (pv.match(new RegExp('\\.pv-strip\\s+' + stripChild + '\\{[^}]*\\}')) || [''])[0]
      : '';
    const stripImg = (pv.match(/\.pv-strip img\{[^}]*\}/) || [''])[0];
    const strip_ = /flex:/.test(stripItem) ? stripItem : stripImg;
    const bad = [];
    if (!hero)  bad.push('no .pv-hero rule');
    else {
      // ⚠ LABELLED AMENDMENT (D-19.1 §1). S4 derived the hero as
      // `min(calc(100svh - 140px), 420px)` from the reserved space below it,
      // because the NAME SAT BELOW THE HERO and had to be pushed above the fold.
      // D-19.1 moves her name INSIDE the hero, over the scrim — so the fold
      // requirement is met by construction and the arithmetic it was derived
      // from no longer describes the page. The chair ruled the measure:
      // `clamp(320px, 56vh, 460px)`, her name and Enquire's top edge sharing the
      // first fold at 374×900.
      //
      // WHAT THE CELL STILL REFUSES IS UNCHANGED: an unbounded hero. `clamp`
      // carries its own floor and ceiling, which is why `min-height` is no
      // longer required — the floor moved inside the function rather than
      // disappearing. A bare `aspect-ratio` hero is still forbidden: it is
      // unbounded on a tall phone, and it is also what made the box un-sizable
      // before the image loaded, which is now the CLS property (§3).
      if (!/height:\s*clamp\(/.test(hero)) bad.push('the hero height is not bounded by clamp()');
      if (/aspect-ratio/.test(hero))       bad.push('the hero is sized by ratio, so it is unbounded and cannot pre-size the box');
      const cl = hero.match(/clamp\(\s*(\d+)px\s*,\s*([\d.]+)vh\s*,\s*(\d+)px\s*\)/);
      if (!cl)                             bad.push('the clamp is not floor/viewport/ceiling in px,vh,px');
      else if (Number(cl[3]) > 520)        bad.push(`ceiling ${cl[3]}px fills a phone with one photograph`);
    }
    if (!strip_) bad.push('no rule carries the strip flex item — nothing bounds the thumbnail');
    else {
      // A percentage basis is what made the strip a second slideshow.
      if (/flex:\s*0\s+0\s+\d+%/.test(strip_)) bad.push('the strip is sized as a percentage of the viewport');
      const px = (strip_.match(/flex:\s*0\s+0\s+(\d+)px/) || [])[1];
      if (!px)                    bad.push('the strip has no fixed thumbnail width');
      else if (Number(px) > 140)  bad.push(`thumbnails at ${px}px read as a gallery, not a glance`);
      // F-19.38 must survive the wrapper. Whatever flexes needs its automatic
      // minimum defused, and the image needs it too in case a later seat unwraps
      // the anchor — the four-sitting bug would otherwise return through the
      // door W4-1's cure opened.
      if (!/min-width:\s*0/.test(strip_))   bad.push('the flex item does not defuse min-width (F-19.38)');
      if (stripImg && !/min-width:\s*0/.test(stripImg))
        bad.push('the thumbnail image does not defuse min-width');
    }
    // The arithmetic must be READABLE, not just correct — a derived number with
    // no derivation at site is a taste number wearing a formula.
    if (!/her name and Enquire|checked at both ends|Checked at both ends/i.test(pv))
      bad.push('the measure is not reasoned at site');
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
    // ⚠ LABELLED AMENDMENT (D-19.1 §3). This asked for four or more staged
    // blocks, which was right for S4's composition and is wrong for the ruled
    // one: "the hero name and eyebrow fade-and-rise 400ms ease-out, 80ms
    // stagger; card content follows at 150ms... **Nothing else animates.**"
    // A cell demanding four would now demand a divergence from the ruling —
    // which is exactly what it was doing, because S4's five survived into the
    // cut and `pv_render` caught them, not this file.
    const delays = (pv.match(/\d+ms\s+both/g) || []);
    if (delays.length < 2)  bad.push('nothing arrives at all');
    if (delays.length > 3)  bad.push(`${delays.length} staged blocks — D-19.1 §3 rules two`);
    if (!/prefers-reduced-motion/.test(pv))     bad.push('NO REDUCED-MOTION ESCAPE — opacity:0 would be permanent');
    // ⚠ ASSERTED IN THE MARKUP, NOT THE STYLESHEET. The first cut tested each
    // class name against the whole file, so deleting `className="pv-close"` from
    // the JSX left the cell green on the strength of the `.pv-close{...}` rule
    // still sitting in the <style> block — a page with a stylesheet for a close
    // it no longer renders. Same for the rule and the gradient.
    const markup = strip(pv).split('function PublicStyles')[0];
    if (!/className="pv-close"/.test(markup)) bad.push('the page renders no close');
    if (!/className="pv-rule"/.test(markup))  bad.push('no section break between the movements');
    // `pv-fade` became `pv-scrim` at D-19.1: same gradient, different job. It
    // stopped being the thing that dissolved the photo into a cream page and
    // became the thing that makes HER NAME legible over her own work — which is
    // why the element it used to protect (the TDW wordmark) is gone entirely.
    // W3-5, reported twice about the same edge: "theres no top of the page...
    // starts abruptly with a picture." Nothing guarded it, so removing the
    // header reddened no cell at all.
    if (!/className="pv-top"/.test(markup)) bad.push('the page has no top — it opens on a photograph at y=0');
    if (!/className="pv-scrim"/.test(markup)) bad.push('the hero has no scrim under the name');
    if (!/className="pv-identity"/.test(markup)) bad.push('the name does not render over the hero');
    // The reduced-motion rule must actually cover the animated elements, not
    // merely exist — a media query naming one class would pass a bare presence
    // check and still strand the rest at opacity 0.
    // The escape must cover exactly what MOVES — no less, and a roster of
    // classes that no longer animate is a cell asserting yesterday's page.
    // Derived: every selector carrying an `animation:` in the sheet.
    // ⚠ LABELLED AMENDMENT (F-19.44). Two things moved under the hero-selection
    // cure and this cell had to move with them.
    //
    // 1 · THE SHEET IS NO LONGER ENTIRELY IN THE FILE. The per-photograph index
    //     rules are generated at render by `lib/public/heroSelectRules.mjs`, and
    //     the fade that reveals the selected hero lives in one of them. Reading
    //     the file alone, this cell would have seen no hero animation, found
    //     nothing to cover, and gone green over an escape that does not exist.
    //     So the subject is the static sheet PLUS the real generated output. The
    //     count is arbitrary and does not matter: the rules are uniform per
    //     index, so three proves the shape N would have.
    //
    // 2 · THE SELECTOR ENDS IN AN ATTRIBUTE NOW. `.pv-hero-img[data-i="0"]{` did
    //     not match a pattern that expected `{` straight after the class, so the
    //     animating element was invisible to the roster. Same class of miss as
    //     the one the comment above describes, one layer deeper.
    const sheet = (pv.match(/<style>\{`[\s\S]*?`\}<\/style>/) || [''])[0];
    const sheetAll = sheet + '\n' + heroSelectRules(3);
    const movers = [...sheetAll.matchAll(/\.([a-z-]+)(?:\[[^\]]*\])?(?:\s+\w+)?\s*\{[^}]*animation:\s*pv/g)].map((m) => m[1]);
    // Every reduced-motion block, not the first one. The generated escape is a
    // second block on purpose — it needs id-level specificity to beat the rule
    // it is escaping — and a regex that stopped at the first would have reported
    // the hero fade uncovered while the cure sat two lines below.
    const rm = [...sheetAll.matchAll(/@media \(prefers-reduced-motion: reduce\)\{[\s\S]*?\n\}/g)].map((m) => m[0]).join('\n');
    if (!movers.length) bad.push('no element carries an animation');
    for (const cls of new Set(movers)) {
      if (!rm.includes(cls)) bad.push(`reduced-motion does not cover .${cls}, which animates`);
    }
    bad.length === 0
      ? P('C34 the page arrives, and reduced-motion still gets all of it', `${frames.length} keyframes, ${delays.length} staged, escape covers every animated block`)
      : F('C34 the page arrives, and reduced-motion still gets all of it', bad.join('; '));
  }
}

// ── C35 · EVERY DECLARED INK ON THE PUBLIC ROUTES COMPUTES ≥ 4.5:1 ──────────
// W2-4: the close shipped at 2.36:1 through a 34-cell audit, and the CTA sat at
// 4.48:1 — 0.02 under — with nobody having computed either. Every ink on this
// page was chosen by eye, and only an eye was ever asked about them.
//
// **No instrument in this estate had ever computed a contrast ratio.** This is
// the cheapest high-value cell the block could add: the arithmetic is exact, the
// inputs are in the stylesheet, and a founder should never be the first to
// notice that type is unreadable.
//
// It reads the DECLARED pairs. What a light glyph sits on when the background is
// a photograph is not computable from any stylesheet — that is `pv_render`'s,
// and it is why D-19.1 removed the one element that depended on it.
{
  const lum = (hex) => {
    const c = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const ratio = (a, b) => {
    const la = lum(a), lb = lum(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  };

  let pv = null;
  try { pv = readFileSync(join(ROOT, 'app/v/[code]/page.tsx'), 'utf8'); } catch { /* reported */ }
  if (!pv) F('C35 every declared ink on /v/ clears 4.5:1', 'app/v/[code]/page.tsx not found');
  else {
    const sheet = (pv.match(/<style>\{`[\s\S]*?`\}<\/style>/) || [''])[0];
    // The page's ground, derived from the rule rather than assumed.
    const groundM = sheet.match(/\.pv\{[^}]*background:\s*(#[0-9A-Fa-f]{6})/);
    const ground = groundM ? groundM[1].slice(1) : null;
    const bad = [];
    if (!ground) bad.push('the page ground could not be read from .pv');
    else {
      // Every class that carries type on that ground. Selectors inside the hero
      // are excluded BY NAME and with a reason: they sit on a photograph under a
      // scrim, so a cream comparison would be arithmetic about the wrong surface.
      const ON_PHOTO = ['pv-identity'];
      const rules = [...sheet.matchAll(/\.([a-z-]+)\s*\{([^}]*)\}/g)];
      let checked = 0;
      for (const [, cls, body] of rules) {
        if (ON_PHOTO.includes(cls)) continue;
        const m = body.match(/(?:^|;|\s)color:\s*(#[0-9A-Fa-f]{6})/);
        if (!m) continue;
        const r = ratio(m[1].slice(1), ground);
        checked++;
        if (r < 4.5) bad.push(`.${cls} ${m[1]} on #${ground} = ${r.toFixed(2)}:1`);
      }
      if (checked < 4) bad.push(`only ${checked} inks found — the sheet did not parse`);
      if (bad.length === 0) {
        P('C35 every declared ink on /v/ clears 4.5:1', `${checked} inks computed against #${ground}`);
      }
    }
    if (bad.length) F('C35 every declared ink on /v/ clears 4.5:1', bad.join('; '));
  }
}

// ── C36 · THE PUBLIC ROUTES ARE OUT FROM UNDER THE APP SHELL (F-19.36) ──────
// Two facts, and a mutation of either reddened NOTHING before this cell existed:
// removing the service-worker bypass, and dropping the build meta tag. Both are
// invisible to every other instrument here, and both are cures the founder's
// walks paid for.
//
// 1. THE REGISTRAR IS NOT IN THE ROOT LAYOUT. It was, with
//    `register('/sw.js')` and no `scope` — which defaults to the whole origin —
//    so one visit to the public landing claimed `/v/` and `/r/` for that
//    browser. It mounts per authenticated shell now. The structural cure.
// 2. `sw.js` BYPASSES THE PUBLIC PREFIXES for browsers already claimed, and
//    does so WITHOUT unregistering: c-38.40 ruled that ending an origin-wide
//    worker because a stranger opened a storefront would kill a vendor's push
//    and image cache in the same browser. The cure must not outcost the disease.
// 3. THE PAGE NAMES ITS BUILD, so a walk begins by reading the commit off the
//    page rather than trusting a deployment URL. Two walks were run against
//    unidentified builds; the second closed two findings as unattributable.
{
  const bad = [];
  let root = null, sw = null, pv = null;
  try { root = readFileSync(join(ROOT, 'app/layout.tsx'), 'utf8'); } catch { bad.push('app/layout.tsx not found'); }
  try { sw   = readFileSync(join(ROOT, 'public/sw.js'), 'utf8'); } catch { bad.push('public/sw.js not found'); }
  try { pv   = readFileSync(join(ROOT, 'app/v/[code]/page.tsx'), 'utf8'); } catch { bad.push('the public page not found'); }

  if (root && /ServiceWorkerRegistrar/.test(strip(root)))
    bad.push('the registrar is back in the root layout — every public route is claimed again');

  // Derived, not rostered: every authenticated shell layout must carry a mount.
  // A shell added tomorrow that forgets one loses its worker silently.
  const SHELLS = ['app/vendor/layout.tsx', 'app/vendor/(shell)/layout.tsx', 'app/coplanner/layout.tsx', 'app/(frost)/layout.tsx'];
  for (const f of SHELLS) {
    let src = null;
    try { src = readFileSync(join(ROOT, f), 'utf8'); } catch { bad.push(`${f} not found`); continue; }
    if (!/<ServiceWorkerRegistrar\s*\/>/.test(strip(src))) bad.push(`${f} has no registrar mount`);
  }

  if (sw) {
    const code = strip(sw);
    if (!/PUBLIC_PREFIXES/.test(code))                    bad.push('sw.js declares no public prefixes');
    if (!/startsWith\(p\)/.test(code))                    bad.push('the bypass does not test the prefixes');
    if (/registration\.unregister\(/.test(code))          bad.push('sw.js unregisters — c-38.40 forbids the collateral');
    for (const pre of ["'/v/'", "'/r/'"]) if (!code.includes(pre)) bad.push(`${pre} is not bypassed`);
    // The bypass only reaches a claimed browser when the worker's bytes change.
    if (!/Service Worker v7/.test(sw))                    bad.push('the worker version did not advance — claimed browsers never receive the bypass');
  }

  if (pv) {
    const code = strip(pv);
    if (!/'tdw-build'/.test(code))                        bad.push('the page does not name its build');
    if ((code.match(/'tdw-build'/g) || []).length < 2)     bad.push('only one branch names the build — a miss must be attributable too');
  }

  bad.length === 0
    ? P('C36 the public routes are out from under the app shell', 'registrar per-shell, sw v7 bypasses /v/ and /r/ without unregistering, both branches name the build')
    : F('C36 the public routes are out from under the app shell', bad.join('; '));
}

// ── C37 · THE STYLESHEET'S OWN TRAPS ────────────────────────────────────────
// Three cells, each paid for by a defect that shipped or nearly did.
//
// 1 · NO BACKTICK INSIDE THE <style> TEMPLATE LITERAL. Twice now this seat wrote
//     CSS comments quoting identifiers the way the rest of the file does —
//     `flex-basis`, `min-width: auto` — inside a template literal, where a
//     backtick TERMINATES the string. The build broke both times with eighty
//     lines of JSX errors pointing anywhere but the cause. Prose broke the code,
//     and a cell is cheaper than a third occurrence.
//
// 2 · NO `infinite` ANIMATION ON A CONTENT ELEMENT. F-19.40: the hero shimmer
//     was placed on the <img> with `infinite`, so it pulsed the PHOTOGRAPH
//     forever and the founder walked a page that looked permanently loading.
//     Every existing cell passed it — C34 asked about coverage, never duration.
//     A placeholder may loop; a thing a reader is trying to look at may not.
//
// 3 · NO FLEX IMAGE WITHOUT `min-width`. F-19.38, the four-sitting bug: an
//     `<img>` in a flex row with `min-width:auto` is floored at its INTRINSIC
//     width, so a 104px basis rendered a 1080px photograph. The declaration was
//     honoured and outranked, which is why five source derivations all cleared
//     the page.
{
  let pv = null;
  try { pv = readFileSync(join(ROOT, 'app/v/[code]/page.tsx'), 'utf8'); } catch { /* reported */ }
  if (!pv) F('C37 the stylesheet carries none of its three known traps', 'app/v/[code]/page.tsx not found');
  else {
    const bad = [];
    const open_ = pv.indexOf('<style>{`');
    const close = pv.indexOf('`}</style>');
    if (open_ < 0 || close < 0) bad.push('the style template could not be located');
    else {
      const sheet = pv.slice(open_ + 9, close);
      const ticks = (sheet.match(/`/g) || []).length;
      if (ticks) bad.push(`${ticks} backtick(s) inside the style template — it closes early`);

      // A looping animation is permitted only where the element's own name says
      // it is a placeholder. Derived from the rule, not from a roster.
      for (const [, cls, body] of sheet.matchAll(/\.([a-z-]+)[^{]*\{([^}]*)\}/g)) {
        if (!/animation:[^;]*\binfinite\b/.test(body)) continue;
        // ⚠ A PLACEHOLDER MAY LOOP — BUT NOT WITHOUT A CAP. The first cut of
        // this test exempted anything named `shimmer`, so re-introducing
        // `infinite` on `.pv-shimmer` reddened nothing: a mutation that restored
        // the founder's exact complaint passed. CE-38 capped it at three
        // iterations, and the cap is the whole cure — CSS has no observer of
        // image load, so a bounded count is the honest substitute for a stop.
        const placeholder = /shimmer|placeholder|skeleton|spinner/.test(cls);
        if (!placeholder) bad.push(`.${cls} loops forever and is not a placeholder`);
        else bad.push(`.${cls} is a placeholder but loops forever — cap it (F-19.40)`);
      }

      // Every image inside a flex row needs its automatic minimum defused.
      const flexParents = [...sheet.matchAll(/\.([a-z-]+)\s*\{[^}]*display:\s*flex[^}]*\}/g)].map((m) => m[1]);
      for (const parent of flexParents) {
        const re = new RegExp('\\.' + parent + '\\s+img\\s*\\{([^}]*)\\}');
        const m = sheet.match(re);
        if (!m) continue;
        if (!/min-width:\s*0/.test(m[1])) {
          bad.push(`.${parent} img has no min-width:0 — its intrinsic width will floor the flex basis`);
        }
      }

      // ── LABELLED AMENDMENT · F-19.p3 · THE CURE IS ASSERTED ON WHATEVER
      //    CARRIES IT, NEVER ON A TAG NAME (CE-39 ruling 3) ───────────────────
      // The clause above asks about `img`, and that was right exactly once. The
      // flex item under `.pv-strip` has now been the img (P0-B), then an anchor
      // (W4-1), and is now a `<label>` (F-19.44) — and at each move the whole
      // four-sitting bug rides on `flex:0 0 104px; min-width:0` travelling with
      // it. An `img` that is no longer a flex child can carry `min-width:0`
      // forever while the element that actually flexes is floored at 1080px, and
      // this cell would have said nothing, twice.
      //
      // So the flex item is DERIVED FROM THE MARKUP: whatever tag the page
      // renders as the direct child of `.pv-strip` is the element the rule must
      // land on. Source of the failure and source of the check are different —
      // one is JSX, the other is CSS — which is the independent-method property
      // a same-file grep would not have.
      const stripMarkup = strip(pv).split('function PublicStyles')[0];
      const stripBlock = stripMarkup.match(/className="pv-strip"[\s\S]{0,1200}/);
      if (!stripBlock) {
        // Not a failure: a page with no strip has no flex item to protect.
        // Silence here would be the roster mistake in reverse, so it is stated.
        if (/className="pv-strip"/.test(stripMarkup)) bad.push('the strip renders but its markup could not be read');
      } else {
        const child = (stripBlock[0].match(/<([a-z]+)[\s>]/) || [])[1];
        if (!child) bad.push('the strip renders no element — its flex item could not be derived');
        else {
          const itemRe = new RegExp('\\.pv-strip\\s+' + child + '\\s*\\{([^}]*)\\}');
          const item = sheet.match(itemRe);
          if (!item) bad.push(`.pv-strip renders <${child}> and the sheet has no .pv-strip ${child} rule — nothing defuses its automatic minimum`);
          else {
            if (!/min-width:\s*0/.test(item[1])) bad.push(`.pv-strip ${child} is the flex item and has no min-width:0 — F-19.38 returns`);
            if (!/flex:/.test(item[1]))         bad.push(`.pv-strip ${child} is the flex item and declares no flex basis`);
          }
        }
      }
    }
    bad.length === 0
      ? P('C37 the stylesheet carries none of its three known traps', 'no stray backtick; no content element loops; every flex image defuses min-width')
      : F('C37 the stylesheet carries none of its three known traps', bad.join('; '));
  }
}

// ── C38 · NO APP-LANE CHROME REACHES A PUBLIC ROUTE (F-19.41 / F-19.42) ─────
// THIRD INSTANCE OF ONE CLASS, and this cell exists so there is no fourth.
//
//   F-19.36  the root layout registered an origin-wide service worker, so one
//            visit to the landing claimed /v/ and /r/ for that browser.
//   F-19.41  the root layout's STATIC theme-color is the app's near-black, and
//            its per-lane override has branches for vendor, frost and landing
//            only — so a public storefront wore the shell's chrome.
//   F-19.42  nothing declared `color-scheme` anywhere, so Chrome's auto-dark
//            inverted a page whose cream ground was chosen deliberately.
//
// **One file, three leaks, one shape: the root layout does not know that some of
// its children are not the app.** The first two were found by a founder walk;
// the third by a probe after the seat's own file-derived mechanism was refused
// by the browser. None of them was visible to any instrument here.
//
// ⚠ IT ASSERTS THE DECLARATION EXISTS, NOT WHAT IT SAYS — because F-19.42's
// defect was never a wrong value, it was an ABSENT one, and an absent
// declaration is exactly what a value-checking cell cannot see.
{
  const bad = [];
  const APP_INK = '#1E0A0E';   // the root layout's static theme-color

  // The leak's SOURCE, not only its symptom. The root layout's inline script
  // paints a background per lane and its branches named vendor, frost, admin and
  // landing — every app surface, and no public one. Deleting the storefront
  // branch reddened nothing until this check existed, which meant the cure could
  // silently regress while both public routes still looked correctly declared.
  let root = null;
  try { root = readFileSync(join(ROOT, 'app/layout.tsx'), 'utf8'); } catch { bad.push('app/layout.tsx not found'); }
  if (root) {
    const code = strip(root);
    // ⚠ THE BRANCH MUST BE WIRED, NOT MERELY NAMED — D-38.1, in a cell written
    // to catch a leak. The first cut grepped for `isPublicStorefront` anywhere
    // in the file, so cutting the branch to `else if(false)` left the variable
    // DECLARATION standing and the cell passed while /v/ fell through to an app
    // lane again. Presence is not behaviour, and a predicate nothing branches on
    // is a comment with a semicolon.
    const declared = /var\s+isPublicStorefront\s*=/.test(code);
    const branched = /else\s+if\s*\(\s*isPublicStorefront\s*\)\s*\{\s*bg\s*=/.test(code);
    if (!declared)  bad.push('the root layout declares no public-storefront predicate');
    if (!branched)  bad.push('the public-storefront predicate is declared but nothing branches on it — /v/ and /r/ still fall through to an app lane');
    // ── AMENDED, LABELLED — F-40.52 (Block 19 G1.1, 2026-09-05) ────────────
    // THE CENSUS IS THE DEFECT THIS CELL HAD. Its header says C38 "refuses a
    // third instance", and a third instance shipped anyway: `/credits/<token>`
    // is a public capability page reached from WhatsApp, and it fell through to
    // the app lane wearing #1E0A0E above a cream page. The cell passed because
    // it asked about /v/ and /r/ BY NAME and had never heard of the new route.
    //
    // A NAMED LIST CANNOT SEE A LANE NOBODY ADDED TO IT. So the list is declared
    // here, once, and every member is asserted in a loop — a fourth lane joins
    // by one line rather than by someone remembering this cell exists.
    const PUBLIC_LANES = ['/v/', '/r/', '/credits/'];
    for (const lane of PUBLIC_LANES) {
      if (declared && !code.includes(`indexOf('${lane}')===0`)) {
        bad.push(`the public predicate does not name ${lane}`);
      }
    }
  }

  // ── AMENDED BY LABEL — F-40.166 / R-40.83 (Block 19 G3.1, 2026-09-06) ────
  // THE LANE CENSUS WAS MADE A LOOP AND THE FILE CENSUS NEVER WAS. F-40.52
  // cured the first because a named list cannot see a lane nobody added to it;
  // this cell then went on naming TWO FILES BY HAND, and the same disease
  // reappeared one level down. `app/v/[code]/w/[slug]/page.tsx` shipped in G1.1
  // and this cell has never read a byte of it — it declared no `themeColor` and
  // served the app's near-black until the layout's script ran (F-40.167, cured
  // in the same delivery). G3.1 then added a third leaf to the same lane.
  //
  // A LEAF JOINS BY EXISTING NOW. The walk finds every `page.tsx` under `app/v`
  // and asserts on each what the two hand-named files were asserted for, so the
  // cell TIGHTENS as the lane grows rather than going quietly stale.
  function leavesUnder(dir) {
    const out = [];
    let entries;
    try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return out; }
    for (const e of entries) {
      const full = dir + '/' + e.name;
      if (e.isDirectory()) out.push(...leavesUnder(full));
      else if (e.name === 'page.tsx') out.push(full);
    }
    return out;
  }
  const leaves = leavesUnder(join(ROOT, 'app/v'));
  // A walk that reaches nothing would go GREEN, which is exactly how this rule
  // stayed unenforced for two leaves' lifetime. No leaf found is a RED.
  if (leaves.length < 2) {
    bad.push(`the /v/ leaf walk found ${leaves.length} page.tsx — it is not reaching the lane, and a green here would mean nothing`);
  }
  for (const leaf of leaves) {
    const rel = leaf.slice(ROOT.length + 1);
    let src = null;
    try { src = readFileSync(leaf, 'utf8'); } catch { bad.push(`${rel} not readable`); continue; }
    const code = strip(src);
    if (!/export const viewport/.test(code))   bad.push(`${rel} declares no viewport — it inherits the shell\u2019s chrome`);
    if (!/themeColor:/.test(code))             bad.push(`${rel} declares no themeColor — the served HTML carries the app lane's ink until the layout script runs`);
    if (!/colorScheme:\s*'light'/.test(code))  bad.push(`${rel} does not declare color-scheme: light`);
    // The cascade half, per leaf: the viewport export alone reads well and does
    // not reach the cascade — a meta tag is not a CSS property, and
    // getComputedStyle returns "normal", which is the state auto-dark inverts.
    // ⚠ ANCHORED TO LINE START, AND A MUTATION IS WHY. The first cut of this
    // matched the rule ANYWHERE in the raw source, and the G3.1 date leaf
    // mentions `:root{color-scheme:light}` in a PROSE COMMENT explaining why the
    // rule is there. Deleting the real rule left the sentence about it, and the
    // cell went green on its own explanation — the same disease `strip` exists
    // for, met inside a template literal where `strip` cannot safely go (CSS
    // block comments and `https://` would both be mangled). The stylesheet
    // writes its rules at column 0; prose never does. That is the distinction,
    // and it is cheaper and safer than parsing.
    if (!/^:root\{color-scheme:\s*light\}/m.test(src)) bad.push(`${rel} declares color-scheme in metadata only — it never reaches the cascade`);
    if (code.includes(APP_INK))                bad.push(`${rel} carries the app lane's ink ${APP_INK}`);
  }

  let pv = null, rr = null;
  try { pv = readFileSync(join(ROOT, 'app/v/[code]/page.tsx'), 'utf8'); } catch { bad.push('the public page not found'); }
  try { rr = readFileSync(join(ROOT, 'app/r/[code]/route.ts'), 'utf8'); } catch { bad.push('the review route not found'); }

  if (pv) {
    const code = strip(pv);
    // ⚠ AND IT MUST REACH THE CASCADE. The viewport export alone did not settle
    // it: the arm read `getComputedStyle(html).colorScheme` and got "normal",
    // because that reads the CSS property and a meta tag is not one — and
    // "normal" is the exact state auto-dark inverts. Removing the CSS rule
    // reddened NOTHING on this cell's first run, so the half that does the work
    // in a browser was unguarded while the half that reads well was not.
    if (!/:root\{color-scheme:\s*light\}/.test(pv))  bad.push('/v/ declares color-scheme in metadata only — it never reaches the cascade');
    if (code.includes(APP_INK))                     bad.push(`/v/ carries the app lane's ink ${APP_INK}`);
  }
  if (rr) {
    const code = strip(rr);
    // /r/ writes its own document, so its leak is an ABSENCE rather than an
    // inheritance — the same two declarations, for the opposite reason.
    if (!/name="theme-color"/.test(code))           bad.push('/r/ emits no theme-color');
    if (!/color-scheme/.test(code))                 bad.push('/r/ declares no color-scheme');
    if (code.includes(APP_INK))                     bad.push(`/r/ carries the app lane's ink ${APP_INK}`);
  }

  bad.length === 0
    ? P('C38 no app-lane chrome reaches a public route', 'both public routes declare their own theme-color and color-scheme; neither carries the app ink')
    : F('C38 no app-lane chrome reaches a public route', bad.join('; '));
}

// ── C39 · EVERY PHOTOGRAPH CAN BE OPENED, WITHOUT SHIPPING JAVASCRIPT ───────
// W4-1: "tapping the pictures does nothing", on a page whose subject is the
// work. CE-38 ruled shape (1) — an anchor per photograph to its own source, the
// browser's own viewer doing the zooming — and refused the CSS-only `:target`
// lightbox because back-button weirdness on a stranger's phone is a worse
// product than an honest link.
//
// THE SECOND HALF IS THE ONE THAT PROTECTS THE RULING. This route's refusal of
// client JS is load-bearing, and a later seat reaching for a viewer would reach
// for `'use client'`. The cell refuses it here.
{
  let pv = null;
  try { pv = readFileSync(join(ROOT, 'app/v/[code]/page.tsx'), 'utf8'); } catch { /* reported */ }
  if (!pv) F('C39 every photograph displaces the hero, and no JavaScript ships', 'the public page not found');
  else {
    const code = strip(pv);
    const markup = code.split('function PublicStyles')[0];
    const bad = [];

    // 1 · NO ANCHOR WRAPS A PHOTOGRAPH. The literal inversion of what this cell
    //     used to demand. Both retired spellings are named so a revert reddens
    //     here rather than passing as "not the current shape".
    if (/className="pv-heroLink"/.test(markup))  bad.push('the hero is an anchor again — F-19.44 reversed');
    if (/<a[^>]*href=\{p\.url\}/.test(markup))   bad.push('a strip thumbnail is an anchor again — F-19.44 reversed');
    // Structural, not spelling-based: any <a> with an <img> inside it, however
    // the href is written. A later seat re-wrapping a photograph in a link with
    // a different attribute order would not escape this.
    if (/<a\b[^>]*>[\s\S]{0,400}?<img\b/.test(markup)) bad.push('an anchor wraps an image on the page');

    // 2 · ONE RADIO PER PHOTOGRAPH, ONE LABEL PER RADIO — and the proof is that
    //     BOTH MAP THE SAME ARRAY. Counting tags in source cannot work: the page
    //     renders N of each from a loop and N is only known at request time. So
    //     the cell asserts the property that makes the counts equal by
    //     construction — same collection, same index expression, same id.
    const radioArr = (markup.match(/\{\s*([A-Za-z_$][\w$]*)\.map\(\([^)]*\)\s*=>\s*\(?\s*<input\s+[\s\S]{0,200}?type="radio"/) || [])[1];
    const labelArr = (markup.match(/\{\s*([A-Za-z_$][\w$]*)\.map\(\([^)]*\)\s*=>\s*\(?\s*<label\b/) || [])[1];
    const heroArr  = (markup.match(/\{\s*([A-Za-z_$][\w$]*)\.map\(\([^)]*\)\s*=>\s*\(?\s*(?:\/\/[^\n]*\n\s*)?<img\s+[\s\S]{0,200}?className="pv-hero-img"/) || [])[1];
    if (!radioArr) bad.push('no radio is rendered per photograph — nothing can select a hero');
    if (!labelArr) bad.push('the strip renders no label — a photograph cannot be tapped');
    if (!heroArr)  bad.push('the hero renders no .pv-hero-img stack — there is nothing to displace');
    if (radioArr && labelArr && radioArr !== labelArr) {
      bad.push(`radios map ${radioArr} and labels map ${labelArr} — two collections cannot guarantee one label per radio`);
    }
    if (radioArr && heroArr && radioArr !== heroArr) {
      bad.push(`radios map ${radioArr} and the hero stack maps ${heroArr} — the index would address a different photograph`);
    }
    // 3 · THE ID AND THE `htmlFor` ARE THE SAME EXPRESSION. A label pointing at
    //     an id that is never minted is a control wired to nothing, and it looks
    //     identical in a screenshot.
    if (!/id=\{`pv-h\$\{i\}`\}/.test(markup))      bad.push('the radios do not mint id="pv-h<i>" — the generated rules address nothing');
    if (!/htmlFor=\{`pv-h\$\{i\}`\}/.test(markup)) bad.push('the labels do not point at pv-h<i>');
    if (!/data-i=\{i\}/.test(markup))              bad.push('the hero stack carries no data-i — the index rules cannot reach a layer');
    // 4 · THE COUNT THE RULES ARE BUILT FROM IS THE COUNT THAT IS RENDERED.
    //     `heroSelectRules(k)` emits rules for indices 0..k-1; if k were derived
    //     from anything but the same array's length, the last photographs would
    //     be unselectable and nothing on the page would look wrong.
    if (radioArr && !new RegExp('heroCount=\\{' + radioArr + '\\.length\\}').test(markup)) {
      bad.push(`the stylesheet's index-rule count is not ${radioArr}.length — some photographs would be unselectable`);
    }

    // 5 · THE RULED REFUSAL OF CLIENT JS, UNCHANGED. This is the clause that
    //     protects the ruling: a later seat reaching for a viewer reaches for
    //     'use client', and the whole mechanism above exists to avoid it.
    if (/'use client'/.test(code))               bad.push('the public route became a client component — the ruled refusal is reversed');
    if (/onClick|useState|useEffect/.test(code)) bad.push('client-side interactivity reached the public route');
    // Surviving _blank links (Enquire, the colophon address) still carry noopener.
    const targets = (markup.match(/target="_blank"/g) || []).length;
    const noopener = (markup.match(/rel="noopener[^"]*"/g) || []).length;
    if (targets > noopener) bad.push(`${targets} _blank links, only ${noopener} with rel=noopener`);

    bad.length === 0
      ? P('C39 every photograph displaces the hero, and no JavaScript ships',
          `no anchor wraps an image; radios, labels and hero layers all map ${radioArr}; ${targets} _blank links all noopener; no client runtime`)
      : F('C39 every photograph displaces the hero, and no JavaScript ships', bad.join('; '));
  }
}

// ── C40 · NO `font:` SHORTHAND CARRIES A CSS-WIDE KEYWORD (F-19.43) ─────────
// The three-sitting bug, refused permanently. `font:400 9px/1.4 inherit` reads
// as "keep the family, set the rest" and is a PARSE ERROR: a CSS-wide keyword is
// legal only as the entire value of a shorthand, so the browser discarded the
// whole declaration and four elements silently inherited 14px/400 from `.pv`.
// Three sittings tuned a size that never applied, and the founder's page shifted
// sideways by 134px because a 9px credit line was rendering at 14px `nowrap`.
//
// ⚠ BOTH PUBLIC ROUTES (CE-39 ruling 4). `/r/` carries its own inline
// stylesheet, written by the same hand under the same instinct, and C38 already
// reads that file — a cell that guarded one of two identical surfaces would be
// waiting to be surprised by the other.
{
  const SITES = ['app/v/[code]/page.tsx', 'app/r/[code]/route.ts'];
  const bad = [];
  let scanned = 0;
  for (const rel of SITES) {
    let src = null;
    try { src = readFileSync(join(ROOT, rel), 'utf8'); } catch { bad.push(`${rel} not found`); continue; }
    scanned++;
    // Comments are stripped first: this file's own prose quotes the broken
    // declaration to explain it, and a cell that read its own documentation as
    // a defect would be unfixable. Comment-blindness law.
    const code = strip(src);
    for (const m of code.matchAll(/font:\s*([^;}\n]*)/g)) {
      const kw = m[1].match(/\b(inherit|initial|unset|revert|revert-layer)\b/);
      if (kw) bad.push(`${rel} — "font:${m[1].trim()}" carries ${kw[1]}; the whole declaration is dropped`);
    }
  }
  // The generated rules are scanned too, because they are part of the sheet that
  // ships and are not in any file this loop opened.
  for (const m of heroSelectRules(3).matchAll(/font:\s*([^;}\n]*)/g)) {
    if (/\b(inherit|initial|unset|revert|revert-layer)\b/.test(m[1])) bad.push(`heroSelectRules — "font:${m[1].trim()}"`);
  }
  if (scanned < SITES.length) bad.push(`only ${scanned} of ${SITES.length} public routes were read`);
  bad.length === 0
    ? P('C40 no font shorthand on a public route carries a CSS-wide keyword', `${scanned} public routes scanned, plus the generated rules`)
    : F('C40 no font shorthand on a public route carries a CSS-wide keyword', bad.join('; '));
}

// ═══════════════════════════════════════════════════════════════════════════
// THE FIXTURE RENDER — C41, C42
// ═══════════════════════════════════════════════════════════════════════════
// Every cell above this line reads source. D-38.1 is the standing objection to
// stopping there: *a rule present in a stylesheet is not a rule that applies.*
// F-19.43 is that objection's most expensive proof — thirty-nine source cells
// were green over a page whose colophon was rendering at 14px, because nothing
// in this estate had ever asked a browser what a declaration COMPUTED to.
//
// `pv_render.cjs` is where computed values normally live, and it needs a
// deployment. This container's egress refuses the deployment (host_not_allowed),
// so those cells cannot run at all this sitting. CE-39 ruled the substitute, and
// the reason it works is that **this defect needs no network**: the disease is
// in the cascade, the fixture is the page's own stylesheet, and no photograph
// has to load for a font size to compute or for a label to check a radio.
//
// ⚠ IT IS A FIXTURE, NOT THE DEPLOY, AND IT IS NAMED THAT WAY EVERYWHERE.
// It proves what the CSS does. It proves nothing about images, arrival, the
// service worker, or what the founder's glass shows — F-19.37 stands, and those
// remain the founder's card and `pv_render`'s job for the day egress opens.
{
  const REAL = 'app/v/[code]/page.tsx';
  let pv = null;
  try { pv = readFileSync(join(ROOT, REAL), 'utf8'); } catch { /* reported below */ }

  if (!pv) {
    F('C41 the colophon computes 9px and the page does not scroll sideways', `${REAL} not found`);
    F('C42 tapping a thumbnail displaces the hero photograph', `${REAL} not found`);
  } else {
    let chromium = null, puppeteer = null;
    try {
      chromium = (await import('@sparticuz/chromium')).default;
      puppeteer = (await import('puppeteer-core')).default;
    } catch (e) {
      const why = 'no browser in this environment (' + String(e && e.message || e).slice(0, 90) + ')';
      I('C41 the colophon computes 9px and the page does not scroll sideways', why);
      I('C42 tapping a thumbnail displaces the hero photograph', why);
    }

    if (chromium && puppeteer) {
      // The page's OWN stylesheet, verbatim, plus the real generated rules for
      // the fixture's photograph count. Nothing is retyped: a transcription of
      // the CSS would be a second copy that agrees with itself.
      const sheetLit = pv.slice(pv.indexOf('<style>{`') + 9, pv.indexOf('`}</style>'));
      const N = 3;
      const css = sheetLit.replace(/\$\{heroSelectRules\(heroCount\)\}/, heroSelectRules(N));
      // The real colophon byte, read from the file rather than remembered — the
      // overflow is a property of THIS string's length and a shorter stand-in
      // would have measured a page that does not exist.
      const lead = (pv.match(/colophonLead:\s*'([^']*)'/) || [, ''])[1].replace(/\\u00b7/g, '\u00b7');

      const thumbs = Array.from({ length: N }, (_, i) =>
        `<label for="pv-h${i}"><img data-t="${i}" alt=""></label>`).join('');
      const layers = Array.from({ length: N }, (_, i) =>
        `<img class="pv-hero-img" data-i="${i}" alt="" aria-hidden="true">`).join('');
      const radios = Array.from({ length: N }, (_, i) =>
        `<input type="radio" name="pv-hero" id="pv-h${i}" class="pv-radio"${i === 0 ? ' checked' : ''} aria-label="Show photograph ${i + 1}">`).join('');

      const html = `<!doctype html><html><head><meta charset="utf-8">
<style>html,body{margin:0}</style><style>${css}</style></head><body>
<main class="pv pv-card">
<header class="pv-top"><span class="pv-top-name">Dev Roy Photography</span></header>
${radios}
<div class="pv-hero"><div class="pv-shimmer"></div>${layers}<div class="pv-scrim"></div>
  <div class="pv-identity"><h1>Dev Roy Photography</h1></div></div>
<div class="pv-body"><p class="pv-line">Takes enquiries through The Dream Wedding.</p>
  <a class="pv-cta" href="#">Enquire on WhatsApp</a>
  <p class="pv-demo">This is a demonstration page, built from work published publicly.</p></div>
<div class="pv-rule"><span class="pv-rule-line"></span><span class="pv-diamond">\u25c6</span><span class="pv-rule-line"></span></div>
<div class="pv-strip">${thumbs}</div>
<footer class="pv-close"><span class="pv-close-mark">Dev Roy Photography</span>
  <span class="pv-colophon">${lead} <a class="pv-colophon-link" href="#">thedreamwedding.in</a></span>
</footer></main></body></html>`;

      let browser = null;
      try {
        browser = await puppeteer.launch({
          args: chromium.args,
          executablePath: await chromium.executablePath(),
          headless: true,
          protocolTimeout: 60000,
        });

        // ── C41 · TWO VIEWPORTS, AND 320 IS THE ONE THAT MATTERS ────────────
        // CE-39 ruling 1 names both. 374 is the founder's own walk width, so a
        // number here and a capture he takes describe the same screen. 320 is
        // the narrowest phone still in the wild, and it is where the 9px line
        // STILL overflowed while `nowrap` stood — the reason `nowrap` was
        // struck rather than merely resized. A single-viewport cell would have
        // gone green over a page that shifts on an SE.
        const bad41 = [];
        const seen = [];
        for (const width of [320, 374]) {
          const page = await browser.newPage();
          await page.setViewport({ width, height: 900, deviceScaleFactor: 2 });
          await page.setContent(html, { waitUntil: 'load' });
          const m = await page.evaluate(() => {
            const col = document.querySelector('.pv-colophon');
            const cta = document.querySelector('.pv-cta');
            const demo = document.querySelector('.pv-demo');
            return {
              colophon: col ? getComputedStyle(col).fontSize : null,
              cta: cta ? getComputedStyle(cta).fontSize : null,
              ctaWeight: cta ? getComputedStyle(cta).fontWeight : null,
              demo: demo ? getComputedStyle(demo).fontSize : null,
              scrollWidth: document.documentElement.scrollWidth,
              innerWidth: window.innerWidth,
            };
          });
          await page.close();
          seen.push(`${width}: colophon ${m.colophon}, doc ${m.scrollWidth}/${m.innerWidth}`);
          if (m.colophon !== '9px') bad41.push(`at ${width} the colophon computes ${m.colophon}, not 9px`);
          // The CTA is the decisive witness of the shorthand class: it declared
          // weight 500 and computed 400 while `inherit` stood. Asserted here so
          // a partial revert of the longhands cannot pass on the colophon alone.
          if (m.cta !== '12px' || m.ctaWeight !== '500') bad41.push(`at ${width} the CTA computes ${m.cta}/${m.ctaWeight}, not 12px/500`);
          if (m.demo !== '11px') bad41.push(`at ${width} the demo note computes ${m.demo}, not 11px`);
          if (m.scrollWidth > m.innerWidth) bad41.push(`at ${width} the page scrolls sideways (${m.scrollWidth} > ${m.innerWidth})`);
        }
        bad41.length === 0
          ? P('C41 the colophon computes 9px and the page does not scroll sideways', `FIXTURE-RENDER \u00b7 ${seen.join(' \u00b7 ')}`)
          : F('C41 the colophon computes 9px and the page does not scroll sideways', 'FIXTURE-RENDER \u00b7 ' + bad41.join('; '));

        // ── C42 · THE PROVABLE EQUIVALENT OF THE FOUNDER'S TAP (CE-115) ──────
        // `pv_render`'s R-b is the real witness and it is REFUSED this sitting.
        // This is the deterministic equivalent: a real browser, a real click on
        // the second thumbnail's label, and the observation taken AT THE
        // DEFECT'S MOMENT — which layer is visible afterwards, and whether the
        // location moved. It cannot see a photograph (no network) so it asserts
        // opacity and identity, never pixels.
        const bad42 = [];
        const page = await browser.newPage();
        await page.setViewport({ width: 374, height: 900, deviceScaleFactor: 2 });
        await page.setContent(html, { waitUntil: 'load' });
        // ⚠ THE CROSSFADE IS 1200ms AND `both`-FILLED, SO A READ AT t=0 SEES
        // OPACITY 0 ON EVERY LAYER — INCLUDING THE ONE THAT IS WINNING. The
        // first cut of this cell sampled immediately and reported all three
        // hidden, which was true and meant nothing: it observed the animation's
        // backwards fill, not the selection. D-38.1 says observe at the defect's
        // moment, and the moment a couple would call the hero "changed" is after
        // the fade lands. `settle` is that wait, one frame longer than the
        // animation, derived from PV_HERO_FADE rather than typed twice.
        const FADE_MS = Number((PV_HERO_FADE.match(/(\d+)ms/) || [, 1200])[1]);
        const settle = () => page.evaluate((ms) => new Promise((r) => setTimeout(r, ms)), FADE_MS + 200);

        await settle();
        const before = await page.evaluate(() => ({
          shown: [...document.querySelectorAll('.pv-hero-img')].map((el) => getComputedStyle(el).opacity),
          href: location.href,
          history: history.length,
        }));
        if (before.shown[0] !== '1') bad42.push(`the first photograph is not shown on arrival (opacity ${before.shown[0]})`);
        if (before.shown.slice(1).some((o) => o !== '0')) bad42.push(`more than one hero layer is visible on arrival (${before.shown.join(',')})`);

        await page.click('label[for="pv-h1"]');
        await settle();
        const after = await page.evaluate(() => ({
          shown: [...document.querySelectorAll('.pv-hero-img')].map((el) => getComputedStyle(el).opacity),
          checked: [...document.querySelectorAll('.pv-radio')].findIndex((r) => r.checked),
          ring: getComputedStyle(document.querySelector('label[for="pv-h1"]')).outlineWidth,
          href: location.href,
          history: history.length,
        }));
        if (after.checked !== 1) bad42.push(`tapping thumbnail 2 selected radio ${after.checked}`);
        if (after.shown[1] !== '1') bad42.push(`the second photograph did not become visible (opacity ${after.shown[1]})`);
        if (after.shown[0] !== '0') bad42.push('the first photograph is still visible — the hero stacked instead of displacing');
        if (after.ring === '0px') bad42.push('the selected thumbnail carries no ring — the strip does not say which photograph is showing');
        // The whole objection to a `:target` lightbox was the URL and the back
        // button. Asserted, not assumed.
        if (after.href !== before.href) bad42.push('the URL changed — the back button now unwinds a gallery');
        if (after.history !== before.history) bad42.push('a history entry was pushed');

        // And back again — F-19.p2's arm (a) exists so the hero is RETURNABLE.
        await page.click('label[for="pv-h0"]');
        await settle();
        const back = await page.evaluate(() => [...document.querySelectorAll('.pv-hero-img')].map((el) => getComputedStyle(el).opacity));
        if (back[0] !== '1') bad42.push('tapping thumbnail 1 did not bring the hero photograph back');
        await page.close();

        bad42.length === 0
          ? P('C42 tapping a thumbnail displaces the hero photograph', 'FIXTURE-RENDER \u00b7 layer 2 shown, layer 1 hidden, ring on the selected thumb, URL and history unchanged, hero returnable')
          : F('C42 tapping a thumbnail displaces the hero photograph', 'FIXTURE-RENDER \u00b7 ' + bad42.join('; '));
      } catch (e) {
        const why = 'the fixture browser could not run: ' + String(e && e.message || e).slice(0, 120);
        I('C41 the colophon computes 9px and the page does not scroll sideways', why);
        I('C42 tapping a thumbnail displaces the hero photograph', why);
      } finally {
        if (browser) await browser.close().catch(() => {});
      }
    }
  }
}

console.log('');
console.log(`${pass} PASS \u00b7 ${fail} FAIL \u00b7 ${inco} INCO`);
process.exit(fail === 0 ? 0 : 1);
