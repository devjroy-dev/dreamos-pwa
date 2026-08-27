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

// ── F-38.21 · THE HANDLE IS CACHED, BECAUSE IT IS NOT IN THE SESSION ────────
//
// Founder: 「same problem with your TDW link. it takes a few seconds to load and then
// displaces whatever is there in its place.」
//
// SAME SHAPE AS F-38.19, ONE MATERIAL DIFFERENCE. The medallion's cure was to seed from
// `getVendorSession()`, which already carries `name`. **`VendorSession` has no `handle`** —
// derived, not assumed: its fields are id, user_id, name, phone, tier, access_token,
// refresh_token. So there was nothing local to seed from, and the card genuinely could not
// know whether to exist until the wire answered. It then appeared mid-feed and pushed
// everything below it down.
//
// SO THE ANSWER IS A CACHE, AND IT IS NAMED ONE. This key is NOT session truth and must
// never be read as authorisation for anything: it is a remembered answer to a question the
// server owns, kept so the SECOND load does not re-ask before it can lay out. The wire read
// still runs on every mount and still wins.
//
// ⚠ WHAT THIS DOES NOT FIX, STATED PLAINLY: the FIRST-EVER load on a device still has no
// cached answer, so the card still arrives late and still displaces. Removing that entirely
// means the conditional card cannot sit ABOVE other cards — it would have to be last, so
// its arrival appends instead of inserting. That is a change to R-37.68-B's ruled order
// (work reaches him, then he runs it) and is the chair's, not this seat's. Cached here,
// reported there.
const HANDLE_KEY = 'tdw_vendor_handle';

export function useVendorHandle(): string | null {
  const [handle, setHandle] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!getVendorSession()?.access_token) return;

    // Seeded in the effect, not in useState's initialiser: this tree is server-rendered
    // before it hydrates, and seeding at first render would emit one markup on the server
    // and another on the client. A hydration mismatch is not an improvement on a reflow.
    try {
      const cached = localStorage.getItem(HANDLE_KEY);
      if (cached) setHandle(cached);
    } catch { /* private mode — the wire read below still answers */ }

    let live = true;
    getJson<{ ok: boolean; vendor?: { handle?: string | null } }>('/api/v2/vendor/me', true)
      .then((d) => {
        if (!live || !d.ok) return;
        const h = d.vendor?.handle?.trim();
        const next = h ? h.toUpperCase() : null;
        setHandle(next);
        // THE CACHE IS CORRECTED IN BOTH DIRECTIONS. A handle that was REMOVED server-side
        // must clear the key, or the card would go on rendering a link that no longer
        // routes anywhere — which is the never-404 failure with a stale cache behind it.
        try {
          if (next) localStorage.setItem(HANDLE_KEY, next);
          else localStorage.removeItem(HANDLE_KEY);
        } catch { /* non-fatal */ }
      })
      .catch(() => { /* fail closed — the cached answer stands until the wire disagrees */ });
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
