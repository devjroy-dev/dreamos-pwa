'use strict';
// scripts/b232_ce47_off_a2_shop_room_bench.js · CE-47 · OFF-A2 · THE OFF-SEASON SHOP ROOM, DRIVEN INSIDE ITSELF (C-43.18).
// next dev in mock mode, the new layout's cookie, headless Chromium at 374 x 812 with touch, Graphite (dark) and light. The
// room's doors (OFF-A1's /api/v2/vendor/solutions/shop) are answered here and every write is recorded; every other door is
// the harness's own fixture (docs/design/tools/harness.mjs answer()). Taps go through the real controls.
const path = require('path'); const fs = require('fs');
const ROOT = path.join(__dirname, '..');
process.env.PORT = process.env.PORT || '4123';
const dev = require('./lib/b126_dev_server.js'); const { stopTree } = require('./lib/stop_tree.js');
let pass = 0, fail = 0; const failed = [];
function ok(c, name, info) { let v = false; try { v = typeof c === 'function' ? c() : c; } catch (e) { info = 'threw: ' + e.message; }
  if (v) { pass += 1; console.log(`  PASS  ${name}`); } else { fail += 1; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 220) + ']'}`); } }
const sec = (t) => console.log(`\n§${t}`);
// e-275: no cell rests on a fixed pause. Every wait is on the thing itself (an element, a word, a recorded write), bounded.
const tick = () => new Promise((r) => setImmediate(r));
async function waitFor(p, fn, arg, ms = 20000) {
  const end = Date.now() + ms;
  for (;;) { let v = false; try { v = await p.evaluate(fn, arg); } catch (_e) { v = false; } if (v) return true; if (Date.now() > end) return false; await p.waitForFunction(() => true, { timeout: 1000 }).catch(() => {}); await tick(); }
}
// C29 (CE-47 option a): the room's places, measured at 374, so a change to how the room sits can be shown, not assumed.
// Each is [left, top, width, height] of the smallest element whose own text is the given words (or the given selector).
async function place(p) {
  return p.evaluate(() => {
    const b = (e) => { if (!e) return null; const x = e.getBoundingClientRect(); return [Math.round(x.left), Math.round(x.top), Math.round(x.width), Math.round(x.height)]; };
    const byText = (re) => { let best = null; for (const e of document.querySelectorAll('body *')) { if (!e.getClientRects().length) continue; const t = (e.innerText || '').trim(); if (re.test(t) && (!best || e.contains(best) === false && best.contains(e))) best = e; else if (re.test(t) && !best) best = e; } return best; };
    const smallest = (re) => { const all = [...document.querySelectorAll('body *')].filter((e) => e.getClientRects().length && re.test((e.innerText || '').trim())); return all.filter((e) => !all.some((o) => o !== e && e.contains(o))).sort((x, y) => x.getBoundingClientRect().top - y.getBoundingClientRect().top)[0] || null; };
    const rail = document.querySelector('.os-rail'); const chip = rail && rail.querySelector('button, [role=tab], a');
    const row = smallest(/^Makeup trial voucher$/); const rowBox = row ? (row.closest('button, [role=button], a, li') || row.parentElement) : null;
    const sheet = document.querySelector('.wl-sheet');
    return { title: b(smallest(/^Off-season shop$/)), add: b(smallest(/^\+?\s*New item$/)), rail: b(rail), chip: b(chip), row: b(rowBox), sheet: b(sheet),
      inset: rail ? getComputedStyle(rail).getPropertyValue('--slice-inset').trim() : null, wide: document.documentElement.scrollWidth };
  });
}
const SHOTS = process.env.B232_SHOTS || null;   // a folder: the room's pictures for the founder (never inside the repo)
const shot = async (p, name) => { if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await p.screenshot({ path: path.join(SHOTS, `${name}.png`), fullPage: true }); } };
const mainHas = (p, re) => waitFor(p, (src) => new RegExp(src).test((document.querySelector('.wl') || document.body).innerText), re.source);
const sheetIs = (p, label) => waitFor(p, (l) => !!document.querySelector(`.wl-sheet[aria-label="${l}"]`), label);
const noSheet = (p) => waitFor(p, () => !document.querySelector('.wl-sheet'));
async function waitWrite(writes, pred, ms = 20000) { const end = Date.now() + ms; while (Date.now() < end) { if (writes.some(pred)) return true; await new Promise((r) => setImmediate(r)); } return writes.some(pred); }
/** Bounded teardown (e-275 3): a browser close gets 15 seconds, then its process is killed. */
async function closeBrowser(b) {
  if (!b) return; const proc = b.process && b.process();
  const done = await Promise.race([b.close().then(() => true).catch(() => true), new Promise((r) => setTimeout(() => r(false), 15000))]);
  if (!done && proc) { try { proc.kill('SIGKILL'); } catch (_e) { /* gone */ } }
}

const ITEMS = [
  { id: 'i1', kind: 'voucher', name: 'Makeup trial voucher', slug: 'makeup-trial-voucher', photo_url: null, price: 3000, includes: [], shown: true, position: 0, voucher_for: 'One makeup trial', valid_months: 12, starts_at: null, ends_at: null, place: null, online: false, seats_total: null, class_dates: [], occasion: null, hours: null, lead_days: null, seats_left: null, facts: 'Gift voucher · One makeup trial · Valid 12 months', price_words: 'Rs 3,000' },
  { id: 'i2', kind: 'workshop', name: 'Party makeup masterclass', slug: 'party-makeup-masterclass', photo_url: null, price: 4500, includes: [], shown: false, position: 1, voucher_for: null, valid_months: null, starts_at: '2026-12-14T05:30:00.000Z', ends_at: null, place: 'Lajpat Nagar', online: false, seats_total: 20, class_dates: [], occasion: null, hours: null, lead_days: null, seats_left: 12, facts: 'Workshop · 12 of 20 seats left · 14 December 2026 · Lajpat Nagar', price_words: 'Rs 4,500' },
  { id: 'i3', kind: 'class', name: 'Live online class', slug: 'live-online-class', photo_url: null, price: 2500, includes: [], shown: true, position: 2, class_link: 'https://meet.google.com/abc-defg-hij', voucher_for: null, valid_months: null, starts_at: null, ends_at: null, place: null, online: true, seats_total: null, class_dates: [], occasion: null, hours: null, lead_days: null, seats_left: null, facts: 'Online class · On request', price_words: 'Rs 2,500' },
  { id: 'i4', kind: 'class', name: 'Second online class', slug: 'second-online-class', photo_url: null, price: 2000, includes: [], shown: true, position: 3, class_link: null, voucher_for: null, valid_months: null, starts_at: null, ends_at: null, place: null, online: true, seats_total: null, class_dates: [], occasion: null, hours: null, lead_days: null, seats_left: null, facts: 'Online class · On request', price_words: 'Rs 2,000' },
];
const ORDERS = [
  { id: 'o1', item_id: 'i1', buyer_name: 'Ananya Gupta', buyer_phone: '+919811022338', qty: 1, amount: 3000, amount_words: 'Rs 3,000', wanted_date: null, state: 'asked', hold_until: null, paid_at: null, paid_by: null, created_at: '2026-10-05T06:00:00Z', item_name: 'Makeup trial voucher', item_kind: 'voucher', voucher: null },
  { id: 'o2', item_id: 'i2', buyer_name: 'Riya Sethi', buyer_phone: '+919811022334', qty: 2, amount: 9000, amount_words: 'Rs 9,000', wanted_date: null, state: 'paid', hold_until: null, paid_at: '2026-10-03T06:00:00Z', paid_by: 'vendor', created_at: '2026-10-03T05:00:00Z', item_name: 'Party makeup masterclass', item_kind: 'workshop', voucher: null },
  { id: 'o3', item_id: 'i3', buyer_name: 'Meera Joshi', buyer_phone: '+919811022342', qty: 1, amount: 2500, amount_words: 'Rs 2,500', wanted_date: null, state: 'paid', hold_until: null, paid_at: '2026-10-04T06:00:00Z', paid_by: 'vendor', created_at: '2026-10-04T05:00:00Z', item_name: 'Live online class', item_kind: 'class', voucher: null },
  { id: 'o4', item_id: 'i4', buyer_name: 'Tara Nair', buyer_phone: '+919811022343', qty: 1, amount: 2000, amount_words: 'Rs 2,000', wanted_date: null, state: 'paid', hold_until: null, paid_at: '2026-10-04T07:00:00Z', paid_by: 'vendor', created_at: '2026-10-04T06:30:00Z', item_name: 'Second online class', item_kind: 'class', voucher: null },
];

async function openRoom(b, H, { mode, open = true, thin = null, pics = null }) {
  const p = await b.newPage(); const writes = []; const errors = [];
  p.on('pageerror', (e) => errors.push(String(e && e.message || e)));
  await p.setViewport({ width: 374, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  await p.setCookie({ name: 'tdw_wl_mode', value: mode, domain: 'localhost', path: '/' }, { name: 'tdw_layout', value: 'v2', domain: 'localhost', path: '/' });
  await p.evaluateOnNewDocument(() => { try { Storage.prototype.getItem = new Proxy(Storage.prototype.getItem, { apply(t, s, a) { const r = Reflect.apply(t, s, a); if (r === null && /seen|first|onboard|intro/i.test(String(a[0]))) return '1'; return r; } }); } catch (_e) { /* fine */ } });
  const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
  await p.setRequestInterception(true);
  p.on('request', (r) => {
    const u = r.url(); if (!u.includes('/__api/')) return r.continue();
    const rt = u.split('/__api')[1].split('?')[0]; const m = r.method();
    let body;
    if (rt.startsWith('/api/v2/vendor/solutions/shop')) {
      const sub = rt.slice('/api/v2/vendor/solutions/shop'.length);
      let inb = null; try { inb = JSON.parse(r.postData() || 'null'); } catch (_e) { inb = null; }
      if (m !== 'GET') writes.push({ m, sub, body: inb });
      // thin (lesson 2, CE-47): the door answers { ok: true } with no lists ('bare'), or open with no lists ('open')
      if (m === 'GET' && sub === '' && thin) body = thin === 'bare' ? { ok: true } : { ok: true, open: true };
      else if (m === 'GET' && sub === '') body = open ? { ok: true, open: true, items: ITEMS, orders: ORDERS } : { ok: true, open: false, items: [], orders: [] };
      else if (/^\/orders\/o1\/paid$/.test(sub)) body = { ok: true, voucher: { code: 'K7QM-4XPA', valid_until: '2027-10-05' }, lead_id: null, event_id: null, calendar_line: null };
      else if (sub === '/vouchers/check') body = { ok: true, voucher: { code: 'K7QM-4XPA', item_name: 'Makeup trial voucher', buyer_name: 'Ananya Gupta', line: 'Ananya Gupta · Paid Rs 3,000 on 5 October 2026 · Valid until 5 October 2027', valid_until: '2027-10-05', redeemed_at: null, state: 'valid' } };
      else body = { ok: true, item: ITEMS[0] };
    } else if (pics && m === 'GET' && rt.startsWith('/api/v2/vendor/portfolio/')) {
      // R-47.2 (WEB-4 cut 30, section 4): the portfolio door, as the contract writes it; every ask is recorded
      writes.push({ m, sub: 'portfolio', query: (u.split('?')[1] || '') }); body = { images: pics, total: pics.length, notices: [] };
    } else body = m === 'GET' ? H.answer(rt) : { ok: true };
    return r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });
  await p.goto(`http://localhost:${process.env.PORT}/vendor/off-season-shop`, { waitUntil: 'domcontentloaded', timeout: 240000 });
  // Wait on the room's own answer painted: its first item when open, its Coming soon when shut. (Not "Items ·": the rail
  // paints "Items · 0" before the room's read returns, which is how three runs of the old version passed by luck.)
  await waitFor(p, (src) => !!document.querySelector('.wl-main') && new RegExp(src).test(document.querySelector('.wl-main').innerText), thin === 'open' ? 'has nothing for sale yet' : open && !thin ? 'Makeup trial voucher' : 'Coming soon', 240000);
  return { p, writes, errors };
}
const text = (p) => p.evaluate(() => document.body.innerText);
async function tapText(p, re, sel = 'button, a, [role=switch]') {
  const ok_ = await p.evaluate((src, s) => { const rx = new RegExp(src); const el = [...document.querySelectorAll(s)].find((e) => rx.test((e.innerText || e.getAttribute('aria-label') || '').trim()) && e.offsetParent !== null); if (!el) return false; el.scrollIntoView({ block: 'center' }); return true; }, re.source, sel);
  if (!ok_) return false;
  const box = await p.evaluate((src, s) => { const rx = new RegExp(src); const el = [...document.querySelectorAll(s)].find((e) => rx.test((e.innerText || e.getAttribute('aria-label') || '').trim()) && e.offsetParent !== null); const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, re.source, sel);
  await p.touchscreen.tap(box.x, box.y); return true;
}
async function tapRow(p, re) {
  const box = await p.evaluate((src) => { const rx = new RegExp(src); const el = [...document.querySelectorAll('.fr-row')].find((e) => rx.test(e.innerText)); if (!el) return null; el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, re.source);
  if (!box) return false; await p.touchscreen.tap(box.x, box.y); return true;
}

(async () => {
  let server = null, b = null;
  try {
    const H = await import(path.join(ROOT, 'docs/design/tools/harness.mjs'));
    server = await dev.start(ROOT, +process.env.PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${process.env.PORT}/__api` });
    if (!(await server.up())) throw new Error('dev server did not come up');
    b = await H.browser();
    const bg = {};
    for (const mode of ['dark', 'light']) {
      sec(`${mode === 'dark' ? 'Graphite' : 'light'}: the room`);
      const { p, writes } = await openRoom(b, H, { mode });
      // The head's + pill is registered by an effect (RoomHeadAdd) and paints after the list: wait for the pill itself.
      await waitFor(p, () => [...document.querySelectorAll('button')].some((x) => /New item/.test(x.innerText)));
      let t = await text(p);
      ok(/Off-season shop/.test(t) && /New item/.test(t) && /Items/.test(t) && /Orders/.test(t) && /Vouchers/.test(t), `${mode} 1 the room head with + New item, and its three tabs`, t.slice(0, 200));
      // C29 (CE-47 option a): the room's places at 374, noted for the before-and-after comparison, and its picture.
      const at = await place(p); console.log(`  NOTE  ${mode} the room at ${JSON.stringify(at)}`); await shot(p, `${mode}_room`);
      ok(at.rail && at.chip && at.row && at.title && at.wide <= 374, `${mode} 1r the head, the rail, its chips and the first row draw inside the 374 column (places noted above)`, JSON.stringify(at));
      ok(/Makeup trial voucher[\s\S]*Rs 3,000/.test(t) && /12 of 20 seats left/.test(t) && /Hidden/.test(t), `${mode} 2 items: name, Rs, the fact line with seats; a hidden item says Hidden`);
      ok(/Show the shop on the website/.test(t) && await p.evaluate(() => document.querySelector('[role=switch]')?.getAttribute('aria-checked') === 'true'), `${mode} 3 the website switch, on while any item is shown`);
      bg[mode] = await p.evaluate(() => getComputedStyle(document.querySelector('.wl') || document.body).backgroundColor);
      // new item: a workshop asks for its date and seats, and the body posted carries its kind
      ok(await tapText(p, /^\+?\s*New item$/) && await sheetIs(p, 'New item'), `${mode} 4a + New item opens`);
      { const sh = await place(p); console.log(`  NOTE  ${mode} the New item sheet at ${JSON.stringify(sh.sheet)}`); await shot(p, `${mode}_sheet`); }
      t = await text(p);
      ok(/What are you selling\?/.test(t) && /Gift voucher/.test(t) && /Workshop/.test(t) && /Online class/.test(t) && /Booking/.test(t) && /Valid for \(months\)/.test(t), `${mode} 4b the sheet: four kinds first, a voucher's months by default`);
      await tapText(p, /^Workshop/); await mainHas(p, /Date and start time/); t = await text(p);
      ok(/Date and start time/.test(t) && /Seats/.test(t) && !/Valid for \(months\)/.test(t), `${mode} 4c Workshop: its date and seats, no voucher months`);
      await p.evaluate(() => { const set = (el, v) => { const d = Object.getOwnPropertyDescriptor(el.constructor.prototype, 'value'); d.set.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); };
        const f = [...document.querySelectorAll('.wl-fld')]; const by = (re) => f.find((x) => re.test(x.innerText))?.querySelector('input');
        set(by(/^Name/), 'Bridal glow masterclass'); set(by(/^Price/), '5000'); set(by(/Date and start time/), '2026-12-20T11:00'); set(by(/Place/), 'Saket'); set(by(/^Seats/), '15'); });
      await tapText(p, /^Save$/); await waitWrite(writes, (w) => w.m === 'POST' && w.sub === '/items'); await noSheet(p);
      const post = writes.find((w) => w.m === 'POST' && w.sub === '/items');
      ok(post && post.body.kind === 'workshop' && post.body.price === 5000 && post.body.seats_total === 15 && post.body.place === 'Saket' && post.body.starts_at === '2026-12-20T05:30:00.000Z', `${mode} 4d Save posts the workshop, 11:00 am in India as the instant OFF-A1 checks`, JSON.stringify(post && post.body));
      // R1: the class sheet carries the Class link field and says Meet is Coming soon
      await tapText(p, /^Items/); await mainHas(p, /Makeup trial voucher/); await tapText(p, /^Items/); await mainHas(p, /Show the shop on the website/);
      ok(/Makeup trial voucher/.test(await p.evaluate(() => document.querySelector('.wl-main')?.innerText || '')), `${mode} 9.0 tapping the open tab again keeps its list (it never goes blank)`);
      await tapRow(p, /Live online class/); await sheetIs(p, 'Live online class');
      ok(await p.evaluate(() => !!document.querySelector('.wl-sheet[aria-label="Live online class"]')), `${mode} 9a an online class opens its sheet`, await p.evaluate(() => (document.querySelector('.wl-sheet')?.getAttribute('aria-label') || 'no sheet') + ' | ' + document.querySelector('.wl-main')?.innerText.replace(/\s+/g, ' ').slice(0, 300)));
      t = await text(p);
      ok(/Class link \(your Meet or Zoom link, https:\/\/\)/.test(t) && await p.evaluate(() => [...document.querySelectorAll('input[type=url]')].some((i) => i.value === 'https://meet.google.com/abc-defg-hij'))
        && /A Google Meet link for each paid seat[\s\S]*Coming soon/.test(t), `${mode} 9b the Class link field holds her link; Google Meet reads Coming soon`);
      await p.evaluate(() => document.querySelector('.wl-shx')?.click()); await noSheet(p);
      // orders: an Asked order opens its sheet; Mark paid asks first; then the code goes to the buyer in one tap (G1)
      await tapText(p, /^Orders/); await mainHas(p, /Take payment on the website/); t = await text(p);
      ok(/Not paid yet[\s\S]*Ananya Gupta[\s\S]*Paid[\s\S]*Riya Sethi/.test(t) && /Take payment on the website[\s\S]*Coming soon/.test(t), `${mode} 5a Orders: Not paid yet, then Paid; payment links read Coming soon`);   // AMENDED BY LABEL · plain words (CE-47, 8 Oct): 'Asked' became 'Not paid yet'
      ok(await tapRow(p, /Ananya Gupta/) && await sheetIs(p, 'Order'), `${mode} 5b the Not paid yet row opens its sheet`);   // AMENDED BY LABEL · plain words
      t = await text(p);
      ok(/Mark paid/.test(t) && /Call/.test(t) && /WhatsApp/.test(t), `${mode} 5c the sheet: Call, WhatsApp, Mark paid`);
      await tapText(p, /^Mark paid$/); await mainHas(p, /Do this once the money is in your account/); t = await text(p);
      ok(/Do this once the money is in your account/.test(t) && !writes.some((w) => /paid$/.test(w.sub)), `${mode} 5d Mark paid asks first and writes nothing yet`);
      await tapText(p, /^Yes, mark paid$/); await waitWrite(writes, (w) => w.sub === '/orders/o1/paid'); await mainHas(p, /Send the code on WhatsApp/);
      ok(writes.some((w) => w.m === 'POST' && w.sub === '/orders/o1/paid'), `${mode} 5e then it marks the order paid`);
      const send = await p.evaluate(() => [...document.querySelectorAll('a')].find((a) => /Send the code on WhatsApp/.test(a.innerText))?.href || '');
      ok(/^https:\/\/wa\.me\/919811022338\?text=/.test(send) && /^Hi Ananya Gupta, your Makeup trial voucher from .+ is paid\. Your voucher code is K7QM-4XPA, valid until 5 October 2027\.$/.test(decodeURIComponent(send.split('text=')[1])) && !/voucher voucher/.test(decodeURIComponent(send)),
        `${mode} 5f G1: the code goes to the buyer in one tap, the words written`, send);
      await p.evaluate(() => document.querySelector('.wl-shx')?.click()); await noSheet(p);
      ok(await p.evaluate(() => !document.querySelector('.wl-sheet')), `${mode} 5g the sheet closes by its own control`);
      // R1: a paid online class with her link: the message carries it, labelled as hers; without a link, the room says so
      ok(await tapRow(p, /Meera Joshi/) && await sheetIs(p, 'Order') && await mainHas(p, /Send the class link on WhatsApp/), `${mode} 8a a paid online class order opens`);
      const cl = await p.evaluate(() => [...document.querySelectorAll('a')].find((a) => /Send the class link on WhatsApp/.test(a.innerText))?.href || '');
      ok(/^https:\/\/wa\.me\/919811022342\?text=/.test(cl) && /Class link from .+: https:\/\/meet\.google\.com\/abc-defg-hij$/.test(decodeURIComponent(cl.split('text=')[1] || '')), `${mode} 8b R1: her class link goes to the paid seat in one tap, "Class link from" her studio`, cl);
      await p.evaluate(() => document.querySelector('.wl-shx')?.click()); await noSheet(p);
      ok(await tapRow(p, /Tara Nair/) && await mainHas(p, /No class link is set for this item/), `${mode} 8c a paid online class with no link opens`);
      t = await text(p);
      ok(/No class link is set for this item/.test(t) && await p.evaluate(() => [...document.querySelectorAll('a')].some((a) => /Send the class link from WhatsApp/.test(a.innerText) && /^https:\/\/wa\.me\/919811022343$/.test(a.href))), `${mode} 8d no link set: the room says so, the buyer's chat one tap away`);
      await p.evaluate(() => document.querySelector('.wl-shx')?.click()); await noSheet(p);
      // vouchers: check a code, then Mark redeemed asks first and writes once
      await tapText(p, /^Vouchers/); await waitFor(p, () => !!document.querySelector('input[aria-label="Check a code"]'));
      await p.evaluate(() => { const i = document.querySelector('input[aria-label="Check a code"]'); if (!i) return; const d = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value'); d.set.call(i, 'k7qm4xpa'); i.dispatchEvent(new Event('input', { bubbles: true })); });
      await tapText(p, /^Check$/); await waitWrite(writes, (w) => w.sub === '/vouchers/check'); await mainHas(p, /Valid until 5 October 2027/); t = await text(p);
      ok(/Paid Rs 3,000 on 5 October 2026 · Valid until 5 October 2027/.test(t) && writes.some((w) => w.sub === '/vouchers/check' && w.body.code === 'k7qm4xpa'), `${mode} 6a Check a code finds it and reads it in full months`);
      await tapText(p, /^Mark redeemed$/); await mainHas(p, /This cannot be undone/); t = await text(p);
      ok(/This cannot be undone/.test(t) && !writes.some((w) => w.sub === '/vouchers/redeem'), `${mode} 6b Mark redeemed asks first`);
      await tapText(p, /^Yes, mark it used$/); await waitWrite(writes, (w) => w.sub === '/vouchers/redeem');
      ok(writes.filter((w) => w.sub === '/vouchers/redeem').length === 1, `${mode} 6c then redeems, once`);
      await p.close();
      // shut: Coming soon and nothing else
      const s2 = await openRoom(b, H, { mode, open: false }); t = await text(s2.p);
      ok(/Coming soon/.test(t) && !/New item/.test(t) && !/Vouchers/.test(t), `${mode} 7 while the shop is shut the room reads Coming soon and offers nothing`);
      await s2.p.close();
      // lesson 2 (CE-47): a thin answer never blanks the room and never throws
      const s3 = await openRoom(b, H, { mode, thin: 'bare' }); t = await text(s3.p);
      ok(/Off-season shop/.test(t) && /Coming soon/.test(t) && !/New item/.test(t) && !s3.errors.length, `${mode} 7t a thin answer ({ ok: true }, no lists, no open): the room reads Coming soon, nothing thrown`, JSON.stringify(s3.errors));
      await s3.p.close();
      const s4 = await openRoom(b, H, { mode, thin: 'open' }); t = await text(s4.p);
      ok(/Your shop has nothing for sale yet/.test(t) && /Items/.test(t) && /Orders/.test(t) && /Vouchers/.test(t) && !s4.errors.length, `${mode} 7u open with no lists: the head, the three tabs and the empty words, nothing thrown`   /* AMENDED BY LABEL · R-47.1: the empty words are sentences */, JSON.stringify(s4.errors));
      if (await tapText(s4.p, /^Orders/)) { ok(await mainHas(s4.p, /There are no orders yet/) && !s4.errors.length, `${mode} 7v its Orders tab reads There are no orders yet`   /* AMENDED BY LABEL · R-47.1 */, JSON.stringify(s4.errors)); } else ok(false, `${mode} 7v its Orders tab reads There are no orders yet`   /* AMENDED BY LABEL · R-47.1 */, 'no Orders tab to tap');
      await s4.p.close();
    }
    sec('R-47.2: the picture picker (WEB-4 cut 30, section 4)');
    {
      const PIC = (n, shown, extra = {}) => ({ id: `p${n}`, image_url: `https://res.cloudinary.com/tdw/image/upload/v1/p${n}.jpg`, caption: null, is_hero: false, in_carousel: true, shown_on_her_pages: shown, shown_on_discover: shown, notice: shown ? null : 'TDW is checking this picture. It is not shown yet.', ...extra });
      const openPicker = async (pics) => {
        const r = await openRoom(b, H, { mode: 'dark', pics });
        await waitFor(r.p, () => [...document.querySelectorAll('button')].some((x) => /New item/.test(x.innerText)));
        await tapText(r.p, /^\+?\s*New item$/); await sheetIs(r.p, 'New item');
        await tapText(r.p, /^Pick from your portfolio$/);
        await waitFor(r.p, () => !!document.querySelector('.os-pics button') || /Your portfolio has no pictures to choose from yet\./.test(document.body.innerText));
        return r;
      };
      // three pictures: one passed, one never checked (live on her pages), one held
      let r = await openPicker([PIC(1, true), PIC(2, true, { shown_on_discover: false }), PIC(3, false)]);
      const offered = await r.p.evaluate(() => [...document.querySelectorAll('.os-pics img')].map((i) => i.getAttribute('src')));
      ok(offered.length === 2 && offered.every((u) => /p[12]\.jpg$/.test(u)), 'P1 the picker offers every picture shown on her pages, the one not on Discover too, and never a held one', JSON.stringify(offered));
      ok(r.writes.some((w) => w.sub === 'portfolio' && /(^|&)state=all(&|$)/.test(w.query)) && !r.writes.some((w) => w.sub === 'portfolio' && /approved/.test(w.query)), 'P2 it asks the door for state=all and never for an approval state', JSON.stringify(r.writes.filter((w) => w.sub === 'portfolio')));
      await r.p.close();
      // all held, or an older answer without the flag: nothing is offered and the empty line says so
      r = await openPicker([PIC(4, false), { id: 'p5', image_url: 'https://res.cloudinary.com/tdw/image/upload/v1/p5.jpg' }]);
      const empty = await r.p.evaluate(() => ({ n: document.querySelectorAll('.os-pics img').length, line: /Your portfolio has no pictures to choose from yet\./.test(document.body.innerText) }));
      ok(empty.n === 0 && empty.line, 'P3 with only held pictures (or no shown_on_her_pages on the answer) nothing is offered, and the line reads "Your portfolio has no pictures to choose from yet."', JSON.stringify(empty));
      ok(!r.errors.length, 'P4 nothing thrown', JSON.stringify(r.errors));
      await r.p.close();
    }
    sec('both themes');
    ok(bg.dark && bg.light && bg.dark !== bg.light, 'the room is drawn in each theme\'s own ground', JSON.stringify(bg));
    const src = fs.readFileSync(path.join(ROOT, 'v2/app/vendor/(shell)/off-season-shop/page.tsx'), 'utf8');
    ok(!/#[0-9a-f]{3,8}\b|rgba?\(/i.test(src.slice(src.indexOf('const CSS'), src.indexOf('`;', src.indexOf('const CSS')))), 'no colour of its own: the room\'s CSS reads only tokens (R-42.6)');
    ok(fs.existsSync(path.join(ROOT, 'app/v2/vendor/(shell)/off-season-shop/page.tsx')), 'the re-export door exists (a v2 room without it is a 404)');
  } catch (e) { fail += 1; failed.push('harness: ' + (e && e.message)); console.log('  FAIL  harness: ' + (e && e.stack)); }
  finally { await closeBrowser(b); if (server) await stopTree(server); }
  console.log(`\nb232_ce47_off_a2_shop_room_bench: ${pass} passed, ${fail} failed  (total ${pass + fail})`);
  process.exit(fail ? 1 : 0);
})();
