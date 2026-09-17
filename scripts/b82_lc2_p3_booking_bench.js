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
//   §12 packet 3e. §12.3 reads the sibling ../dream-os/tools/card_fonts/DMSans-Medium.woff2 and REFUSES
//   (exit 3) when it is absent, the b74/b75 conduct.
// AMENDED BY LABEL AT PACKET 3c (CE-43 LC-2r, chair-ruled): §4.8 (F-43.88's guarded call), §5.1 to
// §5.3 (3(a)/4(a): the booking controls always present, attach first when no package), M10, M12,
// M13 re-aimed; §10 added for F-43.88, F-43.89, 1(a) and point 7.
// AMENDED BY LABEL AT PACKET 3d (CE-43 LC-2r, chair-ruled): §4.1 and M7 (F-43.95: the swipe is withheld
// on a booked lead), §5.1, §5.2 and M12 (F-43.97: the controls column), §10.9's stub (the thread now
// imports the copy home); §11 added for F-43.93 point 6, F-43.94, F-43.95, F-43.96 and F-43.97.
// AMENDED BY LABEL AT PACKET 3e (CE-43 LC-2r, chair-ruled): §3.6 (F-43.102 (b) marks the no_package
// refusal), §4.1 and M7 (F-43.102 (a): the swipe opens through openBookingFromSwipe); §12 added for
// F-43.100 (the four-line toast, measured in DM Sans from dream-os tools/card_fonts), F-43.101,
// F-43.102 and point 5.
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
    // [amended, 3e] the refusal also marks no_package, so the sheet can offer Attach package.
    a9: /if \(isRefusal\(code\)\) \{ setMessage\(LEAD_PACKAGE\.refusals\[code\]\); setNeedsPackage\(code === 'no_package'\); \}/.test(s),
    // 3e · F-43.102 (b)
    attachOffer: /\{needsPackage && \(\s*<button type="button" data-lc2="booking-attach" style=\{actionButton\(\)\} onClick=\{\(\) => setAttachOpen\(true\)\}>\{LEAD_PACKAGE\.attach\}<\/button>/.test(s)
      && /<\/Sheet>\s*<AttachSheet\s*open=\{attachOpen\}/.test(s)
      && /onAttached=\{\(\) => \{ setAttachOpen\(false\); setNeedsPackage\(false\); setMessage\(null\); \}\}/.test(s)
      && /setNeedsPackage\(false\); setAttachOpen\(false\);/.test(s),
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
    swipe: /right: \(row\.badge \?\? ''\)\.toLowerCase\(\) === 'booked'\s*\?\s*undefined\s*:\s*\{ label: 'Booked', onTrigger: \(\) => openBookingFromSwipe\(row\.id\) \}/.test(s),
    // 3e · F-43.102 (a)
    swipeAttachFirst: /const openBookingFromSwipe = \(leadId: string\) => \{\s*void fetchLeadPackage\(leadId\)\.then\(\(r\) => \{\s*if \(r && r\.ok && r\.lead_package === null\) setAttachFirst\(\{ leadId, kind: 'booking_confirmed' \}\);\s*else setBooking\(\{ leadId, kind: 'booking_confirmed' \}\);/.test(s)
      && /\{slice === 'leads' && \(\s*<AttachSheet\s*open=\{!!attachFirst\}/.test(s)
      && /if \(next\) setBooking\(\{ leadId: next\.leadId, kind: next\.kind \}\);/.test(s),
    // 3e · F-43.101
    detailFollows: /if \(slice !== 'invoices' \|\| !sel\) return;\s*const fresh = rawRows\.find\(\(r\) => r\.id === sel\.id\);\s*if \(fresh && fresh !== sel\) setSel\(fresh\);/.test(s)
      && /\}, \[rawRows\]\);/.test(s)
      && /if \(res\.ok\) invalidateSlice\('invoices'\);/.test(s),
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

// ── a minimal WOFF2 reader (cmap, head, hhea, hmtx) for §12.3's measurement ─────────────────
// minimal WOFF2 reader: cmap, head, hhea, hmtx -> advance width per code point
const KNOWN = ['cmap','head','hhea','hmtx','maxp','name','OS/2','post','cvt ','fpgm','glyf','loca','prep','CFF ','VORG','EBDT','EBLC','gasp','hdmx','kern','LTSH','PCLT','VDMX','vhea','vmtx','BASE','GDEF','GPOS','GSUB','EBSC','JSTF','MATH','CBDT','CBLC','COLR','CPAL','SVG ','sbix','acnt','avar','bdat','bloc','bsln','cvar','fdsc','feat','fmtx','fvar','gvar','hsty','just','lcar','mort','morx','opbd','prop','trak','Zapf','Silf','Glat','Gloc','Feat','Sill'];
function readWoff2Advance(buf) {
  const zlib = require('zlib');
  if (buf.toString('ascii', 0, 4) !== 'wOF2') throw new Error('not woff2');
  const numTables = buf.readUInt16BE(12);
  const totalCompressed = buf.readUInt32BE(20);
  let off = 48;
  const b128 = () => { let v = 0; for (let i = 0; i < 5; i++) { const x = buf[off++]; v = v * 128 + (x & 0x7f); if (!(x & 0x80)) return v; } throw new Error('bad b128'); };
  const dir = [];
  for (let i = 0; i < numTables; i++) {
    const flags = buf[off++];
    let tag = KNOWN[flags & 0x3f];
    if ((flags & 0x3f) === 0x3f) { tag = buf.toString('ascii', off, off + 4); off += 4; }
    const version = (flags >> 6) & 3;
    const orig = b128();
    const transformed = (tag === 'glyf' || tag === 'loca') ? version === 0 : version !== 0;
    const len = transformed ? b128() : orig;
    dir.push({ tag, len, transformed });
  }
  const data = zlib.brotliDecompressSync(buf.subarray(off, off + totalCompressed));
  const t = {}; let p = 0;
  for (const d of dir) { t[d.tag] = { data: data.subarray(p, p + d.len), transformed: d.transformed }; p += d.len; }
  const upm = t.head.data.readUInt16BE(18);
  const nHM = t.hhea.data.readUInt16BE(34);
  const hm = t.hmtx.data;
  const adv = [];
  if (t.hmtx.transformed) { for (let i = 0; i < nHM; i++) adv.push(hm.readUInt16BE(1 + 2 * i)); }
  else { for (let i = 0; i < nHM; i++) adv.push(hm.readUInt16BE(4 * i)); }
  const cm = t.cmap.data; const n = cm.readUInt16BE(2);
  const map = new Map();
  for (let i = 0; i < n; i++) {
    const pid = cm.readUInt16BE(4 + 8 * i), eid = cm.readUInt16BE(6 + 8 * i), so = cm.readUInt32BE(8 + 8 * i);
    const fmt = cm.readUInt16BE(so);
    if (fmt === 4 && (pid === 3 || pid === 0)) {
      const segX2 = cm.readUInt16BE(so + 6); const seg = segX2 / 2;
      const ends = so + 14, starts = ends + segX2 + 2, deltas = starts + segX2, ros = deltas + segX2;
      for (let s = 0; s < seg; s++) {
        const end = cm.readUInt16BE(ends + 2 * s), start = cm.readUInt16BE(starts + 2 * s);
        const delta = cm.readInt16BE(deltas + 2 * s), ro = cm.readUInt16BE(ros + 2 * s);
        for (let c = start; c <= end && c !== 0xffff; c++) {
          let g;
          if (ro === 0) g = (c + delta) & 0xffff;
          else { g = cm.readUInt16BE(ros + 2 * s + ro + 2 * (c - start)); if (g) g = (g + delta) & 0xffff; }
          if (!map.has(c)) map.set(c, g);
        }
      }
    } else if (fmt === 12) {
      const ng = cm.readUInt32BE(so + 12);
      for (let k = 0; k < ng; k++) {
        const a = cm.readUInt32BE(so + 16 + 12 * k), z = cm.readUInt32BE(so + 20 + 12 * k), g0 = cm.readUInt32BE(so + 24 + 12 * k);
        for (let c = a; c <= z; c++) if (!map.has(c)) map.set(c, g0 + (c - a));
      }
    }
  }
  const advOf = (g) => adv[Math.min(g, adv.length - 1)];
  return (s, px) => [...s].reduce((sum, ch) => sum + advOf(map.has(ch.codePointAt(0)) ? map.get(ch.codePointAt(0)) : map.get(63)), 0) * px / upm;
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

  sec('§12 · packet 3e');
  // ── F-43.100 · the four-line toast, measured ───────────────────────────────────────────────
  // METHOD (stated, as ruled): DM Sans MEDIUM advance widths from the sibling dream-os
  // tools/card_fonts/DMSans-Medium.woff2 (the toast sets DM Sans 400 via --wl-t3, 14px; Medium is a
  // touch wider, so the count is conservative), greedy word wrap into the toast's text width at a
  // 374px handset. That width is derived from WlToast's own CSS (max-width calc(100vw - 40px),
  // padding 18px each side, a 6px dot, an 8px gap): 374 - 40 - 36 - 6 - 8 = 284px. The method was
  // cross-checked at the cut against fontTools on the same file (360, 803, 958 and 260 px, equal).
  const toastSrc = read('components/worklist/WlToast.tsx');
  const tcss = (toastSrc.match(/\.wl-toastmsg\{[^}]*\}/) || [''])[0];
  ok(/-webkit-line-clamp:4/.test(tcss) && /white-space:normal/.test(tcss) && !/nowrap/.test(tcss) && /overflow:hidden/.test(tcss),
    '§12.1 F-43.100: the message wraps and clips only past the fourth line');
  const geom = /max-width:calc\(100vw - 40px\)/.test(toastSrc) && /\.wl-toast\{[^}]*padding:10px 18px/.test(toastSrc)
    && /\.wl-toastdot\{width:6px;/.test(toastSrc) && /\.wl-toast\{[^}]*gap:8px/.test(toastSrc);
  ok(geom, '§12.2 F-43.100: the 284px text width is the toast\'s own geometry at 374px');
  let measure = null;
  let fontRefused = null;
  try {
    const fontFile = path.join(ROOT, '..', 'dream-os', 'tools', 'card_fonts', 'DMSans-Medium.woff2');
    measure = readWoff2Advance(fs.readFileSync(fontFile));
  } catch (e) { fontRefused = e.message; console.log('  (font not read: ' + e.message + ' — the sibling dream-os must be present)'); }
  const linesAt = (text, width) => { let n = 1, cur = ''; for (const wd of text.split(' ')) { const t = cur ? cur + ' ' + wd : wd; if (measure(t, 14) <= width) cur = t; else { n++; cur = wd; } } return n; };
  const cm = c1.err ? null : loadModule(src.copy);
  const vetoed = cm ? [
    cm.CLIENT_BOOKING.added,
    cm.BOOKING.booked,
    cm.CLIENT_BOOKING.savedAsLead,
    cm.paymentMarked({ client: 'Riya Test', label: cm.scheduleLabel('deposit', 30), amount: 'Rs 24,000', date: '17 September 2026', nextDue: '6 March 2027' }),
    cm.paymentMarked({ client: 'Riya Test', label: cm.scheduleLabel('middle', 30), amount: 'Rs 24,000', date: '17 September 2026', nextDue: '6 March 2027' }),
    cm.paymentMarked({ client: 'Riya Test', label: cm.scheduleLabel('final', 70), amount: 'Rs 56,000', date: '17 September 2026', nextDue: '6 March 2027' }),
    cm.paymentMarked({ client: 'Riya Test', label: 'x', amount: 'Rs 56,000', date: '17 September 2026', nextDue: null }),
  ] : [];
  const counts = measure && geom ? vetoed.map((t) => linesAt(t, 374 - 40 - 36 - 6 - 8)) : [];
  if (counts.length) console.log('  (measured lines: ' + counts.join(', ') + ')');
  ok(counts.length === 7 && counts.every((n) => n <= 4) && counts[0] <= 2 && counts[5] > 2,
    '§12.3 F-43.100: C4, A13, C5, D3 (every milestone label, the longest included) and D4 render whole in four lines at 374px; D3 needs more than two');
  // ── F-43.102, F-43.101, point 5 ────────────────────────────────────────────────────────────
  const bs = bookingCells(src.booking);
  ok(bs.attachOffer, '§12.4 F-43.102 (b): a no_package refusal offers Attach package, opening the attach sheet beside the booking sheet');
  ok(c4.swipeAttachFirst, '§12.5 F-43.102 (a): a swipe on a lead with no package opens the attach sheet first, then the booking sheet');
  ok(/export function AttachSheet\(/.test(strip(src.card)), '§12.6 F-43.102: the one attach sheet is shared, not copied');
  ok(c4.detailFollows, '§12.7 F-43.101: the open invoice detail follows its refetched row; the schedule\'s Paid refetches the list');
  const binderSrc = strip(read('components/vendor/slices/BinderCard.tsx'));
  ok(/\) : binder\.booked_lead \? null : \(\s*<div[^>]*>\s*No story yet — it grows as you talk in chat\./.test(binderSrc)
    && /booked_lead\?: boolean;/.test(src.api), '§12.8 point 5 (a): "No story yet" is not shown on a client with a booked lead behind it');
  ok(!/Attach a package|Attach package'/.test(strip(src.booking)), '§12.9 no new byte: the sheet reuses A2\'s Attach package from the copy home');

  sec('§9 · mutations of production source');
  const M = [
    [F.copy, "advancePaid: 'Advance paid',", "advancePaid: 'Advance received',", (m) => !copyCells(m).a2, 'M1 an A2 byte drifts → §1.1 RED'],
    [F.copy, "if (!p.nextDue) return `Payment marked: ${p.client} · paid in full.`;", '', (m) => !copyCells(m).d4, 'M2 D4 dropped → §1.7 RED'],
    [F.copy, 'return new Date(t + 330 * 60 * 1000).toISOString().slice(0, 10);', 'return new Date(t).toISOString().slice(0, 10);', (m) => !copyCells(m).istDay, 'M3 the UTC day used → §1.8 RED'],
    [F.booking, "kind === 'advance_paid' ? { kind, advance_received_on: receivedOn } : { kind }", '{ kind, advance_received_on: receivedOn }', (m) => !bookingCells(m).act, 'M4 the date sent on every booking → §3.2 RED'],
    [F.booking, "        refreshAfterBooking();\n        onToast(BOOKING.booked, 'success');", "        onToast(BOOKING.booked, 'success');", (m) => !bookingCells(m).a13, 'M5 A13 without the refresh → §3.8 RED'],
    [F.booking, "style={actionButton('mute')} onClick={onClose}", "style={textButton('mute')} onClick={onClose}", (m) => !bookingCells(m).cancel, 'M6 the Cancel back to text → §3.10 RED'],
    [F.shell, ": { label: 'Booked', onTrigger: () => openBookingFromSwipe(row.id) },", ": { label: 'Booked', onTrigger: () => { void patchLeadState(row.id, 'booked'); } },", (m) => { const c = shellCells(m); return !c.swipe && !c.noBareBooked; }, 'M7 [re-aimed, 3e] the swipe writes booked directly → §4.1 and §4.2 RED'],
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
  {
    const t1 = mut(toastSrc, '-webkit-line-clamp:4', '-webkit-line-clamp:2');
    const tc = t1 && (t1.match(/\.wl-toastmsg\{[^}]*\}/) || [''])[0];
    ok(!!tc && !/-webkit-line-clamp:4/.test(tc), '§9 M32 F-43.100: the clamp back at two → §12.1 RED');
    const two = measure ? vetoed.map((t) => linesAt(t, 284)).filter((n) => n > 2).length : 0;
    ok(two > 0, '§9 M33 F-43.100: at two lines the measured D3 would be cut → §12.3 bites');
    const b1 = mut(src.booking, "setNeedsPackage(code === 'no_package');", '');
    ok(b1 !== null && !bookingCells(b1).a9, '§9 M34 F-43.102 (b): the refusal no longer offers Attach package → §3.6 RED');
    const s1 = mut(src.shell, "if (r && r.ok && r.lead_package === null) setAttachFirst({ leadId, kind: 'booking_confirmed' });", '');
    ok(s1 !== null && !shellCells(s1).swipeAttachFirst, '§9 M35 F-43.102 (a): the swipe skips the attach sheet → §12.5 RED');
    const s2 = mut(src.shell, 'if (fresh && fresh !== sel) setSel(fresh);', '');
    ok(s2 !== null && !shellCells(s2).detailFollows, '§9 M36 F-43.101: the open detail keeps its stale row → §12.7 RED');
    const b2 = mut(read('components/vendor/slices/BinderCard.tsx'), ') : binder.booked_lead ? null : (', ') : (');
    ok(b2 !== null && !/binder\.booked_lead \? null/.test(b2), '§9 M37 point 5: the line shown on a booked client → §12.8 RED');
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

  // The b74/b75 conduct: a cross-repo cell whose sibling is absent REFUSES (exit 3) rather than
  // reading as a defect in this tree.
  if (fontRefused) { console.log(`REFUSED — ../dream-os/tools/card_fonts/DMSans-Medium.woff2 not readable (${fontRefused}); §12.3 cannot measure.`); process.exit(3); }
  console.log(`\n════════  b82_lc2_p3_booking_bench: ${pass} passed, ${fail} failed  ════════`);
  if (fail) { console.log('RED. Failing checks:'); for (const f of fails) console.log('   · ' + f); process.exit(1); }
  process.exit(0);
})().catch((e) => { console.error('BENCH ERROR', e); process.exit(2); });
