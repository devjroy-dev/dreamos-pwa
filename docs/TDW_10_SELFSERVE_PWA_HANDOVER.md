# TDW_10 · BILLING v2 — SELF-SERVE · HANDOVER (dreamos-pwa)

**Base:** `77635cc` (`origin/main`, re-derived at seating and at cut)
**tsc:** `--noEmit` → **0 errors**, with `node_modules` installed (a real check)
**Chair:** twenty-fifth · **Executor:** Opus LE

---

## 1 · FOUR FILES

| file | what |
|---|---|
| `app/vendor/settings/page.tsx` | the v2 string set · `TierPicker` · `CancelBlock` |
| `hooks/vendor/useSettings.ts` | `subscription_id` declared **and mapped** |
| `lib/vendor/api/vendor.ts` | `subscribeToTier` · `upgradeToTier` · `cancelSubscription` |
| `lib/vendor/types/vendor.ts` | `razorpay_subscription_id` on the vendor type |

**Sweep wall held.** My ground was `app/vendor/settings/page.tsx` +
`hooks/vendor/useSettings.ts`; the two additional files are the API client and
the type that carries it, neither of which is sweep ground. Zero overlap, derived
by `git status` at cut.

---

## 2 · THE CONTROL INVENTORY — NINE CARDS, EIGHT BYTE-UNTOUCHED

Business · Discover Profile · Payments · Working Capacity · TDW Enquiry Link ·
Invoice Settings · Morning Briefing · **Subscription** · Account, plus the
page-level back chevron and Sign Out.

**Every control on all eight non-Subscription cards: KEPT, byte-untouched.**

Inside Subscription:

- three `SReadRow`s — **KEPT**
- the flip-reason `<p>` (F-10.77's cell) — **KEPT**
- the `<a href={subscription_link}>` pay anchor + its UPI explainer — **KEPT**
- 「 Dev will send you a payment link. 」 — **RETIRED with the era**
- `TierPicker` — **ADDED**
- `CancelBlock` — **ADDED**

`id="tier"` **does not move.** It is load-bearing:
`src/api/vendor-engine/chat.js` sends vendors to `/vendor/settings#tier`.

---

## 3 · THE STRING SET — FOUNDER-VETOED 2026-08-07

Hoisted into the **same block** as the v1 set, for the reason that block gives:
copy under veto lives in one readable place so it can be diffed against the veto
record without reading JSX. Every v1 string is verbatim and untouched.

Money register: **`Rs X,XXX`**, zero rupee glyphs, zero `k`/`L`/`Cr` shorthand.
Prices are read from `PLAN_PRICE` rather than retyped, so the canon has one home
on this surface too — and `PLAN_PRICE` itself mirrors `TIER_PAISE`, which pins
the integers so prose cannot drift them (F-10.63's lesson).

| | string |
|---|---|
| picker heading | Choose a plan |
| picker action | Choose |
| confirm | This opens a Razorpay page to approve {Plan} — {Rs X,XXX / month}. You approve once; it renews every month until you cancel. |
| cancel warning | Cancel {Plan}? Your plan stops and you move to Basic. This can't be undone — starting again means setting up a new monthly payment. |
| cancel yes / no | Cancel my plan · Keep my plan |
| upgrade explainer | Moving to {Plan} stops your current plan first, then opens a new page to approve {Rs X,XXX / month}. Until you approve it, you're on Basic. |
| mint failed | Couldn't reach Razorpay just now. Nothing has changed — try again in a moment. |
| cancel failed | Couldn't cancel just now. Your plan is unchanged — try again in a moment. |
| **the seam** | Your old plan is already stopped and the new one didn't open. You're on Basic for now — tap {Plan} again to finish. |
| door shut | Plan changes are not open yet. |

**The seam string is the one that earns its place.** Fork U(a)'s failure mode —
cancelled-but-mint-failed — is indistinguishable from "nothing happened" unless
she is told. Without it she would assume her old plan survived and be wrong about
whether she is currently paying. Never a false done, and its harder mirror:
**never a false "nothing happened."**

---

## 4 · THE TYPE SCALE — NO NEW SIZE ENTERS THIS FILE

Body copy at **16** (the ruled floor, `BODY_FLOOR`), action words at **10** in the
engraved register. Both are named rungs
(`RUNGS.body = [16,20,25,31,39,49]`, `RUNGS.register = [8,9,10]`).

**F-09.105 is NOT this delivery's.** The three sub-floor `F.body` sites at
`page.tsx:318` (13) · `:347` (12) · `:358` (13) were re-carried to the UI micro by
chair relay #3 and are **untouched here**. Because this delivery adds no new size,
those three remain the only sites `tdw09_type` can see, and its count moves when
the micro lands — not here. Named so the next reader does not mistake their
survival for this sitting's carelessness.

---

## 5 · WHY `subscription_id` HAD TO BE CARRIED

Under v1 a null link meant one thing: no link issued. Under v2 it means **two
things** — a vendor who never subscribed, and a vendor whose plan is dead. Only
the id tells them apart, and they need different screens: the first sees a
picker; the second sees a picker **and** the reason she is on Basic.

**Declared AND mapped.** `useSettings.ts` has paid this tuition once: F-07.9 was
five fields declared on the state and never assigned, where the fetch worked, the
render worked, and the values were dropped at exactly that seam — one of them
silently mis-rendering every opted-out vendor for a block. Typing a field is not
carrying it.

The id is not a secret and not actionable: every self-serve door re-derives the
vendor from her own JWT, no endpoint accepts a subscription id from the caller,
and it stays in `LOCKED_FIELDS` server-side — readable, never PATCHable.

---

## 6 · THE PICKER RENDERS FOR THE CHURNED VENDOR, DELIBERATELY

Shown whenever there is no live link — **including** when a dead
`razorpay_subscription_id` is present. Her cancelled subscription does not
disqualify her: the server's refusal keys on Razorpay's live statuses, not on
whether a row holds an id.

Hiding the picker from her would be **the client re-implementing a rule the
server already owns, and getting it stricter** — locking a churned vendor out of
returning, from the surface, after the server was carefully built not to.

**The link is the close.** On a successful mint she is sent straight to Razorpay
rather than shown a second button: every extra tap between intent and approval is
a place the intent dies.

---

## 7 · NOT PROVEN HERE — DECLARED, NOT CLAIMED

**`next build` was RED in the executor's container, and only from the font
fetch.** Four `403`s on `fonts.googleapis.com`, which is outside the container's
allowed-domain list. No TypeScript error, no compile error, no import error — the
failure is the sandbox, not the tree.

**Build green is the founder's to witness on Vercel.** It is walk step 8.
