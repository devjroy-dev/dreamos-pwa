# TDW_09 · F-09.32 · F-09.33 · F-09.34 · F-09.35 — THE SURFACE SITTING · EXECUTOR HANDOVER

**Base:** dreamos-pwa `8066072` · dream-os `5eb2309`, both re-derived at origin fetch-first at session open.
**Under:** the twenty-third chair's TDW_09 LE kickoff (CE-194), as ruled at **R-S1–R-S7** and amended at **R-S1-AMENDED** on the founder's 「 Vendor lane plus demo 」.
**This ZIP moves dreamos-pwa bytes only. Zero dream-os bytes. Zero soul/lens/prompt/engine bytes — W-1 trivially clean, this being a pwa sitting.**
**Copy inventory: EXPECTED-ZERO, and zero as shipped.** No user-facing string is added, changed or removed. The nine `<option>` labels are asserted byte-identical by cell.

---

## 1 · WHAT SHIPPED

| Path | What |
|---|---|
| `lib/vendor/theme.ts` | R-S3 — the field boundary raised to the 3:1 UI bar on **both** themes |
| `app/globals.css` | R-S3 + **F-09.35** — the same value in the pre-mount home, both blocks |
| `lib/vendor/ThemeContext.tsx` | `--atelier-section-bg` published (additive; nothing read it before) |
| `lib/vendor/controls.ts` | **NEW** — R-S4's shared select affordance, chevron in `currentColor` |
| `scripts/tdw09_surface_census.mjs` | **NEW** — the census + mapper, normalized numeric parse |
| `scripts/tdw09_surface.proof.mjs` | **NEW** — the sitting's bench, 51 cells, 8 mutations |
| 13 vendor + demo surfaces | the sweep: literals retired onto the roles that were minted for them |
| `scripts/tdw08_p3_landing.proof.mjs` | R-S5 — F-09.29 and F-09.31 amendments, counts preserved |
| `scripts/tdw08_console.proof.mjs` | R-S5 — F-09.30 arms (a)+(b) |
| `docs/TDW_09_F0932_SURFACE_HANDOVER.md` | this file |

---

## 2 · THE FINDINGS THIS SITTING CARRIES

**F-09.32, amended to its true name (R-S2): a HALF-FINISHED ADOPTION.** `theme.ts` authored `inputBg`, `inputBorder`, `inkMute`, `sheet` and `scrim`, solved each per theme, and named the Edit Member sheet in its own comment as the specimen that produced `sheet` and `scrim`. The sheet then adopted two of them and stopped. The founder's console line — `getComputedStyle(...).getPropertyValue('--atelier-ink-mute')` returning the correct Paper value on an unreadable page — is the cleanest evidence in the record that the roles were innocent.

**F-09.33 (R-S4): the dropdown with no affordance.** Styled-native. The OS picker is unchanged; the chevron is drawn as an inline SVG data-URI stroked in `currentColor`, so it inherits the field's ink and themes for free.

**F-09.34, MINTED THIS SITTING: the doubled border shorthand.** A const holding `'0.5px solid var(--atelier-card-border)'` re-prefixed at the point of use produces `0.5px solid 0.5px solid var(…)`, which parses, then becomes **invalid at computed-value time** once `var()` substitutes, and computes to `border-style: none`. **22 sites across 5 files rendered no edge at all.** The chair's kickoff had measured a 20%-alpha hairline; there was no hairline. Convicted visually in the founder's own screenshot: REMOVE and SEND PAGE sit adjacent with identical geometry, REMOVE interpolates `D.red` (a colour, valid) and shows its box, SEND PAGE interpolates `D.border` and does not.

**Its second shape, which the obvious cure would have created.** Five further sites used the const **bare**, where the full shorthand was correct. Flipping the const to colour-only in one line per file — the tempting fix — would have cured 22 and silently broken those 5 into the identical disease. `team-payments:230` is the sharpest: `0.5px solid ${ternary ? literal : D.border}` rendered an edge on one branch and none on the other. **Cure shape: the const is colour-only AND renamed `border` → `borderCol`, so any reader I failed to migrate is a tsc error rather than an invisible border.** A failure mode that is loud.

**F-09.35, MINTED: two homes, two values.** `theme.ts:151` held `rgba(122,56,40,0.28)` while `globals.css:747` held `rgba(122,56,40,0.22)` — so the frames before React mounts rendered a boundary the token owner did not hold. Espresso agreed across both homes; Paper alone diverged. Found while owning a mis-read of my own, and the mis-read is what exposed it.

**F-09.36, MINTED: two whole vendor pages render blank on Editorial Paper.** `/vendor/studio/tasks` and `/vendor/studio/team-payments`, founder-walk-convicted 2026-08-05. Three species stacked: the card literal composites to white on a white page, the labels to 1.03:1, the borders do not render. **Fixture state derived before the finding was worded:** both surfaces hold zero rows, so no live data was being hidden — the finding is *empty surface that also swallows its own empty-state*, not *data loss*. Worded down on evidence rather than left overstated.

**F-09.37, FILED NOT BUILT: fourteen more affordance-stripped selects in the vendor lane** (collab ×2, tds ×2, featured ×2, tasks ×2, team-payments ×3, AddSheet, plus demo mirrors). R-S4 ruled the nine-option Role select. The helper is built and one-line-adoptable. **A fork arm is ruled or it is not built.**

**Range:** F-09.34–.37 allocated from the chair-issued F-09.34–.50. High-water re-derived across the whole docs tree at origin before allocation (F-09.28 committed; .29–.33 chair-held). **Next free: F-09.38.**

---

## 3 · THE NUMBERS, EACH WITH ITS DERIVATION

Every ratio is computed by the bench from the values it reads out of production `theme.ts`, composited *page → +scrim → +sheet*, and compared against the bar. **No cell asserts an alpha** (R-S3, verbatim).

```
ESPRESSO  page #1F1612 → +scrim #090705 → +sheet #120F0E
   field edge   was rgba(201,168,76,0.28) → #453A1F  1.71:1   FAIL 3:1
                now rgba(201,168,76,0.52) → #715F2E  3.06:1   PASS
   field fill   rgba(245,235,212,0.04)    → #1B1816  1.08:1   (why the EDGE is load-bearing)
   label        was rgba(248,247,245,0.45) →          4.31:1   FAIL 4.5 — it failed on espresso too
                now inkMute                →          5.71:1   PASS

PAPER     page #F5F2EE → +scrim #A8A39E → +sheet #FFFFFF
   field edge   was rgba(122,56,40,0.28)  → #DAC7C3  1.62:1   FAIL 3:1
                now rgba(122,56,40,0.58)  → #B28C82  3.03:1   PASS
   field fill   rgba(26,15,8,0.04)        → #F6F5F5  1.09:1   the fill CANNOT carry the box here
   label        was rgba(248,247,245,0.45) →          1.03:1   invisible, not dim
                now inkMute                →          7.07:1   PASS
```

**The retired label literal failed the body bar on BOTH themes.** The kickoff read Espresso as sound; it measures 4.31:1 on 9px labels. Espresso hid the species less *visibly*, not less *really*. §2.3 asserts that permanently: if it ever passes, the literal was not the defect and this sitting misdiagnosed.

---

## 4 · THE FLOOR — PAIRED, STATED

| Bench | At `8066072` | At the cured tree |
|---|---|---|
| tdw09_money | 18/18 | **18/18** byte-stable |
| tdw09_palette | 18/18 | **18/18** byte-stable |
| tdw09_theme_retire | 16/16 | **16/16** byte-stable |
| tdw09_roles | 37/37 | **37/37** byte-stable |
| tdw08_p4_factory | 45/45 | **45/45** byte-stable |
| tdw08_p5_invite_spent | 14/14 | **14/14** byte-stable |
| tdw08_p5_prospects_console | 54/54 | **54/54** byte-stable |
| tdw08_p3_landing | **RED 85/88** | **GREEN 88/88** — count preserved, cells re-aimed |
| tdw08_console | **CRASH (ENOENT)** | **GREEN 55/55** — first completing run |
| **tdw09_surface** (new) | **24/51 — 27 RED** | **GREEN 51/51** |
| `tsc --noEmit`, cleared `.next` | exit 0 | **exit 0, zero output** |

**Both-ways is over production code, never test setup.** The eight mutation cells rewrite `theme.ts`, `globals.css` and the sheet itself, assert the guarded cell reds, and restore. The reference clone at `8066072` was verified byte-clean after the run.

**Labelled amendments, counts stated:**
- **F-09.29 · §9.3** — regex re-aimed `isFlair` → `isLight`. Behaviour re-verified intact before the re-aim. 1 cell, still 1.
- **F-09.31 · §2.7 + §M.3** — `#C9A84C` → `var(--role-metal)`; on the pinned-dark lane `DARK.metal` **is** `#C9A84C`, so the CTA renders byte-identical brass. **The pager-dot discrimination is inherited, not re-invented:** the cell has always counted only the direct no-space `background:'…'` form; the pager dot at `:321` is a spaced ternary and the wordmark at `:314` is `color:`, so neither matched before and neither matches now. Reasoning is in-comment so the next reader does not "fix" it. 2 cells, still 2.
- **F-09.30 · console** — arm (b): the reader refuses with a named reason on a stale read set. Arm (a): the F-09.20-retired `_list.tsx` leaves the read set and the two cells that stood on it are removed rather than re-pointed, since no surviving surface carries the second application they guarded. §1.8's census survives because it asserted the *property*, never the file, and is re-aimed 2 → 1. **No prior count exists to preserve — this harness crashed before printing a total at `8066072`.** Stated that way rather than inventing a delta from a run that never finished.

---

## 5 · THE CENSUS INSTRUMENT (R-S1 · PROPERTY-OVER-ROSTER)

`scripts/tdw09_surface_census.mjs`, runnable from any working directory via `TDW_PWA`, refuses with a named reason outside a pwa clone and refuses on a `package.json` name that is not `web`.

It finds the species by **normalized numeric parse** — every `rgba()` resolved to four numbers and compared arithmetically — because a spelling-roster misses spaced variants and misses `.css` entirely. **In-lane, 80 species sites: 72 cured, 8 left, every leftover carrying a named reason** (6 decorative sheens with no legibility bearing, 2 already theme-aware at the site). Re-running `--apply` now maps zero: idempotent.

**A ratify-or-reverse deviation, disclosed:** the demo **landing** is held out of the sweep, against R-S1-AMENDED's "4 demo mirrors". Grounds, encoded in the file so they are arguable: it renders under `pinned="dark"` so Editorial Paper never reaches it and there is no legibility to win; it is a founder-vetoed surface whose palette and CTA hierarchy are asserted byte-for-byte; and it carried 22 of the demo lane's sites. Migrating it would have re-weighted two ratified ghost buttons — their near-white edge maps to an *ink* rung, the wrong role for a control edge — for nothing a reader sees. **Reversed by deleting one array.**

**The mapping, stated so it can be argued with.** Where the file's own key names a role (`muted`, `low`, `card`) the key wins. Where it does not, near-white ink is matched to the **nearest authored alpha** in the DARK ink ladder (midpoints 0.825 / 0.615 / 0.550 / 0.445), and white tint is classified by the property it sits on — a control edge takes the 3:1 boundary role, a field fill takes `inputBg`, a faint panel takes `sectionBg`.

---

## 6 · CONTROL INVENTORY (CE-115/116) — ALL KEPT, NONE MOVED OR REMOVED

Thirteen controls asserted present by cell: Name · Role select · Phone · Rate · Notes · Send page · Rotate link · Rotate cancel · Rotate confirm · Remove · Save · scrim dismiss · FAB. The Assignments block remains **read-only** — no second write path to the calendar; the one-writer law's own comment is asserted in place. **Walked against a real account** (`+919888294440`, Dev Test Studio, prestige, members Rahul and Swati), not a fixture.

**Money register untouched (R-U4):** `Rate per event (Rs)` byte-exact, `Rs {…toLocaleString('en-IN')} per event` unchanged, zero glyphs and zero shorthand asserted by cell.

---

## 7 · DISCLOSURES, BY NAME — MINE, NOT INHERITED

**D-1 · My mapper's first rewrite silently skipped nested literals.** It matched the quoted form `'rgba(…)'`, which cures a standalone fill and skips a colour nested inside `'0.5px solid rgba(…)'` — **while still counting it as mapped.** A check whose failure mode is a silent *success* is worse than none. Caught only by running `--apply` twice and finding the census non-idempotent. Named first because it is the worst thing in this ZIP.

**D-2 · Two mutation cells went vacuously green on the first run.** The bench read `theme.ts` once at module load, so a mutation of production source could not reach the reader under test. The mutation section caught a defect in the bench that owns it. Cured by re-reading per call, with the reason in-comment.

**D-3 · A mutation anchor matched twice.** `backgroundColor: 'var(--atelier-input-bg)'` is read by both the field fill and the avatar circle. `okMutate` refused on the non-unique anchor rather than mutating the first hit — which is the only reason it surfaced.

**D-4 · My border sweep over-reported by one file.** It flagged `TipsCarousel.tsx`, whose `p.border` is colour-only and correctly prefixed; the regex had picked up an unrelated `border:` elsewhere in the file. Five files, not six. The bench's detector is now object-scoped so it cannot repeat the error.

**D-5 · My site counts were line counts.** "42 + 25 sites" reached R-S1-AMENDED from my own earlier grep, which counted matching *lines*. The occurrence count is **80** in-lane. The ruling inherited my bad number.

**D-6 · The fixture block's ordering defect was mine.** I shipped two statements with the blocking tier question first; the Supabase editor renders only the last result, so the answer I most needed was discarded. The founder ran exactly what I handed him. Every block since is a single statement.

**D-7 · No browser was reachable from this container.** F-09.34's mechanism is derived from the CSS Variables spec's invalid-at-computed-value-time rule, not observed. I loaded a real CSS parser to check it independently and it accepted the doubled string — correct behaviour, and therefore **no evidence at all**, since its failure mode is silent acceptance. Declared rather than presented as a check. **The settling witness is the founder's device**, and his screenshot supplied it.

---

## 8 · WHAT IS NOT DONE

- **F-09.37** — the fourteen remaining affordance-stripped selects. Filed, unbuilt, awaiting a ruling.
- **The frost, landing and admin lanes** — the near-white family lives largely there (48 / 41 / 3 sites). Frost has its own token file; a sweep across it is a different cure and its own charter.
- **The fragile idiom, watched not swept:** `AddSheet.tsx` and the three calendar sheets declare a border const the same way F-09.34's five did, but use it **correctly** today. Migrating working code would risk a regression for no legibility gain. Named so it is not rediscovered.
- **The `503` on `vendor:1`** across every screenshot of the founder's walk. Backend, not theme, not this sitting's. Flagged so it is not lost.

---

## 9 · THE FOUNDER SMOKE CARD

Authored from the pasted rows. You perform and paste; I read the evidence.

**Editorial Paper**
1. Open the vendor app as **Dev Test Studio**, theme set to **Editorial Paper**.
2. **Studio → Team.** Rahul and Swati, two rows, a visible hairline between them.
3. Tap **Rahul**. The Edit Member sheet opens.
4. Are the five field boxes — Name, Role, Phone, Rate per event (Rs), Notes — visible as boxes, each with an edge you can see without hunting?
5. Are the labels above them readable?
6. Does the **Role** field look like a dropdown before you touch it? Tap it once — the phone's own picker should open.
7. Scroll to **Assignments**: `No assignments yet.` should be legible. Then **Crew page**: SEND PAGE and ROTATE LINK should both read, and both should have boxes.
8. Close without saving. Then visit **Studio → Tasks** and **Studio → Team payments**: both are empty, and their empty lines and tabs should now be readable rather than blank.

**Espresso**
9. Switch to Espresso and repeat steps 2–7. Verdict unchanged, and nothing should look *heavier* than before — if the field edges now read as too strong for your eye, say so and the value re-tunes at your word; the ≥3:1 floor stays law either way.

**Paste**
10. One screenshot per theme of the open sheet, plus one sentence: does the Role field read as a dropdown on the handset.

**Steps with no thumb-path, named rather than written:** `Send page` (neither member has a phone; the link would open with no recipient) and `Rotate link` (irreversible on a real token, and it buys no legibility evidence). Both are proven by cell instead. The Assignments *with rows* state is not witnessable on this account — declared gap.

---

## 10 · APPLY

Line 1 of the paste block is the repo line; the head guard is the block's first command; the §7 chain is verbatim; the verify line ends in the STOP sentence; the git line is its own paste-block.

Sequencing beyond this sitting is the founder's.
