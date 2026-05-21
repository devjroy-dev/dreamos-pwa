#!/usr/bin/env python3
"""
Bride Block 2 — Wire Discover + Muse to real backend (dreamos-pwa)
Run from dreamos-pwa Codespace terminal: python3 bride_block_2_writer.py
Writes 5 files + patches _base.ts.
"""

import os, sys

ROOT = '/workspaces/dreamos-pwa'

# ── lib/types/discover.ts ─────────────────────────────────────────────────────
TYPES_DISCOVER = """\
// lib/types/discover.ts
// Types for the discover feed and muse board (B-1 / B-2).

export interface DiscoverVendor {
  id: string;
  name: string | null;
  category: string | null;
  city: string | null;
  routing_handle: string | null;
  starting_price: number | null;
  photos: string[];
  vibe_tags: string[];
  about: string | null;
  enquire_link: string | null;
}

export interface FeaturedCollection {
  id: string;
  title: string;
  subtitle: string | null;
  cover_image: string | null;
  vendor_ids: string[];
}

export interface DiscoverHero {
  id: string;
  name: string | null;
  image_url: string | null;
  caption: string | null;
  routing_handle: string | null;
  enquire_link: string | null;
}

export interface MuseSave {
  id: string;
  save_number: number;
  image_url: string | null;
  source_type: string;
  vendor_id: string | null;
  vendor_name: string | null;
  caption: string | null;
  aesthetic_tags: string[];
  saved_by_role: 'bride' | 'circle_member';
  circle_comment_count: number;
  created_at: string;
}

export interface MuseActivity {
  id: string;
  activity_type: string;
  member_name: string;
  role: string;
  content: string | null;
  created_at: string;
}

export interface MuseActivityResponse {
  ok: true;
  save: {
    id: string;
    image_url: string | null;
    vendor_name: string | null;
  };
  activity: MuseActivity[];
}
"""

# ── lib/frost-api/discover.ts ─────────────────────────────────────────────────
FROST_DISCOVER = """\
// lib/frost-api/discover.ts
// Typed discover API client. Public endpoints — no auth required.

import { USE_MOCKS, API_BASE, apiGet } from './_base';
import type { DiscoverVendor, FeaturedCollection, DiscoverHero } from '../types/discover';

const WHATSAPP_NUMBER = '917982159047';

export function makeEnquireLink(routingHandle: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=TDW-${routingHandle}`;
}

export interface DiscoverFeedResponse {
  ok: true;
  vendors: DiscoverVendor[];
  page: number;
  has_more: boolean;
  total: number;
}

export async function fetchDiscoverFeed(params?: {
  category?: string;
  city?: string;
  page?: number;
}): Promise<DiscoverFeedResponse> {
  if (USE_MOCKS) return { ok: true, vendors: [], has_more: false, page: 0, total: 0 };
  return apiGet<DiscoverFeedResponse>('/api/v2/discover/feed', params as Record<string, string | number | undefined | null>);
}

export async function fetchFeatured(): Promise<{ ok: true; collections: FeaturedCollection[] }> {
  if (USE_MOCKS) return { ok: true, collections: [] };
  return apiGet('/api/v2/discover/featured');
}

export async function fetchHeroes(): Promise<{ ok: true; heroes: DiscoverHero[] }> {
  if (USE_MOCKS) return { ok: true, heroes: [] };
  return apiGet('/api/v2/discover/heroes');
}
"""

# ── lib/frost-api/muse.ts ─────────────────────────────────────────────────────
FROST_MUSE = """\
// lib/frost-api/muse.ts
// Typed muse API client. Requires couple auth JWT.

import { USE_MOCKS, apiGet, apiPost, apiDelete, getCoupleSession } from './_base';
import type { MuseSave, MuseActivityResponse } from '../types/discover';

export interface MuseSavesResponse {
  ok: true;
  saves: MuseSave[];
  total: number;
}

export async function fetchMuseSaves(params?: {
  saved_by?: 'all' | 'bride' | 'circle_member';
  limit?: number;
  offset?: number;
}): Promise<MuseSavesResponse> {
  const session = getCoupleSession();
  if (!session?.id) return { ok: true, saves: [], total: 0 };
  if (USE_MOCKS) return { ok: true, saves: [], total: 0 };
  return apiGet<MuseSavesResponse>(
    `/api/v2/couple/muse/${session.id}`,
    params as Record<string, string | number | undefined | null>,
  );
}

export async function saveVendorToMuse(vendorId: string): Promise<{
  ok: boolean; save_id?: string; save_number?: number; already_saved?: boolean;
}> {
  if (USE_MOCKS) return { ok: true, already_saved: false };
  return apiPost('/api/v2/couple/muse/save', { vendor_id: vendorId });
}

export async function deleteMuseSave(saveId: string): Promise<boolean> {
  if (USE_MOCKS) return true;
  const res = await apiDelete<{ ok: boolean }>(`/api/v2/couple/muse/${saveId}`);
  return res.ok === true;
}

export async function fetchSaveActivity(saveId: string): Promise<MuseActivityResponse | null> {
  if (USE_MOCKS) return null;
  return apiGet<MuseActivityResponse>(`/api/v2/couple/muse/saves/${saveId}/activity`);
}
"""

# ── discover/page.tsx ─────────────────────────────────────────────────────────
DISCOVER_PAGE = r"""'use client';

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
          {vendor.category}&nbsp;\u00b7&nbsp;{vendor.city}
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
            {vendor.vibe_tags.join(' \u00b7 ')}
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
  const [blindHint, setBlindHint] = useState<'left'|'right'|null>(null);
  const [blindSlide, setBlindSlide] = useState<'left'|'right'|null>(null);
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

  const goNextVendor = useCallback((direction: 'left'|'right'|null = null) => {
    if (vendorIdx >= vendors.length - 1) return;
    if (direction) {
      setBlindSlide(direction);
      setTimeout(() => {
        setBlindSlide(null);
        setVendorIdx(i => i + 1);
        setImageIdx(0);
        setOverlayVisible(false);
        setDissolveKey(k => k + 1);
        haptic(5);
      }, 220);
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
    if (isBlind || !vendor) return;
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
          setBlindHint('right');
          setTimeout(() => setBlindHint(null), 400);
          spawnHeart();
          if (vendor) handleSaveToMuse(vendor.id).then(ok => spawnSaveToast(!ok));
          goNextVendor('right');
        } else if (dx < -SWIPE_THRESHOLD) {
          setBlindHint('left');
          setTimeout(() => setBlindHint(null), 400);
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
        @keyframes slideInUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes toastSlideIn { from{opacity:0;transform:translateX(-50%) translateY(-8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes slideOffLeft { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(-120%)} }
        @keyframes slideOffRight { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(120%)} }
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
            animation: blindSlide === 'left'
              ? 'slideOffLeft 220ms ease forwards'
              : blindSlide === 'right'
              ? 'slideOffRight 220ms ease forwards'
              : 'dissolveIn 260ms ease',
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

        {isBlind && <BlindCentreToast hint={blindHint} />}

        {!isBlind && !overlayVisible && (
          <div style={{ position:'fixed',bottom:'calc(env(safe-area-inset-bottom,0px) + 28px)',left:0,right:0,display:'flex',justifyContent:'center',zIndex:10,pointerEvents:'none',animation:'slideInUp 400ms cubic-bezier(0.22,1,0.36,1)' }}>
            <span style={{ fontFamily:"'Jost',sans-serif",fontSize:9,fontWeight:200,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(255,255,255,0.4)' }}>
              Tap \u00b7 Double-tap to save \u00b7 Swipe to browse
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
"""

# ── muse/page.tsx ─────────────────────────────────────────────────────────────
MUSE_PAGE = r"""'use client';

// app/(frost)/canvas/muse/page.tsx
// Muse canvas — wired to real backend. Zero design changes.

import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import CanvasShell from '../../../../../components/frost/CanvasShell';
import { useFrostMode } from '../../../layout';
import { MUSE_LOOKS, FF, SP, FR } from '../../../../../lib/frost/tokens';
import { fetchMuseSaves, deleteMuseSave, fetchSaveActivity } from '../../../../../lib/frost-api/muse';
import type { MuseSave, MuseActivity } from '../../../../../lib/types/discover';

type MuseCeremony = 'all' | 'haldi' | 'mehendi' | 'sangeet' | 'reception' | 'wedding';
type SourceFilter = 'all' | 'bride' | 'circle_member';

const CEREMONY_FILTERS: { label: string; value: MuseCeremony }[] = [
  { label: 'All',       value: 'all'       },
  { label: 'Haldi',     value: 'haldi'     },
  { label: 'Mehendi',   value: 'mehendi'   },
  { label: 'Sangeet',   value: 'sangeet'   },
  { label: 'Reception', value: 'reception' },
  { label: 'Wedding',   value: 'wedding'   },
];

const SOURCE_FILTERS: { label: string; value: SourceFilter }[] = [
  { label: 'All',    value: 'all'           },
  { label: 'Mine',   value: 'bride'         },
  { label: 'Circle', value: 'circle_member' },
];

function FullBleedOverlay({
  save, activity, onClose,
}: {
  save: MuseSave;
  activity: MuseActivity[];
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#0C0A09', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        {save.image_url ? (
          <img src={save.image_url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: '#1a1714', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 14, color: 'rgba(248,247,245,0.2)' }}>No image</span>
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none' }} />

        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top,0px) + 16px)', left: 16, zIndex: 55, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '0.5px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.9)' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {save.vendor_name && (
          <div style={{ position: 'absolute', bottom: 80, left: 20, right: 20 }}>
            <p style={{ fontFamily: FF.display, fontSize: 22, fontWeight: 300, color: '#F8F7F5', margin: 0 }}>{save.vendor_name}</p>
          </div>
        )}
      </div>

      {activity.length > 0 && (
        <div
          onClick={() => setExpanded(e => !e)}
          style={{ background: 'rgba(12,10,9,0.82)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '0.5px solid rgba(255,255,255,0.08)', padding: expanded ? '20px 20px calc(env(safe-area-inset-bottom,0px) + 20px)' : '14px 20px calc(env(safe-area-inset-bottom,0px) + 14px)', cursor: 'pointer', transition: 'padding 240ms ease' }}
        >
          {!expanded ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#C9A84C' }} />
              <span style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(248,247,245,0.6)' }}>
                {activity.length} circle interaction{activity.length !== 1 ? 's' : ''} \u00b7 tap to see
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(248,247,245,0.4)', marginBottom: 4 }}>Circle Activity</span>
              {activity.map(a => (
                <div key={a.id}>
                  <span style={{ fontFamily: FF.body, fontSize: 12, fontWeight: 400, color: 'rgba(248,247,245,0.8)' }}>{a.member_name}</span>
                  <span style={{ fontFamily: FF.body, fontSize: 12, fontWeight: 300, color: 'rgba(248,247,245,0.5)' }}>
                    {a.activity_type === 'comment' && a.content ? `: "${a.content}"` : ` ${a.activity_type.replace(/_/g, ' ')}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activity.length === 0 && (
        <div style={{ height: 'calc(env(safe-area-inset-bottom,0px) + 20px)' }} />
      )}
    </div>
  );
}

export default function CanvasMuse() {
  const { look } = useFrostMode();
  const tokens = MUSE_LOOKS[look];

  const [ceremonyFilter, setCeremonyFilter] = useState<MuseCeremony>('all');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [saves, setSaves] = useState<MuseSave[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [selectedSave, setSelectedSave] = useState<MuseSave | null>(null);
  const [saveActivity, setSaveActivity] = useState<MuseActivity[]>([]);

  useEffect(() => {
    setLoading(true);
    fetchMuseSaves({ saved_by: sourceFilter })
      .then(({ saves: s, total: t }) => { setSaves(s); setTotal(t); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sourceFilter]);

  const filtered = ceremonyFilter === 'all'
    ? saves
    : saves.filter(s => s.aesthetic_tags.includes(ceremonyFilter));

  const handleDelete = async (id: string) => {
    const ok = await deleteMuseSave(id);
    if (ok) setSaves(prev => prev.filter(s => s.id !== id));
    setConfirmId(null);
  };

  const openSave = async (save: MuseSave) => {
    setSelectedSave(save);
    setSaveActivity([]);
    if (save.circle_comment_count > 0) {
      const res = await fetchSaveActivity(save.id);
      if (res) setSaveActivity(res.activity);
    }
  };

  return (
    <>
      {selectedSave && (
        <FullBleedOverlay
          save={selectedSave}
          activity={saveActivity}
          onClose={() => { setSelectedSave(null); setSaveActivity([]); }}
        />
      )}

      <CanvasShell eyebrow="Muse">
        <div style={{ padding: `${SP.xl}px ${SP.xxl}px ${SP.m}px` }}>
          <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 28, color: tokens.ink, marginBottom: 4 }}>Muse</div>
          <div style={{ fontFamily: FF.body, fontSize: 13, color: tokens.soft }}>{loading ? 'Loading\u2026' : `${total} saved`}</div>
        </div>

        <div style={{ display: 'flex', gap: 6, padding: `0 ${SP.xxl}px ${SP.s}px`, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {SOURCE_FILTERS.map(f => {
            const active = sourceFilter === f.value;
            return (
              <button key={f.value} onClick={() => setSourceFilter(f.value)} style={{ fontFamily: FF.label, fontSize: 9, fontWeight: 300, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '7px 14px', borderRadius: FR.pill, border: 'none', background: active ? tokens.brass : 'transparent', color: active ? '#1B1612' : tokens.soft, outline: active ? 'none' : `0.5px solid ${tokens.hairline}`, cursor: 'pointer', whiteSpace: 'nowrap' }}>{f.label}</button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 6, padding: `0 ${SP.xxl}px ${SP.m}px`, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {CEREMONY_FILTERS.map(f => {
            const active = ceremonyFilter === f.value;
            return (
              <button key={f.value} onClick={() => setCeremonyFilter(f.value)} style={{ fontFamily: FF.label, fontSize: 9, fontWeight: 300, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '7px 14px', borderRadius: FR.pill, border: 'none', background: active ? tokens.brass : 'transparent', color: active ? '#1B1612' : tokens.soft, outline: active ? 'none' : `0.5px solid ${tokens.hairline}`, cursor: 'pointer', whiteSpace: 'nowrap' }}>{f.label}</button>
            );
          })}
        </div>

        <div style={{ padding: `0 ${SP.xxl}px`, columns: '2 auto', columnGap: 8 }}>
          {!loading && filtered.length === 0 && (
            <div style={{ columnSpan: 'all', textAlign: 'center', padding: '48px 0', fontFamily: FF.display, fontStyle: 'italic', fontSize: 18, color: tokens.soft }}>No saves here yet.</div>
          )}
          {filtered.map(save => (
            <div
              key={save.id}
              style={{ position: 'relative', marginBottom: 8, borderRadius: FR.md, overflow: 'hidden', breakInside: 'avoid', cursor: 'pointer', background: tokens.cardFill }}
              onClick={() => { if (confirmId === save.id) return; openSave(save); }}
            >
              {save.image_url ? (
                <img src={save.image_url} alt={save.vendor_name || 'muse'} style={{ width: '100%', display: 'block', objectFit: 'cover' }} loading="lazy" />
              ) : (
                <div style={{ width: '100%', aspectRatio: '3/4', background: tokens.cardFill, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 11, color: tokens.soft }}>{save.vendor_name || '\u2014'}</span>
                </div>
              )}

              {save.vendor_name && (
                <div style={{ position: 'absolute', bottom: 6, left: 6, fontFamily: FF.label, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'rgba(12,10,9,0.55)', color: 'rgba(245,240,232,0.9)', padding: '3px 7px', borderRadius: FR.pill, backdropFilter: 'blur(4px)' }}>{save.vendor_name}</div>
              )}

              {save.circle_comment_count > 0 && (
                <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(201,168,76,0.85)', borderRadius: FR.pill, padding: '2px 6px', fontFamily: FF.label, fontSize: 7, color: '#1B1612', letterSpacing: '0.1em' }}>{save.circle_comment_count}</div>
              )}

              {save.saved_by_role === 'circle_member' && (
                <div style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(12,10,9,0.55)', backdropFilter: 'blur(4px)', borderRadius: FR.pill, padding: '3px 7px', fontFamily: FF.label, fontSize: 7, color: 'rgba(248,247,245,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Circle</div>
              )}

              {confirmId === save.id && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(12,10,9,0.72)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12 }} onClick={e => e.stopPropagation()}>
                  <Trash2 size={18} strokeWidth={1.5} color="rgba(245,240,232,0.8)" />
                  <div style={{ fontFamily: FF.body, fontSize: 12, color: 'rgba(245,240,232,0.8)', textAlign: 'center' }}>Remove?</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => handleDelete(save.id)} style={{ fontFamily: FF.label, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'rgba(184,69,62,0.8)', color: '#FFF', border: 'none', padding: '5px 10px', borderRadius: FR.pill, cursor: 'pointer' }}>Remove</button>
                    <button onClick={() => setConfirmId(null)} style={{ fontFamily: FF.label, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.12)', color: 'rgba(245,240,232,0.8)', border: 'none', padding: '5px 10px', borderRadius: FR.pill, cursor: 'pointer' }}>Keep</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CanvasShell>
    </>
  );
}
"""

# ── Write files ───────────────────────────────────────────────────────────────
new_files = {
    'lib/types/discover.ts': TYPES_DISCOVER,
    'lib/frost-api/discover.ts': FROST_DISCOVER,
    'lib/frost-api/muse.ts': FROST_MUSE,
    'app/(frost)/frost/canvas/discover/page.tsx': DISCOVER_PAGE,
    'app/(frost)/frost/canvas/muse/page.tsx': MUSE_PAGE,
}

for rel, content in new_files.items():
    full = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w') as f:
        f.write(content)
    print(f'Written: {rel}')

# ── Patch _base.ts — add getCoupleSession + apiDelete ────────────────────────
BASE_PATH = os.path.join(ROOT, 'lib/frost-api/_base.ts')
with open(BASE_PATH, 'r') as f:
    base = f.read()

# getCoupleSession
INSERT_AFTER = "export function getVendorId(): string | null {\n  const s = getVendorSession();\n  return s?.vendorId || s?.id || null;\n}"
COUPLE_SESSION = """

export interface CoupleSession {
  id?: string;       // couple_id
  userId?: string;
  name?: string;
  pin_set?: boolean;
}

export function getCoupleSession(): CoupleSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw =
      localStorage.getItem('couple_session') ||
      localStorage.getItem('couple_web_session');
    return raw ? (JSON.parse(raw) as CoupleSession) : null;
  } catch {
    return null;
  }
}"""

if 'getCoupleSession' in base:
    print('_base.ts: getCoupleSession already present, skipping.')
elif INSERT_AFTER not in base:
    print('ERROR: getCoupleSession insert point not found in _base.ts')
    sys.exit(1)
else:
    base = base.replace(INSERT_AFTER, INSERT_AFTER + COUPLE_SESSION, 1)
    print('_base.ts: getCoupleSession added ✓')

# apiDelete
BEFORE_MOCK = "// \u2500\u2500\u2500 Tiny mock delay helper"
API_DELETE = """export async function apiDelete<T>(path: string): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });
  return handleResponse<T>(res);
}

"""

if 'apiDelete' in base:
    print('_base.ts: apiDelete already present, skipping.')
elif BEFORE_MOCK not in base:
    print('ERROR: apiDelete insert point not found in _base.ts')
    sys.exit(1)
else:
    base = base.replace(BEFORE_MOCK, API_DELETE + BEFORE_MOCK, 1)
    print('_base.ts: apiDelete added ✓')

with open(BASE_PATH, 'w') as f:
    f.write(base)
print('_base.ts: saved ✓')

print('\nAll done. Now run:')
print('  npx tsc --noEmit')
print('  # If clean:')
print('  npm version 0.11.1-alpha --no-git-tag-version')
print('  git add lib/types/discover.ts lib/frost-api/discover.ts lib/frost-api/muse.ts \\')
print('          lib/frost-api/_base.ts \\')
print('          "app/(frost)/frost/canvas/discover/page.tsx" \\')
print('          "app/(frost)/frost/canvas/muse/page.tsx" \\')
print('          package.json')
print('  git commit -m "feat(bride): Block 2 — wire discover + muse to real backend"')
print('  git push')
