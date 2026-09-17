#!/usr/bin/env node
'use strict';
// scripts/b82_lc2_p3_booking_bench.js — TDW CE-43 · LC-2 · packet 3 (dreamos-pwa) · the booking sheet
// (A12, F15(a)), the Clients sheet on POST /clients/direct (R-43.5, F28(b), C4, C5, F29), F16 and F17
// on the Invoices room (F-43.86 (a1), (b1), (c2)), and C-43.16's outlined Cancel. Rung b82, chair-
// allocated. Runnable from any directory. Exit 0 green, 1 red, 3 refused (node_modules absent).
//
//   §1 the copy home, DRIVEN: A2's booking bytes, A12, A13, C4, C5, F29, D3/D4, the IST day of a
//      timestamp; the header cites the veto record in the tree (F-43.84).
//   §2 the API client, DRIVEN through the real vendor.ts over request doubles: the two booking doors,
//      the milestone carried through recordPayment (F17), and the DELETE code's type (b1).
//   §3 the booking sheet: the act, the kinds, the date only on Advance paid, A9 by code, F29 otherwise,
//      A13 with the five slices refreshed, Cancel outlined in the muted ink.
//   §4 the shell: the swipe opens the sheet and no bare booked write survives (F15(a)); one sheet
//      mount on Leads; the card is told booked and handed onBook; F16 hides Remove on a booking's
//      invoice and maps PACKAGE_SCHEDULE; F17 speaks D3/D4 only after the answer; other invoices keep
//      "marked fully paid".
//   §5 the lead card: the booking controls only once a package is attached and the lead is not
//      booked; both sheets' Cancel outlined in the muted ink (C-43.16).
//   §6 the Clients sheet: the one write, the switch, Received on only on yes, the outcomes, the
//      field flags; the room refetches on done.
//   §7 the invoice row carries isPackage off lead_package_id; the types carry the two new fields.
//   §8 tokens only in every new or touched component (R-42.6).
//   §9 mutations of production source, each turning its named cell RED.
// AMENDED BY LABEL AT PACKET 3c (CE-43 LC-2r, chair-ruled): §4.8 (F-43.88's guarded call), §5.1 to
// §5.3 (3(a)/4(a): the booking controls always present, attach first when no package), M10, M12,
// M13 re-aimed; §10 added for F-43.88, F-43.89, 1(a) and point 7.
// AMENDED BY LABEL AT PACKET 3d (CE-43 LC-2r, chair-ruled): §4.1 and M7 (F-43.95: the swipe is withheld
// on a booked lead), §5.1, §5.2 and M12 (F-43.97: the controls column), §10.9's stub (the thread now
// imports the copy home); §11 added for F-43.93 point 6, F-43.94, F-43.95, F-43.96 and F-43.97.
// NOT PROVEN HERE (declared): rendering on a device, both themes on glass, the gesture under a thumb,
// `next build`, and the database. The founder's walk (card P3) and provisional floor are their witnesses.
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
const mut = (src, from, to) => (src.includes(from) ? src.replace(from, to) : null);

const F = {
  copy: 'lib/worklist/packages.ts',
  api: 'lib/vendor/api/vendor.ts',
  types: 'lib/vendor/types/vendor.ts',
  booking: 'components/vendor/packages/BookingSheet.tsx',
  card: 'components/vendor/packages/LeadPackageCard.tsx',
  edit: 'components/vendor/packages/PackageEditSheet.tsx',
  shell: 'components/vendor/slices/SliceShell.tsx',
  row: 'components/vendor/slices/SliceRow.tsx',
  sheet: 'components/vendor/ClientBookingSheet.tsx',
  clients: 'app/vendor/(shell)/clients/body.tsx',
  invoices: 'app/vendor/(shell)/invoices/body.tsx',
};
const src = Object.fromEntries(Object.entries(F).map(([k, v]) => [k, read(v)]));

function loadModule(code, stubs = {}) {
  const out = ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', out)((spec) => (spec in stubs ? stubs[spec] : require(spec)), mod, mod.exports);
  return mod.exports;
}

function copyCells(code) {
  const r = {};
  try {
    const m = loadModule(code);
    const L = m.LEAD_PACKAGE, B = m.BOOKING, C = m.CLIENT_BOOKING;
    r.a2 = L.bookingConfirmed === 'Booking confirmed' && L.advancePaid === 'Advance paid';
    r.a12 = !!B && B.confirm === 'Confirm booking' && B.receivedOn === 'Advance received on';
    r.a13 = !!B && B.booked === 'Booked. The client, the event and the invoice are ready.';
    r.f29 = !!B && B.failed === 'Could not confirm the booking.';
    r.c4c5 = C.added === 'Added. The client, the event and the invoice are ready.' && C.savedAsLead === 'Saved as a lead. Finish the booking from Leads.';
    r.d3 = typeof m.paymentMarked === 'function'
      && m.paymentMarked({ client: 'Sarah', label: '30% one month before the first function (optional)', amount: 'Rs 24,000', date: '18 September 2026', nextDue: '5 February 2027' })
        === 'Payment marked: Sarah · 30% one month before the first function (optional) · Rs 24,000 · 18 September 2026. Next due 5 February 2027.';
    r.d4 = typeof m.paymentMarked === 'function'
      && m.paymentMarked({ client: 'Sarah', label: 'x', amount: 'Rs 1', date: '1 January 2027', nextDue: null }) === 'Payment marked: Sarah · paid in full.';
    r.istDay = typeof m.istDateOf === 'function'
      && m.istDateOf('2026-09-17T18:30:00+00:00') === '2026-09-18'
      && m.istDateOf('2026-09-18T00:00:00+05:30') === '2026-09-18'
      && m.istDateOf('2026-09-17T18:29:59Z') === '2026-09-17'
      && m.istDateOf(null) === null && m.istDateOf('nonsense') === null;
    r.cites = /TDW_CE43_LC2_P3_HANDOVER\.md, Appendix/.test(code) && !/verbatim from the veto record/.test(code) && !/PENDING THE CHAIR/.test(code);
    r.noSend = !('sendQuote' in L) && !/Send quote/.test(strip(code));
  } catch (e) { r.err = e.message; }
  return r;
}

async function apiCells(code) {
  const r = {};
  try {
    const calls = [];
    let answer = { ok: true };
    const rec = (verb) => async (p, body) => { calls.push({ verb, p, body }); return answer; };
    const stubs = {
      './_base': { getJson: rec('GET'), postJson: rec('POST'), patchJson: rec('PATCH'), deleteJson: rec('DELETE'), API_BASE: '', getAuthHeader: () => ({}), handleResponse: async () => ({}) },
      '@/lib/solutions/routes': { API: new Proxy({}, { get: () => '' }) },
      '@/lib/vendor/session': { getVendorSession: () => ({ id: 'v1' }), setVendorSession: () => {}, clearVendorSession: () => {} },
      '@/lib/worklist/feed': { refreshToday: () => {} },
    };
    const api = loadModule(code, stubs);
    await api.promoteLead('l 1', { kind: 'advance_paid', advance_received_on: '2026-09-18' });
    await api.createDirectClient({ name: 'Meena', wedding_date: '2026-12-10', package_id: 'p1', advance_received: false });
    r.paths = calls.map((c) => `${c.verb} ${c.p}`).join('|') === 'POST /api/v2/vendor/leads/l%201/promote|POST /api/v2/vendor/clients/direct';
    r.bodies = JSON.stringify(calls[0].body) === '{"kind":"advance_paid","advance_received_on":"2026-09-18"}'
      && JSON.stringify(calls[1].body) === '{"name":"Meena","wedding_date":"2026-12-10","package_id":"p1","advance_received":false}';
    const ms = { id: 'm2', milestone_label: 'L', amount_due: 24000, paid_amount: 24000, paid_at: '2026-09-17T18:30:00+00:00', state: 'paid' };
    answer = { ok: true, invoice: { id: 'i1', state: 'advance_paid', due_date: '2027-02-05' }, transitioned: false, balance: 32000, milestone: ms };
    const pay = await api.recordPayment('i1', { amount: 56000 });
    r.milestone = pay.ok && pay.milestone && pay.milestone.id === 'm2' && pay.payment_recorded === 24000;
    answer = { ok: true, invoice: { id: 'i2', state: 'paid', due_date: null }, transitioned: true, balance: 0 };
    const plain = await api.recordPayment('i2', { amount: 500 });
    r.plain = plain.ok && plain.payment_recorded === 500 && plain.milestone === undefined;
    r.deleteCode = /Promise<\{ ok: boolean; deleted: boolean \} \| \(ApiErr & \{ code\?: string \}\)>/.test(code);
  } catch (e) { r.err = e.message; }
  return r;
}

function bookingCells(code) {
  const s = strip(code);
  return {
    exists: s.length > 0,
    act: /await promoteLead\(leadId, kind === 'advance_paid' \? \{ kind, advance_received_on: receivedOn \} : \{ kind \}\)/.test(s),
    kinds: /kindButton\('booking_confirmed', LEAD_PACKAGE\.bookingConfirmed\)/.test(s) && /kindButton\('advance_paid', LEAD_PACKAGE\.advancePaid\)/.test(s),
    dateOnlyAdvance: /\{kind === 'advance_paid' && \(\s*<div>\s*<FieldLabel text=\{BOOKING\.receivedOn\}/.test(s),
    todayDefault: /setReceivedOn\(istTodayISO\(\)\)/.test(s),
    a9: /if \(isRefusal\(code\)\) setMessage\(LEAD_PACKAGE\.refusals\[code\]\);/.test(s),
    f29: /else setMessage\(BOOKING\.failed\);/.test(s) && /catch \{\s*setMessage\(BOOKING\.failed\);/.test(s),
    a13: /if \(r && r\.ok\) \{\s*refreshAfterBooking\(\);\s*onToast\(BOOKING\.booked, 'success'\);/.test(s),
    fiveSlices: ['leads', 'cabinet', 'clients', 'events', 'invoices'].every((k) => new RegExp(`invalidateSlice\\('${k}'\\)`).test(s)),
    cancel: /<button type="button" style=\{actionButton\('mute'\)\} onClick=\{onClose\}>\{PACKAGES\.cancel\}<\/button>/.test(s),
    title: /title=\{BOOKING\.confirm\}/.test(s) && /\{BOOKING\.confirm\}<\/button>/.test(s),
    noWriteElse: s.length > 0 && !/(patchLeadState|postJson|fetch\()/.test(s),
  };
}

function shellCells(code) {
  const s = strip(code);
  return {
    // [amended, 3d] F-43.95: the same opener, withheld on a booked lead.
    swipe: /right: \(row\.badge \?\? ''\)\.toLowerCase\(\) === 'booked'\s*\?\s*undefined\s*:\s*\{ label: 'Booked', onTrigger: \(\) => setBooking\(\{ leadId: row\.id, kind: 'booking_confirmed' \}\) \}/.test(s),
    noBareBooked: s.length > 0 && !/patchLeadState\([^)]*'booked'\)/.test(s),
    mountOnce: (s.match(/<BookingSheet\b/g) || []).length === 1 && /\{slice === 'leads' && \(\s*<BookingSheet/.test(s),
    cardProps: /<LeadPackageCard leadId=\{sel\.id\}\s*booked=\{\(sel\.badge \?\? ''\)\.toLowerCase\(\) === 'booked'\}\s*onBook=\{\(k\) => setBooking\(\{ leadId: sel\.id, kind: k \}\)\}/.test(s),
    f16: /schedule && schedule\.length > 0 && !removeSchedule && !sel\.isPackage && \(/.test(s),
    b1: /showToast\(res\.code === 'PACKAGE_SCHEDULE' \? COPY\.studioScheduleRemoveFailed : \(res\.error \?\? COPY\.studioScheduleRemoveFailed\), 'error'\)/.test(s),
    f17: /if \(row\.isPackage\) \{[\s\S]{0,400}try \{ r = await recordPayment\(row\.id, \{ amount: owed \}\); \}[\s\S]{0,200}if \(!\('ok' in r\) \|\| !r\.ok \|\| !r\.invoice\) \{[\s\S]{0,200}showToast\([^;]*'error'\); return;\s*\}[\s\S]{0,120}invalidateSlice\('invoices'\);[\s\S]{0,400}showToast\(paymentMarked\(\{/.test(s),
    // packet 3c · F-43.88
    guardOnce: /if \(packagePayBlocked\(row\)\) return;\s*payingRef\.current\.add\(row\.id\);\s*setBadge\(row\.id, 'paid'\);/.test(s)
      && /const packagePayBlocked = \(row: Row\) => !!row\.isPackage && \(payingRef\.current\.has\(row\.id\) \|\| settledRef\.current\.has\(row\.id\)\);/.test(s),
    failRestores: /payingRef\.current\.delete\(row\.id\);\s*if \(!\('ok' in r\) \|\| !r\.ok \|\| !r\.invoice\) \{\s*setBadge\(row\.id, null\);/.test(s),
    settles: /if \(paidInFull\) settledRef\.current\.add\(row\.id\); else setBadge\(row\.id, null\);/.test(s),
    hidden: /right: packagePayBlocked\(row\) \? undefined : \{ label: COPY\.studioMarkPaid/.test(s)
      && /\(row\.payAmount \?\? 0\) > 0 && !packagePayBlocked\(row\) && \(/.test(s)
      && /if \(owed <= 0 \|\| \(row && packagePayBlocked\(row\)\)\) \{ ok = true; \}/.test(s),
    noNewByte: !/Already settled\.[\s\S]{0,40}packagePayBlocked/.test(s),
    // packet 3c · 1(a) and point 7
    detailTop: /const detailTop = slice === 'leads' && sel \? \(\s*<LeadPackageCard leadId=\{sel\.id\}/.test(s) && /detailTop=\{detailTop\}/.test(s)
      && !/detailExtra = \([\s\S]*?<LeadPackageCard/.test(s.slice(s.indexOf('const detailExtra = ('), s.indexOf('const detailExtra = (') + 20000)),
    leadName: /<ConversationThread vendorSummary=\{leadDetail\.vendor_summary\} messages=\{leadDetail\.conversation\} leadName=\{leadDetail\.name\} \/>/.test(s)
      && /name: \(res\.lead && res\.lead\.name\) \|\| null/.test(s),
    f17Fields: /nextDue: paidInFull \? null : packageDate\(r\.invoice\.due_date\)/.test(s) && /const paidInFull = r\.invoice\.state === 'paid' \|\| !r\.invoice\.due_date;/.test(s)
      && /date: packageDate\(m && m\.paid_at \? istDateOf\(m\.paid_at\) : null\)/.test(s) && /label: m \? m\.milestone_label : ''/.test(s),
    f17Returns: /\}\)\(\);\s*return;\s*\}\s*undoableMutation\(\{/.test(s),
    plainKept: /toastMsg: `\$\{row\.secondary \?\? row\.primary\} marked fully paid\.` \}\);/.test(s),
    onBooked: /if \(id\) setSel\(\(cur\) => \(cur && cur\.id === id \? \{ \.\.\.cur, badge: 'booked' \} : cur\)\);/.test(s),
  };
}

function cardCells(code, editCode) {
  const s = strip(code);
  const e = strip(editCode);
  return {
    // [amended, packet 3c · 3(a)/4(a)] always present on a lead that is not booked (once the card has
    // read), outside the attached block; with no package the control opens the attach sheet first.
    // [amended, 3d · F-43.97] inside the one control column, under Attach/Change, on every lead that
    // is not booked (once the card has read), after the attached block.
    gated: /\{!booked && onBook && \(\s*<div data-lc2="lead-booking-controls"/.test(s)
      && /\{lp !== undefined && \(\s*<div data-lc2="lead-package-controls"/.test(s),
    insideAttached: s.indexOf('data-lc2="lead-booking-controls"') > s.indexOf('data-lc2="lead-package-controls"')
      && s.indexOf('data-lc2="lead-package-controls"') > s.indexOf('data-lc2="lead-package-attached"')
      && s.indexOf('data-lc2="lead-package-attached"') > 0,
    // 3d · F-43.97
    column: /data-lc2="lead-package-controls" style=\{\{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 \}\}>\s*<button type="button" style=\{actionButton\(\)\} onClick=\{\(\) => setSheetOpen\(true\)\}>\s*\{lp \? LEAD_PACKAGE\.change : LEAD_PACKAGE\.attach\}/.test(s),
    pair: /data-lc2="lead-booking-controls" style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 \}\}/.test(s)
      && (s.match(/style=\{\{ \.\.\.actionButton\(\), width: '100%' \}\} onClick=\{\(\) => book\(/g) || []).length === 2,
    hairline: /data-lc2="lead-package" style=\{\{ paddingBottom: 18, marginBottom: 8, borderBottom: `0\.5px solid \$\{T\.card\}` \}\}/.test(s)
      && (s.match(/LEAD_PACKAGE\.change : LEAD_PACKAGE\.attach/g) || []).length === 1,
    both: /onClick=\{\(\) => book\('booking_confirmed'\)\}>\{LEAD_PACKAGE\.bookingConfirmed\}/.test(s) && /onClick=\{\(\) => book\('advance_paid'\)\}>\{LEAD_PACKAGE\.advancePaid\}/.test(s)
      && /const book = \(k: BookingKind\) => \{\s*if \(!onBook\) return;\s*if \(lp\) \{ onBook\(k\); return; \}\s*setPendingKind\(k\);\s*setSheetOpen\(true\);\s*\};/.test(s),
    continues: /if \(pendingKind && onBook\) onBook\(pendingKind\);\s*setPendingKind\(null\);/.test(s)
      && /onClose=\{\(\) => \{ setSheetOpen\(false\); setPendingKind\(null\); \}\}/.test(s),
    attachCancel: /<button type="button" style=\{actionButton\('mute'\)\} onClick=\{onClose\}>\{PACKAGES\.cancel\}<\/button>/.test(s),
    editCancel: /<button type="button" style=\{actionButton\('mute'\)\} onClick=\{onClose\}>\{PACKAGES\.cancel\}<\/button>/.test(e),
    noTextCancel: !/textButton\('mute'\)\} onClick=\{onClose\}/.test(s + e),
    cardWrites: !/(promoteLead|patchLeadState)/.test(s),
  };
}

function sheetCells(code, clientsCode) {
  const s = strip(code);
  const c = strip(clientsCode);
  return {
    oneWrite: /const r = await createDirectClient\(body\);/.test(s) && !/(createClient\(|createLead|postJson|patchJson|fetch\(|promoteLead)/.test(s),
    switchF28: /<input type="checkbox" checked=\{advance\} onChange=\{\(e\) => setAdvance\(e\.target\.checked\)\}/.test(s) && /\{CLIENT_BOOKING\.advance\}/.test(s),
    receivedOnlyYes: /\{advance && \(\s*<div>\{label\(CLIENT_BOOKING\.receivedOn\)\}/.test(s) && /if \(advance\) body\.received_on = values\.receivedOn;/.test(s),
    noAmount: !/advance_amount|amount_advance/.test(s),
    feeOnlyWhenNeeded: /if \(needsFee\) body\.fee = Number\(values\.fee\);/.test(s),
    c4: /if \(r && r\.ok\) \{\s*refreshAfterBooking\(\);\s*onToast\(CLIENT_BOOKING\.added, 'success'\);/.test(s),
    c5: /if \(err === 'saved_as_lead'\) \{\s*refreshAfterBooking\(\);\s*onToast\(CLIENT_BOOKING\.savedAsLead, 'error'\);[\s\S]{0,120}onClose\(\);/.test(s),
    f29: /else setMessage\(BOOKING\.failed\);/.test(s) && /catch \{\s*setMessage\(BOOKING\.failed\);/.test(s),
    gates: /const gate = \(f: Field\) => \{ setBad\(f\); setMessage\(PACKAGE_FAILURES\.fieldGate\); \};/.test(s)
      && /if \(err === 'invalid' && field\) gate\(field\);/.test(s),
    refetch: /onDone=\{cab\.refresh\}/.test(c),
  };
}

function rowCells(invCode, rowCode, typesCode) {
  return {
    isPackage: /isPackage: !!inv\.lead_package_id/.test(strip(invCode)),
    rowType: /isPackage\?: boolean;/.test(rowCode),
    invType: /lead_package_id\?: string \| null;/.test(typesCode),
    msType: /milestone\?: +PaidMilestone;/.test(typesCode) && /export interface PaidMilestone \{/.test(typesCode),
  };
}

const tokensOnly = (code) => code.length > 0 && !/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/.test(strip(code));

(async () => {
  sec('§1 · the copy home, driven');
  const c1 = copyCells(src.copy);
  if (c1.err) console.log('  (copy home did not load: ' + c1.err + ')');
  ok(c1.a2, '§1.1 A2: Booking confirmed · Advance paid');
  ok(c1.a12, '§1.2 A12: Confirm booking · Advance received on');
  ok(c1.a13, '§1.3 A13 verbatim');
  ok(c1.f29, '§1.4 F29 verbatim');
  ok(c1.c4c5, '§1.5 C4 and C5 verbatim');
  ok(c1.d3, '§1.6 D3 verbatim, the label and figures as data');
  ok(c1.d4, '§1.7 D4 after the last milestone');
  ok(c1.istDay, '§1.8 a stored timestamp reads as its IST calendar day');
  ok(c1.cites, '§1.9 F-43.84: the header cites the veto record in the tree; no deferral, no PENDING label');
  ok(c1.noSend, '§1.10 wire-or-delete: packet 4\'s Send quote is not in the home yet');

  sec('§2 · the API client, driven');
  const c2 = await apiCells(src.api);
  if (c2.err) console.log('  (api did not load: ' + c2.err + ')');
  ok(c2.paths, '§2.1 POST /leads/:leadId/promote (encoded) and POST /clients/direct');
  ok(c2.bodies, '§2.2 the bodies are sent as given');
  ok(c2.milestone, '§2.3 F17: recordPayment carries the paid milestone and its own amount');
  ok(c2.plain, '§2.4 any other invoice: the body figure, no milestone');
  ok(c2.deleteCode, '§2.5 F-43.86 (b1): deleteSchedule\'s failure type carries the code');

  sec('§3 · the booking sheet (A12)');
  const c3 = bookingCells(src.booking);
  ok(c3.exists, '§3.1 BookingSheet.tsx exists');
  ok(c3.act, '§3.2 the act is promoteLead; the date rides only with Advance paid');
  ok(c3.kinds, '§3.3 the kind is chosen with A2\'s two controls');
  ok(c3.dateOnlyAdvance, '§3.4 Advance received on shows only for Advance paid');
  ok(c3.todayDefault, '§3.5 the date starts at today (IST)');
  ok(c3.a9, '§3.6 A9\'s lines by code');
  ok(c3.f29, '§3.7 F29 for anything else, and for a thrown call');
  ok(c3.a13, '§3.8 A13 only after the door answers ok, with the slices refreshed');
  ok(c3.fiveSlices, '§3.9 leads, cabinet, clients, events and invoices refetch');
  ok(c3.cancel, '§3.10 C-43.16: Cancel outlined in the muted ink');
  ok(c3.title, '§3.11 A12 titles the sheet and names the confirm');
  ok(c3.noWriteElse, '§3.12 no other write from the sheet');

  sec('§4 · the shell');
  const c4 = shellCells(src.shell);
  ok(c4.swipe, '§4.1 F15(a): the swipe keeps Booked and opens the booking sheet');
  ok(c4.noBareBooked, '§4.2 F15(a): no bare patchLeadState(…, \'booked\') survives');
  ok(c4.mountOnce, '§4.3 one booking sheet, mounted on Leads');
  ok(c4.cardProps, '§4.4 the card is told booked and handed onBook');
  ok(c4.onBooked, '§4.5 the open detail reads booked at once');
  ok(c4.f16, '§4.6 F16: Remove schedule is not drawn on a booking\'s invoice');
  ok(c4.b1, '§4.7 F-43.86 (b1): PACKAGE_SCHEDULE speaks the room\'s own byte');
  ok(c4.f17, '§4.8 F17 (c2): on a booking\'s invoice the D3/D4 toast follows an ok answer; a failed one returns first');
  ok(c4.f17Fields, '§4.9 F17: label, amount, IST paid day and next due come from the answer; paid in full → D4');
  ok(c4.f17Returns, '§4.10 F17: the booking path returns before the undo path');
  ok(c4.plainKept, '§4.11 other invoices keep "marked fully paid"');

  sec('§5 · the lead card and the outlined Cancels');
  const c5 = cardCells(src.card, src.edit);
  ok(c5.gated, '§5.1 [amended, 3d] the booking controls show on every lead that is not booked, in the control column');
  ok(c5.insideAttached, '§5.2 [amended, 3d] the column follows the attached block; the pair sits under Attach/Change');
  ok(c5.both, '§5.3 [amended, 3c] each A2 control books at once with a package, or opens the attach sheet first');
  ok(c5.continues, '§5.8 3(a): once the package is attached the chosen booking opens; closing the attach sheet drops it');
  ok(c5.attachCancel, '§5.4 C-43.16: the attach sheet\'s Cancel is outlined in the muted ink');
  ok(c5.editCancel, '§5.5 C-43.16: the edit sheet\'s Cancel is outlined in the muted ink');
  ok(c5.noTextCancel, '§5.6 no text-button Cancel remains in either sheet');
  ok(c5.cardWrites, '§5.7 the card itself writes nothing');

  sec('§6 · the Clients sheet');
  const c6 = sheetCells(src.sheet, src.clients);
  ok(c6.oneWrite, '§6.1 the one write is createDirectClient');
  ok(c6.switchF28, '§6.2 F28(b): Advance received is a yes/no switch');
  ok(c6.receivedOnlyYes, '§6.3 F28(b): Received on shows and is sent only on yes');
  ok(c6.noAmount, '§6.4 F28(b): no advance amount is asked or sent');
  ok(c6.feeOnlyWhenNeeded, '§6.5 F8(a): the fee is sent only when the package has none');
  ok(c6.c4, '§6.6 C4 after an ok answer, slices refreshed');
  ok(c6.c5, '§6.7 C5 on saved_as_lead, slices refreshed, the sheet closes');
  ok(c6.f29, '§6.8 F29 otherwise, the sheet stays open');
  ok(c6.gates, '§6.9 a missing or refused field is flagged with the packet 2 byte');
  ok(c6.refetch, '§6.10 the Clients room refetches when the sheet is done');

  sec('§7 · the invoice row and the types');
  const c7 = rowCells(src.invoices, src.row, src.types);
  ok(c7.isPackage, '§7.1 F-43.86 (a1): the row carries isPackage off lead_package_id');
  ok(c7.rowType, '§7.2 Row declares isPackage');
  ok(c7.invType, '§7.3 Invoice declares lead_package_id');
  ok(c7.msType, '§7.4 RecordPaymentResponse declares the paid milestone');

  sec('§8 · tokens only (R-42.6)');
  ok(tokensOnly(src.booking), '§8.1 BookingSheet.tsx');
  ok(tokensOnly(src.card), '§8.2 LeadPackageCard.tsx');
  ok(tokensOnly(src.sheet), '§8.3 ClientBookingSheet.tsx');

  sec('§10 · packet 3c');
  ok(c4.guardOnce, '§10.1 F-43.88: a tap marks the row paid at once and a second tap while it is out is ignored');
  ok(c4.failRestores, '§10.2 F-43.88: a refused call restores the row before the existing failure byte');
  ok(c4.settles, '§10.3 F-43.88: a fully paid answer settles the row; a part payment clears the badge for the refetch');
  ok(c4.hidden, '§10.4 F-43.88: a settled or in-flight booking invoice has no swipe, no button, and bulk skips it');
  ok(c4.noNewByte, '§10.5 F-43.88: no "Already settled." is added for it');
  const sheetSrc = strip(read('components/vendor/packages/PackageFields.tsx'));
  ok(/role="dialog" aria-modal="true" inert=\{!open\}/.test(sheetSrc) && !/aria-hidden=\{!open\}/.test(sheetSrc), '§10.6 F-43.89: a closed shared sheet is inert, not aria-hidden');
  const detailSrc = strip(read('components/vendor/slices/DetailSheet.tsx'));
  ok(/\{detailTop\}\s*\{\(sel\?\.detail \?\? \[\]\)\.map/.test(detailSrc), '§10.7 1(a): DetailSheet renders detailTop above the detail rows');
  ok(c4.detailTop, '§10.8 1(a): the lead card rides detailTop, and no longer detailExtra');
  const threadSrc = read('components/vendor/ConversationThread.tsx');
  let sender = null;
  // [amended, 3d] the thread imports the copy home and useState; both are stubbed from the real sources.
  const threadStubs = () => ({ react: { useState: (v) => [v, () => {}] }, 'react/jsx-runtime': { jsx: () => null, jsxs: () => null, Fragment: null }, '@/lib/worklist/packages': loadModule(src.copy) });
  let thread = null;
  try { thread = loadModule(threadSrc.replace(/^'use client';/, ''), threadStubs()); sender = thread.inboundSender; } catch (e) { console.log('  (thread did not load: ' + e.message + ')'); }
  ok(typeof sender === 'function' && sender('Sarah') === 'Sarah' && sender('  Riya  ') === 'Riya' && sender('') === 'Lead' && sender(null) === 'Lead' && sender(undefined) === 'Lead',
    '§10.9 point 7: the inbound sender is the lead\'s name, else "Lead"');
  ok(!/'Bride'/.test(strip(threadSrc)) && /isIn \? inboundSender\(leadName\) : 'TDW'/.test(strip(threadSrc)), '§10.10 point 7: "Bride" has left the vendor\'s thread');
  ok(c4.leadName, '§10.11 point 7: the shell hands the lead\'s own name to the thread');

  sec('§11 · packet 3d');
  const c5b = cardCells(src.card, src.edit);
  ok(c5b.column, '§11.1 F-43.97: one control column, Attach/Change full width first');
  ok(c5b.pair, '§11.2 F-43.97: Booking confirmed and Advance paid as an exactly equal pair');
  ok(c5b.hairline, '§11.3 F-43.97: spacing and a hairline before the detail rows; one Attach/Change control, not two');
  ok(c4.swipe && /: \{ label: 'Booked'/.test(strip(src.shell)), '§11.4 F-43.95: the swipe is withheld on a booked lead');
  const th = thread || {};
  const msgs = [1, 2, 3, 4, 5].map((n) => ({ n }));
  ok(typeof th.visibleMessages === 'function' && th.visibleMessages(msgs, false).map((m) => m.n).join() === '3,4,5'
    && th.visibleMessages(msgs, true).length === 5 && th.visibleMessages(msgs.slice(0, 3), false).length === 3 && th.COLLAPSED_COUNT === 3,
    '§11.5 F-43.93 point 6: collapsed to the last three; expanded shows all; three or fewer are never cut');
  ok(!!th.THREAD && th.THREAD.showAll === 'Show all messages' && th.THREAD.showFewer === 'Show fewer', '§11.6 F-43.93 point 6: the two vetoed bytes');
  const ts = strip(threadSrc);
  ok(/const toggle = messages\.length > COLLAPSED_COUNT \? \(/.test(ts) && /\{!expanded && toggle\}\s*\{shown\.map\(/.test(ts) && /\{expanded && toggle\}/.test(ts)
    && /\{expanded \? THREAD\.showFewer : THREAD\.showAll\}/.test(ts) && !/\{messages\.map\(/.test(ts),
    '§11.7 F-43.93 point 6: one toggle, above the last three while collapsed, below the thread when expanded; the full list is never mapped directly');
  ok(typeof th.stampOf === 'function' && th.stampOf('2026-09-17T07:07:00Z') === `17 September 2026 · ${new Date('2026-09-17T07:07:00Z').toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`
    && th.stampOf('2026-09-16T18:45:00Z').startsWith('17 September 2026 · '),
    '§11.8 F-43.96: the stamp is the IST day in full month and the time');
  ok(/\{isIn \? inboundSender\(leadName\) : 'TDW'\} · \{stampOf\(msg\.created_at\)\}/.test(ts)
    && /data-lc2="thread-stamp" style=\{\{ fontFamily: F\.label, fontWeight: 300, fontSize: 8,/.test(ts) && !/fontSize: 16, lineHeight: 1\.5, color: D\.muted, letterSpacing: '0\.1em'/.test(ts),
    '§11.9 F-43.96: the stamp renders at the label size, never a bare clock time');
  const cbs = strip(src.sheet);
  ok(/data-lc2="client-booking-sheet" inert=\{!open\}/.test(cbs) && !/aria-hidden=\{!open\}/.test(cbs), '§11.10 F-43.94: the Clients sheet is inert when closed, not aria-hidden');
  // The thread carried three rgba literals before 3d (cf027b31: the summary block's two, the outbound
  // bubble's one). 3d adds none, so the count stays three.
  ok((strip(threadSrc).match(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/g) || []).length === 3, '§11.11 the thread adds no colour literal (its three pre-existing ones are carried)');

  sec('§9 · mutations of production source');
  const M = [
    [F.copy, "advancePaid: 'Advance paid',", "advancePaid: 'Advance received',", (m) => !copyCells(m).a2, 'M1 an A2 byte drifts → §1.1 RED'],
    [F.copy, "if (!p.nextDue) return `Payment marked: ${p.client} · paid in full.`;", '', (m) => !copyCells(m).d4, 'M2 D4 dropped → §1.7 RED'],
    [F.copy, 'return new Date(t + 330 * 60 * 1000).toISOString().slice(0, 10);', 'return new Date(t).toISOString().slice(0, 10);', (m) => !copyCells(m).istDay, 'M3 the UTC day used → §1.8 RED'],
    [F.booking, "kind === 'advance_paid' ? { kind, advance_received_on: receivedOn } : { kind }", '{ kind, advance_received_on: receivedOn }', (m) => !bookingCells(m).act, 'M4 the date sent on every booking → §3.2 RED'],
    [F.booking, "        refreshAfterBooking();\n        onToast(BOOKING.booked, 'success');", "        onToast(BOOKING.booked, 'success');", (m) => !bookingCells(m).a13, 'M5 A13 without the refresh → §3.8 RED'],
    [F.booking, "style={actionButton('mute')} onClick={onClose}", "style={textButton('mute')} onClick={onClose}", (m) => !bookingCells(m).cancel, 'M6 the Cancel back to text → §3.10 RED'],
    [F.shell, ": { label: 'Booked', onTrigger: () => setBooking({ leadId: row.id, kind: 'booking_confirmed' }) },", ": { label: 'Booked', onTrigger: () => { void patchLeadState(row.id, 'booked'); } },", (m) => { const c = shellCells(m); return !c.swipe && !c.noBareBooked; }, 'M7 [re-aimed, 3d] the swipe writes booked directly → §4.1 and §4.2 RED'],
    [F.shell, "right: (row.badge ?? '').toLowerCase() === 'booked'\n        ? undefined\n        :", 'right:', (m) => !shellCells(m).swipe, 'M25 F-43.95: the swipe offered on a booked lead → §4.1 RED'],
    [F.shell, '!removeSchedule && !sel.isPackage && (', '!removeSchedule && (', (m) => !shellCells(m).f16, 'M8 Remove drawn on a booking\'s invoice → §4.6 RED'],
    [F.shell, "res.code === 'PACKAGE_SCHEDULE' ? COPY.studioScheduleRemoveFailed : (res.error ?? COPY.studioScheduleRemoveFailed)", 'res.error ?? COPY.studioScheduleRemoveFailed', (m) => !shellCells(m).b1, 'M9 the door\'s text reaches the toast → §4.7 RED'],
    [F.shell, "if (!('ok' in r) || !r.ok || !r.invoice) {", 'if (false) {', (m) => !shellCells(m).f17, 'M10 [re-aimed, 3c] D3 spoken without checking the answer → §4.8 RED'],
    [F.shell, "const paidInFull = r.invoice.state === 'paid' || !r.invoice.due_date;", 'const paidInFull = false;', (m) => !shellCells(m).f17Fields, 'M11 D4 never chosen → §4.9 RED'],
    [F.card, '{!booked && onBook && (', '{onBook && (', (m) => !cardCells(m, src.edit).gated, 'M12 [re-aimed, 3d] booking offered on a booked lead → §5.1 RED'],
    [F.card, "gridTemplateColumns: '1fr 1fr'", "gridTemplateColumns: '2fr 1fr'", (m) => !cardCells(m, src.edit).pair, 'M26 F-43.97: the pair unequal → §11.2 RED'],
    [F.card, 'borderBottom: `0.5px solid ${T.card}`', 'borderTop: `0.5px solid ${T.card}`', (m) => !cardCells(m, src.edit).hairline, 'M27 F-43.97: no hairline before the detail rows → §11.3 RED'],
    [F.card, "onClick={() => book('advance_paid')}", "onClick={() => book('booking_confirmed')}", (m) => !cardCells(m, src.edit).both, 'M13 [re-aimed, 3c] Advance paid hands the wrong kind → §5.3 RED'],
    [F.card, '    if (lp) { onBook(k); return; }', '    onBook(k); return;', (m) => !cardCells(m, src.edit).both, 'M20 3(a): no package, no attach first → §5.3 RED'],
    [F.card, '          if (pendingKind && onBook) onBook(pendingKind);', '', (m) => !cardCells(m, src.edit).continues, 'M21 3(a): the booking lost after the attach → §5.8 RED'],
    [F.shell, '          if (packagePayBlocked(row)) return;', '', (m) => !shellCells(m).guardOnce, 'M22 F-43.88: a second tap slips through → §10.1 RED'],
    [F.shell, 'right: packagePayBlocked(row) ? undefined : { label: COPY.studioMarkPaid', 'right: { label: COPY.studioMarkPaid', (m) => !shellCells(m).hidden, 'M23 F-43.88: swipe offered on a settled booking invoice → §10.4 RED'],
    [F.shell, '        detailTop={detailTop}\n', '', (m) => !shellCells(m).detailTop, 'M24 1(a): the card never reaches the top slot → §10.8 RED'],
    [F.sheet, 'if (advance) body.received_on = values.receivedOn;', 'body.received_on = values.receivedOn;', (m) => !sheetCells(m, src.clients).receivedOnlyYes, 'M14 Received on sent on no → §6.3 RED'],
    [F.sheet, "if (err === 'saved_as_lead') {", "if (false) {", (m) => !sheetCells(m, src.clients).c5, 'M15 C5 never spoken → §6.7 RED'],
    [F.sheet, 'if (needsFee) body.fee = Number(values.fee);', 'body.fee = Number(values.fee);', (m) => !sheetCells(m, src.clients).feeOnlyWhenNeeded, 'M16 the fee always sent → §6.5 RED'],
    [F.invoices, 'isPackage: !!inv.lead_package_id', 'isPackage: false', (m) => !rowCells(m, src.row, src.types).isPackage, 'M17 the row never a booking\'s → §7.1 RED'],
    [F.booking, "        onToast(BOOKING.booked, 'success');", "        onToast(BOOKING.booked, 'success');\n        style={{ color: '#C9A84C' }};", (m) => !tokensOnly(m), 'M18 a colour literal in the sheet → §8.1 RED'],
  ];
  const threadCells = (code) => {
    let t = null;
    try { t = loadModule(code.replace(/^'use client';/, ''), threadStubs()); } catch { return {}; }
    return {
      collapse: t.visibleMessages([1, 2, 3, 4], false).length === 3,
      stamp: /^17 September 2026 · /.test(t.stampOf('2026-09-17T07:07:00Z')),
    };
  };
  {
    const m1 = mut(threadSrc, 'messages.slice(-COLLAPSED_COUNT)', 'messages');
    ok(m1 !== null && !threadCells(m1).collapse, '§9 M28 F-43.93: never collapses → §11.5 RED');
    const m2 = mut(threadSrc, 'return day ? `${day} · ${time}` : time;', 'return time;');
    ok(m2 !== null && !threadCells(m2).stamp, '§9 M29 F-43.96: a bare clock time → §11.8 RED');
    const m3 = mut(src.sheet, 'data-lc2="client-booking-sheet" inert={!open}', 'data-lc2="client-booking-sheet" aria-hidden={!open}');
    ok(m3 !== null && /aria-hidden=\{!open\}/.test(strip(m3)), '§9 M30 F-43.94: aria-hidden back on the Clients sheet → §11.10 RED');
  }
  for (const [file, from, to, bites, name] of M) {
    const key = Object.keys(F).find((k) => F[k] === file);
    const m = mut(src[key], from, to);
    let bit = false;
    try { bit = m !== null && bites(m); } catch { bit = false; }
    ok(bit, '§9 ' + name);
  }
  {
    const m = mut(src.api, "return postJson<{ ok: true; promoted: Promoted } | BookingFailure | ApiErr>(`/api/v2/vendor/leads/${encodeURIComponent(leadId)}/promote`, body);",
      "return postJson<{ ok: true; promoted: Promoted } | BookingFailure | ApiErr>(`/api/v2/vendor/leads/${leadId}/promote`, body);");
    const r = m === null ? { paths: true } : await apiCells(m);
    ok(m !== null && !r.paths, '§9 M19 the lead id not encoded → §2.1 RED');
  }

  console.log(`\n════════  b82_lc2_p3_booking_bench: ${pass} passed, ${fail} failed  ════════`);
  if (fail) { console.log('RED. Failing checks:'); for (const f of fails) console.log('   · ' + f); process.exit(1); }
  process.exit(0);
})().catch((e) => { console.error('BENCH ERROR', e); process.exit(2); });
