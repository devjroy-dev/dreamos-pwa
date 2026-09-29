#!/usr/bin/env node
// scripts/d1_records_bench_v2.mjs · DESIGN-1 · STAGE 5a · RECORDS AS PAGES: the enquiry and the client (v2 tree).
//   §1 the client's enquiry, by the founder's rule: the normalised number (phoneKey), linked only when exactly ONE
//      enquiry has it; none, two sharing it, or no phone links nothing;
//   §2 the next action, one button, from the record's own state;
//   §3 one history, newest first, notes last;
//   §4 the page, top to bottom: back, status, the next action, Dates, Money, Notes, History, then the small jobs;
//   §5 quick jobs are small sheets, one at a time: a page holds one open, and Book steps aside for the package sheet;
//   §6 back returns to the same list at the same scroll: the list saves its place as it opens a record, the shell puts
//      it back, Back goes back through history when the list opened the page;
//   §7 the lists, Today's cards and the search open the pages;
//   §8 the two pages' "?" cards (b140_v2 proves them live).
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

const REC = 'v2/lib/worklist/record.ts';
const ENQ = 'v2/components/vendor/records/EnquiryPage.tsx', CLI = 'v2/components/vendor/records/ClientPage.tsx';
const BOOKSHEET = 'v2/components/vendor/packages/BookingSheet.tsx', SHELL = 'v2/components/worklist/WorklistShell.tsx';
const SLICE = 'v2/components/vendor/slices/SliceShell.tsx', CARD = 'v2/components/vendor/slices/BinderCard.tsx', PARTS = 'v2/components/worklist/RecordPage.tsx';

function libCells(R) {
  const L = (id, phone) => ({ id, phone });
  const leads = [L('a', '+91 98111 00001'), L('b', '98111-00002'), L('c', '+919811100002'), L('d', null), L('e', '')];
  const id = (x) => (x ? x.id : null);
  return {
    one: id(R.linkedLeadFor('9811100001', leads)) === 'a' && id(R.linkedLeadFor('+91 98111 00001', leads)) === 'a',
    none: R.linkedLeadFor('9811199999', leads) === null,
    two: R.linkedLeadFor('+91 98111 00002', leads) === null,
    noPhone: R.linkedLeadFor(null, leads) === null && R.linkedLeadFor('', leads) === null && R.linkedLeadFor('0000000000', [L('z', '0000000000')]) === null
      && R.linkedLeadFor('9811100005', [L('x', null), L('y', '9811100005')]) !== null && id(R.linkedLeadFor('9811100005', [L('x', null), L('y', '9811100005')])) === 'y',
    next: [R.enquiryNext('new', true), R.enquiryNext('new', false), R.enquiryNext('contacted', true), R.enquiryNext('quoted', true), R.enquiryNext('booked', true), R.enquiryNext('lost', true)]
      .map((x) => (x ? x.kind : null)).join(',') === 'reply,book,book,book,client,'
      && [R.clientNext(5000, true), R.clientNext(0, true), R.clientNext(0, false)].map((x) => (x ? x.kind : null)).join(',') === 'invoice,message,',
    history: (() => {
      const h = R.historyOf({ created_at: '2026-09-01T10:00:00Z', conversation: [{ direction: 'inbound', body: 'Hi', created_at: '2026-09-02T10:00:00Z' }, { direction: 'outbound', body: 'Hello', created_at: '2026-09-03T10:00:00Z' }],
        events: [{ title: 'Haldi', event_date: '2026-12-20' }], invoices: [{ invoice_number: 'TDW/1', amount_total: 50000, created_at: '2026-09-04T10:00:00Z' }], notes: ['a note'] });
      return h.map((x) => x.kind).join(',') === 'event,invoice,out,in,received,note';
    })(),
  };
}
// the order of the page's parts in its source: back, status, next, dates, money, notes, history, jobs
function orderOf(src) {
  const s = strip(src);
  const at = ['<BackLink ', '<Status ', '<NextButton ', 'id="dates"', 'id="money"', 'id="notes"', 'id="history"', '<Jobs>'].map((k) => s.indexOf(k, s.indexOf('return (\n    <WorklistShell title={name}>')));
  return at.every((x) => x > 0) && at.every((x, i) => i === 0 || x > at[i - 1]);
}
function sheetCells(enq, cli, book) {
  const e = strip(enq), c = strip(cli), b = strip(book);
  return {
    onePage: /const \[sheet, setSheet\] = useState<'book' \| 'attach' \| null>\(null\);/.test(e) && /open=\{sheet === 'book'\}/.test(e) && /open=\{sheet === 'attach'\}/.test(e)
      && /const \[sheet, setSheet\] = useState<'edit' \| 'cancel' \| null>\(null\);/.test(c) && /\{sheet === 'edit' && \(/.test(c) && /\{sheet === 'cancel' && \(/.test(c),
    bookAside: /<Sheet open=\{open && !attach\} testId="booking-sheet" title=\{BOOK\.title\}/.test(b),
  };
}
function backCells(slice, card, shell, parts) {
  const s = strip(slice), k = strip(card), h = strip(shell), p = strip(parts);
  return {
    saved: /slice === 'leads' \? \(saveListScroll\(roomHref\('leads'\)\), router\.push\(enquiryHref\(row\.id\)\)\)/.test(s)
      && /onClick=\{\(\) => \{ saveListScroll\(roomHref\('clients'\)\); router\.push\(clientHref\(binder\.id\)\); \}\}/.test(k),
    restored: /useEffect\(\(\) => \{ restoreListScroll\(pathname\); \}, \[pathname\]\);/.test(h) && /const y = takeListScroll\(list\);/.test(p),
    back: /if \(fromList && window\.history\.length > 1\) \{ e\.preventDefault\(\); router\.back\(\); \}/.test(p),
  };
}
function openCells(slice, search) {
  const s = strip(slice), q = strip(search);
  return {
    deep: /if \(slice === 'leads'\) \{ focusedRef\.current = want; router\.replace\(enquiryHref\(want\)\); return; \}/.test(s),
    search: /case 'enquiries': return `\$\{roomHref\('leads'\)\}\/\$\{enc\}`;/.test(q),
    routes: ['v2/app/vendor/(shell)/leads/[id]/page.tsx', 'v2/app/vendor/(shell)/clients/[id]/page.tsx', 'app/v2/vendor/(shell)/leads/[id]/page.tsx', 'app/v2/vendor/(shell)/clients/[id]/page.tsx'].every((f) => fs.existsSync(path.join(ROOT, f)))
      && /useParams<\{ id: string \}>\(\)/.test(read('v2/app/vendor/(shell)/leads/[id]/page.tsx')),
    classicUntouched: !fs.existsSync(path.join(ROOT, 'app/vendor/(shell)/leads/[id]')) && !fs.existsSync(path.join(ROOT, 'app/vendor/(shell)/clients/[id]')),
  };
}

console.log('d1 records (v2) · the enquiry and the client as pages');
const R = loader()(REC);
const l = libCells(R);
console.log('\n§1 the client’s enquiry: one number, one enquiry, or none');
cell('1.1 one match: the one enquiry with the number is linked, however the number is written', l.one || 'not linked');
cell('1.2 no match: nothing is linked', l.none || 'linked');
cell('1.3 two enquiries sharing the number: nothing is linked (never a guess)', l.two || 'guessed');
cell('1.4 no phone (the client’s, an enquiry’s, or a placeholder number): never a match', l.noPhone || 'matched');
console.log('\n§2 §3 the next action and the history');
cell('2.1 the next action, one button: Reply on WhatsApp (new), Book (in talks), Open the client (booked), none (lost); Open the invoice while money is due, else Message on WhatsApp', l.next || 'wrong');
cell('3.1 one history, newest first, the notes last', l.history || 'wrong order');
console.log('\n§4 §5 the page and its sheets');
cell('4.1 the enquiry’s page, top to bottom: back, status, next action, Dates, Money, Notes, History, the small jobs', orderOf(read(ENQ)) || 'out of order');
cell('4.2 the client’s page, the same order', orderOf(read(CLI)) || 'out of order');
const sh = sheetCells(read(ENQ), read(CLI), read(BOOKSHEET));
cell('5.1 each page holds one small sheet at a time', sh.onePage || 'two at once');
cell('5.2 never a sheet on a sheet: Book steps aside while the package sheet is open', sh.bookAside || 'stacked');
console.log('\n§6 §7 back, and the ways in');
const bc = backCells(read(SLICE), read(CARD), read(SHELL), read(PARTS));
cell('6.1 the list saves its place as it opens a record', bc.saved || 'not saved');
cell('6.2 the shell puts the list back where it stood', bc.restored || 'not restored');
cell('6.3 Back goes back through history when the list opened the page', bc.back || 'pushes');
const oc = openCells(read(SLICE), read('v2/lib/worklist/search.ts'));
cell('7.1 ?lead= (Today’s cards) opens the enquiry’s page; the search does too', (oc.deep && oc.search) || 'not the page');
cell('7.2 the two routes exist in the v2 tree only (the classic layout is untouched)', (oc.routes && oc.classicUntouched) || 'missing or classic');
console.log('\n§8 the "?" cards');
const H = loader()('v2/lib/worklist/pageHelp.ts');
const full = (e) => !!e && e.what && e.can.length >= 2 && !!e.connects;
cell('8.1 both pages have a full card, found from a real address', (full(H.helpFor('/vendor/leads/lead-0001')) && full(H.helpFor('/vendor/clients/bind-0001'))) || 'no card');
const words = strip(read(REC));
const named = ['Reply on WhatsApp', 'Book', 'Open the client', 'Open the invoice', 'Message on WhatsApp', 'WhatsApp', 'Call', 'Attach package', 'Mark lost', 'Ask in chat', 'Edit', 'Hide'].filter((n) => !words.includes(`'${n}'`));
cell('8.2 every control the two cards name is a word the pages draw (record.ts)', named.length === 0 || named.join(', '));

console.log('\nmutations (each must turn its cell red)');
const mut = (name, fn) => { let r; try { r = fn(); } catch { r = false; } cell(name, r === true ? 'still green' : true); };
const RS = read(REC);
mut('M1 the first of two enquiries taken → 1.3 RED', () => libCells(loader({ [REC]: RS.replace('return hits.length === 1 ? hits[0] : null;', 'return hits.length ? hits[0] : null;') })(REC)).two);
mut('M2 the raw number compared, not the fold → 1.1 RED', () => libCells(loader({ [REC]: RS.replace('const hits = leads.filter((l) => phoneKey(l.phone) === k);', 'const hits = leads.filter((l) => l.phone === clientPhone);') })(REC)).one);
mut('M3 a booked enquiry offered Book again → 2.1 RED', () => libCells(loader({ [REC]: RS.replace("if (s === 'booked') return { kind: 'client', label: RECORD.openClient };", '') })(REC)).next);
mut('M4 History drawn above Notes → 4.1 RED', () => orderOf(read(ENQ).replace('<Section head={RECORD.notesHead} id="notes">', '<Section head={RECORD.notesHead} id="notesX">').replace('<Section head={RECORD.historyHead} id="history">', '<Section head={RECORD.historyHead} id="history"></Section><Section head={RECORD.notesHead} id="notes">')));
mut('M5 Book left open under the package sheet → 5.2 RED', () => sheetCells(read(ENQ), read(CLI), read(BOOKSHEET).replace('<Sheet open={open && !attach} testId="booking-sheet" title={BOOK.title}', '<Sheet open={open} testId="booking-sheet" title={BOOK.title}')).bookAside);
mut('M6 the list forgets its place → 6.1 RED', () => backCells(read(SLICE).replace("(saveListScroll(roomHref('leads')), router.push(enquiryHref(row.id)))", '(router.push(enquiryHref(row.id)))'), read(CARD), read(SHELL), read(PARTS)).saved);
mut('M7 the shell does not put the list back → 6.2 RED', () => backCells(read(SLICE), read(CARD), read(SHELL).replace('useEffect(() => { restoreListScroll(pathname); }, [pathname]);', ''), read(PARTS)).restored);
console.log(`\n${fail ? 'RED' : 'GREEN'} — d1 records (v2) ${pass}/${pass + fail}${fail ? '\n  ' + failed.join('\n  ') : ''}`);
process.exit(fail ? 1 : 0);
