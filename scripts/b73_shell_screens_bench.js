#!/usr/bin/env node
'use strict';
// scripts/b73_shell_screens_bench.js
// CE-42 · SEAT SHELL · R-42.12 AMENDED — EVERY BUSINESS SOLUTIONS ROW NAVIGATES.
//
// Rung 73, derived by `ls scripts` at the cut (b72 and b74 are taken; F-42.156:
// a rung is a property of the tree at the cut, not of the packet).
//
// WHAT THIS BENCH PROVES, AND HOW. Behaviour wherever a transpilable subject
// exists; text only where the subject is a hook-bound page no container can run.
//   §1 THE TYPE IS THE GUARD (S5(b)) — a real TypeScript program over the real
//      copy home: a `Record<RoomKey, string>` missing a row, or carrying a key
//      that is not a row, FAILS to compile. The hub's map is that type.
//   §2 THE ROW — RoomRow transpiled and RENDERED: always an anchor with the
//      href it was given, the chip's word following `preview` and nothing else.
//   §3 THE HUB — the preview set derived from its declaration and driven
//      through the real RoomRow: exactly two rows read Coming.
//   §4 THE SCREENS — each page at its declared address, one control, the
//      control's only act the vetoed toast, the toast mounted.
//   §5 THE BYTES — every shipped string against SHELL_VETO_SHEET.md by value,
//      length and sha256, BOTH WAYS; modules imported, not regex-read.
//   §6 F-42.202 — the toast's container is transparent to the finger and its
//      action is not; driven in a real browser where one launches.
//   §7 F-42.200 — the four sites agree, and the register carries `Open`.
//   §8 THE ADDRESSES — one home each.
//   §9 THE FRAMES — the committed mock draws the sheet's bytes.
//
// `--mutate` EDITS PRODUCTION CODE, re-runs the cells in a child process and
// requires RED; a no-op control must stay GREEN; every touched file is restored
// byte-for-byte and its sha re-checked. A mutation that leaves this bench green
// is a cell that was never testing what its name claims.
//
// Exit codes (R-40.85): 0 GREEN · 1 RED · 3 REFUSED (a subject is absent — true
// at the base this sitting was cut on, where none of the new files exist).

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const P = (rel) => path.join(ROOT, rel);
const read = (rel) => fs.readFileSync(P(rel), 'utf8');
const has = (rel) => fs.existsSync(P(rel));
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

const HUB    = 'app/vendor/(shell)/support/page.tsx';
const PIECES = 'components/solutions/SolutionsPieces.tsx';
const SOLC   = 'lib/solutions/copy.ts';
const ROUTES = 'lib/solutions/routes.ts';
const DPAGE  = 'app/vendor/(shell)/dates/page.tsx';
const NPAGE  = 'app/vendor/(shell)/number/page.tsx';
const DCOPY  = 'lib/worklist/openDates.ts';
const NCOPY  = 'lib/worklist/ownNumber.ts';
const TOAST  = 'components/worklist/WlToast.tsx';
const REG    = 'docs/COPY_REGISTER_TDW19.md';
const SHEET  = 'docs/mocks/SHELL_VETO_SHEET.md';
const MOCK   = 'docs/mocks/shell-screens-mock.html';
const BSA    = 'tools/bs_audit.mjs';
const ROOMS  = 'lib/worklist/rooms.ts';

// ════════════════════════════════════════════════════════════════════════════
// THE MUTATION PASS — runs the cells in children; never mixes with a cell run.
// ════════════════════════════════════════════════════════════════════════════
if (process.argv.includes('--mutate')) {
  const sha = (rel) => crypto.createHash('sha256').update(fs.readFileSync(P(rel))).digest('hex');
  const run = () => spawnSync(process.execPath, [__filename], { cwd: ROOT, encoding: 'utf8' });
  const base = run();
  if (base.status !== 0) { console.log('REFUSED — the bench is not GREEN before mutation (exit ' + base.status + ')'); process.exit(3); }
  const M = [
    ['M1 the map goes back to Partial', HUB, 'const ROOM_HREFS: Record<RoomKey, string> = {', 'const ROOM_HREFS: Partial<Record<string, string>> = {'],
    ['M2 a row loses its destination', HUB, '  number:        NUMBER_HREF,\n', ''],
    ['M3 the preview set forgets number', HUB, "new Set<RoomKey>(['dates', 'number'])", "new Set<RoomKey>(['dates'])"],
    ['M4 the hub hands a literal preview', HUB, 'preview={PREVIEW_KEYS.has(r.key)}', 'preview={false}'],
    ['M5 the chip stops tracking preview', PIECES, "<StateChip state={preview ? 'coming' : 'open'} />", "<StateChip state={href ? 'open' : 'coming'} />"],
    ['M6 the default flips to Coming', PIECES, 'href, label, preview = false,', 'href, label, preview = true,'],
    ['M7 the dates CTA stops answering', DPAGE, 'onClick={() => show(COPY.launchingSoon)}', 'onClick={() => {}}'],
    ['M8 the dates toast is unmounted', DPAGE, '      <WlToast toast={toast} />\n', ''],
    ['M9 the number CTA types its word', NPAGE, '{BUTTONS.connect}', "{'Connect'}"],
    ['M10 the number CTA is disabled', NPAGE, '<button type="button" className="sol-btn"', '<button type="button" disabled className="sol-btn"'],
    ['M11 a vetoed byte drifts', DCOPY, "cta:     'Suggest rates',", "cta:     'Suggest Rates',"],
    ['M12 the tap byte drifts', SOLC, "launchingSoon: 'Launching soon.',", "launchingSoon: 'Launching soon',"],
    ['M13 the typographic apostrophe goes straight', NCOPY, 'you\\u2019re busy', "you\\'re busy"],
    ['M14 the toast intercepts taps again', TOAST, 'z-index:9999;pointer-events:none;', 'z-index:9999;'],
    ['M15 the toast action goes dead', TOAST, '.wl-toastaction{pointer-events:auto;', '.wl-toastaction{'],
    ['M16 the register drops the Open row', REG, '| `CHIPS.open` | Open |', '| `CHIPS.opened` | Opened |'],
    ['M17 the dates address moves off its page', ROUTES, "export const DATES_HREF  = '/vendor/dates';", "export const DATES_HREF  = '/vendor/open-dates';"],
    ['M18 the door types its label', DPAGE, "<RoomRow href={roomHref('storefront')} label={STOREFRONT_LABEL} />", "<RoomRow href={roomHref('storefront')} label=\"Storefront\" />"],
    ['M19 a persona name reaches the chrome', NCOPY, "'Have enquiries answered in your voice while you work.',", "'Have Victor answer enquiries in your voice while you work.',"],
    ['M20 C8 prints Coming as proposed again', BSA, "const VETOED_BEYOND = ['Open', 'Coming'];", "const VETOED_BEYOND = ['Open'];"],
    ['M21 C24 goes back to containment', BSA, "if (!reg.includes('| ' + shipped + ' |')) missing.push(m[1]);", 'if (!reg.includes(shipped)) missing.push(m[1]);'],
  ];
  const touched = [...new Set(M.map((m) => m[1]).concat([DCOPY]))];
  const before = Object.fromEntries(touched.map((f) => [f, sha(f)]));
  // ── A KILLED PASS MUST NOT LEAVE A MUTATION IN THE TREE ─────────────────────
  // This seat's first full run was killed by its container's time limit while
  // M14 was applied, and the tree kept the mutated WlToast — `pointer-events:none`
  // gone, the cure silently reverted — until the plain bench was re-run and read
  // RED (R-40.32's specimen, one seat later). So the pending original is held
  // here and written back on SIGINT/SIGTERM/SIGHUP and on exit. A SIGKILL still
  // cannot be caught; the tail of this pass re-checks every sha, and the plain
  // bench is the witness after any interruption.
  let pending = null;
  const putBack = () => { if (pending) { fs.writeFileSync(P(pending.file), pending.src); pending = null; } };
  for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => { putBack(); process.exit(130); });
  process.on('exit', putBack);
  // `--from=N --to=N` runs a slice (1-based) for a container with a time limit;
  // the founder runs the whole list. The control always runs.
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
    if (r.status === 1) { red++; console.log('  RED  ' + name); }
    else { bad++; console.log('  GREEN?! ' + name + ' — exit ' + r.status + ', the cell this protects never noticed'); }
  }
  // THE NO-OP CONTROL: an edit that changes no behaviour must leave it GREEN, or
  // the reds above could be the bench reddening on ANY edit.
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

for (const rel of [HUB, PIECES, SOLC, ROUTES, DPAGE, NPAGE, DCOPY, NCOPY, TOAST, REG, SHEET, MOCK, BSA, ROOMS]) {
  if (!has(rel)) { console.log('REFUSED \u2014 ' + rel + ' is absent'); process.exit(3); }
}
let ts, React, server;
try { ts = require('typescript'); React = require('react'); server = require('react-dom/server'); }
catch (e) { console.log('REFUSED \u2014 node_modules absent (' + e.message.split('\n')[0] + '); run npm ci'); process.exit(3); }

let pass = 0, fail = 0;
const ok = (n, c, d) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n + (d ? '  \u2192 ' + d : '')); } };
const sec = (t) => console.log('\n' + t);

// ── a tiny loader: transpile one module, resolve the aliases it names ───────
const loaded = new Map();
function load(rel, stubs = {}) {
  const key = rel + JSON.stringify(Object.keys(stubs));
  if (loaded.has(key)) return loaded.get(key);
  const out = ts.transpileModule(read(rel), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const mod = { exports: {} };
  const req = (spec) => {
    if (spec in stubs) return stubs[spec];
    if (spec.startsWith('@/')) {
      for (const ext of ['.ts', '.tsx']) if (has(spec.slice(2) + ext)) return load(spec.slice(2) + ext, stubs);
    }
    return require(spec);
  };
  new Function('require', 'module', 'exports', out)(req, mod, mod.exports);
  loaded.set(key, mod.exports);
  return mod.exports;
}
const Link = ({ href, className, children }) => React.createElement('a', { href, className }, children);
const copy = load(SOLC);
const KEYS = copy.ROOM_ROWS.map((r) => r.key);

// ── §1 · THE TYPE IS THE GUARD ──────────────────────────────────────────────
sec('\u00a71 \u00b7 a row without a destination does not compile (S5(b))');
{
  const probe = (body) => {
    const files = { '/v/copy.ts': read(SOLC), '/v/probe.ts': "import type { RoomKey } from './copy';\n" + body };
    const options = { noEmit: true, strict: true, target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Node10 };
    const host = ts.createCompilerHost(options);
    const gsf = host.getSourceFile.bind(host);
    host.getSourceFile = (f, lv) => files[f] !== undefined ? ts.createSourceFile(f, files[f], lv) : gsf(f, lv);
    host.fileExists = ((fe) => (f) => files[f] !== undefined || fe(f))(host.fileExists.bind(host));
    host.readFile = ((rf) => (f) => files[f] !== undefined ? files[f] : rf(f))(host.readFile.bind(host));
    host.directoryExists = ((de) => (d) => d === '/v' || (de ? de(d) : true))(host.directoryExists && host.directoryExists.bind(host));
    const prog = ts.createProgram(['/v/probe.ts'], options, host);
    return ts.getPreEmitDiagnostics(prog).map((d) => d.code);
  };
  const lit = (keys) => 'export const m: Record<RoomKey, string> = { ' + keys.map((k) => k + ": ''").join(', ') + ' };\n';
  const full = probe(lit(KEYS));
  ok('the ten rows, each with a destination, compile', full.length === 0, 'diagnostics ' + full.join(','));
  const missing = probe(lit(KEYS.filter((k) => k !== 'number')));
  ok('a row with no destination is a compile error (TS2741)', missing.includes(2741), 'diagnostics ' + missing.join(','));
  const extra = probe(lit(KEYS.concat(['bogus'])));
  ok('a key that is not a row is a compile error (TS2353)', extra.includes(2353), 'diagnostics ' + extra.join(','));
  ok('RoomKey is the ten literals, not string', probe("export const k: RoomKey = 'not_a_row';\n").includes(2322));
  const hub = strip(read(HUB));
  const decl = hub.match(/const ROOM_HREFS: Record<RoomKey, string> = \{([\s\S]*?)\};/);
  ok('the hub\u2019s map IS that type', !!decl, 'ROOM_HREFS is not declared as Record<RoomKey, string>');
  if (decl) {
    const mk = [...decl[1].matchAll(/^\s*([a-z_]+):/gm)].map((m) => m[1]);
    ok('its keys are exactly ROOM_ROWS\u2019 keys, derived from the list that defines them',
      mk.slice().sort().join(',') === KEYS.slice().sort().join(','), mk.join(','));
  }
}

// ── §2 · THE ROW ────────────────────────────────────────────────────────────
sec('\u00a72 \u00b7 RoomRow, rendered');
const pieces = load(PIECES, { 'next/link': { __esModule: true, default: Link } });
const html = (props) => server.renderToStaticMarkup(React.createElement(pieces.RoomRow, props));
{
  const open = html({ href: '/vendor/x', label: 'X' });
  ok('a row renders an anchor carrying the href it was given', /^<a href="\/vendor\/x" class="sol-row">/.test(open), open);
  ok('a row with no preview reads Open', />Open<\/span><\/a>$/.test(open) && /data-state="open"/.test(open), open);
  const soon = html({ href: '/vendor/y', label: 'Y', preview: true });
  ok('a preview row reads Coming, and is still an anchor', /^<a href="\/vendor\/y"/.test(soon) && /data-state="coming"[^>]*>Coming</.test(soon), soon);
  ok('no row renders a div', !/^<div/.test(open) && !/^<div/.test(soon));
}

// ── §3 · THE HUB ────────────────────────────────────────────────────────────
sec('\u00a73 \u00b7 the hub\u2019s chips');
{
  const hub = strip(read(HUB));
  const pk = hub.match(/const PREVIEW_KEYS: ReadonlySet<RoomKey> = new Set<RoomKey>\(\[([^\]]*)\]\);/);
  const set = pk ? [...pk[1].matchAll(/'([a-z_]+)'/g)].map((m) => m[1]) : [];
  ok('PREVIEW_KEYS is exactly dates and number (S4(c))', set.slice().sort().join(',') === 'dates,number', set.join(','));
  ok('the hub hands each row its set membership', /preview=\{PREVIEW_KEYS\.has\(r\.key\)\}/.test(hub));
  const rows = copy.ROOM_ROWS.map((r) => html({ href: '/h', label: r.label, preview: set.includes(r.key) }));
  const coming = rows.filter((h) => /data-state="coming"/.test(h)).length;
  // ── AMENDED, LABELLED — R-42.16 (founder, 2026-09-10). The eleventh row is
  // LIVE (`collab` is a registry room with a working address), so it is absent
  // from PREVIEW_KEYS and reads Open: two Coming stands, eight Open becomes
  // NINE. Named up rather than loosened — the pair of numbers is what makes a
  // row arriving with the wrong chip visible here.
  ok('driven through the real row: two read Coming, nine read Open', coming === 2 && rows.length - coming === 9, coming + ' Coming / ' + (rows.length - coming) + ' Open');
  ok('the hub mounts no toast: no row taps into one (S5(b))', !/WlToast|useToast|launchingSoon/.test(hub));
}

// ── §4 · THE SCREENS ────────────────────────────────────────────────────────
sec('\u00a74 \u00b7 the two screens');
const routes = strip(read(ROUTES));
const addr = (name) => (routes.match(new RegExp('export const ' + name + "\\s*=\\s*'([^']+)'")) || [])[1];
for (const [key, name, file, ctaExpr] of [
  ['dates', 'DATES_HREF', DPAGE, '{DATES.cta}'],
  ['number', 'NUMBER_HREF', NPAGE, '{BUTTONS.connect}'],
]) {
  const src = strip(read(file));
  const a = addr(name);
  ok(key + ': the page stands at its declared address', !!a && P('app/vendor/(shell)' + a.replace(/^\/vendor/, '') + '/page.tsx') === P(file), a);
  ok(key + ': session-guarded as its siblings are', /useVendorSession\(\)/.test(src) && /router\.replace\('\/'\)/.test(src));
  ok(key + ': titled by ROOM_ROWS\u2019 own label', new RegExp("<WorklistShell title=\\{roomLabel\\('" + key + "'\\)\\}>").test(src));
  // The opening tag runs to the END OF ITS LINE: a `[^>]*` window stops at the
  // `=>` inside the onClick arrow and reads half a tag (caught on first run).
  const buttons = src.match(/<button\b[^\n]*>/g) || [];
  ok(key + ': exactly one control of its own (control inventory)', buttons.length === 1, buttons.length + ' buttons');
  ok(key + ': it is enabled (F-19.20) and its only act is the vetoed toast',
    buttons.length === 1 && !/disabled/.test(buttons[0]) && /onClick=\{\(\) => show\(COPY\.launchingSoon\)\}/.test(buttons[0]), buttons[0]);
  ok(key + ': its word is ' + ctaExpr, src.includes('>\n            ' + ctaExpr + '\n          </button>'));
  ok(key + ': the toast is mounted on the hook\u2019s own state', /const \{ toast, show \} = useToast\(\);/.test(src) && /<WlToast toast=\{toast\} \/>/.test(src));
  ok(key + ': no text node typed into the page', !/>\s*[A-Za-z][^<{]*</.test(src.replace(/<style>[\s\S]*?<\/style>/g, '')));
  ok(key + ': no /vendor literal in the page', !/['"`]\/vendor/.test(src));
}
{
  const src = strip(read(DPAGE));
  ok('dates: the door is a RoomRow to the registry\u2019s Storefront', /<RoomRow href=\{roomHref\('storefront'\)\} label=\{STOREFRONT_LABEL\} \/>/.test(src));
  ok('dates: the door\u2019s label is READ from ROOMS, never typed',
    /const STOREFRONT_LABEL = ROOMS\.find\(\(r\) => r\.id === 'storefront'\)\?\.label/.test(src) && !/'Storefront'|"Storefront"/.test(src));
  ok('number: no door on this screen', !/<RoomRow/.test(strip(read(NPAGE))));
}

// ── §5 · THE BYTES AGAINST THE SHEET ────────────────────────────────────────
sec('\u00a75 \u00b7 every byte is the sheet\u2019s, both ways');
{
  const D = load(DCOPY).DATES, N = load(NCOPY).NUMBER;
  const shipped = { D1: D.lede, D2: D.can[0], D3: D.can[1], D4: D.can[2], D5: D.already, D6: D.cta,
                    N1: N.lede, N2: N.can[0], N3: N.can[1], N4: N.can[2], T1: copy.COPY.launchingSoon };
  const rows = [...read(SHEET).matchAll(/^\| ([A-Z]\d) \| [^|]+ \| [^|]+ \| ([^|]+) \| (\d+) \| ([0-9a-f]{16}|—) \|$/gm)]
    .map((m) => ({ id: m[1], text: m[2].trim(), bytes: Number(m[3]), sha: m[4] }));
  const pinned = rows.filter((r) => r.sha !== '\u2014');
  ok('the sheet carries eleven authored rows and two carried ones', pinned.length === 11 && rows.length === 13, rows.length + ' rows, ' + pinned.length + ' pinned');
  for (const r of pinned) {
    const s = shipped[r.id];
    const h = s === undefined ? '' : crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
    ok(r.id + ' ships the vetoed byte, ' + r.bytes + 'B, sha ' + r.sha,
      s === r.text && Buffer.byteLength(s) === r.bytes && h === r.sha, JSON.stringify(s) + ' ' + h);
  }
  const homes = [D.lede, ...D.can, D.already, D.cta, N.lede, ...N.can];
  ok('the other way: every string in both copy homes is on the sheet',
    homes.every((s) => pinned.some((r) => r.text === s)) && Object.keys(D).length === 4 && Object.keys(N).length === 2,
    homes.filter((s) => !pinned.some((r) => r.text === s)).join(' | '));
  ok('N5 carries BUTTONS.connect, C1 carries CHIPS.coming', copy.BUTTONS.connect === 'Connect' && copy.CHIPS.coming === 'Coming');
  ok('no straight apostrophe in any shipped byte (R-40.57)', !Object.values(shipped).some((s) => /\w'\w/.test(s)));
  ok('N1 carries U+2019', N.lede.includes('you\u2019re'));
  const PERSONA = /\b(Victor|Donna|Harvey|Mira)\b/;
  ok('no persona name in either screen or copy home (b40 C32\u2019s law)',
    ![DPAGE, NPAGE, DCOPY, NCOPY].some((f) => PERSONA.test(strip(read(f)))) && !Object.values(shipped).some((s) => PERSONA.test(s)));
  ok('the register carries the tap byte as a table cell', read(REG).includes('| `launchingSoon` | Launching soon. |'));
}

// ── §6 · F-42.202 · THE TOAST NEVER INTERCEPTS A TAP ────────────────────────
sec('\u00a76 \u00b7 F-42.202 \u2014 a transient notice is transparent to the finger');
const toastCss = (() => {
  const m = read(TOAST).match(/\nconst TOAST_CSS = `([\s\S]*?)`;/);
  return m ? new Function('return `' + m[1] + '`;')() : '';
})();
{
  const rule = (sel) => (toastCss.match(new RegExp('\\n\\' + sel + '\\{([^}]*)\\}')) || [])[1] || '';
  ok('the container rule declares pointer-events:none', /pointer-events:none/.test(rule('.wl-toast')), rule('.wl-toast').slice(0, 80));
  ok('the action rule takes pointer-events:auto back (Undo, Retry)', /pointer-events:auto/.test(rule('.wl-toastaction')));
}
// Behaviour, in a real browser where one launches. Declared, never faked: with no
// browser this section prints INCONCLUSIVE and counts nothing either way.
const browserCell = (async () => {
  let puppeteer, chromium;
  try { puppeteer = require('puppeteer-core'); chromium = require('@sparticuz/chromium').default; }
  catch { console.log('  INCONCLUSIVE \u2014 no browser package; the two rule cells above stand alone'); return; }
  let b;
  try {
    b = await puppeteer.launch({ args: [...chromium.args, '--no-sandbox'], executablePath: await chromium.executablePath(), headless: 'shell' });
  } catch (e) { console.log('  INCONCLUSIVE \u2014 the browser did not launch: ' + e.message.split('\n')[0]); return; }
  try {
    const pg = await b.newPage();
    await pg.setViewport({ width: 374, height: 844 });
    await pg.setContent('<style>' + toastCss + 'body{margin:0}#under{position:fixed;inset:0;width:100%;height:100%}</style>' +
      '<button id="under">the row beneath</button>' +
      '<div class="wl-toast"><span class="wl-toastdot"></span><span class="wl-toastmsg" id="msg">Launching soon.</span>' +
      '<button type="button" class="wl-toastaction" id="act">Undo</button></div>');
    const hit = await pg.evaluate(() => {
      const at = (el) => { const r = el.getBoundingClientRect(); return document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2).id; };
      return { msg: at(document.getElementById('msg')), act: at(document.getElementById('act')) };
    });
    ok('a tap on the notice lands on the row beneath it', hit.msg === 'under', 'hit ' + hit.msg);
    ok('a tap on the action lands on the action', hit.act === 'act', 'hit ' + hit.act);
  } finally { await b.close(); }
})();

browserCell.then(() => {
  // ── §7 · F-42.200 · FOUR SITES, ONE FACT ──────────────────────────────────
  sec('\u00a77 \u00b7 F-42.200 \u2014 the register wins');
  const reg = read(REG);
  ok('register \u00a74: Coming is APPROVED', reg.includes('| `CHIPS.coming` | Coming | \u2705 **APPROVED \u2014 see 1a** |'));
  ok('register \u00a74: Open has its row', /\| `CHIPS\.open` \| Open \| \u2705 \*\*VETOED 2026-09-05/.test(reg));
  ok('register \u00a71a records eight, closed, and S4(c) adding none', /the set is \*\*eight\*\*, closed/.test(reg) && /adds \*\*none\*\*/.test(reg));
  const solRaw = read(SOLC);
  const at = solRaw.indexOf('export const CHIPS');
  const doc = solRaw.slice(solRaw.lastIndexOf('/**', at), at);
  ok('copy.ts\u2019s CHIPS note says APPROVED and points at \u00a71a', /`coming` IS APPROVED/.test(doc) && /\u00a71a/.test(doc));
  const bsa = read(BSA);
  ok('bs_audit C8 lists Coming among the approved', /const VETOED_BEYOND = \['Open', 'Coming'\];/.test(bsa));
  ok('bs_audit C24 matches a table cell, never a substring', /reg\.includes\('\| ' \+ shipped \+ ' \|'\)/.test(bsa) && !/if \(!reg\.includes\(shipped\)\)/.test(strip(bsa)));

  // ── §8 · THE ADDRESSES ────────────────────────────────────────────────────
  sec('\u00a78 \u00b7 one home per address');
  ok('DATES_HREF and NUMBER_HREF are declared', addr('DATES_HREF') === '/vendor/dates' && addr('NUMBER_HREF') === '/vendor/number');
  const strays = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(P(dir), { withFileTypes: true })) {
      if (['node_modules', '.next', '.git'].includes(e.name)) continue;
      const rel = path.join(dir, e.name);
      if (e.isDirectory()) { walk(rel); continue; }
      if (!/\.(ts|tsx)$/.test(e.name) || rel === ROUTES) continue;
      if (/['"`]\/vendor\/(dates|number)\b/.test(strip(read(rel)))) strays.push(rel);
    }
  };
  for (const d of ['app', 'lib', 'components']) walk(d);
  ok('no second spelling of either address', strays.length === 0, strays.join(', '));
  ok('the hub reads both constants, never a literal', /dates:\s*DATES_HREF,/.test(strip(read(HUB))) && /number:\s*NUMBER_HREF,/.test(strip(read(HUB))));

  // ── §9 · THE FRAMES ───────────────────────────────────────────────────────
  sec('\u00a79 \u00b7 the committed frames draw the sheet');
  const mock = read(MOCK);
  const ids = [...mock.matchAll(/data-frame="([^"]+)"/g)].map((m) => m[1]);
  ok('five frames, as vetoed', ids.join(',') === 'D1-dates,D2-dates-tap,N1-number,N2-number-tap,H1-hub', ids.join(','));
  const shots = fs.readdirSync(P('docs/mocks')).filter((f) => /^shell-screens-mock__.+__(dark|light)__(374|390)\.png$/.test(f));
  ok('twenty captures committed beside it (5 \u00d7 2 arms \u00d7 374/390)', shots.length === 20, String(shots.length));
  const plain = mock.replace(/&amp;/g, '&').replace(/&rsquo;/g, '\u2019');
  const D = load(DCOPY).DATES, N = load(NCOPY).NUMBER;
  const drawn = [D.lede, ...D.can, D.already, D.cta, N.lede, ...N.can, copy.COPY.launchingSoon];
  ok('every vetoed byte is the byte the frame drew', drawn.every((s) => plain.includes(s)), drawn.filter((s) => !plain.includes(s)).join(' | '));

  console.log('\n' + (fail === 0 ? 'GREEN' : 'RED') + ' \u2014 b73 shell screens (pwa) ' + pass + '/' + (pass + fail));
  process.exit(fail === 0 ? 0 : 1);
}).catch((e) => { console.log('RED \u2014 the bench threw: ' + e.message); process.exit(1); });
