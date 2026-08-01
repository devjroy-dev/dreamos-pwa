# TDW_07 · F-07.72 — THE CIRCLE-LANE AUTH SITTING · ZIP 1 (dreamos-pwa)

**Base:** `dreamos-pwa @ 2d277f4` · **Paired dream-os ZIP:** `tdw07_f0772_dreamos` on `7856ea7`
**APPLY ORDER: dream-os FIRST, then this one.** The server must be able to mint before the client can hold. Applied the other way, the client asks for a token from a door that does not yet issue one — which degrades safely (no token, no header, today's behaviour) but wastes the walk.
This document rides the ZIP. It is **not** a CE entry and touches neither `FINDINGS_LOG.md` nor the masterplan.

**THIS ZIP TEACHES. IT ENFORCES NOTHING.**

---

## 1 · WHAT SHIPPED

| File | Change |
|---|---|
| `app/coplanner/CircleSessionContext.tsx` | The lane's credential authority — `setCircleToken` · `getCircleToken` · `clearCircleToken` · `circleAuthHeaders`. Type minimised alongside the server. |
| `app/coplanner/layout.tsx` | **F-07.104 cured** — the sign-in rewritten. The 401 branch wired (cannot fire this ZIP). |
| `app/circle/join/[token]/page.tsx` | Holds the token from `/accept`. Imports the authority, does not re-implement it. |
| `app/coplanner/settings/page.tsx` | Sign-out clears the credential. |
| `page.tsx` · `dreamai/page.tsx` · `muse/page.tsx` · `muse/AddMuseSheet.tsx` · `threads/page.tsx` · `threads/[threadId]/page.tsx` | Every lane call carries the header. |
| `lib/frost/journey.ts` · `app/(frost)/frost/canvas/sanctuary/page.tsx` | **The bride's four credential-less sites**, taught through the existing accessors. |
| `scripts/tdw07_f0772_circle.proof.mjs` | **NEW. 64/64**, nine process-boundary mutations. |
| `scripts/tdw_auth_crossover.proof.mjs` | The triangle. **36 → 46**, labeled. |
| `scripts/tdw_f0770_authority.proof.mjs` | Two counts amended by label, **104 → 104**. |
| `scripts/tdw07_f0766_orphan.proof.mjs` | §5.4 re-aimed at code; canaries installed. **21 → 28**, labeled. |

## 2 · WHERE THE CREDENTIAL LIVES, AND WHY NOT IN THE BLOB

Cookie `tdw_circle_token`, mirrored to `localStorage.circle_token`, **read cookie-first** — the house law's settled iOS-Safari pattern (§4: *never regress to localStorage-only*). The existing `circle_session` blob stays localStorage-only; it is a session snapshot, not a credential, and it predates the law's application here.

**The token is deliberately NOT inside that blob.** `layout.tsx` overwrites the blob wholesale on every background hydration refresh, from a response that carries no token — a credential kept inside it would be destroyed by a routine refresh. Separate key, separate lifetime. `§1.5` is the cell.

## 3 · THE BRIDE — the census was five, not one

The charter named one bride call site (`sanctuary:2585`, whose Bearer the server had always ignored). The read-first found **five**, and **four sent no credential at all**:

| Site | Door | Before | Now |
|---|---|---|---|
| `sanctuary:2585` | `GET /frost/circle/messages/:coupleId` | Bearer, ignored | **untouched — honoured** |
| `sanctuary:2895` | `POST /frost/circle/messages` | nothing | `coupleAccessToken()` |
| `journey.ts:438` | `GET .../threads/:brideId` | nothing | `circleBrideHeaders()` |
| `journey.ts:448` | `GET .../threads/.../messages` | nothing | `circleBrideHeaders()` |
| `journey.ts:458` | `POST /frost/circle/messages` | nothing | `circleBrideHeaders()` |

Under ZIP 2's refuse-on-neither those four would have returned the bride her own circle chat as a refusal — the outcome the resolver ruling exists to prevent. **No new authority was minted**: `journey.ts` borrows the `getToken()` it already imports (F-07.70's one authority, cookie-before-localStorage), and sanctuary uses its own `coupleAccessToken()`. `§3.1` and `§6.5.4` are the cells that redden if a fourth token read ever appears here.

## 4 · CONTROL INVENTORY — `app/coplanner/layout.tsx:120–299`, as ruled

**KEPT** — phone input · `+91` label · `Continue →` · Enter-to-submit · the four PIN inputs and their focus advance · **the auto-submit verb** (a capability one layer above the inputs — CLAUSE 2, and `§4.7` is its cell) · "Auto-submits when complete." · the three step captions · the step machine · the error slot · the post-verify session fetch.

**CHANGED** — `Continue`'s handler (no fetch; it advances the step) · `onSuccess` (writes the session **and** the token) · the hydration refresh (carries the token; tells a refusal from a blip).

**REMOVED-BY-RULING** — the `pin-status` fetch · the `userId` state, whose only writer was that fetch.

**MOVED** — the two guard sentences. They were client-side strings fired after a pre-check at the **phone** step; they are now the server's words at the **PIN** step, founder-vetoed and frozen at the byte. The error slot did not move; its **sources** did, and that is the whole of the user-visible difference.

**CLAUSE 3** is satisfied at the walk: the surface is exercised against Mehek's real row, not a fixture.

## 5 · A REFUSAL AND A BLIP ARE NOT THE SAME EVENT

The hydration refresh signs the member out **only on a 401**. A 500, a timeout, an offline phone keeps the cached session on screen exactly as this file has always behaved — signing someone out over a dropped packet is a worse failure than slightly stale permissions.

**That branch cannot fire in this delivery, by construction and on purpose.** No circle door returns 401 at this tip. It is wired now so the enforcement delivery is a *server* change alone, and so the path ships proven rather than written-and-first-run against a live member — which is the shape F-07.72 exists to punish.

## 6 · WHAT THE PROOF CAUGHT IN ITS OWN AUTHOR

- `§2.1` went RED on its first run over **two calls that are legitimately exempt** — `verify-pin` (the mint: a mint that required a credential could never issue the first one) and `couple/profile` (the couple lane's own door, F-07.106; sending the circle token there would itself be a lane crossing). Both are now **named exemptions with reasons**, not a narrowed regex. An exemption nobody had to argue for is an exemption nobody checked.
- `§4.4` compared two `indexOf` results and **passed over its own mutation**, because a deleted call returns `-1`. Presence is asserted before order now.
- The call census originally counted only single-line `fetch(...)` forms and **under-counted a multi-line call**. Widened.

## 7 · FLOOR AT DELIVERY — `npm ci` first, `rm -rf .next` before tsc, exit captured not piped

`tsc --noEmit` **ZERO** (true exit 0, cleared `.next`).

**Byte-stable at CE-124's counts:** `p1 43` · `p2 48` · `p3 117` · `p4a 69` · `slice1 30` · `probe 33` · `body 133` · `f0760 82` · `f06133 41` · `p6_fold 68` · `m3_chip GREEN` · `f0790 37` · `f0784 34` · `f0789 30` · `f0774 35/35`.

**Movements, disclosed:**

| Proof | Was | Now | Why |
|---|---|---|---|
| `tdw07_f0772_circle` | — | **64** | NEW. 9 mutations RED across process boundaries, all restored byte-identical. |
| `tdw_auth_crossover` | 36 | **46** | +7 cells (§6.5, the triangle) +3 mutations. CE ruling §3(4). |
| `tdw_f0770_authority` | 104 | **104** | §1.3 `7 → 8` and §1.5 `12 → 13`, both labeled. **The number moved the right way**: the cell exists to catch a site *leaving* the one door, and it recorded one *arriving* — sanctuary's circle POST was written as `coupleAccessToken()` rather than as a fourth token read. §1.4's direct-authority leg is unmoved at seven, which is the discriminating fact. |
| `tdw07_f0766_orphan` | 21 | **28** | §5.4 counted vocabulary-4 consumers in **raw** text and a new comment naming `circle_session` moved it 3 → 4 — a census counting prose as code. Re-aimed at stripped source, so the ARC-2 handover's *exactly three* stands. Importing the stripper then bound the §0 CANARY LAW, and its seven canary cells are the +7. |

`tdw_f0774_stripper` **35/35** — the coverage cell caught both newly stripper-dependent proofs before the floor did, which is what derived-not-listed is for.

## 8 · THE FOUNDER SMOKE CARD

Authored from the founder-run fixture rows of 2026-08-02. **Every precondition below is named from those rows; nothing is invented.**

**Fixture state of record:** exactly **one** active circle member — **Mehek**, `+918757788550`, `users.id 3c8eb9e0-e746-4d95-9630-17897aa64f05`, couple `9f1f84d5-e688-4d4f-9e44-9f5da6315e52`, `pin_set = true`, no phone active in two circles.
**The three refuse targets** are real `users.id` rows that are **not** circle members: `ec4232ae-d670-4538-ab65-0be9f51a37af` (dev) · `df9b11c2-6d50-42bc-8c4f-d565b57c7dce` (Swati Roy) · `3c22d190-4344-400c-a5db-bfc89015a634` (Vera Kapoor).

**READ THIS FIRST — what this walk can and cannot prove.** This ZIP **enforces nothing**. A forged id still works today, and that is correct. Step 5 exists to record that fact *before* enforcement, so ZIP 2's identical curl produces a visible difference rather than an unwitnessed claim. **A screen that renders proves the mount, not the refusal** — steps 4 and 5 are curl-level for that reason (the OUTAGE-MASK discipline).

**Step 0 — the env, before anything.** Railway → the service running `src/index.js` → Variables → add `CIRCLE_SESSION_SECRET`, any long random string, **never pasted into a chat**. Redeploy. *Evidence: the deploy goes green.* If you skip this, everything below still works and simply issues no token — nothing breaks, but there is nothing to see.

**Step 1 — the sign-in that has never worked.** On your phone, open the co-planner as Mehek and sign out if you are signed in. Enter `8757788550`, tap `Continue →`, enter her 4-digit PIN. *Precondition: `pin_set = true` on couple `9f1f84d5…`, from the Q4 row.* *Evidence: you land in the Circle.* **This is the step that matters most — before this ZIP, that screen could only ever say it did not recognise her.**

**Step 2 — a wrong PIN, for the moved sentences.** Sign out, repeat step 1 with a wrong PIN. *Evidence: `Incorrect PIN.` on screen.* Then repeat with a number that is not hers, e.g. `9999999999`. *Evidence: `We don't recognise this number. Use your invite link to join first.` — your byte, at the PIN step now, not the phone step.*

**Step 3 — the token exists.** Still signed in, open the browser's dev tools → Application → Cookies. *Evidence: a cookie named `tdw_circle_token` whose value has **five** dot-separated parts.* **Do not paste that value anywhere.** Five parts is the whole check: three would be a Supabase JWT, and this lane does not issue those.

**Step 4 — the token is carried and honoured.** Dev tools → Network → pull-to-refresh the Circle. *Evidence: the requests to `/api/v2/circle/session/…`, `/frost/circle/feed/…` and `/frost/circle/threads/…` each show an `Authorization: Bearer …` request header, and each returns 200.* This is the mount witnessed at the wire; the rendering screen alone would not have shown it.

**Step 5 — the forgery, recorded as still working.** In a terminal, run each of the three commands below. *Expected today: each returns `success: true` with a real member's data for an id that is not hers.* **That is the disease, and recording it now is the point.** Paste all three outputs back; ZIP 2's acceptance is that these same three commands return 401.

```
curl -s https://dream-os-production.up.railway.app/api/v2/circle/session/ec4232ae-d670-4538-ab65-0be9f51a37af
```

```
curl -s https://dream-os-production.up.railway.app/api/v2/circle/session/df9b11c2-6d50-42bc-8c4f-d565b57c7dce
```

```
curl -s https://dream-os-production.up.railway.app/api/v2/circle/session/3c22d190-4344-400c-a5db-bfc89015a634
```

**Step 6 — the bride is not locked out.** Open Frost as the bride on couple `9f1f84d5…` and send one message into the circle chat. *Evidence: it appears, and Mehek sees it on her Circle.* This is the dual-lane door working with her credential now attached — the thing ZIP 2 would break if these bytes had not shipped first.

**Step 7 — sign-out takes the credential.** On Mehek's Circle → Settings → Sign out. *Evidence: dev tools → Application → Cookies shows **no** `tdw_circle_token`.*

**Not witnessable on this walk, and named rather than assumed:** the one-number-one-circle refusal (it needs a second invite to a second couple, and only one couple has an active circle) · the session-expired line (nothing returns 401 until ZIP 2) · the minimised session response is visible in step 4's response body if you want it, but its value is that `phone` and `pin_set` are **absent**, which is an absence and reads as nothing on a screen.

## 9 · WHAT COMES NEXT

1. You apply both ZIPs, dream-os first, and push each.
2. You walk §8 and paste back steps 3, 4, 5 and 7.
3. **ZIP 2 — enforcement** (dream-os only): the guard re-authored (`resolveUsersId`'d, `signedSession`-verifying), Class A guarded, `session.js:29–54` collapsing into `req.circleMember`, Class B's resolver flipped to refuse-on-neither. Its acceptance is step 5's three curls returning 401 and step 6 still working.
4. **The partial unique index** on `(invitee_phone) WHERE status='active'` — founder-run SQL, its own message, after the walk is green.

Steps 3 and 4 are **conditional-withheld** and will not arrive beside this delivery.
