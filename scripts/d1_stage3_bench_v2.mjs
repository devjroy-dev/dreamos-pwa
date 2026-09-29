#!/usr/bin/env node
// scripts/d1_stage3_bench_v2.mjs · DESIGN-1 · STAGE 3 · the founder's and the chair's consolidated additions, v2 tree.
//   §1 the universal search, the pwa's half (v2/lib/worklist/search.ts, SearchBox.tsx): tools by name or by her word
//      ("website", "TDS", "ads"); a question offers "Ask TDW about this", last; recent searches; where a record opens.
//      Her records' matching and scope are dream-os's (scripts/d1_search_bench.js on design/layout-switch).
//   §2 the box's place: one, in the shell, outside the scroller, on every page; the assistant one tap away.
//   §3 the Get found card (v2/lib/worklist/getFound.ts): one at a time, in order, hideable, never on a failed read.
//   §4 R-46.17: every text given to her to copy or forward sits in its own box with a Copy control and nothing else
//      inside (v2/components/worklist/CopyBox.tsx), a cell per site and a "joined" mutation per site.
// Static: the modules are transpiled and driven; CopyBox is rendered to markup. No server.
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const ts = require(path.join(ROOT, 'node_modules/typescript'));
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');

// a small module loader: '@/x' is the repo root; TypeScript and TSX are transpiled; overrides replace a file's source
function loader(overrides = {}) {
  const cache = new Map();
  const resolve = (spec, from) => {
    let base = spec.startsWith('@/') ? path.join(ROOT, spec.slice(2)) : spec.startsWith('.') ? path.resolve(path.dirname(from), spec) : null;
    if (!base) return null;
    for (const e of ['', '.ts', '.tsx', '/index.ts', '/index.tsx']) { const p = base + e; if (fs.existsSync(p) && fs.statSync(p).isFile()) return p; }
    throw new Error('cannot resolve ' + spec + ' from ' + from);
  };
  const load = (file) => {
    if (cache.has(file)) return cache.get(file).exports;
    const rel = path.relative(ROOT, file);
    const src = rel in overrides ? overrides[rel] : fs.readFileSync(file, 'utf8');
    const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    const mod = { exports: {} }; cache.set(file, mod);
    const req = (spec) => { const r = resolve(spec, file); return r ? load(r) : require(spec); };
    new Function('exports', 'require', 'module', 'process', out)(mod.exports, req, mod, process);
    return mod.exports;
  };
  return (rel) => load(path.join(ROOT, rel));
}

let pass = 0, fail = 0; const failed = [];
const cell = (name, fn) => {
  let r; try { r = fn(); } catch (e) { r = 'threw ' + e.message; }
  if (r === true) { pass += 1; console.log('  ok   ' + name); } else { fail += 1; failed.push(name); console.log('  FAIL ' + name + '  → ' + r); }
};
const sec = (t) => console.log('\n' + t);

// ── §1 ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
const SEARCH = 'v2/lib/worklist/search.ts';
function searchCells(S) {
  const t = (q) => S.matchTools(q).map((x) => x.label).join(',');
  return {
    website: t('website'), tds: t('TDS'), ads: t('ads'), reviews: t('reviews'), photos: t('photos'), none: t('zzz'),
    q1: S.isQuestion('how do I raise an invoice?'), q2: S.isQuestion('how do I raise an invoice'), q3: S.isQuestion('priya'), q4: S.isQuestion('what is'), q5: S.isQuestion('Is Saturday free?'),
    href: [S.recordHref('enquiries', 'a b'), S.recordHref('clients', 'c1'), S.recordHref('events', 'e1'), S.recordHref('invoices', 'i1'), S.recordHref('crew', 'r1')].join(' '),
    recent: S.withRecent(['priya', 'TDS', 'a', 'b', 'c', 'd'], 'Priya'),
  };
}
sec('§1 the universal search (the pwa’s half)');
const s1 = searchCells(loader()(SEARCH));
cell('1.1 "website" opens Your website', () => s1.website === 'Your website' || s1.website);
cell('1.2 "TDS" opens TDS', () => s1.tds === 'TDS' || s1.tds);
cell('1.3 "ads" opens Posts and ads (her word for the tool)', () => s1.ads === 'Posts and ads' || s1.ads);
cell('1.4 "reviews" opens Google reviews; "photos" opens Portfolio; nonsense opens nothing', () => (s1.reviews === 'Google reviews' && s1.photos === 'Portfolio' && s1.none === '') || [s1.reviews, s1.photos, s1.none].join(' / '));
cell('1.5 a question reads as one (a question mark, or a question word and three words)', () => (s1.q1 && s1.q2 && !s1.q3 && !s1.q4 && s1.q5) || JSON.stringify([s1.q1, s1.q2, s1.q3, s1.q4, s1.q5]));
cell('1.6 a found record opens its room with its key (?lead=, ?client=, ?event=, ?invoice=)', () => s1.href === '/vendor/leads?lead=a%20b /vendor/clients?client=c1 /vendor/events?event=e1 /vendor/invoices?invoice=i1 /vendor/team' || s1.href);
cell('1.7 recent searches: newest first, one of each, at most six', () => JSON.stringify(s1.recent) === JSON.stringify(['Priya', 'TDS', 'a', 'b', 'c', 'd']) || JSON.stringify(s1.recent));

// ── §2 ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
sec('§2 the box’s place');
const SHELL = 'v2/components/worklist/WorklistShell.tsx';
const BOX = 'v2/components/worklist/SearchBox.tsx';
function boxCells(shellSrc, boxSrc) {
  const sh = strip(shellSrc), bx = strip(boxSrc);
  const mount = sh.indexOf('<SearchBox'), header = sh.indexOf('</header>'), main = sh.indexOf('<main className="wl-main">');
  const ask = bx.indexOf('data-kind="ask"'), lastGroup = bx.lastIndexOf('records.map(');
  return {
    once: (sh.match(/<SearchBox\b/g) || []).length === 1,
    outside: mount > header && mount < main,
    dock: /\{!isAdvisor && <AiDock mode=\{mode\} \/>\}/.test(sh),
    askLast: ask > lastGroup && lastGroup > 0 && /onClick=\{ask\}/.test(bx) && /openAsk\(text\)/.test(bx),
    askGate: /const question = canAsk && isQuestion\(text\);/.test(bx) && /<SearchBox canAsk=\{!isAdvisor\} \/>/.test(sh),
    recent: /text\.length < MIN_CHARS \?[\s\S]{0,200}W\.recent/.test(bx) && /saveRecent\(text\)/.test(bx),
    door: /getJson<Wire>\('\/api\/v2\/vendor\/search\?q=' \+ encodeURIComponent\(text\)\)/.test(bx),
    labelled: /W\.kinds\[g\.kind\]/.test(bx) && /W\.kinds\.tools/.test(bx),
  };
}
const b2 = boxCells(read(SHELL), read(BOX));
cell('2.1 one box, mounted once in the shell (so on every page of every tab)', () => b2.once || 'not once');
cell('2.2 under the header and outside the scroller: always visible', () => b2.outside || 'inside the scroller');
cell('2.3 results grouped and labelled by kind, tools first; her records from the search door', () => (b2.labelled && b2.door) || JSON.stringify(b2));
cell('2.4 a question adds "Ask TDW about this" LAST, opening the assistant with her words', () => b2.askLast || 'not last, or not her words');
cell('2.5 the assistant stays one tap away (the dock on every page but the Advisor, which is the assistant)', () => (b2.dock && b2.askGate) || 'dock or gate moved');
cell('2.6 an empty box shows her recent searches', () => b2.recent || 'no recent list');

// ── §3 ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
sec('§3 the Get found card');
const GF = 'v2/lib/worklist/getFound.ts';
function gfCells(G) {
  const me0 = { ok: true, vendor: { seo_title: null, seo_description: '' } }, me1 = { ok: true, vendor: { seo_title: 'Meera Photo', seo_description: null } };
  const rv0 = { ok: true, googleReviews: { askedCount: 0 } }, rv1 = { ok: true, googleReviews: { askedCount: 3 } };
  const ig0 = { ok: true, connected: false }, ig1 = { ok: true, connected: true };
  const pick = (a, b, c, h = []) => G.pickCard(G.notSetUp(a, b, c), h);
  return {
    first: pick(me0, rv0, ig0), second: pick(me1, rv0, ig0), third: pick(me1, rv1, ig0), none: pick(me1, rv1, ig1),
    hidden: pick(me0, rv0, ig0, ['website']), failed: pick(null, { ok: false }, ig1), failedOnly: pick(null, rv1, ig1),
    hrefs: ['website', 'google', 'posts'].map((k) => G.GET_FOUND[k].href).join(' '),
  };
}
const g3 = gfCells(loader()(GF));
cell('3.1 one card, in order: website first', () => g3.first === 'website' || g3.first);
cell('3.2 then Google reviews, then posts and ads, as each is set up', () => (g3.second === 'google' && g3.third === 'posts' && g3.none === null) || [g3.second, g3.third, g3.none].join(' / '));
cell('3.3 a hidden card gives way to the next', () => g3.hidden === 'google' || g3.hidden);
cell('3.4 a failed read shows nothing (unknown is never "not set up")', () => (g3.failed === null && g3.failedOnly === null) || [g3.failed, g3.failedOnly].join(' / '));
cell('3.5 each card points to its room', () => g3.hrefs === '/vendor/your-website /vendor/google-reviews /vendor/posts' || g3.hrefs);
cell('3.6 Home mounts it once, after the day’s work, never on a first run', () => {
  const t = strip(read('v2/app/vendor/(shell)/today/page.tsx'));
  return (/<TodayHome \/>\s*(\{\s*\}\s*)?\{!firstRun && <GetFoundCard \/>\}/.test(t) && (t.match(/<GetFoundCard/g) || []).length === 1) || 'not after TodayHome';
});

// ── §4 ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
sec('§4 R-46.17: the text she copies or forwards sits in its own box');
const COPYBOX = 'v2/components/worklist/CopyBox.tsx';
function boxRender(src) {
  const React = require(path.join(ROOT, 'node_modules/react'));
  const { renderToStaticMarkup } = require(path.join(ROOT, 'node_modules/react-dom/server'));
  const { CopyBox } = loader({ [COPYBOX]: src })(COPYBOX);
  const html = renderToStaticMarkup(React.createElement(CopyBox, { text: 'https://wa.me/91?text=TDW-MEERA', label: 'Copy', copied: 'Copied', children: 'EXPLANATION' }));
  const inner = html.replace(/<style>[\s\S]*?<\/style>/, '');
  const m = inner.match(/^<div class="wl-copybox" data-copybox="">([\s\S]*)<\/div>$/);
  if (!m) return 'not one box: ' + inner.slice(0, 120);
  const kids = m[1].match(/<(span|button)[^>]*>[\s\S]*?<\/\1>/g) || [];
  const rest = m[1].replace(/<(span|button)[^>]*>[\s\S]*?<\/\1>/g, '');
  if (kids.length !== 2 || rest.trim()) return 'the box holds more than the text and its Copy: ' + m[1].slice(0, 160);
  if (!/^<span class="wl-copytext" data-copytext="">https:\/\/wa\.me\/91\?text=TDW-MEERA<\/span>$/.test(kids[0])) return 'the first thing in the box is not the text alone';
  if (!/^<button type="button" class="wl-copyctl" data-copyctl="">Copy<\/button>$/.test(kids[1])) return 'the second is not the Copy control';
  return true;
}
cell('4.1 the box: the text, then Copy, and nothing else (it takes no children, so no sentence can go in)', () => boxRender(read(COPYBOX)));

const SITES = [
  ['4.2', 'the TDW enquiry link (Settings)', 'v2/components/vendor/SettingsScreen.tsx', /<CopyBox text=\{waLink\} label="Copy" copied="Copied" onCopied=\{[^}]*\}[^/]*\/>/, /\{waLink\}<\/div>/],
  ['4.3', 'your link (the first-run card)', 'v2/components/worklist/FirstRun.tsx', /<CopyBox text=\{tdwLink\} label=\{COPY\.cardLinkAction\} copied=\{COPY\.cardLinkCopied\} \/>/, /writeText\(tdwLink\);\s*setCopied/],
  ['4.4', 'your website’s address', 'v2/app/vendor/(shell)/your-website/screen.tsx', /<CopyBox text=\{address\} copyValue=\{pageUrl\} label=\{C\.copy\} copied=\{C\.copied\} textClassName="yw-big" \/>/, /<div className="yw-big">\{address\}<\/div>/],
  ['4.5', 'the post’s caption (Posts and ads)', 'v2/app/vendor/(shell)/posts/page.tsx', /\{body\?\.caption && <CopyBox text=\{body\.caption\} label=\{PO\.copyCaption\} copied=\{PO\.copyCaption\} \/>\}/, /<p className="pst-caption">/],
  ['4.6', 'a contract link she must send herself (Contracts)', 'v2/app/vendor/(shell)/contracts/screen.tsx', /<div style=\{HINT\}>Sending is not open yet\. Send this link to \{first\} yourself\.<\/div>\s*<div style=\{\{ marginTop: 8 \}\}><CopyBox text=\{signLink\.url\} label="Copy" copied="Copied" \/><\/div>/, /show\(r\.sign_url/],
];
const siteCell = (src, re, old) => { const s = strip(src); return (re.test(s) && !old.test(s)) || (!re.test(s) ? 'the text is not in its own CopyBox (or something joined it)' : 'the old loose copy is still drawn'); };
for (const [n, what, file, re, old] of SITES) cell(`${n} ${what}: in its own box with Copy, the explanation outside`, () => siteCell(read(file), re, old));
cell('4.7 no other clipboard write in the v2 tree hands her a text outside a box', () => {
  const hits = [];
  const walk = (d) => { for (const e of fs.readdirSync(path.join(ROOT, d), { withFileTypes: true })) { const r = d + '/' + e.name; if (e.isDirectory()) walk(r); else if (/\.tsx?$/.test(e.name) && /clipboard\??\.writeText/.test(strip(read(r)))) hits.push(r); } };
  walk('v2');
  // the known writers: the box itself; FirstRun's Share falls back to the clipboard for the link its box shows; Contracts
  // also copies the link its box shows; the Advisor's message bubble copies a bubble, which is its own box; onboarding is
  // the legacy tree's (outside the shell, stage 5's pages will replace it).
  const known = ['v2/components/worklist/CopyBox.tsx', 'v2/components/worklist/FirstRun.tsx', 'v2/app/vendor/(shell)/contracts/screen.tsx', 'v2/components/vendor/MessageBubble.tsx', 'v2/app/vendor/(legacy)/onboarding/page.tsx'];
  const stray = hits.filter((h) => !known.includes(h));
  return stray.length === 0 || 'a new clipboard writer: ' + stray.join(', ');
});

// ── mutations ──────────────────────────────────────────────────────────────────────────────────────────────────────
sec('mutations (each must turn its cell red)');
const mut = (name, fn) => cell(name, () => { const r = fn(); return r === true ? 'still green' : true; });
mut('M1 the tools lose her words (only their names) → 1.4 RED', () => {
  const s = searchCells(loader({ [SEARCH]: read(SEARCH).replace("...(TOOL_WORDS[label] || [])", '') })(SEARCH));
  return s.reviews === 'Google reviews' && s.photos === 'Portfolio' && s.none === '';
});
mut('M2 no question is ever a question → 1.5 RED', () => {
  const s = searchCells(loader({ [SEARCH]: read(SEARCH).replace("  if (!t) return false;", '  return false;') })(SEARCH));
  return s.q1 && s.q2 && !s.q3 && !s.q4 && s.q5;
});
mut('M3 the Ask row moved above her records → 2.4 RED', () => {
  const bx = read(BOX);
  const askRow = bx.match(/\n\s*\{question && \([\s\S]*?\)\}\n/)[0];
  const moved = bx.replace(askRow, '\n').replace('              {records.map((g) => (', askRow.trimEnd() + '\n              {records.map((g) => (');
  return boxCells(read(SHELL), moved).askLast;
});
mut('M4 the box moved inside the scroller → 2.2 RED', () => {
  const sh = read(SHELL).replace('      <SearchBox canAsk={!isAdvisor} />\n', '').replace('<main className="wl-main"><RoomHead title={title} />', '<main className="wl-main"><SearchBox canAsk={!isAdvisor} /><RoomHead title={title} />');
  return boxCells(sh, read(BOX)).outside;
});
mut('M5 a failed read counted as not set up → 3.4 RED', () => {
  const g = gfCells(loader({ [GF]: read(GF).replace("website: v ? blank(v.seo_title) && blank(v.seo_description) : null,", 'website: v ? blank(v.seo_title) && blank(v.seo_description) : true,') })(GF));
  return g.failed === null && g.failedOnly === null;
});
mut('M6 the box renders a sentence beside the text (joined) → 4.1 RED', () => boxRender(read(COPYBOX)
  .replace('export function CopyBox({ text, copyValue,', 'export function CopyBox({ children, text, copyValue,')
  .replace('  textClassName?: string;\n}) {', '  textClassName?: string;\n  children?: React.ReactNode;\n}) {')
  .replace('{text}</span>', '{text}</span>{children}')) === true);
for (const [n, what, file, re, old] of SITES) {
  mut(`M${n} ${what}: the explanation joined inside the box → ${n} RED`, () => {
    const src = read(file); const s = strip(src); const m = s.match(re); if (!m) return 'no site';
    const self = m[0].match(/<CopyBox[\s\S]*?\s\/>/)[0];
    const joined = src.replace(self, self.replace(/\s*\/>$/, '>Send this to the couple.</CopyBox>'));
    return joined !== src && siteCell(joined, re, old);
  });
}

console.log(`\n${fail ? 'RED' : 'GREEN'} — d1 stage 3 (v2) ${pass}/${pass + fail}${fail ? '\n  ' + failed.join('\n  ') : ''}`);
process.exit(fail ? 1 : 0);
