#!/usr/bin/env node
'use strict';
// scripts/b77_shell2_hierarchy_bench.js
// CE-42 · SEAT SHELL-2 · R-42.17 — TYPOGRAPHIC HIERARCHY IN THE SUB-ROOMS.
//
// Rung 77, derived by `ls scripts` at the cut (b76 is the last taken, twice).
//
// THE DISEASE. On `/vendor/dates` and `/vendor/number` the lede, every can-do
// line and the aside line were all `font: var(--wl-t3)`, and nothing on the
// surface was a heading. The cure is four existing rungs doing their defined
// work: a t5 eyebrow, the one t1 title, a t5 sub-head — the three t3 roles keep
// their bytes (ruling D).
//
// WHAT THIS BENCH PROVES, AND HOW. The screens are hook-bound pages, so each is
// transpiled and RENDERED with its hooks stubbed and every other import real —
// the copy homes, SolutionsPieces, roomLabel. The markup is then mounted in a
// real browser under the SHIPPED `scopeCss`/`typeCss` and the SHIPPED
// SolutionsStyles literal (rendered from the component, not copied), in both
// arms, and every typographic claim is read off `getComputedStyle`.
//   §1 THE SURFACE, RENDERED — order and bytes, from the real page.
//   §2 COMPUTED, BOTH ARMS — eyebrow and sub-head are t5 uppercase .08em
//      ink-dim; exactly one t1; the sub-head carries the space above the list.
//   §3 THE THREE ROLES — see the note at the section: the reading taken is
//      PROPOSED under F-42.216 and awaits the chair.
//   §4 THE CENSUS — comment-stripped source and computed values: no rung
//      outside RUNGS, no colour outside the arm's palette.
//   §5 ONE HOME — COPY.canHead, read by both screens, typed nowhere else.
//   §6 THE MOCK — the corrected mock matches the tree rule for rule (c-42.52).
//   §7 bs_audit C18 as amended by label reads PASS on this tree.
//
// `--mutate` EDITS PRODUCTION CODE, re-runs the cells in a child and requires
// RED; a no-op control must stay GREEN; every touched file is restored byte for
// byte and its sha re-checked.
//
// Exit codes (R-40.85): 0 GREEN · 1 RED · 3 REFUSED (a subject is absent, or no
// browser launched — the computed cells ARE the ruled cells, so a run without
// them is not a green run).

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const P = (rel) => path.join(ROOT, rel);
const read = (rel) => fs.readFileSync(P(rel), 'utf8');
const has = (rel) => fs.existsSync(P(rel));
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

const PIECES = 'components/solutions/SolutionsPieces.tsx';
const SOLC   = 'lib/solutions/copy.ts';
const THEME  = 'lib/worklist/theme.ts';
const SHELL  = 'components/worklist/WorklistShell.tsx';
const DPAGE  = 'app/vendor/(shell)/dates/page.tsx';
const NPAGE  = 'app/vendor/(shell)/number/page.tsx';
const DCOPY  = 'lib/worklist/openDates.ts';
const NCOPY  = 'lib/worklist/ownNumber.ts';
const MOCK   = 'docs/mocks/solutions-hierarchy-mock.html';
const BSA    = 'tools/bs_audit.mjs';

// ════════════════════════════════════════════════════════════════════════════
// THE MUTATION PASS — runs the cells in children; never mixes with a cell run.
// ════════════════════════════════════════════════════════════════════════════
if (process.argv.includes('--mutate')) {
  const sha = (rel) => crypto.createHash('sha256').update(fs.readFileSync(P(rel))).digest('hex');
  const run = () => spawnSync(process.execPath, [__filename], { cwd: ROOT, encoding: 'utf8' });
  const base = run();
  if (base.status !== 0) { console.log('REFUSED — the bench is not GREEN before mutation (exit ' + base.status + ')'); process.exit(3); }
  const M = [
    ['M1 the eyebrow leaves dates', DPAGE, '        <p className="sol-kicker">{CHIPS.coming}</p>\n', ''],
    ['M2 the number title is typed, not read', NPAGE, "<h1 className=\"sol-title\">{roomLabel('number')}</h1>", '<h1 className="sol-title">{\'Your own number\'}</h1>'],
    ['M3 the eyebrow drops to ink-mute', PIECES, 'text-transform:uppercase;color:var(--atelier-ink-dim);margin:0 0 6px}', 'text-transform:uppercase;color:var(--atelier-ink-mute);margin:0 0 6px}'],
    ['M4 the sub-head tracking goes to .06em', PIECES, '.sol-subhead{font:var(--wl-t5);letter-spacing:.08em;', '.sol-subhead{font:var(--wl-t5);letter-spacing:.06em;'],
    ['M5 the title drops to t2', PIECES, '.sol-title{font:var(--wl-t1);', '.sol-title{font:var(--wl-t2);'],
    ['M6 a second t1 rule in Pieces', PIECES, '.sol-kicker{font:var(--wl-t5);', '.sol-kicker{font:var(--wl-t1);'],
    ['M7 number renders its title twice', NPAGE, "        <p className=\"sol-empty\">{NUMBER.lede}</p>\n", "        <h1 className=\"sol-title\">{roomLabel('number')}</h1>\n        <p className=\"sol-empty\">{NUMBER.lede}</p>\n"],
    ['M8 the list takes its old margin back', PIECES, '.sol-can{list-style:none;margin:0;', '.sol-can{list-style:none;margin:16px 0 0;'],
    ['M9 the sub-head byte is typed into number', NPAGE, '<p className="sol-subhead">{COPY.canHead}</p>', '<p className="sol-subhead">What this will do</p>'],
    ['M10 a hex literal in the sub-head', PIECES, 'text-transform:uppercase;color:var(--atelier-ink-dim);margin:24px 0 10px}', 'text-transform:uppercase;color:#A3A6A9;margin:24px 0 10px}'],
    ['M11 a seventh tuple on the eyebrow', PIECES, '.sol-kicker{font:var(--wl-t5);', '.sol-kicker{font:500 13px/1.3 var(--font-dm-sans);'],
    ['M12 the aside loses its rule line', PIECES, 'margin-top:28px;padding-top:16px;border-top:.5px solid var(--atelier-card-border)}\n.sol-asideline', 'margin-top:28px;padding-top:16px}\n.sol-asideline'],
    ['M13 the mock revives the struck D7', MOCK, '<div class="sol-aside"><p class="sol-asideline">', '<div class="sol-aside"><p class="sol-kicker">Already working</p><p class="sol-asideline">'],
    ['M14 the mock draws the seat the chair first drew', MOCK, '<span class="wl-lbl">Your own number</span>', '<span class="wl-lbl">Business Solutions</span>'],
    ['M15 the mock carries the Chalk label it first carried', MOCK, '--atelier-label:#3A3F42;', '--atelier-label:#52585B;'],
    ['M16 the lede is headed by nothing (title rendered after it)', DPAGE,
      "        <h1 className=\"sol-title\">{roomLabel('dates')}</h1>\n        <p className=\"sol-empty\">{DATES.lede}</p>\n",
      "        <p className=\"sol-empty\">{DATES.lede}</p>\n        <h1 className=\"sol-title\">{roomLabel('dates')}</h1>\n"],
  ];
  const touched = [...new Set(M.map((m) => m[1]).concat([DCOPY]))];
  const before = Object.fromEntries(touched.map((f) => [f, sha(f)]));
  let pending = null;
  const putBack = () => { if (pending) { fs.writeFileSync(P(pending.file), pending.src); pending = null; } };
  for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => { putBack(); process.exit(130); });
  process.on('exit', putBack);
  const arg = (k) => { const a = process.argv.find((x) => x.startsWith('--' + k + '=')); return a ? Number(a.split('=')[1]) : null; };
  const lo = arg('from') || 1, hi = arg('to') || M.length;
  let red = 0, bad = 0;
  for (const [name, file, from, to] of M.slice(lo - 1, hi)) {
    const src = read(file);
    if (!src.includes(from)) { console.log('  VOID ' + name + ' — the anchor is absent, so this mutation tests nothing'); bad++; continue; }
    pending = { file, src };
    fs.writeFileSync(P(file), src.replace(from, to));
    const r = run();
    putBack();
    if (r.status === 1) { red++; console.log('  RED  ' + name + '  (' + (r.stdout.match(/^  FAIL .*$/m) || ['?'])[0].trim().slice(5, 90) + ')'); }
    else { bad++; console.log('  GREEN?! ' + name + ' — exit ' + r.status + ', the cell this protects never noticed'); }
  }
  { const src = read(DCOPY);
    pending = { file: DCOPY, src };
    fs.writeFileSync(P(DCOPY), src + '\n// control\n');
    const r = run(); putBack();
    if (r.status === 0) console.log('  GREEN control — a comment-only edit leaves the bench green');
    else { bad++; console.log('  RED?! control — the bench reds on an edit that changes nothing'); } }
  const drift = touched.filter((f) => sha(f) !== before[f]);
  if (drift.length) { console.log('TREE NOT RESTORED: ' + drift.join(', ')); process.exit(1); }
  const n = M.slice(lo - 1, hi).length;
  console.log('\n' + (bad === 0 ? 'MUTATE GREEN' : 'MUTATE RED') + ' — ' + red + '/' + n + ' mutations RED' + (n < M.length ? ' (slice ' + lo + '-' + hi + ' of ' + M.length + ')' : '') + ', control GREEN, tree restored byte-for-byte');
  process.exit(bad === 0 ? 0 : 1);
}

let ts, React, server;
try { ts = require('typescript'); React = require('react'); server = require('react-dom/server'); }
catch (e) { console.log('REFUSED — node_modules absent (' + e.message.split('\n')[0] + '); run npm ci'); process.exit(3); }

let pass = 0, fail = 0;
const ok = (n, c, d) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n + (d ? '  → ' + d : '')); } };
const sec = (t) => console.log('\n' + t);

for (const rel of [PIECES, SOLC, THEME, SHELL, DPAGE, NPAGE, DCOPY, NCOPY]) {
  if (!has(rel)) { console.log('REFUSED — ' + rel + ' is absent'); process.exit(3); }
}

// ── the loader: transpile one module, resolve its aliases, stub the named ───
const loaded = new Map();
function load(rel, stubs = {}) {
  const key = rel + '|' + Object.keys(stubs).join(',');
  if (loaded.has(key)) return loaded.get(key);
  const out = ts.transpileModule(read(rel), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const mod = { exports: {} };
  const req = (spec) => {
    if (spec in stubs) return stubs[spec];
    if (spec.startsWith('@/')) for (const ext of ['.ts', '.tsx']) if (has(spec.slice(2) + ext)) return load(spec.slice(2) + ext, stubs);
    return require(spec);
  };
  new Function('require', 'module', 'exports', out)(req, mod, mod.exports);
  loaded.set(key, mod.exports);
  return mod.exports;
}
const h = React.createElement;
// Only the hooks and the chrome are stubbed. Everything the surface is MADE of
// — the copy homes, roomLabel, SolutionsPieces — is the real module.
const STUBS = {
  'next/navigation': { useRouter: () => ({ replace() {} }) },
  'next/link': { __esModule: true, default: ({ href, className, children }) => h('a', { href, className }, children) },
  '@/hooks/vendor/useVendorSession': { useVendorSession: () => ({ session: { vendorId: 'bench' }, loading: false }) },
  '@/hooks/vendor/useToast': { useToast: () => ({ toast: null, show() {} }) },
  '@/components/worklist/WlToast': { WlToast: () => null },
  '@/components/worklist/WorklistShell': { WorklistShell: ({ title, children }) => h('div', { 'data-shell-title': title }, children) },
};
const copy = load(SOLC);
const theme = load(THEME);
const pieces = load(PIECES, { 'next/link': STUBS['next/link'] });
const piecesCss = server.renderToStaticMarkup(h(pieces.SolutionsStyles))
  .replace(/^<style>|<\/style>$/g, '').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
const render = (rel) => server.renderToStaticMarkup(h(load(rel, STUBS).default));
const SCREENS = [
  { key: 'dates', rel: DPAGE, aside: true },
  { key: 'number', rel: NPAGE, aside: false },
].map((s) => ({ ...s, html: render(s.rel) }));
const surfaceOf = (html) => (html.match(/<section class="sol-surface">([\s\S]*?)<\/section>/) || [])[1] || '';
const topLevel = (inner) => {
  // the section's direct children, in order, as tag.class
  const out = []; let depth = 0;
  for (const m of inner.matchAll(/<(\/?)([a-z0-9]+)([^>]*?)(\/?)>/g)) {
    const [, close, tag, attrs, self] = m;
    if (['br', 'img', 'input'].includes(tag)) continue;
    if (close) { depth--; continue; }
    if (depth === 0) out.push(tag + '.' + ((attrs.match(/class="([^"]+)"/) || [])[1] || ''));
    if (!self) depth++;
  }
  return out;
};
const textOf = (html, cls, tag = '[a-z0-9]+') => (html.match(new RegExp('<(' + tag + ') class="' + cls + '">([^<]*)</\\1>')) || [])[2];

// ── §1 · THE SURFACE, RENDERED ──────────────────────────────────────────────
sec('§1 · the surface, rendered from the real page');
for (const s of SCREENS) {
  const inner = surfaceOf(s.html);
  const want = ['p.sol-kicker', 'h1.sol-title', 'p.sol-empty', 'p.sol-subhead', 'ul.sol-can', 'div.sol-actions'].concat(s.aside ? ['div.sol-aside'] : []);
  const got = topLevel(inner);
  // dates: the aside opens on D5 itself — D7 was struck, so no eyebrow heads it.
  const asideOk = !s.aside || /<div class="sol-aside"><p class="sol-asideline">/.test(inner);
  ok(s.key + ': eyebrow, title, lede, sub-head, list, actions' + (s.aside ? ', aside opening on D5 (D7 struck)' : '') + ' — in that order',
    got.join(' ') === want.join(' ') && asideOk, got.join(' ') + (asideOk ? '' : ' · the aside opens on something other than D5'));
  ok(s.key + ': the eyebrow reads CHIPS.coming (C2)', !!copy.CHIPS.coming && textOf(inner, 'sol-kicker', 'p') === copy.CHIPS.coming, String(textOf(inner, 'sol-kicker', 'p')));
  const title = textOf(inner, 'sol-title', 'h1');
  ok(s.key + ': the title reads roomLabel, the seat\u2019s own byte (A1)',
    title === copy.roomLabel(s.key).replace(/&/g, '&amp;') && s.html.includes('data-shell-title="' + copy.roomLabel(s.key).replace(/&/g, '&amp;') + '"'), title);
  // undefined === undefined is not a byte: at the uncured tree both sides were
  // absent and this cell read GREEN. It now requires the byte to exist.
  const head = textOf(inner, 'sol-subhead', 'p');
  ok(s.key + ': the sub-head reads COPY.canHead (T2)', typeof copy.COPY.canHead === 'string' && copy.COPY.canHead.length > 0 && head === copy.COPY.canHead, String(head));
  // A typed literal renders the same text, so the render cannot see it; the
  // source can. Each of the three READS its home, comment-stripped.
  const src = strip(read(s.rel));
  ok(s.key + ': all three are READ from their homes, none typed',
    src.includes('<p className="sol-kicker">{CHIPS.coming}</p>') &&
    src.includes('<h1 className="sol-title">{roomLabel(\'' + s.key + '\')}</h1>') &&
    src.includes('<p className="sol-subhead">{COPY.canHead}</p>'));
}

// ── §5 · ONE HOME (text, comment-stripped; before the browser so it always runs)
sec('§5 · COPY.canHead has one home and both screens read it');
{
  const lit = copy.COPY.canHead;
  const hits = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(P(dir), { withFileTypes: true })) {
      const rel = dir + '/' + e.name;
      if (e.isDirectory()) { if (e.name !== 'node_modules') walk(rel); }
      else if (/\.(tsx?|mjs|js)$/.test(e.name) && strip(read(rel)).includes(lit)) hits.push(rel);
    }
  };
  ['app', 'components', 'lib', 'hooks'].forEach((d) => has(d) && walk(d));
  ok('the byte is written once, in lib/solutions/copy.ts', hits.length === 1 && hits[0] === SOLC, hits.join(', '));
  for (const s of SCREENS) ok(s.key + ' reads {COPY.canHead}', /<p className="sol-subhead">\{COPY\.canHead\}<\/p>/.test(strip(read(s.rel))));
}

// ── §7 · bs_audit C18, as amended by label ──────────────────────────────────
sec('§7 · bs_audit C18, amended by label (R-42.17)');
{
  const r = spawnSync(process.execPath, [P(BSA)], { cwd: ROOT, encoding: 'utf8' });
  const line = (r.stdout.match(/^(PASS|FAIL|INCO)\s+C18 .*$/m) || [''])[0];
  ok('C18 reads PASS: one t1 rule in Pieces, on .sol-title, rendered at most once per reader', /^PASS\s+C18 at most one t1 per surface, and it is \.sol-title/.test(line), line || 'no C18 line');
}

// ── §6 · THE MOCK, AMENDED TO THE TREE (c-42.52 / c-42.53) ──────────────────
sec('§6 · the corrected mock matches the tree, rule for rule');
const MOCK_CELLS = ['every shipped .sol-* rule is in the mock verbatim, and the mock carries no other',
  'its tokens are theme.ts scopeCss + typeCss, verbatim (both arms)', 'its header draws WorklistShell.tsx\u2019s own rules',
  'exactly one scoped override, and it is b5b7dfc2\u2019s .sol-can margin on the before panel',
  'every seat is the room (A1), never Business Solutions', 'D7 is absent from the mock', 'every byte it draws is the shipped byte'];
if (!has(MOCK)) MOCK_CELLS.forEach((n) => ok(n, false, MOCK + ' is absent'));
else {
  const mock = read(MOCK);
  const rules = (css) => strip(css).split('\n').map((l) => l.trim()).filter(Boolean).join('\n')
    .replace(/\n(?=[^.@\[]|\.\d)/g, ' ').split('\n').filter((l) => /^\.sol-/.test(l));
  const shipped = rules(piecesCss);
  const drawn = rules((mock.match(/<style>([\s\S]*?)<\/style>/) || [, ''])[1]);
  // CE-45 FE-1 · LABELLED AMENDMENT: ONE NAMED RULE IS RULED BY A LATER MOCK, NOT THIS ONE. The row's one
  // line under its name (R-45.20) is drawn by the founder's BS-1 mock (docs/mocks/TDW_CE45_BS1_UI_HOME_
  // AND_SHELVES.html, the row descriptions), which postdates this mock. This older mock is a ratified
  // artifact and is NOT edited; the rule is excused here BY ITS EXACT TEXT, so any other new .sol-*
  // rule, or any change to this one, still reddens the cell.
  // CE-45 FE-1 HOME_2 · LABELLED AMENDMENT (R-45.21): the row's icon, drawn by the founder-approved
  // mock TDW_CE45_FE1_MOCK_PINS_TOP_AND_ICONS.html (sha256 a0f8de82298867fef84daf370f4ec9f06f57baec48573735fc0db92d9e81ac63),
  // excused BY ITS EXACT TEXT as the row line was; this older ratified mock is not edited.
  const LATER_MOCK = ['.sol-rowdesc{font:var(--wl-t4);color:var(--atelier-ink-mute)}',
    '.sol-rowicon{flex:none;width:20px;height:20px;color:var(--atelier-ink-dim)}'];
  const miss = shipped.filter((r) => !drawn.includes(r) && !LATER_MOCK.includes(r)), extra = drawn.filter((r) => !shipped.includes(r));
  ok('every shipped .sol-* rule is in the mock verbatim, and the mock carries no other', shipped.length > 0 && miss.length === 0 && extra.length === 0,
    (miss.length ? 'missing: ' + miss[0].slice(0, 70) : '') + (extra.length ? ' extra: ' + extra[0].slice(0, 70) : ''));
  ok('its tokens are theme.ts scopeCss + typeCss, verbatim (both arms)', mock.includes(theme.scopeCss('.wl')) && mock.includes(theme.typeCss('.wl')));
  const shellSrc = read(SHELL);
  const shellRules = ['.wl-hdr', '.wl-hstack', '.wl-house', '.wl-lbl', '.wl-lblrow', '.wl-beta', '.wl-main > *']
    .map((sel) => shellSrc.split('\n').find((l) => l.startsWith(sel + '{')));
  ok('its header draws WorklistShell.tsx\u2019s own rules', shellRules.every((r) => r && mock.includes(r)));
  const scoped = [...mock.matchAll(/^\[data-frame="[^"]+"\][^\n]*$/gm)].map((m) => m[0]);
  ok('exactly one scoped override, and it is b5b7dfc2\u2019s .sol-can margin on the before panel',
    scoped.length === 1 && scoped[0] === '[data-frame="H0-before"] .sol-can{margin:16px 0 0}', scoped.join(' | '));
  const seats = [...mock.matchAll(/<span class="wl-lbl">([^<]+)<\/span>/g)].map((m) => m[1].replace(/&amp;/g, '&'));
  ok('every seat is the room (A1), never Business Solutions', seats.length === 3 && seats.join('|') === [copy.roomLabel('dates'), copy.roomLabel('dates'), copy.roomLabel('number')].join('|'), seats.join('|'));
  ok('D7 is absent from the mock', !mock.replace(/<!--[\s\S]*?-->/, '').includes('Already working'));
  const D = load(DCOPY).DATES, N = load(NCOPY).NUMBER;
  const plain = mock.replace(/&amp;/g, '&');
  const bytes = [D.lede, ...D.can, D.already, D.cta, N.lede, ...N.can, copy.COPY.canHead, copy.CHIPS.coming, copy.BUTTONS.connect, copy.roomLabel('dates'), copy.roomLabel('number')];
  ok('every byte it draws is the shipped byte', bytes.every((b) => plain.includes(b)), bytes.filter((b) => !plain.includes(b)).join(' | '));
}

// ── §4a · THE CENSUS, SOURCE (comment-stripped) ─────────────────────────────
sec('§4 · the census — no rung outside RUNGS, no colour outside the palette');
{
  const css = strip(piecesCss);
  const fonts = [...css.matchAll(/(^|[;{])\s*font\s*:\s*([^;}]+)/g)].map((m) => m[2].trim());
  const offRung = fonts.filter((f) => { const m = f.match(/^var\(--wl-(t\d)\)$/); return !m || !theme.RUNGS.includes(m[1]); });
  const longhand = css.match(/font-(size|family|weight)\s*:/g) || [];
  // The census is OF THE HIERARCHY: each cell also requires the three rules the
  // cure adds to be among what it counted, so neither can pass by counting a
  // stylesheet that never grew them (R-40.105's vacuity class).
  const newRules = ['.sol-kicker', '.sol-title', '.sol-subhead'];
  const absent = newRules.filter((r) => !new RegExp('\\' + r + '\\{[^}]*font:var\\(--wl-t\\d\\)[^}]*color:var\\(--atelier-').test(css));
  ok('every font in the stylesheet is one of the six rungs, as the shorthand — the hierarchy counted', fonts.length > 0 && offRung.length === 0 && longhand.length === 0 && absent.length === 0,
    offRung.concat(longhand).join(' | ') + (absent.length ? ' · not counted: ' + absent.join(', ') : ''));
  const known = new Set(Object.keys(theme.GRAPHITE).map((k) => theme.prefixFor(k)));
  const refs = [...css.matchAll(/var\((--(?:atelier|role)-[a-z-]+)\)/g)].map((m) => m[1]);
  const unknown = refs.filter((r) => !known.has(r));
  const literals = css.match(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/g) || [];
  ok('every colour is a token read that theme.ts defines, and none is a literal — the hierarchy counted', refs.length > 0 && unknown.length === 0 && literals.length === 0 && absent.length === 0,
    unknown.concat(literals).join(' | ') + (absent.length ? ' · not counted: ' + absent.join(', ') : ''));
}

// ── §2–§4b · COMPUTED, IN A REAL BROWSER, BOTH ARMS ─────────────────────────
const browser = (async () => {
  let puppeteer, chromium;
  try { puppeteer = require('puppeteer-core'); chromium = require('@sparticuz/chromium').default; }
  catch { return 'no browser package'; }
  let b;
  try { b = await puppeteer.launch({ args: [...chromium.args, '--no-sandbox'], executablePath: await chromium.executablePath(), headless: 'shell' }); }
  catch (e) { return 'the browser did not launch: ' + e.message.split('\n')[0]; }
  try {
    const shellSrc = read(SHELL);
    const wlRule = shellSrc.split('\n').find((l) => l.startsWith('.wl{'));
    const hex = (v) => { const x = v.replace('#', ''); return 'rgb(' + [0, 2, 4].map((i) => parseInt(x.slice(i, i + 2), 16)).join(', ') + ')'; };
    const pg = await b.newPage();
    await pg.setViewport({ width: 374, height: 844 });
    const out = {};
    for (const mode of ['dark', 'light']) {
      const pal = mode === 'dark' ? theme.GRAPHITE : theme.CHALK;
      const inks = Object.fromEntries(Object.entries(pal).filter(([, v]) => /^#[0-9A-Fa-f]{6}$/.test(v)).map(([k, v]) => [k, hex(v)]));
      for (const s of SCREENS) {
        // next/font defines these two in app/layout.tsx; without them every rung is
        // invalid at computed-value time and the font shorthand silently resets.
        await pg.setContent('<style>' + theme.scopeCss('.wl') + theme.typeCss('.wl') + wlRule +
          '.wl{--font-cormorant:"Cormorant Garamond";--font-dm-sans:"DM Sans"}body{margin:0}' + piecesCss + '</style>' +
          '<div class="wl" data-wl-mode="' + mode + '" style="background:var(--atelier-page-bg);color:var(--atelier-ink)"><main class="wl-main">' +
          s.html + '</main></div>');
        out[mode + ':' + s.key] = await pg.evaluate((inks) => {
          const cs = (el) => { const c = getComputedStyle(el); return { size: c.fontSize, weight: c.fontWeight, line: c.lineHeight, family: c.fontFamily,
            track: c.letterSpacing, transform: c.textTransform, color: c.color, mt: c.marginTop, mb: c.marginBottom, bt: c.borderTopWidth, bts: c.borderTopStyle }; };
          const q = (sel) => document.querySelector(sel);
          const surface = q('.sol-surface');
          const texts = [...surface.querySelectorAll('*')].filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()));
          const colorName = (c) => Object.keys(inks).find((k) => inks[k] === c) || null;
          return {
            kicker: q('.sol-kicker') && cs(q('.sol-kicker')), subhead: q('.sol-subhead') && cs(q('.sol-subhead')),
            title: q('.sol-title') && cs(q('.sol-title')), lede: q('.sol-empty') && cs(q('.sol-empty')),
            li: q('.sol-can li') && cs(q('.sol-can li')), ul: q('.sol-can') && cs(q('.sol-can')),
            aside: q('.sol-aside') && cs(q('.sol-aside')), asideline: q('.sol-asideline') && cs(q('.sol-asideline')),
            firstOfAside: q('.sol-aside') ? q('.sol-aside').firstElementChild.className : null,
            prevOfLede: q('.sol-empty') && q('.sol-empty').previousElementSibling ? q('.sol-empty').previousElementSibling.className : null,
            prevOfList: q('.sol-can') && q('.sol-can').previousElementSibling ? q('.sol-can').previousElementSibling.className : null,
            h1s: surface.querySelectorAll('h1').length,
            t1s: texts.filter((el) => { const c = getComputedStyle(el); return c.fontSize === '24px' && /Cormorant/.test(c.fontFamily); }).map((el) => el.tagName + '.' + el.className),
            texts: texts.map((el) => { const c = getComputedStyle(el); return { who: el.tagName + '.' + el.className, size: c.fontSize, weight: c.fontWeight, line: c.lineHeight, ink: colorName(c.color), raw: c.color }; }),
          };
        }, inks);
      }
    }
    return out;
  } finally { await b.close(); }
})();

browser.then((got) => {
  if (typeof got === 'string') {
    console.log('\nREFUSED — ' + got + '. §2–§4b are the ruled computed cells; a run without them is not a green run.');
    console.log('(so far: ' + pass + ' ok, ' + fail + ' FAIL)');
    process.exit(fail ? 1 : 3);
  }
  const rung = (k) => ({ size: theme.TYPE[k].size + 'px', weight: String(theme.TYPE[k].weight), line: (Math.round(theme.TYPE[k].size * theme.TYPE[k].line * 100) / 100) + 'px' });
  const isRung = (c, k) => { const r = rung(k); return c && c.size === r.size && c.weight === r.weight && parseFloat(c.line).toFixed(2) === parseFloat(r.line).toFixed(2); };
  const t5track = (theme.TYPE.t5.size * 0.08).toFixed(2);   // .08em at t5, in px, as computed
  for (const mode of ['dark', 'light']) {
    const pal = mode === 'dark' ? theme.GRAPHITE : theme.CHALK;
    const hex = (v) => { const x = v.replace('#', ''); return 'rgb(' + [0, 2, 4].map((i) => parseInt(x.slice(i, i + 2), 16)).join(', ') + ')'; };
    const arm = mode === 'dark' ? 'Graphite' : 'Chalk';
    for (const s of SCREENS) {
      const g = got[mode + ':' + s.key];
      const tag = arm + ' · ' + s.key;
      sec('§2 · computed — ' + tag);
      for (const role of ['kicker', 'subhead']) {
        const c = g[role];
        ok(role + ' is t5, uppercase, .08em, in ink-dim',
          isRung(c, 't5') && c.transform === 'uppercase' && parseFloat(c.track).toFixed(2) === t5track && c.color === hex(pal['ink-dim']),
          c ? [c.size, c.weight, c.line, c.transform, c.track, c.color].join(' ') : 'absent');
      }
      ok('exactly one t1 on the surface, and it is h1.sol-title', g.h1s === 1 && g.t1s.length === 1 && g.t1s[0] === 'H1.sol-title' && isRung(g.title, 't1'),
        g.h1s + ' h1, t1 on: ' + g.t1s.join(', '));
      ok('the sub-head carries the space: 24 above it, 10 below, the list 0 (ruling D)',
        g.subhead && g.subhead.mt === '24px' && g.subhead.mb === '10px' && g.ul && g.ul.mt === '0px', g.subhead ? [g.subhead.mt, g.subhead.mb, g.ul && g.ul.mt].join(' ') : 'absent');

      // ── §3 · THE THREE ROLES ─────────────────────────────────────────────
      // ⚠ PROPOSED READING, F-42.216 — NOT THE CHAIR'S WORDING. §8 as restored
      // asks that "each of the three roles (lede · can-do line · aside line)
      // resolves to a rung or transform distinct from the other two". Ruling D
      // keeps all three at t3 and the lede and the aside line share ink-soft, so
      // that wording cannot be met by the ruled tree; measured below and printed.
      // The reading taken is the property the cure actually establishes: each
      // role keeps t3 (D) and is HEADED by an element of a device the other two
      // headers do not use — the lede by the t1 title, the list by the t5
      // uppercase sub-head, the aside line by the aside's rule line.
      sec('§3 · the three roles — ' + tag + '  (PROPOSED reading, F-42.216)');
      const keepT3 = isRung(g.lede, 't3') && isRung(g.li, 't3') && (!s.aside || isRung(g.asideline, 't3'));
      const ledeHead = g.prevOfLede === 'sol-title' && isRung(g.title, 't1');
      const listHead = g.prevOfList === 'sol-subhead' && isRung(g.subhead, 't5') && g.subhead.transform === 'uppercase';
      const asideHead = !s.aside || (g.firstOfAside === 'sol-asideline' && parseFloat(g.aside.bt) > 0 && g.aside.bts === 'solid');
      ok('each role keeps t3 (D) and is headed by its own device: lede \u2190 t1 title, list \u2190 t5 uppercase sub-head' + (s.aside ? ', aside line \u2190 rule line' : ''),
        keepT3 && ledeHead && listHead && asideHead,
        [keepT3 ? '' : 'a role left t3', ledeHead ? '' : 'lede headed by ' + g.prevOfLede, listHead ? '' : 'list headed by ' + g.prevOfList, asideHead ? '' : 'aside unruled'].filter(Boolean).join(' · '));
      const lit = [['lede', g.lede], ['can-do', g.li], ['aside', s.aside ? g.asideline : null]].filter(([, c]) => c)
        .map(([n, c]) => n + ' ' + c.size + '/' + c.weight + ' ' + c.color).join(' · ');
      console.log('  note the literal §8 wording, measured: ' + lit);

      // ── §4b · THE CENSUS, COMPUTED ───────────────────────────────────────
      sec('§4 · the census, computed — ' + tag);
      const counted = ['P.sol-kicker', 'H1.sol-title', 'P.sol-subhead'].every((w) => g.texts.some((t) => t.who === w));
      const off = g.texts.filter((t) => !theme.RUNGS.some((k) => isRung(t, k)));
      ok('every text on the surface sits on one of the six rungs — the hierarchy counted', counted && off.length === 0,
        off.map((t) => t.who + ' ' + t.size + '/' + t.weight).join(', ') + (counted ? '' : ' · hierarchy absent'));
      const noInk = g.texts.filter((t) => !t.ink);
      ok('every text ink is a ' + arm + ' palette value — the hierarchy counted', counted && noInk.length === 0,
        noInk.map((t) => t.who + ' ' + t.raw).join(', ') + (counted ? '' : ' · hierarchy absent'));
    }
  }
  console.log('\n' + (fail === 0 ? 'GREEN' : 'RED') + ' — b77 shell-2 hierarchy (pwa) ' + pass + '/' + (pass + fail));
  process.exit(fail === 0 ? 0 : 1);
}).catch((e) => { console.log('RED — the bench threw: ' + e.message); process.exit(1); });
