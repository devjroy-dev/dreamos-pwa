'use client';

// app/(frost)/canvas/journey/page.tsx
// Journey hub — all tools in one frosted canvas.
// Primary tier: 2×2 grid
// Secondary tier: list rows
// Ported from tdw-2/app/(frost)/canvas/journey.tsx

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Users, DollarSign, CheckSquare, Store,
  Calendar, UserCheck, Settings,
  Scissors, Plane, Archive, ChevronRight,
} from 'lucide-react';
import CanvasShell from '../../../../../components/frost/CanvasShell';
import FrostedSurface from '../../../../../components/frost/FrostedSurface';
import { useFrostMode } from '../../../layout';
import { MUSE_LOOKS, FF, SP, FR, FROST_COPY } from '../../../../../lib/frost/tokens';

const PRIMARY = [
  { key: 'circle',   Icon: Users,       title: 'Circle',    subtitle: 'Family, planners,\nyour people',       route: '/frost/canvas/journey/circle'    },
  { key: 'expenses', Icon: DollarSign,  title: 'Expenses',  subtitle: 'What I owe,\nwhat I have paid',      route: '/frost/canvas/journey/expenses'   },
  { key: 'tasks',    Icon: CheckSquare, title: 'Reminders', subtitle: 'What needs\nto happen',               route: '/frost/canvas/journey/reminders'  },
  { key: 'vendors',  Icon: Store,       title: 'Vendors',   subtitle: 'My team',                             route: '/frost/canvas/journey/vendors'    },
];

const SECONDARY = [
  { key: 'events',    Icon: Calendar,      title: 'Events',      route: '/frost/canvas/journey/events'   },
  { key: 'broadcast', Icon: UserCheck,     title: 'My people',   route: '/frost/canvas/journey/people'   },
  { key: 'moments',   Icon: Archive,       title: 'Moments',     route: '/frost/canvas/journey/moments'  },
  { key: 'couture',   Icon: Scissors,      title: 'Couture',     route: null },
  { key: 'memory',    Icon: Archive,       title: 'Memory Box',  route: null },
  { key: 'honeymoon', Icon: Plane,         title: 'Honeymoon',   route: null },
  { key: 'settings',  Icon: Settings,      title: 'Settings',    route: '/frost/canvas/journey/settings' },
];

export default function CanvasJourney() {
  const router = useRouter();
  const { look } = useFrostMode();
  const tokens = MUSE_LOOKS[look];

  return (
    <CanvasShell eyebrow={FROST_COPY.journeyCanvas.eyebrow} backTo="/frost/canvas/sanctuary">
      <div style={{ padding: `${SP.xl}px ${SP.xxl}px ${SP.huge}px` }}>

        <div style={{ paddingBottom: SP.l }}>
          <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 28, color: tokens.ink, lineHeight: 1.2, marginBottom: 6 }}>
            {FROST_COPY.journeyCanvas.title}
          </div>
          <div style={{ fontFamily: FF.body, fontSize: 14, color: tokens.soft }}>
            {FROST_COPY.journeyCanvas.sub}
          </div>
        </div>

        <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: tokens.soft, marginBottom: SP.s, marginTop: SP.xs }}>
          Your circle & essentials
        </div>

        {/* 2×2 primary grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SP.m, marginBottom: SP.xl }}>
          {PRIMARY.map(tool => (
            <FrostedSurface
              key={tool.key}
              onPress={() => router.push(tool.route)}
              radius={FR.box}
              style={{ padding: SP.l, minHeight: 110, position: 'relative' }}
            >
              <tool.Icon size={22} color={tokens.brassMuted} strokeWidth={1.5} style={{ marginBottom: SP.s, display: 'block' }} />
              <div style={{ fontFamily: FF.display, fontSize: 19, lineHeight: 1.25, color: tokens.ink, marginBottom: 4 }}>
                {tool.title}
              </div>
              <div style={{ fontFamily: FF.body, fontSize: 11, lineHeight: 1.4, color: tokens.soft, whiteSpace: 'pre-line' }}>
                {tool.subtitle}
              </div>
            </FrostedSurface>
          ))}
        </div>

        <div style={{ height: '0.5px', background: tokens.hairline, opacity: 0.5, marginBottom: SP.xl }} />

        <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: tokens.soft, marginBottom: SP.s }}>
          More tools
        </div>

        {/* Secondary list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {SECONDARY.map(tool => (
            <FrostedSurface
              key={tool.key}
              onPress={tool.route ? () => router.push(tool.route!) : undefined}
              radius={FR.md}
              disabled={!tool.route}
            >
              <div style={{ display: 'flex', alignItems: 'center', padding: `${SP.m}px ${SP.l}px`, gap: SP.m }}>
                <div style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <tool.Icon size={16} color={tokens.brassMuted} strokeWidth={1.5} />
                </div>
                <div style={{ flex: 1, fontFamily: FF.body, fontSize: 14, color: tool.route ? tokens.ink : tokens.soft }}>
                  {tool.title}
                  {!tool.route && (
                    <span style={{ fontFamily: FF.label, fontSize: 8, letterSpacing: '0.15em', color: tokens.brassMuted, marginLeft: 8 }}>soon</span>
                  )}
                </div>
                {tool.route && <ChevronRight size={15} color={tokens.hairline} strokeWidth={1.5} />}
              </div>
            </FrostedSurface>
          ))}
        </div>

        <div style={{ paddingTop: SP.xl, textAlign: 'center', fontFamily: FF.display, fontStyle: 'italic', fontSize: 13, color: tokens.soft }}>
          ✦  Or tell DreamAi what you'd like to do.
        </div>
      </div>
    </CanvasShell>
  );
}
