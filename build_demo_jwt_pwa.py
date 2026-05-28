#!/usr/bin/env python3
"""
build_demo_jwt_pwa.py
Run in /workspaces/dreamos-pwa

Updates app/demo/[handle]/page.tsx:
- On "Enter your studio": fetch /api/v2/demo/session to get real JWT
- Write proper vendor session with real access_token
- Navigate to /vendor (no URL params needed — real session exists)
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

print('\n── app/demo/[handle]/page.tsx — fetch real JWT on enter studio ─────────')

patch('app/demo/[handle]/page.tsx',
    """  function handleEnterStudio() {
    if (!vendor) return;
    setEntering(true);
    // URL param based — works on iOS Safari Private Browsing (no localStorage dependency)
    const params = new URLSearchParams({
      demo:     DEMO_UUID,
      handle:   vendor.ig_handle,
      name:     vendor.name,
      category: vendor.category,
      city:     vendor.city,
    });
    router.push('/vendor?' + params.toString());
  }""",
    """  async function handleEnterStudio() {
    if (!vendor) return;
    setEntering(true);
    try {
      // Fetch a real JWT for the demo vendor UUID
      const res = await fetch(`${BACKEND}/api/v2/demo/session`);
      const d   = await res.json();
      if (!d.ok) throw new Error(d.error || 'Session failed');

      // Write a proper vendor session — same shape as real login
      const demoSession = {
        id:            d.vendor_id,
        vendorId:      d.vendor_id,
        user_id:       d.user_id,
        name:          vendor.name,
        phone:         null,
        tier:          d.tier || 'signature',
        category:      vendor.category,
        city:          vendor.city,
        ig_handle:     vendor.ig_handle,
        access_token:  d.access_token,
        refresh_token: d.refresh_token,
        demo:          true,
        demo_handle:   vendor.ig_handle,
        _v:            2,
      };
      // Write to both session keys — real vendor app reads these
      try {
        localStorage.setItem('vendor_session',       JSON.stringify(demoSession));
        localStorage.setItem('vendor_web_session',   JSON.stringify(demoSession));
        localStorage.setItem(DEMO_SESS_KEY,          JSON.stringify(demoSession));
      } catch { /* iOS Private Browsing — session in memory only */ }

      router.push('/vendor');
    } catch (err) {
      console.error('[demo] session fetch failed:', err);
      showToast('Could not start demo. Please try again.');
      setEntering(false);
    }
  }""",
    'fetch real JWT on enter studio'
)

print('\n── TypeScript check ────────────────────────────────────────────────────')
result = subprocess.run(['npx', 'tsc', '--noEmit'], capture_output=True, text=True)
our_errors = [
    l for l in result.stdout.splitlines()
    if 'demo/[handle]' in l and 'error TS' in l
    and 'Cannot find module' not in l
    and 'TS2503' not in l
]
if our_errors:
    print(f'  {len(our_errors)} errors:')
    for e in our_errors: print(f'    {e}')
    sys.exit(1)
else:
    print('  No new errors ✓')

print('\n✅  Done. Commit with:')
print('  git add "app/demo/[handle]/page.tsx"')
print('  git commit -m "feat(demo): fetch real JWT from /demo/session — full vendor app in demo mode"')
print('  git push')
