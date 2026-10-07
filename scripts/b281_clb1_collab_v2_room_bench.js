// scripts/b281_clb1_collab_v2_room_bench.js · CE-47 · CLB-1 · COLLAB HUB v2, THE APP HALF, IN ITS REAL ROOMS (C-43.18).
// next dev in mock mode, headless Chromium, the v2 layout cookie, Graphite (dark) at 374 px; every door is answered by
// request interception (no server). What it holds:
//   §1 the new call sheet in Hire, collab & barter: Pay as Paid/Unpaid/Credit only; Unpaid hides the budget; the TDW
//      tick shows ONLY when /share-gate opens (Rule 1); ticked with no picture, the line "Add a picture..." is itself a
//      button (R-43.16); the posted body carries pay_kind and share_tdw only as chosen; no "couple"/"bride"; 44 px taps.
//   §2 the call's page: "Where it is posted" rows with plain states; NOTHING drawn when the call has no shares.
//   §3 the admin's Collab calls (F-44.300): the queue with its caption and card; Post calls the approve door;
//      Prospects shows the no-tagging line; the page is linked from More.
//   §4 mutations of production code through a child run, restored by sha. §5 the stop.
'use strict';
const fs = require('fs'); const path = require('path'); const crypto = require('crypto'); const cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const PORT = 3281;
const CHILD = !!process.env.B281_CHILD;
// e-275 and the floor's reds (CE-47, 7 October 2026). A mutation child compiles its own cold next dev, so it gets a long
// allowance for its FIRST page only; every later page in a child, and every page in the parent, gets the usual bound.
// A child also keeps its own whole-run limit, inside spawnSync's, so it stops its own server and says so before anyone
// has to SIGKILL it. A child whose room never came up, or that ran past its own limit, is NOT a mutation result.
const CHILD_FIRST_MS = 480000; const CHILD_LATER_MS = 120000; const PARENT_PAGE_MS = 240000;
const CHILD_MAX_MS = Number(process.env.B281_CHILD_MAX_MS) || 900000;   // the child's own limit
const SPAWN_MS = Number(process.env.B281_SPAWN_MS) || 1080000;         // spawnSync's limit, always above the child's
const ROOM_UP = 'B281-CHILD-ROOM-UP'; const ROOM_DOWN = 'B281-CHILD-ROOM-DOWN'; const OVER_LIMIT = 'B281-CHILD-OVER-LIMIT';
let pagesOpened = 0;
const pageMs = () => (CHILD ? (pagesOpened === 0 ? CHILD_FIRST_MS : CHILD_LATER_MS) : PARENT_PAGE_MS);
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
let pass = 0; let fail = 0; const failed = [];
function ok(c, name, info) { if (c) { pass += 1; if (!CHILD) console.log(`  PASS  ${name}`); return true; } else { fail += 1; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 240) + ']'}`); } }
const sec = (t) => { if (!CHILD) console.log(`\n── ${t}`); };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
// e-275 (STANDING): no cell rests on a fixed pause. untilTrue waits on the thing itself, polled, with a bound; it
// returns whether the thing happened, and the cell says so. The only sleep left is the poll's own short tick.
async function untilTrue(p, fn, arg, ms = 15000) {
  const end = Date.now() + ms;
  while (Date.now() < end) { const v = await p.evaluate(fn, arg).catch(() => false); if (v) return true; await wait(100); }
  return false;
}
// e-275 rule 3: teardown is bounded; anything that outlives its limit is abandoned and the bench still gives its verdict.
const bounded = (pr, ms) => Promise.race([pr.then(() => true, () => false), wait(ms).then(() => false)]);
const FUT = (() => { const d = new Date(Date.now() + 40 * 86400000); return d.toISOString().slice(0, 10); })();

let SERVER = null; let BROWSER = null;
async function stopAll() {
  if (BROWSER) { const b = BROWSER; BROWSER = null; const closed = await bounded(b.close(), 15000); if (!closed) { try { b.process() && b.process().kill('SIGKILL'); } catch (_e) { /* gone */ } } }
  let free = true;
  if (SERVER) { const s = SERVER; SERVER = null; let r = null; const ok2 = await bounded(s.stop().then((x) => { r = x; }), 30000); free = ok2 && r ? r.portFree : false; }
  return free;
}

async function page(url, answers, { admin = false, width = 374, until } = {}) {
  const p = await BROWSER.newPage();
  await p.setViewport({ width, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  for (const [n, v] of [['tdw_wl_mode', 'dark'], ['tdw_layout', 'v2']]) await p.setCookie({ name: n, value: v, domain: 'localhost', path: '/' });
  if (admin) await p.evaluateOnNewDocument(() => { try { localStorage.setItem('admin_session_token', 'b281'); localStorage.setItem('admin_session_expires', String(Date.now() + 3600000)); } catch (_e) { /* none */ } });
  const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
  p.posted = []; p.asked = [];
  await p.setRequestInterception(true);
  p.on('request', (r) => {
    const u = r.url(); if (!u.includes('/__api/')) return r.continue();
    const route = u.split('/__api')[1].split('?')[0];
    p.asked.push(route);
    if (r.method() !== 'GET') p.posted.push({ route, method: r.method(), body: r.postData() ? JSON.parse(r.postData()) : null });
    const J = (o) => r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
    for (const [re, fn] of answers) if (re.test(route)) return J(typeof fn === 'function' ? fn(route, r) : fn);
    if (route === '/api/v2/vendor/me') return J({ ok: true, vendor: { id: 'v1', name: 'DEV440 Studio', city: 'Delhi', layout: 'v2' } });
    return J({ ok: true });
  });
  const ms = pageMs(); pagesOpened += 1;
  await p.goto(`http://localhost:${PORT}${url}`, { waitUntil: 'domcontentloaded', timeout: ms });
  const end = Date.now() + ms; let found = false;
  while (Date.now() < end && !(found = await p.evaluate((s) => !!document.querySelector(s), until).catch(() => false))) await wait(400);
  p.found = found; return p;
}
const q = (p, fn, ...a) => p.evaluate(fn, ...a).catch(() => null);
// The words a person reads: the open sheet only, never script or style text (b281's first run walked document.body and
// read Next's inline boot script, an instrument red on 1.7, not a screen red).
const words = (p) => q(p, () => { const root = document.querySelector('.wl-sheet'); if (!root) return null; const out = []; const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement && /^(SCRIPT|STYLE)$/.test(n.parentElement.tagName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) }); let n; while ((n = w.nextNode())) { const t = n.textContent.trim(); if (t) out.push(t); } return out; });

const COLLAB = (gate) => [
  [/\/collab\/requirement-types$/, { ok: true, requirement_types: ['photography', 'makeup', 'other'], shoot_event_types: ['editorial', 'brand_shoot'] }],
  [/\/collab\/share-gate$/, { ok: true, house: gate }],
  [/\/collab\/my-posts$/, { ok: true, posts: [] }],
  [/\/collab\/feed$/, { ok: true, posts: [] }],
  [/\/roster/, { ok: true, roster: [] }],
  [/\/collab\/reference\/sign$/, { ok: true, upload_url: 'https://api.cloudinary.com/v1_1/demo/image/upload', params: { a: '1' } }],
];

async function openSheet(gate) {
  const p = await page('/vendor/collab', COLLAB(gate), { until: '[data-add-top="collab"]' });
  if (!p.found) return p;
  await q(p, () => document.querySelector('[data-add-top="collab"]').click());
  p.found = await untilTrue(p, () => !!document.querySelector('.wl-sheet [data-clb-gate="loaded"] .cp-chip'));   // the gate has answered
  return p;
}

async function cells() {
  sec('§1 the new call sheet (Hire, collab & barter)');
  let p = await openSheet({ instagram: true, threads: true });
  if (CHILD && !p.found) { console.log(`${ROOM_DOWN} (the room was not on glass within ${CHILD_FIRST_MS / 1000} s)`); await p.close(); return 'down'; }
  if (CHILD) console.log(ROOM_UP);
  if (!ok(p.found, '1.0 the room is on glass')) { await p.close(); return; }
  let r = await q(p, () => ({
    pay: [...document.querySelectorAll('[data-clb-pay] .cp-chip')].map((b) => [b.innerText.trim(), Math.round(b.getBoundingClientRect().height)]),
    tick: (document.querySelector('[data-clb-tdw]') || {}).innerText || null,
    pics: !!document.querySelector('[data-clb-pictures] .cp-picadd'),
    budget: [...document.querySelectorAll('.wl-fl')].some((e) => /Budget offered/.test(e.innerText)),
  }));
  ok(r && JSON.stringify(r.pay.map((x) => x[0])) === '["Paid","Unpaid","Credit only"]', '1.1 Pay: Paid, Unpaid, Credit only', r && JSON.stringify(r.pay));
  ok(r && r.pay.every((x) => x[1] >= 32), '1.2 each pay chip is a real control (drawn 32 or more)', r && JSON.stringify(r.pay));
  ok(r && r.tick === 'Post on TDW\u2019s Instagram and Threads. TDW checks it first.', '1.3 the gate open: the TDW tick, in plain words', r && r.tick);
  ok(r && r.pics && r.budget, '1.4 reference pictures "Add" and the budget are drawn');
  await q(p, () => { [...document.querySelectorAll('[data-clb-pay] .cp-chip')].find((b) => b.innerText.trim() === 'Unpaid').click(); });
  await untilTrue(p, () => [...document.querySelectorAll('[data-clb-pay] .cp-chip')].some((b) => b.getAttribute('aria-pressed') === 'true' && b.innerText.trim() === 'Unpaid'));
  r = await q(p, () => [...document.querySelectorAll('.wl-fl')].some((e) => /Budget offered/.test(e.innerText)));
  ok(r === false, '1.5 Unpaid hides the budget');
  await q(p, () => { document.querySelector('[data-clb-tdw] input').click(); });
  await untilTrue(p, () => !!document.querySelector('[data-clb-need-picture]'));
  r = await q(p, () => { const b = document.querySelector('[data-clb-need-picture]'); return b ? { tag: b.tagName, t: b.innerText.trim(), h: Math.round(b.getBoundingClientRect().height) } : null; });
  ok(r && r.tag === 'BUTTON' && r.t === 'Add a picture to post on TDW\u2019s Instagram and Threads.' && r.h >= 44, '1.6 ticked with no picture: the line is itself a 44 px button (R-43.16)', JSON.stringify(r));
  const L = await words(p);
  ok(L && L.length > 10 && !L.some((t) => /couple|bride/i.test(t)), '1.7 no "couple" or "bride" on the sheet', L && L.filter((t) => /couple|bride/i.test(t)).join(' | '));
  // post with the tick off: no share_tdw in the body; pay_kind as chosen
  await q(p, () => { document.querySelector('[data-clb-tdw] input').click(); });
  await untilTrue(p, () => !document.querySelector('[data-clb-need-picture]'));
  await q(p, () => { [...document.querySelectorAll('.cp-chip')].find((b) => b.innerText.trim() === 'Photography' || /photo/i.test(b.innerText)).click(); });
  await q(p, (d) => { const i = document.querySelector('input[type="date"]'); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, d); i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true })); }, FUT);
  await q(p, () => { const s = [...document.querySelectorAll('select.wl-fi')].find((x) => [...x.options].some((o) => o.value === 'Delhi' || /Delhi/.test(o.text))); if (s) { const o = [...s.options].find((x) => /Delhi/.test(x.text)); const set = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set; set.call(s, o.value); s.dispatchEvent(new Event('change', { bubbles: true })); } });
  await untilTrue(p, (d) => { const i = document.querySelector('input[type="date"]'); return !!i && i.value === d; }, FUT);
  const before = p.posted.length;
  await q(p, () => { [...document.querySelectorAll('button.wl-btn.pri')].find((b) => /^Post/.test(b.innerText.trim())).click(); });
  { const end = Date.now() + 15000; while (Date.now() < end && !p.posted.slice(before).some((x) => x.route === '/api/v2/vendor/collab' && x.method === 'POST')) await wait(100); }
  const sent = p.posted.find((x) => x.route === '/api/v2/vendor/collab' && x.method === 'POST');
  ok(sent && sent.body.pay_kind === 'unpaid' && !('share_tdw' in sent.body) && !('budget_inr' in sent.body), '1.8 the body: pay_kind as chosen, no share_tdw when unticked, no budget when Unpaid', JSON.stringify(sent && sent.body));
  await p.close();
  p = await openSheet({ instagram: false, threads: false });
  r = await q(p, () => !!document.querySelector('[data-clb-tdw]'));
  ok(p.found && r === false, '1.9 the gate shut (not a tester, rows pending): no TDW tick at all (Rule 1)');
  await p.close();
  p = await openSheet({ instagram: true, threads: false });
  r = await q(p, () => (document.querySelector('[data-clb-tdw]') || {}).innerText || null);
  ok(r === 'Post on TDW\u2019s Instagram. TDW checks it first.', '1.10 only Instagram open: the tick names only Instagram', r);
  await p.close();

  sec('§2 the call\u2019s page: Where it is posted');
  const RESP = [[/\/collab\/p1\/responses$/, { ok: true, responses: [], post: { id: 'p1', state: 'open', items: [] } }]];
  p = await page('/vendor/collab/p1/responses', [...RESP, [/\/collab\/p1\/shares$/, { ok: true, shares: [
    { id: 's1', account: 'house', platform: 'instagram', state: 'published', hashtags: ['#DelhiPhotographer'], permalink: 'https://www.instagram.com/p/X/', published_at: '2026-10-04T13:30:00Z' },
    { id: 's2', account: 'house', platform: 'threads', state: 'queued', hashtags: ['#DelhiPhotographer'], permalink: null, published_at: null },
  ] }]], { until: '[data-clb-where] .fr-row' });
  r = await q(p, () => ({ head: (document.querySelector('[data-clb-where] .fr-h') || {}).innerText, rows: [...document.querySelectorAll('[data-clb-where] .fr-row')].map((e) => e.innerText.replace(/\s+/g, ' ').trim()) }));
  ok(p.found && r && r.head === 'Where it is posted' && r.rows.length === 2, '2.1 the section and its two rows', r && JSON.stringify(r));
  ok(r && /^TDW Instagram/.test(r.rows[0]) && /Live/.test(r.rows[0]) && /Posted/.test(r.rows[0]) && /^TDW Threads/.test(r.rows[1]) && /Waiting for TDW to check it/.test(r.rows[1]), '2.2 plain states: Posted and Live; Waiting for TDW to check it', r && JSON.stringify(r.rows));
  await p.close();
  p = await page('/vendor/collab/p1/responses', [...RESP, [/\/collab\/p1\/shares$/, { ok: true, shares: [] }]], { until: 'main' });
  // the page has asked for its shares (the request itself), then drawn whatever it was going to draw
  const loaded = await untilTrue(p, () => !!document.querySelector('[data-clb-where-none], [data-clb-where]'));
  r = await q(p, () => ({ where: !!document.querySelector('[data-clb-where]'), any: [...document.querySelectorAll('h2')].some((h) => /Where it is posted/.test(h.innerText)) }));
  ok(loaded && r && !r.where && !r.any, '2.3 a call with no shares: loaded, and nothing drawn (Rule 1)', JSON.stringify(r));
  await p.close();

  sec('§3 the admin\u2019s Collab calls (F-44.300)');
  const Q = { id: 'sh1', post_id: 'p1', platform: 'instagram', state: 'queued', caption: 'Looking for: photographer\n\n#DelhiPhotographer', hashtags: ['#DelhiPhotographer'], image_url: null, permalink: null, error: null, created_at: '2026-10-04T10:00:00Z', decided_at: null, post: { id: 'p1', requirement_type: 'photography', event_date: FUT, city: 'Delhi', event_type: 'wedding', details: null }, vendor_name: 'DEV440 Studio' };
  const ADMIN = [[/\/admin\/collab$/, { ok: true, queue: [Q], decided: [] }], [/\/admin\/collab\/prospects$/, { ok: true, prospects: [{ id: 'pr1', name: 'Neha', craft: 'Model', city: 'Delhi', instagram_handle: 'neha.looks', threads_handle: null, source: 'Instagram search', opted_out: false, created_at: '2026-10-04T10:00:00Z' }] }]];
  p = await page('/admin/collab', ADMIN, { admin: true, until: '[data-clb-admin] pre' });
  r = await q(p, () => ({ pre: (document.querySelector('[data-clb-admin] pre') || {}).innerText, names: [...document.querySelectorAll('[data-clb-admin] button')].map((b) => b.innerText.trim()) }));
  ok(p.found && r && /Looking for: photographer/.test(r.pre) && r.names.includes('Post') && r.names.includes('Do not post') && r.names.includes('Copy the call'), '3.1 the queue: the caption, Post, Do not post, Copy the call', r && JSON.stringify(r.names));
  await q(p, () => [...document.querySelectorAll('[data-clb-admin] button')].find((b) => b.innerText.trim() === 'Post').click());
  { const end = Date.now() + 15000; while (Date.now() < end && !p.posted.some((x) => x.route === '/api/v2/admin/collab/shares/sh1/approve')) await wait(100); }
  ok(p.posted.some((x) => x.route === '/api/v2/admin/collab/shares/sh1/approve' && x.method === 'POST'), '3.2 Post calls the approve door for that share', JSON.stringify(p.posted));
  await q(p, () => [...document.querySelectorAll('[role="tab"]')].find((b) => /Prospects/.test(b.innerText)).click());
  await untilTrue(p, () => !!document.querySelector('[data-clb-profile-links] a'));
  r = await q(p, () => document.querySelector('[data-clb-admin]').innerText);
  ok(r && /This list is never used to tag anyone/.test(r) && /Neha/.test(r) && /Instagram neha\.looks/.test(r), '3.3 Prospects: the no-tagging line and the person', r && r.slice(0, 300));
  const link = await q(p, () => { const a = document.querySelector('[data-clb-profile-links] a'); return a ? { href: a.getAttribute('href'), target: a.getAttribute('target'), rel: a.getAttribute('rel'), t: a.innerText.trim() } : null; });
  ok(link && link.href === 'https://www.instagram.com/neha.looks/' && link.target === '_blank' && link.rel === 'noopener noreferrer' && link.t === 'Instagram neha.looks', '3.5 the handle is a link to the Instagram profile, new tab, noopener noreferrer (the founder\u2019s rule)', JSON.stringify(link));
  await p.close();
  const nav = fs.readFileSync(path.join(ROOT, 'app/admin/_components/adminNav.ts'), 'utf8');
  ok(/path: '\/admin\/collab',\s+domain: '\w+',\s+disposition: 'LIVE'/.test(nav) && /label: 'Collab calls',\s+path: '\/admin\/collab'/.test(nav), '3.4 the page is LIVE and linked from More');
}

const MUTS = [
  ['v2/lib/vendor/collabShare.ts', '  if (g.instagram && g.threads) return CS.tick;', '  return CS.tick;\n  if (g.instagram && g.threads) return CS.tick;', 'M1 the tick shown whatever the gate', '1.9'],
  ['v2/components/vendor/CollabWherePosted.tsx', '  if (shares.length === 0) return <span data-clb-where-none="" hidden />;', '', 'M2 the section drawn for a call with no shares', '2.3'],
  ['v2/components/vendor/CollabPostForm.tsx', "{payKind !== 'unpaid' && payKind !== 'credit_only' && (", '{true && (', 'M3 Unpaid keeps the budget', '1.5'],
  ['app/admin/collab/page.tsx', "{i && <a href={`https://www.instagram.com/${i}/`} target=\"_blank\" rel=\"noopener noreferrer\" style={st}>Instagram {i}</a>}", "{i && <span style={st}>Instagram {i}</span>}", 'M5 the handle is plain text again', '3.5'],
  ['v2/components/vendor/CollabPostForm.tsx', '<button type="button" className="cp-fix" data-clb-need-picture="" onClick={() => fileRef.current?.click()}>{CS.needPicture}</button>', '<p className="cp-fix" data-clb-need-picture="">{CS.needPicture}</p>', 'M4 the needed-picture line is not a control', '1.6'],
];
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
// e-277 (STANDING): no mutation may already be in a production file. A run killed by SIGKILL cannot restore (no handler
// catches it), so a later run refuses mutated bytes rather than test them. Checked before the first cell AND before each
// mutation. A mutation is "present" if its replacement text is in the file, or its original is not there exactly once.
function mutationLeftovers(read) {
  const bad = [];
  for (const [file, from, to, name] of MUTS) {
    const src = read(file);
    if (src == null) { bad.push({ file, name, why: 'the file is missing' }); continue; }
    if (src.split(from).length !== 2) bad.push({ file, name, why: 'its original text is not there exactly once' });
    else if (to && src.includes(to)) bad.push({ file, name, why: 'its mutated text is in the file' });
  }
  return bad;
}
const readReal = (f) => { try { return fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch (_e) { return null; } };
function stopOnLeftovers(left) {
  for (const x of left) console.log(`STOP — ${x.file} looks mutated (${x.name}: ${x.why}). Restore it from your package or git, then run again.`);
  console.log(`\nb281 · ${pass} pass · ${fail} fail`); process.exit(2);
}
// The child's next dev runs in its OWN process group (scripts/lib/b126_dev_server.js) and is stopped on a normal exit,
// but nothing catches a SIGKILL. So the child writes its server's group id to a file, and after every child, whatever
// became of it, the parent kills that group and waits for the port to be free.
const PIDFILE = path.join(require('os').tmpdir(), `b281_child_server_${process.pid}.pid`);
async function reapChildServer() {
  let pid = null; try { pid = Number(fs.readFileSync(PIDFILE, 'utf8')); } catch (_e) { pid = null; }
  if (pid) { try { process.kill(-pid, 'SIGKILL'); } catch (_e) { /* already gone */ } }
  try { fs.unlinkSync(PIDFILE); } catch (_e) { /* none */ }
  const end = Date.now() + 30000;
  while (Date.now() < end && await dev.portOpen(PORT)) await wait(250);
  return !(await dev.portOpen(PORT));
}
(async () => {
  if (CHILD) {
    if (process.env.B281_FORCE_DOWN === '1') { console.log(`${ROOM_DOWN} (forced, to prove the parent)`); process.exit(3); }
    setTimeout(async () => { console.log(`${OVER_LIMIT} (the child passed its own ${CHILD_MAX_MS / 1000} s limit)`); await stopAll(); process.exit(4); }, CHILD_MAX_MS);
  } else {
    sec('§0 e-277: no mutation already present (checked before any cell)');
    const [pf, pfrom, pto] = MUTS.find((m) => m[2]);
    const caught = mutationLeftovers((f) => (f === pf ? readReal(f).replace(pfrom, pto) : readReal(f)));
    ok(caught.length === 1 && caught[0].file === pf, '0.2 a planted mutation is caught and named', JSON.stringify(caught));
    const left = mutationLeftovers(readReal);
    if (!ok(left.length === 0, '0.3 every production file the bench mutates is clean before the first cell', JSON.stringify(left))) stopOnLeftovers(left);
  }
  try {
    const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
    const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
    SERVER = await dev.start(ROOT, PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` });
    if (CHILD && process.env.B281_PIDFILE) fs.writeFileSync(process.env.B281_PIDFILE, String(SERVER.dev.pid));
    const up = await SERVER.up();
    if (CHILD && !up) { console.log(`${ROOM_DOWN} (the dev server did not come up)`); await stopAll(); process.exit(3); }
    if (ok(up, '0.1 the dev server came up')) {
      BROWSER = await puppeteer.launch({ executablePath: process.env.B281_CHROME || await chromium.executablePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
      const res = await cells();
      if (CHILD && res === 'down') { await stopAll(); process.exit(3); }
      if (CHILD && process.env.B281_FORCE_HANG === '1') await new Promise(() => {});   // proof switch only: a child that never ends
    }
  } catch (e) { ok(false, `b281 crashed: ${e && e.message}`); }
  const free = await stopAll();
  if (CHILD) process.exit(fail ? 1 : 0);
  sec('§4 mutations of production code (each reddens its cell in a child run; restored by sha)');
  const saved = new Map(); const restore = () => { for (const [f, b] of saved) fs.writeFileSync(f, b); };
  process.on('exit', restore); for (const s of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(s, () => process.exit(130));
  if (!process.argv.includes('--no-mutate')) for (const [file, from, to, name, cell] of MUTS.filter((m) => !process.env.B281_ONLY || m[3].startsWith(process.env.B281_ONLY))) {
    const left = mutationLeftovers(readReal); if (left.length) stopOnLeftovers(left);   // e-277, before EACH mutation
    if (await dev.portOpen(PORT)) { ok(false, `${name}: port ${PORT} is held by another server before the child starts; stopping`); console.log(`STOP — port ${PORT} is in use. Stop that server, then run again.`); break; }
    const f = path.join(ROOT, file); const before = sha(f); const src = fs.readFileSync(f, 'utf8');
    if (src.split(from).length !== 2) { ok(false, `${name}: anchor found exactly once`, file); continue; }
    const child = async () => {
      const r = cp.spawnSync(process.execPath, [__filename], { env: { ...process.env, B281_CHILD: '1', B281_PIDFILE: PIDFILE }, encoding: 'utf8', timeout: SPAWN_MS, killSignal: 'SIGKILL' });
      r.portFree = await reapChildServer();
      return r;
    };
    let r; let tries = 1;
    saved.set(f, src);
    try {
      fs.writeFileSync(f, src.replace(from, to));
      r = await child();
      if (r.status === 3) { r = await child(); tries = 2; }   // the START is retried once, never a cell
    } finally { fs.writeFileSync(f, src); saved.delete(f); }   // restored whatever became of the child
    const out = r.stdout || '';
    const why = out.split('\n').filter((l) => /FAIL|ROOM|OVER-LIMIT/.test(l)).join(' / ');
    if (!r.portFree) { ok(false, `${name}: the child's server was still on port ${PORT} after the reap`, why); continue; }
    if (r.status === 3) { ok(false, `${name}: the child's room did not come up (${tries} starts); not a mutation result`, why); continue; }
    if (r.status === 4 || r.status === null) { ok(false, `${name}: the child ran past its limit (${r.status === 4 ? 'its own' : 'spawnSync\'s'}); not a mutation result`, why); continue; }
    const red = r.status === 1 && out.includes(ROOM_UP) && new RegExp(`FAIL  ${cell.replace('.', '\\.')} `).test(out) && !/FAIL  1\.0 /.test(out);
    ok(red && sha(f) === before, `${name}: reddens ${cell} with the room on glass, restored by sha${tries > 1 ? ' (child start retried once)' : ''}`, why);
  }
  sec('§5 the stop'); ok(free !== false, '5.1 the dev server and its port are released');
  console.log(`\nb281 · ${pass} pass · ${fail} fail`);
  if (fail) { console.log('FAILED: ' + failed.join(' | ')); process.exit(1); }
  process.exit(0);
})();
