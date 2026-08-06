# TDW_09 · O-2 · THE O-B HOME — EXECUTOR HANDOVER

**Base:** `dreamos-pwa e935a2b` (fetch-verified at origin at every session header; unmoved for the sitting's duration). **dream-os: ZERO BYTES**, as chartered. **Under:** R-X22's amended Model 1 · R-X23's three zones · CE-195 rulings R-O12 → R-O21.

---

## 1 · WHAT SHIPPED

**The plumbing limb (R-O12 / R-O15 / R-O17 — the sitting's headline cure).**
Both zone-1 readers — `GreetingLine` and `Ledger` — now read `TodayResponse.open_leads_count` off the engine plane. The old read was `context.new_leads.length`, served by `vendor/context.js` off `public.leads` — a different table, filtered `state='new'`, capped at `.limit(5)`. **Founder-witnessed 2026-08-06: eleven live enquiries, five rendered.** F-09.49 was never two zones disagreeing; it was a lid the vendor could not see past on the one figure the screen is built around. Both A3 comments re-authored (F-06.85): the old *"letters stay TYPED"* sentence defended a plane the code no longer reads. `spell()`'s ceiling moved 10 → 20 with its reason in-comment and a reverse pointer to the `.limit(5)` that made ten unreachable for the estate's whole life.

**Zone 2 — WHAT'S WAITING.** One payload (`needs_attention`), ceiling three, `…and N more →` into the leads slice, 44px touch boxes. Four members: unanswered enquiry, overdue invoice, unconfirmed hold, and Discover-pending. Zero-collapse is a `return null` at the byte — there is no "all clear" branch in the file to reach.

**The week strip.** On `this_week` (R-O13) — IST-bounded by its own query, stable `id`s, paid for by zone 2's fetch. Second `return null`. **Its correctness is DECLARED CONDITIONAL in-file** — see §3.

**The first-run chapter.** Both `Example` lines (never `Hint`), tap-to-try, and a retirement predicate written as a named function `isFirstRun` so the acceptance pair can be asserted rather than inferred. It returns **false** when `today` is null: unknown is not empty, so the home never teaches over a pending fetch.

**The rise.** `ChatThread` mounted exactly once, `InputBar` mounted exactly once — the foot is the same bar risen or at rest, which is what makes this one room and not a second chat surface. The raise is `onFocusCapture` on a wrapper div: **zero bytes entered `InputBar` internals or `useChat`.**

**`useTodayData`** (R-O18), seated inside `useVendorData.ts` beside `useCabinetData`, `kind='leads'` + `keySuffix='today'` — the B6-S1 clause used as its author wrote it. Trigger two lives at the caller: a `useEffect` on `context` identity, because `useChat` is off the slice bus (F-09.55).

**Copy, all founder-worded.** `Reply →` · `Remind →` · `Confirm →` · `…and N more →` · `Example` · both exemplar strings · `Ask anything…` (InputBar) · `Ask anything.` (OnboardingOverlay headline; the `:90` body untouched by ruling). **No string on this surface is the executor's.**

**Deletions (R-O14-AMENDED).** `EnquiryCard` and `QUICK_ACTIONS` removed with accounted tombstones; the demo twin-comment re-pointed to *three, not four*. Neither was a control — render count zero, the census is the witness — so R-X30's parity line is untouched.

---

## 2 · WHAT IS PROVEN

| Instrument | Result |
|---|---|
| `scripts/tdw09_home.proof.mjs` @ cured | **67/67 green** (52 cure · 15 guard) |
| same bench @ pristine `e935a2b` | **15/67** — every one of the 52 cure cells RED, the 15 greens are exactly the labelled guards |
| `npx tsc --noEmit` on the applied tree | **exit 0, zero `error TS`** |
| Floor, all twelve | landing **98** · type **16** · surface **51** · roles **37** · money **18** · palette **18** · theme_retire **16** · p3_landing **89** · console **55** · factory **45** · invite_spent **14** · prospects_console **54** — every number matching the kickoff |

**What the bench cannot see, stated rather than implied.** These are source-property cells. The home is a `'use client'` module whose zone logic is private, so no node process can call it without exporting internals this sitting has no ruling to export. **The bench proves the functions exist, are wired, collapse on empty, carry the founder's exact bytes, and read the engine plane. It does not prove pixels.** The founder's walk against mock frame 2 is the evidence for that and it outranks this file: a green here with a red walk means the walk is right.

---

## 2b · THE WALK REJECTED THE FIRST BUILD — what broke and why the bench missed it

The founder walked v1 and the home was wrong in every way he could see. **One mistake, three symptoms.**

`ChatThread` carries `flex: 1` (`ChatThread.tsx:74`) and was the **only growing child** of the home's column. Moving it into a `position:absolute; inset:0; zIndex:40` risen room removed the grower and nothing replaced it, so the column collapsed to content height. From that single fact:

1. **The chat was never full screen** — `inset: 0` sized to the collapsed parent, not the viewport.
2. **The input bar floated over the thread** and clipped the last message — it sat in normal flow at `zIndex:41` above an overlay whose parent had no height; at rest it stranded mid-screen with dead space beneath, made obvious by the `position:fixed` books handle staying pinned.
3. **The rise swallowed the chrome** — an `inset:0` overlay covers `Header` and the mode pill, so Studio / AI / Discover were unreachable from inside the chat.

**The cure is flow, not a bigger overlay.** The risen room is now a plain flex child with `flex: 1`; at rest a spacer eats the slack; the InputBar is the last flex child in both states, so it is a foot in both. No absolute positioning and no z-index remain in this sitting's code.

Also caught on the walk: the greeting spelled one half of its sentence and printed the other as a digit — *"Nine letters await you this morning, and 5 invoices remain."* Pre-existing at `:144`, surfaced by R-O17 pushing the letters into words the invoices never used. Both halves now run through `spell()`. **This moves a rendered byte** — "5 invoices" becomes "five invoices" — and it is flagged for the founder's word rather than assumed.

**Why the bench passed a build the walk rejected.** §2's blind-spot paragraph predicted exactly this: source-property cells cannot see pixels. Predicting a failure is not the same as preventing one. §12 and §13 were added afterward — they assert the structural invariants whose absence produced every symptom (no overlay, a grower at rest, a growing room, chrome outside the risen branch, one register per sentence). They would have gone red on v1. **The founder's walk outranking the instrument is not a formality in this estate; it is the thing that happened.**

## 3 · WHAT IS CONDITIONAL — read before accepting

**The week strip and the unconfirmed-hold line are correct ONLY once the dream-os micro's fourth limb deploys (F-09.53, R-O16-AMENDED).** `vendor-engine/today.js`'s events query does not filter `deleted_at`, while the day-sheet covenant (`vendor/day.js:59` — *"deleted_at + cancelled: the covenant, read side, every events read"*) and `vendor/context.js:88` both do. On the shipped home that means **two readers of `public.events` stacked on one screen with different deletion behaviour**: the Next cell hides a soft-deleted engagement while the strip beneath it shows the same row. Founder-witnessed 2026-08-06: zero soft-deleted rows, so the leak is **unexercised, not absent**. The declaration lives in the file itself, and a bench cell asserts the declaration is there — because a build that shipped this silently would have looked green and been wrong.

---

## 4 · THE ACCEPTANCE WALK — derived against real state, not hoped

Fixture derived from founder-run SQL, 2026-08-06.

**On `+919888294440` (Dev Test Studio) — 12 lead binders, `Rs 2,00,000` owed across 1 open binder, 0 overdue, 0 events this week:**
1. Open `/vendor` → the home, three zones. **Letters reads 12** (it read 5 before this ZIP — that delta *is* the cure).
2. The greeting reads **"Twelve letters await you this…"** — R-O17's ceiling doing its job on the first account ever to pass ten.
3. Owed reads **`Rs 2,00,000`** · `from your binders · 1 open` — a sentence that is true for the first time.
4. Zone 2 shows enquiry lines with `Reply →`. **Overdue and hold lines are ABSENT** — both zero; that absence *is* the zero-collapse cell, walkable.
5. **The week strip is ABSENT** — the week is empty. Its present-arm is bench-only on this account.
6. Tap a waiting line → the room rises, the input carries the draft.
7. Dismiss (the grabber) → the home is intact beneath.

**On `+919643158825` (Vaishnavi gupta co) — 0 binders, 0 events, `next_cell_rows = 0`:**
8. The first-run frame on a **true `0 · — · —`** ledger, zone 2 rendering nothing, two `Example` lines beneath. Tap one → it seeds the input.

---

## 5 · DISCLOSURES — five, all in-band

**№1** Path slip (`/tmp/work` vs `/home/claude/work`); caught by the failing command, no output affected.

**№2** I asserted `/api/v2/vendor/today` read legacy tables, from `vendor-engine/today.js:5`'s comment, and began a finding on it. The mount at `vendor/core.js:26` proves it flipped to the engine. I stopped at the citer's boundary instead of reading to the mount — independent-method clause 2, broken inside a session whose kickoff names it. **F-09.50 exists because I made the error the file invites.**

**№3** I told the chair the home *already shipped* an `onInject` control at `page.tsx:381`. It does not — `EnquiryCard` is defined and never rendered. I read the definition and never checked for a render site. **That claim became R-O14's ground.**

**№4** I asserted `this_week` was "IST-7-day-bounded by construction" without having read the query. It verified true. A claim that fed a ruling and happened to land is still a claim made with no check run.

**№5** I authored `useTodayData` as a standalone file importing `useLoader`/`LoadState` from `useVendorData.ts`. Both are module-private; **it would not have compiled.** Withdrawn pre-delivery and re-homed inside the module, which is also the truer pattern.

**The self-diagnosis, banked:** *I stop at the boundary the file offers.* Three specimens (№2 the mount, №3 the render site, №4 the query). The cure adopted mid-sitting — walk every cite to its consumer — is what produced **F-09.53**, the finding that would otherwise have put a deleted wedding on a vendor's home screen. Two counter-specimens the record also keeps: the Cabinet anchor, where I declared my grep's failure mode as a silent miss rather than declaring the handle absent (it resolved exactly), and the `discover_request_state` walk, where shaping the member from its type name would have tested for `'pending'` — **a word the server never writes.**

**Two things the bench caught in itself, and one in the build.** The first bench run went red on two of its own cells because this build's comments *say* the phrases they forbid — a check that cannot tell code from prose about code is not a check, so `codeOf` strips both comment forms now, each pass earned by a red. The red arm then exposed **one cure cell green at both tips** — `has(HOOKS, "'leads',")` matched `useLeadsData`, which has carried that string since long before this sitting; scoped to `useTodayData`'s own body. And the floor caught the build: **type went 16/16 → 13/16** because zone 2's first cut used sizes 17, 15 and 14. All three snapped to named rungs, weight now carried by colour.

---

## 6 · WHAT THE NEXT SITTING PICKS UP

- **The dream-os micro, four limbs** — `waitlist.js` retirement · F-09.48 both-roles pin-status · F-09.50's lying header · **limb four, the `deleted_at` clause this ZIP's week strip leans on.**
- **F-09.55's true cure** — `invalidateSlice('leads')` at `useChat.ts:176`. A W-1 opening; rides the soul sitting's lawful window, never O-2. Its DERIVED-NOT-WITNESSED consequence (the Cabinet stale after a chat-filed client) awaits a witness and must not be upgraded from inference.
- **F-09.57** — passed engagements keep `state='upcoming'`; invisible to O-2 by the `.gte` filters, homed to the events-lifecycle owner.
- **F-09.56's `:90` body** stays by ruling; noted so nobody re-opens it as an oversight.
- **PeekNav and ModePill** are Phase β's, untouched here.

**Findings minted this sitting:** F-09.49 (amended with founder-witnessed live damage) · F-09.50 · F-09.51 · F-09.52 · F-09.53 · F-09.54 · F-09.55 · F-09.56 · F-09.57. **High-water .57, next free .58.**

Sequencing beyond this sitting is the founder's.
