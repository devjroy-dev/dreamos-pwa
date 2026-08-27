# M-FINISH · SITTING 1 — THE SHELL BECOMES THE APP

**Over `366a7b5` (`origin/worklist`). Packet `8b83aee41ea806bbbde5f55f2e99ca5b4a307bda7c765b6a6ec8f1ff878ed0a6`.**
**`tsc --noEmit`: exit 0. `next build --webpack`: exit 0, seven `/w` routes.**
**Floor: `FLOOR = NAMED BASE, no delta` — witnessed at the founder's terminal on a clean tree after the commit. See §7's correction: this document's original "stale by four" claim is RETRACTED, and the cause was a missing sibling repo in the executor's container.**

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

### ⚠ CORRECTION · THE "STALE BY FOUR" FINDING BELOW IS RETRACTED

**It was wrong, and it is left standing with its retraction rather than deleted**, because a
finding that vanishes teaches nothing and this one has a lesson in it.

**WITNESSED AT THE FOUNDER'S TERMINAL after the commit landed:**

```
$ bash scripts/run-floor.sh --check
... 22 RED ...
FLOOR = NAMED BASE, no delta
```

**The named base is stale by NOTHING.** At verify time the founder's floor read 23 — the
base's 22 plus `tdw_f0774_vacuity_probe`, which reds on a dirty tree exactly as ZIP 14 ⑦
documented it would and went green the moment the commit landed.

**WHY MY CONTAINER READ 26, DERIVED BY COMMAND:**

```
FAIL 2.1 REFUSED: sibling repo not found at /home/claude/dream-os/src/lib/shared/tagVocabulary.js
BENCH ABORTED — a matrix bench without its capability axis proves nothing.
BENCH ABORTED — dream-os must be a sibling; the kind list is pinned to the
                server's own allowlist and cannot be checked against memory.
```

`tdw09_p2b_vocab`, `tdw13_d6_parity_matrix` and `tdw15_p1_events` are **cross-repo** benches.
The founder's Codespace has `dream-os` as a sibling; the executor container does not. All
three REFUSE rather than pass vacuously, which is **correct conduct on their part** — and I
read three correct refusals as an estate-wide defect and filed it against the chair.

**THE LESSON, WHICH IS THE SAME ONE THIS ARC KEEPS PAYING FOR:** an environment artifact
wearing the costume of a finding. `run-floor.sh`'s own header already carries this class as
desk lore for `--depth 1` clones. The cross-check was one command — clone `dream-os` as a
sibling, or read the benches' own refusal strings — and I ran neither before writing it
down. **A base entry nobody can account for is how a real regression gets absorbed; a false
base entry is how a real instrument gets distrusted.** The delta claim in this section is
unaffected: mine-vs-untouched-tip was derived in one container and was zero, and the
founder's terminal now says so absolutely.

**THE RETRACTED PARAGRAPH FOLLOWS, unedited.**

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

## §9b · F-38.6 — THE ARM WAITED ON A CLOCK, AND THE DEPLOY IS WHAT PROVED IT

**Filed after the founder's first run against the real Vercel deploy**, which is the first
time either instrument met the actual build rather than a local `next start` specimen.

`wl_audit` came back **26 PASS · 0 FAIL · 2 INCONCLUSIVE — GATE GREEN**, 102 chunks fetched
of 102 referenced, at `advisor:200` (the route did not exist before `cebf47a`, so it is
also the provenance check). C-R1 through C-R6 went green. **Then C-R7 measured six selectors
and got six nulls, and C-R8 threw:**

```
FAIL [dark] C-R7a the text edge is one x — {"house":null,"tile":null,"dock":null,"card":null,"spread":0}
FAIL [dark] C-R7b the container edge agrees — {"house":null,...,"main":null}
render arm threw: Cannot read properties of null (reading 'scrollHeight')
```

**BOTH FAULTS ARE IN THE INSTRUMENT AND NEITHER IS IN THE TREE.**

**(a) IT WAITED ON A CLOCK.** Every navigation used a fixed `setTimeout` — 1200ms, 1400ms —
chosen because they were long enough locally. `/w`'s session guard renders a bare background
div while it resolves, so a page that has not finished mounting has **no `.wl-*` element at
all**. C-R7 therefore reported a verdict about the edge of a tree it had never looked at. A
cell that cannot distinguish 「wrong」 from 「not there yet」 is the hollow-green failure
running backwards: same confusion, red end. And the local-vs-deploy split is exactly the gap
this arm exists to close — ZIP 13 wrote that the local build is a specimen and not the
deploy, and I then timed the instrument against the specimen.

**(b) IT THREW INSTEAD OF REPORTING.** C-R8 dereferenced `.wl-main` unguarded, so a missed
wait became a crash. It never reached light mode and it wrote **none of the 24 captures**. A
bench that crashes instead of reddening is worse than one that reds: the red names the cell,
the crash costs every cell after it.

### F-38.8 · THE FIXTURE DESTROYED ITS OWN SESSION — the cause under the cause

The re-run after F-38.6's cure did not go green. It reported `NEVER MOUNTED` for every
surface from C-R6 onward and then threw `net::ERR_ABORTED at …/w/rooms` in light mode.
**The wait was not the whole disease.** Derived by command:

C-R5 clicks `.wl-dockfield` to raise the chat. That fires `AiDock.ensureBusiness()` →
`fetchVictorMode()` → an **authenticated** request. The seeded token is synthetic, so the
deploy answers 401, and `lib/vendor/api/_base.ts:106-113` refreshes once, fails, and calls
`clearAndRedirect()` — `clearVendorSession()` and `window.location.href = '/'`.

**From that click onward the fixture has no session.** Every later `/w` navigation is
bounced by the guard, and a hard redirect racing a `goto` is the `ERR_ABORTED`. The arm was
measuring a logged-out browser and had no way to know it.

`settle()` now **re-seeds once and says so in the log**, because a re-seed is itself
evidence: the only thing that clears the session is a 401 on a real authenticated call.

### F-38.7 · AND C-R6 PASSED ON THE DEPLOY WHILE ALL OF THAT WAS TRUE

**This is the one that matters, and it is the worst kind of defect this estate files.**

Look again at the founder's first deploy run: `PASS C-R6 the tuple set is the scale`. It
was measuring a page that had already bounced to `/`. Its predicate is 「every painted tuple
is one of the six rungs」, and inside `.wl` there were **zero** painted tuples. **Zero
members satisfy a universal claim.** The clock-wait handed the cell an empty page and it
printed a pass.

So the tuple cell — the one cell R-38.4 exists for, the one that caught the dock glyph
painting in Arial — was **green on the deploy for the wrong reason**, and only the stricter
wait exposed it. A cell that cannot tell 「all correct」 from 「nothing to look at」 is
precisely the hollow green this gate was built to refuse, and I shipped one.

**CURED with a non-vacuity floor.** C-R6 now counts what it saw and fails below forty
tuples across four surfaces — deliberately far under the 84 actually observed, so it
convicts absence and never density.

**PROVEN BOTH WAYS, by feeding it the exact condition the deploy produced** (a page that
mounts and paints nothing inside `.wl`, with the mount check neutralised so the floor is
the only thing that can catch it):

```
FAIL [dark]  C-R6 … only 0 painted tuples seen across four surfaces, floor 40 —
                   this cell saw nothing and must not report a pass
FAIL [light] C-R6 … only 0 painted tuples seen across four surfaces, floor 40
```

Restored `cmp`-identical. At the specimen after all three cures: **18 PASS · 0 FAIL, 84
tuples per mode, 24 fullPage frames.**

### F-38.9 · A CAPTURE COST NINE CELLS, AND I HAD ALREADY FIXED THIS ONCE

The run after F-38.7/.8's cure went **green on every dark cell against the real deploy** —
including the re-seat line, which is F-38.8 confirmed live:

```
re-seated the fixture at /w/rooms — the session had been cleared
PASS [dark] C-R6 the tuple set is the scale — 84 painted tuples on four surfaces, every one of the six rungs
PASS [dark] C-R7a the text edge is one x — house/tile/dock/plan-card all at 16, spread 0
PASS [dark] C-R7b the container edge agrees — nav 0 = main 0
PASS [dark] C-R8 eighteen rooms at rest — 18 tiles at 64px, overflow 0, slack 74px
render arm threw: Page.captureScreenshot timed out.
```

**F-38.4's STOP condition met on the deploy, the edge at one x on the deploy, the tuple set
honest on the deploy — and the arm reported nothing**, because the first unclipped
screenshot exceeded puppeteer's default protocol timeout and the throw propagated out of
the whole run. Light mode never executed.

**THE VERDICT IS THE CELLS. THE CAPTURES ARE EVIDENCE.** Those are different things and
they must fail differently: a missing frame is worth one line of log, not nine cells.

**⚠ AND THIS IS THE SECOND TIME A THROW HAS COST LIGHT MODE.** F-38.6's cure guarded the
MEASUREMENT path against precisely this, and I stopped there. **I cured the instance and
not the class** — which is the failure this estate names most often and which I committed
one delivery after writing the paragraph about it. Every step that can throw is now either
guarded or is a cell.

**CURED**, in three parts: `protocolTimeout` raised to 300s (a mitigation, not a cure);
`shot()` guarded so a failed frame logs and the run continues; `reclip()` moved into a
`finally`, because a frame failing mid-unclip would otherwise leave the page expanded and
hand the NEXT cell a shell with no fixed viewport — a capture fault silently becoming a
measurement fault.

**AND A SHORT CAPTURE SET NOW ANNOUNCES ITSELF.** A green verdict beside an empty capture
directory must not read as a complete run: the chair gates these frames before the founder
sees anything, so the arm prints `⚠ EVIDENCE INCOMPLETE` and names the count.

**PROVEN BY MUTATION — every screenshot forced to throw:**

```
24 × "capture failed, cells unaffected: …"
18 PASS · 0 FAIL
captures: 0 fullPage frames
  ⚠ EVIDENCE INCOMPLETE — 24 frames were ruled, 0 were written.
```

All eighteen cells ran, in both modes, and the verdict printed. Restored `cmp`-identical.

### F-38.10 / F-38.11 · I CURED THE INSTANCE FOUR TIMES BEFORE CURING THE CLASS

**This is the section I least want to write and the one most worth keeping.**

After F-38.9's cure the arm went green on every DARK cell against the deploy and then threw
again — `Waiting for selector '.wl-coin' failed` — at the drawer-capture step, which sat
outside `settle()` and outside `shot()`'s guard. Light mode never ran. **Again.**

Count them, because the pattern is the finding and no single one of them is:

| | what threw | what I did |
|---|---|---|
| F-38.6 | measurement navigations | guarded the navigations |
| F-38.9 | `shot()` | guarded `shot()` |
| F-38.11 | `.wl-coin` in the capture block | guarded the capture block |
| F-38.10 | `seat()`, the first call of each mode | guarded `seat()` |

**Four times, and three of them I patched the site that threw and moved on.** The class was
never 「this step throws」. The class is 「anything in the evidence path can reach the
verdict path」, and it took the founder asking why a run was slow to make me stop patching
and look at the shape.

**THE RULE IS STRUCTURAL NOW.** The whole capture block is one `try`. `seat()` returns null
instead of throwing, and the caller reports `the shell never seated` rather than losing nine
cells in silence. There is no unguarded step left in the file.

**AND THE FIXTURE IS NO LONGER REPAIRED — IT IS UNREMOVABLE.** F-38.8's first cure re-seeded
*after* a 401 had already cleared the session, which is reactive by construction: on the
deploy one surface still lost the race and reported NEVER MOUNTED on a tree that was fine.
`evaluateOnNewDocument` now writes the session **before any page script on every document**,
so however often the product logs the fixture out, the next navigation already has one. The
old load-write-reload dance retires with it — two fewer round trips per mode, and the
re-seat count on a clean run is **zero**.

**AND MY 300s protocolTimeout WAS A MISTAKE.** A long timeout does not make a hang succeed,
it makes a hang EXPENSIVE — five minutes per stuck frame turned a two-minute run into
something the founder had to ask about. 120s, with a 45s cap on the screenshot itself.
Post-cure the full run is **78 seconds, 18 PASS · 0 FAIL, 24 frames, zero re-seats.**

**PROVEN BOTH WAYS.** Capture path, every screenshot forced to throw: 24 × `capture failed`,
**18 PASS · 0 FAIL**, `⚠ EVIDENCE INCOMPLETE — 24 ruled, 0 written`. Seat path, landmark
mutated to a class that does not exist:

```
FAIL [dark]  the shell never seated — … every cell for this mode was skipped, not passed
FAIL [light] the shell never seated — … every cell for this mode was skipped, not passed
0 PASS · 2 FAIL     RENDER ARM RED
```

Both modes report; nothing vanishes. Restored `cmp`-identical both times.

**ONE COST DECLARED, NOT CURED:** against a dead host `p.goto` does not reject, it hangs on
CDP, so a total network fault still costs one protocol timeout per attempt. That is latency,
not a wrong verdict, and it is named here rather than discovered later.

### F-38.12 · `fullPage` WAS THE HANG — AND THE ORDER WAS THE OTHER HALF

Ten minutes on the founder's terminal, twice. Two causes, and neither was a timeout.

**(a) THE SCREENSHOT.** Chrome's `fullPage` path re-lays-out the document and composites it
in a single protocol call. On a shell full of `position:fixed` chrome — scrim, drawer, dock,
nav — over a network round trip it does not reliably return. **Raising or lowering the
timeout was never going to fix it**, and my 300s made every hang cost five minutes. The page
is already unclipped, so its height is known: set the viewport to that height and take an
ORDINARY screenshot, which is one composite of what is on screen with no re-layout in it.

**(b) THE ORDER.** C-R4/C-R5 open the chat, and opening the chat fires an authenticated call
that 401s and triggers `clearAndRedirect()`. Per-document seeding gives the NEXT page a
session but cannot stop the redirect hijacking a navigation already in flight — which is
exactly why C-R6 kept reporting `/w/rooms NEVER MOUNTED` while C-R3, C-R7 and C-R8 passed
on that same route seconds later. **The cure is sequence, not machinery.** The one action
that logs the fixture out now runs after every cell that needs it logged in. Two retry
ladders and a per-document seed were me adding mechanism to survive an ordering problem.

**MEASURED AFTER, at the specimen:** cells + 24 frames, **81s**. **Cells only: 14s.**

### THE SPLIT, AND IT IS OPERATIONAL NOW, NOT DOCTRINAL

`--capture` is opt-in and **should normally be OFF against a deploy**. Screenshotting eight
surfaces twice over a network is most of this instrument's runtime, and every minute of it
is the founder's. The verdict is the cells. The frames are evidence for the chair, they are
chrome-and-layout only (the token is synthetic), and a LOCAL build shows the same chrome the
deploy does — so the chair can gate frames locally while the founder runs cells against the
real thing in about fifteen seconds.

### ⚠ THE LIMIT THIS SEAT HAS BEEN WORKING UNDER, STATED PLAINLY

**The executor container cannot reach `vercel.app`.** Every arm cure in this section was
verified against a local `next start` and shipped to the founder to be tried against the
deploy. Four of them passed locally and failed there — the clock waits, the cleared fixture,
the capture throw, the `fullPage` hang — because latency and a real 401 are exactly what a
local specimen does not have. That is not an excuse for the four rounds; the ordering fault
was visible by reading, and 「cure the class, not the instance」 is written in this estate's
own protocol. But it is the reason the loop ran through the founder's terminal instead of
mine, and it is why the split above matters: **the half I cannot verify should not be in
the founder's critical path.**

**CURED.** No clocks remain in the navigation path. `settle()` waits for the tree's own root
landmark and then for the surface's landmark, and an unmounted surface produces
`SURFACE NEVER MOUNTED — no measurement was taken` rather than a measurement or a throw.

**AND THE FIRST CURE OVER-REACHED, disclosed rather than quietly fixed:** it waited for
`.wl-main` on every path, including the two carried `/vendor` rooms that are captured ON
PURPOSE as the seam the founder is being asked to judge. Those surfaces have no `.wl-main`
and never will, so the arm skipped them and shipped **20 frames where 24 were ruled**.
Waiting for the wrong landmark and waiting for no landmark fail the same way. The root
landmark is per-tree now.

**NON-VACUITY, by pointing the arm at a route that mounts no shell:**

```
FAIL [dark]  C-R7a … SURFACE NEVER MOUNTED — billing=false rooms=true; no measurement was taken
FAIL [dark]  C-R8  … SURFACE NEVER MOUNTED — no measurement was taken
FAIL [light] C-R7a … SURFACE NEVER MOUNTED — billing=false rooms=true; no measurement was taken
12 PASS · 6 FAIL
```

**Both modes report.** Before the cure the same condition produced a throw and light mode
never ran. Restored `cmp`-identical.

At the specimen after the cure: **18 PASS · 0 FAIL, 24 fullPage frames.** The deploy run is
the founder's paste and nothing here claims otherwise.

## §11 · THE FOUNDER'S WALK — F-38.13, AND WHAT THE GATE PASSED OVER

Both gates were GREEN on the deploy before this walk. **The founder found in ten minutes
what six instrument runs could not**, because every arm frame is `__SYNTHETIC-SPLASH` — the
token is not real, every authenticated fetch fails closed, and no captured surface carries
data. His walk is the only real-session evidence this arc has.

### F-38.13 · THE MASTHEAD AVATAR WAS DEAD IN ALL FOURTEEN CARRIED ROOMS

「the masthead avatar doesnt work in most of the rooms. billing is the only one it works in.」

**Derived, not guessed.** `Header.tsx:152` is `position:sticky, zIndex:20` — a stacking
context. The coin at `:176` carries **no position and no z-index**. The scrim at `:224` is
`position:fixed, inset:0, zIndex:199` — and `grep -n profileOpen Header.tsx` returned eight
hits, **not one of which gated a mount**. The panel is hidden by style; the scrim was hidden
by nothing. A full-viewport button sat permanently over a coin painted beneath it. `/w/*`
renders no `Header`, which is exactly why Billing — the surface that crossed — was the only
place the avatar answered.

**Mine, and branch-only.** `66dd7dc`, ZIP 11, R-37.84 (6) — the ruling that gave the drawer
a scrim so it would stop displacing the page. The scrim was right; mounting it
unconditionally was not. `git merge-base --is-ancestor 66dd7dc origin/main` → not an
ancestor. **No paying vendor has ever met it.**

**CURED, arm (a):** `{profileOpen && (…)}` at the scrim. One line. The panel stays
style-hidden because its transition needs a node to animate from — which is why arm (b) was
refused, and the asymmetry is reasoned at the site rather than left to look like an
oversight.

### ⚠ AND THE CELL WHOSE SUBJECT WAS THE DEFECT REPORTED A PASS ON IT

```
PASS  R-37.84 ⑥ drawer overlays — fixed scrim present; the grid is not in flow behind it
```

It asserted the scrim **exists**. It never asserted the scrim exists **only when the drawer
is open** — and an unconditional mount satisfies that predicate perfectly. **This is the
third time this sitting that presence stood in for behaviour**: F-38.7 (C-R6 passing on an
empty page), F-38.13 here, and the vacuous R-38.2 tile clause. The pattern is not
carelessness at three sites; it is one habit of writing 「the thing is there」 where the
ruling said 「the thing works」.

### THE CORRECTION TO RELAY #3, REPORTED NOT ABSORBED

The ruling put all three new assertions — scrim absent at rest, present when open, and a
**synthetic tap** flipping `profileOpen` — inside `wl_audit`'s `R-37.84 ⑥`. **None of the
three is reachable from served bytes.** A fetch runs no JavaScript, dispatches no tap, and
has no notion of 「at rest」; by this gate's own ratified law (ZIP 14 ①) that class prints
INCONCLUSIVE and never PASS. So the cell was amended **in place, count preserved**, to
assert the MECHANISM — the scrim ships behind a guard — and the three behavioural clauses
became **C-R9** in the render arm, on `/vendor/list/leads`, because that is where the defect
lived and `/w/*` would have exonerated the tree by not containing the thing under test.

**C-R9's middle clause is a HIT-TEST, not a query:** `elementFromPoint` at the coin's own
centre must return the coin or a descendant. It is the only assertion in this estate that
would have caught F-38.13, because the coin was always present, always styled correctly,
and always covered.

**Two instrument faults found writing it, both mine, both disclosed:**
- **C-R9 raced `Splash`.** The cold-open hero is a fixed z-10000 div that unmounts on a
  timer (MIN_MS 2200 + 600 + 450). The cell hit-tested at ~1500ms and convicted a CURED
  tree of covering its own coin — the exact mirror of F-38.7, an instrument reporting on a
  moment rather than a state. It waits the transient out now, with a bound, and still
  convicts a cover that never leaves.
- **The `⑥` predicate matched the wrong site.** Anchored on `--role-scrim`, it found
  `ThemeContext`'s `applyCSSVars` several hundred bytes earlier and reddened a cured tree.
  Anchored on the scrim's own `aria-label` now.
- **And C-R4/C-R5 inherited C-R9's page** and threw `No element found for selector:
  .wl-dock`. A cell that depends on the previous cell's leftover page has an invisible
  argument; they settle their own surface now.

### ONE WITHDRAWAL, KEPT WITH ITS REASONING

I added `thedreamwedding.in` to the retired-strings cell on the reasoning 「a retired row's
destination must not ship either」. It reddened a correct tree: **the domain is the estate's
own**, shipping on every surface from `public/admin-manifest.json`'s `start_url` and
`scope`. **A retired row is a row, not a URL.** The six-row drawer cell is the honest guard.
Withdrawn, and the withdrawal is written at the site.

## §12 · RELAY #3's OTHER RULINGS, EXECUTED

**THE DRAWER — arm (b), site row retired.** 「why do i have a dream wedding there?」 was a
grouping question and he was right: three of four rows under a heading true of two. R-38.6
retired 「Atelier」 as a section name and this seat replaced the NAME while carrying the rows
under it unexamined. **A better heading over the same unexamined set is not a cure.**

```
ACCOUNT    Settings · Billing
REACH US   TDW on WhatsApp
DISPLAY    Graphite · Chalk
ACTIONS    Sign out
```

`The Dream Wedding` leaves; product chrome does not link to its own homepage. `Sign out` is
sentence case. Row-set cell amended by label, count preserved at six.

**TWO BILLING DESK DEFECTS.** The chip read `BASIC` under a plan card reading `Basic` — a
chip that repeats the line above it is decoration, not status; it is absent on the floor
tier now. And the plan rows had **no affordance at all**: tappable and looking inert,
because R-38.8's row shape waits on three inclusion lines nobody has written. The chevron
ships now, ahead of the copy — **what the row does is not waiting on what the row says.**

**R-38.9's 「six full rows」 struck.** Geometry accepted; C-R8 already asserts all eighteen
visible at rest.

## §13 · THE SECOND WALK — F-38.13 CURED, THREE MORE FOUND

**F-38.13 holds on glass.** The avatar opens on `/vendor/tds` and `/vendor/list/leads`.
Founder-witnessed, which is the only witness that counts for a hit-test.

### F-38.14 · A PRESS STATE AT 1.12:1 IS NOT A PRESS STATE

「theres no feeling that a button is being pressed. no press animation.」

The rule was there. R-38.2's cell asserted it exists. **Measured**, the drawer row moved
from `rgb(29,30,32)` to `rgb(38,39,41)` on press — **1.116:1** in Graphite, **1.081:1** in
Chalk. Nine values per channel. Invisible.

**This is the fourth appearance of one habit.** F-38.7 (a cell passing on an empty page),
F-38.13 (a cell asserting the scrim exists, not that it is conditional), the vacuous R-38.2
tile clause, and now this: **presence standing in for behaviour.** The ruling said the
control must ANSWER the finger. The cell asked whether a rule was present. The founder
asked whether anything happened. Only the third question is the product.

Sized by measurement, not by eye: Graphite `0.14` → **1.511:1**; Chalk `0.11` → **1.251:1**,
which is the most a white ground gives before a pressed row starts reading as a disabled
one. Token values only — count unchanged, C1 green.

### F-38.15 · THE SEPARATORS WERE INSIDE THE GROUPS AND ABSENT BETWEEN THEM

「theres a line that comes between graphite and chalk」

The rule was an adjacent-sibling selector, so it fired between any two consecutive rows and
**never across a section** — the eyebrow is a `div` sitting between them, which breaks the
adjacency. Exactly backwards for a grouped list: hairlines inside each group, nothing at the
boundaries.

Graphite/Chalk is the case that makes it obvious: those are **one control in two states**,
and a hairline between them says 「two things」 about a radio pair. The boundary moves onto
the section eyebrow, where the grouping actually changes, and the mode pair is exempt by
name.

### F-38.16 · A DESTRUCTIVE CONTROL SAT SIX PIXELS UNDER A LABEL

「clicking action signs me out」

He tapped the word ACTIONS. The eyebrow is not interactive, so the tap fell through to the
52px row beneath it — **Sign out**, which ends the session and has no confirmation. Six
pixels of padding was the entire margin for error on the one control in this drawer that
cannot be undone by tapping again.

Separation widened. **Whether Sign out should also CONFIRM is a ruling and is put to the
chair, not taken** — every other destructive control in this estate confirms
(`CancelBlock` does, and its warning carries the irreversibility), so the asymmetry is real
and is the chair's to close.

### AND THE FOURTH BACKTICK FAULT — CURED AS A CLASS, NOT AN INSTANCE

Writing F-38.15's comment I closed a template literal with a backtick around a CSS selector,
for the fourth time this sitting, in the fourth file. ZIP 14 ⑧ named the family and naming it
did not stop it. `WorklistShell.tsx` now carries a standing rule above its CSS block:
selectors in those comments are written in words, not in code marks. Mechanical, not
attentive — the same reason R-38.4 emits a font shorthand instead of trusting call sites.

### THE TWO-DRAWER STATE, REPORTED

「the settings in other rooms is completely different. its the earlier setting.」

**Correct, and it is the interim's declared cost** — the fourteen uncrossed rooms wear the
old `Header` and its drawer. But it is worse than 「different」, and that part is not
declared anywhere: that drawer still ships **`DreamAi on WhatsApp`** (banned by
R-37.70/.78/.83), **`Tips & Features → /vendor/more`** (a route R-38.1 forbids from a shell
control), and **`The Dream Wedding`** (retired from the shell drawer at relay #3 ITEM 3).
Three retired or banned bytes, live on fourteen surfaces.

It ends when the twelve remaining rooms cross. Whether anything should be done before then
— hide the old coin, or leave it — is the chair's, and patching the old drawer to match
would give the drawer's rows a second home, which is what R-38.1 exists to end.

## §14 · F-38.17 — TWO DRAWERS BEHIND ONE MEDALLION

「why is setting not uniform across all in the avatar? is it so hard to check?」

**It was never a checking problem. It was two definitions.** `/w/*` rendered the shell's
drawer; the fourteen carried rooms rendered `Header.tsx`'s own hardcoded one, with different
rows, different destinations, different glyphs and a different register. Two menus behind one
medallion in one app.

**I reported this twice as 「the interim's declared cost」.** That was accurate and it was
not a cure. **A vendor does not experience a declaration.** He opens the coin twice and gets
two answers.

And the second drawer was still shipping three bytes the estate had already retired or
banned — 「DreamAi on WhatsApp」 (R-37.70/.78/.83), 「Tips & Features」 pointing at a route
R-38.1 forbids, and 「The Dream Wedding」, retired at relay #3 ITEM 3. **Every ruling that
landed on the shell's drawer missed the other one, because the other one was somewhere
nobody was looking.**

### THE CURE, AND THE ARGUMENT I GOT WRONG THE FIRST TIME

`components/worklist/AccountDrawer.tsx` is **one definition**; both trees mount it. The row
set, destinations, section names and order exist exactly once, and a ruling that lands there
lands everywhere at the same moment.

**I argued against this a message earlier** — that making the old drawer match would give
the rows a second home. That is true of COPYING them into `Header.tsx` and is the opposite
of true here: two definitions collapse into one. I refused the right thing for a reason that
applied to a different thing.

The tokens travel with it: the drawer emits `typeCss` onto its own root, because it renders
outside `.wl` where no rung variable exists. That is why `typeCss` takes a selector — one
home for the scale, any number of scopes. And **the carried mount is now a door INTO the
shell**: Settings and Billing point at `/w/*`, so opening the coin in a carried room lands
the vendor in the new chrome instead of keeping him in the old one.

### THE CELL COULD NOT HAVE CAUGHT THIS, AND THAT IS THE FIFTH INSTANCE

`R-37.79` read the SHELL bundle only. **A cell scoped to one of two implementations cannot
see a divergence between them** — so it passed for the entire life of the defect. It now
asserts the same row set on `/w` AND on a carried room, and the retired rows absent from
both; the message names which side diverged. At the tip it reads:

```
FAIL R-37.79 one drawer, both trees — the carried room is missing rows:
     Reach us · TDW on WhatsApp · Sign out — two drawers behind one medallion
```

`b40`'s C19 is amended the same way, count preserved: it asserted the literals 「Graphite」
and 「Chalk」 inside `Header.tsx`, which only worked BECAUSE that file hardcoded a drawer. It
now asserts Header mounts the shared drawer and that the mode names live at their one home
in `copy.ts` — **one vocabulary made structural instead of checked.**

### TWO FAULTS OF MINE WHILE DOING IT

**I deleted CSS with a regex.** Stripping the shell's now-duplicate row rules, the sweep ate
the declaration bodies and left the selectors, which swallowed the gutter law into a
malformed rule. **C-R2 caught it** — `declared 16px; rendered left 0, right 390 of 390` —
and C-R7a with it. An automated edit to a stylesheet is a blind edit; that block is
hand-written now, with the incident recorded in it.

**And the retired-row check over-reached**, matching 「DreamAi on WhatsApp」 in
`TipsCarousel`'s PROSE rather than in a row, and reddening a cured tree. Same shape as the
withdrawn `thedreamwedding.in` entry. Anchored on the drawer's own label span.

### F-38.18 · FILED, NOT CURED — COPY THAT OUTLIVED ITS CONTROL

`TipsCarousel.tsx:25` still tells the vendor to 「Tap "DreamAi on WhatsApp" in your
profile」. **That row no longer exists in either drawer.** `OnboardingOverlay.tsx:102/110`
carries the same name. Copy outliving its subject is the wl-plink disease in prose. It is
founder-vetoed copy on carried surfaces and belongs to the sitting that crosses them.

## §15 · F-38.19 — THE COIN ASKED THE NETWORK FOR A NAME IT ALREADY HAD

「look at image 3 avatar. before loading DR it shows this」

`useVendorInitials` started at `''`, so the medallion painted its fallback glyph and then
swapped to `DR` when `/api/v2/vendor/me` returned. On Fast 4G that is most of a second of a
vendor watching a placeholder identity turn into his own.

**The name was in localStorage the whole time.** `getVendorSession()` carries `name`, and
the old `Header` never had this flicker for exactly that reason — it took the name from the
session synchronously. This hook asked the network a question it could already answer.

**CURED by seeding, not by removing the fetch.** A session name can be stale — renamed on
another device, or edited in Settings before the session is rewritten — so the server stays
the truth. The seed paints immediately and the wire read overwrites it if it differs. **What
goes is the WAIT, not the check.** And the wire read now only overwrites on a real answer:
an empty name from the server must not blank a seed that is currently correct.

**IT SEEDS IN THE EFFECT, NOT IN useState's INITIALISER**, and that is deliberate. This
component is server-rendered before it hydrates; `window` does not exist there, so seeding
at first render would have the server emit the glyph while the client emits DR — a hydration
mismatch traded for a flicker. One frame is not perceptible; a hydration error is a different
defect wearing the cure's clothes.

The initials rule is extracted to one function, so the seed and the wire read cannot disagree
about shape.

### C-R10 · AND THE CELL HAD TO BE WRITTEN AGAINST THE FIRST PAINT

This is the assertion that could not be made the easy way. Every other cell in the arm runs
after `settle()`, and by then the fetch has usually landed — **a broken tree would pass.**
C-R10 navigates and reads the coin as early as the element exists, waiting for nothing else,
because the first paint is the only moment the defect is visible.

Both ways, and it reproduces the founder's screenshot exactly:

```
cured    PASS C-R10 — seeded from the session: DR
d0949e4  FAIL C-R10 — first paint reads "◎" — the coin is waiting on the wire
                      for a name already in localStorage
```

**This one is not the presence-for-behaviour habit.** It is the other half of the same
lesson: a cell that observes at a convenient moment rather than the decisive one is a cell
that will pass on the defect it was written for.

## §10 · THE NEXT SITTING

The fourteen uncrossed rooms, in `INTERIM_VENDOR_ROOMS` order · Settings' body onto the six
rungs (and the AtelierForm question underneath it, which has main-side consumers under D-2)
· F-38.3's cure, which is `AskSheet` dropping its provider · the three owed plan inclusion
lines · the two orphan rows in §3, on the founder's word · the stale named base ·
Phase 4's tile badges · and the walk card, which does not come to the chair until the
founder's paste prints all-PASS on both gates.

**SITTING 2'S CHARTER, as ruled at CE-38 relay #3 and R-38.10:**
- **TODAY FROM THE TYPED FEED.** `/vendor` retires as a surface at Phase 4 and gets no tile.
  The shell's Today is built from `GET /api/v2/vendor/worklist/today` (typed plane, frozen
  §3 contract) — **not** the engine reader the founder was looking at. F-P3.11 witnessed
  that reader disagreeing with typed truth, 12 against 11, on this same account. The shell
  will not inherit a number the estate cannot explain; the engine reader retires at the
  §8.9 seam once F-P3.11 is diagnosed.
- **R-38.10 · KHATA, the nineteenth room.** Tile byte 「Khata」, Your Work band. One ruled
  register: every money movement in date order, credit and debit in aligned tabular
  columns, a running balance, a `Received / Outstanding` head in t2 numerals. Reads the
  Cabinet endpoint's money slices only, and sits beside Invoices and Expenses as the ledger
  those two write into. **Workbench, Cards, the Cabinet sheet and the hood gesture all
  retire** — Workbench was a fourth view of three rooms that already have tiles, and no
  third door survives R-37.64. Geometry re-derives at build with the STOP clause: nineteen
  at 64px still clears 844 by this seat's own measured numbers, but that is arithmetic
  until the arm says otherwise.
- **F-38.3's cure** — `AskSheet` drops `<ThemeProvider pinned>` once every component it
  renders reads CSS variables only.
- **The remaining twelve crossings**, in `INTERIM_VENDOR_ROOMS` order, and Settings' body
  onto the six rungs.
- **The `TODAY` copy section**, proposed by the seat in the functional register. Nothing
  crosses from the hub as copy: not the spelled masthead, not the triptych, not the italic
  lead prose.
