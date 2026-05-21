// lib/frost-api/muse.ts
// Typed muse API client. Requires couple auth JWT.

import { USE_MOCKS, apiGet, apiPost, apiDelete, getCoupleSession } from './_base';
import type { MuseSave, MuseActivityResponse } from '../types/discover';

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
  const session = getCoupleSession();
  if (!session?.id) return { ok: true, saves: [], total: 0 };
  if (USE_MOCKS) return { ok: true, saves: [], total: 0 };
  return apiGet<MuseSavesResponse>(
    `/api/v2/couple/muse/${session.id}`,
    params as Record<string, string | number | undefined | null>,
  );
}

export async function saveVendorToMuse(vendorId: string): Promise<{
  ok: boolean; save_id?: string; save_number?: number; already_saved?: boolean;
}> {
  if (USE_MOCKS) return { ok: true, already_saved: false };
  return apiPost('/api/v2/couple/muse/save', { vendor_id: vendorId });
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
