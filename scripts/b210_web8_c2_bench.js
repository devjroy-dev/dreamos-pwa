// scripts/b210_web8_c2_bench.js · TDW · CE-47 · WEB-8 C2 · the founder's walk of the live Noir site
// §1 "Ask for a quote" is a real control in all six styles: a link to her WhatsApp with the package named, carrying
//    data-enquire and data-package (the panel opens with it); a row with a price stays a price.
// §2 Display text is not selectable (a tap does not raise the phone's search sheet); body copy stays selectable.
// §3 Couture's studio-notes ticker is a real control.
// §4 The room's phone preview draws a whole phone screen (374 x 760) shrunk to fit (cure A).
// §5 The enquiry panel opens with the package, says it, and names it in the WhatsApp hand-off and the door's page.
// §6 Mutations: each named fault reddens its cell; every file is restored byte for byte.
// §7 Drawn: in each style's own CSS the quote link is visible and looks like the price beside it (the .q collision, CE-47).
'use strict';
const fs = require('fs'); const path = require('path'); const crypto = require('crypto');
const ROOT = path.join(__dirname, '..'); const P = (f) => path.join(ROOT, f); const read = (f) => fs.readFileSync(P(f), 'utf8');
const { makeLoader } = require('./lib/site_load');
let pass = 0, fail = 0; const ok = (c, name, why) => { if (c) { pass++; console.log('  PASS  ' + name); } else { fail++; console.log('  FAIL  ' + name + (why ? '  [' + String(why).slice(0, 200) + ']' : '')); } };
const STYLES = ['couture', 'gallery', 'noir', 'heritage', 'aurora', 'riviera'];
const opts = { code: 'studio-ivara', base: 'https://studio-ivara.thedreamwedding.in', api: 'https://x', display: 'swap', preview: false };
// WEB-8 (F-44.419): each fault is planted through scripts/lib/mutation_guard.js (kept copy and marker first, restored
// by sha, a killed run's fault put back at the next start) and only on a disk with room; the fixture cards read
// ../dream-os, so the bench refuses (exit 3) when it is missing or older than the commit it needs (lesson 4).
const guard = require('./lib/mutation_guard.js'); const gates = require('./lib/web8_gates.js');
guard.recoverOrRefuse(ROOT, 'b210');
gates.siblingOrRefuse(gates.siblingDir(ROOT), gates.SITE_NEEDS, gates.SITE_NEEDS_WHY, 'b210');
const cards = require(P('tools/site_rig/fixture_cards.cjs'))('https://img.example');
const quoteCard = (st) => { const c = JSON.parse(JSON.stringify(cards[`fixture-${st}`])); c.enquire_link = 'https://wa.me/917982159047';
  c.packages = [{ name: 'Bridal makeup and hair', total: null, inclusions: [] }, { name: 'Engagement', total: 25000, inclusions: [] }]; return c; };
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(P(f))).digest('hex');

async function cells(tag) {
  const load = makeLoader(); const D = load('lib/site/doc.ts'); const docs = {};
  for (const st of STYLES) docs[st] = await D.siteDocument(quoteCard(st), opts);
  console.log(`\n§1 the quote control${tag}`);
  for (const st of STYLES) {
    const d = docs[st] || ''; const m = /<a class="v ask-q" href="([^"]+)"[^>]*data-enquire data-package="([^"]*)"[^>]*>([^<]*)<\/a>/.exec(d);
    const href = m ? decodeURIComponent(m[1].replace(/\+/g, ' ')).replace(/&amp;/g, '&') : '';
    ok(m && /^https:\/\/wa\.me\/917982159047\?text=Hello, I would like a quote for Bridal makeup and hair\.$/.test(href) && m[2] === 'Bridal makeup and hair' && /^ask for a quote$/i.test(m[3]), `1.1 ${st}: "Ask for a quote" is a link to her WhatsApp with the package named, data-enquire and data-package`, m ? href : 'no quote link');
    ok(!/data-package="Engagement"/.test(d) && /Rs 25,000/i.test(d), `1.2 ${st}: a row with a price stays a price, not a control`);
  }
  console.log(`\n§2 display text${tag}`);
  const docSrc = read('lib/site/doc.ts'); const dt = (/const DISPLAY_TEXT = `([^`]*)`/.exec(docSrc) || [])[1] || '';
  const sel = (dt.split('{')[0] || '').split(',').map((x) => x.trim());
  ok(['h1', 'h2', 'h3', 'nav', 'header', '.caps', '.lbl', '.pill', 'a', 'button'].every((x) => sel.includes(x)) && /user-select:none/.test(dt), '2.1 her name, titles, eyebrows, menus and controls are unselectable', sel.join(' '));
  ok(!sel.some((x) => /^(p|body|main|section|\.ans|\.note|blockquote|q|\*)$/.test(x)), '2.2 body copy is not in the unselectable set (her about, answers, notes, reviews)', sel.join(' '));
  ok(STYLES.every((st) => (docs[st] || '').includes('user-select:none')), '2.3 every style\'s page carries the rule');
  console.log(`\n§3 Couture's ticker${tag}`);
  const tk = /<a class="ticker"[^>]*href="([^"]+)"[^>]*data-enquire>/.exec(docs.couture || '');
  ok(tk && /^https:\/\/wa\.me\/917982159047/.test(tk[1]), '3.1 the studio-notes ticker is a link to her WhatsApp that opens the panel', tk ? tk[1] : 'not a link');
  console.log(`\n§4 the room's preview${tag}`);
  const room = read('components/website/WebsiteRoom.tsx');
  ok(/const ih = mode === 'phone' \? 760 : 0;/.test(room) && /k = ih \? Math\.min\(height \/ ih, w \/ iw\) : w \/ iw/.test(room) && /height: ih \|\| height \/ k/.test(room), '4.1 the phone preview draws a 374 x 760 screen shrunk to the window and centred');
  console.log(`\n§5 the panel${tag}`);
  const pj = read('public/site/enquire-panel.js');
  ok(/open\(t\.dataset\.package\|\|''\)/.test(pj), '5.1 a click on a control with data-package opens the panel with that package');
  ok(/page:pkg\?\{kind:'other',title:`Pricing: \$\{pkg\}`\}:pageFact\(\)/.test(pj), '5.2 the door is told the package ("Pricing: <package>") in its page field');
  ok(/if\(st\.pkg\)say\(`You are asking about \$\{st\.pkg\}\.`/.test(pj), '5.3 the panel says which package she is asking about');
  ok(/const about=st\.pkg\?`a quote for \$\{st\.pkg\}`/.test(pj), '5.4 the WhatsApp hand-off names the package');
}
const MUT = [
  ['lib/site/styles/noir.ts', "quoteLink(c, p.name, 'ASK FOR A QUOTE')", "'ASK FOR A QUOTE'", '1.1 noir'],
  ['lib/site/parts.ts', 'data-enquire data-package=', 'data-x=', '1.1 couture'],
  ['lib/site/doc.ts', 'h1,h2,h3,header,nav,', 'header,nav,', '2.1'],
  ['lib/site/doc.ts', '.mono,.btn,', '.mono,.btn,p,', '2.2'],
  ['lib/site/styles/couture.ts', '" target="_blank" rel="noopener" data-enquire><div class="tk-track"', '" target="_blank" rel="noopener"><div class="tk-track"', '3.1'],
  ['components/website/WebsiteRoom.tsx', "const ih = mode === 'phone' ? 760 : 0;", "const ih = mode === 'phone' ? 0 : 0;", '4.1'],
  ['public/site/enquire-panel.js', "open(t.dataset.package||'')", 'open()', '5.1'],
  ['lib/site/parts.ts', "cls = 'v ask-q'", "cls = 'v q ask-q'", '7.1'],
];
async function browserBin() {   // the harness's order (FE-8 C1): CHROME_BIN, /opt/pw-browsers, @sparticuz/chromium
  const usable = (p) => { try { return !!p && fs.statSync(p).isFile(); } catch (_e) { return false; } };
  let bin = process.env.CHROME_BIN; if (!usable(bin)) bin = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium'].find(usable);
  if (!usable(bin)) { const m = await import('@sparticuz/chromium'); bin = await (m.default || m).executablePath(); } return bin;
}
async function drawn(tag) {
  console.log(`\n§7 drawn in each style's own CSS${tag}`);
  const load = makeLoader(); const D = load('lib/site/doc.ts'); const puppeteer = (await import('puppeteer-core')).default;
  const b = await puppeteer.launch({ executablePath: await browserBin(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  try {
    for (const st of STYLES) {
      const doc = await D.siteDocument(quoteCard(st), opts); const pg = await b.newPage(); await pg.setViewport({ width: 374, height: 760 });
      await pg.setRequestInterception(true); pg.on('request', (r) => (r.url().startsWith('data:') ? r.continue() : r.respond({ status: 204, body: '' })));
      await pg.setContent(doc, { waitUntil: 'domcontentloaded' });
      const o = await pg.evaluate(() => { const a = document.querySelector('#price a.ask-q'); if (!a) return { none: true };
        const row = a.closest('.row'); const n = row && row.querySelector('.n'); const priced = [...document.querySelectorAll('#price .row')].map((r) => r.querySelector('.v')).find((v) => v && v.tagName === 'SPAN');
        const c = getComputedStyle(a); const cn = n ? getComputedStyle(n) : null; const cp = priced ? getComputedStyle(priced) : null; const r = a.getBoundingClientRect();
        const same = cp ? ['fontFamily', 'fontSize', 'fontWeight', 'letterSpacing', 'color', 'textTransform', 'textDecorationLine'].filter((k) => c[k] !== cp[k]) : ['no priced row'];
        return { op: c.opacity, nop: cn && cn.opacity, vis: c.visibility, disp: c.display, w: r.width, h: r.height, same }; });
      ok(!o.none && o.op === o.nop && o.vis === 'visible' && o.disp !== 'none' && o.w > 20 && o.h > 4, `7.1 ${st}: "Ask for a quote" is drawn (as visible as the package name beside it)`, JSON.stringify(o));
      ok(!o.none && o.same.length === 0, `7.2 ${st}: it looks like the price in the row above (type, size, weight, spacing, colour, case, no underline)`, JSON.stringify(o.same));
      await pg.close();
    }
  } finally { await b.close(); }
}
(async () => {
  console.log('b210 · WEB-8 C2'); await cells(''); await drawn('');
  console.log('\n§6 mutations: each named fault reddens its cell; restored by sha');
  gates.spaceOrRefuse(ROOT, 'b210');   // F-44.419: no fault is planted on a disk without room
  for (const [f, a, b, cell] of MUT) {
    const before = sha(f); const src = read(f); if (src.split(a).length !== 2) { ok(false, `M ${cell}: the mutation's anchor is found once in ${f}`); continue; }
    let h = null; try { h = guard.apply(ROOT, f, a, b, 'b210'); } catch (e) { ok(false, `M ${cell}: the fault was planted through the guard`, e.message); continue; }
    const keep = { pass, fail }; let red = false; const log = console.log; const lines = []; let back = false;
    console.log = (x) => lines.push(String(x)); try { await cells(' (mutated)'); await drawn(' (mutated)'); } catch (e) { lines.push('  FAIL  threw ' + e.message); } finally { console.log = log; back = h.restore(); }
    red = lines.some((l) => l.startsWith('  FAIL  ' + cell)); pass = keep.pass; fail = keep.fail;
    ok(red && back && sha(f) === before, `M ${cell} in ${f}: reddens, restored by sha`, red ? 'not restored' : 'did not redden');
  }
  ok(!fs.existsSync(P('scripts/.mutation-pending')), 'M.9 nothing pending in the tree after the mutations (F-44.419)');
  console.log(`\nb210: ${pass} pass, ${fail} fail`); process.exit(fail ? 1 : 0);
})();
