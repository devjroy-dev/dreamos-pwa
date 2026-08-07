# TDW_09 · F-09.168 (pwa half) — THE SECOND SAVE IS THE YES
**Repo:** `dreamos-pwa` · 3 files · **applies after the dream-os ZIP is at origin**
**Founder ruling:** 「 after the question, the next save is a yes 」

## Gates
`tsc` 0 · `tdw09_p2c` **52/52** · `tdw09_frost_parity` **82/82** (78 → 82) · three mutations biting.

## What changed
Three lines. The save that follows a 409 carries `budget_confirmed`. Nothing else moves — no new buttons, no new copy, no branch in the sheet.

**One subtlety made explicit rather than left to luck.** `commitProfile` resets `asking` at its top, and reading `asking` afterwards still returns `true` by React closure timing. That works — and it would break the moment someone tidied those three setters into a different order, bringing the founder's loop straight back. The value is captured into `confirming` before the resets, and cell 7.16 asserts that ordering.

**The yes cannot go stale:** any keystroke clears it, and reopening the sheet clears it. A changed figure is always a fresh question (cells 7.17, 7.18).

## Walk — three steps
1. Settings → Total budget → `50000` → Save. The question appears; nothing is written.
2. **Save again, unchanged.** It lands as **Rs 50,000**.
3. Type `50000`, get the question, then change it to `50` and Save. You should be **asked again** — the yes must not carry over to a different figure.

Step 3 is the one that proves the yes is scoped to the figure and not to the sheet.
