// scripts/lib/b172_probe.mjs · CE-47 · WEB-6 · b172 · THE REAL ROOM, DRIVEN (mock mode, C-43.18).
// usage: node scripts/lib/b172_probe.mjs PORT JOBS_JSON [SHOTS_DIR]
// Every door the room calls is answered by scripts/lib/b172_fixtures.mjs (the site doors) or b123's stand-in (the rest).
// The preview frame (W6-f) is served a fixture page: WEB-3's built prototypes when B172_PROTOTYPES names their folder,
// else a plain page naming the style. Photographs: B172_IMG's folder, else a flat tile.
import fs from 'fs'; import os from 'os'; import path from 'path'; import { execSync } from 'child_process';
import puppeteer from '../../node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
import { answer } from './b123_fixtures.mjs';
import { siteAnswer } from './b172_fixtures.mjs';
const PORT = process.argv[2]; const JOBS = JSON.parse(process.argv[3]); const SHOTS = process.argv[4] || null;
const PROTO = process.env.B172_PROTOTYPES || null; const IMGD = process.env.B172_IMG || null;
// WEB-8 C1 (CE-47): the browser is found as docs/design/tools/harness.mjs browser() finds it (FE-8 C1, ruling C): CHROME_BIN, then
// /opt/pw-browsers, then @sparticuz/chromium (the one the founder's Codespace has). A machine with none of the three says so by name.
const usable = (p) => { try { return !!p && fs.statSync(p).isFile(); } catch (_e) { return false; } };
let bin = process.env.CHROME_BIN;
if (!usable(bin)) { bin = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium'].find(usable); }
if (!usable(bin)) { try { const mod = await import('../../node_modules/@sparticuz/chromium/build/index.js'); const c = mod.default || mod; const p = await c.executablePath(); if (usable(p)) bin = p; } catch (_e) { /* named below */ } }
if (!usable(bin)) { console.error('b172 probe: no browser found (CHROME_BIN, /opt/pw-browsers, @sparticuz/chromium all absent)'); process.exit(3); }
if (process.env.B172_SAY_BROWSER) console.error('b172 probe: browser = ' + bin);
const cache = path.join(os.tmpdir(), 'b123-fonts'); const want = ['dm-sans-latin-400-normal.woff2', 'dm-sans-latin-500-normal.woff2', 'cormorant-garamond-latin-500-normal.woff2'];
if (!want.every((f) => fs.existsSync(path.join(cache, f)))) { fs.mkdirSync(cache, { recursive: true });
  execSync('npm pack @fontsource/dm-sans@5 @fontsource/cormorant-garamond@5 --silent', { cwd: cache, stdio: 'ignore' });
  for (const t of fs.readdirSync(cache).filter((f) => f.endsWith('.tgz'))) execSync(`tar xzf ${t} package/files`, { cwd: cache, stdio: 'ignore' });
  for (const f of want) fs.copyFileSync(path.join(cache, 'package', 'files', f), path.join(cache, f)); }
const settle = (ms) => new Promise((r) => setTimeout(r, ms));
const plainPage = (name) => `<!doctype html><meta charset=utf-8><body style="margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#fbf3f1;font:40px Georgia;color:#2b1f2e">Studio Ivara<br><small style="font:14px sans-serif">${name}</small></body>`;
const b = await puppeteer.launch({ executablePath: bin, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const out = [];
try { for (const j of JOBS) {
  const ctx = await b.createBrowserContext(); const p = await ctx.newPage(); const errs = []; const calls = []; const state = { ...(j.opt || {}) };
  p.on('pageerror', (e) => errs.push(String(e.message).split('\n')[0]));
  await p.setViewport({ width: j.w || 374, height: j.h || 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await p.setCookie({ name: 'tdw_wl_mode', value: j.mode || 'dark', domain: 'localhost', path: '/' });
  if (j.layout === 'v2') await p.setCookie({ name: 'tdw_layout', value: 'v2', domain: 'localhost', path: '/' });
  const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
  await p.setRequestInterception(true);
  p.on('request', (r) => { const u = r.url(); const m = r.method();
    const tok = (u.match(/[?&]preview=tok-([a-z]+)/) || [])[1];
    if (tok || u.includes('/__preview/')) { const name = tok || u.split('/__preview/')[1].split('?')[0]; const st = (u.match(/[?&]style=([a-z]+)/) || [])[1] || name;
      const f = PROTO && path.join(PROTO, `${st}.html`);
      // WEB-3's prototypes draw their tray unless ?rec=1: the fixture page is read as the site, so the tray is put away
      const rec = '<script>if(!/rec=1/.test(location.search))history.replaceState(null,"",location.pathname+"?rec=1")</script>';
      const body = f && fs.existsSync(f) ? rec + fs.readFileSync(f, 'utf8') : plainPage(st);
      return r.respond({ status: 200, contentType: 'text/html', body }); }
    if (u.includes('/__img/')) { const k = u.split('/__img/')[1]; const f = IMGD && path.join(IMGD, `${k}-960.webp`);
      if (f && fs.existsSync(f)) return r.respond({ status: 200, contentType: 'image/webp', body: fs.readFileSync(f) });
      return r.respond({ status: 200, contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="4" height="5"><rect width="4" height="5" fill="#b9a89c"/></svg>' }); }
    if (!u.includes('/__api/')) return r.continue();
    const route = u.split('/__api')[1];
    if (route.startsWith('/api/v2/vendor/solutions/site/') || route === '/api/v2/vendor/solutions/site') {
      calls.push(`${m} ${route}`);
      if (m === 'POST' && /\/site\/(publish|discard)$/.test(route.split('?')[0])) state.published = true;   // the draft is now the site
      const a = siteAnswer(j.plan, route, m, state);
      if (a) return r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(a) });
    }
    const a = answer(route.split('?')[0]); r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(a && Object.keys(a).length > 1 ? a : { ok: true, items: [], rows: [], list: [] }) }); });
  const url = `http://localhost:${PORT}/vendor/your-website`;
  await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 240000 }); await settle(2000);
  await p.goto(url, { waitUntil: 'networkidle2', timeout: 240000 });
  let up = false; for (let i = 0; i < 200 && !up; i++) { up = await p.evaluate(() => !!document.querySelector('[data-website-screen], [data-website-offer]')); if (!up) await settle(300); }
  try { const names = await p.evaluate(() => { const cs = getComputedStyle(document.documentElement); const f = (v) => v.split(',')[0].trim().replace(/^["']|["']$/g, ''); return { dm: f(cs.getPropertyValue('--font-dm-sans')), co: f(cs.getPropertyValue('--font-cormorant')) }; });
    const face = (fam, file, w) => `@font-face{font-family:'${fam}';font-weight:${w};src:url(data:font/woff2;base64,${fs.readFileSync(path.join(cache, file)).toString('base64')}) format('woff2');}`;
    if (names.dm) await p.addStyleTag({ content: [face(names.dm, want[0], 400), face(names.dm, want[1], 500), names.co ? face(names.co, want[2], 500) : ''].join('\n') }); } catch (_e) { /* faces are cosmetic */ }
  const res = { name: j.name, up, steps: [] };
  for (const st of j.steps || []) {
    if (st.type) { const h = await p.$(st.sel); if (h) { await h.click(); await p.keyboard.type(st.type); } res.steps.push([st.sel, !!h]); await settle(400); continue; }
    const hit = await p.evaluate((st) => {
      const all = [...document.querySelectorAll('.wb button, .wb a, .wb-sheet button, .wb [role=radio], .wb [role=checkbox]')];
      const el = st.sel ? document.querySelector(st.sel) : all.find((x) => x.textContent.trim() === st.click || (x.textContent.trim().startsWith(st.click) && st.prefix));
      if (el) el.click(); return !!el;
    }, st); res.steps.push([st.click || st.sel, hit]); await settle(st.wait || 900);
  }
  if (j.help) { await p.evaluate(() => { const q = document.querySelector('.wl-roomhead .wl-helpq, .wl-roomhead button'); q && q.click(); }); await settle(1200); }
  await settle(j.wait || 2500);
  res.read = await p.evaluate(() => {
    const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
    const leaves = [...document.querySelectorAll('.wb *, .wb-sheet *')].filter((e) => e.children.length === 0 && e.textContent.trim() && !e.closest('.wb-win,iframe'));
    const q = [...document.querySelectorAll('.wl-helpq')].filter(vis);
    const card = document.querySelector('[role=dialog].wl-helpcard, .wl-helpcard');
    return {
      screen: (document.querySelector('[data-website-screen]') || {}).dataset?.websiteScreen || (document.querySelector('[data-website-offer]') ? 'basic' : null),
      overflow: leaves.filter((e) => e.getBoundingClientRect().right > innerWidth + 1).map((e) => e.textContent.trim().slice(0, 40)),
      helpQs: q.length, headQs: [...document.querySelectorAll('.wl-roomhead .wl-helpq')].filter(vis).length,
      helpScroll: card ? card.scrollHeight - card.clientHeight : null,
      sheet: (document.querySelector('.wb-sheet h3') || {}).textContent || null,
      sheetButtons: [...document.querySelectorAll('.wb-sheet button')].map((x) => x.textContent.trim()),
      text: (document.querySelector('.wl-main') || document.body).innerText.slice(0, 4000),
      pillText: ((document.querySelector('.wb-pill, [data-add-top]') || {}).textContent || '').replace(/\s+/g, ' ').trim(), pills: [...document.querySelectorAll('.wb-pill, [data-add-top]')].filter(vis).length,
      pill: (() => { const pl = document.querySelector('.wb-pill, [data-add-top]'); if (!pl) return null; const r = pl.getBoundingClientRect();
        const hit = [...document.querySelectorAll('.wb-sub, .wl-helpq, .wb-back')].filter((e) => { const q = e.getBoundingClientRect(); return !(q.right <= r.left || q.left >= r.right || q.bottom <= r.top || q.top >= r.bottom); }).length;
        return { right: Math.round(r.right), top: Math.round(r.top), overlaps: hit }; })(),
      previews: [...document.querySelectorAll('.wb-win iframe')].map((f) => f.getAttribute('src')).slice(0, 8),
      // WEB-8 C2 (CE-47): a button whose label is wider than the button, or whose label runs past the screen, is clipped
      clipped: [...document.querySelectorAll('.wb button, .wb-sheet button, .wb a.wl-btn, .wb a.wb-sbtn')].filter(vis).filter((x) => { const r = x.getBoundingClientRect(); return x.scrollWidth > x.clientWidth + 1 || r.right > innerWidth + 1 || r.left < -1; }).map((x) => (x.textContent || '').trim().slice(0, 30) + ' (' + x.scrollWidth + '>' + x.clientWidth + ')'),
      // WEB-8 (Basic): the style page's controls and lines, the locked rows, and every disabled control on the screen
      basic: { use: [...document.querySelectorAll('[data-use-instead]')].filter(vis).length, clock: [...document.querySelectorAll('[data-clock-line]')].filter(vis).map((x) => x.textContent.trim()),
        locked: [...document.querySelectorAll('[data-locked]')].filter(vis).map((x) => x.getAttribute('data-locked') + ': ' + (x.querySelector('.wb-rd') || {}).textContent),
        seePlans: [...document.querySelectorAll('a[data-see-plans]')].filter(vis).filter((a) => /\/vendor\/billing$/.test(a.getAttribute('href') || '')).length,
        disabled: [...document.querySelectorAll('.wb button:disabled, .wb [aria-disabled="true"], .wb input:disabled')].filter(vis).filter((x) => !x.closest('.wb-arw'))   /* a reorder arrow at the end of the list is not a locked item */.map((x) => (x.getAttribute('aria-label') || x.textContent || '').trim().slice(0, 40)) },
      publishBtn: (() => { const b = [...document.querySelectorAll('.wb-pend .wl-btn')].find(vis); if (!b) return null; const r = b.getBoundingClientRect(); return { label: b.textContent.trim(), sw: b.scrollWidth, cw: b.clientWidth, right: Math.round(r.right) }; })(),
      small: [...document.querySelectorAll('.wb button, .wb-sheet button')].filter(vis).filter((x) => x.getBoundingClientRect().height < 36).map((x) => x.textContent.trim() || x.getAttribute('aria-label')).slice(0, 8),
    };
  });
  res.errs = errs; res.calls = calls;
  if (SHOTS) await p.screenshot({ path: path.join(SHOTS, `${j.name}.png`) });
  out.push(res); await ctx.close();
} } finally { await b.close(); }
console.log(JSON.stringify(out));
