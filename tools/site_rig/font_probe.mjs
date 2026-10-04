// WEB-5 rig: which font each text node of a page actually draws in (CDP CSS.getPlatformFontsForNode).
// Usage: node font_probe.mjs <pageUrl> <stubBase> <outPng> [width]
import path from 'path';
const ROOT = new URL('../..', import.meta.url).pathname;
const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
const [url, stub, png, W] = process.argv.slice(2);
const browser = await puppeteer.launch({ executablePath: await chromium.executablePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  const pg = await browser.newPage();
  await pg.setViewport({ width: +(W || 374), height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await pg.setRequestInterception(true);
  pg.on('request', async r => {
    const u = r.url();
    if (u.startsWith('https://fonts.googleapis.com/css2')) {
      const q = u.split('?')[1] || ''; const body = await (await fetch(`${stub}/gfonts.css?q=${encodeURIComponent(q)}`)).text();
      return r.respond({ status: 200, contentType: 'text/css', headers: { 'access-control-allow-origin': '*' }, body });
    }
    if (/^https:\/\/(fonts\.gstatic|fonts\.googleapis)\.com/.test(u)) return r.respond({ status: 200, body: '' });
    r.continue();
  });
  await pg.goto(url, { waitUntil: 'networkidle0', timeout: 180000 });
  await pg.evaluate(() => document.fonts.ready); await new Promise(r => setTimeout(r, 800));
  const cdp = await pg.createCDPSession(); await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
  const marks = await pg.evaluate(() => { const out = []; let i = 0; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) { const t = n.textContent.trim(); const el = n.parentElement; if (!t || !el || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) continue;
      const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      el.setAttribute('data-fp', String(i)); out.push({ i, t: t.slice(0, 40), fam: cs.fontFamily, w: cs.fontWeight, st: cs.fontStyle }); i++; } return out; });
  const res = [];
  for (const m of marks) {
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: `[data-fp="${m.i}"]` });
    if (!nodeId) continue; const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
    res.push({ ...m, used: fonts.map(f => `${f.familyName}${f.isCustomFont ? '' : ' (system)'}`).join(', ') });
  }
  await pg.evaluate(() => document.querySelectorAll('[data-fp]').forEach(e => e.removeAttribute('data-fp')));
  await pg.screenshot({ path: png, fullPage: true });
  console.log(JSON.stringify(res));
} finally { await browser.close(); }
