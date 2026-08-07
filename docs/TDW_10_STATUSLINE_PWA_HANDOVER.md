# TDW_10 · F-10.110 + F-10.106 — THE STATUS LINE LEARNS THE PAIR (dreamos-pwa)

**Base:** `c1fd389` · re-derived fetch-first at seating and again at cut, **unmoved**.
**Read-only sibling:** dream-os `90d67ba`, cloned for evidence, **zero bytes written**.
**Rulings:** R-26.18 (forks, reports, acceptance) · R-26.19 (§A the import guard, §B two promoted class sentences).
**Gates:** `npm ci` 0 · full history (`--is-shallow-repository` false) · `tsc --noEmit` **0 errors** · `npm run build` **environmentally red per R-2** (next/font cannot fetch Cormorant Garamond, DM Sans, Italiana, Jost — declared egress wall; zero code errors; Vercel is the ruled witness).

---

## 1 · THE FINDING BODIES (R-4 — these existed only inside CE-210's ⑩ flags paragraph)

### F-10.110 — THE STATUS LINE WAS FALSE WHENEVER TIER AND BILLING STATUS DISAGREED

**Evidence, at `c1fd389` / dream-os `90d67ba`:**

- `components/vendor/SubscriptionCard.tsx` — `BILLING_STATUS: Record<string, string>` keyed on `billing_status` ALONE, rendered as `BILLING_STATUS[current.billing_status] ?? 'Not set up yet.'`. The tier was never consulted.
- F-10.77's explanation was gated `current.tier === 'basic' && (cancelled || halted)`.
- **The tier half is the TRUE half.** dream-os `src/api/vendor-engine/chat.js`, `buildLlmForTurn` — `const productTier = (vendor && vendor.tier) || 'basic'`. `billing_status` appears **ZERO** times in `chat.js` and **ZERO** times in `src/lib/vendorInbound.js` (counted, both files). AI entitlement reads `vendors.tier` and nothing else.

**The state:** a vendor at `tier: 'signature'`, `billing_status: 'cancelled'` read PLAN: *Signature* (true — she genuinely had Signature AI on both lanes), STATUS: 「 You're on Basic 」 (false), and F-10.77's explanation went **silent**, because its gate excluded exactly the vendor who most needed it.

**REACH — and this replaces the charter's own warrant (chair defect #23, R-26.18 §A/R-3).** The charter said the pair arises 「 with nobody touching a row by hand 」. Derived otherwise, and the correction is stronger:

- The **webhook path cannot produce it.** `src/lib/billing/razorpay.js:entitlementFor` returns `{ tier: BASE_TIER, billing_status: 'cancelled' | 'halted' }` — tier and status together — and `tierFlip.js:applyEntitlement` writes them in ONE `update()`. `src/api/vendor/billing.js` honours the sole-writer rider and writes neither column.
- **Two sanctioned admin product surfaces write `tier` ALONE** and never touch `billing_status`: `src/api/admin/vendors.js` (`PATCH /:vendorId/tier` → `.update({ tier })`) and `src/admin/router.js` (the unified-invite mint → `.update({ tier: cleanTier })`).

So the divergent pair is a **designed-in product state reachable through the panel working as intended** — not an accident of manual data entry. Comping a vendor after her subscription lapsed lands her there.

**Cure (ruled R-26.18 Fork 1 arm B + Fork 2):** `lib/vendor/billing/statusLine.ts`, a dependency-free pure module returning `{ status, note }` from the PAIR. The `tier === 'basic'` gate is **DELETED**, not widened — one function owns both outputs, so the gap between the two cures has nowhere to exist. Unrecognised status → `status: null` → **no row rendered**.

**Disposition:** CURED. Structure shipped in this ZIP. **Seven copy bytes carried to the founder under R-26.18 §E; see §6 below — four of the seven are unchanged and shipped, three are new and gated on his word.**

### F-10.106 — CHROME STANDING OVER NOTHING

**Evidence:** `app/vendor/settings/page.tsx` — `<SCard title="Account">` whose sole child was `{current.founding_cohort && <SReadRow …/>}`. For any vendor outside that cohort it rendered a brass label above emptiness. Pre-existing; made conspicuous the moment the Subscription card left from above it. `app/vendor/more/page.tsx` names the class in its own warrant: *chrome pretending to be structure*.

**Cure (ruled R-26.18 Fork 4):** **WRAP, not retire.** Wire-or-delete-at-birth governs controls born *unwired*; this row is wired and true — it renders a real value from `vendors.founding_cohort` for the cohort it was built for. Retiring the card would delete a live surface in order to cure a frame. The defect was a frame that was unconditional while its only content was conditional. The condition moves up one level. **Zero copy bytes.** The re-gate condition (if a second row ever joins the card) is named in-comment per F-06.85 and cell-asserted.

**Disposition:** CURED, shipped, no veto needed.

---

## 2 · WHAT SHIPS — five files

| File | Change |
|---|---|
| `lib/vendor/billing/statusLine.ts` | **NEW.** The pair resolver. Dependency-free by law — no `@/` aliases, no JSX. |
| `components/vendor/SubscriptionCard.tsx` | `BILLING_STATUS` retired to the resolver with a tombstone; one `statusLine()` call; conditional Status row; gate deleted. |
| `app/vendor/settings/page.tsx` | F-10.106 — condition moved from the row to the `<SCard>` frame. |
| `scripts/tdw10_billing_tab.proof.mjs` | §9 + §10 added; cells 4.3 and 7.2 amended under label. **26 → 39.** |
| `scripts/tdw10_tier.proof.mjs` | Union read + four cells amended under label. **107/107 held.** |

**RADIUS HELD:** zero dream-os bytes. `chat.js` is cited throughout and edited nowhere.

---

## 3 · ACCEPTANCE

**Ratified 38. Delivered 39 — the extra cell is disclosed, not slipped.** Cell **9.11** is the absent-subject conviction cell required by R-26.19 §A; without it a guarded bench could be run against a tree with no resolver and reported as *mostly green*. It is the shim's driver, not a thirteenth assertion about the cure.

- `tdw10_billing_tab` **39/39** cured · **24/39** uncured, full cell count printed.
- `tdw10_tier` **107/107** cured · **103/107** uncured, full cell count printed.
- `tdw09_uivendor` 76 · `tdw09_home` 67 · `tdw09_roles` 131 · `tdw09_p2c` 52 · `tdw07_f0784_panel` 34 · `tdw09_p2_doors` 86 · `tdw09_hotfix` 38 — all green, unmoved.
- **Attributed reds reproduced UNMOVED:** `tdw10_p3_deck` **191/193** (F-10.62) · `tdw_f0774_stripper` **33/35**, the *with-sibling* state (the read ladder required the dream-os clone). Not re-derived further.

### The mutation ledger — 15 mutations, every one against PRODUCTION code, every run reporting whether the bench RAN

| # | Mutation | Ran | Reds |
|---|---|---|---|
| M1 | `PAID_TIERS` emptied | 39 cells | 9.3 9.5 |
| M2 | paid-cancel arm reverts to the floor strings | 39 | 9.3 9.5 |
| M3 | a vetoed byte reworded | 39 | 9.4 |
| M4 | an `import` added to the resolver | 39 | 9.1 |
| M5 | unknown status absorbed again | 39 | 9.7 |
| M6 | `''` + `trial` classed as paid tiers | 39 | 9.6 |
| M7 | resolver throws on every pair | 39 | 9.2 9.3 9.4 9.5 9.6 9.7 |
| M8 / M8b | mechanism comment defaced / warning deleted | 39 | 9.9 |
| M9 | money register broken on a new byte | 39 | 9.10 |
| M10 | `??` fallback restored in JSX | 39 | 9.7 9.8 |
| M11 | `tier === 'basic'` gate restored | 39 | 4.3 9.8 |
| M12 | gate moved back down onto the row | 39 | 10.1 |
| M13 | ACCOUNT card **retired** instead of wrapped | 39 | 10.1 **10.2** |
| M14 | floor note removed | 39 | 4.3 9.4 |
| M15 | moved byte left behind in the card | 39 | 7.2 |
| T1–T4 | four `tdw10_tier` mutations | 107 | each amended cell, individually |

**M13 is the load-bearing one:** retiring the card greens 10.1 and reddens 10.2. The guard against curing a frame by deleting a live surface holds, and it holds by execution.

---

## 4 · FIVE SELF-CAUGHT DEFECTS — every one found by the red run, none by reading

1. **THE BENCH DIED AND PRINTED NO FAIL LINE.** Amended cell 4.3 read fixtures declared at §9. `const` does not hoist — TDZ, `ReferenceError`, bench dead at §4 having printed fifteen greens and zero FAILs. Caught only by checking the **exit code and the line count**, not the summary. CE-210's clause proving itself on the sitting that quotes it. Declarations hoisted; named in-comment at both benches.
2. **CELL 9.9 WAS NON-BITING.** M8 renamed `buildLlmForTurn` → `buildLlmForTurnX` and the guard stayed GREEN: a bare substring test passes on a defaced superstring. Word-anchored. — *A guard that survives the defacement of the thing it guards is not a guard.* (promoted, R-26.19 §B)
3. **CELL 9.2 WAS VACUOUS, and its own comment was false.** The cell claimed to call the resolver raw; it went through the throw-safe wrapper, which turns every throw into a well-shaped sentinel. Under M7 it counted 36 shaped answers and passed while all 36 threw. — *A totality check routed through a catch-all is a check on the catch-all.* (promoted, R-26.19 §B)
4. **CELL 9.3 GREENED ON A SENTINEL.** `'\0THREW'` contains no 「 on Basic 」, so the cell F-10.110 exists for passed against a resolver that threw on every call. Sentinel now rejected by name.
5. **9.8's reference count was wrong** (`=== 1`, actual 2 — the gate and the render). Corrected and disclosed rather than tuned away.

---

## 5 · THE BISECT NOTE (R-26.19 §A)

Both benches now **execute** the resolver. A static import would produce `ERR_MODULE_NOT_FOUND` and **zero printed cells** on any tree without `statusLine.ts` — strictly worse than a red, because a red is a report and an ENOENT is a silence (F-09.93's refuse-never-crash class; shape taken from `scripts/tdw09_p2c.proof.mjs:40` and `tdw07_p3_portfolio.proof.mjs:25`).

**Guarded.** Absent module → the bench still runs, prints its full cell count, exits non-zero, and every executing cell reds as `[DECLARED-ABSENT-SUBJECT: lib/vendor/billing/statusLine.ts]`. **Never a stand-in that could acquit** — `execCell` refuses before the predicate is evaluated. Cell 9.11 convicts the absence by name.

**The guard makes the bisect legible, not free.** A session bisecting across this commit will read `24/39` and `103/107` with the subject named, not a stack trace.

---

## 6 · THE COPY — WHAT SHIPPED AND WHAT IS HELD

**Four of the seven bytes are UNCHANGED and ship** (`none`, `active`, `pending`, and both floor-tier `halted`/`cancelled` sentences), plus both F-10.77 floor notes — **seven surviving vetoed strings in total**, all cell-asserted byte-identical at 9.4. That cell is what stops this or any later sitting quietly rewording approved copy.

**THREE NEW BYTES ARE IN THE ZIP AND ARE NOT YET VETOED.** They sit in ONE hoisted block in `statusLine.ts` marked `HELD ON THE FOUNDER'S WORD`:

| when | today (false) | shipped, pending word |
|---|---|---|
| paid tier, cancelled | `Cancelled. You're on Basic.` | `Cancelled. No monthly payment is set up.` |
| paid tier, payment failed | `Payment failed. You're on Basic.` | `Payment failed. No monthly payment is set up.` |
| paid tier, either | *(silent)* | `Your {Plan} plan is still on. Profile, leads and AI are unchanged.` |
| unrecognised status | `Not set up yet.` | *no row at all* |

**THE FORK I RESOLVED, AND THE CHAIR SHOULD KNOW I RESOLVED IT.** R-26.19 §D said ship the structure with the new bytes *held* and 「 do not guess a byte 」. Two readings: (a) ship the proposed strings marked held, or (b) return `null` for the paid arms until the word lands, so a Signature/cancelled vendor sees no Status row.

I took **(a)**, for two reasons and with the alternative made cheap. These bytes are not guessed — they are the exact strings R-26.18 §E carried to the founder verbatim. And **(b)** would ship a surface where a real, reachable state renders nothing, which is a second incompleteness requiring a second push. **The veto gate is step 1 of the smoke card with a hard STOP before the git line**, so no unvetoed byte reaches origin without his word. If he changes a word it is a one-line edit in one place — which is the whole reason the block is hoisted. **If the chair meant (b), say so and I re-cut: it is three `null`s and two bench cells.**

---

## 7 · FLAGGED, NOT TOUCHED

- **`V2.upgradeExplain` and `V2.mintFailedAfterCancel`** (`SubscriptionCard.tsx`) both say 「 you're on Basic 」 and both make F-10.110's assumption. **Currently TRUE** on their own path: they render only when `isUpgrade === true` (`billing_status === 'active'`), and that path cancels first, so `entitlementFor` genuinely writes `basic`. They belong to `TierPicker`, which is the **PAUSED razorpay v2 session's**. Byte-unchanged by ruling; the pair-law is recorded against them here so it is not lost.
- **F-10.111** (minted R-26.18 §C from this sitting's §3(e)): with `billing.tier_flip_enabled` OFF, a real cancellation is ledgered and never written, leaving `(signature, active)` — the status line reads 「 Active. Renews monthly. 」 with no live mandate. **A pair-keyed resolver cannot detect this, because the row itself is stale.** Graded LATENT. The cure shipped here does not cover it and must not be read as covering it. Belongs to whoever next touches `tierFlip`.
- **Schema doc (R-1):** `docs/db/PUBLIC_SCHEMA.md` is at ladder tip `0099` and carries none of `billing_status`, `razorpay_subscription_id`, `razorpay_subscription_link`. Regeneration post-0114/0115 has been on the founder's shelf since CE-204; this sitting is its second demand.
- **Out of radius, disclosed, not reached for:** `tsconfig.json` declares `"paths"` twice; dream-os `razorpaySubscriptions.js` still says `subscription.completed` 「 does not handle 」, superseded by F-10.90's cure.

---

## 8 · WHAT THE NEXT SITTING PICKS UP

The founder's word on the three new bytes · F-10.111's cure, unruled · the `PUBLIC_SCHEMA` regeneration · and, whenever the razorpay v2 seat unpauses, the two `TierPicker` sentences flagged in §7.
