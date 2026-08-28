// components/shared/VendorProfileContent.tsx
//
// TDW_19 P2-A §3-2 · THE COUPLE-FACING CARD'S CONTENT CORE.
//
// ═══════════════════════════════════════════════════════════════════════════
// WHY THIS FILE EXISTS, AND WHAT IT IS NOT
// ═══════════════════════════════════════════════════════════════════════════
// `VendorProfileView`'s header states the law this file serves: "shared
// VendorProfileView is the only profile renderer — a second implementation
// anywhere is a failed session." P2-A gives a vendor a PUBLIC address at
// `/v/<code>`, and that page must render the couple's card. Reusing
// `VendorProfileView` whole was impossible for three derived reasons:
//
//   1. It is `'use client'` and imports `lucide-react` and `@/lib/frost/igLink`.
//      `/v/` serves strangers arriving from a WhatsApp forward; P0-B kept that
//      route graph-free deliberately (`app/v/[code]/page.tsx` refuses to import
//      `lib/solutions/copy.ts` for the same reason).
//   2. Every ink in it is written for DARK GLASS —`rgba(248,247,245,·)` over
//      `rgba(255,255,255,0.1)` fills, because it sits on a photograph in the
//      Frost deck. `/v/` is cream.
//   3. Three of its four controls must not appear on `/v/` at all. A real
//      vendor gets no contact button (third band §2-5), Circle is
//      session-bound, and Lock Date is a disabled beta chip.
//
// SO THE CONTENT COMES OUT AND THE CONTROLS STAY. This file renders the TEXT
// BLOCK ONLY — eyebrow slot, category·city, name, about, price, vibe tags.
// **It renders no interactive element of any kind.** Controls belong to the
// mount, which is the same boundary P4b drew when it left the deck's gestures
// canvas-side: this component renders content into whatever container its mount
// provides, and the mount decides what a finger can do.
//
// ── WHAT IT DELIBERATELY DOES NOT RENDER ──────────────────────────────────
//   · THE WRAPPER. It returns a FRAGMENT. `VendorProfileView` keeps its own
//     `<div style={{ padding: '0 24px' }}>`; `/v/` provides a different one.
//     A fragment emits no DOM node, which is what makes the byte-identity below
//     possible at all.
//   · THE IG CHIP. It is a `<button>` with an `onClick` that opens Instagram —
//     a control, and its `openInstagram` import is frost-graph. It stays in
//     `VendorProfileView`.
//   · `FeaturedEyebrow`. It IS content, but it is also imported directly by
//     `components/frost/blooms/discover.tsx:838`, and moving it would edit a
//     mount. It is passed in as the `eyebrow` node instead — the mount composes
//     it, this file gives it a slot.
//   · PHOTOS. `VendorProfileView` never rendered them; the hero and the strip
//     have always been the mount's (`app/demo/vendor/[handle]/page.tsx:264`,
//     the Frost canvas). `/v/` follows that precedent rather than inventing a
//     second arrangement.
//
// ── THE ONE THING THAT CHANGES BETWEEN MOUNTS: THE PALETTE ────────────────
// And it changes through `PROFILE_PALETTE` below, never through a literal.
// **THE TYPE SCALE, THE FONT STACKS, THE MARGINS AND THE LETTER-SPACING DO NOT
// GET A SEAM**, and that is the point rather than an omission: those are what
// make it ONE card. If `/v/` could re-size the name, there would be two cards
// again within a sitting. Only the ink moves, because only the ground moved.
//
// The font strings stay as the literals `VendorProfileView` shipped
// (`"'Jost',sans-serif"`) and are NOT routed through `lib/vendor/tokens.ts`'s
// `FONTS`, whose values differ (`'"Cormorant Garamond", Georgia, serif'`).
// Routing them there would change the emitted `style` attribute and break the
// byte-identity this extraction is required to preserve. Named here so the next
// reader finds a decision rather than an inconsistency.

import React from 'react';
import { formatRs } from '@/lib/vendor/format';

/**
 * THE PALETTE SEAM. Four ink roles, two grounds.
 *
 * `onGlass` carries the EXACT literals `VendorProfileView` shipped before this
 * extraction, byte for byte — that equality is what the proof asserts, and it is
 * why this palette is not "tidied" into `COLORS` from `lib/vendor/tokens.ts`.
 * That file's own header forbids modification without a recorded founder
 * decision, and its `cream`/`ink` values are opaque hexes where these are
 * alpha-composited over a photograph.
 *
 * `onCream` is `/v/`'s ground: the inks P0-B already shipped on that route
 * (`app/v/[code]/page.tsx` at `f3e23dd` — `#0C0A09`, `#403B36`, `#6B6560`), so
 * the public page's colour was founder-walked before this file existed.
 */
export const PROFILE_PALETTE = {
  onGlass: {
    eyebrow: 'rgba(248,247,245,0.5)',
    name:    '#F8F7F5',
    about:   'rgba(248,247,245,0.7)',
    meta:    'rgba(248,247,245,0.55)',
  },
  onCream: {
    eyebrow: '#6B6560',
    name:    '#0C0A09',
    about:   '#403B36',
    meta:    '#6B6560',
  },
} as const;

export type ProfilePalette = typeof PROFILE_PALETTE[keyof typeof PROFILE_PALETTE];

/**
 * THE CORE'S OWN CONTRACT — the fields it renders, and nothing else.
 *
 * It deliberately does NOT take `DiscoverVendor`. That type carries `id`,
 * `photos`, `enquire_link`, `routing_handle` and `instagram_handle`, none of
 * which this component reads; taking it would oblige `/v/` to synthesise five
 * fields it has no business inventing in order to render a paragraph. Each
 * mount maps its own row to this shape, which is a mapping the mount can be
 * read to verify.
 */
export interface ProfileContentFields {
  name: string | null;
  category: string | null;
  city: string | null;
  about: string | null;
  /** RUPEES, never paise — c-38.32. Null when the vendor's `rate_display` is
   *  false; null renders nothing at all, which is the suppressed-price parity
   *  the P4b fixture ledger names Swati Roy as the witness for. */
  startingPrice: number | null;
  /** Frost blind mode's substitute for identity. `/v/` passes `[]`. */
  vibeTags: string[];
}

export interface VendorProfileContentProps {
  fields: ProfileContentFields;
  palette: ProfilePalette;
  /** Frost's blind mode — hides name and price, shows vibe tags in their place.
   *  Travels with the content because a renderer that could not render blind
   *  mode would make the vendor's preview lie the moment a couple turned it on. */
  isBlind?: boolean;
  /** The FEATURED eyebrow, composed by the mount. See the header. */
  eyebrow?: React.ReactNode;
  /**
   * ⚠ THE NAME'S HEADING LEVEL — the one prop `/v/` needed that this component
   * lacked, added once, at its home, per the third band §2-4.
   *
   * **It defaults to `'h2'`, and the default is the load-bearing part.** Inside
   * the app the shell owns the page title and this card is a section of a
   * screen, so `h2` is right and the three deck mounts pass nothing — which is
   * what keeps their markup byte-identical through this change
   * (`scripts/tdw19_p2a_profile_core.proof.mjs` §2.2).
   *
   * `/v/<code>` is not inside the shell. It is a public page whose whole purpose
   * is to be forwarded into WhatsApp, and a shared page with no `h1` is a page
   * whose reading order and link preview have no subject. It passes `'h1'`.
   *
   * THE TYPE SCALE DOES NOT MOVE WITH THE TAG. Both render at 28px Cormorant —
   * the element changes, the design does not, because the size is what makes it
   * one card and only the ground moved.
   */
  nameAs?: 'h1' | 'h2';
}

export default function VendorProfileContent({
  fields, palette, isBlind = false, eyebrow = null, nameAs = 'h2',
}: VendorProfileContentProps) {
  const Name = nameAs;
  return (
    <>
      {eyebrow}
      <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: '0.22em', textTransform: 'uppercase', color: palette.eyebrow, margin: '0 0 8px' }}>
        {fields.category}&nbsp;·&nbsp;{fields.city}
      </p>
      {!isBlind && (
        <Name style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 300, color: palette.name, margin: '0 0 4px', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
          {fields.name}
        </Name>
      )}
      {fields.about && (
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 300, fontStyle: 'italic', color: palette.about, margin: '0 0 12px', lineHeight: 1.5 }}>
          {fields.about}
        </p>
      )}
      {/* F-07.16 — the register. `formatRs` is the estate's ONE money donor and
          it renders "Rs 1,50,000": grouped Indian digits, the word Rs, never the
          ₹ glyph and never a k/L/Cr short form. The guard above it is unchanged
          from P4b: null renders nothing at all. */}
      {!isBlind && fields.startingPrice != null && (
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 300, color: palette.meta, margin: '0 0 20px' }}>
          Starting at {formatRs(fields.startingPrice)}
        </p>
      )}
      {isBlind && fields.vibeTags.length > 0 && (
        <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: '0.15em', color: palette.meta, margin: '0 0 20px' }}>
          {fields.vibeTags.join(' · ')}
        </p>
      )}
    </>
  );
}
