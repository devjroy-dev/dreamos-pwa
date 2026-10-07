'use strict';
// scripts/b257_ce47_kit_waits_bench.js · CE-47 · ADS-2 · e-275: THE FE-7 KIT WAITS ON THE THING ITSELF, BOUNDED.
// FLOOR-SUBJECTS: scripts/lib/fe7_l4_kit.js
// Holds the kit's waits in a real chromium, each both ways: settle (quiet, restless, late), waitFor, waitUrl on data:
// pages; reloaded and logQuiet on a temp log. Mutations (each wait turned back into a blind return) red in children.
const fs = require('fs'); const path = require('path'); const os = require('os'); const crypto = require('crypto'); const cp = require('child_process');
const ROOT = path.join(__dirname, '..'); const CHILD = !!process.env.B257_CHILD;
const K = require(path.join(ROOT, 'scripts/lib/fe7_l4_kit.js'));
let pass = 0, fail = 0; const failed = [];
const ok = (c, name, info) => { if (c) { pass++; if (!CHILD) console.log(`  PASS  ${name}`); } else { fail++; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 200) + ']'}`); } };
const page = (body) => 'data:text/html,' + encodeURIComponent(`<!doctype html><html><body>${body}</body></html>`);
(async () => {
  const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
  const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_BIN || await chromium.executablePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const fresh = async () => { const p = await browser.newPage(); await K.instrument(p); return p; };
  try {
    if (!CHILD) console.log('\n── 1  settle ──');
    let p = await fresh(); await p.goto(page('<p>still</p>')); let r = await K.settle(p, { max: 3000 });
    ok(!r.timedOut && r.ms < 3000, '1.1 a quiet page settles', JSON.stringify(r)); await p.close();
    p = await fresh(); await p.goto(page('<p id=x></p><script>setInterval(()=>{x.textContent=Date.now()},100)</script>')); r = await K.settle(p, { max: 1500 });
    ok(r.timedOut && r.ms >= 1500, '1.2 a page that never goes quiet: settle stops at its cap and says so', JSON.stringify(r)); await p.close();
    p = await fresh(); await p.goto(page('<p id=x></p><script>const t=setInterval(()=>{x.textContent=Date.now()},80);setTimeout(()=>clearInterval(t),700)</script>')); r = await K.settle(p, { max: 5000 });
    ok(!r.timedOut && r.ms >= 600, '1.3 a page busy for 700 ms: settle waits it out, not a fixed pause', JSON.stringify(r)); await p.close();
    if (!CHILD) console.log('\n── 2  waitFor, waitUrl ──');
    p = await fresh(); await p.goto(page('<script>setTimeout(()=>{const d=document.createElement("div");d.className="card";document.body.append(d)},400)</script>'));
    r = await K.waitFor(p, '.card', 5000); ok(!r.timedOut && r.ms >= 300, '2.1 waitFor finds the element when it comes', JSON.stringify(r));
    r = await K.waitFor(p, '.never', 800); ok(r.timedOut && r.ms >= 800, '2.2 waitFor on an element that never comes: timed out at its cap', JSON.stringify(r)); await p.close();
    p = await fresh(); await p.goto('about:blank'); await p.evaluate(() => setTimeout(() => history.pushState({}, '', '#went'), 300));
    r = await K.waitUrl(p, (u) => u.endsWith('#went'), 5000); ok(!r.timedOut, '2.3 waitUrl sees the navigation when it happens', JSON.stringify(r));
    r = await K.waitUrl(p, (u) => u.includes('nowhere'), 800); ok(r.timedOut, '2.4 waitUrl on a URL that never comes: timed out at its cap', JSON.stringify(r)); await p.close();
    if (!CHILD) console.log('\n── 3  reloaded, logQuiet (the dev server log) ──');
    const LOG = path.join(fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'b257-')), 'dev.log');
    fs.writeFileSync(LOG, ' ✓ Compiled in 41ms\n');
    let mark = K.logMark(LOG); setTimeout(() => fs.appendFileSync(LOG, ' ✓ Compiled in 20ms\n'), 300);
    r = await K.reloaded(mark, LOG, 5000); ok(!r.timedOut && r.ms >= 200, '3.1 reloaded sees the Compiled line written after the mark', JSON.stringify(r));
    mark = K.logMark(LOG); r = await K.reloaded(mark, LOG, 800); ok(r.timedOut, '3.2 a Compiled line from BEFORE the mark is not this reload', JSON.stringify(r));
    let n = 0; const iv = setInterval(() => { fs.appendFileSync(LOG, `line ${n++}\n`); if (n >= 6) clearInterval(iv); }, 100);
    r = await K.logQuiet(LOG, { quiet: 500, max: 5000 }); ok(!r.timedOut && r.ms >= 500, '3.3 logQuiet waits for the log to stop moving', JSON.stringify(r));
  } finally { await browser.close().catch(() => {}); }
  if (!CHILD) console.log('\n── 4  e-277: anchors clean before the first cell ──');
  { const files = { 'a.ts': "const x = 'one';\n", 'b.ts': "const y = 'two-planted';\n" }; const rd = (rel) => files[rel];
    const clean = K.anchorsClean([{ name: 'M1', rel: 'a.ts', from: "'one'", to: "'one-planted'" }], rd);
    const planted = K.anchorsClean([{ name: 'M2', rel: 'b.ts', from: "'two'", to: "'two-planted'" }], rd);
    ok(clean.length === 0, '4.1 a clean anchor passes', JSON.stringify(clean));
    ok(planted.length === 2 && planted.some((x) => /already planted/.test(x)) && planted.every((x) => x.startsWith('b.ts')), '4.2 a mutation left applied is named, with its file', JSON.stringify(planted)); }
  const MUTS = [
    ["    if ((p.inflight || 0) === 0 && now - (p.lastNet || 0) >= quiet && now - lastMut >= quiet) return { ms: now - t0, timedOut: false };", "    return { ms: now - t0, timedOut: false };", 'M1 settle returns at once', '1.2'],
    ["    if (await p.evaluate((x) => !!document.querySelector(x), sel).catch(() => false)) return { ms: Date.now() - t0, timedOut: false };", "    return { ms: Date.now() - t0, timedOut: false };", 'M2 waitFor does not look', '2.2'],
    ["    if (pred(p.url())) return { ms: Date.now() - t0, timedOut: false };", "    return { ms: Date.now() - t0, timedOut: false };", 'M3 waitUrl does not look', '2.4'],
    ["if (size > mark) { const b = Buffer.alloc(size - mark); fs.readSync(fd, b, 0, b.length, mark);", "if (size > 0) { const b = Buffer.alloc(size); fs.readSync(fd, b, 0, b.length, 0);", 'M4 reloaded reads from the start, not the mark', '3.2'],
    ["    if (Date.now() - since >= quiet) return { ms: Date.now() - t0, timedOut: false };", "    return { ms: Date.now() - t0, timedOut: false };", 'M5 logQuiet returns at once', '3.3'],
    ["  return bad;\n}\nasync function open(", "  return [];\n}\nasync function open(", 'M6 anchorsClean sees nothing', '4.2'],
  ];
  if (CHILD) { console.log(`b257 child · ${pass} pass · ${fail} fail`); process.exit(fail ? 1 : 0); }
  console.log('\n── 9  mutations (each in a fresh child, restored by sha) ──');
  const P = path.join(ROOT, 'scripts/lib/fe7_l4_kit.js');
  for (const [from, to, name, cell] of MUTS) {
    const src = fs.readFileSync(P, 'utf8'); const before = crypto.createHash('sha256').update(src).digest('hex');
    if (src.split(from).length !== 2) { ok(false, `${name}: anchor found exactly once`); continue; }
    fs.writeFileSync(P, src.replace(from, to));
    let r; try { r = cp.spawnSync(process.execPath, [__filename], { env: { ...process.env, B257_CHILD: '1' }, encoding: 'utf8', timeout: 120000 }); } finally { fs.writeFileSync(P, src); }
    const after = crypto.createHash('sha256').update(fs.readFileSync(P)).digest('hex');
    ok(r.status === 1 && (r.stdout || '').includes(`FAIL  ${cell} `) && after === before, `${name}: reddens ${cell}, restored by sha`, (r.stdout || '').split('\n').filter((l) => l.includes('FAIL')).join(' / '));
  }
  console.log(`\nb257 · ${pass} pass · ${fail} fail`);
  if (failed.length) console.log('FAILED: ' + failed.join(' | '));
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.log('  FAIL  b257 crashed: ' + (e && e.message)); process.exit(1); });
