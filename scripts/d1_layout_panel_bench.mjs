#!/usr/bin/env node
// scripts/d1_layout_panel_bench.mjs · DESIGN-1 · THE SWITCHES, the admin panel's half (the founder and the chair).
// The master's logic, the per-vendor list under it and the date recorded once are dream-os's
// (scripts/d1_layout_master_bench.js, design/layout-switch). This holds what the Switchboard shows and sends:
//   the master is one control with On and Off that posts to its own door; "Classic layout kept until <date>" is shown
//   beside it once the door has a date, as a calendar date; the per-vendor list is drawn under it, each vendor with
//   Remove, and a find field offers the admin search's VENDORS only, minus those listed, each with Add (CE-46 F3, her
//   row's layout_v2, no Railway edit); an odd or older answer reads as unread, never a broken page; the two layout rows
//   are drawn on this card only. A mutation per claim.
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const ts = require(path.join(ROOT, 'node_modules/typescript'));
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
const load = (src) => { const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText; const m = { exports: {} }; new Function('exports', 'require', 'module', out)(m.exports, require, m); return m.exports; };
let pass = 0, fail = 0;
const cell = (name, r) => { if (r === true) { pass++; console.log('  ok   ' + name); } else { fail++; console.log('  FAIL ' + name + '  → ' + r); } };

const COPY = 'lib/admin-api/layoutSwitchCopy.ts', PANEL = 'app/admin/switchboard/LayoutPanel.tsx', PAGE = 'app/admin/switchboard/page.tsx', API = 'lib/admin-api/index.ts';
const FULL = { flag: 'flag.vendor_layout_v2', default_on: false, vendors: [{ id: 'v-founder', name: 'Founder', phone: '9000000001' }, { id: 'v-swati', name: 'Swati', phone: null }], master: { on: false, seeded: true, first_on_at: '2026-10-13T09:00:00.000Z', classic_kept_until: '2026-11-12' } };
const SEARCH = { ok: true, q: 'sw', count: 4, groups: [
  { key: 'vendors', label: 'Vendors', hits: [{ id: 'v-swati', label: 'Swati', path: '/admin/vendors/v-swati' }, { id: 'v-new', label: 'New MUA', sub: 'makeup · Delhi', path: '/admin/vendors/v-new' }] },
  { key: 'couples', label: 'Couples', hits: [{ id: 'c-1', label: 'A couple', path: '/admin/couples/c-1' }] },
  { key: 'demo', label: 'Demo', hits: [{ id: 'd-1', label: 'Demo vendor', path: '/admin/demo/d-1' }] } ] };
const g = (f) => { try { return f(); } catch (e) { return false; } };   // a thrown read is a red cell, never a crashed bench
const copyCells = (C) => ({
  date: g(() => C.keptDate('2026-11-12') === '12 November 2026' && C.keptDate('2027-01-01') === '1 January 2027'),
  kept: g(() => C.LAYOUT_WORDS.kept(C.keptDate('2026-11-12')) === 'Classic layout kept until 12 November 2026'),
  full: g(() => JSON.stringify(C.asLayoutState(FULL)) === JSON.stringify(FULL)),
  older: g(() => C.asLayoutState({ ok: true, rows: [] }) === null && C.asLayoutState({ ...FULL, vendors: undefined }) === null && C.asLayoutState({ ...FULL, master: undefined }) === null && C.asLayoutState(null) === null
    && C.asLayoutState({ ...FULL, vendors: undefined, env: 'LAYOUT_V2_VENDOR_IDS', vendor_ids: ['v-founder'] }) === null),
  junk: g(() => JSON.stringify(C.asLayoutState({ ...FULL, vendors: [{ id: 'v-a' }, { name: 'no id' }, null, 7, { id: '' }] }).vendors) === JSON.stringify([{ id: 'v-a', name: 'Unnamed', phone: null }])),
  cand: g(() => JSON.stringify(C.layoutCandidates(SEARCH, FULL.vendors)) === JSON.stringify([{ id: 'v-new', label: 'New MUA', sub: 'makeup · Delhi' }])
    && C.layoutCandidates({ groups: [] }, []).length === 0 && C.layoutCandidates(null, []).length === 0),
  words: g(() => C.LAYOUT_WORDS.find === 'Find a vendor' && C.LAYOUT_WORDS.add === 'Add' && C.LAYOUT_WORDS.remove === 'Remove' && !/Railway|comma list/.test(JSON.stringify(Object.values(C.LAYOUT_WORDS).filter((x) => typeof x === 'string')))),
  noDate: g(() => C.asLayoutState({ ...FULL, master: { ...FULL.master, first_on_at: null, classic_kept_until: null } }).master.classic_kept_until === null),
});
const panelCells = (panel, page, api) => {
  const p = strip(panel), g = strip(page), a = strip(api);
  return {
    master: /seg\(W\.off, !on, 'off'\)\}\{seg\(W\.on, on, 'on'\)/.test(p) && /await setLayoutMaster\(to\)/.test(p) && /setLayoutMaster\s+= \(to: 'on' \| 'off'\) => adminPost<[^>]*>\('\/api\/v2\/admin\/capabilities\/layout\/master', \{ to \}\)/.test(a),
    shown: /st\.master\?\.classic_kept_until \? \(<>[\s\S]{0,200}W\.kept\(keptDate\(st\.master\.classic_kept_until\)\)/.test(p) && /W\.neverOn/.test(p),
    list: /st\.vendors\.length \? st\.vendors\.map\(\(v\) => row\(v\.id, v\.name, v\.phone,/.test(p) && /\{W\.listNote\}/.test(p),
    remove: /rowBtn\(W\.remove, \{ 'data-layout-remove': v\.id \}, \(\) => void setVendor\(v\.id, v\.name, false\)\)/.test(p),
    add: /rowBtn\(W\.add, \{ 'data-layout-add': h\.id \}, \(\) => void setVendor\(h\.id, h\.label, true\)\)/.test(p)
      && /await setLayoutVendor\(id, onV2\)/.test(p) && /setLayoutVendor\s+= \(vendor_id: string, on: boolean\) => adminPost<[^>]*>\('\/api\/v2\/admin\/capabilities\/layout\/vendor', \{ vendor_id, on \}\)/.test(a),
    find: /adminSearch\(term\)\.then\(\(d\) => \{ if \(mine === seq\.current\) setFound\(layoutCandidates\(d, st\?\.vendors \?\? \[\]\)\); \}\)/.test(p) && /if \(term\.length < 2\) \{ setFound\(null\); return; \}/.test(p),
    drawnAsSent: /const vendors = asLayoutVendors\(d && d\.vendors\);\s*if \(!vendors\) throw new Error\(W\.unread\);\s*setSt\(\(s\) => \(s \? \{ \.\.\.s, vendors \} : s\)\);/.test(p),
    guarded: /const x = asLayoutState\(d\); if \(x\) setSt\(x\); else setFailed\(true\);/.test(p),
    once: (g.match(/<LayoutPanel \/>/g) || []).length === 1 && /&& !GUARDED_TEMPLATES\.includes\(r\.key\)\s*&& !\(LAYOUT_KEYS as readonly string\[\]\)\.includes\(r\.key\)\s*&& roomOf\(r\.key\) === room/.test(g),
  };
};
console.log('d1 layout panel · the Switchboard’s vendor layout card');
const c = copyCells(load(read(COPY)));
cell('1.1 the kept-until date reads as a calendar date ("12 November 2026")', c.date || 'wrong date');
cell('1.2 the line reads "Classic layout kept until 12 November 2026"', c.kept || 'wrong line');
cell('1.3 the door’s answer is the panel’s state, date and list included', c.full || 'changed');
cell('1.4 an older door or an odd answer reads as unread (never a broken Switchboard)', c.older || 'accepted');
cell('1.5 before the first ON there is no kept-until line', c.noDate || 'a date was invented');
cell('1.6 a list entry without an id is dropped, a missing name reads Unnamed (never guessed)', c.junk || 'junk kept');
cell('1.7 find offers the search’s VENDORS only, minus those listed (no couple, demo vendor or lead)', c.cand || 'wrong candidates');
cell('1.8 the words: Find a vendor, Add, Remove; no line sends the admin to Railway', c.words || 'wrong words');
const pc = panelCells(read(PANEL), read(PAGE), read(API));
cell('2.1 the master is one control, Off and On, posting to its own door', pc.master || 'not wired');
cell('2.2 the kept-until line is shown once the door has a date, and "not turned on yet" before', pc.shown || 'not shown');
cell('2.3 the per-vendor list is drawn under the master, each vendor by name and phone', pc.list || 'no list');
cell('2.3b each listed vendor has Remove, sending her id and off to the vendor door', pc.remove || 'no Remove');
cell('2.3c each found vendor has Add, sending her id and on to its own door (POST /layout/vendor)', pc.add || 'no Add');
cell('2.3d find asks the admin search from two letters, and the last question typed wins', pc.find || 'not wired');
cell('2.3e after Add or Remove the list drawn is the door’s answer, read through asLayoutVendors', pc.drawnAsSent || 'guessed');
cell('2.4 the answer is read through asLayoutState', pc.guarded || 'unguarded');
cell('2.5 the card is on the Switchboard once, and the two layout rows are drawn nowhere else', pc.once || 'drawn twice');

console.log('\nmutations (each must turn its cell red)');
const mut = (name, fn) => { let r; try { r = fn(); } catch (e) { r = false; } cell(name, r === true ? 'still green' : true); };
mut('M1 the month off by one → 1.1 RED', () => copyCells(load(read(COPY).replace('${months[m - 1]}', '${months[m]}'))).date);
mut('M2 an answer without the list accepted → 1.4 RED', () => copyCells(load(read(COPY).replace('if (!vendors || !m', 'if (!m').replace('const vendors = asLayoutVendors(o.vendors);', 'const vendors = asLayoutVendors(o.vendors) || [];'))).older);
mut('M6 find offers couples and demo vendors too → 1.7 RED', () => copyCells(load(read(COPY).replace("const hits = vendors && Array.isArray(vendors.hits) ? vendors.hits : [];", "const hits = groups.flatMap((g) => (g && Array.isArray((g as { hits?: unknown[] }).hits) ? (g as { hits: unknown[] }).hits : []));"))).cand);
mut('M7 find offers a vendor already listed → 1.7 RED', () => copyCells(load(read(COPY).replace('&& !on.has((h as LayoutCandidate).id)', ''))).cand);
mut('M8 Remove sends on → 2.3b RED', () => panelCells(read(PANEL).replace('() => void setVendor(v.id, v.name, false)', '() => void setVendor(v.id, v.name, true)'), read(PAGE), read(API)).remove);
mut('M9 the list guessed locally after Add, not the door’s answer → 2.3e RED', () => panelCells(read(PANEL).replace('setSt((s) => (s ? { ...s, vendors } : s));', 'setSt((s) => (s ? { ...s, vendors: [...s.vendors] } : s));'), read(PAGE), read(API)).drawnAsSent);
mut('M3 the kept-until line drawn with no date → 2.2 RED', () => panelCells(read(PANEL).replace('{st.master?.classic_kept_until ? (<>', '{true ? (<>'), read(PAGE), read(API)).shown);
mut('M4 the layout rows left in the gate groups → 2.5 RED', () => panelCells(read(PANEL), read(PAGE).replace('\n      && !(LAYOUT_KEYS as readonly string[]).includes(r.key)', ''), read(API)).once);
mut('M5 the master posting to the generic flip → 2.1 RED', () => panelCells(read(PANEL), read(PAGE), read(API).replace("'/api/v2/admin/capabilities/layout/master'", "'/api/v2/admin/capabilities/flag.vendor_layout_v2/flip'")).master);
console.log(`\n${fail ? 'RED' : 'GREEN'} — d1 layout panel ${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
