// scripts/assignmentWords.proof.ts
// TDW_04.5 P4 — the confirmation vocabulary's proof.
// Drives the REAL lib/vendor/assignmentWords. Nothing re-implemented here: the
// D2 near-miss earlier this sitting (a proof carrying its own copy of the ladder,
// green on three of four mutations) is why this imports rather than copies.

import { confirmationWord, confirmationTone, CONFIRMATION_WORDS, CONFIRMATION_TONE, ASSIGNMENTS_ERROR_MSG } from '../lib/vendor/assignmentWords';
import { hhmm } from '../lib/vendor/slotWords';

let pass = 0, fail = 0;
const ok = (c: boolean, m: string) => { if (c) { pass++; console.log('  PASS  ' + m); } else { fail++; console.log('  FAIL  ' + m); } };

console.log('\n── the founder\'s three words, byte-checked ──');
ok(confirmationWord('pending')   === 'Awaiting confirmation', "pending reads 'Awaiting confirmation'");
ok(confirmationWord('confirmed') === 'Confirmed',             "confirmed reads 'Confirmed'");
ok(confirmationWord('declined')  === "Can’t make it",         "declined reads \"Can’t make it\" — the member's own words, not a verdict");
ok(confirmationWord('declined')  !== 'Declined',              'and NOT "Declined" — founder-ruled');

console.log('\n── never blank, never the raw enum ──');
ok(confirmationWord(null)        === 'Awaiting confirmation', 'null falls back to awaiting');
ok(confirmationWord(undefined)   === 'Awaiting confirmation', 'so does undefined');
ok(confirmationWord('')          === 'Awaiting confirmation', 'so does empty');
ok(confirmationWord('nonsense')  === 'Awaiting confirmation', 'an unknown state never leaks the raw value');
ok(!Object.values(CONFIRMATION_WORDS).includes('pending'),    'no raw enum value is ever a display word');

console.log('\n── the ring vocabulary, closed at CE-58 and reused ──');
ok(confirmationTone('declined') === '#E07B5C',  'declined is terracotta');
ok(confirmationTone('confirmed') !== confirmationTone('pending'), 'confirmed and awaiting are visually distinct');
ok(confirmationTone('nonsense') === confirmationTone('pending'), 'an unknown state tones as awaiting');
ok(!Object.values(CONFIRMATION_TONE).some(v => v.toLowerCase().includes('c9a84c')),
   'ONE GOLD PER SCREEN — no confirmation tone is the muhurat gold');

console.log('\n── one home, two surfaces ──');
ok(Object.keys(CONFIRMATION_WORDS).length === 3, 'exactly three states are spelled');
ok(Object.keys(CONFIRMATION_WORDS).sort().join(',') === 'confirmed,declined,pending',
   'and they are the three crew_confirmations.status permits');
ok(Object.keys(CONFIRMATION_TONE).sort().join(',') === Object.keys(CONFIRMATION_WORDS).sort().join(','),
   'words and tones cover the SAME states — one cannot gain a state the other lacks');

console.log('\n── the rider: the call time\'s one home ──');
ok(hhmm('19:00:00') === '19:00', 'seconds are dropped — the sheet reads what the crew page reads');
ok(hhmm('09:30:00') === '09:30', 'a leading zero survives');
ok(hhmm('19:00') === '19:00', 'an already-clean value passes through');
ok(hhmm(null) === null, 'null in, null out — the caller decides what absence looks like');
ok(hhmm('nonsense') === 'nonsense', 'an unparseable value is returned AS IS, never blanked — a time nobody can read beats a time nobody can see');

console.log('\n── the rider: the failure speaks ──');
ok(ASSIGNMENTS_ERROR_MSG === 'Could not load assignments.', 'the failure has words of its own');
// Widened to `string`: tsc proves the literals cannot overlap and refuses the
// comparison. The assert still earns its place as a regression guard — if anyone
// ever sets the error constant to the empty-state sentence, this REDs.
ok((ASSIGNMENTS_ERROR_MSG as string) !== 'No assignments yet.', 'and they are NOT the empty state — an empty state is honest only when it is true');
ok(ASSIGNMENTS_ERROR_MSG.startsWith('Could not '), "the register matches the estate's own (Could not save crew. / Could not add.)");

console.log(`\n════════  ${pass} passed, ${fail} failed  ════════\n`);
process.exit(fail === 0 ? 0 : 1);
