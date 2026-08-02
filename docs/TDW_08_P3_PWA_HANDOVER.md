# TDW_08 · P3 — THE SEEING SURFACE · pwa ARM · HANDOVER

**Base:** `dreamos-pwa @ 3524d8d` · **depends on `dream-os @ 97166b1`, already pushed** (the mirror reads `card`; the tease reads `budget_max`).
**Rulings:** the read-first ruling · Deltas I–III · the founder's G-4 amendment · the census ruling · the copy freeze + FORK A release · the (a-narrow′) ruling.
**This file rides the ZIP.** Not a CE entry, not `FINDINGS_LOG.md`, not the masterplan.

---

## 1 · WHAT SHIPPED

| File | State |
|---|---|
| `app/demo/vendor/[handle]/page.tsx` | **REBUILT** — three movements, scrolling |
| `app/demo/vendor/[handle]/studio/page.tsx` | `DemoCommandBar` **deleted whole** (104 lines); its reason left in place |
| `lib/demo/api.ts` | `DemoLead` corrected to the wire; `card` typed on `fetchDemoVendor`; F-08.30 named |
| `hooks/demo/useDemoVendorData.ts` | F-08.34 — nine phantom reads → stated constants; the `as Lead` cast removed |
| `components/frost/EnquirySheet.tsx` | the demo band posts; the row stays read-only; the half-true paragraph amended |
| `scripts/tdw08_p3_landing.proof.mjs` | **NEW — 59/59** |
| `scripts/tdw07_p4b_body.proof.mjs` | §7.4 **inverted**, labelled |
| `scripts/tdw07_f0760_claim.proof.mjs` | four cells **amended**, labelled, 82 preserved |

---

## 2 · THE THREE MOVEMENTS

**The mirror** renders `VendorProfileView` over the **server's** `card` — the same `shapeDemoRow` the couple feed calls. Under *This is how couples see you.* a client-shaped object would have made the sentence false at the data layer while it read true on screen.

**`mode='preview'`, and `onPreviewToast` is supplied because the ruling says so, not as a courtesy.** Without it an Enquire or Circle tap dies silently — the dead-control class this block deleted the CommandBar for. `onEnquire` / `enquireLink` / `onCircleTap` are withheld, **and the server agrees by construction**: `shapeDemoRow` nulls `routing_handle` and `enquire_link` together, so the shaper cannot hand this card a live target even if the mount forgot. Proven at dream-os `§5.6`, not trusted.

**The tease.** Three nulls, one rule — budget, month, city all **omit**. The facts line is built as a **list**, so an absent fact is absent rather than an empty segment between separators. Zero leads collapses the movement entirely; **three of five live demo cards are in that state today**, so the collapse is the modal experience, not the fallback.

**The claim CTA is the page's one gold fill**, asserted as *exactly one* `#C9A84C` fill on the screen. `Enter Your Studio` demotes to the heavier ghost (44px, brighter border) and `Explore Discover` keeps its original lighter weight — the hierarchy is carried by weight, never by a second gold. The pre-existing gold **accents** are untouched: that drift is filed, pre-existing, and deliberately not smuggled in.

**The page scrolls.** `position:fixed` + `overflow:hidden` were the two bytes that made three movements impossible, and both are gone.

---

## 3 · WHAT THE `?claim=1` PRESERVATION ACTUALLY PRESERVED

The original block did two things: `setEntered(true)` and `setClaimOpen(true)`. **The collapsed strip no longer exists**, so the first is a dead setState. The half that carried the contract — a deep link, a bookmark, or the WhatsApp alert's `{{3}}` opens the claim sheet — is preserved exactly, and the file says so at the site rather than leaving a future reader to find the diff and mistrust the ruling.

`tdw07_f0760_claim`'s §7.6 asserted the literal phrase **BYTE-UNTOUCHED** at that consumer. It is no longer byte-untouched. Keeping the word would have made the record lie about itself to protect a cell, so the cell now asserts the **ruling** and an honest account of the delta. A comment that stays true is worth more than one that stays identical.

---

## 4 · F-08.34 — WHAT THE TYPE WAS HIDING

`DemoLead` declared **twelve** fields. **Three** were true. **Nine** were phantom, and **three** the route actually sends were undeclared. It compiled because *the type was what made it compile*.

`useDemoVendorData` read five of the phantoms and got `undefined` for every one. **The subtitle under every bride's name on `/discover/leads` has been permanently empty since F-07.41's mask landed** — `l.bride_wedding_city` against a wire that sends `wedding_city`. `tsc` named that fix itself the moment the type stopped lying.

**Both silencers died in one act:** the type, and the `} as Lead)` cast that would have kept the compiler quiet about the target shape too.

**Every absent field is now a stated constant, never a phantom read.** `state: 'new'` **stays** — and that is the ruling, not a shortcut. `demo_leads` has fifteen columns and no state column, and no mechanism exists to action or book a demo lead, so the zeros the two counters render are **structurally true today**. Removing the constant would have flipped *Actioned* from a permanent 0 to a permanent 9 under a label the vendor reads as a measurement — a declared gap that gets worse the moment you declare it. It ships with `§F0834` standing over it.

---

## 5 · COUNT MOVEMENTS AND LABELLED AMENDMENTS — ALL COUNTS PRESERVED

**`tdw07_p4b_body` — 133, unchanged.** §7.4 asserted `DemoCommandBar is UNTOUCHED and separate`. That was correct when written: P4b's charter had no authority over the demo tree. **This is the sitting that gained it** (「 kill command bar… 」), so the cell is **inverted**, rides the deletion in the same act, and **comment-strips** — because the deletion deliberately leaves a note naming `DemoCommandBar`, and a filename grep would count the note and acquit.

**`tdw07_f0760_claim` — 82, unchanged.** Four cells, one cause: three asserted the dead `setEntered`, one the old faint-link label. §7.2 is **inverted** to *no expand state survives*, which is the load-bearing fact now. §7.4 asserts the new frozen byte **and** the old one's absence — a cell checking only the new byte would pass over a tree carrying both.

---

## 6 · THE FLOOR

`npm ci` rc=0. **tsc TRUE-EXIT ZERO on a cleared `.next`.** Every named line reproduced: `f0772_circle` 128 · `auth_crossover` 46 · `f0766` 28 · `f0770` 104 · `f0774` 35/35 · `p1` 43 · `p2` 48 · `p3` 117 · `p4a` 69 · `slice1` 30 · `probe` 33 · **`body` 133** · **`f0760` 82** · `f06133` 41 · `p6_fold` 68 · `m3_chip` GREEN · `f0790` 37 · `f0784` 34 · `f0789` 30 · plus `f04_94`, `f04_96`, `f0539_demo_authority` GREEN. **NEW: `tdw08_p3_landing` 59/59.**

**Named skips:** the seven `scripts/*.proof.ts` runners — not on the chair's list, not run. `tdw_stripper_census.mjs` rc=0, emits no count; a census, not a bench. **`tdw_f0774_vacuity_probe` runs GREEN here** because the sweep restores the tree between scripts; on a dirty tree it refuses by design.

---

## 7 · TWO EXECUTOR MISSES, ON THE RECORD

**MISS 1 — my own bench shipped a vacuous cell and its own mutation caught it.** §1.3 asserted the zero-storage declaration was present. **That phrase has two homes on the landing** — the G-6 header note and the beacon's own — so deleting either left the cell green. A cell that survives the deletion of the thing it guards is not a guard. Both homes are asserted separately now. **The mutation section did the job re-reading could not**, for the second time in this sitting.

**MISS 2 — a throwing mutation aborted the run mid-section.** The first `§M` failure killed the process and published a partial count, which is worse than a red. Mutations now fail their own cell.

---

## 8 · THE FOUNDER'S SMOKE CARD — ONE WALK, RECONCILED STEP BY STEP

**It is ONE walk, not two: zero budgets exist estate-wide**, so the budget step needs a fresh enquiry through the amended sheet. The sheet change and the tease render are witnessed together or the budget step has no thumb-path.

**FIXTURE STATE OF RECORD** (founder-pasted rows, 2026-08-03, not memory): 12 demo vendors · 19 leads · 8 active · 5 in feed. **The walk drives `legacy_jewellers`** — active, eligible, `expired`, **9 leads / 9 cities / 1 month / 0 budgets**, handset `918700521064`. **No shared-`4440` row is touched**: `makeupbyswatiroy` and `swati` are both `active=false` and unreachable from the landing by construction (`getDemoVendor` filters `active`).

| # | Step | What to look for | Build item it proves |
|---|---|---|---|
| 1 | Open `thedreamwedding.in/demo/vendor/legacy_jewellers` **on your phone** | The page **scrolls**. Your photos, then your name, then *This is how couples see you…* | movements one, the scroll |
| 2 | Read the card under the eyebrow | Category · city · your name · **no money line anywhere** | the mirror; the money seam |
| 3 | Tap **Enquire**, then **Circle** | A line appears at the bottom each time and stays long enough to read. **Neither opens WhatsApp.** | `mode='preview'` + `onPreviewToast`; withheld handlers |
| 4 | Tap **Lock Date** | Nothing happens; it shows *beta*. **This is correct** — it is disabled on the couple's card too | Lock Date byte-untouched |
| 5 | Scroll to the tease | *9 couples are waiting*. Cards show a masked name; **eight of nine show a city only** — no month, and **no budget line at all** | the three nulls; the count line |
| 6 | Scroll on | *Explore your studio*, then **Enter Your Studio** (outline), **Explore Discover** (fainter), then eight chips | G-5 demotion; the two-ghost hierarchy |
| 7 | Tap **Team Hub** | Lands on the **Business** screen, not a team screen | the chip-target correction |
| 8 | Back, then tap **Enter Your Studio** | The studio opens **with no command bar** at the top | F-08.1 |
| 9 | Back to the landing. The gold button is fixed at the bottom the whole time | Only **one** gold button on the screen | one gold per screen |
| 10 | **Enquire as your test bride** on Legacy Jewellers in Discover, **choosing a budget band** | The band row is read-only and shows your band | the sheet posts, stays read-only |
| 11 | Reload the landing, look at the newest tease card | **`Budget up to Rs …`** — grouped digits, the word Rs, **no ₹ and no L/K** | `0108` + `formatRs` |
| 12 | Open `…/demo/vendor/legacy_jewellers?claim=1` | The claim sheet opens by itself | CE-118 C1 preserved |
| 13 | Tap the gold button; enter a number; dismiss by tapping outside | Sheet behaves exactly as before | `DemoClaimSheet` untouched |

**THUMB-PATH GAPS, NAMED (card-reconciliation clause).** Step 5's *zero-lead collapse* has **no thumb-path on this account** — `legacy_jewellers` has nine leads. To see it, open `…/demo/vendor/rajat-singania` (0 leads, live in the feed): **the tease section should be absent entirely, with no gap and no message.** That is a second URL, not a second walk.

**G-6's DEVICE MATRIX RIDES THIS WALK AND HAS NEVER BEEN WITNESSED:** iOS Safari · Android Chrome · **the Instagram in-app browser** (vendors open this from an IG DM). Steps 1–9 in each. **This is the only part of P3 nothing in this container can prove.**

**The live witness is the FOUNDER's, declared-not-claimed.** Nothing above is asserted by me as having happened.

---

## 9 · ROLLBACK

```bash
git revert --no-edit <this ZIP's commit hash>
```

Pure client revert; no schema, no data. **What a revert restores that you may not want:** the one-screen landing, `DemoCommandBar` on the demo studio, the lying `DemoLead`, and the permanently-empty subtitle on `/discover/leads`. The dream-os arm is independent and stays.

---

## 10 · WHAT THE NEXT SITTING PICKS UP

`/list`'s bare index is still the **one** orphan — C(c), filed not deleted, and `§4.7` asserts it stays so a future tidy is a decision. **F-08.32** (`about` unfiltered) and **F-08.34** (the constant) ship declared with witnesses over them. **F-08.30**'s fourth duplicate type is named where it lives and dies with `fetchDemoDiscoverFeed`, whose caller count is still zero. `middleware.ts:47` still rewrites to `/demo/not-found`, which still does not exist — CE-118's inheritance, and P3 did not give it a destination.
