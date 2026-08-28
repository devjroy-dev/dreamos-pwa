#!/usr/bin/env node
// scripts/tdw_f0774_readers.proof.mjs
// TDW_STRIPPER_CANARY
// ═════════════════════════════════════════════════════════════════════════════
// READERS STRIP BEFORE THEY PARSE.
//
//   A reader whose subject is CODE strips before it parses.
//   A reader whose subject is PROSE is declared.
//
// ── WHY THIS BENCH EXISTS, IN THE WORDS OF THE FINDING THAT ASKED FOR IT ────
// F-38.60 §6: 「neither has a general guard: nothing asserts that a reader of a
// prose-carrying source file strips before it parses. That would be the cell
// worth having.」 Chartered at CE-38 relay #1 (c-4) and built here.
//
// TWO SITTINGS RUNNING, A CURE WAS WRITTEN CAREFULLY AT ONE SITE AND THE CLASS
// WALKED TO THE NEXT FILE. F-38.59 was the FAB offset — `SliceShell` derived the
// tree-aware pair and wrote the arithmetic at its own site while three other
// bodies kept a bare 82. F-38.60 was the quote pairing — `b40` C5 abandoned a
// pair matcher on a 151-apostrophe file and wrote down why, and `wl_audit` kept
// the same matcher over the same registry and convicted a correct tree. In both
// cases the reasoning was excellent and local, and nothing carried it.
//
// A CLASS WITH NO INSTRUMENT IS A CLASS THAT GETS CURED WHERE SOMEBODY HAPPENED
// TO BE LOOKING. This is the instrument.
//
// ── ⚠ IT IS RED AT BIRTH, ON PURPOSE, AND THAT IS THE RULING ───────────────
// CE-38 relay #2 ruled arm (a) against two alternatives this seat priced:
//
//   (b) land it green over a declared SUBSET of readers, the rest chartered
//   (c) do not land it; make §3-4 its own kickoff
//
// Both were refused on the seat's own grounds. A declared-subset green is a
// bench made to pass wearing a charter as a fig leaf; deferral leaves the class
// unguarded for however many sittings the design charter waits. The chair's
// words: 「the whole point of the class was that no instrument could see it, and
// the first thing an honest instrument does on a diseased corpus is red.」
//
// SO: eighteen files are named by §2 below and the bench exits 1. It joins the
// floor's NAMED BASE by labelled amendment — as DEBT WITH A NAME, not as noise —
// and it goes green the day the cure sitting lands, at which point the label
// comes out of `run-floor.sh` and the bench starts guarding rather than
// reporting. THE FLOOR GAINS EXACTLY ONE RED LINE, this bench's; the eighteen
// are its findings, not eighteen floor entries.
//
// ── THE EXEMPTION UNIT IS THE READ SITE, NOT THE FILE (c-38.35) ────────────
// Ruled at relay #2. A file-level exemption over a file that strips in one cell
// and deliberately reads RAW in another would exempt the code-subject read
// alongside the prose-subject one — the homonym-census disease at one remove,
// which this estate has already filed twice (c-38.7, and the `resolveVendor`
// mention-count). Entries are `file · site · why the prose is the subject`.
//
// ── MATCHERS COME FROM DECLARED SHAPE TABLES, NEVER INLINE (F-38.45) ───────
// Fifth firing of the matcher family bought that law. Every classification
// below reads a table declared at the top of its section, so widening one is an
// edit in one place with a reason beside it, and a reader can see what the
// bench believes without reverse-engineering a regex.
// ═════════════════════════════════════════════════════════════════════════════
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { stripComments } from './lib/stripComments.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SELF = 'scripts/' + path.basename(fileURLToPath(import.meta.url));
const raw = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const code = (rel) => stripComments(raw(rel));

let pass = 0, fail = 0;
const ok = (label, cond, detail) => {
  if (cond) { pass++; console.log(`  ok   ${label}`); }
  else { fail++; console.log(`  FAIL ${label}`); if (detail) console.log(`       ${detail}`); }
};
const sec = (t) => console.log(`\n${t}`);

console.log('F-07.74 / F-38.60 — readers strip before they parse');

// ═════════════════════════════════════════════════════════════════════════════
// THE CORPUS. `scripts/` and `tools/` — the estate's instruments. Both, because
// F-38.60's own defect was in `tools/`, and a corpus that omitted it would have
// been blind to the finding that chartered this bench.
//
// ── F-38.p5 · THE CORPUS WAS FLAT AND `scripts/lib/` WAS INVISIBLE TO IT ────
// The first cut of this bench read each directory NON-RECURSIVELY, so
// `scripts/lib/` — which holds the estate's one stripper, `mutateCopy`, and
// whatever a seat adds beside them — was outside the corpus entirely. **The
// bench that exists to find blind readers had a blind spot of its own**, and it
// was found by deriving a rebase rather than by any cell: P2-A landed
// `scripts/lib/aliasHook.cjs` at `a8def9c` and this instrument could not see the
// file arrive.
//
// A CORPUS THAT CANNOT SEE A DIRECTORY IS THE SAME DISEASE ONE LEVEL UP from the
// class this bench guards, and the estate has now filed the hand-written-
// enumeration shape four times in `run-floor.sh`'s own header. Cured by
// DERIVATION rather than by adding `scripts/lib` to a list: the walk is
// recursive, so a directory a seat creates tomorrow joins by existing.
//
// `node_modules` is excluded by name — it is not the estate's instrument code and
// walking it would take the corpus from ninety-seven files to tens of thousands.
const CORPUS_DIRS = ['scripts', 'tools'];
const CORPUS_EXT = /\.(mjs|cjs|js|ts)$/;
const CORPUS_SKIP = new Set(['node_modules', '.git']);
const corpus = [];
const walkCorpus = (rel) => {
  for (const e of fs.readdirSync(path.join(ROOT, rel), { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : 1)) {
    if (CORPUS_SKIP.has(e.name)) continue;
    if (e.isDirectory()) { walkCorpus(rel + '/' + e.name); continue; }
    if (CORPUS_EXT.test(e.name)) corpus.push(rel + '/' + e.name);
  }
};
for (const d of CORPUS_DIRS) walkCorpus(d);

// ── SHAPE TABLE 1 · WHAT MAKES A FILE A READER ────────────────────────────
// It READS source and then MATCHES against what it read. Either half alone is
// not a reader: a file that reads and writes is a generator, and a file that
// matches over a string it built itself has no source subject.
const READ_SHAPES = [
  ['readFileSync', (s) => /readFileSync\s*\(/.test(s)],
  ['read-helper',  (s) => /\bconst\s+(read|raw|R)\s*=/.test(s)],
];
const PARSE_SHAPES = [
  ['.match(',    (s) => /\.match\s*\(/.test(s)],
  ['.matchAll(', (s) => /\.matchAll\s*\(/.test(s)],
  ['.includes(', (s) => /\.includes\s*\(/.test(s)],
  ['.test(',     (s) => /\.test\s*\(/.test(s)],
];

// ── SHAPE TABLE 2 · WHAT COUNTS AS STRIPPING ──────────────────────────────
// The estate's one home is `scripts/lib/stripComments.mjs` (F-07.74). It is NOT
// the only thing this table accepts, and that is deliberate and ruled (c-4):
// this bench's subject is 「does the reader strip AT ALL before it parses」. The
// separate question 「does it use the one home」 belongs to
// `tdw_f0774_stripper.proof.mjs` §6.3, which is RED at base on this branch and
// is named here rather than adopted. Two benches, two questions, neither
// swallowing the other.
const STRIP_SHAPES = [
  ['one-home',      (s) => /stripComments/.test(s)],
  ['out-of-process',(s) => /stripComments\.mjs/.test(s)],
  ['block-replace', (s) => /replace\(\s*\/\\\/\\\*/.test(s)],
  ['named-blanker', (s) => /\b(blankComments|CODE_OF|codeOf)\b/.test(s)],
  ['line-replace',  (s) => /replace\(\s*\/(\(\^\|\[\^:'"\\\\\]\)|\^\[ \\t\]\*|\\\/\\\/)/.test(s)],
  // ── ADDED BY LABEL AT THE `a33d70d` RE-DERIVATION. THE LINE-FILTER FORM. ──
  // `tdw09_frost_parity` and `tdw15_p2_envelopes` both strip by splitting on
  // newlines and dropping lines whose trimmed head is `//`, `*` or `/*` — a real
  // strip this table could not see, so both were named as offenders on the first
  // run at this tip. THAT WAS THE TABLE BEING WRONG, NOT THE TREE.
  //
  // WIDENED WITH THE REASON, NOT LOOSENED TO MAKE A NUMBER FALL — the distinction
  // `modeBridge` §2.1 already had to make once. And `tdw15_p2_envelopes` carries
  // the strongest form of the case at its own site: it uses this form DELIBERATELY
  // rather than the one home, because the shared stripper leaks on `expenses.tsx`
  // and reads 25 controls where the sealed instrument reads 24. A reasoned
  // deviation, written down. Convicting it would have been this bench punishing a
  // seat for being more careful than the estate's default.
  ['line-filter',   (s) => /startsWith\('\/\/'\)/.test(s) && /\.split\(\s*'\\n'\s*\)/.test(s)],
  ['jsx-comment',   (s) => /replace\(\s*\/\\\{\\s\*\\\/\\\*/.test(s)],
];

// ── SHAPE TABLE 3 · WHAT MAKES A SUBJECT CODE ─────────────────────────────
// A reader whose only subjects are JSON, markdown, text or its own captured
// output is not this bench's business: JSON has no comments to be fooled by,
// and prose is prose. CODE means a source extension the estate's comment
// conventions apply to.
const CODE_SUBJECT = /['"`][^'"`]*\.(tsx|ts|jsx|js|mjs|cjs|css)['"`]/;

// ── F-38.p6 · THE BENCH CLASSIFIED READERS FROM RAW SOURCE, AND ITS OWN LAW ──
// ── CONVICTED IT. Found by probe, not by reading: a forged offender planted in
// `scripts/lib/mutateCopy.mjs` was NOT caught, and the reason is that the file
// mentions `stripComments` in a COMMENT — 「the way `stripComments` already is」 —
// which satisfied the one-home strip shape. **The bench that exists to catch
// readers fooled by comments was being fooled by a comment.**
//
// It is the exact disease at one level up, in the instrument written to guard
// against it, and it would have shipped green on that file forever: a reader that
// documents the stripper without calling it reads as compliant. F-07.99's shape
// (a definition held and never invoked) wearing F-07.74's clothes.
//
// SO CLASSIFICATION READS `code(rel)`, NOT `raw(rel)`. All four tables now judge
// stripped source, which is this bench obeying its own law about itself — the
// only version of self-inclusion that means anything. §1.2 asserts the file is in
// the SET; this is the line that makes the set's verdicts honest.
const readers = [];
for (const rel of corpus) {
  const src = code(rel);
  const reads = READ_SHAPES.filter(([, f]) => f(src)).map(([n]) => n);
  const parses = PARSE_SHAPES.filter(([, f]) => f(src)).map(([n]) => n);
  if (!reads.length || !parses.length) continue;
  const strips = STRIP_SHAPES.filter(([, f]) => f(src)).map(([n]) => n);
  readers.push({ rel, reads, parses, strips, codeSubject: CODE_SUBJECT.test(src) });
}

// ═════════════════════════════════════════════════════════════════════════════
sec('§1 · THE READER SET IS DERIVED, NON-EMPTY, AND INCLUDES THIS FILE');

// ── REFUSES BY NAME RATHER THAN PASSING ON ZERO (F-38.57's catastrophe shape) ──
// F-38.57 was an extractor that read a comment, handed back the wrong array, and
// let a cell pass on it. An empty reader set here would make every cell below
// vacuously green — the loudest possible hollow green, since this bench's whole
// subject is a set. So zero is a refusal with a name on it, never a pass.
if (!readers.length) {
  console.log('  REFUSED — the reader derivation returned ZERO files.');
  console.log('            Every cell below would pass vacuously. The shape tables above');
  console.log('            no longer match this corpus; fix the tables, do not read a green.');
  process.exit(1);
}
ok(`§1.1 the derivation returns a non-empty reader set (${readers.length} readers over ${corpus.length} files)`,
  readers.length > 0);

// ── SELF-INCLUSION. A bench that walks a corpus it is not in is a bench that
//    exempts itself by accident. This file reads source and matches against it,
//    so it is subject to its own law and must appear in its own set.
ok('§1.2 SELF-INCLUSION — this bench is in its own reader set',
  readers.some((r) => r.rel === SELF),
  `${SELF} did not derive as a reader; the tables cannot see the file that declares them`);

ok('§1.3 the corpus reaches tools/, where F-38.60 was found',
  corpus.some((f) => f.startsWith('tools/')) && readers.some((r) => r.rel.startsWith('tools/')),
  'a corpus blind to tools/ would be blind to the finding that chartered this bench');

// ═════════════════════════════════════════════════════════════════════════════
sec('§2 · A READER WHOSE SUBJECT IS CODE STRIPS BEFORE IT PARSES');

// ── THE DECLARED EXEMPTIONS · `INTERIM_HUB_PRIMERS`'s SHAPE ────────────────
// file · site · why the PROSE is the subject. Counted, not explained: an
// exception that is counted cannot grow quietly, whereas one that is merely
// argued for can. Every entry names a SITE, because the unit is the read and
// not the file (c-38.35) — the seed roster arrived file-level at the kickoff and
// was struck for exactly that.
//
// EVERY ENTRY BELOW IS A READER THAT ALREADY STRIPS ELSEWHERE IN THE SAME FILE.
// That is what makes them exemptions rather than offenders: the author reached
// for the stripper where the subject was code and deliberately did not where the
// subject was prose.
const EXEMPT_SITES = [
  { file: 'scripts/tdw09_p2b.proof.mjs', site: 'const raw = R(…) — four HONESTY-byte cells',
    why: 'the subject IS the prose: these cells assert that a disclosure sentence is PRESENT in the file. Stripping would delete the very bytes under test.' },
  { file: 'scripts/tdw07_p4a_ig.proof.mjs', site: 'Mraw / COPY_BLOCK',
    why: 'slices a copy block out of raw source to assert vendor-facing WORDS. The file defines `code()` beside it and uses it for the code-subject cells.' },
  { file: 'tools/wl_audit.mjs', site: 'the withheld-comment assertions',
    why: 'asserts that a withheld byte is COMMENTED OUT — the comment is the subject, and a stripped source cannot answer the question at all.' },
  { file: 'tools/bs_audit.mjs', site: 'the withheld-comment assertions',
    why: 'same shape as wl_audit: withheld doors are proven withheld by their comment. `strip()` is used for the code-subject cells in the same file.' },
  { file: 'scripts/tdw08_p3_landing.proof.mjs', site: 'the withheld-comment assertions',
    why: 'same shape. Declares `code = strip(read(…))` and uses it wherever the subject is code.' },
];

// NON-VACUITY OF THE EXEMPTION SET ITSELF. An exemption naming a file that does
// not exist, or a file that does not strip anywhere, is an exemption laundering
// an offender. Asserted before the set is allowed to excuse anything.
const badExempt = EXEMPT_SITES.filter((e) => {
  if (!fs.existsSync(path.join(ROOT, e.file))) return true;
  const r = readers.find((x) => x.rel === e.file);
  return !r || !r.strips.length;
});
ok(`§2.1 every declared exemption names a live file that DOES strip elsewhere (${EXEMPT_SITES.length} declared)`,
  badExempt.length === 0,
  `exemptions that would launder an offender: ${badExempt.map((e) => e.file).join(', ')}`);

// ── THE CELL. A code-subject reader that strips nowhere at all is an offender,
//    and no site-level exemption can save it: the exemptions above are about a
//    file's PARTICULAR reads, and a file with no strip anywhere has made no
//    distinction to exempt.
const exemptFiles = new Set(EXEMPT_SITES.map((e) => e.file));
const offenders = readers
  .filter((r) => r.codeSubject && !r.strips.length && !exemptFiles.has(r.rel))
  .map((r) => r.rel);

ok(`§2.2 every code-subject reader strips before it parses (${offenders.length} do not)`,
  offenders.length === 0,
  offenders.length
    ? 'THE UN-STRIPPED-READER CLASS, named:\n       - ' + offenders.join('\n       - ')
      + '\n       Each reads .ts/.tsx production source and matches tokens in it while its\n'
      + '       comments quote the very bytes they retired. Cure chartered as its own\n'
      + '       sitting (CE-38 relay #2); tools/wl_render.cjs is flagged FIRST — a gate\n'
      + '       instrument in the diseased set outranks the benches.'
    : undefined);

// ═════════════════════════════════════════════════════════════════════════════
sec('§3 · THE INSTRUMENT IS NOT VACUOUS');

// The stripper this bench holds is genuinely CALLED (F-07.99: a definition with
// no call site fooled this estate for a whole block).
ok('§0.Z INVOCATION (F-07.99) — this bench really CALLS its stripper',
  (() => { const self = stripComments(raw(SELF)); return (self.match(/\bcode\s*\(/g) || []).length >= 1; })());

// THE CELL CAN FAIL AND CAN PASS. A specimen proves both arms without touching
// the tree: a fabricated code-subject reader with no strip must be caught, and
// the same reader with a strip must not be.
const SPEC_BAD = `const s = readFileSync('app/x/page.tsx','utf8'); if (s.match(/Victor/)) {}`;
const SPEC_OK = `const s = stripComments(readFileSync('app/x/page.tsx','utf8')); if (s.match(/Victor/)) {}`;
const classify = (src) => ({
  reader: READ_SHAPES.some(([, f]) => f(src)) && PARSE_SHAPES.some(([, f]) => f(src)),
  strips: STRIP_SHAPES.some(([, f]) => f(src)),
  codeSubject: CODE_SUBJECT.test(src),
});
const bad = classify(SPEC_BAD), good = classify(SPEC_OK);
ok('§3.1 a code-subject reader with no strip is CAUGHT by the tables',
  bad.reader && bad.codeSubject && !bad.strips);
ok('§3.2 the same reader with a strip is NOT caught — the cell is not a blanket ban',
  good.reader && good.codeSubject && good.strips);

// ═════════════════════════════════════════════════════════════════════════════
console.log(`\n${fail ? 'RED' : 'GREEN'} — tdw_f0774_readers ${pass}/${pass + fail}`);
if (offenders.length) {
  console.log(`\nDEBT, NAMED: ${offenders.length} un-stripped code-subject readers. This bench is`);
  console.log('carried in run-floor.sh\'s named base by LABELLED amendment and comes out of it');
  console.log('the day the cure sitting lands. A red with a name is not noise.');
}
process.exit(fail ? 1 : 0);
