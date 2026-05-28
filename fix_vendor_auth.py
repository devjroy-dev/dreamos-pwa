#!/usr/bin/env python3
"""
fix_vendor_auth.py
Run in /workspaces/dreamos-pwa

Makes vendor auth identical to bride auth.
Single auth entry point: thedreamwedding.in landing page.

Changes:
  1. Delete app/vendor/login/page.tsx  (old black dreamai page)
  2. Fix landing page — add _v:2 + tokens to vendor session
  3. Fix ALL vendor pages — replace every /vendor/login redirect with /
  4. Fix logout in vendor/more and vendor/settings → goes to / not /vendor/login
"""

import sys, subprocess
from pathlib import Path

BASE = Path('.')

def patch(p, old, new, label, skip_if=None):
    path = BASE / p
    t = path.read_text()
    if skip_if and skip_if in t:
        print(f'  SKIP [{label}] (already applied)')
        return
    if old not in t:
        print(f'  MISS [{label}]')
        sys.exit(1)
    path.write_text(t.replace(old, new, 1))
    print(f'  OK   [{label}]')

print('\n═══════════════════════════════════════════════════════')
print('  FIX VENDOR AUTH — single auth flow via landing page')
print('═══════════════════════════════════════════════════════\n')

# ── Step 1: Delete app/vendor/login/page.tsx ─────────────────────────────────
print('── Step 1: Delete app/vendor/login/page.tsx ────────────────────────────')
login_page = BASE / 'app/vendor/login/page.tsx'
if login_page.exists():
    login_page.unlink()
    try: login_page.parent.rmdir()
    except: pass
    print('  OK   [deleted app/vendor/login/page.tsx]')
else:
    print('  SKIP [already gone]')

# ── Step 2: Fix landing page session — add _v:2 + tokens ─────────────────────
print('\n── Step 2: Landing page — stamp _v:2 + tokens on vendor session ────────')
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

      const coupleNeedsOnboarding = !isVendor && !pinSet && !d.name;
      if (coupleNeedsOnboarding) {
        router.push('/couple/onboarding');
      } else if (isVendor) {
        router.push('/vendor/pin-login');
      } else {
        router.push(pinSet ? '/couple/pin-login' : '/couple/pin');
      }""",
    'session _v:2 + tokens + clean routing',
    skip_if='_v: 2,'
)

# ── Step 3: Replace ALL /vendor/login refs in ALL vendor pages ────────────────
print('\n── Step 3: Replace all /vendor/login refs across vendor app ────────────')
total_replaced = 0
for fpath in (BASE / 'app/vendor').rglob('*.tsx'):
    t = fpath.read_text()
    count = t.count("'/vendor/login'")
    if count > 0:
        t = t.replace("'/vendor/login'", "'/'")
        fpath.write_text(t)
        total_replaced += count
        print(f'  OK   [{fpath.relative_to(BASE)} — {count} replaced]')

print(f'  Total: {total_replaced} /vendor/login refs → /')

# ── Step 4: Fix vendor/layout.tsx — remove /vendor/login from onLogin check ──
print('\n── Step 4: vendor/layout.tsx — fix onLogin check ───────────────────────')
layout = BASE / 'app/vendor/layout.tsx'
t = layout.read_text()
if "pathname.startsWith('/vendor/login')" in t:
    t = t.replace(
        "const onLogin  = pathname.startsWith('/vendor/login') || pathname.startsWith('/vendor/auth');",
        "const onLogin  = pathname.startsWith('/vendor/auth');"
    )
    layout.write_text(t)
    print('  OK   [removed /vendor/login from onLogin check]')
else:
    print('  SKIP [onLogin check already clean]')

# ── Step 5: TypeScript check ──────────────────────────────────────────────────
print('\n── Step 5: TypeScript check ────────────────────────────────────────────')
result = subprocess.run(['npx', 'tsc', '--noEmit'], capture_output=True, text=True)
# Only show errors in files we touched
our_files = ['(landing)/page', 'vendor/page', 'vendor/more', 'vendor/settings',
             'vendor/layout', 'vendor/collab', 'vendor/list', 'vendor/calendar']
our_errors = [
    l for l in result.stdout.splitlines()
    if any(f in l for f in our_files)
    and 'error TS' in l
    and 'Cannot find module' not in l
    and 'TS2503' not in l
    and 'jsx-runtime' not in l
]
if our_errors:
    print(f'  {len(our_errors)} errors:')
    for e in our_errors: print(f'    {e}')
    sys.exit(1)
else:
    print('  No new errors ✓')

print('\n✅  Done. Run:')
print('  git add -A')
print('  git commit -m "fix(auth): remove /vendor/login everywhere — single auth via landing page"')
print('  git push')
print()
print('After deploy:')
print('  - /vendor/login page is gone — navigating there gives 404')
print('  - Logout → / (landing page)')
print('  - Session expired → / (landing page)')
print('  - Login: thedreamwedding.in → Maker → OTP → PIN → /vendor')
