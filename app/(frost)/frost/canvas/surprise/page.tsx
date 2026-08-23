'use client';
// app/(frost)/frost/canvas/surprise/page.tsx
// Surprise Me — curated full-bleed images matched to her taste profile.
//
// Flow:
//   - If taste_quiz_done = false → redirect to Muse (tag overlay shows there)
//   - If taste_quiz_done = true  → fetch /taste/surprise → full-bleed reveal
//   - Tap → show caption + tags + source
//   - Swipe left/right or chevrons to browse

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFrostMode } from '@/lib/frost/FrostCtx'; // R-36.11: the context left the layout
import { MUSE_LOOKS, MODES, FF, SP, FR, EASE } from '../../../../../lib/frost/tokens';

declare const process: { env: { NEXT_PUBLIC_API_BASE?: string } };
const API_BASE = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE) || 'https://dream-os-production.up.railway.app';

interface SurpriseImage {
  image_url: string;
  caption: string | null;
  aesthetic_tags: string[];
  source_url: string | null;
  source: string;
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem('access_token'); } catch { return null; }
}

export default function SurpriseMe() {
  const router = useRouter();
  const { look, homeMode } = useFrostMode();
  const t = MUSE_LOOKS[look];
  const m = MODES[homeMode];

  const [phase, setPhase]   = useState<'loading'|'reveal'|'empty'|'no-profile'>('loading');
  const [images, setImages] = useState<SurpriseImage[]>([]);
  const [idx, setIdx]       = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    async function load() {
      const token = getToken();
      if (!token) { setPhase('no-profile'); return; }
      try {
        const res  = await fetch(`${API_BASE}/api/v2/couple/taste/surprise`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        if (!data.profile_set) { setPhase('no-profile'); return; }
        const imgs = data.images || [];
        if (imgs.length === 0) { setPhase('empty'); return; }
        setImages(imgs);
        setPhase('reveal');
      } catch { setPhase('empty'); }
    }
    load();
  }, []);

  const prev = useCallback(() => { setShowInfo(false); setIdx(i => Math.max(0, i - 1)); }, []);
  const next = useCallback(() => { setShowInfo(false); setIdx(i => Math.min(images.length - 1, i + 1)); }, [images.length]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd   = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) { setShowInfo(s => !s); return; }
    if (dx < 0) next(); else prev();
  };

  const bg = `linear-gradient(to bottom, ${m.dreamGradient[0]}, ${m.dreamGradient[1]})`;

  const BackBtn = () => (
    <button onClick={() => router.push('/frost/canvas/sanctuary')}
      style={{ position:'absolute', top:'calc(env(safe-area-inset-top,0px) + 16px)', left:16, zIndex:50, background:'rgba(0,0,0,0.35)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', border:'none', borderRadius:FR.pill, padding:'6px 14px', display:'flex', alignItems:'center', gap:6, fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(245,240,232,0.9)', cursor:'pointer' }}>
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
      Back
    </button>
  );

  if (phase === 'loading') return (
    <div style={{ position:'fixed', inset:0, background:bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:22, color:'rgba(245,240,232,0.5)', letterSpacing:4 }}>…</div>
    </div>
  );

  if (phase === 'no-profile') return (
    <div style={{ position:'fixed', inset:0, background:bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 32px', userSelect:'none' }}>
      <BackBtn />
      <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:22, color:'rgba(245,240,232,0.9)', textAlign:'center', lineHeight:1.3, marginBottom:SP.l }}>Tell us what moves you.</div>
      <div style={{ fontFamily:FF.body, fontSize:16, color:'rgba(245,240,232,0.5)', textAlign:'center', lineHeight:1.7, marginBottom:SP.xl }}>Open Muse to set your aesthetic — then we'll curate your surprises.</div>
      <button onClick={() => router.push('/frost/canvas/muse')}
        style={{ padding:'12px 28px', background:t.brass, border:'none', borderRadius:FR.pill, fontFamily:FF.label, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:'#1B1612', cursor:'pointer' }}>
        Go to Muse
      </button>
    </div>
  );

  if (phase === 'empty') return (
    <div style={{ position:'fixed', inset:0, background:bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 32px', userSelect:'none' }}>
      <BackBtn />
      <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:22, color:'rgba(245,240,232,0.9)', textAlign:'center', lineHeight:1.3, marginBottom:SP.l }}>Your surprises are coming.</div>
      <div style={{ fontFamily:FF.body, fontSize:16, color:'rgba(245,240,232,0.5)', textAlign:'center', lineHeight:1.7 }}>We're curating images that match your aesthetic. Check back soon.</div>
    </div>
  );

  const img = images[idx];

  return (
    <div style={{ position:'fixed', inset:0, background:'#0C0A09', userSelect:'none' }}
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
      onClick={() => setShowInfo(s => !s)}>

      <BackBtn />

      {/* Image */}
      {img?.image_url && (
        <img src={img.image_url} alt={img.caption || ''} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
      )}

      {/* Vignette */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 55%, rgba(0,0,0,0.65) 100%)', pointerEvents:'none' }} />

      {/* Dots */}
      <div style={{ position:'absolute', top:'calc(env(safe-area-inset-top,0px) + 20px)', left:'50%', transform:'translateX(-50%)', display:'flex', gap:6, zIndex:20, pointerEvents:'none' }}>
        {images.slice(0, Math.min(images.length, 15)).map((_, i) => (
          <div key={i} style={{ width:i===idx?16:4, height:4, borderRadius:2, background:i===idx?t.brass:'rgba(255,255,255,0.3)', transition:`all 250ms ${EASE}` }} />
        ))}
      </div>

      {/* Info overlay */}
      {showInfo && img && (
        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:`24px 24px calc(24px + env(safe-area-inset-bottom,0px))`, background:'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 100%)', zIndex:20 }}>
          {img.caption && (
            <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:22, color:'rgba(245,240,232,0.95)', marginBottom:10, lineHeight:1.3 }}>{img.caption}</div>
          )}
          {img.aesthetic_tags?.length > 0 && (
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
              {img.aesthetic_tags.map((tag: string) => (
                <span key={tag} style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:t.brass, padding:'3px 8px', border:`0.5px solid rgba(191,160,77,0.4)`, borderRadius:FR.pill }}>{tag}</span>
              ))}
            </div>
          )}
          {img.source_url && (
            <a href={img.source_url} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(245,240,232,0.4)', textDecoration:'none' }}>
              View source ↗
            </a>
          )}
        </div>
      )}

      {/* Chevrons */}
      {idx > 0 && (
        <button onClick={e => { e.stopPropagation(); prev(); }}
          style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', zIndex:30, background:'rgba(0,0,0,0.3)', border:'none', borderRadius:24, width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
          <ChevronLeft size={20} color="rgba(245,240,232,0.8)" strokeWidth={1.5} />
        </button>
      )}
      {idx < images.length - 1 && (
        <button onClick={e => { e.stopPropagation(); next(); }}
          style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', zIndex:30, background:'rgba(0,0,0,0.3)', border:'none', borderRadius:24, width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
          <ChevronRight size={20} color="rgba(245,240,232,0.8)" strokeWidth={1.5} />
        </button>
      )}

      {/* Hint */}
      {!showInfo && (
        <div style={{ position:'absolute', bottom:'calc(env(safe-area-inset-bottom,0px) + 24px)', left:0, right:0, textAlign:'center', zIndex:20, pointerEvents:'none' }}>
          <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(245,240,232,0.25)' }}>Tap to reveal · Swipe to browse</div>
        </div>
      )}
    </div>
  );
}
