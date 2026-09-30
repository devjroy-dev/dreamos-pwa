#!/usr/bin/env node
// scripts/d1_ads_fold_bench_v2.js · CE-46 · FE-5 · b143_v2 2.1 (a) (the founder through the chair, 30 Sept 2026).
// The Ads draft in the REAL new layout (next dev, mock session, TDW_LAYOUT_DEFAULT=v2, b143's own answers, its photograph)
// at 374 x 812, both themes: Run ends at least 44 px above the Ask bar, the post is at least 120 px wide, all four rows are
// above Run, and the page draws no search row; Posts & ads (its neighbour) still draws one. b143_v2 holds the same 2.1
// cell inside its long run; this rung is the short one that can run inside a turn.
// --mutate: M1 the Ads page taken off NO_SEARCH_ROW (v2/lib/worklist/searchRow.ts) → 2.1 and 2.3 RED; the file is
// restored byte for byte (sha256 checked) on every exit path. One stop for the server and Chromium (stop_tree.js).
process.env.TDW_LAYOUT_DEFAULT = 'v2';
const path = require('path'); const fs = require('fs'); const crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..'); const PORT = 3191;
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const { stopTree } = require(path.join(ROOT, 'scripts/lib/stop_tree.js'));
const inDays = (n) => new Date(Date.now() + n * 864e5).toISOString();
const MEDIA_URL = `http://localhost:${PORT}/b143-photo/post.jpeg`;
const SETTINGS = { places: [{ type: 'city', key: '1035921', name: 'Lucknow, Uttar Pradesh, India', radius_km: 25 }], exclude: [], age_min: 22, age_max: 40, genders: [],
  locales: [], interests: [], life_events: [], advantage_audience: false, placements: { instagram: ['stream', 'story', 'reels'], facebook: [] },
  budget: { kind: 'daily', minor: 10000 }, start: inDays(0.01), end: inDays(3.01), bid: { strategy: 'LOWEST_COST_WITHOUT_CAP' }, media_id: '17890000000000001', welcome: { text: '', icebreakers: [] } };
const MEDIA = { id: '17890000000000001', caption: 'Aanya and Rohan. Delhi, September 2026', type: 'IMAGE', url: MEDIA_URL, at: inDays(-7), likes: 212, comments: 18, eligible: true, insights: { saves: 48, reach: 3100 } };
const READY = { gap: null, page: { id: 'P1', name: 'The Dream Wedding' }, ig: { id: 'IG1', username: 'thedreamwedding_in' }, account: { id: 'act_4417', name: 'Swati Roy Makeup' } };

let pass = 0, fail = 0; const failed = [];
const ok = (c, name, info) => { if (c) { pass++; console.log('  PASS  ' + name); } else { fail++; failed.push(name); console.log('  FAIL  ' + name + (info === undefined ? '' : '  [' + String(info).slice(0, 220) + ']')); } };
const ROW = path.join(ROOT, 'v2/lib/worklist/searchRow.ts');
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');

async function run(label) {
  let server = null, browser = null, bpid = null; const out = {};
  try {
    const photo = fs.readFileSync(path.join(ROOT, 'scripts/fixtures/b143_portrait.jpeg'));
    server = await dev.start(ROOT, PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` });
    if (!(await server.up())) { out.error = 'the dev server did not come up'; return out; }
    const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
    const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
    browser = await puppeteer.launch({ executablePath: await chromium.executablePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    bpid = browser.process() && browser.process().pid;
    for (const mode of ['dark', 'light']) {
      for (const url of ['/vendor/posts/ads', '/vendor/posts']) {
        const p = await browser.newPage();
        await p.setViewport({ width: 374, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
        await p.setCookie({ name: 'tdw_wl_mode', value: mode, domain: 'localhost', path: '/' });
        const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
        await p.setRequestInterception(true);
        p.on('request', (r) => {
          const u = r.url();
          if (u.includes('/b143-photo/')) return r.respond({ status: 200, contentType: 'image/jpeg', body: photo });
          if (!u.includes('/__api/')) return r.continue();
          const route = u.split('/__api')[1].split('?')[0];
          const J = (o) => r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
          if (route === '/api/v2/vendor/ads') return J({ ok: true, open: true, configured: true, connected: true, gaps: READY });
          if (route === '/api/v2/vendor/ads/start') return J({ ok: true, facts: { currency: 'INR', minDailyMinor: 10000 }, settings: SETTINGS, suggestion: MEDIA, posts: [MEDIA] });
          if (route === '/api/v2/vendor/ads/posts') return J({ ok: true, posts: [MEDIA], suggestion: MEDIA });
          if (route === '/api/v2/vendor/ads/list') return J({ ok: true, ads: [] });
          if (route === '/api/v2/vendor/ads/check') return J({ ok: true, gaps: READY });
          return J({ ok: true });
        });
        await p.goto(`http://localhost:${PORT}${url}`, { waitUntil: 'domcontentloaded', timeout: 180000 });
        const want = url === '/vendor/posts/ads' ? '[data-run]' : '.wl-roomhead';
        const until = Date.now() + 120000;
        while (Date.now() < until && !(await p.evaluate((s) => !!document.querySelector(s), want).catch(() => false))) await new Promise((r) => setTimeout(r, 400));
        await new Promise((r) => setTimeout(r, 2500));
        out[mode + ' ' + url] = await p.evaluate(() => {
          const ask = Array.from(document.querySelectorAll('input, textarea, button')).find((e) => /Ask TDW/.test(e.placeholder || e.textContent || '') && e.getBoundingClientRect().top > innerHeight / 2);
          let el = ask; let top = innerHeight; while (el && el !== document.body) { const r = el.getBoundingClientRect(); if (r.top > innerHeight / 2 && r.height < innerHeight / 2) top = Math.min(top, r.top); el = el.parentElement; }
          const run = document.querySelector('[data-run]'); const img = document.querySelector('[data-media]');
          const rows = Array.from(document.querySelectorAll('.ads-draft .ads-row')).map((r) => r.getBoundingClientRect().bottom);
          return { search: !!document.querySelector('.wl-search'), chromeTop: top, runTop: run ? run.getBoundingClientRect().top : null, runBottom: run ? run.getBoundingClientRect().bottom : null,
            imgW: img ? img.getBoundingClientRect().width : null, rows };
        }).catch((e) => ({ error: String(e && e.message) }));
        await p.close();
      }
    }
  } catch (e) { out.error = String((e && e.message) || e); }
  finally {
    if (browser) { try { await browser.close(); } catch (_e) { /* gone */ } }
    if (bpid) { try { stopTree(bpid); } catch (_e) { /* gone */ } }
    if (server) { try { stopTree(server.dev.pid); } catch (_e) { /* gone */ } try { await server.stop(); } catch (_e) { /* gone */ } }
  }
  return out;
}

function cells(o, quiet) {
  const r = {};
  for (const mode of ['dark', 'light']) {
    const a = o[mode + ' /vendor/posts/ads'] || {}; const n = o[mode + ' /vendor/posts'] || {};
    r[mode + ' 2.1'] = [a.runBottom != null && a.runBottom <= a.chromeTop - 44 && a.imgW >= 119.5, `${mode} 2.1 Run is at least 44 px above the Ask bar, the post at least 120 px wide (ruling (a))`, JSON.stringify(a)];
    r[mode + ' 2.2'] = [Array.isArray(a.rows) && a.rows.length === 4 && a.rows.every((b) => b <= a.runTop + 0.5), `${mode} 2.2 all four rows sit above Run, in their order (nothing reordered)`, JSON.stringify(a.rows)];
    r[mode + ' 2.3'] = [a.search === false, `${mode} 2.3 the Ads draft draws no search row`, String(a.search)];
    r[mode + ' 2.4'] = [n.search === true, `${mode} 2.4 Posts & ads, its neighbour, still draws the search row`, String(n.search)];
  }
  return r;
}

(async () => {
  const MUT = process.argv.includes('--mutate');
  console.log('d1 ads fold (v2) · b143_v2 2.1 (a), the Ads draft at 374 x 812');
  const o = await run('control');
  if (o.error) ok(false, '0.1 the room came up', o.error);
  const c = cells(o);
  for (const k of Object.keys(c)) ok(c[k][0], c[k][1], c[k][2]);
  if (MUT && !fail) {
    console.log('\nmutations (each must turn its cell red)');
    const before = fs.readFileSync(ROW); const h = sha(before);
    const restore = () => { fs.writeFileSync(ROW, before); };
    process.once('exit', restore);
    try {
      const m = before.toString().replace("export const NO_SEARCH_ROW: readonly string[] = [ADS_HREF];", 'export const NO_SEARCH_ROW: readonly string[] = [];');
      if (m === before.toString()) ok(false, 'M1 the anchor is absent');
      else {
        fs.writeFileSync(ROW, m);
        const mo = await run('M1'); const mc = cells(mo);
        ok(!mc['dark 2.1'][0] && !mc['light 2.1'][0] && !mc['dark 2.3'][0], 'M1 the Ads page taken off NO_SEARCH_ROW → 2.1 and 2.3 RED (both themes)', JSON.stringify([mc['dark 2.1'][2]]));
      }
    } finally { restore(); ok(sha(fs.readFileSync(ROW)) === h, 'M0 searchRow.ts restored byte for byte'); }
  }
  console.log(`\n${fail ? 'RED' : 'GREEN'} — d1 ads fold (v2) ${pass}/${pass + fail}${fail ? '\n  ' + failed.join('\n  ') : ''}`);
  process.exit(fail ? 1 : 0);
})();
