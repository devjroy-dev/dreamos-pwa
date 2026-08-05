# TDW_09 · O-1 — THE SINGLE LANDING CURE · EXECUTOR HANDOVER

**Base:** dreamos-pwa `ed187bb` (origin re-fetched at this arc's open and again at delivery; tip unmoved) · dream-os `bfddd64`, **ZERO BYTES** this sitting by charter.
**Under:** R-O1–R-O11 (CE-194) · R-X7 · R-X10 arm (a) · R-X24 · R-T6 · Q-5 · R-X30 · CE-115 control-inventory law · F-06.85 mechanism-comment law.
**W-1 held:** zero soul / lens / prompt / engine bytes. **Money register:** expected-zero, and zero — no `₹`, no `Rs`, no `k`/`L`/`Cr` on any touched surface.

**DELTA: 6 modified, 1 new, 0 deleted.**

---

## 1 · WHAT SHIPPED

### `app/(landing)/page.tsx` — 1,253 → 1,020 lines
Eleven screens became **six**. The four `request_*` screens, the dead `invite_code` screen, `submitRequest`, the 60-second edit window, and ten pieces of request-form state are gone. `invite_phone`/`invite_otp` are now `join_phone`/`join_otp` (R-O4); `inviteName`/`inviteCategory` became `joinName`/`joinCategory`; `inviteCode`/`inviteError` died with their only reader. **Zero rendered bytes moved with the rename** — asserted greppably at §3.3.

The entry panel opens **expanded** with two doors — `I'm getting married` (ghost, leads to the fold) and `I'm a wedding vendor` (gold, leads to the join screen) — and `Sign in` moved to a top-right chrome link. `Just exploring` is no longer a peer choice: the feed **is** the couple door's first screen.

Both unknown-number diverts are gone. On the returning path an unrecognised number now **proceeds to OTP** rather than being turned away; on the verify path a genuine provisioning failure is reported as a failure, using a byte that already existed on that screen. **No new copy was minted for either.**

The R-X24 row rule is applied inline at both acceptance rows: `alignItems: 'baseline'`, a shared `ROW_LINE_HEIGHT` on the dial code *and* the digits, and the flag lifted out of text alignment into a fixed 20×20 `FlagSlot`.

### `app/layout.tsx`
A landing branch in the pre-hydration script (`isLanding` → `#0C0A09`). The static `theme-color` default is **untouched** — it is four other lanes' inheritance. The document `description` takes the ruled positioning line.

### `app/(landing)/discover/DiscoverFeed.tsx`
F-09.17 cured: `/auth/signup` → `/?role=couple`.

### `app/demo/vendor/[handle]/page.tsx` — **comment only, zero code bytes**
R-O6's documented hold: the mechanism (`pinned="dark"`), the trigger (a pin-lift), and why the migration was refused.

### `scripts/tdw09_surface_census.mjs`
`app/(landing)` **joins the instrument's lane** — it was not held out before, it was invisible. Both single-theme files are now held with their reasons pointing at the decisions in the files themselves.

### `scripts/tdw08_p3_landing.proof.mjs` — **F-09.40 cured**, labeled amendment
### `scripts/tdw09_landing.proof.mjs` — **NEW**, the estate's first bench over its own front door

---

## 2 · PROOF

| Bench | Cured | Uncured `ed187bb` |
|---|---|---|
| **`tdw09_landing`** | **74/74 GREEN** | **21/74 — 53 cells RED** |
| `tdw08_p3_landing` | **89/89 GREEN** | 88/88 (count moves, §4) |
| type · surface · roles · money · palette · theme_retire | 16 · 51 · 37 · 18 · 18 · 16 — all GREEN, **byte-stable** | identical |
| console · factory · invite_spent · prospects_console | 55 · 45 · 14 · 54 — all GREEN, **byte-stable** | identical |
| `tsc --noEmit` on cleared `.next` | **exit 0, zero output, run twice** | same |

**Census at the cured tree:** 8 species sites, **0 mapped**, 2 files held out. Every remaining site is `decorative sheen` (6) or `already theme-aware` (2). The landing lane is now *held*, not *invisible*.

**Fourteen §M mutation cells** over production source, each RED at the broken tree, each restoring byte-identically. Tree verified clean after every run.

---

## 3 · F-09.40 — CURED, AND WHY THE CELL COUNT MOVED

**`tdw08_p3_landing` goes 88 → 89, reconciled: one cell became two.**

§4.5g promised "zero new gold below the fold" by matching two brass **literals**. It could not see a **role token** that resolves to brass. Migrating one below-the-fold edge to `var(--atelier-input-border)` — the boundary role a theme-blind sweep would choose — paints a gold edge while the cell stays green, because `DARK.inputBorder` is `rgba(201,168,76,0.52)`.

Reproduced before the re-author, and re-proven after: at the amended cell that same migration now **REDs**. §4.5g resolves every `var(--…)` below the fold against theme.ts's `DARK` set and tests the colour it actually paints, using the pattern §9.5/§9.6 already use in the same file. The one sanctioned gold — the claim CTA's fill — is exempted exactly as its literal form was.

**The added cell is §4.5g0**, a vacuity guard: a resolver returning null for every token would make §4.5g pass over anything, so the resolver is asserted to actually resolve before its verdict is trusted. Named rather than absorbed.

---

## 4 · EXECUTOR DISCLOSURES — every one by name

**D-1 · The death roster was under-counted twice, and the second time was mine.** The kickoff said ~20; I said ~27 in Part 1 from a whole-file read; the derived figure is **57 sites**. Owned in Part 2 §0 before anything was built. The bench's §8 roster is now the number's home.

**D-2 · My own bench caught two defects in itself on its first run, and both were the laws this estate already wrote down.** (i) §8.1 reported `Jeweller` surviving — the *live* craft chip reads `Jewellery`, and a substring test cannot tell a dead label from a live one containing it. Now boundary-matched. (ii) §10.4 red on a clean tree because the hold comment **this sitting wrote** names `ThemeProvider` as the thing that is absent — the comment-blindness law's exact inversion, on its own tree. Both cured with the reason in-comment.

**D-3 · tsc caught two of my bytes, both mine, both disclosed.** (i) A JSX comment placed inside a `&& (` expression in `DiscoverFeed.tsx` — re-homed above the conditional. (ii) **A backtick inside a comment inside the template literal** in `app/layout.tsx` closed the literal early; my first fix then introduced a `${`. The file now carries a note warning the next editor, because the failure is invisible until the build runs.

**D-4 · A ruling I interpreted, stated rather than assumed.** The smoke card's step 4 reads "it lands in the L-B door, not a request form," and §4.6 said the exploring-end CTA becomes the L-B entry. Under Fork 1(a) the fold **is** the couple door's first screen, so I built the end CTA as **that door's continuation**: it carries the couple door's own label and enters the couple flow. Sending it back to the panel the visitor just came through would loop them. **If the chair meant literally back to the panel, this is one line.**

**D-5 · An ordering choice I made, flagged.** The couple door is placed **first**, the vendor door second with the gold, per the S1 paper's L-B ordering. Today's arrangement is the reverse. Gold-on-vendor is founder-ruled; the *order* is mine. One word flips it.

**D-6 · One orphan created, one pre-existing orphan left alone.** `DotOption` lost its last five call sites and was deleted — I orphaned it, so I removed it. `GhostBtn` was **already** unused at `ed187bb` and is left byte-untouched: deleting unrelated dead code is scope nobody asked for. `DateStatus`/`Season` types went with their state.

**D-7 · The `Are you a:` byte survives on `signin_phone` while dying on `request_who`.** Three bytes are shared this way and all three live on. §8.3 asserts it so a future roster sweep does not delete a byte a living screen still renders.

**D-8 · No production state was read and no SQL ran.** The landing reads two public unauthenticated GETs and nothing account-scoped. The fixture-state law's SELECT permission was pre-granted and **spent zero times**, stated as promised in Part 1.

---

## 5 · WHAT IS NOT DONE — named, not silently absent

- **`src/api/waitlist.js` (dream-os, T3-3)** — its sole live caller in this repo was `app/(landing)/page.tsx:389` and that byte is now gone. **The tail is un-gated by this deploy** and is NAMED-HANDED; dream-os is zero-byte this sitting by charter. §1.9 asserts the caller stays dead.
- **F-09.41** — the demo lane inherits Frost's `#1E0A0E` over a `#1F1612` page. Filed, homed to the demo lane's next touch, not smuggled here.
- **R-X24's 5–6px specimen** — the `Open IG →` anchor died with the request forms and that magnitude has no surviving home on this surface. The gate is the two ~1px shots as re-pointed and founder-accepted; the larger specimen, if it is still wanted, needs a surface outside this cure.
- **The canon Row primitive** — not minted here by ruling (R-O5). The rule is applied inline; §9.5 asserts no primitive was created under this charter.
- **No cell over rendered baselines.** No browser, no fonts in this container. The bench asserts the *rule*; the founder's two photographs are the witness.

---

## 6 · THE SMOKE CARD — eight steps, then two shots

Run on the handset. Paste back what each step shows.

1. Open `thedreamwedding.in`. **The panel is already open, two doors, `Sign in` top-right.** No "tap".
2. Tap **`I'm a wedding vendor`**. Phone screen with the craft chips. Enter **9888294440**, take the WhatsApp code, verify. → lands in the vendor PIN screen.
3. Back to `/`. Tap **`I'm getting married`**. **Photographs come first** — no field, no form.
4. Scroll the fold to its end. The closing moment reads, the pitch line is yours. Tap its CTA → the couple join screen.
5. **The open door, both paths.** Use any number that is *not* one of the three test accounts — once on the couple door, once on the vendor door. **No "request an invite" appears on either.** Both go straight to the code screen.
6. Tap **`Sign in`** top-right. Pick Dreamer or Maker, enter a number, continue. *(If the role toggle is missing here, stop and tell me — that guard is load-bearing.)*
7. Open `/discover` directly. Scroll until the nudge appears. **Tap its CTA — it lands on the landing with the couple door live, not a 404.**
8. One glance at any `/demo/vendor/<handle>` link. **Unchanged.**

**THE TWO ACCEPTANCE SHOTS** — one photo each, a straight edge laid along the typed digits' baseline, one word back:

- **SHOT ①** — the `+91` / digits row on the **join phone** screen (step 2's screen).
- **SHOT ②** — the `+91` / digits row on the **sign-in** screen (step 6's screen).

**Acceptance is `on` for both.**

Sequencing beyond this sitting is the founder's.

---

# RIDER — THE FOUNDER'S WALK · F-09.42 · F-09.43 · F-09.44

**Base:** dreamos-pwa at the O-1 deploy. Three walk findings, three cures, one ZIP. Delta unchanged in shape: same 6 modified, 2 new.

**F-09.42 — the chrome Sign in was illegible by construction.** It shipped as `position:absolute` over the cover **photograph**, the only near-white byte on this surface not standing on the panel's backdrop; its contrast was whatever that second's photo happened to be. Re-homed into the panel's brand row, right-aligned against the wordmark, on the same dark blurred backdrop every other byte here uses. Still chrome, still above the door stack, still not a door — §12.3 asserts that ordering.

**F-09.43 — the couple door's first paint went through black.** Three mechanisms stacked: the carousel zeroed on the `screen` flip, `startExploring` discarded any warm photos, and only then did the fetch begin. The fold is now warmed at mount (success-only, so a failed prefetch still lets the door fetch and fail honestly), the discard is gone, and the cover holds the screen until a real exploring photo exists to replace it. The S1 paper named this LCP exposure as the risk the founder's walk must settle; it settled it.

**F-09.44 — the machine's TYPE was being rendered as copy.** `(['Dreamer','Maker'] as Role[]).map(r => {r})` printed the internal union to users, so the landing spoke two vocabularies for one distinction. The label is decoupled from the value; the union is unchanged and internal. **The toggle stays** — R-O3's trap is unchanged. `Are you a:` is deleted; the labels carry the question. The chips **stack** rather than sit across, because the plain-speech bytes are ~2.5x the width of the words they replace and would sit at the edge of overflow on a 360px handset.

## RIDER DISCLOSURES

**R-1 · F-09.44 is an executor miss, owned.** The copy ledger ruled the door labels to plain speech, retired the role sublabels, and renamed the machine off the gate's vocabulary — and never opened the one screen that prints the type. The ledger had a hole in it and the founder's walk found it.

**R-2 · A roster count moved and is reconciled in ink.** The shared-byte set was THREE; `Are you a:` was shared between the dead `request_who` and the live `signin_phone`, and F-09.44 deleted it from the survivor too. §8.3 now asserts TWO. A deliberate second death, not drift.

**R-3 · The comment-blindness law caught a third instance, mine again.** §12.11 asserted `Are you a:` absent and red on a clean tree, on the note recording its deletion. Comment-stripped.

**R-4 · The non-vacuity run caught two weak cells before they shipped.** §12.1 measured 200 characters between `position:'absolute'` and the label, and the shipped button was longer — so it **passed over the very tree the founder walked**. §12.4 asserted "a fetch of exploring-photos that sets the photos", which `loadPreview` has always done. Both re-authored onto discriminating facts (`zIndex: 25`'s absence; the fetch count moving 1 -> 2). A negative cell that cannot see the defect it names is worse than no cell.

**R-5 · The real cure for F-09.44 is not here.** A returning member should not be asked at all; that needs `/auth/pin-status` to answer for both roles in one call, which is a dream-os byte and dream-os is zero-byte by charter. Chartered separately rather than faked client-side with two requests and an ambiguity nobody has ruled.

## FILED, NOT BUILT

**F-09.45 — THE LANDING RUNS UNCAPPED TO THE VIEWPORT.** Founder-witnessed at desktop width: the sign-in role chips render as ~700px slabs and the CTA as a ~1400px bar. `app/(landing)/page.tsx` sets no column cap anywhere. **The demo tease landing cured this exact class at TDW_08 P3** — `COLUMN = 520`, the page capped and centred, and the `position:fixed` chrome given the same cap because fixed elements lay out against the viewport rather than the capped parent (that second half is the easy one to miss). Two bench cells already assert it next door at §11.1/§11.2. **Unruled, therefore unbuilt.**

## RIDER PROOF

`tdw09_landing` **89/89 GREEN** at the cured tree.

**AT THE TREE THE FOUNDER ACTUALLY WALKED — `origin/main` `5752b1e`, verified byte-identical
to the O-1 ZIP's payload file by file before the run — the bench is RED 75/89: 10 of the 12
new walk cells, plus §4.1's re-aim and all three new §M mutations.**

**R-6 · A NON-VACUITY RUN OF MINE WAS ITSELF VACUOUS, AND I CAUGHT IT AT THE LAST GATE.**
My first "walked tree" was built with `git stash && git archive HEAD` — which produces
`ed187bb`, the UNCURED tip, not the O-1 deploy. Every walk cell reds trivially against a
tree where the whole file is different, so the number it produced proved nothing about the
rider. The tell was the fetch: `origin/main` had moved to `5752b1e` and every one of my
seven files reported DIFFERS against my supposed comparison tree, which is impossible if
that tree were the thing the founder pushed. Re-run against `origin/main` proper, with the
identity of that tree checked against the shipped payload first. **The correct comparison
tree for a rider is the DEPLOYED one, never the charter tip** — an error the fetch-first
law caught for me rather than one I reasoned my way out of. `tdw08_p3_landing` 89/89. Full floor byte-stable. `tsc --noEmit` on cleared `.next`: exit 0, zero output. Census unchanged: 8 sites, 0 mapped, 2 held.

## RIDER SMOKE — three steps

1. Open `/`. **`SIGN IN` is legible** in the panel's brand row, opposite the wordmark.
2. Tap **`I'm getting married`**. **No black frame, no "Curating your preview…"** — the photo should hold and then change.
3. Tap **`Sign in`**. The two chips read **`I'M GETTING MARRIED`** and **`I'M A WEDDING VENDOR`**, stacked. No `DREAMER`, no `MAKER`, no `Are you a:`.

Plus SHOT ① still owed: the `+91` / digits row on the join screen.

---

# RIDER 2 — THE SECOND WALK · F-09.45 · F-09.46 · F-09.47

**Base:** dreamos-pwa `1fa2335`, verified byte-identical to rider 1's payload file by file before a byte was written. **Delta: `app/(landing)/page.tsx` + the bench + this doc. Nothing else moved.**

**F-09.47 — the fold's close re-asked a question she had already answered.** The closing CTA carried the **door's own label**: a visitor tapped `I'm getting married` to get in and was asked the identical thing three photographs later. That was the executor's **D-4** reading — the smoke card said the close "lands in the L-B door" and I gave it the door's label as well as the door's destination. The destination was right. `Continue →` now carries it, **reused from the sign-in submit rather than minted**, so no new byte entered and nothing needed a fresh veto.

**F-09.46 — F-09.42 cured contrast and left prominence broken.** Getting the byte off the photograph and onto the panel's backdrop was the right cure for the defect I filed; it was never a cure for the defect the founder actually has, which is that a returning member's whole path was a 9px grey link in a corner, sitting a thousand pixels from anything being read at desktop width. Arm (b): a member row **beneath the doors**, `Already a member? Sign in`, gold on the verb. That is where a returning user's eye already goes. **It is not a fourth peer door** — L-B ruled against the classification, not against a lower-weight member row — and there is **one home only**: the brand-row link is gone, because two homes for one path is exactly how the old entry panel reached five decisions deep. §12.3 asserts the single home mechanically.

**F-09.45 — the landing ran uncapped to the viewport**, founder-witnessed at desktop across four screenshots: doors as 1,400px slabs, the phone rule edge to edge, the sign-in chips as banners.

**THE PRECEDENT IS FOLLOWED IN SUBSTANCE AND DIVERGED FROM IN FORM, deliberately.** The demo tease landing cured this class at TDW_08 P3 by capping **the page** and centring it — correct there, because that surface is a scrolling document. This surface is a **full-bleed photograph with panels floating over it**. Capping the page would letterbox the photography, which is the one thing the screen exists to show. So `COLUMN = 520` is applied to the **contents of each panel** while the blurred bars keep the full width: photography full-bleed, controls at a readable measure. Three sites take it — the entry panel, the glass panel (join · OTP · sign-in), and the fold's bottom control block. **§13.6 asserts the hero is NOT capped**, so a later reader cannot "finish" this cure into a letterbox.

## RIDER 2 DISCLOSURES

**R-7 · F-09.47 is D-4 coming home.** I disclosed that interpretation by name when I shipped it and said one line would flip it. It cost one walk and one line, which is what a named interpretation is supposed to cost. An unnamed one would have cost an argument about what the card meant.

**R-8 · F-09.46 is the same defect filed twice, and the first filing was too narrow.** I convicted the placement on *contrast* — a measurable, arithmetic property — and never asked whether a returning member would find it. The founder's sentence, not my instrument, is what named the real defect. Contrast was necessary and I mistook it for sufficient.

**R-9 · Two cells were RE-AIMED, count preserved (2 cells, still 2).** §12.2/§12.3 asserted the brand-row home. That home was F-09.42's cure and it has now been retired by F-09.46, so the cells assert the member row instead — the same two facts about the same control: it stands on the panel's backdrop, and it is not a door. §12.3 gained the one-home clause.

**R-10 · The divergence from the P3 precedent is disclosed rather than absorbed.** A future reader comparing the two landings will find one capping its page and one capping its panels and should not conclude the second is unfinished. The reason is in-file at the constant and asserted at §13.6.

## RIDER 2 PROOF

`tdw09_landing` **98/98 GREEN** cured. **At the deployed tree `1fa2335` — verified identical to rider 1's payload before the run — RED 89/98: five of the six new §13 cells, both re-aimed §12 cells, and two of the three new mutations.** §13.6 passes at both trees by design: it is an invariant, asserting the hero was never capped and still is not.

`tdw08_p3_landing` 89/89. Full floor byte-stable. Census unchanged: 8 sites, 0 mapped, 2 held. `tsc --noEmit` on cleared `.next`: exit 0, zero output.

## RIDER 2 SMOKE — three steps, one of them at desktop width

1. Open `/` **on the laptop, full width**. The doors, the wordmark and the member row sit at a **readable measure in the middle**, not stretched to the window. **The photograph still fills the screen** — if it is letterboxed, stop and tell me.
2. **`Already a member? Sign in`** sits beneath the two doors, the verb in gold. Tap it — the sign-in screen opens.
3. Tap **`I'm getting married`**, run to the end of the fold. The closing button reads **`Continue →`**, not the door's label. Tap it — the couple join screen.

Still owed from the first walk: SHOT ① and SHOT ② in words — `above / on / below` for each.
