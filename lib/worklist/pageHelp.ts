// lib/worklist/pageHelp.ts — ONE HOME FOR EVERY LINE THE "?" CARD SHOWS.
//
// CE-46 · FE-4 · the "?" on every surface (the founder's ruling of 27 September 2026).
// Every surface of the vendor app carries a "?" on the line of its own name; tapping it
// opens a card that says what the page is (one sentence), what can be done here (up to
// three plain lines), and where it connects. The words are the founder's, under R-45.20
// (plain and professional, no her or his) and R-45.30 (plain, literal, no dashes).
//
// KEYED BY PATHNAME (Fork G, ruled): the key is the route the shell is on. The one dynamic
// route, /vendor/collab/[post_id]/responses, keys by its pattern; `helpFor(pathname)` folds
// the live pathname onto it. A surface with no entry is a rung red (b140 §1), never a card
// that opens on nothing.
//
// LINE 1 IS READ, NEVER RETYPED. The founder's one-line room descriptions already exist:
// ROOM_DESC in lib/worklist/copy.ts (his table of 24 Sept 2026, 18 rooms) and ROW_DESC in
// lib/solutions/copy.ts (the Business Solutions rows). This file reads them, and types a
// `what` only for the four surfaces that have no line there (Rooms, Today, Exchange, the
// Collab replies page). Retyping a vetoed byte here would be a second home for it.
//
// LINES 2 TO 4 ARE HELD. The chair released this cut with the copy bytes for `can` and
// `connects` held until the founder's words come through him; until they land, `can` is
// empty and `connects` is '' on every surface, and the card draws only line 1. The rung
// reads the SHAPE (an entry per route with a `what`), so the hold does not hide a missing
// route; when his words arrive they land here and nowhere else.
'use strict';

import { ROOM_DESC } from '@/lib/worklist/copy';
import { ROW_DESC } from '@/lib/solutions/copy';
// EVERY ADDRESS IS READ FROM ITS ONE HOME, never typed here (b42, b69, b73 and tdw07_p4b each forbid a second
// spelling of an address; the differential caught the first two cuts of this file typing them). Rooms read the
// registry (roomHref, lib/worklist/rooms.ts); the solutions rooms read lib/solutions/routes.ts. Three keys have no
// home to read and are typed: /vendor/rooms and /vendor/today (spelled across the shell, owned by no constant) and
// the replies page's route PATTERN, which is a key, not an address anyone links to.
import { roomHref } from '@/lib/worklist/rooms';
import { DATES_HREF, NUMBER_HREF, WEDDING_PAGES_HREF, WEBSITE_HREF, GOOGLE_REVIEWS_HREF, REFERRALS_HREF,
  PAYMENT_REMINDERS_HREF, INTRODUCTIONS_HREF, POSTS_HREF, ADS_HREF, EXCHANGE_HREF, SOLUTIONS_INDEX_HREF } from '@/lib/solutions/routes';

export interface PageHelp {
  /** (The card's heading is the shell's own `title` byte, passed at the mount; it is not typed here.) */
  /** One sentence: what this page is. */
  what: string;
  /** Up to three plain lines: what can be done here. Each carries the name of its line icon. */
  can: readonly { icon: HelpIcon; line: string }[];
  /** One line: where this page connects. */
  connects: string;
  /** Rooms only (Fork E, ruled (3)): one extra sentence about the app as a whole. */
  app?: string;
}

/** The line icons, drawn by components/worklist/PageHelp.tsx in the accent ink (R-45.21). */
export type HelpIcon = 'list' | 'reply' | 'tag' | 'add' | 'edit' | 'send' | 'calendar' | 'money' | 'switch' | 'share' | 'read';

const HELD: readonly { icon: HelpIcon; line: string }[] = [];

// The four `what` lines this file types, because no home holds them yet. PROPOSED in the
// read-first of 27 Sept 2026; they wait on the founder's yes like every other new byte.
const TYPED_WHAT = {
  rooms:     'Every part of the app, in groups',
  today:     'Your day: a date to check, enquiries to answer, today\u2019s functions and money due',
  exchange:  'Gear and services traded with peers',
  responses: 'Replies to one collab post',
} as const;

// CE-46 ADS-1 · the Ads page's three lines (accepted by the chair 28 September 2026; FE-4's note: they go here, their one
// home). Line 1 of the Ads card is READ from the Posts & ads row (ROW_DESC.posts), b140 1.2's rule: typed line 1s stay four;
// these three are the card's "can" lines.
const ADS_HELP = {
  what:  'Boosting shows one of your Instagram posts to couples in your city who are planning a wedding, for a daily amount you set and a number of days you choose.',
  pays:  'Meta charges your own card from your own ad account. TDW never charges for ads and never runs one without your tap.',
  leads: 'Couples who write after seeing the ad land in Enquiries, and this page tells you what each ad reached, what it cost, and what to try next.',
} as const;

// DESIGN-1 · STAGE 2 · THE PORTFOLIO'S EXPLANATIONS, MOVED OFF THE PAGE (the founder, 29 Sept 2026: "make the photos the
// page"). The founder-vetted bytes of app/vendor/(shell)/portfolio/screen.tsx's COPY, word for word, their one home now;
// the screen reads H3 from here for its ?ig=cancelled toast. Sentences on one subject share a line; none is reworded.
export const PORTFOLIO_HELP = {
  H3: 'Instagram is just the quicker way. Uploading from your phone works exactly the same, always.',
  H2: "Instagram only allows this for professional accounts (business or creator). If yours is personal, switching is free and takes a minute in Instagram’s own settings.",
  G1: 'Press and drag to reorder. The first photo is your cover.',
  G3: 'Switch to All to reorder. Filters show only some of your photos.',
  F4: 'Couples see your approved photos. The rest are with our team.',
  H12: 'Photos are copied into your portfolio, so they stay put even if your Instagram changes.',
} as const;

const entry = (what: string, extra: Partial<PageHelp> = {}): PageHelp =>
  ({ what, can: HELD, connects: '', ...extra });

/**
 * Every surface under app/vendor/(shell)/ that draws, by pathname. /vendor itself redirects
 * to /vendor/rooms and draws nothing (app/vendor/(shell)/page.tsx), so it has no entry.
 */
export const PAGE_HELP: Readonly<Record<string, PageHelp>> = {
  '/vendor/rooms':                          entry(TYPED_WHAT.rooms, { app: '' }),
  // DESIGN-1 · STAGE 2: Home is the day's work (docs/review/REPORT.md §3). Each line names only a control the page
  // draws: Check and Open in calendar (the Check a date box), This week (the Today section's head).
  '/vendor/today':                          entry(TYPED_WHAT.today, { can: [
    { icon: 'calendar', line: 'Pick a day and tap Check. It answers Free all day, Booked or Enquiry, says what is on it, and Open in calendar goes to that day.' },
    { icon: 'reply', line: 'Reply to lists new enquiries with their last message and how long they have waited. Tap one to open it and reply.' },
    { icon: 'list', line: 'Today lists each function with its time, place and crew. Tap This week for the next seven days.' },
  ], connects: 'Money due opens Invoices. What you pinned is in More.' }),
  [roomHref('leads')]: entry(ROOM_DESC.leads),
  [roomHref('packages')]: entry(ROOM_DESC.packages),
  [roomHref('clients')]: entry(ROOM_DESC.clients),
  [roomHref('invoices')]: entry(ROOM_DESC.invoices),
  [roomHref('expenses')]: entry(ROOM_DESC.expenses),
  [roomHref('books')]: entry(ROOM_DESC.books),
  [roomHref('events')]: entry(ROOM_DESC.events),
  [roomHref('notes')]: entry(ROOM_DESC.notes),
  [roomHref('calendar')]: entry(ROOM_DESC.calendar),
  [roomHref('storefront')]: entry(ROOM_DESC.storefront),
  // Each line names only what the page draws: Upload and the Instagram button beside it, the All filter, the photos.
  [roomHref('portfolio')]: entry(ROOM_DESC.portfolio, { can: [
    { icon: 'add', line: `${PORTFOLIO_HELP.H3} ${PORTFOLIO_HELP.H2}` },
    { icon: 'edit', line: `${PORTFOLIO_HELP.G1} ${PORTFOLIO_HELP.G3}` },
    { icon: 'read', line: PORTFOLIO_HELP.F4 },
  ], connects: PORTFOLIO_HELP.H12 }),
  [roomHref('couture')]: entry(ROOM_DESC.couture),
  [roomHref('team')]: entry(ROOM_DESC.team),
  [roomHref('contracts')]: entry(ROW_DESC.contracts),
  [roomHref('tds')]: entry(ROOM_DESC.tds),
  [roomHref('advisor')]: entry(ROOM_DESC.advisor),
  [roomHref('billing')]: entry(ROOM_DESC.billing),
  [roomHref('settings')]: entry(ROOM_DESC.settings),
  [SOLUTIONS_INDEX_HREF]: entry(ROOM_DESC.support),
  [NUMBER_HREF]: entry(ROW_DESC.number),
  [WEBSITE_HREF]: entry(ROW_DESC.website),
  [WEDDING_PAGES_HREF]: entry(ROW_DESC.wedding_pages),
  [GOOGLE_REVIEWS_HREF]: entry(ROW_DESC.google),
  [POSTS_HREF]: entry(ROW_DESC.posts),
  [ADS_HREF]: entry(ROW_DESC.posts, { can: [{ icon: 'send', line: ADS_HELP.what }, { icon: 'money', line: ADS_HELP.pays }, { icon: 'reply', line: ADS_HELP.leads }] }),
  [DATES_HREF]: entry(ROW_DESC.dates),
  [INTRODUCTIONS_HREF]: entry(ROW_DESC.introductions),
  [REFERRALS_HREF]: entry(ROW_DESC.referrals),
  [PAYMENT_REMINDERS_HREF]: entry(ROW_DESC.reminders),
  [roomHref('collab')]: entry(ROW_DESC.collabs),
  '/vendor/collab/[post_id]/responses':     entry(TYPED_WHAT.responses),
  [EXCHANGE_HREF]: entry(TYPED_WHAT.exchange),
};

/** The one dynamic route, folded onto its pattern. Anything else keys by its own pathname. */
export function helpKey(pathname: string): string {
  const m = pathname.match(/^\/vendor\/collab\/[^/]+\/responses\/?$/);
  return m ? '/vendor/collab/[post_id]/responses' : pathname.replace(/\/+$/, '') || pathname;
}

export function helpFor(pathname: string): PageHelp | null {
  return PAGE_HELP[helpKey(pathname)] ?? null;
}

/** The browser-kept "seen" key for a route's first-visit dot (Fork B, ruled (1)). */
export function helpSeenKey(pathname: string): string {
  return 'tdw_help_seen:' + helpKey(pathname);
}
