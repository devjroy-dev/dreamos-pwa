# P7.2 · ZIP 2a-1 — F-P72.E: the Report row must not dismiss the drawer

**Base** dreamos-pwa `worklist` **8f2890a** (ZIP 2a). Two files. `tsc` exit 0 · b40 FLOOR GREEN (93 cells).

**The finding (founder walk, 2026-09-04).** On `/vendor/discover/profile`, tapping `Report an issue`
opened the profile's own "see your profile as couples do" preview instead of the report sheet.

**Cause, derived — one fault, two symptoms.** The sheet's state lives in `AccountDrawer`
(`useReportIssue`). The Report row went through the default `row()` helper, which presses with
`dismiss=true`: the drawer closes `BEAT_MS` after the press, `AccountDrawer` unmounts, and the
sheet unmounts with it — destroyed a beat after it was created. The drawer vanishing under the
thumb is also why the tap landed on the page beneath and opened the preview. The sign-out row has
pressed with **`dismiss=false` since CE-38** for exactly this reason; my row did not follow it.

**Cure.** The Report row is written out like the sign-out row and presses `press('report', false)`.
One line of behaviour, with the reason recorded at the site.

**Why the bench missed it, and what it does now.** C99 asserted the *wiring* (`onAct: askReport`) —
a static bench reading a call site cannot see a component's lifetime. It now reads the press MODE,
and generically: **any** row wired to a sheet-opening `ask` must press with `dismiss=false`, so the
next sheet-row added to this drawer inherits the assertion. Mutation: restoring the dismissing
press reds C99 with the reason named.

**Walk again (both modes, and specifically on a `(legacy)` page — `/vendor/discover/profile` — as
well as a shell room):** drawer → `Report an issue` → the sheet stays up, Room and Build filled,
one field; `Send on WhatsApp` opens WhatsApp with `Issue · <Room> · <build>` + your text.
Note the legacy tree has no `[data-wl-mode]` host, so the sheet portals to `document.body` there;
the tokens are set on the document element, so it should theme correctly — **confirm on the walk.**

```
unzip -o TDW_P72_ZIP2A1_REPORT_PRESS.zip && cp -r deploy/* . && rm -rf deploy TDW_P72_ZIP2A1_REPORT_PRESS.zip
```

```
git add -A && git commit -m "P7.2 ZIP 2a-1: the Report row presses without dismissing — the drawer was unmounting the sheet a beat after opening it; C99 now reads the press mode [F-P72.E]" && git push origin worklist
```
