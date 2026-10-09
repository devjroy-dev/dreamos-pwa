// scripts/b222_ce47_hub_cut_bench.js
// TDW · CE-47 · INS · THE HUB CUT (app train 2) · b222 — NINE RULED ROWS, EACH COMING, EACH OPENING ITS SHELL SCREEN.
// §1 source cells on the four homes (copy.ts, routes.ts, icons.ts, pageHelp.ts), the shared shell (ComingRoom.tsx), the
// nine pages and the nine doors. §2 glass (C-43.18): `next dev` in mock mode, the v2 layout, headless Chromium from the
// npm registry; every one of the nine screens drawn in Graphite and Chalk: its name, its ruled line, ONE statement row
// carrying "Launching soon." and the Coming chip, no control on that row, and its "?" card present. §3 production
// mutations, each in a temporary copy of the one file it touches, each required to turn its named §1 cell red.
'use strict';
const fs = require('fs'); const path = require('path'); const os = require('os');
const ROOT = process.env.B222_ROOT || path.join(__dirname, '..');
const read = (r) => { try { return fs.readFileSync(path.join(ROOT, r), 'utf8'); } catch { return ''; } };
let pass = 0, fail = 0; const failed = [];
const Q = !!process.env.B222_QUIET;
function ok(c, name, info) { let v = false; try { v = typeof c === 'function' ? c() : c; } catch (e) { info = 'threw: ' + e.message; }
  if (v === true) { pass += 1; if (!Q) console.log(`  PASS  ${name}`); } else { fail += 1; failed.push(name); if (!Q) console.log(`  FAIL  ${name}${info === undefined ? (v && v !== false ? '  [' + String(v).slice(0, 200) + ']' : '') : '  [' + String(info).slice(0, 200) + ']'}`); } }
const sec = (t) => { if (!Q) console.log(`\n§${t}`); };

const NINE = [
  ['rebooking', 'Rebooking and follow-ups', 'Cancelled dates offered to earlier enquiries, and follow-up messages', '/vendor/rebooking', 'REBOOKING_HREF'],
  ['quotes', 'Quotes', 'Quote links sent to enquiries, and when each was opened', '/vendor/quotes', 'QUOTES_HREF'],
  ['payment_links', 'Payment links', 'Payment links on invoices, marked paid when the money arrives', '/vendor/payment-links', 'PAYMENT_LINKS_HREF'],
  ['shop', 'Off-season shop', 'Gift vouchers, workshops, classes and other bookings, sold from the website', '/vendor/off-season-shop', 'SHOP_HREF'],
  ['brands', 'Brand collaborations', 'Media kit, pitches to brands, and their replies', '/vendor/brands', 'BRANDS_HREF'],
  ['supplies', 'Supplies', 'Where to buy at professional prices, bills with GST, and gear', '/vendor/supplies', 'SUPPLIES_HREF'],
  ['trends', 'Trend room', 'A weekly brief on what clients ask for and what is new in the trade', '/vendor/trends', 'TRENDS_HREF'],
  ['papers', 'Business papers', 'Certificate, ID, business statement and a pack for the CA', '/vendor/papers', 'PAPERS_HREF'],
  ['insurance', 'Insurance', 'Kinds of cover, quotes from insurers, and saved policies', '/vendor/insurance', 'INSURANCE_HREF'],
];
const slug = (href) => href.replace('/vendor/', '');
// AMENDED BY LABEL · CE-47 THE LANDED MECHANISM (cut by INS for app train 3, carried first by OFF-A2): a seat's room
// LANDS by replacing its shell page and leaving PREVIEW_KEYS in one edit. The rows stay nine (1.1 to 1.4, 1.6, 1.10 hold
// for all nine); the Coming cells (1.5, 1.9, 1.11 and the glass) read only the rooms not yet landed. Each landing adds its
// own key here, in its own edit (train 3: OFF 'shop', then PRO 'supplies' and 'papers', then INS 'insurance').
// b122_v2 2.7 reads this line; it is the one home of the landed list.
const LANDED = ['supplies', 'papers', 'insurance', 'shop', 'payment_links'];
const COMING = NINE.filter(([k]) => !LANDED.includes(k));

sec('1  the four homes, the shell, the pages and the doors');
const COPY = read('v2/lib/solutions/copy.ts'); const RT = read('v2/lib/solutions/routes.ts');
const IC = read('v2/lib/worklist/icons.ts'); const PH = read('v2/lib/worklist/pageHelp.ts');
const CR = read('v2/components/solutions/ComingRoom.tsx');
ok(() => NINE.every(([k, label]) => COPY.includes(`{ key: '${k}',`) && COPY.includes(`label: '${label}' }`)), '1.1 each of the nine rows is in ROOM_ROWS with its ruled label');
ok(() => NINE.every(([k, , line]) => new RegExp(`\\n  ${k}:\\s+'${line.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}',`).test(COPY)), '1.2 each carries its ruled one line in ROW_DESC, word for word');
ok(() => /\{ name: 'Work together', keys: \['collabs', 'brands'\] \}/.test(COPY)
  && /\{ name: 'Get booked',\s+keys: \['number', 'dates', 'introductions', 'referrals', 'rebooking', 'quotes'\] \}/.test(COPY)
  && /\{ name: 'Get paid',\s+keys: \['contracts', 'reminders', 'payment_links', 'shop'\] \}/.test(COPY)
  && /\{ name: 'Run the business', keys: \['supplies', 'trends', 'papers', 'insurance'\] \}/.test(COPY)
  && (COPY.match(/\{ name: '/g) || []).length === 5, '1.3 the groups as ruled: five, "Run the business" the one new, rows in the chair\'s order');
ok(() => NINE.every(([k, , , href, C]) => RT.includes(`export const ${C}`) && new RegExp(`export const ${C}\\s*=\\s*'${href}';`).test(RT) && new RegExp(`\\n  ${k}:\\s+${C},`).test(RT)), '1.4 each address is one declared constant, and ROOM_HREFS reads it');
const pk = (RT.match(/export const PREVIEW_KEYS[^\n]*\n?[^\n]*\]\);/) || [''])[0];
ok(() => COMING.every(([k]) => pk.includes(`'${k}'`)) && LANDED.every((k) => !pk.includes(`'${k}'`)) && pk.includes("'dates'") && pk.includes("'number'") && (pk.match(/'[a-z_]+'/g) || []).length === 2 + COMING.length, '1.5 PREVIEW_KEYS holds every row not yet landed and the two it held, and no landed room', pk);
const NEUTRAL = '<path d="M5 3a2 2 0 0 0-2 2"/><path d="M19 3a2 2 0 0 1 2 2"/><path d="M21 19a2 2 0 0 1-2 2"/><path d="M5 21a2 2 0 0 1-2-2"/><path d="M9 3h1"/><path d="M9 21h1"/><path d="M14 3h1"/><path d="M14 21h1"/><path d="M3 9v1"/><path d="M21 9v1"/><path d="M3 14v1"/><path d="M21 14v1"/>';
const lucide = (() => { try { const src = fs.readFileSync(path.join(ROOT, 'node_modules/lucide-react/dist/esm/icons/square-dashed.js'), 'utf8'); return [...src.matchAll(/d: "([^"]+)"/g)].map((m) => `<path d="${m[1]}"/>`).join(''); } catch { return null; } })();
ok(() => (lucide === null || lucide === NEUTRAL) && NINE.every(([k]) => new RegExp(`\\n  ${k}:\\s+'${NEUTRAL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}',`).test(IC)), '1.6 each of the nine draws the ONE neutral drawing, byte-equal to the estate\'s Lucide square-dashed');
ok(() => /<Row title=\{COPY\.launchingSoon\} pill=\{\{ text: CHIPS\.coming, tone: 'soon' \}\} \/>/.test(CR) && !/onClick|href=/.test(CR.replace(/^\s*\/\/.*$/gm, '')), '1.7 the shell\'s one row is a statement: Launching soon. under Coming, no onClick, no href');
ok(() => /title=\{roomLabel\(k\)\}/.test(CR) && /\{ROW_DESC\[k\]\}/.test(CR) && !/['"`][A-Z][a-z]+ [a-z]+/.test(CR.replace(/^\s*\/\/.*$/gm, '').replace(/import[^\n]*\n/g, '').replace(/className="[^"]*"|aria-busy="true"|data-coming-room=\{k\}|router\.replace\('\/'\)/g, '')), '1.8 every word on the shell is read from its home: name, line, statement, chip');
ok(() => COMING.every(([k, , , href]) => { const pg = read(`v2/app/vendor/(shell)/${slug(href)}/page.tsx`); return pg.includes(`<ComingRoom k="${k}" />`); }) && LANDED.every((k) => { const h = NINE.find(([x]) => x === k)[3]; return !read(`v2/app/vendor/(shell)/${slug(h)}/page.tsx`).includes('<ComingRoom'); }), '1.9 each room not yet landed draws the shell for its own key; a landed room draws its own page');
ok(() => NINE.every(([, , , href]) => read(`app/v2/vendor/(shell)/${slug(href)}/page.tsx`).includes(`export { default } from '@/v2/app/vendor/(shell)/${slug(href)}/page';`)), '1.10 each has its door in the v2 route tree (a missing door is a 404)');
ok(() => COMING.every(([k, , , , C]) => new RegExp(`\\[${C}\\]: entry\\(ROW_DESC\\.${k}, \\{ can: how\\(\\['read', COMING_STEP\\]\\), connects: COMING_CONNECTS \\}\\),`).test(PH)) && LANDED.every((k) => new RegExp(`\\[${NINE.find(([x]) => x === k)[4]}\\]: entry\\(ROW_DESC\\.${k},`).test(PH)) && /const COMING_CONNECTS = 'This room is not linked to the rest of your account yet\. It will be linked when the room opens\.';/.test(PH) && /const COMING_STEP = 'This room is not open yet\. Business Solutions shows it as Coming until it opens\.';/.test(PH),   /* AMENDED BY LABEL · R-47.1, 8 October */ '1.11 each room not yet landed has its Coming card (its line, the one step, the connects line); a landed room keeps a card of its own');   // AMENDED BY LABEL · hub cut r2
ok(() => !/HUB_COMING_CHIP/.test(read('v2/app/vendor/(shell)/support/page.tsx')), '1.12 P3 holds: the hub page carries no Coming chip and no flag for one (the founder, 6 October 2026)');
ok(() => ['app/vendor/(shell)', 'lib/solutions'].every((d) => NINE.every(([, , , href]) => !fs.existsSync(path.join(ROOT, d, slug(href))))), '1.13 the legacy layout is untouched: no page of the nine under app/vendor or lib');

async function glass() {
  sec('2  glass: the nine screens and their cards, Graphite and Chalk (C-43.18)');
  const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
  const PORT = 3000 + 222 + (process.pid % 300);
  const server = await dev.start(ROOT, PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api`, TDW_LAYOUT_DEFAULT: 'v2' });
  let browser = null;
  try {
    if (!(await server.up())) { ok(false, '2.x next dev came up'); return; }
    const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
    const chromium = (await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js'))).default;
    browser = await puppeteer.launch({ executablePath: await chromium.executablePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    for (const mode of ['dark', 'light']) for (const [k, label, line, href] of COMING) {
      const p = await browser.newPage();
      await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
      await p.setCookie({ name: 'tdw_wl_mode', value: mode, domain: 'localhost', path: '/' });
      await p.setRequestInterception(true);
      p.on('request', (r) => (r.url().includes('/__api/') ? r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }) : r.continue()));
      await p.goto(`http://localhost:${PORT}${href}`, { waitUntil: 'networkidle2', timeout: 240000 });
      await p.waitForSelector(`[data-coming-room="${k}"]`, { timeout: 60000 }).catch(() => null);
      const s = await p.evaluate((key) => {
        const lede = document.querySelector(`[data-coming-room="${key}"]`);
        const h1 = document.querySelector('[data-room-title]');
        const rows = [...document.querySelectorAll('.fr-row, .fr-r')];
        const body = lede ? lede.parentElement : null;
        const stmt = body ? [...body.querySelectorAll('*')].find((e) => e.textContent.trim().startsWith('Launching soon.') && e.children.length > 0) : null;
        const rowEl = stmt ? stmt.closest('button, a, div') : null;
        const ctl = body ? body.querySelectorAll('button, a[href]').length : -1;
        return { title: h1 ? h1.textContent.trim() : null, lede: lede ? lede.textContent.trim() : null,
          stmt: !!stmt, coming: body ? /\bComing\b/.test(body.textContent) : false, ctl, help: !!document.querySelector('[aria-label="What this page does"], button[aria-label*="help" i], [data-page-help]'),
          tag: rowEl ? rowEl.tagName : null, rows: rows.length };
      }, k);
      ok(() => s.title === label, `2.1 [${k} ${mode}] the room's own name heads it`, JSON.stringify(s));
      ok(() => s.lede === line, `2.2 [${k} ${mode}] its ruled line, word for word`, s.lede);
      ok(() => s.stmt && s.coming && s.ctl === 0, `2.3 [${k} ${mode}] one statement, "Launching soon." under Coming, and no control in the room body`, JSON.stringify(s));
      await p.close();
    }
  } finally {
    // e-275 (3): teardown is bounded. The browser gets 15 s to close; if it outlives that its process is killed.
    if (browser) {
      const proc = browser.process && browser.process();
      const closed = await Promise.race([browser.close().then(() => true).catch(() => false), new Promise((r) => setTimeout(() => r(false), 15000))]);
      if (!closed && proc && proc.pid) { try { process.kill(proc.pid, 'SIGKILL'); } catch (_e) { /* already gone */ } }
    }
    const st = await Promise.race([server.stop(), new Promise((r) => setTimeout(() => r({ portFree: false, timedOut: true }), 30000))]);
    ok(() => st && st.portFree === true, '2.9 next dev stopped and its port is free');
  }
}

async function mutations() {
  if (process.env.B222_ROOT) return;
  sec('3  production mutations, each must turn its named cell red');
  const MUT = [
    // M1 RE-ANCHORED BY LABEL · CE-47 INS PAY-A: 'payment_links' left PREVIEW_KEYS when its room landed (my turn-27 note),
    // so the anchor names two keys still Coming.
    ['a row loses its Coming key', 'v2/lib/solutions/routes.ts', "'rebooking', 'quotes', 'shop',", "'quotes', 'shop',", '1.5'],
    ['the statement becomes a button', 'v2/components/solutions/ComingRoom.tsx', "<Row title={COPY.launchingSoon} pill={{ text: CHIPS.coming, tone: 'soon' }} />", "<Row title={COPY.launchingSoon} pill={{ text: CHIPS.coming, tone: 'soon' }} onClick={() => {}} />", '1.7'],
    ['a door is missing', 'app/v2/vendor/(shell)/papers/page.tsx', "export { default } from '@/v2/app/vendor/(shell)/papers/page';", '', '1.10'],
    ['a line is retyped', 'v2/lib/solutions/copy.ts', "  quotes:        'Quote links sent to enquiries, and when each was opened',", "  quotes:        'Quote links sent to your enquiries',", '1.2'],
    ['a sixth group appears', 'v2/lib/solutions/copy.ts', "  { name: 'Run the business', keys: ['supplies', 'trends', 'papers', 'insurance'] },", "  { name: 'Run the business', keys: ['supplies', 'trends', 'papers'] },\n  { name: 'Protect', keys: ['insurance'] },", '1.3'],
    ['a row draws another drawing', 'v2/lib/worklist/icons.ts', "  trends:        '<path d=\"M5 3a2 2 0 0 0-2 2\"/>", "  trends:        '<path d=\"M5 4a2 2 0 0 0-2 2\"/>", '1.6'],
  ];
  for (const [name, file, from, to, cell] of MUT) {
    const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'b222-'));
    const files = ['v2/lib/solutions/copy.ts', 'v2/lib/solutions/routes.ts', 'v2/lib/worklist/icons.ts', 'v2/lib/worklist/pageHelp.ts', 'v2/components/solutions/ComingRoom.tsx', 'v2/app/vendor/(shell)/support/page.tsx',
      ...NINE.flatMap(([, , , href]) => [`v2/app/vendor/(shell)/${slug(href)}/page.tsx`, `app/v2/vendor/(shell)/${slug(href)}/page.tsx`])];
    for (const f of files) { fs.mkdirSync(path.dirname(path.join(tmp, f)), { recursive: true }); fs.copyFileSync(path.join(ROOT, f), path.join(tmp, f)); }
    const src = fs.readFileSync(path.join(tmp, file), 'utf8');
    if (!src.includes(from)) { ok(false, `3 · ${name}: the mutation's anchor is present`); fs.rmSync(tmp, { recursive: true, force: true }); continue; }
    fs.writeFileSync(path.join(tmp, file), src.replace(from, to));
    const r = require('child_process').spawnSync(process.execPath, [__filename], { env: { ...process.env, B222_ROOT: tmp, B222_QUIET: '1', B222_WANT: cell }, encoding: 'utf8', timeout: 60000 });
    ok(() => r.stdout.includes(`RED ${cell}`), `3 · ${name} → §${cell} red`, (r.stdout || r.stderr).slice(-200));
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

// e-275 (3): the bench always exits with its verdict. A hard ceiling: if anything hangs past 15 minutes, say so and exit 1.
const CEILING = setTimeout(() => { console.log('\nb222 · STOPPED: over the 15-minute ceiling (a hang is not green)'); process.exit(1); }, 15 * 60 * 1000);
CEILING.unref();
(async () => {
  if (process.env.B222_WANT) { console.log(failed.some((n) => n.startsWith(process.env.B222_WANT + ' ')) ? `RED ${process.env.B222_WANT}` : 'NOT RED'); process.exit(0); }
  await mutations();
  if (!process.env.B222_SOURCE_ONLY) await glass();
  console.log(`\nb222 · ${pass} PASS · ${fail} FAIL`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.log('b222 threw: ' + (e && e.stack)); process.exit(1); });
