// lib/frost/categoryLabels.ts
// ─────────────────────────────────────────────────────────────────────────────
// TDW_15 · P2 (R-34.33) — THE ELEVEN DISPLAY LABELS, ONE HOME.
//
// ── THIS IS A MOVE, NOT AN EDIT ──────────────────────────────────────────────
// Every byte below was lifted VERBATIM from `app/vendor/onboarding/page.tsx`
// (`CAT_LABEL` at :58-:70, `labelFor` at :75-:76, at dreamos-pwa c6e631d). Not
// one label string was authored here, and not one was re-cased, re-ordered or
// re-punctuated. The eleven are FOUNDER-SIGNED, 2026-08-13.
//
// A chair once ruled these be title-cased from the tokens. FOUR would have been
// wrong — `Photography & Videography`, `Make up Artist`, `Venue & Catering` and
// `Performer (Anchor, DJ, Choreography)` are none of them derivable from their
// token by any rule. An LE refused and cited the founder's signature. That is
// why this file says MOVE in its own header: the next hand to reach for a
// tidy-up needs to meet the refusal before it meets the strings.
//
// ── A LABEL MAP IS NOT A TAXONOMY ────────────────────────────────────────────
// Carried verbatim from the origin file, because the distinction is the whole
// reason the map may safely leave the page it was born on: this object answers
// "what does a human read for this token", never "which tokens exist". That
// second question is answered EXCLUSIVELY by the server's `allowed[]`, and both
// readers of this module iterate that response rather than `Object.keys` here —
// the vendor form from its own 400 INCOMPLETE payload, the bride's envelope
// picker from `GET /api/v2/couple/envelopes/categories` (R-34.34).
//
// ── AND IT DOES NOT CURE F-15.10 ─────────────────────────────────────────────
// The couple plane's BOOKINGS remain constrained by
// `couple_bookings_category_check`, which carries the pre-0123 eleven. Only
// `designer`, `decor` and `other` agree with the canonical set. An envelope
// named `Jewellery` cannot match a booking today because she cannot categorise
// a booking as jewellery at all. This module is a display half; the cure is a
// migration, a live-row backfill and a plane-crossing readers census, and it is
// F-15.10's micro, not this delivery's.
//
// ONE HOME, TWO READERS: `app/vendor/onboarding/page.tsx` and
// `components/frost/blooms/expenses.tsx`. A third copy is the defect this file
// exists to prevent.
// ─────────────────────────────────────────────────────────────────────────────

// ── DISPLAY LABELS · founder-signed 2026-08-13 ─────────────────────────────
// A LABEL MAP IS NOT A TAXONOMY. This object answers "what does a human read
// for this token", never "which tokens exist" — that question is answered
// exclusively by the server's `allowed[]`. The distinction is load-bearing: the
// picker iterates allowed[], not Object.keys(CAT_LABEL), so a token the server
// adds RENDERS (through the fallback below) instead of silently disappearing.
// That is the difference between this and the shadow taxonomy it replaces.
export const CAT_LABEL: Record<string, string> = {
  planning:        'Event Planner',
  designer:        'Designer',
  photography:     'Photography & Videography',
  makeup:          'Make up Artist',
  hairstylist:     'Hairstylist',
  jewellery:       'Jewellery',
  decor:           'Decor',
  venue_catering:  'Venue & Catering',
  performer:       'Performer (Anchor, DJ, Choreography)',
  content_creator: 'Content Creator',
  other:           'Something else',
};

// An unlabelled token still renders, readably, rather than vanishing from the
// picker — the drift-proof half. Unvetoed by construction: it mints no words of
// its own, it only makes the server's token legible until copy catches up.
export const labelFor = (token: string) =>
  CAT_LABEL[token] || token.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
