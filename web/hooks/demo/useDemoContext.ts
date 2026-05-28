'use client';
// hooks/demo/useDemoContext.ts
// Shared demo vendor context. Reads handle from URL, fetches vendor profile.
// NO session. NO auth. The handle IS the identity.
// Used by every demo page to get vendorId and vendorName.

import { useEffect, useState } from 'react';
import { fetchDemoVendor } from '@/lib/demo/api';
import type { DemoVendor } from '@/lib/demo/api';

// The demo vendor's UUID in the real DB — needed to fetch leads/context
// via the demo endpoints which use demo_vendor_id not a real vendor UUID.
// We use the ig_handle for all demo API calls, not the UUID.

export interface DemoContext {
  handle:       string;
  vendor:       DemoVendor | null;
  loading:      boolean;
  // These mimic the real VendorSession shape so real components can use them
  vendorId:     string;   // demo vendor's DB uuid
  vendorName:   string | null;
  tier:         string;   // always 'signature' for demo
}

export function useDemoContext(handle: string): DemoContext {
  const [vendor,  setVendor]  = useState<DemoVendor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!handle) return;
    let alive = true;
    fetchDemoVendor(handle)
      .then(res => { if (alive) setVendor(res.vendor); })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [handle]);

  return {
    handle,
    vendor,
    loading,
    vendorId:   vendor?.id   ?? '',
    vendorName: vendor?.display_name ?? null,
    tier:       'signature',
  };
}
