#!/usr/bin/env node
'use strict';
// scripts/fe9_r472_notices_bench.js · CE-47 · FE-9 · R-47.2 (the founder, 8 Oct 2026): A VENDOR'S PICTURES ARE HERS.
// The vendor app's half of WEB-4's cut 30 (its handover, section 4): no screen asks for or speaks of an approval; a
// picture says where it shows; her notices (a legal removal, in the founder's words) can be marked read.
//
// §1 THE SOURCE: no vendor file reads approval_state or rejection_reason; no read asks the portfolio door for
//    'approved', 'pending' or 'rejected'; markNoticeSeen PATCHes /notices/:id/seen in both api homes.
// §2 PORTFOLIO, v2 layout, on glass (the fake answers the cut 30 wire; the shell from the kit's fixtures):
//    2.1 her notice in the founder's words, whole, with Mark as read; 2.2 the tap PATCHes once and the card goes on ok;
//    2.3 a refusal keeps the card and shows the server's words; 2.4 tile marks: held "Checking", hidden "Hidden", none
//    on a plain picture; 2.5 a held picture's sheet shows its notice word for word; 2.6 the filters ask the door for
//    shown, held and hidden; 2.7 no approval word anywhere on the page.
// §3 PORTFOLIO, classic layout: 3.1 the notice and its mark-as-read, as 2.1 and 2.2.
// §4 STOREFRONT, v2: 4.1 "photos live" counts every picture not held (total less held), "waiting" counts the held.
// THE EXIT CODE IS THE VERDICT (0 green, 1 red). FE9R_ONLY=1|2|3|4 runs one section (with §1 always).
const path = require('path'); const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.FE9R_PORT || 4472);
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const FIX = require(path.join(ROOT, 'scripts/lib/fe7_l4_fixtures.js'));
const ONLY = process.env.FE9R_ONLY || '';
const V = '00000000-0000-0000-0000-000000000000';
const HELD = 'TDW is checking this picture. It is not shown yet.';
const OFFD = 'This picture is not shown on Discover.';
const LEGAL = 'TDW removed one of your pictures for a legal reason: a copyright claim from the photographer.';
let pass = 0, fail = 0; const fails = [];
function ok(c, name, detail) { if (c) { pass++; console.log('  PASS  ' + name); } else { fail++; fails.push(name); console.log('  FAIL  ' + name + (detail !== undefined ? '  [' + String(detail).slice(0, 400) + ']' : '')); } }
function sec(t) { console.log('\n§' + t); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function until(fn, ms, what) { const end = Date.now() + ms; let v; while (Date.now() < end) { try { v = await fn(); } catch (_e) { v = null; } if (v) return v; await sleep(200); } throw new Error('timed out waiting for ' + what); }
const img = (n) => `https://res.cloudinary.com/demo/image/upload/sample${n}.jpg`;

// The cut 30 wire (section 4): each image carries shown_on_her_pages, shown_on_discover and notice; never approval_state.
function world(o = {}) {
  const S = { calls: [], seen: [], o,
    images: [
      { id: 'p0', image_url: img(0), caption: null, aesthetic_tags: [], is_hero: true, in_carousel: true, position: 0, created_at: '2026-10-01T06:00:00Z', shown_on_her_pages: true, shown_on_discover: true, notice: null },
      { id: 'p1', image_url: img(1), caption: null, aesthetic_tags: [], is_hero: false, in_carousel: true, position: 1, created_at: '2026-10-02T06:00:00Z', shown_on_her_pages: false, shown_on_discover: false, notice: HELD },
      { id: 'p2', image_url: img(2), caption: null, aesthetic_tags: [], is_hero: false, in_carousel: true, position: 2, created_at: '2026-10-03T06:00:00Z', shown_on_her_pages: true, shown_on_discover: false, notice: OFFD },
    ],
    notices: [{ id: 'n-1', line: LEGAL, created_at: '2026-10-09T06:00:00Z' }] };
  S.answer = (route, method, body, query) => {
    S.calls.push({ route, method, body, query });
    if (route === `/api/v2/vendor/portfolio/${V}` && method === 'GET') {
      const st = (/state=([a-z]+)/.exec(query || '') || [])[1] || 'all';
      const pick = st === 'held' ? S.images.filter((i) => !i.shown_on_her_pages) : st === 'hidden' ? S.images.filter((i) => i.shown_on_her_pages && !i.shown_on_discover) : st === 'shown' ? S.images.filter((i) => i.shown_on_her_pages) : S.images;
      return { ok: true, images: pick, total: pick.length, notices: S.notices };
    }
    let m;
    if ((m = /^\/api\/v2\/vendor\/portfolio\/notices\/([^/]+)\/seen$/.exec(route)) && method === 'PATCH') {
      S.seen.push(m[1]);
      if (o.refuse) return { __status: 409, ok: false, error: o.refuse };
      S.notices = S.notices.filter((n) => n.id !== decodeURIComponent(m[1])); return { ok: true };
    }
    if (route === '/api/v2/vendor/discover/status' || route === `/api/v2/vendor/discover/status/${V}`) return { ok: true, discover_request_state: 'not_requested', min_portfolio_images: 6, max_portfolio_images: 30,
      portfolio_summary: { total: 5, approved: 2, held: 1, hidden: 1 } };
    if (/\/ig\/status$|\/instagram\/status$/.test(route)) return { ok: true, connected: false, ig_import_enabled: false };
    if (method === 'GET') { const a = FIX.answer(route, {}); return a === undefined ? { ok: true } : a; }
    const a = FIX.post(route, {}); return a === undefined ? { ok: true } : a;
  };
  return S;
}

function source() {
  sec('1 THE SOURCE');
  const roots = ['v2', 'app/vendor', 'lib/vendor', 'components/vendor', 'hooks'];
  const files = []; const walk = (d) => { for (const e of fs.readdirSync(path.join(ROOT, d), { withFileTypes: true })) { const r = path.join(d, e.name); if (e.isDirectory()) walk(r); else if (/\.(ts|tsx)$/.test(e.name)) files.push(r); } };
  roots.forEach((r) => { if (fs.existsSync(path.join(ROOT, r))) walk(r); });
  const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  // lib/vendor/types/vendor.ts keeps rejection_reason on FeaturedSubmission (another table, Featured); nothing else may name either
  const real = files.filter((f) => { const c = strip(fs.readFileSync(path.join(ROOT, f), 'utf8'));
    return /\bapproval_state\b/.test(c) || (/\brejection_reason\b/.test(c) && f !== 'lib/vendor/types/vendor.ts'); });
  ok(real.length === 0, '1.1 no vendor file reads approval_state, and none reads a picture’s rejection_reason (R-47.2: she never sees an old rejection)', real.join(' '));
  const asks = files.filter((f) => /fetchPortfolio\([^)]*'(approved|pending|rejected)'/.test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
  ok(asks.length === 0, '1.2 no read asks the portfolio door for approved, pending or rejected (its states are all, shown, held, hidden)', asks.join(' '));
  const api = ['lib/vendor/api/vendor.ts', 'v2/lib/vendor/api/vendor.ts'].map((f) => fs.readFileSync(path.join(ROOT, f), 'utf8'));
  ok(api.every((s) => /export function markNoticeSeen\(noticeId: string\)[\s\S]{0,200}patchJson\('\/api\/v2\/vendor\/portfolio\/notices\/' \+ encodeURIComponent\(noticeId\) \+ '\/seen'/.test(s)),
    '1.3 markNoticeSeen PATCHes /api/v2/vendor/portfolio/notices/:id/seen, in both api homes');
}

(async () => {
  source();
  if (ONLY === '1') return finish();
  await FIX.loadMe();
  const fontsLib = require(path.join(ROOT, 'scripts/lib/next_fonts.js')); const fonts = fontsLib.start(ROOT, 'fe9_r472');
  const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
  const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
  const server = await dev.start(ROOT, PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api`, NEXT_TELEMETRY_DISABLED: '1', ...fonts.env });
  if (!(await server.up())) { console.log('dev server did not come up'); await server.stop(); fonts.stop(); process.exit(2); }
  const browser = await puppeteer.launch({ executablePath: await chromium.executablePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  async function open(S, where, layout, width) {
    const ctx = await browser.createBrowserContext(); const p = await ctx.newPage();
    await p.setViewport({ width: width || 374, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });   // F-44.364
    await p.setCookie({ name: 'tdw_layout', value: layout || 'v2', domain: 'localhost', path: '/' }, { name: 'tdw_wl_mode', value: 'dark', domain: 'localhost', path: '/' });
    await p.evaluateOnNewDocument((v) => { try { localStorage.setItem('vendor_session', JSON.stringify({ id: v, vendorId: v, access_token: 'AT', refresh_token: 'RT', name: 'Dev', _v: 2 }));
      Storage.prototype.getItem = new Proxy(Storage.prototype.getItem, { apply(t, st, a) { const r = Reflect.apply(t, st, a); if (r === null && /seen|first|onboard|intro/i.test(String(a[0]))) return '1'; return r; } }); } catch (_e) { /* fine */ } }, V);
    const errs = []; p.on('pageerror', (e) => errs.push(String(e && e.message || e).slice(0, 200)));
    await p.setRequestInterception(true);
    p.on('request', (r) => {
      const u = r.url(); if (!u.includes('/__api/')) return r.continue();
      const route = u.split('/__api')[1].split('?')[0];
      if (r.method() === 'OPTIONS') return r.respond({ status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*' } });
      let body = null; try { body = JSON.parse(r.postData() || 'null'); } catch (_e) { body = null; }
      const out = S.answer(route, r.method(), body, u.split('?')[1] || '');
      const status = out && out.__status ? out.__status : 200; if (out) delete out.__status;
      return r.respond({ status, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(out) });
    });
    await p.goto(`http://localhost:${PORT}${where}`, { waitUntil: 'domcontentloaded', timeout: 240000 });
    const words = () => p.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
    const tap = async (label) => { const done = await p.evaluate((t) => { const b = Array.from(document.querySelectorAll('button')).find((x) => x.innerText.replace(/\s+/g, ' ').trim() === t && !x.disabled); if (!b) return false; b.click(); return true; }, label); if (!done) throw new Error('no button ' + label); };
    return { p, errs, words, tap, close: () => Promise.race([ctx.close(), sleep(10000)]) };
  }
  const noticeText = (v) => v.p.evaluate(() => Array.from(document.querySelectorAll('[data-notice] p')).map((e) => e.innerText.trim()));
  try {
    if (!ONLY || ONLY === '2') {
      sec('2 PORTFOLIO, v2');
      const S = world(); const v = await open(S, '/vendor/portfolio');
      const n = await until(async () => { const t = await noticeText(v); return t.length ? t : null; }, 180000, '2.1 (its wait): her notice');
      ok(JSON.stringify(n) === JSON.stringify([LEGAL]) && (await v.words()).includes('Mark as read'), '2.1 her notice in the founder’s words, whole, as the server sends it, with Mark as read', JSON.stringify(n));
      const marks = await until(() => v.p.evaluate(() => { const m = Array.from(document.querySelectorAll('[data-photo-mark]')).map((e) => e.innerText.trim()); return m.length ? m : null; }), 30000, '2.4 (its wait): the tiles');
      ok(JSON.stringify(marks) === JSON.stringify(['Checking', 'Hidden']), '2.4 tile marks: the held picture reads Checking, the one off Discover reads Hidden, the plain one has none', JSON.stringify(marks));
      const w = await v.words();
      ok(!/\b(approved|pending|rejected|awaiting review|not approved|for review)\b/i.test(w), '2.7 no approval word anywhere on the page (R-47.2)', (w.match(/.{0,40}\b(approved|pending|rejected|review)\b.{0,40}/i) || [''])[0]);
      await v.tap('Mark as read');
      await until(async () => (await noticeText(v)).length === 0, 20000, '2.2 (its wait): the card goes');
      const patches = S.calls.filter((c) => c.method === 'PATCH' && /\/notices\//.test(c.route));
      ok(patches.length === 1 && patches[0].route === '/api/v2/vendor/portfolio/notices/n-1/seen', '2.2 Mark as read PATCHes /notices/n-1/seen once, and the card goes on the server’s ok', JSON.stringify(patches));
      // 2.5 the held picture's sheet: tap its tile
      await v.p.evaluate(() => { const t = Array.from(document.querySelectorAll('[data-photo-mark]')).find((e) => e.innerText.trim() === 'Checking'); (t && t.parentElement).click(); });
      const sheet = await until(() => v.p.evaluate(() => { const e = document.querySelector('[data-photo-notice]'); return e ? e.innerText.trim() : null; }), 20000, '2.5 (its wait): the sheet');
      ok(sheet === HELD, '2.5 the held picture’s sheet shows its notice word for word', sheet);
      await v.close();
      const S2 = world(); const f = await open(S2, '/vendor/portfolio');
      await until(async () => (await noticeText(f)).length > 0, 180000, '2.6 (its wait): the room');
      for (const lab of ['Shown', 'Checking', 'Hidden']) { await f.tap(lab); await sleep(800); }
      const asked = S2.calls.filter((c) => c.method === 'GET' && c.route === `/api/v2/vendor/portfolio/${V}`).map((c) => (/state=([a-z]+)/.exec(c.query) || [])[1]);
      ok(['shown', 'held', 'hidden'].every((s) => asked.includes(s)) && !asked.some((s) => /approved|pending|rejected/.test(s)), '2.6 the filters ask the door for shown, held and hidden, never an approval state', JSON.stringify(asked));
      await f.close();
      const R = 'That notice was not found.';
      const S3 = world({ refuse: R }); const r = await open(S3, '/vendor/portfolio');
      await until(async () => (await noticeText(r)).length > 0, 180000, '2.3 (its wait): the room');
      await r.tap('Mark as read');
      await until(async () => (await r.words()).includes(R), 20000, '2.3 (its wait): the refusal');
      ok((await noticeText(r)).length === 1 && S3.seen.length === 1, '2.3 a refusal keeps the notice and shows the server’s words', JSON.stringify(S3.seen));
      await r.close();
    }
    if (!ONLY || ONLY === '3') {
      sec('3 PORTFOLIO, classic');
      const S = world(); const v = await open(S, '/vendor/portfolio', 'classic');
      const n = await until(async () => { const t = await noticeText(v); return t.length ? t : null; }, 180000, '3.1 (its wait): her notice');
      await v.tap('Mark as read');
      await until(async () => (await noticeText(v)).length === 0, 20000, '3.1 (its wait): the card goes');
      const patches = S.calls.filter((c) => c.method === 'PATCH' && /\/notices\//.test(c.route));
      ok(JSON.stringify(n) === JSON.stringify([LEGAL]) && patches.length === 1, '3.1 classic: the notice in the founder’s words, and Mark as read PATCHes once and it goes', JSON.stringify({ n, patches: patches.length }));
      await v.close();
    }
    if (!ONLY || ONLY === '4') {
      sec('4 STOREFRONT, v2');
      const S = world(); const v = await open(S, '/vendor/storefront');
      const line = await until(() => v.p.evaluate(() => { const e = document.querySelector('[data-photos-live]'); return e ? e.innerText.trim() : null; }), 180000, '4.1 (its wait): the line');
      ok(line === '4 photos live · 1 waiting', '4.1 photos live counts every picture not held (5 less 1), and waiting counts the held one', line);
      await v.close();
    }
  } catch (e) { fail++; fails.push('crash: ' + e.message); console.log('  FAIL  crash: ' + e.message); }
  await Promise.race([browser.close(), sleep(10000)]); await server.stop(); fonts.stop();
  finish();
})();
function finish() { console.log(`\nfe9_r472_notices: ${pass} pass, ${fail} fail`); if (fail) console.log('FAILED: ' + fails.join(' | ')); process.exit(fail ? 1 : 0); }
