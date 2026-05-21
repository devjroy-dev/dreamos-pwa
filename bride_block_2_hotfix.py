#!/usr/bin/env python3
"""
B-2 hotfix: blind swipe lag + middot character + image preload
Run from dreamos-pwa Codespace: python3 bride_block_2_hotfix.py
"""

import sys

path = 'app/(frost)/frost/canvas/discover/page.tsx'

with open(path, 'r') as f:
    content = f.read()

original = content

# ── Fix 1: Remove blindSlide state ───────────────────────────────────────────
content = content.replace(
    "  const [blindSlide, setBlindSlide] = useState<'left'|'right'|null>(null);\n",
    ""
)

# ── Fix 2: Remove slideOff keyframes ─────────────────────────────────────────
content = content.replace(
    "        @keyframes slideOffLeft { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(-120%)} }\n        @keyframes slideOffRight { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(120%)} }\n",
    ""
)

# ── Fix 3: Replace slide animation with dissolve ──────────────────────────────
old_anim = """            animation: blindSlide === 'left'
              ? 'slideOffLeft 220ms ease forwards'
              : blindSlide === 'right'
              ? 'slideOffRight 220ms ease forwards'
              : 'dissolveIn 260ms ease',"""
new_anim = "            animation: 'dissolveIn 260ms cubic-bezier(0.22,1,0.36,1)',"
content = content.replace(old_anim, new_anim)

# ── Fix 4: Remove setTimeout in goNextVendor blind path ──────────────────────
old_next = """    if (direction) {
      setBlindSlide(direction);
      setTimeout(() => {
        setBlindSlide(null);
        setVendorIdx(i => i + 1);
        setImageIdx(0);
        setOverlayVisible(false);
        setDissolveKey(k => k + 1);
        haptic(5);
      }, 220);
    } else {"""
new_next = """    if (direction) {
      setVendorIdx(i => i + 1);
      setImageIdx(0);
      setOverlayVisible(false);
      setDissolveKey(k => k + 1);
      haptic(5);
    } else {"""
content = content.replace(old_next, new_next)

# ── Fix 5: middot unicode escapes → actual character ─────────────────────────
content = content.replace('\\u00b7', '·')
content = content.replace('\\u00B7', '·')

# ── Fix 6: Add image preload after vendor declaration ────────────────────────
preload_block = """
  // Preload next images silently — reduces perceived lag
  useEffect(() => {
    if (!vendor) return;
    const toPreload: string[] = [];
    for (let i = imageIdx + 1; i < Math.min(vendor.photos.length, imageIdx + 3); i++) {
      toPreload.push(vendor.photos[i]);
    }
    if (vendorIdx + 1 < vendors.length) {
      const next = vendors[vendorIdx + 1];
      if (next.photos[0]) toPreload.push(next.photos[0]);
    }
    toPreload.forEach(src => { const img = new Image(); img.src = src; });
  }, [vendorIdx, imageIdx, vendor, vendors]);"""

insert_after = "  const vendor = vendors[vendorIdx];"

if 'Preload next images' not in content:
    if insert_after not in content:
        print('ERROR: preload insert point not found')
        sys.exit(1)
    content = content.replace(insert_after, insert_after + preload_block, 1)
    print('preload added ✓')
else:
    print('preload already present, skipping')

if content == original:
    print('WARNING: no changes made — file may already be patched')
else:
    with open(path, 'w') as f:
        f.write(content)
    print('discover/page.tsx patched ✓')

print('\nNow run:')
print('  npx tsc --noEmit')
print('  git add "app/(frost)/frost/canvas/discover/page.tsx"')
print('  git commit -m "fix(bride): blind swipe dissolve, middot char, image preload"')
print('  git push')
