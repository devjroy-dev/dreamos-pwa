#!/usr/bin/env python3
"""
patch_journey_hub_aubade.py
Frost · Direction 07 · Journey hub — Aubade skin.

Replaces the old CanvasShell grid layout with the Aubade-Nocturne
list-room architecture, consistent with Sanctuary.

Run from dreamos-pwa root:
    python3 patch_journey_hub_aubade.py

Validation:
    npx tsc --noEmit
    git add app/\(frost\)/frost/canvas/journey/page.tsx
    git commit -m "feat(frost): Journey hub — Aubade skin"
    git push
"""

import sys, pathlib

ROOT = pathlib.Path('.').resolve()

def check():
    f = ROOT / 'app/(frost)/frost/canvas/journey/page.tsx'
    if not f.exists():
        sys.exit(f'ERROR: not in dreamos-pwa root. cwd={ROOT}')

def replace_file(path: str, body: str, label: str):
    p = ROOT / path
    p.write_text(body)
    print(f'  ✓ replaced {path} — {label}')

check()
print('\n  Journey hub — Aubade skin\n')

JOURNEY_HUB = r"""'use client';

// app/(frost)/frost/canvas/journey/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Journey hub — Direction 07 Aubade skin.
//
// The bride's planning room. Same Aubade-Nocturne grammar as Sanctuary.
// Dark paper background. Hairline-separated rows. Mono labels. Fraunces italic
// section names. ← Sanctuary back link top-left. Sign out in Settings row.
//
// Rows:
//   I   Events        — Your timeline
//   II  Expenses      — What you owe · what you've paid
//   III Reminders     — What needs to happen
//   IV  Vendors       — Your team
//   ─── (separator)
//   V   Settings      — Sign out, preferences
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { useRouter } from 'next/navigation';
import { AUBADE, FF } from '../../../../../lib/frost/tokens';

// ── Row ──────────────────────────────────────────────────────────────────────
function Row({
  numeral, name, line, onClick, first = false,
}: {
  numeral: string;
  name:    string;
  line:    string;
  onClick: () => void;
  first?:  boolean;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        flex: 1,
        minHeight: 52,
        flexShrink: 1,
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '10px 22px',
        borderTop: first ? 'none' : `1px solid ${AUBADE.line}`,
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <span style={{
        fontFamily: FF.mono,
        fontSize: 9,
        fontWeight: 300,
        letterSpacing: '0.12em',
        color: AUBADE.inkMute,
        width: 22,
        flexShrink: 0,
      }}>
        {numeral}
      </span>

      <span style={{
        fontFamily: FF.aubade,
        fontStyle: 'italic',
        fontWeight: 300,
        fontSize: 19,
        color: AUBADE.ink,
        letterSpacing: '-0.015em',
        lineHeight: 1,
        flexShrink: 0,
        fontFeatureSettings: '"opsz" 9',
        fontVariationSettings: '"opsz" 9, "wght" 300',
      }}>
        {name}
      </span>

      <span style={{
        flex: 1,
        fontFamily: FF.mono,
        fontSize: 8.5,
        fontWeight: 300,
        letterSpacing: '0.14em',
        color: AUBADE.inkSoft,
        textTransform: 'uppercase',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        textAlign: 'right',
      }}>
        {line}
      </span>
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────
export default function JourneyPage() {
  const router = useRouter();
  const go = (path: string) => router.push(path);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: `
        radial-gradient(ellipse 80% 50% at 50% 30%, rgba(216,152,84,0.06) 0%, transparent 60%),
        linear-gradient(180deg, ${AUBADE.paper} 0%, ${AUBADE.paper2} 50%, ${AUBADE.paperDeep} 100%)
      `,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      userSelect: 'none', WebkitUserSelect: 'none',
    }}>

      {/* Top bar */}
      <div style={{
        padding: 'calc(env(safe-area-inset-top, 0px) + 18px) 22px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
        position: 'relative',
        zIndex: 2,
      }}>
        <button
          onClick={() => go('/frost/canvas/sanctuary')}
          style={{
            background: 'transparent', border: 'none', padding: 0,
            fontFamily: FF.mono,
            fontSize: 9,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: AUBADE.inkSoft,
            display: 'flex', alignItems: 'center', gap: 8,
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <span style={{ color: AUBADE.aubade }}>←</span>
          Sanctuary
        </button>

        <span style={{
          fontFamily: FF.mono,
          fontSize: 9,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: AUBADE.inkMute,
        }}>
          Journey
        </span>
      </div>

      {/* Hero title */}
      <div style={{
        padding: '12px 22px 28px',
        flexShrink: 0,
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          fontFamily: FF.italianno,
          fontWeight: 400,
          fontSize: 44,
          color: AUBADE.ink,
          lineHeight: 0.95,
          letterSpacing: '-0.01em',
          marginBottom: 8,
        }}>
          Everything you need.
        </div>
        <div style={{
          fontFamily: FF.mono,
          fontSize: 9,
          letterSpacing: '0.20em',
          textTransform: 'uppercase',
          color: AUBADE.inkMute,
        }}>
          In one place.
        </div>
      </div>

      {/* Stack */}
      <div style={{
        flex: 1,
        display: 'flex', flexDirection: 'column',
        borderTop: `1px solid ${AUBADE.line}`,
        position: 'relative',
        zIndex: 1,
        overflowY: 'auto',
      }}>
        <Row numeral="I"   name="Events"    line="— Your timeline"          onClick={() => go('/frost/canvas/journey/events')}    first />
        <Row numeral="II"  name="Expenses"  line="— What you owe"           onClick={() => go('/frost/canvas/journey/expenses')}  />
        <Row numeral="III" name="Reminders" line="— What needs to happen"   onClick={() => go('/frost/canvas/journey/reminders')} />
        <Row numeral="IV"  name="Vendors"   line="— Your team"              onClick={() => go('/frost/canvas/journey/vendors')}   />

        {/* Separator */}
        <div style={{ height: 1, background: AUBADE.lineStrong, margin: '8px 0', flexShrink: 0 }} />

        <Row numeral="V"   name="Settings"  line="— Sign out · preferences" onClick={() => go('/frost/canvas/journey/settings')} />

        {/* Safe area bottom spacer */}
        <div style={{ height: 'calc(env(safe-area-inset-bottom, 0px) + 24px)', flexShrink: 0 }} />
      </div>
    </div>
  );
}
"""

replace_file(
    'app/(frost)/frost/canvas/journey/page.tsx',
    JOURNEY_HUB,
    'Journey hub — Aubade skin'
)

print('\n  ✓ patch applied.\n')
print('  Validate + push:')
print('    npx tsc --noEmit && git add app/\\(frost\\)/frost/canvas/journey/page.tsx && git commit -m "feat(frost): Journey hub — Aubade skin" && git push\n')
