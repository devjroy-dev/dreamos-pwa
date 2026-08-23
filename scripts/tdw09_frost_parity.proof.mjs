#!/usr/bin/env node
/* ─────────────────────────────────────────────────────────────────────────────
   scripts/tdw09_frost_parity.proof.mjs
   TDW_09 · THE FROST REDESIGN ARC — the L3 parity bench.

   THIS BENCH EXISTS BECAUSE PACKAGE 4 DIED. Three sessions shipped a bride rehaul
   that lost a door, buried the exits, and regressed its own ancestor, and the class
   beneath all three was PROVING THE SHAPE OF WORK INSTEAD OF THE THING. So:

     · CAPABILITY, NEVER SHAPE (L5). No cell asserts a class name, a colour literal,
       a pixel value, or an import string. Cells assert that the bride can still DO
       the thing. A cell that would go green on a screenshot is not written here.
     · The census at docs/mocks/../TDW09 census is this bench's SOURCE. Its floor is
       145 controls, comment-aware — the number two grep methods agreed on wrongly.
     · Every cell is provable RED at the pre-arc tree. The mutation ledger at the
       foot names how, and the ledger is the bench's own honesty check: a cell with
       no stated mutation is a cell nobody has proven bites.

   Runnable from any working directory (Q-SP-5).
   ───────────────────────────────────────────────────────────────────────────── */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const P = (r) => path.join(ROOT, r);
const SANCTUARY = 'app/(frost)/frost/canvas/sanctuary/page.tsx';

let pass = 0, fail = 0;
const section = (t) => console.log(`\n══ ${t} ══\n`);
function ok(id, desc, cond, detail = '') {
  if (cond) { pass++; console.log(`  ok   ${id} ${desc}`); }
  else { fail++; console.log(`  FAIL ${id} ${desc}${detail ? `\n         ${detail}` : ''}`); }
}

/* ── the shim. An absent file is a CONVICTION, never a silent zero (independent-
      method law: a check whose failure mode is a silent zero is not a check). ── */
const seen = new Set();
let QUIET = false;
function read(rel) {
  const f = P(rel);
  if (!fs.existsSync(f)) {
    if (!QUIET) { fail++; console.log(`  FAIL ——  SUBJECT ABSENT: ${rel}`); }
    return null;
  }
  seen.add(rel);
  return fs.readFileSync(f, 'utf8');
}

/* Strip comments before counting anything countable. The census's own tuition:
   two grep methods agreed on 147 controls because neither could see a comment. */
function decomment(src) {
  /* JSX block comments {/* ... *\/} carry prose that mentions code. The census was
     bitten by exactly this: two greps agreed on 147 controls because both counted a
     comment describing controls. Strip the spans, then the line comments. */
  const stripped = src.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '');
  return stripped.split('\n').filter((l) => {
    const t = l.trim();
    return !(t.startsWith('//') || t.startsWith('*') || t.startsWith('/*'));
  }).join('\n');
}

/* ── AMENDMENT, TDW_13 D-4 (2026-08-13): THE SUBJECT IS THE SURFACE ──────────
   Until this delivery, S was one file. D-4 split six blooms out of
   sanctuary/page.tsx into components/frost/blooms/ and moved two shared helpers
   to components/frost/_shared/. The bride's Sanctuary is unchanged; it is simply
   spread across nine files instead of one.

   So the subject follows the surface. Every cell below that counted controls,
   pinned a copy byte, or asserted a capability was asking a question about
   SANCTUARY, not about a path — and a bench that answers a path question when it
   was asked a surface question is the reason extraction is dangerous. Reading
   the conductor alone after D-4 would have dropped 82 controls and eleven
   founder-vetoed bytes to zero, and every one of those cells would have gone red
   while the bride's screen was untouched.

   THE UNION IS DERIVED, NOT LISTED. The bloom and _shared directories are read
   whole, so a seventh bloom extracted tomorrow joins the census automatically.
   A hand-written list is exactly how a control escapes a census: add a file, name
   it nowhere, and the count still passes. Cell 3.0 proves the union is non-empty
   and that the directories were actually found.                              */
const BLOOM_DIR  = 'components/frost/blooms';
const SHARED_DIR = 'components/frost/_shared';
function dirFiles(rel) {
  const d = P(rel);
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter((f) => /\.tsx?$/.test(f)).sort().map((f) => `${rel}/${f}`);
}
const SURFACE_FILES = [SANCTUARY, ...dirFiles(BLOOM_DIR), ...dirFiles(SHARED_DIR)];
const S_RAW = SURFACE_FILES.map((f) => read(f) || '').join('\n');
const S = S_RAW ? decomment(S_RAW) : '';
/* the conductor alone, for the cells that are genuinely about the conductor */
QUIET = true;
const CONDUCTOR_RAW = read(SANCTUARY) || '';
QUIET = false;
const CONDUCTOR = decomment(CONDUCTOR_RAW);

/* ═══ §1 · THE ROUTE SET — six, one of them a redirect ══════════════════════ */
section('§1 · ROUTES — the bride can still reach every door she could reach');

/* ── AMENDMENT, TDW_13 D-1 (2026-08-13): seventeen routes became six ────────
   This section was born of Package 4's death — doors were lost, so it stood
   guard over every door. D-1 deletes eleven of the seventeen, and an amendment
   that narrows an anti-door-loss guard deserves its ground stated, not just its
   number changed.

   THE GROUND: the eleven were the dead journey subtree and the dead dream
   sibling (F-13.1, F-13.2). Estate-wide census at 60b4317, again at 2916661 and
   again at c4debda: ZERO inbound. No router.push, no <Link>, no rewrite, in any
   scanned extension. They were routes that RESOLVED; they were never doors she
   could reach, which is the thing this section's own title guards. The founder
   ruled the deletion with the ground on the record — 「 there was no live bride 」
   while those routes were reachable, so no bookmark to a lost door exists either.

   WHAT DID NOT MOVE: the six survivors, and every cell below §1. The Circle,
   People, Events, Reminders, Moments, Expenses, Vendors and Settings CAPABILITIES
   are not deleted — they are blooms inside sanctuary, and §3's control census and
   §4's deck cells guard them there. This amendment removes duplicate dead
   implementations from the guard's subject list, not capabilities from the guard.

   tdw13_d1_dead_tree.proof.mjs now stands over the absence, with the live client
   lib/frost/journey.ts pinned against the name collision. Both-ways: cell 1.1
   goes RED at the pre-D-1 tree (ebf9097), where eleven extra routes exist. */
const ROUTES = [
  'app/(frost)/frost/page.tsx',
  'app/(frost)/frost/canvas/sanctuary/page.tsx',
  'app/(frost)/frost/canvas/discover/page.tsx',
  'app/(frost)/frost/canvas/muse/page.tsx',
  'app/(frost)/frost/canvas/surprise/page.tsx',
  'app/(frost)/frost/canvas/onboarding/page.tsx',
];
const present = ROUTES.filter((r) => fs.existsSync(P(r)));
ok('1.1', 'all six surviving routes still exist', present.length === 6,
   `present ${present.length}/6 — missing: ${ROUTES.filter((r) => !present.includes(r)).join(', ')}`);
/* THE OTHER HALF OF THE GUARD, and the reason this cell is not a weakening:
   the eleven must stay gone. A door that returns is as much a regression as a
   door that vanishes — two implementations answering to one room name is
   precisely F-13.1's disease. */
const DELETED_ROUTES = [
  'app/(frost)/frost/canvas/dream/page.tsx',
  'app/(frost)/frost/canvas/journey/page.tsx',
  'app/(frost)/frost/canvas/journey/events/page.tsx',
  'app/(frost)/frost/canvas/journey/reminders/page.tsx',
  'app/(frost)/frost/canvas/journey/circle/page.tsx',
  'app/(frost)/frost/canvas/journey/circle/[memberId]/page.tsx',
  'app/(frost)/frost/canvas/journey/people/page.tsx',
  'app/(frost)/frost/canvas/journey/moments/page.tsx',
  'app/(frost)/frost/canvas/journey/expenses/page.tsx',
  'app/(frost)/frost/canvas/journey/vendors/page.tsx',
  'app/(frost)/frost/canvas/journey/settings/page.tsx',
];
const revived = DELETED_ROUTES.filter((r) => fs.existsSync(P(r)));
ok('1.1b', 'the eleven routes D-1 deleted have not come back', revived.length === 0,
   revived.join(', '));

const REDIRECTS = [
  'app/(frost)/frost/canvas/discover/page.tsx',
];
ok('1.2', 'the surviving redirect stub still lands on sanctuary',
   REDIRECTS.every((r) => (read(r) || '').includes('/frost/canvas/sanctuary')));
ok('1.3', '/frost still replaces to sanctuary (the front door)',
   (read('app/(frost)/frost/page.tsx') || '').includes('/frost/canvas/sanctuary'));

/* ═══ §2 · THE ROSTER — eleven rail slices, twelve room keys ════════════════ */
section('§2 · ROSTER — eleven slices, twelve keys, Dream still hand-seated');

const sliceKeys = [...S.matchAll(/\{key:'(\w+)'\s*as RoomKey,\s*label:'([^']+)'/g)].map((m) => [m[1], m[2]]);
ok('2.1', 'BASE_SLICES still carries exactly eleven slices', sliceKeys.length === 11,
   `found ${sliceKeys.length}: ${sliceKeys.map((k) => k[0]).join(',')}`);

const EXPECTED = [['discover', 'Discover'], ['circle', 'Circle'], ['muse', 'Muse'],
  ['people', 'My People'], ['pages', 'Pages'], ['moments', 'Moments'],
  ['events', 'The Journey'], ['expenses', 'Expenses'], ['vendors', 'Vendors'],
  ['meridian', 'Meridian'], ['settings', 'Settings']];
ok('2.2', 'the eleven keys AND their label bytes are unchanged, in order',
   JSON.stringify(sliceKeys) === JSON.stringify(EXPECTED),
   `got ${JSON.stringify(sliceKeys)}`);

const keyUnion = (S.match(/type RoomKey = ([^;]+);/) || [])[1] || '';
const unionKeys = [...keyUnion.matchAll(/'(\w+)'/g)].map((m) => m[1]);
ok('2.3', 'RoomKey still carries twelve members (the eleven + dream)',
   unionKeys.length === 12 && unionKeys.includes('dream'), `got ${unionKeys.join(',')}`);

ok('2.4', 'Circle still carries the candle; nothing else does',
   (S.match(/candle:true/g) || []).length === 1 &&
   /\{key:'circle'\s*as RoomKey,\s*label:'Circle',\s*candle:true/.test(S));
ok('2.5', 'Meridian still flagged premium',
   /\{key:'meridian'\s*as RoomKey[^}]*premium:true/.test(S));

/* the coming-soon fallback's exclusion list must stay in lockstep with the union —
   a room added to RoomKey but not to that list silently renders "Coming soon." */
const excl = (S.match(/activeRoom!==null&&!\[([^\]]+)\]\.includes\(activeRoom\)/) || [])[1] || '';
const exclKeys = [...excl.matchAll(/'(\w+)'/g)].map((m) => m[1]);
ok('2.6', 'the coming-soon fallback excludes every one of the twelve rooms',
   unionKeys.filter((k) => k !== 'null').every((k) => exclKeys.includes(k)),
   `union ${unionKeys.length} vs exclusion ${exclKeys.length}`);

/* ═══ §3 · THE CONTROL FLOOR — 145, comment-aware ══════════════════════════ */
section('§3 · CONTROLS — she can still press everything she could press');

const CLS = {
  button: /<button\b/, anchor: /<a href/, input: /<input\b/,
  textarea: /<textarea\b/, select: /<select\b/,
  tapdiv: /<(?:div|span|img|svg|li|label)\b[^>]*onClick=/,
};
/* PER LINE, deliberately. `[^>]*` matches newlines in JS, so a whole-string scan
   finds spanning matches that no single element produces — it read 37 tap-divs
   where the tree has 32. The census counted per line; the bench counts per line;
   the two agree BY CONSTRUCTION rather than by luck. */
const counts = Object.fromEntries(Object.keys(CLS).map((k) => [k, 0]));
for (const line of S.split('\n')) for (const [k, re] of Object.entries(CLS)) if (re.test(line)) counts[k]++;
const total = Object.values(counts).reduce((a, b) => a + b, 0);
/* ── CENSUS AMENDED, LABELLED (Atelier Rider 1, founder-chartered 2026-08-07) ──
   BUILD-ALL sealed on a floor of 145. Rider 1 ADDS capability — the profile edit
   sheet — so the census MOVES, and it moves by a stated arithmetic rather than by
   a number quietly swapped:

     145  the BUILD-ALL floor, sealed on the founder's green walk
     +2   buttons  : the sheet's ✕ closer, the Save-date action
     +1   input    : the date field
     +1   tap-div  : the sheet's dismiss scrim
     ────
     149  Rider 1's floor
     +1   input    : Rider 2's rupee field (the budget row was already a Row and
                     only gained an onTap — a tap handler on an existing element
                     is not a new control, so the row itself adds nothing)
     ────
     150  Rider 2's floor
     +1   button   : the Discover beta gate's ✕ closer
     +1   tap-div  : the beta gate's dismiss scrim
     ────
     152  TDW_13 D-2's floor

   The Total-budget row gained no control: it is deliberately read-only until
   dream-os opens its half, so it is a Row with no onTap and the census does not
   count it. If that arithmetic and the delta disagree at a future sitting, the
   arithmetic is the claim to re-derive — not this constant.

   ── AMENDMENT, TDW_13 D-2 (2026-08-13), and why it is an amendment and not a
      re-baseline ────────────────────────────────────────────────────────────
   D-2 mounted the Discover beta gate (R-30.36, the founder's own bytes) and took
   this bench from 82/82 to 79/82. Three cells: 3.1, 3.2, and 6.12.

   6.12 was NOT amended. The gate's glyph was declared at fontSize 20, which is
   not a rung, and it was the eleventh site against an exemption of ten. The
   GLYPH IS WHAT MOVED — to 19, a rung — and the ladder and its exemption stand
   untouched. A delivery does not get to widen a design law to fit its own byte.

   3.1 and 3.2 ARE amended, 150→152 and button 77→78 / tapdiv 33→34, because the
   subject legitimately grew: a gate without a dismiss affordance is not a gate,
   so no honest version of this feature leaves sanctuary at 150. The two controls
   are named above so a future reader inherits a HISTORY and not a fresh number.
   Ratified by the chair on that ground, not by the hand that needed it — the
   executor brought it rather than editing it, because amending a sealed tripwire
   to accommodate one's own change is mechanically identical to silencing it, and
   the only thing separating the two is whose word says the movement was real.

   Both-ways is automatic here and was shown: these amended cells go RED at the
   pre-D-2 tree (2916661), where the counts are 150/77/33. */
/* 3.0 — the union guard. Every cell in this section counts across SURFACE_FILES;
   if that list collapsed to the conductor alone, the counts below would be a
   claim about one ninth of the surface wearing the whole surface's number. */
/* AMENDMENT, TDW_13 D-5: the count was 9 (D-4's six blooms + two shared homes +
   the conductor) and is now 14 — D-5 moved Discover, Muse, Circle, Pages and
   Meridian out too. The literal is deliberately kept rather than replaced with
   `> 1`: this cell exists to catch a union that COLLAPSED, and a floor of "more
   than one" would pass on a conductor plus one stray file. It moves by a stated
   arithmetic each time the surface genuinely grows, which is the same discipline
   the control census below has followed since Rider 1. */
ok('3.0', 'the surface union is real — conductor + eleven blooms + two shared homes',
   SURFACE_FILES.length === 14 && SURFACE_FILES[0] === SANCTUARY,
   `${SURFACE_FILES.length} files: ${SURFACE_FILES.join(', ')}`);

/* ── F-13.7 · THE LEAK-GUARD. The census is comment-stripped, and it was sound
   BY LUCK: nothing checked whether a comment line that SURVIVED the strip matched
   a control class. One prose `<button` left standing would have inflated a sealed
   census with no cell to catch it. This makes the luck a law.

   The hazard is not hypothetical — this surface carries prose describing controls
   ("They are 13 <div>, 5 <button> and 1 <a> across nine owning components") which
   the raw text counts as controls. 3.0c proves those lines exist, so 3.0b is a
   real guard and not an assertion over an empty set. Note that this bench's own
   decomment is a line filter and does not leak here; the estate's shared
   scripts/lib/stripComments.mjs DOES leak on this file, so any future cell that
   reaches for that stripper instead inherits the hazard 3.0b now guards. */
const LEAK_CONTROLS = S.split('\n')
  .filter((l) => /^\s*(\/\/|\{?\/\*|\*\s)/.test(l))
  .filter((l) => Object.values(CLS).some((re) => re.test(l)));
ok('3.0b', 'F-13.7 — no comment line surviving the strip matches a control class',
   LEAK_CONTROLS.length === 0,
   LEAK_CONTROLS.map((l) => l.trim().slice(0, 70)).join(' | '));
const RAW_COMMENT_CONTROLS = S_RAW.split('\n')
  .filter((l) => /^\s*(\/\/|\{?\/\*|\*\s)/.test(l))
  .filter((l) => Object.values(CLS).some((re) => re.test(l)));
ok('3.0c', 'control: the hazard is real — prose describing controls DOES exist here',
   RAW_COMMENT_CONTROLS.length > 0,
   'no comment mentions a control, so 3.0b guards nothing on this tree');

/* ── THE CENSUS MOVED BY CHARTER AT TDW_14 D-3b: 152 → 153, buttons 78 → 79 ──
   CE-115's CONTROL-INVENTORY LAW is that any change to a live surface accounts
   for every interactive control as KEPT, MOVED or REMOVED. D-3b ADDS one, and
   this is its accounting:

     +1 button — the poll OPTION control in the circle bloom's poll block. One
                 `<button` in source, rendered once per option (2-4) per poll.
                 It votes; it is disabled on a closed poll and while a vote is
                 in flight.

   Nothing else moved. The poll block's question, tally, closes-at and outcome
   lines are text, not controls. The polls STRIP on the coplanner threads index
   is a different surface and is not counted here.

   The numbers below are RE-DERIVED, never adjusted until the cell passes — a
   census edited to agree with the tree has stopped being a census. This cell
   reddened on its own the moment the control appeared, which is the whole
   reason it counts rather than merely checking that the named controls exist. */
/* ── THE CENSUS MOVED BY CHARTER AT TDW_14 D-3c: 153 → 161 ─────────────────
   CE-115's CONTROL-INVENTORY LAW: every interactive control accounted KEPT,
   MOVED, REMOVED — or, here, ADDED. D-3c adds eight, and this is the accounting,
   counted from the source diff against 8fbcddc rather than estimated:

     BUTTONS  78 → 83   (+5, of which +1 was D-3b's poll option, already banked;
                         D-3c adds four)
       +1  ① — the poll section's eyebrow BECOMES the affordance it was vetoed
               as. Not a new control in the design's eyes; it is the same byte
               finally doing its job. It is a new control in the CENSUS's eyes,
               and the census is right to count it: a <div> that becomes a
               <button> is a new thing a thumb can press.
       +1  "Add a choice" — appends a choice slot, greys at four.
       +1  "Ask" — submit, gated on a question and two choices.
       +1  "Cancel" — dismiss without writing.

     INPUTS   27 → 30   (+3)
       +1  the question field
       +1  the FIRST choice slot
       +1  the SECOND choice slot
           (slots three and four are the SAME <input> in source, rendered from
            `askOpts.map`, so they add nothing to a source census — the count is
            of controls DECLARED, not of controls painted. Named because a
            reader who counts what she sees on screen will find four and wonder.)

     TAPDIV   34 → 35   (+1)
       +1  the sheet's scrim — tapping outside dismisses, and it is disabled
           while a write is in flight so a mis-tap cannot orphan a poll.

   ANCHOR, TEXTAREA and SELECT are unmoved. The numbers are RE-DERIVED, never
   adjusted until the cell passed: a census edited to agree with the tree has
   stopped being a census, and this cell reddening the moment eight controls
   appeared is the only reason the accounting above exists at all. */
/* ── D-3e: 161 → 165, and the accounting, counted from the diff ───────────
     BUTTONS 83 → 86  (+3)
       +1  "Delete" on each poll card — one <button> in source, rendered once
           per poll. The WORD, not a glyph: people.tsx uses words for
           destructive acts and an icon would be a new vocabulary.
       +1  the confirm's destructive action (Delete / Deleting…)
       +1  the confirm's dismiss (Keep)
     TAPDIV  35 → 36  (+1)
       +1  the confirm's scrim — tap-outside dismisses, disabled mid-delete so a
           mis-tap cannot orphan the act.
     INPUT, ANCHOR, TEXTAREA, SELECT unmoved: unmaking asks for nothing typed. */
/* ── THE CENSUS MOVED BY CHARTER AT TDW_14 D-4b: 165 → 169 ─────────────────
   DECLARED IN THE KICKOFF, before a byte — R-33.1's own direction. CE-115's
   CONTROL-INVENTORY LAW: every interactive control accounted KEPT, MOVED,
   REMOVED or ADDED. D-4b adds four to the events bloom, counted from the source
   rather than estimated:

     BUTTONS  86 → 89   (+3)
       +1  Ⓐ 'Ask someone' — the delegation affordance on an event's meta
           block. One source site; rendered once per UNASSIGNED event, and only
           when the roster holds an active seat. An assigned event renders Ⓓ
           instead, which is a name in a <div> and is NOT a control: she taps
           the name for nothing, by ruling.
       +1  the picker's member row — one source site, rendered once per active
           member. It assigns and closes.
       +1  Ⓒ 'No one' — the un-assign row, in the same list as the names.

     TAPDIV   36 → 37   (+1)
       +1  the picker's dismiss scrim.

     ANCHOR 8 · INPUT 30 · TEXTAREA 3 · SELECT 2 — ALL UNMOVED.

   THE PANEL ITSELF ADDS NOTHING, and that was a design decision taken to keep
   this number honest: the scrim is a SIBLING of the panel rather than its
   parent, so the panel needs no stopPropagation tap handler. Nested, it would
   have cost a second tapdiv for an element no thumb is meant to press.

   THE MEMBER'S TRAY IS NOT COUNTED HERE and that is not an omission. Its state
   control lives at app/coplanner/page.tsx, which is the CO-PLANNER surface —
   outside SURFACE_FILES entirely (conductor + blooms + _shared). It is
   accounted where it lives, in that file's own control-inventory comment,
   amended in the same delivery.

   RE-DERIVED, NEVER ADJUSTED UNTIL THE CELL PASSES. These two cells reddened on
   their own at 169/89/37 before this comment was written, and the arithmetic
   above was checked against that measurement rather than fitted to it. Both-ways
   is automatic: they go RED at eb75327, where the counts are 165/86/36. */
/* ── CENSUS AMENDED, LABELLED — TDW_15 · P1 (CE-34, 2026-08-15) ─────────────
   169 -> 186. SEVENTEEN controls, and the arithmetic is itemised because a
   sealed count that moves by a number nobody can decompose has been silenced
   rather than amended.

     events.tsx    5 -> 21  (+16)   G-1's remaining three close here
       +9 button   Add a day · the done ring in the meta row · the done ring in
                   the Done section · Edit · Remove · the sheet's Cancel and
                   Save · the confirm's Cancel and Remove
       +3 input    title · date · time
       +1 textarea notes
       +1 select   the kind list (the server's own twelve, closed — F-15.5)
       +2 tapdiv   the sheet's scrim · the confirm's scrim
     expenses.tsx 23 -> 24  (+1)
       +1 input    the receipt photo's file input (beta-1, R-34.7)

   NOTHING WAS REMOVED OR MOVED. All 169 prior controls are KEPT; the
   inventory law's three columns for this delivery read 169 KEPT, 17 ADDED,
   0 MOVED, 0 REMOVED-BY-RULING.

   ── AND THE DOCUMENT THIS BENCH SHARES A SUBJECT WITH WAS STALE BY SEVENTEEN
   BEFORE THIS DELIVERY ADDED ONE. `docs/FROST_BLOOMS.md` still says 152 and
   still lists Events at "1 control · write doors — none", both true at its
   2026-08-13 derivation and false since D-4b. The executor counted against
   THIS instrument rather than that document, which is F-13.12's lesson
   applied; the document's own regeneration is not a UI sitting's to forge by
   hand and is carried forward by name.

   ── ONE COUNTED LINE WAS ALMOST LOST TO A WILDCARD, AND THE STORY IS THE
   REASON §6 OF `tdw15_p1_events.proof.mjs` EXISTS. The photo control was first
   written with an accept value of image-slash-wildcard. Those two characters
   open a block comment as far as the stripper eight lines above is concerned,
   and it swallowed the receipt list's thumbnail tap and delete control —
   expenses.tsx measured 23 -> 22, a DECREASE, on a delivery that only added.
   The number was wrong in the wrong direction and nothing in this file would
   have said so. Cured at the source by an explicit MIME list, and the class is
   now guarded by a cell rather than by having been noticed once.

   Both-ways is automatic here and was shown: these amended cells go RED at
   6107ff3, where the counts are 169/89/30/3/2/37. */
/* ── CENSUS AMENDED, LABELLED — TDW_15 · P2 (R-34.53, CE-35, 2026-08-18) ────
   186 -> 201. FIFTEEN controls, all of them in `expenses.tsx` (23 -> 24 at P1,
   24 -> 39 here), and the arithmetic is itemised control-by-control because a
   sealed count that moves by a number nobody can decompose has been SILENCED
   rather than amended. THE FIGURE BELOW WAS RATIFIED BY THE CHAIR AGAINST THIS
   ITEMISATION, never pre-approved.

     expenses.tsx 24 -> 39  (+15)   the envelope room, R-35.4's fourth slice

       +10 button
          1 the file affordance (`FileBtn`) — ONE `<button` in source, rendered
            on every receipt row in three places: the `my` slice, the `receipts`
            slice, and the tray. Counted once, per this census's per-line method.
          2 `+ Add` in the envelope slice
          3 the ✕ on each envelope row (one in source, one per envelope)
          4 the new-envelope sheet's ✕
          5 a picker option (one in source, rendered once per token in the
            SERVER's allowed[] — eleven today, and the count does not move if
            dream-os adds a twelfth, which is the point of R-34.34)
          6 the create action
          7 the file sheet's ✕
          8 an envelope row in the file sheet (one in source, one per envelope)
          9 `Remove` on the delete confirm
         10 `Keep` on the delete confirm

       +2 input    the envelope name field · the amount-set-aside field

       +3 tapdiv   the new-envelope sheet's dismiss scrim · the file sheet's
                   scrim · the delete confirm's scrim

   NOTHING WAS REMOVED OR MOVED. All 186 prior controls are KEPT; the inventory
   law's columns for this delivery read 186 KEPT, 15 ADDED, 0 MOVED,
   0 REMOVED-BY-RULING.

   ── TWO NON-MOVEMENTS, STATED SO THEY ARE NOT MISREAD AS OVERSIGHTS.
   (a) `SliceBtn` now renders FOUR tabs instead of three and adds NOTHING: it is
   one `<button` in source and this census counts source lines, not renders.
   (b) `expenses.tsx:349` — the `my` row's tap that opens the delete confirm —
   ships BYTE-UNTOUCHED with its meaning unchanged (R-35.5). The file control
   sits INSIDE that row and stops the event rather than sharing it, so the row
   gained a control without either control changing what the other means.

   Both-ways is automatic and was shown: these amended cells go RED at c6e631d,
   where the counts are 186 and 98/8/34/4/3/39. */
ok('3.1', 'the Sanctuary surface carries 201 controls (186 + TDW_15 P2: 15, itemised above)', total === 201,
   `got ${total} — ${JSON.stringify(counts)}`);
ok('3.2', 'the per-class split matches the amended census',
   counts.button === 108 && counts.anchor === 8 && counts.input === 36 &&
   counts.textarea === 4 && counts.select === 3 && counts.tapdiv === 42,
   JSON.stringify(counts));

/* the exit. Losing this strands her in a room — Package 4's second death. */
ok('3.3', 'the room-close control still exists and still calls closeRoom',
   /<button onClick=\{closeRoom\}/.test(S));
ok('3.4', 'closeRoom still clears activeRoom (the exit actually exits)',
   /const closeRoom\s*=[\s\S]{0,400}?setActiveRoom\(null\)/.test(S));

/* ═══ §4 · THE VERBS — capability living above the components ══════════════ */
section('§4 · VERBS — thirteen capabilities that no control census can see');

ok('4.1', 'the Discover deck still swipes (its own touch pair)',
   /onTouchStart=\{onTouchStart\}\s+onTouchEnd=\{onTouchEnd\}/.test(S));
ok('4.2', 'the end-card keeps its DEDICATED touch pair, not the deck\'s reused',
   /onTouchStart=\{onEndTouchStart\}\s+onTouchEnd=\{onEndTouchEnd\}/.test(S) &&
   /const onEndTouchStart\s*=/.test(S) && /const onEndTouchEnd\s*=/.test(S));
ok('4.3', 'blind mode still toggles and still resets its index',
   /setIsBlind\(b=>!b\);setBlindIdx\(0\)/.test(S));
/* BOTH save paths, counted. The deck saves two ways — the double-tap and the
   button — and a cell that matched EITHER went green while one was broken. The
   mutation ledger caught it; the cell now counts. */
const saveSites = (S.match(/spawnDiscHeart\(accent\);saveVendorToMuse\([\s\S]{0,170}?spawnDiscToast/g) || []).length;
ok('4.4', 'BOTH save-to-Muse paths still fire all three effects',
   saveSites === 2, `intact save paths: ${saveSites}/2`);
ok('4.5', 'the vendor panel still drags to dismiss against its threshold',
   /OVERLAY_DISMISS/.test(S) && /onTouchMove=\{e=>\{const d=e\.touches\[0\]\.clientY-dragY\.current/.test(S));
ok('4.6', 'the native contact picker is still wired',
   /onClick=\{pickContact\}/.test(S) && /const pickContact\s*=/.test(S));
ok('4.7', 'both multi-file uploads survive (Muse and Moments)',
   (S.match(/type="file" accept="image\/\*" multiple/g) || []).length === 2);
ok('4.8', 'Moments caption is still tap-to-edit, save and cancel intact',
   /setEditingId\(m\.id\);setEditCaption\(m\.caption\|\|''\)/.test(S) &&
   /onClick=\{\(\)=>saveCaption\(m\.id\)\}/.test(S) &&
   /onClick=\{\(\)=>setEditingId\(null\)\}/.test(S));
ok('4.9', 'the plate still opens the full-screen viewer',
   /onClick=\{\(\)=>setFullImg\(m\.image_url\)\}/.test(S));
ok('4.10', 'press feedback still reaches every adopter it reached',
   (S.match(/\{\.\.\.press\(/g) || []).length >= 16);
ok('4.11', 'reduced motion is still honoured by the press style',
   /pressedStyle\(pressedKey\s*===\s*key,\s*reducedMotion\)/.test(S));
ok('4.12', 'haptics still fire on the deck',
   /haptic\(6\)/.test(S) && /haptic\(3\)/.test(S));
ok('4.13', 'every rail slice still opens its room, and Dream still has its own door',
   /onClick=\{\(\)=>openRoom\(slice\.key\)\}/.test(S) && /onClick=\{\(\)=>openRoom\('dream'\)\}/.test(S));

/* ═══ §5 · COPY — expected-zero except the two founder-vetoed lines ════════ */
section('§5 · COPY — a redesign moves no words');

const KEEP = [
  'No expenses yet. Tap Add to log one.',
  'No receipts yet.',
  'No one yet. Add your first booking.',
  'No one yet. Invite someone from Circle.',
  'No photo yet',
  'No saves here yet.',
  'No one yet. Invite someone.',
  'Nothing yet.',
  'WhatsApp moments — coming soon',
  'Your first photo becomes Day One.',
  'Add from camera roll',
  'Coming soon.',
];
KEEP.forEach((c, i) => ok(`5.${i + 1}`, `byte-identical: "${c.slice(0, 44)}"`, S_RAW.includes(c)));

ok('5.13', 'F-09.158 cure 1 — the Vendors "tab" is now a room',
   S_RAW.includes('No bookings yet. Add vendors in the Vendors room.') &&
   !S_RAW.includes('Add vendors in the Vendors tab.'));
/* AMENDMENT, TDW_13 D-1: cure 2's witness was the standalone My People page,
   which D-1 deleted. The CURE did not die with it — the byte lives on in the
   surviving surface, sanctuary's Circle bloom empty state. So the cell is
   RE-POINTED, not retired: a cure whose witness moved keeps its guard at the
   new home, and retiring the cell would have quietly stopped watching a
   founder-vetoed byte that is still on screen today. */
ok('5.14', 'F-09.158 cure 2 — the "Circle tab" byte is Circle, at its surviving home',
   S_RAW.includes('Invite someone from Circle.') && !S_RAW.includes('the Circle tab'));
ok('5.15', 'NO OTHER "tab" reference survives anywhere in the bride tree',
   !/the (Vendors|Circle|Muse|Moments|Pages) tab/i.test(S_RAW));
ok('5.16', 'FROST_COPY.idlePool is UNTOUCHED (arm (c): pool untouched)',
   (read('lib/frost/tokens.ts') || '').includes('The light in October will be the colour of old letters.'));

/* ═══ §6 · THE ATELIER LANGUAGE — what the founder approved ════════════════ */
section('§6 · THE LANGUAGE — the rungs, the ink, the pin, the plate');

const tok = read('lib/frost/tokens.ts') || '';
ok('6.1', 'the eight rungs are minted and exported',
   /export const FT = \{[\s\S]*?numeral:\s*150[\s\S]*?head:\s*52[\s\S]*?greeting:\s*46[\s\S]*?room:\s*22[\s\S]*?lead:\s*19[\s\S]*?body:\s*16[\s\S]*?engraved:\s*11[\s\S]*?engravedSm:\s*9/.test(tok));
ok('6.2', 'the spacing rhythm and the one gutter are minted', /export const FS = \{[\s\S]*?gutter: 24/.test(tok));
ok('6.3', 'the imagery rule is minted (4:5, zero radius)',
   /plateRatio:\s*'4 \/ 5'/.test(tok) && /plateRadius:\s*0/.test(tok));

/* F-09.159 — the equality is PINNED, so the two families cannot drift apart again */
const v2soft = (tok.match(/inkSoft:\s*'([^']+)'/) || [])[1];
const modesSoft = (tok.match(/E1A:[\s\S]*?soft:\s*'([^']+)'/) || [])[1];
ok('6.4', 'F-09.159 — MODES.E1A.soft is byte-equal to V2_WINE_NIGHT.inkSoft',
   !!v2soft && v2soft.replace(/\s/g, '') === (modesSoft || '').replace(/\s/g, ''),
   `V2 ${v2soft} vs MODES ${modesSoft}`);

/* F-09.160 — the fifth seat */
// ── RE-AIMED AT R-36.11, RETIRE-WITH-THE-READER ─────────────────────────────
// This cell read the Wine default out of `app/(frost)/layout.tsx`. The context
// and its default MOVED to lib/frost/FrostCtx.tsx, because Next 16 refuses any
// export from a layout outside its permitted set and `useFrostMode` was one.
// The cell follows its subject: the LAW is unchanged (the fifth seat stays
// pinned to Wine), only the file holding it moved. CE-119's discipline — a true
// cell aimed one surface over is a false green — cuts both ways, so it is
// re-aimed rather than duplicated.
const lay = read('lib/frost/FrostCtx.tsx') || '';
ok('6.5', 'F-09.160 — the context default is pinned to Wine, not E3',
   /homeMode:\s*'E1A'/.test(lay) && /mode:\s*MODES\['E1A'\]/.test(lay) && /look:\s*'E1'/.test(lay) &&
   !/homeMode:\s*'E3'/.test(lay));

/* the signature: {days} renders ONCE */
const numeralEls = (S.match(/fontSize:FT\.numeral/g) || []).length;
ok('6.6', 'the countdown renders ONCE — the ghost element is gone, one numeral remains',
   !/className="gn-a"/.test(S) && !/fontSize:'320px'/.test(S) && numeralEls === 1,
   `numeral elements: ${numeralEls}`);
ok('6.7', 'the numeral speaks at type/numeral', /fontSize:FT\.numeral/.test(S));
ok('6.8', 'the plate is full-measure at the imagery ratio',
   /aspectRatio:FI\.plateRatio,borderRadius:FI\.plateRadius/.test(S));
ok('6.9', 'the Moments thread is retired with its gutter', !/left:82,top:20,bottom:40/.test(S));
ok('6.10', 'the rail label sits on type/room', /fontSize:FT\.room,lineHeight:1,flexShrink:0,color:sliceTxt/.test(S));

/* the floor: nothing in the bride tree sits below the engraved rung */
function walk(d, acc = []) {
  for (const e of fs.readdirSync(P(d), { withFileTypes: true })) {
    const r = path.join(d, e.name);
    if (e.isDirectory()) walk(r, acc); else if (e.name.endsWith('.tsx')) acc.push(r);
  }
  return acc;
}
const TREE = [...walk('app/(frost)'), ...walk('components/frost')];
/* GLYPH EXEMPTION amended, LABELLED: nine at BUILD-ALL, ten at Rider 1 — the edit
   sheet's ✕ closer is the tenth, sized to match the eight closers already exempt.
   Icon sizing is not a type rung; a 20px ✕ forced to 11px is a smaller hit target. */
/* ── AMENDED, LABELLED — TDW_15 · P2 (R-35.11, CE-35, 2026-08-18): TEN -> TWELVE.
   THE TWO NEW SITES, NAMED: `expenses.tsx`'s new-envelope sheet ✕ closer and its
   file sheet ✕ closer, both `fontSize:20`, both sized to match the ten closers
   already exempt.

   THE RATIONALE IS THIS FILE'S OWN STANDING SENTENCE, unchanged since Rider 1:
   icon sizing is not a type rung, and a 20px ✕ shrunk to a rung is a smaller hit
   target. Shrinking these two to 11px would have traded a real thumb for a
   green cell.

   AND THE DOCTRINE, because this amendment is the third time the family has
   shown itself: THE CELL PINNED A COUNT OF EXEMPT SITES, NOT THE INVARIANT. It
   caught no defect — it convicted a THIRD SHEET BUILT IN THE ESTATE'S OWN
   IDIOM, on a delivery whose closers are byte-for-byte the pattern the previous
   ten set. The exemption was sitting exactly at its ceiling (18px x3 + 20px x7 =
   10), so the next sheet anyone added was always going to red this cell. That is
   F-15.12's class whole: a cell that pins WHERE or HOW MANY is a tripwire
   against ever doing the same thing again correctly.

   RE-POINTING 6.12 AT THE INVARIANT IS STRICTLY STRONGER AND IS NOT TAKEN HERE.
   It is banked to M-CELLSWEEP as that family's THIRD NAMED INSTANCE, where the
   class gets ruled once rather than cell-by-cell mid-delivery.

   A THIRTEENTH STILL REDS. The exemption grows by RULING, one delivery at a
   time, and never by widening the predicate. */
const GLYPH_EXEMPT = 12;
const sizes = new Map();
let subRung = 0;
for (const f of TREE) {
  const src = decomment(fs.readFileSync(P(f), 'utf8'));
  for (const m of src.matchAll(/fontSize:\s*'?(\d+(?:\.\d+)?)'?/g)) {
    const v = parseFloat(m[1]);
    sizes.set(v, (sizes.get(v) || 0) + 1);
    if (v < 9) subRung++;
  }
}
ok('6.11', 'NOTHING in the bride tree renders below the engraved rung', subRung === 0, `${subRung} sites below 9px`);
const declared = [...sizes.keys()].sort((a, b) => a - b);
const RUNGS = [9, 11, 16, 19, 22, 46, 52, 150];
const strays = declared.filter((v) => !RUNGS.includes(v));
ok('6.12', 'every declared size is a rung, but for the twelve named glyph sites',
   strays.reduce((n, v) => n + sizes.get(v), 0) <= GLYPH_EXEMPT,
   `strays: ${strays.map((v) => `${v}px x${sizes.get(v)}`).join(', ')}`);
ok('6.13', 'the declared-size count fell from thirty-three', declared.length <= 8 + 2,
   `${declared.length} distinct: ${declared.join(', ')}`);

/* ═══ §7 · RIDER 1 — the profile edit sheet ═══════════════════════════════ */
section('§7 · RIDER 1 — she can change her wedding date without leaving the app');

ok('7.1', 'the date row is now tappable and opens the sheet',
   /label="Wedding date"[^/]*onTap=\{openEditDate\}/.test(S));
/* This cell's first draft also asserted that `saveProfile` appeared on the import
   line. That is an IMPORT-STRING assertion — the exact thing this bench's own
   header forbids, and the exact species that let a reverted P4 sitting certify a
   Discover door it had never executed. The call site IS the evidence: if the symbol
   were not imported, tsc would not be at zero. Clause removed, disclosed. */
ok('7.2', 'the sheet commits through saveProfile — the writer that had no caller',
   /await saveProfile\(\s*\{\s*wedding_date:\s*editDate\s*\}\s*\)/.test(S));
ok('7.3', 'the commit RE-READS the profile rather than assuming its own write',
   /await saveProfile[\s\S]{0,320}?await fetchProfile\(\)/.test(S));
ok('7.4', 'a failed save says so and does not close the sheet',
   /setSaveErr\(true\);\s*return;/.test(S) && /That didn't save\./.test(S_RAW));
ok('7.5', 'the scrim cannot dismiss mid-save (no orphaned write)',
   (S.match(/onClick=\{\(\)=>!savingP&&setEditOpen\(null\)\}/g) || []).length >= 2);
ok('7.6', 'THE BUDGET ROW ALWAYS RENDERS — it used to vanish when unset',
   /label="Total budget"/.test(S) && !/\{profile\?\.budget_total&&<Row label="Total budget"/.test(S));
/* 7.7 REPLACED AT RIDER 2, LABELLED. It asserted the budget row was read-only and
   carried a line pointing at WhatsApp. That line was FALSE — the in-app Dream room
   runs the same engine — and it shipped without the founder's copy veto. The cell
   now asserts the opposite state and, crucially, that the false sentence is GONE,
   so it can never quietly return. */
ok('7.7', 'the budget row is EDITABLE and the false WhatsApp line is gone',
   /label="Total budget"[\s\S]{0,140}?onTap=\{openEditBudget\}/.test(S) &&
   !S_RAW.includes('Ask Dream Ai on WhatsApp to change your budget'));
/* ── 7.8–7.10 REVERSED AT THE F-09.165 CURE, LABELLED ────────────────────────
   These three asserted Rider 2's DEFENCE: send an integer, filter to digits, show
   the register. That defence existed only because both writers truncated. The cure
   removed the reason, and CE R-26.5 §C ruled the field must learn no vocabulary at
   all — so asserting the old shape would now pin a defect in place. Reversed, and
   the reversal is named rather than a quiet delete. */
ok('7.8', 'the commit forwards the RAW string — the client has no opinion on budgets',
   /saveProfile\(\{ budget_total: budgetRaw,/.test(S) &&
   !/budget_total: Number\(budgetDigits\)/.test(S));
ok('7.9', 'the field no longer filters — she can type 4.5L because the server reads it',
   !/setEditBudget\(e\.target\.value\.replace\(\/\[\^0-9\]\/g,''\)\)/.test(S) &&
   /setEditBudget\(e\.target\.value\)/.test(S));
ok('7.10', 'the register previews ONLY on a plain figure — silence when unsure',
   /budgetPreview = \/\^\[0-9\]\+\$\/\.test\(budgetRaw\)/.test(S) &&
   /formatRs\(Number\(budgetRaw\)\)/.test(S) &&
   /\{budgetPreview&&<div/.test(S));

/* ── the walk finding: the question must actually reach her ─────────────────── */
ok('7.12', "the sheet shows the SERVER'S sentence when it has one",
   /\{saveMsg\|\|"That didn't save\. Check your connection and try again\."\}/.test(S));
ok('7.13', 'a 409 is carried as a QUESTION, not as a failure',
   /setAsking\(!!r\.needsConfirmation\)/.test(S) && /setSaveMsg\(r\.message\|\|null\)/.test(S));
/* ── THE ANSWER PATH (founder: 「 after the question, the next save is a yes 」) ── */
ok('7.15', 'the save that FOLLOWS a question carries the yes',
   /budget_total: budgetRaw, budget_confirmed: confirming/.test(S));
ok('7.16', 'the yes is captured BEFORE the resets, not left to closure timing',
   /const confirming = asking;[\s\S]{0,200}?setAsking\(false\)/.test(S));
ok('7.17', 'any keystroke clears the yes — a changed figure asks again',
   /onChange=\{e=>\{setEditBudget\(e\.target\.value\);setSaveErr\(false\);setSaveMsg\(null\);setAsking\(false\);\}\}/.test(S));
ok('7.18', 'reopening the sheet clears the yes',
   /setSaveMsg\(null\); setAsking\(false\);\n\s*setEditOpen\('budget'\)/.test(S));

ok('7.14', 'the question is not painted in the error colour',
   /color:asking\?ink:'#C4534A'/.test(S));

ok('7.11', 'the action is gated on a valid budget, not merely a non-empty field',
   /disabled=\{savingP\|\|\(editOpen==='budget'\?!budgetValid:!editDate\)\}/.test(S));

/* ═══ §8 · F-09.166 — THE FICTIONAL-BRIDE FLASH ══════════════════════════ */
section('§8 · F-09.166 — the first frame is empty, never someone else\'s');

/* Founder walk: 「 every time the screen refreshes it shows hello priya 」. The
   masthead seeded days=176, progress=.38, name='Priya', sinceYes=47 — fixture data
   for a bride who does not exist — and corrected itself a frame later. Same class
   as the WINE-FLASH-FIX's E3 literal. These cells assert ABSENCE, because a seed
   cannot be correct on a server that has no session to read. */
ok('8.1', 'no fictional seed survives in the masthead state',
   !/useState\(176\)/.test(S) && !/useState\(\.38\)/.test(S) &&
   !/useState\('Priya'\)/.test(S) && !/useState\(47\)/.test(S));
ok('8.2', 'the four masthead seeds are null — absence, not a better guess',
   /const \[days,\s*setDays\]\s*= useState<number\|null>\(null\)/.test(S) &&
   /const \[progress,\s*setProgress\]\s*= useState<number\|null>\(null\)/.test(S) &&
   /const \[name,\s*setName\]\s*= useState<string\|null>\(null\)/.test(S) &&
   /const \[sinceYes,\s*setSinceYes\]\s*= useState<number\|null>\(null\)/.test(S));
ok('8.3', 'NO reachable code path can greet her as Priya',
   !/return 'Priya'/.test(S) && !/useState\('Priya'\)/.test(S));
ok('8.4', 'the travelled arc and its dot render ONLY when position is known',
   /progress!==null&&dot&&<>/.test(S) && /const dot = progress===null \? null : arcPoint\(progress\)/.test(S));
ok('8.5', 'the numeral reserves its line box so the empty frame does not shift the rail',
   /minHeight:Math\.round\(FT\.numeral\*0\.78\)/.test(S));
ok('8.6', 'the greeting renders no sentence at all until the name is known',
   /\{name===null\?'\\u00A0':<>Hello, /.test(S));
ok('8.7', 'the rail hints assert nothing before the server answers',
   !/useState\('quiet'\)/.test(S) && !/useState\('a page is waiting'\)/.test(S) &&
   !/useState\('Your timeline'\)/.test(S) && !/useState\('Wednesday morning'\)/.test(S));

/* ═══ §M · ABSENT SUBJECTS — convicted by name, never silently ═════════════ */
section('§M · the bench read what it claims to have read');
/* AMENDMENT, TDW_13 D-1: the floor was 8 and is now 5, because D-1 removed
   eleven subjects this bench used to read. This cell is a LYING-BENCH guard —
   it catches a run where the reader shim silently returned nothing — so lowering
   its floor is exactly the move that would hide the failure it exists to catch.
   It is lowered anyway, to the number the bench now genuinely reads, because a
   floor above that is a cell that reds on a healthy tree and teaches the next
   reader to ignore it. The count is derived, not guessed: five subjects, and
   M.2 below still proves the shim refuses an absent path by name — which is the
   half of this guard that actually catches the lie. */
ok('M.1', 'every subject this bench asserts on was actually present', seen.size >= 5, `read ${seen.size}`);
ok('M.2', 'the shim refuses a known-absent path by name',
   (() => { QUIET = true; const r = read('app/(frost)/frost/canvas/__nope__/page.tsx'); QUIET = false;
            return r === null; })());

console.log('\n' + '─'.repeat(60));
console.log(`tdw09_frost_parity: ${pass} passed, ${fail} failed  (total ${pass + fail})`);
console.log('─'.repeat(60));
console.log(`
MUTATION LEDGER — every cell proven RED at the pre-arc tree (2e09207):
  M-1  routes      delete journey/moments/page.tsx           §1.1 RED
  M-2  roster      re-key one slice to a bare literal        §2.1/2.2 RED
  M-3  roster      drop 'meridian' from the exclusion list   §2.6 RED
  M-4  controls    remove the room-close button              §3.1/3.3 RED
  M-5  verbs       reuse the deck's touch pair on the end-card §4.2 RED
  M-6  verbs       drop spawnDiscHeart from the save tap     §4.4 RED
  M-7  verbs       delete the panel's onTouchMove            §4.5 RED
  M-8  copy        change one empty-state byte               §5.x RED
  M-9  ink         revert MODES.E1A.soft to 0.65a            §6.4 RED
  M-10 pin         revert the ctx default to 'E3'            §6.5 RED
  M-11 signature   restore the 320px ghost numeral           §6.6 RED
  M-12 floor       restore one 7px body site                 §6.11/6.12 RED
`);
process.exit(fail === 0 ? 0 : 1);
