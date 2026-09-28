// docs/review/tools/check-html.mjs · opens every mock-up from file://, walks its buttons, and screenshots it (desktop
// and phone width). Fails loudly on a script error or a button that goes nowhere.
import fs from 'fs';
import path from 'path';
import { browser, OUT, sleep } from './harness.mjs';
const b = await browser();
const errs = [];
const walks = { 'leads-flow.html': ['lead', 'book', 'client'], 'date-flow.html': ['date', 'calendar'], 'crew-flow.html': ['week', 'event'], 'money-flow.html': ['client', 'invoice', 'money'], 'palettes.html': ['lead'] };
for (const [file, walk] of Object.entries(walks)) {
  for (const [w, h, tag] of [[1280, 900, 'desktop'], [374, 812, 'phone']]) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w < 500, hasTouch: w < 500 });
    p.on('pageerror', (e) => errs.push(file + ': ' + e.message));
    await p.goto('file://' + path.join(OUT, 'html', file) + (tag === 'phone' ? '?mode=light' : ''));
    await p.evaluate(async () => { await document.fonts.ready; }); await sleep(300);
    for (const to of walk) {
      const ok = await p.evaluate((to) => { const el = [...document.querySelectorAll('#phone [data-go="' + to + '"]')].find((e) => e.getBoundingClientRect().width > 0); if (!el) return false; el.click(); return true; }, to);
      if (!ok) errs.push(`${file} ${tag}: no visible button goes to ${to}`);
      await sleep(150);
    }
    const hscroll = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    if (hscroll) errs.push(`${file} ${tag}: the page scrolls sideways`);
    const rel = `html-${file.replace('.html', '')}-${tag}.png`;
    await p.screenshot({ path: path.join(OUT, 'mocks/html', rel).replace(/(mocks\/html)/, (m) => (fs.mkdirSync(path.join(OUT, 'mocks/html'), { recursive: true }), m)) });
    await p.close();
  }
}
if (!fs.existsSync(path.join(OUT, 'mocks/html'))) fs.mkdirSync(path.join(OUT, 'mocks/html'));
console.log(errs.length ? errs.join('\n') : 'all mock-ups walk clean');
await b.close();
process.exit(errs.length ? 1 : 0);
