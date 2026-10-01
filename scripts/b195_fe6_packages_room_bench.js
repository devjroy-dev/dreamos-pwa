'use strict';
process.env.TDW_LAYOUT_DEFAULT = 'v2';   // the new layout (middleware.ts serves v2/ with no cookie under this default)
// scripts/b195_fe6_packages_room_bench.js · TDW CE-47 · FE-6 · L5 · rung b195 · THE PACKAGES ROOM, REWORKED.
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
// THE EXIT CODE IS THE VERDICT. Run: node scripts/b195_fe6_packages_room_bench.js  (add --mutate for §7)
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const PORT = 3195;
const MUTATE = process.argv.includes('--mutate');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const PAGE = 'v2/app/vendor/(shell)/packages/page.tsx';
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
// WHAT IT HOLDS (the founder's verdict on mock 12 and the chair's f to h): the pill; rows of item NAMES capped at two
// rendered lines, MEASURED at 374 and 360, then "and N more", a name never cut; no second line for a package with no
// items; the default said once; the sheet (Price, Deposit, Delivery; What's included with details); Delete last and
// asked first; "Fee not set" opens the edit sheet; the "?" card. Mutations through the guard.
const PKGS = [
  { id: 'p1', name: 'Wedding day', description: '', line_items: [{ label: 'Photography, one day', detail: '' }, { label: 'Second shooter', detail: '' }], total: 150000, deposit_pct: 30, middle_pct: 0, middle_enabled: false, delivery_basis: 'days', delivery_days: 45, is_default: true, seeded_from: null, created_at: '', updated_at: '' },
  { id: 'p2', name: 'Full wedding', description: '', line_items: [{ label: 'Photography, three functions', detail: 'Haldi, Sangeet, Wedding' }, { label: 'Wedding film', detail: '8 to 10 minutes' }, { label: 'Album', detail: '' }, { label: 'Pre-wedding shoot at a heritage property in Jaipur', detail: '' }], total: 380000, deposit_pct: 30, middle_pct: 0, middle_enabled: false, delivery_basis: 'on_the_day', delivery_days: null, is_default: false, seeded_from: null, created_at: '', updated_at: '' },
  { id: 'p3', name: 'Engagement shoot', description: '', line_items: [], total: null, deposit_pct: 50, middle_pct: 0, middle_enabled: false, delivery_basis: 'handover', delivery_days: null, is_default: false, seeded_from: null, created_at: '', updated_at: '' },
];
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

async function main() {
  guard.recoverOrRefuse(ROOT, 'b195');
  const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
  const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
  SERVER = await dev.start(ROOT, PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` });
  if (!ok(await SERVER.up(), '0.1 the dev server came up')) return;
  BROWSER = await puppeteer.launch({ executablePath: process.env.B195_CHROME || await chromium.executablePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
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
      if (route === '/api/v2/vendor/packages' && r.method() === 'GET') return J({ ok: true, packages: PKGS, seeding: { seeded: false, reason: '' } });
      if (/^\/api\/v2\/vendor\/packages\/p\d$/.test(route) && r.method() === 'DELETE') { deletes += 1; return J({ ok: true }); }
      return J({ ok: true });
    });
    await p.goto(`http://localhost:${PORT}/vendor/packages`, { waitUntil: 'domcontentloaded', timeout: 180000 });
    const until = Date.now() + 180000; let found = false;
    while (Date.now() < until && !(found = await p.evaluate(() => !!document.querySelector('[data-package-id="p2"]')).catch(() => false))) await wait(400);
    p.found = found; await wait(900); return p;
  }
  const q = (p, fn, ...a) => p.evaluate(fn, ...a).catch(() => null);
  const tap = (p, sel) => p.evaluate((s) => { const e = document.querySelector(s); if (e) e.click(); return !!e; }, sel).catch(() => false);
  const tapText = (p, t) => p.evaluate((t) => { const e = [...document.querySelectorAll('button')].find((b) => b.innerText.replace(/\s+/g, ' ').trim() === t); if (e) e.click(); return !!e; }, t).catch(() => false);
  const rowsAt = (p) => q(p, () => [...document.querySelectorAll('[data-package-id]')].map((e) => { const f = e.querySelector('[data-fit]'); return { id: e.dataset.packageId, fit: f ? f.textContent : null, lines: f ? Math.round(f.clientHeight / parseFloat(getComputedStyle(f).lineHeight)) : 0, amt: (e.querySelector('.pk-amt') || {}).innerText }; }));

  async function runAll() {
    sec('§1 the room at 374');
    let p = await open(374);
    if (!ok(p.found, '1.0 the room is on glass within 180 s')) { await p.close(); return; }
    const head = await q(p, () => { const pill = document.querySelector('.wl-roomhead [data-room-add="packages"]'); const help = document.querySelector('.wl-roomhead .wl-helpq');
      return pill ? { t: pill.innerText, h: pill.getBoundingClientRect().height, left: pill.getBoundingClientRect().right <= help.getBoundingClientRect().left } : null; });
    ok(head && head.t === '+ New package' && Math.abs(head.h - 36) < 1 && head.left, '1.1 "+ New package" on the head, 36 drawn, left of the "?"', JSON.stringify(head));
    ok((await q(p, () => (document.querySelector('[data-packages-line]') || {}).innerText)) === 'What you offer \u00b7 3 packages', '1.2 the count line');
    let r = await rowsAt(p);
    const p2 = r && r.find((x) => x.id === 'p2'); const p3 = r && r.find((x) => x.id === 'p3');
    ok(r && r.every((x) => x.lines <= 2), '1.3 every row at most two fact lines, measured at 374', JSON.stringify(r));
    ok(p2 && /and \d+ more$/.test(p2.fit) && p2.fit.startsWith('Photography, three functions'), '1.4 a long list ends "and N more" after whole names', p2 && p2.fit);
    ok(p3 && p3.fit === null, '1.5 a package with no items draws no second line (F-44.259)', JSON.stringify(p3));
    ok((await q(p, () => (document.querySelector('[data-default-line]') || {}).innerText)) === 'Wedding day is your default package.', '1.6 the default said once, under the list (V20)');
    sec('§2 the sheet');
    await tap(p, '[data-package-id="p2"]'); await wait(600);
    const sh = await q(p, () => { const s = document.querySelector('[data-package-sheet="p2"]'); if (!s) return null;
      return { facts: [...s.querySelectorAll('.pk-fact')].map((f) => f.innerText.replace(/\s+/g, ' ').trim()), items: [...s.querySelectorAll('.pk-list .pk-row')].map((e) => e.innerText.replace(/\s+/g, ' ').trim()), btns: [...s.querySelectorAll('.pk-jobs button')].map((b) => b.innerText.trim()) }; });
    ok(sh && sh.facts.join('|').replace(/\u00a0/g, ' ') === 'Price Rs 3,80,000|Deposit 30%|Delivery On the event date', '2.1 Price, Deposit, Delivery (V21)', sh && sh.facts.join('|'));
    ok(sh && sh.items[0] === 'Photography, three functions Haldi, Sangeet, Wedding' && sh.items[2] === 'Album', '2.2 each included item with its detail under it, none when empty', sh && JSON.stringify(sh.items));
    ok(sh && sh.btns[sh.btns.length - 1] === 'Delete' && sh.btns.includes('Edit') && sh.btns.includes('Set as default'), '2.3 Edit, Set as default, then Delete last', sh && sh.btns.join(','));
    const d0 = deletes; await tapText(p, 'Delete'); await wait(400);
    const ask = await q(p, () => (document.querySelector('[data-delete-ask] p') || {}).innerText);
    ok(ask === 'Delete this package? Quotes already sent keep their copy.' && deletes === d0, '2.4 Delete asks first; nothing deleted yet', ask);
    await p.evaluate(() => { const b = [...document.querySelectorAll('[data-delete-ask] button')].find((x) => x.innerText.trim() === 'Delete'); if (b) b.click(); }).catch(() => null); await wait(700);
    ok(deletes === d0 + 1, '2.5 only the confirm calls the door', deletes - d0);
    await p.close(); p = await open(374);
    await tap(p, '[data-package-id="p3"]'); await wait(700);
    ok(await q(p, () => !document.querySelector('[data-package-sheet="p3"]') && !!document.querySelector('#pkg-fee')), '2.6 "Fee not set" opens the edit sheet on Fee, not the package sheet');
    await p.close();
    sec('§3 at 360, the whole room, the "?" card');
    p = await open(360);
    r = await rowsAt(p);
    ok(r && r.every((x) => x.lines <= 2), '3.1 every row at most two fact lines, measured at 360', JSON.stringify(r));
    const L = await q(p, () => { const root = document.querySelector('[data-packages]'); const out = []; const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const t = n.textContent.trim(); if (t) out.push(t); } return { out, small: [...root.querySelectorAll('button')].filter((b) => b.getBoundingClientRect().height < 44).length }; });
    ok(L && !L.out.some((t) => /couple/i.test(t)) && L.small === 0, '3.2 no "couple"; every control 44 px or taller', JSON.stringify(L && L.small));
    await tap(p, '.wl-roomhead .wl-helpq'); await wait(600);
    const card = await q(p, () => { const c = document.querySelector('.wl-helpcard'); if (!c) return null; const rr = c.getBoundingClientRect(); return { t: c.innerText, fits: rr.top >= 0 && rr.bottom <= innerHeight }; });
    const STEPS = ['To add a package: tap New package, give it a name and price.', 'To change one: tap it, then Edit.', 'To choose the one quotes start from: tap it, then Set as default.'];
    ok(card && STEPS.every((s) => card.t.includes(s)) && card.fits, '3.3 the card: three steps, fits at 360', card && card.t.slice(0, 160));
    await p.close();
  }

  await runAll();

  if (MUTATE) {
    sec('§7 mutations through the guard');
    const MUTS = [
      ['M1 the cap never measured', PAGE, "for (; n > 0; n -= 1) { el.textContent = text(n); if (el.clientHeight <= lh * 2 + 1) break; }", "n = list.length;", '1.3'],
      ['M2 Delete without asking', PAGE, "className=\"pk-job pk-warn\" onClick={() => setConfirming(picked.id)}", "className=\"pk-job pk-warn\" onClick={() => { void remove(picked); }}", '2.4'],
      ['M3 empty items draw a line', PAGE, "  if (!list.length) return null;\n  return <span className=\"pk-f\"", "  return <span className=\"pk-f\"", '1.5'],
    ];
    for (const [name, file, from, to, cell] of MUTS) {
      let h = null;
      try { h = guard.apply(ROOT, file, from, to, 'b195'); } catch (e) { ok(false, `${name}: ${e.message}`); continue; }
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
  console.log(`\nb195 · ${pass} passed, ${fail} failed${failed.length ? ' · ' + failed.join(' ; ') : ''}`);
  process.exit(code !== undefined ? code : (fail ? 1 : 0));
}
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => { void finish(1); });
main().then(() => finish(), (e) => { ok(false, `crashed: ${String((e && e.stack) || e).slice(0, 300)}`); return finish(1); });
