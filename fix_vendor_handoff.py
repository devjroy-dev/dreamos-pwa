#!/usr/bin/env python3
"""
Fix vendor SSO handoff — dreamos-pwa
The pin-login page reads access_token/refresh_token from the session object
(which doesn't have them) instead of from localStorage directly.
Drop in dreamos-pwa repo root. Run: python3 fix_vendor_handoff.py
"""
import subprocess, sys

PATH = "app/(auth)/vendor/pin-login/page.tsx"

with open(PATH, 'r') as f:
    src = f.read()

OLD = """        const s = JSON.parse(localStorage.getItem('vendor_web_session') || '{}');
        const token   = s.access_token  || '';
        const refresh = s.refresh_token || '';
        const params  = new URLSearchParams({ token, refresh });
        window.location.href = `https://thedreamai.in/wedding/auth/handoff?${params}`;"""

NEW = """        // Read tokens directly from localStorage — they are stored under their own keys,
        // NOT inside the vendor_web_session object.
        const token   = localStorage.getItem('access_token')  || '';
        const refresh = localStorage.getItem('refresh_token') || '';
        const params  = new URLSearchParams({ token, refresh });
        window.location.href = `https://thedreamai.in/wedding/auth/handoff?${params}`;"""

if OLD not in src:
    print('ERROR: anchor not found — already fixed or file differs')
    print('Searching for nearby lines...')
    for line in src.split('\n'):
        if 'access_token' in line or 'handoff' in line:
            print(' ', repr(line))
    sys.exit(1)

src = src.replace(OLD, NEW, 1)

with open(PATH, 'w') as f:
    f.write(src)

print('Patched', PATH)

result = subprocess.run(['npx', '--no-install', 'tsc', '--noEmit'], capture_output=True, text=True)
if result.returncode != 0:
    print('TSC ERRORS:')
    print(result.stdout)
    sys.exit(1)

print('tsc PASS\n')
print('Run next:')
print('  git add "app/(auth)/vendor/pin-login/page.tsx"')
print('  git commit -m "fix(vendor-auth): read JWT from localStorage not session object for SSO handoff"')
print('  git push origin main')
