# P7.1 · VETO SHEET — THE FLIP, AS BETA (L-1 · the badge · the Report door)

**Base** `28fd649` (dreamos-pwa/worklist, E-1) · `c336a05` (dreamos-pwa/main, `/terms`) · `a0f6fff` (dream-os/main, E-1). Re-derived at origin by `git fetch` at this cut.
**File** `docs/mocks/flip-beta-mock.html` — one self-contained file, fonts embedded, the theme token line carried **byte-identical** from the D-1 file and re-checked against `lib/worklist/theme.ts` at `28fd649` (`--atelier-accent-text` #68C9B4 / #0D6A5A). Mocks pin nothing.
**Frames** `L1-landing` `L1-chooser` `P7-badge` `P7-report` · **captures 6** (see §3 for why not 8). A build charter's §2 names *`docs/mocks/flip-beta-mock.html@<hash>`, frames …* — never the file alone.

**How to read this.** One YES/NO per string. Strings ship by delegation unless struck (charter P7.1(c)). Unanswered rows are HELD, not shipped — silence is not a yes on a contested string.

---

## 1 · THE STRINGS — current → proposed

### L-1 · the landing (R-39.17, forks F-P71.1/.3 ruled)

| # | Where | Current | Proposed | Note |
|---|---|---|---|---|
| S1 | door 1 | `I'm getting married` | **unchanged** | becomes the couple **sign-in** door (`signin_phone`, role Dreamer preset) |
| S2 | door 2 | `I'm a wedding vendor` | **unchanged** | becomes the vendor **sign-in** door (`signin_phone`, role Maker preset → `/vendor/pin-login` when pin set) |
| S3 | the small line | `Already a member? Sign in` | **`New here? Sign up`** | the verb carries the gold, as today |
| S4 | chooser heading | — (new surface) | **`New here?`** | Cormorant italic, the landing's own face |
| S5 | chooser sub-line | — (new) | **`Tell us which side of the wedding you're on.`** | strike to ship the heading alone |
| S6 | chooser door 1 | — | `I'm getting married` | byte-identical to S1; lands on **the feed** (today's couple sign-up, F-P71.3 accepted as-is; F-39.75 filed) |
| S7 | chooser door 2 | — | `I'm a wedding vendor` | byte-identical to S2; lands on `join_phone` (name + phone) |
| S8 | chooser back | — | **`‹ Back`** | the ONE way home; a second `Already a member? Sign in` on the chooser was drawn, then struck in this seat — two homes for one path, and the very line F-P71.1 retired |

The two teal annotations under the chooser's buttons (`→ the feed (today's flow)`, `→ name + phone (today's flow)`) are **mock-only** per F-P71.3's ruling and are not shipped bytes.

### The badge (charter (b))

| # | Where | Current | Proposed | Note |
|---|---|---|---|---|
| S9 | masthead, label row, after the room name | — | **`Beta`** | t5, caps, `--atelier-accent-text`; measured at this render: 30×14 px at (63, 43), colour #68C9B4 Graphite / #0D6A5A Chalk. No pill, no border, no new token. The numeral and the house name do not move. |

### The Report door (F-P71.2 ruled (i): compose → `wa.me` on the support lane)

| # | Where | Current | Proposed | Note |
|---|---|---|---|---|
| S10 | drawer row, ACCOUNT section, after `TDW on WhatsApp` | — | **`Report an issue`** | |
| S11 | sheet title | — | **`Report an issue`** | same bytes as the row |
| S12 | prefill keys | — | **`Room`** / **`Build`** | values read from `WorklistShell`'s `title` and `[data-tdw-commit]` (`app/w/layout.tsx:68`) |
| S13 | field label | — | **`What went wrong?`** | |
| S14 | placeholder | — | **`Tell us what you expected and what you saw instead.`** | |
| S15 | send | — | **`Send on WhatsApp`** | honest verb: the tap opens WhatsApp with the text prefilled; WhatsApp's send is the send |
| S16 | cancel | — | `Cancel` | reused byte |
| S17 | sheet note | — | **`Opens WhatsApp with the room, build and your note filled in. Nothing is sent until you press send there.`** | strike if S15 says enough |
| S18 | the composed message (vendor never edits it; it lands on `+919888294440`) | — | **`Issue · <Room> · <build>`** newline **`<the vendor's text>`** | founder's choice of prefix; the build hash rides so the reply thread is greppable |

**Register check:** no `Bride`, no money glyph, no persona name in any row. Copy law holds.

---

## 2 · DERIVATIONS THE FRAMES REST ON (accepted by the chair 2026-09-04)

1. The couple lane has a sign-in door distinct from onboarding — `app/(auth)/couple/pin-login`; the landing's `signin_phone` with role Dreamer resolves to it. §0.2 not triggered.
2. `app/vendor/pin-login/page.tsx:64` bounces any visitor without a stored session to `/`. The vendor button therefore goes through `signin_phone` with role Maker preset — the route is P7.2's; the frame draws the button.
3. The R-O3 role toggle's only role-null caller was the `Already a member? Sign in` line. L-1 retires the line; **F-P71.1 retires the toggle with it.**
4. Today's sign-up flows the chooser enters: couple → `startExploring()` (the feed, no field first); vendor → `join_phone`.
5. The badge's teal is already a token. The masthead home is `WorklistShell.tsx:142`.
6. Room + build are readable without a new wire.
7. No feedback table exists in either schema doc; the drawer already owns a `wa.me` door. **F-P71.2 (i).** The table + admin read is **F-39.74**, Block 19-adjacent, for when real vendors exist.

---

## 3 · COUNT MOVEMENT, DISCLOSED

Charter asked 4 frames × both modes = 8 captures. **Delivered 6.** The landing (`L1-landing`, `L1-chooser`) owns one face — a photograph over `#0C0A09` with the gold on it; `app/(landing)/page.tsx` has no mode attribute and no Chalk twin. A Chalk landing would be an invention, not a mock. Both shell frames (`P7-badge`, `P7-report`) are captured in both modes.

Two further gaps, stated not papered: the landing's `Jost` face is **not embedded** in the mock file (the D-1 file carried only Cormorant Garamond + DM Sans); the caps rows in the two landing frames fall to DM Sans and read a hair heavier than production. The photograph slide is a **gradient stand-in** — no image asset travels in a docs ZIP.

---

## 4 · P7.2's AMENDMENT LEDGER (retire-with-the-reader, F-P71.1)

`scripts/tdw09_landing.proof.mjs` cells that read the surfaces L-1 moves — each to be inverted, re-keyed or retired **in P7.2, labeled, count disclosed**:

| Cell | Asserts today | Fate at L-1 |
|---|---|---|
| §1.5 | the couple door starts the fold, asks no phone | moves to the **chooser's** couple button |
| §1.6 | the vendor door goes straight to `join_phone` | moves to the chooser's vendor button; a new cell asserts the landing's vendor door → `signin_phone`, role Maker |
| §4.1 | `SIGNIN_ROLES.map` + `setRole(r.role)` survive | **INVERTS** — asserts the toggle is gone |
| §4.2 | `!role` guard on the sign-in submit | re-key: the role is preset by the door, the guard may stay inert or go — `tsc` decides |
| §4.3 | `handleSignIn` derives vendor-ness from role | stays (still true) |
| §6.2 | `?role=` entry lands with the couple door chosen | re-derive against the new screen map |
| §12.2 / §12.3 / §13.3 | the `Already a member?` row: backdrop, one home, gold verb | re-key to the **`New here?`** row, same three facts |
| §12.10 | sign-in chips quote the doors byte-for-byte | retires with the chips |
| mutation fixtures :510 / :529 | the door `onClick` bytes | re-pointed to the new targets |

Ten cells, two fixtures. Both-ways at P7.2's cut: the cured tree green, the uncured tree failing on exactly these.
