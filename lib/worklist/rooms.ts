// lib/worklist/rooms.ts — THE SIXTEEN ROOMS, IN FROZEN ORDER.
//
// R-37.60 (six seats for the slices) \u00b7 R-37.61 (Settings and Billing take tiles)
// \u00b7 R-37.62 (Portfolio pinnable, not pre-pinned) \u00b7 R-37.66 as amended (Contact Support
// is a ROOM, bottom band, beside Billing and Settings) \u00b7 rider \u2461 (two bands,
// positions never reorder).
//
// THE ORDER IS A RULED ANTI-FEATURE. Tiles do not sort by recency, count, or anything else.
// Badges move (Phase 4); positions do not. R-37.22 is the cited reasoning: a control that
// moves under the thumb is a control that cannot be learned. The cell below asserts the
// order by index, so a reorder in a later edit reddens.
//
// A-4 INTERIM. Every href points into the EXISTING /vendor route, so no job becomes
// unreachable while the branch shell is a shell. Phase 2 replaces these with native routes;
// the room registry is the one place that changes when it does.
//
// \u26a0 CROSSING THE THRESHOLD LEAVES THE PALETTE. A deep-linked room renders under the OLD
// shell's theme (Espresso / Editorial Paper), because app/vendor/layout.tsx owns its own
// token layer. That is inherent to A-4 and is stated on the walk card so the founder reads
// it before he sees it.
'use strict';

export type Band = 'work' | 'business';

export interface Room {
  /** Stable id. Never rendered; the label is the byte. */
  id: string;
  /** Vendor-facing tile label. */
  label: string;
  band: Band;
  /** A-4 interim destination, or an internal shell route. */
  href: string;
  /** R-37.62: pinnable rooms may be pinned by the vendor; none but the defaults start pinned. */
  pinnable: boolean;
}

/** \u00a78.2: Calendar and Storefront are the two default pins. Nothing else pre-pins. */
export const DEFAULT_PINS: readonly string[] = ['calendar', 'storefront'] as const;

export const ROOMS: readonly Room[] = [
  // ── TOP BAND \u00b7 seven ──────────────────────────────────────────────────
  { id: 'leads',     label: 'Leads',     band: 'work', href: '/vendor/list/leads',     pinnable: true  },
  { id: 'clients',   label: 'Clients',   band: 'work', href: '/vendor/list/clients',   pinnable: true  },
  { id: 'invoices',  label: 'Invoices',  band: 'work', href: '/vendor/list/invoices',  pinnable: true  },
  { id: 'expenses',  label: 'Expenses',  band: 'work', href: '/vendor/list/expenses',  pinnable: true  },
  { id: 'events',    label: 'Events',    band: 'work', href: '/vendor/list/events',    pinnable: true  },
  { id: 'notes',     label: 'Notes',     band: 'work', href: '/vendor/list/notes',     pinnable: true  },
  { id: 'calendar',  label: 'Calendar',  band: 'work', href: '/vendor/calendar',       pinnable: true  },
  // ── BOTTOM BAND \u00b7 nine ────────────────────────────────────────────────
  { id: 'storefront',label: 'Storefront',band: 'business', href: '/vendor/storefront',  pinnable: true  },
  { id: 'portfolio', label: 'Portfolio', band: 'business', href: '/vendor/portfolio',   pinnable: true  },
  { id: 'couture',   label: 'Couture',   band: 'business', href: '/vendor/couture',     pinnable: true  },
  { id: 'team',      label: 'Team',      band: 'business', href: '/vendor/team-hub',    pinnable: true  },
  { id: 'contracts', label: 'Contracts', band: 'business', href: '/vendor/contracts',   pinnable: true  },
  { id: 'tds',       label: 'TDS',       band: 'business', href: '/vendor/tds',         pinnable: true  },
  { id: 'billing',   label: 'Billing',   band: 'business', href: '/vendor/billing',     pinnable: true  },
  { id: 'settings',  label: 'Settings',  band: 'business', href: '/vendor/settings',    pinnable: true  },
  { id: 'support',   label: 'Contact Support', band: 'business', href: '/w/support',    pinnable: false },
] as const;

export const ROOM_COUNT_EXPECTED = 16;
export const TOP_BAND_EXPECTED = 7;
export const BOTTOM_BAND_EXPECTED = 9;

/** The frozen order, by id. The cell compares against this and nothing else. */
export const FROZEN_ORDER: readonly string[] = [
  'leads', 'clients', 'invoices', 'expenses', 'events', 'notes', 'calendar',
  'storefront', 'portfolio', 'couture', 'team', 'contracts', 'tds', 'billing', 'settings', 'support',
] as const;

export function roomsInBand(band: Band): Room[] {
  return ROOMS.filter((r) => r.band === band);
}
