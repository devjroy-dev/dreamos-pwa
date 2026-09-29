// lib/worklist/record.ts · DESIGN-1 · STAGE 5a · RECORDS AS PAGES: the enquiry and the client (the founder).
//
// A record is a full page, top to bottom: its name and status; the next action as ONE button; its dates; its money;
// its notes; its history. Quick jobs (book it, attach a package, edit, cancel a booking) are small sheets opened from
// the page, one at a time. Back returns to the same list at the same scroll position (saveListScroll / takeListScroll,
// read by the shell). One home for the pages' words and the little they derive, so a bench reads what the pages read.
import { formatRs } from '@/lib/vendor/format';
import { packageDate } from '@/v2/lib/worklist/packages';
import { phoneKey } from '@/v2/lib/vendor/cabinet';

export const enquiryHref = (id: string) => `/vendor/leads/${encodeURIComponent(id)}`;
export const clientHref = (id: string) => `/vendor/clients/${encodeURIComponent(id)}`;
/** The pages' route patterns (their "?" cards key on these). */
export const ENQUIRY_ROUTE = '/vendor/leads/[id]';
export const CLIENT_ROUTE = '/vendor/clients/[id]';

export const RECORD = {
  back: (list: string) => `Back to ${list}`,
  enquiries: 'Enquiries',
  clients: 'Clients',
  datesHead: 'Dates',
  moneyHead: 'Money',
  notesHead: 'Notes',
  historyHead: 'History',
  moreHead: 'More',
  none: 'Nothing yet.',
  notFound: 'This record is not here any more.',
  reading: 'Reading…',
  // the next action, one button
  replyWa: 'Reply on WhatsApp',
  book: 'Book',
  openClient: 'Open the client',
  openInvoice: 'Open the invoice',
  messageWa: 'Message on WhatsApp',
  // enquiry facts
  weddingDate: 'Wedding date',
  received: 'Enquiry received',
  city: 'City',
  budget: 'Budget',
  pkg: 'Package',
  plan: 'Payment plan',
  noPackage: 'No package yet.',
  source: 'Came from',
  // client facts
  total: 'Total',
  received$: 'Received',
  due: 'Still due',
  stage: 'Stage',
  // actions on the page
  whatsapp: 'WhatsApp',
  call: 'Call',
  attach: 'Attach package',
  change: 'Change package',
  markLost: 'Mark lost',
  markLostSure: 'Mark lost: sure?',
  lostDone: 'Marked lost.',
  askChat: 'Ask in chat',
  edit: 'Edit',
  hide: 'Hide',
  hideSure: 'Hide: sure?',
  hidden: (name: string) => `${name} hidden.`,
  restored: 'Restored.',
  // history lines
  hFrom: 'From them',
  hTo: 'From you',
  hReceived: 'Enquiry received',
  hEvent: (title: string) => `On the calendar: ${title}`,
  hInvoice: (n: string, amount: number) => `Invoice ${n}, ${formatRs(amount)}`,
  hNote: 'Note',
  statusOf: (state: string) => state ? state.charAt(0).toUpperCase() + state.slice(1) : '',
} as const;

export type NextAction = { kind: 'reply' | 'book' | 'client' | 'invoice' | 'message'; label: string } | null;

/** The one next action on an enquiry, from its state: answer a new one, book one in talks, open a booked one's client. */
export function enquiryNext(state: string | null | undefined, hasPhone: boolean): NextAction {
  const s = String(state || '').toLowerCase();
  if (s === 'lost') return null;
  if (s === 'booked') return { kind: 'client', label: RECORD.openClient };
  if (s === 'new' && hasPhone) return { kind: 'reply', label: RECORD.replyWa };
  return { kind: 'book', label: RECORD.book };
}

/** The one next action on a client: money still due opens the invoice; otherwise a message, when there is a number. */
export function clientNext(pending: number | null | undefined, hasPhone: boolean): NextAction {
  if ((pending ?? 0) > 0) return { kind: 'invoice', label: RECORD.openInvoice };
  return hasPhone ? { kind: 'message', label: RECORD.messageWa } : null;
}

export type HistoryItem = { at: string; kind: 'in' | 'out' | 'received' | 'event' | 'invoice' | 'note'; text: string };

/** One history, newest first, from what the record's reads already carry. Items without a date sit at the end. */
export function historyOf(p: {
  created_at?: string | null;
  conversation?: ReadonlyArray<{ direction: 'inbound' | 'outbound'; body: string; created_at: string }>;
  events?: ReadonlyArray<{ title: string; event_date: string }>;
  invoices?: ReadonlyArray<{ invoice_number: string; amount_total: number; created_at: string }>;
  notes?: readonly string[];
}): HistoryItem[] {
  const out: HistoryItem[] = [];
  for (const m of p.conversation || []) out.push({ at: m.created_at, kind: m.direction === 'inbound' ? 'in' : 'out', text: m.body });
  for (const e of p.events || []) out.push({ at: e.event_date, kind: 'event', text: RECORD.hEvent(e.title) });
  for (const i of p.invoices || []) out.push({ at: i.created_at, kind: 'invoice', text: RECORD.hInvoice(i.invoice_number, i.amount_total) });
  if (p.created_at) out.push({ at: p.created_at, kind: 'received', text: RECORD.hReceived });
  const dated = out.filter((x) => x.at).sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
  return [...dated, ...(p.notes || []).map((n) => ({ at: '', kind: 'note' as const, text: n }))];
}

/** THE CLIENT'S LEAD (the founder): matched by the normalised number, the estate's own fold (phoneKey, the R1(b) key),
 *  and linked ONLY when exactly one lead has it. None, or two or more sharing the number, links nothing rather than
 *  guess; a client or a lead with no usable number never matches. */
export function linkedLeadFor<T extends { phone: string | null | undefined }>(clientPhone: string | null | undefined, leads: readonly T[]): T | null {
  const k = phoneKey(clientPhone);
  if (!k) return null;
  const hits = leads.filter((l) => phoneKey(l.phone) === k);
  return hits.length === 1 ? hits[0] : null;
}

/** A day for the page: "22 December 2026" (the time of a timestamp is dropped). */
export const dayOf = (iso: string | null | undefined) => (iso ? packageDate(String(iso).slice(0, 10)) : '');

// ── BACK TO THE SAME LIST AT THE SAME SCROLL ────────────────────────────────────────────────────────────────────────
// The list saves where its scroller (main.wl-main) stood as it opens a record; the shell, mounting that list again,
// takes the position once and puts it back when the rows have drawn. Per tab (sessionStorage), never across a reload.
const KEY = (list: string) => `tdw_list_scroll:${list}`;
export function saveListScroll(list: string): void {
  try { const m = document.querySelector('main.wl-main'); if (m) sessionStorage.setItem(KEY(list), String(Math.round((m as HTMLElement).scrollTop))); } catch { /* fine without */ }
}
export function takeListScroll(list: string): number | null {
  try { const v = sessionStorage.getItem(KEY(list)); if (v == null) return null; sessionStorage.removeItem(KEY(list)); const n = Number(v); return Number.isFinite(n) ? n : null; } catch { return null; }
}
