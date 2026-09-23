# TDW · CE-45 · G6-1 · CUT ONE (FE_1) · HANDOVER · dreamos-pwa

Base: `320ad7e39f7e70e0fb4be6b37b84b4299a3c8307` (unmoved at origin through the build and the differential).
Seat: G6-1, Block 19 G6 "Your own number". Chair: CE-45. Rulings: F-a (a), FK1 to FK9, FK1's `launch.extras`
amendment, O1 to O11 approved by the founder ("ok", 2026-09-24).

## What shipped

The Number room (`/vendor/number`) grows the own-number flow behind a door that dream-os builds in cut 2a
(`GET /api/v2/vendor/solutions/number`, `POST /api/v2/vendor/solutions/number/connect`). The page makes one
decision (`roomMode`): an absent, shut or malformed door renders the shell exactly as at 320ad7e; an open door
draws the flow; a number on file draws its state. Until 2a lands the door answers 404, so production shows the
shell. After 2a the flow is reachable when `flag.own_number` (and her tier's switch) opens the door.

- `app/vendor/(shell)/number/page.tsx` one read and one branch; the shell's JSX and control inventory unchanged.
- `lib/solutions/routes.ts` `API.ownNumber`, `API.ownNumberConnect`.
- `lib/vendor/ownNumberDoor.ts` the wire, `asDoor` validation (a failed read is dark), `roomMode`.
- `lib/worklist/ownNumberFlow.ts` the eighteen founder bytes (O1 to O11) and `flowBytesReady`, the gate that
  keeps the shell while any byte is null or empty.
- `lib/vendor/metaSignup.ts` Meta's SDK on her tap only; origin trusted only if https facebook.com or a
  subdomain; the code posted the moment it arrives (it lives 30 seconds, c-45.27).
- `hooks/vendor/useOwnNumberRoom.ts` reads the door once, starts dark.
- `components/solutions/OwnNumberFlow.tsx` room, consent (both ways, the personal-number line, who pays), the
  moved way's second confirmation, Meta, the state view. No typed byte; no persona name.
- `scripts/b120_g61_own_number_bench.js`, `scripts/lib/b120_own_number_probe.mjs` rung b120.

The pwa holds no Meta constant: app id, configuration id, Graph version and the per-way `extras` arrive in the
door's `launch`.

## The founder's bytes (sha256, first 16)

| slot | byte | sha |
|---|---|---|
| consentHead | Two ways to connect your number | 9664956abe80b387 |
| sharedWay | Keep your WhatsApp Business app. Your number works in the app and here at the same time. If you allow it, your chats from the last six months and your contacts come across. Broadcast lists stop working, and messages you send from the app stay free. | 5c80f6df791d9daf |
| sharedGo | Connect and keep my app | bf56c14aa817a134 |
| movedWay | Or move your number here completely, so it runs only through The Dream Wedding. | 40886584e9c87ffa |
| movedGo | Move my number | 8cb184492cd65aa6 |
| movedConfirm | Once it moves, this number stops working in your WhatsApp app. Are you sure? | d2d785d3349f20e3 |
| movedConfirmGo | Yes, move it | da7d92320cd0e2af |
| personalNumber | A personal WhatsApp number cannot be kept in the app. Use a WhatsApp Business number, or a new number for your business. | f8cb1adf6088b639 |
| whoPays | Meta charges for these messages and bills your own card, not us. | 9558ba61218d2c9c |
| cancel | Not now | a0e63d7c7125d29a |
| connecting | Connecting your number. If you are keeping your app, keep WhatsApp Business open on your phone. | f30c2ee0d49c456c |
| pending | We are finishing the connection. This can take a few minutes. | bca103ca42a323f1 |
| active | Enquiries to this number are now answered here, in your voice. | 1db668753387524b |
| suspended | Paused. Meta flagged messages from this number, so we have stopped sending from it until its rating recovers. | f5f494a6cd724cb4 |
| movedOut | This number is no longer connected here. | 2bdb248a7d6a4c2b |
| stopped | You stopped before finishing, so nothing was connected. | 9a6a919ed3fe7efe |
| metaError | Meta could not finish connecting your number. If you contact us, quote the code below. | ee3a6c55876debe6 |
| expired | That took too long to finish. Please try again. | d11460af28f8c376 |

Reused approved bytes: `roomLabel('number')`, `NUMBER.lede`, `NUMBER.can`, `COPY.canHead`, `BUTTONS.connect`,
`COPY.surfaceUnavailable`, `CHIPS.not_connected` / `connected` / `needs_attention`. O12 open, not consumed.

## Proof

- `tsc --noEmit` clean.
- b120 on the cured tree: 50 pass, 0 fail (headless Chromium via @sparticuz/chromium, both themes, door and
  Meta's SDK mocked at the network). No file this cut adds reads a clock, so C-44.13's shifted clocks have
  nothing to shift (§1.9 proves it).
- b120 at base: pure 320ad7e crashes on the first read (the cut's files are absent). With the base's page.tsx
  and routes.ts and this cut's new modules present, 22 cells go red, exactly the cure cells (1.7, 1.8, 3.sOpen
  both themes, every §4 flow cell); the shell-invariance cells (3.s404, 3.sBad, 3.sShut) stay green, as they
  must. §5's browser mutations (M1 one byte nulled, M4 the moved way's confirmation skipped) are CURED-TREE
  controls: at base they pass vacuously because the base never draws the flow, labelled as such here.
- Amended by label in turn A, with reasons at site: 1.1 (all null -> every slot the vetoed byte by sha), 1.2,
  2.7, 3.sOpen (shell on an open door -> an open door draws the flow), M1 (gate always ready -> one byte nulled
  keeps the shell). Count 51 -> 50: 4.s404 and 4.sOpen folded into §3 (-2), 4.nosdk added (+1).
- Differential on ONE base (320ad7e, dream-os sibling at 89e3a6e beside both): b40, b42, b57, b69, b73, b74,
  b75, b76 (both), b77, b78, b80, b81, b82 run at base and cured, outputs identical (0 diff lines each).
  Pre-existing reds, same on both sides, in files this cut does not touch: b40 C50
  (`app/vendor/(shell)/contracts/screen.tsx`) and C102 (`lib/admin-api/switchboardCopy.ts`); b42 one posts-mock
  string. b73 70/70 and b77 51/51 unamended.
- Found on the way: the probe's stand-in SDK lacked `Access-Control-Allow-Origin` and the browser refused it
  (the tag is `crossOrigin="anonymous"` as Meta documents). The room's fallback was right; it now has its own
  cell (4.nosdk).

## The walk (card in the attach)

On his handset, production, after Vercel is Active: `/vendor/number` reads the shell exactly as before, and
Connect says "Launching soon." That is the dark proof, because the door does not exist until 2a. The flow is
shown as the rung's screenshots beside the running app, both themes (C-44.5). The handset walk of the flow comes
with 2a under walk mode (FK2: `flag.own_number` armed, DEV440, number 9888294440, confirmed not already on the
Cloud API at 2a's read).

## Next

2a (dream-os, under R-45.14, after LCV-15 lands): 0171 (vendor_wabas + §7c column, RLS), the two doors to this
wire, onboarding calls, the receiver's dispatch by PNID and by entry.id (F-44.138's cure), WABA-level events and
the auto-pause, the shared-way 24-hour sync kept private to her (FQ5), the per-tier switch (FQ3). Then FE_2
(§7c's Settings row), cut three (FQ6), and 2b as the chair sequences it. F-44.140: no ads permission and no second
Meta app (the founder's screenshots, 2026-09-24 00:39 to 00:43 IST).
