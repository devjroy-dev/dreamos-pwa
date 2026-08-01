# TDW_07 · ARC 2 — the orphan join page is deleted

**Base:** `dreamos-pwa @ 62a36a4` · **dream-os: zero bytes** (nothing shipped, floor re-derived for context only)
**Ruled at:** the Arc 2 re-charter — Q1 → **3(d) DELETE**; F-07.72 → **4(d) then 4(a)**, its own sitting.
This document rides the ZIP. It is **not** a CE entry and touches neither `FINDINGS_LOG.md` nor the masterplan.

---

## 1 · ⚠ THE APPLY BLOCK CARRIES AN `rm` — READ BEFORE PASTING

§7's chain is `unzip -o … && cp -r deploy/* . && rm -rf deploy FILE.zip`. **It cannot delete a tracked file** — `cp -r` only adds and overwrites. This delivery therefore ships **one extra line** in the apply block:

```
rm -rf "app/(landing)/join"
```

**A precedented deviation, not a first.** `d2a0ca2` (MICRO-2, 2026-07-31) removed `components/vendor/CommandBar.tsx` — 590 lines, by founder ruling — and TDW_01 removed the vendor mock layer and the orphaned `cover_photos` admin page before that. The chair's ruling described this as the estate's first true file deletion; it isn't, and the ink says the true thing.

The directory is removed, not just the file: **an empty segment directory is still a route in Next.**

---

## 2 · WHAT DIED, AND WHY — the reason-paragraph

`app/(landing)/join/[code]/page.tsx` — 143 lines, `CoJoinPage`.

**Isolation, re-derived at `62a36a4` and not carried forward:**

| Claim | Derivation |
|---|---|
| Zero producers | The only invite-link minter in the estate is `src/api/couple/circle.js:78` → `/circle/join/<token>` |
| Zero inbound | No `/join/` reference anywhere in the pwa outside the living circle route |
| No rewrite | `middleware.ts` has no `/join` handling |
| Retired mount | It posted to `/api/co-planner/*`; dream-os mounts only `/api/v2`, and `API_CONTRACTS.md:492,510` names those routes legacy-replaced |
| Wrong key shape | `{ code }` in the body against a route family keyed on `{ token }` |

**And reading it whole showed it was worse than stale.** It collected **`password` + `confirmPassword`** against a plane that is entirely **PIN-based**, and on success wrote a **`couple_session`** blob plus a **`tdw_couple_session`** cookie — couple-lane session keys for a lane that is **tokenless by design**. It was not a broken page. **It was a page from a design the estate abandoned.**

**Read-first №1's proposed cure would also have been wrong.** That packet proposed `id: d.data.id → d.data.couple_id` and the chair ratified it. Having read the plane: `/accept` mints no JWT, `verifyPin.js:85` returns a bare `userId`, `session/:userId` is a bare GET — a co-planner has no business in `couple_session` under **any** shape. `circle_session` is her home and the living page already puts her there. **The error is owned on both sides of the chair split.**

## 3 · WHAT LIVES, UNTOUCHED — the point of the deletion

`app/circle/join/[token]/page.tsx` — 435 lines, last touched 2026-05-29 — drives the complete living flow: `validate` → `send-otp` → `accept` → `set-pin` → hydrate via `circle/session/:userId`, writing `circle_session` at two points. `app/coplanner/layout.tsx:10` consumes that exact key as `SESSION_KEY`. Every real invitee has always landed here.

**F-07.66 as re-scoped:** not "the co-planner flow, dead at first fetch," but *an orphan legacy join page aimed at a retired mount while the living flow served every real invitee.* **The flow was never sick; a dead twin was wearing its name.**

## 4 · THE CORRECTED CENSUS — FOUR VOCABULARIES, not three

The auth sitting's census named three. It missed one.

| # | Vocabulary | Storage | Lane | Consumers |
|---|---|---|---|---|
| 1 | `couple_session` · `vendor_session` | localStorage | couple / vendor | many |
| 2 | `couple_web_session` · `vendor_web_session` | localStorage | couple / vendor | many |
| 3 | `tdw_couple_session` · `tdw_vendor_session` | cookie | couple / vendor | few |
| 4 | **`circle_session`** | **localStorage, TOKENLESS** | **co-planner** | **exactly three files** |

Pinned by proof cell `§5.4`, so the correction cannot silently regress.

**One census fact the deletion changes:** the orphan was a `couple_session` writer and the **second** writer of the `tdw_couple_session` cookie. After it dies, that cookie is written from exactly **one** site (`sanctuary:3764`) — pinned by `§4.3`.

## 5 · WHY A DELETION GETS A BENCH

`scripts/tdw07_f0766_orphan.proof.mjs` — **21/21.**

A removed file cannot be proven by its own absence: absence is also what a never-applied ZIP looks like. The cells pin the **isolation facts that justified the removal**, so if a future sitting re-creates the page, points a producer at `/join/`, or re-introduces the retired mount, the floor reddens and someone re-reads the header.

**Both-ways, §6:** a deletion cannot be mutated by editing a file that is gone, so the inverse is **re-creation** — the orphan is rebuilt from the minimum bytes reproducing its convicted properties (retired mount, couple-lane write, password field, component name), the cells re-run in a fresh process and go **RED**, then the tree is restored and re-verified. Same law as a source mutation; the uncured state is the file's *presence* rather than its contents.

## 6 · FLOOR AT DELIVERY — whole, sequential, at `62a36a4`

**dreamos-pwa:** `tsc --noEmit` **ZERO** (true exit, captured not piped) · `p1 35 · p2 42 · p3 111 · p4a 63 · slice1 24 · probe 27 · body 125 · f0760 76 · p6_fold 46 · auth_crossover 30 · m3_report_chip GREEN · f06133_drawer 41` · **`f0766_orphan 21` (NEW)**. **All 13 proofs green, zero skipped.**

**dream-os @ `4126845`:** zero bytes ship; floor re-derived for context. `selftest 386` · `meter 28/29` known-red · `f0555 22/23` known-red · `p5 136` · `auth_crossover 24` · CE-114's 28 **all green**.

**Count movements observed at this tip, attributed not claimed:** `p1 37→35`, `body 122→125`, `p5 139→136`. These are **P6's ZIP1 movements**, disclosed and ratified in its own delivery — noted here only so nobody reads them as drift introduced by this ZIP.

## 7 · F-07.72 — the chartered sitting's committed spine

Not built here, by ruling. The census travels for the kickoff's §2:

**The lane is tokenless by design and its own guard was never mounted.** `router.js:67-69` carries the estate's confession in-comment: *"No requireCircleMemberAuth — coplanner sends no JWT. Each endpoint validates via userId/memberUserId/brideId params against circle_members table directly."*

| Door | Trusts | Site |
|---|---|---|
| `/auth/verify-pin` | phone + PIN → returns a bare `userId` **as the session** | `verifyPin.js:85` |
| `/circle/session/:userId` | `req.params.userId` | `session.js:15` |
| `/frost/circle/feed/:brideId` | `req.params.brideId` | `feed.js:16` |
| `/circle/muse` | `req.body.memberUserId` | `muse.js:40` |
| `/frost/circle/threads/:brideId` | `req.params.brideId` | `threads.js:17` |
| `/frost/circle/messages` | `req.body.userId`, `:coupleId` | `messages.js:83,153` |
| `/dreamai/:userId` | `req.params.userId`, `body.primary_user_id` | `dreamai.js:19,65` |
| `/circle/join/*` | the invite token — **the one door that proves something** | — |

**And the cure already exists, unmounted.** `src/api/middleware/requireCircleMemberAuth.js` — 63 lines, verifies a JWT, resolves phone → active `circle_members`, populates `req.circleMember` with the exact permission block `session.js` hand-rolls. `grep` finds it referenced nowhere but in its own file and in `router.js:68`'s comment explaining its absence. **Someone built the cure and the lane went out without it.**

`GET /circle/session/:userId` returns, for any supplied id: the member's name and **phone**, `couple_id`, role, and the **bride's name, wedding date, and partner name.**

## 8 · SEQUENCING

Founder pushes this ZIP. **The auth sitting banks on that push.** Then: Block 07 seal → F-07.70 micro → F-07.72 sitting (4(a) the ruled direction) → Block 08.
