// scripts/b69_j1_introductions.proof.ts
// CE-42 · 4a PACKET 3b · R9-J1 — the copy home's BEHAVIOUR.
//
// Drives the REAL `lib/worklist/introductions`. Nothing is re-implemented here:
// a proof carrying its own copy of the ladder is green on mutations that break
// the product (the D2 near-miss `assignmentWords.proof.ts` records), and the
// structural bench beside this one can only see that a function exists.
//
// Run through `scripts/run-b69-proof.sh`.

import {
  IN, BUTTON_LABEL, sendTo, introMeta, introDate, introSent, chipWord, pageLabel,
} from '../lib/worklist/introductions';
import type { IntroRow, IntroChip } from '../lib/worklist/introductions';

let pass = 0, fail = 0;
const ok = (c: boolean, m: string) => {
  if (c) { pass++; console.log('  PASS  ' + m); }
  else { fail++; console.log('  FAIL  ' + m); }
};

const row = (chip: IntroChip, over: Partial<IntroRow> = {}): IntroRow => ({
  id: chip, recipient_name: 'A', recipient_phone_last4: '8550', where_met: 'x',
  status: 'sent', chip, created_at: null, sent_at: null, ...over,
});

console.log('\n\u2500\u2500 #12 \u00b7 #13 \u00b7 #14 \u2014 the three vetoed chips, and only three \u2500\u2500');
ok(chipWord('delivered')       === 'Delivered',     'delivered reads Delivered');
ok(chipWord('sent')            === 'Sent',          'sent reads Sent');
ok(chipWord('not_delivered')   === 'Not delivered', 'not_delivered reads Not delivered');
// UNDER-REPORTED, DELIBERATELY, AND IN THE SAFE DIRECTION. A read message was
// delivered; a send with no wamid was sent. No fourth or fifth byte was vetoed
// and minting one here would be a sixteenth string.
ok(chipWord('read')            === 'Delivered',     'read reads Delivered \u2014 true, and less than the truth');
ok(chipWord('sent_no_receipt') === 'Sent',          'sent_no_receipt reads Sent \u2014 no receipt to speak from');
ok(chipWord('not_sent')        === null,            'not_sent has no vetoed byte and gets none');
ok(chipWord('none')            === null,            'nor does none');
// The chip is a machine value. If one ever reached the glass it would be a word
// no founder ever saw.
const CHIPS: IntroChip[] = ['delivered', 'read', 'sent', 'sent_no_receipt', 'not_delivered', 'not_sent', 'none'];
ok(CHIPS.every((c) => chipWord(c) !== c), 'no raw chip value is ever a display word');
ok(new Set(CHIPS.map(chipWord).filter(Boolean)).size === 3, 'exactly three display words exist');

console.log('\n\u2500\u2500 F-42.111 \u2014 a row with no vetoed chip is not drawn \u2500\u2500');
{
  const rows = CHIPS.map((c) => row(c));
  const drawn = introSent(rows);
  ok(drawn.length === 5, 'five of the seven states draw');
  ok(!drawn.some((r) => r.chip === 'not_sent' || r.chip === 'none'), 'the staged row is not under the Sent eyebrow');
  ok(drawn.every((r) => chipWord(r.chip) !== null), 'every drawn row has a byte for its chip');
  // The filter is on the BYTE, not the status: a row whose status says `sent`
  // but which produced no wamid is `sent_no_receipt` and still draws.
  ok(introSent([row('sent_no_receipt', { status: 'sent_no_wamid' })]).length === 1,
    'a send with no receipt still draws, on its chip and not its status');
  ok(introSent([]).length === 0, 'an empty list draws nothing');
}

console.log('\n\u2500\u2500 #11 \u00b7 the row meta, and the house date \u2500\u2500');
ok(introDate('2026-09-08T12:00:00Z') === '8 Sep', 'a timestamp reads as 8 Sep');
ok(!introDate('2026-09-08T12:00:00Z').includes('Sept'), 'and NEVER Sept \u2014 the S2 veto sheet\u2019s ruled byte (F-42.112)');
// READ IN IST. 20:00Z on the 7th is 01:30 on the 8th on the handset that sent
// it, and the vendor is in India. Read in UTC this row would date itself a day
// early, every night, for four and a half hours.
ok(introDate('2026-09-07T20:00:00Z') === '8 Sep', 'a late-evening UTC stamp dates by IST, not by UTC');
ok(introDate('2026-09-07T10:00:00Z') === '7 Sep', 'and a daytime stamp is unmoved by the shift');
ok(introDate(null) === '', 'no date, no bytes');
ok(introDate('not a date') === '', 'and an unparseable one invents nothing');

ok(introMeta('the Verma wedding', '2026-09-10T06:00:00Z') === 'met at the Verma wedding \u00B7 10 Sep',
  'place and date read as the veto sheet writes them');
ok(introMeta('the Verma wedding', null) === 'met at the Verma wedding',
  'with no date the separator goes too \u2014 a row does not advertise a hole');
ok(introMeta(null, '2026-09-10T06:00:00Z') === '10 Sep', 'with no place, the date alone');
ok(introMeta(null, null) === '', 'with neither, nothing');
// HER OWN FREE TEXT, PRINTED AS SHE TYPED IT. Capitalising or rewriting her
// words on her own screen is this room editing her.
ok(introMeta('  the Verma wedding  ', null) === 'met at the Verma wedding', 'her text is trimmed, never recased');
ok(introMeta('THE VERMA WEDDING', null) === 'met at THE VERMA WEDDING', 'and never normalised');

console.log('\n\u2500\u2500 #8 \u2014 the confirm names the recipient \u2500\u2500');
ok(sendTo('Anita Verma') === 'Send to Anita Verma', 'the byte reads Send to <name>');
ok(sendTo('  Anita Verma  ') === 'Send to Anita Verma', 'a padded name does not pad the button');
ok(sendTo('') === 'Send to', 'an empty name leaves the verb, never the word undefined');

console.log('\n\u2500\u2500 the page address is the door\u2019s, minus the scheme \u2500\u2500');
ok(pageLabel('https://thedreamwedding.in/v/DEV440') === 'thedreamwedding.in/v/DEV440', 'https is dropped');
ok(pageLabel('http://example.test/v/X') === 'example.test/v/X', 'so is http');
ok(pageLabel('') === '', 'and nothing is invented from nothing');
// The HOST is never rebuilt here. A vendor served from another host must see
// her own, so the function only ever REMOVES.
ok(pageLabel('https://other.host/v/X').startsWith('other.host'), 'the host is the door\u2019s, never this file\u2019s');

console.log('\n\u2500\u2500 the fifteen, as the module exposes them \u2500\u2500');
ok(IN.title === 'Introductions', '#1');
ok(IN.lede === 'Send your page to someone you met. It goes once, and only after you approve it.', '#2');
ok(IN.labelNumber === 'Their number' && IN.labelName === 'Their name' && IN.labelWhere === 'Where you met', '#3 #4 #5');
ok(IN.review === 'Review the message', '#6');
ok(IN.previewEyebrow === 'They will receive', '#7');
ok(IN.back === 'Back', '#9');
ok(IN.sectionSent === 'Sent', '#10');
ok(IN.empty === 'No introductions yet.', '#15');
// F-42.110 — proven equal to `TEMPLATES.introduction.button.text` at this cut.
// It is a SECOND HOME and the finding says so; the cell pins the byte so a
// drift is a red rather than a surprise on a stranger's handset.
ok(BUTTON_LABEL === 'See my work', 'the template button label matches the registry entry (F-42.110)');

console.log('\n' + (fail === 0 ? 'GREEN' : 'RED') + ' \u2014 b69 j1 introductions proof ' + pass + '/' + (pass + fail));
process.exit(fail === 0 ? 0 : 1);
