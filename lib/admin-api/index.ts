// lib/admin-api/index.ts
// All admin API types and functions. Single import for all admin pages.

export { API_BASE } from './_base';
import { adminGet, adminPost, adminPatch, adminDelete, adminUploadFile } from './_base';
export { adminUploadFile };

// ── Types ─────────────────────────────────────────────────────────────────────

export type AdminVendor = {
  id: string; name: string; phone: string; category: string | null;
  city: string | null; tier: string; status: string;
  founding_cohort: boolean; discover_eligible: boolean;
  discover_request_state: string; created_at: string;
};

export type AdminCouple = {
  id: string; name: string; phone: string; wedding_date: string | null;
  wedding_city: string | null; tier: string; planning_state: string;
  muse_saves: number; circle_members: number; created_at: string;
};

export type ConfigRow = {
  key: string; value: string; description: string | null; updated_at: string;
};

export type AdminImage = {
  id: string; image_url: string; cloudinary_public_id: string | null;
  caption: string | null; active: boolean; created_at: string;
  display_order?: number; sort_order?: number;
  aesthetic_tags?: string[];
};

export type SpotlightItem = AdminImage & {
  vendor_id: string | null; vendor_name: string | null;
  vendor_category: string | null; vendor_city: string | null;
  week_label: string | null;
};

// ── F-10.45 · THIS TYPE WAS A PROMISE THE WIRE NEVER KEPT ───────────────────
// IT READ:
//   { id; vendor_id; vendor_name; vendor_category; vendor_city;
//     discover_request_state; created_at; portfolio_count }
// The server sent `{id, vendor_id, state, reason, decided_at, created_at,
// vendor:{…}}`. FIVE of those eight fields did not exist on the wire, and
// `adminGet<T>` casts, so tsc could not see it. At render `st.replace('_',' ')`
// ran on `undefined` and THREW — the whole approvals screen, on any non-empty
// queue. It had never fired only because `vendor_discover_requests` is empty in
// production (founder-run SELECT, 2026-08-06: `group by state` returned zero
// rows). The server now sends this shape; every field below was read off
// `dream-os src/api/admin/discover.js` at `800d7a1`, not assumed.
export type DiscoverRequest = {
  id: string;
  vendor_id: string;
  /** The server's own state value: 'requested' | 'under_review' | 'approved' | … */
  state: string;
  /** The same fact under the name this type has always declared. Echoed by the
   *  server through the transition so a client either side of the push renders
   *  rather than throws; P6 retires one of the two. */
  discover_request_state: string;
  vendor_name: string;
  vendor_category: string | null;
  vendor_city: string | null;
  vendor_phone: string | null;
  routing_handle: string | null;
  discover_eligible: boolean;
  /** FORK 5 — two labelled counts, never one blended number. `total` is what the
   *  floor is enforced against (at the request gate AND now at grant); `approved`
   *  is what a couple will actually see. F-07.4 declared the divergence; the deck
   *  renders both, each labelled for what it measures. */
  photos_total: number;
  photos_approved: number;
  /** From the enforcing constant itself, so the deck holds no second opinion. */
  photo_floor: number;
  meets_floor: boolean;
  /** F-10.44 — `reason` is double-duty in the database. The server splits it on
   *  state so a vendor's own pitch can never be rendered back to him as the
   *  reason he was refused. Exactly one of these is ever non-null. */
  pitch: string | null;
  decision_reason: string | null;
  decided_at: string | null;
  created_at: string;
};

export type DiscoverPreview = {
  ok: boolean;
  vendor: unknown;
  is_live?: boolean;
  discover_paused?: boolean;
};

export type PhotoQueueItem = {
  id: string; vendor_id: string; image_url: string; caption: string | null;
  aesthetic_tags: string[]; approval_state: string; created_at: string;
  vendor: { id: string; business_name: string; category: string; routing_handle: string };
};

export type ConversationThread = {
  id: string; kind: string; state: string; last_message_at: string; created_at: string;
  vendor_id?: string; vendor_name?: string; vendor_phone?: string;
  vendor_category?: string; vendor_tier?: string;
  couple_id?: string; bride_name?: string; bride_phone?: string;
  wedding_date?: string | null; wedding_city?: string | null;
};

export type Message = {
  id: string; direction: string; channel: string; body: string;
  sent_by: string; tool_calls: unknown; created_at: string;
};

export type HotDate = {
  id: string; date: string; label: string | null; region: string;
};

// ── Vendors ───────────────────────────────────────────────────────────────────

export const getVendors = () => adminGet<{ vendors: AdminVendor[] }>('/api/v2/admin/vendors');
export const patchVendorTier = (id: string, tier: string) => adminPatch(`/api/v2/admin/vendors/${id}/tier`, { tier });
export const patchVendorDiscover = (id: string) => adminPatch(`/api/v2/admin/vendors/${id}/discover-eligible`, {});
export const patchVendorApprove = (id: string) => adminPatch(`/api/v2/admin/vendors/${id}/approve`, {});
// RETIRED — `patchVendorRevoke` and its route are gone. 「 Revoke Access 」 revoked
// no access: `vendors.status` is read only by the morning-briefing cron, so the
// button removed a vendor from Discover and stopped her good-morning message while
// she kept her account, her leads and her AI. Founder-ruled deleted rather than
// made true. Tombstone at src/api/admin/vendors.js.

// ── Couples ───────────────────────────────────────────────────────────────────

export const getCouples = () => adminGet<{ couples: AdminCouple[] }>('/api/v2/admin/couples');
export const patchCoupleTier = (id: string, tier: string) => adminPatch(`/api/v2/admin/couples/${id}/tier`, { tier });

// ── Invites ───────────────────────────────────────────────────────────────────


// ── Config ────────────────────────────────────────────────────────────────────

export const getConfig = () => adminGet<{ rows: ConfigRow[]; config: Record<string, string> }>('/api/v2/admin/config');
export const patchConfig = (key: string, value: string) => adminPatch(`/api/v2/admin/config/${key}`, { value });

// ── Content helpers (shared pattern) ─────────────────────────────────────────

function contentApi(base: string) {
  return {
    list:      ()                                                   => adminGet<{ photos: AdminImage[] }>(base),
    uploadUrl: (filename: string)                                   => adminPost<{ upload_url: string; params: Record<string,unknown> }>(`${base}/upload-url`, { filename }),
    register:  (body: Partial<AdminImage>)                         => adminPost(base, body),
    patch:     (id: string, body: Partial<AdminImage>)             => adminPatch(`${base}/${id}`, body),
    remove:    (id: string)                                        => adminDelete(`${base}/${id}`),
    upload:    (file: File, extra?: Partial<AdminImage>)           => adminUploadFile(`${base}/upload-url`, file).then(r => adminPost(base, { ...r, ...extra })),
  };
}

export const landingApi     = contentApi('/api/v2/admin/landing-photos');
export const exploringApi   = contentApi('/api/v2/admin/exploring-photos');
export const musePoolApi    = {
  ...contentApi('/api/v2/admin/muse-pool'),
  list: () => adminGet<{ images: AdminImage[]; active_count: number; max: number }>('/api/v2/admin/muse-pool'),
};
export const surpriseApi    = {
  ...contentApi('/api/v2/admin/surprise-pool'),
  list: () => adminGet<{ images: AdminImage[]; active_count: number; max: number }>('/api/v2/admin/surprise-pool'),
};
export const heroesApi      = {
  ...contentApi('/api/v2/admin/discover-heroes'),
  list: () => adminGet<{ heroes: AdminImage[] }>('/api/v2/admin/discover-heroes'),
};
export const spotlightApi   = {
  list:      ()                                                      => adminGet<{ spotlight: SpotlightItem[] }>('/api/v2/admin/spotlight'),
  uploadUrl: (filename: string)                                      => adminPost<{ upload_url: string; params: Record<string,unknown> }>('/api/v2/admin/spotlight/upload-url', { filename }),
  register:  (body: Partial<SpotlightItem>)                        => adminPost('/api/v2/admin/spotlight', body),
  patch:     (id: string, body: Partial<SpotlightItem>)            => adminPatch(`/api/v2/admin/spotlight/${id}`, body),
  remove:    (id: string)                                          => adminDelete(`/api/v2/admin/spotlight/${id}`),
  upload:    (file: File, extra?: Partial<SpotlightItem>)          => adminUploadFile('/api/v2/admin/spotlight/upload-url', file).then(r => adminPost('/api/v2/admin/spotlight', { ...r, ...extra })),
};

// ── Approvals ─────────────────────────────────────────────────────────────────

export const getPhotoQueue = (params?: { state?: string; category?: string }) => {
  const qs = new URLSearchParams(params as Record<string,string> ?? {}).toString();
  return adminGet<{ photos: PhotoQueueItem[] }>(`/api/v2/admin/photos/queue${qs ? '?' + qs : ''}`);
};
export const approvePhoto  = (id: string)                          => adminPost(`/api/v2/admin/photos/${id}/approve`, {});
export const rejectPhoto   = (id: string, reason?: string)        => adminPost(`/api/v2/admin/photos/${id}/reject`, { reason });
export const getDiscoverQueue = ()                                 => adminGet<{ requests: DiscoverRequest[] }>('/api/v2/admin/discover/requests');
export const grantDiscover    = (vendorId: string)                => adminPost(`/api/v2/admin/discover/grant/${vendorId}`, {});
// THE REASON IS THE POINT. This call posted `{}` — so the deny route's `reason`
// was ALWAYS null, and the spec's "rejection teaches" promise had no carrier from
// the one screen that could have sent one. The chips are the reason; the reason is
// the argument.
export const denyDiscover     = (vendorId: string, reason?: string) => adminPost(`/api/v2/admin/discover/deny/${vendorId}`, reason ? { reason } : {});
export const getDiscoverPreview = (vendorId: string) => adminGet<DiscoverPreview>(`/api/v2/admin/discover/preview/${vendorId}`);
// ── ONE VERB FOR ONE ACT (founder-ruled) ────────────────────────────────────
// `revokeDiscover` → `hideDiscover`, and the path moves with it. The deck's
// settled-list chip and the Makers row toggle did the SAME THING — take a vendor
// off the feed — under two different words, one of them heavier than the act.
// 'hidden' is the word because 'paused' is already the VENDOR's own switch
// (`vendors.discover_paused`, migration 0101, hers via PATCH /vendor/me), and one
// word may not carry two mechanisms.
export const hideDiscover     = (vendorId: string)                => adminPost(`/api/v2/admin/discover/hide/${vendorId}`, {});

// ── Conversations ─────────────────────────────────────────────────────────────

export const getVendorThreads = (offset = 0) => adminGet<{ threads: ConversationThread[] }>(`/api/v2/admin/conversations/vendors?limit=20&offset=${offset}`);
export const getBrideThreads  = (offset = 0) => adminGet<{ threads: ConversationThread[] }>(`/api/v2/admin/conversations/brides?limit=20&offset=${offset}`);
export const getMessages      = (id: string) => adminGet<{ messages: Message[] }>(`/api/v2/admin/conversations/${id}/messages`);

// ── Hot Dates ─────────────────────────────────────────────────────────────────

export const getHotDates    = ()                                            => adminGet<{ dates: HotDate[] }>('/api/v2/admin/hot-dates');
export const addHotDate     = (body: { date: string; note?: string; region?: string }) => adminPost('/api/v2/admin/hot-dates', body);
export const deleteHotDate  = (id: string)                                 => adminDelete(`/api/v2/admin/hot-dates/${id}`);

// ── Couture ───────────────────────────────────────────────────────────────────

export const getCoutureVendors  = () => adminGet<{ vendors: AdminVendor[] }>('/api/v2/admin/couture');
export const setCoutureEligible = (vendorId: string, eligible: boolean) => adminPost(`/api/v2/admin/couture/eligible/${vendorId}`, { eligible });
