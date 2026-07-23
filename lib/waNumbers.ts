// lib/waNumbers.ts — TDW_05 P4 closing micro, F-05.24's home.
//
// THE FINDING. app/(frost)/frost/canvas/sanctuary/page.tsx declared
// DREAMAI_WA_NUMBER = '14787788550' — the DEAD Twilio sandbox number — and
// rendered it as a live <a href> to a bride. Same defect class as F-05.23 (which
// poisoned circle-invite links from inside a Postgres function), found in the
// same sweep, on a different plane.
//
// ── WHY A TWIN AND NOT AN IMPORT: THE HOME, DERIVED ─────────────────────────
//
// dream-os owns src/lib/waNumbers.js, the canonical home. This file CANNOT import
// it — separate repo, separate deploy target (Railway/Node vs Vercel/Next). Two
// alternatives were checked before twinning, because a twin is a cost and must be
// the last option, not the first:
//
//   (a) AN API-SERVED VALUE. Rejected on evidence: nothing already flows. The one
//       wa link that DOES reach this page from the server is `wa_me_link` off the
//       invite_circle_member RPC (page.tsx ~:2298) — a PER-INVITE link carrying a
//       token, not a number, and cured separately by migration 0099. The only
//       endpoint that serves the pair, /whatsapp-links, is requireAdmin-gated and
//       unreachable from a bride's session. Building an endpoint to serve two
//       constants would add a network round trip, a failure mode, and a loading
//       state to a value that changes when the founder buys a SIM.
//
//   (b) A SHARED PACKAGE. Out of scope for a closing micro and a real change to
//       two deploy pipelines. Named, not taken.
//
// So: A DECLARED DRIFT PAIR, in F-04.104's class — two homes that CAN diverge,
// where the cure is that each one SAYS SO in its own comment rather than pretending
// to be unique. The failure this file exists to prevent is not divergence; it is
// SILENT divergence.
//
//   THE OTHER HOME:  dream-os · src/lib/waNumbers.js
//   THE AUTHORITY:   the founder's canonical word, CE-62, re-confirmed CE-63
//   IF YOU CHANGE ONE, CHANGE THE OTHER. There is no build step that will catch
//   you. There is a third home too — db/migrations/0099_circle_invite_link_fix.sql
//   hardcodes the bride number because SQL cannot read either of these files, and
//   says so in the function's own comment.
//
// ── ENV. Next.js only exposes NEXT_PUBLIC_-prefixed vars to the browser, and this
// page is a client component. The env read is kept so a number change can ship
// without a code change, and the constant is the floor beneath it — an unset var
// must still yield a number that ANSWERS, which is the whole of F-05.24.

export const VENDOR_WA_NUMBER = '917982159047';
export const BRIDE_WA_NUMBER  = '917011788380';

export type WaLane = 'vendor' | 'bride';

export function waNumberFor(lane: WaLane): string {
  switch (lane) {
    case 'vendor':
      return process.env.NEXT_PUBLIC_TDW_WA_NUMBER || VENDOR_WA_NUMBER;
    case 'bride':
      // Deliberately does NOT fall through to the vendor var. That fall-through IS
      // the mis-route cured on the server side at coupleInvite.js:5 this same
      // sitting; reproducing it here would reintroduce the bug on the other plane.
      return process.env.NEXT_PUBLIC_TDW_WA_NUMBER_BRIDE || BRIDE_WA_NUMBER;
  }
}
