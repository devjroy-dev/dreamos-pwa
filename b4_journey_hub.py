#!/usr/bin/env python3
"""
B-4 final piece — dreamos-pwa
Wire app/(frost)/frost/canvas/journey/page.tsx to GET /api/v2/couple/me/:coupleId.
Drop in dreamos-pwa repo root. Run: python3 b4_journey_hub.py
"""
import subprocess, sys

PATH = "app/(frost)/frost/canvas/journey/page.tsx"

CONTENT = """'use client';

// app/(frost)/canvas/journey/page.tsx
// Journey hub — wired to real backend (B-4).
// Fetches GET /api/v2/couple/me/:coupleId on mount.
// Shows real name, countdown, city in header.
// Grid and secondary list unchanged.

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users, DollarSign, CheckSquare, Store,
  Calendar, UserCheck, MessageCircle, Settings,
  Scissors, Plane, Archive, ChevronRight,
} from 'lucide-react';
import CanvasShell from '../../../../../components/frost/CanvasShell';
import FrostedSurface from '../../../../../components/frost/FrostedSurface';
import { useFrostMode } from '../../../layout';
import { MUSE_LOOKS, FF, SP, FR } from '../../../../../lib/frost/tokens';
import { fetchCoupleMe } from '../../../../../lib/frost-api/couple';
import { getCoupleSession } from '../../../../../lib/frost-api/_base';

const PRIMARY = [
  { key: 'circle',   Icon: Users,       title: 'Circle',    subtitle: 'Family, planners,\\nyour people',      route: '/frost/canvas/journey/circle'   },
  { key: 'expenses', Icon: DollarSign,  title: 'Expenses',  subtitle: 'What I owe,\\nwhat I have paid',     route: '/frost/canvas/journey/expenses'  },
  { key: 'tasks',    Icon: CheckSquare, title: 'Reminders', subtitle: 'What needs\\nto happen',              route: '/frost/canvas/journey/reminders' },
  { key: 'vendors',  Icon: Store,       title: 'Vendors',   subtitle: 'My team',                            route: '/frost/canvas/journey/vendors'   },
];

const SECONDARY = [
  { key: 'events',    Icon: Calendar,      title: 'Events',     route: '/frost/canvas/journey/events'   },
  { key: 'broadcast', Icon: UserCheck,     title: 'My people',  route: '/frost/canvas/journey/circle'   },
  { key: 'messages',  Icon: MessageCircle, title: 'Messages',   route: '/frost/canvas/journey/circle'   },
  { key: 'couture',   Icon: Scissors,      title: 'Couture',    route: null },
  { key: 'memory',    Icon: Archive,       title: 'Memory Box', route: null },
  { key: 'honeymoon', Icon: Plane,         title: 'Honeymoon',  route: null },
  { key: 'settings',  Icon: Settings,      title: 'Settings',   route: '/frost/canvas/journey/settings' },
];

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((d.getTime() - today.getTime()) / 86400000);
  return diff > 0 ? diff : 0;
}

export default function CanvasJourney() {
  const router = useRouter();
  const { look } = useFrostMode();
  const t = MUSE_LOOKS[look];

  const [name, setName]               = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState<string | null>(null);
  const [days, setDays]               = useState<number | null>(null);
  const [city, setCity]               = useState<string | null>(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const session = getCoupleSession();
    const coupleId = session?.id;
    if (!coupleId) { setLoading(false); return; }
    fetchCoupleMe(coupleId)
      .then(r => {
        const c = r?.couple;
        if (!c) return;
        setName(c.name         || null);
        setPartnerName(c.partner_name || null);
        setDays(daysUntil(c.wedding_date));
        setCity(c.wedding_city || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const headline = name ? name + '\\u2019s journey.' : 'Your journey.';

  const subline = (() => {
    if (loading) return '';
    if (days !== null && city) return days + ' days to ' + city + '.';
    if (days !== null) return days + ' days to go.';
    if (city) return 'Getting married in ' + city + '.';
    return 'Everything you need, in one place.';
  })();

  return (
    <CanvasShell eyebrow="Your wedding">
      <div style={{ padding: SP.xl + 'px ' + SP.xxl + 'px ' + SP.huge + 'px' }}>

        {/* Header — real data */}
        <div style={{ paddingBottom: SP.l }}>
          <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 28, color: t.ink, lineHeight: 1.2, marginBottom: 6 }}>
            {headline}
          </div>
          {subline ? (
            <div style={{ fontFamily: FF.body, fontSize: 14, color: t.soft }}>
              {subline}
            </div>
          ) : (
            <div style={{ height: 20 }} />
          )}
          {partnerName && (
            <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: t.brassMuted, marginTop: 6 }}>
              & {partnerName}
            </div>
          )}
        </div>

        <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: t.soft, marginBottom: SP.s, marginTop: SP.xs }}>
          Your circle & essentials
        </div>

        {/* 2x2 primary grid — unchanged */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SP.m, marginBottom: SP.xl }}>
          {PRIMARY.map(tool => (
            <FrostedSurface
              key={tool.key}
              onPress={() => router.push(tool.route)}
              radius={FR.box}
              style={{ padding: SP.l, minHeight: 110, position: 'relative' }}
            >
              <tool.Icon size={22} color={t.brassMuted} strokeWidth={1.5} style={{ marginBottom: SP.s, display: 'block' }} />
              <div style={{ fontFamily: FF.display, fontSize: 19, lineHeight: 1.25, color: t.ink, marginBottom: 4 }}>
                {tool.title}
              </div>
              <div style={{ fontFamily: FF.body, fontSize: 11, lineHeight: 1.4, color: t.soft, whiteSpace: 'pre-line' }}>
                {tool.subtitle}
              </div>
            </FrostedSurface>
          ))}
        </div>

        <div style={{ height: '0.5px', background: t.hairline, opacity: 0.5, marginBottom: SP.xl }} />

        <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: t.soft, marginBottom: SP.s }}>
          More tools
        </div>

        {/* Secondary list — unchanged */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {SECONDARY.map(tool => (
            <FrostedSurface
              key={tool.key}
              onPress={tool.route ? () => router.push(tool.route!) : undefined}
              radius={FR.md}
              disabled={!tool.route}
            >
              <div style={{ display: 'flex', alignItems: 'center', padding: SP.m + 'px ' + SP.l + 'px', gap: SP.m }}>
                <div style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <tool.Icon size={16} color={t.brassMuted} strokeWidth={1.5} />
                </div>
                <div style={{ flex: 1, fontFamily: FF.body, fontSize: 14, color: tool.route ? t.ink : t.soft }}>
                  {tool.title}
                  {!tool.route && (
                    <span style={{ fontFamily: FF.label, fontSize: 8, letterSpacing: '0.15em', color: t.brassMuted, marginLeft: 8 }}>soon</span>
                  )}
                </div>
                {tool.route && <ChevronRight size={15} color={t.hairline} strokeWidth={1.5} />}
              </div>
            </FrostedSurface>
          ))}
        </div>

        <div style={{ paddingTop: SP.xl, textAlign: 'center', fontFamily: FF.display, fontStyle: 'italic', fontSize: 13, color: t.soft }}>
          \\u2726\\u2002 Or tell DreamAi what you\\u2019d like to do.
        </div>
      </div>
    </CanvasShell>
  );
}
"""

with open(PATH, 'w') as f:
    f.write(CONTENT)

print('Wrote', PATH)

result = subprocess.run(['npx', '--no-install', 'tsc', '--noEmit'], capture_output=True, text=True)
if result.returncode != 0:
    print('TSC ERRORS:')
    print(result.stdout)
    sys.exit(1)

print('tsc PASS\n')
print('Run next:')
print('  git add "app/(frost)/frost/canvas/journey/page.tsx"')
print('  git commit -m "feat(bride-b4): wire journey hub to /couple/me — real name, countdown, city"')
print('  git push origin main')
