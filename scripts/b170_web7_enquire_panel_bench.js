#!/usr/bin/env node
'use strict';
// scripts/b170_web7_enquire_panel_bench.js · TDW CE-47 · WEB-7 · rung b170 · the enquiry panel on a vendor's website and
// the client's page for kind words (/kind-words/<token>).
//
// §1 SOURCE (comments stripped): the three doors by their exact paths; the approved lines verbatim; no "Eliza" in any
//    string the visitor sees; no cookie or browser storage on the panel or the client's page; the client's page is a
//    route handler answering text/html with no React; the country table is countries-list's 252 countries (258 rows: DO, XK and PR carry more than one dial code), India, then the
//    six, then A to Z.
// §2 GLASS, headless Chromium against a plain host page (a cover, a data-enquire control, the card as JSON) served
//    with the doors answered by this bench on the same origin:
//    2.1 THE FIRST PAINT: no request for the panel's CSS or script starts before the load event, and first paint
//        happens before either.
//    2.2 The whole walk: occasion, date answered free, name and number, the enquiry body exactly as the contract,
//        the thank-you, the hand-off built on enquire_link, "Coming soon", free text with its token, the replies.
//    2.3 Every answer that is not free (held, booked, 404, 429, failure) says "will confirm".
//    2.4 Basic's card: no date check, an optional Date field, no call step.
//    2.5 Another country: the picker, E.164, and the other-country error line.
//    2.6 The client's page, transpiled and drawn: the form, a 400 line drawn as sent, 404's one line, the thank-you,
//        no cookie and no storage.
// §3 MUTATION (--mutate): the boot made to load the panel at once; 2.1 must go red. Restored by sha.
const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const P = (rel) => path.join(ROOT, rel);
const read = (f) => fs.readFileSync(P(f), 'utf8');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const { stripComments } = require('./lib/stripComments.cjs');
let pass = 0, fail = 0;
const cell = (name, why) => { if (!why) { pass++; console.log('GREEN ' + name); } else { fail++; console.log('RED   ' + name + ' \u2014 ' + why); } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PANEL_JS = 'public/site/enquire-panel.js';
const PANEL_CSS = 'public/site/enquire-panel.css';
const BOOT = 'lib/site/enquirePanelBoot.ts';
const ROUTE = 'app/kind-words/[token]/route.ts';
const LINES = [
  "Hello, you've reached ${studio()}.", 'What is the occasion?', 'Which date is the ${st.occasion.toLowerCase()}?',
  '${studio()} is free on ${longDate(st.date)}.', '${studio()} will confirm ${longDate(st.date)} with you.',
  'Leave your name and number and ${studio()} will get back to you.', 'Thank you, ${st.name}. ${studio()} has your enquiry.',
  'Continue on WhatsApp', 'Would you like a call with ${studio()}?', 'Coming soon', 'Write a message', 'Name the occasion',
  'Please add your name.', 'Please add a 10-digit mobile number.', 'Please add your mobile number.', 'Search country or code',
  'Your name and number go to ${studio()} through The Dream Wedding, only to answer this enquiry. ', 'Enquiries',
];

function source() {
  const js = stripComments(read(PANEL_JS));
  cell('1.1 the enquiry door by its exact path', js.includes('/api/v2/public/site-enquiry/${encodeURIComponent(CARD.code)}') ? null : 'site-enquiry path missing');
  cell('1.2 the chat door by its exact path, keyed by the token', js.includes('/api/v2/public/site-chat/${encodeURIComponent(CARD.code)}') && js.includes('{chat_token:st.token,text:v}') ? null : 'site-chat path or token body missing');
  cell('1.3 the date-check reader by its exact path', js.includes('/api/v2/public/availability/${encodeURIComponent(CARD.code)}/${i.value}') ? null : 'availability path missing');
  const missing = LINES.filter((l) => !js.includes(l));
  cell('1.4 the approved lines verbatim (' + LINES.length + ')', missing.length ? 'missing: ' + missing.join(' | ') : null);
  const strings = (js.match(/'[^'\n]*'|`[^`\n]*`|"[^"\n]*"/g) || []).filter((s) => /eliza/i.test(s) && !/\[data-eliza\]/.test(s));
  cell('1.5 no "Eliza" in any string the panel draws', strings.length ? strings.join(' ') : null);
  const route = stripComments(read(ROUTE));
  const store = /localStorage|sessionStorage|document\.cookie|indexedDB/;
  cell('1.6 no cookie or browser storage in the panel or the client\'s page', store.test(js) || store.test(route) ? 'storage or cookie touched' : null);
  cell('1.7 the client\'s page answers text/html, no React, no store', /from ['"]react['"]|jsx|tsx/.test(route) ? 'React on the page' :
    /'content-type': 'text\/html; charset=utf-8'/.test(route) && /'cache-control': 'no-store'/.test(route) ? null : 'headers missing');
  const m = js.match(/const CC=(\[\[.*?\]\]);/s);
  let rows = null; try { rows = JSON.parse(m[1]); } catch (_) { /* red below */ }
  const top = rows && rows.slice(0, 7).map((r) => r[0]).join(',');
  const rest = rows && rows.slice(7).map((r) => r[1]);
  const sorted = rest && [...rest].sort((a, b) => a.localeCompare(b, 'en'));
  // WEB-8 (MERGED): countries-list 3.4.1 has 252 countries; three carry more than one dial code, so the table is 258 rows.
  cell('1.8 every country: 252 countries in 258 rows (DO, XK, PR have more than one code), IN AE GB US CA AU SG first, then A to Z', !rows ? 'table unreadable' : rows.length !== 258 ? 'rows ' + rows.length :
    new Set(rows.map((r) => r[0])).size !== 252 ? 'countries ' + new Set(rows.map((r) => r[0])).size :
    top !== 'IN,AE,GB,US,CA,AU,SG' ? 'first seven ' + top : JSON.stringify(rest) !== JSON.stringify(sorted) ? 'not A to Z' : null);
  const css = read(PANEL_CSS);
  cell('1.9 the panel sits at z-index 85, above every decorative layer (at most 80)', /\.w7\{position:fixed;z-index:85;/.test(css) ? null : 'z-index not 85');
}

function bootString() {
  const s = read(BOOT);
  const expr = s.slice(s.indexOf('export const PANEL_BOOT =') + 'export const PANEL_BOOT ='.length, s.lastIndexOf(';'));
  const body = 'return (' + expr + ');';
  // eslint-disable-next-line no-new-func
  return new Function('PANEL_CSS', 'PANEL_JS', body)('/site/enquire-panel.css', '/site/enquire-panel.js');
}

// the host page and the doors, one origin
const STATE = { doorOff: false, availability: [200, { ok: true, blocked: false, sold: false, any_held: false }], enquiry: [], chat: [], card: null, t: {} };
function host(card) {
  const cover = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="#2b2622"/></svg>';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>host</title><style>:root{--bg:#fbf8f3;--ink:#1a1714;--mute:#5d5750;--line:#ddd5c8;--soft:#efe9df;--serif:Georgia,serif;--sans:system-ui,sans-serif;--pad:20px;--br:0px}
body{margin:0;background:var(--bg);color:var(--ink);font:16px var(--sans)}.cover{height:100vh;background:url("data:image/svg+xml,${encodeURIComponent(cover)}") center/cover}</style></head>
<body><header><button data-enquire id="enq">Enquire</button></header><div class="cover"><img src="/cover.png" alt="" width="10" height="10"></div><p>Studio Ivara</p>
<script type="application/json" id="tdw-site-card">${JSON.stringify(card).replace(/</g, '\\u003c')}</script>
<script>${bootString()}</script></body></html>`;
}
const CARD = (over) => Object.assign({ code: 'IVARA7', handle: 'IVARA', studio_name: 'Studio Ivara', monogram: 'SI', category: 'makeup', date_check_enabled: true,
  eliza: { live_booking: 'coming_soon', own_voice: 'not_in_plan' }, enquire_link: 'https://wa.me/917982159047?text=TDW-IVARA', page: { kind: 'home' }, api_base: globalThis.__B170_API }, over || {});
let kindHtml = null;
const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x'); const t = Date.now();
  const send = (st, body, type) => { res.writeHead(st, { 'content-type': type || 'application/json' }); res.end(type ? body : JSON.stringify(body)); };
  if (u.pathname === '/host.html') { const card = STATE.card; if (u.searchParams.get('slow')) return setTimeout(() => send(200, host(card), 'text/html'), 10); return send(200, host(card), 'text/html'); }
  // the cover arrives slowly, as a real photograph does: first paint comes long before the load event
  if (u.pathname === '/cover.png') return setTimeout(() => { res.writeHead(200, { 'content-type': 'image/png' }); res.end(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64')); }, 400);
  if (u.pathname === '/site/enquire-panel.js') { STATE.t.js = t; return setTimeout(() => send(200, read(PANEL_JS), 'text/javascript'), 30); }
  if (u.pathname === '/site/enquire-panel.css') { STATE.t.css = t; return send(200, read(PANEL_CSS), 'text/css'); }
  if (u.pathname.startsWith('/api/v2/public/availability/')) return send(...STATE.availability);
  let data = ''; req.on('data', (c) => { data += c; });
  req.on('end', () => {
    if (u.pathname === '/api/v2/public/site-enquiry/IVARA7') { STATE.enquiry.push(JSON.parse(data || '{}')); if (STATE.doorOff) return send(404, { ok: false, error: 'not found' }); return send(200, { ok: true, chat_token: 'T'.repeat(43) }); }
    if (u.pathname === '/api/v2/public/site-chat/IVARA7') { STATE.chat.push(JSON.parse(data || '{}')); return send(200, { ok: true, replies: ['First reply.', 'Second reply.'] }); }
    if (u.pathname.startsWith('/kind-words/')) return send(200, kindHtml, 'text/html');
    if (u.pathname === '/api/v2/public/testimonial/' + 'K'.repeat(24)) {
      if (req.method === 'GET') return send(...STATE.testimonialGet);
      return send(...STATE.testimonialPost);
    }
    send(404, { ok: false });
  });
});

async function kindWordsHtml() {
  const ts = require(P('node_modules/typescript'));
  const src = read(ROUTE).replace("import { API_BASE } from '@/lib/api';", 'const API_BASE = globalThis.__B170_API;');
  const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const m = { exports: {} }; new Function('module', 'exports', out)(m, m.exports);
  const r = await m.exports.GET(new Request('http://x/kind-words/' + 'K'.repeat(24)), { params: Promise.resolve({ token: 'K'.repeat(24) }) });
  return { html: await r.text(), type: r.headers.get('content-type'), cache: r.headers.get('cache-control') };
}

(async () => {
  source();
  const mutate = process.argv.includes('--mutate');
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const ORIGIN = 'http://127.0.0.1:' + server.address().port;
  globalThis.__B170_API = ORIGIN;
  const puppeteer = require(P('node_modules/puppeteer-core'));
  // WEB-8 C1 (CE-47): the same order as docs/design/tools/harness.mjs browser(): CHROME_BIN, then /opt/pw-browsers, then @sparticuz/chromium.
  const usable = (p) => { try { return !!p && fs.statSync(p).isFile(); } catch (_e) { return false; } };
  let bin = process.env.CHROME_BIN;
  if (!usable(bin)) bin = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium'].find(usable);
  if (!usable(bin)) { const m = await import('@sparticuz/chromium'); bin = await (m.default || m).executablePath(); }
  if (process.env.B170_SAY_BROWSER) console.error('b170: browser = ' + bin);
  const b = await puppeteer.launch({ executablePath: bin, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const open = async (card, w) => {
    STATE.card = CARD(card); STATE.enquiry = []; STATE.chat = []; STATE.t = {};
    const pg = await b.newPage(); await pg.setViewport({ width: w || 374, height: 780, isMobile: true, hasTouch: true });
    const errs = []; pg.on('pageerror', (e) => errs.push(e.message)); pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await pg.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await pg.goto(ORIGIN + '/host.html', { waitUntil: 'load' });
    try { await pg.waitForFunction(() => !!window.__tdwEnquire, { timeout: 8000, polling: 50 }); } catch (e) { throw new Error('the panel never started: ' + errs.join(' | ')); }
    return pg;
  };
  const texts = (pg) => pg.evaluate(() => [...document.querySelectorAll('#w7M .w7s')].map((e) => e.textContent));
  const walkTo = async (pg, until) => {
    await pg.click('#enq'); await pg.waitForFunction(() => document.querySelectorAll('#w7M .w7chip').length > 0, { timeout: 8000, polling: 50 });
    await pg.evaluate(() => [...document.querySelectorAll('#w7M .w7chip')].find((x) => x.textContent === 'Wedding').click());
    if (until === 'occasion') return;
    await pg.waitForFunction(() => !!document.querySelector('#w7M input[type=date]') || !!document.querySelector('#w7M .w7f'), { timeout: 8000, polling: 50 });
    const hasCheck = await pg.evaluate(() => !!document.querySelector('#w7M input[type=date]:not(.w7f input)'));
    if (hasCheck) { await pg.evaluate(() => { const i = document.querySelector('#w7M .w7dt input[type=date]'); i.value = '2027-02-14'; i.form.requestSubmit(); }); }
    await pg.waitForFunction(() => !!document.querySelector('#w7M .w7f'), { timeout: 8000, polling: 50 });
  };
  try {
    // 2.1 the first paint
    {
      const pg = await open();
      const r = await pg.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0];
        const fp = (performance.getEntriesByType('paint').find((e) => e.name === 'first-paint') || {}).startTime;
        const res = performance.getEntriesByType('resource').filter((e) => /enquire-panel\.(js|css)$/.test(e.name)).map((e) => e.startTime);
        return { load: nav.loadEventStart, fp, first: Math.min(...res), n: res.length };
      });
      console.log('  first paint ' + Math.round(r.fp) + ' ms, load ' + Math.round(r.load) + ' ms, panel first request ' + Math.round(r.first) + ' ms (' + r.n + ' files)');
      cell('2.1 THE FIRST PAINT: the panel\'s files start after the load event and after first paint', r.n !== 2 ? 'panel files requested ' + r.n :
        !(r.first >= r.load) ? 'a panel file started before load' : !(r.fp <= r.first) ? 'first paint not before the panel' : null);
      await pg.close();
    }
    // 2.2 the whole walk
    {
      const pg = await open();
      await walkTo(pg);
      let t = await texts(pg);
      cell('2.2a greeting, occasion, date, free answer', JSON.stringify(t) === JSON.stringify(["Hello, you've reached Studio Ivara.", 'What is the occasion?', 'Which date is the wedding?', 'Studio Ivara is free on 14 February 2027.', 'Leave your name and number and Studio Ivara will get back to you.']) ? null : JSON.stringify(t));
      await pg.evaluate(() => { const f = document.querySelector('#w7M .w7f'); const [a, p] = f.querySelectorAll('input'); a.value = 'Ira'; p.value = '9625759924'; p.dispatchEvent(new Event('input')); });
      const grouped = await pg.evaluate(() => document.querySelectorAll('#w7M .w7f input')[1].value);
      await pg.evaluate(() => document.querySelector('#w7M .w7f').requestSubmit());
      await pg.waitForFunction(() => !document.querySelector('#w7Foot').hidden, { timeout: 8000, polling: 50 });
      const body = STATE.enquiry[0] || {};
      const want = { name: 'Ira', country: 'IN', phone_e164: '+919625759924', occasion: 'Wedding', page: { kind: 'home' }, consent: true, consent_version: 'enq-2026-09-30', date: '2027-02-14' };
      cell('2.2b +91 grouped 5-5 as typed', grouped === '96257 59924' ? null : grouped);
      cell('2.2c the enquiry body exactly as the contract', JSON.stringify(body) === JSON.stringify(want) ? null : JSON.stringify(body));
      const href = await pg.evaluate(() => document.querySelector('#w7M a.w7btn').href);
      const words = new URL(href).searchParams.get('text');
      cell('2.2d the hand-off built on enquire_link, the token first', href.startsWith('https://wa.me/917982159047?') && words === 'TDW-IVARA Hello Studio Ivara, I enquired on your website about Wedding on 14 February 2027.' ? null : href);
      t = await texts(pg);
      const soon = await pg.evaluate(() => { const c = [...document.querySelectorAll('#w7M .w7chip')].find((x) => x.textContent === 'Coming soon'); return c ? c.disabled : null; });
      cell('2.2e thank-you, the call question, "Coming soon" disabled', t.includes('Thank you, Ira. Studio Ivara has your enquiry.') && t.includes('Would you like a call with Studio Ivara?') && soon === true ? null : JSON.stringify(t) + ' soon ' + soon);
      await pg.evaluate(() => { const i = document.querySelector('#w7Free'); i.value = 'Do you travel to Jaipur?'; i.form.requestSubmit(); });
      await pg.waitForFunction(() => [...document.querySelectorAll('#w7M .w7s')].some((e) => e.textContent === 'Second reply.'), { timeout: 8000, polling: 50 }).catch(() => {});
      t = await texts(pg);
      cell('2.2f free text sent with the token only; both replies drawn in order', JSON.stringify(STATE.chat[0]) === JSON.stringify({ chat_token: 'T'.repeat(43), text: 'Do you travel to Jaipur?' }) && t.slice(-2).join('|') === 'First reply.|Second reply.' ? null : JSON.stringify(STATE.chat) + ' ' + JSON.stringify(t.slice(-2)));
      await pg.close();
    }
    // 2.3 every answer that is not free says "will confirm"
    for (const [label, ans] of [['held', [200, { ok: true, blocked: false, sold: false, any_held: true }]], ['booked', [200, { ok: true, blocked: false, sold: true, any_held: true }]],
      ['blocked', [200, { ok: true, blocked: true, sold: false, any_held: false }]], ['unknown', [200, { ok: true, blocked: null, sold: false, any_held: false }]],
      ['404', [404, { ok: false, code: 'not_found' }]], ['429', [429, { ok: false, code: 'rate_limited' }]], ['500', [500, {}]]]) {
      STATE.availability = ans; const pg = await open(); await walkTo(pg); const t = await texts(pg);
      cell('2.3 ' + label + ': "will confirm"', t.includes('Studio Ivara will confirm 14 February 2027 with you.') ? null : JSON.stringify(t)); await pg.close();
    }
    STATE.availability = [200, { ok: true, blocked: false, sold: false, any_held: false }];
    // 2.4 Basic
    {
      const pg = await open({ date_check_enabled: false, eliza: { live_booking: 'not_in_plan', own_voice: 'not_in_plan' } });
      await walkTo(pg);
      const r = await pg.evaluate(() => ({ check: !!document.querySelector('#w7M .w7dt input[type=date]'), date: !!document.querySelector('#w7M .w7f input[type=date]') }));
      await pg.evaluate(() => { const f = document.querySelector('#w7M .w7f'); const [a, p] = f.querySelectorAll('input'); a.value = 'Ira'; p.value = '9625759924'; f.requestSubmit(); });
      await pg.waitForFunction(() => !document.querySelector('#w7Foot').hidden, { timeout: 8000, polling: 50 });
      const t = await texts(pg);
      cell('2.4 Basic: no check, an optional Date field, no call step, no date sent when left empty', !r.check && r.date && !t.some((x) => /call with/.test(x)) && !('date' in (STATE.enquiry[0] || {})) ? null : JSON.stringify(r) + JSON.stringify(t));
      await pg.close();
    }
    // 2.5 another country
    {
      const pg = await open(); await walkTo(pg);
      await pg.evaluate(() => document.querySelector('#w7M .w7cc').click());
      await pg.evaluate(() => { const q = document.querySelector('#w7PkQ'); q.value = 'arab'; q.dispatchEvent(new Event('input')); });
      await pg.evaluate(() => [...document.querySelectorAll('#w7PkL button')].find((x) => x.firstChild.textContent === 'United Arab Emirates').click());
      await pg.evaluate(() => { const f = document.querySelector('#w7M .w7f'); const [a, p] = f.querySelectorAll('input'); a.value = 'Ira'; p.value = '50123'; p.dispatchEvent(new Event('input')); f.requestSubmit(); });
      const e1 = await pg.evaluate(() => document.querySelector('#w7M .w7err').textContent);
      await pg.evaluate(() => { const f = document.querySelector('#w7M .w7f'); const p = f.querySelectorAll('input')[1]; p.value = '501234567'; p.dispatchEvent(new Event('input')); f.requestSubmit(); });
      await pg.waitForFunction(() => !document.querySelector('#w7Foot').hidden, { timeout: 8000, polling: 50 }).catch(() => {});
      const body = STATE.enquiry[0] || {};
      cell('2.5 the picker, UAE, the other-country line, E.164', e1 === 'Please add your mobile number.' && body.country === 'AE' && body.phone_e164 === '+971501234567' ? null : e1 + ' ' + JSON.stringify(body));
      await pg.close();
    }
    // 2.5b WEB-8 (CE-47 ruling 4): the doors are OFF (the door answers 404): her WhatsApp link, never an error, never a dead button
    {
      STATE.doorOff = true; const pg = await open(); await walkTo(pg);
      await pg.evaluate(() => { const f = document.querySelector('#w7M .w7f'); const [a, p] = f.querySelectorAll('input'); a.value = 'Ira'; p.value = '9625759924'; p.dispatchEvent(new Event('input')); f.requestSubmit(); });
      await pg.waitForFunction(() => document.querySelector('#w7M a.w7btn'), { timeout: 8000, polling: 50 }).catch(() => {});
      const o = await pg.evaluate(() => { const a = document.querySelector('#w7M a.w7btn'); const e = document.querySelector('#w7M .w7err'); return { href: a ? a.href : '', label: a ? a.textContent : '', err: e ? e.textContent : '', text: document.querySelector('#w7M').innerText, foot: document.querySelector('#w7Foot').hidden }; });
      STATE.doorOff = false;
      cell('2.5b the doors OFF (404 on send): no error line; "Continue on WhatsApp" on her enquire_link; no chat box', o.href.startsWith('https://wa.me/917982159047?') && o.label === 'Continue on WhatsApp' && o.err === '' && !/could not be sent/.test(o.text) && /Please continue on WhatsApp to reach Studio Ivara\./.test(o.text) && o.foot === true ? null : JSON.stringify(o).slice(0, 400));
      await pg.close();
    }
    // 2.6 the client's page
    {
      const k = await kindWordsHtml(); kindHtml = k.html;
      cell('2.6a the client\'s page: text/html, no-store, no React in the document', k.type === 'text/html; charset=utf-8' && k.cache === 'no-store' && !/react|__next/i.test(k.html) ? null : k.type + ' ' + k.cache);
      const form = { ok: true, form: { studio_name: 'Studio Ivara', person_name: 'Ananya', video_allowed: false } };
      const run = async (post, w) => {
        STATE.testimonialGet = [200, form]; STATE.testimonialPost = post;
        const pg = await b.newPage(); await pg.setViewport({ width: w, height: 760, isMobile: true, hasTouch: true });
        await pg.goto(ORIGIN + '/kind-words/' + 'K'.repeat(24), { waitUntil: 'load' });
        await pg.waitForFunction(() => !!document.querySelector('form') || !!document.querySelector('.one:not(:empty)'), { timeout: 8000, polling: 50 });
        const before = await pg.evaluate(() => ({ h1: (document.querySelector('h1') || {}).textContent, name: (document.querySelector('input') || {}).value, video: !!document.querySelector('input[type=url]'), over: [...document.querySelectorAll('body *')].filter((e) => e.getBoundingClientRect().right > innerWidth + 0.5).length }));
        await pg.evaluate(() => { document.querySelector('textarea').value = 'Calm and kind all day.'; document.querySelector('.cons input').checked = true; document.querySelector('form').requestSubmit(); });
        await sleep(400);
        const after = await pg.evaluate(() => ({ err: (document.querySelector('.err') || {}).textContent || '', one: (document.querySelector('.one') || {}).textContent || '', h1: (document.querySelector('h1') || {}).textContent || '', cookie: document.cookie, ls: localStorage.length + sessionStorage.length }));
        await pg.close(); return { before, after };
      };
      for (const w of [360, 374]) {
        const a = await run([400, { ok: false, error: 'Choose the month of the wedding or occasion.' }], w);
        cell(`2.6b ${w}: the form (studio, name prefilled, no video field, nothing wider than the screen); a 400 drawn as sent`, a.before.h1 === 'Studio Ivara' && a.before.name === 'Ananya' && !a.before.video && a.before.over === 0 && a.after.err === 'Choose the month of the wedding or occasion.' ? null : JSON.stringify(a));
      }
      const g = await run([404, { ok: false, error: 'This link is not available.' }], 374);
      cell('2.6c a 404 on send: the one line, nothing else', g.after.one === 'This link is not available.' && !g.after.h1 ? null : JSON.stringify(g.after));
      const y = await run([200, { ok: true }], 374);
      cell('2.6d 200: the thank-you; no cookie, no storage', y.after.h1 === 'Thank you.' && y.after.cookie === '' && y.after.ls === 0 ? null : JSON.stringify(y.after));
    }
    // §3 the mutation
    if (mutate) {
      const abs = P(BOOT); const orig = fs.readFileSync(abs, 'utf8'); const h = sha(orig); let caught = false;
      try {
        fs.writeFileSync(abs, orig.replace("if(document.readyState==='complete')idle();else addEventListener('load',idle,{once:true})", 'go()'));
        const pg = await open();
        const r = await pg.evaluate(() => { const nav = performance.getEntriesByType('navigation')[0]; const res = performance.getEntriesByType('resource').filter((e) => /enquire-panel\.(js|css)$/.test(e.name)).map((e) => e.startTime); return { load: nav.loadEventStart, first: Math.min(...res) }; });
        caught = !(r.first >= r.load); await pg.close();
      } finally { fs.writeFileSync(abs, orig); }
      cell('3.1 M1 the boot made to load at once: 2.1\'s reading goes red, and the file is restored by sha', sha(fs.readFileSync(abs, 'utf8')) !== h ? 'NOT RESTORED' : caught ? null : 'the rung cannot see an early load');
    }
  } finally { await b.close(); server.close(); }
  console.log(`b170: ${pass} pass, ${fail} fail`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
