// v2/lib/vendor/api/gear.ts · CE-47 · PRO · P2 app · Gear sharing: her doors (dream-os src/api/vendor/gear.js).
// The other vendor is her business name and city until the owner accepts; then each sees the other's WhatsApp number.
import { getJson, postJson } from '@/lib/vendor/api/_base';

export type ApiErr = { ok: false; error: string };
export type Party = { business_name: string; city: string | null; whatsapp?: string };
export type GearItem = { id: string; item: string; value: string; value_rs: number; price_per_day_rs: number; price_line: string; city: string; note: string | null; state: 'listed' | 'withdrawn'; owner?: Party };
export type GearRequest = { id: string; side: 'owner' | 'borrower'; state: 'requested' | 'accepted' | 'declined' | 'cancelled'; item_id: string; item: string | null;
  date_from: string; date_to: string; dates: string; days: number; price_line: string; note: string | null; other: Party; settle?: string };
export type GearRoom = { mine: GearItem[]; near: GearItem[]; lent: GearRequest[]; asked: GearRequest[] };

export const fetchGear = (vendorId: string): Promise<{ ok: true; room: GearRoom } | ApiErr> => getJson(`/api/v2/vendor/gear/${vendorId}`);
export const listGear = (vendorId: string, body: { item: string; value_rs: number; price_per_day_rs: number; city: string; note?: string }): Promise<{ ok: true; item: GearItem } | ApiErr> =>
  postJson(`/api/v2/vendor/gear/${vendorId}/items`, body);
export const withdrawGear = (vendorId: string, itemId: string): Promise<{ ok: true } | ApiErr> => postJson(`/api/v2/vendor/gear/${vendorId}/items/${itemId}/withdraw`, {});
export const askGear = (vendorId: string, itemId: string, body: { date_from: string; date_to: string; note?: string }): Promise<{ ok: true; request: GearRequest } | ApiErr> =>
  postJson(`/api/v2/vendor/gear/${vendorId}/items/${itemId}/ask`, body);
export const answerGear = (vendorId: string, requestId: string, verb: 'accept' | 'decline' | 'cancel'): Promise<{ ok: true; request: GearRequest } | ApiErr> =>
  postJson(`/api/v2/vendor/gear/${vendorId}/requests/${requestId}/${verb}`, {});
/** Her WhatsApp number as a link (every handle a link): digits only, India's 91 kept. */
export const waLink = (n: string) => `https://wa.me/${String(n).replace(/\D/g, '')}`;
