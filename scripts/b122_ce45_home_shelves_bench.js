#!/usr/bin/env node
// scripts/b122_ce45_home_shelves_bench.js · TDW CE-45 · FE-1 · HOME AND SHELVES · cut one.
// Rung b122 (the estate's one line of rung numbers across both repos: b120 FE_1, b121 SRV_1).
//
// WHAT IT PINS, EACH AGAINST THE RULING IT CAME FROM
//  §1 THE FOUNDER'S BYTES, BY HASH (R-45.19, R-45.20, his copy table of 24 Sept 2026): the right
//     tab reads Home; the three shelf names; the pinned heading and the change control; the four
//     group names and their rows; the 29 one-line descriptions. Each is read from its ONE home by
//     running the real module, never by a regex on its source. Plus the R-45.20 register: no
//     her, his or you, "your" only in the row he ruled ("Your own WhatsApp number"), no persona.
//  §2 THE LAYOUT (BS-1 close; R-45.19; q3; P3; P5): the three shelves exactly; at most six rows;
//     every registry room and every hub row reachable from Rooms; each route exactly ONCE as a
//     row, save the two R-45.19 put in two places, which resolve to ONE route each; every row in
//     exactly one group; Coming stays Coming; the ROOM_HREFS / PREVIEW_KEYS move.
//  §3 THE PINS (P1(b), q1, q2; the founder's T1 to T11): the default six; the ten trade rows; every
//     pin resolves to one existing route, none Coming, none a room ruled not pinnable; the trade
//     tokens are the server's eleven (dream-os src/agent/categories.js, the sibling tree).
//  §4 THE REAL SURFACES in headless Chromium, both themes (C-43.18), by b120's method: the landing
//     stays Rooms (P5); Rooms draws the top pair in the metal and the three shelves; the hub draws
//     four groups with their chips; Home draws Today's own surface ABOVE the six pins for each
//     trade, the fallback on a failed read, the stated disabled change control; a pin opens its
//     room; the dock keeps its words and its place above the tabs on every surface.
//
// SHIFTED CLOCKS (C-44.13): `--clock <ISO>` shifts the browser's clock for the whole run. The
// delivery's record runs it at now, the next day in IST, a day months ahead across a year's end
// and a leap day. No cell names "today"; Home's masthead date is read and must be non-empty.
//
// usage: node scripts/b122_ce45_home_shelves_bench.js [--clock ISO] [--no-browser-ok]
// Exit 0 only when every cell passes. A missing browser is RED (C-43.18), not skipped.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');
const { spawn, spawnSync } = require('child_process');
const ts = require('typescript');

const ROOT = path.join(__dirname, '..');
const P = (rel) => path.join(ROOT, rel);
const read = (rel) => fs.readFileSync(P(rel), 'utf8');
const h16 = (s) => crypto.createHash('sha256').update(String(s)).digest('hex').slice(0, 16);
const argClock = (() => { const i = process.argv.indexOf('--clock'); return i > 0 ? process.argv[i + 1] : null; })();

// ── A-45.6 / F-44.160 (CE-45 FE-2, TYPE_1b) · THIS RUN KEEPS ITS OWN RECORD ──────────────────────
// scripts/run-floor.sh runs every bench with its output sent to /dev/null (:296-297) and keeps only the
// exit code, so a red inside a floor could never name its cell. Every line this bench prints is also
// written to b122-last-run.log in the temp dir; after a floor, that file says which cell and why.
const RUNLOG = path.join(os.tmpdir(), 'b122-last-run.log');
try { fs.writeFileSync(RUNLOG, `b122 · ${new Date().toISOString()} · root ${path.join(__dirname, '..')}\n`); } catch (_e) { /* the run still runs */ }
{ const out = console.log.bind(console); console.log = (...a) => { out(...a); try { fs.appendFileSync(RUNLOG, a.join(' ') + '\n'); } catch (_e) { /* unwritable tmp */ } }; }

let pass = 0; let fail = 0; const failed = [];
function ok(cond, name, info) {
  if (cond) { pass += 1; console.log(`  PASS  ${name}`); }
  else { fail += 1; failed.push(name); console.log(`  FAIL  ${name}${info !== undefined ? '  [' + String(info).slice(0, 300) + ']' : ''}`); }
}
function cell(name, fn) {
  let r; try { r = fn(); } catch (e) { ok(false, name, 'threw: ' + String(e && e.message).split('\n')[0]); return; }
  if (r === true) ok(true, name); else ok(false, name, r === false ? undefined : r);
}
const sec = (t) => console.log(`\n§${t}`);
const chk = cell;   // a browser cell: same harness, so a thrown read is one RED cell, never an aborted section

// THE REAL MODULES, transpiled and run (b120's loadTs, with the '@/' alias resolved into the tree).
const cache = new Map();
function loadTs(rel) {
  if (cache.has(rel)) return cache.get(rel).exports;
  const out = ts.transpileModule(read(rel), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, jsx: ts.JsxEmit.React } }).outputText;
  const mod = { exports: {} };
  cache.set(rel, mod);
  new Function('require', 'module', 'exports', out)((spec) => {
    if (spec.startsWith('@/')) {
      const base = spec.slice(2);
      for (const ext of ['.ts', '.tsx']) if (fs.existsSync(P(base + ext))) return loadTs(base + ext);
    }
    return require(spec);
  }, mod, mod.exports);
  return mod.exports;
}

// ── THE RULINGS, AS THE FOUNDER AND THE CHAIR GAVE THEM (typed here as the second witness) ──
const RULED_SHELVES = {
  business: ['room:leads', 'room:clients', 'room:packages', 'room:calendar', 'room:events', 'room:notes'],
  money: ['room:invoices', 'room:expenses', 'room:books', 'room:tds', 'row:contracts', 'row:reminders'],
  studio: ['room:portfolio', 'room:team', 'room:couture', 'room:advisor', 'room:billing', 'room:settings'],
};
const RULED_TOP = ['support', 'storefront'];
// HOME_2 · RE-PINNED BY LABEL, R-45.21 (the founder, walking HOME_1: "work together should be at the
// top. then get fonud get booked etc."): Work together leads; names and rows unchanged.
const RULED_GROUPS = [
  ['Work together', ['collabs']],
  ['Get found', ['website', 'wedding_pages', 'google', 'posts']],
  // AMENDED BY LABEL · CE-45 IGD-1 cut 1b · R-45.28: the founder moved "WhatsApp and Instagram" to the head of Get booked.
  ['Get booked', ['number', 'dates', 'introductions', 'referrals']],
  ['Get paid', ['contracts', 'reminders']],
];
// HOME_2 · R-45.21: THE 29 DRAWINGS OF THE APPROVED MOCK, sha256 of each <symbol>'s inner markup as it
// stands in TDW_CE45_FE1_MOCK_PINS_TOP_AND_ICONS.html (sha256 a0f8de82298867fef84daf370f4ec9f06f57baec48573735fc0db92d9e81ac63).
// A later edit to any drawing is a fresh veto: it reddens 5.2.
const MOCK_SHA = 'a0f8de82298867fef84daf370f4ec9f06f57baec48573735fc0db92d9e81ac63';
const H_ICON = {
  support: '95e1197a1f2dca1f7fb031249d762260970815e62ec6c68c11a82fb29da0b9e2',
  storefront: 'e5ea1b923a5558b98a2a677a5771b5662bee513d0dc906ee06fb8a3748ea5a02',
  leads: '059e2c68b6403cdc66ab566b40bccb5f9350f7fb7c9d9237b03a5d619b931b5a',
  clients: '1bda18d47fb8fa44cd53d93049a92c957849a4e21d0a36fb5c5e718c3a1c0a4b',
  packages: 'bf2e84808cbba705a411d12ecfcf949404b8af536142ce72f2054c09927ab621',
  calendar: 'b38e3c9c52383b6c5d4460f0f8cb6d1aeb99497086367135f671dde91ca2de3e',
  events: 'dd934037f2a933add04b608e3eea1d8401bf8c88650334a8668fe9738731767a',
  notes: 'abe2523d3b769abc29e177313b4bb5a341972b44fb5d6c1748d97fd9fa2f1399',
  invoices: 'fe874e16e1972338364a03ea79a196173b0b9a4089bd0125fcb4df6d4118469c',
  expenses: 'f842630509e70f7831e394d1dfd8726b70a9957a87b57a9318fda0b12af8eeed',
  books: '1e23399f4e6de0794bbb4a186873b9ba751bcde0e8e2840f0ecbf4f316b1d9b2',
  tds: 'a7bfcf0c4bca8cebc440c6045f820292a76ede34c1114a07c58a52ccf1503dd7',
  portfolio: '746a7d34ac66f01aa75f9c2cbfb02f6fbb27b29621b70536479183f83478cbca',
  team: '802c5e7c0dfb23026bfe3fdb54b74a1beb4ba824e3c537ccf3efcafb1cdb6876',
  couture: '2792e2f62ef39ed8c8aca47f0deebe65d06a6e506c340fd0172dafae82313baa',
  advisor: '0ed62f224940bf4a5b3c1a21688c47f5e3ad00ffc8a82c6503a56d1a0006d4f2',
  billing: 'd423fd49e9a60fba3aa0c258d7dbfd90e77f36cf1f7d6433ef5309c5aac607e5',
  settings: '9b7b6a36015263ccb673db74f470b77122b91dd696051c4986b8e706cfd60688',
  website: 'cb08d5f0aeb05bfbc1b35d57fcaaa8179df60a701549a2b12988e838336fc513',
  wedding_pages: '59a2b055f42da5ceeb06229ce707f5c805e2d7cd2a68fb3a926dc6f1a1cdc11d',
  google: 'd0276301a79248f9438b39c2b9ced71907f889b70bced4c1085666914433b147',
  posts: '78db92c3c05a27402fcc5198d16d18f02bdfefeb846ef781ee4bdf5895176d22',
  dates: 'e427bc72f8e4db09bcaabafcd08336b9e0b8d4bb4882dae6cd285d630389a920',
  introductions: 'ee5503b6ad5892d84ba7c1b27ec1adf22afd80df257b7772d575e395ed58b08d',
  referrals: '5fdbd227ab44385f83fbc7be582ab0ec6c6d45b29e94771975f61535967cff4a',
  // AMENDED BY LABEL · CE-45 IGD-1 cut 1 · R-45.27 A4 and F-44.164: the two-bubble drawing; was 155795480dbae672... (a handset in a bubble).
  number: '1b6519c8f964bef9129cd637b8cdb605f0b3913d294656d5bef8f58e885fd73b',
  contracts: 'e4b2ab227c6fc8fb26bcb9a807c8e91436ba2bd25637f164e4bc21fbb0e0160e',
  reminders: '980c5f803af7a01665d60cfb20eb6d1318b26fbbeecc87f179f41c93ee3f3632',
  collabs: 'aa200749cd30e7a8ed4717d04996836778a5de8e9e525ed606c14245bb5d1f32',
};
const RULED_DEFAULT = ['room:leads', 'room:calendar', 'room:clients', 'room:invoices', 'row:posts', 'room:storefront'];
const RULED_TRADE = {
  planning: ['room:leads', 'room:calendar', 'room:clients', 'room:events', 'room:team', 'room:invoices'],
  designer: ['room:leads', 'room:couture', 'room:clients', 'room:calendar', 'room:invoices', 'room:storefront'],
  photography: ['room:leads', 'room:calendar', 'room:clients', 'room:invoices', 'room:portfolio', 'row:wedding_pages'],
  makeup: ['room:leads', 'room:calendar', 'room:clients', 'room:invoices', 'row:posts', 'room:portfolio'],
  hairstylist: ['room:leads', 'room:calendar', 'room:clients', 'room:invoices', 'row:posts', 'room:portfolio'],
  jewellery: ['room:leads', 'room:clients', 'room:packages', 'room:invoices', 'room:storefront', 'row:posts'],
  decor: ['room:leads', 'room:calendar', 'room:events', 'room:team', 'room:invoices', 'room:portfolio'],
  venue_catering: ['room:leads', 'room:calendar', 'room:packages', 'room:events', 'room:invoices', 'room:expenses'],
  performer: ['room:leads', 'room:calendar', 'room:clients', 'room:invoices', 'row:posts', 'room:portfolio'],
  content_creator: ['room:leads', 'row:posts', 'row:collabs', 'room:calendar', 'room:invoices', 'room:portfolio'],
};
// The founder's bytes (24 Sept 2026), sha256 first 16 hex, carried so a later edit is a fresh veto.
// REPAIR r4 (FE-1, CE-45): D18 is carried with the TYPOGRAPHIC apostrophe (U+2019), the estate's
// shipped-byte law (R-40.57, b40 C102); the founder's words are unchanged, only the glyph is the estate's.
const H_COPY = { navToday: '3a78695388b38b5c', shelfBusiness: '76f68a75f01ed76f', shelfMoney: '5ccc2e8715d7a17c', shelfStudio: '0aa91af2ec4c1fd7', pinnedHead: '57c2c20d41e6bf16', pinnedChange: 'c564d6151af0b34b' };
const H_ROOM = { support: '81e50b18d2c0ea43', storefront: 'c9529003140a13d9', leads: '6ed99453447975d5', clients: '147ff67b902f0f8b', packages: '5ac4004541fc2013', calendar: 'ace4802cba166d27', events: '44ab8773647cf1af', notes: 'db19c49f8f6a2603', invoices: '5520f77a5ac7e0ec', expenses: 'd52a337c2f297d01', books: 'c2bebc4c8b046867', tds: 'cfc775545be4eda7', portfolio: 'c770d4b25db5b741', team: '8fdce67cbb74c589', couture: '5ec5b4c55960ce39', advisor: '3263e80df03c3bf4', billing: 'ac9b262fbde97683', settings: '28421eb441a5d5da' };
const H_ROW = { website: 'b1291bdf51d0a58e', wedding_pages: '5802fa27fb15736d', google: '3829cc50cbae2d22', posts: 'f70c5ccaa24633ad', dates: 'becc2a75a6f041a1', introductions: '03b8eb501bbce215', referrals: '5e8933c42ebd55f6', number: 'b4153dd868095658' /* AMENDED BY LABEL · IGD-1 cut 1 · R-45.27 A3; was 9c6c97a21614e055 (D28) */, contracts: 'b2be845480024cae', reminders: '24716217a180687d', collabs: '4ba555d36b7a7487' };

const tag = (i) => ('room' in i ? 'room:' + i.room : 'row:' + i.row);
const untag = (t) => (t.startsWith('room:') ? { room: t.slice(5) } : { row: t.slice(4) });
// AMENDED BY LABEL (FE-1, build turn, from the red-at-base run): every EXPECTED value in §4 is
// built from the RULING above or the founder's hashes, never from the tree under test. The first
// cut built 4.2d's expectation from the tree's own SHELVES, which is empty at the base, so an
// empty page matched an empty ruling and the cell passed hollow; 4.2a compared the tab to the
// tree's own navToday, whatever it said. Both were caught at 24923aa and are cured here.

(async () => {
  let R, RT, WC, SC; let IC = null; // HOME_2: lib/worklist/icons.ts
  sec('1  the founder\u2019s bytes, from their one home (R-45.19, R-45.20)');
  try { IC = loadTs('lib/worklist/icons.ts'); } catch (_e) { IC = null; }
  try { R = loadTs('lib/worklist/rooms.ts'); RT = loadTs('lib/solutions/routes.ts'); WC = loadTs('lib/worklist/copy.ts'); SC = loadTs('lib/solutions/copy.ts'); }
  catch (e) { ok(false, '1.0 the four modules load', e.message); }
  R = R || {}; RT = RT || {}; WC = WC || {}; SC = SC || {};
  const C = WC.COPY || {};
  cell('1.1 the right tab reads Home, by the kept key (N0); the left still Rooms', () =>
    (h16(C.navToday) === H_COPY.navToday && C.navRooms === 'Rooms') || `navToday=${C.navToday}`);
  cell('1.2 the shelf names, the pinned heading and the change control are his bytes (N1 to N3, N8, N9)', () => {
    const bad = ['shelfBusiness', 'shelfMoney', 'shelfStudio', 'pinnedHead', 'pinnedChange'].filter((k) => h16(C[k]) !== H_COPY[k]);
    return bad.length === 0 || 'moved: ' + bad.join(',');
  });
  cell('1.3 the four group names and their rows, in the ruled order (N4 to N7; q3)', () => {
    const got = (SC.HUB_GROUPS || []).map((g) => [g.name, [...g.keys]]);
    return JSON.stringify(got) === JSON.stringify(RULED_GROUPS) || JSON.stringify(got);
  });
  cell('1.4 the eighteen room lines are his bytes (D1 to D12, D15 to D20), one home each', () => {
    const d = WC.ROOM_DESC || {};
    const bad = Object.keys(H_ROOM).filter((k) => h16(d[k]) !== H_ROOM[k]);
    const extra = Object.keys(d).filter((k) => !(k in H_ROOM));
    return (bad.length === 0 && extra.length === 0) || `moved ${bad.join(',')} extra ${extra.join(',')}`;
  });
  cell('1.5 the eleven row lines are his bytes (D13, D14, D21 to D29), one home each', () => {
    const d = SC.ROW_DESC || {};
    const bad = Object.keys(H_ROW).filter((k) => h16(d[k]) !== H_ROW[k]);
    const extra = Object.keys(d).filter((k) => !(k in H_ROW));
    return (bad.length === 0 && extra.length === 0) || `moved ${bad.join(',')} extra ${extra.join(',')}`;
  });
  // AMENDED BY LABEL · CE-45 IGD-1 cut 1 · R-45.27: D28 ("Your own WhatsApp number...") retired with the row's old name, so the one
  // "your" exception retires with it and the cell TIGHTENS: no line may say "your" now.
  cell('1.6 R-45.20 register: no her, his, you or your; no persona name', () => {
    const all = [...Object.entries(WC.ROOM_DESC || {}), ...Object.entries(SC.ROW_DESC || {})];
    if (all.length !== 29) return 'lines ' + all.length;
    const bad = all.filter(([k, v]) => /\b(her|his|you)\b/i.test(v) || /\byour\b/i.test(v) || /\b(Victor|Donna|Harvey)\b/.test(v));
    return bad.length === 0 || bad.map(([k]) => k).join(',');
  });

  sec('2  the layout (BS-1 close; R-45.19; q3; P3)');
  const SH = R.SHELVES || [];
  cell('2.1 the three shelves hold exactly the ruled rows, Money six with Contracts and Reminders (R-45.19)', () => {
    const got = Object.fromEntries(SH.map((s) => [s.id, s.items.map(tag)]));
    return JSON.stringify(got) === JSON.stringify(RULED_SHELVES) || JSON.stringify(got);
  });
  cell('2.2 no shelf holds more than six rows', () => SH.length === 3 && SH.every((s) => s.items.length <= 6));
  cell('2.3 the top pair is Business Solutions then Storefront, read from the headline ruling (a control: R-40.98 predates the cut, green at the base)', () =>
    JSON.stringify([...(R.HEADLINE_TILES_EXPECTED || [])]) === JSON.stringify(RULED_TOP));
  const reach = () => {
    const items = [...RULED_TOP.map((id) => ({ room: id })), ...SH.flatMap((s) => s.items), ...(SC.HUB_GROUPS || []).flatMap((g) => g.keys.map((k) => ({ row: k })))];
    return items.map((i) => ({ t: tag(i), href: RT.itemHref(i) }));
  };
  cell('2.4 every registry room and every Business Solutions row is reachable from Rooms', () => {
    const hrefs = new Set(reach().map((x) => x.href));
    const rooms = (R.ROOMS || []).filter((r) => !hrefs.has(r.href)).map((r) => r.id);
    const rows = Object.entries(RT.ROOM_HREFS || {}).filter(([, v]) => !hrefs.has(v)).map(([k]) => k);
    return (R.ROOMS.length === R.ROOM_COUNT_EXPECTED && rooms.length === 0 && rows.length === 0) || `unreachable rooms ${rooms} rows ${rows}`;
  });
  cell('2.5 each route is one row, save the two R-45.19 placed twice, which resolve to ONE route each', () => {
    const count = {}; for (const x of reach()) count[x.href] = (count[x.href] || 0) + 1;
    const twice = Object.keys(count).filter((k) => count[k] === 2).sort();
    const want = [RT.ROOM_HREFS.contracts, RT.ROOM_HREFS.reminders].sort();
    const more = Object.keys(count).filter((k) => count[k] > 2);
    return (JSON.stringify(twice) === JSON.stringify(want) && more.length === 0) || `twice ${twice} more ${more}`;
  });
  cell('2.6 every row sits in exactly one group', () => {
    const keys = (SC.HUB_GROUPS || []).flatMap((g) => [...g.keys]);
    const all = SC.ROOM_ROWS.map((r) => r.key);
    return (keys.length === all.length && all.every((k) => keys.filter((x) => x === k).length === 1)) || keys.join(',');
  });
  // AMENDED BY LABEL · IGD-1 cut 1 · R-45.27: the name only; the key 'number' and its Coming are unchanged.
  cell('2.7 Coming stays Coming: Open dates & rates and WhatsApp and Instagram, and no shelf row is Coming', () =>
    (JSON.stringify([...RT.PREVIEW_KEYS].sort()) === '["dates","number"]' && SH.every((s) => s.items.every((i) => !RT.itemComing(i)))) || [...RT.PREVIEW_KEYS]);
  cell('2.8 the move: ROOM_HREFS and PREVIEW_KEYS live in lib/solutions/routes.ts, and the hub page declares neither', () => {
    const page = read('app/vendor/(shell)/support/page.tsx');
    return (!/const\s+(ROOM_HREFS|PREVIEW_KEYS)\b/.test(page) && /export const ROOM_HREFS\b/.test(read('lib/solutions/routes.ts')) && /export const PREVIEW_KEYS\b/.test(read('lib/solutions/routes.ts'))) || 'not moved';
  });
  cell('2.9 the retired band constants are gone from the registry (A-45.2); the room count stands at 20', () => {
    const src = read('lib/worklist/rooms.ts');
    return (!/export const (GRID_TILE_COUNT_EXPECTED|TOP_BAND_EXPECTED|BOTTOM_BAND_EXPECTED)\b/.test(src) && R.ROOM_COUNT_EXPECTED === 20) || 'still declared';
  });

  sec('3  the pins (P1(b); q1; q2; the founder\u2019s T1 to T11)');
  const known = (i) => RT.itemKnown(i);
  const pinnable = (i) => !('room' in i) || ((R.ROOMS || []).find((r) => r.id === i.room) || {}).pinnable === true;
  const setOk = (set, label) => {
    const bad = set.filter((i) => !known(i) || RT.itemComing(i) || !pinnable(i)).map(tag);
    const hrefs = set.map(RT.itemHref);
    if (set.length !== 6) return `${label}: ${set.length} pins`;
    if (new Set(hrefs).size !== 6) return `${label}: a route pinned twice`;
    return bad.length === 0 || `${label}: ${bad.join(',')}`;
  };
  cell('3.1 the default six are the ruled mock\u2019s, in the one home (q1)', () =>
    JSON.stringify((R.DEFAULT_PINS || []).map(tag)) === JSON.stringify(RULED_DEFAULT) || (R.DEFAULT_PINS || []).map(tag).join(','));
  cell('3.2 the ten trade rows are the founder\u2019s T1 to T10', () => {
    const got = Object.fromEntries(Object.entries(R.TRADE_PINS || {}).map(([k, v]) => [k, v.map(tag)]));
    return JSON.stringify(got) === JSON.stringify(RULED_TRADE) || JSON.stringify(Object.keys(got));
  });
  cell('3.3 every pin set: six known routes, none Coming, none a room ruled not pinnable, none twice', () => {
    for (const [k, v] of Object.entries({ default: R.DEFAULT_PINS, ...(R.TRADE_PINS || {}) })) { const r = setOk([...v], k); if (r !== true) return r; }
    return true;
  });
  cell('3.4 other, empty, null and an unknown token all fall to the default six (T11; P1(b))', () =>
    ['other', '', null, undefined, 'zz_unknown', 'toString', '__proto__'].every((c) => R.pinsForTrade(c) === R.DEFAULT_PINS));
  cell('3.5 the trade tokens are the server\u2019s eleven (sibling dream-os src/agent/categories.js)', () => {
    const f = path.join(ROOT, '..', 'dream-os', 'src', 'agent', 'categories.js');
    if (!fs.existsSync(f)) return 'sibling dream-os not present at ../dream-os (R-38.20b)';
    const server = [...require(f).VENDOR_CATEGORIES].sort();
    const ours = [...Object.keys(R.TRADE_PINS || {}), 'other'].sort();
    return JSON.stringify(server) === JSON.stringify(ours) || `server ${server} ours ${ours}`;
  });

  sec('3b the icons (R-45.21; the chair\u2019s (b)(i)), one registry, the approved mock\u2019s bytes');
  const SHOWN = [...RULED_TOP, ...Object.values(RULED_SHELVES).flat().map((t) => t.split(':')[1]), ...RULED_GROUPS.flatMap(([, ks]) => ks)];
  const SHOWN_KEYS = [...new Set(SHOWN)];
  cell('5.1 the registry holds exactly the 29 keys shown on Rooms and Business Solutions, no more', () => {
    if (!IC || !IC.ROOM_ICONS) return 'lib/worklist/icons.ts does not load';
    const got = Object.keys(IC.ROOM_ICONS).sort(); const want = SHOWN_KEYS.slice().sort();
    return (want.length === 29 && JSON.stringify(got) === JSON.stringify(want)) || JSON.stringify({ got: got.length, want: want.length, missing: want.filter((k) => !got.includes(k)), extra: got.filter((k) => !want.includes(k)) });
  });
  cell('5.2 every drawing is the approved mock\u2019s, byte for byte (29 sha256 carried; mock ' + MOCK_SHA.slice(0, 12) + ')', () => {
    if (!IC || !IC.ROOM_ICONS) return 'no registry';
    const bad = Object.keys(H_ICON).filter((k) => crypto.createHash('sha256').update(String(IC.ROOM_ICONS[k])).digest('hex') !== H_ICON[k]);
    return (Object.keys(H_ICON).length === 29 && bad.length === 0) || 'drifted: ' + bad.join(',');
  });
  cell('5.3 the icon component draws nothing but the registry\u2019s constants (no other markup path)', () => {
    const src = fs.readFileSync(P('components/worklist/RoomIcon.tsx'), 'utf8');
    const uses = src.match(/dangerouslySetInnerHTML/g) || [];
    if (uses.length !== 1) return 'RoomIcon has ' + uses.length + ' markup sinks, ruled one';
    if (!/dangerouslySetInnerHTML=\{\{ __html: ROOM_ICONS\[k\] \}\}/.test(src)) return 'the one sink is not ROOM_ICONS[k]';
    if (!/\{ k: IconKey; className: string \}/.test(src)) return 'k is not typed IconKey, or the props admit more than k and className';
    // and no registry string is typed anywhere else in the tree's code
    const files = spawnSync('git', ['ls-files', 'app', 'components', 'lib'], { cwd: ROOT, encoding: 'utf8' }).stdout.split('\n').filter((f) => /\.(tsx?|jsx?|mjs)$/.test(f) && f !== 'lib/worklist/icons.ts');
    const extra = []; for (const f of files) { const t = fs.readFileSync(P(f), 'utf8'); for (const [k, v] of Object.entries(IC.ROOM_ICONS)) if (t.includes(v)) extra.push(f + ':' + k); }
    return extra.length === 0 || 'a drawing is typed outside the registry: ' + extra.join(', ');
  });
  let ICONS_FILE = null;
  if (IC && IC.ROOM_ICONS) { ICONS_FILE = path.join(os.tmpdir(), 'b122_icons.json'); fs.writeFileSync(ICONS_FILE, JSON.stringify(IC.ROOM_ICONS)); }
  const oneIcon = (o, key, list) => (Array.isArray(list) && list.length === 1 && list[0].k === key && !!o.canon && list[0].html === o.canon[key]);

  // --static (FE-1, CE-45 differential turn): sections 1 to 3 only, for the production mutations,
  // whose claims all live there. NEVER a delivery run: the line printed below says which kind this
  // was, so a static green cannot pass for a full one. (Re-added: the severed turn removed it,
  // taking it for a second writer's; the founder confirmed it was this seat's own.)
  if (process.argv.includes('--static')) {
    console.log(`\nb122 (STATIC, sections 1-3 only, not a delivery run): ${pass} passed, ${fail} failed${fail ? '\n  ' + failed.join('\n  ') : ''}`);
    process.exit(fail ? 1 : 0);
  }
  sec('4  the real surfaces, both themes (C-43.18)' + (argClock ? `  · clock ${argClock}` : ''));
  const PORT = 3991;
  const SHOTS = path.join(os.tmpdir(), 'b122_shots');
  const clockMs = argClock ? Date.parse(argClock) : null;
  if (argClock && !Number.isFinite(clockMs)) { ok(false, '4.0 the --clock value parses', argClock); }
  // REPAIR r2 (FE-1, CE-45 e-100): A SERVER ALREADY ON THE PORT IS A STOP, NOT A HOST. The severed
  // run left a detached next dev on this port serving the BASE worktree; the next run's own server
  // could not bind, up() answered from the stranger, and the dark pass walked the base app while
  // the tree on disk was cured. A walk of the wrong tree is the worst kind of red or green, so the
  // port must be silent BEFORE this bench starts its own server, and the cell says so by name.
  const portBusy = await fetch(`http://localhost:${PORT}/`).then(() => true, () => false);
  ok(!portBusy, '4.0 the port is free before this bench starts its own server (no stale server walked)', portBusy ? `something already answers on ${PORT}` : '');
  if (portBusy) { console.log(`\nb122: ${pass} passed, ${fail} failed`); process.exit(1); }
  // ── F-44.160 (CE-45 FE-2, TYPE_1b) · THE START, HARDENED ─────────────────────────────────────────
  // WITNESSED IN THE SEAT'S CONTAINER: Next 16 refuses a second `next dev` in one directory ("Another
  // next dev server is already running") and nothing then answers on the second port. In the floor,
  // b120 runs just before this bench, in the same root, and exits without waiting for its server to die;
  // on a loaded two-core Codespace that server can still hold the root when this one starts. So:
  // (1) the server's output is kept in a log, and a server that never answers prints its last lines;
  // (2) A-45.5: the root's .next/dev is cleared before a start;
  // (3) the start waits (bounded) until no other next dev holds this root, and a start that does not
  //     answer is retried ONCE, the retry printed as a line of the run, never silent.
  const devLog = path.join(os.tmpdir(), `b122-dev-${PORT}.log`);
  const rootDevs = () => {
    const r = spawnSync('ps', ['-eo', 'pid,args'], { encoding: 'utf8' });
    return String(r.stdout || '').split('\n').map((l) => l.trim().split(/\s+/)).filter((w) => w.length > 1 && /next(\s+dev\b|-server)/.test(w.slice(1).join(' ')))
      .map((w) => Number(w[0])).filter((pid) => { if (pid === process.pid) return false; try { return fs.realpathSync(`/proc/${pid}/cwd`) === fs.realpathSync(ROOT); } catch (_e) { return false; } });
  };
  const waitRootFree = async (ms) => { for (let t = 0; t < ms; t += 1000) { if (!rootDevs().length) return true; await new Promise((r) => setTimeout(r, 1000)); } return !rootDevs().length; };
  const answers = async (port, secs) => {
    for (let i = 0; i < secs; i += 1) {
      try { const r = await fetch(`http://localhost:${port}/`); if (r) return true; } catch (_e) { /* not yet */ }
      await new Promise((r) => setTimeout(r, 1000));
    }
    return false;
  };
  // A-45.5's clear happens ONLY when this root is free: the seat's own control showed that clearing
  // .next/dev under a running server deletes its lock, and a second server then starts beside it.
  const spawnDev = (port, log, clear = true) => {
    if (clear && !rootDevs().length) { try { fs.rmSync(path.join(ROOT, '.next', 'dev'), { recursive: true, force: true }); } catch (_e) { /* nothing to clear */ } }
    const fd = fs.openSync(log, 'w');
    const d = spawn('npx', ['--no-install', 'next', 'dev', '-p', String(port)], {
      cwd: ROOT, stdio: ['ignore', fd, fd], detached: true,
      env: { ...process.env, NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${port}/__api` },
    });
    fs.closeSync(fd);
    return d;
  };
  const tail = (log) => { try { return fs.readFileSync(log, 'utf8').replace(/\x1b\[[0-9;?]*[a-zA-Z]/g, '').split('\n').filter(Boolean).slice(-25).join('\n'); } catch (_e) { return '(no log)'; } };
  // killDev: the WHOLE tree goes, and the bench waits until it has. (FE-2, this turn: the first form
  // signalled only npx's process group and waited on npx's pid; the next-server child it had spawned
  // outlived it, still holding the root, which is the very hazard F-44.160 names, left for the NEXT
  // bench in the floor. Witnessed: a blocker on 3989 alive after this bench exited green.)
  const treeOf = (root) => {
    const rows = String(spawnSync('ps', ['-eo', 'pid,ppid'], { encoding: 'utf8' }).stdout || '').split('\n').slice(1)
      .map((l) => l.trim().split(/\s+/).map(Number)).filter((r) => r.length === 2 && r[0]);
    const out = [root]; for (let k = 0; k < out.length; k += 1) for (const [pid, ppid] of rows) if (ppid === out[k] && !out.includes(pid)) out.push(pid);
    return out;
  };
  const alive = (pid) => { try { process.kill(pid, 0); return true; } catch (_e) { return false; } };
  const killDev = async (d) => {
    if (!d) return;
    const tree = treeOf(d.pid);
    try { process.kill(-d.pid, 'SIGTERM'); } catch (_e) { /* gone */ }
    for (const pid of tree) { try { process.kill(pid, 'SIGTERM'); } catch (_e) { /* gone */ } }
    for (let t = 0; t < 20 && tree.some(alive); t += 1) await new Promise((r) => setTimeout(r, 1000));
    for (const pid of tree.filter(alive)) { try { process.kill(pid, 'SIGKILL'); } catch (_e) { /* gone */ } }
    for (let t = 0; t < 10 && tree.some(alive); t += 1) await new Promise((r) => setTimeout(r, 500));
  };
  async function startDev({ retry = true, wait = true, secs = 150 } = {}) {
    if (wait && !(await waitRootFree(60000))) console.log(`  NOTE  another next dev still holds ${ROOT} after 60s; starting anyway (pids ${rootDevs().join(', ')})`);
    let d = spawnDev(PORT, devLog);
    if (await answers(PORT, secs)) return d;
    console.log(`  NOTE  F-44.160: the dev server on ${PORT} did not answer in ${secs}s; its last lines:\n${tail(devLog)}`);
    await killDev(d);
    if (!retry) return null;
    console.log('  NOTE  F-44.160: RETRY, starting it once more after the root is free');
    await waitRootFree(60000);
    d = spawnDev(PORT, devLog);
    if (await answers(PORT, secs)) return d;
    console.log(`  NOTE  F-44.160: the retry did not answer either; its last lines:\n${tail(devLog)}`);
    await killDev(d);
    return null;
  }

  // (4) THE CONTROL, proven every run: with another next dev holding the root and the wait and the retry
  // disabled, the start must FAIL, and its own log must say why. A green here proves the mechanism the
  // hardening answers is real on this machine; a red means the control no longer bites.
  {
    const blockLog = path.join(os.tmpdir(), 'b122-dev-blocker.log');
    const blocker = spawnDev(3989, blockLog);
    const blocking = await answers(3989, 150);
    let d0 = null;
    if (blocking) d0 = await startDev({ retry: false, wait: false, secs: 25 });
    const said = /already running/i.test(tail(devLog));
    ok(blocking && d0 === null && said, '4.00 control (F-44.160): with another next dev holding the root, the start fails and its log says why',
      !blocking ? 'the blocker never answered' : d0 ? 'the second server answered: the control no longer bites' : said ? '' : 'no reason in its log: ' + tail(devLog).slice(-200));
    await killDev(d0); await killDev(blocker);
  }
  const dev = await startDev();
  const up = async () => !!dev;
  const probe = (mode, scenario) => {
    const env = { ...process.env }; if (clockMs !== null && Number.isFinite(clockMs)) env.B122_CLOCK = String(clockMs);
    if (ICONS_FILE) env.B122_ICONS = ICONS_FILE;
    const r = spawnSync('node', [P('scripts/lib/b122_home_shelves_probe.mjs'), String(PORT), mode, scenario, SHOTS], { encoding: 'utf8', timeout: 240000, env });
    if (r.status === 3) return { noBrowser: true, text: r.stdout };
    try { return JSON.parse(String(r.stdout).trim().split('\n').pop()); } catch (_e) { return { error: `${r.status} ${String(r.stderr).slice(0, 300)}` }; }
  };
  let browserOk = true;
  const guard = (o, label) => {
    if (o.noBrowser) { ok(false, `${label}: a browser is available (C-43.18). Tried: ${o.text}`); browserOk = false; return false; }
    if (o.error) { ok(false, `${label}: the probe ran`, o.error); return false; }
    if (o.errors && o.errors.length) { ok(false, `${label}: the page raised no error`, o.errors.join(' | ')); return false; }
    return true;
  };
  const ph = C.dockPlaceholder;
  const itemsText = (i) => {
    if ('room' in i) { const r = R.ROOMS.find((x) => x.id === i.room); return { name: r.label, desc: WC.ROOM_DESC[i.room] }; }
    return { name: SC.roomLabel(i.row), desc: SC.ROW_DESC[i.row] };
  };
  const docks = {};
  try {
    if (!(await up())) throw new Error('next dev did not come up');
    await new Promise((r) => setTimeout(r, 5000));
    for (const mode of ['dark', 'light']) {
      if (!browserOk) break;
      for (const k of Object.keys(docks)) delete docks[k];   // each theme reads its own dock
      const land = probe(mode, 'land');
      if (guard(land, `4.1 ${mode}`)) ok(land.chrome && land.chrome.path === '/vendor/rooms', `4.1 ${mode}: the app still lands on Rooms (P5; a control: green at the base)`, land.chrome && land.chrome.path);

      const ro = probe(mode, 'rooms');
      if (guard(ro, `4.2 ${mode}`)) {
        const c = ro.chrome || {}; const rm = ro.rooms || {};
        chk(`4.2a ${mode}: the tabs read Rooms then Home, Home at /vendor/today, Rooms current`, () => {
          const s = c.seats || [];
          return (s.length === 2 && s[0].text === 'Rooms' && s[0].href === '/vendor/rooms' && s[0].current === 'page'
            && h16(s[1].text) === H_COPY.navToday && s[1].href === '/vendor/today' && s[1].current === null) || JSON.stringify(s);
        });
        const top = (rm.top || []).map((t) => [t.key, t.href, t.head]);
        ok(JSON.stringify(top) === JSON.stringify(RULED_TOP.map((id) => [id, R.roomHref(id), true])), `4.2b ${mode}: Business Solutions and Storefront at the very top, marked headline`, JSON.stringify(top));
        ok((rm.top || []).length === 2 && rm.top.every((t) => t.nameColor !== rm.inkColor) && !!rm.metal,
          `4.2c ${mode}: the top pair\u2019s names take the metal, not the shelves\u2019 ink`, JSON.stringify([(rm.top || []).map((t) => t.nameColor), rm.inkColor, rm.metal]));
        chk(`4.2d ${mode}: three shelves, each row its name, its line and its route, as ruled`, () => {
          const HK = { business: H_COPY.shelfBusiness, money: H_COPY.shelfMoney, studio: H_COPY.shelfStudio };
          const want = Object.entries(RULED_SHELVES).map(([id, tags]) => ({ id, label: HK[id],
            rows: tags.map(untag).map((i) => [itemsText(i).name, itemsText(i).desc, RT.itemHref(i)]) }));
          const got = (rm.shelves || []).map((s) => ({ id: s.id, label: h16(s.label), rows: s.rows.map((r) => [r.name, r.desc, r.href]) }));
          return (got.length === 3 && JSON.stringify(got) === JSON.stringify(want)) || JSON.stringify(got).slice(0, 280);
        });
        ok(rm.allTiles === 20 && (rm.shelves || []).every((s) => s.rows.every((r) => !r.coming && r.height >= 44)),
          `4.2e ${mode}: twenty rows on Rooms, none Coming, every one at least 44px tall`, rm.allTiles);
        chk(`4.2g ${mode}: every row and the top pair carry exactly one icon, their own, the registry\u2019s bytes (R-45.21)`, () => {
          const all = [...(rm.top || []), ...((rm.shelves || []).flatMap((x) => x.rows))];
          const bad = all.filter((r) => !oneIcon(ro, r.key, r.icons)).map((r) => r.key + ':' + (r.icons || []).map((i) => i.k).join('+'));
          return (all.length === 20 && bad.length === 0) || JSON.stringify({ n: all.length, bad });
        });
        ok((rm.top || []).length === 2 && rm.top.every((t) => t.icons && t.icons[0] && t.icons[0].color === t.nameColor),
          `4.2h ${mode}: the top pair\u2019s icons take the metal, as their names do`, JSON.stringify((rm.top || []).map((t) => [t.icons && t.icons[0] && t.icons[0].color, t.nameColor])));
        ok(c.title === 'Rooms', `4.2f ${mode}: the title reads Rooms (a control: unchanged by the cut, green at the base)`, c.title);
        docks.rooms = c.dock; docks.roomsSeat = c.seatTop;
      }

      const hb = probe(mode, 'hub');
      if (guard(hb, `4.3 ${mode}`)) {
        const g = (hb.hub || {}).groups || [];
        chk(`4.3a ${mode}: the page draws four groups, every row with its line, its route and its chip (P3)`, () => {
          const want = RULED_GROUPS.map(([n, ks]) => [n, ks.map((k) => [SC.roomLabel(k), H_ROW[k], ['dates', 'number'].includes(k) ? 'coming' : 'open'])]);
          const got = g.map((x) => [x.name, x.rows.map((r) => [r.label, h16(r.desc), r.chip])]);
          return (got.length === 4 && JSON.stringify(got) === JSON.stringify(want)) || JSON.stringify(got).slice(0, 280);
        });
        chk(`4.3d ${mode}: every Business Solutions row carries exactly one icon, its own, the registry\u2019s bytes (R-45.21)`, () => {
          const rows = g.flatMap((x) => x.rows.map((r) => [x, r]));
          const keyOf = (label) => RULED_GROUPS.flatMap(([, ks]) => ks).find((k) => SC.roomLabel(k) === label);
          const bad = rows.filter(([, r]) => !oneIcon(hb, keyOf(r.label), r.icons)).map(([, r]) => r.label);
          return (rows.length === 11 && bad.length === 0) || JSON.stringify({ n: rows.length, bad });
        });
        ok(hb.hub && hb.hub.footer === true, `4.3b ${mode}: the footer\u2019s human control is still there (a control: green at the base)`);
        chk(`4.3c ${mode}: Contracts & deposits and Payment reminders open the SAME route from Money and from Get paid (R-45.19)`, () => {
          const money = ((ro.rooms || {}).shelves || []).find((s) => s.id === 'money');
          if (!money) return 'no Money shelf on Rooms';
          const gp = g.find((x) => x.name === 'Get paid');
          if (!gp) return 'no Get paid group';
          const pairs = ['Contracts & deposits', 'Payment reminders'].map((n) => [(money.rows.find((r) => r.name === n) || {}).href, (gp.rows.find((r) => r.label === n) || {}).href]);
          return pairs.every(([a, b]) => !!a && a === b) || JSON.stringify(pairs);
        });
      }

      const trades = mode === 'dark' ? [...Object.keys(RULED_TRADE), 'other', 'fail', 'none'] : ['photography', 'other', 'fail'];
      for (const t of trades) {
        const ho = probe(mode, 'home:' + t);
        if (!guard(ho, `4.4 ${mode} ${t}`)) { if (!browserOk) break; continue; }
        chk(`4.4 ${mode} ${t}: Home pins the six ruled for this trade` + (RULED_TRADE[t] ? '' : ' (the fallback)'), () => {
          const set = (RULED_TRADE[t] || RULED_DEFAULT).map(untag);
          const want = set.map((i) => [itemsText(i).name, itemsText(i).desc, RT.itemHref(i)]);
          const got = ((ho.home || {}).pins || []).map((p) => [p.name, p.desc, p.href]);
          return (got.length === 6 && JSON.stringify(got) === JSON.stringify(want)) || JSON.stringify(got).slice(0, 240);
        });
        if (t === 'photography') {
          const hm = ho.home || {}; const c = ho.chrome || {};
          // 4.5a INVERTED BY LABEL, R-45.21 (P2 amended by the founder: "it being at the bottom defeats the
          // purpose of pinning"): the pins now stand ABOVE Today's surface, which still draws its date line.
          ok(hm.masthead === true && hm.pinsBeforeMasthead === true && hm.mastheadBeforePins === false && hm.pinsBottom !== null && hm.mastTop !== null && hm.pinsBottom <= hm.mastTop + 1 && !!hm.mdate,
            `4.5a ${mode}: the pins stand above Today\u2019s own surface, which still draws its date line (R-45.21)`, JSON.stringify([hm.pinsBeforeMasthead, hm.pinsBottom, hm.mastTop, hm.mdate]));
          ok(hm.cols === 3 && (hm.pins || []).length === 6 && hm.pins.every((x) => x.descHidden === true && !!x.desc),
            `4.5f ${mode}: the pins are compact, three across, each room\u2019s line kept for screen readers only (R-45.21)`, JSON.stringify([hm.cols, (hm.pins || []).map((x) => x.descHidden)]));
          ok((hm.pins || []).length === 6 && hm.pins.every((x) => oneIcon(ho, x.key, x.icons)),
            `4.5g ${mode}: every pin carries exactly one icon, its own, the registry\u2019s bytes (R-45.21)`, JSON.stringify((hm.pins || []).map((x) => [x.key, (x.icons || []).map((i) => i.k)])));
          ok(h16(hm.head) === H_COPY.pinnedHead, `4.5b ${mode}: the pins sit under their heading`, hm.head);
          ok(!!hm.change && hm.change.disabled === true && hm.change.chip === 'coming' && h16(hm.change.label) === H_COPY.pinnedChange,
            `4.5c ${mode}: the change control is drawn, stated, disabled and wears Coming (F-19.20; P1(b))`, JSON.stringify(hm.change));
          ok(h16(c.title) === H_COPY.navToday && JSON.stringify((c.seats || []).map((s) => s.current)) === JSON.stringify([null, 'page']), `4.5d ${mode}: the title reads Home and the Home tab is current`, c.title);
          ok(!!ho.clicked && ho.afterClick === ho.clicked, `4.5e ${mode}: a pinned room opens its room`, JSON.stringify([ho.clicked, ho.afterClick]));
          docks.home = c.dock; docks.homeSeat = c.seatTop;
        }
      }

      const hs = probe(mode, 'home:slow');
      if (guard(hs, `4.7 ${mode}`)) {
        const e = hs.early || {}; const l = hs.late || {};
        ok(e.waiting === true && e.links === 0 && l.waiting === false && l.links === 6 && e.pinsH === l.pinsH && Math.abs((e.mastTop || -99) - (l.mastTop || 99)) <= 1,
          `4.7 ${mode}: while her trade loads the pins hold their height, and Today\u2019s masthead does not move when they arrive (chair\u2019s (a))`, JSON.stringify([e, l]));
      }

      ok(!!docks.rooms && !!docks.home && docks.rooms.text === ph && docks.home.text === ph,
        `4.6a ${mode}: the dock keeps its words on Rooms and on Home (a control: green at the base)`, JSON.stringify([docks.rooms && docks.rooms.text, docks.home && docks.home.text]));
      ok(!!docks.rooms && !!docks.home && Math.abs(docks.rooms.top - docks.home.top) <= 1 && docks.rooms.bottom <= docks.roomsSeat && docks.home.bottom <= docks.homeSeat,
        `4.6b ${mode}: the dock sits in one place, above the tabs, on both (a control: green at the base)`, JSON.stringify([docks.rooms, docks.roomsSeat, docks.home, docks.homeSeat]));
    }
  } catch (e) {
    ok(false, '4 the surfaces ran', e.message);
  } finally {
    await killDev(dev); // F-44.160: the bench waits for its own server to be gone before it exits
    // and says so: a bench that leaves a next dev holding the root hands F-44.160 to the next bench
    const left = rootDevs();
    ok(left.length === 0, '4.99 F-44.160: this bench leaves no next dev holding the root (its control\u2019s blocker and its own server gone)', left.length ? 'still alive: ' + left.join(', ') : '');
    // 4.99m · 4.99's PROOF OF RECORD (ruled 25 Sept 2026; c-45.49 withdrew the group-only kill as a
    // race that cannot red on demand): a kill that signals ONLY npx's own pid must leave the server
    // alive, and 4.99's own detector (rootDevs) must see it. Then the survivor goes by the whole-tree
    // kill, and the root is proven free again, so this proof hands nothing on.
    {
      const mLog = path.join(os.tmpdir(), 'b122-dev-mutation.log');
      const m = spawnDev(3988, mLog, false);
      const mUp = await answers(3988, 150);
      const tree = treeOf(m.pid);
      try { process.kill(m.pid, 'SIGTERM'); } catch (_e) { /* gone */ }
      await new Promise((r) => setTimeout(r, 3000));
      const seen = rootDevs();
      for (const pid of tree) { try { process.kill(pid, 'SIGTERM'); } catch (_e) { /* gone */ } }
      for (let t = 0; t < 20 && tree.some(alive); t += 1) await new Promise((r) => setTimeout(r, 1000));
      for (const pid of tree.filter(alive)) { try { process.kill(pid, 'SIGKILL'); } catch (_e) { /* gone */ } }
      for (let t = 0; t < 10 && tree.some(alive); t += 1) await new Promise((r) => setTimeout(r, 500));
      const after = rootDevs();
      ok(mUp && seen.length > 0 && after.length === 0,
        '4.99m mutation (F-44.160, ruled): a kill of npx alone leaves the server alive and 4.99\u2019s detector sees it; the whole-tree kill then frees the root',
        !mUp ? 'the mutation server never answered' : !seen.length ? 'nothing seen after the npx-only kill: 4.99 would not bite' : 'the root is still held after the whole-tree kill: ' + after.join(', '));
    }
  }

  console.log(`\nb122: ${pass} passed, ${fail} failed${fail ? '\n  ' + failed.join('\n  ') : ''}`);
  console.log(`screenshots: ${SHOTS}`);
  process.exit(fail ? 1 : 0);
})();
