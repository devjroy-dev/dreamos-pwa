'use client';
// components/Header.tsx — Atelier rebuild · Calling-card dropdown + theme toggle

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ModePill } from '@/components/vendor/BottomNav';
import { TipsCarousel } from '@/components/vendor/TipsCarousel';
import { useVendorMode, type VendorMode } from '@/hooks/vendor/useVendorMode';
import { useVendorMe } from '@/hooks/vendor/useVendorMe';
import { useTheme } from '@/hooks/vendor/useTheme';
import { useT } from '@/lib/vendor/ThemeContext';
import { clearVendorSession } from '@/lib/vendor/session';

const A = {
  ink:       'var(--atelier-ink)',
  inkSoft:   'var(--atelier-ink-soft)',
  inkMute:   'var(--atelier-ink-mute)',
  brass:     'var(--atelier-accent-text)',
  brassWarm: 'var(--atelier-label)',
  brassLine: 'rgba(201,168,76,0.18)',
  red:       '#E07B5C',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script:  'var(--font-cormorant), Georgia, serif',
  body:    'var(--font-dm-sans), system-ui, sans-serif',
  label:   'var(--font-jost), system-ui, sans-serif',
} as const;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

function initials(name: string | null | undefined): string {
  if (!name) return 'M';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function titleCase(s: string | null | undefined): string {
  if (!s) return '';
  return s.split(/[\s_-]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

export function Header({ vendorName }: { vendorName: string | null }) {
  const router = useRouter();
  const pathname = usePathname() ?? '/vendor';
  const [, setMode] = useVendorMode();
  const [profileOpen, setProfileOpen] = useState(false);
  const [tipsOpen, setTipsOpen]       = useState(false);
  const [theme, toggleTheme] = useTheme();
  const T = useT();

  const me = useVendorMe();
  const displayName = me?.business_name || me?.name || vendorName || 'Vendor';
  const headerName = displayName.split(' ')[0];
  const subtitle = [titleCase(me?.category), me?.city].filter(Boolean).join(' · ');

  const mode: VendorMode = (() => {
    if (pathname === '/vendor' || pathname.startsWith('/vendor/auth')) return 'ai';
    if (
      pathname.startsWith('/vendor/portfolio') ||
      pathname.startsWith('/vendor/couture')   ||
      pathname.startsWith('/vendor/featured')  ||
      pathname.startsWith('/vendor/collab')    ||
      pathname.startsWith('/vendor/discover/leads') ||
      pathname === '/vendor/discover' ||
      pathname.startsWith('/vendor/discover/submit')
    ) return 'discover';
    return 'studio';
  })();

  function handleModeChange(next: VendorMode) {
    setMode(next);
    if (next === 'ai')       router.push('/vendor');
    if (next === 'studio')   router.push('/vendor/calendar');
    if (next === 'discover') router.push('/vendor/discover');
  }

  const profileRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!profileOpen) return;
    function h(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [profileOpen]);

  function signOut() {
    setProfileOpen(false);
    clearVendorSession();
    router.replace('/vendor/login');
  }

  function requestInvite() {
    setProfileOpen(false);
    window.open('https://wa.me/917982159047?text=Hi%2C%20I%27d%20like%20to%20request%20an%20invite%20for%20one%20of%20my%20clients.', '_blank');
  }

  // In light mode, ink colors flip — header text needs to read on cream
  const isLight = theme === 'light';
  const inkColor = isLight ? T.ink : A.ink;
  const inkMuteColor = isLight ? T.inkMute : A.inkMute;

  return (
    <>
    <header data-atelier-backdrop="warm" style={{
      position: 'sticky', top: 0, zIndex: 20,
      backdropFilter: 'blur(40px) saturate(1.8)',
      WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
      padding: '10px 20px 12px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
      borderBottom: 'none',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flexShrink: 1 }}>
        <span style={{
          fontFamily: F.label, fontWeight: 300, fontSize: 8,
          letterSpacing: '0.42em', textTransform: 'uppercase',
          color: A.brass,
        }}>DreamAi</span>
        <span style={{
          fontFamily: F.display, fontWeight: 400, fontSize: 21,
          color: inkColor, letterSpacing: '0.01em', marginTop: 2, lineHeight: 1,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{headerName}</span>
      </div>

      {/* Centre: mode pill */}
      <div data-tour="mode-pill"><ModePill mode={mode} onChange={handleModeChange} /></div>

      {/* Right: profile coin + calling-card dropdown */}
      <div ref={profileRef} style={{ position: 'relative', flexShrink: 0 }}>
        <button data-tour="profile-coin" type="button" onClick={() => setProfileOpen(o => !o)} aria-label="Profile menu"
          style={{
            width: 34, height: 34, borderRadius: '50%',
            border: `1.5px solid ${A.brass}`,
            background: 'rgba(201,168,76,0.14)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
            boxShadow: '0 0 0 3px rgba(201,168,76,0.06), inset 0 1px 2px rgba(255,235,200,0.15)',
            fontFamily: F.display, fontWeight: 400, fontSize: 14,
            color: A.brassWarm, letterSpacing: '0.04em',
          }}>
          {initials(displayName)}
        </button>

        {/* Calling-card dropdown */}
        <div style={{
          position: 'absolute', top: 'calc(100% + 12px)', right: 0,
          minWidth: 260, zIndex: 200,
          opacity: profileOpen ? 1 : 0,
          transform: profileOpen ? 'translateY(0)' : 'translateY(-8px)',
          pointerEvents: profileOpen ? 'auto' : 'none',
          transition: `opacity 180ms ${EASE}, transform 220ms ${EASE}`,
        }}>
          <div className="atelier-card atelier-card-ornate" style={{
            padding: 0,
            background: isLight
              ? `linear-gradient(180deg, ${T.sheetTop} 0%, ${T.sheetBot} 100%)`
              : 'linear-gradient(180deg, rgba(35,26,21,0.97) 0%, rgba(28,21,17,0.99) 100%)',
            backdropFilter: 'blur(32px) saturate(1.6)',
            WebkitBackdropFilter: 'blur(32px) saturate(1.6)',
            boxShadow: isLight
              ? `0 8px 24px -4px rgba(26,15,8,0.15), 0 0 0 0.5px ${T.sheetBorder}`
              : '0 16px 40px -8px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(201,168,76,0.32), inset 0 1px 0 var(--atelier-ink-dim)',
            overflow: 'hidden',
          }}>
            {/* Calling card header */}
            <div style={{
              padding: '18px 20px 16px',
              borderBottom: `0.5px solid rgba(201,168,76,0.22)`,
            }}>
              <div style={{
                fontFamily: F.label, fontWeight: 300, fontSize: 8,
                letterSpacing: '0.5em', textTransform: 'uppercase',
                color: A.brass, marginBottom: 8,
              }}>The Maker</div>
              <div style={{
                fontFamily: F.display, fontWeight: 400, fontSize: 24,
                color: isLight ? '#2C1F14' : 'var(--atelier-ink)',
                lineHeight: 1.1, letterSpacing: '0.005em',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{displayName}</div>
              {subtitle && (
                <div style={{
                  fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
                  fontSize: 13, color: inkMuteColor, marginTop: 5,
                  letterSpacing: '0.01em',
                }}>{subtitle}</div>
              )}
            </div>

            {/* ATELIER section */}
            <SectionLabel isLight={isLight}>Atelier</SectionLabel>
            <DItem glyph="◈" label="Discover Profile"    subtitle="How couples see you" isLight={isLight} onClick={() => { setProfileOpen(false); router.push('/vendor/settings'); }} />
            <DItem glyph="★" label="The Dream Wedding"   isLight={isLight} onClick={() => { setProfileOpen(false); window.open('https://thedreamwedding.in', '_blank'); }} />
            <DItem glyph="◈" label="Tips &amp; Features" subtitle="Mini manual" isLight={isLight} onClick={() => { setProfileOpen(false); setTipsOpen(true); }} accent />

            {/* THEME TOGGLE — between sections */}
            <SectionLabel isLight={isLight}>Display</SectionLabel>
            <DItem
              glyph={theme === 'dark' ? '○' : '●'}
              label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              subtitle={theme === 'dark' ? 'Switch to parchment' : 'Switch to espresso'}
              isLight={isLight}
              onClick={() => { toggleTheme(); }}
              accent
            />

            {/* ACTIONS section */}
            <SectionLabel isLight={isLight}>Actions</SectionLabel>
            <DItem glyph="✉" label="Request Invite" subtitle="For a client" isLight={isLight} onClick={requestInvite} accent />
            <DItem glyph="◎" label="DreamAi on WhatsApp" subtitle="Chat with us" isLight={isLight} onClick={() => window.open('https://wa.me/917982159047?text=Hi', '_blank')} accent />
            <DItem glyph="→" label="Sign Out" isLight={isLight} onClick={signOut} danger last />
          </div>
        </div>
      </div>

      {/* Brass under-rule */}
      <div style={{
        position: 'absolute', left: 20, right: 20, bottom: 0,
        height: '0.5px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.4) 20%, rgba(201,168,76,0.4) 80%, transparent 100%)',
        pointerEvents: 'none',
      }} />
    </header>

    {tipsOpen && <TipsCarousel onClose={() => setTipsOpen(false)} />}
    </>
  );
}

function SectionLabel({ children, isLight }: { children: React.ReactNode; isLight: boolean }) {
  return (
    <div style={{
      padding: '14px 20px 6px',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{
        fontFamily: F.label, fontWeight: 300, fontSize: 7,
        letterSpacing: '0.5em', textTransform: 'uppercase',
        color: 'var(--atelier-label)',
      }}>{children}</span>
      <span style={{ flex: 1, height: '0.5px', background: isLight ? 'rgba(44,31,20,0.15)' : 'rgba(201,168,76,0.18)' }} />
    </div>
  );
}

function DItem({ glyph, label, subtitle, onClick, danger, accent, last, isLight }: {
  glyph: string; label: string; subtitle?: string; onClick: () => void;
  danger?: boolean; accent?: boolean; last?: boolean; isLight: boolean;
}) {
  const [hov, setHov] = useState(false);
  const baseInk = isLight ? '#2C1F14' : 'var(--atelier-ink)';
  const color = danger ? '#E07B5C' : accent ? (isLight ? '#7A3828' : '#E0BC6E') : baseInk;
  const glyphColor = danger ? '#E07B5C' : isLight ? '#7A3828' : '#E0BC6E';
  const hoverBg = isLight ? 'rgba(44,31,20,0.04)' : 'var(--atelier-row-hover)';
  const subtitleColor = isLight ? 'rgba(44,31,20,0.4)' : 'rgba(240,230,210,0.4)';

  return (
    <button type="button" onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: '100%',
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '11px 20px',
        border: 'none', cursor: 'pointer', textAlign: 'left',
        background: hov ? hoverBg : 'transparent',
        transition: `background 150ms ${EASE}`,
        marginBottom: last ? 6 : 0,
        marginTop: last ? 2 : 0,
      }}>
      <span style={{
        flexShrink: 0, width: 22, textAlign: 'center',
        fontFamily: F.display, fontWeight: 400, fontSize: 18,
        color: glyphColor, lineHeight: 1,
        textShadow: hov ? '0 0 8px rgba(224,188,110,0.3)' : 'none',
        transition: `text-shadow 150ms ${EASE}`,
      }}>{glyph}</span>
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span style={{
          fontFamily: F.script, fontWeight: 500, fontSize: 16,
          color, letterSpacing: '0.005em', lineHeight: 1.15,
        }}>{label}</span>
        {subtitle && (
          <span style={{
            fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
            fontSize: 11, color: subtitleColor, marginTop: 1,
            letterSpacing: '0.01em',
          }}>{subtitle}</span>
        )}
      </span>
    </button>
  );
}
