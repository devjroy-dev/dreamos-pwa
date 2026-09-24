// scripts/lib/b122_home_shelves_probe.mjs · TDW CE-45 · FE-1 · HOME AND SHELVES · cut one.
// Drives the REAL surfaces in headless Chromium against `next dev` in mock mode (C-43.18), by
// b120's method: puppeteer-core, @sparticuz/chromium or CHROME_BIN, touch viewport, the theme by
// the shell's own cookie. Run by scripts/b122_ce45_home_shelves_bench.js, which starts next dev
// and passes PORT. It lives in scripts/lib/ so run-floor.sh's flat glob never collects it.
//
// THE DOORS ARE MOCKED AT THE NETWORK. /__api/api/v2/vendor/me answers with the trade the
// SCENARIO names (home:<token>), or a 500 (home:fail); every other /__api call answers {ok:true},
// as b120's probe does. B122_CLOCK (ms since epoch) shifts the page's clock (C-44.13): Date and
// Date.now read that instant, advancing in real time from it.
//
// usage: node scripts/lib/b122_home_shelves_probe.mjs PORT MODE SCENARIO [SHOTDIR]
//   SCENARIO: rooms | hub | land | home:<category> | home:fail | home:click
// Prints ONE line of JSON. A missing key reads as RED in the bench, never as green.
import fs from 'fs';
import path from 'path';
import puppeteer from '../../node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';

const PORT = process.argv[2] || '3991';
const MODE = process.argv[3] === 'light' ? 'light' : 'dark';
const SCENARIO = process.argv[4] || 'rooms';
const SHOTDIR = process.argv[5] || '';
const CLOCK = process.env.B122_CLOCK ? Number(process.env.B122_CLOCK) : null;

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

const json = (o, status = 200) => ({ status, contentType: 'application/json', body: JSON.stringify(o) });
const trade = SCENARIO.startsWith('home:') ? SCENARIO.slice(5) : 'photography';

const { bin, how, tried } = await resolveBin();
if (!bin) { console.log(JSON.stringify({ browser: null, tried })); process.exit(3); }
const b = await puppeteer.launch({ executablePath: bin, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const out = { browser: how, mode: MODE, scenario: SCENARIO, clock: CLOCK, errors: [], meCalls: 0 };
try {
  const p = await b.newPage();
  await p.setViewport({ width: 374, height: 780, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  p.on('pageerror', (e) => out.errors.push(String(e && e.message).split('\n')[0]));
  await p.setCookie({ name: 'tdw_wl_mode', value: MODE, domain: 'localhost', path: '/' });
  if (CLOCK !== null) {
    await p.evaluateOnNewDocument((t0) => {
      const Real = Date; const start = Real.now();
      const now = () => t0 + (Real.now() - start);
      // eslint-disable-next-line no-global-assign
      Date = class extends Real { constructor(...a) { if (a.length === 0) super(now()); else super(...a); } static now() { return now(); } };
    }, CLOCK);
  }
  const cdp = await p.createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Network.setBypassServiceWorker', { bypass: true });
  await p.setRequestInterception(true);
  p.on('request', (r) => {
    const u = r.url();
    if (!u.includes('/__api/')) return r.continue();
    const route = u.split('/__api')[1].split('?')[0];
    if (route === '/api/v2/vendor/me' && r.method() === 'GET') {
      out.meCalls += 1;
      // HOME_2 (chair's (a)): home:slow answers /me after 4 s as a photographer, so the masthead can be
      // measured while the pins wait and again after they arrive.
      if (trade === 'slow') { setTimeout(() => r.respond(json({ ok: true, vendor: { id: 'v-probe', name: 'Probe', business_name: 'Probe Studio', category: 'photography', city: 'Delhi', handle: 'probe', upi_id: null, gstin: null } })), 4000); return; }
      if (trade === 'fail') return r.respond({ status: 500, contentType: 'text/plain', body: 'boom' });
      return r.respond(json({ ok: true, vendor: { id: 'v-probe', name: 'Probe', business_name: 'Probe Studio', category: trade === 'none' ? '' : trade, city: 'Delhi', handle: 'probe', upi_id: null, gstin: null } }));
    }
    return r.respond(json({ ok: true }));
  });
  const settle = (ms = 1200) => new Promise((res) => setTimeout(res, ms));
  const waitFor = async (pred, ms = 60000) => {
    for (let i = 0; i < ms / 500; i += 1) { if (await pred()) return true; await settle(500); }
    return false;
  };
  const shot = async (label) => {
    if (!SHOTDIR) return;
    fs.mkdirSync(SHOTDIR, { recursive: true });
    await p.screenshot({ path: path.join(SHOTDIR, `b122__${SCENARIO.replace(':', '-')}__${label}__${MODE}.png`), fullPage: true });
  };
  // What every surface shares: the title, the two tabs in order, and the dock's words and place.
  const chrome = () => p.evaluate(() => {
    const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const lbl = document.querySelector('.wl-lbl');
    const seats = [...document.querySelectorAll('.wl-seat')].filter(vis).map((e) => ({ text: e.textContent.trim(), href: e.getAttribute('href'), current: e.getAttribute('aria-current') }));
    const dock = document.querySelector('.wl-dockfield');
    const dr = dock ? dock.getBoundingClientRect() : null;
    const seatTop = seats.length ? Math.min(...[...document.querySelectorAll('.wl-seat')].filter(vis).map((e) => e.getBoundingClientRect().top)) : null;
    return {
      path: location.pathname,
      title: lbl ? lbl.textContent.trim() : null,
      seats,
      dock: dock ? { text: (dock.querySelector('.wl-dockph') || dock).textContent.trim(), top: Math.round(dr.top), bottom: Math.round(dr.bottom), height: Math.round(dr.height) } : null,
      seatTop: seatTop === null ? null : Math.round(seatTop),
    };
  });

  if (SCENARIO === 'land') {
    await p.goto(`http://localhost:${PORT}/vendor`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await waitFor(() => p.evaluate(() => location.pathname !== '/vendor'), 60000);
    await settle(1500);
    out.chrome = await chrome();
  } else if (SCENARIO === 'rooms') {
    await p.goto(`http://localhost:${PORT}/vendor/rooms`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await waitFor(() => p.evaluate(() => !!document.querySelector('.wl-bands')), 60000);
    await settle(2500);
    out.chrome = await chrome();
    out.rooms = await p.evaluate(() => {
      const icons = (el) => [...el.querySelectorAll('svg[data-icon]')].map((sv) => ({ k: sv.getAttribute('data-icon'), html: sv.innerHTML, color: getComputedStyle(sv).color }));
      const row = (e) => ({
        icons: icons(e),
        key: e.getAttribute('data-room'),
        name: (e.querySelector('.wl-tname') || {}).textContent || null,
        desc: (e.querySelector('.wl-tdesc') || {}).textContent || null,
        href: e.getAttribute('href'),
        head: e.getAttribute('data-headline') === 'true',
        coming: !!e.querySelector('[data-state="coming"]'),
        nameColor: getComputedStyle(e.querySelector('.wl-tname')).color,
        height: Math.round(e.getBoundingClientRect().height),
      });
      const top = document.querySelector('.wl-band.wl-top');
      return {
        top: top ? [...top.querySelectorAll('a.wl-tile')].map(row) : null,
        shelves: [...document.querySelectorAll('section.wl-band[data-shelf]')].map((s) => ({
          id: s.getAttribute('data-shelf'),
          label: (s.querySelector('.wl-bandlabel') || {}).textContent || null,
          rows: [...s.querySelectorAll('a.wl-tile')].map(row),
        })),
        allTiles: [...document.querySelectorAll('a.wl-tile')].length,
        metal: getComputedStyle(document.querySelector('.wl-bands') || document.body).getPropertyValue('--role-metal').trim(),
        inkColor: (() => { const t = document.querySelector('section.wl-band[data-shelf] .wl-tname'); return t ? getComputedStyle(t).color : null; })(),
      };
    });
    await shot('rooms');
  } else if (SCENARIO === 'hub') {
    await p.goto(`http://localhost:${PORT}/vendor/support`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await waitFor(() => p.evaluate(() => !!document.querySelector('.sol-group')), 60000);
    await settle(2500);
    out.chrome = await chrome();
    out.hub = await p.evaluate(() => { const icons = (el) => [...el.querySelectorAll('svg[data-icon]')].map((sv) => ({ k: sv.getAttribute('data-icon'), html: sv.innerHTML, color: getComputedStyle(sv).color })); return ({
      groups: [...document.querySelectorAll('section.sol-group')].map((g) => ({
        name: (g.querySelector('.sol-eyebrow') || {}).textContent || null,
        rows: [...g.querySelectorAll('a.sol-row')].map((r) => ({
          icons: icons(r),
          label: (r.querySelector('.sol-rowlabel') || {}).textContent || null,
          desc: (r.querySelector('.sol-rowdesc') || {}).textContent || null,
          href: r.getAttribute('href'),
          chip: (r.querySelector('[data-state]') || { getAttribute: () => null }).getAttribute('data-state'),
        })),
      })),
      footer: !!document.querySelector('.wl-supportaction'),
    }); });
    await shot('hub');
  } else if (SCENARIO.startsWith('home:')) {
    await p.goto(`http://localhost:${PORT}/vendor/today`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    if (trade === 'slow') {
      await waitFor(() => p.evaluate(() => !!document.querySelector('.wl-masthead') && !!document.querySelector('.wl-pins')), 60000);
      await settle(600);
      out.early = await p.evaluate(() => ({
        mastTop: Math.round(document.querySelector('.wl-masthead').getBoundingClientRect().top),
        pinsH: Math.round(document.querySelector('.wl-pins').getBoundingClientRect().height),
        waiting: document.querySelector('.wl-pins').getAttribute('aria-busy') === 'true',
        links: document.querySelectorAll('.wl-pins a.wl-pin').length,
      }));
      await waitFor(() => p.evaluate(() => document.querySelectorAll('.wl-pins a.wl-pin').length === 6), 20000);
      await settle(600);
      out.late = await p.evaluate(() => ({
        mastTop: Math.round(document.querySelector('.wl-masthead').getBoundingClientRect().top),
        pinsH: Math.round(document.querySelector('.wl-pins').getBoundingClientRect().height),
        waiting: document.querySelector('.wl-pins').getAttribute('aria-busy') === 'true',
        links: document.querySelectorAll('.wl-pins a.wl-pin').length,
      }));
    }
    await waitFor(() => p.evaluate(() => !!document.querySelector('.wl-pins') || !!document.querySelector('.wl-masthead')), 60000);
    await waitFor(() => p.evaluate(() => !!document.querySelector('.wl-pins')), 20000);
    await settle(2000);
    out.chrome = await chrome();
    out.home = await p.evaluate(() => {
      const icons = (el) => [...el.querySelectorAll('svg[data-icon]')].map((sv) => ({ k: sv.getAttribute('data-icon'), html: sv.innerHTML, color: getComputedStyle(sv).color }));
      const pins = document.querySelector('.wl-pins');
      const mast = document.querySelector('.wl-masthead');
      const ch = document.querySelector('.wl-pinchange');
      return {
        masthead: !!mast,
        mdate: (document.querySelector('.wl-mdate') || {}).textContent || null,
        mastheadBeforePins: !!(mast && pins && (mast.compareDocumentPosition(pins) & Node.DOCUMENT_POSITION_FOLLOWING)),
        pinsBeforeMasthead: !!(mast && pins && (pins.compareDocumentPosition(mast) & Node.DOCUMENT_POSITION_FOLLOWING)),
        pinsBottom: pins ? Math.round(pins.getBoundingClientRect().bottom) : null,
        mastTop: mast ? Math.round(mast.getBoundingClientRect().top) : null,
        cols: (() => { const g = document.querySelector('.wl-pingrid'); return g ? getComputedStyle(g).gridTemplateColumns.split(' ').filter(Boolean).length : null; })(),
        head: pins ? (pins.querySelector('.wl-pinshead') || {}).textContent || null : null,
        trade: pins ? pins.getAttribute('data-trade') : null,
        pins: pins ? [...pins.querySelectorAll('a.wl-pin')].map((a) => ({
          key: a.getAttribute('data-room'),
          name: (a.querySelector('.wl-pinname') || {}).textContent || null,
          desc: (a.querySelector('.wl-pindesc') || {}).textContent || null,
          descHidden: (() => { const d = a.querySelector('.wl-pindesc'); if (!d) return null; const r = d.getBoundingClientRect(); return r.width <= 1 && r.height <= 1; })(),
          icons: icons(a),
          href: a.getAttribute('href'),
          coming: !!a.querySelector('[data-state="coming"]'),
        })) : null,
        change: ch ? { text: ch.textContent.trim(), label: (ch.querySelector('span') || {}).textContent || null, disabled: ch.disabled === true, chip: (ch.querySelector('[data-state]') || { getAttribute: () => null }).getAttribute('data-state') } : null,
      };
    });
    await shot('home');
    if (SCENARIO === 'home:click' || trade === 'photography') {
      const target = out.home.pins && out.home.pins.length ? out.home.pins[out.home.pins.length - 1].href : null;
      out.clicked = target;
      if (target) {
        await p.evaluate((h) => { const a = [...document.querySelectorAll('a.wl-pin')].find((e) => e.getAttribute('href') === h); if (a) a.click(); }, target);
        await waitFor(() => p.evaluate((h) => location.pathname === h, target), 30000);
        await settle(800);
        out.afterClick = await p.evaluate(() => location.pathname);
      }
    }
  }
  // HOME_2: the browser's serialisation of every registry string, so the bench compares like with like.
  if (process.env.B122_ICONS && fs.existsSync(process.env.B122_ICONS)) {
    const reg = JSON.parse(fs.readFileSync(process.env.B122_ICONS, 'utf8'));
    out.canon = await p.evaluate((reg) => Object.fromEntries(Object.entries(reg).map(([k, v]) => {
      const sv = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); sv.innerHTML = v; return [k, sv.innerHTML];
    })), reg);
  }
} catch (e) {
  out.errors.push(`probe: ${String(e && e.message).split('\n')[0]}`);
} finally { await b.close(); }
console.log(JSON.stringify(out));
