#!/usr/bin/env python3
"""
B-2 audit fix — dreamos-pwa
Fixes: blind swipe, ImageDots in blind, double-tap in blind, save with image_url
Run from dreamos-pwa Codespace: python3 b2_audit_fix_pwa.py
"""

import sys

# ── discover/page.tsx ─────────────────────────────────────────────────────────
path = 'app/(frost)/frost/canvas/discover/page.tsx'
with open(path, 'r') as f:
    content = f.read()

original = content

# Fix 1: handleSaveToMuse accepts imageUrl
old1 = """async function handleSaveToMuse(vendorId: string): Promise<boolean> {
  try {
    const result = await saveVendorToMuse(vendorId);
    return result.ok === true;
  } catch { return false; }
}"""
new1 = """async function handleSaveToMuse(vendorId: string, imageUrl: string | null): Promise<boolean> {
  try {
    const result = await saveVendorToMuse(vendorId, imageUrl);
    return result.ok === true;
  } catch { return false; }
}"""
if old1 not in content:
    print('ERROR: Fix 1 target not found'); sys.exit(1)
content = content.replace(old1, new1, 1)
print('Fix 1: handleSaveToMuse signature ✓')

# Fix 2: blind swipe — swipe up only
old2 = """    if (isBlind) {
      if (absX > absY) {
        if (dx > SWIPE_THRESHOLD) {
          setBlindHint('right');
          setTimeout(() => setBlindHint(null), 400);
          spawnHeart();
          if (vendor) handleSaveToMuse(vendor.id).then(ok => spawnSaveToast(!ok));
          goNextVendor('right');
        } else if (dx < -SWIPE_THRESHOLD) {
          setBlindHint('left');
          setTimeout(() => setBlindHint(null), 400);
          goNextVendor('left');
        }
      }
      return;
    }"""
new2 = """    if (isBlind) {
      // Blind mode: swipe up → next vendor. No carousel, no left/right.
      if (absY > absX && dy < -SWIPE_THRESHOLD) {
        goNextVendor();
      }
      return;
    }"""
if old2 not in content:
    print('ERROR: Fix 2 target not found'); sys.exit(1)
content = content.replace(old2, new2, 1)
print('Fix 2: blind swipe up → next vendor ✓')

# Fix 3: double-tap works in blind mode, passes image_url
old3 = """  const handleDoubleTap = useCallback(() => {
    if (isBlind || !vendor) return;
    spawnHeart();
    handleSaveToMuse(vendor.id).then(ok => spawnSaveToast(!ok));
  }, [isBlind, vendor]);"""
new3 = """  const handleDoubleTap = useCallback(() => {
    if (!vendor) return;
    spawnHeart();
    handleSaveToMuse(vendor.id, currentPhotoRef.current).then(ok => spawnSaveToast(!ok));
  }, [vendor]);"""
if old3 not in content:
    print('ERROR: Fix 3 target not found'); sys.exit(1)
content = content.replace(old3, new3, 1)
print('Fix 3: double-tap enabled in blind mode ✓')

# Fix 4: add currentPhotoRef
old4 = "  const touchStart = useRef<{ x: number; y: number; t: number } | null>(null);"
new4 = """  const currentPhotoRef = useRef<string | null>(null);
  const touchStart = useRef<{ x: number; y: number; t: number } | null>(null);"""
if old4 not in content:
    print('ERROR: Fix 4 target not found'); sys.exit(1)
content = content.replace(old4, new4, 1)
print('Fix 4: currentPhotoRef added ✓')

# Fix 5: keep currentPhotoRef in sync
old5 = "  const photos = vendor.photos.length > 0 ? vendor.photos : [];\n  const currentPhoto = photos[imageIdx] || null;"
new5 = """  const photos = vendor.photos.length > 0 ? vendor.photos : [];
  const currentPhoto = photos[imageIdx] || null;
  currentPhotoRef.current = currentPhoto;"""
if old5 not in content:
    print('ERROR: Fix 5 target not found'); sys.exit(1)
content = content.replace(old5, new5, 1)
print('Fix 5: currentPhotoRef kept in sync ✓')

# Fix 6: ImageDots hidden in blind mode
old6 = "        <ImageDots total={photos.length} current={imageIdx} />"
new6 = "        {!isBlind && <ImageDots total={photos.length} current={imageIdx} />}"
if old6 not in content:
    print('ERROR: Fix 6 target not found'); sys.exit(1)
content = content.replace(old6, new6, 1)
print('Fix 6: ImageDots hidden in blind mode ✓')

with open(path, 'w') as f:
    f.write(content)
print('discover/page.tsx written ✓')

# ── lib/frost-api/muse.ts ─────────────────────────────────────────────────────
muse_path = 'lib/frost-api/muse.ts'
with open(muse_path, 'r') as f:
    muse = f.read()

old_m = """export async function saveVendorToMuse(vendorId: string): Promise<{
  ok: boolean; save_id?: string; save_number?: number; already_saved?: boolean;
}> {
  if (USE_MOCKS) return { ok: true, already_saved: false };
  return apiPost('/api/v2/couple/muse/save', { vendor_id: vendorId });
}"""
new_m = """export async function saveVendorToMuse(vendorId: string, imageUrl: string | null): Promise<{
  ok: boolean; save_id?: string; save_number?: number; already_saved?: boolean;
}> {
  if (USE_MOCKS) return { ok: true, already_saved: false };
  return apiPost('/api/v2/couple/muse/save', { vendor_id: vendorId, image_url: imageUrl });
}"""
if old_m not in muse:
    print('ERROR: muse.ts target not found'); sys.exit(1)
with open(muse_path, 'w') as f:
    f.write(muse.replace(old_m, new_m, 1))
print('lib/frost-api/muse.ts updated ✓')

print('\nAll done. Now run:')
print('  npx tsc --noEmit')
print('  git add "app/(frost)/frost/canvas/discover/page.tsx" lib/frost-api/muse.ts')
print('  git commit -m "fix(bride): blind swipe up, no carousel in blind, save with image_url per photo"')
print('  git push')
