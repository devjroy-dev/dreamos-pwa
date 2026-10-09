// v2/lib/solutions/insurance.ts — CE-47 · INS-A · THE INSURANCE ROOM'S CALLS AND WORDS, ONE HOME.
// The server is dream-os src/api/vendor/solutions/insurance.js (INS-A r3, landed 44c68c6): every rule (kinds of cover,
// the A-to-Z list, the fee lines, "Not checked by TDW", the Insured mark, the 30 and 7 day reminders) is decided there and
// only drawn here. Every answer is { ok, ... } or { ok: false, error } with the error already in plain words.
import { getJson, postJson, patchJson, deleteJson } from '@/lib/vendor/api/_base';
import { SOLUTIONS_API_PATH } from '@/v2/lib/solutions/routes';

const P = `${SOLUTIONS_API_PATH}/insurance`;

export type Policy = {
  id: string; kind: string; kind_title: string; insurer: string; cover_amount: number; ends_on: string;
  has_document: boolean; state: 'in_date' | 'renew_soon' | 'ended'; state_label: string; facts: string; checked: string;
};
export type Destination = { name: string; label: string; url: string; mode: 'link' | 'journey'; fee_line: string };
export type Kind = { key: string; title: string; example: string };
export type Room = { ok: true; policies: Policy[]; show_mark: boolean; mark_showing: boolean; destinations: Destination[] };
export type Fail = { ok: false; error?: string };
export type Prefill = { insurer: string | null; kind: string | null; cover_amount: number | null; ends_on: string | null };
export type Answers = { trade?: string; gearValue?: number; eventsPerYear?: number; worksAtVenues?: boolean; holdsClientMoney?: boolean };

export const insuranceRoom = () => getJson<Room | Fail>(P);
export const kindsFor = (answers: Answers) => postJson<{ ok: true; kinds: Kind[] } | Fail>(`${P}/kinds`, answers);
export const quoteBrief = (insurer: string, answers: Answers, kinds: string[]) =>
  postJson<{ ok: true; insurer: string; url: string; fee_line: string; text: string } | Fail>(`${P}/quote-brief`, { insurer, answers, kinds });
export const uploadUrl = (mime: string) => postJson<{ ok: true; path: string; upload_url: string } | Fail>(`${P}/policies/upload-url`, { mime });
export const readPolicy = (path: string, mime: string) => postJson<{ ok: true; prefill: Prefill } | Fail>(`${P}/policies/read`, { path, mime });
export const savePolicy = (fields: { insurer: string; kind: string; cover_amount: number; ends_on: string; doc_path?: string | null; doc_mime?: string | null }, id?: string) =>
  (id ? patchJson<{ ok: true; policy: Policy } | Fail>(`${P}/policies/${encodeURIComponent(id)}`, fields)
      : postJson<{ ok: true; policy: Policy } | Fail>(`${P}/policies`, fields));
export const deletePolicy = (id: string) => deleteJson<{ ok: true } | Fail>(`${P}/policies/${encodeURIComponent(id)}`);
export const policyDocument = (id: string) => getJson<{ ok: true; url: string } | Fail>(`${P}/policies/${encodeURIComponent(id)}/document`);
export const setShowMark = (on: boolean) => patchJson<Room | Fail>(`${P}/settings`, { show_mark: on });

/** The kind keys the server accepts, with the titles the room shows in its picker (the server's KINDS, same order). */
export const KIND_CHOICES: readonly { key: string; title: string }[] = [
  { key: 'equipment', title: 'Kit and equipment cover' },
  { key: 'public_liability', title: 'Public liability' },
  { key: 'professional_indemnity', title: 'Professional indemnity' },
  { key: 'goods_in_transit', title: 'Goods in transit' },
  { key: 'shop_and_stock', title: 'Shop and stock' },
  { key: 'jewellers_block', title: 'Jeweller\u2019s block' },   // R-40.19: the typographic apostrophe
  { key: 'personal_accident', title: 'Personal accident for you and your crew' },
  { key: 'event_cancellation', title: 'Event cancellation' },
  { key: 'other', title: 'Other cover' },
];

/** The room's own words (the founder's pictures, approved 6 October 2026, and the chair's rulings). */
export const INS = {
  title: 'Insurance',
  lede: 'This room shows the kinds of insurance cover that fit your business. It helps you ask insurers for a quote, and it keeps your policies in one place.',
  add: 'Add a policy',
  policiesHead: 'Policies',
  notChecked: 'You confirmed these details. TDW has not checked them.',
  markHead: 'On the website',
  markRow: 'Show Insured on my website',
  markFacts: 'The Insured mark shows on your website while a policy is in date. TDW takes it off when your last policy ends.',
  findHead: 'Find cover',
  askRow: 'What cover do I need',
  askFacts: 'You answer five questions, and TDW shows the kinds of cover that fit, with examples.',
  quoteRow: 'Get a quote',
  quoteFacts: 'You pick an insurer, and TDW writes a cover enquiry for you to send to them.',
  quoteLede: 'Please pick one insurer or comparison site from this list. TDW writes a cover enquiry from your answers, your calendar and your weddings on TDW, and you send it to them yourself. The list is in A to Z order and is not a ranking.',
  quoteNote: 'Each one sets its own price and may charge its own fees. TDW takes nothing.',
  buyHereComing: 'Soon you will be able to buy a policy from the insurer you choose, here in TDW. TDW will take no fee.',
  comingSoon: 'Coming soon',
  kindsNote: 'These are kinds of cover, not policies. TDW does not recommend any insurer or policy. TDW takes no fee from any insurer.',
  on: 'On', off: 'Off',
  readNote: 'TDW read these details from the document. Please check each one before you save.',
  save: 'Save policy',
  openDoc: 'Open document', replace: 'Replace', del: 'Delete policy',
  copy: 'Copy', sendWa: 'Send on WhatsApp',
  openSite: (n: string) => `Open ${n}\u2019s website`,
  reminder: 'TDW sends you a WhatsApp reminder 30 days and 7 days before the policy ends.',
} as const;
