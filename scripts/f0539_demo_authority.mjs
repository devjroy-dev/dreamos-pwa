#!/usr/bin/env node
// F-05.39 — the invitation surface's demo authority (PWA).
//
// ONE claim: demo mode and a real session are served differently ON THE SAME
// CODE PATH — lib/frost/journey.ts, home of inviteCircleMember and the
// sanctuary's data layer.
//
// FOUR STATES, driven through a faithful reproduction of the real gates:
//   (i)   demo blob, no real token      → MOCKS
//   (ii)  demo blob, REAL token present → MOCKS      ← THE CONTAMINATION CASE
//   (iii) no demo blob, real token      → REAL
//   (iv)  neither                       → the ONLY state the hidden Vercel
//                                          NEXT_PUBLIC_USE_MOCKS controls;
//                                          asserted in BOTH worlds.
//
// THE TEETH (both-ways, per the estate's non-vacuous floor): the PRE-CURE gate
// is reproduced beside the cured one and asserted to return REAL in state (ii)
// — that return IS F-05.39's disease, and this bench fails if it ever comes
// back. Every reproduction below is PINNED to its real site by a source
// grep-guard, so the bench cannot pass against an un-cured tree.
//
// Run: node scripts/f0539_demo_authority.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const R = (p) => readFileSync(join(__dirname, '..', p), 'utf8');
const SRC = {
  journey: R('lib/frost/journey.ts'),
  base:    R('lib/frost-api/_base.ts'),
  couple:  R('lib/frost-api/couple.ts'),
  muse:    R('lib/frost-api/muse.ts'),
  layout:  R('app/(frost)/layout.tsx'),
  demo:    R('app/demo/bride/page.tsx'),
};

let fail = 0;
const ok  = (m) => console.log(`  \u2713 ${m}`);
const bad = (m) => { console.log(`  \u2717 ${m}`); fail++; };
const guard = (label, cond) => cond ? ok(`GUARD ${label}`) : bad(`GUARD ${label} — source no longer matches; reproduction is unpinned`);

// ─── §1 SOURCE GUARDS — the reproductions below are worthless unpinned ───────
console.log('\n\u00a71  SOURCE GUARDS (the cure is where this bench thinks it is)');

guard('_base.ts exports the ONE isBrideDemoMode',
  /export function isBrideDemoMode\(\): boolean \{/.test(SRC.base));

guard('_base.ts reads the tdw_bride_demo_session blob, demo === true',
  /localStorage\.getItem\('tdw_bride_demo_session'\)/.test(SRC.base)
  && /JSON\.parse\(s\)\.demo === true/.test(SRC.base));

guard('journey.ts IMPORTS the authority from _base (never redefines it)',
  /import \{ isBrideDemoMode, getAccessToken \} from '\.\.\/frost-api\/_base';/.test(SRC.journey)
  && !/function isBrideDemoMode/.test(SRC.journey));

guard('journey.ts shouldUseMocks lets demo mode win FIRST',
  /function shouldUseMocks\(\): boolean \{\s*\n\s*if \(isBrideDemoMode\(\)\) return true;/.test(SRC.journey));

guard('journey.ts shouldUseMocks token read folded onto getAccessToken',
  /return !getAccessToken\(\);/.test(SRC.journey));

guard('journey.ts getToken folded onto getAccessToken',
  /function getToken\(\): string \| null \{[\s\S]*?return getAccessToken\(\);/.test(SRC.journey));

guard('journey.ts holds ZERO raw localStorage access_token reads',
  !/localStorage\.getItem\('access_token'\)/.test(SRC.journey));

guard('journey.ts fetchMemberFeed raw site adopts the demo authority',
  /if \(isBrideDemoMode\(\) \|\| \(USE_MOCKS && !hasToken\)\) return delay\(null\);/.test(SRC.journey));

guard('couple.ts + muse.ts re-point to _base, copies deleted',
  /isBrideDemoMode \} from '\.\/_base';/.test(SRC.couple)
  && /isBrideDemoMode \} from '\.\/_base';/.test(SRC.muse)
  && !/function isBrideDemoMode/.test(SRC.couple)
  && !/function isBrideDemoMode/.test(SRC.muse));

guard('layout.tsx dead copy DELETED',
  !/function isBrideDemoMode/.test(SRC.layout));

guard('exactly ONE definition survives across the four files',
  [SRC.journey, SRC.base, SRC.couple, SRC.muse, SRC.layout]
    .join('\n').match(/function isBrideDemoMode\(\): boolean \{/g).length === 1);

guard('the demo seed writes the blob and NO top-level access_token (the disease\u2019s premise)',
  /setItem\('tdw_bride_demo_session'/.test(SRC.demo)
  && !/setItem\('access_token'/.test(SRC.demo));

guard('nothing in the repo removes the blob (F-05.65 — demo is permanent)',
  !/removeItem\('tdw_bride_demo_session'\)/.test(SRC.demo));

// ─── §2 THE FOUR STATES ──────────────────────────────────────────────────────
// Faithful reproductions. isBrideDemoMode / getAccessToken mirror _base.ts;
// shouldUseMocks mirrors journey.ts. 'MOCKS' | 'REAL' is the verdict.

const store = {};
const LS = {
  getItem: (k) => (k in store ? store[k] : null),
};

function isBrideDemoMode() {            // _base.ts
  try {
    const s = LS.getItem('tdw_bride_demo_session');
    return !!s && JSON.parse(s).demo === true;
  } catch { return false; }
}
function getAccessToken() {             // _base.ts (cookie fallback not exercised here)
  try { return LS.getItem('access_token'); } catch { return null; }
}

function curedGate(USE_MOCKS) {         // journey.ts AFTER the cure
  if (isBrideDemoMode()) return 'MOCKS';
  if (!USE_MOCKS) return 'REAL';
  try { return !getAccessToken() ? 'MOCKS' : 'REAL'; } catch { return 'MOCKS'; }
}
function preCureGate(USE_MOCKS) {       // journey.ts BEFORE the cure — the teeth
  if (!USE_MOCKS) return 'REAL';
  try { return !LS.getItem('access_token') ? 'MOCKS' : 'REAL'; } catch { return 'MOCKS'; }
}
function curedMemberFeedGate(USE_MOCKS) {   // journey.ts fetchMemberFeed AFTER
  const hasToken = !!getAccessToken();
  return (isBrideDemoMode() || (USE_MOCKS && !hasToken)) ? 'MOCKS' : 'REAL';
}
function preCureMemberFeedGate(USE_MOCKS) { // fetchMemberFeed BEFORE — the teeth
  const hasToken = !!LS.getItem('access_token');
  return (USE_MOCKS && !hasToken) ? 'MOCKS' : 'REAL';
}

function setState(demo, token) {
  for (const k of Object.keys(store)) delete store[k];
  if (demo)  store['tdw_bride_demo_session'] = JSON.stringify({ demo: true, couple_id: 'demo-couple-1', bride_name: 'Priya' });
  if (token) store['access_token'] = 'real.jwt.value';
}

console.log('\n\u00a72  THE FOUR STATES \u2014 lib/frost/journey.ts, one code path');

// STATE (i) — demo blob, no real token. The clean demo device.
{
  setState(true, false);
  for (const env of [true, false]) {
    curedGate(env) === 'MOCKS'
      ? ok(`(i)  demo, no token, USE_MOCKS=${env} \u2192 MOCKS`)
      : bad(`(i)  demo, no token, USE_MOCKS=${env} \u2192 ${curedGate(env)}`);
    curedMemberFeedGate(env) === 'MOCKS'
      ? ok(`(i)  memberFeed, USE_MOCKS=${env} \u2192 MOCKS`)
      : bad(`(i)  memberFeed, USE_MOCKS=${env} \u2192 ${curedMemberFeedGate(env)}`);
  }
}

// STATE (ii) — demo blob AND a real token. THE CONTAMINATION CASE.
{
  setState(true, true);
  for (const env of [true, false]) {
    curedGate(env) === 'MOCKS'
      ? ok(`(ii) demo + REAL token, USE_MOCKS=${env} \u2192 MOCKS (contamination closed)`)
      : bad(`(ii) demo + REAL token, USE_MOCKS=${env} \u2192 ${curedGate(env)}`);
    curedMemberFeedGate(env) === 'MOCKS'
      ? ok(`(ii) memberFeed, USE_MOCKS=${env} \u2192 MOCKS`)
      : bad(`(ii) memberFeed, USE_MOCKS=${env} \u2192 ${curedMemberFeedGate(env)}`);
  }
  // THE TEETH — the pre-cure gate wrote REAL rows to the REAL couple here.
  for (const env of [true, false]) {
    preCureGate(env) === 'REAL'
      ? ok(`(ii) TEETH: pre-cure gate, USE_MOCKS=${env} \u2192 REAL \u2014 F-05.39's disease, reproduced`)
      : bad(`(ii) TEETH: pre-cure gate, USE_MOCKS=${env} \u2192 ${preCureGate(env)} (expected REAL)`);
    preCureMemberFeedGate(env) === 'REAL'
      ? ok(`(ii) TEETH: pre-cure memberFeed, USE_MOCKS=${env} \u2192 REAL`)
      : bad(`(ii) TEETH: pre-cure memberFeed, USE_MOCKS=${env} \u2192 ${preCureMemberFeedGate(env)}`);
  }
}

// STATE (iii) — a real session, no demo blob. The bride who actually logged in.
{
  setState(false, true);
  for (const env of [true, false]) {
    curedGate(env) === 'REAL'
      ? ok(`(iii) real session, USE_MOCKS=${env} \u2192 REAL`)
      : bad(`(iii) real session, USE_MOCKS=${env} \u2192 ${curedGate(env)}`);
    curedMemberFeedGate(env) === 'REAL'
      ? ok(`(iii) memberFeed, USE_MOCKS=${env} \u2192 REAL`)
      : bad(`(iii) memberFeed, USE_MOCKS=${env} \u2192 ${curedMemberFeedGate(env)}`);
  }
  // Both-ways: the cure must not have made everything mocks.
  curedGate(false) === 'REAL' && curedGate(true) === 'REAL'
    ? ok('(iii) both-ways: the cure did NOT blanket-mock a real session')
    : bad('(iii) both-ways FAILED');
}

// STATE (iv) — neither. The logged-out non-demo visitor: the ONLY behaviour the
// unreadable Vercel NEXT_PUBLIC_USE_MOCKS still decides. Asserted in BOTH worlds,
// and asserted UNCHANGED by this cure.
{
  setState(false, false);
  curedGate(true) === 'MOCKS'
    ? ok('(iv) logged-out, USE_MOCKS=true  \u2192 MOCKS (env-controlled, unwitnessed value)')
    : bad(`(iv) logged-out, USE_MOCKS=true \u2192 ${curedGate(true)}`);
  curedGate(false) === 'REAL'
    ? ok('(iv) logged-out, USE_MOCKS=false \u2192 REAL  (env-controlled, unwitnessed value)')
    : bad(`(iv) logged-out, USE_MOCKS=false \u2192 ${curedGate(false)}`);
  curedGate(true) === preCureGate(true) && curedGate(false) === preCureGate(false)
    ? ok('(iv) UNCHANGED by this cure in both worlds \u2014 no env-dependent surprise shipped')
    : bad('(iv) the cure moved the logged-out non-demo behaviour \u2014 not chartered');
}

console.log('');
if (fail === 0) { console.log('F-05.39 DEMO AUTHORITY: ALL GREEN'); process.exit(0); }
else { console.log(`F-05.39 DEMO AUTHORITY: ${fail} FAILURE(S)`); process.exit(1); }
