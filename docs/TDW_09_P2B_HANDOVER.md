# TDW_09 · PACKAGE 2 · PHASE B — THE PROFILE STORY + THE TAG FOLD · HANDOVER

**Under:** CE-24 · relays #1/#4 (F-4(a) · F-5(a) · F-6(a) · F-7 · normalisation law · tolerate-on-read) · relay #5 ten lists FOUNDER-VETOED whole · founder words 2026-08-07 「 pushed and ok 」 = room-word veto + live counts YES + V1 「 couples who enquired 」 + V2 「 shared weddings with other vendors 」.
**Two ZIPs, disjoint by repo.** dream-os base `798fc19` · pwa base `8715a69` (+P2-R1 if pushed first — apply order: **dream-os → pwa**; both sides tolerate the other's old version meanwhile by construction).

## SHIPPED — dream-os (`TDW_09_P2B_VOCAB_OS.zip`)
`src/lib/shared/tagVocabulary.js` NEW — the bound mirror (ten vetoed lists; header names the pwa source + the arbiter) · `me.js` normalises `aesthetic_tags` at the ONE write door before the allowlist stores · `discover.js` normalises vibes before `.overlaps` (raw-split overlaps gone) · `scripts/tdw09_p2b_vocab_os.proof.mjs` **18/18** (lists · trim+case-fold · dedupe · both doors · write-precedes-update proven · no-backfill). Both-ways: me.js reverted → 2 red · discover.js → 2 red. Requires clean; dry-run at `798fc19` green.

## SHIPPED — pwa (`TDW_09_P2B_PROFILE_TAGS.zip`)
1. **`lib/shared/tagVocabulary.ts` NEW** — the home: ten lists verbatim, `other` list-free, normalizeTag/Tags, vocabularyFor, isVocabularyTag.
2. **`scripts/tdw09_p2b_vocab.proof.mjs` NEW — THE ARBITER, 16/16**: cross-repo term-for-term parity (sibling via `../dream-os` or `$TDW_DREAMOS`); absent sibling → named-refusal reds; one-byte case mutation → red; refuse-never-crash shimmed on its own home too.
3. **Wizard (F-4(a))**: reads the bio via useSettings, seeds once; prefilled rate/tags render as REVIEW under the vetoed 「 From your bio — edit there 」(×2, stripped-count-proven); only gaps collect; `AESTHETIC_OPTIONS` retired onto the home; chips per category; ONE custom input + the vetoed honesty byte; submit normalises. A complete vendor walks confirm-and-pitch.
4. **Profile editor**: the second free-text comma field retired → `TagEditor` (vocab chips · dashed custom chips · one custom input · honesty byte); save normalises; state stays the comma-string so isDirty/markSaved are untouched.
5. **Storefront §1 (F-3(a))**: vetoed heading 「 Complete your bio 」 + **the one meter** — model+arc MOVED (never rewritten) to `lib/vendor/profileMeter.ts` + `components/vendor/ProfileMeter.tsx`, profile page imports back, inputs byte-for-byte the profile's own reads — + bio row with the drawer's vetoed 「 How couples see you 」 + live counts (approved/pending photos; `open_leads_count`, the ledger's own figure) + V1/V2 descriptions.
6. **Frost (F-6(a))**: `DISC_VIBES` retired; no category → vetoed 「 Pick a category to filter by vibe 」; picked → that category's vetoed list (display→key map; unmapped honestly chip-free); **stated movement**: switching category clears vibes so stale terms never reach the filter.
7. **Benches**: `tdw09_p2b.proof.mjs` **29/29** (both-ways: submit 9 red · profile 6 · storefront 7 · sanctuary 5 · home deleted → arbiter 15 red + p2b refuses).

**Labelled amendment (ratify-or-revert):** p4b_body §6.8 follows the rate predicate into the moved model (property unchanged: min-only, `partial:false`; import-back asserted; mutation-proven RED on a flipped byte) — **133/133**.

**Floor at delivery:** pwa tsc 0 · doors 86/86 · r1 13/13 · canon 24/24 · home 67/67 · roles 131 · money 18 · palette 18 · walkrider 20 · surface 51 · p4b_body 133/133 · standing reds (F-10.62 deck 191/193 · F-10.49 stripper 33/35) unmoved. dream-os requires clean + os bench 18/18.

## DISCLOSURES
1. `git checkout` wiped my cured me.js during both-ways (RIDER4 §0.2's confessed habit, mine now); re-derived, cured copies banked before further reverts.
2. My both-ways deletion of the pwa vocab home crashed the arbiter + p2b (readFileSync throw) — arbiter shimmed refuse-never-crash; the home byte-recreated.
3. p2b cell 1.4 first counted a COMMENT citation of the review line as a render; amended to the stripped read, in-bench rationale.
4. Ranking note (stated, never smuggled): profileScore's tags TERM is untouched — normalisation can only change a score where duplicate-case tags previously double-counted toward MIN_TAGS (now deduped: honest count). Frost blind-mode untouched.

## FOUNDER SMOKE (one phone session with any Phase-A remainder)
① Storefront: §1 shows 「 Complete your bio 」 + your arc + 「 x photos live · y leads waiting 」; Leads/Collab rows wear their new lines; bio row opens your profile in ≤2 taps (acceptance B④). ② Profile → Aesthetic tags: chips for your category; add a custom word → dashed chip + the honesty line; Save; reopen — case-folded. ③ Submit wizard: rate + tags arrive as 「 From your bio — edit there 」; only pitch asks. ④ Frost sanctuary filter: Vibe says 「 Pick a category to filter by vibe 」; pick Photographers → the ten vetoed terms; pick one, apply — vendors with that tag (any stored case) return.
