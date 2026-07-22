// scripts/cityMatch.proof.ts
// TDW_04.5 P4 · D2 — the city match ladder's proof.
//
// Drives the REAL lib/vendor/cityMatch (matchCity + CITIES + CITY_ALIASES).
// NOTHING under test is re-implemented here. The first cut of this proof carried
// its own COPY of the ladder and went GREEN on three of four production
// mutations — a proof of the copy, not of the code. The mutation test caught it,
// the ladder was hoisted to a lib, and this file now imports it.

import { matchCity, CITIES, CITY_ALIASES } from '../lib/vendor/cityMatch';

let pass = 0, fail = 0;
const ok = (c: boolean, m: string) => { if (c) { pass++; console.log('  PASS  ' + m); } else { fail++; console.log('  FAIL  ' + m); } };


// Extract the REAL arrays/functions from the page source, so this proof cannot
// pass over a stale copy.



console.log('\n── rung 1: exact ──');
ok(matchCity('Mumbai') === 'Mumbai', 'an exact option resolves to itself');
ok(matchCity('mumbai') === 'Mumbai', 'case-insensitively');
ok(matchCity('  Jaipur  ') === 'Jaipur', 'and trimmed');

console.log('\n── rung 2: alias — THE LIVE SPECIMEN ──');
ok(matchCity('Delhi') === 'Delhi NCR', "'Delhi' resolves to 'Delhi NCR' — the founder's own failing case");
ok(matchCity('New Delhi') === 'Delhi NCR', "'New Delhi' too");
ok(matchCity('Gurgaon') === 'Delhi NCR', 'a satellite city lands in the NCR option');
ok(matchCity('Bengaluru') === 'Bangalore', 'the endonym resolves');
ok(matchCity('Bombay') === 'Mumbai', 'and the historical name');

console.log('\n── rung 3: prefix ──');
ok(matchCity('Delhi NCR, India') === 'Delhi NCR', 'a longer string starting with an option resolves');
ok(matchCity('Banga') === 'Bangalore', 'a truncation resolves');

console.log('\n── the honest fallback ──');
ok(matchCity('Reykjavik') === '', 'an unknown city resolves to EMPTY, not a guess');
ok(matchCity('Reykjavik') !== 'Other', "and NOT to 'Other' — a wrong city selected silently is worse than none");
ok(matchCity('') === '', 'empty in, empty out');
ok(matchCity('   ') === '', 'whitespace too');

console.log('\n── the anti-drift guard ──');
ok(CITIES.length === 11, 'the one home still offers 11 cities');
ok(CITIES.includes('Delhi NCR'), "and still offers 'Delhi NCR'");
ok(Object.values(CITY_ALIASES).every(v => CITIES.includes(v)),
   'EVERY alias target is a real option — an alias pointing nowhere would render blank');

console.log(`\n════════  ${pass} passed, ${fail} failed  ════════\n`);
process.exit(fail === 0 ? 0 : 1);
