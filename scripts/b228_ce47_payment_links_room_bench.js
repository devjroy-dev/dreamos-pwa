// scripts/b228_ce47_payment_links_room_bench.js
// TDW · CE-47 · INS · PAY-A · b228 — THE PAYMENT LINKS ROOM (app train 8), ON GLASS.
// §1 source cells on the room, its one home of calls and words, its line in routes.ts and its card. §2 glass: next dev
// in mock mode, the v2 layout, headless Chromium; the app's service worker is BYPASSED (F-44.364) so the bench sees every
// request the room makes; the server's answers are fixtures shaped exactly as the gaps package's doors answer
// (dream-os c6eec1d, src/lib/vendor/payLinks.js). §3 production mutations in temporary copies, each red on its cell.
// e-277: before the first cell, no mutation's replacement may already be present. e-275: every wait is on the thing
// itself, bounded; teardown bounded; a 15-minute ceiling. Mutation steps check free space first (lesson 5, F-44.419).
'use strict';
const fs = require('fs'); const path = require('path'); const os = require('os');
const ROOT = process.env.B228_ROOT || path.join(__dirname, '..');
const read = (r) => { try { return fs.readFileSync(path.join(ROOT, r), 'utf8'); } catch { return ''; } };
let pass = 0, fail = 0; const failed = [];
const Q = !!process.env.B228_QUIET;
function ok(c, name, info) { let v = false; try { v = typeof c === 'function' ? c() : c; } catch (e) { info = 'threw: ' + e.message; }
  if (v === true) { pass += 1; if (!Q) console.log(`  PASS  ${name}`); } else { fail += 1; failed.push(name); if (!Q) console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 220) + ']'}`); } }
const sec = (t) => { if (!Q) console.log(`\n§${t}`); };
const strip = (s) => s.replace(/^\s*\/\/.*$/gm, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
const PAGE = 'v2/app/vendor/(shell)/payment-links/page.tsx', HOME = 'v2/lib/solutions/paymentLinks.ts';

const LEFT = [[PAGE, "const list = <T,>(v: unknown): T[] => (v as T[]);"], [HOME, 'TDW may earn a commission'], [PAGE, 'takeOffRefund(e.id)']];
{ const hit = LEFT.find(([f, needle]) => read(f).includes(needle));
  if (hit && !process.env.B228_ROOT) { console.log(`b228 · STOPPED: a mutation is already present in ${hit[0]}`); process.exit(3); } }

sec('1  the room, its one home, its line in routes.ts, its card');
const PG = strip(read(PAGE)); const IN = read(HOME); const RT = read('v2/lib/solutions/routes.ts'); const PH = read('v2/lib/worklist/pageHelp.ts');
ok(() => /export default function PaymentLinksPage/.test(PG) && !/ComingRoom/.test(PG), '1.1 the room replaces the shell page at its own address');
ok(() => { const pk = (RT.match(/export const PREVIEW_KEYS[^\n]*\n?[^\n]*\]\);/) || [''])[0]; return pk.length > 0 && !pk.includes("'payment_links'") && pk.includes("'dates'"); }, '1.2 `payment_links` has left PREVIEW_KEYS');
ok(() => IN.includes("one: 'It is already on the invoice', two: 'Add it to the invoice',") && IN.includes("done: 'This payment has already been settled.', fail: 'Try again.',"), '1.3 the founder\'s answers to an unsure payment, word for word, in their one home');
ok(() => !/commission|earn|cheapest|best\b|couple|bride/i.test(strip(IN) + PG), '1.4 no word of commission or earning, no ranking word, and no client word anywhere in the room');
ok(() => /const list = <T,>\(v: unknown\): T\[\] => \(Array\.isArray\(v\) \? \(v as T\[\]\) : \[\]\);/.test(PG) && /list<PayEvent>\(room && room\.events\)/.test(PG), '1.5 every list is read tolerantly: a thin answer can never blank the room');
ok(() => /takeOffRefund\(String\(e\.provider_payment_id \|\| ''\)\)/.test(PG), '1.6 a refund is taken off by Razorpay\'s refund id, as the server keys it');
ok(() => /\[PAYMENT_LINKS_HREF\]: entry\(ROW_DESC\.payment_links, \{\n    can: how\(\['switch', 'Tap Connect Razorpay/.test(PH) && !/\[PAYMENT_LINKS_HREF\]: entry\(ROW_DESC\.payment_links, \{ can: how\(\['read', COMING_STEP\]\)/.test(PH), '1.7 its "?" card names the room\'s own buttons; the Coming card is gone');
ok(() => /const P = `\$\{SOLUTIONS_API_PATH\}\/payment-links`;/.test(IN) && ['/connect', '/connect/finish', '/links', '/invoices/', '/settings', '/take-off', '/already-on', '/add'].every((x) => IN.includes(x)), '1.8 every call goes to the room\'s own doors under Business Solutions, from one home');

const V = 'mock';
const ROOM_ON = { ok: true, configured: true, account: { provider: 'razorpay', accountId: 'acc_B228', status: 'connected' }, settings: { accept_partial: false },
  links: [], events: [
    { id: 'ev-paid', provider_payment_id: 'pay_1', kind: 'paid', amount: 5000, amount_text: 'Rs 5,000', at: '2026-10-08T10:00:00Z', applied: true },
    { id: 'ev-ref', provider_payment_id: 'rfnd_1', kind: 'refunded', amount: 2000, amount_text: 'Rs 2,000', at: '2026-10-08T11:00:00Z', applied: false },
    { id: 'ev-q', provider_payment_id: 'pay_q', kind: 'paid', amount: 3000, at: '2026-10-08T12:00:00Z', applied: false, not_applied_reason: 'BINDER_UNCERTAIN',
      question: { line: 'Rs 3,000 was received online. TDW could not tell if it is already counted on this invoice.', one: 'It is already on the invoice', two: 'Add it to the invoice' } }] };
const INVOICES = { ok: true, invoices: [{ id: 'binder-1', invoice_number: 'INV-1', client_name: 'Asha Mehra', amount_total: 60000, amount_paid: 10000, amount_owed: 50000, state: 'advance_paid', due_date: null, created_at: '2026-10-01' }], summary: { total_outstanding: 50000, total_collected: 10000 }, total: 1 };
const INFO = { ok: true, kind: 'package', invoice_id: 'inv-pk', state: 'advance_paid', owed: 50000, owed_text: 'Rs 50,000', lines: [{ id: 'ln-2', label: 'Balance', due_date: null, owed: 30000, owed_text: 'Rs 30,000' }] };

async function glass() {
  sec('2  glass: the room in Graphite and Chalk, and its acts');
  const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
  const PORT = 3000 + 228 + (process.pid % 300);
  const server = await dev.start(ROOT, PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api`, TDW_LAYOUT_DEFAULT: 'v2' });
  let browser = null;
  try {
    if (!(await server.up())) { ok(false, '2.x next dev came up'); return; }
    const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
    const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
    browser = await puppeteer.launch({ executablePath: await chromium.executablePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    const open = async (mode, roomAnswer) => {
      const p = await browser.newPage(); const sent = [];
      await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
      { const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true }); }
      await p.setCookie({ name: 'tdw_wl_mode', value: mode, domain: 'localhost', path: '/' });
      await p.setRequestInterception(true);
      p.on('request', (r) => {
        const u = r.url(); if (!u.includes('/__api/')) return r.continue();
        const m = r.method(); const pth = u.split('/__api')[1].split('?')[0]; let body = null; try { body = r.postData() ? JSON.parse(r.postData()) : null; } catch { body = r.postData(); }
        sent.push({ m, p: pth, body });
        const J = (o) => r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
        const R = '/api/v2/vendor/solutions/payment-links';
        if (pth === R && m === 'GET') return J(roomAnswer);
        if (pth.startsWith('/api/v2/vendor/money/invoices/')) return J(INVOICES);
        if (pth === R + '/invoices/binder-1') return J(INFO);
        if (pth === R + '/links') return J({ ok: true, link: { id: 'lk-1', amount: 30000, shortUrl: 'https://rzp.io/l/b228' } });
        if (pth === R + '/settings') return J({ ok: true, settings: { accept_partial: !!(body && body.accept_partial) } });
        return J({ ok: true });
      });
      await p.goto(`http://localhost:${PORT}/vendor/payment-links`, { waitUntil: 'networkidle2', timeout: 240000 });
      await p.waitForSelector('[data-pl-view="home"]', { timeout: 60000 });
      return { p, sent };
    };
    const tapText = async (p, text) => {
      const h = await p.evaluateHandle((t) => [...document.querySelectorAll('button, a, [role="button"], .fr-row')].find((e) => e.textContent.replace(/\s+/g, ' ').trim().replace(/^[^A-Za-z]+/, '').startsWith(t)) || null, text);
      const el = h.asElement(); if (!el) throw new Error('no control: ' + text); await el.click();
    };
    const textOf = (p) => p.evaluate(() => document.querySelector('[data-pl-view="home"]').innerText);

    { const { p } = await open('dark', { ok: true, configured: false, comingSoon: 'Coming soon' });
      await p.waitForFunction(() => /Payment links are not switched on yet/.test(document.body.innerText), { timeout: 60000 });
      const t = await textOf(p);
      ok(() => /This room makes payment links for your invoices\./.test(t) && /Coming soon/.test(t) && !/Connect Razorpay/.test(t), '2.1 before Razorpay approves TDW: the lede, one plain line and the Coming soon tag, and no connect control', t.slice(0, 200));
      await p.close(); }

    { const { p } = await open('dark', { ok: true });
      await p.waitForFunction(() => /This room makes payment links/.test(document.body.innerText), { timeout: 60000 }).catch(() => null);
      const t = await textOf(p).catch(() => '');
      ok(() => /This room makes payment links for your invoices\./.test(t), '2.2 a THIN answer ({ ok: true } with nothing else) still draws the room: no throw, no blank page', t.slice(0, 160));
      await p.close(); }

    for (const mode of ['dark', 'light']) {
      const { p } = await open(mode, ROOM_ON);
      await p.waitForFunction(() => /Asha Mehra/.test(document.body.innerText), { timeout: 60000 });
      const t = await textOf(p);
      ok(() => /Your Razorpay account acc_B228 is connected\./.test(t) && /Rs 50,000 is still owed on this invoice\./.test(t) && /Allow part payment on a link for the whole invoice[\s\S]*\bOff\b/.test(t), `2.3 [${mode}] connected; her invoice with what is still owed; the part-payment switch reads Off`, t.slice(0, 260));
      ok(() => /Rs 5,000 was paid through a link\./.test(t) && /Rs 2,000 was refunded to your client\./.test(t) && /Rs 3,000 was received online\. TDW could not tell if it is already counted on this invoice\./.test(t), `2.4 [${mode}] payments: paid, a refund still to take off, and an unsure payment in the founder's words`);
      await p.close();
    }

    const { p, sent } = await open('dark', ROOM_ON);
    await p.waitForFunction(() => /Asha Mehra/.test(document.body.innerText), { timeout: 60000 });
    await tapText(p, 'Asha Mehra');
    await p.waitForFunction(() => /Make a link for this instalment/.test(document.body.innerText), { timeout: 30000 });
    await tapText(p, 'Make a link for this instalment');
    await p.waitForFunction(() => /The link is ready\./.test(document.body.innerText), { timeout: 30000 });
    const mk = sent.find((x) => x.m === 'POST' && /\/links$/.test(x.p));
    const sheet = await p.evaluate(() => document.body.innerText);
    ok(() => mk && mk.body && mk.body.invoiceId === 'inv-pk' && mk.body.milestoneId === 'ln-2' && /https:\/\/rzp\.io\/l\/b228/.test(sheet) && /Send on WhatsApp/.test(sheet), '2.5 tapping her invoice, then one instalment: the link is asked for on the PACKAGE invoice and that instalment, and shown with Copy and Send on WhatsApp', JSON.stringify(mk));
    await p.keyboard.press('Escape').catch(() => null);
    await p.goto(`http://localhost:${PORT}/vendor/payment-links`, { waitUntil: 'networkidle2', timeout: 120000 });
    await p.waitForFunction(() => /Asha Mehra/.test(document.body.innerText), { timeout: 60000 });
    await tapText(p, 'Allow part payment on a link for the whole invoice');
    await p.waitForFunction(() => true, { timeout: 1000 });
    const st = await (async () => { const end = Date.now() + 15000; while (Date.now() < end) { const s = sent.find((x) => x.m === 'PATCH' && /\/settings$/.test(x.p)); if (s) return s; await new Promise((r) => setTimeout(r, 100)); } return null; })();
    ok(() => st && st.body && st.body.accept_partial === true && Object.keys(st.body).join() === 'accept_partial', '2.6 the switch sends accept_partial: true and nothing else', JSON.stringify(st));
    await tapText(p, 'Rs 2,000 was refunded to your client.');
    const tk = await (async () => { const end = Date.now() + 15000; while (Date.now() < end) { const s = sent.find((x) => /\/take-off$/.test(x.p)); if (s) return s; await new Promise((r) => setTimeout(r, 100)); } return null; })();
    ok(() => tk && tk.p.endsWith('/refunds/rfnd_1/take-off'), '2.7 tapping the refund takes it off by Razorpay\'s refund id, only when she taps', JSON.stringify(tk));
    await tapText(p, 'It is already on the invoice');
    const an = await (async () => { const end = Date.now() + 15000; while (Date.now() < end) { const s = sent.find((x) => /\/already-on$/.test(x.p)); if (s) return s; await new Promise((r) => setTimeout(r, 100)); } return null; })();
    ok(() => an && an.p.endsWith('/payments/ev-q/already-on'), '2.8 her answer "It is already on the invoice" goes to that payment\'s own door', JSON.stringify(an));
    await p.close();
  } finally {
    if (browser) { const proc = browser.process && browser.process();
      const closed = await Promise.race([browser.close().then(() => true).catch(() => false), new Promise((r) => setTimeout(() => r(false), 15000))]);
      if (!closed && proc && proc.pid) { try { process.kill(proc.pid, 'SIGKILL'); } catch (_e) { /* gone */ } } }
    const st = await Promise.race([server.stop(), new Promise((r) => setTimeout(() => r({ portFree: false }), 30000))]);
    ok(() => st && st.portFree === true, '2.9 next dev stopped and its port is free');
  }
}

async function mutations() {
  if (process.env.B228_ROOT) return;
  sec('3  production mutations, each must turn its named cell red');
  // Lesson 5 (F-44.419): free space first. b228 mutates only TEMPORARY copies (never a production file in place), so
  // mutation_guard's apply/recover has nothing to guard here; the space check is what lesson 5 asks of every series.
  { const st = fs.statfsSync(process.env.TMPDIR || os.tmpdir()); const free = st.bavail * st.bsize;
    if (free < 1024 * 1024 * 1024) { console.log(`b228 · REFUSED: less than 1 GB free (${Math.round(free / 1048576)} MB); no mutation was made.`); process.exit(3); } }
  const MUT = [
    ['a thin answer blanks the room again', PAGE, 'const list = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);', 'const list = <T,>(v: unknown): T[] => (v as T[]);', '1.5'],
    ['a word of commission creeps in', HOME, "lede: 'This room makes payment links for your invoices.", "lede: 'TDW may earn a commission. This room makes payment links for your invoices.", '1.4'],
    ['the refund taken off by the wrong id', PAGE, "takeOffRefund(String(e.provider_payment_id || ''))", 'takeOffRefund(e.id)', '1.6'],
    // RE-ANCHORED BY LABEL · CE-47 app train 8 (the chair's merge): shop, brands and trends left PREVIEW_KEYS too.
    ['payment links stays Coming', 'v2/lib/solutions/routes.ts', "'rebooking', 'quotes']);", "'rebooking', 'quotes', 'payment_links']);", '1.2'],
  ];
  for (const [name, file, from, to, cell] of MUT) {
    const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'b228-'));
    for (const f of [PAGE, HOME, 'v2/lib/solutions/routes.ts', 'v2/lib/worklist/pageHelp.ts']) { fs.mkdirSync(path.dirname(path.join(tmp, f)), { recursive: true }); fs.copyFileSync(path.join(ROOT, f), path.join(tmp, f)); }
    const src = fs.readFileSync(path.join(tmp, file), 'utf8');
    if (!src.includes(from)) { ok(false, `3 · ${name}: the mutation's anchor is present`); fs.rmSync(tmp, { recursive: true, force: true }); continue; }
    fs.writeFileSync(path.join(tmp, file), src.replace(from, to));
    const r = require('child_process').spawnSync(process.execPath, [__filename], { env: { ...process.env, B228_ROOT: tmp, B228_QUIET: '1', B228_WANT: cell }, encoding: 'utf8', timeout: 60000 });
    ok(() => r.stdout.includes(`RED ${cell}`), `3 · ${name} → §${cell} red`, (r.stdout || r.stderr).slice(-200));
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

const CEILING = setTimeout(() => { console.log('\nb228 · STOPPED: over the 15-minute ceiling (a hang is not green)'); process.exit(1); }, 15 * 60 * 1000);
CEILING.unref();
(async () => {
  if (process.env.B228_WANT) { console.log(failed.some((n) => n.startsWith(process.env.B228_WANT + ' ')) ? `RED ${process.env.B228_WANT}` : 'NOT RED'); process.exit(0); }
  await mutations();
  if (!process.env.B228_SOURCE_ONLY) await glass();
  console.log(`\nb228 · ${pass} PASS · ${fail} FAIL`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.log('b228 threw: ' + (e && e.stack)); process.exit(1); });
