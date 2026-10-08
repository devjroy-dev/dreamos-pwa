# TDW · CE-47 · HUB-2d APP · the founder's walk (8 Oct 2026), R-47.1, and lesson 5 for b285 and b190 · handover

Base: dreamos-pwa 19631372 (app train 6; HUB-2 app on main as 40edb610). First cut on ace030f8; re-anchored on 19631372, where only pageHelp.ts had moved (PRO's P2). Server: HUB2D_SRV_1 sends the call titles and the new words. Without it, the app still draws: a call with no `title` falls back to its details, then to "A call you posted". Seat: CLB.

## The founder's walk, cured
1. **Mine titled every call "A call".** The server now sends a title for each call: "Decor needed", made the way the old room made it. Mine shows the title, with her details beside it. The calls she applied to show the title too, with the poster's details beside it. Why it happened is in the server handover: the door sent only `details`, and his calls have none.
2. **"From Threads"** is lower case now (on the server). Work joins the items into one sentence: "This list does not yet include briefs from brands, paid jobs from planners or calls posted on Threads."
3. **The chosen tab had a thin outline.** The chosen tab is now filled with the primary colour, with its words in the on-primary colour, like every chosen chip (F-44.367, veto 54). Only the Hub's screen.tsx changes. Today's room (CollabRoomBefore.tsx) stays byte for byte, as ruled.

## R-47.1: every line, old and new

| Where | Old line | New line |
|---|---|---|
| People, top of the list | Everyone on Collab Hub. Only shoots the other person said yes to show as "Worked with". | Everyone on Collab Hub is listed here. "Worked with" appears only after the other person confirms a shoot you did together. *(the founder's words, approved 8 October)* |
| People, under a person or an organisation | Joins your people only after a shoot you did together, and only when they say yes. | You cannot add them yourself. They join your people when they confirm a shoot you did together. |
| People, nothing matches | Nobody matches these choices yet. | Nobody on Collab Hub matches the filters you chose. |
| My people, empty | Nobody on your list yet. Add vendors here, or send a request for a shoot you did together. | Your list is empty. You can add vendors from this page. People and organisations join when they confirm a shoot you did together. |
| Work, the top line | Calls for makeup in Delhi. Newest first. | These are calls from vendors who need makeup in Delhi. The newest call is at the top. |
| Work, after "I am interested" | You said you are interested. If they pick you, you both get each other's number. | The vendor who posted this call can see that you are interested. If they choose you, each of you gets the other's phone number. |
| Work, what is not in yet | Not here yet: briefs from brands, paid jobs from planners, From Threads. | This list does not yet include briefs from brands, paid jobs from planners or calls posted on Threads. |
| Work, no calls | No calls for your craft here right now. | There are no open calls for your craft right now. |
| Mine, no calls | No calls yet. Tap New post to find a second shooter, a stylist, or anyone you need. | You have not posted a call yet. Tap "+ New post" to ask for a second shooter, a stylist or anyone else you need. |
| Mine, a call's title | A call | Decor needed *(the server's title; "A call you posted" only if an older server sends none)* |
| Mine, a request to confirm | If you say yes, it shows on your page and theirs, and you join each other's people. If you say no, it shows nowhere. | If you say yes, the shoot appears on your page and theirs, and you are added to each other's people. If you say no, it does not appear anywhere. |
| Mine, no shoots | Nothing here yet. Shoots show here once the other person says yes. | You have no confirmed shoots yet. A shoot appears here after the other person confirms it. |
| A shoot we did together, the note | For a shoot that was not a call on TDW. Each person you add gets a request. The shoot shows on your page and theirs only after they say yes. | Use this for a shoot that did not start as a call on TDW. Each person you add gets a request to confirm. The shoot appears on your page and theirs only after they confirm. |
| A shoot we did together, the limit | You can send 20 of these requests in any 30 days. N left now. | You can send up to 20 of these requests in any 30 days. You have N left. |
| A request that failed (Work, the sheet) | Could not send. Try again. | Your request did not go through. Please try again. |
| Add that failed | Could not add. Try again. | The app could not add them to your list. Please try again. |
| Take off that failed | Could not take them off. Try again. | The app could not take them off your list. Please try again. |
| An answer that failed | Could not save. Try again. | Your answer was not saved. Please try again. |
| A card's fact | joined as a person | joined as an individual *(a label in a row of facts, made plainer)* |

Kept, already plain:
- "Add the name, the city, the month and at least one person."
- "Search Collab Hub by name or Instagram"
- "<Name> says you worked on this shoot:" and "Someone says you worked on this shoot:"
- "There is no Collab Hub page at this address." (the public page)
- "TDW has no chat. …" and every refusal, which the server sends (see the server table)

**Labels, not lines** (the chair's ruling, 8 Oct: labels are names, held to SIMPLE and EASY only). These are field names, headings, buttons, chips, tabs and pills. Each names one thing on the screen and is not read as a sentence. Listed for the chair to rule on:
- the tabs: Work, People, Mine · 2
- the buttons: "+ New post", I am interested, Add to my people, Take off my people, See their page, Mark filled, "Yes, I worked on it", No, Remove, Send N requests
- the chips: My people · N, the roles, the city, Paid, Barter, Credit only, More roles, Fewer roles, All cities
- the headings: My calls · N, I applied · N, Waiting for your yes · N, Worked with · N, A shoot we did together
- the field names: Name of the shoot, City, Month, Who worked on it
- the loading state: Loading… (kept as it was, by the chair's ruling; an earlier cut of this package had made it a sentence)
- the facts: Call, "on TDW as a vendor", "an organisation", "N interested", "N picked", Closed, Paid ₹…, Credit only
- on the public page: "Open to: …", "Worked with · N", "With …"

**Not rewritten, by the chair's ruling (8 Oct).** CollabRoomBefore.tsx stays byte for byte. The Hub is on for every vendor, so nobody reads the old room. Its retirement is its own later cut.

## The Hub's "?" card (the chair, 8 Oct)
- Only the /vendor/collab entry in `v2/lib/worklist/pageHelp.ts` changed. No other entry or line of the file was touched.
- **Only that one entry is CLB's.** Base of the file: pageHelp.ts at 19631372, sha256 60b23931d6776ac3… (after PRO's P2). The entry was first cut on fae2dd6f… (ace030f8) and re-cut on main's bytes. P2's change, the Business papers connects line, is untouched, and the diff against main is the same 12 lines as before. OFF-2 also touches this file this week. If OFF-2 lands first, I re-cut this one entry on its bytes.
- Its line 1 (ROW_DESC.collabs, "Crew, models and partners to hire or trade with") is the room row's own and is not changed.

| The card | Old line | New line |
|---|---|---|
| Line 2 | To ask for crew, models or partners: tap New post. | To ask for crew, models or partners, tap New post. |
| Line 3 | Opportunities are posts from others. My posts are yours. | Work shows calls from other vendors who need your craft. |
| Line 4 | To add someone you have worked with: open Roster, tap Add someone. | People lists everyone on Collab Hub. You can add another vendor to your people. |
| Line 5 (new) | | Mine shows your calls, the calls you applied to and the requests that wait for your answer. |
| The last line | Replies to your posts open in their own list. | To see who replied to one of your calls, tap the call in Mine. |

## Lesson 5 (F-44.419) for b285 and b190, carried here
The bench-only r2 is dropped as a separate cut (the chair, 8 Oct). It rides in this package:
- b285's mutations go through scripts/lib/mutation_guard.js. A killed run's mutation is put back by sha at the next start. 8.0 refuses to start below 512 MB free. Each restore runs in a finally. A failed apply puts the original back from memory, checked by sha. 8.9 confirms nothing is pending afterwards.
- b190 gains 7.0 (1 GB free before the series) and the same put-back on a failed apply.
- Proven again here, by accident: a run of b285 was stopped part way through on 8 Oct and left screen.tsx changed, with its marker. The guard restored it by sha, and the restored file was this package's own screen.tsx.

## Files
- CHANGED `v2/lib/vendor/hub.ts`:
  - The types: MyCall `title`, Applied `details`.
  - Every line in the table above.
  - New: `HUB.failed` and `mine.untitled`.
- CHANGED `v2/components/vendor/hub/HubMine.tsx`: the title, with details beside it (her calls and applied); the failed line.
- CHANGED `v2/components/vendor/hub/HubWork.tsx`, `HubPeople.tsx`, `ShootTogetherSheet.tsx`: the failed lines.
- CHANGED `v2/app/vendor/(shell)/collab/screen.tsx`: `.col-seg button.on` filled. No other byte changes.
- CHANGED `v2/lib/worklist/pageHelp.ts`: the /vendor/collab entry only (above).
- CHANGED `scripts/b285_hub2_app_bench.js`:
  - r2 (lesson 5).
  - **Amended by label:** 3.2 and 6.2 (the words), and 6.4 (the "?" card is now the Hub's; mutation M12 reddens it).
  - New §9: 9.1 Mine's title, 9.2 the filled tab, 9.3 the founder's People line, 9.4 the not-yet sentence, 9.5 old words gone, 9.6 no em dash, 9.7 the failed lines; mutations M10 and M11.
- CHANGED `scripts/b190_fe6_collab_room_bench.js`:
  - r2 (lesson 5).
  - The stubs carry the server's new shapes (`title`, the not-yet words).
  - New on glass: 1.9 Mine's titles, 1.10 the chosen tab filled (computed colours against the primary tokens), 1.11 the not-yet sentence; mutations H1 to H3.
  - A wait for Mine before 1.6 and 1.7.
  - e-275 (accepted by the chair, 8 Oct): each mutation reads the room again, at most three times, asking the dev server for the page between reads, until its named cell is red. Before this, N4 missed twice with an empty red list: the restore of H3 (hub.ts, which every Hub file reads) was still compiling when N4 was read after a fixed 6 s. Those two runs are struck.
- ADDED `scripts/floor-manifest-ce47-hub2d-app.txt`, this handover, and `docs/handovers/b285_ledger_HUB2D.txt`.

## Proof (on 19631372; each run its own log; floor lines under env -u ANTHROPIC_API_KEY -u DEEPSEEK_API_KEY)
- b285 50/0: its cells plus 8.0, the 12 mutations (M1 to M12) each reddening the cell it names, and 8.9. It ran 20 times under load (b59_v2 and ce41_e2i looping); the ledger is docs/handovers/b285_ledger_HUB2D.txt.
- b190 --mutate, alone, in the main checkout on a fresh .next: 41/0. 1.9, 1.10 and 1.11 are new; 2.1 (the "?" card names New post and fits at 360) is green. N1 to N4, H1 to H3, B1 to B3, G1 and G2 each redden their named cell; 7.0, 7.9 and 8.1 are green.
  - Struck runs: one where 1.7 went red (the new cells left Mine before it re-read; cured with a wait), and two where N4 missed with an empty red list (cured as above).
- tsc --noEmit is clean. eslint is clean on every changed file.
- Every bench that reads a path this package touches (lesson 1), and the e-276 walkers.
  - Static, red by red against a clean 19631372:
    - b40 v1 and b40_v2: C50 and C102 on both sides, the list unchanged; C40 green.
    - ce41_e2ivb: its one cell red on both sides.
    - Green: b59, b59_v2, b75, ce41_brand_family, ce41_e2i, ce41_e2ia, d1_help_v2.
  - In the browser, one at a time, in the main checkout: all green. They are b222, b184 and b140 v1 (which read pageHelp.ts), and b177, b73, ce41_e2iia, ce41_e2iv, b281, b291, b122_v2 and b126_v2.
- b140_v2, strictly alone and narrowed to /vendor/collab: 24/1. The 1 is 3.1, as before, because the real faces cannot load here (fonts.googleapis.com is refused). It has one more cell than before because the card now has four lines.
