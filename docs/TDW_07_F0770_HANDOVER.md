# TDW_07 · THE F-07.70 MICRO — dreamos-pwa handover

**Base:** `1d4ec80` · **Repo:** dreamos-pwa ONLY · no paired dream-os delivery.
This document rides the ZIP. It is **not** a CE entry and touches neither `FINDINGS_LOG.md` nor the masterplan.

---

## 1 · WHAT SHIPPED

| File | Change |
|---|---|
| `app/(frost)/frost/canvas/sanctuary/page.tsx` | The whole micro: the one-door helper (A′-iii), twelve token adoptions (A1), six couple-id adoptions, fork B2's guard + the parity byte, the ruled comment amendment, and F-07.73's C1 + C′. |
| `scripts/tdw_f0770_authority.proof.mjs` | **NEW** — 92/92, twenty production-source mutations RED across process boundaries. |
| `scripts/tdw07_p6_fold.proof.mjs` | **ONE LABELED RE-AIM** of §11.3, count held 60/60. See §4. |

**Copy inventory, final: ONE moved byte, ZERO new.** `Session expired. Please sign in again.` — the founder's frozen string, byte-identical to its four siblings, now spoken at the moments-upload site (replacing the bare twin) and at fork B2's guard (the new site, founder-approved verbatim `yes`). Cells `§6.2`/`§6.3` prove the identity by **extraction from `app/(auth)/couple/onboarding/page.tsx`**, not by eye, so a drift on either side reddens. F-07.73 adds **zero** — the approved pair renders through the existing branch untouched.

---

## 2 · ⚠ FIVE EXECUTOR DISCLOSURES — read before ruling on the seal

None of these were worked around. All five are in the tree, in the cells, or both.

**(a) A SEVENTH FALLBACK SITE, adopted by inclusion.** The ruling named six sites carrying `bare || s?.token || s?.access_token`. The meridian chat site spells the same thing differently (`bare || raw.access_token`) and my read-first's shape-match missed it. Leaving it direct would have made the boundary cell carry an excuse. It adopts the same helper; the reason stands in-comment at the site and in the proof's §11 disclosure block.

**(b) "ELEVEN" COUPLE-ID SITES WAS WRONG — THERE ARE SIX.** My read-first claimed eleven of the eighteen blob reads do the `s?.coupleId||s?.id` dance and the CE ratified that number. Derived by command at build: **five** full dances plus the expenses site's narrower `.id`-only variant = **six**. This is my miscount, not the chair's. `§4.3` asserts the derived six; the count is disclosed rather than padded.

**(c) FORK B2'S BOUNCE IS DELAYED 1600 ms, and this is my call, not a ruled one.** `window.location.replace` is a hard navigation: a toast painted in the same tick is destroyed before it renders. The ruling said the guard *shows* the byte as it bounces, and an invisible sentence is the silent bounce with extra code. The delay is the shortest that lets the byte land. `SanctuaryPage` had no toast of its own — the file's four other toasts belong to rooms — so a shell toast was added, its render shape **copied from `MomentsRoom`'s** rather than invented. **Submitted for ratification.**

**(d) +1 LINT ERROR, from the copied shape.** The file carries 352 lint problems at base and 353 after. The one addition is `textTransform:'uppercase' as any` inside the copied toast — the same error class the file's four existing toasts each carry. Fixing it would have made the new toast the only one spelled differently. Named, not smoothed.

**(e) TWO GUARDS DELIBERATELY KEPT, TWO DELIBERATELY DROPPED.** At pages-create and moments-upload the `if(!raw) return` blob guard is **kept** — it is each caller's only "is she signed in" test and the token check can no longer stand in for it now that a token may arrive without a blob (moments-upload's guard also carries its own distinct copy). At pages-load and moments-load the same guard is **dropped**, because the `!coupleId||!token` line directly beneath it turns away exactly the same brides and sets the same state. Each choice is reasoned in-comment at its site.

---

## 3 · ONE FINDING MINTED — NOT THIS MICRO'S TO CURE

**F-07.74 · THE COMMENT STRIPPER SWALLOWS LIVE CODE IN SANCTUARY.** The stripper inherited by every proof in this estate treats any `/*` as a block-comment opener. `sanctuary/page.tsx` carries `accept="image/*"` on the moments file input; the line-comment pass leaves it standing, and that `/*` then opens a false block that runs to the next real `*/`.

**Derived, by command, at this tip: 6,519 characters of live sanctuary code are invisible to the inherited stripper** — the largest single false block swallowing 3,739 characters, including the entire concierge request site.

**This is the vacuous-green class, exactly.** Absence-cells ask whether something is gone; a stripper that deletes a region answers "gone" for anything hiding inside it. My own `§1.1` boundary count would have read zero over code it never saw. It was caught only because `§3.10` asserts a **presence** in the swallowed range and went red on first run.

**Three sealed benches share the exposure, derived by command:** `tdw07_p1_discover`, `tdw07_p6_fold`, `tdw07_p4b_body` — each reads `sanctuary/page.tsx` with the inherited stripper. **I have not touched them.** Their greens are not wrong; the question is whether any of their absence-cells sit over the swallowed 6.5 KB, and that audit is a sitting, not a line.

`tdw_f0770_authority.proof.mjs` carries the amendment (a `/*` opens a comment only at line start or after a delimiter) **and a `§0` CANARY** — head, waist and tail anchors that must survive stripping, so any future swallow reddens instead of acquitting.

---

## 4 · THE ONE SEALED-BENCH RE-AIM, labeled

`tdw07_p6_fold` `§11.3` asserted the empty-state split as the literal `{hasActiveFilters ? (`. C′ changed that spelling by ruling. The cell's **subject** — two situations get two sentences, chosen by whether her filters are up — is unchanged and still true; only its spelling moved. Re-aimed at the mechanism per the mechanism-not-resemblance test, with the **retired spelling kept as a tripwire arm** (CE-119's inked pattern): if the pre-F-07.73 condition ever returns, the cell reddens, because its return *is* the regression.

**Count held at 60/60 — nothing added, nothing retired.** Proven both ways by mutating production source: un-gated → `RED 59/60`, restored byte-identical → `GREEN 60/60`.

Block 07's seals are not reopened: no production cell of the fold is touched, and no amended comment of the fold is altered.

---

## 5 · FLOOR AT DELIVERY — re-derived whole on the cured tree, sequential

`npm ci` first. `tsc --noEmit` captured to file, true exit code.

```
tsc --noEmit ........... EXIT 0, ZERO lines
p1_discover .......  35/35     f0760_claim .......  76/76
p2_profile ........  42/42     f06133_drawer .....  41/41   (ALL GREEN banner)
p3_portfolio ......  111/111   m3_report_chip ....  ALL GREEN
p4a_ig ............  63/63     p6_fold ...........  60/60   ← one labeled re-aim, §4
p4b_slice1 ........  24/24     auth_crossover ....  30/30
p4b_probe .........  27/27     f0766_orphan ......  21/21
p4b_body ..........  125/125   f0770_authority ...  92/92   ← NEW, 20/20 mutations RED
```

**Map movement, disclosed:** `tdw06_m3_report_chip` was in the tree but absent from the kickoff's §5 map; it was run at read-first and again here, and **joins the map** per the CE's word. Twelve map lines byte-stable, one re-aimed at held count, one new. Known-reds: none in this repo's map.

---

## 6 · FENCES HELD

`lib/frost-api/_base.ts`, `lib/frost/tokens.ts`, `app/demo/bride/page.tsx`, `app/(auth)/couple/onboarding/page.tsx`, `app/(frost)/frost/canvas/onboarding/page.tsx`, `app/layout.tsx` — **read-only all sitting, zero bytes touched.** W-1: zero soul bytes. No SQL was chartered and none was authored.

**Filed, not cured, and travelling with an owner:** the sign-out sweep clears `couple_last_path` and `couple_app_mode`, both with zero readers estate-wide (`§9.4` pins the state) · `@frost.home_mode_manual` is an unhomed sibling of two keys `tokens.ts` exports properly, exempt here because `app/layout.tsx` reads it cross-file (`§9.3` pins the exemption's ground, so if that reader dies the exemption reddens) · the three module-level blob helpers still read storage directly — **p1 §4.14's remainder, declared not cured** (`§9.5`), out of the token family and out of this micro's ruling · the dual `_base` import (alias at `:3`, relative at `:41`) flagged and untouched.

---

## 7 · THE ERRATUM BLOCK — five chair corrections for the seal entry

Committed ink is corrected forward, never rewritten. All five derived by command at `dreamos-pwa 1d4ec80` / `dream-os acd5085`:

1. CE-119 names the bare twin at `sanctuary:3118`. It is **`:3186`** at the fold's tip. The kickoff had it right.
2. CE-119 names sanctuary's inherited storage bytes at `:43–:45`. They are **`:54–:56`** post-fold. (`p1 §4.14`'s retirement paragraph carries the same `:43-:45`, and its own inner sentence says `:38-40` — a third value.)
3. The kickoff's §2 says **three** sibling sites speak the full vetoed byte. There are **four**, across two files: `(auth)/couple/onboarding:122,:154` and `(frost)/canvas/onboarding:85,:126`.
4. The kickoff's §2 says **~24** `couple_session` touches. Derived: **22 code touches / 18 reads** (25 raw grep hits, three of them prose).
5. CE-119's committed line numbers drifted under the fold's own deltas between authoring and push — items 1 and 2 are two faces of that one cause, named so the next chair reads the class, not just the two instances.

---

## 8 · THE FOUNDER'S CARD — plain steps, founder performs and pastes, the LE reads the evidence

Test vendor account: **9888294440**. Bride account: **+919625759924**.

1. On the handset, sign in as the **bride** and open Sanctuary. *(Evidence: the countdown, her name, the rooms — everything loads exactly as it did yesterday. This step is the regression check and it is the most important one.)*
2. Open **Moments**, **Pages**, **Circle** and **Meridian** in turn; send one Meridian message. *(Evidence: each room loads its content and the chat replies. These are four of the twelve adopted sites; if any went quiet, stop and paste.)*
3. Open **Discover** and swipe **up** through the whole deck to the last card, then once more. *(Evidence: you reach a screen reading **That's everyone, for now.** with **CHECK BACK SOON** beneath. Before today the deck simply stopped moving and said nothing.)*
4. From that end screen, swipe **down**. *(Evidence: you land back on the last vendor card.)*
5. Apply a filter that still returns cards, walk that filtered deck to its end. *(Evidence: you get **That's everyone, for now.** again — NOT "Nothing matches those filters yet.")*
6. Now apply a filter that matches nothing. *(Evidence: **Nothing matches those filters yet.** with **CLEAR FILTERS** beneath. Both sentences exist; each appears only where it is true.)*
7. **The crossed-device check.** In the same browser, without clearing anything, sign in as the **vendor** (9888294440) and land on `/vendor`. Then open Sanctuary directly. *(Evidence: a toast reading **Session expired. Please sign in again.** and then the landing page. **Not** a Sanctuary that loads and sits there half-alive. This is the whole micro in one screen.)*
8. Sign back in as the **bride**. *(Evidence: Sanctuary returns to normal, step 1's state.)*

**Only your device can witness steps 3–8's feel** — the cells prove the wiring and the bytes, never that the room is usable (PROVABLE-EQUIVALENT DOCTRINE). Step 7 is the one that proves F-07.70; step 3 is the one that proves F-07.73.

**Fixture-state precondition, named:** step 3 needs the unfiltered Discover feed to be exhaustible in a reasonable number of swipes. At P6's walk the live feed was **five demo cards** (CE-117's F-07.61 paragraph), which is walkable. If the feed has grown since, step 3 may take longer than a minute — that is a scale note, not a failure.

---

## 9 · WHAT THE NEXT SITTING PICKS UP

- **F-07.74** (§3) — the stripper swallow, and the three sealed benches' exposure audit.
- Ratification of the four disclosures in §2 (a)–(d), the §4 re-aim, and the §7 erratum block.
- Then **F-07.72** per the founder's standing order, then Block 08.

Sequencing beyond this sitting is the founder's.
