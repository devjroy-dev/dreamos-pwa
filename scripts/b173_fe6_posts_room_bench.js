'use strict';
process.env.TDW_LAYOUT_DEFAULT = 'v2';   // the new layout (middleware.ts serves v2/ with no cookie under this default)
// scripts/b173_fe6_posts_room_bench.js · TDW CE-46 · FE-6 · cut 1 · rung b173 · THE POSTS & ADS ROOM, REWORKED.
//
// WHAT IT HOLDS (the founder's verdict on FE-6's mock, 30 Sept 2026; W1, W6; R-46.14, R-46.16, R-46.17, R-42.13,
// R-45.30 and the 29 Sept no-"couple" rule), in the REAL app (C-43.18): `next dev` in mock-session mode, the room at
// /vendor/posts in the new layout, dream-os's doors stubbed at the network, headless Chromium at 374 x 812, Graphite.
//   §1 THE CARD IS THE PAGE: one line; the Post/Status/Story switch; the card; Download and Share SIDE BY SIDE; the
//      caption's own box below them. A new vendor (no_gallery) sees the TDW-marked example under W6 with the door's own
//      sentence, and NO Download or Share (R-46.16).
//   §2 ADS IS ONE ROW: the head, one row, the running ad's name and a Running pill; the tap opens /vendor/posts/ads.
//   §3 MESSAGES TO PAST CLIENTS: two rows with their facts; with no one to send to, both rows are dead (no chevron, no
//      tap); a tap opens ONE sheet, and Send turns that same sheet into the confirm (never a second dialog).
//   §4 THE SUNDAY REPORT: waiting on Instagram, one dead row reading Coming soon (R-46.14); otherwise the row opens the
//      section in place.
//   §5 THE WHOLE ROOM: no "couple" on glass; every date in full month; every control 44 px or taller.
//   §6 THE "?" CARD: the four approved steps and the connects line, and every button a step names is drawn.
//   §7 MUTATIONS (production code, each must redden its named cell; each restored by sha): M1 Share back under
//      Download, M2 the Coming soon row made a button, M3 W1 undone, M4 Send opening a second dialog.
//   §8 THE STOP: the browser closed and the dev server's whole group stopped on every exit path; the port proven free.
// THE EXIT CODE IS THE VERDICT. Run: node scripts/b173_fe6_posts_room_bench.js  (add --mutate for §7)
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const PORT = 3173;
const MUTATE = process.argv.includes('--mutate');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const guard = require(path.join(ROOT, 'scripts/lib/mutation_guard.js'));   // F-44.258
const PAGE = 'v2/app/vendor/(shell)/posts/page.tsx';
const WORDS = 'lib/worklist/posts.ts';

let pass = 0; let fail = 0; let quiet = false; let evidence = 0; let underMut = '';
const failed = [];
const fmt = (info) => (info === undefined ? '' : '  [' + String(info).slice(0, 240) + ']');
function ok(c, name, info) {
  if (c) { pass += 1; if (!quiet) console.log(`  PASS  ${name}`); return true; }
  if (quiet) { evidence += 1; console.log(`  red under ${underMut}  ${name}${fmt(info)}`); return false; }
  fail += 1; failed.push(name); console.log(`  FAIL  ${name}${fmt(info)}`); return false;
}
const sec = (t) => { if (!quiet) console.log(`\n── ${t}`); };

const CAPTION = 'Aanya and Rohan, Delhi, September 2026. Hair and makeup by Swati Roy.';
const IMG = '/b173-card.jpg';
// dream-os's own bodies (src/lib/templates.js couple_broadcast / referral_broadcast), filled with the fixture name
const BODIES = {
  couple: 'Hi, this is Swati Roy. It was lovely being part of your wedding. Here is my page with my newest work and open dates. Reply STOP and I will not message you again.',
  referral: 'Hi, this is Swati Roy. If a friend or someone in your family is getting married, I would love to hear from them. Here is my page to pass on. Reply STOP and I will not message you again.',
};
const RUNNING = { id: 'ad-1', status: 'running', settings: { post: { caption_line: 'Aanya and Rohan', url: IMG } }, total_minor: 300000, started_at: '2026-09-28T05:00:00Z', ends_at: '2026-10-12T18:29:00Z',
  last_insights: [{ day: '2026-09-29', reach: 1200, conversations: 2 }, { day: '2026-09-30', reach: 2140, conversations: 2 }] };
const SCEN = {
  fresh: { cards: { ok: false, code: 'no_gallery', error: 'Publish a wedding page with photos to make cards from it.' },
    broadcast: { ok: true, count: 0, couples: [] }, sunday: { ok: true, state: 'pending', brief: null },
    ads: { ok: true, open: true, configured: true, connected: false, gaps: null }, list: [] },
  live: { cards: { ok: true, page: { id: 'W1', slug: 'aanya-rohan', title: 'Aanya and Rohan' }, caption: CAPTION, cards: { post: IMG, status: IMG, story: IMG } },
    broadcast: { ok: true, count: 6, couples: [{ name: 'Meera and Kunal', last4: '0005', source: 'client' }, { name: null, last4: '4417', source: 'booked_lead' }, { name: 'Aanya Kapoor', last4: '0001', source: 'client' }, { name: 'Riya', last4: '0007', source: 'client' }, { name: 'Tara', last4: '0008', source: 'client' }, { name: 'Ira', last4: '0009', source: 'client' }],
      stopped_count: 0, fee_paise: 612, bodies: BODIES, button_label: 'See my work', page_url: 'https://thedreamwedding.in/v/swati', on: { couple: true, referral: true }, referral_next: '2027-01-01' },
    sunday: { ok: true, state: 'connect', brief: null },
    ads: { ok: true, open: true, configured: true, connected: true, gaps: { gap: null } }, list: [RUNNING] },
};

// §A · THE ADS PAGE (CE-47 FE-6 L3, folded into b173 by the chair): a connected vendor with one running ad this month.
const YM = new Date(Date.now() + 5.5 * 3600000).toISOString().slice(0, 7);
const A_SETTINGS = { places: [{ type: 'city', key: '1035921', name: 'Lucknow, Uttar Pradesh, India', radius_km: 25 }], exclude: [], age_min: 22, age_max: 40, genders: [], locales: [], interests: [], life_events: [], advantage_audience: false,
  placements: { instagram: ['stream', 'story', 'reels'], facebook: [] }, budget: { kind: 'daily', minor: 10000 }, start: new Date(Date.now() + 864e3).toISOString(), end: new Date(Date.now() + 3 * 864e5).toISOString(), bid: { strategy: 'LOWEST_COST_WITHOUT_CAP' }, media_id: 'm1', welcome: { text: '', icebreakers: [] } };
const A_MEDIA = { id: 'm1', caption: 'Aanya and Rohan. Delhi, September 2026', type: 'IMAGE', url: IMG, at: new Date(Date.now() - 7 * 864e5).toISOString(), likes: 212, comments: 18, eligible: true, insights: { saves: 48, reach: 3100 } };
const A_GAPS = { gap: null, page: { id: 'P1', name: 'The Dream Wedding' }, ig: { id: 'IG1', username: 'thedreamwedding_in' }, account: { id: 'act_4417', name: 'Swati Roy Makeup' } };
const A_AD = { id: 'ad-9', status: 'running', settings: { ...A_SETTINGS, post: { url: IMG, caption_line: 'Aanya and Rohan' } }, total_minor: 30000, started_at: new Date(Date.now() - 864e5).toISOString(),
  ends_at: new Date(Date.now() + 2 * 864e5).toISOString(), ended_at: null, created_at: new Date(Date.now() - 864e5).toISOString(),
  last_insights: [{ day: `${YM}-01`, impressions: 1802, reach: 1240, clicks: 61, spend: 105, conversations: 2 }] };
SCEN.adsrun = { ...SCEN.live, ads: { ok: true, open: true, configured: true, connected: true, gaps: A_GAPS }, list: [A_AD] };
const sentA = [];

let SERVER = null; let BROWSER = null;
async function stopAll() {
  let portFree = true;
  try { if (BROWSER) await BROWSER.close(); } catch (_e) { /* gone */ }
  BROWSER = null;
  try { if (SERVER) { const r = await SERVER.stop(); portFree = r.portFree; } } catch (_e) { /* gone */ }
  SERVER = null;
  return portFree;
}

async function main() {
  guard.recoverOrRefuse(ROOT, 'b173');
  const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
  const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
  const photo = fs.readFileSync(path.join(ROOT, 'public/examples/ads/example-hands.jpg'));
  SERVER = await dev.start(ROOT, PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` });
  if (!ok(await SERVER.up(), '0.1 the dev server came up')) return;
  const exe = process.env.B173_CHROME || await chromium.executablePath();
  BROWSER = await puppeteer.launch({ executablePath: exe, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });

  async function open(scen, url = '/vendor/posts', wait = '.pst-room') {
    const s = SCEN[scen];
    const p = await BROWSER.newPage();
    await p.setViewport({ width: 374, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    await p.setCookie({ name: 'tdw_wl_mode', value: 'dark', domain: 'localhost', path: '/' });
    await p.setCookie({ name: 'tdw_layout', value: 'v2', domain: 'localhost', path: '/' });
    const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
    await p.setRequestInterception(true);
    p.on('request', (r) => {
      const u = r.url();
      if (u.includes('/b173-card.jpg')) return r.respond({ status: 200, contentType: 'image/jpeg', body: photo });
      if (!u.includes('/__api/')) return r.continue();
      const route = u.split('/__api')[1].split('?')[0];
      const J = (o) => r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
      if (route === '/api/v2/vendor/posts/cards') return J(s.cards);
      if (route === '/api/v2/vendor/posts/broadcast') return J(r.method() === 'POST' ? { ok: true, sent: 6, not_delivered: 0 } : s.broadcast);
      if (route === '/api/v2/vendor/posts/sunday') return J(s.sunday);
      if (route === '/api/v2/vendor/ads') return J(s.ads);
      if (route === '/api/v2/vendor/ads/list') return J({ ok: true, ads: s.list });
      if (route === '/api/v2/vendor/ads/start') return J({ ok: true, facts: { currency: 'INR', minDailyMinor: 10000 }, settings: A_SETTINGS });
      if (route === '/api/v2/vendor/ads/posts') return J({ ok: true, posts: [A_MEDIA], suggestion: A_MEDIA });
      if (route === '/api/v2/vendor/ads/disconnect') { sentA.push(route); return J({ ok: true }); }
      if (route === '/api/v2/vendor/ig/authorize-insights' || /authorize/.test(route)) return J({ ok: true, authorize_url: 'https://www.instagram.com/oauth/authorize?x=1' });
      return J({ ok: true });
    });
    await p.goto(`http://localhost:${PORT}${url}`, { waitUntil: 'domcontentloaded', timeout: 180000 });
    const until = Date.now() + 180000; let found = false;
    while (Date.now() < until && !(found = await p.evaluate((w) => !!document.querySelector(w), wait).catch(() => false))) await new Promise((r) => setTimeout(r, 400));
    p.found = found;
    // every door's row has drawn (no busy placeholder left in the room)
    for (let i = 0; i < 40 && await p.evaluate(() => !!document.querySelector('.pst-room [aria-busy="true"]')).catch(() => false); i += 1) await new Promise((r) => setTimeout(r, 300));
    await new Promise((r) => setTimeout(r, 800));
    return p;
  }
  const q = (p, fn, ...a) => p.evaluate(fn, ...a).catch(() => null);

  async function runAll() {
    // ── §1 the card is the page ──────────────────────────────────────────────────────────────────────────────
    sec('§1 the card is the page');
    let p = await open('live');
    if (!ok(p.found, '1.0 the room is on glass within 180 s')) { await p.close(); return; }
    const live = await q(p, () => {
      const r = (e) => { if (!e) return null; const b = e.getBoundingClientRect(); return { top: b.top, bottom: b.bottom, left: b.left, right: b.right, height: b.height }; };   // plain: a DOMRect crosses as {}
      const btn = (t) => [...document.querySelectorAll('.pst-room button')].find((b) => b.innerText.trim() === t);
      const seg = [...document.querySelectorAll('.pst-room .pst-seg button')];
      return { line: (document.querySelector('[data-posts-line]') || {}).innerText, seg: seg.map((b) => [b.innerText.trim(), r(b).height]),
        dl: r(btn('Download')), sh: r(btn('Share')), card: r(document.querySelector('[data-posts-card]')), box: r(document.querySelector('[data-caption-box]')),
        mark: !!document.querySelector('[data-example-mark]') };
    });
    ok(live && live.line === 'Cards made from your last wedding page.', '1.1 live: the one line is the room lede', live && live.line);
    ok(live && live.seg.length === 3 && live.seg.map((x) => x[0]).join() === 'Post,Status,Story' && live.seg.every((x) => x[1] >= 44), '1.2 the switch: Post, Status, Story, each 44 px or taller', live && JSON.stringify(live.seg));
    ok(live && live.dl && live.sh && Math.abs(live.dl.top - live.sh.top) < 1 && live.sh.left >= live.dl.right && live.dl.height >= 48 && live.sh.height >= 48,
      '1.3 Download and Share side by side, each 48 px or taller', live && JSON.stringify([live.dl, live.sh]));
    ok(live && live.card && live.dl && live.dl.top >= live.card.bottom, '1.4 the actions sit under the card');
    ok(live && live.box && live.dl && live.box.top >= live.dl.bottom, '1.5 the caption\u2019s own box sits under the actions (R-46.17)');
    ok(live && !live.mark, '1.6 live: no example mark on her own card');
    await p.close();

    p = await open('fresh');
    const fresh = await q(p, () => ({ line: (document.querySelector('[data-posts-line]') || {}).innerText, mark: (document.querySelector('[data-example-mark]') || {}).innerText,
      img: (document.querySelector('[data-posts-card] img') || {}).getAttribute ? document.querySelector('[data-posts-card] img').getAttribute('src') : null,
      refusal: (document.querySelector('[data-posts-refusal]') || {}).innerText,
      actions: [...document.querySelectorAll('.pst-room button')].filter((b) => /^(Download|Share)$/.test(b.innerText.trim())).length }));
    ok(fresh && fresh.line === 'An example card. Yours are made from your last wedding page.', '1.7 new vendor: the W6 line', fresh && fresh.line);
    ok(fresh && fresh.mark === 'TDW' && fresh.img === '/examples/ads/example-couple.jpg', '1.8 new vendor: the example picture carries the TDW mark (R-46.16)', fresh && JSON.stringify(fresh));
    ok(fresh && fresh.refusal === 'Publish a wedding page with photos to make cards from it.', '1.9 new vendor: the door\u2019s own sentence under the example', fresh && fresh.refusal);
    ok(fresh && fresh.actions === 0, '1.10 new vendor: no Download or Share on the example (R-46.16)', fresh && fresh.actions);

    // ── §3 and §4 on the fresh room (nothing to send, Sunday waiting) ───────────────────────────────────────
    sec('§3 §4 with no one to send to, Sunday waiting');
    const dead = await q(p, () => {
      const rows = [...document.querySelectorAll('[data-message-row]')];
      const sun = document.querySelector('[data-sunday-row]');
      return { rows: rows.map((e) => ({ tag: e.tagName, dead: e.hasAttribute('data-dead'), chev: !!e.querySelector('.pst-chev'), text: e.innerText })),
        sun: sun ? { tag: sun.tagName, dead: sun.hasAttribute('data-dead'), chev: !!sun.querySelector('.pst-chev'), pill: (sun.querySelector('[data-pill]') || {}).innerText, text: sun.innerText } : null };
    });
    ok(dead && dead.rows.length === 2 && dead.rows.every((r) => r.dead && !r.chev && r.tag !== 'BUTTON' && r.text.includes('No past clients with a number yet.')),
      '3.1 no one to send to: both message rows are dead, with the W1 line', dead && JSON.stringify(dead.rows));
    ok(dead && dead.sun && dead.sun.dead && !dead.sun.chev && dead.sun.tag !== 'BUTTON' && dead.sun.pill === 'Coming soon' && dead.sun.text.includes('This opens once Instagram approves our access.'),
      '4.1 Sunday waiting: one dead row, Coming soon, no chevron, no tap (R-46.14)', dead && JSON.stringify(dead.sun));
    await p.close();

    // ── §2, §3, §4 on the live room ──────────────────────────────────────────────────────────────────────────
    sec('§2 §3 §4 live');
    p = await open('live');
    const rows = await q(p, () => {
      const heads = [...document.querySelectorAll('.pst-room h2')].map((h) => h.innerText.trim());
      const ad = document.querySelector('[data-ads-row]');
      const m = (k) => { const e = document.querySelector(`[data-message-row="${k}"]`); return e ? { tag: e.tagName, text: e.innerText } : null; };
      return { heads, ad: ad ? { tag: ad.tagName, text: ad.innerText, pill: (ad.querySelector('[data-pill]') || {}).innerText } : null, couple: m('couple'), referral: m('referral') };
    });
    ok(rows && rows.heads.join('|') === 'Ads|Messages to past clients|Sunday report', '2.0 the three heads, in order', rows && rows.heads.join('|'));
    ok(rows && rows.ad && rows.ad.tag === 'BUTTON' && rows.ad.text.startsWith('Aanya and Rohan') && rows.ad.pill === 'Running', '2.1 Ads is one row: the running ad\u2019s name and a Running pill', rows && JSON.stringify(rows.ad));
    ok(rows && rows.couple && rows.couple.text.includes('Newest work message') && rows.couple.text.includes('6 past clients \u00b7 Meta charges up to Rs\u00a06.12'), '3.2 the newest-work row (W11): its name, who and the fee', rows && JSON.stringify(rows.couple));
    ok(rows && rows.referral && rows.referral.text.includes('Referral message') && rows.referral.text.includes('Once a year \u00b7 next 1 January 2027'), '3.3 the referral row: once a year, the next date in full month', rows && JSON.stringify(rows.referral));

    await p.evaluate(() => document.querySelector('[data-message-row="couple"]').click()).catch(() => null);
    await new Promise((r) => setTimeout(r, 700));
    const sh1 = await q(p, () => { const d = [...document.querySelectorAll('[role=dialog]')]; const s = d[0]; return { n: d.length, text: s ? s.innerText : '', send: s ? [...s.querySelectorAll('button')].map((b) => b.innerText.trim()) : [] }; });
    ok(sh1 && sh1.n === 1 && sh1.text.includes('6 past clients') && sh1.text.includes(BODIES.couple) && sh1.send.includes('Send to 6'), '3.4 a tap opens ONE sheet: who, the message, Send to 6', sh1 && JSON.stringify(sh1).slice(0, 200));
    await p.evaluate(() => [...document.querySelectorAll('[role=dialog] button')].find((b) => b.innerText.trim() === 'Send to 6').click()).catch(() => null);
    await new Promise((r) => setTimeout(r, 700));
    const sh2 = await q(p, () => { const d = [...document.querySelectorAll('[role=dialog]')]; return { n: d.length, text: d.map((x) => x.innerText).join(' || ') }; });
    ok(sh2 && sh2.n === 1 && sh2.text.includes('Send to 6 past clients? Meta charges up to Rs\u00a06.12.'), '3.5 Send turns the SAME sheet into the confirm (never a second dialog; W1)', sh2 && JSON.stringify(sh2).slice(0, 220));
    await p.evaluate(() => { const x = document.querySelector('[role=dialog] .pst-x'); if (x) x.click(); }).catch(() => null);
    await new Promise((r) => setTimeout(r, 500));

    const sun0 = await q(p, () => { const e = document.querySelector('[data-sunday-row]'); return e ? { tag: e.tagName, text: e.innerText } : null; });
    ok(sun0 && sun0.tag === 'BUTTON' && sun0.text.includes('Your week on Instagram') && sun0.text.includes('Connect Instagram to see your week.'), '4.2 Sunday not connected: a live row with its state', sun0 && JSON.stringify(sun0));
    await p.evaluate(() => document.querySelector('[data-sunday-row]').click()).catch(() => null);
    await new Promise((r) => setTimeout(r, 600));
    const sun1 = await q(p, () => { const u = document.querySelector('.pst-under'); return { under: u ? u.innerText : null, dialogs: document.querySelectorAll('[role=dialog]').length }; });
    ok(sun1 && sun1.under && sun1.under.includes('Connect Instagram') && sun1.dialogs === 0, '4.3 the row opens the section in place, below it (no sheet)', sun1 && JSON.stringify(sun1));

    // ── §5 the whole room ────────────────────────────────────────────────────────────────────────────────────
    sec('§5 the whole room');
    const whole = await q(p, () => {
      const root = document.querySelector('.pst-room'); const out = [];
      const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
      while ((n = w.nextNode())) { const t = n.textContent.replace(/\s+/g, ' ').trim(); if (t && n.parentElement && getComputedStyle(n.parentElement).display !== 'none') out.push(t); }
      const small = [...root.querySelectorAll('button, a')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height < 44; }).map((e) => e.innerText.trim() + ':' + Math.round(e.getBoundingClientRect().height));
      return { leaves: out, small };
    });
    const leaves = whole ? whole.leaves : [];
    ok(whole && !leaves.some((t) => /couple/i.test(t)), '5.1 no "couple" anywhere on glass (the founder\u2019s rule, W1)', leaves.filter((t) => /couple/i.test(t)).join(' | '));
    const shortMonth = leaves.filter((t) => /\b\d{1,2} (Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\b(?!\w)/.test(t));
    ok(whole && shortMonth.length === 0, '5.2 every date on glass in full month (R-42.13)', shortMonth.join(' | '));
    ok(whole && whole.small.length === 0, '5.3 every control in the room is 44 px or taller', whole && whole.small.join(', '));

    // ── §6 the "?" card ──────────────────────────────────────────────────────────────────────────────────────
    sec('§6 the "?" card');
    await p.evaluate(() => { const b = document.querySelector('.wl-roomhead .wl-helpq'); if (b) b.click(); }).catch(() => null);
    await new Promise((r) => setTimeout(r, 700));
    const card = await q(p, () => { const c = document.querySelector('.wl-helpcard'); return c ? c.innerText : null; });
    const STEPS = ['To post one: tap Download or Share beside it.', 'To run or see your ads: tap the row under Ads.',
      'To send a message to past clients: tap Newest work message or Referral message.', 'Connects to your wedding pages and your Meta ad account.'];
    ok(card && STEPS.every((s) => card.includes(s)), '6.1 the card carries the three approved steps and the connects line', card && card.slice(0, 200));
    const card2 = await q(p, () => { const c = document.querySelector('.wl-helpcard'); if (!c) return null; const r = c.getBoundingClientRect(); const sc = [...c.querySelectorAll('*')].concat([c]).some((e) => e.scrollHeight > e.clientHeight + 1 && /(auto|scroll)/.test(getComputedStyle(e).overflowY)); return { steps: c.querySelectorAll('.wl-helpdo li, .wl-helpdo > *').length, inView: r.top >= 0 && r.bottom <= innerHeight, scrolls: sc }; });
    ok(card2 && card2.inView && !card2.scrolls, '6.3 the card fits at 374 with nothing scrolling inside it (the rework standard)', card2 && JSON.stringify(card2));
    await p.evaluate(() => { const b = [...document.querySelectorAll('.wl-helpcard button')].find((x) => /Got it/.test(x.innerText)); if (b) b.click(); }).catch(() => null);
    await new Promise((r) => setTimeout(r, 400));
    const drawn = await q(p, () => {
      const names = [...document.querySelectorAll('.pst-room button, .pst-room [data-ctl], .pst-room a')].map((e) => e.innerText.replace(/\s+/g, ' ').trim());
      const has = (n) => names.some((t) => t === n || t.startsWith(n));
      return { Download: has('Download'), Share: has('Share'), Copy: has('Copy'), 'Newest work message': has('Newest work message'), 'Referral message': has('Referral message'), adsRow: !!document.querySelector('[data-ads-row]') };
    });
    ok(drawn && Object.values(drawn).every(Boolean), '6.2 every button the card names is drawn in the room', drawn && JSON.stringify(drawn));
    await p.evaluate(() => document.querySelector('[data-ads-row]').click()).catch(() => null);
    for (let i = 0; i < 30 && !(await q(p, () => location.pathname === '/vendor/posts/ads')); i += 1) await new Promise((r) => setTimeout(r, 300));
    ok(await q(p, () => location.pathname) === '/vendor/posts/ads', '2.2 the Ads row opens /vendor/posts/ads');
    await p.close();

    // ── §A the Ads page (the founder's verdict, the chair's change: Disconnect asked first) ──────────────────────
    sec('§A the Ads page');
    p = await open('adsrun', '/vendor/posts/ads', '.ads-adrow');
    if (!ok(p.found, 'A.0 the Ads page is on glass with her ads')) { await p.close(); return; }
    const A1 = await q(p, () => {
      const room = document.querySelector('.ads-room') || document.body;
      const yours = document.querySelector('.ads-adrow'); const draft = document.querySelector('.ads-draft'); const money = document.querySelector('[data-ads-money]');
      const before = (a, b) => !!(a && b && (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING));
      const L = []; const w = document.createTreeWalker(room, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const t = n.textContent.replace(/\s+/g, ' ').trim(); if (t) L.push(t); }
      return { order: before(yours, money) && before(money, draft), pill: yours && (yours.querySelector('[data-pill]') || {}).innerText, money: money ? money.innerText.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ') : null, L };
    });
    ok(A1 && A1.order && A1.pill === 'Running', 'A.1 her ads come first, each with its pill (Running); the money next; the next ad after', A1 && JSON.stringify({ order: A1.order, pill: A1.pill }));
    ok(A1 && A1.money && A1.money.includes('Spent this month Rs 105') && A1.money.includes('Enquiries from ads 2') && A1.money.includes('Paid from Your Meta ad account'), 'A.2 the month\u2019s money, from the ad\u2019s own daily figures', A1 && A1.money);
    ok(A1 && !A1.L.some((t) => /\b\d{1,2} (Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\b(?!\w)/.test(t)), 'A.3 every date on the page in full month', A1 && A1.L.filter((t) => /\d{1,2} [A-Z][a-z]{2}\b/.test(t)).join(' | '));
    ok(A1 && !A1.L.some((t) => /couple/i.test(t)), 'A.4 no "couple" on the Ads page', A1 && A1.L.filter((t) => /couple/i.test(t)).join(' | '));
    sentA.length = 0;
    await p.evaluate(() => { const b = document.querySelector('[data-disconnect-open]'); if (b) b.click(); }).catch(() => null);
    await new Promise((r) => setTimeout(r, 500));
    const A5 = await q(p, () => ({ ask: (document.querySelector('[data-disconnect-ask] .ads-q') || {}).innerText, last: (() => { const r = document.querySelector('.ads-room') || document.body; const bs = [...r.querySelectorAll('button')].filter((b) => !b.closest('[role=dialog]')); return bs.length ? bs[bs.length - 1].innerText.trim() : null; })() }));
    ok(A5 && A5.ask === 'Disconnect your ad account? Your ads on Meta stay as they are.' && sentA.length === 0 && A5.last === 'Disconnect', 'A.5 Disconnect is last and asks first; nothing is sent yet', A5 && JSON.stringify({ ...A5, sent: sentA.length }));
    await p.evaluate(() => { const b = document.querySelector('[data-disconnect]'); if (b) b.click(); }).catch(() => null);
    await new Promise((r) => setTimeout(r, 700));
    ok(sentA.length === 1, 'A.6 only the confirm calls the disconnect door', sentA.length);
    const adsSrc = fs.readFileSync(path.join(ROOT, 'v2/app/vendor/(shell)/posts/ads/page.tsx'), 'utf8');
    ok(/type="datetime-local"[\s\S]{0,300}data-date-words=""/.test(adsSrc), 'A.7 the date field says its date in words under it (source; the sheet opens from All settings)');
    await p.close();
  }

  await runAll();

  if (MUTATE) {
    sec('§7 mutations (production code; each must redden its named cell)');
    const src = fs.readFileSync(path.join(ROOT, PAGE), 'utf8'); const srcSha = sha(src);
    const words = fs.readFileSync(path.join(ROOT, WORDS), 'utf8'); const wordsSha = sha(words);
    const MUTS = [
      ['M1 Share back under Download', PAGE, src, '<div className="pst-two" data-posts-actions="">', '<div className="pst-stack" data-posts-actions="">', '1.3'],
      ['M2 the Coming soon row made a button', PAGE, src, '<div className="pst-lrow pst-dead" data-sunday-row="" data-dead="">', '<div className="pst-lrow" data-sunday-row="">', '4.1'],
      ['M3 W1 undone', WORDS, words, "noCouples:      'No past clients with a number yet.',", "noCouples:      'No past couples with a number yet.',", '3.1'],
      ['M4 Send opens a second dialog', PAGE, src, "{confirm === kind && fee ? (", "{false ? (", '3.5'],
      ['M5 Disconnect without asking', 'v2/app/vendor/(shell)/posts/ads/page.tsx', fs.readFileSync(path.join(ROOT, 'v2/app/vendor/(shell)/posts/ads/page.tsx'), 'utf8'), "data-disconnect-open onClick={() => setAskDisc(true)}", "data-disconnect-open onClick={() => { postJson(API.adsDisconnect(), {}); }}", 'A.5'],
    ];
    for (const [name, file, orig, from, to, cell] of MUTS) {
      if (!orig.includes(from)) { ok(false, `${name}: its anchor is missing`, from.slice(0, 80)); continue; }
      const planted = guard.apply(ROOT, file, from, to, 'b173');   // F-44.258: kept original and marker first, then the mutation
      await new Promise((r) => setTimeout(r, 2500));
      const before = evidence; quiet = true; underMut = name.split(' ')[0];
      let crashed = null; const passBefore = pass;
      try { await runAll(); } catch (e) { crashed = e; }
      quiet = false; pass = passBefore;
      const back = planted.restore();
      if (crashed) ok(false, `${name} crashed: ${String(crashed.message || crashed).slice(0, 160)}`);
      else ok(evidence > before && back, `${name} → ${cell} RED; restored by sha`);
      await new Promise((r) => setTimeout(r, 1500));
    }
    ok(sha(fs.readFileSync(path.join(ROOT, PAGE), 'utf8')) === srcSha && sha(fs.readFileSync(path.join(ROOT, WORDS), 'utf8')) === wordsSha, '7.9 every mutated file restored by sha');
  }
}

let exiting = false;
async function finish(code) {
  if (exiting) return; exiting = true;
  const free = await stopAll();
  ok(free, '8.1 the stop: browser closed, the dev server\u2019s group stopped, the port free');
  console.log(`\nb173 · ${pass} passed, ${fail} failed${failed.length ? ' · ' + failed.join(' ; ') : ''}`);
  process.exit(code !== undefined ? code : (fail ? 1 : 0));
}
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => { void finish(1); });
main().then(() => finish(), (e) => { ok(false, `crashed: ${String((e && e.stack) || e).slice(0, 300)}`); return finish(1); });
