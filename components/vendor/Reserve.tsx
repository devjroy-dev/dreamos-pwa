'use client';
// components/vendor/Reserve.tsx — THE RESERVED-HEIGHT SKELETON PRIMITIVE
// TDW_09/10 WALK HOTFIX MICRO · Fork 2 ruled (a) · F-09.111 / .112 / .113
//
// ── THE LAW THIS SERVES, CITED (S5 Paper C rule 5, already ratified) ─────────
//   "loading is skeleton, never blank; failure is a rendered state with a
//    retry, never an empty collection"
// Three vendor screens broke that rule by three different mechanisms and the
// founder convicted all three on his own device in one walk. The mechanisms
// are named in each adopter; this file is the one shape they share.
//
// ── WHY A PRIMITIVE AND NOT THREE PATCHES ───────────────────────────────────
// The chair ruled arm (a) on the executor's own argument: three bespoke fixes
// leave nothing carrying the law, and the class recurs on the next screen. One
// primitive, three named adopters, one comment paragraph to read.
//
// ── NO NEW MOTION, NO NEW COLOUR ────────────────────────────────────────────
// The animation is app/globals.css's OWN `shimmer` keyframe (:596), untouched
// — the ruling's "no motion beyond the existing shimmer". The ground is
// var(--atelier-card-border), a PUBLISHED theme-aware token (globals.css :741
// dark / :811 light). NOT the .skeleton class at globals.css:602: that class
// grounds on --bg-tertiary (#F3F4F6 / #1F2937), the pre-atelier palette, which
// would paint a cold grey block on a warm espresso screen. Zero consumers
// exist for it today; it is left alone rather than repointed, because
// repointing a shared class is a sweep and this is a hotfix. Disclosed, not
// silently forked.
//
// NO SPINNER. The kickoff barred them by name and the house has never shipped
// one on this lane.
//
// ── TWO MODES, AND GHOST IS THE INTERESTING ONE ─────────────────────────────
// BAR   — <Reserve h={28} /> — a shimmer bar of a stated box. Use where the
//         loaded thing is text whose line-height you can name.
// GHOST — <Reserve ghost><Meter score={0} /></Reserve> — renders the REAL
//         component with visibility:hidden + aria-hidden, so the browser lays
//         out its EXACT box and nothing is painted or announced, with a
//         shimmer laid over it. This is how the storefront reserves the meter
//         with ZERO arithmetic: no executor guessed 121px off a viewBox and no
//         cell had to re-derive that guess by the same method that produced it
//         (the INDEPENDENT-METHOD LAW's first clause, avoided by construction
//         rather than satisfied by a second opinion).
//         Ghost children are never read out and never tappable; the score
//         passed in is never seen, so no false number is claimed (S5 rule 8).

import type { CSSProperties, ReactNode } from 'react';

const GROUND = 'var(--atelier-card-border)';
const SHIMMER = 'shimmer 1.5s ease-in-out infinite';

export function Reserve({
  h, w = '100%', radius = 3, ghost, children, style,
}: {
  /** Exact reserved height in px. Required in BAR mode, ignored in GHOST mode. */
  h?: number;
  w?: number | string;
  radius?: number;
  /** Reserve the exact box of `children` by rendering them invisibly. */
  ghost?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  if (ghost) {
    return (
      <div aria-hidden="true" style={{ position: 'relative', display: 'inline-block', ...style }}>
        <div style={{ visibility: 'hidden', pointerEvents: 'none' }}>{children}</div>
        <div
          style={{
            position: 'absolute', inset: '12% 8%',
            background: GROUND, borderRadius: radius,
            animation: SHIMMER,
          }}
        />
      </div>
    );
  }
  return (
    <div
      aria-hidden="true"
      style={{
        height: h, width: w, background: GROUND, borderRadius: radius,
        animation: SHIMMER, ...style,
      }}
    />
  );
}
