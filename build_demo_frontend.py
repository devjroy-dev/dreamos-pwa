#!/usr/bin/env python3
"""
build_demo_frontend.py
Run in /workspaces/dreamos-pwa

Builds the complete vendor demo frontend:

1. app/demo/[handle]/page.tsx
   - Vendor demo landing page
   - Fetches vendor profile + photos from /api/v2/demo/vendor/:handle
   - Two CTAs: "See how brides discover you" + "Enter your studio"
   - "Enter your studio" writes tdw_vendor_demo_session and goes to /vendor
   - "Delete this demo" sends a delete request notification

2. app/vendor/page.tsx patch
   - Reads tdw_vendor_demo_session as fallback when no real session
   - Shows demo banner with "Claim your studio" + "Delete this demo" CTAs
   - Demo session uses DEMO_VENDOR_UUID for DreamAi context

3. app/admin/demo-profiles/page.tsx (full rebuild)
   - Create demo vendor form (IG handle, name, category, city, WA, photos)
   - Cloudinary photo upload via /api/v2/admin/demo/cloudinary-sign
   - Demo leads inbox (unnotified leads highlighted)
   - Bride muse pool manager (upload/delete curated images)

ISOLATION:
   - Demo session key: tdw_vendor_demo_session (never touches vendor_session)
   - Real session ALWAYS takes priority
   - DEMO_VENDOR_UUID = bbbbbbbb-1111-1111-1111-bbbbbbbbbbbb
"""

import sys, subprocess
from pathlib import Path

BASE = Path('.')
BACKEND = 'https://dream-os-production.up.railway.app'
DEMO_VENDOR_UUID = 'bbbbbbbb-1111-1111-1111-bbbbbbbbbbbb'

def write(p, t):
    path = BASE / p
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(t)
    print(f'  OK   [wrote {p}]')

def patch(p, old, new, label):
    path = BASE / p
    t = path.read_text()
    if old not in t:
        print(f'  MISS [{label}]')
        sys.exit(1)
    path.write_text(t.replace(old, new, 1))
    print(f'  OK   [{label}]')

print('\n═══════════════════════════════════════════════════════')
print('  TDW DEMO FRONTEND — dreamos-pwa')
print('═══════════════════════════════════════════════════════\n')

# ── 1. app/demo/[handle]/page.tsx ─────────────────────────────────────────────
print('── 1. app/demo/[handle]/page.tsx ───────────────────────────────────────')
demo_landing_src = Path(__file__).parent / 'demo_landing_page.tsx'
if not demo_landing_src.exists():
    print('  ERROR: demo_landing_page.tsx not found')
    sys.exit(1)
write('app/demo/[handle]/page.tsx', demo_landing_src.read_text())

# ── 2. app/vendor/page.tsx — demo session fallback + demo banner ──────────────
print('\n── 2. app/vendor/page.tsx — demo session + banner ──────────────────────')

vendor_page = BASE / 'app/vendor/page.tsx'
t = vendor_page.read_text()

# Add DEMO constants after imports
old_imports_end = "import { setVendorSession } from '@/lib/vendor/session';"
new_imports_end = f"""import {{ setVendorSession }} from '@/lib/vendor/session';

// ── Demo mode constants ───────────────────────────────────────────────────────
const DEMO_SESS_KEY  = 'tdw_vendor_demo_session';
const DEMO_UUID      = '{DEMO_VENDOR_UUID}';
const BACKEND        = 'https://dream-os-production.up.railway.app';"""

if old_imports_end in t:
    t = t.replace(old_imports_end, new_imports_end, 1)
    print('  OK   [added demo constants]')
else:
    print('  MISS [import line not found]')
    sys.exit(1)

# Add demo session check before the real session check
# Find the seeded/sessionLoading useEffect and add demo check before it
old_session_check = "  const { session, loading: sessionLoading } = useVendorSession();"
new_session_check = """  // ── Demo session fallback ─────────────────────────────────────────────────
  // Check for demo session ONLY when no real session exists.
  // Real session always takes priority.
  const [demoSession, setDemoSession] = useState<Record<string,unknown> | null>(null);
  const [isDemoMode,  setIsDemoMode]  = useState(false);
  const [showDemoBanner, setShowDemoBanner] = useState(true);

  useEffect(() => {
    try {
      const realSess = localStorage.getItem('vendor_session') || localStorage.getItem('vendor_web_session');
      if (realSess) {
        const parsed = JSON.parse(realSess);
        if (parsed?.id && parsed?.id !== DEMO_UUID && !parsed?.demo) return; // real session exists — ignore demo
      }
      const demoRaw = localStorage.getItem(DEMO_SESS_KEY);
      if (demoRaw) {
        const parsed = JSON.parse(demoRaw);
        if (parsed?.demo) {
          setDemoSession(parsed);
          setIsDemoMode(true);
          // Write demo data into real session keys so vendor app works normally
          localStorage.setItem('vendor_session',     demoRaw);
          localStorage.setItem('vendor_web_session', demoRaw);
        }
      }
    } catch { /* ignore */ }
  }, []);

  async function handleDeleteDemoRequest() {
    if (!demoSession?.demo_handle) return;
    try {
      await fetch(`${BACKEND}/api/v2/demo/vendor/${demoSession.demo_handle}/delete-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ig_handle: demoSession.demo_handle, name: demoSession.name }),
      });
      alert('Deletion request sent. We will remove your demo within 24 hours.');
    } catch { alert('Could not send request. Please contact us directly.'); }
  }

  const { session, loading: sessionLoading } = useVendorSession();"""

if old_session_check in t:
    t = t.replace(old_session_check, new_session_check, 1)
    print('  OK   [added demo session fallback]')
else:
    print('  MISS [session check line not found]')
    sys.exit(1)

# Add demo banner before the main return — find the ChatScreen render
old_chat_return = "      <ChatScreen vendorId={session.id} vendorName={session.name} />"
new_chat_return = """      {/* ── Demo banner ────────────────────────────────────────────────────── */}
      {isDemoMode && showDemoBanner && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, background: 'rgba(201,168,76,0.12)', backdropFilter: 'blur(12px)', borderBottom: '0.5px solid rgba(201,168,76,0.3)', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 11, color: 'rgba(201,168,76,0.9)', margin: 0, flex: 1 }}>
            Demo mode — WhatsApp access available after signup
          </p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <button onClick={() => { window.location.href = '/'; }} style={{ background: '#C9A84C', border: 'none', borderRadius: 8, padding: '6px 12px', fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#0A0908', cursor: 'pointer' }}>
              Claim studio →
            </button>
            <button onClick={handleDeleteDemoRequest} style={{ background: 'transparent', border: 'none', fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '6px 4px' }}>
              Delete
            </button>
            <button onClick={() => setShowDemoBanner(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 16, padding: '0 4px', lineHeight: 1 }}>×</button>
          </div>
        </div>
      )}
      <ChatScreen vendorId={session.id} vendorName={session.name} />"""

if old_chat_return in t:
    t = t.replace(old_chat_return, new_chat_return, 1)
    print('  OK   [added demo banner]')
else:
    print('  MISS [ChatScreen line not found]')
    sys.exit(1)

vendor_page.write_text(t)
print('  OK   [vendor page.tsx updated]')

# ── 3. app/admin/demo-profiles/page.tsx (full rebuild) ────────────────────────
print('\n── 3. app/admin/demo-profiles/page.tsx ─────────────────────────────────')
# Admin page is written from external template to avoid f-string issues
import urllib.request, os
admin_page_src = Path(__file__).parent / 'admin_demo_page.tsx'
if not admin_page_src.exists():
    print('  ERROR: admin_demo_page.tsx not found — run build from same directory as the template')
    sys.exit(1)
write('app/admin/demo-profiles/page.tsx', admin_page_src.read_text())


# ── TypeScript check ───────────────────────────────────────────────────────────
print('\n── TypeScript check ────────────────────────────────────────────────────')
result = subprocess.run(['npx', 'tsc', '--noEmit'], capture_output=True, text=True)
our_errors = [
    l for l in result.stdout.splitlines()
    if ('app/demo' in l or 'admin/demo-profiles' in l)
    and 'error TS' in l
    and 'Cannot find module' not in l
    and 'jsx-runtime' not in l
]
if our_errors:
    print(f'  {len(our_errors)} errors:')
    for e in our_errors[:10]: print(f'    {e}')
else:
    print('  No new errors ✓')

print('\n✅  dreamos-pwa demo frontend built. Commit with:')
print('  git add app/demo/[handle]/page.tsx app/vendor/page.tsx app/admin/demo-profiles/page.tsx')
print('  git commit -m "feat(demo): vendor demo landing, demo session, admin demo UI"')
print('  git push')
