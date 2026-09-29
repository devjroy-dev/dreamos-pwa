// lib/worklist/tabs.ts — DESIGN-1 · STAGE 3 · FIVE TABS AND MORE, ONE HOME.
//
// docs/review/REPORT.md §3, "Five tabs", as the founder sanctioned it: Today, Enquiries, Calendar, Clients and Money
// hold the rooms the report lists for each, EXCEPT Billing, which goes under More. More is the profile coin, in the
// founder's groups and order: Your business, Get found, Work together, Messages, Help.
//
// A TAB HOLDS ROOMS. Its seat is lit on every room it holds, and those rooms are listed under the room's head (the
// held-rooms row), so a vendor on Expenses sees Money lit and can step to Invoices, TDS or Books in one tap. A tab's
// first room is where its seat goes. Every address is read from the registry (roomHref) or the solutions routes,
// never typed twice.
import { roomHref } from '@/v2/lib/worklist/rooms';
import {
  PAYMENT_REMINDERS_HREF, REFERRALS_HREF, WEBSITE_HREF, WEDDING_PAGES_HREF, GOOGLE_REVIEWS_HREF, POSTS_HREF,
  EXCHANGE_HREF, INTRODUCTIONS_HREF, NUMBER_HREF, SOLUTIONS_INDEX_HREF,
} from '@/v2/lib/solutions/routes';
import { ENQ } from '@/v2/lib/worklist/enquiryRouting';
import type { RoomKey } from '@/v2/lib/solutions/copy';

export type TabId = 'today' | 'enquiries' | 'calendar' | 'clients' | 'money';

export interface HeldRoom { label: string; href: string }
export interface Tab { id: TabId; label: string; rooms: readonly HeldRoom[] }

/** The Settings section a vendor sets where enquiries go; the Enquiries tab lists it by its own heading. */
export const ENQUIRY_ROUTING_ID = 'enquiry-routing';

/** The five tabs, in the bar's order. Each tab's first room is where its seat goes. */
export const TABS: readonly Tab[] = [
  { id: 'today', label: 'Today', rooms: [
    { label: 'Today', href: '/vendor/today' },
    { label: 'Events', href: roomHref('events') },
  ] },
  { id: 'enquiries', label: 'Enquiries', rooms: [
    { label: 'Enquiries', href: roomHref('leads') },
    { label: 'Referrals', href: REFERRALS_HREF },
    { label: ENQ.label, href: `${roomHref('settings')}#${ENQUIRY_ROUTING_ID}` },
  ] },
  // Blocked dates, good dates and each day's crew are the Calendar's own (its day sheet and its marks), so it holds
  // one room. Open dates & rates is a Business Solutions screen (Help), not the blocked dates.
  { id: 'calendar', label: 'Calendar', rooms: [
    { label: 'Calendar', href: roomHref('calendar') },
  ] },
  { id: 'clients', label: 'Clients', rooms: [
    { label: 'Clients', href: roomHref('clients') },
    { label: 'Contracts', href: roomHref('contracts') },
    { label: 'Notes', href: roomHref('notes') },
  ] },
  { id: 'money', label: 'Money', rooms: [
    { label: 'Invoices', href: roomHref('invoices') },
    { label: 'Payment reminders', href: PAYMENT_REMINDERS_HREF },
    { label: 'Expenses', href: roomHref('expenses') },
    { label: 'TDS', href: roomHref('tds') },
    { label: 'Books', href: roomHref('books') },
  ] },
] as const;

const pathOf = (href: string) => href.split('#')[0];

/** The tab a path belongs to: the tab holding a room whose address the path is, or sits under. A room reached
 *  through an in-page anchor (Where enquiries go, in Settings) does not light a tab: Settings is More's. */
export function tabFor(pathname: string): Tab | null {
  for (const t of TABS) {
    for (const r of t.rooms) {
      if (r.href.includes('#')) continue;
      const p = pathOf(r.href);
      if (pathname === p || pathname.startsWith(p + '/')) return t;
    }
  }
  return null;
}

/** The room of its tab a path is on, for the held-rooms row's current mark. */
export function heldRoomFor(tab: Tab, pathname: string): HeldRoom | null {
  return tab.rooms.find((r) => !r.href.includes('#') && (pathname === pathOf(r.href) || pathname.startsWith(pathOf(r.href) + '/'))) ?? null;
}

// The layout switch: More has its own address in the v2 tree. /vendor/rooms stays today's (main's manifest opens the app
// there), and in the v2 tree it goes to Today, the first tab.
export const MORE_HREF = '/vendor/more';

/** A More row: a room by its address, or Support, which opens TDW on WhatsApp (the drawer's own act). `room` or `row`
 *  names the registry entry whose icon and one line the row reads (lib/worklist/icons.ts, ROOM_DESC, ROW_DESC). */
export type MoreRow = { label: string; href: string; room?: string; row?: RoomKey } | { label: string; act: 'support' };

/** More, in the founder's groups and order. */
export const MORE_GROUPS: readonly { name: string; rows: readonly MoreRow[] }[] = [
  { name: 'Your business', rows: [
    { label: 'Packages', room: 'packages', href: roomHref('packages') },
    { label: 'Team', room: 'team', href: roomHref('team') },
    { label: 'Settings', room: 'settings', href: roomHref('settings') },
    { label: 'Billing', room: 'billing', href: roomHref('billing') },
  ] },
  { name: 'Get found', rows: [
    { label: 'Your website', row: 'website', href: WEBSITE_HREF },
    { label: 'Storefront', room: 'storefront', href: roomHref('storefront') },
    { label: 'Portfolio', room: 'portfolio', href: roomHref('portfolio') },
    { label: 'Wedding pages', row: 'wedding_pages', href: WEDDING_PAGES_HREF },
    { label: 'Google reviews', row: 'google', href: GOOGLE_REVIEWS_HREF },
    { label: 'Posts and ads', row: 'posts', href: POSTS_HREF },
  ] },
  { name: 'Work together', rows: [
    { label: 'Collab', row: 'collabs', href: roomHref('collab') },
    { label: 'Influencer exchange', href: EXCHANGE_HREF },
    { label: 'Introductions', row: 'introductions', href: INTRODUCTIONS_HREF },
    { label: 'Referrals', row: 'referrals', href: REFERRALS_HREF },
  ] },
  { name: 'Messages', rows: [
    { label: 'WhatsApp and Instagram', row: 'number', href: NUMBER_HREF },
  ] },
  { name: 'Help', rows: [
    { label: 'Advisor', room: 'advisor', href: roomHref('advisor') },
    { label: 'Business Solutions', room: 'support', href: SOLUTIONS_INDEX_HREF },
    { label: 'Support', act: 'support' },
  ] },
] as const;

export const TAB_WORDS = {
  more:        'More',
  moreLabel:   'More: your business, getting found, working together, messages and help',
  heldRooms:   (tab: string) => `In ${tab}`,
  account:     'Your account',
} as const;
