// scripts/b223_ce47_insurance_room_bench.js
// TDW · CE-47 · INS-A · b223 — THE INSURANCE ROOM (app train 3), ON GLASS.
// §1 source cells on the room page, its one home of calls and words, its one line in routes.ts and its "?" card.
// §2 glass (C-43.18): next dev in mock mode, the v2 layout, headless Chromium from the npm registry; the server's answers
// are fixtures shaped exactly as dream-os INS-A r3's doors answer (src/lib/vendor/insuranceRoom.js), and every request
// the room makes is recorded, so a cell can say what was SENT, not only what was drawn. Graphite and Chalk for the room's
// home; the acts (the switch, Get a quote and her brief, adding a policy from upload to save) in Graphite.
// §3 production mutations in temporary copies, each required to turn its named §1 cell red.
// e-275: no fixed pause (every wait is on the thing itself, bounded); teardown bounded; a hard ceiling; nothing loosened.
'use strict';
const fs = require('fs'); const path = require('path'); const os = require('os');
const ROOT = process.env.B223_ROOT || path.join(__dirname, '..');
const read = (r) => { try { return fs.readFileSync(path.join(ROOT, r), 'utf8'); } catch { return ''; } };
let pass = 0, fail = 0; const failed = [];
const Q = !!process.env.B223_QUIET;
function ok(c, name, info) { let v = false; try { v = typeof c === 'function' ? c() : c; } catch (e) { info = 'threw: ' + e.message; }
  if (v === true) { pass += 1; if (!Q) console.log(`  PASS  ${name}`); } else { fail += 1; failed.push(name); if (!Q) console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 220) + ']'}`); } }
const sec = (t) => { if (!Q) console.log(`\n§${t}`); };
// B223_SHOTS=<dir>: also save the pictures the founder's pack carries (no cell depends on them).
const shot = async (p, name) => { if (process.env.B223_SHOTS) { fs.mkdirSync(process.env.B223_SHOTS, { recursive: true }); await p.screenshot({ path: path.join(process.env.B223_SHOTS, name + '.png') }); } };
const strip = (s) => s.replace(/^\s*\/\/.*$/gm, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

// e-277: before the first cell, no mutation's REPLACEMENT is already present in a production file (a mutation left
// behind by a killed run would make every later run read a mutated room). b223 mutates only temporary copies, so this is
// a guard, not a cleanup: it names the file and stops.
{
  const LEFT = [["v2/app/vendor/(shell)/insurance/page.tsx", "pill={{ text: INS.comingSoon, tone: 'soon' }} onClick={() => {}} />"],
                ['v2/lib/solutions/insurance.ts', 'TDW may earn a commission']];
  const hit = LEFT.find(([f, needle]) => read(f).includes(needle));
  if (hit && !process.env.B223_ROOT) { console.log(`b223 · STOPPED: a mutation is already present in ${hit[0]}`); process.exit(1); }
}
sec('1  the room, its one home, its line in routes.ts, its card');
const PG = strip(read('v2/app/vendor/(shell)/insurance/page.tsx'));
const IN = read('v2/lib/solutions/insurance.ts');
const RT = read('v2/lib/solutions/routes.ts'); const PH = read('v2/lib/worklist/pageHelp.ts');
ok(() => /export default function InsurancePage/.test(PG) && !/ComingRoom/.test(PG), '1.1 the room replaces the shell page at its own address');
// 1.2 asks only what is INS's own: 'insurance' is out of PREVIEW_KEYS. Other seats' keys move in their own edits (train 3
// is layered, OFF then PRO then INS), so no other key is pinned here; b222 1.5 holds the whole set against its LANDED list.
ok(() => { const pk = (RT.match(/export const PREVIEW_KEYS[^\n]*\n?[^\n]*\]\);/) || [''])[0]; return pk.length > 0 && !pk.includes("'insurance'") && pk.includes("'dates'") && pk.includes("'number'"); }, '1.2 `insurance` has left PREVIEW_KEYS (the others are b222\'s to hold)');
ok(() => /<Row title=\{INS\.buyHereComing\} pill=\{\{ text: INS\.comingSoon, tone: 'soon' \}\} \/>/.test(PG), '1.3 the "Buy a policy" row is a statement with the Coming soon tag: no onClick, no href');
// AMENDED BY LABEL · R-47.1 (8 October): the room's sentences were rewritten as plain statements; the pins follow them.
ok(() => IN.includes("buyHereComing: 'Soon you will be able to buy a policy from the insurer you choose, here in TDW. TDW will take no fee.'") && IN.includes("notChecked: 'You confirmed these details. TDW has not checked them.'") && IN.includes("quoteNote: 'Each one sets its own price and may charge its own fees. TDW takes nothing.'"), '1.4 the ruled words, word for word, in their one home');
ok(() => /\{INS\.notChecked\}/.test(PG) && (PG.match(/data-ins-not-checked/g) || []).length === 1, '1.5 "Not checked by TDW" sits once under the Policies group (ruling b as placed, 6 October)');
ok(() => /<p className="wl-shnote">\{brief\.fee_line\}<\/p>/.test(PG) && /<CopyBox text=\{brief\.text\}/.test(PG), '1.6 her brief shows the insurer\'s own fee line, and the brief in a CopyBox (R-46.17)');
ok(() => /quoteBrief\(d\.name, answers, kinds\.map\(\(k\) => k\.key\)\)/.test(PG), '1.7 the brief is asked for with her own answers and the kinds she was shown, nothing else');
// The one ruled sentence that names recommending does so to deny it (the founder's pictures, 4 October); it is taken out
// by its exact bytes, so any OTHER use of these words still reddens.
const RULED_DENIAL = 'These are kinds of cover, not policies. TDW does not recommend any insurer or policy. TDW takes no fee from any insurer.';   // R-47.1, by label
ok(() => IN.includes(RULED_DENIAL) && !/commission|earn|recommend|best|cheapest|couple|bride/i.test(strip(IN).replace(RULED_DENIAL, '') + PG), '1.8 no word of commission, earning, recommending or ranking, and no client word, anywhere in the room (the ruled denial aside)');
ok(() => /\[INSURANCE_HREF\]: entry\(ROW_DESC\.insurance, \{\n    can: how\(\['read', 'What cover do I need asks five questions/.test(PH) && !/\[INSURANCE_HREF\]: entry\(ROW_DESC\.insurance, \{ can: how\(\['read', 'This room is not open yet/.test(PH), '1.9 its "?" card names the room\'s own buttons; the Coming card is gone');
ok(() => /const P = `\$\{SOLUTIONS_API_PATH\}\/insurance`;/.test(IN) && ['/kinds', '/quote-brief', '/policies/upload-url', '/policies/read', '/policies', '/settings'].every((x) => IN.includes(x)), '1.10 every call goes to INS-A r3\'s doors under Business Solutions, from one home');

// ── fixtures, shaped as the server answers ─────────────────────────────────────────────────────────────────────────────
const NOTC = 'You confirmed these details. TDW has not checked them.';   // R-47.1, by label
const POLICIES = [
  { id: 'p-1', kind: 'equipment', kind_title: 'Kit and equipment cover', insurer: 'HDFC ERGO', cover_amount: 300000, ends_on: '2027-02-14', has_document: true, state: 'in_date', state_label: 'In date', facts: 'HDFC ERGO · Rs 3,00,000 · ends 14 February 2027', checked: NOTC },
  { id: 'p-2', kind: 'public_liability', kind_title: 'Public liability', insurer: 'ICICI Lombard', cover_amount: 1000000, ends_on: '2026-11-02', has_document: false, state: 'renew_soon', state_label: 'Renew soon', facts: 'ICICI Lombard · Rs 10,00,000 · ends 2 November 2026', checked: NOTC },
];
const NAMES = ['Acko', 'Bajaj General', 'Digit', 'HDFC ERGO', 'ICICI Lombard', 'IFFCO-Tokio', 'InsuranceDekho', 'National Insurance', 'New India Assurance', 'Oriental Insurance', 'Policybazaar', 'SBI General', 'Tata AIG', 'United India'];
const DEST = NAMES.map((n) => ({ name: n, label: ['InsuranceDekho', 'Policybazaar'].includes(n) ? 'Comparison site' : 'Insurer', url: 'https://example.invalid/' + n.length, mode: 'link', fee_line: `This opens ${n}'s own website. ${n} sets its own price and may charge its own fees. TDW takes nothing.` }));
const ROOM = (on) => ({ ok: true, policies: POLICIES, show_mark: on, mark_showing: on, destinations: DEST });
const BRIEF = 'Cover enquiry from Studio B223, Makeup, Delhi.\nWeddings delivered through The Dream Wedding: 14 (counted by The Dream Wedding).\nPlease send a quote by reply.';

async function glass() {
  sec('2  glass: the room in Graphite and Chalk, and its acts');
  const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
  const PORT = 3000 + 223 + (process.pid % 300);
  const server = await dev.start(ROOT, PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api`, TDW_LAYOUT_DEFAULT: 'v2' });
  let browser = null;
  try {
    if (!(await server.up())) { ok(false, '2.x next dev came up'); return; }
    const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
    const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
    browser = await puppeteer.launch({ executablePath: await chromium.executablePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    const open = async (mode) => {
      const p = await browser.newPage(); const sent = []; let markOn = false;
      await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
      // The app's service worker (public/sw.js) answers /api/ itself, so the page's own interceptor would never see the
      // room's requests: bypassed as the estate's benches do (b143 :212).
      { const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true }); }
      await p.setCookie({ name: 'tdw_wl_mode', value: mode, domain: 'localhost', path: '/' });
      const errs = []; p.on('pageerror', (e) => errs.push(String(e && e.message).slice(0, 200))); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
      await p.setRequestInterception(true);
      p.on('request', (r) => {
        const u = r.url();
        if (u.includes('/__upload/')) { sent.push({ m: r.method(), u: '/__upload', ct: r.headers()['content-type'] }); return r.respond({ status: 200, contentType: 'application/json', body: '{}' }); }
        if (!u.includes('/__api/')) return r.continue();
        const m = r.method(); const pth = u.split('/__api')[1].split('?')[0]; let body = null; try { body = r.postData() ? JSON.parse(r.postData()) : null; } catch { body = r.postData(); }
        sent.push({ m, p: pth, body });
        const J = (o) => r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
        const I = '/api/v2/vendor/solutions/insurance';
        if (pth === I && m === 'GET') return J(ROOM(markOn));
        if (pth === I + '/settings' && m === 'PATCH') { markOn = !!(body && body.show_mark); return J(ROOM(markOn)); }
        if (pth === I + '/kinds') return J({ ok: true, kinds: [{ key: 'equipment', title: 'Kit and equipment cover', example: 'A kit bag goes missing.' }] });
        if (pth === I + '/quote-brief') return J({ ok: true, insurer: body.insurer, url: 'https://example.invalid/digit', fee_line: DEST.find((d) => d.name === body.insurer).fee_line, text: BRIEF });
        if (pth === I + '/policies/upload-url') return J({ ok: true, path: 'v-1/00000000-0000-4000-8000-000000000223.pdf', upload_url: `http://localhost:${PORT}/__upload/x` });
        if (pth === I + '/policies/read') return J({ ok: true, prefill: { insurer: 'HDFC ERGO', kind: 'equipment', cover_amount: 300000, ends_on: '2027-02-14' } });
        if (pth === I + '/policies' && m === 'POST') return J({ ok: true, policy: POLICIES[0] });
        return J({ ok: true });
      });
      await p.goto(`http://localhost:${PORT}/vendor/insurance`, { waitUntil: 'networkidle2', timeout: 240000 });
      await p.waitForSelector('[data-ins-view="home"]', { timeout: 60000 });
      const loaded = await p.waitForFunction(() => /HDFC ERGO/.test(document.body.textContent), { timeout: 60000 }).then(() => true).catch(() => false);
      if (!loaded) throw new Error('the room did not draw its policies; requests seen: ' + JSON.stringify(sent.map((x) => `${x.m} ${x.p || x.u}`)) + ' body: ' + (await p.evaluate(() => document.body.innerText.slice(0, 300))) + ' errors: ' + JSON.stringify(errs.slice(0, 4)));
      return { p, sent };
    };
    const tapText = async (p, text) => {
      const h = await p.evaluateHandle((t) => [...document.querySelectorAll('button, a')].find((e) => e.textContent.replace(/\s+/g, ' ').trim().replace(/^[^A-Za-z]+/, '').startsWith(t)) || null, text);
      const el = h.asElement(); if (!el) throw new Error('no control: ' + text); await el.click();
    };

    for (const mode of ['dark', 'light']) {
      const { p } = await open(mode);
      const s = await p.evaluate(() => { const v = document.querySelector('[data-ins-view="home"]'); const t = v.innerText;
        return { lede: (v.querySelector('.fr-lede') || {}).textContent, nc: (t.match(/TDW has not checked them\./g) || []).length, hdfc: /Kit and equipment cover/.test(t) && /In date/.test(t), icici: /Renew soon/.test(t), off: /Show Insured on my website/.test(t) && /\bOff\b/.test(t), find: /What cover do I need/.test(t) && /Get a quote/.test(t), add: !!document.querySelector('[data-room-title]') }; });
      await shot(p, `01_home__${mode}`);
      ok(() => s.lede === 'This room shows the kinds of insurance cover that fit your business. It helps you ask insurers for a quote, and it keeps your policies in one place.', `2.1 [${mode}] the room's lede`, s.lede);
      ok(() => s.hdfc && s.icici, `2.2 [${mode}] each policy with its kind and its state`, JSON.stringify(s));
      ok(() => s.nc === 1, `2.3 [${mode}] "TDW has not checked them." once, under the policies`, String(s.nc));
      ok(() => s.off && s.find, `2.4 [${mode}] the Insured switch reads Off, and Find cover holds both rows`, JSON.stringify(s));
      await p.close();
    }

    const { p, sent } = await open('dark');
    await tapText(p, 'Show Insured on my website');
    await p.waitForFunction(() => /Show Insured on my website[\s\S]*\bOn\b/.test(document.querySelector('[data-ins-view="home"]').innerText), { timeout: 30000 }).catch(() => null);
    const patch = sent.find((x) => x.m === 'PATCH' && x.p.endsWith('/settings'));
    const homeTxt = await p.evaluate(() => document.querySelector('[data-ins-view="home"]').innerText);
    ok(() => !!(patch && patch.body && patch.body.show_mark === true) && /Show Insured on my website[\s\S]*\bOn\b/.test(homeTxt), '2.5 the switch sends show_mark: true and the row reads On', JSON.stringify(patch));

    await tapText(p, 'Get a quote');
    await p.waitForSelector('[data-ins-view="quote"]', { timeout: 30000 });
    const q = await p.evaluate(() => { const v = document.querySelector('[data-ins-view="quote"]'); const t = v.innerText;
      const stmt = [...v.querySelectorAll('*')].find((e) => e.children.length > 0 && e.textContent.trim().startsWith('Soon you will be able to buy a policy from the insurer you choose')   /* by label: the founder's line, 8 October */);
      const ctl = stmt ? stmt.closest('button, a[href]') : null;
      return { comp: (t.match(/Comparison site/g) || []).length, ins: (t.match(/\bInsurer\b/g) || []).length, note: /Each one sets its own price and may charge its own fees\. TDW takes nothing\./.test(t), stmt: !!stmt, soon: /Coming soon/.test(t), ctl: !!ctl }; });
    await shot(p, '02_get_a_quote__dark');
    ok(() => q.comp === 2 && q.ins >= 12 && q.note, '2.6 Get a quote: fourteen, A to Z, two labelled Comparison site, and the fee note', JSON.stringify(q));
    ok(() => q.stmt && q.soon && q.ctl === false, '2.7 the "Buy a policy" row is there under Coming soon, and it is not a control', JSON.stringify(q));

    await tapText(p, 'Digit');
    await p.waitForFunction(() => /This opens Digit's own website/.test(document.body.textContent), { timeout: 30000 });
    const qb = sent.find((x) => x.p && x.p.endsWith('/quote-brief'));
    const b = await p.evaluate(() => ({ brief: /Cover enquiry from Studio B223/.test(document.body.textContent), wa: [...document.querySelectorAll('button')].some((e) => e.textContent.trim() === 'Send on WhatsApp'), site: [...document.querySelectorAll('button')].some((e) => e.textContent.trim() === 'Open Digit\u2019s website') }));
    await shot(p, '03_brief_digit__dark');
    ok(() => qb && qb.body && qb.body.insurer === 'Digit' && Array.isArray(qb.body.kinds), '2.8 tapping Digit asks for her brief for Digit, with her answers and kinds', JSON.stringify(qb));
    ok(() => b.brief && b.wa && b.site, '2.9 her brief is shown with Send on WhatsApp and Open Digit\u2019s website', JSON.stringify(b));
    await p.close();

    const o2 = await open('dark');
    await tapText(o2.p, 'Add a policy');
    await o2.p.waitForSelector('input[type="file"]', { timeout: 30000 });
    const tmpPdf = path.join(process.env.TMPDIR || os.tmpdir(), `b223_${process.pid}.pdf`); fs.writeFileSync(tmpPdf, '%PDF-1.4\n%b223\n');
    const fi = await o2.p.$('input[type="file"]'); await fi.uploadFile(tmpPdf);
    await o2.p.waitForFunction(() => { const i = [...document.querySelectorAll('input.wl-fi')]; return i.length && i[0].value === 'HDFC ERGO'; }, { timeout: 30000 });
    const pre = await o2.p.evaluate(() => [...document.querySelectorAll('.wl-fi')].map((e) => e.value));
    ok(() => o2.sent.some((x) => x.m === 'PUT' && x.u === '/__upload') && o2.sent.some((x) => x.p && x.p.endsWith('/policies/read')) && pre[0] === 'HDFC ERGO' && pre[1] === 'equipment' && pre[2] === '300000' && pre[3] === '2027-02-14', '2.10 upload goes to her own signed address, is read, and pre-fills every field for her to check', JSON.stringify(pre));
    await shot(o2.p, '04_add_policy_prefilled__dark');
    await tapText(o2.p, 'Save policy');
    await o2.p.waitForFunction(() => !document.querySelector('input[type="file"]'), { timeout: 30000 }).catch(() => null);
    const sv = o2.sent.find((x) => x.m === 'POST' && x.p && /\/policies$/.test(x.p));
    ok(() => sv && sv.body && sv.body.insurer === 'HDFC ERGO' && sv.body.kind === 'equipment' && sv.body.cover_amount === 300000 && sv.body.ends_on === '2027-02-14' && /\.pdf$/.test(sv.body.doc_path), '2.11 Save sends exactly the fields she saw, with her document', JSON.stringify(sv && sv.body));
    try { fs.unlinkSync(tmpPdf); } catch (_e) { /* gone */ }
    await o2.p.close();
  } finally {
    if (browser) { const proc = browser.process && browser.process();
      const closed = await Promise.race([browser.close().then(() => true).catch(() => false), new Promise((r) => setTimeout(() => r(false), 15000))]);
      if (!closed && proc && proc.pid) { try { process.kill(proc.pid, 'SIGKILL'); } catch (_e) { /* gone */ } } }
    const st = await Promise.race([server.stop(), new Promise((r) => setTimeout(() => r({ portFree: false }), 30000))]);
    ok(() => st && st.portFree === true, '2.12 next dev stopped and its port is free');
  }
}

async function mutations() {
  if (process.env.B223_ROOT) return;
  sec('3  production mutations, each must turn its named cell red');
  const MUT = [
    ['the statement becomes a control', 'v2/app/vendor/(shell)/insurance/page.tsx', "<Row title={INS.buyHereComing} pill={{ text: INS.comingSoon, tone: 'soon' }} />", "<Row title={INS.buyHereComing} pill={{ text: INS.comingSoon, tone: 'soon' }} onClick={() => {}} />", '1.3'],
    ['the fee line is dropped from the brief', 'v2/app/vendor/(shell)/insurance/page.tsx', '<p className="wl-shnote">{brief.fee_line}</p>', '', '1.6'],
    ['the not-checked line is dropped', 'v2/app/vendor/(shell)/insurance/page.tsx', '<p className="ins-note" data-ins-not-checked="">{INS.notChecked}</p>', '', '1.5'],
    // M4 re-anchored on PRO's PREVIEW_KEYS bytes (app train 3, layered OFF later, PRO, then INS).
    ['insurance stays Coming', 'v2/lib/solutions/routes.ts', "'brands', 'trends']);", "'brands', 'trends', 'insurance']);", '1.2'],
    ['a word of commission creeps in', 'v2/lib/solutions/insurance.ts', "quoteNote: 'Each one sets its own price and may charge its own fees. TDW takes nothing.'", "quoteNote: 'Each one sets its own price; TDW may earn a commission.'", '1.4'],
  ];
  for (const [name, file, from, to, cell] of MUT) {
    const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'b223-'));
    for (const f of ['v2/app/vendor/(shell)/insurance/page.tsx', 'v2/lib/solutions/insurance.ts', 'v2/lib/solutions/routes.ts', 'v2/lib/worklist/pageHelp.ts']) { fs.mkdirSync(path.dirname(path.join(tmp, f)), { recursive: true }); fs.copyFileSync(path.join(ROOT, f), path.join(tmp, f)); }
    const src = fs.readFileSync(path.join(tmp, file), 'utf8');
    if (!src.includes(from)) { ok(false, `3 · ${name}: the mutation's anchor is present`); fs.rmSync(tmp, { recursive: true, force: true }); continue; }
    fs.writeFileSync(path.join(tmp, file), src.replace(from, to));
    const r = require('child_process').spawnSync(process.execPath, [__filename], { env: { ...process.env, B223_ROOT: tmp, B223_QUIET: '1', B223_WANT: cell }, encoding: 'utf8', timeout: 60000 });
    ok(() => r.stdout.includes(`RED ${cell}`), `3 · ${name} → §${cell} red`, (r.stdout || r.stderr).slice(-200));
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

const CEILING = setTimeout(() => { console.log('\nb223 · STOPPED: over the 15-minute ceiling (a hang is not green)'); process.exit(1); }, 15 * 60 * 1000);
CEILING.unref();
(async () => {
  if (process.env.B223_WANT) { console.log(failed.some((n) => n.startsWith(process.env.B223_WANT + ' ')) ? `RED ${process.env.B223_WANT}` : 'NOT RED'); process.exit(0); }
  await mutations();
  if (!process.env.B223_SOURCE_ONLY) await glass();
  console.log(`\nb223 · ${pass} PASS · ${fail} FAIL`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.log('b223 threw: ' + (e && e.stack)); process.exit(1); });
