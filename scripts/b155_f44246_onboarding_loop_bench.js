#!/usr/bin/env node
'use strict';
// scripts/b155_f44246_onboarding_loop_bench.js · TDW CE-46 · FE-4 · rung b155 · F-44.246 (launch-blocking; found on
// production by IGD-2). A green rung of the floor from its landing (not in the named base, which lists reds only).
//
// THE DEFECT: the shell's gate (app/vendor/(shell)/WorklistBoot.tsx) reads vendorMe(), which remembers GET /me for the
// whole document (hooks/vendor/useVendorHandle.ts, F-38.26). A vendor who finishes onboarding in the same document
// still has the shell's remembered complete:false; /vendor sends her to /vendor/onboarding, whose own fresh read says
// complete:true and sends her to /vendor again: a blank loop until a full reload.
// THE CURE: forgetVendorMe() in onboarding's submit success arm, and before its already-complete replace.
//
// §1 SOURCE: both forgets present, each before the replace it guards; no other writer of the vendor record left
//    unforgotten (Settings already forgets, F-38.28).
// §2 GLASS, one document, the real app in mock mode (C-43.18): /me answers complete:false on its FIRST call and
//    complete:true after (the submit's effect, as the server sees it). The shell is opened first, so its remembered
//    answer is the stale false; it sends her to onboarding, whose fresh read is true. PASS: within 12 seconds the
//    document rests on /vendor (the shell), having visited onboarding at most once, no bounce.
// §3 MUTATION (--mutate): the forget before the already-complete replace removed; §2 must see the loop (onboarding
//    visited more than once, or never resting on /vendor). Restored by sha.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');
const { stopTree } = require('./lib/stop_tree.js');

const ROOT = path.resolve(__dirname, '..');
const P = (rel) => path.join(ROOT, rel);
const read = (f) => fs.readFileSync(P(f), 'utf8');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const PORT = 3994;
let pass = 0, fail = 0;
const cell = (name, why) => { if (!why) { pass++; console.log('GREEN ' + name); } else { fail++; console.log('RED   ' + name + ' \u2014 ' + why); } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ONB = 'app/vendor/(legacy)/onboarding/page.tsx';
const GUARD_FROM = "        if (v.onboarding?.complete) { forgetVendorMe(); router.replace('/vendor'); return; }";
const GUARD_TO = "        if (v.onboarding?.complete) { router.replace('/vendor'); return; }";

function source() {
  const s = read(ONB);
  const imp = /import \{ forgetVendorMe \} from '@\/hooks\/vendor\/useVendorHandle';/.test(s);
  const guard = s.includes(GUARD_FROM);
  const arm = /forgetVendorMe\(\);\n\s*setDone\(true\);/.test(s);
  cell('1.1 onboarding imports forgetVendorMe and calls it before its already-complete replace to /vendor', imp && guard ? null : `import ${imp} guard ${guard}`);
  cell('1.2 onboarding calls forgetVendorMe in its submit success arm, before the done screen (and so before Open your studio)', arm ? null : 'not in the success arm');
  const settings = read('components/vendor/SettingsScreen.tsx');
  cell('1.3 the other writer of the vendor record (Settings: name and handle) still forgets (F-38.28)', (settings.match(/forgetVendorMe\(\);/g) || []).length >= 2 ? null : 'Settings no longer forgets');
}

async function startDev() {
  fs.rmSync(P('.next/dev'), { recursive: true, force: true });
  const log = fs.openSync(path.join(process.env.TMPDIR || '/tmp', 'b155-dev.log'), 'w');
  const dev = spawn('npx', ['--no-install', 'next', 'dev', '-p', String(PORT)], { cwd: ROOT, detached: true, stdio: ['ignore', log, log],
    env: { ...process.env, NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` } });
  for (let i = 0; i < 240; i += 1) {
    const r = spawnSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '90', `http://localhost:${PORT}/vendor/onboarding`], { encoding: 'utf8' });
    if (/^[23]/.test(r.stdout)) return dev;
    await sleep(1000);
  }
  stopTree(dev.pid); return null;
}

async function glass() {
  const puppeteer = require(P('node_modules/puppeteer-core'));
  const { answer } = await import(P('scripts/lib/b123_fixtures.mjs'));
  let bin = process.env.CHROME_BIN;
  if (!bin) { const m = await import('@sparticuz/chromium'); bin = await (m.default || m).executablePath(); }
  const b = await puppeteer.launch({ executablePath: bin, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const out = { path: [], meCalls: 0, errors: [] };
  try {
    const p = await b.newPage();
    await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
    await p.setRequestInterception(true);
    p.on('request', (r) => {
      const u = r.url();
      if (!u.includes('/__api/')) return r.continue();
      const route = u.split('/__api')[1].split('?')[0];
      if (route === '/api/v2/vendor/me') {
        out.meCalls += 1;
        const base = answer(route) || { ok: true, vendor: {} };
        const vendor = { ...(base.vendor || {}), onboarding: { complete: out.meCalls > 1, missing: out.meCalls > 1 ? [] : ['city'] } };
        return r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify({ ...base, ok: true, vendor }) });
      }
      return r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(answer(route)) });
    });
    p.on('pageerror', (e) => out.errors.push(String(e.message).split('\n')[0]));
    await p.goto(`http://localhost:${PORT}/vendor/rooms`, { waitUntil: 'domcontentloaded', timeout: 240000 });
    // ONE document from here: only client-side replaces. Sample the address every 100 ms for 12 s.
    const t0 = Date.now();
    let last = '';
    while (Date.now() - t0 < 12000) {
      const cur = await p.evaluate(() => location.pathname).catch(() => '');
      if (cur && cur !== last) { out.path.push(cur); last = cur; }
      await sleep(100);
    }
    out.final = last;
    out.docs = await p.evaluate(() => performance.getEntriesByType('navigation').length);
  } catch (e) { out.errors.push(String(e.message).split('\n')[0]); }
  finally { await b.close(); }
  return out;
}

function glassCells(x, tag) {
  const onb = x.path.filter((s) => s === '/vendor/onboarding').length;
  const rests = /^\/vendor(\/rooms)?$/.test(x.final || '');
  cell(`2.1 ${tag} after onboarding reads complete, the one document rests on the shell (${x.final}), onboarding visited ${onb} time(s)`,
    !x.path.length ? 'no address sampled: ' + x.errors.join(' | ') : !rests ? `ended on ${x.final} via ${x.path.join(' > ')}` : onb > 1 ? `bounced: ${x.path.join(' > ')}` : null);
  return !rests || onb > 1;
}

(async () => {
  console.log('b155 \u00b7 F-44.246 \u00b7 onboarding lands on the studio, no loop');
  source();
  const dev = await startDev();
  if (!dev) { cell('2.0 the dev server answers', 'next dev did not come up'); console.log(`b155: ${pass} pass, ${fail} fail`); process.exit(1); }
  try {
    glassCells(await glass(), '[cured]');
    if (process.argv.includes('--mutate')) {
      const abs = P(ONB); const orig = fs.readFileSync(abs, 'utf8'); const h = sha(orig);
      let looped = false;
      try {
        fs.writeFileSync(abs, orig.replace(GUARD_FROM, GUARD_TO));
        await sleep(8000);
        const x = await glass();
        const onb = x.path.filter((s) => s === '/vendor/onboarding').length;
        looped = onb > 1 || !/^\/vendor(\/rooms)?$/.test(x.final || '');
        console.log('  mutated path: ' + x.path.join(' > '));
      } finally { fs.writeFileSync(abs, orig); }
      cell('3.1 M1 the forget before the already-complete replace removed: the loop returns, and the file is restored by sha',
        sha(fs.readFileSync(abs, 'utf8')) !== h ? 'NOT RESTORED' : looped ? null : 'no loop without the forget (the rung cannot see the defect)');
    }
  } finally { stopTree(dev.pid); }
  console.log(`b155: ${pass} pass, ${fail} fail`);
  process.exit(fail ? 1 : 0);
})();
