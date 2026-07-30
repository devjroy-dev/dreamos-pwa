'use client';

// components/shared/VendorProfileView.tsx
//
// TDW_07 P4b · F1-b — THE COUPLE-FACING PROFILE HAS ONE RENDERER.
//
// The spec's §3 guardrail is absolute about this: "shared VendorProfileView is the only
// profile renderer — a second implementation anywhere is a failed session." This file is
// that renderer. It was extracted from the Frost discover canvas's GlassOverlay content
// (app/(frost)/frost/canvas/discover/page.tsx:416–:481 at the P4b charter tip) and it is
// mounted in two places:
//
//   · LIVE    — the Frost swipe deck's overlay, exactly where it always rendered
//   · PREVIEW — /vendor/discover/preview, the vendor looking at his own card
//
// PARITY IS BY CONSTRUCTION, NOT BY DISCIPLINE. Both mounts render THIS component over
// data shaped by ONE backend function (src/lib/discover/shapeVendor.js). There is no second
// implementation to keep in step, in either layer. Spec P4.2: "Parity by construction — any
// drift is a failed session."
//
// ── WHAT DELIBERATELY DID NOT COME WITH IT ────────────────────────────────────────────
// The overlay's CHROME and GESTURES stayed canvas-side and are byte-stable: the drag-to-
// dismiss touch handlers, the translate/opacity transform, the glass sheet itself, the grab
// handle, and the Circle toast. Those are deck mechanics — the spec's §3 guardrail requires
// "Frost gesture mechanics byte-identical through P1/P6", and the surest way to keep a
// gesture byte-identical is not to move it. This component renders CONTENT into whatever
// container its mount provides.
//
// The Circle button therefore renders HERE (it is content — a control the couple sees on the
// profile) while its toast stays THERE (it is chrome — positioned against the sheet). The
// seam is the `onCircleTap` prop.
//
// ── THE CONTROL INVENTORY (CE-115) ────────────────────────────────────────────────────
// Every interactive control on the surface this replaces, each accounted:
//   1. Instagram chip      — KEPT, moved into this file with the component
//   2. Enquire button      — KEPT, inert in preview (see MODE below)
//   3. Lock Date button    — KEPT, and still DISABLED. Disabled ≠ absent: it renders with
//                            its `beta` marker exactly as before. Deleting a disabled
//                            control because it does nothing is how a roadmap promise
//                            silently disappears; the vendor's preview must show the couple's
//                            true screen, and this button is on it.
//   4. Circle button       — KEPT, tap raised to the mount via `onCircleTap`
// Nothing was removed. Nothing was added.
//
// ── MODE ──────────────────────────────────────────────────────────────────────────────
// `mode` changes NOTHING about what renders. It changes only whether the two outward
// ACTIONS fire. In preview the vendor is looking at his own profile: an Enquire tap that
// opened WhatsApp would send him an enquiry about himself, and a Circle tap would speak to
// a Circle he does not have. The controls therefore look identical — which is the entire
// point of a preview — and do not act. This is a DISCLOSED executor decision, not a ruled
// one: the charter ruled the renderer and the mount, and left the actions' behaviour in
// preview unstated. Stated here rather than settled silently.
//
// ── isBlind ───────────────────────────────────────────────────────────────────────────
// Blind mode is a Frost deck feature that hides vendor identity (name, handle, price) and
// shows vibe tags in their place. It travels with the component because a renderer that
// could not render blind mode would make the preview lie the moment a couple turned it on.
// The preview mount passes `false` — a vendor is never looking at his own card blind — but
// the capability is here, benched, rather than dropped as "unused by the second mount".

import React from 'react';
import { MessageCircle, Lock, Users } from 'lucide-react';
import { openInstagram, normalizeIgHandle } from '@/lib/frost/igLink';
import { formatRs } from '@/lib/vendor/format';
import type { DiscoverVendor } from '@/lib/types/discover';

// ── TDW_07 P4b · F-07.16 — THE MONEY REGISTER ─────────────────────────────────────────
// `formatRs` is the estate's ONE money donor and it renders the locked register:
// "Rs 1,50,000" — grouped Indian digits, the word Rs, never the ₹ glyph and never a k/L/Cr
// short form. Before this sitting the couple planes rendered "Rs 1.5L onwards" while the
// vendor's own Discover Profile promised him "Rs 1,50,000"; the same number in two registers
// on two sides of the same product is F-07.16.
//
// SITING, DISCLOSED: the donor lives at lib/vendor/format.ts. That path now reads as
// vendor-scoped for a function the couple planes also call. The declaration was NOT moved
// and NOT duplicated — one home beats a tidy path, and re-siting it would churn vendor
// surfaces outside this sitting's fence. Named here so the next reader finds a decision.

/** The Instagram chip — D-3. Renders on truth or not at all. */
export function IgChip({ handle, onTap }: { handle: string | null | undefined; onTap?: () => void }) {
  const h = normalizeIgHandle(handle);
  if (!h) return null;   // renders on truth or not at all
  return (
    <button
      onClick={(e: React.MouseEvent) => { e.stopPropagation(); openInstagram(h); onTap?.(); }}
      onTouchStart={(e: React.TouchEvent) => { e.stopPropagation(); }}
      onTouchEnd={(e: React.TouchEvent) => { e.stopPropagation(); }}
      aria-label={`Open @${h} on Instagram`}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '5px 10px', borderRadius: 14,
        background: 'rgba(12,10,9,0.32)',
        backdropFilter: 'blur(18px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
        border: '0.5px solid rgba(255,255,255,0.16)',
        fontFamily: "'Jost',sans-serif", fontSize: 10, fontWeight: 300,
        letterSpacing: '0.06em',
        // ink-dim per D-3 — the chip is a whisper, and the screen's one gold is
        // Enquire's (spec §3: one gold per screen).
        color: 'rgba(248,247,245,0.62)',
        cursor: 'pointer', pointerEvents: 'auto', touchAction: 'manipulation' as const,
      }}
    >
      {/* Instagram glyph, inline so no icon dependency is added to a gesture file */}
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
      @{h}
    </button>
  );
}

// The eyebrow. Manual honesty law: marked, ALWAYS — and only where the server says
// `featured` is true, which is an approved submission inside its scheduled window
// (CE ruling §C/F5). Non-interactive by construction: it never touches the deck.
export function FeaturedEyebrow({ featured }: { featured?: boolean }) {
  if (!featured) return null;
  return (
    <span style={{
      fontFamily: "'Jost',sans-serif", fontSize: 9, fontWeight: 300,
      letterSpacing: '0.28em', textTransform: 'uppercase' as const,
      color: 'rgba(248,247,245,0.72)',
      textShadow: '0 1px 4px rgba(0,0,0,0.45)',
      pointerEvents: 'none' as const,
    }}>
      FEATURED
    </span>
  );
}

export interface VendorProfileViewProps {
  vendor: DiscoverVendor;
  /** 'live' = a couple is looking. 'preview' = the vendor is looking at his own card. */
  mode: 'live' | 'preview';
  /** Frost's blind mode — hides identity, shows vibe tags. Preview passes false. */
  isBlind?: boolean;
  /** The enquire target. The canvas derives it from the deck's own fallback logic; the
   *  preview mount passes null, because a vendor does not enquire with himself. */
  enquireLink?: string | null;
  /** Raised to the mount: the toast that answers this tap is chrome and stayed canvas-side. */
  onCircleTap?: () => void;
}

export default function VendorProfileView({
  vendor, mode, isBlind = false, enquireLink = null, onCircleTap,
}: VendorProfileViewProps) {
  const isLive = mode === 'live';

  return (
    <div style={{ padding: '0 24px' }}>
      {/* TDW_07 P1 · D-5 — the eyebrow on detail, above the category line */}
      {vendor.featured && (
        <div style={{ margin: '0 0 6px' }}>
          <FeaturedEyebrow featured={vendor.featured} />
        </div>
      )}
      <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(248,247,245,0.5)', margin: '0 0 8px' }}>
        {vendor.category}&nbsp;·&nbsp;{vendor.city}
      </p>
      {!isBlind && (
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 300, color: '#F8F7F5', margin: '0 0 4px', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
          {vendor.name}
        </h2>
      )}
      {vendor.about && (
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 300, fontStyle: 'italic', color: 'rgba(248,247,245,0.7)', margin: '0 0 12px', lineHeight: 1.5 }}>
          {vendor.about}
        </p>
      )}
      {/* F-07.16 — the register. This replaced an inline L/K ternary that rendered
          "Rs 1.5L onwards". The vendor is promised "Rs 1,50,000" on his own Discover
          Profile; the couple now reads the same number in the same register.
          The GUARD is unchanged: `starting_price` is null when the vendor hid his rate
          (D-1), and null renders nothing at all — the suppressed-price parity the fixture
          ledger names Swati Roy as the witness for. */}
      {!isBlind && vendor.starting_price != null && (
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 300, color: 'rgba(248,247,245,0.55)', margin: '0 0 20px' }}>
          Starting at {formatRs(vendor.starting_price)}
        </p>
      )}
      {isBlind && vendor.vibe_tags.length > 0 && (
        <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: '0.15em', color: 'rgba(248,247,245,0.55)', margin: '0 0 20px' }}>
          {vendor.vibe_tags.join(' · ')}
        </p>
      )}

      {/* TDW_07 P1 · D-3 — the chip on detail. Blind mode hides identity, so the
          handle (which IS the identity) is withheld there, exactly as the name is. */}
      {!isBlind && vendor.instagram_handle && (
        <div style={{ margin: '0 0 16px' }}>
          <IgChip handle={vendor.instagram_handle} />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            // Inert in preview by construction — see MODE in this file's header.
            if (isLive && enquireLink) window.open(enquireLink, '_blank');
          }}
          style={{ width: '100%', padding: '14px 0', background: 'rgba(248,247,245,0.92)', border: 'none', borderRadius: 10, fontFamily: "'Jost',sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#0C0A09', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, touchAction: 'manipulation' }}
        >
          <MessageCircle size={14} strokeWidth={1.5} /> Enquire
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* DISABLED, NOT ABSENT. It has always been disabled; it renders in the preview
              because the couple sees it. */}
          <button
            disabled
            style={{ flex: 1, padding: '12px 0', background: 'rgba(255,255,255,0.1)', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: 10, fontFamily: "'Jost',sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(248,247,245,0.6)', cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <Lock size={12} strokeWidth={1.5} /> Lock Date
            <span style={{ fontSize: 7, fontStyle: 'italic', color: 'rgba(248,247,245,0.3)', textTransform: 'none', letterSpacing: 0 }}>beta</span>
          </button>
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              // The toast this raises is chrome and lives at the mount.
              if (isLive) onCircleTap?.();
            }}
            style={{ flex: 1, padding: '12px 0', background: 'rgba(255,255,255,0.1)', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: 10, fontFamily: "'Jost',sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(248,247,245,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, touchAction: 'manipulation' }}
          >
            <Users size={12} strokeWidth={1.5} /> Circle
          </button>
        </div>
      </div>
    </div>
  );
}
