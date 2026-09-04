# ZIP 11 — R-37.84 ①–⑥ · R-37.85 THE EXECUTABLE GATE

**Over `54d8e78`. Carries ZIPs 8, 9 and 10. Floor: twenty-three cells, exit 0. tsc: exit 0.**
**No split. All six items in one delivery, as ordered.**

## §1 · THE SIX

**① ONE MEDALLION.** `Header.tsx`'s avatar adopts the shell coin's chrome byte for byte: 44px,
`1px solid var(--role-metal)`, transparent ground, label family at 12/500. The teal ring, the
gold wash and the double box-shadow all go. Two identities for one person was one too many.

**② THE HEADER CARRIES THE HOUSE.** A two-line stack: 「The Dream Wedding」 in the feature family
at 17px `ink`, the surface label beneath it in the label family at `ink-mute`. Both shell
surfaces. *Noted as ruled: the old rooms' 「DREAMAI Dev」 masthead is a standing **R-37.70
violation** in old chrome — a persona name in product chrome — and is Phase 2's cure.*

**③ CORMORANT ITALIC DIES IN ROOM PROSE — and the diagnosis moved.**
ZIP 7 remapped the `script` **role** to the body family, so `F.script` already resolved to DM
Sans. What survived was `fontStyle: 'italic'` set *beside* it — **italic sans**, which still
reads as the old voice. The mock's screen four killed the pairing, not just the family.

**132 script+italic pairings removed across 26 files.** Italic survives only where a surface
sets it *without* the script role — a deliberate emphasis rather than a default voice.
Per-file: `SliceShell` 11 · `BinderCard` 3 · `DetailSheet` 2 · `Masthead` 1 · `SliceRow` 1 ·
`PeekNav` 1, and 20 more. **Deferred with reason:** the remaining bare `fontStyle: 'italic'`
sites, which carry no script family and are therefore emphasis, not voice. Converting those
would flatten intent rather than unify it.

**④ THE VESTIGES DIE.** `settings/page.tsx:149` and `:323` no longer render on the branch.
Branch-scoped; `main` keeps its pointers.

**⑤ THE LINK GOES HOME.** The `wa.me` row is out of the Rooms panel. The panel is now three
rows: 「TDW on WhatsApp」 · 「Profile layout」 · the manual pointer, plus the dock. A link belongs
next to the thing that mints it.

**⑥ THE DRAWER IS AN OVERLAY.** A fixed scrim at `--role-scrim` sits behind the anchored panel,
so the page keeps its scroll position and a scrim-tap dismisses. *A drawer that displaces the
page costs the reader his place.*

## §2 · R-37.85 · THE EXECUTABLE GATE

`scripts/wl_audit.mjs`, zero dependencies, one paste:

```
node scripts/wl_audit.mjs https://dreamos-pwa-git-worklist-devjroy-devs-projects.vercel.app
```

It fetches the deployed pages **and their JS bundles** and asserts each ruled property against
the **served bytes** — not the source. That distinction is the point: a grep proves the source,
and this estate has been burned by a source that was right beside a build that was stale.

Eleven assertions: rooms-first · the medallion at both headers · the wordmark · script+italic
absent from the Leads bundle · both vestiges gone · the link absent from Rooms and its section
present in Settings · the fixed scrim · the AskSheet mounted · the dock not teleporting · the
gutter law · the 52px row law.

**It reports INCONCLUSIVE where it cannot decide, and says why.** Pixel-identical edges is the
standing example: a served-bytes gate proves the *rule* — one gutter, no component override —
and never the rendered pixel. **A gate that prints PASS for something it did not test launders
an assumption into a verdict**, which is worse than no gate.

`FAIL` → exit 1 → *GATE RED — the ZIP bounces; the founder does not open the app.*

## §3 · WHAT THIS SEAT OWES ITS OWN GATE

The audit has **not been run against a live deployment** — this container cannot reach
`vercel.app`. Its syntax is checked and its usage guard fires; its assertions are unproven
against real bytes. **The first run is the founder's paste, and if the script itself is wrong
that is a defect in this delivery, not in the build.** Said plainly here so a false FAIL is read
as mine.
