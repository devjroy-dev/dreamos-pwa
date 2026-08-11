#!/usr/bin/env node
// scripts/tdw05_p3d_prospect_exit.proof.mjs — THE PROSPECT CONSOLE'S EXIT CONTROL.
//
// TDW_05 P3-D · CE-30, R-30.13 / R-30.19 / R-30.20. The sibling half is
// `dream-os scripts/b05_p3d_prospect_exit_bench.js` (36 cells, the four-member
// discriminator and the six paths). THIS bench owns exactly what that one
// declares it does not: the screen.
//
// ── ENVIRONMENT (R-30.5 / F-06.196) ─────────────────────────────────────────
// In-process, no network, no browser, no DB. Nothing is environment-gated;
// total = run, skipped = 0. Stated in the summary, not implied.
//
// ── WHY THESE CELLS ARE SOURCE-SHAPE AND WHAT THAT COSTS ────────────────────
// `page.tsx` is a JSX component with no extractable pure resolver — the exit
// DECISION deliberately does not live here at all (R-30.13: the router stamps
// `exit_kind`; the screen renders it). So there is no function to execute, and
// pretending otherwise would mean re-implementing the decision in the pwa just to
// have something to call — which is the exact duplication the ruling forbids.
// What CAN be proven mechanically is that this screen carries NO second opinion
// and that every rendered byte is the vetoed one. Both are properties of the
// source, and every cell below is mutation-proven so a green cannot survive the
// defacement of what it guards.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGE_REL = 'app/admin/prospects/page.tsx';
const PAGE_ABS = path.join(ROOT, PAGE_REL);

let pass = 0, fail = 0;
const fails = [];
const ok = (cond, label) => {
  if (cond) { pass++; console.log('  ok   ' + label); }
  else { fail++; fails.push(label); console.log('  FAIL ' + label); }
};
const section = (t) => console.log('\n── ' + t + ' ──');

// ── MUTATIONS over PRODUCTION source, applied in memory ─────────────────────
const MUTATIONS = {
  // The screen re-derives eligibility instead of reading the server's ruling.
  screen_second_opinion: (s) => s.replace(
    "const kind = p.exit_kind;",
    "const kind = p.last_template_at ? 'discard' : 'delete';"),
  // The control renders for every row, including the opt-out register.
  none_renders: (s) => s.replace(
    "{p.exit_kind && p.exit_kind !== 'none' && (",
    "{true && ("),
  // The confirm sentence disappears — one press becomes destructive.
  confirm_gone: (s) => s.replace("{EXIT_CONFIRM[p.exit_kind]}", "{null}"),
  // Restore's confirm stops naming the consequence it creates.
  restore_confirm_silent: (s) => s.replace(
    "restore: \"Restore this prospect? They'll return to the lane as cold — the next morning sweep can message them again.\",",
    "restore: 'Restore this prospect?',"),
  // The refusal keys go back to prose-matching.
  refusal_keys_gone: (s) => s.replace(
    "  has_conversation:        'This prospect has a conversation on file — discard instead of deleting.',", ''),
  // F-05.68's screen line is dropped.
  optout_line_gone: (s) => s.replace(
    "  opted_out_locked:        'They opted out — this row stays as the record of that.',", ''),
  // The pill list is hardcoded — the Discarded pill can never appear.
  pills_hardcoded: (s) => s.replace(
    ".concat(Object.keys(counts).map(s => ({ value: s, label: `${s.replace('_', ' ')} ${counts[s]}` })));",
    ".concat(['cold','templated'].map(s => ({ value: s, label: s })));"),
  // Send opener forgets the discard state — the console's own path 3 reopens.
  sendopener_enabled: (s) => s.replace(
    "disabled={p.state === 'opted_out' || p.state === 'discarded'}",
    "disabled={p.state === 'opted_out'}"),
};

const MUTATE = (process.argv.find(a => a.startsWith('--mutate=')) || '').split('=')[1] || null;
if (process.argv.includes('--mutations')) { console.log(Object.keys(MUTATIONS).join('\n')); process.exit(0); }

// ── GUARDED SUBJECT LOAD (R-26.19 §A): absent file = a DECLARED red, named ──
let PAGE = null, ABSENT = false;
try { PAGE = fs.readFileSync(PAGE_ABS, 'utf8'); if (!PAGE.trim()) ABSENT = true; }
catch { ABSENT = true; }
if (!ABSENT && MUTATE) {
  const fn = MUTATIONS[MUTATE];
  if (!fn) { console.log(`UNKNOWN MUTATION ${MUTATE}`); process.exit(2); }
  const out = fn(PAGE);
  if (out === PAGE) { console.log(`MUTATION ${MUTATE} DID NOT APPLY — its anchor moved. This is a RED, not a pass.`); process.exit(2); }
  PAGE = out;
}
const cell = (cond, label) => ABSENT
  ? ok(false, `${label}  [DECLARED-ABSENT-SUBJECT: ${PAGE_REL}]`)
  : ok(cond, label);
const has = (needle) => !ABSENT && PAGE.includes(needle);

// ═══ 1 · ONE AUTHORITY — the screen carries no second opinion ═══════════════
section('1 · R-30.13 — the exit decision is the server\'s, rendered not re-derived');
cell(has('const kind = p.exit_kind;'),
  'the verb comes from `exit_kind` off the wire, never from a screen-side rule');
cell(!ABSENT && !/exit_kind\s*=\s*[^=]/.test(PAGE.replace(/exit_kind\?:/g, '')),
  'and the screen never ASSIGNS exit_kind — it only reads it');
cell(has("kind === 'delete'") && has('`/${p.id}`') && has('`/${p.id}/${kind}`'),
  'delete rides DELETE /:id and the other two ride POST /:id/<verb> — the routes the sibling bench proved exist');

// ═══ 2 · THE OPT-OUT REGISTER RENDERS NO CONTROL AT ALL ════════════════════
section('2 · R-30.19/.20 — `none` means nothing renders, not something greyed');
cell(has("{p.exit_kind && p.exit_kind !== 'none' && ("),
  'the control is gated on a kind that is present AND not `none`');
cell(has("if (!kind || kind === 'none') return;"),
  'and the handler refuses `none` a second time — a screen ahead of an older API cannot fire a verb the server never offered');

// ═══ 3 · THE TWO-PRESS PATTERN ══════════════════════════════════════════════
section('3 · a destructive act costs the same second press as a real template');
cell(has('confirmExit === p.id'), 'the control arms per row before it fires');
cell(has('{EXIT_CONFIRM[p.exit_kind]}'), 'and the armed state renders the confirm SENTENCE, which is what the second press is reading');
cell(has('setConfirmSend(null); setConfirmExit(p.id)') && has('setConfirmExit(null); setConfirmSend(p.id)'),
  'arming either control disarms the other — two armed confirms on one row is two different second presses');

// ═══ 4 · EVERY RENDERED BYTE IS THE VETOED BYTE ════════════════════════════
// Byte-exact. `approve all`, founder, 2026-08-11 — both rounds.
section('4 · the copy book, byte for byte (founder-vetoed 「 approve all 」 2026-08-11)');
const BYTES = [
  ["delete:  'Delete',", 'button — Delete'],
  ["discard: 'Discard',", 'button — Discard'],
  ["restore: 'Restore',", 'button — Restore'],
  ['Delete this prospect? This number has never been messaged — the row will be removed permanently.', 'confirm₁'],
  ["Discard this prospect? They've already been messaged. The record stays, but the lane will never touch them again.", 'confirm₂'],
  ["Restore this prospect? They'll return to the lane as cold — the next morning sweep can message them again.", 'restore confirm — names its consequence'],
  ["delete:  'Prospect deleted.',", 'toast — deleted'],
  ["discard: 'Prospect discarded.',", 'toast — discarded'],
  ["restore: 'Prospect restored.',", 'toast — restored'],
  ['Already messaged — discard instead of deleting.', 'refusal — already_contacted'],
  ['This prospect has a conversation on file — discard instead of deleting.', 'refusal — has_conversation'],
  ['A demo was built for this prospect — discard instead of deleting.', 'refusal — has_demo'],
  ['This number was discarded. Restore it from the Discarded list to re-add.', 'refusal — already_discarded'],
  ['This prospect is discarded — restore first if you want to message them.', 'refusal — discarded (send-opener)'],
  ['They opted out — this row stays as the record of that.', 'refusal — opted_out_locked (F-05.68)'],
];
for (const [b, label] of BYTES) cell(has(b), `${label} — verbatim`);
cell(BYTES.length === 15, 'fifteen vendor-facing bytes, the closed copy book for this delivery');

// ═══ 5 · THE SECOND VOCABULARY REACHES THE SCREEN ══════════════════════════
section('5 · read-first §4.4 — the Discarded pill can actually render');
cell(has('Object.keys(counts).map'),
  'the pills are built from the server\'s counts object, so the eighth state appears the moment the router names it');
cell(!ABSENT && !/stateOptions[\s\S]{0,200}\['cold'/.test(PAGE),
  'and no hardcoded state list stands beside it — a state whose own screen cannot show it is F-06.196 in UI form');

// ═══ 6 · THE CONSOLE'S OWN SEND DOOR RESPECTS THE DISCARD ══════════════════
section('6 · path 3 of six, at the screen');
// SELF-CAUGHT BY THE MUTATION MATRIX: this cell first matched the bare
// expression `p.state === 'opted_out' || p.state === 'discarded'`, which is a
// SUBSTRING of the Converted button's longer condition one line below — so it
// went green over a Send-opener button whose guard had been removed. It greened
// on the wrong control. Both are now anchored to their own label.
cell(has(`label="Send opener"`) && has("setConfirmSend(p.id); }} small disabled={p.state === 'opted_out' || p.state === 'discarded'}"),
  'SEND OPENER is disabled on a discarded row — the server typed-refuses it too, and the screen does not offer it first');
cell(has(`label="Converted" onClick={() => markConverted(p)} small disabled={p.state === 'converted' || p.state === 'opted_out' || p.state === 'discarded'}`),
  'and CONVERTED is disabled on one too — a discarded row is not a row you mark anything on');

// ═══ SUMMARY ════════════════════════════════════════════════════════════════
const total = pass + fail;
console.log('\n' + '═'.repeat(62));
console.log(`tdw05_p3d_prospect_exit: ${pass} passed, ${fail} failed`);
console.log(`  total ${total} · run ${total} · skipped 0 · in-process, no network, no browser`);
if (fail) { console.log('FAILED CELLS:'); fails.forEach(f => console.log('  · ' + f)); }
console.log('═'.repeat(62));
process.exit(fail ? 1 : 0);
