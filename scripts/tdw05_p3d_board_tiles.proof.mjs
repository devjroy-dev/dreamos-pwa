#!/usr/bin/env node
// scripts/tdw05_p3d_board_tiles.proof.mjs — THE PROSPECT BOARD'S TILE ROW.
//
// TDW_05 P3-D rider · CE-30, R-30.22 / R-30.23 / R-30.24. F-05.70, limb 1, at the
// screen. The server half is `dream-os scripts/b05_p3d_board_counts_bench.js`
// (10 cells), which owns the arithmetic; this bench owns what is rendered.
//
// ── ENVIRONMENT (R-30.5) ────────────────────────────────────────────────────
// In-process, no network, no browser. Nothing gated; total = run, skipped = 0.
//
// ── WHY SOURCE-SHAPE, AND WHAT IT COSTS ─────────────────────────────────────
// The tile row is JSX over a server-supplied object; there is no pure resolver to
// execute, because the DECISION deliberately lives in the router (the counts
// object and `openers_sent_total` are both served facts). Re-implementing either
// here to have something to call would rebuild the second opinion this cure
// exists to retire. So these cells prove the two properties that ARE the cure —
// nothing is hardcoded, and every rendered byte is the vetoed one — and each is
// mutation-proven so a green cannot survive the defacement of what it guards.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGE_REL = 'app/admin/prospects/page.tsx';

let pass = 0, fail = 0;
const fails = [];
const ok = (c, l) => { if (c) { pass++; console.log('  ok   ' + l); } else { fail++; fails.push(l); console.log('  FAIL ' + l); } };
const section = (t) => console.log('\n── ' + t + ' ──');

const MUTATIONS = {
  // THE DISEASE ITSELF, restored: five hardcoded tiles over eight states.
  tiles_hardcoded: (s) => s.replace(
    '        {Object.keys(counts).map(s => (\n          <StatCard key={s} label={tileLabel(s)} value={counts[s] ?? 0} sub={TILE_SUB[s]} />\n        ))}',
    '        <StatCard label="Cold" value={counts.cold ?? 0} sub="no opener sent yet" />'),
  // The cumulative tile goes back to reading the waypoint state.
  tile_reads_waypoint: (s) => s.replace(
    '<StatCard label="Openers sent" value={openersSent ?? \'—\'} sub="every opener ever sent" accent />',
    '<StatCard label="Openers sent" value={counts.templated ?? 0} sub="every opener ever sent" accent />'),
  // THE FALSE ZERO RETURNS: an absent field renders 0 instead of unknown.
  absent_field_renders_zero: (s) => s.replace(
    "      setOpenersSent(typeof board.openers_sent_total === 'number' ? board.openers_sent_total : null);",
    '      setOpenersSent(board.openers_sent_total ?? 0);'),
  // The humanising fallback goes — a ninth state renders as nothing.
  fallback_gone: (s) => s.replace(
    'const tileLabel = (state: string) => TILE_LABEL[state] ?? humanise(state);',
    "const tileLabel = (state: string) => TILE_LABEL[state] ?? '';"),
  // R-30.24 uncured: the sub-line that lies about every restored row comes back.
  cold_subline_false: (s) => s.replace(
    "  cold:       'awaiting the morning sweep',", "  cold:       'no opener sent yet',"),
  // The waypoint tile loses the label that distinguishes it from the record.
  waypoint_label_collides: (s) => s.replace(
    "  templated:  'Opener sent, no reply yet',", "  templated:  'Opener sent',"),
};

const MUTATE = (process.argv.find(a => a.startsWith('--mutate=')) || '').split('=')[1] || null;
if (process.argv.includes('--mutations')) { console.log(Object.keys(MUTATIONS).join('\n')); process.exit(0); }

// GUARDED SUBJECT LOAD (R-26.19 §A): absent file = a DECLARED red, subject named.
let PAGE = null, ABSENT = false;
try { PAGE = fs.readFileSync(path.join(ROOT, PAGE_REL), 'utf8'); if (!PAGE.trim()) ABSENT = true; }
catch { ABSENT = true; }
if (!ABSENT && MUTATE) {
  const fn = MUTATIONS[MUTATE];
  if (!fn) { console.log(`UNKNOWN MUTATION ${MUTATE}`); process.exit(2); }
  const out = fn(PAGE);
  if (out === PAGE) { console.log(`MUTATION ${MUTATE} DID NOT APPLY — its anchor moved. This is a RED, not a pass.`); process.exit(2); }
  PAGE = out;
}
const cell = (c, l) => ABSENT ? ok(false, `${l}  [DECLARED-ABSENT-SUBJECT: ${PAGE_REL}]`) : ok(c, l);
const has = (n) => !ABSENT && PAGE.includes(n);

// ═══ 1 · THE HARDCODED LIST IS RETIRED, NOT EXTENDED ═════════════════════════
section('1 · R-30.22 arm (c) — the tile row is GENERATED');
cell(has('{Object.keys(counts).map(s => ('),
  'the tiles come from the counts object — the same source the FilterPills already read');
cell(has('<StatCard key={s} label={tileLabel(s)} value={counts[s] ?? 0} sub={TILE_SUB[s]} />'),
  'one tile per served state, its label and sub-line looked up rather than positioned');
cell(!ABSENT && (PAGE.match(/<StatCard/g) || []).length === 2,
  'exactly TWO StatCard call sites survive — the generated one and the cumulative one; the five hardcoded tiles are GONE');
cell(!ABSENT && !/counts\.(cold|in_session|converted|opted_out) \?\? 0/.test(PAGE),
  'and no tile reaches into the counts object by state name any more — the class dies, not the instance');

// ═══ 2 · THE CUMULATIVE TILE ═════════════════════════════════════════════════
section('2 · limb 1 — the record, not the waypoint');
cell(has("value={openersSent ?? '—'}"),
  'the cumulative tile reads the SERVED total, and renders an em-dash when it is absent');
cell(has("setOpenersSent(typeof board.openers_sent_total === 'number' ? board.openers_sent_total : null);"),
  'NEVER `?? 0`: a backend without the field is UNKNOWN, and a 0 there would re-commit the exact false zero this cure exists to kill');
cell(has("templated:  'Opener sent, no reply yet'"),
  'and the waypoint keeps its own tile under an honest label — dropping it would have made `templated` tileless and reopened the disease one state over');

// ═══ 3 · THE NINTH STATE RENDERS ═════════════════════════════════════════════
section('3 · R-30.23 at the screen — an unnamed state is not a blank');
cell(has("const humanise = (s: string) => s.replace(/_/g, ' ');"),
  'the humanising fallback exists');
cell(has('const tileLabel = (state: string) => TILE_LABEL[state] ?? humanise(state);'),
  'and an unrecognised state falls back to its humanised key rather than an empty label');

// ═══ 4 · EVERY RENDERED BYTE IS THE VETOED BYTE ══════════════════════════════
// 「 approve all 」, founder, 2026-08-12.
section('4 · the board copy book, byte for byte (founder-vetoed 2026-08-12)');
const BYTES = [
  ["cold:       'Cold',", 'label — Cold'],
  ["templated:  'Opener sent, no reply yet',", 'label — the waypoint tile'],
  ["replied:    'Replied',", 'label — Replied'],
  ["in_session: 'In session',", 'label — In session'],
  ["converted:  'Converted',", 'label — Converted'],
  ["opted_out:  'Opted out',", 'label — Opted out'],
  ["expired:    'Window closed',", 'label — Window closed'],
  ["discarded:  'Discarded',", 'label — Discarded'],
  ["cold:       'awaiting the morning sweep',", 'sub — Cold (R-30.24, the false line replaced)'],
  ["in_session: 'Mira is talking to them',", 'sub — In session'],
  ["expired:    'the 24h reply window ran out',", 'sub — Window closed'],
  ["discarded:  'off the lane, record kept',", 'sub — Discarded'],
  ['label="Openers sent"', 'label — the cumulative tile'],
  ['sub="every opener ever sent"', 'sub — the cumulative tile'],
];
for (const [b, l] of BYTES) cell(has(b), `${l} — verbatim`);

section('4.1 · R-30.24 — the retired byte is gone, not merely outnumbered');
cell(!ABSENT && !/'no opener sent yet'/.test(PAGE),
  'the false sub-line is REMOVED: a restored row is cold AND messaged, and the old byte said the opposite about exactly the rows the restore verb creates');

const total = pass + fail;
console.log('\n' + '═'.repeat(62));
console.log(`tdw05_p3d_board_tiles: ${pass} passed, ${fail} failed`);
console.log(`  total ${total} · run ${total} · skipped 0 · in-process, no network, no browser`);
if (fail) { console.log('FAILED CELLS:'); fails.forEach(f => console.log('  · ' + f)); }
console.log('═'.repeat(62));
process.exit(fail ? 1 : 0);
