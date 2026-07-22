# TDW_04.5 · P4 — HANDOVER ADDENDUM: defect A cured (the assign-external row action)

**Base:** the pwa tip carrying the F-04.110 hotfix · **Role:** executor (CE-59)

## THE DEFECT
`bridgeRosterEntry` shipped exported and called by nothing; `external_vendor`
appeared nowhere in the PWA. The server door was built and benched at P4
completion; the button was not. The charter's PWA build list did not name an
assign-external UI, the charter's smoke card walk required one, and I read both
without reconciling them at read-first. Mine, and the witness-path law exists to
catch exactly this.

## THE CURE — MINT ONLY (CE-59)
`lib/vendor/rosterMint.ts` — framework-agnostic, browser-free, proof-driven
(the `crewCommit.ts` precedent). One Roster row action calls the bridge door and
stops. It creates the external's `team_members` identity; because that row lands
`active:true`, the external then appears in every picker the estate already
ships, and assignment happens THERE, through the events PATCH that routes to
eventWrite. No assignment surface, no event context, no second path to the
calendar.

Idempotent re-tap is a SUCCESS, not an error: the door returns the same row and
the same `page_token`, so the vendor is told the same true thing. `created` is
the door's bookkeeping, not the vendor's news.

## STRINGS (founder veto, CLOSED — exact bytes, proof-asserted)
- row action — `Add to crew`
- success — `They're on your crew list — assign them from any booking.`
- failure — `Could not add. Try again.`

## PROOF
`rosterMint.proof` **22/22**, run via `scripts/run-roster-mint-proof.sh`.

Non-vacuous by PRODUCTION mutation of `lib/vendor/rosterMint.ts`, each reverted:

| Mutation | Result |
|---|---|
| `created:false` treated as failure (idempotence broken) | **19/3 RED** |
| success sentence swapped for the error one | **19/3 RED** |
| refresh fires on failure too | **21/1 RED** |
| the throw guard removed | **21/1 RED** |
| revert | **22/22 restored** |

The ruling's teeth are asserted directly: the mint path has NO events dependency
to call, and carries exactly three deps (`bridge`, `onResult`, `onRefresh`).

Floor byte-stable: `tsc --noEmit` 0 · `bands.proof` 11/11 · `crewCommit.proof` 11/11.

## FILES
`lib/vendor/rosterMint.ts` (new) · `scripts/rosterMint.proof.ts` (new) ·
`scripts/run-roster-mint-proof.sh` (new) · `app/vendor/collab/page.tsx` (the UI shell).

**Sequencing beyond this sitting is the founder's.**
