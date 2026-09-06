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
  ok('the three sentences are three branches',
     (src.match(/Loading&#8230;|couldn&#8217;t load your clients|No one to choose from yet/g) || []).length === 3);

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
  const markSigned = src.slice(0, src.indexOf('Mark Signed'));
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
  ok('the record asks for her number', /label="Her number"/.test(src));
  ok('the mark names the ACT, not a rule', /required="Needed to send"/.test(src));
  // ⚠ EXACTLY ONE MARK ON THE WHOLE RECORD. v3's blanks print as blanks by the
  // register's §4 rule 3; a second `required` would be the form arguing with the
  // instrument. This cell reds the day someone adds one.
  ok('there is exactly ONE required mark', (src.match(/required="/g) || []).length === 1);
  ok('no asterisk anywhere near it', !/Her number[\s\S]{0,120}\*/.test(src));

  // ⚠ THE CHAIR'S P4 — **ABSENT, NEVER GREYED.** This arc has refused the greyed
  // control six times. A refusal drawn as something tappable is worse than no
  // control; the line stands where the button would be.
  // ⚠ **F-40.161's SECOND HALF — THE GATE AND THE DOOR MUST CONSULT ONE SOURCE.**
  // The first cut gated Send on `phone`, the INPUT. Typing a number summoned the
  // button; the door reads the ROW and answered `No number to send to.` A control
  // whose condition and whose door look at different things lies about itself.
  ok('Send appears only when the ROW has a number',
     /savedPhone\.trim\(\) \?[\s\S]{0,320}Send to the couple/.test(src));
  ok('and NOT on what she is typing', !/\{phone\.trim\(\) \?/.test(src));
  // ⚠ AND THE SEED READS THE CLIENT, NOT THE PICKER'S ARRAY. `clients` is filled
  // only by `openPicker`; a record opened from the LIST found it empty, so the
  // field read `Not filled` whatever the row held.
  ok('the record seeds the number from the client', /loadClientPhone\s*\(/.test(src));
  ok('and no longer from the picker rows',
     !/setPhone\(clients\.find/.test(src));
  ok('savedPhone advances only after the door says yes',
     /setSavedPhone\(phone\.trim\(\)\);/.test(src) && !/onChange[\s\S]{0,60}setSavedPhone/.test(src));
  ok('and the line stands where the button would be',
     /Add her number to send this\./.test(src));
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
  ok('both sheets are bounded in dvh', (src.match(/maxHeight: '\d+dvh'/g) || []).length === 2);
  ok('no vh literal survives in this room', !/maxHeight: '\d+vh'/.test(src));
  ok('the record sheet no longer stretches to a wrong height', !/alignItems: 'stretch'/.test(src));
}

// ══ §7 — THE HUB ROW, AND THE FRAMES THAT ARE NOT RE-SHOT ══════════════════
section('7. the fourth of nine opens');
{
  const hub = code('app/vendor/(shell)/support/page.tsx');
  ok('the map gains one entry', /contracts:\s*CONTRACTS_HREF/.test(hub));
  ok('and no literal address', !/'\/vendor\/contracts'/.test(hub));
  ok('the address lives in routes.ts', /CONTRACTS_HREF = '\/vendor\/contracts'/.test(code('lib/solutions/routes.ts')));
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

console.log(`\n${pass}/${pass + fail} cells green.`);
process.exit(fail ? 1 : 0);
