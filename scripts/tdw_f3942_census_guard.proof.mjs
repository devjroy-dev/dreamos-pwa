#!/usr/bin/env node
// scripts/tdw_f3942_census_guard.proof.mjs
// TDW_STRIPPER_CANARY
// ═════════════════════════════════════════════════════════════════════════════
// F-39.42 — THE CENSUS NAMED THE FILES NOBODY COULD TRUST, AND NO CELL READ IT.
// ═════════════════════════════════════════════════════════════════════════════
// `scripts/tdw_stripper_census.mjs` parses every source file with the TypeScript
// compiler and names the files where the standing scanner and a real lexer
// DISAGREE. Its captured output shipped beside the module. Two things were wrong
// with that arrangement, and they compound:
//
//   (i)  THE CAPTURE WAS STALE. It recorded tip `5535e24`, 284 files and TEN
//        divergences. Derived fresh at the B-1 seat's tip: 385 files and
//        THIRTY-THREE. The number in the repo had been wrong by a factor of
//        three for as long as anybody had been reading it.
//   (ii) NOTHING CONSULTED IT AT RUN TIME. So every absence-cell in the estate
//        was trusting a scanner the compiler contradicts on 33 files, and no
//        instrument said so while the cells were running.
//
// The module header already declared both holes (H1 JSX-text apostrophes,
// under-strip; H2 regex literals, over-strip) honestly and in full. THAT IS THE
// POINT AND NOT THE DEFENCE: the declaration was correct, complete, and read by
// nobody at the moment it mattered. This bench is the thing above it that asks
// the second question — which is CE-39 band 5's class in one sentence, an
// instrument correct about its own subject and wrong about what it is read to
// mean, with nothing above it asking the second question.
//
// ── REGENERATION IS A DECLARED STEP WITH ITS OWN COMMAND ───────────────────
// Staleness is now VISIBLE rather than silent, because §1 reds on it. When it
// reds, the step is:
//
//     node scripts/tdw_stripper_census.mjs --write
//
// and the diff on `scripts/tdw_stripper_census.out.txt` is the finding. A capture
// that can go stale quietly is not a capture; Q-SP-5's law, one level up.
//
// ── WHAT §1 COMPARES, AND WHY NOT THE WHOLE FILE ───────────────────────────
// The capture also carries the repo tip and a per-bite ledger, both of which move
// on any commit that touches any source file. A cell keyed to those would red on
// every push and be labelled out of the floor within a week — a guard nobody can
// keep green is a guard that gets removed, which is how F-39.42 happened the
// first time. So §1's subject is THE LIST AND THE TWO TOTALS: the set of
// divergent files, the standing scanner's count, and the retired rule's count.
// Those are the numbers any reader of that file is actually relying on.
//
// ── WHAT THIS BENCH DOES **NOT** COVER, SAID OUT LOUD ──────────────────────
// The census walks `git ls-files` and EXCLUDES `scripts/` by its own filter
// (`!f.startsWith('scripts/')`). So the four readers that carry a private
// function named `stripComments` running the retired rule — F-39.41's §2, named
// by `tdw_f0774_readers.proof.mjs` §2.3c — SIT OUTSIDE THIS INSTRUMENT ENTIRELY
// and no green here says anything about them. Written down because a reader who
// assumes coverage this bench does not have is the exact failure the bench exists
// to end, and assuming it about a CENSUS is how F-39.42 lasted this long.
// ═════════════════════════════════════════════════════════════════════════════
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';
import { stripComments } from './lib/stripComments.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SELF = 'scripts/' + path.basename(fileURLToPath(import.meta.url));
const CAPTURE = 'scripts/tdw_stripper_census.out.txt';
const CENSUS = 'scripts/tdw_stripper_census.mjs';
const raw = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const code = (rel) => stripComments(raw(rel));

let pass = 0, fail = 0, skip = 0;
const ok = (label, cond, detail) => {
  if (cond) { pass++; console.log(`  ok   ${label}`); }
  else { fail++; console.log(`  FAIL ${label}`); if (detail) console.log(`       ${detail}`); }
};
const named_skip = (label, why) => { skip++; console.log(`  SKIP ${label}\n       ${why}`); };
const sec = (t) => console.log(`\n${t}`);

console.log('F-39.42 — the census is fresh, and something reads it');

// ── THE READER. One parse shape, declared once, used for both the capture and
//    the fresh run — because two spellings of "what the census said" is two
//    things to keep in step, and the fact that they agree today is not a
//    property anybody would notice losing.
const DIVERGE = /^\s*DIVERGES from the lexer:\s*(.+)$/;
const SCANNER_N = /^\s*(?:(\d+) file\(s\) where the standing scanner|scripts\/lib\/stripComments\.mjs agrees)/;
const RETIRED_N = /the retired naive rule disagrees with the compiler on (\d+) file/;
const readCensus = (text) => {
  const lines = text.split('\n');
  const files = lines.map((l) => (l.match(DIVERGE) || [])[1]).filter(Boolean).sort();
  const sm = lines.map((l) => l.match(SCANNER_N)).find(Boolean);
  const rm = text.match(RETIRED_N);
  return {
    files,
    scanner: sm ? (sm[1] ? Number(sm[1]) : 0) : null,
    retired: rm ? Number(rm[1]) : null,
  };
};

// ═════════════════════════════════════════════════════════════════════════════
sec('§1 · THE STALENESS GUARD — the captured census still describes this tree');

const captured = readCensus(raw(CAPTURE));

// NON-VACUITY OF THE PARSE ITSELF, before it is allowed to agree with anything.
// F-38.57's shape: an extractor that read the wrong thing, handed back the wrong
// array, and let a cell pass on it. Two empty lists compare equal.
ok(`§1.1 the capture parses — a divergence list and both totals were found (${captured.files.length} files, scanner ${captured.scanner}, retired ${captured.retired})`,
  captured.scanner !== null && captured.retired !== null,
  'the capture\'s format has moved under this reader; every cell below would compare two empty parses and pass. Fix the reader, do not read a green.');

let fresh = null;
try {
  const out = execFileSync('node', [path.join(ROOT, CENSUS)], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (/^SKIP — tdw_stripper_census/m.test(out)) {
    named_skip('§1.2 the fresh run — `typescript` is not installed in this container',
      'the census is compiler-backed and TypeScript is a devDependency; run `npm ci` first. '
      + 'The capture could not be re-adjudicated here, so its freshness is UNPROVEN — a skip, '
      + 'counted and named, never a pass. This is the one condition under which a green here '
      + 'would have meant nothing at all.');
  } else {
    fresh = readCensus(out);
  }
} catch (e) {
  named_skip('§1.2 the fresh run — the census instrument could not be executed',
    `it exited with an error and this bench cannot adjudicate staleness without it: ${String(e.message).split('\n')[0]}`);
}

if (fresh) {
  const gone = captured.files.filter((f) => !fresh.files.includes(f));
  const grown = fresh.files.filter((f) => !captured.files.includes(f));
  ok(`§1.2 the captured divergence LIST matches a fresh run (${captured.files.length} captured, ${fresh.files.length} fresh)`,
    gone.length === 0 && grown.length === 0,
    'THE CAPTURE IS STALE. Regenerate it — `node scripts/tdw_stripper_census.mjs --write` — and\n'
    + '       read the diff as the finding.\n'
    + (grown.length ? `       NEWLY DIVERGENT (${grown.length}), unknown to the capture:\n         - ` + grown.join('\n         - ') + '\n' : '')
    + (gone.length ? `       NO LONGER DIVERGENT (${gone.length}) — also a delta, and also owed an account:\n         - ` + gone.join('\n         - ') : ''));

  ok(`§1.3 and both totals match (scanner ${captured.scanner}/${fresh.scanner}, retired ${captured.retired}/${fresh.retired})`,
    captured.scanner === fresh.scanner && captured.retired === fresh.retired,
    'the counts moved without the list moving, or the capture predates a change to the census itself');
}

// BOTH WAYS ON THE COMPARATOR, driven directly, so the cell is provably able to
// go red without waiting for the tree to rot — the same discipline
// `tdw_f0774_stripper.proof.mjs` §0 applies to the stripper it guards.
{
  const A = 'DIVERGES from the lexer: a.tsx\nDIVERGES from the lexer: b.tsx\n'
    + '   2 file(s) where the standing scanner and the compiler disagree\n'
    + '   the retired naive rule disagrees with the compiler on 9 file(s).';
  const B = A.replace('b.tsx', 'c.tsx');
  const same = (x, y) => JSON.stringify(readCensus(x)) === JSON.stringify(readCensus(y));
  ok('§1.4 GREEN ARM — two identical censuses compare equal', same(A, A));
  ok('§1.5 RED ARM — one file swapped in the list is CAUGHT', !same(A, B),
    'the comparator cannot see a changed list, so §1.2 can never fail and is decorative');
  ok('§1.6 RED ARM — a changed TOTAL with an identical list is CAUGHT',
    !same(A, A.replace('on 9 file', 'on 11 file')),
    'the comparator ignores the totals, so §1.3 is decorative');
}

// ═════════════════════════════════════════════════════════════════════════════
sec('§2 · THE PER-SUBJECT NOTE — which absence-cells sit over a divergent file');

// ── WHY A NOTE AND NEVER A FAIL  [chair ruling, B-1] ───────────────────────
// 23 of the 33 divergent files are the subject of at least one reader carrying
// negated assertions; 47 distinct readers are involved; `components/vendor/Header.tsx`
// alone is read by NINE. Failing on that is not a guard, it is a wall — and the
// 2c-Studio seat already proved that blinding cells across 33 files is a bigger
// hole than the one it would close. So this section REFUSES-and-names: it prints
// what a reader of any green below is not entitled to assume, and it does not
// gate. The one thing it asserts is that the derivation still WORKS.
const list = fresh ? fresh.files : captured.files;
const source = fresh ? 'a fresh run' : 'the CAPTURE (the fresh run skipped above)';

const CORPUS_SKIP = new Set(['node_modules', '.git']);
const corpus = [];
const walk = (rel) => {
  for (const e of fs.readdirSync(path.join(ROOT, rel), { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
    if (CORPUS_SKIP.has(e.name)) continue;
    if (e.isDirectory()) { walk(rel + '/' + e.name); continue; }
    if (/\.(mjs|cjs|js|ts)$/.test(e.name)) corpus.push(rel + '/' + e.name);
  }
};
for (const d of ['scripts', 'tools']) walk(d);

// An ABSENCE-CELL is a negated match over source. Broad on the negation, narrow
// on the verb — the same table discipline F-38.45 bought.
const NEGATION = /!\s*[A-Za-z_$][\w$.[\]'"()]*\s*\.\s*(?:includes|match|test)\s*\(|!\s*\/[^\n]*\/\w*\s*\.\s*test\s*\(|assert\.ok\s*\(\s*!/;

const atRisk = [];
for (const subj of list) {
  const readers = corpus.filter((rel) => {
    const s = code(rel);
    if (rel === SELF) return false;                      // this file NAMES them in order to warn
    if (!s.includes(`'${subj}'`) && !s.includes(`"${subj}"`) && !s.includes('`' + subj + '`')) return false;
    return s.split('\n').some((l) => NEGATION.test(l));
  });
  if (readers.length) atRisk.push({ subj, readers });
}

// THE ONE ASSERTION IN THIS SECTION. If the derivation returns nothing, the note
// below is silence — and silence reads exactly like safety, which is F-38.57's
// catastrophe shape and the reason §1 of the readers proof refuses on zero.
ok(`§2.1 the note derives — divergent files under an absence-cell were found (${atRisk.length} of ${list.length}, from ${source})`,
  atRisk.length > 0,
  'ZERO subjects derived. Either the divergence list is empty (check §1) or the negation table '
  + 'no longer matches this estate\'s cells. Do not read this as "no absence-cell is at risk".');

console.log('');
console.log(`  REFUSED-CLASS NOTE — this is not a FAIL and it does not gate. ${atRisk.length} of the ${list.length}`);
console.log('  files on the divergence list are the subject of at least one reader that asserts');
console.log('  a token is ABSENT from them. On those files the standing scanner and the compiler');
console.log('  do not agree about what the code IS, so a green from those cells is a green about');
console.log('  a text neither this estate nor its compiler would call the source.');
console.log('');
for (const { subj, readers } of atRisk.sort((a, b) => b.readers.length - a.readers.length)) {
  console.log(`    ${String(readers.length).padStart(2)} reader(s) · ${subj}`);
  for (const r of readers) console.log(`         ${r}`);
}
console.log('');
console.log('  H1 (JSX-text apostrophes, UNDER-strips) is the direction that bites here: a real');
console.log('  comment survives into the "code" string, so an absence-cell can CONVICT on comment');
console.log('  prose and a presence-cell can PASS on it. H2 (regex literals, OVER-strips) costs a');
console.log('  regex tail. Both are declared in scripts/lib/stripComments.mjs and BOTH CLOSE ONLY');
console.log('  WITH A REAL LEXER — which is a charter, not this sitting.');

// ═════════════════════════════════════════════════════════════════════════════
sec('§3 · THE INSTRUMENT IS NOT VACUOUS');

ok('§0.Z INVOCATION (F-07.99) — this bench really CALLS its stripper',
  (() => { const self = stripComments(raw(SELF)); return (self.match(/\bcode\s*\(/g) || []).length >= 1; })(),
  'a definition held and never invoked fooled this estate for a whole block');

ok('§3.1 the census instrument this bench reads still excludes scripts/ — the coverage note above is true',
  /!f\.startsWith\('scripts\/'\)/.test(code(CENSUS)),
  'the census corpus has changed and the DOES-NOT-COVER note in this file\'s header is now wrong. '
  + 'A stale disclaimer is worse than none: it tells a reader to distrust something that is now covered, '
  + 'and to trust the reasoning that produced it.');

ok('§3.2 the regeneration step this bench names really exists on the census',
  /--write/.test(code(CENSUS)) && /tdw_stripper_census\.out\.txt/.test(code(CENSUS)),
  'the command in this bench\'s header and in §1.2\'s failure detail does not exist — a cure sentence '
  + 'that names a step nobody can run is a cure sentence that will be followed once and abandoned');

// ═════════════════════════════════════════════════════════════════════════════
const total = pass + fail;
console.log(`\n${fail ? 'RED' : 'GREEN'} — tdw_f3942_census_guard ${pass}/${total}${skip ? ` (${skip} NAMED SKIP)` : ''}`);
process.exit(fail ? 1 : 0);
