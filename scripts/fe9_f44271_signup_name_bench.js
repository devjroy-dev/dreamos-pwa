'use strict';
// scripts/fe9_f44271_signup_name_bench.js · CE-47 · FE-9 · F-44.271, THE APP HALF: NO ACCOUNT WITHOUT A NAME.
// The founder, 3 Oct 2026: "We need phone, name and OTP". Names were missing on sign-up because the SIGN-IN door signed
// an unknown number up silently (no name asked) and a known nameless account was let straight in.
//
// WHAT IT HOLDS, on the REAL landing page (`next dev`, headless Chromium, every server door answered by this bench):
//   §1 join, both roles: name required, the name rides send-otp and provision, the session carries it.
//   §2 sign-in with an UNKNOWN number, both roles: the sign-up screen, phone filled, no code sent, name required
//      (a vendor: the craft too); a name typed at a join abandoned in the same visit does not ride along.
//   §3 sign-in, KNOWN and NAMELESS, both roles: after the code, "Your name"; nothing stored and nothing opened before
//      the name; then provision again WITH the name. The server's refusal (reason 'name_required', needs_name) and
//      today's server (ok, no name) both end at the same screen. A stale join name is not sent from the sign-in path.
//   §4 sign-in, KNOWN and NAMED: unchanged (one provision, no name screen); with a PIN: straight to the PIN, no code.
//   §5 a refusal that stands (409 identity_bound_elsewhere): the server's words, nothing created or stored.
//   §6 PIN reset for an unknown number (cut 11: 404 account_not_found): the server's words are shown, the screen stays
//      on the phone step, nothing is stored. Vendor (classic and new layout) and Dreamer.
// THE SEAT'S SLICE: FE9_ONLY=2,3 runs only those sections (for a planted run); bare, as every floor runs it, it runs whole.
// RED MUTATIONS (run by the seat, each restored by sha):
//   · app/(landing)/page.tsx handleSignIn: `if (!d.exists) { sendOtp(phone); return; }`           -> §2 cells
//   · lib/auth/otpSignup.ts finish: drop the two `ask(); return;` lines                             -> §3 cells
//   · lib/auth/otpSignup.ts verifyOtp: `const signingIn = false;`                                   -> 3.7
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = 3171;
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const LAYOUT_COOKIE = /LAYOUT_COOKIE = '([^']+)'/.exec(fs.readFileSync(path.join(ROOT, 'lib/worklist/layoutSwitch.ts'), 'utf8'))[1];   // read, not retyped
let pass = 0; let fail = 0; const failed = [];
function ok(c, name, info) { if (c) { pass += 1; console.log(`  PASS  ${name}`); } else { fail += 1; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 400) + ']'}`); } }
const sec = (t) => console.log(`\n§${t}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ONLY = (process.env.FE9_ONLY || '').split(',').map((x) => x.trim()).filter(Boolean);
const runs = (n) => ONLY.length === 0 || ONLY.includes(String(n));
// A planted run fails by waiting; FE9_SHORT=1 shortens every wait so a red run ends in minutes (a green run never needs it).
const SHORT = process.env.FE9_SHORT === '1';

async function main() {
  sec('0 source: the words in one home');
  const hook = fs.readFileSync(path.join(ROOT, 'lib/auth/otpSignup.ts'), 'utf8');
  const page = fs.readFileSync(path.join(ROOT, 'app/(landing)/page.tsx'), 'utf8');
  ok(/NAME_WORDS = \{ head: 'Your name', ask: 'Please add your name\.' \}/.test(hook), '0.1 the two lines for the founder’s veto are "Your name" and "Please add your name."');
  ok(!/'Your name'|Please add your name/.test(page) && /NAME_WORDS\.head/.test(page) && /NAME_WORDS\.ask/.test(page), '0.2 the landing page spells neither line itself; it reads them from that home');

  const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
  const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
  const server = await dev.start(ROOT, PORT, { NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` });
  if (!(await server.up())) { console.log('fe9_f44271: the dev server did not come up'); await server.stop(); process.exit(2); }
  const browser = await puppeteer.launch({ executablePath: await chromium.executablePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });

  // One visitor: a fresh browser context (empty storage), the server's answers given by `world`.
  //   world.status   what pin-status says for the number
  //   world.verify   what verify-otp says
  //   world.provision(body, n)  what provision says for its n-th call
  async function visitor(world, start) {
    const ctx = await browser.createBrowserContext();
    const p = await ctx.newPage();
    await p.setViewport({ width: 374, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
    const calls = [];
    await p.setRequestInterception(true);
    p.on('request', (r) => {
      const u = r.url();
      if (!u.includes('/__api/')) return r.continue();
      const route = u.split('/__api')[1].split('?')[0];
      const J = (o) => { const { __status, ...rest } = o || {}; return r.respond({ status: __status || 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(rest) }); };
      let body = null; try { body = JSON.parse(r.postData() || 'null'); } catch (_e) { body = null; }
      const role = /\/vendor\//.test(route) ? 'vendor' : 'couple';
      if (/\/auth\/forgot-pin$/.test(route)) { calls.push({ door: 'forgot-pin', role, body }); return J(world.forgot); }
      if (route === '/api/v2/auth/pin-status') { calls.push({ door: 'pin-status', body }); return J(world.status); }
      if (/\/auth\/send-otp$/.test(route)) { calls.push({ door: 'send-otp', role, body }); return J({ ok: true }); }
      if (/\/auth\/verify-otp$/.test(route)) { calls.push({ door: 'verify-otp', role, body }); return J(world.verify); }
      if (/\/auth\/provision$/.test(route)) { calls.push({ door: 'provision', role, body }); const n = calls.filter((c) => c.door === 'provision').length; return J(world.provision(body, n)); }
      if (route === '/api/v2/exploring-photos') return J({ ok: true, photos: [] });
      if (route === '/api/v2/landing-slides') return J({ ok: true, slides: [] });
      return J({ ok: true });
    });
    if (start && start.cookie) await p.setCookie({ name: start.cookie[0], value: start.cookie[1], domain: 'localhost', path: '/' });
    await p.goto(`http://localhost:${PORT}${start ? start.path : '/'}`, { waitUntil: 'domcontentloaded', timeout: 240000 });
    const until = Date.now() + 180000;
    if (start) { await p.waitForSelector(start.wait, { timeout: 180000 }).catch(() => {}); await sleep(600); }
    while (!start && Date.now() < until && !(await p.evaluate(() => Array.from(document.querySelectorAll('button')).some((b) => b.innerText.trim().toLowerCase() === 'sign up')))) await sleep(300);
    await sleep(600);
    const tap = async (label) => {
      const done = await p.evaluate((t) => { const want = t.toLowerCase(); const b = Array.from(document.querySelectorAll('button')).find((x) => x.innerText.replace(/\s+/g, ' ').trim().toLowerCase() === want && !x.disabled); if (!b) return false; b.click(); return true; }, label);
      await sleep(450); return done;
    };
    const disabled = (label) => p.evaluate((t) => { const want = t.toLowerCase(); const b = Array.from(document.querySelectorAll('button')).find((x) => x.innerText.replace(/\s+/g, ' ').trim().toLowerCase() === want); return b ? b.disabled : null; }, label);
    const words = () => p.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
    const fill = async (sel, text) => { await p.click(sel, { clickCount: 3 }); await p.type(sel, text, { delay: 8 }); await sleep(150); };
    const code = async () => { const boxes = await p.$$('input[autocomplete="one-time-code"]'); for (let i = 0; i < 6; i += 1) { await boxes[i].type(String(i + 1), { delay: 8 }); } await sleep(200); };
    // Where the visitor SETTLES: the path must be `want` and stay so for 2.5 s. (The train's floor, 4 Oct 2026: this used
    // to return on the first sight of `want`, so it passed on a page the app only passes THROUGH. A named Dreamer is
    // pushed to /couple/onboarding, which forwards a session that already has a name to /couple/pin at once; a slow
    // machine saw the first path, a fast one only the second.)
    const where = async (want, ms) => { const end = Date.now() + (ms || (SHORT ? 12000 : 150000)); let at = ''; let since = 0; while (Date.now() < end) { at = await p.evaluate(() => location.pathname).catch(() => at); if (at === want) { if (!since) since = Date.now(); if (Date.now() - since >= 2500) return at; } else since = 0; await sleep(250); } return at; };
    const session = (key) => p.evaluate((k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (_e) { return null; } }, key).catch(() => undefined);
    const stored = () => p.evaluate(() => Object.keys(localStorage).filter((k) => /session|token/.test(k))).catch(() => []);
    const of = (door) => calls.filter((c) => c.door === door);
    return { p, ctx, calls, tap, disabled, words, fill, code, where, session, stored, of, close: () => ctx.close() };
  }
  const PHONE = 'input[type="tel"][placeholder="00000 00000"]';
  const NAME = 'input[placeholder="First name"]';
  const YOUR = 'input[autocomplete="name"]';
  const DOOR = { vendor: 'I\u2019m a wedding vendor', couple: 'I\u2019m getting married' };
  const doorOf = async (v, role) => (await v.tap(DOOR[role])) || v.tap(DOOR[role].replace('\u2019', "'"));
  // AMENDED BY LABEL · CE-47 LAND-1 (the founder, 9 Oct 2026): the entry's "I'm a wedding vendor" now leaves for tdw.works,
  // whose Sign in comes back to /?role=vendor-signin. So a vendor's SIGN-IN door is that address, a fresh visit; a Dreamer's
  // is still the entry's own door. The sign-UP door (Sign up, then the chooser) is unchanged for both, so every
  // "await v.tap('Sign up'); await doorOf(v, role)" stands. For a vendor the "name typed at an abandoned join in the same
  // visit" ground cannot arise any more (the sign-in is a new page load); the cells stand and hold on the fresh visit.
  const signInDoor = async (v, role) => { if (role !== 'vendor') return doorOf(v, role); await v.p.goto(`http://localhost:${PORT}/?role=vendor-signin`, { waitUntil: 'domcontentloaded', timeout: 240000 }); await v.p.waitForSelector(PHONE, { timeout: 60000 }).catch(() => {}); await sleep(600); return true; };
  // Back, as a visitor taps it, until the two doors are on the glass again (the page's state, a typed name included, survives).
  const goBack = async (v) => { for (let i = 0; i < 4; i += 1) { if (await v.p.evaluate(() => Array.from(document.querySelectorAll('button')).some((b) => b.innerText.trim().toLowerCase() === 'sign up'))) return; await v.p.evaluate(() => { const b = Array.from(document.querySelectorAll('button')).find((x) => { const t = x.innerText.trim(); return t.length > 0 && t.length <= 2 && !/[A-Za-z0-9]/.test(t); }); if (b) b.click(); }); await sleep(500); } };
  // A Dreamer with a name and no PIN is pushed to /couple/onboarding (the hook), and that page forwards a session that
  // already has a name to the PIN (app/(auth)/couple/onboarding/page.tsx: `if (s?.name) router.replace('/couple/pin')`).
  // The resting place is the PIN. Unchanged by F-44.271: a join always carried a name and always came to rest here.
  // FE9_PLANT_REST is the seat's red side only (the old expectation); bare, as every floor runs it, it is the PIN.
  const REST_DREAMER = process.env.FE9_PLANT_REST || '/couple/pin';
  const SKEY = { vendor: 'vendor_web_session', couple: 'couple_web_session' };
  const okProv = (role, name, pin) => ({ ok: true, user_id: 'u1', [role === 'vendor' ? 'vendor_id' : 'couple_id']: 'r1', pin_set: !!pin, ...(role === 'couple' ? { name: name || null } : {}) });
  const VERIFY = (name) => ({ ok: true, access_token: 'at', refresh_token: 'rt', name: name || null });
  // WEB-4 cut 11 (the chair's relay, 3 Oct 2026), verify-otp for a number with no account: a session and no ids.
  const VERIFY_NEW = { ok: true, new_account: true, user_id: null, vendor_id: null, pin_set: false, name: null, access_token: 'at', refresh_token: 'rt' };
  const REFUSE_NAME = { __status: 400, ok: false, reason: 'name_required', field: 'name', error: 'Please add your name.' };
  const VERIFIES = [['today\u2019s server', VERIFY(null)], ['cut 11 (new_account)', VERIFY_NEW]];
  const ABSENT = { ok: true, exists: false, pin_set: false };
  const KNOWN = { ok: true, exists: true, pin_set: false, role_id: 'r1', user_id: 'u1' };

  try {
    // ── §1 JOIN ────────────────────────────────────────────────────────────────────────────────────────────────
    if (runs(1)) for (const role of ['vendor', 'couple']) for (const [srv, ver] of VERIFIES) {
      sec(`1 join, ${role}, ${srv}`);
      const v = await visitor({ status: ABSENT, verify: ver, provision: (b) => (b && b.name ? okProv(role, b.name, false) : REFUSE_NAME) });
      await v.tap('Sign up'); await doorOf(v, role);
      if (role === 'couple') await v.tap('Continue \u2192');
      await v.p.waitForSelector(NAME, { timeout: SHORT ? 6000 : 30000 }).catch(() => {});
      await v.fill(PHONE, '9876500011');
      if (role === 'vendor') await v.tap('Makeup');
      ok((await v.disabled('Send code \u2192')) === true, `1.1 ${role}, ${srv}: with no name, Send code is off`);
      await v.fill(NAME, 'Asha');
      await v.tap('Send code \u2192');
      const s = v.of('send-otp')[0];
      ok(s && s.role === role && s.body.name === 'Asha' && s.body.phone === '+919876500011', `1.2 ${role}, ${srv}: the name rides the send-code request`, JSON.stringify(s));
      await v.code(); await v.tap('Verify \u2192');
      const want = role === 'vendor' ? '/vendor/pin' : REST_DREAMER;
      const at = await v.where(want);
      const pr = v.of('provision');
      ok(pr.length === 1 && pr[0].body.name === 'Asha' && (role === 'vendor' ? pr[0].body.category === 'makeup' : !('category' in pr[0].body)), `1.3 ${role}, ${srv}: one provision, carrying the name${role === 'vendor' ? ' and the craft' : ''}`, JSON.stringify(pr));
      const sess = await v.session(SKEY[role]);
      ok(at === want && sess && sess.name === 'Asha', `1.4 ${role}, ${srv}: let in (${want}) with the name on the session`, JSON.stringify({ at, name: sess && sess.name }));
      await v.close();
    }

    // ── §2 SIGN-IN, UNKNOWN NUMBER ─────────────────────────────────────────────────────────────────────────────
    if (runs(2)) for (const role of ['vendor', 'couple']) for (const [srv, ver] of VERIFIES) {
      sec(`2 sign-in with an unknown number, ${role}, ${srv}`);
      const v = await visitor({ status: ABSENT, verify: ver, provision: (b) => (b && b.name ? okProv(role, b.name, false) : REFUSE_NAME) });
      // a name typed at an abandoned join, for some other number
      await v.tap('Sign up'); await doorOf(v, role);
      if (role === 'couple') await v.tap('Continue \u2192');
      await v.p.waitForSelector(NAME, { timeout: SHORT ? 6000 : 30000 }).catch(() => {});
      await v.fill(NAME, 'Priya');
      await goBack(v);
      await signInDoor(v, role);
      await v.fill(PHONE, '9876500022');
      await v.tap('Continue \u2192');
      await v.p.waitForSelector(NAME, { timeout: SHORT ? 6000 : 30000 }).catch(() => {});
      const st = v.of('pin-status')[0];
      ok(st && st.body.role === role && st.body.phone === '+919876500022', `2.1 ${role}, ${srv}: the number is looked up first`, JSON.stringify(st));
      const onJoin = await v.p.evaluate((n, ph) => { const a = document.querySelector(n); const b = document.querySelector(ph); return { name: a ? a.value : null, phone: b ? b.value : null }; }, NAME, PHONE);
      ok(onJoin.name === '' && onJoin.phone === '9876500022', `2.2 ${role}, ${srv}: the SIGN-UP screen opens, the phone already filled, the name empty`, JSON.stringify(onJoin));
      ok(v.of('send-otp').length === 0 && v.of('provision').length === 0, `2.3 ${role}, ${srv}: no code was sent and nothing was created (no silent sign-up)`, JSON.stringify(v.calls.map((c) => c.door)));
      ok((await v.disabled('Send code \u2192')) === true, `2.4 ${role}, ${srv}: Send code is off until there is a name`);
      await v.fill(NAME, 'Meera');
      if (role === 'vendor') {
        ok((await v.disabled('Send code \u2192')) === true, `2.5 vendor, ${srv}: with a name but no craft, Send code is still off`);
        await v.tap('Photography');
      }
      await v.tap('Send code \u2192');
      const s = v.of('send-otp')[0];
      ok(s && s.body.name === 'Meera', `2.6 ${role}, ${srv}: the code is sent with the name typed here`, JSON.stringify(s));
      await v.code(); await v.tap('Verify \u2192');
      const want = role === 'vendor' ? '/vendor/pin' : REST_DREAMER;
      const at = await v.where(want);
      const pr = v.of('provision');
      ok(at === want && pr.length === 1 && pr[0].body.name === 'Meera' && (role !== 'vendor' || pr[0].body.category === 'photography'), `2.7 ${role}, ${srv}: the account is made WITH the name${role === 'vendor' ? ' and the craft' : ''}`, JSON.stringify({ at, pr }));
      await v.close();
    }

    // ── §3 SIGN-IN, KNOWN AND NAMELESS ─────────────────────────────────────────────────────────────────────────
    // Three servers: today's (ok, no name anywhere), WEB-4's refusal by reason, and by needs_name.
    const SERVERS = [
      ['today\u2019s server (ok, no name)', (role) => (b) => okProv(role, b && b.name, false)],
      ['cut 11, a returning nameless account (200, needs_name)', (role) => (b) => (b && b.name ? okProv(role, b.name, false) : { ...okProv(role, null, false), needs_name: true })],
      ['cut 11, a new account reaching provision with no name (400, name_required)', (_role) => (b) => (b && b.name ? okProv(_role, b.name, false) : REFUSE_NAME)],
    ];
    if (runs(3)) for (const role of ['vendor', 'couple']) {
      for (const [label, prov] of SERVERS) {
        sec(`3 sign-in, known and nameless, ${role}, ${label}`);
        // the third server is the path where the lookup failed (pin-status not ok), so a NEW number got its code from the sign-in door
        const fresh = /name_required/.test(label);
        const v = await visitor({ status: fresh ? { __status: 500, ok: false, error: 'database_error' } : KNOWN, verify: fresh ? VERIFY_NEW : VERIFY(null), provision: prov(role) });
        // 3.7's ground: a name typed at the join door and abandoned IN THE SAME VISIT (the state survives the Back).
        await v.tap('Sign up'); await doorOf(v, role);
        if (role === 'couple') await v.tap('Continue \u2192');
        await v.p.waitForSelector(NAME, { timeout: SHORT ? 6000 : 30000 }).catch(() => {});
        await v.fill(NAME, 'Priya');
        await goBack(v);
        await signInDoor(v, role);
        await v.fill(PHONE, '9876500033');
        await v.tap('Continue \u2192');
        await v.p.waitForSelector('input[autocomplete="one-time-code"]', { timeout: SHORT ? 6000 : 30000 }).catch(() => {});
        const s = v.of('send-otp')[0];
        ok(s && !('name' in s.body), `3.1 ${role}, ${label}: a known number gets its code; the sign-in door sends no name`, JSON.stringify(s));
        await v.code(); await v.tap('Verify \u2192');
        await v.p.waitForSelector('[data-your-name]', { timeout: SHORT ? 6000 : 30000 }).catch(() => {});
        const w = await v.words();
        ok(w.includes('Your name') && w.includes('Please add your name.'), `3.2 ${role}, ${label}: after the code, the screen says "Your name" and "Please add your name."`, w.slice(0, 200));
        const st = await v.stored(); const at0 = await v.p.evaluate(() => location.pathname);
        ok(st.length === 0 && at0 === '/', `3.3 ${role}, ${label}: nothing is stored and nothing has opened before the name`, JSON.stringify({ st, at0 }));
        ok((await v.disabled('Continue \u2192')) === true, `3.4 ${role}, ${label}: Continue is off while the name is empty`);
        await v.fill(YOUR, '   '); 
        ok((await v.disabled('Continue \u2192')) === true, `3.5 ${role}, ${label}: spaces are not a name`);
        await v.fill(YOUR, 'Ritu');
        await v.tap('Continue \u2192');
        const want = role === 'vendor' ? '/vendor/pin' : REST_DREAMER;
        const at = await v.where(want);
        const pr = v.of('provision');
        ok(pr.length === 2 && pr[1].body.name === 'Ritu' && v.of('verify-otp').length === 1, `3.6 ${role}, ${label}: provision runs again WITH the name; the code is not asked for twice`, JSON.stringify(pr));
        ok(pr[0] && !('name' in pr[0].body) && !('category' in pr[0].body), `3.7 ${role}, ${label}: the name typed at an abandoned join ("Priya") was NOT sent from the sign-in path`, JSON.stringify(pr[0]));
        const sess = await v.session(SKEY[role]);
        ok(at === want && sess && sess.name === 'Ritu', `3.8 ${role}, ${label}: then let in (${want}), the name on the session`, JSON.stringify({ at, name: sess && sess.name }));
        await v.close();
      }
    }

    // ── §4 SIGN-IN, KNOWN AND NAMED (unchanged) ────────────────────────────────────────────────────────────────
    if (runs(4)) for (const role of ['vendor', 'couple']) {
      sec(`4 sign-in, known and named, ${role}`);
      const v = await visitor({ status: KNOWN, verify: VERIFY('Asha Studio'), provision: () => okProv(role, 'Asha Studio', true) });
      await signInDoor(v, role);
      await v.fill(PHONE, '9876500044');
      await v.tap('Continue \u2192');
      await v.p.waitForSelector('input[autocomplete="one-time-code"]', { timeout: SHORT ? 6000 : 30000 }).catch(() => {});
      await v.code(); await v.tap('Verify \u2192');
      const want = role === 'vendor' ? '/vendor/pin-login' : '/couple/pin-login';
      const at = await v.where(want);
      const sess = await v.session(SKEY[role]);
      ok(at === want && v.of('provision').length === 1 && !('name' in v.of('provision')[0].body) && sess && sess.name === 'Asha Studio', `4.1 ${role}: one provision, no name screen, in as before (${want})`, JSON.stringify({ at, calls: v.calls.map((c) => c.door), name: sess && sess.name }));
      await v.close();

      const q = await visitor({ status: { ...KNOWN, pin_set: true }, verify: VERIFY('Asha Studio'), provision: () => okProv(role, 'Asha Studio', true) });
      await signInDoor(q, role);
      await q.fill(PHONE, '9876500055');
      await q.tap('Continue \u2192');
      const at2 = await q.where(want);
      ok(at2 === want && q.of('send-otp').length === 0, `4.2 ${role}: a number with a PIN goes straight to the PIN, no code (unchanged)`, JSON.stringify({ at2, calls: q.calls.map((c) => c.door) }));
      await q.close();
    }
    if (runs(5)) {
      sec('5 a refusal that stands: the number belongs to another kind of account (409)');
      const v = await visitor({ status: KNOWN, verify: { __status: 409, ok: false, reason: 'identity_bound_elsewhere', error: 'This number is already in use.' }, provision: () => okProv('vendor', null, false) });
      await signInDoor(v, 'vendor'); await v.fill(PHONE, '9876500066'); await v.tap('Continue \u2192');
      await v.p.waitForSelector('input[autocomplete="one-time-code"]', { timeout: 30000 }).catch(() => {});
      await v.code(); await v.tap('Verify \u2192'); await sleep(400);
      const w = await v.words(); const st = await v.stored();
      ok(w.includes('This number is already in use.') && !w.includes('Your name') && v.of('provision').length === 0 && st.length === 0 && (await v.p.evaluate(() => location.pathname)) === '/',
        '5.1 the server\u2019s own words are shown, no name screen, nothing created, nothing stored (as today)', JSON.stringify({ w: w.slice(-120), st, calls: v.calls.map((c) => c.door) }));
      await v.close();
    }
    if (runs(6)) {
      const GONE = { __status: 404, ok: false, reason: 'account_not_found', error: 'No account for this number. Please sign up first.' };
      const ROOMS = [['vendor, classic layout', '/vendor/pin-reset', ['tdw_layout', 'classic']], ['vendor, new layout', '/vendor/pin-reset', ['tdw_layout', 'v2']], ['Dreamer', '/couple/pin-reset', null]];
      for (const [who, at, cookie] of ROOMS) {
        sec(`6 PIN reset for an unknown number, ${who}`);
        const v = await visitor({ forgot: GONE }, { path: at, cookie: cookie ? [LAYOUT_COOKIE, cookie[1]] : null, wait: 'input[placeholder="WhatsApp number"]' });
        await v.fill('input[placeholder="WhatsApp number"]', '9876500077');
        await v.p.evaluate(() => { const e = Array.from(document.querySelectorAll('p,button')).find((x) => /^send reset code/i.test(x.innerText.trim())); if (e) e.click(); });
        await sleep(900);
        const w = await v.words(); const st = await v.stored(); const f = v.of('forgot-pin');
        const still = await v.p.evaluate(() => !!document.querySelector('input[placeholder="WhatsApp number"]') && location.pathname);
        ok(f.length === 1 && w.includes('No account for this number. Please sign up first.') && still === at && st.length === 0,
          `6.1 ${who}: the server\u2019s words are shown, the screen stays on the phone step, nothing is stored`, JSON.stringify({ asked: f.length, w: w.slice(-140), still, st }));
        await v.close();
      }
    }
  } finally {
    await browser.close();
    const s = await server.stop();
    ok(s.portFree, '9.1 the dev server stopped whole and freed its port');
  }

  console.log(`\nfe9_f44271: ${pass} pass, ${fail} fail`);
  if (fail) { console.log('FAILED: ' + failed.join(' · ')); process.exit(1); }
}

main().catch((e) => { console.log('fe9_f44271 crashed: ' + (e && e.stack || e)); process.exit(1); });
