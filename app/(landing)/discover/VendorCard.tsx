"use client";
import { DiscoveryCard } from "./useDiscoverFeed";

interface Props {
  card: DiscoveryCard;
  imageIndex: number;
  revealLevel: number;
  entering: boolean;
}

/**
 * VendorCard is purely presentational.
 * - No pointer/touch handlers. ALL gesture detection happens in the parent wrapper.
 *   This was the bug: the parallax onPointerMove was hijacking pointer events
 *   on some cards, causing tap inconsistency.
 * - pointer-events: none on every child so taps always reach the parent wrapper.
 * - Parallax removed: it was causing re-renders mid-gesture. Can be reintroduced
 *   later via CSS-only transform driven by parent, not card-local state.
 */
export default function VendorCard({ card, imageIndex, revealLevel, entering }: Props) {
  const src = card.images[imageIndex] || card.images[0];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none", // children pass all pointer events up to parent wrapper
        animation: entering ? "dissolve 280ms cubic-bezier(0.22, 1, 0.36, 1) forwards" : "none",
        opacity: revealLevel >= 3 ? 0.4 : 1,
        transition: revealLevel >= 3 ? "opacity 280ms" : undefined,
      }}
    >
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "40vh",
        background: "linear-gradient(to bottom, transparent, rgba(12,10,9,0.72))",
        pointerEvents: "none",
      }} />

      <div style={{ position: "absolute", bottom: 32, left: 24, pointerEvents: "none" }}>
        <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#C4BFB8", margin: 0 }}>
          {card.category} · {card.city}
        </p>

        {revealLevel >= 1 && (
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 36, color: "#FAFAF8", margin: "8px 0 0", animation: "dissolve 280ms cubic-bezier(0.22, 1, 0.36, 1) forwards" }}>
            {card.vendor_name}
          </p>
        )}

        {/* ══ TDW_07 P4b · F-07.27 — DORMANT BY COMMENT, RULED. NOT CURED, AND WHY. ══════
            This is a couple-facing money render carrying the forbidden register (the glyph
            AND the L/K short forms). F-07.16 retired that register everywhere else this
            sitting. It was DELIBERATELY NOT converted here, on the CE's ruling, because
            converting it would have been a cure in costume:

            1. THE SURFACE IS DEAD. useDiscoverFeed.ts fetches `/api/v2/discovery/feed`.
               That route does not exist in dream-os — zero router hits, no handler, no
               `price_min` column in any schema. The fetch fails, the catch sets an error,
               `cards` stays empty and nothing below ever renders. Derived by command
               against the backend at the P4b tips, not assumed from the name.

            2. THE UNITS ARE UNDERIVABLE. The literal divides by 100 for the L form, so
               `price_min` is denominated in THOUSANDS, not rupees. Every other money site
               in the estate divides by 100000. Piping this straight into formatRs would
               render "Rs 100" where the vendor means Rs 1,00,000 — a hundredfold
               understatement on a couple-facing surface. And because the endpoint does not
               exist, there is no contract to derive the true unit FROM. Authoring the
               conversion would mean authoring money from a conjecture, which was refused.

            RETIRE-OR-WIRE IS FOUNDER-SEQUENCED. The chair's read: it dies at P6's editorial
            pass or Block 09's nav. Until then these bytes stay exactly as they are.

            THE REGISTER BENCH CARRIES A NAMED EXEMPTION FOR THIS SITE, keyed on F-07.27 —
            so the repo-wide cell never reddens silently over a ruled dormancy, and never
            narrows quietly to hide one. Re-wiring this surface must re-open the cell. ══ */}
        {revealLevel >= 2 && (
          <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 14, color: "#C9A84C", margin: "4px 0 0", animation: "dissolve 280ms cubic-bezier(0.22, 1, 0.36, 1) forwards" }}>
            {card.price_min >= 100 ? `₹${(card.price_min / 100).toFixed(1)}L` : `₹${card.price_min}K`}
            {" – "}
            {card.price_max >= 100 ? `₹${(card.price_max / 100).toFixed(1)}L` : `₹${card.price_max}K`}
          </p>
        )}
      </div>
    </div>
  );
}
