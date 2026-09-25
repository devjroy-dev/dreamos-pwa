// scripts/lib/b126_meta_room_probe.mjs · CE-45 · IGD-1 · CUT 1 · the room "WhatsApp and Instagram" driven in a REAL headless
// Chromium against `next dev` (C-43.18), b120's method. Run by scripts/b126_igd1_meta_room_bench.js, which starts the server.
// THE DOORS ARE MOCKED AT THE NETWORK per SCENARIO: /solutions/number (G6's, 404 here: its shell), /solutions/instagram,
// /solutions/instagram/switch, /solutions/quiet. A navigation to instagram.com is RECORDED and aborted, never followed.
// usage: node scripts/lib/b126_meta_room_probe.mjs PORT MODE SCENARIO [SHOTDIR]   -> one line of JSON; exit 3 = no browser.
import fs from 'fs';
import path from 'path';
import puppeteer from '../../node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';

const PORT = process.argv[2] || '3991';
const MODE = process.argv[3] === 'light' ? 'light' : 'dark';
const SC = process.argv[4] || 'r404';
const SHOTDIR = process.argv[5] || '';
const TAPS = JSON.parse(process.env.B126_TAPS || '{}');
const AUTH = 'https://www.instagram.com/oauth/authorize?client_id=PROBE&scope=instagram_business_basic%2Cinstagram_business_manage_messages';

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

const ig = (state, url = null) => ({ ok: true, state, authorize_url: url });
const IG = {
  r404: null, rHub: null,
  rNot: ig('not_connected', AUTH), rConsent: ig('not_connected', AUTH), rGo: ig('not_connected', AUTH),
  rOff: ig('off'), rOn: ig('on'), rPaused: ig('paused', AUTH), rWaiting: ig('waiting'),
  rBadUrl: ig('not_connected', 'http://evil.example/oauth'), rBadState: { ok: true, state: 'live', authorize_url: null },
  rQuiet: ig('on'),
};
const QUIET = { r404: null, rHub: null, rBadUrl: null, rBadState: null };
const quietFor = (sc) => (sc in QUIET ? QUIET[sc] : { ok: true, minutes: 120 });
const SWITCH = { rGo: ig('not_connected', AUTH), rOn: ig('off'), rOff: ig('on') };
const json = (o, status = 200) => ({ status, contentType: 'application/json', body: JSON.stringify(o) });
const notFound = { status: 404, contentType: 'text/html', body: '<!DOCTYPE html><pre>Cannot GET</pre>' };

const { bin, how, tried } = await resolveBin();
if (!bin) { console.log(JSON.stringify({ browser: null, tried })); process.exit(3); }
const b = await puppeteer.launch({ executablePath: bin, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const out = { browser: how, mode: MODE, scenario: SC, api: [], posts: [], navigations: [], screens: [], errors: [] };
try {
  const p = await b.newPage();
  await p.setViewport({ width: 374, height: 780, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  p.on('pageerror', (e) => out.errors.push(String(e && e.message).split('\n')[0]));
  await p.setCookie({ name: 'tdw_wl_mode', value: MODE, domain: 'localhost', path: '/' });
  // b120's precedent: the pwa's service worker would answer the doors itself, out of the probe's sight; bypass it.
  const cdp = await p.createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Network.setBypassServiceWorker', { bypass: true });
  await p.setRequestInterception(true);
  p.on('request', (r) => {
    const u = r.url();
    if (u.startsWith('https://www.instagram.com/') || u.startsWith('https://instagram.com/') || u.startsWith('http://evil.example/')) {
      out.navigations.push(u); return r.abort('blockedbyclient');
    }
    if (!u.includes('/__api/')) return r.continue();
    const route = u.split('/__api')[1].split('?')[0];
    out.api.push(`${r.method()} ${route}`);
    const base = '/api/v2/vendor/solutions';
    if (route === `${base}/number`) return r.respond(notFound);
    if (route === `${base}/instagram` && r.method() === 'GET') { const d = IG[SC]; return d === null || d === undefined ? r.respond(notFound) : r.respond(json(d)); }
    if (route === `${base}/instagram/switch` && r.method() === 'POST') {
      out.posts.push({ route, body: JSON.parse(r.postData() || '{}') });
      return r.respond(json(SWITCH[SC] || { ok: false }));
    }
    if (route === `${base}/quiet` && r.method() === 'GET') { const d = quietFor(SC); return d === null ? r.respond(notFound) : r.respond(json(d)); }
    if (route === `${base}/quiet` && r.method() === 'POST') {
      const body = JSON.parse(r.postData() || '{}'); out.posts.push({ route, body });
      return r.respond(json({ ok: true, minutes: body.minutes }));
    }
    return r.respond(json({ ok: true }));
  });
  const settle = (ms = 1000) => new Promise((res) => setTimeout(res, ms));
  const read = async (label) => {
    const s = await p.evaluate(() => {
      const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const g6 = document.querySelector('section.sol-surface:not([data-meta-room])');
      const igs = document.querySelector('section[data-meta-room="instagram"]');
      const q = document.querySelector('section[data-meta-room="quiet"]');
      const txt = (el) => (el ? [...el.querySelectorAll('p,h1,h2,li')].filter(vis).map((e) => e.textContent.trim()) : null);
      const btn = (el) => (el ? [...el.querySelectorAll('button')].filter(vis).map((e) => e.textContent.trim()) : null);
      const sel = q ? q.querySelector('select') : null;
      return {
        title: (document.querySelector('h1.sol-title') || {}).textContent || null,
        g6: txt(g6), g6buttons: btn(g6),
        ig: txt(igs), igButtons: btn(igs), igState: igs ? igs.getAttribute('data-state') : null,
        quiet: q ? q.textContent.trim() : null, quietValue: sel ? sel.value : null,
        quietOptions: sel ? [...sel.options].map((o) => o.textContent.trim()) : null,
        body: document.body.innerText,
      };
    });
    s.label = label;
    out.screens.push(s);
    if (SHOTDIR) { fs.mkdirSync(SHOTDIR, { recursive: true }); await p.screenshot({ path: path.join(SHOTDIR, `b126__${SC}__${label}__${MODE}.png`), fullPage: true }); }
    return s;
  };
  const tap = (text) => p.evaluate((t) => {
    const btn = [...document.querySelectorAll('section[data-meta-room] button')].find((e) => e.textContent.trim() === t);
    if (btn) { btn.click(); return true; } return false;
  }, text);
  const waitFor = async (pred, ms = 60000) => { for (let i = 0; i < ms / 500; i += 1) { if (await pred()) return true; await settle(500); } return false; };
  const url = SC === 'rHub' ? `http://localhost:${PORT}/vendor/support` : `http://localhost:${PORT}/vendor/number`;
  await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await waitFor(() => p.evaluate((hub) => !!document.querySelector(hub ? 'main, section' : 'section.sol-surface'), SC === 'rHub'), 90000);
  await settle(3000);
  await read('landing');
  out.tapped = [];
  if (SC === 'rConsent') { out.tapped.push(await tap(TAPS.connect)); await settle(700); await read('consent'); out.tapped.push(await tap(TAPS.notNow)); await settle(700); await read('back'); }
  if (SC === 'rGo') { out.tapped.push(await tap(TAPS.connect)); await settle(700); await read('consent'); out.tapped.push(await tap(TAPS.turnOn)); await settle(2000); }
  if (SC === 'rOn') { out.tapped.push(await tap(TAPS.turnOff)); await settle(1500); await read('after'); }
  if (SC === 'rOff') { out.tapped.push(await tap(TAPS.turnOn)); await settle(700); await read('consent'); }
  if (SC === 'rPaused') { out.tapped.push(await tap(TAPS.paused)); await settle(2000); }
  if (SC === 'rQuiet') { await p.select('section[data-meta-room="quiet"] select', '240'); await settle(1500); await read('after'); }
} catch (e) {
  out.errors.push(`probe: ${String(e && e.message).split('\n')[0]}`);
} finally { await b.close(); }
console.log(JSON.stringify(out));
