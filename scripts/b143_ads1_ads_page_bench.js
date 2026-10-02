'use strict';
// FLOOR-SUBJECTS: app/vendor/(shell)/posts/ads/page.tsx app/vendor/(shell)/posts/page.tsx components/worklist/AdsCard.tsx lib/worklist/ads.ts
// FLOOR-STATES: env B143_PART=states
// FLOOR-WHOLE: args
// (CE-47 FE-6 L3 r2: the floor runs this bench's mutations only when a delivery names it or a subject above;
//  scripts/lib/floor_slice.sh reads these three lines. b174 §F proves the subjects cover every file the bench mutates.)
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
//   7 THE STOP (CE-46 ADS-2): one stop on every exit path (success, a red, a crash, SIGINT, SIGTERM, SIGHUP): the browser
//      closed, then stopTree on `next dev` and on chromium, waited; 7.2 reads that nothing of this run is left.
//   1.0 THE ROOM ON GLASS: the first read waits up to 180 s for the Ads room; an absent room is a named red and a clean
//      stop (rc 1), never a TypeError. Every glass read guards for an absent element; its own cell reds.
//   9 THE TALLY: every printed FAIL is counted; a red under a mutation prints "red under Mn", never FAIL; a crash
//      under a mutation is its own FAIL, never that mutation's red. 9.1 checks the count, 9.2 runs the self-test.
//  10 THE CAPTION BOX (R-46.17, the founder's words): the caption in its own box with its one control, "Copy";
//      a tap writes exactly body.caption and reads "Copied" for two seconds, then "Copy".
// THE EXIT CODE IS THE VERDICT.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = process.env.B143_ROOT || path.join(__dirname, '..');   // B143_ROOT: the tally self-test runs a copy of this file from a temp folder
const PORT = 3143;
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const { stripComments } = require(path.join(ROOT, 'scripts/lib/stripComments.cjs'));   // the estate's one comment stripper (tdw_f0774_readers)
const PHOTO = process.env.B143_PHOTO || path.join(ROOT, 'scripts/fixtures/b143_portrait.jpeg');
let pass = 0; let fail = 0; const failed = []; let quiet = false;
// THE TALLY (CE-46 ADS-2, the chair's ruling): a FAIL line is printed only where it is counted. Under a mutation (quiet)
// a red cell is the mutation's evidence and prints "red under Mn"; printedFails is checked against fail by 9.1.
let printedFails = 0; let evidence = 0; let underMut = '';
const fmt = (info) => (info === undefined ? '' : '  [' + String(info).slice(0, 240) + ']');
function ok(c, name, info) {
  if (c) { pass += 1; if (!quiet) console.log(`  PASS  ${name}`); return true; }
  if (quiet) { evidence += 1; console.log(`  red under ${underMut}  ${name}${fmt(info)}`); return false; }
  fail += 1; failed.push(name); printedFails += 1; console.log(`  FAIL  ${name}${fmt(info)}`); return false;
}
// A mutation reddens only when a named cell reds under it. A crash is its own counted FAIL, never evidence.
async function judgeMutation(name, runChild) {
  const before = evidence; const beforePass = pass; let crashed = null;
  quiet = true; underMut = name.split(' ')[0];
  try { await runChild(); } catch (e) { crashed = e; }
  quiet = false; pass = beforePass;   // the child's passes are the mutation's evidence, not the verdict
  if (crashed) { ok(false, `${name} crashed: ${String((crashed && crashed.message) || crashed).slice(0, 160)}`); return false; }
  return evidence > before;
}
function tallyCheck() { const n = printedFails; ok(n === fail, '9.1 every printed FAIL is counted in the tally', `${n} printed, ${fail} counted`); }
// The self-test, run as a child (B143_SELFTEST): one deliberate red, one mutation whose child crashes, then the count.
async function selftest() {
  ok(false, 'T1 a deliberately failing cell (the tally must count it)');
  const red = await judgeMutation('TX a mutation whose child crashes', async () => { throw new Error('boom'); });
  ok(red === false, 'T2 a crash under a mutation is not that mutation\'s red');
  tallyCheck();
  console.log(`\nb143 · ${pass} pass · ${fail} fail`);
  process.exit(fail || printedFails ? 1 : 0);
}
function selftestHolds(file) {
  const r = require('child_process').spawnSync(process.execPath, [file], { env: { ...process.env, B143_SELFTEST: '1', B143_ROOT: ROOT }, encoding: 'utf8', timeout: 60000 });
  const out = String(r.stdout || '') + String(r.stderr || '');
  const holds = r.status === 1 && /  FAIL  T1 /.test(out) && /  FAIL  TX a mutation whose child crashes crashed: boom/.test(out)
    && /  PASS  T2 /.test(out) && /  PASS  9\.1 /.test(out) && /b143 · 2 pass · 2 fail/.test(out);
  return { holds, rc: r.status, tail: out.trim().split('\n').slice(-6).join(' / ') };
}

// ── THE STOP (CE-46 ADS-2): one stop for every exit path, the whole process tree, waited (stop_tree.js, F-44.163).
const { stopTree } = require(path.join(ROOT, 'scripts/lib/stop_tree.js'));
const ROOT_REAL = (() => { try { return fs.realpathSync(ROOT); } catch (_e) { return ROOT; } })();
let SERVER = null; let BROWSER = null; let BPID = null; let BUDD = null;
function hardStop() {   // synchronous: it runs on 'exit', after any signal, crash or process.exit
  if (BPID) { try { stopTree(BPID); } catch (_e) { /* gone */ } BPID = null; }
  if (SERVER && !SERVER.treeStopped) { try { stopTree(SERVER.dev.pid); } catch (_e) { /* gone */ } SERVER.treeStopped = true; }
}
process.on('exit', hardStop);
for (const [sig, code] of [['SIGINT', 130], ['SIGTERM', 143], ['SIGHUP', 129]]) process.on(sig, () => process.exit(code));
function leftovers() {
  const rows = String(require('child_process').spawnSync('ps', ['-eo', 'pid=,args='], { encoding: 'utf8' }).stdout || '').split('\n').map((l) => l.trim()).filter(Boolean);
  const out = [];
  for (const row of rows) {
    const pid = Number(row.split(/\s+/)[0]); const args = row.slice(String(pid).length).trim();
    if (!pid || pid === process.pid) continue;
    if (/node_modules\/\.bin\/next dev|next-server|\.next\/dev\/build\/postcss\.js/.test(args)) {
      let cwd = '?'; try { cwd = fs.readlinkSync(`/proc/${pid}/cwd`); } catch (_e) { /* no /proc */ }
      if (cwd === ROOT_REAL || args.includes(ROOT_REAL) || args.includes(ROOT)) out.push(`${pid} ${args.slice(0, 70)}`);
    }
    if (BUDD && args.includes(BUDD)) out.push(`${pid} chromium of this run`);
  }
  return out;
}
async function finish() {
  quiet = false;
  if (BROWSER) { try { await BROWSER.close(); } catch (_e) { /* gone */ } BROWSER = null; }
  if (BPID) { try { stopTree(BPID); } catch (_e) { /* gone */ } BPID = null; }
  if (SERVER) {
    try { stopTree(SERVER.dev.pid); } catch (_e) { /* gone */ } SERVER.treeStopped = true;
    const st = await SERVER.stop();
    ok(st.portFree, '7.1 the dev server stopped, the port free');
  }
  const left = leftovers();
  ok(left.length === 0, '7.2 nothing of this run is left: no next dev, next-server or postcss in this root, no chromium of this run', JSON.stringify(left));
  tallyCheck();
  console.log(`\nb143 · ${pass} pass · ${fail} fail`);
  if (fail || printedFails) { console.log('FAILED: ' + failed.join(' | ')); process.exit(1); }
  process.exit(0);
}
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
  if (name === 'choose_funds') base.door = { ...base.door, gaps: { gap: 'choose', choose: { accounts: [
    { id: 'act_1', name: 'WHOLE RUPEES', funds: { amount: 200, currency: 'INR' } }, { id: 'act_2', name: 'WITH PAISE', funds: { amount: 200.5, currency: 'INR' } },
    { id: 'act_3', name: 'IN DOLLARS', funds: { amount: 50, currency: 'USD' } }, { id: 'act_4', name: 'NO FUNDS READ', funds: null }, { id: 'act_5', name: 'UNMAPPED CODE', currency: 'XYZ', funds: null }] } } };   // CE-47 ADS-2 item 4 and the rupee lock
  if (name === 'noposts') { base.noPosts = true; }
  if (name === 'fbposts') { base.fbPosts = true; }
  if (name === 'cards') { base.cards = true; }
  if (name === 'cards_refuse') { base.cards = true; base.clipRefuse = true; }
  return base;
}

async function main() {
  const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
  const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
  if (!fs.existsSync(PHOTO)) { console.log(`b143: the post photograph is missing at ${PHOTO}. Set B143_PHOTO, or add the fixture the handover names. Nothing ran.`); process.exit(2); }
  const photo = fs.readFileSync(PHOTO);
  const server = await dev.start(ROOT, PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` });
  SERVER = server;
  if (!(await server.up())) { ok(false, '0.1 the dev server came up'); return finish(); }
  const browser = await puppeteer.launch({ executablePath: await chromium.executablePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  BROWSER = browser; BPID = browser.process() ? browser.process().pid : null;
  BUDD = ((browser.process() && browser.process().spawnargs) || []).find((a) => a.startsWith('--user-data-dir=')) || null;
  // R-46.17's cell reads what the page hands the clipboard: writeText is recorded (or refused, for 10.4), never skipped.
  const CAPTION = 'Aanya and Rohan, Delhi, September 2026. Hair and makeup by Swati Roy.';
  const P = wordPatterns();
  const sent = []; const seen = [];

  async function open(mode, scen, url, opts = {}) {
    const s = scenario(scen);
    const p = await browser.newPage();
    await p.setViewport({ width: 374, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    if (opts.standalone) await p.evaluateOnNewDocument(() => { Object.defineProperty(navigator, 'standalone', { get: () => true }); });
    await p.setCookie({ name: 'tdw_wl_mode', value: mode, domain: 'localhost', path: '/' });
    await p.evaluateOnNewDocument((refuse) => {
      window.__copied = [];
      const clip = { writeText: (t) => (refuse ? Promise.reject(new Error('refused')) : (window.__copied.push(t), Promise.resolve())) };
      try { Object.defineProperty(navigator, 'clipboard', { get: () => clip, configurable: true }); } catch (_e) { /* read-only */ }
    }, !!s.clipRefuse);
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
      if (route === '/api/v2/vendor/posts/cards' && s.cards) return J({ ok: true, page: { id: 'W1', slug: 'aanya-rohan', title: 'Aanya and Rohan' }, caption: CAPTION, cards: { post: MEDIA_URL, status: MEDIA_URL, story: MEDIA_URL } });
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
    const t0 = Date.now(); const until = t0 + (opts.timeout || 90000); const want = opts.wait || '.ads-room .ads-card, .pst-room';
    const seenSel = () => p.evaluate((sel) => !!document.querySelector(sel), want).catch(() => false);
    while (Date.now() < until && !(await seenSel())) await new Promise((r) => setTimeout(r, 400));
    p.found = await seenSel(); p.waited = Date.now() - t0;   // never passed on silently: 1.0 reads it
    await new Promise((r) => setTimeout(r, opts.settle || 1200));
    return p;
  }
  const text = (p, sel) => p.evaluate((s) => { const el = document.querySelector(s); return el ? el.innerText : null; }, sel).catch(() => null);
  // THE GUARDS: an absent element reads null, and null satisfies nothing, so its cell reds; it never throws.
  const has = (t, ...ss) => typeof t === 'string' && ss.every((x) => t.includes(x));
  const lacks = (t, ...ss) => typeof t === 'string' && ss.every((x) => !t.includes(x));
  // leaves(): null when the root is absent, so an absent root is a red (wordsOk flags it), never an empty pass.
  const leaves = (p, sel) => p.evaluate((s) => { if (!document.querySelector(s)) return null; const out = []; for (const root of document.querySelectorAll(s)) { const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n; while ((n = w.nextNode())) { const t = n.textContent.replace(/\s+/g, ' ').trim(); const st = n.parentElement && getComputedStyle(n.parentElement); if (t && st && st.display !== 'none') out.push(t); } }
    for (const i of root0()) out.push(i); return out;
    function root0() { return Array.from(document.querySelectorAll(`${s} input[placeholder], ${s} textarea[placeholder]`)).map((e) => e.getAttribute('placeholder')); } }, sel);
  const roomTitle = 'Posts & ads';
  const notOnYet = 'Not switched on yet.';
  // Allowed: an ads.ts string (templates filled), fixture data, the room's name, PO.notOnYet, a number, a date the page
  // formats ("28 Sep"), or a comma-joined list whose every part is itself allowed. Anything else is a stray word.
  const one = (t) => P.some((re) => re.test(t)) || DATA.has(t) || t === roomTitle || t === notOnYet || /^\d+$/.test(t) || /^\d{1,2} [A-Z][a-z]{2}$/.test(t);
  function wordsOk(list) { if (!list) return ['(absent on glass)']; return list.filter((t) => !(one(t) || (t.includes(', ') && t.split(', ').every(one)))); }
  async function measure(p) {
    return p.evaluate(() => {
      const run = document.querySelector('[data-run]'); const img = document.querySelector('[data-media]'); const frame = document.querySelector('[data-preview] .ads-prevhead');
      const handle = document.querySelector('.ads-handle'); const sp = document.querySelector('.ads-sponsored');
      if (!run || !img || !frame || !handle || !sp) return null;   // absent: 2.1 to 2.4 red on it
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
      let p = await open(mode, 'shut', '/vendor/posts/ads', { wait: '.ads-room [data-soon]', timeout: 180000 });
      if (!ok(p.found, `${mode} 1.0 the Ads room is on glass (.ads-room with its state) within 180 s`, `/vendor/posts/ads, ${p.waited} ms`)) { await p.close(); return false; }
      const soon = await p.evaluate(() => { const b = document.querySelector('[data-soon]'); return b ? { t: b.textContent, d: b.disabled } : null; });
      ok(has(await text(p, '.ads-room'), 'Your ads run from your own Meta ad account.') && soon && soon.t === 'Coming soon' && soon.d === true,
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
      await p.evaluate(() => document.querySelector('[data-connect]')?.click()); await new Promise((r) => setTimeout(r, 500));
      const s2 = await p.evaluate(() => { const a = document.querySelector('[data-before-meta] a[data-continue]'); const q = document.querySelector('[data-before-meta]'); return { text: a ? a.textContent : null, href: a ? a.getAttribute('href') : '', body: q ? q.innerText : '' }; });
      ok(s2.text === 'Continue to Meta' && /dialog\/oauth/.test(s2.href || '') && has(s2.body, 'On the Pages screen, keep your business Page ticked.'),
        `${mode} 1.2 cut1e e1: Connect opens the short screen before Meta; its Continue is the pre-minted link`, JSON.stringify(s2).slice(0, 200));
      ok(lacks(await text(p, '.ads-room'), 'Press and hold'), `${mode} 1.3 no iPhone line outside iOS standalone`);
      ok(wordsOk(await leaves(p, '.ads-room')).length === 0, `${mode} 1.3a the screen before Meta: every word is ads.ts's`, JSON.stringify(wordsOk(await leaves(p, '.ads-room'))));
      await p.close();
      p = await open(mode, 'connect', '/vendor/posts/ads', { standalone: true, wait: '[data-connect]', settle: 1500 });
      await p.evaluate(() => document.querySelector('[data-connect]')?.click()); await new Promise((r) => setTimeout(r, 500));
      ok(has(await text(p, '.ads-room'), 'Press and hold Connect ad account'), `${mode} 1.4 the iPhone line in iOS standalone, on the screen before Meta`); await p.close();
      p = await open(mode, 'link', '/vendor/posts/ads');
      ok((await text(p, '[data-link-switch]')) === 'On Facebook, switch into your Page first (tap your picture at the top right, then the Page), then tap Link my Instagram again.', `${mode} 8.1 e3: the link card names the switch into the Page`);
      await p.close();
      sent.length = 0;
      p = await open(mode, 'choose', '/vendor/posts/ads', { wait: '[data-chooser]' });
      const ch0 = await p.evaluate(() => ({ on: document.querySelectorAll('[data-chooser] .ads-mark.ads-on').length, dis: document.querySelector('[data-choose-go]')?.disabled, opts: Array.from(document.querySelectorAll('[data-chooser] .ads-optt')).map((e) => e.textContent) }));
      ok(ch0.on === 0 && ch0.dis === true && ch0.opts.join('|') === 'THE DREAM WEDDING ADS|Dev Roy', `${mode} 8.2 e2: two accounts listed, nothing preselected, the button waits`, JSON.stringify(ch0));
      ok(wordsOk(await leaves(p, '[data-chooser]')).length === 0, `${mode} 8.2a the chooser: every word is ads.ts's`, JSON.stringify(wordsOk(await leaves(p, '[data-chooser]'))));
      await p.evaluate(() => document.querySelectorAll('[data-chooser] .ads-opt')[1]?.click()); await new Promise((r) => setTimeout(r, 200));
      await p.evaluate(() => document.querySelector('[data-choose-go]')?.click()); await new Promise((r) => setTimeout(r, 700));
      const chose = sent.find((x) => x.route === '/api/v2/vendor/ads/choose');
      ok(chose && chose.body && chose.body.ad_account_id === 'act_799617249564163', `${mode} 8.3 her tap is what is sent (the second account)`, JSON.stringify(chose && chose.body));
      await p.close();
      sent.length = 0; seen.length = 0;
      p = await open(mode, 'noposts', '/vendor/posts/ads', { wait: '[data-run]', settle: 2000 });
      const np = await p.evaluate(() => ({ ex: !!document.querySelector('[data-preview][data-example="true"]'), wm: document.querySelectorAll('[data-watermark]').length,
        wmOnEx: !!document.querySelector('[data-preview][data-example="true"] [data-watermark]') && !!document.querySelector('[data-sample-result] [data-watermark]'),
        line: (document.querySelector('[data-example-line]') || {}).textContent, nop: (document.querySelector('[data-no-posts]') || {}).textContent, run: document.querySelector('[data-run]')?.disabled }));
      ok(np.ex && np.wmOnEx && np.line === 'This is how your post will look as an ad.' && np.nop === 'Post a photo or reel on Instagram first. It will appear here.' && np.run === true,
        `${mode} 8.4 R-46.16: no posts, the watermarked example, the two lines, Run disabled`, JSON.stringify(np));
      await p.evaluate(() => document.querySelector('[data-run]')?.click()); await new Promise((r) => setTimeout(r, 600));
      ok(!seen.some((r) => /\/ads\/(prepare|run)$/.test(r)), `${mode} 8.5 R-46.16: an example never reaches /prepare or /run`, JSON.stringify(seen));
      await p.close();
      p = await open(mode, 'fbposts', '/vendor/posts/ads', { wait: '[data-run]', settle: 2000 });
      await p.evaluate(() => { const b = Array.from(document.querySelectorAll('.ads-draft button')).find((x) => x.textContent === 'All settings'); if (b) b.click(); }); await new Promise((r) => setTimeout(r, 400));
      await p.evaluate(() => { const r = Array.from(document.querySelectorAll('.ads-full .ads-srow')).find((x) => /^Post/.test(x.textContent)); if (r) r.click(); }); await new Promise((r) => setTimeout(r, 500));
      const pk = await p.evaluate(() => ({ kinds: (document.querySelector('[data-post-kinds]') || {}).textContent, marks: Array.from(document.querySelectorAll('.ads-sheet .ads-reel')).map((e) => e.textContent) }));
      ok(/A Facebook post sends people to Messenger/.test(pk.kinds || '') && pk.marks.includes('Facebook') && pk.marks.includes('Instagram'), `${mode} 8.6 e5: Facebook Page posts beside Instagram, each marked`, JSON.stringify(pk));
      await p.close();
      p = await open(mode, 'running', '/vendor/posts/ads', { wait: '[data-last-ad]', settle: 1500 });
      ok((await text(p, '[data-result-line]')) === 'Meta showed this ad 1,802 times to 1,240 people in Lucknow and 25 km around. 61 of them tapped it, and 2 wrote to you. Meta took Rs 105 from your ad account\u2019s payment method. That is Rs 52.50 for each person who wrote.',
        `${mode} 8.7 e4: the last ad in sentences with all five figures`, await text(p, '[data-result-line]'));
      await p.close();
      for (const [g, tap] of [['page', 'Make my Page'], ['link', 'Link my Instagram'], ['account', 'Make my ad account']]) {
        p = await open(mode, g, '/vendor/posts/ads'); const t = await text(p, '.ads-room');
        ok(has(t, tap, 'Check again'), `${mode} 1.5 gap ${g}: its sentence and its tap`); await p.close();
      }
      p = await open(mode, 'ready', '/vendor/posts/ads', { wait: '[data-run]', settle: 2500 });
      const m = await measure(p);
      if (process.env.B143_SHOTS) await p.screenshot({ path: path.join(process.env.B143_SHOTS, `ads_first_screen__${mode}.png`) });   // the chair's first-screen PNGs, from the real app
      ok(!!m && m.runBottom <= m.chromeTop - 44 && m.imgW >= 119.5, `${mode} 2.1 Run is at least 44 px above the Ask bar, the post at least 120 px wide (ruling (a))`, JSON.stringify(m));
      ok(!!m && Math.abs(m.box - m.natural) / m.natural <= 0.01, `${mode} 2.2 the preview keeps the picture's own aspect (1 percent)`, m ? `${m.box} vs ${m.natural}` : 'absent');
      ok(!!m && m.frameW <= m.imgW + 2, `${mode} 2.3 the frame is no wider than the picture`, m ? `${m.frameW} vs ${m.imgW}` : 'absent');
      ok(!!m && m.spBelow && m.spWhole, `${mode} 2.4 "Sponsored" on its own line under the handle, not cut`, JSON.stringify(m));
      ok(has(await text(p, '.ads-draft'), 'Your most saved post this month: 48 saves and 3,100 people reached, with no money behind it.'), `${mode} 2.5 the one-sentence why`);
      const bad1 = wordsOk(await leaves(p, '.ads-room'));
      ok(bad1.length === 0, `${mode} 5.1 every word on the first screen is ads.ts's`, JSON.stringify(bad1));
      await p.evaluate(() => { const b = Array.from(document.querySelectorAll('.ads-draft button')).find((x) => x.textContent === 'All settings'); if (b) b.click(); });
      await new Promise((r) => setTimeout(r, 500));
      const rows = await p.evaluate(() => document.querySelectorAll('.ads-full .ads-srow').length);
      ok(rows === 18, `${mode} 3.1 All settings: 18 rows, one question each`, rows);
      const bad2 = wordsOk(await leaves(p, '.ads-full'));
      ok(bad2.length === 0, `${mode} 5.2 every word in All settings is ads.ts's`, JSON.stringify(bad2));
      await p.evaluate(() => document.querySelector('.ads-full .ads-srow')?.click());
      await new Promise((r) => setTimeout(r, 400));
      const q = await p.evaluate(() => ({ title: document.querySelector('.ads-sheet .ads-q')?.textContent, marked: document.querySelectorAll('.ads-sheet .ads-mark.ads-on').length }));
      ok(q.title === 'Where should Meta show this ad?' && q.marked === 1, `${mode} 3.2 one question, the current answer marked`, JSON.stringify(q));
      await p.type('.ads-sheet input.ads-input', 'Kan').catch(() => { /* absent: 3.3 reds on it */ }); await new Promise((r) => setTimeout(r, 900));
      ok(has(await text(p, '.ads-sheet'), 'Kanpur'), `${mode} 3.3 Meta's own list, searched`);
      const bad3 = wordsOk(await leaves(p, '.ads-sheet'));
      ok(bad3.length === 0, `${mode} 5.3 every word in the question is ads.ts's`, JSON.stringify(bad3));
      await p.close();
      p = await open(mode, 'ready', '/vendor/posts/ads', { wait: '[data-run]', settle: 2000 });
      sent.length = 0;
      await p.evaluate(() => document.querySelector('[data-run]')?.click()); await new Promise((r) => setTimeout(r, 700));
      const conf = await text(p, '.ads-sheet');
      ok(conf && conf.includes('Run this ad?') && conf.includes('up to Rs 300') && conf.includes('Lucknow and 25 km around, aged 22 to 40'), `${mode} 3.4 the confirm sheet echoes the settings`, conf);
      const bad4 = wordsOk(await leaves(p, '.ads-sheet'));
      ok(bad4.length === 0, `${mode} 5.4 every word in the confirm sheet is ads.ts's`, JSON.stringify(bad4));
      await p.evaluate(() => { const b = Array.from(document.querySelectorAll('.ads-sheet button')).find((x) => x.textContent === 'Run this ad'); if (b) b.click(); });
      await new Promise((r) => setTimeout(r, 700));
      const run = sent.find((x) => x.route === '/api/v2/vendor/ads/run');
      ok(run && run.body && run.body.confirm === 'ECHO-1' && run.body.settings && run.body.settings.echoed === true, `${mode} 3.5 /run gets exactly what /prepare returned, with the echo`, JSON.stringify(run && run.body).slice(0, 120));
      await p.close();
      p = await open(mode, 'running', '/vendor/posts/ads', { wait: '.ads-adrow', settle: 1500 });
      ok(has(await text(p, '.ads-room'), 'Aanya and Rohan', 'Running until'), `${mode} 3.6 Your ads: the post's caption line and its state`);
      sent.length = 0;
      await p.evaluate(() => { const b = document.querySelector('[data-disconnect]'); if (b) b.click(); });
      await new Promise((r) => setTimeout(r, 700));
      ok(sent.some((x) => x.route === '/api/v2/vendor/ads/disconnect') && has(await text(p, '.ads-room'), 'Connect ad account'),
        `${mode} 3.7 Disconnect ad account calls the disconnect door and the page returns to the connect (b42: no orphaned address)`);
      await p.close();
      p = await open(mode, 'running', '/vendor/posts', { wait: '[data-ads-card-line]', settle: 1200 });
      ok((await text(p, '[data-ads-card-line]')) === 'Aanya and Rohan is running. 1,240 people have seen it today.', `${mode} 4.1 the card: the post's name and today's reach`, await text(p, '[data-ads-card-line]'));
      await p.close();
      p = await open(mode, 'running_nocap', '/vendor/posts', { wait: '[data-ads-card-line]', settle: 1200 });
      ok((await text(p, '[data-ads-card-line]')) === 'Your ad is running. 1,240 people have seen it today.', `${mode} 4.2 the card without a caption: the fallback line`, await text(p, '[data-ads-card-line]'));
      await p.close();
      // ── 11 · CE-47 ADS-2 cut 2: CONNECT AGAIN ON EVERY GAP CARD (item 5); THE FUNDS LINE (item 4) ──
      for (const scene of ['page', 'link', 'account']) {
        p = await open(mode, scene, '/vendor/posts/ads', { wait: '.ads-room .ads-card' });
        const again = await p.evaluate(() => { const b = document.querySelector('[data-connect-again]'); return b ? b.textContent : null; }).catch(() => null);
        await p.evaluate(() => document.querySelector('[data-connect-again]')?.click()).catch(() => {});
        await new Promise((r) => setTimeout(r, 900));
        const sheet = await p.evaluate(() => { const a = document.querySelector('[data-before-meta] a[data-continue]'); return { open: !!document.querySelector('[data-before-meta]'), href: a ? a.getAttribute('href') : '' }; }).catch(() => ({ open: false, href: '' }));
        ok(again === 'Connect ad account' && sheet.open && /dialog\/oauth/.test(sheet.href || ''), `${mode} 11.1 the ${scene} gap card offers Connect ad account, which opens the screen before Meta`, JSON.stringify({ again, sheet }));
        await p.close();
      }
      p = await open(mode, 'choose_funds', '/vendor/posts/ads', { wait: '[data-chooser]' });
      const f = await p.evaluate(() => Array.from(document.querySelectorAll('[data-chooser] .ads-opt')).map((o) => { const x = o.querySelector('[data-funds]'); return x ? x.textContent : null; })).catch(() => null);
      ok(!!f && f[0] === 'Funds: Rs 200' && f[1] === 'Funds: Rs 200.50', `${mode} 11.2 the funds line in the money words: Rs 200, and Rs 200.50 when paise exist`, JSON.stringify(f));
      ok(!!f && f.length === 5 && f[2] === null && f[3] === null && f[4] === null, `${mode} 11.3 no line for another currency or when Meta returned nothing`, JSON.stringify(f));
      const cl = await p.evaluate(() => Array.from(document.querySelectorAll('[data-chooser] .ads-opt')).map((o) => { const x = o.querySelector('[data-currency]'); return x ? x.textContent : null; })).catch(() => null);
      ok(!!cl && cl[2] === 'This account pays in US dollars. TDW runs ads on rupee accounts for now.' && cl[0] === null && cl[1] === null && cl[3] === null,
        `${mode} 11.4 a dollar account names its currency and says rupee accounts only; INR and unread rows carry no such line`, JSON.stringify(cl));
      ok(!!cl && cl[4] === 'This account pays in XYZ. TDW runs ads on rupee accounts for now.', `${mode} 11.5 an unmapped currency is named by its code, read from the account itself`, JSON.stringify(cl));
      await p.evaluate(() => document.querySelectorAll('[data-chooser] .ads-opt')[2]?.click()).catch(() => {});
      await new Promise((r) => setTimeout(r, 300));
      const lockA = await p.evaluate(() => ({ pressed: document.querySelectorAll('[data-chooser] .ads-opt')[2]?.getAttribute('aria-pressed'), go: document.querySelector('[data-choose-go]')?.disabled })).catch(() => null);
      await p.evaluate(() => document.querySelectorAll('[data-chooser] .ads-opt')[0]?.click()).catch(() => {});
      await new Promise((r) => setTimeout(r, 300));
      const lockB = await p.evaluate(() => document.querySelector('[data-choose-go]')?.disabled).catch(() => null);
      ok(!!lockA && lockA.pressed === 'false' && lockA.go === true && lockB === false, `${mode} 11.6 a dollar account cannot be picked and leaves Use this ad account off; a rupee account turns it on`, JSON.stringify({ lockA, lockB }));
      await p.close();
      // ── 10 · THE CAPTION BOX (R-46.17, the founder's words, 29 Sept 2026) ──
      p = await open(mode, 'cards', '/vendor/posts', { wait: '[data-caption-box]', settle: 1200 });
      const box = await p.evaluate(() => {
        const b = document.querySelector('[data-caption-box]'); if (!b) return null;
        const kids = Array.from(b.children).map((e) => ({ tag: e.tagName, cap: e.hasAttribute('data-caption'), copy: e.hasAttribute('data-copy'), t: e.textContent }));
        const outside = (re) => Array.from(document.querySelectorAll('.pst-room button, .pst-room .pst-lbl')).filter((e) => re.test(e.textContent) && !b.contains(e)).length;
        return { kids, buttonsIn: b.querySelectorAll('button').length, label: outside(/^Caption$/), download: outside(/^Download$/), share: outside(/^Share$/),
          old: Array.from(document.querySelectorAll('button')).some((e) => e.textContent === 'Copy caption') };
      }).catch(() => null);
      ok(!!box && box.kids.length === 2 && box.kids[0].cap && box.kids[0].t === CAPTION && box.kids[1].copy && box.kids[1].tag === 'BUTTON' && box.kids[1].t === 'Copy' && box.buttonsIn === 1,
        `${mode} 10.1 the caption's own box holds exactly the caption and its one control, "Copy"`, JSON.stringify(box));
      ok(!!box && box.label === 1 && box.download === 1 && box.share === 1 && !box.old, `${mode} 10.2 "Caption", Download and Share stay outside the box; "Copy caption" is gone`, JSON.stringify(box));
      await p.evaluate(() => document.querySelector('[data-caption-box] [data-copy]')?.click()).catch(() => {});
      await new Promise((r) => setTimeout(r, 300));
      const c1 = await p.evaluate(() => ({ copied: window.__copied || [], label: document.querySelector('[data-caption-box] [data-copy]')?.textContent })).catch(() => ({ copied: [], label: null }));
      await new Promise((r) => setTimeout(r, 2300));
      const c2 = await p.evaluate(() => document.querySelector('[data-caption-box] [data-copy]')?.textContent).catch(() => null);
      ok(c1.copied.length === 1 && c1.copied[0] === CAPTION && c1.label === 'Copied' && c2 === 'Copy',
        `${mode} 10.3 a tap writes exactly body.caption; the control reads "Copied", then "Copy" after two seconds`, JSON.stringify({ c1, c2 }));
      await p.close();
      p = await open(mode, 'cards_refuse', '/vendor/posts', { wait: '[data-caption-box]', settle: 1200 });
      await p.evaluate(() => document.querySelector('[data-caption-box] [data-copy]')?.click()).catch(() => {});
      await new Promise((r) => setTimeout(r, 400));
      const c3 = await p.evaluate(() => document.querySelector('[data-caption-box] [data-copy]')?.textContent).catch(() => null);
      ok(c3 === 'Copy', `${mode} 10.4 when the clipboard refuses, the control stays "Copy" (never a false "Copied")`, c3);
      await p.close();
    }
    return true;
  }

  // B143_PART: 'all' (the floor's default), or 'states' / 'mutations' to split one run across two shorter calls.
  const PART = process.env.B143_PART || 'all';
  if (PART !== 'mutations' && !(await runAll(['dark', 'light'], false))) return finish();   // an absent room: a named red, then the one stop

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
    // M9 (CE-46 ADS-2): the room absent on glass. It must be the named red 1.0 under the mutation, never a crash.
    ['app/vendor/(shell)/posts/ads/page.tsx', '<div className="ads-room">', '<div className="ads-room-gone">', 'M9 the Ads room absent on glass'],
    ['app/vendor/(shell)/posts/ads/page.tsx', '      <ConnectAgain />\n', '', 'M13 a gap card without Connect ad account'],
    ['app/vendor/(shell)/posts/ads/page.tsx', "a.funds && a.funds.currency === 'INR' && ", 'a.funds && ', 'M14 a funds line for any currency'],
    ['app/vendor/(shell)/posts/ads/page.tsx', 'onClick={() => { if (!foreign(a)) setAccount(a.id); }}', 'onClick={() => setAccount(a.id)}', 'M15 a dollar account can be picked'],
    ['lib/worklist/ads.ts', "USD: 'US dollars', ", '', 'M16 the currency names lost'],
    // M12 (R-46.17): Copy moved out of the caption's box, back beside Share.
    ['app/vendor/(shell)/posts/page.tsx', '<button type="button" className="pst-copy" data-copy onClick={() => void onCopyCaption()}>{copied ? PO.copied : PO.copy}</button>\n            </div>', '</div>\n            <button type="button" className="pst-copy" data-copy onClick={() => void onCopyCaption()}>{copied ? PO.copied : PO.copy}</button>', 'M12 Copy out of the caption box'],
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
    const red = await judgeMutation(name, () => runAll(['dark'], true));   // a crash is its own FAIL, never this mutation's red
    fs.writeFileSync(file, orig); live = null;
    quiet = false;
    ok(red && sha(fs.readFileSync(file, 'utf8')) === h, `${name}: reddens, restored by sha`);
    await new Promise((r) => setTimeout(r, 2000));
  }
  quiet = false;

  sec('9  the tally');
  const cured = selftestHolds(__filename);
  ok(cured.holds, '9.2 the tally self-test: a deliberate red reaches the tally; a crash under a mutation is a FAIL, not a red', `rc ${cured.rc}: ${cured.tail}`);
  if (PART !== 'states') {
    // M10 and M11 mutate THIS bench's own accounting, so each runs as a copy of this file in a temp folder, removed after.
    const self = fs.readFileSync(__filename, 'utf8');
    const TALLY_MUTS = [
      ['fail += 1; failed.push(name); printedFails' + ' += 1;', 'failed.push(name); printedFails' + ' += 1;', 'M10 ok() skips the fail count'],
      ['if (crashed) { ok(' + 'false,', 'if (crashed) { return true; ok(' + 'false,', 'M11 a crash under a mutation counts as its red'],
    ];
    for (const [from, to, name] of TALLY_MUTS) {
      const n = self.split(from).length - 1;
      if (n !== 1) { ok(false, `${name}: anchor found exactly once`, n); continue; }
      const tmp = path.join(require('os').tmpdir(), `b143_selftest_${name.split(' ')[0]}_${process.pid}.js`);
      fs.writeFileSync(tmp, self.replace(from, to));
      let r = { holds: true, rc: null, tail: '' };
      try { r = selftestHolds(tmp); } finally { try { fs.unlinkSync(tmp); } catch (_e) { /* gone */ } }
      ok(!r.holds && !fs.existsSync(tmp), `${name}: the tally self-test reds, the copy removed`, `rc ${r.rc}: ${r.tail}`);
    }
  }
  return finish();
}
if (process.env.B143_SELFTEST) selftest();
else main().catch(async (e) => { quiet = false; ok(false, `b143 crashed: ${String((e && e.message) || e).slice(0, 200)}`); await finish(); });
