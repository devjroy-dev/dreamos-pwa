// v2/lib/shop/shop.ts · CE-47 · OFF-A2 · the Off-season shop room's words and its calls to dream-os (OFF-A1's doors).
// Words: the approved pictures (TDW_CE47_OFF_PICTURES, 4 October 2026) and R-45.30's plain register; money as "Rs 3,000";
// dates in full months; no "bride" or "couple"; no long dash.
import { API_BASE, getAuthHeader } from '@/lib/vendor/api/_base';
import { SHOP_API_PATH } from '@/v2/lib/solutions/routes';

export type Kind = 'voucher' | 'workshop' | 'class' | 'booking';
export type Item = { id: string; kind: Kind; name: string; slug: string; photo_url: string | null; price: number; includes: string[]; shown: boolean; position: number; class_link?: string | null;
  voucher_for: string | null; valid_months: number | null; starts_at: string | null; ends_at: string | null; place: string | null; online: boolean; seats_total: number | null;
  class_dates: string[]; occasion: 'party' | 'engagement' | 'pre_wedding' | 'other' | null; hours: number | null; lead_days: number | null; seats_left: number | null; facts: string; price_words: string };
export type Voucher = { code: string; valid_until: string; redeemed_at: string | null } | null;
export type Order = { id: string; item_id: string; buyer_name: string; buyer_phone: string; qty: number; amount: number; amount_words: string; wanted_date: string | null;
  state: 'asked' | 'paid' | 'cancelled'; hold_until: string | null; paid_at: string | null; paid_by: string | null; created_at: string; item_name: string | null; item_kind: Kind | null; voucher: Voucher };
export type Room = { ok: boolean; open: boolean; items: Item[]; orders: Order[] };
export type Answer<T = Record<string, unknown>> = { ok: boolean; status: number; error?: string; field?: string } & Partial<T>;

export const W = {
  title: 'Off-season shop',
  add: 'New item',
  tabs: { items: 'Items', orders: 'Orders', vouchers: 'Vouchers' },
  soonTitle: 'Off-season shop',
  soonLine: 'You can sell gift vouchers, workshops, classes and bookings from your website.',
  soon: 'Coming soon',
  readFail: 'The shop could not be read. Pull down to try again.',
  emptyItems: 'Your shop has nothing for sale yet. Tap New item to add a gift voucher, a workshop, a class or a booking.',
  emptyOrders: 'There are no orders yet. When someone orders from your website, the order shows here.',
  emptyVouchers: 'No vouchers have been sold yet.',
  onWebsite: 'On your website',
  showShop: 'Show the shop on the website',
  showLine: 'Your website and storefront show the shop under the heading Gift vouchers and workshops.',
  hiddenLine: 'The shop is hidden. Buyers cannot see it on your website or storefront.',
  asked: 'Not paid yet', paid: 'Paid', cancelled: 'Cancelled', hidden: 'Hidden', valid: 'Valid', redeemed: 'Redeemed', expired: 'Ended',
  linksHead: 'Payment links',
  linksTitle: 'Take payment on the website',
  linksLine: 'When payment links are ready, buyers will pay straight into your own account. Until then, a buyer sends an order as a question, and you tap Mark paid once the money reaches you.',
  notUsed: 'Not used yet', usedHead: 'Redeemed',
  check: 'Check a code', checkBtn: 'Check', redeem: 'Mark redeemed', redeemAsk: 'Mark this voucher as used? This cannot be undone.', redeemYes: 'Yes, mark it used', redeemNote: 'Note (optional)',
  kindAsk: 'What are you selling?',
  kinds: { voucher: ['Gift voucher', 'A gift voucher is worth an amount of money, or one service.'], workshop: ['Workshop', 'The workshop runs on one date, in person or online, with a set number of seats.'], class: ['Online class', 'The class runs on set dates, or on a date the buyer asks for.'], booking: ['Booking', 'The booking is for a party, an engagement or a pre-wedding shoot.'] } as Record<Kind, [string, string]>,
  f: { name: 'Name', price: 'Price in rupees', voucherFor: 'The voucher is for (optional)', validMonths: 'Valid for (months)', startsAt: 'Date and start time', place: 'Place',
    online: 'Online', seats: 'Seats', classDates: 'Dates (leave empty if each buyer asks for a date)', addDate: 'Add a date', occasion: 'Occasion', hours: 'Hours', leadDays: 'Book at least this many days ahead',
    includes: 'What is included (up to six lines)', addLine: 'Add a line', picture: 'Picture', pickPicture: 'Pick from your portfolio', changePicture: 'Change the picture', noPictures: 'Your portfolio has no pictures to choose from yet.',
    shown: 'Show on the website' },
  occasions: { party: 'Party', engagement: 'Engagement', pre_wedding: 'Pre-wedding', other: 'Other' } as Record<string, string>,
  save: 'Save', saving: 'Saving', remove: 'Remove this item', removeAsk: 'Remove this item from the shop? Its orders stay in Orders.', removeYes: 'Yes, remove it', cancel: 'Cancel',
  orderTitle: 'Order', markPaid: 'Mark paid', markPaidAsk: 'Mark this order paid? Do this once the money is in your account.', markPaidYes: 'Yes, mark paid', cancelOrder: 'Cancel this order',
  call: 'Call', whatsapp: 'WhatsApp', seats: (n: number) => (n === 1 ? '1 seat' : `${n} seats`), codeIs: (c: string) => `Voucher code ${c}`,
  failed: 'That did not save. Please try again in a moment.',
  sendCode: 'Send the code on WhatsApp',
  sendClassLink: 'Send the class link from WhatsApp',
  /** G1 (CE-47): the words her WhatsApp opens with, after Mark paid; automatic once tdw_shop_paid is approved by Meta. */
  codeMessage: (name: string, item: string, studio: string, code: string, until: string) => `Hi ${name}, your ${item} from ${studio} is paid. Your voucher code is ${code}, valid until ${until}.`,
  /** R1 (reversed by the founder, 7 October 2026): her own class link goes to a paid seat, labelled as hers. */
  classMessage: (name: string, item: string, studio: string, link: string) => `Hi ${name}, thank you for booking ${item} with ${studio}. Class link from ${studio}: ${link}`,
  sendClassLinkReady: 'Send the class link on WhatsApp',
  noClassLink: 'No class link is set for this item. Add one to the item, or send it from WhatsApp.',
  classLinkField: 'Class link (your Meet or Zoom link, https://)',
  classLinkLine: 'Each buyer gets this link only after paying. The message names your studio.',
  meetTitle: 'A Google Meet link for each paid seat',
  meetLine: 'This needs Google Calendar connected to TDW. That connection is not available yet.',
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export function dateWords(iso: string | null | undefined): string { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || '')); return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : ''; }
/** An instant, as India reads it: "14 December 2026, 11:00 am". */
export function istWords(isoInstant: string | null | undefined): string {
  const t = Date.parse(String(isoInstant || '')); if (!Number.isFinite(t)) return '';
  const d = new Date(t + 330 * 60000).toISOString(); const h = Number(d.slice(11, 13)); const mi = d.slice(14, 16);
  return `${dateWords(d)}, ${((h + 11) % 12) + 1}:${mi} ${h < 12 ? 'am' : 'pm'}`;
}

async function call<T>(method: string, path: string, body?: unknown): Promise<Answer<T>> {
  try {
    const r = await fetch(`${API_BASE}${SHOP_API_PATH}${path}`, { method, headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    let j: Record<string, unknown> = {}; try { j = await r.json(); } catch { j = {}; }
    return { ...(j as object), ok: r.ok && j.ok !== false, status: r.status } as Answer<T>;
  } catch { return { ok: false, status: 0, error: W.failed } as Answer<T>; }
}
export const shopApi = {
  room: () => call<Room>('GET', ''),
  create: (b: unknown) => call<{ item: Item }>('POST', '/items', b),
  update: (id: string, b: unknown) => call<{ item: Item }>('PUT', `/items/${encodeURIComponent(id)}`, b),
  remove: (id: string) => call('DELETE', `/items/${encodeURIComponent(id)}`),
  paid: (id: string) => call<{ voucher: Voucher; calendar_line: string | null }>('POST', `/orders/${encodeURIComponent(id)}/paid`, {}),
  cancel: (id: string) => call('POST', `/orders/${encodeURIComponent(id)}/cancel`, {}),
  check: (code: string) => call<{ voucher: { code: string; item_name: string | null; buyer_name: string | null; line: string; valid_until: string; redeemed_at: string | null; state: 'valid' | 'redeemed' | 'expired' } }>('POST', '/vouchers/check', { code }),
  redeem: (code: string, note: string) => call('POST', '/vouchers/redeem', { code, note }),
};
/** The body PUT and POST carry: an item's own fields, as OFF-A1's checkItem reads them. */
export function itemBody(i: Partial<Item>): Record<string, unknown> {
  return { kind: i.kind, name: i.name, price: i.price, includes: i.includes || [], photo_url: i.photo_url || null, shown: i.shown !== false, voucher_for: i.voucher_for || null,
    valid_months: i.valid_months, starts_at: i.starts_at, ends_at: i.ends_at || null, place: i.place || null, online: i.online === true, seats_total: i.seats_total,
    class_dates: i.class_dates || [], occasion: i.occasion, hours: i.hours || null, lead_days: i.lead_days ?? 0, class_link: i.class_link || null };
}
