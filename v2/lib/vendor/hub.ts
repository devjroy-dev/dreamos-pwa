// v2/lib/vendor/hub.ts · CE-47 · HUB-2 · COLLAB HUB IN THE APP: the doors, their shapes and the words, one home.
// Server: dream-os src/api/vendor/hub.js (HUB-1 + HUB-2 SERVER) and src/api/public/hub.js.
// Rules this file holds:
//  - every handle, website and page leaves as a link (https, a new tab, rel "noopener noreferrer"): see linkProps;
//  - no check label anywhere (CE-47, 7 Oct 2026): no field for one exists here;
//  - My people (CE-47 ruling, 7 Oct 2026): a vendor adds another vendor directly. An organisation or a person joins
//    only through a credit they answered yes to. Nobody outside the vendor pool is on a list without having agreed.
import { getJson, postJson, deleteJson } from '@/lib/vendor/api/_base';

export type HubKind = 'vendor' | 'org' | 'person';

export interface HubLink { url: string }
export interface HubCard {
  id: string;
  handle: string;
  name: string;
  kind: HubKind;
  roles: string[];
  city: string | null;
  open_to_words: string[];
  instagram: { handle: string; url: string } | null;
  website: HubLink | null;
  page_url: string;
  work: string[];
}
export interface HubPerson extends HubCard {
  worked_with: number;
  worked_with_words: string;
  in_my_people: boolean;
  why: 'added' | 'said_yes' | null;
  why_words: string | null;
  can_add: boolean;
  can_take_off: boolean;
}
export interface HubWaiting extends HubCard { words: string; line: string }
export interface PeopleReply { ok: boolean; people: HubPerson[]; waiting?: HubWaiting[]; mine_line?: string; line: string; error?: string }
export interface DoorReply { ok: boolean; error?: string; message?: string; line?: string; added?: boolean; removed?: boolean; offered?: number }

export interface NameLink { name: string; page_url: string | null }
export interface WorkItem {
  kind: 'call'; id: string; from: string; roles: { role: string; needed: number }[]; event_date: string; city: string | null;
  pay_kind: string | null; budget_inr: number | null; details: string | null;
  instagram: { handle: string; url: string } | null; website: HubLink | null; page_url: string | null;
}
export interface WorkReply { ok: boolean; city: string | null; roles: string[]; all_cities: boolean; items: WorkItem[]; not_yet: string[]; error?: string }
export interface MyCall { id: string; event_date: string; city: string | null; details: string | null; state: string; interested: number; picked: number; sent_by_tdw: boolean; line: string | null }
export interface Applied { id: string; post_id: string; state: string; words: string; call: string; event_date?: string; city?: string | null; from: NameLink | null }
export interface WaitingCredit { id: string; from: NameLink | null; shoot_words: string }
export interface WorkedLine { key: string; from_call: boolean; shoot_name: string; city: string | null; month_words: string; with: NameLink[] }
export interface MineReply { ok: boolean; my_calls: MyCall[]; applied: Applied[]; waiting_for_your_yes: WaitingCredit[]; worked_with: WorkedLine[]; shoot_requests_left: number; waiting_count: number; error?: string }

export interface PeopleQuery { role?: string | null; city?: string | null; open_to?: string | null; mine?: boolean }

export const HUB_API = {
  people: (q: PeopleQuery = {}) => {
    const sp = new URLSearchParams();
    if (q.role) sp.set('role', q.role);
    if (q.city) sp.set('city', q.city);
    if (q.open_to) sp.set('open_to', q.open_to);
    if (q.mine) sp.set('mine', '1');
    const s = sp.toString();
    return `/api/v2/vendor/hub/people${s ? `?${s}` : ''}`;
  },
  myPeople: (profileId: string) => `/api/v2/vendor/hub/people/${encodeURIComponent(profileId)}/my-people`,
  credits: () => '/api/v2/vendor/hub/credits',
  mine: () => '/api/v2/vendor/hub/mine',
  work: (allCities = false) => `/api/v2/vendor/hub/work${allCities ? '?all_cities=1' : ''}`,
  me: () => '/api/v2/vendor/hub/me',
} as const;

export const fetchPeople = (q: PeopleQuery) => getJson<PeopleReply>(HUB_API.people(q));
export const addToMyPeople = (profileId: string) => postJson<DoorReply>(HUB_API.myPeople(profileId), {});
export const takeOffMyPeople = (profileId: string) => deleteJson<DoorReply>(HUB_API.myPeople(profileId));
export const fetchWork = (allCities: boolean) => getJson<WorkReply>(HUB_API.work(allCities));
export const fetchMine = () => getJson<MineReply>(HUB_API.mine());
export const answerCredit = (id: string, yes: boolean) => postJson<DoorReply>(`/api/v2/vendor/hub/credits/${encodeURIComponent(id)}/${yes ? 'yes' : 'no'}`, {});
/** "I am interested" on a call: the Collab room's existing door (HUB-1 kept it). */
export const sayInterested = (callId: string) => postJson<DoorReply>(`/api/v2/vendor/collab/${encodeURIComponent(callId)}/respond`, { action: 'interested' });
export const sendShootRequests = (body: { shoot_name: string; city: string; month: string; people: string[] }) =>
  postJson<DoorReply>(HUB_API.credits(), body);

/** FE-8 (E): a door may leave out its list; a missing list is an empty one, never a crash. */
export const arr = <T,>(x: T[] | undefined | null): T[] => (Array.isArray(x) ? x : []);

/** Every link that leaves the app: https only, a new tab, no opener, no referrer. Anything else is not a link. */
export function linkProps(url: string | null | undefined): { href: string; target: '_blank'; rel: 'noopener noreferrer' } | null {
  const u = String(url || '').trim();
  if (!/^https:\/\/[^\s]+$/i.test(u)) return null;
  return { href: u, target: '_blank', rel: 'noopener noreferrer' };
}

/** A website's words: its host and path, never the scheme. */
export const siteWords = (url: string) => url.replace(/^https:\/\//i, '').replace(/\/$/, '');

/** The month picker's value (YYYY-MM) in words, e.g. "August 2026". */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const monthWords = (ym: string) => { const m = /^(\d{4})-(\d{2})/.exec(ym || ''); return m ? `${MONTHS[+m[2] - 1]} ${m[1]}` : ''; };

/** The server's limit on "a shoot we did together" requests in any 30 days (HUB-1 credits.js MONTHLY_SHOOT_OFFERS). */
export const MONTHLY_SHOOT_REQUESTS = 20;

export const HUB = {
  tabs: { work: 'Work', people: 'People', mine: 'Mine' },
  peopleNote: 'Everyone on Collab Hub. Only shoots the other person said yes to show as “Worked with”.',
  myPeopleChip: 'My people',
  myPeopleChipCount: (n: number) => `My people · ${n}`,
  vendorFact: 'on TDW as a vendor',
  personFact: 'joined as a person',
  orgFact: 'an organisation',
  seePage: 'See their page',
  add: 'Add to my people',
  inMine: 'In my people',
  takeOff: 'Take off my people',
  notAddable: 'Joins your people only after a shoot you did together, and only when they say yes.',
  emptyAll: 'Nobody matches these choices yet.',
  emptyMine: 'Nobody on your list yet. Add vendors here, or send a request for a shoot you did together.',
  instagram: (h: string) => `Instagram ${h}`,
  shoot: {
    open: '+ A shoot we did together',
    title: 'A shoot we did together',
    note: 'For a shoot that was not a call on TDW. Each person you add gets a request. The shoot shows on your page and theirs only after they say yes.',
    name: 'Name of the shoot',
    city: 'City',
    month: 'Month',
    who: 'Who worked on it',
    search: 'Search Collab Hub by name or Instagram',
    remove: 'Remove',
    // The server counts any 30 days, not a calendar month (HUB-1 credits.js), so the words say so.
    left: (n: number) => `You can send ${MONTHLY_SHOOT_REQUESTS} of these requests in any 30 days. ${n} left now.`,
    // "They can join free at thedreamwedding.in/collab/join" waits for HUB-3: no link to a page that does not exist yet.
    send: (n: number) => (n === 1 ? 'Send 1 request' : `Send ${n} requests`),
    sending: 'Sending…',
    needAll: 'Add the name, the city, the month and at least one person.',
  },
  work: {
    line: (roles: string, city: string | null, all: boolean) =>
      `Calls for ${roles || 'your craft'}${all ? ' in every city' : city ? ` in ${city}` : ''}. Newest first.`,
    allCities: 'All cities',
    call: 'Call',
    needs: (from: string, roles: string) => `${from} needs ${roles}`,
    interested: 'I am interested',
    sent: 'You said you are interested. If they pick you, you both get each other\u2019s number.',
    notYet: (xs: string[]) => `Not here yet: ${xs.join(', ')}.`,
    empty: 'No calls for your craft here right now.',
    pay: (k: string | null, budget: string | null) => (k === 'credit_only' ? 'Credit only' : k === 'unpaid' ? 'Unpaid' : k === 'paid' ? (budget ? `Paid ${budget}` : 'Paid') : null),
  },
  mine: {
    myCalls: (n: number) => `My calls \u00b7 ${n}`,
    interested: (n: number) => `${n} interested`,
    picked: (n: number) => `${n} picked`,
    markFilled: 'Mark filled',
    closed: 'Closed',
    applied: (n: number) => `I applied \u00b7 ${n}`,
    yourYes: (n: number) => `Waiting for your yes \u00b7 ${n}`,
    asks: (from: string) => `${from} says you worked on this shoot:`,
    yesNote: 'If you say yes, it shows on your page and theirs, and you join each other\u2019s people. If you say no, it shows nowhere.',
    yes: 'Yes, I worked on it',
    no: 'No',
    worked: (n: number) => `Worked with \u00b7 ${n}`,
    with: 'With',
    fromCall: 'a call on TDW',
    noCalls: 'No calls yet. Tap New post to find a second shooter, a stylist, or anyone you need.',
    noWorked: 'Nothing here yet. Shoots show here once the other person says yes.',
  },
  close: 'Close',
} as const;
