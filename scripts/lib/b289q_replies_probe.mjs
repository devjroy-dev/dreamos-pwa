// scripts/lib/b289q_replies_probe.mjs · CE-47 · HUB-2c · her call's replies page (/vendor/collab/p1/responses), driven in a
// REAL headless Chromium against `next dev` (C-43.18, b126's method). Run by scripts/b289q_hub2c_call_replies_app_bench.js,
// which starts and stops the server. Lives in scripts/lib/ so run-floor.sh's flat glob never collects it (e-44.20).
// THE DOOR IS MOCKED AT THE NETWORK per SCENARIO: GET /api/v2/vendor/collab/p1/responses. Every other door answers an
// empty ok. Nothing leaves the machine.
// usage: node scripts/lib/b289q_replies_probe.mjs PORT LAYOUT MODE SCENARIO   -> one line of JSON; exit 3 = no browser.
import fs from 'fs';
import puppeteer from '../../node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';

const PORT = process.argv[2] || '3994';
const LAYOUT = process.argv[3] === 'classic' ? 'classic' : 'v2';
const MODE = process.argv[4] === 'light' ? 'light' : 'dark';
const SC = process.argv[5] || 'r0';
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

const TDW = { response_id: 'r1', state: 'interested', responded_at: '2026-10-08T10:00:00Z', contact_shared_at: null,
  vendor: { id: 'v1', name: 'Aman Frames', category: 'photographer', city: 'Delhi', open_to_travel: false, hero_photo: 'https://pictures.tdw.test/a.jpg' } };
const IG = { id: 'i1', source: 'instagram', name: 'Riya Kapoor', platform_word: 'Instagram', how: 'comment', when: '2026-10-08T12:30:00Z' };
const TH = { id: 't1', source: 'threads', name: 'Kabir Styles', platform_word: 'Threads', how: 'reply', when: '2026-10-07T09:00:00Z' };
const PT = { id: 'p1', source: 'partner', name: 'Meera S', role: 'model', role_word: 'model', link: 'https://agency.example/meera',
  partner: { name: 'Star Faces Agency', kind_words: 'Talent agency', cities: ['Delhi'], instagram_url: 'https://www.instagram.com/starfaces/', website_url: 'https://agency.example/' },
  fee_line: 'This partner may charge its own fees. TDW takes no fee and has no part in it.', check_words: 'Unverified' };
const NOTE = 'People who answered from outside TDW could not be shown just now. Try again in a minute.';
const BODY = {
  r0: { ok: true, responses: [], outside: [] },
  rOld: { ok: true, responses: [TDW] },
  rMix: { ok: true, responses: [TDW], outside: [IG, TH, PT] },
  rOnly: { ok: true, responses: [], outside: [IG] },
  rNote: { ok: true, responses: [TDW], outside: [], outside_note: NOTE },
  rBad: { ok: true, responses: [], outside: [
    { ...IG, id: 'b1', name: 'call me 98765 43210' }, { ...IG, id: 'b2', name: 'riya@example.com' },
    { ...IG, id: 'b3', source: 'whatsapp' }, { ...IG, id: 'b4', name: '' }, 'junk', { ...TH, id: 'ok1', name: 'Kept Person' }] },
};
const json = (o, status = 200) => ({ status, contentType: 'application/json', body: JSON.stringify(o) });

const { bin, how, tried } = await resolveBin();
if (!bin) { console.log(JSON.stringify({ browser: null, tried })); process.exit(3); }
const b = await puppeteer.launch({ executablePath: bin, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const out = { browser: how, layout: LAYOUT, mode: MODE, scenario: SC, gets: 0, outside: [], screen: null, errors: [] };
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
    if (route === '/api/v2/vendor/collab/p1/responses' && r.method() === 'GET') { out.gets += 1; return r.respond(json(BODY[SC] || BODY.r0)); }
    return r.respond(json({ ok: true, items: [], posts: [], rows: [], list: [] }));
  });
  const settle = (ms) => new Promise((res) => setTimeout(res, ms));
  const waitFor = async (pred, ms = 60000) => { for (let i = 0; i < ms / 250; i += 1) { if (await pred()) return true; await settle(250); } return false; };
  await p.goto(`http://localhost:${PORT}/vendor/collab/p1/responses`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  // Wait on conditions (e-275): the door answered, then the page has left Loading.
  await waitFor(async () => out.gets >= 1, 90000);
  await waitFor(() => p.evaluate(() => !!document.querySelector('main') && !/Loading…/.test(document.querySelector('main').innerText)), 30000);
  out.screen = await p.evaluate(() => {
    const main = document.querySelector('main') || document.body;
    const sec = main.querySelector('section[data-call-outside]');
    const rows = sec ? [...sec.querySelectorAll('[data-call-outside-row]')] : [];
    const h1s = [...main.querySelectorAll('h1')].map((h) => h.textContent.trim());
    return {
      h1s,
      text: main.innerText,
      tdwCards: [...main.querySelectorAll('button')].filter((x) => /connect/i.test(x.textContent)).length,
      section: !!sec,
      label: sec ? ((sec.querySelector('h2') || {}).textContent || null) : null,
      rows: rows.map((r) => ({
        source: r.getAttribute('data-call-outside-row'),
        name: (r.querySelector('.co-name') || {}).textContent || null,
        chip: (r.querySelector('.co-chip') || {}).textContent || null,
        day: (r.querySelector('.co-day') || {}).textContent || null,
        line: (r.querySelector('.co-line') || {}).textContent || null,
        controls: r.querySelectorAll('a,button,input,[onclick],[tabindex]').length,
      })),
      note: sec ? ((sec.querySelector('[data-call-outside-note]') || {}).textContent || null) : null,
      pageWide: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
} catch (e) {
  out.errors.push(`probe: ${String(e && e.message).split('\n')[0]}`);
} finally { await b.close(); }
console.log(JSON.stringify(out));
