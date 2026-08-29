#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// scripts/tdw37_hygiene_false_success.proof.mjs
// M-HYGIENE · THE FALSE SUCCESS DIES — R-37.43 §8.3, on R-37.22's shape.
//
// THE SUBJECT. `SliceShell.tsx` carried, on the expenses slice's right swipe, a
// control whose entire body was a `'success'` toast over zero writes:
// `showToast('Repeat-last lands with the AddSheet rebuild (A4).', 'success')`.
// Ungated, every tier, on the shell twenty-two paying vendors use. §4's house
// law — the UI confirms only what a tool result or an API response proved — has
// no exception for small acts.
//
// ── WHAT EACH SECTION EXISTS FOR ────────────────────────────────────────────
//   §1 THE CURE — the shipped expenses swipe table is EXTRACTED and EXECUTED,
//      and the PRE-CURE expression is reproduced beside it and asserted to still
//      produce the lie. That return IS the disease; this bench fails if it comes
//      back. The suppression is proved MECHANICALLY through SwipeRow's own clamp
//      rather than by reading a label, because "renders nothing" is a claim
//      about the gesture, not about a string.
//   §2 THE OTHER VERBS — every other swipe side on every slice, asserted
//      byte-unmoved. Acceptance's second half: a hygiene cut that moved a
//      working gesture would be a worse defect than the one it cured.
//   §3 THE CENSUS TRIPWIRE — the read-first counted the swipe table's remaining
//      `'success'` sites. The count is pinned so that a NEW control reporting
//      success over no write reddens here on the day it is written.
//   §4 THE §0 CANARY — cell §1.3 asserts an ABSENCE from stripped source. An
//      absence cell is worthless if the stripper ate the file, so a known
//      PRESENCE is asserted through the same instrument.
//
// Run: node scripts/tdw37_hygiene_false_success.proof.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAW = (p) => readFileSync(join(__dirname, '..', p), 'utf8');

// [F-06.192] Source cells read CODE, never prose. Block comments and WHOLE-LINE
// `//` only: a trailing strip would cut `https://…` in half and these sources
// carry URLs. This file's own comments name every symbol it greps for, and the
// cure's in-code comment REPRODUCES the diseased line verbatim — which is
// exactly why §4's canary exists.
const strip = (s) => s
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
  .split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');
const CODE = (p) => strip(RAW(p));

const SHELL_P  = 'components/vendor/slices/SliceShell.tsx';
const SWIPE_P  = 'components/vendor/slices/SwipeRow.tsx';
const BINDER_P = 'components/vendor/slices/BinderCard.tsx';

const DISEASED = "showToast('Repeat-last lands with the AddSheet rebuild (A4).', 'success')";

let pass = 0, fail = 0; const reds = [];
function t(name, fn) {
  let ok = false, detail = '';
  try { const r = fn(); ok = r === true; if (!ok) detail = String(r); }
  catch (e) { ok = false; detail = e.message; }
  if (ok) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; reds.push(name); console.log(`  RED  ${name}${detail ? ' — ' + detail : ''}`); }
}

// ── THE SHIPPED EXPENSES SWIPE TABLE, extracted and executed ────────────────
// Not retyped: a reproduced expression is a bench testing itself, and this
// estate has been bitten by exactly that (the Seat A′ alert cells).
function shippedExpensesSides() {
  const src = CODE(SHELL_P);
  const m = src.match(/if \(slice === 'expenses'\) return \{([\s\S]*?)\n    \};/);
  if (!m) throw new Error('REFUSED — could not extract the expenses swipe table');
  // eslint-disable-next-line no-new-func
  return new Function('row', 'setSel', 'setConfirmDel', 'showToast', `return ({${m[1]}});`)(
    { id: 'e1', primary: 'Lens hire' }, () => {}, () => {}, () => {},
  );
}
// The PRE-CURE expression, reproduced deliberately so the disease has a cell.
function preCureExpensesRight() {
  const toasts = [];
  const side = { label: 'Repeat', onTrigger: () => toasts.push(['Repeat-last lands with the AddSheet rebuild (A4).', 'success']) };
  side.onTrigger();
  return { side, toasts };
}
// SwipeRow's own clamp, extracted and executed — the mechanism behind
// "renders nothing", read from the engine rather than asserted about it.
// The regex is deliberately LOOSE about the line's contents and strict only
// about its shape: a tight pin would turn every mutation of the clamp into an
// extraction REFUSAL, and a cell that reds because it could not find its subject
// proves less than one that reds because the subject misbehaved.
function clampRight(ddx, right) {
  const src = CODE(SWIPE_P);
  const m = src.match(/(if \(next > 0[^\n]*\) next = [^\n;]*;)/);
  if (!m) throw new Error('REFUSED — could not extract SwipeRow\'s right-side clamp');
  // eslint-disable-next-line no-new-func
  return new Function('ddx', 'right', `let next = ddx; ${m[1]} return next;`)(ddx, right);
}

console.log('\n§1 · THE CURE — R-37.43 §8.3, THE FALSE SUCCESS DIES');

t('the expenses row has NO right side — the gesture renders nothing', () => {
  const s = shippedExpensesSides();
  return s.right === undefined
    ? true : `the expenses row still has a right gesture: ${JSON.stringify(s.right)}`;
});
t('[THE DISEASE, PINNED] the PRE-CURE expression still toasts success over zero writes', () => {
  const { side, toasts } = preCureExpensesRight();
  return side.label === 'Repeat' && toasts.length === 1 && toasts[0][1] === 'success'
    ? true : 'the reproduction drifted — this cell no longer describes what shipped at 28df2b0';
});
t('the diseased byte is GONE FROM CODE, not merely relabelled', () =>
  !CODE(SHELL_P).includes(DISEASED)
    ? true : 'the success-over-nothing toast is still a live statement');
t('NO `success` register survives anywhere in the expenses swipe table', () => {
  const m = CODE(SHELL_P).match(/if \(slice === 'expenses'\) return \{([\s\S]*?)\n    \};/);
  if (!m) throw new Error('REFUSED — could not extract the expenses swipe table');
  return !/'success'/.test(m[1])
    ? true : 'a success toast re-entered the expenses gestures';
});
t('SwipeRow CLAMPS a rightward drag to zero when the side is absent (the mechanism)', () =>
  clampRight(140, undefined) === 0
    ? true : `the row would still translate ${clampRight(140, undefined)}px under the thumb`);
t('the same clamp leaves a real right side moving (the clamp is not a blanket freeze)', () =>
  clampRight(140, { label: 'Booked', onTrigger: () => {} }) === 140
    ? true : 'the clamp now eats every rightward drag — leads/invoices/events would go dead');
t('the expenses LEFT side (Delete) is byte-unmoved and still destructive', () => {
  const s = shippedExpensesSides();
  return s.left && s.left.label === 'Delete' && s.left.destructive === true
    ? true : `Delete moved: ${JSON.stringify(s.left)}`;
});
t('NO new copy byte ships with the cure — suppression, never substitution', () => {
  const m = CODE(SHELL_P).match(/if \(slice === 'expenses'\) return \{([\s\S]*?)\n    \};/);
  return !/label: '(?!Delete')/.test(m[1]) && (m[1].match(/label: '/g) || []).length === 1
    ? true : 'a second label appeared on the expenses row — a new vendor-facing byte with no veto';
});

console.log('\n§2 · THE OTHER VERBS — BYTE-UNMOVED (acceptance, second half)');

const S = () => CODE(SHELL_P);
t('leads RIGHT is still Booked, and still a real write (patchLeadState)', () =>
  /right: \{ label: 'Booked'/.test(S()) && /await patchLeadState\(row\.id, 'booked'\)/.test(S()));
t('leads LEFT still carries R-37.22\'s suppression, keyed on `redacted`', () =>
  /left: row\.redacted/.test(S()) && /\? undefined/.test(S())
    ? true : 'the R-37.22 precedent this cure reuses was disturbed by it');
t('leads LEFT still offers Call and Mark lost on their own row shapes', () =>
  /label: 'Call'/.test(S()) && /label: 'Mark lost', destructive: true/.test(S()));
t('invoices RIGHT is still Mark paid, and still a real write (recordPayment)', () =>
  /right: \{ label: 'Mark paid'/.test(S()) && /await recordPayment\(row\.id, \{ amount: owed \}\)/.test(S()));
t('events RIGHT is still Done, and still a real write (updateEvent)', () =>
  /right: \{ label: 'Done'/.test(S()) && /await updateEvent\(row\.id, \{ state: 'done' \}\)/.test(S()));
t('invoices and events LEFT are both still Cancel, both still confirm-gated', () =>
  (S().match(/left: \{ label: 'Cancel', destructive: true, onTrigger: \(\) => \{ setSel\(row\); setConfirmDel\(true\); \} \}/g) || []).length === 2
    ? true : 'one of the two Cancel gestures moved');
// ── AMENDED, LABELLED — CE-39 S2/6 (F-38.27's family, and this is the second sighting) ──
// This cell asserted the SPELLING of the mechanism: `router.push('/vendor?draft=`. R-39.3
// cured F-38.47 — that push UNMOUNTED THE SHELL from every crossed room — and the door now
// calls `openAsk(primer)` through lib/worklist/askContext.tsx, which opens the ask sheet in
// place inside the shell and makes the identical push on the /vendor tree. So the bench
// went red WITH the cure, exactly as F-38.27's did, and for the identical reason: it named
// an address instead of asserting a property.
//
// THE PROPERTY IS UNCHANGED AND IS WHAT IS ASSERTED NOW: the clients RIGHT gesture is still
// 「Ask in chat」, it still runs a real verb that OPENS THE CHAT, and it is still not a toast
// reporting a success nobody performed — which is this whole bench's subject. The mechanism
// is read at the door's own site rather than by its old spelling, so the next sitting that
// moves it again is told what the cell wanted rather than which string it missed.
t('clients (BinderCard) RIGHT is still Ask in chat, and still opens the chat rather than toasting', () =>
  /const swipeRight = \{ label: 'Ask in chat', onTrigger: askVictor \}/.test(CODE(BINDER_P))
  && /function askVictor\(\)/.test(CODE(BINDER_P))
  && /openAsk\(primer\)/.test(CODE(BINDER_P))
    ? true : 'the clients gesture moved, or became a toast');
t('clients LEFT is still Call-or-nothing, never a substituted verb', () =>
  /const swipeLeft = binder\.phone \? \{ label: 'Call'/.test(CODE(BINDER_P))
  && /\} : undefined;/.test(CODE(BINDER_P)));

console.log('\n§3 · THE CENSUS TRIPWIRE — read-first (ii), pinned not cured');

t('EXACTLY ONE `success` site remains reachable from a swipe verb, and it is the known one', () => {
  // The read-first censused every swipe side on every slice. After this cure the
  // only `'success'` reachable from a gesture is invoices' early return when the
  // row is already settled — a report of EXISTING STATE, not a claim that an act
  // occurred. It is NAMED HERE AND LEFT ALONE by R-37.43's scope; the count is
  // what makes a future false-success announce itself instead of blending in.
  const src = S();
  const body = src.match(/function swipeSidesFor\(row: Row\)[\s\S]*?\n  \}\n/);
  if (!body) throw new Error('REFUSED — could not extract swipeSidesFor');
  const hits = body[0].match(/'success'/g) || [];
  return hits.length === 1 && /showToast\('Already settled\.', 'success'\); return;/.test(body[0])
    ? true : `the swipe table now carries ${hits.length} success sites — a new one is this delivery's to explain`;
});
t('that one site is a STATE report, not an act claim (it early-returns before any write)', () =>
  /if \(owed <= 0\) \{ showToast\('Already settled\.', 'success'\); return; \}/.test(S())
    ? true : 'the Already-settled guard changed shape — re-grade it before trusting the count above');

console.log('\n§4 · THE §0 CANARY — the absence cell has teeth');

t('the stripper removes the cure comment\'s reproduction of the diseased line', () =>
  RAW(SHELL_P).includes(DISEASED) && !CODE(SHELL_P).includes(DISEASED)
    ? true : 'either the comment no longer records what shipped, or the stripper is not reading comments — §1.3 is vacuous');
// Pointed at a byte NO OTHER CELL asserts on, so that when it reds it is saying
// one thing only: the instrument is broken. A canary that shares a subject with
// a real cell reports that cell's news twice and its own news never.
t('the stripper leaves live code standing (a known PRESENCE through the same instrument)', () =>
  /function swipeSidesFor\(row: Row\)/.test(CODE(SHELL_P)) && /import \{ SwipeRow/.test(CODE(SHELL_P))
    ? true : 'the stripper ate live source — every absence cell in this file is void');

console.log(`\n${'═'.repeat(64)}`);
console.log(`tdw37_hygiene_false_success: ${pass}/${pass + fail}`);
if (fail) { console.log('REDS:'); reds.forEach((r) => console.log('  - ' + r)); }
console.log('═'.repeat(64));
process.exit(fail ? 1 : 0);
