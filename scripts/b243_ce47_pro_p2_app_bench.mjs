#!/usr/bin/env node
// scripts/b243_ce47_pro_p2_app_bench.mjs · CE-47 · PRO · P2 app: Bills and Gear inside Supplies, driven IN THE REAL APP
// (C-43.18): next dev in mock mode, the v2 layout, headless Chromium, both themes at 374 wide, real taps. The bills and gear
// doors are answered by a stateful fake of dream-os src/api/vendor/bills.js and gear.js (the shapes b242 holds on the server
// side); the bill's PUT to its one-time upload address is caught at /__store/; every other door by the design harness.
// The opener (first-visit grace, evidence on a red, bounded teardown) is b241's, as accepted in its r2.
// argv: dark | light (one theme per run); --shots writes the frames to $SHOTS (no cell depends on them).
import path from 'path'; import fs from 'fs'; import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
process.env.TDW_LAYOUT_DEFAULT = 'v2'; const PORT = +(process.env.PORT || 4120); process.env.PORT = String(PORT);
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const { stopTree } = require(path.join(ROOT, 'scripts/lib/stop_tree.js'));
const H = await import(path.join(ROOT, 'docs/design/tools/harness.mjs'));
const MODE = process.argv.includes('light') ? 'light' : 'dark'; const SHOTS = process.argv.includes('--shots') ? (process.env.SHOTS || '/tmp/b243') : null;
let pass = 0, fail = 0; const failed = [];
const ok = (c, name, info) => { if (c) { pass++; console.log('  PASS  ' + name); } else { fail++; failed.push(name); console.log('  FAIL  ' + name + (info === undefined ? '' : '  [' + String(info).slice(0, 240) + ']')); } };

// ── the fake papers server (state per page) ──
const { VID: V } = await import(path.join(ROOT, 'scripts/lib/b123_fixtures.mjs'));

// ── the fake doors (state per page): papers' about (her city and GSTIN), bills, gear; and a fake private bucket ──
const B_ID = '00000000-0000-4000-8000-0000000000b1', OTHER = 'Lens and Light';
const PH_OWNER = '+919822220002', PH_BORROWER = '+919833330003';
function fakeP2(o = {}) {
  const S = { log: [], puts: [], drafts: o.drafts ? o.drafts.slice() : [], expenses: [], gear: { mine: [], near: [
      { id: 'g-near-1', item: 'Sony 85mm f/1.4 GM lens', value: 'Rs 1,40,000', value_rs: 140000, price_per_day_rs: 1500, price_line: 'Rs 1,500 a day', city: 'Delhi', note: 'Comes with its case.', state: 'listed', owner: { business_name: OTHER, city: 'Delhi' } }],
    lent: [{ id: 'q-lent-1', side: 'owner', state: 'requested', item_id: 'g-mine-0', item: 'Godox AD600 flash', date_from: '2026-11-20', date_to: '2026-11-22', dates: '20 November 2026 to 22 November 2026', days: 3, price_line: 'Rs 800 a day, Rs 2,400 for 3 days', note: 'For a wedding in Noida.', other: { business_name: 'Glow by Chitra', city: 'Delhi' } }],
    asked: [] } };
  S.gear.mine.push({ id: 'g-mine-0', item: 'Godox AD600 flash', value: 'Rs 45,000', value_rs: 45000, price_per_day_rs: 800, price_line: 'Rs 800 a day', city: 'Delhi', note: null, state: 'listed' });
  const READ = { supplier_name: 'Glamour Beauty Supplies', supplier_gstin: '27AAPFU0939F1ZV', bill_number: 'GB/2026/0412', expense_date: '2026-10-04', amount: 4248, taxable_value: 3600, cgst: 324, sgst: 324, igst: null, printed_rate: 18 };
  let n = 0;
  return { S, answer(method, rt, body) {
    S.log.push([method, rt, body]);
    if (rt === `/api/v2/vendor/papers/${V}/about`) return { ok: true, about: { name: 'DEV440 Test Makeup', trade: 'Makeup artist', city: 'Delhi', weddings_verified: 14, as_of: '2026-10-07', gstin: '27AAGCB7383J1Z8' } };
    if (rt === `/api/v2/vendor/papers/${V}` && method === 'GET') return { ok: true, papers: [] };
    if (rt === `/api/v2/vendor/bills/${V}` && method === 'GET') return { ok: true, drafts: S.drafts };
    if (rt === `/api/v2/vendor/bills/${V}/upload-url` && method === 'POST') {
      if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(body.mime)) return { status: 400, body: { ok: false, error: 'Add a photo (JPG, PNG or WEBP) or a PDF of the bill.' } };
      n += 1; const id = `00000000-0000-4000-8000-0000000000d${n}`; const p = `${V}/00000000-0000-4000-8000-0000000000f${n}.jpg`;
      S.drafts.unshift({ id, fields: {}, problems: [], confirmed: false, days_left: 7, keep_line: 'You have not added this bill yet. TDW deletes it in 7 days unless you add it.' });
      return { ok: true, draft_id: id, path: p, upload_url: `http://localhost:${PORT}/__store/upload/bills/${p}?token=t`, token: 't' };
    }
    const rd = rt.match(new RegExp(`^/api/v2/vendor/bills/${V}/drafts/([^/]+)/read$`));
    if (rd && method === 'POST') { const d = S.drafts.find((x) => x.id === rd[1]); if (!d) return { status: 404, body: { ok: false, error: 'That bill is not in your account.' } }; d.fields = { ...READ }; return { ok: true, draft: d }; }
    const cf = rt.match(new RegExp(`^/api/v2/vendor/bills/${V}/drafts/([^/]+)/confirm$`));
    if (cf && method === 'POST') {
      const sum = Math.round((Number(body.taxable_value) || 0) + (Number(body.cgst) || 0) + (Number(body.sgst) || 0) + (Number(body.igst) || 0));
      if (body.taxable_value != null && Math.abs(sum - Number(body.amount)) > 1) return { status: 400, body: { ok: false, error: `Taxable value Rs ${Number(body.taxable_value).toLocaleString('en-IN')} and GST Rs ${(sum - body.taxable_value).toLocaleString('en-IN')} make Rs ${sum.toLocaleString('en-IN')}, not the total Rs ${Number(body.amount).toLocaleString('en-IN')}. Check the three figures.` } };
      S.expenses.push(body); S.drafts = S.drafts.filter((x) => x.id !== cf[1]); return { ok: true, expense: { id: 'e-1' } };
    }
    const dd = rt.match(new RegExp(`^/api/v2/vendor/bills/${V}/drafts/([^/]+)$`));
    if (dd && method === 'DELETE') { S.drafts = S.drafts.filter((x) => x.id !== dd[1]); return { ok: true }; }
    if (rt === `/api/v2/vendor/gear/${V}` && method === 'GET') return { ok: true, room: S.gear };
    if (rt === `/api/v2/vendor/gear/${V}/items` && method === 'POST') {
      if (!body.item || String(body.item).length < 2) return { status: 400, body: { ok: false, error: 'Name the item in 2 to 80 letters.' } };
      const it = { id: `g-mine-${S.gear.mine.length}`, item: body.item, value: 'Rs ' + body.value_rs.toLocaleString('en-IN'), value_rs: body.value_rs, price_per_day_rs: body.price_per_day_rs, price_line: body.price_per_day_rs ? `Rs ${body.price_per_day_rs.toLocaleString('en-IN')} a day` : 'Lent free', city: body.city, note: body.note || null, state: 'listed' };
      S.gear.mine.unshift(it); return { ok: true, item: it };
    }
    const wd = rt.match(new RegExp(`^/api/v2/vendor/gear/${V}/items/([^/]+)/withdraw$`));
    if (wd && method === 'POST') { const it = S.gear.mine.find((x) => x.id === wd[1]); if (it) it.state = 'withdrawn'; return { ok: true, done: true }; }
    const ak = rt.match(new RegExp(`^/api/v2/vendor/gear/${V}/items/([^/]+)/ask$`));
    if (ak && method === 'POST') {
      const it = S.gear.near.find((x) => x.id === ak[1]);
      const q = { id: 'q-asked-1', side: 'borrower', state: 'requested', item_id: it.id, item: it.item, date_from: body.date_from, date_to: body.date_to, dates: body.date_from, days: 1, price_line: 'Rs 1,500 a day', note: body.note || null, other: { business_name: OTHER, city: 'Delhi' } };
      S.gear.asked.unshift(q); return { ok: true, request: q };
    }
    const an = rt.match(new RegExp(`^/api/v2/vendor/gear/${V}/requests/([^/]+)/(accept|decline|cancel)$`));
    if (an && method === 'POST') {
      const q = [...S.gear.lent, ...S.gear.asked].find((x) => x.id === an[1]);
      q.state = { accept: 'accepted', decline: 'declined', cancel: 'cancelled' }[an[2]];
      if (q.state === 'accepted') { q.other = { ...q.other, whatsapp: q.side === 'owner' ? PH_BORROWER : PH_OWNER }; q.settle = `Settle with ${q.other.business_name} directly. TDW takes nothing.`; }
      else { q.other = { business_name: q.other.business_name, city: q.other.city }; delete q.settle; }
      return { ok: true, request: q };
    }
    return null;
  } };
}

async function openP(b, route, fake, { wait = '.wl-main' } = {}) {
  const p = await b.newPage(); await p.setViewport({ width: 374, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: SHOTS ? 2 : 1 });
  await p.setCookie({ name: 'tdw_wl_mode', value: MODE, domain: 'localhost', path: '/' }, { name: 'tdw_layout', value: 'v2', domain: 'localhost', path: '/' });
  await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: MODE }]);
  await p.evaluateOnNewDocument(() => { try { Storage.prototype.getItem = new Proxy(Storage.prototype.getItem, { apply(t, s, a) { const r = Reflect.apply(t, s, a); if (r === null && /seen|first|onboard|intro/i.test(String(a[0]))) return '1'; return r; } }); } catch (_e) { /* fine */ } });
  const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
  p.__said = []; p.__open = new Set();
  p.on('pageerror', (e) => p.__said.push('pageerror: ' + String(e && e.message || e).slice(0, 200)));
  p.on('console', (m) => { if (m.type() === 'error') p.__said.push('console: ' + m.text().slice(0, 200)); });
  p.on('requestfailed', (r) => p.__said.push('failed: ' + r.url().replace(/^https?:\/\/[^/]+/, '') + ' ' + ((r.failure() || {}).errorText || '')));
  p.on('requestfinished', (r) => p.__open.delete(r.url().replace(/^https?:\/\/[^/]+/, '')));
  await p.setRequestInterception(true);
  p.on('request', (r) => { p.__open.add(r.url().replace(/^https?:\/\/[^/]+/, ''));
    const u = r.url();
    if (u.includes('/__store/')) { fake.S.puts = fake.S.puts || []; fake.S.puts.push({ method: r.method(), path: u.split(/localhost:\d+/)[1].split('?')[0], type: r.headers()['content-type'] || null }); return r.respond({ status: 200, contentType: 'application/json', body: '{"Key":"ok"}' }); }
    if (!u.includes('/__api/')) return r.continue();
    const rt = u.split('/__api')[1].split('?')[0]; let body = {}; try { body = JSON.parse(r.postData() || '{}'); } catch (_e) { /* empty */ }
    fake.S.auth = fake.S.auth || []; if (/\/file$/.test(rt)) fake.S.auth.push(r.headers().authorization || null);
    if (/^\/api\/v2\/vendor\/papers\/[^/]+\/[^/]+\/file$/.test(rt)) { fake.S.log.push(['GET', rt, null]); return r.respond({ status: 200, contentType: 'application/pdf', headers: { 'content-disposition': 'attachment; filename="TDW_Professional_certificate_TDW-7Q4K-2M9P.pdf"' }, body: '%PDF-1.4 fake' }); }
    const a = fake.answer(r.method(), rt, body);
    if (a && a.status) return r.respond({ status: a.status, contentType: 'application/json', body: JSON.stringify(a.body) });
    return r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(a || (r.method() === 'GET' ? H.answer(rt) : { ok: true })) });
  });
  let resp = await p.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'domcontentloaded', timeout: 240000 });
  // CE-47 r2 (e-275, cure the measure): Next dev can answer a route's FIRST visit with its own 404 while that route is
  // still compiling (seen once in 20: "GET /vendor/papers 404 in 2.1s (next.js: 1993ms)"). That one answer is waited
  // through, by re-request, bounded at 60 s, and then judged; the dev log decides which 404 it is (judge404 below).
  // A 404 the server gave without compiling, or to a route that had already answered, stays a red at once.
  if (resp && resp.status() === 404) {
    let t0 = Date.now(); let verdict = judge404(devLog(), route);
    while (verdict === 'compiling' && Date.now() - t0 < 60000) {
      if (stuckRestarts < 2 && routeHasPage(route) && Date.now() - t0 > 20000) { stuckRestarts += 1; await restartServer(route); t0 = Date.now(); }
      await H.sleep(1000); resp = await p.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      verdict = resp && resp.status() === 404 ? judge404(devLog(), route) : 'ok';
    }
    if (verdict !== 'ok') throw new Error(`404 stands on ${route} (${verdict === 'compiling' ? (routeHasPage(route) ? `a page file serves it, yet it answered 404 for 60 s${stuckRestarts ? `, after ${stuckRestarts} fresh dev ${stuckRestarts === 1 ? 'server' : 'servers'} too` : ''}` : 'still compiling after 60 s') : 'the route answered 404 without compiling'}): ${JSON.stringify(logRows(devLog(), route))}${restarted ? ' :: the first server: ' + JSON.stringify(restarted.old) : ''}`);
    regraced.push(route);
  }
  let seen = false; for (let i = 0; i < 300; i += 1) { if (await p.evaluate((s) => !!document.querySelector(s), wait)) { seen = true; break; } await H.sleep(300); }
  // e-275: a page that never shows what the cell waits for is a red WITH ITS EVIDENCE, never a silent walk on to a later
  // timeout: where it stood, what it showed, what the browser said, and which faked calls were never answered.
  if (!seen) {
    const st = await p.evaluate(() => ({ at: location.pathname, ready: document.readyState, shows: document.body ? document.body.innerText.slice(0, 300) : '' })).catch((e) => ({ err: String(e) }));
    throw new Error(`waited 90s for ${wait} on ${route}: ${JSON.stringify(st)} :: browser said ${JSON.stringify(p.__said.slice(-6))} :: unanswered ${JSON.stringify([...p.__open])}`);
  }
  await settle(p); return p;
}
// The dev log's own rows for one path: [status, next.js ms]. Next 16's Turbopack dev prints no "Compiling" line, so the
// compile shows only as next.js's share of the request's time.
const ROW = (route) => new RegExp('^\\s*GET ' + route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:\\?\\S*)? (\\d{3}) in [^(]*\\(next\\.js: (\\d+(?:\\.\\d+)?)(ms|s)');
function logRows(lines, route) { const re = ROW(route); const out = []; for (const l of lines) { const m = l.match(re); if (m) out.push([+m[1], m[3] === 's' ? Math.round(+m[2] * 1000) : +m[2]]); } return out; }
// 'ok' (the latest answer was not a 404), 'compiling' (a 404 while this path's route was being compiled: the path's FIRST
// row, or a row whose next.js share shows a compile, at least COMPILE_MS), 'red' (a 404 answered without compiling).
const COMPILE_MS = 250;
// CE-47 (7 October 2026, the double 404): a real route, /vendor/supplies, answered Next dev's 404 twice in one run, the
// first while compiling (743 ms) and the second at once (15 ms) with no compile error in the log. The dev log alone could
// not tell that from a route that does not exist, so the bench asks the tree it is walking: does a page file serve this
// path? (the v2 layout serves /x from app/v2/x, then app/x; route groups are transparent; [segments] match anything).
// A 404 on a path a page file serves is waited through, re-requested, bounded at 60 s, and only then red, with every row
// as evidence. A path no page file serves keeps the r2 rule (first-visit compile grace, then red), so 8.2 is unchanged.
function routeHasPage(route, root = ROOT) {
  const segs = route.split('?')[0].split('/').filter(Boolean);
  const hasPage = (dir) => ['page.tsx', 'page.ts', 'page.jsx', 'page.js'].some((f) => fs.existsSync(path.join(dir, f)));
  const walk = (dir, i) => {
    let ents; try { ents = fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory()); } catch (_e) { return false; }
    if (i === segs.length) { if (hasPage(dir)) return true; return ents.some((e) => /^\(.*\)$/.test(e.name) && walk(path.join(dir, e.name), i)); }
    return ents.some((e) => (e.name === segs[i] && walk(path.join(dir, e.name), i + 1)) || (/^\[[^\]]+\]$/.test(e.name) && walk(path.join(dir, e.name), i + 1)) || (/^\(.*\)$/.test(e.name) && walk(path.join(dir, e.name), i)));
  };
  return walk(path.join(root, 'app', 'v2'), 0) || walk(path.join(root, 'app'), 0);
}
function judge404(lines, route, hasPage = routeHasPage(route)) {
  const rows = logRows(lines, route); if (!rows.length) return 'compiling'; const [st, ms] = rows[rows.length - 1];
  if (st !== 404) return 'ok';
  if (hasPage) return 'compiling';   // a page file serves it: wait, bounded by the caller's 60 s
  return (rows.length === 1 || ms >= COMPILE_MS) ? 'compiling' : 'red';
}
const devLog = () => { try { return fs.readFileSync(server.log, 'utf8').split('\n'); } catch (_e) { return []; } };
const regraced = [];
const text = (p) => p.evaluate(() => (document.querySelector('main') || document.body).innerText);
// e-275: no cell rests on a fixed pause alone. After a tap the bench waits until the page's requests have settled
// (every door answer arrived) and React has painted, up to 15 s, before reading.
const settle = async (p) => { try { await p.waitForNetworkIdle({ idleTime: 400, timeout: 15000 }); } catch (_e) { /* read anyway; the cell decides */ } await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))); };
const tap = async (p, sel) => { await p.waitForSelector(sel, { timeout: 15000 }); await p.$eval(sel, (e) => (e.matches('button,a') ? e : e.querySelector('button,a') || e).click()); await settle(p); };
// Pictures only (F-44.363): next dev cannot take the font mock, so the app's own faces are put in under next/font's names
// from @fontsource files in $FACES_DIR (fontsource-inter-x, fontsource-cormorant-garamond-x). No cell reads a face.
async function faces(p) {
  const D = process.env.FACES_DIR; if (!D) return;
  const fams = await p.evaluate(() => [...new Set([...document.querySelectorAll('body, body *')].map((e) => getComputedStyle(e).fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '')))]);
  const b64 = (f) => fs.readFileSync(f).toString('base64'); let css = '';
  for (const fam of fams) {
    if (/inter/i.test(fam)) for (const w of [400, 500, 600]) css += `@font-face{font-family:'${fam}';font-weight:${w};src:url(data:font/woff2;base64,${b64(path.join(D, 'fontsource-inter-x/package/files', `inter-latin-${w}-normal.woff2`))}) format('woff2')}`;
    if (/cormorant/i.test(fam)) for (const w of [400, 500]) css += `@font-face{font-family:'${fam}';font-weight:${w};src:url(data:font/woff2;base64,${b64(path.join(D, 'fontsource-cormorant-garamond-x/package/files', `cormorant-garamond-latin-${w}-normal.woff2`))}) format('woff2')}`;
  }
  if (css) { await p.addStyleTag({ content: css }); await p.evaluate(async () => { await document.fonts.ready; }); await H.sleep(300); }
}

// ── chair's rules (7 October 2026, with the pictures' approval) ──
const DEPOSIT = 'Agree on a deposit with each other before you hand the item over. Also agree on what happens if the item comes back damaged or late.';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const full = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };
/** Every date field carries its date in full words in the line beneath it. */
const datesInFull = (p) => p.$$eval('input[type="date"]', (els) => els.map((e) => ({ v: e.value, under: (e.nextElementSibling && e.nextElementSibling.textContent) || '' })));
/** Nothing fixed on screen (a toast) covers the target or a button, with the target placed where the toast would sit. */
async function uncovered(p, target, scope) {
  await p.$eval(target, (e) => e.scrollIntoView({ block: 'center' })); await H.sleep(200);
  return p.evaluate((t, sc) => {
    const goal = [document.querySelector(t), ...document.querySelectorAll(sc + ' button, ' + sc + ' a')].filter(Boolean);
    const fixed = [...document.querySelectorAll('body *')].filter((e) => getComputedStyle(e).position === 'fixed' && e.getBoundingClientRect().height > 0);
    const hit = (a, b) => !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
    const bad = [];
    for (const g of goal) { const r = g.getBoundingClientRect(); for (const f of fixed) { if (f.contains(g) || g.contains(f)) continue; if (hit(r, f.getBoundingClientRect())) bad.push((g.textContent || '').trim().slice(0, 30) + ' under ' + (f.textContent || '').trim().slice(0, 30)); } }
    return bad;
  }, target, scope);
}
/** The line saying what happened sits in the page's flow: no fixed element (a toast) carries it. */
const inFlow = (p, words) => p.evaluate((w) => ![...document.querySelectorAll('body *')].some((e) => getComputedStyle(e).position === 'fixed' && (e.textContent || '').includes(w)), words);
/** Rs amounts in Indian grouping only: no 1,234,567 or 140,000 shapes. */
const westernRs = (t) => (t.match(/Rs \d{1,3}(?:,\d{3}){2,}\b|Rs \d{3},\d{3}\b/g) || []);
let n = 0; const shot = async (p, name, at) => { if (!SHOTS) return; fs.mkdirSync(SHOTS, { recursive: true }); await faces(p);
  if (at) { await p.$eval(at, (e) => e.scrollIntoView({ block: 'start' })).catch(() => {}); await H.sleep(250); } await p.screenshot({ path: path.join(SHOTS, `${String(++n).padStart(2, '0')}_${name}_${MODE}.png`) }); };
const SHORT = /\b\d{1,2} (Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\b(?![a-z])/;

for (let i = 0; i < 40 && await dev.portOpen(PORT); i += 1) await H.sleep(500);
if (await dev.portOpen(PORT)) { console.log(`b243: port ${PORT} is held by another server; refusing to walk someone else's tree`); process.exit(2); }
// F-44.370's reads (the chair, 7 October 2026), taken on a stuck server BEFORE it is restarted, and a census of every
// process working in this root, taken before each server start: if an earlier server's worker outlived its stop and
// still writes into .next, the census shows it.
const census = () => { try { const fs2 = require('fs'); return require('child_process').execSync('ps -eo pid,ppid,args', { encoding: 'utf8' }).split('\n').slice(1).map((l) => l.trim()).filter(Boolean)
  .filter((l) => { const pid = l.split(/\s+/)[0]; if (+pid === process.pid) return false; let cwd = ''; try { cwd = fs2.readlinkSync(`/proc/${pid}/cwd`); } catch (_e) { return false; } return cwd === ROOT && /next|node/.test(l); })
  .map((l) => l.replace(/\s+/g, ' ').slice(0, 120)); } catch (_e) { return ['ps failed']; } };
const plain = async (u, ck = `tdw_layout=v2; tdw_wl_mode=${MODE}`) => { try { const r = await fetch(`http://localhost:${PORT}${u}`, { headers: { cookie: ck }, redirect: 'manual' }); return r.status + (r.headers.get('location') ? '>' + r.headers.get('location').replace(/^https?:\/\/[^/]+/, '') : ''); } catch (_e) { return 'refused'; } };
console.log(`  NOTE  census before the first server: ${JSON.stringify(census())}`);
const DEV_ENV = { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` };
let server = await dev.start(ROOT, PORT, DEV_ENV);
// CE-47 (7 October 2026): the stuck 404. Seen 6 times in about 80 runs: on a path a page file serves, a fresh Next dev
// answered 404 to every request for the server's whole life (b243 run 3 of 20: 16 rows over 60 s, the first compiling
// 2.1 s, the rest at once; no compile error in the log). Then 3 of 21 fresh servers in series 2. Not reproduced by 30 fresh servers under load with plain
// requests, so it is tied to a browser's first visit to a dev server, not to the app (next build lists the route).
// The measure: ONCE per run, after 20 s of 404s on such a path, the dev server is stopped (whole tree, port proven free)
// and started fresh, and the path is asked again; a NOTE line carries the old server's rows. Up to twice a run (b243
// series 2, run 2: a server started fresh stuck too). If the last fresh server also answers 404 for 60 s, the path is
// red, with the rows.
let restarted = null; let stuckRestarts = 0; // at most 2 restarts for a stuck 404 per run; 8.5's own restart does not count
async function restartServer(route, why = 'answered 404 for 20 s on a path a page file serves') {
  const old = logRows(devLog(), route);
  if (!/on purpose/.test(why)) {
    const reads = { v2_address: await plain('/v2' + route), same_from_node: await plain(route), new_room_papers: await plain('/vendor/papers'), landed_room_packages: await plain('/vendor/packages'), never: await plain('/vendor/no-such-room-x'), no_cookie: await plain(route, ''),
      classic_today: await plain('/vendor/today', 'tdw_layout=classic'), outside_vendor_privacy: await plain('/privacy'), outside_vendor_check: await plain('/check/TDW-AAAA-BBBB'), home: await plain('/') };
    console.log(`  NOTE  F-44.370 reads on the stuck server: ${JSON.stringify(reads)} :: census ${JSON.stringify(census())} :: this server's tree ${JSON.stringify(require(path.join(ROOT, 'scripts/lib/stop_tree.js')).treeOf(server.dev.pid))}`);
  }
  try { stopTree(server.dev.pid); } catch (_e) { /* gone */ }
  try { await server.stop(); } catch (_e) { /* stopped */ }
  for (let i = 0; i < 40 && await dev.portOpen(PORT); i += 1) await H.sleep(500);
  console.log(`  NOTE  census before the fresh server: ${JSON.stringify(census())}`);
  server = await dev.start(ROOT, PORT, DEV_ENV);
  if (!(await server.up())) throw new Error('the fresh dev server did not come up');
  restarted = { route, old };
  console.log(`  NOTE  dev server restarted once: ${route} ${why}; the old server's rows ${JSON.stringify(old)}`);
}
let b;
try {
  if (!(await server.up())) throw new Error('the dev server did not come up');
  b = await H.browser();
  console.log(`\n── 1  Supplies: Bills and Gear open (${MODE}) ──`);
  const f = fakeP2({ drafts: [{ id: '00000000-0000-4000-8000-0000000000a1', fields: { supplier_name: 'Lakme Salon Supply', amount: 1180 }, problems: [], confirmed: false, days_left: 4, keep_line: 'You have not added this bill yet. TDW deletes it in 4 days unless you add it.' }, { id: '00000000-0000-4000-8000-0000000000a2', fields: { supplier_name: 'Canon Professional Services', amount: 125000 }, problems: [], confirmed: false, days_left: 6, keep_line: 'You have not added this bill yet. TDW deletes it in 6 days unless you add it.' }] });
  const p = await openP(b, '/vendor/supplies', f, { wait: '[data-sp-bills]' });
  let t = await text(p);
  ok(t.includes('Bills') && t.includes('Add a purchase bill. TDW reads the figures for you to check.') && t.includes('2 to add') && t.includes('Gear') && t.includes('You can lend and borrow kit with vendors in Delhi.'), '1.1 (P3, R-47.1) Bills (with "2 to add") and Gear are rows that open; no "Coming soon" on them', t.slice(0, 400));
  ok(!t.includes('Coming soon') && !/WhatsApp/.test(await p.$$eval('.sp-loop', (els) => els.map((e) => e.textContent).join(' '))) && (await p.$$('[data-sp-addbill]')).length >= 3, '1.2 every card’s loop says "add the bill here" with an Add a bill button; nothing says WhatsApp (P2-F3 (a))');
  await shot(p, 'supplies_top'); await shot(p, 'supplies_card_loop', '.sp-loop'); await shot(p, 'supplies_bills_gear', '[data-sp-nothing]');
  console.log('\n── 2  a bill, read and checked ──');
  await tap(p, '[data-sp-addbill="nykaa_pro"]'); t = await text(p);
  ok(t.includes('Add a photo or a PDF of a purchase bill.') && t.includes('Lakme Salon Supply') && t.includes('You have not added this bill yet. TDW deletes it in 4 days unless you add it.') && t.includes('The bill is kept privately in your TDW account. Only you can open it.'), '2.1 (P3, R-47.1) Bills: what it does, a waiting bill with its days left, and that the bill is private');
  ok(t.includes('Rs 1,25,000') && westernRs(t).length === 0, '2.1a a bill\u2019s total in Indian grouping (Rs 1,25,000)', JSON.stringify(westernRs(t)));
  ok(await p.$eval('[data-bl-file]', (e) => e.getAttribute('accept')) === 'image/jpeg,image/png,image/webp,application/pdf', '2.2 the picker takes a photo or a PDF only');
  await shot(p, 'bills_list');
  const input = await p.$('[data-bl-file]'); const tmpf = path.join(require('os').tmpdir(), `b243_bill_${process.pid}.jpg`); fs.writeFileSync(tmpf, Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 16, 74, 70, 73, 70]));
  await input.uploadFile(tmpf); for (let i = 0; i < 40 && !(await p.$('[data-bl-form]')); i += 1) await H.sleep(250); await settle(p); t = await text(p);
  const upPost = f.S.log.find(([m, rt]) => m === 'POST' && /\/upload-url$/.test(rt));
  ok(upPost && upPost[2].mime === 'image/jpeg' && f.S.puts.length === 1 && f.S.puts[0].type === 'image/jpeg' && /^\/__store\/upload\/bills\//.test(f.S.puts[0].path) && f.S.log.some(([m, rt]) => m === 'POST' && /\/read$/.test(rt)),
    '2.3 the file goes by PUT straight to the one-time upload address, then TDW is asked to read it', JSON.stringify({ upPost, puts: f.S.puts }));
  const val = (k) => p.$eval(`[data-bl-field="${k}"]`, (e) => e.value);
  ok(await val('supplier_gstin') === '27AAPFU0939F1ZV' && await val('amount') === '4248' && await val('taxable_value') === '3600' && await val('cgst') === '324' && t.includes('4 October 2026'), '2.4 the form fills from the read; the bill date is written out in full', t.slice(0, 300));
  ok((await p.$$('[data-bl-cat].on')).length === 0, '2.5 no category is chosen by itself');
  const bd = await datesInFull(p);
  ok(bd.length === 1 && bd.every((x) => x.v && x.under === full(x.v)), '2.5a every date field shows its date in full beneath it (the browser shows its own format above)', JSON.stringify(bd));
  await shot(p, 'bill_form'); await shot(p, 'bill_form_figures', '[data-bl-field="taxable_value"]');
  await tap(p, '[data-bl-confirm]'); t = await text(p);
  ok(t.includes('Choose a category.') && !f.S.log.some(([m, rt]) => /\/confirm$/.test(rt)), '2.6 adding without a category asks for one; nothing is sent');
  await tap(p, '[data-bl-cat="inventory"]');
  const chip = await p.$eval('[data-bl-cat="inventory"]', (e) => { const c = getComputedStyle(e); return { on: e.classList.contains('on'), pressed: e.getAttribute('aria-pressed'), bg: c.backgroundColor, fg: c.color }; });
  const plain = await p.$eval('[data-bl-cat="travel"]', (e) => getComputedStyle(e).backgroundColor);
  ok(chip.on && chip.pressed === 'true' && chip.bg !== plain && !/rgba\(0, 0, 0, 0\)|transparent/.test(chip.bg), '2.7 the chosen chip is filled (standing rule), the others are not', JSON.stringify({ chip, plain }));
  await p.$eval('[data-bl-field="amount"]', (e) => { const s = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; s.call(e, '4300'); e.dispatchEvent(new Event('input', { bubbles: true })); });
  await tap(p, '[data-bl-confirm]'); t = await text(p);
  ok(/not the total Rs 4,300/.test(t) && (await p.$('[data-bl-problems]')) && f.S.expenses.length === 0, '2.8 figures that do not hold: TDW’s refusal is shown in Rs words, nothing is added');
  await shot(p, 'bill_refused', '[data-bl-cat]');
  await p.$eval('[data-bl-field="amount"]', (e) => { const s = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; s.call(e, '4,248'); e.dispatchEvent(new Event('input', { bubbles: true })); });
  await tap(p, '[data-bl-confirm]'); t = await text(p);
  const sent = f.S.expenses[0];
  ok(sent && sent.category === 'inventory' && sent.amount === 4248 && sent.taxable_value === 3600 && sent.cgst === 324 && sent.sgst === 324 && sent.supplier_gstin === '27AAPFU0939F1ZV' && sent.expense_date === '2026-10-04' && sent.printed_rate === 18 && !('igst' in sent),
    '2.9 added: exactly her figures go to the door (Rs 4,248 typed with a comma is read as 4248; an empty IGST is not sent)', JSON.stringify(sent));
  ok(t.includes('Add a photo or a PDF of a purchase bill.') && !t.includes('Glamour Beauty Supplies') && t.includes('Canon Professional Services'), '2.10 back on Bills, and the added bill is no longer waiting', t.slice(0, 600));
  ok(t.includes('The bill is added to Expenses.') && (await p.$eval('[data-sp-status]', (e) => e.getAttribute('role'))) === 'status', '2.10a (P3, R-47.1) what happened is said in a line under the heading, not a toast');
  const cov2 = await uncovered(p, '[data-bl-add]', '.fr-room');
  ok(cov2.length === 0 && await inFlow(p, 'The bill is added to Expenses.'), '2.10b (P3, R-47.1) at 374, nothing fixed covers Add a bill or any button, and the line saying it was added is in the page, not floating over it', JSON.stringify(cov2));
  await tap(p, '[data-bl-draft="00000000-0000-4000-8000-0000000000a1"]');
  await tap(p, '[data-bl-throw]'); t = await text(p);
  ok(t.includes('If you tap Delete the bill, TDW deletes the bill and what it read from the bill at once. You cannot undo this.') && !f.S.log.some(([m]) => m === 'DELETE'), '2.11 (P3, R-47.1) throw away asks first; nothing is deleted yet');
  await tap(p, '[data-bl-gone]');
  ok(f.S.log.some(([m, rt]) => m === 'DELETE' && /\/drafts\/00000000-0000-4000-8000-0000000000a1$/.test(rt)), '2.12 then the bill is deleted');
  ok(f.S.puts.every((x) => /^\/__store\/upload\/bills\//.test(x.path)) && !f.S.log.some(([, rt]) => /cloudinary/i.test(rt)), '2.13 the bill went nowhere but its own upload address');
  await p.close();

  console.log('\n── 3  gear ──');
  const g = fakeP2();
  const q = await openP(b, '/vendor/supplies', g, { wait: '[data-sp-gear]' });
  await tap(q, '[data-sp-gear]'); for (let i = 0; i < 40 && !(await q.$('[data-gr-nothing]')); i += 1) await H.sleep(250); await settle(q); t = await text(q);
  const html = () => q.evaluate(() => document.documentElement.outerHTML);
  ok(t.includes('Gear in Delhi') && t.includes('Sony 85mm f/1.4 GM lens') && t.includes('Lens and Light, Delhi') && t.includes('Rs 1,500 a day') && t.includes('worth Rs 1,40,000'), '3.1 gear listed in her city: item, owner’s business name and city, price and worth');
  const h0 = await html();
  ok(!h0.includes('9822220002') && !h0.includes('9833330003') && !h0.includes('wa.me'), '3.2 no number and no WhatsApp link anywhere in the page before an accept (P2-F6)');
  ok(t.includes('Asked by Glow by Chitra, Delhi') && t.includes('20 November 2026 to 22 November 2026') && t.includes('You will see their WhatsApp number after you accept the request.'), '3.3 (P3, R-47.1) a request for her flash: who, the days in full, and that the number shows once she accepts');
  ok(t.includes('TDW takes no fee from a loan and holds no money. The days you lend an item are kept here. TDW adds nothing to your Calendar.'), '3.4 (P3, R-47.1) TDW takes nothing; nothing goes on Calendar (P2-F4, P2-F5)');
  await shot(q, 'gear_room'); await shot(q, 'gear_room_near', '[data-gr-near]'); await shot(q, 'gear_room_yours', '[data-gr-list]');
  await tap(q, '[data-gr-accept="q-lent-1"]'); t = await text(q);
  const wa = await q.$eval('[data-gr-loan="q-lent-1"] [data-gr-wa]', (e) => ({ href: e.href, target: e.target, rel: e.rel, text: e.textContent })).catch(() => null);
  ok(wa && wa.href === 'https://wa.me/919833330003' && wa.target === '_blank' && wa.rel === 'noopener noreferrer' && wa.text === PH_BORROWER, '3.5 accepted: her number is a WhatsApp link, a new tab, noopener noreferrer', JSON.stringify(wa));
  ok(t.includes('Settle with Glow by Chitra directly. TDW takes nothing.') && !/pay(ment)? link|insur/i.test(t), '3.6 the ruled settle line; no payment link, no insurance line');
  ok(await q.$eval('[data-gr-loan="q-lent-1"] [data-gr-deposit]', (e) => e.textContent).catch(() => null) === DEPOSIT && (await q.$eval('[data-gr-loan="q-lent-1"]', (e) => e.innerText.indexOf('Settle with') < e.innerText.indexOf('Agree on a deposit'))), '3.6a (P3, the founder 8 October 2026) under the settle line, the deposit line, word for word (owner\u2019s side)');
  const cov = await uncovered(q, '[data-gr-loan="q-lent-1"] [data-gr-wa]', '[data-gr-loan="q-lent-1"]');
  ok(cov.length === 0 && t.includes('You accepted the request.') && await inFlow(q, 'You accepted the request.'), '3.6b (P3, R-47.1) at 374, nothing fixed covers the WhatsApp number or a button on the accepted loan (the line under the heading says it was accepted)', JSON.stringify(cov));
  await shot(q, 'gear_accepted', '[data-gr-loan="q-lent-1"]');
  await tap(q, '[data-gr-ask="g-near-1"]'); t = await text(q);
  const ad = await datesInFull(q);
  ok(ad.length === 2 && ad.every((x) => x.v && x.under === full(x.v)), '3.7a both date fields show their dates in full beneath them', JSON.stringify(ad));
  ok(t.includes('Ask for Sony 85mm f/1.4 GM lens') && t.includes('The owner and you see each other\u2019s WhatsApp numbers only if the owner accepts.') && /\d{1,2} (January|February|March|April|May|June|July|August|September|October|November|December) \d{4}/.test(t), '3.7 (P3, R-47.1) asking: the days in full words; numbers shared only on acceptance');
  await shot(q, 'gear_ask');
  await tap(q, '[data-gr-send]');
  const askPost = g.S.log.find(([m, rt]) => m === 'POST' && /\/ask$/.test(rt));
  ok(askPost && /^\d{4}-\d{2}-\d{2}$/.test(askPost[2].date_from) && /^\d{4}-\d{2}-\d{2}$/.test(askPost[2].date_to) && !('phone' in askPost[2]), '3.8 the ask sends the two days and nothing else of hers', JSON.stringify(askPost && askPost[2]));
  t = await text(q);
  ok(t.includes('Lent by Lens and Light, Delhi') && t.includes('You will see their WhatsApp number after the owner accepts your request.') && !(await html()).includes('9822220002'), '3.9 (P3, R-47.1) her request waits; the owner’s number is still nowhere in the page');
  // the owner accepts B's ask: the borrower's side shows the owner's number as a link, the settle line and the deposit line
  Object.assign(g.S.gear.asked[0], { state: 'accepted', other: { business_name: OTHER, city: 'Delhi', whatsapp: PH_OWNER }, settle: `Settle with ${OTHER} directly. TDW takes nothing.` });
  await tap(q, '.sp-back'); await tap(q, '[data-sp-gear]'); for (let i = 0; i < 40 && !(await q.$('[data-gr-loan="q-asked-1"] [data-gr-wa]')); i += 1) await H.sleep(250); await settle(q);
  const bw = await q.$eval('[data-gr-loan="q-asked-1"]', (e) => ({ wa: (e.querySelector('[data-gr-wa]') || {}).href, settle: (e.querySelector('[data-gr-settle]') || {}).textContent, dep: (e.querySelector('[data-gr-deposit]') || {}).textContent })).catch(() => null);
  ok(bw && bw.wa === 'https://wa.me/919822220002' && bw.settle === 'Settle with Lens and Light directly. TDW takes nothing.' && bw.dep === DEPOSIT, '3.9a (P3, the founder 8 October 2026) the borrower\u2019s side, accepted: the owner\u2019s number as a link, the settle line, the deposit line', JSON.stringify(bw));
  await shot(q, 'gear_borrower_accepted', '[data-gr-loan="q-asked-1"]');
  await tap(q, '[data-gr-list]');
  const setV = (sel, v) => q.$eval(sel, (e, v2) => { const s = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; s.call(e, v2); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  await setV('[data-gr-item]', 'Ring light 18 inch'); await setV('[data-gr-worth]', '6,500'); await setV('[data-gr-price]', '0');
  await shot(q, 'gear_list_form');
  await tap(q, '[data-gr-save]');
  const listPost = g.S.log.find(([m, rt]) => m === 'POST' && /\/items$/.test(rt));
  t = await text(q);
  ok(listPost && JSON.stringify(listPost[2]) === '{"item":"Ring light 18 inch","value_rs":6500,"price_per_day_rs":0,"city":"Delhi"}' && t.includes('Ring light 18 inch') && t.includes('Lent free'), '3.10 listing sends whole rupees and her city; a price of 0 reads "Lent free"', JSON.stringify(listPost && listPost[2]));
  await tap(q, '[data-gr-withdraw-open]'); await tap(q, '[data-gr-withdraw="g-mine-0"]');
  ok(g.S.log.some(([m, rt]) => m === 'POST' && /\/items\/g-mine-0\/withdraw$/.test(rt)), '3.11 she can withdraw an item she lists');
  const all = (await text(q)) + t;
  const allRs = all + (await text(q));
  ok(westernRs(allRs).length === 0 && /Rs 1,40,000/.test(allRs) && /Rs 45,000/.test(allRs), '3.11a every amount in Indian grouping (Rs 1,40,000, never 140,000)', JSON.stringify(westernRs(allRs)));
  ok(!/\bcouple\b|\bbride\b/i.test(all) && !/\b(Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\b/.test(all) && !/₹|INR|Rs\.\s/.test(all), '3.12 no "couple" or "bride", no short month, money as "Rs 2,000"');
  ok((await q.$$eval('a[href^="http"]', (as) => as.every((a) => a.target === '_blank' && a.rel === 'noopener noreferrer'))), '3.13 every outside link: a new tab, noopener noreferrer (standing)');
  await q.close();

  console.log('\n── 9  a thin answer ({ ok: true }, no lists): every room still draws (the chair\u2019s lesson 2) ──');
  const thin = () => ({ S: { log: [], puts: [] }, answer(m, rt, body) { this.S.log.push([m, rt, body]); return { ok: true }; } });
  const th = await openP(b, '/vendor/supplies', thin(), { wait: '[data-sp-bills]' }); let tt = await text(th);
  // with no profile in the answer the trade is "other": exactly the sources supplySources.ts lists for "other" (read, not typed here)
  const otherKeys = [...fs.readFileSync(path.join(ROOT, 'v2/lib/solutions/supplySources.ts'), 'utf8').matchAll(/\{ key: '([a-z_]+)'[^\n]*?trades: \[([^\]]*)\]/g)].filter((m) => m[2].includes("'other'")).map((m) => m[1]);
  const drawn = await th.$$eval('[data-sp-src]', (els) => els.map((e) => e.getAttribute('data-sp-src')));
  ok(tt.includes('Where to buy') && tt.includes('Bills') && tt.includes('Gear') && !tt.includes('to add') && otherKeys.length >= 1 && drawn.join() === otherKeys.join(), '9.1 Supplies draws its cards (trade "other": the sources listed for it) and the Bills and Gear rows', JSON.stringify({ drawn, otherKeys }));
  await tap(th, '[data-sp-bills]'); tt = await text(th);
  ok(tt.includes('Add a bill') && tt.includes('No bills are waiting for you.'), '9.2 (P3, R-47.1) Bills draws: Add a bill, and that none are waiting');
  await tap(th, '.sp-back'); await tap(th, '[data-sp-gear]'); for (let i = 0; i < 40 && !(await th.$('[data-gr-nothing]')); i += 1) await H.sleep(250); tt = await text(th);
  ok(['Asked of you', 'You asked', 'Your gear', 'No one has asked for your gear yet.', 'You have not listed any gear.'].every((w) => tt.includes(w)) && !tt.includes('Loading'), '9.3 Gear draws its sections, each saying it is empty (never stuck on Loading)', tt.slice(0, 300));
  await th.close();
  const tp = await openP(b, '/vendor/papers', thin(), { wait: '[data-pp-kind]' }); tt = await text(tp);
  ok(['Professional certificate', 'Professional ID', 'Business statement', 'Ready for your CA'].every((w) => tt.includes(w)), '9.4 Business papers draws its four kinds');
  await tp.close();

  console.log('\n── 8  the opener\'s first-visit grace (CE-47 r2) ──');
  const L = (st, t) => ` GET /vendor/papers ${st} in ${t} (next.js: ${t}, proxy.ts: 9ms, application-code: 60ms)`;
  ok(judge404([L(404, '1993ms')], '/vendor/papers', false) === 'compiling' && judge404([L(404, '2.1s')], '/vendor/papers', false) === 'compiling'
    && judge404([L(404, '1993ms'), L(200, '5ms')], '/vendor/papers', false) === 'ok'
    && judge404([L(200, '187ms'), L(404, '6ms')], '/vendor/papers', false) === 'red'
    && judge404([L(404, '1993ms'), L(404, '7ms')], '/vendor/papers', false) === 'red'
    && judge404([' GET /vendor/papers-x 404 in 9ms (next.js: 4ms, proxy.ts: 1ms, application-code: 4ms)'], '/vendor/papers', false) === 'compiling',
  '8.1 the judge, on a path no page file serves: a first-visit 404 while compiling is waited through; a 404 after the route answered, or one given without compiling, is red');
  ok(routeHasPage('/vendor/supplies') && routeHasPage('/vendor/papers') && routeHasPage('/check/TDW-7Q4K-2M9P') && !routeHasPage('/vendor/no-such-room-b243') && !routeHasPage('/check'),
    '8.3 the tree is asked: Supplies, Business papers and a check code have page files; a room that does not exist has none');
  ok(judge404([L(404, '743ms'), L(404, '15ms')], '/vendor/papers', true) === 'compiling' && judge404([L(404, '743ms'), L(404, '15ms')], '/vendor/papers', false) === 'red',
    '8.4 the double 404 seen on 7 October: on a path a page file serves it is waited through (to 60 s); on a path none serves it is red at once');
  let threw = null; const t8 = Date.now();
  try { const z = await openP(b, '/vendor/no-such-room-b243', fakeP2()); await z.close(); } catch (e) { threw = String(e && e.message || e); }
  ok(!!threw && /^404 stands on \/vendor\/no-such-room-b243/.test(threw) && Date.now() - t8 < 75000, '8.2 a route that never exists is still red, within the 60 s bound', `${threw} in ${Date.now() - t8} ms`);
  // 8.5 the restart's own mechanics, driven on purpose at the end of the run (a stuck 404 cannot be planted): the old
  // tree is stopped, the port proven free, a fresh server answers, and the room opens on it.
  if (!stuckRestarts) {
    const pid0 = server.dev.pid; await restartServer('/vendor/supplies', 'restarted on purpose by cell 8.5');
    let oldGone = false; try { process.kill(pid0, 0); } catch (_e) { oldGone = true; }
    const z = await openP(b, '/vendor/supplies', fakeP2(), { wait: '[data-sp-bills]' }); const zt = await text(z); await z.close();
    ok(oldGone && server.dev.pid !== pid0 && zt.includes('Bills and gear'), '8.5 the once-per-run restart: the old server stopped, a fresh one up, the room opens on it', JSON.stringify({ pid0, pid1: server.dev.pid }));
  } else ok(true, '8.5 the once-per-run restart was used for real in this run (see its NOTE)');
  if (regraced.length) console.log(`  NOTE  first-visit 404 waited through on: ${regraced.join(', ')}`);
} catch (e) { ok(false, 'the run', e && e.stack); }
finally {
  // e-275: teardown is bounded. Under load a browser close or the dev server's stop can stall (seen: one run's verdict
  // printed 29/0 and the process then sat for 14 minutes). Each step gets 20 s; the browser is killed if it outlives it.
  const within = (pr, ms) => Promise.race([pr, new Promise((r) => setTimeout(r, ms))]);
  try { const bp = b && b.process(); await within(b ? b.close() : null, 20000); try { if (bp && bp.exitCode === null) bp.kill('SIGKILL'); } catch (_e) { /* gone */ } } catch (_e) { /* closed */ }
  // The whole tree by its PID, waited on (stop_tree.js), then the server's own stop, which PROVES the port free. (Found
  // by e-275's repeats: this line once passed the server OBJECT, so nothing was stopped here and only the exit hook's
  // un-waited SIGKILL remained; the next run could meet the old server on its port and lose it mid-walk.)
  try { if (server && server.dev) stopTree(server.dev.pid); } catch (_e) { /* gone */ }
  try { const r = server ? await within(server.stop(), 20000) : null; if (r && r.portFree === false) console.log(`  NOTE  port ${PORT} still answered after the stop`); } catch (_e) { /* stopped */ }
}
console.log(`\nb243 (${MODE}): ${pass} passed, ${fail} failed`); if (fail) console.log('FAILED: ' + failed.join(' · '));
process.exit(fail ? 1 : 0);
