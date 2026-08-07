# TDW_09 · PACKAGE 4 · ZIP-2 SEAT — ZIP 1 (M1a + M1b + M2)

**Repo:** `dreamos-pwa` · **Cut at:** `e4d07f5` · **Chair:** twenty-fifth · **Ruling:** bride relay #9
**Findings cured:** F-09.145 · F-09.147 · F-09.148 (+ C-1, C-2)
**Gates:** `tsc 0` · `tdw09_p4_bar 58/58` · `tdw09_p4_zip2 57/57` · floor byte-stable

---

## 1 · WHAT SHIPPED, AND WHY EACH BYTE IS THERE

### F-09.145 — the bar stood on every fixed shell's bottom 62px

**Two patients, one class.** The founder's screenshot witnessed **sanctuary** — the deck's
vendor panel rendering `Enquire` whole with the Lock Date / Circle row sliced off beneath
the bar. **CanvasShell** is the same disease **derived, never witnessed**: it is
`position:fixed` too, and every one of its eight consumers sits under a door route. Both
are cured; the handover says which is which because a derived cure that is reported as a
witnessed one is how a fix gets believed without evidence.

**The mechanism, corrected from the charter.** The kickoff's cure sketch asked for the
bar's height to be exported and read from one home. That work was already shipped —
`BRIDE_BAR_HEIGHT:72` exported, `layout.tsx:98` consuming it. The disease was elsewhere:
that consumer is an **in-flow spacer**, and every bride shell beneath it is
`position:fixed` and therefore **out of flow**. The reservation was a no-op and always had
been. A fixed shell has to claim the clearance on itself.

**The cure, in three landings and one new constant:**

| where | byte |
|---|---|
| `components/frost/BrideBar.tsx` | mints `BRIDE_BAR_CLEARANCE` — `calc(${BRIDE_BAR_HEIGHT}px + env(safe-area-inset-bottom, 0px))`, derived from the height, one home |
| `app/(frost)/layout.tsx` | the spacer reads the clearance; kept and its no-op status disclosed in-comment |
| `components/frost/CanvasShell.tsx` | `paddingBottom: BRIDE_BAR_CLEARANCE` on the fixed root |
| `sanctuary/page.tsx` root | `paddingBottom: BRIDE_BAR_CLEARANCE` — clearance #1 |
| `sanctuary/page.tsx` room container | `inset:0` → `top/left/right:0, bottom: BRIDE_BAR_CLEARANCE` — clearance #2 |

**Two clearances, not one, and clearance #2 is not redundant.** An absolutely-positioned
child resolves its offsets against its containing block's **padding box**, so the room
container's `bottom:0` meant *the viewport floor* no matter what padding the shell carried.
The bloom — and therefore the deck, and therefore the panel row the founder watched get
sliced — had to be told the floor separately.

**Padding, not a shorter box, and that is a deliberate deviation from the ruling's word
"inset".** `BrideBar` is a **glass** band (`glassBandBg` + `backdropFilter`). Had the shells
stopped at the bar's top edge, the blur would sample the document *behind the app* instead
of this surface, and the band would go pale on Wine Night. The painted box stays
full-bleed; only the content box steps back. Disclosed rather than done quietly — the chair
may strike it for the literal form, and the pale band comes back with it.

**D-3 ratified into the bench.** A `position:fixed` element opens a stacking context, so the
bloom's `zIndex:100` is scoped inside sanctuary and never competes with the layout's
siblings; `BrideBar`'s `zIndex:60` lives in the root context and paints over the whole room.
`§3` resolves this and asserts the corollary that matters: **raising the room's z is not a
cure, clearance is.**

### F-09.147 — the write-only deep link

`?room=` was written by the bar, read by the effect, and never taken back. Close the room
and the URL still claimed it, the bar still lit DISCOVER, and a refresh re-opened a room
she had closed.

`clearRoomParam` uses **`replaceState`, not push and not `router.replace`** — the room is
not a history stop (that is the trap's entire architecture), so it must leave no step
behind. `window.history.state` is carried through **unchanged** so the trap's sentinel
marker survives the rewrite. Other query the lane carries (`ref`, `utm`) is preserved.

### C-1 — the trap re-wrote a stale URL

`:4381` captured `pathname + search` **at mount** and closed over it; every back press
re-pushed that frozen string. Any later `replaceState` — F-09.147's clear, most of all —
was silently undone and `?room=discover` came back from the dead. `onPop` now clears the
param **first**, closes the room, and pushes the sentinel against a **live** read. Order is
the cure, and `§5.2` asserts the order.

### C-2 — the cure that would have regressed the finding it descends from

`deepLinkRef` was set once and never cleared. Harmless only because nothing cleared the
param either. The moment `closeRoom` starts stripping `?room=`:

```
tap Discover → opens, ref='discover'
close        → param gone, ref STILL 'discover'
tap Discover → param === ref → early return → NOTHING
```

The Discover door would have opened **exactly once per page load** — F-09.146 regressed by
its own cure. Cured at two places deliberately: the effect resets the guard when the param
goes absent (the honest signal that the room is closed), and `closeRoom` resets it at the
source, so the door survives a future Next that stops syncing `useSearchParams` off
`replaceState`. `§6.3` is the open→close→open proof; `§6.4` reproduces the naive form.

### F-09.148 — the chrome that could not be hit

Founder, verbatim: 「 nothing happpens. no clock. 」

**The deck is exonerated at static grade.** The room top bar is a `flexShrink:0` sibling
*above* the room-content box where `DiscoverRoom` mounts; the deck root is
`flex:1, position:relative`, so its absolute children (`:2054` scrim, `:2169` overlay,
`:2183` panel) are all clipped below the bar. `touchAction:'none'` sits on the deck root,
not the bar. The PTR guard calls `preventDefault` on **`touchmove` only**, which does not
suppress a click. The bloom's `onTouchEnd` returns early for discover.

**The patient is the target.** `padding:0` around a 14px glyph and an 8px line made a box
about 14px tall. A thumb that misses a 14px target lands on the bar `div` behind it, which
has no handler — zero close, zero acknowledgment, exactly the report. The bar this room
sits under has taught `minHeight:48` since F-09.136; this control never got the lesson.

**Layout-neutral by construction:** 44px of box with −15px top and bottom margins is a
**14px margin box** — the same 14px the bar has always laid out — so the target grows into
the top bar's own padding and the chrome does not move a pixel. The negative left margin
keeps the glyph at the bar's 18px gutter.

**The pressed state is the instrument.** 「 no clock 」 was a report of *zero feedback*:
until this ships, a received tap and a missed tap look identical. F-09.21's law applies to
this control like every other. If the press shows and the room stays, the patient is the
state, not the target — and the next report can say so without guessing.

---

## 2 · DISCLOSURES — every miss and self-catch, by name

**B-1 · A VACUOUS CELL I WROTE AND CAUGHT.** `§2.5`'s first draft fed the geometry a
**constant** clearance and was therefore GREEN at the uncured tree. A cell that passes on
the diseased tree has asserted nothing. The room container's bottom edge is now resolved
**out of the shipped style**, so the sum moves when the code moves. Caught by running the
bench at the uncured tree before delivering, which is the only reason it was caught.

**B-2 · A CRASH THAT SHOULD HAVE BEEN A RED.** `§5.3` indexed `seq[1]` unguarded and threw
at the uncured tree, where the handler pushes first and never clears. A bench that crashes
has not answered its question, it has refused it — the floor bench's own words at its
`§5.7` guard, walked into by its successor. Every read in `§5` is now total.

**Two more vacuity holes, same sweep:** `§4.4` passed with an **absent** `clearRoomParam`
(nothing to clear, nothing written) and now carries a non-empty limb; `§6.4` "caught" a
mutation it had never applied and now asserts the mutated body differs from the shipped one.

**AMENDMENT TO A FLOOR CELL, DISCLOSED.** `tdw09_p4_bar §5.2` read
`/BRIDE_BAR_HEIGHT/.test(layout)` — satisfied by the identifier appearing *anywhere*,
including the import line. Moving the spacer onto `BRIDE_BAR_CLEARANCE` turned it red on a
tree that is more correct, not less. The amendment **strengthens** it: the cell now scopes
itself to the spacer's own height expression and asserts the property the regex was a proxy
for — the reservation is read from the bar, never re-typed. A hand-typed `62px` now reds
where it used to pass. `M11` bites it. The floor went 57 → 58, and the extra cell is that
mutation.

**DEVIATION FROM THE RULING'S WORD, DISCLOSED:** padding rather than a shortened box (see
F-09.145 above, the glass-band reason).

**ONE BYTE REMOVED BEFORE CUT.** The M2 control briefly carried
`aria-label="Back to Sanctuary"` — a new rendered string, and therefore a founder-veto slot
this ZIP has no ruling for. It was dropped: the button's visible text already gives it an
accessible name. **ZIP-1 ships ZERO new rendered bytes.** If the chair wants the assistive
label, it is one veto batch and one line.

---

## 3 · WALLS — byte-untouched, by name

The twelve bloom bodies (`DiscoverRoom`, `DiscVendorPanel` included) · the open/close
choreography (`openRoom`/`closeRoom`'s 300ms body unchanged; `closeRoom` gained two lines
*before* it, never inside it) · `lib/frost/photoPager.ts` (`classifyGesture` — shared home
with vendor-lane blast radius, rated worse than a bloom reach and untouched either way) ·
`app/admin/**` · vendor-lane surfaces · `app/vendor/settings/**` + billing · `dream-os` ·
Mira/Eliza souls · the demo organs · `lib/frost/tokens.ts` (M4's, not this ZIP's) ·
no `localStorage` byte · no gold in chrome · no colour literal added anywhere.

**Reach used:** the two ruled clearances, the URL sync, and the room top bar — the last
under §4's wall drawing (bloom **chrome**, the frame the conductor renders around every
room, not one of the twelve bodies).

---

## 4 · THE EVIDENCE

| gate | figure |
|---|---|
| `tsc --noEmit` | **0** |
| `tdw09_p4_zip2` cured | **57/57** |
| `tdw09_p4_zip2` uncured (`e4d07f5`) | **28/57** — 29 red, every cure cell among them |
| `tdw09_p4_bar` | **58/58** (was 57/57; +M11) |
| `tdw10_p3_deck` | 191/193 — **attributed**, F-10.62, identical both trees |
| `tdw_f0774_stripper` | 33/35 sibling-present (32/34 + 1 named skip without it) — **attributed**, F-09.144, identical both trees |
| floor | **byte-stable** — a full both-tree run diffs to exactly the two benches this delivery owns |

Every uncured green in `tdw09_p4_zip2` is a property, regression-guard, or mutation cell,
never a cure cell. `§8` is a cured-tree section by construction, as the floor bench's `§7`
is: a mutation that no-ops on the diseased tree proves nothing there, and its non-vacuity
is the cured run.

---

## 5 · THE FOUNDER'S WALK — bride lane, `+919625759924`

Four glances. The second is the one that decides M2's patient.

1. **The floor.** Open Discover from the bar. Tap a card to raise the vendor panel. The
   **Lock Date / Circle row is fully visible above the bar** — nothing sliced. Then Muse and
   Journey: same, nothing under the bar.
2. **THE TAP.** In Discover, tap `‹ SANCTUARY`. Two things to watch, separately:
   **(a) does the chrome visibly press?** **(b) does the room close?**
   · press + close → F-09.148 was the whole disease, ② closes.
   · **press but no close** → the target was real but was not the only patient; ② re-opens
     on the state with a fresh number, and the press is how we know. Say which you saw.
   · neither → the report stands and the patient is elsewhere; do not let me guess.
3. **The URL.** Close the room and look at the address bar: **no `?room=`**, and the bar's
   lamp back on **HOME**. Pull to refresh — you stay on Sanctuary, not back in Discover.
4. **THE DOOR, TWICE.** Tap Discover → close → **tap Discover again.** It must open the
   second time. This is C-2, and it is the step that would have caught the regression in
   the wild if it had shipped.

**SQL: N/A** — no column named, no table read, no fixture minted. The couple rows at your
desk from the Package-4 SELECT are untouched.

---

## 6 · WHAT THIS ZIP DOES NOT DO

M3 (the thumbnail grid) and M4 (Warm Porcelain) are their own ZIPs per §4's ruling. M3's
boundary table is banked in the read-first and needs no re-derivation: every organ it wants
is a shared home, with `app/vendor/discover/preview/page.tsx` as the working reference
implementation. M3 builds after its veto batch returns.

---

## 7 · E-1 — AN UNDER-SPECIFIED ATTESTATION, OWNED

The delivery's verify block told the founder to expect `tdw_f0774_stripper 32/34
(1 NAMED SKIP)`. His container returned **33/35**. Derived at the tip, not explained away:

`f0774 §5.1` looks for the twin stripper definition at `../dream-os/scripts/lib/stripComments.js`
or one level up. Present → the cell runs and passes. Absent → a **named skip**, and skips are
excluded from `total = pass + fail`. So the sibling adds exactly `+1 pass, +1 total, −1 skip`.
The founder's Codespace carries `dream-os` as a workspace sibling; the executor's did not.

Reproduced both ways at the same tree: sibling placed → `33/35`; sibling removed → `32/34
(1 NAMED SKIP)`. **The two failures are `§6.3` and `§6.5` in every run** — uncured tree, cured
tree, sibling present, sibling absent — and neither is this delivery's: the twenty `§6.3`
offenders are pre-existing proofs carrying the naive rule, and this ZIP's two proof files are
not among them. F-09.144's attribution holds unmoved.

**The miss is the executor's.** The kickoff's §5 required f0774's figure to be stated *with the
sibling's presence stated*; a bare `32/34` was given instead. A figure whose value depends on
the container is not a figure until the container is named. Corrected in §4 above, and the law
is restated here so the next seat's attestation names the condition rather than the number.
