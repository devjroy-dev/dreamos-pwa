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

/** One home for the initials rule, so the seed and the wire read cannot disagree on shape. */
function initialsOf(name: string | null | undefined): string {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((w) => w[0]!.toUpperCase()).join('');
}

/** Initials for the medallion. Same fetch, same home — two facts off one wire read. */
export function useVendorInitials(): string {
  const [ini, setIni] = useState('');
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const session = getVendorSession();
    if (!session?.access_token) return;

    // ── F-38.19 · SEED FROM THE SESSION BEFORE ASKING THE NETWORK ─────────────
    // Founder's walk: 「look at image 3 avatar. before loading DR it shows this」 — the coin
    // painted its fallback glyph, then swapped to DR once /api/v2/vendor/me came back. On
    // Fast 4G that is most of a second of a vendor watching a placeholder identity turn
    // into his own.
    //
    // THE NAME WAS ALREADY IN HAND. `getVendorSession()` reads localStorage and carries
    // `name`; the old Header never had this flicker precisely because it took the name
    // from the session synchronously and never waited on a wire read for it. This hook
    // asked the network a question it could already answer.
    //
    // THE FETCH IS NOT REMOVED — IT CORRECTS. A session name can be stale (renamed on
    // another device, or edited in Settings and the session not yet rewritten), and the
    // server is the truth. So the seed paints immediately and the wire read overwrites it
    // if it differs. What goes is the WAIT, not the check.
    //
    // IT SEEDS IN THE EFFECT AND NOT IN useState's INITIALISER, deliberately: this
    // component is server-rendered before it hydrates, `window` does not exist there, and
    // seeding at first render would make the server emit the glyph while the client emits
    // DR — a hydration mismatch traded for a flicker. One frame is not perceptible; a
    // hydration error is a different defect wearing the cure's clothes.
    const seeded = initialsOf(session.name);
    if (seeded) setIni(seeded);

    let live = true;
    getJson<{ ok: boolean; vendor?: { name?: string | null } }>('/api/v2/vendor/me', true)
      .then((d) => {
        if (!live || !d.ok) return;
        // Only overwrite on a real answer. An empty name from the wire must not blank a
        // seed that is currently correct — failing closed means keeping what we had.
        const fresh = initialsOf(d.vendor?.name);
        if (fresh) setIni(fresh);
      })
      .catch(() => { /* fail closed — the glyph stands in */ });
    return () => { live = false; };
  }, []);
  return ini;
}
