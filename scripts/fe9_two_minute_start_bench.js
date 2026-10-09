'use strict';
// scripts/fe9_two_minute_start_bench.js · CE-47 · FE-9 · THE TWO-MINUTE START (package 1: S4 to S10, S11; package 2: S2, B1).
// The REAL flow at /vendor/onboarding (`next dev`, headless Chromium), every door answered by this bench's own fake
// server, kept in memory, so each write can be checked against what the server would then hold.
// F-44.364: the service worker is bypassed (Network.setBypassServiceWorker), so an intercepted '/api/' is never read as
// an empty answer. e-275: nothing waits on a fixed pause; each step waits on the thing itself (the element, the state,
// the request), with a bound; the build is followed through its own state (running, running, done); teardown bounded.
//   §1 a build in progress -> S4 rows: waiting steps by name, finished steps by the SERVER's line, 'opens' with its plan
//   §2 S5: only the fields the server lists as missing; Select cities pre-filled from Based in; the price helper; the POST
//   §3 S6: Gallery "In use"; picking Noir sends { style: 'noir' } and the button says "Use Noir"
//   §4 S7: her packages, "Price on request", the main package marked
//   §5 S8: an untick removes the photo from her portfolio, from every draft look (a look left empty is deleted, a look
//      with others keeps them) and from the draft's cover slides; nothing else is touched
//   §6 S9 and S10 with the master ON: Not now posts { on: false }; S10 reads GET: "Eliza does not answer your WhatsApp messages."; Publish waits
//      on the server's ok, then Home; the build is marked checked on this phone
//   §7 the master faked OFF: S9 shows the waiting line; On posts { on: true }; S10 "Eliza starts when TDW switches her on."
//   §8 a step that failed and a refusal: S4's failed sub line; a refused S5 shows the server's words, verbatim
//   §9 the build door cannot be read: S5 alone, then the old form's done screen (what the old form did)
//   §11 S11 on Today: the card for an ended build not yet checked on this phone; gone once checked; none while running
//   §19 WEB-4's contract: website_can_fill offers "Use my photos on my website" on an ended build; the tap posts
//       { step: "website" } once and follows the build; false: no offer; a 409 refusal is shown as it is
//   §17 light mode: every filled control (S4's Continue, S5's chosen chip and Continue) reads its on-primary ink, never
//       the ink globals.css's light blanket would give it; S4's Continue spans the screen; S4's muted lines stay muted
//       and her @handle stays primary
//   §18 a thin answer ({ ok: true } with no lists from every door): onboarding draws a screen and writes nothing; Today
//       draws no Home card; no page error on either
//   §12 e-275, the timing-dependent part (following a build through its own state) repeated FE9_REPEAT times in this one
//       process on fresh worlds (default 1; the seat runs 20 under load and states the count). Bare, as every floor runs it,
//       it runs once.
//   §14 package 2, S2: no build -> Connect Instagram is a real link, minted before the tap with return=start; and
//       "I don't use Instagram"; ?ig=cancelled -> S2 again with the note, nothing started
//   §15 ?ig=connected -> the build is started once (POST), the address loses ?ig, S4 follows it
//   §16 B1: photos from her phone go through the Portfolio room's doors (sign, upload, register), then the build starts;
//       S4 shows the photos step's skipped line verbatim; S8 is not shown (its words would not be true), S7 -> S9
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
  const o = Object.assign({ master: true, build: 'normal', hold: false, missing: ['city', 'starting_price', 'service_area'], refuse: null, noLatest: false, b1: false, fill: false, fillRefuse: null }, opts || {});
  const S = {
    hold: o.hold, calls: [], hers: null, started: false, posts: 0, fills: 0, authQ: [], up: 0, published: false, style: null, coverPatched: null,
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
      { key: 'photos', line: 'We added 5 of your photos.', counts: { imported: 5, no_room: 0 } }, { key: 'website', line: 'Your website draft is ready to check.', opens: [{ line: 'More styles, colour sets and font pairings are available on Essential.', plan: 'Essential' }] },
      { key: 'packages', line: 'We added 3 starter packages.' }, { key: 'storefront', line: 'We filled in your About from your Instagram bio.' },
      { key: 'eliza', line: 'Eliza knows your packages and prices.' }];
    return all.map((s, i) => {
      // AMENDED BY LABEL · WEB-4's contract (server train 13, 8 Oct 2026): the fake server speaks its lines and fields
      if (o.b1 && s.key === 'photos' && i < k) return { key: s.key, state: 'done', line: `Your portfolio has ${S.portfolio.length} photo${S.portfolio.length === 1 ? '' : 's'}. We used ${S.portfolio.length === 1 ? 'it' : 'them'} for your website.`, counts: { imported: 0, no_room: 0 } };
      if (o.b1 && s.key === 'storefront' && i < k) return { key: s.key, state: 'skipped', line: 'Instagram is not connected, so we left your About empty.', counts: { filled: 0 } };
      if (o.build === 'failed' && s.key === 'packages') return { key: s.key, state: 'failed', line: 'TDW could not finish this step. You can fill in this part yourself.', counts: null };
      const st = i < k ? 'done' : i === k ? 'running' : 'waiting';
      return { key: s.key, state: st, line: st === 'done' ? s.line : null, counts: st === 'done' ? (s.counts || null) : null, opens: st === 'done' ? (s.opens || null) : null };
    });
  };
  if (o.b1) S.portfolio = [];
  S.answer = (route, method, body, query) => {
    S.calls.push({ route, method, body, query: query || '' });
    if (route === '/api/v2/vendor/first-build' && method === 'POST' && body && body.step === 'website') {
      S.fills += 1;
      if (o.fillRefuse) return { __status: 409, ok: false, error: o.fillRefuse, code: 'NO_PHOTOS' };
      S.reads = 0; o.fill = false; return { ok: true, build_id: B, already: false };
    }
    if (route === '/api/v2/vendor/first-build' && method === 'POST') { S.posts += 1; S.started = true; return { ok: true, build_id: B, already: false }; }
    if (route === '/api/v2/vendor/ig/authorize') { S.authQ.push(query || ''); return { ok: true, authorize_url: 'https://www.instagram.com/oauth/authorize?client_id=fe9&n=' + S.authQ.length, flavour: 'basic' }; }
    if (route === '/api/v2/vendor/portfolio/upload-url' && method === 'POST') return { ok: true, upload_url: `http://localhost:${PORT}/__api/__cloud`, params: { api_key: 'k', timestamp: 1, signature: 's', folder: 'f', public_id: 'x' + S.up } };
    if (route === '/__cloud' && method === 'POST') { S.up += 1; return { secure_url: img(S.up % 5) + '&up=' + S.up }; }
    if (route === '/api/v2/vendor/portfolio' && method === 'POST') { const im = { id: 'u' + S.portfolio.length, image_url: body && body.image_url }; S.portfolio.push(im); return { ok: true, image: im }; }
    if (route === '/api/v2/vendor/me') return { ok: true, vendor: S.me };
    if (route === '/api/v2/vendor/first-build/latest') {
      if (o.noLatest) return { ok: false, error: 'not reachable' };
      if (o.build === 'none' && !S.started) return { ok: true, build: null };
      if (o.build === 'none') return { ok: true, build: { build_id: B, state: 'running', steps: steps(0), site_ready: false } };
      if (o.build === 'ended') return { ok: true, build: { build_id: B, state: 'done', steps: steps(5), site_ready: true, website_can_fill: !!o.fill } };
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
      const out = S.answer(route, r.method(), body, u.split('?')[1] || '');
      const status = out && out.__status ? out.__status : 200; if (out) delete out.__status;
      return r.respond({ status, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(out) });
    });
    await p.goto(`http://localhost:${PORT}${where || '/vendor/onboarding'}`, { waitUntil: 'domcontentloaded', timeout: 240000 });
    const at = () => p.evaluate(() => { const e = document.querySelector('[data-start-step]'); return e ? e.getAttribute('data-start-step') : null; }).catch(() => null);
    const waitStep = (s, ms, cell) => until(async () => (await at()) === s, ms || 60000, (cell ? cell + ' (its wait): ' : '') + 'step ' + s);   // a wait names the cell it serves
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
    // AMENDED BY LABEL · R-47.1 (the founder, 8 Oct 2026): the start's lines as complete, plain sentences
    ok(rows[0] === 'We added 5 of your photos.' && rows[1] === 'Your website draft is ready to check. More styles, colour sets and font pairings are available on Essential.' && rows[4] === 'Eliza knows your packages and prices.',
      '1.2 every finished step shows the SERVER\u2019s line, and each opens line is the server\u2019s sentence, whole, with nothing added', JSON.stringify(rows));
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
    // AMENDED BY LABEL · R-47.1 (the founder, 8 Oct 2026): the start's lines as complete, plain sentences
    ok(help === 'Your storefront shows this as From Rs 80,000. You can change it at any time.', '2.4 the helper shows her own price', help);
    await v.tap('Continue'); await v.waitStep('style');
    const post = S.calls.filter((c) => c.route === '/api/v2/vendor/onboarding' && c.body && Object.keys(c.body).length).pop();
    ok(post && post.body.city === 'Delhi' && post.body.rate_min === '80000' && post.body.service_area === 'select_cities' && JSON.stringify(post.body.service_cities) === '["Delhi"]',
      '2.5 saved through the same door the old form used', JSON.stringify(post && post.body));

    sec('3 S6');
    const w3 = await v.words(); ok(/In use\s*Gallery/.test(w3) && w3.includes('Use Gallery'), '3.1 Gallery is "In use" (amended by label, R-47.1); the button names it');
    await v.p.evaluate(() => { const b = Array.from(document.querySelectorAll('.st-style')).find((x) => x.innerText.includes('Noir')); if (b) b.click(); });
    await until(async () => (await v.words()).includes('Use Noir'), 10000, 'Use Noir');
    await v.tap('Use Noir'); await v.waitStep('packages');
    ok(S.style === 'noir', '3.2 the pick is sent as { style: "noir" } to her draft', S.style);

    sec('4 S7');
    const pk = await v.p.evaluate(() => Array.from(document.querySelectorAll('[data-package]')).map((e) => e.innerText.replace(/\s+/g, ' ').trim()));
    ok(pk.length === 3 && pk.every((t) => t.endsWith('Price on request')) && pk[1].startsWith('Main package'), '4.1 her packages, "Price on request", the main one marked', JSON.stringify(pk));

    sec('5 S8, an untick is true on her website too');
    await v.tap('These look right'); await v.waitStep('photos');
    // AMENDED BY LABEL · R-47.1 (the founder, 8 Oct 2026): the start's lines as complete, plain sentences
    ok((await v.words()).includes('TDW added 5 photos from your Instagram.'), '5.0 the count is the photos she has');
    await v.p.evaluate(() => { const bs = document.querySelectorAll('.st-grid button'); bs[0].click(); bs[3].click(); });
    await v.tap('Use these photos'); await v.waitStep('eliza');
    const gone = [img(0), img(3)];
    const inLooks = S.looks.flatMap((l) => l.photos.map((x) => x.url));
    ok(S.portfolio.length === 3 && !S.portfolio.some((x) => gone.includes(x.image_url)), '5.1 the two are gone from her portfolio', JSON.stringify(S.portfolio));
    ok(!gone.some((u) => inLooks.includes(u)) && !S.looks.some((l) => l.id === 'L1') && JSON.stringify(S.looks.find((l) => l.id === 'L3').photos.map((x) => x.id)) === '["lp4"]' && S.looks.some((l) => l.id === 'L2'),
      '5.2 and from every draft look: a look left empty is deleted, a look with another photo keeps it, others untouched', JSON.stringify(S.looks));
    ok(S.coverPatched && S.coverPatched.length === 2 && !S.coverPatched.some((c) => c.photo.url === img(0)), '5.3 and from the draft\u2019s cover slides', JSON.stringify(S.coverPatched));

    sec('6 S9 and S10, the master on');
    const w6 = await v.words(); ok(!w6.includes('Eliza is not answering yet') && w6.includes('Not now') && w6.includes('You can turn Eliza on later, on the WhatsApp and Instagram page.'), '6.0 no waiting line while the master is on; On / Off / Not now');
    await v.tap('Not now'); await v.waitStep('ready');
    const sw = S.calls.filter((c) => c.route.endsWith('/whatsapp-eliza/switch')).pop();
    ok(sw && sw.body && sw.body.on === false, '6.1 Not now posts { on: false }', JSON.stringify(sw && sw.body));
    const rr = await v.p.evaluate(() => Array.from(document.querySelectorAll('[data-ready-rows] .st-row')).map((e) => e.innerText.trim()));
    ok(JSON.stringify(rr) === JSON.stringify(['Your website uses the Noir style.', 'TDW saved 3 packages.', 'Your website shows 3 photos.', 'Eliza does not answer your WhatsApp messages.']), '6.2 S10 rows say what is true; Eliza\u2019s from GET', JSON.stringify(rr));
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
    ok((await v7.words()).includes('Eliza is not answering yet. She starts when TDW switches her on. TDW has saved your choice.'), '7.1 the waiting line shows only now');
    await v7.tap('On'); await v7.waitStep('ready');
    const sw7 = S7.calls.filter((c) => c.route.endsWith('/whatsapp-eliza/switch')).pop();
    const row7 = await v7.p.evaluate(() => (document.querySelector('[data-eliza-row]') || {}).innerText || '');
    ok(sw7 && sw7.body.on === true && row7.trim() === 'Eliza starts when TDW switches her on.' && S7.looks.length === 3 && !S7.coverPatched, '7.2 On posts { on: true }; S10 says when she starts; with nothing unticked nothing on the site is touched', JSON.stringify({ body: sw7 && sw7.body, row7 }));
    await v7.close();

    // ── §8 a failed step, and a refusal in the server's own words ───────────────────────────────────────────────────
    sec('8 a failed step and a refusal');
    const S8 = world({ build: 'failed', refuse: 'Please add a city we can find.' }); const v8 = await open(S8);
    await until(async () => (await v8.words()).includes('TDW could not finish one part. The rest is ready for you to check.'), 180000, 'the failed build');
    const r8 = await v8.p.evaluate(() => (document.querySelector('[data-step="packages"]') || {}).innerText || '');
    ok(r8.trim() === 'TDW could not finish this step. You can fill in this part yourself.' && S8.reads === 0, '8.1 failed: its line is the server\u2019s, and an ended build is not read again', JSON.stringify({ r8, reads: S8.reads }));
    await v8.tap('Continue'); await v8.waitStep('details'); await until(async () => (await v8.p.$('.ob-lbl')) !== null, 60000, 'S5'); await v8.box('Based in', 'Delhi'); await v8.box('Your starting price, in Rs', '9'); await v8.tap('Continue');
    await until(async () => (await v8.words()).includes('Please add a city we can find.'), 20000, 'the refusal');
    ok((await v8.at()) === 'details', '8.2 a refusal is shown in the server\u2019s words and the screen stays');
    await v8.close();

    // ── §9 no build ──────────────────────────────────────────────────────────────────────────────────────────────────
    sec('9 the build door cannot be read: S5 alone, then the old done screen');
    const S9 = world({ build: 'none', noLatest: true }); const v9 = await open(S9);
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
    // ── §14 to §16, package 2 ──────────────────────────────────────────────────────────────────────────────────────
    if (!process.env.FE9_ONLY || process.env.FE9_ONLY === '14') {
      sec('14 S2');
      const S14 = world({ build: 'none' }); const v14 = await open(S14);
      await v14.waitStep('connect', 180000);
      const a14 = await until(() => v14.p.evaluate(() => { const a = document.querySelector('a[data-ig-connect]'); return a ? { tag: a.tagName, href: a.getAttribute('href'), text: a.innerText.trim() } : null; }), 30000, '14.1 (its wait): the minted link');
      const w14 = await v14.words();
      ok(a14.href === 'https://www.instagram.com/oauth/authorize?client_id=fe9&n=1' && a14.text === 'Connect Instagram' && S14.authQ.length === 1 && S14.authQ[0] === 'return=start',
        '14.1 Connect Instagram is a real link to the URL minted BEFORE the tap, asked with return=start (once)', JSON.stringify({ a14, authQ: S14.authQ }));
      await v14.close();
      const v14l = await open(world({ build: 'none' }), null, false, 'light'); await v14l.waitStep('connect', 180000, '14.5');
      await until(() => v14l.p.$('a[data-ig-connect]'), 30000, '14.5 (its wait): the minted link');
      // AMENDED BY LABEL · the founder's rule (8 Oct 2026): her own photos are a way in of EQUAL standing with Instagram
      const l14 = await v14l.p.evaluate(() => { const st = (e) => { if (!e) return null; const c = getComputedStyle(e); const r = e.getBoundingClientRect(); return { bg: c.backgroundColor, ink: c.color, font: c.fontWeight + ' ' + c.fontSize, w: Math.round(r.width), h: Math.round(r.height) }; };
        const q = document.createElement('span'); q.style.color = 'var(--role-on-primary)'; q.style.background = 'var(--role-primary)'; document.querySelector('.st').appendChild(q); const want = { ink: getComputedStyle(q).color, bg: getComputedStyle(q).backgroundColor }; q.remove();
        const a = document.querySelector('a[data-ig-connect]'), o = document.querySelector('[data-own-photos]');
        return { ig: st(a), own: st(o), want, igTop: a && Math.round(a.getBoundingClientRect().top), ownTop: o && Math.round(o.getBoundingClientRect().top), igLeft: a && a.getBoundingClientRect().left, ownLeft: o && o.getBoundingClientRect().left }; });
      ok(l14.ig && l14.own && JSON.stringify(l14.ig) === JSON.stringify(l14.own) && l14.own.bg === l14.want.bg && l14.own.ink === l14.want.ink && l14.igTop === l14.ownTop && l14.igLeft < l14.ownLeft,
        '14.5 S2 in light: "Connect Instagram" and "Add my own photos" are the same filled control (ground, ink, weight, size), side by side, on-primary on primary', JSON.stringify(l14));
      await v14l.close();
      // AMENDED BY LABEL · the founder's rule: the title and the second choice in the working words
      ok(w14.includes('Build your business from your photos') && w14.includes('Nothing is published until you say yes') && w14.includes('Add my own photos') && S14.posts === 0 && !w14.includes('Instagram did not connect'),
        '14.2 S2\u2019s words; nothing started; no note before she has tried', w14.slice(0, 300));
      const S14b = world({ build: 'none' }); const v14b = await open(S14b, '/vendor/onboarding?ig=cancelled');
      await v14b.waitStep('connect', 180000);
      const n14 = await until(() => v14b.p.evaluate(() => (document.querySelector('[data-ig-back]') || {}).innerText || ''), 10000, 'the note');
      // AMENDED BY LABEL · R-47.1 (the founder, 8 Oct 2026): the start's lines as complete, plain sentences
      const CARD = 'Instagram did not connect. You can try again, or you can add your own photos instead. Instagram connects only professional accounts, which are business accounts and creator accounts. If your account is personal, you can switch it to a professional account for free in Instagram\u2019s settings.';
      ok(n14.replace(/\s+/g, ' ').trim() === CARD && S14b.posts === 0 && (await v14b.path()) === '/vendor/onboarding' && (await v14b.p.evaluate(() => location.search)) === '',
        '14.3 ?ig=cancelled: S2 again with the ruled card (the line, then B2\u2019s sentence unchanged), nothing started, the address loses ?ig', n14);
      await v14b.close();
      const S14c = world({ build: 'none' }); const v14c = await open(S14c, '/vendor/onboarding?ig=failed&reason=exchange');
      await v14c.waitStep('connect', 180000);
      const n14c = await until(() => v14c.p.evaluate(() => (document.querySelector('[data-ig-back]') || {}).innerText || ''), 10000, 'the card');
      ok(n14c.replace(/\s+/g, ' ').trim() === CARD && S14c.posts === 0 && !(await v14c.words()).includes('personal account'), '14.4 ?ig=failed: the same card; nothing says her account is personal', n14c);
      await v14c.close();

      sec('15 ?ig=connected');
      const S15 = world({ build: 'none', missing: [] }); const v15 = await open(S15, '/vendor/onboarding?ig=connected');
      await v15.waitStep('build', 180000, '15.1');
      await until(async () => (await v15.words()).includes('Your business is ready to check'), 120000, '15.1 (its wait): the build');
      ok(S15.posts === 1 && (await v15.p.evaluate(() => location.search)) === '' && S15.reads >= 1,
        '15.1 back from Instagram connected: the build is started once, the address loses ?ig, S4 follows it to its end', JSON.stringify({ posts: S15.posts, reads: S15.reads }));
      await v15.close();

      sec('16 B1, her phone\u2019s photos');
      const S16 = world({ build: 'none', b1: true }); const v16 = await open(S16);
      await v16.waitStep('connect', 180000);
      await v16.p.evaluate(() => { const b = Array.from(document.querySelectorAll('button')).find((x) => x.innerText.trim() === 'Add my own photos'); if (b) b.click(); });
      await v16.waitStep('phone');
      ok((await v16.words()).includes('Continue without photos') && (await v16.words()).includes('Choose from your phone'), '16.0 B1 with no photos yet: Choose from your phone, Continue without photos');
      // package 3 (FE-9, 8 Oct 2026): B1 stands in S3's place (S3 is Instagram's own screen), so it counts as step 2, and S4 stays 3
      const top16 = await v16.p.evaluate(() => (document.querySelector('.st-top') || {}).innerText || '');
      ok(top16.replace(/\s+/g, ' ').trim() === 'Setting up 2 of 8', '16.4 B1 is step 2 of 8, in S3\u2019s place (S2 is 1, S4 is 3)', top16);
      const fileIn = await v16.p.$('#st-file');
      await fileIn.uploadFile(path.join(ROOT, 'public/examples/ads/example-hands.jpg'), path.join(ROOT, 'public/examples/ads/example-bouquet.jpg'));
      await until(async () => (await v16.words()).includes('Continue with 2 photos'), 30000, '16.1 (its wait): two photos');
      const regs = S16.calls.filter((c) => c.route === '/api/v2/vendor/portfolio' && c.method === 'POST');
      ok(regs.length === 2 && S16.portfolio.length === 2 && S16.calls.filter((c) => c.route === '/__cloud').length === 2 && S16.posts === 0,
        '16.1 each photo is signed, uploaded and registered in her portfolio, one at a time; nothing started yet', JSON.stringify(regs.map((c) => c.body)));
      await v16.tap('Continue with 2 photos'); await v16.waitStep('build');
      await until(async () => (await v16.words()).includes('Your business is ready to check'), 120000, '16.2 (its wait): the build');
      const r16 = await v16.p.evaluate(() => { const e = document.querySelector('[data-step="photos"]'); return e ? [e.getAttribute('data-state'), e.innerText.trim()] : null; });
      ok(S16.posts === 1 && JSON.stringify(r16) === '["done","Your portfolio has 2 photos. We used them for your website."]', '16.2 the build starts; S4 shows the photos step\u2019s line for her own photos, verbatim (WEB-4\u2019s contract)', JSON.stringify(r16));
      await v16.tap('Continue'); await v16.waitStep('details'); await until(async () => (await v16.p.$('.ob-lbl')) !== null, 60000, 'S5');
      await v16.box('Based in', 'Delhi'); await v16.box('Your starting price, in Rs', '50000'); await v16.tap('Continue');
      await v16.waitStep('style'); await v16.tap('Use Gallery'); await v16.waitStep('packages');
      await v16.tap('These look right'); await v16.waitStep('eliza', 60000, '16.3');
      ok(!S16.calls.some((c) => c.method === 'DELETE'), '16.3 S8 is not shown when no photos came from Instagram: S7 goes to S9, nothing is removed');
      await v16.close();
    }

    // ── §19 WEB-4's contract: the website step alone, again, from her own photos ──────────────────────────────────
    if (!process.env.FE9_ONLY || process.env.FE9_ONLY === '19') {
      sec('19 the website filled from her photos');
      const S19 = world({ build: 'ended', fill: true, missing: [] }); const v19 = await open(S19);
      await until(async () => (await v19.p.$('[data-fill-offer]')) !== null, 180000, '19.1 (its wait): the offer');
      const w19 = await v19.p.evaluate(() => document.querySelector('[data-fill-offer]').innerText.replace(/\s+/g, ' ').trim());
      ok(w19 === 'Your portfolio has photos that your website draft does not use yet. Use my photos on my website' && S19.fills === 0, '19.1 website_can_fill true on an ended build: the offer, its words; nothing sent yet', w19);
      await v19.tap('Use my photos on my website');
      await until(async () => S19.fills === 1 && S19.reads >= 1, 30000, '19.2 (its wait): the fill and a read');
      const p19 = S19.calls.filter((c) => c.route === '/api/v2/vendor/first-build' && c.method === 'POST');
      ok(p19.length === 1 && JSON.stringify(p19[0].body) === '{"step":"website"}' && S19.posts === 0 && (await v19.p.$('[data-fill-offer]')) === null,
        '19.2 the tap posts { step: "website" } once, starts no new build, follows the build by its own reads, and the offer goes', JSON.stringify({ bodies: p19.map((c) => c.body), reads: S19.reads }));
      await v19.close();
      const S19b = world({ build: 'ended', fill: false, missing: [] }); const v19b = await open(S19b);
      await until(async () => (await v19b.words()).includes('Your business is ready to check'), 180000, '19.3 (its wait): the ended build');
      ok((await v19b.p.$('[data-fill-offer]')) === null && S19b.fills === 0, '19.3 website_can_fill false: no offer');
      await v19b.close();
      const R19 = 'Your portfolio has no photos yet, so we did not change your website.';
      const S19c = world({ build: 'ended', fill: true, fillRefuse: R19, missing: [] }); const v19c = await open(S19c);
      await until(async () => (await v19c.p.$('[data-fill-offer]')) !== null, 180000, '19.4 (its wait): the offer');
      await v19c.tap('Use my photos on my website');
      await until(async () => (await v19c.words()).includes(R19), 20000, '19.4 (its wait): the refusal');
      ok(S19c.fills === 1 && (await v19c.at()) === 'build', '19.4 a 409 refusal is shown in the server\u2019s words, as it is; the screen stays');
      await v19c.close();
    }

    // ── §13 S4c: Continue while the build goes on, and the S6 wait (runs once: it waits the real 3 minutes) ────────
    if (!process.env.FE9_ONLY || process.env.FE9_ONLY === '13') {
      sec('13 S4c and the S6 wait');
      const S13 = world({ hold: true, missing: [] }); const v13 = await open(S13);
      await until(async () => (await v13.words()).includes('This is taking longer than usual. TDW keeps building while you continue.'), 300000, 'S4c');
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
    const todayWorld = (state, fill) => { const W = world(); W.me.onboarding = { complete: true, missing: [] };   // the shell sends an unfinished vendor to /vendor/onboarding (WorklistBoot)
      const a = W.answer; W.answer = (route, method, body) => { if (route !== '/api/v2/vendor/first-build/latest') return a(route, method, body);
      W.calls.push({ route, method, body }); return { ok: true, build: { build_id: B, state, steps: [], site_ready: state === 'done', website_can_fill: !!fill } }; }; return W; };
    async function card(state, checked, fill, tap) {
      const W = todayWorld(state, fill); const t = await open(W, '/vendor/today', checked);
      try { await until(async () => W.calls.some((c) => c.route === '/api/v2/vendor/first-build/latest'), 180000, 'the card\u2019s read'); }
      catch (e) { console.log('    errors: ' + t.errs.join(' | ')); console.log('    at: ' + await t.path() + ' · calls: ' + W.calls.map((c) => c.route).join(' ') + ' · words: ' + (await t.words()).slice(0, 300)); throw e; }
      await until(async () => (await t.p.$('.wl-home')) !== null, 60000, 'Today');
      const shown = await until(async () => { const el = await t.p.$('[data-first-build-card]'); return { el: !!el, words: el ? await t.p.evaluate((e) => e.innerText.replace(/\s+/g, ' ').trim(), el) : '' }; }, 3000, 'settle').catch(() => ({ el: false, words: '' }));
      shown.go = await t.p.evaluate(() => { const a = document.querySelector('[data-first-build-card] a'); if (!a) return null; const c = getComputedStyle(a); const probe = document.createElement('span'); probe.style.cssText = 'color:var(--role-on-primary);background:var(--role-primary)'; a.parentElement.appendChild(probe); const w = getComputedStyle(probe); const out = { bg: c.backgroundColor, ink: c.color, line: c.textDecorationLine, h: Math.round(a.getBoundingClientRect().height), wantBg: w.backgroundColor, wantInk: w.color, href: a.getAttribute('href') }; probe.remove(); return out; });
      const reads = W.calls.filter((c) => c.route === '/api/v2/vendor/first-build/latest').length;
      if (tap) {   // the card's "Use my photos on my website"
        await t.p.evaluate(() => { const b = document.querySelector('[data-card-fill] button'); if (b) b.click(); });
        await until(async () => (await t.path()) === '/vendor/onboarding', 30000, '11.6 (its wait): the flow').catch(() => null);
        shown.after = await t.path();
        shown.fills = W.calls.filter((c) => c.route === '/api/v2/vendor/first-build' && c.method === 'POST').map((c) => c.body);
      }
      await t.close(); return Object.assign(shown, { reads });
    }
    const c1 = await card('done', false);
    ok(c1.el && c1.words === 'Your business is ready to check Your website draft, packages and photos are ready. Nothing is published until you say yes. Check it' && c1.reads === 1, '11.1 an ended build not yet checked: the card, its words, one read', JSON.stringify(c1));
    const g = c1.go || {};
    ok(g.href === '/vendor/onboarding' && g.bg === g.wantBg && g.ink === g.wantInk && g.line === 'none' && g.h >= 44, '11.4 "Check it" is Today\u2019s filled button (primary ground, on-primary ink, no underline, at least 44 high), to the flow', JSON.stringify(g));
    const c2 = await card('done', true); ok(!c2.el, '11.2 the same build checked on this phone: no card', JSON.stringify(c2));
    const c3 = await card('running', false); ok(!c3.el, '11.3 a build still running: no card', JSON.stringify(c3));
    // the chair, 8 Oct 2026 (WEB-4's contract): the card also shows whenever website_can_fill is true, checked or not
    const c5 = await card('done', true, true);
    ok(c5.el && c5.words === 'Your portfolio has photos that your website draft does not use yet. Use my photos on my website' && c5.reads === 1,
      '11.5 a checked build with website_can_fill: the card shows the offer alone, its words, one read', JSON.stringify(c5));
    const c6 = await card('done', true, true, true);
    ok(JSON.stringify(c6.fills) === '[{"step":"website"}]' && c6.after === '/vendor/onboarding', '11.6 its button posts { step: "website" } once, then opens the flow, where S4 follows the build', JSON.stringify(c6));
    const c7 = await card('running', true, true); ok(!c7.el, '11.7 a build still running: no card, whatever website_can_fill says', JSON.stringify(c7));
    const c8 = await card('done', false, true);
    ok(c8.el && c8.words === 'Your business is ready to check Your website draft, packages and photos are ready. Nothing is published until you say yes. Check it Your portfolio has photos that your website draft does not use yet. Use my photos on my website',
      '11.8 not yet checked and website_can_fill: the card and the offer under it', JSON.stringify(c8));

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
