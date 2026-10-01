#!/usr/bin/env node
'use strict';
// DESIGN-1 · THE LAYOUT SWITCH: the v2 copy of b59_seven_ink_census.js. The original at its own path proves the classic
// tree (main's, unchanged); this one proves the redesign in v2/, with its stage 1-3 amendments by label.
process.env.TDW_LAYOUT_DEFAULT = 'v2';   // DESIGN-1 · THE LAYOUT SWITCH: this copy proves the v2 tree (middleware.ts serves it with no cookie)
// DESIGN-1 · THE LAYOUT SWITCH · THE V2 VIEW OF THE TREE (by label). The v2 tree is the shared tree with v2/ laid over it:
// a module with a copy in v2/ is served from v2/, and every other module is the shared one. So a directory walk in this
// copy sees exactly that: under app/, components/, lib/ and hooks/ a file whose v2/ twin exists is left out (the walk
// meets the twin under v2/ instead), and app/v2 (the route shims) is left out; the walks below also walk the v2/ roots.
{
  const __fs = require('fs'), __path = require('path');
  const __ROOT = __path.resolve(__dirname, '..');
  const __SHARED = ['app', 'components', 'lib', 'hooks'].map((d) => __path.join(__ROOT, d));
  const __rd = __fs.readdirSync;
  __fs.readdirSync = function (dir, opts) {
    const out = __rd.call(__fs, dir, opts);
    const abs = __path.resolve(String(dir));
    if (!__SHARED.some((s) => abs === s || abs.startsWith(s + __path.sep))) return out;
    const rel = __path.relative(__ROOT, abs);
    return out.filter((e) => {
      const name = typeof e === 'string' ? e : e.name;
      const r = __path.join(rel, name);
      if (r === __path.join('app', 'v2')) return false;
      const isDir = typeof e === 'string' ? __fs.statSync(__path.join(abs, name)).isDirectory() : e.isDirectory();
      return isDir || !__fs.existsSync(__path.join(__ROOT, 'v2', r));
    });
  };
}
// scripts/b59_seven_ink_census.js
//   R-40.129 ① · THE VENDOR SHELL PAINTS FROM SEVEN INKS AND NOTHING ELSE.
//
//   node scripts/b59_seven_ink_census.js
//
// Exit code is the verdict. Zero dependencies.
//
// ══════════════════════════════════════════════════════════════════════════
// THE LAW IT GUARDS
// ══════════════════════════════════════════════════════════════════════════
// Four families — Graphite, Chalk, teal (`--atelier-accent-text`), gold
// (`--role-metal`) — plus three state roles, `--role-positive`, `--role-caution`
// and `--role-critical`, WHICH ARE INKS AND NEVER GROUNDS. That is seven, and it
// is the whole palette of `/vendor/**`.
//
// The census that produced this cell found 162 leak rows across 31 files: nine
// distinct reds where the shell already had a ruled one, a terracotta with no
// home in any family, two phantom tokens whose fallbacks always painted, and
// 149 more literals that merely restated a token's current value and would go
// stale the moment it moved.
//
// ══════════════════════════════════════════════════════════════════════════
// WHY IT COUNTS LITERALS RATHER THAN CHECKING COLOURS
// ══════════════════════════════════════════════════════════════════════════
// A cell that asserted "every colour is one of these seven hexes" would have to
// hold the seven hexes, in both modes — fourteen constants copied out of
// `v2/lib/worklist/theme.ts`. The moment either table moved, the cell would be
// wrong and silent, which is the exact disease F-40.263 was: a value pinned
// against a token it did not own.
//
// So this cell asserts a SHAPE: under `/vendor/**` a colour is written as a
// token read or it is not written. It never needs to know what a token's value
// is, so no token move can invalidate it. The contrast cell (b60) owns the
// values; this one owns the shape. Two cells, two jobs, neither guessing.
//
// ══════════════════════════════════════════════════════════════════════════
// THE THREE EXCLUSIONS, EACH DERIVED AND EACH NAMED
// ══════════════════════════════════════════════════════════════════════════
// 1. HTML NUMERIC ENTITIES. `&#8593;` is an up arrow (AiDock.tsx) and `&#9670;`
//    a diamond. `#8593` matches a hex pattern and is not a colour. A cell that
//    reddens on an arrow gets silenced rather than obeyed, so the exclusion is
//    in the cell rather than in the reviewer's head.
// 2. THE TOKEN-DEFINITION FILES. `v2/lib/worklist/theme.ts` IS the palette; a
//    census that reddened on it would forbid the palette from existing.
// 3. THE BRAND MARKS (R-40.129 ③), allow-listed below BY FILE AND BY HEX, with
//    the ruling cited at each. A brand mark is a third party's property and not
//    a palette choice — but the ruling is narrow: on the mark itself, NEVER on a
//    ground, a border or text. So the allowance names the four SVG path fills of
//    the Google wordmark and nothing else. Note what is NOT here: WhatsApp's
//    `#25D366` has no surviving site at all. Its glyph (MessageBubble's SVG)
//    already read `var(--role-positive)`; every other `#25D366` in the estate was
//    a button ground, a border or a label, and ③ forbids all three.
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

// ── SCOPE ──────────────────────────────────────────────────────────────────
// THE SHELL, AND NOT `v2/app/vendor/(legacy)/**`. The census that produced this
// cell measured the SHELL: `v2/app/vendor/(shell)`, the vendor components, the
// worklist components and their lib. The legacy routes (`discover`, `pin`,
// `pin-login`, `pin-reset`, `onboarding`) are Espresso-era surfaces on their way
// out and were counted separately at 98 literals — a declared gap, restated in
// this file's own printout so nobody reads §1's green as covering them. Widening
// the scope to them is a ruling, not an edit; they are not cured here and this
// cell does not pretend they are.
const SCOPE = [
  'v2/app/vendor/(shell)', 'components/vendor', 'components/worklist', 'lib/worklist',
  // DESIGN-1 · THE LAYOUT SWITCH (by label): the same scope in the v2 view (the classic twins are left out above)
  'v2/components/vendor', 'v2/components/worklist', 'v2/lib/worklist',
];
const DECLARED_GAP = 'v2/app/vendor/(legacy)';
const TOKEN_DEFS = new Set(['v2/lib/worklist/theme.ts']);

// ── THE BRAND-MARK ALLOWANCE · R-40.129 ③ ──────────────────────────────────
// file → the exact hexes ruled onto that file's mark. Anything else in the file
// still reddens, so the allowance cannot widen by accident.
// A SECOND CLASS OF ALLOWANCE, RULED SEPARATELY AND NAMED SEPARATELY: a colour
// that belongs to ANOTHER LANE, quoted on the surface where that lane appears.
// `.yw-window` and the two iframes are the shell's frame around the vendor's LIVE
// public storefront. Their ground is what shows for the milliseconds before the
// iframe's own document paints, so it must be the public lane's page ground —
// `app/v/[code]/page.tsx:865`, `.pv{background:#F8F7F5}` — and not the shell's
// sheet. The chair pre-ruled it: a cream storefront behind a dark frame is a
// flash the walk would find, and `--atelier-sheet-bg` is #1D1E20 in Graphite.
//
// IT IS QUOTED AS A LITERAL BECAUSE THERE IS NOTHING TO READ. The public lane
// writes #F8F7F5 as a literal in `.pv` and mints no token for it, and a CSS
// variable cannot cross an iframe boundary in any case. The same shape as a brand
// mark: someone else's colour, on the one surface that shows their thing.
const BRAND_MARKS = {
  'v2/app/vendor/(shell)/your-website/screen.tsx':
    new Set([
      '#4285F4', '#34A853', '#FBBC05', '#EA4335', // the Google wordmark, R-40.129 \u2462
      '#F8F7F5',                                   // the public lane's page ground
    ]),
};
const BRAND_EXPECTED = 7;

let pass = 0, fail = 0;
const ok  = (n, d) => { pass++; console.log(`  \u2713 ${n}${d ? '  \u2014 ' + d : ''}`); };
const bad = (n, d) => { fail++; console.log(`  \u2717 ${n}${d ? '  \u2014 ' + d : ''}`); };

// ── codeOf: comments stripped before any textual assertion (R-40.94) ───────
function codeOf(src) {
  let out = '', i = 0, st = 'code';
  while (i < src.length) {
    if (st === 'code') {
      if (src.startsWith('/*', i)) { st = 'block'; i += 2; continue; }
      if (src.startsWith('//', i)) { while (i < src.length && src[i] !== '\n') i++; continue; }
      out += src[i++];
    } else {
      if (src.startsWith('*/', i)) { st = 'code'; i += 2; continue; }
      if (src[i] === '\n') out += '\n';
      i++;
    }
  }
  return out;
}

// Entities are stripped BEFORE the colour scan, not filtered after: filtering
// after would still have to guess which `#8593` was an arrow.
const ENTITY = /&#\d+;/g;
const LITERAL = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/g;
const WRONG_LANE = /--wine|--vibe|--oxblood|--bride|V2_WINE/;
// R-35.23: the ONE ruled crossing from the couple lane's TOKEN file is a date
// function. This probe watches `lib/frost/tokens` and nothing else, deliberately:
// three other frost modules already cross into the vendor lane — `budgetBands`,
// `photoPager`, `categoryLabels` — and they carry logic, not colour. Widening
// this probe to all of `lib/frost` would mint a finding against three shipped,
// reviewed imports that no ruling touches, under cover of a colour cell. The
// colour file is the one with the lane's ink in it and the one this arc rules on.
const FROST_IMPORT = /from\s+['"]@\/lib\/frost\/tokens['"]/;
const FROST_ALLOWED = /import\s*\{\s*istDayKey\s*\}\s*from\s*['"]@\/lib\/frost\/tokens['"]/;
// A `var(--x, <literal>)` fallback is a phantom waiting to happen: two were found
// (`--atelier-danger`, `--atelier-paper`), both defined nowhere, both painting
// their fallback unconditionally, both invisible because they wore a var().
const PHANTOM = /var\(\s*--[a-z-]+\s*,\s*(#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\()/;

function walk(dir, out) {
  let ents;
  try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of ents) {
    if (e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|css)$/.test(e.name)) out.push(path.relative(ROOT, p));
  }
  return out;
}

const files = SCOPE.flatMap((s) => walk(path.join(ROOT, s), []))
  .filter((f) => !TOKEN_DEFS.has(f))
  .sort();

const leaks = [], brandHits = [], wrongLane = [], laneImports = [], phantoms = [];
for (const f of files) {
  const code = codeOf(fs.readFileSync(path.join(ROOT, f), 'utf8')).replace(ENTITY, '');
  code.split('\n').forEach((line, i) => {
    const ln = i + 1;
    for (const m of line.match(LITERAL) || []) {
      const hex = m.startsWith('#') ? m.toUpperCase() : m;
      const allowed = BRAND_MARKS[f] && BRAND_MARKS[f].has(hex);
      (allowed ? brandHits : leaks).push(`${f}:${ln}  ${m}`);
    }
    if (WRONG_LANE.test(line)) wrongLane.push(`${f}:${ln}  ${line.trim().slice(0, 70)}`);
    if (FROST_IMPORT.test(line) && !FROST_ALLOWED.test(line)) laneImports.push(`${f}:${ln}`);
    if (PHANTOM.test(line)) phantoms.push(`${f}:${ln}  ${line.trim().slice(0, 70)}`);
  });
}

console.log('\n\u2550\u2550 b59 \u00b7 R-40.129 \u2460 \u2014 THE SEVEN-INK CENSUS \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n');
console.log(`\u00a70  scope: ${files.length} files under ${SCOPE.join(', ')}`);
console.log(`    DECLARED GAP: ${DECLARED_GAP}/** is NOT scanned \u2014 Espresso-era routes, counted`);
console.log(`    separately at 98 literals, not cured by this arc, owed their own ruling.\n`);

// ── THE PALETTE, PARSED OFF DISK ───────────────────────────────────────────
// The seven-ink law is a law about VALUES, so the cell needs the values — and
// takes them from v2/lib/worklist/theme.ts on every run rather than holding a copy.
// A copy is what F-40.263 was.
function paletteRgb() {
  const src = fs.readFileSync(path.join(ROOT, 'v2/lib/worklist/theme.ts'), 'utf8');
  const set = new Set(['#000000', '#FFFFFF']); // card-shadow and grain are built on these
  for (const m of src.matchAll(/'(#[0-9a-fA-F]{6})'/g)) set.add(m[1].toUpperCase());
  for (const m of src.matchAll(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g)) {
    set.add('#' + [1, 2, 3].map((i) => (+m[i]).toString(16).padStart(2, '0')).join('').toUpperCase());
  }
  return set;
}
const FAMILY = paletteRgb();
const toHex = (lit) => {
  if (lit.startsWith('#')) {
    const h = lit.slice(1);
    return '#' + (h.length === 3 ? h.split('').map((c) => c + c).join('') : h.slice(0, 6)).toUpperCase();
  }
  const m = lit.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/);
  if (!m) return null;
  return '#' + [1, 2, 3].map((i) => Math.round(+m[i]).toString(16).padStart(2, '0')).join('').toUpperCase();
};

const outOfFamily = [], restated = [];
for (const l of leaks) {
  const lit = l.slice(l.indexOf('  ') + 2);
  const hex = toHex(lit);
  (hex && FAMILY.has(hex) ? restated : outOfFamily).push(l);
}

console.log(`\u00a71  the seven-ink law — no colour outside the palette (${FAMILY.size} values parsed off theme.ts)`);
outOfFamily.length === 0
  ? ok('zero out-of-family colours', 'no ninth red, no terracotta, no brand green on a ground')
  : bad(`${outOfFamily.length} out-of-family colour(s)`, '\n      ' + outOfFamily.slice(0, 25).join('\n      ')
      + (outOfFamily.length > 25 ? `\n      \u2026and ${outOfFamily.length - 25} more` : ''));

// ── §1b · THE RESTATED-TOKEN DEBT, PINNED ──────────────────────────────────
// These are the RIGHT colour written the WRONG way: a literal that happens to
// equal a token's value today and goes stale the hour the token moves. They are
// NOT cured by this arc and the reason is a ruling, not an oversight: almost all
// are `rgba(201,168,76,α)` — gold at an alpha — and the palette has no
// alpha-bearing gold. Minting one is a new token, and no new token ships without
// a ruling. `color-mix()` is NOT the escape: package.json's browserslist declares
// `safari >= 14` / `ios_saf >= 14`, and color-mix needs Safari 16.2. The one
// existing use of it in the estate (v2/app/vendor/(legacy)/onboarding/page.tsx:426)
// is a latent defect against the estate's own floor, filed here and not cured.
//
// So the debt is PINNED rather than passed over. The count cannot grow without
// this cell reddening, which is the difference between a declared gap and a hole.
// CE-42 4c-1 · RE-PINNED 124 -> 114, THE DEBT SHRANK BY TEN (F-42.186, ruling J: "the
// brass literals go when the screen is touched"). v2/app/vendor/(shell)/collab/screen.tsx
// lost its ten gold-at-alpha literals; NO alpha-bearing gold was minted — each became an
// EXISTING token (hairlines -> --atelier-card-border, the active/outline edges ->
// --atelier-input-border), so the ruling above this line still stands for the rest.
// CE-46 FE-4 · RE-PINNED 114 -> 110, THE DEBT SHRANK BY FOUR (A-45.2, by label): the four gold-at-alpha literals
// of components/vendor/TipsCarousel.tsx (:242, :253 twice, :325) left with the file, which the founder's ruling of
// 27 Sept 2026 retired for the "?" on every surface. Derived by set difference of this census's own list at
// dc8dbdd1 against the cut: those four are the only literals gone; every other entry moved line, not value.
// DESIGN-1 · STAGE 1 · RE-PINNED 110 -> 23, THE DEBT SHRANK BY EIGHTY-SEVEN (by label, the Teal Ledger palette). The
// palette moved --role-metal #C9A84C -> #CDB068, so every gold-at-alpha literal, rgba(201,168,76,a), fell out of family
// (84 of them, 85 with the toast's #EDEEEF). Ruling J cured them rather than any widening of this cell: each became an
// EXISTING token read (a hairline -> --atelier-card-border, an outline at alpha 0.3 or more -> --atelier-input-border, a
// tint -> --atelier-row-hover, a word -> --atelier-ink-mute); the toast's ink is Graphite's own #ECEFEF, one in-family
// literal added. No alpha-bearing token was minted. The other 22 moved line, not value.
// FE-5 L2 · RE-PINNED 23 -> 21, THE DEBT SHRANK BY TWO (by label): the founder's option B retired the floating + in the
// new layout, and with it the .wl-fab rule's two rgba shadow literals (WorklistShell.tsx); nothing was widened.
const RESTATED_PINNED = 21;
console.log('\n\u00a71b  the restated-token debt is pinned, not passed over');
restated.length === RESTATED_PINNED
  ? ok(`${RESTATED_PINNED} in-family literals`, 'the ruled debt — awaiting an alpha-bearing token ruling')
  : bad(`${restated.length} in-family literals, pinned at ${RESTATED_PINNED}`,
        restated.length > RESTATED_PINNED
          ? 'A NEW LITERAL ARRIVED. Write the token read instead.'
          : 'the debt shrank — good, but re-pin the number so the ratchet keeps holding');

console.log('\n\u00a72  the brand-mark allowance is exactly what was ruled');
brandHits.length === BRAND_EXPECTED
  ? ok(`${BRAND_EXPECTED} allow-listed hits`, 'four Google wordmark path fills + three preview-frame grounds')
  : bad(`${brandHits.length} allow-listed hits, expected ${BRAND_EXPECTED}`,
        'the allowance widened or the mark moved \u2014 either needs a ruling, not an edit\n      '
        + brandHits.join('\n      '));

console.log('\n\u00a73  the couple lane does not reach the vendor shell');
wrongLane.length === 0 ? ok('no Wine Night identifier')
  : bad(`${wrongLane.length} hit(s)`, '\n      ' + wrongLane.join('\n      '));
laneImports.length === 0 ? ok('no lib/frost/tokens import beyond the ruled istDayKey')
  : bad(`${laneImports.length} import(s)`, laneImports.join(', '));

console.log('\n\u00a74  no var() carries a colour fallback');
phantoms.length === 0
  ? ok('zero phantom fallbacks', 'a fallback hides an undefined token and paints unconditionally')
  : bad(`${phantoms.length} phantom(s)`, '\n      ' + phantoms.join('\n      '));

// ── §5 · MUTATION PROOF, BOTH WAYS ─────────────────────────────────────────
// Each probe is exercised against a synthetic line carrying the defect it is
// supposed to catch. A probe that stays quiet on its own defect is decorative,
// and this section says so rather than letting §1-§4's green stand for it.
console.log('\n\u00a75  mutation proof \u2014 each probe, shown its own defect, must catch it');
const MUT = [
  ['a bare hex',            "color: '#B4453C',",                     (l) => (l.match(LITERAL) || []).length > 0],
  ['an rgba tint',          "background: 'rgba(180,40,40,0.18)',",   (l) => (l.match(LITERAL) || []).length > 0],
  ['a Wine Night token',    'color: var(--wine-ink)',                (l) => WRONG_LANE.test(l)],
  ['a couple-lane token import', "import { V2_WINE_NIGHT } from '@/lib/frost/tokens';", (l) => FROST_IMPORT.test(l) && !FROST_ALLOWED.test(l)],
  ['a phantom fallback',    "color: 'var(--atelier-danger, #B4453C)'", (l) => PHANTOM.test(l)],
  // §1's own probe, shown the nine reds and the terracotta this arc deleted:
  ['#4A1616 is out of family', '#4A1616', (l) => !FAMILY.has(toHex(l))],
  ['#7A3828 is out of family', '#7A3828', (l) => !FAMILY.has(toHex(l))],
  ['#25D366 is out of family', '#25D366', (l) => !FAMILY.has(toHex(l))],
];
for (const [name, line, probe] of MUT) {
  probe(line) ? ok(`catches ${name}`) : bad(`catches ${name}`, 'THE PROBE IS DECORATIVE');
}
// And the inverse: the exclusions must NOT fire on the things they exclude, or
// the cell reddens forever on an arrow and gets deleted by the next seat.
const NEG = [
  ['an HTML entity is not a colour', '<span aria-hidden>&#8593;</span>', (l) => (l.replace(ENTITY, '').match(LITERAL) || []).length === 0],
  ['the ruled istDayKey import passes', "import { istDayKey } from '@/lib/frost/tokens';", (l) => !(FROST_IMPORT.test(l) && !FROST_ALLOWED.test(l))],
  ['a non-colour frost module passes', "import { labelFor } from '@/lib/frost/categoryLabels';", (l) => !FROST_IMPORT.test(l)],
  ['a plain token read passes', "color: 'var(--role-critical)'", (l) => (l.match(LITERAL) || []).length === 0 && !PHANTOM.test(l)],
  // and the inverse of §1: a palette value must NOT be called out of family, or
  // the law would forbid the palette itself.
  // DESIGN-1 (by label): the two probes read Teal Ledger's values, #CDB068 and #A53420 (were #C9A84C and #AE3A22).
  ['--role-metal’s own hex is in family',    '#CDB068', (l) => FAMILY.has(toHex(l))],
  ['--role-critical’s own hex is in family', '#A53420', (l) => FAMILY.has(toHex(l))],
];
for (const [name, line, probe] of NEG) {
  probe(line) ? ok(name) : bad(name, 'the exclusion is wrong \u2014 this cell will red on correct code');
}

console.log(`\n\u2500\u2500 ${fail === 0 ? 'GREEN' : 'RED'} \u2014 b59 seven-ink census  ${pass}/${pass + fail}\n`);
process.exit(fail === 0 ? 0 : 1);
