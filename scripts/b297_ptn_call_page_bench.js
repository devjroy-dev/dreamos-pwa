#!/usr/bin/env node
// scripts/b297_ptn_call_page_bench.js · CE-47 · PTN-A2-1 app part 1 · rung b297 · THE CALL PAGE (/partner/call/<token>).
// The real page in headless Chromium (next dev; the API answered by this bench at /__api), at 374 x 812, light then dark.
//   §1 the call: the founder's rule R-47.1 lines (whole sentences); the vendor's Instagram is a link (https, new tab,
//      noopener noreferrer); NO phone and no email anywhere on the page; no plain handle or website outside an anchor.
//   §2 suggesting: the page sends the people and the tick as typed; the server's refusal is shown as the server wrote it;
//      with the tick, the server's line is shown and the list of people already suggested is read again.
//   §3 roles: a call with one role asks no role; a call with two asks for each person's role in words.
//   §4 STOP AND PAUSE NEVER ACT ON OPENING: the email's ?do=pause and ?do=stop links open the page, show the matching
//      button and send NOTHING until it is pressed (mail scanners open links by themselves); one press sends one request.
//   §5 a closed call: no form, the closed line, and pause and stop are still there.
//   §6 a dead link (404) and a thin answer ({ ok: true }): one plain line, no page error.
// --mutate: three production mutations through scripts/lib/mutation_guard.js (kept copy and marker first; recovered at
// every start; restored by sha), each must redden its cell. F-44.419: the series refuses (exit 3) under 512 MB free.
// One BOUNDED stop for the server and the browser on every exit path (e-275); every wait is on the thing itself, bounded.
// Runs bare (no key, no live call). THE EXIT CODE IS THE VERDICT: 0 green, 1 red, 2 error, 3 refused.
process.env.PORT = process.env.PORT || '4320';
const path = require('path'); const fs = require('fs'); const cp = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const guard = require(path.join(ROOT, 'scripts/lib/mutation_guard.js'));
const PORT = +process.env.PORT;
let pass = 0, fail = 0; const failed = [];
const ok = (c, name, info) => { if (c) { pass++; console.log('  PASS  ' + name); } else { fail++; failed.push(name); console.log('  FAIL  ' + name + (info === undefined ? '' : '  [' + String(info).slice(0, 260) + ']')); } };

// F-44.258 / F-44.419: recover any mutation a killed run left, before anything is read; refuse on a low disk.
// A --mutate CHILD skips recovery: the marker it would find is its parent's live mutation, the very thing under test.
if (!process.env.B297_MUT_CHILD) guard.recoverOrRefuse(ROOT, 'b297');
if (process.argv.includes('--mutate')) {
  let free = Infinity; try { const s = fs.statfsSync(ROOT); free = s.bavail * s.bsize; } catch (_e) { /* no statfs: no refusal */ }
  if (free < 512 * 1024 * 1024) { console.log(`b297: REFUSED. ${Math.round(free / 1048576)} MB free; a mutation series needs 512 MB (F-44.419).`); process.exit(3); }
}
const PAGE = 'app/partner/call/[token]/page.tsx';
const MUTS = [
  // M1: the pause and stop buttons made to act on opening (what a mail scanner would trigger).
  { rel: PAGE, from: "  const [busy, setBusy] = useState(false);\n  const act = async (what: 'stop' | 'pause') => {",
    to: "  const [busy, setBusy] = useState(false);\n  useEffect(() => { if (ask) void act(ask); }, [ask]); // eslint-disable-line\n  const act = async (what: 'stop' | 'pause') => {", reddens: /FAIL  §4\.1/ },
  // M2: the thin-answer guard dropped.
  { rel: PAGE, from: "    if (!r.call || typeof r.call !== 'object' || !r.call.vendor) { setErr(CALL.noCall); return; }\n", to: '', reddens: /FAIL  §6\.2/ },
  // M3: the vendor's Instagram drawn as plain text, not a link.
  { rel: PAGE, from: '<ExtLink href={v.instagram_url}>@{v.instagram_handle}</ExtLink>', to: '<span>@{v.instagram_handle}</span>', reddens: /FAIL  §1\.2/ },
];
if (!process.env.B297_MUT_CHILD) for (const m of MUTS) if (!fs.readFileSync(path.join(ROOT, m.rel), 'utf8').includes(m.from)) { console.log(`STOP — a mutation anchor is missing from ${m.rel}; restore it with git checkout before running b297.`); process.exit(1); }
if (process.argv.includes('--mutate')) {
  for (const [i, m] of MUTS.entries()) {
    const before = guard.sha(fs.readFileSync(path.join(ROOT, m.rel), 'utf8')); let red = false; let out = '';
    const h = guard.apply(ROOT, m.rel, m.from, m.to, 'b297');
    try { const r = cp.spawnSync(process.execPath, [__filename], { encoding: 'utf8', env: { ...process.env, PORT: String(PORT + 1 + i), B297_MUT_CHILD: '1', B297_ONE_MODE: '1' }, timeout: 900000 }); out = r.stdout || ''; red = r.status !== 0 && m.reddens.test(out); }
    finally { h.restore(); }
    ok(red, `M${i + 1} ${m.rel} mutated reddens ${m.reddens.source.replace('FAIL  ', '')}`, red ? undefined : (out.match(/FAIL .*/g) || ['no red']).join(' | '));
    ok(guard.sha(fs.readFileSync(path.join(ROOT, m.rel), 'utf8')) === before && !fs.existsSync(guard.pendingDir(ROOT)), `M${i + 1} restored byte for byte, no marker left`);
  }
  console.log(`\nb297 --mutate: ${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
}

const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const { stopTree } = require(path.join(ROOT, 'scripts/lib/stop_tree.js'));
const CALLS = {
  T1: { partner: 'Model Connect', max: 5, call: { open: true, vendor: { name: 'Aanya Makeup Studio', trade: 'makeup artist', instagram_url: 'https://www.instagram.com/aanya.mua/', instagram_handle: 'aanya.mua' },
    needs: '2 models', roles: [{ role: 'model', word: 'model', needed: 2 }], city: 'Delhi NCR', date_words: '18 October 2026', pay_words: 'Paid, Rs 3,000 to Rs 5,000', note: 'Call me on [number hidden] or [email hidden]' } },
  T2: { partner: 'Model Connect', max: 5, call: { open: true, vendor: { name: 'Riya Photography', trade: 'photographer', instagram_url: null, instagram_handle: null },
    needs: '1 model, 1 stylist', roles: [{ role: 'model', word: 'model', needed: 1 }, { role: 'stylist', word: 'stylist', needed: 1 }], city: 'Jaipur', date_words: '2 November 2026', pay_words: 'Credit only', note: null } },
  T3: { partner: 'Model Connect', max: 5, call: { open: false, vendor: { name: 'Aanya Makeup Studio', trade: 'makeup artist', instagram_url: null, instagram_handle: null },
    needs: '2 models', roles: [{ role: 'model', word: 'model', needed: 2 }], city: 'Delhi NCR', date_words: '1 October 2026', pay_words: 'Paid', note: null } },
};
const TOKEN = (k) => `${k}aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`.slice(0, 32);
let THIN = false; let SUGGESTED = []; const SEEN = [];
function answer(method, route, body) {
  SEEN.push({ method, route, body });
  if (THIN) return [200, { ok: true }];
  const m = route.match(/^\/api\/v2\/public\/partner\/call\/([^/]+)(?:\/(suggest|stop|pause))?$/);
  if (!m) return [200, { ok: true }];
  const key = Object.keys(CALLS).find((k) => TOKEN(k) === m[1]);
  if (!key) return [404, { ok: false, error: 'This link does not work. Ask The Dream Wedding for a new one.' }];
  if (!m[2]) return [200, { ok: true, ...CALLS[key], suggested: SUGGESTED.slice() }];
  if (m[2] === 'suggest') {
    const b = JSON.parse(body || '{}');
    if (b.agreed !== true) return [400, { ok: false, error: 'Tick the box "These people have agreed to be suggested for this call" before you send.' }];
    for (const p of b.people || []) SUGGESTED.push(p.name);
    return [200, { ok: true, people: (b.people || []).map((p) => ({ name: p.name, existed: false })), line: 'Your suggestions are sent. Aanya Makeup Studio can now see them on the call.' }];
  }
  return [200, { ok: true, line: m[2] === 'stop' ? 'TDW will send you no more calls. To get calls again, sign in and turn them on in Settings.' : 'TDW will send you no calls for one week.' }];
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
async function until(p, fn, arg, ms = 60000) { const end = Date.now() + ms; while (Date.now() < end) { try { if (await p.evaluate(fn, arg)) return true; } catch (_e) { /* navigating */ } await sleep(100); } return false; }
const hasSel = (s) => !!document.querySelector(s);
const hasText = (t) => document.body && document.body.innerText.includes(t);
const bounded = (pr, ms) => Promise.race([pr, new Promise((r) => setTimeout(() => r('TIMEOUT'), ms))]);
async function open(b, route, mode, wait) {
  const ctx = await b.createBrowserContext(); const p = await ctx.newPage(); p.__ctx = ctx;
  p.__errs = []; p.on('pageerror', (e) => p.__errs.push(String(e && e.message || e).slice(0, 160)));
  await p.setViewport({ width: 374, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: mode }]);
  await p.setRequestInterception(true);
  p.on('request', (r) => { const u = r.url(); if (!u.includes('/__api/')) return r.continue(); const rt = u.split('/__api')[1].split('?')[0];
    if (r.method() === 'OPTIONS') return r.respond({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' } });
    const [s, body] = answer(r.method(), rt, r.postData()); r.respond({ status: s, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) }); });
  await p.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'domcontentloaded', timeout: 240000 });
  if (!(await until(p, hasSel, wait, 120000))) throw new Error(`${route} (${mode}): ${wait} never appeared in 120 s`);
  // Wait on hydration itself (b291's lesson): React has attached its props to the waited-for element.
  if (!(await until(p, (s) => { const e = document.querySelector(s); return !!e && Object.keys(e).some((k) => k.startsWith('__reactProps')); }, wait, 60000)))
    throw new Error(`${route} (${mode}): ${wait} was never hydrated in 60 s`);
  await p.evaluate(() => document.fonts.ready);
  return p;
}
const close = (p) => p.__ctx.close();
const anchorsOf = (p, sc) => p.evaluate((s) => [...document.querySelectorAll(`${s} [data-ext-link]`)].map((a) => ({ t: a.textContent.trim(), h: a.getAttribute('href'), tg: a.getAttribute('target'), rel: a.getAttribute('rel') })), sc);
const goodAnchor = (a) => /^https:\/\//.test(a.h) && a.tg === '_blank' && a.rel === 'noopener noreferrer';
const plainLinks = (p, sc) => p.evaluate((s) => [...document.querySelectorAll(`${s} *`)].filter((e) => e.children.length === 0 && e.getBoundingClientRect().height > 0 && !e.closest('a') && !e.closest('input')
  && /(^|\s)@[A-Za-z0-9._]{2,}\b|\b[a-z0-9-]+\.(in|com)\b/.test(e.textContent || '')).map((e) => e.textContent.trim().slice(0, 80)), sc);
const posts = (kind) => SEEN.filter((x) => x.method === 'POST' && x.route.endsWith('/' + kind)).length;

(async () => {
  let server = null, b = null, bpid = null;
  try {
    server = await dev.start(ROOT, PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` });
    if (!(await server.up())) { ok(false, 'the dev server came up'); return; }
    // THE COLD COMPILE (the 20-run proof under load, 8 Oct 2026: run 8 of 20 waited past 120 s for the page while next dev
    // compiled the route for the first time on two busy cores). Wait on the thing itself first: the route answers 200 from
    // the server, bounded at 300 s, before any browser waits on it.
    { const end = Date.now() + 300000; let up = false;
      while (!up && Date.now() < end) { try { const r = await fetch(`http://localhost:${PORT}/partner/call/${TOKEN('T1')}`); up = r.status === 200; } catch (_e) { /* compiling */ } if (!up) await sleep(500); }
      if (!up) { ok(false, 'the call page route compiled within 300 s'); return; } }
    b = await launch(); bpid = b.process() && b.process().pid;
    for (const mode of (process.env.B297_ONE_MODE ? ['light'] : ['light', 'dark'])) {
      console.log(`\n── ${mode} ──`);
      SUGGESTED = [];
      let p = await open(b, `/partner/call/${TOKEN('T1')}`, mode, '[data-call-page]');
      const txt = await p.evaluate(() => document.querySelector('[data-call-page]').innerText);
      const want = ['Aanya Makeup Studio needs 2 models.', 'Aanya Makeup Studio is a makeup artist on The Dream Wedding.', 'The shoot is in Delhi NCR on 18 October 2026.',
        'The vendor offers this pay: Paid, Rs 3,000 to Rs 5,000.', 'The vendor wrote this note:', 'If the vendor chooses someone, the vendor contacts Model Connect, not the person.',
        "TDW keeps only each person's name, role and profile link. TDW never contacts the people you suggest."];
      ok(want.every((w) => txt.includes(w)), `§1.1 the call in whole sentences (R-47.1) (${mode})`, JSON.stringify(want.filter((w) => !txt.includes(w))));
      const an = await anchorsOf(p, '[data-call-page]');
      ok(an.length === 1 && an[0].h === 'https://www.instagram.com/aanya.mua/' && goodAnchor(an[0]), `§1.2 the vendor's Instagram is a link (${mode})`, JSON.stringify(an));
      ok(!/\+?91[\s-]?\d{5}|\d{10}|@[^\s]+\.(com|in)\b/.test(txt), `§1.3 no phone and no email on the page (${mode})`);
      ok((await plainLinks(p, '[data-call-page]')).length === 0, `§1.4 no plain handle or website outside an anchor (${mode})`, JSON.stringify(await plainLinks(p, '[data-call-page]')));
      ok(!(await p.evaluate(() => !!document.querySelector('[data-call-role]'))), `§3.1 a call with one role asks no role (${mode})`);
      // §2 suggesting
      await p.type('[data-call-name]', 'Riya Sharma');
      await p.type('[data-call-link]', 'https://www.instagram.com/riya.sharma/');
      const n0 = SEEN.length; await p.click('[data-call-send]');
      await until(p, hasSel, '[data-call-msg="err"]', 20000);
      const sent0 = SEEN.slice(n0).find((x) => x.route.endsWith('/suggest'));
      const err0 = await p.evaluate(() => (document.querySelector('[data-call-msg="err"]') || {}).textContent);
      ok(!!sent0 && JSON.parse(sent0.body).agreed === false && err0 === 'Tick the box "These people have agreed to be suggested for this call" before you send.', `§2.1 without the tick: sent as typed, the server's refusal shown as written (${mode})`, JSON.stringify({ body: sent0 && sent0.body, err0 }));
      await p.click('[data-call-agree]'); const n1 = SEEN.length; await p.click('[data-call-send]');
      await until(p, hasSel, '[data-call-msg="ok"]', 20000);
      const sent1 = SEEN.slice(n1).find((x) => x.route.endsWith('/suggest'));
      const b1 = sent1 ? JSON.parse(sent1.body) : {};
      ok(b1.agreed === true && b1.people && b1.people.length === 1 && b1.people[0].name === 'Riya Sharma' && b1.people[0].role === 'model' && b1.people[0].link === 'https://www.instagram.com/riya.sharma/',
        `§2.2 with the tick: the person, the call's one role and the link are sent (${mode})`, JSON.stringify(b1));
      await until(p, hasSel, '[data-call-suggested]', 20000);
      const after = await p.evaluate(() => ({ msg: (document.querySelector('[data-call-msg="ok"]') || {}).textContent, list: (document.querySelector('[data-call-suggested]') || {}).innerText || '' }));
      ok(after.msg === 'Your suggestions are sent. Aanya Makeup Studio can now see them on the call.' && /You have already suggested these people for this call:/.test(after.list) && /Riya Sharma/.test(after.list),
        `§2.3 the server's line is shown, and the people already suggested are read again (${mode})`, JSON.stringify(after));
      await close(p);
      // §3.2 two roles
      p = await open(b, `/partner/call/${TOKEN('T2')}`, mode, '[data-call-page]');
      const opts = await p.evaluate(() => [...document.querySelectorAll('[data-call-role] option')].map((o) => o.textContent));
      ok(opts.join('|') === 'Role|model|stylist' && !(await p.evaluate(() => document.querySelector('[data-call-page]').innerText.includes('Instagram here'))), `§3.2 a call with two roles asks each person's role in words (${mode})`, JSON.stringify(opts));
      await close(p);
      // §4 stop and pause never act on opening
      for (const what of ['pause', 'stop']) {
        const before = posts(what);
        p = await open(b, `/partner/call/${TOKEN('T1')}?do=${what}`, mode, '[data-call-fewer]');
        await until(p, hasSel, `[data-call-ask="${what}"]`, 20000);
        // The page has drawn, hydrated and read the link; a scanner's visit ends here. Give a mutation a fair chance to fire:
        // wait until the button itself is on the page and the network has had every request the page would make.
        await until(p, hasSel, `[data-call-${what}]`, 20000); await p.waitForNetworkIdle({ idleTime: 500, timeout: 20000 }).catch(() => {});
        const onOpen = posts(what) - before;
        const other = await p.evaluate((w) => !!document.querySelector(w === 'pause' ? '[data-call-stop]' : '[data-call-pause]'), what);
        ok(onOpen === 0 && !other, `§4.1 ?do=${what} opens the page and sends NOTHING; only the ${what} button is shown (${mode})`, JSON.stringify({ onOpen, other }));
        await p.click(`[data-call-${what}]`); await until(p, hasSel, '[data-call-fewer-msg="ok"]', 20000);
        const line = await p.evaluate(() => (document.querySelector('[data-call-fewer-msg="ok"]') || {}).textContent);
        const wantLine = what === 'stop' ? 'TDW will send you no more calls. To get calls again, sign in and turn them on in Settings.' : 'TDW will send you no calls for one week.';
        ok(posts(what) - before === 1 && line === wantLine, `§4.2 one press sends one ${what}, and the server's line is shown (${mode})`, JSON.stringify({ n: posts(what) - before, line }));
        await close(p);
      }
      // §5 a closed call
      p = await open(b, `/partner/call/${TOKEN('T3')}`, mode, '[data-call-page]');
      const c5 = await p.evaluate(() => ({ form: !!document.querySelector('[data-call-form]'), closed: (document.querySelector('[data-call-closed]') || {}).textContent, pause: !!document.querySelector('[data-call-pause]'), stop: !!document.querySelector('[data-call-stop]') }));
      ok(!c5.form && c5.closed === 'This call is no longer open, because the vendor closed it or its date has passed.' && c5.pause && c5.stop, `§5.1 a closed call: no form, the closed line, pause and stop still there (${mode})`, JSON.stringify(c5));
      await close(p);
      // §6 a dead link and a thin answer
      p = await open(b, `/partner/call/${TOKEN('ZZ')}`, mode, '[data-call-dead]');
      const d6 = await p.evaluate(() => (document.querySelector('[data-call-dead]') || {}).textContent);
      ok(d6 === 'This link does not work. Ask The Dream Wedding for a new one.' && p.__errs.length === 0, `§6.1 a dead link: one plain line, no page error (${mode})`, JSON.stringify({ d6, errs: p.__errs }));
      await close(p);
      THIN = true;
      let r6 = null;
      try { p = await open(b, `/partner/call/${TOKEN('T1')}`, mode, '[data-call-dead]'); r6 = { line: await p.evaluate(() => (document.querySelector('[data-call-dead]') || {}).textContent), errs: p.__errs.slice() }; await close(p); }
      catch (e) { r6 = { error: String(e && e.message).slice(0, 160) }; }
      THIN = false;
      ok(!!r6 && r6.line === 'This link does not work. Ask The Dream Wedding for a new one.' && r6.errs && r6.errs.length === 0, `§6.2 a thin answer ({ ok: true }): the plain line, no page error (${mode})`, JSON.stringify(r6));
    }
  } catch (e) { ok(false, 'the bench ran to its end', e && e.stack); }
  finally {
    if (b) { try { await bounded(b.close(), 15000); } catch (_e) { /* */ } if (bpid) stopTree(bpid); }
    if (server) { try { await bounded(server.stop(), 30000); } catch (_e) { /* */ } }
    console.log(`\nb297: ${pass} passed, ${fail} failed${fail ? '\nFAILED: ' + failed.join(' | ') : ''}`);
    process.exit(fail ? 1 : 0);
  }
})();
