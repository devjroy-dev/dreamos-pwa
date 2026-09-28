// docs/review/tools/tour.mjs · screenshot every vendor room (first screen) and run the polish measures on each.
// usage: FONT_DIR=... node docs/review/tools/tour.mjs [mode] [vp] [routes,comma,separated]
import fs from 'fs';
import path from 'path';
import { browser, open, shot, OUT, ROOT } from './harness.mjs';

const [mode = 'dark', vp = 'ios', only = ''] = process.argv.slice(2);
function routes() {
  const out = [];
  const walk = (dir, url) => { for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    if (e.isDirectory()) walk(dir + '/' + e.name, url + '/' + e.name); else if (e.name === 'page.tsx') out.push(url ? '/vendor' + url : '/vendor'); } };
  walk('app/vendor/(shell)', '');
  return out.filter((r) => r !== '/vendor').map((r) => r.replace('[post_id]', 'p1')).sort();
}
const R = only ? only.split(',') : routes();
const b = await browser();
const results = {};
for (const r of R) {
  const name = r.replace('/vendor/', '').replace(/\//g, '-');
  try {
    const p = await open(b, r, { mode, vp });
    await shot(p, `screenshots/rooms/${name}-${mode}-${vp}.png`);
    results[r] = await p.evaluate(() => {
      const vh = innerHeight, vw = innerWidth;
      const vis = (e) => { const s = getComputedStyle(e); const b = e.getBoundingClientRect(); return s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05 && b.width > 0 && b.height > 0; };
      const lab = (e) => ((e.innerText || e.getAttribute('aria-label') || e.title || '').trim().replace(/\s+/g, ' ').slice(0, 40));
      const small = [...document.querySelectorAll('a,button,[role=button],input,select,textarea,summary,[tabindex="0"]')].filter(vis).map((e) => { const b = e.getBoundingClientRect(); return { t: lab(e), w: Math.round(b.width), h: Math.round(b.height), y: Math.round(b.top) }; }).filter((x) => x.w < 44 || x.h < 44);
      // contrast: every visible text node's element, colour against the nearest opaque background
      const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const a = m[1].split(',').map((x) => parseFloat(x)); return { r: a[0], g: a[1], b: a[2], a: a.length > 3 ? a[3] : 1 }; };
      const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
      const over = (top, bot) => ({ r: top.r * top.a + bot.r * (1 - top.a), g: top.g * top.a + bot.g * (1 - top.a), b: top.b * top.a + bot.b * (1 - top.a), a: 1 });
      const bgOf = (el) => { const stack = []; let e = el; while (e) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > 0) { stack.push(c); if (c.a >= 1) break; } e = e.parentElement; } let base = { r: 255, g: 255, b: 255, a: 1 }; if (stack.length && stack[stack.length - 1].a >= 1) base = stack.pop(); else base = document.documentElement.closest && parse(getComputedStyle(document.body).backgroundColor) || base; for (let i = stack.length - 1; i >= 0; i -= 1) base = over(stack[i], base); return base; };
      const low = []; const seen = new Set();
      const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n; while ((n = tw.nextNode())) { const t = n.textContent.trim(); if (!t) continue; const el = n.parentElement; if (!el || seen.has(el) || !vis(el)) continue; seen.add(el);
        const b = el.getBoundingClientRect(); if (b.bottom < 0 || b.top > vh * 3) continue; const cs = getComputedStyle(el); const fg = parse(cs.color); if (!fg) continue; const bg = bgOf(el); const f = over(fg, bg);
        let L1 = lum(f), L2 = lum(bg); const cr = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05); const size = parseFloat(cs.fontSize); const big = size >= 24 || (size >= 18.66 && +cs.fontWeight >= 700);
        const eff = cr * (+cs.opacity < 1 ? 1 : 1);
        if (eff < (big ? 3 : 4.5)) low.push({ t: t.slice(0, 40), cr: +cr.toFixed(2), size, color: cs.color, op: cs.opacity }); }
      const overflow = [...document.querySelectorAll('body *')].filter(vis).filter((e) => { const b = e.getBoundingClientRect(); return b.right > vw + 1 && b.width < vw * 3; }).slice(0, 8).map((e) => ({ tag: e.tagName, c: String(e.className).slice(0, 30), t: lab(e), right: Math.round(e.getBoundingClientRect().right) }));
      const clipped = [...document.querySelectorAll('body *')].filter(vis).filter((e) => { const cs = getComputedStyle(e); return (cs.textOverflow === 'ellipsis' || cs.webkitLineClamp !== 'none') && e.scrollWidth > e.clientWidth + 1; }).slice(0, 8).map((e) => lab(e));
      const hScroll = document.documentElement.scrollWidth > vw + 1;
      const dock = document.querySelector('.wl-dockfield, .wl-dock, nav'); const dockTop = dock ? Math.round(dock.getBoundingClientRect().top) : null;
      const docH = Math.round(document.scrollingElement.scrollHeight);
      const fonts = [...new Set([...document.querySelectorAll('.wl-main *')].filter(vis).map((e) => { const cs = getComputedStyle(e); return cs.fontFamily.split(',')[0].replace(/["']/g, '') + ' ' + cs.fontSize + ' ' + cs.fontWeight; }))];
      const h1 = (document.querySelector('.wl-roomhead h1') || {}).innerText || null;
      return { h1, small, low: low.slice(0, 12), lowCount: low.length, overflow, clipped, hScroll, dockTop, docH, vh, fonts: fonts.slice(0, 30), text: (document.querySelector('.wl-main') || document.body).innerText.slice(0, 1500) };
    });
    await p.close();
    console.log('ok', r);
  } catch (e) { console.log('ERR', r, String(e.message).slice(0, 200)); results[r] = { error: String(e.message).slice(0, 200) }; }
}
fs.mkdirSync(path.join(OUT, 'tools/data'), { recursive: true });
const file = path.join(OUT, `tools/data/tour-${mode}-${vp}.json`);
let prev = {}; try { prev = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (_e) { /* first run */ }
fs.writeFileSync(file, JSON.stringify({ ...prev, ...results }, null, 1));
await b.close();
