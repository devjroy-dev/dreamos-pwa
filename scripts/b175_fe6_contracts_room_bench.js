'use strict';
process.env.TDW_LAYOUT_DEFAULT = 'v2';   // the new layout (middleware.ts serves v2/ with no cookie under this default)
// scripts/b175_fe6_contracts_room_bench.js · TDW CE-47 · FE-6 · L3 · rung b175 · THE CONTRACTS ROOM, REWORKED.
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
// THE EXIT CODE IS THE VERDICT. Run: node scripts/b175_fe6_contracts_room_bench.js  (add --mutate for §7)
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const PORT = 3175;
const MUTATE = process.argv.includes('--mutate');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const PAGE = 'v2/app/vendor/(shell)/contracts/screen.tsx';
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
// WHAT IT HOLDS (the founder's verdict on FE-6's mock; W2, W4, W9; the chair's pill; the sprint's rules):
//   §1 the room: "+ New contract" on the head; the count line; the policies as one row; agreements as rows (name /
//      function · full date · Rs / one pill, at most two fact lines measured at 374 and 360); no floating +.
//   §2 an agreement's own page: back, status (W4), one next action, Dates in full months with 12-hour times, Money.
//   §3 cancel is last and asks first; only the confirm calls the door.
//   §4 the whole room: full months, no 24-hour clock, no "couple", 44 px controls. §5 the "?" card.
//   §7 mutations through the guard: M1 cancel without asking, M2 short months, M3 the FAB back. §8 the stop.
const LIST = [
  { id: 'c1', title: 'Meera and Kunal \u2014 agreement', state: 'sent', deposit_pct: 30, created_at: '2026-09-20T00:00:00Z', updated_at: '2026-09-20T00:00:00Z',
    terms: { fee_total: 380000, functions_manual: [{ title: 'Haldi', date: '2026-12-12', time: '10:00' }, { title: 'Sangeet', date: '2026-12-12', time: '19:00' }] }, annexes: {} },
  { id: 'c2', title: 'Aanya Kapoor \u2014 agreement', state: 'signed', deposit_pct: 30, created_at: '2026-09-10T00:00:00Z', updated_at: '2026-09-10T00:00:00Z',
    terms: { fee_total: 250000, functions_manual: [{ title: 'Wedding reception at the Leela Palace, Chanakyapuri', date: '2027-02-14' }] }, annexes: {} },
  { id: 'c3', title: 'Studio agreement.pdf', state: 'draft', deposit_pct: null, created_at: '2026-09-02T00:00:00Z', updated_at: '2026-09-02T00:00:00Z', terms: {}, annexes: {} },
];
let cancels = 0;

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
  guard.recoverOrRefuse(ROOT, 'b175');
  const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
  const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
  SERVER = await dev.start(ROOT, PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` });
  if (!ok(await SERVER.up(), '0.1 the dev server came up')) return;
  const exe = process.env.B175_CHROME || await chromium.executablePath();
  BROWSER = await puppeteer.launch({ executablePath: exe, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  async function open(width = 374) {
    const p = await BROWSER.newPage();
    await p.setViewport({ width, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    await p.setCookie({ name: 'tdw_wl_mode', value: 'dark', domain: 'localhost', path: '/' });
    await p.setCookie({ name: 'tdw_layout', value: 'v2', domain: 'localhost', path: '/' });
    const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
    await p.setRequestInterception(true);
    p.on('request', (r) => {
      const u = r.url(); if (!u.includes('/__api/')) return r.continue();
      const route = u.split('/__api')[1].split('?')[0];
      const J = (o) => r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
      if (route === '/api/v2/vendor/contracts' && r.method() === 'GET') return J({ ok: true, contracts: LIST });
      if (/^\/api\/v2\/vendor\/contracts\/c\d$/.test(route) && r.method() === 'DELETE') { cancels += 1; return J({ ok: true }); }
      if (route === '/api/v2/vendor/contracts/profile/fields') return J({ ok: true, fields: {} });
      if (route === '/api/v2/vendor/contracts/annex-map') return J({ ok: true, annexes: [], omitted: [], seeded: {} });
      if (route === '/api/v2/vendor/me') return J({ ok: true, vendor: { id: 'v1', name: 'Swati Roy Makeup', city: 'Delhi' } });
      return J({ ok: true });
    });
    await p.goto(`http://localhost:${PORT}/vendor/contracts`, { waitUntil: 'domcontentloaded', timeout: 180000 });
    const until = Date.now() + 180000; let found = false;
    while (Date.now() < until && !(found = await p.evaluate(() => !!document.querySelector('[data-contract="c1"]')).catch(() => false))) await wait(400);
    p.found = found; await wait(900); return p;
  }
  const q = (p, fn, ...a) => p.evaluate(fn, ...a).catch(() => null);
  const tap = (p, sel) => p.evaluate((s) => { const e = document.querySelector(s); if (e) e.click(); return !!e; }, sel).catch(() => false);
  const tapText = (p, t) => p.evaluate((t) => { const e = [...document.querySelectorAll('button')].find((b) => b.innerText.replace(/\s+/g, ' ').trim() === t); if (e) e.click(); return !!e; }, t).catch(() => false);
  const norm = (t) => String(t || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();

  async function runAll() {
    sec('§1 the room');
    let p = await open(374);
    if (!ok(p.found, '1.0 the room is on glass within 180 s')) { await p.close(); return; }
    const r1 = await q(p, () => {
      const pill = document.querySelector('.wl-roomhead [data-room-add="contracts"]'); const help = document.querySelector('.wl-roomhead .wl-helpq');
      const rows = [...document.querySelectorAll('[data-contract]')].map((e) => { const f = e.querySelector('.ctr-f'); const lh = parseFloat(getComputedStyle(f).lineHeight); return { id: e.dataset.contract, text: e.innerText, lines: Math.round(f.clientHeight / lh), pill: (e.querySelector('[data-pill]') || {}).innerText }; });
      const fab = [...document.querySelectorAll('button')].some((b) => getComputedStyle(b).position === 'fixed' && /\+|New contract/.test(b.innerText) && !b.closest('.wl-roomhead'));
      return { pill: pill ? { t: pill.innerText, h: pill.getBoundingClientRect().height, left: pill.getBoundingClientRect().right <= help.getBoundingClientRect().left } : null, line: (document.querySelector('[data-contracts-line]') || {}).innerText,
        pol: (document.querySelector('[data-policies-row]') || {}).innerText, rows, fab };
    });
    ok(r1 && r1.pill && r1.pill.t === '+ New contract' && Math.abs(r1.pill.h - 36) < 1 && r1.pill.left && !r1.fab, '1.1 "+ New contract" on the head (36 drawn, left of the "?"); no floating +', r1 && JSON.stringify(r1.pill) + ' fab ' + (r1 && r1.fab));
    ok(r1 && r1.line === 'Agreements \u00b7 2 open', '1.2 the count line', r1 && r1.line);
    ok(r1 && r1.pol && r1.pol.includes('Your contract policies') && r1.pol.includes('Set up'), '1.3 the policies as one row (W2)', r1 && r1.pol);
    const c1 = r1 && r1.rows.find((x) => x.id === 'c1');
    ok(c1 && norm(c1.text).includes('12 December 2026') && norm(c1.text).includes('Rs 3,80,000 \u00b7 Haldi') && c1.pill === 'Sent', '1.4 a row: name / full date / Rs · function / one pill', c1 && norm(c1.text));
    // no figure is ever cut: every fee drawn in full, never inside an ellipsis (seen on glass, "Rs 2,50,0\u2026")
    const cut = await q(p, () => [...document.querySelectorAll('.ctr-l2')].filter((el) => {
      const node = el.firstChild; if (!node || node.nodeType !== 3) return false; const m = /Rs\s[\d,]+/.exec(node.textContent); if (!m) return false;
      const r = document.createRange(); r.setStart(node, m.index); r.setEnd(node, m.index + m[0].length);
      return r.getBoundingClientRect().right > el.getBoundingClientRect().right - 12;   // the figure reaches the ellipsis zone: it is cut
    }).length);
    ok(cut === 0, '1.8 no fee is cut at 374: a long name loses its tail, never the figure', cut);
    ok(r1 && r1.rows.every((x) => x.lines <= 2), '1.5 at most two fact lines, measured at 374 (the longest function name included)', r1 && JSON.stringify(r1.rows.map((x) => [x.id, x.lines])));
    ok(await q(p, () => [...document.querySelectorAll('button')].some((b) => b.innerText.trim() === 'Read the standard agreement')), '1.6 "Read the standard agreement" is a button (W9)');

    sec('§2 an agreement\u2019s own page');
    await tap(p, '[data-contract="c1"]'); await wait(700);
    const r2 = await q(p, () => ({ page: !!document.querySelector('[data-contract-page="c1"]'), title: (document.querySelector('[data-page-title]') || {}).innerText, status: (document.querySelector('[data-page-status]') || {}).innerText,
      next: (document.querySelector('.ctr-next') || {}).innerText, facts: [...document.querySelectorAll('.ctr-fact')].map((f) => f.innerText.replace(/\s+/g, ' ').trim()), back: [...document.querySelectorAll('button')].some((b) => b.innerText.includes('Back to Contracts')) }));
    ok(r2 && r2.page && r2.back && r2.title === 'Meera and Kunal' && r2.status === 'Sent \u00b7 not signed yet' && r2.next === 'Send on WhatsApp again', '2.1 the page: back, name, status and one next action (W4)', r2 && JSON.stringify(r2).slice(0, 220));
    ok(r2 && r2.facts.some((f) => norm(f) === 'Haldi 12 December 2026 \u00b7 10:00 am') && r2.facts.some((f) => norm(f) === 'Sangeet 12 December 2026 \u00b7 7:00 pm'), '2.2 Dates in full months, times 12-hour ("7:00 pm")', r2 && JSON.stringify(r2.facts));
    ok(r2 && r2.facts.some((f) => norm(f) === 'Fee Rs 3,80,000') && r2.facts.some((f) => norm(f) === 'Deposit (30%) Rs 1,14,000'), '2.3 Money: fee and the deposit from its percentage', r2 && JSON.stringify(r2.facts));

    sec('§3 cancel asks first');
    const c0 = cancels;
    await tapText(p, 'Cancel this agreement'); await wait(400);
    const r3 = await q(p, () => ({ ask: (document.querySelector('[data-cancel-ask] p') || {}).innerText, lastIsWarn: (() => { const j = [...document.querySelectorAll('.ctr-jobs button')]; return j.length && j[j.length - 1].classList.contains('warn'); })() }));
    ok(r3 && r3.ask === 'Cancel this agreement? It cannot be signed after this.' && cancels === c0 && r3.lastIsWarn, '3.1 Cancel is last and asks first; nothing is cancelled yet', r3 && JSON.stringify(r3));
    await tapText(p, 'Cancel it'); await wait(700);
    ok(cancels === c0 + 1, '3.2 only the confirm calls the door', cancels - c0);

    sec('§4 the whole room');
    await p.close(); p = await open(374);
    const whole = async (pp) => q(pp, () => {
      const root = document.querySelector('.ctr-room'); const out = []; const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
      while ((n = w.nextNode())) { const t = n.textContent.replace(/\s+/g, ' ').trim(); if (t) out.push(t); }
      return { L: out, small: [...root.querySelectorAll('button')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height < 44; }).map((e) => e.innerText.trim()) };
    });
    const w1 = await whole(p);
    await tap(p, '[data-contract="c1"]'); await wait(600);
    const w2 = await whole(p);
    const L = [...((w1 && w1.L) || []), ...((w2 && w2.L) || [])];
    ok(L.length && !L.some((t) => /\b\d{1,2} (Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\b(?!\w)/.test(t)), '4.1 every date in full month (room and page)', L.join(' | ').slice(0, 200));
    ok(L.length && !L.some((t) => /\b([01]?\d|2[0-3]):[0-5]\d\b(?!\s?(am|pm))/.test(t)), '4.2 no 24-hour clock', L.filter((t) => /\d:\d\d/.test(t)).join(' | '));
    ok(L.length && !L.some((t) => /couple/i.test(t)), '4.3 no "couple" on the room or the page', L.filter((t) => /couple/i.test(t)).join(' | '));
    ok(w1 && w2 && !w1.small.length && !w2.small.length, '4.4 every control 44 px or taller', JSON.stringify([w1 && w1.small, w2 && w2.small]));
    await p.close();

    sec('§5 the "?" card, and 1.7 at 360');
    p = await open(360);
    const r5 = await q(p, () => [...document.querySelectorAll('[data-contract]')].map((e) => { const f = e.querySelector('.ctr-f'); return Math.round(f.clientHeight / parseFloat(getComputedStyle(f).lineHeight)); }));
    ok(r5 && r5.every((n) => n <= 2), '1.7 at most two fact lines, measured at 360', JSON.stringify(r5));
    await tap(p, '.wl-roomhead .wl-helpq'); await wait(600);
    const card = await q(p, () => { const c = document.querySelector('.wl-helpcard'); if (!c) return null; const r = c.getBoundingClientRect(); return { t: c.innerText, fits: r.top >= 0 && r.bottom <= innerHeight, sc: [c, ...c.querySelectorAll('*')].some((e) => e.scrollHeight > e.clientHeight + 1 && /(auto|scroll)/.test(getComputedStyle(e).overflowY)) }; });
    const STEPS = ['To start one: tap New contract, then From a client or Someone new.', 'To fill your standard terms once: tap Your contract policies.', 'To send, copy the link or cancel: tap the agreement.'];
    ok(card && STEPS.every((s) => card.t.includes(s)) && card.fits && !card.sc, '5.1 the card: three steps, fits at 360, nothing scrolls', card && card.t.slice(0, 160));
    await p.close();
  }

  await runAll();

  if (MUTATE) {
    sec('§7 mutations through the guard');
    const MUTS = [
      ['M1 cancel without asking', PAGE, "<button type=\"button\" className=\"ctr-job warn\" onClick={() => setAskCancel(true)}>{CT.cancel}</button>", "<button type=\"button\" className=\"ctr-job warn\" onClick={() => { void doCancel(c); go('room'); }}>{CT.cancel}</button>", '3.1'],
      ['M2 short months', PAGE, "const M = ['January','February','March','April','May','June','July','August','September','October','November','December'];", "const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];", '4.1'],
      ['M3 the pill gone', PAGE, "<RoomHeadAdd addKey=\"contracts\" label={CT.add} onAdd={() => setStartOpen(true)} />", "", '1.1'],
    ];
    for (const [name, file, from, to, cell] of MUTS) {
      let h = null;
      try { h = guard.apply(ROOT, file, from, to, 'b175'); } catch (e) { ok(false, `${name}: ${e.message}`); continue; }
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
  console.log(`\nb175 · ${pass} passed, ${fail} failed${failed.length ? ' · ' + failed.join(' ; ') : ''}`);
  process.exit(code !== undefined ? code : (fail ? 1 : 0));
}
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => { void finish(1); });
main().then(() => finish(), (e) => { ok(false, `crashed: ${String((e && e.stack) || e).slice(0, 300)}`); return finish(1); });
