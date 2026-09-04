# P7.2 · ZIP 2a — THE BADGE, THE BIO CALL, THE REPORT DOOR, F-39.82 CURED · HANDOVER

**Base** dreamos-pwa `worklist` **3fd67d1** (preflight at the cut: origin = HEAD, behind 0).
11 files, 1 new, **no deletions**. `tsc --noEmit` exit 0 · b40 **FLOOR GREEN** (93 cells) ·
`tdw10_tier` **107/107** · floor measured on a committed tree: **24 RED + 1 REFUSED → 23 RED + 1 REFUSED**.

§2 PIN: `docs/mocks/flip-beta-mock.html@3fd67d1`, frames `P7-badge` · `P7-report` · `P72C-bio-call`.

## §0 · APPLY — two blocks, each its own STOP

```
unzip -o TDW_P72_ZIP2A.zip && cp -r deploy/* . && rm -rf deploy TDW_P72_ZIP2A.zip
```

```
git add -A && git commit -m "P7.2 ZIP 2a: the Beta badge, the Storefront bio call, the Report door, and F-39.82 cured — the capped vendor's upgrade seat re-homed onto the ask sheet's typed refusal [S9 · S19/F-P72.C · S10-S18/F-P71.2 · F-39.82]" && git push origin worklist
```

Then: `node_modules/.bin/tsc --noEmit -p .` · `node scripts/b40_worklist_shell_bench.js` ·
`bash scripts/run-floor.sh` (after the commit — the vacuity probe refuses on a dirty tree by design, c-P72.11).

## §1 · WHAT SHIPPED

**The Beta badge (S9).** `COPY.beta` in the one home; the mark sits on the label row after the
room name inside a new `.wl-lblrow`, so neither the house name nor the numeral moves. One rung
(t5, the label role's own), one token (`--atelier-accent-text`, which has the Chalk twin). No
pill, no border, no new colour. **C96** asserts the render, the row, the token, the absence of a
raw colour and the absence of a border. Mutation: pinning `#68C9B4` reds it.

**The Storefront bio call (S19, F-P72.C).** The founder's walk found the row reading as a row.
The title and the drawer's vetoed line stay; the chevron-link becomes the shell's primary button
under the meter. Portfolio and Discover **keep** the row grammar — one call per screen, or the
contrast that makes a call read as one is gone (Discover becomes a call when Block 09 ports it).
**C97** asserts the byte, the register, the destination, and — the ruling's teeth — that the
screen carries **exactly one** primary control.

**The button register, hoisted (chair ruling).** `.wl-btn` / `.wl-btn2` / `:disabled` /
`:focus-visible` / `.pri` were written inside `StudioSheets`' `SHEET_CSS` and mounted only by
`TeamTabs`: a shell-wide register scoped to one room. They now live in `WorklistShell`'s
`SHELL_CSS` beside `.wl-tile` and `.wl-fab`, values byte-identical; both rooms read the class;
the inline copy is gone. **C98** asserts one declaration in the shell scope and **none** in four
named files. Mutation: re-declaring it in `StudioSheets` reds it with the file named.

**The Report door (S10–S16, S18; F-P71.2 arm (i)).** Eight bytes in the copy home; a
`useReportIssue(room)` hook shaped like `useSignOut`, portalling into the **anchored** mode host
so the sheet inherits the theme of the tree it opened in; a drawer row under REACH US; the sheet
with Room and Build prefilled, one field, `Send on WhatsApp` wearing the hoisted register. The
composition is `Issue · <Room> · <build>` + the vendor's words, to `supportWaNumber()`.
- The build is **read from the live `[data-tdw-commit]` stamp**; an absent stamp renders an em
  dash, never a guess — a report naming the wrong build is worse than one naming none.
- `AccountDrawer` has **two mounts**; the `(legacy)` one (`Header.tsx`) reports as `"Discover"`,
  the surface a vendor would name, rather than borrowing a shell room's label it is not in.
- **S17 stays struck** and C99 asserts it cannot return.
- **A defect lint caught before a walk could:** the sheet first portalled by re-querying
  `[data-wl-mode]` instead of using the host the hook had already anchored — with two mode hosts
  live (shell + legacy) that puts the sheet in the wrong theme. Fixed.

**F-39.82 · CURED.** The derivation the chair required came back **YES**: `useChat` returns a
typed, discriminated `meta.state: 'ok' | 'nearing' | 'capped'` from the server's own response
(`useChat.ts:39`). The door hangs on that state, never on the refusal's prose. `AskSheet` already
called the hook and simply was not destructuring it. The byte is the founder's 2026-08-29 veto,
`Upgrade in Billing.`; the address is `roomHref('billing')`.

**The gate is the EXACT COMPLEMENT of TierMeter's, and the bench taught it so.** The first build
gated on `capped` alone; `tdw10_tier` §9.3/§9.5 immediately reddened — a vendor with a spent
*nonzero* cap would have seen **two** anchors, the duplicate §9.5 exists to forbid. The correct
gate is `capped && !turns_cap`, which is what the dead page-level seat had. `tdw10_tier` §9 is
re-keyed onto the sheet with **the count unchanged at 1**, and the bench now runs **107/107**.

## §2 · THE BASE

**24 RED + 1 REFUSED → 23 RED + 1 REFUSED.** One line left, named: **`tdw10_tier`** — F-39.82
cured, §9's inventory whole again. `b50_fetch_loop_bench` stays REFUSED (needs a live host).
`tdw_stripper_census.out.txt` is regenerated in this ZIP: the new component adds two block
comments the retired naive rule mis-parses, so the guard's total moved 211 → 213 and the capture
was refreshed as the guard instructs.

## §3 · FOUNDER CARD (alias, DEV440, both modes)
① identity ② the masthead reads the room name with `Beta` beside it, teal, no pill ③ Storefront:
one accent button `See your profile` under the meter; Portfolio and Discover stay rows; tap →
the profile ④ drawer → `Report an issue` → Room and Build prefilled, one field; type a line;
`Send on WhatsApp` opens WhatsApp with `Issue · <Room> · <build>` + your text, to the support
number ⑤ light mode: badge and button hold.
**Declared, benched, not walkable here:** F-39.82's door needs an account at `state:'capped',
turns_cap:0`. It is proven by `tdw10_tier` §9's executed inventory, not by this card.

## §4 · METHOD
- **s-P72.5** — `WorklistShell.tsx` carries its own law, *"NO BACKTICKS BELOW THIS LINE, EVER"*,
  because everything under it is inside a template literal. A hoist comment with backticks around
  filenames broke the parse one line below the law that forbids it. The reader is the fix.
- **c-P72.13** — restore a mutation by **reversing the exact edit**, never by `git checkout` on a
  file carrying uncommitted work: it reverted a whole build, and b40 caught it (FLOOR RED, 1 cell).

## §5 · NOT IN THIS ZIP
**L-1** (the landing's two doors, the chooser, the R-O3 toggle's retirement, the ten-cell ledger)
— its own sitting and its own walk, by ruling. Then **Arm D** (the four Today keys, F-39.72) and
**FORK 3** (the CSS-var port) as ZIP 2b. Then Arm E, P7.3, P7.4.
