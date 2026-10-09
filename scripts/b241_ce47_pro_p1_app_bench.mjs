#!/usr/bin/env node
// scripts/b241_ce47_pro_p1_app_bench.mjs · CE-47 · PRO · P1 app half: the Business papers room and the check page, driven
// IN THE REAL APP (C-43.18): next dev in mock mode, the v2 layout, headless Chromium, both themes at 374 wide, real taps.
// The papers doors are answered by a stateful fake of dream-os src/api/vendor/papers.js and src/api/public/check.js (the
// shapes b240 holds on the server side); every other door by the design harness.
// argv: dark | light (one theme per run); --shots writes the frames to $SHOTS (no cell depends on them).
import path from 'path'; import fs from 'fs'; import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
process.env.TDW_LAYOUT_DEFAULT = 'v2'; const PORT = +(process.env.PORT || 4120); process.env.PORT = String(PORT);
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const { stopTree } = require(path.join(ROOT, 'scripts/lib/stop_tree.js'));
const H = await import(path.join(ROOT, 'docs/design/tools/harness.mjs'));
const MODE = process.argv.includes('light') ? 'light' : 'dark'; const SHOTS = process.argv.includes('--shots') ? (process.env.SHOTS || '/tmp/b241') : null;
let pass = 0, fail = 0; const failed = [];
const ok = (c, name, info) => { if (c) { pass++; console.log('  PASS  ' + name); } else { fail++; failed.push(name); console.log('  FAIL  ' + name + (info === undefined ? '' : '  [' + String(info).slice(0, 240) + ']')); } };

// ── the fake papers server (state per page) ──
const { VID: V } = await import(path.join(ROOT, 'scripts/lib/b123_fixtures.mjs'));
function fakePapers(o = {}) {
  const S = { papers: o.papers || [], log: [] };
  const lines = (k, f) => (k === 'statement' ? [['Name', 'DEV440 Test Makeup'], ['Trade', 'Makeup artist'], ['City', 'Delhi'], ['Period', `${f.from} to ${f.to}`], ['Invoices raised', '14'], ['Invoiced', 'Rs 6,85,000'], ['Received on these invoices', 'Rs 5,92,500']]
    : k === 'ca_pack' ? [['Name', 'DEV440 Test Makeup'], ['Period', `${f.from} to ${f.to}`]] : [['Name', 'DEV440 Test Makeup'], ['Trade', 'Makeup artist'], ['City', 'Delhi'], ['Weddings on TDW', '14, verified by TDW']]);
  const TITLE = { certificate: 'Professional certificate', id_card: 'Professional ID', statement: 'Business statement', ca_pack: 'Ready for your CA' };
  let n = 0;
  return { S, answer(method, rt, body) {
    S.log.push([method, rt, body]);
    if (rt === `/api/v2/vendor/papers/${V}` && method === 'GET') return { ok: true, papers: S.papers };
    if (rt === `/api/v2/vendor/portfolio/${V}`) return { ok: true, total: 3, images: [
      { id: 'img-1', image_url: 'https://res.cloudinary.com/tdw/image/upload/v1/me.jpg', approval_state: 'approved', caption: null, aesthetic_tags: [], is_hero: true, in_carousel: true, rejection_reason: null, created_at: '2026-09-01T00:00:00Z' },
      { id: 'img-2', image_url: 'https://res.cloudinary.com/tdw/image/upload/v1/look.jpg', approval_state: 'pending', caption: null, aesthetic_tags: [], is_hero: false, in_carousel: true, rejection_reason: null, created_at: '2026-09-02T00:00:00Z' },
      { id: 'img-3', image_url: 'https://res.cloudinary.com/tdw/image/upload/v1/no.jpg', approval_state: 'rejected', caption: null, aesthetic_tags: [], is_hero: false, in_carousel: true, rejection_reason: 'blurry', created_at: '2026-09-03T00:00:00Z' }] };
    if (rt === `/api/v2/vendor/papers/${V}/about`) return { ok: true, about: { name: 'DEV440 Test Makeup', trade: o.trade || 'Makeup artist', city: 'Delhi', weddings_verified: 14, as_of: '2026-10-06', gstin: o.gstin || null } };
    if (rt === `/api/v2/vendor/papers/${V}` && method === 'POST') {
      if (body.kind === 'statement' && !body.purpose) return { status: 400, body: { ok: false, error: 'Pick who the statement is for.' } };
      n += 1; const code = `TDW-${['7Q4K', '3H8C', '9K2M', '4RTW'][n - 1] || 'AAAA'}-2M9P`;
      const p = { id: `00000000-0000-4000-8000-00000000000${n}`, kind: body.kind, title: TITLE[body.kind], period_from: body.period_from || null, period_to: body.period_to || null, purpose: body.purpose || null,
        issued_at: '2026-10-06T06:00:00Z', issued_on: '6 October 2026', withdrawn_at: null, state: 'valid', check_code: code, check_url: `https://thedreamwedding.in/check/${code}`,
        lines: lines(body.kind, { from: body.period_from, to: body.period_to }), note: body.kind === 'statement' ? 'These figures are as DEV440 Test Makeup recorded them in TDW. TDW confirms this statement was issued from her TDW account on 6 October 2026. TDW has not audited or verified these figures.' : 'Weddings are counted by TDW from bookings with an invoice and a payment recorded in TDW.' };
      if (body.photo_url) p.photo_url = body.photo_url;
      S.papers.unshift(p); return { ok: true, paper: p };
    }
    const wd = rt.match(new RegExp(`^/api/v2/vendor/papers/${V}/([^/]+)/withdraw$`));
    if (wd && method === 'POST') { const p = S.papers.find((x) => x.id === wd[1]); if (p) { p.state = 'withdrawn'; p.withdrawn_at = '2026-10-06T07:00:00Z'; } return { ok: true, withdrawn: true }; }
    const ck = rt.match(/^\/api\/v2\/public\/check\/([^/]+)$/);
    if (ck) { const p = S.papers.find((x) => x.check_code === decodeURIComponent(ck[1]).toUpperCase());
      if (!p) return { status: 404, body: { ok: false, error: 'TDW has no paper with this check code.' } };
      return p.state === 'withdrawn' ? { ok: true, paper: { check_code: p.check_code, title: p.title, state: 'withdrawn', name: 'DEV440 Test Makeup', issued_on: '6 October 2026', withdrawn_on: '6 October 2026', lines: [['Received on these invoices', 'Rs 4,00,000']], photo_url: 'https://res.cloudinary.com/tdw/image/upload/v1/me.jpg', note: 'DEV440 Test Makeup withdrew this paper. It no longer stands.' } }
        : { ok: true, paper: { check_code: p.check_code, title: p.title, state: 'valid', name: 'DEV440 Test Makeup', issued_on: '6 October 2026', purpose: p.purpose ? 'For a bank' : null, lines: [...p.lines, ['Issued', '6 October 2026']], note: p.note, photo_url: p.kind === 'id_card' ? (p.photo_url || null) : null } }; }
    return null;
  } };
}
async function openP(b, route, fake, { wait = '.wl-main' } = {}) {
  const p = await b.newPage(); await p.setViewport({ width: 374, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: SHOTS ? 2 : 1 });
  await p.setCookie({ name: 'tdw_wl_mode', value: MODE, domain: 'localhost', path: '/' }, { name: 'tdw_layout', value: 'v2', domain: 'localhost', path: '/' });
  await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: MODE }]);
  await p.evaluateOnNewDocument(() => { try { Storage.prototype.getItem = new Proxy(Storage.prototype.getItem, { apply(t, s, a) { const r = Reflect.apply(t, s, a); if (r === null && /seen|first|onboard|intro/i.test(String(a[0]))) return '1'; return r; } }); } catch (_e) { /* fine */ } });
  const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
  p.__said = []; p.__open = new Set();
  p.on('pageerror', (e) => p.__said.push('pageerror: ' + String(e && e.message || e).slice(0, 200)));
  p.on('console', (m) => { if (m.type() === 'error') p.__said.push('console: ' + m.text().slice(0, 200)); });
  p.on('requestfailed', (r) => p.__said.push('failed: ' + r.url().replace(/^https?:\/\/[^/]+/, '') + ' ' + ((r.failure() || {}).errorText || '')));
  p.on('requestfinished', (r) => p.__open.delete(r.url().replace(/^https?:\/\/[^/]+/, '')));
  await p.setRequestInterception(true);
  p.on('request', (r) => { p.__open.add(r.url().replace(/^https?:\/\/[^/]+/, ''));
    const u = r.url(); if (!u.includes('/__api/')) return r.continue();
    const rt = u.split('/__api')[1].split('?')[0]; let body = {}; try { body = JSON.parse(r.postData() || '{}'); } catch (_e) { /* empty */ }
    fake.S.auth = fake.S.auth || []; if (/\/file$/.test(rt)) fake.S.auth.push(r.headers().authorization || null);
    if (/^\/api\/v2\/vendor\/papers\/[^/]+\/[^/]+\/file$/.test(rt)) { fake.S.log.push(['GET', rt, null]); return r.respond({ status: 200, contentType: 'application/pdf', headers: { 'content-disposition': 'attachment; filename="TDW_Professional_certificate_TDW-7Q4K-2M9P.pdf"' }, body: '%PDF-1.4 fake' }); }
    const a = fake.answer(r.method(), rt, body);
    if (a && a.status) return r.respond({ status: a.status, contentType: 'application/json', body: JSON.stringify(a.body) });
    return r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(a || (r.method() === 'GET' ? H.answer(rt) : { ok: true })) });
  });
  let resp = await p.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'domcontentloaded', timeout: 240000 });
  // CE-47 r2 (e-275, cure the measure): Next dev can answer a route's FIRST visit with its own 404 while that route is
  // still compiling (seen once in 20: "GET /vendor/papers 404 in 2.1s (next.js: 1993ms)"). That one answer is waited
  // through, by re-request, bounded at 60 s, and then judged; the dev log decides which 404 it is (judge404 below).
  // A 404 the server gave without compiling, or to a route that had already answered, stays a red at once.
  if (resp && resp.status() === 404) {
    let t0 = Date.now(); let verdict = judge404(devLog(), route);
    while (verdict === 'compiling' && Date.now() - t0 < 60000) {
      if (stuckRestarts < 2 && routeHasPage(route) && Date.now() - t0 > 20000) { stuckRestarts += 1; await restartServer(route); t0 = Date.now(); }
      await H.sleep(1000); resp = await p.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      verdict = resp && resp.status() === 404 ? judge404(devLog(), route) : 'ok';
    }
    if (verdict !== 'ok') throw new Error(`404 stands on ${route} (${verdict === 'compiling' ? (routeHasPage(route) ? `a page file serves it, yet it answered 404 for 60 s${stuckRestarts ? `, after ${stuckRestarts} fresh dev ${stuckRestarts === 1 ? 'server' : 'servers'} too` : ''}` : 'still compiling after 60 s') : 'the route answered 404 without compiling'}): ${JSON.stringify(logRows(devLog(), route))}${restarted ? ' :: the first server: ' + JSON.stringify(restarted.old) : ''}`);
    regraced.push(route);
  }
  let seen = false; for (let i = 0; i < 300; i += 1) { if (await p.evaluate((s) => !!document.querySelector(s), wait)) { seen = true; break; } await H.sleep(300); }
  // e-275: a page that never shows what the cell waits for is a red WITH ITS EVIDENCE, never a silent walk on to a later
  // timeout: where it stood, what it showed, what the browser said, and which faked calls were never answered.
  if (!seen) {
    const st = await p.evaluate(() => ({ at: location.pathname, ready: document.readyState, shows: document.body ? document.body.innerText.slice(0, 300) : '' })).catch((e) => ({ err: String(e) }));
    throw new Error(`waited 90s for ${wait} on ${route}: ${JSON.stringify(st)} :: browser said ${JSON.stringify(p.__said.slice(-6))} :: unanswered ${JSON.stringify([...p.__open])}`);
  }
  await settle(p); return p;
}
// The dev log's own rows for one path: [status, next.js ms]. Next 16's Turbopack dev prints no "Compiling" line, so the
// compile shows only as next.js's share of the request's time.
const ROW = (route) => new RegExp('^\\s*GET ' + route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:\\?\\S*)? (\\d{3}) in [^(]*\\(next\\.js: (\\d+(?:\\.\\d+)?)(ms|s)');
function logRows(lines, route) { const re = ROW(route); const out = []; for (const l of lines) { const m = l.match(re); if (m) out.push([+m[1], m[3] === 's' ? Math.round(+m[2] * 1000) : +m[2]]); } return out; }
// 'ok' (the latest answer was not a 404), 'compiling' (a 404 while this path's route was being compiled: the path's FIRST
// row, or a row whose next.js share shows a compile, at least COMPILE_MS), 'red' (a 404 answered without compiling).
const COMPILE_MS = 250;
// CE-47 (7 October 2026, the double 404): a real route, /vendor/supplies, answered Next dev's 404 twice in one run, the
// first while compiling (743 ms) and the second at once (15 ms) with no compile error in the log. The dev log alone could
// not tell that from a route that does not exist, so the bench asks the tree it is walking: does a page file serve this
// path? (the v2 layout serves /x from app/v2/x, then app/x; route groups are transparent; [segments] match anything).
// A 404 on a path a page file serves is waited through, re-requested, bounded at 60 s, and only then red, with every row
// as evidence. A path no page file serves keeps the r2 rule (first-visit compile grace, then red), so 8.2 is unchanged.
function routeHasPage(route, root = ROOT) {
  const segs = route.split('?')[0].split('/').filter(Boolean);
  const hasPage = (dir) => ['page.tsx', 'page.ts', 'page.jsx', 'page.js'].some((f) => fs.existsSync(path.join(dir, f)));
  const walk = (dir, i) => {
    let ents; try { ents = fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory()); } catch (_e) { return false; }
    if (i === segs.length) { if (hasPage(dir)) return true; return ents.some((e) => /^\(.*\)$/.test(e.name) && walk(path.join(dir, e.name), i)); }
    return ents.some((e) => (e.name === segs[i] && walk(path.join(dir, e.name), i + 1)) || (/^\[[^\]]+\]$/.test(e.name) && walk(path.join(dir, e.name), i + 1)) || (/^\(.*\)$/.test(e.name) && walk(path.join(dir, e.name), i)));
  };
  return walk(path.join(root, 'app', 'v2'), 0) || walk(path.join(root, 'app'), 0);
}
function judge404(lines, route, hasPage = routeHasPage(route)) {
  const rows = logRows(lines, route); if (!rows.length) return 'compiling'; const [st, ms] = rows[rows.length - 1];
  if (st !== 404) return 'ok';
  if (hasPage) return 'compiling';   // a page file serves it: wait, bounded by the caller's 60 s
  return (rows.length === 1 || ms >= COMPILE_MS) ? 'compiling' : 'red';
}
const devLog = () => { try { return fs.readFileSync(server.log, 'utf8').split('\n'); } catch (_e) { return []; } };
const regraced = [];
const text = (p) => p.evaluate(() => (document.querySelector('main') || document.body).innerText);
// e-275: no cell rests on a fixed pause alone. After a tap the bench waits until the page's requests have settled
// (every door answer arrived) and React has painted, up to 15 s, before reading.
const settle = async (p) => { try { await p.waitForNetworkIdle({ idleTime: 400, timeout: 15000 }); } catch (_e) { /* read anyway; the cell decides */ } await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))); };
const tap = async (p, sel) => { await p.waitForSelector(sel, { timeout: 15000 }); await p.$eval(sel, (e) => (e.matches('button,a') ? e : e.querySelector('button,a') || e).click()); await settle(p); };
// Pictures only (F-44.363): next dev cannot take the font mock, so the app's own faces are put in under next/font's names
// from @fontsource files in $FACES_DIR (fontsource-inter-x, fontsource-cormorant-garamond-x). No cell reads a face.
async function faces(p) {
  const D = process.env.FACES_DIR; if (!D) return;
  const fams = await p.evaluate(() => [...new Set([...document.querySelectorAll('body, body *')].map((e) => getComputedStyle(e).fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '')))]);
  const b64 = (f) => fs.readFileSync(f).toString('base64'); let css = '';
  for (const fam of fams) {
    if (/inter/i.test(fam)) for (const w of [400, 500, 600]) css += `@font-face{font-family:'${fam}';font-weight:${w};src:url(data:font/woff2;base64,${b64(path.join(D, 'fontsource-inter-x/package/files', `inter-latin-${w}-normal.woff2`))}) format('woff2')}`;
    if (/cormorant/i.test(fam)) for (const w of [400, 500]) css += `@font-face{font-family:'${fam}';font-weight:${w};src:url(data:font/woff2;base64,${b64(path.join(D, 'fontsource-cormorant-garamond-x/package/files', `cormorant-garamond-latin-${w}-normal.woff2`))}) format('woff2')}`;
  }
  if (css) { await p.addStyleTag({ content: css }); await p.evaluate(async () => { await document.fonts.ready; }); await H.sleep(300); }
}
let n = 0; const shot = async (p, name) => { if (!SHOTS) return; fs.mkdirSync(SHOTS, { recursive: true }); await faces(p); await p.screenshot({ path: path.join(SHOTS, `${String(++n).padStart(2, '0')}_${name}_${MODE}.png`) }); };
const SHORT = /\b\d{1,2} (Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\b(?![a-z])/;

for (let i = 0; i < 40 && await dev.portOpen(PORT); i += 1) await H.sleep(500);
if (await dev.portOpen(PORT)) { console.log(`b241: port ${PORT} is held by another server; refusing to walk someone else's tree`); process.exit(2); }
// F-44.370's reads (the chair, 7 October 2026), taken on a stuck server BEFORE it is restarted, and a census of every
// process working in this root, taken before each server start: if an earlier server's worker outlived its stop and
// still writes into .next, the census shows it.
const census = () => { try { const fs2 = require('fs'); return require('child_process').execSync('ps -eo pid,ppid,args', { encoding: 'utf8' }).split('\n').slice(1).map((l) => l.trim()).filter(Boolean)
  .filter((l) => { const pid = l.split(/\s+/)[0]; if (+pid === process.pid) return false; let cwd = ''; try { cwd = fs2.readlinkSync(`/proc/${pid}/cwd`); } catch (_e) { return false; } return cwd === ROOT && /next|node/.test(l); })
  .map((l) => l.replace(/\s+/g, ' ').slice(0, 120)); } catch (_e) { return ['ps failed']; } };
const plain = async (u, ck = `tdw_layout=v2; tdw_wl_mode=${MODE}`) => { try { const r = await fetch(`http://localhost:${PORT}${u}`, { headers: { cookie: ck }, redirect: 'manual' }); return r.status + (r.headers.get('location') ? '>' + r.headers.get('location').replace(/^https?:\/\/[^/]+/, '') : ''); } catch (_e) { return 'refused'; } };
console.log(`  NOTE  census before the first server: ${JSON.stringify(census())}`);
const DEV_ENV = { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` };
let server = await dev.start(ROOT, PORT, DEV_ENV);
// CE-47 (7 October 2026): the stuck 404. Seen 6 times in about 80 runs: on a path a page file serves, a fresh Next dev
// answered 404 to every request for the server's whole life (b243 run 3 of 20: 16 rows over 60 s, the first compiling
// 2.1 s, the rest at once; no compile error in the log). Then 3 of 21 fresh servers in series 2. Not reproduced by 30 fresh servers under load with plain
// requests, so it is tied to a browser's first visit to a dev server, not to the app (next build lists the route).
// The measure: ONCE per run, after 20 s of 404s on such a path, the dev server is stopped (whole tree, port proven free)
// and started fresh, and the path is asked again; a NOTE line carries the old server's rows. Up to twice a run (b243
// series 2, run 2: a server started fresh stuck too). If the last fresh server also answers 404 for 60 s, the path is
// red, with the rows.
let restarted = null; let stuckRestarts = 0; // at most 2 restarts for a stuck 404 per run; 8.5's own restart does not count
async function restartServer(route, why = 'answered 404 for 20 s on a path a page file serves') {
  const old = logRows(devLog(), route);
  if (!/on purpose/.test(why)) {
    const reads = { v2_address: await plain('/v2' + route), same_from_node: await plain(route), new_room_papers: await plain('/vendor/papers'), landed_room_packages: await plain('/vendor/packages'), never: await plain('/vendor/no-such-room-x'), no_cookie: await plain(route, ''),
      classic_today: await plain('/vendor/today', 'tdw_layout=classic'), outside_vendor_privacy: await plain('/privacy'), outside_vendor_check: await plain('/check/TDW-AAAA-BBBB'), home: await plain('/') };
    console.log(`  NOTE  F-44.370 reads on the stuck server: ${JSON.stringify(reads)} :: census ${JSON.stringify(census())} :: this server's tree ${JSON.stringify(require(path.join(ROOT, 'scripts/lib/stop_tree.js')).treeOf(server.dev.pid))}`);
  }
  try { stopTree(server.dev.pid); } catch (_e) { /* gone */ }
  try { await server.stop(); } catch (_e) { /* stopped */ }
  for (let i = 0; i < 40 && await dev.portOpen(PORT); i += 1) await H.sleep(500);
  console.log(`  NOTE  census before the fresh server: ${JSON.stringify(census())}`);
  server = await dev.start(ROOT, PORT, DEV_ENV);
  if (!(await server.up())) throw new Error('the fresh dev server did not come up');
  restarted = { route, old };
  console.log(`  NOTE  dev server restarted once: ${route} ${why}; the old server's rows ${JSON.stringify(old)}`);
}
let b;
try {
  if (!(await server.up())) throw new Error('the dev server did not come up');
  b = await H.browser();
  console.log(`\n── 1  the room (${MODE}) ──`);
  const f = fakePapers(); const p = await openP(b, '/vendor/papers', f);
  let t = await text(p);
  ok(['Professional certificate', 'Professional ID', 'Business statement', 'Ready for your CA'].every((w) => t.includes(w)) && t.includes('14 verified weddings'), '1.1 four kinds, the certificate line carries her verified weddings', (await p.evaluate(() => location.pathname + ' :: ' + document.body.innerText.slice(0, 300))));
  ok(await p.$eval('[data-add-top]', (e) => e.textContent.trim()).catch(() => '') === '+ New paper', '1.2 one "+ New paper" in the room head');
  ok(!SHORT.test(t) && !/\bcouple\b|\bbride\b/i.test(t), '1.3 no short month, no "couple" or "bride"');
  await shot(p, 'papers_room');
  console.log('\n── 2  a certificate ──');
  await tap(p, '[data-pp-kind="certificate"]'); t = await text(p);
  ok(t.includes('The paper will state these details.') && t.includes('14, verified by TDW') && t.includes('Makeup artist'), '2.1 (P3, R-47.1) before making it, she sees what it will state');
  await shot(p, 'certificate_before');
  await tap(p, '[data-pp-make]'); t = await text(p);
  const post = f.S.log.find(([m, rt]) => m === 'POST' && rt === `/api/v2/vendor/papers/${V}`);
  ok(post && JSON.stringify(post[2]) === '{"kind":"certificate"}', '2.2 the door is asked for a certificate and nothing else', JSON.stringify(post));
  // r3 (by label, R-46.17): the check link sits in its own CopyBox with Copy; "Copy check link" is gone
  const box23 = await p.$eval('[data-pp-checkbox]', (e) => ({ text: (e.querySelector('[data-copytext]') || {}).textContent, ctl: (e.querySelector('[data-copyctl]') || {}).textContent, kids: e.children.length })).catch(() => null);
  ok(t.includes('Valid') && t.includes('Download PDF') && !t.includes('Copy check link') && box23 && box23.text === 'thedreamwedding.in/check/TDW-7Q4K-2M9P' && box23.ctl === 'Copy' && box23.kids === 2, '2.3 (r3) the paper opens: Valid, its check link in its own box with Copy, Download', JSON.stringify(box23));
  const a = await p.$eval('a.pp-link', (e) => ({ href: e.href, target: e.target, rel: e.rel }));
  ok(a.href === 'https://thedreamwedding.in/check/TDW-7Q4K-2M9P' && a.target === '_blank' && a.rel === 'noopener noreferrer', '2.4 the check link opens in a new tab, noopener noreferrer (standing)');
  await shot(p, 'certificate_made');
  await tap(p, '[data-pp-download]');
  ok(f.S.log.some(([m, rt]) => m === 'GET' && new RegExp(`/papers/${V}/[^/]+/file$`).test(rt)) && (f.S.auth || []).length === 1, '2.5 Download fetches the file through her session (no new tab)', JSON.stringify(f.S.auth));
  console.log('\n── 3  withdraw ──');
  await tap(p, '[data-pp-withdraw]'); t = await text(p);
  ok(t.includes('You cannot undo this.') && !f.S.log.some(([m, rt]) => /withdraw$/.test(rt)), '3.1 (P3, R-47.1) withdraw asks first; nothing is sent yet');
  await shot(p, 'withdraw_confirm');
  await p.evaluate(() => [...document.querySelectorAll('[data-pp-confirm] button')].find((x) => x.textContent === 'Withdraw').click()); await settle(p); t = await text(p);
  ok(f.S.log.some(([m, rt]) => m === 'POST' && /withdraw$/.test(rt)) && t.includes('Withdrawn') && !t.includes('Withdraw this paper'), '3.2 withdrawn, and the button is gone');
  console.log('\n── 4  a statement ──');
  await p.evaluate(() => [...document.querySelectorAll('button')].find((x) => /Back to Business papers/.test(x.textContent)).click()); await settle(p);
  await tap(p, '[data-pp-kind="statement"]'); t = await text(p);
  ok(/\d{1,2} (January|February|March|April|May|June|July|August|September|October|November|December) \d{4}/.test(t) && t.includes('Who is it for?'), '4.1 the period is written out in full months under each field; who it is for is asked');
  await shot(p, 'statement_form');
  await tap(p, '[data-pp-make]'); t = await text(p);
  ok(t.includes('Pick who the statement is for.'), '4.2 without a purpose, the server\'s plain refusal is shown');
  await tap(p, '[data-pp-purpose="bank"]');
  // F-44.369 (P2 app package): the chosen chip is FILLED, the others are not (the standing rule; it was outlined only)
  const ch = await p.$eval('[data-pp-purpose="bank"]', (e) => { const c = getComputedStyle(e); return { pressed: e.getAttribute('aria-pressed'), bg: c.backgroundColor }; });
  const other = await p.$eval('[data-pp-purpose="visa"]', (e) => getComputedStyle(e).backgroundColor).catch(() => null);
  ok(ch.pressed === 'true' && !/rgba\(0, 0, 0, 0\)|transparent/.test(ch.bg) && other && /rgba\(0, 0, 0, 0\)|transparent/.test(other), '4.2a (F-44.369) the chosen "Who is it for?" chip is filled; the others are not', JSON.stringify({ ch, other }));
  await tap(p, '[data-pp-make]'); t = await text(p);
  const sp = f.S.log.filter(([m, rt]) => m === 'POST' && rt === `/api/v2/vendor/papers/${V}`).pop();
  ok(sp && sp[2].kind === 'statement' && sp[2].purpose === 'bank' && /^\d{4}-04-01$/.test(sp[2].period_from) && /^\d{4}-\d{2}-\d{2}$/.test(sp[2].period_to), '4.3 the statement is asked for with its period and purpose', JSON.stringify(sp && sp[2]));
  ok(t.includes('Received on these invoices') && t.includes('Rs 5,92,500') && t.includes('TDW has not audited or verified these figures.'), '4.4 the statement opens with its sums and the ruled words');
  await shot(p, 'statement_made');
  await p.close();
  console.log('\n── 5  the check page ──');
  const q = await openP(b, '/check/tdw-3h8c-2m9p', f, { wait: '[data-check="valid"],[data-check="no"]' }); t = await text(q);
  ok(t.includes('Valid') && t.includes('Business statement') && t.includes('Received on these invoices') && t.includes('TDW has not audited'), '5.1 a valid statement: its lines and the ruled words (code typed in small letters)');
  ok(f.S.log.some(([m, rt]) => rt === '/api/v2/public/check/tdw-3h8c-2m9p'), '5.2 the check door is called from the visitor\'s browser (the limit is per visitor)');
  await shot(q, 'check_valid'); await q.close();
  const w = await openP(b, '/check/TDW-7Q4K-2M9P', f, { wait: '[data-check="withdrawn"],[data-check="no"]' }); t = await text(w);
  // e-275 cure: the fake answer is HOSTILE here (it carries a figure and a photo, as a wrong server might), so the cell
  // proves the PAGE refuses them for a withdrawn paper; the server's own refusal is b240's.
  const wPhoto = await w.$('[data-check-photo]');
  ok(t.includes('Withdrawn') && t.includes('Issued') && !t.includes('verified by TDW') && t.includes('no longer stands') && !t.includes('Rs 4,00,000') && !wPhoto, '5.3 a withdrawn paper shows no figures and no photo, even when the answer carries them');
  await shot(w, 'check_withdrawn'); await w.close();
  const x = await openP(b, '/check/TDW-ZZZZ-ZZZZ', f, { wait: '[data-check="no"]' }); t = await text(x);
  ok(t.includes('Not found') && t.includes('TDW has no paper with this check code.'), '5.4 an unknown code says so plainly');
  await shot(x, 'check_unknown'); await x.close();

  console.log('\n── 7  the ID\'s photo (R3 (b)) ──');
  const f7 = fakePapers(); const q7 = await openP(b, '/vendor/papers', f7, { wait: '[data-pp-kind]' });
  await tap(q7, '[data-pp-kind="id_card"]'); await q7.waitForSelector('[data-pp-photo]', { timeout: 15000 }).catch(() => {}); t = await text(q7);
  const offered = await q7.$$eval('[data-pp-photo]', (els) => els.map((e) => e.getAttribute('data-pp-photo')));
  ok(JSON.stringify(offered) === '["img-1","img-2"]' && t.includes('You have not chosen a photo. You can make the ID without one.'), '7.1 (P3, R-47.1) her portfolio photos are offered, a refused one is not; no photo is chosen by itself', JSON.stringify(offered));
  await tap(q7, '[data-pp-photo="img-1"]'); t = await text(q7);
  ok(t.includes('This photo will be on the ID.') && await q7.$eval('[data-pp-photo="img-1"]', (e) => e.getAttribute('aria-pressed')) === 'true', '7.2 tapping a photo chooses it, and says so');
  await shot(q7, 'id_photo_pick');
  await tap(q7, '[data-pp-make]');
  const idp = f7.S.log.filter(([m, rt]) => m === 'POST' && rt === `/api/v2/vendor/papers/${V}`).pop();
  ok(idp && JSON.stringify(idp[2]) === '{"kind":"id_card","photo_url":"https://res.cloudinary.com/tdw/image/upload/v1/me.jpg"}', '7.3 the ID is asked for with exactly the chosen photo', JSON.stringify(idp && idp[2]));
  await q7.close();
  const c7 = await openP(b, `/check/${f7.S.papers[0].check_code}`, f7, { wait: '[data-check="valid"],[data-check="no"]' });
  ok(await c7.$eval('[data-check-photo]', (e) => e.getAttribute('src')).catch(() => null) === 'https://res.cloudinary.com/tdw/image/upload/v1/me.jpg', '7.4 the ID\'s check page shows her photo');
  await shot(c7, 'check_id_photo'); await c7.close();
  console.log('\n── 6  Supplies ──');
  const fs1 = fakePapers(); const s1 = await openP(b, '/vendor/supplies', fs1, { wait: '[data-sp-src]' }); t = await text(s1);
  const keys = await s1.$$eval('[data-sp-src]', (els) => els.map((e) => e.getAttribute('data-sp-src')));
  ok(JSON.stringify(keys) === '["nykaa_pro","amazon_business","indiamart"]', '6.1 a makeup artist sees Nykaa PRO, Amazon Business and IndiaMART, in that order', JSON.stringify(keys));
  // AMENDED BY LABEL · CE-47 PRO P3: the founder's tag "Link checked on <date>" (8 October 2026), and R-47.1's no-fee line; "Checked by TDW" is nowhere in Supplies
  ok(['From Nykaa', 'Link checked on 4 October 2026', 'Free to join', 'Free for buyers', 'TDW takes no fee from these places. None of these links pays TDW.', 'Join with your TDW certificate', 'Nykaa decides who joins.'].every((w) => t.includes(w)) && !/Checked by TDW/i.test(t), '6.2 (P3) every card is labelled "Link checked on <date>"; "Checked by TDW" appears nowhere in Supplies; the ruled words are on glass');
  // P2 (by label): Bills and Gear landed, so nothing reads "Coming soon"; b243 walks Bills and Gear themselves.
  ok(!t.includes('Coming soon') && (t.match(/After you buy, tap Add a bill\. The bill goes to Expenses with its GST after you check it\./g) || []).length === 3 && !/on WhatsApp/.test(t), '6.3 (P2, P3 R-47.1) each card\u2019s bill loop says "tap Add a bill" (three cards), no WhatsApp, nothing "Coming soon"');
  const links = await s1.$$eval('a', (as) => as.filter((a) => /^https?:/.test(a.getAttribute('href') || '') && !a.closest('nav,header')).map((a) => [a.href, a.target, a.rel]));
  ok(links.length >= 3 && links.every(([h, tg, rl]) => /^https:\/\//.test(h) && tg === '_blank' && rl === 'noopener noreferrer'), '6.4 every outside link is https, a new tab, noopener noreferrer (standing)', JSON.stringify(links));
  ok(t.includes('You have not added your GSTIN yet.') && t.includes('Add yours in Settings') && !(await s1.$('[data-sp-gstinbox]')), '6.5 (r3, P3 R-47.1) no GSTIN: says so, sends her to Settings, offers no copy box');
  await shot(s1, 'supplies_where_to_buy');
  await tap(s1, '[data-sp-join="nykaa_pro"]'); t = await text(s1);
  ok(t.includes('Join Nykaa PRO with your TDW certificate') && t.includes('Make your certificate and save it as a PDF.') && t.includes('14 verified weddings'), '6.6 (P3, R-47.1) the join steps, and with no certificate yet it says it will make one');
  await shot(s1, 'supplies_join');
  await tap(s1, '[data-sp-save]');
  const issued = fs1.S.log.filter(([m, rt]) => m === 'POST' && rt === `/api/v2/vendor/papers/${V}`);
  ok(issued.length === 1 && JSON.stringify(issued[0][2]) === '{"kind":"certificate"}' && fs1.S.log.some(([m, rt]) => /\/file$/.test(rt)), '6.7 Save certificate makes one certificate and saves its file');
  await tap(s1, '[data-sp-save]');
  ok(fs1.S.log.filter(([m, rt]) => m === 'POST' && rt === `/api/v2/vendor/papers/${V}`).length === 1 && fs1.S.log.filter(([m, rt]) => /\/file$/.test(rt)).length === 2, '6.8 a second save reuses the certificate it has: no second paper');
  await s1.evaluate(() => [...document.querySelectorAll('button')].find((x) => /Back to Supplies/.test(x.textContent)).click()); await settle(s1);
  await tap(s1, '[data-sp-req]');
  await s1.type('[data-sp-item]', 'makeup sponges'); await s1.type('[data-sp-qty]', '200'); await settle(s1); t = await text(s1);
  const dbox = await s1.$eval('[data-sp-draftbox]', (e) => ({ text: (e.querySelector('[data-sp-draft]') || {}).textContent, ctl: (e.querySelector('[data-copyctl]') || {}).textContent, kids: e.children.length })).catch(() => null);
  ok(dbox && dbox.ctl === 'Copy' && dbox.kids === 2 && /^I am looking for 200 makeup sponges, delivered to Delhi by \d{1,2} (January|February|March|April|May|June|July|August|September|October|November|December) \d{4}\. Please send your price for each piece, with GST and delivery charges\.$/.test(dbox.text), '6.9 (r3, P3 R-47.1) the IndiaMART requirement is drafted in plain words, the date in full, in its own box with Copy', JSON.stringify(dbox));
  await shot(s1, 'supplies_requirement'); await s1.close();
  const fs2 = fakePapers({ gstin: '07AAAAA0000A1Z5', trade: 'Photographer', papers: [] }); const s2 = await openP(b, '/vendor/supplies', fs2, { wait: '[data-sp-src]' }); t = await text(s2);
  const k2 = await s2.$$eval('[data-sp-src]', (els) => els.map((e) => e.getAttribute('data-sp-src')));
  ok(JSON.stringify(k2) === '["amazon_business","indiamart","canon_cps","sony_pro"]' && t.includes('Repairs and backup') && !t.includes('Nykaa'), '6.10 a photographer sees Repairs and backup (Canon, Sony), and no Nykaa', JSON.stringify(k2));
  const gbox = await s2.$eval('[data-sp-gstinbox]', (e) => ({ text: (e.querySelector('[data-sp-gstin]') || {}).textContent, ctl: (e.querySelector('[data-copyctl]') || {}).textContent, kids: e.children.length })).catch(() => null);
  ok(gbox && gbox.text === '07AAAAA0000A1Z5' && gbox.ctl === 'Copy' && gbox.kids === 2, '6.11 (r3) her GSTIN in its own box with Copy, nothing else inside', JSON.stringify(gbox));
  await shot(s2, 'supplies_photographer'); await s2.close();

  console.log('\n── 8  the opener\'s first-visit grace (CE-47 r2) ──');
  const L = (st, t) => ` GET /vendor/papers ${st} in ${t} (next.js: ${t}, proxy.ts: 9ms, application-code: 60ms)`;
  ok(judge404([L(404, '1993ms')], '/vendor/papers', false) === 'compiling' && judge404([L(404, '2.1s')], '/vendor/papers', false) === 'compiling'
    && judge404([L(404, '1993ms'), L(200, '5ms')], '/vendor/papers', false) === 'ok'
    && judge404([L(200, '187ms'), L(404, '6ms')], '/vendor/papers', false) === 'red'
    && judge404([L(404, '1993ms'), L(404, '7ms')], '/vendor/papers', false) === 'red'
    && judge404([' GET /vendor/papers-x 404 in 9ms (next.js: 4ms, proxy.ts: 1ms, application-code: 4ms)'], '/vendor/papers', false) === 'compiling',
  '8.1 the judge, on a path no page file serves: a first-visit 404 while compiling is waited through; a 404 after the route answered, or one given without compiling, is red');
  ok(routeHasPage('/vendor/supplies') && routeHasPage('/vendor/papers') && routeHasPage('/check/TDW-7Q4K-2M9P') && !routeHasPage('/vendor/no-such-room-b241') && !routeHasPage('/check'),
    '8.3 the tree is asked: Supplies, Business papers and a check code have page files; a room that does not exist has none');
  ok(judge404([L(404, '743ms'), L(404, '15ms')], '/vendor/papers', true) === 'compiling' && judge404([L(404, '743ms'), L(404, '15ms')], '/vendor/papers', false) === 'red',
    '8.4 the double 404 seen on 7 October: on a path a page file serves it is waited through (to 60 s); on a path none serves it is red at once');
  let threw = null; const t8 = Date.now();
  try { const z = await openP(b, '/vendor/no-such-room-b241', fakePapers()); await z.close(); } catch (e) { threw = String(e && e.message || e); }
  ok(!!threw && /^404 stands on \/vendor\/no-such-room-b241/.test(threw) && Date.now() - t8 < 75000, '8.2 a route that never exists is still red, within the 60 s bound', `${threw} in ${Date.now() - t8} ms`);
  // 8.5 the restart's own mechanics, driven on purpose at the end of the run (a stuck 404 cannot be planted): the old
  // tree is stopped, the port proven free, a fresh server answers, and the room opens on it.
  if (!stuckRestarts) {
    const pid0 = server.dev.pid; await restartServer('/vendor/papers', 'restarted on purpose by cell 8.5');
    let oldGone = false; try { process.kill(pid0, 0); } catch (_e) { oldGone = true; }
    const z = await openP(b, '/vendor/papers', fakePapers(), { wait: '[data-pp-kind]' }); const zt = await text(z); await z.close();
    ok(oldGone && server.dev.pid !== pid0 && zt.includes('Make a paper'), '8.5 the once-per-run restart: the old server stopped, a fresh one up, the room opens on it', JSON.stringify({ pid0, pid1: server.dev.pid }));
  } else ok(true, '8.5 the once-per-run restart was used for real in this run (see its NOTE)');
  if (regraced.length) console.log(`  NOTE  first-visit 404 waited through on: ${regraced.join(', ')}`);
} catch (e) { ok(false, 'the run', e && e.stack); }
finally {
  // e-275: teardown is bounded. Under load a browser close or the dev server's stop can stall (seen: one run's verdict
  // printed 29/0 and the process then sat for 14 minutes). Each step gets 20 s; the browser is killed if it outlives it.
  const within = (pr, ms) => Promise.race([pr, new Promise((r) => setTimeout(r, ms))]);
  try { const bp = b && b.process(); await within(b ? b.close() : null, 20000); try { if (bp && bp.exitCode === null) bp.kill('SIGKILL'); } catch (_e) { /* gone */ } } catch (_e) { /* closed */ }
  // The whole tree by its PID, waited on (stop_tree.js), then the server's own stop, which PROVES the port free. (Found
  // by e-275's repeats: this line once passed the server OBJECT, so nothing was stopped here and only the exit hook's
  // un-waited SIGKILL remained; the next run could meet the old server on its port and lose it mid-walk.)
  try { if (server && server.dev) stopTree(server.dev.pid); } catch (_e) { /* gone */ }
  try { const r = server ? await within(server.stop(), 20000) : null; if (r && r.portFree === false) console.log(`  NOTE  port ${PORT} still answered after the stop`); } catch (_e) { /* stopped */ }
}
console.log(`\nb241 (${MODE}): ${pass} passed, ${fail} failed`); if (fail) console.log('FAILED: ' + failed.join(' · '));
process.exit(fail ? 1 : 0);
