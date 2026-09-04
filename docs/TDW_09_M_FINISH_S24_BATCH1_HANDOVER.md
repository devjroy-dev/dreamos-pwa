# M-FINISH · SITTING 2, SESSION 4 — §4-3 BATCH ①: THE VISUAL FAMILY CROSSES

**BASE (R-38.15): `a22e391` = `origin/worklist`, re-derived at the moment of cutting.**
Sibling `dream-os` `70869f0` = `origin/main`, clean, `node_modules` present in both.
**Railway/Vercel green: NOT CLAIMED** — nothing here ran against a deploy.

**Packet:** `d15e6bc1413ffd1281febf429262a24875888047553cfb1af7ea5acfced770ab`, founder-supplied
under the kickoff. Recorded, not re-derived — the charter text is the relay's.

---

## §0 · ENVIRONMENT — A COMMAND, NOT A SENTENCE

```
bash tools/preflight.sh worklist
```

```
pwa worklist a22e391 · dream-os main 70869f0 · both clean · node_modules present
```

R-38.20b. The word "present" is banned for a tip; the tip is printed. The first preflight
run reported `node_modules ABSENT` in BOTH repos and refused — `npm ci` in each, re-run,
clear. The refusal is the tool working: eight benches would have read as RED for a missing
`tsc` and the number would have gone in this document.

**The kickoff expected pwa ≥ `b841ab3`.** The tip was `a22e391`, one commit ahead — S3's
H-1(a). Ancestry derived by `git merge-base --is-ancestor`, not assumed from the message.
A report, not a STOP, exactly as §0 anticipated.

---

## §1 · WHAT THIS SITTING REACHED

Batch ① of the seven: **storefront · portfolio · couture**, the visual family, one cut.
`INTERIM_VENDOR_ROOMS` **7 → 4**. Items ②③④ of the charter (khata, settings on the rungs,
F-38.3's cure) untouched; batch ② opens on the next tree by the chair's word at the seam.

**Banked here rather than stacking batch ② on an uncut tree** — the founder's chain already
holds S3's push, and apply-order debt compounds.

---

## §2 · THE CROSSING — THREE ROOMS, SIX STEPS, ONE CUT

| room | body split | `<Header/>` | in-body chrome retired | census |
|---|---|---|---|---|
| storefront | `screen.tsx`, new | route only | `SectionLabel "Storefront"` | 1 → 1, moved within |
| portfolio | `screen.tsx`, new | route only | chevron + `PORTFOLIO` word | 1 → 1, moved within |
| couture | `screen.tsx`, new | route only | chevron + `COUTURE` word | **2 → 1** |

**COUTURE IS THE ONE LINE THAT SHRINKS, AND THE REASON IS STRUCTURAL.** It carried two
`<Header/>` mounts in two RETURN ARMS of one component — the `couture_eligible === false`
gate and the main screen. A mount at the fallback ROUTE sits above both arms, so two became
one. Storefront's and Portfolio's bodies and routes were each ONE FILE, so their mount moved
*within* the crossing rather than out of it — calendar's §4-2 precedent — and their lines
hold at 1 with the movement stated. **Census 26 → 25 across 22 files.** R-38.11 as amended,
satisfied by a number that fell where it fell and a number that was made to say why it did
not.

### The address book paid out twice, and once it was a literal

`storefront/screen.tsx` spelled `/vendor/portfolio` as a hardcoded string, written long
before the shell. It asks `roomHref('portfolio')` now — and Portfolio crossing in the SAME
cut moved that row without it being reasoned about a second time.

**IT ANSWERS THE SAME WAY IN BOTH TREES AND THAT IS RULED.** A vendor on the /vendor
fallback who taps Portfolio lands in the shell. `roomHref` is deliberately not tree-aware
(CE-38 relay): a cross-link to a DIFFERENT room is a departure whichever tree it starts in.
`SliceDoor`'s tree-awareness is the asymmetric case — lateral movement inside ONE family —
and Storefront → Portfolio is not that.

### The masthead rows survive because their right halves are actions

Portfolio's row is `‹` + `PORTFOLIO` + `+ Upload`; couture's is `‹` + `COUTURE` + `+ Slot`.
The chevron and the word are the old layout's chrome and retire in the shell — WorklistShell
prints the room's word and the two nav seats are the way back, so a second title and a
second way out are the two-mastheads defect one level down. **The rows themselves stay in
both trees**, because Upload is portfolio's one filled gold and its only way to add a photo.
Retiring a row to retire a word would have taken the action with it; a spacer takes over the
label's `flex: 1` so neither action moves under the thumb.

### The gutters

Each room hand-set its own horizontal inset — 24px in storefront, 22px in portfolio and
couture, 16px on portfolio's photo grid. Inside the shell that lands at 16 + the literal,
which is the founder's original misalignment grievance reproduced by the motion meant to end
it. Every one became `var(--slice-inset, <its own literal>)`, so `RoomBody` zeroes them in
the shell and the /vendor tree — which declares the variable nowhere — renders byte
identically. **A MOVE, NOT A FORK:** one branch declares a value, the other keeps the value
it always had, neither has a second copy of the number.

---

## §3 · `useInShell` MOVED, AND THE MOVE WAS NOT IN THE PLAN

It was defined inside `components/vendor/slices/SliceShell.tsx` at §4-1, because the list
family was then its only caller. All three of these rooms need it and **none is in that
family.**

**IMPORTING IT FROM THERE WOULD HAVE BEEN S2's DEFECT WITH THE NAMES CHANGED.** A named
import reaches `SliceShell`, `SliceDoor` and `DetailSheet` behind it; whether the bundler
then drops them is a question about the bundler, not a guarantee this estate holds — and S2
paid once for assuming a bundle looks like its source.

**AND IT DOES NOT GO IN `lib/worklist/`, WHICH IS THE OBVIOUS WRONG ANSWER.** That directory
is branch-side and `SliceShell` still calls this; a main-side component reading a branch-side
module is the direction D-2 forbids, and it is the same reason `copy.ts` was not made the one
home for the six door labels at §4-1. `hooks/vendor/useInShell.ts` is main-side, so both
trees may read it and neither inverts. **No re-export left behind** — a second name for one
thing is the disease one directory over.

`usePathname` left `SliceShell.tsx` with it. Derived, not assumed: zero call sites remained.

---

## §4 · F-38.43's SECOND FIRING — THE GREP PREDICTED, THE FLOOR MADE IT FACT

Eight benches read the three bodies by path; three were already RED at base, so **five green
benches stood in the way and I knew their names before cutting.** The floor at the cut still
found them, and that is the entry:

```
base 22  →  cut 28.  ADDED: tdw07_p4a_ig · tdw07_p4b_probe · tdw07_p4b_slice1
                            tdw09_hotfix · tdw09_p2b · tdw_f0774_vacuity_probe
```

**THE COUNT WOULD HAVE LOOKED SURVIVABLE.** 28 against a base of 23 is not obviously
different from 28 against 22. The SET named the benches. Second firing of R-38.19 as
designed, and the sentence worth keeping is that **reading told me which benches to worry
about; only running told me they had actually gone red.**

Cured by following the subject — a declared constant **at each reading section** rather than
one at the top, because those sections read the same file for different claims and a shared
constant invites a third reader to assume they check the same thing.

### F-38.44's second specimen, and it was not a path rename

`tdw07_p4a_ig` anchored its `JSX` slice on `indexOf('export default function
PortfolioPage')`. That component is the fallback route now. **The miss did not announce
itself:** `indexOf` returned -1, `.slice(-1)` returned the file's last character, the IG
block came back empty, and §1.5/§1.6 reported **`-1 vs -1`** — a FAIL about the TREE for a
fault in the READER, on a tree where both bytes sit exactly where the ruling wants them.

Cured to F-38.44's own shape: the anchor is a named constant and its absence **exits 3
naming itself** before any cell can be scoped to a corpus that was never found. Non-vacuity
by mutating the anchor back — exits 3 with the message; restored, 69/69 green.

---

## §5 · THE DELIVERY-MODE FLOOR REFUSED A CORRECT DELIVERY, IN TWO PLACES

`--delivery` came back **`STOP — dirt OUTSIDE the declared manifest`**, naming
`app/w/couture/`, `app/w/portfolio/`, `app/w/storefront/` — three directories containing
nothing but declared files.

Bare `git status --porcelain` **COLLAPSES an untracked directory** to one trailing-slash
entry. A manifest is a FILE table by its own header — that is the whole reason using it costs
nothing, since the delivery's handover carries the list anyway — so the two could never
match. **F-38.44's shape a third time: a comparison made against a corpus that was not what
it claimed.**

Cured on the READER side with `-uall`, deliberately. The alternative was to teach every
future manifest to declare directory forms beside file forms — a second spelling of one fact
in every delivery from now on, and the first seat to forget it gets this same refusal.
`-uall` cannot loosen the check: it only ever expands a directory into the files it holds, so
a path outside the manifest stays outside — **and an UNDECLARED file inside a declared
directory, which the collapsed form hid, is now caught.**

### ⚠ AND THE ENTRY IS NOT THE FLAG. THE ENUMERATION HAS TWO HOMES.

F-19.16's own header promises *ONE MANIFEST HOME, ONE ENV NAME, one bench that reads it* —
and the manifest does have one home. **The dirt enumeration does not:**
`scripts/run-floor.sh` and `scripts/tdw_f0774_vacuity_probe.mjs`, in two languages, each with
its own `git status --porcelain` and its own parse of the three-character prefix. They agreed
for as long as nobody handed them a case they read differently, and an untracked DIRECTORY
was that case.

**Cured identically in both, which is a cure applied twice rather than a duplication
removed.** Unifying them means a shared helper across bash and node; priced, not attempted
inside a crossing. Filed for the chair.

---

## §6 · F-38.52 — THE SHEETS, DERIVED

Every sheet in the three rooms is **full-cover**, and storefront has no fixed elements at
all:

| sheet | scrim | panel |
|---|---|---|
| portfolio · IG picker | `fixed; inset:0; z-60` | flex child of the scrim |
| portfolio · photo detail | `fixed; inset:0; z-40` | `fixed; bottom:0; z-50` |
| couture · add slot | `fixed; inset:0; z-40` | `fixed; bottom:0; z-50` |

The shell's chrome ceiling is **21** (the header with the coin open). `.wl-nav` and
`.wl-dock` are `flex-shrink:0` in normal flow with no z-index, and **no ancestor sets
`transform`, `filter` or `contain`**, so fixed resolves against the viewport and every scrim
paints above all of it. Identical to the three calendar sheets already walked. Every scrim
carries its own dismiss handler, so the covered nav sits behind a **live** catcher, not a
dead one. **No partial-coverage case exists; the batch does not STOP.**

**FOR THE FOUNDER'S WALK, ONE LINE, AND HIS ANSWER RULES THE SHEET STANDARD ESTATE-WIDE:**
*the sheets cover the dock and the nav completely; tapping there closes the sheet. Should a
sheet clear the shell chrome instead?*

---

## §7 · F-38.53 — THE FINDING I ALMOST FILED, AND THE LAW IT BOUGHT

Chasing the scrim colours I grepped `lib/worklist/theme.ts` for `--atelier-overlay` and got
**zero** — which reads as *the shell scope does not define it, so the sheets fall through to
`:root` and paint the old theme inside Chalk.* That is F-38.3's Toast finding exactly and I
was one edit from writing it down.

**It is false.** `theme.ts` stores keys **without** their prefix (`'overlay'`) and
`prefixFor()` builds the name at emit time. `GRAPHITE` and `CHALK` are both
`Record<TokenKey, string>` and `tsc` passes, so **every token is present in both maps by
type** — a stronger proof than any grep could be. The scrims paint the shell's own values in
both modes.

**The estate's own banked law, biting the seat that had just quoted it:** *a census keyed on
a symbol counts homonyms and misses renames — key it on the import, or on a header that names
sites.* I keyed on a literal string against a file that constructs its names. A census keyed
on a literal string against a constructing file counts nothing and reads as absence.

---

## §8 · FLOORS AT THE CUT (R-38.19)

**`FLOOR = NAMED BASE (22), zero delta**, measured on the DELIVERY TREE in `--delivery` mode
against `scripts/floor-manifest-ce38-s24-batch1.txt`, with
`[F-19.16] declared files unmoved — set and contents both verified`. Not predicted from a
clean tree and quoted forward: measured on the tree in the ZIP.

`b40` **FLOOR GREEN**. `npx tsc --noEmit` **exit 0**. 22 declared paths, 22 dirty paths.

**Both-ways, by running it at this tip:**
- Restore `/vendor/portfolio` in `storefront/screen.tsx` → `C31` REDs naming
  `screen.tsx:116` reachable from `/w/storefront`. Restore the cure → GREEN.
- Revert only the three registry hrefs → `C24` REDs: *the registry carries 7 /vendor hrefs
  but declares 4 interim rooms.* The set assertion catches a room sliding back out.

---

## §9 · WHAT THIS SEAT OWNS

- **Nothing here ran against a deploy.** `wl_audit` and `wl_render` both need one; the
  served-bytes half of every crossing's both-ways is the founder's run, and so are the
  captures at rest and pressed.
- **The three fallback routes render one nesting level differently** from before their
  splits: the wrapper is the shared fallback shape, not each body's original. Each body's
  own outer div is unchanged and sits inside it. Glass-checkable, not proven here.
- **The two enumeration homes are cured, not unified** (§5). Named, not smuggled.
- **`INTERIM_VENDOR_LINKS` grew by one** (`/vendor/discover`) under C-2's ruling, with the
  reasoning at the set's site and every entry now naming its source line. A vendor who taps
  Storefront's Discover row LEAVES THE SHELL — a real seam, declared rather than hidden.
- **The three bodies did not cross typographically** (R-38.12): the rooms' older type
  register and F-38.22's colour literals. Excluded from the render arm's tuple cell by
  construction — `SCALE_SURFACES` is a four-name inclusion list of the shell-native rooms,
  so no edit to `wl_render.cjs` was needed and none was made.

## §10 · THE NEXT SITTING

**Batch ② — team · contracts · tds**, then ③ collab alone. The shape is proven three more
times now and the six steps stand unchanged.

**⚠ CARRIED FOR BATCH ③, PRE-GRANTED BY THE CHAIR AT THE SEAM:** `tools/wl_render.cjs`
hardcodes `['room-collab', '/vendor/collab']` as its seam frame, commented *a room that has
NOT crossed*. Collab crossing makes that comment false — F-38.29's exact shape. One byte,
pre-granted; **derive S3's shape of that file first if they have edited it meanwhile.**

The capture set and `RULED` both DERIVE from `rooms.ts`, so these three joined the frames in
the edit that changed their hrefs, with nothing to remember.

Carried forward unchanged: `rooms.ts:1` still reads "THE SEVENTEEN ROOMS" against
`ROOM_COUNT_EXPECTED = 18` — corrected to **NINETEEN at the Khata edit**, one correction at
one site.

Open: F-38.22 · F-38.23 · F-38.24 · F-38.30 = F-19.14 · F-38.31's Phase 4 half · F-38.32 ·
F-38.38 + F-19.18 · F-38.47 (its design sitting) · F-38.52 (the founder's walk) · the two
enumeration homes (§5).

**Eight uncomments stay dated at their own sites.** None depends on this document being read.
