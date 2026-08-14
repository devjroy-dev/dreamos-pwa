#!/usr/bin/env node
// scripts/tdw14_d4b_delegation.proof.mjs
//
// TDW_14 · D-4b · C-5 — DELEGATION'S SURFACES. The bench.
//
// D-4a proved the plane and the three doors in dream-os. This proves the two
// surfaces that spend them: the bride's affordance on the events bloom, and the
// member's tray on the co-planner home.
//
// §0 canaries the stripper · §1 pins the seven bytes at the character · §2 proves
// ONE HOME (no surface carries a literal of its own) · §3 the projection's client
// home · §4 the bride's surface · §5 the member's · §6 the ruled silences · §7
// R-D4.6's retirement · §8 F-13.11 · §9 mutates production source across a
// PROCESS BOUNDARY and restores by sha256.
//
// ── WHY THE STRIPPER IS NOT OPTIONAL HERE ──────────────────────────────────
// This delivery's own comments name every byte it freezes and every route it
// refused. A presence cell reading raw text would pass on the paragraph
// EXPLAINING that the bloom calls updateEvent once, and an absence cell would
// convict on the paragraph explaining why there is no nudge. Both directions of
// wrong, in the same file. F-07.74's cure is imported and §0 proves it ran.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { stripComments } from './lib/stripComments.mjs';

const SELF = fileURLToPath(import.meta.url);
const ROOT = path.join(path.dirname(SELF), '..');
const CELLS_ONLY = process.argv.includes('--cells-only');

let pass = 0, fail = 0;
const ok  = (n, c, d) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n + (d ? '  → ' + d : '')); } };
const sec = (t) => console.log('\n' + t);

// A MISSING FILE MUST RED AS A CELL, NEVER AS A STACK TRACE. The both-ways leg
// runs this bench at eb75327, where lib/circle/assignCopy.ts does not exist. A
// throw there exits 1, which LOOKS like the red the leg wants and is not — it is
// a crash before the first assertion, and a typo in this file would produce the
// same exit. An uncured run must yield a RED SET that names what is missing.
const raw = (rel) => { try { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); } catch { return ''; } };
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const code = (rel) => stripComments(raw(rel));
const flat = (s) => s.replace(/\s+/g, ' ');

const COPY   = 'lib/circle/assignCopy.ts';
const BLOOM  = 'components/frost/blooms/events.tsx';
const TRAY   = 'app/coplanner/page.tsx';
const CLIENT = 'lib/frost/journey.ts';
const CIRCLE = 'components/frost/blooms/circle.tsx';

const cCOPY = code(COPY), cBLOOM = code(BLOOM), cTRAY = code(TRAY);
const cCLIENT = code(CLIENT), cCIRCLE = code(CIRCLE);

// ═══════════════════════════════════════════════════════════════════════════
sec('§0 · THE CANARY — the stripper ran, and it did not swallow live code');
// ═══════════════════════════════════════════════════════════════════════════
// TWO DIRECTIONS, because a stripper can fail either way and only one of them
// is visible. §0.1 proves comments are GONE (or every absence cell below is
// convicting on prose); §0.2 proves live code SURVIVED (F-07.74: the naive rule
// swallowed 6,519 characters of sanctuary and no cell noticed).
ok('§0.1 the bloom\'s own prose is stripped — absence cells cannot convict on it',
   !cBLOOM.includes('hollow green') && cBLOOM.length > 4000,
   'the header survived the strip; every §4 cell below is reading an explanation');
ok('§0.2 …and live code survived — the affordance is still there',
   cBLOOM.includes('setPicking(ev)') && cBLOOM.includes('{ASSIGN_ASK}'));
ok('§0.3 the copy home stripped and survived',
   !cCOPY.includes('EXPECTED-ZEROS') && cCOPY.includes('export const ASSIGN_ASK'));
ok('§0.4 the tray file stripped and survived',
   !cTRAY.includes('NO EMPTY RENDER') && cTRAY.includes('ASSIGN_TRAY_HEAD'));

// ═══════════════════════════════════════════════════════════════════════════
sec('§1 · THE SEVEN BYTES — frozen at the CHARACTER (founder sheet, 2026-08-14)');
// ═══════════════════════════════════════════════════════════════════════════
// Four are words. Character-for-character, in the home, with the export shape:
// a cell that only greps for the string would pass on a comment quoting it.
ok('§1.Ⓐ ASSIGN_ASK is exactly `Ask someone`',
   cCOPY.includes("export const ASSIGN_ASK = 'Ask someone';"));
ok('§1.Ⓑ ASSIGN_PICKER_HEAD is exactly `Who\'s doing this?`',
   cCOPY.includes('export const ASSIGN_PICKER_HEAD = "Who\'s doing this?";'));
ok('§1.Ⓒ ASSIGN_NO_ONE is exactly `No one`',
   cCOPY.includes("export const ASSIGN_NO_ONE = 'No one';"));
ok('§1.Ⓔ ASSIGN_TRAY_HEAD is exactly `Yours`',
   cCOPY.includes("export const ASSIGN_TRAY_HEAD = 'Yours';"));
// FOUR AND ONLY FOUR. A fifth export here is a fifth byte nobody vetoed.
const exports4 = (cCOPY.match(/^export const /gm) || []).length;
ok('§1.5 the home exports EXACTLY FOUR constants — no unvetoed fifth byte',
   exports4 === 4, `${exports4} exports`);

// ═══════════════════════════════════════════════════════════════════════════
sec('§2 · ONE HOME — pollCopy\'s pattern, and the freeze is mechanical');
// ═══════════════════════════════════════════════════════════════════════════
// The whole point of a copy home: if a surface carries its own literal, the
// veto is enforceable only by reading both files and hoping.
for (const [rel, src] of [[BLOOM, cBLOOM], [TRAY, cTRAY]]) {
  for (const lit of ['Ask someone', 'No one', 'Yours', "Who's doing this?"]) {
    ok(`§2.1 ${rel.split('/').pop()} carries no literal of its own — \`${lit}\``,
       !src.includes(lit), 'a second home for a frozen byte');
  }
  ok(`§2.2 ${rel.split('/').pop()} imports from the home instead`,
     /from '(@\/lib|\.\.\/\.\.\/lib)\/circle\/assignCopy'/.test(src));
}

// ═══════════════════════════════════════════════════════════════════════════
sec('§3 · ① THE PROJECTION\'S CLIENT HOME — a column not in BOTH homes is invisible');
// ═══════════════════════════════════════════════════════════════════════════
// BOUND TO THE INTERFACE BODY. The first cut asserted the declaration
// file-wide, and mutation M6 — which deletes it from `CoupleEvent` — went GREEN,
// because the identical line survives in `updateEvent`'s patch type twenty
// declarations further down. The cell was reading the WRITE half while claiming
// the READ half. Caught by the mutation, which is the whole reason the leg runs.
const CE_BODY = (cCLIENT.match(/interface CoupleEvent \{([\s\S]*?)\n\}/) || [, ''])[1];
ok('§3.0 control: the CoupleEvent body was actually found', CE_BODY.includes('event_date'),
   'the slice is empty, so §3.1 asserts nothing');
ok('§3.1 CoupleEvent declares assigned_circle_member_id — the READ half',
   /assigned_circle_member_id\?: string \| null;/.test(CE_BODY));
ok('§3.2 …and the vendor array is not smuggled in beside it',
   !/assigned_member_ids/.test(CE_BODY));
ok('§3.3 the PATCH type carries it too — the write half of the projection',
   /export async function updateEvent[\s\S]{0,400}?assigned_circle_member_id\?: string \| null;/.test(cCLIENT));
// THE COLUMN THAT MUST NOT BE CONFUSED WITH IT. `assigned_member_ids` is
// team_members.id, vendor-plane whole, twelve vendor consumers, zero couple-side
// readers. A circle seat in that array surfaces a wedding guest inside a
// vendor's crew roster (0125's header, R-D4.2). It has no business on this lane.
ok('§3.4 R-D4.2 — the vendor array is ABSENT from the couple client',
   !/assigned_member_ids/.test(cCLIENT),
   'the vendor-plane crew array has reached the couple lane');
ok('§3.5 …and absent from both surfaces',
   !/assigned_member_ids/.test(cBLOOM) && !/assigned_member_ids/.test(cTRAY));

// ═══════════════════════════════════════════════════════════════════════════
sec('§4 · ② THE BRIDE\'S SURFACE — Ⓐ the affordance, Ⓑ the head, Ⓒ, Ⓓ the name alone');
// ═══════════════════════════════════════════════════════════════════════════
ok('§4.Ⓐ the affordance renders the frozen byte', /\{ASSIGN_ASK\}/.test(cBLOOM));
ok('§4.Ⓑ the picker head renders the frozen byte', /\{ASSIGN_PICKER_HEAD\}/.test(cBLOOM));
ok('§4.Ⓒ the un-assign row renders the frozen byte', /\{ASSIGN_NO_ONE\}/.test(cBLOOM));
ok('§4.Ⓒ2 …and it un-assigns by passing null, which is what the server reads as clear',
   /assign\(picking,\s*null\)/.test(cBLOOM));

// ── Ⓓ THE NAME ALONE. This is an ABSENCE claim and its radius is THIS SURFACE
//    (R-33.3). No label, no verb, no possessive in front of the name. The list
//    is the shapes a hand actually reaches for when it wants to be helpful.
for (const label of ['Assigned to', 'Assigned', 'Owner', 'Doing this', 'Responsible', 'Taking care'])
  ok(`§4.Ⓓ no label in front of the name — \`${label}\``,
     !cBLOOM.includes(label), 'Ⓓ ratified the name ALONE');
ok('§4.Ⓓ2 the name IS rendered — the absence claim is not over an empty set',
   /\{holderName\(ev\)\}/.test(cBLOOM));
ok('§4.Ⓓ3 …and it resolves through the roster, never from the raw id',
   /members\.find\(x=>x\.id===ev\.assigned_circle_member_id\)/.test(cBLOOM));

// ── THE REMOVAL CASE, on glass. The column is ON DELETE SET NULL server-side;
//    until the next read, an unresolvable seat must read as NOBODY, never as a
//    stale name. This is the walk card's last step, asserted in code.
ok('§4.1 an unresolvable seat returns null — the task returns to the pool VISIBLY',
   /const m = members\.find[\s\S]{0,80}?return m \? m\.invitee_name : null;/.test(cBLOOM));
// ── ONLY ACTIVE SEATS ARE OFFERED. D-4a's door refuses a non-active seat
//    server-side; offering a pending invitee shows her a choice the wire refuses.
ok('§4.2 the picker offers ACTIVE seats only',
   /filter\(m=>m\.status==='active'\)/.test(cBLOOM));
ok('§4.3 the affordance hides when the roster is empty — no invitation to a dead end',
   /members\.length>0\?\(/.test(cBLOOM));

// ── THE WRITE. R-D4b.1: one call site, the assign, and nothing else. The
//    parity matrix bench asserts the same ruling from the document's side; this
//    asserts it from the delivery's. Two homes for one ruling, both guarded.
const updateCalls = (cBLOOM.match(/\bupdateEvent\s*\(/g) || []).length;
ok('§4.4 R-D4b.1 — updateEvent is called EXACTLY ONCE on this surface',
   updateCalls === 1, `${updateCalls} call sites`);
ok('§4.5 …and its body is the delegation column ALONE — not an edit sheet',
   /updateEvent\(ev\.id, \{ assigned_circle_member_id: memberId \}\)/.test(cBLOOM));
for (const w of ['createEvent', 'deleteEvent'])
  ok(`§4.6 ${w} is still absent — that half of G-1 is still open, as tabled`,
     !new RegExp(`\\b${w}\\s*\\(`).test(cBLOOM));

// ═══════════════════════════════════════════════════════════════════════════
sec('§5 · ③ THE MEMBER\'S TRAY — Ⓔ, Ⓕ no empty render, Ⓖ the existing control');
// ═══════════════════════════════════════════════════════════════════════════
ok('§5.Ⓔ the tray head renders the frozen byte',
   /\{ASSIGN_TRAY_HEAD\.toUpperCase\(\)\}/.test(cTRAY));

// ── Ⓕ NO EMPTY RENDER. The whole section is behind the guard, not just the
//    list: a heading over an empty box is exactly what this byte refused.
ok('§5.Ⓕ the section is gated on holding something',
   /\{!loading && mine\.length > 0 && \(/.test(cTRAY));
ok('§5.Ⓕ2 …and there is NO empty-state line anywhere for it',
   !/Nothing yet|No tasks|nothing assigned|Nothing assigned/i.test(cTRAY),
   'a tray that announces its own emptiness tells her she was passed over');

// ── Ⓖ THE EXISTING STATE CONTROL. done ⇄ upcoming and nothing else. CANCEL IS
//    THE BRIDE'S: cancelling is a decision about the wedding, not about the
//    doing. The server refuses it (assigned.js 400s on any third value); the
//    surface must not offer it either, or she meets a refusal she was invited to.
ok('§5.Ⓖ the control toggles done ⇄ upcoming',
   /markState\(m\.id, m\.state === 'done' \? 'upcoming' : 'done'\)/.test(cTRAY));
ok('§5.Ⓖ2 CANCEL is not reachable from the tray — narrower than the couple plane',
   !/'cancelled'/.test(cTRAY) && !/cancel/i.test(flat(cTRAY).replace(/cancelled = true|if \(cancelled\)|cancelled\b/g, '')) === false || !/'cancelled'/.test(cTRAY),
   'a member can cancel the bride\'s journey item');

// ── HER DOOR, AND THE CREDENTIAL. f0772 §2.1 counts lane calls against
//    circleAuthHeaders; these cells name WHICH doors, so a call that silently
//    moves to another lane reds here even if the count still balances.
ok('§5.1 the tray READS the member door',
   /\$\{API\}\/api\/v2\/frost\/circle\/assigned\/\$\{bride_id\}/.test(cTRAY));
ok('§5.2 the tray WRITES state on the member door',
   /\$\{API\}\/api\/v2\/frost\/circle\/assigned\/\$\{id\}\/state/.test(cTRAY));
ok('§5.3 both carry the circle credential',
   (cTRAY.match(/circleAuthHeaders\(/g) || []).length >= 3);
ok('§5.4 the read handles the refusal through the ONE home (FORK B)',
   /circleRefused\(r\) \? null : r\.json\(\)[\s\S]{0,200}?assigned/.test(cTRAY) ||
   /assigned\/\$\{bride_id\}`, \{ headers: circleAuthHeaders\(\) \}\)\s*\.then\(r => \(circleRefused\(r\)/.test(flat(cTRAY)));
ok('§5.5 the write takes the SERVER\'S row back, never an optimistic guess',
   /if \(d\?\.success && d\.data\) setMine/.test(cTRAY),
   'the server owns the three predicates that make this safe');

// ── NO MONEY, NO VENDOR, ON HER SURFACE. Payload-level at the server by
//    construction; asserted here as a surface claim too, because a later hand
//    could widen this screen to read a couple door beside the member one.
// THE RADIUS IS THE INTERFACE BODY, not a character window. The first cut took
// 400 characters from the declaration and ran straight into `FeedEvent`, whose
// payload legitimately carries `vendor_name` — a cell convicting the file next
// door. R-33.3, caught by the cell reddening on my own tree.
const ITEM_BODY = (cTRAY.match(/interface AssignedItem \{([\s\S]*?)\n\}/) || [, ''])[1];
ok('§5.6a control: the item body was actually found', ITEM_BODY.includes('event_date'),
   'the slice is empty, so every absence below is over nothing');
for (const w of ['vendor', 'amount', 'budget', 'linked_lead_id', 'linked_binder_id'])
  ok(`§5.6 the tray's item type carries no \`${w}\``,
     !new RegExp(`\\b${w}`, 'i').test(ITEM_BODY));

// ── PLACEMENT, DERIVED. f0772 §14.3 pins four tabs; the tray takes none.
ok('§5.7 the tray adds NO fifth tab — §14.3\'s four-tab pin is untouched',
   !/coplanner\/(yours|assigned|tasks)/.test(code('app/coplanner/TabBar.tsx')));

// ═══════════════════════════════════════════════════════════════════════════
sec('§6 · THE RULED SILENCES — R-D4.3: an assignment does NOT notify');
// ═══════════════════════════════════════════════════════════════════════════
// The founder's word at the sheet, and D-4a's server half carries no send site
// at all. So a reassuring line here would be the copy lying about the wire.
for (const [rel, src] of [[BLOOM, cBLOOM], [TRAY, cTRAY], [COPY, cCOPY]])
  for (const w of ['notified', "we'll let", 'has been told', 'sent to', 'reminder sent'])
    ok(`§6.1 ${rel.split('/').pop()} promises no notification — \`${w}\``,
       !new RegExp(w, 'i').test(src));
ok('§6.2 no send site on either surface',
   !/sendWa|sendMetaTemplate|\/notify|\/nudge/.test(cBLOOM + cTRAY));

// ═══════════════════════════════════════════════════════════════════════════
sec('§7 · ④ R-D4.6 — the reminder stubs retired, and nothing was left calling them');
// ═══════════════════════════════════════════════════════════════════════════
for (const sym of ['fetchReminders', 'toggleReminder', 'deleteReminder', 'MOCK_REMINDERS'])
  ok(`§7.1 ${sym} is gone from the client`, !new RegExp(`\\b${sym}\\b`).test(cCLIENT));
ok('§7.2 the Reminder interface is gone',
   !/export interface Reminder\b/.test(cCLIENT));
// THE WHOLE-TREE CLAIM, walked rather than assumed — the reason the retirement
// was safe in the first place. A file added tomorrow that imports a deleted
// symbol would not compile, but a file that DECLARES its own is the drift this
// catches: the retirement was "no callers", and this keeps that true.
const treeFiles = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.next' || e.name === '.git') continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.tsx?$/.test(e.name)) treeFiles.push(p);
  }
})(ROOT);
const stubCallers = treeFiles.filter((f) =>
  /\b(fetchReminders|toggleReminder|deleteReminder)\s*\(/.test(stripComments(fs.readFileSync(f, 'utf8'))));
ok('§7.3 ZERO callers anywhere in the tree — the derivation the retirement rested on',
   stubCallers.length === 0, stubCallers.map((f) => path.relative(ROOT, f)).join(', '));
ok('§7.4 control: the walk found the tree, not an empty directory',
   treeFiles.length > 100, `${treeFiles.length} files walked`);
// The shared helpers the stubs used must NOT have gone dead with them.
for (const h of ['shouldUseMocks', 'delay'])
  ok(`§7.5 ${h} still has callers — the cut took the stubs, not their neighbours`,
     (cCLIENT.match(new RegExp(`\\b${h}\\s*\\(`, 'g')) || []).length > 1);

// ═══════════════════════════════════════════════════════════════════════════
sec('§8 · ⑤ F-13.11 — hydration, cured. Its own commit.');
// ═══════════════════════════════════════════════════════════════════════════
// HALF ONE: the initializer is BRANCH-FREE. The disease was a lazy useState
// initializer reading `navigator` during the first render — one answer on the
// server, another in the browser. `typeof navigator==='undefined'` was a guard
// against a crash, not against the mismatch.
ok('§8.1 contactsSupported initialises to a constant — no branch in first render',
   /const \[contactsSupported, setContactsSupported\] = React\.useState\(false\);/.test(cCIRCLE));
ok('§8.2 the lazy initializer is GONE',
   !/useState<boolean>\(\(\)=>\{/.test(cCIRCLE),
   'the browser is still being read during render');
ok('§8.3 the real answer is written AFTER MOUNT, where only the browser runs',
   /React\.useEffect\(\(\)=>\{\s*setContactsSupported\(/.test(cCIRCLE));
ok('§8.4 the SSR guard is retired with the branch it guarded',
   !/typeof navigator==='undefined'/.test(cCIRCLE));

// HALF TWO: the RENDER PATH is Date.now()-free. RADIUS IS THE CLAIM (R-33.3,
// chair-corrected at c-33.7): the third occurrence in this file is inside a
// click handler, runs long after hydration, and has no server render to
// disagree with. It is CLASSIFIED AND LEFT, not overlooked — so this cell
// asserts the count AND names every survivor's context. A bare "zero Date.now()"
// cell would have forced a cure on a non-defect to satisfy its own wording.
ok('§8.5 the retired render shape is gone from both dot sites',
   !/Date\.now\(\)-new Date\(a\.created_at\)/.test(cCIRCLE));
ok('§8.6 both dot sites now read mount-time state, and there are exactly two',
   (cCIRCLE.match(/nowTs!==null&&nowTs-new Date\(a\.created_at\)\.getTime\(\)<600000/g) || []).length === 2);
ok('§8.7 nowTs is null until mount — no dot on either first render',
   /const \[nowTs, setNowTs\] = React\.useState<number\|null>\(null\);/.test(cCIRCLE));
const nows = (cCIRCLE.match(/Date\.now\(\)/g) || []).length;
ok('§8.8 exactly three Date.now() survive in code', nows === 3, `${nows} found`);
ok('§8.9 …one is the mount effect', /React\.useEffect\(\(\)=>\{ setNowTs\(Date\.now\(\)\); \},\[\]\);/.test(cCIRCLE));
ok('§8.10 …one is the existing 10s tick — R-D3.5\'s one timer, not a second',
   /const tick = async \(\) => \{ setNowTs\(Date\.now\(\)\); await Promise\.all/.test(cCIRCLE));
ok('§8.11 …and one is the onSent CLICK HANDLER — classified, left, and named',
   /id:'local-'\+Date\.now\(\)/.test(cCIRCLE));
ok('§8.12 no setInterval was added — the dot rides the tick that already existed',
   (cCIRCLE.match(/setInterval\(/g) || []).length === 1);

if (CELLS_ONLY) {
  console.log(`\n  cells: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}

// ═══════════════════════════════════════════════════════════════════════════
sec('§9 — MUTATION: production source broken, across a PROCESS BOUNDARY');
// ═══════════════════════════════════════════════════════════════════════════
// R-33.4: every target below is CODE, never a comment, and each was verified
// UNIQUE on the FINAL tree. A mutation that lands in prose proves nothing about
// the cell that names it, and a target appearing twice restores only one of them.
const ledger = [];
function mutate(rel, from, to, label) {
  const abs = path.join(ROOT, rel);
  const before = fs.readFileSync(abs, 'utf8');
  const h = sha(before);
  const hits = before.split(from).length - 1;
  if (hits !== 1) {
    fail++; console.log(`  FAIL ${label}  → TARGET NOT UNIQUE in ${rel} (${hits} hits): ${from}`);
    return;
  }
  fs.writeFileSync(abs, before.replace(from, to));
  const r = spawnSync(process.execPath, [SELF, '--cells-only'], { encoding: 'utf8' });
  fs.writeFileSync(abs, before);
  const restored = sha(fs.readFileSync(abs, 'utf8')) === h;
  ledger.push({ rel, restored });
  ok(label, r.status !== 0, 'the cells PASSED over broken production source — decorative');
  ok(`${label} · restored byte-identical`, restored);
}

// ── the frozen bytes ──────────────────────────────────────────────────────
mutate(COPY, "export const ASSIGN_ASK = 'Ask someone';", "export const ASSIGN_ASK = 'Delegate this';",
       '§9.M1 [FROZEN Ⓐ] move the vetoed byte                    ⇒ §1 RED');
mutate(COPY, 'export const ASSIGN_PICKER_HEAD = "Who\'s doing this?";',
       'export const ASSIGN_PICKER_HEAD = "Who should do this?";',
       '§9.M2 [FROZEN Ⓑ] one word of the head                    ⇒ §1 RED');
mutate(COPY, "export const ASSIGN_TRAY_HEAD = 'Yours';", "export const ASSIGN_TRAY_HEAD = 'Your tasks';",
       '§9.M3 [FROZEN Ⓔ] the tray head                           ⇒ §1 RED');
mutate(COPY, "export const ASSIGN_NO_ONE = 'No one';",
       "export const ASSIGN_NO_ONE = 'No one';\nexport const ASSIGN_HINT = 'They will be notified.';",
       '§9.M4 an unvetoed fifth byte appears in the home         ⇒ §1.5 RED');

// ── one home ──────────────────────────────────────────────────────────────
mutate(BLOOM, '{ASSIGN_ASK}', "{'Ask someone'}",
       '§9.M5 the surface grows its own literal — the fork          ⇒ §2.1 RED');

// ── the projection law ────────────────────────────────────────────────────
mutate(CLIENT, '  assigned_circle_member_id?: string | null;\n}\n\n// couple_receipts',
       '}\n\n// couple_receipts',
       '§9.M6 the client home drops the column — invisible again ⇒ §3.1 RED');

// ── the bride\'s surface ───────────────────────────────────────────────────
mutate(BLOOM, 'return m ? m.invitee_name : null;', 'return m ? m.invitee_name : ev.assigned_circle_member_id;',
       '§9.M7 a removed member leaves a raw id on glass          ⇒ §4.1 RED');
mutate(BLOOM, "filter(m=>m.status==='active')", 'filter(m=>!!m)',
       '§9.M8 pending invitees offered a task the wire refuses   ⇒ §4.2 RED');
mutate(BLOOM, '{ASSIGN_NO_ONE}', "{'Assigned to ' + ASSIGN_NO_ONE}",
       '§9.M9 Ⓓ breaks — a label creeps in front of the name     ⇒ §4.Ⓓ RED');
mutate(BLOOM, 'updateEvent(ev.id, { assigned_circle_member_id: memberId })',
       'updateEvent(ev.id, { assigned_circle_member_id: memberId, title: ev.title })',
       '§9.M10 R-D4b.1 breaks — the write widens past the column ⇒ §4.5 RED');

// ── the member\'s tray ─────────────────────────────────────────────────────
mutate(TRAY, '{!loading && mine.length > 0 && (', '{!loading && (',
       '§9.M11 Ⓕ breaks — the tray renders over nothing          ⇒ §5.Ⓕ RED');
mutate(TRAY, "markState(m.id, m.state === 'done' ? 'upcoming' : 'done')",
       "markState(m.id, m.state === 'done' ? 'cancelled' : 'done')",
       '§9.M12 Ⓖ breaks — a member reaches for cancel            ⇒ §5.Ⓖ RED');
mutate(TRAY, 'if (d?.success && d.data) setMine', 'if (true) setMine',
       '§9.M13 the screen moves a row the server did not confirm ⇒ §5.5 RED');

// ── the ruled silence ─────────────────────────────────────────────────────
mutate(COPY, "export const ASSIGN_TRAY_HEAD = 'Yours';",
       "export const ASSIGN_TRAY_HEAD = 'Yours';\nexport const ASSIGN_SENT = \"We'll let her know.\";",
       '§9.M14 R-D4.3 breaks — the copy promises a send          ⇒ §6.1 RED');

// ── F-13.11 ───────────────────────────────────────────────────────────────
mutate(CIRCLE, 'const [contactsSupported, setContactsSupported] = React.useState(false);',
       'const [contactsSupported] = React.useState<boolean>(()=>{ return typeof navigator==='
       + "'undefined' ? false : !!((navigator as any).contacts); });",
       '§9.M15 F-13.11 returns — the browser read during render  ⇒ §8.1/§8.2 RED');
mutate(CIRCLE, 'const [nowTs, setNowTs] = React.useState<number|null>(null);',
       'const [nowTs, setNowTs] = React.useState<number|null>(Date.now());',
       '§9.M16 the dot decides during the first render again     ⇒ §8.7 RED');
mutate(CIRCLE, 'const tick = async () => { setNowTs(Date.now()); await Promise.all',
       'const tick = async () => { await Promise.all',
       '§9.M17 the dot freezes at mount and never refreshes      ⇒ §8.10 RED');

// ── the retirement ────────────────────────────────────────────────────────
mutate(CLIENT, '// Stub kept for compatibility',
       'export async function fetchReminders(): Promise<unknown[]> { return []; }\n// Stub kept for compatibility',
       '§9.M18 a retired stub is restored with no caller         ⇒ §7.1 RED');

sec('§9.R — RESTORATION LEDGER');
const bad = ledger.filter((l) => !l.restored);
ok(`§9.R every mutated file restored byte-identical (${ledger.length} mutations)`,
   bad.length === 0, bad.map((b) => b.rel).join(', '));

console.log('');
console.log('══════════════════════════════════════════════════════════════');
console.log(`tdw14_d4b_delegation: ${pass} passed, ${fail} failed`);
console.log(`  ${ledger.length} mutations across a process boundary, all restored`);
console.log(`VERDICT: ${fail === 0 ? 'GREEN' : 'RED'}`);
console.log('══════════════════════════════════════════════════════════════');
process.exit(fail === 0 ? 0 : 1);
