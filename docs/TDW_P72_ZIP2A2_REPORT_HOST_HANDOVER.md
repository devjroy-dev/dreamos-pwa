# P7.2 · ZIP 2a-2 — F-P72.F: the Report sheet had no host, so it never rendered

**Base** dreamos-pwa `worklist` **b7c9fbc**. Two files. `tsc` exit 0 · b40 FLOOR GREEN (93 cells).

**The finding (founder walk, 2026-09-04).** After 2a-1 the drawer no longer dismissed — but
`Report an issue` still "just presses": the row highlights and nothing opens.

**Cause, derived.** `useReportIssue` asked for its own `anchorRef`, copying `useSignOut`'s shape.
The drawer has ONE root and one ref slot, and `useSignOut` already holds it; the caller
destructured only `{ ask, sheet }`. So `host` stayed `null` forever and the sheet's render gate
`open && host ? … : null` never fired. The row pressed, `open` went true, nothing rendered.

**Cure.** The hook stops asking for a ref it cannot be given. The mode host is DERIVED at open
time (`document.querySelector('[data-wl-mode]') ?? document.body`) — the same question the ref was
asking, answered where the answer is needed. Nothing to wire, nothing for a caller to forget. The
`(legacy)` pages have no `[data-wl-mode]`, so the sheet portals to the body there and takes its
theme from the document element's tokens, which is what it did before.

**The bench.** C99 now asserts the hook does not ask for an `anchorRef` and that the sheet's
render is not behind a gate nothing sets. Mutation: reintroducing an `anchorRef` reds it.

**A pattern, not two accidents (F-P72.E and F-P72.F together).** Both faults came from copying
`useSignOut`'s SHAPE without deriving why the shape is what it is — its dismiss-less press and its
ref both exist for reasons that did not transfer. Recorded as **s-P72.6**: copy a precedent's
reasoning, never its silhouette.

```
unzip -o TDW_P72_ZIP2A2_REPORT_HOST.zip && cp -r deploy/* . && rm -rf deploy TDW_P72_ZIP2A2_REPORT_HOST.zip
```

```
git add -A && git commit -m "P7.2 ZIP 2a-2: the Report sheet derives its mode host at open time — the hook was asking for a ref the drawer had no slot for, so the sheet never rendered [F-P72.F]" && git push origin worklist
```

**Walk:** drawer → `Report an issue` → the sheet OPENS, Room and Build filled, one field. Do it in
a shell room and on `/vendor/discover/profile`, in both modes.
