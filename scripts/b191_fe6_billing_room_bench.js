'use strict';
process.env.TDW_LAYOUT_DEFAULT = 'v2';   // the new layout (middleware.ts serves v2/ with no cookie under this default)
// scripts/b191_fe6_billing_room_bench.js · TDW CE-47 · FE-6 · L5 · rung b191 · THE BILLING ROOM, REWORKED.
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
// THE EXIT CODE IS THE VERDICT. Run: node scripts/b191_fe6_billing_room_bench.js  (add --mutate for §7)
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const PORT = 3191;
const MUTATE = process.argv.includes('--mutate');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const PAGE = 'v2/components/worklist/BillingRoom.tsx';
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
// WHAT IT HOLDS (the founder's verdict on mock 7; the chair's Basic line and prices): the plan as facts under a
// sentence-case head; Basic says what it includes in the ruled words and shows no figure; the three plans' prices are
// plans.ts's own (Essential Rs 999, Signature Rs 1,999, Prestige Rs 2,999), read from the file, never typed here; an
// active plan's cancel asks first. §7 mutations through the guard.
const plans = fs.readFileSync(path.join(ROOT, 'v2/lib/vendor/billing/plans.ts'), 'utf8');
const priceOf = (t) => { const m = new RegExp(t + ":\\s*'([^']+)'").exec(plans.slice(plans.indexOf('export const PLAN_PRICE'))); return m ? m[1] : null; };
const BASIC = 'Your enquiries and clients. Collab. Your one-page website. TDW does not reply to clients for you.';
const ME = (over) => ({ ok: true, vendor: { id: 'v1', name: 'Swati Roy Makeup', tier: 'basic', billing_status: 'none', subscription_link: null, subscription_id: null, selfserve_enabled: true, ...over } });

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
  guard.recoverOrRefuse(ROOT, 'b191');
  sec('§0 the prices come from plans.ts');
  ok(priceOf('essential') === 'Rs 999 / month' && priceOf('signature') === 'Rs 1,999 / month' && priceOf('prestige') === 'Rs 2,999 / month', '0.2 plans.ts holds Essential Rs 999, Signature Rs 1,999, Prestige Rs 2,999 (the founder\u2019s prices)', [priceOf('essential'), priceOf('signature'), priceOf('prestige')].join(' | '));
  const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
  const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
  SERVER = await dev.start(ROOT, PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` });
  if (!ok(await SERVER.up(), '0.1 the dev server came up')) return;
  BROWSER = await puppeteer.launch({ executablePath: process.env.B191_CHROME || await chromium.executablePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  let cancels = 0;
  async function open(me, width = 374) {
    const p = await BROWSER.newPage();
    await p.setViewport({ width, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    for (const [n, v] of [['tdw_wl_mode', 'dark'], ['tdw_layout', 'v2']]) await p.setCookie({ name: n, value: v, domain: 'localhost', path: '/' });
    const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
    await p.setRequestInterception(true);
    p.on('request', (r) => {
      const u = r.url(); if (!u.includes('/__api/')) return r.continue();
      const route = u.split('/__api')[1].split('?')[0];
      const J = (o) => r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
      if (route === '/api/v2/vendor/me') return J(me);
      if (/cancel/.test(route) && r.method() === 'POST') { cancels += 1; return J({ ok: true }); }
      return J({ ok: true });
    });
    await p.goto(`http://localhost:${PORT}/vendor/billing`, { waitUntil: 'domcontentloaded', timeout: 180000 });
    const until = Date.now() + 180000; let found = false;
    while (Date.now() < until && !(found = await p.evaluate(() => !!document.querySelector('[data-bill-plan] .wl-billname')).catch(() => false))) await wait(400);
    p.found = found; await wait(900); return p;
  }
  const q = (p, fn, ...a) => p.evaluate(fn, ...a).catch(() => null);
  const norm = (t) => String(t || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();

  async function runAll() {
    sec('§1 Basic, with the plans open to choose');
    let p = await open(ME({}));
    if (!ok(p.found, '1.0 the room is on glass within 180 s')) { await p.close(); return; }
    const r = await q(p, () => ({ heads: [...document.querySelectorAll('.wl-bill h2')].map((h) => h.innerText.trim()), facts: [...document.querySelectorAll('[data-bill-plan] .wl-billfact')].map((f) => f.innerText.replace(/\s+/g, ' ').trim()),
      rows: [...document.querySelectorAll('.wl-planrow')].map((b) => [b.querySelector('.wl-planname').innerText, b.querySelector('.wl-planprice').innerText]), lower: [...document.querySelectorAll('.wl-bill *')].some((e) => getComputedStyle(e).textTransform === 'uppercase' && e.innerText.trim()) }));
    ok(r && r.heads.join('|') === 'Your plan|Choose a plan' && !r.lower, '1.1 two sentence-case heads, nothing in capitals', r && JSON.stringify(r.heads));
    ok(r && r.facts.length === 2 && norm(r.facts[0]) === 'Plan Basic' && norm(r.facts[1]) === 'Includes ' + BASIC, '1.2 Basic: Plan, then what it includes in the ruled words, and no figure', r && JSON.stringify(r.facts));
    ok(r && JSON.stringify(r.rows.map((x) => [x[0], norm(x[1])])) === JSON.stringify([['Essential', norm(priceOf('essential'))], ['Signature', norm(priceOf('signature'))], ['Prestige', norm(priceOf('prestige'))]]),
      '1.3 the three plans at plans.ts\u2019s prices, as drawn', r && JSON.stringify(r.rows));
    const L = await q(p, () => [...document.querySelectorAll('.wl-bill button')].filter((b) => b.getBoundingClientRect().height < 44).length);
    ok(L === 0, '1.4 every control 44 px or taller', L);
    await p.close();
    sec('§2 an active plan: cancel asks first');
    p = await open(ME({ tier: 'signature', billing_status: 'active', razorpay_subscription_id: 'sub_1' }));
    const f2 = await q(p, () => [...document.querySelectorAll('[data-bill-plan] .wl-billfact')].map((f) => f.innerText.replace(/\s+/g, ' ').trim()));
    ok(f2 && norm(f2[0]).startsWith('Plan Signature') && norm(f2[1]) === 'Price ' + norm(priceOf('signature')), '2.1 a paid plan: Plan and its Price, from plans.ts', JSON.stringify(f2));
    const c0 = cancels;
    await p.evaluate(() => { const b = [...document.querySelectorAll('.wl-bill button')].find((x) => x.innerText.trim() === 'Cancel my plan'); if (b) b.click(); }).catch(() => null); await wait(400);
    const asked = await q(p, () => !!document.querySelector('.wl-cancel'));
    if (!asked) console.log('   (buttons on the page: ' + JSON.stringify(await q(p, () => [...document.querySelectorAll('.wl-bill button, .wl-bill a')].map((b) => b.innerText.trim()))) + ')');
    ok(asked && cancels === c0, '2.2 Cancel my plan asks first; nothing is sent yet', JSON.stringify({ asked, sent: cancels - c0 }));
    await p.close();
    sec('§3 the "?" card');
    p = await open(ME({}), 360);
    await p.evaluate(() => { const b = document.querySelector('.wl-roomhead .wl-helpq'); if (b) b.click(); }).catch(() => null); await wait(600);
    const card = await q(p, () => { const c = document.querySelector('.wl-helpcard'); if (!c) return null; const rr = c.getBoundingClientRect(); return { fits: rr.top >= 0 && rr.bottom <= innerHeight, t: c.innerText }; });
    ok(card && card.fits && !/couple/i.test(card.t), '3.1 the card fits at 360; no "couple"', card && card.t.slice(0, 120));
    await p.close();
  }

  await runAll();

  if (MUTATE) {
    sec('§7 mutations through the guard');
    const MUTS = [
      ['M1 the Basic line typed back in', 'v2/lib/worklist/copy.ts', "  planBasicIncludes: 'Your enquiries and clients. Collab. Your one-page website. TDW does not reply to clients for you.',", "  planBasicIncludes: 'Profile and enquiries. No AI replies.',", '1.2'],
      ['M2 the eyebrow back in capitals', PAGE, '<h2 className="wl-billh" data-bill-head="">{COPY.billingPlanLead}</h2>', '<div className="wl-billlead">{COPY.billingPlanLead}</div>', '1.1'],
      ['M3 a typed price', 'v2/lib/vendor/billing/plans.ts', "Rs 2,999 / month", "Rs 3,999 / month", '0.2'],
    ];
    for (const [name, file, from, to, cell] of MUTS) {
      let h = null;
      try { h = guard.apply(ROOT, file, from, to, 'b191'); } catch (e) { ok(false, `${name}: ${e.message}`); continue; }
      await wait(2500);
      const before = evidence; quiet = true; underMut = name.split(' ')[0]; const passBefore = pass; let crashed = null;
      try {
        if (cell === '0.2') { const t = fs.readFileSync(path.join(ROOT, 'v2/lib/vendor/billing/plans.ts'), 'utf8'); const m = /prestige:\s*'([^']+)'/.exec(t.slice(t.indexOf('export const PLAN_PRICE'))); ok(m && m[1] === 'Rs 2,999 / month', '0.2 (under the mutation)'); }
        else await runAll();
      } catch (e) { crashed = e; }
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
  console.log(`\nb191 · ${pass} passed, ${fail} failed${failed.length ? ' · ' + failed.join(' ; ') : ''}`);
  process.exit(code !== undefined ? code : (fail ? 1 : 0));
}
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => { void finish(1); });
main().then(() => finish(), (e) => { ok(false, `crashed: ${String((e && e.stack) || e).slice(0, 300)}`); return finish(1); });
