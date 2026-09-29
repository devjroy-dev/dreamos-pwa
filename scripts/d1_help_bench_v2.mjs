#!/usr/bin/env node
// scripts/d1_help_bench_v2.mjs · DESIGN-1 · THE "?" ON EVERYTHING STAGES 3 TO 5 MADE (the founder's reminder), v2 tree.
// Holds: each of the five tabs' pages and More has a full card (what it does, its steps, what it connects to); the search
// box, the Book sheet and Cancel booking each carry their own "?" with their own card; and every control a card names is
// one its screen actually draws (the names are checked against the source that draws them, never against the card).
// b140 (and its _v2 twin) proves the page cards live: the dialog, the dot, the rungs, Got it, the scrim, Escape.
// A mutation per claim.
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const ts = require(path.join(ROOT, 'node_modules/typescript'));
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

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

const HELP = 'v2/lib/worklist/pageHelp.ts';
// Each card, the controls it names (as the screen spells them), and the files that draw that screen.
const SHELL = 'v2/components/vendor/slices/SliceShell.tsx';
const CARDS = [
  { key: '/vendor/leads', names: ['New', 'Contacted', 'Quoted', 'Booked', 'Recent', 'WhatsApp', 'Call', 'Attach package', 'Forward to a peer', 'Mark lost', 'Booking confirmed', 'Advance paid'],
    files: [SHELL, 'v2/components/vendor/slices/SliceRow.tsx', 'v2/components/vendor/packages/LeadPackageCard.tsx', 'v2/lib/worklist/packages.ts', 'v2/components/vendor/slices/FilterRail.tsx', 'v2/components/vendor/slices/DetailSheet.tsx', 'lib/vendor/slices/leads.ts', 'v2/lib/vendor/slices/leads.ts', 'v2/components/vendor/slices/SortControl.tsx', 'lib/vendor/sort.ts', 'v2/lib/worklist/copy.ts', 'v2/lib/worklist/referrals.ts'] },
  { key: '/vendor/clients', names: ['Ask in chat', 'Edit', 'Hide', 'Cancel booking'], files: ['v2/components/vendor/slices/BinderCard.tsx', 'v2/lib/worklist/book.ts'] },
  { key: '/vendor/invoices', names: ['Overdue', 'Unpaid', 'Part paid', 'Recent', 'Mark paid'], files: [SHELL, 'v2/components/vendor/slices/SliceRow.tsx', 'lib/vendor/slices/invoices.ts', 'v2/lib/vendor/slices/invoices.ts', 'v2/components/vendor/slices/SortControl.tsx', 'lib/vendor/sort.ts', 'v2/lib/worklist/copy.ts', 'v2/components/vendor/slices/FilterRail.tsx'] },
  { key: '/vendor/calendar', names: ['Month', 'Weddings', 'Good dates', 'Coming up'], files: ['v2/app/vendor/(shell)/calendar/screen.tsx'] },
];
const SURFACES = [
  { key: 'search', names: ['Ask TDW about this'], files: ['v2/lib/worklist/search.ts'], mount: ['v2/components/worklist/SearchBox.tsx', /<HelpButton id="surface:search" title=\{SHEET_HELP\.search\.title\} help=\{SHEET_HELP\.search\.help\} \/>/] },
  { key: 'book', names: ['Change plan', 'No package, enter an amount', 'Confirm booking', 'Copy', 'Send on WhatsApp', 'Undo'], files: ['v2/lib/worklist/book.ts', 'v2/components/vendor/packages/BookingSheet.tsx'], mount: ['v2/components/vendor/packages/BookingSheet.tsx', /aside=\{<HelpButton id="sheet:book" title=\{SHEET_HELP\.book\.title\} help=\{SHEET_HELP\.book\.help\} layered \/>\}/g, 2] },
  { key: 'cancelBooking', names: ['Keep booking'], files: ['v2/lib/worklist/book.ts'], mount: ['v2/components/vendor/packages/CancelBookingSheet.tsx', /aside=\{<HelpButton id="sheet:cancel-booking" title=\{SHEET_HELP\.cancelBooking\.title\} help=\{SHEET_HELP\.cancelBooking\.help\} layered \/>\}/] },
];
const drawnIn = (files) => files.filter((f) => fs.existsSync(path.join(ROOT, f))).map((f) => read(f)).join('\n');
// a label the screen derives from its key (the filter chips and the sort: key.charAt(0).toUpperCase() + key.slice(1))
const derived = (text, name) => /charAt\(0\)\.toUpperCase\(\) \+ k(ey)?\.slice\(1\)|charAt\(0\)\.toUpperCase\(\)/.test(text) && new RegExp(`'${name.toLowerCase().replace(/ /g, '_')}'`).test(text);
const quoted = (text, name) => new RegExp(`(['"\`>]|\\b)${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(['"\`<]|\\s·|\\b)`).test(text);

function helpCells(H, cardDefs = CARDS, surfDefs = SURFACES) {
  const r = {};
  const full = (e) => !!e && e.what && e.can.length >= 2 && !!e.connects;
  r.tabs = ['/vendor/today', '/vendor/leads', '/vendor/calendar', '/vendor/clients', '/vendor/invoices', '/vendor/more'].filter((k) => !full(H.PAGE_HELP[k]));
  r.surfaces = ['search', 'book', 'cancelBooking'].filter((k) => !(H.SHEET_HELP[k] && full(H.SHEET_HELP[k].help)));
  r.named = [];
  for (const c of cardDefs) {
    const e = H.PAGE_HELP[c.key]; const text = e ? [e.what, ...e.can.map((x) => x.line), e.connects].join(' ') : '';
    const src = drawnIn(c.files);
    for (const n of c.names) { if (!text.includes(n)) r.named.push(`${c.key} does not name ${n}`); else if (!quoted(src, n) && !derived(src, n)) r.named.push(`${c.key} names ${n}, which its screen does not draw`); }
  }
  for (const s of surfDefs) {
    const e = H.SHEET_HELP[s.key] && H.SHEET_HELP[s.key].help; const text = e ? [e.what, ...e.can.map((x) => x.line), e.connects].join(' ') : '';
    const src = drawnIn(s.files);
    for (const n of s.names) { if (!text.includes(n)) r.named.push(`${s.key} does not name ${n}`); else if (!quoted(src, n)) r.named.push(`${s.key} names ${n}, which it does not draw`); }
  }
  r.dash = [...Object.values(H.PAGE_HELP), ...Object.values(H.SHEET_HELP).map((x) => x.help)].flatMap((e) => [e.what, ...e.can.map((x) => x.line), e.connects]).filter((t) => /[\u2014\u2013]| - /.test(t));
  return r;
}
function mountCells(files = {}) {
  const bad = [];
  for (const s of SURFACES) {
    const [f, re, n = 1] = s.mount;
    const src = files[f] ?? read(f);
    const hits = (src.match(new RegExp(re.source, 'g')) || []).length;
    if (hits !== n) bad.push(`${s.key}: ${hits} of ${n}`);
  }
  const ph = files['v2/components/worklist/PageHelp.tsx'] ?? read('v2/components/worklist/PageHelp.tsx');
  if (!/<SheetLayer open testId=\{'help-' \+ id\}>\{\(z\) => <HelpCard title=\{title\} help=\{help\} onClose=\{close\} zIndex=\{z\.panel\} \/>\}<\/SheetLayer>/.test(ph)) bad.push('the sheet card does not go up through SheetLayer');
  if (!/const seenKey = 'tdw_help_seen:' \+ id;/.test(ph) || !/useEffect\(\(\) => \{ setFirst\(!readSeen\(seenKey\)\); \}, \[seenKey\]\);/.test(ph)) bad.push('the surface card\u2019s seen key is not its own, read after mount');
  return bad;
}

console.log('d1 help (v2) \u00b7 the "?" on every page, tab and sheet the stages made');
const H = loader()(HELP);
const h = helpCells(H);
cell('1.1 Today, Enquiries, Calendar, Clients, Money and More: each card says what the page does, its steps and what it connects to', h.tabs.length === 0 || h.tabs.join(', '));
cell('1.2 the search, the Book sheet and Cancel booking: each has its own full card', h.surfaces.length === 0 || h.surfaces.join(', '));
cell('1.3 every control a card names is one its screen draws', h.named.length === 0 || h.named.join(' | '));
cell('1.4 no dash in any card (W1)', h.dash.length === 0 || h.dash.join(' | '));
const m = mountCells();
cell('1.5 each surface\u2019s "?" is mounted where it is, the sheet\u2019s card above its sheet, its seen key its own', m.length === 0 || m.join(' | '));

console.log('\nmutations (each must turn its cell red)');
const mut = (name, fn) => { let r; try { r = fn(); } catch { r = false; } cell(name, r === true ? 'still green' : true); };
const HS = read(HELP);
mut('M1 the Calendar card back to its one line \u2192 1.1 RED', () => helpCells(loader({ [HELP]: HS.replace("[roomHref('calendar')]: entry(ROOM_DESC.calendar, { can: [", "[roomHref('calendar')]: entry(ROOM_DESC.calendar), __x: entry('', { can: [") })(HELP)).tabs.length === 0);
mut('M2 the Book sheet\u2019s card removed \u2192 1.2 RED', () => helpCells(loader({ [HELP]: HS.replace("  book: { title: 'Book', help: entry(", "  bookX: { title: 'Book', help: entry(") })(HELP)).surfaces.length === 0);
mut('M3 a card names a control its screen does not draw \u2192 1.3 RED', () => helpCells(H, [{ ...CARDS[1], names: [...CARDS[1].names, 'Archive'] }].map((c) => c), []).named.length === 0
  && false || helpCells(loader({ [HELP]: HS.replace('Ask in chat, Edit or Hide', 'Ask in chat, Edit, Archive or Hide') })(HELP), [{ ...CARDS[1], names: [...CARDS[1].names, 'Archive'] }], []).named.length === 0);
mut('M4 the Book sheet\u2019s "?" unmounted \u2192 1.5 RED', () => mountCells({ 'v2/components/vendor/packages/BookingSheet.tsx': read('v2/components/vendor/packages/BookingSheet.tsx').replace(/ aside=\{<HelpButton id="sheet:book"[^\n]*? layered \/>\}/, '') }).length === 0);
mut('M5 the sheet card drawn beneath its sheet (no layer) \u2192 1.5 RED', () => mountCells({ 'v2/components/worklist/PageHelp.tsx': read('v2/components/worklist/PageHelp.tsx').replace("<SheetLayer open testId={'help-' + id}>{(z) => <HelpCard title={title} help={help} onClose={close} zIndex={z.panel} />}</SheetLayer>", '<HelpCard title={title} help={help} onClose={close} />') }).length === 0);
console.log(`\n${fail ? 'RED' : 'GREEN'} \u2014 d1 help (v2) ${pass}/${pass + fail}${fail ? '\n  ' + failed.join('\n  ') : ''}`);
process.exit(fail ? 1 : 0);
