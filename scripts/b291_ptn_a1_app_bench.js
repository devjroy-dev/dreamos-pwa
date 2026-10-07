#!/usr/bin/env node
// scripts/b291_ptn_a1_app_bench.js · CE-47 · PTN-A1 app half · rung b291. The real pages in headless Chromium (next dev,
// the API answered by this bench at /__api), at 374 x 812, light then dark (C-43.18: the surface inside its real room).
//   §1 sign-up: "Who is signing up?", the ruled words; "Just me" opens "Launching soon", never a dead link.
//   §2 the request page: the vendor's Instagram is a link (https, new tab, noopener noreferrer); NO phone and no email.
//   §3 the partner page: every handle and website an anchor with the right address; the fee line, verbatim; a partner
//      the server does not return reads "This page does not exist." r4 (the founder's words, 7 Oct 2026): with check_words
//      null (the switch off, as A2-1's server sends) NO mark and no empty tag is drawn; with "Verified" the mark is drawn,
//      a 44px target, and a tap opens what it means and what it does not.
//   §4 Contacts: a Stopped row draws NO WhatsApp and NO Call (no wa.me, no tel: inside it) and keeps its Instagram link;
//      a row not stopped draws both (the control).
//   §5 Partners: each row's handle and website are anchors; the sheet's people carry WhatsApp and Call; the connections line.
//   §6 Forward a request: Send is refused without "She asked for this" in the ruled words; each person's sheet has the
//      message in its own CopyBox (R-46.17: the box holds the text and its one control, nothing else), Open on Instagram
//      and Open on Threads (outside links in a new tab) and "I sent it".
//   §7 the main page: "Partner with The Dream Wedding" is an anchor to /partner/join, read from the source (mock mode redirects '/').
//   §8 the partner area: no mark when check_words is null; Settings' links; the partner page link in its own CopyBox with
//      Open beside it (R-46.17); the calls footnote verbatim. §5 also: the admin's tabs and tags read Unverified / Verified.
//   §10 THIN ANSWERS (the chair's lesson 2): every PTN page drawn against { ok: true } with no lists draws its own empty
//      or first state and throws no page error.
//   §9 everywhere above: no visible text outside an anchor reads as a handle or a website (the founder's rule).
// --mutate: M1 ContactRow made to pass the phone on a Stopped row -> §4 reddens; M2 the mark's null guard dropped -> §3.2
// reddens (an empty tag drawn); each file restored byte for byte.
// e-277: the run STOPS before its first cell if the mutation anchor is already in ContactRow.tsx.
// One BOUNDED stop for the server and the browser on every exit path (e-275); every wait is on the thing itself, bounded. Runs bare (no key, no live call). THE EXIT CODE IS THE VERDICT.
process.env.PORT = process.env.PORT || '4310';
const path = require('path'); const fs = require('fs'); const crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..');
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const { stopTree } = require(path.join(ROOT, 'scripts/lib/stop_tree.js'));
const PORT = +process.env.PORT;
const MUT = process.argv.includes('--mutate');
let pass = 0, fail = 0; const failed = [];
const ok = (c, name, info) => { if (c) { pass++; console.log('  PASS  ' + name); } else { fail++; failed.push(name); console.log('  FAIL  ' + name + (info === undefined ? '' : '  [' + String(info).slice(0, 260) + ']')); } };
const FEE = 'This partner may charge its own fees. TDW takes no fee and has no part in it.';

const ORG = { id: 'o1', name: 'Model Connect', kind: 'model_agency', kind_words: 'Model agency', instagram_handle: 'modelconnect.in', instagram_url: 'https://www.instagram.com/modelconnect.in/', website: 'https://modelconnect.in/', website_url: 'https://modelconnect.in/', cities: ['Delhi NCR'], wants: ['calls'], calls_email: 'bookings@modelconnect.in', send_state: 'active', check_state: 'unchecked', check_words: null, plan_state: 'free' };
const CONTACTS = [
  { id: 'c1', name: 'Model Connect', kind: 'agency', how_we_know: 'Met at a show', phone: '+919811100021', knows_tdw: true, stopped: false, instagram_handle: 'modelconnect.in', instagram_url: 'https://www.instagram.com/modelconnect.in/', website_url: 'https://modelconnect.in/' },
  { id: 'c2', name: 'Neha Kapoor', kind: 'stylist', how_we_know: 'Sent by a vendor we know', phone: '+919811100032', knows_tdw: false, stopped: true, instagram_handle: 'neha.styles', instagram_url: 'https://www.instagram.com/neha.styles/', website_url: null },
];
const ROW = { ...ORG, hidden_by_reports: false, reports_open: 0, connections_line: 'Connections: 2 of 3 free used. Plan: none yet. After the 3rd, Rs 2,999 a month.', blocked_reason: null, created_at: '2026-10-06T00:00:00Z' };
const RECIP = { id: 'r1', contact: CONTACTS[0], sent_at: null, link: 'https://thedreamwedding.in/request/TOKEN', message: 'Hello Model Connect. Aanya Makeup Studio, a makeup artist on The Dream Wedding, needs a model in Delhi NCR on 18 October 2026. Budget Rs 3,000 to Rs 5,000. Paid. See the request and answer here: https://thedreamwedding.in/request/TOKEN', instagram_url: 'https://www.instagram.com/modelconnect.in/', threads_url: 'https://www.threads.com/@modelconnect.in' };
let THIN = false;   // §10: every door answers { ok: true } and nothing else
function answer(method, route) {
  if (THIN) return [200, { ok: true }];
  if (route === '/api/v2/public/partner/p/marked.in') return [200, { ok: true, partner: { name: 'Kaveri House', kind_words: 'Fashion house', cities: ['Jaipur'], instagram_handle: 'marked.in', instagram_url: 'https://www.instagram.com/marked.in/', website_url: null, check_words: 'Verified', fee_line: FEE } }];
  if (route === '/api/v2/public/partner/request/TOKEN') return [200, { ok: true, ended: false, request: { vendor: { name: 'Aanya Makeup Studio', trade: 'makeup artist', instagram_url: 'https://www.instagram.com/aanya.mua/', instagram_handle: 'aanya.mua' }, need: 'model', city: 'Delhi NCR', date_words: '18 October 2026', budget_words: 'Rs 3,000 to Rs 5,000', pay_words: 'Paid', note: 'Half a day.', phone_line: "The vendor's phone number is shared only when the vendor chooses to contact you." } }];
  if (route === '/api/v2/public/partner/p/modelconnect.in') return [200, { ok: true, partner: { name: ORG.name, kind_words: ORG.kind_words, cities: ORG.cities, instagram_handle: ORG.instagram_handle, instagram_url: ORG.instagram_url, website_url: ORG.website_url, check_words: ORG.check_words, fee_line: FEE } }];
  if (route.startsWith('/api/v2/public/partner/p/')) return [404, { ok: false, error: 'This partner page does not exist.' }];
  if (route === '/api/v2/partner/me') return [200, { ok: true, name: 'Priya Mehta', partner: ORG, role: 'owner', people: [{ name: 'Priya Mehta', phone: '+919811100021', role: 'owner' }] }];
  if (route === '/api/v2/admin/partners/contacts') return [200, { ok: true, contacts: CONTACTS }];
  if (route === '/api/v2/admin/partners/forward' && method === 'POST') return [200, { ok: true, request: {}, recipients: [RECIP] }];
  if (route === '/api/v2/admin/partners/' || route === '/api/v2/admin/partners') return [200, { ok: true, tab: 'unchecked', counts: { unchecked: 1, checked: 0, blocked: 0 }, partners: [ROW] }];
  if (route === '/api/v2/admin/partners/o1') return [200, { ok: true, partner: ROW, people: [{ name: 'Priya Mehta', phone: '+919811100021', role: 'owner' }], reports: [] }];
  if (route.startsWith('/api/v2/admin/')) return [200, { ok: true }];
  if (route.startsWith('/api/v2/vendor/')) return [200, { ok: true }];
  return [200, { ok: true }];
}

async function launch() {
  const usable = (p) => { try { return !!p && fs.statSync(p).isFile(); } catch (_e) { return false; } };
  let bin = usable(process.env.CHROME_BIN) ? process.env.CHROME_BIN : null;
  if (!bin) for (const c of ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium']) if (usable(c)) { bin = c; break; }
  if (!bin) { try { const mod = await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js')); const c = mod.default || mod; const p = await c.executablePath(); if (usable(p)) bin = p; } catch (_e) { /* none */ } }
  const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
  return puppeteer.launch({ executablePath: bin, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// e-275: no cell rests on a fixed pause. until() waits on the thing itself, polling, with a bound; it returns whether it came.
async function until(p, fn, arg, ms = 60000) { const end = Date.now() + ms; while (Date.now() < end) { try { if (await p.evaluate(fn, arg)) return true; } catch (_e) { /* navigating */ } await sleep(100); } return false; }
const hasSel = (s) => !!document.querySelector(s);
const hasText = (t) => document.body && document.body.innerText.includes(t);
// e-275: teardown is bounded; past the limit the process tree is killed and the verdict still prints.
const bounded = (pr, ms) => Promise.race([pr, new Promise((r) => setTimeout(() => r('TIMEOUT'), ms))]);
async function open(b, route, mode, wait, { admin = false, partner = false } = {}) {
  const ctx = await b.createBrowserContext(); const p = await ctx.newPage(); p.__ctx = ctx;
  p.__errs = []; p.on('pageerror', (e) => p.__errs.push(String(e && e.message || e).slice(0, 160)));
  await p.setViewport({ width: 374, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: mode }]);
  for (const name of ['tdw_wl_mode', 'tdw_adm_mode']) await p.setCookie({ name, value: mode, domain: 'localhost', path: '/' });
  await p.evaluateOnNewDocument((admin, partner) => { try { if (admin) { localStorage.setItem('admin_session_token', 'x.y'); localStorage.setItem('admin_session_expires', String(Date.now() + 864e5)); } if (partner) localStorage.setItem('tdw_partner_token', 'p.t'); } catch (_e) { /* */ } }, admin, partner);
  await p.setRequestInterception(true);
  p.on('request', (r) => { const u = r.url(); if (!u.includes('/__api/')) return r.continue(); const rt = u.split('/__api')[1].split('?')[0]; const [s, body] = answer(r.method(), rt); r.respond({ status: s, contentType: 'application/json', body: JSON.stringify(body) }); });
  await p.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'domcontentloaded', timeout: 240000 });
  if (!(await until(p, hasSel, wait, 120000))) throw new Error(`${route} (${mode}): ${wait} never appeared in 120 s`);
  // A tap before React hydrates does nothing (the 20-run proof, 7 Oct 2026: §1.3 red in 8 of 8 runs once the fixed pause
  // was gone). So wait on hydration itself: React has attached its props to the waited-for element.
  if (!(await until(p, (s) => { const e = document.querySelector(s); return !!e && Object.keys(e).some((k) => k.startsWith('__reactProps')); }, wait, 60000)))
    throw new Error(`${route} (${mode}): ${wait} was never hydrated in 60 s`);
  await p.evaluate(() => document.fonts.ready);
  return p;
}
const close = (p) => p.__ctx.close();
const anchorsOf = (p, scope = 'body') => p.evaluate((sc) => [...document.querySelectorAll(`${sc} [data-ext-link]`)].map((a) => ({ t: a.textContent.trim(), h: a.getAttribute('href'), tg: a.getAttribute('target'), rel: a.getAttribute('rel') })), scope);
const plainLinks = (p, scope) => p.evaluate((sc) => [...document.querySelectorAll(`${sc} *`)].filter((e) => e.children.length === 0 && e.getBoundingClientRect().height > 0 && !e.closest('a') && !e.closest('input')
  && /(^|\s)@[A-Za-z0-9._]{2,}\b|\b[a-z0-9-]+\.(in|com)\b/.test(e.textContent || '') && !/@[^\s]+\.(in|com)\b/.test(e.textContent || '')).map((e) => e.textContent.trim().slice(0, 80)), scope);
const goodAnchor = (a) => /^https:\/\//.test(a.h) && a.tg === '_blank' && a.rel === 'noopener noreferrer';

// e-277: before the first cell, no mutation anchor may already sit in the production file (a run killed mid-mutation).
{
  const cr = path.join(ROOT, 'app/admin/_components/ContactRow.tsx');
  const txt = fs.existsSync(cr) ? fs.readFileSync(cr, 'utf8') : '';
  // The --mutate parent plants the anchor on purpose and names its child with B291_MUT_CHILD=1; only that child is exempt.
  if (process.env.B291_MUT_CHILD !== '1' && (txt.includes('phone={c.phone}') || !txt.includes('phone={c.stopped ? undefined : c.phone}'))) {
    console.log('STOP — a mutation anchor is already present (or the guard is missing) in app/admin/_components/ContactRow.tsx; restore it with git checkout before running b291.');
    process.exit(1);
  }
}
const MARK_FILE = path.join(ROOT, 'components/partner/Mark.tsx');
const MARK_GUARD = "  if (typeof words !== 'string' || !words.trim()) return null;\n";
if (process.env.B291_MUT_CHILD !== '1' && !(fs.existsSync(MARK_FILE) && fs.readFileSync(MARK_FILE, 'utf8').includes(MARK_GUARD))) {
  console.log('STOP — the mark\'s null guard is missing from components/partner/Mark.tsx (a run killed mid-mutation?); restore it with git checkout before running b291.');
  process.exit(1);
}
if (MUT) {
  const file = path.join(ROOT, 'app/admin/_components/ContactRow.tsx');
  const orig = fs.readFileSync(file, 'utf8');
  const target = 'phone={c.stopped ? undefined : c.phone}';
  if (!orig.includes(target)) { console.log('MUTATION TARGET NOT FOUND'); process.exit(1); }
  fs.writeFileSync(file, orig.replace(target, 'phone={c.phone}'));
  let red = false;
  try { const r = require('child_process').spawnSync(process.execPath, [__filename, '--only=contacts'], { encoding: 'utf8', env: { ...process.env, PORT: String(PORT + 1), B291_MUT_CHILD: '1' } }); red = r.status !== 0 && /FAIL  §4\.1/.test(r.stdout); if (!red) console.log(r.stdout.slice(-1500)); }
  finally { fs.writeFileSync(file, orig); }
  ok(red, 'M1 ContactRow passing the phone on a Stopped row reddens §4.1');
  ok(crypto.createHash('sha256').update(fs.readFileSync(file, 'utf8')).digest('hex') === crypto.createHash('sha256').update(orig).digest('hex'), 'M1 ContactRow restored byte for byte');
  {
    const orig2 = fs.readFileSync(MARK_FILE, 'utf8'); let red2 = false;
    fs.writeFileSync(MARK_FILE, orig2.replace(MARK_GUARD, ''));
    try { const r = require('child_process').spawnSync(process.execPath, [__filename, '--only=mark'], { encoding: 'utf8', env: { ...process.env, PORT: String(PORT + 2), B291_MUT_CHILD: '1' } }); red2 = r.status !== 0 && /FAIL  §3\.2/.test(r.stdout); if (!red2) console.log(r.stdout.slice(-1500)); }
    finally { fs.writeFileSync(MARK_FILE, orig2); }
    ok(red2, 'M2 the mark\'s null guard dropped reddens §3.2 (an empty tag drawn)');
    ok(crypto.createHash('sha256').update(fs.readFileSync(MARK_FILE, 'utf8')).digest('hex') === crypto.createHash('sha256').update(orig2).digest('hex'), 'M2 Mark.tsx restored byte for byte');
  }
  console.log(`\nb291 --mutate: ${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
}
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7);

(async () => {
  let server = null, b = null, bpid = null;
  try {
    server = await dev.start(ROOT, PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` });
    if (!(await server.up())) { ok(false, 'the dev server came up'); return; }
    b = await launch(); bpid = b.process() && b.process().pid;
    if (ONLY === 'mark') {
      const p = await open(b, '/partner/p/modelconnect.in', 'light', '[data-partner-public]');
      const pt = await p.evaluate(() => document.querySelector('[data-partner-public]').textContent);
      const tags3 = await p.evaluate(() => ({ mark: !!document.querySelector('[data-partner-mark]'), empty: [...document.querySelectorAll('[data-partner-public] .px-tag')].filter((e) => !e.textContent.trim()).length }));
      ok(pt.includes(FEE) && !tags3.mark && tags3.empty === 0, '§3.2 the fee line verbatim; check_words null: NO mark, no empty tag (light)', JSON.stringify(tags3));
      await close(p); return;
    }
    for (const mode of (ONLY ? ['light'] : ['light', 'dark'])) {
      console.log(`\n── ${mode} ──`);
      if (ONLY && ONLY !== 'contacts') continue;
      if (!ONLY) {
        let p = await open(b, '/partner/join', mode, '[data-step="who"]');
        const who = await p.evaluate(() => document.querySelector('[data-step="who"]').innerText);
        ok(/Who is signing up\?/.test(who) && /Signing up is free\. Your first 3 connections are free\. After that it is Rs 2,999 a month\./.test(who), `§1.1 sign-up words (${mode})`);
        ok(/Just me/.test(who) && /For a freelance stylist, model or photographer\. You will join Collab Hub\./.test(who), `§1.2 "Just me" line verbatim (${mode})`);
        await p.click('[data-just-me]'); await until(p, hasSel, '[data-step="soon"]', 10000);
        ok(await p.evaluate(() => !!document.querySelector('[data-step="soon"]') && /Launching soon/.test(document.body.innerText)), `§1.3 "Just me" opens "Launching soon" (${mode})`);
        await close(p);
        p = await open(b, '/request/TOKEN', mode, '[data-request-page]');
        const req = await p.evaluate(() => document.querySelector('[data-request-page]').innerText);
        const ra = await anchorsOf(p, '[data-request-page]');
        ok(ra.length === 1 && ra[0].h === 'https://www.instagram.com/aanya.mua/' && goodAnchor(ra[0]), `§2.1 the vendor's Instagram is a link (${mode})`, JSON.stringify(ra));
        ok(!/9811|\+91|@[^\s]+\.(com|in)/.test(req.replace("The vendor's phone number is shared only when the vendor chooses to contact you.", '')), `§2.2 no phone and no email on the request page (${mode})`);
        ok((await plainLinks(p, '[data-request-page]')).length === 0, `§9.1 no plain handle or site on the request page (${mode})`, JSON.stringify(await plainLinks(p, '[data-request-page]')));
        await close(p);
        p = await open(b, '/partner/p/modelconnect.in', mode, '[data-partner-public]');
        const pa = await anchorsOf(p, '[data-partner-public]');
        ok(pa.some((a) => a.h === 'https://www.instagram.com/modelconnect.in/' && a.t === '@modelconnect.in') && pa.some((a) => a.h === 'https://modelconnect.in/') && pa.every(goodAnchor), `§3.1 the partner page's handle and website are links (${mode})`, JSON.stringify(pa));
        const pt = await p.evaluate(() => document.querySelector('[data-partner-public]').textContent);   // textContent: the label is uppercased by CSS
        const tags3 = await p.evaluate(() => ({ mark: !!document.querySelector('[data-partner-mark]'), empty: [...document.querySelectorAll('[data-partner-public] .px-tag')].filter((e) => !e.textContent.trim()).length }));
        ok(pt.includes(FEE) && !tags3.mark && tags3.empty === 0 && !/checked by TDW|Verified|Unverified/i.test(pt), `§3.2 the fee line verbatim; check_words null: NO mark, no empty tag (${mode})`, JSON.stringify(tags3));
        ok((await plainLinks(p, '[data-partner-public]')).length === 0, `§9.2 no plain handle or site on the partner page (${mode})`, JSON.stringify(await plainLinks(p, '[data-partner-public]')));
        await close(p);
        p = await open(b, '/partner/p/marked.in', mode, '[data-partner-mark]');
        const m3 = await p.evaluate(() => { const t = document.querySelector('[data-mark-tap]'); const r = t.getBoundingClientRect(); return { words: t.textContent.trim(), h: r.height, open: !!document.querySelector('[data-mark-means]') }; });
        await p.click('[data-mark-tap]'); await until(p, hasSel, '[data-mark-means]', 10000);
        const means = await p.evaluate(() => { const d = document.querySelector('[data-mark-means]'); return d ? d.textContent : ''; });
        ok(m3.words === 'Verified' && m3.h >= 44 && !m3.open && means.includes('Verified means TDW has seen that the organisation is real: its own website or Instagram, and a call with a named person there.')
          && means.includes('It does not mean TDW vouches for its work, its fees or its people.'), `§3.4 "Verified": the mark, a 44px target; a tap opens what it means and what it does not (${mode})`, JSON.stringify({ m3, means }));
        await close(p);
        p = await open(b, '/partner/p/nobody.here', mode, 'section');
        await until(p, hasText, 'This page does not exist.', 30000);
        ok(/This page does not exist\./.test(await p.evaluate(() => document.body.innerText)), `§3.3 a partner the server does not return does not exist (${mode})`);
        await close(p);
      }
      let p = await open(b, '/admin/partners/contacts', mode, '[data-contact-row]', { admin: true });
      const rows = await p.evaluate(() => [...document.querySelectorAll('[data-contact-row]')].map((d) => { const row = d.parentElement; return { stopped: d.getAttribute('data-stopped'), wa: !!row.querySelector('a[href*="wa.me"]'), tel: !!row.querySelector('a[href^="tel:"]'), ig: !!row.querySelector('[data-ext-link][href^="https://www.instagram.com/"]') }; }));
      const st = rows.find((r) => r.stopped === 'true'); const live = rows.find((r) => r.stopped === 'false');
      ok(!!st && !st.wa && !st.tel, `§4.1 a Stopped contact has no WhatsApp and no Call (${mode})`, JSON.stringify(rows));
      ok(!!st && st.ig, `§4.2 a Stopped contact keeps its Instagram link (${mode})`);
      ok(!!live && live.wa && live.tel && live.ig, `§4.3 control: a contact not stopped has WhatsApp, Call and Instagram (${mode})`, JSON.stringify(rows));
      await close(p);
      if (ONLY) continue;
      p = await open(b, '/admin/partners', mode, '[data-partner-links]', { admin: true });
      const la = await anchorsOf(p, '[data-partner-links]');
      ok(la.some((a) => a.t === '@modelconnect.in' && a.h === 'https://www.instagram.com/modelconnect.in/') && la.some((a) => a.h === 'https://modelconnect.in/') && la.every(goodAnchor), `§5.1 each partner row's handle and website are links (${mode})`, JSON.stringify(la));
      const adm5 = await p.evaluate(() => document.body.innerText);
      ok(/Unverified/.test(adm5) && /Verified/.test(adm5.replace(/Unverified/g, '')) && !/checked by TDW|Not yet checked/i.test(adm5), `§5.3 the admin's tabs and the row's tag read Unverified / Verified; no old words (${mode})`);
      await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /Model Connect/.test(x.innerText)); if (b) b.click(); });
      await until(p, hasSel, '[role=dialog]', 15000);
      const sheet = await p.evaluate(() => { const d = document.querySelector('[role=dialog]'); return d ? { text: d.innerText, wa: !!d.querySelector('a[href*="wa.me"]'), tel: !!d.querySelector('a[href^="tel:"]') } : null; });
      ok(!!sheet && sheet.wa && sheet.tel && /Connections: 2 of 3 free used\./.test(sheet.text) && /Mark as verified/.test(sheet.text) && !/Mark as checked/.test(sheet.text) && /Exempt from the plan/.test(sheet.text) && /Block/.test(sheet.text), `§5.2 the sheet: people with WhatsApp and Call, the connections line, the actions (${mode})`, sheet && sheet.text.slice(0, 200));
      await close(p);
      p = await open(b, '/admin/partners/forward', mode, '[data-asked]', { admin: true });
      await p.evaluate(() => { const c = document.querySelector('input[aria-label="Send to Model Connect"]'); if (c) c.click(); });
      await until(p, () => { const c = document.querySelector('input[aria-label="Send to Model Connect"]'); return !!c && c.checked; }, null, 10000);
      await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /Make the messages/.test(x.innerText)); if (b) b.click(); });
      await until(p, hasText, 'Tick "She asked for this" first.', 10000);
      ok(/Tick "She asked for this" first\./.test(await p.evaluate(() => document.body.innerText)), `§6.1 refused without "She asked for this", in the ruled words (${mode})`);
      await p.evaluate(() => { const c = document.querySelector('[data-asked] input'); if (c) c.click(); });
      await until(p, () => { const c = document.querySelector('[data-asked] input'); return !!c && c.checked; }, null, 10000);
      await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /Make the messages/.test(x.innerText)); if (b) b.click(); });
      await until(p, hasText, 'Send each one yourself', 15000);
      await p.evaluate(() => { const d = [...document.querySelectorAll('div')].find((x) => /Not sent yet\. Tap to open\./.test(x.innerText) && x.style.cursor === 'pointer'); if (d) d.click(); });
      await until(p, hasSel, '[role=dialog]', 15000);
      const fs6 = await p.evaluate(() => { const d = document.querySelector('[role=dialog]'); if (!d) return null; return { text: d.innerText, out: [...d.querySelectorAll('[data-ext-link]')].map((a) => ({ t: a.textContent.trim(), h: a.getAttribute('href'), tg: a.getAttribute('target'), rel: a.getAttribute('rel') })) }; });
      const box6 = await p.evaluate(() => { const bx = document.querySelector('[role=dialog] [data-copybox]'); if (!bx) return null; return { kids: bx.children.length, text: (bx.querySelector('[data-copytext]') || {}).textContent, ctl: (bx.querySelector('[data-copyctl]') || {}).textContent }; });
      ok(!!box6 && box6.kids === 2 && /^Hello Model Connect\./.test(box6.text || '') && box6.ctl === 'Copy message', `§6.4 R-46.17: the message sits in its own CopyBox, the text and its one control, nothing else (${mode})`, JSON.stringify(box6));
      ok(!!fs6 && /Copy message/.test(fs6.text) && /I sent it/.test(fs6.text) && /See the request and answer here: https:\/\/thedreamwedding\.in\/request\/TOKEN/.test(fs6.text), `§6.2 the sheet: the message, Copy message and "I sent it" (${mode})`, fs6 && fs6.text.slice(0, 200));
      ok(!!fs6 && fs6.out.some((a) => a.t === 'Open on Instagram' && a.h === 'https://www.instagram.com/modelconnect.in/') && fs6.out.some((a) => a.t === 'Open on Threads' && a.h === 'https://www.threads.com/@modelconnect.in') && fs6.out.every(goodAnchor), `§6.3 Open on Instagram and Open on Threads open in a new tab (${mode})`, fs6 && JSON.stringify(fs6.out));
      await close(p);
      // §7 is read from the source, not drawn: under NEXT_PUBLIC_USE_MOCKS the main page finds the mock vendor session
      // (lib/vendor/session.ts getVendorSession) and redirects before it paints. b20_a4 counts the same file's elements.
      if (mode === 'light') {
        const land = fs.readFileSync(path.join(ROOT, 'app/(landing)/page.tsx'), 'utf8');
        const at = land.indexOf('data-partner-entry');
        const plan = land.indexOf('<a href="/plan"');
        ok(at > 0 && /<a href="\/partner\/join" style=\{ENTRY_LINE_VERB\} data-partner-entry="">Partner with The Dream Wedding &#8594;<\/a>/.test(land) && plan > 0 && at > plan && at - plan < 1200, '§7.1 the main page carries "Partner with The Dream Wedding", an anchor to /partner/join, under the /plan line (source)');
      }
      p = await open(b, '/partner', mode, '[data-partner-area]', { partner: true });
      const area = await p.evaluate(() => document.querySelector('[data-partner-area]').textContent);
      const tags8 = await p.evaluate(() => ({ mark: !!document.querySelector('[data-partner-mark]'), empty: [...document.querySelectorAll('[data-partner-area] .px-tag')].filter((e) => !e.textContent.trim()).length }));
      ok(!tags8.mark && tags8.empty === 0 && !/checked by TDW|Verified|Unverified/i.test(area) && /Calls for you/.test(area) && area.includes('Calls come to you, not to your people. For each person you suggest, TDW keeps only their name, role and profile link. TDW never contacts them.'), `§8.1 the area: no mark while check_words is null, no empty tag; Calls for you, the footnote verbatim (${mode})`);
      await p.evaluate(() => { const b = [...document.querySelectorAll('[data-partner-area] button')].find((x) => x.innerText.trim() === 'Settings'); if (b) b.click(); });
      await until(p, hasSel, '[data-settings] [data-ext-link]', 15000);
      const sa = await anchorsOf(p, '[data-settings]');
      ok(sa.some((a) => a.h === 'https://www.instagram.com/modelconnect.in/') && sa.some((a) => a.h === 'https://modelconnect.in/') && sa.every(goodAnchor), `§8.2 Settings: the handle and website are links (${mode})`, JSON.stringify(sa));
      const box8 = await p.evaluate(() => { const bx = document.querySelector('[data-settings] [data-copybox]'); if (!bx) return null; const open = [...document.querySelectorAll('[data-settings] a')].find((a) => a.textContent.trim() === 'Open your partner page');
        return { kids: bx.children.length, text: (bx.querySelector('[data-copytext]') || {}).textContent, ctl: (bx.querySelector('[data-copyctl]') || {}).textContent, open: open ? open.getAttribute('href') : null, openInside: !!(open && bx.contains(open)) }; });
      ok(!!box8 && box8.kids === 2 && box8.text === 'thedreamwedding.in/partner/p/modelconnect.in' && box8.ctl === 'Copy' && box8.open === '/partner/p/modelconnect.in' && !box8.openInside,
        `§8.3 R-46.17: the partner page link in its own CopyBox; "Open your partner page" beside it, outside the box (${mode})`, JSON.stringify(box8));
      await close(p);
    }
    if (!ONLY) {
      console.log('\n── §10 thin answers ──');
      THIN = true;
      const THINS = [['/partner/p/modelconnect.in', 'section', {}, 'This page does not exist.'], ['/request/TOKEN', 'section', {}, null], ['/partner', '[data-step="org"]', { partner: true }, null],
        ['/admin/partners', 'h1', { admin: true }, 'No partners here.'], ['/admin/partners/contacts', 'h1', { admin: true }, null], ['/admin/partners/forward', '[data-asked]', { admin: true }, null]];
      for (const [route, sel, who, text] of THINS) {
        let res = null;
        try { const p = await open(b, route, 'light', sel, who); if (text) await until(p, hasText, text, 30000);
          res = { drew: await p.evaluate((s) => !!document.querySelector(s), sel), text: text ? await p.evaluate((t) => document.body.innerText.includes(t), text) : true, errs: p.__errs.slice() }; await close(p); }
        catch (e) { res = { drew: false, error: String(e && e.message).slice(0, 160) }; }
        ok(res.drew && res.text && (!res.errs || res.errs.length === 0), `§10 ${route} against { ok: true }: draws its own state, no page error`, JSON.stringify(res));
      }
      THIN = false;
    }
  } catch (e) { ok(false, 'the bench ran to its end', e && e.stack); }
  finally {
    if (b) { try { await bounded(b.close(), 15000); } catch (_e) { /* */ } if (bpid) stopTree(bpid); }
    if (server) { try { await bounded(server.stop(), 30000); } catch (_e) { /* */ } }
    console.log(`\nb291: ${pass} passed, ${fail} failed${fail ? '\nFAILED: ' + failed.join(' | ') : ''}`);
    process.exit(fail ? 1 : 0);
  }
})();
