# ZIP 7 — R-37.76 · THE MOCK MADE TRUE

**Applied over `45d243c`. Floor: twenty cells, exit 0. `npx tsc --noEmit`: exit 0.**
**The mock is the contract. Deviations below are declared, not discovered.**

---

## §1 · THE NAMING GRAMMAR IS NOW LAW (R-37.78, as amended)

Three surfaces, each deliberate, and the handover states it so no future surface freelances a
fourth name:

| surface | byte | why |
|---|---|---|
| the dock | 「Ask TDW — "Am I free on 14 Feb?"」 | **the verb.** An affordance that invites the ask |
| the Rooms row | 「TDW on WhatsApp」 | **founder's byte, character-exact** |
| the manual's card bodies | 「DreamAi answers every enquiry…」 | **the name.** Prose attributes; it does not invite |

**Affordances invite. Sentences attribute.** All three live in `lib/worklist/copy.ts` under one
comment block so the grammar is readable at its home, not inferred from three call sites.

## §2 · THE DOCK IS AN INPUT (R-37.76 ①)

Rounded field, muted placeholder carrying one real ask, filled send glyph. The shape is the
argument: a noun in a bar reads as a trademark, which was the founder's exact complaint, and no
label teaches "you can talk to me" as fast as the costume of an input.

The tap opens the vendor line through `waNumberFor('vendor')`. **When Phase 5 lands the in-app
composer, one handler retargets and nothing else moves** — shape, placeholder and grammar are
already right.

## §3 · TODAY'S STATURE (R-37.76 ⑧, built to the mock)

- **masthead** — date (derived at render with a pinned locale, never a fixture), a numeral in
  the display family, a metal hairline. Phase 4 fills the numeral; the treatment does not move.
- **the promise is the headline**, set in the feature family at 24px.
- **byte 5 survives verbatim** and drops beneath it as a quiet line. *Today had no stature
  because its loudest sentence was an apology.* The honest statement stays; it stops leading.
- **Signal used sparingly** — one card carries a 2px signal edge, the send glyph is filled,
  the active door and the filter chips carry it. Everything else is ink.

## §4 · ONE IDENTITY, ONE VOCABULARY, ONE FONT WORLD

**R-37.79 — the medallion is the coin everywhere.** Initials derived from the wire; a vendor
with no name yet gets the glyph rather than an empty circle. The drawer is adopted **as-is** —
no row added or removed — under its two branch fixes: DISPLAY now reads **Graphite / Chalk**,
and every row rides the branch tokens. Its redesign is Phase 2's.

**R-37.76 ③+⑦ — the type roles are tokened** (`TYPE_ROLE`, `typeCss`) and emitted into the
branch scope exactly as colour was. Four families, one job each:

| family | job |
|---|---|
| Italiana | numerals and the masthead moment. Nothing else |
| DM Sans | **all** prose, rooms as well as shell |
| Jost | every micro-label |
| Cormorant | **retired from prose**; one deliberate line per surface |

**That last row is the actual cure.** The rooms were setting body copy in Cormorant *italic*
while the shell set prose in DM Sans — that, not size, is why they read as two font worlds.
**18 files** had their `script` role remapped to the body family.

**Full typographic rhythm parity inside rooms is Phase 2's rebuild**, stated here as ruled. What
this ZIP guarantees is narrower and checkable: **no vendor sees two font worlds or two theme
names again.** C19 holds both.

## §5 · R-37.80 · THE 42-SITE RAW-VAR DISPOSITION — NO SITE SILENTLY LEFT

ZIP 5's split read `A.brass` and was structurally blind to controls reaching for a raw CSS
variable. **8 converted now, 34 explicitly Phase 2.**

**CONVERTED NOW — controls, so they carry the signal:**

| site | what it is |
|---|---|
| `FilterRail.tsx:31` | the selected filter chip's border — **the mock's promise, now true** |
| `SliceShell.tsx:688-689` | the row selection checkbox |
| `BulkBar.tsx:32` | the bulk-action label |
| `AtelierForm.tsx:74` | a toggle's filled state |
| `InputBar.tsx:53` | the send button's gradient |
| `PeekNav.tsx:105` · `FilingChip.tsx:26` | summon affordance, filing chip |

**EXPLICITLY PHASE 2 — 34 sites, in three classes, each with its reason:**

1. **Correctly metal, no action needed (7)** — `TierMeter.tsx:27`, `ProfileMeter.tsx:18`,
   `Toast.tsx:51`, `SliceRow.tsx:193` and the local token-map declarations. These are *state*
   and *identity*, not action. Under the split's own rule they keep the metal. **Disposition:
   no change, ever — this is the rule working.**
2. **Token-map declarations at file heads (14)** — `V/tds:22`, `V/portfolio:236`,
   `V/featured:22`, `V/couture:21`, `V/contracts:22`, `V/calendar:40`, `V/page.tsx:45`,
   `V/discover/submit:23`, `V/collab/[post_id]/responses:32` and peers. These *define* `brass`;
   they don't paint. **Disposition: correct as-is.**
3. **Genuinely deferred (13)** — `OnboardingOverlay.tsx:213/216/221`, `TipsCarousel.tsx:244/250/254/394`,
   `pin/page:204`, `pin-login:209`, `pin-reset:350`, `portfolio:1018/1021`.
   **Reason stated rather than waved at:** the PIN surfaces and the onboarding overlay are
   pre-session chrome that a vendor meets *before* the shell exists, and TipsCarousel is the
   §8.10 tour. Converting them means deciding what the branch's pre-session identity is, which
   is a question this ZIP was not asked. **Disposition: Phase 2, with this sentence as the
   reason.**

## §6 · R-37.81 · DERIVED, BOTH LIMBS

### (a) 「Profile layout」 — near-zero wiring, as predicted

Two couple-facing surfaces exist at tip and they are one word apart:

| route | what its own header says it is |
|---|---|
| `/vendor/discover/profile` | the **editor** — "the spec calls this Profile Studio", founder-renamed 2026-07-29 |
| `/vendor/discover/preview` | the **couple view** — quotes the founder's contract of 2026-07-31: *"see what couples see"* |

The ruling asks for the couple view, so the row opens **`/vendor/discover/preview`**. The
surface already existed; it needed only an affordance. **C20 fails if it ever points at the
editor** — opening the wrong one of two routes a word apart is a label outrunning its
destination, which this arc has convicted twice.

**One flag, one word from the founder settles it:** the byte 「Profile layout」 reads like the
*editor*, while the destination is the *couple view*. Shipped character-exact as ruled. If it
was shorthand, 「How couples see you」 matches the drawer's own subtitle for the same idea.

### (b) The public Discover feed — REACHABLE, no session machinery needed

`app/(landing)/discover/page.tsx` is **five lines**:

```
export default function DiscoverPage() {
  return <DiscoverFeed isSignedIn={false} profileComplete={false} />;
}
```

**No guard, no redirect, no bride session.** `DiscoverFeed` takes `isSignedIn` as a prop and
uses it only to choose *which nudge* to show — it never bounces an anonymous visitor.
`middleware.ts` matches everything but `_next`/`api` and only rewrites for the `demodiscover.`
and `demobride.` hosts, so `/discover` on the branch domain serves the real feed.

**So limb (b) prices at one link, not at cross-lane session machinery. STOP not required.**

**Not shipped in this ZIP, and that is a decision, not an omission.** The ruling names the
Storefront room's Discover pill as its territory, and the Storefront room is still an A-4
interim deep-link into the old shell — there is no pill to put it in until Phase 2 builds that
room natively. Putting a 「Browse Discover」 row on the grid instead would seat inspiration
beside the vendor's own tools, which is a placement decision the founder should make with the
mock in hand rather than one I should slip into a build. **Proposal: it ships with the
Storefront room in Phase 2, and the founder's motive — the feed as inspiration and as pressure
to polish one's own profile — is recorded here as the feature's reason.** Limb (a), the higher-
value half by the ruling's own reckoning, ships now.

## §7 · CELLS

**C18** raw-var controls carry the signal · **C19** one theme vocabulary and one font world ·
**C20** the profile row opens the couple view.

**Four cells AMENDED BY LABEL, count-preserved, each stating its reason at the site** — the
shapes moved by ruling, so the cells followed the ruling rather than being loosened:

| cell | amendment |
|---|---|
| C9 | the wire read moved into `useVendorHandle`; the cell now asserts the hook is the **only** home and fails if Rooms or FirstRun fetch `/me` themselves. **Stronger, not looser** |
| C10 | `.wl-dock` → `.wl-dockfield` — the dock is an input now; `.wl-dock` is its padding wrapper |
| C11 | `wl-docktext`/`wl-dockglyph` → `wl-dockph` — the logo row died |
| C13 | the promise renders on `app/w/today`, not in FirstRun — it is the page's hero now |

**Proofs, each on its own defect, all restored `cmp`-identical:**

| cell | mutation | it said |
|---|---|---|
| C18 | filter chip back to `--role-metal` | *the selected filter chip still reads the metal* |
| C19 | one `Graphite` back to `Espresso` | *the rooms' drawer still names a retired theme* |
| C20 | `/preview` → `/profile` | *the row opens the EDITOR; the couple view is /discover/preview* |
| C9 | `handle` → `routing_handle` | *the wire field is `handle` (dream-os me.js:76)* |

---
---

# THE COMBINED WALK — ZIPs 5 · 6 · 7, ONE SITTING, REAL GLASS

**The founder's handset. The emulator is disqualified.** Account `9888294440`.
**Each beat labelled with the ZIP it convicts.** No write path — every beat is a read or a
navigation. `public/sw.js` is byte-unchanged this arc, so a hard reload suffices.

**Beat 0 · setup.** Wait for this push's deployment to read Ready. Delete the old home-screen
icon. *No claim.*

**Beat 1 · [ZIP 6] the home-screen launch opens the grid.** Open the branch domain, add to home
screen, launch **from the icon**. **Expect the grid.** The one beat no browser test can prove.

**Beat 2 · [ZIP 7] the dock is an input.** Look at the bottom of the grid, above the seats.
**Expect a rounded field reading 「Ask TDW — "Am I free on 14 Feb?"」 with a filled teal send
circle at the right.** No 「DREAMAI」 logo row anywhere.

**Beat 3 · [ZIP 7] the medallion is the coin.** Top right of the grid. **Expect your initials
in a metal ring**, not a ◎ glyph. Tap it. **Expect the drawer, with DISPLAY reading Graphite
and Chalk** — not Espresso, not Parchment.

**Beat 4 · [ZIP 7] the three rows.** Scroll below the bands. **Expect, in order:**
「TDW on WhatsApp / your 24/7 enquiry desk」 · 「Profile layout / how couples see you」 · your link
card showing `wa.me/917982159047?text=TDW-DEV440` in monospace with a Copy affordance. Tap Copy.
**Expect it to read 「Copied」.**

**Beat 5 · [ZIP 7] the profile row opens the couple view.** Tap 「Profile layout」.
**Expect the preview surface — your profile as a couple meets it**, not the editor with form
fields. If you get the editor, that is a red and C20 missed it.

**Beat 6 · [ZIP 7] Today has stature.** Tap Today. **Expect, in order:** today's date in caps,
a large `0` with 「needing you today」, a metal hairline, then the promise line as the biggest
sentence on the page, then 「Today is still being built. Nothing is being read yet.」 small and
quiet beneath it.

**Beat 7 · [ZIP 7] Business Solutions.** Rooms → the last tile. **Expect the tile to read
「Business Solutions」**, and the sheet to lead with 「Customised solutions for your business」 and
SEO/marketing/ads — with "something broken" as the closing clause, not the headline.

**Beat 8 · [ZIP 5+7] the split, and the chip promise.** Rooms → Leads. **Expect: the filter
chips' selected border in teal** (this is ZIP 7's cure to ZIP 5's blind class), the search caret
teal, the FAB teal — and the ‹ LEADS back-label and the NEW marks still gold.

**Beat 9 · [ZIP 7] one font world.** Still on Leads. **Expect 「Enquiries pipeline」 and the row
subtitles in the same sans face as the shell** — no italic serif body copy anywhere. The
pipeline numeral stays in the display face.

**Beat 10 · [ZIP 6] one app, one nav.** Still in the room. **Expect Rooms · Today, two seats.**
Tap Rooms. **Expect the grid in one tap.**

**Beat 11 · [open finding] the 503, properly this time.** My console line was wrong —
`responseStatus` reads 0 for cross-origin resources without `Timing-Allow-Origin`, which is
exactly the Railway API, so it excluded the very request in question. **Use the Network tab
instead:** filter to `503`, click the failing row, and read the **Response Headers** for
`X-TDW-SW-Synthetic`. Present → self-inflicted, F-07.33 closes. Absent → a real upstream 503
with a URL, and it becomes a dream-os finding.

**A red at any beat convicts the ZIP in its label, not the set.**
