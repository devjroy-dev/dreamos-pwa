// scripts/b162_web5_site_hostile_bench.js
// TDW · CE-47 · WEB-5 · b162 — THE STYLES SITE'S DOCUMENT, FED HOSTILE STRINGS IN EVERY CARD FIELD.
//
// §1 every string field of a full card (site, copy, sections, looks, collections, testimonials, faq, packages, seo)
//    carries markup, a quote break, a style break and a script url; the home and a look page of all six styles are
//    drawn and read: no injected element, attribute, handler or url survives; ours are exactly what we wrote
// §2 colours and faces: a hostile palette value is dropped, a hostile face name is ignored
// §3 structure: three scripts on the page (the release, the panel's card data as inert JSON, the panel's boot), the
//    cover preloaded once, the style's CSS inline,
//    no stylesheet link, no React, no framework script
// §4 mutation: the escape turned off must redden §1 (the bench can see what it guards)
// No dev server, no browser, no network: a floor member.
'use strict';
const { makeLoader } = require('./lib/site_load');
let pass = 0, fail = 0; const failed = [];
function ok(c, name, info) { if (c) { pass += 1; console.log(`  PASS  ${name}`); } else { fail += 1; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 220) + ']'}`); } }
const sec = (t) => console.log(`\n§${t}`);
global.fetch = async () => { throw new Error('no network in b162'); };

const EVIL = `"><img src=x onerror=alert(1)><script>alert(2)</script></style><style>*{}</style>' onmouseover='x`;
const EVIL_URL = 'javascript:alert(3)';
const P = (k) => ({ url: `https://res.cloudinary.com/tdw/image/upload/v1/site/${k}.jpg`, focal_portrait: { x: 50, y: 50 }, focal_landscape: { x: 50, y: 50 }, alt: EVIL, caption: EVIL });
function card(style, extra = {}) {
  const sec2 = (key, body) => ({ key, variant: null, eyebrow: EVIL, heading: EVIL, body: body || {} });
  return { business_name: EVIL, category: 'makeup_artist', city: EVIL, handle: 'evil-studio', enquire_link: EVIL_URL, date_check_enabled: true, starting_price: 45000, instagram_handle: EVIL,
    packages: [{ name: EVIL, description: EVIL, total: 45000, items: [] }, { name: EVIL, description: null, total: null, items: [] }],
    meta: { title: EVIL, description: EVIL }, eliza: { live_booking: 'coming_soon', own_voice: 'not_in_plan' },
    testimonials: [{ words: EVIL, name: EVIL, place: EVIL, month: '2026-02', occasion: EVIL, video: null }, { words: EVIL + ' two', name: EVIL, place: EVIL, month: 'bad', occasion: null, video: null }],
    faq: [{ question: EVIL, answer: EVIL }],
    site: { v: 'styles', style, site_name: EVIL, monogram: EVIL, credit: true, domain: null,
      palette: { id: `${style}.x"><script>`, roles: { ground: '#fff', ink: 'red;}</style><script>alert(4)</script>', muted: 'url(javascript:x)', line: 'rgba(1,2,3,.1)', soft: '#eee', accent: '#111', on_accent: '#fff' }, extras: { atx: 'expression(alert(5))' } },
      fonts: { id: EVIL, display: `Bodoni Moda'; } body { x:`, text: EVIL }, motion: 'lively', corners: EVIL, buttons: EVIL, texture: EVIL, cover_mode: 'slideshow',
      cover: [0, 1, 2].map(() => ({ photo: P('a'), eyebrow: EVIL, headline: EVIL, emphasis: EVIL, button: EVIL, target: { kind: 'section', ref: EVIL } })),
      sections: ['cover', 'looks', 'band', 'collections', 'reviews', 'pricing', 'studio', 'faq', 'enquire'].map((k) => sec2(k, k === 'band' ? { lines: [EVIL, EVIL], words: [EVIL, EVIL], destinations: [EVIL], photos: [P('b'), P('c'), P('d')] } : {})),
      pages: [], trade: { items: EVIL, item: EVIL, request: EVIL },
      copy: { intro: EVIL, announcements: [EVIL], categories: [EVIL, EVIL], studio_heading: EVIL, studio_body: EVIL, studio_photo: P('s'), pricing_note: EVIL, enquire_line: EVIL, cities: EVIL, destinations: [EVIL], rolling_words: [EVIL] },
      seo: { title: EVIL, description: EVIL, image: EVIL_URL, canonical: EVIL_URL } },
    looks: [0, 1, 2].map((i) => ({ slug: `look-${i}`, title: EVIL, category: EVIL, year_label: EVIL, from_price: EVIL, is_new: true, cover: P('l' + i), second: P('m' + i), photo_count: 2, has_video: true, video_duration_s: 64 })),
    collections: [{ slug: 'c-1', name: EVIL, description: EVIL, cover: P('k'), look_slugs: ['look-0'] }], ...extra };
}
const LOOK = { slug: 'look-0', title: EVIL, category: EVIL, year_label: EVIL, description: EVIL, included: [EVIL], from_price: EVIL, package: { name: EVIL },
  credits: [{ role: EVIL, name: EVIL, handle: 'label-noor' }, { role: 'outfit', name: EVIL, handle: null }], videos: [], photos: [P('l0'), P('m0')], related: [], seo: { title: EVIL, description: EVIL, image: EVIL_URL } };

// A small tokenizer (no parser dependency on the floor): elements and their attributes as a browser would read them,
// quoted values honoured, <script>/<style> read as raw text. An injection shows as an element or attribute we never wrote.
function tokens(doc) {
  const els = []; let i = 0; const n = doc.length;
  while (i < n) {
    const lt = doc.indexOf('<', i); if (lt < 0) break;
    if (doc.startsWith('<!--', lt)) { const e = doc.indexOf('-->', lt); i = e < 0 ? n : e + 3; continue; }
    const m = /^<\/?([a-zA-Z][a-zA-Z0-9-]*)/.exec(doc.slice(lt, lt + 40)); if (!m) { i = lt + 1; continue; }
    const closing = doc[lt + 1] === '/'; const name = m[1].toLowerCase(); let j = lt + m[0].length; const attrs = [];
    while (j < n && doc[j] !== '>') {
      const a = /^\s*([^\s=>\/"']+)(\s*=\s*("[^"]*"|'[^']*'|[^\s>]*))?/.exec(doc.slice(j));
      if (!a || !a[0]) { j += 1; continue; }
      if (a[1]) attrs.push({ k: a[1].toLowerCase(), v: (a[3] || '').replace(/^["']|["']$/g, '') }); j += a[0].length;
    }
    i = j + 1; if (!closing) els.push({ name, attrs });
    if (!closing && (name === 'script' || name === 'style')) { const e = doc.toLowerCase().indexOf('</' + name, i); i = e < 0 ? n : e; }
  }
  return els;
}
const ENT = (v) => v.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
function injected(doc) {
  const bad = []; const els = tokens(doc);
  // Ours, exactly: the release script, the panel's card data (inert JSON), and the panel's boot (WEB-7). Nothing else.
  const scripts = els.filter((e) => e.name === 'script');
  if (scripts.length !== 3) bad.push('script elements ' + scripts.length);
  const json = scripts.filter((e) => e.attrs.some((a) => a.k === 'type' && a.v === 'application/json') && e.attrs.some((a) => a.k === 'id' && a.v === 'tdw-site-card'));
  if (json.length !== 1) bad.push('panel card data ' + json.length);
  if (scripts.some((e) => e.attrs.some((a) => a.k === 'src'))) bad.push('a script from a file in the document');
  for (const e of els) for (const a of e.attrs) {
    if (/^on/.test(a.k)) bad.push(`${e.name} ${a.k}`);
    if (['href', 'src', 'content', 'action', 'srcset'].includes(a.k) && /^\s*javascript:/i.test(ENT(a.v))) bad.push(`${e.name} ${a.k} javascript`);
  }
  const imgsWithX = els.filter((e) => e.name === 'img' && e.attrs.some((a) => a.k === 'src' && a.v === 'x')).length; if (imgsWithX) bad.push('planted img');
  if (/expression\(alert/i.test(doc)) bad.push('css expression');
  const styleOpen = els.filter((e) => e.name === 'style').length; const styleClose = (doc.match(/<\/style>/gi) || []).length; if (styleOpen !== styleClose) bad.push('style balance');
  return bad;
}
const opts = { code: 'evil-studio', base: 'https://evil-studio.thedreamwedding.in', api: 'https://x', display: 'swap', preview: false };
const STYLES = ['couture', 'gallery', 'noir', 'heritage', 'aurora', 'riviera'];

async function run(load, tag) {
  const D = load('lib/site/doc.ts'); const out = {};
  for (const st of STYLES) {
    out[st] = { home: await D.siteDocument(card(st), opts), look: await D.lookDocument(card(st), LOOK, { ...opts, vendorHref: (h) => `https://${h}.thedreamwedding.in` }) };
  }
  return out;
}
(async () => {
  const load = makeLoader();
  const docs = await run(load, 'real');
  sec('1  hostile strings in every field, all six styles, home and look page');
  for (const st of STYLES) for (const pg of ['home', 'look']) {
    const d = docs[st][pg]; ok(typeof d === 'string' && d.length > 2000, `1.${st}.${pg}.a the page is drawn`, d && d.length);
    const bad = injected(d || ''); ok(!bad.length, `1.${st}.${pg}.b nothing injected survives`, bad.join(', '));
    ok((d || '').includes('&lt;script&gt;alert(2)&lt;/script&gt;'), `1.${st}.${pg}.c the hostile text is shown as text, escaped`);
  }
  sec('2  colours and faces');
  const h = docs.couture.home; const at0 = h.indexOf('<html'); const htmlTag = h.slice(at0, h.indexOf('>', at0) + 1);
  ok(!/alert\(4\)/.test(htmlTag) && !/url\(javascript/.test(htmlTag), '2.1 a hostile palette value is dropped, not written', htmlTag.slice(0, 200));
  ok(/--bg:#fff/.test(htmlTag) && /--line:rgba\(1,2,3,\.1\)/.test(htmlTag), '2.2 the valid palette values are written', htmlTag.slice(0, 300));
  ok(!/Bodoni Moda'; \}/.test(h), '2.3 a hostile face name is ignored');
  sec('3  structure');
  for (const st of STYLES) {
    const d = docs[st].home;
    ok(!/<link[^>]+rel="stylesheet"/.test(d), `3.${st}.1 no stylesheet request`);
    ok(!/_next\/static\/chunks|__next_f|react/i.test(d), `3.${st}.2 no React, no framework script`);
    ok((d.match(/rel="preload" as="image"/g) || []).length === 1, `3.${st}.3 the cover preloaded once`);
  }
  sec('4  mutation: the escape turned off');
  const loadBad = makeLoader({});
  const html = loadBad('lib/site/html.ts'); const realEsc = html.esc;
  // Poison the shared module in place (the same instance every renderer file imports through this loader).
  const Html = loadBad('lib/site/html.ts'); const orig = Html.html;
  Html.html = (s, ...v) => { let o = s[0]; for (let i = 0; i < v.length; i++) o += (v[i] && v[i].s !== undefined ? v[i].s : Array.isArray(v[i]) ? v[i].map((x) => (x && x.s) || x).join('') : (v[i] ?? '')) + s[i + 1]; return new Html.Raw(o); };
  let reddened = false;
  try { const d2 = await run(loadBad, 'mutant'); reddened = STYLES.some((st) => injected(d2[st].home).length > 0); } catch (e) { reddened = true; }
  Html.html = orig; void realEsc;
  ok(reddened, '4.1 with the escape off, §1 goes red (the bench sees what it guards)');
  console.log(`\nb162: ${pass} pass, ${fail} fail`); if (fail) { console.log('FAILED: ' + failed.join(' | ')); process.exit(1); }
})().catch((e) => { console.log('b162: crashed ' + (e && e.stack || e)); process.exit(1); });
