// v2/lib/solutions/paymentLinks.ts — CE-47 · INS · PAY-A · THE PAYMENT LINKS ROOM'S CALLS AND WORDS, ONE HOME.
// The server is dream-os (PAY-A, landed; the gaps package c6eec1d): money goes from her client straight to her own
// Razorpay account; TDW takes no fee. Every rule is the server's; this file only calls the doors and holds the words.
// The server writes every amount ("Rs 8,000"); this room prints it and never composes one (the chair, 8 October).
// R-47.1: every sentence here is a plain statement of fact, understood on one reading. Labels (buttons, row titles,
// tags) are not sentences.
import { getJson, postJson, patchJson } from '@/lib/vendor/api/_base';
import { SOLUTIONS_API_PATH } from '@/v2/lib/solutions/routes';

const P = `${SOLUTIONS_API_PATH}/payment-links`;

export type PayEvent = {
  id: string; provider_payment_id?: string; kind: 'paid' | 'part_paid' | 'failed' | 'refunded'; amount: number; amount_text?: string; method?: string | null;
  at: string; applied: boolean; not_applied_reason?: string | null; invoice_id?: string | null; milestone_id?: string | null;
  question?: { line: string; one: string; two: string };
};
export type PayLink = { id: string; invoice_id?: string | null; milestone_id?: string | null; binder_id?: string | null; amount: number; state: string; short_url?: string | null; created_at: string };
export type Room = {
  ok: true; configured: boolean; comingSoon?: string;
  account?: { provider: string; accountId: string; status: string; connectedAt?: string } | null;
  links?: PayLink[]; events?: PayEvent[]; settings?: { accept_partial?: boolean };
};
export type InvoiceInfo =
  | { ok: true; kind: 'package'; invoice_id: string; state: string; owed: number; owed_text: string; lines: { id: string; label: string; due_date: string | null; owed: number; owed_text: string }[] }
  | { ok: true; kind: 'binder'; owed: number; owed_text: string };
export type Fail = { ok: false; code?: string; error?: string };

export const payRoom = () => getJson<Room | Fail>(P);
export const connectStart = () => postJson<{ ok: true; url: string } | Fail>(`${P}/connect`, {});
export const connectFinish = (code: string, state: string) => postJson<{ ok: true; account: { accountId: string } } | Fail>(`${P}/connect/finish`, { code, state });
export const disconnect = () => postJson<{ ok: true } | Fail>(`${P}/disconnect`, {});
export const invoiceInfo = (binderId: string) => getJson<InvoiceInfo | Fail>(`${P}/invoices/${encodeURIComponent(binderId)}`);
export const makeLink = (invoiceId: string, milestoneId?: string) => postJson<{ ok: true; link: { id: string; amount: number; shortUrl: string } } | Fail>(`${P}/links`, { invoiceId, milestoneId });
export const setPartial = (on: boolean) => patchJson<{ ok: true; settings: { accept_partial: boolean } } | Fail>(`${P}/settings`, { accept_partial: on });
export const takeOffRefund = (refundId: string) => postJson<{ ok: true } | Fail>(`${P}/refunds/${encodeURIComponent(refundId)}/take-off`, {});
export const answerAlreadyOn = (eventId: string) => postJson<{ ok: true } | Fail>(`${P}/payments/${encodeURIComponent(eventId)}/already-on`, {});
export const answerAdd = (eventId: string) => postJson<{ ok: true } | Fail>(`${P}/payments/${encodeURIComponent(eventId)}/add`, {});

/** The room's own words. Sentences are plain statements (R-47.1); labels are short. */
export const PL = {
  title: 'Payment links',
  lede: 'This room makes payment links for your invoices. Your client pays through the link, and the money goes straight to your own Razorpay account. TDW takes no fee.',
  comingLine: 'Payment links are not switched on yet. They will work here once Razorpay approves TDW as a technology partner.',
  comingTag: 'Coming soon',
  accountHead: 'Your Razorpay account',
  notConnected: 'Your Razorpay account is not connected yet.',
  connect: 'Connect Razorpay',
  connectedLine: (acc: string) => `Your Razorpay account ${acc} is connected.`,
  disconnect: 'Disconnect',
  invoicesHead: 'Invoices with money owed',
  noInvoices: 'No invoice has money owed right now.',
  owedLine: (owedText: string) => `${owedText} is still owed on this invoice.`,
  wholeLink: 'Make a link for the whole amount',
  lineLink: 'Make a link for this instalment',
  linkMade: 'The link is ready. Copy it, or send it to your client on WhatsApp.',
  copy: 'Copy', sendWa: 'Send on WhatsApp',
  partialRow: 'Allow part payment on a link for the whole invoice',
  partialFacts: 'When this is on, your client can pay part of the amount through a link for the whole invoice. A link for one instalment always asks for the full instalment.',
  on: 'On', off: 'Off',
  paymentsHead: 'Payments through links',
  paid: (t: string) => `${t} was paid through a link.`,
  failed: (t: string) => `A payment of ${t} did not go through.`,
  refunded: (t: string) => `${t} was refunded to your client.`,
  refundLine: 'The refund is not yet taken off the invoice.',
  takeOff: 'Take it off the invoice',
  refundDone: 'The refund has been taken off the invoice.',
  pendingLine: (t: string) => `${t} was received online. TDW is adding it to the invoice.`,
  // The founder's words for a payment TDW could not place (approved 8 October, word for word). The line itself comes
  // from the server with the amount written in; these two answers are the buttons.
  one: 'It is already on the invoice', two: 'Add it to the invoice',
  done: 'This payment has already been settled.', fail: 'Try again.',
  connectingLine: 'TDW is finishing the connection to your Razorpay account.',
  connectedBack: 'Your Razorpay account is now connected.',
} as const;

/** The server's own sentence for a failure, or a plain one when it sent none. */
export const errOf = (r: unknown, fallback = 'TDW could not finish that. Please try again.'): string => {
  const e = (r as { error?: unknown }).error;
  return typeof e === 'string' && e ? e : fallback;
};
