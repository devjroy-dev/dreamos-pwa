#!/usr/bin/env python3
"""
fix_vendor_auth.py
Run in /workspaces/dreamos-pwa

Makes vendor auth identical to bride auth:
  Landing page → OTP → /vendor/pin-login (PIN) → /vendor

Changes:
  1. Delete app/vendor/login/page.tsx  (old black dreamai login — dead)
  2. Fix landing page session write — add _v:2 + tokens (same as couple)
  3. Fix landing page routing — remove vendor onboarding redirect to /vendor/login
  4. Fix vendor/page.tsx — replace all /vendor/login redirects with /
"""

import sys, subprocess
from pathlib import Path

BASE = Path('.')

def patch(p, old, new, label):
    path = BASE / p
    t = path.read_text()
    if old not in t:
        print(f'  MISS [{label}]')
        print(f'  Looking for: {repr(old[:80])}')
        sys.exit(1)
    path.write_text(t.replace(old, new, 1))
    print(f'  OK   [{label}]')

print('\n═══════════════════════════════════════════════════════')
print('  FIX VENDOR AUTH — make identical to bride/frost')
print('═══════════════════════════════════════════════════════\n')

# ── Step 1: Delete app/vendor/login/page.tsx ──────────────────────────────────
print('── Step 1: Delete app/vendor/login/page.tsx ────────────────────────────')
login_page = BASE / 'app/vendor/login/page.tsx'
if login_page.exists():
    login_page.unlink()
    try: login_page.parent.rmdir()
    except: pass
    print('  OK   [deleted app/vendor/login/page.tsx]')
else:
    print('  SKIP [already gone]')

# ── Step 2: Fix landing page session write ────────────────────────────────────
print('\n── Step 2: Landing page — add _v:2 + tokens to vendor session ──────────')
patch('app/(landing)/page.tsx',
    """      const sessionKey = isVendor ? 'vendor_web_session' : 'couple_web_session';
      const sessionData = {
        id: roleId, userId, vendorId: roleId,
        phone: e164,
        pin_set: pinSet,
        name: d.name || null,
        vendorName: d.name || null,
        category: d.category || null,
        tier: d.tier || null,
        dreamer_type: d.dreamer_type || 'basic',
      };
      localStorage.setItem(sessionKey, JSON.stringify(sessionData));
      localStorage.setItem(isVendor ? 'vendor_session' : 'couple_session', JSON.stringify(sessionData));

      const vendorNeedsOnboarding = isVendor && !pinSet && !d.name;
      const coupleNeedsOnboarding = !isVendor && !pinSet && !d.name;
      if (vendorNeedsOnboarding) {
        router.push('/vendor/login');
      } else if (coupleNeedsOnboarding) {
        router.push('/couple/onboarding');
      } else {
        router.push(pinSet
          ? (isVendor ? '/vendor/pin-login' : '/couple/pin-login')
          : (isVendor ? '/vendor/pin-login' : '/couple/pin'));
      }""",
    """      const sessionKey = isVendor ? 'vendor_web_session' : 'couple_web_session';
      const sessionData = {
        id: roleId, userId, vendorId: roleId,
        phone: e164,
        pin_set: pinSet,
        name: d.name || null,
        vendorName: d.name || null,
        category: d.category || null,
        tier: d.tier || null,
        dreamer_type: d.dreamer_type || 'basic',
        access_token:  d.access_token  || null,
        refresh_token: d.refresh_token || null,
        _v: 2,
      };
      localStorage.setItem(sessionKey, JSON.stringify(sessionData));
      localStorage.setItem(isVendor ? 'vendor_session' : 'couple_session', JSON.stringify(sessionData));

      // Vendor: always goes to /vendor/pin-login (PIN screen) → /vendor
      // Couple: onboarding if new, pin-login if returning, pin if no PIN set
      const coupleNeedsOnboarding = !isVendor && !pinSet && !d.name;
      if (coupleNeedsOnboarding) {
        router.push('/couple/onboarding');
      } else if (isVendor) {
        router.push('/vendor/pin-login');
      } else {
        router.push(pinSet ? '/couple/pin-login' : '/couple/pin');
      }""",
    'session write with _v:2 + tokens + clean routing'
)

# ── Step 3: Fix handleSignIn (returning vendor sign-in path) ──────────────────
print('\n── Step 3: Landing page — fix returning vendor sign-in path ────────────')
patch('app/(landing)/page.tsx',
    "        router.push(isVendor ? '/vendor/pin-login' : '/couple/pin-login');",
    "        router.push(isVendor ? '/vendor/pin-login' : '/couple/pin-login'); // pin screens → /vendor or /frost",
    'returning vendor sign-in path (already correct — confirming)'
)

# ── Step 4: Fix vendor/page.tsx — replace /vendor/login with / ───────────────
print('\n── Step 4: vendor/page.tsx — replace /vendor/login redirects with / ────')
p = BASE / 'app/vendor/page.tsx'
t = p.read_text()
count = t.count("'/vendor/login'")
if count == 0:
    print('  SKIP [no /vendor/login refs found]')
else:
    t = t.replace("'/vendor/login'", "'/'")
    p.write_text(t)
    print(f'  OK   [replaced {count} /vendor/login refs with /]')

# ── Step 5: TypeScript check ──────────────────────────────────────────────────
print('\n── Step 5: TypeScript check ────────────────────────────────────────────')
result = subprocess.run(['npx', 'tsc', '--noEmit'], capture_output=True, text=True)
our_errors = [
    l for l in result.stdout.splitlines()
    if ('(landing)' in l or 'vendor/page' in l or 'vendor/pin-login' in l)
    and 'error TS' in l
    and 'Cannot find module' not in l
    and 'jsx-runtime' not in l
]
if our_errors:
    print(f'  {len(our_errors)} errors:')
    for e in our_errors: print(f'    {e}')
    sys.exit(1)
else:
    print('  No new errors ✓')

print('\n✅  Vendor auth fixed. Commit with:')
print('  git add -A')
print('  git commit -m "fix(auth): remove legacy vendor login — single auth flow via landing page"')
print('  git push')
print()
print('After deploy — test:')
print('  1. thedreamwedding.in → Sign in as Maker → phone → OTP → PIN screen → /vendor ✅')
print('  2. No /vendor/login page exists anymore')
print('  3. Any stale session → redirects to / (landing page) not /vendor/login')
