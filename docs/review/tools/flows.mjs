// docs/review/tools/flows.mjs · the five daily tasks, walked from Home, every step screenshotted.
// usage: node flows.mjs [mode] [vp]   → docs/review/screenshots/flows/<task>/<n>-<step>.png
import fs from 'fs';
import path from 'path';
import { browser, open, shot, sleep, OUT } from './harness.mjs';
const [mode = 'dark', vp = 'ios'] = process.argv.slice(2);

async function tapText(p, txt) {
  return p.evaluate((src) => {
    const rx = new RegExp(src, 'i');
    const cand = [...document.querySelectorAll('a,button,[role=button],[role=tab],li,div,span,label,option')].filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && rx.test((e.innerText || e.getAttribute('aria-label') || '').trim()); });
    cand.sort((a, c) => (a.innerText || '').length - (c.innerText || '').length);
    const el = cand[0]; if (!el) return false;
    const C = 'a,button,[role=button],[role=tab],[tabindex]'; const t = el.closest(C) || el.querySelector(C) || el;
    t.scrollIntoView({ block: 'center' }); t.click(); return true;
  }, txt);
}
async function scrollSheet(p, n) {
  await p.evaluate((n) => { const sh = [...document.querySelectorAll('body *')].filter((e) => e.scrollHeight > e.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(e).overflowY) && e.getBoundingClientRect().height > 100).sort((a, c) => (+getComputedStyle(c).zIndex || 0) - (+getComputedStyle(a).zIndex || 0) || c.getBoundingClientRect().top - a.getBoundingClientRect().top)[0]; (sh || document.scrollingElement).scrollBy(0, n); }, n);
}
async function selectOption(p, re) {
  return p.evaluate((src) => { const s = [...document.querySelectorAll('select')].find((e) => e.getBoundingClientRect().width > 0 && [...e.options].some((o) => new RegExp(src, 'i').test(o.text))); if (!s) return false; const o = [...s.options].find((o) => new RegExp(src, 'i').test(o.text)); const set = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set; set.call(s, o.value); s.dispatchEvent(new Event('change', { bubbles: true })); return true; }, re);
}
async function typeInto(p, labelRe, value) {
  const h = await p.evaluateHandle((src) => { const rx = new RegExp(src, 'i'); const ins = [...document.querySelectorAll('input,textarea')].filter((e) => e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().top < innerHeight && e.getBoundingClientRect().bottom > 0);
    return ins.find((e) => { const l = (e.closest('label') || {}).innerText || ''; const prev = e.parentElement ? e.parentElement.innerText : ''; return rx.test(e.placeholder || '') || rx.test(e.getAttribute('aria-label') || '') || rx.test(l) || rx.test(prev); }) || null; }, labelRe);
  const el = h.asElement(); if (!el) return false; await el.click(); await el.type(value, { delay: 5 }); return true;
}

// Each step: [label, action, counts] where counts is 'tap' | 'type' | 'scroll' | null (first screen)
const TASKS = {
  'a-reply-to-enquiry': ['/vendor/today', [
    ['home', null],
    ['open-enquiry', (p) => tapText(p, '^Aanya Kapoor$'), 'tap'],
    ['scroll-to-conversation', (p) => scrollSheet(p, 700), 'scroll'],
    ['whatsapp-button', null, 'tap (leaves the app)'],
  ]],
  'b-check-a-date': ['/vendor/today', [
    ['home', null],
    ['rooms', (p) => tapText(p, '^Rooms$'), 'tap'],
    ['calendar', (p) => tapText(p, '^Calendar$'), 'tap'],
    ['next-month-x5', async (p) => { for (let i = 0; i < 5; i += 1) { await tapText(p, '^›$'); await sleep(350); } }, 'tap x5'],
    ['day-14', (p) => tapText(p, '^14$'), 'tap'],
  ]],
  'c-enquiry-to-booked-client': ['/vendor/today', [
    ['home', null],
    ['open-enquiry', (p) => tapText(p, '^Aanya Kapoor$'), 'tap'],
    ['attach-package', (p) => tapText(p, '^Attach package$'), 'tap'],
    ['choose-package-fee-fills', (p) => selectOption(p, 'Full wedding'), 'tap x2 (open list, pick)'],
    ['attach', async (p) => { const ok = await p.evaluate(() => { const b = [...document.querySelectorAll('button')].filter((e) => /^Attach package$/i.test(e.innerText.trim())).pop(); if (!b) return false; b.click(); return true; }); return ok; }, 'tap'],
    ['booking-confirmed', (p) => tapText(p, '^Booking confirmed$'), 'tap'],
    ['confirm-booking', (p) => tapText(p, '^Confirm booking$'), 'tap'],
    ['lead-sheet-after', (p) => scrollSheet(p, -2000), 'none'],
    ['clients-room', async (p) => { await p.goto(p.url().replace(/\/vendor\/.*/, '/vendor/rooms')); await sleep(2500); await tapText(p, '^Clients$'); }, 'tap x2 (Rooms, Clients)'],
  ]],
  'd-send-invoice-and-see-who-owes': ['/vendor/today', [
    ['home', null],
    ['rooms', (p) => tapText(p, '^Rooms$'), 'tap'],
    ['invoices', (p) => tapText(p, '^Invoices$'), 'tap'],
    ['new-invoice', (p) => p.evaluate(() => document.querySelector('.wl-fab').click()), 'tap'],
    ['fill', async (p) => { await typeInto(p, 'client name', 'Aanya Kapoor'); await typeInto(p, 'total amount|^Rs$', '250000'); }, 'tap + type x2'],
    ['create-then-open-an-invoice', (p) => tapText(p, '^Meera and Kunal$'), 'tap x2 (Create, open)'],
    ['send-on-whatsapp', null, 'tap (leaves the app)'],
  ]],
  'e-today-and-week-with-crew': ['/vendor/today', [
    ['home', null],
    ['home-scrolled-events', (p) => scrollSheet(p, 520), 'scroll'],
    ['event-sheet-no-crew', (p) => tapText(p, 'Haldi'), 'tap'],
    ['rooms', async (p) => { await p.goto(p.url().replace(/\/vendor\/.*/, '/vendor/rooms')); await sleep(2500); }, 'tap (back) + tap'],
    ['calendar', (p) => tapText(p, '^Calendar$'), 'tap'],
    ['today-28', (p) => tapText(p, `^${new Date().getDate()}$`), 'tap'],
    ['crew-for-haldi', (p) => tapText(p, '^Crew$'), 'tap'],
    ['close-then-weddings-view', async (p) => { await p.keyboard.press('Escape'); await sleep(500); await p.goto(p.url()); await sleep(2500); await tapText(p, '^Weddings$'); }, 'tap x3 (close, close, Weddings)'],
  ]],
};

const b = await browser();
const log = {};
for (const [task, [route, steps]] of Object.entries(TASKS)) {
  const p = await open(b, route, { mode, vp });
  log[task] = [];
  let n = 0;
  for (const [label, act, counts] of steps) {
    let ok = true;
    if (act) { ok = await act(p); await sleep(1500); }
    if (label === 'whatsapp-button' || label === 'send-on-whatsapp') {
      // highlight the button the vendor taps next, then shoot
      await p.evaluate(() => { const b = [...document.querySelectorAll('a,button')].find((e) => /whatsapp/i.test(e.innerText) && e.getBoundingClientRect().width > 0); if (b) { b.style.outline = '3px solid #FF3B7F'; b.style.outlineOffset = '2px'; } });
    }
    n += 1;
    const rel = `screenshots/flows/${task}/${mode}-${vp}-${String(n).padStart(2, '0')}-${label}.png`;
    await shot(p, rel);
    log[task].push({ step: n, label, counts: counts || '', ok: ok !== false, url: p.url().replace(/^https?:\/\/[^/]+/, ''), shot: rel });
    console.log(task, n, label, ok !== false ? 'ok' : 'NOT FOUND');
  }
  await p.close();
}
fs.writeFileSync(path.join(OUT, `tools/data/flows-${mode}-${vp}.json`), JSON.stringify(log, null, 1));
await b.close();
