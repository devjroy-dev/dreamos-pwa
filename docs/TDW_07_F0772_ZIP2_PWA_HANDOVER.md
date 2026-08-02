# TDW_07 · F-07.72 — THE CIRCLE-LANE AUTH SITTING · ZIP 2 (dreamos-pwa): THE LANDING

**Base:** `dreamos-pwa @ 25d1fb7` · **Paired dream-os ZIP:** `tdw07_f0772_zip2_dreamos` on `a63f1ae`
**APPLY ORDER: dream-os FIRST, then this one.** Applied the other way this code is inert — nothing returns 401 yet — which is safe but wastes the walk.
This document rides the ZIP. It is **not** a CE entry and touches neither `FINDINGS_LOG.md` nor the masterplan.

> **THIS ZIP DOES NOT ENFORCE ANYTHING. IT CATCHES.** The server half makes eleven doors refuse; these bytes exist so that a refusal reaches a human being instead of an empty screen. **Enforcement without a landing is a security fix that breaks a real person's screen and does not tell her.**

---

## 1 · WHAT SHIPPED

| File | Change |
|---|---|
| `app/coplanner/CircleSessionContext.tsx` | **FORK B — the refusal's one home.** `circleRefused()` + `CIRCLE_REFUSAL_EVENT`, beside the credential's own home. |
| `app/coplanner/layout.tsx` | The 401 body moves out to that home; a **separate** listener effect turns the event into UI state. |
| `page.tsx` · `threads/page.tsx` · `threads/[threadId]/page.tsx` (×2) · `muse/page.tsx` · `muse/AddMuseSheet.tsx` · `dreamai/page.tsx` (×2) | Every co-planner fetch reads the refusal. |
| `app/circle/join/[token]/page.tsx` | **The named exception**, with its reason in the file. |
| `app/(frost)/frost/canvas/sanctuary/page.tsx` | **FORK A(c) — the bride's landing.** The founder's byte, the composer replaced, her text restored. |
| `scripts/tdw07_f0772_circle.proof.mjs` | §9 + six mutations. **81 → 102**, labeled. |
| `scripts/tdw07_f0766_orphan.proof.mjs` | §5.4's census amended three → four, by name. **28 → 28**, count preserved. |

---

## 2 · FORK B — A HAZARD THIS DELIVERY CREATES IS THIS DELIVERY'S TO CLOSE

Until ZIP 2, **no circle door returned 401**, so a credential could not go stale underneath an open app. It can now. And `layout.tsx`'s hydration refresh — the lane's only 401 reader — runs **once, at mount**, with an empty dependency array.

Without a one-home refusal, a token dying mid-session would leave every screen silently empty: each fetch takes its `d.success` falsy branch and renders an empty state, so the member sees an app that has forgotten her wedding, with no path back to the PIN screen short of a manual reload. The CE's framing binds: a pre-existing hazard may be named and deferred; **one this delivery creates may not.**

**Why an event and not a context setter:** the screens are siblings of `layout.tsx`, not children of state it exposes, and the join page lives outside the layout entirely. A window event is the one carrier every caller already has, and it keeps the module free of React state so a plain fetch helper can use it.

**A refusal and a blip are still not the same event.** ONLY 401 signs her out; a 500, a timeout, an offline phone keep the cached session exactly as this file has always behaved. **403 is deliberately not a sign-out** — the server distinguishes them, and a PIN screen cannot restore a membership the bride revoked; sending her there would be a loop she cannot win.

**THE JOIN PAGE IS THE NAMED EXCEPTION.** `circleRefused()` *clears* the credential — right on every screen reading a stale one, wrong on the one holding a token minted ninety seconds earlier at `/accept`. A 401 there means the mint and the guard disagree, not that her session went stale, and throwing away a fresh credential would strand a brand-new member on a sign-in screen she has no PIN for yet. It falls through to the toast, and `§9.5` asserts both the absence and the reason.

---

## 3 · FORK A(c) — THE BRIDE, AND WHY HER REFUSAL IS THE WORST KIND

She is not a `circle_members` row. The shared doors admit her through the resolver's couple arm, and only while her JWT resolves. **A stale JWT, an ITP wipe, a signed-out browser — all three worked before this delivery** (the server ignored her header and served the couple id in the path) **and all three are 401 now.** There is no route guard on sanctuary; `middleware.ts` passes `/frost/*` straight through.

And her refusal is invisible by construction: her poll's `d?.ok` guard means a refusal never calls `setChatMsgs`, so **the last messages she loaded sit on screen refreshing every ten seconds, looking live**, while her sends vanish — the POST's response was discarded.

**THE FOUNDER'S BYTE, executed in chat 2026-08-02 and frozen:**

> 「 Sign in again to see and send Circle messages. 」

It **replaces** the composer rather than sitting above it: a box she can type into but cannot send is the vanishing-message failure with extra steps. On a refused send her text goes back into the box. Only 401 locks; the lock **clears** when the credential comes back, because it is a state and not a tombstone.

---

## 4 · CONTROL INVENTORY — CE-115's law, armed by Fork A(c)

**`app/(frost)/frost/canvas/sanctuary/page.tsx` — the circle chat block**

- **KEPT** — the message input · the send affordance · the optimistic append · the ten-second poll · the activity/message merge · 「 You 」 on her own bubbles (F-07.107's KEPT control, and `§9.15` is the cell that catches it as collateral) · every empty state.
- **CHANGED** — the poll now reads `res.status` before `res.json()` · the send now reads its response instead of discarding it.
- **ADDED** — `chatLocked`, and the landing that renders in the composer's place.
- **REMOVED-BY-RULING** — none.
- **UNREACHABLE-BY-DESIGN in the locked state** — the input and the send affordance. That is the ruling, not an oversight: they are restored the moment the poll succeeds again.
- **CLAUSE 2 (the verbs):** send · poll · optimistic-append · lock · unlock · restore-text. The last three are new; the first three are unmoved.
- **CLAUSE 3:** the surface is walked against the real couple row on the founder's card, not a fixture.

**`app/coplanner/layout.tsx`**

- **KEPT** — every control ZIP 1 inventoried: phone input · `+91` · `Continue →` · Enter-to-submit · the four PIN inputs and their focus advance · **the auto-submit verb** · the captions · the step machine · the error slot · B2's expired sentence.
- **CHANGED** — the hydration refresh delegates its 401 body to the one home.
- **ADDED** — the listener effect.
- **REMOVED-BY-RULING** — none. `clearCircleToken` leaves this file's imports because its body moved, not because the behaviour did.

**The eight co-planner fetch sites:** zero controls added, moved or removed. One branch each.

---

## 5 · A CENSUS THAT REALLY MOVED — `tdw07_f0766_orphan` §5.4, three → four

Vocabulary 4 (`circle_session`, tokenless) had **exactly three** consumer files, pinned by the ARC-2 handover and by that cell. It now has **four**: Fork B's one home must clear the cached session as well as the credential, so `CircleSessionContext.tsx` is a genuine fourth consumer. The file already held the credential; it now holds the un-holding.

**This is not the ZIP-1 movement and the distinction is why the cell is worth keeping.** That one was 3 → 4 on a *comment* — prose counted as code — and the cure was to strip. This one is 3 → 4 on a `removeItem` call, and the honest answer is to move the number and say why. The set is now asserted **by name** as well as by count, so a fifth consumer or the wrong fourth reddens. The ARC-2 handover's "exactly three" is superseded here, in ink, rather than by a silent edit.

---

## 6 · FLOOR AT DELIVERY — `npm ci` first, `rm -rf .next` before tsc, exit captured not piped

`tsc --noEmit` **ZERO** (true exit 0, cleared `.next`).

**`tdw07_f0772_circle` 102/102 cured · 81/102 at the uncured client tree, TWENTY-ONE RED · 19/19 mutations RED across process boundaries, all restored byte-identical.**

| Proof | Was | Now | Why |
|---|---|---|---|
| `tdw07_f0772_circle` | 64→81 | **102** | §9 (15 cells) + six mutations. **§6.1/§6.2 re-aimed, count preserved** — they pinned the 401 branch's ADDRESS inside `layout.tsx`; Fork B moved the behaviour to its one home and the cells follow the behaviour, not the address. CE-119's class, the one `b07_f0784_panel` paid for at ZIP 1. What they claim is unchanged. |
| `tdw07_f0766_orphan` | 28 | **28** | §5.4 amended by label, count preserved. See §5. |

**Byte-stable at CE-127's counts:** `auth_crossover 46` · `f0770 104` · `f0774 35/35` · `p1 43` · `p2 48` · `p3 117` · `p4a 69` · `slice1 30` · `probe 33` · `body 133` · `f0760 82` · `f06133 41` · `p6_fold 68` · `m3_chip GREEN` · `f0790 37` · `f0784 34` · `f0789 30`.

**The stripper census oracle, re-run:** the shipped module still disagrees with the compiler on **10 files, unchanged from CE-124** — F-07.102/103's escalation trigger is **not** met, and `sanctuary` was already among the ten before this ZIP touched it. The retired rule's contrast figure moved 134 → 138 with files added to the tree since CE-124; it is a contrast number, not a floor.

`tdw_f0774_vacuity_probe` refuses on a dirty tree, by design. Run it after the push, not before.

---

## 7 · THE FOUNDER SMOKE CARD

**Authored from the banked fixture rows of 2026-08-02 and CE-127's walk. Nothing is invented.**

**Fixture state of record:** one active circle member — **Mehek**, `+918757788550`, `users.id 3c8eb9e0-e746-4d95-9630-17897aa64f05`, couple `9f1f84d5-e688-4d4f-9e44-9f5da6315e52`, `pin_set = true`. The group thread born at CE-127 is `dm:c527f228-…`; her private thread with Mira is `2c49c2d7-…` and stays where it is. **The three refuse targets** are real `users.id` rows that are **not** circle members: `ec4232ae-d670-4538-ab65-0be9f51a37af` · `df9b11c2-6d50-42bc-8c4f-d565b57c7dce` · `3c22d190-4344-400c-a5db-bfc89015a634`.

**THE SHAPE OF THIS WALK: PROVE THE ADMIT BEFORE THE REFUSE.** A lane that refuses everyone would pass a refuse-first card perfectly. Steps 1–4 are the admit and they come first; the refusal is step 5.

**ROLLBACK, before you start — one command in the dream-os repo root:**
```
git revert --no-edit HEAD && git push
```
Railway rebuilds and every door opens again. **Use it the moment a door refuses the wrong person.** You do not need to revert the pwa: without the server half its code never fires.

---

**Step 0 — the variable, before anything.** Railway → the service running `src/index.js` → Variables → confirm **`CIRCLE_SESSION_SECRET` is still there** from ZIP 1. *Evidence: the row exists; do not open or paste the value.* **If it is missing, every co-planner door will 401 including Mehek's — that is the one outage this ZIP can cause by configuration alone.** Then confirm both services are green after the push.

**Step 1 — Mehek signs in.** On your phone, open the co-planner as Mehek. If she is already signed in from ZIP 1's walk, pull to refresh; if she is asked for a PIN, enter `8757788550` and her 4-digit PIN. *Evidence: you land in the Circle and her name and the bride's name are on screen.* **This is the step that matters most — it is the whole lane proving it still admits the one person who belongs in it.**

**Step 2 — every co-planner screen, including Muse.** Tap through: home (the activity feed) → Threads → open the group thread → Muse. *Evidence: each screen loads its content; the Muse board shows its tiles.* **Muse is named separately on purpose: before this ZIP that door had no check of any kind, so it is the one screen where "it worked before" tells you nothing.**

**Step 3 — she sends a message.** In the group thread, send one. *Evidence: it appears with her name on it.*

**Step 4 — the bride's sanctuary chat, both directions.** Open Frost as the bride on couple `9f1f84d5…`, go to the Circle. *Evidence: Mehek's step-3 message is there.* Send one back. *Evidence: it appears, and it appears on Mehek's Circle too.* **She is not a circle member and she must never be refused here — this is the hazard the whole delivery is shaped around.**

**Step 5 — only now, the refusal.** In a terminal, run each of the three. *Expected: each returns `401` and `{"success":false,"error":"Unauthorised."}` — where at ZIP 1's walk they returned 200 with a real member's name, couple and role.*

```
curl -s -o /dev/null -w "%{http_code}\n" https://dream-os-production.up.railway.app/api/v2/circle/session/ec4232ae-d670-4538-ab65-0be9f51a37af
```

```
curl -s -o /dev/null -w "%{http_code}\n" https://dream-os-production.up.railway.app/api/v2/circle/session/df9b11c2-6d50-42bc-8c4f-d565b57c7dce
```

```
curl -s -i https://dream-os-production.up.railway.app/api/v2/circle/session/3c22d190-4344-400c-a5db-bfc89015a634
```

**Step 6 — the door the bench could not drive (F-07.115's, and Fork C's reason).** *Expected: `401`, where before this ZIP it returned a member's entire private conversation with Mira.*

```
curl -s -o /dev/null -w "%{http_code}\n" https://dream-os-production.up.railway.app/api/v2/dreamai/circle-member-history/3c8eb9e0-e746-4d95-9630-17897aa64f05
```

**Step 7 — the Muse door that had nothing.** *Expected: `401`.*

```
curl -s -o /dev/null -w "%{http_code}\n" https://dream-os-production.up.railway.app/api/v2/circle/muse/9f1f84d5-e688-4d4f-9e44-9f5da6315e52
```

**Step 8 — the stale path, on Mehek's side.** On her Circle → Settings → Sign out, then reopen the co-planner. *Evidence: the PIN screen, and — because the app knows the credential was refused rather than merely absent — the sentence 「 Your sign-in expired. Enter your PIN again. 」 where the credential had been cleared mid-session. Sign back in and confirm step 2 still works.*

**Step 9 — the stale path, on the bride's side.** In Frost, open dev tools → Application → clear the couple session (or sign the bride out), then open the Circle. *Evidence: where the composer was, the line 「 Sign in again to see and send Circle messages. 」 — and no box that pretends it can send. Sign back in; the composer returns on the next ten-second poll without a reload.*

**Paste back:** step 5's three status lines and the third command's headers · step 6's and step 7's status · a screenshot of step 9's line.

**Not witnessable on this walk, and named rather than assumed:** the 403 path (it needs a membership revoked in the database, and there is one live member) · the couple-binding refusal (it needs one phone active in two circles, and the one-number-one-circle rule at both join gates now prevents that) · F-07.113's log line, which is a Railway log line and not a screen.

---

## 8 · WHAT COMES NEXT

1. You apply both ZIPs, **dream-os first**, and push each.
2. You walk §7 and paste back what it asks for.
3. **F-07.115** — Mira's keyless lock, next sitting. Fork E means it now lands in one place.
4. **The two parked partial unique indexes** (CE-125's + F-07.112's R-b), sequenced together by you or not at all.
5. **F-07.108's secret rotation** — still outstanding, still yours.
6. **F-07.117** stands open: two refusal envelope families, one lane.
7. **F-07.114** — the crashing bench, disclosed and uncured.
