# TDW_07 · THE AUTH SITTING · ARC 1 — dreamos-pwa handover

**Base:** `082117a` · **Paired dream-os ZIP:** `tdw_auth_arc1_dos` on `d9cb4b9`
This document rides the ZIP. It is **not** a CE entry and touches neither `FINDINGS_LOG.md` nor the masterplan.

---

## 1 · WHAT SHIPPED

| File | Change |
|---|---|
| `lib/frost-api/_base.ts` | **F-07.65 fork 1(b)** — the lane assertion inside `getAccessToken()`, run **before** the cookie sync; the cross-lane cookie fallback removed from both arms; the now-dead `VENDOR_COOKIE` binding removed with its readers. |
| `app/(frost)/frost/canvas/onboarding/page.tsx` | **F-07.71 partial** — the `401 \|\| 403` parity branch, founder veto 「 b 」. |
| `scripts/tdw_auth_crossover.proof.mjs` | **NEW** — the client half of the proof. **30/30**, six process-boundary mutations. |

**Zero new user-facing strings.** The one string added is `Session expired. Please sign in again.` — lifted byte-identical from `app/(auth)/couple/onboarding/page.tsx`, and cell `§3.3` proves the identity by extraction rather than by eye, so a future drift on either site reddens.

## 2 · THE LANE ASSERTION — why the test is what it is

The bare slot is refused when it is **byte-identical to `vendor_session.access_token`**.

That is evidence, not a heuristic: the vendor lane records its own token inside its blob at **all three** of its writers — `(landing):505`, `vendor/pin-login:105`, `vendor/pin-reset:193` — and `lib/vendor/session.ts` treats that field as the lane's authority. The blob is a witness of what the vendor lane last wrote.

**The symmetric-looking test was considered and rejected by command.** Comparing against the *couple* blob's token would refuse every bride who signed in with her PIN: `couple/pin-login`, `couple/pin` and `couple/pin-reset` write the fresh token **only to the bare key** and never into their blob (they spread `existing`, whose token is the stale landing-OTP one). A cure that logs out its own subject is not a cure.

## 3 · THE COST, STATED — this is not discovered later

A human holding **both** roles on one users row, who has signed into the vendor lane but **never** into the couple lane on this device, is refused and sees the existing vetoed `Session expired. Please sign in again.` One couple sign-in fixes it permanently. The CE ruled this trade explicitly when it reversed F-05.30: **a silent wrong-self is worse than an honest sign-in.**

## 4 · ⚠ THE WALK CARD DIVERGES FROM THE CHARTER — READ THIS BEFORE WALKING

The kickoff's acceptance ⑤ describes the reverse walk as:

> vendor login → open the bride's Frost feed → **the prefill RENDERS (the — dies)** → an enquiry posts carrying the BRIDE's identity

**Under the ruled cure that walk cannot happen, and a green on it would be hollow.** Fork 1 was ruled to the **refusal** arm. On a device where a vendor just signed in, `getAccessToken()` now returns `null` — so the sheet renders **empty and editable**, which is correct behaviour, not a failure. The em-dash does not die by magic; it dies once the **bride signs in on her own lane**.

That charter step has **no thumb-path** as written. The card below is the reconciled walk. Naming this rather than walking the charter's version is the whole of the card-reconciliation clause.

### THE FOUNDER'S CARD — plain steps, founder performs and pastes, the LE reads the evidence

1. On the handset, sign in as the **vendor** (+919888294440) and land on `/vendor`. *(Evidence: the studio loads.)*
2. **Without signing out**, open the bride's Frost surface and tap **Enquire** on a Discover card.
   *(Evidence: the sheet opens; City and Budget are **empty and editable**. This is the CURE, not the bug — the estate is refusing to guess her identity from his token.)*
3. Sign in as the **bride** (+919625759924) on the couple lane and complete PIN.
4. Re-open the same Discover card and tap **Enquire**.
   *(Evidence: **City and Budget now PREFILL** from her profile — the em-dash is dead.)*
5. Submit the enquiry.
   *(Evidence: the vendor's WhatsApp ping carries **her** name, not "a couple" and not the vendor's.)*
6. **The forgery probe** — the one step that proves F-07.62 rather than F-07.65. While signed in as the **bride**, the enquiry must carry **her** identity even though the client posts a `couple_id`. *(Evidence: the ping's name. If it ever shows another couple's name, stop and paste.)*

Only the founder's device can witness steps 2, 4 and 5 — the cells prove the wiring, never that the sheet is usable (PROVABLE-EQUIVALENT DOCTRINE).

## 5 · FLOOR AT DELIVERY

`tsc --noEmit` **ZERO** (true exit code, captured to file, not piped) · `p1 37/37 · p2 42/42 · p3 111/111 · p4a 63/63 · slice1 24/24 · probe 27/27 · body 122/122 · f0760 76/76` — all eight byte-stable · **`tdw_auth_crossover 30/30` (NEW)** with **6/6 mutations RED across process boundaries**, all restored byte-identical.

## 6 · FENCES HELD

`sanctuary/page.tsx`, `canvas/discover/**`, `VendorProfileView.tsx`, `photoPager.ts` — **zero bytes touched**. `EnquirySheet.tsx` is this sitting's by assignment and **also carries zero bytes** in this delivery: its prefill is cured entirely by `_base.ts` underneath it, which is the cleanest possible outcome for a file two sittings both care about.

**F-07.70 named at its own site** (`_base.ts`, the scope paragraph): sanctuary's 12 direct `access_token` reads bypass this authority and keep the disease. Its micro follows both sittings.
