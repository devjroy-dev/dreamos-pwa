// lib/admin-api/mint.ts — TDW_10 ADMIN P3 · the mint's typed door.
//
// ── THE TYPES ARE READ OFF THE HANDLER, NOT GUESSED ─────────────────────────
// Protocol §6: "ALWAYS read the actual backend route handler before writing any
// frontend API call — exact request field names, required fields, response
// shape. Never assume field names." Every field below was derived from
// `dream-os src/api/admin/vendors.js` (symbol mintVendor),
// `src/api/admin/couples.js` (symbol mintCouple) and `src/api/admin/mint.js` at
// dream-os `800d7a1`.
//
// F-10.45 is what happens when that law is skipped: `DiscoverRequest` in
// index.ts declared five fields the server never sent, `adminGet<T>` cast them
// in, and the screen threw on `undefined.replace()`. A type that the compiler
// cannot check against the wire is a promise, not a guarantee — so these shapes
// are documented with their origin, and the P3 bench asserts the fields the
// screen actually reads.

import { adminGet, adminPost } from './_base';

/** `created` — a users/vendors pair was born here.
 *  `existing` — the phone already had an account; NOTHING was overwritten.
 *  The distinction is F-10.47: the old handler returned `{created:true}` for
 *  both and silently renamed the person it did not create. */
export type MintOutcome = 'created' | 'existing';

export type MintVendorResult = {
  ok: boolean;
  created: boolean;
  outcome: MintOutcome;
  vendor_id: string | null;
  /** NULL on a fresh mint, and that is the truth rather than a gap: the handle
   *  is written at the end of conversational onboarding, never at provision.
   *  The success card says so in words. */
  routing_handle: string | null;
  owner_name: string | null;
};

export type MintCoupleResult = {
  ok: boolean;
  created: boolean;
  outcome: MintOutcome;
  couple_id: string | null;
  owner_name: string | null;
};

export type WelcomeResult = {
  ok: boolean;
  sent: boolean;
  /** Present only when `sent` is false. `template_not_approved` is the expected
   *  state until the founder files `tdw_vendor_welcome` with Meta. */
  reason?: 'template_not_approved' | 'opted_out' | 'line_not_configured' | 'not_sent';
  message?: string;
};

export type WelcomeStatus = {
  ok: boolean;
  template_key: string;
  name: string | null;
  status: string | null;
  /** The SERVER's answer, never the client's opinion. Same shape the photo floor
   *  uses: a number the server sends cannot drift from the number it enforces. */
  approved: boolean;
};

export const mintVendor = (body: {
  phone: string; business_name?: string; category?: string; city?: string; tier?: string;
}) => adminPost<MintVendorResult>('/api/v2/admin/mint/vendor', body);

export const mintCouple = (body: {
  phone: string; name: string; wedding_date?: string;
}) => adminPost<MintCoupleResult>('/api/v2/admin/mint/couple', body);

export const sendWelcome = (vendorId: string) =>
  adminPost<WelcomeResult>(`/api/v2/admin/mint/welcome/${vendorId}`, {});

export const getWelcomeStatus = () =>
  adminGet<WelcomeStatus>('/api/v2/admin/mint/welcome-status');
