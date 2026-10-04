// ADM-1 · the words the people cards use, in one place (and read by the bench).
// "What is lost" is read from the LIVE schema's delete cascade (the founder's Block C and its
// diff, 3 Oct 2026): vendor 79 tables, Dreamer 23. The live database carries seven links the
// migrations do not (contracts, payment_schedules, tds_ledger, team_members, team_messages,
// team_payments, team_tasks) and lacks three they declare (discover_heroes, pending_actions on
// both); the words follow the live database.
import type { AdminVendor } from '@/lib/admin-api/index';

export const VENDOR_LOST = 'Deletes this vendor\'s account and everything in it: leads, clients, events, invoices, payment schedules, expenses, TDS records, payment reminders, packages, contracts sent and signed, portfolio and looks, website, pages and domain, Instagram, WhatsApp, Google and ad connections, ads, chats with the assistant, team members with their tasks, messages and payments, testimonials, collab posts and the Discover request. Payments TDW received stay in the money record. Cannot be undone.';
export const DREAMER_LOST = 'Deletes this Dreamer\'s account and everything in it: saves and mood board, circle, polls and votes, budget and receipts, tasks, bookings, enquiries to vendors, chats with the assistant, and their page. Help requests they made stay, without their name linked. Cannot be undone.';
export const PAID_BLOCK = 'Has a paid plan · cannot be deleted from here';

/** A Dreamer is on a paid plan ONLY when a paid plan is stored (K4, CE-47, 3 Oct 2026). The couples
 *  list door sends no tier today (couples has no tier column), so an absent tier is Basic, never
 *  paid: blocking on `tier !== 'basic'` blocked every Dreamer. */
export function isPaidDreamer(c: { tier?: string | null }): boolean {
  return c.tier === 'gold' || c.tier === 'platinum';
}
