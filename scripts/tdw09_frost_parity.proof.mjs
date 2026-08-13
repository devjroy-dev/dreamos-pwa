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

const S_RAW = read(SANCTUARY);
const S = S_RAW ? decomment(S_RAW) : '';

/* ═══ §1 · THE ROUTE SET — seventeen, five of them redirects ════════════════ */
section('§1 · ROUTES — the bride can still reach every door she could reach');

const ROUTES = [
  'app/(frost)/frost/page.tsx',
  'app/(frost)/frost/canvas/sanctuary/page.tsx',
  'app/(frost)/frost/canvas/discover/page.tsx',
  'app/(frost)/frost/canvas/dream/page.tsx',
  'app/(frost)/frost/canvas/muse/page.tsx',
  'app/(frost)/frost/canvas/surprise/page.tsx',
  'app/(frost)/frost/canvas/onboarding/page.tsx',
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
const present = ROUTES.filter((r) => fs.existsSync(P(r)));
ok('1.1', 'all seventeen routes still exist', present.length === 17,
   `present ${present.length}/17 — missing: ${ROUTES.filter((r) => !present.includes(r)).join(', ')}`);

const REDIRECTS = [
  'app/(frost)/frost/canvas/discover/page.tsx',
  'app/(frost)/frost/canvas/journey/expenses/page.tsx',
  'app/(frost)/frost/canvas/journey/vendors/page.tsx',
  'app/(frost)/frost/canvas/journey/settings/page.tsx',
];
ok('1.2', 'the four redirect stubs still land on sanctuary',
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
ok('3.1', 'sanctuary carries 152 controls (145 sealed + 4 + Rider 2\'s one + D-2\'s two)', total === 152,
   `got ${total} — ${JSON.stringify(counts)}`);
ok('3.2', 'the per-class split matches the amended census',
   counts.button === 78 && counts.anchor === 8 && counts.input === 27 &&
   counts.textarea === 3 && counts.select === 2 && counts.tapdiv === 34,
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
const people = read('app/(frost)/frost/canvas/journey/people/page.tsx') || '';
ok('5.14', 'F-09.158 cure 2 — the standalone My People "Circle tab" is now Circle',
   people.includes('Invite someone from Circle.') && !people.includes('the Circle tab'));
ok('5.15', 'NO OTHER "tab" reference survives anywhere in the bride tree',
   !/the (Vendors|Circle|Muse|Moments|Pages) tab/i.test(S_RAW + people));
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
const lay = read('app/(frost)/layout.tsx') || '';
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
const GLYPH_EXEMPT = 10;
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
ok('6.12', 'every declared size is a rung, but for the ten named glyph sites',
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
ok('M.1', 'every subject this bench asserts on was actually present', seen.size >= 8, `read ${seen.size}`);
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
