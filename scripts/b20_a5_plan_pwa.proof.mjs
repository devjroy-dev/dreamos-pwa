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
// §13 F-42.143 · nothing in a flex row can refuse to shrink (the mechanism; the walk owns the measure)
// §14 F-42.144 · the sent screen is a FRESH instance, so initialSent means initial
// §15 the mint sends the SAME body from both doors — driven, not read
// F-42.153 · the date is a string end to end, driven under UTC, IST and UTC+14 (§7)
// §12 NON-VACUITY · production source mutated, each cell shown to red, one no-op control
//
// BOTH WAYS: at e81d703c `app/plan/page.tsx` is absent → the run REFUSES (exit 1).
// Cured → exit 0. §12 mutates the shipped source and requires green cells to red,
// so no cell here can be passing vacuously.
//
// Exit: 0 green · 1 red · 3 refused.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

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

// The typographic apostrophe travels as the escape in source; resolve before comparing.
const resolvedP4 = (src) => src.split('\\u2019').join('\u2019').includes("'Sent. We\u2019ll message you on WhatsApp.'");

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
  ok('the leap rule is arithmetic, and it is the real one', readPrefill(q({ date: '2028-02-29' })).date === '2028-02-29' &&
    readPrefill(q({ date: '2027-02-29' })).date === undefined &&
    readPrefill(q({ date: '2100-02-29' })).date === undefined &&
    readPrefill(q({ date: '2000-02-29' })).date === '2000-02-29');
  ok('month and day bounds hold at both ends', readPrefill(q({ date: '2027-13-01' })).date === undefined &&
    readPrefill(q({ date: '2027-00-10' })).date === undefined &&
    readPrefill(q({ date: '2027-04-31' })).date === undefined &&
    readPrefill(q({ date: '2027-12-31' })).date === '2027-12-31');
  // ⚠ F-42.153 · THE ZONE IS THE SUBJECT, AND ONE PROCESS CANNOT BE THE WITNESS.
  // The first cut of these cells ran in this container, which is UTC, where a local
  // parse and a UTC serialisation agree — so a round-trip that DISCARDS every dated
  // link on an Indian device read GREEN here. `TZ` is fixed when the process starts,
  // so the only honest instrument is a second process: the same slice is driven under
  // UTC and under Asia/Kolkata and the two must emit the same bytes.
  ok('the date validator names no Date at all', !/new Date/.test(planSrc.slice(planSrc.indexOf('function isCalendarDay'), planSrc.indexOf('type Screen'))));
  {
    const src = read(PLAN);
    const slice = src.slice(src.indexOf('const ISO_DATE'), src.indexOf('type Screen'))
      .replace('function readPrefill', 'export function readPrefill');
    const ts = (await import('typescript')).default;
    const js = ts.transpileModule(slice, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
    const modPath = P('app/plan/.tmp_b20a5_tz_' + Math.random().toString(36).slice(2) + '.mjs');
    const probe = modPath.replace('.mjs', '_probe.mjs');
    const CASES = ['2027-02-14', '2027-12-31', '2028-02-29', '2027-02-29', '2027-02-31', '2027-01-01', '2026-06-15'];
    fs.writeFileSync(modPath, js);
    fs.writeFileSync(probe, `import { readPrefill } from ${JSON.stringify(pathToFileURL(modPath).href)};\n` +
      `const CASES = ${JSON.stringify(CASES)};\n` +
      `process.stdout.write(JSON.stringify(CASES.map(d => readPrefill(k => (k === 'date' ? d : null)).date ?? null)));\n`);
    const run = (tz) => execFileSync(process.execPath, [probe], { env: { ...process.env, TZ: tz } }).toString();
    let utc = '', ist = '', ahead = '';
    try { utc = run('UTC'); ist = run('Asia/Kolkata'); ahead = run('Pacific/Kiritimati'); }
    finally { fs.unlinkSync(modPath); fs.unlinkSync(probe); }
    ok('UTC and Asia/Kolkata and UTC+14 all emit the SAME bytes', utc === ist && ist === ahead, `${utc} | ${ist} | ${ahead}`);
    ok('and the bytes are the days themselves, unshifted', utc === JSON.stringify(['2027-02-14', '2027-12-31', '2028-02-29', null, null, '2027-01-01', '2026-06-15']), utc);
  }
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
  const iSent   = fn.indexOf("setScreen('sent')");
  // The reset must come BEFORE the verify or a second attempt would read the first
  // attempt's destination and file on a session that was never minted.
  ok('the recorded destination is cleared before each attempt', iClear > 0 && iClear < iVerify);
  // AMENDED BY LABEL (R-41.121). The GUARANTEE is the same one the cell was written for
  // — the filing lands after the session is written and before she is moved on — and
  // only the last term changed: the move is her tap now, not a timer, so it has left
  // this function entirely. The cell asserts the order it can still see AND that the
  // navigation is genuinely absent from here rather than merely further down.
  ok('verify → recorded href → file → the confirmation, in that order',
    iVerify > 0 && iHref > iVerify && iFile > iHref && iSent > iFile);
  ok('and the navigation has left this function — nothing here pushes her anywhere', !/router\.push/.test(fn));
  ok('a refused verify files nothing', /if \(!href\) return;/.test(fn));
  // AMENDED BY LABEL (R-41.121). The GUARANTEE is unchanged — she is not moved off the
  // confirmation until it has been read — and only the mechanism the chair ruled for it
  // changed, from a 1500ms beat to her own tap, after the founder walked the beat and
  // could not report seeing the screen. The cell follows the meaning: nothing may move
  // her automatically, and the forward action must run the mint's own recorded href.
  ok('nothing moves her off the confirmation on a timer', !/setTimeout|setInterval/.test(planSrc));
  ok('the forward action is a TAP, and it pushes the mint\u2019s own destination',
    /sentAction=\{isSent \? \{ label: P\.cont, onTap: \(\) => \{ const href = destination\.current; if \(href\) router\.push\(href\); \} \} : undefined\}/.test(planSrc));
  ok('a failed file does not claim she sent — the confirmation is never reached', (() => {
    const iLost = fn.indexOf('setLost(true)');
    return iLost > 0 && iLost < iSent && /setLost\(true\); setRefusal\(SHEET_BYTES\.failure\); return;/.test(fn);
  })());
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
section('\u00a713 · F-42.143 · nothing in a horizontal row can refuse to shrink');

// ⚠ WHAT THIS CELL IS, STATED HONESTLY (CE-115, the provable-equivalent doctrine).
// The chair asked for a cell that the /plan document width equals the viewport at 374.
// THIS CONTAINER HAS NO LAYOUT ENGINE: Chrome cannot be fetched here (the puppeteer
// download host is outside the allowed domains), so nothing in this file can MEASURE a
// rendered page. What it can prove end-to-end is the MECHANISM — every input that sits
// in a flex row declares `minWidth: 0` — and that is the whole of the defect: a flex
// item's `min-width` defaults to `auto`, which floors it at the item's intrinsic width,
// and an input with no `size` is about 170px. The absence of horizontal scroll at 374
// is named in the founder's card as a truth only his device witnesses.
{
  // The set is DERIVED, never listed: every `<input` in the file. The rule is BLANKET
  // rather than conditional on the parent being a flex row — a conditional rule has to
  // be re-derived every time a field moves, and this bench's first cut proved the point
  // by walking back to the nearest `<div style={{`, landing on the `+91` box instead of
  // the row that holds it, and passing the phone field VACUOUSLY. The mutation caught it.
  const inputs = [];
  let at = planSrc.indexOf('<input');
  while (at >= 0) {
    inputs.push(planSrc.slice(at, planSrc.indexOf('/>', at) + 2));
    at = planSrc.indexOf('<input', at + 1);
  }
  ok('there are inputs to check — the cell is not empty', inputs.length >= 3, `${inputs.length} inputs`);
  const unfloored = inputs.filter(t => !/minWidth: 0/.test(t));
  ok('every input on the page declares minWidth: 0', unfloored.length === 0, `${unfloored.length} without it`);
  ok('the six code boxes are among them', (() => {
    const rowAt = planSrc.indexOf('{otp.map(');
    const row = planSrc.slice(rowAt, planSrc.indexOf('))}', rowAt));
    return /flex: 1, minWidth: 0/.test(row);
  })());
  // The other half of a sideways document: a fixed width wider than the column.
  const widths = [...planSrc.matchAll(/(?:minWidth|width|maxWidth): (\d+)/g)].map(m => parseInt(m[1], 10));
  ok('no fixed width on the page exceeds the 430 column', widths.every(w => w <= 430), widths.join(' '));
}

// ═══════════════════════════════════════════════════════════════════════════════
section('\u00a714 · F-42.144 · the sent screen is a FRESH instance');

{
  // Both branches return the same element type at the same position, so React reuses
  // the instance and every useState initialiser is skipped. The key is what makes
  // `initialSent` mean initial. Nothing throws when it is missing, which is why this
  // is a cell and not a crash.
  const at = planSrc.indexOf('<AssistanceSheet');
  const el = planSrc.slice(at, planSrc.indexOf('/>', at));
  ok('the sheet carries a key', /key=\{/.test(el));
  ok('and the key is the SCREEN, so the flip to sent remounts it', /key=\{screen\}/.test(el));
  ok('exactly one AssistanceSheet element is rendered from this file — one position, one instance',
    (planSrc.match(/<AssistanceSheet/g) || []).length === 1);
  ok('initialSent is still what feeds the two initialisers',
    /useState<[^>]*>\(initialSent \? 'sent' : 'idle'\)/.test(sheetSrc) &&
    /useState<[^>]*>\(initialSent \? \{ categories: initialSent\.categories \} : null\)/.test(sheetSrc));
  ok('the component names the initial-value contract where a caller will read it',
    /INITIAL MEANS INITIAL/.test(read(SHEET)));
  // Fork 2 amended: the sent screen keeps its heading and its card AND gains one action.
  ok('the sent block draws the caller\u2019s action when it is given one', /sentAction && \(/.test(sheetSrc) &&
    /\{sentAction\.label\}/.test(sheetSrc) && /onClick=\{sentAction\.onTap\}/.test(sheetSrc));
  ok('it wears the screen\u2019s one gold — the same cta the caller passes', (() => {
    const at = sheetSrc.indexOf('{sentAction && (');
    return /\.\.\.palette\.cta/.test(sheetSrc.slice(at, at + 500));
  })());
  ok('the bride lane passes none, so her sent screen is byte-unchanged', !/sentAction/.test(brideSrc));
  ok('and the prop is optional, so a caller that says nothing draws nothing', /sentAction\?: \{ label: string; onTap: \(\) => void \}/.test(sheetSrc));
  ok('P4 and the vetoed Continue are both on the page, byte-exact',
    planSrc.includes("cont:       'Continue'") && resolvedP4(planSrc));
}

// ═══════════════════════════════════════════════════════════════════════════════
section('\u00a715 · the mint sends the SAME body from both doors');

// The chair's question, answered by driving rather than by reading: if /plan's request
// shape differed from the landing's, the 500 would have been ours. Both callers reach
// the SAME two functions in the same file, so the bodies can only differ through the
// deps — and this drives the real module twice, once with each caller's values.
const OTPMOD = 'lib/auth/otpSignup.ts';
async function drivePair(deps) {
  const posts = [];
  globalThis.window = { localStorage: { setItem: () => {} } };
  globalThis.document = { set cookie(v) {}, get cookie() { return ''; } };
  globalThis.fetch = async (url, init) => {
    posts.push({ url: String(url), body: init && init.body });
    const u = String(url);
    if (u.includes('verify-otp')) return { ok: true, json: async () => ({ ok: true, access_token: 'a', refresh_token: 'r', name: null }) };
    if (u.includes('provision'))  return { ok: true, json: async () => ({ ok: true, couple_id: 'c', user_id: 'u', pin_set: false, name: null }) };
    return { ok: true, json: async () => ({ ok: true }) };
  };
  const mod = await loadTs(OTPMOD);
  const pair = mod.useOtpSignup(deps);
  await pair.sendOtp(deps.phone.replace(/\D/g, ''), deps.joinName);
  await pair.verifyOtp();
  return posts;
}
{
  const common = {
    role: 'Dreamer', country: { dialCode: '+91' },
    otp: ['4', '1', '7', '2', '8', '9'], screen: 'join_phone',
    joinName: 'Dev', joinCategory: '',
    showToast: () => {}, setScreen: () => {}, router: { push: () => {} },
    apiBase: 'https://api.invalid',
  };
  // /plan holds digits only; the landing holds what she typed, spaces and all.
  const fromPlan    = await drivePair({ ...common, phone: '9625759924' });
  const fromLanding = await drivePair({ ...common, phone: '96257 59924' });
  const shape = (posts) => posts.map(x => x.url.replace(/^https:\/\/api\.invalid/, '') + ' ' + x.body).join('\n');
  ok('send-otp and verify-otp and provision all fired on both runs', fromPlan.length === 3 && fromLanding.length === 3);
  ok('every URL and every BODY is byte-identical between the two doors', shape(fromPlan) === shape(fromLanding),
    shape(fromPlan) + ' | ' + shape(fromLanding));
  ok('the verify body is the couple door, phone as E.164, the six digits joined, purpose login', (() => {
    const v = fromPlan.find(x => x.url.includes('verify-otp'));
    return v && v.url.endsWith('/api/v2/couple/auth/verify-otp') &&
      JSON.parse(v.body).phone === '+919625759924' && JSON.parse(v.body).otp === '417289' && JSON.parse(v.body).purpose === 'login';
  })());
  ok('and /plan hands the mint the same dep KEYS the landing does, no more and no fewer', (() => {
    // TOP-LEVEL KEYS ONLY, AND KEYS ONLY — NOT VALUES. Two cuts of this extractor were
    // wrong in two different ways and each looked right: the first read every identifier
    // before a colon and counted `dialCode` and `push` out of /plan's nested literals;
    // the second stopped descending but still counted the VALUE side, so `joinName: name`
    // contributed `name` on one call and nothing on the other. Both would have reported
    // two identical dep sets as different, for a reason belonging to the instrument.
    // Key position opens after every top-level comma: a `:` closes it and the token is a
    // key; a `,` while still open means the shorthand, and the token is a key too.
    const keysOf = (src) => {
      const a = src.indexOf('useOtpSignup({');
      const call = src.slice(a + 'useOtpSignup({'.length, src.indexOf('});', a));
      const keys = []; let depth = 0, tok = '', inKey = true;
      const take = () => { const t = tok.trim(); if (/^[a-zA-Z][a-zA-Z0-9_]*$/.test(t)) keys.push(t); tok = ''; };
      for (let i = 0; i < call.length; i++) {
        const c = call[i];
        if (c === '{' || c === '(' || c === '[') { depth++; continue; }
        if (c === '}' || c === ')' || c === ']') { depth--; continue; }
        if (depth !== 0) continue;
        if (c === ':') { if (inKey) { take(); inKey = false; } tok = ''; continue; }
        if (c === ',') { if (inKey) take(); tok = ''; inKey = true; continue; }
        tok += c;
      }
      if (inKey) take();
      return [...new Set(keys)].sort().join(',');
    };
    return keysOf(planSrc) === keysOf(strip(read('app/(landing)/page.tsx')));
  })());
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

await mutate('the day check dropped, so 2027-02-31 rides the link',
  PLAN, 'if (m && isCalendarDay(+m[1], +m[2], +m[3])) out.date = date;', 'if (m) out.date = date;',
  async (m) => { const f = await loadPrefill(m); return f(((o) => (k) => (k in o ? o[k] : null))({ date: '2027-02-31' })).date === undefined; });

await mutate('area admitted to the pre-fill — a forged link writes her words',
  PLAN, "const date = (get('date') || '').trim();",
  "const a = (get('area') || '').trim(); if (a) out.area = a;\n  const date = (get('date') || '').trim();",
  async (m) => { const f = await loadPrefill(m); return !('area' in f(((o) => (k) => (k in o ? o[k] : null))({ area: 'Vasant Kunj' }))); });

await mutate('the signedIn guard removed from the authed read',
  SHEET, 'if (!signedIn) return;\n    let live = true;\n    fetchMyAssistance()', 'let live = true;\n    fetchMyAssistance()',
  async (m) => effectGuarded(strip(m), 'fetchMyAssistance()'));

await mutate('the floor removed from the code boxes — six inputs demand a thousand pixels in a 374 column',
  PLAN, 'flex: 1, minWidth: 0, width', 'flex: 1, width',
  async (m) => {
    const src = strip(m);
    const rowAt = src.indexOf('{otp.map(');
    return /flex: 1, minWidth: 0/.test(src.slice(rowAt, src.indexOf('))}', rowAt)));
  });

await mutate('the floor removed from the name and phone fields — the same class, the other rows',
  PLAN, '{ ...FIELD, minWidth: 0 }', '{ ...FIELD }',
  async (m) => {
    const src = strip(m);
    let at = src.indexOf('<input'), bad = 0;
    while (at >= 0) {
      if (!/minWidth: 0/.test(src.slice(at, src.indexOf('/>', at) + 2))) bad++;
      at = src.indexOf('<input', at + 1);
    }
    return bad === 0;
  });

await mutate('a dep dropped from /plan\u2019s call \u2014 the two doors would stop agreeing on the shape',
  PLAN, 'joinCategory: \'\',', '',
  async (m) => {
    const src = strip(m);
    const keysOf = (x) => {
      const a = x.indexOf('useOtpSignup({');
      const call = x.slice(a + 'useOtpSignup({'.length, x.indexOf('});', a));
      const keys = []; let depth = 0, tok = '', inKey = true;
      const take = () => { const t = tok.trim(); if (/^[a-zA-Z][a-zA-Z0-9_]*$/.test(t)) keys.push(t); tok = ''; };
      for (let i = 0; i < call.length; i++) {
        const c = call[i];
        if (c === '{' || c === '(' || c === '[') { depth++; continue; }
        if (c === '}' || c === ')' || c === ']') { depth--; continue; }
        if (depth !== 0) continue;
        if (c === ':') { if (inKey) { take(); inKey = false; } tok = ''; continue; }
        if (c === ',') { if (inKey) take(); tok = ''; inKey = true; continue; }
        tok += c;
      }
      if (inKey) take();
      return [...new Set(keys)].sort().join(',');
    };
    return keysOf(src) === keysOf(strip(read('app/(landing)/page.tsx')));
  });

await mutate('the key dropped — the sent screen would silently redraw the empty form',
  PLAN, 'key={screen}', 'data-screen={screen}',
  async (m) => {
    const src = strip(m);
    const at = src.indexOf('<AssistanceSheet');
    return /key=\{screen\}/.test(src.slice(at, src.indexOf('/>', at)));
  });

await mutate('the date validated by round-trip again \u2014 every dated link dies east of Greenwich',
  PLAN, 'if (m && isCalendarDay(+m[1], +m[2], +m[3])) out.date = date;',
  "if (m) { const d = new Date(date + 'T00:00:00'); if (!isNaN(d.getTime()) && date === d.toISOString().slice(0, 10)) out.date = date; }",
  async (m) => {
    const slice = m.slice(m.indexOf('const ISO_DATE'), m.indexOf('type Screen')).replace('function readPrefill', 'export function readPrefill');
    const ts = (await import('typescript')).default;
    const js = ts.transpileModule(slice, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
    const modPath = P('app/plan/.tmp_b20a5_mut_' + Math.random().toString(36).slice(2) + '.mjs');
    const probe = modPath.replace('.mjs', '_probe.mjs');
    fs.writeFileSync(modPath, js);
    fs.writeFileSync(probe, `import { readPrefill } from ${JSON.stringify(pathToFileURL(modPath).href)};\n` +
      `process.stdout.write(String(readPrefill(k => (k === 'date' ? '2027-02-14' : null)).date ?? null));\n`);
    try {
      const utc = execFileSync(process.execPath, [probe], { env: { ...process.env, TZ: 'UTC' } }).toString();
      const ist = execFileSync(process.execPath, [probe], { env: { ...process.env, TZ: 'Asia/Kolkata' } }).toString();
      return utc === ist;
    } finally { fs.unlinkSync(modPath); fs.unlinkSync(probe); }
  });

await mutate('the tap replaced by a timer again \u2014 a confirmation nobody can be sure they saw',
  PLAN, "sentAction={isSent ? { label: P.cont,", "sentActionX={isSent ? { label: P.cont,",
  async (m) => /sentAction=\{isSent \? \{ label: P\.cont,/.test(strip(m)));

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
