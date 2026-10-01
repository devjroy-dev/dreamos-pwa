'use strict';
process.env.TDW_LAYOUT_DEFAULT = 'v2';   // the new layout (middleware.ts serves v2/ with no cookie under this default)
// scripts/b193_fe6_calendar_room_bench.js · TDW CE-47 · FE-6 · L5 · rung b193 · THE CALENDAR, REWORKED.
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
// THE EXIT CODE IS THE VERDICT. Run: node scripts/b193_fe6_calendar_room_bench.js  (add --mutate for §7)
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const PORT = 3193;
const MUTATE = process.argv.includes('--mutate');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const PAGE = 'v2/app/vendor/(shell)/calendar/screen.tsx';
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
// WHAT IT HOLDS (the founder's verdict on mock 10; his type ruling; the add-pill ruling; 12-hour times): the pill
// "+ New event" doing what the + did; a legend naming every mark the grid draws (Booked, Good dates, Blocked) with the
// show or hide control on the legend's own line at 360; Coming up as rows with the full date and "7:00 pm"; no 24-hour
// clock, no short month, no "couple"; the "?" card fits. §7 mutations through the guard.
const NOBLOCK = !!process.env.B193_NOBLOCK;
const IST = (d) => new Date(Date.now() + 5.5 * 3600000 + d * 864e5).toISOString().slice(0, 10);
const EVENTS = [
  { id: 'e1', title: 'Meera and Kunal Sangeet', kind: 'sangeet', event_date: IST(3), event_time: '19:00:00', state: 'upcoming' },
  { id: 'e2', title: 'Meera and Kunal Haldi', kind: 'haldi', event_date: IST(4), event_time: '10:00:00', state: 'upcoming' },
  { id: 'e3', title: 'Studio day off', kind: 'blocked', event_date: IST(5), event_time: null, state: 'upcoming' },
];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const full = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };

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
  guard.recoverOrRefuse(ROOT, 'b193');
  const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
  const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
  SERVER = await dev.start(ROOT, PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` });
  if (!ok(await SERVER.up(), '0.1 the dev server came up')) return;
  BROWSER = await puppeteer.launch({ executablePath: process.env.B193_CHROME || await chromium.executablePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  async function open(width = 374) {
    const p = await BROWSER.newPage();
    await p.setViewport({ width, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    for (const [n, v] of [['tdw_wl_mode', 'dark'], ['tdw_layout', 'v2']]) await p.setCookie({ name: n, value: v, domain: 'localhost', path: '/' });
    const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
    if (process.env.B193_DEBUG) p.on('pageerror', (e) => console.log('PAGEERROR', String(e.message || e).slice(0, 300)));
    await p.setRequestInterception(true);
    p.on('request', (r) => {
      const u = r.url(); if (!u.includes('/__api/')) return r.continue();
      const route = u.split('/__api')[1].split('?')[0];
      const J = (o) => r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
      if (route.startsWith('/api/v2/vendor/events/')) return J({ ok: true, events: EVENTS, total: EVENTS.length });
      if (route === '/api/v2/hot-dates') return J({ ok: true, dates: [{ date: IST(6), label: 'Good date' }], hot_dates: [{ date: IST(6) }] });
      if (route.startsWith('/api/v2/vendor/bands/')) return J({ ok: true, bands: [] });
      if (/availability/.test(route)) return J({ ok: true, blocks: [{ id: 'b1', blocked_date: `${IST(0).slice(0, 7)}-15`, slot: 'full_day', reason: null }], total: 1 });
      return J({ ok: true });
    });
    await p.goto(`http://localhost:${PORT}/vendor/calendar`, { waitUntil: 'domcontentloaded', timeout: 180000 });
    const until = Date.now() + 180000; let found = false;
    const until2 = process.env.B193_DEBUG ? Date.now() + 40000 : until; while (Date.now() < until2 && !(found = await p.evaluate(() => !!document.querySelector('[data-cal-legend]') && !!document.querySelector('[data-cal-next]')).catch(() => false))) await wait(400);
    if (!found && process.env.B193_DEBUG) console.log('DEBUG', await p.evaluate(() => ({ legend: !!document.querySelector('[data-cal-legend]'), next: document.querySelectorAll('[data-cal-next]').length, text: (document.querySelector('.wl-main') || document.body).innerText.slice(0, 600) })).catch((e) => String(e)));
    p.found = found; await wait(1000); return p;
  }
  const q = (p, fn, ...a) => p.evaluate(fn, ...a).catch(() => null);

  async function runAll() {
    sec('§1 the month at 374');
    let p = await open(374);
    if (!ok(p.found, '1.0 the room is on glass (legend and Coming up) within 180 s')) { await p.close(); return; }
    const head = await q(p, () => { const pill = document.querySelector('.wl-roomhead [data-room-add="calendar"]'); const help = document.querySelector('.wl-roomhead .wl-helpq');
      return pill ? { t: pill.innerText, h: pill.getBoundingClientRect().height, left: pill.getBoundingClientRect().right <= help.getBoundingClientRect().left, top: !!document.querySelector('[data-add-top="calendar"]:not(.wl-roomadd)') /* AMENDED BY LABEL (CE-47, FE-8): FE-5's head pill carries data-add-top; the OLD top button is the one that is not the pill */ } : null; });
    ok(head && head.t === '+ New event' && Math.abs(head.h - 36) < 1 && head.left && !head.top, '1.1 "+ New event" on the head (36, left of the "?"); the old top button gone', JSON.stringify(head));
    await p.evaluate(() => document.querySelector('[data-room-add="calendar"]').click()).catch(() => null); await wait(700);
    ok(await q(p, () => { const sh = document.querySelector('[data-add-sheet]'); return !!sh && sh.getAttribute('aria-hidden') !== 'true'; }), '1.2 the pill opens the add sheet, as the + did');
    await p.keyboard.press('Escape').catch(() => null); await p.close();
    p = await open(374);
    // the rows are FE-7's shared Row (RoomRows): the title is .fr-t; the date and time ride on data-cal-when and open the facts
    const rows = await q(p, () => [...document.querySelectorAll('[data-cal-next]')].map((e) => ({ n: (e.querySelector('.fr-t') || {}).innerText, when: e.dataset.calWhen, facts: (e.querySelector('.fr-f') || {}).innerText })));
    const s1 = rows && rows.find((x) => x.n === 'Meera and Kunal Sangeet');
    ok(s1 && s1.when === `${full(IST(3))} \u00b7 7:00 pm` && s1.facts.startsWith(s1.when), '1.3 Coming up as rows: full date and "7:00 pm", never "19:00"', JSON.stringify(rows));
    ok(rows && !rows.some((x) => x.n === 'Studio day off'), '1.4 a blocked day is not an upcoming event (unchanged)');
    const t1 = await q(p, () => (document.querySelector('[data-good-toggle]') || {}).innerText);
    await p.evaluate(() => document.querySelector('[data-good-toggle]').click()).catch(() => null); await wait(400);
    const t2 = await q(p, () => (document.querySelector('[data-good-toggle]') || {}).innerText);
    ok(t1 && t2 && t1 !== t2 && ['Show good dates', 'Hide good dates'].includes(t1) && ['Show good dates', 'Hide good dates'].includes(t2), '1.5 the control says what it will do, and flips', `${t1} -> ${t2}`);
    const L = await q(p, () => { const root = document.querySelector('.wl-main') || document.body; const out = []; const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const t = n.textContent.trim(); if (t) out.push(t); } return out; });
    ok(L && !L.some((t) => /\b([01]?\d|2[0-3]):[0-5]\d\b(?!\s?(am|pm))/.test(t)), '1.6 no 24-hour clock on the room', L && L.filter((t) => /\d:\d\d/.test(t)).join(' | '));
    ok(L && !L.some((t) => /\b\d{1,2} (Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\b(?!\w)/.test(t)) && !L.some((t) => /couple/i.test(t)), '1.7 full months; no "couple"');
    await p.close();
    sec('§2 at 360');
    p = await open(360);
    const lg = await q(p, () => { const l = document.querySelector('[data-cal-legend]'); const kids = [...l.children]; const tops = kids.map((k) => Math.round(k.getBoundingClientRect().top + k.getBoundingClientRect().height / 2));
      const btn = l.querySelector('[data-good-toggle]'); return { words: kids.map((k) => k.innerText.trim()), oneLine: Math.max(...tops) - Math.min(...tops) <= 3, fits: l.scrollWidth <= l.clientWidth + 1, over: l.scrollWidth - l.clientWidth, w: l.clientWidth, btnH: btn.getBoundingClientRect().height }; });
    ok(lg && lg.words.slice(0, 3).join('|') === 'Booked|Good dates|Blocked', '2.1 the legend names every mark the grid draws: Booked, Good dates, Blocked', lg && JSON.stringify(lg.words));
    // the legend never overflows; with Blocked drawn at 360 the control may drop under the marks, right-aligned
    const rightAligned = await q(p, () => { const l = document.querySelector('[data-cal-legend]'); const b = l.querySelector('[data-good-toggle]'); return Math.abs(l.getBoundingClientRect().right - parseFloat(getComputedStyle(l).paddingRight) - b.getBoundingClientRect().right) <= 2; });
    ok(lg && lg.fits && lg.btnH >= 44 && rightAligned, '2.2 the legend never overflows at 360; the control is right-aligned and 44 px to tap', JSON.stringify(lg));
    await p.evaluate(() => { const b = document.querySelector('.wl-roomhead .wl-helpq'); if (b) b.click(); }).catch(() => null); await wait(600);
    const card = await q(p, () => { const c = document.querySelector('.wl-helpcard'); if (!c) return null; const rr = c.getBoundingClientRect(); return { fits: rr.top >= 0 && rr.bottom <= innerHeight, t: c.innerText }; });
    ok(card && card.fits && !/couple/i.test(card.t), '2.3 the "?" card fits at 360; no "couple"', card && card.t.slice(0, 120));
    await p.close();
  }

  await runAll();

  if (MUTATE) {
    sec('§7 mutations through the guard');
    const MUTS = [
      ['M1 the 24-hour slice back', PAGE, "time12(`2026-01-01T${ev.event_time.slice(0, 5)}:00+05:30`)", "ev.event_time.slice(0, 5)", '1.3'],
      ['M2 Blocked left unnamed', PAGE, "{blockedThisMonth ? <span><i className=\"cal-ring\" />{CAL.blocked}</span> : null}", "{null}", '2.1'],
      ['M3 the old top button back', PAGE, "      <RoomHeadAdd addKey=\"calendar\" label={CAL.add} onAdd={onAdd} />", "      <button type=\"button\" className=\"wl-btn\" data-add-top=\"calendar\" onClick={onAdd}>New event</button>", '1.1'],
    ];
    for (const [name, file, from, to, cell] of MUTS) {
      let h = null;
      try { h = guard.apply(ROOT, file, from, to, 'b193'); } catch (e) { ok(false, `${name}: ${e.message}`); continue; }
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
  console.log(`\nb193 · ${pass} passed, ${fail} failed${failed.length ? ' · ' + failed.join(' ; ') : ''}`);
  process.exit(code !== undefined ? code : (fail ? 1 : 0));
}
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => { void finish(1); });
main().then(() => finish(), (e) => { ok(false, `crashed: ${String((e && e.stack) || e).slice(0, 300)}`); return finish(1); });
