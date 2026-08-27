// lib/worklist/rooms.ts — THE SEVENTEEN ROOMS, IN FROZEN ORDER.
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
  // ── TOP BAND \u00b7 seven ───────────────────────────────────────
  { id: 'leads',     label: 'Leads',     band: 'work', href: '/vendor/list/leads',     pinnable: true  },
  { id: 'clients',   label: 'Clients',   band: 'work', href: '/vendor/list/clients',   pinnable: true  },
  { id: 'invoices',  label: 'Invoices',  band: 'work', href: '/vendor/list/invoices',  pinnable: true  },
  { id: 'expenses',  label: 'Expenses',  band: 'work', href: '/vendor/list/expenses',  pinnable: true  },
  { id: 'events',    label: 'Events',    band: 'work', href: '/vendor/list/events',    pinnable: true  },
  { id: 'notes',     label: 'Notes',     band: 'work', href: '/vendor/list/notes',     pinnable: true  },
  { id: 'calendar',  label: 'Calendar',  band: 'work', href: '/vendor/calendar',       pinnable: true  },
  // ── BOTTOM BAND \u00b7 eleven ──────────────────────────────────
  { id: 'storefront',label: 'Storefront',band: 'business', href: '/vendor/storefront',  pinnable: true  },
  { id: 'portfolio', label: 'Portfolio', band: 'business', href: '/vendor/portfolio',   pinnable: true  },
  { id: 'couture',   label: 'Couture',   band: 'business', href: '/vendor/couture',     pinnable: true  },
  { id: 'team',      label: 'Team',      band: 'business', href: '/vendor/team-hub',    pinnable: true  },
  { id: 'contracts', label: 'Contracts', band: 'business', href: '/vendor/contracts',   pinnable: true  },
  { id: 'tds',       label: 'TDS',       band: 'business', href: '/vendor/tds',         pinnable: true  },
  // R-38.1 \u00b7 CROSSED AT M-FINISH S1. These two now render as children of WorklistShell
  // under app/w/, so tapping them mounts no second layout, no second header and no second
  // session resolve. The /vendor routes survive on disk as untouched fallbacks and nothing
  // in the shell links to them.
  { id: 'billing',   label: 'Billing',   band: 'business', href: '/w/billing',          pinnable: true  },
  { id: 'settings',  label: 'Settings',  band: 'business', href: '/w/settings',         pinnable: true  },
  { id: 'support',   label: 'Business Solutions', band: 'business', href: '/w/support', pinnable: false },
  // R-37.87. A-4 interim like every other /vendor href: the tile DEEP-LINKS the existing
  // collab surface, carried not rebuilt, until it crosses. Position is the founder's to
  // reorder in one word — the frozen-order cell asserts wherever he puts it.
  { id: 'collab',    label: 'Collab',    band: 'business', href: '/vendor/collab',      pinnable: true  },
  // ── R-38.9 \u00b7 THE ADVISOR ROOM ─────────────────────────────────
  // F-38.2: `victor_mode` is live server truth (engine.agents.victor_mode, PATCH
  // /api/v2/vendor-e/mode — lib/vendor/api/vendor.ts:33-35) and the branch had ZERO
  // vendor-reachable doors to it. The chip was re-homed inside the OLD hub's risen chat at
  // F-09.129 (app/vendor/page.tsx:1132, inside `{risen && (`), and AskSheet never carried
  // it. A live capability with no door is a field that rots.
  //
  // IT IS A ROOM, NOT A CHIP. The mode control does not return to chrome anywhere — the
  // founder's verdict on the pill was on PLACEMENT and REGISTER (F-09.129 Fork A(a)) and a
  // room honours both: the vendor goes somewhere to advise, rather than carrying a switch.
  //
  // THE LABEL IS 「Advisor」, NEVER 「Victor」. R-37.70: persona names appear in no product
  // chrome. Founder's byte, ruled shippable pending his veto at CE-38 relay #1.
  { id: 'advisor',   label: 'Advisor',   band: 'business', href: '/w/advisor',          pinnable: false },
] as const;

// R-37.87's seventeen AMENDED BY FOUNDER WORD to eighteen (CE-38 R-38.9). Count history,
// every step worded or derived: 11 → 15 → 16 → 17 → 18. Eighteen is six full rows of
// three; the orphan row that R-37.87 left behind dies with this amendment.
export const ROOM_COUNT_EXPECTED = 18;
export const TOP_BAND_EXPECTED = 7;
export const BOTTOM_BAND_EXPECTED = 11;

/** The frozen order, by id. The cell compares against this and nothing else. */
export const FROZEN_ORDER: readonly string[] = [
  'leads', 'clients', 'invoices', 'expenses', 'events', 'notes', 'calendar',
  'storefront', 'portfolio', 'couture', 'team', 'contracts', 'tds', 'billing', 'settings', 'support',
  'collab', 'advisor',
] as const;

/**
 * THE ROOMS THAT HAVE NOT CROSSED YET — DECLARED, NOT COUNTED BY HAND.
 *
 * R-38.1's cell cannot honestly read "no /vendor href exists in the registry" this sitting,
 * because fourteen rooms are still carried surfaces. An assertion that is false on purpose
 * is worse than no assertion — a seat reading it would either loosen it or ignore it, and
 * both teach that this cell may be argued with.
 *
 * So the cell asserts the SET instead: every /vendor href in ROOMS appears below, and every
 * id below still carries a /vendor href. A room that silently slides back out of the shell
 * reddens; a room that crosses without leaving this list reddens too. The number of
 * remaining crossings is derived from the registry rather than kept in a handover sentence
 * that nobody re-derives.
 */
export const INTERIM_VENDOR_ROOMS: readonly string[] = [
  'leads', 'clients', 'invoices', 'expenses', 'events', 'notes', 'calendar',
  'storefront', 'portfolio', 'couture', 'team', 'contracts', 'tds', 'collab',
] as const;

/**
 * THE ONE /vendor LINK A CROSSED SHELL SURFACE STILL CARRIES.
 *
 * R-38.7 puts 「Profile layout」 inside Settings, and Settings crossed this sitting while
 * /vendor/discover/preview did not. So a shell surface links out of the shell exactly once,
 * and the cell asserts THE SET rather than the absence — an exception that is counted
 * cannot grow without reddening, whereas an exception that is merely explained can.
 */
export const INTERIM_VENDOR_LINKS: readonly string[] = [
  // R-38.7's row: 「Profile layout」, inside Settings.
  '/vendor/discover/preview',
  // DERIVED BY THE GATE, NOT BY READING. SettingsScreen's own edit-profile control. It was
  // missing from the first cut of this list because the body's outbound links had never
  // been enumerated before the surface crossed — the audit found it in one run, and the
  // list is honest only because it is asserted rather than described.
  '/vendor/discover/profile',
] as const;

export function roomsInBand(band: Band): Room[] {
  return ROOMS.filter((r) => r.band === band);
}
