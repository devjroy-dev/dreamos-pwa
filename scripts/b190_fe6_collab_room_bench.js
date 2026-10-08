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
const BEFORE = 'v2/components/vendor/hub/CollabRoomBefore.tsx';   // today's room, a32fbf4e's screen byte for byte (Rule 1)
const CLOCK = 'v2/lib/worklist/clockStandIn.ts';
const guard = require(path.join(ROOT, 'scripts/lib/mutation_guard.js'));

let pass = 0; let fail = 0; let quiet = false; let evidence = 0; let underMut = ''; let redNames = [];
const failed = [];
const fmt = (info) => (info === undefined ? '' : '  [' + String(info).slice(0, 240) + ']');
function ok(c, name, info) {
  if (c) { pass += 1; if (!quiet) console.log(`  PASS  ${name}`); return true; }
  if (quiet) { evidence += 1; redNames.push(name); console.log(`  red under ${underMut}  ${name}${fmt(info)}`); return false; }
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
// CE-47 HUB-2, AMENDED BY LABEL (the chair's ruling, 7 Oct 2026): the tabs are Work | People | Mine, opening on Work; the
// Roster tab and "+ Add someone" leave; "+ New post" is the pill on every tab; Mine carries a count when something waits
// for her answer. Cells 1.0, 1.1, 1.2, 1.4, 1.5, 1.6, 1.7 and mutations M1 to M3 move to the new room; 1.3, 1.8, 2.1 and
// the stop keep their checks. The moved cells wait on conditions, never fixed pauses (e-275).
// RULE 1 (the chair's ruling (a), 7 Oct 2026), amended by label again, BOTH ROOMS: the Hub shows only when GET /hub/me
// says hub_open. §1 is an open vendor (the Hub). §1b is a closed vendor: today's room, CollabRoomBefore.tsx (a32fbf4e's
// screen byte for byte), held by a32fbf4e's own cells 1.0 to 1.8 verbatim as 1b.0 to 1b.8, plus 1b.9 (she never sees
// Work | People | Mine). §1c: an unreadable hub_open draws today's room. Mutations: N1-N3 the Hub, B1-B3 today's room
// (a32fbf4e's M1-M3, now aimed at CollabRoomBefore.tsx), G1-G2 the gate. §1d (lesson 2): a thin answer, N4.
const POSTS = [{ id: 'c1', state: 'open', requirement_type: 'second_shooter', city: 'Delhi', event_date: '2026-12-12', budget_inr: 15000, interested_count: 3, items: [] },
  { id: 'c2', state: 'filled', requirement_type: 'hair_stylist', city: 'Jaipur', event_date: '2027-02-14', budget_inr: 8000, interested_count: 1, items: [] }];
const FEED = [{ id: 'f1', state: 'open', requirement_type: 'second_shooter', city: 'Noida', event_date: '2026-11-08', budget_inr: 12000, items: [], vendor: { name: 'Rohit Films' } }];
const ROSTER = [{ id: 'r1', name: 'Rhea Sharma', phone: '+919811100010', crafts: ['photographer'] }, { id: 'r2', name: 'Kabir Anand', phone: '+919811100011', crafts: ['cinematographer'] }];
// HUB-2's doors (shapes as dream-os src/api/vendor/hub.js returns them)
const CARD = (id, kind, name, handle, extra = {}) => ({ id, kind, name, handle, roles: ['photographer'], city: 'Delhi', open_to_words: [], instagram: { handle, url: `https://www.instagram.com/${handle}/` }, website: null, page_url: `https://thedreamwedding.in/c/${handle}`, work: [], worked_with: 1, worked_with_words: 'Worked with 1 person', in_my_people: false, why: null, why_words: null, can_add: kind === 'vendor', can_take_off: false, ...extra });
const HUB_PEOPLE = [CARD('pv', 'vendor', 'Aman Frames', 'amanframes'), CARD('pp', 'person', 'Tara Sen', 'tarasen.clicks', { worked_with: 0, worked_with_words: 'New on Collab Hub' }), CARD('po', 'org', 'Starlight Talent', 'starlight.talent')];
const HUB_WORK = { ok: true, city: 'Delhi', roles: ['photographer'], all_cities: false, items: [{ kind: 'call', id: 'w1', from: 'Kabir Lens', roles: [{ role: 'photographer', needed: 1 }], event_date: '2026-11-08', city: 'Delhi', pay_kind: 'credit_only', budget_inr: null, details: 'Studio portrait shoot', instagram: null, website: null, page_url: 'https://thedreamwedding.in/c/kabirlens' }], not_yet: ['briefs from brands', 'paid jobs from planners', 'calls posted on Threads'] };   // HUB-2d: the server's words
// HUB-2d: her calls carry the server's title (dream-os src/lib/hub/title.js), as the server sends them
const HUB_MINE = { ok: true, my_calls: [{ id: 'c1', title: 'Photography needed', event_date: '2026-12-12', city: 'Delhi', details: 'Rooftop editorial', state: 'open', interested: 3, picked: 0, sent_by_tdw: false, line: null }, { id: 'c2', title: 'Decor needed', event_date: '2026-12-14', city: 'Delhi', details: null, state: 'open', interested: 0, picked: 0, sent_by_tdw: false, line: null }], applied: [], waiting_for_your_yes: [{ id: 'k1', from: { name: 'Aman Frames', page_url: 'https://thedreamwedding.in/c/amanframes' }, shoot_words: 'Summer colour shoot \u00b7 Noida \u00b7 July 2026' }], worked_with: [], shoot_requests_left: 20, waiting_count: 2 };

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
  const HUB_ME = { open: { ok: true, hub_open: true, page: { city: 'Delhi' } }, closed: { ok: true, hub_open: false, line: 'Collab Hub is not open for your account yet.' }, thin: { ok: true, hub_open: true } };
  async function open(width = 374, mode = 'open') {
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
      // thin: the chair's lesson 2 (7 Oct 2026): every Hub door answers { ok: true } with no lists
      if (mode === 'thin' && /^\/api\/v2\/vendor\/hub\//.test(route) && route !== '/api/v2/vendor/hub/me') return J({ ok: true });
      if (route === '/api/v2/vendor/hub/work') return J(HUB_WORK);
      if (route === '/api/v2/vendor/hub/people') return J({ ok: true, people: HUB_PEOPLE, line: 'No messages inside TDW.' });
      if (route === '/api/v2/vendor/hub/mine') return J(HUB_MINE);
      if (route === '/api/v2/vendor/hub/me') return mode === 'unreadable' ? r.respond({ status: 500, contentType: 'text/plain', body: 'not json' }) : J(HUB_ME[mode]);
      if (/requirement-types|requirement_types/.test(route)) return J({ ok: true, requirement_types: ['second_shooter', 'hair_stylist', 'photographer'] });
      return J({ ok: true });
    });
    await p.goto(`http://localhost:${PORT}/vendor/collab`, { waitUntil: 'domcontentloaded', timeout: 180000 });
    const until = Date.now() + 180000; let found = false;
    if (mode === 'thin') {
      while (Date.now() < until && !(found = await p.evaluate(() => !!document.querySelector('[data-collab-gate="open"]') && !!document.querySelector('[data-hub-work]') && document.querySelectorAll('[data-collab-tabs] button').length === 3).catch(() => false))) await wait(400);
      p.found = found; return p;
    }
    if (mode === 'open') {
      while (Date.now() < until && !(found = await p.evaluate(() => !!document.querySelector('[data-collab-gate="open"]') && !!document.querySelector('[data-collab-tabs]') && !!document.querySelector('[data-hub-call]') && document.querySelectorAll('[data-collab-tabs] button').length === 3).catch(() => false))) await wait(400);
      p.found = found; return p;
    }
    // today's room: a32fbf4e's own wait, verbatim (its line reads "My posts ...")
    while (Date.now() < until && !(found = await p.evaluate(() => !!document.querySelector('[data-collab-line]') && /My posts/.test(document.querySelector('[data-collab-line]').innerText)).catch(() => false))) await wait(400);
    p.found = found; await wait(900); return p;
  }
  // e-275: wait on the condition itself, bounded; never a fixed pause.
  async function untilTrue(p, fn, ms = 20000, arg) { const end = Date.now() + ms; while (Date.now() < end) { if (await p.evaluate(fn, arg).catch(() => false)) return true; await wait(150); } return false; }
  const q = (p, fn, ...a) => p.evaluate(fn, ...a).catch(() => null);
  const tab = (p, t) => p.evaluate((t) => { const b = [...document.querySelectorAll('[data-collab-tabs] button')].find((x) => x.innerText.trim() === t || x.getAttribute('data-collab-tab') === t.toLowerCase().split(' ')[0]); if (b) b.click(); }, t).catch(() => null);
  const line = (p) => q(p, () => (document.querySelector('[data-collab-line]') || {}).innerText);
  const pill = (p) => q(p, () => { const e = document.querySelector('.wl-roomhead [data-room-add="collab"]'); return e ? e.innerText : null; });

  async function runAll() {
    sec('§1 the three tabs (HUB-2: Work | People | Mine)');
    let p = await open(374);
    if (!ok(p.found, '1.0 the room is on glass within 180 s, opening on Work with its call')) { await p.close(); return; }
    const on = (p) => q(p, () => { const b = document.querySelector('[data-collab-tabs] button[aria-pressed="true"]'); return b ? b.innerText.trim() : null; });
    ok((await on(p)) === 'Work' && !!(await q(p, () => !!document.querySelector('[data-hub-work-line]'))) && (await pill(p)) === '+ New post', '1.1 the room opens on Work, with its line, and the pill is "+ New post"', `${await on(p)} | ${await pill(p)}`);
    await untilTrue(p, () => /Mine \u00b7 2/.test(document.querySelector('[data-collab-tabs]').innerText), 8000);
    const seg = await q(p, () => [...document.querySelectorAll('[data-collab-tabs] button')].map((b) => [b.innerText.trim(), b.getBoundingClientRect().height, getComputedStyle(b).textTransform]));
    ok(seg && seg.map((x) => x[0]).join('|') === 'Work|People|Mine \u00b7 2' && seg.every((x) => x[1] >= 44 && x[2] !== 'uppercase' && x[0] !== x[0].toUpperCase()), '1.2 one switch in sentence case, 44 px: Work | People | Mine · 2', JSON.stringify(seg));
    await p.evaluate(() => document.querySelector('[data-room-add="collab"]').click()).catch(() => null);
    ok(await untilTrue(p, () => document.querySelectorAll('[role=dialog], form, [data-collab-form]').length > 0), '1.3 "+ New post" opens the post form, as "+ Post" did');
    await p.close(); p = await open(374);
    await tab(p, 'People');
    const peopleUp = await untilTrue(p, () => document.querySelectorAll('[data-hub-card]').length === 3);
    const adds = await q(p, () => [...document.querySelectorAll('[data-hub-card]')].map((c) => [c.getAttribute('data-hub-card'), !!c.querySelector('[data-hub-add]')]));
    ok(peopleUp && JSON.stringify(adds) === JSON.stringify([['vendor', true], ['person', false], ['org', false]]) && (await pill(p)) === '+ New post', '1.4 People: "Add to my people" on the vendor only, never on a person or an organisation; the same pill', JSON.stringify(adds));
    await tab(p, 'Mine');
    ok(await untilTrue(p, () => !!document.querySelector('[data-hub-mine]') && !!document.querySelector('[data-hub-your-yes]') && /Mine \u00b7 2/.test(document.querySelector('[data-collab-tabs]').innerText), 8000) && (await on(p)) === 'Mine \u00b7 2' && (await pill(p)) === '+ New post', '1.5 Mine: the count of what waits for her ("Mine · 2"), her request to confirm drawn, the same pill', `${await on(p)} | ${await pill(p)}`);
    // HUB-2d · the founder's walk (8 Oct 2026)
    const mineRows = await q(p, () => [...document.querySelectorAll('[data-hub-mine] .hub-rowbtn .hub-name')].map((e) => e.innerText.trim()));
    const mineText = await q(p, () => (document.querySelector('[data-hub-mine]') || {}).innerText || '');
    ok(mineRows && mineRows.join('|') === 'Photography needed|Decor needed' && /Rooftop editorial/.test(mineText || '') && !/\bA call\b/.test(mineText || ''),
      '1.9 Mine titles each call by its role ("Decor needed"), never "A call"; her details beside the title (HUB-2d)', JSON.stringify(mineRows));
    const fill = await q(p, () => { const probe = document.createElement('i'); probe.style.background = 'var(--role-primary)'; probe.style.color = 'var(--role-on-primary)';
      document.querySelector('[data-collab-tabs]').appendChild(probe); const want = [getComputedStyle(probe).backgroundColor, getComputedStyle(probe).color]; probe.remove();
      return [...document.querySelectorAll('[data-collab-tabs] button')].map((b) => [b.getAttribute('aria-pressed'), getComputedStyle(b).backgroundColor, getComputedStyle(b).color, getComputedStyle(b).boxShadow]).concat([want]); });
    const want = fill && fill[fill.length - 1]; const btns = fill ? fill.slice(0, -1) : [];
    ok(want && btns.length === 3 && btns.filter((b) => b[0] === 'true').every((b) => b[1] === want[0] && b[2] === want[1] && (b[3] === 'none' || !b[3]))
      && btns.filter((b) => b[0] === 'false').every((b) => b[1] !== want[0]),
      '1.10 the chosen tab is filled with the primary, its words in the on-primary colour; the others are not (HUB-2d; F-44.367, veto 54)', JSON.stringify(fill));
    await tab(p, 'Work');
    const ny = await untilTrue(p, () => [...document.querySelectorAll('[data-hub-work] .hub-small')].some((e) => e.innerText.trim() === 'This list does not yet include briefs from brands, paid jobs from planners or calls posted on Threads.'), 8000);
    ok(ny, '1.11 Work says in one sentence what the list does not yet include, all lower case, "a, b or c" (HUB-2d: "From Threads" was a slip; R-47.1)', await q(p, () => [...document.querySelectorAll('[data-hub-work] .hub-small')].map((e) => e.innerText.trim()).join(' | ')));
    await tab(p, 'Mine');
    await untilTrue(p, () => !!document.querySelector('[data-hub-shoot-open]') && !!document.querySelector('[data-hub-your-yes]'), 8000);   // Mine re-read before 1.6 and 1.7
    ok(await q(p, () => !/\bRoster\b/.test(document.body.innerText) && ![...document.querySelectorAll('button, a')].some((b) => /Add someone/.test(b.innerText))), '1.6 no Roster tab and no "Add someone" anywhere in the room');
    await p.evaluate(() => { const b = document.querySelector('[data-hub-shoot-open]'); if (b) b.click(); }).catch(() => null);
    ok(await untilTrue(p, () => !!document.querySelector('[data-hub-shoot-sheet]') && /A shoot we did together/.test(document.querySelector('[data-hub-shoot-sheet]').innerText)), '1.7 "+ A shoot we did together" in Mine opens its sheet (its heading drawn)');
    const L = await q(p, () => { const root = document.querySelector('.wl-main') || document.body; const out = []; const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { if (n.parentElement && /^(SCRIPT|STYLE)$/.test(n.parentElement.tagName)) continue; const t = n.textContent.trim(); if (t) out.push(t); } return out; });
    ok(L && !L.some((t) => /couple/i.test(t)) && !L.includes('+ Post'), '1.8 no "couple"; "+ Post" gone', L && L.filter((t) => /couple|\+ Post/i.test(t)).join(' | '));
    await p.close();
    sec('§1b a closed vendor: today\u2019s room, a32fbf4e\u2019s cells verbatim');
    p = await open(374, 'closed');
    if (!ok(p.found, '1b.0 the room is on glass within 180 s')) { await p.close(); }
    else {
    ok((await line(p)) === 'My posts \u00b7 1 open' && (await pill(p)) === '+ New post', '1b.1 My posts: "My posts · 1 open" (filled left out) and "+ New post" (V1, V2)', `${await line(p)} | ${await pill(p)}`);
    const seg = await q(p, () => [...document.querySelectorAll('[data-collab-tabs] button')].map((b) => [b.innerText.trim(), b.getBoundingClientRect().height, getComputedStyle(b).textTransform]));
    ok(seg && seg.map((x) => x[0]).join('|') === 'My posts|Opportunities|Roster' && seg.every((x) => x[1] >= 44 && x[2] !== 'uppercase'), '1b.2 one switch in sentence case, 44 px', JSON.stringify(seg));
    await p.evaluate(() => document.querySelector('[data-room-add="collab"]').click()).catch(() => null); await wait(800);
    ok(await q(p, () => document.querySelectorAll('[role=dialog], form, [data-collab-form]').length > 0 || /Post/.test(document.body.innerText.slice(0, 4000))), '1b.3 "+ New post" opens the post form, as "+ Post" did');
    await p.close(); p = await open(374, 'closed');
    await tab(p, 'Opportunities'); await wait(600);
    ok((await line(p)) === 'Opportunities \u00b7 1 new' && (await pill(p)) === '+ New post', '1b.4 Opportunities: its line; the same pill');
    await tab(p, 'Roster'); await wait(600);
    ok((await line(p)) === 'Roster \u00b7 2 people' && (await pill(p)) === '+ Add someone', '1b.5 Roster: "Roster · 2 people" and "+ Add someone"', `${await line(p)} | ${await pill(p)}`);
    ok(await q(p, () => ![...document.querySelectorAll('.wl-main button')].some((b) => b.innerText.trim() === 'Add someone' && !b.closest('.wl-roomhead'))), '1b.6 no second add in the Roster body');
    await p.evaluate(() => document.querySelector('[data-room-add="collab"]').click()).catch(() => null); await wait(700);
    if (process.env.B190_DEBUG) console.log('DEBUG', await q(p, () => document.body.innerText.slice(0, 300)), await q(p, () => [...document.querySelectorAll('body *')].filter((e) => /Add someone/.test(e.textContent) && e.children.length < 3).map((e) => e.tagName + ':' + e.className + ':' + e.textContent.slice(0, 40)).slice(0, 8)));
    ok(await q(p, () => [...document.querySelectorAll('body *')].some((e) => e.children.length === 0 && e.textContent.trim() === 'Add someone' && !e.closest('.wl-roomhead'))), '1b.7 "+ Add someone" opens Roster\u2019s add sheet (its heading drawn)');
    const L = await q(p, () => { const root = document.querySelector('.wl-main') || document.body; const out = []; const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { if (n.parentElement && /^(SCRIPT|STYLE)$/.test(n.parentElement.tagName)) continue; const t = n.textContent.trim(); if (t) out.push(t); } return out; });
    ok(L && !L.some((t) => /couple/i.test(t)) && !L.includes('+ Post'), '1b.8 no "couple"; "+ Post" gone', L && L.filter((t) => /couple|\+ Post/i.test(t)).join(' | '));
    ok(await q(p, () => !document.querySelector('[data-hub-work],[data-hub-people],[data-hub-mine],[data-collab-gate="open"]') && ![...document.querySelectorAll('[data-collab-tabs] button')].some((b) => /^(Work|People|Mine)/.test(b.innerText.trim()))), '1b.9 a closed vendor never sees Work | People | Mine');
    await p.close();
    }
    sec('§1d a thin answer (the chair\u2019s lesson 2): every Hub door says { ok: true } with no lists');
    p = await open(374, 'thin');
    let thinOk = p.found;
    for (const t of ['People', 'Mine']) { if (!thinOk) break; await tab(p, t); thinOk = await untilTrue(p, (tt) => !!document.querySelector(tt === 'People' ? '[data-hub-people]' : '[data-hub-mine]'), 8000, t); }
    ok(thinOk && await q(p, () => !/Application error|Unhandled Runtime Error/i.test(document.body.innerText) && document.querySelectorAll('[data-collab-tabs] button').length === 3), '1d.1 the Hub survives a thin answer: Work, People and Mine each draw, nothing crashes');
    await p.close();
    sec('§1c hub_open unreadable');
    p = await open(374, 'unreadable');
    ok(p.found && await q(p, () => !!document.querySelector('[data-collab-gate="closed"]') && /My posts\|Opportunities\|Roster/.test([...document.querySelectorAll('[data-collab-tabs] button')].map((b) => b.innerText.trim()).join('|'))), '1c.1 an unreadable hub_open (a 500, not JSON) draws today\u2019s room');
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
    // F-44.419 (CE-47 lesson 5, 8 Oct 2026): the series refuses to start below 1 GB free (the dev server writes .next as it goes)
    { const st = fs.statfsSync(ROOT); const free = st.bavail * st.bsize;
      if (!ok(free >= 1024 * 1024 * 1024, `7.0 free space before the series: ${Math.floor(free / 1048576)} MB (at least 1024 MB)`)) { await finish(1); return; } }
    const MUTS = [
      // HUB-2 (amended by label): the count, the capitals, and "Add" on a person
      ['N1 Mine loses its count', PAGE, ": COL.mineWaiting(waiting));", ": COL.mine);", '1.5'],
      // (the shell's own button rule wins over a class's text-transform, so the capitals are planted in the words themselves)
      ['N2 the switch back in capitals', PAGE, "            {label(t)}\n          </button>", "            {label(t).toUpperCase()}\n          </button>", '1.2'],
      ['N3 "Add to my people" drawn on a person', 'v2/components/vendor/hub/HubPeople.tsx', "              {p.can_add && (", "              {(p.can_add || p.kind !== 'vendor') && (", '1.4'],
      // HUB-2d: the founder's walk
      ['H1 the chosen tab back to a thin underline', PAGE, ".col-seg button.on{background:var(--role-primary);color:var(--role-on-primary)}", ".col-seg button.on{background:var(--atelier-card-bg);color:var(--atelier-ink);box-shadow:inset 0 -2px 0 var(--atelier-accent-text)}", '1.10'],
      ['H2 Mine titles a call by its details again', 'v2/components/vendor/hub/HubMine.tsx', "{c.title || c.details || HUB.mine.untitled}", "{c.details || 'A call'}", '1.9'],
      ['H3 the list joined with commas only', 'v2/lib/vendor/hub.ts', "${xs.length > 1 ? `${xs.slice(0, -1).join(', ')} or ${xs[xs.length - 1]}` : xs.join('')}", "${xs.join(', ')}", '1.11'],
      ['N4 Work trusts a thin answer', 'v2/components/vendor/hub/HubWork.tsx', "      setItems(arr(d.items));", "      setItems(d.items);", '1d.1'],
      // today's room: a32fbf4e's own M1 to M3, aimed at the file the code moved to (byte for byte)
      ['B1 filled posts counted open', BEFORE, "myPosts.filter((x) => x.state === 'open').length", "myPosts.length", '1b.1'],
      ['B2 the old switch back in capitals', BEFORE, "{t === 'opportunities' ? 'Opportunities' : t === 'my_posts' ? 'My posts' : 'Roster'}\n          </button>", "{t === 'opportunities' ? 'OPPORTUNITIES' : t === 'my_posts' ? 'MY POSTS' : 'ROSTER'}\n          </button>", '1b.2'],
      ['B3 Roster\u2019s pill posts instead', BEFORE, "onAdd={() => (tab === 'roster' ? setRosterAdding(true) : setShowForm(true))}", "onAdd={() => setShowForm(true)}", '1b.7'],
      // the gate
      // (a closed vendor shown the Hub never reaches today's room, so its load cell is the one that reds)
      ['G1 the Hub shown without hub_open', PAGE, "const open = !!d && d.ok === true && d.hub_open === true;", "const open = !!d && d.ok === true;", '1b.0'],
      // (getJson answers a 500 or non-JSON with ok:false rather than throwing, so the gate's own test is mutated)
      ['G2 an unreadable answer opens the Hub', PAGE, "        setGate(open ? 'open' : 'closed');", "        setGate(open || !d || d.ok !== true ? 'open' : 'closed');", '1c.1'],
    ];
    for (const [name, file, from, to, cell] of MUTS) {
      let h = null;
      const orig = fs.readFileSync(path.join(ROOT, file), 'utf8');
      try { h = guard.apply(ROOT, file, from, to, 'b190'); } catch (e) {
        // F-44.419: a write that failed part way (a full disk) may have emptied the file: put the original back, by sha
        const abs = path.join(ROOT, file); let put = fs.readFileSync(abs, 'utf8') === orig;
        if (!put) { try { fs.writeFileSync(abs, orig); put = fs.readFileSync(abs, 'utf8') === orig; } catch (_e) { put = false; } }
        ok(false, `${name}: ${e.message}${put ? '' : ' \u00b7 THE FILE IS NOT THE ORIGINAL: put it back from git'}`); continue;
      }
      await wait(6000);   // a CSS-only change can take longer to reach the browser
      const before = evidence; quiet = true; underMut = name.split(' ')[0]; const passBefore = pass; let crashed = null;
      // HUB-2d (e-275): the dev server may still be compiling the previous restore (hub.ts, read by every Hub file, made N4
      // miss once on 8 Oct: no cell red at all). So the series waits on the thing itself: it reads the room again, at most
      // three times, until the named cell is red, asking the server for the page between reads so the compile is done first.
      for (let round = 0; round < 3; round += 1) {
        redNames = [];
        if (round) { try { await fetch(`http://localhost:${PORT}/vendor/collab`, { signal: AbortSignal.timeout(180000) }); } catch (_e) { /* the next read says what it sees */ } }
        try { await runAll(); } catch (e) { crashed = e; break; }
        if (redNames.some((n) => n.startsWith(cell + ' '))) break;
      }
      quiet = false; pass = passBefore;
      const back = h.restore();
      if (crashed) ok(false, `${name} crashed: ${String(crashed.message || crashed).slice(0, 160)}`);
      // HUB-2 amendment: the NAMED cell must be among the reds (a red elsewhere, e.g. the load cell, does not count)
      else ok(evidence > before && redNames.some((n) => n.startsWith(cell + ' ')) && back, `${name} \u2192 ${cell} RED; restored by sha`, redNames.join(' / '));
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
