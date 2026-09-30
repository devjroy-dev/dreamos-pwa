// scripts/lib/b151_own_number_room_probe.mjs · TDW CE-46 · G6-4 · the room finished · b151's browser arm.
// b140's method (puppeteer-core, the theme by the shell's cookie, every read answered by the stand-in, the service worker bypassed,
// the real faces registered after the room settles, A-45.9), at 374 wide (the mock's width, approved 28 Sept 2026).
// usage: node scripts/lib/b151_own_number_room_probe.mjs PORT MODE SCENARIOS(comma list)
// Prints ONE line of JSON: { mode, results: { <scenario>: {...} }, errors }. A missing key reads as RED in the bench.
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync } from 'child_process';
import puppeteer from '../../node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
import { answer } from './b123_fixtures.mjs';

const [PORT = '3995', MODE_ARG, LIST = ''] = process.argv.slice(2);
const MODE = MODE_ARG === 'light' ? 'light' : 'dark';
const usable = (p) => { try { return !!p && fs.statSync(p).isFile(); } catch (_e) { return false; } };
async function resolveBin() {
  for (const c of [process.env.CHROME_BIN, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome']) if (usable(c)) return c;
  try { const mod = await import('@sparticuz/chromium'); const c = mod.default || mod; const p = await c.executablePath(); if (usable(p)) return p; } catch (_e) { /* declared below */ }
  return null;
}
const bin = await resolveBin();
if (!bin) { console.log(JSON.stringify({ browser: null })); process.exit(3); }

const NUM = '+91 87577 88550';
const LAUNCH = { app_id: '1234567890', config_id: '1661411452073678', graph_version: 'v25.0', extras: { shared: null, moved: null } };
const line = (way, status = 'active') => ({ status, display_number: NUM, way, quality_rating: 'GREEN' });
const door = (o) => ({ ok: true, open: true, reason: null, reason_text: null, launch: LAUNCH, number: null, removed: null, ...o });
const REMOVED = { display_number: NUM, way: 'shared', finish_in_app: true };
const SC = {
  shared:      { door: door({ number: line('shared') }) },
  moved:       { door: door({ number: line('moved') }) },
  sheetShared: { door: door({ number: line('shared') }), act: 'sheet' },
  sheetMoved:  { door: door({ number: line('moved') }), act: 'sheet' },
  removing:    { door: door({ number: line('shared') }), act: 'confirm', remove: 'hang' },
  refused:     { door: door({ number: line('shared') }), act: 'confirm', remove: { ok: false, reason: 'meta_unsubscribe' } },
  removed:     { door: door({ number: line('shared') }), act: 'confirm', remove: { ok: true, removed: REMOVED } },
  shut:        { door: door({ open: false, launch: null, reason: 'x', reason_text: 'This opens once we finish connecting the service.', removed: REMOVED }) },
};
const cache = path.join(os.tmpdir(), 'b123-fonts');
const want = ['dm-sans-latin-400-normal.woff2', 'dm-sans-latin-500-normal.woff2', 'cormorant-garamond-latin-500-normal.woff2'];
const out = { mode: MODE, results: {}, errors: [] };
try {
  if (!want.every((f) => fs.existsSync(path.join(cache, f)))) {
    fs.mkdirSync(cache, { recursive: true });
    execSync('npm pack @fontsource/dm-sans@5 @fontsource/cormorant-garamond@5 --silent', { cwd: cache, stdio: 'ignore', timeout: 120000 });
    for (const t of fs.readdirSync(cache).filter((f) => f.endsWith('.tgz'))) execSync(`tar xzf ${t} package/files`, { cwd: cache, stdio: 'ignore' });
    for (const f of want) { const s = path.join(cache, 'package', 'files', f); if (fs.existsSync(s)) fs.copyFileSync(s, path.join(cache, f)); }
  }
} catch (e) { out.errors.push('faces: ' + String(e && e.message).split('\n')[0]); }
const settle = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ executablePath: bin, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  for (const name of LIST.split(',').filter(Boolean)) {
    const s = SC[name]; if (!s) { out.errors.push('unknown scenario ' + name); continue; }
    const res = { posts: [], quietPosts: [], pageErrors: [] };
    const p = await b.newPage();
    await p.setViewport({ width: 374, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    p.on('pageerror', (e) => res.pageErrors.push(String(e && e.message).split('\n')[0]));
    await p.setCookie({ name: 'tdw_wl_mode', value: MODE, domain: 'localhost', path: '/' });
    const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
    await p.setRequestInterception(true);
    let quiet = 120;
    p.on('request', (r) => {
      const u = r.url(); if (!u.includes('/__api/')) return r.continue();
      const route = u.split('/__api')[1].split('?')[0];
      const J = (o) => r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
      if (route.endsWith('/solutions/number')) return J(s.door);
      if (route.endsWith('/solutions/number/remove')) { res.posts.push(r.postData() || ''); if (s.remove === 'hang') return undefined; return J(s.remove || { ok: false }); }
      if (route.endsWith('/solutions/quiet')) { if (r.method() === 'POST') { res.quietPosts.push(r.postData() || ''); try { quiet = JSON.parse(r.postData()).minutes; } catch (_e) { /* the bench reads quietPosts */ } } return J({ ok: true, minutes: quiet }); }
      if (route.endsWith('/solutions/instagram')) return J({ ok: true, state: 'on', authorize_url: null });
      const a = answer(route); return J(a && Object.keys(a).length > 1 ? a : { ok: true, items: [], rows: [], list: [] });
    });
    const ready = async () => { try { return await p.evaluate(() => !!document.querySelector('.wl-main [data-own-number], .wl-main .sol-surface .sol-kicker') && !!document.querySelector('[data-meta-room="quiet"]')); } catch (_e) { return false; } };
    // the dev server reloads the first paint once (the trace of 28 Sept 2026); the second load is the one measured
    await p.goto(`http://localhost:${PORT}/vendor/number`, { waitUntil: 'domcontentloaded', timeout: 240000 });
    await settle(4000);
    await p.goto(`http://localhost:${PORT}/vendor/number`, { waitUntil: 'networkidle2', timeout: 240000 });
    let up = false; for (let i = 0; i < 300 && !up; i += 1) { up = await ready(); if (!up) await settle(300); }
    res.loaded = up;
    try {
      const names = await p.evaluate(() => { const cs = getComputedStyle(document.documentElement); const f = (v) => v.split(',')[0].trim().replace(/^["']|["']$/g, ''); return { dm: f(cs.getPropertyValue('--font-dm-sans')), co: f(cs.getPropertyValue('--font-cormorant')) }; });
      const face = (fam, file, w) => `@font-face{font-family:'${fam}';font-weight:${w};font-style:normal;src:url(data:font/woff2;base64,${fs.readFileSync(path.join(cache, file)).toString('base64')}) format('woff2');}`;
      if (names.dm && names.co) await p.addStyleTag({ content: [face(names.dm, want[0], 400), face(names.dm, want[1], 500), face(names.co, want[2], 500)].join('\n') });
      await p.evaluate(async () => { await document.fonts.ready; });
    } catch (e) { out.errors.push('faces: ' + String(e && e.message).split('\n')[0]); }
    const room = () => p.evaluate(() => {
      const T = (el) => { const cs = getComputedStyle(el); return { size: parseFloat(cs.fontSize), weight: parseInt(cs.fontWeight, 10), family: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim() }; };
      const sec = document.querySelector('.wl-main [data-own-number]') || document.querySelector('.wl-main .sol-surface');
      const txt = (el) => (el ? el.textContent.trim() : null);
      const box = document.querySelector('.on-box'); const num = box && box.querySelector('.on-number');
      const sheet = document.querySelector('.tdw-rmnum');
      const q = document.querySelector('[data-meta-room="quiet"]');
      const radios = q ? [...q.querySelectorAll('[role="radio"]')] : [];
      const danger = sheet && sheet.querySelector('.rm-btn.danger');
      return {
        own: sec ? (sec.dataset.ownNumber || 'shell') : null,
        kicker: txt(sec && sec.querySelector('.sol-kicker')),
        box: box ? [...box.querySelectorAll('p')].map(txt) : null,
        numType: num ? T(num) : null,
        buttons: sec ? [...sec.querySelectorAll('button')].map(txt) : [],
        refused: txt(sec && sec.querySelector('.on-refused')),
        finish: txt(document.querySelector('[data-s6="finish-in-app"]')),
        bodyText: document.querySelector('.wl-main') ? document.querySelector('.wl-main').innerText : '',
        sheet: sheet ? { state: sheet.dataset.state, way: sheet.dataset.way, role: sheet.getAttribute('role'), modal: sheet.getAttribute('aria-modal'), number: txt(sheet.querySelector('.rm-number')), line: txt(sheet.querySelector('.rm-line')),
          buttons: [...sheet.querySelectorAll('.rm-row button')].map(txt), inShell: !!sheet.closest('[data-wl-mode]'),
          dangerBorder: danger ? getComputedStyle(danger).borderTopColor : null, dangerColor: danger ? getComputedStyle(danger).color : null, dangerBg: danger ? getComputedStyle(danger).backgroundColor : null,
          critical: getComputedStyle(sheet).getPropertyValue('--role-critical').trim() } : null,
        quiet: q ? { group: !!q.querySelector('[role="radiogroup"]'), labelledBy: txt(document.getElementById((q.querySelector('[role="radiogroup"]') || {}).getAttribute?.('aria-labelledby') || '')),
          radios: radios.map((r) => ({ label: txt(r), checked: r.getAttribute('aria-checked'), h: r.getBoundingClientRect().height })), select: !!q.querySelector('select') } : null,
      };
    });
    const tap = (label, scope = 'document') => p.evaluate((label, scope) => { const root = scope === 'sheet' ? document.querySelector('.tdw-rmnum') : document; const b = root && [...root.querySelectorAll('button')].find((x) => x.textContent.trim() === label); if (b) b.click(); return !!b; }, label, scope);
    try {
      res.at = await room();
      if (s.act) {
        res.tappedRemove = await tap('Remove this number'); await settle(400);
        res.sheetOpen = await room();
        if (s.act === 'confirm') { res.tappedConfirm = await tap('Remove', 'sheet'); await settle(900); res.after = await room(); }
        if (s.act === 'sheet') { await p.keyboard.press('Escape'); await settle(300); res.afterEscape = await room(); }
      }
      if (name === 'shared') {
        res.tappedQuiet = await tap('4 hours'); await settle(700); res.afterQuiet = await room();
        res.tappedSame = await tap('4 hours'); await settle(500);
      }
    } catch (e) { res.pageErrors.push('probe: ' + String(e && e.message).split('\n')[0]); }
    out.results[name] = res;
    await p.close();
  }
} finally { await b.close(); }
console.log(JSON.stringify(out));
