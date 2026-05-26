'use client';

// Moments — Aubade-Nocturne skin. Coming soon placeholder.

import React from 'react';
import { useRouter } from 'next/navigation';
import { AUBADE, FF } from '../../../../../../lib/frost/tokens';

export default function JourneyMoments() {
  const router = useRouter();
  return (
    <div style={{ position: 'fixed', inset: 0, background: `linear-gradient(180deg, ${AUBADE.paper} 0%, ${AUBADE.paper2} 60%, ${AUBADE.paperDeep} 100%)`, display: 'flex', flexDirection: 'column', userSelect: 'none', WebkitUserSelect: 'none' }}>
      <div style={{ paddingTop: 'calc(env(safe-area-inset-top,0px) + 14px)', paddingBottom: 14, paddingLeft: 22, paddingRight: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${AUBADE.line}`, flexShrink: 0, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', background: 'rgba(10,9,11,0.60)' }}>
        <button onClick={() => router.push('/frost/canvas/sanctuary')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: FF.mono, fontSize: 9, fontWeight: 300, letterSpacing: '0.22em', textTransform: 'uppercase', color: AUBADE.inkMute, padding: 0, WebkitTapHighlightColor: 'transparent' }}>
          <span style={{ color: AUBADE.aubade }}>←</span> Sanctuary
        </button>
        <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 19, color: AUBADE.ink, fontFeatureSettings: '"opsz" 9' }}>Moments</div>
        <div style={{ width: 60 }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 40px', textAlign: 'center' }}>
        <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 26, color: AUBADE.ink, lineHeight: 1.3, marginBottom: 16, letterSpacing: '-0.02em', fontFeatureSettings: '"opsz" 9' }}>
          The real moments<br />are coming.
        </div>
        <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 15, color: AUBADE.inkSoft, lineHeight: 1.7, marginBottom: 12, fontFeatureSettings: '"opsz" 9' }}>
          Every photograph from the shopping trips, the trials, the late nights planning — all here, shared by you and your circle.
        </div>
        <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 15, color: AUBADE.inkSoft, lineHeight: 1.7, marginBottom: 40, fontFeatureSettings: '"opsz" 9' }}>
          A month after the wedding, you'll scroll through and remember not the chaos but the warmth.
        </div>
        <div style={{ fontFamily: FF.mono, fontSize: 8.5, letterSpacing: '0.28em', textTransform: 'uppercase', color: AUBADE.inkMute }}>
          Drop a photo on WhatsApp to begin
        </div>
      </div>
    </div>
  );
}
