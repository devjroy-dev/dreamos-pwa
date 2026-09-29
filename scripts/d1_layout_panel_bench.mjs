#!/usr/bin/env node
// scripts/d1_layout_panel_bench.mjs · DESIGN-1 · THE SWITCHES, the admin panel's half (the founder and the chair).
// The master's logic, the per-vendor list under it and the date recorded once are dream-os's
// (scripts/d1_layout_master_bench.js, design/layout-switch). This holds what the Switchboard shows and sends:
//   the master is one control with On and Off that posts to its own door; "Classic layout kept until <date>" is shown
//   beside it once the door has a date, as a calendar date; the per-vendor list is drawn under it; an odd or older
//   answer reads as unread, never a broken page; the two layout rows are drawn on this card only.
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
const load = (src) => { const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText; const m = { exports: {} }; new Function('exports', 'require', 'module', out)(m.exports, require, m); return m.exports; };
let pass = 0, fail = 0;
const cell = (name, r) => { if (r === true) { pass++; console.log('  ok   ' + name); } else { fail++; console.log('  FAIL ' + name + '  → ' + r); } };

const COPY = 'lib/admin-api/layoutSwitchCopy.ts', PANEL = 'app/admin/switchboard/LayoutPanel.tsx', PAGE = 'app/admin/switchboard/page.tsx', API = 'lib/admin-api/index.ts';
const FULL = { flag: 'flag.vendor_layout_v2', default_on: false, env: 'LAYOUT_V2_VENDOR_IDS', vendor_ids: ['v-founder', 'v-swati'], master: { on: false, seeded: true, first_on_at: '2026-10-13T09:00:00.000Z', classic_kept_until: '2026-11-12' } };
const copyCells = (C) => ({
  date: C.keptDate('2026-11-12') === '12 November 2026' && C.keptDate('2027-01-01') === '1 January 2027',
  kept: C.LAYOUT_WORDS.kept(C.keptDate('2026-11-12')) === 'Classic layout kept until 12 November 2026',
  full: JSON.stringify(C.asLayoutState(FULL)) === JSON.stringify(FULL),
  older: C.asLayoutState({ ok: true, rows: [] }) === null && C.asLayoutState({ ...FULL, vendor_ids: undefined }) === null && C.asLayoutState({ ...FULL, master: undefined }) === null && C.asLayoutState(null) === null,
  noDate: C.asLayoutState({ ...FULL, master: { ...FULL.master, first_on_at: null, classic_kept_until: null } }).master.classic_kept_until === null,
});
const panelCells = (panel, page, api) => {
  const p = strip(panel), g = strip(page), a = strip(api);
  return {
    master: /seg\(W\.off, !on, 'off'\)\}\{seg\(W\.on, on, 'on'\)/.test(p) && /await setLayoutMaster\(to\)/.test(p) && /setLayoutMaster\s+= \(to: 'on' \| 'off'\) => adminPost<[^>]*>\('\/api\/v2\/admin\/capabilities\/layout\/master', \{ to \}\)/.test(a),
    shown: /st\.master\?\.classic_kept_until \? \(<>[\s\S]{0,200}W\.kept\(keptDate\(st\.master\.classic_kept_until\)\)/.test(p) && /W\.neverOn/.test(p),
    list: /st\.vendor_ids\.length \? st\.vendor_ids\.map\(/.test(p) && /W\.listNote\(st\.env\)/.test(p),
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
const pc = panelCells(read(PANEL), read(PAGE), read(API));
cell('2.1 the master is one control, Off and On, posting to its own door', pc.master || 'not wired');
cell('2.2 the kept-until line is shown once the door has a date, and "not turned on yet" before', pc.shown || 'not shown');
cell('2.3 the per-vendor list is drawn under the master, with where it is set', pc.list || 'no list');
cell('2.4 the answer is read through asLayoutState', pc.guarded || 'unguarded');
cell('2.5 the card is on the Switchboard once, and the two layout rows are drawn nowhere else', pc.once || 'drawn twice');

console.log('\nmutations (each must turn its cell red)');
const mut = (name, fn) => { let r; try { r = fn(); } catch (e) { r = false; } cell(name, r === true ? 'still green' : true); };
mut('M1 the month off by one → 1.1 RED', () => copyCells(load(read(COPY).replace('${months[m - 1]}', '${months[m]}'))).date);
mut('M2 an answer without the list accepted → 1.4 RED', () => copyCells(load(read(COPY).replace('if (!Array.isArray(o.vendor_ids) || typeof o.env', 'if (typeof o.env'))).older);
mut('M3 the kept-until line drawn with no date → 2.2 RED', () => panelCells(read(PANEL).replace('{st.master?.classic_kept_until ? (<>', '{true ? (<>'), read(PAGE), read(API)).shown);
mut('M4 the layout rows left in the gate groups → 2.5 RED', () => panelCells(read(PANEL), read(PAGE).replace('\n      && !(LAYOUT_KEYS as readonly string[]).includes(r.key)', ''), read(API)).once);
mut('M5 the master posting to the generic flip → 2.1 RED', () => panelCells(read(PANEL), read(PAGE), read(API).replace("'/api/v2/admin/capabilities/layout/master'", "'/api/v2/admin/capabilities/flag.vendor_layout_v2/flip'")).master);
console.log(`\n${fail ? 'RED' : 'GREEN'} — d1 layout panel ${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
