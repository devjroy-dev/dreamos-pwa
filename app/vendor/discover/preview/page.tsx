'use client';

// app/vendor/discover/preview/page.tsx
//
// TDW_07 P4b-FINAL · F5 — "SEE YOUR PROFILE AS COUPLES DO".
//
// FOUNDER'S CONTRACT, 2026-07-31, which defines this screen and supersedes ruling (iii):
//   "the entire reason to have see what couples see is to give the vendors the preview of a
//    full bleed photo carousel, made up of their images… the right mechanics is full bleed
//    image — tapping reveals the card — tapping outside card area removes it."
//
// So: FULL-BLEED CAROUSEL BY DEFAULT. The card is not the screen; the PHOTOS are the screen,
// and the card is what a tap reveals over them. That is the deck's own model — a couple
// meets a photograph first and the details second — and the preview now shares it rather
// than approximating it.
//
// ── WHAT P4b GOT WRONG HERE, PLAINLY ─────────────────────────────────────────────────
// P4b shipped this as a STILL: `photos[0]` as a CSS background, card permanently open, no
// paging. Every parity cell was green because the cells asked "do both mounts run the same
// component over the same shaper?" — and they did. The carousel lived one layer ABOVE the
// component, in the canvas's card layer, and this mount re-created that layer as a static
// image. A vendor with nine approved photos saw one, forever, and the footer sentence told
// him five were on his card.
//
// The cure is not a pager built here. A second pager is the disease F1b exists to prevent.
// The deck's carousel was EXTRACTED to lib/frost/photoPager.ts and both mounts now call it,
// so the vendor's swipe runs the couple's mechanics on the couple's constants.
//
// ── DISMISSAL, MIRRORED FROM THE LIVE OVERLAY (charter: derive first, mirror what's faithful)
// Derived at the charter tip, the deck offers three ways to put the card away:
//   1. tap the photo            → toggles the card  (canvas handleSingleTap)
//   2. swipe down over the card → dismisses         (canvas onTouchEnd, OVERLAY_DISMISS)
//   3. drag the sheet down      → dismisses         (GlassOverlay, OVERLAY_DISMISS)
//
// (1) and (2) are MECHANICS and both mirror here — the founder's "tapping outside card area
// removes it" IS the deck's tap-toggle, said precisely. (3) is the GlassOverlay's own
// drag-handle chrome, and the charter is explicit that the canvas's chrome stays untouched
// while the preview's chrome is its own; re-implementing a drag handle here would be a
// second copy of a gesture for no gain. Named, not omitted.
//
// `data-pager-inert` is now PREREQUISITE rather than protective: the carousel needs its own
// horizontal swipe, and without the flag the shell's three-panel pager eats every one.

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { fetchDiscoverPreview } from '@/lib/vendor/api/vendor';
import VendorProfileView from '@/components/shared/VendorProfileView';
import ImageDots from '@/components/shared/ImageDots';
import { usePhotoPager, classifyGesture, OVERLAY_DISMISS, haptic } from '@/lib/frost/photoPager';
import { imgUrl, lqipUrl } from '@/lib/frost-api/img';
import type { DiscoverPreviewResponse } from '@/lib/vendor/types/vendor';

// Frost's own sheet token, carried verbatim from the discover canvas so the preview's glass
// is the couple's glass and not a look-alike.
const GLASS_SHEET = {
  background:           'rgba(12,10,9,0.55)',
  backdropFilter:       'blur(28px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(28px) saturate(1.8)',
  borderTop:            '0.5px solid rgba(255,255,255,0.12)',
} as const;

const INK = '#0C0A09';

export default function DiscoverPreviewPage() {
  const router = useRouter();
  const { session, loading: sessionLoading } = useVendorSession();
  const [data, setData]       = useState<DiscoverPreviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  // THE CARD IS HIDDEN BY DEFAULT — the founder's contract. The screen opens on the
  // photograph, exactly as a couple's does.
  const [cardVisible, setCardVisible] = useState(false);
  const [toast, setToast]             = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const photos = data?.vendor?.photos ?? [];
  const { imageIdx, dissolveKey, nextImage, prevImage } = usePhotoPager(photos.length);

  const touchStart = useRef<{ x: number; y: number; t: number } | null>(null);

  useEffect(() => {
    if (sessionLoading || !session) return;
    let cancelled = false;
    (async () => {
      const res = await fetchDiscoverPreview();
      if (cancelled) return;
      if ('ok' in res && res.ok) setData(res as DiscoverPreviewResponse);
      else setError('Could not load your preview.');
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [session, sessionLoading]);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  function showToast(line: string) {
    setToast(line);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  // ── THE GESTURE SURFACE — the deck's classification, this mount's verbs. ─────────────
  // `classifyGesture` is the shared function the canvas uses, so a tap here is a tap by the
  // couple's definition (same TAP_MAX_MOVE, same TAP_MAX_TIME) and a swipe clears the same
  // thresholds. What differs is the VERB TABLE, and it differs because the vendor has no
  // next vendor to page to and no Muse to save himself into — the enumeration is in
  // photoPager.ts's header (CE-116 clause 2).
  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current) return;
    const start = touchStart.current;
    touchStart.current = null;
    const end = e.changedTouches[0];
    const dx  = end.clientX - start.x;
    const dy  = end.clientY - start.y;
    const g   = classifyGesture(dx, dy, Date.now() - start.t);

    if (g.kind === 'tap') {
      // The founder's contract, both halves. A tap on the photograph reveals the card; a tap
      // outside the card puts it away. This handler is bound to the PHOTO layer only — the
      // card stops its own touches propagating — so "tap outside the card area" is exactly
      // the set of touches that reach here. The toggle is the deck's own handleSingleTap.
      setCardVisible((v) => !v); haptic(4);
      return;
    }
    if (g.kind === 'none') return;

    // Swipe down over a visible card dismisses it — the deck's mechanic, the same constant.
    if (g.axis === 'y') {
      if (cardVisible && dy > OVERLAY_DISMISS) { setCardVisible(false); haptic(4); }
      return;
    }
    // Horizontal: the carousel. The shared pager owns the bounds and the haptic.
    if (g.dir === -1) nextImage(); else prevImage();
  }

  const vendor  = data?.vendor ?? null;
  const current = photos[imageIdx] ?? null;

  return (
    <div
      // ── §2(b) — THE SHELL'S PAGER STAYS OUT OF THIS SCREEN. ──────────────────────────
      // app/vendor/layout.tsx runs a three-panel horizontal pager (STUDIO · AI · DISCOVER).
      // Without this flag it ate every horizontal swipe here and slid the vendor to AI chat
      // — founder-found on device. `data-pager-inert` is TDW_04 A2.3's own opt-out, minted
      // from an earlier founder phone smoke; the mechanism existed and P4b did not use it,
      // because it minted this route into a shell it never read. Filed, not papered.
      //
      // Now PREREQUISITE, not merely protective: the carousel's horizontal swipe is the
      // point of this screen, and every one of those swipes would otherwise be eaten.
      data-pager-inert="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 60, background: INK,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}
    >
      {/* SELF-CAUGHT: `dissolveIn` is declared LOCALLY in each Frost surface's own <style>
          block, never globally — derived by grep across app/globals.css and styles/ before
          this was added, not assumed. The first draft of this screen referenced the
          animation without declaring it, which fails SILENTLY: the element renders, the
          animation simply never runs, and no gate catches it because it is valid CSS naming
          a keyframe that does not exist. Declared here, byte-identical to the canvas's. */}
      <style>{`@keyframes dissolveIn { from{opacity:0} to{opacity:1} }`}</style>
      {/* ── THE PHOTO LAYER — full bleed, and the whole screen's gesture surface. ──────
          Keyed on `dissolveKey` so advancing cross-fades with the deck's own animation
          rather than snapping. This is the layer the tap-toggle listens on, which is what
          makes "tap outside the card area removes it" true by construction: the card sits
          above and stops its own touches, so anything reaching here is outside it. */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ position: 'absolute', inset: 0, touchAction: 'pan-y' }}
      >
        {current && (
          <div key={dissolveKey} style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${imgUrl(current, 'full')}), url(${lqipUrl(current)})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            animation: 'dissolveIn 260ms cubic-bezier(0.22,1,0.36,1)',
          }} />
        )}
        {/* The deck's scrim. `pointerEvents:'none'` so it cannot intercept the taps the
            layer beneath it exists to receive — the photo layer owns every touch here. */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 100%)',
        }} />
      </div>

      {/* The couple's own position indicator, rendered from the file the deck renders. */}
      {!cardVisible && <ImageDots total={photos.length} current={imageIdx} />}

      {/* ── The ribbon. Copy ② — founder-vetoed, byte-exact. ─────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 2,
        paddingTop: 'calc(env(safe-area-inset-top,0px) + 14px)',
        display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px',
        pointerEvents: 'none',   // the row is chrome; only its button takes touches
      }}>
        <button
          onClick={() => router.back()}
          aria-label="Close preview"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32, borderRadius: 16, border: '0.5px solid rgba(255,255,255,0.18)',
            background: 'rgba(12,10,9,0.32)', backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)', color: 'rgba(248,247,245,0.8)',
            cursor: 'pointer', touchAction: 'manipulation', pointerEvents: 'auto',
          }}
        >
          <ChevronLeft size={16} strokeWidth={1.5} />
        </button>
        <span style={{
          fontFamily: "'Jost',sans-serif", fontSize: 9, fontWeight: 300,
          letterSpacing: '0.28em', textTransform: 'uppercase',
          color: 'rgba(248,247,245,0.72)',
          border: '0.5px solid rgba(255,255,255,0.18)', borderRadius: 12,
          padding: '4px 10px', background: 'rgba(12,10,9,0.32)',
          backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
        }}>
          PREVIEW
        </span>
      </div>

      <div style={{ flex: 1, pointerEvents: 'none' }} />

      {loading && (
        <p style={{ position: 'relative', zIndex: 2, fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 300, color: 'rgba(248,247,245,0.5)', margin: 0, padding: '0 24px 24px' }}>
          Loading your profile…
        </p>
      )}
      {!loading && error && (
        <p style={{ position: 'relative', zIndex: 2, fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 300, color: 'rgba(248,247,245,0.6)', margin: 0, padding: '0 24px 24px' }}>
          {error}
        </p>
      )}

      {/* ── THE CARD — revealed by a tap, dismissed by a tap outside. ─────────────────
          The stopPropagation handlers are the mechanism behind the founder's sentence: a
          touch that lands ON the card must not also count as a "tap outside" reaching the
          photo layer. The card is the inside; everything else is the outside. */}
      {!loading && !error && data && vendor && cardVisible && (
        <div
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          style={{
            position: 'relative', zIndex: 2,
            ...GLASS_SHEET,
            borderRadius: '20px 20px 0 0',
            paddingTop: 20,
            paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 24px)',
            animation: 'dissolveIn 220ms cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {/* Copy ⑤ — founder-vetoed, byte-exact. Renders on the FACT: `discover_paused` is
              the production column, read server-side. */}
          {data.discover_paused && (
            <p style={{
              fontFamily: "'Jost',sans-serif", fontSize: 10, fontWeight: 300,
              letterSpacing: '0.14em', color: 'rgba(248,247,245,0.66)',
              margin: '0 0 14px', padding: '0 24px',
            }}>
              Paused — hidden from Discover right now.
            </p>
          )}

          <VendorProfileView
            vendor={vendor}
            mode="preview"
            isBlind={false}
            enquireLink={null}
            onPreviewToast={showToast}
          />

          {/* Copy ③ — founder-vetoed, byte-exact. */}
          {!data.is_live && !data.discover_paused && (
            <p style={{
              fontFamily: "'Cormorant Garamond',serif", fontSize: 13, fontWeight: 300,
              fontStyle: 'italic', color: 'rgba(248,247,245,0.6)',
              margin: '18px 0 0', padding: '0 24px', lineHeight: 1.5,
            }}>
              This is your profile as couples will see it — approval unlocks it on Discover.
            </p>
          )}

          {/* THE PHOTO-COUNT FOOTER IS GONE, AND THE CAROUSEL IS WHY (P4b-FINAL §3).
              The line read "5 of your 9 approved photos appear on the card." — accurate,
              fluent, and misleading on a screen showing one photo, which is the costume
              class this block exists to catch. It was COMPENSATING for a missing carousel.
              The carousel now exists and pages every approved photo, so the sentence has
              nothing left to explain and dies rather than being re-worded. */}
        </div>
      )}

      {/* ── The instructive toast (§4, shape (ii)). Chrome, so it lives at the mount. ─── */}
      {toast && (
        <div style={{
          position: 'fixed', left: '50%', bottom: 'calc(env(safe-area-inset-bottom,0px) + 96px)',
          transform: 'translateX(-50%)', zIndex: 70, pointerEvents: 'none',
          padding: '9px 16px', borderRadius: 16, maxWidth: '86%',
          background: 'rgba(12,10,9,0.82)', backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)', border: '0.5px solid rgba(255,255,255,0.14)',
          fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 300,
          color: 'rgba(248,247,245,0.88)', textAlign: 'center',
          animation: 'dissolveIn 200ms cubic-bezier(0.22,1,0.36,1)',
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}
