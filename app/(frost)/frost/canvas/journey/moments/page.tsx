'use client';
import React from 'react';
import CanvasShell from '../../../../../../components/frost/CanvasShell';
import { useFrostMode } from '../../../../layout';
import { MUSE_LOOKS, FF, SP } from '../../../../../../lib/frost/tokens';

export default function JourneyMoments() {
  const { look } = useFrostMode(); const t = MUSE_LOOKS[look];

  return (
    <CanvasShell eyebrow="Moments" backTo="/frost/canvas/sanctuary">
      <div style={{ padding: `${SP.xl}px ${SP.xxl}px ${SP.huge}px`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>

        <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize:22, color: t.ink, lineHeight: 1.3, marginBottom: SP.xl }}>
          The real moments<br />are coming.
        </div>

        <div style={{ fontFamily: FF.body, fontSize:16, color: t.soft, lineHeight: 1.8, maxWidth: 300, marginBottom: SP.xl }}>
          Soon you'll see every photograph from the shopping trips, the trials, the late nights planning — all here, shared by you and your circle.
        </div>

        <div style={{ fontFamily: FF.body, fontSize:16, color: t.soft, lineHeight: 1.7, maxWidth: 280, marginBottom: SP.huge }}>
          A month after the wedding, you'll scroll through and remember not the chaos but the warmth.
        </div>

        <div style={{ fontFamily: FF.label, fontSize:11, letterSpacing: '0.25em', textTransform: 'uppercase', color: t.brassMuted }}>
          Drop a photo on WhatsApp to begin
        </div>

      </div>
    </CanvasShell>
  );
}
