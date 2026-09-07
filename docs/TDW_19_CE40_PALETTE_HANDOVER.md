# TDW_19 · CE-40 — THE PALETTE PACKET · R-40.129

**Base `5fcdf5d3b51b87be476f1fc39848e79f8f1e781c` · `dreamos-pwa` · `origin/main`**
Every number below was derived by command at origin. None is recalled.

---

## 1 · WHAT WAS CURED

**162 leak rows at the base. 158 cured. 4 remain, and they are the four the chair ruled.**

| | |
|---|---|
| shell call-site literals, before | 311 |
| shell call-site literals, after | **129** |
| out-of-family colours, before | 158 |
| out-of-family colours, after | **0** |
| surfaces touched | 31 |

Nine distinct reds existed in a shell that already had `--role-critical`. All nine are
gone: `#4A1616` (the founder's specimen), `#5A1414`, `#3C1414`, `#E07070`, `#E07B5C`,
`#B42828`, `#7A1A1A`, `#A12B2B`, `#B4453C`. So is the terracotta family — `#7A3828`,
`#9B4E38`, `#8B4B37`, `#B85C38`, `#B4552D` — which belonged to no family in either mode.

## 2 · THE RULINGS, AS THEY LANDED

**① State roles are inks, never grounds.** This turned out to be the whole cure rather
than a constraint on it. Every red and green *fill* in the shell was a role used as a
ground, so ① deletes them outright: the control becomes transparent-ground, a
full-weight `--role-critical` (or `--role-positive`) edge, and role ink — which is the
shape `BulkBar.tsx:37`, `SliceShell.tsx:1213` and `DetailSheet.tsx:93` already drew.
Nothing had to be tinted, which matters: see §5 on why a tint was not available.

**② Toasts read the surface.** Both toasts now take `--atelier-sheet-bg` and
`--atelier-ink` in every kind. `WlToast.tsx:94`'s `rgba(74,22,22,0.96)` and both
`#F1EFEC` pins are gone. `b60` asserts ≥ 4.5:1 on every variant in both modes and reddens
on any attempt to pin either ink or ground.

**③ Brand marks on the mark only.** The Google wordmark's four SVG path fills are
allow-listed by file and by hex in `b59`. **WhatsApp's `#25D366` has no surviving site.**
Its glyph — `MessageBubble.tsx:256` — already read `var(--role-positive)`; all seven
`#25D366` occurrences were a button ground, a border or a label, and ③ forbids all three.
The WhatsApp arm of the ruling is therefore satisfied by deletion, not by allowance.

**④ `warn` stays chip-and-banner.** `ToastKind` is `'success' | 'error'`
(`useToast.ts:7`). No third kind was minted. `b60` measures `--role-caution` against both
sheets anyway (8.27:1 / 5.90:1) so the role is ready if one is ever ruled.

**⑤ The proposed-token column, row by row.** Applied as ratified.

**⑥ One mode system.** Roughly forty `T.isLight ? <literal> : <literal>` ternaries
retired into single token reads. Each was a third theme system wearing a palette: the
token already themes, so the ternary could only ever disagree with it.

**The two phantoms.** `--atelier-danger` was read once and defined nowhere
(`wedding-pages/page.tsx:806`) — deleted, now `--role-critical`. **A second was found in
the cut: `--atelier-paper`**, read twice in `portfolio/screen.tsx`, defined nowhere,
painting `#F8F7F5` unconditionally. Same class, same act, same ruling — named here rather
than folded in silently. `b59 §4` now reddens on any `var(--x, <literal>)` in the scope,
so a third cannot arrive quietly.

## 3 · THE TWO CELLS

**`b59_seven_ink_census.js` — 20 cells, GREEN.** Asserts the law by VALUE, not by
spelling: every literal's RGB must match a value parsed out of `lib/worklist/theme.ts` on
each run. The cell holds no hex of its own, so no token move can invalidate it — which is
precisely the failure mode F-40.263 was. Also guards the couple lane, the brand-mark
allowance (pinned at exactly 4) and the phantom-fallback shape.

**`b60_toast_contrast.js` — 24 cells, GREEN.** Shape first, value second, both toasts,
both modes. Shape first because F-04.75 was cured twice with a pinned value and rotted
twice.

**Both-ways, by command.** At a `git worktree` on pristine `5fcdf5d`:
`b59` **RED 17/20** (158 out-of-family — exactly 162 minus the four ruled brand marks;
148 in-family literals against a pin of 124; 9 phantoms) and `b60` **RED 20/24**. At the
cured tree: 20/20 and 24/24.

## 4 · THE HTML-ENTITY EXCLUSION

`&#8593;` is an up arrow (`AiDock.tsx:59`) and `&#9670;` a diamond. Both match a hex
pattern and neither is a colour. `b59` strips `&#\d+;` **before** the scan rather than
filtering after, because filtering after would still have to guess which `#8593` was an
arrow. A cell that reddens on an arrow gets silenced rather than obeyed.

## 4b · §4.18 — DERIVED, AND IT IS THE BENCH

**The bench pinned the literal.** `tdw07_p4a_ig.proof.mjs:249` read
`/rgba\(12,10,9,0.42\)/.test(M)` — a spelling, satisfied by the string appearing anywhere
and broken by writing the same colour correctly. It is R-40.94's exact class, and it could
never have caught the defect it was written for: **a removed scrim and a re-tokenised
scrim look identical to a spelling probe.**

Amended by label. The law is unchanged and still the founder's; what changed is that the
three signals are now asserted **as signals**, inside the selected arm only — a full-bleed
overlay ground, a 3px accent frame, a tick — with the region sliced the way `§4.16`/`§4.17`
already slice theirs. Proved both ways against a **real mutated copy** of
`portfolio/screen.tsx`: scrim removed → RED, frame removed → RED, tick removed → RED, file
restored byte-identical after each. 69/69.

**A finding while I was in there — `tdw07_p4a_ig`'s MUTATION LEDGER is `console.log`.**
Lines 379-391 print eleven `V-n` mutations and their expected reds; none is executed. The
line `V-14 manager the selection scrim removed ⇒ §4.18 RED` printed GREEN on every run of
the arc in which §4.18 could not have caught that mutation at all. A ledger that asserts
its own mutations in text is the hollow-green shape wearing a receipt. Filed, not cured —
it is eleven cells across another arc's bench.

### The scrim's alpha — a fork, not an act

The chair's other arm also fires: `--role-scrim` in **Chalk is `0.38`, lighter than the
`0.42` it replaced**. In Graphite it is `0.62`, darker. Measured before touching it:

| | 0.38 (token) | 0.42 (the literal) |
|---|---|---|
| **Job A** — veiled page ink, the seven sheet scrims | **7.30:1** | 6.56:1 |
| **Job B** — selected vs bare, light photo | 2.18:1 | 2.63:1 |
| **Job B** — selected vs bare, dark photo | 1.13:1 | 1.23:1 |

**I did not move the token, and this is why.** `--role-scrim` has **eight readers** —
AskSheet, SignOutSheet, AddFab, ReportIssueSheet, the drawer, StudioSheets, Header, and
this one. Seven are sheet veils whose job is Job A, and `lib/vendor/theme.ts:212` carries a
measured comment against `0.38`. Raising it to `0.42` costs those seven 0.74 of ratio to
buy this one 0.45 — a ratified, measured, eight-reader token re-derived to serve one
reader. That is the one-home law run backwards, and it is a ruling, not an edit.

Note also what Job B's numbers say: **the scrim alone is weak at any alpha** — 1.13:1 at
0.38 and 1.23:1 at 0.42 on a dark photograph. That is precisely why the founder's law is
*three* signals. The frame and the tick are what carry a dark photo, and the amended cell
now guards all three. The chair names whether `--role-scrim` moves.

## 5 · WHAT IS NOT CURED — DECLARED, WITH ITS REASON

**124 in-family literals remain, and `b59 §1b` PINS the number.** These are the right
colour written the wrong way — a literal equal to a token's value today, stale the hour
it moves. Almost all are `rgba(201,168,76,α)`: gold at an alpha. **The palette has no
alpha-bearing gold, and minting one is a new token, which is a ruling.**

`color-mix()` is not the escape, and this is a finding in itself:
`package.json`'s browserslist declares `safari >= 14` and `ios_saf >= 14`;
`color-mix()` needs Safari 16.2. **The estate already has one use of it —
`app/vendor/(legacy)/onboarding/page.tsx:426` — which is a latent defect against the
estate's own declared floor.** On an iOS 14 phone that declaration is dropped and the
button loses its ground. Filed, not cured; it is a legacy route and outside this cut.

The pin means the debt cannot grow. Adding one literal reddens `b59`.

### R-40.133 — the alphas, derived

**101 of the 124 are gold. They use twenty-four distinct alphas, not two.** The chair's
read was a hairline `.35` and a wash `.12`; the histogram says the hairline band is real
but sits lower than `.35`, and that `.35` is actually the head of a third band.

| band | sites | alphas present | mode |
|---|---|---|---|
| **wash** | 17 | .06 .07 .08 .10 .12 .13 .14 .16 | .12 |
| **hairline** | 42 | .18 .20 .22 .25 .28 .30 .32 | **.18** (mode), .22 (median) |
| **edge** | 39 | .35 .38 .40 .45 .50 | **.35** |
| outliers | 3 | .55 .65 .75 | — |
| dead | 1 | .0 | a no-op fill |

**My proposal is three, not two:** `--role-metal-wash` at .12, `--role-metal-line` at .18,
`--role-metal-edge` at .35. Collapsing the hairline band alone to a single value moves 42
sites across a .18–.32 span — a 78% relative change at the top end — so two rungs would
either flatten every visible hairline to one weight or push the wash up into the line.
The three outliers and the dead .0 want individual disposition, not a rung.

The chair names the values and the token names; the debt pin drops 124 → 23 → 0 in the
rider. The remaining 23 are `#000000` at seven alphas (shadows — `--atelier-card-shadow`
already owns that job), `#FFFFFF` at .05/.06 (inset highlights — `--atelier-grain`'s job),
and one `#68C9B4 @ .16` teal wash.

**`app/vendor/(legacy)/**` is out of scope** — 98 literals, Espresso-era routes on their
way out, counted separately and named in `b59`'s own printout so no reader takes §1's
green as covering them.

## 6 · OWED ON THE GLASS — THE WALK

`b59` and `b60` read source. A green here is not a green on the deploy, and three rows
below are places where the founder's walk could disagree with the table. **The walk
outranks the instrument; a disagreement is a finding against the instrument.**

1. **The `your-website` preview frame — PRE-RULED AND CORRECTED IN THIS SITTING.** The
   first cut read `--atelier-sheet-bg`, which is `#1D1E20` in Graphite: a dark frame
   behind a cream storefront for the milliseconds before the iframe paints. The chair
   ruled it back to the public lane's own cream, and the three sites now carry `#F8F7F5`
   again — the value `app/v/[code]/page.tsx:865` writes in `.pv`. It is quoted as a
   literal because there is nothing to read: the public lane mints no token for it, and a
   CSS variable cannot cross an iframe boundary regardless. `b59`'s allowance is therefore
   **7, not 4** — four Google wordmark path fills and three preview-frame grounds — and
   the second class is documented separately in the cell so it cannot be read as a brand
   mark.
2. **Removed glows.** Several `boxShadow` values were coloured glows built on the
   terracotta or on gold at alpha (`calendar/screen.tsx`, `TipsCarousel.tsx`,
   `InputBar.tsx`, `Header.tsx`). They became `none` or a neutral
   `--atelier-card-shadow`, because a coloured glow is a fill by another name and ①
   forbids it. The hot-date dot and the send disc will read flatter.
3. **The `TipsCarousel` CTA gradient.** `linear-gradient(#9B4E38 → #7A3828)` became a
   flat `--atelier-accent-text`. The control keeps its weight; it loses its depth.

The four captures owed since the census still stand: invoice schedule toast · leads
`Mark lost` · contracts `Cancel` · Storefront switch, in both modes.

## 7 · THE FLOOR

`npx tsc --noEmit` clean. `eslint` back to the pristine total exactly — **62 problems
(17 errors, 45 warnings)**, byte-for-byte the baseline; five bindings the cure orphaned
(`INK_DEEP` ×2, three unused `isLight` params) were cleared rather than left.

The floor base is **stale and is not re-based by this seat**. Four entries in
`--check`'s delta are pristine-present at `5fcdf5d`, each derived on an untouched
worktree, each somebody else's: `b40` C50 and C102, `b42`'s one, `tdw09_hotfix`,
`tdw37_leadgate_b_slot`. They are named in the manifest. The chair re-bases at the cut.

The delta is now **one line and it is a removal**: 31 against the pristine 32.
`tdw_f3942_census_guard` goes RED → GREEN. No bench reddened.

`tdw_stripper_census.out.txt` was regenerated as the chair's authorised act
(F-40.269's shape): tip `2f420c61` → `5fcdf5d3`, files scanned **368 → 372**,
naive-rule disagreement 227 → 228. **Membership did not move** — no file joined the
census and none left; the four extra scanned files are the two new cells, the manifest
and this handover, and none of them carries a class. `tdw_f3942_census_guard` goes
**9/10 RED → 10/10 GREEN** as a result.
