'use strict';
// scripts/fe9_two_minute_start_bench.js · CE-47 · FE-9 · THE TWO-MINUTE START, PACKAGE 1 (S4 to S10, S11).
// The REAL flow at /vendor/onboarding (`next dev`, headless Chromium), every door answered by this bench's own fake
// server, kept in memory, so each write can be checked against what the server would then hold.
// F-44.364: the service worker is bypassed (Network.setBypassServiceWorker), so an intercepted '/api/' is never read as
// an empty answer. e-275: nothing waits on a fixed pause; each step waits on the thing itself (the element, the state,
// the request), with a bound; the build is followed through its own state (running, running, done); teardown bounded.
//   §1 a build in progress -> S4 rows: waiting steps by name, finished steps by the SERVER's line, 'opens' with its plan
//   §2 S5: only the fields the server lists as missing; Select cities pre-filled from Based in; the price helper; the POST
//   §3 S6: Gallery "In your draft"; picking Noir sends { style: 'noir' } and the button says "Use Noir"
//   §4 S7: her packages, "Price on request", the main package marked
//   §5 S8: an untick removes the photo from her portfolio, from every draft look (a look left empty is deleted, a look
//      with others keeps them) and from the draft's cover slides; nothing else is touched
//   §6 S9 and S10 with the master ON: Not now posts { on: false }; S10 reads GET: "Eliza off for WhatsApp"; Publish waits
//      on the server's ok, then Home; the build is marked checked on this phone
//   §7 the master faked OFF: S9 shows the waiting line; On posts { on: true }; S10 "Eliza: starts when TDW switches her on"
//   §8 a step that failed and a refusal: S4's failed sub line; a refused S5 shows the server's words, verbatim
//   §9 no build: S5 alone, then Home (what the old form did)
//   §11 S11 on Today: the card for an ended build not yet checked on this phone; gone once checked; none while running
//   §17 light mode: every filled control (S4's Continue, S5's chosen chip and Continue) reads its on-primary ink, never
//       the ink globals.css's light blanket would give it; S4's Continue spans the screen; S4's muted lines stay muted
//       and her @handle stays primary
//   §18 a thin answer ({ ok: true } with no lists from every door): onboarding draws a screen and writes nothing; Today
//       draws no Home card; no page error on either
//   §12 e-275, the timing-dependent part (following a build through its own state) repeated FE9_REPEAT times in this one
//       process on fresh worlds (default 1; the seat runs 20 under load and states the count). Bare, as every floor runs it,
//       it runs once.
// RED MUTATIONS (run by the seat, each restored by sha):
//   · StartFlow keepPhotos: drop the looks loop                                       -> 5.2
//   · StartFlow chooseEliza: Not now posts { on: true } (pass `true` to the third button) -> 6.1
//   · StartFlow details: show every field, not only missing[]                        -> 2.1
const path = require('path');
const ROOT = path.join(__dirname, '..');
const PORT = 3174;
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
let pass = 0; let fail = 0; const failed = [];
function ok(c, name, info) { if (c) { pass += 1; console.log(`  PASS  ${name}`); } else { fail += 1; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 400) + ']'}`); } }
const sec = (t) => console.log(`\n§${t}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function until(fn, ms, what) { const end = Date.now() + ms; let v; while (Date.now() < end) { try { v = await fn(); } catch (_e) { v = null; } if (v) return v; await sleep(150); } throw new Error('timed out waiting for ' + what); }

const V = 'aaaaaaaa-0000-4000-8000-000000000001';
const B = 'bbbbbbbb-0000-4000-8000-000000000001';
const img = (n) => `/examples/ads/example-${['portrait', 'bouquet', 'hands', 'couple', 'couple-2', 'portrait'][n]}.jpg?n=${n}`;

function world(opts) {
  const o = Object.assign({ master: true, build: 'normal', hold: false, missing: ['city', 'starting_price', 'service_area'], refuse: null }, opts || {});
  const S = {
    hold: o.hold, calls: [], hers: null, published: false, style: null, coverPatched: null,
    portfolio: [0, 1, 2, 3, 4].map((n) => ({ id: `p${n}`, image_url: img(n) })),
    looks: [
      { id: 'L1', photos: [{ id: 'lp0', url: img(0) }] }, { id: 'L2', photos: [{ id: 'lp1', url: img(1) }] },
      { id: 'L3', photos: [{ id: 'lp3', url: img(3) }, { id: 'lp4', url: img(4) }] },
    ],
    cover: [0, 1, 2].map((n) => ({ photo: { url: img(n) }, headline: null })),
    reads: 0, me: { id: V, name: 'Dev', business_name: 'Dev Roy Photography', category: 'photography', city: null, rate_min: null,
      service_area: null, service_cities: null, instagram_handle: 'thedreamwedding_in', handle: 'devroy', onboarding: { complete: o.missing.length === 0, missing: o.missing } },
  };
  const steps = (k) => {
    const all = [
      { key: 'photos', line: 'We added 5 of your photos.' }, { key: 'website', line: 'Your website draft is ready to check.', opens: [{ line: 'More styles, colour sets and font pairings', plan: 'essential' }] },
      { key: 'packages', line: 'We added 3 starter packages.' }, { key: 'storefront', line: 'We filled in your About from your Instagram bio.' },
      { key: 'eliza', line: 'Eliza knows your packages and prices.' }];
    return all.map((s, i) => {
      if (o.build === 'failed' && s.key === 'packages') return { key: s.key, state: 'failed', line: 'This step could not finish. You can add this yourself.', counts: null };
      const st = i < k ? 'done' : i === k ? 'running' : 'waiting';
      return { key: s.key, state: st, line: st === 'done' ? s.line : null, counts: null, opens: st === 'done' ? (s.opens || null) : null };
    });
  };
  S.answer = (route, method, body) => {
    S.calls.push({ route, method, body });
    if (route === '/api/v2/vendor/me') return { ok: true, vendor: S.me };
    if (route === '/api/v2/vendor/first-build/latest') {
      if (o.build === 'none') return { ok: true, build: null };
      if (S.hold) return { ok: true, build: { build_id: B, state: 'running', steps: steps(1), site_ready: false } };
      return { ok: true, build: { build_id: B, state: o.build === 'failed' ? 'failed' : 'running', steps: steps(o.build === 'failed' ? 5 : 0), site_ready: false } };
    }
    if (route === `/api/v2/vendor/first-build/${B}`) {
      S.reads += 1; const k = S.hold ? 1 : Math.min(S.reads + 1, 5);
      return { ok: true, state: k >= 5 ? 'done' : 'running', steps: steps(k), site_ready: k >= 5 };
    }
    if (route === `/api/v2/vendor/portfolio/${V}`) return { ok: true, images: S.portfolio, total: S.portfolio.length };
    let m;
    if ((m = /^\/api\/v2\/vendor\/portfolio\/(p\d)$/.exec(route)) && method === 'DELETE') { S.portfolio = S.portfolio.filter((p) => p.id !== m[1]); return { ok: true, deleted: true }; }
    if (route === '/api/v2/vendor/onboarding' && method === 'POST') {
      if (!body || !Object.keys(body).length) return { ok: false, allowed: ['photography'], missing: o.missing };
      if (o.refuse) return { ok: false, error: o.refuse, missing: o.missing };
      Object.assign(S.me, { city: body.city, rate_min: Number(body.rate_min), service_area: body.service_area, service_cities: body.service_cities });
      S.me.onboarding = { complete: true, missing: [] }; return { ok: true, tdw_link: 'https://devroy.thedreamwedding.in' };
    }
    if (route === '/api/v2/vendor/packages') return { ok: true, packages: [
      { id: 'k1', name: 'Photographs', total: null, is_default: false }, { id: 'k2', name: 'Photographs and film', total: null, is_default: true },
      { id: 'k3', name: 'Photographs, film and album', total: null, is_default: false }], seeding: { seeded: false, reason: 'already_seeded' } };
    if (route === '/api/v2/vendor/solutions/site/settings' && method === 'PATCH') {
      if (body && body.style) S.style = body.style;
      if (body && body.cover) { S.cover = body.cover; S.coverPatched = body.cover; }
      return { ok: true, saved: Object.keys(body || {}) };
    }
    if (route === '/api/v2/vendor/solutions/site/looks') return { ok: true, looks: S.looks };
    if ((m = /^\/api\/v2\/vendor\/solutions\/site\/looks\/(L\d)\/photos\/(lp\d)$/.exec(route)) && method === 'DELETE') {
      const l = S.looks.find((x) => x.id === m[1]); if (l) l.photos = l.photos.filter((p) => p.id !== m[2]); return { ok: true, deleted: true }; }
    if ((m = /^\/api\/v2\/vendor\/solutions\/site\/looks\/(L\d)$/.exec(route)) && method === 'DELETE') { S.looks = S.looks.filter((x) => x.id !== m[1]); return { ok: true, deleted: true }; }
    if (route === '/api/v2/vendor/solutions/site/room') return { ok: true, room: { stored: { cover: S.cover } } };
    if (route === '/api/v2/vendor/solutions/site/publish' && method === 'POST') { S.published = true; return { ok: true }; }
    if (route === '/api/v2/vendor/solutions/whatsapp-eliza') return { ok: true, state: S.hers === 'off' ? 'off' : (o.master ? 'on' : 'waiting') };
    if (route === '/api/v2/vendor/solutions/whatsapp-eliza/switch' && method === 'POST') { S.hers = body && body.on ? 'on' : 'off'; return { ok: true }; }
    return { ok: true };
  };
  return S;
}

async function main() {
  const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
  const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
  const server = await dev.start(ROOT, PORT, { NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` });
  if (!(await server.up())) { console.log('fe9_two_minute: the dev server did not come up'); await server.stop(); process.exit(2); }
  const browser = await puppeteer.launch({ executablePath: await chromium.executablePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });

  async function open(S, where, checked, mode) {
    const ctx = await browser.createBrowserContext(); const p = await ctx.newPage();
    await p.setViewport({ width: 374, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });   // F-44.364
    await p.setCookie({ name: 'tdw_layout', value: 'v2', domain: 'localhost', path: '/' });
    if (mode) await p.setCookie({ name: 'tdw_wl_mode', value: mode, domain: 'localhost', path: '/' });
    if (checked) await p.evaluateOnNewDocument((b) => { try { localStorage.setItem('tdw_first_build_checked', b); } catch (_e) { /* fine */ } }, B);
    await p.evaluateOnNewDocument(() => { try { localStorage.setItem('vendor_session', JSON.stringify({ id: 'aaaaaaaa-0000-4000-8000-000000000001', vendorId: 'aaaaaaaa-0000-4000-8000-000000000001', access_token: 'AT', refresh_token: 'RT', name: 'Dev', _v: 2 })); } catch (_e) { /* fine */ } });
    const errs = []; p.on('pageerror', (e) => errs.push(String(e && e.message || e).slice(0, 200)));
    await p.setRequestInterception(true);
    p.on('request', (r) => {
      const u = r.url(); if (!u.includes('/__api/')) return r.continue();
      const route = u.split('/__api')[1].split('?')[0];
      if (r.method() === 'OPTIONS') return r.respond({ status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*' } });
      let body = null; try { body = JSON.parse(r.postData() || 'null'); } catch (_e) { body = null; }
      const out = S.answer(route, r.method(), body);
      return r.respond({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(out) });
    });
    await p.goto(`http://localhost:${PORT}${where || '/vendor/onboarding'}`, { waitUntil: 'domcontentloaded', timeout: 240000 });
    const at = () => p.evaluate(() => { const e = document.querySelector('[data-start-step]'); return e ? e.getAttribute('data-start-step') : null; }).catch(() => null);
    const waitStep = (s, ms) => until(async () => (await at()) === s, ms || 60000, 'step ' + s);
    const words = () => p.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
    const tap = async (label) => { const done = await p.evaluate((t) => { const b = Array.from(document.querySelectorAll('button')).find((x) => x.innerText.replace(/\s+/g, ' ').trim() === t && !x.disabled); if (!b) return false; b.click(); return true; }, label); if (!done) throw new Error('no button ' + label); };
    const type = async (sel, text) => { await p.click(sel, { clickCount: 3 }); await p.type(sel, text, { delay: 5 }); };
    // S5's box under a label (the old form's markup: a .ob-lbl, then its .ob-f)
    const box = async (label, text) => { const h = await p.evaluateHandle((l) => { const lab = Array.from(document.querySelectorAll('.ob-lbl')).find((x) => x.innerText.trim() === l); let n = lab && lab.nextElementSibling; while (n && !n.matches('input')) n = n.nextElementSibling; return n; }, label); const el = h.asElement(); if (!el) throw new Error('no box ' + label); await el.click({ clickCount: 3 }); await el.type(text, { delay: 5 }); };
    const path_ = () => p.evaluate(() => location.pathname).catch(() => '');
    return { errs, p, ctx, at, waitStep, words, tap, type, box, path: path_, close: () => Promise.race([ctx.close(), sleep(10000)]) };
  }

  try {
    // ── §1 to §6, one vendor through the whole flow, master ON ─────────────────────────────────────────────────────
    if (!process.env.FE9_ONLY) {
    sec('1 S4, a build in progress');
    const S = world(); const v = await open(S);
    await v.waitStep('build', 180000);
    const first = await v.p.evaluate(() => Array.from(document.querySelectorAll('[data-step]')).map((e) => [e.getAttribute('data-step'), e.getAttribute('data-state'), e.innerText.replace(/\s+/g, ' ').trim()]));
    ok(first.length === 5 && first.some(([, st, t]) => st === 'waiting' && /^(Your website|Your packages|Your storefront|Eliza)$/.test(t)), '1.1 a step not yet run shows only its plain name', JSON.stringify(first));
    await until(async () => (await v.words()).includes('Your business is ready to check'), 60000, 'the build to end');
    const rows = await v.p.evaluate(() => Array.from(document.querySelectorAll('[data-step]')).map((e) => e.innerText.replace(/\s+/g, ' ').trim()));
    ok(rows[0] === 'We added 5 of your photos.' && rows[1] === 'Your website draft is ready to check. More styles, colour sets and font pairings · Available on Essential' && rows[4] === 'Eliza knows your packages and prices.',
      '1.2 every finished step shows the SERVER\u2019s line, and opens as "<line> · Available on <Plan>"', JSON.stringify(rows));
    const reads = S.reads; ok(reads >= 3 && reads <= 6, '1.3 the build was followed by reading its own state until it ended (a bounded number of reads)', reads);
    const w1 = await v.words(); ok(w1.includes('Nothing is published until you say yes.') && w1.includes('Dev Roy Photography') && w1.includes('@thedreamwedding_in') && await v.p.$('.st-mono') !== null, '1.4 done: the sub line, her name, @handle and her monogram (no picture)');

    sec('2 S5, only what the server still needs');
    await v.tap('Continue'); await v.waitStep('details'); await until(async () => (await v.p.$('.ob-lbl')) !== null, 60000, 'S5');
    const labels = await v.p.evaluate(() => Array.from(document.querySelectorAll('.ob-lbl')).map((e) => e.innerText.trim()));
    ok(JSON.stringify(labels) === JSON.stringify(['Based in', 'Your starting price, in Rs', 'Where you work', 'Which cities']), '2.1 only the missing fields, with today\u2019s labels (no name, business or craft)', JSON.stringify(labels));
    await v.box('Based in', 'Delhi');
    const chips = await v.p.evaluate(() => Array.from(document.querySelectorAll('.ob-chip.on')).map((e) => e.innerText.trim()));
    const citiesBox = await v.p.evaluate(() => { const lab = Array.from(document.querySelectorAll('.ob-lbl')).find((x) => x.innerText.trim() === 'Which cities'); return lab && lab.nextElementSibling ? lab.nextElementSibling.value : null; });
    const fill = await v.p.evaluate(() => { const on = document.querySelector('.ob-chip.on'); const probe = document.createElement('span'); probe.style.color = 'var(--role-primary)'; on.parentElement.appendChild(probe); const want = getComputedStyle(probe).color; probe.remove(); return { bg: getComputedStyle(on).backgroundColor, want }; });
    ok(fill.bg === fill.want && fill.bg !== 'rgba(0, 0, 0, 0)', '2.2b veto 54: the chosen chip is FILLED with the primary colour', JSON.stringify(fill));
    ok(JSON.stringify(chips) === '["Select cities"]' && citiesBox === 'Delhi', '2.2 "Where you work" is pre-set to Select cities, with her Based in city in Which cities', JSON.stringify({ chips, citiesBox }));
    ok(await v.p.$('[data-price-help]') === null, '2.3 no price helper and no default before she types');
    await v.box('Your starting price, in Rs', '80000');
    const help = await v.p.evaluate(() => (document.querySelector('[data-price-help]') || {}).innerText || '');
    ok(help === 'Shown on your storefront as From Rs 80,000. You can change it any time.', '2.4 the helper shows her own price', help);
    await v.tap('Continue'); await v.waitStep('style');
    const post = S.calls.filter((c) => c.route === '/api/v2/vendor/onboarding' && c.body && Object.keys(c.body).length).pop();
    ok(post && post.body.city === 'Delhi' && post.body.rate_min === '80000' && post.body.service_area === 'select_cities' && JSON.stringify(post.body.service_cities) === '["Delhi"]',
      '2.5 saved through the same door the old form used', JSON.stringify(post && post.body));

    sec('3 S6');
    const w3 = await v.words(); ok(/In your draft\s*Gallery/.test(w3) && w3.includes('Use Gallery'), '3.1 Gallery is "In your draft"; the button names it');
    await v.p.evaluate(() => { const b = Array.from(document.querySelectorAll('.st-style')).find((x) => x.innerText.includes('Noir')); if (b) b.click(); });
    await until(async () => (await v.words()).includes('Use Noir'), 10000, 'Use Noir');
    await v.tap('Use Noir'); await v.waitStep('packages');
    ok(S.style === 'noir', '3.2 the pick is sent as { style: "noir" } to her draft', S.style);

    sec('4 S7');
    const pk = await v.p.evaluate(() => Array.from(document.querySelectorAll('[data-package]')).map((e) => e.innerText.replace(/\s+/g, ' ').trim()));
    ok(pk.length === 3 && pk.every((t) => t.endsWith('Price on request')) && pk[1].startsWith('Main package'), '4.1 her packages, "Price on request", the main one marked', JSON.stringify(pk));

    sec('5 S8, an untick is true on her website too');
    await v.tap('These look right'); await v.waitStep('photos');
    ok((await v.words()).includes('5 photos from your Instagram.'), '5.0 the count is the photos she has');
    await v.p.evaluate(() => { const bs = document.querySelectorAll('.st-grid button'); bs[0].click(); bs[3].click(); });
    await v.tap('Use these photos'); await v.waitStep('eliza');
    const gone = [img(0), img(3)];
    const inLooks = S.looks.flatMap((l) => l.photos.map((x) => x.url));
    ok(S.portfolio.length === 3 && !S.portfolio.some((x) => gone.includes(x.image_url)), '5.1 the two are gone from her portfolio', JSON.stringify(S.portfolio));
    ok(!gone.some((u) => inLooks.includes(u)) && !S.looks.some((l) => l.id === 'L1') && JSON.stringify(S.looks.find((l) => l.id === 'L3').photos.map((x) => x.id)) === '["lp4"]' && S.looks.some((l) => l.id === 'L2'),
      '5.2 and from every draft look: a look left empty is deleted, a look with another photo keeps it, others untouched', JSON.stringify(S.looks));
    ok(S.coverPatched && S.coverPatched.length === 2 && !S.coverPatched.some((c) => c.photo.url === img(0)), '5.3 and from the draft\u2019s cover slides', JSON.stringify(S.coverPatched));

    sec('6 S9 and S10, the master on');
    const w6 = await v.words(); ok(!w6.includes('Eliza is not answering yet') && w6.includes('Not now') && w6.includes('You can turn Eliza on any time in WhatsApp and Instagram.'), '6.0 no waiting line while the master is on; On / Off / Not now');
    await v.tap('Not now'); await v.waitStep('ready');
    const sw = S.calls.filter((c) => c.route.endsWith('/whatsapp-eliza/switch')).pop();
    ok(sw && sw.body && sw.body.on === false, '6.1 Not now posts { on: false }', JSON.stringify(sw && sw.body));
    const rr = await v.p.evaluate(() => Array.from(document.querySelectorAll('[data-ready-rows] .st-row')).map((e) => e.innerText.trim()));
    ok(JSON.stringify(rr) === JSON.stringify(['Website draft in Noir', '3 packages saved', '3 photos on your website', 'Eliza off for WhatsApp']), '6.2 S10 rows say what is true; Eliza\u2019s from GET', JSON.stringify(rr));
    ok((await v.words()).includes('It goes live at devroy.thedreamwedding.in when you publish it.'), '6.3 her own address');
    await v.tap('Publish my website');
    await until(async () => (await v.path()) !== '/vendor/onboarding', 30000, 'leaving after publish');
    const checked = await v.p.evaluate(() => localStorage.getItem('tdw_first_build_checked')).catch(() => null);
    ok(S.published && checked === B, '6.4 Publish waits on the server\u2019s ok, then Home; the build is marked checked on this phone', JSON.stringify({ pub: S.published, checked }));
    await v.close();

    // ── §7 the master faked off ─────────────────────────────────────────────────────────────────────────────────────
    sec('7 the master off');
    const S7 = world({ master: false, missing: [] }); const v7 = await open(S7);
    await until(async () => (await v7.words()).includes('Your business is ready to check'), 180000, 'the build');
    await v7.tap('Continue'); await v7.waitStep('style'); await v7.tap('Use Gallery'); await v7.waitStep('packages');
    await v7.tap('These look right'); await v7.waitStep('photos'); await v7.tap('Use these photos'); await v7.waitStep('eliza');
    ok((await v7.words()).includes('Eliza is not answering yet. She starts when TDW switches her on. Your choice is kept.'), '7.1 the waiting line shows only now');
    await v7.tap('On'); await v7.waitStep('ready');
    const sw7 = S7.calls.filter((c) => c.route.endsWith('/whatsapp-eliza/switch')).pop();
    const row7 = await v7.p.evaluate(() => (document.querySelector('[data-eliza-row]') || {}).innerText || '');
    ok(sw7 && sw7.body.on === true && row7.trim() === 'Eliza: starts when TDW switches her on' && S7.looks.length === 3 && !S7.coverPatched, '7.2 On posts { on: true }; S10 says when she starts; with nothing unticked nothing on the site is touched', JSON.stringify({ body: sw7 && sw7.body, row7 }));
    await v7.close();

    // ── §8 a failed step, and a refusal in the server's own words ───────────────────────────────────────────────────
    sec('8 a failed step and a refusal');
    const S8 = world({ build: 'failed', refuse: 'Please add a city we can find.' }); const v8 = await open(S8);
    await until(async () => (await v8.words()).includes('One part could not be done. The rest is ready to check.'), 180000, 'the failed build');
    const r8 = await v8.p.evaluate(() => (document.querySelector('[data-step="packages"]') || {}).innerText || '');
    ok(r8.trim() === 'This step could not finish. You can add this yourself.' && S8.reads === 0, '8.1 failed: its line is the server\u2019s, and an ended build is not read again', JSON.stringify({ r8, reads: S8.reads }));
    await v8.tap('Continue'); await v8.waitStep('details'); await until(async () => (await v8.p.$('.ob-lbl')) !== null, 60000, 'S5'); await v8.box('Based in', 'Delhi'); await v8.box('Your starting price, in Rs', '9'); await v8.tap('Continue');
    await until(async () => (await v8.words()).includes('Please add a city we can find.'), 20000, 'the refusal');
    ok((await v8.at()) === 'details', '8.2 a refusal is shown in the server\u2019s words and the screen stays');
    await v8.close();

    // ── §9 no build ──────────────────────────────────────────────────────────────────────────────────────────────────
    sec('9 no build: S5 alone, then Home');
    const S9 = world({ build: 'none' }); const v9 = await open(S9);
    await v9.waitStep('details', 180000);
    await until(async () => (await v9.p.$('.ob-lbl')) !== null, 60000, 'S5');
    const top9 = await v9.p.evaluate(() => (document.querySelector('.st-top') || {}).innerText || '');
    await v9.box('Based in', 'Delhi'); await v9.box('Your starting price, in Rs', '50000'); await v9.tap('Continue');
    await until(async () => (await v9.words()).includes('Open your studio'), 30000, 'the done screen');
    const w9 = await v9.words();
    ok(w9.includes('The Dream Wedding') && w9.includes('You\u2019re all set, Dev.') && w9.includes('Share your TDW link. Clients message you there.') && w9.includes('Your TDW link') && w9.includes('devroy.thedreamwedding.in') && w9.includes('Open your studio'),
      '9.0 the old form\u2019s done screen, exactly: title, line, the link in its CopyBox, Open your studio', w9.slice(0, 300));
    await v9.tap('Open your studio');
    await until(async () => (await v9.path()) !== '/vendor/onboarding', 30000, 'Home');
    ok(!/of 8/.test(top9) && !S9.calls.some((c) => c.route.includes('/site/') || c.route.includes('whatsapp-eliza')), '9.1 no step count, and nothing of the site or Eliza is touched', JSON.stringify({ top9, calls: S9.calls.map((c) => c.route) }));
    await v9.close();
    }
    // ── §13 S4c: Continue while the build goes on, and the S6 wait (runs once: it waits the real 3 minutes) ────────
    if (!process.env.FE9_ONLY || process.env.FE9_ONLY === '13') {
      sec('13 S4c and the S6 wait');
      const S13 = world({ hold: true, missing: [] }); const v13 = await open(S13);
      await until(async () => (await v13.words()).includes('This is taking longer than usual. TDW keeps building while you carry on.'), 300000, 'S4c');
      const b13 = await v13.p.evaluate(() => Array.from(document.querySelectorAll('.st-foot button')).map((b) => b.innerText.trim()));
      ok(JSON.stringify(b13) === '["Continue"]', '13.1 S4c: its line, and one button, Continue (not Go to Home)', JSON.stringify(b13));
      await v13.tap('Continue'); await v13.waitStep('style');
      const st13 = await v13.p.evaluate(() => ({ row: (document.querySelector('[data-step="website"]') || {}).getAttribute ? document.querySelector('[data-step="website"]').getAttribute('data-state') : null,
        off: Array.from(document.querySelectorAll('.st-foot button')).find((b) => /^Use /.test(b.innerText.trim())).disabled }));
      ok(st13.row === 'running' && st13.off === true && S13.style === null, '13.2 S6 while the website step runs: its row shows running and "Use" waits; nothing is written', JSON.stringify(st13));
      S13.hold = false; const n13 = S13.calls.length;
      await until(async () => v13.p.evaluate(() => !Array.from(document.querySelectorAll('.st-foot button')).find((b) => /^Use /.test(b.innerText.trim())).disabled), 30000, 'the step to end').catch(async (e) => { console.log('    after hold off: ' + S13.calls.slice(n13).map((c) => c.route).join(' ')); throw e; });
      ok((await v13.p.$('[data-step="website"]')) === null, '13.3 the moment the step ends, the row goes and "Use" is enabled');
      await v13.close();
    }

    // ── §17 the filled controls in light ────────────────────────────────────────────────────────────────────────────
    if (!process.env.FE9_ONLY || process.env.FE9_ONLY === '17') {
      sec('17 light: the filled controls');
      const S17 = world(); const v17 = await open(S17, null, false, 'light');
      await until(async () => (await v17.words()).includes('Your business is ready to check'), 180000, 'the build');
      const ink = (sel) => v17.p.evaluate((q) => { const e = document.querySelector(q); if (!e) return null; const probe = document.createElement('span'); probe.style.color = 'var(--role-on-primary)'; e.parentElement.appendChild(probe); const want = getComputedStyle(probe).color; probe.remove();
        return { got: getComputedStyle(e).color, want, light: document.documentElement.classList.contains('theme-light'), w: Math.round(e.getBoundingClientRect().width), pw: Math.round(e.parentElement.getBoundingClientRect().width) }; }, sel);
      const c17 = await ink('.st-foot .rp-next');
      ok(c17 && c17.got === c17.want && c17.want === 'rgb(255, 255, 255)' && c17.w === c17.pw, '17.1 S4\u2019s Continue in light: on-primary ink, the full width', JSON.stringify(c17));
      const tone = await v17.p.evaluate(() => { const want = (v) => { const q = document.createElement('span'); q.style.color = v; document.querySelector('.st').appendChild(q); const c = getComputedStyle(q).color; q.remove(); return c; };
        const col = (q) => { const e = document.querySelector(q); return e ? getComputedStyle(e).color : null; };
        return { sub: col('.st-sub'), mute: want('var(--atelier-ink-mute)'), handle: col('[data-ig-link]'), primary: want('var(--role-primary)'), opens: col('[data-step="website"] .st-small'), ink: want('var(--atelier-ink)') }; });
      ok(tone.sub === tone.mute && tone.opens === tone.mute && tone.handle === tone.primary && tone.mute !== tone.ink, '17.3 S4 in light: the sub line and the opens line read the muted ink, her @handle the primary, never the blanket\u2019s plain ink', JSON.stringify(tone));
      await v17.tap('Continue'); await v17.waitStep('details'); await until(async () => (await v17.p.$('.ob-lbl')) !== null, 60000, 'S5');
      await v17.box('Based in', 'Delhi');
      const h17 = await ink('.ob-chip.on'); const g17 = await ink('.ob-go');
      ok(h17 && h17.got === h17.want && g17 && g17.got === g17.want && h17.want === 'rgb(255, 255, 255)', '17.2 S5 in light: the chosen chip and Continue read on-primary ink', JSON.stringify({ h17, g17 }));
      await v17.close();
    }

    // ── §18 a thin answer (the chair's lesson 2, 7 Oct 2026): every door answers { ok: true } with no lists ─────────────
    if (!process.env.FE9_ONLY || process.env.FE9_ONLY === '18') {
      sec('18 a thin answer');
      const thin = () => { const W = world(); W.answer = (route, method, body, query) => { W.calls.push({ route, method, body, query: query || '' }); return { ok: true }; }; return W; };
      const T1 = thin(); const t1 = await open(T1);
      const s1 = await until(async () => { const w = (await t1.words()).trim(); const st = await t1.at(); return w.length > 0 && st && st !== 'loading' ? { w, st } : null; }, 180000, '18.1 (its wait): a drawn screen');
      ok(s1.w.length > 20 && t1.errs.length === 0 && !T1.calls.some((c) => c.method !== 'GET'), '18.1 /vendor/onboarding on a thin answer: a screen is drawn, no page error, nothing written', JSON.stringify({ step: s1.st, words: s1.w.slice(0, 160), errs: t1.errs }));
      await t1.close();
      const T2 = thin(); const t2 = await open(T2, '/vendor/today');
      await until(async () => T2.calls.some((c) => c.route === '/api/v2/vendor/first-build/latest') || (await t2.path()) !== '/vendor/today', 180000, '18.2 (its wait): the card\u2019s read');
      const c18 = await t2.p.$('[data-first-build-card]');
      ok(!c18 && t2.errs.length === 0, '18.2 Today on a thin answer: no Home card (a card never claims what it does not know), no page error', JSON.stringify({ path: await t2.path(), errs: t2.errs }));
      await t2.close();
    }

    // ── §11 the Home card on Today ───────────────────────────────────────────────────────────────────────────────────
    sec('11 S11, the Home card');
    const todayWorld = (state) => { const W = world(); W.me.onboarding = { complete: true, missing: [] };   // the shell sends an unfinished vendor to /vendor/onboarding (WorklistBoot)
      const a = W.answer; W.answer = (route, method, body) => { if (route !== '/api/v2/vendor/first-build/latest') return a(route, method, body);
      W.calls.push({ route, method, body }); return { ok: true, build: { build_id: B, state, steps: [], site_ready: state === 'done' } }; }; return W; };
    async function card(state, checked) {
      const W = todayWorld(state); const t = await open(W, '/vendor/today', checked);
      try { await until(async () => W.calls.some((c) => c.route === '/api/v2/vendor/first-build/latest'), 180000, 'the card\u2019s read'); }
      catch (e) { console.log('    errors: ' + t.errs.join(' | ')); console.log('    at: ' + await t.path() + ' · calls: ' + W.calls.map((c) => c.route).join(' ') + ' · words: ' + (await t.words()).slice(0, 300)); throw e; }
      await until(async () => (await t.p.$('.wl-home')) !== null, 60000, 'Today');
      const shown = await until(async () => { const el = await t.p.$('[data-first-build-card]'); return { el: !!el, words: el ? await t.p.evaluate((e) => e.innerText.replace(/\s+/g, ' ').trim(), el) : '' }; }, 3000, 'settle').catch(() => ({ el: false, words: '' }));
      shown.go = await t.p.evaluate(() => { const a = document.querySelector('[data-first-build-card] a'); if (!a) return null; const c = getComputedStyle(a); const probe = document.createElement('span'); probe.style.cssText = 'color:var(--role-on-primary);background:var(--role-primary)'; a.parentElement.appendChild(probe); const w = getComputedStyle(probe); const out = { bg: c.backgroundColor, ink: c.color, line: c.textDecorationLine, h: Math.round(a.getBoundingClientRect().height), wantBg: w.backgroundColor, wantInk: w.color, href: a.getAttribute('href') }; probe.remove(); return out; });
      const reads = W.calls.filter((c) => c.route === '/api/v2/vendor/first-build/latest').length;
      await t.close(); return Object.assign(shown, { reads });
    }
    const c1 = await card('done', false);
    ok(c1.el && c1.words === 'Your business is ready to check Your website draft, packages and photos are ready. Nothing is published until you say yes. Check it' && c1.reads === 1, '11.1 an ended build not yet checked: the card, its words, one read', JSON.stringify(c1));
    const g = c1.go || {};
    ok(g.href === '/vendor/onboarding' && g.bg === g.wantBg && g.ink === g.wantInk && g.line === 'none' && g.h >= 44, '11.4 "Check it" is Today\u2019s filled button (primary ground, on-primary ink, no underline, at least 44 high), to the flow', JSON.stringify(g));
    const c2 = await card('done', true); ok(!c2.el, '11.2 the same build checked on this phone: no card', JSON.stringify(c2));
    const c3 = await card('running', false); ok(!c3.el, '11.3 a build still running: no card', JSON.stringify(c3));

    // ── §12 the timing part, repeated (e-275) ─────────────────────────────────────────────────────────────────────────
    const REPEAT = Math.max(1, Number(process.env.FE9_REPEAT || 1));
    sec(`12 following a build to its end, ${REPEAT} time(s) on fresh worlds`);
    let good = 0; const bad = [];
    for (let i = 0; i < REPEAT; i += 1) {
      const W = world(); const t = await open(W);
      try {
        await until(async () => (await t.words()).includes('Your business is ready to check'), 120000, 'the build');
        const rows12 = await t.p.evaluate(() => Array.from(document.querySelectorAll('[data-step]')).map((e) => e.getAttribute('data-state')));
        if (rows12.join() === 'done,done,done,done,done' && W.reads >= 3 && W.reads <= 6) good += 1; else bad.push(JSON.stringify({ i, rows12, reads: W.reads }));
      } catch (e) { bad.push(String(e.message)); }
      await t.close();
    }
    ok(good === REPEAT, `12.1 every run followed the build to its end by its own state (${good} of ${REPEAT})`, bad.join(' | '));
  } finally {
    await Promise.race([browser.close(), sleep(15000)]);
    const s = await server.stop();
    ok(s.portFree, '10.1 the dev server stopped whole and freed its port');
  }
  console.log(`\nfe9_two_minute_start: ${pass} pass, ${fail} fail`);
  process.exit(fail ? 1 : 0);
}
main().catch((e) => { console.log('fe9_two_minute_start crashed: ' + (e && e.stack || e)); process.exit(1); });
