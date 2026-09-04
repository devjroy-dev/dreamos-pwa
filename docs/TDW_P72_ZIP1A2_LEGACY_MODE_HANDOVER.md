# P7.2 · ZIP 1a-2 — F-P72.A, second cut: the late readers defer to the shell

**Base** dreamos-pwa `worklist` **8e10119** (ZIP 1a). Four files. `tsc` exit 0 · b40 FLOOR GREEN (C95 grown, both-ways) · modeBridge 12/12 · floor SET identical to ZIP 1's base.

**Why 1a did not hold (walk, 11:44):** on the profile page with the shell in Chalk — cookie `light`, `html.theme-light` ABSENT, inline vars Graphite. The layout's toggle ran; something undid it. By grep: `Header` (mounted by profile, hub, submit) calls `useTheme()`, whose mount effect reads the OLD lane's key and re-applies dark. The page renders Header only after its data loads, so that effect runs AFTER the layout's, and wins. `ThemeProvider`'s own init does the same read. Two late readers of a key nothing writes.

**Cure at the readers' homes (read-only, no writer added):**
- `lib/worklist/mode.ts` — `readShellModeCookie(): WlMode | null`: the cookie alone, honest `null` when absent (`readModeClient` never says absent).
- `hooks/vendor/useTheme.ts` — on mount, the shell's cookie outranks the lane key.
- `lib/vendor/ThemeContext.tsx` — the provider's init, same rule.
- `(legacy)/layout.tsx` unchanged from 1a (the immediate toggle stays; it is now not fought).

**Radius, disclosed:** `DemoVendorHeader` also calls `useTheme()`; a demo vendor who carries a shell cookie will see the shell's mode on the demo tree. Demo vendors are 72h strangers with no shell session, and P7.3 retires the demo provider. Named, not papered.

**Cell:** C95 asserts both late readers carry `readShellModeCookie() ?? …`, neither writes the cookie, and `mode.ts` exports the absent-capable reader. Mutation: `useTheme` stops deferring → C95 red; restored green.

```
unzip -o TDW_P72_ZIP1A2_LEGACY_MODE.zip && cp -r deploy/* . && rm -rf deploy TDW_P72_ZIP1A2_LEGACY_MODE.zip
```

```
git add hooks/vendor/useTheme.ts lib/vendor/ThemeContext.tsx lib/worklist/mode.ts scripts/b40_worklist_shell_bench.js docs/TDW_P72_ZIP1A2_LEGACY_MODE_HANDOVER.md && git commit -m "P7.2 ZIP 1a-2: the shell's cookie outranks the lane key at both late readers (useTheme, ThemeProvider) — read-only; C95 grown [F-P72.A]" && git push origin worklist
```

**Walk:** Chalk → Storefront → Your bio → profile **light** (run the three-value probe: `light: true`, `inlineInk: '#0E1112'`); ‹ Discover → hub light; Settings → preview light. Graphite → the same three dark.
