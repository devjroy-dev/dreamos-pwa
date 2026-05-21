#!/usr/bin/env python3
"""B-2a writer: discover.ts"""
import os
DEST = '/workspaces/dreamos-pwa/lib/frost-api/discover.ts'
CONTENT = "// lib/frost-api/discover.ts\n// Typed discover API client. Public endpoints — no auth required.\n\nimport { USE_MOCKS, API_BASE, apiGet } from './_base';\nimport type { DiscoverVendor, FeaturedCollection, DiscoverHero } from '../types/discover';\n\nconst WHATSAPP_NUMBER = '917982159047';\n\nexport function makeEnquireLink(routingHandle: string): string {\n  return `https://wa.me/${WHATSAPP_NUMBER}?text=TDW-${routingHandle}`;\n}\n\nexport interface DiscoverFeedResponse {\n  ok: true;\n  vendors: DiscoverVendor[];\n  page: number;\n  has_more: boolean;\n  total: number;\n}\n\nexport async function fetchDiscoverFeed(params?: {\n  category?: string;\n  city?: string;\n  budget?: string;\n  vibes?: string;\n  page?: number;\n}): Promise<DiscoverFeedResponse> {\n  if (USE_MOCKS) return { ok: true, vendors: [], has_more: false, page: 0, total: 0 };\n  return apiGet<DiscoverFeedResponse>('/api/v2/discover/feed', params as Record<string, string | number | undefined | null>);\n}\n\nexport async function fetchFeatured(): Promise<{ ok: true; collections: FeaturedCollection[] }> {\n  if (USE_MOCKS) return { ok: true, collections: [] };\n  return apiGet('/api/v2/discover/featured');\n}\n\nexport async function fetchHeroes(): Promise<{ ok: true; heroes: DiscoverHero[] }> {\n  if (USE_MOCKS) return { ok: true, heroes: [] };\n  return apiGet('/api/v2/discover/heroes');\n}\n"
os.makedirs(os.path.dirname(DEST), exist_ok=True)
with open(DEST, 'w') as f:
    f.write(CONTENT)
print(f"Written {len(CONTENT)} chars → {DEST}")
