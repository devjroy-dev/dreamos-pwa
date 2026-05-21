#!/usr/bin/env python3
"""
Founder directive — dreamos-pwa
After couple PIN login, land on Frost (/frost) not legacy bride (/couple/today).
Drop in dreamos-pwa repo root. Run: python3 b4_frost_landing.py
"""
import subprocess, sys

PATH = "app/(auth)/couple/pin-login/page.tsx"

with open(PATH, 'r') as f:
    src = f.read()

OLD = "router.replace('/couple/today');"
NEW = "router.replace('/frost');"

if OLD not in src:
    print('ERROR: anchor not found — already changed or file differs')
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
print('  git add "app/(auth)/couple/pin-login/page.tsx"')
print('  git commit -m "feat(auth): post-login redirect to Frost landing (/frost)"')
print('  git push origin main')
