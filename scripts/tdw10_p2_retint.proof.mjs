// scripts/tdw10_p2_retint.proof.mjs — RETIRED AT CE-41 E2 (i), R-41.78.
//
// WHAT IT ASSERTED. Every one of `app/admin/_components/tokens.css`'s 34 --admin-*
// roles against `lib/vendor/theme.ts` DARK, the donor each role's comment cited.
//
// WHY IT IS RETIRED AND NOT FIXED. Its subject is gone. R-41.73 deleted tokens.css
// and re-pointed all 191 reads at `lib/worklist/theme.ts`; there is no espresso role
// map left to compare, and the citation it policed cannot go stale because there is
// no second copy of the value to drift. It read 55 passed / 21 failed of 76 at
// 1619cae — a known red on the floor's NAMED BASE since the donor moved to Graphite
// at CE-40, which is the cell doing its job right up to the end: it went red the
// moment the fact it witnessed stopped being true, and it stayed red until the fact
// was cured rather than the cell silenced.
//
// WHAT REPLACES IT. scripts/ce41_e2i_cockpit_ink_census.mjs — same argument, new
// subject: no colour value anywhere in the shell group, every paint a var() from
// the one home, and the single `theme-color` literal asserted equal to its token.
//
// The file is kept, exiting 0 with this note, rather than deleted: a bench cell that
// vanishes leaves a floor count that moved with nobody able to say why. It leaves
// the floor by name in scripts/floor-manifest-ce41-e2i.txt.
console.log('tdw10_p2_retint: RETIRED at CE-41 E2 (i) (R-41.78) — its subject, app/admin/_components/tokens.css, was deleted by R-41.73. Replaced by scripts/ce41_e2i_cockpit_ink_census.mjs.');
process.exit(0);
