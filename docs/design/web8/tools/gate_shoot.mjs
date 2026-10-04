// WEB-8 gate: viewport frames at EVERY scroll point (one viewport per step) of one page, reduced motion, fonts loaded.
// node shoot.mjs <url> <outdir> <tag> <width> [fixturesDir: serve every fixture photograph as its 960 webp]
import path from 'path'; import fs from 'fs';
const ROOT = process.env.TDW_ROOT || process.cwd();
const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
const [url, out, tag, W, FX, SLOTS] = process.argv.slice(2); const H = 760; const crypto = await import('crypto');
const FXD = FX || path.join(ROOT, 'scripts/fixtures/site'); const byHash = {}; for (const f of fs.readdirSync(FXD)) byHash[crypto.createHash('sha256').update(fs.readFileSync(path.join(FXD, f))).digest('hex')] = f;
fs.mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: await chromium.executablePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'] });
try {
  const pg = await browser.newPage(); const errs = [];
  pg.on('pageerror', (e) => errs.push(e.message));
  await pg.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await pg.setViewport({ width: +W, height: H, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  if (FX) { const meta = JSON.parse(fs.readFileSync(path.join(FX, 'fixtures.json'), 'utf8'));
    await pg.setRequestInterception(true);
    pg.on('request', (r) => { const m = /\/tdwfx\/image\/upload\/([^/]+)\/v\d+\/site\/([a-z-]+)\.jpg/.exec(r.url());
      const g = /\/__gate\/([a-z0-9.-]+)$/.exec(r.url()); if (g) return r.respond({ status: 200, contentType: g[1].endsWith('.svg') ? 'image/svg+xml' : 'image/webp', body: fs.readFileSync(path.join(out, 'slotfiles', g[1])) });
      if (!m || !meta[m[2]]) return r.continue();
      if (/w_24,e_blur/.test(m[1])) return r.respond({ status: 200, contentType: 'image/webp', body: Buffer.from(meta[m[2]].lq.split(',')[1], 'base64') });
      r.respond({ status: 200, contentType: 'image/webp', body: fs.readFileSync(path.join(FX, m[2] + '-960.webp')) }); }); }
  await pg.goto(url, { waitUntil: 'networkidle0', timeout: 240000 });
  if (!FX) await pg.addStyleTag({ content: '.pt{display:none!important}' });   // the prototype's own label chip, not part of the site
  if (SLOTS) { const slots = JSON.parse(fs.readFileSync(SLOTS, 'utf8')).slots;   // same file in the same slot as the prototype
    const n = await pg.evaluate((slots) => { const im = [...document.images]; if (im.length !== slots.length) return -im.length;
      im.forEach((e, i) => { if (!slots[i]) return; e.removeAttribute('srcset'); e.removeAttribute('data-srcset'); e.removeAttribute('sizes'); e.removeAttribute('loading'); e.src = 'http://127.0.0.1:4811/__gate/' + slots[i]; if (e.dataset.src) e.dataset.src = e.src; }); return im.length; }, slots);
    if (n < 0) console.log('SLOT COUNT DIFFERS: server imgs ' + (-n) + ' prototype ' + slots.length); }
  await pg.evaluate(() => document.fonts.ready); await new Promise((r) => setTimeout(r, 3000));
  // walk once to the end so every deferred photograph is asked for, then back to the top
  let SH = await pg.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < SH; y += H) { await pg.evaluate((y) => scrollTo(0, y), y); await new Promise((r) => setTimeout(r, 350)); }
  await pg.evaluate(() => scrollTo(0, 0)); await new Promise((r) => setTimeout(r, 1500));
  await pg.evaluate(() => Promise.all([...document.images].filter((i) => i.currentSrc || i.src).map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 8000); })))));
  SH = await pg.evaluate(() => document.documentElement.scrollHeight);
  const ys = []; for (let y = 0; y < SH - H; y += H) ys.push(y); ys.push(Math.max(0, SH - H));
  let k = 0; const rules = [];
  for (const y of ys) { await pg.evaluate((y) => { scrollTo(0, y); dispatchEvent(new Event("scroll")); }, y); await new Promise((r) => setTimeout(r, 400));
    // both sides: have the browser redraw its layers at this scroll point, so a layer's sub-pixel placement never depends on how the page got here
    await pg.evaluate((y) => { const b = document.body; const d = b.style.display; b.style.display = 'none'; void b.offsetHeight; b.style.display = d; scrollTo(0, y); dispatchEvent(new Event("scroll")); }, y); await new Promise((r) => setTimeout(r, +(process.env.SETTLE || 1500)));
    // where the founder's rulings sit in this frame (device pixels): the reviews label, Couture's video poster, Riviera's postmark, and the header
    rules.push(await pg.evaluate(() => { const R = (e, name) => { const r = e.getBoundingClientRect(); return r.width && r.bottom > 0 && r.top < innerHeight ? { name, x0: Math.floor(r.left * 2), y0: Math.floor(r.top * 2), x1: Math.ceil(r.right * 2), y1: Math.ceil(r.bottom * 2) } : null; };
      const out = []; for (const e of document.querySelectorAll('span,div,p,h2,h3,em,b,i')) { if (e.children.length) continue; if (/^(kind words|client reviews)$/i.test((e.textContent || '').trim())) out.push(R(e, 'label')); }
      const lab = [...document.querySelectorAll('span,div,p')].filter((e) => e.children.length <= 2 && /(·\s*)(kind words|client reviews)$/i.test((e.textContent || '').trim()) && (e.textContent || '').length < 60); lab.forEach((e) => out.push(R(e, 'label')));
      document.querySelectorAll('#vtPh').forEach((e) => out.push(R(e, 'poster'))); document.querySelectorAll('.pc .pm').forEach((e) => out.push(R(e, 'postmark')));
      const h = document.querySelector('#hd, header'); if (h) { const o = R(h, 'header'); if (o) { const bf = getComputedStyle(h).backdropFilter || getComputedStyle(h).webkitBackdropFilter || ''; const mm = /blur\(([\d.]+)px\)/.exec(bf); o.blur = mm ? +mm[1] : 0; out.push(o); } } return out.filter(Boolean); }));
    await pg.screenshot({ path: path.join(out, `${tag}_${W}_${String(k++).padStart(2, '0')}.png`) }); }
  const srcs = await pg.evaluate(() => [...document.images].map((i) => i.currentSrc || i.src || ''));
  fs.mkdirSync(path.join(out, 'slotfiles'), { recursive: true });
  const slots = srcs.map((u) => { if (!u.startsWith('data:image/')) return null; const b = Buffer.from(u.split(',')[1], 'base64'); const h = crypto.createHash('sha256').update(b).digest('hex');
    const name = byHash[h] || ('proto-' + h.slice(0, 16) + '.' + (/^data:image\/([a-z+]+)/.exec(u)[1].replace('svg+xml', 'svg')));
    if (!FX) fs.writeFileSync(path.join(out, 'slotfiles', name), b); return name; });
  const faces = await pg.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family + ' ' + f.weight + ' ' + f.style).sort());
  fs.writeFileSync(path.join(out, `${tag}_${W}.json`), JSON.stringify({ tag, W: +W, H, scrollHeight: SH, ys, rules, slots, imgs: srcs.length, faces, errors: errs.slice(0, 8) }));
  console.log(JSON.stringify({ tag, W: +W, scrollHeight: SH, shots: k, imgs: srcs.length, known: slots.filter(Boolean).length, faces: faces.length, errors: errs.slice(0, 3) }));
} finally { await browser.close(); }
