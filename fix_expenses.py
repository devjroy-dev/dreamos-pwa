#!/usr/bin/env python3
"""
Fix createExpense field mapping — dreamos-pwa
Frontend sends wrong field names to receipts POST endpoint.
Drop in dreamos-pwa root. Run: python3 fix_expenses.py
"""
import subprocess, sys

JOURNEY = 'lib/frost/journey.ts'
with open(JOURNEY) as f: src = f.read()

OLD = """    const r: any = await apiFetch(`/api/v2/couple/receipts/${id}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const e = r?.expense;
    if (!e) return null;
    return { id: e.id, couple_id: id||'', vendor_name: e.vendor_name||data.vendor_name, description: e.description||null, actual_amount: e.amount||data.amount, payment_status: 'pending', category: e.tags?.[0]||data.category||null, event: e.tags?.[1]||data.event||null, due_date: e.due_date||data.due_date||null, notes: data.notes||null };"""

NEW = """    // Map frontend fields → backend receipt fields
    const r: any = await apiFetch(`/api/v2/couple/receipts/${id}`, {
      method: 'POST',
      body: JSON.stringify({
        vendor_name:  data.vendor_name,
        amount:       data.amount,
        description:  data.notes       || null,   // notes → description
        receipt_date: data.due_date    || null,   // due_date → receipt_date
        tags:         [data.category, data.event].filter(Boolean),  // category+event → tags[]
      }),
    });
    const e = r?.expense;
    if (!e) return null;
    return { id: e.id, couple_id: id||'', vendor_name: e.vendor_name||data.vendor_name, description: e.description||null, actual_amount: e.amount||data.amount, payment_status: 'paid' as const, category: e.tags?.[0]||data.category||null, event: e.tags?.[1]||data.event||null, due_date: e.receipt_date||data.due_date||null, notes: data.notes||null };"""

if OLD not in src:
    print('ERROR: anchor not found')
    print('Searching for nearby context...')
    for i, line in enumerate(src.split('\n')):
        if 'couple/receipts' in line and 'POST' in line:
            print(f'  line {i}: {line}')
    sys.exit(1)

src = src.replace(OLD, NEW, 1)
with open(JOURNEY, 'w') as f: f.write(src)
print('Patched lib/frost/journey.ts')

result = subprocess.run(['npx', '--no-install', 'tsc', '--noEmit'], capture_output=True, text=True)
if result.returncode != 0:
    print('TSC ERRORS:')
    print(result.stdout)
    sys.exit(1)

print('tsc PASS\n')
print('Run next:')
print('  git add lib/frost/journey.ts')
print('  git commit -m "fix(expenses): map frontend fields to receipts POST — amount, receipt_date, tags"')
print('  git push origin main')
