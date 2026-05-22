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

export type InviteCode = {
  code: string; kind: string; tier: string | null; intended_phone: string | null;
  notes: string | null; created_by: string | null;
  created_at: string; consumed_at: string | null; consumed_by_phone: string | null;
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

export type DiscoverRequest = {
  id: string; vendor_id: string; vendor_name: string; vendor_category: string;
  vendor_city: string; discover_request_state: string; created_at: string;
  portfolio_count: number;
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
export const patchVendorRevoke = (id: string) => adminPatch(`/api/v2/admin/vendors/${id}/revoke`, {});

// ── Couples ───────────────────────────────────────────────────────────────────

export const getCouples = () => adminGet<{ couples: AdminCouple[] }>('/api/v2/admin/couples');
export const patchCoupleTier = (id: string, tier: string) => adminPatch(`/api/v2/admin/couples/${id}/tier`, { tier });

// ── Invites ───────────────────────────────────────────────────────────────────

export const getInvites = () => adminGet<{ invites: InviteCode[] }>('/api/v2/admin/invites');
export const getWaLinks = () => adminGet<{ vendor: string; couple: string; note: string }>('/api/v2/admin/invites/whatsapp-links');
export const generateInvites = (body: { kind: string; tier?: string; intended_phone?: string; name?: string; notes?: string; count?: number }) =>
  adminPost<{ codes: InviteCode[] }>('/api/v2/admin/invites/generate', body);
export const deleteInvite = (code: string) => adminDelete(`/api/v2/admin/invites/${code}`);

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
export const denyDiscover     = (vendorId: string)                => adminPost(`/api/v2/admin/discover/deny/${vendorId}`, {});
export const revokeDiscover   = (vendorId: string)                => adminPost(`/api/v2/admin/discover/revoke/${vendorId}`, {});

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
