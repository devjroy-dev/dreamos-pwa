# TDW_09 · ATELIER RIDER 1 — THE PROFILE EDIT SHEET
**Repo:** `dreamos-pwa` · **base:** the BUILD-ALL commit (Gate 2 sealed 「 walk is green 」, 2026-08-07)
**Chartered:** founder, on his Gate 2 walk — 「 go for the settings sheet edit capability 」
**Seat:** Opus 5-LE · 2 files · pwa only · **zero dream-os bytes**

| gate | reading |
|---|---|
| `tsc --noEmit` | exit 0, zero lines |
| `tdw09_p2c` | **52 / 52** byte-stable |
| `tdw09_frost_parity` | **64 / 64** (was 57; +7 rider cells) |
| mutations | **6 / 6 bite** |

---

## 1 · WHAT THE DERIVATION FOUND

The founder's conviction was right, and the reason was not what either of us assumed.

**The wedding-date door was already built and never opened.**
- `dream-os src/api/couple/me.js:59` — `PATCH /:coupleId` destructures `wedding_date` at `:67` and writes it at `:71`.
- Mounted `PATCH /api/v2/couple/me/:coupleId` (`src/api/router.js:69` under `src/index.js:163`).
- `pwa lib/frost/journey.ts:516` — `saveProfile()` has wrapped that route since the client was written.
- **Callers: zero.** A validated, typed, mounted write path with nothing on the other end of it.

**The budget door does not exist.** That same PATCH takes `name / partner_name / wedding_date / wedding_city` and **not** `budget_total`. No route in the estate lets the app write it.

**And she was never stranded.** `src/agent/brideTools.js:46` gives Dream Ai a `save_wedding_detail` tool over `partner_name · wedding_date · wedding_city · budget_total · events_planned`, validated at `brideEngine.js:476-501`. A live bride can change both fields on WhatsApp today. What she could not do was change them in the app.

---

## 2 · WHAT SHIPPED

**Wedding date — editable, end to end.** The row is tappable and opens the sheet; the sheet commits through `saveProfile()`; the commit **re-reads** the profile rather than trusting its own write, because the server owns the stored shape and a date it normalises differently would otherwise sit stale until the next mount.

**The sheet is surface class 4, verbatim.** Bottom-anchored, `FI.sheet` top corners, scrim at `rgba(0,0,0,.55)`, safe-area padding, tap-scrim-to-dismiss, type on the rungs. It is the same sheet as Add-a-booking on purpose — one pattern to learn, not two.

**The budget row now always renders.** It read `{profile?.budget_total && <Row …>}`, so a bride with no budget set did not see a disabled field — **she saw nothing at all**, and had no way to learn the field existed. It shows `Not set yet` and one engraved line naming the door that works.

**Budget is deliberately read-only, and the code says why in-comment.** Shipping a budget field that silently discarded its input would be a lying control — the same law that retired the Appearance swatches when the theme reader was pinned.

---

## 3 · CENSUS AMENDED — LABELLED, WITH ITS ARITHMETIC

BUILD-ALL sealed on a floor of **145**. A rider that adds capability moves the census, so it moves by a stated sum rather than a swapped constant:

```
145   the BUILD-ALL floor, sealed on the green walk
 +2   buttons  — the sheet's ✕ closer, the Save-date action
 +1   input    — the date field
 +1   tap-div  — the sheet's dismiss scrim
────
149   Rider 1's floor
```

The Total-budget row gains **no** control — it is a `Row` with no `onTap`, so the census does not count it. Glyph exemption 9 → 10 (the sheet's ✕, matching the eight closers already exempt). Both amendments carry that reasoning in-file at the cell.

---

## 4 · THE MUTATION LEDGER

| # | mutation | cell |
|---|---|---|
| R-1 | the date row stops opening the sheet | 7.1 RED |
| R-2 | the sheet stops calling the writer | 7.2 RED |
| R-3 | the commit trusts its own write | 7.3 RED |
| R-4 | a failed save fails silently | 7.4 RED |
| R-5b | the budget row's vanishing guard restored | 7.6 RED |
| R-6 | the budget row stops naming the working door | 7.7 RED |

**Two disclosures.**

*Cell 7.2's first draft asserted `saveProfile` appeared on the import line.* That is an **import-string assertion** — precisely what this bench's own header forbids, and the species that let a reverted P4 sitting certify a Discover door it had never executed. I wrote the thing I had written the law against. Clause removed; the call site is the evidence, and if the symbol were not imported tsc would not be at zero.

*Mutation R-5 was vacuous on first run* — I mutated the row's *value* when the cell's question is whether the row *renders*. The cell was fine; the mutation asked a different question. Re-cut as R-5b, which bites.

---

## 5 · WHAT IS STILL OWED — TWO WORDS, NOT BUILT

**(a) The budget write needs one dream-os line.** `budget_total` into `me.js:67`'s destructure with the positive-integer guard mirroring `brideEngine.js:496`, so the two writers agree on what a valid budget is. **dream-os is wholly read-only for this arc** (relay #4 §1). Your 「 go 」 chartered the sheet; it did not, on its face, lift that. **An inference that you would approve is not an approval, so it is not built.** Say the word and it is a one-line micro.

**(b) One door or two?** If the app becomes a budget writer, `couples.budget_total` has two: this route and `brideEngine`. `couples` already carries several writers, so this adds no new violation — but it does mean a bride can set her budget in two places, and the sole-writer rider exists for exactly that shape. Worth your ruling before the line lands rather than after.

The `Not set yet` row and its WhatsApp line are honest either way, and stop being needed the moment (a) lands.

---

## 6 · WALK — FIVE STEPS

1. Settings → **Wedding date** now has a ›. Tap it.
2. The sheet rises like the Add-a-booking sheet. Pick a date. **Save date.**
3. It closes, and the row shows the new date. Reopen Settings — still there.
4. Turn off wifi and mobile data, try again: it should say *"That didn't save. Check your connection and try again."* and **stay open** with your date intact.
5. **Total budget** always shows a row now — a figure if set, `Not set yet` if not — with the WhatsApp line under it. It is not tappable, by design.

Step 4 is the one worth doing. A save that fails silently is worse than one that cannot save.
