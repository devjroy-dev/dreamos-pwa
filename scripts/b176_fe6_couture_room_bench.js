'use strict';
process.env.TDW_LAYOUT_DEFAULT = 'v2';   // the new layout (middleware.ts serves v2/ with no cookie under this default)
// scripts/b176_fe6_couture_room_bench.js · TDW CE-47 · FE-6 · L3 · rung b176 · THE COUTURE ROOM, REWORKED (and F-44.259).
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
// THE EXIT CODE IS THE VERDICT. Run: node scripts/b176_fe6_couture_room_bench.js  (add --mutate for §7)
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const PORT = 3176;
const MUTATE = process.argv.includes('--mutate');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const PAGE = 'v2/app/vendor/(shell)/couture/screen.tsx';
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
const SLOTS = [
  { id: 's1', slot_at: '2026-10-10T10:30:00Z', duration_minutes: 60, fee_inr: 3000, state: 'open' },
  { id: 's2', slot_at: '2026-10-11T05:30:00Z', duration_minutes: 60, fee_inr: 3000, state: 'open' },
  { id: 's3', slot_at: '2026-10-17T10:30:00Z', duration_minutes: 60, fee_inr: 5000, state: 'booked' },
];
const APPTS = [{ id: 'a1', appointment_at: '2026-10-17T10:30:00Z', duration_minutes: 60, fee_inr: 5000, state: 'booked', paid_at: null, notes: null, created_at: '2026-09-30T00:00:00Z' }];
let deletes = 0;

let SERVER = null; let BROWSER = null;
async function stopAll() {
  let portFree = true;
  try { if (BROWSER) await BROWSER.close(); } catch (_e) { /* gone */ }
  BROWSER = null;
  try { if (SERVER) { const r = await SERVER.stop(); portFree = r.portFree; } } catch (_e) { /* gone */ }
  SERVER = null;
  return portFree;
}

function evalSummary(file) {
  const s = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const m = s.match(/function summaryOf\(p: VendorPackage\): string \{\n([\s\S]*?)\n\}/);
  if (!m) return null;
  const fn = new Function('p', m[1].replace(/\(d\) =>/g, '(d) =>'));   // plain JS once the one annotation is gone
  return (items) => fn({ line_items: items });
}

async function main() {
  guard.recoverOrRefuse(ROOT, 'b176');
  sec('§F F-44.259 (evaluated from each page\u2019s own summaryOf)');
  for (const [cell, file] of [['F1 classic', 'app/vendor/(shell)/packages/page.tsx'], ['F2 v2', 'v2/app/vendor/(shell)/packages/page.tsx']]) {
    let f = null; try { f = evalSummary(file); } catch (e) { f = null; }
    const a = f && f([{ detail: '' }, { detail: '' }]); const b = f && f([{ detail: 'Haldi' }, { detail: '' }, { detail: 'Album' }]);
    ok(f && a === '' && b === 'Haldi, Album', `${cell}: empty details draw nothing (never "," or ", ,"), others join`, JSON.stringify({ a, b }));
  }
  const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
  const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
  SERVER = await dev.start(ROOT, PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` });
  if (!ok(await SERVER.up(), '0.1 the dev server came up')) return;
  const exe = process.env.B176_CHROME || await chromium.executablePath();
  BROWSER = await puppeteer.launch({ executablePath: exe, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });

  async function open(eligible, width = 374) {
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
      if (route === '/api/v2/vendor/me') return J({ ok: true, vendor: { id: 'v1', name: 'Swati Roy Makeup', couture_eligible: eligible } });
      if (route === '/api/v2/vendor/couture/availability') return J({ ok: true, slots: SLOTS, total: SLOTS.length });
      if (route.startsWith('/api/v2/vendor/couture/availability/') && r.method() === 'DELETE') { deletes += 1; return J({ ok: true, deleted: true }); }
      if (route === '/api/v2/vendor/couture/appointments') return J({ ok: true, appointments: APPTS, total: 1 });
      return J({ ok: true });
    });
    await p.goto(`http://localhost:${PORT}/vendor/couture`, { waitUntil: 'domcontentloaded', timeout: 180000 });
    const want = eligible ? '[data-couture="room"] [data-slot]' : '[data-couture="locked"]';
    const until = Date.now() + 180000; let found = false;
    while (Date.now() < until && !(found = await p.evaluate((w) => !!document.querySelector(w), want).catch(() => false))) await new Promise((r) => setTimeout(r, 400));
    p.found = found; await new Promise((r) => setTimeout(r, 900));
    return p;
  }
  const q = (p, fn, ...a) => p.evaluate(fn, ...a).catch(() => null);
  const tap = (p, sel) => p.evaluate((s) => { const e = document.querySelector(s); if (e) e.click(); return !!e; }, sel).catch(() => false);
  const tapText = (p, t) => p.evaluate((t) => { const e = [...document.querySelectorAll('button')].find((b) => b.innerText.trim() === t); if (e) e.click(); return !!e; }, t).catch(() => false);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  async function runAll() {
    sec('§1 the room');
    let p = await open(true);
    if (!ok(p.found, '1.0 the room is on glass within 180 s')) { await p.close(); return; }
    const r1 = await q(p, () => {
      const b = (e) => { if (!e) return null; const x = e.getBoundingClientRect(); return { top: x.top, bottom: x.bottom, left: x.left, right: x.right, h: x.height }; };
      const pill = document.querySelector('.wl-roomhead [data-room-add="couture"]'); const help = document.querySelector('.wl-roomhead .wl-helpq'); const title = document.querySelector('.wl-roomhead [data-room-title]');
      const rows = [...document.querySelectorAll('[data-slot]')].map((e) => ({ tag: e.tagName, text: e.innerText.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim(), pill: (e.querySelector('[data-pill]') || {}).innerText }));
      const hit = pill ? parseFloat(getComputedStyle(pill, '::before').top) : null;
      return { pill: pill ? { text: pill.innerText, box: b(pill), hit } : null, help: b(help), title: b(title), line: (document.querySelector('[data-couture-line]') || {}).innerText,
        seg: [...document.querySelectorAll('.cou-seg button')].map((x) => [x.innerText, x.getBoundingClientRect().height]), rows, dialogs: document.querySelectorAll('[role=dialog]').length };
    });
    ok(r1 && r1.pill && r1.pill.text === '+ New slot', '1.1 the pill reads "+ New slot" on the room head', r1 && JSON.stringify(r1.pill));
    ok(r1 && r1.pill && Math.abs(r1.pill.box.h - 36) < 1 && r1.pill.hit === -4 && r1.help && r1.pill.box.right <= r1.help.left && Math.abs((r1.pill.box.top + r1.pill.box.bottom) / 2 - (r1.title.top + r1.title.bottom) / 2) <= 2,
      '1.2 drawn 36, tap area 44 (an inset hit box), left of the one "?", centred on the title line', r1 && JSON.stringify({ p: r1.pill.box, h: r1.help, t: r1.title }));
    ok(r1 && r1.line === 'Open slots \u00b7 2', '1.3 the count line', r1 && r1.line);
    ok(r1 && r1.seg.map((x) => x[0]).join('|') === 'Open slots|Appointments' && r1.seg.every((x) => x[1] >= 44), '1.4 one switch: Open slots, Appointments (W3), 44 px', r1 && JSON.stringify(r1.seg));
    const s1 = r1 && r1.rows.find((x) => x.text.startsWith('Saturday 10 October 2026'));
    ok(s1 && s1.tag === 'BUTTON' && s1.text.includes('4:00 pm \u00b7 60 minutes \u00b7 Rs 3,000') && s1.pill === 'Open', '1.5 an open slot: weekday and full date; "4:00 pm" · minutes · Rs; Open; a tap', s1 && JSON.stringify(s1));
    const s3 = r1 && r1.rows.find((x) => x.text.startsWith('Saturday 17 October 2026'));
    ok(s3 && s3.tag !== 'BUTTON' && s3.pill === 'Booked', '1.6 a booked slot is not a tap, its pill Booked', s3 && JSON.stringify(s3));

    sec('§2 the add sheet');
    await tap(p, '[data-room-add="couture"]'); await wait(500);
    await p.evaluate(() => {
      const set = (id, v) => { const el = document.getElementById(id); const d = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value'); d.set.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); };
      set('cou-day', '2026-10-24'); set('cou-at', '16:00');
    }).catch(() => null);
    await wait(400);
    const r2 = await q(p, () => ({ sheet: !!document.querySelector('[data-couture-sheet="add"]'), date: (document.querySelector('[data-date-words]') || {}).innerText, time: (document.querySelector('[data-time-words]') || {}).innerText }));
    ok(r2 && r2.sheet && r2.date === 'Saturday 24 October 2026', '2.1 the date in words under the native date field', r2 && JSON.stringify(r2));
    ok(r2 && r2.time === '4:00 pm', '2.2 the time in 12-hour words ("4:00 pm")', r2 && r2.time);
    await tap(p, '[data-couture-sheet="add"] .cou-x'); await wait(400);

    sec('§3 remove asks first');
    const d0 = deletes;
    await tap(p, '[data-slot="s1"]'); await wait(500);
    const r3a = await q(p, () => ({ sheet: !!document.querySelector('[data-couture-sheet="slot"]'), btns: [...document.querySelectorAll('[data-couture-sheet="slot"] button')].map((b) => b.innerText.trim()) }));
    ok(r3a && r3a.sheet && r3a.btns.includes('Remove this slot'), '3.1 a tap on an open slot opens its sheet with Remove this slot', r3a && JSON.stringify(r3a));
    await tapText(p, 'Remove this slot'); await wait(400);
    const r3b = await q(p, () => ({ ask: (document.querySelector('[data-couture-sheet="slot"] .cou-q') || {}).innerText, dialogs: document.querySelectorAll('[role=dialog]').length }));
    ok(r3b && r3b.ask === 'Remove this open slot? Nobody can book it after this.' && deletes === d0 && r3b.dialogs === 1, '3.2 Remove asks first, in the same sheet; nothing is deleted yet', r3b && JSON.stringify({ ...r3b, deletes: deletes - d0 }));
    await tapText(p, 'Remove'); await wait(700);
    ok(deletes === d0 + 1 && !(await q(p, () => !!document.querySelector('[data-slot="s1"]'))), '3.3 only the confirm calls the door; the row leaves', deletes - d0);

    sec('§5 the whole room');
    const whole = await q(p, () => {
      const root = document.querySelector('.cou-room'); const out = []; const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
      while ((n = w.nextNode())) { const t = n.textContent.replace(/\s+/g, ' ').trim(); if (t) out.push(t); }
      const small = [...root.querySelectorAll('button')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height < 44 && !e.hasAttribute('data-tap44'); }).map((e) => e.innerText.trim());
      return { leaves: out, small };
    });
    const L = whole ? whole.leaves : [];
    ok(whole && !L.some((t) => /\b\d{1,2} (Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\b(?!\w)/.test(t)), '5.1 every date in full month', L.join(' | ').slice(0, 200));
    ok(whole && !L.some((t) => /\b([01]?\d|2[0-3]):[0-5]\d\b(?!\s?(am|pm))/.test(t)), '5.2 no 24-hour clock anywhere ("16:00")', L.filter((t) => /\d:\d\d/.test(t)).join(' | '));
    ok(whole && !L.some((t) => /couple/i.test(t)), '5.3 no "couple" on glass');
    ok(whole && whole.small.length === 0, '5.4 every control 44 px or taller', whole && whole.small.join(','));

    sec('§6 the "?" card');
    await tap(p, '.wl-roomhead .wl-helpq'); await wait(600);
    const card = await q(p, () => { const c = document.querySelector('.wl-helpcard'); if (!c) return null; const r = c.getBoundingClientRect();
      const sc = [c, ...c.querySelectorAll('*')].some((e) => e.scrollHeight > e.clientHeight + 1 && /(auto|scroll)/.test(getComputedStyle(e).overflowY)); return { t: c.innerText, fits: r.top >= 0 && r.bottom <= innerHeight, sc }; });
    const STEPS = ['On the Signature or Prestige plan: tap New slot, choose the date and time.', 'To remove an open slot: tap it, then Remove this slot.', 'Without the plan: tap See plans in Billing on this page.', 'Connects to Billing.'];
    ok(card && STEPS.every((s) => card.t.includes(s)), '6.1 the card: three steps and the connects line', card && card.t.slice(0, 200));
    ok(card && card.fits && !card.sc, '6.2 the card fits at 374 with nothing scrolling inside it', card && JSON.stringify({ fits: card.fits, sc: card.sc }));
    await p.close();

    sec('§4 the locked state (and 6.3 its button is drawn)');
    p = await open(false);
    const r4 = await q(p, () => ({ line: (document.querySelector('[data-couture="locked"] .cou-line') || {}).innerText, btn: [...document.querySelectorAll('[data-couture="locked"] button')].map((b) => [b.innerText.trim(), b.getBoundingClientRect().height]), pill: !!document.querySelector('[data-room-add]') }));
    ok(r4 && r4.line === 'Couture appointments are part of Signature and Prestige.' && r4.btn.length === 1 && r4.btn[0][0] === 'See plans in Billing' && r4.btn[0][1] >= 44 && !r4.pill,
      '4.1 locked: one plain line and "See plans in Billing" (W3); no pill', r4 && JSON.stringify(r4));
    await tapText(p, 'See plans in Billing');
    for (let i = 0; i < 30 && (await q(p, () => location.pathname)) !== '/vendor/billing'; i += 1) await wait(300);
    ok((await q(p, () => location.pathname)) === '/vendor/billing', '4.2 the button opens Billing');
    await p.close();

    sec('§1b the pill at 360');
    p = await open(true, 360);
    const r5 = await q(p, () => { const pill = document.querySelector('[data-room-add="couture"]'); const t = document.querySelector('.wl-roomhead [data-room-title]'); if (!pill || !t) return null;
      return { titleWhole: t.scrollWidth <= t.clientWidth + 1, overlap: (() => { const a = pill.getBoundingClientRect(), b = t.getBoundingClientRect(); return !(a.left >= b.right || a.right <= b.left || a.top >= b.bottom || a.bottom <= b.top); })() }; });
    ok(r5 && r5.titleWhole && !r5.overlap, '1.7 at 360: the title is whole and the pill overlaps nothing', r5 && JSON.stringify(r5));
    await p.close();
  }

  await runAll();

  if (MUTATE) {
    sec('§7 mutations through the guard (each must redden its cell)');
    const MUTS = [
      ['M1 Remove without asking', PAGE, "onClick={() => setAsking(true)}>{CO.remove}</button>", "onClick={() => void doRemove(picked.id)}>{CO.remove}</button>", '3.2'],
      ['M2 no date in words', PAGE, "{typed ? <p className=\"cou-words\" data-date-words=\"\">{typed}</p> : null}", "{null}", '2.1'],
      ['M3 a 24-hour clock', CLOCK, "hour12: true", "hour12: false", '1.5'],
      ['M4 the locked button gone', PAGE, "<button type=\"button\" className=\"cou-btn cou-pri\" onClick={() => router.push(roomHref('billing'))}>{CO.lockedButton}</button>", "", '4.1'],
    ];
    for (const [name, file, from, to, cell] of MUTS) {
      let h = null;
      try { h = guard.apply(ROOT, file, from, to, 'b176'); } catch (e) { ok(false, `${name}: ${e.message}`); continue; }
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
  console.log(`\nb176 · ${pass} passed, ${fail} failed${failed.length ? ' · ' + failed.join(' ; ') : ''}`);
  process.exit(code !== undefined ? code : (fail ? 1 : 0));
}
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => { void finish(1); });
main().then(() => finish(), (e) => { ok(false, `crashed: ${String((e && e.stack) || e).slice(0, 300)}`); return finish(1); });
