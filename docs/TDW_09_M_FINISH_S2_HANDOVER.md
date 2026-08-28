# M-FINISH · SITTING 2 — §4-1: THE LIST FAMILY CROSSED

**BASE (R-38.15): `b251600` = `origin/worklist`, re-derived at the moment of cutting.**
dream-os `aeca43f` = `origin/main`, sibling clone present (three floor benches refuse
without it) · **Railway/Vercel green: NOT CLAIMED** — nothing here ran against a deploy.

**⚠ THE TIP MOVED BENEATH THIS SITTING AND THE FIRST CUT SHIPPED AGAINST THE PARENT.**
Reported here rather than met in the apply, per R-38.16. See §8 — F-38.25, mine.

**Packet:** the S2 kickoff arrived as a text relay, so its hash is **recorded, not
re-derived** — byte-exactness of a pasted document cannot be established. Founder's line:
`eb21c614575c751c47b56ac257e6fccd256f18447a58c0d7fd65d7cb432268bd`.

---

## §0 · ENVIRONMENT — AND THE PRECONDITION S3 MUST NOT REDISCOVER

```
pwa worklist 7af1e82 · dream-os main aeca43f
```

**RUN `npm ci` BEFORE THE FLOOR, OR THE FLOOR LIES BY EIGHT.** First derivation in a fresh
container read **30 RED**: the named base's 22 plus seven `run-*-proof` benches and
`waDial`. Diagnosed by command before it was written down — `node_modules` was absent and
`scripts/run-bands-proof.sh:9` shells straight to `node_modules/.bin/tsc`. After
`npm ci` (442 packages): **`FLOOR = NAMED BASE, no delta`, 22 RED.**

This is S1 §7's lesson in mirror image, and the pair is the whole teaching: **S1's container
read four too many because `dream-os` was missing; this one read eight too many because
`node_modules` was.** Both wore the costume of a finding. Both were one command away from
being nothing. The cross-check is always the same — run the failing bench bare and read its
own refusal string before filing anything.

**Sibling `dream-os` fixes the other three.** `tdw09_p2b_vocab`, `tdw13_d6_parity_matrix`
and `tdw15_p1_events` are green in this container, where S1's watched them refuse.

---

## §1 · DOCTRINE

**D-38.1 is FILED, in this repo, and my first message said it was not.**
`docs/D-38.1_DOCTRINE_PRESENCE_IS_NOT_BEHAVIOUR.md` — 79 lines, banked at the S1 seal in
`b251600`, written whole and self-contained **for transplant** into `dream-os`'s
`FINDINGS_LOG.md`, because that log lives in the other repo and S1 was a `dreamos-pwa`-only
sitting carrying zero `dream-os` bytes.

My grep was run at `7af1e82` and was correct there. **It was wrong about the branch**, and
the chair filed `c-38.4` against himself on the strength of it. The finding was real —
the doctrine had not reached `FINDINGS_LOG` — but the seat that reported it as existing
nowhere had not looked at the tip. The transplant into `dream-os` is still owed; the
artifact is not.

The doctrine, as filed:

> A cell that asserts a thing is PRESENT has not asserted that the thing WORKS. These are
> different claims, and the gap between them is where defects live undisturbed for as long
> as the gate is green.
>
> The test for a cell is not whether it would pass on a correct tree. It is whether it could
> fail on the broken one.

**Where it bit, concretely.** C26 does not ask whether `SliceShell` still imports `Header`.
It counts every `<Header>` mount in the tree against a declared census — because the mount
this family was hiding was in `app/vendor/list/[slice]/notes.tsx`, a file no reading of
`SliceShell` would ever have reached. And C27, which could not fail on the broken tree, is
declared a guard rather than reported as a cure (§5).

---

## §2 · WHAT CROSSED

Six rooms — **leads, clients, invoices, expenses, events, notes** — now render at
`app/w/<room>/` as children of `app/w/layout.tsx`. `rooms.ts` hrefs are `/w/<id>`.

**THEY CROSSED AS A FAMILY BECAUSE THEY ARE ONE DEFINITION.** Six tiles, one
`components/vendor/slices/SliceShell.tsx`, mounted six times. Crossing them one at a time
would have meant the shared shell losing its masthead on the first crossing and the other
five rendering headless under the old layout until they caught up: five broken surfaces
produced deliberately, as an intermediate state, for nothing.

Each route imports the **same module** the fallback renders. Nothing is copied. Two list
screens would be two homes for every row, every fetch and every vetoed byte, drifting apart
without either one erroring — F-09.128 is the live specimen of what that costs.

### The Header lift — and the distinction S1 already paid for

`SliceShell` lost `<Header/>` **and lost the import**. Keeping `import { Header }` and
writing `{chrome && <Header …/>}` renders correctly and still ships the old masthead into
every shell room's chunk, with its drawer, its `/vendor` rows and 「DreamAi on WhatsApp」
(`Header.tsx:355`, banned by R-37.70/.78/.83). A conditional does not remove a module from a
bundle; only not importing it does. `Header` mounts at the fallback route now, one mount
covering all six modules.

**`notes.tsx` carried a SECOND Header mount.** It is the one list room that never touches
`SliceShell` — it is the Slice Door plus `NotesBody`. Nothing in the kickoff named it and
nothing in a reading of `SliceShell` would have found it.

---

## §3 · FOUR THINGS THE CROSSING FORCED

Each is argued at its site in code. Three are cures the crossing could not be finished
without; the third is authored beyond R-38.12's letter and is **ratify-or-revert**.

**① The Slice Door's destination follows the tree it is mounted in.** One exported
predicate, `useInShell()`, derived from the route rather than passed as a prop — the route
IS the authority on which tree mounted the component, and a prop is a second statement of
that fact that can disagree with it. `clients.tsx` imports the predicate rather than
re-writing the pathname test; a decision written twice is a decision whose second copy stops
agreeing. Without this, a shell control links backwards into `/vendor` and the amended
standing (CE-38 relay #1 item 3) reddens.

**② The Slice Door contrast obligation came due at its named sitting.** `theme.ts:28-31`
shipped the inactive chip **under bar** — 4.02:1 dark, 3.01:1 light against a 4.5 bar —
named `SliceShell.tsx:104`'s hard-coded `opacity: 0.45` as the cause, and bound the cure
*by label* to "the Phase 2 SliceDoor sitting". The list family crossing is that sitting, so
it is discharged rather than carried a third time. **The opacity is gone, not tuned:** two
measured ink tokens carry the two states (`ink-mute` 4.98:1 dark / 6.79:1 light; `ink`
15.74:1 / 17.82:1). An opacity over a token is a colour nobody measured.

**③ THE GUTTER — AUTHORED, DISCLOSED, RATIFY-OR-REVERT.** The slice tree hand-set a 22px
horizontal inset at **thirteen sites across seven files**, written years before
the shell existed. `WorklistShell` applies its own 16px gutter to its direct children, so a
crossed room sat at 16 + 22 = 38 while every other shell surface sat at 16 — **the founder's
original misalignment grievance, reproduced by the very motion meant to end it.**

**Twelve of the thirteen** became `var(--slice-inset, 22px)`. The thirteenth, in
`WishboneSheet.tsx`, is deliberately untouched: a sheet is not a child of the scroll column,
so the gutter law does not reach it and curing it would have been a change with no defect
behind it. C29 reads the six column components only, for the same reason.
`components/worklist/RoomBody.tsx`
declares the variable zero, **once**. The fallback in each call site is the literal that was
already there and the `/vendor` tree declares the variable nowhere, so **main renders
byte-identically**. That is what makes this a move rather than a fork (D-2): one branch
declares a value, the other keeps the value it always had, and neither has a second copy of
the number.

A sweep to `0` would have been the wrong shape and is named in `RoomBody.tsx` so nobody
tries it: it would pin every list row flush to the glass on main, where nothing supplies a
gutter, and no cell on this branch would ever have caught it.

**This exceeds R-38.12's "chrome only" letter.** It is disclosed at delivery rather than
discovered later, it touches six files, and the revert is mechanical.

**④ The toast paints the wrong world without erroring.** `Toast` reads five values off
`useT()` as **JavaScript**, not as CSS variables. Under `/w`, where no `ThemeProvider`
mounts and none may (F-38.3), it falls to `createContext(DARK)`'s default and paints
Espresso-dark on a Chalk page, in both modes, forever. **It does not throw**, which is
exactly why it would have shipped: the room renders, the toast is simply wrong, and only a
capture with a toast on screen catches it. D-38.1 is the doctrine — observe at the moment
the defect is visible. Paired by the same one derivation as ①.

---

## §4 · TWO CORRECTIONS TO COUNTS

### F-38.24 · S1's HEADER CENSUS COUNTED A COMMENT AS A MOUNT

S1 §7 published **28 mounts across 23 files**. Re-derived comment-blind through the bench's
own `strip()` at `b251600`, the base is **27 across 23** (identical at `7af1e82`; the two commits between them touched no slice file). One `<Header …/>` written inside a
comment *about* `<Header …/>` was counted.

The instrument that prevents exactly this sits at the top of `b40_worklist_shell_bench.js`
and was simply never pointed at the census. **The census was done by eye in a repo that owns
a comment-blind reader.** Not a large error, and filed anyway: the number was load-bearing
for R-38.11's zero-mount clause, and a count nobody can re-derive is how a real drift gets
absorbed.

### THE COUNT AT THE MOMENT OF WRITING

| | mounts | files |
|---|---|---|
| base at `b251600`, comment-blind | 27 | 23 |
| after §4-1 | **26** | **22** |

Net: `SliceShell` **−1**, `notes.tsx` **−1**, fallback route **+1**. Every entry is
enumerated in `lib/worklist/rooms.ts` `INTERIM_VENDOR_MOUNTS`, and `b40` C26 asserts the
tree's census **equals** it: an undeclared mount reddens, and a declared mount that has
vanished reddens **until the census shrinks**. That second direction is the one that keeps
the list honest as rooms cross.

### F-38.22 · THIRTY COLOUR LITERALS — FILED, NOT SWEPT

The slice tree hard-codes colour at **thirty sites across seven files**, re-derived at `b251600`
(`BinderCard` 5, `BulkBar` 2, `DetailSheet` 2, `FilterRail` 2, `SliceRow` 4, `SliceShell` 13,
`WishboneSheet` 2). Most are the Espresso brass `rgba(201,168,76,…)` at low alpha. Inside the
shell's scope they bypass the variable layer and paint warm gold hairlines where the accent
is teal — **the same root cause as the ZIP 4 gold-FAB finding**.

**Not swept inside a structural crossing**, on S1's own AtelierForm reasoning: seven files
with main-side consumers, folded into a motion R-38.12 limits to chrome, would make the
crossing's own both-ways proof unreadable. The cure is mechanical and provably neutral on
main — `color-mix(in srgb, var(--atelier-accent-text) N%, transparent)` renders on `/vendor`
as the brass it was a copy of. **Priced as a sitting of its own.** Named as excluded from the
render arm's tuple cell in code (`tools/wl_render.cjs`, `SCALE_SURFACES`) and in
`docs/COPY_REGISTER_M-FINISH.md` §9.

### F-38.23 · SIX HEADER WORDS WITH THREE HOMES

`leadsTitle` … `notesTitle` duplicate the tile `label` and the Slice Door `LABELS`. Making
`copy.ts` the one home would point a main-side component at a branch-side register, which is
the direction D-2 forbids; the honest reverse is a sitting of its own because `LABELS` is
keyed by `DoorSlice` and the shell by room id. `b40` C30 compares all six and reddens on any
disagreement, so the duplication **cannot drift while it exists**.

---

## §5 · INSTRUMENTS

### `b40_worklist_shell_bench` — 23 cells → 30, amendment labelled

Seven new: **C24** the six crossed in the registry as a set · **C25** each route mounts the
shell, imports no masthead, sits in `RoomBody`, takes its word from the register · **C26**
the mount census, exactly · **C27** the shell tree imports neither piece of old chrome and
reads no `useT` · **C28** the door's destination and the chip's legibility · **C29** no bare
22px inset in the column, one declarer of the variable · **C30** the header words cannot
drift from `LABELS`, and the toast follows the tree.

**BOTH-WAYS AT `b251600`: six of seven RED, on exactly their cure assertions.** C24, C25,
C26, C28, C29, C30 all red at the uncured tree; the other 24 cells stay green there and here.

**⚠ C27 GREENS AT THE UNCURED TREE AND IS NOT REPORTED AS A CURE CELL.** It is a standing
regression guard: `app/w` and `components/worklist` had no such imports at `b251600` either,
so there was nothing for it to catch. A hollow green reported as a cure is worse than a
declared gap, so it is declared. **Non-vacuity proven by mutating production source** — a
`Header` import planted in `app/w/leads/page.tsx` reddens exactly C25 and C27, and nothing
else; restoring the file returns `FLOOR GREEN`.

### Compile

`npx tsc --noEmit` — **exit 0**.

`next build` — **route graph proven, fonts NOT proven, and the distinction is stated because
it is a real gap in this evidence.** A direct `next build` in this container fails on four
`next/font/google` fetches; `fonts.googleapis.com` is outside the container's allowlist. That
is an environment artifact of exactly the class §0 describes, not a finding. To answer the
one question `tsc` cannot — whether the app router tolerates
`@/app/vendor/list/[slice]/leads`, an import crossing a dynamic segment — the build was run
in a **scratch copy** with the four font calls stubbed. **All six routes appear in the
manifest** (`/w/clients`, `/w/events`, `/w/expenses`, `/w/invoices`, `/w/leads`, `/w/notes`,
all `○ Static`). The stub was never in the delivered tree. **The founder's own build is the
real evidence for the fonts.**

### `wl_audit.mjs` — the registry is read, not retyped

The interim list was **fourteen literals copied out of `rooms.ts`**. Two homes for one set,
and this edit is what the second home costs: the moment six rooms crossed, the audit would
have gone on asserting their `/vendor` hrefs were legitimate and **the cell would have
PASSED on a shell linking backwards**. It now derives both sets from `rooms.ts` at run time.
Verified by command: 8 interim room hrefs, 2 interim links. The six crossed rooms joined
`PAGES` and `shellSurfaces`; `/vendor/list/leads` stays, because a crossed room and its
fallback are two surfaces now and the interesting failure is them disagreeing.

### `wl_render.cjs` — captures

Six crossed rooms at rest, in both modes, plus `fallback-leads` beside `w-leads` so the pair
is the evidence of what the crossing did. The `SCALE_SURFACES` exclusion note names the six
and both filed gaps.

### Floor

`FLOOR = NAMED BASE, no delta` on a clean tree. On the dirty delivery tree the diff is
**`tdw_f0774_vacuity_probe` alone**, which reds on any dirty tree exactly as ZIP 14 ⑦
documented and as S1 §7 witnessed at the founder's terminal. **It goes green the moment the
commit lands.** Nothing else moved.

---

## §6 · WHAT THIS SEAT OWNS

- ③, the gutter token, is **authored beyond the ruling's letter**. Disclosed here, argued at
  its site, mechanical to revert.
- The fonts are **not** proven by a build in this container; only the route graph is.
- The captures are **specified, not taken** — no deploy was reachable from this seat. As at
  S1, the founder's frames are the real-session evidence.
- `wl_audit` was **not run against a domain**; it exits 2 without one, as designed.
- **F-38.25 is mine and it reached the terminal.** The first cut was built on the parent and
  reverted three files on apply. §8. Not a near miss caught by care — caught by `tsc`, and
  one file away from deleting two render cells in silence.

## §7 · THE NEXT SITTING — §4-2 ONWARD

Eight rooms remain interim, in `INTERIM_VENDOR_ROOMS` order: **calendar, storefront,
portfolio, couture, team, contracts, tds, collab.** One at a time, smallest radius each,
per §4-2. Then Khata (§4-3), Settings on the rungs and `Sign out` confirm (§4-4), F-38.3
(§4-5), and the retirement sweep (§4-6).

Carried forward: `rooms.ts:1` still reads "THE SEVENTEEN ROOMS" against
`ROOM_COUNT_EXPECTED = 18` — corrected to **NINETEEN at the Khata edit**, one correction at
one site, per CE-38 relay #1 item 4. F-38.22, F-38.23 and F-38.24 are open. C27 remains a
guard, not a cure cell, and should be read that way by whoever inherits the count.

---

## §8 · F-38.25 · THIS DELIVERY WAS FIRST CUT AGAINST THE PARENT

**Mine, and it reached the founder's terminal.**

§0 derived `origin/worklist` = `7af1e82` and reported it clean. That was true when the
fetch ran and false by the time the ZIP was cut: `e939858` and `b251600` landed beneath the
sitting. The first ZIP was therefore 23 files cut from an ancestor, and because the apply
chain is `cp -r deploy/*`, **three of them silently reverted the tip's work**:

| file | what the whole-file copy threw away |
|---|---|
| `lib/worklist/copy.ts` | the `Sign out` confirm bytes, `drawerCancel` among them |
| `scripts/b40_worklist_shell_bench.js` | C13's CE-38 SEAL ② order amendment |
| `tools/wl_render.cjs` | **C-R13 and C-R14** |

Five of the tip's eight touched files survived only because they happened not to be in the
ZIP. That is luck, not method.

**IT WAS CAUGHT BY `tsc`, AND ONLY BY ACCIDENT.** `AccountDrawer.tsx` read `COPY.drawerCancel`
and the key was gone, so the compiler had something to object to. Had the revert landed on
`wl_render.cjs` alone — two render cells deleted, nothing referencing them — **the tree
would have compiled, `b40` would have greened, the floor would have shown no delta, and two
instruments would simply have stopped existing.** A silent instrument loss is the worst
shape this estate has a name for, and this delivery was one file away from it.

**THREE COMPOUNDING CAUSES, ALL MINE:**

1. **CE-22 treated as an opening formality.** I derived the tip once, at §0, and never again.
   The law says *at the moment of writing*; the sitting ran long enough for the branch to
   move and nothing in my process would have noticed.
2. **A ZIP that carries no record of its base.** `deploy/` is a bag of files. Nothing in it
   states what it was cut from, so nothing in the apply can refuse.
3. **A verify block whose STOP was not a shell boundary.** `npx tsc --noEmit && echo "TSC
   CLEAN"` printed nothing and the paste kept running to the commit. **That is D-10's own
   law, broken by the seat that quotes it** — a STOP that is not a shell boundary is not a
   STOP.

**CURED AT THE PROTOCOL, NOT AT THE SITE** (CE-38 relay #2, adopted as chair rulings):

- **R-38.15 · BASE-PINNED ZIPS.** Line 1 of every delivery names the base tip. The verify
  block opens with `git rev-parse --short origin/<branch>` and STOPs on drift **before a
  single file is copied**. `cp -r deploy/*` runs only after that line prints the named base.
- **R-38.16 · CE-22 AT THE MOMENT OF WRITING.** §0's derivation opens the sitting; it does
  not close it. Every handover count and every ZIP is re-derived at the tip at the moment of
  cutting, and a moved tip between §0 and the cut is a report in the handover — this §8 —
  not a surprise in the apply.

The chair filed `c-38.10` alongside: three seats on one branch is a state he chartered, and
R-38.15 should have been in the S2 kickoff before the third seat opened. Both rulings go
into `docs/TDW_BUILD_PROTOCOL.md` at the next `dream-os` band.

**THIS CUT IS THE REMEDY, NOT AN AMEND.** `85072e7` was discarded by
`git reset --hard b251600`. The three colliding edits were re-applied **on top of** the
tip's versions rather than instead of them, and each re-application asserts the tip's own
work is still present before it writes (`drawerCancel` in `copy.ts`, the amended C13 order
array in `b40`, `C-R13`/`C-R14` in the render arm). The other twenty files are untouched by
`b251600` and carried over unchanged. Every count in this document was re-derived here.

---
