#!/usr/bin/env node
// scripts/d1_book_bench_v2.mjs · DESIGN-1 · STAGE 4 · THE ONE-TAP BOOK, the pwa's half (the founder's answers), v2 tree.
// The server's half (each date its own event, the calendar always filled, the amount with no package, Undo and Cancel
// booking) is dream-os scripts/d1_booking_bench.js on design/stage-4-book. This holds the sheet and the client's page:
//   §1 the words and derivations (v2/lib/worklist/book.ts), driven;
//   §2 the Book sheet (v2/components/vendor/packages/BookingSheet.tsx): the dates, each sent; the invoice ticked and
//      untickable; the package picked or "No package, enter an amount" in the same sheet; Change plan one tap from the
//      plan's sentence; no message sent by itself, the draft in its own box (R-46.17) with the send on her tap; a
//      10-second Undo that removes exactly what the booking wrote;
//   §3 Cancel booking on the client's page (BinderCard, CancelBookingSheet): asks first, both answers unticked, a paid
//      invoice never offered.
// A mutation per claim, R-46.17's "joined" mutation for the draft's box among them.
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const ts = require(path.join(ROOT, 'node_modules/typescript'));
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');

function loader(overrides = {}) {
  const cache = new Map();
  const resolve = (spec, from) => {
    const base = spec.startsWith('@/') ? path.join(ROOT, spec.slice(2)) : spec.startsWith('.') ? path.resolve(path.dirname(from), spec) : null;
    if (!base) return null;
    for (const e of ['', '.ts', '.tsx', '/index.ts']) { const p = base + e; if (fs.existsSync(p) && fs.statSync(p).isFile()) return p; }
    throw new Error('cannot resolve ' + spec);
  };
  const load = (file) => {
    if (cache.has(file)) return cache.get(file).exports;
    const rel = path.relative(ROOT, file);
    const src = rel in overrides ? overrides[rel] : fs.readFileSync(file, 'utf8');
    const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    const mod = { exports: {} }; cache.set(file, mod);
    new Function('exports', 'require', 'module', 'process', out)(mod.exports, (sp) => { const r = resolve(sp, file); return r ? load(r) : require(sp); }, mod, process);
    return mod.exports;
  };
  return (rel) => load(path.join(ROOT, rel));
}
let pass = 0, fail = 0; const failed = [];
const cell = (name, r) => { if (r === true) { pass++; console.log('  ok   ' + name); } else { fail++; failed.push(name); console.log('  FAIL ' + name + '  → ' + r); } };

const BOOKTS = 'v2/lib/worklist/book.ts', SHEET = 'v2/components/vendor/packages/BookingSheet.tsx';
const CARD = 'v2/components/vendor/slices/BinderCard.tsx', CANCEL = 'v2/components/vendor/packages/CancelBookingSheet.tsx';
const SCHED = [{ kind: 'deposit', pct: 30, amount: 24000, due_on: '2026-09-29' }, { kind: 'middle', pct: 30, amount: 24000, due_on: '2026-11-22' }, { kind: 'final', pct: 40, amount: 32000, due_on: '2027-02-05' }];

function libCells(B) {
  const draft = B.confirmationDraft({ first: 'Sarah', dates: ['2026-12-22', '2026-12-20', '2026-12-21'], total: 80000, invoice: 'TDW/DEV440/12' });
  return {
    fns: JSON.stringify(B.functionsOf([{ date: '2026-12-20', title: ' Haldi ' }, { date: '', title: 'x' }, { date: '2026-12-20', title: 'again' }, { date: '2026-12-22', title: '' }])) === JSON.stringify([{ date: '2026-12-20', title: 'Haldi' }, { date: '2026-12-22' }]),
    plan: B.planSentence(SCHED) === 'Rs 24,000 on booking, Rs 24,000 on 22 November 2026 and Rs 32,000 on 5 February 2027.',
    draft: draft === 'Hi Sarah, your booking is confirmed for 20, 21 and 22 December 2026. The booking amount is Rs 80,000, invoice TDW/DEV440/12. Thank you!',
    noDash: !/[—–]| - /.test(draft + Object.values(B.BOOK).filter((v) => typeof v === 'string').join(' ')),
    wa: B.waLink('98765 43210', 'Hi') === 'https://wa.me/919876543210?text=Hi' && B.waLink(null, 'Hi') === 'https://wa.me/?text=Hi',
    undo: B.UNDO_SECONDS === 10 && B.BOOK.undo(7) === 'Undo (7)',
  };
}
function sheetCells(sheet) {
  const s = strip(sheet);
  const booked = s.slice(s.indexOf('// ── 2 · BOOKED') >= 0 ? s.indexOf('if (booked) {') : 0);
  return {
    datesSent: /const fns = functionsOf\(dates\);/.test(s) && /if \(!fns\.length\) \{ setNeed\('dates'\); return; \}/.test(s) && /promoteLead\(leadId, \{\s*kind, functions: fns,/.test(s) && /onClick=\{\(\) => setDates\(\(xs\) => \[\.\.\.xs, \{ date: '', title: '' \}\]\)\}>\{BOOK\.addDate\}/.test(s),
    invoice: /<input type="checkbox" checked disabled readOnly aria-describedby="book-invoice-note" \/>/.test(s) && /\{BOOK\.invoiceLine\(invoiceAmount\)\}/.test(s),
    samePkg: /data-book-pkg=\{NO_PKG\}/.test(s) && /\{BOOK\.noPackage\}/.test(s) && /\.\.\.\(noPkg \? \{ amount: amt,/.test(s) && /const a = await attachLeadPackage\(leadId, \{ package_id: chosen\.id \}\);/.test(s),
    changePlan: /<div data-book-plan="" [^>]*>\s*<p [^>]*>\{BOOK\.planHead\}: \{planSentence\(lp\.schedule\)\}<\/p>\s*<button type="button" data-book-change-plan="" [^>]*onClick=\{\(\) => setAttach\(\{ focus: null \}\)\}>\{BOOK\.changePlan\}<\/button>/.test(s),
    noAuto: !/fetch\(|postJson|sendMessage|window\.open\(|location\.href\s*=/.test(s) && /<a data-book-send="" href=\{waLink\(leadPhone, draft\)\} target="_blank"/.test(s),
    draftBox: /\{head\(BOOK\.draftHead\(first\)\)\}\s*<p [^>]*>\{BOOK\.draftNote\}<\/p>\s*<CopyBox text=\{draft\} label="Copy" copied="Copied" \/>/.test(booked),
    undo: /setLeft\(UNDO_SECONDS\);/.test(s) && /\{left > 0 && <button type="button" data-book-undo=""/.test(s)
      && /const created = \(p\.events \|\| \[\]\)\.filter\(\(e\) => e\.created && e\.id\)\.map\(\(e\) => e\.id as string\);/.test(s)
      && /unbookBooking\(\{ lead_id: leadId, event_ids: created, back_to: back, remove_events: true, remove_invoice: !!p\.invoice_created \}\)/.test(s),
  };
}
// found by this stage's own screenshots: the room closed the sheet on booking (so the draft and Undo never showed), and
// the sheet reset whenever the room re-rendered (it keyed its reset on an object the room rebuilds every render)
function stayCells(shell, sheet) {
  const sh = strip(shell), s = strip(sheet);
  const onBooked = (sh.match(/onBooked=\{\(\) => \{[\s\S]*?\n\s*\}\}/) || [''])[0];
  return {
    stays: onBooked.length > 0 && !/setBooking\(null\)/.test(onBooked),
    keyed: /\}, \[open, initialKind, leadId, wd\]\);/.test(s) && !/\[open, initialKind, leadId, leadFacts\]/.test(s),
  };
}
function cancelCells(card, cancel) {
  const c = strip(card), k = strip(cancel);
  return {
    onlyBooked: /\{binder\.booked_lead && \(\s*<button type="button" data-cancel-booking=""/.test(c) && /<CancelBookingSheet open binderId=\{binder\.id\}/.test(c),
    asksFirst: /unbookBooking\(\{ binder_id: binderId, dry_run: true \}\)/.test(k) && k.indexOf('dry_run: true') < k.indexOf('remove_events: rmEvents'),
    unticked: /const \[rmEvents, setRmEvents\] = useState\(false\);/.test(k) && /const \[rmInvoice, setRmInvoice\] = useState\(false\);/.test(k) && /setRmEvents\(false\); setRmInvoice\(false\);/.test(k),
    paidKept: /plan\.invoice\.paid\s*\?\s*<p data-cancel-kept=""/.test(k) && /: tick\(rmInvoice, setRmInvoice, BOOK\.removeInvoice\(plan\.invoice\.number\), 'invoice'\)/.test(k),
    sends: /unbookBooking\(\{ binder_id: binderId, remove_events: rmEvents, remove_invoice: rmInvoice \}\)/.test(k),
  };
}

console.log('d1 book (v2) · the one-tap Book');
console.log('\n§1 the words and derivations');
const l = libCells(loader()(BOOKTS));
cell('1.1 the dates sent: each well-formed date once, its title trimmed', l.fns || 'wrong');
cell('1.2 the payment plan is one sentence', l.plan || 'wrong');
cell('1.3 the confirmation draft names the dates, the amount and the invoice', l.draft || 'wrong');
cell('1.4 no dash in the draft or the sheet’s words (W1)', l.noDash || 'a dash');
cell('1.5 Send on WhatsApp opens her number (or asks whom) with the draft', l.wa || 'wrong');
cell('1.6 Undo lasts ten seconds and counts down', l.undo || 'wrong');
console.log('\n§2 the Book sheet');
const sc = sheetCells(read(SHEET));
cell('2.1 every date she enters is sent, each its own event; with none, nothing is sent', sc.datesSent || 'not sent');
cell('2.2 the invoice is offered ticked and cannot be unticked', sc.invoice || 'tickable');
cell('2.3 with no package: pick one, or No package, enter an amount, in the same sheet', sc.samePkg || 'elsewhere');
cell('2.4 Change plan is one tap from the plan’s sentence', sc.changePlan || 'not beside it');
cell('2.5 no message goes by itself: the only send is her tap on Send on WhatsApp', sc.noAuto || 'sends');
cell('2.6 R-46.17: the draft sits in its own box with Copy, its explanation outside', sc.draftBox || 'joined');
cell('2.7 a 10-second Undo removes exactly what the booking wrote', sc.undo || 'wrong');
const SHELL = 'v2/components/vendor/slices/SliceShell.tsx';
const st = stayCells(read(SHELL), read(SHEET));
cell('2.8 the sheet stays open on its Booked step until Done (the room does not close it on booking)', st.stays || 'closed');
cell('2.9 the sheet resets when it opens, never when the room re-renders', st.keyed || 'resets');
console.log('\n§3 Cancel booking on the client’s page');
const cc = cancelCells(read(CARD), read(CANCEL));
cell('3.1 offered on a client with a booked lead, from the client’s own card', cc.onlyBooked || 'not there');
cell('3.2 it asks first: a dry run lists the dates and the invoice before anything is sent', cc.asksFirst || 'no ask');
cell('3.3 both answers start unticked: nothing is removed unless she says so', cc.unticked || 'ticked');
cell('3.4 an invoice with payments is never offered for removal; the sheet says it stays', cc.paidKept || 'offered');
cell('3.5 her two answers are what is sent', cc.sends || 'not hers');

console.log('\nmutations (each must turn its cell red)');
const mut = (name, fn) => { let r; try { r = fn(); } catch { r = false; } cell(name, r === true ? 'still green' : true); };
const S = read(SHEET), C = read(CARD), K = read(CANCEL), BT = read(BOOKTS);
mut('M1 Undo at thirty seconds → 1.6 RED', () => libCells(loader({ [BOOKTS]: BT.replace('UNDO_SECONDS = 10', 'UNDO_SECONDS = 30') })(BOOKTS)).undo);
mut('M2 the dates not sent → 2.1 RED', () => sheetCells(S.replace('kind, functions: fns,', 'kind,')).datesSent);
mut('M3 the invoice can be unticked → 2.2 RED', () => sheetCells(S.replace('<input type="checkbox" checked disabled readOnly', '<input type="checkbox" defaultChecked')).invoice);
mut('M4 Change plan moved off the sentence → 2.4 RED', () => sheetCells(S.replace('<button type="button" data-book-change-plan=""', '</div><div><button type="button" data-book-change-plan=""')).changePlan);
mut('M5 the draft sent by itself → 2.5 RED', () => sheetCells(S.replace('        setLeft(UNDO_SECONDS);', '        setLeft(UNDO_SECONDS);\n        void fetch(waLink(leadPhone, \'booked\'));')).noAuto);
mut('M6 R-46.17 joined: the explanation inside the draft’s box → 2.6 RED', () => sheetCells(S.replace('<CopyBox text={draft} label="Copy" copied="Copied" />', '<CopyBox text={BOOK.draftNote + \' \' + draft} label="Copy" copied="Copied" />')).draftBox);
mut('M7 Undo removes every event of the lead → 2.7 RED', () => sheetCells(S.replace('event_ids: created, ', '')).undo);
mut('M8 Cancel booking with both answers ticked → 3.3 RED', () => cancelCells(C, K.replace('const [rmEvents, setRmEvents] = useState(false);', 'const [rmEvents, setRmEvents] = useState(true);')).unticked);
mut('M9 a paid invoice offered for removal → 3.4 RED', () => cancelCells(C, K.replace('plan.invoice.paid\n            ? <p data-cancel-kept=""', 'false\n            ? <p data-cancel-kept=""')).paidKept);
mut('M10 Cancel booking with no ask first → 3.2 RED', () => cancelCells(C, K.replace('unbookBooking({ binder_id: binderId, dry_run: true })', 'Promise.resolve({ ok: true, plan: null })')).asksFirst);
mut('M11 the room closes the sheet on booking → 2.8 RED', () => stayCells(read(SHELL).replace("            if (id) setSel((cur) => (cur && cur.id === id ? { ...cur, badge: 'booked' } : cur));\n          }}", "            setBooking(null);\n            if (id) setSel((cur) => (cur && cur.id === id ? { ...cur, badge: 'booked' } : cur));\n          }}"), read(SHEET)).stays);
mut('M12 the reset keyed on the leadFacts object → 2.9 RED', () => stayCells(read(SHELL), S.replace('}, [open, initialKind, leadId, wd]);', '}, [open, initialKind, leadId, leadFacts]);')).keyed);
console.log(`\n${fail ? 'RED' : 'GREEN'} — d1 book (v2) ${pass}/${pass + fail}${fail ? '\n  ' + failed.join('\n  ') : ''}`);
process.exit(fail ? 1 : 0);
