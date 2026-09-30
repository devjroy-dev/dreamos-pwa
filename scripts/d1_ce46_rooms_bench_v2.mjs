#!/usr/bin/env node
// scripts/d1_ce46_rooms_bench_v2.mjs · CE-46 · FE-5 · the chair's read of the rooms (30 Sept 2026), the static half.
// Holds, in the new layout (v2/), by census and by driving the one home:
//   §B no floating + anywhere (FE-6's Contracts excepted, its own rework); every room's add is a top button in the ruled
//      words, and each "?" card line names that button, never "+";
//   §C no short month and no age anywhere a date is drawn; whenWords is the time today, the full-month date otherwise
//      (the year added for another year); Today's chosen date is also written out in Indian order;
//   §P Portfolio reads "See your profile as visitors see it", never "as couples do".
// The rendered half (each top button's action on glass, the dates at 374, the parked Book sheet's keyboard reach) is
// d1_ce46_rooms_render_v2.js. A mutation per claim.
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const ts = require(path.join(ROOT, 'node_modules/typescript'));
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const noCmt = (t) => t.replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ').replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
const load = (src) => { const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText; const m = { exports: {} }; new Function('exports', 'require', 'module', out)(m.exports, require, m); return m.exports; };
let pass = 0, fail = 0;
const cell = (name, r) => { if (r === true) { pass++; console.log('  ok   ' + name); } else { fail++; console.log('  FAIL ' + name + '  → ' + r); } };
const EXEMPT = ['v2/components/worklist/Fab.tsx', 'v2/app/vendor/(shell)/contracts/screen.tsx'];   // the component itself; FE-6's room
const v2files = () => { const out = []; (function walk(d) { for (const e of fs.readdirSync(path.join(ROOT, d), { withFileTypes: true })) { const r = d + '/' + e.name; if (e.isDirectory()) walk(r); else if (/\.(tsx?)$/.test(e.name)) out.push(r); } })('v2'); return out; };

const TOPS = [
  ['v2/components/vendor/slices/SliceShell.tsx', /leads: 'New enquiry', clients: 'New client', invoices: 'New invoice', events: 'New event', expenses: 'New expense',/, /data-add-top=\{slice\} onClick=\{onAdd\}>\{addOnTop\}</],
  ['v2/app/vendor/(shell)/calendar/screen.tsx', /data-add-top="calendar" onClick=\{onAdd\}>New event</],
  ['v2/components/worklist/AddFab.tsx', /data-add-top="more" onClick=\{\(\) => setMenuOpen\(true\)\}>\{COPY\.addTitle\}</],
  ['v2/components/vendor/NotesBody.tsx', /data-add-top="notes" onClick=\{\(\) => setAddOpen\(true\)\}>New note</],
  ['v2/app/vendor/(shell)/tds/screen.tsx', /data-add-top="tds" onClick=\{\(\) => setAddOpen\(true\)\}>New TDS entry</],
  ['v2/components/worklist/TeamTabs.tsx', /data-add-top="team" onClick=\{onFab\}>\{ADD_TO\[tab\]\}</, /const ADD_TO: Record<TabId, string> = \{ team: 'Add to Team', tasks: 'Add to Tasks', payments: 'Add to Payments' \};/],
  ['v2/app/vendor/(shell)/wedding-pages/page.tsx', /data-add-top="wedding-pages" onClick=\{\(\) => setSheet\('create'\)\}>New wedding page</],
];
function bCells(src = (p) => read(p)) {
  const floating = v2files().filter((f) => !EXEMPT.includes(f)).filter((f) => { const t = noCmt(src(f)); return /<Fab\b/.test(t) || /className="wl-fab"/.test(t); });
  const tops = TOPS.filter(([f, ...res]) => !res.every((re) => re.test(noCmt(src(f))))).map(([f]) => f);
  const help = noCmt(src('v2/lib/worklist/pageHelp.ts'));
  // "+ Post" is Collab's own button, whose words are "+ Post" (drawn in the page, not floating); only a lone + counts
  const plus = (help.match(/'[^']*(tap \+(?! Post)[ ,.]|The \+ button|the \+ button)[^']*'/g) || []);
  const named = ['New enquiry, at the top of the list', 'New client, at the top of the list', 'New invoice, at the top of the list', 'tap New expense', 'New event, at the top of the list',
    'New event, at the top of the page', 'tap New TDS entry', 'tap New wedding page', 'tap Add to Team', 'tap New note'].filter((w) => !help.includes(w));
  return { floating, tops, plus, named, more: /<AddFab \/>\n\s*<PinnedRooms \/>/.test(src('v2/app/vendor/(shell)/more/page.tsx')) };
}
function cCells(src = (p) => read(p)) {
  const shortM = v2files().filter((f) => !EXEMPT.includes(f)).filter((f) => { const t = noCmt(src(f)); return /'Jan',\s*'Feb'/.test(t) || /month: 'short'/.test(t) || /dateStyle: 'medium'/.test(t) || /year: '2-digit'/.test(t); });
  const ages = v2files().filter((f) => /\d+\}?(d|w|mo|y) ago`|min ago`|h ago`|days? ago/.test(noCmt(src(f))));
  const H0 = load(src('v2/lib/worklist/home.ts'));
  // a thrown or absent home is a red cell, never a crashed bench
  const H = new Proxy({}, { get: (_t, k) => (...a) => { try { return typeof H0[k] === 'function' ? H0[k](...a) : null; } catch (_e) { return null; } } });
  const now = Date.parse('2026-09-30T06:30:00Z');   // 12:00 IST
  const w = {
    today: H.whenWords('2026-09-30T05:10:00Z', now),          // 10:40 IST
    lateUtc: H.whenWords('2026-09-29T20:00:00Z', now),        // 01:30 IST on the 30th: still today in India
    older: H.whenWords('2026-09-28T09:00:00Z', now),
    lastYear: H.whenWords('2025-09-28T09:00:00Z', now),
    bad: H.whenWords('nope', now), agoIs: H.agoWords('2026-09-28T09:00:00Z', now), longDate: H.longDate('2026-09-30'),
  };
  const today = noCmt(src('v2/components/worklist/TodayHome.tsx'));
  const add = noCmt(src('v2/components/vendor/AddSheet.tsx')), sh = noCmt(src('v2/components/vendor/slices/SliceShell.tsx'));
  const due = /f\.key === 'due_date' && \/\^\\d\{4\}-\\d\{2\}-\\d\{2\}\$\/\.test\(values\[f\.key\] \?\? ''\) \? \(\s*<p data-date-words=""[^>]*>\{longDate\(values\[f\.key\]\)\}<\/p>/.test(add)
    && /<input type="date" value=\{editDue\}[^\n]*\n\s*\{\/\^\\d\{4\}-\\d\{2\}-\\d\{2\}\$\/\.test\(editDue\) \? <p data-date-words=""[^>]*>\{longDate\(editDue\)\}<\/p> : null\}/.test(sh);
  return { due, shortM, ages, w, chosen: /\{\/\^\\d\{4\}-\\d\{2\}-\\d\{2\}\$\/\.test\(date\) \? <p className="wl-home-chosen" data-date-words="">\{longDate\(date\)\}<\/p> : null\}/.test(today) };
}
const pCells = (src = (p) => read(p)) => ['v2/app/vendor/(shell)/portfolio/screen.tsx', 'v2/app/vendor/(legacy)/discover/profile/page.tsx']
  .map((f) => noCmt(src(f))).every((t) => /See your profile as visitors see it/.test(t) && !/as couples do/.test(t));

console.log('d1 CE-46 rooms (v2) · the static half');
const H_LONG = (d) => { try { return load(read('v2/lib/worklist/home.ts')).longDate(d); } catch (_e) { return null; } };
const b = bCells(), c = cCells();
cell('B1 no floating + in the new layout (FE-6\u2019s Contracts excepted)', b.floating.length === 0 || b.floating.join(', '));
cell('B2 every room draws its add at the top, in the ruled words, doing what the + did', b.tops.length === 0 || b.tops.join(', '));
cell('B3 More: Add is the first thing on the page', b.more || 'not first');
cell('B4 no "?" card line names the + any more', b.plus.length === 0 || b.plus.join(' | '));
cell('B5 each room\u2019s card names its top button', b.named.length === 0 || b.named.join(', '));
cell('C1 no short month, no medium date style, no two-digit year anywhere in the new layout', c.shortM.length === 0 || c.shortM.join(', '));
cell('C2 no age ("3d ago", "1w ago", "5 min ago", "2 days ago") anywhere in the new layout', c.ages.length === 0 || c.ages.join(', '));
cell('C3 whenWords: today is the time in India (10:40; 01:30 on the 30th is still today)', (c.w.today === '10:40' && c.w.lateUtc === '01:30') || JSON.stringify(c.w));
cell('C4 whenWords: an older day is the date, month written out ("28 September"); another year adds it', (c.w.older === '28 September' && c.w.lastYear === '28 September 2025' && c.w.bad === '' && c.w.agoIs === '28 September') || JSON.stringify(c.w));
cell('C5 Today writes the chosen date out in Indian order under the field ("Wednesday 30 September 2026")', (c.chosen && c.w.longDate === 'Wednesday 30 September 2026') || JSON.stringify([c.chosen, c.w.longDate]));
cell('C6 the invoice\u2019s Due date is written out under its field, in the New invoice sheet and the schedule\u2019s edit ("Saturday 3 October 2026")', (c.due && H_LONG('2026-10-03') === 'Saturday 3 October 2026') || JSON.stringify([c.due, H_LONG('2026-10-03')]));
cell('P1 Portfolio: "See your profile as visitors see it", never "as couples do" (both drawn sites)', pCells() || 'the couples line');

console.log('\nmutations (each must turn its cell red)');
const withEdit = (file, from, to) => (p) => { const t = read(p); if (p !== file) return t; if (!t.includes(from)) throw new Error('anchor absent: ' + from.slice(0, 50)); return t.replace(from, to); };
const mut = (name, fn) => { let r; try { r = fn(); } catch (e) { r = 'crashed: ' + e.message; } cell(name, r === true ? true : (r === false ? 'still green' : r)); };
mut('M1 a floating + back on Notes → B1 RED', () => bCells(withEdit('v2/components/vendor/NotesBody.tsx', '<div style={{ padding: \'4px 16px 12px\'', '<Fab label="New note" onClick={() => {}} /><div style={{ padding: \'4px 16px 12px\'')).floating.length > 0);
mut('M2 Invoices\u2019 words back to "+" → B2 RED', () => bCells(withEdit('v2/components/vendor/slices/SliceShell.tsx', "invoices: 'New invoice'", "invoices: '+'")).tops.length > 0);
mut('M3 a card line names the + again → B4 RED', () => bCells(withEdit('v2/lib/worklist/pageHelp.ts', "'New event, at the top of the page, adds an event.'", "'The + button adds an event.'")).plus.length > 0);
mut('M4 a short month back in a v2 formatter → C1 RED', () => cCells(withEdit('v2/lib/worklist/adsWire.ts', "const MON = ['January',", "const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];\nconst MON_X = ['January',")).shortM.length > 0);
mut('M5 whenWords read in UTC, not India → C3 RED', () => { const r = cCells(withEdit('v2/lib/worklist/home.ts', 'new Date(ms + 330 * 60000)', 'new Date(ms)')); return !(r.w.today === '10:40' && r.w.lateUtc === '01:30'); });
mut('M6 the Clients card back to "1w ago" → C2 RED', () => cCells(withEdit('v2/lib/vendor/cabinet.ts', '  const w = whenWords(iso);', '  if (iso === "x") return `${1}w ago`;\n  const w = whenWords(iso);')).ages.length > 0);
mut('M7 Today\u2019s words line removed → C5 RED', () => !cCells(withEdit('v2/components/worklist/TodayHome.tsx', '<p className="wl-home-chosen" data-date-words="">{longDate(date)}</p>', '<p className="wl-home-chosen" data-date-words="">{date}</p>')).chosen);
mut('M9 the New invoice sheet\u2019s words line removed \u2192 C6 RED', () => !cCells(withEdit('v2/components/vendor/AddSheet.tsx', '>{longDate(values[f.key])}</p>', '>{values[f.key]}</p>')).due);
mut('M8 Portfolio says couples again → P1 RED', () => !pCells(withEdit('v2/app/vendor/(shell)/portfolio/screen.tsx', '          See your profile as visitors see it', '          See your profile as couples do')));
console.log(`\n${fail ? 'RED' : 'GREEN'} — d1 CE-46 rooms (v2) ${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
