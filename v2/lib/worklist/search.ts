// lib/worklist/search.ts · DESIGN-1 · STAGE 3 · THE UNIVERSAL SEARCH, the pwa's half (the founder and the chair).
//
// One box at the top of every tab. Her records come from the search door (dream-os GET /api/v2/vendor/search, her own
// rows only, grouped by kind); the TOOLS are matched here, because the rooms are the pwa's: "website", "TDS", "ads"
// open that room. When what she typed reads as a question, the last row offers to ask TDW with her words. An empty box
// shows her recent searches (this phone only). Pure, so the bench drives it directly.
import { TABS, MORE_GROUPS } from '@/v2/lib/worklist/tabs';
import { roomHref } from '@/v2/lib/worklist/rooms';

export type ResultKind = 'tools' | 'enquiries' | 'clients' | 'events' | 'invoices' | 'packages' | 'notes' | 'crew';

export const SEARCH_WORDS = {
  label: 'Search',
  placeholder: 'Search or ask',
  clear: 'Clear',
  recent: 'Recent searches',
  none: 'Nothing found.',
  unavailable: 'Search is unavailable right now. Tools are still listed.',
  ask: 'Ask TDW about this',
  more: (n: number) => `${n} more in the room`,
  kinds: {
    tools: 'Tools', enquiries: 'Enquiries', clients: 'Clients', events: 'Events', invoices: 'Invoices',
    packages: 'Packages', notes: 'Notes', crew: 'Crew',
  } as Record<ResultKind, string>,
} as const;

export const RECENT_KEY = 'tdw_recent_searches';
export const RECENT_MAX = 6;
export const MIN_CHARS = 2;

// the other words she might use for a tool, beside its own name
const TOOL_WORDS: Record<string, readonly string[]> = {
  'Your website': ['website', 'site', 'web', 'domain'],
  'TDS': ['tds', 'tax', 'deducted'],
  'Posts and ads': ['ads', 'advert', 'adverts', 'posts', 'promote', 'boost'],
  'Google reviews': ['reviews', 'review', 'google', 'rating', 'ratings'],
  'Portfolio': ['photos', 'pictures', 'gallery', 'portfolio', 'work'],
  'Packages': ['packages', 'pricing', 'prices', 'rates', 'quote'],
  'Invoices': ['invoice', 'invoices', 'bill', 'bills'],
  'Payment reminders': ['reminder', 'reminders', 'payment', 'dues'],
  'Expenses': ['expense', 'expenses', 'spend', 'spent'],
  'Books': ['books', 'accounts', 'ledger', 'profit'],
  'Calendar': ['calendar', 'dates', 'date', 'availability', 'block'],
  'Team': ['team', 'crew', 'staff', 'assistant'],
  'WhatsApp and Instagram': ['whatsapp', 'instagram', 'number', 'messages', 'dm'],
  'Billing': ['billing', 'plan', 'subscription', 'pay tdw'],
  'Settings': ['settings', 'profile', 'account'],
  'Enquiries': ['enquiries', 'enquiry', 'leads', 'lead'],
  'Clients': ['clients', 'client', 'couples'],
  'Contracts': ['contract', 'contracts', 'agreement'],
  'Notes': ['notes', 'note'],
  'Events': ['events', 'event', 'functions'],
};

export interface Tool { label: string; href: string; words: readonly string[] }

/** Every room she can open, once each: the five tabs' rooms, then More's (Support is an act, not a room). */
export function tools(): Tool[] {
  const out: Tool[] = []; const seen = new Set<string>();
  const add = (label: string, href: string) => {
    if (seen.has(href)) return; seen.add(href);
    out.push({ label, href, words: [...label.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean), ...(TOOL_WORDS[label] || [])] });
  };
  for (const t of TABS) for (const r of t.rooms) add(r.label, r.href);
  for (const g of MORE_GROUPS) for (const r of g.rows) if ('href' in r) add(r.label, r.href);
  return out;
}

const plainWords = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^a-z0-9]+/).filter(Boolean);

/** The tools whose name or other words start with every word she typed (at most three). */
export function matchTools(q: string, list: Tool[] = tools()): Tool[] {
  const qs = plainWords(q).filter((w) => !QUESTION_WORDS.has(w) && !FILLER.has(w));
  if (!qs.length) return [];
  return list.filter((t) => qs.every((w) => t.words.some((tw) => tw.startsWith(w) || (w.length >= 4 && tw.startsWith(w.slice(0, -1)))))).slice(0, 3);
}

const QUESTION_WORDS = new Set(['how', 'what', 'why', 'when', 'where', 'who', 'which', 'can', 'could', 'should', 'would', 'do', 'does', 'did', 'is', 'are', 'will', 'shall', 'may', 'help']);
const FILLER = new Set(['my', 'the', 'a', 'an', 'i', 'me', 'to', 'for', 'of', 'in', 'on']);

/** It reads as a question: it ends in a question mark, or it starts with a question word and has three words or more. */
export function isQuestion(q: string): boolean {
  const t = q.trim();
  if (!t) return false;
  if (/\?\s*$/.test(t)) return true;
  const w = plainWords(t);
  return w.length >= 3 && QUESTION_WORDS.has(w[0]);
}

/** Where a found record opens: its room, with the record's key where the room reads one. */
export function recordHref(kind: Exclude<ResultKind, 'tools'>, id: string): string {
  const enc = encodeURIComponent(id);
  switch (kind) {
    case 'enquiries': return `${roomHref('leads')}?lead=${enc}`;
    case 'clients':   return `${roomHref('clients')}?client=${enc}`;
    case 'events':    return `${roomHref('events')}?event=${enc}`;
    case 'invoices':  return `${roomHref('invoices')}?invoice=${enc}`;
    case 'packages':  return roomHref('packages');
    case 'notes':     return roomHref('notes');
    case 'crew':      return roomHref('team');
  }
}

/** Her recent searches, newest first, one of each, at most RECENT_MAX. */
export function withRecent(list: readonly string[], q: string): string[] {
  const t = q.trim();
  if (t.length < MIN_CHARS) return [...list];
  return [t, ...list.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, RECENT_MAX);
}
export function readRecent(): string[] {
  try { const v = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); return Array.isArray(v) ? v.filter((x) => typeof x === 'string').slice(0, RECENT_MAX) : []; } catch { return []; }
}
export function saveRecent(q: string): string[] {
  const next = withRecent(readRecent(), q);
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* this phone only; fine without */ }
  return next;
}
