'use strict';
// scripts/b231_ce47_off_a2_site_shop_bench.js · CE-47 · OFF-A2 · THE OFF-SEASON SHOP ON HER WEBSITE (lib/site/shop.ts and its wiring).
// Loads the styles site's TypeScript in plain node (scripts/lib/site_load.js, as b162 does); the network is a stub that serves
// OFF-A1's public shop door for one handle and refuses everything else. Hostile words in every field she or a buyer writes.
// §5 (OFF-2, CE-47): the Ask form RUN in headless Chromium (F-44.341), a hostile studio name (F-44.342), the pay_url hosts (Q-B, Q-C).
// §6 (OFF-2, CE-47 Q-A): the classic page's storefront row, drawn and RUN in Chromium at 374.
// §8 (OFF-2, CE-47, the WEB-8 pixel gate): with nothing shown, every style's home is byte-equal to base (B231_BASE).
// §7 (OFF-2, CE-47): no empty picture box (section, item page, classic row) and F-44.343, the item page's header solid at 374.
const path = require('path'); const fs = require('fs');
const { makeLoader, ROOT } = require('./lib/site_load');
let pass = 0, fail = 0; const failed = [];
function ok(c, name, info) { let v = false; try { v = typeof c === 'function' ? c() : c; } catch (e) { info = 'threw: ' + e.message; }
  if (v) { pass += 1; console.log(`  PASS  ${name}`); } else { fail += 1; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 220) + ']'}`); } }
const sec = (t) => console.log(`\n§${t}`);
const read = (r) => { try { return fs.readFileSync(path.join(ROOT, r), 'utf8'); } catch (_e) { return ''; } };
const EVIL = `"><img src=x onerror=alert(1)><script>alert(2)</script>' onmouseover='x`;
const P = (k) => ({ url: `https://res.cloudinary.com/tdw/image/upload/v1/site/${k}.jpg`, focal_portrait: { x: 50, y: 50 }, focal_landscape: { x: 50, y: 50 } });
const ITEMS = [
  { kind: 'voucher', name: 'Makeup trial voucher', slug: 'makeup-trial-voucher', photo_url: 'https://res.cloudinary.com/tdw/image/upload/v1/site/v.jpg', price: 3000, price_words: 'Rs 3,000', includes: ['One look', EVIL], facts: 'Gift voucher · Valid 12 months', seats_left: null, sold_out: false },
  { kind: 'workshop', name: EVIL, slug: 'party-makeup-masterclass', photo_url: null, price: 4500, price_words: 'Rs 4,500', includes: [], facts: 'Workshop · 12 of 20 seats left · 14 December 2026 · Lajpat Nagar', seats_left: 12, sold_out: false },
  { kind: 'booking', name: 'Engagement look', slug: 'engagement-look', photo_url: 'javascript:alert(9)', price: 18000, price_words: 'Rs 18,000', includes: [], facts: 'Booking · Engagement · 3 hours', seats_left: null, sold_out: false, lead_days: 7 },
  { kind: 'workshop', name: 'Sold workshop', slug: 'sold-workshop', photo_url: null, price: 1000, price_words: 'Rs 1,000', includes: [], facts: 'Workshop · Sold out', seats_left: 0, sold_out: true },
  { kind: 'class', name: 'Self makeup online class', slug: 'self-makeup', photo_url: null, price: 2500, price_words: 'Rs 2,500', includes: [], facts: 'Online class', seats_left: null, sold_out: false, class_dates: ['2026-12-01', '2026-12-08'] },
];
let SHOP_UP = true;
global.fetch = async (url) => {
  if (SHOP_UP && /\/api\/v2\/public\/shop\/studio-x$/.test(String(url))) return { ok: true, json: async () => ({ ok: true, items: ITEMS }) };
  throw new Error('no network in b231');
};
function card(style, sections) {
  const keys = sections || ['cover', 'looks', 'pricing', 'faq', 'enquire'];
  return { business_name: 'Studio X', category: 'makeup_artist', city: 'Delhi', handle: 'studio-x', enquire_link: 'https://wa.me/919811000000', date_check_enabled: true, starting_price: 45000, instagram_handle: null,
    packages: [{ name: 'Full wedding', description: null, total: 380000, items: [] }], meta: { title: 'Studio X', description: '' }, eliza: { live_booking: 'coming_soon', own_voice: 'not_in_plan' }, testimonials: [], faq: [{ question: 'Q', answer: 'A' }],
    site: { v: 'styles', style, site_name: 'Studio X', monogram: 'SX', credit: true, domain: null,
      palette: { id: `${style}.1`, roles: { ground: '#ffffff', ink: '#111111', muted: '#666666', line: 'rgba(0,0,0,.1)', soft: '#eeeeee', accent: '#222222', on_accent: '#ffffff' } },
      fonts: null, motion: 'lively', corners: 'soft', buttons: 'solid', texture: 'clean', cover_mode: 'slideshow', cover: [{ photo: P('a'), eyebrow: 'E', headline: 'H', button: 'B' }],
      sections: keys.map((k) => ({ key: k, variant: null, eyebrow: null, heading: null, body: {} })), pages: [], trade: { items: 'Looks', item: 'Look', request: 'Enquire' }, copy: {}, seo: {} },
    looks: [{ slug: 'look-0', title: 'L', category: 'C', cover: P('l0'), second: P('m0') }], collections: [] };
}
const STYLES6 = ['noir', 'heritage', 'aurora', 'riviera', 'gallery', 'couture'];
const HEAD = { couture: '<div class="shead rv"><div><span class="caps">Shop</span><h2>Gift vouchers and workshops</h2></div></div>', gallery: '<div class="sh rv"><div><span class="lbl">Shop</span><h2>Gift vouchers and workshops</h2></div></div>',
  aurora: '<div class="sh rv"><span class="pill glass">Shop</span><h2>Gift vouchers and workshops</h2></div>' };
const headOf = (st) => HEAD[st] || '<div class="sh rv"><span class="caps">Shop</span><h2>Gift vouchers and workshops</h2></div>';
const opts = { code: 'studio-x', base: 'https://studio-x.thedreamwedding.in', api: 'https://api.example', display: 'mixed', preview: false };
const scriptsIn = (doc) => (doc.match(/<script\b/gi) || []).length;
const evilLive = (doc) => /<img src=x onerror|<script>alert\(2\)|onmouseover='x/.test(doc) || /href="javascript:|src="javascript:/i.test(doc);

(async () => {
  const load = makeLoader();
  // B231_ONLY=5 (or 1,2,...) runs only those sections; unset runs all. The whole bench is the rung; this serves a draft whose
  // other halves have not landed yet.
  const run = (n) => !process.env.B231_ONLY || process.env.B231_ONLY.split(',').includes(n);
  const D = load('lib/site/doc.ts'); const S = load('lib/site/shop.ts'); const K = load('lib/site/kind.ts'); const H = load('lib/public/vendorHost.ts');

  if (run('1')) {
  sec('1  the section, in each of the six styles');
  for (const st of STYLES6) {
    SHOP_UP = true; const doc = await D.siteDocument(card(st), opts);
    const at = doc.indexOf('<section id="shop">'); const enq = Math.max(doc.lastIndexOf('<footer'), doc.lastIndexOf('id="enquire"'));
    ok(at > 0 && doc.includes(headOf(st)), `1.${st}.a the section is drawn with ${st}'s own section head`);
    ok(at > 0 && (enq < 0 || at < enq) && at > doc.indexOf('id="pricing"'), `1.${st}.b it sits after her pricing and before Enquire (no 'shop' row of her own)`);
    ok((doc.match(/class="tdw-shop-card/g) || []).length === 5 && doc.includes('href="https://studio-x.thedreamwedding.in/shop/makeup-trial-voucher"') && doc.includes('>Sold out<'), `1.${st}.c five cards, each opening its own page; a sold-out workshop says so`);
    ok(!evilLive(doc) && scriptsIn(doc) === 3, `1.${st}.d hostile words stay words; still the three scripts of the home page`);
    ok(doc.includes('.tdw-shop{') && !/#[0-9a-f]{3,8}\b/i.test(S.SHOP_CSS.replace(/#shop|#fff/g, '')), `1.${st}.e the shop's CSS rides along, with no colour of its own but the button's fallback`);
    ok(doc.includes('href="#shop"'), `1.${st}.f her menu gains Shop`);
    SHOP_UP = false; const plain = await D.siteDocument(card(st), opts);
    ok(!plain.includes('tdw-shop') && !plain.includes('id="shop"'), `1.${st}.g no shown item (or the shop door shut or down): no section, no CSS, no menu line`);
  }
  SHOP_UP = true;
  const placed = await D.siteDocument(card('noir', ['cover', 'shop', 'looks', 'enquire']), opts);
  ok(placed.indexOf('id="shop"') < placed.indexOf('id="looks"'), "1.h her own 'shop' row decides where the section sits");

  }
  if (run('2')) {
  sec('2  an item\'s own page');
  const it = (slug) => ITEMS.find((i) => i.slug === slug);
  const pages = {};
  for (const slug of ['makeup-trial-voucher', 'party-makeup-masterclass', 'engagement-look', 'sold-workshop', 'self-makeup']) pages[slug] = await D.shopItemDocument(card('heritage'), it(slug), opts);
  ok(Object.values(pages).every((d) => d && !evilLive(d)), '2.1 hostile words on every page stay words; a javascript: picture is never drawn');
  ok(scriptsIn(pages['makeup-trial-voucher']) === 4 && scriptsIn(pages['sold-workshop']) === 4, "2.2 four scripts: the home page's three and the Ask form's one");
  ok(/name="qty"[^>]*max="12"/.test(pages['party-makeup-masterclass']) && !/name="qty"/.test(pages['makeup-trial-voucher']), '2.3 a workshop asks how many seats, at most the seats left; a voucher does not');
  ok(/type="date" name="wanted_date" required/.test(pages['engagement-look']) && /<select name="wanted_date" required><option value="2026-12-01">1 December 2026<\/option>/.test(pages['self-makeup']), "2.4 a booking asks for a date; a class with dates offers only hers, in full months");
  ok(!/id="tdwAsk"/.test(pages['sold-workshop']) && pages['sold-workshop'].includes('>This item is sold out.<'), '2.5 a sold-out workshop has no form');   // AMENDED BY LABEL · R-47.1: its message is a sentence
  ok(/data-studio="Studio X"/.test(pages['makeup-trial-voucher']) && pages['makeup-trial-voucher'].includes('"https://api.example/api/v2/public/shop/studio-x/order"'), "2.6 the form posts to OFF-A1's order door for her handle");
  const pg = pages['makeup-trial-voucher']; const pvExpr = (pg.match(/var pv=([^;]*);/) || [])[1] || 'null';
  const provider = (h) => new Function('h', `return ${pvExpr};`)(h);
  ok(pg.includes('Your payment goes through __P__ straight to __S__. __P__ may charge its own fees.')   /* AMENDED BY LABEL · R-47.1 */ && pg.includes('Continue to payment')
    && provider('rzp.io') === 'Razorpay' && provider('pages.razorpay.com') === 'Razorpay' && provider('payments.cashfree.com') === 'Cashfree' && provider('evil-rzp.io.example.com') === '' && provider('xrzpxio') === '',
    '2.7 G2: with a payment link she is told who takes the money before she goes; Razorpay or Cashfree named from the link, nothing else named', pvExpr);
  ok((() => { const js = pg.slice(pg.lastIndexOf('<script>') + 8, pg.lastIndexOf('</script>')); new Function(js); return true; })(), "2.7b the Ask form's script parses");
  ok(pages['makeup-trial-voucher'].includes('will message you on WhatsApp about payment'), '2.8 without one: the studio will message her on WhatsApp about payment');
  ok(/<link rel="canonical" href="https:\/\/studio-x\.thedreamwedding\.in\/shop\/makeup-trial-voucher">/.test(pages['makeup-trial-voucher']), '2.9 its address is her own: /shop/<slug>');
  ok(!/\b(bride|couple)s?\b/i.test(read('lib/site/shop.ts').replace(/\/\/.*$/gm, '')) && !/\u2014/.test(read('lib/site/shop.ts')), "2.10 no word a buyer reads says bride or couple, and no long dash");

  }
  if (run('3')) {
  sec('3  her address reaches it');
  ok(JSON.stringify(K.sitePath('/v/studio-x/shop/makeup-trial-voucher')) === JSON.stringify({ code: 'studio-x', to: '/site/studio-x/shop/makeup-trial-voucher' }), '3.1 the switch sends /v/<code>/shop/<slug> to the site route');
  const d1 = H.decide('studio-x.thedreamwedding.in', '/shop/makeup-trial-voucher', 'https://thedreamwedding.in', '');
  ok(d1 && d1.kind === 'rewrite' && d1.pathname === '/v/studio-x/shop/makeup-trial-voucher', '3.2 her own address rewrites /shop/<slug> like a look', JSON.stringify(d1));
  ok(/\(looks\|work\|acts\|events\|collections\|shop\)\\\/\[\^\/\]\+/.test(read('middleware.ts')), '3.3 the proxy waits for the site switch on a shop page too');
  const R = read('app/site/[code]/[word]/[slug]/route.ts');
  ok(/if \(asked === 'shop'\) \{[\s\S]*fetchShop\(card\.handle \|\| code, preview\)\)\.find\(\(i\) => i\.slug === slug\)[\s\S]*Response\.redirect\(`\$\{base\}\/#shop`, 307\)/.test(R) && R.indexOf("asked === 'shop'") < R.indexOf('if (asked !== word)'), "3.4 the route draws a shown item, sends anything else to her shop, and decides before the trade-word redirect");

  }
  if (run('4')) {
  sec('4  mutations (production code, in memory)');
  const shopSrc = read('lib/site/shop.ts');
  const M1 = shopSrc.replace("if (!has || sections.some((s) => s.key === 'shop')) return sections;", 'return sections;');
  ok(M1 !== shopSrc, '4.0 mutation anchors present');
  const mod = (src) => { const ts = require('typescript'); const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText; const m = { exports: {} }; new Function('module', 'exports', 'require', js)(m, m.exports, (id) => load(id.startsWith('./') ? `lib/site/${id.slice(2)}.ts` : id)); return m.exports; };
  ok(mod(M1).withShopSection([{ key: 'enquire' }], true).length === 1, '4.1 m1 the section never placed: 1.b/1.c red (no row added)');
  const M2 = shopSrc.replace("if (!items.length) return raw('');", '');
  ok(String(mod(M2).shopSection('noir', [], { key: 'shop' }, '').s).includes('id="shop"'), '4.2 m2 an empty shop drawn anyway: 1.g red (an empty section appears)');

  }

  if (run('5')) {
  sec('5  the Ask form, RUN in Chromium (F-44.341, F-44.342, Q-B, Q-C)');
  // The item page is served at her address and the order door answers on the same origin (o.api = the page's origin), so no
  // cross-origin step stands between the form and the door. Every request is answered here; nothing reaches a network.
  // F-44.364: the service worker is bypassed. e-275: every wait is on the thing itself, bounded; the browser close is bounded.
  const ORIGIN = 'https://studio-x.thedreamwedding.in';
  const STUDIO = "Studio $& $' X";   // F-44.342: a name holding replace() patterns must print as written
  const ITEM = { voucher: ITEMS[0], workshop: { ...ITEMS[1], name: 'Party makeup masterclass' }, cls: ITEMS[4] };
  for (const k of Object.keys(ITEM)) ITEM[k] = { ...ITEM[k], photo_url: null };
  const H = await import(path.join(ROOT, 'docs/design/tools/harness.mjs'));
  const loadShop = (src) => { const ts = require('typescript'); const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText; const m = { exports: {} };
    new Function('module', 'exports', 'require', js)(m, m.exports, (id) => load(id.startsWith('./') ? `lib/site/${id.slice(2)}.ts` : id)); return m.exports; };
  const SHOP_SRC = read('lib/site/shop.ts');
  let b = null;
  /** One submit: the page drawn from `mod`, the door answering `answer`; returns what the buyer sees and what was posted. */
  async function submit(mod, item, answer, fill) {
    const p = await b.newPage(); const posts = [];
    try {
      const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
      const doc = `<!doctype html><html><head><meta charset="utf-8"></head><body>${mod.itemBody(item, { base: ORIGIN, api: ORIGIN, code: 'studio-x', studio: STUDIO, header: '' })}</body></html>`;
      await p.setRequestInterception(true);
      p.on('request', (r) => {
        const u = r.url();
        if (u === `${ORIGIN}/shop/${item.slug}`) return r.respond({ status: 200, contentType: 'text/html; charset=utf-8', body: doc });
        if (u === `${ORIGIN}/api/v2/public/shop/studio-x/order` && r.method() === 'POST') { let j = null; try { j = JSON.parse(r.postData() || 'null'); } catch (_e) { j = null; } posts.push(j);
          return r.respond({ status: answer.status || 200, contentType: 'application/json', body: JSON.stringify(answer.body) }); }
        return r.abort();
      });
      await p.goto(`${ORIGIN}/shop/${item.slug}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await p.waitForSelector('#tdwAsk input[name="buyer"]', { timeout: 20000 });
      await p.type('#tdwAsk input[name="buyer"]', 'Ananya Gupta'); await p.type('#tdwAsk input[name="phone"]', '9811022338');
      if (fill) await fill(p);
      await p.click('#tdwAsk button[type="submit"]');
      const arrived = await p.waitForFunction(() => (document.getElementById('tdwMsg') || {}).textContent, { timeout: 20000 }).then(() => true).catch(() => false);
      const seen = await p.evaluate(() => { const f = document.getElementById('tdwAsk'); const a = f && f.querySelector('a.tdw-pay');
        return { msg: (document.getElementById('tdwMsg') || {}).textContent || '', pay: a ? { href: a.getAttribute('href'), rel: a.getAttribute('rel'), target: a.getAttribute('target'), text: a.textContent } : null,
          labelsHidden: [...f.querySelectorAll('label')].every((l) => l.style.display === 'none'), button: (() => { const x = f.querySelector('button'); return { hidden: x.style.display === 'none', disabled: x.disabled }; })() }; });
      return { arrived, posts, ...seen };
    } finally { await p.close().catch(() => {}); }
  }
  const S0 = loadShop(SHOP_SRC);
  const OK = (pay_url) => ({ body: { ok: true, order_id: 'o9', pay_url, state: 'asked' } });
  const THANKS = `Thank you. ${STUDIO} will message you on WhatsApp about payment.`;
  const G2 = (pv) => `Your payment goes through ${pv} straight to ${STUDIO}. ${pv} may charge its own fees.`;   // AMENDED BY LABEL · R-47.1
  const noLink = (r) => r.arrived && r.msg === THANKS && r.pay === null && r.labelsHidden && r.button.hidden;
  try {
    b = await H.browser();
    let r = await submit(S0, ITEM.voucher, OK(null));
    ok(r.arrived && r.posts.length === 1 && JSON.stringify(r.posts[0]) === JSON.stringify({ slug: 'makeup-trial-voucher', name: 'Ananya Gupta', phone_e164: '+919811022338' }), '5.1 F-44.341: the form posts the buyer\'s own name and phone (+91) for the item', JSON.stringify(r.posts));
    ok(noLink(r), '5.2 no pay_url: the fields close and the WhatsApp thank-you line reads in full', JSON.stringify(r));
    ok(r.msg.includes("$&") && r.msg.includes("$'"), "5.3 F-44.342: a studio name holding $& and $' prints as written", r.msg);
    r = await submit(S0, ITEM.workshop, OK(null), async (p) => { await p.evaluate(() => { const q = document.querySelector('input[name="qty"]'); q.value = ''; }); await p.type('input[name="qty"]', '2'); });
    ok(r.posts.length === 1 && r.posts[0].qty === 2 && !('wanted_date' in r.posts[0]), '5.4 a workshop posts its seats', JSON.stringify(r.posts));
    r = await submit(S0, ITEM.cls, OK(null), async (p) => { await p.select('select[name="wanted_date"]', '2026-12-08'); });
    ok(r.posts.length === 1 && r.posts[0].wanted_date === '2026-12-08' && !('qty' in r.posts[0]), '5.5 a class with dates posts the date picked', JSON.stringify(r.posts));
    for (const [n, url, pv] of [['5.6', 'https://rzp.io/l/abc', 'Razorpay'], ['5.7', 'https://pages.razorpay.com/pl_x/view', 'Razorpay'], ['5.8', 'https://payments.cashfree.com/forms/x', 'Cashfree']]) {
      r = await submit(S0, ITEM.voucher, OK(url));
      ok(r.arrived && r.msg === G2(pv) && r.pay && r.pay.href === url && r.pay.text === 'Continue to payment' && r.pay.rel === 'noopener noreferrer' && r.pay.target === null && r.labelsHidden,
        `${n} G2 and Q-C: ${new URL(url).hostname} names ${pv} and who takes the money; Continue to payment, same tab, rel noopener noreferrer`, JSON.stringify(r));
    }
    for (const [n, url] of [['5.9', 'https://evil-rzp.io.example.com/pay'], ['5.10', 'https://xrzpxio/pay'], ['5.11', 'http://rzp.io/l/abc'], ['5.12', 'not a link']]) {
      r = await submit(S0, ITEM.voucher, OK(url));
      ok(noLink(r), `${n} Q-B: ${url} is treated as no link; the WhatsApp thank-you line, nothing to follow`, JSON.stringify(r));
    }
    r = await submit(S0, ITEM.voucher, { status: 422, body: { ok: false, field: 'phone_e164', error: 'Please give a 10-digit mobile number.' } });
    ok(r.arrived && r.msg === 'Please give a 10-digit mobile number.' && !r.labelsHidden && !r.button.disabled && !r.button.hidden, '5.13 a refusal reads its own sentence and the form stays open to try again', JSON.stringify(r));
    // mutations, in memory only (transpiled from a changed string; no file is written, so e-277 does not apply)
    const M3 = SHOP_SRC.replace("name:q('buyer').value.trim()", 'name:f.name.value.trim()');
    const M4 = SHOP_SRC.replace('return t.replace(/__S__/g,function(){return st})', 'return t.replace(/__S__/g,st)');
    ok(M3 !== SHOP_SRC && M4 !== SHOP_SRC, '5.14 mutation anchors present');
    r = await submit(loadShop(M3), ITEM.voucher, OK(null));
    ok(!(r.posts.length === 1 && noLink(r)), '5.15 m3 the old f.name read: 5.1/5.2 red (nothing is sent)', JSON.stringify(r));
    r = await submit(loadShop(M4), ITEM.voucher, OK(null));
    ok(r.msg !== THANKS, '5.16 m4 a plain string replacer: 5.3 red (the name is mangled)', r.msg);
  } finally {
    if (b) { const proc = b.process && b.process(); const done = await Promise.race([b.close().then(() => true).catch(() => true), new Promise((res) => setTimeout(() => res(false), 15000))]); if (!done && proc) { try { proc.kill('SIGKILL'); } catch (_e) { /* gone */ } } }
  }
  }

  if (run('6')) {
  sec('6  the classic page\'s storefront row (CE-47 Q-A): drawn, then RUN in Chromium');
  const S6 = load('lib/site/shop.ts'); const STUDIO6 = "Studio $& $' X";
  const ITEMS6 = ITEMS.map((i) => ({ ...i }));
  const row = S6.classicShopRow(ITEMS6, STUDIO6);
  ok(S6.classicShopRow([], STUDIO6) === '', '6.1 no shown item: nothing at all');
  ok((row.match(/<details class="pv-srow">/g) || []).length === 5 && row.includes('>Gift vouchers and workshops<'), '6.2 one line per shown item under "Gift vouchers and workshops"');
  ok(!evilLive(row) && !/<script/i.test(row), '6.3 hostile words stay words; the row carries no script of its own');
  ok((row.match(/<form class="tdw-ask"/g) || []).length === 4 && !/id="tdwAsk"/.test(row) && /Sold workshop[\s\S]*?pv-sprice">Sold out<[\s\S]*?<p class="tdw-msg">This item is sold out\.<\/p><\/div><\/details>/.test(row)   /* AMENDED BY LABEL · R-47.1 */, '6.4 each item has its own Ask; a sold-out workshop says Sold out and has none');
  ok((row.match(/<img class="pv-sthumb"/g) || []).length === 1 && !/javascript:/i.test(row), '6.5 a picture only from an https address (a javascript: one is never drawn)');
  ok(!/\b(bride|couple)s?\b/i.test(row) && !/\u2014/.test(row), '6.6 no bride or couple, no long dash');
  const PG = read('app/v/[code]/page.tsx');
  ok(/const shop = await fetchShop\(card\.handle \|\| code\);/.test(PG) && /\{shop\.length > 0 && \(/.test(PG) && /classicShopRow\(shop, card\.business_name \|\| ''\)/.test(PG) && /askScript\(API_BASE, card\.handle \|\| code\)/.test(PG)
    && PG.indexOf('classicShopRow(shop') < PG.indexOf('<footer className="pv-close">'), '6.7 the classic page draws the row and its one script before her close, only when she has shown items');
  { const SRC6 = read('lib/site/shop.ts'); const M5 = SRC6.replace("  if (!items.length) return '';\n  const rows = items.map", '  const rows = items.map');
    const ts = require('typescript'); const js = ts.transpileModule(M5, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText; const m = { exports: {} };
    new Function('module', 'exports', 'require', js)(m, m.exports, (id) => load(id.startsWith('./') ? `lib/site/${id.slice(2)}.ts` : id));
    ok(M5 !== SRC6 && m.exports.classicShopRow([], STUDIO6) !== '', '6.m5 mutation (in memory): the empty guard removed draws an empty row: 6.1 red'); }
  const H6 = await import(path.join(ROOT, 'docs/design/tools/harness.mjs'));
  // In the browser the workshop is given a plain name so a tap can find its line (6.3 already holds the hostile one).
  const rowB = S6.classicShopRow(ITEMS6.map((i) => (i.slug === 'party-makeup-masterclass' ? { ...i, name: 'Party makeup masterclass' } : i)), STUDIO6);
  const ORIGIN6 = 'https://thedreamwedding.in'; const API6 = 'https://api.example';
  let b6 = null;
  async function runRow(answer, pick, fill) {
    const p = await b6.newPage(); const posts = [];
    try {
      const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
      await p.setViewport({ width: 374, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
      const doc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><main class="pv pv-card">${rowB}<script>${S6.askScript(API6, 'studio-x')}</script></main></body></html>`;
      await p.setRequestInterception(true);
      p.on('request', (r) => {
        const u = r.url();
        if (u === `${ORIGIN6}/v/studio-x`) return r.respond({ status: 200, contentType: 'text/html; charset=utf-8', body: doc });
        if (u === `${API6}/api/v2/public/shop/studio-x/order`) {
          const cors = { 'Access-Control-Allow-Origin': ORIGIN6, 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST' };
          if (r.method() === 'OPTIONS') return r.respond({ status: 204, headers: cors, body: '' });
          let j = null; try { j = JSON.parse(r.postData() || 'null'); } catch (_e) { j = null; } posts.push(j);
          return r.respond({ status: answer.status || 200, headers: cors, contentType: 'application/json', body: JSON.stringify(answer.body) });
        }
        return r.abort();
      });
      await p.goto(`${ORIGIN6}/v/studio-x`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      const closedFirst = await p.evaluate(() => [...document.querySelectorAll('details.pv-srow')].every((d) => !d.open));
      // open the chosen line by a tap on its summary, then fill and send that line's own form
      const box = await p.evaluate((n) => { const s = [...document.querySelectorAll('details.pv-srow > summary')].find((x) => x.querySelector('.pv-sname').textContent === n); s.scrollIntoView({ block: 'center' }); const r = s.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, pick);
      await p.touchscreen.tap(box.x, box.y);
      const opened = await p.waitForFunction((n) => [...document.querySelectorAll('details.pv-srow')].some((d) => d.open && d.querySelector('.pv-sname').textContent === n), { timeout: 20000 }, pick).then(() => true).catch(() => false);
      await p.evaluate((n) => { const d = [...document.querySelectorAll('details.pv-srow')].find((x) => x.querySelector('.pv-sname').textContent === n); d.querySelector('form').setAttribute('data-under-test', '1'); }, pick);
      await p.type('form[data-under-test] input[name="buyer"]', 'Ananya Gupta'); await p.type('form[data-under-test] input[name="phone"]', '9811022338');
      if (fill) await fill(p);
      await p.click('form[data-under-test] button[type="submit"]');
      const arrived = await p.waitForFunction(() => (document.querySelector('form[data-under-test] .tdw-msg') || {}).textContent, { timeout: 20000 }).then(() => true).catch(() => false);
      const seen = await p.evaluate(() => { const f = document.querySelector('form[data-under-test]'); const a = f.querySelector('a.tdw-pay');
        const others = [...document.querySelectorAll('form.tdw-ask:not([data-under-test])')].every((g) => g.querySelector('.tdw-msg').textContent === '' && [...g.querySelectorAll('label')].every((l) => l.style.display !== 'none'));
        return { msg: f.querySelector('.tdw-msg').textContent, pay: a ? { href: a.getAttribute('href'), rel: a.getAttribute('rel'), target: a.getAttribute('target'), text: a.textContent } : null, others, wide: document.documentElement.scrollWidth }; });
      return { closedFirst, opened, arrived, posts, ...seen };
    } finally { await p.close().catch(() => {}); }
  }
  try {
    b6 = await H6.browser();
    const OK6 = (pay_url) => ({ body: { ok: true, order_id: 'o9', pay_url, state: 'asked' } });
    let r = await runRow(OK6(null), 'Makeup trial voucher');
    ok(r.closedFirst && r.opened, '6.8 every line starts closed; a tap on a line opens its Ask in place', JSON.stringify(r));
    ok(r.arrived && r.posts.length === 1 && JSON.stringify(r.posts[0]) === JSON.stringify({ slug: 'makeup-trial-voucher', name: 'Ananya Gupta', phone_e164: '+919811022338' }), "6.9 that line's own form posts its own item to the same public door, across origins as on the live page", JSON.stringify(r.posts));
    ok(r.msg === `Thank you. ${STUDIO6} will message you on WhatsApp about payment.` && r.pay === null && r.others, '6.10 no pay_url: the same thank-you line (a $& and $\' studio name as written); every other line untouched', JSON.stringify(r));
    ok(r.wide <= 374, '6.11 nothing runs sideways at 374 with a line open', String(r.wide));
    r = await runRow(OK6('https://rzp.io/l/abc'), 'Party makeup masterclass', async (p) => { await p.evaluate(() => { document.querySelector('form[data-under-test] input[name="qty"]').value = ''; }); await p.type('form[data-under-test] input[name="qty"]', '2'); });
    ok(r.posts.length === 1 && r.posts[0].qty === 2 && r.msg === `Your payment goes through Razorpay straight to ${STUDIO6}. Razorpay may charge its own fees.`   /* AMENDED BY LABEL · R-47.1 */ && r.pay && r.pay.href === 'https://rzp.io/l/abc' && r.pay.rel === 'noopener noreferrer' && r.pay.target === null && r.pay.text === 'Continue to payment',
      '6.12 a workshop posts its seats; with a Razorpay link the same G2 line and Continue to payment, same tab', JSON.stringify(r));
    r = await runRow(OK6(null), 'Engagement look', async (p) => { await p.evaluate(() => { const i = document.querySelector('form[data-under-test] input[name="wanted_date"]'); i.value = '2026-12-20'; i.dispatchEvent(new Event('input', { bubbles: true })); }); });
    ok(r.posts.length === 1 && r.posts[0].wanted_date === '2026-12-20', '6.13 a booking posts the date asked for', JSON.stringify(r.posts));
    r = await runRow(OK6('https://evil-rzp.io.example.com/pay'), 'Makeup trial voucher');
    ok(r.pay === null && /will message you on WhatsApp about payment\.$/.test(r.msg), '6.14 Q-B on the classic page too: a host that is not Razorpay or Cashfree is no link', JSON.stringify(r));
  } finally {
    if (b6) { const proc = b6.process && b6.process(); const done = await Promise.race([b6.close().then(() => true).catch(() => true), new Promise((res) => setTimeout(() => res(false), 15000))]); if (!done && proc) { try { proc.kill('SIGKILL'); } catch (_e) { /* gone */ } } }
  }
  }

  if (run('7')) {
  sec('7  no empty picture box (CE-47) and the item page\'s solid header (F-44.343), at 374 in Chromium');
  const H7 = await import(path.join(ROOT, 'docs/design/tools/harness.mjs'));
  const RT = load('lib/site/rt.gen.ts');
  // WEB-8's line as proposed (lib/site/rt/runtime.ts:81), applied IN MEMORY only to show what the cut consumes; never written.
  const RT_TIP = RT.RT_JS; const RT_WEB8 = RT_TIP.replace("hd.classList.toggle('solid', y > (hook.solidAt", "hd.classList.toggle('solid', H.dataset.page === 'shop' || y > (hook.solidAt");
  const STUB_JPG = Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=', 'base64');
  const PIC = 'https://res.cloudinary.com/tdw/image/upload/v1/site/v.jpg';
  const SEVEN = [
    { kind: 'voucher', name: 'With a picture', slug: 'with-picture', photo_url: PIC, price: 3000, price_words: 'Rs 3,000', includes: [], facts: 'Gift voucher', seats_left: null, sold_out: false },
    { kind: 'workshop', name: 'No picture', slug: 'no-picture', photo_url: null, price: 4500, price_words: 'Rs 4,500', includes: [], facts: 'Workshop · 3 of 3 seats left', seats_left: 3, sold_out: false },
    { kind: 'booking', name: 'Bad picture address', slug: 'bad-picture', photo_url: 'javascript:alert(9)', price: 18000, price_words: 'Rs 18,000', includes: [], facts: 'Booking', seats_left: null, sold_out: false },
  ];
  let b7 = null; const ORIGIN7 = 'https://studio-x.thedreamwedding.in';
  async function show(doc, rt, css) {
    const p = await b7.newPage();
    const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
    await p.setViewport({ width: 374, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    await p.setRequestInterception(true);
    p.on('request', (r) => { const u = r.url();
      if (u === `${ORIGIN7}/t`) return r.respond({ status: 200, contentType: 'text/html; charset=utf-8', body: doc });
      if (/res\.cloudinary\.com/.test(u)) return r.respond({ status: 200, contentType: 'image/jpeg', body: STUB_JPG });
      if (rt && u === `${ORIGIN7}/site-rt/${RT.RT_SHA}.js`) return r.respond({ status: 200, contentType: 'text/javascript', body: rt });
      return r.abort(); });
    await p.goto(`${ORIGIN7}/t`, { waitUntil: 'load', timeout: 30000 });
    if (css) await p.addStyleTag({ content: css });
    if (rt) await p.waitForFunction(() => document.documentElement.classList.contains('ready'), { timeout: 20000 });
    await p.evaluate(() => { scrollTo(0, 0); return new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res))); });
    return p;
  }
  /** Every visible text in the header, against the ground under it (its own and its ancestors' backgrounds down from the header,
   *  the header's over the page's), from computed colours. */
  const headerContrast = (p) => p.evaluate(() => {
    const rgba = (c) => { const n = (c.match(/[\d.]+/g) || []).map(Number); if (/^color\(srgb/.test(c)) return [n[0] * 255, n[1] * 255, n[2] * 255, n.length > 3 ? n[3] : 1]; return [n[0], n[1], n[2], n.length > 3 ? n[3] : 1]; };
    const over = (top, bot) => [0, 1, 2].map((i) => top[i] * top[3] + bot[i] * (1 - top[3])).concat(1);
    const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
    let page = rgba(getComputedStyle(document.body).backgroundColor); if (page[3] === 0) page = rgba(getComputedStyle(document.documentElement).backgroundColor); if (page[3] === 0) page = [255, 255, 255, 1];
    const hd = document.getElementById('hd'); const ground = over(rgba(getComputedStyle(hd).backgroundColor), page);
    const out = [];
    hd.querySelectorAll('*').forEach((el) => { const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()); if (!own || !el.getClientRects().length) return;
      const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || +cs.opacity === 0) return;
      // the ground under this word: every background from the header down to the word itself, laid in order (a badge has its own)
      const chain = []; for (let e = el; e && e !== hd; e = e.parentElement) chain.unshift(e);
      const g = chain.reduce((acc, e) => over(rgba(getComputedStyle(e).backgroundColor), acc), ground);
      // Text drawn by background-clip:text (Noir's gold) has a transparent colour: read its gradient's colour stops and take the
      // WORST stop against the ground (CE-47, the measure cured; no threshold moved). No stop found is a fail, never a pass.
      const clipped = /text/.test(cs.webkitBackgroundClip || '') || /text/.test(cs.backgroundClip || '');
      const stops = clipped ? (cs.backgroundImage.match(/(rgba?|color)\([^)]*\)/g) || []).map(rgba) : [rgba(cs.color)];
      const ratioOf = (c) => { const f = over(c, g); const a = lum(f), b = lum(g); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };
      const ratio = stops.length ? Math.min(...stops.map(ratioOf)) : 0;
      const big = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && +cs.fontWeight >= 700);
      out.push({ t: el.textContent.trim().slice(0, 20), ratio: +ratio.toFixed(2), need: big ? 3 : 4.5, ...(clipped ? { gradient: stops.length } : {}) }); });
    return { solid: hd.classList.contains('solid'), out, ok: out.length > 0 && out.every((o) => o.ratio >= o.need) };
  });
  try {
    b7 = await H7.browser();
    for (const st of ['noir', 'aurora']) {
      // The shop door's stub serves ITEMS; for this one draw it serves SEVEN, then the bench's own list is put back.
      SHOP_UP = true; const saved = ITEMS.slice(); ITEMS.splice(0, ITEMS.length, ...SEVEN);
      let home; try { home = await D.siteDocument(card(st), opts); } finally { ITEMS.splice(0, ITEMS.length, ...saved); }
      let p = await show(home, null);
      const sec7 = await p.evaluate(() => [...document.querySelectorAll('#shop .tdw-shop-card')].map((c) => { const ph = c.querySelectorAll('.tdw-shop-ph'); const img = c.querySelector('.tdw-shop-ph img');
        if (img && img.dataset.src) { img.src = img.dataset.src; }
        return { name: c.querySelector('.tdw-shop-nm').textContent, ph: ph.length, img: !!img }; }));
      await p.close();
      ok(sec7.length === 3 && sec7[0].ph === 1 && sec7[0].img && sec7[1].ph === 0 && sec7[2].ph === 0, `7.1.${st} the section: a picture where there is one; text-only without (no empty box, no glass placeholder), a bad address counts as none`, JSON.stringify(sec7));
      for (const it of SEVEN) {
        p = await show(await D.shopItemDocument(card(st), it, opts), null);
        const r = await p.evaluate(() => ({ ph: document.querySelectorAll('.tdw-item .tdw-shop-ph').length, img: document.querySelectorAll('.tdw-item .tdw-shop-ph img').length }));
        await p.close();
        const want = it.slug === 'with-picture' ? 1 : 0;
        ok(r.ph === want && r.img === want, `7.2.${st}.${it.slug} the item page: ${want ? 'its picture block, with its picture' : 'no picture block at all'}`, JSON.stringify(r));
      }
    }
    const cRow = S.classicShopRow(SEVEN, 'Studio X');
    ok((cRow.match(/<img/g) || []).length === 1 && /<img class="pv-sthumb"[^>]*>[\s\S]*?With a picture/.test(cRow), '7.3 the classic row: a picture only for the item that has one; the others text-only');
    // F-44.343 in all six styles, each over its three real palettes (the server's catalogue, dream-os src/lib/site/styles.js,
    // read where b210 reads it), at 374, scroll 0. 7.5 shows the runtime with WEB-8's line laid in memory while the tree lacks
    // it; 7.6 is the tree's own runtime, counted with B231_REQUIRE_WEB8=1 (once WEB-8's bytes are in the tree).
    // Lesson 4 (CE-47): the sibling must hold the commit this reads, or the bench REFUSES (exit 3), never reads a stale catalogue.
    const SIB = path.resolve(__dirname, '../../../dream-os'); const SIB_NEED = 'd5ae450';
    try { require('child_process').execFileSync('git', ['-C', SIB, 'merge-base', '--is-ancestor', SIB_NEED, 'HEAD'], { stdio: 'ignore' }); }
    catch (_e) { console.log(`b231 REFUSES: ../dream-os (${SIB}) must hold dream-os ${SIB_NEED} or later (the palette catalogue §7 reads); bring it to main first.`); process.exit(3); }
    const CAT = require('../../../dream-os/src/lib/site/styles.js').PALETTES;
    // AMENDED BY LABEL · CE-47 app train 8 (the chair): WEB-8's line is already in main's runtime (app train 6), so RT_WEB8 equals
    // RT_TIP and 7.5 cannot tell them apart. 7.6, the tree's own runtime, is counted whenever the line is in the tree.
    const NEED = process.env.B231_REQUIRE_WEB8 === '1' || RT_WEB8 === RT_TIP;
    for (const st of STYLES6) {
      const pals = CAT.filter((pp) => pp.style === st);
      ok(pals.length === 3, `7.4.${st}.0 the catalogue gives ${st} its three palettes`, String(pals.length));
      for (const pal of pals) {
        const cardP = card(st); cardP.site.palette = { id: pal.id, roles: pal.roles, extras: pal.extras };
        const doc = await D.shopItemDocument(cardP, SEVEN[1], opts);
        let p = await show(doc, null); let c = await headerContrast(p); await p.close();
        ok(c.solid && c.ok, `7.4.${pal.id} first paint (before the runtime): the header is solid and every word meets contrast`, JSON.stringify(c));
        if (!NEED) { p = await show(doc, RT_WEB8); c = await headerContrast(p); await p.close();
          ok(RT_WEB8 !== RT_TIP && c.solid && c.ok, `7.5.${pal.id} with WEB-8's line laid in memory: still solid at scroll 0 once the runtime runs, contrast met`, JSON.stringify(c)); }
        p = await show(doc, RT_TIP); c = await headerContrast(p); await p.close();
        const label = `7.6.${pal.id} with the tree's own runtime: solid at scroll 0 once it runs, contrast met`;
        if (NEED) ok(c.solid && c.ok, label, JSON.stringify(c));
        else console.log(`  ${c.solid && c.ok ? 'PASS' : 'PENDING'}  ${label}  [not counted until WEB-8's bytes are in the tree; B231_REQUIRE_WEB8=1 counts it]`);
      }
    }
    // The measure is proven to see each kind of text it reads:
    { const pal = CAT.find((pp) => pp.id === 'riviera.amalfi'); const cardP = card('riviera'); cardP.site.palette = { id: pal.id, roles: pal.roles, extras: pal.extras };
      const doc = await D.shopItemDocument(cardP, SEVEN[1], opts);
      const p = await show(doc.replace('<header class="hd solid', '<header class="hd'), null); const c = await headerContrast(p); await p.close();
      ok(!c.ok, '7.m6 mutation (the page bytes, in memory): without the solid header the contrast cell turns red', JSON.stringify(c)); }
    { const pal = CAT.find((pp) => pp.id === 'noir.gold'); const cardP = card('noir'); cardP.site.palette = { id: pal.id, roles: pal.roles, extras: pal.extras };
      const doc = await D.shopItemDocument(cardP, SEVEN[1], opts);
      const p = await show(doc, null, `html{--g1:${pal.roles.ground}!important}`); const c = await headerContrast(p); await p.close();
      const gold = c.out.find((o) => o.gradient);
      ok(!!gold && gold.ratio < 1.1 && !c.ok, '7.m8 mutation (a style laid on in the browser): one gold stop made the ground\'s colour turns the cell red, so gradient text is read', JSON.stringify(c)); }
  } finally {
    if (b7) { const proc = b7.process && b7.process(); const done = await Promise.race([b7.close().then(() => true).catch(() => true), new Promise((res) => setTimeout(() => res(false), 15000))]); if (!done && proc) { try { proc.kill('SIGKILL'); } catch (_e) { /* gone */ } } }
  }
  }

  if (run('8')) {
  sec('8  the pixel gate (docs/design/web8/): with no shop item shown, her site is byte-equal to base, style by style');
  // The base tip's own site files, loaded by the base tip's own loader (B231_BASE = a checkout of the base). The shop door is
  // down here (SHOP_UP false), which the draft treats exactly as shut or as nothing shown: an empty list.
  const BASE = process.env.B231_BASE;
  if (!BASE) console.log('  NOT RUN  §8 needs B231_BASE=<a checkout of the base tip>; the cut runs it with the base it cuts on');
  else {
    const BD = require(path.join(BASE, 'scripts/lib/site_load.js')).makeLoader()('lib/site/doc.ts');
    const withOwnRow = ['cover', 'looks', 'shop', 'pricing', 'faq', 'enquire'];
    // A mutant of this tree's doc.ts (the menu's no-item guard removed), in a throwaway copy of lib/ and the loader, never here.
    const os = require('os'); const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'b231-m7-'));
    fs.cpSync(path.join(ROOT, 'lib'), path.join(tmp, 'lib'), { recursive: true }); fs.mkdirSync(path.join(tmp, 'scripts/lib'), { recursive: true });
    fs.copyFileSync(path.join(ROOT, 'scripts/lib/site_load.js'), path.join(tmp, 'scripts/lib/site_load.js'));
    const docSrc = read('lib/site/doc.ts'); const GUARD = " && (s.key !== 'shop' || shop.length > 0)";
    fs.writeFileSync(path.join(tmp, 'lib/site/doc.ts'), docSrc.replace(GUARD, ''));
    const MD = require(path.join(tmp, 'scripts/lib/site_load.js')).makeLoader()('lib/site/doc.ts');
    try {
      SHOP_UP = false;
      for (const st of STYLES6) {
        const a = await BD.siteDocument(card(st), opts); const b = await D.siteDocument(card(st), opts);
        ok(typeof a === 'string' && a === b, `8.1.${st} no item shown: her home is byte-equal to base`, a === b ? undefined : `first difference at ${[...a].findIndex((ch, i) => ch !== b[i])}`);
        const a2 = await BD.siteDocument(card(st, withOwnRow), opts); const b2 = await D.siteDocument(card(st, withOwnRow), opts);
        ok(typeof a2 === 'string' && a2 === b2, `8.2.${st} no item shown, with her own 'shop' row: byte-equal to base (no section, no menu line)`, a2 === b2 ? undefined : `first difference at ${[...a2].findIndex((ch, i) => ch !== b2[i])}`);
      }
      ok(docSrc.includes(GUARD) && (await MD.siteDocument(card('noir', withOwnRow), opts)) !== (await BD.siteDocument(card('noir', withOwnRow), opts)), '8.m7 mutation (a throwaway copy): without the menu guard, 8.2 turns red');
    } finally { SHOP_UP = true; fs.rmSync(tmp, { recursive: true, force: true }); }
  }
  }

  console.log(`\nb231_ce47_off_a2_site_shop_bench: ${pass} passed, ${fail} failed  (total ${pass + fail})`);
  if (fail) { console.log(failed.map((f) => '  - ' + f).join('\n')); process.exit(1); }
})().catch((e) => { console.log('b231 threw:', e && e.stack); process.exit(1); });
