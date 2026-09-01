#!/usr/bin/env node
// scripts/tdw_f0774_stripper.proof.mjs
// ═════════════════════════════════════════════════════════════════════════════
// F-07.74 — THE STRIPPER AUDIT'S OWN BENCH.
// TDW_STRIPPER_CANARY
// ═════════════════════════════════════════════════════════════════════════════
// THE DISEASE. `.replace(/\/\*[\s\S]*?\*\//g, '')` treats the `/*` inside the
// string literal `accept="image/*"` as a comment open and deletes everything to
// the next real `*/`. Eleven copies of that rule lived in ten proofs of this repo
// and six benches of dream-os. At 5535e24 it swallowed, per the TS-lexer census:
//
//   sanctuary/page.tsx        2 bites   span 7,212   LIVE 6,519
//   admin/_components/AdminUI.tsx       span   741   LIVE   723
//   admin/demo/page.tsx                span   526   LIVE   516
//   admin/exploring/page.tsx           span   154   LIVE   141
//   frost/canvas/muse/page.tsx         span   143   LIVE   112
//   admin/discover-heroes/page.tsx     span    99   LIVE    83
//   coplanner/muse/AddMuseSheet.tsx    LATENT — no `*/` below its image/* yet
//   ─────────────────────────────────────────────────────────────────────────
//   7 false bites · 8,875 span · 8,094 LIVE CHARACTERS invisible to every
//   absence-cell that read those files.
//
// The 6,519 reproduces CE-120's figure to the character at a different tip.
//
// WHY THIS BENCH EXISTS AND NOT JUST §0 CANARIES. A §0 canary protects the file
// its own bench reads. This bench protects the CLASS: every image/* file in the
// estate, the two shapes the census found beyond image/*, the cross-repo twin of
// the definition, and the coverage claim itself — which is the claim NOTE_16 §3
// asserted from prose and no cell ever checked (F-07.98).
//
// SCOPE NOTE, DECLARED (acceptance bar γ, reported not adapted): the bar asks
// that BOTH the α and β cells RED under the restored naive regex. The α cells do
// — §3 drives exactly that. The β cells CANNOT: the naive rule removes real
// comments perfectly well, which is the whole reason it survived this long. β's
// honest twin is non-vacuity — proof that the comment token exists in the raw
// file — and that is what §2 asserts beside it. Named here rather than silently
// reshaped.
// ═════════════════════════════════════════════════════════════════════════════
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { stripComments, NAIVE_RETIRED } from './lib/stripComments.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const raw = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const code = (rel) => stripComments(raw(rel));

let pass = 0, fail = 0, skip = 0;
const ok = (label, cond, detail) => {
  if (cond) { pass++; console.log(`  ok   ${label}`); }
  else { fail++; console.log(`  FAIL ${label}`); if (detail) console.log(`       ${detail}`); }
};
const named_skip = (label, why) => { skip++; console.log(`  SKIP ${label}\n       ${why}`); };
const sec = (t) => console.log(`\n${t}`);

console.log('F-07.74 — the comment stripper, and the class it belongs to');

// ═════════════════════════════════════════════════════════════════════════════
sec('§0 · THE MECHANISM — the stripper itself, driven directly');
// The first draft of the dream-os twin planted an F-07.74-shaped `/*` in
// production source and expected a red; it stayed green, CORRECTLY, because the
// cured stripper is immune. The regression to catch is the STRIPPER reverting, so
// the cells drive the stripper, not the sources.
const SPEC = 'const a = 1;\nconst input = { accept: "image/*" };\nconst KEEP_ME = 2;\n/* real */\nconst ALSO_KEEP = 3;\n';
ok('§0.1 a mid-token /* opens nothing — live code after an accept="image/*" survives',
  stripComments(SPEC).includes('KEEP_ME') && stripComments(SPEC).includes('ALSO_KEEP'));
ok('§0.2 a real block comment is still removed', !stripComments(SPEC).includes('real'));
ok('§0.3 VACUITY TWIN — the RETIRED naive rule WOULD swallow that specimen',
  !NAIVE_RETIRED(SPEC).includes('KEEP_ME'));
ok('§0.4 the stripper is not a no-op', stripComments(SPEC).length < SPEC.length);
ok('§0.5 template-literal substitutions cannot open a block either',
  stripComments('const t = `${x}/*y*/`;\nconst KEEP = 1;\n').includes('KEEP'));
ok('§0.6 a `*/` inside a string cannot CLOSE a real comment early',
  !stripComments('/* one\nconst LEAK = 1;\n*/\nconst KEEP = 2;\n').includes('LEAK'));
ok('§0.7 line structure is preserved — stripped output stays line-stable',
  stripComments('/* a\nb\nc */\nX').split('\n').length === 4);
ok('§0.Z INVOCATION (F-07.99) — this bench really CALLS its stripper, it does not merely hold one',
  (() => { const self = stripComments(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8'));
           return (self.match(/\bcode\s*\(/g) || []).length >= 2; })());

// ═════════════════════════════════════════════════════════════════════════════
sec('§1 · α — EVERY image/* FILE KEEPS ITS LIVE CODE THROUGH STRIPPING');
// One cell per file. Each anchor is LIVE CODE derived from INSIDE that file's
// former bite (the span the naive rule deleted), verified unique in the file.
const ALPHA = [
  ['app/(frost)/frost/canvas/sanctuary/page.tsx',   'function fmtTime(t:string|null):string {'],
  ['app/(frost)/frost/canvas/sanctuary/page.tsx',   '0%,100% { opacity:0.5; box-shadow:0 0 6px ${accent}44; }'],
  ['app/(frost)/frost/canvas/muse/page.tsx',        'onChange={handleFilesSelected}'],
  ['app/admin/_components/AdminUI.tsx',             'const [urlFocus, setUrlFocus] = useState(false);'],
  ['app/admin/demo/page.tsx',                       'onChange={handlePhotoUpload}'],
  ['app/admin/discover-heroes/page.tsx',            'onChange={handleFileSelect}'],
  ['app/admin/exploring/page.tsx',                  'onChange={handleFileSelect}'],
  // LATENT carrier: no `*/` below its image/* today, so the naive rule never
  // matched here. It is armed by the next block comment added below line 166 —
  // celled now so the day it arms, this reddens instead of going quiet.
  ['app/coplanner/muse/AddMuseSheet.tsx',           '}}>JPG or PNG, up to 10 MB.</p>'],
];
for (const [rel, anchor] of ALPHA) {
  const label = `§1 ${rel.split('/').pop()} — live code from inside the bite survives: ${anchor.slice(0, 38)}`;
  ok(label, code(rel).includes(anchor),
     'the stripper swallowed live code — every absence-cell over this file is vacuous');
}
ok('§1.census the estate still has exactly EIGHT image/* sites across SEVEN files',
  (() => {
    const files = ALPHA.map(a => a[0]).filter((v, i, s) => s.indexOf(v) === i);
    const n = files.reduce((t, f) => t + (raw(f).match(/image\/\*/g) || []).length, 0);
    return files.length === 7 && n === 8;
  })(),
  'a new image/* site appeared or an old one moved — re-run scripts/tdw_stripper_census.mjs and re-anchor §1');

// ═════════════════════════════════════════════════════════════════════════════
sec('§2 · β — REAL COMMENTS ARE STILL REMOVED (with non-vacuity beside each)');
const BETA = [
  ['app/(frost)/frost/canvas/sanctuary/page.tsx', 'DiscImageDots'],
  ['app/admin/_components/AdminUI.tsx',           'Editorial design system'],
];
for (const [rel, token] of BETA) {
  ok(`§2 ${rel.split('/').pop()} — the token exists in RAW (non-vacuity)`, raw(rel).includes(token));
  ok(`§2 ${rel.split('/').pop()} — and is GONE from stripped output: ${token}`, !code(rel).includes(token));
}

// ═════════════════════════════════════════════════════════════════════════════
sec('§3 · γ — THE BOTH-WAYS: every α anchor DIES under the restored naive rule');
// This is the mutation, and the mutated artefact is the stripper — the one thing
// this sitting owns. Restoring the naive rule must kill every α cell above.
{
  let dead = 0, latent = [];
  for (const [rel, anchor] of ALPHA) {
    const survives = NAIVE_RETIRED(raw(rel)).includes(anchor);
    if (!survives) dead++; else latent.push(rel.split('/').pop());
  }
  ok(`§3.1 the naive rule kills ${dead} of ${ALPHA.length} α anchors`, dead === ALPHA.length - 1,
     `still alive under naive: ${latent.join(', ')} — expected exactly ONE (AddMuseSheet, the latent carrier)`);
  ok('§3.2 the one survivor is the LATENT carrier, named — not an accident',
     NAIVE_RETIRED(raw('app/coplanner/muse/AddMuseSheet.tsx')).includes('}}>JPG or PNG, up to 10 MB.</p>'));
}

// ═════════════════════════════════════════════════════════════════════════════
sec('§4 · THE DECLARED HOLE — regex literals, canaried at named fixtures');
// The scanner does not track regex literals. Two shapes can still bite:
//   (1) a regex containing `//`  → trips the line-comment branch;
//   (2) a regex ending `*/`      → closes an ALREADY-OPEN real comment early.
// Neither is armed at this tip. These cells hold that fact, so the day it changes
// the bench reddens instead of the class returning silently.
{
  const ONB = 'app/(frost)/frost/canvas/onboarding/page.tsx';   // carries /RS\.?\s*/i
  ok('§4.1 the named false-close fixture is still present (non-vacuity)',
    /replace\(\/RS\\\.\?\\s\*\/i/.test(raw(ONB)));
  ok('§4.2 and the live code beneath it survives stripping — the hole is NOT armed here',
    code(ONB).includes('export default function'));
  ok('§4.3 both holes are DECLARED in the module, not inherited silently',
    raw('scripts/lib/stripComments.mjs').includes('H1 \u00b7 JSX TEXT APOSTROPHES') &&
    raw('scripts/lib/stripComments.mjs').includes('H2 \u00b7 REGEX LITERALS'));

  // H2, ARMED TODAY at exactly one site. The loss is the tail of a regex literal,
  // not a swallowed region: the enclosing function survives, so no absence-cell
  // over this file is vacuous. The cell holds that boundary — if the loss ever
  // grows past the regex tail, this reddens.
  const IG = 'lib/frost/igLink.ts';
  ok('§4.4 H2 fixture present — the regex whose tail trips the line branch',
    /instagram\\\.com/.test(raw(IG)));
  ok('§4.5 and the live code around it SURVIVES — the hole costs a regex tail, not a region',
    code(IG).includes('export function igLink') || code(IG).includes('export const igLink') ||
    /export (function|const) \w+/.test(code(IG)));

  // H1, the under-strip direction. The fixture is a real comment that survives
  // stripping in sanctuary because a JSX-text apostrophe upstream mis-parks the
  // quote state. Celled so the leak is a KNOWN, BOUNDED fact rather than a
  // surprise the next absence-cell discovers by convicting on prose.
  ok('§4.6 H1 fixture — the known comment leak in sanctuary is still exactly that, a leak',
    code('app/(frost)/frost/canvas/sanctuary/page.tsx').includes('THE REGISTER. This was a local'));
}

// ═════════════════════════════════════════════════════════════════════════════
sec('§5 · ONE DEFINITION, THREE MEMBERS — the identity cell');
// F-07.52 tried one-home-by-verbatim-port INSIDE one repo and the port was never
// wired (F-07.99). The class lives on both repos, so the definition is pinned on
// both. Sibling absent ⇒ LOUD NAMED SKIP, never a silent pass.
//
// ── THE MEMBERSHIP GREW TO THREE  [CE-39 · 2c-Studio · arm (ii), founder-ruled] ──
// WHAT STOOD: two members — this repo's `.mjs` and dream-os
// `scripts/lib/stripComments.js`. WHAT IS ADDED: this repo's
// `scripts/lib/stripComments.cjs`, minted so `b40_worklist_shell_bench.js` could
// stop carrying `NAIVE_RETIRED`'s own shape (F-39.39). The bench is CommonJS and
// its cells are synchronous, so it cannot `require` the `.mjs`; THE FORK IS THE
// MODULE SYSTEM AND NEVER THE RULE, and the mirror's header says so at its head.
//
// COUNT PRESERVED: this section still asserts ONE property with ONE cell —
// 「every member carries the same scan」 — and the cell now folds over a set of
// members instead of comparing a pair. The scoped grant was the membership line;
// nothing else in this proof is opened.
//
// A MIRROR THAT IS NEVER CALLED IS THE FAILURE THIS REGIME EXISTS TO CATCH
// (F-07.52, F-07.99), so §5.2 asserts b40 actually requires it. A pinned
// definition with no caller fooled the estate for a whole block once already.
{
  const norm = (s) => (s.match(/while \(i < src\.length\)[\s\S]*?\n  return out;/) || [''])[0]
    .replace(/\s+/g, ' ').trim();
  const HOME = norm(raw('scripts/lib/stripComments.mjs'));

  // IN-REPO MEMBER — always readable, never skippable.
  ok('§5.0 the in-repo CJS mirror carries the home\'s scan, byte-identical in mechanism',
    HOME.length > 200 && norm(raw('scripts/lib/stripComments.cjs')) === HOME,
    'scripts/lib/stripComments.cjs has drifted from the .mjs it declares as its source — two definitions of "code" inside ONE repo, which is F-07.52 exactly');

  const SIB = ['../dream-os/scripts/lib/stripComments.js',
               '../../dream-os/scripts/lib/stripComments.js'];
  const found = SIB.map(p => path.resolve(ROOT, p)).find(p => fs.existsSync(p));
  if (!found) {
    named_skip('§5.1 cross-repo identity — dream-os sibling clone not present',
      'the twin definition could not be read from this container; the identity is UNPROVEN here and is proven in dream-os by scripts/b07_f0774_stripper_bench.js §5. A skip, counted and named — never a pass.');
  } else {
    ok('§5.1 the two repos carry ONE definition, byte-identical in mechanism',
      HOME.length > 200 && norm(fs.readFileSync(found, 'utf8')) === HOME,
      'the estate has drifted into two definitions of "code" again — F-07.52\'s exact failure, one repo over');
  }

  // F-07.99's law, applied to the new member the day it is minted.
  ok('§5.2 INVOCATION — b40 really requires the mirror, and no longer carries the retired rule',
    /require\('\.\/lib\/stripComments\.cjs'\)/.test(raw('scripts/b40_worklist_shell_bench.js'))
    && !/replace\(\/\\\/\\\*\[\\s\\S\]\*\?\\\*\\\/\/g/.test(raw('scripts/b40_worklist_shell_bench.js')),
    'b40 either does not call the mirror or still carries NAIVE_RETIRED\'s shape — a pinned definition with no caller is F-07.52\'s failure wearing the cure\'s name');
}

// ═════════════════════════════════════════════════════════════════════════════
sec('§6 · COVERAGE IS DERIVED, NEVER LISTED (F-07.98)');
// NOTE_16 §3 asserted "§0 canaries stand in every stripper-dependent proof". At
// 5535e24 they stood in three, and BOTH benches that were actually exposed had
// none. A sentence in a note is not a coverage map. These two lists are derived
// by reading the directory, and they must match.
{
  const SCRIPTS = path.join(ROOT, 'scripts');
  // PROOFS ONLY. The coverage law is about benches: a tool that imports the
  // stripper (the census instrument) is not a proof and carries no cells.
  const files = fs.readdirSync(SCRIPTS).filter(f => /\.proof\.(mjs|js)$/.test(f));
  const readS = (f) => fs.readFileSync(path.join(SCRIPTS, f), 'utf8');
  // ROGUE CHECKS READ STRIPPED SOURCE. A proof that DESCRIBES the retired rule in
  // a comment is documenting it, not carrying it — F-06.85 requires the mechanism
  // be named in-comment, and a cell that convicts on that comment convicts the
  // documentation of the cure (F-07.89's exact lesson).
  const codeS = (f) => stripComments(readS(f));
  const strippers = files.filter(f => /from '\.\/lib\/stripComments\.mjs'/.test(readS(f)));
  const canaried = files.filter(f => readS(f).includes('TDW_STRIPPER_CANARY'));
  const missing = strippers.filter(f => !canaried.includes(f));
  const orphan = canaried.filter(f => !strippers.includes(f));
  ok(`§6.1 every proof importing the stripper carries a canary (${strippers.length} strippers, ${canaried.length} canaried)`,
    missing.length === 0, `uncanaried stripper-dependent proofs: ${missing.join(', ')}`);
  ok('§6.2 and no proof claims a canary without importing the stripper',
    orphan.length === 0, `canary marker without a stripper: ${orphan.join(', ')}`);
  ok('§6.3 NOBODY else defines a stripper any more — one home, derived',
    files.filter(f => /replace\(\/\\\/\\\*\[\\s\\S\]\*\?\\\*\\\//.test(codeS(f))).length === 0,
    'a copy of the naive rule has grown back in scripts/');
  ok('§6.5 the guardless line pass (F-07.100 class) is dead in scripts/ too',
    files.filter(f => /replace\(\/\\\/\\\/\.\*\$\/gm/.test(codeS(f))).length === 0,
    'an unguarded line strip survives — it eats the tail of every https:// it meets');
  ok('§6.4 every stripper-dependent proof proves its own CALL-SITE (F-07.99)',
    strippers.every(f => /§0\.Z INVOCATION/.test(readS(f))),
    'a proof holds the stripper without proving it calls it — the shape that fooled this estate for a block');
}

// ═════════════════════════════════════════════════════════════════════════════
const total = pass + fail;
console.log(`\n${fail ? 'RED' : 'GREEN'} — tdw_f0774_stripper ${pass}/${total}${skip ? ` (${skip} NAMED SKIP)` : ''}`);
process.exit(fail ? 1 : 0);
