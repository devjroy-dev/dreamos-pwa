# G3.4 · SITTING 2 — VETO SHEET · the schedule can be corrected

**Mock:** `docs/mocks/schedule-edit-mock.html` · seven frames · 28 shots (`schedule-edit-mock__S*__{dark,light}__{374,390}.png`) · authored at dreamos-pwa `3d65c4e8787042225e4f57818564f153e36d40bd` / dream-os `2a0d838a4c99cedd5082b49340e5fe80a30da72e`; **cut at dreamos-pwa `034426fd956216cdebaca58ff490471fdc00a643`** (concierge s1 sealed), the carry touching nothing under `docs/mocks/`. Nothing under `src/`, `app/`, `components/` or `lib/` has moved.

**STATUS: RATIFIED 2026-09-08 (R-41.70)** — the founder delegated this room's veto to the chair. §A 1–4 · §B 5–10 · §C 12–14 · §D 15–18 · §E 19–20 stand as written. **Item 11 struck from s2**: *Remove this milestone* is not drawn; it goes to a later sitting with its own door and re-share design. S1 is the tree transcribed and was never up for veto.

**Findings this mock answers:** F-40.215 (edit · remove, R-41.61) · F-41.15 (the chip reads the wamid, R-41.59) · F-41.17 (plain words on the vendor glass). **Not in this mock** (backend-only, no glass): F-41.14 (gate before claim) · F-41.16 (the skip branch logs) · F-41.21 (one send-log home) · F-40.229 (the receipt arm, R-41.62: the room stays at *Sent*).

## §A · WHERE THINGS SIT (S2)
1. **Edit** on each pending milestone row, beside Remind/Paid. Opens S3. A paid row has no Edit — a paid share is history.
2. **Remove schedule** in the panel header, at the rule's end, critical ink at rest. The whole schedule — the door that exists (`deleteSchedule`, unreached since s1). Opens S5.
3. **The row becomes two lines**: words on line one, controls on line two. S1 shows the shipped row wrapping *Rs 18,000 · 30% · 8 Sep 2026* over three lines at 374 with three controls; the first shot of this mock with five went to one word per line. This is a G3.4 s1 defect named here, not inherited.
4. The invoice's own **Delete** becomes **Delete invoice** (R-41.61). *Edit Here* is unchanged.

## §B · THE EDIT SHEET (S3, S4)
5. Title: the milestone's own label (*Shoot day*).
6. Note: *Change the name, the share or the date. The amount follows the share.*
7. Fields: **Milestone** · **Share** (`%`) · **Amount** (read-only, the door's recomputation) · **Due**.
8. Under the fields, the running tally: *Shares total 100% of 100%.* — the s1 sheet's `100% of 100%` idiom carried.
9. **Cancel** · **Save** (Save = `PATCH /schedules/:milestoneId`, which already accepts exactly these three fields).
10. On a refusal the door's own sentence prints in critical ink and Save dims: *Percentages would sum to 110, not 100.* (S4). The number is the door's, never the glass's.
11. ~~Remove this milestone~~ — **struck at the veto (R-41.70)**, not drawn. No per-milestone delete door exists and the shares must still total 100; a later sitting's, with its own door and re-share design.

## §C · REMOVE THE SCHEDULE (S5)
12. *Remove the schedule for **Priya Nair**?* — the same question shape the sheet uses for the invoice (`DetailSheet.tsx:105`).
13. Second line: *The three milestones go. Reminders already sent stay in your record.* (0139: rows outlive the milestone, R-G34.6 — the sentence tells her what she keeps.)
14. **Keep** · **Remove**.

## §D · THE CHIP'S THREE STATES (S6) — F-41.15
15. A wamid → **Reminder sent**, no Remind. (Unchanged word, now true.)
16. A `failed` row → **Didn't go** in the caution ink, and **Remind** offered again (R-41.59's relaxed UNIQUE). The chair proposed *Reminder didn't go — try again*; at 8px/0.28em it does not fit beside three controls, so the row says the short form and the toast on the failed tap says the full sentence.
17. No row → nothing said, **Remind** offered.
18. Toast on a failed Remind: *Reminder didn't go — try again.*

## §E · THE SHUT GATE IN PLAIN WORDS (S7) — F-41.17
19. *Reminders are switched off for now.* — replaces the register key on the glass. The door keeps the key in `reason` for the log and adds `reason_text` for the room.
20. The pill for this case loses its critical border (plain border): a switched-off feature is not her error. The other four refusals (*this client has no phone number on the invoice* …) already speak plainly and keep the critical border.

## §F · WHAT THE SEAT DID NOT DRAW
- No screenshot of the sweep, the receipt arm, or the log lines — none of those touch the vendor glass (R-41.62).
- No new colour, no new type size: every ink is `--role-*` / `--atelier-*` from the head the G3.4 mock ratified; the two new controls (`Edit`, `Remove schedule`) use `--atelier-card-border`/`--atelier-ink-dim` and `--role-critical` at rest.
