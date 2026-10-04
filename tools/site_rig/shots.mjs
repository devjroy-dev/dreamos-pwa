// WEB-5 rig: viewport screenshots at scroll points (a scroll-driven page is not a full-page photo).
// node shots.mjs <url> <tag> <width> <height> <ys comma, as fractions of scrollHeight or 'px:' values> [reduce]
import path from 'path';
const ROOT = new URL('../..', import.meta.url).pathname;
const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
const [url, tag, W, Hh, ys, reduce] = process.argv.slice(2);
const browser = await puppeteer.launch({ executablePath: await chromium.executablePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  const pg = await browser.newPage(); const errs = []; pg.on('pageerror', (e) => errs.push(e.message)); pg.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 160)); });
  if (reduce) await pg.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await pg.setViewport({ width: +W, height: +Hh, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await pg.goto(url, { waitUntil: 'networkidle0', timeout: 180000 }); await pg.evaluate(() => document.fonts.ready); await new Promise((r) => setTimeout(r, 2600));
  const SH = await pg.evaluate(() => document.documentElement.scrollHeight);
  let k = 0;
  for (const y0 of ys.split(',')) { const y = y0.startsWith('px:') ? +y0.slice(3) : Math.round(+y0 * (SH - +Hh));
    await pg.evaluate((y) => { scrollTo(0, y); dispatchEvent(new Event('scroll')); }, y); await new Promise((r) => setTimeout(r, 1400));
    await pg.screenshot({ path: `${process.env.TDW_SHOTS || '/tmp'}/${tag}_${W}_${k++}.png` }); }
  console.log(JSON.stringify({ tag, W: +W, scrollHeight: SH, shots: k, errors: errs.slice(0, 6) }));
} finally { await browser.close(); }
