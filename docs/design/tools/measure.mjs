// docs/design/tools/measure.mjs · the stage's own acceptance walk: every drawing route under app/vendor/(shell)/,
// both themes, both phones, and (with --large) the phone's large text setting (the root at 130 percent).
//
// Per room it lists what breaks the stage's rules, measured on the painted page:
//   face   a visible text element whose first face is not Inter (the TDW name alone may be the serif)
//   small  a visible text element under 13 px (at the default text size)
//   caps   letter-spacing other than normal, or text-transform uppercase
//   tap    a control under 44 px in either dimension (links inside a sentence are listed apart)
//   low    text under 4.5:1 against the colour it sits on (3:1 at 24 px and up)
//   cut    text cut by an ellipsis or by its box; sideways scroll; elements past the right edge
//
// usage: node docs/design/tools/measure.mjs [--modes dark,light] [--vps ios,android] [--large] [--routes a,b] [--out FILE]
import fs from 'fs';
import path from 'path';
import { browser, open, ROOT } from './harness.mjs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const MODES = arg('--modes', 'dark,light').split(',');
const VPS = arg('--vps', 'ios,android').split(',');
const LARGE = process.argv.includes('--large');
const OUTF = arg('--out', '');
// --sheets: instead of the room at rest, open what the room opens and measure that: the first row's
// record sheet, the add button's sheet, the calendar's day sheet.
const SHEETS = process.argv.includes('--sheets');
// --words: also list the painted words that break the report's word rules (W1 to W5).
const WORDSF = process.argv.includes('--words');
const OPENERS = [
  ['row', '[data-row-id] > button, [data-row-id] button'],
  ['add', '.wl-fab, button[aria-label^="Add"], button[aria-label^="New"]'],
  ['day', 'button[aria-label*="September"], button[aria-label*=" 28"]'],
];
function routes() {
  const out = [];
  const walk = (dir, url) => { for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    if (e.isDirectory()) walk(dir + '/' + e.name, url + '/' + e.name); else if (e.name === 'page.tsx') out.push(url ? '/vendor' + url : '/vendor'); } };
  walk('app/vendor/(shell)', '');
  return out.filter((r) => r !== '/vendor' && !r.includes('review-proto')).map((r) => r.replace('[post_id]', 'p1')).sort();
}
const R = arg('--routes', '') ? arg('--routes', '').split(',') : routes();

function probe(large, WORDS) {
  const vw = innerWidth;
  const vis = (e) => { const s = getComputedStyle(e); const b = e.getBoundingClientRect(); return s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05 && b.width > 0 && b.height > 0; };
  const shown = (e) => { for (let x = e; x; x = x.parentElement) { const s = getComputedStyle(x); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity <= 0.05) return false; } return true; };
  const lab = (e) => ((e.innerText || e.getAttribute('aria-label') || e.title || e.placeholder || '').trim().replace(/\s+/g, ' ').slice(0, 40));
  const out = { face: [], small: [], caps: [], tap: [], inline: [], low: [], cut: [], edge: [] };
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const a = m[1].split(/[ ,/]+/).filter(Boolean).map(parseFloat); return { r: a[0], g: a[1], b: a[2], a: a.length > 3 ? a[3] : 1 }; };
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const over = (t, b) => ({ r: t.r * t.a + b.r * (1 - t.a), g: t.g * t.a + b.g * (1 - t.a), b: t.b * t.a + b.b * (1 - t.a), a: 1 });
  const bgOf = (el) => { const st = []; for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.backgroundImage && cs.backgroundImage !== 'none') st.push({ img: true }); const c = parse(cs.backgroundColor); if (c && c.a > 0) { st.push(c); if (c.a >= 1) break; } }
    let base = { r: 255, g: 255, b: 255, a: 1 }; const cols = st.filter((x) => !x.img); if (cols.length && cols[cols.length - 1].a >= 1) base = cols.pop(); for (let i = cols.length - 1; i >= 0; i -= 1) base = over(cols[i], base); return { c: base, img: st.some((x) => x.img) }; };
  const seen = new Set();
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = tw.nextNode())) {
    const t = n.textContent.trim(); if (!t) continue;
    const el = n.parentElement; if (!el || seen.has(el) || !vis(el) || !shown(el)) continue; seen.add(el);
    if (el.closest('[hidden],script,style,noscript,[data-tdw-commit]')) continue;
    { const r = el.getBoundingClientRect(); if (r.width <= 1 && r.height <= 1) continue; }   // visually hidden, read by a screen reader
    const cs = getComputedStyle(el);
    const size = parseFloat(cs.fontSize);
    const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
    const brand = el.closest('.wl-house');
    if (!brand && !/inter/i.test(fam)) out.face.push(`${fam} · ${t.slice(0, 30)}`);
    if (!large && size < 13 && !/^[←-⇿⌀-⏿■-➿›‹×✓·•…]+$/.test(t)) out.small.push(`${size}px · ${t.slice(0, 30)}`);
    if ((cs.letterSpacing !== 'normal' && parseFloat(cs.letterSpacing) > 0.2) || cs.textTransform === 'uppercase') out.caps.push(`${cs.letterSpacing}/${cs.textTransform} · ${t.slice(0, 30)}`);
    const fg = parse(cs.color); const bg = bgOf(el);
    if (fg && !bg.img) { const f = over(fg, bg.c); const L1 = lum(f), L2 = lum(bg.c); const cr = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05); const big = size >= 24 || (size >= 18.66 && +cs.fontWeight >= 700);
      if (cr < (big ? 3 : 4.5) - 0.005) out.low.push(`${cr.toFixed(2)} · ${t.slice(0, 30)}`); }
    if ((cs.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + 1) || (cs.webkitLineClamp && cs.webkitLineClamp !== 'none' && el.scrollHeight > el.clientHeight + 2)) out.cut.push(t.slice(0, 40));
    const b = el.getBoundingClientRect(); if (b.right > vw + 1 && !el.closest('[data-hscroll],.wl-chiprow')) { let sc = false; for (let x = el.parentElement; x; x = x.parentElement) { const o = getComputedStyle(x).overflowX; if (o === 'auto' || o === 'scroll' || o === 'hidden') { sc = true; break; } } if (!sc) out.edge.push(`${Math.round(b.right)} · ${t.slice(0, 30)}`); }
  }
  for (const e of document.querySelectorAll('a,button,[role=button],[role=tab],[role=switch],input:not([type=hidden]),select,textarea,summary')) {
    if (!vis(e) || !shown(e) || e.closest('[hidden]')) continue;
    if (e.matches('input[type=checkbox],input[type=radio]') && e.closest('label')) continue;
    const b = e.getBoundingClientRect();
    // the hit area: the element's box, grown by a ::before/::after that is absolutely placed over it
    let w = b.width, h = b.height;
    for (const pe of ['::before', '::after']) { const ps = getComputedStyle(e, pe); if (ps.content !== 'none' && ps.position === 'absolute') { const ins = ['top', 'right', 'bottom', 'left'].map((k) => parseFloat(ps[k]) || 0); w = Math.max(w, b.width - ins[1] - ins[3]); h = Math.max(h, b.height - ins[0] - ins[2]); } }
    if (w >= 43.5 && h >= 43.5) continue;
    const cs = getComputedStyle(e);
    const inSentence = e.tagName === 'A' && cs.display === 'inline' && (e.parentElement?.innerText || '').trim().length > (e.innerText || '').trim().length + 12;
    (inSentence ? out.inline : out.tap).push(`${Math.round(w)}x${Math.round(h)} · ${e.tagName.toLowerCase()}${e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : ''} · ${lab(e)}`);
  }
  // words: the report's word rules (W1 to W5), read off the painted text
  const WORD_RULES = [
    ['dash', /[\u2013\u2014]| - /], ['pronoun', /\b(she|her|hers|he|him|his)\b/i], ['lead', /\blead(s)?\b/i],
    ['rooms', /\brooms?\b/i], ['retired', /Edit Here|Hot dates|\bAnno\b|Loose engagements|Next engagements|In your books/i],
    ['raw', /\b\d\d:\d\d:\d\d\b|\+91\d{10}|\b[A-Z]{4,}\b|_[a-z]/], ['lower', /^[a-z]/],
  ];
  out.words = [];
  { const seen2 = new Set(); const tw2 = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let m;
    while ((m = tw2.nextNode())) { const t = m.textContent.trim(); const el = m.parentElement; if (!t || !el || !vis(el) || !shown(el) || el.closest('script,style,[hidden],input,textarea')) continue;
      const r = el.getBoundingClientRect(); if (r.width <= 1 && r.height <= 1) continue;
      for (const [k, rx] of WORD_RULES) if (rx.test(t) && !(k === 'raw' && /^(TDW|PDF|SEO|CSV|TDS|GST|UPI|OTP|PIN|IST|WABA)$/.test((t.match(/\b[A-Z]{4,}\b/) || [''])[0]))) { const key = k + ' · ' + t.slice(0, 60); if (!seen2.has(key)) { seen2.add(key); out.words.push(key); } } }
    for (const e of document.querySelectorAll('[placeholder],[aria-label]')) { if (!vis(e)) continue; for (const a of ['placeholder', 'aria-label']) { const t = (e.getAttribute(a) || '').trim(); if (!t) continue; for (const [k, rx] of WORD_RULES) if (k !== 'lower' && rx.test(t)) { const key = k + ' · [' + a + '] ' + t.slice(0, 60); if (!seen2.has(key)) { seen2.add(key); out.words.push(key); } } } } }
  if (!WORDS) delete out.words;
  out.hscroll = document.documentElement.scrollWidth > vw + 1;
  return out;
}

const b = await browser();
const report = {};
let total = 0;
for (const mode of MODES) for (const vp of VPS) {
  for (const r of R) {
    const key = `${r} ${mode} ${vp}${LARGE ? ' large' : ''}`;
    let p;
    try {
      p = await open(b, r, { mode, vp, dpr: 1, settle: 900, wait: arg('--wait', '.wl-main') });
      if (LARGE) { await p.addStyleTag({ content: 'html{font-size:130%!important}' }); await new Promise((x) => setTimeout(x, 400)); }
      let res;
      if (SHEETS) {
        res = { opened: [] };
        for (const [name, sel] of OPENERS) {
          const hit = await p.evaluate((q) => { const el = [...document.querySelectorAll(q)].find((e) => { const bb = e.getBoundingClientRect(); return bb.width > 0 && bb.height > 0; }); if (!el) return false; el.scrollIntoView({ block: 'center' }); el.click(); return true; }, sel);
          if (!hit) continue;
          await new Promise((x) => setTimeout(x, 1200));
          const one = await p.evaluate(probe, LARGE, WORDSF);
          res.opened.push(name);
          for (const [k, v] of Object.entries(one)) if (Array.isArray(v)) res[k] = [...new Set([...(res[k] || []), ...v.map((x) => name + ': ' + x)])]; else if (v) res[k] = v;
          await p.keyboard.press('Escape').catch(() => {});
          await p.goto(p.url(), { waitUntil: 'domcontentloaded' }); await new Promise((x) => setTimeout(x, 1500));
        }
        if (!res.opened.length) delete res.opened; else res.opened = [res.opened.join(',')];
      } else res = await p.evaluate(probe, LARGE, WORDSF);
      const keep = Object.fromEntries(Object.entries(res).filter(([k, v]) => k !== 'opened' && (Array.isArray(v) ? v.length : v) && !(LARGE && ['small', 'low', 'face', 'caps'].includes(k))));
      report[key] = keep;
      const nIssues = Object.entries(keep).reduce((a, [, v]) => a + (Array.isArray(v) ? v.length : 1), 0);
      total += nIssues;
      console.log(`${nIssues ? 'ISSUES ' + String(nIssues).padStart(3) : 'clean     '} ${key}`);
    } catch (e) { report[key] = { error: String(e.message).slice(0, 160) }; console.log('ERROR      ' + key + ' ' + String(e.message).slice(0, 120)); total += 1; }
    finally { if (p) await p.close().catch(() => {}); }
  }
}
await b.close();
if (OUTF) fs.writeFileSync(OUTF, JSON.stringify(report, null, 1));
console.log(`\n${total} issue(s) across ${Object.keys(report).length} scene(s)`);
process.exit(total ? 1 : 0);
