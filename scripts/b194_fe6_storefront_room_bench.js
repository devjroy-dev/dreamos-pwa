'use strict';
process.env.TDW_LAYOUT_DEFAULT = 'v2';   // the new layout (middleware.ts serves v2/ with no cookie under this default)
// scripts/b194_fe6_storefront_room_bench.js · TDW CE-47 · FE-6 · L5 · rung b194 · THE STOREFRONT, REWORKED.
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
// THE EXIT CODE IS THE VERDICT. Run: node scripts/b194_fe6_storefront_room_bench.js  (add --mutate for §7)
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const PORT = 3194;
const MUTATE = process.argv.includes('--mutate');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const PAGE = 'v2/app/vendor/(shell)/storefront/screen.tsx';
const CLOCK = 'v2/lib/worklist/clockStandIn.ts';
const guard = require(path.join(ROOT, 'scripts/lib/mutation_guard.js'));

let pass = 0; let fail = 0; let quiet = false; let evidence = 0; let underMut = '';
const failed = [];
const fmt = (info) => (info === undefined ? '' : '  [' + String(info).slice(0, 240) + ']');
function ok(c, name, info) {
  if (c) { pass += 1; if (!quiet) console.log(`  PASS  ${name}`); return true; }
  if (quiet) { evidence += 1; console.log(`  red under ${underMut}  ${name}${fmt(info)}`); return false; }
  fail += 1; failed.push(name); console.log(`  FAIL  ${name}${fmt(info)}`); return false;
}
const sec = (t) => { if (!quiet) console.log(`\n── ${t}`); };


// WHAT IT HOLDS (the founder's verdict on FE-6's mock, CE-46; W3, W10; the sprint's standing rules, CE-47):
//   §1 the room: the pill "+ New slot" on the head's title line left of the one "?", drawn 36 and tapped 44; the count
//      line; one switch; slots as rows (weekday, full date; "4:00 pm" · minutes · Rs; one pill); a booked slot is not a tap.
//   §2 the add sheet: the date said in words under the native date field, and the time in 12-hour words.
//   §3 remove: a tap on an open slot opens its sheet; Remove asks first; only the confirm calls the door.
//   §4 the locked state: one plain line and "See plans in Billing" (W3).
//   §5 the whole room: full months, 44 px controls, no "couple", times never "16:00".
//   §6 the "?" card: three steps and the connects line; every button a step names is drawn; nothing scrolls at 374.
//   §F F-44.259: summaryOf in the classic AND the v2 Packages page draws nothing for empty details (evaluated from source).
//   §7 mutations through the guard (F-44.258): M1 Remove without asking, M2 no date in words, M3 a 24-hour slice,
//      M4 the locked button gone. Each must redden its cell. §8 the stop.
// WHAT IT HOLDS (the founder's verdict on mock 11; the chair's d and e): "Profile strength · N%" and its bar; the photos
// line alone; "See your profile" full width; "What to add" with at most three rows from the meter's own gaps, the biggest
// gain first, "Add N more photos" carrying the real need minus have; nothing drawn when nothing is missing; the address
// in its own box (R-46.17); no "couple" on the room or its card. §7 mutations through the guard.
const ME = (over) => ({ ok: true, vendor: { id: 'v1', name: 'Swati Roy Makeup', handle: 'swati', about: '', rate_min: null, instagram_handle: '', aesthetic_tags: [], travel_notes: '', ...over } });
const SCEN = {
  // AMENDED BY LABEL · CE-47 FE-9 R-47.2 (WEB-4 cut 30): the summary's wire is total, approved (what Discover shows), held and
  // hidden; "photos live" is the total less the held, "waiting" the held. 1.2 keeps its words: 2 live, 1 waiting.
  gaps: { me: ME({}), status: { ok: true, portfolio_summary: { total: 3, approved: 2, held: 1, hidden: 0 }, min_portfolio_images: 6 }, images: [] },
  full: { me: ME({ about: 'Bridal makeup in Delhi.', rate_min: 25000, instagram_handle: 'swatiroymakeup', aesthetic_tags: ['Soft', 'Glam', 'Traditional'], travel_notes: 'Delhi NCR and Jaipur' }),
    status: { ok: true, portfolio_summary: { total: 8, approved: 8, held: 0, hidden: 0 }, min_portfolio_images: 6 }, images: [{ id: 'i1', is_hero: true }] },
};

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
  guard.recoverOrRefuse(ROOT, 'b194');
  const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
  const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
  SERVER = await dev.start(ROOT, PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` });
  if (!ok(await SERVER.up(), '0.1 the dev server came up')) return;
  BROWSER = await puppeteer.launch({ executablePath: process.env.B194_CHROME || await chromium.executablePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  async function open(scen, width = 374) {
    const s = SCEN[scen];
    const p = await BROWSER.newPage();
    await p.setViewport({ width, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    for (const [n, v] of [['tdw_wl_mode', 'dark'], ['tdw_layout', 'v2']]) await p.setCookie({ name: n, value: v, domain: 'localhost', path: '/' });
    const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
    await p.setRequestInterception(true);
    p.on('request', (r) => {
      const u = r.url(); if (!u.includes('/__api/')) return r.continue();
      const route = u.split('/__api')[1].split('?')[0];
      const J = (o) => r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
      if (route === '/api/v2/vendor/me') return J(s.me);
      if (route === '/api/v2/vendor/discover/status') return J(s.status);
      if (route.startsWith('/api/v2/vendor/portfolio/')) return J({ ok: true, images: s.images });
      return J({ ok: true });
    });
    await p.goto(`http://localhost:${PORT}/vendor/storefront`, { waitUntil: 'domcontentloaded', timeout: 180000 });
    const until = Date.now() + 180000; let found = false;
    while (Date.now() < until && !(found = await p.evaluate(() => !!document.querySelector('[data-strength]')).catch(() => false))) await wait(400);
    p.found = found; await wait(1200); return p;
  }
  const q = (p, fn, ...a) => p.evaluate(fn, ...a).catch(() => null);

  async function runAll() {
    sec('§1 something missing');
    let p = await open('gaps');
    if (!ok(p.found, '1.0 the room is on glass within 180 s')) { await p.close(); return; }
    const r = await q(p, () => ({ strength: (document.querySelector('[data-strength]') || {}).innerText, photos: (document.querySelector('[data-photos-live]') || {}).innerText,
      rows: [...document.querySelectorAll('[data-what-to-add] [data-gap]')].map((e) => [e.dataset.gap, e.innerText.replace(/\s+/g, ' ').trim(), e.dataset.href, !!e.querySelector('button.fr-row')]),   // FE-7's shared Row, a button
      head: [...document.querySelectorAll('.sf-h')].map((h) => h.innerText), cta: (() => { const b = [...document.querySelectorAll('a,button')].find((x) => x.innerText.trim() === 'See your profile'); if (!b) return null; const rr = b.getBoundingClientRect(); const bio = document.querySelector('[data-storefront-bio]').getBoundingClientRect(); return rr.width >= bio.width - 2; })(),
      box: !!document.querySelector('[data-copybox] [data-public-address], [data-public-box]') }));
    ok(r && /^Profile strength \u00b7 \d+%$/.test(r.strength), '1.1 "Profile strength · N%" (V16)', r && r.strength);
    ok(r && r.photos === '2 photos live \u00b7 1 waiting', '1.2 the photos line alone', r && r.photos);
    ok(r && r.cta === true, '1.3 "See your profile" is full width');
    ok(r && r.head.includes('What to add') && r.rows.length === 3, '1.4 "What to add", at most three rows', r && JSON.stringify(r.rows));
    ok(r && r.rows.map((x) => x[0]).join(',') === 'photos,hero,about', '1.5 the biggest gains first (weight times gap)', r && r.rows.map((x) => x[0]).join(','));
    ok(r && r.rows[0][1].startsWith('Add 4 more photos') && r.rows[0][2] === '/vendor/portfolio' && r.rows.every((x) => x[3]), '1.6 "Add 4 more photos", the meter\u2019s real need (6) minus have (2), opening Portfolio', r && JSON.stringify(r.rows[0]));
    ok(r && r.box, '1.7 the address sits in its own box (R-46.17)');
    const L = await q(p, () => { const root = document.querySelector('.wl-main') || document.body; const out = []; const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const t = n.textContent.trim(); if (t) out.push(t); } return out; });
    ok(L && !L.some((t) => /couple/i.test(t)), '1.8 no "couple" on the room', L && L.filter((t) => /couple/i.test(t)).join(' | '));
    await p.evaluate(() => { const b = document.querySelector('.wl-roomhead .wl-helpq'); if (b) b.click(); }).catch(() => null); await wait(600);
    const card = await q(p, () => { const c = document.querySelector('.wl-helpcard'); if (!c) return null; const rr = c.getBoundingClientRect(); return { fits: rr.top >= 0 && rr.bottom <= innerHeight, t: c.innerText }; });
    ok(card && card.fits && !/couple/i.test(card.t) && card.t.includes('tap See your profile') && card.t.includes('tap Copy on your address'), '1.9 the card: fits, no "couple", names only what is drawn', card && JSON.stringify(card).slice(0, 400));
    await p.close();
    sec('§2 nothing missing');
    p = await open('full', 360);
    const r2 = await q(p, () => ({ strength: (document.querySelector('[data-strength]') || {}).innerText, add: !!document.querySelector('[data-what-to-add]'), head: [...document.querySelectorAll('.sf-h')].map((h) => h.innerText) }));
    ok(r2 && r2.strength === 'Profile strength \u00b7 100%' && !r2.add && !r2.head.includes('What to add'), '2.1 nothing missing: 100%, and no "What to add" at all', r2 && JSON.stringify(r2));
    await p.close();
  }

  await runAll();

  if (MUTATE) {
    sec('§7 mutations through the guard');
    const MUTS = [
      ['M1 a guessed photo count', PAGE, "SF.add.photos(Math.max(1, (g.need ?? 0) - (g.have ?? 0)))", "SF.add.photos(5)", '1.6'],
      ['M2 the list order ignored', PAGE, ".sort((x, y) => W[y] * gaps[y].gap - W[x] * gaps[x].gap || SECTION_ORDER.indexOf(x) - SECTION_ORDER.indexOf(y))", ".sort((x, y) => SECTION_ORDER.indexOf(x) - SECTION_ORDER.indexOf(y))", '1.5'],
      ['M3 the section drawn when nothing is missing', PAGE, "{missing.length > 0 && (<>", "{true && (<>", '2.1'],
    ];
    for (const [name, file, from, to, cell] of MUTS) {
      let h = null;
      try { h = guard.apply(ROOT, file, from, to, 'b194'); } catch (e) { ok(false, `${name}: ${e.message}`); continue; }
      await wait(2500);
      const before = evidence; quiet = true; underMut = name.split(' ')[0]; const passBefore = pass; let crashed = null;
      try { await runAll(); } catch (e) { crashed = e; }
      quiet = false; pass = passBefore;
      const back = h.restore();
      if (crashed) ok(false, `${name} crashed: ${String(crashed.message || crashed).slice(0, 160)}`);
      else ok(evidence > before && back, `${name} \u2192 ${cell} RED; restored by sha`);
      await wait(1500);
    }
    ok(!fs.existsSync(path.join(ROOT, 'scripts/.mutation-pending')), '7.9 nothing pending after the mutations');
  }
}

let exiting = false;
async function finish(code) {
  if (exiting) return; exiting = true;
  const free = await stopAll();
  ok(free, '8.1 the stop: browser closed, the dev server\u2019s group stopped, the port free');
  console.log(`\nb194 · ${pass} passed, ${fail} failed${failed.length ? ' · ' + failed.join(' ; ') : ''}`);
  process.exit(code !== undefined ? code : (fail ? 1 : 0));
}
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => { void finish(1); });
main().then(() => finish(), (e) => { ok(false, `crashed: ${String((e && e.stack) || e).slice(0, 300)}`); return finish(1); });
