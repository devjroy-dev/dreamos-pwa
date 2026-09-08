#!/usr/bin/env node
// scripts/b20_a3_assistance_pwa.proof.mjs — BLOCK 20 · CONCIERGE s1 · packet A3 (CE-41 seat A)
//
// §1 the three `Discover · Storefront` bytes (R-41.17, §6.4(b)) — and NOWHERE else on the bride lane
// §2 the Meridian fold — no POST to /concierge/request remains; the card navigates; #36–#38 ruled bytes
// §3 the Settings row #34/#35 navigates to the sheet
// §4 the sheet — vetoed strings by number; formatRs is the money home; nothing writes to couples
// §5 the popup RULE (pure, every branch) and its mount on the sanctuary
// §6 F-41.1 — the front door reads the session (pure rule + the effect + F-41.2's comment gone)
// §7 the admin queue — formatRs, no persona in chrome, behind the admin api, nav registered LIVE
// §8 copy law — no persona name in any new chrome string; wallet law — no glyph
//
// BOTH WAYS: at 08a31d7 the new files are absent → the cells FAIL (exit 1); cured → exit 0.
// Behavioural where a pure function exists (the popup rule, the entry redirect); textual on
// stripped source elsewhere (R-40.105). Exit: 0 green · 1 red · 3 refused.

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

// Load a .ts module through the repo's own TypeScript (node_modules/typescript,
// the same compiler `tsc --noEmit` runs) — a real transpile, not a regex strip.
async function loadTs(rel) {
  const src = read(rel);
  if (!src) return null;
  const ts = (await import('typescript')).default;
  const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
  // Written BESIDE the source so its relative imports resolve; transpiled siblings it
  // imports are written the same way by the caller when needed.
  const tmp = path.join(path.dirname(P(rel)), '.tmp_' + path.basename(rel, '.ts') + '.mjs');
  fs.writeFileSync(tmp, out.replace(/from '(\.[^']+)'/g, (m, r) => r.endsWith('.mjs') ? m : `from '${r}.ts'`));
  try { return await import(pathToFileURL(tmp).href + '?t=' + Date.now()); }
  finally { fs.unlinkSync(tmp); }
}

const SANCT = 'app/(frost)/frost/canvas/sanctuary/page.tsx';
const DISC  = 'components/frost/blooms/discover.tsx';
const MUSER = 'app/components/couple/MuseRow.tsx';
const MERID = 'components/frost/blooms/meridian.tsx';
const SETT  = 'components/frost/blooms/settings.tsx';
const SHEET = 'app/(frost)/frost/canvas/assistance/page.tsx';
const POPUP = 'components/frost/AssistPopup.tsx';
const RULE  = 'lib/frost/assistPopup.ts';
const ENTRY = 'lib/frost/entryRedirect.ts';
const LAND  = 'app/(landing)/page.tsx';
const ADMIN = 'app/admin/assistance/page.tsx';
const NAV   = 'app/admin/_components/adminNav.ts';
const CAPI  = 'lib/frost-api/assistance.ts';
const AAPI  = 'lib/admin-api/assistance.ts';
const LABEL = 'Discover \u00b7 Storefront';

section('§1 · THE THREE BYTES — R-41.17, §6.4(b)');
ok('BASE_SLICES discover label is `Discover · Storefront`', new RegExp(`key:'discover'as RoomKey, label:'${LABEL}'`).test(strip(read(SANCT))));
ok('the bloom\'s own Italianno title says the same', new RegExp(`>${LABEL}</span>`).test(strip(read(DISC))));
ok('MuseRow\'s empty state says the same', strip(read(MUSER)).includes(`Start saving vendors in ${LABEL} to build your Muse.`));
{
  const files = [];
  (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) { if (!/node_modules|\.next/.test(e.name)) walk(f); } else if (/\.tsx?$/.test(f)) files.push(f); } })(P('app/(frost)'));
  (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) walk(f); else if (/\.tsx?$/.test(f)) files.push(f); } })(P('components/frost'));
  files.push(P(MUSER));
  const bare = files.filter(f => /(^|[^\w·])Discover(?![\w·])/.test(strip(fs.readFileSync(f, 'utf8')).replace(/Discover \u00b7 Storefront/g, '').replace(/DiscoverRoom|DiscoverProfile|Discover Profile|discover/g, '')) && /[>'"]Discover[<'"]/.test(strip(fs.readFileSync(f, 'utf8'))));
  ok('no rendered bare `Discover` remains on the bride lane (radius derived by walk, R-40.64)', bare.length === 0, bare.map(f => path.relative(ROOT, f)).join(', '));
}
ok('admin cockpit strings are OUT of radius — untouched (R-41.5)', !read('app/admin/approvals/discover/page.tsx').includes(LABEL));

section('§2 · THE MERIDIAN FOLD — R-41.19/.24');
const mer = strip(read(MERID));
ok('no fetch to /concierge/request remains in the room', !/concierge\/request/.test(mer) && !/fetch\(/.test(mer.slice(0, mer.indexOf('MERIDIAN ROOM') > 0 ? mer.indexOf('MERIDIAN ROOM') : 0)));
ok('the old button is gone; the card exists and navigates to the sheet', !/MeridianConciergeBtn/.test(mer) && /function MeridianConciergeCard/.test(mer) && /router\.push\(ASSIST_SHEET_PATH\)/.test(mer) && /'\/frost\/canvas\/assistance'/.test(mer));
ok('#36 #37 #38 as ruled (the founder\'s phrase kept)', mer.includes("title: 'Want a personal concierge?'") && mer.includes("body:  'The Dream Wedding finds and books your vendors \u2014 photography, makeup, d\u00e9cor, planning, all of it. One sheet.'") && mer.includes("link:  'Ask a Personal Concierge \u2192'"));
ok('the STRUCK sentence is gone from the plane', !/Our concierge will reach you at the earliest/.test(read(MERID)) && !/Our concierge will reach you/.test(read(SHEET)));
ok('the chat surface is untouched: input, send, history, Clear all present', /onClick=\{\(\)=>send\(input\)\}/.test(mer) && /Clear\s*<\/button>/.test(mer) && /msgs\.map\(/.test(mer));
ok('both render sites (full + compact) point at the card', (mer.match(/<MeridianConciergeCard /g) || []).length === 2);

section('§3 · SETTINGS — #34 / #35');
const set = strip(read(SETT));
ok('the row exists with the two vetoed bytes', set.includes("ASSIST_ROW_LABEL = 'Wedding assistant'") && set.includes("ASSIST_ROW_VALUE = 'Ask us to find and book your vendors.'") && /<Row label=\{ASSIST_ROW_LABEL\} value=\{ASSIST_ROW_VALUE\} onTap=\{\(\)=>router\.push\(ASSIST_SHEET_PATH\)\} arrow\/>/.test(set));
ok('every existing settings control is still there (date, budget, publish switch, WA link, sign out)', /Wedding date/.test(set) && /Total budget/.test(set) && /togglePublish/.test(set) && /DREAMAI_WA_LINK/.test(set) && /Sign out/.test(set));

section('§4 · THE SHEET');
const sheet = strip(read(SHEET));
ok('the sheet exists under /frost/canvas/assistance', exists(SHEET));
for (const [n, str] of [['#7', "'Your wedding assistant'"], ['#8', "'One sheet. We do the rest.'"], ['#13', "'What you need, and roughly how much for each'"], ['#17', "'Colours, style, anything you\\u2019ve saved in your Muse'"], ['#19', "'We share your request only with the vendors we choose for you.'"], ['#20', "'Pick at least one and tell us roughly how much.'"], ['#22', "'Sent. We\\u2019re on it.'"], ['#23', "'We\\u2019ll message you on WhatsApp as we find each vendor.'"], ['#33', "'Message The Dream Wedding'"]]) {
  ok(`${n} byte-exact`, sheet.includes(str));
}
// (A7 re-aim: #25 `Found so far` is KEPT at the veto and now built — F-41.29; only #30/#31 are struck.)
ok('#30/#31 STRUCK — no `Asked` chip, no count of who was asked', !/'Asked'|Two more|photographers'/.test(sheet));
ok('money renders through formatRs, never a glyph or a local formatter', /import \{ formatRs \} from '@\/lib\/vendor\/format'/.test(sheet) && /formatRs\(parseInt\(r\.rs/.test(sheet) && !/\u20b9/.test(read(SHEET)) && !/toLocaleString\('en-IN'\)/.test(sheet));
ok('the eleven canonical rows, in the veto order, mehendi under `other` (R-41.27)', (() => { const api = strip(read(CAPI)); const cats = [...api.matchAll(/category: '([a-z_]+)',\s+label: '([^']+)'/g)].map(m => m[1]); return cats.length === 11 && cats[0] === 'photography' && cats[7] === 'other' && /label: 'Mehendi & anything else'/.test(api); })());
ok('the sheet POSTs through the one client, never a raw fetch, and never writes to couples (R-41.25)', /submitAssistanceRequest\(/.test(sheet) && !/fetch\(/.test(sheet) && !/couple\/me['"][\s\S]*?method:\s*'P/.test(sheet) && /apiPost<AssistRequestResponse>\('\/api\/v2\/couple\/assistance'/.test(strip(read(CAPI))));
ok('the sheet marks her first request for the popup rule', /markAssistRequested\(\)/.test(sheet));
ok('the WA link is the settings room\'s own home (waNumberFor)', /waNumberFor\('bride'\)/.test(sheet));

section('§5 · THE POPUP RULE (§6.1) — pure, every branch; and its mount');
const rule = await loadTs(RULE);
ok('the rule module loads', !!rule && typeof rule.shouldShowAssistPopup === 'function');
if (rule) {
  const f = (o) => rule.shouldShowAssistPopup({ loginKey: 'L1', shownForLogin: null, dismissals: 0, requested: false, ...o });
  ok('signed in, first time this login, no dismissals, no request → SHOW', f({}) === true);
  ok('not signed in → never', f({ loginKey: null }) === false);
  ok('already shown this login → not again this login', f({ shownForLogin: 'L1' }) === false);
  ok('shown under an earlier login → shows again on the new login', f({ shownForLogin: 'L0' }) === true);
  ok('one dismissal → still asked next login', f({ dismissals: 1 }) === true);
  ok('two dismissals → never again', f({ dismissals: 2 }) === false && f({ dismissals: 5 }) === false);
  ok('she has requested once → never again, whatever else', f({ requested: true }) === false && f({ requested: true, dismissals: 0, shownForLogin: null }) === false);
  ok('the login key never stores the token and changes with it', rule.loginKeyFromToken('tokA') !== rule.loginKeyFromToken('tokB') && !rule.loginKeyFromToken('secret-token-xyz').includes('secret'));
}
const pop = strip(read(POPUP));
ok('the popup draws #1–#5 as ruled (#3, #4 in the founder\'s words)', pop.includes("eyebrow: 'The Dream Wedding'") && pop.includes("title:   'Let us find your vendors.'") && pop.includes("body:    'Tell us your date, your city and what you need. We find and book your vendors for you \\u2014 planners included.'") && pop.includes("primary: 'Find my vendors'") && pop.includes("secondary: 'Not now'"));
ok('the popup reads the rule, marks shown on show, marks dismissed on Not now / scrim, navigates on Find my vendors', /shouldShowAssistPopup\(facts\)/.test(pop) && /markAssistPopupShown\(facts\.loginKey\)/.test(pop) && (pop.match(/markAssistPopupDismissed\(\)/g) || []).length === 2 && /router\.push\(ASSIST_SHEET_PATH\)/.test(pop));
ok('mounted once in the sanctuary — the surface /frost resolves to (R-41.28: bottom sheet over it)', (strip(read(SANCT)).match(/<AssistPopup\/>/g) || []).length === 1 && /import AssistPopup from '@\/components\/frost\/AssistPopup'/.test(read(SANCT)) && /router\.replace\('\/frost\/canvas\/sanctuary'\)/.test(read('app/(frost)/frost/page.tsx')));

section('§6 · F-41.1 — THE FRONT DOOR READS THE SESSION');
const entry = await loadTs(ENTRY);
ok('the rule module loads', !!entry && typeof entry.entryRedirectFor === 'function');
if (entry) {
  ok('vendor session → /vendor/rooms', entry.entryRedirectFor(true, false) === '/vendor/rooms');
  ok('couple session → /frost', entry.entryRedirectFor(false, true) === '/frost');
  ok('no session → stay (null)', entry.entryRedirectFor(false, false) === null);
  ok('both present → the vendor shell (the founder walks it first)', entry.entryRedirectFor(true, true) === '/vendor/rooms');
}
const land = strip(read(LAND));
ok('the landing page calls the rule on mount at `/` with the one-home session reads and router.replace', /entryRedirectFor\(!!getVendorSession\(\), !!getCoupleSession\(\)\)/.test(land) && /router\.replace\(to\)/.test(land) && /window\.location\.pathname !== '\/'/.test(land) && /from '@\/lib\/frost-api\/_base'/.test(read(LAND)));
ok('F-41.2: the stale "dream-os byte never built" comment is gone', !/dream-os is zero-byte this sitting/.test(read(LAND)) && !/Chartered separately, not faked client-side/.test(read(LAND)));
// ── F-41.18 · R-41.53c — after sign-out, BOTH session homes read null, so the front
// door has nothing to redirect on. Behavioural: a fake window + localStorage, both
// homes loaded through the repo's own TypeScript, the legacy key planted the way the
// pin pages plant it. The first cut of this rider read _base's wider home and looped.
{
  const store = new Map();
  globalThis.window = { localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k), clear: () => store.clear(), key: () => null, get length() { return store.size; } },
    location: { hostname: 'thedreamwedding.in', pathname: '/' } };
  globalThis.localStorage = globalThis.window.localStorage;
  globalThis.document = { cookie: '' };
  const sess = await loadTs('lib/vendor/session.ts').catch(() => null);
  const base = await loadTs('lib/frost-api/_base.ts').catch(() => null);
  ok('R-41.53c: both session homes load under a fake window', !!sess && !!base && typeof sess.clearVendorSession === 'function' && typeof base.getVendorSession === 'function');
  if (sess && base && entry) {
    // Stamped `_v: 2` as the pin-login writes it (pin-login/page.tsx:109; session.ts:24
    // SESSION_VERSION = 2) — the shell evicts anything older as stale (session.ts:41).
    const planted = JSON.stringify({ id: 'v-dev440', vendorId: 'v-dev440', userId: 'u', phone: '+919888294440', pin_set: true, access_token: 't', _v: 2 });
    const prePin  = JSON.stringify({ id: 'v-dev440', vendorId: 'v-dev440', userId: 'u', phone: '+919888294440', pin_set: true });
    store.set('vendor_session', prePin);
    ok('R-41.53b consequence: the landing\'s pre-PIN write (no _v) is evicted by the shell home, so the door does NOT redirect a vendor who has not entered her PIN', sess.getVendorSession() === null && entry.entryRedirectFor(!!sess.getVendorSession(), false) === null && !store.has('vendor_session'));
    store.set('vendor_session', planted); store.set('vendor_web_session', planted);
    const before = entry.entryRedirectFor(!!sess.getVendorSession(), false);
    ok('R-41.53c: with both keys present the shell home sees a vendor and the door redirects', before === '/vendor/rooms');
    sess.clearVendorSession();
    ok('R-41.53a: sign-out removes vendor_web_session too, not only vendor_session', !store.has('vendor_session') && !store.has('vendor_web_session'));
    ok('R-41.53c: after clearVendorSession() the SHELL home reads null → entryRedirectFor is null', sess.getVendorSession() === null && entry.entryRedirectFor(!!sess.getVendorSession(), false) === null);
    ok('R-41.53c: after clearVendorSession() the FRONT-DOOR home (_base) reads null too → the two cannot disagree', base.getVendorSession() === null && entry.entryRedirectFor(!!base.getVendorSession(), false) === null);
    // the loop's exact shape, refused: only the legacy key left behind (as before the cure)
    store.set('vendor_web_session', planted);
    ok('R-41.53b: the front door reads the shell\'s home — a stray legacy key alone no longer redirects', /import \{ getVendorSession \} from '@\/lib\/vendor\/session'/.test(read(LAND)) && !/getVendorSession[^\n]*from '@\/lib\/frost-api\/_base'/.test(read(LAND)) && entry.entryRedirectFor(!!sess.getVendorSession(), false) === null);
  }
  delete globalThis.window; delete globalThis.localStorage; delete globalThis.document;
}
ok('nothing else on the landing page moved: sign-in handler, role toggle, both entry doors still present', /handleSignIn/.test(land) && /setRole\('Maker'\)/.test(land) && /router\.push\(isVendor \? '\/vendor\/pin-login' : '\/couple\/pin-login'\)/.test(land));
// A4 rider (R-41.50): the homepage privacy link is the literal Google compares to the consent
// screen's Privacy policy URI — absolute, no trailing slash — and Terms sits beside it.
ok('A4: the entry screen links https://thedreamwedding.in/privacy byte-exact (no trailing slash) and /terms beside it', /href="https:\/\/thedreamwedding\.in\/privacy"/.test(land) && !/thedreamwedding\.in\/privacy\//.test(land) && /href="https:\/\/thedreamwedding\.in\/terms"/.test(land) && /Privacy<\/a>[\s\S]{0,200}Terms<\/a>/.test(land));
ok('A4: the privacy page\'s §5 names Search Console access and discloses share (the fourth verb), with no Business Profile write claim', (() => { const pv = read('app/privacy/page.tsx'); return /<span className="num">5<\/span> Your Google account/.test(pv) && /We do not share it with anyone\./.test(pv) && /how those pages ranked in Google Search/.test(pv) && !/update the fields you edit in our app/.test(pv) && !/Google Business Profile to your vendor account/.test(pv); })());

section('§7 · THE ADMIN QUEUE');
const adm = strip(read(ADMIN));
ok('the page exists at /admin/assistance and reads through lib/admin-api/assistance.ts', exists(ADMIN) && /from '@\/lib\/admin-api\/assistance'/.test(adm) && !/fetch\(/.test(adm));
ok('money via formatRs (c-41.2), no glyph', /import \{ formatRs \} from '@\/lib\/vendor\/format'/.test(adm) && !/\u20b9/.test(read(ADMIN)));
ok('the per-item forward row: vendor search by trade + city, alphabetical from the server; outsider by handle + number', /searchAssistVendors\(\{ category: item\.category, city: request\.city/.test(adm) && /forwardToVendor\(item\.id, v\.id\)/.test(adm) && /forwardToProspect\(item\.id, \{ phone: phone\.trim\(\)/.test(adm));
ok('the dark reason is shown verbatim, never hidden', /out\.dark\.reason/.test(adm));
ok('`Forwarded N of <fanout>` reads the server\'s fanout_default (§6.2)', /Forwarded \{item\.forwarded_count\} of \{fanout\}/.test(adm) && /fanout_default/.test(adm));
ok('no client-side ranking of vendors (roadmap §7): the list is rendered in the order served', !/\.sort\(/.test(adm));
const nav = read(NAV);
ok('the nav registers /admin/assistance under People and ROUTE_MAP marks it LIVE', /path: '\/admin\/assistance',\s+icon:/.test(nav) && /\{ path: '\/admin\/assistance',\s+domain: 'people',\s+disposition: 'LIVE' \}/.test(nav));
ok('the admin api client names the six doors A2 built', ['/api/v2/admin/assistance', '/items/${itemId}/forward', '/vendors?', '/close'].every(s => read(AAPI).includes(s)));

section('§A7 · THE WALK\'S PWA RIDER — F-41.25 / .27 / .28 / .29 · Open: N');
{
  // F-41.25 — behavioural: plant the cookie only; get reads a couple; clear; get reads null.
  const store = new Map();
  let cookieJar = 'tdw_couple_session=' + encodeURIComponent(JSON.stringify({ id: 'couple-sarah', pin_set: true }));
  globalThis.window = { localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k), clear: () => store.clear(), key: () => null, get length() { return store.size; } },
    location: { hostname: 'thedreamwedding.in', pathname: '/' } };
  globalThis.localStorage = globalThis.window.localStorage;
  globalThis.document = { get cookie() { return cookieJar; }, set cookie(v) { if (/max-age=0/.test(v)) cookieJar = ''; else cookieJar = v.split(';')[0]; } };
  const base = await loadTs('lib/frost-api/_base.ts').catch(() => null);
  ok('F-41.25: _base exports clearCoupleSession beside getCoupleSession', !!base && typeof base.clearCoupleSession === 'function' && typeof base.getCoupleSession === 'function');
  if (base && entry) {
    store.set('couple_session', JSON.stringify({ id: 'couple-sarah', pin_set: true }));
    ok('F-41.25: with keys + cookie the couple home reads a couple and the door would send her to /frost', !!base.getCoupleSession() && entry.entryRedirectFor(false, !!base.getCoupleSession()) === '/frost');
    for (const k of ['access_token','refresh_token','couple_session','couple_web_session','couple_last_path','couple_app_mode']) store.delete(k);
    ok('F-41.25: THE DISEASE — with only the cookie left (the old sign-out), the home still reads a couple', !!base.getCoupleSession());
    store.set('couple_session', JSON.stringify({ id: 'couple-sarah', pin_set: true }));
    if (typeof base.clearCoupleSession === 'function') base.clearCoupleSession();
    ok('F-41.25: THE CURE — clearCoupleSession removes the six keys AND expires the cookie; the home reads null; the door stays', store.size === 0 && cookieJar === '' && base.getCoupleSession() === null && entry.entryRedirectFor(false, !!base.getCoupleSession()) === null);
  }
  delete globalThis.window; delete globalThis.localStorage; delete globalThis.document;
  const set2 = strip(read(SETT));
  ok('F-41.25: Settings sign-out calls the one home and no longer carries its own key list', /clearCoupleSession\(\)/.test(set2) && !/\['access_token','refresh_token','couple_session'/.test(set2) && /import \{ clearCoupleSession \} from '@\/lib\/frost-api\/_base'/.test(read(SETT)));
  // F-41.27 — behavioural: a 409 with a JSON body throws an AdminApiError carrying code + the server's sentence
  const savedFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: false, status: 409, json: async () => ({ ok: false, code: 'peer_already_has', error: 'This vendor already has a lead with this phone number.' }) });
  globalThis.window = { localStorage: { getItem: () => null } };
  const abase = await loadTs('lib/admin-api/_base.ts').catch(() => null);
  let thrown = null;
  if (abase) { try { await abase.adminPost('/api/v2/admin/assistance/items/x/forward', { kind: 'vendor' }); } catch (e) { thrown = e; } }
  ok('F-41.27: a refused admin call throws AdminApiError with status 409, code peer_already_has, and the server\'s sentence as message', !!thrown && thrown.name === 'AdminApiError' && thrown.status === 409 && thrown.code === 'peer_already_has' && /already has a lead/.test(thrown.message));
  globalThis.fetch = async () => ({ ok: false, status: 500, json: async () => { throw new Error('not json'); } });
  thrown = null;
  if (abase) { try { await abase.adminGet('/x'); } catch (e) { thrown = e; } }
  ok('F-41.27: a non-JSON failure still throws with the status line and code null', !!thrown && thrown.status === 500 && thrown.code === null && /failed: 500/.test(thrown.message));
  globalThis.fetch = savedFetch; delete globalThis.window;
  const adm2 = strip(read(ADMIN));
  ok('F-41.27: the queue maps the door\'s codes to the founder\'s words (peer_already_has → pick another) and shows them in the toast', /peer_already_has:\s*'She already has this vendor/.test(adm2) && (adm2.match(/refusalText\(e\)/g) || []).length === 2);
  // F-41.28
  ok('F-41.28: no `Rs ${rs(` or `Rs {rs(` remains — formatRs carries the prefix', !/Rs \$\{rs\(|Rs \{rs\(/.test(adm2) && /formatRs already carries/.test(read(ADMIN)));
  // F-41.29 — the sheet reads her latest on mount and opens on S2
  const sheet2 = strip(read(SHEET));
  ok('F-41.29: the sheet fetches her latest request on mount and enters the sent state when one exists', /fetchMyAssistance\(\)/.test(sheet2) && /setState\('sent'\)/.test(sheet2) && /apiGet<AssistMine>\('\/api\/v2\/couple\/assistance'\)/.test(strip(read(CAPI))));
  ok('F-41.29: S2 names TDW vendors found (#25/#27) with a /v/ link and shows outsiders as an unnamed row (#28/#29); no count of who was asked (#30/#31 struck)', /\/v\/\$\{f\.routing_handle\}/.test(sheet2) && sheet2.includes("foundSoFar: 'Found so far'") && sheet2.includes("notOnTdw:   'Not on TDW yet'") && !/Two more|'Asked'/.test(sheet2));
  // Open: N
  const lay = strip(read('app/admin/layout.tsx'));
  ok('Open: N — the Assistance nav entry carries counts.open from the queue door, rendered only when > 0', /useOpenAssistanceCount/.test(lay) && /\/api\/v2\/admin\/assistance\?limit=200/.test(lay) && /count=\{s\.path === '\/admin\/assistance' \? openAssist : null\}/.test(lay) && /typeof count === 'number' && count > 0/.test(lay));
}

section('§8 · COPY LAW · WALLET LAW');
const chrome = [POPUP, SHEET, ADMIN, MERID, SETT, CAPI, AAPI].map(f => strip(read(f))).join('\n');
ok('no persona name in any new chrome string (Meridian only as the existing room title)', !/Victor|Donna|Harvey|Mira\b|Eliza/.test(chrome) && (mer.match(/>Meridian</g) || []).length === 1);
{
  // Scoped to STRING LITERALS in the NEW files (SVG path data in the existing rooms
  // carries `2L11`-shaped runs that are not money; the first cut convicted them).
  const lits = [POPUP, SHEET, ADMIN, CAPI, AAPI].map(f => (strip(read(f)).match(/'[^'\n]*'|"[^"\n]*"/g) || []).join('\n')).join('\n');
  ok('no rupee glyph, no K/L/Cr shorthand in any new rendered string', !/\u20b9|\b\d+\s*[KkLl]\b|\bCr\b/.test(lits) && !/\u20b9/.test(chrome));
}
ok('typographic apostrophes in couple-facing bytes (R-40.19)', !/'[A-Za-z ]+'[^\\]*[a-z]'[a-z]/.test(sheet.match(/const S = \{[\s\S]*?\};/)?.[0] || "x'y") );

console.log(`\n${fail ? 'RED' : 'GREEN'} — b20_a3_assistance_pwa ${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
