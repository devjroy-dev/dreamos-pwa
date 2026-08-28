# M-FINISH · S2/5 · §4-4 BATCH ③ — COLLAB CROSSES, AND THE SHELL COMPLETES

**BASE (R-38.15): `a33d70d` = `origin/worklist`, re-derived at the moment of cutting.**
Sibling `dream-os` `8a73a66` = `origin/main`, clean, `node_modules` present in both.
**Railway/Vercel green: NOT CLAIMED** — nothing here ran against a deploy.

> **⚠ THIS DELIVERY WAS CUT TWICE. R-38.16 FIRED AND THE FIRST CUT WAS DESTROYED.**
> It was built and gated at `1838a1b`; P2-A then landed §3-1 (`a8def9c`) and §3-2
> (`a33d70d`) on this branch. **Every number below is re-derived at `a33d70d`, not
> re-quoted from the first cut** — the floor was re-run, the reader set re-derived, and
> two defects in this seat's own new bench were found by that re-derivation and cured
> (§6). A delivery measured at one tip and applied at another is F-38.34's disease, and
> the guard block exists to make that impossible rather than unlikely.

---

## §0 · ENVIRONMENT

```
bash tools/preflight.sh worklist
```

```
pwa worklist a33d70d · dream-os main 8a73a66 · both clean · node_modules present
```

**PREFLIGHT REFUSED FIRST, AND IT WAS RIGHT TO.** `node_modules` was ABSENT in both repos and
the refusal named the consequence exactly: *the pwa floor will read EIGHT TOO MANY REDs*.
Installed, re-run, and only then was a number written down.

**Floor at base: 22, byte-identical to the named base.** `b40` 39 cells GREEN. `tsc` exit 0.

**P2-A's landings, derived not assumed.** Nine files across two commits, **zero filename
collision** with this delivery's seventeen. Two of them are downstream of numbers this seat
publishes and were re-run rather than reasoned about:
- **`scripts/tdw19_p2a_profile_core.proof.mjs` joins the floor glob** and is **GREEN**
  (exit 0, run standalone at this tip). The base holds at 22 → 23; had it reddened, the
  labelled amendment in §7 would have been false.
- **`tools/bs_audit.mjs` moved** (27 → 31 cells) and is one of this bench's five declared
  exemptions. §2.1 re-run at this tip: it still strips elsewhere in the file, so the
  exemption still names a file that has made the distinction it is being excused for.

---

## §1 · CORRECTIONS FILED BEFORE BUILD (seven, all ruled at relay #1)

- **c-1** the ladder named `F-38.43–.60` in `dream-os/docs/FINDINGS_LOG.md`; at `8a73a66` that
  log carries **.43 through .47 and stops**. `.48–.60` live only in this repo's handovers.
- **c-2** the kickoff sited the bridge write at `setMode`. It is at **`writeMode`**; `setMode`
  is the caller. Built at the writer.
- **c-3** retiring the bridge REDs `modeBridge.proof.ts` on six cells, and its own note said
  *delete this proof with it*. **RETIRE-WITH-THE-READER ruled**; §4 below.
- **c-4** the new bench's subject is **strips at all before parsing**, not *uses the one home*
  — the latter is `tdw_f0774_stripper` §6.3's, inherited RED, named not adopted.
- **c-5** the coverage law derives over `/\.proof\.(mjs|js)$/`, so **`b40` — 39 cells, the
  estate's largest bench — is invisible to its own coverage cells** and carries the naive rule
  at line 10. Filed **F-38.p4**.
- **c-6** `rooms.ts:1` read "THE SEVENTEEN ROOMS" against `ROOM_COUNT_EXPECTED = 18` for two
  sittings. **Corrected to EIGHTEEN**, one site. Khata takes it to NINETEEN: two honest edits.
- **c-7** `COPY.collabTitle` did not exist and C25 requires it. Added, `teamTitle`'s precedent.

---

## §2 · THE CROSSING — ONE ROOM, TWO ROUTES, ONE CUT

| surface | body split | in-body chrome retired | census | outbound |
|---|---|---|---|---|
| collab | `collab/screen.tsx` | eyebrow + display title, **in shell only** | 1 → 1 | one declared base |
| collab responses | `…/responses/screen.tsx` | **the masthead, and nothing else** | 1 → 1 | none |

`INTERIM_VENDOR_ROOMS` **1 → 0. THE LIST IS EMPTY.** The arc ran 14 → 8 → 7 → 4 → 1 → 0, and
every step was the SAME EDIT that changed an href. The number was never carried in a handover
sentence, which is the only reason it is trustworthy now.

**The split moved bytes and did not rewrite them, proven rather than asserted:** `diff` of the
original's head and tail against the extracted `screen.tsx` shows **only the ruled edits** —
the import swap, the export, the `inShell` read, the two chrome arms, the hoisted handler.
Nothing else moved in 917 lines.

### The interior crossed with its room, which is the batch's whole shape

The responses thread is not a second room, it is **collab's interior**. A crossed room holding
an uncrossed interior is F-38.1 *inside one room's walls* — the vendor taps 「View responses」
on a shell surface and gets a second layout, a second Splash and a second session resolve, one
tap in.

**The census states BOTH movements**, at the set's own site. Body and route were one file in
each case, so each mount moved WITHIN its crossing — calendar's §4-2 precedent, taken twice in
one cut. Estate total holds at 25 across 22 files.

### Two chrome decisions, and the difference between them is the point

**Collab keeps its header ROW and loses its LABEL STACK, in the shell only.** TDS's precedent
exactly: an action rides on the row (「+ Post」), so the row survives in both trees and a spacer
takes the label's `flex: 1` so the control does not move under the thumb. The eyebrow and
display title are a **second name for the room** with the shell's masthead printing 「Collab」
directly above — Team's `SectionLabel` finding, one room over. They stay on the fallback,
where nothing else names the surface.

**The responses interior retires NOTHING but its masthead, and that is derived rather than
convenient.** The `←` is a CONTROL, not chrome, and `WorklistShell` takes `{ title, children }`
with no back affordance — retiring it strands a vendor inside the shell. 「Interested vendors」
names the THREAD, not the room. **Team's finding was two names for one thing; this is a title
and its subject.** A batch that retired it would have applied a precedent by its shape instead
of its reason.

---

## §3 · THREE FINDINGS THE CROSSING SURFACED, ALL CURED AT SOURCE

### F-38.p1 · the calendar crew sheet pushed a literal, and it was correct until today

`components/vendor/CalendarCrewSheet.tsx:135` pushed `/vendor/collab?…`, written before the
shell existed. **It agreed with the registry by coincidence, not by construction** — collab's
href WAS that address — and collab crossing made them disagree. The sheet is reachable from
`/w/calendar`, so a vendor prefilling a collab post from her calendar would have been thrown
out of the shell. Cured to `roomHref('collab')`.

**C31 caught it in the same edit that broke it** — the address book paying out as built.

### F-38.p2 · `FALLBACK_SLICE_BASE` was a scalar and the class had a second member

Collab's `openResponses` is the second tree-aware fallback base in the estate. **Minting a
second scalar with a second name is how a class walks away from its cure**, and this arc has
filed that shape twice in three sittings. The scalar became **`FALLBACK_TREE_BASES`**, a
declared set with site and reason at each member.

`b40` C31 **amended by label, not loosened**: it reads the SET and still matches EXACTLY. A
base passes; a whole carried href does not. The arity changed, the strictness did not.

### F-38.p3 · the responses screen painted a page ground, the only one in the estate

`bg: '#0E0D0B'` on the screen's root. Derived by command: **that literal has exactly ONE site
in the tree**, and **no other crossed body carries a root background at all** — tds, contracts,
couture, team-hub, storefront and portfolio inherit their tree's ground, and both trees paint
one.

**A text-colour literal is F-38.22, priced and carried. A page ground is not the same fact:**
inside the shell in Chalk this paints a near-black page under a cream masthead and a cream nav
— not a wrong shade, an inverted room. Root paint removed: a MOVE to the family's behaviour,
not a fork.

**The VALUE stays, because it has two live readers and they are not grounds** — it is also the
ink on the metal button. The key is **renamed `bg` → `onMetal`**, this file's own F-09.34
precedent, where a rename was the guard so an unmigrated reader becomes a tsc error rather than
a silent wrong colour. **Not tokenised to `INK_DEEP`** (`theme.ts:129`, 「the ink that sits on
brass」, the same job at a different value): that moves a vendor-facing byte on the fallback,
which is the founder's veto and not a crossing's business. **Filed, not fixed.**

---

## §4 · THE BRIDGE RETIRED, AND ITS BENCH INVERTED RATHER THAN DIED

`INTERIM_VENDOR_ROOMS` emptied, so F-38.52's own stated condition fired — **derivable from the
registry by command, which is why nothing had to remember it.** The write is gone from
`writeMode`, labelled at site.

**THE CAVEAT, AT THE KEY'S DECLARATION WHERE IT BELONGS:** the `/vendor` fallback routes stay
on disk until Phase 7. A vendor reaching one by raw URL, stale bookmark or service-worker cache
renders under the old lane, which reads `dreamai_theme` — now frozen at whatever it held at her
last flip. **Nothing in the shell links there**: eighteen tiles, every cross-room leg and both
fallback bases were derived at this cut. The divergence is reachable only by leaving the
product the way it is built, and it dies with the routes.

### Eleven cells before, eleven after, six inverted at their own sites

The bench's own note read *「F-38.52 RETIRES NOW: delete the bridge write and this proof with
it」*. **STRUCK at the amendment's label**, with the reasoning: the SUBJECT retired, the
PROPERTY did not. The property was 「one tap reaches both lanes」; it is now 「the cookie is the
sole authority and NOTHING writes the vendor-lane key from a vendor's choice」 — real,
breakable, on a key three live readers still read. **Deleting a bench because its subject died
drops the only guard on the successor property, on the day that property became the one that
matters.**

### It reads STRIPPED source now, and the strip is load-bearing — proven by mutation

`lib/worklist/mode.ts` carries the text `localStorage.setItem(VENDOR_LANE_KEY, mode)` **inside
the comment recording its retirement**, because F-06.85 asks a cure to name what it retired. A
raw read convicts the documentation of the cure. **Swapping §2.2's `codeOf` for a raw read REDs
the cell** — F-07.89's specimen, caught in this seat's own tree by the very class §6 guards.

**The stripper is reached OUT OF PROCESS, not by `require`.** CJS-requiring an ESM module is
unflagged only from Node 22.12; a bench that throws on the founder's node instead of the
container's reports the runtime rather than the tree. One home, genuinely invoked, no version
bet.

**Both-ways, run at this tip:**
- Re-add the bridge write → **RED on exactly §1.2, §1.5, §1.6, §2.1b, §2.2** (6/11). Restore → **GREEN 11/11**.
- Revert collab's href → **§3.1 RED** *(rooms still on the /vendor lane: 1)* and `b40` **C24 RED** *(the registry carries 1 /vendor hrefs but declares 0 interim rooms)*. Restore → both green.
- Swap `codeOf` for a raw read → **§2.2 RED** (10/11). Restore → GREEN.

---

## §5 · THE SEAM FRAME, TRUE-TENSE

`['room-collab', '/vendor/collab']` → `['fallback-collab', '/vendor/collab']`. `/w/collab`
joined the DERIVED `shellFrames` with no edit here, which is what deriving that set bought.

**SCOPE DECLARED, RATIFIED AT RELAY #2.** The kickoff said *nothing else in that file moves*.
Two more sentences moved: the block's own preamble read 「carried rooms that have not crossed」
and 「the remaining /vendor frame is a room that has NOT crossed」, both false as of this cut,
three lines above the frame being corrected. **Comments only, no code.** Curing the frame and
leaving its preamble false would have been the class-walks-away shape at three lines' distance.

---

## §6 · THE UN-STRIPPED-READER GUARD — RED AT BIRTH, BY RULING

`scripts/tdw_f0774_readers.proof.mjs`. **A reader whose subject is CODE strips before it
parses; a reader whose subject is PROSE is declared.**

Derived over `scripts/` + `tools/` at `a33d70d`: **100 files, 89 readers, EIGHTEEN
offenders.** Every one reads `.ts`/`.tsx` production source and matches tokens in it. Four are
dark at base; **fourteen are live, and one is `tools/wl_render.cjs` — a gate instrument.**

### ⚠ THE COUNT HELD AT EIGHTEEN, AND THAT IS THE LEAST INTERESTING FACT ABOUT IT

The re-derivation at `a33d70d` did not confirm the first cut's number; it **rebuilt it after
finding two defects in this bench**, and the eighteen it now names are the same eighteen for
better reasons. The corpus grew 96 → 100 files and the reader set 88 → 89. Both defects were
found by PROBING the instrument, not by reading it — D-38.1's corollary, in this seat's own
work, on the sitting that filed it.

**F-38.p5 · THE CORPUS WAS FLAT AND `scripts/lib/` WAS INVISIBLE TO IT.** The first cut read
each directory non-recursively, so the directory holding the estate's ONE STRIPPER was outside
the corpus entirely. **The bench that exists to find blind readers had a blind spot of its
own**, and it surfaced only because P2-A landed `scripts/lib/aliasHook.cjs` and this
instrument could not see the file arrive. Cured by DERIVATION rather than by adding
`scripts/lib` to a list — the walk is recursive, so a directory a seat creates tomorrow joins
by existing. Fourth firing of the hand-written-enumeration shape that `run-floor.sh`'s own
header names three times.

**F-38.p6 · THE BENCH CLASSIFIED READERS FROM RAW SOURCE, AND ITS OWN LAW CONVICTED IT.** A
forged offender planted in `scripts/lib/mutateCopy.mjs` was NOT caught. The reason:
that file mentions `stripComments` in a COMMENT — 「the way `stripComments` already is」 —
which satisfied the one-home strip shape. **The bench written to catch readers fooled by
comments was being fooled by a comment.** It would have shipped green on that file forever,
and on any future reader that documented the stripper without calling it. Cured: all four
tables now classify `code(rel)`, not `raw(rel)`. §1.2 asserts this file is in its own reader
SET; this is the line that makes the set's verdicts honest.

**AND THE CURE MOVED THE COUNT TO TWENTY BEFORE IT MOVED IT BACK.** Stripped classification
named `tdw09_frost_parity` and `tdw15_p2_envelopes` as offenders. Derived at their sites:
**both strip, by a LINE-FILTER form the shape table could not see** — split on newlines, drop
lines whose trimmed head is `//`, `*` or `/*`. **That was the table being wrong, not the
tree**, and it is F-38.60's own lesson pointed at this bench. The table is **widened with the
reason at the site, never loosened to make a number fall**.

`tdw15_p2_envelopes` carries the strongest form of the case in its own header: it uses that
form DELIBERATELY rather than the one home, because the shared stripper leaks on
`expenses.tsx:240` and reads 25 controls where the sealed instrument reads 24. **Convicting it
would have been this bench punishing a seat for being more careful than the estate's
default** — and it is the sharpest argument yet that c-4's ruling was right to separate 「does
it strip」 from 「does it use the one home」.

**The chair refused the two green arms** on this seat's own grounds: a declared-subset green is
a bench made to pass wearing a charter as a fig leaf, and deferral leaves the class unguarded
for however many sittings the design charter waits.

**⚠ THE FLOOR GAINS EXACTLY ONE LINE, NOT EIGHTEEN.** The eighteen are the bench's FINDINGS
and are printed by it; the floor's unit is the bench. A reader expecting eighteen base entries
has mistaken a report for a set. **Correction to relay #2's framing, filed.**

- **Shape tables declared, never inline** (F-38.45): read, parse, strip and code-subject each
  sit in a named table with its reasoning.
- **Refuses by name on an empty derivation** — F-38.57's catastrophe shape. Zero readers would
  make every cell vacuously green, so zero exits 1 with a sentence, never a pass.
- **Self-inclusion**: §1.2 asserts this bench is in its own reader set.
- **Exemption unit is the READ SITE** (c-38.35). The kickoff's file-level seed roster is
  struck; its five files re-enter as specific raw-read sites, each with
  `file · site · why the prose is the subject`. **Every exemption names a file that strips
  ELSEWHERE** (§2.1), so an exemption cannot launder a file that never strips at all.

**Both-ways, re-run at `a33d70d` by mutating production instrument source:**
- Give `wl_render.cjs` a blanker → **17**, its name gone. Restore → 18.
- Forge a reader inside `scripts/lib/aliasHook.cjs` → **19**, naming it — **which is the cell
  proving F-38.p5's cure actually reaches the new directory rather than merely claiming to.**
  Restore → 18.
- Point an exemption at a non-stripping file → **§2.1 RED**, *「exemptions that would launder an
  offender」*. Restore → GREEN.

---

## §7 · FLOORS AT THE CUT (R-38.19)

**Floor by SET: base 22 → cut 23.** One added, zero removed, none vanished:
`tdw_f0774_readers`, arriving RED by ruling with its label in `run-floor.sh`.

**The 22 at base is itself re-derived at `a33d70d`**, not carried from the first cut:
`tdw19_p2a_profile_core` joined the glob with P2-A's push and runs GREEN, so it adds no line.
**The reader count in the label is EIGHTEEN, matching what the bench prints at this tip.** Had
it moved, the label would have moved with it — that was the standing instruction and it did
not need to fire.

Measured on the DELIVERY TREE in `--delivery` mode against
`scripts/floor-manifest-ce38-s25-batch3.txt`, with `[F-19.16] declared files unmoved — set and
contents both verified`. **`FLOOR = NAMED BASE, no delta.`**

`npx tsc --noEmit` **exit 0** · `b40` **FLOOR GREEN, 39 cells** · `modeBridge` **GREEN 11/11** ·
`node --check tools/wl_render.cjs` clean.

---

## §8 · WHAT THIS SEAT OWNS

- **Nothing here ran against a deploy.** `wl_audit` and `wl_render` both need one; the
  served-bytes half and every capture is the founder's run. §5's capture set — collab at rest
  and pressed, a responses thread, and the mode-flip walk (Rooms → collab → Rooms) proving the
  cookie alone carries it — is his.
- **W-1 IS ALREADY IN THE TREE; W-2 CANNOT BE FOLDED.** No walk relay reached this seat.
  Derived: the FAB gap is measured at 16 and lives as `bottom: calc(136px + env(…))` at
  `AddFab.tsx:151`, with C-R18 measuring the painted gap every run — **W-1 landed before this
  sitting**. For **W-2 there are no bytes in front of me**: the add-sheet glyphs are seven
  geometric characters with seven words beside them in the register, but which words the
  founder proposed is not derivable, and **inventing vendor-facing copy is precisely what his
  veto exists to prevent.** Reported, not guessed. Relay the bytes and it is a one-file edit.
- **F-38.p3 is cured as a NAME, not as a colour.** The `INK_DEEP` duplication is filed.
- **F-38.p5 and F-38.p6 are this seat's own bench convicting itself**, found by probe on the
  re-derivation and cured in the same cut. Neither was found by reading the file. A bench that
  had shipped at the first cut would have carried both.
- **A LATER MOVED TIP REMAINS POSSIBLE.** The founder is walking `/v/` and any findings go to
  P2-A as cures on top. R-38.16 governs: if the guard block reports a tip other than
  `a33d70d`, this delivery is re-derived again rather than applied.
- **The eighteen are debt with a name and an exit condition.** `wl_render.cjs` first.
- **F-38.p4** (`b40` invisible to the coverage law) is filed, not cured: same class this
  batch's bench guards, and curing the largest bench in the estate is not a crossing's work.

## §9 · THE NEXT SITTING

**`INTERIM_VENDOR_ROOMS` IS EMPTY. Every vendor surface in the registry renders inside the
shell.** What remains of the arc is not crossings:

- **The un-stripped-reader cure sitting**, `wl_render.cjs` first.
- **F-38.47's design sitting** — the four hub primers, untouched here as standing.
- **Phase 4** (tile badges), the basic-tier card 2 variant, F-38.22's colour literals, the
  older type register in the crossed bodies.
- **Phase 7 cutover**, retiring `app/vendor/layout.tsx`, both fallback bases,
  `INTERIM_VENDOR_LINKS`, `INTERIM_BOTTOMNAV_MOUNTS` and the `dreamai_theme` divergence at
  once — including the demo studio rendering in the Graphite shell per the founder's
  2026-08-28 ruling.
- `rooms.ts:1` goes to NINETEEN at the Khata edit.

Open and unchanged: F-38.22 · F-38.23 · F-38.24 · F-38.30 = F-19.14 · F-38.31's Phase 4 half ·
F-38.32 · F-38.38 + F-19.18 · F-38.47 · the two dirt-enumeration homes · **F-38.p1–.p6** for
the chair's final ids.

**c-38.36, and the sharper half of it.** The first cut's guard block opened with a `cd` into
the repo from its parent; the founder's shell was already at the root, so the block did not
run — and the tip had moved anyway. **The evidence that stopped a stale-base apply was a push
line he happened to scroll past, not the guard.** The chain's first block must be runnable
from the repo root as written, and a path assumption in it is a defect in the delivery. The
block in this cut is one command and assumes nothing. **A guard that cannot execute is not a
guard**, and the shape worth taking further — a guard that fails LOUDLY when it cannot run,
rather than silently into a shell prompt — is a protocol proposal, not this seat's to assert.

**Eight uncomments stay dated at their own sites. None depends on this document being read.**
