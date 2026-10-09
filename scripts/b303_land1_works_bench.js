#!/usr/bin/env node
'use strict';
// scripts/b303_land1_works_bench.js · CE-47 · LAND-1 · rung b303 · the tdw.works front page.
//
// §1 NODE, no server:
//   1.1 lib/public/worksHost.ts driven whole (transpiled with the tree's typescript): tdw.works and www, the page, the
//       app's paths sent on to thedreamwedding.in, every other host untouched.
//   1.2 lib/works/scenes.ts driven whole: 26 scenes (18, and LAND-1 package 2's eight), unique, landed rooms only (no Quotes, no Rebooking), the order rule
//       over 2,000 random bags, the three doors by exact address.
//   1.3 sources: middleware asks worksDecide first; next.config allows only TDW's Cloudinary folder; the four faces in
//       app/works/fonts.ts; works.css fully scoped under .tdww with reduce motion stopping the wall, the trades line,
//       the meter and the transitions; the couples' page (point 8): ?role=vendor-signin, the entry vendor door to
//       tdw.works, the partner line gone, the chooser's vendor door unchanged; the root layout's tdw.works lane.
// §2 GLASS, headless Chromium, tdw.works mapped to a local production build (`next build`, `next start`; fonts from the
//    stand-in, scripts/lib/next_fonts.js):
//   2.1 no scroll and every door on screen at 360x640, 390x844 and 1440x900, in light and in dark; the ground follows the
//       mode; 4 wall columns on a phone, 6 on a laptop.
//   2.2 the 26 scenes: 52 draws (the 3000 ms clock shortened in the page only), each bag all 26 with no repeat, never the
//       same scene twice in a row.
//   2.3 the three doors' targets, everywhere they appear.
//   2.4 a tap pauses and plays; a hidden tab stops the clock.
//   2.5 About: opens on the same page, the screens and the wall stop, Esc and Close return; a paused page stays paused.
//   2.6 reduce motion: the wall, the trades line and the meter stop; a change swaps at once, with no enter or leave.
//   2.7 faces: the heading is Bodoni Moda, and every face file the page loads for its four families is served by the site.
//   2.9 the tab icon: on tdw.works the icons point to /works/* and /favicon.ico serves da5ed966; on thedreamwedding.in
//       the five /brand/ links and the D at /favicon.ico, unchanged.
//   2.8 photographs: her two look tiles carry next/image addresses for TDW's folder at quality 60; each file the tiles can
//       ask for is weighed (150 KB at most) when this machine can reach Cloudinary, and the cell says SKIP when it cannot.
//       Discover's two tiles carry the same two (ruling 5, 9 Oct 2026).
// §3 --perf: on the same build, the first full view (the heading's face loaded, the largest paint done)
//    under two 4G profiles, 360x640: the bar is 2.5 s.
// §4 --mutate: lib/works/scenes.ts's draw() made to forget the bag; 1.2's order cell and 2.2 must go red. Restored by sha.
//
// Exit 0 all pass, 1 any fail, 3 cannot run here (no browser, no font stand-in).

const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const { spawnSync, spawn } = require('child_process');
const ts = require('typescript');

const ROOT = path.resolve(__dirname, '..');
const MUTATE = process.argv.includes('--mutate');
const PERF = process.argv.includes('--perf');
const GLASS = !process.argv.includes('--node-only');
let pass = 0, fail = 0, skip = 0;
const ok = (cond, name, detail) => { if (cond) { pass += 1; console.log(`  ok   ${name}`); } else { fail += 1; console.log(`  FAIL ${name}${detail ? `\n       ${String(detail).slice(0, 600)}` : ''}`); } };
const skipped = (name, why) => { skip += 1; console.log(`  SKIP ${name} (${why})`); };
const sec = (t) => console.log(`\n§${t}`);
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function loadTs(rel) {
  const js = ts.transpileModule(read(rel), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const m = { exports: {} }; new Function('module', 'exports', 'require', js)(m, m.exports, require); return m.exports;
}

const DOORS = {
  signin: 'https://thedreamwedding.in/?role=vendor-signin',
  start: 'https://thedreamwedding.in/?role=vendor',
  agency: 'https://thedreamwedding.in/partner/join',
};
const LANDED = ['leads', 'clients', 'bookchat', 'draft', 'contracts', 'crew', 'igdm', 'sitebuild', 'website', 'build', 'packages', 'calendar', 'invoices', 'payments', 'insurance', 'papers', 'supplies', 'trends',
  'posts', 'shop', 'discover', 'collabs', 'brands', 'kit', 'partners', 'eliza'];

// ── §4 the planted defect ────────────────────────────────────────────────────────────────────────────────────────────
const SCENES_REL = 'lib/works/scenes.ts';
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
let restore = null;
if (MUTATE) {
  const orig = read(SCENES_REL);
  const anchor = '  if (!bag.length) {';
  if (orig.split(anchor).length !== 2) { console.log('  b303: the mutation anchor is not unique in lib/works/scenes.ts; refusing'); process.exit(3); }
  const planted = orig.replace(anchor, '  bag.length = 0;   // b303 MUTATION: the bag is forgotten on every draw\n' + anchor);
  fs.writeFileSync(path.join(ROOT, SCENES_REL), planted);
  restore = () => { fs.writeFileSync(path.join(ROOT, SCENES_REL), orig); console.log(`  b303: ${SCENES_REL} restored (sha ${sha(read(SCENES_REL)) === sha(orig) ? 'matches' : 'DIFFERS'})`); };
  process.on('exit', () => { if (restore) { restore(); restore = null; } });
  console.log('  b303: MUTATION planted in draw(); 1.2 (order) and 2.2 must go red');
}

// ── §1 node ──────────────────────────────────────────────────────────────────────────────────────────────────────────
sec('1.1 the host rule (lib/public/worksHost.ts)');
{
  const { worksDecide } = loadTs('lib/public/worksHost.ts');
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  ok(eq(worksDecide('tdw.works', '/'), { kind: 'rewrite', pathname: '/works' }), 'tdw.works/ is the front page (rewrite to /works)');
  ok(eq(worksDecide('TDW.works:443', '/'), { kind: 'rewrite', pathname: '/works' }), 'case and port do not matter');
  ok(eq(worksDecide('tdw.works', '/works'), { kind: 'redirect', url: 'https://tdw.works/', status: 302 }), 'tdw.works/works goes to tdw.works/ (one address)');
  ok(eq(worksDecide('www.tdw.works', '/x', '?a=1'), { kind: 'redirect', url: 'https://tdw.works/x?a=1', status: 301 }), 'www.tdw.works goes to tdw.works, path and query kept');
  ok(eq(worksDecide('tdw.works', '/vendor/leads', '?q=1'), { kind: 'redirect', url: 'https://thedreamwedding.in/vendor/leads?q=1', status: 302 }), "the app's paths go on to thedreamwedding.in, where the sign-in lives");
  ok(eq(worksDecide('tdw.works', '/brand/favicon-32.png'), { kind: 'pass' }) && eq(worksDecide('tdw.works', '/robots.txt'), { kind: 'pass' }), 'the icons and robots.txt pass on tdw.works');
  ok(['/works/icon.svg', '/works/favicon-16.png', '/works/favicon-32.png', '/works/apple-icon-180.png', '/works/favicon.ico'].every((p) => eq(worksDecide('tdw.works', p), { kind: 'pass' }))
    && worksDecide('tdw.works', '/works/../vendor/x.png').kind === 'redirect' && worksDecide('tdw.works', '/works/page.tsx').kind === 'redirect',
    "tdw.works's five icons pass on tdw.works; nothing else under /works/ does");
  ok(['thedreamwedding.in', 'asha.thedreamwedding.in', 'demo.thedreamwedding.in', 'localhost:3000', 'tdw.works.evil.in', 'xtdw.works', ''].every((h) => worksDecide(h, '/') === null),
    'every other host is untouched (null), look-alikes included');
}

sec('1.2 the scenes (lib/works/scenes.ts)');
{
  const m = loadTs(SCENES_REL);
  const S = m.buildScenes(['<img a>', '<img b>']);
  const keys = S.map((s) => s.k);
  ok(S.length === 26 && new Set(keys).size === 26, '26 scenes, each once (the 18, and leads, clients, book by chat, the draft, contracts, crew, Instagram messages, the website being made)', keys.join(','));
  // LAND-1 package 2: the eight new scenes carry the app's own words.
  const by = (k) => (S.find((x) => x.k === k) || {}).h || '';
  ok(/Enquiries \u00b7 4 open/.test(by('leads')) && ['Instagram', 'WhatsApp', 'Website'].every((w) => by('leads').includes('>' + w + '<')) && /asked/.test(by('leads')),
    'leads: "Enquiries · N open", where each came from (Instagram, WhatsApp, Website) and what was asked');
  ok(/Booked \u00b7 3 clients/.test(by('clients')) && /Booked<\/span>/.test(by('clients')) && /Still owed/.test(by('clients')), 'clients: "Booked · N clients", their events, what is booked and what is still owed');
  ok(/Book 14 December for Tara and raise the invoice/.test(by('bookchat')) && /Booked\. The client, the event and the invoice are ready\./.test(by('bookchat')) && /Date blocked/.test(by('bookchat')) && /INV-0143/.test(by('bookchat')),
    'book by chat: her line, the app\'s "Booked. The client, the event and the invoice are ready.", the date blocked and the invoice shown');
  ok(/ask her to pay the 30% advance within 3 days/.test(by('draft')) && /Please pay the advance of Rs 24,000 \(30%\) within 3 days/.test(by('draft')) && /Draft \u00b7 not sent/.test(by('draft'))
    && /Send this to Tara\? Reply YES or NO\./.test(by('draft')) && by('draft').indexOf('Reply YES or NO') < by('draft').indexOf('Sent to Tara'),
    "the assistant's draft: her request, the draft marked not sent, the app's approval line, YES or NO, and only then sent with the time");
  ok(['Signed', 'Sent \u00b7 not signed yet', 'Draft', 'Deposit received'].every((w) => by('contracts').includes(w)), 'contracts: the app\'s states, Signed, Sent · not signed yet, Draft, Deposit received');
  ok(/Crew, and who works which shoot/.test(by('crew')) && (by('crew').match(/class="lb"/g) || []).length === 3, 'team and crew: who is on which date, three dates');
  ok(/Instagram messages/.test(by('igdm')) && /reply in your studio\u2019s name/.test(by('igdm')) && /Ilavari Studio/.test(by('igdm')), "Instagram messages: a client's message answered in her studio's name");
  ok(['Connect Instagram', 'Add my own photos', 'Building', 'Setting up', 'Nothing is published until you say yes.'].every((w) => by('sitebuild').includes(w)) && /class="now"/.test(by('sitebuild')),
    'the website being made: Instagram or her own photos, a step building, the rest setting up, nothing published until she says yes');
  ok(keys.every((k) => LANDED.includes(k)) && !keys.includes('quotes') && !keys.includes('rebooking'), 'landed rooms only: no Quotes, no Rebooking (still Coming at 96fa4e06)');
  // Ruling 5 (9 Oct 2026): Discover's two tiles carry the same two photographs.
  const withImg = S.filter((s) => s.h.includes('<img')).map((s) => s.k);
  ok(withImg.join(',') === 'website,discover' && ['website', 'discover'].every((k) => { const h = S.find((s) => s.k === k).h; return h.includes('<img a>') && h.includes('<img b>'); }),
    "the photographs are in her website's two look tiles and Discover's two tiles, nowhere else", withImg.join(','));
  const all = S.map((s) => s.w + s.cap + s.tag.join('') + s.h).join(' ');
  ok(!/—/.test(all) && !/\bcouples?\b/i.test(all), 'no em dash, no "couple" in any scene');
  ok(S.every((s) => /^[A-Za-z ]+\.$/.test(s.w) && s.cap.length > 10 && s.tag.length === 2), 'every scene has its word, its line and its tag');
  // The order rule over 2,000 bags: each bag a permutation of 26, never the same scene twice in a row across a turn.
  let bad = '';
  let x = 7; const rnd = () => { x = (x * 1103515245 + 12345) % 2147483648; return x / 2147483648; };
  const bag = []; let cur = null; const seq = [];
  for (let i = 0; i < 26 * 2000; i += 1) { const d = m.draw(bag, 26, cur, rnd); seq.push(d); if (d === cur) { bad = bad || `repeat at ${i}`; } cur = d; }
  for (let b = 0; b < 2000 && !bad; b += 1) { const part = seq.slice(b * 26, b * 26 + 26); if (new Set(part).size !== 26) bad = `bag ${b} is not all 26: ${part.join(',')}`; }
  ok(!bad, 'order: 2,000 bags, each all 26 with no repeat, never the same scene twice in a row', bad);
  {
    // The landing scene (the chair, 10 Oct 2026): drawn at random from leads, clients, book by chat, the draft, contracts.
    const POOL = ['leads', 'clients', 'bookchat', 'draft', 'contracts'];
    const seen = new Set(); let out = ''; let y = 3; const r2 = () => { y = (y * 1103515245 + 12345) % 2147483648; return y / 2147483648; };
    for (let i = 0; i < 1000; i += 1) { const k = S[m.pickFirst(S, r2)].k; seen.add(k); if (!POOL.includes(k)) out = out || k; }
    ok(!out && seen.size === 5 && JSON.stringify([...m.FIRST_POOL]) === JSON.stringify(POOL), 'the landing scene is always one of the five, and each of the five comes up (1,000 draws)', out || [...seen].join(','));
  }
  ok(m.DOORS.signIn === DOORS.signin && m.DOORS.start === DOORS.start && m.DOORS.agency === DOORS.agency, 'the three doors by exact address');
  ok(m.LOOK_PHOTOS.length === 2 && m.LOOK_PHOTOS[0].endsWith('/v1788328622/vendor_portfolio/a8c52506-d363-4a36-9cec-09b50cc32c4c/ig-5a637b957f1d.jpg')
    && m.LOOK_PHOTOS[1].endsWith('/v1788328616/vendor_portfolio/a8c52506-d363-4a36-9cec-09b50cc32c4c/ig-eca46f60edfc.jpg')
    && m.LOOK_PHOTOS.every((u) => u.startsWith('https://res.cloudinary.com/dccso5ljv/image/upload/')) && (read(SCENES_REL).match(/ig-5a637b957f1d\.jpg|ig-eca46f60edfc\.jpg/g) || []).length === 2, "the two photographs are TDW's landing photographs");
}

sec('1.3 the sources');
{
  const mw = read('middleware.ts');
  const iW = mw.indexOf('worksDecide(host, path'), iDemo = mw.indexOf("host.startsWith('demodreamer.')"), iVendor = mw.indexOf('decide(host, path, SITE_BASE');
  ok(iW > 0 && iW < iDemo && iW < iVendor, 'middleware asks worksDecide before every other host rule');
  const nc = read('next.config.ts');
  ok(/remotePatterns:\s*\[new URL\('https:\/\/res\.cloudinary\.com\/dccso5ljv\/image\/upload\/\*\*'\)\]/.test(nc) && /qualities:\s*\[60, 75\]/.test(nc),
    "next/image allows TDW's Cloudinary folder only, qualities 60 and 75");
  const fo = read('app/works/fonts.ts');
  ok(/Bodoni_Moda\(\{[^}]*axes: \['opsz'\]/.test(fo) && /Manrope\(/.test(fo) && /JetBrains_Mono\(/.test(fo) && /Inter\(\{ subsets: \['latin'\], display: 'swap', variable: '--works-app' \}\)/.test(fo),
    'the four faces through next/font: Bodoni Moda (with opsz), Manrope, JetBrains Mono, Inter (variable, for the app weights)');
  const css = read('app/works/works.css').replace(/\/\*[\s\S]*?\*\//g, '');
  const heads = []; const walk = (s) => { let i = 0; while (i < s.length) { const j = s.indexOf('{', i); if (j < 0) break; const h = s.slice(i, j).trim(); let d = 0, k = j; for (; k < s.length; k += 1) { if (s[k] === '{') d += 1; else if (s[k] === '}') { d -= 1; if (!d) break; } } const body = s.slice(j + 1, k); if (h.startsWith('@media')) walk(body); else if (!h.startsWith('@keyframes')) heads.push(h); i = k + 1; } };
  walk(css);
  const loose = heads.flatMap((h) => h.split(',').map((x) => x.trim())).filter((x) => !/(^|\s)\.tdww\b/.test(x) && !/^(from|to|\d+%)$/.test(x) && !/^html:has\(\.tdww\)$|^body:has\(\.tdww\)$/.test(x));
  ok(heads.length > 100 && loose.length === 0, `works.css: every one of ${heads.length} rules is scoped under .tdww`, loose.slice(0, 8).join(' | '));
  const rm = (css.match(/@media \(prefers-reduced-motion:reduce\)\{([\s\S]*?)\n\}/) || [])[1] || '';
  ok(/\.tdww \.track,\.tdww \.run\{animation:none\}/.test(rm) && /transition:none!important/.test(rm) && /\.tdww \.meter\{display:none\}/.test(rm),
    'reduce motion stops the wall, the trades line, the transitions and the meter');
  ok(/\.tdww \.colm:nth-child\(n\+5\)\{display:none\}/.test(css), 'a phone shows 4 wall columns (point 5)');
  const L = read('app/(landing)/page.tsx');
  ok((L.match(/q === 'vendor-signin'\) \{ setRole\('Maker'\); setScreen\('signin_phone'\); \}/g) || []).length === 1, "the couples' page: ?role=vendor-signin opens the vendor sign-in (one line)");
  ok(/const TDW_WORKS = 'https:\/\/tdw\.works';/.test(L) && /onClick=\{\(\) => \{ window\.location\.assign\(TDW_WORKS\); \}\}[\s\S]{0,700}I&apos;m a wedding vendor/.test(L),
    'point 8: the entry\'s "I\'m a wedding vendor" goes to tdw.works');
  ok(!/data-partner-entry/.test(L) && !/Partner with The Dream Wedding/.test(L), "point 8: the partner line is off the couples' page");
  ok(/onClick=\{\(\) => \{ setRole\('Maker'\); setScreen\('join_phone'\); \}\}/.test(L), "the chooser's vendor door (sign-up) is unchanged");
  const lay = read('app/layout.tsx');
  {
    // The tab icon (the founder, 9 Oct 2026): tdw.works's own family; the root layout's D, unchanged in what it serves.
    const BRAND5 = ["{ url: '/brand/favicon-32.png', sizes: '32x32', type: 'image/png' }", "{ url: '/brand/favicon-16.png', sizes: '16x16', type: 'image/png' }",
      "{ url: '/brand/icon-graphite-180.png', sizes: '180x180' }", "{ url: '/brand/icon-graphite-152.png', sizes: '152x152' }", "{ url: '/brand/icon-graphite-120.png', sizes: '120x120' }"];
    ok(BRAND5.every((x) => lay.includes(x)) && !/<link rel="(icon|apple-touch-icon)"/.test(lay), "the root layout's five D icons are its metadata.icons (same paths, sizes, types), no hand-written <link>");
    const pg0 = read('app/works/page.tsx');
    ok(/icon: \[\s*\{ url: '\/works\/icon\.svg', type: 'image\/svg\+xml' \},\s*\{ url: '\/works\/favicon-32\.png', sizes: '32x32', type: 'image\/png' \},\s*\{ url: '\/works\/favicon-16\.png', sizes: '16x16', type: 'image\/png' \},?\s*\],\s*apple: \[\{ url: '\/works\/apple-icon-180\.png', sizes: '180x180' \}\]/.test(pg0),
      "the works page's own icons: icon.svg, favicon-32, favicon-16 and apple-icon-180, all under /works/");
    ok(/beforeFiles: \[\s*\{ source: '\/favicon\.ico', has: \[\{ type: 'host', value: '\(\?:www\\\\\.\)\?tdw\\\\\.works' \}\], destination: '\/works\/favicon\.ico' \},\s*\]/.test(nc),
      'next.config.ts: /favicon.ico on the tdw.works host is /works/favicon.ico (beforeFiles, so it wins over app/favicon.ico)');
  }
  ok(['--font-italiana', '--font-cormorant', '--font-dm-sans', '--font-jost'].every((v) => new RegExp("variable: '" + v + "',\\n  preload: false,").test(lay)),
    "ruling 1: the root layout's Italiana, Cormorant, DM Sans and Jost are not preloaded");
  {
    const iStore = nc.indexOf("source: '/((?!site/|site-rt/|site-fonts/).*)'"), iStatic = nc.indexOf("source: '/_next/static/:path*'");
    ok(iStore > 0 && iStatic > iStore && /source: '\/_next\/static\/:path\*',\n\s*headers: \[\{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' \}\]/.test(nc),
      'ruling 2: /_next/static gets a year\'s cache, after the no-store rule so it wins there');
  }
  const pg = read('app/works/page.tsx');
  ok((pg.match(/<b>TDW<\/b><span>tdw\.works · The Delegated Workspace™<\/span>/g) || []).length === 2, 'ruling 4: the line under TDW reads "tdw.works · The Delegated Workspace™" (top bar and About)');
  ok(/at any hour\./.test(pg) && !/while you work/.test(pg) && /and a note when a policy needs renewing\./.test(pg) && !/reminder before/.test(pg + read(SCENES_REL)),
    'ruling 5: "at any hour" and "a note when a policy needs renewing" on the page and in the scenes');
  ok(/var isWorks=location\.hostname==='tdw\.works'\|\|path==='\/works';/.test(lay) && /if\(isWorks\)\{[\s\S]{0,200}bg=dk\?'#0E1112':'#E7EAE6';/.test(lay),
    "the root layout paints tdw.works's own ground and browser bar, not the couples' near-black");
}

// ── §2 glass ─────────────────────────────────────────────────────────────────────────────────────────────────────────
function browserBin() {
  const usable = (p) => { try { return !!p && fs.statSync(p).isFile(); } catch (_e) { return false; } };
  let bin = process.env.CHROME_BIN;
  if (!usable(bin)) bin = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium'].find(usable);
  return usable(bin) ? bin : null;
}
async function sparticuz() { try { const mod = require(path.join(ROOT, 'node_modules/@sparticuz/chromium')); const p = await (mod.default || mod).executablePath(); return p; } catch (_e) { return null; } }
function freePort() { const r = spawnSync(process.execPath, ['-e', "const s=require('net').createServer();s.listen(0,'127.0.0.1',()=>{console.log(s.address().port);s.close();});"], { encoding: 'utf8' }); return Number((r.stdout || '').trim()); }
function get(port, p, host) {
  return new Promise((resolve) => {
    const req = http.get({ host: '127.0.0.1', port, path: p, headers: { host: host || `127.0.0.1:${port}` } }, (res) => { const b = []; res.on('data', (c) => b.push(c)); res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, bytes: Buffer.concat(b) })); });
    req.on('error', (e) => resolve({ status: 0, error: String(e), bytes: Buffer.alloc(0) }));
    req.setTimeout(120000, () => { req.destroy(); resolve({ status: 0, error: 'timeout', bytes: Buffer.alloc(0) }); });
  });
}

// The page's own clock, shortened for the order cells only: the 3000 ms step becomes FAST ms. Nothing else is touched.
const FAST = 90;
const FAST_CLOCK = `(() => { const st = window.setTimeout; window.setTimeout = (f, ms, ...a) => st(f, ms === 3000 ? ${FAST} : ms, ...a); })();`;
const RECORD = `(() => { window.__seq = []; const go = () => { const f = document.getElementById('focus'); if (!f) return setTimeout(go, 20);
  window.__seq.push(f.dataset.scene); new MutationObserver(() => window.__seq.push(f.dataset.scene)).observe(f, { attributes: true, attributeFilter: ['data-scene'] }); };
  document.addEventListener('DOMContentLoaded', go); })();`;

async function glass(puppeteer, bin, base, port) {
  const browser = await puppeteer.launch({ executablePath: bin, headless: true, args: ['--no-sandbox', '--host-resolver-rules=MAP tdw.works 127.0.0.1'] });
  // The host on the server's own port: Chrome upgrades a plain tdw.works on port 80 to https, which no local server answers.
  const url = `http://tdw.works:${port}/`;
  const open = async (w, h, feats, pre) => {
    const p = await browser.newPage();
    await p.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w < 800, hasTouch: w < 800 });
    if (feats) await p.emulateMediaFeatures(feats);
    for (const s of pre || []) await p.evaluateOnNewDocument(s);
    const reqs = []; p.on('requestfinished', (r) => reqs.push(r.url()));
    await p.goto(url, { waitUntil: 'load', timeout: 240000 });
    await p.waitForFunction(() => document.querySelector('.tdww[data-ready]'), { timeout: 20000 }).catch(() => {});
    await p.evaluate(() => document.fonts.ready);
    p.reqs = reqs; return p;
  };
  try {
    // warm the route once (next dev compiles on the first request)
    { const p = await open(1440, 900); await p.close(); }

    sec('2.1 no scroll, the doors on screen, the ground follows the mode');
    for (const [w, h] of [[360, 640], [390, 844], [1440, 900]]) for (const mode of ['light', 'dark']) {
      const p = await open(w, h, [{ name: 'prefers-color-scheme', value: mode }]);
      const r = await p.evaluate(() => {
        const vis = (el) => { const b = el.getBoundingClientRect(); const cs = getComputedStyle(el); return cs.display !== 'none' && cs.visibility !== 'hidden' && b.width > 0 && b.top >= -1 && b.bottom <= innerHeight + 1 && b.left >= -1 && b.right <= innerWidth + 1; };
        const doors = { signin: [...document.querySelectorAll('.top [data-door="signin"]')].some(vis), start: [...document.querySelectorAll('.page [data-door="start"]')].some(vis), agency: [...document.querySelectorAll('.page [data-door="agency"]')].some(vis) };
        const se = document.scrollingElement;
        return { sw: se.scrollWidth, sh: se.scrollHeight, iw: innerWidth, ih: innerHeight, doors, bg: getComputedStyle(document.querySelector('.tdww')).backgroundColor,
          cols: [...document.querySelectorAll('.colm')].filter((c) => getComputedStyle(c).display !== 'none').length,
          h1: document.querySelector('.tdww h1').getBoundingClientRect().right <= innerWidth + 1, word: getComputedStyle(document.getElementById('word')).fontStyle,
          // LAND-1 package 2: no tag sits on the caption (the line that carries the meaning).
          capClear: (() => { const c = document.getElementById('cap').getBoundingClientRect(); return [...document.querySelectorAll('#slot .tag')].every((t) => { const r = t.getBoundingClientRect(); return getComputedStyle(t).display === 'none' || r.bottom <= c.top || r.top >= c.bottom || r.right <= c.left || r.left >= c.right; }); })() };
      });
      const want = mode === 'light' ? 'rgb(231, 234, 230)' : 'rgb(14, 17, 18)';
      ok(r.sw <= r.iw && r.sh <= r.ih && r.doors.signin && r.doors.start && r.doors.agency && r.h1,
        `${w}x${h} ${mode}: no scroll either way; Sign in, Start free and the agency door on screen; the heading inside`, JSON.stringify(r));
      ok(r.capClear, `${w}x${h} ${mode}: no floating tag sits on the caption`, JSON.stringify(r));
      ok(r.bg === want && r.cols === (w < 860 ? 4 : 6) && r.word === 'italic', `${w}x${h} ${mode}: the ${mode} ground, ${w < 860 ? 4 : 6} wall columns, the word in italic`, JSON.stringify(r));
      await p.close();
    }

    sec('2.2 the 26 scenes: random, each bag all 26, never twice in a row');
    {
      const p = await open(1440, 900, null, [FAST_CLOCK, RECORD]);
      await p.waitForFunction(() => window.__seq && window.__seq.length >= 53, { timeout: 30000 }).catch(() => {});
      const seq = (await p.evaluate(() => window.__seq.slice())).slice(0, 53);
      const b1 = seq.slice(0, 26), b2 = seq.slice(26, 52);
      const twice = seq.findIndex((k, i) => i > 0 && k === seq[i - 1]);
      ok(seq.length === 53 && new Set(b1).size === 26 && new Set(b2).size === 26 && LANDED.every((k) => b1.includes(k)) && twice < 0,
        '52 changes after the first: both bags are all 26 scenes, no repeat inside a bag, never the same scene twice in a row', seq.join(','));
      ok(['leads', 'clients', 'bookchat', 'draft', 'contracts'].includes(seq[0]), 'the landing scene was one of the five', seq[0]);
      const drawn = await p.evaluate(() => { const s = document.querySelector('#slot .sheet:last-child'); return !!(s && s.querySelector('.app') && s.querySelector('.tag b').textContent.trim()); });
      ok(drawn, 'each change draws an app screen and its tag');
      const changed = new Set(); for (let i = 0; i < 12; i += 1) { changed.add(await p.$eval('#word', (e) => e.textContent)); await sleep(FAST); }
      ok(changed.size >= 3, 'the word under "Your" follows the scenes', [...changed].join(' '));
      await p.close();
    }

    sec('2.3 the doors');
    {
      const p = await open(1440, 900);
      const d = await p.evaluate(() => ({ signin: [...document.querySelectorAll('[data-door="signin"]')].map((a) => a.href), start: [...document.querySelectorAll('[data-door="start"]')].map((a) => a.href), agency: [...document.querySelectorAll('[data-door="agency"]')].map((a) => a.href), text: [...document.querySelectorAll('[data-door="agency"] b')].map((b) => b.textContent) }));
      ok(d.signin.length === 1 && d.signin.every((h) => h === DOORS.signin), 'Sign in goes to ?role=vendor-signin', JSON.stringify(d.signin));
      ok(d.start.length === 3 && d.start.every((h) => h === DOORS.start), 'Start free (hero, phone dock, About) goes to ?role=vendor', JSON.stringify(d.start));
      ok(d.agency.length === 3 && d.agency.every((h) => h === DOORS.agency) && d.text.every((t) => t === 'Agency or brand? Send your calls here.'), '"Agency or brand? Send your calls here." goes to /partner/join', JSON.stringify(d));
      await p.close();
    }

    sec('2.4 a tap pauses; a hidden tab stops the clock');
    {
      const p = await open(390, 844, null, [FAST_CLOCK, RECORD]);
      await p.waitForFunction(() => window.__seq.length >= 3, { timeout: 20000 }).catch(() => {});
      await p.tap('#focus');
      const n0 = await p.evaluate(() => window.__seq.length); await sleep(FAST * 8); const n1 = await p.evaluate(() => window.__seq.length);
      const chip = await p.$eval('#paused', (e) => !e.hidden && getComputedStyle(e).display !== 'none');
      ok(n1 === n0 && chip && (await p.$eval('#focus', (e) => e.getAttribute('aria-label'))) === 'Play the screens', 'a tap pauses: no change, "Paused" shown, the label says Play', `${n0} -> ${n1}`);
      await p.tap('#focus'); await sleep(FAST * 8); const n2 = await p.evaluate(() => window.__seq.length);
      ok(n2 > n1 && await p.$eval('#paused', (e) => e.hidden), 'a second tap plays again', `${n1} -> ${n2}`);
      await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
      const h0 = await p.evaluate(() => window.__seq.length); await sleep(FAST * 8); const h1 = await p.evaluate(() => window.__seq.length);
      ok(h1 === h0, 'a hidden tab: the clock stops', `${h0} -> ${h1}`);
      await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); document.dispatchEvent(new Event('visibilitychange')); });
      await sleep(FAST * 8); const h2 = await p.evaluate(() => window.__seq.length);
      ok(h2 > h1, 'the tab back: the clock runs again', `${h1} -> ${h2}`);
      await p.close();
    }

    sec('2.5 About, on the same page');
    {
      const p = await open(1440, 900, null, [FAST_CLOCK, RECORD]);
      await p.waitForFunction(() => window.__seq.length >= 2, { timeout: 20000 }).catch(() => {});
      const at = p.url();
      await p.click('#moreBtn'); await sleep(50); await p.click('#aboutOpen'); await sleep(100);
      const st = await p.evaluate(() => ({ open: !document.getElementById('about').hidden, wall: getComputedStyle(document.querySelector('.track')).animationPlayState, run: getComputedStyle(document.querySelector('.run')).animationPlayState, focus: document.activeElement && document.activeElement.id, title: document.getElementById('abTitle').textContent }));
      const a0 = await p.evaluate(() => window.__seq.length); await sleep(FAST * 8); const a1 = await p.evaluate(() => window.__seq.length);
      ok(st.open && p.url() === at && st.focus === 'aboutClose' && /Everything your business needs/.test(st.title), 'About opens over the same page (no new address), Close has the focus', JSON.stringify(st));
      ok(a1 === a0 && st.wall === 'paused' && st.run === 'paused', 'while About is open the screens, the wall and the trades line stop', `${a0} -> ${a1} ${st.wall} ${st.run}`);
      await p.keyboard.press('Escape'); await sleep(FAST * 8);
      const e = await p.evaluate(() => ({ hidden: document.getElementById('about').hidden, n: window.__seq.length, focus: document.activeElement && document.activeElement.id, wall: getComputedStyle(document.querySelector('.track')).animationPlayState }));
      ok(e.hidden && e.n > a1 && e.focus === 'moreBtn' && e.wall === 'running', 'Esc returns to the page; the screens and the wall run again', JSON.stringify(e));
      await p.click('#moreBtn'); await sleep(50); await p.click('#aboutOpen'); await sleep(50); await p.click('#aboutClose'); await sleep(FAST * 6);
      ok(await p.evaluate(() => document.getElementById('about').hidden), 'Close returns to the page');
      await p.click('#focus'); const q0 = await p.evaluate(() => window.__seq.length);
      await p.click('#moreBtn'); await sleep(50); await p.click('#aboutOpen'); await sleep(50); await p.click('#aboutClose'); await sleep(FAST * 8);
      const q1 = await p.evaluate(() => window.__seq.length);
      ok(q1 === q0 && !(await p.$eval('#paused', (x) => x.hidden)), 'a page paused before About stays paused after it', `${q0} -> ${q1}`);
      await p.close();
    }

    sec('2.6 reduce motion');
    for (const [w, h] of [[390, 844], [1440, 900]]) {
      const p = await open(w, h, [{ name: 'prefers-reduced-motion', value: 'reduce' }], [FAST_CLOCK, RECORD]);
      await p.waitForFunction(() => window.__seq.length >= 3, { timeout: 20000 }).catch(() => {});
      const r = await p.evaluate(() => ({ wall: getComputedStyle(document.querySelector('.track')).animationName, run: getComputedStyle(document.querySelector('.run')).animationName,
        meter: getComputedStyle(document.querySelector('.meter')).display, sheets: document.querySelectorAll('#slot .sheet').length,
        moving: document.querySelectorAll('#slot .sheet.enter, #slot .sheet.leave').length, tr: getComputedStyle(document.querySelector('#slot .sheet')).transitionDuration }));
      ok(r.wall === 'none' && r.run === 'none' && r.meter === 'none', `${w}: the wall, the trades line and the meter stop`, JSON.stringify(r));
      ok(r.sheets === 1 && r.moving === 0 && /^0s(, 0s)*$/.test(r.tr), `${w}: a change swaps at once (one sheet, no enter or leave, no transition)`, JSON.stringify(r));
      await p.close();
    }

    sec('2.7 the faces');
    {
      const p = await open(1440, 900);
      const f = await p.evaluate(() => ({ h1: getComputedStyle(document.querySelector('.tdww h1')).fontFamily, cap: getComputedStyle(document.getElementById('cap')).fontFamily,
        kick: getComputedStyle(document.querySelector('.tdww .kicker')).fontFamily, app: getComputedStyle(document.querySelector('#slot .app')).fontFamily,
        loaded: ['500 40px "Bodoni Moda"', 'italic 400 40px "Bodoni Moda"', '500 16px "Manrope"', '500 16px "Inter"'].map((s) => document.fonts.check(s)) }));
      ok(/^"Bodoni Moda"/.test(f.h1) && /^"?Manrope/.test(f.cap) && /^"?JetBrains Mono/.test(f.kick) && /^"?Inter/.test(f.app), 'Bodoni Moda for the heading, Manrope for the lines, JetBrains Mono for the labels, Inter in the screens', JSON.stringify(f));
      ok(f.loaded.every(Boolean), 'the heading, its italic, the body and the app faces are loaded', JSON.stringify(f.loaded));
      const faces = p.reqs.filter((u) => /\.woff2(\?|$)/.test(u));
      ok(faces.length > 0 && faces.every((u) => u.startsWith(`${url}_next/static/media/`)), `every face file the page loads (${faces.length}) is served by the site itself`, faces.join(' '));
      const google = p.reqs.filter((u) => /fonts\.(googleapis|gstatic)\.com/.test(u));
      console.log(`       note: requests to Google Fonts on this page: ${google.length} (the root layout's Frost stylesheet, outside this page; see the handover)`);
      await p.close();
    }

    sec('2.8 the photographs');
    {
      // Read from the server's own markup: on a machine that cannot reach Cloudinary the tiles drop a photograph that
      // fails to load (onerror), so the live page may no longer hold it.
      const html = (await get(port, '/', 'tdw.works')).bytes.toString('utf8');
      const attr = (tag, a) => ((tag.match(new RegExp(' ' + a + '="([^"]*)"')) || [])[1] || '').replace(/&amp;/g, '&');
      const tags = [...new Set((html.match(/<span class="lk"><img [^>]*>/g) || []).map((t) => t.slice(17)))];
      const imgs = tags.slice(0, 2).map((t) => ({ src: attr(t, 'src'), srcset: attr(t, 'srcset'), sizes: attr(t, 'sizes') }));
      const p = await open(1440, 900);
      const okSrc = imgs.length === 2 && imgs.every((i) => /^\/_next\/image\?url=https%3A%2F%2Fres\.cloudinary\.com%2Fdccso5ljv%2Fimage%2Fupload%2F/.test(i.src) && /&q=60$/.test(i.src) && /w=640&q=60 640w/.test(i.srcset));
      ok(okSrc, "her two look tiles: next/image addresses for TDW's folder, quality 60", JSON.stringify(imgs));
      const disc = (html.match(/How clients see you on TDW\.[\s\S]*?<div class="looks"[^>]*>(<span class="lk">.*?<\/span>){2}/g) || []);
      // The wall is random: a visit may draw no Discover screen. Every one it draws is read; 1.2 reads the scene itself.
      ok(disc.every((d) => (d.match(/<img [^>]*src="\/_next\/image\?url=https%3A%2F%2Fres\.cloudinary\.com%2Fdccso5ljv/g) || []).length === 2), `Discover's two tiles carry the same two photographs (ruling 5; ${disc.length} drawn on this visit)`, String(disc.length));
      await p.close();
      // Weigh every file the tiles can ask for up to 828 px wide (a 3x phone asks for 640).
      const urls = [...new Set(imgs.flatMap((i) => (i.srcset || '').split(',').map((x) => x.trim().split(' ')[0])).filter((u) => { const w = Number((u.match(/[?&]w=(\d+)/) || [])[1]); return w && w <= 828; }))];
      const res = []; for (const u of urls) { const r = await get(port, u, 'tdw.works'); res.push({ u: u.slice(0, 90), status: r.status, kb: Math.round(r.bytes.length / 1024), type: r.headers && r.headers['content-type'] }); }
      if (res.length && res.every((r) => r.status === 200)) ok(res.every((r) => r.kb <= 150), `every photograph file the tiles can ask for is 150 KB or less (${res.map((r) => r.kb + ' KB').join(', ')})`, JSON.stringify(res));
      else skipped('the photographs weighed', `Cloudinary is not reachable from this machine: ${res.map((r) => r.status).join(',')}; run b303 on a machine that reaches it`);
    }
    sec('2.10 More: About, Privacy and Terms in a small menu on a solid ground (phone and laptop)');
    for (const [w, h] of [[360, 640], [1440, 900]]) for (const mode of ['light', 'dark']) {
      const p = await open(w, h, [{ name: 'prefers-color-scheme', value: mode }]);
      const before = await p.evaluate(() => ({ old: !!document.querySelector('.top .lnk'), more: (() => { const b = document.getElementById('moreBtn').getBoundingClientRect(); return b.width > 0 && b.right <= innerWidth && b.top >= 0; })(),
        signin: (() => { const b = document.querySelector('.top [data-door="signin"]').getBoundingClientRect(); return b.width > 0 && b.right <= innerWidth + 1; })(), hidden: document.getElementById('moreMenu').hidden }));
      await p.click('#moreBtn'); await sleep(80);
      const m = await p.evaluate(() => {
        const menu = document.getElementById('moreMenu'); const r = menu.getBoundingClientRect(); const cs = getComputedStyle(menu);
        const items = [...menu.querySelectorAll('[role="menuitem"]')].map((i) => ({ t: i.textContent.trim(), size: parseFloat(getComputedStyle(i).fontSize), href: i.getAttribute('href') }));
        const alpha = (cs.backgroundColor.match(/rgba?\(([^)]+)\)/) || [, ''])[1].split(',').map(Number)[3];
        return { open: !menu.hidden, exp: document.getElementById('moreBtn').getAttribute('aria-expanded'), items, solid: alpha === undefined || alpha === 1,
          inside: r.left >= 0 && r.right <= innerWidth && r.bottom <= innerHeight, focus: document.activeElement && document.activeElement.textContent.trim() };
      });
      ok(!before.old && before.more && before.signin && before.hidden, `${w} ${mode}: no loose About, Privacy, Terms; More and Sign in in the top bar; the menu starts closed`, JSON.stringify(before));
      ok(m.open && m.exp === 'true' && m.items.map((i) => i.t).join(',') === 'About,Privacy,Terms' && m.items.every((i) => i.size >= 16) && m.solid && m.inside && m.focus === 'About',
        `${w} ${mode}: More opens About, Privacy and Terms in full-size text (16 px or more) on a solid ground, inside the screen`, JSON.stringify(m));
      ok(m.items[1].href === 'https://thedreamwedding.in/privacy' && m.items[2].href === 'https://thedreamwedding.in/terms', `${w} ${mode}: Privacy and Terms keep their addresses`);
      await p.keyboard.press('Escape'); await sleep(60);
      const esc = await p.evaluate(() => ({ hidden: document.getElementById('moreMenu').hidden, focus: document.activeElement && document.activeElement.id }));
      await p.click('#moreBtn'); await sleep(60); await p.mouse.click(Math.round(w / 2), Math.round(h * 0.6)); await sleep(60);
      const out = await p.evaluate(() => document.getElementById('moreMenu').hidden);
      await p.click('#moreBtn'); await sleep(60); await p.click('#aboutOpen'); await sleep(80);
      const ch = await p.evaluate(() => ({ menu: document.getElementById('moreMenu').hidden, about: !document.getElementById('about').hidden }));
      ok(esc.hidden && esc.focus === 'moreBtn' && out && ch.menu && ch.about, `${w} ${mode}: the menu closes on Esc (focus back to More), on a tap outside, and on a choice (About opens)`, JSON.stringify({ esc, out, ch }));
      await p.close();
    }
    {
      const firsts = new Set(); let bad = '';
      for (let i = 0; i < 12; i += 1) { const html = (await get(port, '/', 'tdw.works')).bytes.toString('utf8'); const k = (html.match(/data-scene="([a-z]+)"/) || [])[1]; firsts.add(k); if (!['leads', 'clients', 'bookchat', 'draft', 'contracts'].includes(k)) bad = bad || k; }
      ok(!bad && firsts.size >= 2, `on landing, the first scene is one of the five, and it varies (12 visits: ${[...firsts].join(', ')})`, bad);
    }

    sec('2.9 the tab icon: tdw.works its own, thedreamwedding.in unchanged');
    {
      const sha8 = (b) => crypto.createHash('sha256').update(b).digest('hex').slice(0, 8);
      const iconLinks = (html) => [...html.matchAll(/<link[^>]*rel="(icon|apple-touch-icon|shortcut icon)"[^>]*>/g)].map((m) => ({ rel: m[1], href: ((m[0].match(/href="([^"]*)"/) || [])[1] || '').replace(/&amp;/g, '&'), sizes: (m[0].match(/sizes="([^"]*)"/) || [])[1] || '' }));
      const w = iconLinks((await get(port, '/', 'tdw.works')).bytes.toString('utf8'));
      const wHrefs = w.map((l) => l.href.split('?')[0]);
      ok(w.length >= 4 && wHrefs.every((h) => h.startsWith('/works/') || h === '/favicon.ico')
        && ['/works/icon.svg', '/works/favicon-32.png', '/works/favicon-16.png'].every((h) => w.some((l) => l.rel === 'icon' && l.href === h))
        && w.some((l) => l.rel === 'apple-touch-icon' && l.href === '/works/apple-icon-180.png' && l.sizes === '180x180') && !wHrefs.some((h) => h.startsWith('/brand/')),
        "on tdw.works the page's icons point to /works/* (and /favicon.ico, which is tdw.works's own there); no /brand/ icon", JSON.stringify(w));
      const fav = await get(port, '/favicon.ico', 'tdw.works');
      ok(fav.status === 200 && sha8(fav.bytes) === 'da5ed966', `/favicon.ico on tdw.works serves da5ed966 (${fav.status}, ${sha8(fav.bytes)})`);
      const files = { 'icon.svg': '5a66fc5d', 'favicon-16.png': 'ea98ac85', 'favicon-32.png': '79c3216a', 'apple-icon-180.png': '8073393c', 'favicon.ico': 'da5ed966' };
      const got = {}; for (const n of Object.keys(files)) { const r = await get(port, '/works/' + n, 'tdw.works'); got[n] = r.status === 200 ? sha8(r.bytes) : r.status; }
      ok(Object.keys(files).every((n) => got[n] === files[n]), "the five files are served on tdw.works under /works/, byte for byte the chair's", JSON.stringify(got));
      // thedreamwedding.in: the same five D links as before and the D at /favicon.ico (app/favicon.ico, unchanged).
      const t = iconLinks((await get(port, '/', 'thedreamwedding.in')).bytes.toString('utf8'));
      const want = [['icon', '/brand/favicon-32.png', '32x32'], ['icon', '/brand/favicon-16.png', '16x16'], ['apple-touch-icon', '/brand/icon-graphite-180.png', '180x180'],
        ['apple-touch-icon', '/brand/icon-graphite-152.png', '152x152'], ['apple-touch-icon', '/brand/icon-graphite-120.png', '120x120']];
      const tHrefs = t.map((l) => l.href.split('?')[0]);
      ok(want.every(([r, h, s]) => t.some((l) => l.rel === r && l.href === h && l.sizes === s)) && !tHrefs.some((h) => h.startsWith('/works/'))
        && t.filter((l) => l.href.split('?')[0] !== '/favicon.ico').length === 5,
        'on thedreamwedding.in every icon is unchanged: the five /brand/ links and no /works/ icon', JSON.stringify(t));
      const tf = await get(port, '/favicon.ico', 'thedreamwedding.in');
      const appIco = sha8(fs.readFileSync(path.join(ROOT, 'app/favicon.ico')));
      ok(tf.status === 200 && sha8(tf.bytes) === appIco && appIco !== 'da5ed966', `/favicon.ico on thedreamwedding.in is still the D (app/favicon.ico, ${appIco})`);
    }
  } finally {
    await browser.close();
  }
}

async function perf(puppeteer, bin, port) {
  sec('3 the first full view on 4G (the production build, 360x640)');
  const browser = await puppeteer.launch({ executablePath: bin, headless: true, args: ['--no-sandbox', '--host-resolver-rules=MAP tdw.works 127.0.0.1'] });
  try {
    // Two profiles: Chrome's "Fast 4G" and Lighthouse's mobile profile ("Slow 4G", with the 4x slower phone CPU).
    for (const [name, net, cpu] of [['4G (9 Mbps, 170 ms)', { latency: 170, download: 9e6 / 8, upload: 1.5e6 / 8 }, 1], ['slow 4G (1.6 Mbps, 150 ms, CPU x4)', { latency: 150, download: 1.6e6 / 8, upload: 0.75e6 / 8 }, 4]]) {
      const times = [];
      for (let run = 0; run < 3; run += 1) {
        const ctx = await browser.createBrowserContext(); const p = await ctx.newPage();
        await p.setViewport({ width: 360, height: 640, isMobile: true, hasTouch: true });
        const c = await p.createCDPSession();
        await c.send('Network.enable');   // a fresh context per run: an empty cache, as on a first visit (not a disabled one)
        await c.send('Network.emulateNetworkConditions', { offline: false, latency: net.latency, downloadThroughput: net.download, uploadThroughput: net.upload });
        await c.send('Emulation.setCPUThrottlingRate', { rate: cpu });
        await p.evaluateOnNewDocument(() => { window.__lcp = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = Math.max(window.__lcp, e.startTime); }).observe({ type: 'largest-contentful-paint', buffered: true }); });
        await p.goto(`http://tdw.works:${port}/`, { waitUntil: 'load', timeout: 120000 });
        // The first full view: the largest paint, and every preloaded face (the heading's, the lines', the screens') in.
        const t = await p.evaluate(async () => { await document.fonts.ready; await new Promise((r) => setTimeout(r, 300));
          const faces = performance.getEntriesByType('resource').filter((e) => /\.woff2/.test(e.name) && e.initiatorType === 'link').map((e) => e.responseEnd);
          return { lcp: window.__lcp, faces: faces.length ? Math.max(...faces) : 0 }; });
        times.push(Math.round(Math.max(t.lcp, t.faces)));
        await ctx.close();
      }
      const med = times.slice().sort((x, y) => x - y)[1];
      console.log(`       ${name}: first full view ${times.join(' / ')} ms (median ${med})`);
      ok(med <= 2500, `${name}: the first full view in 2.5 s or less (median of 3, ${med} ms)`);
    }
  } finally {
    await browser.close();
  }
}

(async () => {
  let code = 0;
  try {
    if (GLASS || PERF) {
      let bin = browserBin(); if (!bin) bin = await sparticuz();
      if (!bin) { console.log('  b303: no browser found (CHROME_BIN, /opt/pw-browsers, @sparticuz/chromium all absent); §2 and §3 cannot run here'); process.exit(3); }
      const puppeteer = require(path.join(ROOT, 'node_modules/puppeteer-core'));
      // One production build, one server: next dev refuses a page's own scripts when they are asked for from another host
      // name (tdw.works) unless allowedDevOrigins names it, and a production build is what tdw.works serves anyway.
      const fonts = require('./lib/next_fonts').start(ROOT, 'b303');
      let srv = null;
      try {
        console.log('  b303: next build (about a minute)');
        const bd = spawnSync(path.join(ROOT, 'node_modules/.bin/next'), ['build'], { cwd: ROOT, env: { ...process.env, ...fonts.env, NEXT_TELEMETRY_DISABLED: '1' }, encoding: 'utf8', maxBuffer: 1e9, timeout: 1800000 });
        if (bd.status !== 0) { ok(false, 'next build', (bd.stderr || bd.stdout || '').slice(-800)); }
        else {
          const port = freePort();
          srv = spawn(path.join(ROOT, 'node_modules/.bin/next'), ['start', '-p', String(port)], { cwd: ROOT, detached: true, stdio: 'ignore', env: { ...process.env, ...fonts.env } });
          let up = false; for (let i = 0; i < 60 && !up; i += 1) { up = (await get(port, '/', 'tdw.works')).status === 200; if (!up) await sleep(1000); }
          if (!up) ok(false, 'next start came up');
          else { if (GLASS) await glass(puppeteer, bin, `http://127.0.0.1:${port}`, port); if (PERF) await perf(puppeteer, bin, port); }
        }
      } finally {
        if (srv) { try { process.kill(-srv.pid, 'SIGKILL'); } catch (_e) { /* gone */ } }
        fonts.stop();
      }
    }
  } catch (e) { fail += 1; console.log(`  FAIL the run threw: ${e && e.stack ? e.stack.split('\n').slice(0, 4).join(' | ') : e}`); }
  if (restore) { restore(); restore = null; }
  console.log(`\nb303: ${pass} pass, ${fail} fail${skip ? `, ${skip} skip` : ''}${MUTATE ? ' (MUTATION run: red is expected)' : ''}`);
  code = fail ? 1 : 0;
  process.exit(code);
})();
