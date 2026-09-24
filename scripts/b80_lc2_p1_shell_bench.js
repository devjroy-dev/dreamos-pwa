#!/usr/bin/env node
'use strict';
// scripts/b80_lc2_p1_shell_bench.js — TDW CE-43 · LC-2 · packet 1 (dreamos-pwa) · THE SHELLS.
// AMENDED BY LABEL AT PACKET 3e (CE-43 LC-2r): §5.4's import pattern admits AttachSheet beside the card
// (F-43.102, chair-ruled). The fact (the live card is imported; the shell byte is not) is unchanged.
// AMENDED BY LABEL AT PACKET 3c (CE-43 LC-2r, 1(a) chair-ruled): the card now mounts through
// DetailSheet's `detailTop` slot (above the detail rows), so §5.1's block and M6's anchor read the
// `detailTop` const and its hand-off to DetailSheet. The fact asserted (leads only) is unchanged.
// AMENDED BY LABEL AT PACKET 3 (CE-43 LC-2r): §6.2, §6.3 and §6.6 now hold packet 3's live facts
// (the sheet books through createDirectClient; F28(b) makes Advance received a switch between
// Fee and Received on; Add client submits). M8 re-aimed at the live submit. No other cell moved.
// AMENDED BY LABEL AT PACKET 2: §2.5, §2.6, §2.8 and §5 now hold packet 2's live facts (the
// room's acts and the lead card are b81's to prove); M6 and M9 re-aimed at the new source.
// Rung b80, chair-allocated (b79 stays held for R6's F-42.179 rename). Runnable from any
// working directory. Exit 0 green, 1 red, 3 refused (node_modules absent).
//
// WHAT THIS BENCH DRIVES
//   §1 the registry: `packages` beside Leads, in FROZEN_ORDER, the counts 20/19/10/9 (F18).
//   §2 the Packages room page: default export only (Next.js refuses named exports from a
//      page file), reads fetchPackages, renders the vetoed bytes, every act answers
//      Launching soon., Set as default is not offered on the default, the failed read says
//      COPY.surfaceUnavailable.
//   §3 the copy home, DRIVEN (transpiled in memory): the vetoed bytes verbatim, and C-43.15's
//      P3 plural ("1 package", "{n} packages").
//   §4 fetchPackages, DRIVEN through the real vendor.ts over a getJson double (b78's technique):
//      the one path, the passthrough.
//   §5 the lead card on SliceShell: leads only, the A1/A2 bytes, Launching soon. on tap.
//   §6 the Clients Add sheet: the room mounts ClientBookingSheet, not AddSheet; the sheet
//      writes nothing (no create call); the C2 fields in order; the fee field only when the
//      chosen package has none (F8(a)); AddSheet byte-identical to base 409a130e.
//   §7 tokens only (R-42.6): no colour literal in the three new files.
//   §7b app/favicon.ico (F-43.74, chair-ruled (a)): three embedded PNGs at 16, 32 and 64, each
//      RGBA (IHDR colour type 6), which the pinned Next 16.2.3 Turbopack requires. This bench reads
//      the ICO directory and each PNG header; pixel equality with the 409a130e icon was proven by
//      Pillow at the cut, an independent method (R-40.93), recorded in the handover. §7b.4 holds
//      public/brand/favicon.ico to the same bytes (the CE-41 family law, F-43.75).
//   §8 mutations of production source, each turning its named cell RED.
//
// ABSENCE CELLS ARE GATED ON PRESENCE (§2.8, §5.5, §6.2, §7.1): "writes nothing" and "no colour"
// are true of a file that does not exist, so each also requires the file or block to exist.
// Both ways at base 409a130e: the one green there is §6.8 (AddSheet equals itself), a true fact.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const read = (rel) => { const p = path.join(ROOT, rel); return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : ''; };
let ts;
try { ts = require('typescript'); } catch (e) { console.log('REFUSED — node_modules absent; run npm ci'); process.exit(3); }

let pass = 0, fail = 0;
const fails = [];
// -- CE-45 FE-1 · LABELLED AMENDMENT: A-45.2'S RETIRED TABLE, AT THE HARNESS (dream-os b65's shape).
// Printed RETIRED with its reason, never counted; at exit each row must be met exactly once.
const __RETIRE = new Map([['§1.4 the counts read 20 / 19 / 10 / 9', 'A-45.2: the two-band grid constants retired with the founder\u2019s layout; ROOM_COUNT_EXPECTED is b40 C2\u2019s and b42\u2019s; b122 \u00a72 pins the shelves']]);
const __seen = new Map();
const ok = (c, n) => { if (__RETIRE.has(n)) { __seen.set(n, (__seen.get(n) || 0) + 1); console.log('  RETIRED ' + n + '  (' + __RETIRE.get(n) + ')'); return; } if (c) { pass++; console.log('  ok   ' + n); } else { fail++; fails.push(n); console.log('  FAIL ' + n); } };
const sec = (t) => console.log('\n' + t);
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

const F = {
  rooms: 'lib/worklist/rooms.ts',
  page: 'app/vendor/(shell)/packages/page.tsx',
  copy: 'lib/worklist/packages.ts',
  api: 'lib/vendor/api/vendor.ts',
  shell: 'components/vendor/slices/SliceShell.tsx',
  sheet: 'components/vendor/ClientBookingSheet.tsx',
  clients: 'app/vendor/(shell)/clients/body.tsx',
  addsheet: 'components/vendor/AddSheet.tsx',
};

function transpile(src) {
  return ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
}
function loadModule(src, stubs = {}) {
  const mod = { exports: {} };
  const req = (spec) => { if (spec in stubs) return stubs[spec]; return require(spec); };
  new Function('require', 'module', 'exports', transpile(src))(req, mod, mod.exports);
  return mod.exports;
}

// ── the cells, each a function of the sources so §8 can hand them a mutated file ──
function registryCells(src) {
  const s = strip(src);
  const num = (n) => { const m = s.match(new RegExp(n + '\\s*=\\s*(\\d+)')); return m ? Number(m[1]) : null; };
  // CE-45 FE-1 · LABELLED AMENDMENT: the id scan reads the ROOMS array alone (SHELVES' ids are not rooms).
  const roomsBlock = (s.match(/export const ROOMS[\s\S]*?\n\](?: as const)?;/) || [''])[0];
  const ids = (roomsBlock.match(/\{\s*id:\s*'([a-z]+)'/g) || []).map((x) => x.match(/'([a-z]+)'/)[1]);
  const fb = s.match(/FROZEN_ORDER[^=]*=\s*\[([\s\S]*?)\]/);
  const frozen = fb ? (fb[1].match(/'([a-z]+)'/g) || []).map((x) => x.slice(1, -1)) : [];
  return {
    room: /\{\s*id:\s*'packages',\s*label:\s*'Packages',\s*band:\s*'work',\s*href:\s*'\/vendor\/packages',\s*pinnable:\s*true\s*\}/.test(s),
    besideLeads: ids.indexOf('packages') === ids.indexOf('leads') + 1 && ids.indexOf('leads') >= 0,
    frozen: frozen.join(',') === ids.join(',') && frozen.indexOf('packages') === frozen.indexOf('leads') + 1,
    counts: num('ROOM_COUNT_EXPECTED') === 20 && num('GRID_TILE_COUNT_EXPECTED') === 19 && num('TOP_BAND_EXPECTED') === 10 && num('BOTTOM_BAND_EXPECTED') === 9,
  };
}

function pageCells(src) {
  const s = strip(src);
  const exportsList = (s.match(/^export\s+(default\s+)?(function|const|class|async function)\s*(\w*)/gm) || []);
  const onlyDefault = exportsList.length === 1 && /^export\s+default\s+function/.test(exportsList[0]) && !/^export\s*\{/m.test(s);
  const soonHandlers = (s.match(/onClick=\{soon\}/g) || []).length;
  return {
    onlyDefault,
    reads: /fetchPackages\(\)/.test(s) && /from '@\/lib\/vendor\/api\/vendor'/.test(s),
    bytes: ['PACKAGES.eyebrow', 'PACKAGES.sub(', 'PACKAGES.empty', 'PACKAGES.defaultMark', 'PACKAGES.edit', 'PACKAGES.setDefault', 'PACKAGES.del', 'PACKAGES.add', 'PACKAGES.feeUnset'].every((k) => s.includes(k)),
    label: /ROOMS\.find\(\(r\) => r\.id === 'packages'\)\?\.label/.test(s),
    // AMENDED BY LABEL — CE-43 LC-2 packet 2: the room's acts are live. The shell's
    // `Launching soon.` is gone from the room; b81 proves each act.
    allSoon: s.length > 0 && !/launchingSoon/.test(s) && soonHandlers === 0,
    defaultNotOffered: /\{!p\.is_default && <button type="button" className="pkg-act" onClick=\{\(\) => \{ void makeDefault\(p\); \}\}>\{PACKAGES\.setDefault\}/.test(s),
    failedRead: /COPY\.surfaceUnavailable/.test(s),
    noWrite: s.length > 0 && !/(postJson|patchJson|deleteJson|method:\s*'(POST|PATCH|DELETE)')/.test(s),
  };
}

function copyCells(src) {
  const r = {};
  try {
    const m = loadModule(src);
    const P = m.PACKAGES, L = m.LEAD_PACKAGE, C = m.CLIENT_BOOKING;
    r.p = P.eyebrow === 'Your packages' && P.empty === 'No packages yet. Add one to quote a couple.'
      && P.defaultMark === 'Default' && P.add === 'Add package' && P.edit === 'Edit' && P.del === 'Delete'
      && P.setDefault === 'Set as default' && P.feeUnset === 'Fee not set';
    r.plural = P.sub(1) === 'What you offer · 1 package' && P.sub(3) === 'What you offer · 3 packages' && P.sub(0) === 'What you offer · 0 packages';
    r.a = L.eyebrow === 'Package' && L.attach === 'Attach package';
    r.c = C.title === 'New client' && C.submit === 'Add client'
      && [C.name, C.phone, C.weddingDate, C.pkg, C.fee, C.advance, C.receivedOn].join('|') === 'Name|Phone|Wedding date|Package|Fee|Advance received|Received on';
    r.noUnrendered = !/(\bP7\b|\bA3\b|Launching soon)/.test(strip(src).replace(/\/\*\*[\s\S]*?\*\//g, ''));
  } catch (e) { r.err = e.message; }
  return r;
}

async function apiCells(src) {
  const r = {};
  try {
    const calls = [];
    const getJson = async (p) => { calls.push(p); return { ok: true, packages: [{ id: 'x' }], seeding: { seeded: true, reason: 'seeded' } }; };
    const stubs = {
      './_base': { getJson, postJson: async () => ({}), patchJson: async () => ({}), deleteJson: async () => ({}), API_BASE: '', getAuthHeader: () => ({}), handleResponse: async () => ({}) },
      '@/lib/solutions/routes': { API: new Proxy({}, { get: () => '' }) },
      '@/lib/vendor/session': { getVendorSession: () => null, setVendorSession: () => {}, clearVendorSession: () => {} },
      '@/lib/worklist/feed': { refreshToday: () => {} },
    };
    const api = loadModule(src, stubs);
    const out = await api.fetchPackages();
    r.path = calls.length === 1 && calls[0] === '/api/v2/vendor/packages';
    r.pass = out && out.ok === true && out.packages[0].id === 'x' && out.seeding.reason === 'seeded';
  } catch (e) { r.err = e.message; }
  return r;
}

// AMENDED BY LABEL — CE-43 LC-2 packet 2: SliceShell's inline shell card is replaced by the
// live LeadPackageCard. These cells now hold the mount; b81 proves the card itself.
function shellCells(src, cardSrc = read('components/vendor/packages/LeadPackageCard.tsx')) {
  const s = strip(src);
  const card = strip(cardSrc || '');
  // [amended, packet 3c] the card is the `detailTop` const, handed to DetailSheet.
  const block = /detailTop=\{detailTop\}/.test(s)
    ? ((s.match(/const detailTop = slice === 'leads' && sel \? \(\s*<LeadPackageCard leadId=\{sel\.id\}[\s\S]*?\/>\s*\) : null;/) || [''])[0])
    : '';
  return {
    leadsOnly: block.length > 0,
    bytes: card.length > 0 && /\{LEAD_PACKAGE\.eyebrow\}/.test(card) && /LEAD_PACKAGE\.change : LEAD_PACKAGE\.attach/.test(card),
    soon: card.length > 0 && /onClick=\{\(\) => setSheetOpen\(true\)\}/.test(card) && !/launchingSoon/.test(card),
    // [amended, packet 3e] the same import also brings AttachSheet (F-43.102).
    imports: /import \{ LeadPackageCard(, AttachSheet)? \} from '@\/components\/vendor\/packages\/LeadPackageCard'/.test(s) && !/SOL_COPY/.test(s),
    tokens: block.length > 0 && card.length > 0 && !/#[0-9a-fA-F]{3,8}\b|rgba?\(/.test(block + card),
  };
}

// CE-45 FE-2 TYPE_2: AddSheet with its type taken out (see §6.8's amendment).
function typeFree(src) {
  return String(src)
    .replace(/^import \{ RUNG_FONT as RUNG \} from '@\/lib\/worklist\/theme';[^\n]*\n/m, '')
    .replace(/^const F = \{[^\n]*\};\n/m, '')
    .replace(/\b(fontFamily|fontSize|fontWeight|lineHeight|letterSpacing|fontStyle|textTransform|font)\s*:\s*('[^']*'|[^,}\n]+)\s*,?/g, '')
    .replace(/[\s,]+/g, '');
}
function sheetCells(sheet, clients, addsheet, addsheetBase) {
  const s = strip(sheet);
  const c = strip(clients);
  const labels = (s.match(/label\(CLIENT_BOOKING\.(\w+)\)/g) || []).map((x) => x.match(/\.(\w+)\)/)[1]);
  return {
    mounted: /<ClientBookingSheet\b/.test(c) && !/<AddSheet\b/.test(c) && /from '@\/components\/vendor\/ClientBookingSheet'/.test(c),
    // [amended, packet 3] the sheet writes ONLY through createDirectClient (POST /clients/direct).
    noWrite: s.length > 0 && /createDirectClient\(/.test(s) && !/(createClient\(|createLead|postJson|patchJson|fetch\()/.test(s),
    // [amended, packet 3] F28(b): Advance received is a switch, not a labelled field; it sits
    // between Fee and Received on, so C2's order holds.
    order: labels.join(',') === 'name,phone,weddingDate,pkg,fee,receivedOn'
      && s.indexOf('label(CLIENT_BOOKING.fee)') < s.indexOf('{CLIENT_BOOKING.advance}')
      && s.indexOf('{CLIENT_BOOKING.advance}') < s.indexOf('label(CLIENT_BOOKING.receivedOn)'),
    feeConditional: /const needsFee = !!chosen && chosen\.total == null;/.test(s) && /\{needsFee && \(\s*<div>\{label\(CLIENT_BOOKING\.fee\)\}/.test(s),
    defaultPreselected: /r\.packages\.find\(\(p\) => p\.is_default\)/.test(s),
    // [amended, packet 3] Add client submits the booking; Launching soon. is gone from the sheet.
    submitSoon: /onClick=\{\(\) => \{ void submit\(\); \}\}[\s\S]{0,400}\{CLIENT_BOOKING\.submit\}/.test(s) && !/launchingSoon/.test(s),
    title: /\{CLIENT_BOOKING\.title\}/.test(s),
    // AMENDED BY LABEL · CE-45 FE-2 TYPE_2 (F4, ruled 24 Sept 2026: the sheets the legacy rooms open are
    // re-dressed onto the app's type). The ruling this cell kept (R-43.5: the Clients booking sheet is a
    // NEW sheet, and AddSheet is not touched to make it) still holds for everything AddSheet DOES; only
    // its type moved. So the cell compares AddSheet with base 409a130e with its type taken out of both
    // sides (every face, size, weight, line-height, tracking, style and case key, the retired face
    // constant, the one rung import) and the layout whitespace and commas the re-dress reflowed.
    // Anything else that moves, a handler, a field, a word or a colour, still reddens it.
    addSheetUntouched: addsheetBase !== null && typeFree(addsheet) === typeFree(addsheetBase),
  };
}

function tokenCells(files) {
  return files.every((src) => src.length > 0 && !/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/.test(strip(src)));
}

// ── the icon, read from its bytes: the ICO directory, then each embedded PNG's IHDR ──
function iconCells(buf) {
  const r = { count: false, sizes: false, rgba: false };
  if (!buf || buf.length < 6) return r;
  const n = buf.readUInt16LE(4);
  const imgs = [];
  for (let i = 0; i < n; i++) {
    const e = 6 + 16 * i;
    const size = buf.readUInt32LE(e + 8), off = buf.readUInt32LE(e + 12);
    const png = buf.subarray(off, off + size);
    const isPng = png.length > 26 && png.readUInt32BE(0) === 0x89504e47 && png.toString('ascii', 12, 16) === 'IHDR';
    imgs.push(isPng ? { w: png.readUInt32BE(16), h: png.readUInt32BE(20), depth: png[24], colour: png[25] } : null);
  }
  r.count = n === 3 && imgs.every(Boolean);
  r.sizes = r.count && imgs.map((x) => `${x.w}x${x.h}`).join(',') === '16x16,32x32,64x64';
  r.rgba = r.count && imgs.every((x) => x.colour === 6 && x.depth === 8);
  return r;
}
function readBuf(rel) { const p = path.join(ROOT, rel); return fs.existsSync(p) ? fs.readFileSync(p) : null; }

function baseFile(rel) {
  try { return execFileSync('git', ['-C', ROOT, 'show', `409a130e27a762b2e8e78796b4022e2a815151b7:${rel}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); }
  catch { return null; }
}

(async () => {
  const src = Object.fromEntries(Object.entries(F).map(([k, v]) => [k, read(v)]));

  sec('§1 · the registry (F18)');
  const r1 = registryCells(src.rooms);
  ok(r1.room, '§1.1 the packages room: label Packages (P1), work band, /vendor/packages, pinnable');
  ok(r1.besideLeads, '§1.2 it sits immediately after Leads');
  ok(r1.frozen, '§1.3 FROZEN_ORDER equals the registry, packages after leads');
  ok(r1.counts, '§1.4 the counts read 20 / 19 / 10 / 9');

  sec('§2 · the Packages room page');
  const r2 = pageCells(src.page);
  ok(r2.onlyDefault, '§2.1 the page file exports its default and nothing else (Next.js page rule)');
  ok(r2.reads, '§2.2 the room reads through fetchPackages');
  ok(r2.bytes, '§2.3 every rendered byte comes from the copy home');
  ok(r2.label, '§2.4 the title is the registry label, never typed');
  ok(r2.allSoon, '§2.5 [amended, packet 2] the room no longer answers Launching soon.; its acts are live (b81)');
  ok(r2.defaultNotOffered, '§2.6 Set as default is not offered on the default');
  ok(r2.failedRead, '§2.7 a failed read says COPY.surfaceUnavailable');
  ok(r2.noWrite, '§2.8 [amended, packet 2] the room calls no raw writer; its writes go through the API client');

  sec('§3 · the copy home, driven');
  const r3 = copyCells(src.copy);
  if (r3.err) console.log('  (' + r3.err + ')');
  ok(r3.p === true, '§3.1 P2 P4 P5 P6 P11 verbatim');
  ok(r3.plural === true, '§3.2 P3 under C-43.15: "1 package", otherwise "{n} packages"');
  ok(r3.a === true, '§3.3 A1 and A2 verbatim');
  ok(r3.c === true, '§3.4 C1 C2 C3 verbatim, fields in order');
  ok(r3.noUnrendered === true, '§3.5 no unrendered veto byte and no second Launching soon. home');

  sec('§4 · fetchPackages, driven');
  const r4 = await apiCells(src.api);
  if (r4.err) console.log('  (' + r4.err + ')');
  ok(r4.path === true, '§4.1 one GET to /api/v2/vendor/packages');
  ok(r4.pass === true, '§4.2 the door answer passes through untouched');

  sec('§5 · the lead card on SliceShell');
  const r5 = shellCells(src.shell);
  ok(r5.leadsOnly, '§5.1 [amended, packet 2] LeadPackageCard mounts on the leads detail only');
  ok(r5.bytes, '§5.2 [amended, packet 2] the card takes A1 and A2 from the copy home');
  ok(r5.soon, '§5.3 [amended, packet 2] Attach package opens the attach sheet, not Launching soon.');
  ok(r5.imports, '§5.4 [amended, packet 2] SliceShell imports the live card and no longer the shell byte');
  ok(r5.tokens, '§5.5 [amended, packet 2] the mount and the card carry no colour literal (R-42.6)');

  sec('§6 · the Clients Add sheet (R-43.5)');
  const r6 = sheetCells(src.sheet, src.clients, src.addsheet, baseFile(F.addsheet));
  ok(r6.mounted, '§6.1 the Clients room mounts ClientBookingSheet, not AddSheet');
  ok(r6.noWrite, '§6.2 [amended, packet 3] the sheet writes only through createDirectClient');
  ok(r6.order, '§6.3 [amended, packet 3] C2 fields in the vetoed order, Advance received a switch');
  ok(r6.feeConditional, '§6.4 the fee field shows only when the chosen package has no fee (F8(a))');
  ok(r6.defaultPreselected, '§6.5 the default package is preselected');
  ok(r6.submitSoon, '§6.6 [amended, packet 3] Add client submits the booking');
  ok(r6.title, '§6.7 the title is C1');
  ok(r6.addSheetUntouched, '§6.8 [amended, CE-45 FE-2 TYPE_2] AddSheet equals base 409a130e in everything but its type (R-43.5 kept; F4)');

  sec('§7 · tokens only (R-42.6)');
  ok(tokenCells([src.page, src.sheet, src.copy]), '§7.1 no colour literal in the page, the sheet or the copy home');

  sec('§7b · app/favicon.ico (F-43.74)');
  const icon = readBuf('app/favicon.ico');
  const r7 = iconCells(icon);
  ok(r7.count, '§7b.1 three embedded PNG images');
  ok(r7.sizes, '§7b.2 at 16, 32 and 64, unchanged');
  ok(r7.rgba, '§7b.3 every image is 8-bit RGBA (colour type 6), as Next 16.2.3 requires');
  // §7b.4 · the CE-41 one-family law (scripts/ce41_brand_family.mjs owns it): the family's .ico
  // carries the same bytes, so the cure did not make a second brand (F-43.75).
  const famIcon = readBuf('public/brand/favicon.ico');
  ok(!!icon && !!famIcon && icon.equals(famIcon), '§7b.4 public/brand/favicon.ico is the same bytes (one family)');

  sec('§8 · mutations of production source');
  const mut = (s, a, b) => (s.includes(a) ? s.replace(a, b) : null);
  {
    const m = mut(src.rooms, "  'leads', 'packages', 'clients',", "  'leads', 'clients', 'packages',");
    ok(m !== null && !registryCells(m).frozen, '§8 M1 FROZEN_ORDER moves packages → §1.3 RED');
  }
  {
    const m = mut(src.page, 'function PackagesScreen() {', 'export function PackagesScreen() {');
    ok(m !== null && !pageCells(m).onlyDefault, '§8 M2 a named export on the page → §2.1 RED');
  }
  {
    const m = mut(src.page, '{!p.is_default && <button', '{<button');
    ok(m !== null && !pageCells(m).defaultNotOffered, '§8 M3 Set as default offered on the default → §2.6 RED');
  }
  {
    const m = mut(src.copy, "${n === 1 ? 'package' : 'packages'}", 'packages');
    ok(m !== null && copyCells(m).plural !== true, '§8 M4 the plural rule removed → §3.2 RED');
  }
  {
    const m = mut(src.api, "getJson<PackagesResponse | ApiErr>('/api/v2/vendor/packages')", "getJson<PackagesResponse | ApiErr>('/api/v2/vendor/package')");
    const c = m === null ? {} : await apiCells(m);
    ok(m !== null && c.path !== true, '§8 M5 the path drifts → §4.1 RED');
  }
  {
    const m = mut(src.shell, "const detailTop = slice === 'leads' && sel ? (", "const detailTop = sel ? (");
    ok(m !== null && !shellCells(m).leadsOnly, '§8 M6 [re-aimed, packet 3c] the card shown on every slice → §5.1 RED');
  }
  {
    const m = mut(src.sheet, 'const needsFee = !!chosen && chosen.total == null;', 'const needsFee = true;');
    ok(m !== null && !sheetCells(m, src.clients, src.addsheet, baseFile(F.addsheet)).feeConditional, '§8 M7 the fee always asked → §6.4 RED');
  }
  {
    const m = mut(src.sheet, 'onClick={() => { void submit(); }}', 'onClick={() => { void createClient({}); }}');
    ok(m !== null && !sheetCells(m, src.clients, src.addsheet, baseFile(F.addsheet)).noWrite, '§8 M8 [re-aimed, packet 3] the sheet writes public.clients → §6.2 RED');
  }
  {
    const m = mut(src.page, "color:var(--atelier-ink-mute);white-space:nowrap}", "color:#C9A84C;white-space:nowrap}");
    ok(m !== null && !tokenCells([m, src.sheet, src.copy]), '§8 M9 a colour literal in the room → §7.1 RED');
  }

  {
    // M10: restore one image to RGB (colour type 2), the 409a130e state, in a copy of the bytes.
    let red = false;
    if (icon) {
      const m = Buffer.from(icon);
      const off = m.readUInt32LE(6 + 16 * 1 + 12);
      m[off + 25] = 2;
      red = iconCells(m).rgba === false;
    }
    ok(red, '§8 M10 the 32 px image restored to RGB → §7b.3 RED');
  }
  {
    // M11: the family copy left at the 409a130e bytes while app/favicon.ico moves (the r2 defect).
    const base = (() => { try { return execFileSync('git', ['-C', ROOT, 'show', '409a130e27a762b2e8e78796b4022e2a815151b7:public/brand/favicon.ico'], { stdio: ['ignore', 'pipe', 'ignore'] }); } catch { return null; } })();
    ok(!!icon && !!base && !icon.equals(base), '§8 M11 the family .ico left at its base bytes → §7b.4 RED');
  }

  for (const [k] of __RETIRE) { if (__seen.get(k) !== 1) { fail++; fails.push('A-45.2 control: ' + k + ' met ' + (__seen.get(k) || 0) + ' times'); } }
  console.log(`\n════════  b80_lc2_p1_shell_bench: ${pass} passed, ${fail} failed  ════════`);
  if (fail) { console.log('RED:'); fails.forEach((f) => console.log('   · ' + f)); process.exit(1); }
})().catch((e) => { console.error('BENCH ERROR', e); process.exit(2); });
