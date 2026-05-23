// lib/frost-api/muse.ts
// Typed muse API client. Requires couple auth JWT.

import { USE_MOCKS, apiGet, apiPost, apiDelete, getCoupleSession } from './_base';
import type { MuseSave, MuseActivityResponse } from '../types/discover';

// ── Demo mode helpers ────────────────────────────────────────────────────────
const DEMO_MUSE_KEY = 'tdw_demo_muse_saves';

function isBrideDemoMode(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const s = localStorage.getItem('tdw_bride_demo_session');
    return !!s && JSON.parse(s).demo === true;
  } catch { return false; }
}

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

export async function saveVendorToMuse(vendorId: string, imageUrl: string | null): Promise<{
  ok: boolean; save_id?: string; save_number?: number; already_saved?: boolean;
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
  return apiPost('/api/v2/couple/muse/save', { vendor_id: vendorId, image_url: imageUrl });
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
