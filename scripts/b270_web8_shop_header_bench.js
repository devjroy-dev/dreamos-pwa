// scripts/b270_web8_shop_header_bench.js · WEB-8 · CE-47 F-44.343: on a shop item page (data-page="shop") the header is
// solid from the start, at every scroll, in every style; on every other page it goes solid only past the style's own
// point, as before. The switch is one line of the site's runtime (lib/site/rt/runtime.ts), built into lib/site/rt.gen.ts.
// Each style's own page is drawn in a browser with the BUILT runtime (rt.gen.ts, the bytes the site serves), once as a
// shop item page and once as her home page. Two planted faults (the switch removed; the switch on for every page) must
// each redden their cell; each is restored by sha. Run: node scripts/b270_web8_shop_header_bench.js
// WEB-8 (F-44.419): each fault is built in a temp folder, then planted in runtime.ts and rt.gen.ts through
// scripts/lib/mutation_guard.js (kept copy and marker first, restored by sha, a killed run's fault put back at the next
// start); nothing is planted unless the disk has room; the fixture cards read ../dream-os, so the bench refuses (exit 3)
// when it is missing or older than the commit it needs (lesson 4, scripts/lib/web8_gates.js).
'use strict';
const fs = require('fs'); const path = require('path'); const crypto = require('crypto'); const { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..'); const P = (f) => path.join(ROOT, f); const read = (f) => fs.readFileSync(P(f), 'utf8');
const { makeLoader } = require('./lib/site_load');
let pass = 0, fail = 0; const ok = (c, name, why) => { if (c) { pass++; console.log('  PASS  ' + name); } else { fail++; console.log('  FAIL  ' + name + (why ? '  [' + String(why).slice(0, 300) + ']' : '')); } };
const STYLES = ['couture', 'gallery', 'noir', 'heritage', 'aurora', 'riviera'];
const opts = { code: 'studio-ivara', base: 'https://studio-ivara.thedreamwedding.in', api: 'https://x', display: 'swap', preview: false };
const guard = require('./lib/mutation_guard.js'); const gates = require('./lib/web8_gates.js');
guard.recoverOrRefuse(ROOT, 'b270');
gates.siblingOrRefuse(gates.siblingDir(ROOT), gates.SITE_NEEDS, gates.SITE_NEEDS_WHY, 'b270');
const cards = require(P('tools/site_rig/fixture_cards.cjs'))('https://img.example');
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(P(f))).digest('hex');
const RT = 'lib/site/rt/runtime.ts'; const GEN = 'lib/site/rt.gen.ts'; const PENDING = P('scripts/.mutation-pending');
const LINE = "hd.classList.toggle('solid', H.dataset.page === 'shop' || y > (hook.solidAt ? hook.solidAt() : innerHeight * 0.8))";

function source(tag) {
  console.log(`\n§1 the switch in the runtime${tag}`);
  const src = read(RT);
  ok(src.split(LINE).length === 2, '1.1 runtime.ts: the header is solid when the page is a shop item page, or past the style\'s own point');
  const r = buildIn(src);
  ok(r.gen !== null && r.gen === read(GEN), '1.2 rt.gen.ts is the runtime\'s own build (build_runtime.cjs re-run gives the same bytes)', r.err);
}
// build_runtime.cjs run in a temp folder on the given runtime.ts text; the tree is never written. Returns { gen, err }.
function buildIn(rtText) {
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'b270-')); const cp = (f) => { fs.mkdirSync(path.dirname(path.join(tmp, f)), { recursive: true }); fs.copyFileSync(P(f), path.join(tmp, f)); };
  try {
    ['lib/site/rt/motion.ts', 'tools/site_port/build_runtime.cjs'].forEach(cp); fs.writeFileSync(path.join(tmp, RT), rtText); fs.symlinkSync(P('node_modules'), path.join(tmp, 'node_modules'));
    const r = spawnSync('node', [path.join(tmp, 'tools/site_port/build_runtime.cjs')], { encoding: 'utf8', timeout: 60000 });
    return r.status === 0 ? { gen: fs.readFileSync(path.join(tmp, GEN), 'utf8'), err: '' } : { gen: null, err: r.stderr };
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
}
async function browserBin() {   // the harness's order (FE-8 C1): CHROME_BIN, /opt/pw-browsers, @sparticuz/chromium
  const usable = (p) => { try { return !!p && fs.statSync(p).isFile(); } catch (_e) { return false; } };
  let bin = process.env.CHROME_BIN; if (!usable(bin)) bin = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium'].find(usable);
  if (!usable(bin)) { const m = await import('@sparticuz/chromium'); bin = await (m.default || m).executablePath(); } return bin;
}
// her page as the site serves it, with data-page set to `kind`; the runtime answered from rt.gen.ts (fresh, not cached)
async function headerAt(b, D, gen, st, kind) {
  const doc = String(await D.siteDocument(cards[`fixture-${st}`], opts)).replace(/ data-page="home"/, ` data-page="${kind}"`);
  const pg = await b.newPage(); await pg.setViewport({ width: 374, height: 760 }); await pg.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await pg.setRequestInterception(true);
  pg.on('request', (r) => { const u = r.url();
    if (u === 'http://site.test/') return r.respond({ status: 200, contentType: 'text/html', body: doc });
    if (u.includes(`/site-rt/${gen.RT_SHA}.js`)) return r.respond({ status: 200, contentType: 'text/javascript', body: gen.RT_JS });
    return r.respond({ status: 204, body: '' }); });
  const errs = []; pg.on('pageerror', (e) => errs.push(String(e.message).split('\n')[0]));
  await pg.goto('http://site.test/', { waitUntil: 'load' });
  let ready = false; for (let i = 0; i < 100 && !ready; i += 1) { ready = await pg.evaluate(() => document.documentElement.classList.contains('ready')); if (!ready) await new Promise((r) => setTimeout(r, 50)); }
  const look = () => pg.evaluate(() => { const hd = document.querySelector('#hd'); return hd ? { solid: hd.classList.contains('solid'), bg: getComputedStyle(hd).backgroundColor } : null; });
  const frame = () => pg.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await frame(); const at0 = await look();
  await pg.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await frame(); const deep = await look();
  await pg.evaluate(() => window.scrollTo(0, 0)); await frame(); const back = await look();
  await pg.close(); return { ready, errs, at0, deep, back };
}
async function drawn(tag) {
  console.log(`\n§2 drawn in each style, with the built runtime${tag}`);
  const load = makeLoader(); const D = load('lib/site/doc.ts'); const gen = load(GEN); const puppeteer = (await import('puppeteer-core')).default;
  const b = await puppeteer.launch({ executablePath: await browserBin(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  try {
    for (const st of STYLES) {
      const s = await headerAt(b, D, gen, st, 'shop');
      ok(s.ready && !s.errs.length && s.at0 && s.at0.solid && s.deep.solid && s.back.solid, `2.1 ${st}: a shop item page has its header solid at the top, deep in the page, and back at the top`, JSON.stringify(s));
      const h = await headerAt(b, D, gen, st, 'home');
      ok(h.ready && !h.errs.length && h.at0 && !h.at0.solid && !h.back.solid, `2.2 ${st}: her home page is as before: the header is not solid at the top`, JSON.stringify(h));
      console.log(`        ${st}: header background at the top, shop ${s.at0 && s.at0.bg} · home ${h.at0 && h.at0.bg}`);
    }
  } finally { await b.close(); }
}
const MUT = [   // [the fault, the anchor, what it becomes, the cell it must redden]
  ['the switch removed', "H.dataset.page === 'shop' || y >", 'y >', '2.1'],
  ['the switch on for every page', "H.dataset.page === 'shop' || y >", "H.dataset.page !== 'x' || y >", '2.2'],
];
(async () => {
  console.log('b270 · WEB-8 · F-44.343 the shop item page header'); source(''); await drawn('');
  console.log('\n§3 mutations: each planted fault reddens its cell; both files restored by sha');
  gates.spaceOrRefuse(ROOT, 'b270');   // F-44.419: no fault is planted on a disk without room
  for (const [what, a, bb, cell] of MUT) {
    const keepRt = read(RT); const keepGen = read(GEN); const s0 = [sha(RT), sha(GEN)];
    if (keepRt.split(a).length !== 2) { ok(false, `M ${cell}: the mutation's anchor is found once in ${RT}`); continue; }
    const built = buildIn(keepRt.replace(a, bb)); if (built.gen === null) { ok(false, `M ${cell}: the fault builds`, built.err); continue; }
    const keep = { pass, fail }; const log = console.log; const lines = []; const held = []; let back = false;
    try {
      held.push(guard.apply(ROOT, RT, a, bb, 'b270')); // the guard plants with String.replace, which reads $ in its replacement text: each $ of the built runtime is passed as $$
      held.push(guard.apply(ROOT, GEN, keepGen, built.gen.replace(/\$/g, '$$$$'), 'b270'));
      if (read(GEN) !== built.gen) throw new Error('the planted rt.gen.ts is not the fault\'s own build');
      console.log = (x) => lines.push(String(x)); await drawn(' (mutated)');
    } catch (e) { lines.push('  FAIL  threw ' + e.message); } finally { console.log = log; back = held.reverse().map((h) => h.restore()).every(Boolean) && held.length === 2; }
    back = back && sha(RT) === s0[0] && sha(GEN) === s0[1];
    const red = lines.some((l) => l.startsWith('  FAIL  ' + cell)); pass = keep.pass; fail = keep.fail;
    ok(red && back, `M ${cell} (${what}): reddens, runtime.ts and rt.gen.ts restored by sha`, !red ? 'did not redden' : 'not restored');
  }
  ok(!fs.existsSync(PENDING), '3.3 nothing pending in the tree after the mutations');
  console.log(`\nb270: ${pass} pass, ${fail} fail`); process.exit(fail ? 1 : 0);
})();
