'use client';

// components/frost-bride/BottomNav.tsx
// PLAN mode tabs:     TODAY | PLAN | CIRCLE
// DISCOVER mode tabs: MUSE  | FEED | MESSAGES
// Gold indicator at BOTTOM for PLAN, at TOP for DISCOVER (matches legacy couple nav).

import { usePathname, useRouter } from 'next/navigation';
import { Home, CheckSquare, Users, Heart, Layers, MessageCircle } from 'lucide-react';
// useBrideMode removed — (bride) layout deleted
const useBrideMode = () => ({ mode: 'HOME' as 'HOME' | 'PLAN' | 'DISCOVER' | 'CIRCLE' | 'MUSE', setMode: (_m: string) => {} });
import { COLORS, FONTS, EASE } from './tokens';

const PLAN_TABS = [
  { label: 'TODAY',    Icon: Home,          href: '/couple/today'        },
  { label: 'PLAN',     Icon: CheckSquare,   href: '/couple/plan'         },
  { label: 'CIRCLE',   Icon: Users,         href: '/couple/circle'       },
];

const DISCOVER_TABS = [
  { label: 'MUSE',     Icon: Heart,         href: '/couple/muse'         },
  { label: 'FEED',     Icon: Layers,        href: '/couple/discover'     },
  { label: 'MESSAGES', Icon: MessageCircle, href: '/couple/messages'     },
];

export default function BrideBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { mode } = useBrideMode();

  const isPlan = mode === 'PLAN';
  const tabs = isPlan ? PLAN_TABS : DISCOVER_TABS;

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: COLORS.navBg,
      borderTop: '0.5px solid ' + COLORS.border,
      paddingBottom: 'env(safe-area-inset-bottom)',
      display: 'flex', alignItems: 'stretch', justifyContent: 'space-around',
      height: 64, boxSizing: 'content-box',
    }}>
      {tabs.map(({ label, Icon, href }) => {
        const isActive = pathname === href || (pathname && pathname.startsWith(href + '/'));
        const iconColor = isActive ? COLORS.dark : COLORS.navMuted;

        return (
          <button
            key={label}
            onClick={() => router.push(href)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              position: 'relative', touchAction: 'manipulation',
              transition: `opacity 180ms ${EASE}`,
            }}
            aria-label={label}
          >
            {/* Gold indicator */}
            <span style={{
              position: 'absolute',
              ...(isPlan ? { bottom: 0 } : { top: 0 }),
              left: '50%', transform: 'translateX(-50%)',
              width: 24, height: 2, borderRadius: 1,
              background: isActive ? COLORS.gold : 'transparent',
              transition: `background 180ms ${EASE}`,
            }} />
            <Icon size={20} strokeWidth={1.5} color={iconColor} />
            <span style={{ fontFamily: FONTS.jost, fontSize: 9, fontWeight: 200, letterSpacing: '0.2em', textTransform: 'uppercase', color: iconColor }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
