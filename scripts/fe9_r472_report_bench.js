#!/usr/bin/env node
'use strict';
// scripts/fe9_r472_report_bench.js · CE-47 · FE-9 · R-47.2 (the founder, 8 Oct 2026): A DREAMER'S REPORT.
// WEB-4 cut 30, section 4: POST /api/v2/discover/report { vendor_id, image_url, reason, note? }, signed in. It goes to
// the admin and never hides a picture by itself. The four reasons are the founder's, word for word.
//
// §1 THE SOURCE: the four reason lines, word for word, in one home; reportPicture POSTs the door with the four keys only.
// §2 ON GLASS, the sanctuary's Discover (a signed-in Dreamer; the fake answers the feed and the report):
//    2.1 the picture's "⋯" offers Report this picture, and the sheet shows the four reasons, word for word, in order;
//    2.2 Send waits for a reason; with one and a note it POSTs once: this vendor, the exact address on screen, the key,
//        the note; the sheet says it was sent, and the picture is still on Discover;
//    2.3 a second report by the same Dreamer ({ already: true }) says so;
//    2.4 a 401, a 400 and a 404 are each shown in the server's own sentence, and the sheet stays open.
// THE EXIT CODE IS THE VERDICT (0 green, 1 red). FE9P_ONLY=1|2 runs one section (§1 always).
const path = require('path'); const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.FE9P_PORT || 4473);
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const ONLY = process.env.FE9P_ONLY || '';
const REASONS = ['This is not wedding work.', 'This is someone else’s work.', 'This picture is offensive.', 'Something else.'];
let pass = 0, fail = 0; const fails = [];
function ok(c, name, detail) { if (c) { pass++; console.log('  PASS  ' + name); } else { fail++; fails.push(name); console.log('  FAIL  ' + name + (detail !== undefined ? '  [' + String(detail).slice(0, 400) + ']' : '')); } }
function sec(t) { console.log('\n§' + t); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function until(fn, ms, what) { const end = Date.now() + ms; let v; while (Date.now() < end) { try { v = await fn(); } catch (_e) { v = null; } if (v) return v; await sleep(200); } throw new Error('timed out waiting for ' + what); }
const img = (n) => `https://res.cloudinary.com/demo/image/upload/v1/look${n}.jpg`;

function world(o = {}) {
  const S = { calls: [], reports: [], o };
  const vendors = [{ id: 'ven-1', name: 'Studio Lumen', category: 'photography', city: 'Delhi NCR', routing_handle: 'lumen', starting_price: 80000,
    photos: [img(1), img(2)], vibe_tags: [], about: 'Weddings in Delhi.', enquire_link: null }];
  S.answer = (route, method, body) => {
    S.calls.push({ route, method, body });
    if (route === '/api/v2/discover/feed') return { ok: true, vendors, page: 0, has_more: false, total: 1, cold_start: { substituted: false, city: null, matched_in_city: null } };
    if (route === '/api/v2/discover/report' && method === 'POST') {
      S.reports.push(body);
      if (o.status) return { __status: o.status, ok: false, error: o.error };
      return { ok: true, already: !!o.already };
    }
    return { ok: true };
  };
  return S;
}

function source() {
  sec('1 THE SOURCE');
  const sheet = fs.readFileSync(path.join(ROOT, 'components/frost/ReportPictureSheet.tsx'), 'utf8');
  const lines = [...sheet.matchAll(/\{ key: '(\w+)', line: '([^']*)' \}/g)].map((m) => [m[1], m[2].replace(/\\u2019/g, '’')]);
  ok(JSON.stringify(lines.map((l) => l[1])) === JSON.stringify(REASONS) && JSON.stringify(lines.map((l) => l[0])) === '["not_wedding_work","not_their_work","offensive","other"]',
    '1.1 the four reasons are the founder’s words, word for word, in one home, each on the door’s own key', JSON.stringify(lines));
  const api = fs.readFileSync(path.join(ROOT, 'lib/frost-api/discover.ts'), 'utf8');
  ok(/export async function reportPicture\(body: \{ vendor_id: string; image_url: string; reason: ReportReason; note\?: string \}\)[\s\S]{0,200}apiPost<[^>]*>\('\/api\/v2\/discover\/report', body\)/.test(api),
    '1.2 reportPicture POSTs /api/v2/discover/report with vendor_id, image_url, reason and the optional note, signed in (apiPost)');
}

(async () => {
  source();
  if (ONLY === '1') return finish();
  const fonts = require(path.join(ROOT, 'scripts/lib/next_fonts.js')).start(ROOT, 'fe9_r472_report');
  const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
  const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
  const server = await dev.start(ROOT, PORT, { NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api`, NEXT_TELEMETRY_DISABLED: '1', ...fonts.env });
  if (!(await server.up())) { console.log('dev server did not come up'); await server.stop(); fonts.stop(); process.exit(2); }
  const browser = await puppeteer.launch({ executablePath: await chromium.executablePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  async function open(S) {
    const ctx = await browser.createBrowserContext(); const p = await ctx.newPage();
    await p.setViewport({ width: 374, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });   // F-44.364
    await p.evaluateOnNewDocument(() => { try { localStorage.setItem('couple_session', JSON.stringify({ id: 'cpl-1', name: 'Asha' })); localStorage.setItem('access_token', 'CT'); } catch (_e) { /* fine */ } });
    const errs = []; p.on('pageerror', (e) => errs.push(String(e && e.message || e).slice(0, 200)));
    await p.setRequestInterception(true);
    p.on('request', (r) => {
      const u = r.url(); if (!u.includes('/__api/')) return r.continue();
      const route = u.split('/__api')[1].split('?')[0];
      if (r.method() === 'OPTIONS') return r.respond({ status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*' } });
      let body = null; try { body = JSON.parse(r.postData() || 'null'); } catch (_e) { body = null; }
      const out = S.answer(route, r.method(), body);
      const status = out && out.__status ? out.__status : 200; if (out) delete out.__status;
      return r.respond({ status, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(out) });
    });
    await p.goto(`http://localhost:${PORT}/frost/canvas/sanctuary`, { waitUntil: 'domcontentloaded', timeout: 240000 });
    const words = () => p.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
    const clickText = (t) => p.evaluate((t) => { const e = Array.from(document.querySelectorAll('button,[role="menuitem"],div,span')).find((x) => x.innerText && x.innerText.replace(/\s+/g, ' ').trim() === t); if (!e) return false; e.click(); return true; }, t);
    // into Discover: the slice, then the beta gate's close
    // the concierge popup first (NOT NOW), then the Discover slice itself (the rail's .si-a row)
    await until(() => clickText('NOT NOW') || clickText('Not now'), 60000, 'the concierge popup').catch(() => null);
    await until(() => p.evaluate(() => { const e = Array.from(document.querySelectorAll('.si-a')).find((x) => x.innerText.replace(/\s+/g, ' ').trim().startsWith('Discover \u00b7 Storefront')); if (!e) return false; e.click(); return true; }), 180000, 'the Discover slice');
    await until(() => p.evaluate(() => { const b = document.querySelector('button[aria-label="Close"]'); if (!b) return false; b.click(); return true; }), 60000, 'the beta gate');
    await until(() => p.$('[data-picture-more]'), 60000, 'the picture’s ⋯');
    const shown = () => p.evaluate(() => Array.from(document.querySelectorAll('img')).map((i) => i.currentSrc || i.src).filter((s) => /look\d/.test(s)));
    async function report(reasonIdx, note) {
      // the ⋯: tapped until its menu is open (a tap while the deck settles can land before the button is live)
      await until(async () => { if (await p.$('[data-picture-menu]')) return true; await p.evaluate(() => { const b = document.querySelector('[data-picture-more]'); if (b) b.click(); }); await sleep(400); return !!(await p.$('[data-picture-menu]')); }, 20000, 'the menu');
      await until(() => p.$('[data-picture-menu]'), 10000, 'the menu');
      const menu = await p.evaluate(() => Array.from(document.querySelectorAll('[data-picture-menu] [role="menuitem"]')).map((e) => e.innerText.trim()));
      await p.click('[data-picture-menu] [role="menuitem"]');
      await until(() => p.$('[data-report-sheet]'), 10000, 'the sheet');
      const reasons = await p.evaluate(() => Array.from(document.querySelectorAll('[data-report-sheet] [data-reason]')).map((e) => e.innerText.trim()));
      const sendDisabledFirst = await p.evaluate(() => { const b = Array.from(document.querySelectorAll('[data-report-sheet] button')).find((x) => x.innerText.trim() === 'Send report'); return b ? b.disabled : null; });
      await p.click(`[data-report-sheet] [data-reason]:nth-of-type(${reasonIdx + 1})`);
      if (note) await p.type('[data-report-sheet] textarea', note, { delay: 2 });
      await p.evaluate(() => { const b = Array.from(document.querySelectorAll('[data-report-sheet] button')).find((x) => x.innerText.trim() === 'Send report'); if (b) b.click(); });
      return { menu, reasons, sendDisabledFirst };
    }
    return { p, errs, words, report, shown, close: () => Promise.race([ctx.close(), sleep(10000)]) };
  }
  try {
    sec('2 ON GLASS, Discover');
    const S = world(); const v = await open(S);
    const before = await v.shown();
    const r = await v.report(1, 'I took this photo at my sister’s wedding.');
    ok(JSON.stringify(r.menu) === '["Report this picture"]' && JSON.stringify(r.reasons) === JSON.stringify(REASONS),
      '2.1 the picture’s ⋯ offers Report this picture, and the sheet shows the four reasons, word for word, in order', JSON.stringify(r));
    const done = await until(() => v.p.evaluate(() => { const e = document.querySelector('[data-report-done]'); return e ? e.innerText.trim() : null; }), 20000, '2.2 (its wait): sent');
    const after = await v.shown();
    ok(r.sendDisabledFirst === true && S.reports.length === 1 && JSON.stringify(S.reports[0]) === JSON.stringify({ vendor_id: 'ven-1', image_url: img(1), reason: 'not_their_work', note: 'I took this photo at my sister’s wedding.' })
      && before.some((u) => /look1/.test(u)) && done === 'Your report was sent. TDW will look at it.' && after.some((u) => /look1/.test(u)),
      '2.2 Send waits for a reason; then one POST with this vendor, the exact address of the picture on screen (as the feed sent it), the key and the note; it says sent; the picture is still there', JSON.stringify({ first: r.sendDisabledFirst, reports: S.reports, done, before: before[0], after: after[0] }));
    await v.close();
    const A = world({ already: true }); const a = await open(A); await a.report(0);
    const da = await until(() => a.p.evaluate(() => { const e = document.querySelector('[data-report-done]'); return e ? e.innerText.trim() : null; }), 20000, '2.3 (its wait)');
    ok(da === 'You have already reported this picture.' && A.reports.length === 1 && !('note' in A.reports[0]), '2.3 a second report by the same Dreamer says so; no empty note is sent', JSON.stringify({ da, body: A.reports[0] }));
    await a.close();
    const seen = [];
    for (const [status, error] of [[401, 'Please sign in to report a picture.'], [400, 'The note can be up to 300 characters.'], [404, 'That picture was not found on Discover.']]) {
      const E = world({ status, error }); const e = await open(E); await e.report(3);
      const t = await until(() => e.p.evaluate(() => { const x = document.querySelector('[data-report-err]'); return x ? x.innerText.trim() : null; }), 20000, '2.4 (its wait): ' + status);
      seen.push({ status, t, open: !!(await e.p.$('[data-report-sheet]')), done: !!(await e.p.$('[data-report-done]')) });
      await e.close();
    }
    ok(seen.every((x, i) => x.t === [ 'Please sign in to report a picture.', 'The note can be up to 300 characters.', 'That picture was not found on Discover.' ][i] && x.open && !x.done),
      '2.4 a 401, a 400 and a 404 are each shown in the server’s own sentence, and the sheet stays open', JSON.stringify(seen));
  } catch (e) { fail++; fails.push('crash: ' + e.message); console.log('  FAIL  crash: ' + e.message); }
  await Promise.race([browser.close(), sleep(10000)]); await server.stop(); fonts.stop();
  finish();
})();
function finish() { console.log(`\nfe9_r472_report: ${pass} pass, ${fail} fail`); if (fail) console.log('FAILED: ' + fails.join(' | ')); process.exit(fail ? 1 : 0); }
