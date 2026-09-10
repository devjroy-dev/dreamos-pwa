# SHELL_VETO_SHEET — CE-42 · R-42.12 AMENDED · SEAT SHELL

Vetoed by the chair on the founder's word, 2026-09-10. Frames: `docs/mocks/shell-screens-mock.html`
(five frames, Graphite and Chalk, 374 and 390), cut at dreamos-pwa `a96e2e23a73081070a9d2155e247a847938713f0` for the veto and re-cut at the build base `85f6f3c1c5938bd6ee7ddd5951f868ab18515ae0` from the packet's own copy homes.
Every byte below is NEW on the vendor plane unless the row says otherwise. `b73` pins each shipped
string against this table by value; a byte that is not here does not ship.

| # | Where | Current | Vetoed | Bytes | sha256 (first 16) |
|---|---|---|---|---|---|
| D1 | /vendor/dates · lede | — | See which of your dates are in demand, and price them to match. | 63 | 13b9948bb59b4c8f |
| D2 | /vendor/dates · can-do | — | See how often each date was checked on your page. | 49 | a5b0eb157cada42f |
| D3 | /vendor/dates · can-do | — | Offer your open dates to couples who already asked. | 51 | a8e8202545c7bf53 |
| D4 | /vendor/dates · can-do | — | Get a suggested rate when a date is in demand. | 46 | e4fb6276d7cb8a3f |
| D5 | /vendor/dates · line above the Storefront row | — | Date checks already work on your page. | 38 | 572d1643df8f0828 |
| D6 | /vendor/dates · CTA | — | Suggest rates | 13 | 24dc5599c187a32e |
| N1 | /vendor/number · lede | — | Enquiries come to your own WhatsApp number, answered even when you’re busy. | 77 | 3444169777d015d2 |
| N2 | /vendor/number · can-do | — | Put your own number on your page instead of ours. | 49 | 64fd193014b5281f |
| N3 | /vendor/number · can-do | — | Have enquiries answered in your voice while you work. | 53 | da5adc586f2f531e |
| N4 | /vendor/number · can-do | — | Turn a missed call into a WhatsApp reply. | 41 | 83f310b0ab3df667 |
| N5 | /vendor/number · CTA | `BUTTONS.connect` | Connect — **carried, zero new byte** (spec §9) | 7 | — |
| T1 | both CTAs, on tap · `COPY.launchingSoon` | — | Launching soon. | 15 | 2b687c5eae064560 |
| C1 | hub chip on `dates` and `number` · `CHIPS.coming` | `CHIPS.coming` | Coming — **carried, zero new byte** (register 1a) | 6 | — |
| T2 | both screens · sub-head above the can-do list · `COPY.canHead` (R-42.17) | — | What this will do | 17 | 122c31df7aa78aad |
| C2 | both screens · the room eyebrow · `CHIPS.coming` (R-42.17) | `CHIPS.coming` | Coming — **carried, zero new byte** (register 1a) | 6 | — |

**Carried, not authored:** screen titles are `ROOM_ROWS`' own labels (R-40.1); the Storefront row's
label is `lib/worklist/rooms.ts`'s registry byte; the `Open` chip on that row is `CHIPS.open` (Arm C).

**Rulings this sheet stands on:** R-42.12 as amended (every row navigates; the act says
`Launching soon.`) · S2(a) · S3(i) · S4(c), which overturns the older "no chip carries a
routed-but-unbuilt row" reading by ruling · S5(b) · N1 is the vetoed ALTERNATIVE, not the first draft.

No persona name appears in any row (b40 C32 walks the shell tree). U+2019 in N1 (R-40.57, b40 C102).

**R-42.17 (CE-42 SHELL-2).** T2 and C2 join the sheet for the typographic hierarchy on both screens.
T2 is founder-vetoed. C2 is a carried byte in a second role, the room eyebrow, and authors nothing.
**D7 `Already working` was proposed for the aside's eyebrow and STRUCK** (R-40.60): an eyebrow that
repeats the sentence beneath it (D5) is decoration. The aside ships as it did — its rule line and D5.
