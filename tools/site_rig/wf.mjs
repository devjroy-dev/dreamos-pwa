// WEB-5 rig: the request waterfall of one throttled load. node wf.mjs <url> <Fast|Slow>
import path from 'path';
const ROOT = new URL('../..', import.meta.url).pathname;
const PM = await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js')); const puppeteer = PM.default;
const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
const [url, net] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: await chromium.executablePath(), headless: true, args: ['--no-sandbox'] });
const pg = await b.newPage(); await pg.setViewport({ width: 374, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await pg.setCacheEnabled(false); await pg.emulateNetworkConditions(PM.PredefinedNetworkConditions[net + ' 3G']);
const t0 = Date.now(); const rows = {};
pg.on('request', (r) => { rows[r.url()] = { s: Date.now() - t0, pr: r.initialPriority?.() || '' }; });
pg.on('requestfinished', async (r) => { const x = rows[r.url()]; if (x) { x.e = Date.now() - t0; try { x.kb = Math.round((await r.response().buffer()).length / 1024); } catch { } } });
await pg.goto(url, { waitUntil: 'load', timeout: 120000 }); await new Promise((r) => setTimeout(r, 3000));
for (const [u, x] of Object.entries(rows).sort((a, b) => a[1].s - b[1].s)) console.log(String(x.s).padStart(6), String(x.e ?? '-').padStart(6), String(x.kb ?? '').padStart(4) + 'KB', x.pr.padEnd(8), u.replace(/^https?:\/\/[^/]+/, '').slice(0, 90));
await b.close();
