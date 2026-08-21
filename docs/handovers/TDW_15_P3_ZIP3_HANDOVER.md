# TDW_15 · P3.3 · ZIP 3 (dreamos-pwa) — MOMENTS ON THE 07 IMAGE DISCIPLINE, AND THE NINTH AND TENTH ALLOWLIST ENTRIES

**Executor seat under CE-35, 2026-08-20.**
**CE-56 attestation — fresh `git fetch -q origin`, tree reset to origin, expected-clean, before any byte:**
`dreamos-pwa` **`cc80229`** (ZIP 2, banked) · `dream-os` **`2a4c320`** (ZIP 1, banked). Sibling-full.

**Serves:** R-35.25 — the ninth and tenth `tdw13_d4_extraction` allowlist entries, granted under R-34.54's exact discipline — and P3.3, the limb this seat built, benched green, floored, and **withdrew at the gate** in ZIP 2 rather than self-grant the exemptions it needed.

---

## 1 · WHAT SHIPPED — three files, small and clean

| path | state | what |
|---|---|---|
| `components/frost/blooms/moments.tsx` | MODIFIED | the 07 image discipline adopted at both `<img>` sites; each rewrite labelled with R-35.25 in-file |
| `scripts/tdw13_d4_extraction.proof.mjs` | MODIFIED | the ninth and tenth allowlist entries, labelled, one at a time; the cell's own count moved eight → ten |
| `scripts/tdw15_p3_moments.proof.mjs` | NEW | the limb's proof, both-ways |

**Not touched:** every other byte in either repo. No dream-os file. No conductor byte. No token.

---

## 2 · R-35.25 — THE PROVENANCE, DERIVED BY COMMAND AND SHOWN, NOT ASSERTED

The ruling required each line verified present in the pre-extraction corpus **first**, by `git show` at the pre-extraction commit, with the derivation shown in the delivery. It is below verbatim from the run.

**The anchor is the canary's own**, read out of the instrument rather than out of a comment: `scripts/tdw13_d4_extraction.proof.mjs` declares `const BASE = 'b1448c4';  // the tree D-4 was cut from`, and its map declares the moments span as `[3542, 3810]`.

```
$ git log -1 --format='%h %ci' b1448c4
b1448c4 2026-08-13 12:44:24 +0000

$ git show 'b1448c4:app/(frost)/frost/canvas/sanctuary/page.tsx' \
    | grep -n 'src={fullImg} alt="" style={{maxWidth'
3674:        <img src={fullImg} alt="" style={{maxWidth:'96vw',maxHeight:'92vh',objectFit:'contain',borderRadius:4}}/>

$ git show 'b1448c4:app/(frost)/frost/canvas/sanctuary/page.tsx' \
    | grep -n "src={m.image_url} alt={m.caption||''}"
3741:                <img src={m.image_url} alt={m.caption||''} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} loading="lazy"/>
```

| entry | absolute at `b1448c4` | inside span `[3542, 3810]` | relative line |
|---|---|---|---|
| **NINTH** — the viewer | 3674 | yes | **133** |
| **TENTH** — the grid tile | 3741 | yes | **200** |

Both entries carry that derivation in-comment beside them, in R-34.54's form: the ruling's number, the date, why the line cannot survive its own cure, and the corpus witness. **Cell `2a0` re-verifies both mechanically on every run** — *"every ruled exemption names a line that was actually relocated"* — so a stale exemption cannot widen the bar after the line it names has gone. That cell is green.

**TEN, AND AN ELEVENTH STILL REDS.** The allowlist grew by two labelled entries, one at a time, never by a pattern. The cell's own prose moved with it — it now claims *"nothing changed except these ten things"*, which is a real assertion, where *"roughly nothing changed"* would not be.

---

## 3 · P3.3 — THE LIMB

`components/frost/blooms/moments.tsx` was the last frost image surface not riding the 07 discipline. It served `m.image_url` raw at both sites: a **full-size original into a small grid tile** behind nothing but `loading="lazy"`, and the same original in the viewer.

The one home is `lib/img.ts`, addressed at `lib/frost-api/img.ts` — one variant table (`card` w_800 · `thumb` w_200 · `full` w_1600 · LQIP `w_24,e_blur:1000`, each with `q_auto`/`f_auto`), RN-portable by construction. Four surfaces already ride it; this makes five. **No variant string is re-declared here** and §1 of the proof reddens if one ever is.

- **Grid tile** — an LQIP wash beneath `imgUrl(m.image_url,'card')`, byte-for-byte the two-layer plate `blooms/discover.tsx` uses. The wash is `aria-hidden` with an empty `alt`, so a screen reader meets the moment once rather than twice (§5).
- **Viewer** — `imgUrl(fullImg,'full')`. A phone screen does not need several megabytes of camera JPEG.

**THE PASS-THROUGH RULE IS WHY THIS IS SAFE UNCONDITIONALLY.** Both helpers transform **only** when the segment after `/image/upload/` is `v<digits>`, and return anything else **byte-unchanged** — a rule `lib/img.ts` adopted deliberately after four login screens died to an injected transformation. A moment whose `image_url` is not a canonical Cloudinary upload therefore renders exactly as it does today. **This delivery cannot break a row it does not recognise**, which is why no shape test of its own was added.

**F-1's own promise is held and asserted:** §6 pins tap-to-zoom, the Circle chip and the date stamp as surviving. *Every capability is kept* was the relocation's claim and it is still true.

---

## 4 · BENCHES — BOTH WAYS, REDS FROM THE RUN'S OWN OUTPUT (R-33.10)

| leg | result |
|---|---|
| **CURED** | moments proof **6/0** · `tdw13_d4_extraction` **53 passed, 0 failed** · `tsc --noEmit` **0 errors repo-wide** |
| **UNCURED** (origin `cc80229`, proof copied in alone) | moments proof **1 PASS / 5 FAIL** — `imgUrl/lqipUrl not imported…`, `no LQIP layer on the tile`, `a raw original is still served: "<img src={fullImg}"` |
| **M1 · THE ELEVENTH LINE** — an unruled relocated line eaten | **canary 52 passed, 1 failed**: `2a. … — 1 eaten, first: const diff = Math.round((wedding - saved) / 86400000);` |
| **M2** grid tile reverted to the raw original | moments **4/2** — §2, §4 |
| **M3** a variant width re-declared here instead of reaching the one home | moments **4/2** — §1, §3 |

**M1 IS THE CELL THE RULING ASKED FOR** and it is the one that proves the grant did not cost the canary its teeth: with ten lawful exemptions in place, an eleventh unruled edit still reddens.

**M2 and M3 leave the canary GREEN, and that is correct rather than a gap.** Both rewrite lines the allowlist now exempts, so the canary has nothing to say about them — which is exactly why the moments proof exists beside it. The two instruments have different subjects: the canary asserts *nothing changed except the ten ruled things*, the proof asserts *the ten ruled things changed into the right shape*. Neither is a substitute for the other.

**THE STRUCTURAL CELLS ARE DISCLOSED AS STRUCTURAL.** `moments.tsx` is a `'use client'` React module and cannot render standalone in plain node (the `bands.proof.ts` precedent states the same limitation out loud about `CalendarBands.tsx`). Cells assert surfaces — a symbol reached, a variant served, an absence — never a line and never where a constant lives (F-15.12). They count **comment-stripped**, because the cure's own header names the shape it replaces and an instrument that reads the description of the disease as the disease is broken (R-33.10; the sibling pulse proof reddened on a *cured* tree once before it was stripped).

### AN ERROR OF MINE, OWNED — AND IT IS THE SITTING'S OWN WATCH-LIST ENTRY

**The first M1 anchor was chosen from expected shape, not derived, and it silently reported the canary GREEN.** I picked a `useState` line that *looked* like relocated code; it was not in the relocated corpus in the form I mutated, so the canary correctly said nothing — and had I stopped reading there, **I would have filed "an eleventh still reds" as proven when the mutation had proven nothing.** R-33.10's law is exactly this: *a mutation reporting no red is either a passing cell or a broken instrument, and the two are indistinguishable until you read the run.*

The correction was to derive a real member of the corpus by command rather than guess one:

```
moments relocated lines still in the bloom: 223 of 225
```

and mutate from that list. **Caught by reading the run, not by a grep over it.** It is the executor watch-list's root entry — *reaching for expected shape instead of reading the text* — arriving one more time, in the one place where a false green would have been most expensive.

---

## 5 · FLOORS — WARM, SIBLING-FULL, BOTH REPOS

**`dreamos-pwa`** on the delivery tree, warm-up discarded, measured `--check`: **one delta — `tdw_f0774_vacuity_probe`, and it is attribution, not defect.** That probe writes to production source and restores it, and **refuses to start on a dirty tree** because it cannot otherwise prove the restore was clean (`STOP — the tree is dirty… Nothing was touched.`). Exonerated by control at ZIP 2 on a clean clone: rc 0, *"GREEN — the cure sees what the disease hid. 21 reds at the sitting that minted them."* The other six reds are the named base, unchanged.

**`tdw13_d4_extraction` IS ABSENT FROM THE RED SET** — the canary is green with its two new entries, in the floor and standalone. That is the delivery's central floor claim.

**F-14.26 — DECLARED, NOT RESOLVED,** and this ZIP is its cleanest demonstration yet: the pwa runner has no `--delivery`, so on a delivery tree it **measures but cannot gate** — it cannot verify a declared-dirt set, cannot hash the manifest's files before and after, and cannot distinguish a probe's lawful refusal from a real red without a hand-run control on a clean clone. dream-os's runner has done all three on every ZIP this sitting. The port is a queued micro and is not this seat's.

**`dream-os`** at `2a4c320`, clean, sibling-full against this delivery's pwa tree, warm, `--check` — result recorded in the delivery message.

---

## 6 · P3 CLOSES

All three limbs of TDW_15 P3 are now at origin or in this ZIP:

- **P3.1** — the masthead's number (F-15.17, both repos) and the budget pulse (R-1 as narrowed, C-3 wordless, C-4 absent). The morning line **does not ship**: F-15.18 open, acceptance 5.4's `briefing.js` limb **waived by name**, founder word **"skip"**, 2026-08-20.
- **P3.2** — mood half shipped prior; photo half **split by R-35.24**. Ladder tip `0125`; **0126 noted, not reserved**.
- **P3.3** — this ZIP.

**Zero matrix rows moved across the whole phase, and that is declared rather than skipped** (§4's guardrail). `BRIDE_PARITY_MATRIX.md` is a Mira-capability × bloom contract; no P3 limb is a row in it, and acceptance 5.4 lives in `docs/specs/TDW_15_ROOMS_FINAL.md §5`, dream-os. The waiver records ride the handovers by committed home (CE-214). **c-35.14** owns the misdirection.

**Open, carried by number:** F-15.18 (the organ's output plane, Row 9-adjacent) · F-15.19 (the 0.9 threshold's two homes; M-CELLSWEEP takes it as evidence meanwhile) · F-15.20 (`TodayHero.tsx`'s dead fourth copy) · F-15.21 (`today.js`'s `todayStr`) · F-14.26 (the pwa `--delivery` port).

---

## 7 · WALK CARD — after the founder's rows

Open Moments on the walking account. The grid should now **fill in two beats** — a blurred wash arriving almost instantly, the sharp image settling over it — rather than one long blank while a camera original downloads. Tap a moment: the viewer opens on the `full` variant. Everything else is unchanged by construction and by cell: tap-to-zoom, tap-to-edit caption, inline save/cancel, the Circle chip, the day label.

**The honest bound:** on wifi this may be invisible. It is a bytes-over-the-wire cure, and the place to feel it is a phone on mobile data with a scroll of moments. If a moment's image renders identically and instantly as before, that is likely a non-canonical URL taking the pass-through rule — working as designed, not a failure.

---

*Sequencing beyond this delivery is the founder's.*
