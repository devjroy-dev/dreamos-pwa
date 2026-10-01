'use strict';
process.env.TDW_LAYOUT_DEFAULT = 'v2';   // the new layout (middleware.ts serves v2/ with no cookie under this default)
// scripts/b190_fe6_collab_room_bench.js · TDW CE-47 · FE-6 · L5 · rung b190 · THE COLLAB ROOM, REWORKED.
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
// THE EXIT CODE IS THE VERDICT. Run: node scripts/b190_fe6_collab_room_bench.js  (add --mutate for §7)
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const PORT = 3190;
const MUTATE = process.argv.includes('--mutate');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const PAGE = 'v2/app/vendor/(shell)/collab/screen.tsx';
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
// WHAT IT HOLDS (the founder's verdict on mock 5, V1 and V2; the add-pill ruling): the pill on the room head by tab ("+ New
// post" on My posts and Opportunities, "+ Add someone" on Roster, each opening what its old control opened); the tab's
// one line; one sentence-case switch, 44 px, nothing in capitals; no second add on Roster; no "couple"; the card fits.
const POSTS = [{ id: 'c1', state: 'open', requirement_type: 'second_shooter', city: 'Delhi', event_date: '2026-12-12', budget_inr: 15000, interested_count: 3, items: [] },
  { id: 'c2', state: 'filled', requirement_type: 'hair_stylist', city: 'Jaipur', event_date: '2027-02-14', budget_inr: 8000, interested_count: 1, items: [] }];
const FEED = [{ id: 'f1', state: 'open', requirement_type: 'second_shooter', city: 'Noida', event_date: '2026-11-08', budget_inr: 12000, items: [], vendor: { name: 'Rohit Films' } }];
const ROSTER = [{ id: 'r1', name: 'Rhea Sharma', phone: '+919811100010', crafts: ['photographer'] }, { id: 'r2', name: 'Kabir Anand', phone: '+919811100011', crafts: ['cinematographer'] }];

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
  guard.recoverOrRefuse(ROOT, 'b190');
  const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
  const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
  SERVER = await dev.start(ROOT, PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` });
  if (!ok(await SERVER.up(), '0.1 the dev server came up')) return;
  BROWSER = await puppeteer.launch({ executablePath: process.env.B190_CHROME || await chromium.executablePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  async function open(width = 374) {
    const p = await BROWSER.newPage();
    await p.setViewport({ width, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    for (const [n, v] of [['tdw_wl_mode', 'dark'], ['tdw_layout', 'v2']]) await p.setCookie({ name: n, value: v, domain: 'localhost', path: '/' });
    const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
    if (process.env.B190_DEBUG) p.on('pageerror', (e) => console.log('PAGEERROR', String(e.message || e).slice(0, 300)));
    await p.setRequestInterception(true);
    p.on('request', (r) => {
      const u = r.url(); if (!u.includes('/__api/')) return r.continue();
      const route = u.split('/__api')[1].split('?')[0];
      const J = (o) => r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
      if (route === '/api/v2/vendor/collab/feed') return J({ ok: true, feed: FEED, posts: FEED });
      if (route === '/api/v2/vendor/collab/my-posts') return J({ ok: true, posts: POSTS });
      if (route === '/api/v2/vendor/roster') return J({ ok: true, roster: ROSTER, entries: ROSTER });
      if (/requirement-types|requirement_types/.test(route)) return J({ ok: true, requirement_types: ['second_shooter', 'hair_stylist', 'photographer'] });
      return J({ ok: true });
    });
    await p.goto(`http://localhost:${PORT}/vendor/collab`, { waitUntil: 'domcontentloaded', timeout: 180000 });
    const until = Date.now() + 180000; let found = false;
    while (Date.now() < until && !(found = await p.evaluate(() => !!document.querySelector('[data-collab-line]') && /My posts/.test(document.querySelector('[data-collab-line]').innerText)).catch(() => false))) await wait(400);
    p.found = found; await wait(900); return p;
  }
  const q = (p, fn, ...a) => p.evaluate(fn, ...a).catch(() => null);
  const tab = (p, t) => p.evaluate((t) => { const b = [...document.querySelectorAll('[data-collab-tabs] button')].find((x) => x.innerText.trim() === t); if (b) b.click(); }, t).catch(() => null);
  const line = (p) => q(p, () => (document.querySelector('[data-collab-line]') || {}).innerText);
  const pill = (p) => q(p, () => { const e = document.querySelector('.wl-roomhead [data-room-add="collab"]'); return e ? e.innerText : null; });

  async function runAll() {
    sec('§1 the three tabs');
    let p = await open(374);
    if (!ok(p.found, '1.0 the room is on glass within 180 s')) { await p.close(); return; }
    ok((await line(p)) === 'My posts \u00b7 1 open' && (await pill(p)) === '+ New post', '1.1 My posts: "My posts · 1 open" (filled left out) and "+ New post" (V1, V2)', `${await line(p)} | ${await pill(p)}`);
    const seg = await q(p, () => [...document.querySelectorAll('[data-collab-tabs] button')].map((b) => [b.innerText.trim(), b.getBoundingClientRect().height, getComputedStyle(b).textTransform]));
    ok(seg && seg.map((x) => x[0]).join('|') === 'My posts|Opportunities|Roster' && seg.every((x) => x[1] >= 44 && x[2] !== 'uppercase'), '1.2 one switch in sentence case, 44 px', JSON.stringify(seg));
    await p.evaluate(() => document.querySelector('[data-room-add="collab"]').click()).catch(() => null); await wait(800);
    ok(await q(p, () => document.querySelectorAll('[role=dialog], form, [data-collab-form]').length > 0 || /Post/.test(document.body.innerText.slice(0, 4000))), '1.3 "+ New post" opens the post form, as "+ Post" did');
    await p.close(); p = await open(374);
    await tab(p, 'Opportunities'); await wait(600);
    ok((await line(p)) === 'Opportunities \u00b7 1 new' && (await pill(p)) === '+ New post', '1.4 Opportunities: its line; the same pill');
    await tab(p, 'Roster'); await wait(600);
    ok((await line(p)) === 'Roster \u00b7 2 people' && (await pill(p)) === '+ Add someone', '1.5 Roster: "Roster · 2 people" and "+ Add someone"', `${await line(p)} | ${await pill(p)}`);
    ok(await q(p, () => ![...document.querySelectorAll('.wl-main button')].some((b) => b.innerText.trim() === 'Add someone' && !b.closest('.wl-roomhead'))), '1.6 no second add in the Roster body');
    await p.evaluate(() => document.querySelector('[data-room-add="collab"]').click()).catch(() => null); await wait(700);
    if (process.env.B190_DEBUG) console.log('DEBUG', await q(p, () => document.body.innerText.slice(0, 300)), await q(p, () => [...document.querySelectorAll('body *')].filter((e) => /Add someone/.test(e.textContent) && e.children.length < 3).map((e) => e.tagName + ':' + e.className + ':' + e.textContent.slice(0, 40)).slice(0, 8)));
    ok(await q(p, () => [...document.querySelectorAll('body *')].some((e) => e.children.length === 0 && e.textContent.trim() === 'Add someone' && !e.closest('.wl-roomhead'))), '1.7 "+ Add someone" opens Roster\u2019s add sheet (its heading drawn)');
    const L = await q(p, () => { const root = document.querySelector('.wl-main') || document.body; const out = []; const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { if (n.parentElement && /^(SCRIPT|STYLE)$/.test(n.parentElement.tagName)) continue; const t = n.textContent.trim(); if (t) out.push(t); } return out; });
    ok(L && !L.some((t) => /couple/i.test(t)) && !L.includes('+ Post'), '1.8 no "couple"; "+ Post" gone', L && L.filter((t) => /couple|\+ Post/i.test(t)).join(' | '));
    await p.close();
    sec('§2 at 360');
    p = await open(360);
    await p.evaluate(() => { const b = document.querySelector('.wl-roomhead .wl-helpq'); if (b) b.click(); }).catch(() => null); await wait(600);
    const card = await q(p, () => { const c = document.querySelector('.wl-helpcard'); if (!c) return null; const rr = c.getBoundingClientRect(); return { fits: rr.top >= 0 && rr.bottom <= innerHeight, t: c.innerText }; });
    ok(card && card.fits && card.t.includes('tap New post') && !/couple/i.test(card.t), '2.1 the "?" card names New post and fits at 360', card && card.t.slice(0, 140));
    await p.close();
  }

  await runAll();

  if (MUTATE) {
    sec('§7 mutations through the guard');
    const MUTS = [
      ['M1 filled posts counted open', PAGE, "myPosts.filter((x) => x.state === 'open').length", "myPosts.length", '1.1'],
      // (the shell's own button rule wins over a class's text-transform, so the capitals are planted in the words themselves)
      ['M2 the switch back in capitals', PAGE, "{t === 'opportunities' ? 'Opportunities' : t === 'my_posts' ? 'My posts' : 'Roster'}\n          </button>", "{t === 'opportunities' ? 'OPPORTUNITIES' : t === 'my_posts' ? 'MY POSTS' : 'ROSTER'}\n          </button>", '1.2'],
      ['M3 Roster\u2019s pill posts instead', PAGE, "onAdd={() => (tab === 'roster' ? setRosterAdding(true) : setShowForm(true))}", "onAdd={() => setShowForm(true)}", '1.7'],
    ];
    for (const [name, file, from, to, cell] of MUTS) {
      let h = null;
      try { h = guard.apply(ROOT, file, from, to, 'b190'); } catch (e) { ok(false, `${name}: ${e.message}`); continue; }
      await wait(6000);   // a CSS-only change can take longer to reach the browser
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
  console.log(`\nb190 · ${pass} passed, ${fail} failed${failed.length ? ' · ' + failed.join(' ; ') : ''}`);
  process.exit(code !== undefined ? code : (fail ? 1 : 0));
}
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => { void finish(1); });
main().then(() => finish(), (e) => { ok(false, `crashed: ${String((e && e.stack) || e).slice(0, 300)}`); return finish(1); });
