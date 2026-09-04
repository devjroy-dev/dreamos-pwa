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
// `mode` changes NOTHING about what renders. It changes what the two outward ACTIONS DO.
//
// P4b shipped them INERT in preview and that was wrong. The reasoning was sound as far as it
// went — an Enquire tap would send the vendor an enquiry about himself — but it justified
// the behaviour without asking what the vendor's finger would learn. Three of the four
// controls in the sheet did nothing, and the founder read the screen as broken, because a
// screen where most taps do nothing IS broken however defensible each individual gate was.
// It was also the same defect this block deleted the CommandBar for: a control that looks
// live and changes nothing.
//
// RULED SHAPE (ii), P4b-FINAL §4: in preview the controls EXPLAIN. The copy is founder-
// vetoed and ships byte-exact. Lock Date stays disabled exactly as it is on the live card —
// no toast, because its `beta` chip already says what it is.
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
import type { DiscoverVendor } from '@/lib/types/discover';

// ── TDW_19 P2-A §3-2 · THE CONTENT CAME OUT; THE CONTROLS STAYED ──────────────────────
// `/v/<code>` — the estate's first public per-vendor address — must render the couple's
// card, and could not mount this file: it is 'use client', it pulls lucide and the frost
// graph onto a route serving strangers, every ink in it is written for dark glass, and
// three of its four controls have no business on a public page.
//
// So the TEXT BLOCK moved to components/shared/VendorProfileContent.tsx and this component
// composes it. **THIS FILE'S RENDERED OUTPUT DID NOT CHANGE — not one byte**, across every
// prop shape its three mounts pass. scripts/tdw19_p2a_profile_core.proof.mjs renders this
// component to static markup before and after the extraction and diffs the strings.
// §2.2 there is that assertion; §0.2 is the cell that refuses to let it pass
// vacuously by comparing a file with itself, and §2.3 refuses to let it pass on
// two empty strings. The sentence above is written only because that file is in
// the tree and green — it was struck on entry to this read, and F-19.23 is why:
// a claim may not predate its witness, even for one commit.
//
// WHAT STAYED, AND WHY EACH: the wrapper div (a fragment cannot carry padding, and the
// mount owns its container) · the IG chip (a <button> with an onClick, and openInstagram is
// frost-graph) · FeaturedEyebrow's composition (it is content, but discover.tsx:838 imports
// it from here directly, and moving it would edit a mount) · all four controls.
//
// The `formatRs` import left with the price line it served. It is not re-imported here,
// because a money donor imported by a file that emits no money is how a second money
// register gets started.
import VendorProfileContent, { PROFILE_PALETTE } from '@/components/shared/VendorProfileContent';

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
  /** ── F1(a), TDW_07 P5 · THE ENQUIRE VERB MOVES UP ───────────────────────────
   *  Raised out of this component for exactly the reason `onCircleTap` was: the
   *  UI it opens — the enquiry sheet — is positioned against the DECK's glass
   *  sheet, not against this content. Button lives here; sheet lives there; the
   *  prop is the seam. Same precedent, same shape.
   *
   *  WHEN ABSENT, THE OLD BEHAVIOUR STANDS. Mounts that have not adopted the
   *  sheet (Muse, and any future one) keep the direct wa.me handoff rather than
   *  losing their Enquire to a half-migration. */
  onEnquire?: () => void;
  /** Raised to the mount: the toast that answers this tap is chrome and stayed canvas-side. */
  onCircleTap?: () => void;
  /** PREVIEW ONLY — raises the instructive line for the mount's own toast chrome to render.
   *  The component decides WHAT to say (the strings are vetoed copy and belong with the
   *  control they explain); the mount decides WHERE a toast lives, because toast positioning
   *  is chrome and the two mounts have different chrome. Lock Date raises nothing: it is
   *  disabled on the live card too, and its `beta` chip is already its own explanation. */
  onPreviewToast?: (line: string) => void;
}

export default function VendorProfileView({
  vendor, mode, isBlind = false, enquireLink = null, onEnquire, onCircleTap, onPreviewToast,
}: VendorProfileViewProps) {
  const isLive = mode === 'live';

  return (
    <div style={{ padding: '0 24px' }}>
      {/* ── THE CONTENT CORE ────────────────────────────────────────────────────
          Six blocks moved out verbatim; the fragment it returns emits no DOM node,
          so this div's children are the same nodes in the same order as before.
          `onGlass` carries the exact inks this file used to hold as literals. The
          eyebrow is composed HERE and passed down — TDW_07 P1 · D-5, above the
          category line — because discover.tsx imports FeaturedEyebrow from this
          file and moving it would edit a mount. */}
      <VendorProfileContent
        palette={PROFILE_PALETTE.onGlass}
        isBlind={isBlind}
        eyebrow={vendor.featured ? (
          <div style={{ margin: '0 0 6px' }}>
            <FeaturedEyebrow featured={vendor.featured} />
          </div>
        ) : null}
        fields={{
          name:          vendor.name,
          category:      vendor.category,
          city:          vendor.city,
          about:         vendor.about,
          startingPrice: vendor.starting_price,
          vibeTags:      vendor.vibe_tags,
        }}
      />

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
            // TDW_07 P4b-FINAL §4 — shape (ii), founder-vetoed copy. In preview the tap
            // TEACHES instead of acting: opening WhatsApp would send the vendor an enquiry
            // about himself, but a control that looks live and does nothing is the
            // dead-control class — "a tap that does nothing teaches nothing" (executor's
            // own diagnosis, credited into the record at CE-116). So it explains.
            // F1(a): SHEET FIRST when the mount provides one — it posts to
            // /enquire and then performs this same handoff itself, so the
            // pipeline is fed AND the working path is preserved. Without a
            // sheet, the direct open is unchanged.
            if (isLive) {
              if (onEnquire) onEnquire();
              else if (enquireLink) window.open(enquireLink, '_blank');
            }
            else onPreviewToast?.('Couples tap this to message you on WhatsApp.');
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
              // Same law as Enquire: act when live, explain when previewing.
              if (isLive) onCircleTap?.();
              else onPreviewToast?.('Couples tap this to save you to their Circle.');
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
