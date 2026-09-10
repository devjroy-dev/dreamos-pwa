#!/usr/bin/env node
'use strict';
// scripts/b76_r6_sunday_shell_bench.js — CE-42 4b-3a · THE SUNDAY BRIEF'S SHELL (pwa).
// Seat R6. Base dreamos-pwa 34272f28d4a823ffeac0b7d437237882634c81cc.
// NUMBERED b76, derived across both repos: dream-os tails b75 (4b-2), pwa b74. First free: 76.
//
// §1 reads shipped source, comments stripped. §2 RENDERS the real section with react-dom/server
// (typescript transpiled in-process; next/navigation and the shell's hooks doubled) — one cell
// per ruled state, eleven, asserting the vetoed bytes appear and nothing else's do.
// Refuses (exit 3) without node_modules.

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
if (!fs.existsSync(path.join(ROOT, 'node_modules/typescript')) || !fs.existsSync(path.join(ROOT, 'node_modules/react-dom'))) {
  console.log('REFUSED — node_modules absent (run npm ci); §2 cannot transpile and render the section.');
  process.exit(3);
}
const ts = require(path.join(ROOT, 'node_modules/typescript'));
const React = require(path.join(ROOT, 'node_modules/react'));
const { renderToStaticMarkup } = require(path.join(ROOT, 'node_modules/react-dom/server'));

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');
let pass = 0; const reds = [];
function cell(name, fn) { let why; try { why = fn(); } catch (e) { why = e.stack.split('\n').slice(0, 2).join(' '); } if (why) { reds.push(name); console.log(`RED   ${name} — ${why}`); } else { pass++; console.log(`GREEN ${name}`); } }

const PAGE = 'app/vendor/(shell)/posts/page.tsx';
const SEC = 'components/worklist/SundaySection.tsx';
const page = strip(read(PAGE)) + '\n' + strip(read(SEC));
const home = strip(read('lib/worklist/sunday.ts'));

console.log('§1 · ONE FLAG, ONE HOME, NO DOOR');
cell('1.1 SUNDAY_PREVIEW is declared once, in lib/worklist/sunday.ts, and is the only preview branch on the page', () => {
  if (!/export const SUNDAY_PREVIEW = true;/.test(home)) return 'the flag is not `true` in its home';
  const decls = [...page.matchAll(/SUNDAY_PREVIEW\s*=/g)].length; if (decls) return 'the page re-declares the flag';
  const uses = (page.match(/SUNDAY_PREVIEW/g) || []).length; if (uses < 2) return `the page reads the flag ${uses} times`;
});
cell('1.2 no Sunday/insights door is called: no such address in routes.ts, no fetch of one on the page', () => {
  const routes = strip(read('lib/solutions/routes.ts'));
  if (/sunday|insights|brief/i.test(routes.replace(/POSTS_API_PATH|postBroadcast|postCards/g, ''))) return 'a Sunday address is declared';
  const sec = strip(read(SEC));
  if (/getJson|postJson|fetch\(/.test(sec)) return 'the section calls a door';
});
cell('1.3 every CTA in the section toasts COPY.launchingSoon and nothing else', () => {
  const sec = strip(read(SEC));
  if (!/const soon = \(\) => \{ show\(COPY\.launchingSoon\); \};/.test(sec)) return 'no single launchingSoon handler';
  const clicks = sec.match(/onClick=\{[^}]*\}/g) || [];
  const bad = clicks.filter((c) => !/onClick=\{soon\}/.test(c));
  if (bad.length) return `a CTA does something else: ${bad.join(' ')}`;
  if (!/COPY\.launchingSoon/.test(read('lib/solutions/copy.ts').replace(/launchingSoon:/, 'X'))) { /* the byte's home is copy.ts */ }
  if (!/launchingSoon:\s*'Launching soon\.'/.test(read('lib/solutions/copy.ts'))) return 'the byte moved';
});
cell('1.4 the vetoed bytes, verbatim, in the copy home', () => {
  const want = { eyebrow: 'Preview \\u00b7 sample numbers', connect: 'Connect Instagram to see your week.', expired: 'Your Instagram connection has expired. Connect again to see your week.', connectCta: 'Connect Instagram', under100: 'Instagram shows this after 100 followers.', emptyWeek: 'Nothing posted this week.', stale: 'Last week\\u2019s brief. This week\\u2019s is on its way.', checkAgain: 'Check again', shareThis: 'Share this', reach: 'Reach', newFollowers: 'New followers', saves: 'Saves', shares: 'Shares', bestTime: 'Best time to post', held: 'Coming', bestPost: 'Best post', shareTitle: 'My week on Instagram' };
  for (const [k, v] of Object.entries(want)) { const m = home.match(new RegExp(`\\b${k}:\\s*'([^']*)'`)); if (!m) return `${k} missing`; if (m[1] !== v) return `${k} = "${m[1]}", vetoed "${v}"`; }
});
cell('1.5 the eyebrow reads caution ink; the held tile carries the chip and is dimmed; the section is a named export', () => {
  if (!/\.pst-eyebrow\{[^}]*var\(--role-caution\)/.test(page)) return 'eyebrow not in --role-caution';
  if (!/\.pst-held\{[^}]*opacity:\.55/.test(page)) return 'held tile not dimmed';
  if (!/export function SundaySection/.test(strip(read(SEC)))) return 'SundaySection is not exported from its own file';
  if (/export function SundaySection/.test(strip(read(PAGE)))) return 'SundaySection is exported from page.tsx — next build refuses it';
});

console.log('§2 · EVERY STATE RENDERS FROM THE FIXTURE');
// transpile page.tsx + sunday.ts; double the imports the shell brings in
function load(rel, deps) {
  const js = ts.transpileModule(read(rel), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', js)((id) => { if (id in deps) return deps[id]; throw new Error('unexpected import ' + id); }, mod, mod.exports);
  return mod.exports;
}
const tokens = load('lib/vendor/tokens.ts', {});
const format = load('lib/vendor/format.ts', { './tokens': tokens });
const sunday = load('lib/worklist/sunday.ts', {});
const posts = load('lib/worklist/posts.ts', {});
const copyHome = load('lib/solutions/copy.ts', {});
const intro = load('lib/worklist/introductions.ts', {});
const toasts = [];
const deps = {
  react: React, 'react/jsx-runtime': require(path.join(ROOT, 'node_modules/react/jsx-runtime')), 'next/navigation': { useRouter: () => ({ replace() {} }) },
  '@/components/worklist/WorklistShell': { WorklistShell: (p) => React.createElement('div', null, p.children) },
  '@/components/worklist/WlToast': { WlToast: () => null },
  '@/hooks/vendor/useToast': { useToast: () => ({ toast: null, show: (m) => toasts.push(m) }) },
  '@/hooks/vendor/useVendorSession': { useVendorSession: () => ({ session: {}, loading: false }) },
  '@/lib/vendor/api/_base': { getJson: () => { throw new Error('door called'); }, postJson: () => { throw new Error('door called'); } },
  '@/lib/solutions/routes': { API: { postCards: () => '/x', postBroadcast: () => '/y' } },
  '@/lib/solutions/copy': copyHome, '@/lib/vendor/format': format, '@/lib/worklist/posts': posts,
  '@/lib/worklist/introductions': intro, '@/lib/worklist/sunday': sunday,
};
const mod = load(SEC, deps);
const html = (state, brief) => renderToStaticMarkup(React.createElement(mod.SundaySection, { state, brief }));
const B = sunday.FIXTURE_BRIEF;
const withPrev = { ...B, reach: { value: 4120, prev: 3680 }, new_followers: { value: 18, prev: 19 }, saves: { value: 64, prev: 49 }, shares: { value: 22, prev: 0 } };
const S = sunday.SU;
const has = (h, ...xs) => xs.find((x) => !h.includes(x));
const lacks = (h, ...xs) => xs.find((x) => h.includes(x));
const cases = [
  ['S1 pending', 'pending', null, [posts.PO.sundayPending], [S.connectCta, S.reach]],
  ['S2 connect', 'connect', null, [S.connect, S.connectCta], [S.reach]],
  ['S3 under100', 'under100', B, [S.under100, '4,120', S.bestPost], ['>18<']],
  ['S4 empty', 'empty', { ...B, reach: { value: 0, prev: null }, saves: { value: 0, prev: null }, shares: { value: 0, prev: null }, new_followers: { value: 0, prev: null } }, [S.emptyWeek], [S.bestPost, S.shareThis]],
  ['S5 live', 'live', B, ['4,120', '18', '64', '22', S.bestTime, S.held, sunday.bestPostLine(31, 9), S.shareThis], ['\u2191', '\u2193']],
  ['S6 arrows', 'arrows', withPrev, ['\u2191 12%', '\u2193 5%', '\u2191 31%', 'pst-flat'], []],
  ['S7 share', 'share', B, [S.shareTitle, 'Reach 4,120', 'Saves 64', posts.PO.share, posts.PO.download], [S.bestPost]],
  ['S8 error', 'error', null, [copyHome.COPY.surfaceUnavailable, S.checkAgain], [S.reach]],
  ['S9 stale', 'stale', { ...B, week_start: '2026-08-31', week_end: '2026-09-06' }, [S.stale, S.checkAgain, '31 August \u2013 6 September'], [S.shareThis]],
  ['S10 expired', 'expired', null, [S.expired, S.connectCta], [S.connect]],
  ['S11 not connected', 'notconnected', null, [S.connect, S.connectCta], [S.expired]],
];
for (const [name, state, brief, must, mustNot] of cases) {
  cell(`2.${name} renders its vetoed bytes and none of another state's`, () => {
    const h = html(state, brief).replace(/&#x27;|&#39;/g, '\u2019').replace(/&#xB7;|&#183;/g, '\u00b7').replace(/&#x2191;/g, '\u2191').replace(/&#x2193;/g, '\u2193').replace(/&#x2013;/g, '\u2013');
    const m = has(h, ...must); if (m) return `missing "${m}"`;
    const n = lacks(h, ...mustNot); if (n) return `leaked "${n}"`;
  });
}
cell('2.12 the live glass at 4b-3a is S5 under the eyebrow: the page hands the section state=live with the fixture', () => {
  if (!/<SundaySection state=\{SUNDAY_PREVIEW \? 'live' : 'pending'\} brief=\{SUNDAY_PREVIEW \? FIXTURE_BRIEF : null\} \/>/.test(page)) return 'the page does not render live+fixture under PREVIEW';
  if (!/\{SUNDAY_PREVIEW \? <div className="pst-eyebrow">\{SU\.eyebrow\}<\/div> : null\}/.test(page)) return 'the eyebrow is not gated on PREVIEW';
});
cell('2.13 weekLine and arrow: full month, same-month elision, — on prev 0, null on prev null', () => {
  if (sunday.weekLine('2026-09-07', '2026-09-13') !== '7\u201313 September') return sunday.weekLine('2026-09-07', '2026-09-13');
  if (sunday.weekLine('2026-08-31', '2026-09-06') !== '31 August \u2013 6 September') return sunday.weekLine('2026-08-31', '2026-09-06');
  if (sunday.arrow({ value: 5, prev: null }) !== null) return 'prev null → arrow';
  if (sunday.arrow({ value: 5, prev: 0 }).dir !== 'flat') return 'prev 0 → not flat';
  if (sunday.arrow({ value: 112, prev: 100 }).text !== '\u2191 12%') return sunday.arrow({ value: 112, prev: 100 }).text;
});

console.log(`\nb76 · ${pass} GREEN · ${reds.length} RED${reds.length ? ' — ' + reds.join(' | ') : ''}`);
process.exit(reds.length ? 1 : 0);
