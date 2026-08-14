#!/usr/bin/env node
// scripts/tdw13_d6_parity_matrix.proof.mjs
//
// TDW_13 · D-6 · THE BRIDE PARITY MATRIX — the bench.
//
// A document deliverable is the easiest thing in this estate to ship dishonestly:
// prose asserts, nothing checks, and the next block builds on it. This matrix is
// TDW_15's contract by that block's own first sentence, so a wrong row costs a
// whole block its map.
//
// So every load-bearing NUMBER and every GAP claim in docs/BRIDE_PARITY_MATRIX.md
// is re-derived here from the two trees and compared to what the document says.
// The document is the subject; the trees are the witness. If they disagree, the
// document is wrong — never the other way round.
//
// SIBLING-FULL REQUIRED. The capability axis lives in dream-os. Without the
// sibling this bench cannot see brideTools.js at all, and a bench that quietly
// skips its own axis is worse than one that fails: it reports green on a claim
// it never checked. Cell 0a refuses to continue.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// §4's cells now include PRESENCE assertions, and a presence cell reading raw
// text convicts on the explanation: D-4b's own header in events.tsx names
// `updateEvent`, `createEvent` and `deleteEvent` in prose while explaining which
// of them the bloom calls. Before this delivery §4 was absence-only and read raw
// — sound by luck. F-07.74's cure, the estate's one stripper, imported.
import { stripComments } from './lib/stripComments.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SIBLING = path.resolve(ROOT, '..', 'dream-os');
const DOC = path.join(ROOT, 'docs/BRIDE_PARITY_MATRIX.md');
const BLOOM_DIR = path.join(ROOT, 'components/frost/blooms');

let pass = 0, fail = 0;
const out = [];
const ok = (n, c, d) => { c ? (pass++, out.push(['ok  ', n])) : (fail++, out.push(['FAIL', n + (d ? ' — ' + d : '')])); return !!c; };

// ── 0 · the witnesses must exist ─────────────────────────────────────────────
const haveDoc = fs.existsSync(DOC);
const haveSib = fs.existsSync(path.join(SIBLING, 'src/agent/brideTools.js'));
ok('0a. the matrix document exists', haveDoc);
ok('0b. SIBLING-FULL — dream-os is beside this repo and carries brideTools.js', haveSib,
   `looked in ${SIBLING}`);
if (!haveDoc || !haveSib) {
  console.log('\n  BENCH ABORTED — a matrix bench without its capability axis proves nothing.');
  console.log('  Clone dream-os as a sibling of dreamos-pwa and re-run.\n');
  process.exit(1);
}

const doc = fs.readFileSync(DOC, 'utf8');
const tools = fs.readFileSync(path.join(SIBLING, 'src/agent/brideTools.js'), 'utf8');

// ── 1 · the capability axis ──────────────────────────────────────────────────
const names = [...tools.matchAll(/name:\s*'([a-z_]+)'/g)].map((m) => m[1]);
ok('1a. brideTools declares exactly 25 tools — the spec\'s figure', names.length === 25,
   `${names.length} found`);
ok('1b. control: the name scan is non-vacuous', names.length > 0);
ok('1c. the document states 25', /\*\*25 tools\*\*/.test(doc));

// deprecation, derived from each tool's own description
const deprecated = names.filter((n) => {
  const i = tools.indexOf(`'${n}'`);
  return /DEPRECATED/i.test(tools.slice(i, i + 400));
});
ok('2a. exactly four tools are self-deprecated', deprecated.length === 4, deprecated.join(', '));
for (const d of ['list_tasks', 'complete_task', 'update_task', 'delete_task'])
  ok(`2b. ${d} is one of them`, deprecated.includes(d));
ok('2c. create_task is NOT deprecated — G-5\'s whole point', !deprecated.includes('create_task'));
ok('2d. the document states the live axis is 21, not 25',
   /21 capabilities, not 25/.test(doc));

// every tool the document tables must be a real tool, and vice versa
const tabled = [...doc.matchAll(/^\| \d+ \| `([a-z_]+)`/gm)].map((m) => m[1]);
ok('3a. the document tables 21 rows', tabled.length === 21, `${tabled.length} rows`);
const bogus = tabled.filter((t) => !names.includes(t));
ok('3b. every tabled capability is a real tool — no invented row', bogus.length === 0, bogus.join(', '));
const untabled = names.filter((n) => !tabled.includes(n) && !deprecated.includes(n));
ok('3c. every live tool is tabled — no silently skipped row (the spec\'s own fear)',
   untabled.length === 0, untabled.join(', '));

// ── 4 · G-1, the load-bearing gap: Events is PARTIALLY closed ────────────────
//
// ── AMENDED BY CHARTER, CE-33 · TDW_14 D-4b · 2026-08-14 · R-D4b.1 ──────────
// This cell used to assert a three-verb ABSENCE loop: the Events bloom calls
// none of createEvent, updateEvent, deleteEvent. D-4b's delegation affordance
// writes `assigned_circle_member_id` through `updateEvent`, so one third of that
// loop is now false and G-1's read-only sentence with it.
//
// THE ROUTE NOT TAKEN. A client function named `assignEvent` calling the same
// door would have kept this grep green while the ruling it guards went false —
// the cell passing, the document lying, and TDW_15 planning against a surface
// that no longer exists. That was refused on sight at the sitting's §0.2 and the
// amendment ruled instead. A cell asserts the RULING, not the implementation
// (R-33.2); the inverse is that code is not renamed to satisfy a cell.
//
// SO THE CELL ASSERTS THE NEW RULING IN BOTH HALVES, and the halves are not
// symmetrical: the surviving absences stay absences, and the new presence is
// BOUNDED — present at the assign site and NOWHERE ELSE. An unbounded
// `updateEvent` presence cell would pass just as happily on a bloom that had
// grown a full edit sheet, which is precisely the thing rows 4 and 6 still
// claim is open. R-33.3: the radius equals the claim.
const events = fs.readFileSync(path.join(BLOOM_DIR, 'events.tsx'), 'utf8');
const eventsCode = stripComments(events);

// half one — the surviving absences. Create and delete are still open, tabled.
for (const w of ['createEvent', 'deleteEvent'])
  ok(`4a. the Events bloom still does NOT call ${w} — that half of G-1 holds`,
     !new RegExp(`\\b${w}\\s*\\(`).test(eventsCode));

// half two — the new presence, counted rather than merely detected. ONE call.
const updateCalls = (eventsCode.match(/\bupdateEvent\s*\(/g) || []).length;
ok('4a2. the bloom calls updateEvent EXACTLY ONCE — the assign, and nothing more',
   updateCalls === 1, `${updateCalls} call sites`);
ok('4a3. …and that one call site is the assign — it writes the delegation column',
   /updateEvent\([^)]*\{\s*assigned_circle_member_id/.test(eventsCode.replace(/\s+/g, ' ')),
   'updateEvent is called with something other than the delegation column');
// the counterpart absence, so "assign only" is a claim about the PATCH BODY and
// not merely about how many times the function name appears.
for (const f of ['title:', 'event_date:', 'notes:'])
  ok(`4a4. the assign body carries no ${f.slice(0, -1)} — it is not an edit sheet`,
     !new RegExp(`updateEvent\\([^)]*${f}`).test(eventsCode.replace(/\s+/g, ' ')));

ok('4b. it still READS — the write is one column, not a takeover of the room',
   /\bfetchEvents\s*\(/.test(eventsCode));
// the doors G-1 claims exist must actually exist
const client = fs.readFileSync(path.join(ROOT, 'lib/frost/journey.ts'), 'utf8');
for (const w of ['createEvent', 'updateEvent', 'deleteEvent'])
  ok(`4c. ${w} IS exported by the client — the door exists, unwired`,
     new RegExp(`^export (async )?function ${w}\\b`, 'm').test(client));
const eventsApi = path.join(SIBLING, 'src/api/couple/events.js');
ok('4d. the backend carries the event writers', fs.existsSync(eventsApi) &&
   /router\.(post|patch|delete)/.test(fs.readFileSync(eventsApi, 'utf8')));
ok('4e. the document calls G-1 UI-only', /UI-only sitting|UI-only, no backend/.test(doc));

// ── THE COMPANION CELL (R-D4b.1 §2) ─────────────────────────────────────────
// The tree and the document are two homes for one ruling, and the whole reason
// this bench exists is that a document asserts while nothing checks. So the
// WORDS are pinned too: if the code is reverted the cells above red, and if the
// amendment is quietly deleted or softened these red. Neither can drift alone.
//
// Anchored on the STABLE parts — the state word, the signature, and the
// fifth-writer claim — never on the whole paragraph, which would fail on a
// reflow and teach the next reader to edit the document to please the bench.
const docFlatG1 = doc.replace(/\s+/g, ' ');
ok('4f. the matrix states G-1 is PARTIALLY CLOSED, not Open',
   /G-1 · The Events bloom is PARTIALLY CLOSED/.test(docFlatG1),
   'the G-1 heading no longer carries the amended state word');
ok('4g. the amendment is signed and dated in place',
   /AMENDMENT — `CE-33 · TDW_14 D-4b · 2026-08-14` · R-D4b\.1/.test(docFlatG1),
   'an unsigned amendment is a rewrite');
ok('4h. the delta is stated: a FIFTH writer, not one of the four tabled',
   /FIFTH WRITER, NOT ONE OF THE FOUR TABLED/.test(docFlatG1) &&
   /Create, delete and edit remain OPEN exactly as tabled/.test(docFlatG1),
   'the amendment does not say precisely what moved and what did not');
ok('4i. the summary row moved with the gap section — no half-amended document',
   /\*\*Partially closed, UI-only, no backend:\*\*/.test(docFlatG1),
   'G-1 is amended in one place and still reads Open in the other');

// ── 5 · G-2, note_to_self has no surface ─────────────────────────────────────
const allBlooms = fs.readdirSync(BLOOM_DIR).filter((f) => f.endsWith('.tsx'))
  .map((f) => fs.readFileSync(path.join(BLOOM_DIR, f), 'utf8')).join('\n');
ok('5a. no bloom references a notes door — G-2 holds',
   !/note_to_self|\/notes\b|couple_notes/.test(allBlooms));
ok('5b. control: the bloom corpus is real, not an empty read',
   allBlooms.length > 100000, `${allBlooms.length} bytes across ${fs.readdirSync(BLOOM_DIR).length} files`);

// ── 6 · the rows claimed CLOSED must actually be wired ───────────────────────
const CLOSED = {
  save_wedding_detail: ['settings.tsx', 'saveProfile'],
  add_booking:         ['vendors.tsx',  'createBooking'],
  update_booking:      ['vendors.tsx',  'updateBooking'],
  delete_booking:      ['vendors.tsx',  'deleteBooking'],
  record_payment:      ['vendors.tsx',  'recordPayment'],
  delete_receipt:      ['expenses.tsx', 'deleteReceipt'],
  delete_muse_save:    ['muse.tsx',     'deleteMuseSave'],
  invite_to_circle:    ['circle.tsx',   'inviteCircleMember'],
};
for (const [cap, [file, fn]] of Object.entries(CLOSED)) {
  const src = fs.readFileSync(path.join(BLOOM_DIR, file), 'utf8');
  ok(`6.${cap} — claimed CLOSED and the writer is genuinely called in ${file}`,
     new RegExp(`\\b${fn}\\s*\\(`).test(src));
}
ok('6z. the document claims eleven closed capabilities',
   /eleven capabilities/.test(doc));

// ── 7 · the reverse axis: bloom capabilities with no tool ────────────────────
for (const [what, re] of [
  ['Moments', /\/api\/v2\/couple\/moments/],
  ['Meridian concierge', /\/api\/v2\/couple\/concierge\/request/],
  ['Circle threads', /\/api\/v2\/frost\/circle\/messages/],
  ['vendor enquiries', /fetchEnquiries\s*\(/],
]) ok(`7. reverse gap is real — ${what} exists in a bloom`, re.test(allBlooms));
for (const t of ['moments', 'concierge', 'meridian', 'thread'])
  ok(`7b. …and no brideTool named for ${t}`, !names.some((n) => n.includes(t)));

// ── 8 · the document may not claim a row closed on an export alone ───────────
// Whitespace-normalised before matching: the sentence wraps across two lines in
// the document, and a line-anchored regex reported a rule that is plainly there
// as absent. A cell that fails on formatting teaches the next reader to edit the
// document to please the bench, which is the wrong direction of authority.
const docFlat = doc.replace(/\s+/g, ' ');
ok('8. the method section states the unwired-door rule explicitly',
   /a client export with no bloom caller is an unwired door/.test(docFlat));

// ── report ───────────────────────────────────────────────────────────────────
console.log('');
for (const [t, l] of out) console.log(`  ${t} ${l}`);
console.log('');
console.log('══════════════════════════════════════════════════════════════');
console.log(`tdw13_d6_parity_matrix: ${pass} passed, ${fail} failed`);
console.log(`  total ${out.length} · run ${out.length} · skipped 0 · in-process, no network`);
console.log(`  axis: ${names.length} tools (${deprecated.length} self-deprecated) · ${tabled.length} tabled`);
console.log(`VERDICT: ${fail === 0 ? 'GREEN' : 'RED'}`);
console.log('══════════════════════════════════════════════════════════════');
process.exit(fail === 0 ? 0 : 1);
