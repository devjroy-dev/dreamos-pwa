'use strict';
// scripts/lib/fe7_l4_kit.js · TDW CE-47 · L4 (FE-7) · the kit every L4 bench (b177 to b189) shares.
//
// THE DISCIPLINE (A-46.10, e-258, e-260): the dev server is started by the estate's own helper (b126_dev_server.js,
// its own process group) and chromium by puppeteer; both are stopped by stopTree on EVERY exit path (finish, a
// signal, a crash, process.exit), and the last cell of every run reads `ps` for anything this run started: a
// leftover is a red, never a note. The exit code is the verdict (0 green, 1 red, 2 nothing ran).
// THE TALLY: every printed FAIL is counted, and a run that printed nothing is not green (CE-47 item 7): each bench
// ends with "N green, M red" and a green count of zero is itself a red.
// THE FACES: the real faces (A-45.9). On a machine without Google Fonts set FONT_DIR to a folder of the
// @fontsource packs (fontsource-inter-*, fontsource-cormorant-garamond-*), as docs/design/tools/harness.mjs reads it.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ROOT = process.env.FE7_ROOT || path.resolve(__dirname, '..', '..');
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const { stopTree } = require(path.join(ROOT, 'scripts/lib/stop_tree.js'));
const { stripComments } = require(path.join(ROOT, 'scripts/lib/stripComments.cjs'));

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const code = (rel) => stripComments(read(rel));
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');

function tally(tag) {
  let pass = 0; let fail = 0; const failed = [];
  const ok = (c, name, info) => {
    if (c) { pass += 1; console.log(`  ok   ${name}`); return true; }
    fail += 1; failed.push(name);
    console.log(`  FAIL ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 240) + ']'}`);
    return false;
  };
  const sec = (t) => console.log(`\n§${t}`);
  const verdict = () => {
    console.log(`\n${tag}: ${pass} green, ${fail} red`);
    if (pass === 0) { console.log(`${tag}: nothing was counted green, so the run proves nothing (red).`); return 1; }
    if (fail) { console.log('FAILED: ' + failed.join(' | ')); return 1; }
    return 0;
  };
  return { ok, sec, verdict, get fail() { return fail; }, get pass() { return pass; } };
}

// ── glass: one server and one browser per run, both stopped on every exit path ──
const RUN = { server: null, browser: null, bpid: null, pids: new Set() };
function hardStop() {
  if (RUN.bpid) { try { stopTree(RUN.bpid); } catch (_e) { /* gone */ } RUN.bpid = null; }
  if (RUN.server && !RUN.server.treeStopped) { try { stopTree(RUN.server.dev.pid); } catch (_e) { /* gone */ } RUN.server.treeStopped = true; }
}
process.on('exit', hardStop);
for (const [sig, c] of [['SIGINT', 130], ['SIGTERM', 143], ['SIGHUP', 129]]) process.on(sig, () => process.exit(c));

async function startGlass(port) {
  await FIX.loadMe();
  const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
  const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
  const server = await dev.start(ROOT, port, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${port}/__api`, NEXT_TELEMETRY_DISABLED: '1' });
  RUN.server = server; RUN.pids.add(server.dev.pid);
  if (!(await server.up())) return null;
  const bin = process.env.CHROME_BIN || await chromium.executablePath();
  const browser = await puppeteer.launch({ executablePath: bin, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'] });
  RUN.browser = browser; RUN.bpid = browser.process() ? browser.process().pid : null; if (RUN.bpid) RUN.pids.add(RUN.bpid);
  return { server, browser, port };
}
/** Every descendant of these pids, read from /proc by parent (e-275: teardown waits for the whole tree, not one group). */
function descendants(roots) {
  const kids = new Map();
  for (const d of (() => { try { return fs.readdirSync('/proc'); } catch (_e) { return []; } })()) {
    if (!/^\d+$/.test(d)) continue;
    try { const st = fs.readFileSync(`/proc/${d}/stat`, 'utf8'); const ppid = Number(st.slice(st.lastIndexOf(')') + 2).split(' ')[1]); if (!kids.has(ppid)) kids.set(ppid, []); kids.get(ppid).push(Number(d)); } catch (_e) { /* gone */ }
  }
  const out = new Set(); const stack = roots.filter(Boolean).map(Number);
  while (stack.length) { const p = stack.pop(); if (out.has(p)) continue; out.add(p); for (const k of kids.get(p) || []) stack.push(k); }
  return [...out];
}
const alive = (pid) => { try { process.kill(pid, 0); const st = fs.readFileSync(`/proc/${pid}/stat`, 'utf8'); return !/^\S+ \(.*\) Z /.test(st); } catch (_e) { return false; } };
async function stopGlass() {
  const tree = descendants([RUN.bpid, RUN.server && RUN.server.dev && RUN.server.dev.pid]);   // e-275: taken BEFORE stopping
  if (RUN.browser) { try { await RUN.browser.close(); } catch (_e) { /* closed */ } }
  // e-275: let chromium collect its own children before its tree is stopped; a child killed first is left a zombie
  // that a container's PID 1 may never collect. Bounded at 5 s; gone means no /proc entry at all, zombie or not.
  { const kids = tree.filter((pid) => pid !== RUN.bpid && pid !== (RUN.server && RUN.server.dev && RUN.server.dev.pid));
    const exists = (pid) => fs.existsSync(`/proc/${pid}`);
    for (const t0 = Date.now(); RUN.bpid && kids.some((pid) => exists(pid) && descendants([RUN.bpid]).includes(pid)) && Date.now() - t0 < 5000;) await tick(100); }
  if (RUN.bpid) { try { stopTree(RUN.bpid); } catch (_e) { /* gone */ } RUN.bpid = null; }
  let portFree = true;
  if (RUN.server) { const r = await RUN.server.stop(); portFree = r.portFree; try { stopTree(RUN.server.dev.pid); } catch (_e) { /* gone */ } RUN.server.treeStopped = true; }
  // e-275, bounded teardown: wait until the whole tree is gone, at most 15 s; past it, kill what is left.
  for (const t0 = Date.now(); tree.some(alive) && Date.now() - t0 < 15000;) await tick(100);
  for (const pid of tree.filter(alive)) { try { process.kill(pid, 'SIGKILL'); } catch (_e) { /* gone */ } }
  return portFree;
}
/** Every process this run started that is still alive: its dev server's group and chromium's tree. */
function leftovers() {
  // A defunct entry (state Z) has already exited and holds nothing; it is collected when this process exits. Every
  // other state of a process this run started is a leftover and a red.
  const rows = String(require('child_process').spawnSync('ps', ['-eo', 'pid=,pgid=,stat=,args='], { encoding: 'utf8' }).stdout || '').split('\n').map((l) => l.trim()).filter(Boolean);
  return rows.filter((r) => { const [pid, pgid, st] = r.split(/\s+/); return !String(st).startsWith('Z') && (RUN.pids.has(Number(pid)) || RUN.pids.has(Number(pgid))); });
}

// ── fixtures, in the doors' own shapes (names invented; photographs are the repo's own examples) ──
const FIX = require('./fe7_l4_fixtures.js');

function faceCss() {
  const dir = process.env.FONT_DIR; if (!dir || !fs.existsSync(dir)) return '';
  const pick = (pre) => { const d = fs.readdirSync(dir).find((n) => n.startsWith(pre) && !n.endsWith('.tgz')); return d ? path.join(dir, d, 'package', 'files') : null; };
  const out = [];
  const face = (fam, d, file, w, st = 'normal') => { const f = path.join(d, file); if (fs.existsSync(f)) out.push(`@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(data:font/woff2;base64,${fs.readFileSync(f).toString('base64')}) format('woff2')}`); };
  const inter = pick('fontsource-inter-'); if (inter) for (const w of [400, 500, 600, 700]) face('Inter', inter, `inter-latin-${w}-normal.woff2`, w);
  const cg = pick('fontsource-cormorant-garamond-'); if (cg) for (const w of [400, 500]) face('Cormorant Garamond', cg, `cormorant-garamond-latin-${w}-normal.woff2`, w);
  if (!out.length) return '';
  return out.join('') + ":root{--font-inter:'Inter',sans-serif !important;--font-brand:'Cormorant Garamond',serif !important}";
}

/** Open a route at a width, in a theme, with a scenario's answers. Returns the page, with .found and .waited. */
// ── e-275 (CE-47 ADS-2): WAIT ON THE THING ITSELF, BOUNDED. No fixed pause decides a cell any more. Each wait returns
// { ms, timedOut } and never throws; a timeout is a fact the cell may report, not a pass.
const tick = (ms) => new Promise((r) => setTimeout(r, ms));
/** Count every request a page makes, and stamp DOM changes, so settle() can see quiet. Called by open(); exported for b257. */
async function instrument(p) {
  p.inflight = 0; p.lastNet = Date.now();
  p.on('request', () => { p.inflight++; p.lastNet = Date.now(); });
  const done = () => { p.inflight = Math.max(0, p.inflight - 1); p.lastNet = Date.now(); };
  p.on('requestfinished', done); p.on('requestfailed', done);
  await p.evaluateOnNewDocument(() => {
    window.__tdwLastMut = Date.now();
    const arm = () => new MutationObserver(() => { window.__tdwLastMut = Date.now(); }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, characterData: true });
    if (document.documentElement) arm(); else document.addEventListener('DOMContentLoaded', arm);
  });
}
/** The page is quiet: no request in flight and no DOM change for `quiet` ms. Capped at `max`. */
async function settle(p, { quiet = 300, max = 8000 } = {}) {
  const t0 = Date.now();
  for (;;) {
    const lastMut = await p.evaluate(() => window.__tdwLastMut || 0).catch(() => 0);
    const now = Date.now();
    if ((p.inflight || 0) === 0 && now - (p.lastNet || 0) >= quiet && now - lastMut >= quiet) return { ms: now - t0, timedOut: false };
    if (now - t0 >= max) return { ms: now - t0, timedOut: true };
    await tick(50);
  }
}
/** An element matching `sel` is on the page. Capped at `max`. */
async function waitFor(p, sel, max = 8000) {
  const t0 = Date.now();
  for (;;) {
    if (await p.evaluate((x) => !!document.querySelector(x), sel).catch(() => false)) return { ms: Date.now() - t0, timedOut: false };
    if (Date.now() - t0 >= max) return { ms: Date.now() - t0, timedOut: true };
    await tick(50);
  }
}
/** The page's URL satisfies `pred(url)`. Capped at `max`. */
async function waitUrl(p, pred, max = 8000) {
  const t0 = Date.now();
  for (;;) {
    if (pred(p.url())) return { ms: Date.now() - t0, timedOut: false };
    if (Date.now() - t0 >= max) return { ms: Date.now() - t0, timedOut: true };
    await tick(50);
  }
}
/** The dev server's log: its length now (a mark), and its quiet. */
function logMark(log = dev.LOG) { try { return fs.statSync(log).size; } catch (_e) { return 0; } }
async function logQuiet(log = dev.LOG, { quiet = 500, max = 15000 } = {}) {
  const t0 = Date.now(); let size = logMark(log); let since = Date.now();
  for (;;) {
    await tick(100); const now = logMark(log);
    if (now !== size) { size = now; since = Date.now(); }
    if (Date.now() - since >= quiet) return { ms: Date.now() - t0, timedOut: false };
    if (Date.now() - t0 >= max) return { ms: Date.now() - t0, timedOut: true };
  }
}
/**
 * THE RELOAD ITSELF (this dev server logs nothing on a file change; Next's own client does): a watcher page open on the
 * room BEFORE the write hears "[Fast Refresh] done" (or a full reload) after it. watchReload(g, url) -> { done(max), close() }.
 */
async function watchReload(g, url) {
  const w = await g.browser.newPage(); let heard = 0; let armed = false;
  w.on('console', (m) => { if (armed && /\[Fast Refresh\] done|\[HMR\] connected|full reload/i.test(m.text())) heard++; });
  w.on('load', () => { if (armed) heard++; });
  await w.goto(`http://localhost:${g.port}${url}`, { waitUntil: 'domcontentloaded', timeout: 180000 }).catch(() => {});
  await tick(300); armed = true;
  return {
    async done(max = 30000) { const t0 = Date.now(); while (!heard && Date.now() - t0 < max) await tick(100); return { ms: Date.now() - t0, timedOut: !heard }; },
    async close() { await w.close().catch(() => {}); },
  };
}
/** After a mutation's write: the dev server's next "Compiled" line past `mark` (for servers that log one). Capped at `max`. */
async function reloaded(mark, log = dev.LOG, max = 30000) {
  const t0 = Date.now();
  for (;;) {
    let tail = ''; try { const fd = fs.openSync(log, 'r'); const size = fs.fstatSync(fd).size; if (size > mark) { const b = Buffer.alloc(size - mark); fs.readSync(fd, b, 0, b.length, mark); tail = b.toString('utf8'); } fs.closeSync(fd); } catch (_e) { tail = ''; }
    if (/\bCompiled\b/.test(tail)) return { ms: Date.now() - t0, timedOut: false };
    if (Date.now() - t0 >= max) return { ms: Date.now() - t0, timedOut: true };
    await tick(100);
  }
}
/** e-277: before the first cell, every mutation's anchor is in its file exactly once and its planted text is absent;
 *  a planted text already present means a mutation was left applied: STOP, naming the file. Pure over a reader. */
function anchorsClean(muts, readFile = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8')) {
  const bad = [];
  for (const m of muts || []) {
    let src = ''; try { src = readFile(m.rel); } catch (e) { bad.push(`${m.rel}: unreadable`); continue; }
    if (src.split(m.from).length - 1 !== 1) bad.push(`${m.rel}: the anchor of "${m.name}" is not there exactly once`);
    if (m.to && !m.from.includes(m.to) && src.includes(m.to)) bad.push(`${m.rel}: "${m.name}" is already planted`);
  }
  return bad;
}
async function open(g, url, o = {}) {
  const p = await g.browser.newPage();
  await p.setViewport({ width: o.width || 374, height: o.height || 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  await p.setCookie({ name: 'tdw_wl_mode', value: o.mode || 'dark', domain: 'localhost', path: '/' },
    { name: 'tdw_layout', value: 'v2', domain: 'localhost', path: '/' });
  // As the harness does: first-visit keys read as seen, so no first-run tip covers the room (o.firstVisit keeps them).
  if (!o.firstVisit) await p.evaluateOnNewDocument(() => { try { Storage.prototype.getItem = new Proxy(Storage.prototype.getItem, { apply(t, st, a) { const r = Reflect.apply(t, st, a); if (r === null && /seen|first|onboard|intro/i.test(String(a[0]))) return '1'; return r; } }); } catch (_e) { /* fine */ } });
  const css = faceCss(); if (css) await p.evaluateOnNewDocument((c) => { document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = c; document.head.appendChild(s); }); }, css);
  const posted = []; p.posted = posted; const asked = []; p.asked = asked;
  // As the harness does: bypass the PWA's service worker, or it answers the room's reads before interception sees them.
  await instrument(p);
  const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
  await p.setRequestInterception(true);
  p.on('request', (r) => {
    const u = r.url();
    if (!u.includes('/__api/')) return r.continue();
    const route = u.split('/__api')[1].split('?')[0]; asked.push(r.method() + ' ' + route);
    let body = null; if (r.method() !== 'GET') { try { body = JSON.parse(r.postData() || 'null'); } catch (_e) { body = null; } posted.push({ route, body }); }
    const ans = r.method() === 'GET' ? FIX.answer(route, o.scen || {}) : FIX.post(route, o.scen || {});
    return r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(ans === undefined ? { ok: true } : ans) });
  });
  await p.goto(`http://localhost:${g.port}${url}`, { waitUntil: 'domcontentloaded', timeout: 180000 });
  const want = o.wait || '.wl-main .fr-room, .wl-main .fr-group';
  const t0 = Date.now(); const until = t0 + (o.timeout || 120000);
  const seen = () => p.evaluate((s) => !!document.querySelector(s), want).catch(() => false);
  while (Date.now() < until && !(await seen())) await new Promise((r) => setTimeout(r, 400));
  p.found = await seen(); p.waited = Date.now() - t0;
  p.settled = await settle(p, { max: Math.max(8000, o.settle || 0) });   // e-275: quiet, not a fixed pause
  return p;
}
/** Click the first button or link whose text starts with `t` (or matches a CSS selector when `t` starts with '@'). */
async function tap(p, t) {
  const done = await p.evaluate((s) => {
    const el = s[0] === '@' ? document.querySelector(s.slice(1)) : [...document.querySelectorAll('button,a,[role=button]')].find((x) => x.textContent.trim().startsWith(s));
    if (!el) return false; el.click(); return true;
  }, t).catch(() => false);
  p.settled = await settle(p);   // e-275: quiet, not 700 ms
  return done;
}
/**
 * THE TWO-LINE CAP, MEASURED: every row's facts (.fr-f) on the page. For each: its drawn line count (height over the
 * computed line height) and whether its text is clipped (scrollHeight above clientHeight: the clamp is hiding a
 * third line, which is a red just as a third drawn line is). The row's title (.fr-t) is not a fact line.
 */
function measureFacts(p) {
  return p.evaluate(() => [...document.querySelectorAll('.fr-row .fr-f')].map((el) => {
    const st = getComputedStyle(el); const lh = parseFloat(st.lineHeight) || (parseFloat(st.fontSize) * 1.4);
    return { text: el.textContent.trim().slice(0, 80), lines: Math.round(el.getBoundingClientRect().height / lh), clipped: el.scrollHeight > el.clientHeight + 1 };
  })).catch(() => null);
}
/** Every visible text leaf under a root, and every placeholder: for the word cells (no "couple", no long dash). */
function words(p, sel = '.wl-main') {
  return p.evaluate((s) => {
    const root = document.querySelector(s); if (!root) return null;
    const out = []; const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) { const t = n.textContent.replace(/\s+/g, ' ').trim(); const st = n.parentElement && getComputedStyle(n.parentElement); if (t && st && st.display !== 'none' && st.visibility !== 'hidden') out.push(t); }
    for (const e of root.querySelectorAll('input[placeholder],textarea[placeholder]')) out.push(e.getAttribute('placeholder'));
    return out;
  }, sel).catch(() => null);
}

/**
 * A MUTATION: plant `to` for `from` in a production file (exactly one occurrence), run `cell` (which must go red),
 * restore by sha. The restore runs on every exit path; a restore that does not match the original sha is a red.
 */
// ── F-44.419 and F-44.422 (CE-47, ruled 8 Oct 2026; built by ADS-2) · A MUTATION GOES THROUGH THE GUARD ─────────────
// Every plant goes through scripts/lib/mutation_guard.js: the original kept and synced, then a marker naming this run
// (pid and start time), then the mutation. A run killed at any instant leaves the tree recoverable, per tree, and the
// next start of ANY L4 bench restores it by sha, or refuses (rc 2), or, while that run is still alive, waits for it
// (bounded) and then refuses with rc 3 (recoverOrRefuse). Free space is checked before every write (lesson 5): below
// MIN_FREE the mutation is not planted and its cell is a named red.
// THE OLD JOURNAL IS RETIRED. It was one file in os.tmpdir() shared by every tree on the machine, read against the
// CURRENT tree: it restored a live run's mutation, two runs overwrote each other's, and a journal from tree X could be
// written into tree Y. It names no tree and holds no mutated sha, so nothing can prove whose bytes it means: a journal
// found at start is SET ASIDE (never deleted, never written into any tree) and named, for a person to compare.
const guard = require(path.join(ROOT, 'scripts/lib/mutation_guard.js'));
const OLD_JOURNAL = path.join(require('os').tmpdir(), 'fe7_l4_mutation_journal.json');
const MIN_FREE = Number(process.env.FE7_MIN_FREE_BYTES || 256 * 1024 * 1024);   // the env raises it in b257 §7 only, to prove the refusal
function freeBytes() { try { const f = fs.statfsSync(ROOT); return f.bavail * f.bsize; } catch (_e) { return null; } }
function recovered() {
  const said = [];
  if (fs.existsSync(OLD_JOURNAL)) {
    let j = null; try { j = JSON.parse(fs.readFileSync(OLD_JOURNAL, 'utf8')); } catch (_e) { j = null; }
    const file = j && j.rel ? path.join(ROOT, j.rel) : null;
    // Set aside ALWAYS, never deleted: the journal names no tree, so even a file that is the original HERE says nothing
    // of the tree that wrote it (seen 8 Oct 2026: a restart left one for the base tree while this tree was clean).
    const here = file && fs.existsSync(file) && sha(fs.readFileSync(file, 'utf8')) === j.sha ? 'the original in this tree' : 'NOT the original in this tree';
    const aside = `${OLD_JOURNAL}.aside-${Date.now()}`; fs.renameSync(OLD_JOURNAL, aside);
    said.push(`an old journal${j && j.rel ? ` for ${j.rel}` : ''} was set aside at ${aside} (the file is ${here}); it names no tree, so nothing was written; compare the file by hand in the tree that ran${j && j.sha ? ` (its original sha ${j.sha})` : ''}`);
  }
  const r = guard.recoverOrRefuse(ROOT, 'fe7_l4');
  for (const rel of r.restored) said.push(`restored ${rel} by sha`);
  return said.length ? said.join('; ') : null;
}
async function mutate(ok, name, rel, from, to, cell) {
  const file = path.join(ROOT, rel); const orig = fs.readFileSync(file, 'utf8'); const origSha = sha(orig);
  const n = orig.split(from).length - 1;
  if (n !== 1) { ok(false, `${name}: planted exactly once`, `${n} occurrences in ${rel}`); return; }
  const free = freeBytes();
  if (free !== null && free < MIN_FREE) {   // lesson 5: never start a write the disk cannot finish
    ok(false, `${name}: the cell goes red with the mutation planted`, `not planted: ${Math.round(free / 1048576)} MB free, ${MIN_FREE / 1048576} MB needed`);
    ok(sha(fs.readFileSync(file, 'utf8')) === origSha, `${name}: ${rel} restored to its sha`);
    return;
  }
  let planted = null; let red = null;
  const onExit = () => { if (planted) planted.restore(); };
  process.once('exit', onExit);
  try { planted = guard.apply(ROOT, rel, from, to, 'fe7_l4'); red = !(await cell()); } catch (e) { red = true; } finally { if (planted) planted.restore(); process.removeListener('exit', onExit); }
  ok(red === true && planted !== null, `${name}: the cell goes red with the mutation planted`, planted ? undefined : 'the guard did not plant it');
  ok(sha(fs.readFileSync(file, 'utf8')) === origSha, `${name}: ${rel} restored to its sha`);
}

/** Compile every route once, in parallel, before any page is timed (turbopack compiles a route on its first request). */
async function warm(g, urls) {
  await Promise.all([...new Set(urls)].map((u) => fetch(`http://localhost:${g.port}${u}`, { headers: { cookie: 'tdw_layout=v2; tdw_wl_mode=dark' } }).then((r) => r.text()).catch(() => null)));
}
/**
 * ONE RUNNER for b178 to b189: recovery through the guard first; the source cells; glass (warmed); the glass cells; the mutations
 * (unless --no-mutate); then the stop, the port and the leftovers. The exit code is the verdict.
 * spec: { tag, port, urls, source(ok, sec), glass(g, ok, sec), mutations: [{ name, rel, from, to, cell: async (g) => bool }] }
 */
async function runBench(spec) {
  const back = recovered();   // F-44.422: a killed run's mutation is restored BEFORE the anchors are read
  { const bad = anchorsClean(spec.mutations); if (bad.length) { console.log('STOP e-277: a mutation anchor is not clean before the first cell:\n  ' + bad.join('\n  ')); process.exit(1); } }
  const T = tally(spec.tag); const { ok, sec } = T;
  const quiet = (c) => !!c; const nosec = () => {};
  const end = async () => {
    sec('9 NOTHING LEFT');
    const portFree = await stopGlass();
    for (const t0 = Date.now(); leftovers().length && Date.now() - t0 < 15000;) await tick(200);   // e-275: until nothing is left, bounded
    const left = leftovers();
    ok(portFree, `9.1 port ${spec.port} is free`);
    ok(left.length === 0, '9.2 nothing this run started is still running', left.join(' | '));
    process.exit(T.verdict());
  };
  try {
    ok(true, `0.0 no interrupted mutation left in the tree${back ? ` (${back})` : ''}`);
    if (spec.source) spec.source(ok, sec);
    const g = await startGlass(spec.port);
    if (!g) { ok(false, '0.1 the dev server came up'); return end(); }
    await warm(g, spec.urls || []);
    if (spec.glass) await spec.glass(g, ok, sec);
    if (!process.argv.includes('--no-mutate') && spec.mutations && spec.mutations.length) {
      sec('8 MUTATIONS');
      for (const m of spec.mutations) {
        const watch = m.glass ? await watchReload(g, (spec.urls || ['/'])[0]) : null;   // e-275: heard, not guessed
        await mutate(ok, m.name, m.rel, m.from, m.to, async () => {
          if (watch) { const r = await watch.done(); await watch.close(); if (r.timedOut) console.log(`  note  ${m.name}: no refresh heard within 30 s`); }   // e-275: the reload itself
          return m.cell(g, quiet, nosec);
        });
      }
    }
  } catch (e) { ok(false, '0.2 the run did not crash', e && e.stack ? e.stack.split('\n').slice(0, 3).join(' / ') : e); }
  return end();
}
/**
 * THE SPEC'S STANDING CHECKS for one room at one width (FE6_to_FE7 SPEC.md §Benches): the two-line cap measured;
 * no short month and no "Sept" on the page; no "couple"; every visible control 44 high or more (or an inset 44 box,
 * data-tap44); one "?" on the room head whose card fits (nothing scrolls) in at most three how-to lines, with every
 * control it names drawn on the room's screen.
 */
async function roomChecks(g, url, width, o = {}) {
  const p = await open(g, url, { width, wait: o.wait || '.fr-row .fr-f', scen: o.scen, settle: 1500 });
  const r = { found: p.found };
  r.facts = await measureFacts(p);
  r.text = await p.evaluate(() => (document.querySelector('.wl-main') || document.body).innerText).catch(() => '');
  r.short = (r.text.match(/\b\d{1,2} (Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\b(?![a-z])/g) || []);
  r.couple = /\bcouples?\b/i.test(r.text);
  r.small = await p.evaluate(() => [...document.querySelectorAll('.wl-main button, .wl-main a, .wl-main [role=switch], .wl-main select')]
    .filter((e) => e.offsetParent !== null && e.getBoundingClientRect().width > 0)
    .filter((e) => { const h = e.getBoundingClientRect().height; return h < 43.5 && !e.hasAttribute('data-tap44') && !e.closest('label'); })
    .map((e) => `${(e.innerText || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 30)} (${Math.round(e.getBoundingClientRect().height)})`)).catch(() => ['?']);
  r.q = await p.evaluate(() => document.querySelectorAll('.wl-roomhead .wl-helpq').length).catch(() => 0);
  r.screen = await p.evaluate(() => [...document.querySelectorAll('.wl-main button, .wl-main a, .wl-main .fr-t, .wl-main [role=switch]')].map((e) => (e.innerText || e.getAttribute('aria-label') || '').trim())).catch(() => []);
  await tap(p, '@.wl-roomhead .wl-helpq'); await waitFor(p, '.wl-helpcard', 5000);   // e-275: the card itself
  r.card = await p.evaluate(() => { const c = document.querySelector('.wl-helpcard'); if (!c) return null; return { lines: c.querySelectorAll('.wl-helpdo li').length, fits: c.scrollHeight <= c.clientHeight + 1, text: c.innerText }; }).catch(() => null);
  await p.close();
  return r;
}
/** Every "tap X" a card names, by b140's own rule (a leading "it", "its", "the" or a lone "+" is not a name). */
function tappedNames(text) {
  const out = [];
  for (const m of String(text || '').matchAll(/\btap ([^.;:]+)/gi)) {
    for (let part of m[1].split(/,\s*|\s+then\s+|\s+or\s+|\s+and\s+/)) {
      part = part.replace(/^(then\s+)?(tap\s+)?/i, '').replace(/\s+(beside|on|under|in|from|for|if)\s+.*$/i, '').replace(/\s+to\s+[a-z].*$/, '').trim();
      if (/^(type|fill|choose|give|check|set|come|read|copy|confirm)\b/i.test(part)) break;
      if (!part || /^(it|its|the|a|an|them|this|\+)$/i.test(part) || /^(it|its|the|a|an|them|this)\s/i.test(part)) continue;
      out.push(part);
    }
  }
  return out;
}
/** The standing cells, one room, both widths. */
async function standing(g, ok, room, url, o = {}) {
  for (const w of [374, 360]) {
    const r = await roomChecks(g, url, w, o);
    const bad = (r.facts || []).filter((x) => x.lines > 2 || x.clipped);
    // F-44.418 (CE-47 ADS-2, 7 Oct 2026): the four measuring cells below need a room that drew. With nothing drawn they
    // measured nothing and read green; now each is red and says so. A room that drew reads exactly as before.
    const drew = !!(r.found && Array.isArray(r.facts) && (o.noRows || r.facts.length > 0)); const none = 'nothing drew to measure';
    ok(drew, `${room} at ${w}: the room draws${o.noRows ? '' : ' its rows'}`, r.found ? `${(r.facts || []).length} rows` : 'did not draw');
    ok(drew && bad.length === 0, `${room} at ${w}: every row's facts in at most two lines, nothing clipped`, drew ? bad.map((b) => b.text).join(' | ') : none);
    ok(drew && r.short.length === 0, `${room} at ${w}: full months only`, drew ? r.short.join(', ') : none);
    ok(drew && !r.couple, `${room} at ${w}: no "couple"`, drew ? undefined : none);
    ok(drew && r.small.length === 0, `${room} at ${w}: every control 44 high or more`, drew ? r.small.join(' | ') : none);
    const names = tappedNames(r.card && r.card.text);
    const missing = names.filter((n) => !r.screen.some((s) => s.includes(n)));
    ok(r.q === 1 && r.card && r.card.lines <= 3 && r.card.fits && missing.length === 0, `${room} at ${w}: one "?", its card fits in three lines, every control it names drawn`, r.card ? `${r.card.lines} lines fits=${r.card.fits} missing=${missing.join(',')}` : `q=${r.q} no card`);
  }
}
/** The words on a page must not say "couple" (the standing rule), in any case or plural. */
const noCouple = (ws) => Array.isArray(ws) && !ws.some((w) => /\bcouples?\b/i.test(w));
module.exports = { OLD_JOURNAL, descendants, anchorsClean, watchReload, settle, waitFor, waitUrl, reloaded, logMark, logQuiet, instrument, roomChecks, tappedNames, standing, runBench, noCouple, recovered, warm, ROOT, read, code, sha, tally, startGlass, stopGlass, leftovers, open, tap, measureFacts, words, mutate, FIX, stopTree };
