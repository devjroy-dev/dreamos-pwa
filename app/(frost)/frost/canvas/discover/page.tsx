'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFrostMode } from '../../../layout';
import { MessageCircle, Lock, Users } from 'lucide-react';
import { fetchDiscoverFeed, makeEnquireLink } from '../../../../../lib/frost-api/discover';
import { saveVendorToMuse } from '../../../../../lib/frost-api/muse';
import type { DiscoverVendor } from '../../../../../lib/types/discover';

const haptic = (ms: number) => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(ms); } catch {}
  }
};

const SWIPE_THRESHOLD = 45;
const SWIPE_VELOCITY  = 0.3;
const TAP_MAX_MOVE    = 10;
const TAP_MAX_TIME    = 250;
const DOUBLE_TAP_MS   = 280;
const OVERLAY_DISMISS = 80;

async function handleSaveToMuse(vendorId: string): Promise<boolean> {
  try {
    const result = await saveVendorToMuse(vendorId);
    return result.ok === true;
  } catch { return false; }
}

function spawnSaveToast(alreadySaved = false) {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById('muse-save-toast');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'muse-save-toast';
  el.style.cssText = `
    position:fixed;top:calc(env(safe-area-inset-top,0px) + 72px);
    left:50%;transform:translateX(-50%);
    background:rgba(17,17,17,0.75);
    backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
    border:0.5px solid rgba(255,255,255,0.15);
    color:rgba(248,247,245,0.9);
    font-family:'Jost',sans-serif;font-size:10px;font-weight:300;
    letter-spacing:0.18em;text-transform:uppercase;
    padding:8px 18px;border-radius:20px;
    z-index:9998;pointer-events:none;white-space:nowrap;
    animation:toastSlideIn 250ms cubic-bezier(0.22,1,0.36,1) forwards;
  `;
  el.textContent = alreadySaved ? 'Already in Muse' : 'Saved to Muse \u2665';
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 300ms ease'; }, 1800);
  setTimeout(() => el.remove(), 2200);
}

function spawnHeart() {
  if (typeof document === 'undefined') return;
  const el = document.createElement('div');
  el.style.cssText = `
    position:fixed;top:50%;left:50%;
    transform:translate(-50%,-50%) scale(0);
    font-size:88px;z-index:9999;pointer-events:none;
    animation:heartPop 700ms cubic-bezier(0.22,1,0.36,1) forwards;
    color:#C9A84C;
  `;
  el.textContent = '\u2665';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 700);
  haptic(14);
}

function GlassOverlay({ vendor, visible, onClose, isBlind }: {
  vendor: DiscoverVendor; visible: boolean; onClose: () => void; isBlind: boolean;
}) {
  const dragStartY = useRef(0);
  const [dragDelta, setDragDelta] = useState(0);
  const isDragging = useRef(false);
  const [circleToast, setCircleToast] = useState(false);

  const onTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    isDragging.current = true;
    setDragDelta(0);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const delta = e.touches[0].clientY - dragStartY.current;
    if (delta > 0) setDragDelta(delta);
  };
  const onTouchEnd = () => {
    isDragging.current = false;
    if (dragDelta > OVERLAY_DISMISS) { setDragDelta(0); onClose(); }
    else setDragDelta(0);
  };

  const ty = dragDelta > 0 ? `translateY(${dragDelta}px)` : 'translateY(0)';
  const op = dragDelta > 0 ? Math.max(0.3, 1 - dragDelta / 200) : 1;

  const enquireLink = vendor.enquire_link ||
    (vendor.routing_handle ? makeEnquireLink(vendor.routing_handle) : null);

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      zIndex: 20,
      transform: visible ? ty : 'translateY(100%)',
      transition: isDragging.current ? 'none' : 'transform 340ms cubic-bezier(0.22,1,0.36,1)',
      opacity: visible ? op : 0,
      willChange: 'transform',
      background: 'rgba(12,10,9,0.82)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '0.5px solid rgba(255,255,255,0.08)',
      borderRadius: '20px 20px 0 0',
      paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 24px)',
    }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div style={{ display:'flex',justifyContent:'center',padding:'12px 0 16px' }}>
        <div style={{ width:36,height:4,borderRadius:2,background:'rgba(255,255,255,0.2)' }} />
      </div>

      {circleToast && (
        <div style={{ position:'absolute',top:16,left:'50%',transform:'translateX(-50%)',background:'rgba(255,255,255,0.15)',backdropFilter:'blur(8px)',WebkitBackdropFilter:'blur(8px)',border:'0.5px solid rgba(255,255,255,0.2)',borderRadius:20,padding:'6px 16px',fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:300,color:'rgba(248,247,245,0.8)',whiteSpace:'nowrap',zIndex:30 }}>
          Add someone to your Circle first — tap Circle in the menu
        </div>
      )}

      <div style={{ padding:'0 24px' }}>
        <p style={{ fontFamily:"'Jost',sans-serif",fontSize:9,fontWeight:300,letterSpacing:'0.22em',textTransform:'uppercase',color:'rgba(248,247,245,0.5)',margin:'0 0 8px' }}>
          {vendor.category}&nbsp;·&nbsp;{vendor.city}
        </p>

        {!isBlind && (
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:300,color:'#F8F7F5',margin:'0 0 4px',letterSpacing:'-0.01em',lineHeight:1.1 }}>
            {vendor.name}
          </h2>
        )}

        {vendor.about && (
          <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:300,fontStyle:'italic',color:'rgba(248,247,245,0.65)',margin:'0 0 12px',lineHeight:1.5 }}>
            {vendor.about}
          </p>
        )}

        {!isBlind && vendor.starting_price && (
          <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:300,color:'rgba(248,247,245,0.5)',margin:'0 0 20px' }}>
            {vendor.starting_price >= 100000
              ? `Rs ${(vendor.starting_price / 100000).toFixed(vendor.starting_price % 100000 === 0 ? 0 : 1)}L onwards`
              : `Rs ${(vendor.starting_price / 1000).toFixed(0)}K onwards`}
          </p>
        )}

        {isBlind && vendor.vibe_tags.length > 0 && (
          <p style={{ fontFamily:"'Jost',sans-serif",fontSize:10,fontWeight:300,letterSpacing:'0.15em',color:'rgba(248,247,245,0.55)',margin:'0 0 20px' }}>
            {vendor.vibe_tags.join(' · ')}
          </p>
        )}

        <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              if (enquireLink) window.open(enquireLink, '_blank');
            }}
            style={{ width:'100%',padding:'14px 0',background:'rgba(248,247,245,0.9)',border:'none',borderRadius:10,fontFamily:"'Jost',sans-serif",fontSize:10,fontWeight:300,letterSpacing:'0.22em',textTransform:'uppercase',color:'#111111',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,touchAction:'manipulation' }}
          >
            <MessageCircle size={14} strokeWidth={1.5} />
            Enquire
          </button>

          <div style={{ display:'flex',gap:8 }}>
            <button
              disabled
              style={{ flex:1,padding:'12px 0',background:'rgba(255,255,255,0.12)',border:'0.5px solid rgba(255,255,255,0.18)',borderRadius:10,fontFamily:"'Jost',sans-serif",fontSize:9,fontWeight:300,letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(248,247,245,0.7)',cursor:'not-allowed',display:'flex',alignItems:'center',justifyContent:'center',gap:6 }}
            >
              <Lock size={12} strokeWidth={1.5} />
              Lock Date
              <span style={{ fontSize:7,letterSpacing:'0.05em',textTransform:'none',fontStyle:'italic',color:'rgba(248,247,245,0.35)' }}>beta</span>
            </button>

            <button
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); setCircleToast(true); setTimeout(() => setCircleToast(false), 2500); }}
              style={{ flex:1,padding:'12px 0',background:'rgba(255,255,255,0.12)',border:'0.5px solid rgba(255,255,255,0.18)',borderRadius:10,fontFamily:"'Jost',sans-serif",fontSize:9,fontWeight:300,letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(248,247,245,0.7)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6,touchAction:'manipulation' }}
            >
              <Users size={12} strokeWidth={1.5} />
              Circle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageDots({ total, current }: { total: number; current: number }) {
  if (total <= 1) return null;
  return (
    <div style={{ position:'fixed',top:'calc(env(safe-area-inset-top,0px) + 20px)',left:'50%',transform:'translateX(-50%)',display:'flex',gap:5,zIndex:25,pointerEvents:'none' }}>
      {Array.from({ length: Math.min(total, 8) }).map((_, i) => (
        <div key={i} style={{ width: i === current ? 16 : 5,height:5,borderRadius:3,background: i === current ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.4)',transition:'all 240ms cubic-bezier(0.22,1,0.36,1)',boxShadow:'0 1px 3px rgba(0,0,0,0.3)' }} />
      ))}
    </div>
  );
}

function BlindCentreToast({ hint }: { hint: 'left'|'right'|null }) {
  if (!hint) return null;
  return (
    <div style={{ position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',zIndex:30,pointerEvents:'none',animation:'heartPop 600ms cubic-bezier(0.22,1,0.36,1) forwards' }}>
      <span style={{ fontSize:72,lineHeight:1,color:'#C9A84C' }}>
        {hint === 'right' ? '\u2665' : '\u2715'}
      </span>
    </div>
  );
}

function EmptyDeck({ mode }: { mode: string }) {
  return (
    <div style={{ position:'fixed',inset:0,background:'#0C0A09',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:12 }}>
      <span style={{ fontSize:48 }}>\u2726</span>
      <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:300,fontStyle:'italic',color:'rgba(248,247,245,0.7)' }}>
        {mode === 'blind' ? "You've seen them all." : "You've seen everyone."}
      </span>
      <span style={{ fontFamily:"'Jost',sans-serif",fontSize:9,fontWeight:300,letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(248,247,245,0.35)' }}>
        Check back soon
      </span>
    </div>
  );
}

function DiscoveryFeedContent() {
  const { mode: frostMode } = useFrostMode();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'discover';
  const isBlind = mode === 'blind';

  const [vendors, setVendors] = useState<DiscoverVendor[]>([]);
  const [vendorIdx, setVendorIdx] = useState(0);
  const [imageIdx, setImageIdx] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [dissolveKey, setDissolveKey] = useState(0);
  const [blindLift, setBlindLift] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const touchStart = useRef<{ x: number; y: number; t: number } | null>(null);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapTime = useRef(0);
  const tapCount = useRef(0);

  useEffect(() => {
    setLoading(true);
    fetchDiscoverFeed({ page: 0 })
      .then(({ vendors: v, has_more }) => {
        setVendors(v);
        setHasMore(has_more);
        setVendorIdx(0);
        setImageIdx(0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!hasMore) return;
    if (vendors.length === 0) return;
    if (vendorIdx < vendors.length - 3) return;
    const nextPage = currentPage + 1;
    fetchDiscoverFeed({ page: nextPage })
      .then(({ vendors: more, has_more }) => {
        if (more.length > 0) {
          setVendors(prev => [...prev, ...more]);
          setCurrentPage(nextPage);
          setHasMore(has_more);
        } else {
          setHasMore(false);
        }
      })
      .catch(() => {});
  }, [vendorIdx, vendors.length, hasMore, currentPage]);

  const vendor = vendors[vendorIdx];
  // Preload next images silently — reduces perceived lag
  useEffect(() => {
    if (!vendor) return;
    const toPreload: string[] = [];
    for (let i = imageIdx + 1; i < Math.min(vendor.photos.length, imageIdx + 3); i++) {
      toPreload.push(vendor.photos[i]);
    }
    if (vendorIdx + 1 < vendors.length) {
      const next = vendors[vendorIdx + 1];
      if (next.photos[0]) toPreload.push(next.photos[0]);
    }
    toPreload.forEach(src => { const img = new Image(); img.src = src; });
  }, [vendorIdx, imageIdx, vendor, vendors]);

  const goNextVendor = useCallback((direction: 'left'|'right'|null = null) => {
    if (vendorIdx >= vendors.length - 1) return;
    if (direction) {
      setVendorIdx(i => i + 1);
      setImageIdx(0);
      setOverlayVisible(false);
      setDissolveKey(k => k + 1);
      haptic(5);
    } else {
      setVendorIdx(i => i + 1);
      setImageIdx(0);
      setOverlayVisible(false);
      setDissolveKey(k => k + 1);
      haptic(5);
    }
  }, [vendorIdx, vendors.length]);

  const goPrevVendor = useCallback(() => {
    if (vendorIdx <= 0) return;
    setVendorIdx(i => i - 1);
    setImageIdx(0);
    setOverlayVisible(false);
    setDissolveKey(k => k + 1);
    haptic(5);
  }, [vendorIdx]);

  const nextImage = useCallback(() => {
    if (vendor && imageIdx < vendor.photos.length - 1) {
      setImageIdx(i => i + 1); setDissolveKey(k => k + 1); haptic(4);
    }
  }, [imageIdx, vendor]);

  const prevImage = useCallback(() => {
    if (imageIdx > 0) { setImageIdx(i => i - 1); setDissolveKey(k => k + 1); haptic(4); }
  }, [imageIdx]);

  const handleSingleTap = useCallback(() => {
    if (isBlind) return;
    setOverlayVisible(v => !v);
    haptic(4);
  }, [isBlind]);

  const handleDoubleTap = useCallback(() => {
    if (!vendor) return;
    spawnHeart();
    handleSaveToMuse(vendor.id).then(ok => spawnSaveToast(!ok));
  }, [isBlind, vendor]);

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current) return;
    const start = touchStart.current;
    touchStart.current = null;
    const end = e.changedTouches[0];
    const dx = end.clientX - start.x;
    const dy = end.clientY - start.y;
    const dt = Date.now() - start.t;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (absX < TAP_MAX_MOVE && absY < TAP_MAX_MOVE && dt < TAP_MAX_TIME) {
      const now = Date.now();
      const since = now - lastTapTime.current;
      if (since < DOUBLE_TAP_MS && tapCount.current >= 1) {
        if (tapTimer.current) clearTimeout(tapTimer.current);
        tapCount.current = 0;
        handleDoubleTap();
      } else {
        tapCount.current = 1; lastTapTime.current = now;
        tapTimer.current = setTimeout(() => {
          if (tapCount.current === 1) handleSingleTap();
          tapCount.current = 0;
        }, DOUBLE_TAP_MS);
      }
      return;
    }

    const velocity = Math.max(absX, absY) / Math.max(dt, 1);
    const passed = Math.max(absX, absY) > SWIPE_THRESHOLD || velocity > SWIPE_VELOCITY;
    if (!passed) return;

    if (isBlind) {
      if (absX > absY) {
        if (dx > SWIPE_THRESHOLD) {
          setBlindLift(true);
          
          spawnHeart();
          if (vendor) handleSaveToMuse(vendor.id).then(ok => spawnSaveToast(!ok));
          goNextVendor('right');
        } else if (dx < -SWIPE_THRESHOLD) {
          setBlindLift(true);
          
          goNextVendor('left');
        }
      }
      return;
    }

    if (overlayVisible && absY > absX && dy > OVERLAY_DISMISS) {
      setOverlayVisible(false); return;
    }
    if (absY > absX) {
      if (dy < -SWIPE_THRESHOLD) goNextVendor(); else if (dy > SWIPE_THRESHOLD) goPrevVendor();
    } else {
      if (dx < -SWIPE_THRESHOLD) nextImage(); else if (dx > SWIPE_THRESHOLD) prevImage();
    }
  };

  if (loading) {
    return (
      <div style={{ position:'fixed',inset:0,background:'#0C0A09',display:'flex',alignItems:'center',justifyContent:'center' }}>
        <span style={{ fontFamily:"'Jost',sans-serif",fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(245,240,232,0.35)' }}>Loading</span>
      </div>
    );
  }

  if (!vendor) return <EmptyDeck mode={mode} />;

  const photos = vendor.photos.length > 0 ? vendor.photos : [];
  const currentPhoto = photos[imageIdx] || null;

  return (
    <>
      <style jsx global>{`
        @keyframes heartPop {
          0%   { opacity:0; transform:translate(-50%,-50%) scale(0.3); }
          45%  { opacity:1; transform:translate(-50%,-50%) scale(1.15); }
          70%  { transform:translate(-50%,-50%) scale(0.95); }
          100% { opacity:0; transform:translate(-50%,-50%) scale(1); }
        }
        @keyframes dissolveIn { from{opacity:0} to{opacity:1} }
        @keyframes liftOff {
          0%   { opacity:1; transform:translateY(0) scale(1); }
          60%  { opacity:0.3; transform:translateY(-18%) scale(0.97); }
          100% { opacity:0; transform:translateY(-28%) scale(0.95); }
        }
        @keyframes slideInUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes toastSlideIn { from{opacity:0;transform:translateX(-50%) translateY(-8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
      `}</style>

      <div
        style={{ position:'fixed',inset:0,background:'#0C0A09',overflow:'hidden',touchAction:'none',userSelect:'none',WebkitUserSelect:'none' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          key={dissolveKey}
          style={{
            position:'absolute', inset:0,
            animation: blindLift
              ? 'liftOff 280ms cubic-bezier(0.22,1,0.36,1) forwards'
              : 'dissolveIn 260ms cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {currentPhoto ? (
            <img src={currentPhoto} alt="" draggable={false} style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',willChange:'opacity' }} />
          ) : (
            <div style={{ position:'absolute',inset:0,background:'#1a1714',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontStyle:'italic',color:'rgba(248,247,245,0.2)' }}>No photo yet</span>
            </div>
          )}
          <div style={{ position:'absolute',inset:0,background:'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 20%, transparent 65%, rgba(0,0,0,0.5) 100%)',pointerEvents:'none' }} />
        </div>

        <ImageDots total={photos.length} current={imageIdx} />

        <button
          onClick={() => router.push('/frost')}
          style={{ position:'fixed',top:'calc(env(safe-area-inset-top,0px) + 16px)',left:16,zIndex:25,width:36,height:36,borderRadius:'50%',background:'rgba(0,0,0,0.35)',backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)',border:'0.5px solid rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'rgba(255,255,255,0.9)' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {isBlind && (
          <div style={{ position:'fixed',top:'calc(env(safe-area-inset-top,0px) + 20px)',right:16,zIndex:25,background:'rgba(0,0,0,0.45)',backdropFilter:'blur(10px)',WebkitBackdropFilter:'blur(10px)',border:'0.5px solid rgba(255,255,255,0.15)',borderRadius:20,padding:'5px 14px',fontFamily:"'Jost',sans-serif",fontSize:8,fontWeight:300,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(255,255,255,0.75)' }}>
            Blind
          </div>
        )}


        {!isBlind && !overlayVisible && (
          <div style={{ position:'fixed',bottom:'calc(env(safe-area-inset-bottom,0px) + 28px)',left:0,right:0,display:'flex',justifyContent:'center',zIndex:10,pointerEvents:'none',animation:'slideInUp 400ms cubic-bezier(0.22,1,0.36,1)' }}>
            <span style={{ fontFamily:"'Jost',sans-serif",fontSize:9,fontWeight:200,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(255,255,255,0.4)' }}>
              Tap · Double-tap to save · Swipe to browse
            </span>
          </div>
        )}

        {!isBlind && (
          <GlassOverlay
            vendor={vendor}
            visible={overlayVisible}
            onClose={() => setOverlayVisible(false)}
            isBlind={isBlind}
          />
        )}
      </div>
    </>
  );
}

export default function DiscoveryFeed() {
  return (
    <Suspense fallback={
      <div style={{ position:'fixed',inset:0,background:'#0C0A09',display:'flex',alignItems:'center',justifyContent:'center' }}>
        <span style={{ fontFamily:"'Jost',sans-serif",fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(245,240,232,0.35)' }}>
          Loading
        </span>
      </div>
    }>
      <DiscoveryFeedContent />
    </Suspense>
  );
}
