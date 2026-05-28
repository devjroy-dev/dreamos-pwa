'use client';
export const dynamic = 'force-dynamic';

// app/demo/vendor/[handle]/page.tsx
// Demo vendor landing. One screen. Non-scrollable.
// Vendor's own photos carousel (2.5s auto-advance).
// Frosted entry strip at bottom — tap to reveal, whole pane is the CTA.
// "We built this for you." · vendor name · "Tap to see inside."

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchDemoVendor } from '@/lib/demo/api';
import type { DemoVendor, DemoPhoto } from '@/lib/demo/api';

const EASE = 'cubic-bezier(0.22,1,0.36,1)';

const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script:  'var(--font-cormorant), Georgia, serif',
  body:    'var(--font-dm-sans), system-ui, sans-serif',
  label:   'var(--font-jost), system-ui, sans-serif',
};

export default function DemoLandingPage() {
  const params  = useParams();
  const handle  = typeof params.handle === 'string' ? params.handle : '';
  const router  = useRouter();

  const [vendor,  setVendor]  = useState<DemoVendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [cur,     setCur]     = useState(0);
  const [entered, setEntered] = useState(false); // strip expanded
  const [reveal,  setReveal]  = useState(false); // fade-in trigger after mount

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const photosRef   = useRef<string[]>([]);

  // Fetch vendor
  useEffect(() => {
    if (!handle) return;
    fetchDemoVendor(handle)
      .then(res => {
        setVendor(res.vendor);
        const urls = (res.vendor.photos ?? []).map((p: DemoPhoto) => p.url).filter(Boolean) as string[];
        photosRef.current = urls;
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [handle]);

  // Carousel — 2.5s, starts as soon as photos load
  const startCarousel = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setCur(c => (c + 1) % Math.max(photosRef.current.length, 1));
    }, 2500);
  }, []);

  useEffect(() => {
    if (!loading && vendor) {
      startCarousel();
      // Small delay so the image is painted before we fade in the UI
      const t = setTimeout(() => setReveal(true), 80);
      return () => clearTimeout(t);
    }
  }, [loading, vendor, startCarousel]);

  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const photos = (vendor?.photos ?? []).map((p: DemoPhoto) => p.url).filter(Boolean) as string[];

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ position: 'fixed', inset: 0, background: '#0C0A09', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: F.script, fontStyle: 'italic', fontSize: 18, color: 'rgba(245,235,212,0.35)', letterSpacing: '0.02em' }}>
        One moment…
      </div>
    </div>
  );

  // ── Not found ──────────────────────────────────────────────────────────────
  if (!vendor) return (
    <div style={{ position: 'fixed', inset: 0, background: '#0C0A09', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontFamily: F.display, fontSize: 28, color: 'rgba(245,235,212,0.9)', letterSpacing: '0.02em' }}>Profile not found.</div>
      <div style={{ fontFamily: F.script, fontStyle: 'italic', fontSize: 16, color: 'rgba(245,235,212,0.4)' }}>This demo link may have expired.</div>
    </div>
  );

  const vendorDisplayName = vendor.display_name || handle;
  const hasPhotos = photos.length > 0;

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#0C0A09' }}>
      <style>{`
        @keyframes breathe { 0%,100%{opacity:0.25} 50%{opacity:0.55} }
        @keyframes hairlineIn { from{transform:scaleX(0);opacity:0} to{transform:scaleX(1);opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>

      {/* ── Carousel slides ─────────────────────────────────────────────────── */}
      {hasPhotos ? photos.map((url, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          opacity: reveal ? (i === cur ? 1 : 0) : 0,
          transition: `opacity ${i === cur ? '1.8s' : '1.2s'} ${EASE}`,
          willChange: 'opacity',
          zIndex: 1,
          pointerEvents: 'none',
        }} />
      )) : (
        // Fallback dark texture if no photos
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 40%, rgba(201,168,76,0.08) 0%, transparent 70%)', zIndex: 1, pointerEvents: 'none' }} />
      )}

      {/* ── Radial vignette ─────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 45%, transparent 15%, rgba(0,0,0,0.52) 100%)',
      }} />

      {/* ── Bottom gradient — ensures frosted strip reads well ───────────────── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '52%', zIndex: 3, pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(8,6,5,0.88) 0%, rgba(8,6,5,0.42) 55%, transparent 100%)',
      }} />

      {/* ── TDW wordmark — top left ──────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        top: 'calc(env(safe-area-inset-top, 0px) + 22px)',
        left: 22, zIndex: 10,
        opacity: reveal ? 1 : 0,
        transition: `opacity 1.2s ${EASE} 0.3s`,
      }}>
        <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, color: 'rgba(248,247,245,0.72)', letterSpacing: '0.02em', lineHeight: 1 }}>
          The Dream Wedding
        </div>
        <div style={{ fontFamily: F.label, fontWeight: 200, fontSize: 6, letterSpacing: '0.38em', textTransform: 'uppercase', color: '#C9A84C', marginTop: 5 }}>
          India's First Wedding OS
        </div>
      </div>

      {/* ── Slide dots — top centre, visible when not expanded ──────────────── */}
      {hasPhotos && photos.length > 1 && !entered && (
        <div style={{
          position: 'absolute',
          top: 'calc(env(safe-area-inset-top, 0px) + 28px)',
          left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 5, zIndex: 10,
          opacity: reveal ? 1 : 0,
          transition: `opacity 1s ${EASE} 0.6s`,
        }}>
          {photos.map((_, i) => (
            <div key={i} style={{
              width: i === cur ? 18 : 4, height: 4, borderRadius: 2,
              background: i === cur ? '#C9A84C' : 'rgba(255,255,255,0.22)',
              transition: `width 400ms ${EASE}, background 400ms ${EASE}`,
            }} />
          ))}
        </div>
      )}

      {/* ── Entry strip — bottom frosted pane ───────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
        opacity: reveal ? 1 : 0,
        transition: `opacity 1.4s ${EASE} 0.5s`,
      }}>
        <div
          onClick={() => !entered && setEntered(true)}
          style={{
            background: entered
              ? 'rgba(8,6,5,0.42)'
              : 'rgba(8,6,5,0.32)',
            backdropFilter: 'blur(28px) saturate(1.6)',
            WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
            borderTop: '0.5px solid rgba(255,255,255,0.10)',
            padding: entered
              ? '22px 26px calc(env(safe-area-inset-bottom, 16px) + 32px)'
              : '18px 26px calc(env(safe-area-inset-bottom, 12px) + 20px)',
            transition: `padding 500ms ${EASE}, background 400ms ${EASE}`,
            cursor: entered ? 'default' : 'pointer',
          }}
        >

          {/* ── Collapsed state ──────────────────────────────────────────────── */}
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          }}>
            <div>
              {/* "We built this for you." */}
              <div style={{
                fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
                fontSize: 13, color: 'rgba(248,247,245,0.45)',
                letterSpacing: '0.02em', marginBottom: 6, lineHeight: 1,
              }}>
                We built this for you.
              </div>

              {/* Vendor name — Italiana, large */}
              <div style={{
                fontFamily: F.display, fontWeight: 400,
                fontSize: 34, color: 'rgba(248,247,245,0.96)',
                lineHeight: 1, letterSpacing: '0.01em',
              }}>
                {vendorDisplayName}
              </div>

              {/* Category · City */}
              {(vendor.category || vendor.city) && (
                <div style={{
                  fontFamily: F.label, fontWeight: 200, fontSize: 8,
                  letterSpacing: '0.38em', textTransform: 'uppercase',
                  color: 'rgba(201,168,76,0.75)', marginTop: 7,
                }}>
                  {[vendor.category, vendor.city].filter(Boolean).join(' · ')}
                </div>
              )}
            </div>

            {/* "tap" pulse — only when collapsed */}
            {!entered && (
              <div style={{
                fontFamily: F.label, fontWeight: 200, fontSize: 8,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(248,247,245,0.28)',
                animation: 'breathe 3s ease-in-out infinite',
                paddingBottom: 4,
              }}>
                tap
              </div>
            )}
          </div>

          {/* ── Expanded state — slides open ─────────────────────────────────── */}
          <div style={{
            maxHeight: entered ? '260px' : '0px',
            overflow: 'hidden',
            transition: `max-height 520ms ${EASE}`,
          }}>
            <div style={{ paddingTop: 22 }}>

              {/* Brass hairline */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22,
                transformOrigin: 'left center',
                animation: entered ? `hairlineIn 600ms ${EASE} 180ms both` : 'none',
              }}>
                <div style={{ flex: 1, height: '0.5px', background: 'linear-gradient(to right, rgba(201,168,76,0.6), rgba(201,168,76,0.15))' }} />
                <span style={{ fontFamily: F.display, fontSize: 10, color: '#C9A84C', letterSpacing: '0.3em', lineHeight: 1 }}>◆</span>
                <div style={{ flex: 1, height: '0.5px', background: 'linear-gradient(to left, rgba(201,168,76,0.6), rgba(201,168,76,0.15))' }} />
              </div>

              {/* "Tap to see inside." */}
              <div style={{
                fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
                fontSize: 18, color: 'rgba(248,247,245,0.55)',
                textAlign: 'center', letterSpacing: '0.01em', marginBottom: 26,
                animation: entered ? `fadeUp 500ms ${EASE} 220ms both` : 'none',
              }}>
                Tap to see inside.
              </div>

              {/* The single CTA — the whole pane is the gesture, but this makes it obvious */}
              <button
                onClick={() => router.push(`/demo/vendor/${handle}/studio`)}
                style={{
                  width: '100%', padding: '15px 0',
                  background: 'linear-gradient(180deg, #D4B86A 0%, #B59548 100%)',
                  border: '0.5px solid #E0BC6E',
                  borderRadius: 2, cursor: 'pointer',
                  fontFamily: F.label, fontWeight: 400, fontSize: 10,
                  letterSpacing: '0.52em', textTransform: 'uppercase',
                  color: '#1A120E',
                  animation: entered ? `fadeUp 500ms ${EASE} 300ms both` : 'none',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                Enter Your Studio
              </button>

              {/* Secondary — Discover */}
              <button
                onClick={() => router.push(`/demo/vendor/${handle}/discover`)}
                style={{
                  width: '100%', padding: '13px 0', marginTop: 10,
                  background: 'transparent',
                  border: '0.5px solid rgba(201,168,76,0.28)',
                  borderRadius: 2, cursor: 'pointer',
                  fontFamily: F.label, fontWeight: 300, fontSize: 9,
                  letterSpacing: '0.42em', textTransform: 'uppercase',
                  color: 'rgba(201,168,76,0.65)',
                  animation: entered ? `fadeUp 500ms ${EASE} 380ms both` : 'none',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                Explore Discover
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
