'use strict';
process.env.TDW_LAYOUT_DEFAULT = 'v2';   // the new layout (middleware.ts serves v2/ with no cookie under this default)
// scripts/b192_fe6_team_room_bench.js · TDW CE-47 · FE-6 · L5 · rung b192 · THE TEAM ROOM, REWORKED.
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
// THE EXIT CODE IS THE VERDICT. Run: node scripts/b192_fe6_team_room_bench.js  (add --mutate for §7)
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const PORT = 3192;
const MUTATE = process.argv.includes('--mutate');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const PAGE = 'v2/components/worklist/TeamTabs.tsx';
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
// WHAT IT HOLDS (the founder's verdict on mock 8, V7; the add-pill ruling "+ Add to Team / Tasks / Payments"): the pill on
// the room head by the tab, doing what the + did; the tab's one line (Members · N, Tasks · N open, Owed · Rs X, summed from
// the payments still owed); the new task's due date said in words under its native field; no "couple"; the "?" card fits.
const MEMBERS = [{ id: 'm1', name: 'Rhea Sharma', role: 'Second shooter', phone: '+919811100010', day_rate_inr: 9000 }, { id: 'm2', name: 'Arjun Verma', role: 'Cinematographer', phone: '+919811100011', day_rate_inr: 9000 }];
const TASKS = [{ id: 't1', title: 'Edit the Haldi photos', state: 'open', due_date: '2026-10-05', assignee_id: 'm1' }, { id: 't2', title: 'Send the teaser', state: 'in_progress', due_date: '2026-10-03', assignee_id: 'm2' }, { id: 't3', title: 'Back up the cards', state: 'done', due_date: '2026-09-30', assignee_id: 'm1' }];
const PAYS = [{ id: 'p1', member_id: 'm1', amount_inr: 18000, state: 'owed', paid_at: null }, { id: 'p2', member_id: 'm2', amount_inr: 9000, state: 'paid', paid_at: '2026-09-28T00:00:00Z' }, { id: 'p3', member_id: 'm2', amount_inr: 4500, state: 'owed', paid_at: null }];

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
  guard.recoverOrRefuse(ROOT, 'b192');
  const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
  const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
  SERVER = await dev.start(ROOT, PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` });
  if (!ok(await SERVER.up(), '0.1 the dev server came up')) return;
  BROWSER = await puppeteer.launch({ executablePath: process.env.B192_CHROME || await chromium.executablePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  async function open(width = 374) {
    const p = await BROWSER.newPage();
    await p.setViewport({ width, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    for (const [n, v] of [['tdw_wl_mode', 'dark'], ['tdw_layout', 'v2']]) await p.setCookie({ name: n, value: v, domain: 'localhost', path: '/' });
    const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
    await p.setRequestInterception(true);
    p.on('request', (r) => {
      const u = r.url(); if (!u.includes('/__api/')) return r.continue();
      const route = u.split('/__api')[1].split('?')[0];
      const J = (o) => r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
      if (route === '/api/v2/vendor/studio/team') return J({ ok: true, members: MEMBERS });
      if (route === '/api/v2/vendor/studio/tasks') return J({ ok: true, tasks: TASKS });
      if (route === '/api/v2/vendor/studio/team-payments') return J({ ok: true, payments: PAYS });
      if (/by-wedding|by_wedding/.test(route)) return J({ ok: true, weddings: [], loose: { payments: [] } });
      return J({ ok: true, assignments: [], functions: [] });
    });
    await p.goto(`http://localhost:${PORT}/vendor/team`, { waitUntil: 'domcontentloaded', timeout: 180000 });
    const until = Date.now() + 180000; let found = false;
    while (Date.now() < until && !(found = await p.evaluate(() => !!document.querySelector('[data-team-line]') && /Members/.test(document.querySelector('[data-team-line]').innerText)).catch(() => false))) await wait(400);
    p.found = found; await wait(900); return p;
  }
  const q = (p, fn, ...a) => p.evaluate(fn, ...a).catch(() => null);
  const tab = (p, t) => p.evaluate((t) => { const b = [...document.querySelectorAll('.wl-tab')].find((x) => x.innerText.trim() === t); if (b) b.click(); }, t).catch(() => null);
  const line = (p) => q(p, () => (document.querySelector('[data-team-line]') || {}).innerText);
  const pill = (p) => q(p, () => { const e = document.querySelector('.wl-roomhead [data-room-add="team"]'); return e ? e.innerText : null; });

  async function runAll() {
    sec('§1 the three tabs');
    let p = await open(374);
    if (!ok(p.found, '1.0 the room is on glass within 180 s')) { await p.close(); return; }
    ok((await line(p)) === 'Members \u00b7 2' && (await pill(p)) === '+ Add to Team', '1.1 Team: "Members · 2" and "+ Add to Team" on the head', `${await line(p)} | ${await pill(p)}`);
    await tab(p, 'Tasks'); await wait(900);
    ok((await line(p)) === 'Tasks \u00b7 2 open' && (await pill(p)) === '+ Add to Tasks', '1.2 Tasks: "Tasks · 2 open" (done left out) and "+ Add to Tasks"', `${await line(p)} | ${await pill(p)}`);
    await p.evaluate(() => document.querySelector('[data-room-add="team"]').click()).catch(() => null); await wait(700);
    await p.evaluate(() => { const i = document.querySelector('input[type="date"]'); if (!i) return; const d = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value'); d.set.call(i, '2026-10-24'); i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true })); }).catch(() => null);
    await wait(500);
    ok((await q(p, () => (document.querySelector('[data-date-words]') || {}).innerText)) === '24 October 2026', '1.3 the new task\u2019s due date said in words under the field');
    await p.close(); p = await open(374);
    await tab(p, 'Payments'); await wait(900);
    ok((await line(p) || '').replace(/\u00a0/g, ' ') === 'Owed \u00b7 Rs 22,500' && (await pill(p)) === '+ Add to Payments', '1.4 Payments: "Owed · Rs 22,500" (the two still owed) and "+ Add to Payments"', `${await line(p)} | ${await pill(p)}`);
    const L = await q(p, () => { const root = document.querySelector('.wl-main') || document.body; const out = []; const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const t = n.textContent.trim(); if (t) out.push(t); } return out; });
    ok(L && !L.some((t) => /couple/i.test(t)) && !(await q(p, () => !!document.querySelector('[data-add-top="team"]:not(.wl-roomadd)') /* AMENDED BY LABEL (CE-47, FE-8): FE-5's head pill carries data-add-top; the OLD top button is the one that is not the pill */)), '1.5 no "couple"; the old top button is gone');
    await p.close();
    sec('§2 at 360');
    p = await open(360);
    const hd = await q(p, () => { const pl = document.querySelector('[data-room-add="team"]'); const t = document.querySelector('.wl-roomhead [data-room-title]'); if (!pl || !t) return null; const a = pl.getBoundingClientRect(), b = t.getBoundingClientRect(); return { whole: t.scrollWidth <= t.clientWidth + 1, overlap: !(a.left >= b.right || a.right <= b.left || a.top >= b.bottom || a.bottom <= b.top) }; });
    ok(hd && hd.whole && !hd.overlap, '2.1 at 360 the title is whole and the pill overlaps nothing', JSON.stringify(hd));
    await p.evaluate(() => { const b = document.querySelector('.wl-roomhead .wl-helpq'); if (b) b.click(); }).catch(() => null); await wait(600);
    const card = await q(p, () => { const c = document.querySelector('.wl-helpcard'); if (!c) return null; const rr = c.getBoundingClientRect(); return { fits: rr.top >= 0 && rr.bottom <= innerHeight, t: c.innerText }; });
    ok(card && card.fits && !/couple/i.test(card.t), '2.2 the "?" card fits at 360', card && card.t.slice(0, 120));
    await p.close();
  }

  await runAll();

  if (MUTATE) {
    sec('§7 mutations through the guard');
    const MUTS = [
      ['M1 paid payments counted as owed', PAGE, "rawPayments.filter((p) => p.state === 'owed')", "rawPayments", '1.4'],
      ['M2 no date in words', 'v2/components/worklist/StudioSheets.tsx', "{dateWords(draft.dueDate) ? <p", "{false ? <p", '1.3'],
      ['M3 the top button back', PAGE, "      <RoomHeadAdd addKey=\"team\" label={ADD_TO[tab]} onAdd={onFab} />", "      <button type=\"button\" className=\"wl-btn\" data-add-top=\"team\" onClick={onFab}>{ADD_TO[tab]}</button>", '1.1'],
    ];
    for (const [name, file, from, to, cell] of MUTS) {
      let h = null;
      try { h = guard.apply(ROOT, file, from, to, 'b192'); } catch (e) { ok(false, `${name}: ${e.message}`); continue; }
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
  console.log(`\nb192 · ${pass} passed, ${fail} failed${failed.length ? ' · ' + failed.join(' ; ') : ''}`);
  process.exit(code !== undefined ? code : (fail ? 1 : 0));
}
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => { void finish(1); });
main().then(() => finish(), (e) => { ok(false, `crashed: ${String((e && e.stack) || e).slice(0, 300)}`); return finish(1); });
