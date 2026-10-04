// WEB-5 rig: on the photograph itself (the ZIP's perf3 method, fail-closed): first paint, cover photo complete,
// every face's load time, layout shift (total and during the face swap). node perf.mjs <url> <Fast|Slow> <width>
import path from 'path';
const ROOT = new URL('../..', import.meta.url).pathname;
const PM = await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js')); const puppeteer = PM.default;
const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
const [url, net, W, mode] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: await chromium.executablePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  const pg = await b.newPage(); await pg.setViewport({ width: +W, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await pg.setCacheEnabled(false); await pg.emulateNetworkConditions(PM.PredefinedNetworkConditions[net + ' 3G']);
  // EXPERIMENT ONLY (mode 'nojs'): the framework's script files refused, to measure what they cost the cover.
  if (mode === 'nojs' || mode === 'nojscss') { await pg.setRequestInterception(true); pg.on('request', (r) => ((r.url().includes('/_next/static/chunks/') || (mode === 'nojscss' && r.url().includes('/_next/static/css/'))) ? r.abort() : r.continue())); }
  await pg.evaluateOnNewDocument(() => { window.__m = { fcp: 0, hero: 0, heroSrc: '', faces: {}, shifts: [] };
    document.addEventListener('load', (e) => { const t = e.target; if (t && t.tagName === 'IMG' && t.getAttribute('fetchpriority') === 'high' && !window.__m.hero) { window.__m.hero = Math.round(performance.now()); window.__m.heroSrc = (t.currentSrc || t.src).split('/upload/')[1] || ''; } }, true);
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__m.shifts.push([Math.round(e.startTime), +e.value.toFixed(4)]); }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__m.fcp = Math.round(e.startTime); }).observe({ type: 'paint', buffered: true });
    const iv = setInterval(() => { const im = document.querySelector('img[fetchpriority=high]'); if (false && im) { window.__m.hero = Math.round(performance.now()); window.__m.heroSrc = (im.currentSrc || im.src).split('/').slice(-3).join('/'); }
      if (document.fonts) for (const f of document.fonts) if (f.status === 'loaded' && !window.__m.faces[f.family + ' ' + f.weight + ' ' + f.style]) window.__m.faces[f.family + ' ' + f.weight + ' ' + f.style] = Math.round(performance.now());
      if (performance.now() > 60000) clearInterval(iv); }, 20); });
  await pg.goto(url, { waitUntil: 'load', timeout: 120000 });
  const ok = await pg.waitForFunction(() => window.__m.hero > 0, { timeout: 60000 }).then(() => true).catch(() => false);
  await new Promise((r) => setTimeout(r, 4000));
  const m = await pg.evaluate(() => window.__m);
  const cls = m.shifts.reduce((a, s) => a + s[1], 0);
  console.log(JSON.stringify({ url: url.split('/').pop(), mode: mode || 'real', net, W: +W, fcp: m.fcp, hero: ok ? m.hero : null, heroSrc: m.heroSrc, faces: m.faces, cls: +cls.toFixed(4), shifts: m.shifts.slice(0, 8) }));
  if (!ok) process.exitCode = 1;   // fail closed: no photograph, no number
} finally { await b.close(); }
