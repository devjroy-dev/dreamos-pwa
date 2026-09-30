'use strict';
// scripts/b143_ads1_ads_page_bench.js · TDW CE-46 · ADS-1 · cut 1 · rung b143.
//
// WHAT IT HOLDS (R-46.10 to R-46.13), in the REAL app: `next dev` in mock-session mode, the Ads page at
// /vendor/posts/ads and the Posts room's Ads card, dream-os's doors stubbed at the network with fixtures, headless
// Chromium at 374 x 812, tdw_wl_mode dark and light, the founder's own photograph (476 x 645, a portrait) as the post.
//   §1 every state draws its approved words: shut (PO.notOnYet), the connect (a pre-minted href), the iPhone line only in
//      iOS standalone, the three gaps with their taps, ready.
//   §2 THE FIRST SCREEN (R-46.13): Run's bottom at least 44 px above the Ask bar's top; the preview's box aspect equals
//      the picture's own within 1 percent; the frame no wider than the picture; "Sponsored" on its own line under the
//      handle and not cut.
//   §3 the sheets: All settings rows; one question with the current answer marked and Meta's list searched; the confirm
//      echo sends /run exactly the settings /prepare returned; Your ads with the post's caption line.
//   §4 the Posts card: "{post} is running." with a caption, the no-caption line without.
//   §5 EVERY WORD: each text leaf in the page and the card matches a string of lib/worklist/ads.ts (templates filled),
//      the room's name, PO.notOnYet, or fixture data; nothing else.
//   §6 MUTATIONS (dark theme): a hard-coded word, the fit's 44 px, the picture's width, "Sponsored" inline, the card's
//      caption; each must redden, each restored by sha.
// THE EXIT CODE IS THE VERDICT.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const PORT = 3143;
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const { stripComments } = require('./lib/stripComments.cjs');   // the estate's one comment stripper (tdw_f0774_readers)
const PHOTO = process.env.B143_PHOTO || path.join(ROOT, 'scripts/fixtures/b143_portrait.jpeg');
let pass = 0; let fail = 0; const failed = []; let quiet = false;
function ok(c, name, info) { if (c) { pass += 1; if (!quiet) console.log(`  PASS  ${name}`); } else { fail += 1; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 240) + ']'}`); } }
const sec = (t) => console.log(`\n§${t}`);

// ── the words: every quoted string in ads.ts becomes a pattern ({x} matches any run) ──────────────────────────────
function wordPatterns() {
  const src = stripComments(fs.readFileSync(path.join(ROOT, 'lib/worklist/ads.ts'), 'utf8'));   // through the one home (F-07.74)
  const out = [];
  const re = /'((?:[^'\\]|\\.)*)'/g; let m;
  while ((m = re.exec(src))) {
    const t = m[1].replace(/\\u201c/g, '\u201c').replace(/\\u201d/g, '\u201d').replace(/\\u2019/g, '\u2019').replace(/\\'/g, "'");
    if (!t.trim()) continue;
    const esc = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{[a-zA-Z]+\\\}/g, '(.+?)');
    out.push(new RegExp(`^${esc}$`));
  }
  return out;
}

// ── fixtures ─────────────────────────────────────────────────────────────────────────────────────────────────────
const MEDIA_URL = `http://localhost:${PORT}/b143-photo/post.jpeg`;
const inDays = (n) => new Date(Date.now() + n * 864e5).toISOString();
const SETTINGS = { places: [{ type: 'city', key: '1035921', name: 'Lucknow, Uttar Pradesh, India', radius_km: 25 }], exclude: [], age_min: 22, age_max: 40, genders: [],
  locales: [], interests: [], life_events: [], advantage_audience: false, placements: { instagram: ['stream', 'story', 'reels'], facebook: [] },
  budget: { kind: 'daily', minor: 10000 }, start: inDays(0.01), end: inDays(3.01), bid: { strategy: 'LOWEST_COST_WITHOUT_CAP' }, media_id: '17890000000000001', welcome: { text: '', icebreakers: [] } };
const MEDIA = { id: '17890000000000001', caption: 'Aanya and Rohan. Delhi, September 2026', type: 'IMAGE', url: MEDIA_URL, at: inDays(-7), likes: 212, comments: 18, eligible: true, insights: { saves: 48, reach: 3100 } };
const READY_GAPS = { gap: null, page: { id: 'P1', name: 'The Dream Wedding' }, ig: { id: 'IG1', username: 'thedreamwedding_in' }, account: { id: 'act_4417', name: 'Swati Roy Makeup' } };
const AD = (post) => ({ id: '11111111-2222-4333-8444-555555555555', status: 'running', settings: { ...SETTINGS, post }, total_minor: 30000, started_at: inDays(-1), ends_at: inDays(2), ended_at: null,
  last_insights: [{ day: '2026-09-28', impressions: 1802, reach: 1240, clicks: 61, spend: 105, conversations: 2 }], created_at: inDays(-1) });
const DATA = new Set(['THE DREAM WEDDING ADS', 'Dev Roy', 'Meher and Kabir', 'thedreamwedding_in', 'The Dream Wedding', 'Swati Roy Makeup', 'Aanya and Rohan', 'Lucknow', 'Uttar Pradesh, India', 'Kanpur', '\u2039', '\u203a', '\u2713']);

function scenario(name) {
  const base = { door: { ok: true, open: true, configured: true, connected: true, gaps: READY_GAPS }, list: [], post: { url: MEDIA_URL, caption_line: 'Aanya and Rohan' } };
  if (name === 'shut') base.door = { ok: true, open: false };
  if (name === 'connect') base.door = { ok: true, open: true, configured: true, connected: false };
  if (name === 'page') base.door = { ...base.door, gaps: { gap: 'page' } };
  if (name === 'link') base.door = { ...base.door, gaps: { gap: 'link', page: { id: 'P1', name: 'The Dream Wedding' } } };
  if (name === 'account') base.door = { ...base.door, gaps: { gap: 'ad_account', page: READY_GAPS.page, ig: READY_GAPS.ig } };
  if (name === 'running') base.list = [AD({ url: MEDIA_URL, caption_line: 'Aanya and Rohan' })];
  if (name === 'running_nocap') base.list = [AD({ url: MEDIA_URL, caption_line: null })];
  if (name === 'choose') base.door = { ...base.door, gaps: { gap: 'choose', choose: { accounts: [{ id: 'act_4681657125400464', name: 'THE DREAM WEDDING ADS' }, { id: 'act_799617249564163', name: 'Dev Roy' }] } } };
  if (name === 'noposts') { base.noPosts = true; }
  if (name === 'fbposts') { base.fbPosts = true; }
  return base;
}

async function main() {
  const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
  const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
  if (!fs.existsSync(PHOTO)) { console.log(`b143: the post photograph is missing at ${PHOTO}. Set B143_PHOTO, or add the fixture the handover names. Nothing ran.`); process.exit(2); }
  const photo = fs.readFileSync(PHOTO);
  const server = await dev.start(ROOT, PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` });
  if (!(await server.up())) { console.log('dev server did not come up'); process.exit(2); }
  const browser = await puppeteer.launch({ executablePath: await chromium.executablePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const P = wordPatterns();
  const sent = []; const seen = [];

  async function open(mode, scen, url, opts = {}) {
    const s = scenario(scen);
    const p = await browser.newPage();
    await p.setViewport({ width: 374, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    if (opts.standalone) await p.evaluateOnNewDocument(() => { Object.defineProperty(navigator, 'standalone', { get: () => true }); });
    await p.setCookie({ name: 'tdw_wl_mode', value: mode, domain: 'localhost', path: '/' });
    const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
    await p.setRequestInterception(true);
    p.on('request', (r) => {
      const u = r.url();
      if (u.includes('/b143-photo/')) return r.respond({ status: 200, contentType: 'image/jpeg', body: photo });
      if (!u.includes('/__api/')) return r.continue();
      const route = u.split('/__api')[1].split('?')[0];
      const J = (o) => r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
      seen.push(route);
      if (r.method() === 'POST') { let b = null; try { b = JSON.parse(r.postData() || 'null'); } catch (_e) { b = null; } sent.push({ route, body: b }); }
      if (route === '/api/v2/vendor/ads') return J(s.door);
      if (route === '/api/v2/vendor/ads/authorize') return J({ ok: true, authorize_url: 'https://www.facebook.com/v25.0/dialog/oauth?client_id=4570863996490339&state=x' });
      if (route === '/api/v2/vendor/ads/check') return J({ ok: true, gaps: s.door.gaps });
      const FB = { id: '1008033895736362_555', caption: 'Meher and Kabir', type: 'FACEBOOK', url: MEDIA_URL, at: inDays(-2), likes: null, comments: null, eligible: true, source: 'facebook' };
      const postsNow = s.noPosts ? [] : s.fbPosts ? [MEDIA, FB] : [MEDIA];
      if (route === '/api/v2/vendor/ads/start') return J({ ok: true, facts: { currency: 'INR', minDailyMinor: 10000 }, settings: { ...SETTINGS, media_id: s.noPosts ? null : SETTINGS.media_id }, suggestion: s.noPosts ? null : MEDIA, posts: postsNow });
      if (route === '/api/v2/vendor/ads/posts') return J({ ok: true, posts: postsNow, suggestion: s.noPosts ? null : MEDIA });
      if (route === '/api/v2/vendor/ads/choose') return J({ ok: true, gaps: READY_GAPS });
      if (route === '/api/v2/vendor/ads/list') return J({ ok: true, ads: s.list });
      if (route === '/api/v2/vendor/ads/search') return J({ ok: true, kind: 'places', options: [{ type: 'city', key: '999', name: 'Kanpur, Uttar Pradesh, India' }] });
      if (route === '/api/v2/vendor/ads/prepare') return J({ ok: true, facts: { currency: 'INR', minDailyMinor: 10000 }, settings: { ...SETTINGS, echoed: true }, days: 3, total_minor: 30000, currency: 'INR', confirm: 'ECHO-1' });
      if (route === '/api/v2/vendor/ads/run') return J({ ok: true, ad: { id: 'x', status: 'running' } });
      if (route === '/api/v2/vendor/posts/cards') return J({ ok: false, code: 'no_gallery', error: 'Publish a wedding page with photos to make cards from it.' });
      if (route === '/api/v2/vendor/posts/broadcast') return J({ ok: true, count: 0, couples: [] });
      if (route === '/api/v2/vendor/posts/sunday') return J({ ok: true, state: 'pending', brief: null });
      return J({ ok: true });
    });
    await p.goto(`http://localhost:${PORT}${url}`, { waitUntil: 'domcontentloaded', timeout: 180000 });
    const until = Date.now() + 90000;
    while (Date.now() < until && !(await p.evaluate((sel) => !!document.querySelector(sel), opts.wait || '.ads-room .ads-card, .pst-room'))) await new Promise((r) => setTimeout(r, 300));
    await new Promise((r) => setTimeout(r, opts.settle || 1200));
    return p;
  }
  const text = (p, sel) => p.evaluate((s) => { const el = document.querySelector(s); return el ? el.innerText : null; }, sel);
  const leaves = (p, sel) => p.evaluate((s) => { const out = []; for (const root of document.querySelectorAll(s)) { const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n; while ((n = w.nextNode())) { const t = n.textContent.replace(/\s+/g, ' ').trim(); const st = n.parentElement && getComputedStyle(n.parentElement); if (t && st && st.display !== 'none') out.push(t); } }
    for (const i of root0()) out.push(i); return out;
    function root0() { return Array.from(document.querySelectorAll(`${s} input[placeholder], ${s} textarea[placeholder]`)).map((e) => e.getAttribute('placeholder')); } }, sel);
  const roomTitle = 'Posts & ads';
  const notOnYet = 'Not switched on yet.';
  // Allowed: an ads.ts string (templates filled), fixture data, the room's name, PO.notOnYet, a number, a date the page
  // formats ("28 Sep"), or a comma-joined list whose every part is itself allowed. Anything else is a stray word.
  const one = (t) => P.some((re) => re.test(t)) || DATA.has(t) || t === roomTitle || t === notOnYet || /^\d+$/.test(t) || /^\d{1,2} [A-Z][a-z]{2}$/.test(t);
  function wordsOk(list) { return list.filter((t) => !(one(t) || (t.includes(', ') && t.split(', ').every(one)))); }
  async function measure(p) {
    return p.evaluate(() => {
      const run = document.querySelector('[data-run]'); const img = document.querySelector('[data-media]'); const frame = document.querySelector('[data-preview] .ads-prevhead');
      const handle = document.querySelector('.ads-handle'); const sp = document.querySelector('.ads-sponsored');
      const ask = Array.from(document.querySelectorAll('input, textarea, button')).find((e) => /Ask TDW/.test(e.placeholder || e.textContent || '') && e.getBoundingClientRect().top > innerHeight / 2);
      let el = ask; let top = innerHeight; while (el && el !== document.body) { const r = el.getBoundingClientRect(); if (r.top > innerHeight / 2 && r.height < innerHeight / 2) top = Math.min(top, r.top); el = el.parentElement; }
      const ir = img.getBoundingClientRect(); const fr = frame.getBoundingClientRect(); const hr = handle.getBoundingClientRect(); const sr = sp.getBoundingClientRect();
      return { runBottom: run.getBoundingClientRect().bottom, chromeTop: top, natural: img.naturalWidth / img.naturalHeight, box: ir.width / ir.height, imgW: ir.width, frameW: fr.width,
        spBelow: sr.top >= hr.bottom - 1, spWhole: sp.scrollWidth <= sp.clientWidth + 1 && sr.width > 0 };
    });
  }

  async function runAll(modes, isChild) {
    quiet = isChild;
    for (const mode of modes) {
      if (!isChild) sec(`${mode === 'dark' ? 'Graphite' : 'Chalk'} · the states`);
      seen.length = 0;
      let p = await open(mode, 'shut', '/vendor/posts/ads', { wait: '[data-soon]' });
      const soon = await p.evaluate(() => { const b = document.querySelector('[data-soon]'); return b ? { t: b.textContent, d: b.disabled } : null; });
      ok((await text(p, '.ads-room')).includes('Your ads run from your own Meta ad account.') && soon && soon.t === 'Coming soon' && soon.d === true,
        `${mode} 1.1 shut (R-46.14): the page opens with its words, the action reads Coming soon, disabled`, JSON.stringify(soon));
      // The shell's own reads (/vendor/me) are the shell's; of the ads doors only the state read may leave (twice in
      // development, where React runs effects twice), never /authorize, /start, /posts, /list, /prepare or /run.
      const adsSeen = seen.filter((r) => r.startsWith('/api/v2/vendor/ads'));
      ok(adsSeen.length >= 1 && adsSeen.every((r) => r === '/api/v2/vendor/ads'), `${mode} 1.1a shut: no ads request leaves but the state read`, JSON.stringify(seen));
      ok(wordsOk(await leaves(p, '.ads-room')).length === 0, `${mode} 1.1b shut: every word is ads.ts's`, JSON.stringify(wordsOk(await leaves(p, '.ads-room'))));
      await p.close();
      p = await open(mode, 'shut', '/vendor/posts', { wait: '[data-ads-card-line]' });
      ok((await text(p, '[data-ads-card-line]')) === 'You have not run an ad yet. Your ads run from your own Meta ad account.'
        && (await p.evaluate(() => Array.from(document.querySelectorAll('.pst-room button')).some((b) => b.textContent === 'Open Ads' && !b.disabled))),
        `${mode} 1.1c shut: the Posts card renders and opens the page`, await text(p, '[data-ads-card-line]'));
      await p.close();
      p = await open(mode, 'connect', '/vendor/posts/ads', { wait: '[data-connect]', settle: 1500 });
      await p.evaluate(() => document.querySelector('[data-connect]').click()); await new Promise((r) => setTimeout(r, 500));
      const s2 = await p.evaluate(() => { const a = document.querySelector('[data-before-meta] a[data-continue]'); const q = document.querySelector('[data-before-meta]'); return { text: a ? a.textContent : null, href: a ? a.getAttribute('href') : '', body: q ? q.innerText : '' }; });
      ok(s2.text === 'Continue to Meta' && /dialog\/oauth/.test(s2.href) && s2.body.includes('On the Pages screen, keep your business Page ticked.'),
        `${mode} 1.2 cut1e e1: Connect opens the short screen before Meta; its Continue is the pre-minted link`, JSON.stringify(s2).slice(0, 200));
      ok(!(await text(p, '.ads-room')).includes('Press and hold'), `${mode} 1.3 no iPhone line outside iOS standalone`);
      ok(wordsOk(await leaves(p, '.ads-room')).length === 0, `${mode} 1.3a the screen before Meta: every word is ads.ts's`, JSON.stringify(wordsOk(await leaves(p, '.ads-room'))));
      await p.close();
      p = await open(mode, 'connect', '/vendor/posts/ads', { standalone: true, wait: '[data-connect]', settle: 1500 });
      await p.evaluate(() => document.querySelector('[data-connect]').click()); await new Promise((r) => setTimeout(r, 500));
      ok((await text(p, '.ads-room')).includes('Press and hold Connect ad account'), `${mode} 1.4 the iPhone line in iOS standalone, on the screen before Meta`); await p.close();
      p = await open(mode, 'link', '/vendor/posts/ads');
      ok((await text(p, '[data-link-switch]')) === 'On Facebook, switch into your Page first (tap your picture at the top right, then the Page), then tap Link my Instagram again.', `${mode} 8.1 e3: the link card names the switch into the Page`);
      await p.close();
      sent.length = 0;
      p = await open(mode, 'choose', '/vendor/posts/ads', { wait: '[data-chooser]' });
      const ch0 = await p.evaluate(() => ({ on: document.querySelectorAll('[data-chooser] .ads-mark.ads-on').length, dis: document.querySelector('[data-choose-go]').disabled, opts: Array.from(document.querySelectorAll('[data-chooser] .ads-optt')).map((e) => e.textContent) }));
      ok(ch0.on === 0 && ch0.dis === true && ch0.opts.join('|') === 'THE DREAM WEDDING ADS|Dev Roy', `${mode} 8.2 e2: two accounts listed, nothing preselected, the button waits`, JSON.stringify(ch0));
      ok(wordsOk(await leaves(p, '[data-chooser]')).length === 0, `${mode} 8.2a the chooser: every word is ads.ts's`, JSON.stringify(wordsOk(await leaves(p, '[data-chooser]'))));
      await p.evaluate(() => document.querySelectorAll('[data-chooser] .ads-opt')[1].click()); await new Promise((r) => setTimeout(r, 200));
      await p.evaluate(() => document.querySelector('[data-choose-go]').click()); await new Promise((r) => setTimeout(r, 700));
      const chose = sent.find((x) => x.route === '/api/v2/vendor/ads/choose');
      ok(chose && chose.body && chose.body.ad_account_id === 'act_799617249564163', `${mode} 8.3 her tap is what is sent (the second account)`, JSON.stringify(chose && chose.body));
      await p.close();
      sent.length = 0; seen.length = 0;
      p = await open(mode, 'noposts', '/vendor/posts/ads', { wait: '[data-run]', settle: 2000 });
      const np = await p.evaluate(() => ({ ex: !!document.querySelector('[data-preview][data-example="true"]'), wm: document.querySelectorAll('[data-watermark]').length,
        wmOnEx: !!document.querySelector('[data-preview][data-example="true"] [data-watermark]') && !!document.querySelector('[data-sample-result] [data-watermark]'),
        line: (document.querySelector('[data-example-line]') || {}).textContent, nop: (document.querySelector('[data-no-posts]') || {}).textContent, run: document.querySelector('[data-run]').disabled }));
      ok(np.ex && np.wmOnEx && np.line === 'This is how your post will look as an ad.' && np.nop === 'Post a photo or reel on Instagram first. It will appear here.' && np.run === true,
        `${mode} 8.4 R-46.16: no posts, the watermarked example, the two lines, Run disabled`, JSON.stringify(np));
      await p.evaluate(() => document.querySelector('[data-run]').click()); await new Promise((r) => setTimeout(r, 600));
      ok(!seen.some((r) => /\/ads\/(prepare|run)$/.test(r)), `${mode} 8.5 R-46.16: an example never reaches /prepare or /run`, JSON.stringify(seen));
      await p.close();
      p = await open(mode, 'fbposts', '/vendor/posts/ads', { wait: '[data-run]', settle: 2000 });
      await p.evaluate(() => { const b = Array.from(document.querySelectorAll('.ads-draft button')).find((x) => x.textContent === 'All settings'); b.click(); }); await new Promise((r) => setTimeout(r, 400));
      await p.evaluate(() => { const r = Array.from(document.querySelectorAll('.ads-full .ads-srow')).find((x) => /^Post/.test(x.textContent)); r.click(); }); await new Promise((r) => setTimeout(r, 500));
      const pk = await p.evaluate(() => ({ kinds: (document.querySelector('[data-post-kinds]') || {}).textContent, marks: Array.from(document.querySelectorAll('.ads-sheet .ads-reel')).map((e) => e.textContent) }));
      ok(/A Facebook post sends people to Messenger/.test(pk.kinds || '') && pk.marks.includes('Facebook') && pk.marks.includes('Instagram'), `${mode} 8.6 e5: Facebook Page posts beside Instagram, each marked`, JSON.stringify(pk));
      await p.close();
      p = await open(mode, 'running', '/vendor/posts/ads', { wait: '[data-last-ad]', settle: 1500 });
      ok((await text(p, '[data-result-line]')) === 'Meta showed this ad 1,802 times to 1,240 people in Lucknow and 25 km around. 61 of them tapped it, and 2 wrote to you. Meta took Rs 105 from your ad account\u2019s payment method. That is Rs 52.50 for each person who wrote.',
        `${mode} 8.7 e4: the last ad in sentences with all five figures`, await text(p, '[data-result-line]'));
      await p.close();
      for (const [g, tap] of [['page', 'Make my Page'], ['link', 'Link my Instagram'], ['account', 'Make my ad account']]) {
        p = await open(mode, g, '/vendor/posts/ads'); const t = await text(p, '.ads-room');
        ok(t.includes(tap) && t.includes('Check again'), `${mode} 1.5 gap ${g}: its sentence and its tap`); await p.close();
      }
      p = await open(mode, 'ready', '/vendor/posts/ads', { wait: '[data-run]', settle: 2500 });
      const m = await measure(p);
      if (process.env.B143_SHOTS) await p.screenshot({ path: path.join(process.env.B143_SHOTS, `ads_first_screen__${mode}.png`) });   // the chair's first-screen PNGs, from the real app
      ok(m.runBottom <= m.chromeTop - 44 && m.imgW >= 119.5, `${mode} 2.1 Run is at least 44 px above the Ask bar, the post at least 120 px wide (ruling (a))`, JSON.stringify(m));
      ok(Math.abs(m.box - m.natural) / m.natural <= 0.01, `${mode} 2.2 the preview keeps the picture's own aspect (1 percent)`, `${m.box} vs ${m.natural}`);
      ok(m.frameW <= m.imgW + 2, `${mode} 2.3 the frame is no wider than the picture`, `${m.frameW} vs ${m.imgW}`);
      ok(m.spBelow && m.spWhole, `${mode} 2.4 "Sponsored" on its own line under the handle, not cut`, JSON.stringify(m));
      ok((await text(p, '.ads-draft')).includes('Your most saved post this month: 48 saves and 3,100 people reached, with no money behind it.'), `${mode} 2.5 the one-sentence why`);
      const bad1 = wordsOk(await leaves(p, '.ads-room'));
      ok(bad1.length === 0, `${mode} 5.1 every word on the first screen is ads.ts's`, JSON.stringify(bad1));
      await p.evaluate(() => { const b = Array.from(document.querySelectorAll('.ads-draft button')).find((x) => x.textContent === 'All settings'); b.click(); });
      await new Promise((r) => setTimeout(r, 500));
      const rows = await p.evaluate(() => document.querySelectorAll('.ads-full .ads-srow').length);
      ok(rows === 18, `${mode} 3.1 All settings: 18 rows, one question each`, rows);
      const bad2 = wordsOk(await leaves(p, '.ads-full'));
      ok(bad2.length === 0, `${mode} 5.2 every word in All settings is ads.ts's`, JSON.stringify(bad2));
      await p.evaluate(() => document.querySelector('.ads-full .ads-srow').click());
      await new Promise((r) => setTimeout(r, 400));
      const q = await p.evaluate(() => ({ title: document.querySelector('.ads-sheet .ads-q').textContent, marked: document.querySelectorAll('.ads-sheet .ads-mark.ads-on').length }));
      ok(q.title === 'Where should Meta show this ad?' && q.marked === 1, `${mode} 3.2 one question, the current answer marked`, JSON.stringify(q));
      await p.type('.ads-sheet input.ads-input', 'Kan'); await new Promise((r) => setTimeout(r, 900));
      ok((await text(p, '.ads-sheet')).includes('Kanpur'), `${mode} 3.3 Meta's own list, searched`);
      const bad3 = wordsOk(await leaves(p, '.ads-sheet'));
      ok(bad3.length === 0, `${mode} 5.3 every word in the question is ads.ts's`, JSON.stringify(bad3));
      await p.close();
      p = await open(mode, 'ready', '/vendor/posts/ads', { wait: '[data-run]', settle: 2000 });
      sent.length = 0;
      await p.evaluate(() => document.querySelector('[data-run]').click()); await new Promise((r) => setTimeout(r, 700));
      const conf = await text(p, '.ads-sheet');
      ok(conf && conf.includes('Run this ad?') && conf.includes('up to Rs 300') && conf.includes('Lucknow and 25 km around, aged 22 to 40'), `${mode} 3.4 the confirm sheet echoes the settings`, conf);
      const bad4 = wordsOk(await leaves(p, '.ads-sheet'));
      ok(bad4.length === 0, `${mode} 5.4 every word in the confirm sheet is ads.ts's`, JSON.stringify(bad4));
      await p.evaluate(() => { const b = Array.from(document.querySelectorAll('.ads-sheet button')).find((x) => x.textContent === 'Run this ad'); b.click(); });
      await new Promise((r) => setTimeout(r, 700));
      const run = sent.find((x) => x.route === '/api/v2/vendor/ads/run');
      ok(run && run.body.confirm === 'ECHO-1' && run.body.settings && run.body.settings.echoed === true, `${mode} 3.5 /run gets exactly what /prepare returned, with the echo`, JSON.stringify(run && run.body).slice(0, 120));
      await p.close();
      p = await open(mode, 'running', '/vendor/posts/ads', { wait: '.ads-adrow', settle: 1500 });
      ok((await text(p, '.ads-room')).includes('Aanya and Rohan') && (await text(p, '.ads-room')).includes('Running until'), `${mode} 3.6 Your ads: the post's caption line and its state`);
      sent.length = 0;
      await p.evaluate(() => { const b = document.querySelector('[data-disconnect]'); if (b) b.click(); });
      await new Promise((r) => setTimeout(r, 700));
      ok(sent.some((x) => x.route === '/api/v2/vendor/ads/disconnect') && (await text(p, '.ads-room')).includes('Connect ad account'),
        `${mode} 3.7 Disconnect ad account calls the disconnect door and the page returns to the connect (b42: no orphaned address)`);
      await p.close();
      p = await open(mode, 'running', '/vendor/posts', { wait: '[data-ads-card-line]', settle: 1200 });
      ok((await text(p, '[data-ads-card-line]')) === 'Aanya and Rohan is running. 1,240 people have seen it today.', `${mode} 4.1 the card: the post's name and today's reach`, await text(p, '[data-ads-card-line]'));
      await p.close();
      p = await open(mode, 'running_nocap', '/vendor/posts', { wait: '[data-ads-card-line]', settle: 1200 });
      ok((await text(p, '[data-ads-card-line]')) === 'Your ad is running. 1,240 people have seen it today.', `${mode} 4.2 the card without a caption: the fallback line`, await text(p, '[data-ads-card-line]'));
      await p.close();
    }
  }

  // B143_PART: 'all' (the floor's default), or 'states' / 'mutations' to split one run across two shorter calls.
  const PART = process.env.B143_PART || 'all';
  if (PART !== 'mutations') await runAll(['dark', 'light'], false);

  if (PART !== 'states') sec('6  mutations (Graphite; each must redden; restored by sha)');
  const MUTS = PART === 'states' ? [] : [
    ['app/vendor/(shell)/posts/ads/page.tsx', "onClick={() => { if (!noPosts) void onRun(); }}>{ADS.draft.run}</button>", "onClick={() => { if (!noPosts) void onRun(); }}>Run ad</button>", 'M1 a hard-coded word on the first screen'],
    ['app/vendor/(shell)/posts/ads/page.tsx', "--ads-pw:120px}", "--ads-pw:260px}", 'M2 the post too wide: Run falls under the Ask bar'],
    ['app/vendor/(shell)/posts/ads/page.tsx', ".ads-media{display:block;width:var(--ads-pw);height:auto;", ".ads-media{display:block;width:var(--ads-pw);height:120px;", 'M3 the picture squeezed to a fixed height'],
    ['app/vendor/(shell)/posts/ads/page.tsx', ".ads-prevhead{display:grid;grid-template-columns:16px 1fr;", ".ads-prevhead{display:flex;grid-template-columns:16px 1fr;", 'M4 "Sponsored" on the handle line'],
    ['components/worklist/AdsCard.tsx', "line = name ? fill(ADS.card.running, { post: name,", "line = false ? fill(ADS.card.running, { post: name,", 'M5 the card never names the post'],
    ['app/vendor/(shell)/posts/ads/page.tsx', "{example ? <span aria-hidden=\"true\" className=\"ads-mark-wm\" data-watermark>{ADS.examples.mark}</span> : null}", "{null}", 'M6 the example preview loses its watermark'],
    ['app/vendor/(shell)/posts/ads/page.tsx', "data-run disabled={noPosts} aria-disabled={noPosts} onClick={() => { if (!noPosts) void onRun(); }}", "data-run onClick={() => void onRun()}", 'M7 Run acts on an example'],
    ['app/vendor/(shell)/posts/ads/page.tsx', "const [account, setAccount] = useState<string | null>(null);", "const [account, setAccount] = useState<string | null>((gap.choose?.accounts || [])[0]?.id || null);", 'M8 the chooser preselects the first found'],
  ];
  // A run killed mid-mutation (a timeout, Ctrl-C) must still put the file back: e-(ADS-1), a killed run once left M5 on disk.
  let live = null;
  const restore = () => { if (live) { fs.writeFileSync(live.file, live.orig); live = null; } };
  process.on('exit', restore);
  for (const sig of ['SIGTERM', 'SIGINT', 'SIGHUP']) process.on(sig, () => { restore(); process.exit(130); });
  const ONLY = (process.env.B143_MUTS || '').split(',').filter(Boolean);
  for (const [rel, from, to, name] of MUTS) {
    if (ONLY.length && !ONLY.includes(name.split(' ')[0])) continue;
    const file = path.join(ROOT, rel); const orig = fs.readFileSync(file, 'utf8'); const h = sha(orig);
    if (orig.split(from).length !== 2) { ok(false, `${name}: anchor found exactly once`); continue; }
    live = { file, orig };
    fs.writeFileSync(file, orig.replace(from, to));
    await new Promise((r) => setTimeout(r, 2500));
    const before = fail; const beforeNames = failed.length; const beforePass = pass;
    try { await runAll(['dark'], true); } catch (e) { fail += 1; failed.push(`${name} crashed: ${e.message}`); }
    const red = fail > before;
    fail = before; failed.length = beforeNames; pass = beforePass;   // the child cells are the mutation's evidence, not the verdict
    fs.writeFileSync(file, orig); live = null;
    quiet = false;
    ok(red && sha(fs.readFileSync(file, 'utf8')) === h, `${name}: reddens, restored by sha`);
    await new Promise((r) => setTimeout(r, 2000));
  }
  quiet = false;
  await browser.close();
  const st = await server.stop();
  ok(st.portFree, '7.1 the dev server stopped, the port free');
  console.log(`\nb143 · ${pass} pass · ${fail} fail`);
  if (fail) { console.log('FAILED: ' + failed.join(' | ')); process.exit(1); }
  process.exit(0);
}
main().catch((e) => { console.error('b143 crashed:', e); process.exit(2); });
