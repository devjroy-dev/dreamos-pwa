// scripts/lib/b125_enquiry_row_probe.mjs · TDW CE-45 · G6-1 · FE_2 (pwa half) · §7c's Settings row driven in a REAL
// headless Chromium against `next dev` (C-43.18). Run by scripts/b125_g61_enquiry_row_bench.js, which spawns next dev.
// /api/v2/vendor/me is answered AT THE NETWORK: GET gives her row for the SCENARIO; PATCH is recorded and answered
// the way the scenario's door would (the real door's rules; a silent refusal; an older door that drops the field).
// usage: node scripts/lib/b125_enquiry_row_probe.mjs PORT MODE SCENARIO [SHOTDIR]  · prints ONE line of JSON.
import fs from 'fs';
import path from 'path';
import puppeteer from '../../node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';

const PORT = process.argv[2] || '3992';
const MODE = process.argv[3] === 'light' ? 'light' : 'dark';
const SCENARIO = process.argv[4] || 'sList';
const SHOTDIR = process.argv[5] || '';
const TYPE = JSON.parse(process.env.B125_TYPE || '{}');   // the words the probe taps, passed by the bench

async function resolveBin() {
  const env = process.env.CHROME_BIN;
  if (env && fs.existsSync(env)) return env;
  try { const m = await import('@sparticuz/chromium'); const c = m.default || m; const p = await c.executablePath(); if (p && fs.existsSync(p)) return p; } catch (_e) { /* none */ }
  return null;
}
const bin = await resolveBin();
if (!bin) { console.log(JSON.stringify({ browser: null })); process.exit(3); }

const START = SCENARIO === 'sBack' ? { enquiry_routing: 'own_number', enquiry_phone: '+91 98882 94440' } : { enquiry_routing: 'tdw', enquiry_phone: null };
const row = { id: 'v1', business_name: 'Dev Roy Photography', name: 'Dev Roy', category: 'photographer', peer_discoverable: true, exchange_discoverable: false, ...START };
const door = (body) => {
  // the real door's rules (dream-os me.js validateEnquiryRouting), unless the scenario says otherwise
  if (SCENARIO === 'sSilent') return { ok: true, vendor: { ...row, enquiry_routing: 'tdw' } };           // answers ok, changes nothing
  if (SCENARIO === 'sUnlisted') { const v = { ...row }; delete v.enquiry_routing; delete v.enquiry_phone; return { ok: true, vendor: v }; }   // an older door
  const next = { ...row, ...body };
  const d = String(next.enquiry_phone || '').replace(/\D/g, '');
  if (body.enquiry_routing === 'own_waba') return { __status: 400, ok: false, error: "'own_waba' arrives with Own number.", code: 'ENQUIRY_ROUTING' };
  if (next.enquiry_routing === 'own_number' && (d.length < 10 || d.length > 15)) return { __status: 400, ok: false, error: 'phone', code: 'ENQUIRY_ROUTING' };
  Object.assign(row, body);
  return { ok: true, vendor: { ...row } };
};

const b = await puppeteer.launch({ executablePath: bin, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const out = { mode: MODE, scenario: SCENARIO, patches: [], screens: [], errors: [] };
try {
  const p = await b.newPage();
  await p.setViewport({ width: 374, height: 900, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  p.on('pageerror', (e) => out.errors.push(String(e && e.message).split('\n')[0]));
  await p.setCookie({ name: 'tdw_wl_mode', value: MODE, domain: 'localhost', path: '/' });
  // The PWA's service worker would answer /__api after the first load and bypass the interception (Next then
  // answers 404, the row's /me load fails, and it sits on its default). b120's probe learnt this first.
  const cdp = await p.createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Network.setBypassServiceWorker', { bypass: true });
  await p.setRequestInterception(true);
  p.on('request', (r) => {
    const u = r.url();
    if (!u.includes('/__api/')) return r.continue();
    const route = u.split('/__api')[1].split('?')[0];
    const json = (o) => { const st = o.__status || 200; delete o.__status; return r.respond({ status: st, contentType: 'application/json', body: JSON.stringify(o) }); };
    if (route === '/api/v2/vendor/me' && r.method() === 'GET') return json({ ok: true, vendor: { ...row } });
    if (route === '/api/v2/vendor/me' && r.method() === 'PATCH') { const body = JSON.parse(r.postData() || '{}'); out.patches.push(body); return json(door(body)); }
    return json({ ok: true });
  });
  const settle = (ms = 900) => new Promise((res) => setTimeout(res, ms));
  const readRow = async (label) => {
    const s = await p.evaluate(() => {
      const box = document.querySelector('[data-enquiry-row]');
      if (!box) return { row: null };
      const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const opts = [...box.querySelectorAll('[data-option]')].map((o) => ({ key: o.getAttribute('data-option'), checked: o.getAttribute('aria-checked'), disabled: o.getAttribute('aria-disabled'), text: o.innerText.trim() }));
      return {
        row: box.getAttribute('data-enquiry-row'),
        texts: [...box.querySelectorAll('.wl-swlabel,.wl-swline,.wl-setrowlabel')].filter(vis).map((e) => e.textContent.trim()),
        options: opts,
        input: !!box.querySelector('input#wl-enquiry-phone'),
      };
    });
    s.label = label; out.screens.push(s);
    if (SHOTDIR) { fs.mkdirSync(SHOTDIR, { recursive: true }); await p.screenshot({ path: path.join(SHOTDIR, `b125__${SCENARIO}__${label}__${MODE}.png`), fullPage: true }); }
    return s;
  };
  const tapOption = (key) => p.evaluate((k) => { const o = document.querySelector(`[data-enquiry-row] [data-option="${k}"]`); if (o) { o.click(); return true; } return false; }, key);
  const tapButton = (text) => p.evaluate((t) => { const b2 = [...document.querySelectorAll('[data-enquiry-row] button')].find((e) => e.textContent.trim() === t); if (b2) { b2.click(); return true; } return false; }, text);
  const type = async (v) => { await p.evaluate(() => { const i = document.querySelector('#wl-enquiry-phone'); if (i) { i.focus(); i.select(); } }); await p.keyboard.press('Backspace'); await p.type('#wl-enquiry-phone', v); };
  await p.goto(`http://localhost:${PORT}/vendor/settings`, { waitUntil: 'domcontentloaded', timeout: 90000 });
  for (let i = 0; i < 120; i += 1) { if (await p.evaluate(() => !!document.querySelector('[data-enquiry-row]'))) break; await settle(500); }
  await settle(1200);
  await p.evaluate(() => { const e = document.querySelector('[data-enquiry-row]'); if (e) e.scrollIntoView(); });
  await readRow('list');
  if (SCENARIO === 'sOwn' || SCENARIO === 'sSilent' || SCENARIO === 'sUnlisted') {
    out.tapped = await tapOption('own_number'); await settle(); await readRow('consent');
    out.patchesBeforeConfirm = out.patches.length;
    if (SCENARIO === 'sOwn') { await type('12345'); await tapButton(TYPE.confirm); await settle(); await readRow('invalid'); out.patchesAfterInvalid = out.patches.length; }
    await type('+91 87577 88550'); await tapButton(TYPE.confirm); await settle(1500); await readRow('after');
  } else if (SCENARIO === 'sBack') {
    await tapOption('tdw'); await settle(1500); await readRow('after');
  } else if (SCENARIO === 'sCancel') {
    await tapOption('own_number'); await settle(); await readRow('consent'); await tapButton(TYPE.cancel); await settle(); await readRow('after');
  } else if (SCENARIO === 'sWaba') {
    await tapOption('own_waba'); await settle(); await readRow('after');
  }
} catch (e) { out.errors.push(`probe: ${String(e && e.message).split('\n')[0]}`); }
finally { await b.close(); }
console.log(JSON.stringify(out));
