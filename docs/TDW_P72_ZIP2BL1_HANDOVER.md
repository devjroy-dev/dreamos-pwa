# P7.2 · ZIP 2b-L1 — L-1: THE FRONT DOOR · HANDOVER

**Base** dreamos-pwa `worklist` **cf0c9ed**. Two files. `tsc` exit 0 · b40 FLOOR GREEN (93 cells) ·
`tdw09_landing` **100/100** · floor measured on a committed tree: **23 RED + 1 REFUSED, SET IDENTICAL to ZIP 2a's**.
§2 PIN: `docs/mocks/flip-beta-mock.html@3fd67d1`, frames `L1-landing` · `L1-chooser`.

## §0 · APPLY — two blocks

```
unzip -o TDW_P72_ZIP2BL1.zip && cp -r deploy/* . && rm -rf deploy TDW_P72_ZIP2BL1.zip
```

```
git add -A && git commit -m "P7.2 ZIP 2b-L1: the landing's two doors become sign-in doors with the role preset; New here? Sign up opens the chooser; the R-O3 toggle retires with the line it served [R-39.17 · S1-S8 · F-39.84]" && git push origin worklist
```

## §1 · WHAT SHIPPED

**The two doors are sign-in doors (S1, S2 unchanged).** Each presets the role it names —
`setRole('Dreamer' | 'Maker'); setScreen('signin_phone')`. **Why through the phone step and not
straight to the PIN screen:** `app/vendor/(legacy)/pin-login/page.tsx` bounces any visitor without
a stored session, so the phone step is what earns the session. That bounce is load-bearing, and
the reason is recorded at the call site.

**The line changed sides (S3).** `New here? Sign up` keeps every pixel of the prominence F-09.46
won — 13px, on the panel's backdrop, the verb in gold — because that argument was never about
which path it named: a person in the wrong place needs to see the way out.

**The chooser (S4, S6, S7, S8).** A new `chooser` screen: the heading, the same two door bytes
**verbatim**, and `‹ Back`. No sub-line — S5 struck by the founder. Its buttons enter today's
sign-up flows unchanged: `startExploring()` and `join_phone`.

**The R-O3 toggle retires with the line it served.** The chips, `SIGNIN_ROLES` and the `!role`
half of the Continue guard are gone, each with a tombstone. R-O3's warning was *"do not remove
either half without replacing the other"* — the replacement is upstream: **no entry to
`signin_phone` leaves the role unset.** `handleSignIn`'s `isVendor = role === 'Maker'` is
untouched and now always has an answer.

## §2 · THE ELEVEN-CELL LEDGER (count preserved, each labeled)

| cell | disposition |
|---|---|
| §1.1 | six screens → **seven**, and `'chooser'` named |
| §1.4 | **TIGHTENED — a real finding.** With two door pairs the old form matched *either*, so a mutation on one door left it green. It now counts: two gold vendor doors, two transparent couple doors |
| §4.1 / §4.2 | **INVERTED** to the narrower fact: no `SIGNIN_ROLES`, no `setRole(null)`, and **every** `setScreen('signin_phone')` is preceded by a `setRole` — which catches a *future* entry that forgets the preset, something the old cells could not |
| §12.2 / §12.3 | re-keyed to the sign-up row; same two facts (stands on the panel's backdrop; is not a door; one home only) |
| §12.10 | **retired** (the chips are gone) → **§12.10b**: the chooser quotes the doors byte-for-byte |
| §13.1 | the couple byte now appears **twice by construction** — once per path. What F-09.47 forbids is unchanged: the fold's close must not re-ask, and neither of the two is the close |
| §M.2 | anchor narrowed to the entry door (the old one matched twice and `okMutate` **refused** it — that refusal is why §1.4's weakness was caught), predicate aligned to the tightened §1.4 |
| §M.4 | **retired** with its quote (no null-role submit exists to guard) |
| §M.17 | **retired** with its quote (it mutated the chips' label expression) |
| §M.19 | re-aimed at `Sign up`; same assertion — one home only |

## §3 · FINDINGS AND CORRECTIONS

- **F-39.84** — a vendor arriving on the `vendor.` subdomain has no `entry` to return to, so
  `signin_phone`'s Back would drop him on a landing his host never shows. Pre-existing, unwalked,
  outside L-1's radius; filed for Block 19 §7b where the vendor-host landing gets designed. The
  chooser's `‹ Back → entry` is correct for the landing host, the only host L-1 draws for.
- **c-P72.15** — my P7.1 derivation said the toggle's only caller was the `Already a member?`
  line. The `vendor.` subdomain effect (`:322`) also enters `signin_phone` — role-safe, but the
  claim was too strong. The narrower fact is what the cells now assert.
- **c-P72.16 / .17** — I edited a 600-line bench by line index and mis-indexed twice, and wrote
  replacement blocks through Python triple-quotes that double-escaped every regex. **The method
  line: for a 600-line bench, batch edits with verified anchors and run after each, or don't
  touch it.**
- **c-P72.18** — I then mutated §1.4 *by hand* to prove both-ways and restored the wrong site
  twice, briefly putting gold on the couple door. The cell caught it both times. `okMutate`
  restores byte-identically **and asserts it**; my hands do not. The bench's own §M.2 is the
  proof, and it is stronger than the manual one.

## §4 · FOUNDER CARD — alias, **incognito** (c-P72.14), both modes
① the landing shows the two doors in today's dress and `New here? Sign up` where the old line was
② `I'm a wedding vendor` → the phone step with the role preset (**no role chips**) → PIN →
`/vendor/today` ③ back to the landing → `Sign up` → the chooser: heading, the same two doors,
`‹ Back`, no sub-line ④ chooser → vendor → name + phone ⑤ chooser → couple → the feed
⑥ `‹ Back` returns to the landing ⑦ the landing is a photograph and is unchanged by mode.

## §5 · NOT IN THIS ZIP
Arm D (the four Today keys, F-39.72) and FORK 3 (the CSS-var port) as ZIP 2b. Then Arm E, P7.3, P7.4.
