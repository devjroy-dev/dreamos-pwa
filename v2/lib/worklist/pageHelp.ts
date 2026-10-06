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

import { ROOM_DESC } from '@/v2/lib/worklist/copy';
import { ROW_DESC } from '@/v2/lib/solutions/copy';
// EVERY ADDRESS IS READ FROM ITS ONE HOME, never typed here (b42, b69, b73 and tdw07_p4b each forbid a second
// spelling of an address; the differential caught the first two cuts of this file typing them). Rooms read the
// registry (roomHref, lib/worklist/rooms.ts); the solutions rooms read lib/solutions/routes.ts. Three keys have no
// home to read and are typed: /vendor/rooms and /vendor/today (spelled across the shell, owned by no constant) and
// the replies page's route PATTERN, which is a key, not an address anyone links to.
import { roomHref } from '@/v2/lib/worklist/rooms';
import { DATES_HREF, NUMBER_HREF, WEDDING_PAGES_HREF, WEBSITE_HREF, GOOGLE_REVIEWS_HREF, REFERRALS_HREF,
  PAYMENT_REMINDERS_HREF, INTRODUCTIONS_HREF, POSTS_HREF, ADS_HREF, EXCHANGE_HREF, SOLUTIONS_INDEX_HREF,
  REBOOKING_HREF, QUOTES_HREF, PAYMENT_LINKS_HREF, SHOP_HREF, BRANDS_HREF, SUPPLIES_HREF, TRENDS_HREF, PAPERS_HREF, INSURANCE_HREF } from '@/v2/lib/solutions/routes';

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
  // DESIGN-1 · STAGE 5a: the two record pages have no registry line of their own
  enquiry:   'One enquiry, whole: who, when, the money and everything said so far',
  client:    'One client, whole: the dates, the money and the story so far',
  // DESIGN-1 · STAGE 5b
  invoice:   'One invoice, whole: what it asks for, what has come in, and each payment and reminder',
  event:     'One event, whole: the day, the crew, the client and the booking behind it',
  rooms:     'Every part of the app, in groups',
  today:     'Your day: a date to check, enquiries to answer, today\u2019s functions and money due',
  exchange:  'Influencers and their audience, and the requests you send them', // CE-47 L4 (FE-7): was the retired gear-trade line
  responses: 'Replies to one collab post',
} as const;

// CE-46 ADS-1 · the Ads page's three lines (accepted by the chair 28 September 2026; FE-4's note: they go here, their one
// home). Line 1 of the Ads card is READ from the Posts & ads row (ROW_DESC.posts), b140 1.2's rule: typed line 1s stay four;
// these three are the card's "can" lines.
const ADS_HELP = {
  what:  'Boosting shows one of your Instagram or Facebook posts to people in your city who are planning a wedding, for a daily amount you set and a number of days you choose.',
  pays:  'Meta takes the amount from your ad account\u2019s payment method. TDW never charges for ads and never runs one without your tap.',   // cut1e 5, the founder's ok (29 September 2026)
  // LANDING (conflict 1, main's words kept for what and pays; leads names the new layout's own tab, Enquiries, and 'this page')
  leads: 'People who write after seeing the ad land in Enquiries, and this page tells you what each ad reached, what it cost, and what to try next.',
} as const;

// DESIGN-1 · STAGE 2 · THE PORTFOLIO'S EXPLANATIONS, MOVED OFF THE PAGE (the founder, 29 Sept 2026: "make the photos the
// page"). The founder-vetted bytes of app/vendor/(shell)/portfolio/screen.tsx's COPY, word for word, their one home now;
// the screen reads H2 and H12 from here. H3, G1 and G3 are read ON THE PAGE (the founder's correction of 29 Sept 2026 on H3;
// tdw07_p3 pins G1 and G3 as rendered by the reorder state), so they are not repeated here. None is reworded.
export const PORTFOLIO_HELP = {
  H2: "Instagram only allows this for professional accounts (business or creator). If yours is personal, switching is free and takes a minute in Instagram’s own settings.",
  F4: 'People see your approved photos. The rest are with our team.',
  H12: 'Photos are copied into your portfolio, so they stay put even if your Instagram changes.',
} as const;

// DESIGN-1 · STAGE 2: the Collab responses page's explanation, moved off the page word for word (it was typed inline in
// app/vendor/(shell)/collab/[post_id]/responses/screen.tsx, above the list).
export const RESPONSES_HELP = {
  identity: 'Their identity is revealed to you because you posted the requirement. Tap Connect to share contact details with both of you.',
} as const;

// CE-47 hub cut r2: the one connects line for a room not yet open (b140_v2 1.8). True and plain; one home.
const COMING_CONNECTS = 'Nothing connects here yet. It will when this room opens.';

const entry = (what: string, extra: Partial<PageHelp> = {}): PageHelp =>
  ({ what, can: HELD, connects: '', ...extra });
const how = (...steps: [HelpIcon, string][]): { icon: HelpIcon; line: string }[] => steps.map(([icon, line]) => ({ icon, line }));

// ── LANDING (conflict 2, CE-46 FE-4 onto the new layout) ────────────────────────────────────────────────────────────
// Main's FE-4 gave every room's card how-to steps naming the real buttons (28 Sept 2026). Where the new layout draws the
// room as main does (restyled only), its card here IS main's, word for word. Where the new layout reworked the room
// (More, Today, Enquiries, Clients, Invoices, Events, Calendar, Portfolio, the Collab responses and the record pages), its
// card names the new screen's own buttons, as the founder's rule asks; main's steps would name buttons that are not there.
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
    // DESIGN-1 · STAGE 5a: an enquiry opens as its own page (its own card, below)
    { icon: 'reply', line: 'Tap an enquiry to open its page: the dates, money, notes and history, with the next step on top.' },
    { icon: 'add', line: 'Swipe an enquiry right to book it. + New enquiry, beside the page\u2019s name, adds one.' },
  ], connects: 'A booked enquiry becomes a client in Clients, its dates go on your Calendar and its invoice into Money.' }),
  [roomHref('packages')]: entry(ROOM_DESC.packages, {
    // CE-47 FE-6 L5: the reworked room; three lines, each button drawn on the room or its sheet.
    can: how(['add', 'To add a package: tap New package, give it a name and price.'],
             ['edit', 'To change one: tap it, then Edit.'],
             ['switch', 'To choose the one quotes start from: tap it, then Set as default.']),
    connects: 'You quote these to leads, and a booked package goes on the client.' }),
  [roomHref('clients')]: entry(ROOM_DESC.clients, { can: [
    { icon: 'list', line: 'Search clients. Each card shows what has come in and what is still due.' },
    // DESIGN-1 · STAGE 5a: a client opens as its own page (its own card, below)
    { icon: 'read', line: 'Tap a client to open their page: the dates, money, notes and history, with the next step on top.' },
    { icon: 'add', line: '+ New client, beside the page\u2019s name, adds a client who booked without an enquiry.' },
  ], connects: 'A client\u2019s invoices are in Money and the dates are on your Calendar.' }),
  [roomHref('invoices')]: entry(ROOM_DESC.invoices, { can: [
    { icon: 'list', line: 'Search invoices, or tap Overdue, Unpaid or Part paid to see only those. Recent changes the order.' },
    // DESIGN-1 · STAGE 5b: an invoice opens as its own page (its own card, below)
    { icon: 'money', line: 'Mark paid records a payment on that invoice. Tap an invoice to open its page.' },
    { icon: 'add', line: '+ New invoice, beside the page\u2019s name, makes an invoice.' },   // the founder (option B): the + in the room head
  ], connects: 'The row under the heading opens the rest of Money: Payment reminders, Expenses, TDS and Books.' }),
  [roomHref('expenses')]: entry(ROOM_DESC.expenses, {
    can: how(['add', 'To add one: tap + New expense.'],
             ['edit', 'To change one: tap it.'],
             ['calendar', 'To see another month: tap the month.']),
    connects: 'Connects to Books and TDS.' }),
  [roomHref('books')]: entry(ROOM_DESC.books, {
    can: how(['read', 'Received and Outstanding come from your invoices.'],
             ['list', 'Paid out comes from your expenses.']),
    connects: 'Connects to Invoices and Expenses.' }),
  // DESIGN-1 · STAGE 5b: an event opens as its own page (its own card, below)
  [roomHref('events')]: entry(ROOM_DESC.events, { can: [
    { icon: 'list', line: 'Search events, or tap This week, Later or Done to see only those. Recent changes the order.' },
    { icon: 'read', line: 'Tap an event to open its page: the day, the crew, the money and the history, with the next step on top.' },
    { icon: 'add', line: 'Swipe an event right to mark it done, or left to cancel it. + New event, beside the page\u2019s name, adds one.' },
  ], connects: 'Every event is on your Calendar too, and a booking puts each of its dates here.' }),
  [roomHref('notes')]: entry(ROOM_DESC.notes, {
    can: how(['add', 'To write a note: tap + New note, type it, tap Save note.'],
             ['read', 'To find a note: type in Search your notes. Tap a note to read it whole.'],
             ['edit', 'To delete a note: open it and tap Delete. It asks first.']),
    connects: 'Notes are yours only. No client sees them.' }),
  [roomHref('calendar')]: entry(ROOM_DESC.calendar, { can: [
    { icon: 'calendar', line: 'Month shows the dates and Weddings lists each wedding. The arrows move a month; Good dates shows or hides the good dates.' },
    // LANDING: reworded for main's step reader (A-46.9), which read "to block it" as a button; the facts are unchanged
    { icon: 'list', line: 'Tap a day: it shows what is on it, and you can block it there. Coming up lists the next functions.' },
    { icon: 'add', line: '+ New event, beside the page\u2019s name, adds an event.' },
  ], connects: 'Every booking puts each of its dates here as its own event.' }),
  [roomHref('storefront')]: entry(ROOM_DESC.storefront, {
    // CE-47 FE-6 L5: the reworked room; three lines, each button drawn; no "couple" (the founder's rule).
    can: how(['read', 'To see your page as people see it: tap See your profile.'],
             ['share', 'To share it: tap Copy on your address.'],
             ['edit', 'To raise your profile strength: tap a row under What to add.']),
    connects: 'Built from Portfolio. People reach it from your link, Instagram and Google.' }),
  // Each line names only what the page draws: Upload and the Instagram button beside it, the All filter, the photos.
  [roomHref('portfolio')]: entry(ROOM_DESC.portfolio, { can: [
    { icon: 'add', line: PORTFOLIO_HELP.H2 },
    { icon: 'read', line: PORTFOLIO_HELP.F4 },
  ], connects: PORTFOLIO_HELP.H12 }),
  [roomHref('couture')]: entry(ROOM_DESC.couture, {
    // CE-47 FE-6 L3: the reworked room (FE-4's findings aligned with W3; the pill reads "+ New slot"). Three lines at most.
    can: how(['add', 'On the Signature or Prestige plan: tap New slot, choose the date and time.'],
             ['edit', 'To remove an open slot: tap it, then Remove this slot.'],
             ['read', 'Without the plan: tap See plans in Billing on this page.']),
    connects: 'Connects to Billing.' }),
  [roomHref('team')]: entry(ROOM_DESC.team, {
    can: how(['add', 'To add crew: on Team, tap Add to Team, type the name and role, tap Save.'],
             ['list', 'To switch view: tap Team, Tasks or Payments.'],
             ['money', 'To see what is owed to crew: tap Payments.']),
    connects: 'Crew are assigned to functions in Events.' }),
  [roomHref('contracts')]: entry(ROW_DESC.contracts, {
    // CE-47 FE-6 L3: the reworked room (the chair's yes on FE-6's drafts); three lines at most, each button drawn.
    can: how(['send', 'To start one: tap New contract, then From a client or Someone new.'],
             ['switch', 'To fill your standard terms once: tap Your contract policies.'],
             ['read', 'To send, copy the link or cancel: tap the agreement.']),
    connects: 'A signed agreement holds the date on Calendar.' }),
  [roomHref('tds')]: entry(ROOM_DESC.tds, {
    can: how(['add', 'To add one: tap + New TDS entry.'],
             ['calendar', 'To see another year: tap the year.'],
             ['share', 'To send it to your accountant: tap Export CSV.']),
    connects: 'Connects to Invoices and Books.' }),
  [roomHref('advisor')]: entry(ROOM_DESC.advisor, {
    can: how(['reply', 'Type a question about your business in Ask anything, tap Send.'],
             ['read', 'The answer is read from your own numbers.']),
    connects: 'Reads Invoices, Expenses and Enquiries. It changes nothing.' }),
  [roomHref('billing')]: entry(ROOM_DESC.billing, {
    can: how(['read', 'See the plan you are on and what it costs.'],
             ['money', 'To change plan: tap Choose on the plan you want.']),
    connects: 'Your plan decides which rooms are open to you.' }),
  [roomHref('settings')]: entry(ROOM_DESC.settings, {
    can: how(['edit', 'To change a section: tap its row.'],
             ['switch', 'To turn a setting on or off: tap its switch.'],
             ['send', 'To change where enquiries go: tap Where enquiries go.']),
    connects: 'Connects to every room.' }),
  [SOLUTIONS_INDEX_HREF]: entry(ROOM_DESC.support, {
    can: how(['list', 'To open a solution: tap its row. Each row says what the room does.'],
             ['reply', 'Something broken? Tap it to message us on WhatsApp.']),
    connects: 'Each row opens its own room.' }),
  [NUMBER_HREF]: entry(ROW_DESC.number, {
    can: how(['switch', 'To answer enquiries on your own number: tap Connect.'],
             ['reply', 'Once connected, enquiries on WhatsApp and Instagram are answered for you.']),
    connects: 'Enquiries answered here land in Enquiries. Dates are checked against Calendar.' }),
  [WEBSITE_HREF]: entry(ROW_DESC.website, {
    can: how(['list', 'To change how the website looks: tap Style. Colours and type has its own row under it.'],
             ['add', 'To add work: tap Looks, then + New look.'],
             ['share', 'When the preview is right: tap Publish.']),
    connects: 'Prices on the website follow Show prices on the website.' }),
  [WEDDING_PAGES_HREF]: entry(ROW_DESC.wedding_pages, {
    can: how(['add', 'Tap + New wedding page, choose the event, give it a title, tap Save.'],
             ['edit', 'To add photographs and credits: tap a wedding.'],
             ['send', 'Under Permission, type the client\u2019s number and tap Ask for permission. The page goes live when they agree.']),
    connects: 'Built from Events.' }),
  [GOOGLE_REVIEWS_HREF]: entry(ROW_DESC.google, {
    can: how(['send', 'When a wedding page goes live, the client is asked once for a Google review.'],
             ['read', 'Your seal shows TDW-verified after three delivered weddings. It is counted every night.'],
             ['calendar', 'Claim and sync your listing reads Coming soon until Google allows it.']),
    connects: 'Asked after Wedding pages.' }),
  // CE-46 FE-6 cut 1: the reworked room's card, the chair's yes on FE-6's drafts (30 Sept 2026), FE-4's finding
  // applied (Share sits BESIDE Download on this screen). Every button a step names is drawn on the room.
  [POSTS_HREF]: entry(ROW_DESC.posts, {
    // three how-to lines at most (the room-rework standard, 30 Sept 2026: nothing scrolls inside a "?" card at 374); the
    // caption's Copy is named on its own box and is not a step here
    can: how(['share', 'To post one: tap Download or Share beside it.'],
             ['send', 'To run or see your ads: tap the row under Ads.'],
             ['send', 'To send a message to past clients: tap Newest work message or Referral message.']),
    connects: 'Connects to your wedding pages and your Meta ad account.' }),
  [ADS_HREF]: entry(ROW_DESC.posts, {
    app: ADS_HELP.what + ' ' + ADS_HELP.pays,
    // ADS-1's four lines, VERBATIM, read by ADS-1 from the live page at 85c66ef5 (relayed by the chair 29 Sept 2026).
    // ADS-1's cut1e later updates the first to the restored consent sheet.
    can: how(['switch', 'To start: tap Connect ad account, then Continue to Meta. Meta opens in its own window; come back when it is done.'],
             ['send', 'To run an ad: check the post at the top, tap Change beside Who sees it, Where it appears, Amount or Dates if you want, then tap Run this ad and confirm.'],
             ['read', 'To see it as people will: the post at the top is shown the way people see it.'],
             ['edit', 'To stop an ad: tap the ad under Your ads, then Pause this ad or End it now.']),
    connects: ADS_HELP.leads }),
  // CE-47 · THE HUB CUT (INS): the nine Coming rooms' cards. `what` is the row's ruled line (one home); the one step says
  // what the screen draws. Each seat writes its room's own card when its room lands, in the same edit as its page.
  // r2 (b140_v2 1.8, the product's own rule: every surface says what it connects to): one true line for all nine, one home.
  [REBOOKING_HREF]: entry(ROW_DESC.rebooking, { can: how(['read', 'This room is not open yet. It reads Coming in Business Solutions until it opens.']), connects: COMING_CONNECTS }),
  [QUOTES_HREF]: entry(ROW_DESC.quotes, { can: how(['read', 'This room is not open yet. It reads Coming in Business Solutions until it opens.']), connects: COMING_CONNECTS }),
  [PAYMENT_LINKS_HREF]: entry(ROW_DESC.payment_links, { can: how(['read', 'This room is not open yet. It reads Coming in Business Solutions until it opens.']), connects: COMING_CONNECTS }),
  [SHOP_HREF]: entry(ROW_DESC.shop, { can: how(['read', 'This room is not open yet. It reads Coming in Business Solutions until it opens.']), connects: COMING_CONNECTS }),
  [BRANDS_HREF]: entry(ROW_DESC.brands, { can: how(['read', 'This room is not open yet. It reads Coming in Business Solutions until it opens.']), connects: COMING_CONNECTS }),
  [SUPPLIES_HREF]: entry(ROW_DESC.supplies, { can: how(['read', 'This room is not open yet. It reads Coming in Business Solutions until it opens.']), connects: COMING_CONNECTS }),
  [TRENDS_HREF]: entry(ROW_DESC.trends, { can: how(['read', 'This room is not open yet. It reads Coming in Business Solutions until it opens.']), connects: COMING_CONNECTS }),
  [PAPERS_HREF]: entry(ROW_DESC.papers, { can: how(['read', 'This room is not open yet. It reads Coming in Business Solutions until it opens.']), connects: COMING_CONNECTS }),
  [INSURANCE_HREF]: entry(ROW_DESC.insurance, { can: how(['read', 'This room is not open yet. It reads Coming in Business Solutions until it opens.']), connects: COMING_CONNECTS }),
  [DATES_HREF]: entry(ROW_DESC.dates, {
    can: how(['calendar', 'How often each date was checked is in Storefront: tap the first row.'],
             ['read', 'Offer your open dates and Suggested rates read Coming soon until they open.']),
    connects: 'Date checks are shown in Storefront.' }),
  [INTRODUCTIONS_HREF]: entry(ROW_DESC.introductions, {
    can: how(['add', 'Tap New introduction; fill in their number, name and where you met; tap Review the message.'],
             ['send', 'Read what they will receive, then tap the button with their name on it.'],
             ['list', 'Sent shows each as Delivered, Sent or Not delivered.']),
    connects: 'The message carries a See my work button.' }),
  [REFERRALS_HREF]: entry(ROW_DESC.referrals, {
    can: how(['list', 'Sent and Received count every forward; Your peers lists each peer with what went both ways.'],
             ['add', 'To pass on a shoot you cannot take: tap Post a shoot.'],
             ['send', 'To forward an enquiry: open it in Enquiries and tap Forward to a peer.']),
    connects: 'Forwards you receive arrive in Enquiries. Influencer exchange opens from here.' }),
  [PAYMENT_REMINDERS_HREF]: entry(ROW_DESC.reminders, {
    can: how(['switch', 'To stop the automatic ones: tap the switch beside Send the rest automatically.'],
             ['read', 'Sent means WhatsApp accepted it; we cannot tell whether it was read.']),
    connects: 'Connects to Invoices.' }),
  [roomHref('collab')]: entry(ROW_DESC.collabs, {
    // CE-47 FE-6 L5: the reworked room; the pill's words, each button drawn
    can: how(['add', 'To ask for crew, models or partners: tap New post.'],
             ['list', 'Opportunities are posts from others. My posts are yours.'],
             ['read', 'To add someone you have worked with: open Roster, tap Add someone.']),
    connects: 'Replies to your posts open in their own list.' }),
  // LANDING: main's rule (1.8), every card has a connects line
  '/vendor/collab/[post_id]/responses':     entry(TYPED_WHAT.responses, { can: [{ icon: 'share', line: RESPONSES_HELP.identity }], connects: 'These are the replies to your post in Collab.' }),
  [EXCHANGE_HREF]: entry(TYPED_WHAT.exchange, {
    can: how(['list', 'Choose a City and a Craft to narrow the list.'],
             ['send', 'Tap an influencer, then tap Send request.'],
             ['edit', 'To mark a request completed or withdrawn: tap it under Your requests. Withdraw asks first.']),
    connects: 'Verified means Instagram confirmed their audience.' }),
  // DESIGN-1 · STAGE 5a · RECORDS AS PAGES (lib/worklist/record.ts): each names only what its page draws
  '/vendor/leads/[id]': entry(TYPED_WHAT.enquiry, { can: [
    { icon: 'send', line: 'The button on top is the next step: Reply on WhatsApp for a new enquiry, Book for one you are talking to, Open the client once booked.' },
    { icon: 'list', line: 'Dates, Money, Notes and History read top to bottom. History has every message, invoice and date, newest first.' },
    { icon: 'edit', line: 'At the end: WhatsApp, Call, Attach package and Mark lost.' },
  ], connects: 'Back to Enquiries returns to the list where you left it. Book puts the dates on your Calendar and the invoice in Money.' }),
  '/vendor/clients/[id]': entry(TYPED_WHAT.client, { can: [
    { icon: 'money', line: 'The button on top is the next step: Open the invoice while money is due, otherwise Message on WhatsApp.' },
    { icon: 'list', line: 'Dates, Money, Notes and History read top to bottom. History has the messages, invoices, dates and notes, newest first.' },
    { icon: 'edit', line: 'At the end: Enquiries (when one enquiry has this number), Ask in chat, Edit, Hide and, for a booked client, Cancel booking.' },
  ], connects: 'Back to Clients returns to the list where you left it.' }),
  // DESIGN-1 · STAGE 5b · the invoice and the event (components/vendor/records/SliceRecord.tsx)
  '/vendor/invoices/[id]': entry(TYPED_WHAT.invoice, { can: [
    { icon: 'send', line: 'The button on top is the next step: Send on WhatsApp sends the invoice to the client. With no number it is Download PDF.' },
    { icon: 'money', line: 'Money shows the total, what has come in and what is still due. Under it, the payment schedule: Add makes one; on each part, Remind, Edit and Paid; Remove schedule takes it off.' },
    { icon: 'edit', line: 'At the end: Download PDF, Mark paid, Enquiry and Client (when one has this number), Ask in chat, Edit and Cancel invoice.' },
  ], connects: 'Back to Invoices returns to the list where you left it. A reminder you send is kept in Payment reminders.' }),
  '/vendor/events/[id]': entry(TYPED_WHAT.event, { can: [
    { icon: 'calendar', line: 'The button on top is the next step: Mark done once the day has come, or Open the client before it.' },
    { icon: 'list', line: 'Dates has the day, the time and the crew. Money is the client\u2019s: what has come in and what is still due. History is the booking\u2019s, newest first.' },
    { icon: 'edit', line: 'At the end: Mark done, Enquiry, Client, Ask in chat, Edit and Cancel event.' },
  ], connects: 'Back to Events returns to the list where you left it. The event is on your Calendar too.' }),
};

/** The dynamic routes (a collab's responses; stage 5a's enquiry and client pages), folded onto their patterns. Anything else keys by its own pathname. */
export function helpKey(pathname: string): string {
  const m = pathname.match(/^\/vendor\/collab\/[^/]+\/responses\/?$/);
  if (m) return '/vendor/collab/[post_id]/responses';
  // DESIGN-1 · STAGE 5a: the two record pages fold onto their patterns too
  if (/^\/vendor\/leads\/[^/[]+\/?$/.test(pathname)) return '/vendor/leads/[id]';
  if (/^\/vendor\/clients\/[^/[]+\/?$/.test(pathname)) return '/vendor/clients/[id]';
  // DESIGN-1 · STAGE 5b: and the invoice's and the event's
  if (/^\/vendor\/invoices\/[^/[]+\/?$/.test(pathname)) return '/vendor/invoices/[id]';
  if (/^\/vendor\/events\/[^/[]+\/?$/.test(pathname)) return '/vendor/events/[id]';
  return pathname.replace(/\/+$/, '') || pathname;
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
  // CE-46 (FE-5): the search's own card retired with its "?" (one "?" per page, the room head's)
  book: { title: 'Book', help: entry('Book turns an enquiry into a client in one step: the dates, the package and the invoice together.', { can: [
    { icon: 'calendar', line: 'Each date goes on your calendar as its own event. Add a date for each function.' },
    { icon: 'money', line: 'With a package attached, its payment plan is shown and Change plan edits it. With none, pick one, or No package, enter an amount.' },
    { icon: 'send', line: 'Confirm booking makes the invoice. Then the confirmation is ready: Copy it or Send on WhatsApp. Nothing is sent unless you tap. Undo takes it all back for ten seconds.' },
  ], connects: 'The client appears in Clients, the dates on your Calendar and the invoice in Money.' }) },
  cancelBooking: { title: 'Cancel booking', help: entry('Cancel booking takes a client back to your enquiries.', { can: [
    { icon: 'calendar', line: 'Tick the dates line to take the booking\u2019s dates off your calendar.' },
    { icon: 'money', line: 'Tick the invoice line to remove the unpaid invoice. An invoice with payments on it stays.' },
    { icon: 'read', line: 'Nothing is removed unless you tick it. Keep booking closes this with no change.' },
  ], connects: 'The client stays in Enquiries, ready to book again.' }) },
} as const;
