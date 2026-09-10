#!/usr/bin/env node
// scripts/b20_a5_plan_pwa.proof.mjs — CE-42 · SEAT D3 · /plan SITTING 2
//
// §1  the extraction is real, and the bride page keeps NO second copy
// §2  the three §13 traps are defused BY CONSTRUCTION — the component names neither shell nor context
// §3  the two 401s — both reads gated on signedIn, and /plan passes false
// §4  BEHAVIOUR · the layout branch, driven — /plan and /plan/x paint cream, /planet does not
// §5  BEHAVIOUR · the sitemap entry, driven through the real module
// §6  BEHAVIOUR · the public door — the path, and no `origin` on the body
// §7  BEHAVIOUR · FORK D · ?city= and ?date= only; malformed ignored; area and brief refused
// §8  FORK 4 · the city guard is /plan's alone — the frost sheet still submits without one
// §9  FORK 1 · the router shim, and the POST between persistSession and the push
// §10 R-42.6 · every colour on the new page has a home; the seven retired values appear nowhere
// §11 the vetoed bytes, byte-exact, one home each
// §12 NON-VACUITY · production source mutated seven ways, each cell shown to red, one no-op control
//
// BOTH WAYS: at e81d703c `app/plan/page.tsx` is absent → the run REFUSES (exit 1).
// Cured → exit 0. §12 mutates the shipped source and requires green cells to red,
// so no cell here can be passing vacuously.
//
// Exit: 0 green · 1 red · 3 refused.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const P = (rel) => path.join(ROOT, rel);
const read = (rel) => (fs.existsSync(P(rel)) ? fs.readFileSync(P(rel), 'utf8') : '');
const exists = (rel) => fs.existsSync(P(rel));

let pass = 0, fail = 0;
const ok = (label, cond, why = '') => { if (cond) { pass++; console.log(`  PASS  ${label}`); } else { fail++; console.log(`  FAIL  ${label}${why ? ' — ' + why : ''}`); } };
const section = (t) => console.log(`\n── ${t} ──`);

// Comments are stripped before every textual assertion (standing law): a byte this
// bench claims absent must be absent from the CODE, and a comment that happened to
// mention it would otherwise read as the thing itself.
function strip(src) {
  let out = '', i = 0, q = null; const n = src.length;
  while (i < n) {
    const c = src[i], d = src[i + 1];
    if (q) { out += c; if (c === '\\') { out += d; i += 2; continue; } if (c === q) q = null; i++; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; out += c; i++; continue; }
    if (c === '/' && d === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && d === '*') { i += 2; while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++; i += 2; continue; }
    if (c === '{' && d === '/' && src[i + 2] === '*') { const e = src.indexOf('*/}', i); if (e > 0) { i = e + 3; continue; } }
    out += c; i++;
  }
  return out;
}

const PLAN   = 'app/plan/page.tsx';
const SHEET  = 'app/components/couple/AssistanceSheet.tsx';
const BRIDE  = 'app/(frost)/frost/canvas/assistance/page.tsx';
const LAYOUT = 'app/layout.tsx';
const SITEMAP = 'app/sitemap.ts';
const ROBOTS = 'app/robots.ts';
const API    = 'lib/frost-api/assistance.ts';

if (!exists(PLAN) || !exists(SHEET)) {
  console.log(`\nREFUSED — ${PLAN} or ${SHEET} is absent. This bench measures the /plan build;`);
  console.log('at the uncured tree there is nothing to measure and every cell below would be vacuous.');
  process.exit(1);
}

// ── Loaders. Real transpiles of the real files; `srcOverride` lets §12 drive a
//    MUTATED production source through the identical path, so a mutation cell and
//    a green cell differ in the source only. ────────────────────────────────────
async function loadTs(rel, srcOverride, stub) {
  const src = srcOverride ?? read(rel);
  const ts = (await import('typescript')).default;
  let out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
  const tag = Math.random().toString(36).slice(2);
  const dir = path.dirname(P(rel));
  const made = [];
  if (stub) {
    // The seam is stubbed, never re-implemented: `apiPost` is not this bench's
    // subject — the PATH handed to it is — so the stub records the argument and
    // returns, and nothing about the real client is retyped here.
    const sf = path.join(dir, '.tmp_b20a5_stub_' + tag + '.mjs');
    fs.writeFileSync(sf, stub.code);
    made.push(sf);
    out = out.split(stub.from).join("'./" + path.basename(sf) + "'");
  }
  const tmp = path.join(dir, '.tmp_b20a5_' + tag + '.mjs');
  fs.writeFileSync(tmp, out);
  made.push(tmp);
  try { return await import(pathToFileURL(tmp).href); }
  finally { for (const f of made) { try { fs.unlinkSync(f); } catch { /* already gone */ } } }
}

// The pre-hydration script is a template literal inside app/layout.tsx. The window
// is bound by the STATEMENT — from the IIFE's open to its close — never by a line
// count, so an edit above or below it cannot move what this bench measures.
function themeScript(srcOverride) {
  const src = srcOverride ?? read(LAYOUT);
  const a = src.indexOf('(function(){try{');
  const b = src.indexOf('}catch(e){}})();', a);
  return a < 0 || b < 0 ? null : src.slice(a, b + '}catch(e){}})();'.length);
}

function paintFor(pathname, scriptSrc) {
  const script = themeScript(scriptSrc);
  if (!script) return null;
  const html = { style: {} };
  const meta = { content: null, setAttribute: (k, v) => { if (k === 'content') meta.content = v; } };
  const doc = { documentElement: html, body: { style: {} }, querySelector: () => meta };
  const loc = { pathname };
  const store = { getItem: () => null, setItem: () => {} };
  // eslint-disable-next-line no-new-func
  new Function('location', 'document', 'localStorage', script)(loc, doc, store);
  return { bg: html.style.background ?? null, themeColor: meta.content };
}

// The nine values of the R-42.6 census, each with the SELECTOR it was transcribed
// from — never a line number (F-42.136). The set is the subject of §10.
const CENSUS = {
  '#F8F7F5': 'layout PUBLIC_BG · .pv ground',
  '#0C0A09': 'layout LANDING_BG · .pv ink',
  '#403B36': '.pv-sealfacts',
  '#6B6560': '.pv-demo',
  '#EDEAE4': '.pv-hero',
  '#F2EFE9': '.pv-cta:active',
  '#C9A84C': '.pv-cta border',
  '#7A621C': '.pv-cta ink',
};
const RETIRED = ['#2A2724', '#211E1B', '#3A3631', '#9A938C', '#C9C2BA', '#E4CE8A', '#B9C7C2'];

const planSrc  = strip(read(PLAN));
const sheetSrc = strip(read(SHEET));
const brideSrc = strip(read(BRIDE));
const apiSrc   = strip(read(API));

// ═══════════════════════════════════════════════════════════════════════════════
section('§1 · the extraction is real, and the bride page keeps no second copy');

ok('the sheet lives in one file, outside the (frost) group', exists(SHEET) && !SHEET.includes('(frost)'));
ok('the bride page renders the extracted component and does not redeclare it',
  /<AssistanceSheet\b/.test(brideSrc) && !/export default function AssistanceSheet\b/.test(brideSrc));
ok('the component is the one that declares it', /export default function AssistanceSheet\b/.test(sheetSrc));
// The bytes are the subject: if the bride page still spelled any of them, the
// extraction would have produced two homes rather than one.
{
  const bytes = ['One sheet. We do the rest.', 'Wedding date', 'Area, if you know it', 'The look', 'Send',
    'We share your request only with the vendors we choose for you.',
    'Pick at least one and tell us roughly how much.', 'Message The Dream Wedding'];
  const spelled = bytes.filter(b => brideSrc.includes(`'${b}'`) || brideSrc.includes(`"${b}"`));
  ok('not one sheet byte is spelled on the bride page', spelled.length === 0, spelled.join(' | '));
  const missing = bytes.filter(b => !sheetSrc.includes(b));
  ok('every one of them is in the component', missing.length === 0, missing.join(' | '));
}
ok('/plan renders the same component, not a copy of the sheet',
  /<AssistanceSheet\b/.test(planSrc) && !/ASSIST_ROWS\.map\(/.test(planSrc));
{
  // Two methods whose failure modes differ: the import graph, and the file census.
  const walk = (dir, hits = []) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
      const f = path.join(dir, e.name);
      if (e.isDirectory()) walk(f, hits);
      else if (/\.tsx?$/.test(e.name)) {
        const s = strip(fs.readFileSync(f, 'utf8'));
        if (/export default function AssistanceSheet\b/.test(s)) hits.push(path.relative(ROOT, f));
      }
    }
    return hits;
  };
  const hits = walk(P('app')).concat(walk(P('lib')));
  ok('exactly one file in the tree declares the sheet', hits.length === 1, hits.join(', '));
}

// ═══════════════════════════════════════════════════════════════════════════════
section('§2 · the three traps, defused by construction (Fork 5(a))');

ok('the component imports CanvasShell nowhere', !/CanvasShell/.test(sheetSrc));
ok('the component imports FrostCtx / useFrostMode nowhere', !/FrostCtx|useFrostMode/.test(sheetSrc));
// The import `@/lib/frost/assistPopup` is a module path, not a route, and it is the
// popup flag's one home — it stays. What must not be here is a place to SEND her.
ok('the component names no backTo and no shell route', !/backTo/.test(sheetSrc) && !/'\/frost/.test(sheetSrc));
ok('chrome is the caller\u2019s, taken as a parameter', /chrome:\s*\(inner: React\.ReactNode\)/.test(sheetSrc) && /return chrome\(/.test(sheetSrc));
ok('the bride caller is the one that names CanvasShell and the sanctuary',
  /CanvasShell/.test(brideSrc) && /backTo="\/frost\/canvas\/sanctuary"/.test(brideSrc));
ok('/plan names neither the shell nor the sanctuary', !/CanvasShell|sanctuary/.test(planSrc));
// The palette is the caller's too, and the proof is that the component holds no colour.
{
  const hexes = (sheetSrc.match(/#[0-9A-Fa-f]{6}\b/g) || []);
  ok('the component holds no colour literal at all', hexes.length === 0, hexes.join(' '));
}

// ═══════════════════════════════════════════════════════════════════════════════
section('§3 · the two 401s — no authed fetch from a public page');

// Derived from the source rather than retyped beside it: find the effect that owns
// each read and require the guard to be the first thing in its body.
function effectGuarded(src, needle) {
  const at = src.indexOf(needle);
  if (at < 0) return false;
  const open = src.lastIndexOf('useEffect(() => {', at);
  if (open < 0) return false;
  const body = src.slice(open + 'useEffect(() => {'.length, at);
  return /^\s*if\s*\(!signedIn\)\s*return;/.test(body);
}
ok('fetchMyAssistance is behind the signedIn guard', effectGuarded(sheetSrc, 'fetchMyAssistance()'));
ok('/api/v2/couple/me is behind the signedIn guard', effectGuarded(sheetSrc, "'/api/v2/couple/me'"));
ok('/plan passes signedIn={false}', /signedIn=\{false\}/.test(planSrc));
ok('the bride lane passes it true', /\bsignedIn\b/.test(brideSrc) && !/signedIn=\{false\}/.test(brideSrc));
// F-41.41's quiet frame would never lift without a read, so it must settle at mount.
ok('the quiet frame settles at mount when there is no read', /useState\(!signedIn \|\| !!initialSent\)/.test(sheetSrc));

// ═══════════════════════════════════════════════════════════════════════════════
section('§4 · BEHAVIOUR · the layout branch, driven');

{
  const cream = paintFor('/plan');
  ok('/plan paints the public ground', cream && cream.bg === '#F8F7F5', cream && String(cream.bg));
  ok('/plan sets the browser chrome to the same value', cream && cream.themeColor === '#F8F7F5');
  ok('/plan/anything paints it too', (paintFor('/plan/x') || {}).bg === '#F8F7F5');
  // THE TRAILING-SLASH TRAP, both ends. `indexOf('/plan/')===0` alone misses the whole
  // URL; `path==='/plan'` alone misses anything beneath it. Both terms or neither cell.
  ok('/planet is NOT a public storefront', (paintFor('/planet') || {}).bg == null);
  ok('the three older members still paint',
    (paintFor('/v/DEV440') || {}).bg === '#F8F7F5' &&
    (paintFor('/r/abc') || {}).bg === '#F8F7F5' &&
    (paintFor('/credits/abc') || {}).bg === '#F8F7F5');
  ok('the app surfaces are untouched by the new term',
    (paintFor('/vendor') || {}).bg == null && (paintFor('/admin') || {}).bg === '#18293E');
}

// ═══════════════════════════════════════════════════════════════════════════════
section('§5 · BEHAVIOUR · the sitemap, and robots left alone');

async function sitemapRows(srcOverride) {
  globalThis.fetch = async () => ({ ok: false, json: async () => ({}) });
  const mod = await loadTs(SITEMAP, srcOverride);
  return await mod.default();
}
{
  const rows = await sitemapRows();
  const plan = rows.find(r => String(r.url).endsWith('/plan'));
  ok('/plan is in the sitemap', !!plan);
  ok('monthly, 0.5 as ruled', plan && plan.changeFrequency === 'monthly' && plan.priority === 0.5,
    plan && `${plan.changeFrequency} ${plan.priority}`);
  ok('the three it joined are unchanged', rows.filter(r => /\/(privacy|terms)$/.test(r.url)).length === 2 &&
    rows.some(r => r.priority === 1 && r.changeFrequency === 'weekly'));
  const robots = strip(read(ROBOTS));
  // `/coplanner` contains the four letters and is not the subject; the subject is a
  // disallow ENTRY for this page, so the quote is part of the pattern.
  ok('robots is untouched — no /plan disallow', !/'\/plan/.test(robots) && /'\/coplanner'/.test(robots));
  ok('and its allow still serves the root', /allow:\s*\['\/',\s*'\/v\/'\]/.test(robots));
}

// ═══════════════════════════════════════════════════════════════════════════════
section('§6 · BEHAVIOUR · the public door');

const BASE_STUB = `
globalThis.__b20a5 = globalThis.__b20a5 || [];
export const USE_MOCKS = false;
export function isBrideDemoMode() { return false; }
export const API_BASE = 'https://example.invalid';
export async function mockDelay(v) { return v; }
export async function apiGet(p) { globalThis.__b20a5.push({ verb: 'GET', path: p }); return { ok: true }; }
export async function apiPost(p, body) {
  globalThis.__b20a5.push({ verb: 'POST', path: p, body });
  return { ok: true, request_id: 'r', items: [], message: '', admin_notified: false, admin_notify_refusal: null };
}
`;

async function drivePost(fn, srcOverride) {
  globalThis.__b20a5 = [];
  const mod = await loadTs(API, srcOverride, { from: "'./_base'", code: BASE_STUB });
  await mod[fn]({ city: 'Delhi', area: null, wedding_date: '2027-02-14', brief: null, items: [{ category: 'photography', budget_rs: 150000 }] });
  const hit = globalThis.__b20a5.find(c => c.verb === 'POST');
  return hit ? { url: hit.path, body: hit.body } : null;
}
{
  const pub = await drivePost('submitPublicAssistanceRequest');
  ok('the public submit posts to the /public mount', !!pub && pub.url === '/api/v2/couple/assistance/public', pub && pub.url);
  ok('and carries no origin on the body — ruling (ii)', pub && pub.body && !('origin' in pub.body));
  const bride = await drivePost('submitAssistanceRequest');
  ok('the bride submit still posts to its own door', !!bride && bride.url === '/api/v2/couple/assistance', bride && bride.url);
  ok('the two doors differ by the mount and nothing else',
    JSON.stringify(pub.body) === JSON.stringify(bride.body));
  ok('AssistRequestBody grew no origin field', !/origin[?]?:/.test(apiSrc.slice(apiSrc.indexOf('interface AssistRequestBody'), apiSrc.indexOf('interface AssistRequestResponse'))));
}

// ═══════════════════════════════════════════════════════════════════════════════
section('§7 · BEHAVIOUR · FORK D · the pre-fill');

// The function is lifted from the shipped file and bound — never retyped beside it.
async function loadPrefill(srcOverride) {
  const src = srcOverride ?? read(PLAN);
  const a = src.indexOf('const ISO_DATE');
  const b = src.indexOf('type Screen', a);
  if (a < 0 || b < 0) return null;
  const mod = await loadTs('app/plan/.slice.ts', src.slice(a, b).replace('function readPrefill', 'export function readPrefill'));
  return mod.readPrefill;
}
{
  const readPrefill = await loadPrefill();
  const q = (o) => (k) => (k in o ? o[k] : null);
  ok('?city= lands', JSON.stringify(readPrefill(q({ city: 'Jaipur' }))) === JSON.stringify({ city: 'Jaipur' }));
  ok('?date=YYYY-MM-DD lands', readPrefill(q({ date: '2027-02-14' })).date === '2027-02-14');
  ok('a malformed date is ignored, not passed on', readPrefill(q({ date: '14/02/2027' })).date === undefined);
  // Shape is not enough: this one matches the regex and is not a day.
  ok('a date of the right shape that is not a day is ignored', readPrefill(q({ date: '2027-02-31' })).date === undefined);
  ok('area is REFUSED', !('area' in readPrefill(q({ area: 'Vasant Kunj' }))));
  ok('brief is REFUSED', !('brief' in readPrefill(q({ brief: 'gold and ivory' }))));
  ok('an empty query yields nothing at all', JSON.stringify(readPrefill(q({}))) === '{}');
  ok('/plan reads the query through this one function', /readPrefill\(/.test(planSrc) && (planSrc.match(/params\.get\(/g) || []).length === 1);
}

// ═══════════════════════════════════════════════════════════════════════════════
section('§8 · FORK 4 · the city guard is /plan\u2019s alone');

ok('/plan sets requireCity', /\brequireCity\b/.test(planSrc));
ok('the bride page does NOT', !/requireCity/.test(brideSrc));
ok('the component defaults it off, so a caller that says nothing gets the old behaviour', /requireCity = false/.test(sheetSrc));
ok('the guard reads requireCity and not signedIn', /const missingCity = requireCity && city\.trim\(\) === ''/.test(sheetSrc));
ok('the refusal byte is the vetoed one, and it has one home',
  sheetSrc.includes("needCity:   'Add your wedding city.'") && !planSrc.includes('Add your wedding city'));
// F-42.74's shape: a refusal that outlives the edit answering it is the defect.
ok('every field clears the refusal through one wrapper', /const touched = \(\) =>/.test(sheetSrc) &&
  (sheetSrc.match(/touched\(\);/g) || []).length >= 6);

// ═══════════════════════════════════════════════════════════════════════════════
section('§9 · FORK 1 · the POST sits between persistSession and the push');

ok('/plan calls the estate\u2019s one mint, not a second copy', /useOtpSignup\(/.test(planSrc) && !/verify-otp/.test(planSrc));
ok('lib/auth/otpSignup.ts is not touched by this packet', /router\.push\('\/couple\/onboarding'\)/.test(strip(read('lib/auth/otpSignup.ts'))));
// The shim is the subject: the object handed to useOtpSignup as `router` must RECORD,
// never navigate. Derived from the call's own text.
{
  const at = planSrc.indexOf('useOtpSignup({');
  const call = planSrc.slice(at, planSrc.indexOf('});', at));
  ok('the router handed to the mint records the destination', /router:\s*\{\s*push:\s*\(href: string\)\s*=>\s*\{\s*destination\.current = href;\s*\}\s*\}/.test(call));
  ok('and the role from this door is never Maker', /role:\s*'Dreamer'/.test(call) && !/Maker/.test(planSrc));
  ok('the dial code is fixed at +91, no picker', /dialCode: P\.dial/.test(call) && /dial:\s*'\+91'/.test(planSrc) && !/CountrySheet|country picker/i.test(planSrc));
}
{
  // The order is the ruling. Within onVerify: verify, then the recorded href, then the
  // file, then the navigation — and the navigation is the LAST of the four.
  const at = planSrc.indexOf('async function onVerify');
  // The window is bound by the STATEMENT — this function's own text, from its
  // declaration to the next one — never by a brace count that a nested block moves.
  const fn = planSrc.slice(at, planSrc.indexOf('async function onResend', at));
  const iClear  = fn.indexOf('destination.current = null;');
  const iVerify = fn.indexOf('await verifyOtp()');
  const iHref   = fn.indexOf('const href = destination.current;');
  const iFile   = fn.indexOf('await fileIt()');
  const iPush   = fn.indexOf('router.push(href)');
  // The reset must come BEFORE the verify or a second attempt would read the first
  // attempt's destination and file on a session that was never minted.
  ok('the recorded destination is cleared before each attempt', iClear > 0 && iClear < iVerify);
  ok('verify → recorded href → file → push, in that order',
    iVerify > 0 && iHref > iVerify && iFile > iHref && iPush > iFile);
  ok('a refused verify files nothing', /if \(!href\) return;/.test(fn));
  ok('the beat before the push is the ruled 1500ms', /setTimeout\(\(\) => router\.push\(href\), 1500\)/.test(fn));
  ok('a failed file does not navigate and does not claim she sent', /setLost\(true\)/.test(fn) && iPush > fn.indexOf('setLost(true)'));
}
ok('the sheet returns the body rather than posting it, on this lane', /return 'held'/.test(planSrc));
ok("and 'held' never paints the sent card", /out === 'held'/.test(sheetSrc) && /setState\('idle'\)/.test(sheetSrc));
ok('markAssistRequested is called on the public path too — Fork 6', /markAssistRequested\(\)/.test(planSrc));
ok('and it is still the same one home', (() => {
  const s = strip(read('lib/frost/assistPopup.ts'));
  return (s.match(/export function markAssistRequested/g) || []).length === 1;
})());
// §8's native-implications clause: this page authors no storage of its own.
ok('/plan writes no localStorage and no cookie of its own', !/localStorage|document\.cookie|sessionStorage/.test(planSrc));

// ═══════════════════════════════════════════════════════════════════════════════
section('§10 · R-42.6 · every colour has a home');

{
  const hexes = [...new Set((planSrc.match(/#[0-9A-Fa-f]{6}\b/g) || []).map(h => h.toUpperCase()))];
  const strays = hexes.filter(h => !(h in CENSUS));
  ok('every hex on /plan is one of the nine', strays.length === 0, strays.join(' '));
  ok('and there are colours to check — the cell is not empty', hexes.length >= 8, String(hexes.length));
  ok('opacity is applied to the ink only, never to make a hue',
    (planSrc.match(/rgba\(([^)]*)\)/g) || []).every(v => /^rgba\(12,10,9,/.test(v)));
  // D-f, the e-7 tripwire: the retired surround must not appear anywhere in these
  // files — not in code, and not in a comment explaining why it is gone.
  const raw = read(PLAN) + read(SHEET) + read(BRIDE);
  const resurrected = RETIRED.filter(h => raw.toUpperCase().includes(h));
  ok('none of the seven retired values appears, in code or comment', resurrected.length === 0, resurrected.join(' '));
  ok('one gold per screen — the secondary action carries no metal', (() => {
    const at = planSrc.indexOf('const ALT');
    return !planSrc.slice(at, planSrc.indexOf('};', at)).includes('#C9A84C');
  })());
  // The two golds are bound to names, so the cell resolves the names rather than
  // asserting a literal that is deliberately not spelled twice on the glass.
  ok('GOLD and GOLD_INK are the census values', /const GOLD\s*=\s*'#C9A84C'/.test(planSrc) && /const GOLD_INK = '#7A621C'/.test(planSrc));
  ok('the action carries both the gold border and the gold ink, never one alone', (() => {
    const at = planSrc.indexOf('const CTA: React.CSSProperties');
    const cta = planSrc.slice(at, planSrc.indexOf('};', at));
    return /solid \$\{GOLD\}/.test(cta) && cta.includes('color: GOLD_INK') && cta.includes('minHeight: 44') && cta.includes('borderRadius: 2');
  })());
  ok('the public column keeps the estate\u2019s 430px cap', /maxWidth: 430/.test(planSrc));
  ok('the page is light only — no Wine value travels to it', !/#1A0A0E|#C4856A|#F5E5DC/.test(planSrc));
}

// ═══════════════════════════════════════════════════════════════════════════════
section('§11 · the vetoed bytes');

{
  const vetoed = [
    'Tell us what you need.', 'Your phone and name, so we can reach you.',
    'Enter the code we sent on WhatsApp.', 'Sent. We\u2019ll message you on WhatsApp.',
    'Almost there.', 'Check WhatsApp.',
    'Your first name', 'First name', 'Phone number', '00000 00000',
    'Send code', '6-digit code', 'Verify', 'Resend the code', 'Back',
  ];
  // The typographic apostrophe travels as the escape `\\u2019` in source — the estate's
  // spelling since the sheet, so a straight quote cannot walk into b40 C102's census.
  // The cell resolves the escape and then compares BYTES, rather than lowering its
  // standard to whatever the file happens to contain.
  const resolved = planSrc.split('\\u2019').join('\u2019');
  const missing = vetoed.filter(b => !resolved.includes(`'${b}'`));
  ok('all fifteen are on the page, byte-exact', missing.length === 0, missing.join(' | '));
  ok('Back carries no chevron — the glyph is chrome, the byte is the word', !/\u2039\s*Back|Back\s*\u2039/.test(read(PLAN)));
  ok('P4 uses the typographic apostrophe, so it cannot walk into the census',
    planSrc.includes('Sent. We\\u2019ll message you on WhatsApp.') && !planSrc.includes("Sent. We'll message"));
  ok('the bride lane keeps its own heading — Q1 is /plan only',
    brideSrc.includes('SHEET_BYTES.title') && !brideSrc.includes('Tell us what you need'));
  ok('#8 is not respelled on /plan — it is read from the one home', /SHEET_BYTES\.lede/.test(planSrc) && !planSrc.includes('One sheet. We do the rest.'));
  ok('#21 and #33 are read from the one home on the lost path', /SHEET_BYTES\.failure/.test(planSrc) && /SHEET_BYTES\.messageTdw/.test(planSrc));
  ok('the two literals F-42.137 named now have a home', /cityPh:/.test(sheetSrc) && /budgetAria:/.test(sheetSrc) &&
    !/placeholder="City"/.test(sheetSrc));
  ok('the Suspense boundary is present and the route stays prerenderable',
    /<Suspense fallback=\{null\}>/.test(planSrc) && !/force-dynamic/.test(planSrc));
}

// ═══════════════════════════════════════════════════════════════════════════════
section('§12 · NON-VACUITY — the production source mutated, each cell shown to red');

async function mutate(label, rel, from, to, cell) {
  const src = read(rel);
  if (!src.includes(from)) { fail++; console.log(`  FAIL  M · ${label} — the mutation site is gone: ${from.slice(0, 48)}`); return; }
  const mutated = src.split(from).join(to);
  let red = false;
  try { red = !(await cell(mutated)); } catch { red = true; }
  if (red) { pass++; console.log(`  PASS  M · ${label} — the cell REDS`); }
  else { fail++; console.log(`  FAIL  M · ${label} — the cell stayed green on mutated source`); }
}

await mutate('the whole-URL term dropped from the branch → /plan misses its own address',
  LAYOUT, "path==='/plan'||path.indexOf('/plan/')===0", "path.indexOf('/plan/')===0",
  async (m) => (paintFor('/plan', m) || {}).bg === '#F8F7F5');

await mutate('the prefix term dropped → anything beneath /plan misses it',
  LAYOUT, "path==='/plan'||path.indexOf('/plan/')===0", "path==='/plan'",
  async (m) => (paintFor('/plan/x', m) || {}).bg === '#F8F7F5');

await mutate('the sitemap priority moved off 0.5',
  SITEMAP, "changeFrequency: 'monthly', priority: 0.5", "changeFrequency: 'monthly', priority: 0.8",
  async (m) => { const rows = await sitemapRows(m); const p = rows.find(r => String(r.url).endsWith('/plan')); return p && p.priority === 0.5; });

await mutate('the public submit pointed back at the bride door',
  API, "'/api/v2/couple/assistance/public'", "'/api/v2/couple/assistance'",
  async (m) => { const p = await drivePost('submitPublicAssistanceRequest', m); return !!p && p.url === '/api/v2/couple/assistance/public'; });

await mutate('origin smuggled onto the shared body — ruling (ii) broken',
  API, 'return apiPost<AssistRequestResponse>(\'/api/v2/couple/assistance/public\', body);',
  'return apiPost<AssistRequestResponse>(\'/api/v2/couple/assistance/public\', { ...body, origin: \'public\' });',
  async (m) => { const p = await drivePost('submitPublicAssistanceRequest', m); return p && p.body && !('origin' in p.body); });

await mutate('the date\u2019s value check dropped, so 2027-02-31 rides the link',
  PLAN, "if (!isNaN(d.getTime()) && date === d.toISOString().slice(0, 10)) out.date = date;", 'out.date = date;',
  async (m) => { const f = await loadPrefill(m); return f(((o) => (k) => (k in o ? o[k] : null))({ date: '2027-02-31' })).date === undefined; });

await mutate('area admitted to the pre-fill — a forged link writes her words',
  PLAN, "const date = (get('date') || '').trim();",
  "const a = (get('area') || '').trim(); if (a) out.area = a;\n  const date = (get('date') || '').trim();",
  async (m) => { const f = await loadPrefill(m); return !('area' in f(((o) => (k) => (k in o ? o[k] : null))({ area: 'Vasant Kunj' }))); });

await mutate('the signedIn guard removed from the authed read',
  SHEET, 'if (!signedIn) return;\n    let live = true;\n    fetchMyAssistance()', 'let live = true;\n    fetchMyAssistance()',
  async (m) => effectGuarded(strip(m), 'fetchMyAssistance()'));

// The control: an edit through the identical path that changes no behaviour must
// leave the cells green, so a mutation cell cannot be passing because the harness
// reddens on any edit at all.
{
  const m = read(LAYOUT).replace('var bg=null;', 'var bg=null; /* control */');
  const green = (paintFor('/plan', m) || {}).bg === '#F8F7F5' && (paintFor('/planet', m) || {}).bg == null;
  if (green) { pass++; console.log('  PASS  CONTROL · a no-op edit through the same path leaves the branch green'); }
  else { fail++; console.log('  FAIL  CONTROL · a no-op edit reddened the branch'); }
}

// ═══════════════════════════════════════════════════════════════════════════════
console.log(`\n${fail === 0 ? 'GREEN' : 'RED'} — b20_a5_plan_pwa ${pass}/${pass + fail}`);
process.exit(fail === 0 ? 0 : 1);
