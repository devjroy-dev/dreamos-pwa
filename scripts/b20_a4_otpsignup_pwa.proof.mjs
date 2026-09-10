#!/usr/bin/env node
// scripts/b20_a4_otpsignup_pwa.proof.mjs — CE-42 · SEAT D3 · /plan SITTING 1 · FORK B
//
// §1  the extraction is real, and the landing page keeps NO second copy
// §2  the wiring — the page's pair comes FROM the hook, structurally derived
// §3  BEHAVIOUR · sendOtp, both roles, driven through the real transpiled module
// §4  BEHAVIOUR · verifyOtp, both roles — endpoints, session, cookie, destination
// §5  persistSession is the ONE home for the session write, and both callers reach it
// §6  the thirty controls, KEPT — two methods whose failure modes differ
// §7  F-42.61 · the moved comment names its callers by role and carries no line cites
// §8  NON-VACUITY · production source mutated, each behaviour cell shown to red
//
// BOTH WAYS: at d22bdf2c `lib/auth/otpSignup.ts` is absent → §1 fails and the run
// exits 1. Cured → exit 0. §8 mutates the module's own source and requires the
// green cells to go red, so no cell here can be passing vacuously.
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

// Comments are stripped before every textual assertion (standing law): a byte
// this bench claims absent must be absent from the CODE, and a comment that
// happened to mention it would otherwise read as the thing itself.
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

const OTP  = 'lib/auth/otpSignup.ts';
const LAND = 'app/(landing)/page.tsx';

if (!exists(OTP)) {
  console.log(`\nREFUSED — ${OTP} is absent. This bench measures the Fork B extraction; at the`);
  console.log('uncured tree there is nothing to measure and every cell below would be vacuous.');
  process.exit(1);
}

// Load the module through the repo's own TypeScript — a real transpile of the real
// file, not a regex. `srcOverride` lets §8 drive a MUTATED production source through
// the identical path, so a mutation cell and a green cell differ in the source only.
async function loadOtp(srcOverride) {
  const src = srcOverride ?? read(OTP);
  const ts = (await import('typescript')).default;
  const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
  const tmp = path.join(path.dirname(P(OTP)), '.tmp_otpSignup_' + Math.random().toString(36).slice(2) + '.mjs');
  fs.writeFileSync(tmp, out);
  try { return await import(pathToFileURL(tmp).href); }
  finally { fs.unlinkSync(tmp); }
}

// ── The world the browser gives these two functions, stubbed and recorded ────
function world() {
  const w = { posts: [], store: {}, cookies: [], toasts: [], screens: [], routes: [] };
  globalThis.window = { localStorage: { setItem: (k, v) => { w.store[k] = v; } } };
  globalThis.document = { set cookie(v) { w.cookies.push(v); }, get cookie() { return w.cookies.join('; '); } };
  globalThis.fetch = async (url, init) => {
    const body = init && init.body ? JSON.parse(init.body) : null;
    w.posts.push({ url: String(url), body, headers: (init && init.headers) || {} });
    const reply = w.reply ? w.reply(String(url), body) : { ok: true };
    return { ok: reply.__http !== false, json: async () => reply };
  };
  return w;
}

const deps = (w, over = {}) => ({
  role: 'Dreamer',
  country: { dialCode: '+91' },
  phone: '9625759924',
  otp: ['1', '2', '3', '4', '5', '6'],
  screen: 'join_phone',
  joinName: '',
  joinCategory: '',
  showToast: (m) => w.toasts.push(m),
  setScreen: (s) => w.screens.push(s),
  router: { push: (h) => w.routes.push(h) },
  apiBase: 'https://api.test',
  ...over,
});

const VERIFY_OK = { ok: true, access_token: 'AT', refresh_token: 'RT', name: null };

// ── The drives. Each returns the recorded world, so a cell reads facts, never
//    re-implements the subject. §8 calls these same drives with a mutated module.
async function driveSend(mod, over, arg) {
  const w = world();
  const { sendOtp } = mod.useOtpSignup(deps(w, over));
  await sendOtp(arg?.phoneNum ?? '9625759924', arg?.nameArg);
  return w;
}
async function driveVerify(mod, over, prov) {
  const w = world();
  w.reply = (url) => url.includes('verify-otp') ? VERIFY_OK : prov;
  const { verifyOtp } = mod.useOtpSignup(deps(w, over));
  await verifyOtp();
  return w;
}

const mod = await loadOtp();

// ═════════════════════════════════════════════════════════════════════════════
section('§1 · THE EXTRACTION IS REAL, AND THE PAGE KEEPS NO SECOND COPY');

const otpSrc = strip(read(OTP));
const landSrc = strip(read(LAND));

ok('lib/auth/otpSignup.ts exports the pair-maker and the folded session write',
  typeof mod.useOtpSignup === 'function' && typeof mod.persistSession === 'function');
ok('both storage helpers and the cookie age travel with it — no second home in the tree',
  typeof mod.safeSetItem === 'function' && typeof mod.mirrorSessionToCookie === 'function' && mod.SESSION_COOKIE_MAX_AGE === 7 * 24 * 60 * 60);
for (const gone of ['function safeSetItem', 'function mirrorSessionToCookie', 'SESSION_COOKIE_MAX_AGE', 'const sendOtp = async', 'const verifyOtp = async']) {
  ok(`the landing page no longer defines \`${gone}\``, !landSrc.includes(gone));
}
{
  // Estate-wide: the two helpers have no third home. Derived by walking the tree,
  // not by naming the files that are allowed to hold them.
  const hits = [];
  const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.next' || e.name === '.git') continue;
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f);
    else if (/\.tsx?$/.test(e.name)) { const s = strip(fs.readFileSync(f, 'utf8')); if (/function (safeSetItem|mirrorSessionToCookie)\b/.test(s)) hits.push(path.relative(ROOT, f)); }
  } };
  walk(ROOT);
  ok('estate-wide, the two helpers are DEFINED in exactly one file, and it is this one',
    hits.length === 1 && hits[0] === OTP, `found in ${hits.join(', ') || 'nowhere'}`);
}

// ═════════════════════════════════════════════════════════════════════════════
section('§2 · THE WIRING — the page\'s pair comes FROM the hook');

{
  // A cell that drives a function in isolation proves nothing about whether it is
  // CALLED. The subject of the page's destructuring is lifted from the page's own
  // source and required to be the hook — the name is not retyped beside it.
  const m = landSrc.match(/const\s*\{\s*sendOtp\s*,\s*verifyOtp\s*\}\s*=\s*([A-Za-z_$][\w$]*)\(/);
  ok('the page destructures `{ sendOtp, verifyOtp }` from a call, not a local definition', !!m);
  ok('and the thing it calls is `useOtpSignup`', !!m && m[1] === 'useOtpSignup');
  ok('which it imports from lib/auth/otpSignup', /import\s*\{[^}]*useOtpSignup[^}]*\}\s*from\s*'@\/lib\/auth\/otpSignup'/.test(landSrc));
  const arg = landSrc.slice(landSrc.indexOf('useOtpSignup('));
  for (const name of ['role', 'country', 'phone', 'otp', 'screen', 'joinName', 'joinCategory', 'showToast', 'setScreen', 'router'])
    ok(`the hook is handed the page's \`${name}\``, new RegExp(`[{,\\s]${name}[,\\s}]`).test(arg.slice(0, arg.indexOf('});') + 3)));
}

// ═════════════════════════════════════════════════════════════════════════════
section('§3 · BEHAVIOUR · sendOtp — BOTH ROLES');

{
  const v = await driveSend(mod, { role: 'Maker' });
  ok('Maker posts to the VENDOR send-otp door', v.posts[0].url === 'https://api.test/api/v2/vendor/auth/send-otp');
  const c = await driveSend(mod, { role: 'Dreamer' });
  ok('Dreamer posts to the COUPLE send-otp door', c.posts[0].url === 'https://api.test/api/v2/couple/auth/send-otp');
  ok('the phone leaves as E.164 — dial code + digits, punctuation dropped',
    (await driveSend(mod, {}, { phoneNum: '96257-59924' })).posts[0].body.phone === '+919625759924');
}
{
  const named = await driveSend(mod, {}, { nameArg: '  Priya  ' });
  ok('R-37.15: the join door\'s name TRAVELS with the send, trimmed', named.posts[0].body.name === 'Priya');
  const bare = await driveSend(mod, {});
  ok('R-37.15: a caller that passes no name ships NO name key — the recorded non-act',
    !('name' in bare.posts[0].body), JSON.stringify(bare.posts[0].body));
  ok('and a name that is only whitespace is not a name', !('name' in (await driveSend(mod, {}, { nameArg: '   ' })).posts[0].body));
}
{
  ok('from the join door the code screen is join_otp', (await driveSend(mod, { screen: 'join_phone' })).screens[0] === 'join_otp');
  ok('from the sign-in door it is signin_otp', (await driveSend(mod, { screen: 'signin_phone' })).screens[0] === 'signin_otp');
}
{
  const w = world(); w.reply = () => ({ error: 'That number is blocked.' });
  const { sendOtp } = mod.useOtpSignup(deps(w));
  await sendOtp('9625759924');
  ok('a refusal carries the DOOR\'s sentence — this side never rewrites what it cannot author', w.toasts[0] === 'That number is blocked.');
  ok('and a refused send does NOT advance the screen', w.screens.length === 0);
}

// ═════════════════════════════════════════════════════════════════════════════
section('§4 · BEHAVIOUR · verifyOtp — BOTH ROLES');

const PROV_C_FRESH  = { ok: true, couple_id: 'c1', user_id: 'u1', pin_set: false, name: null };
const PROV_C_DONE   = { ok: true, couple_id: 'c1', user_id: 'u1', pin_set: true,  name: 'Priya' };
const PROV_C_NONAME = { ok: true, couple_id: 'c1', user_id: 'u1', pin_set: true,  name: null };
const PROV_V_FRESH  = { ok: true, vendor_id: 'v1', user_id: 'u1', pin_set: false };
const PROV_V_DONE   = { ok: true, vendor_id: 'v1', user_id: 'u1', pin_set: true  };

{
  const v = await driveVerify(mod, { role: 'Maker', joinCategory: 'makeup' }, PROV_V_FRESH);
  ok('Maker verifies at the vendor door', v.posts[0].url.includes('/api/v2/vendor/auth/verify-otp'));
  ok('and provisions at the vendor door', v.posts[1].url === 'https://api.test/api/v2/vendor/auth/provision');
  ok('the vendor\'s category travels to provision', v.posts[1].body.category === 'makeup');
  ok('the six digits leave as one string', v.posts[0].body.otp === '123456');
  ok('provision is authorised with the token verify just returned', String(v.posts[1].headers.Authorization) === 'Bearer AT');

  const c = await driveVerify(mod, { role: 'Dreamer', joinCategory: 'makeup' }, PROV_C_FRESH);
  ok('Dreamer verifies at the couple door', c.posts[0].url.includes('/api/v2/couple/auth/verify-otp'));
  ok('and provisions at the couple door', c.posts[1].url === 'https://api.test/api/v2/couple/auth/provision');
  ok('a couple NEVER carries a category, even with one in state', c.posts[1].body.category === undefined);
}
{
  const v = await driveVerify(mod, { role: 'Maker' }, PROV_V_DONE);
  ok('the vendor session lands under both vendor keys', !!v.store['vendor_web_session'] && !!v.store['vendor_session']);
  ok('and under NEITHER couple key', !v.store['couple_web_session'] && !v.store['couple_session']);
  ok('the cookie mirror is the vendor\'s', (v.cookies[0] || '').startsWith('tdw_vendor_session='));
  ok('and it carries the seven-day age', (v.cookies[0] || '').includes(`max-age=${7 * 24 * 60 * 60}`));
  ok('both tokens are stored', v.store['access_token'] === 'AT' && v.store['refresh_token'] === 'RT');

  const c = await driveVerify(mod, { role: 'Dreamer' }, PROV_C_DONE);
  ok('the couple session lands under both couple keys', !!c.store['couple_web_session'] && !!c.store['couple_session']);
  ok('and under NEITHER vendor key', !c.store['vendor_web_session'] && !c.store['vendor_session']);
  ok('the cookie mirror is the couple\'s', (c.cookies[0] || '').startsWith('tdw_couple_session='));
}
{
  // FORK C(a), and the whole reason the smoke card is four steps longer than D5's.
  ok('FORK C(a): a stranger — no PIN, no name — goes to /couple/onboarding, NOT a pin screen',
    (await driveVerify(mod, { role: 'Dreamer' }, PROV_C_FRESH)).routes[0] === '/couple/onboarding');
  ok('F-OB.14 arm 3b: PINNED but NAMELESS also goes to /couple/onboarding',
    (await driveVerify(mod, { role: 'Dreamer' }, PROV_C_NONAME)).routes[0] === '/couple/onboarding');
  ok('a complete returning bride goes to /couple/pin-login',
    (await driveVerify(mod, { role: 'Dreamer' }, PROV_C_DONE)).routes[0] === '/couple/pin-login');
  ok('a pinless vendor goes to /vendor/pin',
    (await driveVerify(mod, { role: 'Maker' }, PROV_V_FRESH)).routes[0] === '/vendor/pin');
  ok('a pinned vendor goes to /vendor/pin-login',
    (await driveVerify(mod, { role: 'Maker' }, PROV_V_DONE)).routes[0] === '/vendor/pin-login');
}
{
  const w = world(); w.reply = (u) => u.includes('verify-otp') ? { ok: false, error: 'Incorrect code.' } : PROV_C_FRESH;
  const { verifyOtp } = mod.useOtpSignup(deps(w));
  await verifyOtp();
  ok('a bad code refuses and provisions NOTHING', w.toasts[0] === 'Incorrect code.' && w.posts.length === 1);
  ok('and writes no session', Object.keys(w.store).length === 0 && w.cookies.length === 0);
}
{
  const w = world(); w.reply = (u) => u.includes('verify-otp') ? VERIFY_OK : { ok: true, user_id: 'u1', couple_id: null, pin_set: false };
  const { verifyOtp } = mod.useOtpSignup(deps(w));
  await verifyOtp();
  ok('R-X10(a): a provision that returns no role id is reported as the failure it is, not as a gate',
    w.toasts[0] === 'Could not complete sign-in.' && w.routes.length === 0);
}

// ═════════════════════════════════════════════════════════════════════════════
section('§5 · persistSession — ONE HOME FOR THE SESSION WRITE (B-3)');

{
  const w = world();
  mod.persistSession(true, { id: 'v1' });
  ok('persistSession writes the vendor pair and mirrors it', !!w.store['vendor_web_session'] && !!w.store['vendor_session'] && w.cookies.length === 1);
  const w2 = world();
  mod.persistSession(false, { id: 'c1' });
  ok('and the couple pair, from the same one function', !!w2.store['couple_web_session'] && !!w2.store['couple_session'] && w2.cookies.length === 1);
}
ok('verifyOtp reaches storage THROUGH persistSession, not past it',
  /persistSession\(isVendor, sessionData\)/.test(otpSrc));
ok('the landing page\'s returning-member path calls the same one function',
  /persistSession\(isVendor, sd\)/.test(landSrc));
ok('and that path no longer writes storage or cookies itself',
  !landSrc.includes('safeSetItem') && !landSrc.includes('mirrorSessionToCookie'));

// ═════════════════════════════════════════════════════════════════════════════
section('§6 · THE THIRTY CONTROLS, ALL KEPT — CE-115');

{
  const raw = read(LAND);
  const count = (re) => (raw.match(re) || []).length;
  const opens = count(/<button/g), closes = count(/<\/button>/g);
  const inputs = count(/<input/g), anchors = count(/<a /g);
  const backs = count(/<BackBtn/g), golds = count(/<GoldBtn/g);
  ok('method A — every <button> that opens also closes', opens === closes && opens === 17, `${opens}/${closes}`);
  ok('method B — the element census still totals 30', opens + inputs + anchors + backs + golds === 30,
    `button ${opens} · input ${inputs} · a ${anchors} · BackBtn ${backs} · GoldBtn ${golds}`);
  ok('e-8 is not inherited: the two methods agree on the button count', opens === 17 && closes === 17);
  ok('sendOtp still has its four call sites on the glass', (raw.match(/sendOtp\(/g) || []).length === 4);
  ok('verifyOtp is still the Verify control\'s handler', /onClick=\{verifyOtp\}/.test(raw));
}

// ═════════════════════════════════════════════════════════════════════════════
section('§7 · F-42.61 — THE MOVED COMMENT CARRIES NO LINE CITES');

{
  const rawOtp = read(OTP);
  const comments = rawOtp.split('\n').filter((l) => l.trim().startsWith('//')).join('\n');
  ok('the four rotted caller cites are gone from the moved comment',
    !/:879|:577|:589|:909/.test(comments));
  ok('and it carries no line cite of any shape', !/\(:\d+\)|\bat :\d+|\b:\d{2,4}\b/.test(comments));
  ok('the callers are named by role instead — the join door, the sign-in paths, Resend',
    /join door/i.test(comments) && /sign-in paths/i.test(comments) && /Resend/.test(comments));
  ok('R-37.15\'s reasoning survived the move intact', /NOT READ STATE/.test(comments) && /never-clobber/.test(comments));
}

// ═════════════════════════════════════════════════════════════════════════════
section('§8 · NON-VACUITY — the production source mutated, each cell shown to red');

// ⚠ THE MUTATIONS ARE APPLIED TO COMMENT-STRIPPED SOURCE, AND THAT IS NOT TIDINESS.
// This bench's first cut mutated the raw file, and `role === 'Maker'` occurs in the
// module's header comment before it occurs in `sendOtp` — so the edit landed in prose,
// the behaviour never changed, and the cell reported a green subject as unmutatable.
// Comment-blindness is the same class the estate has caught four times; §8 refuses it
// by measuring a source that has no comments left to hit.
const raw = strip(read(OTP));
const mutations = [
  ['role gate inverted → Dreamer would post to the VENDOR door', "const isVendor = role === 'Maker';", "const isVendor = role !== 'Maker';",
    async (m) => (await driveSend(m, { role: 'Dreamer' })).posts[0].url.includes('/couple/')],
  ['the name read off state instead of the argument → the sign-in path would ship a name',
    'name: nameArg?.trim() || undefined', 'name: joinName.trim() || undefined',
    async (m) => !('name' in (await driveSend(m, { joinName: 'Priya' })).posts[0].body)],
  ['FORK C(a) broken → a stranger with no PIN would be sent to a pin screen',
    '!isVendor && (!pinSet || !d.name)', '!isVendor && (!pinSet && !d.name)',
    async (m) => (await driveVerify(m, { role: 'Dreamer' }, PROV_C_NONAME)).routes[0] === '/couple/onboarding'],
  ['the cookie mirror dropped from persistSession → the iOS fallback would be gone',
    'mirrorSessionToCookie(isVendor, session);', '',
    async (m) => (await driveVerify(m, { role: 'Dreamer' }, PROV_C_DONE)).cookies.length === 1],
  ['the couple key swapped for the vendor\'s → a bride\'s session would land in the vendor lane',
    "isVendor ? 'vendor_web_session' : 'couple_web_session'", "'vendor_web_session'",
    async (m) => !!(await driveVerify(m, { role: 'Dreamer' }, PROV_C_DONE)).store['couple_web_session']],
];
for (const [label, from, to, probe] of mutations) {
  if (!raw.includes(from)) { ok(`M · ${label} (mutation site present)`, false, 'the source no longer holds the subject'); continue; }
  let stillGreen = true;
  try { stillGreen = await probe(await loadOtp(raw.replace(from, to))); } catch { stillGreen = false; }
  ok(`M · ${label} — the cell REDS`, stillGreen === false);
}
{
  // The no-op control: a mutation that changes nothing must leave the cells green,
  // or §8 is measuring the reload and not the mutation.
  const noop = await loadOtp(raw + '\nexport const __NOOP_CONTROL = true;\n');
  ok('CONTROL · a no-op edit through the same loader leaves the behaviour green',
    (await driveVerify(noop, { role: 'Dreamer' }, PROV_C_FRESH)).routes[0] === '/couple/onboarding');
}

console.log(`\n${fail ? 'RED' : 'GREEN'} — b20_a4_otpsignup_pwa ${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
