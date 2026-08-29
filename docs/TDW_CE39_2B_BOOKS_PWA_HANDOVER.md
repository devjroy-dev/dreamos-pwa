# TDW · ROAD STEP 2b — BOOKS, THE NINETEENTH ROOM · dreamos-pwa HANDOVER

**Executor handover. Rides the ZIP. Not a CE-numbered entry.**
**Applies AFTER the dream-os ZIP — the room's door must exist before the room can read it.**

**RE-CUT ON `a1067fe`.** The first cut was based on `c123926`; step 2a's pwa twin landed
first and `base_guard` refused the dream-os sibling. Every edit here was RE-APPLIED on the
new tip rather than the header re-stamped — 2a touched `copy.ts`, `rooms.ts`, `b40` and the
copy register, and this ZIP ships full files, so a re-stamp would have reverted R-39.6's
three vetoed Couture bytes, R-39.7's `INTERIM_VENDOR_MOUNTS` amendment and C58/C59. The
Books register section is renumbered **§11**, behind 2a's §10.

---

## §1 · WHAT MOVED

| path | motion |
|---|---|
| `app/w/books/page.tsx` | **NEW.** The room, inside the shell. |
| `components/worklist/BooksBody.tsx` | **NEW.** The register. Zero verbs. |
| `lib/worklist/rooms.ts` | Books at **index 4**; `ROOM_COUNT_EXPECTED` 18→19, `TOP_BAND_EXPECTED` 7→8, `BOTTOM_BAND_EXPECTED` holds at 11; `FROZEN_ORDER` gains `'books'`; header EIGHTEEN→NINETEEN. **One edit.** |
| `lib/worklist/copy.ts` | Eleven vetoed bytes. |
| `lib/vendor/types/vendor.ts` | `BooksMovement` + `BooksResponse`. |
| `lib/vendor/api/vendor.ts` | `fetchBooks`. One GET, no adapter. |
| `scripts/b40_worklist_shell_bench.js` | C2 amended **by label** to 19/8/11, plus a new index assertion. |
| `app/w/expenses/page.tsx` | **COMMENT ONLY** — the false plane line, cured. Zero rendered bytes change. |
| `docs/COPY_REGISTER_M-FINISH.md` | **§11** (2a took §10), the eleven bytes. |
| `scripts/floor-manifest-ce39-2b.txt` | **NEW.** Declared-dirt manifest. |

**NOTHING IN THE MONEY BLOCK RETIRED.** `fetchInvoices`, `fetchExpenses`, `fetchCabinet`,
`fetchLedger`, `binderToInvoice`, `binderToExpense` — all untouched, by ruling (arm (c)).
The five-control table and the reasons are in the dream-os handover §2, which is 2c's §2.

## §2 · THE ROOM

`GET /api/v2/vendor/money/books/:vendorId`. Head **Received / Outstanding** at t2 with
tabular numerals; a real `<table>` with four columns — Date · Credit · Debit · Balance.
Read-only: the module and its import graph mount no `<button>`, `<a>`, `<form>`, input,
`onClick`, swipe or long-press. The movement ids it receives are composites
(`invoice:<uuid>`, `expense:<uuid>`, `schedule:<invoice_id>:<ordinal>`) — deliberately
unusable as addresses, React keys and nothing else.

**THE BALANCE ARRIVES SERVER-COMPUTED AND THIS FILE SUMS NOTHING.** F-04.13's tuition
applied before it can be paid again: the hub totalled `public.invoices` while the list
totalled binders, two derivations of one rule, and they could not agree by luck.

**THE FIRST ROOM BORN INSIDE THE SHELL.** Every other room in `app/w/` crossed and kept its
body under R-38.12. Books has no `/vendor` twin, so it reads CSS variables only and carries
none of the thirty colour literals F-38.22 captures in the slice tree — and its header word
has exactly **one** home, so F-38.23's `LABELS` duplication does not grow.

**`font-variant-numeric` IS DECLARED IN A SECOND RULE AFTER EVERY `font` SHORTHAND.**
`lib/worklist/theme.ts` :: `typeCss` states that the shorthand resets it; `BillingRoom.tsx`
already carries the same two-rule pattern. Declared in one rule the tabular setting is
silently discarded and the columns stop aligning — silently, which is why it is a paragraph.

`t2` witnessed present in `theme.ts` :: `TYPE` (17/1.3 DM Sans 500) before use, per R-38.10's
"head in t2 numerals". No substitution was needed.

## §3 · FLOOR — DERIVED AT THE CUT

**Derived at the re-cut, on `a1067fe`. `FLOOR = NAMED BASE, no delta.` 23 RED, SET compared by name against NAMED BASE 23:**

`run-assign-words-proof · tdw07_p2_profile · tdw07_p3_portfolio · tdw07_p4b_body ·
tdw08_p3_landing · tdw08_p5_prospects_console · tdw09_p1_canon · tdw09_p2_doors · tdw09_p2c ·
tdw09_palette · tdw09_roles · tdw09_surface · tdw09_theme_retire · tdw09_type · tdw09_uivendor ·
tdw10_billing_tab · tdw10_p2_retint · tdw10_p3_deck · tdw13_d4_extraction · tdw_auth_crossover ·
tdw_f0770_authority · tdw_f0774_readers · tdw_f0774_stripper`

**`b40`: FLOOR GREEN**, all cells including 2a's C58/C59. **`tsc --noEmit`: clean.**

## §4 · b40 C2 — WHY THE CELL NEEDED EDITING AT ALL

Its own comment says the expected numbers "now read from `rooms.ts`'s own exported
constants rather than from literals retyped here" — and they do, for the ids and the bands.
But the three-number guard on the cell's first line reads **literals**, deliberately: that
is what stops the registry drifting away from the RULING by editing its own constants. So a
ruled amendment moves both homes in one edit. Moving only `rooms.ts` would have reddened
C2 on a correct registry. Derived by reading the cell, not by running it and reacting.

**A NEW ASSERTION WAS ADDED, and it is not decoration.** `FROZEN_ORDER` and the registry
agreeing proves they match *each other*; it does not prove they match the founder's word,
which was index 4, beside Invoices and Expenses. Two files can drift together. `ids[4] ===
'books'` is now asserted separately.

**NINETEEN SPENDS EIGHTEEN'S TIDINESS AND THAT WAS RULED, NOT OVERLOOKED.** Eighteen was six
full rows of three; nineteen brings back the orphan row R-37.87 killed. The founder was told
and ruled the placement anyway, because a ledger that sits away from the two rooms it
reconciles is a ledger nobody opens.

## §5 · ⚠ THE GEOMETRY CELL DID NOT RUN — **REFUSED-EGRESS**

`tools/wl_render.cjs` requires a deployed base URL and a minted token
(`tools/wl_mint_token.sh`). This container's network reaches github/npm only — no Vercel, no
Railway. Invoked, it reports `deploy: could not be identified`, `fixture: SYNTHETIC — every
authenticated cell will FAIL`, and `RENDER ARM RED`.

**REFUSED-EGRESS, stated per cell rather than counted as green.** The nineteen-tile geometry
at 374×844 is therefore **unmeasured by this seat**. R-38.10's own STOP clause says nineteen
at 64px clearing 844 is *arithmetic until the arm says otherwise* — so it is still
arithmetic. **The founder's card step ② is the only witness for it**, and a run of refusals
is not green.

## §6 · F-39.p3 · THE ELEVENTH BYTE

`booksFailed` was **WITHHELD at the build** and vetoed after. Ten bytes had been ruled; an
executor-invented eleventh on a money surface is what the veto slot exists to stop.

The empty-state byte was not borrowed for it. `booksEmpty` says the estate looked and found
nothing; `booksFailed` says the estate could not look. Rendering the first over a failed call
tells a vendor **with** money that her money is gone. The failure path also replaces each
head figure with an em-dash rather than Rs 0 — the same lie in numerals.

## §7 · FOUNDER CARD (Railway then branch alias, both modes)

1. `document.querySelector('[data-tdw-commit]').dataset.tdwCommit` typed fresh in the console
   = this ZIP's commit. Site: `components/worklist/WorklistShell.tsx`, the hidden
   `data-tdw-commit` div. R-38.22: the gate refuses a deploy that is not the tree.
2. **Rooms: nineteen tiles, Books at index 4 beside Expenses, FAB seat unchanged.**
   *This step is also the geometry witness — see §5. Nothing measured it.*
3. **DROY550 `/w/books`:** Received **Rs 35,000** · Outstanding **Rs 0**;
   14 Jul Rs 15,000 cr *(no date on file)* → 14 Jul Rs 20,000 cr *(no date on file)* →
   22 Jul Rs 5,001 dr → 22 Jul Rs 5,000 dr; balances **15,000 · 35,000 · 29,999 · 24,999**.
4. **DEV440 `/w/books`:** "No money movements yet." Payload derived by command:
   `{"ok":true,"received":0,"outstanding":0,"movements":[],"total":0}`.
5. `/w/invoices` and `/w/expenses` **unchanged from `c123926`** — the only diff in either
   file is a comment, so "unchanged" is true at the rendered byte.

Green on five = **2b SEALED**. **F-39.3 stays OPEN for 2c by ruling** — the Invoices and
Expenses rooms still read the empty engine plane, and that is the ruled state, not a miss.
