// app/(frost)/frost/canvas/discover/page.tsx
//
// ── TDW_07 P6 · F-07.43 「 F-D 」 — THIS DECK IS FOLDED AND GONE ─────────────────────
//
// The founder ruled it in two letters: sanctuary's Discover room IS the couple Discover
// surface. What stood here was 1,024 lines of a second deck — its own filter sheet, its
// own top chrome, its own empty states, its own GlassOverlay — reachable by nothing.
// Estate-wide census at 082117a and again at this base: ZERO inbound navigation. No
// router.push, no <Link>, no middleware rewrite. `/frost` replaces straight to
// /frost/canvas/sanctuary (frost/page.tsx:11) and always has.
//
// EVERYTHING WORTH KEEPING TRAVELLED, THROUGH SHARED HOMES, NEVER AS A COPY:
//   · the profile body ......... components/shared/VendorProfileView  (F-07.68's cure)
//   · the position indicator ... components/shared/ImageDots          (one component now)
//   · the carousel mechanics ... lib/frost/photoPager                 (Fork 3(b), η(c))
//   · the IG chip .............. components/shared/VendorProfileView  (D-3)
//   · the FEATURED eyebrow ..... components/shared/VendorProfileView  (F-07.67's cure)
//   · LQIP + card variants ..... lib/frost-api/img                    (spec P6)
//
// WHAT DIED WITH IT, EACH WITH ITS REASON:
//   · the Mode axis (Couture/Spotlight/Featured/Look Book) — a dead control: neither
//     deck's fetch ever sent `mode`, so four chips changed only their own colour
//   · `?blind=1` — a URL entry no link in the estate ever minted
//   · the ✦ Sanctuary pill — the room is inside sanctuary; there is nowhere to go
//   · `isBrideDemoDiscover()` + the hard redirect to demodiscover.thedreamwedding.in —
//     a localStorage read (§3) and a demo-lifecycle behaviour; FILED to Block 08 beside
//     F-07.29 rather than smuggled into the fold
//
// ── WHY A REDIRECT AND NOT A DELETED FILE ──────────────────────────────────────────
// The route had no inbound links, but it was live for the whole block and a bookmark or
// a pasted URL costs nothing to honour. A 404 would teach a couple that the product lost
// something; this lands her on the real thing. It is three lines against a silent
// dead end, and the dead end is the worse product.

import { redirect } from 'next/navigation';

export default function DiscoverCanvasRedirect() {
  redirect('/frost/canvas/sanctuary');
}
