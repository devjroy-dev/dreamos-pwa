# ZIP 10 — R-37.84 ⑦ ARM A · THE CHAT ANSWERS IN-APP

**Over `54d8e78`. Carries ZIPs 8 and 9. Floor: twenty-three cells, exit 0. tsc: exit 0.**

## §1 · ⑦ THE DERIVATION VERDICT — ARM A, AND MY OWN FINDING WAS THE OBSTACLE

**The carry is CLEAN.** Every dependency has a single home and every one is importable:

| dependency | home | verdict |
|---|---|---|
| `useT()` / `ThemeProvider` | `lib/vendor/ThemeContext.tsx:108` | the estate's own provider — mounting it is **not a shim** |
| `useChat({ vendorId })` | a hook; `vendorId` is `session.id` (`VendorSession.id`, derived — not guessed) | clean |
| `reportGlitch()` | `lib/vendor/api/vendor.ts:211` — an **exported** function | clean |
| `messages` · `loading` · `send` | `useChat`'s return | clean |

**F-09.191 was stale and this seat kept citing it for four ZIPs.** `ThemeContext.tsx:3` imports
`DARK`/`LIGHT` from `lib/vendor/theme.ts`, and **ZIP 3's arm ④ rewrote those two objects to
Graphite and Chalk on this branch.** `useT()` has been returning the new palette since then. The
blocker I used to price a delay had already been cured by my own earlier ZIP, and I did not
re-derive it before quoting it again. Recorded plainly: a finding is only true at the tree it
was derived on.

**Two real contract mismatches surfaced, both caught by the type floor rather than by reading:**

1. `getVendorSession()?.vendor_id` does not exist — the field is `id`. Fixed at the wire.
2. `ChatThread`'s `Props` **require** `onConfirm` and `onCancel`, and **every caller no-ops
   them**, including `app/vendor/page.tsx:1149-1150`. A required prop that every caller no-ops
   is a contract that has drifted from its component. **Matched, not papered over** — the comment
   sits at the call site and names Phase 2 as the cure.

## §2 · WHAT SHIPS

`components/worklist/AskSheet.tsx` — the risen chat. `ChatThread`, `InputBar`, `useChat` and
`reportGlitch` all imported at their single homes; **nothing forked** (C23 fails if the sheet
ever declares its own `ChatThread` or `InputBar`). Scrim + Escape both dismiss.

**The costume returns, and this time it is true.** R-37.83 stripped the field shape because the
tap teleported. The tap now rises a chat, so the shape may promise what it delivers: the vendor
types where he was invited to type.

**C23 asserts the pairing rather than trusting it:** field costume + a WhatsApp jump reddens;
field costume + nothing typeable reddens; the chat behind a row-shaped dock reddens too, because
that undersells the truth. Proved RED by making the field teleport again.

**The Ask TDW walk beat, exactly:** *tap the dock → a sheet rises from the bottom with the chat
inside, in Graphite/Chalk; type and DreamAi answers there; tap the scrim or × to dismiss.*
No WhatsApp jump from the dock. WhatsApp keeps one home: the Rooms panel's top row.

## §3 · ITEMS ①–⑥ — NOT IN THIS ZIP, AND WHY, PER ITEM

⑦ was the gate item — *"a dead tap is an automatic gate-fail"* — so it was built first and it
consumed this sitting. **The rest are reported unbuilt rather than half-built.** Sizes derived:

| item | status | derived size / reason |
|---|---|---|
| ① one medallion | **owed** | `Header.tsx`'s avatar → the shell's `.wl-coin` chrome. Small, one component |
| ② header carries the house | **owed** | two-line stack in `WorklistShell`. Small. *Noted as ruled: the old rooms' 「DREAMAI Dev」 masthead is a standing **R-37.70 violation** in old chrome, Phase 2's cure* |
| ③ Cormorant italic dies in room prose | **owed, and it is the big one** | `grep -c "fontStyle: 'italic'"` across `components/vendor` + `app/vendor` = **160 sites** in 8+ files. ZIP 7's `script`→body remap moved the *family* in 18 files but not these, which set `fontStyle` directly. This is a per-site classification pass on the scale of the brass split, not a sweep |
| ④ vestiges die | **owed** | `settings/page.tsx:149` and `:323`. Two lines, branch-scoped |
| ⑤ the link goes home | **owed** | remove the third panel row; add the R-37.82 idiom to Settings' TDW ENQUIRY LINK section |
| ⑥ drawer is an overlay | **owed** | `Header.tsx`'s drawer → anchored overlay + scrim |

## §4 · THE CHAIR-GATE — THIS SEAT CANNOT SATISFY IT, STATED PLAINLY

The gate requires full-surface screenshots of both modes with every delivery. **This seat has no
renderer.** The mock was hand-authored HTML, not a capture; the acceptance shots R-37.84 ①②③
ask for cannot be produced here either.

**Not a refusal — a capability gap that the process needs to route around**, three ways it could:
the founder's own captures fed back for the chair to audit; a headless renderer in the executor's
container (Playwright over the built tree — the tree builds on Vercel, not here, since
`next/font` cannot reach Google Fonts from this container); or the chair auditing the branch
deployment directly. **Until one is chosen, every "acceptance: screenshot" clause is a clause
this seat will report as owed rather than silently skip.**
