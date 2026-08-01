// lib/frost-api/discover.ts
// Typed discover API client. Public endpoints — no auth required.

import { USE_MOCKS, API_BASE, apiGet } from './_base';
import type { DiscoverVendor, FeaturedCollection, DiscoverHero } from '../types/discover';
import { waNumberFor } from '@/lib/waNumbers';

// ── F-07.69 CURED · TDW_07 P6 ────────────────────────────────────────────────
// This was a raw '917982159047' literal — one of four copies standing against
// lib/waNumbers.ts:45's one home (F-05.20's class). The vendor line's number is
// not this file's to know. The two remaining copies are FILED by CE ruling:
// app/vendor/settings/page.tsx:91 (founder-sequenced) and app/demodiscover/page.tsx:187
// (Block 08, beside F-07.29).
const WHATSAPP_NUMBER = waNumberFor('vendor');

export function makeEnquireLink(routingHandle: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=TDW-${routingHandle}`;
}

export interface DiscoverFeedResponse {
  ok: true;
  vendors: DiscoverVendor[];
  page: number;
  has_more: boolean;
  total: number;
}

export async function fetchDiscoverFeed(params?: {
  category?: string;
  city?: string;
  budget?: string;
  vibes?: string;
  page?: number;
}): Promise<DiscoverFeedResponse> {
  if (USE_MOCKS) return { ok: true, vendors: [], has_more: false, page: 0, total: 0 };
  return apiGet<DiscoverFeedResponse>('/api/v2/discover/feed', params as Record<string, string | number | undefined | null>);
}

export async function fetchFeatured(): Promise<{ ok: true; collections: FeaturedCollection[] }> {
  if (USE_MOCKS) return { ok: true, collections: [] };
  return apiGet('/api/v2/discover/featured');
}

export async function fetchHeroes(): Promise<{ ok: true; heroes: DiscoverHero[] }> {
  if (USE_MOCKS) return { ok: true, heroes: [] };
  return apiGet('/api/v2/discover/heroes');
}
