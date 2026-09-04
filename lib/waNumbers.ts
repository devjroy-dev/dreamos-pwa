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

// ── THE SUPPORT NUMBER · M-WORKLIST Phase 1, R-37.67 ────────────────────────
//
// DELIBERATELY NOT A `WaLane`, AND DELIBERATELY UNTWINNED. Two derivations, both stated so
// a later reader does not "fix" this into the union:
//
//   (a) IT IS NOT A LANE. `WaLane` names the two Meta Cloud API lanes — each with its own
//       PNID, its own agent and its own WABA routing. Support is a person's handset: no
//       PNID, no template, no engine. Folding it into the lane union is the category mix
//       \u00a78.5 refused when it declined to fold a money fact into a team kind.
//
//   (b) THE TWIN WOULD HAVE TO LIE. dream-os/src/lib/waNumbers.js ends its switch with
//       `default: throw new RangeError(...'expected vendor | bride')`. Widening the union
//       means either loosening that guard on a live backend for a lane the server will
//       never send on, or leaving the twins asymmetric on their most load-bearing type.
//
// SO: A DECLARED PWA-ONLY CONSTANT, WITH NO TWIN AND SAYING SO. This file's own header
// records that the failure it exists to prevent is not divergence but SILENT divergence —
// a declared asymmetry carrying its reason is what that header calls the cure.
//
// ENV-FIRST WITH A FLOOR, the pattern above: an unset var must still yield a number that
// ANSWERS. The founder's "we wire that later" is therefore a dashboard change and no deploy.
export const SUPPORT_WA_NUMBER = '919888294440';

export function supportWaNumber(): string {
  return process.env.NEXT_PUBLIC_TDW_SUPPORT_WA_NUMBER || SUPPORT_WA_NUMBER;
}

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
