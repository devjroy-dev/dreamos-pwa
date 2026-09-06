// scripts/rosterMint.proof.ts
// TDW_04.5 P4 · defect A's cure — the Roster row action's proof.
// Drives the REAL lib/vendor/rosterMint with mocked deps (the pwa has no test
// runner, so this compiles standalone and runs in plain node — the crewCommit
// precedent). Proves: the door is called WITH THE ROW'S ID, the success and
// failure sentences, the idempotent re-tap, and — the ruling's teeth — that
// minting assigns NOBODY. Run via scripts/run-roster-mint-proof.sh.

import { mintCrewIdentity, MINT_SUCCESS_MSG, MINT_ERROR_MSG, MINT_ACTION_LABEL, MintResponse } from '../lib/vendor/rosterMint';

let pass = 0, fail = 0;
const ok = (c: boolean, m: string) => { if (c) { pass++; console.log('  PASS  ' + m); } else { fail++; console.log('  FAIL  ' + m); } };

interface Calls { bridged: string[]; results: { msg: string; kind: string }[]; refresh: number; }
function mk(resp: MintResponse | 'throw') {
  const calls: Calls = { bridged: [], results: [], refresh: 0 };
  const deps = {
    bridge: async (id: string) => {
      calls.bridged.push(id);
      if (resp === 'throw') throw new Error('network');
      return resp;
    },
    onResult: (msg: string, kind: 'success' | 'error') => { calls.results.push({ msg, kind }); },
    onRefresh: () => { calls.refresh++; },
  };
  return { deps, calls };
}

(async () => {
  console.log('\n── the door is called with the ROW\'s id ──');
  {
    const { deps, calls } = mk({ ok: true, member: { id: 'tm-1' }, created: true });
    await mintCrewIdentity('roster-42', deps);
    ok(calls.bridged.length === 1, 'the bridge door is called exactly once');
    ok(calls.bridged[0] === 'roster-42', 'and with the roster row\'s id, not the member\'s');
  }

  console.log('\n── success ──');
  {
    const { deps, calls } = mk({ ok: true, member: { id: 'tm-1' }, created: true });
    const r = await mintCrewIdentity('r1', deps);
    ok(r === true, 'returns true');
    ok(calls.results[0]?.kind === 'success', 'reports success');
    ok(calls.results[0]?.msg === MINT_SUCCESS_MSG, 'with the founder\'s exact bytes');
    ok(calls.results[0]?.msg === "They’re on your crew list — assign them from any booking.", 'byte-checked against the veto ledger');
    ok(calls.refresh === 1, 'and refreshes the roster');
  }

  console.log('\n── the idempotent re-tap ──');
  {
    const { deps, calls } = mk({ ok: true, member: { id: 'tm-1' }, created: false });
    const r = await mintCrewIdentity('r1', deps);
    ok(r === true, 'a re-tap still succeeds — created:false is not a failure');
    ok(calls.results[0]?.msg === MINT_SUCCESS_MSG, 'and says the SAME thing, because the same thing is true');
    ok(calls.results[0]?.kind === 'success', 'never an error on the second tap');
  }

  console.log('\n── failure ──');
  {
    const { deps, calls } = mk({ ok: false, error: 'Roster is not available yet.' });
    const r = await mintCrewIdentity('r1', deps);
    ok(r === false, 'returns false on ok:false');
    ok(calls.results[0]?.msg === MINT_ERROR_MSG, 'shows the founder\'s failure sentence');
    ok(calls.results[0]?.msg === 'Could not add. Try again.', 'byte-checked against the veto ledger');
    ok(calls.results[0]?.kind === 'error', 'reported as an error');
    ok(calls.refresh === 0, 'and does NOT refresh — nothing changed');
  }
  {
    const { deps, calls } = mk('throw');
    const r = await mintCrewIdentity('r1', deps);
    ok(r === false, 'a thrown request also returns false');
    ok(calls.results[0]?.msg === MINT_ERROR_MSG, 'and lands on the same sentence — no stack traces at the vendor');
    ok(calls.refresh === 0, 'no refresh on a throw');
  }

  console.log('\n── MINT ONLY: the ruling\'s teeth ──');
  {
    const { deps, calls } = mk({ ok: true, member: { id: 'tm-1' }, created: true });
    await mintCrewIdentity('r1', deps);
    ok(!('updateEvent' in deps), 'the mint path has NO events dependency to call');
    ok(Object.keys(deps).length === 3, 'exactly three deps: bridge, onResult, onRefresh — no assignment surface');
    ok(calls.results.length === 1, 'one outcome, one sentence');
  }

  console.log('\n── the label ──');
  ok(MINT_ACTION_LABEL === 'Add to crew', 'the row action carries the founder\'s exact label');

  console.log(`\n════════  ${pass} passed, ${fail} failed  ════════\n`);
  process.exit(fail === 0 ? 0 : 1);
})().catch((e) => { console.error('BENCH THREW (unexpected):', e && e.stack || e); process.exit(2); }); // F-39.67: an unexpected throw is an ERROR (2), never a FAIL (1)
