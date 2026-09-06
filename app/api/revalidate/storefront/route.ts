// app/api/revalidate/storefront/route.ts
// TDW_19 · G3.1 · R-G31.7 — THE ESTATE'S FIRST ON-DEMAND REVALIDATION.
//
// ═══════════════════════════════════════════════════════════════════════════
// WHY THIS EXISTS: A CONSENT SWITCH THAT LIES FOR FIVE MINUTES IS NOT A SWITCH
// ═══════════════════════════════════════════════════════════════════════════
// F-40.187, founder-walked. `app/v/[code]/page.tsx` exports `revalidate = 300`,
// bought deliberately at P2-A so a couple arriving from a WhatsApp forward on
// mobile data gets the storefront from the edge. R-40.77 then put a PERMISSION
// behind that cache. The founder turned the switch OFF, reloaded, and the check
// control was still there — served from a card fetched while it was still on.
// The door refused correctly and the guest read a miss.
//
// Both halves behaved exactly as specified and the composition lied. R-G31.7
// ruled arm (a): rebuild HER page on toggle, keep the cache for every stranger.
// (b) — making the leaf dynamic — was refused: it spends P2-A's cache for every
// visitor to buy correctness for a rare toggle. (c) — accepting the window —
// was refused because the window IS the lie.
//
// ── THE HANDLE COMES FROM THE SESSION, NEVER FROM THE BODY ─────────────────
// This route takes NO parameters. It reads the caller's own Authorization
// header, asks dream-os `GET /api/v2/vendor/me` who that token belongs to, and
// revalidates THAT vendor's path. A body-supplied handle would let any
// authenticated vendor rebuild any other vendor's page — a small harm, but it
// is the shape of a cross-tenant write and this estate does not ship those.
//
// ⚠ AND THAT IS ALSO WHY IT DOES NOT VERIFY THE JWT ITSELF. The pwa's session
// is a Bearer token in localStorage (`lib/vendor/api/_base.ts:45`), not a
// server-readable cookie, so this route cannot read a session the way a
// cookie-session app would. Verifying the signature here would mean a SECOND
// home for the rule about what a valid vendor token is — dream-os owns that.
// Asking the door costs one round trip on a rare action and keeps one home.
//
// ⚠ IT IS NOT A PUBLIC LANE. `/api/revalidate/**` is a vendor action behind a
// vendor's session; it does not join C38's PUBLIC_LANES, and `b40` asserts it
// refuses without a session.

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://dream-os-production.up.railway.app';

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  // No session, no rebuild. 401 and nothing else — this route reveals nothing
  // about whether any handle exists.
  if (!auth || !/^Bearer\s+.+/i.test(auth)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let handle: string | null = null;
  try {
    // ⚠ `cache: 'no-store'` — the whole point of this route is freshness, and a
    // cached identity read would be the same defect one layer up.
    const r = await fetch(`${API_BASE}/api/v2/vendor/me`, {
      headers: { Authorization: auth },
      cache: 'no-store',
    });
    if (!r.ok) return NextResponse.json({ ok: false }, { status: 401 });
    const j = await r.json();
    const h = j?.vendor?.routing_handle;
    handle = typeof h === 'string' && h.trim() ? h.trim().toLowerCase() : null;
  } catch {
    // A door that could not be reached is not an authorisation. Fail closed.
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  // A vendor with no handle has no public page to rebuild. Not an error on her
  // part and not a failure of the toggle — the write already succeeded.
  if (!handle) return NextResponse.json({ ok: true, revalidated: false });

  revalidatePath(`/v/${handle}`);
  return NextResponse.json({ ok: true, revalidated: true });
}
