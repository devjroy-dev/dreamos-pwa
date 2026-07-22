// scripts/assignmentWords.proof.ts
// TDW_04.5 P4 — the confirmation vocabulary's proof.
// Drives the REAL lib/vendor/assignmentWords. Nothing re-implemented here: the
// D2 near-miss earlier this sitting (a proof carrying its own copy of the ladder,
// green on three of four mutations) is why this imports rather than copies.

import { confirmationWord, confirmationTone, CONFIRMATION_WORDS, CONFIRMATION_TONE } from '../lib/vendor/assignmentWords';

let pass = 0, fail = 0;
const ok = (c: boolean, m: string) => { if (c) { pass++; console.log('  PASS  ' + m); } else { fail++; console.log('  FAIL  ' + m); } };

console.log('\n── the founder\'s three words, byte-checked ──');
ok(confirmationWord('pending')   === 'Awaiting confirmation', "pending reads 'Awaiting confirmation'");
ok(confirmationWord('confirmed') === 'Confirmed',             "confirmed reads 'Confirmed'");
ok(confirmationWord('declined')  === "Can't make it",         "declined reads \"Can't make it\" — the member's own words, not a verdict");
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

console.log(`\n════════  ${pass} passed, ${fail} failed  ════════\n`);
process.exit(fail === 0 ? 0 : 1);
