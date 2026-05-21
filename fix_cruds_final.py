#!/usr/bin/env python3
"""
Final CRUD fixes — dreamos-pwa
Built against live HEAD a51b698
Drop in dreamos-pwa root. Run: python3 fix_cruds_final.py
"""
import subprocess, sys

# ── 1. journey.ts ─────────────────────────────────────────────────────────────
JOURNEY = 'lib/frost/journey.ts'
with open(JOURNEY) as f: src = f.read()

# Fix 1a: createVendorRow — state default 'considering' → 'booked' (DB constraint)
src = src.replace(
    "body: JSON.stringify({ vendor_name: data.name, category: data.category, state: data.status||'considering', amount_total: data.quoted_total, notes: data.notes }),",
    "body: JSON.stringify({ vendor_name: data.name, category: data.category, state: (['booked','advance_paid','paid'].includes(data.status||'') ? data.status : 'booked'), amount_total: data.quoted_total, notes: data.notes }),"
)

# Fix 1b: createVendorRow return — status default 'considering' → 'booked'
src = src.replace(
    "return { id: b.id, couple_id: id||'', name: b.vendor_name||data.name, category: b.category||null, status: b.state||'considering', quoted_total: b.amount_total||null, paid_total: 0, notes: b.notes||null };",
    "return { id: b.id, couple_id: id||'', name: b.vendor_name||data.name, category: b.category||null, status: b.state||'booked', quoted_total: b.amount_total||null, paid_total: 0, notes: b.notes||null };"
)

# Fix 1c: sendCircleMessage — send body+userId, not content
src = src.replace(
    "  try { await apiFetch('/api/v2/frost/circle/messages', { method: 'POST', body: JSON.stringify({ thread_id: threadId, content }) }); return true; }",
    """  try {
    const coupleId = getCoupleId();
    const convoId = threadId.replace(/^dm:/, '');
    await apiFetch('/api/v2/frost/circle/messages', {
      method: 'POST',
      body: JSON.stringify({ userId: coupleId, thread_id: 'dm:' + convoId, body: content }),
    });
    return true;
  }"""
)

with open(JOURNEY, 'w') as f: f.write(src)
print('Patched lib/frost/journey.ts')

# ── 2. journey/page.tsx — Messages → deferred ──────────────────────────────────
HUB = 'app/(frost)/frost/canvas/journey/page.tsx'
with open(HUB) as f: src = f.read()

src = src.replace(
    "  { key: 'messages',  Icon: MessageCircle, title: 'Messages',   route: '/frost/canvas/journey/circle'   },",
    "  { key: 'messages',  Icon: MessageCircle, title: 'Messages',   route: null },"
)

with open(HUB, 'w') as f: f.write(src)
print('Patched journey/page.tsx')

# ── 3. vendors/page.tsx — pills + defaults ─────────────────────────────────────
VENDORS = 'app/(frost)/frost/canvas/journey/vendors/page.tsx'
with open(VENDORS) as f: src = f.read()

# Fix form default state
src = src.replace(
    "const [form, setForm] = useState({ name:'', category:'', status:'considering', quoted_total:'', notes:'' });",
    "const [form, setForm] = useState({ name:'', category:'', status:'booked', quoted_total:'', notes:'' });"
)
src = src.replace(
    "setForm({ name:'', category:'', status:'considering', quoted_total:'', notes:'' });",
    "setForm({ name:'', category:'', status:'booked', quoted_total:'', notes:'' });"
)

# Fix status pills — only DB-valid values
src = src.replace(
    "              {['considering','shortlisted','in_discussion','booked'].map(s => (",
    "              {['booked','advance_paid','paid'].map(s => ("
)

# Fix pill label display
src = src.replace(
    "                  {s.replace('_',' ')}",
    "                  {s === 'advance_paid' ? 'Advance Paid' : s.charAt(0).toUpperCase() + s.slice(1)}"
)

with open(VENDORS, 'w') as f: f.write(src)
print('Patched vendors/page.tsx')

# ── tsc ────────────────────────────────────────────────────────────────────────
result = subprocess.run(['npx', '--no-install', 'tsc', '--noEmit'], capture_output=True, text=True)
if result.returncode != 0:
    print('TSC ERRORS:')
    print(result.stdout)
    sys.exit(1)

print('tsc PASS\n')
print('Run next:')
print('  git add lib/frost/journey.ts "app/(frost)/frost/canvas/journey/page.tsx" "app/(frost)/frost/canvas/journey/vendors/page.tsx"')
print('  git commit -m "fix(crud): vendor state constraint, circle message body, Messages deferred"')
print('  git push origin main')
