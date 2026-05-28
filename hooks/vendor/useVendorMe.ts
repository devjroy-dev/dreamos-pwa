'use client';
// hooks/useVendorMe.ts
// Lightweight fetch of /api/v2/vendor/me. Used by the Atelier Header so every
// page can display the vendor's business_name (e.g. "Dev Roy Photo") rather
// than the user's first name from the session.
//
// Fails gracefully — never throws into render. Caller falls back to whatever
// name they have on hand (e.g. session.name) when this returns null.

import { useEffect, useState } from 'react';
import { fetchMe } from '@/lib/vendor/api/vendor';

interface VendorMeMinimal {
  business_name: string | null;
  name:          string | null;
  category:      string | null;
  city:          string | null;
}

export function useVendorMe(): VendorMeMinimal | null {
  const [me, setMe] = useState<VendorMeMinimal | null>(null);

  useEffect(() => {
    let alive = true;
    fetchMe()
      .then(res => {
        if (!alive) return;
        if (res?.ok && res.vendor) {
          setMe({
            business_name: res.vendor.business_name || null,
            name:          res.vendor.name || null,
            category:      res.vendor.category || null,
            city:          res.vendor.city || null,
          });
        }
      })
      .catch(() => { /* silent — header will fall back */ });
    return () => { alive = false; };
  }, []);

  return me;
}
