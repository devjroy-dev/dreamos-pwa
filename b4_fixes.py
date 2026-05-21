import subprocess, sys

# ── Fix 1: journey.ts — formatActivityLine switch cases ──────────────────────
JOURNEY = 'lib/frost/journey.ts'
with open(JOURNEY, 'r') as f:
    src = f.read()

OLD_FORMAT = """export function formatActivityLine(e: CircleActivityEvent): string {
  const actor = e.actor_role === 'bride' ? 'You' : (e.payload?.actor_name || 'Someone');
  const p = e.payload || {};
  switch (e.event_type) {
    case 'vendor_booked':           return `${actor} booked ${p.vendor_name || 'a vendor'}`;
    case 'payment_logged':          return `${actor} logged a payment`;
    case 'task_completed':          return `${actor} completed: ${p.task_text || 'a task'}`;
    case 'muse_saved':              return `${actor} saved to Muse`;
    case 'circle_message_sent':     return `${actor} sent a message`;
    case 'circle_invite_accepted':  return `${p.member_name || 'Someone'} joined your Circle`;
    default:                        return `${actor} made a change`;
  }
}"""

NEW_FORMAT = """export function formatActivityLine(e: CircleActivityEvent): string {
  const actor = e.actor_role === 'bride' ? 'You' : (e.payload?.actor_name || e.payload?.member_name || 'Someone');
  const p = e.payload || {};
  switch (e.event_type) {
    // Real activity_type values from circle_activity table
    case 'save_added':              return `${actor} saved to Muse`;
    case 'comment':                 return `${actor} commented`;
    case 'removed':                 return `${actor} removed a save`;
    // Legacy / future values
    case 'vendor_booked':           return `${actor} booked ${p.vendor_name || 'a vendor'}`;
    case 'payment_logged':          return `${actor} logged a payment`;
    case 'task_completed':          return `${actor} completed a task`;
    case 'muse_saved':              return `${actor} saved to Muse`;
    case 'circle_message_sent':     return `${actor} sent a message`;
    case 'circle_invite_accepted':  return `${p.member_name || 'Someone'} joined your Circle`;
    default:                        return `${actor} made a change`;
  }
}"""

if OLD_FORMAT not in src:
    print('ERROR: formatActivityLine anchor not found')
    sys.exit(1)

src = src.replace(OLD_FORMAT, NEW_FORMAT, 1)

with open(JOURNEY, 'w') as f:
    f.write(src)

print('Fixed formatActivityLine in journey.ts')

# ── Fix 2: circle/page.tsx — unicode escape literals ─────────────────────────
CIRCLE = "app/(frost)/frost/canvas/journey/circle/page.tsx"
with open(CIRCLE, 'r') as f:
    csrc = f.read()

# Fix literal \u2026 (…) and \u2019 (') that Python wrote as escaped strings
csrc = csrc.replace('Loading\\u2026', 'Loading\u2026')
csrc = csrc.replace('Message\\u2026', 'Message\u2026')
csrc = csrc.replace('\\u2726\\u2002', '\u2726\u2002')

with open(CIRCLE, 'w') as f:
    f.write(csrc)

print('Fixed unicode escapes in circle/page.tsx')

# ── Fix 3: journey/page.tsx — unicode escape literals ────────────────────────
HUB = "app/(frost)/frost/canvas/journey/page.tsx"
with open(HUB, 'r') as f:
    hsrc = f.read()

hsrc = hsrc.replace('\\u2019s journey.', '\u2019s journey.')
hsrc = hsrc.replace('\\u2726\\u2002', '\u2726\u2002')
hsrc = hsrc.replace("you\\u2019d", "you\u2019d")

with open(HUB, 'w') as f:
    f.write(hsrc)

print('Fixed unicode escapes in journey/page.tsx')

# ── tsc check ────────────────────────────────────────────────────────────────
result = subprocess.run(['npx', '--no-install', 'tsc', '--noEmit'], capture_output=True, text=True)
if result.returncode != 0:
    print('TSC ERRORS:')
    print(result.stdout)
    sys.exit(1)

print('tsc PASS\n')
print('Run next:')
print('  git add lib/frost/journey.ts "app/(frost)/frost/canvas/journey/circle/page.tsx" "app/(frost)/frost/canvas/journey/page.tsx"')
print('  git commit -m "fix(bride-b4): unicode escapes, circle activity_type mapping"')
print('  git push origin main')
