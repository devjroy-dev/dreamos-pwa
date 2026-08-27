"use client";
// hooks/vendor/useVendorHandle.ts — ONE HOME for the routing handle on the branch shell.
//
// Two surfaces now need it: the Rooms link card and the first-run link card. Reading it twice
// would be two homes for one fact and two chances to read the wrong field — which is exactly
// the defect that hid card 1 through ZIP 1, when this seat read `routing_handle` (the settings
// page’s LOCAL variable name) instead of `handle` (the wire field, dream-os me.js:76).
//
// FAILS CLOSED. No session, no handle, or a rejected fetch all yield null, and a null handle
// hides the affordance entirely rather than rendering a link with nothing behind it.
import { useEffect, useState } from 'react';
import { getVendorSession } from '@/lib/vendor/session';
import { getJson } from '@/lib/vendor/api/_base';

export function useVendorHandle(): string | null {
  const [handle, setHandle] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!getVendorSession()?.access_token) return;
    let live = true;
    getJson<{ ok: boolean; vendor?: { handle?: string | null } }>('/api/v2/vendor/me', true)
      .then((d) => { if (!live || !d.ok) return; const h = d.vendor?.handle?.trim(); setHandle(h ? h.toUpperCase() : null); })
      .catch(() => { /* fail closed */ });
    return () => { live = false; };
  }, []);
  return handle;
}

/** The medallion's initials. Same fetch, same home — two facts off one wire read, never two. */
export function useVendorInitials(): string {
  const [ini, setIni] = useState('');
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!getVendorSession()?.access_token) return;
    let live = true;
    getJson<{ ok: boolean; vendor?: { name?: string | null } }>('/api/v2/vendor/me', true)
      .then((d) => {
        if (!live || !d.ok) return;
        const parts = (d.vendor?.name || '').trim().split(/\s+/).filter(Boolean);
        setIni(parts.slice(0, 2).map((w) => w[0]!.toUpperCase()).join(''));
      })
      .catch(() => { /* fail closed — the glyph stands in */ });
    return () => { live = false; };
  }, []);
  return ini;
}
