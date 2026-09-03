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

// ── SHAPE TABLE 3b · WHAT COUNTS AS STRIPPING *THROUGH THE HOME* [F-39.41] ──
// ═══════════════════════════════════════════════════════════════════════════
// TABLE 2 ABOVE TESTS PRESENCE. THIS ONE TESTS IDENTITY, AND THE REASON IT HAD
// TO BE ADDED IS THAT TABLE 2'S FIRST ROW TESTS A **NAME**.
//
//     ['one-home', (s) => /stripComments/.test(s)]
//
// That row is satisfied by any occurrence of the eleven characters, so §2.2
// passed `b40_worklist_shell_bench.js` — which was stripping with
// `NAIVE_RETIRED`, THE VERY EXPORT THE HOME PUBLISHES IN ORDER TO CONDEMN,
// imported from a path containing the word. F-39.39 was doing live damage there
// and this bench read it as compliant, and `b40` never joined the debt list.
//
// AND IT IS FOUR SITES WIDER THAN b40, which is the part that made this a table
// and not a patch. Four readers in this repo define a PRIVATE FUNCTION NAMED
// `stripComments` whose body is the retired naive rule:
//
//     tdw09_p2_doors.proof.mjs      const stripComments = (s) => s.replace(…)
//     tdw15_p3_moments.proof.mjs    same, + a line pass
//     tdw15_p3_pulse.proof.mjs      same
//     tdw15_p3_daystogo.proof.ts    same, + the F-07.100 GUARDLESS line pass
//
// That is strictly worse than b40's case: b40 at least imported a real mirror,
// while these four SHADOW THE HOME'S OWN NAME WITH THE RULE IT RETIRED. Six more
// stand in dream-os. All ten are REPORTED by §2.3 and cured by their own
// sittings; none is cured here.
//
// `daystogo` has a second escape worth its own line: `tdw_f0774_stripper.proof.mjs`
// §6.3 and §6.5 both glob `*.proof.(mjs|js)` and it is `.proof.ts`, so the two
// cells that exist to find a regrown naive rule and a guardless line pass cannot
// see the one file carrying both. A GUARD WHOSE GLOB MISSES A FILE CLASS.
//
// ── "THROUGH THE HOME" MEANS THE HOME'S CODE RUNS  [chair ruling, B-1] ──────
// Four shapes were priced and all four COUNT, because an identity test that
// convicts honesty is a worse instrument than the one it replaces:
//
//   MODULE SYSTEM   a DECLARED MIRROR counts. `b40` is CommonJS with synchronous
//                   cells and cannot import the `.mjs`; the `.cjs` was minted for
//                   it. THE FORK IS THE MODULE SYSTEM AND NEVER THE RULE, which
//                   is why the members below are pinned by MECHANISM in §2.3a
//                   rather than trusted by filename.
//   OUT-OF-PROCESS  `execSync`-ing the home counts. `modeBridge.proof.ts` shells
//                   out once per file so the definition stays in one place and is
//                   genuinely called; convicting it would punish the careful form.
//   ALIASING        counts, and the test resolves the BINDING rather than the
//                   call-site spelling. `b40` writes `const strip = stripComments`
//                   and calls `strip(…)`. The B-1 read-first's own harness got
//                   this wrong on its first pass and reported twelve dream-os
//                   home-importers as hand-rolled — which is the proof that a
//                   name-match cannot do this job, filed one level up from the
//                   defect it was written to find.
//   REASONED
//   DEVIATION       counts as a DECLARED EXCEPTION, named at its site with its
//                   reason and enumerated in ONE place (`IDENTITY_EXCEPTIONS`).
//                   Never a silent pass.
//
// WHY `NAIVE_RETIRED` IS NOT A BINDING. It is exported for VACUITY TWINS only —
// a §0.Y cell proving the naive rule WOULD swallow the specimen §0.X proves
// survives. A file that imports it and calls only it has imported the home in
// order to strip with the condemned rule, which is exactly F-39.41. So the
// binding walk below accepts `stripComments` and refuses `NAIVE_RETIRED` by name.
const HOME_SPEC = /['"][^'"]*lib\/stripComments(?:\.(?:mjs|cjs|js))?['"]/;

// THE MEMBERS. Declared here and PROVEN in §2.3a — a "mirror" that has drifted
// from the home is not a mirror, and letting one launder an offender is the
// exemption disease (§2.1's shape) one level up.
const HOME_MEMBERS = [
  { file: 'scripts/lib/stripComments.mjs',
    why: 'THE HOME (F-07.74). ESM; every .mjs proof in this repo imports it directly.' },
  { file: 'scripts/lib/stripComments.cjs',
    why: 'DECLARED MIRROR, CE-39 2c-Studio arm (ii), founder-ruled. Minted so b40 — CommonJS, synchronous cells — could stop carrying NAIVE_RETIRED\'s own shape (F-39.39).' },
];

// BINDINGS, NOT SPELLINGS. Named, default and namespace forms, in both module
// systems, with ONE alias hop — which is the depth the tree actually uses and
// the depth a reader can check by eye. A second hop would be a data-flow
// analysis, and this estate has already ruled once (F-39.42) that the moment an
// instrument needs a compiler it says so instead of pretending.
const bindingsOf = (s) => {
  const names = new Set();
  const SPEC = `['"][^'"]*lib/stripComments(?:\\.(?:mjs|cjs|js))?['"]`;
  // `import { stripComments as strip } from '…'` · `const { stripComments } = require('…')`
  // ── AND THE MIXED FORM, WHICH THIS WALK MISSED ON ITS FIRST CUT ──────────
  // `import stripComments, { NAIVE_RETIRED } from './lib/stripComments.mjs'` is
  // what `tdw09_p2c` and `tdw13_d3_choreography` write, and both read as
  // HAND-ROLLED until the optional default binding was allowed for. THIRD TIME in
  // this one sitting that a pattern-matcher was wrong about the tree before the
  // tree was wrong about anything — which is F-39.25 with no ambiguity left in
  // it. §2.3k below is the specimen that keeps this arm honest from here.
  for (const m of s.matchAll(new RegExp(`(?:import\\s+(?:[A-Za-z_$][\\w$]*\\s*,\\s*)?|const|let|var)\\s*\\{([^}]*)\\}\\s*(?:from|=\\s*require\\s*\\()\\s*${SPEC}`, 'g'))) {
    for (const part of m[1].split(',')) {
      const t = part.trim();
      if (!t) continue;
      const [lhs, rhs] = t.split(/\s+as\s+|\s*:\s*/).map((x) => (x || '').trim());
      if (lhs !== 'stripComments') continue;      // NAIVE_RETIRED is not a stripper
      names.add(rhs || lhs);
    }
  }
  // `import strip from '…'` · `import * as m from '…'` · `const m = require('…')`
  for (const m of s.matchAll(new RegExp(`import\\s+(?:\\*\\s+as\\s+)?([A-Za-z_$][\\w$]*)\\s*(?:,\\s*\\{[^}]*\\})?\\s+from\\s*${SPEC}`, 'g'))) names.add(m[1]);
  for (const m of s.matchAll(new RegExp(`(?:const|let|var)\\s+([A-Za-z_$][\\w$]*)\\s*=\\s*require\\s*\\(\\s*${SPEC}\\s*\\)`, 'g'))) names.add(m[1]);
  // ONE ALIAS HOP: `const strip = stripComments` and `const strip = mod.stripComments`
  for (const n of [...names]) {
    const N = n.replace(/\$/g, '\\$');
    for (const m of s.matchAll(new RegExp(`(?:const|let|var)\\s+([A-Za-z_$][\\w$]*)\\s*=\\s*${N}(?:\\.stripComments)?\\s*[;\\n]`, 'g'))) names.add(m[1]);
  }
  return names;
};

// F-07.99 APPLIED PER READER. A held definition with no call site fooled this
// estate for a whole block, and the mirror was minted with §5.2 of the stripper
// proof asserting exactly this for b40. Here it is asked of every reader.
const invokesAny = (s, names) =>
  [...names].some((n) => new RegExp(`\\b${n.replace(/\$/g, '\\$')}\\s*\\(`).test(s));

// OUT-OF-PROCESS, declared as a conjunction rather than a proximity window: the
// file spawns a child, names a home member, and calls `stripComments` inside what
// it spawns. Three facts a reader can check by eye. A window measured in
// characters would be an instrument nobody could reason about, which is the
// thing this sitting exists to stop shipping.
const outOfProcess = (s) =>
  /child_process/.test(s) && /lib\/stripComments\.(?:mjs|cjs|js)/.test(s) && /\bstripComments\s*\(/.test(s);

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
  // IDENTITY, derived in the SAME walk as presence — two questions, one corpus
  // read. A second walk would be a second corpus to keep in step, which is the
  // hand-written-enumeration disease this file's own §F-38.p5 header already
  // filed once against itself.
  const binds = HOME_SPEC.test(src) ? bindingsOf(src) : new Set();
  const viaHome = (binds.size > 0 && invokesAny(src, binds)) || outOfProcess(src);
  // the rules it runs that are NOT the home — `one-home` and `out-of-process` are
  // name-shaped rows and are discounted here on purpose (that is F-39.41).
  //
  // ── `named-blanker` IS A NAME-SHAPED ROW TOO, AND IT COST TWO FALSE REPORTS ──
  // It fires on `blankComments|CODE_OF|codeOf`, which is the NAME a file gives the
  // helper that wraps its stripper — and the estate's most careful readers wrap
  // the HOME under exactly that name: `modeBridge.proof.ts`'s `codeOf` is the
  // out-of-process call to the home, and dream-os `b07_p3`/`p4a_ig`/`p4b_body`
  // all spell their home wrapper `codeOf` too. Worse, THIS FILE matched the row
  // by DECLARING it: the literal `blankComments|CODE_OF|codeOf` in SHAPE TABLE 2
  // survives stripping, so the bench reported itself as carrying a hand-rolled
  // blanker it does not have.
  //
  // A FIRST CUT HERE TRIED "counts if the file DEFINES the helper", and
  // `modeBridge` walked straight through it: it DOES define `codeOf`, and the
  // body of that definition is the out-of-process call to the home. Distinguishing
  // the two would mean reading the definition's body within some window of
  // characters, and a window measured in characters is an instrument nobody can
  // reason about.
  //
  // SO THE ROW IS DROPPED FROM THIS QUESTION ENTIRELY, which is the lesson of
  // this whole finding rather than a concession to it: A NAME-SHAPED ROW CANNOT
  // ANSWER AN IDENTITY QUESTION. `one-home`, `out-of-process` and `named-blanker`
  // are all names. What evidences a hand-rolled strip is a MECHANISM — a regex
  // over comment syntax — and those are the four rows below.
  //
  // Nothing is lost by it: a reader whose ONLY shape is `named-blanker` still
  // reaches §2.3c as an offender (it strips, it does not reach the home), and it
  // is printed with its rule named as what it is — a name-shaped row and nothing
  // else — rather than as a mechanism this table cannot actually see.
  const MECHANISM_ROWS = new Set(['block-replace', 'line-replace', 'line-filter', 'jsx-comment']);
  const ownRules = strips.filter((n) => MECHANISM_ROWS.has(n));
  // the F-39.41 shape at its sharpest: a private function wearing the home's name
  const shadow = !viaHome && /(?:const|let|var|function)\s+stripComments\s*[=(]/.test(src);
  readers.push({ rel, reads, parses, strips, codeSubject: CODE_SUBJECT.test(src),
                 binds: [...binds], viaHome, ownRules, shadow });
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
  process.exit(3); // F-39.47/F-39.55: a refusal exits 3 — named, never a FAIL, never in a base
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
sec('§2.3 · AND A READER THAT STRIPS, STRIPS THROUGH THE ONE HOME  [F-39.41]');

// ── THE DECLARED IDENTITY EXCEPTIONS ───────────────────────────────────────
// The chair's ruling: exceptions are a NAMED LIST here, never a silent pass, and
// every one is ALSO written down at its own site. `witness` is that written
// reason, and it is read from RAW because a reason lives in a comment — the same
// declared-prose read `EXEMPT_SITES` above makes, for the same reason. If a seat
// deletes the reason from the file, the exception dies with it and the file
// becomes an offender. An exception that outlives its argument is a licence.
const IDENTITY_EXCEPTIONS = [
  { file: 'scripts/tdw15_p2_envelopes.proof.mjs',
    witness: 'The shared stripper leaks on this very file',
    why: 'REASONED DEVIATION, ruled to count (B-1). It strips by line-filter DELIBERATELY, not by neglect: the shared stripper leaks on `expenses.tsx` and reads 25 controls where the sealed instrument reads 24, so a bench reaching for the home would inherit the phantom. This is the most careful seat in the set, and the widening note on STRIP_SHAPES\' line-filter row already declined to convict it once. An identity test that convicts it is a worse instrument than the one it replaces.' },
  { file: 'scripts/tdw_f0774_vacuity_probe.mjs',
    witness: 'mutates PRODUCTION source, runs, then restores byte-identical',
    why: 'PLANT-AND-RERUN. Its reads are sha-restoration comparisons of whole files — it holds ORIGINALS, writes, re-runs other benches, writes back and verifies. The subject of its reads is BYTES TO RESTORE, not tokens to match, so there is nothing for a stripper to do. It derives as a reader only because the shape tables see a read and a match; the match is over other benches\' output.' },
];

// NON-VACUITY OF THE EXCEPTION SET ITSELF, exactly as §2.1 does for the other
// list: an exception naming a dead file, or one whose written reason has gone,
// is an exception laundering an offender.
const badIdentityExempt = IDENTITY_EXCEPTIONS.filter((e) =>
  !fs.existsSync(path.join(ROOT, e.file)) || !raw(e.file).includes(e.witness));
ok(`§2.3a every declared identity exception is live and still argued AT ITS SITE (${IDENTITY_EXCEPTIONS.length} declared)`,
  badIdentityExempt.length === 0,
  `exceptions whose file or whose written reason has gone: ${badIdentityExempt.map((e) => e.file).join(', ')}`);

// THE MEMBERS ARE PROVEN, NOT TRUSTED BY FILENAME. A `.cjs` beside the home that
// had drifted from it would be two definitions of "code" inside ONE repo — the
// F-07.52 failure the mirror was minted under an explicit ruling to avoid — and
// every reader importing the drifted copy would read as compliant here.
const normScan = (s) => (s.match(/while \(i < src\.length\)[\s\S]*?\n  return out;/) || [''])[0].replace(/\s+/g, ' ').trim();
const HOME_SCAN = normScan(raw(HOME_MEMBERS[0].file));
const driftedMembers = HOME_MEMBERS.filter((m) =>
  !fs.existsSync(path.join(ROOT, m.file)) || normScan(raw(m.file)) !== HOME_SCAN);
ok(`§2.3b every declared home member carries the home's scan (${HOME_MEMBERS.length} members)`,
  HOME_SCAN.length > 200 && driftedMembers.length === 0,
  `members that are not the home: ${driftedMembers.map((m) => m.file).join(', ') || '(the home\'s own scan did not parse — this cell is reading the wrong region)'}`);

// ── THE CELL. Tiered, because the tiers are different diseases and a chair
//    sequencing cures needs to see which is which. The UNIT IS THE FILE'S
//    STRIPPING IDENTITY and not the read site: read-site granularity is not
//    derivable without the compiler F-39.42 says we do not have, and claiming it
//    would be this bench asserting a precision it cannot deliver. So a reader
//    that strips through the home AND ALSO hand-rolls beside it is REPORTED as
//    its own tier rather than convicted — named for the chair, not counted here.
const idExemptFiles = new Set(IDENTITY_EXCEPTIONS.map((e) => e.file));
const idCandidates = readers.filter((r) =>
  r.codeSubject && r.strips.length && !idExemptFiles.has(r.rel));

const shadows = idCandidates.filter((r) => r.shadow);
const handRolled = idCandidates.filter((r) => !r.shadow && !r.viaHome);
const mixed = idCandidates.filter((r) => r.viaHome && r.ownRules.length);
const offenders2 = [...shadows, ...handRolled];

const line = (r) => `${r.rel}  [rule: ${r.ownRules.join('+') || 'none derived — it satisfies a NAME-shaped row and nothing else'}]`;

ok(`§2.3c every stripping code-subject reader strips through the one home (${offenders2.length} do not)`,
  offenders2.length === 0,
  offenders2.length
    ? 'THE UN-HOMED-STRIP CLASS, named with its rule. Each JOINS the debt list.\n'
      + `\n       TIER 1 — THE NAME LIE (${shadows.length}). A private function called\n`
      + '       `stripComments` whose body is the rule the home retired. §2.2 above\n'
      + '       reads these as compliant, which is F-39.41 itself:\n       - '
      + (shadows.map(line).join('\n       - ') || '(none)')
      + `\n\n       TIER 2 — HAND-ROLLED, NO HOME (${handRolled.length}). Own rule, honestly named,\n`
      + '       no import. Cure is mechanical: import the home, delete the rule.\n       - '
      + (handRolled.map(line).join('\n       - ') || '(none)')
      + '\n\n       NOT CURED HERE. Each is its own sitting\'s work and the chair sequences\n'
      + '       them; this cell REPORTS, and a red with a name is not noise.'
    : undefined);

// REPORTED, NEVER CONVICTED — see the unit note above.
if (mixed.length) {
  console.log(`  NOTE §2.3d — ${mixed.length} reader(s) reach the home AND carry a second rule beside it.`);
  console.log('       Not convicted: the unit here is the file and the offence would be a READ SITE.');
  for (const r of mixed) console.log(`       - ${r.rel}  [second rule: ${r.ownRules.join('+')}]`);
}

// BOTH WAYS, ON SPECIMENS, so the cell is provably able to go red AND to go green
// without touching the tree — and so that every shape the chair ruled IN is
// demonstrated to actually be recognised rather than merely described above.
const READ_PARSE = `const s = read('app/x/page.tsx'); if (s.match(/Victor/)) {}`;
const idOf = (src) => {
  const b = HOME_SPEC.test(src) ? bindingsOf(src) : new Set();
  return (b.size > 0 && invokesAny(src, b)) || outOfProcess(src);
};
ok('§2.3e RED ARM — a private fn named `stripComments` running the retired rule is CAUGHT',
  !idOf(`const stripComments = (s) => s.replace(RETIRED, '');\n${READ_PARSE}`));
ok('§2.3f RED ARM — importing the home but calling only NAIVE_RETIRED is CAUGHT',
  !idOf(`import { NAIVE_RETIRED } from './lib/stripComments.mjs';\nconst s = NAIVE_RETIRED(x);\n${READ_PARSE}`),
  'the binding walk accepted NAIVE_RETIRED as a stripper — this is F-39.41 rebuilt inside its own cure');
ok('§2.3g GREEN ARM — a plain named import that is called is NOT caught',
  idOf(`import { stripComments } from './lib/stripComments.mjs';\nconst s = stripComments(x);\n${READ_PARSE}`));
ok('§2.3h GREEN ARM — an ALIASED home binding is NOT caught (b40\'s shape)',
  idOf(`const { stripComments } = require('./lib/stripComments.cjs');\nconst strip = stripComments;\nconst s = strip(x);\n${READ_PARSE}`),
  'the walk resolves spellings, not bindings — the mistake the B-1 harness made on its first pass');
ok('§2.3i GREEN ARM — an OUT-OF-PROCESS invocation is NOT caught (modeBridge\'s shape)',
  idOf(`import { execSync } from 'child_process';\nconst c = execSync("node -e \\"import {stripComments} from './scripts/lib/stripComments.mjs'; stripComments(x)\\"");\n${READ_PARSE}`));
ok('§2.3k GREEN ARM — the MIXED default+named import is NOT caught (tdw09_p2c\'s shape)',
  idOf(`import stripComments, { NAIVE_RETIRED } from './lib/stripComments.mjs';\nconst c = stripComments(x);\n${READ_PARSE}`),
  'the walk lost the default binding to the named clause beside it — the first cut of this walk did exactly that and convicted two correct readers');
ok('§2.3j THE SELF-CHECK — this bench strips through the home by its own test',
  readers.some((r) => r.rel === SELF && r.viaHome),
  'the file that declares the identity tables does not satisfy them');

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
if (offenders.length || offenders2.length) {
  console.log('\nDEBT, NAMED — TWO CLASSES, ONE BENCH:');
  console.log(`  §2.2  ${offenders.length} code-subject readers that STRIP NOT AT ALL.`);
  console.log(`  §2.3  ${offenders2.length} that strip, but NOT THROUGH THE HOME`);
  console.log(`        (${shadows.length} of them under the home's own NAME — F-39.41's §2).`);
  console.log('This bench is carried in run-floor.sh\'s named base by LABELLED amendment and');
  console.log('comes out of it the day BOTH cure sittings land. A red with a name is not noise.');
  console.log('THE FLOOR GAINS NO LINE FROM §2.3 — this bench was already base, and the floor\'s');
  console.log('unit is the bench. A reader who expects a line per name has mistaken a report');
  console.log('for a set.');
}
process.exit(fail ? 1 : 0);
