'use client';
// hooks/demo/useDemoData.ts
// Data fetching for demo vendor. NO session. NO auth. Handle-based only.

import { useEffect, useState } from 'react';
import { fetchDemoVendor, fetchDemoLeads } from '@/lib/demo/api';
import type { DemoVendor, DemoLead } from '@/lib/demo/api';

export function useDemoVendor(handle: string) {
  const [vendor,  setVendor]  = useState<DemoVendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!handle) return;
    let alive = true;
    setLoading(true);
    fetchDemoVendor(handle)
      .then(res => { if (alive) setVendor(res.vendor); })
      .catch(err => { if (alive) setError(err.message); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [handle]);

  return { vendor, loading, error };
}

export function useDemoLeads(handle: string) {
  const [leads,   setLeads]   = useState<DemoLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!handle) return;
    let alive = true;
    fetchDemoLeads(handle)
      .then(res => { if (alive) setLeads(res.leads); })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [handle]);

  return { leads, loading };
}
