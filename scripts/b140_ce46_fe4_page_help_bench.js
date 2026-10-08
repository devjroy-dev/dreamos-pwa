#!/usr/bin/env node
// FLOOR-SUBJECTS: components/vendor/Header.tsx components/worklist/PageHelp.tsx lib/worklist/pageHelp.ts scripts/lib/floor_reap.sh
// FLOOR-STATES: env
// FLOOR-WHOLE: args --mutate
// (CE-47 FE-6 L3 r2: the floor runs this bench's mutations only when a delivery names it or a subject above;
//  scripts/lib/floor_slice.sh reads these three lines. b174 §F proves the subjects cover every file the bench mutates.)
'use strict';
// scripts/b140_ce46_fe4_page_help_bench.js · TDW CE-46 · FE-4 · the "?" on every surface (the founder's ruling of
// 27 Sept 2026; Fork A (3): the shell draws every room's t1 head with the "?" on its line).
//
// §1 THE SOURCE: every drawing route under app/vendor/(shell)/ has an entry in lib/worklist/pageHelp.ts with a
//    line 1, and no entry is orphaned (the set is DERIVED from the route tree, C-44.7); line 1 is READ from ROOM_DESC
//    and ROW_DESC, typed only for the four with no home; the shell mounts RoomHead once above {children} and no room
//    draws a title h1 of its own (SliceShell, Notes, .sol-title, the Advisor); the carousel is gone (no file, no
//    reader outside comments, no tipsOpen); the seen key is read in an effect, never in render, and the site states
//    the ruling.
// §2 ON GLASS, every route, in headless Chromium against next dev in mock mode (C-43.18), 390 wide, the real faces
//    (A-45.9): the head is the first child of the main column; the title is the shell's own byte at t1 with 16px
//    above; the "?" is a 44px target on the title's line at the right edge; no card at rest; the dot on an unseen
//    phone and not on a seen one; open by tap: a dialog, the route's own line 1 (and its held lines when they land),
//    inset by one gutter each side, vertically centred, content-fit under 60dvh; close by Got it, focus back on
//    the "?"; the seen key written. On the three sample rooms (a legacy, a solutions, a plain room) in BOTH themes:
//    close by the scrim and by Escape, and "Ask TDW about this" landing in the sheet with the room's name in the
//    input and nothing sent.
// §3 THE RUNG LAW on the card, by element in the real faces: every text on a rung, nothing italic, tracking only on
//    t5, controls at t4 in sentence case (F5).
// §4 MUTATIONS (--mutate), each planted in production source, rendered by the running server's reload, restored by
//    sha: M1 a route's entry removed (1.1); M2 the "?" not drawn (2.3 on leads); M3 the scrim's close removed (2.9);
//    M4 the seen write removed (2.8); M5 a raw px on the card's name (3.1); M6 the carousel's import back in Header
//    (1.4, source); M7 the pre-floor pass narrowed to this root again (1.7, A-46.6, driven); M8 a room's
//    connects emptied (1.8); M9 a step naming a button no control draws, the dropped sheet's "Continue to Meta" (1.9).
//    F-44.365 (CE-47 ADS-2, 7 Oct 2026): 1.7 narrows the reaper to what it planted (FLOOR_REAP_ONLY_PIDS); 1.10 reads that
//    the narrowing is a no-op unless set and the floor never sets it; M10 the narrowing applied when unset (1.10, source).
// THE EXIT CODE IS THE VERDICT (0 green, 1 red). --routes=/vendor/a,/vendor/b narrows §2; --modes=dark,light.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');
const { stopTree } = require('./lib/stop_tree.js');
const { stripComments } = require('./lib/stripComments.cjs');

const ROOT = path.resolve(__dirname, '..');
const P = (rel) => path.join(ROOT, rel);
const read = (f) => fs.readFileSync(P(f), 'utf8');
const has = (f) => fs.existsSync(P(f));
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const code = (s) => stripComments(s);
const PORT = 3993;
let pass = 0, fail = 0;
const cell = (name, why) => { if (!why) { pass++; console.log('GREEN ' + name); } else { fail++; console.log('RED   ' + name + ' \u2014 ' + why); } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const argv = (k, d) => { const a = process.argv.find((x) => x.startsWith('--' + k + '=')); return a ? a.split('=')[1] : d; };
const MUTATE = process.argv.includes('--mutate');
const MODES = argv('modes', 'dark,light').split(',');
const SAMPLE = ['/vendor/leads', '/vendor/dates', '/vendor/billing', '/vendor/calendar', '/vendor/today'];   // a legacy room, a solutions room, a plain room, and the two F-44.219 exception rooms
const LOG = path.join(process.env.TMPDIR || '/tmp', 'b140-last-run.log'); // A-45.6
const logLine = (s) => { try { fs.appendFileSync(LOG, s + '\n'); } catch (_e) { /* the run goes on */ } };
try { fs.writeFileSync(LOG, ''); } catch (_e) { /* the run goes on */ }

// ── THE ROUTE SET, DERIVED FROM THE TREE (C-44.7) ────────────────────────────────────────────────────────────
function routes() {
  const out = [];
  const walk = (dir, url) => {
    for (const e of fs.readdirSync(P(dir), { withFileTypes: true })) {
      if (e.isDirectory()) walk(dir + '/' + e.name, url + '/' + e.name);
      else if (e.name === 'page.tsx') out.push(url === '' ? '/vendor' : '/vendor' + url);
    }
  };
  walk('app/vendor/(shell)', '');
  // the one that draws nothing: a redirect to Rooms (read, never assumed)
  const redirect = code(read('app/vendor/(shell)/page.tsx'));
  const drawn = out.filter((r) => !(r === '/vendor' && /router\.replace\('\/vendor\/rooms'\)/.test(redirect)));
  return drawn.sort();
}

// pageHelp.ts, loaded through TypeScript so the bench reads the module rather than a regex of it
function loadPageHelp() {
  const ts = require(P('node_modules/typescript'));
  const tr = (f) => ts.transpileModule(read(f), { compilerOptions: { module: 1, target: 7 } }).outputText;
  const req = (name) => {
    if (name === '@/lib/worklist/copy') { const m = { exports: {} }; new Function('module', 'exports', 'require', tr('lib/worklist/copy.ts'))(m, m.exports, req); return m.exports; }
    if (name === '@/lib/solutions/copy') { const m = { exports: {} }; new Function('module', 'exports', 'require', tr('lib/solutions/copy.ts'))(m, m.exports, req); return m.exports; }
    if (name === '@/lib/solutions/routes') { const m = { exports: {} }; new Function('module', 'exports', 'require', tr('lib/solutions/routes.ts'))(m, m.exports, req); return m.exports; }
    if (name === '@/lib/worklist/rooms') { const m = { exports: {} }; new Function('module', 'exports', 'require', tr('lib/worklist/rooms.ts'))(m, m.exports, req); return m.exports; }
    return require(name);
  };
  const m = { exports: {} }; new Function('module', 'exports', 'require', tr('lib/worklist/pageHelp.ts'))(m, m.exports, req);
  return { ...m.exports, COPY: req('@/lib/worklist/copy').COPY };
}

function sourceCells() {
  const R = routes();
  const help = loadPageHelp();
  const keys = Object.keys(help.PAGE_HELP);
  const missing = R.filter((r) => !help.helpFor(r === '/vendor/collab/[post_id]/responses' ? '/vendor/collab/p1/responses' : r));
  const orphan = keys.filter((k) => !R.includes(k));
  const noLine = keys.filter((k) => !help.PAGE_HELP[k].what || !help.PAGE_HELP[k].what.trim());
  cell(`1.1 every drawing route under app/vendor/(shell)/ (${R.length}, derived) has a pageHelp entry with a line 1, and no entry is orphaned`,
    missing.length ? 'no entry: ' + missing.join(', ') : orphan.length ? 'orphaned: ' + orphan.join(', ') : noLine.length ? 'no line 1: ' + noLine.join(', ') : R.length < 30 ? `only ${R.length} routes derived` : null);
  const src = code(read('lib/worklist/pageHelp.ts'));
  const reads = (src.match(/entry\(ROOM_DESC\.\w+/g) || []).length + (src.match(/entry\(ROW_DESC\.\w+/g) || []).length;
  const typed = (src.match(/entry\(TYPED_WHAT\.\w+/g) || []).length;
  cell('1.2 line 1 is READ from ROOM_DESC and ROW_DESC (the founder\u2019s bytes), typed only for the four with no home',
    reads !== keys.length - 4 || typed !== 4 ? `${reads} read, ${typed} typed, ${keys.length} entries` : null);
  const wl = code(read('components/worklist/WorklistShell.tsx')); const ph = code(read('components/worklist/PageHelp.tsx'));
  const bad = [];
  if ((wl.match(/<RoomHead /g) || []).length !== 1 || !/<RoomHeadProvider><main className="wl-main"><RoomHead title=\{title\} \/>\{children\}<\/main><\/RoomHeadProvider>/.test(wl)) bad.push('the shell does not mount RoomHead exactly once above children, inside the override provider');
  if (!/const headLine = override === undefined \? title : override;/.test(ph) || !/<h1 data-room-title="" className="wl-roomtitle">\{headLine\}<\/h1>/.test(ph)) bad.push('RoomHead does not draw the shell byte (or the F-44.219 override) as the title');
  // F-44.219: exactly two rooms mount RoomHeadTitle, Calendar (the month) and Today (the status line); nothing else may
  const mounts = [];
  const walk0 = (dir) => { for (const e of fs.readdirSync(P(dir), { withFileTypes: true })) { const rel = dir + '/' + e.name; if (e.isDirectory()) { if (e.name !== 'node_modules') walk0(rel); } else if (/\.tsx$/.test(e.name) && /<RoomHeadTitle /.test(code(read(rel)))) mounts.push(rel); } };
  ['app', 'components'].forEach(walk0);
  if (mounts.sort().join() !== ['app/vendor/(shell)/calendar/screen.tsx', 'app/vendor/(shell)/today/page.tsx'].join()) bad.push('RoomHeadTitle mounted by: ' + mounts.join(', '));
  if (!/<RoomHeadTitle line=\{MONTHS\[month\]\} \/>/.test(code(read('app/vendor/(shell)/calendar/screen.tsx')))) bad.push('Calendar does not hand the month to the head');
  if (!/<RoomHeadTitle line=\{!feed\.responded && !feed\.pending \? COPY\.todayNotLive : firstRun \? COPY\.todayNothingYet : resting \? COPY\.todayRestingHead : null\} \/>/.test(code(read('app/vendor/(shell)/today/page.tsx')))) bad.push('Today does not hand its status line to the head');
  if (/wl-status|wl-tresthead/.test(code(read('app/vendor/(shell)/today/page.tsx')) + code(read('components/worklist/TodayCards.tsx')))) bad.push('Today still draws a status h1 of its own');
  if (!/\.wl-billprice\{font:var\(--wl-t2\)/.test(code(read('components/worklist/BillingRoom.tsx')))) bad.push('Billing\u2019s price is not at t2');
  for (const [f, re, what] of [['components/vendor/slices/SliceShell.tsx', /data-room-title|ROOM_NAME\[/, 'SliceShell draws a title'], ['app/vendor/(shell)/notes/body.tsx', /data-room-title|NOTES_NAME/, 'Notes draws a title'],
    ['app/vendor/(shell)/advisor/page.tsx', /wl-advtitle/, 'the Advisor draws a title'], ['components/solutions/SolutionsPieces.tsx', /\.sol-title\{/, 'Pieces keeps the .sol-title rule']]) {
    if (re.test(code(read(f)))) bad.push(what);
  }
  const solMounts = [];
  const walk = (dir) => { for (const e of fs.readdirSync(P(dir), { withFileTypes: true })) { const rel = dir + '/' + e.name; if (e.isDirectory()) { if (e.name !== 'node_modules') walk(rel); } else if (/\.tsx$/.test(e.name) && /className="sol-title"/.test(code(read(rel)))) solMounts.push(rel); } };
  ['app', 'components'].forEach(walk);
  if (solMounts.length) bad.push('.sol-title still mounted: ' + solMounts.join(', '));
  cell('1.3 the room\u2019s head has one drawer: the shell mounts RoomHead once above the room, and no room draws a title h1 of its own', bad.length ? bad.join(' | ') : null);
  const refs = [];
  const walk2 = (dir) => { for (const e of fs.readdirSync(P(dir), { withFileTypes: true })) { const rel = dir + '/' + e.name; if (e.isDirectory()) { if (e.name !== 'node_modules') walk2(rel); } else if (/\.(tsx?|mjs|js|cjs)$/.test(e.name) && /TipsCarousel/.test(code(read(rel)))) refs.push(rel); } };
  ['app', 'components', 'lib', 'hooks'].forEach((d) => has(d) && walk2(d));
  cell('1.4 the carousel is gone: no components/vendor/TipsCarousel.tsx, no reader in app/ components/ lib/ hooks/ (comment-stripped), no tipsOpen in Header',
    has('components/vendor/TipsCarousel.tsx') ? 'the file exists' : refs.length ? 'readers: ' + refs.join(', ') : /tipsOpen/.test(code(read('components/vendor/Header.tsx'))) ? 'tipsOpen survives in Header' : null);
  const effect = /useEffect\(\(\) => \{ setFirst\(!readSeen\(seenKey\)\); \}, \[seenKey\]\);/.test(ph);
  const renderRead = (ph.match(/readSeen\(/g) || []).length;
  const stated = /ruled this per-phone key outside \u00a78's native clause/.test(read('components/worklist/PageHelp.tsx'));
  cell('1.5 the seen key is read in an effect after mount, never during render, and the site states the chair\u2019s ruling on \u00a78',
    !effect ? 'no effect reads the key' : renderRead !== 2 ? `readSeen called ${renderRead} times (its definition and the effect are the two)` : !stated ? 'the ruling is not stated at the site' : null);
  const inline = [...ph.matchAll(/>\s*([A-Za-z][^<{}]*?)\s*<\//g)].map((m) => m[1].trim()).filter((t) => t && !/^\?$/.test(t));
  cell('1.6 no vendor-facing byte is typed in PageHelp.tsx: every string reaches it from COPY or pageHelp.ts (the "?" glyph is the one drawn mark)', inline.length ? 'inline: ' + inline.slice(0, 3).join(' | ') : null);
  // 1.8 the words cut (the founder, 28 Sept 2026): every surface says what it does, HOW TO DO its main things (1 to 4
  // steps) and where it connects, in the plain register (R-45.30: no dash; R-45.20: no her or his).
  {
    const bad = [];
    for (const [k, e] of Object.entries(help.PAGE_HELP)) {
      if (!e.can || e.can.length < 1 || e.can.length > 4) bad.push(k + ': ' + (e.can ? e.can.length : 0) + ' steps');
      if (!e.connects || !e.connects.trim()) bad.push(k + ': no connects line');
      const words = [e.what, e.app || '', e.connects, ...(e.can || []).map((c) => c.line)].join(' ');
      if (/[\u2013\u2014]| - /.test(words)) bad.push(k + ': a dash');
      if (/\b(her|his)\b/i.test(words)) bad.push(k + ': her or his');
    }
    cell('1.8 every surface carries what it does, 1 to 4 how-to steps and a connects line, plain (no dash, no her or his)', bad.length ? bad.slice(0, 6).join(' | ') : null);
  }
  // 1.9 A-46.9: every button word a step names after "tap" resolves to a label a screen draws: JSX text or a string
  // literal in a .tsx under app/ or components/, or a copy value under lib/ whose key a .tsx references. A label that
  // lives only in a copy home no control renders (the dropped sheet's "Continue to Meta", ADS.sheetGo) is NOT drawn.
  {
    const L = drawnLabels(ROOT, stripComments);
    const norm = (x) => x.toLowerCase().replace(/[^a-z0-9+ ]/g, '').trim();
    const miss = [];
    for (const [k, e] of Object.entries(help.PAGE_HELP)) for (const c of (e.can || [])) for (const w of tapped(c.line)) {
      const lw = w.toLowerCase();
      if (!L.some((x) => x === lw || norm(x) === norm(lw))) miss.push(`${k}: "${w}"`);
    }
    cell('1.9 A-46.9: every button a how-to step names is a label some control draws (counted from the source)', miss.length ? miss.slice(0, 6).join(' | ') : null);
  }
  // 1.7 A-46.6 (ruled 28 Sept 2026, rides this cut): the floor's pass before the first member stops ANY next dev,
  // whatever its root, by program name and pid, and prints what it killed; after a member it stays this root.
  // Driven, not read: a stand-in server (a node program whose command line reads "next dev") is started in a
  // directory that is NOT this root, and a bash whose command line merely contains "next dev" beside it.
  cell('1.7 A-46.6: before the first member the reaper stops a next dev from ANY root, by pid, and prints what it killed; after a member it leaves another root alone; a shell is never touched',
    reapCell(P('scripts/lib/floor_reap.sh')));
  // 1.10 F-44.365 (CE-47, design accepted 7 Oct 2026; built by ADS-2): 1.7 now narrows the reaper to what it planted, so
  // the any-root scope it proves must be the floor's own when the narrowing is absent. Read, and held both ways inline.
  { const reaper = read('scripts/lib/floor_reap.sh'); const others = floorFiles();
    const why = narrowRead(reaper, others);
    const unsetNarrows = narrowRead(reaper.replace('in_only() { [ -z "${FLOOR_REAP_ONLY_PIDS:-}" ] ||', 'in_only() { false ||'), others);
    const floorSets = narrowRead(reaper, [...others, ['scripts/run-floor.sh (planted)', read('scripts/run-floor.sh') + '\nexport FLOOR_REAP_ONLY_PIDS="$$"\n']]);
    const oneUngated = narrowRead(reaper.replace('if is_next "$args" && in_only "$pid" && ', 'if is_next "$args" && '), others);
    cell('1.10 F-44.365: the reaper narrows only when FLOOR_REAP_ONLY_PIDS is set, in both its searches, and nothing the floor runs sets it (so unset, the scope is any-root before the floor, as A-46.6 ruled)',
      why || (!unsetNarrows ? 'held one way only: a narrowing that applies when unset stayed green' : !floorSets ? 'held one way only: run-floor.sh setting it stayed green' : !oneUngated ? 'held one way only: one search left ungated stayed green' : null)); }
  return { R, help };
}
// ── A-46.9 (ruled 29 Sept 2026, from e-219): a help step names a button only when a control DRAWS that label ──
function drawnLabels(ROOT, stripComments) {
  const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
  const walk = (dir, out) => { for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) { const rel = dir + '/' + e.name; if (e.isDirectory()) { if (e.name !== 'node_modules') walk(rel, out); } else if (/\.(tsx?|mjs)$/.test(e.name)) out.push(rel); } return out; };
  const ui = walk('app', []).concat(walk('components', [])).filter((f) => f.endsWith('.tsx'));
  const uiSrc = ui.map((f) => stripComments(read(f))).join('\n');
  const labels = new Set();
  // what a screen can draw: JSX text, and every string literal in a .tsx under app/ or components/ (their own
  // label tables, attribute strings, conditional labels such as {x ? 'Delete invoice' : 'Delete'})
  for (const m of uiSrc.matchAll(/>\s*([^<>{}\n]{1,60}?)\s*</g)) labels.add(m[1].trim());
  for (const m of uiSrc.matchAll(/'([^'\n]{1,60})'|"([^"\n]{1,60})"/g)) labels.add((m[1] || m[2]).trim());
  // copy values whose key a .tsx references (drawn by a control): KEY: 'Value' anywhere under lib/, key used as .KEY in app/components
  for (const f of walk('lib', [])) {
    const src = stripComments(read(f));
    for (const m of src.matchAll(/\b([A-Za-z_][A-Za-z0-9_]*):\s*'([^'\n]{1,60})'/g)) {
      if (new RegExp('\\.' + m[1] + '\\b').test(uiSrc)) labels.add(m[2].trim());
    }
  }
  // a drawn label is compared without its trailing glyphs or counts ("All details ↓", "new · 1")
  return [...labels].filter(Boolean).map((l) => l.toLowerCase().replace(/[\s·]*[↓↑→›⌄].*$/, '').replace(/\s*·\s*\d+$/, '').trim());
}
// the button words a step names: the phrases after "tap", split on commas, "then", "or", "and"
function tapped(line) {
  const out = [];
  for (const m of line.matchAll(/\btap ([^.;:]+)/gi)) {
    let seg = m[1];
    // a list after "tap" runs until an item starts with another verb (type, fill, choose, give, check, set, come)
    for (let part of seg.split(/,\s*|\s+then\s+|\s+or\s+|\s+and\s+/)) {
      // a trailing purpose ("to read it before it goes") is cut, a destination in a label ("Continue to Meta") is not
      part = part.replace(/^(then\s+)?(tap\s+)?/i, '').replace(/\s+(beside|on|under|in|from|for|if)\s+.*$/i, '').replace(/\s+to\s+[a-z].*$/, '').trim();
      if (/^(type|fill|choose|give|check|set|come|read|copy|confirm)\b/i.test(part)) break;
      if (!part || /^(it|its|the|a|an|them|this|\+)$/i.test(part) || /^(it|its|the|a|an|them|this)\s/i.test(part)) continue;
      out.push(part);
    }
  }
  return out;
}

function reapCell(reaper) {
  const run = read('scripts/run-floor.sh');
  if (!/# A-46\.6 \(CE-46, ruled 28 Sept 2026[\s\S]{0,700}\nLEAK_LINE=\$\(bash scripts\/lib\/floor_reap\.sh "\(before the floor\)"\)/.test(run)) return 'run-floor.sh does not call the pre-floor pass under its A-46.6 label';
  const os = require('os');
  const elsewhere = fs.mkdtempSync(path.join(os.tmpdir(), 'b140-reap-'));
  // planted as ORPHANS (started in the background of a shell that exits), so init reaps them when stopped: a
  // child of this bench would linger as a zombie, and a zombie answers kill -0 as if it were alive
  const orphan = (cmd) => ({ pid: +String(spawnSync('bash', ['-c', `cd "${elsewhere}" && { ${cmd} >/dev/null 2>&1 & echo $!; }`], { encoding: 'utf8' }).stdout).trim() });
  // e-217: the stand-in runs on THIS node, and B140_NODE24 (a Node 24 binary, whose process reads comm=MainThread on
  // Linux) plants a second one when given, so the cell is proven on both names wherever the bench can reach them
  const plantWith = (bin) => orphan(`"${bin}" -e 'setInterval(() => {}, 1e9)' next dev -p 3999`);
  const plant = () => plantWith(process.execPath);
  const shell = orphan(`bash -c 'sleep 60 # next dev'`);
  const alive = (pid) => { const st = String(spawnSync('ps', ['-o', 'stat=', '-p', String(pid)], { encoding: 'utf8' }).stdout).trim(); return !!st && !st.startsWith('Z'); };
  const kill = (pid) => { try { process.kill(pid, 'SIGKILL'); } catch (_e) { /* gone */ } };
  const wait = (ms) => { const t = Date.now() + ms; while (Date.now() < t) { /* spin */ } };
  let why = null;
  const a = plant(); const a24 = process.env.B140_NODE24 ? plantWith(process.env.B140_NODE24) : null; wait(400);
  // F-44.365: both passes narrowed to what this cell planted (the stand-ins AND the shell, so "a shell is never touched"
  // still means something), so beside other benches it can stop nobody else's server. 1.10 holds that the floor never narrows.
  const env = { ...process.env, FLOOR_REAP_ONLY_PIDS: [a.pid, a24 && a24.pid, shell.pid].filter(Boolean).join(' ') };
  const member = spawnSync('bash', [reaper, 'b140-member'], { cwd: ROOT, encoding: 'utf8', env });
  if (!alive(a.pid)) why = 'after a member, a next dev in ANOTHER root was stopped (the after-member pass must stay this root)';
  else if (member.stdout.trim()) why = 'after a member, it printed "' + member.stdout.trim().slice(0, 120) + '"';
  let before = { stdout: '' };
  if (!why) {
    before = spawnSync('bash', [reaper, '(before the floor)'], { cwd: ROOT, encoding: 'utf8', env });
    wait(500);
    if (alive(a.pid)) why = 'before the floor, a next dev in another root survived';
    else if (a24 && alive(a24.pid)) why = 'before the floor, a Node 24 next dev (comm MainThread) in another root survived';
    else if (!new RegExp('^REAPED \\(before the floor, A-46\\.6\\)[^\\n]*KILLED pid ' + a.pid + ' in ' + elsewhere.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(before.stdout)) why = 'it did not print what it killed: "' + before.stdout.trim().slice(0, 160) + '"';
    else if (!alive(shell.pid)) why = 'a shell whose line merely contains "next dev" was stopped';
  }
  kill(a.pid); if (a24) kill(a24.pid); kill(shell.pid); fs.rmSync(elsewhere, { recursive: true, force: true });
  return why;
}
// F-44.365: the reaper's narrowing is a no-op unless set, gates BOTH candidate searches, and no file the floor runs
// (anything under scripts/ but a bench and the reaper itself) names FLOOR_REAP_ONLY_PIDS outside a comment.
function floorFiles() {
  const out = []; const walk = (rel) => { for (const e of fs.readdirSync(P(rel), { withFileTypes: true })) { const r = rel + '/' + e.name;
    if (e.isDirectory()) walk(r); else if (!/^b\d+_/.test(e.name) && r !== 'scripts/lib/floor_reap.sh' && /\.(sh|mjs|cjs|js)$/.test(e.name)) out.push([r, read(r)]); } };
  walk('scripts'); return out;
}
function narrowRead(reaper, files) {
  if (!/\nonly=" \$\{FLOOR_REAP_ONLY_PIDS:-\} "\nin_only\(\) \{ \[ -z "\$\{FLOOR_REAP_ONLY_PIDS:-\}" \] \|\| case "\$only" in \*" \$1 "\*\) return 0 ;; \*\) return 1 ;; esac; \}\n/.test(reaper)) return 'floor_reap.sh: in_only is not a no-op when FLOOR_REAP_ONLY_PIDS is unset';
  const gated = (reaper.match(/^ *if [^\n]*in_only "\$pid"[^\n]*then cands="\$cands \$pid"/gm) || []).length;
  const searches = (reaper.match(/^ *if [^\n]*then cands="\$cands \$pid"/gm) || []).length;
  if (gated !== 2 || searches !== 2) return `floor_reap.sh: ${gated} of ${searches} candidate searches gated by in_only (want 2 of 2)`;
  const naming = files.filter(([, src]) => src.split('\n').some((l) => { const c = l.replace(/(^|\s)(#|\/\/).*$/, ''); return c.includes('FLOOR_REAP_ONLY_PIDS'); })).map(([r]) => r);
  return naming.length ? 'the floor would narrow: ' + naming.join(', ') + ' names FLOOR_REAP_ONLY_PIDS' : null;
}

// ── THE BROWSER ARM ──────────────────────────────────────────────────────────────────────────────────────
function probe(mode, route, depth, seen) {
  const r = spawnSync(process.execPath, [P('scripts/lib/b140_page_help_probe.mjs'), String(PORT), mode, route, depth, seen], { cwd: ROOT, encoding: 'utf8', timeout: 420000 });
  logLine(`probe ${mode} ${route} ${depth} ${seen} rc=${r.status}\n${(r.stdout || '').slice(-1600)}\n${(r.stderr || '').slice(-600)}`);
  try { return JSON.parse((r.stdout || '').trim().split('\n').pop()); } catch (_e) { return { errors: ['no JSON from the probe: ' + (r.stderr || '').slice(-200)] }; }
}
const TYPE = { t1: [24, 500, 'Cormorant'], t2: [17, 500, 'DM Sans'], t3: [14, 400, 'DM Sans'], t4: [12, 500, 'DM Sans'], t5: [11, 500, 'DM Sans'] };
const onRung = (t, k) => t && Math.abs(t.size - TYPE[k][0]) < 0.5 && t.weight === TYPE[k][1] && t.family.startsWith(TYPE[k][2]);
const anyRung = (t) => Object.keys(TYPE).some((k) => onRung(t, k));

function glassCells(tag, x, route, help, depth, seen) {
  const e = help.PAGE_HELP[help.helpKey(route)];
  if (!x || !x.loaded || !x.rest) { cell(`2.0 ${tag} the room mounts with its head`, (x && x.errors && x.errors.join(' | ')) || 'the room did not mount'); return; }
  const R = x.rest;
  // F-44.219 (ruled 28 Sept 2026): on Calendar the head is the MONTH; on Today it is the STATUS LINE (one of three
  // COPY bytes) or nothing at all in the working and unsettled states (R-39.13), the "?" alone. Everywhere else it is
  // the room's name, the shell label's own byte.
  const MONTH = /^(January|February|March|April|May|June|July|August|September|October|November|December)$/;
  const isCal = route === '/vendor/calendar', isToday = route === '/vendor/today';
  const STATUS = [help.COPY.todayNotLive, help.COPY.todayNothingYet, help.COPY.todayRestingHead];
  const headOk = isCal ? MONTH.test(R.title || '') : isToday ? (R.title === null || STATUS.includes(R.title)) : R.title === R.shellLabel;
  const headless = isToday && R.title === null;
  cell(`2.1 ${tag} the head is the first child of the main column, and its line is ${isCal ? 'the month (F-44.219)' : isToday ? 'the status line or none (F-44.219)' : 'the shell\u2019s own byte'} at t1 with 16px above it`,
    !R.headFirstInMain ? 'the head is not first in .wl-main' : !headOk ? `head "${R.title}" (label "${R.shellLabel}")` : headless ? null : !onRung(R.titleType, 't1') ? `title at ${JSON.stringify(R.titleType)}` : R.titlePadTop !== 16 ? `${R.titlePadTop}px above` : null);
  // Any 24px text on glass that is not the head is a second t1; a site excused here is excused BY ITS EXACT TEXT with
  // its finding, so the cell stays green on a known site and reds on any new one.
  // Two sites found by this census on 28 Sept 2026, NOT this cut's to re-dress (both are Espresso-era chrome in rooms
  // TYPE_5 has not reached, FE-2's owed cut), filed and excused BY THEIR EXACT TEXT:
  //   F-44.220  contracts/screen.tsx:774  the empty state "No agreements yet." typed at 24px Cormorant, a second t1 on Contracts
  //   F-44.221  collab/[post_id]/responses/screen.tsx:222  the page's own <h1> "Interested vendors" at 25px italic (off the
  //             rungs, italic against the rung law) under a back arrow the shell already provides; a second h1 on the page
  const KNOWN = { '/vendor/contracts': ['DIV:No agreements yet.'], '/vendor/collab/p1/responses': ['H1:Interested vendors'] };
  const excused = KNOWN[route] || [];
  const others = (R.t1s || []).filter((t) => !t.startsWith('H1.wl-roomtitle') && !excused.includes(t));
  const extraH1 = excused.filter((t) => t.startsWith('H1:')).length;
  cell(`2.2 ${tag} ${headless ? 'no h1 and no t1 on the page (Today working/unsettled, R-39.13)' : 'one h1 in the room, the head\u2019s, and no second t1'}${excused.length ? ' (F-44.22' + (route === '/vendor/contracts' ? '0' : '1') + ' excused by text)' : ''}`,
    !R.t1s ? 'no census' : headless ? (R.h1s === 0 && others.length === 0 ? null : `${R.h1s} h1s, t1 on ${JSON.stringify(R.t1s)}`) : (R.h1s === 1 + extraH1 && others.length === 0 ? null : `${R.h1s} h1s, t1 on ${JSON.stringify(R.t1s)}`));
  const q = R.q;
  cell(`2.3 ${tag} the "?" is a 44px target on the title\u2019s line at its right edge, a 1px ring in the shell's teal (--atelier-accent-text, this theme) with the glyph at t4`,
    !q ? 'no "?"' : Math.round(q.box.w) !== 44 || Math.round(q.box.h) !== 44 ? `${q.box.w}x${q.box.h}` : (R.titleBox && Math.abs(q.box.cy - R.titleBox.cy) > 6) ? `off the line by ${Math.abs(q.box.cy - R.titleBox.cy).toFixed(1)}px`
      : q.box.x + q.box.w < R.mainRight - R.gutter - 14 ? `not at the right edge (${q.box.x + q.box.w} vs ${R.mainRight - R.gutter})` : !onRung(q.ring, 't4') ? 'the glyph is not t4' : q.ringBorder !== '1px' ? `ring border ${q.ringBorder}` : q.ringColor !== q.accent ? `ring ${q.ringColor}, the teal is ${q.accent}` : q.aria !== 'What is this page' ? `aria "${q.aria}"` : null);
  cell(`2.4 ${tag} the first-visit dot is ${seen === 'unseen' ? 'on' : 'off'} (${seen} phone)`, q ? ((seen === 'unseen') === q.dotDrawn ? null : `dot ${q.dotDrawn ? 'drawn' : 'absent'}`) : 'no "?"');
  cell(`2.5 ${tag} no card at rest`, R.card ? 'a card is open at rest' : null);
  const c = x.open;
  cell(`2.6 ${tag} tap opens a dialog carrying the route\u2019s own lines: the name, line 1${e.can.length ? ', the can-do lines' : ''}${e.connects ? ', the connects line' : ''}`,
    !x.tapped ? 'no "?" to tap' : !c ? 'no card' : c.role !== 'dialog' || c.modal !== 'true' ? 'not a modal dialog' : c.name !== R.shellLabel ? `name "${c.name}" (room ${R.shellLabel})` : c.what !== e.what ? `what "${c.what}" vs "${e.what}"`
      : c.lines.join('|') !== e.can.map((l) => l.line).join('|') ? `lines ${c.lines.join('|')}` : (c.connects || '') !== (e.connects || '') ? `connects "${c.connects}"` : e.can.length && c.icons.length !== e.can.length ? `${c.icons.length} icons` : null);
  cell(`2.7 ${tag} the card is inset one gutter each side, vertically centred, content-fit under 60dvh, on the scrim`,
    !c ? 'no card' : Math.abs(c.box.x - R.gutter) > 0.6 || Math.abs(c.vw - c.box.r - R.gutter) > 0.6 ? `x ${c.box.x} right ${c.vw - c.box.r} (gutter ${R.gutter})` : Math.abs((c.box.y + c.box.h / 2) - c.vh / 2) > 2 ? `centre ${(c.box.y + c.box.h / 2).toFixed(1)} vs ${c.vh / 2}` : Math.abs(parseFloat(c.maxH) - c.vh * 0.6) > 1 ? `max-height ${c.maxH} (60dvh is ${c.vh * 0.6})` : c.overflowY !== 'auto' ? 'no inner scroll' : c.box.h > c.vh * 0.6 + 1 ? 'taller than 60dvh' : !c.scrim || c.scrim === 'rgba(0, 0, 0, 0)' ? 'no scrim' : c.btns.length !== 1 || c.btns.some((b) => b.h < 44) ? 'not one control at 44px' : null);
  cell(`2.8 ${tag} opening writes the seen key and clears the dot`, x.storedAfterOpen !== '1' ? `stored "${x.storedAfterOpen}"` : x.firstAfterOpen !== '0' ? `dot state ${x.firstAfterOpen}` : null);
  cell(`2.9 ${tag} Got it closes the card and focus returns to the "?"`, !x.afterGotIt ? 'not measured' : x.afterGotIt.card ? 'the card stayed' : !x.afterGotIt.focusOnQ ? 'focus not on the "?"' : null);
  if (depth === 'full') {
    cell(`2.10 ${tag} the scrim closes it, and focus returns`, !x.reopened1 ? 'did not reopen' : !x.afterScrim || x.afterScrim.card ? 'the card stayed' : !x.afterScrim.focusOnQ ? 'focus not on the "?"' : null);
    cell(`2.11 ${tag} Escape closes it, and focus returns`, !x.reopened2 ? 'did not reopen' : !x.afterEscape || x.afterEscape.card ? 'the card stayed' : !x.afterEscape.focusOnQ ? 'focus not on the "?"' : null);
    cell(`2.12 ${tag} the card carries ONE control, Got it, no Ask TDW button, and no ask request left the phone while it was used`,
      !c ? 'no card' : c.btns.length !== 1 || !/^got it$/i.test(c.btns[0].txt) ? `controls: ${c.btns.map((b) => b.txt).join(' | ')}` : x.askPosts ? `${x.askPosts} ask request(s) left` : null);
  }
  // §3 the rung law on the card
  if (c) {
    const off = c.texts.filter((t) => !anyRung(t));
    cell(`3.1 ${tag} every text on the card sits on a rung (size, face, weight) in the real faces`, !x.realFaces ? 'the real faces did not load' : off.length ? off.slice(0, 3).map((t) => `"${t.txt}" ${t.size}/${t.weight} ${t.family}`).join(' | ') : null);
    const ital = c.texts.filter((t) => t.italic);
    cell(`3.2 ${tag} nothing is italic`, ital.length ? ital.map((t) => `"${t.txt}"`).join(' | ') : null);
    const trk = c.texts.filter((t) => t.ls !== 'normal' && parseFloat(t.ls) !== 0 && Math.abs(t.size - 11) > 0.5);
    cell(`3.3 ${tag} tracking only on t5`, trk.length ? trk.slice(0, 3).map((t) => `"${t.txt}" ls ${t.ls}`).join(' | ') : null);
    const caps = c.texts.filter((t) => t.control && (t.tt === 'uppercase' || !onRung(t, 't4')));
    cell(`3.4 ${tag} F5: the two controls at t4 in sentence case`, caps.length ? caps.map((t) => `"${t.txt}" ${t.tt}`).join(' | ') : null);
    const icons = c.icons.filter((i) => Math.round(i.w) !== 18 || !/rgb/.test(i.stroke));
    if (e.can.length) cell(`3.5 ${tag} every line icon is 18px in a token ink`, icons.length ? `${icons.length} off` : null);
  }
}

async function startDev() {
  const log = fs.openSync(path.join(process.env.TMPDIR || '/tmp', 'b140-dev.log'), 'w');
  const dev = spawn('npx', ['--no-install', 'next', 'dev', '-p', String(PORT)], { cwd: ROOT, detached: true, stdio: ['ignore', log, log],
    env: { ...process.env, NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` } });
  for (let i = 0; i < 240; i += 1) {
    const r = spawnSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '90', `http://localhost:${PORT}/vendor/leads`], { encoding: 'utf8' });
    if (/^[23]/.test(r.stdout)) return dev;
    await sleep(1000);
  }
  stopTree(dev.pid); return null;
}
const done = () => { console.log(`b140: ${pass} pass, ${fail} fail`); process.exit(fail ? 1 : 0); };

(async () => {
  console.log('b140 \u00b7 the "?" on every surface');
  const { R, help } = sourceCells();
  if (process.argv.includes('--source')) return done();
  const only = argv('routes', null);
  const ROUTES = (only ? only.split(',') : R).map((r) => (r === '/vendor/collab/[post_id]/responses' ? '/vendor/collab/p1/responses' : r));
  fs.rmSync(P('.next/dev'), { recursive: true, force: true }); // A-45.5
  const dev = await startDev();
  if (!dev) { cell('2.0 the dev server answers', 'next dev did not come up'); return done(); }
  try {
    for (const route of ROUTES) {
      const full = SAMPLE.includes(route);
      for (const mode of (full ? MODES : [MODES[0]])) {
        glassCells(`[${route} ${mode}]`, probe(mode, route, full ? 'full' : 'quick', 'unseen'), route, help, full ? 'full' : 'quick', 'unseen');
        if (full && mode === MODES[0]) { const s = probe(mode, route, 'quick', 'seen'); cell(`2.4 [${route} ${mode}] the dot is off on a seen phone`, s && s.rest && s.rest.q ? (s.rest.q.dotDrawn ? 'dot drawn' : null) : 'not measured'); }
      }
    }
    if (MUTATE) {
      const muts = [
        { id: 'M1', file: 'lib/worklist/pageHelp.ts', from: "  [DATES_HREF]: entry(ROW_DESC.dates, {", to: "  ['/vendor/m1-not-a-route']: entry(ROW_DESC.dates, {", source: () => { let red = false; try { const h = loadPageHelp(); red = !h.helpFor('/vendor/dates'); } catch (_e) { red = true; } return red; }, cell: '1.1' },
        { id: 'M2', file: 'components/worklist/PageHelp.tsx', from: '        {help && (\n          <button ref={qRef}', to: '        {help && false && (\n          <button ref={qRef}', route: '/vendor/leads', red: (x) => !(x.rest && x.rest.q), cell: '2.3' },
        { id: 'M3', file: 'components/worklist/PageHelp.tsx', from: 'className="wl-helpscrim" aria-label={COPY.helpClose} onClick={onClose} />', to: 'className="wl-helpscrim" aria-label={COPY.helpClose} />', route: '/vendor/leads', depth: 'full', red: (x) => !!(x.afterScrim && x.afterScrim.card), cell: '2.10' },
        { id: 'M4', file: 'components/worklist/PageHelp.tsx', from: 'if (first) { writeSeen(seenKey); setFirst(false); }', to: 'if (first) { setFirst(false); }', route: '/vendor/leads', red: (x) => x.storedAfterOpen !== '1', cell: '2.8' },
        { id: 'M5', file: 'components/worklist/PageHelp.tsx', from: '.wl-helpname{font:var(--wl-t2);', to: '.wl-helpname{font:500 19px/1.3 var(--font-dm-sans);', route: '/vendor/leads', red: (x) => !!(x.open && x.open.texts.some((t) => !anyRung(t))), cell: '3.1' },
        { id: 'M8', file: 'lib/worklist/pageHelp.ts', from: "    connects: 'Every cost lands in Books.' }),", to: "    connects: '' }),", source: () => { try { const h = loadPageHelp(); return !h.PAGE_HELP[Object.keys(h.PAGE_HELP).find((k) => /expenses/.test(k))].connects; } catch (_e) { return true; } }, cell: '1.8' },
        // RE-AIMED BY LABEL (CE-47, FE-8, the chair's ruling B): the Ads card names Continue to Meta already (the line as it stands), which
        // its sheet draws; M9 plants a button no control draws, as b140_v2's M9 does
        { id: 'M9', file: 'lib/worklist/pageHelp.ts', from: "To start: tap Connect ad account, then Continue to Meta. Meta opens", to: "To start: tap Connect ad account, then Continue to Facebook. Meta opens", source: () => { let red = false; try { const h = loadPageHelp(); const L = drawnLabels(ROOT, stripComments); const n = (x) => x.toLowerCase().replace(/[^a-z0-9+ ]/g, '').trim(); red = !Object.values(h.PAGE_HELP).every((e) => (e.can || []).every((c) => tapped(c.line).every((w) => L.some((x) => n(x) === n(w))))); } catch (_e) { red = true; } return red; }, cell: '1.9' },
        { id: 'M10', file: 'scripts/lib/floor_reap.sh', from: 'in_only() { [ -z "${FLOOR_REAP_ONLY_PIDS:-}" ] ||', to: 'in_only() { false ||', source: () => !!narrowRead(read('scripts/lib/floor_reap.sh'), floorFiles()), cell: '1.10' },
        { id: 'M7', file: 'scripts/lib/floor_reap.sh', from: 'scope=root; [ "$member" = "(before the floor)" ] && scope=any', to: 'scope=root', source: () => !!reapCell(P('scripts/lib/floor_reap.sh')), cell: '1.7' },
        { id: 'M6', file: 'components/vendor/Header.tsx', from: "import { useVendorMe } from '@/hooks/vendor/useVendorMe';", to: "import { useVendorMe } from '@/hooks/vendor/useVendorMe';\nimport { TipsCarousel } from '@/components/vendor/TipsCarousel';", source: () => { const refs = code(read('components/vendor/Header.tsx')); return /TipsCarousel/.test(refs); }, cell: '1.4' },
      ];
      for (const m of muts) {
        const abs = P(m.file); const orig = fs.readFileSync(abs, 'utf8'); const h = sha(orig);
        if (!orig.includes(m.from)) { cell(`4.${m.id} the anchor exists`, 'anchor not found in ' + m.file); continue; }
        let red = false;
        try {
          fs.writeFileSync(abs, orig.replace(m.from, m.to));
          if (m.source) red = m.source();
          else { await sleep(7000); const x = probe('dark', m.route, m.depth || 'quick', 'unseen'); red = !!(x && x.loaded) && m.red(x); }
        } finally { fs.writeFileSync(abs, orig); }
        const restored = sha(fs.readFileSync(abs, 'utf8')) === h;
        cell(`4.${m.id} reddens ${m.cell}, and the file is restored by sha`, !restored ? 'NOT RESTORED' : red ? null : `${m.cell} stayed green under the mutation`);
        if (!m.source) await sleep(7000);
      }
    }
  } finally { stopTree(dev.pid); }
  return done();
})();
