'use client';
// app/(frost)/frost/canvas/explore/page.tsx
//
// ── TDW_09 · PACKAGE 4 · THE DISCOVER DOOR ────────────────────────────────────
// F-B ARM (b), chair-ruled, arm (a) REFUSED.
//
// WHY THIS FILE IS NOT app/(frost)/frost/canvas/discover/page.tsx:
//   That path is F-07.43 「 F-D 」's grave. The founder ruled the deck dead in two
//   letters, and `scripts/tdw07_p6_fold.proof.mjs:95-96` asserts the file is a
//   redirect AND that its stripped body is under 900 bytes. Mounting content
//   there would resurrect a corpse the founder buried and RED a sealed bench.
//   So the ROOM gets its door and the CORPSE stays buried: this is a new route
//   over the shared homes the fold preserved, and the old stub keeps honouring
//   bookmarks exactly as its own comment promises.
//
// WHAT IT MOUNTS — the organs the fold sent to shared homes, never a copy:
//   · components/shared/VendorProfileView   (the profile body, F-07.68's cure)
//   · components/shared/ImageDots           (the position indicator, one home)
//   · lib/frost-api/discover                (fetchDiscoverFeed / fetchFeatured)
//   · lib/frost-api/img                     (LQIP + card variants)
//
// THE DARK SURFACE IS DERIVED, NOT CHOSEN: `V2_WINE_NIGHT.discoverBg` and
// `V2_SKY_IVORY.discoverBg` are BOTH '#080608' — the marketplace is
// theme-invariant dark by the token file's own authorship, because photographs
// carry the colour here. VendorProfileView's ink was authored against exactly
// that scrim. The bar above still themes with the app.

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useFrostMode } from '../../../layout';
import { getV2Tokens, FF, SP, FR, EASE } from '../../../../../lib/frost/tokens';
import { BRIDE_BAR_HEIGHT } from '../../../../../components/frost/BrideBar';
import VendorProfileView from '../../../../../components/shared/VendorProfileView';
import ImageDots from '../../../../../components/shared/ImageDots';
import { fetchDiscoverFeed, makeEnquireLink } from '../../../../../lib/frost-api/discover';
import { imgUrl } from '../../../../../lib/frost-api/img';
import type { DiscoverVendor } from '../../../../../lib/types/discover';

const SCRIM = '#080608';

export default function ExploreCanvas() {
  const router = useRouter();
  const { homeMode } = useFrostMode();
  const t = getV2Tokens(homeMode);

  const [vendors, setVendors] = useState<DiscoverVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed,  setFailed]  = useState(false);
  const [open,    setOpen]    = useState<DiscoverVendor | null>(null);
  const [photoIx, setPhotoIx] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetchDiscoverFeed();
        if (!alive) return;
        setVendors(r.vendors || []);
      } catch {
        if (alive) setFailed(true);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // ── the profile sheet ───────────────────────────────────────────────────────
  if (open) {
    const photos = open.photos || [];
    const link   = open.enquire_link
      || (open.routing_handle ? makeEnquireLink(open.routing_handle) : null);
    return (
      <div style={{ minHeight: '100vh', background: SCRIM, paddingBottom: BRIDE_BAR_HEIGHT + 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: `${SP.l}px ${SP.xxl}px ${SP.s}px` }}>
          <button
            type="button"
            onClick={() => { setOpen(null); setPhotoIx(0); }}
            style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none',
                     cursor: 'pointer', padding: 0, WebkitTapHighlightColor: 'transparent',
                     fontFamily: FF.mono, fontSize: 9, letterSpacing: '.18em',
                     textTransform: 'uppercase', color: 'rgba(248,247,245,0.55)' }}
          >
            <ChevronLeft size={14} strokeWidth={1.5} /> Discover
          </button>
        </div>

        {photos.length > 0 && (
          <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 5', overflow: 'hidden' }}>
            <img
              src={imgUrl(photos[Math.min(photoIx, photos.length - 1)])}
              alt=""
              onClick={() => setPhotoIx(i => (i + 1) % photos.length)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
            />
            {/* ImageDots owns its own absolute placement (it is the one home for the
                indicator, F-07.43's preserved organ) — it is mounted, never re-rolled
                and never re-positioned by its caller. */}
            <ImageDots total={photos.length} current={Math.min(photoIx, photos.length - 1)} accent={t.accent} />
          </div>
        )}

        <div style={{ paddingTop: SP.xl }}>
          <VendorProfileView vendor={open} mode="live" enquireLink={link} />
        </div>
      </div>
    );
  }

  // ── the feed ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: SCRIM, paddingBottom: BRIDE_BAR_HEIGHT + 24 }}>
      <div style={{ padding: `${SP.xxl}px ${SP.xxl}px ${SP.l}px` }}>
        <div style={{ fontFamily: FF.fraunces, fontStyle: 'italic', fontWeight: 300, fontSize: 30,
                      color: '#F8F7F5', lineHeight: 1.15 }}>
          Discover
        </div>
      </div>

      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SP.m, padding: `0 ${SP.xxl}px` }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ aspectRatio: '4 / 5', borderRadius: FR.box,
                                  background: 'rgba(248,247,245,0.05)' }} />
          ))}
        </div>
      )}

      {!loading && failed && (
        <div style={{ padding: `${SP.huge}px ${SP.xxl}px`, textAlign: 'center',
                      fontFamily: FF.fraunces, fontStyle: 'italic', fontSize: 17,
                      color: 'rgba(248,247,245,0.62)', lineHeight: 1.5 }}>
          We could not reach the marketplace just now.
        </div>
      )}

      {!loading && !failed && vendors.length === 0 && (
        <div style={{ padding: `${SP.huge}px ${SP.xxl}px`, textAlign: 'center',
                      fontFamily: FF.fraunces, fontStyle: 'italic', fontSize: 17,
                      color: 'rgba(248,247,245,0.62)', lineHeight: 1.5 }}>
          Nothing here yet.
        </div>
      )}

      {!loading && !failed && vendors.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SP.m, padding: `0 ${SP.xxl}px` }}>
          {vendors.map(v => (
            <button
              key={v.id}
              type="button"
              onClick={() => { setOpen(v); setPhotoIx(0); }}
              style={{ padding: 0, border: 'none', background: 'none', cursor: 'pointer',
                       textAlign: 'left', WebkitTapHighlightColor: 'transparent',
                       transition: `opacity 200ms ${EASE}` }}
            >
              <div style={{ aspectRatio: '4 / 5', borderRadius: FR.box, overflow: 'hidden',
                            background: 'rgba(248,247,245,0.05)' }}>
                {v.photos && v.photos[0] && (
                  <img src={imgUrl(v.photos[0])} alt=""
                       style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                )}
              </div>
              <div style={{ fontFamily: FF.fraunces, fontSize: 15, color: '#F8F7F5',
                            marginTop: 7, lineHeight: 1.25 }}>
                {v.name}
              </div>
              <div style={{ fontFamily: FF.mono, fontSize: 8.5, letterSpacing: '.16em',
                            textTransform: 'uppercase', color: 'rgba(248,247,245,0.5)', marginTop: 3 }}>
                {v.category}{v.city ? ` · ${v.city}` : ''}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* the bar's own seat is reserved by paddingBottom above; t is read so the
          door participates in the theme even though the scrim is invariant */}
      <div style={{ height: 1, background: t.line, opacity: 0 }} />
    </div>
  );
}
