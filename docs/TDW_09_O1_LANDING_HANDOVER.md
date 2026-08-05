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
