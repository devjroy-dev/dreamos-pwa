#!/usr/bin/env node
// scripts/b05_f0589_pwa_name_wire_bench.js
// BLOCK 05 · F-05.89 · THE NAME THAT MUST TRAVEL — THE PWA HALF · R-37.1/.15
//
// Run bare, and read the exit code as a second independent method alongside the
// verdict lines:   node scripts/b05_f0589_pwa_name_wire_bench.js ; echo $?
//
// WHAT THIS BENCH IS FOR. The join door has made the first name compulsory
// since 89e03eb, and `sendOtp` then posted `{ phone: e164 }` alone — the typed
// name waited in component state for /provision, which only runs after a
// successful OTP. Every abandon in between minted a permanent nameless row.
// This bench asserts the wire on THIS side: the body carries the name, and —
// the half that is easy to get wrong — it carries it ONLY from the door that
// collected it.
//
// WHY THIS BENCH READS BYTES RATHER THAN RENDERING. `page.tsx` is a 1000-line
// client component behind Next's router, `useState` and a country sheet; there
// is no harness in this repo that mounts it, and standing one up to assert four
// call sites would be a larger, less honest instrument than the one below. The
// cells therefore read SHIPPED SOURCE. That is stated plainly rather than
// dressed up: a byte cell proves the call site is written correctly, and the
// FOUNDER'S WALK is the only witness that the browser actually posts the field
// and the server actually stores it. The dream-os half
// (`scripts/b05_f0589_name_at_mint_bench.js`, 31 cells) drives the real doors
// over real HTTP and proves the receiving end.
'use strict';

const assert = require('assert');
const fs     = require('fs');
const path   = require('path');

const ROOT = path.resolve(__dirname, '..');
const PAGE = 'app/(landing)/page.tsx';
const src  = fs.readFileSync(path.join(ROOT, PAGE), 'utf8');

// Comment-stripped per F-06.192. Every cell below reads CODE: a cell that a
// comment could satisfy is a cell that proves nothing, and this file's whole
// method is byte-reading, so the stripper is load-bearing here rather than
// decorative. Block comments first, then line comments, then JSX comments.
const code = src
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^[ \t]*\/\/.*$/gm, '')
  .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '');

let pass = 0, fail = 0;
function t(id, name, fn) {
  try { fn(); console.log(`  PASS  ${id}  ${name}`); pass++; }
  catch (e) { console.log(`  FAIL  ${id}  ${name}\n        — ${e && e.message}`); fail++; }
}

// Every `sendOtp(` CALL in the stripped source — the declaration excluded.
function callSites() {
  return (code.match(/(?<!const )sendOtp\([^)]*\)/g) || []);
}

// ── THE §1 WINDOW, AND THE VACUITY HOLE IT CLOSES ────────────────────────────
// §1's cells first ran against the WHOLE file, and P1 (the disease restored —
// `sendOtp` posting the phone alone) left 1.1, 1.3 and 1.4 GREEN. The reason is
// that `verifyOtp`'s /provision call fifty lines below posts
// `{ phone: e164, name: joinName.trim() || undefined, category: ... }`, which
// satisfies every one of those patterns. The cells were reading a DIFFERENT
// call than the one they name, and would have gone on passing over a fully
// uncured door. They now read this window and nothing else.
const SEND_OTP = (() => {
  const i = code.indexOf('const sendOtp = async');
  const j = code.indexOf('const verifyOtp = async');
  if (i < 0 || j < 0 || j <= i) throw new Error('sendOtp window not found — this bench is stale');
  return code.slice(i, j);
})();

console.log('\nb05_f0589_pwa_name_wire_bench — F-05.89 · the wire, and only from the right door\n');

// ══ §1 · THE BODY CARRIES THE NAME ═══════════════════════════════════════════
console.log('§1 — the posted body');

t('1.1', 'the send-otp body carries a `name` key', () => {
  assert.ok(/body: JSON\.stringify\(\{ phone: e164, name:/.test(SEND_OTP),
    'the body still posts the phone alone — F-05.89 uncured on this side');
});

t('1.2', 'the name posted is the ARGUMENT, never read state [R-37.15]', () => {
  const body = (SEND_OTP.match(/body: JSON\.stringify\(\{ phone: e164, name: [^}]*\}\)/) || [''])[0];
  assert.ok(/nameArg/.test(body), `the body does not send nameArg — got: ${body}`);
  assert.ok(!/joinName/.test(body),
    'the body reads joinName off component state — a name from an abandoned join ' +
    'can now reach a stranger`s fresh row');
});

t('1.3', 'an empty or whitespace name is omitted, not sent as ""', () => {
  const body = (SEND_OTP.match(/body: JSON\.stringify\(\{ phone: e164, name: [^}]*\}\)/) || [''])[0];
  assert.ok(/\.trim\(\) \|\| undefined/.test(body),
    `a blank name would be posted as an empty string — got: ${body}`);
});

t('1.4', 'the phone byte is unchanged — the name did not disturb it', () => {
  assert.ok(/body: JSON\.stringify\(\{ phone: e164,/.test(SEND_OTP));
  assert.ok(/const e164 = country\.dialCode \+ digits;/.test(SEND_OTP));
});

// ══ §2 · ONLY THE DOOR THAT COLLECTED IT SPENDS IT [R-37.15] ═════════════════
console.log('\n§2 — four callers, one of them named');

t('2.1', 'sendOtp takes the name as an optional second parameter', () => {
  assert.ok(/const sendOtp = async \(phoneNum: string, nameArg\?: string\) =>/.test(SEND_OTP),
    'the signature does not accept a name argument');
});

t('2.2', 'there are exactly FOUR call sites — the census is pinned', () => {
  // If a fifth appears, this cell fails and its author must decide, explicitly,
  // whether that door collected a name. That decision is the point of the pin.
  const sites = callSites();
  assert.strictEqual(sites.length, 4,
    `expected 4 sendOtp call sites, found ${sites.length}: ${JSON.stringify(sites)}`);
});

t('2.3', 'the JOIN door passes joinName — the door that collected it', () => {
  assert.ok(/sendOtp\(phone, joinName\)/.test(code),
    'the join door no longer spends the name it made compulsory');
});

t('2.4', 'the sign-in paths pass NO name — the recorded non-act', () => {
  // The defect this prevents: joinName survives every screen transition, so a
  // visitor who types a name at the join door, backs out to Sign in and enters
  // a DIFFERENT number would found a stranger's row under that name.
  const signIn = code.slice(code.indexOf('const handleSignIn'));
  const block = signIn.slice(0, signIn.indexOf('const S: React.CSSProperties'));
  const sites = block.match(/sendOtp\([^)]*\)/g) || [];
  assert.strictEqual(sites.length, 2, `expected 2 sign-in call sites, got ${sites.length}`);
  for (const s of sites) {
    assert.strictEqual(s, 'sendOtp(phone)',
      `a sign-in path ships a name it never collected: ${s}`);
  }
});

t('2.5', 'RESEND passes the name only on the JOIN leg', () => {
  // Resend fires from BOTH otp screens. On the sign-in leg it must be as
  // name-free as the call that got the visitor there.
  assert.ok(/sendOtp\(phone, screen === 'join_otp' \? joinName : undefined\)/.test(code),
    'Resend either drops the name on the join leg or leaks it on the sign-in leg');
});

t('2.6', 'no call site reads joinName except the two ruled ones', () => {
  const withJoinName = callSites().filter(s => /joinName/.test(s));
  assert.strictEqual(withJoinName.length, 2,
    `expected exactly 2 name-bearing call sites (join door + resend), got ${withJoinName.length}: ` +
    JSON.stringify(withJoinName));
});

// ══ §3 · THE FENCES THIS SITTING KEPT ════════════════════════════════════════
console.log('\n§3 — what did not move');

t('3.1', 'the join door gate is unchanged — the name is still compulsory', () => {
  assert.ok(/disabled=\{phone\.length < country\.maxDigits \|\| !joinName\.trim\(\) \|\| \(role === 'Maker' && !joinCategory\)\}/.test(code),
    'the compulsory-name gate at the join door moved');
});

t('3.2', 'the /provision call still sends the name — the backfill rail is intact', () => {
  assert.ok(/name: joinName\.trim\(\) \|\| undefined/.test(code),
    'the provision body lost its name — F-OB.13`s rail was cut');
});

t('3.3', 'ZERO new user-facing strings', () => {
  // The copy inventory asserted, not claimed. The door's labels and toasts are
  // the pre-arc set, character for character.
  assert.ok(/label="Send code →"/.test(code), 'the button label moved');
  assert.ok(/Could not send code\. Try again\./.test(code), 'the send toast moved');
  assert.ok(!/enter your name/i.test(code), 'a new refusal string was minted');
  assert.ok(!/name is required/i.test(code), 'a new refusal string was minted');
});

t('3.4', 'the circle join door is untouched — it posts its own token+phone', () => {
  const circle = fs.readFileSync(path.join(ROOT, 'app/circle/join/[token]/page.tsx'), 'utf8');
  assert.ok(/JSON\.stringify\(\{ token, phone: bare \}\)/.test(circle),
    'the circle door moved — it rides a DIFFERENT endpoint whose mint already ' +
    'carries invitee_name, and this cure must not reach it');
});

// ══ §4 · THE MUTATION LEDGER ═════════════════════════════════════════════════
// Each line is a SINGLE edit to PRODUCTION SOURCE, run at this tree and
// restored byte-identical after.
//
//  P1  body -> JSON.stringify({ phone: e164 })                RED 1.1 1.2 1.3 1.4
//  P2  body name: nameArg -> name: joinName                   RED 1.2
//  P3  drop `.trim() || undefined` from the body              RED 1.3
//  P4  signature -> (phoneNum: string)                        RED 2.1
//  P5  join door -> sendOtp(phone)                            RED 2.3 2.6
//  P6  sign-in :601 -> sendOtp(phone, joinName)               RED 2.4 2.6
//  P7  resend -> sendOtp(phone, joinName)                     RED 2.5
//  P8  a fifth sendOtp call site added                        RED 2.2 2.4
//  P9  provision body loses `name:`                           RED 3.2
//  P10 a new refusal string added at the door                 RED 3.3
//
// ── ONE VACUITY HOLE, FOUND BY P1 AND RECORDED ───────────────────────────────
// On the first pass P1 — the disease itself, `sendOtp` posting the phone alone
// — reddened only 1.2. Cells 1.1, 1.3 and 1.4 stayed GREEN over a fully uncured
// door, because they searched the WHOLE FILE and `verifyOtp`'s /provision call
// fifty lines below carries a body of exactly the shape they were looking for.
// Three cells were reading a different call than the one they name. Cured by
// windowing §1 to the `sendOtp` function (see SEND_OTP above); P1 now reddens
// all four. The lesson is the estate's own: a byte cell must own its window, or
// the file will answer for the line.

console.log(`\n──────────────────────────────────────────────`);
console.log(`  ${pass} PASS · ${fail} FAIL   (${pass + fail} cells)`);
console.log(`──────────────────────────────────────────────\n`);
process.exit(fail === 0 ? 0 : 1);
