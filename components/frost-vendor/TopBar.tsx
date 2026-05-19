'use client';

// components/frost-vendor/TopBar.tsx
// Fixed header for Frost vendor PWA.
//
// Three elements: TDW wordmark · 3-mode pill (BUSINESS / ✦AI / DISCOVERY) · profile.
// Mode switch navigates AND writes localStorage('vendor_app_mode'); layout's
// pathname sync keeps state coherent across refresh + back/forward.
//
// Session read pattern mirrors legacy: tries 'vendor_session' then
// 'vendor_web_session'. Login writes BOTH so either order works.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, LogOut } from 'lucide-react';
import { useVendorMode, type VendorMode } from '../../app/(vendor)/layout';
import { COLORS, FONTS, EASE, initials } from './tokens';
import { getVendorSession } from '../../lib/frost-api/_base';

const MODE_DESTINATION: Record<VendorMode, string> = {
  BUSINESS:  '/vendor/today',
  DREAMAI:   '/vendor/dreamai',
  DISCOVERY: '/vendor/discovery',
};

export default function TopBar() {
  const router = useRouter();
  const { mode } = useVendorMode();

  const [profileOpen, setProfileOpen] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [category, setCategory] = useState('');
  const [tier, setTier] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    const s = getVendorSession();
    if (s?.vendorName || s?.name) setVendorName((s.vendorName || s.name) as string);
    if (s?.category) setCategory(s.category as string);
    if (s?.tier) setTier(s.tier as string);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2400);
  };

  const handleModeSwitch = (m: VendorMode) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vendor_app_mode', m);
      if (m === 'BUSINESS') localStorage.removeItem('vendor_last_path');
    }
    router.push(MODE_DESTINATION[m]);
  };

  const logout = () => {
    try {
      localStorage.removeItem('vendor_session');
      localStorage.removeItem('vendor_web_session');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('vendor_last_path');
      localStorage.removeItem('vendor_app_mode');
    } catch {}
    router.replace('/');
  };

  const profileSub = [category, tier ? tier[0].toUpperCase() + tier.slice(1) : '']
    .filter(Boolean).join(' · ') || 'Maker';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400;500&family=Jost:wght@200;300;400&display=swap');
        @keyframes fvToastSlide { from { opacity:0; transform: translateY(-40px) translateX(-50%); } to { opacity:1; transform: translateY(0) translateX(-50%); } }
      `}</style>

      {toast && (
        <div style={{
          position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
          background: COLORS.dark, color: COLORS.bg,
          fontFamily: FONTS.dm300, fontSize: 12, fontWeight: 300,
          padding: '10px 16px', borderRadius: 8, zIndex: 400,
          animation: `fvToastSlide 280ms ${EASE}`,
          whiteSpace: 'nowrap', pointerEvents: 'none',
        }}>{toast}</div>
      )}

      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 56, backgroundColor: COLORS.bg,
        borderBottom: '0.5px solid ' + COLORS.border,
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, boxSizing: 'border-box',
      }}>
        {/* Wordmark */}
        <span style={{
          fontFamily: FONTS.cg300, fontSize: 20, fontWeight: 300,
          color: COLORS.dark, letterSpacing: '0.04em', lineHeight: 1,
        }}>TDW</span>

        {/* Mode pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          background: '#EDEAE4', borderRadius: 20, padding: 3, gap: 0,
        }}>
          {(['BUSINESS', 'DREAMAI', 'DISCOVERY'] as VendorMode[]).map(m => {
            const active = mode === m;
            const isAi = m === 'DREAMAI';
            return (
              <button
                key={m}
                onClick={() => handleModeSwitch(m)}
                style={{
                  fontFamily: FONTS.jost, fontSize: 9, fontWeight: 300,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  padding: '6px 12px', borderRadius: 16, border: 'none', cursor: 'pointer',
                  background: active ? (isAi ? COLORS.gold : COLORS.card) : 'transparent',
                  color:      active ? COLORS.dark : COLORS.navMuted,
                  transition: `background 200ms ${EASE}, color 200ms ${EASE}, box-shadow 200ms ease`,
                  boxShadow:  active ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {isAi ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    ✦ AI
                    <span style={{
                      fontFamily: FONTS.jost, fontSize: 6, fontWeight: 400,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: active ? COLORS.ink : COLORS.gold,
                      background: active ? 'rgba(12,10,9,0.15)' : 'rgba(201,168,76,0.1)',
                      borderRadius: 100, padding: '1px 5px',
                      border: `0.5px solid ${active ? 'rgba(12,10,9,0.2)' : 'rgba(201,168,76,0.3)'}`,
                    }}>beta</span>
                  </span>
                ) : m}
              </button>
            );
          })}
        </div>

        {/* Profile */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileOpen(o => !o)}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: COLORS.warm, border: '0.5px solid ' + COLORS.border,
              fontFamily: FONTS.jost, fontSize: 10, fontWeight: 300,
              letterSpacing: '0.1em', color: COLORS.ink, cursor: 'pointer',
            }}
            aria-label="Profile"
          >{initials(vendorName)}</button>

          {profileOpen && (
            <>
              <div onClick={() => setProfileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 100 }} />
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 101,
                background: COLORS.card, border: '0.5px solid ' + COLORS.border,
                borderRadius: 12, minWidth: 220, padding: 12,
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              }}>
                <div style={{ padding: '8px 8px 12px', borderBottom: '0.5px solid ' + COLORS.border, marginBottom: 8 }}>
                  <div style={{ fontFamily: FONTS.cg300, fontSize: 16, color: COLORS.dark }}>{vendorName || 'Maker'}</div>
                  <div style={{ fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: COLORS.muted, marginTop: 2 }}>{profileSub}</div>
                </div>
                <button onClick={() => { setProfileOpen(false); router.push('/vendor/studio'); showToast('Studio coming soon'); }} style={menuItem}>
                  <Settings size={14} strokeWidth={1.5} /> Studio
                </button>
                <button onClick={logout} style={{ ...menuItem, color: COLORS.danger }}>
                  <LogOut size={14} strokeWidth={1.5} /> Log out
                </button>
              </div>
            </>
          )}
        </div>
      </header>
    </>
  );
}

const menuItem: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10,
  width: '100%', padding: '10px 8px',
  background: 'transparent', border: 'none', cursor: 'pointer',
  fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#0C0A09',
  textAlign: 'left',
};
