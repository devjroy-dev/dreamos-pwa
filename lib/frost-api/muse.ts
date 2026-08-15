// lib/frost-api/muse.ts
// Typed muse API client. Requires couple auth JWT.

// F-05.39 (R2): isBrideDemoMode arrives from _base — the estate's ONE home.
// The six-line private copy that stood below was byte-identical to it and is
// deleted; every call site in this file is unchanged.
import { USE_MOCKS, apiGet, apiPost, apiDelete, getCoupleSession, isBrideDemoMode } from './_base';
import type { MuseSave, MuseActivityResponse } from '../types/discover';

// ── Demo mode helpers ────────────────────────────────────────────────────────
const DEMO_MUSE_KEY = 'tdw_demo_muse_saves';

// Aspirational demo saves — what a bride dreams of pinning
const DEMO_MUSE_SAVES: MuseSave[] = [
  {
    id: 'demo-save-1', save_number: 1,
    image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
    source_type: 'vendor', vendor_id: null,
    vendor_name: 'Joseph Radhik', vendor_city: 'Mumbai', vendor_category: 'photographer',
    vendor_starting_price: 850000, vendor_vibe_tags: ['cinematic','luxury','candid'],
    vendor_routing_handle: null, enquire_link: null,
    caption: 'That light. That moment. This is what I want.',
    aesthetic_tags: ['golden_hour','candid','romantic'],
    saved_by_role: 'bride', circle_comment_count: 2,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'demo-save-2', save_number: 2,
    image_url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80',
    source_type: 'vendor', vendor_id: null,
    vendor_name: 'Swati Roy', vendor_city: 'Delhi', vendor_category: 'makeup_artist',
    vendor_starting_price: 320000, vendor_vibe_tags: ['luxury','bridal','celebrity'],
    vendor_routing_handle: null, enquire_link: null,
    caption: 'This exact look for the mehndi.',
    aesthetic_tags: ['dewy','natural','bridal'],
    saved_by_role: 'bride', circle_comment_count: 1,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'demo-save-3', save_number: 3,
    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    source_type: 'vendor', vendor_id: null,
    vendor_name: 'Bloom & Petal', vendor_city: 'Delhi', vendor_category: 'decorator',
    vendor_starting_price: 1800000, vendor_vibe_tags: ['luxury','floral','romantic'],
    vendor_routing_handle: null, enquire_link: null,
    caption: 'The marigold ceiling for the sangeet.',
    aesthetic_tags: ['floral','warm','festive'],
    saved_by_role: 'bride', circle_comment_count: 0,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'demo-save-4', save_number: 4,
    image_url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80',
    source_type: 'vendor', vendor_id: null,
    vendor_name: 'Sabyasachi Mukherjee', vendor_city: 'Kolkata', vendor_category: 'bridal_wear',
    vendor_starting_price: 4200000, vendor_vibe_tags: ['heritage','luxury','traditional'],
    vendor_routing_handle: null, enquire_link: null,
    caption: 'The red. Always the red.',
    aesthetic_tags: ['traditional','rich','bridal'],
    saved_by_role: 'bride', circle_comment_count: 3,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

function getDemoSaves(): MuseSave[] {
  if (typeof window === 'undefined') return DEMO_MUSE_SAVES;
  try {
    const stored = localStorage.getItem(DEMO_MUSE_KEY);
    if (stored) {
      const extra: MuseSave[] = JSON.parse(stored);
      return [...extra, ...DEMO_MUSE_SAVES];
    }
  } catch { /* ignore */ }
  return DEMO_MUSE_SAVES;
}

export interface MuseSavesResponse {
  ok: true;
  saves: MuseSave[];
  total: number;
}

export async function fetchMuseSaves(params?: {
  saved_by?: 'all' | 'bride' | 'circle_member';
  limit?: number;
  offset?: number;
}): Promise<MuseSavesResponse> {
  if (isBrideDemoMode()) {
    const saves = getDemoSaves();
    return { ok: true, saves, total: saves.length };
  }
  const session = getCoupleSession();
  if (!session?.id) return { ok: true, saves: [], total: 0 };
  if (USE_MOCKS) return { ok: true, saves: [], total: 0 };
  return apiGet<MuseSavesResponse>(
    `/api/v2/couple/muse/${session.id}`,
    params as Record<string, string | number | undefined | null>,
  );
}

export async function saveVendorToMuse(vendorId: string, imageUrl: string | null, shareToCircle: boolean = false): Promise<{
  ok: boolean; save_id?: string; save_number?: number; already_saved?: boolean; shared_to_circle?: boolean;
}> {
  if (isBrideDemoMode()) {
    // In demo mode — save to localStorage so muse board shows it
    try {
      const stored = localStorage.getItem(DEMO_MUSE_KEY);
      const existing: MuseSave[] = stored ? JSON.parse(stored) : [];
      const alreadySaved = existing.some(s => s.vendor_id === vendorId && s.image_url === imageUrl);
      if (alreadySaved) return { ok: true, already_saved: true };
      const newSave: MuseSave = {
        id: `demo-saved-${Date.now()}`,
        save_number: DEMO_MUSE_SAVES.length + existing.length + 1,
        image_url: imageUrl,
        source_type: 'vendor',
        vendor_id: vendorId,
        vendor_name: null, vendor_city: null, vendor_category: null,
        vendor_starting_price: null, vendor_vibe_tags: [],
        vendor_routing_handle: null, enquire_link: null,
        caption: null, aesthetic_tags: [],
        saved_by_role: 'bride', circle_comment_count: 0,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(DEMO_MUSE_KEY, JSON.stringify([newSave, ...existing]));
    } catch { /* ignore */ }
    return { ok: true, already_saved: false, save_number: DEMO_MUSE_SAVES.length + 1 };
  }
  if (USE_MOCKS) return { ok: true, already_saved: false };
  return apiPost('/api/v2/couple/muse/save', { vendor_id: vendorId, image_url: imageUrl, share_to_circle: shareToCircle });
}

export async function deleteMuseSave(saveId: string): Promise<boolean> {
  if (USE_MOCKS) return true;
  const res = await apiDelete<{ ok: boolean }>(`/api/v2/couple/muse/${saveId}`);
  return res.ok === true;
}

export async function fetchSaveActivity(saveId: string): Promise<MuseActivityResponse | null> {
  if (USE_MOCKS) return null;
  return apiGet<MuseActivityResponse>(`/api/v2/couple/muse/saves/${saveId}/activity`);
}

// ── Direct upload from phone ───────────────────────────────────────────────
// Reads the File as base64 in the browser, POSTs to /upload with mime + caption.
// Backend handles Cloudinary upload + Vision + Haiku tagging + muse_saves insert.

export interface MuseUploadResponse {
  ok:             boolean;
  save_id?:       string;
  save_number?:   number;
  image_url?:     string;
  aesthetic_tags?: string[];
  error?:         string;
}

// EXPORTED at TDW_15 · P1 · β1. This is a generic File→base64 reader that
// happens to live in a muse-named file, and the receipt-photo client needs the
// identical contract. Exporting it is the one-home answer; copying it into
// `lib/frost/journey.ts` would have been two readers of one browser API drifting
// apart over their data-URI prefix handling. That it lives HERE rather than in a
// neutral home is a real siting question — named for the chair, not taken,
// because moving it is a retire-with-the-reader job and this is a UI sitting.
export function fileToBase64(file: File): Promise<{ data: string; mime: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // result is "data:image/jpeg;base64,<...>"
      const commaIdx = result.indexOf(',');
      if (commaIdx === -1) return reject(new Error('FileReader returned unexpected format'));
      const data = result.slice(commaIdx + 1);
      const mime = file.type || 'image/jpeg';
      resolve({ data, mime });
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

export async function uploadMuseImage(file: File, caption?: string): Promise<MuseUploadResponse> {
  if (isBrideDemoMode()) {
    // Demo mode — fake a save with a blob URL so the board updates locally
    try {
      const stored = localStorage.getItem(DEMO_MUSE_KEY);
      const existing: MuseSave[] = stored ? JSON.parse(stored) : [];
      const blobUrl = URL.createObjectURL(file);
      const newSave: MuseSave = {
        id: `demo-uploaded-${Date.now()}`,
        save_number: DEMO_MUSE_SAVES.length + existing.length + 1,
        image_url: blobUrl,
        source_type: 'image',
        vendor_id: null,
        vendor_name: null, vendor_city: null, vendor_category: null,
        vendor_starting_price: null, vendor_vibe_tags: [],
        vendor_routing_handle: null, enquire_link: null,
        caption: caption || null, aesthetic_tags: [],
        saved_by_role: 'bride', circle_comment_count: 0,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(DEMO_MUSE_KEY, JSON.stringify([newSave, ...existing]));
      return { ok: true, save_id: newSave.id, image_url: blobUrl };
    } catch { /* ignore */ }
    return { ok: true };
  }
  if (USE_MOCKS) return { ok: true };
  const { data, mime } = await fileToBase64(file);
  return apiPost<MuseUploadResponse>('/api/v2/couple/muse/upload', {
    image_base64: data,
    mime,
    caption: caption || undefined,
  });
}

// ── Add from URL (Pinterest / IG / direct) ────────────────────────────────
// Previously stubbed in journey.ts — this is the real implementation.
export async function createMuseSaveFromUrl(url: string, caption?: string): Promise<MuseUploadResponse> {
  if (isBrideDemoMode()) {
    // Demo mode — fake the save
    try {
      const stored = localStorage.getItem(DEMO_MUSE_KEY);
      const existing: MuseSave[] = stored ? JSON.parse(stored) : [];
      const newSave: MuseSave = {
        id: `demo-fromurl-${Date.now()}`,
        save_number: DEMO_MUSE_SAVES.length + existing.length + 1,
        image_url: url,
        source_type: 'link',
        vendor_id: null,
        vendor_name: null, vendor_city: null, vendor_category: null,
        vendor_starting_price: null, vendor_vibe_tags: [],
        vendor_routing_handle: null, enquire_link: null,
        caption: caption || null, aesthetic_tags: [],
        saved_by_role: 'bride', circle_comment_count: 0,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(DEMO_MUSE_KEY, JSON.stringify([newSave, ...existing]));
      return { ok: true, save_id: newSave.id, image_url: url };
    } catch { /* ignore */ }
    return { ok: true };
  }
  if (USE_MOCKS) return { ok: true };
  return apiPost<MuseUploadResponse>('/api/v2/couple/muse/add-url', {
    url,
    caption: caption || undefined,
  });
}
