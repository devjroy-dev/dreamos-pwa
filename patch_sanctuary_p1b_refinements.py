#!/usr/bin/env python3
"""
patch_sanctuary_p1b_refinements.py
Frost · Direction 07 · Phase 1b — five refinements from screenshot review.

Run from dreamos-pwa root:
    python3 patch_sanctuary_p1b_refinements.py

Fixes:
  1. Numeral top: 95 → 280 (drops below hero, sits behind stack only)
  2. Progress line: fontSize 19→17, explicit fontWeight 300 + fontVariationSettings
  3. Section row names: fontSize 19→17 (Journey stays 22)
  4. Background radial bottom: warm rgba(40,28,18) → cool rgba(20,18,22)
  5. Meridian top safe-area: adds extra 8px buffer for Android browser chrome
"""

import sys, pathlib

ROOT = pathlib.Path('.').resolve()

def check():
    f = ROOT / 'app/(frost)/frost/canvas/sanctuary/page.tsx'
    if not f.exists():
        sys.exit(f'ERROR: not in dreamos-pwa root. cwd={ROOT}')

def patch(path, old, new, label):
    p = ROOT / path
    s = p.read_text()
    if old not in s:
        sys.exit(f'ERROR [{label}]: anchor not found.\n{old[:120]}')
    if s.count(old) > 1:
        sys.exit(f'ERROR [{label}]: {s.count(old)} matches — need unique anchor.')
    p.write_text(s.replace(old, new))
    print(f'  ✓ {label}')

check()
print('\n  Phase 1b — Sanctuary refinements\n')

# ── 1. Numeral: push down from 95 to 280 ─────────────────────────────────────
patch(
    'app/(frost)/frost/canvas/sanctuary/page.tsx',
    '''        top: 95,
        left: 0, right: 0,
        textAlign: 'center',
        pointerEvents: 'none',
        zIndex: 1,''',
    '''        top: 280,
        left: 0, right: 0,
        textAlign: 'center',
        pointerEvents: 'none',
        zIndex: 1,''',
    'numeral top 95→280 (below hero, behind stack)'
)

# ── 2. Progress line: fontSize 19→17, add fontVariationSettings ──────────────
patch(
    'app/(frost)/frost/canvas/sanctuary/page.tsx',
    '''          fontFamily: FF.aubade,
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 19,
          color: AUBADE.ink,
          lineHeight: 1.4,
          marginBottom: 14,
          fontFeatureSettings: '"opsz" 9',''',
    '''          fontFamily: FF.aubade,
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 17,
          color: AUBADE.ink,
          lineHeight: 1.4,
          marginBottom: 14,
          fontFeatureSettings: '"opsz" 9',
          fontVariationSettings: '"opsz" 9, "wght" 300',''',
    'progress line fontSize 19→17 + fontVariationSettings'
)

# ── 3. Section row names: fontSize 19→17 ─────────────────────────────────────
# The Row component renders section names at fontSize 19.
# Journey row is a separate component — untouched (stays 22).
patch(
    'app/(frost)/frost/canvas/sanctuary/page.tsx',
    '''        fontFamily: FF.aubade,
        fontStyle: 'italic',
        fontWeight: 300,
        fontSize: 19,
        color: AUBADE.ink,
        letterSpacing: '-0.015em',
        lineHeight: 1,
        flexShrink: 0,
        fontFeatureSettings: '"opsz" 9',''',
    '''        fontFamily: FF.aubade,
        fontStyle: 'italic',
        fontWeight: 300,
        fontSize: 17,
        color: AUBADE.ink,
        letterSpacing: '-0.015em',
        lineHeight: 1,
        flexShrink: 0,
        fontFeatureSettings: '"opsz" 9',
        fontVariationSettings: '"opsz" 9, "wght" 300',''',
    'section row names fontSize 19→17'
)

# ── 4. Background: neutralise warm bottom radial ──────────────────────────────
patch(
    'app/(frost)/frost/canvas/sanctuary/page.tsx',
    "        radial-gradient(ellipse 100% 60% at 50% 100%, rgba(40,28,18,0.35) 0%, transparent 70%),",
    "        radial-gradient(ellipse 100% 60% at 50% 100%, rgba(20,18,22,0.35) 0%, transparent 70%),",
    'background bottom radial: warm→cool'
)

# ── 5. Meridian safe-area: add 8px extra for Android browser chrome ───────────
patch(
    'app/(frost)/frost/canvas/sanctuary/page.tsx',
    "        top: 'calc(env(safe-area-inset-top, 0px) + 8px)',\n        left: 0, right: 0,\n        height: 90,\n        zIndex: 4,",
    "        top: 'calc(env(safe-area-inset-top, 0px) + 16px)',\n        left: 0, right: 0,\n        height: 90,\n        zIndex: 4,",
    'meridian top inset +8px for Android browser chrome'
)

# ── Same fix for "I will" / "I do" labels ─────────────────────────────────────
patch(
    'app/(frost)/frost/canvas/sanctuary/page.tsx',
    "        top: 'calc(env(safe-area-inset-top, 0px) + 56px)',\n        left: 22,",
    "        top: 'calc(env(safe-area-inset-top, 0px) + 64px)',\n        left: 22,",
    '"I will" label: +8px'
)
patch(
    'app/(frost)/frost/canvas/sanctuary/page.tsx',
    "        top: 'calc(env(safe-area-inset-top, 0px) + 56px)',\n        right: 22,",
    "        top: 'calc(env(safe-area-inset-top, 0px) + 64px)',\n        right: 22,",
    '"I do" label: +8px'
)

print('\n  ✓ Phase 1b applied.\n')
print('  Validate + push:')
print('    npx tsc --noEmit && git add app/\\(frost\\)/frost/canvas/sanctuary/page.tsx && git commit -m "fix(frost): Sanctuary Phase 1b refinements" && git push\n')
