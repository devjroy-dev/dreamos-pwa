// scripts/lib/b289p_cards_probe.mjs · CE-47 · CLB PART C · the package cards in the room "WhatsApp and Instagram", driven in a
// REAL headless Chromium against `next dev` (C-43.18, b126's method). Run by scripts/b289p_clb_c_ig_package_cards_app_bench.js,
// which starts and stops the server. Lives in scripts/lib/ so run-floor.sh's flat glob never collects it (e-44.20).
// THE DOORS ARE MOCKED AT THE NETWORK per SCENARIO: /solutions/number (404: G6's shell), /solutions/instagram (on),
// /solutions/quiet (2 hours), /solutions/instagram/package-cards (the scenario's). Pictures are answered with a 1x1 png
// from the probe itself; nothing leaves the machine.
// usage: node scripts/lib/b289p_cards_probe.mjs PORT LAYOUT MODE SCENARIO   -> one line of JSON; exit 3 = no browser.
import fs from 'fs';
import puppeteer from '../../node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';

const PORT = process.argv[2] || '3993';
const LAYOUT = process.argv[3] === 'classic' ? 'classic' : 'v2';
const MODE = process.argv[4] === 'light' ? 'light' : 'dark';
const SC = process.argv[5] || 'c404';
const TAPS = JSON.parse(process.env.B289P_TAPS || '{}');
const LINES = JSON.parse(process.env.B289P_LINES || '{}');
const PIC = 'https://pictures.tdw.test/cover-1.jpg';
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

function usable(p) { try { return !!p && fs.statSync(p).isFile(); } catch (_e) { return false; } }
async function resolveBin() {
  const tried = [];
  const env = process.env.CHROME_BIN;
  tried.push(`CHROME_BIN=${env || '(unset)'}`);
  if (usable(env)) return { bin: env, how: 'CHROME_BIN', tried };
  try {
    const mod = await import('@sparticuz/chromium');
    const chromium = mod.default || mod;
    const p = await chromium.executablePath();
    tried.push(`@sparticuz/chromium executablePath()=${p || '(none)'}`);
    if (usable(p)) return { bin: p, how: '@sparticuz/chromium', tried };
  } catch (e) { tried.push(`@sparticuz/chromium threw: ${String(e && e.message).split('\n')[0]}`); }
  return { bin: null, how: null, tried };
}

const THREE = [
  { title: 'Wedding day film', subtitle: 'From Rs 1,25,000', image_url: PIC, button: 'See details' },
  { title: 'Pre-wedding shoot', subtitle: null, image_url: null, button: 'See details' },
  { title: 'Album only', subtitle: 'From Rs 40,000', image_url: null, button: null },
];
const door = (state, cards = THREE) => ({ ok: true, state, line: LINES[state] || 'x', cards });
const TWELVE = Array.from({ length: 12 }, (_, i) => ({ title: `Package ${i + 1}`, subtitle: 'From Rs 10,000', image_url: PIC, button: 'See details' }));
// What GET answers, in turn (the last one repeats); what POST answers.
const GETS = {
  c404: [null], cBad: [{ ok: true, state: 'live', line: 'x', cards: [] }],
  cOn: [door('on')], cOff: [door('off')], cNone: [door('no_packages', [])], cFull: [door('full')],
  cFailed: [door('failed'), door('on')], cNotConn: [door('not_connected', [])], cPostFail: [door('on')],
  cTen: [door('on', TWELVE)], cBadPic: [door('on', [{ title: 'Wedding day film', subtitle: null, image_url: 'http://pictures.tdw.test/x.jpg', button: 'See details' }])],
};
const POSTS = { cOn: door('off'), cOff: door('on'), cPostFail: { ok: false } };
const json = (o, status = 200) => ({ status, contentType: 'application/json', body: JSON.stringify(o) });
const notFound = { status: 404, contentType: 'text/html', body: '<!DOCTYPE html><pre>Cannot GET</pre>' };

const { bin, how, tried } = await resolveBin();
if (!bin) { console.log(JSON.stringify({ browser: null, tried })); process.exit(3); }
const b = await puppeteer.launch({ executablePath: bin, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
// next dev runs React in strict mode, so a mount may ask twice: the answer moves to the next one only after a tap.
const out = { browser: how, layout: LAYOUT, mode: MODE, scenario: SC, gets: 0, getsAfterTap: 0, tappedYet: false, posts: [], outside: [], screens: [], errors: [] };
try {
  const p = await b.newPage();
  await p.setViewport({ width: 374, height: 780, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  p.on('pageerror', (e) => out.errors.push(String(e && e.message).split('\n')[0]));
  await p.setCookie({ name: 'tdw_wl_mode', value: MODE, domain: 'localhost', path: '/' },
    { name: 'tdw_layout', value: LAYOUT, domain: 'localhost', path: '/' });
  const cdp = await p.createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Network.setBypassServiceWorker', { bypass: true });   // b120's precedent
  await p.setRequestInterception(true);
  p.on('request', (r) => {
    const u = r.url();
    if (u.startsWith('https://pictures.tdw.test/')) return r.respond({ status: 200, contentType: 'image/png', body: PNG });
    if (!u.startsWith(`http://localhost:${PORT}/`)) { out.outside.push(u); return r.abort('blockedbyclient'); }
    if (!u.includes('/__api/')) return r.continue();
    const route = u.split('/__api')[1].split('?')[0];
    const base = '/api/v2/vendor/solutions';
    if (route === `${base}/number`) return r.respond(notFound);
    if (route === `${base}/instagram` && r.method() === 'GET') return r.respond(json({ ok: true, state: 'on', authorize_url: null }));
    if (route === `${base}/quiet` && r.method() === 'GET') return r.respond(json({ ok: true, minutes: 120 }));
    if (route === `${base}/instagram/package-cards` && r.method() === 'GET') {
      const list = GETS[SC] || [null]; const d = list[out.tappedYet ? list.length - 1 : 0]; out.gets += 1; if (out.tappedYet) out.getsAfterTap += 1;
      return d === null ? r.respond(notFound) : r.respond(json(d));
    }
    if (route === `${base}/instagram/package-cards` && r.method() === 'POST') {
      out.posts.push(JSON.parse(r.postData() || '{}'));
      return r.respond(json(POSTS[SC] || { ok: false }));
    }
    return r.respond(json({ ok: true }));
  });
  const settle = (ms) => new Promise((res) => setTimeout(res, ms));
  const waitFor = async (pred, ms = 60000) => { for (let i = 0; i < ms / 250; i += 1) { if (await pred()) return true; await settle(250); } return false; };
  const read = async (label) => {
    const s = await p.evaluate(() => {
      const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const sec = document.querySelector('section[data-meta-room="package-cards"]');
      const ig = document.querySelector('section[data-meta-room="instagram"]');
      if (!sec) return { cards: null, ig: !!ig, pageWide: document.documentElement.scrollWidth > window.innerWidth };
      const row = sec.querySelector('ul.pc-row');
      const lis = row ? [...row.querySelectorAll('li')] : [];
      const add = sec.querySelector('a[data-pc-add]');
      const err = sec.querySelector('.sol-err');
      return {
        ig: !!ig,
        state: sec.getAttribute('data-state'),
        heading: (sec.querySelector('h2') || {}).textContent || null,
        line: (sec.querySelector('p.sol-empty') || {}).textContent || null,
        buttons: [...sec.querySelectorAll('.sol-actions button')].filter(vis).map((e) => e.textContent.trim()),
        add: add ? { text: add.textContent.trim(), href: add.getAttribute('href') } : null,
        err: err ? err.textContent.trim() : null,
        rowLabel: row ? row.getAttribute('aria-label') : null,
        cards: lis.map((li) => ({
          title: (li.querySelector('.pc-title') || {}).textContent || null,
          sub: (li.querySelector('.pc-sub') || {}).textContent || null,
          pic: (li.querySelector('img') || {}).src || null,
          picLoaded: !!(li.querySelector('img') && li.querySelector('img').naturalWidth > 0),
          btn: (li.querySelector('.pc-btn') || {}).textContent || null,
          controls: li.querySelectorAll('a,button,input,[onclick],[tabindex]').length,
        })),
        rowScrolls: row ? row.scrollWidth > row.clientWidth : false,
        pageWide: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
    s.label = label; out.screens.push(s); return s;
  };
  const tap = (text) => { out.tappedYet = true; return tapNow(text); };
  const tapNow = (text) => p.evaluate((t) => {
    const btn = [...document.querySelectorAll('section[data-meta-room="package-cards"] .sol-actions button')].find((e) => e.textContent.trim() === t);
    if (btn) { btn.click(); return true; } return false;
  }, text);
  const stateIs = (v) => p.evaluate((x) => { const s = document.querySelector('section[data-meta-room="package-cards"]'); return !!s && s.getAttribute('data-state') === x; }, v);
  await p.goto(`http://localhost:${PORT}/vendor/number`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  // Wait on conditions, never on a fixed pause (e-275): the Instagram section and the quiet row are drawn, and every
  // package-cards GET the scenario expects has been answered.
  await waitFor(() => p.evaluate(() => !!document.querySelector('section[data-meta-room="instagram"]') && !!document.querySelector('section[data-meta-room="quiet"]')), 90000);
  await waitFor(async () => out.gets >= 1, 30000);
  if (GETS[SC] && GETS[SC][0] !== null && GETS[SC][0].state !== 'live') await waitFor(() => p.evaluate(() => !!document.querySelector('section[data-meta-room="package-cards"]')), 15000);
  else await settle(1500);   // an absent section has no condition to wait on: the answered GET plus a short settle
  await read('landing');
  out.tapped = [];
  if (SC === 'cOn') { out.tapped.push(await tap(TAPS.turnOff)); await waitFor(() => stateIs('off'), 15000); await read('after'); }
  if (SC === 'cOff') { out.tapped.push(await tap(TAPS.turnOn)); await waitFor(() => stateIs('on'), 15000); await read('after'); }
  if (SC === 'cFailed') { out.tapped.push(await tap(TAPS.retry)); await waitFor(() => stateIs('on'), 15000); await read('after'); }
  if (SC === 'cPostFail') {
    out.tapped.push(await tap(TAPS.turnOff));
    await waitFor(() => p.evaluate(() => !!document.querySelector('section[data-meta-room="package-cards"] .sol-err')), 15000);
    await read('after');
  }
} catch (e) {
  out.errors.push(`probe: ${String(e && e.message).split('\n')[0]}`);
} finally { await b.close(); }
console.log(JSON.stringify(out));
