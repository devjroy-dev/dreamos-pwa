'use client';

// app/vendor/discover/preview/page.tsx
//
// TDW_07 P4b · F5 — "SEE YOUR PROFILE AS COUPLES DO".
//
// ROUTE-BASED AND FULL-SCREEN, ruled. Not a modal, not a sheet over the Studio. Two reasons,
// both mechanical: a route gets the phone's own back gesture as its dismiss (F5: "dismiss =
// back"), and a full-screen mount is the only way the vendor sees the card at the size a
// couple sees it. A modal inside the vendor's cream chrome would show him a picture of his
// card rather than his card.
//
// THE RENDERER IS THE COUPLE'S. This page mounts components/shared/VendorProfileView.tsx —
// the identical component the Frost swipe deck mounts — over data shaped by the identical
// backend function (src/lib/discover/shapeVendor.js). This page assembles NOTHING about the
// card. Everything below the ribbon is Frost's tokens, Frost's component, Frost's shape.
// Spec P4.2: "Parity by construction — any drift is a failed session."
//
// REACHABLE PRE-APPROVAL, by design and by route. There is no eligibility guard here and
// none on the server route. F5: the pre-approval preview is "the strongest self-serve
// motivation to hit the 6-photo floor" — a vendor who cannot see what he is working toward
// has no reason to finish.
//
// WHAT THE PREVIEW REFUSES TO PRETEND. The card shows the TRUE state, and the chrome around
// it names the state in plain words rather than leaving the vendor to infer it:
//   · paused        → the pause line, because a paused card renders perfectly and reaches
//                     nobody, and that gap is exactly where a vendor loses a month
//   · not yet live  → the approval line
// A preview that rendered a paused vendor as live would be the costume class one surface
// over: fluent, on-topic, and false.
//
// W-1 / HOUSE LAWS: no localStorage; money renders through the shared component's formatRs
// (Rs 1,50,000), never the ₹ glyph and never k/L/Cr; ONE gold per screen — Enquire owns it
// inside the shared component, so this page's chrome carries none.

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { fetchDiscoverPreview } from '@/lib/vendor/api/vendor';
import VendorProfileView from '@/components/shared/VendorProfileView';
import { imgUrl, lqipUrl } from '@/lib/frost-api/img';
import type { DiscoverPreviewResponse } from '@/lib/vendor/types/vendor';

// Frost's own sheet token, carried verbatim from the discover canvas so the preview's glass
// is the couple's glass and not a look-alike. Copied rather than imported because the canvas
// holds it as a private const inside a gesture file; the binding is this comment, and §6.3
// of the harness asserts the four values still match.
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

  const vendor = data?.vendor ?? null;
  const hero   = vendor?.photos?.[0] ?? null;

  return (
    <div
      // ── TDW_07 MICRO-2 · §2(b) — THE SHELL'S PAGER STAYS OUT OF THIS SCREEN. ──────────
      // app/vendor/layout.tsx runs a three-panel horizontal pager (STUDIO · AI · DISCOVER).
      // Without this flag it ate every horizontal swipe on the preview and slid the vendor
      // to AI chat — founder-found on device, 2026-07-31.
      //
      // THE ESTATE ALREADY OWNED THE CURE AND I DID NOT USE IT. `data-pager-inert` is
      // TDW_04 A2.3's opt-out, minted from an earlier founder phone smoke whose comment
      // reads: "Without this the pager ate every row swipe and slid the whole panel
      // instead." The mechanism was there; P4b minted this full-screen route into a shell
      // it never read. The read-first gap is filed, not papered.
      //
      // CORRECT TODAY AND PREREQUISITE TOMORROW: under ruling (iii) the preview is
      // single-photo, so today this simply stops the screen from navigating when a vendor
      // swipes a photo that does not move. When P6 gives the preview the shared pager, the
      // horizontal swipe becomes MEANINGFUL here and this flag is what lets it be heard.
      // The two cures do not fight.
      data-pager-inert="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 60, background: INK,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}
    >
      {/* ── The full-bleed photo, exactly as the deck renders it ─────────────────── */}
      {hero && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${imgUrl(hero, 'full')}), url(${lqipUrl(hero)})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
      )}
      {/* The scrim the deck puts under its sheet, so the text has the same contrast. */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 100%)' }} />

      {/* ── The ribbon. Copy ② — founder-vetoed, byte-exact. ─────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 2,
        paddingTop: 'calc(env(safe-area-inset-top,0px) + 14px)',
        display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px',
      }}>
        <button
          onClick={() => router.back()}
          aria-label="Close preview"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32, borderRadius: 16, border: '0.5px solid rgba(255,255,255,0.18)',
            background: 'rgba(12,10,9,0.32)', backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)', color: 'rgba(248,247,245,0.8)',
            cursor: 'pointer', touchAction: 'manipulation',
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

      <div style={{ flex: 1 }} />

      {/* ── The sheet: Frost's glass, Frost's component ──────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 2,
        ...GLASS_SHEET,
        borderRadius: '20px 20px 0 0',
        paddingTop: 20,
        paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 24px)',
      }}>
        {loading && (
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 300, color: 'rgba(248,247,245,0.5)', margin: 0, padding: '0 24px 20px' }}>
            Loading your profile…
          </p>
        )}

        {!loading && error && (
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 300, color: 'rgba(248,247,245,0.6)', margin: 0, padding: '0 24px 20px' }}>
            {error}
          </p>
        )}

        {!loading && !error && data && vendor && (
          <>
            {/* Copy ⑤ — founder-vetoed, byte-exact. Renders on the FACT, never on a guess:
                `discover_paused` is the production column, read server-side. */}
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
            />

            {/* Copy ③ — founder-vetoed, byte-exact. Shown while the vendor is not yet
                live, which is the state F5's pre-approval reach exists to serve. */}
            {!data.is_live && !data.discover_paused && (
              <p style={{
                fontFamily: "'Cormorant Garamond',serif", fontSize: 13, fontWeight: 300,
                fontStyle: 'italic', color: 'rgba(248,247,245,0.6)',
                margin: '18px 0 0', padding: '0 24px', lineHeight: 1.5,
              }}>
                This is your profile as couples will see it — approval unlocks it on Discover.
              </p>
            )}

            {/* ── TDW_07 MICRO-2 — THE PHOTO-COUNT FOOTER IS REMOVED. TWO REASONS. ──────
                (1) IT WAS COSTUME-CLASS AND THAT IS THE EXECUTOR'S OWN DIAGNOSIS, ADOPTED
                INTO THE FINDING RECORD. It read "5 of your 9 approved photos appear on the
                card." Every word was TRUE — five did reach the card — and on a screen
                showing ONE photo with no way to reach the others it read as a promise the
                surface did not keep. Accurate, fluent, misleading: the exact shape this
                block exists to catch, shipped by the seat that wrote the law into the
                handover.

                (2) ITS CONDITION IS NOW DEAD ANYWAY. The founder retired the display cap
                ("couples should be able to see all approved photos on discover"), so
                `displayed_photo_count` always equals `approved_photo_count` and
                `approved > displayed` can never be true again.

                WHAT IS STILL OWED, AND HELD: the preview is single-photo by ruling (iii)
                while the card now carries every approved photo, so a vendor with nine
                approved photos sees one here and is told nothing about it. That gap wants a
                sentence, the sentence is vendor-facing copy, and copy is the founder's
                veto — it is NOT shipped unvetoed. Proposals are in the handover's §0.2.
                A silent gap is worse than nothing; it is not worse than a false promise,
                which is why the old line goes now rather than waiting for its replacement. */}
          </>
        )}
      </div>
    </div>
  );
}
