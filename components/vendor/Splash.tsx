'use client';
// components/vendor/Splash.tsx — TDW_04 A4 (P6, founder order): the cold-open
// hero. Shows ONCE per session on a cold open of the vendor shell — client-side
// navigation never re-triggers it (sessionStorage latch). Minimum 2.2s, then
// dissolves; tap-skip honoured only after the minimum. Offline cold starts skip
// silently (no network is needed — but if anything throws, the latch still
// sets and the app renders).
//
// EXECUTOR SIMPLIFICATION, logged for the founder: the spec's portfolio
// CAROUSEL needs an asset source (vendor portfolio images) that no vendor-shell
// API guarantees offline. Shipped: the wordmark hero (DREAMAI · The Dream
// Wedding, brass rule, atelier ground). The carousel slots in the moment a
// portfolio source is named — the component is the mount point.

import { useEffect, useState } from 'react';

const MIN_MS = 2200;
const KEY = 'tdw_splash_seen';

export function Splash() {
  const [visible, setVisible] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) return;
      sessionStorage.setItem(KEY, '1');
    } catch { return; } // storage unavailable → never block the app
    setVisible(true);
    const skipT = setTimeout(() => setCanSkip(true), MIN_MS);
    const autoT = setTimeout(() => setLeaving(true), MIN_MS + 600);
    return () => { clearTimeout(skipT); clearTimeout(autoT); };
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => setVisible(false), 450);
    return () => clearTimeout(t);
  }, [leaving]);

  if (!visible) return null;
  return (
    <div
      onClick={() => { if (canSkip) setLeaving(true); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'var(--atelier-bg, #171512)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        opacity: leaving ? 0 : 1, transition: 'opacity 450ms ease',
        cursor: canSkip ? 'pointer' : 'default',
      }}
    >
      <div style={{
        fontFamily: 'var(--font-jost), system-ui, sans-serif', fontWeight: 200, fontSize: 10,
        letterSpacing: '0.6em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.8)',
        marginBottom: 14, animation: 'splashIn 900ms ease both',
      }}>DREAMAI</div>
      <div style={{
        fontFamily: 'var(--font-italiana), var(--font-cormorant), Georgia, serif', fontWeight: 400,
        fontSize: 30, color: 'var(--atelier-ink, #EDE6D6)', letterSpacing: '0.04em',
        animation: 'splashIn 900ms 150ms ease both',
      }}>The Dream Wedding</div>
      <div style={{
        width: 44, height: 1, background: 'rgba(201,168,76,0.5)', marginTop: 18,
        animation: 'splashIn 900ms 300ms ease both',
      }} />
      {canSkip && (
        <div style={{
          position: 'absolute', bottom: 42, fontFamily: 'var(--font-jost), system-ui, sans-serif',
          fontWeight: 300, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'var(--atelier-ink-mute, #8a8578)',
        }}>tap to continue</div>
      )}
      <style>{`@keyframes splashIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
