// scripts/lib/b129_scroll_probe.mjs · TDW CE-45 · G6-1 · F-44.166 · the scroll census, in a REAL headless Chromium against
// `next dev` (C-43.18). Run by scripts/b129_g61_settings_scroll_bench.js. usage: node … PORT MODE ROUTE · prints ONE line of JSON.
import fs from 'fs';
import puppeteer from '../../node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
const [PORT = '3994', MODE_ARG = 'dark', ROUTE = '/vendor/settings'] = process.argv.slice(2);
const MODE = MODE_ARG === 'light' ? 'light' : 'dark';
async function resolveBin() { const env = process.env.CHROME_BIN; if (env && fs.existsSync(env)) return env;
  try { const m = await import('@sparticuz/chromium'); const c = m.default || m; const p = await c.executablePath(); if (p && fs.existsSync(p)) return p; } catch (_e) { /* none */ } return null; }
const bin = await resolveBin();
if (!bin) { console.log(JSON.stringify({ browser: null })); process.exit(3); }
const b = await puppeteer.launch({ executablePath: bin, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const out = { mode: MODE, route: ROUTE, errors: [] };
try {
  const p = await b.newPage();
  await p.setViewport({ width: 374, height: 900, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  p.on('pageerror', (e) => out.errors.push(String(e && e.message).split('\n')[0]));
  const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
  await p.setCookie({ name: 'tdw_wl_mode', value: MODE, domain: 'localhost', path: '/' });
  await p.setRequestInterception(true);
  const vendor = { id: 'v1', name: 'Dev Roy', business_name: 'Dev Roy Photography', category: 'photographer', city: 'Delhi', handle: 'DEV440', peer_discoverable: true, exchange_discoverable: false, enquiry_routing: 'tdw', enquiry_phone: null };
  p.on('request', (r) => { if (!r.url().includes('/__api/')) return r.continue();
    return r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, vendor }) }); });
  await p.goto(`http://localhost:${PORT}${ROUTE}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  for (let i = 0; i < 120; i += 1) { if (await p.evaluate(() => !!document.querySelector('main.wl-main') && document.body.innerText.length > 200)) break; await new Promise((r) => setTimeout(r, 500)); }
  await new Promise((r) => setTimeout(r, 3000));
  Object.assign(out, await p.evaluate(() => {
    const scrollers = [];
    for (const el of document.querySelectorAll('*')) { const cs = getComputedStyle(el);
      if (!/(auto|scroll)/.test(cs.overflowY) || el.scrollHeight <= el.clientHeight + 1) continue;
      scrollers.push({ tag: el.tagName, cls: String(el.className || '').slice(0, 30), h: el.clientHeight, sh: el.scrollHeight }); }
    const main = document.querySelector('main.wl-main');
    const find = (t) => [...document.querySelectorAll('button, span, p, div')].find((e) => e.childElementCount === 0 && e.textContent.trim() === t);
    const signOut = find('Sign out');
    let signOutVisible = false;
    if (main && signOut) { main.scrollTop = main.scrollHeight; const r = signOut.getBoundingClientRect(); const mr = main.getBoundingClientRect(); signOutVisible = r.top >= mr.top - 1 && r.bottom <= mr.bottom + 1 && r.height > 0; }
    return { scrollers, main: main ? { h: main.clientHeight, sh: main.scrollHeight } : null, hasSignOut: !!signOut, signOutVisible, doc: { sh: document.scrollingElement.scrollHeight, ch: document.scrollingElement.clientHeight } };
  }));
} catch (e) { out.errors.push(`probe: ${String(e && e.message).split('\n')[0]}`); }
finally { await b.close(); }
console.log(JSON.stringify(out));
