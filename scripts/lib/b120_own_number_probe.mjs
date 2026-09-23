// scripts/lib/b120_own_number_probe.mjs · TDW CE-45 · G6-1 · cut one (FE_1) · the Number room
// driven in a REAL headless Chromium against `next dev` (C-43.18). Run by
// scripts/b120_g61_own_number_bench.js, which spawns next dev and passes PORT. It lives in
// scripts/lib/ so run-floor.sh's flat glob never collects it as a bench (e-44.20).
//
// THE DOOR IS MOCKED AT THE NETWORK: /__api/api/v2/vendor/solutions/number answers per SCENARIO,
// and /number/connect records its body and the time it arrived. META'S SDK IS MOCKED TOO: the
// request to connect.facebook.net/en_US/sdk.js is answered with a stand-in FB object whose
// login() calls back with a code (or with nothing, for a stop), so the probe can witness what the
// room does with Meta's answer without Meta. The stand-in records init() and login() arguments.
//
// usage: node scripts/lib/b120_own_number_probe.mjs PORT MODE SCENARIO [SHOTDIR]
// Prints ONE line of JSON. A missing key reads as RED in the bench, never as green.
import fs from 'fs';
import path from 'path';
import puppeteer from '../../node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';

const PORT = process.argv[2] || '3990';
const MODE = process.argv[3] === 'light' ? 'light' : 'dark';
const SCENARIO = process.argv[4] || 's404';
const SHOTDIR = process.argv[5] || '';
// The words on the flow's buttons, passed by the bench from the tree's own copy home, so the probe
// taps what she will read and types none of it (AMENDED BY LABEL, FE_1 turn A: was 'PH-<key>').
const TAPS = JSON.parse(process.env.B120_TAPS || '{}');

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

const LAUNCH = { app_id: '1111111111111111', config_id: '2222222222222222', graph_version: 'v25.0',
  extras: { shared: { setup: {}, probe_way: 'shared' }, moved: { setup: {}, probe_way: 'moved' } } };
const DOORS = {
  s404: null,
  sBad: { ok: true, open: 'yes', launch: LAUNCH, number: null },
  sShut: { ok: true, open: false, reason: 'flag.own_number is off', reason_text: 'x', launch: LAUNCH, number: null },
  sOpen: { ok: true, open: true, reason: null, reason_text: null, launch: LAUNCH, number: null },
  sStatus: { ok: true, open: true, reason: null, reason_text: null, launch: LAUNCH,
    number: { status: 'active', display_number: '+91 98882 94440', way: 'shared', quality_rating: 'GREEN' } },
};
const doorFor = (sc) => (sc in DOORS ? DOORS[sc] : DOORS.sOpen);
const FB_MODE = SCENARIO === 'sCancel' ? 'cancel' : 'code';
const FAKE_SDK = `window.FB={init:function(o){window.__fbInit=o},login:function(cb,o){window.__fbLogin=o;`
  + `setTimeout(function(){ if(window.__fbMode==='cancel'){cb({authResponse:null})}else{window.__codeAt=Date.now();cb({authResponse:{code:'PROBE-CODE'}})} },50);}};`
  + `if(window.fbAsyncInit){window.fbAsyncInit()}`;
const json = (o, status = 200) => ({ status, contentType: 'application/json', body: JSON.stringify(o) });

const { bin, how, tried } = await resolveBin();
if (!bin) { console.log(JSON.stringify({ browser: null, tried })); process.exit(3); }
const b = await puppeteer.launch({ executablePath: bin, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const out = { browser: how, mode: MODE, scenario: SCENARIO, sdkRequests: [], posts: [], screens: [], errors: [] };
try {
  const p = await b.newPage();
  await p.setViewport({ width: 374, height: 780, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  p.on('pageerror', (e) => out.errors.push(String(e && e.message).split('\n')[0]));
  await p.setCookie({ name: 'tdw_wl_mode', value: MODE, domain: 'localhost', path: '/' });
  await p.evaluateOnNewDocument((m) => { window.__fbMode = m; }, FB_MODE);
  const cdp = await p.createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Network.setBypassServiceWorker', { bypass: true });
  await p.setRequestInterception(true);
  p.on('request', (r) => {
    const u = r.url();
    if (u.startsWith('https://connect.facebook.net/')) {
      out.sdkRequests.push({ url: u, screen: out.screens.length });
      if (SCENARIO === 'sNoSdk') return r.abort('blockedbyclient');
      return r.respond({ status: 200, contentType: 'application/javascript', headers: { 'Access-Control-Allow-Origin': '*' }, body: FAKE_SDK });
    }
    if (!u.includes('/__api/')) return r.continue();
    const route = u.split('/__api')[1].split('?')[0];
    if (route === '/api/v2/vendor/solutions/number' && r.method() === 'GET') {
      const d = doorFor(SCENARIO);
      return d === null ? r.respond({ status: 404, contentType: 'text/html', body: '<!DOCTYPE html><pre>Cannot GET</pre>' }) : r.respond(json(d));
    }
    if (route === '/api/v2/vendor/solutions/number/connect' && r.method() === 'POST') {
      out.posts.push({ at: Date.now(), body: JSON.parse(r.postData() || '{}') });
      if (SCENARIO === 'sFlowMoved') return r.respond(json({ ok: false, reason: 'code_expired', reason_text: 'server words' }));
      return r.respond(json({ ok: true, number: { status: 'pending', display_number: '+91 98882 94440', way: 'shared', quality_rating: null } }));
    }
    return r.respond(json({ ok: true }));
  });
  const settle = (ms = 1200) => new Promise((res) => setTimeout(res, ms));
  const read = async (label) => {
    const s = await p.evaluate(() => {
      const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const sec = document.querySelector('section.sol-surface');
      if (!sec) return { section: false };
      return {
        section: true,
        step: sec.getAttribute('data-own-number'),
        status: sec.getAttribute('data-status'),
        texts: [...sec.querySelectorAll('p,h1,h2,li')].filter(vis).map((e) => e.textContent.trim()),
        buttons: [...sec.querySelectorAll('button')].filter(vis).map((e) => e.textContent.trim()),
        body: document.body.innerText,
      };
    });
    s.label = label;
    s.fbInit = await p.evaluate(() => window.__fbInit || null);
    s.fbLogin = await p.evaluate(() => window.__fbLogin || null);
    s.codeAt = await p.evaluate(() => window.__codeAt || null);
    out.screens.push(s);
    if (SHOTDIR) {
      fs.mkdirSync(SHOTDIR, { recursive: true });
      await p.screenshot({ path: path.join(SHOTDIR, `b120__${SCENARIO}__${label}__${MODE}.png`) });
    }
    return s;
  };
  const tap = (text) => p.evaluate((t) => {
    const btn = [...document.querySelectorAll('section.sol-surface button')].find((e) => e.textContent.trim() === t);
    if (btn) { btn.click(); return true; } return false;
  }, text);
  const waitFor = async (pred, ms = 30000) => {
    for (let i = 0; i < ms / 500; i += 1) { if (await pred()) return true; await settle(500); }
    return false;
  };
  await p.goto(`http://localhost:${PORT}/vendor/number`, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await waitFor(() => p.evaluate(() => !!document.querySelector('section.sol-surface')), 60000);
  await settle(2500);
  const first = await read('landing');
  out.tapped = [];
  if (SCENARIO === 's404' || SCENARIO === 'sBad' || SCENARIO === 'sShut' || (SCENARIO === 'sOpen' && !first.step)) {
    out.tapped.push(await tap('Connect'));
    await settle(800);
    await read('after-connect');
  } else if (SCENARIO === 'sFlowShared' || SCENARIO === 'sCancel' || SCENARIO === 'sNoSdk') {
    out.tapped.push(await tap('Connect')); await settle(800);
    await read('consent');
    out.tapped.push(await tap(TAPS.sharedGo));
    await settle(SCENARIO === 'sCancel' ? 3000 : 2500);
    await read('after-meta');
  } else if (SCENARIO === 'sFlowMoved') {
    out.tapped.push(await tap('Connect')); await settle(800);
    await read('consent');
    out.tapped.push(await tap(TAPS.movedGo)); await settle(800);
    await read('confirm');
    out.tapped.push(await tap(TAPS.movedConfirmGo)); await settle(2500);
    await read('after-meta');
  }
} catch (e) {
  out.errors.push(`probe: ${String(e && e.message).split('\n')[0]}`);
} finally { await b.close(); }
console.log(JSON.stringify(out));
