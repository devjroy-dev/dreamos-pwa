// scripts/crewCommit.proof.ts
// TDW_04.5 P1 #6 (CE Ruling №10) — the picker's COMMIT-LOGIC proof.
// Drives the REAL lib/vendor/crewCommit (crewSetFrom + commitCrew) with mocked deps —
// the pwa has no test runner, so this compiles standalone (crewCommit is dependency-free)
// and runs in plain node. It proves: the ONE full-array SET PATCH shape, the success path,
// the DORMANT clash surfaced non-blocking over a MOCKED conflict (#4's mocked-payload
// method), and the error path leaving the sheet open. Run via scripts/run-crew-proof.sh.

import { crewSetFrom, commitCrew, CREW_SAVED_MSG, CREW_ERROR_MSG, CrewCommitResponse } from '../lib/vendor/crewCommit';

let pass = 0, fail = 0;
const ok = (c: boolean, m: string) => { if (c) { pass++; console.log('  PASS  ' + m); } else { fail++; console.log('  FAIL  ' + m); } };

interface Calls { update: { id: string; body: { assigned_member_ids: string[] } } | null; toasts: { msg: string; kind: string }[]; refresh: number; close: number; }
function mk(resp: CrewCommitResponse) {
  const calls: Calls = { update: null, toasts: [], refresh: 0, close: 0 };
  const deps = {
    updateEvent: async (id: string, body: { assigned_member_ids: string[] }) => { calls.update = { id, body }; return resp; },
    onToast: (msg: string, kind?: 'success' | 'error') => { calls.toasts.push({ msg, kind: kind || 'success' }); },
    onRefresh: () => { calls.refresh++; },
    onClose: () => { calls.close++; },
  };
  return { deps, calls };
}

(async () => {
  console.log('\n── crewSetFrom: the full-array SET ──');
  ok(JSON.stringify(crewSetFrom(['a', 'a', 'b'])) === JSON.stringify(['a', 'b']), 'dedupes, order-stable');
  ok(JSON.stringify(crewSetFrom(new Set(['x', 'y']))) === JSON.stringify(['x', 'y']), 'accepts a Set (the picker\'s toggle state)');
  ok(JSON.stringify(crewSetFrom([])) === JSON.stringify([]), 'empty toggles -> [] (the CLEAR SET)');

  console.log('\n── commit: success, no clash (today\'s real path) ──');
  {
    const { deps, calls } = mk({ ok: true, event: { id: 'e1' } });
    await commitCrew('e1', ['m1', 'm2', 'm1'], deps);
    ok(!!calls.update && calls.update.id === 'e1' && JSON.stringify(calls.update.body) === JSON.stringify({ assigned_member_ids: ['m1', 'm2'] }),
      'ONE SET PATCH through the backend: updateEvent(e1, {assigned_member_ids:[m1,m2]})');
    ok(calls.toasts.length === 1 && calls.toasts[0].msg === CREW_SAVED_MSG && calls.toasts[0].kind === 'success', 'success toast "Crew updated"');
    ok(calls.refresh === 1 && calls.close === 1, 'refresh + close on success');
  }

  console.log('\n── commit: the DORMANT CLASH, mocked (F-04.88 + F-04.92) ──');
  {
    // A member_clash advisory rides ok:true. TODAY the backend never delivers it on the
    // CRUD path (F-04.88 occupancy short-circuit AND F-04.92 the CRUD door dropping ok:true
    // advisories) — so this branch is exercised with a MOCKED conflict, byte-ready for the day
    // both cures land. Verbatim-bare, non-blocking, never a refusal.
    const msg = 'Rahul is already on the Sharma sangeet that evening.';
    const { deps, calls } = mk({ ok: true, event: { id: 'e1' }, conflict: { message: msg } });
    await commitCrew('e1', ['m1'], deps);
    ok(calls.toasts.length === 1 && calls.toasts[0].msg === msg && calls.toasts[0].kind === 'success',
      'clash surfaced VERBATIM-BARE as a NON-BLOCKING success notice (never a confirm/blocker)');
    ok(calls.refresh === 1 && calls.close === 1, 'the write LANDED — refresh + close (advisory, not refusal)');
  }

  console.log('\n── commit: error leaves the sheet open ──');
  {
    const { deps, calls } = mk({ ok: false, error: 'One or more of those members are not on your active team.' });
    await commitCrew('e1', ['ghost'], deps);
    ok(calls.toasts.length === 1 && calls.toasts[0].kind === 'error', 'error toast on ok:false (the API\'s own sentence)');
    ok(calls.refresh === 0 && calls.close === 0, 'NO refresh/close on error — the sheet stays open to retry');
  }
  {
    const { deps, calls } = mk({ ok: false, error: '' });
    await commitCrew('e1', [], deps);
    ok(calls.toasts[0].msg === CREW_ERROR_MSG && calls.toasts[0].kind === 'error', 'fallback "Could not save crew." when the API returns no error text');
  }

  console.log(`\n════════  ${pass} passed, ${fail} failed  ════════`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error('BENCH THREW (unexpected):', e && e.stack || e); process.exit(2); }); // F-39.67: an unexpected throw is an ERROR (2), never a FAIL (1)
