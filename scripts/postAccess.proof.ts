// scripts/postAccess.proof.ts
// TDW_04.5 P5 micro · F-04.118(a) — the reachability gate, proven.
//
// Drives the REAL lib/vendor/postAccess. Run via scripts/run-post-access-proof.sh.
//
// WHY THIS FILE EXISTS AT ALL: the gate it proves was a JSX render condition,
// and a render condition is bench-blind (F-04.105's class). F-04.118 is what
// that blindness costs — the wrong gate shipped, every bench stayed green, and
// the founder found it by hitting the wall on a real post with a real
// connection behind it. Hoisting the predicate into a module is the only way
// the both-ways clause can reach it.
//
// THE OLD GATE, kept here as the thing under test:
//     (interested_count > 0) && state === 'open'
// THE NEW GATE:
//     (interested_count > 0)
// The whole cure is the removal of a term, so the proof is mostly a table of
// states — because the states are exactly what the old gate got wrong.

import { canViewResponses, cardIsTappable, type PostAccessShape } from '../lib/vendor/postAccess';

let pass = 0, fail = 0;
const ok = (c: boolean, m: string) => { if (c) { pass++; console.log('  PASS  ' + m); } else { fail++; console.log('  FAIL  ' + m); } };

const post = (state: string | null, n: number | null): PostAccessShape =>
  ({ state, interested_count: n });

function main() {
  console.log('\n── §1 a response is reachable in EVERY post state ──');
  // The founder's own row: state 'filled', one accepted response, unreachable
  // until tonight. This assert is that row.
  ok(canViewResponses(post('filled', 1)),
    'FILLED with a response -> reachable (the smoke\'s own blocked row)');
  ok(canViewResponses(post('open', 1)), 'open with a response -> reachable');
  ok(canViewResponses(post('closed', 1)), 'closed with a response -> reachable');
  ok(canViewResponses(post('expired', 3)), 'expired with responses -> reachable');
  ok(canViewResponses(post(null, 2)), 'an unknown state does not hide people');

  console.log('\n── §2 no responses is still no screen ──');
  // The cure widens reachability; it does not offer a door onto an empty room.
  ok(!canViewResponses(post('open', 0)), 'open with zero responses -> nothing to see');
  ok(!canViewResponses(post('filled', 0)), 'filled with zero responses -> nothing to see');
  ok(!canViewResponses(post('open', null)), 'a null count is not a response');
  ok(!canViewResponses(post('filled', null)), 'a null count on a filled post is not a response');

  console.log('\n── §3 the card and the button cannot disagree ──');
  // The defect's mechanism: the button had a rule and the card had none. Both
  // now ask the same function, so a card can never be inert while its own
  // button is live, nor tappable into a screen that would be empty.
  const cases: PostAccessShape[] = [
    post('open', 0), post('open', 1), post('filled', 0), post('filled', 1),
    post('closed', 2), post('expired', 0), post(null, null),
  ];
  ok(cases.every(c => cardIsTappable(c) === canViewResponses(c)),
    'card tappability === response reachability, across all seven shapes');
  ok(!cases.some(c => cardIsTappable(c) && !canViewResponses(c)),
    'no card taps into a screen with nothing on it');
  ok(!cases.some(c => !cardIsTappable(c) && canViewResponses(c)),
    'no reachable post is left with no way in — the defect, asserted directly');

  console.log('\n── §4 state is not consulted, and that is the cure ──');
  // Stated as an invariant rather than a case list: for any response count, the
  // answer is identical across every state. If a state term ever returns, this
  // is the assert that reddens.
  const states = ['open', 'filled', 'closed', 'expired', 'draft', null];
  for (const n of [0, 1, 5]) {
    const answers = states.map(st => canViewResponses(post(st, n)));
    ok(answers.every(a => a === answers[0]),
      `count ${n}: every state answers alike (state is not a term)`);
  }
  ok(canViewResponses(post('filled', 1)) === canViewResponses(post('open', 1)),
    'filled and open are indistinguishable to this gate');

  console.log(`\n══ postAccess.proof: ${pass} passed, ${fail} failed ══\n`);
  process.exit(fail ? 1 : 0);
}

main();
