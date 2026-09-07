#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
// scripts/b57_contracts_wiring_bench.js — TDW_19 G3.2 pwa, the room and the leaf.
//
//   node scripts/b57_contracts_wiring_bench.js
//
// ═══ WHY THIS BENCH EXISTS — F-40.109's CLASS, CLOSED ══════════════════════
// G5.1 shipped `referralStampsForLeads` MOUNTED ON NO DOOR: a function the pwa was
// written to read, that the backend never sent, and that no cell noticed because
// every cell asserted the function's own behaviour rather than its REACHABILITY.
// The chair named the class and asked this delivery to close it for contracts.
//
// §1 is that cell: **every exported contract address in the API client has at least
// one caller in the app tree.** A door built with nothing calling it is not a
// feature, it is a claim — and it is exactly what `POST /compose`, `PATCH /fill`
// and both profile doors were between part 1 and part 2.
//
// BOTH-WAYS (non-vacuous by PRODUCTION mutation, never test setup):
//   §1  delete the `composeContract(` call from screen.tsx      → §1 flips RED
//   §2  point the picker at `fetchClients` instead of the typed  → §2 flips RED
//   §3  drop `verbatim`-class title-casing into the record       → §3 flips RED
//   §4  drop `include_cancelled=1` from the client                → §4 flips RED
//       ⚠ THE FIRST §4 MUTATION WAS BADLY CHOSEN AND IS RECORDED RATHER THAN
//       REPLACED QUIETLY: renaming ONE `fetchAllContracts` call site reddened
//       nothing, because the room has TWO (the effect and the refresh after a
//       send) and the surviving one satisfied the cell. The mutation that
//       removes the BEHAVIOUR is the query param, and that is the one driven.
//   §5  let `Mark Signed` render on a composed contract          → §5 flips RED
//   §6  add a tenth byte to SIGN_COPY                            → §6 flips RED
// Each is a real edit to a shipped file, reverted after.
//
// WHAT IT DOES NOT PROVE, NAMED SO IT IS NOT ASSUMED:
//   · that the doors WORK. This is a static read of the tree; the founder's card
//     is what turns a wired address into a witnessed one.
//   · anything about the rendered pixels. The ratified frames are the authority on
//     how the room looks and the founder's walk is what compares them (R-39.15).
//   · that `next build` passes. That gate runs on the founder's machine — this
//     container cannot fetch Google Fonts and the manifest says so.
// ══════════════════════════════════════════════════════════════════════════
'use strict';

const path = require('path');
const fs   = require('fs');
const ROOT = path.resolve(__dirname, '..');

let pass = 0, fail = 0;
const ok = (label, cond) => {
  if (cond) { pass++; console.log(`  PASS  ${label}`); }
  else      { fail++; console.log(`  FAIL  ${label}`); }
};
const section = (t) => console.log(`\n── ${t} ──`);
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

// Comments and their prose are stripped before any ABSENCE cell reads a file: a
// cell that fails because a file documents its own discipline punishes the
// discipline. b56 learned this the same way — on a red, not on a review.
const code = (rel) => read(rel)
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .replace(/(^|[^:])\/\/.*$/gm, '$1 ');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.next' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?)$/.test(e.name)) out.push(p);
  }
  return out;
}

const SCREEN = 'app/vendor/(shell)/contracts/screen.tsx';
const LEAF   = 'app/sign/[token]/page.tsx';
const COPY   = 'lib/public/signCopy.ts';
const API    = 'lib/vendor/api/vendor.ts';

// ══ §1 — EVERY CONTRACT ADDRESS HAS A CALLER (F-40.109's class) ════════════
section('1. no contract door is mounted on nothing');
{
  const api = read(API);
  // The exported names that address `/vendor/contracts` or `/sign`. Derived from
  // the FILE, never from a list kept beside it — a list is a second home for the
  // client's own surface and would go stale the first time a door is added.
  const EXPORTS = [];
  const re = /export (?:async )?function (\w+)\([^)]*\)[^{]*\{([\s\S]*?)\n\}/g;
  let m;
  while ((m = re.exec(api))) {
    const body = m[2];
    if (/\/api\/v2\/vendor\/contracts|\/api\/v2\/sign/.test(body)) EXPORTS.push(m[1]);
  }
  ok(`the client exposes contract addresses (found ${EXPORTS.length})`, EXPORTS.length >= 12);

  const appFiles = [
    ...walk(path.join(ROOT, 'app')),
    ...walk(path.join(ROOT, 'components')),
    ...walk(path.join(ROOT, 'hooks')),
  ].filter((f) => !f.endsWith(path.join('api', 'vendor.ts')));
  const appSrc = appFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n');

  const orphans = EXPORTS.filter((name) => !new RegExp(`\\b${name}\\s*\\(`).test(appSrc));
  ok(`every one of them has a caller (orphans: ${orphans.join(', ') || 'none'})`, orphans.length === 0);
}

// ══ §2 — THE COMPOSER READS THE TYPED PLANE, NOT THE BINDER PLANE ══════════
section('2. two planes, two id spaces, one word');
{
  const src = code(SCREEN);
  ok('the picker calls fetchTypedClients', /fetchTypedClients\s*\(/.test(src));
  // ⚠ `fetchClients` maps BINDER ids out of `engine.records` and `POST /compose`
  // looks its id up in `public.clients`. Every row would 404 — silently, because
  // the door returns a clean "Client not found." that reads like a data problem.
  ok('the picker does NOT call fetchClients', !/[^d]fetchClients\s*\(/.test(src));
  ok('and the API client says why, at the function', /BINDER id/.test(read(API)));
}

// ══ §2b — THE PICKER'S THREE STATES AND THE UNION (F-40.138/.140) ══════════
section('2b. in flight, failed and empty are three different sentences');
{
  const src = code(SCREEN);
  // ⚠ THE KEY, NOT THE WORD. `Loading…` is unchanged; what it is keyed on is the
  // whole finding. The first cut rendered it whenever `clients.length === 0`, so
  // the walk saw a spinner while the truth was an empty plane.
  ok('a named state exists', /pickState/.test(src));
  ok('loading is keyed on state, never on length',
     /pickState === 'loading'[\s\S]{0,140}Loading/.test(src));
  ok('failed has its OWN sentence', /pickState === 'failed'[\s\S]{0,220}couldn[\s\S]{0,30}load your clients/.test(src));
  ok('empty has its own, and it is reached only after ready',
     /clients\.length === 0[\s\S]{0,240}No one to choose from yet/.test(src));
  // The three must be distinguishable BY CONSTRUCTION: no two may share a branch.
  //
  // ── AMENDED WITH THE CURE — R-38.19, SECOND SPECIMEN THIS PACKET ─────────
  // ⚠ THIS CELL COUNTED ACROSS THE WHOLE FILE AND MEANT A PROPERTY OF ONE
  // SHEET. It read `=== 3` over the room entire, so it was green only while the
  // picker was the only surface in the room with three states. Sitting 2 gave
  // the profile sheet and the annex chooser their own three, each with its own
  // `Loading&#8230;`, and the count went to five — a RED that says nothing about
  // the picker, which is unchanged.
  //
  // This is the file's own recorded lesson arriving a third time: *a window is a
  // guess about formatting; this is a statement about the branch.* A global
  // ── RE-CUT AT G3.2 s3 (R-40.120): the founder's veto on the prototype supersedes the byte pinned here; the mechanism is asserted in the replaced room's shape.
  const picker = src.slice(src.indexOf('function Pick()'), src.indexOf('function Record()'));
  ok('the picker block is found', picker.length > 200);
  ok('the three sentences are three branches, inside the picker',
     (picker.match(/Loading…|couldn’t load your clients|No one to choose from yet/g) || []).length === 3);


  // ── THE UNION — R-G32.17 ────────────────────────────────────────────────
  ok('the picker reads the Cabinet too', /fetchCabinet\s*\(/.test(src));
  ok('and both reads must succeed or it is FAILED',
     /!typed\.ok \|\| !cab\.ok[\s\S]{0,80}'failed'/.test(src));
  // ⚠ DEDUP ON PHONE, matching resolveOrCreateClient's own key. A person in both
  // homes appears once, marked Client, because picking her adds nothing.
  ok('deduped on phone', /seen\.has\(phone\)/.test(src));
  ok('a nameless binder names nobody', /if \(!name\) return;/.test(src));
  // R5/R6 — the origin mark, which is where the ruling's visibility lives.
  ok('every row is marked Client or Cabinet', /'Client' : 'Cabinet'/.test(src));

  // ── R7 IS THE SERVER'S FACT, NOT THE ROW'S ORIGIN ───────────────────────
  // The resolver dedups, so a binder pick for someone already a client creates
  // nothing — and the confirmation must not appear. Keying R7 on
  // `row.from === 'cabinet'` would be a true-LOOKING sentence about a thing that
  // did not happen.
  ok('the promotion line is keyed on the response', /setPromoted\(r\.promoted === true\)/.test(src));
  ok("and NOT on the row's origin", !/promoted[\s\S]{0,40}from === 'cabinet'/.test(src));
  ok('R7 renders only when promoted', /\{promoted &&[\s\S]{0,200}Added to your clients\./.test(src));
}

// ══ §3 — A VENDOR'S OWN WORDS ARE NOT TITLE-CASED (F-40.119's estate rule) ═
section("3. the record renders prose as prose");
{
  const src = code(SCREEN);
  // G5.1 micro 1 cured `cap()` title-casing a person's sentences, estate-wide, by
  // putting a `verbatim` flag on the ROW. This room renders through no `cap()` at
  // all, so it is satisfied BY CONSTRUCTION — and this cell is what keeps it that
  // way when a later seat moves the room onto `SliceRow`.
  ok('the room calls no cap()', !/\bcap\s*\(/.test(src));
  ok('and no toUpperCase on a value', !/\{\s*\w+\.(title|notes|name)\s*\.toUpperCase/.test(src));
  // The state chip IS title-cased, and correctly: it is a TOKEN, not a sentence.
  ok('the state word is a positive list, not a transform', /const STATE_WORD/.test(src));
  ok("and it has all four and no default that assumes", /draft: 'Draft'[\s\S]{0,90}cancelled: 'Cancelled'/.test(src));
}

// ══ §4 — THE ROOM SHOWS ALL FOUR STATES (F-40.115) ═════════════════════════
section('4. cancelled is drawn, at the foot');
{
  const src = code(SCREEN);
  ok('the room asks for all four', /fetchAllContracts\s*\(/.test(src));
  ok('the client sends include_cancelled', /include_cancelled=1/.test(code(API)));
  // ⚠ AND THE DEFAULT IS UNCHANGED FOR EVERY OTHER CALLER. `fetchContracts` still
  // exists and still hides cancelled rows; widening it would have put cancelled
  // contracts into surfaces that never asked for them.
  // ⚠ `fetchContracts` RETIRED WITH ITS READER, and this cell moved with it.
  // §1 found it orphaned on its first run — the room reads `fetchAllContracts`
  // now and nothing else called it. The DOOR's default is what must not widen,
  // and that is asserted on the dream-os side by b56; here the cell asserts the
  // client no longer carries a name with no reader.
  ok('no orphan default-list function is left behind', !/export function fetchContracts\b/.test(code(API)));
}

// ══ §5 — F12's REFUSAL (R-G32.14) ══════════════════════════════════════════
section('5. Mark Signed is for an uploaded contract');
{
  const src = code(SCREEN);
  ok('the composed test exists as a function', /function isComposed/.test(src));
  // ⚠ A FACT, NOT A HEURISTIC: a composed contract has a deposit percentage and
  // an uploaded one cannot — `composeContract` is the only writer that sets it.
  ok('and it reads deposit_pct, not the title', /isComposed[\s\S]{0,200}deposit_pct/.test(src));
  // ⚠ THE WINDOW WAS 400 AND THE GATE SITS 600 CHARACTERS FROM ITS LABEL —
  // the cell reddened on its own regex, not on the code, and widening it to fit
  // would have been tuning a cell to a tree. It is rewritten to assert the FACT
  // instead: the button's JSX block opens on the negated gate. A window is a
  // guess about formatting; this is a statement about the branch.
  // ── RE-CUT AT G3.2 s3 (R-40.120): the founder's veto on the prototype supersedes the byte pinned here; the mechanism is asserted in the replaced room's shape.
  const markSigned = src.slice(0, src.indexOf('Mark as signed'));
  const lastGate = markSigned.lastIndexOf('isComposed(selected)');
  ok('Mark Signed is gated on !isComposed',
     lastGate > 0 && markSigned.slice(lastGate - 1, lastGate) === '!');
  ok('the refusal is a SENTENCE, not a greyed button',
     /isComposed\(selected\)[\s\S]{0,600}Mark signed is for a contract you uploaded\./.test(src));
}

// ══ §6 — THE COUPLE'S LEAF ═════════════════════════════════════════════════
section('6. the fourth capability leaf');
{
  const leaf = code(LEAF);
  const copy = read(COPY);
  // THE SET IS CLOSED AT NINE. `consentCopy.ts` states this law for its six and
  // this file inherits it: a byte the build discovers it needs is a RAISED FORK.
  const keys = (copy.match(/^  \w+:/gm) || []).length;
  ok(`SIGN_COPY holds exactly nine bytes (found ${keys})`, keys === 9);
  // ⚠ THE DEAD-TOKEN SENTENCE IS NOT HERE. F-40.40 hoisted it to token.ts and a
  // copy in this file would be the fourth occurrence that hoist exists to end.
  ok('no dead-link byte is re-authored in signCopy', !/isn.t active/.test(copy));
  ok('the leaf imports it from token.ts', /TOKEN_DEAD_LINK/.test(leaf));
  // TERMINAL. `/consent/` keeps a reversal alive and is right to; a signature is
  // not a switch, and clause 5 is how this agreement is undone.
  ok('the leaf offers no un-sign control', !/withdraw|take it down|unsign/i.test(leaf));
  // NOTHING IS PERSISTED. The token in the URL is the whole credential.
  ok('no localStorage anywhere in the lane', !/localStorage|sessionStorage/.test(leaf));
  // Row 59 is v3 clause 12's own words and is not the surface's to change.
  ok("the affirmative is clause 12's `I agree`", /agree: 'I agree'/.test(copy));
}

// ══ §6b — F-40.152/.153/.154 · WHAT THE WALK FOUND ═════════════════════════
section('6b. preview, the one mandatory field, and the dynamic viewport');
{
  const src = code(SCREEN);
  const api = code(API);

  // ── F-40.152 · A NEW TAB CARRIES NO JWT ─────────────────────────────────
  // The first cut opened the door's own address with `window.open()`. Every press
  // returned `no_token` and the button had never rendered a document. No cell saw
  // it because every cell asserted this estate's behaviour and not the browser's.
  ok('the room asks the door for a url', /requestContractPreview\s*\(/.test(src));
  ok('and there is no url BUILDER left', !/contractPreviewUrl/.test(src + api));
  ok('the door address is never opened directly',
     !/window\.open\([^)]*\/preview/.test(src));
  ok('what is opened is the SIGNED url the door returned',
     /window\.open\(\(res as \{ pdf_url: string \}\)\.pdf_url/.test(src));

  // ── F-40.153 / R-40.74 · ONE MANDATORY FIELD, AND SEND BY PRESENCE ───────
  // ── RE-CUT AT G3.2 s3 (R-40.120): the founder's veto on the prototype supersedes the byte pinned here; the mechanism is asserted in the replaced room's shape.
  ok('the record asks for her number', /label="WhatsApp number"/.test(src));
  ok('the mark names the ACT, not a rule', /'Needed to send'/.test(src));
  // ⚠ EXACTLY ONE MARK ON THE WHOLE RECORD. v3's blanks print as blanks by the
  // register's §4 rule 3; a second `required` would be the form arguing with the
  // instrument. This cell reds the day someone adds one.
  // ── RE-CUT AT G3.2 s3 (R-40.120): the founder's veto on the prototype supersedes the byte pinned here; the mechanism is asserted in the replaced room's shape.
  // Two rows carry the mark on the prototype — the number and the fee — and each names the ACT and nothing else.
  // ── RE-CUT AT G3.2 s3 packet 4 (R-40.124 / R-40.125): the Needed list is filled inline; a policy blank is one field.
  ok('every required mark names the act', (src.match(/required=\{[^}]*\}/g) || []).every(m => /'Needed to send'|need\b/.test(m)));
  ok('no asterisk anywhere near it', !/Her number[\s\S]{0,120}\*/.test(src));

  // ⚠ THE CHAIR'S P4 — **ABSENT, NEVER GREYED.** This arc has refused the greyed
  // control six times. A refusal drawn as something tappable is worse than no
  // control; the line stands where the button would be.
  // ⚠ **F-40.161's SECOND HALF — THE GATE AND THE DOOR MUST CONSULT ONE SOURCE.**
  // The first cut gated Send on `phone`, the INPUT. Typing a number summoned the
  // button; the door reads the ROW and answered `No number to send to.` A control
  // whose condition and whose door look at different things lies about itself.
  // ── AMENDED WITH THE CURE — R-38.19, THIRD SPECIMEN THIS PACKET ─────────
  // ⚠ THE PROPERTY IS UNCHANGED AND THE GATE IS WIDER. F-40.161's finding was
  // that Send consulted the INPUT BOX while the door consulted the ROW. The
  // cure was `savedPhone`; sitting 2 keeps `savedPhone` and adds the other five
  // required fields, through the same `requiredRows` the preview reads, because
  // two Sends with two conditions is one act with two opinions. So the cell now
  // asserts the ROW-not-input property directly — which is what it always meant
  // — and the six-field gate is asserted at §9d.
  // Amended at R-G32.21: the call gained the delivery basis, so the checklist
  // asks for five rows on an on-the-day trade and six on a days trade. The
  // property is unchanged — `savedPhone`, never the input box.
  ok('Send still consults the ROW and never the input box',
     /requiredRows\(c, terms, depositPct, savedPhone, p, basis\)/.test(src));   // s3: one Send surface
  ok('and `phone` is nowhere in a Send condition', !/\{phone\.trim\(\) \?/.test(src));
  ok('and NOT on what she is typing', !/\{phone\.trim\(\) \?/.test(src));
  // ⚠ AND THE SEED READS THE CLIENT, NOT THE PICKER'S ARRAY. `clients` is filled
  // only by `openPicker`; a record opened from the LIST found it empty, so the
  // field read `Not filled` whatever the row held.
  ok('the record seeds the number from the client', /loadClientPhone\s*\(/.test(src));
  ok('and no longer from the picker rows',
     !/setPhone\(clients\.find/.test(src));
  ok('savedPhone advances only after the door says yes',
     /setSavedPhone\(phone\.trim\(\)\);/.test(src) && !/onChange[\s\S]{0,60}setSavedPhone/.test(src));
  // ── RE-CUT AT G3.2 s3 (R-40.120): the founder's veto on the prototype supersedes the byte pinned here; the mechanism is asserted in the replaced room's shape.
  ok('and the list stands where the button would be',
     /Before you can send[\s\S]{0,700}Fill these and the send button appears here\./.test(src));
  ok('Send is never rendered disabled-and-greyed on the record',
     !/disabled=\{!phone|opacity: *\.5[\s\S]{0,80}Send to the couple/.test(src));

  // ⚠ THE NUMBER'S HOME IS THE CLIENT, NOT THE CONTRACT.
  ok('the phone writes through the client door', /updateClientPhone\s*\(/.test(src));
  ok('and never into terms', !/terms[\s\S]{0,40}phone/.test(src));
  // The comparison moved from `known` (the picker array, often empty) to
  // `savedPhone` (what the row holds) with F-40.161. The cell follows the fact.
  ok('only when it actually changed', /phone\.trim\(\) !== savedPhone\.trim\(\)/.test(src));
  // The door returns 409 PHONE_COLLISION for a number already on another client.
  ok('the client door path is /clients/:clientId, not /:vendorId/:clientId',
     /\/api\/v2\/vendor\/clients\/\$\{clientId\}/.test(api));

  // ── F-40.154 · THE DYNAMIC VIEWPORT ─────────────────────────────────────
  // ── AMENDED WITH THE CURE — the count is THREE now, and it is a count on
  // purpose. F-40.154 is not a property of two named sheets; it is that EVERY
  // full-cover sheet in this room is bounded in the DYNAMIC viewport, so the
  // foot stays reachable when the browser bar appears. The profile sheet is the
  // longest of the three — twenty-eight rows over a Save — so it is the one this
  // rule protects most and the one a `vh` literal would hurt worst. The number
  // rises with the sheets by design; the cell beneath it is what forbids `vh`.
  // ── RE-CUT AT G3.2 s3 (R-40.120): the founder's veto on the prototype supersedes the byte pinned here; the mechanism is asserted in the replaced room's shape.
  ok('every sheet is bounded in dvh — one SHEET home', (src.match(/maxHeight: '\d+dvh'/g) || []).length === 1 && /const SHEET[\s\S]{0,160}maxHeight: '82dvh'/.test(src));
  ok('no vh literal survives in this room', !/maxHeight: '\d+vh'/.test(src));
  ok('the record sheet no longer stretches to a wrong height', !/alignItems: 'stretch'/.test(src));
}

// ══ §7 — THE HUB ROW, AND THE FRAMES THAT ARE NOT RE-SHOT ══════════════════
section('7. the fourth of nine opens');
{
  const hub = code('app/vendor/(shell)/support/page.tsx');
  // ── AMENDED WITH THE CURE, IN THE SAME PACKET — F-40.170 / R-38.19 ───────
  // ⚠ THESE TWO CELLS ASSERTED THE SPELLING THE CURE RETIRES, and that is the
  // exact shape R-38.19 was written about: an R-38.1 cure replaced a literal
  // with `roomHref`, a floor bench asserted the retired spelling, and the bench
  // went red WITH the cure and shipped, because the handover's floor line had
  // been derived before the cure existed. Named here rather than quietly
  // rewritten, so a reader can see the cell moved because the fact moved.
  //
  // The property is unchanged and is if anything stronger: the hub still holds
  // no literal address, and the address still has exactly one home — it is now
  // the REGISTRY, which is where a registry room's address belongs.
  ok('the map gains one entry', /contracts:\s*roomHref\('contracts'\)/.test(hub));
  ok('and no literal address', !/'\/vendor\/contracts'/.test(hub));
  ok('and no second home for it in routes.ts either',
     !/CONTRACTS_HREF/.test(code('lib/solutions/routes.ts')));
  // ⚠ THE ADDRESS MUST STILL RESOLVE, AND A DELETED CONSTANT IS NOT A DELETED
  // ROOM. Without this the two cells above would both pass on a tree where the
  // registry entry had been removed too — the hub would read `roomHref` of
  // nothing, which returns `/vendor/rooms` QUIETLY BY DESIGN, and the fourth of
  // the nine would silently point at the directory.
  ok('the registry still owns /vendor/contracts',
     /id: 'contracts'[\s\S]{0,120}href: '\/vendor\/contracts'/.test(code('lib/worklist/rooms.ts')));
  // ⚠ R-40.61 / F-40.126 — HUB FRAMES ARE FROZEN AS DRAWN AT THEIR DATE.
  // `G5-hub`, `R5-hub`, `W5-hub` and `W5-hub-today` all draw a hub where
  // Contracts reads `Coming`. They are NOT re-shot, now or on any future room
  // flip: the chip is DERIVED from `ROOM_HREFS`, and a ratified frame is a record
  // of a decision rather than a live view (R-39.15). This cell asserts the
  // freeze rather than the staleness — it reds if someone re-shoots them into
  // this delivery, which is the mistake the ruling exists to prevent.
  const frames = ['google-reviews-mock', 'referrals-mock', 'wedding-pages-mock'];
  ok('no other seat\u2019s hub frame is touched by this delivery',
     frames.every((f) => fs.existsSync(path.join(ROOT, 'docs/mocks', `${f}.html`))));
}

// ══ §8 — THE PROFILE SHEET AND THE ANNEX CHOOSER (sitting 2) ═══════════════
//
// BOTH-WAYS, by PRODUCTION mutation:
//   §8a  delete the `fetchContractProfile(` call from screen.tsx  → §1 AND §8a red
//   §8b  restore the seven-name ANNEXES literal to screen.tsx     → §8b flips RED
//   §8c  key the annex surface on `offered.length` not `mapped`   → §8c flips RED
//   §8d  make the profile sheet render on `Object.keys().length`  → §8d flips RED
section('8. her policies are asked once, and the annexes have one home');
{
  const src = code(SCREEN);
  const api = code(API);

  // ── §8a · THE ORPHAN CLOSES ─────────────────────────────────────────────
  // ⚠ THIS IS THE ONE ADDRESS IN THE ARC §1 COULD NOT POLICE. Both profile
  // doors shipped in dream-os at sitting 1 with NO pwa caller — a declared
  // server-side orphan, named in the client so it would not be discovered as a
  // defect. §1 walks the app tree for callers of every exported contract
  // address, so from this cut the two are inside its census by construction and
  // this cell is the statement that they arrived deliberately.
  ok('the client ships a profile reader', /export function fetchContractProfile/.test(api));
  ok('and a profile writer',              /export function saveContractProfile/.test(api));
  ok('the room reads her policies',       /fetchContractProfile\s*\(/.test(src));
  ok('and writes them',                   /saveContractProfile\s*\(/.test(src));
  ok('the not-shipped declaration is gone', !/NOT SHIPPED/.test(api));
  // ⚠ THE WHOLE OBJECT, EVERY TIME. The door upserts `fields` wholesale and does
  // not merge, so a partial write would silently drop every key it omitted.
  ok('there is no partial profile writer', !/patchContractProfile/.test(api));

  // ── §8a2 · TWENTY-EIGHT LABELS, SIX SECTIONS, AND NOT ONE VALUE ─────────
  const secs = (src.match(/head: '/g) || []).length;
  ok(`the sheet declares its sections (found ${secs})`, secs === 7);
  // ⚠ SCOPED TO THE TABLE, NOT COUNTED ACROSS THE FILE — the third time this
  // packet that a global count meant a local property. `CLAUSE_SWITCHES` has the
  // same `{ key, label }` shape, so a file-wide match reads 34 and says nothing
  // about the profile sheet. The slice is the declaration's own body.
  const profTable = src.slice(src.indexOf('const PROFILE_SECTIONS'), src.indexOf('function slabLabels'));
  ok('the profile table is found', profTable.length > 400);
  const rows = (profTable.match(/\{ key: '[a-z0-9_]+',\s*label: '/g) || []).length;
  ok(`twenty-eight labels stand over twenty-eight tokens (found ${rows})`, rows === 28);
  // ⚠ THE TOKEN NAMES ARE THE INSTRUMENT'S AND A VENDOR NEVER MEETS ONE. The
  // register says so at Q6; this cell is what keeps a later seat from using a
  // token as a label because it was to hand.
  ok('no register token leaks into a label',
     !/label: '(cancel_tier|late_interest|fm_window|overtime_|postpone_)/.test(src));
  // The two the renderer already reads off this exact object — the proof the
  // shape belongs to the estate and not to this file.
  ok("the tax pair carries the renderer's own key names",
     /key: 'gst_treatment'/.test(src) && /key: 'gst_pct'/.test(src));
  ok('the sheet has its own title and its Save', /Your policies/.test(src) && /Save my policies/.test(src));
  // ⚠ Q9 POINTS AT SETTINGS. `vendors.gstin` has one home already.
  // ── RE-CUT AT G3.2 s3 (R-40.120): the founder's veto on the prototype supersedes the byte pinned here; the mechanism is asserted in the replaced room's shape.
  ok('the tax note points at Settings, not at itself',
     /Your GSTIN lives in Settings\. Add it there and the tax clause prints\./.test(src));

  // ── §8b · THE ANNEX HEADINGS HAVE ONE HOME, AND IT IS NOT HERE ──────────
  // ⚠ THE LITERAL THIS CELL FORBIDS CARRIED A COMMENT SAYING IT SHOULD NOT
  // EXIST. Seven names, typed here and again at `contractPdf.js:535`, in a file
  // whose own note read *a name typed twice would be two homes for one heading*.
  // Ruling F8 collapsed both into `src/lib/contractAnnex.js`.
  ok('the room types no annex heading', !/Photography and film/.test(src));
  ok('and holds no annex key list',     !/key: 'a', label:/.test(src));
  ok('it asks the door instead',        /fetchAnnexMap\s*\(/.test(src));
  ok('the client addresses the map door', /\/api\/v2\/vendor\/contracts\/annex-map/.test(api));
  // ⚠ AND THE DOOR TAKES NO CONTRACT ID. The map is a fact about the estate, not
  // about a contract; one that arrived per-contract would read as a property OF
  // that contract.
  ok('the map read is not keyed on a contract',
     /export function fetchAnnexMap\(\)/.test(api));

  // ── §8c · `mapped` IS READ, NEVER INFERRED FROM A LENGTH ────────────────
  // ⚠ THE DOOR RETURNS ALL SEVEN IN `offered` FOR AN UNMAPPED VENDOR TOO, so a
  // length here reads 7 for the vendor whose trade we know and 7 for the vendor
  // whose trade we do not — and draws the wrong surface for one of them. This is
  // F-40.138's whole class, one plane over, and the door returns `mapped`
  // precisely so this room never has to guess.
  ok('the surface branches on the door\u2019s own flag', /annexMap\.mapped/.test(src));
  ok('and never on the length of what it sent',
     !/offered\.length\s*[><=]/.test(src) && !/others\.length === 0/.test(src));
  // The two heads, and the unmapped surface has ONE — not a mapped surface with
  // an empty first section, which is a section head standing over nothing.
  // ── RE-CUT AT G3.2 s3 (R-40.120): the founder's veto on the prototype supersedes the byte pinned here; the mechanism is asserted in the replaced room's shape.
  ok('the unmapped surface is its own branch on the door\u2019s flag', /annexMap\.mapped \? \(/.test(src));
  ok('and it says what we do not know, not what she failed to do',
     /We don’t have your trade on file yet/.test(src));

  // ── §8d · THREE STATES, TWICE, AND `{}` IS NOT ONE OF THEM ─────────────
  // ⚠ AN EMPTY PROFILE IS THE COMMONEST LEGAL ANSWER THIS DOOR GIVES. A vendor
  // who has never opened the sheet has `{}`, and that is READY. Keying the sheet
  // on `Object.keys(profile).length` would put F-40.138 back with a new object.
  ok('the profile sheet has a named state',  /profileState/.test(src));
  ok('and the annex surface has its own',    /annexState/.test(src));
  for (const [name, st] of [['profile', 'profileState'], ['annex', 'annexState']]) {
    ok(`${name}: loading is keyed on state`, new RegExp(st + " === 'loading'").test(src));
    ok(`${name}: failed has its own sentence`, new RegExp(st + " === 'failed'").test(src));
    ok(`${name}: ready is a third branch`,     new RegExp(st + " === 'ready'").test(src));
  }
  ok('an empty profile is never treated as a failure',
     !/Object\.keys\(profile\)\.length/.test(src));
  // ⚠ NO FALLBACK LIST ON A FAILED MAP READ. The room can no longer answer from
  // memory, and that is the property: a guessed list and a failed read would be
  // the same picture on her screen.
  ok('a failed map read draws no annexes', !/annexState === 'failed'[\s\S]{0,200}AnnexRow/.test(src));

  // ── §8e · THE SWITCH SAVES ON THE TAP, AND CHECKS THE ANSWER ───────────
  // The storefront switch's posture verbatim: optimistic, revert on refusal,
  // and the DOOR'S ECHO in state rather than the value we sent (F-40.180).
  // ── RE-CUT AT G3.2 s3 (R-40.120): the founder's veto on the prototype supersedes the byte pinned here; the mechanism is asserted in the replaced room's shape.
  ok('an annex tap writes through /fill', /toggleAnnex[\s\S]{0,400}await fill\(/.test(src) && /async function fill\([\s\S]{0,400}fillContract\s*\(/.test(src));
  ok('and reverts on a refusal',          /toggleAnnex[\s\S]{0,400}\(\) => setAnnexes\(prev\)/.test(src));
  ok('and lands the door\u2019s echo, not our own object',
     /setAnnexes\(c\.annexes \?\? \{\}\)/.test(src));

  // ── §8f · THE MOCK'S COUPLE IS NOT EVERY COUPLE ────────────────────────
  // ⚠ THE RATIFIED SENTENCES NAME 「Priya」 BECAUSE A MOCK HAS ONE COUPLE. A room
  // has all of them, and a hardcoded name on a vendor's screen is the costume
  // class wearing a first name.
  ok('no ratified mock name is shipped as a byte', !/what Priya signs/.test(src));
  ok('the name comes from the row', /clientFirstName/.test(src));
}

// ══ §9 — THE TAILORING SURFACES (T1, T3) ══════════════════════════════════
//
// BOTH-WAYS, by PRODUCTION mutation:
//   §9a  add `publication` to CLAUSE_SWITCHES                    → §9a flips RED
//   §9b  default the switches OFF (`=== true`)                   → §9b flips RED
//   §9c  draw clause 5's row unconditionally                     → §9c flips RED
//   §9d  render a disabled Send instead of the line              → §9d flips RED
section('9. what she sends, and what refuses');
{
  const src = code(SCREEN);

  // ── §9a · THE KEYS ARE THE RENDERER'S, READ NOT AGREED ──────────────────
  // ⚠ SIX, IN THE RENDERER'S OWN ORDER, AT `contract.terms.clauses.<key>`. A key
  // spelled differently on this plane would be a switch a vendor moves and a
  // document that never notices — and nothing would go red, because each side
  // would be internally consistent. That is the whole reason this cell names the
  // strings instead of counting them.
  for (const k of ['accommodation', 'late_payment', 'extra_hours', 'tax_block',
                   'named_professional', 'portfolio_use']) {
    ok(`the switch \`${k}\` carries the renderer's key`, new RegExp(`key: '${k}'`).test(src));
  }
  ok('and they are written under terms.clauses', /terms\.clauses|clauses\[key\]/.test(src));

  // ── CLAUSE 10 HAS NO SWITCH AND MUST NEVER GAIN ONE ────────────────────
  // ⚠ A VENDOR'S TOGGLE GOVERNS WHETHER A CLAUSE IS PRINTED, NEVER WHETHER THE
  // CLIENT'S CONSENT IS ON. `publication` is absent from the renderer's
  // `CLAUSE_SWITCHES` by the same law and `b56` reds on the twin mutation.
  ok('publication is not a switch here either', !/'publication'/.test(src));
  // ── RE-CUT AT G3.2 s3 (R-40.120): the founder's veto on the prototype supersedes the byte pinned here; the mechanism is asserted in the replaced room's shape.
  ok('and the row that says so is drawn', /The wedding page isn’t a switch here/.test(src));
  // Row 18 AND row 22 — the repetition is ruling F6 and is deliberate.
  // ── RE-CUT AT G3.2 s3 (R-40.120): the founder's veto on the prototype supersedes the byte pinned here; the mechanism is asserted in the replaced room's shape.
  ok('the law is said at the top as well', /Everything else always prints\./.test(src));

  // ── §9b · ABSENT MEANS ON ──────────────────────────────────────────────
  // ⚠ THE RENDERER READS `!== false`. A default of off on this plane would make
  // her contract quietly thinner than the surface she reviewed, and neither side
  // would report anything.
  ok('an untouched switch reads ON', /s\[key\] !== false/.test(src));
  ok('and the toggle stores a boolean, never a delete',
     /clauses\[key\] = !switchOn\(terms, key\)/.test(src));
  // ── RE-CUT AT G3.2 s3 (R-40.120): the founder's veto on the prototype supersedes the byte pinned here; the mechanism is asserted in the replaced room's shape.
  ok('the clause write goes through /fill', /toggleClause[\s\S]{0,600}await fill\(/.test(src));
  ok('and reverts on a refusal',           /toggleClause[\s\S]{0,600}\(\) => setTerms\(prev\)/.test(src));

  // ── §9c · A SWITCH MAY CLOSE AN OPEN GATE AND NEVER OPEN A SHUT ONE ────
  // ⚠ AN IN-CITY WEDDING PRINTS NO CLAUSE 5 WHATEVER THE SWITCH SAYS, so a row
  // drawn there is a control with no effect — the thing this arc has refused
  // seven times. The gate is a FACT about the functions; the switch is a waiver.
  ok('clause 5 has a gate', /function outstationGate/.test(src));
  ok('the row is absent when the gate is shut',
     /accommodation' && !outstationGate\(terms, vendorCity\)\) return null/.test(src));
  // ⚠ THE GATE READS THE SAME TWO FACTS THE RENDERER READS — `terms.functions`
  // keyed by event id with `city`, against `vendors.city`. A gate built on the
  // record's own `terms.city` would answer a different question.
  ok('and it compares the functions against her city',
     /terms\.functions[\s\S]{0,400}vendorCity/.test(src));
  // A blank base city means the room does not KNOW where she is, and an unknown
  // gate draws nothing rather than guessing open.
  ok('an unknown city leaves the gate shut', /if \(!base\) return false;/.test(src));

  // ── §9d · SEND IS ABSENT, NEVER GREYED (row 41, the chair's change) ────
  // ⚠ THE REGISTER NAMES SIX REQUIRED FIELDS AND THE CHECKLIST DRAWS SIX.
  const req = src.slice(src.indexOf('function requiredRows'), src.indexOf('type PickRow'));   // s3: the block ends where the picker's type begins
  ok('the checklist is found', req.length > 300);
  ok(`six required rows, no more and no fewer`, (req.match(/\{ key: '/g) || []).length === 6);
  // ── RE-CUT AT G3.2 s3 (R-40.120): the founder's veto on the prototype supersedes the byte pinned here; the mechanism is asserted in the replaced room's shape.
  ok('Send exists only when nothing is missing',
     /missing\.length \? \([\s\S]{0,1000}\) : \([\s\S]{0,700}Send to \{first\} on WhatsApp/.test(src));
  ok('and there is no disabled Send on the preview',
     !/disabled=\{missing|opacity: *\.5[\s\S]{0,120}Send to the couple/.test(src));
  // ⚠ A REFUSAL SENTENCE ONLY WHERE A RATIFIED BYTE EXISTS. The number has P4's
  // and the signatory has row 41's; the other four have none, and the checklist
  // has already said which row reads `Not filled`. Four invented sentences would
  // be four bytes nobody passed.
  // ── RE-CUT AT G3.2 s3 (R-40.120): the founder's veto on the prototype supersedes the byte pinned here; the mechanism is asserted in the replaced room's shape.
  // ── RE-CUT AT G3.2 s3 packet 4 (R-40.124 / R-40.125): the Needed list is filled inline; a policy blank is one field.
  ok('the missing rows are NAMED from requiredRows and drawn by ONE writer per key', /missing\.map\(r => neededField\(r\)\)/.test(src) && /function neededField\(r: RequiredRow\)[\s\S]{0,200}switch \(r\.key\)/.test(src));
  const refusals = new Set((src.match(/Add [^<]*to send this\.[^<]*/g) || []));
  ok(`no per-field refusal sentence survives (found ${refusals.size})`, refusals.size === 0);
}

// ══ §10 — THE SHEET AS A FORM (R-40.114/.116/.117, R-G32.21) ══════════════
//
// BOTH-WAYS, by PRODUCTION mutation:
//   10a  seeds layered OVER her answers instead of under  → §10a flips RED
//   10b  gst_treatment reverts to a text field            → §10b flips RED
//   10c  requiredRows stops reading the basis             → §10c flips RED
//   10d  the omitted rows are drawn anyway                → §10d flips RED
section('10. what the sheet opens with, and what it never assumes');
{
  const src = code(SCREEN);

  // ── §10a · A SEED IS UNDER HER ANSWER, NEVER OVER IT ───────────────────
  // ⚠ THE SPREAD ORDER IS THE WHOLE PROPERTY. A vendor who set `delivery_days`
  // to 20 must not reopen the sheet and find 45. Reversing these two braces is
  // a one-character edit that silently overwrites every policy she ever chose,
  // and nothing else in the estate would notice.
  ok('her stored answers win every collision', /\{ \.\.\.seedsNow, \.\.\.stored \}/.test(src));   // s3: the seeds are read at the sheet's open
  ok('and the seeds come from the door, not from this file',
     /annexMap\?\.defaults/.test(src) && !/delivery_days: '45'/.test(src));
  // ⚠ NOTHING IS WRITTEN UNTIL SHE PRESSES SAVE. The seeds live in local state.
  ok('no seed is posted on open', !/saveContractProfile\([\s\S]{0,80}seeds/.test(src));

  // ── §10b · THE MARKS, AND WHY PROVENANCE IS NOT DIFFED ────────────────
  // ⚠ `savedKeys` IS HELD, NOT DERIVED. A vendor whose answer HAPPENS to equal
  // the default would read `Default` if the mark were computed by comparing
  // values — and she chose it. Provenance is a fact about where a value came
  // from and cannot be recovered from the value.
  ok('the sheet tracks which keys the door returned', /savedKeys/.test(src));
  ok('and the mark is not a value comparison',
     !/=== *\(annexMap\?\.defaults[\s\S]{0,40}\) *\? *'Default'/.test(src));
  for (const m of ['Yours', 'Default', 'Needed']) {
    ok(`the mark \`${m}\` exists`, new RegExp(`'${m}'`).test(src));
  }

  // ── §10c · CLOSED VOCABULARIES ARE CONTROLS, NOT TEXT FIELDS ──────────
  // ⚠ CLAUSE 4.2 READS 「The fee is {gst_treatment} of goods and services tax」.
  // Only `inclusive` / `exclusive` complete that sentence; a typo omits the tax
  // block from a signed agreement and reports nothing.
  ok('gst_treatment is a closed vocabulary', /gst_treatment:\s*\[\['inclusive'/.test(src));
  // ── RE-CUT AT G3.2 s3 (R-40.120): the founder's veto on the prototype supersedes the byte pinned here; the mechanism is asserted in the replaced room's shape.
  ok('deposit_refundable is too',            /deposit_refundable:\s*\[\['no', 'No'\], \['yes'/.test(src));
  ok('and both render as a control',         /ChoiceRow/.test(src));
  // ⚠ THE KEY IS STORED AND THE LABEL IS READ. A control that stored 「Inclusive」
  // would put a capital I into clause 4.2.
  ok('the control stores the key, not the label', /onPick\(key\)/.test(src));
  // ⚠ AND THE GSTIN IS NEVER ASKED HERE. `vendor_gstin` is DERIVED from
  // `vendors.gstin` (register :134) — one home, in Settings.
  ok('the sheet does not ask for a GSTIN a second time',
     !/key: 'vendor_gstin'/.test(src) && !/key: 'gstin'/.test(src));
  // ── RE-CUT AT G3.2 s3 (R-40.120): the founder's veto on the prototype supersedes the byte pinned here; the mechanism is asserted in the replaced room's shape.
  ok('and the note points at Settings instead',
     /Your GSTIN lives in Settings\./.test(src));

  // ── §10d · PLACEHOLDERS ARE BYTES AND CARRY NOBODY'S NAME ─────────────
  ok('placeholders come from the door', /annexMap\?\.placeholders/.test(src));
  ok('and {name} is substituted from the session', /replace\('\{name\}', session\?\.name/.test(src));
  // The literal must never carry one vendor's name to another's screen.
  ok('no vendor name is hardcoded as a placeholder', !/e\.g\. Swati|e\.g\. Dev Roy/.test(src));

  // ── §10e · THE PER-TRADE OMISSION, AND THE LINE THAT EXPLAINS IT ──────
  // ── RE-CUT AT G3.2 s3 (R-40.120): the founder's veto on the prototype supersedes the byte pinned here; the mechanism is asserted in the replaced room's shape.
  ok('omitted rows are filtered out of the sheet',
     /const omitted = annexMap\?\.omitted \?\? \[\];[\s\S]{0,1600}\.filter\(r => !omitted\.includes\(r\.key\)\)/.test(src));
  ok('and the hint line stands where they were — in the plain register',
     /You deliver on the day, so there’s nothing to set here\./.test(src));
  ok('the line is gated on the basis, not on the omission list',
     /const basis = annexMap\?\.delivery_basis \?\? 'days'/.test(src) && /sec\.onTheDay && basis === 'on_the_day'/.test(src));


  // ── §10f · THE CHECKLIST FOLLOWS THE SHEET ───────────────────────────
  // ⚠ THE SHEET DOES NOT ASK, SO THE CHECKLIST MUST NOT DEMAND. A required row
  // that cannot be filled hides Send from every on-the-day vendor forever —
  // which is the failure that made R-40.117 unbuildable as first written.
  ok('requiredRows takes the basis', /deliveryBasis: 'days' \| 'on_the_day'/.test(src));
  ok('and drops Delivered within for an on-the-day trade',
     /deliveryBasis === 'on_the_day'[\s\S]{0,60}\? \[\]/.test(src));
  // ── RE-CUT AT G3.2 s3 (R-40.120): the founder's veto on the prototype supersedes the byte pinned here; the mechanism is asserted in the replaced room's shape.
  // ── RE-CUT AT G3.2 s3 packet 4 (R-40.124 / R-40.125): the Needed list is filled inline; a policy blank is one field.
  ok('every caller passes it — the Send surface and the record\u2019s policy card',
     (src.match(/requiredRows\(c, terms, depositPct, savedPhone, p, basis\)/g) || []).length === 2);

  // ── §10g · F-40.236 · THE HEADER DESCRIBES v4, NOT v3 ────────────────
  // ⚠ 「prints as a blank」 WAS TRUE OF v3, which printed `__________`. v4
  // retired BLANK to a tagged template that cannot render a missing field.
  ok('the superseded sentence is gone', !/prints as a blank/.test(src));
  // ── RE-CUT AT G3.2 s3 (R-40.120): the founder's veto on the prototype supersedes the byte pinned here; the mechanism is asserted in the replaced room's shape.
  ok('and the ruled one is there',
     /Anything you leave empty is left out of the agreement — nothing prints blank\./.test(src));

  // ── §10h · UNITS ON THE LABEL, NEVER IN THE VALUE — F-40.237 ─────────
  const units = (src.match(/unit: '/g) || []).length;
  ok(`seventeen rows carry a unit on the label (found ${units})`, units === 17);
  // ── RE-CUT AT G3.2 s3 (R-40.120): the founder's veto on the prototype supersedes the byte pinned here; the mechanism is asserted in the replaced room's shape.
  ok('and the unit is rendered beside the label',
     /unit=\{row\.unit\}/.test(src) && /\{unit \? <span/.test(src));
}

// ══ §11 — G3.2 SITTING 3: THE ROOM REPLACED TO THE PROTOTYPE (R-40.120 / R-40.101) ═══
//
// MUTATION PROOFS (run by hand at the seat, RED then GREEN):
//   11a open a URL literal instead of the door's pdf_url in doStandard   → 11a flips RED
//   11c drop manualFns from fnPlaces                                      → 11c flips RED
//   11d write overrides with saveContractProfile instead of fill         → 11d flips RED
//   11e remove the onBlur from the fee Field                              → 11e flips RED
//   11f route every composed contract to 'record' in openRecord          → 11f flips RED
//   11g rename the sheet's key back to travel_terms                       → 11g flips RED
section('11. sitting 3 — the room as a vendor uses it');
{
  const src = code(SCREEN);
  const api = code('lib/vendor/api/vendor.ts');
  // 9a · the policies card is first, and the standard agreement has a door
  ok('the room draws the policies card before the list', src.indexOf('Set up your contract policies') < src.indexOf('No agreements yet.'));
  ok('the card says set up or edit on a FACT', /policiesSet \? 'Edit' : 'Set up'/.test(src));
  ok('the api client has the standard door, with no id', /export function fetchStandardAgreement\(\): /.test(api) && /contracts\/standard'/.test(api));
  ok('the room asks the door and opens what it gets back', /fetchStandardAgreement\(\)[\s\S]{0,300}window\.open\(\(res as \{ pdf_url: string \}\)\.pdf_url/.test(src));
  ok('and never opens the door itself in a tab', !/window\.open\([^)]*contracts\/standard/.test(src));
  // 9b · someone new — a first-class door through the ONE promotion mechanism
  ok('a name and a number start an agreement', /async function doNewPerson\(\)[\s\S]{0,400}doCompose\(\{ key: 'n', id: null, name: n, phone: p/.test(src));
  ok('both are required', /if \(!n \|\| !p\) \{ show\('A name and a number are both needed\.'/.test(src));
  ok('the promotion is still the compose door\u2019s', /composeContract\(row\.id \? \{ client_id: row\.id \} : \{ name: row\.name, phone: row\.phone \}\)/.test(src));
  // 9c · functions on the record, counted at Send, read by the gate (F-40.243)
  ok('functions are written as terms.functions_manual through /fill', /functions_manual: \[\.\.\.manualFns\(terms\), \{[\s\S]{0,400}await fill\(\{ terms: next \}\)/.test(src));
  ok('a function needs a name and a date', /A function needs a name and a date\./.test(src));
  ok('the checklist counts manual rows too', /const n = fnPlaces\(terms\)\.length;/.test(src) && /function fnPlaces[\s\S]{0,300}\.\.\.manualFns\(terms\)/.test(src));
  ok('clause 5\u2019s gate reads the same list', /function outstationGate[\s\S]{0,200}fnPlaces\(terms\)\.some/.test(src));
  ok('the dead Venue/City pair is gone (F-40.242)', !/terms, venue:/.test(src) && !/terms, city:/.test(src));
  // 9d · this couple only — overrides live on the CONTRACT, the profile is untouched
  ok('overrides are written to terms.policy_overrides through /fill', /async function doSaveOverrides[\s\S]{0,300}policy_overrides: ov[\s\S]{0,200}await fill\(\{ terms: next \}\)/.test(src));
  ok('and never through the profile door', !/doSaveOverrides[\s\S]{0,500}saveContractProfile/.test(src));
  ok('the banner is the founder\u2019s byte', /These are your policies\. Change any of them here and it applies to this agreement only\./.test(src));
  ok('one sheet, two homes', /function PolicySheet\(\{ over \}/.test(src) && /PolicySheet\(\{ over: true \}\)/.test(src) && /PolicySheet\(\{ over: false \}\)/.test(src));
  // 9e · autosave on blur; nothing to lose on a scrim (F-40.246)
  ok('the fee saves on blur', /fee_total: v\.replace[\s\S]{0,80}onBlur=\{\(\) => void saveText\(\)\}/.test(src));
  ok('the number saves on blur, to the client', /onBlur=\{\(\) => void savePhone\(\)\}/.test(src));
  ok('Save and finish later has retired', !/Save and finish later/.test(src));
  ok('the record is a screen, not a sheet a scrim can close', !/onClick=\{\(\) => setRecord\(null\)\}/.test(src));
  // 9f · post-send states are reachable from the list (F-40.245)
  ok('a composed, non-draft contract opens on its status', /go\(isComposed\(c\) && c\.state !== 'draft' \? 'after' : 'record'\)/.test(src));
  ok('the list routes every composed row through openRecord', /isComposed\(c\) \? openRecord\(c\) : setSelected\(c\)/.test(src));
  ok('signed \u2192 deposit \u2192 the date is held are drawn there', /Mark the deposit received/.test(src) && /The date is held/.test(src));
  // 9g · register v3 on the surface
  ok('the sheet asks travel_and_stay_terms', /key: 'travel_and_stay_terms'/.test(src));
  ok('and none of the retired tokens', !/'travel_terms'|'same_venue'|key: 'rooms'/.test(src));
  ok('the progress thread is derived, no schema', /function stage\(c: Contract\)/.test(src) && /deposit_received_at/.test(src));
  // 9h · every row carries a meaning line
  const sheet = src.slice(src.indexOf('const PROFILE_SECTIONS'), src.indexOf('function slabLabels'));
  const rows = (sheet.match(/\{ key: '[a-z_0-9]+',\s+label: '[^']+'/g) || []).length;
  const whys = (sheet.match(/why: '[^']+'/g) || []).length;
  const blank = (sheet.match(/why: ''/g) || []).length;
  ok('every policy row carries a meaning line but the three slab continuations (' + whys + ' + ' + blank + ' of ' + rows + ')', rows === 28 && whys + blank === rows && blank === 3);
  ok('the on-the-day hint is in the plain register', /onTheDay: 'You deliver on the day/.test(src));
  // ── F-40.199's class, at scale (the founder's walk, 2026-09-07) — no escape survives in this file
  ok('no backslash-u escape survives anywhere in the room (JSX text and attributes do not interpret one)', !/\\u[0-9a-fA-F]{4}/.test(read(SCREEN)));
  ok('the apostrophe is the character itself where she reads it', /It’s saved on their client record/.test(src));
  // ── the missing rows take her to the fix
  // ── RE-CUT AT G3.2 s3 packet 4 (R-40.124 / R-40.125): the Needed list is filled inline; a policy blank is one field.
  ok('each missing row is filled where it is named (R-40.124)', /case 'fee':[\s\S]{0,300}onBlur=\{\(\) => void saveText\(\)\}/.test(src) && /case 'phone':[\s\S]{0,300}onBlur=\{\(\) => void savePhone\(\)\}/.test(src));
  ok('a policy blank is ONE field, saved as the merge on blur (R-40.125)', /async function savePolicyRow\(key: string, v: string\)[\s\S]{0,120}\{ \.\.\.seeds, \.\.\.profile, \[key\]: v \}/.test(src) && !/default: \{[\s\S]{0,600}openProfile\(/.test(src));
  ok('the per-couple policies are a card with one strong tap (R-40.126)', /Your policies for \{first\}<\/div>[\s\S]{0,900}style=\{\{ \.\.\.CTA, marginTop: 10 \}\}/.test(src) && /Still needed to send: /.test(src));
  ok('no Rs is prefixed beside formatRs (F-40.256)', !/Rs \$\{formatRs\(/.test(src));
  ok('and requiredRows says where each blank lives', /where: 'record' \| 'policies'/.test(src));
  // 9i · the mock is filed and the screens are called, not mounted
  ok('the ratified prototype is filed under docs/mocks (R-40.101)', fs.existsSync(path.join(ROOT, 'docs/mocks/G32_S3_PROTOTYPE.html')));
  ok('inner screens are called as functions, never mounted', /\{view === 'room' && Room\(\)\}/.test(src) && !/<Room \/>|<Record \/>|<Send \/>/.test(src));
}

console.log(`\n${pass}/${pass + fail} cells green.`);
process.exit(fail ? 1 : 0);
