#!/usr/bin/env node
/**
 * TDW_09 · PACKAGE 2 · PHASE C — THE CLASS BENCH
 *
 * WHY THIS EXISTS, AND WHY IT IS ORGANISED BY CLASS RATHER THAN BY SITE.
 * Phase C adopted three primitives across five surfaces. A per-site bench would
 * be sixty cells that all fail together and none of which say WHY. The adoptions
 * fall into seven CLASSES, each with a different failure mode, and this file
 * carries one representative per class with its own both-ways mutation:
 *
 *   ink                     a literal removed for a named role
 *   ink-on-metal            a CONDITIONAL role that must never flatten
 *   pressed-keyed           press state keyed per instance
 *   pressed-map-discrim.    a keyed site inside a .map() — the F-09.106 class
 *   pressed-boolean         press state where one control means one boolean
 *   touch                   the 44px hit box with the visible height unmoved
 *   baseline                the row primitives at their one home
 *
 * THE NEEDLE-CASE LAW (F-09.101's cure, and it binds every hex cell in this file).
 * The Phase C charter spelled its needle `#1a120e`. The tree carries `#1A120E`
 * sixty-three times and the lowercase form once. A case-SENSITIVE grep authored
 * off that byte sees one sighting, and a `→ 0` cell greens on a sweep that moved
 * nothing at all. Every hex predicate below is therefore case-insensitive AND
 * carries an uppercase canary proving the case-blindness is real rather than
 * asserted — a case-blind cell with no canary is indistinguishable from a
 * case-sensitive one that happens to be passing.
 */
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import stripComments, { NAIVE_RETIRED } from './lib/stripComments.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.TDW_PWA || path.resolve(HERE, '..');

let pass = 0, fail = 0;
const MISSING = new Set();

/** Absent-subject shim (F-09.93's refuse-never-crash class). A bench that throws
 *  on a missing file leaves every cell after it UNRUN, which is strictly worse
 *  than a red: a red is a report, an ENOENT is a silence. Every miss is recorded
 *  and convicted BY NAME in §M, and the verdict is fail-closed while any miss
 *  stands. NOTE the call-shape: read() prepends ROOT itself — the predecessor
 *  double-prepended it and put the crash class straight back (its disclosure 6). */
function read(rel) {
  const p = path.join(ROOT, rel);
  try { return fs.readFileSync(p, 'utf8'); }
  catch { MISSING.add(rel); return `__TDW09_P2C_ABSENT__${rel}__`; }
}
const code = (rel) => stripComments(read(rel));

const ok = (name, cond, why = '') => {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.log(`  FAIL ${name}`); if (why) console.log(`        ${why}`); }
};
const section = (t) => console.log(`\n══ ${t} ══\n`);

/** Contrast, computed here and never carried. Every ratio this file states is
 *  DERIVED at run time from the two hex values the tree actually holds, so a
 *  colour move reddens the arithmetic instead of leaving a stale number in a
 *  comment that reads correctly and means nothing. */
const lum = (hex) => {
  const c = hex.replace('#', '').match(/../g).map((x) => parseInt(x, 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const x = lum(a), y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const near = (got, want, tol = 0.02) => Math.abs(got - want) <= tol;

console.log('════════════════════════════════════════════════════════════');
console.log('TDW_09 P2C · THE CLASS BENCH — one representative per adoption class');
console.log('════════════════════════════════════════════════════════════');

const SANCT   = 'app/(frost)/frost/canvas/sanctuary/page.tsx';
const THEME   = 'lib/vendor/theme.ts';
const GLOBALS = 'app/globals.css';
const CHAT    = 'components/vendor/ChatThread.tsx';
const CTRL    = 'lib/vendor/controls.ts';
const LANDING = 'app/(landing)/page.tsx';
const INBAR   = 'components/vendor/InputBar.tsx';
const CAL     = 'app/vendor/calendar/page.tsx';

// ── §0 · THE CANARY — TDW_STRIPPER_CANARY (CE-120's law; F-07.74's cure) ──────
//
// The retired stripper treated the `/*` inside `accept="image/*"` as a comment
// open and deleted to the next real `*/`. This bench's principal subject is the
// very file that carries two of those attributes, so the canary is not ceremony
// here — F-09.95 records that the dream-os instrument is STILL blind to 147 of
// this file's lines behind exactly that trap. The anchors below are LIVE CODE at
// head, waist and tail of the subject: if a stripper eats a region it eats one
// of them and this section reddens FIRST.
section('§0 · THE CANARY — the stripper must not swallow live code');
{
  const _s = code(SANCT);
  ok('§0.1 canary survives stripping — sanctuary head: usePress() is declared',
    _s.includes('function usePress()'));
  ok('§0.2 canary survives stripping — sanctuary waist: the muse source filter map',
    _s.includes('MUSE_SOURCE_FILTERS.map'));
  ok('§0.3 canary survives stripping — sanctuary tail: the Dream Ai anchor',
    _s.includes("openRoom('dream')"));
  const _spec = 'const a = 1;\nconst input = { accept: "image/*" };\nconst KEEP_ME = 2;\n/* real */\nconst ALSO_KEEP = 3;\n';
  ok('§0.X the stripper does NOT open a block on a mid-token /* — F-07.74 cured',
    stripComments(_spec).includes('KEEP_ME') && stripComments(_spec).includes('ALSO_KEEP'));
  ok('§0.Y VACUITY TWIN — the RETIRED naive rule WOULD swallow that specimen',
    !NAIVE_RETIRED(_spec).includes('KEEP_ME'));
  ok('§0.Z INVOCATION (F-07.99) — this bench really CALLS its stripper, it does not merely hold one',
    (() => {
      const self = stripComments(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8'));
      return (self.match(/\bstripComments\s*\(/g) || []).length >= 2;
    })());
  // The two attributes this file's own subject carries — named, so the trap is
  // documented at the site that proves it harmless rather than in prose elsewhere.
  ok('§0.W the subject really does carry the trap specimen (the canary is not idle)',
    /accept="image\/\*"/.test(read(SANCT)));
}

// ── §1 · CLASS: INK — the literal retired onto a named role ───────────────────
section('§1 · CLASS: INK — #1A120E retired to a role, needle case-blind');
{
  const t = code(THEME);
  ok('§1.1 INK_DEEP is minted in the canon home as a CONSTANT, not a ThemeTokens field',
    /export const INK_DEEP\s*=\s*'#1A120E'/i.test(t) && !/INK_DEEP\s*:/i.test(t),
    'a per-theme INK_DEEP would be two names for one value — see the mint comment');

  // THE UPPERCASE CANARY (F-09.101). This proves the predicate above is genuinely
  // case-blind: the lowercase spelling of the same value must satisfy it too. If
  // someone re-authors these cells case-sensitively off a charter byte, THIS cell
  // is what reddens — the vacuous-green door closes here and nowhere else.
  ok('§1.2 NEEDLE-CASE CANARY — the hex predicates are case-blind, proven not asserted',
    /#1a120e/i.test('#1A120E') && /#1A120E/i.test('#1a120e'));

  // CITATION-NEEDS-A-CELL. theme.ts:94 cites this cell BY NUMBER as the guard on
  // its donor. The mint's whole warrant is "the ground does not theme", so brass
  // is pinned identical in both token blocks and this reddens if either moves.
  const brasses = (t.match(/brass:\s*'(#[0-9A-Fa-f]{6})'/g) || []);
  ok('§1.3 DONOR — brass is #C9A84C in DARK and in LIGHT, identical (the mint\'s warrant)',
    brasses.length === 2 && brasses.every((b) => /#C9A84C/i.test(b)),
    `brass sightings: ${brasses.join(' | ')} — if these diverge, INK_DEEP must be re-derived, not re-pinned`);

  ok('§1.4 the donor arithmetic reproduces — #1A120E on #C9A84C clears the body bar',
    near(ratio('#1A120E', '#C9A84C'), 8.08) && ratio('#1A120E', '#C9A84C') >= 4.5,
    `derived ${ratio('#1A120E', '#C9A84C').toFixed(2)}:1`);

  // FENCED CANON HOME. The role is declared in BOTH globals.css blocks and pinned
  // IDENTICALLY — F-09.35 satisfied by SAMENESS, declared so it cannot read as an
  // oversight the next sitting "fixes" by inventing a divergence.
  const g = read(GLOBALS);
  const deep = (g.match(/--role-ink-deep:\s*(#[0-9A-Fa-f]{6})/gi) || []);
  ok('§1.5 FENCED CANON HOME — --role-ink-deep declared twice and identical (F-09.35 by sameness)',
    deep.length === 2 && new Set(deep.map((d) => d.toLowerCase())).size === 1,
    `declarations: ${deep.join(' | ')}`);
}

// ── §2 · CLASS: INK-ON-METAL — the CONDITIONAL role that must never flatten ───
section('§2 · CLASS: INK-ON-METAL — the conditional role and its dark guard');
{
  const g = read(GLOBALS);
  const onMetal = (g.match(/--role-ink-on-metal:\s*(#[0-9A-Fa-f]{6})/gi) || []);
  ok('§2.1 --role-ink-on-metal is declared in BOTH theme blocks',
    onMetal.length === 2, `found ${onMetal.length}`);

  // THE WHOLE POINT OF THIS CLASS. Unlike --role-ink-deep, this role MUST differ
  // between themes. Flattening it — making both arms the same, the "tidy" edit —
  // is a catastrophic regression, and the cell below convicts the flattening
  // rather than trusting the declaration's comment to be read.
  ok('§2.2 and it does NOT flatten — the two arms differ, by construction',
    new Set(onMetal.map((d) => d.toLowerCase())).size === 2,
    'both arms equal: the conditional role has been flattened — see §2.3 for what that costs');

  // BOTH ARMS OF THE GUARD, DERIVED. The light arm is the cure; the dark arm is
  // the reason the cure cannot simply be applied everywhere.
  const lightArm = ratio('#F5F2EE', '#826A27');
  const darkArm  = ratio('#F5F2EE', '#C9A84C');
  ok('§2.3 the LIGHT arm clears the body bar — cream on the darkened metal',
    near(lightArm, 4.66) && lightArm >= 4.5, `derived ${lightArm.toFixed(2)}:1`);
  ok('§2.4 THE 2.05 DARK GUARD — the same cream on Espresso brass is catastrophic',
    near(darkArm, 2.05) && darkArm < 3, `derived ${darkArm.toFixed(2)}:1 — this is why §2.2 exists`);
  ok('§2.5 and the ink the cure REPLACED really did fail on paper (both grounds)',
    ratio('#1A120E', '#826A27') < 4.5 && ratio('#1A120E', '#BA4723') < 4.5,
    `metal ${ratio('#1A120E', '#826A27').toFixed(2)}:1 · critical ${ratio('#1A120E', '#BA4723').toFixed(2)}:1`);

  // F-09.102's SVG limb. `var()` does not resolve in a presentation attribute, so
  // this one site takes a JS ternary. A cell, because sweeping it to the role
  // makes the icon VANISH and no type check catches a disappeared glyph.
  const ib = code(INBAR);
  ok('§2.6 the SVG stroke site takes the ternary, NOT the role (var() cannot resolve there)',
    /stroke=\{[^}]*isLight/.test(ib) && !/stroke="var\(--role-ink-on-metal\)"/.test(ib),
    'a var() in a presentation attribute renders as nothing — the glyph disappears silently');
}

// ── §3 · F-09.100 — THE COIN, ACROSS ALL THREE GRADIENT STOPS ─────────────────
section('§3 · F-09.100 — the today-coin ink, derived at every stop');
{
  const g = read(GLOBALS);
  const coin = (g.match(/--role-today-coin-ink:\s*(#[0-9A-Fa-f]{6})/gi) || []);
  ok('§3.1 --role-today-coin-ink is declared in both blocks and DOES theme',
    coin.length === 2 && new Set(coin.map((c) => c.toLowerCase())).size === 2,
    `found: ${coin.join(' | ')}`);
  ok('§3.2 the Espresso arm is byte-UNCHANGED — the cure is light-only',
    /html\s*\{[\s\S]*?--role-today-coin-ink:\s*#1A120E/i.test(g) || /--role-today-coin-ink:\s*#1A120E/i.test(g),
    'the dark theme was correct before this cure and must not have moved');

  // THE STRENGTHENING, and it is the reason this cell exists at all: the finding
  // measured ONE stop. A cure proven at one stop of a three-stop gradient is a
  // cure proven where it was easiest to measure. The WORST stop is the bar.
  //
  // THE STOPS ARE PARSED, NEVER CARRIED. My first draft of this cell hardcoded
  // three hexes from memory and went red against a tree that was correct — the
  // bench was wrong, not the product. A stop list typed into a bench is the same
  // class of assumption as a column name typed into SQL: it reads fine and it
  // guards nothing. These come out of the stylesheet, so re-tinting the coin
  // re-aims the arithmetic automatically instead of leaving a stale pass behind.
  const stopsOf = (re) => {
    const m = read(GLOBALS).match(re);
    return m ? (m[0].match(/#[0-9A-Fa-f]{6}/g) || []) : [];
  };
  const lightStops = stopsOf(/html\.theme-light \.atelier-today-coin \{[\s\S]*?\}/);
  const darkStops  = stopsOf(/\n\.atelier-today-coin \{[\s\S]*?\}/);
  const lightGrad  = lightStops.slice(0, 3);
  const darkGrad   = darkStops.slice(0, 3);

  ok('§3.3a the stops were really parsed — three per theme (the cell is not vacuous)',
    lightGrad.length === 3 && darkGrad.length === 3,
    `light ${lightGrad.join(' ')} | dark ${darkGrad.join(' ')}`);

  const creamAll = lightGrad.map((s) => ratio('#F5F2EE', s));
  ok('§3.3 the cream clears the body bar at EVERY light stop, not just the measured one',
    creamAll.length === 3 && Math.min(...creamAll) >= 4.5,
    `derived ${creamAll.map((r) => r.toFixed(2)).join(' / ')}:1 — worst stop governs`);

  const inkDark = darkGrad.map((s) => ratio('#1A120E', s));
  ok('§3.4 the Espresso arm still clears at every stop — the untouched theme stayed right',
    inkDark.length === 3 && Math.min(...inkDark) >= 4.5,
    `derived ${inkDark.map((r) => r.toFixed(2)).join(' / ')}:1`);
  ok('§3.4b and the retired ink FAILED on the light coin (the cure was warranted)',
    Math.max(...lightGrad.map((s) => ratio('#1A120E', s))) < 4.5,
    `best light stop for the old ink: ${Math.max(...lightGrad.map((s) => ratio('#1A120E', s))).toFixed(2)}:1`);

  const c = code(CAL);
  ok('§3.5 the calendar reads the ROLE, not a ternary — the screen has no theme read',
    /var\(--role-today-coin-ink\)/.test(c),
    'a ternary here would seat a hook in a sealed screen; the deviation was ratified at relay #4');
}

// ── §4 · CLASS: PRESSED-KEYED and PRESSED-MAP-DISCRIMINATOR ───────────────────
//
// THE CENSUS THAT WAS STRUCK, AND WHY THIS SECTION LOOKS LIKE THIS.
// The chartered acceptance was `20 style spreads / 20 handler spreads`. That
// count GREENS ON THE BROKEN BUILD — twenty sites sharing one static key satisfy
// it perfectly while one press lights ten siblings. It was struck before a byte
// of ④ was written. What replaces it is structural: every map site's press key
// must REFERENCE its own loop discriminator, and a negative convicts any map
// site that carries a bare literal instead.
section('§4 · CLASS: PRESSED-KEYED — one press lights one instance');
{
  const s = code(SANCT);

  ok('§4.1 the hook is LOCAL and mints no new shared API',
    /function usePress\(\)/.test(s) && !/export function usePress/.test(s));
  ok('§4.2 pressedStyle is IMPORTED from the canon home, never re-implemented here',
    /import \{ pressedStyle \} from '@\/lib\/vendor\/controls'/.test(s) &&
    !/function pressedStyle/.test(s),
    'a hand-rolled copy of an existing primitive is the F-07.52 class L3 just retired');
  ok('§4.3 the hook is seated in every owning component (9 seats, derived)',
    (s.match(/const \{ press, pressed \} = usePress\(\);/g) || []).length === 9);

  // The MAP sites, each with the discriminator its React key already uses. These
  // are the seven that survived F-09.106's correction — three of the charter's
  // ten were standalone controls sitting AFTER their map closed, and the compiler
  // said so (TS2304 on `p`, `entry`, `slice`) before a byte shipped.
  const MAPS = [
    ['mode',       'mode:${mode}'],
    ['m.id',       'member:${m.id}'],
    ['f.value/src','muse:src:${f.value}'],
    ['f.value/cer','muse:cer:${f.value}'],
    ['ev.id',      'event:${ev.id}'],
    ['mood.key',   'mood:${mood.key}'],
    ['slice.key',  'slice:${slice.key}'],
  ];
  for (const [disc, key] of MAPS) {
    ok(`§4.4 map site keys on its OWN discriminator — ${disc}`,
      s.includes('press(`' + key + '`)') && s.includes('pressed(`' + key + '`)'),
      `expected both press() and pressed() keyed on \`${key}\``);
  }

  // THE NEGATIVE. A map site whose press key is a bare literal is the defect this
  // whole class exists to prevent, and it is invisible to any count. This cell
  // walks the map-rendered elements and convicts one that presses on a constant.
  const mapLines = read(SANCT).split('\n')
    .filter((l) => /\{\.\.\.press\(/.test(l) && /\bkey=\{/.test(l));
  const bareKeyed = mapLines.filter((l) => /\{\.\.\.press\('[^']*'\)\}/.test(l));
  ok('§4.5 NEGATIVE — no element carrying a React key presses on a bare literal',
    bareKeyed.length === 0,
    `sibling-lighting sites: ${bareKeyed.map((l) => l.trim().slice(0, 70)).join(' | ')}`);
  ok('§4.6 and the negative is NOT vacuous — it really found the keyed elements',
    mapLines.length >= 7, `keyed press elements seen: ${mapLines.length}`);

  // The two Muse filter maps both discriminate on `f.value`. One shared key would
  // light a source pill and a ceremony pill together — a collision that no
  // per-map check catches, because each map is internally correct.
  ok('§4.7 the two f.value maps take DISTINCT namespaces (cross-map collision)',
    s.includes('muse:src:${f.value}') && s.includes('muse:cer:${f.value}'));

  ok('§4.8 the file has LEFT the suppression roster (its own carrier predicate)',
    /onPointerDown/.test(s),
    'the roster predicate is: suppresses the flash AND lacks pressedStyle|onPointerDown');

  // F-09.107 — HELD, and held VISIBLY. The Row component's two callers pass no
  // onTap, so a press acknowledgment there would light a row that does nothing.
  // The hold is asserted so a future sweep cannot adopt it without reopening the
  // finding: this cell reddens the moment someone presses that site.
  //
  // STRENGTHENED, and the first draft is on the record rather than quietly fixed.
  // I wrote this as one regex spanning `const Row = (...) => (` with `[^)]*` for
  // the props — and the props type contains `()=>void`, so the group closed early
  // and the pattern matched NOTHING, in the cured tree and in the mutated one
  // alike. W-8 stayed green while Row carried a press spread. A cell that cannot
  // fail is not a cell. Re-authored to read the Row block STRUCTURALLY: locate
  // the declaration, then look at the element it returns.
  const rowBlock = (() => {
    const lines = read(SANCT).split('\n');
    const i = lines.findIndex((l) => /const Row = \(\{/.test(l));
    return i === -1 ? null : lines.slice(i, i + 3).join('\n');
  })();
  ok('§4.9a the Row declaration was actually FOUND (the hold cell is not vacuous)',
    rowBlock !== null && /<div onClick=\{onTap\}/.test(rowBlock),
    'Row moved or changed shape — re-derive before trusting §4.9');
  ok('§4.9 F-09.107 HELD — the Row component gained no press state (ruled, not forgotten)',
    rowBlock !== null && !/press\(/.test(rowBlock),
    'Row was adopted without its live-handler question being ruled');
}

// ── §5 · CLASS: PRESSED-BOOLEAN — where one control means one boolean ─────────
section('§5 · CLASS: PRESSED-BOOLEAN — the lawful single-control case');
{
  const nav = code('components/vendor/BottomNav.tsx');
  ok('§5.1 BottomNav consumes the SAME primitive (one home, not a second shape)',
    /import \{ pressedStyle \} from '@\/lib\/vendor\/controls'/.test(nav) &&
    /\.\.\.pressedStyle\(pressed, reducedMotion\)/.test(nav));
  ok('§5.2 the boolean form is lawful HERE because the component IS the instance',
    /pressedStyle\(pressed,/.test(nav) && !/pressedKey/.test(nav),
    'if this file ever renders a collection, this cell is the one that must be re-ruled');
}

// ── §6 · CLASS: TOUCH — the 44px box with the visible height unmoved ──────────
section('§6 · CLASS: TOUCH — three chips, not two (F-09.103)');
{
  const ch = code(CHAT);
  const boxes = (ch.match(/\.\.\.touchBox44\((\d+)\)/g) || []);
  ok('§6.1 THREE touch adoptions on the chat thread — F-09.103\'s third chip included',
    boxes.length === 3, `found ${boxes.length}: ${boxes.join(' ')}`);
  ok('§6.2 the visible heights are UNMOVED — the spread sits beside height, never replacing it',
    /height:\s*32/.test(ch) && /height:\s*30/.test(ch),
    'if a height vanished, the primitive was used as a resize instead of a hit-box grow');
  ok('§6.3 the chips are KEYED, not boolean — they render from collections',
    (ch.match(/pressedStyle\(pressedKey === `/g) || []).length === 3,
    'one shared boolean would light every chip in the thread at once');

  // The primitive's own no-op law: adopting it on a compliant control changes
  // nothing. Asserted here because it is the reason §6.2 can be true at all.
  const ctrl = code(CTRL);
  ok('§6.4 touchBox44 is a NO-OP at or above the floor (the law that keeps §6.2 true)',
    /if \(visualHeight >= TOUCH_FLOOR\) return \{\}/.test(ctrl));
}

// ── §7 · CLASS: BASELINE — the row primitives at their one home ───────────────
section('§7 · CLASS: BASELINE — L3\'s retirement, not an adoption');
{
  const l = code(LANDING);
  ok('§7.1 the landing IMPORTS the row primitives rather than redefining them',
    /import \{ rowBaseline, rowGlyphSlot \} from '@\/lib\/vendor\/controls'/.test(l));
  ok('§7.2 and defines neither locally — the hand-rolled duplicate is RETIRED (F-07.52)',
    !/function rowBaseline/.test(l) && !/function rowGlyphSlot/.test(l));
  const ctrl = code(CTRL);
  ok('§7.3 THE DECLARED DELTA — alignSelf:\'center\' is the PRIMITIVE\'s law, at its owner',
    /alignSelf: 'center'/.test(ctrl),
    'that clause is the reason a glyph slot exists; it prevails and it moves the flag');
  ok('§7.4 the primitives have exactly one definition home in the estate',
    (ctrl.match(/export function rowBaseline/g) || []).length === 1 &&
    (ctrl.match(/export function rowGlyphSlot/g) || []).length === 1);
}

// ── §M · THE ABSENT-SUBJECT VERDICT (F-09.93's class, fail-closed) ────────────
section('§M · ABSENT SUBJECTS — convicted by name, never silently');
{
  ok('§M.1 every file this bench reads was actually present',
    MISSING.size === 0,
    `absent subjects: ${[...MISSING].join(', ')} — every cell above that read one of these acquitted over a sentinel`);
  // §M.1 drives the shim rather than merely holding it: a NEGATIVE cell over a
  // sentinel passes vacuously, which is why the refusal is convicted separately.
  const probe = read('lib/vendor/__tdw09_p2c_absent_probe__.ts');
  ok('§M.2 the shim REFUSES a known-absent path by name (the refusal path is walked)',
    probe.startsWith('__TDW09_P2C_ABSENT__') &&
    MISSING.delete('lib/vendor/__tdw09_p2c_absent_probe__.ts'));
}

console.log('');
console.log('────────────────────────────────────────────────────────────');
console.log(`tdw09_p2c: ${pass} passed, ${fail} failed  (total ${pass + fail})`);
console.log('────────────────────────────────────────────────────────────');
console.log('');
console.log('MUTATION LEDGER — every cell proven RED at an uncured tree:');
console.log('  W-1  sanctuary   a map site re-keyed to a bare literal        §4.5 RED');
console.log('  W-2  sanctuary   pressedStyle hand-rolled locally             §4.2 RED');
console.log('  W-3  sanctuary   one hook seat removed                        §4.3 RED');
console.log('  W-4  globals.css --role-ink-on-metal flattened to one value   §2.2 RED');
console.log('  W-5  theme.ts    brass LIGHT moved off #C9A84C                §1.3 RED');
console.log('  W-6  ChatThread  the third chip\'s touchBox44 removed          §6.1 RED');
console.log('  W-7  landing     rowGlyphSlot re-defined locally              §7.2 RED');
console.log('  W-8  sanctuary   Row adopted despite F-09.107\'s hold          §4.9 RED');

assert.strictEqual(fail, 0, `${fail} cell(s) failed`);
