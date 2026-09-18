#!/usr/bin/env node
'use strict';
// scripts/b81_lc2_p2_room_bench.js — TDW CE-43 · LC-2 · packet 2 (dreamos-pwa) · the live Packages room
// (C-43.16), the edit sheet, the attach sheet and the lead's package card. Rung b81, chair-allocated.
// Runnable from any directory. Exit 0 green, 1 red, 3 refused (node_modules absent).
//
//   §1 the copy home, DRIVEN: packet 2's vetoed bytes, F26 labels, the full-month date (R-42.13),
//      the F21 numerals, A9's four lines, and the PENDING failure bytes.
//   §2 the API client, DRIVEN through the real vendor.ts over request doubles: paths, verbs, bodies.
//   §3 the room (C-43.16): folded start, the fee affordance-and-handler pair, the bar from `split`,
//      the numerals, the summary, the quiet actions and P7, the default rule, the Add tile.
//   §4 the edit sheet: fee focus, the gates, the refusal mapping, the toast.
//   §5 the lead card and attach sheet: server-rendered money (no arithmetic), tells, A8, A9 by code.
//   §6 tokens only in every new or touched file (R-42.6), both themes by construction.
//   §7 the icon: lucide-react is an existing dependency and ChevronDown ships in it.
//   §8 mutations of production source, each turning its named cell RED.
//   P2b: §3.14, §4.8, §5.10 to §5.12 and M15 to M18 (F-43.78 on the sheet, F-43.79's button form);
//   §3.8 amended by label for the quiet button's border.
//   Packet 3g (F-43.107, chair-ruled): §5.6 AMENDED BY LABEL, the default is picked from the read-once list.
//   Packet 3f (R-43.16, chair-ruled): §5.4 AMENDED BY LABEL, the refusal renders through NeedFirst.
//   Packet 3c (1(a), chair-ruled): §5.8 AMENDED BY LABEL, the card mounts through the `detailTop`
//   slot above the detail rows; the fact (the card on the leads detail) is unchanged.
// NOT PROVEN HERE (declared): rendering on a device, the two-theme screenshots, `next build`,
// and the database. The founder's walk and provisional floor are their witnesses.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const read = (rel) => { const p = path.join(ROOT, rel); return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : ''; };
let ts;
try { ts = require('typescript'); } catch { console.log('REFUSED — node_modules absent; run npm ci'); process.exit(3); }

let pass = 0, fail = 0;
const fails = [];
const ok = (c, n) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; fails.push(n); console.log('  FAIL ' + n); } };
const sec = (t) => console.log('\n' + t);
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1').replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

const F = {
  copy: 'lib/worklist/packages.ts',
  api: 'lib/vendor/api/vendor.ts',
  page: 'app/vendor/(shell)/packages/page.tsx',
  fields: 'components/vendor/packages/PackageFields.tsx',
  edit: 'components/vendor/packages/PackageEditSheet.tsx',
  card: 'components/vendor/packages/LeadPackageCard.tsx',
  shell: 'components/vendor/slices/SliceShell.tsx',
};

function loadModule(src, stubs = {}) {
  const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', out)((spec) => (spec in stubs ? stubs[spec] : require(spec)), mod, mod.exports);
  return mod.exports;
}
const rs = (n) => `Rs ${Number(n).toLocaleString('en-IN')}`;

function copyCells(src) {
  const r = {};
  try {
    const m = loadModule(src);
    const P = m.PACKAGES, L = m.LEAD_PACKAGE, X = m.PACKAGE_FAILURES;
    r.p6to12 = P.save === 'Save' && P.cancel === 'Cancel'
      && P.deleteConfirm === 'Delete this package? Quotes already sent keep their copy.'
      && [P.fName, P.fDescription, P.fIncluded, P.fItem, P.fDetail, P.fAddItem, P.fFee].join('|') === "Name|Description|What's included|Item|Detail|Add item|Fee"
      && [P.fDeposit, P.fMiddle, P.fTakeMiddle].join('|') === 'Deposit on booking (%)|Middle payment (%)|Take a middle payment'
      && [P.fDelivery, P.dOnTheDay, P.dDays, P.dHandover, P.fDays].join('|') === 'Delivery|On the event date|Days after the event|Handover date|Days'
      && [P.saved, P.deleted, P.defaultSet].join('|') === 'Package saved.|Package deleted.|Default set.';
    r.a = L.attach === 'Attach package' && L.change === 'Change package' && L.sheetTitle === 'Attach a package'
      && [L.fPackage, L.fFee, L.fHandover].join('|') === 'Package|Fee for this couple|Handover date'
      && L.folded === 'The event is under a month away, so the middle payment is part of the final one.'
      && L.counted === 'Counted from the wedding date.'
      && L.delivery('5 February 2027') === 'Delivery · 5 February 2027';
    // AMENDED AT CE-44 (R-44.12). The cell read the refusal set as EXACTLY four lines.
    // R-44.12 added a fifth, `already_booked`, so the equality now reads RED on correct
    // source. The four A9 lines are still asserted, each by name and byte; the set is no
    // longer closed, because the estate will keep adding refusals and a closed set turns
    // every future ruling into a false red here.
    r.a9 = L.refusals.no_package === 'Attach a package first.'
      && L.refusals.no_fee === 'Set the fee first.'
      && L.refusals.no_wedding_date === 'Add the wedding date first.'
      && L.refusals.no_handover_date === 'Add the handover date first.';
    r.vetoAt30 = m.scheduleLabel('deposit', 30) === 'Deposit, 30% of the fee, on booking'
      && m.scheduleLabel('middle', 30) === '30% one month before the first function (optional)'
      && m.scheduleLabel('final', 40) === 'The remainder, on delivery, before the work is handed over';
    r.ownShares = m.scheduleLabel('deposit', 40) === 'Deposit, 40% of the fee, on booking' && m.scheduleLabel('middle', 20) === '20% one month before the first function (optional)';
    r.fullMonth = m.packageDate('2026-11-22') === '22 November 2026' && m.packageDate('2027-02-05') === '5 February 2027'
      && m.packageDate('2026-09-01') === '1 September 2026' && m.packageDate('2026-09-01T23:30:00Z') === '1 September 2026' && m.packageDate(null) === '';
    r.row = m.scheduleRow('deposit', 30, 'Rs 24,000', '2026-09-17') === 'Deposit, 30% of the fee, on booking · Rs 24,000 · 17 September 2026';
    r.numerals = m.splitNumerals([{ pct: 30, amount: null }, { pct: 30, amount: null }, { pct: 40, amount: null }], rs) === '30 · 30 · 40'
      && m.splitNumerals([{ pct: 30, amount: 24000 }, { pct: 30, amount: 24000 }, { pct: 40, amount: 32000 }], rs) === 'Rs 24,000 · Rs 24,000 · Rs 32,000'
      && m.splitNumerals([{ pct: 30, amount: null }, { pct: 70, amount: null }], rs) === '30 · 70'
      && m.splitNumerals([{ pct: 30, amount: 24000 }, { pct: 70, amount: null }], rs) === '30 · 70';
    r.pending = !!X && Object.keys(X).length === 8 && Object.values(X).every((v) => typeof v === 'string' && v.endsWith('.'));
  } catch (e) { r.err = e.message; }
  return r;
}

async function apiCells(src) {
  const r = {};
  try {
    const calls = [];
    const rec = (verb) => async (p, body) => { calls.push({ verb, p, body }); return { ok: true }; };
    const stubs = {
      './_base': { getJson: rec('GET'), postJson: rec('POST'), patchJson: rec('PATCH'), deleteJson: rec('DELETE'), API_BASE: '', getAuthHeader: () => ({}), handleResponse: async () => ({}) },
      '@/lib/solutions/routes': { API: new Proxy({}, { get: () => '' }) },
      '@/lib/vendor/session': { getVendorSession: () => null, setVendorSession: () => {}, clearVendorSession: () => {} },
      '@/lib/worklist/feed': { refreshToday: () => {} },
    };
    const api = loadModule(src, stubs);
    await api.createPackage({ name: 'A' });
    await api.updatePackage('p/1', { total: 5 });
    await api.deletePackage('p1');
    await api.setDefaultPackage('p1');
    await api.fetchLeadPackage('l 1');
    await api.attachLeadPackage('l1', { package_id: 'p1', total: 80000 });
    const got = calls.map((c) => `${c.verb} ${c.p}`).join('\n');
    r.paths = got === [
      'POST /api/v2/vendor/packages',
      'PATCH /api/v2/vendor/packages/p%2F1',
      'DELETE /api/v2/vendor/packages/p1',
      'POST /api/v2/vendor/packages/p1/default',
      'GET /api/v2/vendor/leads/l%201/package',
      'POST /api/v2/vendor/leads/l1/package',
    ].join('\n');
    r.bodies = JSON.stringify(calls[0].body) === '{"name":"A"}' && JSON.stringify(calls[1].body) === '{"total":5}'
      && JSON.stringify(calls[5].body) === '{"package_id":"p1","total":80000}';
  } catch (e) { r.err = e.message; }
  return r;
}

function pageCells(src) {
  const s = strip(src);
  return {
    folded: /useState<Record<string, boolean>>\(\{\}\)/.test(s) && /const isOpen = !!open\[p\.id\];/.test(s) && !/setOpen\(\{\s*\[/.test(s) && !/useEffect\([^)]*setOpen/.test(s),
    feePair: /\{p\.total == null\s*\?\s*<button type="button" className="pkg-fee pkg-fee--unset" onClick=\{\(\) => setSheet\(\{ pkg: p, focusFee: true \}\)\}>\{PACKAGES\.feeUnset\}<\/button>/.test(s)
      && /\.pkg-fee--unset\{[^}]*border-bottom:1px dashed var\(--atelier-accent-text\)/.test(s)
      && !/\.pkg-fee--set\{[^}]*dashed/.test(s) && !/\.pkg-fee\{[^}]*dashed/.test(s),
    feeSet: /: <span className="pkg-fee pkg-fee--set">\{formatRs\(p\.total\)\}<\/span>/.test(s),
    bar: /parts\.map\(\(s\) => <span key=\{s\.kind\} className=\{`pkg-seg pkg-seg--\$\{s\.kind\}`\} style=\{\{ flexGrow: s\.pct \}\} \/>\)/.test(s)
      && /const parts = p\.split \|\| \[\];/.test(s)
      && /\.pkg-seg--deposit\{background:var\(--atelier-accent-text\)\}/.test(s)
      && /\.pkg-seg--middle\{background:var\(--atelier-accent-text\);opacity:\.45\}/.test(s)
      && /\.pkg-seg--final\{background:var\(--atelier-ink\);opacity:\.22\}/.test(s),
    numerals: /\{splitNumerals\(parts, formatRs\)\}/.test(s),
    noDateInRoom: !/packageDate|due_on|formatLongDate/.test(s),
    summary: /return p\.line_items\.slice\(0, 3\)\.map\(\(it\) => it\.detail\)\.join\(', '\);/.test(s),
    actions: /className="pkg-act pkg-act--quiet pkg-act--right" onClick=\{\(\) => setConfirming\(p\.id\)\}>\{PACKAGES\.del\}/.test(s)
      && /<p>\{PACKAGES\.deleteConfirm\}<\/p>/.test(s) && /onClick=\{\(\) => \{ void remove\(p\); \}\}>\{PACKAGES\.del\}/.test(s)
      // AMENDED BY LABEL at P2b (F-43.79): the quiet button carries the muted ink as colour and border.
      && /\.pkg-act--quiet\{color:var\(--atelier-ink-mute\);border-color:var\(--atelier-ink-mute\)\}/.test(s),
    buttonForm: /\.pkg-act\{background:transparent;border:\.5px solid var\(--atelier-accent-text\);border-radius:2px;padding:0 14px;min-height:40px;/.test(s)
      && /className="pkg-act pkg-act--quiet" onClick=\{\(\) => setConfirming\(null\)\}>\{PACKAGES\.cancel\}/.test(s)
      && /className="pkg-fee pkg-fee--unset"/.test(s) && /\.pkg-fee--unset\{background:none;border:none;/.test(s),
    defaultRule: /\.pkg-card--default\{border-left:2px solid var\(--atelier-accent-text\);border-radius:0\}/.test(s) && /\{p\.is_default && <span className="pkg-default">\{PACKAGES\.defaultMark\}<\/span>\}/.test(s),
    addTile: /className="pkg-add" onClick=\{\(\) => setSheet\(\{ pkg: null, focusFee: false \}\)\}>\{PACKAGES\.add\}/.test(s) && /\.pkg-add\{[^}]*border:1px dashed var\(--atelier-input-border\)/.test(s),
    chevron: /import \{ ChevronDown \} from 'lucide-react';/.test(s) && /<ChevronDown aria-hidden="true"/.test(s),
    noSoon: s.length > 0 && !/launchingSoon/.test(s),
    raceReported: /r\.error === 'default_race'/.test(s) && /PACKAGE_FAILURES\.defaultRace/.test(s),
  };
}

function editCells(src) {
  const s = strip(src);
  return {
    feeFocus: /if \(focusFee\) \{\s*const t = setTimeout\(\(\) => feeRef\.current\?\.focus\(\), \d+\);/.test(s) && /<input id="pkg-fee" ref=\{feeRef\}/.test(s),
    nameGate: /if \(!name\.trim\(\)\) \{ setBad\('name'\); setGate\(PACKAGE_FAILURES\.nameGate\); return; \}/.test(s),
    remainderGate: /d \+ \(takeMiddle \? m : 0\) >= 100\) \{\s*setBad\('remainder'\); setGate\(PACKAGE_FAILURES\.remainderGate\); return;/.test(s),
    refusal: /setGate\(field === 'remainder' \? PACKAGE_FAILURES\.remainderGate : field === 'name' \? PACKAGE_FAILURES\.nameGate : PACKAGE_FAILURES\.fieldGate\)/.test(s),
    saved: /onToast\(PACKAGES\.saved\); onSaved\(r\.package\); onClose\(\);/.test(s) && /onToast\(PACKAGE_FAILURES\.saveFailed, 'error'\)/.test(s),
    writers: /pkg \? await updatePackage\(pkg\.id, body\) : await createPackage\(body\)/.test(s),
    middleOmitted: /\.\.\.\(takeMiddle \? \{ middle_pct: m \} : \{\}\),/.test(s) && !/^\s*middle_pct: m,\s*$/m.test(s),
    basisOptions: /<option value="on_the_day">\{PACKAGES\.dOnTheDay\}<\/option>\s*<option value="days">\{PACKAGES\.dDays\}<\/option>\s*<option value="handover">\{PACKAGES\.dHandover\}<\/option>/.test(s),
  };
}

function cardCells(src, shellSrc) {
  const s = strip(src);
  const sh = strip(shellSrc);
  return {
    serverMoney: /\{scheduleRow\(row\.kind, row\.pct, formatRs\(row\.amount\), row\.due_on\)\}/.test(s) && /\{formatRs\(lp\.total\)\}/.test(s)
      && !/\*\s*\d|\/\s*100|Math\.(round|floor|ceil)/.test(s),
    tells: /lp\.snapshot\.tells\.includes\('middle_folded'\) && \([\s\S]*?\{LEAD_PACKAGE\.folded\}/.test(s)
      && /lp\.snapshot\.tells\.includes\('counted_from_wedding'\) && \([\s\S]*?\{LEAD_PACKAGE\.counted\}/.test(s),
    delivery: /\{LEAD_PACKAGE\.delivery\(packageDate\(lp\.delivery_on\)\)\}/.test(s),
    // [amended, packet 3f · R-43.16] the A9 line is a NeedFirst control built by needFor(code).
    refusals: /if \(isRefusal\(code\)\) \{\s*setNeed\(needFor\(code\)\);/.test(s) && /onToast\(PACKAGE_FAILURES\.attachFailed, 'error'\)/.test(s)
      && /if \(!chosen\) \{ setNeed\(needFor\('no_package'\)\);/.test(s),
    // AMENDED AT CE-44 (R-44.13). The field used to follow the PACKAGE's basis, because
    // the sheet could not change it. F-44.6 gave her that control, so the field must now
    // follow HER choice — `basis`, the sheet's own state, seeded from the package. The
    // guard it proves is unchanged: the handover date appears only on a handover basis.
    handoverOnly: /\{chosen && basis === 'handover' && \(\s*<div>\s*<FieldLabel text=\{LEAD_PACKAGE\.fHandover\}/.test(s),
    // [amended, packet 3g · F-43.107] the list comes from the room's read-once cache (`list`).
    defaultPick: /(r\.packages|list)\.find\(\(p\) => p\.is_default\)/.test(s),
    onlyChanged: /if \(total != null && total !== chosen\.total\) body\.total = total;/.test(s) && /if \(name\.trim\(\) !== chosen\.name\) body\.name = name\.trim\(\);/.test(s),
    mounted: /const detailTop = slice === 'leads' && sel \? \(\s*<LeadPackageCard leadId=\{sel\.id\}/.test(sh) && /detailTop=\{detailTop\}/.test(sh),
    changeLabel: /\{lp \? LEAD_PACKAGE\.change : LEAD_PACKAGE\.attach\}/.test(s),
    cardButton: /<button type="button" style=\{actionButton\(\)\} onClick=\{\(\) => setSheetOpen\(true\)\}>/.test(s),
  };
}

// F-43.79 (P2b): the shared button form and Add item.
function fieldsCells(src) {
  const s = strip(src);
  return {
    form: /export function actionButton\(tone: 'accent' \| 'mute' = 'accent'\): CSSProperties \{[\s\S]*?border: `0\.5px solid \$\{c\}`, borderRadius: 2,\s*minHeight: 40,/.test(s),
    addItem: /style=\{\{ \.\.\.actionButton\(\), alignSelf: 'flex-start' \}\}[^>]*>\{PACKAGES\.fAddItem\}/.test(s) || /style=\{\{ \.\.\.actionButton\(\), alignSelf: 'flex-start' \}\} onClick=\{\(\) => onItems\(\[\.\.\.items, \{ label: '', detail: '' \}\]\)\}>\{PACKAGES\.fAddItem\}/.test(s),
  };
}

const LITERAL = /#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/;
function tokenCells(files) { return files.every((f) => f.length > 0 && !LITERAL.test(strip(f))); }

(async () => {
  const src = Object.fromEntries(Object.entries(F).map(([k, v]) => [k, read(v)]));

  sec('§1 · the copy home, driven');
  const c = copyCells(src.copy);
  if (c.err) console.log('  (' + c.err + ')');
  ok(c.p6to12 === true, '§1.1 P6 Save/Cancel, P7, P8, P9, P10 (with "Handover date"), P12 verbatim');
  ok(c.a === true, '§1.2 A2 Change package, A3, A4, A6, A7, A8 verbatim');
  ok(c.a9 === true, "§1.3 A9's four lines, the fourth F25's");
  ok(c.vetoAt30 === true, '§1.4 at 30/30 the schedule labels are the vetoed bytes exactly');
  ok(c.ownShares === true, "§1.5 F26: the labels carry the package's own shares");
  ok(c.fullMonth === true, '§1.6 R-42.13: full month, read in UTC');
  ok(c.row === true, '§1.7 one A5 row: label · rupees · full date');
  ok(c.numerals === true, '§1.8 F21: shares until every part is priced, rupees after; two parts with middle off');
  ok(c.pending === true, '§1.9 the eight PENDING failure bytes are present, each a sentence');

  sec('§2 · the API client, driven');
  const a = await apiCells(src.api);
  if (a.err) console.log('  (' + a.err + ')');
  ok(a.paths === true, '§2.1 six calls, the right verb and path each, ids encoded');
  ok(a.bodies === true, '§2.2 the bodies pass through untouched');

  sec('§3 · the room (C-43.16)');
  const p = pageCells(src.page);
  ok(p.folded, '§3.1 every package starts folded; nothing opens on arrival');
  ok(p.feePair, '§3.2 condition 2: the dashed "Fee not set" is a button that opens the edit sheet on Fee, and only it is dashed');
  ok(p.feeSet, '§3.3 a set fee is a plain figure, not a button');
  ok(p.bar, "§3.4 the bar draws the server's split with the accent and ink tokens at reduced opacity");
  ok(p.numerals, '§3.5 the numerals come from splitNumerals');
  ok(p.noDateInRoom, '§3.6 F21: no date in the room');
  ok(p.summary, '§3.7 the summary is the first three detail values, joined');
  ok(p.actions, '§3.8 Delete sits right in the muted ink, behind P7');
  ok(p.defaultRule, '§3.9 the default carries the accent rule and the chip under its name');
  ok(p.addTile, '§3.10 Add package is a dashed tile that opens the sheet');
  ok(p.chevron, '§3.11 the fold uses ChevronDown from lucide-react');
  ok(p.noSoon, '§3.12 the room no longer says Launching soon.');
  ok(p.raceReported, '§3.13 a default race is reported with its own line and the list reloads');
  ok(p.buttonForm, '§3.14 F-43.79: the actions and P7 are outlined buttons (2px, 40px); the fee affordance stays dashed text');

  sec('§4 · the edit sheet');
  const e = editCells(src.edit);
  ok(e.feeFocus, '§4.1 opened from the fee, the Fee field takes focus');
  ok(e.nameGate, '§4.2 a blank name stops before the door');
  ok(e.remainderGate, '§4.3 shares that leave no remainder stop before the door');
  ok(e.refusal, "§4.4 the door's field refusal flags the field and says the matching line");
  ok(e.saved, '§4.5 saved says P12 and closes; a failure says saveFailed');
  ok(e.writers, '§4.6 create for a new package, update for an existing one');
  ok(e.basisOptions, '§4.7 P10: the three delivery options in order');
  ok(e.middleOmitted, '§4.8 F-43.78: with the middle payment off, the share is not sent');

  sec('§5 · the lead card and attach sheet');
  const k = cardCells(src.card, src.shell);
  ok(k.serverMoney, "§5.1 the card renders the server's amounts and dates and computes nothing");
  ok(k.tells, '§5.2 A6 and A7 appear only when the server names them');
  ok(k.delivery, '§5.3 A8 with the full-month date');
  ok(k.refusals, "§5.4 refusals map to A9 by code; no package is A9's first line; anything else is attachFailed");
  ok(k.handoverOnly, '§5.5 F25: the handover date field appears only for a handover package');
  ok(k.defaultPick, '§5.6 the default package is preselected');
  ok(k.onlyChanged, "§5.7 F23: only the couple's changed edits are sent");
  ok(k.mounted, '§5.8 SliceShell mounts the card on the leads detail');
  ok(k.changeLabel, '§5.9 A2: Attach package when none, Change package when one is attached');
  ok(k.cardButton, '§5.10 F-43.79: Attach package and Change package are outlined buttons');
  {
    const fc = fieldsCells(src.fields);
    ok(fc.form, '§5.11 F-43.79: the shared button form is outlined, 2px corners, 40px tap height');
    ok(fc.addItem, '§5.12 F-43.79: Add item is an outlined button');
  }

  sec('§6 · tokens only (R-42.6)');
  ok(tokenCells([src.page, src.fields, src.edit, src.card, src.copy]), '§6.1 no colour literal in the room, the sheets, the card or the copy home');

  sec('§7 · the icon');
  {
    const pkg = JSON.parse(read('package.json') || '{}');
    const dep = (pkg.dependencies || {})['lucide-react'];
    let has = false;
    try { has = typeof require(path.join(ROOT, 'node_modules', 'lucide-react')).ChevronDown !== 'undefined'; } catch { has = false; }
    ok(!!dep && has, '§7.1 lucide-react is an existing dependency and ships ChevronDown');
  }

  sec('§8 · mutations of production source');
  const mut = (s, x, y) => (s.includes(x) ? s.replace(x, y) : null);
  const muts = [
    [src.copy, "if (kind === 'deposit') return `Deposit, ${pct}% of the fee, on booking`;", "if (kind === 'deposit') return 'Deposit, 30% of the fee, on booking';", (m) => copyCells(m).ownShares !== true, 'M1 a hard-coded 30 → §1.5 RED'],
    [src.copy, "const FULL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',\n  'August', 'September', 'October', 'November', 'December'] as const;", "const FULL_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;", (m) => copyCells(m).fullMonth !== true, 'M2 short months → §1.6 RED'],
    [src.copy, "const priced = parts.length > 0 && parts.every((p) => typeof p.amount === 'number');", "const priced = parts.some((p) => typeof p.amount === 'number');", (m) => copyCells(m).numerals !== true, 'M3 rupees shown on a part-priced split → §1.8 RED'],
    [src.copy, "    no_handover_date: 'Add the handover date first.',\n", '', (m) => copyCells(m).a9 !== true, "M4 A9's fourth line removed → §1.3 RED"],
    [src.page, 'const [open, setOpen] = useState<Record<string, boolean>>({});', "const [open, setOpen] = useState<Record<string, boolean>>({ all: true });\n  useEffect(() => { if (packages) setOpen(Object.fromEntries(packages.map((x) => [x.id, true]))); }, [packages]);", (m) => !pageCells(m).folded, 'M5 cards open on arrival → §3.1 RED'],
    [src.page, 'onClick={() => setSheet({ pkg: p, focusFee: true })}>{PACKAGES.feeUnset}', '>{PACKAGES.feeUnset}', (m) => !pageCells(m).feePair, 'M6 a dashed fee with no handler (a false tell) → §3.2 RED'],
    [src.page, '<span className="pkg-numerals">{splitNumerals(parts, formatRs)}</span>', '<span className="pkg-numerals">{parts.map((q) => q.pct).join(\' · \')}</span>', (m) => !pageCells(m).numerals, 'M7 numerals that never show rupees → §3.5 RED'],
    [src.page, 'className="pkg-act pkg-act--quiet pkg-act--right" onClick={() => setConfirming(p.id)}', 'className="pkg-act pkg-act--quiet pkg-act--right" onClick={() => { void remove(p); }}', (m) => !pageCells(m).actions, 'M8 Delete without P7 → §3.8 RED'],
    [src.edit, "if (!name.trim()) { setBad('name'); setGate(PACKAGE_FAILURES.nameGate); return; }", '', (m) => !editCells(m).nameGate, 'M9 the name gate removed → §4.2 RED'],
    [src.edit, "      const t = setTimeout(() => feeRef.current?.focus(), 340);", '      const t = setTimeout(() => {}, 340);', (m) => !editCells(m).feeFocus, 'M10 the fee focus dropped → §4.1 RED'],
    [src.card, '{scheduleRow(row.kind, row.pct, formatRs(row.amount), row.due_on)}', '{scheduleRow(row.kind, row.pct, formatRs(Math.round(lp.total * row.pct / 100)), row.due_on)}', (m) => !cardCells(m, src.shell).serverMoney, 'M11 the card computing money → §5.1 RED'],
    [src.card, '{lp.snapshot.tells.includes(\'middle_folded\') && (', '{true && (', (m) => !cardCells(m, src.shell).tells, 'M12 the fold tell always shown → §5.2 RED'],
    [src.card, "      {chosen && basis === 'handover' && (\n        <div>\n          <FieldLabel text={LEAD_PACKAGE.fHandover}", "      {chosen && (\n        <div>\n          <FieldLabel text={LEAD_PACKAGE.fHandover}", (m) => !cardCells(m, src.shell).handoverOnly, 'M13 the handover field on every package → §5.5 RED'],
    [src.card, "color: T.ink, whiteSpace: 'nowrap' }}>{formatRs(lp.total)}", "color: '#0E1112', whiteSpace: 'nowrap' }}>{formatRs(lp.total)}", (m) => !tokenCells([src.page, src.fields, src.edit, m, src.copy]), 'M14 a colour literal on the card → §6.1 RED'],
  ];
  muts.push(
    [src.page, '.pkg-act{background:transparent;border:.5px solid var(--atelier-accent-text);border-radius:2px;padding:0 14px;', '.pkg-act{background:none;border:none;padding:8px 0;', (m) => !pageCells(m).buttonForm, 'M15 the actions back to plain text → §3.14 RED (F-43.79)'],
    [src.edit, '...(takeMiddle ? { middle_pct: m } : {}),', 'middle_pct: m,', (m) => !editCells(m).middleOmitted, 'M16 the share sent with the middle payment off → §4.8 RED (F-43.78)'],
    [src.card, '<button type="button" style={actionButton()} onClick={() => setSheetOpen(true)}>', '<button type="button" style={textButton()} onClick={() => setSheetOpen(true)}>', (m) => !cardCells(m, src.shell).cardButton, 'M17 the card button back to text → §5.10 RED (F-43.79)'],
    [src.fields, "style={{ ...actionButton(), alignSelf: 'flex-start' }}", "style={{ ...textButton(), alignSelf: 'flex-start' }}", (m) => !fieldsCells(m).addItem, 'M18 Add item back to text → §5.12 RED (F-43.79)'],
  );
  for (const [base, x, y, bites, label] of muts) {
    const m = mut(base, x, y);
    let red = false;
    if (m !== null) { try { red = await bites(m); } catch { red = true; } }
    ok(red, `§8 ${label}`);
  }

  console.log(`\n════════  b81_lc2_p2_room_bench: ${pass} passed, ${fail} failed  ════════`);
  if (fail) { console.log('RED:'); fails.forEach((f) => console.log('   · ' + f)); process.exit(1); }
})().catch((e) => { console.error('BENCH ERROR', e); process.exit(2); });
