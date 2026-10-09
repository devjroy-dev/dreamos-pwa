#!/usr/bin/env node
// scripts/b246_ce47_pro_p3_app_bench.mjs · CE-47 · PRO · P3 app: Brand collaborations, the Trend room, her public media kit,
// admin More > Brands and More > Trend briefs, and R-47.1's words, driven IN THE REAL APP (C-43.18): next dev in mock mode,
// the v2 layout, headless Chromium, one theme per run at 374 wide, real taps. The brands, trends, kit and admin doors are
// answered by a stateful fake of dream-os's P3 doors (the shapes b245 holds on the server side); every other door by the
// design harness. The opener (first-visit grace, a stuck-404 restart at most twice, evidence on a red, bounded teardown)
// is b243's, carried whole.
// argv: dark | light (one theme per run); --shots writes the frames to $SHOTS (no cell depends on them).
// THE EXIT CODE IS THE VERDICT.
import path from 'path'; import fs from 'fs'; import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
process.env.TDW_LAYOUT_DEFAULT = 'v2'; const PORT = +(process.env.PORT || 4120); process.env.PORT = String(PORT);
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const { stopTree } = require(path.join(ROOT, 'scripts/lib/stop_tree.js'));
const H = await import(path.join(ROOT, 'docs/design/tools/harness.mjs'));
const MODE = process.argv.includes('light') ? 'light' : 'dark'; const SHOTS = process.argv.includes('--shots') ? (process.env.SHOTS || '/tmp/b246') : null;
let pass = 0, fail = 0; const failed = [];
const ok = (c, name, info) => { if (c) { pass++; console.log('  PASS  ' + name); } else { fail++; failed.push(name); console.log('  FAIL  ' + name + (info === undefined ? '' : '  [' + String(info).slice(0, 300) + ']')); } };
const { VID: V } = await import(path.join(ROOT, 'scripts/lib/b123_fixtures.mjs'));

// ── the fake P3 doors (state per page) ──
const BR = { lumen: 'aaaaaaaa-0000-4000-8000-000000000001', kesari: 'aaaaaaaa-0000-4000-8000-000000000002', full: 'aaaaaaaa-0000-4000-8000-000000000003' };
const ASCI = 'If you got this for free or were paid, label the post as an ad or a paid partnership, as ASCI’s rules require.';
const KIT_URL = 'https://thedreamwedding.in/v/dev440/kit';
const PITCH = `Hello Lumen Cosmetics team,\n\nI am writing from Studio Ivara, a makeup business in Delhi.\nTDW has verified 14 weddings of my work.\nI would like to work with Lumen Cosmetics on wedding looks for my clients and my Instagram.\nMy media kit shows my work, my figures and how to reach me: ${KIT_URL}\n\nThank you for reading.\nStudio Ivara`;
const brandRow = (id, name, handle, extra = {}) => ({ id, name, looks_for: null, works_with: null, reach: 'You can reach it by Instagram.', channels: ['instagram'], instagram_handle: handle, instagram_url: `https://www.instagram.com/${handle}/`,
  website_url: `https://${handle.replace(/\./g, '')}.in`, source_url: `https://${handle.replace(/\./g, '')}.in/about`, checked_line: 'TDW took these details from the brand’s own website on 4 October 2026.', ...extra });
const counts = (week) => ({ day: Math.min(week, 3), week, day_left: Math.max(0, 3 - Math.min(week, 3)), week_left: 10 - week, line: `You have sent ${week} of 10 pitches this week.`, limits: 'You can send up to 3 pitches a day and 10 a week. You can pitch the same brand once in 30 days. These limits keep brands reading your pitches.' });
function fakeP3(o = {}) {
  const S = { log: [], week: 2, email: null, kitOk: o.kitOk !== false };
  const brands = [
    brandRow(BR.lumen, 'Lumen Cosmetics', 'lumen.cosmetics', { works_with: 'It works with accounts of 5,000 to 50,000 followers.', reach: 'You can reach it by Instagram or email.', channels: ['instagram', 'email'] }),
    brandRow(BR.kesari, 'Kesari Hair Care', 'kesari.hair'),
    brandRow(BR.full, 'Rangrez Jewels', 'rangrez.jewels', { reach: 'You can reach it by Instagram or the brand’s form.', channels: ['instagram', 'form'] }),
  ];
  const pitches = [
    { id: 'p-1', brand_id: BR.kesari, brand: 'Kesari Hair Care', channel: 'instagram', state: 'agreed', post_due: '2026-12-12', pill: { text: 'Post due', tone: 'warn' }, line: 'You and the brand agreed to work together. The post is due on 12 December 2026.', next: [{ to: 'kit_received', label: 'The products arrived' }, { to: 'posted', label: 'I posted it' }, { to: 'declined', label: 'The brand said no' }], asci: ASCI, pitched_at: '2026-10-01T05:00:00Z' },
    { id: 'p-2', brand_id: 'old', brand: 'Old Brand', channel: 'email', state: 'pitched', post_due: null, pill: { text: 'Pitched', tone: 'ok' }, line: 'You pitched this brand by email on 1 October 2026.', next: [{ to: 'replied', label: 'The brand replied' }, { to: 'declined', label: 'The brand said no' }, { to: 'no_reply', label: 'No reply' }], asci: null, pitched_at: '2026-10-01T05:00:00Z' },
  ];
  const room = () => ({ kit: { url: KIT_URL, contact_email: S.email, followers: 124500, followers_on: '2026-10-04', weddings: 14 }, counts: counts(S.week), trade: 'makeup', trade_word: 'makeup', brands, pitches });
  const page = (b) => ({ ...b, pitch: PITCH.replace(/Lumen Cosmetics/g, b.name), blocked: b.id === BR.full ? 'You pitched this brand in the last 30 days. You can pitch the same brand once in 30 days.' : null,
    send: b.channels.map((ch) => ({ channel: ch, link: ch === 'instagram' ? b.instagram_url : ch === 'email' ? `mailto:collab@lumencosmetics.in?subject=Collaboration%20enquiry&body=${encodeURIComponent(PITCH)}` : 'https://rangrezjewels.in/collab',
      step: { instagram: 'Copy the pitch. Tap Open Instagram. Send the pitch to the brand as a message.', email: 'Tap Open email. Your email app opens with the pitch written in it. Check the pitch before you send it.', form: 'Copy the pitch. Tap Open the form. Paste the pitch into the brand’s form.' }[ch] })),
    sent_ask: 'After you send the pitch, tap I sent it. TDW then counts the pitch and shows it under Your pitches.', last_pitch: null, counts: counts(S.week) });
  const briefs = {
    'w-1': { id: 'w-1', week_start: '2026-09-28', head: 'Makeup in Delhi, week of 28 September 2026.', lines: ['TDW vendors in Delhi received 146 enquiries for makeup in the week of 28 September 2026.', 'These enquiries went to 23 vendors.', 'Clients most often asked for HD makeup (41 enquiries), soft glam (33 enquiries) and dewy (19 enquiries).', 'Most of the wedding dates asked for were in November and February.', 'The most common budget was Rs 25,000 to Rs 50,000.'], note: 'TDW counted these enquiries across all vendors on TDW. No client or vendor is named.', news: [{ line: 'A large beauty brand launched a long-wear foundation range in 40 shades for Indian skin.', source_url: 'https://news.example/foundation' }] },
    'w-0': { id: 'w-0', week_start: '2026-09-21', head: 'Makeup in Delhi, week of 21 September 2026.', lines: ['TDW vendors in Delhi received 120 enquiries for makeup in the week of 21 September 2026.', 'These enquiries went to 20 vendors.'], note: 'TDW counted these enquiries across all vendors on TDW. No client or vendor is named.', news: [] },
  };
  const kit = { name: 'Studio Ivara', trade: 'Makeup artist', city: 'Delhi', code: 'dev440', photos: [{ image_url: 'https://res.cloudinary.com/tdw/image/upload/a.jpg', caption: 'Bridal look' }, { image_url: 'https://res.cloudinary.com/tdw/image/upload/b.jpg', caption: null }],
    weddings: 14, followers: 124500, followers_on: '2026-10-04', words: [{ body: 'She understood my face in ten minutes.', author: 'Ananya', place: 'Udaipur' }],
    contact: o.noContact ? { email: null, email_link: null, instagram_url: null } : { email: 'hello@studioivara.in', email_link: 'mailto:hello@studioivara.in?subject=Collaboration%20enquiry', instagram_url: 'https://www.instagram.com/studio.ivara/' },
    footer: ['Weddings are counted by TDW from bookings with an invoice and a payment recorded in TDW.', 'Followers as of 4 October 2026.'] };
  const admin = { brands: [{ ...brandRow(BR.lumen, 'Lumen Cosmetics', 'lumen.cosmetics'), trades: ['makeup'], role_email: 'collab@lumencosmetics.in', form_url: null, followers_min: 5000, followers_max: 50000, checked_on: '2026-10-04', state: 'listed', pitches: 4 }],
    briefs: [{ id: 'b-1', trade: 'makeup', city: 'Delhi', week_start: '2026-09-28', state: 'draft', head: 'Makeup in Delhi, week of 28 September 2026.', lines: briefs['w-1'].lines, note: briefs['w-1'].note, news: [], shows_from: '2026-10-05T03:30:00.000Z', decided_by: null }] };
  return { S, answer(method, rt, body) {
    S.log.push([method, rt, body]);
    if (o.thin && /\/api\/v2\/vendor\/(brands|trends)\//.test(rt)) return { ok: true };
    if (o.down && /\/api\/v2\/vendor\/(brands|trends)\//.test(rt)) return { status: 500, body: { ok: false, error: o.down } };
    if (rt === `/api/v2/vendor/brands/${V}` && method === 'GET') return { ok: true, room: room() };
    const bp = rt.match(new RegExp(`^/api/v2/vendor/brands/${V}/brands/([^/]+)$`));
    if (bp && method === 'GET') { const b = brands.find((x) => x.id === bp[1]); return b ? { ok: true, brand: page(b) } : { status: 404, body: { ok: false, error: 'This brand is not on the list.' } }; }
    const st = rt.match(new RegExp(`^/api/v2/vendor/brands/${V}/brands/([^/]+)/sent$`));
    if (st && method === 'POST') { if (o.refuse) return { status: 409, body: { ok: false, error: o.refuse } }; S.week += 1; return { ok: true, counts: counts(S.week) }; }
    const mv = rt.match(new RegExp(`^/api/v2/vendor/brands/${V}/pitches/([^/]+)$`));
    if (mv && method === 'POST') { const p = pitches.find((x) => x.id === mv[1]); if (body.to === 'kit_received') { p.state = 'kit_received'; p.pill = { text: 'Post due', tone: 'warn' }; p.line = 'The brand’s products arrived. The post is due on 12 December 2026.'; p.next = [{ to: 'posted', label: 'I posted it' }]; } if (body.post_due) p.post_due = body.post_due; return { ok: true, pitch: p }; }
    if (rt === `/api/v2/vendor/brands/${V}/kit` && method === 'POST') { if (!/^[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(body.contact_email || '') && body.contact_email) return { status: 400, body: { ok: false, error: 'Type your email address in full, for example hello@yourstudio.in.' } }; S.email = body.contact_email || null; return { ok: true, kit: { contact_email: S.email } }; }
    if (rt === `/api/v2/vendor/trends/${V}` && method === 'GET') return o.noBrief ? { ok: true, room: { brief: null, past: [], made_line: 'TDW makes a new brief every Monday at 9:00 am.', empty: 'There is no brief for your trade in your city yet. A brief is made only when enough clients asked in a week, so that no one can be picked out.' } }
      : { ok: true, room: { brief: briefs['w-1'], past: [{ id: 'w-0', week_start: '2026-09-21', title: 'Week of 21 September 2026' }, { id: 'w-x', week_start: '2026-09-14', title: 'Week of 14 September 2026' }], made_line: 'TDW makes a new brief every Monday at 9:00 am.', empty: null } };
    const wk = rt.match(new RegExp(`^/api/v2/vendor/trends/${V}/weeks/([^/]+)$`));
    if (wk && method === 'GET') return briefs[wk[1]] ? { ok: true, brief: briefs[wk[1]] } : { status: 404, body: { ok: false, error: 'That brief is not available.' } };
    const kt = rt.match(/^\/api\/v2\/public\/kit\/([^/]+)$/);
    if (kt) return S.kitOk && kt[1] === 'dev440' ? { ok: true, kit } : { status: 404, body: { ok: false, error: 'This media kit is not available.' } };
    if (rt === '/api/v2/admin/brands/' && method === 'GET') return { ok: true, brands: admin.brands, trades: [{ key: 'makeup', word: 'makeup' }, { key: 'photography', word: 'photography' }, { key: 'jewellery', word: 'jewellery' }] };
    if (rt === '/api/v2/admin/brands/' && method === 'POST') return /priya@/.test(body.role_email || '') ? { status: 400, body: { ok: false, error: 'Keep only a role address, such as pr@ or collab@. A person’s own address is not kept.' } } : { ok: true, brand: { id: 'new' } };
    if (rt === '/api/v2/admin/trends/' && method === 'GET') return { ok: true, briefs: admin.briefs, last_week: '2026-09-28' };
    const at = rt.match(/^\/api\/v2\/admin\/trends\/([^/]+)$/);
    if (at && method === 'POST' && at[1] !== 'make') { admin.briefs[0].state = body.state; return { ok: true, brief: admin.briefs[0] }; }
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
/** The line saying what happened sits in the page's flow: no fixed element (a toast) carries it. */
const inFlow = (p, words) => p.evaluate((w) => ![...document.querySelectorAll('body *')].some((e) => getComputedStyle(e).position === 'fixed' && (e.textContent || '').includes(w)), words);

// ── R-47.1 (the founder, 8 October 2026): a sentence is simple, formal and complete, with one idea; read alone ──
const SENT = (s) => /^[A-Z0-9"“(@].*[.?!]$/.test(String(s).trim()) && !/—|–/.test(s) && !/\b(couple|bride)s?\b/i.test(s);
const SHORT = /\b\d{1,2} (Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\b(?![a-z])/;
const westernRs = (t) => (t.match(/Rs \d{1,3}(?:,\d{3}){2,}\b|Rs \d{3},\d{3}\b/g) || []);
/** Every paragraph a room draws: each must be a sentence (R-47.1). */
const paras = (p, scope = 'main') => p.$$eval(`${scope} p`, (els) => els.map((e) => (e.innerText || '').trim()).filter(Boolean));
const noOverflow = (p) => p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
let n = 0; const shot = async (p, name, at) => { if (!SHOTS) return; fs.mkdirSync(SHOTS, { recursive: true });
  if (at) { await p.$eval(at, (e) => e.scrollIntoView({ block: 'start' })).catch(() => {}); await H.sleep(250); } await p.screenshot({ path: path.join(SHOTS, `${String(++n).padStart(2, '0')}_${name}_${MODE}.png`) }); };
const clip = async (p) => { await p.evaluateOnNewDocument(() => { window.__copied = []; const c = { writeText: (t) => { window.__copied.push(t); return Promise.resolve(); } }; try { Object.defineProperty(navigator, 'clipboard', { get: () => c, configurable: true }); } catch (_e) { /* read-only */ } }); };

for (let i = 0; i < 40 && await dev.portOpen(PORT); i += 1) await H.sleep(500);
if (await dev.portOpen(PORT)) { console.log(`b246: port ${PORT} is held by another server; refusing to walk someone else's tree`); process.exit(2); }
const census = () => { try { const fs2 = require('fs'); return require('child_process').execSync('ps -eo pid,ppid,args', { encoding: 'utf8' }).split('\n').slice(1).map((l) => l.trim()).filter(Boolean)
  .filter((l) => { const pid = l.split(/\s+/)[0]; if (+pid === process.pid) return false; let cwd = ''; try { cwd = fs2.readlinkSync(`/proc/${pid}/cwd`); } catch (_e) { return false; } return cwd === ROOT && /next|node/.test(l); })
  .map((l) => l.replace(/\s+/g, ' ').slice(0, 120)); } catch (_e) { return ['ps failed']; } };
const plain = async (u, ck = `tdw_layout=v2; tdw_wl_mode=${MODE}`) => { try { const r = await fetch(`http://localhost:${PORT}${u}`, { headers: { cookie: ck }, redirect: 'manual' }); return r.status + (r.headers.get('location') ? '>' + r.headers.get('location').replace(/^https?:\/\/[^/]+/, '') : ''); } catch (_e) { return 'refused'; } };
console.log(`  NOTE  census before the first server: ${JSON.stringify(census())}`);
const DEV_ENV = { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` };
let server = await dev.start(ROOT, PORT, DEV_ENV);
let restarted = null; let stuckRestarts = 0;
async function restartServer(route, why = 'answered 404 for 20 s on a path a page file serves') {
  const old = logRows(devLog(), route);
  console.log(`  NOTE  F-44.370 reads on the stuck server: ${JSON.stringify({ same_from_node: await plain(route), never: await plain('/vendor/no-such-room-x'), home: await plain('/') })} :: census ${JSON.stringify(census())}`);
  try { stopTree(server.dev.pid); } catch (_e) { /* gone */ }
  try { await server.stop(); } catch (_e) { /* stopped */ }
  for (let i = 0; i < 40 && await dev.portOpen(PORT); i += 1) await H.sleep(500);
  server = await dev.start(ROOT, PORT, DEV_ENV);
  if (!(await server.up())) throw new Error('the fresh dev server did not come up');
  restarted = { route, old };
  console.log(`  NOTE  dev server restarted once: ${route} ${why}; the old server's rows ${JSON.stringify(old)}`);
}
let b;
try {
  if (!(await server.up())) throw new Error('the dev server did not come up');
  b = await H.browser();

  console.log(`\n── 1  Brand collaborations (${MODE}, 374 wide) ──`);
  let f = fakeP3();
  let p = await openP(b, '/vendor/brands', f, { wait: '[data-br-kit]' }); await clip(p); await p.evaluate(() => { window.__copied = []; const c = { writeText: (x) => { window.__copied.push(x); return Promise.resolve(); } }; try { Object.defineProperty(navigator, 'clipboard', { get: () => c, configurable: true }); } catch (_e) { /* read-only */ } });
  let t = await text(p);
  const kb = await p.$eval('[data-br-kitbox]', (e) => ({ text: (e.querySelector('[data-copytext]') || {}).textContent, ctl: (e.querySelector('[data-copyctl]') || {}).textContent, kids: e.children.length })).catch(() => null);
  ok(kb && kb.text === 'thedreamwedding.in/v/dev440/kit' && kb.ctl === 'Copy link' && kb.kids === 2, '1.1 her kit’s address sits in its own box with one control, Copy link (R-46.17)', JSON.stringify(kb));
  ok(t.includes('Your kit shows your best photos, your 14 verified weddings and your 1,24,500 Instagram followers. It updates by itself.') && (await p.$eval('[data-br-kitopen]', (e) => [e.getAttribute('href'), e.target, e.rel])).join() === `${KIT_URL},_blank,noopener noreferrer`,
    '1.2 the kit line says what the kit shows, in Indian grouping; Open goes to the kit in a new tab', t.slice(0, 300));
  ok(t.includes('You have sent 2 of 10 pitches this week.') && t.includes('You can send up to 3 pitches a day and 10 a week.') && ['Lumen Cosmetics', 'Kesari Hair Care', 'Rangrez Jewels'].every((w) => t.includes(w)) && t.includes('It works with accounts of 5,000 to 50,000 followers. You can reach it by Instagram or email.'),
    '1.3 this week’s count, the limits, and the brands that fit her, each with who it works with and how to reach it');
  const pills = await p.$$eval('[data-br-pitch] .fr-pill', (es) => es.map((e) => e.textContent));
  ok(JSON.stringify(pills) === '["Post due","Pitched"]' && t.includes('You and the brand agreed to work together. The post is due on 12 December 2026.') && t.includes('TDW takes no fee from any collaboration. None of the links here pays TDW.'),
    '1.4 her pitches with where each stands; the no-fee line', JSON.stringify(pills));
  ok(await p.$eval('[data-add-top]', (e) => e.textContent.trim()).catch(() => '') === '+ New pitch' && (await p.$$('[data-add-top]')).length === 1 && (await p.$$('.wl-helpq')).length === 1, '1.5 one "+ New pitch" and one "?" in the room head');
  const ps1 = await paras(p);
  ok(ps1.length >= 5 && ps1.every(SENT) && !SHORT.test(t) && westernRs(t).length === 0 && await noOverflow(p), '1.6 R-47.1: every line the room draws is a full sentence; full months, Indian grouping; nothing wider than 374', JSON.stringify(ps1.filter((x) => !SENT(x))));
  await shot(p, 'brands_room');
  await tap(p, `[data-br-brand="${BR.lumen}"] button`); await p.waitForSelector('[data-br-pitchbox]', { timeout: 15000 }); t = await text(p);
  const pb = await p.$eval('[data-br-pitchbox]', (e) => ({ text: (e.querySelector('[data-copytext]') || {}).textContent, ctl: (e.querySelector('[data-copyctl]') || {}).textContent, kids: e.children.length }));
  ok(pb.text === PITCH && pb.ctl === 'Copy the pitch' && pb.kids === 2 && t.includes('TDW wrote this pitch for you. You can change the words after you paste them.'), '1.7 the pitch TDW wrote sits in its own box with one control, Copy the pitch', JSON.stringify(pb).slice(0, 200));
  await tap(p, '[data-br-pitchbox] [data-copyctl]');
  ok(JSON.stringify(await p.evaluate(() => window.__copied)) === JSON.stringify([PITCH]) && (await p.$eval('[data-br-pitchbox] [data-copyctl]', (e) => e.textContent)) === 'Copied', '1.8 Copy writes exactly the pitch and reads Copied');
  const sends = await p.$$eval('[data-br-send]', (es) => es.map((e) => ({ ch: e.getAttribute('data-br-send'), a: (e.querySelector('a') || {}).href, tgt: (e.querySelector('a') || {}).target, rel: (e.querySelector('a') || {}).rel, b: (e.querySelector('[data-br-sent]') || {}).textContent })));
  ok(sends.length === 2 && sends[0].ch === 'instagram' && sends[0].a === 'https://www.instagram.com/lumen.cosmetics/' && sends[0].tgt === '_blank' && sends[0].rel === 'noopener noreferrer' && sends[1].ch === 'email' && sends[1].a.startsWith('mailto:collab@lumencosmetics.in') && sends.every((s) => s.b === 'I sent it')
    && t.includes('Copy the pitch. Tap Open Instagram. Send the pitch to the brand as a message.') && t.includes('After you send the pitch, tap I sent it. TDW then counts the pitch and shows it under Your pitches.'),
    '1.9 the ways to send it: Open Instagram (a new tab), Open email (a written email), each with I sent it; each step names its button with "tap"', JSON.stringify(sends).slice(0, 300));
  ok((await paras(p)).every(SENT) && await noOverflow(p), '1.10 R-47.1 on the brand page; nothing wider than 374', JSON.stringify((await paras(p)).filter((x) => !SENT(x))));
  await shot(p, 'brand_page');
  await tap(p, '[data-br-sent="instagram"]'); await p.waitForSelector('[data-br-status]', { timeout: 15000 }); t = await text(p);
  const sentCall = f.S.log.find(([m, rt]) => m === 'POST' && /\/sent$/.test(rt));
  ok(sentCall && sentCall[2].channel === 'instagram' && t.includes('TDW counted your pitch to Lumen Cosmetics. You have sent 3 of 10 pitches this week.') && (await p.$eval('[data-br-status]', (e) => e.getAttribute('role'))) === 'status' && await inFlow(p, 'TDW counted your pitch'),
    '1.11 I sent it: TDW is told how she sent it; back in the room a line under the heading says it was counted (not a toast)', t.slice(0, 200));
  await p.close();
  f = fakeP3(); p = await openP(b, '/vendor/brands', f, { wait: '[data-br-kit]' });
  await tap(p, `[data-br-brand="${BR.full}"] button`); await p.waitForSelector('[data-br-pitchbox]', { timeout: 15000 });
  ok((await p.$eval('[data-br-blocked]', (e) => e.textContent).catch(() => null)) === 'You pitched this brand in the last 30 days. You can pitch the same brand once in 30 days.' && (await p.$$('[data-br-sent]')).length === 0, '1.12 a brand she cannot pitch yet: the reason, and no I sent it');
  await p.close();
  f = fakeP3({ refuse: 'You have sent 3 pitches today. You can send more tomorrow.' }); p = await openP(b, '/vendor/brands', f, { wait: '[data-br-kit]' });
  await tap(p, `[data-br-brand="${BR.kesari}"] button`); await tap(p, '[data-br-sent="instagram"]'); t = await text(p);
  ok(t.includes('You have sent 3 pitches today. You can send more tomorrow.') && !!(await p.$('[data-br-pitchbox]')), '1.13 a pitch the door refuses: its sentence is shown on the brand page, and she stays there');
  await p.close();
  f = fakeP3(); p = await openP(b, '/vendor/brands', f, { wait: '[data-br-kit]' });
  await tap(p, '[data-br-pitch="p-1"] button'); await p.waitForSelector('[data-br-pitchview]', { timeout: 15000 }); t = await text(p);
  const due = await p.$$eval('[data-br-due] input[type="date"]', (es) => es.map((e) => ({ v: e.value, under: (e.nextElementSibling && e.nextElementSibling.textContent) || '' })));
  ok((await p.$eval('[data-br-asci]', (e) => e.textContent).catch(() => null)) === ASCI && due.length === 1 && due[0].v === '2026-12-12' && due[0].under === '12 December 2026' && (await p.$$eval('[data-br-next]', (es) => es.map((e) => e.textContent))).join('|') === 'The products arrived|I posted it|The brand said no',
    '1.14 an agreed pitch: ASCI’s line in the founder’s words, the due date with the date in full beneath it, and the next steps', JSON.stringify(due));
  await tap(p, '[data-br-next="kit_received"]'); t = await text(p);
  ok(f.S.log.some(([m, rt, bd]) => m === 'POST' && /pitches\/p-1$/.test(rt) && bd.to === 'kit_received') && t.includes('The brand’s products arrived. The post is due on 12 December 2026.') && (await p.$$eval('[data-br-next]', (es) => es.map((e) => e.textContent))).join('|') === 'I posted it',
    '1.15 a step is saved and the pitch shows where it stands now');
  await shot(p, 'pitch_view');
  await p.close();
  f = fakeP3(); p = await openP(b, '/vendor/brands', f, { wait: '[data-br-kit]' });
  await tap(p, '[data-br-kitset]'); await p.waitForSelector('[data-br-email]', { timeout: 15000 });
  await p.type('[data-br-email]', 'not an email'); await tap(p, '[data-br-savekit]'); t = await text(p);
  const bad = t.includes('Type your email address in full, for example hello@yourstudio.in.');
  await p.$eval('[data-br-email]', (e) => { const s = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; s.call(e, 'hello@studioivara.in'); e.dispatchEvent(new Event('input', { bubbles: true })); });
  await tap(p, '[data-br-savekit]'); await p.waitForSelector('[data-br-status]', { timeout: 15000 }); t = await text(p);
  ok(bad && f.S.email === 'hello@studioivara.in' && t.includes('Your kit’s email address is saved.'), '1.16 kit settings: a wrong address is refused in one sentence; a right one is saved and said so');
  await p.close();
  f = fakeP3({ thin: true }); p = await openP(b, '/vendor/brands', f, { wait: '[data-br-kit]' }); t = await text(p);
  ok(t.includes('Your kit gets its address when your TDW page is ready.') && t.includes('No brand on the list fits your trade yet. TDW adds brands to the list over time.') && !t.includes('Reading'), '1.17 a thin answer ({ ok: true }, no lists): the room still draws, each part saying it is empty (lesson 2)', t.slice(0, 300));
  await p.close();
  f = fakeP3({ down: 'TDW could not read your brands just now. Please try again.' }); p = await openP(b, '/vendor/brands', f, { wait: '[data-br-kit]' }); t = await text(p);
  ok(t.includes('TDW could not read your brands just now. Please try again.'), '1.18 a door that fails: one sentence, no crash');
  await p.close();

  console.log(`\n── 2  the Trend room (${MODE}) ──`);
  f = fakeP3(); p = await openP(b, '/vendor/trends', f, { wait: '[data-tr-head], [data-tr-empty]' }); t = await text(p);
  const news = await p.$$eval('[data-tr-news] a', (es) => es.map((e) => [e.textContent, e.href, e.target, e.rel]));
  ok(t.includes('Makeup in Delhi, week of 28 September 2026. TDW makes a new brief every Monday at 9:00 am.') && t.includes('TDW vendors in Delhi received 146 enquiries for makeup in the week of 28 September 2026.') && t.includes('Clients most often asked for HD makeup (41 enquiries), soft glam (33 enquiries) and dewy (19 enquiries).')
    && t.includes('TDW counted these enquiries across all vendors on TDW. No client or vendor is named.') && news.length === 1 && news[0].join('|') === 'Read it at the source|https://news.example/foundation|_blank|noopener noreferrer',
    '2.1 the brief: its week in full, what clients asked for, that no one is named, and news with its source in a new tab', JSON.stringify(news));
  ok((await paras(p)).every(SENT) && !SHORT.test(t) && westernRs(t).length === 0 && await noOverflow(p) && (await p.$$('[data-add-top]')).length === 0 && (await p.$$('.wl-helpq')).length === 1,
    '2.2 R-47.1 on the brief; full months, Indian grouping; no "+" (nothing to add here) and one "?"', JSON.stringify((await paras(p)).filter((x) => !SENT(x))));
  await shot(p, 'trend_room');
  await tap(p, '[data-tr-week="w-0"] button'); t = await text(p);
  ok(t.includes('Makeup in Delhi, week of 21 September 2026.') && t.includes('TDW vendors in Delhi received 120 enquiries') && !!(await p.$('.tr-back')), '2.3 a past week opens its brief, with a way back');
  await tap(p, '.tr-back'); await tap(p, '[data-tr-week="w-x"] button'); t = await text(p);
  ok(t.includes('That brief is not available.'), '2.4 a week the door will not give: one sentence');
  await p.close();
  f = fakeP3({ noBrief: true }); p = await openP(b, '/vendor/trends', f, { wait: '[data-tr-empty]' }); t = await text(p);
  ok(t.includes('There is no brief for your trade in your city yet. A brief is made only when enough clients asked in a week, so that no one can be picked out.') && t.includes('TDW makes a new brief every Monday at 9:00 am.'), '2.5 no brief yet: why, in plain words');
  await p.close();
  f = fakeP3({ thin: true }); p = await openP(b, '/vendor/trends', f, { wait: '.tr-lede' }); t = await text(p);
  ok(t.includes('TDW makes a new brief every Monday at 9:00 am.') && !t.includes('Reading'), '2.6 a thin answer: the room still draws (lesson 2)');
  await p.close();

  console.log(`\n── 3  her public media kit (no session) ──`);
  f = fakeP3(); p = await openP(b, '/v/dev440/kit', f, { wait: '[data-kit="dev440"], [data-kit="no"]' }); t = await text(p);
  const kitBtns = await p.$$eval('.kt-cta', (es) => es.map((e) => [e.textContent, e.getAttribute('href'), e.target || '', e.rel || '']));
  ok(t.includes('Studio Ivara') && t.includes('This media kit is for brands.') && t.includes('14, verified by TDW') && t.includes('1,24,500') && !t.includes('124,500') && t.includes('She understood my face in ten minutes.')
    && JSON.stringify(kitBtns) === JSON.stringify([['Email about a collaboration', 'mailto:hello@studioivara.in?subject=Collaboration%20enquiry', '', ''], ['Message on Instagram', 'https://www.instagram.com/studio.ivara/', '_blank', 'noopener noreferrer']]),
    '3.1 the kit: her name, verified weddings, followers in Indian grouping, a client’s words, and the two ways to reach her', JSON.stringify(kitBtns));
  const foot = await p.$$eval('[data-kit-foot]', (es) => es.map((e) => e.textContent));
  ok(JSON.stringify(foot) === JSON.stringify(['Weddings are counted by TDW from bookings with an invoice and a payment recorded in TDW.', 'Followers as of 4 October 2026.']) && t.includes('TDW takes no fee from any collaboration.'),
    '3.2 the footer: the founder’s weddings line, then "Followers as of <date>."; no fee', JSON.stringify(foot));
  ok((await paras(p)).every(SENT) && await noOverflow(p) && (await p.$eval('meta[name="robots"]', (e) => e.content).catch(() => '')).includes('noindex') && !(await p.$('.wl-main')),
    '3.3 R-47.1 on the kit; nothing wider than 374; not listed by search engines; outside the app’s shell', JSON.stringify((await paras(p)).filter((x) => !SENT(x))));
  // The root layout's theme script sets <html style=background> before hydration on every /v/ page (seen on /v/<code> and
  // /v/<code>/date too; not on /check): React's hydration note about that one attribute is the layout's, flagged to the chair.
  const kitSaid = p.__said.filter((x) => !/^failed: /.test(x) && !/Failed to load resource/.test(x) && !/A tree hydrated but some attributes of the server rendered HTML didn't match/.test(x));
  console.log(`  NOTE  3.6 what the browser said on the kit, exempted: ${JSON.stringify(p.__said.filter((x) => !kitSaid.includes(x)).map((x) => x.slice(0, 140)))}`);
  ok(kitSaid.length === 0, '3.6 the kit page gives the browser no error or warning (a failed fixture photo aside)', JSON.stringify(kitSaid));
  await shot(p, 'kit');
  await p.close();
  f = fakeP3({ kitOk: false }); p = await openP(b, '/v/nobody/kit', f, { wait: '[data-kit="no"]' });
  ok((await p.$eval('[data-kit-none]', (e) => e.textContent)) === 'This media kit is not available.', '3.4 no such kit: one sentence');
  await p.close();
  f = fakeP3({ noContact: true }); p = await openP(b, '/v/dev440/kit', f, { wait: '[data-kit="dev440"]' }); t = await text(p);
  ok(t.includes('Studio Ivara has not added a way for brands to write yet.') && (await p.$$('.kt-cta')).length === 0, '3.5 no email and no Instagram: one sentence, no empty buttons');
  await p.close();

  console.log(`\n── 4  admin: More > Brands and More > Trend briefs ──`);
  const adminOpen = async (route, wait) => {
    const pg = await b.newPage(); await pg.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    await pg.evaluateOnNewDocument(() => { localStorage.setItem('admin_session_token', 'bench-token'); localStorage.setItem('admin_session_expires', String(Date.now() + 3600000)); });
    const cdp = await pg.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
    pg.__open = new Set(); pg.__said = []; await pg.setRequestInterception(true);
    const fk = fakeP3(); pg.on('request', (r) => { const u = r.url(); if (!u.includes('/__api/')) return r.continue(); const rt = u.split('/__api')[1].split('?')[0]; let body = {}; try { body = JSON.parse(r.postData() || '{}'); } catch (_e) { /* empty */ }
      const a = fk.answer(r.method(), rt, body); if (a && a.status) return r.respond({ status: a.status, contentType: 'application/json', body: JSON.stringify(a.body) });
      return r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(a || (r.method() === 'GET' ? H.answer(rt) : { ok: true })) }); });
    await pg.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'domcontentloaded', timeout: 240000 });
    for (let i = 0; i < 300; i += 1) { if (await pg.evaluate((s) => [...document.querySelectorAll('*')].some((e) => e.childElementCount === 0 && (e.textContent || '').includes(s)), wait)) break; await H.sleep(300); }
    await settle(pg); return { pg, fk };
  };
  let { pg, fk } = await adminOpen('/admin/brands', 'Lumen Cosmetics'); t = await text(pg);
  ok(t.includes('Lumen Cosmetics') && t.includes('@lumen.cosmetics') && t.includes('4 pitches'), '4.1 the brand list: each brand leads with its Instagram handle, with how many pitches it had', JSON.stringify(fk.S.log.map((x) => x.slice(0, 2))) + ' :: ' + t.slice(0, 200));
  await pg.evaluate(() => { const el = [...document.querySelectorAll('button, a')].find((e) => (e.textContent || '').trim() === 'Add a brand'); if (el) el.click(); }); await settle(pg); t = await text(pg);
  ok(t.includes('Instagram handle, as the brand’s own website shows it') && t.includes('Collaboration email (a role address only, such as pr@ or collab@)') && t.includes('An email that belongs to a person is not kept.'), '4.2 Add a brand asks for each detail from the brand’s own website, and says a person’s email is not kept');
  await pg.evaluate(() => { const set = (ph, v) => { const e = [...document.querySelectorAll('input')].find((i) => i.placeholder === ph); const s = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; s.call(e, v); e.dispatchEvent(new Event('input', { bubbles: true })); };
    set("De'Lanci India", "De'Lanci India"); set('pr@de-lanci.in', 'priya@de-lanci.in'); const sv = [...document.querySelectorAll('button')].find((e) => (e.textContent || '').trim() === 'Save'); sv.click(); }); await settle(pg); t = await text(pg);
  ok(t.includes('Keep only a role address, such as pr@ or collab@. A person’s own address is not kept.') && fk.S.log.some(([m, rt]) => m === 'POST' && rt === '/api/v2/admin/brands/'), '4.3 the server’s refusal of a person’s email is shown in its own sentence');
  await pg.close();
  ({ pg, fk } = await adminOpen('/admin/trends', 'Makeup in Delhi')); t = await text(pg);
  ok(t.includes('Makeup in Delhi, week of 28 September 2026.') && t.includes('Waiting for you') && t.includes('Count last week now'), '4.4 the briefs to approve, with their state, and a way to count last week now');
  await pg.evaluate(() => { const el = [...document.querySelectorAll('*')].find((e) => e.childElementCount === 0 && (e.textContent || '').trim() === 'Makeup in Delhi, week of 28 September 2026.'); (el.closest('button,[role="button"],a') || el).click(); }); await settle(pg); t = await text(pg);
  const ok45 = t.includes('TDW vendors in Delhi received 146 enquiries for makeup in the week of 28 September 2026.') && t.includes('Write each as one sentence with a full stop, and add its source.');
  await pg.evaluate(() => { const set = (ph, v) => { const e = [...document.querySelectorAll('input')].find((i) => i.placeholder === ph); const s = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; s.call(e, v); e.dispatchEvent(new Event('input', { bubbles: true })); };
    set('A large beauty brand launched a foundation range in 40 shades.', 'A large beauty brand launched a foundation range in 40 shades.'); set('https://', 'https://news.example/a');
    const ap = [...document.querySelectorAll('button')].find((e) => (e.textContent || '').trim() === 'Approve'); ap.click(); }); await settle(pg);
  const appr = fk.S.log.find(([m, rt]) => m === 'POST' && rt === '/api/v2/admin/trends/b-1');
  ok(ok45 && appr && appr[2].state === 'approved' && JSON.stringify(appr[2].news) === JSON.stringify([{ line: 'A large beauty brand launched a foundation range in 40 shades.', source_url: 'https://news.example/a' }]), '4.5 a brief opens with its sentences; Approve sends it with its news line and source', JSON.stringify(appr && appr[2]));
  await pg.close();

  console.log('\n── 5  the founder’s tag and the help lines (source) ──');
  const SC = fs.readFileSync(path.join(ROOT, 'v2/app/vendor/(shell)/supplies/screen.tsx'), 'utf8');
  ok(SC.includes('<span className="sp-tag">Link checked on {s.checked}</span>') && !/Checked by TDW/i.test(SC.replace(/^\s*\/\/.*$/gm, '')), '5.1 Supplies: "Link checked on <date>", and "Checked by TDW" nowhere in the room’s code (the founder, 8 October 2026)');
  const PH = fs.readFileSync(path.join(ROOT, 'v2/lib/worklist/pageHelp.ts'), 'utf8');
  ok(PH.includes("'Each card is a place to buy at professional prices. The date on the card is the day its link was last checked. The card also says what it costs to join. Tap Open to go to that place\\u2019s own site.'"), '5.2 Supplies’ help line, word for word as the chair approved it');
  const lines = [...PH.matchAll(/\[(SUPPLIES|PAPERS|BRANDS|TRENDS)_HREF\]: entry\(ROW_DESC\.[a-z]+, \{ can: how\(([\s\S]*?)\),\s*connects: '([^']*)' \}\)/g)];
  const said = lines.flatMap((m) => [...m[2].matchAll(/\['[a-z]+', '((?:[^'\\]|\\.)*)'\]/g)].map((x) => x[1].replace(/\\u2019/g, '’')).concat([m[3]]));
  ok(lines.length === 4 && said.every(SENT) && said.filter((l) => /\b[Tt]ap [A-Z]/.test(l)).every((l) => /(^|\. )Tap [A-Z]|, tap [A-Z]/.test(l)) && said.every((l) => !/^(New paper|New pitch|Withdraw|Write my requirement|Join with|Open|Copy link|I sent it) [a-z]/.test(l)), '5.3 R-47.1 on the four help cards: every line a sentence; a line that names a button says "Tap <button>", and no button is used as a subject', JSON.stringify({ n: lines.length, bad: said.filter((x) => !SENT(x)) }));

  console.log('\n── 6  R-47.1: the table in the handover is what the tree holds ──');
  const TB = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/lib/b246_words.json'), 'utf8'));
  const miss = TB.filter((r) => { const s = fs.readFileSync(path.join(ROOT, r.file), 'utf8'); return !s.includes(r.new_code) || (r.old_code !== r.new_code && s.includes(r.old_code)); });
  ok(TB.length >= 40 && miss.length === 0, '6.1 every rewritten line is in its file and its old words are gone', JSON.stringify(miss.map((r) => r.file + ': ' + r.new_code.slice(0, 50))));
} catch (e) { ok(false, 'the run', e && e.stack); }
finally {
  const within = (pr, ms) => Promise.race([pr, new Promise((r) => setTimeout(r, ms))]);
  try { const bp = b && b.process(); await within(b ? b.close() : null, 20000); try { if (bp && bp.exitCode === null) bp.kill('SIGKILL'); } catch (_e) { /* gone */ } } catch (_e) { /* closed */ }
  try { if (server && server.dev) stopTree(server.dev.pid); } catch (_e) { /* gone */ }
  try { const r = server ? await within(server.stop(), 20000) : null; if (r && r.portFree === false) console.log(`  NOTE  port ${PORT} still answered after the stop`); } catch (_e) { /* stopped */ }
}
console.log(`\nb246 (${MODE}): ${pass} passed, ${fail} failed`); if (fail) console.log('FAILED: ' + failed.join(' · '));
process.exit(fail ? 1 : 0);
