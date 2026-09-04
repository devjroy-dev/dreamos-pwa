# TDW_19 · G1.1 — WEDDING PAGES · THE MOCK SITTING · HANDOVER

**Seat:** LE, code-capable, one sitting, zero product bytes.
**Base:** `dreamos-pwa` @ `49e5828`, re-derived at origin at the moment of cutting (R-38.16) — unmoved from charter.
**Sibling:** `dream-os` @ `2ad4637`, read-only, docs only.
**Governing:** kickoff v2 (CE-40, 2026-09-04) · R-40.7–.15 · R-40.17–.21 · R-G11.1–.9 · R-40.1 room names.
**Workspace:** `/home/claude/g11mock/` — one sitting, one clone, `git status` clean at seating.

---

## H1 · WHAT SHIPPED

| Path | What |
|---|---|
| `docs/mocks/wedding-pages-mock.html` | the mock — 13 frames, 5 embedded faces, 148 KB |
| `docs/mocks/wedding-pages-mock__*.png` | 31 captures |
| `docs/TDW_19_G11_MOCK_HANDOVER.md` | this file |

**Zero product bytes.** No file outside `docs/` is touched. `git status --porcelain` filtered to tracked paths returns nothing: every path in this ZIP is new.

### The frames

| Frame | Surface | Widths | Modes | Captures |
|---|---|---|---|---|
| `W1-page` | the public wedding page, `/v/<code>/w/<slug>` | 374, 390 | light | 2 |
| `W1-roll` | the credit roll, close | 374 | light | 1 |
| `W1-a4` | the same page on paper | 794×1123 | paper | 1 |
| `W2-room` | the Wedding pages room | 374, 390 | dark, light | 4 |
| `W2-empty` | nothing published yet | 374 | dark, light | 2 |
| `W2-grid` | the grid with R-40.20 applied, 3-up | 374 | dark, light | 2 |
| `W2-grid-wide` | R-40.21's trial, first tile full-width | 374 | dark, light | 2 |
| `W5-hub` | Business Solutions, the nine rows | 374, 390 | dark, light | 4 |
| `W5-hub-today` | `/vendor/support` as it stands at `49e5828` | 374 | dark, light | 2 |
| `W3-create` | the create sheet | 374, 390 | dark, light | 4 |
| `W3-credits` | the credits sheet | 374 | dark, light | 2 |
| `W4-wa` | the claim message as it lands | 374, 390 | dark, light | 4 |
| `W4-claim` | `/credits/<token>` | 374 | light | 1 |

**On `W5-`, not `W2-hub`.** `primaryOf()` derives the 390 second frame from the *first* frame of a shape prefix, and `W2`'s is the room. A `W2-hub` could only ever be shot at 374. Its own prefix delivers 374 **and** 390 with no attribute and no exception, which is what the ruling asked for. The hub is also a distinct surface family on the merits, not only mechanically.

**Run file-target, never folder-target (R-G11.9).**

```
node tools/mock_shot.cjs docs/mocks/wedding-pages-mock.html
```

`mocksIn()` on a directory takes every `-mock.html`; a folder run rewrites all 92 committed captures under seven other charters. Proven, not asserted: `git status` after every shot in this sitting showed zero tracked files modified, and `scripts/tdw_f3957_shot_arm.proof.mjs` re-ran **GREEN 17/17** with its hard-coded `LEGACY` five untouched.

### The fonts — five faces, one block

The shell's three transcribed verbatim from `docs/mocks/studio-rooms-mock.html` (Cormorant Garamond 500, DM Sans 400, DM Sans 500), plus **Jost 300** and **Cormorant Garamond 300 italic**, base64'd from `@fontsource/jost@5.3.0` and `@fontsource/cormorant-garamond@5.3.0` over allow-listed npm — the same reasoning `mock_shot.cjs:23–27` uses for `@sparticuz/chromium`. **No dependency joins the repo**; the bytes live in the file. R-G11.2 held: Jost on the cream lane (i)/(iii), the shell's `--wl-t5` on (ii), and no shell frame grew a Jost.

---

## H2 · CONTROL INVENTORY — the live surface `W5-hub` rewrites

Read whole, READ-ONLY, at `49e5828`: `app/vendor/(shell)/support/page.tsx` (133 lines), `lib/solutions/copy.ts`, `lib/solutions/routes.ts`, `components/solutions/SolutionsPieces.tsx`.

**The room is not a stub.** R-19.2 made it a six-row index with six child routes on disk: `google · website · seo · marketing · proof · benchmarks`.

| Control | Verdict | Note |
|---|---|---|
| eyebrow `For your business` (`COPY.indexEyebrow`) | **KEPT** | drawn on `W5-hub` |
| six `SurfaceRow`s — label + eyebrow + state chip | **KEPT** | drawn on `W5-hub-today`; **not removed by this sitting's word** |
| six child routes under `/vendor/support/*` | **KEPT** | untouched, unreferenced by this mock |
| error line `COPY.indexUnavailable` | **KEPT** | not drawn — no frame pictures the failed-fetch state |
| footer body `Something broken?` (`COPY.footerLine`) | **KEPT** | drawn on both hub frames |
| WhatsApp button `Message us on WhatsApp` (`WL.supportAction`, class `wl-supportaction`) | **KEPT** | drawn, class carried byte-for-byte — `b40` C10's tap-target census at `scripts/b40_worklist_shell_bench.js:162` maps this file to this class, and a rename reddens it. The mock must not picture one. |
| `supportWaNumber()` as the number's declared home | **KEPT** | no seventh home; the mock renders no number |
| nine R-40.1 rows | **NEW** | `W5-hub` |

**REMOVED-BY-RULING: none.** Nothing on this surface is removed by this sitting.

**The fork this inventory produced, unruled, not picked:** three of the nine plainly overlap three of the six — `Google page`→`Google reviews`, `Website`→`Your website`, `Marketing`→`Posts & ads` — and three do not map at all (`SEO`, which master §4 G3.1 calls a *property* of the website's pages rather than a room; `Proof`; `Benchmarks`, which is master G7's arc). Whether the nine absorb, replace or sit beside the six is architecture nobody has ruled, and the unruled-arm law says the seat names it and stops. `W5-hub` and `W5-hub-today` are drawn as two pictures of two states, never merged into an invented third.

---

## H3 · CORRECTIONS THIS SEAT OWNS

- **s-G11.1** — the credits sheet overflowed the ratified `max-height:78%` and clipped its foot. Ceiling raised to 92%; fields and credit rows tightened. **The list was not truncated** — a sheet that hides a credit is the one thing that sheet may not do.
- **s-G11.2** — first cut drew `Publish this page` as a live accent button directly above *Waiting on the couple's permission.* A refusal drawn as a control that looks tappable. Corrected: the sheet opens on the published record, the foot is #26, and the publish control is **absent, not greyed**. The two states the frame cannot show are carried in its caption.
- **s-G11.3** — first cut of `W2-grid` ringed the moved tile in gold to catch the eye. Gold is a product ink under a 3×-per-screen law and the medallion already spends one; an annotation in the product's reserved colour is indistinguishable from a shipped decision on a phone screenshot. Ring removed. Position is the whole tell.

All three were disclosed in-sitting and accepted by the chair.

---

## H4 · WHAT THE FOUNDER'S EYE IS OWED, DRAWN OR NAMED

1. **`W2-grid` vs `W2-grid-wide` is his A/B (R-40.21).** Nothing is ruled by the pair. **Measured, not argued:** 3-up leaves the work band exactly three rows of three and one ragged row in the estate (Advisor alone at the foot). Full-width leaves the eight remaining work tiles at 3·3·2, so the grid carries **two** ragged rows. The full-width tile is a shape the shell has never had; **the build seat reads no ratified tile shape off a comparison frame.**
2. **`Business Solutions` is the grid's only two-line tile label** at 3-up — 18 characters against `Storefront`'s 10 — and it is now the first thing on the first screen.
3. **Eight of nine hub rows read `Coming`.** `support/page.tsx:11–13` records the founder's own reasoning against exactly this shape: displacing the WhatsApp line would have traded *"the one row on this page that reaches a person for six rows that all read `Coming`."* It is now eight of nine. Drawn truthfully so he decides rather than discovers.
4. **The nine rows carry no eyebrows.** The live idiom has one per row (`ROW_EYEBROWS`); nine are unauthored and are not in the ratified forty. The build charter's.
5. **Tone blocks stand in for photographs (R-G11.8).** The gallery's composition is vetoed on the build's walk against DEV440's real frames (CE-116 clause 3). No frame here is evidence about a photograph.
6. **Fixture names are mock placeholders.** `Priya & Arjun`, `Dev Roy Photography`, `Makeup by Swati Roy`, `Neha Sharma`, `Rangoli Events`, `Taj Chandigarh`, `14 Feb 2027` are drawn, not derived — this container has no database reach. The build sitting derives the real bytes by founder-run SELECT before authoring them (fixture-state law).

---

## H5 · COPY, AS RATIFIED

All forty strings stand as R-40.18 ratified them, with **#22 `On the page` → `Claimed`** (F-40.23 disposed; #21 `Invited` and #23 `Declined` stand), and **R-40.19 typographic apostrophes** applied across the set. Swept by command: zero straight apostrophes remain in a product string, zero occurrences of `On the page` remain in the file.

Three strings are **reused, never re-authored** — one home each:

| String | Its home |
|---|---|
| `Created and managed by The Dream Wedding · thedreamwedding.in` | `app/v/[code]/page.tsx` `COPY.colophon` |
| `This link isn't active.` | `app/crew/[token]/page.tsx`, founder-vetoed 2026-07-22, holding the byte-identical never-existed ≡ rotated law |
| `Something broken?` + `Message us on WhatsApp` | `lib/solutions/copy.ts` `footerLine` + `lib/worklist/copy.ts:301` `supportAction` |

---

## H6 · FOR THE BUILD CHARTER — recorded so it is not re-derived

- **R-40.20 moves two homes in one edit.** `lib/worklist/rooms.ts`: `FROZEN_ORDER` index 0 = `support`, band `work`; `TOP_BAND_EXPECTED` 8→9; `BOTTOM_BAND_EXPECTED` 11→10; `ROOM_COUNT_EXPECTED` unmoved at 19. **And** `scripts/b40_worklist_shell_bench.js` C2, whose three-number guard reads **literals deliberately** — its own comment says so, precisely to stop the registry drifting from the ruling by editing its own constants. Moving only `rooms.ts` reddens a correct registry. Cell title amended by label citing R-40.20 — a reorder the founder worded. Arithmetic derived from the registry, not carried: 19 total, 8 work, 11 business at `49e5828`.
- **Whether the tile keeps the id `support`** is the build seat's read-first fork.
- **The address needs a new route:** `app/v/[code]/page.tsx` is a leaf file, so `/v/<code>/w/<slug>` lands at a new `app/v/[code]/w/[slug]/`. No collision; `app/w` does not exist at this tip.
- **`/credits/<token>` inherits `app/crew/[token]`'s posture** — public capability token, no session, no cookie, no storage, one gold, terracotta decline, and the never-existed ≡ rotated law on a dead token.
- **The public page loads no webfont in production.** `app/v/[code]/page.tsx`'s stylesheet is deliberately system-stack for a stranger on mobile data. The mock embeds faces so the capture is not a picture of DejaVu; **the shipped page is not obliged to**, and that delta is a decision the build charter owes an answer to.
- **F-40.21's template** is a fifth the master §6 gate table does not carry, absent on both WABAs, and a Marketing-reclassification candidate on F-19.07's precedent.
- **F-40.20** — `mock_shot.cjs:64–68`'s census reads 26 frames / 5 files / 78 captures; the tree at `49e5828` holds 37 / 7 / 92, and now 50 / 8 / 123. The proof cell is scoped to a hard-coded `LEGACY` list and does not redden. Post-beta small.

---

## H7 · PROTOCOL ATTESTATION

`docs/TDW_BUILD_PROTOCOL.md` §7 and §11 opened at `dream-os @ 2ad4637` and read in full. The §7 apply chain, verbatim:

```
unzip -o FILE.zip && cp -r deploy/* . && rm -rf deploy FILE.zip
```

No dotfile is placed inside `deploy/`. No SQL travels with this delivery and no schema doc is claimed: this sitting writes zero product bytes and reads no plane. LE holds no write credentials; nothing here is banked until the founder pushes.

**Sequencing beyond this sitting is the founder's.**
