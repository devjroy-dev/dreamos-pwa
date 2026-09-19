# repo: dreamos-pwa @ c82753a1eb32527ec5622d9aef28275679d83764 (base) · sibling dream-os @ cb84f6fbc1bcf625298a7f5b631c8c49071c1992
# TDW · CE-44 · SEAT LCV-1 · LC-VICTOR P2 · THE PANEL CUT · F-44.43 · HANDOVER

**Rung b87.** Verified by `bash scripts/verify-lcv-p2panel-pwa.sh` (tsc, b87 in the real panel, a
cold `next build`, the floor with `--delivery` and `--check`).

## 1 · What this cut is

The switchboard's **Listener** switch, on the two working-room vendor lanes, reading and showing
its own value; and the cure of the class that made it misbehave (F-44.43).

**F-44.43, as it stood at `c82753a1` with dream-os `cb84f6f` live.** The panel draws one row per
role the server sends (`ModelRoutesPanel.tsx:241`). Since `cb84f6f` the server sends `listener` on
the working-room vendor lanes. The panel's field for a role came from a ternary that sent every role
that was not `provider` or `donna` to `nudge_provider` (`:115`), and `roleName` fell back to the
raw key (`modelRoutesCopy.ts:103` to `:107`). **Witnessed in the real panel** (b87's probe, base
code, both themes): each working-room lane showed a row named `listener`, lowercase; a Signature
lane whose listener split was DeepSeek showed **Anthropic** (the primary); a pick of DeepSeek on the
Basic lane's listener **posted `{ role: 'listener', provider: 'deepseek' }`** and the row still showed
Anthropic afterwards; and a lane served an invented role (`oracle`) drew a row for it. Admin-only; no
vendor byte; the listener itself reads the route and was unaffected.

## 2 · The cure

| Path | Change |
|---|---|
| `app/admin/switchboard/ModelRoutesPanel.tsx` | An explicit role-to-field map (`ROLE_FIELD`: provider, donna, nudge, listener) replaces the catch-all; `RoleRow` reads `ROLE_FIELD[role]`; **a role absent from the map renders NO row**, and the console names it (`[switchboard] … serves an unknown role "…": no row rendered (F-44.43)`). The server's role list stays the authority for which rows exist. |
| `lib/admin-api/modelRoutesCopy.ts` | `ROLE_NAME` gains `listener: 'Listener'` on `wa_vendor` and `pwa_vendor` only. The founder's word: *"listen-yes"*. |
| `lib/admin-api/index.ts` | `ModelRole` gains `'listener'`; `ModelRoute` gains `listener_provider` and `listener_model`. |
| `scripts/b87_lcv_p2_panel_bench.js` | Rung b87. |
| `scripts/lib/lcv_p2_panel_probe.mjs` | The probe b87 runs: the real switchboard in headless Chromium against `next dev`, the admin door mocked at the network (C-43.18). |
| `scripts/verify-lcv-p2panel-pwa.sh` · `scripts/floor-manifest-lcv-p2panel-pwa.txt` | This cut's floor pair. |
| `docs/handovers/TDW_CE44_LCV_P2PANEL_HANDOVER.md` | This file. |

**The advisor lane shows no Listener row**, because the server (dream-os `cb84f6f`, `modelRouter.js`)
serves no listener role there; b87 witnesses it on the glass.

## 3 · What b87 pins, in both themes

The listener row reads and shows its own split (Signature: DeepSeek over an Anthropic primary); after a
pick it shows the pick (Basic: Anthropic following, then DeepSeek) and the pick posts `role: 'listener'`;
a lane served an invented role renders no row for it and the console names it; the advisor lane shows
Victor and Donna only; the working-room lanes name it Listener. The browser resolves the pwa's way
(`CHROME_BIN`, then `@sparticuz/chromium`). **One mutation** restoring the catch-all makes the
invented-role cell red; the mutated file is restored byte for byte and its hash re-checked.

## 4 · REAL beside new

Four screenshots of the model-routes panel, the same three lanes, before any pick: REAL (base code) and
NEW, dark and light. They accompany the delivery message; they are not committed.

## 5 · Errors owned

- **e-8.** P2's dream-os cut put `listener` into the working-room lanes' roles without checking what the
  live panel does with a role it does not know. It drew a mislabelled row reading the wrong field until
  this cut. Found by reading the pwa at its tip before building, and reported before the founder met it.

---

Trust evidence over narrative, including this file. Sequencing beyond this sitting is the founder's.
