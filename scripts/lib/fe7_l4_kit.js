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
async function stopGlass() {
  if (RUN.browser) { try { await RUN.browser.close(); } catch (_e) { /* closed */ } }
  if (RUN.bpid) { try { stopTree(RUN.bpid); } catch (_e) { /* gone */ } RUN.bpid = null; }
  let portFree = true;
  if (RUN.server) { const r = await RUN.server.stop(); portFree = r.portFree; try { stopTree(RUN.server.dev.pid); } catch (_e) { /* gone */ } RUN.server.treeStopped = true; }
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
  await new Promise((r) => setTimeout(r, o.settle || 900));
  return p;
}
/** Click the first button or link whose text starts with `t` (or matches a CSS selector when `t` starts with '@'). */
async function tap(p, t) {
  const done = await p.evaluate((s) => {
    const el = s[0] === '@' ? document.querySelector(s.slice(1)) : [...document.querySelectorAll('button,a,[role=button]')].find((x) => x.textContent.trim().startsWith(s));
    if (!el) return false; el.click(); return true;
  }, t).catch(() => false);
  await new Promise((r) => setTimeout(r, 700));
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
// THE JOURNAL: before a plant, the original bytes go to disk; a run killed by SIGKILL (which no handler survives)
// leaves the journal, and the next run of ANY L4 bench restores it first and says so (recovered()).
const JOURNAL = path.join(require('os').tmpdir(), 'fe7_l4_mutation_journal.json');
function recovered() {
  if (!fs.existsSync(JOURNAL)) return null;
  const j = JSON.parse(fs.readFileSync(JOURNAL, 'utf8'));
  const file = path.join(ROOT, j.rel);
  if (sha(fs.readFileSync(file, 'utf8')) !== j.sha) fs.writeFileSync(file, j.orig);
  fs.unlinkSync(JOURNAL);
  return j.rel;
}
async function mutate(ok, name, rel, from, to, cell) {
  const file = path.join(ROOT, rel); const orig = fs.readFileSync(file, 'utf8'); const origSha = sha(orig);
  fs.writeFileSync(JOURNAL, JSON.stringify({ rel, sha: origSha, orig }));
  const n = orig.split(from).length - 1;
  if (n !== 1) { try { fs.unlinkSync(JOURNAL); } catch (_e) { /* gone */ } ok(false, `${name}: planted exactly once`, `${n} occurrences in ${rel}`); return; }
  const restore = () => { if (sha(fs.readFileSync(file, 'utf8')) !== origSha) fs.writeFileSync(file, orig); try { fs.unlinkSync(JOURNAL); } catch (_e) { /* gone */ } };
  process.once('exit', restore);
  fs.writeFileSync(file, orig.replace(from, to));
  let red = null;
  try { red = !(await cell()); } catch (e) { red = true; } finally { restore(); }
  ok(red === true, `${name}: the cell goes red with the mutation planted`);
  ok(sha(fs.readFileSync(file, 'utf8')) === origSha, `${name}: ${rel} restored to its sha`);
}

/** Compile every route once, in parallel, before any page is timed (turbopack compiles a route on its first request). */
async function warm(g, urls) {
  await Promise.all([...new Set(urls)].map((u) => fetch(`http://localhost:${g.port}${u}`, { headers: { cookie: 'tdw_layout=v2; tdw_wl_mode=dark' } }).then((r) => r.text()).catch(() => null)));
}
/**
 * ONE RUNNER for b178 to b189: the journal first; the source cells; glass (warmed); the glass cells; the mutations
 * (unless --no-mutate); then the stop, the port and the leftovers. The exit code is the verdict.
 * spec: { tag, port, urls, source(ok, sec), glass(g, ok, sec), mutations: [{ name, rel, from, to, cell: async (g) => bool }] }
 */
async function runBench(spec) {
  const T = tally(spec.tag); const { ok, sec } = T;
  const quiet = (c) => !!c; const nosec = () => {};
  const end = async () => {
    sec('9 NOTHING LEFT');
    const portFree = await stopGlass(); await new Promise((r) => setTimeout(r, 800));
    const left = leftovers();
    ok(portFree, `9.1 port ${spec.port} is free`);
    ok(left.length === 0, '9.2 nothing this run started is still running', left.join(' | '));
    process.exit(T.verdict());
  };
  try {
    const back = recovered();
    ok(true, `0.0 no interrupted mutation left in the tree${back ? ` (restored ${back} from the journal)` : ''}`);
    if (spec.source) spec.source(ok, sec);
    const g = await startGlass(spec.port);
    if (!g) { ok(false, '0.1 the dev server came up'); return end(); }
    await warm(g, spec.urls || []);
    if (spec.glass) await spec.glass(g, ok, sec);
    if (!process.argv.includes('--no-mutate') && spec.mutations && spec.mutations.length) {
      sec('8 MUTATIONS');
      for (const m of spec.mutations) {
        await mutate(ok, m.name, m.rel, m.from, m.to, async () => {
          if (m.glass) await new Promise((r) => setTimeout(r, 2500));   // the dev server's reload
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
  await tap(p, '@.wl-roomhead .wl-helpq'); await new Promise((q) => setTimeout(q, 600));
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
    ok(r.found && Array.isArray(r.facts) && (o.noRows || r.facts.length > 0), `${room} at ${w}: the room draws${o.noRows ? '' : ' its rows'}`, r.found ? `${(r.facts || []).length} rows` : 'did not draw');
    ok(bad.length === 0, `${room} at ${w}: every row's facts in at most two lines, nothing clipped`, bad.map((b) => b.text).join(' | '));
    ok(r.short.length === 0, `${room} at ${w}: full months only`, r.short.join(', '));
    ok(!r.couple, `${room} at ${w}: no "couple"`);
    ok(r.small.length === 0, `${room} at ${w}: every control 44 high or more`, r.small.join(' | '));
    const names = tappedNames(r.card && r.card.text);
    const missing = names.filter((n) => !r.screen.some((s) => s.includes(n)));
    ok(r.q === 1 && r.card && r.card.lines <= 3 && r.card.fits && missing.length === 0, `${room} at ${w}: one "?", its card fits in three lines, every control it names drawn`, r.card ? `${r.card.lines} lines fits=${r.card.fits} missing=${missing.join(',')}` : `q=${r.q} no card`);
  }
}
/** The words on a page must not say "couple" (the standing rule), in any case or plural. */
const noCouple = (ws) => Array.isArray(ws) && !ws.some((w) => /\bcouples?\b/i.test(w));
module.exports = { roomChecks, tappedNames, standing, runBench, noCouple, recovered, warm, ROOT, read, code, sha, tally, startGlass, stopGlass, leftovers, open, tap, measureFacts, words, mutate, FIX, stopTree };
