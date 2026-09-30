#!/usr/bin/env node
// scripts/d1_records5b_bench_v2.mjs · DESIGN-1 · STAGE 5b · RECORDS AS PAGES: the invoice and the event (v2 tree).
//   §1 the next action, one button, from the record's own state; the invoice's history, newest first;
//   §2 the page, top to bottom: back, status, the next action, Dates, Money, (the event's) Notes, History, the small jobs;
//   §3 one home for every act: the page is the room's own screen in record mode, so Mark paid, Done, Edit, the schedule
//      and its sheets, Send on WhatsApp and the PDF are the list's own handlers, and the record sheet never opens;
//   §4 Cancel on a page keeps the page and its Undo;
//   §5 back returns to the same list at the same scroll; the lists, Today's cards and the search open the pages;
//   §6 a found client opens her page (the search), by the founder's rule, with nothing new on any wire;
//   §7 two 5a fixes: the client's Open the invoice opens THE invoice; Hide keeps its Undo in reach;
//   §8 the "?" cards: the two pages, and the Events and Invoices lists.
// A mutation per claim.
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

const REC = 'v2/lib/worklist/record.ts', PAGE = 'v2/components/vendor/records/SliceRecord.tsx';
const SLICE = 'v2/components/vendor/slices/SliceShell.tsx', SHELL = 'v2/components/worklist/WorklistShell.tsx';
const CLI = 'v2/components/vendor/records/ClientPage.tsx', CLIST = 'v2/app/vendor/(shell)/clients/body.tsx';

function libCells(R) {
  const kinds = (xs) => xs.map((x) => (x ? x.kind : null)).join(',');
  const T = '2026-09-29';
  const h = R.invoiceHistory({ created_at: '2026-09-01T10:00:00Z', schedule: [
    { milestone_label: 'Booking', state: 'paid', paid_at: '2026-09-05T10:00:00Z', paid_amount: 30000, amount_due: 30000, sent_at: '2026-09-03T10:00:00Z' },
    { milestone_label: 'Shoot day', state: 'pending', paid_at: null, paid_amount: null, amount_due: 70000, sent_at: null, reminded_at: '2026-09-04T10:00:00Z' },
  ] });
  const B = (id, phone) => ({ id, phone });
  const binders = [B('b1', '+91 98111 00001'), B('b2', '9811100002'), B('b3', '+919811100002')];
  const typed = [{ id: 'c1', phone: '98111-00001' }, { id: 'c2', phone: '98111 00002' }, { id: 'c3', phone: null }, { id: 'c4', phone: '9811199999' }];
  const I = (id, phone, owed, state = 'unpaid') => ({ id, client_phone: phone, amount_owed: owed, state });
  const id = (x) => (x ? x.id : null);
  return {
    invNext: kinds([R.invoiceNext('unpaid', true), R.invoiceNext('paid', true), R.invoiceNext('unpaid', false), R.invoiceNext('cancelled', true)]) === 'send,send,pdf,',
    evNext: kinds([R.eventNext('upcoming', T, T, false), R.eventNext('upcoming', '2026-09-01', T, true), R.eventNext('upcoming', '2026-12-01', T, true),
      R.eventNext('upcoming', '2026-12-01', T, false), R.eventNext('done', '2026-09-01', T, true), R.eventNext('cancelled', '2026-12-01', T, true)]) === 'done,done,client,,,',
    history: h.map((x) => x.text).join('|') === 'Booking paid, Rs 30,000|Reminder sent for Booking|Invoice made',
    found: id(R.foundClientPage('c1', typed, binders)) === 'b1',
    foundTwo: R.foundClientPage('c2', typed, binders) === null,
    foundNone: R.foundClientPage('c3', typed, binders) === null && R.foundClientPage('c4', typed, binders) === null && R.foundClientPage('cX', typed, binders) === null && R.foundClientPage(null, typed, binders) === null,
    owed: id(R.owedInvoiceFor('9811100001', [I('i1', '+919811100001', 5000), I('i2', '9811100001', 0, 'paid'), I('i3', '9811100001', 900, 'cancelled'), I('i4', '9811100009', 100)])) === 'i1'
      && R.owedInvoiceFor('9811100001', [I('i1', '9811100001', 5000), I('i5', '+91 98111 00001', 100)]) === null
      && R.owedInvoiceFor(null, [I('i1', null, 5000)]) === null,
  };
}
// the order of a page's parts, within one branch of SliceRecord's source
function orderOf(src, from, to, keys) {
  const s = strip(src); const a = s.indexOf(from), b = to ? s.indexOf(to, a + 1) : s.length;
  if (a < 0 || b < 0) return false;
  const part = s.slice(a, b);
  const at = keys.map((k) => part.indexOf(k));
  return at.every((x) => x >= 0) && at.every((x, i) => i === 0 || x > at[i - 1]);
}
const INV_KEYS = ['<BackLink ', '<Status ', '<NextButton ', 'id="dates"', 'id="money"', 'id="history"', '<Jobs>'];
const EV_KEYS = ['<BackLink ', '<Status ', '<NextButton ', 'id="dates"', 'id="money"', 'id="notes"', 'id="history"', '<Jobs>'];
const invOrder = (src) => orderOf(src, 'if (inv) {', 'const e = ev as VendorEvent;', INV_KEYS);
const evOrder = (src) => orderOf(src, 'const e = ev as VendorEvent;', null, EV_KEYS);

function homeCells(slice) {
  const s = strip(slice);
  const rec = s.slice(s.indexOf('if (recordId && (slice === \'invoices\' || slice === \'events\')) {'), s.indexOf('return (\n    <SliceShell'));
  return {
    oneMount: rec.length > 0 && /<SliceRecord /.test(rec) && /\{body\}/.test(rec) && /\{body\}\n    <\/SliceShell>/.test(s),
    handlers: /schedulePanel=\{schedulePanel\}/.test(rec) && /const side = recRow \? swipeSidesFor\(recRow\)\.right : undefined;/.test(rec)
      && /onMarkPaid=\{canPay && side \? \(\) => side\.onTrigger\(\) : undefined\}/.test(rec) && /onDone=\{canDone && side \? \(\) => side\.onTrigger\(\) : undefined\}/.test(rec)
      && /onEdit=\{\(\) => \{ if \(recRow\) onEditHere\(recRow\); \}\}/.test(rec) && /onPdf=\{\(\) => \{ void downloadInvoicePdf\(\); \}\}/.test(rec)
      && /onSend=\{\(\) => \{ if \(recRow\) void sendInvoiceOnWa\(recRow\); \}\}/.test(rec) && /onClick=\{\(\) => \{ void sendInvoiceOnWa\(sel\); \}\}/.test(s),
    panelShared: /const schedulePanel = slice === 'invoices' && sel \? \(/.test(s) && /\{schedulePanel\}/.test(s.slice(s.indexOf('const detailExtra = ('))),
    noSheet: /sel=\{recordId \? null : sel\}/.test(s),
    cancelStays: /function cancelHere\(row: Row\) \{/.test(s) && /apply: {2}\(\) => setBadge\(row\.id, 'cancelled'\),/.test(s) && /onCancel=\{\(\) => \{ if \(recRow\) cancelHere\(recRow\); \}\}/.test(rec)
      && !/router\.(push|replace)/.test(s.slice(s.indexOf('function cancelHere'), s.indexOf('function cancelHere') + 900)),
  };
}
function wayCells(slice, shell, search) {
  const s = strip(slice), h = strip(shell), q = strip(search);
  return {
    saved: /: slice === 'invoices' \? \(saveListScroll\(roomHref\('invoices'\)\), router\.push\(invoiceHref\(row\.id\)\)\)/.test(s)
      && /: slice === 'events' \? \(saveListScroll\(roomHref\('events'\)\), router\.push\(eventHref\(row\.id\)\)\)/.test(s),
    record: /const isRecord = \/\^\\\/vendor\\\/\(leads\|clients\|invoices\|events\)\\\/\[\^\/\]\+\\\/\?\$\/\.test\(pathname\);/.test(h),
    deep: /if \(slice === 'invoices' \|\| slice === 'events'\) \{ focusedRef\.current = want; router\.replace\(slice === 'invoices' \? invoiceHref\(want\) : eventHref\(want\)\); return; \}/.test(s),
    search: /case 'events': {4}return `\$\{roomHref\('events'\)\}\?event=\$\{enc\}`;/.test(q) && /case 'invoices': {2}return `\$\{roomHref\('invoices'\)\}\?invoice=\$\{enc\}`;/.test(q),
    routes: ['v2/app/vendor/(shell)/invoices/[id]/page.tsx', 'v2/app/vendor/(shell)/events/[id]/page.tsx', 'app/v2/vendor/(shell)/invoices/[id]/page.tsx', 'app/v2/vendor/(shell)/events/[id]/page.tsx'].every((f) => fs.existsSync(path.join(ROOT, f)))
      && !fs.existsSync(path.join(ROOT, 'app/vendor/(shell)/invoices/[id]')) && !fs.existsSync(path.join(ROOT, 'app/vendor/(shell)/events/[id]')),
  };
}
function foundCells(clist, search) {
  const c = strip(clist), q = strip(search);
  return {
    // the typed roster read only while a ?client= waits, and the page from this list's own clients
    reads: /if \(!wantClient \|\| resolvedRef\.current \|\| !cab\.data\) return;/.test(c) && /void findTypedClient\(vendorId, wantClient\)/.test(c)
      && /const binder = foundClientPage\(wantClient, typed \? \[typed\] : \[\], binders\);/.test(c) && /if \(binder\) router\.replace\(clientHref\(binder\.id\)\);/.test(c),
    // the search's link is unchanged: the typed id it already carried, no phone and no binder id in any address
    wire: /case 'clients': {3}return `\$\{roomHref\('clients'\)\}\?client=\$\{enc\}`;/.test(q) && !/phone/.test(q.slice(q.indexOf('export function recordHref'), q.indexOf('export function withRecent'))),
  };
}
function fixCells(cli) {
  const c = strip(cli);
  const hide = c.slice(c.indexOf('async function hide()'), c.indexOf('async function hide()') + 900);
  return {
    invoice: /const owedInvoice = useMemo\(\(\) => \(binder \? owedInvoiceFor\(binder\.phone, invoices\.data \?\? \[\]\) : null\), \[binder, invoices\.data\]\);/.test(c)
      && /href=\{owedInvoice \? invoiceHref\(owedInvoice\.id\) : roomHref\('invoices'\)\}/.test(c) && !/\?invoice=\$\{encodeURIComponent\(binder\.id\)\}/.test(c),
    hideStays: /setHiddenNow\(true\);/.test(hide) && !/router\.push/.test(hide) && !/cab\.refresh\(\)/.test(hide)
      && /useEffect\(\(\) => \{ if \(!hiddenNow\) return; return \(\) => \{ refreshCab\(\); \}; \}, \[hiddenNow, refreshCab\]\);/.test(c),
  };
}

console.log('d1 records 5b (v2) · the invoice and the event as pages');
const R = loader()(REC);
const l = libCells(R);
console.log('\n§1 the next action and the history');
cell('1.1 the invoice: Send on WhatsApp with a number, Download PDF without, none when cancelled', l.invNext || 'wrong');
cell('1.2 the event: Mark done on or after its day, Open the client before it (when it names one), none when done or cancelled', l.evNext || 'wrong');
cell('1.3 the invoice’s history, newest first: each part paid, each reminder that went (sent, not merely asked), the day it was made', l.history || 'wrong');
console.log('\n§2 the page, top to bottom');
cell('2.1 the invoice: back, status, next action, Dates, Money (with its schedule), History, the small jobs', invOrder(read(PAGE)) || 'out of order');
cell('2.2 the event: back, status, next action, Dates, Money, Notes, History, the small jobs', evOrder(read(PAGE)) || 'out of order');
console.log('\n§3 §4 one home for every act; Cancel keeps the page');
const hc = homeCells(read(SLICE));
cell('3.1 the page is the room’s own screen: one mount for the list’s sheets serves both faces', hc.oneMount || 'two mounts');
cell('3.2 Mark paid, Done, Edit, the PDF and Send on WhatsApp are the list’s own handlers', hc.handlers || 'a second home');
cell('3.3 the payment schedule is one panel, read by the invoice sheet and the invoice’s page', hc.panelShared || 'two panels');
cell('3.4 never a sheet on a sheet: a page never opens the record sheet under its own sheets', hc.noSheet || 'sheet opens');
cell('4.1 Cancel on a page keeps the page (reading Cancelled) and its 30-second Undo', hc.cancelStays || 'leaves');
console.log('\n§5 back, and the ways in');
const wc = wayCells(read(SLICE), read(SHELL), read('v2/lib/worklist/search.ts'));
cell('5.1 the Invoices and Events lists save their place as they open a record', wc.saved || 'not saved');
cell('5.2 the shell reads the two new pages as records (no held row over them)', wc.record || 'not a record');
cell('5.3 ?invoice= and ?event= (Today’s cards, the search) open the pages', (wc.deep && wc.search) || 'not the page');
cell('5.4 the two routes exist in the v2 tree only (the classic layout is untouched)', wc.routes || 'missing or classic');
console.log('\n§6 a found client opens her page');
cell('6.1 one client in the list with her number: that page', l.found || 'not found');
cell('6.2 two clients sharing the number: no page (never a guess)', l.foundTwo || 'guessed');
cell('6.3 no number, an unknown number, or an id the typed read lacks: no page', l.foundNone || 'guessed');
const fc = foundCells(read(CLIST), read('v2/lib/worklist/search.ts'));
cell('6.4 resolved on the Clients list: her number from the typed roster door (only while ?client= waits), against the list\u2019s own clients', fc.reads || 'not resolved there');
cell('6.5 nothing new on any wire: the search’s address is unchanged (no number, no binder id)', fc.wire || 'changed');
console.log('\n§7 two 5a fixes');
cell('7.1 the client’s one owed invoice: one with her number → it; two, none, paid or cancelled → not one', l.owed || 'wrong');
const xc = fixCells(read(CLI));
cell('7.2 Open the invoice opens that invoice’s page (it had carried the client’s id as an invoice’s)', xc.invoice || 'wrong id');
cell('7.3 Hide keeps the page, reading Hidden, so its Undo stays in reach; the list refreshes as she leaves', xc.hideStays || 'leaves');
console.log('\n§8 the "?" cards');
const H = loader()('v2/lib/worklist/pageHelp.ts');
const full = (e) => !!e && !!e.what && e.can.length >= 2 && !!e.connects;
cell('8.1 both pages have a full card, found from a real address', (full(H.helpFor('/vendor/invoices/inv-0001')) && full(H.helpFor('/vendor/events/ev-0001'))) || 'no card');
cell('8.2 the Events list now has a full card; the Invoices list’s says a tap opens the page', (full(H.helpFor('/vendor/events')) && /Tap an invoice to open its page/.test(JSON.stringify(H.helpFor('/vendor/invoices')))) || 'not full');
const words = strip(read(REC)) + strip(read('v2/lib/worklist/copy.ts')) + strip(read(SLICE));
const named = ['Send on WhatsApp', 'Download PDF', 'Add', 'Remind', 'Edit', 'Paid', 'Remove schedule', 'Mark paid', 'Enquiry', 'Client', 'Ask in chat', 'Cancel invoice', 'Mark done', 'Open the client', 'Cancel event']
  .filter((n) => !words.includes(`'${n}'`) && !words.includes(`>${n}<`));
cell('8.3 every control the two cards name is a word the page draws', named.length === 0 || named.join(', '));

console.log('\nmutations (each must turn its cell red)');
const mut = (name, fn) => { let r; try { r = fn(); } catch { r = false; } cell(name, r === true ? 'still green' : true); };
const RS = read(REC), PS = read(PAGE), SS = read(SLICE), CS = read(CLI), LS = read(CLIST);
mut('M1 a cancelled invoice still offered Send → 1.1 RED', () => libCells(loader({ [REC]: RS.replace("if (String(state || '').toLowerCase() === 'cancelled') return null;", '') })(REC)).invNext);
mut('M2 an event marked done before its day → 1.2 RED', () => libCells(loader({ [REC]: RS.replace("if (date && String(date).slice(0, 10) <= today)", 'if (date)') })(REC)).evNext);
mut('M3 a reminder counted from its row, not its send → 1.3 RED', () => libCells(loader({ [REC]: RS.replace('if (m.sent_at) out.push({ at: m.sent_at,', 'if (m.sent_at || (m as { reminded_at?: string | null }).reminded_at) out.push({ at: (m.sent_at || (m as { reminded_at?: string | null }).reminded_at) as string,') })(REC)).history);
mut('M4 the event’s History drawn above its Notes → 2.2 RED', () => evOrder(PS.replace('id="notes"', 'id="notesX"').replace('<Section head={RECORD.historyHead} id="history"><History items={items} /></Section>\n\n      <Jobs>', '<Section head={RECORD.historyHead} id="history"><History items={items} /></Section>\n<Section head="x" id="notes"></Section>\n      <Jobs>')));
mut('M5 the page pays through a second, hand-written payment → 3.2 RED', () => homeCells(SS.replace('onMarkPaid={canPay && side ? () => side.onTrigger() : undefined}', 'onMarkPaid={canPay ? () => { void recordPayment(recordId, { amount: 0 }); } : undefined}')).handlers);
mut('M6 the record sheet opened under the page → 3.4 RED', () => homeCells(SS.replace('sel={recordId ? null : sel}', 'sel={sel}')).noSheet);
mut('M7 Cancel hides the record and leaves → 4.1 RED', () => homeCells(SS.replace("apply:  () => setBadge(row.id, 'cancelled'),", 'apply:  () => { hideRow(row.id); router.push(roomHref(slice)); },')).cancelStays);
mut('M8 the Invoices list forgets its place → 5.1 RED', () => wayCells(SS.replace("(saveListScroll(roomHref('invoices')), router.push(invoiceHref(row.id)))", '(router.push(invoiceHref(row.id)))'), read(SHELL), read('v2/lib/worklist/search.ts')).saved);
mut('M9 the first of two clients sharing a number taken → 6.2 RED', () => libCells(loader({ [REC]: RS.replace('return hits.length === 1 ? hits[0] : null;\n}\n\n/** A day', 'return hits.length ? hits[0] : null;\n}\n\n/** A day').replace('const hits = leads.filter((l) => phoneKey(l.phone) === k);\n  return hits.length === 1 ? hits[0] : null;', 'const hits = leads.filter((l) => phoneKey(l.phone) === k);\n  return hits.length ? hits[0] : null;') })(REC)).foundTwo);
mut('M10 the typed roster read on every visit to the list → 6.4 RED', () => foundCells(LS.replace('if (!wantClient || resolvedRef.current || !cab.data) return;', 'if (resolvedRef.current || !cab.data) return;'), read('v2/lib/worklist/search.ts')).reads);
mut('M11 the number put in the search’s address → 6.5 RED', () => foundCells(LS, read('v2/lib/worklist/search.ts').replace("case 'clients':   return `${roomHref('clients')}?client=${enc}`;", "case 'clients':   return `${roomHref('clients')}?client=${enc}&phone=${enc}`;")).wire);
mut('M12 a paid invoice counted as owed → 7.1 RED', () => libCells(loader({ [REC]: RS.replace('&& Number(i.amount_owed) > 0 && i.state', '&& i.state') })(REC)).owed);
mut('M13 Open the invoice back on the client’s id → 7.2 RED', () => fixCells(CS.replace("href={owedInvoice ? invoiceHref(owedInvoice.id) : roomHref('invoices')}", 'href={`${roomHref(\'invoices\')}?invoice=${encodeURIComponent(binder.id)}`}')).invoice);
mut('M14 Hide leaves the page at once → 7.3 RED', () => fixCells(CS.replace('    setHiddenNow(true);\n', '    cab.refresh();\n    router.push(list);\n')).hideStays);
console.log(`\n${fail ? 'RED' : 'GREEN'} — d1 records 5b (v2) ${pass}/${pass + fail}${fail ? '\n  ' + failed.join('\n  ') : ''}`);
process.exit(fail ? 1 : 0);
