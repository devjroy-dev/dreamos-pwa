# TDW_10 · ADMIN P1 — THE SHELL · EXECUTOR HANDOVER (dreamos-pwa)

**Base:** dreamos-pwa `f9b0600` · dream-os `218ed59` (paired sitting; the search endpoint ships in the dream-os ZIP)
**Charter:** TDW_10 LE kickoff, twenty-fourth chair · **Rulings:** CE relay #1, R-A1 → R-A7 · **Numbers:** four, ratified
**Role:** LE. Nothing here was pushed. The founder pushes, sequenced pwa → dream-os or dream-os → pwa at his word.

---

## 1 · WHAT SHIPPED

| File | State | What |
|---|---|---|
| `app/admin/_components/tokens.css` | NEW | The admin dark token set (R-A1 arm c) |
| `app/admin/_components/adminNav.ts` | NEW | The six-domain registry + the 37-route mapping table |
| `app/admin/_components/CommandPalette.tsx` | NEW | ⌘K / pull-down palette |
| `lib/admin-api/search.ts` | NEW | Typed client for search + recents |
| `app/admin/layout.tsx` | REWRITTEN | The shell: six domains, tokens, gold accent, mobile domain bar |
| `scripts/tdw10_p1_shell.proof.mjs` | NEW | This phase's bench, 53 cells |
| `scripts/tdw08_p5_prospects_console.proof.mjs` | LABELED AMENDMENT | Two cells re-aimed, count preserved at 54 — §4 |

`requireAdmin` untouched (dream-os side, hash-pinned by that ZIP's bench). No route path moved. No migration.

---

## 2 · THE PROOF

**New bench, both ways, chair-reproducible:**
- `tdw10_p1_shell.proof.mjs` **53/53** at the cured tree.
- **17/53** at pristine `f9b0600`. **36 cure cells RED** at the uncured tree, on exactly the cures.

**The 17 greens at pristine, classified honestly — because a vacuous green is worse than a declared gap.**
*Genuine guards* (assert something true at both trees, and would redden if broken): the `#0F1622` meta exception · the borrowed role names still declared by `theme.ts` · `data-theme` set by nothing · the disk's 37-route denominator · F-08.42's transform-free keyframe · the auth gate · the login bypass · F-09.20's absent invite surfaces. **Eight.**
*Vacuously green at pristine* (they pass because the file they read does not exist yet, and they are negative assertions): the three "names roles, not colours" cells for files that are absent · "admin-only" · "every table row is a real route" · "no RETIRES-AT-09" · "no domain-prefixed route" · the money-register cell · the W-1 cell. **Nine.** They are real guards at the *cured* tree — which is where they will run from now on — but they prove nothing at pristine and are not counted as if they did.

**Floor at the cured tree — thirteen benches, all at their exact prior counts:**
`home 67/67` · `landing 98/98` · `type 16/16` · `surface 51/51` · `roles 130/130` · `money 18/18` · `palette 18/18` · `theme_retire 16/16` · `p3_landing 89/89` · `console 55/55` · `factory 45/45` · `invite_spent 14/14` · `prospects_console 54/54` (after §4's amendment).
Also run because it reads `app/admin/layout.tsx`: `tdw07_f0784_panel 34/34`, byte-stable, unchanged at both trees.

**tsc:** `rm -rf .next && npx tsc --noEmit` → **0 errors**.

---

## 3 · DECLARED GAP — `npx next build` cannot run in this container

`npx next build` exits 1 here with four `Failed to fetch … from Google Fonts` errors (`Cormorant Garamond`, `DM Sans`, `Italiana`, `Jost`). **Reproduced at the UNTOUCHED pristine tree, identically, 4/4** — so it is the container's egress allowlist (`fonts.googleapis.com` is not on it), not this delivery. **Zero build errors name any file in this ZIP.** The protocol's §6 frontend gate is `tsc --noEmit`, which is green on a cleared cache. Vercel's builder reaches Google Fonts; the real build is the founder's push. Stated rather than discovered.

---

## 4 · LABELED AMENDMENT — `tdw08_p5_prospects_console`, count preserved

The sealed bench asserted "Prospects is reachable from the nav" by matching a **nav literal inside `app/admin/layout.tsx`**. P1's six-domain IA moved the registry to `_components/adminNav.ts`. **The screen did not move, its path did not change, and it is now reachable two ways** (nav entry *and* the palette) — only the instrument's address moved.

Both cells re-aimed at the new home with strength preserved: `§7.1` still asserts the registration; `§M.4` still *deletes* it and demands the cell go red. Count unchanged, **54 → 54**. The retired anchor is recorded verbatim in the bench file so the amendment can be read against what it replaced. This is CE-45 Ruling №1's shape (bench-follows-the-law); it is **ratify-or-revert** and is disclosed here rather than absorbed.

No other bench in either repo pins a nav literal — derived by command: only three pwa benches read `app/admin/layout.tsx` at all, and the other two (`tdw07_f0784_panel`, `tdw08_console`) assert auth and animation, both green untouched.

---

## 5 · THE MAPPING TABLE (R-A3) — 37 non-login routes, all accounted

Derived by `find app/admin -name page.tsx`, minus `/admin/login`. The bench re-derives this **by filesystem walk**, never by reading the table back out of itself.

**LIVE — mounted in a domain (18 + the Bridge)**

| Domain | Sections |
|---|---|
| — (destination) | `/admin` The Bridge |
| **Growth** | `/admin/prospects` · `/admin/demo` |
| **Marketplace** | `/admin/approvals/discover` · `/admin/approvals/photos` · `/admin/vendors/portfolio` · `/admin/couture` · `/admin/hot-dates` |
| **People** | `/admin/makers` · `/admin/dreamers` · `/admin/conversations/vendors` · `/admin/conversations/brides` |
| **Money** | *(none — honest empty state, see §7)* |
| **Engine** | `/admin/config` |
| **Content** | `/admin/content/landing` · `/admin/content/exploring` · `/admin/content/spotlight` · `/admin/content/muse-pool` · `/admin/content/surprise-me` |

**RETIRES (1)** — `/admin/content/heroes`, stamped **RETIRES-AT-SPOTLIGHT-CONSOLIDATION** per R-A4 (the sitting's name, never a block number). Mounted because it works today; excluded from the palette; the nav shows the operator a `retiring` mark.

**PHANTOM (18)** — routes that exist and nothing links to. Tabled with a domain and a note each, deliberately **not mounted**: F-07.95 is masterplan row 10's inheritance, owned whole at its own sitting, and mounting eighteen unaudited surfaces would launder them into the founder's nav.
`/admin/discover-heroes` · `/admin/approvals` · `/admin/photos` · `/admin/featured` · `/admin/preview` · `/admin/exploring` · `/admin/images` · `/admin/vendors` · `/admin/couples` · `/admin/messages` · `/admin/collab` · `/admin/money` · `/admin/revenue` · `/admin/subscriptions` · `/admin/health` · `/admin/data` · `/admin/control-room` · `/admin/dashboard`

**CORPSE (1)** — `app/globals.css` `[data-theme="dark"]` (:123), the ancestral "Enterprise Design System" block. Per R-A1 rider (i): **not revived, not deleted**, disposition **P6-SWEEP**. Verified genuinely unreachable — `data-theme` is *set* by nothing in the tree, asserted by a cell that distinguishes a setter from a description.

---

## 6 · §0.2 REPORT — the redirect clause, and what was NOT built

The charter says deep links are "preserved via redirects." **P1 moves no route path**, so there is nothing to redirect: `/admin/couture` is `/admin/couture` before and after, and the bench asserts all eighteen previously-offered paths byte-identically. The clause is **discharged by construction**, not skipped.

The arm that *would* need redirects — domain-prefixed URLs (`/admin/marketplace/couture`) — is **NOT BUILT**, and is named here so its absence reads as a decision rather than an oversight. It is an unruled arm; under the unruled-arm law an unruled arm is not built. If the chair wants prefixed URLs that is a fork with 37 redirects attached and a live-deep-link risk, and it deserves its own evidence rather than an inference from one word.

---

## 7 · DISCLOSURES — every one by name

**D-1 · I mis-stated the nav count in my read-first.** I wrote "the `NAV` const exposes **17**." It exposes **19** (Overview 1 · People 3 · Content 6 · Approvals 2 · Conversations 2 · Commerce 2 · Outreach 2 · Config 1). The phantom arithmetic was right by accident — 37 − 19 = 18 phantoms, which is the number I quoted and the number the bench now derives. Caught while building the mapping table, corrected here, and the chair's relay repeated my wrong figure so the correction is owed in both directions.

**D-2 · The spec's §2 HEADING still reads "ladder after 09 = next 0085."** R-A6 quoted the ROW edit verbatim and I applied exactly those bytes. The heading one line above now contradicts the corrected row. I did **not** fix it: the chair quoted the edit "so zero drift," and widening a quoted edit is the unruled-arm shape. It is a one-line chair edit whenever you want it.

**D-3 · Three of my own bench cells were self-convicting on first run and I fixed them.** (i) the `data-theme` cell convicted the mapping table's own CORPSE row for *describing* the attribute — re-authored to look for setters (`setAttribute`, JSX attribute) instead; (ii) the rose-literal cells convicted the paragraph *recording* the retirement — re-authored to read comment-stripped code, as §1 already did; (iii) the domain-prefix cell convicted the §0.2 report for naming the unbuilt arm by example — re-scoped to the `path:` fields.

**D-4 · One cell's label described a different quantity than its assertion.** It read "the table has 37 non-login rows" while asserting the *disk* count. A label that names a different number than the check is how a green comes to mean nothing. Split into two cells, both green, both labelled for what they measure.

**D-5 · One cell in the dream-os bench was a tautology and could never have gone red.** The `requireAdmin` hash cell compared `sha(file)` against an expression that recomputed `sha(file)`. It is now pinned to the literal `dd9705685bba3875` (witnessed at `218ed59`) and carries a mutation cell that adds one character and watches it redden. Recorded rather than quietly repaired.

**D-6 · The `?focus=<id>` jump parameter has no reader today.** Search hits jump to the correct owning list (`/admin/makers?focus=…`) — the list loads, the row is in it, and **nothing scrolls to or opens it**, because no mounted surface reads `focus`. It is a forward contract for P3's detail sheets, declared in the route file and here, not claimed as working.

**D-7 · The `Money` domain ships with zero sections.** A-1 rules six domains and six ship. Every candidate route (`/admin/money`, `/admin/revenue`, `/admin/subscriptions`) is a PHANTOM, and F-10.1 is the deeper reason — `billing_events` does not exist. The domain renders one honest sentence rather than an empty box or a hidden tab.

**D-8 · The `.fade-up` comment's second application no longer exists.** The F-08.42 paragraph named `app/admin/invite-requests/_list.tsx` as a second site the class had to reach; that file died at `1c5e0f9`. The paragraph is re-authored to say so, the cure's reasoning preserved intact, and the class now has exactly one application — the wrapper, whose fixed descendants now include the palette's own scrim.

---

## 8 · D-2 DELETION RECORD (R-A2) — the corpses, logged not re-killed

P1's item 3 was **discharged by a predecessor one day before this charter**. Nothing was deleted by this delivery. For the record:

`dreamos-pwa 1c5e0f9` (2026-08-05, "F-09.20 retirement A") — `app/admin/invite-requests/_list.tsx` (234 ln) · `…/dreamers/page.tsx` (5) · `…/makers/page.tsx` (5) · `…/page.tsx` (9) · `app/admin/invites/page.tsx` (144) · plus `app/admin/layout.tsx` (−5), `app/admin/page.tsx` (−26 net), `app/vendor/auth/handoff/page.tsx` (76), `lib/admin-api/index.ts` (−11). **509 deletions.**

`dream-os 937c993` (same day, "retirement B") — `src/api/admin/invites.js` (132) · `src/api/admin/waitlist.js` (62) · `src/api/invite.js` (193) · `src/api/register.js` (124) · `src/api/router.js` (−5). **516 deletions.**

Grep at `f9b0600` / `218ed59`: **zero consumers**, both repos. One stale *comment* pointer survived at `layout.tsx:64` and is cured in this ZIP.

**DISAMBIGUATION, so a future session does not delete the wrong thing.** `src/admin/views/invite.js`, `inviteMint.js`, `unifiedInvite.js`, `coupleInvite.js` and the `/invite` routes in `src/admin/router.js` are **the legacy server-rendered Express panel at `/admin`** (Panel A, Railway, break-glass) — a *different surface* from the Next.js admin, still live-mounted at `src/index.js:159`, and **outside this charter entirely**. They are not the corpses. Do not sweep them without their own ruling.

---

## 9 · FOUNDER SMOKE CARD — you perform, I read the evidence

Thumb-path derived for every step. Run on a phone first (A-4 is the point), then desktop for step 6.

| # | Do this | What proves it |
|---|---|---|
| 1 | Open the admin on your phone, sign in as usual. | You land on The Bridge. The **wordmark is GOLD**, not rose. |
| 2 | **⚑ VETO SLOT — the one aesthetic byte where spec and screen disagreed.** The accent was rose `#C44058`; the spec reserves gold for the wordmark + genuine alerts, and the chair ruled the spec. Look at the wordmark, the active nav mark, and the bottom bar's active domain. **Veto here if wrong** — one word and it goes back, no argument. (For what it's worth: rose measured 3.31:1 on the cockpit navy, gold measures 7.18:1.) | Your word. |
| 3 | Look at the bottom of the screen. Tap through all six domain buttons one-handed, thumb only. | Six domains — Growth, Marketplace, People, Money, Engine, Content — each raises a sheet of its sections. Money says one honest sentence instead of being empty. |
| 4 | From the raised sheet, tap **Prospects**. Then use the bottom bar to reach **Demo Profiles**, **Makers**, **AI Caps**. | Each opens the same screen it always did. Nothing 404s. |
| 5 | Tap **Jump** in the top bar. Type a vendor's name (try `9888294440`'s business name, or just `de`). | Results appear grouped — Vendors, Couples, Prospects, Demo, Leads — twenty at most. Tap one: it opens that section's list. **Known and declared: it does not scroll to the row.** |
| 6 | Close the palette. Re-open it and type nothing. | Your last jumps are listed under **Recent**. |
| 7 | On desktop, press **⌘K** (or Ctrl-K) from any admin screen. | The palette opens. Arrow keys move, Enter jumps, Escape closes. |
| 8 | In Content, look at **Heroes**. | It carries a small `retiring` mark, and it does **not** appear in the palette. That is deliberate — it dies at the spotlight consolidation. |

**Steps only your device can witness** (the bench is blind to pixels by construction): the gold reading correctly against the navy on a real screen; the domain bar being genuinely one-handed on your handset; the raised sheet not clipping at your viewport height.

---

## 10 · WHAT THE NEXT SITTING PICKS UP

- **F-10.1** — `billing_events` exists only in spec prose. Blocks P2's revenue line and P5's Money domain whole. Cure home is the chair's: a pre-P2 rider or P2's opening fork.
- **F-10.2** — the 0085 collision, cured by R-A6; `0113` is RESERVED and unwritten.
- **D-2 above** — the spec §2 heading, one chair line.
- **D-6** — wire a `focus` reader at P3, and the palette's jumps land on the row instead of the list.
- **P6-SWEEP** — the `[data-theme="dark"]` corpse, and acceptance number 1 going estate-admin-wide.
- **F-07.95** — the eighteen phantoms are tabled with dispositions and ready for their sitting.

Findings **F-10.3–.20** remain unspent. Nothing was allocated by this delivery.

*Sequencing beyond this sitting is the founder's.*
