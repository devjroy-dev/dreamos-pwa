// scripts/settleWords.proof.ts
// TDW_04.5 P5 · the money loop's client-side proof.
//
// Drives the REAL lib/vendor/settleWords with mocked deps (the pwa has no test
// runner, so this compiles standalone and runs in plain node — the rosterMint /
// crewCommit precedent). Run via scripts/run-settle-proof.sh.
//
// WHAT IT PROVES:
//   · the gate: NOT NULL counterparty + positive amount, and A MISSING FUNCTION
//     IS NOT A BLOCKER (C2 — no pick is lawful and lands in the loose lane)
//   · the collab note's exact greppable shape
//   · the suggestion line SAYS FUNCTIONS because it COUNTS functions
//     (the founder's unit ruling, in the words as well as the arithmetic)
//   · weddingLabel translates the wire's honest null into the vetoed word
//   · settle writes ONLY what it is handed — the suggestion never rides along
//
// WHAT IT DOES NOT PROVE, NAMED: that any screen calls any of this. The
// components are JSX render conditions — F-04.105's class — covered by tsc and
// the founder's live walk, never by this file.

import {
  settle, canSettle, collabNote, suggestionLine, weddingLabel, fmt,
  SETTLE_SUCCESS_MSG, SETTLE_ERROR_MSG, UNTITLED_WEDDING,
  type SettleDraft,
} from '../lib/vendor/settleWords';

let pass = 0, fail = 0;
const ok = (c: boolean, m: string) => { if (c) { pass++; console.log('  PASS  ' + m); } else { fail++; console.log('  FAIL  ' + m); } };

const draft = (over: Partial<SettleDraft> = {}): SettleDraft => ({
  teamMemberId: 'tm-1', amount: '25000', linkedEventId: 'ev-1',
  description: '', notes: 'collab:post-1', ...over,
});

interface Sent { body: Record<string, unknown> | null; results: { msg: string; kind: string }[]; done: number }
function mk(result: { ok: boolean } | 'throw') {
  const calls: Sent = { body: null, results: [], done: 0 };
  return {
    calls,
    deps: {
      log: async (body: Record<string, unknown>) => {
        calls.body = body;
        if (result === 'throw') throw new Error('network');
        return result;
      },
      onResult: (msg: string, kind: 'success' | 'error') => { calls.results.push({ msg, kind }); },
      onDone: () => { calls.done++; },
    },
  };
}

async function main() {
  console.log('\n── §1 the gate ──');
  ok(canSettle(draft()), 'a complete draft is loggable');
  ok(!canSettle(draft({ teamMemberId: null })), 'no counterparty -> refused (team_member_id is NOT NULL)');
  ok(!canSettle(draft({ amount: '0' })), 'a zero amount is refused');
  ok(!canSettle(draft({ amount: '' })), 'an empty amount is refused');
  ok(!canSettle(draft({ amount: '-500' })), 'a negative amount is refused');
  // C2's teeth: the vendor is never forced to invent a wedding to record money.
  ok(canSettle(draft({ linkedEventId: null })), 'NO FUNCTION IS LAWFUL — the loose lane is a destination, not a failure');

  console.log('\n── §2 the collab thread ──');
  ok(collabNote('post-1') === 'collab:post-1', 'the note is collab:<post_id>, exactly');
  ok(collabNote('abc-123').includes('abc-123'), 'the post id is greppable inside it');
  ok(!collabNote('post-1').includes(' '), 'no whitespace to break a grep');

  console.log('\n── §3 the suggestion line (the founder\'s word, and it counts) ──');
  const line = suggestionLine(120000, 3, 40000);
  ok(line.includes('3 events'), 'the line says EVENTS — the founder\'s word, not the chair\'s');
  ok(!line.toLowerCase().includes('day'), 'the struck unit does not survive in the copy');
  ok(!line.includes('function'), 'nor does the chair\'s word, superseded');
  ok(line.includes('Rs 1,20,000'), 'the amount is grouped the Indian way');
  ok(line.includes('Rs 40,000 each'), 'the rate is per engagement, and says so');
  // "1 events" shipped and was witnessed at the smoke. A hardcoded plural is a
  // small lie told confidently.
  ok(suggestionLine(40000, 1, 40000).includes('1 event at'), 'ONE reads singular');
  ok(!suggestionLine(40000, 1, 40000).includes('1 events'), 'and never "1 events" again');
  ok(suggestionLine(80000, 2, 40000).includes('2 events at'), 'TWO reads plural');
  ok(fmt(125000) === '1,25,000', 'fmt is the estate\'s one rupee presentation');

  console.log('\n── §4 the wedding label ──');
  ok(weddingLabel('Rhea Malhotra') === 'Rhea Malhotra', 'a named wedding keeps its name');
  ok(weddingLabel(null) === UNTITLED_WEDDING, 'the wire\'s honest null becomes the vetoed word');
  ok(weddingLabel('') === UNTITLED_WEDDING, 'an empty title is absence too');
  ok(weddingLabel('   ') === UNTITLED_WEDDING, 'whitespace is not a name');

  console.log('\n── §5 settle writes only what it is handed ──');
  {
    const { calls, deps } = mk({ ok: true });
    const done = await settle(draft(), deps);
    // Optional chaining throughout this section deliberately: a draft the gate
    // wrongly REFUSES must RED these asserts, not crash the proof. A crash is
    // weaker evidence than a RED, and the hardening is the proof's job.
    ok(done === true, 'a good write reports success');
    ok(calls.body?.team_member_id === 'tm-1', 'the counterparty travels');
    ok(calls.body?.amount_inr === 25000, 'the amount travels as a number');
    ok(calls.body?.linked_event_id === 'ev-1', 'the picked function travels');
    ok(calls.body?.notes === 'collab:post-1', 'the collab note travels VERBATIM');
    ok(calls.results[0].msg === SETTLE_SUCCESS_MSG, 'the success sentence is the one home\'s');
    ok(calls.done === 1, 'the sheet is told to close exactly once');
    // SUGGEST-NEVER-COMMIT, structurally: there is no field on the wire that
    // could carry a suggestion, so an unedited suggestion can only reach the DB
    // by having been placed in `amount` — which is the editable field.
    ok(!('suggestion' in (calls.body ?? {})), 'no suggestion object can reach the write');
    ok(Object.keys(calls.body ?? {}).sort().join(',') === 'amount_inr,description,linked_event_id,notes,team_member_id',
      'the wire carries exactly five fields and no more');
  }
  {
    const { calls, deps } = mk({ ok: true });
    await settle(draft({ linkedEventId: null, notes: null, description: '  ' }), deps);
    ok(calls.body?.linked_event_id === undefined, 'an unpicked function is omitted, never sent empty');
    ok(calls.body?.notes === undefined, 'an absent note is omitted');
    ok(calls.body?.description === undefined, 'a whitespace description is omitted, not stored blank');
  }
  {
    const { calls, deps } = mk({ ok: false });
    const done = await settle(draft(), deps);
    ok(done === false, 'a refused write reports failure');
    ok(calls.results[0].kind === 'error', 'and says so as an error');
    ok(calls.results[0].msg === SETTLE_ERROR_MSG, 'with the one home\'s sentence');
    ok(calls.done === 0, 'the sheet does NOT close on a failed write — never a false done');
  }
  {
    const { calls, deps } = mk('throw');
    const done = await settle(draft(), deps);
    ok(done === false, 'a thrown request is a failure, not a silent success');
    ok(calls.done === 0, 'and the sheet stays open with the vendor\'s figures intact');
  }
  {
    const { calls, deps } = mk({ ok: true });
    const done = await settle(draft({ amount: '0' }), deps);
    ok(done === false && calls.body === null, 'an ungated draft never reaches the door at all');
  }

  console.log(`\n══ settleWords.proof: ${pass} passed, ${fail} failed ══\n`);
  process.exit(fail ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
