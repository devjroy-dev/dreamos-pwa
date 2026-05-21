#!/usr/bin/env python3
"""
Fix CRUD paths in journey.ts — dreamos-pwa
1. createExpense → POST /couple/receipts/:id (not /couple/expenses/:id)
2. deleteExpense → DELETE /couple/receipts/:id (not /couple/expenses/:id)
3. fetchEvents → exclude kind='reminder' events from events canvas
Drop in dreamos-pwa repo root. Run: python3 fix_crud_frontend.py
"""
import subprocess, sys

PATH = 'lib/frost/journey.ts'
with open(PATH) as f: src = f.read()

# Fix 1: createExpense — wrong POST path
src = src.replace(
    "const r: any = await apiFetch(`/api/v2/couple/expenses/${id}`, {\n      method: 'POST',\n      body: JSON.stringify(data),\n    });",
    "const r: any = await apiFetch(`/api/v2/couple/receipts/${id}`, {\n      method: 'POST',\n      body: JSON.stringify(data),\n    });"
)

# Fix 2: deleteExpense — wrong DELETE path
src = src.replace(
    "try { await apiFetch(`/api/v2/couple/expenses/${id}`, { method: 'DELETE' }); return true; }",
    "try { await apiFetch(`/api/v2/couple/receipts/${id}`, { method: 'DELETE' }); return true; }"
)

# Fix 3: fetchEvents — filter out reminders (kind='reminder') so they don't bleed into events canvas
src = src.replace(
    "  const raw: any[] = r?.events ?? [];\n  return raw.map(e => ({",
    "  const raw: any[] = (r?.events ?? []).filter((e: any) => e.kind !== 'reminder');\n  return raw.map(e => ({"
)

with open(PATH, 'w') as f: f.write(src)
print('Patched', PATH)

result = subprocess.run(['npx', '--no-install', 'tsc', '--noEmit'], capture_output=True, text=True)
if result.returncode != 0:
    print('TSC ERRORS:')
    print(result.stdout)
    sys.exit(1)

print('tsc PASS\n')
print('Run next:')
print('  git add lib/frost/journey.ts')
print('  git commit -m "fix(crud): expense paths to /receipts, filter reminders from events canvas"')
print('  git push origin main')
