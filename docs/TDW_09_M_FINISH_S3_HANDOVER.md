# M-FINISH · SITTING 2, SESSION 3 — §4-2 OPENS: CALENDAR CROSSES

**BASE (R-38.15): `f3e23dd` = `origin/worklist`, re-derived at the moment of cutting.**
Sibling `dream-os` `f7f5a6e` = `origin/main`, clean. **Railway/Vercel green: NOT CLAIMED** —
nothing here ran against a deploy.

**Packet:** the S3 charter arrived as a text relay; no hash to re-derive. Its scope is
recorded verbatim in §1 so the next seat reads the charter rather than an account of it.

---

## §0 · ENVIRONMENT — A COMMAND, NOT A SENTENCE

```
bash tools/preflight.sh worklist
```

```
pwa worklist f3e23dd · dream-os main f7f5a6e · both clean · node_modules present
branch alias: https://dreamos-pwa-git-worklist-devjroy-devs-projects.vercel.app
```

R-38.20b. The word "present" is banned; the tip is printed.

**⚠ THE TIP MOVED BENEATH THIS SITTING AND THE GUARD CAUGHT IT.** §0 opened at `14836e1`;
P0-B step 5 landed `4f2482d` while this was building, and `base_guard.sh` refused the apply
with *HEAD is 4f2482d, base is 14836e1 — the local checkout is not on the base*. **That is
R-38.20 doing the exact job F-38.25 bought it**, and it is the first time in this arc a
moved tip was met by a refusal instead of by a silent whole-file copy over somebody else's
work. Re-cut here, on the tip, with every count below re-derived after the rebase.

Step 5 touched `docs/COPY_REGISTER_TDW19.md`, `docs/TDW_19_P0B_HANDOVER.md` and
`tools/bs_audit.mjs`. **Zero overlap with this delivery's twelve files**, derived by
command, not assumed from the commit message.

---

## §1 · THE CHARTER, AND WHAT THIS SITTING REACHED

Four items in order: ① calendar crosses ② the remaining seven, one at a time ③ Khata if
the seam allows ④ Settings on the rungs + F-38.3's cure to close.

**REACHED: ① ONLY. Banked at the first authored-drift tell, which arrived early and is the
reason the seam closed here** — see §4. Items ②③④ are untouched and the next sitting opens
on storefront with the shape below already proven.

---

## §2 · CALENDAR CROSSED — ONE EDIT, THREE SITES

| site | what moved |
|---|---|
| `lib/worklist/rooms.ts` | href `/vendor/calendar` → `/w/calendar`; `INTERIM_VENDOR_ROOMS` 8 → 7 |
| `components/vendor/AddSheet.tsx:496` | ``router.push(`/vendor/calendar?block=${d}`)`` → ``router.push(`${roomHref('calendar')}?block=${d}`)`` |
| `components/worklist/AddFab.tsx` | **the code did not change.** Only the comment did |

**THE THIRD SITE IS THE ADDRESS BOOK'S WHOLE WARRANT, PAID OUT.** R-38.18's Calendar leg
has asked `roomHref('calendar')` since the day it was written, and its comment said: *it is
a declared interim address, and it becomes a `/w/` route in the same edit that crosses the
room, with nothing here to remember.* That is exactly what happened — the registry answered
differently and the leg followed, untouched.

**AND THE COMMENT STILL HAD TO BE REWRITTEN**, which is the half that is easy to skip. The
old note described calendar as interim; a comment that has stopped being true is worse than
none, because the next reader trusts it and reasons from a status that changed a sitting
ago. This seat filed F-38.29 three times last sitting for the gap between a comment and the
line beneath it. **Here the line was already right and the words were not — the same defect
wearing the other face.**

`AddSheet.tsx:496` was the TENTH literal the S2 ZIP bounce found. It was left
declared-and-allowed on purpose, with a note saying it would re-point when calendar
crossed. This is that edit.

### THE FILE SPLIT, AND WHY IT IS STRUCTURAL RATHER THAN TIDY

`app/vendor/calendar/page.tsx` was one file holding both the body and the route's chrome.
It is now two:

- **`app/vendor/calendar/screen.tsx`** — the body. `export function CalendarScreen`, and
  **no `Header` import.**
- **`app/vendor/calendar/page.tsx`** — the surviving fallback route. Session guard,
  `<Header/>`, the shared body. Shape copied from `app/vendor/list/[slice]/page.tsx`
  deliberately: one precedent, one shape, nothing for the next seven crossings to invent.

**THE SPLIT IS NOT NEGOTIABLE AND S2 PAID FOR THE LESSON ONCE.** `SliceShell` kept
`import { Header }` and wrote `{chrome && <Header/>}`. It rendered correctly and still
shipped the old masthead — its drawer, its `/vendor` rows, its banned bytes — into every
crossed room's chunk. **A conditional does not remove a module from a bundle; only not
importing it does.** So body and chrome cannot share a file, and the `Header` import's
absence from `screen.tsx` is asserted rather than intended.

**`vendorName` LEFT WITH THE MOUNT.** It was read by exactly one thing, and once the Header
lifted, the parameter was dead. Derived, not assumed: after the lift the only occurrence in
the file was the signature. An unused prop is not tidiness debt — it is a named, typed hole
the next reader fills, and then the body knows the vendor's name for no reason on a surface
that must not print it.

### THE MOUNT CENSUS DOES NOT SHRINK, AND THAT IS CORRECT

The charter says `INTERIM_VENDOR_MOUNTS` shrinks with each crossing. **It cannot for this
one, and the reason is structural rather than an omission.** The six list rooms gave up two
mounts and their fallback route took one back: net minus one, one file leaving the census.
Calendar's body and its fallback route were **one file**, so the mount moved *within* the
crossing rather than out of it. `app/vendor/calendar/page.tsx` still renders exactly one
`Header`, the census still declares it at 1, and the constant that shrinks is
`INTERIM_VENDOR_ROOMS` (8 → 7).

**A census bent to shrink here would have been a number edited to match a sentence.**
Reported rather than forced; the same will be true of every room whose body and route are
one file, which is most of the remaining seven.

### BOTH-WAYS, AT THIS TIP

The charter asked that the interim tracking redden on the stale literal at the uncured tree
and green after. `wl_audit` needs a deploy, so its **source-side twin** carries the proof
here and the founder's run carries the served-bytes half:

- **Restore the `/vendor/calendar` literal in `AddSheet.tsx`** → `b40` C31 reds, naming
  `AddSheet.tsx:496` reachable from **eight** rooms. An independent import-graph walk names
  the same eight. Restore the cure → zero strays across all eleven shell rooms.
- **Revert only the registry href** → C24 reds: *the registry carries 8 /vendor hrefs but
  declares 7 interim rooms.* The set assertion catches a room sliding back out.

---

## §3 · FOUR INSTRUMENTS RE-POINTED, AND THREE OF THEM HELD A LIST THAT HAD STOPPED BEING TRUE

**This is the sitting's real finding.** Calendar crossing was four hours of nothing; what
took the time was that **four instruments each held their own hand-typed copy of "the
crossed rooms," and not one of them would have noticed a seventh.**

**`b40` — four lists, now one derived helper.** C25, C30 and C31 each retyped
`['leads','clients','invoices','expenses','events','notes']`. They would have gone on
asserting six rooms while the shell served seven. **That is `wl_audit`'s own interim-list
disease from S2 §5, reproduced inside the bench written to guard against it.**

**AND THE FIRST CUT OF THE HELPER CONFLATED TWO CATEGORIES, WHICH THE RUN CAUGHT IN ONE
PASS.** Not every `/w` room is a *crossed* room: Billing, Settings, Business Solutions and
Advisor are **shell-native**, built for `/w`, with no body in the `/vendor` tree and no
Slice Door behind them. Deriving on the href alone reddened a correct tree on five counts —
*billing does not sit in RoomBody*, *support does not take its header word from the copy
register*, *door label undefined*. The distinguishing property is not the href; it is
whether the room's page imports a body out of `app/vendor`. Two helpers now:

- `shellRooms()` — every `/w` room the registry declares. C31 uses this, because a `/vendor`
  literal reachable from Billing is as wrong as one reachable from Leads, and the S2 bounce
  found its worst specimen in a tier gate nobody thought of as a door.
- `crossedRooms()` — those whose page imports from `app/vendor`. C25 uses this.
- **C30 goes back to the six by name.** Its subject is `LABELS`, keyed by `DoorSlice`.
  Calendar has no door label and never will, so widening it asserts a correspondence that
  does not exist.

**`wl_audit` — `PAGES` and `shellSurfaces` derive from the registry.** Eleven surfaces,
twelve with `/w/calendar`. Hand-typed, they were correct for exactly as long as the shell
served eleven rooms.

**`wl_render` — the capture set derives too, and its frame floor was already stale.** The
set was thirteen hand-typed pairs; calendar would have been the one surface the founder
never saw a frame of — the newest one, the only one worth looking at. And the completeness
check read `if (n < 28)` from a capture set two sittings old: **it could only ever
under-report, so it never fired and nobody noticed, which is exactly how a floor stops being
one.** Derived now: **42**.

Calendar's body joins `SCALE_SURFACES`'s named exclusions on the same reasoning as the six —
it crossed structurally, its chrome conforms, its body carries the older type register and
F-38.22's colour literals. The frame is still taken, so the founder sees the gap he is being
asked to price.

---

## §4 · F-38.39 · THE CROSSING BROKE A FLOOR BENCH, AND R-38.19 CAUGHT IT AT THE CUT

`scripts/tdw09_hotfix.proof.mjs` went RED on **twelve cells** the moment the file split —
2.6, 2.17–2.20 and all of §3. Every one reads the calendar's body, and the body is
`screen.tsx` now.

**THIS IS F-38.27's CLASS, AND THE DIFFERENCE IS THE ENTRY.** At S2 the same thing happened
— a crossing cure retired a literal a floor bench asserted, the bench went red with the cure
and **shipped**, because the handover's floor line had been derived before the cure existed.
R-38.19 was written out of that failure: *the floor is re-derived at the cut, never quoted,
and you compare the SET, not the count.* **It fired exactly as designed.** The count would
have looked almost innocent — 24 against a base of 23 — and the set named the bench.

Cured by following the subject: `CAL_BODY = 'app/vendor/calendar/screen.tsx'`, declared at
both reading sections rather than once at the top, because those two sections read the file
for different claims and a shared constant would invite a third reader to assume they check
the same thing. **A cell renamed to follow its subject is not a loosened cell**; a cell left
pointing at the old path would have reddened a correct tree and taught the next seat that
this bench may be argued with.

**PRICE THIS FOR THE SEVEN REMAINING CROSSINGS.** Storefront, portfolio, couture, team,
contracts, tds and collab are each read by benches under `scripts/`, and each split will
break some of them. The floor at the cut is what finds them; there is no reading that will.

---

## §4b · F-38.40 · THE GATE STOPPED FETCHING THE PAGE HALF ITS CELLS READ

§3 replaced the audit's hand-typed surface lists with a registry derivation. **`/w/rooms` is
not a registry entry** — there is no room with id `rooms`; it is the directory surface
itself — so it fell out of `PAGES` and the gate stopped fetching it. Six cells that
defaulted to `|| ''` then reported the shell bundle as **absent** — a FAIL about the tree,
for a fault in the reader — and the first cell that did not default threw
`Cannot read properties of undefined (reading 'includes')` and ended the run.

**I PRINTED `PAGES = 14 surfaces` WHEN I MADE THAT CHANGE AND CHECKED THE COUNT.** The
derived list was in the same output, `/w/rooms` visibly not in it. **A count is not a set** —
the sentence R-38.19 exists to enforce about floors, and I did not apply it one line above
where I had just written it.

**THE CURE IS `corpus(path)`, NOT A LONGER LIST.** Cells reached into the Map directly, some
with `|| ''` and some without, so one cause produced two unrelated-looking failures. A page
missing from `PAGES` now refuses **by name** before any assertion is scoped to it. Thirteen
call sites rewired. Non-vacuity exercised: a corpus without `/w/rooms` exits 3 naming the
page.

**AND THE FIRST GUARD I WROTE FOR THIS WAS VACUOUS.** It read the three non-room surfaces
into a constant and checked each was in `PAGES` — which is built by spreading that same
constant. Dropping a name removed it from both sides at once and the guard said nothing.
Caught by mutating it. **A guard that cannot fail on the broken tree is not a guard**
(D-38.1), and it is deleted rather than shipped: the real assertion was never "is the list I
wrote the list I wrote", it was "did every cell read bytes this run actually has".

**ONE THING F-38.37's CURE CANNOT REACH, RECORDED SO IT IS NOT REDISCOVERED:**
`GATE-UNSOUND` fires during coverage, and the `DEPLOY:` stamp is read out of the corpus
coverage builds. So on a corpus failure the gate cannot say which commit it was looking at.
Inherent, not a defect — but it is the one hole in the build-stamp law.

**The 404 that preceded it was a deployment swap**, not a broken build: the audit read
`/w/today`'s HTML from one build and walked its chunk list after the alias had moved, and
chunk names are content-hashed. Confirmed by command — the named chunk was absent from a
fresh fetch — and the re-run reached 246/246.

## §4c · F-38.41 · FOUR DOORS OUT OF THE SHELL THAT NEITHER GATE COULD SEE

**The audit's one surviving FAIL was `/w/calendar → Ask Victor about this date →`, and it
led to something older and larger.**

### The byte

`components/vendor/CalendarDaySheet.tsx:436`, bare JSX text, dragged into the shell by
today's crossing. `Victor` is an internal SEAT name and R-37.70 admits no exception for it.
Cured to `Ask TDW about this date →` — the affordance keeps its verb, only the character
leaves.

**`b40` C32 WALKS THE SAME GRAPH AND PASSED, WHICH IS THE WRONG WAY ROUND.** Its
bare-JSX-text arm hardcoded `DreamAi` **inside the pattern**, so the persona test only ever
saw runs containing that one word. Fourth cut of that matcher; each previous one widened the
SHAPE for the byte in front of me and never the CLASS the cell claims. The five names have
one home now and both arms read it, so a sixth is one edit and cannot land in half the
matcher. **A source sweep that sees less than a fetch is a sweep whose whole warrant —
seeing behind conditions a fetch never triggers — is forfeit.**

### The line above it, which is the finding

```
router.push(`/vendor?aiPrimer=${…}`)
```

**`/vendor?<query>` is the OLD HUB ROOT with a query string and no path segment.** Both
`wl_audit` and `b40` C31 matched `\/vendor\/` — with the trailing slash — so every one of
these walked straight past. Derived by command, four live sites:

| site | reachable from |
|---|---|
| `CalendarDaySheet.tsx:431` — 「Ask … about this date」 | `/w/calendar`, since today |
| `WishboneSheet.tsx:70` — 「Send to Chat」 | **six crossed rooms, since §4-1** |
| `BinderCard.tsx:163` — 「Send to Chat」 | `/w/clients`, since §4-1 |
| `NotesBody.tsx:210` — 「Send to Chat」 | `/w/notes`, since §4-1 |

**A SHELL SURFACE THAT PUSHES `/vendor?draft=` UNMOUNTS THE SHELL** — second layout, second
Splash, second medallion, second session resolve. That is F-38.1 entire, still live, on
eight rooms, behind a control the founder uses. **Both gates have reported 「0 strays」 across
those rooms since §4-1.**

Second sighting of this family: the S2 bounce convicted a matcher that read double-quoted
attributes only. **Match what you mean** — now written in both files.

### Declared, not allowed — and NOT in the shrink-only set

`INTERIM_HUB_PRIMERS` in `lib/worklist/rooms.ts`, matched EXACTLY. The alternative was to
notice them, judge them legitimate and say nothing, leaving both instruments with an
exception they cannot see, which is the shape the S2 bounce convicted.

**They are deliberately NOT in `INTERIM_VENDOR_LINKS`.** That set is shrink-only under
R-38.11's amended standing, and adding four entries would widen a set the estate ruled may
only narrow. A separately-named exception with its own retirement keeps that guarantee
literally true.

**THE CURE IS NOT A RE-POINT AND IS NOT ATTEMPTED HERE.** These carry a PREFILL into a chat
surface; the shell's own `AskSheet` takes no draft parameter, and giving it one is a design
sitting. Priced. **Ratify-or-revert**, and the three false positives are named in the
registry so the next reader does not re-derive them: two are wire-contract types
(`tell_victor: { path: '/vendor' }`) and one is `RoomsGrid`'s interim predicate.

Non-vacuity, by mutating the registry: undeclaring `/vendor?draft=` reds C31 naming all
three of its sites and their rooms; restoring returns `FLOOR GREEN`.

## §4d · F-38.42 · TWO GREEN LINES THAT HAD STOPPED BEING TRUE

Both gates came back green at `7c66da2` — audit 26/0/2, arm 40/0, calendar crossed and
proven on glass in both modes. **Then two of the green lines turned out to be reporting a
world that ended a crossing ago.**

### `wl_audit`'s persona cell said 「five shell surfaces」 while walking thirteen

A PASS message with a hardcoded scope. It has been wrong since §4-1 and printed itself as
evidence on every run since. **Nobody re-reads a PASS** — that is the whole reason a stale
number survives inside one. Derived from `shellSurfaces.length` now.

### `b40` C5 was named for a rule the estate struck, and its reader was guesswork

The cell was called *DreamAi, never a seat-name, in chrome* — R-37.70's ORIGINAL shape,
which permitted the product name in prose. **R-38.17 retired that exemption**, and the cell
went on stating the struck rule in green output. Its body was narrower than its name too:
three names of five.

**AND THE READER WAS BROKEN IN A WAY ONLY A MUTATION COULD SHOW.** It extracted quoted
strings with a single-quote pair matcher and searched the join. `copy.ts` carries **151
apostrophes** after stripping — an odd count, because the vetoed bytes themselves use them
(「the vendor's own」, 「isn't reading」). One stray apostrophe offsets every pairing after it,
so real strings fall inside phantom ones and out of the set. **Planting `DreamAi` directly
in the register did not red this cell.** C32, reading the same file with a different reader,
caught it — so the fragile reader was the one standing closest to the register it guards.

**The pairing is abandoned, not repaired.** This file *is* the copy register: every string
in it is vendor-facing by construction and every comment is stripped before the read. The
honest question is not 「is this name inside a quoted literal」 but 「is this name in the
register at all」 — no pairing, nothing to offset, strictly stronger. Non-vacuity: `DreamAi`,
`Mira` and `Victor` each red C5 alone; the old body could see none of the first two.

**And the persona list had two homes** — C5's three names and C32's five. One now, read by
both, so a sixth name is one edit and cannot land in half the cells.

### The pattern, for whoever counts this arc's findings

**Every instrument defect this sitting was a cell agreeing with a description of itself.**
`PAGES` derived without `/w/rooms` because a count was checked and not a set. C32's JSX arm
covering one name of five. The vacuous PAGES guard. And now a stale PASS message and a cell
whose name, scope and reader had each drifted from its claim in a different direction.

**None was found by reading. All were found by running something** — a mutation, a diff, or
the founder's own gate. The one that matters most is C5: it was *green*, it was *named after
a rule*, and it could not have failed.

## §5 · FLOORS AT THE CUT (R-38.19)

**pwa, dirty tree: 23.** Set = the named base **22** plus `tdw_f0774_vacuity_probe`, which
reds on any dirty tree and greens on commit. `tdw37_leadgate_b_slot` stays green.
`tdw09_hotfix` returns to green after the re-point. Derived twice, before and after the
cure, and diffed by set.

`b40` **37/37**. `npx tsc --noEmit` **exit 0**. Audit at the deploy: 25 PASS \u00b7 1 FAIL \u00b7 2 INCONCLUSIVE before this cut \u2014 the FAIL is \u00a74c, cured here.

---

## §6 · WHAT THIS SEAT OWNS

- **Nothing here ran against a deploy.** The audit and the arm both need one; the
  served-bytes half of the crossing's both-ways is the founder's run.
- **The census clause was reported, not met.** `INTERIM_VENDOR_MOUNTS` does not shrink for
  calendar, and the reason is in §2. If the chair reads the clause as binding rather than
  descriptive, the cure is to move the fallback's Header out of `app/vendor/calendar/` — and
  there is nowhere honest for it to go.
- **`app/vendor/calendar/page.tsx` renders one nesting level differently** from before the
  split: the wrapper is `[slice]/page.tsx`'s, not the body's original. The body's own outer
  div is unchanged and sits inside it. Glass-checkable, not proven here.
- **`scripts/` was touched** (`tdw09_hotfix`), so per the charter the F-38.38 + F-19.18 cure
  was in scope this sitting. **It is NOT in this ZIP** — the re-point was four string changes
  and the signal-safe helper is a design that wants its own both-ways. Named, not smuggled.

## §7 · THE NEXT SITTING

**Storefront next**, then portfolio, couture, team, contracts, tds, collab. The shape is
proven and mechanical now:

1. split the body out of the route file if they share one; the `Header` import must not
   reach the body
2. `app/w/<room>/page.tsx` — `WorklistShell` + `RoomBody` + the body, header word from
   `copy.ts`
3. registry href → `/w/<room>`, id out of `INTERIM_VENDOR_ROOMS`
4. any `/vendor/<room>` literal in the graph → `roomHref('<room>')`
5. **run the floor and diff the SET** — expect a bench under `scripts/` to follow the body
6. both-ways: restore the literal, C31 must name it; revert the href, C24 must name it

Carried forward unchanged: `rooms.ts:1` still reads "THE SEVENTEEN ROOMS" against
`ROOM_COUNT_EXPECTED = 18` — corrected to **NINETEEN at the Khata edit**, one correction at
one site. Open: F-38.22, F-38.23, F-38.24, F-38.30 = F-19.14, F-38.31's Phase 4 half,
F-38.32, F-38.38 + F-19.18.

**Eight uncomments stay dated at their own sites** — five at Phase 4's first 200, three at
TDW_19 P0-B step 4. None depends on this document being read.
