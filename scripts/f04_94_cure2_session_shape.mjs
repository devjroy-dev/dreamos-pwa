#!/usr/bin/env node
// F-04.94 CURE 2b — session-shape assertion (the charter's required proof).
// Claim under test: the tier/name/category carried by the /verify-otp reset
// response lands in the STORED vendor session, on the fresh-context path
// (empty existing session) — i.e. a Prestige vendor is NOT defaulted to
// 'essential' after a PIN reset.
//
// This assertion is pinned to real code two ways:
//   (1) it greps the cured pin-reset source to confirm the capture + write
//       lines are actually present (so the assertion can't pass against an
//       un-cured tree);
//   (2) it reproduces the exact merge expression and evaluates it on fixtures.
//
// Both-ways: run once against the cured file (must pass), and the harness
// re-runs it against a synthetically un-cured merge (must fail) to prove
// non-vacuity.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RESET_SRC = join(__dirname, '..', 'app', 'vendor', '(legacy)', 'pin-reset', 'page.tsx');  // P7.2: the auth screens live in the (legacy) route group

let failures = 0;
const ok   = (m) => console.log(`  \u2713 ${m}`);
const bad  = (m) => { console.log(`  \u2717 ${m}`); failures++; };

// ── Guard 1: the cured lines are present in the real source ────────────────
const src = readFileSync(RESET_SRC, 'utf8');

const capture = [
  /setTier\(res\.tier \|\| ''\);/,
  /setVName\(res\.name \|\| ''\);/,
  /setCategory\(res\.category \|\| ''\);/,
];
for (const re of capture) {
  if (re.test(src)) ok(`capture present: ${re.source}`);
  else bad(`capture MISSING: ${re.source}`);
}

const write = [
  /name:\s+vName\s+\|\| existing\.name\s+\|\| null,/,
  /tier:\s+tier\s+\|\| existing\.tier\s+\|\| 'essential',/,
  /category:\s+category \|\| existing\.category \|\| null,/,
];
for (const re of write) {
  if (re.test(src)) ok(`write present: ${re.source}`);
  else bad(`write MISSING: ${re.source}`);
}

// ── The exact cured merge, reproduced for semantic evaluation ──────────────
// Mirrors app/vendor/pin-reset/page.tsx submitPin() success write.
function buildResetSession({ res, existing }) {
  // captured from the verify-otp response (verifyCode step)
  const tier     = res.tier     || '';
  const vName    = res.name     || '';
  const category = res.category || '';
  return {
    ...existing,
    name:     vName    || existing.name     || null,
    tier:     tier     || existing.tier     || 'essential',
    category: category || existing.category || null,
  };
}

// ── Case i: fresh context (empty existing) — Prestige survives ─────────────
{
  const res = { ok: true, tier: 'prestige', name: 'Aperture Studio', category: 'Photographer',
                vendor_id: 'v1', user_id: 'u1', access_token: 'a', refresh_token: 'r' };
  const s = buildResetSession({ res, existing: {} });
  if (s.tier === 'prestige') ok("case i: fresh-context Prestige lands tier='prestige' (no default-down)");
  else bad(`case i: expected 'prestige', got '${s.tier}'`);
  if (s.name === res.name) ok('case i: response.name lands in session');
  else bad(`case i: name mismatch, got '${s.name}'`);
  if (s.category === res.category) ok('case i: response.category lands in session');
  else bad(`case i: category mismatch, got '${s.category}'`);
}

// ── Case ii: response tier overrides a stale existing tier ─────────────────
{
  const res = { ok: true, tier: 'prestige' };
  const existing = { tier: 'essential', name: 'Old Name' };
  const s = buildResetSession({ res, existing });
  if (s.tier === 'prestige') ok("case ii: response tier overrides stale existing 'essential'");
  else bad(`case ii: expected 'prestige', got '${s.tier}'`);
}

// ── Case iii: response absent tier → existing preserved → then default ─────
{
  const s1 = buildResetSession({ res: { ok: true }, existing: { tier: 'signature' } });
  if (s1.tier === 'signature') ok('case iii: no response tier \u2192 existing preserved');
  else bad(`case iii: expected 'signature', got '${s1.tier}'`);

  const s2 = buildResetSession({ res: { ok: true }, existing: {} });
  if (s2.tier === 'essential') ok("case iii: no response, no existing \u2192 'essential' floor");
  else bad(`case iii: expected 'essential', got '${s2.tier}'`);
}

console.log('');
if (failures === 0) { console.log('CURE-2b SESSION-SHAPE: ALL GREEN'); process.exit(0); }
else { console.log(`CURE-2b SESSION-SHAPE: ${failures} FAILURE(S)`); process.exit(1); }
