# P7.2 · ZIP 1a — F-P72.A · Chalk reaches the (legacy) pages

**Base** dreamos-pwa `worklist` **4bcc87b** (ZIP 1 + block 2). Two files. `tsc` exit 0 · b40 FLOOR GREEN (89 cells) · modeBridge 12/12.

**Finding (walk, 2026-09-04):** Storefront → "Your bio · How couples see you" → `/vendor/discover/profile` rendered Graphite while the shell was in Chalk. Cause by command: the `(legacy)` layout's `ThemeProvider` initialises from the old lane's storage key; nothing writes that key any more — the shell never did (R-38, modeBridge 1.2/1.6) and the old Settings toggle was deleted with the tree. Owned as the seat's: the write path was retired at the flip (F-38.3) without carrying a reader of the shell's mode into the group.

**Cure (one file):** `app/vendor/(legacy)/layout.tsx` reads the shell's mode (`readModeClient()`, cookie-backed) once on mount and sets `html.theme-light` accordingly — the one signal `ThemeProvider` already observes (its MutationObserver flips tokens and CSS vars). One reader, no writer of the lane key; modeBridge holds 12/12. Cleanup restores the class on unmount.

**Cell:** b40 **C95** (C90 was taken) asserts the read, the toggle, the provider, and the absence of any storage write. Both-ways: dropping the toggle reds C95; restored green.

**Not cured here, filed:** F-P72.B — the profile page's "See your profile as couples do" CTA reads as a rule (1px outline), and its masthead carries the retired `DREAMAI` wordmark — legacy Discover chrome, appended to F-39.77 §1 for Block 09's port.

```
unzip -o TDW_P72_ZIP1A_LEGACY_MODE.zip && cp -r deploy/* . && rm -rf deploy TDW_P72_ZIP1A_LEGACY_MODE.zip
```

```
git add "app/vendor/(legacy)/layout.tsx" scripts/b40_worklist_shell_bench.js docs/TDW_P72_ZIP1A_LEGACY_MODE_HANDOVER.md && git commit -m "P7.2 ZIP 1a: the (legacy) pages follow the shell's mode — one reader of the cookie, no writer of the lane key; b40 C95 [F-P72.A · F-38.3]" && git push origin worklist
```

**Walk:** Chalk → Storefront → "Your bio · How couples see you" → profile renders **light**; ‹ Discover → hub light; Settings → preview light. Flip to Graphite in the drawer → the same three dark. Then ZIP 1's seal.
