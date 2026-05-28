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
import { getMockMe } from '@/lib/vendor/mocks/vendor';
import { isDemoMode } from '@/lib/vendor/demo';

interface VendorMeMinimal {
  business_name: string | null;
  name:          string | null;
  category:      string | null;
  city:          string | null;
}

function demoMe(): VendorMeMinimal {
  // Prefer the live URL params (real demo vendor's name/category/city) over
  // the static mock so the header reads as their studio, not "Frost Studio".
  if (typeof window !== 'undefined') {
    try {
      const p = new URLSearchParams(window.location.search);
      const name     = p.get('name');
      const category = p.get('category');
      const city     = p.get('city');
      if (name || category || city) {
        return {
          business_name: name ? decodeURIComponent(name) : null,
          name:          name ? decodeURIComponent(name) : null,
          category:      category || null,
          city:          city ? decodeURIComponent(city) : null,
        };
      }
    } catch { /* fall through to mock */ }
  }
  const v = getMockMe().vendor;
  return { business_name: v.business_name, name: v.name, category: v.category, city: v.city };
}

export function useVendorMe(): VendorMeMinimal | null {
  const [me, setMe] = useState<VendorMeMinimal | null>(null);

  useEffect(() => {
    let alive = true;
    if (isDemoMode()) {
      setMe(demoMe());
      return;
    }
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
