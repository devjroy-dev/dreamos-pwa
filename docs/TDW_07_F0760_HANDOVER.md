# TDW_07 · F-07.60 — THE CLAIM FLOW OPENS IN PLACE

**Executor handover.** Repo `dreamos-pwa`, base `adf573d` (re-derived at origin, fetch-first, at build open and at delivery). One sitting, one repo — **zero `dream-os` bytes**. Nothing here is a CE-numbered entry; `FINDINGS_LOG.md` and the masterplan are untouched by this delivery.

---

## 1 · WHAT SHIPPED

Four files. One new component, two edits, one new bench.

| File | Change |
|---|---|
| `components/demo/DemoClaimSheet.tsx` | **NEW.** The claim sheet extracted whole from `app/demo/vendor/[handle]/page.tsx:263–313` at `adf573d`, plus its submit hand from `:87–117`. Fork **A1**. |
| `components/demo/DemoVendorHeader.tsx` | The Claim control opens the sheet **in place**; the `router.push(…?claim=1)` is gone. The sheet mounts as a fragment **sibling after `</header>`**. Fork **B1**. |
| `app/demo/vendor/[handle]/page.tsx` | The inline sheet markup, its four states and `handleClaim` replaced by the shared component. Both of the landing's own entries preserved. Fork **C1**. |
| `scripts/tdw07_f0760_claim.proof.mjs` | **NEW.** 76 cells, ten mutations, all run. |

**The disease, dead:** `DemoVendorHeader.tsx:133` no longer navigates. A vendor standing in the dark studio taps Claim and the sheet rises over the studio he is already in — no hero re-load, no route change, no lost context.

---

## 2 · WHAT IS PROVEN

**`tdw07_f0760_claim` — GREEN 76/76.**

| § | Proves |
|---|---|
| §1 (8) | the header opens instead of sending; the three mode navigations survive untouched |
| §2 (6) | **the sibling-after-`</header>` law** — the constraint ruled AS LAW |
| §3 (9) | one sheet, one home; the landing carries no second copy; every frozen node single-homed |
| §4 (11) | the frozen copy at the byte — `&apos;` entities, the U+2026, the U+2192, the single `<br />` |
| §5 (9) | **the wire seam** — target, method, headers, and the identity field's byte-equivalence |
| §6 (4) | F-07.37 survived the extraction |
| §7 (6) | the landing's two entries alive |
| §8 (6) | control inventory C1–C6, each KEPT |
| §9 (5) | geometry frozen — zIndex 100/101, position:fixed, the panel's blur and safe-area padding |
| §10 (5) | the eighteen mounts inherit it with zero per-page edits |
| §11 (3) | no navigation anywhere on the claim path |
| §12 (4) | the two disclosed deviations, benched so neither surface regresses |

**Both-ways: ten mutations of PRODUCTION source, each run in a FRESH node process, each `cmp`-restored to byte-identity. All ten RED. None vacuous.**

```
BASELINE                                                  GREEN 76/76
M-1  Claim onClick → router.push(…?claim=1)               RED 72/76  §1.1 §1.2 §1.3 §11.3
M-2  <DemoClaimSheet/> moved INSIDE, above </header>      RED 74/76  §2.2 §2.5
M-3  header backdropFilter blur(40px) removed             RED 75/76  §2.4   (the law's premise)
M-4  vendor_name: vendorName ?? handle → vendorName       RED 75/76  §5.4   (the wire seam)
M-5  !res.ok || data?.ok === false → false                RED 75/76  §6.1   (F-07.37 un-cured)
M-6  done body split into two <div>s                      RED 74/76  §3.9 §4.5
M-7  a "Close" button added to the done state             RED 74/76  §4.11 §8.6
M-8  scrim zIndex 100 → 200                               RED 75/76  §9.1
M-9  the ?claim=1 effect body deleted                     RED 74/76  §7.1 §7.2
M-10 font stack reverted to the landing's literals        RED 75/76  §12.1
RESTORED (cmp byte-identical)                             GREEN 76/76
```

**The caching law, satisfied not assumed:** the bench holds no module cache of the files it judges — every read is `fs.readFileSync` at call time — and every mutation is proven across a **process boundary**, never by re-calling a function inside an already-warm process. The bench says so in its own header.

**FULL PWA FLOOR, re-run whole at the cured tree, strictly sequential, on a cleared `.next`:**

```
tsc --noEmit                EXIT 0, zero output
tdw07_p1_discover           GREEN 37/37
tdw07_p2_profile            GREEN 42/42
tdw07_p3_portfolio          GREEN 111/111
tdw07_p4a_ig                GREEN 63/63
tdw07_p4b_slice1            24/24
tdw07_p4b_probe             27/27
tdw07_p4b_body              GREEN 122/122
tdw07_f0760_claim           GREEN 76/76      ← new
```

All seven inherited benches **byte-stable at their sealed counts**. Zero labeled amendments. Zero skipped benches — the floor-method law has nothing to disclose this sitting.

**W-1:** zero soul bytes exist on this surface and none were authored. **The landing's `<style>` block, the swipe pager, `layout.tsx`, and all eighteen demo pages are 0-line.**

---

## 3 · WHAT DRIFTED — DISCLOSED, NOT PAPERED

### 3.1 · Two rendering-fidelity deviations from a byte-for-byte extraction

Both are declared in-file at the top of `DemoClaimSheet.tsx` and both are benched (§12). **Neither moves a user-facing byte.**

**DEVIATION 1 — the font stack is layered, not copied.** The landing declared literal family names (`'Cormorant Garamond'`, `'DM Sans'`, `'Jost'`) because the landing — and only the landing — `@import`s those families from the Google CSS API in its own `<style>` block (`page.tsx:140`). The other eighteen surfaces get their fonts from `next/font/google` in the root layout, which self-hosts them under **hashed** family names exposed only as CSS variables (`app/layout.tsx:13–39`). A literal `'Cormorant Garamond'` on the studio route resolves to nothing and falls through to Georgia. The stack now lists the variable **first**, the literal **second**. On the landing the variable also wins (the root layout sets these vars on `<html>`, which the landing is inside) and resolves to the same typeface at the same weights — `next/font` loads Cormorant 300 italic, DM Sans 300, Jost 300/400, every face this sheet asks for.

**DEVIATION 2 — the placeholder colour travels with the sheet.** `00000 00000` was coloured by a **global** rule inside the landing's own `<style>` (`page.tsx:145`). That rule reaches no other surface, so the extracted sheet would have rendered the placeholder in the browser default grey on eighteen of nineteen surfaces. The rule comes along, scoped by class so it cannot touch any other field. The **value** is unchanged.

### 3.2 · A bench cell corrected before it ever went green

`§3.9` first listed `Our team will reach out shortly.` and `We verify every profile personally.` as two separate entries and went **RED at ×2** on the second. The second home is **`app/(landing)/page.tsx:881`** — the **public marketing landing's** request-done screen, which renders a *different* node that happens to open with the same sentence:

> `We verify every profile personally.<br />We'll reach out on Instagram or WhatsApp.`

That co-home **predates this sitting**, sits on a surface outside this charter, and curing it would be copy work nobody chartered. The cell was asking the wrong question: the frozen unit is the **whole node the founder vetoed**, which is why `:284` is one entry and not two. The cell was re-aimed to node granularity and the collision written into the bench in-comment. **A green bought by shortening the string would have been a green bought by deleting the evidence.** Filed here rather than papered.

### 3.3 · A stale comment left standing, deliberately

`page.tsx`'s `?claim=1` effect still carries its original comment `// Auto-open claim sheet if ?claim=1 (from header dropdown)`. As of this sitting that is history, not description. **Fork C1 said byte-untouched, so it is byte-untouched** — the correction was added as a **new** comment block above rather than by editing the preserved bytes. Named here so the next reader does not read it as comment-vs-code drift (F-07.18's class) and does not "fix" it into a byte change.

### 3.4 · `API_BASE` removed from the landing

It existed in `page.tsx:16` solely for the claim POST at `:105`. With `handleClaim` gone it was dead. Removed, with a comment naming where it went. The landing's vendor read goes through `lib/demo/api`, which carries its own copy of the identical constant. Zero behavioural delta.

---

## 4 · FILED, NOT FIXED — three items for Block 08

1. **The Toast overlap.** Eight of the eighteen demo pages mount `<Toast/>` at `zIndex: 9999`, above the sheet's frozen `101`. A visible toast can paint over the sheet. **Not cured by CE ruling** — the z-index is frozen and a 2.6-second toast racing a deliberate open belongs to the block that owns this surface. Recorded in `DemoClaimSheet.tsx` in-comment and benched at §9.5 so nobody silently cures it either.
2. **Two dead components.** `components/demo/DemoHeader.tsx` and `components/demo/DemoNav.tsx` have **zero mounts** anywhere in `app/`. Untouched this sitting.
3. **A missing rewrite target.** `middleware.ts:47` rewrites unmatched `demo.*` paths to `/demo/not-found`; **`app/demo/not-found` does not exist** (`app/demo/` holds only `bride` and `vendor`). Untouched this sitting.

**F-07.63** (the Cloudinary 404 behind the studio's console ❌) is chair-authored and founder-run. **Zero bytes of it are in this ZIP.**

---

## 5 · WHAT THE NEXT SITTING PICKS UP

The auth sitting (F-07.62 + the token crossover + the 403 specimen), then **P6 under F-D**. Nothing in this delivery pre-empts Block 08's restructure of this surface: the sheet's home is `components/demo/`, deliberately outside the `app/demo/**` tree that block will churn; the lifecycle, the claimed-truth, F-07.29, F-07.41's full auth and F-07.61's lifecycle are all untouched.

---

## 6 · THE FOUNDER'S SMOKE CARD

**You only perform and paste. I read the evidence.**

**Fixture state of record** (CE relay, `/admin/demo` → Profiles): the five live cards are `legacy_jewellers` · `neha_bhasinstudio` · `shruti_bridalwears` · `rajat-singania` · `weddingdecor.india`. **Admin CLAIMS reads 0** — a clean baseline. Walk **`legacy_jewellers`**; any of the five works.

| # | You do | I read |
|---|---|---|
| 0 | Confirm the deploy is green on Vercel and hard-refresh once (this repo ships a service worker; a stale bundle would test yesterday's code) | your word that the build is green |
| 1 | Open `demo.thedreamwedding.in/vendor/legacy_jewellers/studio` — the dark studio, chat and all | screenshot: you are in the studio |
| 2 | Tap the profile coin (top right) → **Claim Your Studio** | — |
| 3 | **THE CURE:** the sheet rises from the bottom **and the studio is still visible behind it**. The URL bar must NOT change. | screenshot showing the sheet **over** the studio + the unchanged URL |
| 4 | Type a 10-digit number and tap **Claim Studio →** | screenshot of the done state: "Welcome to TDW." |
| 5 | Tap the dimmed area above the sheet to dismiss | screenshot: **the studio is exactly where you left it** — same chat, same scroll, zero navigations |
| 6 | Reload `/admin/demo` → **Claims** tab | the count moved **0 → 1**, with your number and `legacy_jewellers` |
| 7 | Open `demo.thedreamwedding.in/vendor/legacy_jewellers` (the bare landing) → tap the strip → tap the small **Claim Your Studio** text link | screenshot: the same sheet, on the landing, still working |
| 8 | Open `demo.thedreamwedding.in/vendor/legacy_jewellers?claim=1` (type it) | screenshot: the sheet auto-opens — the preserved deep link |

**Reconciled against the build list, step by step:** step 3 ↔ §1/§2/§11 · step 4 ↔ §4/§5 · step 5 ↔ §8.1/§8.6 · step 6 ↔ §5 (the wire) · step 7 ↔ §7.3/§7.4 · step 8 ↔ §7.1/§7.2. **No step lacks a thumb-path.**

**The one truth only your handset can witness:** that the sheet *visibly* rises over the studio rather than being clipped into the header bar. The bench proves the mounting position that makes it possible (§2); it cannot prove the pixels. That is step 3, and it is why step 3 asks for a screenshot rather than a yes.

**No dashboard act, no env var, no SQL is required of you this sitting.**
