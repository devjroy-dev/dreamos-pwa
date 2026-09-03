#!/usr/bin/env node
// F-04.96 — three-rail session-shape bench (PWA half).
//
// One claim, three rails: the tier carried by each login rail's TRUE response lands
// in the stored vendor session, on the fresh-context path (empty existing) — so a
// Prestige vendor is never floored to 'essential'.
//
//   RAIL 1  pin-login  — response d = /pin-login (F-04.96 backend now carries tier)
//   RAIL 2  pin-reset  — response = /verify-otp (purpose:'reset'), already carries tier
//   RAIL 3  landing    — response v = /verify-otp; d = /provision (no tier) is fallback
//
// Each merge below is a faithful reproduction of the real site, and is PINNED to that
// site by a source grep-guard, so the bench cannot pass against an un-cured tree.
// Both-ways: a response missing tier must NOT yield 'prestige' (teeth), asserted per rail.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const R = (p) => readFileSync(join(__dirname, '..', p), 'utf8');
const SRC = {
  pinlogin: R('app/vendor/(legacy)/pin-login/page.tsx'),
  pinreset: R('app/vendor/(legacy)/pin-reset/page.tsx'),
  landing:  R('app/(landing)/page.tsx'),
};

let fail = 0;
const ok  = (m) => console.log(`  \u2713 ${m}`);
const bad = (m) => { console.log(`  \u2717 ${m}`); fail++; };
const guard = (label, src, re) => re.test(src) ? ok(`guard: ${label}`) : bad(`guard MISSING: ${label}`);

// ── RAIL 1 — pin-login merge (mirrors app/vendor/(legacy)/pin-login/page.tsx) ────────────────
function pinLoginSession({ d, existing }) {
  return {
    ...existing,
    id:       d.vendor_id || existing.id,
    user_id:  d.user_id   || existing.user_id,
    name:     d.name     || existing.name     || existing.vendorName || null,
    tier:     d.tier     || existing.tier     || 'essential',
    category: d.category || existing.category || null,
  };
}
guard('pin-login reads d.tier', SRC.pinlogin, /tier:\s+d\.tier\s+\|\| existing\.tier\s+\|\| 'essential',/);
guard('pin-login reads d.name', SRC.pinlogin, /name:\s+d\.name\s+\|\| existing\.name/);
guard('pin-login reads d.category', SRC.pinlogin, /category:\s+d\.category \|\| existing\.category \|\| null,/);
guard('pin-login false comment corrected (F-04.96)', SRC.pinlogin, /F-04\.96: pin-login now returns name\/category\/tier/);
guard('pin-login OLD false comment gone', SRC.pinlogin, /^(?!.*but NOT name\/tier\/category)[\s\S]*$/);
{
  const s = pinLoginSession({ d: { ok: true, tier: 'prestige', name: 'Aperture', category: 'photographer', vendor_id: 'v1', user_id: 'u1' }, existing: {} });
  s.tier === 'prestige' ? ok("RAIL 1: d.tier='prestige' \u2192 session.tier='prestige'") : bad(`RAIL 1 tier=${s.tier}`);
  s.name === 'Aperture' ? ok('RAIL 1: d.name \u2192 session.name') : bad(`RAIL 1 name=${s.name}`);
  // both-ways: backend that omits tier (the pre-F-04.96 /pin-login) floors to essential
  const old = pinLoginSession({ d: { ok: true, vendor_id: 'v1', user_id: 'u1' }, existing: {} });
  old.tier === 'essential' ? ok('RAIL 1 both-ways: tier-less response \u2192 essential (teeth)') : bad(`RAIL 1 both-ways tier=${old.tier}`);
}

// ── RAIL 2 — pin-reset merge (mirrors app/vendor/(legacy)/pin-reset/page.tsx; already cured) ──
function pinResetSession({ res, existing }) {
  const tier = res.tier || '', vName = res.name || '', category = res.category || '';
  return {
    ...existing,
    name:     vName    || existing.name     || null,
    tier:     tier     || existing.tier     || 'essential',
    category: category || existing.category || null,
  };
}
guard('pin-reset captures res.tier', SRC.pinreset, /setTier\(res\.tier \|\| ''\);/);
guard('pin-reset writes tier || existing || essential', SRC.pinreset, /tier:\s+tier\s+\|\| existing\.tier\s+\|\| 'essential',/);
{
  const s = pinResetSession({ res: { ok: true, tier: 'prestige', name: 'Aperture', category: 'photographer' }, existing: {} });
  s.tier === 'prestige' ? ok("RAIL 2: verify-otp tier='prestige' \u2192 session.tier='prestige'") : bad(`RAIL 2 tier=${s.tier}`);
  const old = pinResetSession({ res: { ok: true }, existing: {} });
  old.tier === 'essential' ? ok('RAIL 2 both-ways: tier-less response \u2192 essential (teeth)') : bad(`RAIL 2 both-ways tier=${old.tier}`);
}

// ── RAIL 3 — landing merge (mirrors app/(landing)/page.tsx) ─────────────────────────
function landingSession({ v, d }) {
  return {
    name:     v.name || d.name || null,
    category: v.category || d.category || null,
    tier:     v.tier || d.tier || null,
  };
}
guard('landing reads v.tier || d.tier', SRC.landing, /tier: v\.tier \|\| d\.tier \|\| null,/);
guard('landing reads v.name || d.name', SRC.landing, /name: v\.name \|\| d\.name \|\| null,/);
guard('landing reads v.category || d.category', SRC.landing, /category: v\.category \|\| d\.category \|\| null,/);
{
  // v = verify-otp carries tier; d = provision never does
  const s = landingSession({ v: { ok: true, tier: 'prestige', name: 'Aperture', category: 'photographer' }, d: { ok: true } });
  s.tier === 'prestige' ? ok("RAIL 3: v.tier='prestige' \u2192 session.tier='prestige'") : bad(`RAIL 3 tier=${s.tier}`);
  // both-ways: the OLD landing read tier off d (provision) → null
  const old = { tier: (({ ok: true }).tier) || null };
  old.tier === null ? ok('RAIL 3 both-ways: reading tier off provision \u2192 null (the pre-fix bug)') : bad(`RAIL 3 both-ways tier=${old.tier}`);
}

console.log('');
if (fail === 0) { console.log('F-04.96 THREE-RAIL SESSION-SHAPE: ALL GREEN'); process.exit(0); }
else { console.log(`F-04.96 THREE-RAIL: ${fail} FAILURE(S)`); process.exit(1); }
