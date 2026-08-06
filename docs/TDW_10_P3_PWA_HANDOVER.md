# TDW_10 · ADMIN P3 — THE MINT + THE DECK · EXECUTOR HANDOVER (dreamos-pwa)

**Base:** dreamos-pwa `33f7c1d` · paired with dream-os **`800d7a1`, already pushed** — this ZIP depends on it.
**Rulings:** CE relay #1–#4 · R-P3.1 · R-P3.2 · R-P3.3 · Forks 5, 6(a), 7(b) · F-10.43–.47
**Founder verbatims:** 「 1-ok 」 「 2-all ok 」 · 「 swati or 87577 can alsobe used as its our test account 」
**Role:** LE. Nothing pushed. **ZIP 2 of 2.**

---

## 1 · WHAT SHIPPED

| File | State | What |
|---|---|---|
| `app/admin/approvals/discover/page.tsx` | REWRITTEN | The deck — cards, swipe, A/R keys, reason chips, bulk mode |
| `app/admin/_components/MintSheet.tsx` | NEW | One sheet, both species, both F-10.47 outcome cards |
| `lib/admin-api/mint.ts` | NEW | The typed mint client |
| `lib/admin-api/index.ts` | MODIFIED | `DiscoverRequest` cured (F-10.45); `denyDiscover` carries a reason |
| `app/admin/makers/page.tsx` | +3 lines | People → `+ New` → vendor mint |
| `app/admin/dreamers/page.tsx` | +3 lines | People → `+ New` → couple mint |
| `app/admin/_components/tokens.css` | MODIFIED | F-10.46 — three sites cured |
| `scripts/tdw10_p3_deck.proof.mjs` | NEW | 104 cells incl. an 8-mutation section |
| `scripts/tdw10_p2_retint.proof.mjs` | LABELLED AMENDMENT | Pair set DERIVED, 71 → 76 — §6 |
| `scripts/tdw07_f0790_dashboard.proof.mjs` | RETIRED | With anchors verbatim — §5 |

`app/admin/layout.tsx`, `adminNav.ts`, `CommandPalette.tsx` and `AdminUI.tsx` are **untouched**. No route path moved. **W-1 trivially clean and said so.**

---

## 2 · THE PROOF

- `tdw10_p3_deck` **104/104** cured · **27/104** at the true uncured tree — **77 cure cells RED**. (Uncured = `33f7c1d` plus the bench, with `MintSheet.tsx` and `mint.ts` moved aside as well as the tracked files stashed. `git stash` alone leaves new files on disk and would have reported a flattering number.)
- **pwa floor, thirteen 09-era benches at their exact prior counts:** `home 67/67` · `landing 98/98` · `type 16/16` · `surface 51/51` · `roles 130/130` · `money 18/18` · `palette 18/18` · `theme_retire 16/16` · `p3_landing 89/89` · `console 55/55` · `factory 45/45` · `invite_spent 14/14` · `prospects_console 54/54`. Plus `tdw10_p1_shell 53/53` and `tdw10_p2_bridge 44/44`, unmoved.
- `rm -rf .next && npx tsc --noEmit` → **0 errors**.
- **Declared gap, unchanged from P1:** `npx next build` cannot run in this container — four `Failed to fetch … from Google Fonts` errors, reproduced identically at the untouched tree. Container egress, not this delivery. Vercel's builder reaches Google Fonts.

**The 27 greens at the uncured tree** are almost all vacuous by construction — `MintSheet.tsx` and `mint.ts` do not exist, so every "carries zero hex / no rose / no rgba ground" cell on those two files passes on an empty string, and the stranded-roles cell reports "every one of the **0** roles". That last one is why a companion cell asserts the consumed-role count is **at least 8** at the cured tree: a zero-denominator green is the silent-zero failure mode protocol §9 names, and it needs a cell of its own rather than a reader's good faith.

---

## 3 · THE DECK

**Control inventory (CE-115 clause 1) — every control on the replaced page accounted:**

| control | disposition |
|---|---|
| `Deny` chip | **MOVED** → left swipe · reason chips · desktop `R` |
| `Approve` chip | **MOVED** → right swipe · desktop `A` |
| `Revoke Access` | **KEPT** — the settled list |
| `Approve Anyway` | **KEPT** — the settled list, now floor-gated server-side |
| `Toast` | **KEPT** |
| pending-first order | **KEPT** — becomes deck order, server-sorted oldest first |

**The gesture is an enhancement, never the only path.** Every verb has a deterministic equivalent cells can drive: on-card buttons, desktop `A`/`R`, and the bulk checkbox. The swipe is layered on top. The A/R handler refuses to fire while a text field holds focus — a typed custom reason is not a verdict, and that has its own cell.

**Fork 5, rendered.** `photos · floor 6` (the number the grant enforces) and `visible to couples` (the approved subset the feed renders) sit side by side, each labelled for what it measures. The floor number comes from the server row; a cell asserts the deck holds **no client-side floor constant**, and M4 mints one and watches it redden.

**A partial bulk batch reports both numbers.** `Approved 5. Refused 2: …` — never a bare success count over a batch that wasn't. That is the F-07.90 family the f0790 bench was built for, applied to a new surface.

### §0.2 — the preview is a link, not a re-render, and I want that on the record

Fork 6(a) shipped its server door in the dream-os ZIP: `GET /api/v2/admin/discover/preview/:vendorId`, calling the same `getDiscoverPreview` the vendor's own preview calls. The deck **does not mount `VendorProfileView`** — it links to the portfolio surface.

The reason is the singularity rule. `VendorProfileView` takes a `DiscoverVendor`, and building one on the admin side from a hand-assembled object is the second implementation `getDiscoverPreview`'s own header and the sanctuary's comment both forbid. Mounting it properly means threading the preview payload's type across the admin client, which is real work and is not a byte the chair ruled on. **So the spec's 「 you approve what couples will see 」 is PARTIALLY delivered**: the deck shows name, category, city, both photo counts, the floor margin and the vendor's pitch, and one tap away is the portfolio. The full in-card render is named here as unbuilt rather than quietly counted as done — and it is the natural first rider of the next admin sitting, now that the server door exists and is bench-covered.

---

## 4 · THE MINT SHEET

`People → + New` on both Makers and Dreamers. Every rendered byte is from the vetoed inventory; nothing was improvised.

**Both F-10.47 outcomes have their own card.** `Vendor created` / `Couple created` on a real birth; **`Already on TDW`** with 「 This number already had an account. Nothing was overwritten. 」 on a collision. A cell asserts the card branches on `outcome` and **never** on the legacy `created` boolean.

**The handle line is honest and its mechanism is named in-comment (F-06.85):** 「 Handle is minted when they finish onboarding on WhatsApp. 」 is true *because* `routing_handle` is written at the end of conversational onboarding. If a future sitting mints it earlier, that comment forces the sentence to be re-read.

**`Send welcome` is wired and dark.** The button is **not** hidden and **not** disabled — the refusal is the proof the gate works. The sheet asks the server whether Meta has approved (`/mint/welcome-status`), renders 「 Welcome template is not approved by Meta yet. 」 before the tap, and after a tap shows the transport's own sentence. A cell asserts the sheet never says "sent" unless the server said sent.

**Declared gap, at the site and here:** `couples.partner_name` is not written. `captureField` refuses it by name, and giving the admin plane a second writer for a column one module deliberately guards is unruled. The sheet's field is labelled `Names` for what it stores — `users.name`.

---

## 5 · THE f0790 RETIREMENT — PERFORMED, WITH A NAMED CARRIER

CE-200 ratified F-10.31's disposition; P2's ZIP retired the subject and carried nothing, so the instrument spent a phase pinning a screen that did not exist. **This ZIP is the named carrier.** §1–§4's anchors are recorded **verbatim** in the bench file, the never-a-false-zero law is pointed at its new home (`tdw10_p2_bridge.proof §3`), and two new cells make the retirement *mechanical* rather than announced: §R.1 asserts the six-tile dashboard is really gone, §R.2 asserts the law really landed.

**§0's stripper cells were NOT deleted with the screen.** They pin `stripComments` itself — F-07.74's mid-token `/*` cure, its vacuity twin, and F-07.99's invocation cell. Those are properties of a shared module every comment-stripping bench depends on, re-aimed at this file as their specimen. Deleting them would have retired a module's only direct guard along with a page it never belonged to. **8/8.**

---

## 6 · §0.2 — TWO SEALED BENCHES MOVED, AND A SIXTH FLOOR RED THAT IS NOT MINE

**(a) `tdw10_p2_retint` 71 → 76. Labelled amendment, ratify-or-revert, and the count is NOT preserved.**
F-10.46's cure required the pair set to be derived rather than listed, and a derived set covers more roles than the hand-written eighteen — five more pairs are now asserted. The retired array is recorded verbatim in the bench. This is a strengthening, but it is still a sealed instrument changing size, so it is disclosed rather than absorbed.

Two defects of my own inside that derivation, both caught by reading a red instead of relaxing it:
- The first draft read `DECLS` — which is `strip(TOKENS)`, comment-stripped. The citations **are** comments, so it found **zero pairs**. It surfaced as a red only because I had written a floor cell (`≥ 12`) beside it; a bare loop would have paired nothing and passed silently. That is the independent-method law paying for itself in the same hour it was applied.
- The second draft matched `;\s*/*`, which reaches the *next* block's leading comment. It paired `--admin-nav-bg` — a gradient with no trailing comment — against the prose beneath it and reported a donor mismatch that was the regex's own reach. Restricted to same-line `[ \t]*`.

**(b) F-10.46's own shape, for the record.** The two live sites (`--admin-nav-top`, the `--admin-nav-bg` stop) plus the `:29` mapping arrow all carried `#160F0C` while citing `DARK.sheetBot`. They survived F-10.34's cure because that cure's pair set was enumerated from what the hand had found. The paragraph in `tokens.css` had already written the argument — *"only an instrument checks the ones it is not"* — and then the instrument was built from the hand's list. **This is a rendered-value change on the admin nav.** One unit of green, imperceptible, but it is a live value and you should know it moved.

**(c) F-10.49 PROPOSED — `tdw_f0774_stripper` was ALREADY RED at `33f7c1d`, 33/35, undeclared.** Not in any attributed list, not in the kickoff, not in P1's or P2's floor. Two cells:
- **§6.3** — a copy of the naive stripper rule has grown back, in **`tdw10_p1_shell.proof.mjs`**.
- **§6.5** — an unguarded line strip survives, in **`tdw10_p2_bridge.proof.mjs`**. It eats the tail of every `https://` it meets.

Both are P1's and P2's own benches; the coverage instrument built to catch regrowth caught it and nobody read the red. **My delivery does not add to it:** `tdw10_p3_deck.proof.mjs` declared its own `strip()` in its first draft and has been **converged onto `stripComments`**, with a `TDW_STRIPPER_CANARY` block and an invocation cell, so §6.1 and §6.4 stay green. The bench reads **33/35 before and after** — unmoved by me. Cure is not this sitting's; it is two small bench edits and a chair ruling.

---

## 7 · FOUNDER SMOKE CARD — you perform, I read the evidence

Thumb-path derived for every step. Fixture state is known: `vendor_discover_requests` is **empty**, so the deck starts at 「 Nothing waiting. 」 and the walk *creates* its own subjects through real doors. **No seeded rows.** Push dream-os first — it is already at origin.

| # | Do this | What proves it |
|---|---|---|
| 1 | On your phone, open the admin. Go to **People → Makers**. Tap **+ New**. | The sheet rises. Phone, Business name, Category, City. |
| 2 | Mint **a phone with no existing TDW account** — your choice, any spare number. | Card reads **Vendor created**, and beneath it: 「 Handle is minted when they finish onboarding on WhatsApp. 」 |
| 3 | Tap **Send welcome**. | It refuses: 「 Welcome template is not approved by Meta yet. 」 — the gate working, no template spent. |
| 4 | Tap **Add another**. Mint **9888294440** (Dev Test Studio) with any business name. | Card reads **Already on TDW** — 「 This number already had an account. Nothing was overwritten. 」 **This is F-10.47.** Check Makers afterwards: the name `dev` is unchanged. |
| 5 | Go to **Marketplace → Approvals**. | 「 Nothing waiting. 」 The deck is honest about an empty queue. |
| 6 | Sign in to the vendor app as **Swati** (`+918595356978`). Go to Discover → submit a request. | Her request lands. |
| 7 | Back in admin → **Approvals**. | Her card: name, category, city, **10 photos · floor 6** and **9 visible to couples** — two numbers, two labels. Her pitch below. |
| 8 | Swipe **left** (or tap **Reject**). Pick **Photos too similar**. | Toast: 「 Rejected — the reason is on their screen. 」 |
| 9 | On the vendor app as Swati → Discover. | **Not Approved**, and the reason reads *Photos too similar* — the chip you tapped, verbatim. **This is 「 rejection teaches 」, end to end.** |
| 10 | Tap **Re-apply** there. Submit again. | A fresh request appears on the deck. |
| 11 | On the deck, swipe **right** (or tap **Approve**). | Toast names her. She is back on Discover. |
| 12 | On desktop, open Approvals and press **A** then **R** on a card. | Approve fires; R opens the reason chips. |
| 13 | **The floor arm.** As **Dev Test Studio**, upload six photos, request Discover, then delete one so five remain. On the deck, try **Approve**. | Refused: 「 Below the 6-photo floor — cannot approve. This vendor has 5. 」 **Server-side**, not a greyed button. |

**Steps only your device can witness** (the bench is blind to these by construction): the swipe actually reading as a swipe under your thumb; the 48px targets on your handset; the reason chips not wrapping badly at your viewport; the one unit of green on the nav ground.

**Named so it is not a surprise:** step 8 takes Swati off the Discover feed until step 11 puts her back. She is founder-declared test property and the walk returns her to exactly where she started — no rows destroyed, no photos deleted. Only Dev Test Studio's throwaway uploads are touched, at step 13.

---

## 8 · WHAT THE NEXT SITTING PICKS UP

- **The in-card `VendorProfileView` render** — §3's declared partial. The server door exists and is covered; threading its type across the admin client is the rider.
- **F-10.49** — the two pre-existing stripper-rot cells in P1's and P2's own benches.
- **F-10.48** — the fourth couple-birth writer at `src/api/couple/auth.js` (dream-os handover §5).
- **F-10.44's full cure** — one column per author, DDL, 0113's sitting.
- **F-10.23 / F-10.24** — entered at CE-201 per the chair's own correction.
- **`tdw_enquiry_brief_vendor` and `tdw_vendor_welcome`** on the founder's Meta shelf.

Findings spent across both P3 ZIPs: **F-10.43 · .44 · .45 · .46 · .47**, plus **.42** settled and **.31** discharged. Proposed: **.48**, **.49**. Next free: **F-10.50**.

*Sequencing beyond this sitting is the founder's.*
