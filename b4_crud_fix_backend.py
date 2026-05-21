#!/usr/bin/env python3
"""
B-4 CRUD fix — dream-os
Adds POST /couple/receipts/:coupleId for createExpense.
(DELETE already exists on receipts.js)
Drop in dream-os repo root. Run: python3 b4_crud_fix_backend.py
"""
import subprocess, sys

RECEIPTS = 'src/api/couple/receipts.js'
with open(RECEIPTS) as f: src = f.read()

if 'router.post' in src:
    print('POST already exists on receipts.js — nothing to do')
else:
    src = src.replace(
    "// DELETE /:receiptId",
    """// POST /:coupleId — create receipt (expense log from PWA)
router.post('/:coupleId', asyncHandler(async (req, res) => {
  const supabase = req.app.locals.supabase;
  const { couple_id } = req.coupleUser;
  if (req.params.coupleId !== couple_id) return errRes(res, 403, 'Forbidden.');

  const { vendor_name, amount, description, receipt_date, tags, notes } = req.body || {};

  const { data, error } = await supabase
    .from('couple_receipts')
    .insert({
      couple_id,
      vendor_name:  vendor_name  ? String(vendor_name).trim().slice(0,200)  : null,
      amount:       amount       ? parseInt(amount, 10)                      : null,
      description:  description  ? String(description).trim().slice(0,500)  : null,
      receipt_date: receipt_date || null,
      tags:         Array.isArray(tags) ? tags : (notes ? [notes] : null),
    })
    .select('id, amount, vendor_name, description, receipt_date, image_url, tags, created_at')
    .single();

  if (error) {
    console.error('[POST /couple/receipts] insert error:', error.message);
    return errRes(res, 500, 'Could not create receipt.');
  }
  return okRes(res, { expense: data });
}));

// DELETE /:receiptId""")

    with open(RECEIPTS, 'w') as f: f.write(src)
    print('Patched', RECEIPTS)

subprocess.run(['node', '--check', RECEIPTS], check=True)
print('node --check PASS\n')
print('Run next:')
print('  git add src/api/couple/receipts.js')
print('  git commit -m "feat(couple): POST /couple/receipts/:coupleId — expense log from PWA"')
print('  git push origin main')
