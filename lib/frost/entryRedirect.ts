// lib/frost/entryRedirect.ts — F-41.1 THE FRONT DOOR READS THE SESSION, pure.
//
// A signed-in member who types the domain lands on the marketing page today
// (app/(landing)/page.tsx wrote vendor_session / couple_session and never read
// either on mount). The cure is one read on mount at `/`: a present vendor
// session → /vendor/rooms, a couple → /frost. Nothing else on the landing page
// changes. §6.6 (R-41 A1 veto): no trap — Back is the browser's; this redirect
// covers re-entry, not navigation.
//
// Pure so the bench drives all four cells; the landing page calls it with
// getVendorSession() / getCoupleSession() from lib/frost-api/_base (the one home
// for session reads). A vendor session wins if both are somehow present: the
// vendor shell is the surface the founder walks first (kickoff §7).

export type EntryDestination = '/vendor/rooms' | '/frost' | null;

export function entryRedirectFor(hasVendorSession: boolean, hasCoupleSession: boolean): EntryDestination {
  if (hasVendorSession) return '/vendor/rooms';
  if (hasCoupleSession) return '/frost';
  return null;
}
