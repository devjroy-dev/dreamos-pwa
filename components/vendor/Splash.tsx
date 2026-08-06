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
        // ── TDW_09 MICRO-2 · F-09.73 · R-M4 = (c) — A RULED THEME-INVARIANT GATE ──
        // WAS var(--atelier-bg, #171512) against a token DECLARED NOWHERE, so this
        // ground was pinned dark on every theme by accident — while the wordmark
        // below read var(--atelier-ink), which IS declared and DOES flip. On
        // Editorial Paper that put #1A0F08 on #171512: 1.03:1. The founder saw
        // nothing because there was nothing to see.
        // R-M4 rules this screen INVARIANT WHOLE rather than themed: it is a 2.2s
        // brand gate on a cold open, it should read the same on both themes, and
        // pinning ONLY the ground would leave the same broken pair. Ground and ink
        // are both literals now, and the pair is measured — so this surface passes
        // the pinned-ground property honestly rather than by exemption.
        // --atelier-bg NOW EXISTS (app/globals.css, both homes; ThemeContext), for
        // SwipeRow's legitimate read. This file deliberately does not read it: that
        // is the invariance decision, and it is stated here so the next sitting that
        // touches the token is forced past this sentence.
        // MEASURED on #171512 — DREAMAI 5.52:1 · the wordmark 14.66:1 · the skip
        // line 4.95:1, all above the 4.5 bar, both themes, because none of them move.
        background: '#171512',
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
        fontSize: 31, lineHeight: 1.5, color: '#EDE6D6', letterSpacing: '0.04em', // R-M4: pinned with its ground
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
          color: '#8a8578', // R-M4: pinned with its ground — 4.95:1 on #171512
        }}>tap to continue</div>
      )}
      <style>{`@keyframes splashIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
