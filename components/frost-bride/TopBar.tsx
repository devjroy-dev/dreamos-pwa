'use client';

// components/frost-bride/TopBar.tsx
// Bride TopBar. 2-mode pill: PLAN / DISCOVER.
// Light bg (#F8F7F5) — bride nav convention differs from vendor dark nav.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useBrideMode, type BrideMode } from '../../app/(bride)/layout';
import { COLORS, FONTS, EASE, initials } from './tokens';
import { getCoupleSession } from './atoms';

const MODE_DESTINATION: Record<BrideMode, string> = {
  PLAN:     '/couple/today',
  DISCOVER: '/couple/muse',
};

export default function BrideTopBar() {
  const router = useRouter();
  const { mode } = useBrideMode();
  const [profileOpen, setProfileOpen] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    const s = getCoupleSession();
    if (s?.name) setName(s.name);
  }, []);

  const handleMode = (m: BrideMode) => {
    try { localStorage.setItem('couple_app_mode', m); } catch {}
    router.push(MODE_DESTINATION[m]);
  };

  const logout = () => {
    try {
      ['couple_session', 'couple_web_session', 'access_token', 'refresh_token',
       'couple_last_path', 'couple_app_mode'].forEach(k => localStorage.removeItem(k));
    } catch {}
    router.replace('/');
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400&family=Jost:wght@200;300;400&display=swap');`}</style>

      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 56, backgroundColor: COLORS.bg,
        borderBottom: '0.5px solid ' + COLORS.border,
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, boxSizing: 'border-box',
      }}>
        {/* Wordmark */}
        <span style={{ fontFamily: FONTS.cg300, fontSize: 20, color: COLORS.dark, letterSpacing: '0.04em', lineHeight: 1 }}>TDW</span>

        {/* 2-mode pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', background: '#EDEAE4', borderRadius: 20, padding: 3, gap: 0 }}>
          {(['PLAN', 'DISCOVER'] as BrideMode[]).map(m => {
            const active = mode === m;
            return (
              <button
                key={m}
                onClick={() => handleMode(m)}
                style={{
                  fontFamily: FONTS.jost, fontSize: 9, fontWeight: 300,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  padding: '6px 14px', borderRadius: 16, border: 'none', cursor: 'pointer',
                  background: active ? COLORS.card : 'transparent',
                  color:      active ? COLORS.dark  : COLORS.navMuted,
                  boxShadow:  active ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
                  transition: `background 200ms ${EASE}, color 200ms ${EASE}`,
                }}
              >{m}</button>
            );
          })}
        </div>

        {/* Profile */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileOpen(o => !o)}
            style={{ width: 32, height: 32, borderRadius: '50%', background: COLORS.warm, border: '0.5px solid ' + COLORS.border, fontFamily: FONTS.jost, fontSize: 10, color: COLORS.ink, cursor: 'pointer' }}
            aria-label="Profile"
          >{initials(name)}</button>

          {profileOpen && (
            <>
              <div onClick={() => setProfileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 100 }} />
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 101, background: COLORS.card, border: '0.5px solid ' + COLORS.border, borderRadius: 12, minWidth: 180, padding: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                <div style={{ padding: '8px 8px 12px', borderBottom: '0.5px solid ' + COLORS.border, marginBottom: 8 }}>
                  <div style={{ fontFamily: FONTS.cg300, fontSize: 16, color: COLORS.dark }}>{name || 'Dreamer'}</div>
                </div>
                <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 8px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: FONTS.dm300, fontSize: 13, color: COLORS.danger, textAlign: 'left' }}>
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
