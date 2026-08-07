# TDW_09 · F-09.165 (pwa half) — THE FIELD LEARNS NOTHING, AND THE QUESTION REACHES HER
**Repo:** `dreamos-pwa` · 3 files · **applies after the dream-os ZIP is at origin**
**Ruling:** CE R-26.5 §C · **carries one defect the founder's own walk caught**

## Gates
`tsc` 0 · `tdw09_p2c` **52/52** · `tdw09_frost_parity` **78/78** (75 → 78) · five mutations, all biting.

## 1 · THE WALK FINDING — MY DEFECT
Step 6 of the walk: the founder typed `50000` in Settings. The server did exactly right — **409, nothing written**, carrying Dream Ai's question as the body. What he read was:

> *"That didn't save. Check your connection and try again."*

His connection was fine. The one sentence the whole floor mechanism exists to deliver never arrived.

**Cause:** `apiFetch` throws `new Error(body.error)` — the message was correct — and `saveProfile` caught it and returned a bare `boolean`. Everything was discarded one line before the UI.

**And I asserted it wouldn't happen.** The route's own comment reads *"the Settings sheet already renders a save error, so the question reaches her with no new UI."* I reasoned about the client from the server side and never traced `saveProfile`. That in-file sentence was a claim with no check run behind it — the exact species this estate has a law about.

**Cured:** `apiFetch` attaches `status` and `body` to the error (message unchanged, so every existing `catch` behaves identically). `saveProfile` returns `{ ok, message, needsConfirmation, budget_total }`. The sheet shows the server's own sentence when it has one, **in ink rather than error-red when it is a question**, and keeps the generic line only for a real failure.

## 2 · THE FIELD LEARNS NO VOCABULARY (CE R-26.5 §C)
Rider 2 filtered the field to digits. That was a **defence** while both writers truncated; F-09.165's cure removed the reason, and the ruling is explicit: forward the raw string, let the one seat coerce, render the echo.

- The input no longer filters. **She can type `4.5L` in Settings now**, because the server understands it.
- `saveProfile` takes `number | string` — a `number` would have meant the client held an opinion about what a budget is, and that second opinion is precisely how two doors drift.
- The live register previews **only on a plain figure**. For `4.5L` the app says **nothing**, because it genuinely does not know — and guessing would be a client-side parser by another name.

## 3 · CELLS 7.8–7.10 REVERSED, LABELLED
They asserted Rider 2's defence — send an integer, filter digits, always preview. Holding them would now pin a defect in place. Reversed in this commit and named in-file, not quietly deleted. Three new cells (7.12–7.14) assert the question reaches her, is carried as a question, and is not painted as an error.

## 4 · WHAT THE WALK PROVED, FOR THE RECORD
| step | result |
|---|---|
| `12,60,000` on WhatsApp | **Rs 12,60,000** — whole. Before: Rs 12. |
| `4.5L` · `1 crore` · `2Cr` | Rs 4,50,000 · Rs 1,00,00,000 · **Rs 2,00,00,000** |
| `45.5` | refused, nothing written |
| `my budget is 50` | **asked**, nothing written — F-09.167 cured |
| same two phrases in the in-app Dream room | identical answers · `couple_self_conversations = 1` |
| Settings `50000` | 409, nothing written — **but the wrong sentence shown.** This ZIP. |

**My verdict cell for step 1 said "UNEXPECTED"** because I hardcoded `1250000` and he typed `12,60,000`. The cell was wrong, not the cure — `1260000` is a pass. An acceptance cell keyed to keystrokes I don't control is a badly written cell.

## 5 · STILL OWED — the verbatim question
The walk confirmed §3(a) of the dream-os handover: the bytes are **paraphrased**, not verbatim.

- ruled: `Noted — Rs 12,50,000.` · live: *"Saved — Rs 12,50,000 is your total."*
- ruled: `Rs 50 — is that the full wedding budget, or did you mean Rs 50,00,000?` · live: *"Just to confirm — Rs 50? That's… quite a budget. Is that 50 lakhs (Rs 50,00,000), or literally 50 rupees?"*

The paraphrase is **good** — it keeps the meaning and the money register (grouped, no glyph). But it is not the ruled byte, and `brideSystemPrompt.js` has no verbatim-relay convention. Founder's call: accept the paraphrase, or widen the W-1 lift by one line.

## 6 · WALK — three steps
1. Settings → Total budget → type `50000` → Save. **You should now read the question, not the connection line**, and it should not look like an error.
2. Same sheet → type `4.5L` → Save. It should land as **Rs 4,50,000**. No preview appears while you type it — that is correct; the app does not parse.
3. Type `450000` → the preview reads **Rs 4,50,000** as you type, and saving lands it.

Step 1 is the one this ZIP exists for.
