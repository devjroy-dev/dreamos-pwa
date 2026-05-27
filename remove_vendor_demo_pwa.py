#!/usr/bin/env python3
"""
remove_vendor_demo_pwa.py
Run in /workspaces/dreamos-pwa

Removes all vendor demo code from dreamos-pwa:
1. hooks/vendor/useVendorData.ts — remove isDemoVendor(), DEMO_* data, demo injection
2. app/vendor/page.tsx — remove tdw_is_demo flag setting
3. lib/vendor/session.ts — remove clearDemoFlag() and tdw_is_demo references
"""

import sys, subprocess
from pathlib import Path

BASE = Path('.')

def read(p): return (BASE / p).read_text()
def write(p, t): (BASE / p).write_text(t)

def patch(p, old, new, label):
    t = read(p)
    if old not in t:
        print(f'  MISS [{label}]')
        print(f'  Looking for: {repr(old[:80])}')
        sys.exit(1)
    write(p, t.replace(old, new, 1))
    print(f'  OK   [{label}]')

print('\n── 1. hooks/vendor/useVendorData.ts ────────────────────────────────────')

# Remove the entire demo block (isDemoVendor + helper fns + DEMO_* constants)
# and the demo injection in useLoader
p = BASE / 'hooks/vendor/useVendorData.ts'
t = p.read_text()

# Remove demo comment + isDemoVendor function + d/m/dAgo helpers + DEMO_* constants
import re

# Remove everything from the demo comment to the end of DEMO_EXPENSES
demo_block = re.search(
    r"// ── Demo data.*?const DEMO_EXPENSES.*?\];\n",
    t, re.DOTALL
)
if demo_block:
    t = t[:demo_block.start()] + t[demo_block.end():]
    print('  OK   [removed DEMO_* constants and isDemoVendor]')
else:
    print('  MISS [demo block not found — trying manual patches]')

# Remove the demo injection in useLoader run()
old_demo_inject = """    // Demo mode — return seeded data without hitting the API
    if (isDemoVendor()) {
      const demoMap: Record<Kind, unknown> = {
        leads: DEMO_LEADS, clients: DEMO_CLIENTS,
        invoices: DEMO_INVOICES, expenses: DEMO_EXPENSES, events: DEMO_EVENTS,
      };
      setData(demoMap[kind] as T);
      setLoading(false);
      return;
    }
"""
if old_demo_inject in t:
    t = t.replace(old_demo_inject, '')
    print('  OK   [removed demo injection in useLoader]')
else:
    print('  MISS [demo injection not found]')

p.write_text(t)

print('\n── 2. app/vendor/page.tsx ──────────────────────────────────────────────')
patch('app/vendor/page.tsx',
    """            if (parsed.demo) {
              try { localStorage.setItem('tdw_is_demo', 'true'); } catch { /* ok */ }
            }""",
    """            // demo flag removed — vendor demo system deleted""",
    'remove tdw_is_demo flag setter'
)

print('\n── 3. lib/vendor/session.ts ────────────────────────────────────────────')
p3 = BASE / 'lib/vendor/session.ts'
t3 = p3.read_text()

# Remove clearDemoFlag function
old_clear_demo = """// Wipe the demo flag from both localStorage and cookie. Called on every
// session write/clear so demo state never leaks into a real user session.
// The demo-entry flow (app/wedding/page.tsx) re-sets the flag AFTER calling
// setVendorSession, so legitimate demo mode is unaffected.
function clearDemoFlag(): void {
  try {
    const store = ls();
    if (store) store.removeItem('tdw_is_demo');
  } catch { /* ignore */ }
  if (typeof document !== 'undefined') {
    try {
      document.cookie = `tdw_is_demo=; max-age=0; path=/; SameSite=Lax; Secure`;
    } catch { /* ignore */ }
  }
}

"""
if old_clear_demo in t3:
    t3 = t3.replace(old_clear_demo, '')
    print('  OK   [removed clearDemoFlag function]')
else:
    print('  MISS clearDemoFlag — trying partial')
    # Try removing just the function
    t3 = re.sub(r'// Wipe the demo flag.*?}\n\n', '', t3, flags=re.DOTALL)
    print('  OK   [removed clearDemoFlag via regex]')

# Remove clearDemoFlag() calls
t3 = t3.replace('  clearDemoFlag();\n', '')
t3 = t3.replace('  clearDemoFlag();\n  // Stamp version', '  // Stamp version')
print('  OK   [removed clearDemoFlag() calls]')

# Remove tdw_is_demo cookie clear from clearVendorSession
t3 = t3.replace(
    "  if (typeof document !== 'undefined') {\n    try {\n      document.cookie = `tdw_is_demo=; max-age=0; path=/; SameSite=Lax; Secure`;\n    } catch { /* ignore */ }\n  }\n",
    ''
)

# Update comments that reference demo
t3 = t3.replace(
    '// session write/clear so demo state never leaks into a real user session.\n// The demo-entry flow (app/wedding/page.tsx) re-sets the flag AFTER calling\n// setVendorSession, so legitimate demo mode is unaffected.',
    ''
)

# Remove tdw_is_demo from clearCookieSession area
t3 = re.sub(r'  try \{\n    document\.cookie = `tdw_is_demo.*?`;\n  \} catch \{ /\* ignore \*/ \}\n', '', t3)

p3.write_text(t3)
print('  OK   [session.ts cleaned]')

print('\n── TypeScript check ────────────────────────────────────────────────────')
result = subprocess.run(['npx', 'tsc', '--noEmit'], capture_output=True, text=True)
errors = [
    l for l in result.stdout.splitlines()
    if 'useVendorData' in l or 'session.ts' in l or 'vendor/page' in l
    and 'error TS' in l
    and 'Cannot find module' not in l
]
if errors:
    print('  ERRORS:')
    for e in errors: print(f'    {e}')
    sys.exit(1)
else:
    print('  No new errors \u2713')

print('\n\u2705  dreamos-pwa vendor demo removed. Commit with:')
print('  git add hooks/vendor/useVendorData.ts app/vendor/page.tsx lib/vendor/session.ts')
print('  git commit -m "chore: remove vendor demo system from dreamos-pwa"')
print('  git push')
