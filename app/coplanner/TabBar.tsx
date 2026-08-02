'use client';
import { usePathname, useRouter } from 'next/navigation';
import { CREAM, GOLD, MUTED, HAIRLINE, FONT_EYEBROW } from './CircleSessionContext';

// ── F-07.115 · THE DREAM AI TAB IS RETIRED, AND SO IS THE GATE THAT HID IT ───
//
// WHAT STOOD HERE. A fifth tab, `{ href: '/coplanner/dreamai', label: 'DREAM AI',
// gated: 'dreamai' }`, and a filter that kept it only when
// `session.permissions?.dreamai_access_granted === true`. That flag was a
// hardcoded `false` with no column behind it (F-07.115, minted CE-127), so the
// filter removed the tab for every member who has ever held a session and the
// tab has never once rendered in production.
//
// WHY DELETION AND NOT A KEY. The founder ruled the lock RIGHT and the feature
// wrong for this surface: circle members reach Mira on WhatsApp, which is the
// intended shape, and they always could. The cure was never to grant the
// permission — it was to stop pretending a permission existed. The capability
// is not lost with the tab; `app/coplanner/page.tsx` now carries the tip that
// says where she actually lives.
//
// WHY THE `gated` MACHINERY GOES TOO. It had exactly one user. A one-member
// enum and a filter that can no longer take its false branch are the shape a
// reader mistakes for policy — and F-07.110's tuition is that a dead map left
// standing is one screen change from lying to somebody.
//
// A RENDERED CHANGE IN ITS OWN RIGHT, named because the control-inventory law
// says a bench cannot catch what nobody told it to look for: the four surviving
// tabs are `flex: 1` of FOUR rather than five, so every one of them widens by
// about a quarter. Nothing else on this bar moved.
//
// THE SESSION IS NO LONGER READ HERE. `useCircleSession` was imported for the
// gate alone; with the gate gone this component takes no session at all.

type Tab = {
  href: string;
  label: string;
  matches: (path: string) => boolean;
};

const ALL_TABS: Tab[] = [
  { href: '/coplanner',          label: 'HOME',     matches: p => p === '/coplanner' },
  { href: '/coplanner/muse',     label: 'MUSE',     matches: p => p.startsWith('/coplanner/muse') },
  { href: '/coplanner/threads',  label: 'THREADS',  matches: p => p.startsWith('/coplanner/threads') },
  { href: '/coplanner/settings', label: 'SETTINGS', matches: p => p.startsWith('/coplanner/settings') },
];

export default function TabBar() {
  const pathname = usePathname() || '';
  const router   = useRouter();

  const tabs = ALL_TABS;

  return (
    <nav style={{
      position: 'fixed',
      left: 0, right: 0, bottom: 0,
      zIndex: 50,
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      background: 'rgba(12,10,9,0.78)',
      backdropFilter: 'blur(24px) saturate(1.4)',
      WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
      borderTop: `0.5px solid ${HAIRLINE}`,
    }}>
      <div style={{
        maxWidth: 480, margin: '0 auto',
        display: 'flex', alignItems: 'stretch', justifyContent: 'space-between',
        padding: '0 8px',
      }}>
        {tabs.map(t => {
          const active = t.matches(pathname);
          return (
            <button
              key={t.href}
              onClick={() => router.push(t.href)}
              style={{
                flex: 1,
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '14px 0 12px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                color: active ? CREAM : MUTED,
              }}>
              <span style={{
                fontFamily: FONT_EYEBROW, fontWeight: 300, fontSize: 9,
                letterSpacing: '0.22em',
              }}>{t.label}</span>
              <span style={{
                width: 18, height: 1,
                background: active ? GOLD : 'transparent',
              }} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
