# CE-41 · A9 — CONCIERGE s1 SEAL RIDERS (dreamos-pwa) · HANDOVER

**Cut by** LE-A **at** dreamos-pwa `bc76e24` (sibling dream-os `66b4dc6`, A8). Six files. `tsc` clean; `next build` the founder's.

| finding | file | cure | what was actually wrong |
|---|---|---|---|
| **F-41.38** (R-41.67) | `app/(landing)/page.tsx` | `entryChecked` state; until the F-41.1 effect has read the session the page renders one blank frame (`#0C0A09`, the hero's own ground); a redirect keeps it blank, no session lets the hero paint, off-root paths paint at once. | The effect ran after the hero had painted. The server-side cookie redirect (no blank at all) waits for F-41.13. |
| **F-41.39** | `app/admin/assistance/page.tsx` | `normaliseDate()` — ISO passes; `DD/MM/YYYY`, `DD-MM-YYYY`, `DD.MM.YYYY` → ISO; junk → null. The field shows *files as 22 Dec 2026* / *no date* / *not a date yet* beside its label; the wire carries the normalised value. | **The path was intact** (`type="date"` → door → `toDateOrNull`). Chrome's date picker at 374 did not commit typed digits, so `date` stayed `''`. The cure makes the field's fate visible and tolerant of a hand-typed date. |
| **F-41.40** | `app/admin/assistance/page.tsx` | `ABOVE_ADMIN_BAR` bottom padding on the typed form and the detail's last row. | The sheet is `position:fixed` at `zIndex 301` **inside** the admin content wrapper, which animates with `className="fade-up"` — a transform creates a stacking context, so the sheet stacks under the bar's `195` regardless of its own z. **Estate-wide fix: a portal in `BottomSheet`** — every admin page uses it; named for the chair, not cut here. |
| **F-41.41** | `app/(frost)/frost/canvas/assistance/page.tsx` | `settled` state set in `.finally()` of the read; until then a quiet frame (header, empty lede, no form, no card); then S1 or S2 drawn once. | S1 rendered immediately and swapped to S2 when the read returned. |

**Bench:** `b20_a3` 88/88 cured (seven A9 cells; `normaliseDate` driven behaviourally through the repo's TypeScript); RED at `bc76e24` on all seven. Floor under `--delivery`: see the packet note.

**The founder's witness (Vercel at this tip):** signed in as Sarah, type the domain → no marketing flash, straight to `/frost` (a brief dark frame is the ruled trade) · signed out, type the domain → the hero (after the same brief dark frame) · admin → + Type a request → type `22/12/2026` → the label hint reads *files as 22 Dec 2026*; **File the request** sits above the bar; the row reads the date · Settings → Wedding assistant → no empty form flashes before S2.

Sequencing beyond this sitting is the founder's.
