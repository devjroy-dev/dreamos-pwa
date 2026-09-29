// docs/design/tools/offcompare.mjs · DESIGN-1 · THE LAYOUT SWITCH · the standby's proof.
// With the switch OFF (no layout cookie), every vendor page must look exactly as main draws it. This screenshots every
// route on main's own build (BASE_PORT) and on this tree (PORT), at 374x812 and 360x800, dark and light, in the same
// order and settle, and compares the two images pixel for pixel (decoded in the browser, so PNG encoding cannot hide or
// invent a difference). Writes a JSON report and, for any page that differs, both images and a diff image.
// usage: BASE_PORT=4200 PORT=4300 ROUTES=/vendor/today,... node offcompare.mjs <outdir>
import fs from 'fs';
import path from 'path';
import { browser } from './harness.mjs';

const OUT = process.argv[2] || 'offcompare-out';
const ROUTES = (process.env.ROUTES || '').split(',').filter(Boolean);
const VPS = { ios: [374, 812], android: [360, 800] };
const MODES = ['dark', 'light'];
fs.mkdirSync(OUT, { recursive: true });
const b = await browser();

async function shoot(port, route, mode, vp) {
  const ctx = await b.createBrowserContext();
  const p = await ctx.newPage();
  const [w, h] = VPS[vp];
  await p.setViewport({ width: w, height: h, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  await p.setCookie({ name: 'tdw_wl_mode', value: mode, domain: 'localhost', path: '/' });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(`http://localhost:${port}${route}`, { waitUntil: 'domcontentloaded', timeout: 180000 }).catch(() => {});
  for (let i = 0; i < 120 && !(await p.evaluate(() => !!document.querySelector('.wl-main, main, body > div')).catch(() => false)); i += 1) await new Promise((r) => setTimeout(r, 500));
  await p.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
  await new Promise((r) => setTimeout(r, 3500));
  // freeze what moves on its own: carets and CSS animations
  await p.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}' });
  await new Promise((r) => setTimeout(r, 300));
  const img = await p.screenshot({ type: 'png' });
  await ctx.close();
  return img;
}

// main is shot TWICE: a pixel is a real difference only where the two main shots agree and this tree's shot does not.
// Pixels where main disagrees with itself (antialiasing on a circle's edge that drifts between two identical renders)
// are counted as noise and reported, never as a difference.
async function diff(a1, a2, c) {
  const ctx = await b.createBrowserContext();
  const p = await ctx.newPage();
  const r = await p.evaluate(async (A1, A2, B) => {
    const load = (s) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = 'data:image/png;base64,' + s; });
    const [i1, i2, ib] = await Promise.all([load(A1), load(A2), load(B)]);
    if (i1.width !== ib.width || i1.height !== ib.height) return { size: true, n: -1, noise: 0 };
    const cv = (i) => { const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const x = c.getContext('2d'); x.drawImage(i, 0, 0); return x.getImageData(0, 0, i.width, i.height).data; };
    const d1 = cv(i1), d2 = cv(i2), db = cv(ib); let n = 0, noise = 0;
    const out = document.createElement('canvas'); out.width = i1.width; out.height = i1.height; const ox = out.getContext('2d'); const od = ox.createImageData(i1.width, i1.height);
    const eq = (x, y, k) => x[k] === y[k] && x[k + 1] === y[k + 1] && x[k + 2] === y[k + 2];
    for (let k = 0; k < d1.length; k += 4) {
      const stable = eq(d1, d2, k);
      const real = stable && !eq(d1, db, k);
      if (!stable) noise += 1;
      if (real) n += 1;
      od.data[k] = real ? 255 : d1[k] / 3; od.data[k + 1] = real ? 0 : d1[k + 1] / 3; od.data[k + 2] = real ? 0 : d1[k + 2] / 3; od.data[k + 3] = 255;
    }
    ox.putImageData(od, 0, 0);
    return { size: false, n, noise, diff: n ? out.toDataURL('image/png').split(',')[1] : null };
  }, a1.toString('base64'), a2.toString('base64'), c.toString('base64'));
  await ctx.close();
  return r;
}

const report = [];
for (const route of ROUTES) for (const vp of Object.keys(VPS)) for (const mode of MODES) {
  const base = await shoot(process.env.BASE_PORT, route, mode, vp);
  const here = await shoot(process.env.PORT, route, mode, vp);
  const base2 = await shoot(process.env.BASE_PORT, route, mode, vp);
  const d = await diff(base, base2, here);
  const tag = `${route.replace(/\//g, '_')}__${vp}__${mode}`;
  if (d.n !== 0) {
    fs.writeFileSync(path.join(OUT, `${tag}__main.png`), base);
    fs.writeFileSync(path.join(OUT, `${tag}__off.png`), here);
    if (d.diff) fs.writeFileSync(path.join(OUT, `${tag}__diff.png`), Buffer.from(d.diff, 'base64'));
  }
  report.push({ route, vp, mode, differingPixels: d.n, mainNoisePixels: d.noise, sizeDiffers: d.size });
  console.log(`${d.n === 0 ? 'SAME   ' : 'DIFFERS'} ${route} ${vp} ${mode}${d.n ? ` (${d.n} px)` : ''}${d.noise ? ` · main vs main noise ${d.noise} px` : ''}`);
}
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 1));
const bad = report.filter((r) => r.differingPixels !== 0);
console.log(`\n${report.length - bad.length}/${report.length} identical to main`);
await b.close();
process.exit(bad.length ? 1 : 0);
