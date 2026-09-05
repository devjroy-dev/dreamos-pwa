# TDW_19 · G1.1c — THE COUPLE'S SWITCH · THE PWA HALF · HANDOVER

**Banked at:** `dreamos-pwa` — this delivery's own commit; cut against `acb68f9`.
**Sibling:** `dream-os 286cdb4` — the door lift (R-G11c.10), applied and pushed by the founder before this ZIP was cut.
**Seat:** LE, code-capable. **Built to:** R-40.30 · R-G11c.7 · R-G11c.8 · **R-G11c.10** (issued this sitting) · the read-first ruling of 2026-09-05.

**This file is CREATED, not amended** — it did not exist at `acb68f9` (drift **d-1**, raised in the read-first and chair-ratified). `docs/TDW_19_G11C_HANDOVER.md` is the dream-os half's and lives in the other repo, untouched.

Every number below was **re-derived by command at the moment of cutting**, not carried from this sitting's narrative. **Live witness is declared, never claimed:** no line here asserts a behaviour observed against the production database or on a device.

---

## H1 · WHAT SHIPPED — six files plus this handover

| File | What |
|---|---|
| `lib/frost/coupleSwitch.ts` | **new.** R-40.30's five bytes, hash-carried, closed set |
| `components/frost/blooms/settings.tsx` | the switch row; `knobOn`; `togglePublish`; the copy import |
| `lib/frost/journey.ts` | `CoupleProfile` +2 required booleans · `MOCK_PROFILE` +2 · `saveProfile`'s patch +1 |
| `scripts/g11c_couple_switch.proof.mjs` | **new.** 36 cells + 6 production-code mutations |
| `scripts/tdw09_frost_parity.proof.mjs` | census amended 201→202, labelled, ratify-or-revert |
| `scripts/floor-manifest-g11c-pwa-switch.txt` | **new.** the declared dirt |

**Zero dream-os bytes** — that half banked separately at `286cdb4`.

---

## H2 · THE ARCHITECTURE — where each fact lives, and who may write it

| Fact | Home | Written by | Read by this room |
|---|---|---|---|
| Her standing answer | `couples.publish_weddings` | `couple_set_publish()` **only** | `GET /couple/me/:id` → `profile.publish_weddings` |
| Does any page of hers exist | derived per request, no column | **nobody** — read-only | the same GET → `profile.has_wedding_page` |
| This page's consent | `weddings.couple_consent` | `couple_set_publish()` + the create seed | **never** |

**There is no `useState` for her answer in `settings.tsx`, and that absence is the feature.** The track is drawn from `profile.publish_weddings` on every render. A local mirror renders correctly on the first paint and drifts the moment the server disagrees — a second opinion about her consent, and consent is the one field where the surface may not hold one.

**No optimistic paint.** A switch that moves before the write lands tells her the answer is recorded when it is not — the never-a-false-done law at a control rather than at a sentence. It moves when the re-read returns; if the write failed it does not move at all.

**The re-read, not the echo** (chair ruling on (iii)). `commitProfile` already re-reads for the date and the budget with its own reason on the record: the server owns the stored shape. `SaveProfileResult` is deliberately unextended — two patterns in one room for one job is how they drift.

**In-flight guard, not a greying.** A second tap while a write is in flight is **dropped**, never queued; a queued tap would send an answer she had already reversed. Nothing about the control's appearance changes — no `disabled`, no dimming, no `pointerEvents`. All three are convicted at the block by §5.

---

## H3 · THE SUB-LINE IS KEYED TO THE PAGE, NEVER TO THE SWITCH

Derived from the ratified frames in the read-first, then ruled: **C1(off) and C2(on) both draw string 4; C3(off) and C4(on) both draw string 5.** The discriminator is `has_wedding_page`, never `publish_weddings`.

It is the single easiest mistake available at this row, so the bench mutates for it twice — M3 hides the no-page state, M4 keys the sub-line to the switch. Both bite. The pairings are also read **out of the mock file itself** (§4's four frame cells), so a re-drawn mock that changed them reds this bench rather than passing unnoticed.

---

## H4 · PROOF — re-derived at the cut

| Instrument | Result |
|---|---|
| `npx tsc --noEmit` | **exit 0**, clean |
| `g11c_couple_switch` bare, fresh sibling | **GREEN — 36 pass, 0 fail** |
| `g11c_couple_switch`, sibling at `3a35567` | **REFUSED, exit 3** — the tip named, never a FAIL |
| `g11c_couple_switch`, fresh sibling + reverted key | **FAIL, exit 1** — `7.2` alone |
| `g11c_couple_switch` mutations | **6 bit, 0 did not**; each sha256-restored |
| `tdw09_frost_parity` (cured tree) | **86 pass, 0 fail** |
| `tdw09_frost_parity` (uncured tree, amended cells) | **RED — 84/86**, exactly 3.1 and 3.2 |
| `run-floor.sh --delivery … --check` | **`FLOOR = NAMED BASE, no delta`** · 23 RED · 1 refusal (`b50_fetch_loop_bench`), out of base by c-39.57 |
| `git status --porcelain` after every run | 7 paths, all declared; `[F-19.16] declared files unmoved — set and contents both verified` |

### `next build` IS REFUSED IN THIS CONTAINER, AND IT IS NOT A RED

`npm run build` fails on four `next/font` fetches to `fonts.googleapis.com`, which is not in this container's network allow-list. **Proven environmental rather than assumed:** the same command at `acb68f9`, with the delivery stashed, fails identically — 20 `Failed to fetch` lines both ways — and **zero** `Type error` / `Module not found` / `Cannot find` lines appear in either run.

`tsc --noEmit` is the sweep and it is green; **`next build` is the gate and this seat does not claim it.** It stands in the founder's verify block. A hollow green here would be worse than this declared gap.

---

## H5 · DISCLOSURE — what this seat got wrong

**e-1 · My control inventory missed a bench, and the floor caught it.** The read-first stated that no bench asserted a control, string or token in this room, derived by grepping `scripts/` for `settings.tsx` and `blooms/settings`. **`tdw09_frost_parity` reaches this file through `dirFiles(BLOOM_DIR)`** — a directory walk no filename grep can see. My check's failure mode was a silent zero, which protocol §9's INDEPENDENT-METHOD LAW names as no check at all, and I wrote "the room's first bench cell of any kind" into the record on the strength of it. H6 is the floor's catch, not this seat's foresight.

**e-2 · My first cut of the bench convicted the wrong element.** `switchBlock` was sliced from `togglePublish}` forward to the next `DreamAi`, which swallowed the edit sheet sitting between them — so §5's three "never greyed" cells read the **Save button's** `disabled` and `opacity` and the sheet's hex literals, and went RED against a switch carrying none of them. A cell that convicts the wrong element is not a stricter cell, it is a broken one. Re-authored to extract the row by **tag balance**, with `2.3a` asserting the bound really holds (`!includes('Save budget')`) so the fix cannot rot back into vacuity.

**e-3 · Two of the four ruled mutations were aimed at cells they do not break**, and the mutation pass said so — `3.2 stayed GREEN`, `3.3 stayed GREEN`. A second home for her answer does not change how the track is *drawn*; widening the patch type does not change the room's *call site*. The mutations were right and my `reds` lists were wrong. Named rather than silently re-pointed, because a mutation pass that never fails is one nobody should trust.

**e-4 · `6.6` convicted the key the ruling put there.** It read 400 characters forward from `SaveProfileResult`'s **name**, which with comments stripped runs clean past the closing brace and into `saveProfile`'s patch type — where `publish_weddings` belongs. Bounded to the interface **body**.

**e-5 · MY BENCH FAILED THE FOUNDER'S VERIFY, AND THE DELIVERY WAS CORRECT.** §7's
four cells went RED on his shell against code that is right. The section guarded
on `existsSync` alone — **"sibling present" as the entire precondition**, which
R-38.20b bans in prose and which is no better encoded in a bench than in a §0.
His pwa container carries a `dream-os` clone from **before this arc**, so the
door it read had never heard of any of this. **F-38.34 exactly**, and I shipped
an instrument that could not tell.

**The tell was inside the failure and it is derivable by command:** cell 7.3's
subject, `publish_weddings: couple.publish_weddings === true`, first landed at
`edb3362` — the BUILD sitting's commit, one before the lift
(`git log -S` on the sibling, run rather than remembered). A tree where **7.3**
reds is a tree older than the whole G1.1c dream-os half, which is a fact about
the clone and not about this delivery.

**Cured as a classifier, not an excuse.** The sibling's HEAD is derived by
`git -C`, and `merge-base --is-ancestor 286cdb4 HEAD` decides: not an ancestor →
**REFUSED (exit 3)**, naming the tip it read and the two commands that fix the
clone; an ancestor but the key absent → still a loud **FAIL**. `merge-base` and
not an equality test, so the next unrelated dream-os push does not become a
refusal here. New cell `7.0` prints the sibling tip on every green run — the
number this section should have been printing from its first line.

**Proven three ways, all run:** fresh sibling → GREEN 36/36 · sibling forced to
`3a35567` (the founder's exact class) → REFUSED with `HEAD 3a35567 — 286cdb4 is
not an ancestor` · fresh sibling with `has_wedding_page` reverted to a literal →
FAIL on `7.2` alone. A refusal that cannot become a failure is an excuse; this
one becomes a failure on demand.

**e-6 · I handed the founder a conditional command beside its primary and he ran it.** The `git clone` alternative shipped in the same message as the sibling refresh; the conditional-withheld rule says it should have been commented-out with its uncomment step stated, or held for a later message. It was harmless only because **git's own guard refused it** — `destination path already exists` — which is luck standing in for discipline.

**e-7 · I designed a probe whose comfortable answer was unfalsifiable.** To test b50's determinism I chained `npm run build` INSIDE a `git stash` block and put the three measurement runs OUTSIDE it, so all three measured the `250d420` build while the tree looked micro-applied. Read at face value it said 3/3 GREEN — which I would have taken as "nondeterministic, the finding is against the instrument", **falsely exonerating my own byte**. It is F-40.70's disease in my own hand, one message after I had quoted the source-versus-artifact gap at myself.

**e-8 · I asserted a result before running it.** *"I expect 3/3 RED."* It came back GREEN, GREEN, RED — neither of the two outcomes I had named. One message after e-7, and the same habit both times: reaching a verdict ahead of the measurement. The catch that matters from that exchange was not mine either way — it was that the earlier n=2-per-side comparison was two samples of a distribution read as two states.

**No orphaned mutation.** Every mutation path sha256-verifies its restore, including the throw path, and `git status` was read after every run (R-40.32).

---

## H6 · THE SEALED CENSUS, AMENDED — `tdw09_frost_parity` 201 → 202

**GREEN at `acb68f9`; this delivery moved it by exactly one.** Derived by `git stash` → re-run → restore, not assumed. The delta decomposes to a single line: **tapdiv 42 → 43**, the switch's own row.

Amended in the same delivery as the code that moved it, itemised control-by-control in that file's own five-amendment pattern, and **both-ways shown**: the amended cells go RED on the uncured tree (84/86) and GREEN on the cured one (86/86).

**Why one control and not two.** The track and knob are `<div>`s with no handler of their own; the row is the affordance and the track is its state made visible. Two handlers would give one answer two doors and let a tap on the row's padding do nothing — the class F-09.107 holds open on the sibling `Row`, ruled the same way here.

**Why a tapdiv and not a `<button>`.** The row it must match is `Row`, which is a tapdiv. A control identical to its neighbours but answering to a different element is how a surface grows two grammars for one gesture.

**Inventory columns for this delivery: 201 KEPT · 1 ADDED · 0 MOVED · 0 REMOVED-BY-RULING.** The room's own nine are every one untouched.

**Ratify or revert.**

---

## H7 · THE FOUNDER'S CARD — R-G11c.7's order (he performs, the seat reads)

`0132` is **already witnessed** (`Success. No rows returned`, at the build sitting's apply). Steps 2–8 are new.

1. **Sign in to the studio as DEV440** and create `verma-reception`'s wedding page. This is where `createWedding` resolves her `couple_id` through the engagements spine. **It must happen before her steps** — otherwise she arrives at a room with nothing to govern.
2. **Run the SQL below.** Evidence the seat reads: `couple_id` non-null.
3. **Sign in as the test couple** (`+919625759924`) → **Settings**.
4. **The switch reads OFF** — value *"Off. Nothing of your wedding is published."*, sub-line *"Turn this off and any published page disappears."* That is the **string-4** sub-line, because she now has a page.
5. **Tap it ON.** Value becomes *"On. Your vendors can publish your wedding page."*
6. **Run the SQL again** — `couple_consent` **true**, `publish_weddings` **true**.
7. **The vendor's page loses "Waiting on the couple's permission"** (#25).
8. **Tap it OFF**, run the SQL a third time — both **false** — and the public page **misses**, indistinguishable from absent.

**What only your glass can witness, named per the provable-equivalent doctrine:** that the row renders at all in Wine Night; that the track moves under a real thumb; that the sub-line wraps without collision at 374 and 390; and that the switch is not greyed. No cell in this delivery claims any of those.

**Expect her REAL row, not the mock's.** The fixture couple's `partner_name`, `wedding_date` and `budget_total` were never read this sitting, so the rows above the switch will read **`Partner`**, **`—`** and **`Not set yet`** where the mock shows Priya & Arjun and Rs 1,20,00,000. That is the room's honest fallback, not a defect.

**One founder-run SQL block, self-contained, zero placeholders.** ONE statement, because the Supabase editor renders only the last result set (F-40.59 / R-40.31). Columns witnessed to `0131:49-70` and `0132:65/83` — `weddings` is absent from `PUBLIC_SCHEMA.md`, so those two migrations are its sole witnesses until the pair regen.

```sql
-- G1.1c walk oracle. Run after step 1, again after step 5, again after step 8.
-- weddings.slug/.visibility/.couple_consent -> 0131:49-70 · weddings.couple_id -> 0132:83
-- couples.publish_weddings                  -> 0132:65
SELECT w.slug,
       w.visibility,
       w.couple_consent,
       w.couple_id,
       c.publish_weddings
  FROM public.weddings w
  LEFT JOIN public.couples c ON c.id = w.couple_id
 WHERE w.slug = 'verma-reception';
```

---

## H8 · OPEN, HANDED FORWARD

- **F-40.69 (number owed) — the delivery floor is structurally blind to the files a delivery ADDS.** `tdw_f3942_census_guard` walks `git ls-files`. In `--delivery` mode a delivery's new files are *untracked*, so the instrument cannot enumerate them: this seat's floor and the founder's both read `retired 213` and both printed `FLOOR = NAMED BASE` — **truthfully, over a tree whose new files the instrument could not see** — and the number became false the instant the delivery was committed (`lib/frost/coupleSwitch.ts` crossed 213→214). Derived three ways: the census is byte-identical with the follow-on micro applied and stashed, and a `git worktree` at `acb68f9` reads 213. R-38.19 says the floor is re-derived at the cut; the cut is pre-commit by construction, and that is the hole.
- **F-40.70 (number owed) — `b50_fetch_loop_bench` cannot tell which build it is measuring.** It guards on `.next/BUILD_ID` *existing* (`:195`) and never on it *matching the tree on disk*. R-38.22 exists for exactly this — a deployed surface a gate reads must stamp its commit, and the gate must refuse a build that is not the tree — and this gate does not implement it. Its own header records the estate being burned by a stale build beside a live source; the cure was never fitted. **Witnessed live this sitting:** three runs read GREEN against a `.next` built inside a `git stash` block while the working tree looked micro-applied.
- **F-40.71 (number owed) — `b50_fetch_loop_bench` is nondeterministic, so its GREEN is not evidence.** GREEN and RED on identical bytes, one build, one machine, minutes apart, with the count itself moving (2× then 3× on `money/invoices`). A varying count is a race, not a code path — a static defect returns a stable number. **Measured baseline, the first the estate has:**

| Build | Chair-ruled samples | Pooled, every correctly-built run this sitting |
|---|---|---|
| this micro | **2 RED / 10** | **5 RED / 15** |
| `250d420` | **0 RED / 10** | **0 RED / 14** |

  Fisher one-tailed: **p = 0.237** on the ruled 10-vs-10, **p = 0.025** pooled. The pooled figure crosses 0.05 and is **not** treated as attribution — pooling across sessions with different machine load and browser-launch counts is precisely how a significance figure gets manufactured, and R-G11c.12 ruled reach first for this reason. What it does suggest is worth stating plainly: **a race's firing rate is timing-sensitive, and timing depends on the whole bundle.** Any byte that changes chunk layout can shift the rate of a pre-existing race without being on its path — which is a different claim from causing it, and a reason the repair needs a rate baseline rather than a pass/fail.
  What it catches when it reds is real and uncured: `useLoader`'s own header describes `run` re-identifying every render and one effect issuing `fetcher(vendorId)` **before** its own `tick` abort check, so a superseded fetch has already left the tab. F-39.46 at small amplitude.

- **F-40.65 (number owed) — the founder's `dreamos-pwa` container carries a `dream-os` sibling from before `edb3362`, and no instrument in that container says so.** `tools/preflight.sh` exists precisely to name both tips (R-38.20b) and was run this sitting **only in the LE container**; his own layout was never derived, which is the witness-path gap the law was written for. The sibling-full benches in this repo therefore read a tree from another month. `g11c_couple_switch` now refuses and names the tip; **every other sibling-full bench in this repo still guards on presence alone** and would fail silently-wrong the same way. A sweep of that class is unruled and not this sitting's.

- **F-40.64 (number owed) — `b16_p1_engagements_bench` is RED at `cdd15fb` and is not in `scripts/floor-base.txt`.** Its failing cells convict `src/lib/vendor/weddings.js` for reading `public.engagements` — exactly the spine the G1.1c build sitting authored. It is visible in the founder's own floor paste at `edb3362` too, so the dream-os floor has not equalled its named base since. Out of the lifted radius; **filed, not fixed**.
- **A failed switch write is SILENT.** The track does not move, which is honest, but nothing says so. The copy set is closed at five and a sixth string is a raised fork, not an authored string, so the gap ships **declared and unruled**.
- **The switch does not render until `fetchProfile` resolves.** A track painted OFF for an unknown answer is a lying control wearing the opposite costume to a greyed one. One round trip on a room she has just opened; named in case the row is seen to arrive a beat late.
- **`b06_gauntlet` is a FOURTH dream-os refusal** (`ANTHROPIC_API_KEY absent`); the dream-os handover's H4 named three.
- **The dream-os floor discovers `scripts/*.js` only** (`run-floor.sh:226`), so every `.proof.mjs` in that repo is outside it — `tdw09_rider2_budget.proof.mjs` carries 2 pre-existing failures nothing measures. **Observation, unruled.**
- **The pair regen** — still owed; `weddings` remains absent from `PUBLIC_SCHEMA.md`.

---

## H9 · PROTOCOL ATTESTATION

§7 and §11 opened and read in full at `cdd15fb`. Apply chain verbatim:
`unzip -o FILE.zip && cp -r deploy/* . && rm -rf deploy FILE.zip`. No dotfiles in `deploy/`. Head-guard keyed on the witnessed `package.json` name — `"name": "web"` — first and alone; STOP; the chain; ONE verify line carrying the D-10 STOP sentence with **`npm run build` as the gate**; the git line as its own paste-block with named files. `git add -A` refused throughout.

**Planes:** zero SQL authored in this delivery. The founder's walk SELECT reads `public` only, zero `engine`; both schema docs opened, and `weddings`' absence from the snapshot is named above rather than inherited.

**LE holds no write credentials.** Nothing here is banked until the founder's push.
