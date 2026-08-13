'use client';
// components/frost/_shared/coupleAccessToken.ts
//
// TDW_13 · D-4 · MOVED ONCE. Byte-identical to sanctuary/page.tsx:65-98 at
// b1448c4. It stays ONE door: this is the file's single token authority and
// moving it did not mint a second.
import { getAccessToken } from '@/lib/frost-api/_base';

// ── F-07.70 · THE ONE TOKEN DOOR FOR THIS FILE (fork A′-iii, CE-ruled) ────────
// EVERY token read on this surface now goes through here, and here goes through
// lib/frost-api/_base.ts's `getAccessToken()` — the authority that carries
// F-07.65's LANE ASSERTION. Before this cure TWELVE reads in this file called
// localStorage.getItem('access_token') directly and were therefore blind to that
// assertion: on a device where a vendor signed in last, the bare slot holds HIS
// JWT, the authority refuses it, and these twelve handed it to the server anyway
// as if it were hers. That is the crossover disease, and this room was the last
// one in the estate still carrying it.
//
// THE FALLBACK IS THE DEMO LANE'S ONLY DOOR, and naming its mechanism here is
// F-06.85's standing law rather than politeness: app/demo/bride/page.tsx:42
// writes `access_token: 'demo_bride_token'` INSIDE the couple_session blob and
// never writes the bare key at all. Six sites in this file carried
// `bare || s?.token || s?.access_token` for exactly that reason, and dropping it
// would have logged the demo bride out of six surfaces. If that writer ever moves
// its token to the bare key, this fallback becomes dead and should be REMOVED,
// not left to rot.
//
// THE FALLBACK CANNOT RE-ADMIT THE CROSSOVER, which is the whole reason it is
// allowed to survive: it reads the COUPLE blob, and the couple blob is the couple
// lane's own record. The assertion refuses the bare slot by comparing it against
// the VENDOR blob (_base.ts:189-202). No writer in this repo puts a vendor token
// into couple_session, so this door is not one the vendor can walk through.
export function coupleAccessToken(): string | null {
  const authoritative = getAccessToken();
  if (authoritative) return authoritative;
  try {
    const raw = localStorage.getItem('couple_session') || localStorage.getItem('couple_web_session');
    if (!raw) return null;
    const s = JSON.parse(raw) as { token?: string; access_token?: string };
    return s?.token || s?.access_token || null;
  } catch { return null; }
}
