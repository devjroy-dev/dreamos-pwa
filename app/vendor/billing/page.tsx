// /vendor/billing — REDIRECT STUB · CE-39 ROAD STEP 2c, arm E-2
//
// ── WHY THIS DOOR CLOSED, IN THE FOUNDER'S OWN WORDS ────────────────────────
// On the 2a walk he typed `/vendor/billing` on the worklist alias and got the
// dark-tree Billing back: 「why is the old billing still showing — don't want
// it」. The `/w/billing` room had already crossed; this page was the same
// surface reachable at a second address, and a room with two addresses is a
// room that can disagree with itself.
//
// ── WHY A STUB AND NOT A DELETION ───────────────────────────────────────────
// Deep-link law: the path answers, never 404s. A bookmark, an old share, the
// capped-meter href that `src/lib/pwaPaths.js` still mints as `/vendor/billing`
// until the Phase 7 flip — all of them land here and are carried to the room
// that now owns the surface. `app/vendor/studio/page.tsx` is this shape's
// precedent in this tree and this file follows it deliberately.
//
// ── WHAT DID NOT MOVE ───────────────────────────────────────────────────────
// The Billing surface itself. `components/worklist/BillingRoom.tsx` has been
// its one home since the crossing; this file never held a copy, only a second
// mount of the settings shell around the same values. Nothing is carried across
// because there was nothing here to carry — the control inventory for this arm
// is ONE row: the address.
//
// ── AND AT PHASE 7 THIS FILE INVERTS ────────────────────────────────────────
// Arm (a) swaps the paths: `/w/` retires INTO `/vendor/`. So the redirect
// reverses direction rather than being deleted, and `src/lib/pwaPaths.js`'s
// `billing` value stops being a stale spelling and becomes the live one. Stated
// here so the next seat re-points this line rather than re-deriving why it
// exists.

import { redirect } from 'next/navigation';

export default function VendorBillingRedirect() {
  redirect('/w/billing');
}
