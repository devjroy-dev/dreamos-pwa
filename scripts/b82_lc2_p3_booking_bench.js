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
// AMENDED BY LABEL AT PACKET 3f (CE-43 LC-2r; R-43.16, F-43.104 the seat's, c-43.17 the chair's): the
// redirect cells are RETIRED and restated as their opposite, since the founder's rule forbids what they
// asserted: §5.3 (the booking pair only books), §5.8 (no pending booking after an attach), §12.4 (the
// refusal line itself is the control), §12.5 (the swipe opens the booking sheet, never the attach sheet);
// §3.6, §3.7, §4.1, M7, M20, M21, M34, M35 re-aimed. §13 added: R-43.16's sweep, F-43.76, F-43.105.
// AMENDED BY LABEL AT PACKET 3g (CE-43 LC-2r; F-43.107, F-43.108, F-43.109 and the founder-corrected item 1):
// §10.7 admits the chips slot between detailTop and the rows; §13.6 and §13.7 RESTATED as their
// opposite (the seat's cure, ratified: the reads do not wait for each other, and no fixed-height
// placeholder); §13.8 re-aimed at the start-aware prefill; M40 re-aimed. §14 added.
// AMENDED BY LABEL AT PACKET 3h (CE-43 LC-2r): §15 added for F-43.110 (the vetoed `Package attached.`)
// and F-43.111 (the lead detail opens at full height); M46, M47. No existing cell changed.
// AMENDED BY LABEL AT PACKET 3i (CE-43 LC-2s, chair-ruled): §16 added for F-43.113 (the open lead detail
// follows its refetched row; its reads keyed on the lead's id) and F-43.112 (the User Timing marks for the
// card-and-rows moment and the conversation's landing, the helpers DRIVEN over a timing double); M48 to
// M53. No existing cell changed.
// AMENDED BY LABEL AT PACKET 3j (CE-43 LC-2s, F-43.116 ratified): §15.3 re-aimed at the bounded form (the
// lead detail's full height is still 88dvh, now also bounded by the visible viewport through sheetBound).
// §17 added: the one sheet layer, its stack DRIVEN, a cell per stacking pair (the inner body scrolls and is
// not locked, the outer is inert under the inner's backdrop), the five sheets converted with no hand-set
// layer order, the keyboard bound DRIVEN, the client edit sheet's pinned Save; M54 to M61.
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
    // [amended, 3f] the refusal is kept as a code and rendered as a NeedFirst control.
    a9: /if \(isRefusal\(code\)\) setNeed\(\{ code \}\);/.test(s),
    // 3e · F-43.102 (b)
    // [restated, 3f · R-43.16] the refusal line itself is the control; no separate button.
    attachOffer: /\{need && <NeedFirst text=\{needText\(need\.code\)\} onFix=\{fixFor\(need\.code\)\} testId="booking" \/>\}/.test(s)
      && /<\/Sheet>\s*<AttachSheet\s*open=\{!!attach\}/.test(s)
      && !/data-lc2="booking-attach"/.test(s) && !/needsPackage/.test(s),
    // 3g · item 1 (corrected)
    asks: /const needsNow: NeedCell\[\] = bookingNeeds\(lp, leadFacts\);/.test(s)
      && /if \(needsNow\.length\) \{\s*setAsked\(true\); setNeed\(null\); setFailed\(false\);\s*onToast\(LEAD_PACKAGE\.stillMissing\(needsNow\.map\(\(c\) => LEAD_PACKAGE\.needLabel\[c\]\)\), 'error'\);\s*return;\s*\}/.test(s)
      && s.indexOf('if (needsNow.length) {') < s.indexOf('const r = await promoteLead(')
      && /\{asked && \(\s*<MissingChips testId="booking" onPick=\{pickNeed\}/.test(s)
      && /if \(cell === 'wedding_date'\) \{ if \(leadId\) onNeedWeddingDate\(leadId\); return; \}\s*setAttach\(\{ focus: cell === 'fee' \? 'fee' : cell === 'handover' \? 'handover' : null \}\);/.test(s)
      && /void fetchLeadPackage\(leadId\)/.test(s) && /onAttached=\{\(row\) => \{ setAttach\(null\); setNeed\(null\); setLp\(row\); \}\}/.test(s)
      && !/disabled=/.test(s),
    fixMap: /if \(code === 'received_on'\) \{ if \(dateRef\.current\) dateRef\.current\.focus\(\); return; \}/.test(s)
      && /if \(code === 'no_wedding_date'\) \{ if \(leadId\) onNeedWeddingDate\(leadId\); return; \}/.test(s)
      && /setAttach\(\{ focus: code === 'no_fee' \? 'fee' : code === 'no_handover_date' \? 'handover' : null \}\);/.test(s)
      && /focus=\{attach \? attach\.focus : null\}/.test(s)
      && /onNeedWeddingDate: \(leadId: string\) => void;/.test(s),
    // [amended, 3f] F29 is a failure, not a thing to add: a plain line, set by `failed`.
    f29: /else setFailed\(true\);/.test(s) && /catch \{\s*setFailed\(true\);/.test(s)
      && /\{failed && <p role="alert"[^>]*>\{BOOKING\.failed\}<\/p>\}/.test(s),
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
    // [restated, 3f · R-43.16] the swipe opens the booking sheet; no attach-first path survives.
    swipeAttachFirst: !/openBookingFromSwipe|attachFirst|setAttachFirst/.test(s) && !/<AttachSheet\b/.test(s),
    // 3f · F-43.76 / R-43.16
    dateFix: /\{dateFix && \(\s*<WishboneSheet\s*missing=\{\['wedding_date'\]\}\s*personLabel=\{dateFix\.name\}\s*initialValues=\{\{ wedding_date: dateFix\.value \}\}/.test(s)
      && /updateLead\(dateFix\.leadId, \{ wedding_date: value, wedding_date_precision: 'day' \}\)/.test(s)
      && /onDone=\{\(\) => setDateFix\(null\)\}/.test(s)
      && /onNeedWeddingDate=\{openDateFix\}/.test(s) && /onNeedWeddingDate=\{\(\) => openDateFix\(sel\.id\)\}/.test(s),
    // 3f · F-43.105
    // [restated, 3g · F-43.107] the two reads run side by side and neither waits for the other.
    together: !/Promise\.all\(\[\s*fetchLeadDetail/.test(s)
      && /void fetchLeadPackage\(id\)\s*\.then\(\(pk\) => setLeadPkg\(\{ id, lp: pk && pk\.ok \? pk\.lead_package : null \}\)\)/.test(s)
      && /void fetchLeadDetail\(id\)\s*\.then\(\(res\) => \{ if \(res && res\.ok\) setLeadDetail\(/.test(s)
      && /bodyLoading=\{slice === 'leads' && !!sel && !\(leadPkg && leadPkg\.id === sel\.id\)\}/.test(s)
      && /initial=\{leadPkg && leadPkg\.id === sel\.id \? leadPkg\.lp : undefined\}/.test(s),
    // 3g · F-43.108 / F-43.109 / F-43.107 / item 1
    chipsTop: /const missingTop = slice === 'leads' && sel && \(sel\.draftMissing\?\.length \?\? 0\) > 0 \? \(/.test(s)
      && /onPick=\{\(c\) => \{ setWishboneStart\(c\); setWishboneRow\(sel\); \}\}/.test(s)
      && /detailMissing=\{missingTop\}/.test(s)
      && !/Still missing — tap to complete:/.test(s.slice(s.indexOf('const detailExtra = ('), s.indexOf('const detailExtra = (') + 30000))
      && /start=\{wishboneStart\}/.test(s),
    primeOnce: /if \(slice !== 'leads'\) return;\s*resetPackagesCache\(\);\s*void loadPackagesOnce\(\);\s*return \(\) => resetPackagesCache\(\);/.test(s),
    factsWired: /leadFacts=\{leadFactsOf\(sel\.id\)\}/.test(s) && /leadFacts=\{leadFactsOf\(booking \? booking\.leadId : null\)\}/.test(s)
      && /const leadFactsOf = \(leadId: string \| null \| undefined\): LeadFacts \| null =>/.test(s),
    scheduleGate: /<NeedFirst\s*testId="schedule"/.test(s) && /input\[aria-label="Milestone \$\{unlabelled \+ 1\} name"\]/.test(s)
      && !/<div[^>]*color: A\.red[^>]*>\s*\{Math\.abs\(total - 100\)/.test(s),
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
    // [restated, 3f · R-43.16] each A2 control only books; it never opens the attach sheet.
    both: /onClick=\{\(\) => book\('booking_confirmed'\)\}>\{LEAD_PACKAGE\.bookingConfirmed\}/.test(s) && /onClick=\{\(\) => book\('advance_paid'\)\}>\{LEAD_PACKAGE\.advancePaid\}/.test(s)
      && /const book = \(k: BookingKind\) => \{ if \(onBook\) onBook\(k\); \};/.test(s),
    // [restated, 3f] no pending booking survives an attach; the attach sheet only attaches.
    continues: !/pendingKind/.test(s) && /onAttached=\{\(row\) => \{ setLp\(row\); setSheetOpen\(false\); \}\}/.test(s)
      && /onNeedWeddingDate=\{onNeedWeddingDate\}/.test(s),
    // 3f · the attach sheet's own refusals
    // AMENDED AT CE-44 (R-44.12). The chain gained one arm: `already_booked` leaves by
    // onClose, because it is the one refusal with no field to fix until F-44.17 lands.
    // The four arms this cell was written for are each still asserted, in order.
    attachNeeds: /fix: code === 'no_wedding_date' \? onNeedWeddingDate\s*: code === 'no_fee' \? \(\) => focusOn\('att-fee'\)\s*: code === 'no_handover_date' \? \(\) => focusOn\('att-handover'\)\s*: code === 'already_booked' \? onClose\s*: \(\) => focusOn\('att-pkg'\),/.test(s)
      && /\{need && <NeedFirst text=\{need\.text\} onFix=\{need\.fix\} testId="attach" \/>\}/.test(s)
      && /onNeedWeddingDate: \(\) => void;\s*focus\?: 'fee' \| 'handover' \| null;/.test(s)
      && /focusOn\(focus === 'fee' \? 'att-fee' : 'att-handover'\);/.test(s),
    // [restated, 3g · F-43.107] no placeholder: the form renders once the read-once list is in.
    initialRead: /if \(initial !== undefined\) \{ setLp\(initial\); return; \}/.test(s)
      && /\{packages !== null && \(<>/.test(s) && !/attach-skeleton/.test(s),
    // 3g · F-43.107: the packages list is read once per room visit
    readOnce: /let packagesCache: VendorPackage\[\] \| null = null;/.test(s)
      && /export function loadPackagesOnce\(\): Promise<VendorPackage\[\]> \{\s*if \(packagesCache\) return Promise\.resolve\(packagesCache\);/.test(s)
      && /useState<VendorPackage\[\] \| null>\(packagesCache\)/.test(s)
      && /void loadPackagesOnce\(\)\.then\(\(list\) => \{/.test(s)
      && (s.match(/fetchPackages\(\)/g) || []).length === 1
      && /if \(r && r\.ok\) \{ packagesCache = r\.packages; return r\.packages; \}\s*packagesInflight = null;/.test(s),
    // 3g · item 1 (corrected): the attach sheet says what is missing before it sends
    attachAsks: /const needsNow: NeedCell\[\] = attachNeeds\(\{ chosen, fee: wholeRupees\(fee\), handover, lead: leadFacts \}\);/.test(s)
      && /if \(needsNow\.length\) \{\s*setAsked\(true\); setNeed\(null\);\s*onToast\(LEAD_PACKAGE\.stillMissing\(needsNow\.map\(\(c\) => LEAD_PACKAGE\.needLabel\[c\]\)\), 'error'\);\s*return;\s*\}/.test(s)
      && s.indexOf('if (needsNow.length) {') < s.indexOf('const r = await attachLeadPackage(')
      && /\{asked && \(\s*<MissingChips testId="attach" onPick=\{pickNeed\}/.test(s)
      && /if \(cell === 'wedding_date'\) onNeedWeddingDate\(\);\s*else focusOn\(cell === 'fee' \? 'att-fee' : cell === 'handover' \? 'att-handover' : 'att-pkg'\);/.test(s),
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
  ok(c5.both, '§5.3 [restated, 3f] each A2 control opens the booking sheet, never the attach sheet (R-43.16)');
  ok(c5.continues, '§5.8 [restated, 3f] an attach only attaches; no booking is carried across it');
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
  ok(/\{detailTop\}\s*(\{detailMissing\}\s*)?\{\(sel\?\.detail \?\? \[\]\)\.map/.test(detailSrc), '§10.7 [amended, 3g] 1(a): DetailSheet renders detailTop above the detail rows');
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
  ok(bs.attachOffer, '§12.4 [restated, 3f] the booking sheet\'s refusal line is itself the control; no separate Attach package button');
  ok(c4.swipeAttachFirst, '§12.5 [restated, 3f] the swipe opens the booking sheet; no attach-first path survives (R-43.16)');
  ok(/export function AttachSheet\(/.test(strip(src.card)), '§12.6 F-43.102: the one attach sheet is shared, not copied');
  ok(c4.detailFollows, '§12.7 F-43.101: the open invoice detail follows its refetched row; the schedule\'s Paid refetches the list');
  const binderSrc = strip(read('components/vendor/slices/BinderCard.tsx'));
  ok(/\) : binder\.booked_lead \? null : \(\s*<div[^>]*>\s*No story yet — it grows as you talk in chat\./.test(binderSrc)
    && /booked_lead\?: boolean;/.test(src.api), '§12.8 point 5 (a): "No story yet" is not shown on a client with a booked lead behind it');
  ok(!/Attach a package|Attach package'/.test(strip(src.booking)), '§12.9 no new byte: the sheet reuses A2\'s Attach package from the copy home');

  sec('§13 · packet 3f (R-43.16, F-43.76, F-43.105)');
  const nf = read('components/vendor/NeedFirst.tsx');
  ok(/onFix: \(\) => void;/.test(nf) && !/onFix\?:/.test(nf) && /onClick=\{onFix\}/.test(nf) && tokensOnly(nf.replace(/var\(--[a-z-]+\)/g, '')),
    '§13.1 R-43.16: NeedFirst requires its fix and carries only tokens');
  // THE CELL (chair-ruled): no "needs X first" line in the named surfaces renders without a handler.
  // The set is every vetted needs-first byte these surfaces render (A9's four, the packet 2 gates, the
  // schedule gate); each file that renders one must render it through NeedFirst, and no plain alert
  // element may carry it.
  const NEED_KEYS = /LEAD_PACKAGE\.refusals|needText\(|needFor\(|PACKAGE_FAILURES\.(nameGate|remainderGate|fieldGate)|All milestones need a label|Percentages must sum/;
  const surfaces = {
    booking: src.booking, card: src.card, shell: src.shell, sheet: src.sheet, edit: src.edit,
  };
  const plainAlert = /<(p|div|span)[^>]*role="alert"[^>]*>\s*\{(message|gate|need[^}]*|LEAD_PACKAGE\.refusals[^}]*)\}/;
  const offenders = Object.entries(surfaces).filter(([, code]) => {
    const t = strip(code);
    if (!NEED_KEYS.test(t) && !/setGate\(|fieldGate/.test(t)) return false;
    if (!/<NeedFirst\b/.test(t)) return true;
    const alerts = t.match(new RegExp(plainAlert.source, 'g')) || [];
    return alerts.some((a) => !/\{message\}/.test(a)) || (/\{message\}/.test(alerts.join('')) && !/\{message && !bad && <p role="alert"/.test(t));
  }).map(([k]) => k);
  ok(Object.keys(surfaces).every((k) => surfaces[k].length > 0) && offenders.length === 0,
    '§13.2 R-43.16 THE CELL: no needs-first line renders without a handler' + (offenders.length ? ` (offenders: ${offenders.join(', ')})` : ''));
  ok(bs.fixMap, '§13.3 R-43.16: package → attach sheet; fee → attach on the fee; handover → attach on the handover field; wedding date → the date completion; a bad received-on focuses its field');
  ok(c5b.attachNeeds, '§13.4 R-43.16: the attach sheet\'s own refusals focus their fields, and the date refusal opens the date completion');
  ok(c4.dateFix, '§13.5 F-43.76: the date completion is the WishboneSheet cell, pre-filled with the stored date, saved at day precision, and it leaves the sheet beneath open');
  ok(c4.together, '§13.6 [restated, 3g] F-43.107: the detail\'s two reads run side by side; the body waits only for the package read');
  const detailSrc3 = strip(read('components/vendor/slices/DetailSheet.tsx'));
  ok(c5b.initialRead && /\{bodyLoading \? null : \(<>/.test(detailSrc3) && !/detail-skeleton/.test(detailSrc3)
    && /\{loadingDetail && !leadDetail\s*\? <ConversationWaiting \/>/.test(strip(src.shell)),
    '§13.7 [restated, 3g] F-43.107: no fixed-height placeholder; the body is empty until its first read, and the thread waits in its own shape');
  const wb = strip(read('components/vendor/slices/WishboneSheet.tsx'));
  ok(/useState\(\(initialValues && first && initialValues\[first\]\) \|\| ''\)/.test(wb) && /initialValues\?: Record<string, string>;/.test(wb),
    '§13.8 [re-aimed, 3g] F-43.76: the WishboneSheet pre-fills a value on file');
  ok(c4.scheduleGate && /GATE_FIELD\[bad \|\| ''\]/.test(strip(src.edit)) && /\{message && bad && <NeedFirst text=\{message\} onFix=/.test(strip(src.sheet)),
    '§13.9 R-43.16 sweep: the schedule gate, the package edit gates and the Clients sheet gate each focus their field');
  ok(!/openBookingFromSwipe|setPendingKind|attachFirst/.test(strip(src.shell) + strip(src.card)) && !/data-lc2="booking-attach"/.test(strip(src.booking)),
    '§13.10 R-43.16: no redirect survives (no attach-first path, no pending booking, no extra attach button)');

  sec('§14 · packet 3g');
  // The needs, driven (lib/vendor/bookingNeeds.ts).
  let needs = null;
  try {
    const m = loadModule(read('lib/vendor/bookingNeeds.ts'));
    if (typeof m.bookingNeeds === 'function' && typeof m.attachNeeds === 'function') needs = m;
  } catch (e) { console.log('  (needs did not load: ' + e.message + ')'); }
  const N = needs || {};
  const exact = { wedding_date: '2026-12-22', wedding_date_precision: 'day' };
  const legacy = { wedding_date: '2026-12-22', wedding_date_precision: null };
  const monthOnly = { wedding_date: '2026-12-01', wedding_date_precision: 'month' };
  const none = { wedding_date: null, wedding_date_precision: null };
  const J = (x) => JSON.stringify(x);
  ok(!!needs
    && J(N.bookingNeeds(null, none)) === J(['wedding_date', 'package'])
    && J(N.bookingNeeds(null, monthOnly)) === J(['wedding_date', 'package'])
    && J(N.bookingNeeds(null, exact)) === J(['package'])
    && J(N.bookingNeeds(null, legacy)) === J(['package'])
    && J(N.bookingNeeds(null, null)) === J(['package'])
    && J(N.bookingNeeds({ total: null }, exact)) === J(['fee'])
    && J(N.bookingNeeds({ total: 0 }, exact)) === J(['fee'])
    && J(N.bookingNeeds({ total: 80000 }, none)) === J([])
    && J(N.bookingNeeds(undefined, none)) === J([]),
    '§14.1 a booking needs a package with a fee; with no package it also needs an exact date; an unknown read needs nothing');
  const photo = { delivery_basis: 'days' };
  const hand = { delivery_basis: 'handover' };
  ok(!!needs
    && J(N.attachNeeds({ chosen: photo, fee: 80000, handover: '', lead: exact })) === J([])
    && J(N.attachNeeds({ chosen: photo, fee: 80000, handover: '', lead: none })) === J(['wedding_date'])
    && J(N.attachNeeds({ chosen: photo, fee: null, handover: '', lead: exact })) === J(['fee'])
    && J(N.attachNeeds({ chosen: null, fee: null, handover: '', lead: none })) === J(['wedding_date', 'package'])
    && J(N.attachNeeds({ chosen: hand, fee: 80000, handover: '', lead: exact })) === J(['handover'])
    && J(N.attachNeeds({ chosen: hand, fee: 80000, handover: '2027-02-05', lead: exact })) === J([])
    && J(N.attachNeeds({ chosen: photo, fee: 80000, handover: '', lead: null })) === J([]),
    '§14.2 an attach needs a package, a fee, an exact date and, on a handover package, its date (the server\'s computeSchedule rules)');
  const cm2 = c1.err ? null : loadModule(src.copy);
  ok(!!cm2 && typeof cm2.LEAD_PACKAGE.stillMissing === 'function' && !!cm2.LEAD_PACKAGE.needLabel && cm2.LEAD_PACKAGE.stillMissing([cm2.LEAD_PACKAGE.needLabel.wedding_date, cm2.LEAD_PACKAGE.needLabel.package]) === 'Still missing: Wedding date, Package'
    && cm2.LEAD_PACKAGE.needLabel.package === cm2.LEAD_PACKAGE.fPackage && cm2.LEAD_PACKAGE.needLabel.fee === cm2.LEAD_PACKAGE.fFee
    && cm2.LEAD_PACKAGE.needLabel.handover === cm2.LEAD_PACKAGE.fHandover
    && /wedding_date:\s*\{ label: 'Wedding date'/.test(read('components/vendor/slices/WishboneSheet.tsx')),
    '§14.3 the toast is composed from the existing labels: "Still missing: Wedding date, Package"');
  ok(bs.asks && c5b.attachAsks,
    '§14.4 item 1: Confirm booking and Attach package are never disabled; on a tap with something missing nothing is sent, the toast names it, and the chips at the top each open their own fix');
  const mc = read('components/vendor/MissingChips.tsx');
  ok(/onPick: \(key: string\) => void;/.test(mc) && !/onPick\?:/.test(mc) && /onClick=\{\(\) => onPick\(c\.key\)\}/.test(mc)
    && /if \(cells\.length === 0\) return null;/.test(mc) && /Still missing — tap to complete:/.test(mc),
    '§14.5 one chips component: each chip opens its own cell, and nothing renders when nothing is missing');
  const binder = strip(read('components/vendor/slices/BinderCard.tsx'));
  ok(c4.chipsTop && /const first = start && missing\.includes\(start\) \? start : \(missing\[0\] \?\? null\);/.test(wb)
    && /onClick=\{e => \{ e\.stopPropagation\(\); setWishboneStart\(c\); setWishboneOpen\(true\); \}\}/.test(binder)
    && /start=\{wishboneStart\}/.test(binder),
    '§14.6 F-43.108: a tapped chip opens its own cell, on the lead detail and on the client card');
  const dsrc = strip(read('components/vendor/slices/DetailSheet.tsx'));
  const nameAt = binder.indexOf("{binder.client ?? 'Unnamed'}</div>");
  const chipsAt = binder.indexOf('{chips.length > 0 && (');
  const moneyAt = binder.indexOf('{hasMoney && (');
  ok(c4.chipsTop && /\{detailTop\}\s*\{detailMissing\}\s*\{\(sel\?\.detail/.test(dsrc)
    && nameAt > 0 && chipsAt > nameAt && moneyAt > chipsAt,
    '§14.7 F-43.109: the chips sit at the top, under the package card on the lead detail and under the name on the client card');
  ok(c5b.readOnce && c4.primeOnce, '§14.8 F-43.107: the packages list is read once per Leads visit (primed on entry, cleared on leaving; a failed read is not remembered)');
  const thread3 = strip(read('components/vendor/ConversationThread.tsx'));
  ok(/export function ConversationWaiting\(\)/.test(thread3) && /\[true, false, true\]\.map\(\(isIn, k\) => bubble\(isIn, k\)\)/.test(thread3)
    && /minHeight: 24, padding: '8px 12px'/.test(thread3) && /fontSize: 8, lineHeight: 1\.6, marginTop: 4/.test(thread3)
    && tokensOnly(thread3.slice(thread3.indexOf('export function ConversationWaiting'), thread3.indexOf('export function inboundSender'))),
    '§14.9 F-43.107: the thread waits in the collapsed shape it becomes (three message outlines at the bubble and stamp geometry), tokens only');
  ok(c4.factsWired, '§14.10 the needs read the lead\'s date from the room\'s own leads read, for the card and the booking sheet');

  sec('§15 · packet 3h');
  const cm3 = c1.err ? null : loadModule(src.copy);
  ok(!!cm3 && cm3.LEAD_PACKAGE.attached === 'Package attached.', '§15.1 F-43.110: the vetoed byte, in the copy home');
  const cardS = strip(src.card);
  ok(/if \(r && r\.ok && 'lead_package' in r\) \{ onToast\(LEAD_PACKAGE\.attached, 'success'\); onAttached\(r\.lead_package\); return; \}/.test(cardS)
    && (cardS.match(/LEAD_PACKAGE\.attached/g) || []).length === 1,
    '§15.2 F-43.110: a successful attach or change speaks it once, before the sheet hands the row back; a refusal never does');
  const ds4 = strip(read('components/vendor/slices/DetailSheet.tsx'));
  // [amended, 3j] the full height is sheetBound('88dvh'): 88dvh, and never past the visible viewport.
  ok(/maxHeight: sheetBound\('88dvh'\), \.\.\.\(fullHeight \? \{ height: sheetBound\('88dvh'\) \} : \{\}\),/.test(ds4) && /fullHeight = false,/.test(ds4)
    && /fullHeight=\{slice === 'leads'\}/.test(strip(src.shell)),
    '§15.3 F-43.111: the lead detail opens at its full height from the first frame; other slices keep their content height');
  {
    const m46 = mut(src.card, "{ onToast(LEAD_PACKAGE.attached, 'success'); onAttached(r.lead_package); return; }", "{ onAttached(r.lead_package); return; }");
    ok(m46 !== null && !/onToast\(LEAD_PACKAGE\.attached/.test(m46), '§9 M46 F-43.110: a silent attach → §15.2 RED');
    const m47 = mut(src.shell, "        fullHeight={slice === 'leads'}\n", '');
    ok(m47 !== null && !/fullHeight=\{slice === 'leads'\}/.test(strip(m47)), '§9 M47 F-43.111: the lead detail back to content height → §15.3 RED');
  }

  sec('§16 · packet 3i');
  const leadCells = (code) => {
    const t = strip(code);
    return {
      follows: /if \(slice !== 'leads' \|\| !sel\) return;\s*const fresh = rawRows\.find\(\(r\) => r\.id === sel\.id\);\s*if \(fresh && fresh !== sel\) setSel\(fresh\);\s*\}, \[rawRows\]\);/.test(t),
      keyed: /const selId = sel \? sel\.id : null;/.test(t) && /if \(slice !== 'leads' \|\| !selId\) \{/.test(t)
        && /const id = selId;/.test(t) && /\}, \[selId, slice\]\);/.test(t)
        && !/setLoadingDetail\(true\);[\s\S]*?\}, \[sel, slice\]\);[\s\S]*?const readyLeadId/.test(t),
      readyGate: /const readyLeadId = slice === 'leads' && sel && leadPkg && leadPkg\.id === sel\.id \? sel\.id : null;/.test(t)
        && /if \(leadMarks\.current\.id !== readyLeadId \|\| leadMarks\.current\.ready\) return;\s*leadMarks\.current\.ready = true;\s*markLead\('card-rows'\);/.test(t)
        && /\}, \[readyLeadId\]\);/.test(t)
        && (t.match(/markLead\('card-rows'\)/g) || []).length === 1,
      openMark: /const id = selId;\s*leadMarks\.current = \{ id, ready: false \};\s*markLeadOpen\(\);/.test(t),
      threadMark: /setLeadDetail\(\{[^;]*\}\);\s*if \(res && res\.ok && leadMarks\.current\.id === id\) afterPaint\(\(\) => \{ if \(leadMarks\.current\.id === id\) markLead\('conversation'\); \}\);/.test(t)
        && (t.match(/markLead\('conversation'\)/g) || []).length === 1,
    };
  };
  // The helpers, DRIVEN: the block between the prefix and the SliceScreen banner is transpiled on its
  // own and run over a User Timing double and a frame double.
  const timingDrive = (code) => {
    const a = code.indexOf('const LEAD_MARK_PREFIX');
    const b = code.indexOf('// ── SliceScreen · shared state assembly');
    if (a < 0 || b < a) return {};
    const body = code.slice(a, b) + '\nmodule.exports = { markLeadOpen, markLead, afterPaint };\n';
    const TS = require('typescript'); // `ts` is shadowed in this scope by §11.7's local
    const js = TS.transpileModule(body, { compilerOptions: { module: TS.ModuleKind.CommonJS, target: TS.ScriptTarget.ES2020 } }).outputText;
    const make = (withApi) => {
      let now = 0; const entries = []; let frames = []; let fid = 0;
      const perf = withApi ? {
        mark: (n) => { entries.push({ type: 'mark', name: n, t: ++now }); },
        measure: (n, s, e) => {
          const ms = entries.filter((x) => x.type === 'mark' && x.name === s).pop();
          const me = entries.filter((x) => x.type === 'mark' && x.name === e).pop();
          if (!ms || !me) throw new Error('SyntaxError: mark missing');
          entries.push({ type: 'measure', name: n, d: me.t - ms.t });
        },
        clearMarks: (n) => { for (let i = entries.length - 1; i >= 0; i--) if (entries[i].type === 'mark' && entries[i].name === n) entries.splice(i, 1); },
        clearMeasures: (n) => { for (let i = entries.length - 1; i >= 0; i--) if (entries[i].type === 'measure' && entries[i].name === n) entries.splice(i, 1); },
      } : undefined;
      const raf = (cb) => { const id = ++fid; frames.push({ id, cb }); return id; };
      const caf = (id) => { frames = frames.filter((f) => f.id !== id); };
      const tick = () => { const run = frames; frames = []; run.forEach((f) => f.cb()); };
      const mod = { exports: {} };
      new Function('module', 'exports', 'performance', 'requestAnimationFrame', 'cancelAnimationFrame', js)(mod, mod.exports, perf, raf, caf);
      return { m: mod.exports, entries, tick };
    };
    const r = {};
    try {
      const x = make(true);
      x.m.markLeadOpen(); x.m.markLead('card-rows'); x.m.markLead('conversation');
      x.m.markLeadOpen();                       // a second open clears the first's entries
      x.m.markLead('card-rows');
      const names = x.entries.map((e) => `${e.type}:${e.name}`);
      r.marks = names.join('|') === 'mark:tdw:lead-detail:open|mark:tdw:lead-detail:card-rows|measure:tdw:lead-detail:open→card-rows';
      r.measure = x.entries.some((e) => e.type === 'measure' && e.name === 'tdw:lead-detail:open→card-rows' && e.d > 0);
      let ran = 0;
      x.m.afterPaint(() => { ran++; });
      x.tick(); const afterOne = ran; x.tick();
      const cancel = x.m.afterPaint(() => { ran += 10; }); x.tick(); cancel(); x.tick();
      r.paint = afterOne === 0 && ran === 1;
      const y = make(false);
      y.m.markLeadOpen(); y.m.markLead('conversation');
      r.noApi = true;
    } catch { return r; }
    return r;
  };
  const lc = leadCells(src.shell);
  ok(lc.follows, '§16.1 F-43.113: the open lead detail follows its refetched row (chips, Wedding date row, booked badge in place)');
  ok(lc.keyed, '§16.2 F-43.113: the detail\'s two reads are keyed on the lead\'s id, so a followed row re-reads nothing');
  const td = timingDrive(src.shell);
  ok(!!td.marks && !!td.measure && !!td.paint && !!td.noApi,
    '§16.3 F-43.112 DRIVEN: open, card-rows and conversation marks, a measure from open, cleared per open; after two frames, cancellable; skipped with no API');
  ok(lc.readyGate && lc.openMark && lc.threadMark,
    '§16.4 F-43.112: card-rows marks once per open only when the package read for this lead is in; the conversation\'s landing is its own mark');
  {
    const m48 = mut(src.shell, "    if (slice !== 'leads' || !sel) return;\n    const fresh = rawRows.find((r) => r.id === sel.id);\n    if (fresh && fresh !== sel) setSel(fresh);", "    if (slice !== 'leads' || !sel) return;\n    const fresh = rawRows.find((r) => r.id === sel.id);");
    ok(m48 !== null && !leadCells(m48).follows, '§9 M48 F-43.113: the lead detail keeps its stale row → §16.1 RED');
    const m49 = mut(src.shell, '  }, [selId, slice]);', '  }, [sel, slice]);');
    ok(m49 !== null && !leadCells(m49).keyed, '§9 M49 F-43.113: the reads re-run on every followed row → §16.2 RED');
    const m50 = mut(src.shell, "    performance.measure(`${LEAD_MARK_PREFIX}open→${name}`, LEAD_MARK_PREFIX + 'open', LEAD_MARK_PREFIX + name);", '');
    const d50 = m50 === null ? { measure: true } : timingDrive(m50);
    ok(m50 !== null && !d50.measure, '§9 M50 F-43.112: no measure from the open mark → §16.3 RED');
    const m51 = mut(src.shell, "  const outer = requestAnimationFrame(() => { inner = requestAnimationFrame(fn); });", "  const outer = requestAnimationFrame(fn);");
    const d51 = m51 === null ? { paint: true } : timingDrive(m51);
    ok(m51 !== null && !d51.paint, '§9 M51 F-43.112: the mark before the frame is painted → §16.3 RED');
    const m52 = mut(src.shell, "const readyLeadId = slice === 'leads' && sel && leadPkg && leadPkg.id === sel.id ? sel.id : null;", "const readyLeadId = slice === 'leads' && sel ? sel.id : null;");
    ok(m52 !== null && !leadCells(m52).readyGate, '§9 M52 F-43.112: card-rows marked before the package read → §16.4 RED');
    const m53 = mut(src.shell, "if (leadMarks.current.id === id) markLead('conversation');", "if (leadMarks.current.id === id) markLead('card-rows');");
    ok(m53 !== null && !(leadCells(m53).readyGate && leadCells(m53).threadMark), '§9 M53 F-43.112: the conversation\'s landing folded into card-rows → §16.4 RED');
  }

  sec('§17 · packet 3j · the one sheet layer (F-43.116)');
  const stackSrc = read('lib/vendor/sheetStack.ts');
  const layerSrc = read('components/vendor/SheetLayer.tsx');
  const stackDrive = (code) => {
    const r = {};
    let m;
    try { m = loadModule(code); } catch { return r; }
    try {
      m.resetLayers();
      m.openLayer('detail'); m.openLayer('booking');
      r.twoDeep = m.isBeneath('detail') && !m.isBeneath('booking') && m.isTop('booking') && m.depthOf('booking') === 1;
      r.zOrder = m.layerZ(1).scrim > m.layerZ(0).panel && m.layerZ(1).panel > m.layerZ(1).scrim && m.layerZ(0).scrim === 40 && m.layerZ(0).panel === 50;
      m.openLayer('attach');
      r.threeDeep = m.isBeneath('detail') && m.isBeneath('booking') && m.isTop('attach') && m.layerZ(2).scrim > m.layerZ(1).panel;
      m.closeLayer('attach');
      r.pops = m.isTop('booking') && !m.isBeneath('booking') && m.isBeneath('detail');
      m.openLayer('booking');
      r.idempotent = m.openLayers().length === 2;
      m.closeLayer('detail');
      r.middleLeaves = m.isTop('booking') && m.openLayers().length === 1 && m.depthOf('detail') === -1;
      let n = 0; const un = m.subscribeLayers(() => { n++; }); m.openLayer('x'); m.closeLayer('x'); un(); m.openLayer('y');
      r.emits = n === 2;
      m.resetLayers();
      const none = m.viewportVars(900, null);
      const kb = m.viewportVars(900, { height: 570, offsetTop: 0 });
      const chrome = m.viewportVars(900, { height: 860, offsetTop: 0 });
      r.viewport = none.kb === '0px' && none.vvh === '100dvh' && /safe-area-inset-bottom/.test(none.safe)
        && kb.kb === '330px' && kb.vvh === '570px' && kb.safe === '0px'
        && chrome.kb === '0px' && chrome.vvh === '860px' && /safe-area-inset-bottom/.test(chrome.safe);
      r.bound = m.sheetBound('90dvh') === 'min(90dvh, calc(var(--tdw-vvh, 100dvh) - 12px))';
    } catch { return r; }
    return r;
  };
  const sd = stackDrive(stackSrc);
  ok(!!sd.twoDeep && !!sd.threeDeep && !!sd.pops && !!sd.idempotent && !!sd.middleLeaves && !!sd.emits,
    '§17.1 DRIVEN: open order is depth; every open sheet beneath the top is beneath; closing the top hands the scroll back; reopening is one layer; a closed middle leaves');
  ok(!!sd.zOrder, '§17.2 DRIVEN: each layer\'s backdrop sits above the sheet beneath it and below its own sheet; depth 0 keeps the estate\'s 40/50');
  ok(!!sd.viewport && !!sd.bound, '§17.3 DRIVEN: the keyboard is read from the visual viewport (330px covered → bottom 330px, height 570px, no safe-area); browser chrome is not a keyboard; the height bound');
  const layerCells = (code) => {
    const t = strip(code);
    return {
      portal: /return createPortal\(\s*<div data-sheet-layer=\{testId \|\| ''\} inert=\{isBeneath\(id\)\}\s*style=\{\{ position: 'relative', zIndex: z\.panel, background: 'none' \}\}>\{children\(z\)\}<\/div>,\s*host,\s*\);/.test(t)
        && /const host = mounted \? mountNode\(\) : null;/.test(t),
      lifted: /style=\{\{ position: 'relative', zIndex: z\.panel, background: 'none' \}\}/.test(t),
      skin: /document\.querySelector<HTMLElement>\('\.wl'\)/.test(t)
        && /return shellNode\(\) \|\| document\.body;/.test(t),
      registers: /if \(!open\) return undefined;\s*openLayer\(id\);\s*const unwatch = watchViewport\(\);\s*return \(\) => \{ closeLayer\(id\); unwatch\(\); \};/.test(t),
      follows: /useSyncExternalStore\(subscribeLayers, openLayers, \(\) => serverStack\)/.test(t),
      zFromDepth: /const z = layerZ\(depthOf\(id\)\);/.test(t),
      bodyScroll: /overflowY: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', minHeight: 0,/.test(t),
      vars: /s\.setProperty\('--tdw-vvh', v\.vvh\);\s*s\.setProperty\('--tdw-kb', v\.kb\);\s*s\.setProperty\('--tdw-safe', v\.safe\);/.test(t)
        && /vv\?\.addEventListener\('resize', on\);/.test(t),
      reset: /if \(open && ref\.current\) ref\.current\.scrollTop = 0;/.test(t),
    };
  };
  const lc17 = layerCells(layerSrc);
  ok(lc17.portal && lc17.registers && lc17.follows && lc17.zFromDepth,
    '§17.4 the layer: mounted at document.body (no ancestor re-anchors a fixed sheet), registered while open, inert only when beneath, z from depth');
  ok(lc17.bodyScroll && lc17.vars && lc17.reset, '§17.5 the layer: the body scroll style (contained, momentum, shrinkable), the viewport variables, scroll reset on open');
  // The five sheets: each mounts through the layer, takes its z from it, carries a scroll body, sits on the
  // keyboard line and is bounded by the visible viewport. No hand-set numeric z-index survives in them.
  const SHEETS = {
    shared: ['components/vendor/packages/PackageFields.tsx', "<SheetLayer open={open} testId={testId}>", "90dvh"],
    detail: ['components/vendor/slices/DetailSheet.tsx', '<SheetLayer open={open} testId="detail-sheet">', '88dvh'],
    client: ['components/vendor/ClientBookingSheet.tsx', '<SheetLayer open={open} testId="client-booking-sheet">', '88dvh'],
    wishbone: ['components/vendor/slices/WishboneSheet.tsx', '<SheetLayer open testId="wishbone-sheet">', '88dvh'],
    binder: ['components/vendor/slices/BinderCard.tsx', '<SheetLayer open testId="binder-edit-sheet">', '85dvh'],
  };
  const layerSheetCells = (code, mount, cap) => {
    const t = strip(code);
    return {
      mount: t.includes(mount) && /zIndex: z\.scrim/.test(t) && /zIndex: z\.panel/.test(t),
      noHandZ: !/zIndex:\s*\d/.test(t.slice(t.indexOf(mount) < 0 ? 0 : t.indexOf(mount))),
      body: /data-sheet-body=""/.test(t) && /\.\.\.SHEET_BODY_SCROLL/.test(t),
      keyboard: /bottom: SHEET_BOTTOM/.test(t) && t.includes(`sheetBound('${cap}')`) && /SHEET_SAFE/.test(t) && /boxSizing: 'border-box'/.test(t),
    };
  };
  const sc17 = Object.fromEntries(Object.entries(SHEETS).map(([k, [f, m, cap]]) => [k, layerSheetCells(read(f), m, cap)]));
  for (const [k, v] of Object.entries(sc17)) {
    ok(v.mount && v.noHandZ && v.body && v.keyboard, `§17.6 ${k}: through the layer, z from depth, no hand-set z-index, its own scroll body, on the keyboard line and bounded by the visible viewport`);
  }
  // A cell per stacking pair: open the outer, open the inner; the inner body's scroll container is present
  // and not locked (its layer is not beneath), the outer is locked under the inner's backdrop.
  const PAIRS = [
    ['lead detail → booking sheet', 'detail', 'shared'],
    ['booking sheet → attach sheet (+ Package)', 'shared', 'shared'],
    ['lead detail → attach sheet (the card)', 'detail', 'shared'],
    ['booking sheet → date completion (+ Wedding date)', 'shared', 'wishbone'],
    ['lead detail → date completion (a detail chip)', 'detail', 'wishbone'],
    ['Packages room → edit sheet', null, 'shared'],
    ['Clients room → Clients sheet', null, 'client'],
    ['client card → client edit sheet', null, 'binder'],
    ['client card → date completion (a card chip)', null, 'wishbone'],
  ];
  const pairDrive = (stackCode, layerT, outerKey, innerKey, sheets) => {
    let m, innerLocked, outerLocked;
    try {
      m = loadModule(stackCode);
      m.resetLayers();
      if (outerKey) m.openLayer('outer');
      m.openLayer('inner');
      innerLocked = m.isBeneath('inner');
      outerLocked = outerKey ? m.isBeneath('outer') : true;
      m.resetLayers();
    } catch { return false; }
    const inner = sheets[innerKey];
    const outer = outerKey ? sheets[outerKey] : { mount: true };
    const lockOnlyBeneath = /inert=\{isBeneath\(id\)\}/.test(layerT);
    return !innerLocked && outerLocked && inner.body && inner.mount && outer.mount && lockOnlyBeneath;
  };
  for (const [label, o, i] of PAIRS) ok(pairDrive(stackSrc, strip(layerSrc), o, i, sc17), `§17.7 pair · ${label}: the inner body scrolls and is not locked; the outer is locked beneath`);
  const cardSrc = strip(read('components/vendor/slices/BinderCard.tsx'));
  ok(/<div data-sheet-body="" style=\{\{ flex: 1, \.\.\.SHEET_BODY_SCROLL,[^}]*\}\}>[\s\S]*?<\/div>\s*<div style=\{\{ padding: `12px 24px calc\(24px \+ \$\{SHEET_SAFE\}\)`, borderTop: '0\.5px solid var\(--atelier-card-border\)', flexShrink: 0 \}\}>\s*<button type="button" onClick=\{save\}/.test(cardSrc)
    && (cardSrc.match(/onClick=\{save\}/g) || []).length === 1,
    '§17.8 the client edit sheet: Save sits in a pinned action row after the scroll body (chair-ruled), once');
  ok(lc17.lifted && lc17.skin,
    '§17.9 F-43.119: the layer carries the depth\'s z-index itself (app/globals.css:959 makes every root child a stacking context) and wears the shell\'s wl class and data-wl-mode, so a portaled sheet is above the room and in its palette');
  {
    const m62 = mut(layerSrc, "style={{ position: 'relative', zIndex: z.panel, background: 'none' }}", "style={{ background: 'none' }}");
    ok(m62 !== null && !layerCells(m62).lifted, '§9 M62 F-43.119: the layer without its own z-index (trapped under the room) → §17.9 RED');
    const m63 = mut(layerSrc, "return shellNode() || document.body;", "return document.body;");
    ok(m63 !== null && !layerCells(m63).skin, '§9 M63 F-43.119: the layer mounted at the page root again (outside the room\'s palette: Graphite in Chalk) → §17.9 RED');
  }
  {
    const m54 = mut(layerSrc, "inert={isBeneath(id)}", "inert={depthOf(id) >= 0}");
    ok(m54 !== null && PAIRS.every(([, o, i]) => !pairDrive(stackSrc, strip(m54), o, i, sc17)), '§9 M54 F-43.116: the lock restored on the top sheet → every §17.7 pair RED');
    const m55 = mut(stackSrc, "export function isBeneath(id: string): boolean { const d = depthOf(id); return d >= 0 && d < stack.length - 1; }", "export function isBeneath(id: string): boolean { const d = depthOf(id); return d >= 0 && d <= stack.length - 1; }");
    ok(m55 !== null && PAIRS.every(([, o, i]) => !pairDrive(m55, strip(layerSrc), o, i, sc17)), '§9 M55 F-43.116: the topmost sheet counted as beneath (locked) → every §17.7 pair RED');
    const m56 = mut(read(SHEETS.shared[0]), "<div ref={bodyRef} data-sheet-body=\"\" style={{ flex: 1, ...SHEET_BODY_SCROLL,", "<div ref={bodyRef} style={{ flex: 1, overflowY: 'hidden',");
    ok(m56 !== null && !layerSheetCells(m56, SHEETS.shared[1], '90dvh').body, '§9 M56 F-43.116: the shared sheet\'s body locked → §17.6 shared RED');
    const m57 = mut(read(SHEETS.wishbone[0]), "position: 'fixed', left: 0, right: 0, bottom: SHEET_BOTTOM, zIndex: z.panel,", "position: 'fixed', left: 0, right: 0, bottom: SHEET_BOTTOM, zIndex: 61,");
    ok(m57 !== null && !layerSheetCells(m57, SHEETS.wishbone[1], '88dvh').mount, '§9 M57 F-43.116: a hand-set z-index back on the date completion → §17.6 wishbone RED');
    const m58 = mut(layerSrc, "return createPortal(", "return (false) && createPortal(");
    ok(m58 !== null && !layerCells(m58).portal, '§9 M58 F-43.116: the layer mounted in place (a transformed ancestor re-anchors it) → §17.4 RED');
    const m59 = mut(stackSrc, "const covered = Math.max(0, Math.round(layoutHeight - vv.height - vv.offsetTop));", "const covered = 0;");
    ok(m59 !== null && !stackDrive(m59).viewport, '§9 M59 F-43.116: the keyboard ignored → §17.3 RED');
    const m60 = mut(stackSrc, "return { scrim: LAYER_BASE + LAYER_STEP * d, panel: LAYER_BASE + 10 + LAYER_STEP * d };", "return { scrim: LAYER_BASE, panel: LAYER_BASE + 10 };");
    ok(m60 !== null && !stackDrive(m60).zOrder, '§9 M60 F-43.116: every layer at 40/50 again (a stacked backdrop under the sheet beneath) → §17.2 RED');
    const m61 = mut(read(SHEETS.binder[0]), "        <div style={{ padding: `12px 24px calc(24px + ${SHEET_SAFE})`, borderTop: '0.5px solid var(--atelier-card-border)', flexShrink: 0 }}>\n", "        <div>\n");
    ok(m61 !== null && !/flexShrink: 0 \}\}>\s*<button type="button" onClick=\{save\}/.test(strip(m61)), '§9 M61 the client edit sheet\'s Save back into the scroll → §17.8 RED');
  }

  sec('§9 · mutations of production source');
  const M = [
    [F.copy, "advancePaid: 'Advance paid',", "advancePaid: 'Advance received',", (m) => !copyCells(m).a2, 'M1 an A2 byte drifts → §1.1 RED'],
    [F.copy, "if (!p.nextDue) return `Payment marked: ${p.client} · paid in full.`;", '', (m) => !copyCells(m).d4, 'M2 D4 dropped → §1.7 RED'],
    [F.copy, 'return new Date(t + 330 * 60 * 1000).toISOString().slice(0, 10);', 'return new Date(t).toISOString().slice(0, 10);', (m) => !copyCells(m).istDay, 'M3 the UTC day used → §1.8 RED'],
    [F.booking, "kind === 'advance_paid' ? { kind, advance_received_on: receivedOn } : { kind }", '{ kind, advance_received_on: receivedOn }', (m) => !bookingCells(m).act, 'M4 the date sent on every booking → §3.2 RED'],
    [F.booking, "        refreshAfterBooking();\n        onToast(BOOKING.booked, 'success');", "        onToast(BOOKING.booked, 'success');", (m) => !bookingCells(m).a13, 'M5 A13 without the refresh → §3.8 RED'],
    [F.booking, "style={actionButton('mute')} onClick={onClose}", "style={textButton('mute')} onClick={onClose}", (m) => !bookingCells(m).cancel, 'M6 the Cancel back to text → §3.10 RED'],
    [F.shell, ": { label: 'Booked', onTrigger: () => setBooking({ leadId: row.id, kind: 'booking_confirmed' }) },", ": { label: 'Booked', onTrigger: () => { void patchLeadState(row.id, 'booked'); } },", (m) => { const c = shellCells(m); return !c.swipe && !c.noBareBooked; }, 'M7 [re-aimed, 3f] the swipe writes booked directly → §4.1 and §4.2 RED'],
    [F.shell, "right: (row.badge ?? '').toLowerCase() === 'booked'\n        ? undefined\n        :", 'right:', (m) => !shellCells(m).swipe, 'M25 F-43.95: the swipe offered on a booked lead → §4.1 RED'],
    [F.shell, '!removeSchedule && !sel.isPackage && (', '!removeSchedule && (', (m) => !shellCells(m).f16, 'M8 Remove drawn on a booking\'s invoice → §4.6 RED'],
    [F.shell, "res.code === 'PACKAGE_SCHEDULE' ? COPY.studioScheduleRemoveFailed : (res.error ?? COPY.studioScheduleRemoveFailed)", 'res.error ?? COPY.studioScheduleRemoveFailed', (m) => !shellCells(m).b1, 'M9 the door\'s text reaches the toast → §4.7 RED'],
    [F.shell, "if (!('ok' in r) || !r.ok || !r.invoice) {", 'if (false) {', (m) => !shellCells(m).f17, 'M10 [re-aimed, 3c] D3 spoken without checking the answer → §4.8 RED'],
    [F.shell, "const paidInFull = r.invoice.state === 'paid' || !r.invoice.due_date;", 'const paidInFull = false;', (m) => !shellCells(m).f17Fields, 'M11 D4 never chosen → §4.9 RED'],
    [F.card, '{!booked && onBook && (', '{onBook && (', (m) => !cardCells(m, src.edit).gated, 'M12 [re-aimed, 3d] booking offered on a booked lead → §5.1 RED'],
    [F.card, "gridTemplateColumns: '1fr 1fr'", "gridTemplateColumns: '2fr 1fr'", (m) => !cardCells(m, src.edit).pair, 'M26 F-43.97: the pair unequal → §11.2 RED'],
    [F.card, 'borderBottom: `0.5px solid ${T.card}`', 'borderTop: `0.5px solid ${T.card}`', (m) => !cardCells(m, src.edit).hairline, 'M27 F-43.97: no hairline before the detail rows → §11.3 RED'],
    [F.card, "onClick={() => book('advance_paid')}", "onClick={() => book('booking_confirmed')}", (m) => !cardCells(m, src.edit).both, 'M13 [re-aimed, 3c] Advance paid hands the wrong kind → §5.3 RED'],
    [F.card, 'const book = (k: BookingKind) => { if (onBook) onBook(k); };', 'const book = (k: BookingKind) => { if (onBook) { setSheetOpen(true); onBook(k); } };', (m) => !cardCells(m, src.edit).both, 'M20 [re-aimed, 3f] a booking control that opens the attach sheet → §5.3 RED'],
    [F.card, "onAttached={(row) => { setLp(row); setSheetOpen(false); }}", "onAttached={(row) => { setLp(row); setSheetOpen(false); const pendingKind = 'x'; void pendingKind; }}", (m) => !cardCells(m, src.edit).continues, 'M21 [re-aimed, 3f] a booking carried across an attach → §5.8 RED'],
    [F.card, "fix: code === 'no_wedding_date' ? onNeedWeddingDate", "fix: code === 'no_wedding_date' ? () => focusOn('att-pkg')", (m) => !cardCells(m, src.edit).attachNeeds, 'M38 R-43.16: the date refusal without its date fix → §13.4 RED'],
    [F.card, "if (initial !== undefined) { setLp(initial); return; }", '', (m) => !cardCells(m, src.edit).initialRead, 'M39 F-43.105: the card ignores the detail\'s read → §13.7 RED'],
    [F.shell, "void fetchLeadPackage(id)\n      .then((pk) => setLeadPkg(", "void Promise.all([\n      fetchLeadDetail(id).catch(() => null), fetchLeadPackage(id)]).then(([, pk]) => setLeadPkg(", (m) => !shellCells(m).together, 'M40 [re-aimed, 3g] the reads made to wait on each other → §13.6 RED'],
    [F.card, "if (packagesCache) return Promise.resolve(packagesCache);", '', (m) => !cardCells(m, src.edit).readOnce, 'M44 F-43.107: the packages read every open → §14.8 RED'],
    [F.card, "    if (needsNow.length) {\n      setAsked(true); setNeed(null);", "    if (false) {\n      setAsked(true); setNeed(null);", (m) => !cardCells(m, src.edit).attachAsks, 'M45 item 1: the attach sends with something missing → §14.4 RED'],
    [F.shell, "wedding_date_precision: 'day' }", '}', (m) => !shellCells(m).dateFix, 'M41 F-43.76: the fixed date is not stored exact → §13.5 RED'],
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
    const b1 = mut(src.booking, "{need && <NeedFirst text={needText(need.code)} onFix={fixFor(need.code)} testId=\"booking\" />}", "{need && <p role=\"alert\">{needText(need.code)}</p>}");
    ok(b1 !== null && !bookingCells(b1).attachOffer, '§9 M34 [re-aimed, 3f] the refusal as a dead line → §12.4 RED');
    const s1 = mut(src.shell, "{/* CE-43 LC-2 packet 3f · R-43.16: the wedding-date completion a refusal line opens. */}", "<AttachSheet open={false} leadId=\"\" current={null} onClose={() => {}} onAttached={() => {}} onToast={() => {}} onNeedWeddingDate={() => {}} />");
    ok(s1 !== null && !shellCells(s1).swipeAttachFirst, '§9 M35 [re-aimed, 3f] an attach-first sheet back in the shell → §12.5 RED');
    // M43 · §13.2 bites: the package edit sheet's gate back to a dead line.
    {
      const e1 = mut(src.edit, '      {gate && (\n        <NeedFirst text={gate}', '      {gate && <p role="alert">{gate}</p>}{false && (\n        <NeedFirst text={gate}');
      const surfaces2 = { booking: src.booking, card: src.card, shell: src.shell, sheet: src.sheet, edit: e1 || '' };
      const bad2 = Object.entries(surfaces2).filter(([, code]) => {
        const t = strip(code);
        const alerts = t.match(/<(p|div|span)[^>]*role="alert"[^>]*>\s*\{(message|gate|need[^}]*|LEAD_PACKAGE\.refusals[^}]*)\}/g) || [];
        return alerts.some((a) => !/\{message\}/.test(a));
      });
      ok(e1 !== null && bad2.length === 1 && bad2[0][0] === 'edit', '§9 M43 R-43.16: a needs-first line rendered dead → §13.2 RED');
    }
    const b3 = mut(src.booking, "if (code === 'no_wedding_date') { if (leadId) onNeedWeddingDate(leadId); return; }", '');
    ok(b3 !== null && !bookingCells(b3).fixMap, '§9 M42 R-43.16: the booking sheet\'s date refusal without its fix → §13.3 RED');
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
