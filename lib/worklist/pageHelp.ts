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
// LINES 2 TO 4 ARE NO LONGER HELD (the founder on the live walk, 28 Sept 2026: every room needs its tips).
// `can` is now HOW TO DO the room's main things, up to four steps naming the real buttons; `connects` is
// one line. The rung (b140 1.8) requires every surface to carry both.
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
  /** Up to four short steps: HOW TO DO the room's main things, naming the real buttons. Each has a line icon. */
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
  rooms:     'Every room of the app, on shelves',
  today:     'What needs attention today',
  exchange:  'Gear and services traded with peers',
  responses: 'Replies to one collab post',
} as const;

// CE-46 ADS-1 · the Ads page's three lines (accepted by the chair 28 September 2026; FE-4's note: they go here, their one
// home). Line 1 of the Ads card is READ from the Posts & ads row (ROW_DESC.posts), b140 1.2's rule: typed line 1s stay four;
// these three are the card's "can" lines.
const ADS_HELP = {
  what:  'Boosting shows one of your Instagram or Facebook posts to couples in your city who are planning a wedding, for a daily amount you set and a number of days you choose.',
  pays:  'Meta takes the amount from your ad account\u2019s payment method. TDW never charges for ads and never runs one without your tap.',   // cut1e 5, the founder's ok (29 September 2026)
  leads: 'Couples who write after seeing the ad land in Leads, and this room tells you what each ad reached, what it cost, and what to try next.',
} as const;

const entry = (what: string, extra: Partial<PageHelp> = {}): PageHelp =>
  ({ what, can: HELD, connects: '', ...extra });
const how = (...steps: [HelpIcon, string][]): { icon: HelpIcon; line: string }[] => steps.map(([icon, line]) => ({ icon, line }));

// ── THE HOW-TO LINES (CE-46 FE-4 words cut, 28 Sept 2026) ─────────────────────────────────────────────
// The founder on the live walk: every room's card must say what the room does and HOW TO DO its main
// things. Each step below names the real buttons on that screen, read from the room at 22e471cf by a
// controls census in the real app (every visible button, field and what the + opens), never invented.
// Register: R-45.30 (plain, literal, no dashes), R-45.20 (no her or his). Up to four steps per room.
export const PAGE_HELP: Readonly<Record<string, PageHelp>> = {
  '/vendor/rooms': entry(TYPED_WHAT.rooms, {
    app: 'Every part of your business has its own room, and every room has a ? that explains it.',
    can: how(['list', 'To open a room: tap its name.'],
             ['add', 'To add something new: tap +.']),
    connects: 'Today shows what needs you first. Business Solutions holds the rooms that bring work in.' }),
  '/vendor/today': entry(TYPED_WHAT.today, {
    can: how(['read', 'Read the cards from the top.'],
             ['list', 'To act on a card: tap it to open the room it belongs to.'],
             ['switch', 'To choose the rooms pinned here: tap Change.']),
    connects: 'Leads, Invoices and Calendar feed this page.' }),
  [roomHref('leads')]: entry(ROOM_DESC.leads, {
    can: how(['add', 'To add a lead: tap +, type the name, tap Add lead.'],
             ['list', 'To see one stage: tap new, contacted, quoted, booked or lost.'],
             ['edit', 'To change a lead: tap it, then Edit.'],
             ['read', 'To see everything about a lead: tap it, then All details.']),
    connects: 'A booked lead moves to Clients. Its package comes from Packages.' }),
  [roomHref('packages')]: entry(ROOM_DESC.packages, {
    can: how(['add', 'To add a package: tap Add package, give it a name and price.'],
             ['list', 'To list what it includes: tap Add item for each line.'],
             ['send', 'Tap Save. Cancel leaves it unchanged.']),
    connects: 'You quote these to leads, and a booked package goes on the client.' }),
  [roomHref('clients')]: entry(ROOM_DESC.clients, {
    can: how(['add', 'To add a client: tap +, fill in the name, number and date, tap Add client.'],
             ['calendar', 'To add a missing wedding date: tap the + chip on the client.'],
             ['read', 'To see a client in full: tap the name.']),
    connects: 'Dates appear on Calendar. Invoices raised for a client appear in Invoices.' }),
  [roomHref('invoices')]: entry(ROOM_DESC.invoices, {
    can: how(['add', 'To raise an invoice: tap +, fill it in, tap Create invoice.'],
             ['money', 'When a client pays: tap the invoice, then Mark paid.'],
             ['list', 'To see one kind: tap overdue, unpaid, part-paid or paid.'],
             ['edit', 'To change or remove one: tap it, then Edit or Delete invoice.']),
    connects: 'Payments land in Books. Reminders for unpaid invoices go out from Payment reminders.' }),
  [roomHref('expenses')]: entry(ROOM_DESC.expenses, {
    can: how(['add', 'To record a cost: tap +, type the amount, tap Log expense.'],
             ['list', 'Costs are grouped by month, newest first.'],
             ['edit', 'To change or remove one: tap it, then Edit or Delete.']),
    connects: 'Every cost lands in Books.' }),
  [roomHref('books')]: entry(ROOM_DESC.books, {
    can: how(['read', 'Read money in and money out, month by month, from the Opening balance.'],
             ['calendar', 'Months run down the page from the Opening balance.']),
    connects: 'Reads Invoices and Expenses. Nothing is typed here.' }),
  [roomHref('events')]: entry(ROOM_DESC.events, {
    can: how(['add', 'To add a function: tap +, fill in the name, date and type, tap Add event.'],
             ['list', 'To see when: tap this week, later or done.'],
             ['edit', 'To change or remove one: tap it, then Edit or Delete.']),
    connects: 'Functions show on Calendar. Crew comes from Team.' }),
  [roomHref('notes')]: entry(ROOM_DESC.notes, {
    can: how(['add', 'To write a note: tap New note, type it, tap Save Note.'],
             ['read', 'To find a note: type in Search your notes.']),
    connects: 'Notes are yours only. No client sees them.' }),
  [roomHref('calendar')]: entry(ROOM_DESC.calendar, {
    can: how(['calendar', 'To move between months: tap the arrows beside the month.'],
             ['list', 'To see booked weddings as a list: tap Weddings. Month goes back.'],
             ['add', 'To add a shoot or a hold: tap +, then fill in the name, date and type.'],
             ['read', 'To see the busy dates of the season: tap Hot Dates.']),
    connects: 'Bookings from Clients appear here. TDW reads this calendar when a couple asks about a date.' }),
  [roomHref('storefront')]: entry(ROOM_DESC.storefront, {
    can: how(['read', 'To see your page as couples see it: tap See your profile.'],
             ['share', 'To share it: copy your link, thedreamwedding.in/v/ and your name.'],
             ['edit', 'To change the photos on it: tap Portfolio.']),
    connects: 'Built from Portfolio. Couples reach it from your link, Instagram and Google.' }),
  [roomHref('portfolio')]: entry(ROOM_DESC.portfolio, {
    can: how(['add', 'To add photos or films: tap + Upload.'],
             ['list', 'To see where each stands: tap all, approved, pending or rejected.'],
             ['read', 'To check the result: tap See your profile as couples do.']),
    connects: 'Approved work shows on your Storefront and Wedding pages.' }),
  [roomHref('couture')]: entry(ROOM_DESC.couture, {
    can: how(['add', 'To open a time for fittings: tap New Slot, choose the date and time.'],
             ['edit', 'To take a time back: tap Remove on it.']),
    connects: 'Part of the Signature and Prestige plans. Plans are in Billing.' }),
  [roomHref('team')]: entry(ROOM_DESC.team, {
    can: how(['add', 'To add crew: tap +, type the name and role, tap Save.'],
             ['list', 'To switch view: tap Team, Tasks or Payments.'],
             ['money', 'To see what is owed to crew: tap Payments.']),
    connects: 'Crew are assigned to functions in Events.' }),
  [roomHref('contracts')]: entry(ROW_DESC.contracts, {
    can: how(['switch', 'Once, first: tap Set up to set your terms.'],
             ['read', 'To read the agreement before sending: tap See the standard agreement first.'],
             ['send', 'To send one: tap New contract, then From a client or Someone new.'],
             ['add', 'To use your own agreement: tap New contract, then Upload my own PDF.']),
    connects: 'A signed agreement holds the date on Calendar.' }),
  [roomHref('tds')]: entry(ROOM_DESC.tds, {
    can: how(['add', 'To record tax a client held back: tap +, fill it in, tap Log Entry.'],
             ['calendar', 'To see another year: tap the financial year at the top.'],
             ['share', 'For your accountant: tap Export CSV.']),
    connects: 'Read against the payments in Invoices.' }),
  [roomHref('advisor')]: entry(ROOM_DESC.advisor, {
    can: how(['reply', 'Type a question about your business in Ask anything, tap Send.'],
             ['read', 'The answer is read from your own numbers.']),
    connects: 'Reads Invoices, Expenses and Leads. It changes nothing.' }),
  [roomHref('billing')]: entry(ROOM_DESC.billing, {
    can: how(['read', 'See the plan you are on and what it costs.'],
             ['money', 'To change plan: tap Choose on the plan you want.']),
    connects: 'Your plan decides which rooms are open to you.' }),
  [roomHref('settings')]: entry(ROOM_DESC.settings, {
    can: how(['edit', 'To change your details: tap Edit profile.'],
             ['money', 'To change or stop your plan: tap Manage subscription.'],
             ['share', 'To copy a detail: tap Copy beside it.'],
             ['switch', 'To leave this phone: tap Sign out.']),
    connects: 'Every room reads these details.' }),
  [SOLUTIONS_INDEX_HREF]: entry(ROOM_DESC.support, {
    can: how(['list', 'To open a solution: tap its row.'],
             ['read', 'Each row says what it does and whether it is on.']),
    connects: 'Each row opens its own room.' }),
  [NUMBER_HREF]: entry(ROW_DESC.number, {
    can: how(['switch', 'To answer enquiries on your own number: tap Connect.'],
             ['reply', 'Once connected, enquiries on WhatsApp and Instagram are answered for you.']),
    connects: 'Enquiries answered here land in Leads. Dates are checked against Calendar.' }),
  [WEBSITE_HREF]: entry(ROW_DESC.website, {
    can: how(['list', 'Work down the list: add a cover photo, two lines about your work, a starting price.'],
             ['add', 'To show a whole wedding: tap Publish a wedding page.'],
             ['read', 'To check the page: tap See the whole page.'],
             ['share', 'Put your link in your Instagram bio.']),
    connects: 'Built from Storefront and Portfolio. Found on Google shows whether Google lists it.' }),
  [WEDDING_PAGES_HREF]: entry(ROW_DESC.wedding_pages, {
    can: how(['add', 'To make a page for a wedding: tap +, choose the wedding, tap Save.'],
             ['share', 'Share the page with the couple and on Instagram.']),
    connects: 'Built from Portfolio and Events. Google reviews are asked for after a page is published.' }),
  [GOOGLE_REVIEWS_HREF]: entry(ROW_DESC.google, {
    can: how(['send', 'Couples are asked for a Google review after their wedding page is published.'],
             ['list', 'See who was Asked, and the Reviews that came in.'],
             ['read', 'Your seal shows when your reviews are TDW-verified.']),
    connects: 'Asked after Wedding pages.' }),
  [POSTS_HREF]: entry(ROW_DESC.posts, {
    can: how(['list', 'Posts are grouped under Cards and Broadcast.'],
             ['share', 'To post one: tap Share on it.'],
             ['send', 'To boost a post to couples: tap Open Ads.'],
             ['read', 'If something is not ready yet: tap Check again.']),
    connects: 'Drawn from Portfolio and Calendar. Ads opens from here.' }),
  // CE-46 FE-4 carry onto ADS-1 (85c66ef5): the Ads card in the shape of every room. Line 1 stays READ from the
  // Posts & ads row (b140 1.2); ADS-1's accepted three lines keep their one home above, byte for byte: what and pays
  // ride as the card's second paragraph, leads is the connects line; the how-to steps are ADS-1's own four.
  [ADS_HREF]: entry(ROW_DESC.posts, {
    app: ADS_HELP.what + ' ' + ADS_HELP.pays,
    // ADS-1's four lines, VERBATIM, read by ADS-1 from the live page at 85c66ef5 (relayed by the chair 29 Sept 2026).
    // ADS-1's cut1e later updates the first to the restored consent sheet.
    can: how(['switch', 'To start: tap Connect ad account, then Continue to Meta. Meta opens in its own window; come back when it is done.'],
             ['send', 'To run an ad: check the post at the top, tap Change beside Who sees it, Where it appears, Amount or Dates if you want, then tap Run this ad and confirm.'],
             ['read', 'To see it as couples will: the post at the top is shown the way couples see it.'],
             ['edit', 'To stop an ad: tap the ad under Your ads, then Pause this ad or End it now.']),
    connects: ADS_HELP.leads }),
  [DATES_HREF]: entry(ROW_DESC.dates, {
    can: how(['calendar', 'See the dates still open in the season.'],
             ['money', 'To get a price to fill them: tap Suggest rates.']),
    connects: 'Reads Calendar.' }),
  [INTRODUCTIONS_HREF]: entry(ROW_DESC.introductions, {
    can: how(['add', 'To introduce a couple to a peer: type the number and a name.'],
             ['send', 'Tap Review the message to read it before it goes.']),
    connects: 'Introductions you receive arrive in Leads.' }),
  [REFERRALS_HREF]: entry(ROW_DESC.referrals, {
    can: how(['add', 'To pass on a shoot you cannot take: tap Post a shoot.'],
             ['list', 'Peers you work with are listed with what was sent and received.']),
    connects: 'Referrals you receive arrive in Leads. Influencer exchange opens from here.' }),
  [PAYMENT_REMINDERS_HREF]: entry(ROW_DESC.reminders, {
    can: how(['switch', 'Turn reminders on or off with the switch.'],
             ['list', 'Due shows who is owed a reminder. Asked shows who was sent one.']),
    connects: 'Reads unpaid invoices in Invoices.' }),
  [roomHref('collab')]: entry(ROW_DESC.collabs, {
    can: how(['add', 'To ask for crew, models or partners: tap + Post.'],
             ['list', 'Opportunities are posts from others. My Posts are yours.'],
             ['read', 'Roster lists the people you have worked with.']),
    connects: 'Replies to your posts open in their own list.' }),
  '/vendor/collab/[post_id]/responses': entry(TYPED_WHAT.responses, {
    can: how(['read', 'Each reply shows who is interested in your post.'],
             ['reply', 'Tap the arrow at the top to go back to Collab.']),
    connects: 'Back to Collab.' }),
  [EXCHANGE_HREF]: entry(TYPED_WHAT.exchange, {
    can: how(['list', 'To narrow the list: choose a City and a Craft.'],
             ['read', 'Your requests and Requests to you are listed apart.'],
             ['send', 'On a request to you: tap Accept. When it is done: tap Mark completed.'],
             ['edit', 'To take back your own request: tap Withdraw.']),
    connects: 'Reached from Referrals.' }),
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
