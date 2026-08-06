'use client';
// components/demo/DemoVendorHeader.tsx
// Exact visual copy of the real vendor Header.
// NO useVendorMe — no API calls, no session, no 401 redirects.
// NO clearVendorSession — sign out links to demo landing instead.

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
// TDW_09 P2 · fork 8.4/8.5 (chair relay #3): ModePill retired from the live nav
// with the mode; the demo twin is DECLARED-HELD (F-09.89) and keeps rendering
// it, so the pill relocated to this lane — byte-preserved, see its own header.
import { ModePill } from '@/components/demo/ModePill';
import { DemoClaimSheet } from '@/components/demo/DemoClaimSheet';
import { useTheme } from '@/hooks/vendor/useTheme';
import { useT } from '@/lib/vendor/ThemeContext';
import type { VendorMode } from '@/hooks/vendor/useVendorMode';

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

function modeFromPath(pathname: string, handle: string): VendorMode {
  const base = `/demo/vendor/${handle}`;
  if (pathname === `${base}/studio`) return 'ai';
  if (pathname.startsWith(`${base}/discover`)) return 'discover';
  return 'studio';
}

interface Props { vendorName: string | null; handle: string; category?: string | null; city?: string | null; }

export function DemoVendorHeader({ vendorName, handle, category, city }: Props) {
  const router   = useRouter();
  const pathname = usePathname() ?? '';
  const T        = useT();
  const [theme, toggleTheme] = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  // F-07.60: the claim sheet is now a thing this header OPENS, not a place it SENDS you.
  const [claimOpen, setClaimOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const isLight = theme === 'light';

  const mode = modeFromPath(pathname, handle);
  const base = `/demo/vendor/${handle}`;

  const displayName = vendorName || 'Vendor';
  const headerName  = displayName.split(' ')[0];
  const subtitle    = [category, city].filter(Boolean).join(' · ');

  useEffect(() => {
    if (!profileOpen) return;
    function h(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [profileOpen]);

  function handleModeChange(next: VendorMode) {
    if (next === 'ai')       router.push(`${base}/studio`);
    if (next === 'studio')   router.push(`${base}/calendar`);
    if (next === 'discover') router.push(`${base}/discover`);
  }

  const inkColor     = isLight ? T.ink      : A.ink;
  const inkMuteColor = isLight ? T.inkMute  : A.inkMute;

  return (
    <>
    <header data-atelier-backdrop="warm" style={{
      position: 'sticky', top: 0, zIndex: 20,
      backdropFilter: 'blur(40px) saturate(1.8)', WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
      padding: '10px 20px 12px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
      borderBottom: 'none',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flexShrink: 1 }}>
        <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass }}>DreamAi</span>
        <span style={{ fontFamily: F.display, fontWeight: 400, fontSize: 21, color: inkColor, letterSpacing: '0.01em', marginTop: 2, lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{headerName}</span>
      </div>

      {/* Mode pill */}
      <div><ModePill mode={mode} onChange={handleModeChange} /></div>

      {/* Profile coin */}
      <div ref={profileRef} style={{ position: 'relative', flexShrink: 0 }}>
        <button type="button" onClick={() => setProfileOpen(o => !o)} style={{
          width: 34, height: 34, borderRadius: '50%', border: `1.5px solid ${A.brass}`,
          background: 'rgba(201,168,76,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0, boxShadow: '0 0 0 3px rgba(201,168,76,0.06), inset 0 1px 2px rgba(255,235,200,0.15)',
          fontFamily: F.display, fontWeight: 400, fontSize: 14, color: A.brassWarm, letterSpacing: '0.04em',
        }}>
          {initials(displayName)}
        </button>

        {/* Dropdown */}
        <div style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0, minWidth: 260, zIndex: 200, opacity: profileOpen ? 1 : 0, transform: profileOpen ? 'translateY(0)' : 'translateY(-8px)', pointerEvents: profileOpen ? 'auto' : 'none', transition: `opacity 180ms ${EASE}, transform 220ms ${EASE}` }}>
          <div className="atelier-card atelier-card-ornate" style={{ padding: 0, background: isLight ? `linear-gradient(180deg, ${T.sheetTop} 0%, ${T.sheetBot} 100%)` : 'linear-gradient(180deg, rgba(35,26,21,0.97) 0%, rgba(28,21,17,0.99) 100%)', backdropFilter: 'blur(32px) saturate(1.6)', WebkitBackdropFilter: 'blur(32px) saturate(1.6)', boxShadow: isLight ? `0 8px 24px -4px rgba(26,15,8,0.15), 0 0 0 0.5px ${T.sheetBorder}` : '0 16px 40px -8px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(201,168,76,0.32)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px 16px', borderBottom: '0.5px solid rgba(201,168,76,0.22)' }}>
              <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, letterSpacing: '0.5em', textTransform: 'uppercase', color: A.brass, marginBottom: 8 }}>The Maker</div>
              <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 24, color: isLight ? '#2C1F14' : 'var(--atelier-ink)', lineHeight: 1.1, letterSpacing: '0.005em' }}>{displayName}</div>
              {subtitle && <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 13, color: inkMuteColor, marginTop: 5 }}>{subtitle}</div>}
            </div>

            {/* Demo banner in dropdown */}
            <div style={{ padding: '12px 20px 10px', borderBottom: '0.5px solid rgba(201,168,76,0.12)', background: 'rgba(201,168,76,0.05)' }}>
              <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.22em', color: '#C9A84C', textTransform: 'uppercase' }}>Demo Mode</div>
              <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 12, color: inkMuteColor, marginTop: 3 }}>WhatsApp access after signup</div>
            </div>

            {/* Theme toggle */}
            <button type="button" onClick={toggleTheme} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '11px 20px', border: 'none', cursor: 'pointer', textAlign: 'left', background: 'transparent' }}>
              <span style={{ flexShrink: 0, width: 22, textAlign: 'center', fontFamily: F.display, fontWeight: 400, fontSize: 18, color: A.brassWarm, lineHeight: 1 }}>{theme === 'dark' ? '○' : '●'}</span>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: F.script, fontWeight: 500, fontSize: 16, color: isLight ? '#2C1F14' : 'var(--atelier-ink)', letterSpacing: '0.005em', lineHeight: 1.15 }}>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
                <span style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 11, color: inkMuteColor, marginTop: 1 }}>{theme === 'dark' ? 'Switch to parchment' : 'Switch to espresso'}</span>
              </span>
            </button>

            {/* Claim studio CTA */}
            {/* ── F-07.60 CURED ────────────────────────────────────────────────
                THIS LINE READ: `router.push(`/demo/vendor/${handle}?claim=1`)`.
                It was a FULL navigation — from whatever demo surface the vendor was
                standing on, onto the marketing landing (hero re-load, founder-captured
                at 18 requests / 1.3 MB on throttled 4G), which then auto-opened the
                claim sheet as an overlay anyway. The destination was never the point;
                the sheet was. The vendor paid his whole studio to reach a form.
                Now the sheet opens where he already is. Zero navigation.

                NOTE FOR THE NEXT READER: this `?claim=1` push was the ONLY producer
                of that query string in either repo (derived by unrestricted grep at
                adf573d — the WhatsApp alert's {{3}} lands on the BARE landing,
                dream-os src/lib/discover/demoLeadAlert.js:55/:95, no query string).
                Its consumer on the landing survives byte-untouched by CE ruling C1:
                a public URL is a contract even after its last producer is gone. */}
            <button type="button" onClick={() => { setProfileOpen(false); setClaimOpen(true); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '11px 20px 14px', border: 'none', cursor: 'pointer', textAlign: 'left', background: 'transparent', marginTop: 2 }}>
              <span style={{ flexShrink: 0, width: 22, textAlign: 'center', fontFamily: F.display, fontWeight: 400, fontSize: 18, color: '#E0BC6E', lineHeight: 1 }}>→</span>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: F.script, fontWeight: 500, fontSize: 16, color: '#E0BC6E', letterSpacing: '0.005em', lineHeight: 1.15 }}>Claim Your Studio</span>
                <span style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 11, color: inkMuteColor, marginTop: 1 }}>Enter your number to join</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Brass under-rule */}
      <div style={{ position: 'absolute', left: 20, right: 20, bottom: 0, height: '0.5px', background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.4) 20%, rgba(201,168,76,0.4) 80%, transparent 100%)', pointerEvents: 'none' }} />
    </header>

    {/* ── F-07.60 · THE SHEET MOUNTS HERE, AND THE POSITION IS LAW ────────────
        THIS ELEMENT MUST REMAIN A SIBLING **AFTER** `</header>`, NEVER A CHILD OF IT.

        Not style — physics. The <header> above carries
            backdropFilter: 'blur(40px) saturate(1.8)'
        (see its style block), and a non-`none` backdrop-filter CREATES A CONTAINING
        BLOCK FOR FIXED-POSITION DESCENDANTS. The claim sheet is `position: fixed`.
        Rendered inside the header it would be contained and clipped into the header's
        own ~56px box on all eighteen mounts — a bottom sheet trapped in a top bar.
        The bench asserts this ordering directly and REDS if the element is moved
        inside, because the failure is silent to tsc and invisible to a component test.

        THE REST OF THE ANCESTRY IS CLEAR AT REST, derived at adf573d:
          · app/demo/vendor/[handle]/layout.tsx:235  outer div — no transform/filter
          · layout.tsx:236–248  swipe stage — sets `transform` ONLY while dragOffset
            !== 0 and `willChange:'auto'` at rest; a bare `transition` creates no
            containing block, and the sheet is never open mid-drag
          · layout.tsx:249  overflow:auto — overflow does not create one
          · lib/vendor/ThemeContext ThemeProvider — renders NO wrapper element at all
        So the fixed sheet reaches the viewport on every surface this header sits on. */}
    <DemoClaimSheet
      open={claimOpen}
      onClose={() => setClaimOpen(false)}
      handle={handle}
      vendorName={vendorName}
    />
    </>
  );
}
