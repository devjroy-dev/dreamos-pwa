# TDW_09 · T-1 — THE TYPE PLAN
### The scale, the exemption, the radius, and the four questions this paper commits rather than leaves in a chat

**Base:** dreamos-pwa `0dd2199` · dream-os `5eb2309`, both re-derived at origin fetch-first.
**Under:** R-T1-AMENDED · R-T2 · R-T3 · R-T4 (founder verbatim 「 keep engraved 」, 「 broad 」) · R-U33's specimen gate.
**Instrument:** `scripts/tdw09_type_census.mjs`, committed with this paper.

> **NO COUNT IN THIS PAPER IS AUTHORITATIVE. THE INSTRUMENT'S OUTPUT IS.**
> Every figure below is reproduced from `node scripts/tdw09_type_census.mjs` at the base tip and is re-derivable by anyone. The bench asserts what the instrument prints, never an integer quoted in prose. This clause exists because a quoted integer already reached a founder ruling in this arc and was wrong by inversion.

---

## 0 · WHY THE INSTRUMENT COMES BEFORE THE PLAN

The split between *the engraved label, kept as voice* and *small text with no argument for it* was first measured by grepping `letterSpacing` on the **same source line** as the `fontSize`. Most style objects in this estate span several lines. The method scored nearly every engraved label as merely-small and reported **103 engraved / 156 small**. The truth is **251 / 8** at 8–9px: inverted.

The executor produced that number. The chair then certified it with the **same** same-line grep and relayed "locked at exactly 103 spots" to the founder, who ruled on it. That is the independent-method law's clause 1 in its purest form — a second pair of eyes agreeing by the method it should have been checking — and it is why the count now lives in a committed instrument with a differing failure mode, not in anybody's sentence.

The instrument walks **out** from each `fontSize` to its enclosing balanced braces and reads the whole style object. Pointed at a tree where that finds nothing, it refuses with a named reason rather than reporting zero.

---

## 1 · THE CENSUS OF RECORD

```
fontSize sites             757
  ENGRAVED (exempt, R-T1)  331   across 55 files
    of which under 8px      12   -> rise to 8px within the register (R-T2)
  BODY / other             426
    of which under 16px    287   -> rise to the floor (R-T4, the blanket arm)
  unresolved objects         0
distinct declared sizes     26   -> 9 named rungs
```

**A scope correction the chair's record needs.** R-T1-AMENDED pins the exemption at "the committed instrument's derived count **(251 at `0dd2199`)**". **251 is the 8–9px subset. The instrument's engraved count over all sizes is 331.** The register's own distribution, derived:

```
   6px    5      7px    7      8px   76      9px  175     10px   66     12px    2
```

The pin should read **331**, or it will red the first time anyone runs the instrument. Reported rather than quietly reconciled; the number is the chair's to enter.

---

## 2 · THE SCALE

Twenty-six declared sizes resolve to **nine named rungs**, so "16px floor" arrives as a scale and not as 287 hand-edits (R-T4's own words).

| Band | Rungs | Governs |
|---|---|---|
| **Register** (exempt from the body bar) | **8 · 9 · 10** | Jost, uppercase, letterspaced — the engraved label |
| **Body and display** | **16 · 20 · 25 · 31 · 39 · 49** | a ~1.25 ladder from the floor |

**The register keeps the three rungs it already uses, and that is a deliberate, arguable choice.** Collapsing it to two (9 and 11) would be tidier on paper and would move **142 sites by one pixel each** for no reader's benefit. Existing behaviour is sacred, and this is a voice the founder has now approved twice on a real handset. **The collapse is Q-T-1 below, not a decision taken here.**

**The movement this produces, derived, not estimated:**

```
ENGRAVED   14 sites move    317 byte-identical
BODY      398 sites move     28 byte-identical
  of the 139 body sites already at or above 16px, 111 reflow to a rung
TOTAL     412 of 757 sites change
```

The 14 engraved movers are exactly R-T2's set (6px and 7px rising to 8) plus the two 12px outliers folding to 10.

---

## 3 · THE RAISE RADIUS — 287 SITES, 53 SURFACES

Heaviest first; the full list is `node scripts/tdw09_type_census.mjs --surfaces`.

| n | surface | | n | surface |
|---|---|---|---|---|
| 23 | `app/vendor/portfolio/page.tsx` | | 7 | `app/vendor/tds/page.tsx` |
| 20 | `app/vendor/collab/page.tsx` | | 7 | `components/vendor/CalendarDaySheet.tsx` |
| 19 | `components/vendor/slices/SliceShell.tsx` | | 6 | `app/vendor/collab/[post_id]/responses/page.tsx` |
| 14 | `app/vendor/studio/team/page.tsx` | | 6 | `app/vendor/couture/page.tsx` |
| 14 | `app/vendor/studio/team-payments/page.tsx` | | 6 | `app/vendor/settings/page.tsx` |
| 12 | `app/vendor/discover/submit/page.tsx` | | 6 | `components/vendor/CalendarBands.tsx` |
| 10 | `app/vendor/contracts/page.tsx` | | 5 | five surfaces at 5 |
| 10 | `components/vendor/slices/BinderCard.tsx` | | 4 | five surfaces at 4 |
| 8 | `app/vendor/discover/page.tsx` | | ≤3 | thirty surfaces |
| 7 | `app/vendor/onboarding/page.tsx` | | | |
| 7 | `app/vendor/studio/tasks/page.tsx` | | | |

The tail is the shape of the problem: **thirty surfaces carry three sites or fewer.** This is not a few bad screens; it is a habit spread thin, which is why it survived every previous pass and why a scale is the cure rather than a sweep.

---

## 4 · THE SPECIMEN (R-U33 · R-T4's gate)

Two surfaces, **both themes**, rendered at the broad density before any of the 124 move:

1. **The Hub** (`app/vendor/page.tsx`) — 5 sub-floor sites, and the surface the founder opens most.
2. **The Edit Member sheet** (`app/vendor/studio/team/page.tsx`) — **14 sub-floor sites**, the second-heaviest studio surface, and the one he has already walked twice this arc. He knows exactly what it looked like before, which makes it the sharpest possible before/after.

The specimen renders the arm as ruled; it is not a fork picker. **The founder walks it once.** What his eye is judging is density, not legibility — legibility is arithmetic and is already settled.

---

## 5 · THE QUESTIONS THIS PAPER COMMITS

Committed here so nothing gates from a chat again. Each carries its cost, derived.

**Q-T-1 · Does the engraved register collapse to two rungs?**
Kept at three (8 · 9 · 10), 14 sites move. Collapsed to two (9 · 11), **142 sites move by a pixel**. Recommendation: **keep three.** The pixel is invisible and the churn is not.

**Q-T-2 · Do the two 12px engraved sites stay engraved?**
They are the only engraved type above 10px. Folding them to 10 keeps the register a closed band; leaving them makes 12 a fourth rung for two sites. Recommendation: **fold to 10.**

**Q-T-3 · Does 22px hold, or fold to 20?**
Thirty-nine sites at 22px — the largest single display population, and Cormorant headings across the vendor lane. The scale sends them to 20. That is a visible change to every screen's masthead and it is the one movement in this plan that a reader will notice without being told. Recommendation: **fold**, but it belongs on the specimen so it is judged by eye. *(If it holds, the scale gains a rung and the paper says so.)*

**Q-T-4 · Does `line-height` ride this pass?**
F-09.5 records 83% of declarations setting none. A 16px floor with no leading is half a cure, and adding a token default is one line in the scale — but it moves vertical rhythm on all 757 sites, not the 412. Recommendation: **yes, ride it**, with the specimen showing both.

---

## 6 · WHAT RIDES THE 124-SURFACE ZIP

The type pass · **F-09.37** (fourteen affordance-stripped selects + demo mirrors; the helper at `lib/vendor/controls.ts` is one line from adopting each) · **F-09.38** (the disabled SAVE state wearing `--atelier-input-border` as a fill) · the **CE-194 docs band** as chair bytes.

## 7 · WHAT IS NOT IN SCOPE

The frost, landing and admin lanes — each has its own token file and its own charter. The bride lane's type is untouched by this instrument, which speaks only for `app/vendor` and `components/vendor` and says so in its own header.

---

Sequencing beyond the specimen walk is the founder's.
