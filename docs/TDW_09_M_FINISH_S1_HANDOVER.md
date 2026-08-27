# M-FINISH · SITTING 1 — THE SHELL BECOMES THE APP

**Over `366a7b5` (`origin/worklist`). Packet `8b83aee41ea806bbbde5f55f2e99ca5b4a307bda7c765b6a6ec8f1ff878ed0a6`.**
**`tsc --noEmit`: exit 0. `next build --webpack`: exit 0, seven `/w` routes.**
**Floor: `FLOOR = NAMED BASE`… no. See §7 — the floor is byte-identical to the UNTOUCHED TIP, and the named base is stale by four.**

```
wl_audit  @ cured      26 PASS · 0 FAIL · 2 INCONCLUSIVE     GATE GREEN
wl_audit  @ 366a7b5    15 PASS · 10 FAIL · 3 INCONCLUSIVE    GATE RED
wl_render @ cured      18 PASS · 0 FAIL, both modes          ARM GREEN
b40                    exit 0 · 23 cells · count byte-stable
run-floor.sh           26 RED · delta vs untouched tip: ZERO · vanished: ZERO
```

Every count above was re-derived at the moment of writing (R-37.86).

---

## §1 · F-38.1 CURED — WHAT ACTUALLY CHANGED

At `366a7b5`, sixteen of seventeen tiles and four of five drawer rows crossed out of `/w`
into a second route tree with a second root layout. Every such tap unmounted `/w/layout`
and mounted `/vendor/layout`: a second Splash, a second session resolve, `GET
/api/v2/vendor/me` on every pathname, the old DreamAi masthead, the old coin with
`DreamAi on WhatsApp` in its drawer, the old glyph nav, a second token scope. **Every
grievance on the founder's list was that one structure.**

Rooms, Today, Business Solutions, **Billing, Settings and Advisor** are now children of
`app/w/layout.tsx`. `app/vendor/layout.tsx`'s chrome mounts for no route the shell serves.

**R-38.3 · ONE SESSION RESOLVE.** The `/me` verdict is fetched once, on mount, behind a
`useRef` — not a bare `[]`, because React 18 strict mode fires effects twice in
development and would have reintroduced the defect through the tool rather than the code.
It fails open, `=== false` and not `!complete`, carried verbatim from the old guard's
reasoning: an absent verdict is a server that did not answer, not a vendor who is
incomplete.

**R-38.2 · NAVIGATION IS `<Link>`.** Tiles, seats and drawer rows are anchors with default
prefetch. `router.push` survives in one place: sign-out, which is a post-action redirect
and not a destination anyone aimed at.

### WHICH ROOMS CROSSED, PER SITE — the checklist sitting 2 inherits

**CROSSED (4):** `billing` → `/w/billing` · `settings` → `/w/settings` · `support` →
`/w/support` · `advisor` → `/w/advisor` (new).

**NOT CROSSED (14),** declared in `lib/worklist/rooms.ts` as `INTERIM_VENDOR_ROOMS` and
asserted **as a set**: leads · clients · invoices · expenses · events · notes · calendar ·
storefront · portfolio · couture · team · contracts · tds · collab.

The R-38.1 cell does not assert "no `/vendor` href exists" — that would be false on
purpose, and an assertion that is false on purpose teaches the next seat that this cell may
be argued with. It asserts the shipped set equals the declared set, so a room sliding back
out reddens and a room crossing without leaving the list reddens too.

### THE `<Header>` CENSUS — 28 mounts across 23 files

`Header` is mounted by page files, not by the layout, so moving a route sheds `Splash`,
`BottomNav`, `ThemeProvider` and the room-class effect but **not** the masthead. Of the 23
files, **one crossed** (`app/vendor/settings/page.tsx`, whose screen moved out; the route
keeps its own mount). The other 22 belong to the fourteen uncrossed rooms and are
untouched. `components/vendor/slices/SliceShell.tsx:164` is untouched per ruling — no list
room crossed.

---

## §2 · FIVE DEFECTS THE GATE CAUGHT THAT READING DID NOT

Every one was found by running an instrument, not by review. They are listed because the
pattern is the finding: each is a case where correct-looking source produces wrong served
bytes.

**① THE OLD MASTHEAD WAS SHIPPING INTO `/w/settings`.** The first cut kept
`import { Header }` in `SettingsScreen` and wrote `{chrome && <Header/>}`. That renders
correctly and **bundles anyway** — with the old drawer, its `/vendor/settings` and
`/vendor/billing` rows, and `DreamAi on WhatsApp` (`Header.tsx:355`, banned by
R-37.70/.78/.83). **A conditional does not remove a module from a chunk; only not importing
it does.** The mount moved to the fallback route. Found by the R-38.1 cell reddening on two
hrefs.

**② THE RETIRED MONEY SENTENCES WERE SHIPPING ONTO THE SURFACE BUILT TO RETIRE THEM.**
`BillingRoom` imported `PLAN_LABEL`/`PLAN_PRICE`/`V2` from `SubscriptionCard.tsx` — three
`export` keywords, zero value changes, which looked like the smallest possible diff.
Importing from a **component module** drags the component and its `statusLine` dependency,
so all four sentences R-38.8 retires by name were served on `/w/billing`. Cured by a pure
move to `lib/vendor/billing/plans.ts`. **The module shape was the defect, not the copy.**

**③ I SHIPPED A TOMBSTONE AS CSS.** My `--wl-label` retirement note was a `/* */` comment
*inside* the emitted template literal in `AskSheet.tsx`, so the retired variable name was
served to the browser and reddened my own cell. ZIP 14 ⑧ owned this family from the other
direction. A comment about a retirement must not ship, or it becomes the thing it describes.

**④ SETTINGS LINKS OUT THREE TIMES, NOT ONCE.** R-38.7 anticipated one row.
`/vendor/discover/profile` was undeclared — nobody had enumerated the body's links before
crossing it. `/vendor/billing` was **not interim at all**: a second money surface with a
live door, where the signpost went to the AtelierForm card while the tile went to the
rebuilt page. Repointed to `/w/billing`; the two would have drifted the moment either was
edited.

**⑤ A CELL OF MINE WAS VACUOUS.** R-38.2's tile half read `!/onClick:…router…push…room\.href/`
— **source** syntax the minifier renames, so the clause was `true` by construction and
printed `tile=true` at the very tree it was written to convict. Only running it at
`366a7b5` exposed it. Rewritten to assert the shape that survives minification; now
`tile=false seat=false` there.

**AND A SEVENTH TUPLE IN LIVE CHROME.** `.wl-docksend` set a bare `font-size:14px` and
nothing else, so the dock's send glyph painted at **14px / 400 / Arial** on four surfaces
in both modes. No sweep finds this: the file names no family, so a grep for stray families
returns nothing. Only asking the browser what it painted does. That is C-R6's whole warrant
and it earned it on its first run.

---

## §3 · THE SCALE AND THE GRID — R-38.4, R-38.5

Six rungs, emitted as the CSS **`font` shorthand**, so a call site cannot set a size
without also taking that rung's family and weight. **`--wl-label` and `--wl-display` are
DELETED, not aliased** — an alias would have let all fourteen call sites keep their names
and quietly acquire new values, which is the shape of a change nobody can review.

```
t0  46/.95   Cormorant 500   the Today masthead numeral, ONE ELEMENT PER APP
t1  24/1.2   Cormorant 500   page title, at most one per surface
t2  17/1.3   DM Sans   500   section heading, the wordmark
t3  14/1.45  DM Sans   400   body, row primary
t4  12/1.4   DM Sans   500   row secondary, buttons, nav seats, tile labels
t5  11/1.3   DM Sans   500   captions, metadata, section eyebrows
```

**THE READING TAKEN ON TRACKING, stated because R-38.4 is two-valued on it.** The ruling
lists the nav seats under t4 and then says letter-spaced uppercase is permitted in two
places "(t5, tracking .08em)". Read as: seats are **t4** and eyebrows are **t5**, both
tracked at .08em. Tracking is not part of the asserted tuple, so this is recorded rather
than enforced. **The tile label is t4, not t5** — two rulings meet on that line and both
bind: R-37.73 ② put the interactive floor at 12px after 9px was convicted, and a tile is a
control; and a tile is neither of the two places tracked uppercase survives, so the
engraved costume came off.

**R-37.88's MOCK IS SUPERSEDED AS A TYPE CONTRACT** and stands only as the layout contract
for Today (stature, masthead, feed order). Hash unchanged at
`507f9bb1…87e2`, no re-upload. Labelled amendment, per CE-38 relay #1.

### F-38.4 — THE STOP CONDITION, MEASURED ON GLASS

Ordered re-derivation at the arm's own viewport, 390×844, against the built tree:

```
hdr 77 · dock 67 · nav 53          → work area 647
18 tiles at 114 × 64               → scrollHeight 647 = clientHeight 647
overflow 0 · slack below last tile 74px
edges  house 16 · tile1 16 · dockfield 16 · plan-card 16   spread 0
       navBox 0 = mainBox 0
```

All eighteen rooms visible at rest. Clears with far more than the 8px the ruling required,
so no STOP. **Cell C-R8 keeps it clearing** — the arithmetic is now an assertion.

**⚠ CORRECTION TO RELAY #2's ARITHMETIC, filed not inherited.** The ruling derived
"business band 5 rows = 352". Eighteen rooms is 7 + **11**, and eleven at three-up is
**four** rows. The figure overstates by 72px. Conservative in the safe direction, but it
was not re-derived, so it is filed rather than absorbed.

**⚠ AND R-38.9's RATIONALE DOES NOT LAND, WHICH IS THE FOUNDER'S TO RULE.** The ruling says
eighteen gives "six full rows of three; the orphan row dies". That holds for one grid of
eighteen. It does not hold for **two bands of 7 and 11**: the work band is 3+3+**1**
(Calendar alone) and the business band is 3+3+3+**2** (Collab, Advisor). There are now
**two** orphan rows, not zero. Nothing here reorders tiles — R-37.63 ② refuses it and the
frozen order is yours in one word. Reported with the frame attached.

---

## §4 · R-38.7 · THE TWO ROWS

`.wl-panel` and `.wl-pointer` are gone from `RoomsGrid`. Rooms is the tile grid and nothing
else. Neither byte was deleted: `TDW on WhatsApp` is a coin-drawer row (its one home,
R-37.69/.83 amended), `Profile layout` is a row inside Settings. The pointer copy retired
outright with its subject — a directory does not advertise a manual.

---

## §5 · R-38.8 · BILLING, AND THE ONE THING IT IS OWED

Plan card (name t2, price t1 tabular, neutral status chip), then a plans list of name ·
price · one action. `BillingRoom` owns **presentation only** — the rails, the hooks, the
vetoed bytes and the pair logic are all imported. That is the chair's own warrant for
`WlToast` applied unchanged (R-37.84 ①).

**THE BLEND IS CURED BY SEPARATION, NOT BY REWORDING.** `lib/worklist/billingChip.ts` reads
the **pair** — because reading the pair was F-10.110's *cure*, not its defect, and two
sanctioned admin surfaces still write `tier` alone. The plan card says `Signature`. The
chip says `Cancelled`. Both true, neither implies the other, and no sentence has to hold
them together. ⚠ **If a later tidy collapses this to one key, the defect returns whole.**

**THE FRAME RENDERS BEFORE THE DATA, AND ON THE ERROR PATH TOO** — a second correction the
arm forced. The first cut gated the whole surface on `!loading`, contradicting its own
"no spinner theatre" comment; the arm could not find `.wl-billcard` to measure. The card's
*shape* is immediate and every *word* inside it waits, because `useSettings` seeds
`tier: ''`, which floors to `Basic` — correct after a read and a lie before one. A vendor
on Prestige must never see `Basic` on her own money page because a fetch had not landed.

**OWED: three inclusion lines.** Nothing in this repo states what Essential, Signature or
Prestige include; the only tier-differentiated fact is the AI cap, which lives in runtime
admin config. And `Ends 14 Sep` is unbuildable — no flip timestamp exists anywhere in the
estate, which is why a first draft's date was dropped at the founder's own ruling. Both in
`docs/COPY_REGISTER_M-FINISH.md`.

---

## §6 · ARM (c) · `WlToast`, AND F-38.3 STILL OPEN

`components/worklist/WlToast.tsx` reads CSS variables only; zero `useT`. `useToast()` is
imported, not copied, so a caller swaps one import and nothing else. F-04.75's legibility
line survives the rebuild: the error ink is pinned to a light literal in both modes,
because the error ground is dark red in both and `--atelier-ink` resolves to near-black on
Chalk — 1.5:1 against a 4.5 floor.

**F-38.3 IS OPEN AND THIS IS NOT ITS CURE.** `AskSheet.tsx:32` mounts
`<ThemeProvider pinned>`, and a pinned provider **writes** `html.theme-light`
(`ThemeContext.tsx:117`) and `documentElement.style.background` (`:85-87`). That is a
second writer of the class ZIP 14 ⑥ convicted as the flash mechanism, living inside `/w`.
Grandfathered this sitting by ruling; named in the audit's own INCONCLUSIVE reason string
so it cannot be read as cured. Cure priced for sitting 2: `AskSheet` drops the provider
once every component it renders reads CSS variables only.

---

## §7 · THE FLOOR — AND THE NAMED BASE IS STALE BY FOUR

**Derived on a pristine clone of `origin/worklist` at `366a7b5`, before any of this
delivery's files existed: 26 RED.** In this tree: 26 RED. **Delta: zero. Vanished: zero.**

That is the cleanest floor statement this branch has carried, and it is only true because
two benches were amended by label:

- **`b40_worklist_shell_bench`** — C2 (17→18, still reading the registry's own constants,
  never literals), C10 (reads `height` as well as `min-height`; the tile states a fixed 64),
  C11 (**resolves the rung through `theme.ts`'s TYPE object** instead of looking for a
  `font-size` literal that R-38.4 abolished — stricter, not looser: a rule naming no rung
  fails, where a literal merely had to clear a number), C13 (five cards → three; ceiling
  three sentences → one; retired keys asserted absent), C17 and C20 (pointer and profile
  row **invert** rather than vanishing, so a silent re-add reddens). **23 cells, unchanged.**
- **`tdw10_tier`** — reads re-pointed to the two pure moves, predicates byte-identical. The
  `#tier` cell now reads **both** the route and the screen, so it cannot green on a route
  rendering nothing nor on a screen no route mounts. The money-register cell absorbed a
  one-home guard rather than becoming a second cell. **107 cells, unchanged.**

**⚠ A CORRECTION TO RELAY #2's ITEM 8.** It named "cell 4.3 and the `VETOED_IN_RESOLVER`
list" — those identifiers live in `tdw10_billing_tab.proof.mjs`, which is already base-RED,
not in `tdw10_tier`. And **no inversion was needed in either**: the cure took a different
shape from the one the ruling assumed. `statusLine.ts` is untouched, so its sentences
legitimately survive for `main`, exactly like the fifteen Espresso benches. What asserts
their absence is `wl_audit`'s R-38.6 cell, on the branch's **served bytes**, which is where
R-38.8's retirement actually bites.

**⚠ AND THE NAMED BASE IN `run-floor.sh` IS STALE BY FOUR.** At the untouched tip,
`tdw09_p2b_vocab`, `tdw13_d6_parity_matrix`, `tdw15_p1_events` and
`tdw_f0774_vacuity_probe` all RED and none is in the printf constant. Inherited, pre-dating
this sitting, cause unexamined. **Reported, not absorbed** — `--check` therefore exits 1 at
an untouched tip, which is the instrument lying at rest, and a base entry nobody can
account for is how a real regression gets absorbed. Owed a sitting.

---

## §8 · THE CAPTURES

24 fullPage frames, both modes: Rooms · Today · Billing · Settings · Advisor · Support ·
two uncrossed rooms (leads, collab) · drawer open on Rooms **and** on Billing · tapped tile
· risen chat. Every filename carries its data condition: `…__SYNTHETIC-SPLASH.png`.

**THEY ARE CHROME-AND-LAYOUT EVIDENCE AND NOTHING ELSE.** The seeded token is not real, so
every authenticated fetch fails closed by design — the coin renders its fallback glyph, and
the Billing frame renders empty above its error line. **They are NOT evidence about any
data-bearing surface.**

---

## §9 · WHAT THIS SEAT OWNS

- **Three template-literal backtick faults**, all in comments about CSS, all caught by the
  type floor. ZIP 14 ⑧ named this family; I reproduced it three times in one sitting.
- **Two silent no-op edits reported as applied.** The first was caught only because the
  red's *wording* named a subject already retired — a verdict whose text does not match its
  cell is a verdict about a different tree. The second I caught by checking the count.
  Every amendment in this delivery was verified by running the bench afterwards.
- **A vacuous cell of my own**, above at §2 ⑤. It read like a correct assertion and could
  not fail.
- **The local build is a specimen, not the deploy.** The founder's paste is the verdict.
  `next build` needs `NEXT_FONT_GOOGLE_MOCKED_RESPONSES`; the mock was authored outside the
  repo and ships in nothing.

## §10 · THE NEXT SITTING

The fourteen uncrossed rooms, in `INTERIM_VENDOR_ROOMS` order · Settings' body onto the six
rungs (and the AtelierForm question underneath it, which has main-side consumers under D-2)
· F-38.3's cure, which is `AskSheet` dropping its provider · the three owed plan inclusion
lines · the two orphan rows in §3, on the founder's word · the stale named base ·
Phase 4's tile badges · and the walk card, which does not come to the chair until the
founder's paste prints all-PASS on both gates.
