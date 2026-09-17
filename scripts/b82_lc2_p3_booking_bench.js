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
  const out = ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
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
    swipe: /right: \{ label: 'Booked', onTrigger: \(\) => setBooking\(\{ leadId: row\.id, kind: 'booking_confirmed' \}\) \}/.test(s),
    noBareBooked: s.length > 0 && !/patchLeadState\([^)]*'booked'\)/.test(s),
    mountOnce: (s.match(/<BookingSheet\b/g) || []).length === 1 && /\{slice === 'leads' && \(\s*<BookingSheet/.test(s),
    cardProps: /<LeadPackageCard leadId=\{sel\.id\}\s*booked=\{\(sel\.badge \?\? ''\)\.toLowerCase\(\) === 'booked'\}\s*onBook=\{\(k\) => setBooking\(\{ leadId: sel\.id, kind: k \}\)\}/.test(s),
    f16: /schedule && schedule\.length > 0 && !removeSchedule && !sel\.isPackage && \(/.test(s),
    b1: /showToast\(res\.code === 'PACKAGE_SCHEDULE' \? COPY\.studioScheduleRemoveFailed : \(res\.error \?\? COPY\.studioScheduleRemoveFailed\), 'error'\)/.test(s),
    f17: /if \(row\.isPackage\) \{[\s\S]{0,200}const r = await recordPayment\(row\.id, \{ amount: owed \}\);\s*if \(!\('ok' in r\) \|\| !r\.ok \|\| !r\.invoice\) \{ showToast\([^;]*'error'\); return; \}[\s\S]{0,200}invalidateSlice\('invoices'\);[\s\S]{0,200}showToast\(paymentMarked\(\{/.test(s),
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
    gated: /\{!booked && onBook && \(\s*<div data-lc2="lead-booking-controls"/.test(s),
    insideAttached: s.indexOf('data-lc2="lead-booking-controls"') > s.indexOf('data-lc2="lead-package-attached"') && s.indexOf('data-lc2="lead-package-attached"') > 0,
    both: /onClick=\{\(\) => onBook\('booking_confirmed'\)\}>\{LEAD_PACKAGE\.bookingConfirmed\}/.test(s) && /onClick=\{\(\) => onBook\('advance_paid'\)\}>\{LEAD_PACKAGE\.advancePaid\}/.test(s),
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
  ok(c5.gated, '§5.1 the booking controls show only when not booked and onBook is given');
  ok(c5.insideAttached, '§5.2 they sit inside the attached block (a package first)');
  ok(c5.both, '§5.3 each A2 control hands its kind to onBook');
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

  sec('§9 · mutations of production source');
  const M = [
    [F.copy, "advancePaid: 'Advance paid',", "advancePaid: 'Advance received',", (m) => !copyCells(m).a2, 'M1 an A2 byte drifts → §1.1 RED'],
    [F.copy, "if (!p.nextDue) return `Payment marked: ${p.client} · paid in full.`;", '', (m) => !copyCells(m).d4, 'M2 D4 dropped → §1.7 RED'],
    [F.copy, 'return new Date(t + 330 * 60 * 1000).toISOString().slice(0, 10);', 'return new Date(t).toISOString().slice(0, 10);', (m) => !copyCells(m).istDay, 'M3 the UTC day used → §1.8 RED'],
    [F.booking, "kind === 'advance_paid' ? { kind, advance_received_on: receivedOn } : { kind }", '{ kind, advance_received_on: receivedOn }', (m) => !bookingCells(m).act, 'M4 the date sent on every booking → §3.2 RED'],
    [F.booking, "        refreshAfterBooking();\n        onToast(BOOKING.booked, 'success');", "        onToast(BOOKING.booked, 'success');", (m) => !bookingCells(m).a13, 'M5 A13 without the refresh → §3.8 RED'],
    [F.booking, "style={actionButton('mute')} onClick={onClose}", "style={textButton('mute')} onClick={onClose}", (m) => !bookingCells(m).cancel, 'M6 the Cancel back to text → §3.10 RED'],
    [F.shell, "right: { label: 'Booked', onTrigger: () => setBooking({ leadId: row.id, kind: 'booking_confirmed' }) },", "right: { label: 'Booked', onTrigger: () => { void patchLeadState(row.id, 'booked'); } },", (m) => { const c = shellCells(m); return !c.swipe && !c.noBareBooked; }, 'M7 the swipe writes booked directly → §4.1 and §4.2 RED'],
    [F.shell, '!removeSchedule && !sel.isPackage && (', '!removeSchedule && (', (m) => !shellCells(m).f16, 'M8 Remove drawn on a booking\'s invoice → §4.6 RED'],
    [F.shell, "res.code === 'PACKAGE_SCHEDULE' ? COPY.studioScheduleRemoveFailed : (res.error ?? COPY.studioScheduleRemoveFailed)", 'res.error ?? COPY.studioScheduleRemoveFailed', (m) => !shellCells(m).b1, 'M9 the door\'s text reaches the toast → §4.7 RED'],
    [F.shell, "if (!('ok' in r) || !r.ok || !r.invoice) { showToast(`Payment on ${row.secondary ?? row.primary} failed.`, 'error'); return; }", '', (m) => !shellCells(m).f17, 'M10 D3 spoken without checking the answer → §4.8 RED'],
    [F.shell, "const paidInFull = r.invoice.state === 'paid' || !r.invoice.due_date;", 'const paidInFull = false;', (m) => !shellCells(m).f17Fields, 'M11 D4 never chosen → §4.9 RED'],
    [F.card, '{!booked && onBook && (', '{onBook && (', (m) => !cardCells(m, src.edit).gated, 'M12 booking offered on a booked lead → §5.1 RED'],
    [F.card, "onClick={() => onBook('advance_paid')}", "onClick={() => onBook('booking_confirmed')}", (m) => !cardCells(m, src.edit).both, 'M13 Advance paid hands the wrong kind → §5.3 RED'],
    [F.sheet, 'if (advance) body.received_on = values.receivedOn;', 'body.received_on = values.receivedOn;', (m) => !sheetCells(m, src.clients).receivedOnlyYes, 'M14 Received on sent on no → §6.3 RED'],
    [F.sheet, "if (err === 'saved_as_lead') {", "if (false) {", (m) => !sheetCells(m, src.clients).c5, 'M15 C5 never spoken → §6.7 RED'],
    [F.sheet, 'if (needsFee) body.fee = Number(values.fee);', 'body.fee = Number(values.fee);', (m) => !sheetCells(m, src.clients).feeOnlyWhenNeeded, 'M16 the fee always sent → §6.5 RED'],
    [F.invoices, 'isPackage: !!inv.lead_package_id', 'isPackage: false', (m) => !rowCells(m, src.row, src.types).isPackage, 'M17 the row never a booking\'s → §7.1 RED'],
    [F.booking, "        onToast(BOOKING.booked, 'success');", "        onToast(BOOKING.booked, 'success');\n        style={{ color: '#C9A84C' }};", (m) => !tokensOnly(m), 'M18 a colour literal in the sheet → §8.1 RED'],
  ];
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
