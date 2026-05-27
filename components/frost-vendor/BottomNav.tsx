'use client';

// components/frost-vendor/BottomNav.tsx
// Fixed bottom navigation. Mode-aware: BUSINESS shows 4 ops tabs; DISCOVERY
// shows 4 channel tabs. Hidden entirely when mode = DREAMAI (full-page chat).
//
// All tab routes match legacy paths exactly so the URL surface is unchanged
// for users with bookmarked deep links.

import { usePathname, useRouter } from 'next/navigation';
import {
  Home, Users, Wallet, Grid2X2,
  LayoutDashboard, Inbox, Image as ImageIcon, Handshake,
} from 'lucide-react';
// useVendorMode removed — (vendor) layout deleted
const useVendorMode = () => ({ mode: 'BUSINESS' as const, setMode: (_m: string) => {} });
import { COLORS, FONTS, EASE } from './tokens';

const BUSINESS_TABS = [
  { label: 'TODAY',   Icon: Home,    href: '/vendor/today'   },
  { label: 'CLIENTS', Icon: Users,   href: '/vendor/clients' },
  { label: 'MONEY',   Icon: Wallet,  href: '/vendor/money'   },
  { label: 'STUDIO',  Icon: Grid2X2, href: '/vendor/studio'  },
];

const DISCOVERY_TABS = [
  { label: 'DASH',      Icon: LayoutDashboard, href: '/vendor/discovery'        },
  { label: 'LEADS',     Icon: Inbox,           href: '/vendor/discovery/leads'  },
  { label: 'IMAGE HUB', Icon: ImageIcon,       href: '/vendor/discovery/images' },
  { label: 'COLLAB',    Icon: Handshake,       href: '/vendor/discovery/collab' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { mode } = useVendorMode();

  if (mode === 'DREAMAI') return null;
  const tabs = mode === 'DISCOVERY' ? DISCOVERY_TABS : BUSINESS_TABS;

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      backgroundColor: COLORS.navBg,
      paddingBottom: 'env(safe-area-inset-bottom)',
      display: 'flex', alignItems: 'stretch', justifyContent: 'space-around',
      height: 64, boxSizing: 'content-box',
    }}>
      {tabs.map(({ label, Icon, href }) => {
        const isActive = pathname === href || (pathname && pathname.startsWith(href + '/'));
        return (
          <button
            key={label}
            onClick={() => router.push(href)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              position: 'relative',
              transition: `opacity 180ms ${EASE}`,
            }}
            aria-label={label}
          >
            <span style={{
              position: 'absolute', top: 0, left: '30%', right: '30%', height: 2,
              background: isActive ? COLORS.gold : 'transparent',
              borderRadius: 2,
              transition: `background 200ms ${EASE}`,
            }} />
            <Icon size={18} strokeWidth={1.6} color={isActive ? COLORS.gold : COLORS.navMuted} />
            <span style={{
              fontFamily: FONTS.jost, fontSize: 8.5, fontWeight: 300,
              letterSpacing: '0.18em',
              color: isActive ? COLORS.bg : COLORS.navMuted,
            }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
