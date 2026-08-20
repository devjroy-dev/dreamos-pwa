# TDW_15 · P3 · ZIP 2 (dreamos-pwa) — THE PWA DAY BOUNDARY AND THE BUDGET PULSE

**Executor seat under CE-35, 2026-08-20.**
**CE-56 attestation — fresh `git fetch -q origin` at the seat's own full clones, expected-clean tree, before any byte:**
`dreamos-pwa` **`94dd738`** · `dream-os` **`2a4c320`** (ZIP 1, banked). Sibling-full throughout.

**Serves:** R-1 as narrowed by the founder to the pulse alone · R-35.23 (pwa limb + the fold) · C-3 / C-4 as founder-vetoed. **Two of three limbs. P3.3 was built, floored, and WITHDRAWN AT THE GATE — §5.**

---

## 1 · WHAT SHIPPED

| path | state | what |
|---|---|---|
| `lib/frost/tokens.ts` | MODIFIED | the pwa's ONE day-boundary home: `istDayKey`, `daysUntilIst`; `daysUntil` preserved as its reader |
| `app/coplanner/page.tsx` | MODIFIED | the local copy FOLDED onto that home; call site retargeted |
| `app/(frost)/frost/canvas/sanctuary/page.tsx` | MODIFIED | the budget pulse — one element, one read, one constant |
| `scripts/tdw15_p3_daystogo.proof.ts` | NEW | behavioural proof, real import, fixture clocks, TZ-invariance |
| `scripts/tdw15_p3_daystogo.proof.tsconfig.json` | NEW | its standalone compile config (`noEmitOnError` on) |
| `scripts/run-tdw15-p3-daystogo-proof.sh` | NEW | its wrapper (the `.proof.ts` convention; the floor enforces the pairing) |
| `scripts/tdw15_p3_pulse.proof.mjs` | NEW | the pulse's structural proof |

**Not touched, each for a stated reason:** `components/frost/blooms/moments.tsx` (§5) · `app/components/couple/TodayHero.tsx` (filed by ruling, not cured) · `components/frost/blooms/events.tsx` (`daysUntilEvent`, different subject) · `components/frost/blooms/expenses.tsx` (sealed P2 surface; R-1's narrowing) · `docs/BRIDE_PARITY_MATRIX.md` (§6) · every dream-os byte.

---

## 2 · F-15.17 — THE PWA LIMB, CURED. THE FINDING IS NOW CLOSED IN BOTH REPOS.

**Three live wedding derivations shared one defective shape**, and ZIP 1's body did not yet know the worse half of it:

| site | disposition |
|---|---|
| `lib/frost/tokens.ts` · `daysUntil` | **CURED** — becomes the one home |
| `app/coplanner/page.tsx` · local `daysUntil` | **FOLDED** onto that home |
| `app/components/couple/TodayHero.tsx` · local `daysUntil` | **FILED, byte-untouched** — zero inbound, derived by grep over the whole tree |
| `components/frost/blooms/events.tsx` · `daysUntilEvent` | **UNTOUCHED** — event dates, not the wedding; both its operands are local, so it is internally consistent |

**THE WESTWARD HALF, named for the first time.** All three flattened both operands with `.setHours(0,0,0,0)` — **device-local** midnight — while the caller had built the target from a date-only string, which ECMAScript parses as **UTC** midnight. On an IST device the two agreed and the number was accidentally right. **West of Greenwich they do not:** UTC midnight on the 14th is the evening of the 13th in New York, so the flattening pushed the target onto the previous local day and the count silently lost a day. ZIP 1's dream-os bench could not reach this half; §4 of the new proof does.

**The cure, and the comment is part of the deliverable.** Both operands are reduced to an **IST calendar-day key** and then parsed the same way, so the shared UTC basis cancels and what survives is a count of days between two IST dates. **The answer therefore depends only on the wall instant, never on the device's timezone** — the ruled semantic stated as a property, and the property §4 proves. The header names the **three** simplifications that reinstate the bug, cites `src/agent/brideNudge.js` · `buildNudge` by path and symbol as the READ-ONLY reference, cites `src/lib/istDay.js` as the dream-os sibling, and carries an F-06.85 conditional on the `date`-not-`timestamptz` premise (witness: `docs/db/PUBLIC_SCHEMA.md`, `## public.couples · 23 columns`, column line `4. wedding_date date`; F-SW.9 standing).

**WHY THE FOLD RATHER THAN A SECOND CURE.** `/coplanner` is the **circle member's** surface. Two correct copies would still be two copies; a mother and a bride reading different numbers off one wedding is the failure the ruling exists to prevent. The null arm is **preserved, not widened** — `daysUntilIst` returns null for an absent date exactly as the local copy did, and `days` is still `number | null`.

**ONE BEHAVIOUR CHANGE, STATED RATHER THAN SLIPPED IN.** `daysUntil` used to return `NaN` for an unparseable target (`Math.max(0, NaN)` is `NaN`) and now returns 0. Unreachable from `getWeddingDate`, which always yields a valid Date — but a masthead rendering "NaN" is worse than one rendering "0", and a silent improvement is still a change.

---

## 3 · THE PULSE — one element, and the founder's sentence is its hash

**FOUNDER DESIGN VETO, GRANTED VERBATIM 2026-08-20:** *"placement beneath the signal line, wordless 2px hairline, `line`/`inkSoft`/accent at 90%, absent entirely at zero envelopes."* Reproduced in-file. **Editing this element is a fresh veto, not a tweak.**

- **Placement** — the last element of the approved masthead block, beneath the signal line, inside the same container. **Nothing above it moved.** §1.5 of the proof holds the numeral, the greeting, the signal line and `mornings to I do` (C-6) as present. The ε3 Dream fence is untouched; the census instrument `tdw13_d7_dream_design.proof.mjs` **ran green in the floor and its figure did not move** — no labelled amendment is owed.
- **Idiom** — adopted from `Hairline` in `blooms/expenses.tsx`: 2px track in `line`, fill at `min(ratio,1)`, `inkSoft` below the threshold and `accent` at or past it, `borderRadius: 2`, `marginTop: FS.s2`. Tokens only; every colour comes from the masthead's own scope.
- **Wordless, and it is a correctness argument.** `spent` sums **typed** amounts over **filed** receipts only; a filed photo receipt with a null amount contributes zero (R-34.22). It is an honest floor, not a total. A figure or a percentage would assert precision the number does not have.
- **Absence (C-4)** — `pulse && pulse.ceiling > 0`. No envelopes, or every ceiling at zero, and **nothing renders**: no empty track, no placeholder, no text. The same guard keeps the ratio's divisor honest.
- **No fetch.** `fetchEnvelopes()` already exists in `lib/frost/journey.ts` on that module's `apiFetch` → `API_BASE`, and sanctuary already imported from it. **F-15.16 is satisfied by construction:** §1.1 pins the naked-literal count in the file at **3**, all pre-existing at `94dd738`; this delivery adds none.
- **Failure is silence, deliberately.** A refused or empty read leaves `pulse` null and the element does not render. An error state is a worse thing to wake up to than an absent hairline.

**THE WALL** holds and is proven at the surface: §1.6 asserts that neither `app/coplanner/page.tsx` nor `blooms/circle.tsx` reaches `fetchEnvelopes`, `budget_envelopes` or `amount_inr`. **Zero member-serializer bytes moved** — the pulse is bride-side only.

**TWO HOMES, DECLARED NOT SILENTLY CREATED.** The 0.9 threshold now exists as `PULSE_THRESHOLD` here **and** as `HAIR_THRESHOLD` in the expenses bloom. Collapsing it edits a sealed P2 surface, which R-1's narrowing puts outside this sitting. **Reported for a one-home ruling rather than cured by a seat that was not asked to.** No cell pins where it lives (F-15.12).

---

## 4 · BENCHES — BOTH WAYS, REDS FROM THE RUN'S OWN OUTPUT (R-33.10)

**`scripts/tdw15_p3_daystogo.proof.ts` — 20 cells, and it really executes.** It imports the REAL `lib/frost/tokens`; the canon itself is under test. Every clock is a fixture clock — `withClock` swaps `globalThis.Date` for a fixed instant and restores in a `finally`, with every non-zero-arg form delegating to the real constructor so date-string parsing is untouched by the fake.

**§4 IS THE CELL THAT COULD NOT BE WRITTEN IN ZIP 1.** `process.env.TZ` is read by V8 once and cannot be varied in-process, so the proof **re-executes its own compiled file** under four zones at one fixed instant:

```
PASS  all four devices agree: {"Asia/Kolkata":"177","UTC":"177",
                               "America/New_York":"177","Pacific/Auckland":"177"}
```

**`scripts/tdw15_p3_pulse.proof.mjs` — 6 cells, structural, and the limitation is disclosed rather than hidden.** Sanctuary is a `'use client'` React module that cannot render standalone in plain node (the `bands.proof.ts` precedent states the same about `CalendarBands.tsx`). Every cell asserts a **surface** — a guard, an absence, a symbol reached — never a line and never where a constant lives.

| leg | result |
|---|---|
| **CURED** | daystogo **20/0** · pulse **6/0** |
| **UNCURED** (origin `94dd738`, proofs copied in alone) | daystogo fails to compile — `TS2724: has no exported member named 'daysUntilIst'`, `TS2305: no exported member 'istDayKey'` · pulse **2 PASS / 8 FAIL** |
| **M1** `daysUntilIst` reverted to the device-local basis | daystogo **15/5** — `decrements by EXACTLY ONE … (178 -> 178)`, `THE CURE … got 178, expected 177`, and §4 collapses: `they agree on the IST answer, 177 (got ["178"])` |
| **M2** the `ceiling>0` absence guard dropped | pulse **7/3** |
| **M3** a worded figure added to the pulse | pulse **9/1** — `a text child appeared: ">spent so far<"` |

**NON-VACUITY IS STRUCTURAL.** §2's cure cell requires *both* that the IST basis gives 177 *and* that the device-local basis still gives 178, failing with *"this cell has stopped measuring the mechanism"* if the disagreement vanishes.

**TWO INSTRUMENT PROPERTIES, BOTH CAUGHT BY THE RUN AND NAMED RATHER THAN QUIETLY FIXED:**
1. **The source cells count COMMENT-STRIPPED.** Their first draft reddened on a *cured* tree, because the cure's own headers name `.setHours(0,0,0,0)` as the defect they cure — the instrument was reading the paragraph describing the disease as the disease. Same class as the Dream census's own note, and R-33.10's law that an instrument is itself subject to the both-ways standard.
2. **The pulse proof's block locator anchors on the guard string**, so M2 blinds §1.3/§1.4 as well as reddening §1.2. That is **over**-reporting, never under-reporting — the safe direction — but it is named here rather than discovered later.

**§6 GATE:** `npx --no-install tsc --noEmit` — **0 errors repo-wide**, not merely on changed files. No deletions, so no `.next` clearing was required.

---

## 5 · P3.3 — BUILT, FLOORED, AND WITHDRAWN AT THE GATE

**The moments limb was written, benched green, and pulled.** It ran the floor and the floor stopped it:

```
FAIL 2a. every relocated line still exists, except the eight edited by ruling
     — 2 eaten, first: <img src={fullImg} alt="" style={{maxWidth:'96vw',…
```

`components/frost/blooms/moments.tsx` is a **VERBATIM D-4 relocation under F-1**, and `scripts/tdw13_d4_extraction.proof.mjs` holds every relocated line. Adopting the 07 image discipline necessarily rewrites two of them — the grid tile's `<img>` and the viewer's — because the whole cure is that `src` stops being the raw original. **There is no formulation that avoids this**; the canary is correct and the limb genuinely needs exemptions.

**The canary's own header is why this is not an executor's call:**

> the allowlist grows by RULING and one entry at a time, never by widening a pattern

Its eighth entry cites **R-34.54, ruled by CE-35**, one line, verbatim, with its ruling attached. P3.3 needs a **ninth and a tenth**. An executor adding them is exactly the widening that sentence forbids, and the canary's teeth are the property worth more than one polish limb.

**FOR THE CHAIR — the derivation is done, so the ruling is cheap.** The limb is: `import { imgUrl, lqipUrl } from '@/lib/frost-api/img'`, an LQIP wash beneath the tile with `imgUrl(m.image_url,'card')` over it (byte-for-byte `blooms/discover.tsx`'s shipped plate), and `imgUrl(fullImg,'full')` in the viewer. It re-declares no variant string; `lib/img.ts` keeps its one home. Its pass-through rule means a non-canonical URL returns **byte-unchanged**, so the adoption cannot break a row it does not recognise. What it replaces is a **full-size original served into a small tile** with nothing but `loading="lazy"`. The two lines needing exemption, verbatim:

```
        <img src={fullImg} alt="" style={{maxWidth:'96vw',maxHeight:'92vh',objectFit:'contain',borderRadius:4}}/>
                <img src={m.image_url} alt={m.caption||''} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} loading="lazy"/>
```

**Arms:** (a) rule the ninth and tenth entries in the R-34.54 form and P3.3 rides a micro · (b) leave moments on raw originals and close P3.3 as waived by name. **Not ruled here.**

---

## 6 · FLOORS, AND THE MATRIX DECLARATION

**`dream-os`** at `2a4c320`, warm, sibling-full, `--check`: **`FLOOR = NAMED BASE, no delta`**, rc 0, 21 reds by name unchanged.

**`dreamos-pwa`** on the delivery tree, warm, sibling-full, `--check`: **one delta, and it is attribution, not defect** — `tdw_f0774_vacuity_probe`. That probe **writes to production source and restores it, and refuses to start on a dirty tree** because it cannot otherwise prove the restore was clean; its own words are `STOP — the tree is dirty… Nothing was touched.` **Exonerated by control:** run standalone on a clean clone at `94dd738` it exits **rc 0** with `GREEN — the cure sees what the disease hid. 21 reds at the sitting that minted them.` The other six reds are the named base, unchanged.

**F-14.26 — DECLARED, NOT RESOLVED.** dream-os's runner has `--delivery <manifest>`; **the pwa's does not.** The consequence is exactly the delta above: on a delivery tree the pwa floor **measures but cannot gate** — it cannot verify a declared-dirt set, cannot hash the manifest's files before and after, and cannot distinguish a probe's lawful refusal from a delivery's red without a hand-run control. The port is a queued micro and is not this seat's.

**THE MATRIX — a declaration, and it contradicts the charter's instruction.** `docs/BRIDE_PARITY_MATRIX.md` is a **Mira-capability × bloom** contract, 21 rows derived off `src/agent/brideTools.js`. **No P3 limb is a row in it.** Days-to-go, the pulse, image delivery and photo-attach are not bride tools; row 20 `read_pages` is already ✅/✅ and does not move. Acceptance 5.4 and P3.2's state live in **`docs/specs/TDW_15_ROOMS_FINAL.md §5`, dream-os**, not here. **Zero matrix rows move this sitting, and that is declared rather than skipped** (§4's guardrail: silent row-skipping is a failed session).

**The waiver record, by committed home** (CE-214 precedent, the route F-15.17/.18's bodies already took):
- **Acceptance 5.4's `briefing.js` limb — WAIVED BY NAME.** Founder word **"skip"**, 2026-08-20. F-15.18 stands OPEN as the future organ-output charter, queued near Row 9. No morning line ships; no gap hidden.
- **P3.2 — mood half shipped prior, photo half SPLIT BY R-35.24.** Ladder tip `0125`; **0126 noted, not reserved.**

**If the chair wants acceptance 5.4 struck in the spec's own ink, that is a dream-os docs byte and a ruled third ZIP. Not smuggled into a pwa delivery.**

---

## 7 · UNRULED, CARRIED FOR CHAIR NUMBERS — an executor mints none

1. `today.js`'s `todayStr` is a server-UTC day key and the events queries ride it; "events today" reads yesterday's IST date for the same 5.5 hours. dream-os, byte-untouched, declared in-comment at `2a4c320`.
2. `app/components/couple/TodayHero.tsx` — zero inbound, a dead fourth copy of the days-to-go defect. F-13.2's class.
3. **The 0.9 threshold's two homes** — `PULSE_THRESHOLD` here, `HAIR_THRESHOLD` in the expenses bloom. Born of R-1's narrowing, declared at both ends.
4. **The matrix-document misdirection** (§6). Offered as a fourteenth chair correction; the chair allocates.

---

## 8 · WALK CARD — after the founder's rows

**The pulse is the visible one.** Open the app on the walking account. With **zero envelopes**, the masthead is exactly what it was — the number, the greeting, the prose, the signal line, **and nothing beneath it**. Create one envelope with a ceiling; reopen. A hairline appears beneath the signal line, **no words, no figure**. File a receipt into it; the fill moves. Push the envelope past 90% and the fill turns from `inkSoft` to the wine accent.

**Then the member check:** open `/coplanner` as the circle member. **Zero envelope bytes** in the payload — the 08 standard — and the days-to-go number there **matches the bride's exactly**, which is what the fold bought.

**The number's own cure is only observable between 00:00 and 05:30 IST**, and west of Greenwich at any hour. Outside those it is a no-op by construction, and the proof's no-regression cells are the evidence rather than the phone.

Fixture SELECT anchors on the walking account, never a blind LIMIT; fixture SQL carries the same provenance burden as production SQL.

---

*Sequencing beyond this delivery is the founder's.*
