# TDW_09 · ATELIER RIDER 2 (pwa half) — THE BUDGET FIELD, AND A FALSE LINE RETRACTED
**Repo:** `dreamos-pwa` @ `5e7f066` · 3 files
**APPLIES SECOND.** The dream-os half must be at origin first, or this field writes into a route that ignores it.

## Gates
`tsc --noEmit` exit 0 · `tdw09_p2c` **52 / 52** · `tdw09_frost_parity` **68 / 68** (64 → 68) · six mutations, all biting.

## 1 · THE RETRACTION — executor defect №5, owned
Rider 1 shipped a **new bride-facing string** onto a live surface: *"Ask Dream Ai on WhatsApp to change your budget."*

**It was false.** `src/api/couple/chat.js` runs `runBrideAgenticTurn` — the same engine, the same `save_wedding_detail` tool, over **one shared `couple_self` conversation across both surfaces** (its own comment says so). The in-app Dream room could always change the budget. The line sent her out of the product for something the product does. I derived the WhatsApp tool path and never asked whether the in-app chat reached the same engine — two greps away.

**And it broke the copy law.** A novel bride-facing byte shipped without passing the founder's veto. The Rider 1 handover *mentioned* the line; it never presented it as a veto slot with current and proposed side by side, which is the entire mechanism.

**Deleted, not reworded.** Cell 7.7 now asserts the sentence is gone, so it cannot quietly return. The founder also reported the line overlapping its row at 374px — derived cause: `marginTop:-2` pulling it into the row's hairline, plus a 45-character run at 9px/.22em against a ~326px measure. It dies with the line.

## 2 · WHAT SHIPPED
The budget row is **editable**. The sheet is two-mode — same class-4 composition, same geometry, one mode per field. Rupee input, digits only, with the register echoed back whole through `formatRs` as she types: `Rs 4,50,000`. No shorthand, no lakhs, no truncation possible.

**The digits-only filter is a defence, not a second validity rule.** Both writers run `parseInt`, which truncates (F-09.165 — `"12,50,000"` persists as **Rs 12**, live today). The app cannot cure that class without diverging from `brideEngine`, which the founder's 「 no clash 」 ruling forbids and W-1 protects. What it *can* do is never construct a value that would truncate. Named in-comment at the site.

## 3 · CENSUS AMENDED, LABELLED, WITH ITS ARITHMETIC
```
145   BUILD-ALL, sealed on the green walk
 +4   Rider 1  — sheet ✕, Save action, date field, dismiss scrim
────
149
 +1   Rider 2  — the rupee field
────
150   Rider 2's floor
```
The budget row itself adds **nothing**: it was already a `Row` and only gained an `onTap`. A tap handler on an existing element is not a new control.

Cell 7.7 was **replaced, labelled** — it asserted the row was read-only and carried the WhatsApp line. It now asserts the opposite state and the sentence's absence.

## 4 · MUTATIONS
| # | mutation | cell |
|---|---|---|
| P-1 | the budget row stops being tappable | 7.7 RED |
| P-2 | the false WhatsApp line creeps back | 7.7 RED |
| P-3 | a raw string is sent instead of an integer | 7.8 RED |
| P-4 | the field accepts `"12,50,000"` and truncates | 7.9 RED |
| P-5 | the register stops being shown whole | 7.10 RED |
| P-6 | the action fires on an invalid budget | 7.11 RED |

## 5 · WALK — four steps
1. Settings → **Total budget** now has a ›. Tap it.
2. Type `450000`. It should read back **Rs 4,50,000** under the field, in copper.
3. Try typing `12,50,000` — **the commas will not go in.** Digits only, by design.
4. Save. The row shows `Rs 12,50,000`. Reopen Settings — still there.

Step 3 is the one worth doing. It is the guard standing between a bride and a Rs 12 budget.
