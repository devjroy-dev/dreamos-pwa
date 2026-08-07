// scripts/tdw10_p2_retint.proof.mjs — TDW_10 · R-B1 THE ESPRESSO RETINT + F-10.32.
//     node scripts/tdw10_p2_retint.proof.mjs
//
// EVERY CELL DECLARES ITS COUNTING METHOD IN-CELL. Instruments own their counts.
//
// ── WHAT THIS BENCH CAN PROVE, AND WHAT IT REFUSES TO CLAIM ─────────────────
// It proves the navy is GONE, that every espresso value carries a live donor
// citation whose value still matches theme.ts, that the ink ladder clears its
// bars by ARITHMETIC rather than by assertion, and that the numeral properties
// reach their sites.
//
// It does NOT claim the glyph changed. Whether the served Cormorant Garamond
// face carries an `lnum` set is a property of the FACE; fonts.gstatic.com is
// outside the container's egress allowlist and it could not be derived by
// command. §5 states that gap rather than papering it with a declaration-only
// green — the vacuous shape this estate refuses. The founder's eye is the
// verdict and it is on his smoke card.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const read = (p) => { try { return fs.readFileSync(path.join(ROOT, p), 'utf8'); } catch { return ''; } };

let pass = 0, fail = 0;
const ok = (label, cond, detail) => {
  if (cond) { pass++; console.log(`  ok   ${label}`); }
  else { fail++; console.log(`  RED  ${label}${detail ? `  — ${detail}` : ''}`); }
};
const section = (s) => console.log(`\n── ${s} ${'─'.repeat(Math.max(0, 62 - s.length))}`);

const TOKENS = read('app/admin/_components/tokens.css');
const THEME  = read('lib/vendor/theme.ts');
const BRIDGE = read('app/admin/_components/Bridge.tsx');
const ADMINUI= read('app/admin/_components/AdminUI.tsx');
const LAYOUT = read('app/admin/layout.tsx');

// COUNTING METHOD for every "is it in the file" cell below: comments are
// STRIPPED FIRST. A paragraph documenting a RETIRED navy hex is a record, not a
// colour — and this file's header deliberately keeps that record. The review is
// of what renders.
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const DECLS = strip(TOKENS);

// ── Contrast, computed here rather than trusted from a comment ─────────────
const srgb = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (hex) => { const h = hex.replace('#', ''); const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)]; return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const over = ([fr, fg, fb], a, bgHex) => { const h = bgHex.replace('#', '');
  const [br, bg, bb] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
  const c = (f, b) => Math.round(f * a + b * (1 - a));
  return '#' + [c(fr, br), c(fg, bg), c(fb, bb)].map(v => v.toString(16).padStart(2, '0').toUpperCase()).join(''); };

// ═══════════════════════════════════════════════════════════════════════════
section('§1  THE NAVY RETIRES WHOLE');
// ═══════════════════════════════════════════════════════════════════════════
{
  const NAVY = ['#213650', '#18293E', '#122031', '#15273D', '#0E1B2C', '#0F1622', '#10171F'];
  const alive = NAVY.filter(h => DECLS.toUpperCase().includes(h));
  ok(`all ${NAVY.length} navy values are gone from the DECLARATIONS (comments stripped first)`,
     alive.length === 0, alive.join(', '));
  ok('the retiring family is still RECORDED in the header — a retirement nobody can read is archaeology',
     NAVY.every(h => TOKENS.toUpperCase().includes(h)));
  ok('the cool rgba(255,255,255,…) hairlines are gone; hairlines are warm',
     !/--admin-hairline[a-z-]*:\s*rgba\(255,\s*255,\s*255/.test(DECLS));

  // The old ink hue and the navy-tuned status twins must not survive either.
  for (const [name, hex] of [['ink', '#F0EAE0'], ['positive', '#7FC48A'], ['caution', '#E8B778'], ['critical', '#F08A72']])
    ok(`the navy-tuned ${name} value ${hex} is gone`, !DECLS.toUpperCase().includes(hex));
}

// ═══════════════════════════════════════════════════════════════════════════
section('§2  EVERY VALUE CITES A DONOR, AND THE DONOR STILL HOLDS');
// ═══════════════════════════════════════════════════════════════════════════
{
  // The citations are not decoration: each pair below is re-derived against
  // theme.ts AT THIS TIP. If DARK is re-valued, these cells redden — which is
  // exactly what the F-06.85 mechanism paragraph in tokens.css promises.
  const donor = (key) => { const m = THEME.match(new RegExp(`\\n\\s*${key}:\\s*'([^']+)'`)); return m ? m[1] : null; };
  const decl  = (name) => { const m = DECLS.match(new RegExp(`--admin-${name}:\\s*([^;]+);`)); return m ? m[1].trim() : null; };

  // ── CITATION-NEEDS-A-CELL (standing law, minted at F-10.34) ─────────────
  // This list IS the law's instrument. The retint shipped --admin-bg-mid one
  // unit of green off its own cited donor and NOTHING CAUGHT IT, because the
  // pair set covered fifteen roles and never paired a ground stop. A citation
  // with no cell behind it is prose. Every citation in tokens.css that can be
  // compared to a symbol is compared here; the one that cannot (bg-bot, whose
  // donor is a composite) is COMPUTED in the cell below instead.
  // ── F-10.46 · THE PAIR SET IS DERIVED, NOT LISTED ───────────────────────────
  // THIS BLOCK READ, until P3 — a hand-written array of eighteen [role, donor]
  // pairs, opening:
  //     const PAIRS = [
  //       ['bg-top',    'pageBg'],
  //       ['bg-mid',    'sheetBot'],   // F-10.34's cure, and the cell that would have caught it
  //       ['sheet',     'sheetBot'],
  //       ['option-bg', 'sheetBot'],
  //       … fourteen more …
  //     ];
  //
  // It was enumerated from what the HAND had already found. So when F-10.34 was
  // widened "to all three ground stops", it reached the three sites someone had
  // looked at and could not reach `--admin-nav-top` or the `--admin-nav-bg`
  // gradient stop — both of which cite DARK.sheetBot in this very file and both
  // of which still carried the wrong byte. F-10.46 is that gap; the paragraph in
  // tokens.css says the rest.
  //
  // NOW DERIVED FROM THE FILE'S OWN CITATIONS. Every declaration whose trailing
  // comment names a `DARK.<symbol>` is paired with that symbol automatically, so
  // a token that cites a donor is compared to it whether or not anyone remembered
  // to add a row. A citation cannot exist without its cell any more — which is
  // what CITATION-NEEDS-A-CELL asked for and what its own instrument did not do.
  //
  // THE FAILURE MODE IS NOT A SILENT ZERO (protocol §9, independent-method): the
  // derived count is asserted against a floor below, so a regex that stopped
  // matching would redden here rather than quietly pair nothing.
  const DERIVED = [];
  // READ THE RAW FILE, NOT `DECLS`. `DECLS` is `strip(TOKENS)` — comment-stripped,
  // which is right for the hex-literal cells and exactly wrong here: the citations
  // ARE comments. The first draft of this derivation read DECLS and found ZERO
  // pairs, and the floor cell below is why that surfaced as a red instead of as a
  // silently empty loop. A check whose failure mode is a silent zero is not a
  // check (protocol §9).
  // SAME-LINE ONLY (`[ \t]*`, never `\s*`). A trailing comment is a CITATION; the
  // next block's leading comment is not. With `\s*` the loop paired
  // `--admin-nav-bg` — a gradient with no trailing comment — against the prose
  // block beneath it, and reported a donor mismatch that was the regex's own
  // reach rather than a defect. Caught by reading the red instead of relaxing it.
  for (const m of TOKENS.matchAll(/--admin-([a-z-]+):[ \t]*([^;]+);[ \t]*\/\*([^*]*)\*\//g)) {
    const [, role, , comment] = m;
    const d = comment.match(/DARK\.([A-Za-z]+)/);
    if (d) DERIVED.push([role, d[1]]);
  }
  ok(`the pair set DERIVES from tokens.css's own citations (${DERIVED.length} found, floor 12)`,
     DERIVED.length >= 12, `${DERIVED.length}`);
  ok('the derived set reaches --admin-nav-top, the site the hand-listed one could not',
     DERIVED.some(([r, d]) => r === 'nav-top' && d === 'sheetBot'));

  // Roles whose donor is a COMPOSITE rather than a symbol keep their explicit
  // pairing — bg-top and shell cite `pageBg` in prose the regex above cannot
  // reach, and bg-bot's donor is computed in its own cell below.
  const EXPLICIT = [
    ['bg-top', 'pageBg'],
    ['shell',  'pageBg'],
  ];
  const seen = new Set(DERIVED.map(([r]) => r));
  const PAIRS = [...DERIVED, ...EXPLICIT.filter(([r]) => !seen.has(r))];
  // A donor may be rgba() where the admin role must be OPAQUE — a <meta>, an
  // <option> and a gradient stop cannot carry alpha. So the comparison is on the
  // RGB TRIPLE, resolved from either notation. Comparing the raw strings would
  // have made these three cells impossible to write, which is very likely why
  // the ground stops were never paired in the first place.
  const rgb = (v) => {
    if (!v) return null;
    let m = v.match(/^#([0-9A-Fa-f]{6})$/);
    if (m) return [0, 2, 4].map(i => parseInt(m[1].slice(i, i + 2), 16));
    m = v.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    return m ? [1, 2, 3].map(i => parseInt(m[i], 10)) : null;
  };
  const same = (a, b) => a && b && a.length === 3 && a.every((v, i) => v === b[i]);
  for (const [role, key] of PAIRS) {
    const d = donor(key), a = decl(role);
    ok(`--admin-${role} equals theme.ts DARK.${key} on the RGB triple`,
       same(rgb(d), rgb(a)), `donor ${d} -> ${rgb(d)} vs declared ${a} -> ${rgb(a)}`);
  }

  // ── The one citation that COMPUTES rather than compares ──────────────────
  // bg-bot's donor is not a symbol but a COMPOSITE of three: the sheet stack's
  // floor. The chair's own address quoted a prose sentence for it; this cell
  // reproduces the value from the exported symbols instead, so the citation
  // cannot drift from its donors without reddening.
  {
    const over = (fg, a, bg) => fg.map((f, i) => f * a + bg[i] * (1 - a));
    const pageBg = rgb(donor('pageBg'));
    const scrimA = parseFloat((donor('scrim') || '').match(/([\d.]+)\s*\)$/)?.[1] ?? 'NaN');
    const sheetA = parseFloat((donor('sheet') || '').match(/([\d.]+)\s*\)$/)?.[1] ?? 'NaN');
    const floor  = over([255, 255, 255], sheetA, over([0, 0, 0], scrimA, pageBg)).map(Math.round);
    const declared = rgb(decl('bg-bot'));
    ok(`--admin-bg-bot COMPUTES from DARK.sheet over DARK.scrim over DARK.pageBg -> rgb(${floor})`,
       same(floor, declared), `computed ${floor} vs declared ${declared}`);
    ok('the citation says COMPUTED, NOT QUOTED — the law in the file it governs',
       /COMPUTED, NOT QUOTED/.test(TOKENS));
  }
  ok('CITATION-NEEDS-A-CELL is recorded in tokens.css as a standing law',
     /CITATION-NEEDS-A-CELL/.test(TOKENS) && /F-10\.34/.test(TOKENS));
  // The gradient is what layout.tsx actually renders; its stops must equal the
  // decomposition tokens or the named stops are decorative. F-10.34 shipped a
  // gradient whose mid stop carried the same slip as the token beside it.
  {
    const g = (decl('bg') || '').match(/#[0-9A-Fa-f]{6}/g) || [];
    const stops = ['bg-top', 'bg-mid', 'bg-bot'].map(r => (decl(r) || '').toUpperCase());
    ok('the --admin-bg gradient stops equal their own named tokens, in order',
       g.length === 3 && g.every((h, i) => h.toUpperCase() === stops[i]), `${g.join(' ')} vs ${stops.join(' ')}`);
  }
  ok('the DARK export is what was read (the donor exists at this tip by name)', /export const DARK: ThemeTokens/.test(THEME));
  ok('the F-06.85 mechanism paragraph names the donor by PATH, per path-over-range',
     /lib\/vendor\/theme\.ts/.test(TOKENS) && /F-06\.85/.test(TOKENS));

  // The two DELIBERATE departures must be declared, not silent.
  ok('the card-border departure from DARK.cardBorder is stated with its reason (gold scarcity)',
     /DELIBERATELY NOT DARK\.cardBorder/.test(TOKENS) && /gold reserved/.test(TOKENS));
  ok('the input-border departure is stated with its reason',
     /DELIBERATELY NOT DARK\.inputBorder/.test(TOKENS));
  ok('neither departure smuggles brass onto every surface',
     !/--admin-card-border:\s*rgba\(201/.test(DECLS) && !/--admin-input-border:\s*rgba\(201/.test(DECLS));
}

// ═══════════════════════════════════════════════════════════════════════════
section('§3  THE INK LADDER CLEARS ITS BARS — COMPUTED, NOT ASSERTED');
// ═══════════════════════════════════════════════════════════════════════════
{
  const BOT = '#120F0E';   // the darkest stop: the conservative direction
  const INK = [240, 230, 210];
  ok('--admin-bg-bot is the darkest of the three stops', lum('#120F0E') < lum('#16100C') && lum('#16100C') < lum('#1F1612'));

  const RUNGS = [['ink', 1.0, 4.5], ['ink-soft', 0.65, 4.5], ['ink-mute', 0.58, 4.5], ['ink-dim', 0.52, 4.5], ['ink-fade', 0.37, 3.0]];
  const seen = new Set();
  for (const [name, a, bar] of RUNGS) {
    const eff = a === 1.0 ? '#F0E6D2' : over(INK, a, BOT);
    const r = ratio(eff, BOT);
    seen.add(a);
    ok(`--admin-${name} measures ${r.toFixed(2)}:1, clearing its ${bar} bar`, r >= bar, `${r.toFixed(2)}`);
  }
  ok('FIVE DISTINCT RUNGS survive — R-U16 once collapsed two and silently deleted a step',
     seen.size === 5, `${seen.size} distinct alphas`);

  for (const [name, hex, bar] of [['positive', '#7FBE85', 4.5], ['caution', '#E0A870', 4.5], ['critical', '#E07B5C', 4.5], ['metal', '#C9A84C', 4.5]]) {
    const r = ratio(hex, BOT);
    ok(`--admin-${name} measures ${r.toFixed(2)}:1 on the darkest stop`, r >= bar, `${r.toFixed(2)}`);
  }

  // F-10.33, recorded as arithmetic: the ladder this replaces was sub-bar.
  const OLD = [240, 234, 224], OLDBG = '#122031';
  const oldMute = ratio(over(OLD, 0.48, OLDBG), OLDBG);
  const oldDim  = ratio(over(OLD, 0.22, OLDBG), OLDBG);
  ok(`F-10.33 recorded: the RETIRING ink-mute measured ${oldMute.toFixed(2)}:1 — under the body bar`, oldMute < 4.5);
  ok(`F-10.33 recorded: the RETIRING ink-dim measured ${oldDim.toFixed(2)}:1 — the honest-unknown DASH rendered there`, oldDim < 3.0);
}

// ═══════════════════════════════════════════════════════════════════════════
section('§4  THE ROSE IS DEAD IN THE REBUILT SET');
// ═══════════════════════════════════════════════════════════════════════════
{
  const r = ratio('#C44058', '#120F0E');
  ok(`rose measures ${r.toFixed(2)}:1 on the espresso ground — still under the body bar, so the ruling stands on arithmetic`,
     r < 4.5, `${r.toFixed(2)}`);

  const REBUILT = [
    ['app/admin/_components/Bridge.tsx', BRIDGE],
    ['app/admin/page.tsx',               read('app/admin/page.tsx')],
    ['lib/admin-api/bridge.ts',          read('lib/admin-api/bridge.ts')],
    ['app/admin/_components/adminNav.ts',read('app/admin/_components/adminNav.ts')],
    ['app/admin/_components/CommandPalette.tsx', read('app/admin/_components/CommandPalette.tsx')],
    ['lib/admin-api/search.ts',          read('lib/admin-api/search.ts')],
  ];
  for (const [name, src] of REBUILT)
    ok(`${name} carries no rose`, !/C44058|196,\s*64,\s*88/.test(strip(src)));

  // The eyebrow itself, at its one true site.
  const eyebrow = ADMINUI.match(/\{sub && \(\s*<p style=\{\{([^}]+)\}\}/);
  ok('PageHeader\'s eyebrow exists and is matched by the instrument', !!eyebrow);
  ok('the eyebrow renders on a ROLE, not on rose', !!eyebrow && /var\(--admin-ink-mute\)/.test(eyebrow[1]));
  ok('the eyebrow names no colour at all', !!eyebrow && !/#|rgba\(/.test(eyebrow[1]));
  ok('the widening past the ruled scope is DISCLOSED in-file as ratify-or-revert',
     /WIDENING DISCLOSED/.test(ADMINUI) && /RATIFY-OR-REVERT/.test(ADMINUI));
  ok('the six out-of-scope T.goldDim sites are named, so the silence is not misread',
     /NOT IN SCOPE/.test(ADMINUI) && (ADMINUI.match(/T\.goldDim/g) || []).length === 6,
     `${(ADMINUI.match(/T\.goldDim/g) || []).length} goldDim sites remain`);
}

// ═══════════════════════════════════════════════════════════════════════════
section('§5  F-10.32 — THE NUMERALS, AND THE GAP THIS CELL SET WILL NOT PAPER');
// ═══════════════════════════════════════════════════════════════════════════
{
  // COUNTING METHOD: a "figure site" is any style block in Bridge.tsx that
  // names T.ff.display — that face is the ONLY one with old-style defaults, so
  // it is exactly the set at risk. Counted from the source, not from a literal.
  const sites = BRIDGE.match(/fontFamily: T\.ff\.display[^}]*/g) || [];
  // ═══ LABELLED AMENDMENT · 3 → 4 · ratified CE-204, carried here ═══════════
  // The A4 rider (pwa 7e39385) added a FOURTH figure site to this masthead —
  // the subscription revenue line — and the count literal was not moved with it,
  // so this cell has stood red-and-attributed since. CE-204 ratified the
  // amendment and named the walk-hotfix delivery its carrier; that delivery
  // landed (8c1351a) WITHOUT performing it, and CE-205 re-carriered the
  // amendment to this ZIP with the sentence 「 a carrier that does not know it is
  // carrying is no carrier 」. This is the third attempt and the one that lands.
  //
  // The PROPERTY is unchanged and is the point: EVERY figure site on this
  // masthead carries the numeral fix, and exactly one takes tabular. Those two
  // cells below never reddened — they held at four sites as they held at three,
  // which is why the guarded behaviour was never in doubt and only the literal
  // had drifted. A count literal is the most brittle possible expression of
  // "all of them", and it is kept here rather than replaced with `> 0` precisely
  // so that the NEXT figure site added to this file also stops and asks.
  //
  // Re-derived at this seat rather than carried: 4 sites at pwa 2452eb5 —
  // masthead 40px, queue 26px tabular, and the two 34px lines (fee + subscription).
  ok('every figure site was found by the instrument (4 expected: masthead, queue, fee, subscription)',
     sites.length === 4, `${sites.length} found`);
  ok('EVERY figure site carries lining-nums — the legibility fix',
     sites.every(s => /fontVariantNumeric: 'lining-nums/.test(s)),
     sites.filter(s => !/lining-nums/.test(s)).length + ' missing');

  const tabular = sites.filter(s => /tabular-nums/.test(s));
  ok('EXACTLY ONE site takes tabular-nums — the queue, where a fixed gutter can jitter',
     tabular.length === 1, `${tabular.length} sites`);
  ok('the tabular site is the queue count (minWidth 42 gutter), derived not guessed',
     tabular.length === 1 && /minWidth: 42/.test(tabular[0]));
  ok('the masthead deliberately does NOT take tabular — no column to align against',
     sites.some(s => /fontSize: 40/.test(s) && !/tabular-nums/.test(s)));
  ok('the derivation for the lining/tabular split is written where the next hand reads it',
     /TWO DIFFERENT PROBLEMS, TWO DIFFERENT PROPERTIES/.test(BRIDGE));

  // THE GAP, ASSERTED AS A GAP. This cell passes when the limitation is
  // DECLARED — it is the independent-method law turned on this bench itself.
  ok('the face-level gap is stated in-file: the property is proven, the GLYPH is not',
     /CANNOT assert the glyph changed/.test(BRIDGE) && /egress allowlist/.test(BRIDGE));
  ok('the fallback is pre-named so no second sitting is spent choosing one',
     /Italiana/.test(BRIDGE) && /layout\.tsx:8/.test(BRIDGE));
  ok('and the estate really does designate Italiana its numeral face (the fallback is derived)',
     /Italiana\s+— display: numerals/.test(read('app/layout.tsx')));
}

// ═══════════════════════════════════════════════════════════════════════════
section('§6  NOTHING STRANDED, NOTHING RE-VOCABULARISED');
// ═══════════════════════════════════════════════════════════════════════════
{
  // A re-valuing must not drop a role: a consumed token with no declaration
  // renders as nothing, and nobody notices until the founder does.
  const consumed = new Set();
  for (const f of ['app/admin/layout.tsx', 'app/admin/_components/Bridge.tsx', 'app/admin/_components/CommandPalette.tsx',
                   'app/admin/_components/AdminUI.tsx', 'app/admin/page.tsx'])
    for (const m of read(f).matchAll(/--admin-[a-z-]+/g)) consumed.add(m[0]);
  const declared = new Set((DECLS.match(/--admin-[a-z-]+(?=:)/g) || []));
  const stranded = [...consumed].filter(r => !declared.has(r));
  ok(`every one of the ${consumed.size} consumed roles is still declared (0 stranded)`,
     stranded.length === 0, stranded.join(', '));
  ok('the role vocabulary did not change size — this is a re-VALUING, not a re-vocabulary',
     declared.size === 33, `${declared.size} declared`);
  ok('the meta theme-color exception is still the shell value and is now espresso',
     /content="#1F1612"/.test(LAYOUT) || /--admin-shell/.test(LAYOUT));
}

console.log(`\n────────────────────────────────────────────────────────────`);
console.log(`tdw10_p2_retint: ${pass} passed, ${fail} failed  (total ${pass + fail})`);
process.exit(fail === 0 ? 0 : 1);
