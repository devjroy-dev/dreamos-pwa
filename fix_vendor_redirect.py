# fix_vendor_redirect.py
# Run in: /workspaces/dreamos-pwa
#
# Changes vendor post-login redirect from /vendor/today to
# thedreamai.in/wedding/auth/handoff with JWT passthrough.
# Touches two files: pin-login/page.tsx and pin/page.tsx

import sys

# ── pin-login/page.tsx ────────────────────────────────────────────────────────
path1 = 'app/(auth)/vendor/pin-login/page.tsx'
with open(path1, 'r') as f:
    src1 = f.read()

if 'handoff' in src1:
    print(f'SKIP {path1} — already patched')
else:
    old1 = "        router.replace('/vendor/today');"
    new1 = """        // Handoff to thedreamai.in with JWT — single sign-in across domains.
        // The handoff page reads the token, writes vendor_session to localStorage
        // in dreamai format, then redirects to /wedding.
        const s = JSON.parse(localStorage.getItem('vendor_web_session') || '{}');
        const token   = s.access_token  || '';
        const refresh = s.refresh_token || '';
        const params  = new URLSearchParams({ token, refresh });
        window.location.href = `https://thedreamai.in/wedding/auth/handoff?${params}`;"""

    if old1 not in src1:
        print(f'ERROR: redirect pattern not found in {path1}')
        sys.exit(1)

    src1 = src1.replace(old1, new1)
    with open(path1, 'w') as f:
        f.write(src1)
    print(f'✓ {path1} — redirect → handoff')

# ── pin/page.tsx ──────────────────────────────────────────────────────────────
path2 = 'app/(auth)/vendor/pin/page.tsx'
with open(path2, 'r') as f:
    src2 = f.read()

if 'handoff' in src2:
    print(f'SKIP {path2} — already patched')
else:
    # Two occurrences in pin/page.tsx
    old2a = "      if (s?.pin_set) { router.replace('/vendor/today'); return; }"
    new2a = """      if (s?.pin_set) {
        // Already has PIN — handoff directly to dreamai
        const params = new URLSearchParams({ token: s.access_token || '', refresh: s.refresh_token || '' });
        window.location.href = `https://thedreamai.in/wedding/auth/handoff?${params}`;
        return;
      }"""

    old2b = "        router.replace('/vendor/today');"
    new2b = """        const s2 = JSON.parse(localStorage.getItem('vendor_web_session') || '{}');
        const params = new URLSearchParams({ token: s2.access_token || '', refresh: s2.refresh_token || '' });
        window.location.href = `https://thedreamai.in/wedding/auth/handoff?${params}`;"""

    if old2a not in src2:
        print(f'ERROR: first pattern not found in {path2}')
        sys.exit(1)
    if old2b not in src2:
        print(f'ERROR: second pattern not found in {path2}')
        sys.exit(1)

    src2 = src2.replace(old2a, new2a)
    src2 = src2.replace(old2b, new2b)
    with open(path2, 'w') as f:
        f.write(src2)
    print(f'✓ {path2} — both redirects → handoff')

print('\nDone. Run: npx tsc --noEmit && echo OK')
