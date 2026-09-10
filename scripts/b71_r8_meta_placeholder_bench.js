// scripts/b71_r8_meta_placeholder_bench.js
// F-42.128 · THE META PLACEHOLDER, ON `/v/`. Exit code is the verdict.
//
// THE SUBJECT IS `lib/public/metaPlaceholder.ts`, IMPORTED AND RUN — never
// restated. §1 executes the shipped function through the repo's own compiler;
// §2 reads the three surfaces textually, because a call site is markup and not
// a function; §1.4 pins this pattern to `/r/`'s literal copy so two homes for
// one regex cannot drift apart in silence.

const fs   = require('fs');
const path = require('path');
const ts   = require('typescript');
const ROOT = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const { stripComments } = require('./lib/stripComments.cjs');
const strip = stripComments;

let fails = 0, refusals = 0;
const refusedNames = [];
function cell(name, fn) {
  try {
    const why = fn();
    if (!why) { console.log('GREEN ' + name); return; }
    if (/^REFUSED\b/.test(why)) {
      console.log('REFUSED ' + name + ' — ' + why.replace(/^REFUSED\s*—?\s*/, ''));
      refusals++; refusedNames.push(name.split(' ')[0]);
      return;
    }
    console.log('RED   ' + name + ' — ' + why); fails++;
  } catch (e) {
    console.log('RED   ' + name + ' — threw: ' + (e && e.message)); fails++;
  }
}

// The repo's own compiler is the reader. b70 paid for the alternative once: a
// hand-rolled type-stripper ate a real value that looked like an annotation.
function load(rel) {
  const js = ts.transpileModule(read(rel), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const mod = { exports: {} };
  new Function('exports', 'module', 'require', js)(mod.exports, mod, require);
  return mod.exports;
}
const M = load('lib/public/metaPlaceholder.ts');

// THE WITNESSED LINK, verbatim from the founder's tap on 2026-09-10. The cell is
// written against what was SEEN, not against a reconstruction of it.
const WITNESSED = 'https://thedreamwedding.in/v/%7B%7B1%7D%7DMAKEUPBYSWATIROY';
const HANDLE    = 'MAKEUPBYSWATIROY';

const SURFACES = [
  'app/v/[code]/page.tsx',
  'app/v/[code]/date/page.tsx',
  'app/v/[code]/w/[slug]/page.tsx',
];

// ═══ §1 · THE STRIP, EXECUTED ═════════════════════════════════════════════

cell('§1.1 both spellings resolve to the handle, and a bare code is untouched', () => {
  const cases = [
    // As Next hands it over: the segment is already decoded.
    ['{{1}}' + HANDLE, HANDLE, 'the decoded form — what actually arrives'],
    // And as it sits in the URL, so no assumption about the runtime is load-bearing.
    ['%7B%7B1%7D%7D' + HANDLE, HANDLE, 'the encoded form'],
    ['%7b%7b1%7d%7d' + HANDLE, HANDLE, 'lower-case percent escapes'],
    // The no-op that covers nearly every link in existence.
    [HANDLE, HANDLE, 'a bare handle'],
    ['DEV440', 'DEV440', 'a bare handle, the other fixture'],
  ];
  for (const [input, want, what] of cases) {
    const got = M.stripMetaPlaceholder(input);
    if (got !== want) return `${what}: 「${input}」 → 「${got}」, expected 「${want}」`;
  }
  return null;
});

cell('§1.2 the witnessed link resolves — end to end, from the URL the founder tapped', () => {
  // Modelled the way the runtime does it: take the segment, let the platform
  // decode it, hand it to the strip. If this cell ever needs changing to stay
  // green, the walk is what changed and not the code.
  const seg = WITNESSED.split('/v/')[1];
  const asNextHandsIt = decodeURIComponent(seg);
  if (asNextHandsIt !== '{{1}}' + HANDLE) return 'the fixture does not model the runtime: ' + asNextHandsIt;
  const got = M.stripMetaPlaceholder(asNextHandsIt);
  if (got !== HANDLE) return 'the witnessed link still does not reach a vendor: ' + got;
  return null;
});

cell('§1.3 the strip is ANCHORED and takes exactly one', () => {
  // Meta appends, so the placeholder can only be a prefix. A global or unanchored
  // replace would rewrite a handle that carried the sequence anywhere else, and
  // this function must not be the thing that assumes handles cannot.
  if (M.stripMetaPlaceholder('AB{{1}}CD') !== 'AB{{1}}CD') return 'a mid-string placeholder was rewritten';
  // Two prefixes is not a case Meta can produce; taking only the first is the
  // conservative reading and is asserted so a later `g` flag reddens here.
  if (M.stripMetaPlaceholder('{{1}}{{1}}X') !== '{{1}}X') return 'more than one prefix was consumed';
  if (M.stripMetaPlaceholder('{{2}}' + HANDLE) !== '{{2}}' + HANDLE) return 'a different parameter index was stripped';
  return null;
});

cell('§1.4 the `/r/` copy and this one are the SAME pattern', () => {
  // TWO HOMES, DELIBERATELY — `app/r/[code]/route.ts` is an approved edge route
  // and keeps its own literal, for the reason stated at its own site. This cell
  // is what makes two homes safe: the source text of both patterns must match,
  // so a fix applied to one and not the other cannot land quietly.
  const here = strip(read('lib/public/metaPlaceholder.ts')).match(/\/\^\([^\n]*?\)\/i/);
  const there = strip(read('app/r/[code]/route.ts')).match(/\/\^\([^\n]*?\)\/i/);
  if (!here)  return 'no anchored pattern found in lib/public/metaPlaceholder.ts';
  if (!there) return 'REFUSED — app/r/[code]/route.ts carries no META_PLACEHOLDER to compare against';
  if (here[0] !== there[0]) return `the two homes have drifted: 「${here[0]}」 vs 「${there[0]}」`;
  return null;
});

cell('§1.5 STRIP, NOT DECODE — c-42.5', () => {
  const src = strip(read('lib/public/metaPlaceholder.ts'));
  if (/decodeURIComponent/.test(src)) return 'a second decode is back; a handle holding a bare % would throw URIError and 500 a page that works today';
  // Proven, not just read: the exact input that would have thrown.
  const nasty = '{{1}}100%SILK';
  if (M.stripMetaPlaceholder(nasty) !== '100%SILK') return 'a handle with a bare % did not survive the strip';
  return null;
});

// ═══ §2 · THE READERS ═════════════════════════════════════════════════════

cell('§2.1 every `/v/` param site strips before it is used', () => {
  const bad = [];
  for (const f of SURFACES) {
    const s = strip(read(f));
    const sites = s.match(/const \{ code[^}]*\} = await params;/g) || [];
    if (!sites.length) return 'no param site found in ' + f;
    // The raw value must never be BOUND to `code`, because everything downstream
    // spells `code` and would silently take the polluted one.
    for (const site of sites) {
      if (!/code: raw/.test(site)) bad.push(f + ' → ' + site.trim());
    }
    const strips = (s.match(/stripMetaPlaceholder\(raw\)/g) || []).length;
    if (strips !== sites.length) bad.push(`${f} has ${sites.length} param site(s) and ${strips} strip(s)`);
  }
  return bad.length ? bad.join('; ') : null;
});

cell('§2.2 nothing downstream reads the raw value', () => {
  const bad = [];
  for (const f of SURFACES) {
    const s = strip(read(f));
    // `raw` exists to be stripped and for nothing else. One use per site.
    const uses = (s.match(/\braw\b/g) || []).length;
    const sites = (s.match(/const \{ code[^}]*\} = await params;/g) || []).length;
    if (uses !== sites * 2) bad.push(`${f}: ${uses} uses of raw across ${sites} site(s) — expected exactly two each (the bind and the strip)`);
  }
  return bad.length ? bad.join('; ') : null;
});

cell('§2.3 the date page emits its back-link from the STRIPPED code', () => {
  // This is the one that would have carried the bend onward. `/v/[code]/date`
  // spells `code` directly in two hrefs, so before the cure a polluted arrival
  // handed the stranger a link back to a page that says the vendor is gone —
  // the same dead end, one hop later, now looking like our own page's fault.
  const s = strip(read('app/v/[code]/date/page.tsx'));
  const hrefs = s.match(/href=\{`\/v\/\$\{encodeURIComponent\((\w+)\)\}`\}/g) || [];
  if (hrefs.length < 2) return 'the two back-links could not be located';
  const fromRaw = hrefs.filter((h) => /\(raw\)/.test(h));
  if (fromRaw.length) return 'a back-link is built from the raw param: ' + fromRaw.join(', ');
  return null;
});

cell('§2.4 the strip has ONE home — no surface re-spells the pattern', () => {
  const bad = [];
  for (const f of SURFACES) {
    const s = strip(read(f));
    if (/\{\{1\}\}|%7B%7B1%7D%7D/.test(s)) bad.push(f + ' spells the placeholder itself');
    if (!/from '@\/lib\/public\/metaPlaceholder'/.test(s)) bad.push(f + ' does not import the one home');
  }
  return bad.length ? bad.join('; ') : null;
});

cell('§2.5 the cure names its own retirement, and names its TRIGGER', () => {
  // It is a bend to a vendor-side fact, not a rule of ours. Left standing after
  // Meta's edit window it is a silent rewrite on a public path that nobody can
  // account for — so the file must say, in its own text, when it dies.
  //
  // ⚠ TIGHTENED AFTER A MUTATION WALKED THROUGH IT. The first predicate was
  // `/retire|dies/i` over the whole file, and the file happens to use the word
  // twice: once in the retirement heading and once in the sentence under it.
  // Deleting the heading left the other occurrence and the cell stayed GREEN —
  // a cell that asserts a word is present, not that a thing is stated. The
  // TRIGGER is the part that matters: a retirement with no condition attached is
  // a note, and nobody retires on a note.
  const src = read('lib/public/metaPlaceholder.ts');
  if (!/F-42\.128/.test(src)) return 'the finding is not named at the cure';
  if (!/F-42\.129/.test(src)) return 'the filing class is not named for seat B';
  if (!/edit window/i.test(src)) return 'the retirement has no TRIGGER — say what event kills this strip';
  if (!/retires? WITH ITS READERS/i.test(src)) return 'the retirement does not say the readers go with it';
  return null;
});

if (fails > 0) {
  console.log('\nFLOOR RED — ' + fails + ' cell(s)'
    + (refusals ? ' · ' + refusals + ' also REFUSED: ' + refusedNames.join(', ') : ''));
  process.exit(1);
}
if (refusals > 0) {
  console.log('\nFLOOR REFUSED — ' + refusals + ' cell(s): ' + refusedNames.join(', ')
    + '\nThis is NOT a pass and NOT a fail.');
  process.exit(3);
}
console.log('\nFLOOR GREEN');
process.exit(0);
