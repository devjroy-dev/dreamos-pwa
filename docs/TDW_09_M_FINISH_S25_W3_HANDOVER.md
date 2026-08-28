# M-FINISH · S2/5 · F-38.61 + F-38.62 — THE COLLAB PILL TAKES ITS OWN HOME

**BASE (R-38.15): pwa `6eaf108` = `origin/worklist` · dream-os `a14a436` = `origin/main`,
both re-derived at the moment of cutting.**
**Railway/Vercel green: NOT CLAIMED** — nothing here ran against a deploy.

> **⚠ R-38.16 FIRED TWICE IN THIS SITTING.** The work was built at `aff8870`, P2-A landed S4
> (`6eaf108` pwa, `a14a436` dream-os), and everything below was re-derived on the new tips
> rather than re-quoted. **Zero contention**: P2-A touched `app/v/[code]/page.tsx`,
> `docs/COPY_REGISTER_TDW19.md` and `tools/bs_audit.mjs`; this cut touches the two calendar
> sheets, the calendar screen, collab's screen and `b40`. No byte overlaps.
>
> **`bs_audit.mjs` moved (31 → 34 cells) and it is one of `tdw_f0774_readers`' five declared
> exemptions.** That was the one number a P2-A push could have broken. §2.1 re-run at
> `6eaf108`: **still green** — it still strips elsewhere in the file, so the exemption still
> names a file that has made the distinction it is excused for. Re-proven, not assumed.

---

## §0 · THE FINDING — AN ACTION FILED UNDER THE WRONG NOUN

Founder walk, 2026-08-29: 「in crew, edit etc — collab should be there」.

The collab leg was **live since F10(b) and buried inside `CalendarCrewSheet`**. A vendor who
wanted to post a requirement for an event had to open a sheet **about her own team** to reach
a door about **hiring somebody else's**. The capability was never missing; it was filed under
the wrong noun, one level down.

**F-09.129's shape, found the same way that one was: by walking, not by reading.** No cell
could have caught it — every instrument in its path was asserting that the leg worked, and it
did.

---

## §1 · F-38.61 · THE LEG MOVES, WHOLE, AND THE OLD DOOR RETIRES

Founder-ruled: **the pill becomes the one home and the crew sheet's button retires.**

**Everything travelled together** — `postToCollab`, both refusals, the `fetchMe` city read,
and all three copy bytes (`POST_TO_COLLAB`, `PAST_DATE`, `NO_CITY`). A leg split across two
files is how the halves drift, and copy has one home: **wherever the control is.**

**Two homes for one action is the disease this estate names most often**, so the crew sheet's
button did not stay as a second door. What was left behind is a labelled block saying where
the leg went and why, not a stub.

**`eventDate` left with it.** Derived, not assumed: the prop had two hits — its declaration
and its destructure — and no other reader in that sheet. Dropping it made the call site a
**tsc error rather than a silent dead prop**, which is the rename-as-guard shape this estate
already uses at F-09.34.

**Row order, founder-ruled:** `Move · Crew · Collab · Edit · Cancel`. Collab beside Crew
because both answer 「who works this event」, and both ahead of the destructive Cancel.

### ⚠ ONE DECLARED REMAINDER

`crewDate` in `app/vendor/calendar/screen.tsx` is now **written and never read** — it fed the
prop that left. **Kept, not deleted, with the reason stated**: `:398` seeds it from a function
row on a path this walk did not exercise, and removing the state would edit a path nobody has
witnessed this sitting. A write with no reader is dead weight and it is **filed (F-38.p8)**
rather than swept inside a copy-and-control cut. One motion at a time.

---

## §2 · F-38.62 · THE TAB ORDER, AND THE LANDING TAB DERIVED FROM IT

Founder-ruled: 「my post should be first, opportunities be second — which means collab should
open on my posts」.

```
TAB_ORDER   = ['my_posts', 'opportunities', 'roster']
TAB_DEFAULT = TAB_ORDER[0]
```

**The landing tab is DERIVED, not restated.** A future reorder cannot leave the first pill and
the landing tab disagreeing, because there is no second place to forget. The union's spelling
order is not a render order and a comment at its site now says so, since a reader could
otherwise mistake the type declaration for the ruling.

**Nothing asserted the tab order before this cut**, so the reorder would have landed
unguarded — and the whole reason for the ruling is that My Posts is where he lands. C40 exists
for that. R-37.22's reasoning: a control that moves under the thumb is a control that cannot
be learned.

---

## §3 · THE VERDICT SURFACE — RATIFIED, AND THE AMENDMENT FOUND A THIRD KIND

The header declared 「every verdict line printed here is the wire's own sentence」. The collab
refusals are **client-side pre-checks that fire before any door is called**, so that sentence
became false in the same cut that added them — F-38.29's shape, three lines from the code it
describes. Amended at site; **chair-ratified**, with the ruling that the contract must name
both kinds and **label each at its render site so a third cannot slip in unlabelled**.

### Making the kind explicit found the third kind in the first minute

The kind now lives in the state's **type**, not in a convention:

```
{ kind: 'wire' | 'preflight' | 'transport'; line: string }
```

There is no way to write this surface without saying what the line is. And the moment that
landed, **five `catch` arms printing `'Network error.'` had nowhere honest to go.** The wire
never answered — that is the client saying so. It has been a third, unlabelled kind for as
long as the sheet has existed, under a header calling every line the wire's own sentence, and
**nothing could see it while one untyped setter carried all three.**

**Forcing it into `wire` to keep the count at two would have been the type asserting a lie.**
Named `transport` instead and **filed as F-38.p7** — the class is 「a surface whose declared
contract was narrower than its traffic」.

**The label is `data-verdict-kind`, not a visible eyebrow.** The vendor sees one sentence and
should: she does not care whether a door refused her or was never called, only what to do
next, and printing 「preflight」 over her copy would be the estate talking to itself on her
screen.

---

## §4 · THE CELLS — THREE, AND ONE OF THEM RETIRED WITH ITS READER MID-CUT

**C40** — collab opens on the first pill, pills in the ruled order. Asserts the **link**
(`TAB_DEFAULT = TAB_ORDER[0]`), not the literal `'my_posts'`: a cell checking the string would
have passed on a screen that hardcoded it beside a reordered array.

**C41** — the leg has one home, and the crew sheet has none. Asserts both halves, the row
order, the refusals' kind, and that the address book still answers.

> **The first cut of C41's matcher was wrong and reddened a correct tree.** It looked for the
> literal `>Collab<`; the pill renders `{POST_TO_COLLAB}`, because copy has one home. The cell
> was asserting **how a byte is spelled at the render** rather than what the row says —
> D-38.1's shape in a matcher. The constant is resolved first now, which also means the
> founder can veto the word later without reddening a bench: **the ruling is about the
> position.**

**C42** — no verdict line reaches the surface without declaring its kind. **Asserts the
mechanism, not the count**: a cell checking for 「three kinds」 goes stale the day a fourth is
ruled in; what must never happen is a writer with no kind.

> **C41 retired with its reader inside this sitting.** It read `setVerdict(PAST_DATE)` until
> the kinds became explicit; the writer is `preflightRefusal` now, and the old spelling would
> have reddened a tree that had just been made *more* honest. The successor assertion is
> stronger — it pins the refusals to the **preflight kind**, not merely to the surface.

**Both-ways, run at `6eaf108` by mutating production source:**
- Revert `TAB_ORDER` → **C40 RED**, naming the ruled order against the found one.
- Re-add a `postToCollab` to the crew sheet → **C41 RED**, *「two homes for one action」*.
- Move the pill after Edit → **C41 RED**, printing the row it found against the row ruled.
- Re-add a bare `setVerdictState` call → **C42 RED**, *「a bare writer has grown back」*.
- Strip `data-verdict-kind` from the render → **C42 RED**.
- Widen the union with a kind that has no writer → **C42 RED**, naming it.
- Restore each → **GREEN**.

---

## §5 · FLOORS AT THE CUT (R-38.19)

**Floor by SET: 23, no delta.** No bench joins or leaves; this cut adds cells to an existing
one. Measured in `--delivery` mode against `scripts/floor-manifest-ce38-s25-w3.txt`.

`npx tsc --noEmit` **exit 0** · `b40` **FLOOR GREEN, 42 cells** (39 → 42, three added by
label) · `modeBridge` **GREEN 11/11** · `tdw_f0774_readers` **100 files, 89 readers, 18
offenders — unchanged at the new tip**.

---

## §6 · THE NUMBERING COLLISION, AND WHAT IT COST

This seat called both rulings **W-3** and stamped it at **18 sites** before deriving that
P2-A's S4 commit numbers its own walk findings W-1 through W-4. Two seats minting walk numbers
independently in one block is **F-38.39–.42's precedent exactly**: only the chair serializes.

Chair-assigned finals stamped here: **F-38.61** (the pill's relocation) and **F-38.62** (the
tab reorder). Standing rule tightened one notch at the same relay: **walk findings take
placeholder ids from the first message, chair serializes — same law as seat findings, no
separate namespace.**

**A correction on the record, closed at the relay:** this seat earlier answered 「W-1 is
already in the tree; W-2 has no bytes」 about *its own* walk numbers, at a moment when P2-A's
W-1/W-2 were different findings entirely. Right about this seat, easily read as a claim about
theirs.

**And the shorthand is still alive elsewhere in the tree** — `app/vendor/page.tsx:924`,
`pin-reset/page.tsx:21`, `discover/profile/page.tsx:31` all carry a bare `W-1` from older
blocks. Not touched here; named because the tightened rule has a back-catalogue.

---

## §7 · WHAT THIS SEAT OWNS

- **Nothing here ran against a deploy.** The pill at rest and pressed, the two refusals on
  glass, and the collab landing tab are the founder's run.
- **`POST_TO_COLLAB` is now `'Collab'`, not `'Post to Collab'`** — a NEW vendor-facing byte,
  shortened to sit in a five-pill row beside Move and Crew. **Founder veto stands**; C41
  resolves the constant, so changing the word reddens nothing.
- **F-38.p7** (the transport kind) and **F-38.p8** (`crewDate` write-only) are filed, not
  cured. Both are named at their own sites.
- **The reader bench still reds on eighteen**, unchanged by either P2-A push. Its cure sitting
  is still owed, `tools/wl_render.cjs` first.

## §8 · THE NEXT SITTING

Unchanged by this cut: the un-stripped-reader cure sitting · F-38.47's design sitting · Phase
4 · Phase 7 cutover · `rooms.ts:1` to NINETEEN at the Khata edit.

Open: F-38.22 · F-38.23 · F-38.24 · F-38.30 = F-19.14 · F-38.31's Phase 4 half · F-38.32 ·
F-38.38 + F-19.18 · F-38.47 · the two dirt-enumeration homes · **F-38.p1–.p8** for the chair's
final ids · the W-number mapping line owed to the fourth band.
