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

import { ROOM_DESC } from '@/v2/lib/worklist/copy';
import { ROW_DESC } from '@/v2/lib/solutions/copy';
// EVERY ADDRESS IS READ FROM ITS ONE HOME, never typed here (b42, b69, b73 and tdw07_p4b each forbid a second
// spelling of an address; the differential caught the first two cuts of this file typing them). Rooms read the
// registry (roomHref, lib/worklist/rooms.ts); the solutions rooms read lib/solutions/routes.ts. Three keys have no
// home to read and are typed: /vendor/rooms and /vendor/today (spelled across the shell, owned by no constant) and
// the replies page's route PATTERN, which is a key, not an address anyone links to.
import { roomHref } from '@/v2/lib/worklist/rooms';
import { DATES_HREF, NUMBER_HREF, WEDDING_PAGES_HREF, WEBSITE_HREF, GOOGLE_REVIEWS_HREF, REFERRALS_HREF,
  PAYMENT_REMINDERS_HREF, INTRODUCTIONS_HREF, POSTS_HREF, ADS_HREF, EXCHANGE_HREF, SOLUTIONS_INDEX_HREF } from '@/v2/lib/solutions/routes';

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
// the screen reads H2 and H12 from here. H3, G1 and G3 are read ON THE PAGE (the founder's correction of 29 Sept 2026 on H3;
// tdw07_p3 pins G1 and G3 as rendered by the reorder state), so they are not repeated here. None is reworded.
export const PORTFOLIO_HELP = {
  H2: "Instagram only allows this for professional accounts (business or creator). If yours is personal, switching is free and takes a minute in Instagram’s own settings.",
  F4: 'Couples see your approved photos. The rest are with our team.',
  H12: 'Photos are copied into your portfolio, so they stay put even if your Instagram changes.',
} as const;

// DESIGN-1 · STAGE 2: the Collab responses page's explanation, moved off the page word for word (it was typed inline in
// app/vendor/(shell)/collab/[post_id]/responses/screen.tsx, above the list).
export const RESPONSES_HELP = {
  identity: 'Their identity is revealed to you because you posted the requirement. Tap Connect to share contact details with both of you.',
} as const;

const entry = (what: string, extra: Partial<PageHelp> = {}): PageHelp =>
  ({ what, can: HELD, connects: '', ...extra });

/**
 * Every surface under app/vendor/(shell)/ that draws, by pathname. /vendor itself redirects
 * to /vendor/today (DESIGN-1 stage 3) and draws nothing (app/vendor/(shell)/page.tsx), so it has no entry.
 */
export const PAGE_HELP: Readonly<Record<string, PageHelp>> = {
  // DESIGN-1 · STAGE 3: More is the coin's page. Each line names only what the page draws: the pinned rooms, the
  // founder's five groups of rows, and the account rows at the foot (Report an issue, Graphite and Chalk, Sign out).
  '/vendor/more':                           entry(TYPED_WHAT.rooms, { can: [
    { icon: 'list', line: 'Every room outside the five tabs, in groups: Your business, Get found, Work together, Messages and Help. Tap a row to open it.' },
    { icon: 'switch', line: 'Under Your account: Report an issue, Graphite or Chalk for dark or light, and Sign out.' },
  ], connects: 'Pinned, at the top, holds the rooms you use most.',
    app: 'The five tabs at the bottom hold the daily work: Today, Enquiries, Calendar, Clients and Money. Your initials, top right, open More. The box at the top of every page searches your enquiries, clients, events, invoices, packages, notes, crew and these rooms; a question can go to TDW.' }),
  // DESIGN-1 · STAGE 2: Home is the day's work (docs/review/REPORT.md §3). Each line names only a control the page
  // draws: Check and Open in calendar (the Check a date box), This week (the Today section's head).
  '/vendor/today':                          entry(TYPED_WHAT.today, { can: [
    { icon: 'calendar', line: 'Pick a day and tap Check. It answers Free all day, Booked or Enquiry, says what is on it, and Open in calendar goes to that day.' },
    { icon: 'reply', line: 'Reply to lists new enquiries with their last message and how long they have waited. Tap one to open it and reply.' },
    { icon: 'list', line: 'Today lists each function with its time, place and crew. Tap This week for the next seven days.' },
    // DESIGN-1 stage 3: the Get found card (lib/worklist/getFound.ts), drawn only while one of the three is not set up.
    { icon: 'switch', line: 'When your website, Google reviews or posts and ads is not set up yet, one card at the end says so and opens it. Hide puts it away.' },
  ], connects: 'Money due opens Invoices. Your pinned rooms are in More: tap your initials, top right.' }),
  // DESIGN-1 · THE FIVE TABS' CARDS (the founder: what the page does, its steps, what it connects to, naming only what
  // the screen draws). Line 1 stays the registry's (b140 1.2); the lines below name this screen's own controls.
  [roomHref('leads')]: entry(ROOM_DESC.leads, { can: [
    { icon: 'list', line: 'Search enquiries, or tap New, Contacted, Quoted or Booked to see only those. Recent changes the order.' },
    { icon: 'reply', line: 'Tap an enquiry to open it: WhatsApp or Call the couple, Attach package, Forward to a peer or Mark lost.' },
    { icon: 'add', line: 'Booking confirmed or Advance paid opens Book: the dates, the package and the invoice in one step. The + button adds an enquiry.' },
  ], connects: 'A booked enquiry becomes a client in Clients, its dates go on your Calendar and its invoice into Money.' }),
  [roomHref('packages')]: entry(ROOM_DESC.packages),
  [roomHref('clients')]: entry(ROOM_DESC.clients, { can: [
    { icon: 'list', line: 'Search clients. Each card shows what has come in and what is still due.' },
    { icon: 'read', line: 'Tap a client to open the card: Ask in chat, Edit or Hide. On a booked client, Cancel booking asks before removing its dates or an unpaid invoice.' },
    { icon: 'add', line: 'The + button adds a client who booked without an enquiry.' },
  ], connects: 'A client\u2019s invoices are in Money and the dates are on your Calendar.' }),
  [roomHref('invoices')]: entry(ROOM_DESC.invoices, { can: [
    { icon: 'list', line: 'Search invoices, or tap Overdue, Unpaid or Part paid to see only those. Recent changes the order.' },
    { icon: 'money', line: 'Mark paid records a payment on that invoice. Tap an invoice to open it.' },
    { icon: 'add', line: 'The + button makes an invoice.' },
  ], connects: 'The row under the heading opens the rest of Money: Payment reminders, Expenses, TDS and Books.' }),
  [roomHref('expenses')]: entry(ROOM_DESC.expenses),
  [roomHref('books')]: entry(ROOM_DESC.books),
  [roomHref('events')]: entry(ROOM_DESC.events),
  [roomHref('notes')]: entry(ROOM_DESC.notes),
  [roomHref('calendar')]: entry(ROOM_DESC.calendar, { can: [
    { icon: 'calendar', line: 'Month shows the dates and Weddings lists each wedding. The arrows move a month; Good dates shows or hides the good dates.' },
    { icon: 'list', line: 'Tap a day to see what is on it and to block it. Coming up lists the next functions.' },
    { icon: 'add', line: 'The + button adds an event.' },
  ], connects: 'Every booking puts each of its dates here as its own event.' }),
  [roomHref('storefront')]: entry(ROOM_DESC.storefront),
  // Each line names only what the page draws: Upload and the Instagram button beside it, the All filter, the photos.
  [roomHref('portfolio')]: entry(ROOM_DESC.portfolio, { can: [
    { icon: 'add', line: PORTFOLIO_HELP.H2 },
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
  '/vendor/collab/[post_id]/responses':     entry(TYPED_WHAT.responses, { can: [{ icon: 'share', line: RESPONSES_HELP.identity }] }),
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

// ── DESIGN-1 · STAGES 3 AND 4 · THE CARDS FOR WHAT IS NOT A PAGE (components/worklist/PageHelp.tsx HelpButton) ──────
// The founder: every page, tab and sheet of the new layout has its "?". The same card, the same shape; each line names
// only what that surface draws.
export const SHEET_HELP = {
  search: { title: 'Search or ask', help: entry('One box for everything: your enquiries, clients, events, invoices, packages, notes and crew, and the pages of the app.', { can: [
    { icon: 'list', line: 'Type a name, part of a phone number (the last four digits work) or a page such as TDS or website. Results come grouped by kind; tap one to open it.' },
    { icon: 'reply', line: 'Ask a question and the last row is Ask TDW about this, which opens the assistant with your words.' },
    { icon: 'read', line: 'Tap the empty box to see your recent searches.' },
  ], connects: 'The Ask TDW bar at the bottom of the page is the same assistant.' }) },
  book: { title: 'Book', help: entry('Book turns an enquiry into a client in one step: the dates, the package and the invoice together.', { can: [
    { icon: 'calendar', line: 'Each date goes on your calendar as its own event. Add a date for each function.' },
    { icon: 'money', line: 'With a package attached, its payment plan is shown and Change plan edits it. With none, pick one, or No package, enter an amount.' },
    { icon: 'send', line: 'Confirm booking makes the invoice. Then the confirmation is ready: Copy it or Send on WhatsApp. Nothing is sent unless you tap. Undo takes it all back for ten seconds.' },
  ], connects: 'The client appears in Clients, the dates on your Calendar and the invoice in Money.' }) },
  cancelBooking: { title: 'Cancel booking', help: entry('Cancel booking takes a client back to your enquiries.', { can: [
    { icon: 'calendar', line: 'Tick the dates line to take the booking\u2019s dates off your calendar.' },
    { icon: 'money', line: 'Tick the invoice line to remove the unpaid invoice. An invoice with payments on it stays.' },
    { icon: 'read', line: 'Nothing is removed unless you tick it. Keep booking closes this with no change.' },
  ], connects: 'The couple stays in Enquiries, ready to book again.' }) },
} as const;
