# TDW · CE-47 · ADS-2 · PACKAGE A: THE GUARD, THE KIT ON IT, THE FLOOR SETTLES FIRST · R-47.1 FOR POSTS & ADS · dreamos-pwa

BASE: 0038eb41 (main's tip: app train 6 at 19631372, then PTN-A2-1 b2df92b5 and HUB-2d 0038eb41). Built and proven on
19631372; HUB-2d then changed v2/lib/worklist/pageHelp.ts in its /vendor/collab entry only, so this package's pageHelp.ts
is a three-way merge of that and my edits, with no conflict and every one of my hunks byte for byte as on 19631372. The
proof below has both: the full series on 19631372, then every bench once more base against cut on 0038eb41 (q7).
Scripts, two copy homes and one admin copy home. WALK: the vendor-facing lines in Table 2 below change what a vendor reads in Posts & ads; nothing else is drawn
differently.

## F-44.422 · a live writer is not a killed run (scripts/lib/mutation_guard.js)
A marker now names its writer: pid and that process's start time (ps -o lstart=, on Linux and the Mac). recover() leaves
a marker alone while its writer is alive, reports it in `live`, and restores it once the writer is dead; a marker of the
calling process, or one written before this cure (no pid), reads as dead, exactly as before. A kept copy younger than a
minute is not swept as an orphan (it may be a live apply between its steps 1 and 2). recoverOrRefuse waits, bounded
(10 minutes), for a live writer, and then refuses with rc 3 naming the owner. b174 holds it: L1 to L5 in the helper's
self-test, M5 to M7 bite them. The callers, by git grep: b140_v2, b143_v2, b173, b175, b176, b190, b191, b192, b193,
b194, b195, and b257, b206, and the FE-7 kit's runBench and b177.

## F-44.419 and F-44.422 · the FE-7 kit's mutate() goes through the guard (scripts/lib/fe7_l4_kit.js)
Every plant goes through mutation_guard.js; free space is checked first (256 MB; below it the mutation is not planted
and its cell is a named red). recovered() runs the guard's recoverOrRefuse BEFORE runBench reads its anchors. THE OLD
JOURNAL IS RETIRED. It was one file in os.tmpdir() for every tree on the machine, read against the current tree: it
restored a live run's mutation, two runs overwrote each other's, and a journal from tree X could be written into tree Y.
It names no tree, so a journal found at start is SET ASIDE and named, never deleted, never written into any tree. (On 8
Oct a container restart in the seat left one for the base tree while the cut tree was clean: a first cut that deleted
"a journal whose file is the original here" would have lost the base tree's original.) b257 §7 holds it: 7.1 a plant
through the guard, 7.2 a kill mid-mutation recovered at the next start, 7.3 the free-space refusal, 7.4 the journal set
aside either way. b177 amended by label (its 0.0 cell's words).

## F-44.424 · the floor settles every marker before it reads the dirt (scripts/run-floor.sh)
A Codespace restart killed b189's M1 mid-mutation and left AtelierForm.tsx changed ("void only;"); the floor's restart
stopped on "dirt OUTSIDE the declared manifest". run-floor.sh now runs `node scripts/lib/mutation_guard.js --recover
"(the floor)"` right before its delivery check: a dead run's file is restored by sha and named, a live one waited for and
refused (rc 3), an unprovable one refused (rc 2). A tree without the guard (a bench's fixture repo) has nothing to
settle. b174 §R: R1 a floor start after a kill mid-mutation restores lib/AtelierForm.tsx and goes on; R2 the same floor
without the line stops on the dirt, the file left changed.

## R-47.1 · POSTS & ADS

## TABLE 1 · THE FOUNDER'S LINES (his approvals of 10 to 30 Sept and 4 Oct). NOT APPLIED: none changes without his yes.

| where | old | new (proposed) | why it fails |
|---|---|---|---|
| ads.choose.accountBody | Meta shows {n} ad accounts on your login. Pick the one to use for TDW. You can change it later in All settings. | Your Meta login has {n} ad accounts. Pick the one TDW should use. You can change it later in All settings. | "shows … on your login" is not plain |
| ads.connect.iphone | Press and hold Connect ad account, then choose "Open in New Tab". A normal tap gets caught by the Facebook app. | Press and hold Connect ad account, then choose "Open in New Tab". A normal tap opens the Facebook app instead. | "gets caught by" is chatty |
| ads.gaps.intro | Before your first ad, Meta needs three things from you. We check them all when you connect. | Before your first ad, Meta needs three things from you. TDW checks all three when you connect. | "We" has no clear subject |
| ads.gaps.page | Connected, but your Facebook account has no Page yet. Make one in about two minutes, then come back and tap Check again. | Your Facebook account is connected, but it has no Page yet. Making a Page takes about two minutes. When it is made, come back and tap Check again. | the subject is missing |
| ads.gaps.linkSwitch | On Facebook, switch into your Page first (tap your picture at the top right, then the Page), then tap Link my Instagram again. | On Facebook, switch to your Page first. To do that, tap your picture at the top right, then tap the Page. Then tap Link my Instagram again. | three ideas in one clause |
| ads.gaps.account | Your Page and Instagram are ready. The last thing is an ad account with your card. Make it in Meta Business Suite in about three minutes, then tap Check again. | Your Page and Instagram are ready. The last step is an ad account that uses your card. Making it in Meta Business Suite takes about three minutes. When it is made, tap Check again. | "the last thing is" is not a fact; two ideas share one clause |
| ads.draft.whySaves | {post}, posted {date}, is your most saved post this month: {saves} saves and {reach} reach with no money behind it. Posts that people save are the ones that bring enquiries, so this is the one to boost first. | {post}, posted on {date}, is your most saved post this month. {saves} people saved it and {reach} people saw it, with no money spent on it. Posts that people save bring the most enquiries, so this is the post to run as an ad first. | "reach" and "boost" are shorthand; a list follows a colon |
| ads.draft.whyLikes | {post}, posted {date}, is your most liked post this month: {likes} likes and {comments} comments with no money behind it. Posts people respond to are the ones that bring enquiries, so this is the one to boost first. | {post}, posted on {date}, is your most liked post this month. It has {likes} likes and {comments} comments, with no money spent on it. Posts that people respond to bring the most enquiries, so this is the post to run as an ad first. | as above |
| ads.draft.whyShort | Your most saved post this month: {saves} saves and {reach} people reached, with no money behind it. | This is your most saved post this month. {saves} people saved it and {reach} people saw it, with no money spent on it. | a noun stands where a sentence is needed |
| ads.draft.plan | For Rs {daily} a day over {days} days, Meta shows this post to people in {places}, aged {min} to {max}. Meta takes up to Rs {total} in all from your ad account's payment method, never more. | For Rs {daily} a day over {days} days, Meta shows this post to people in {places}, aged {min} to {max}. Meta takes up to Rs {total} in all from your ad account's payment method. It never takes more. | "never more" is a fragment |
| ads.confirm.changed | Something changed. Look at the settings again and tap Run. | Your settings changed while this screen was open. Check them again, then tap Run this ad. | the subject is vague; "Run" is not the button's name |
| ads.running.line | Running since {since}, until {until}. So far {reach} people in {places} have seen this post, and {enquiries} of them wrote to you. {inLeads} | This ad started on {since} and runs until {until}. So far {reach} people in {places} have seen this post, and {enquiries} of them wrote to you. {inLeads} | the first sentence has no subject |
| ads.yours.running | Running until {until}. {reach} people have seen it, {enquiries} wrote to you, Rs {spent} of Rs {total} spent. | This ad runs until {until}. {reach} people have seen it, {enquiries} wrote to you, and Meta has charged Rs {spent} of Rs {total}. | fragments |
| ads.yours.paused | Paused on {date} by you. {reach} people saw it, {enquiries} wrote to you, Rs {spent} spent. | You paused this ad on {date}. {reach} people saw it, {enquiries} wrote to you, and Meta charged Rs {spent}. | fragments |
| ads.yours.ended | Ended on {date}. {reach} people saw it, {enquiries} wrote to you, Rs {spent} spent. That is Rs {each} for each enquiry. | This ad ended on {date}. {reach} people saw it, {enquiries} wrote to you, and Meta charged Rs {spent}. Each enquiry cost Rs {each}. | fragments |
| ads.results.inLeads | All {enquiries} are in Enquiries. | You can find all {enquiries} of them in Enquiries. | unclear what "all {n}" are |
| ads.results.days | Day by day: {days}. | Here are the results for each day: {days}. | a label stands where a sentence is needed |
| ads.results.next | What to try next: {next} | Try this next time: {next} | a label stands where a sentence is needed |
| ads.fmt.resultDay | {reach} reached, {enquiries} wrote, {spent} | {reach} people saw it, {enquiries} wrote to you, and Meta charged {spent}. | the chair's shape for results |
| ads.q.postKinds | Your Instagram posts and your Facebook Page posts. A Facebook post sends people to Messenger; an Instagram post sends them to your Instagram messages. | This list shows your Instagram posts and your Facebook Page posts. A Facebook post sends people to Messenger. An Instagram post sends them to your Instagram messages. | a noun stands where a sentence is needed; two ideas share one sentence |
| posts.ledeCards | Cards made from your last wedding page. | TDW makes these cards from your last wedding page. | the subject is missing |
| posts.ledeSunday | Every Sunday: your week on Instagram. | Every Sunday, TDW sends you a summary of your week on Instagram. | a noun stands where a sentence is needed |
| posts.notOnYet | Not switched on yet. | This section is not switched on yet. | the subject is missing |
| posts.exampleLine | An example card. Yours are made from your last wedding page. | This is an example card. TDW makes yours from your last wedding page. | a noun stands where a sentence is needed |
| posts.feeLine | Meta charges up to {rs} for this send. | Meta charges up to {rs} to send this message. | "this send" is shorthand |
| posts.messageFacts | {n} past clients · Meta charges up to {rs} | This message goes to {n} past clients. Meta charges up to {rs}. | a fact row of fragments |
| posts.referralFacts | Once a year · next {date} | This message goes once a year. The next one goes on {date}. | a fact row of fragments |
| posts.sentLine | Sent to {n}. {m} not delivered. | TDW sent the message to {n} past clients. {m} of the messages were not delivered. | fragments |
| posts.referralNextLine | Your referral message goes once a year. Next: {date}. | Your referral message goes once a year. The next one goes on {date}. | "Next: {date}" is a fragment |
| features.waiting | Waiting for Meta's approval. It starts by itself when approved. | This feature is waiting for Meta's approval. It starts by itself when Meta approves it. | the subject is missing |
| solutions ROW_DESC.posts (the room's line, line 1 of its Help card) | Posts, reels and ad briefs, drafted from the portfolio and calendar | TDW drafts your posts, reels and ad briefs from your portfolio and your calendar. | a noun phrase, no verb. Also, I cannot find a reel or an ad brief drafted in this room today; the founder may want the line to say what the room does now |

## TABLE 2 · lines that are mine or the chair's: APPLIED in this package (v2 tree; posts.ts serves both trees)

| where | old | new | why it fails |
|---|---|---|---|
| ads.choose.funds (mine, ADS-2 item 4) | Funds: {amount} | This account has {amount} to spend. | a label and a value, drawn inline |
| ads.choose.pageBody (mine, "for the chair") | Meta shows {n} Pages on your login. Pick the one to use for TDW. You can change it later in All settings. | Your Meta login has {n} Pages. Pick the one your ads should come from. You can change it later in All settings. | as accountBody |
| pageHelp ADS_HELP.what (the chair's, 28 Sept) | Boosting shows one of your Instagram or Facebook posts to people in your city who are planning a wedding, for a daily amount you set and a number of days you choose. | An ad shows one of your Instagram or Facebook posts to people in your city who are planning a wedding. You set the amount for each day and the number of days. | "Boosting" is shorthand; two ideas share one sentence |
| pageHelp ADS_HELP.leads (the landing's) | People who write after seeing the ad land in Enquiries, and this page tells you what each ad reached, what it cost, and what to try next. | People who write to you after seeing an ad appear in Enquiries. This page shows what each ad reached, what it cost, and what to try next. | two ideas share one sentence |
| pageHelp Ads, step 1 (ADS-1's, relayed) | To start: tap Connect ad account, then Continue to Meta. Meta opens in its own window; come back when it is done. | To start, tap Connect ad account, then tap Continue to Meta. Meta opens in its own window. Come back here when you are done. | two ideas share one sentence |
| pageHelp Ads, step 2 | To run an ad: check the post at the top, tap Change beside Who sees it, Where it appears, Amount or Dates if you want, then tap Run this ad and confirm. | To run an ad, check the post at the top. To change who sees it, where it appears, the amount or the dates, tap Change beside that row. Then tap Run this ad and confirm. | three ideas in one sentence |
| pageHelp Ads, step 3 | To see it as people will: the post at the top is shown the way people see it. | The post at the top is shown the way people will see it. | it says the same thing twice |
| pageHelp Ads, step 4 | To stop an ad: tap the ad under Your ads, then Pause this ad or End it now. | To stop an ad, tap it under Your ads, then tap Pause this ad or End it now. | the colon form; the second verb is missing |
| pageHelp Posts, step 1 (the chair's yes, 30 Sept) | To post one: tap Download or Share beside it. | To post a card, tap Download or Share beside it. | "one" has no noun |
| pageHelp Posts, step 2 | To run or see your ads: tap the row under Ads. | To run or see your ads, tap the row under Ads. | the colon form |
| pageHelp Posts, step 3 | To send a message to past clients: tap Newest work message or Referral message. | To send a message to your past clients, tap Newest work message or Referral message. | the colon form |
| pageHelp Posts, connects | Connects to your wedding pages and your Meta ad account. | This room uses your wedding pages and your Meta ad account. | the subject is missing |
| posts.noCouples (the chair's yes, W1) | No past clients with a number yet. | None of your past clients has a phone number saved yet. | a noun stands where a sentence is needed |
| switchboard, eight "spec" lines (mine, cut 2) | Meta app TDW ADS · in review | This permission belongs to the Meta app TDW ADS. Meta is still reviewing it. | a fact row of fragments (admins read it) |
| switchboard flag.ads spec | Meta app TDW ADS · needs all six ads permissions below | This switch belongs to the Meta app TDW ADS. It needs all six ads permissions listed below. | as above |
| switchboard flag.ig_photo_import spec | Meta app App-LIVE · needs Instagram basic | This switch belongs to the Meta app App-LIVE. It needs the Instagram basic permission. | as above |


## BENCHES AMENDED BY LABEL for Table 2
b143_v2 11.2 (the funds line's new words); b140_v2 M9 (its anchor on the Ads card's first step); b173 (the Posts card's
three steps and connects line, the past-clients line, and M3's anchor); b74 (the past-clients line, read from posts.ts,
which the classic Posts room reads too); b256 3.1 (the switchboard's spec lines).

## READ AND PASSING (no change): every other statement in v2/lib/worklist/ads.ts, posts.ts and features.ts, the Posts
Help card's three lines once rewritten, getFound's "Posts and ads are not set up yet.", and all buttons, headings,
labels, pills and hints.

## OPEN, for the chair
1. The Sunday section in the Posts room reads lib/worklist/sunday.ts. Five of its lines fail ("Nothing posted this
   week.", "Last week's brief. This week's is on its way.", "Preview · sample numbers", and two more). Whose room is
   the Sunday report? If it is mine, the five go in Table 1 or 2 by whose approval they carry.
2. The classic tree (lib/worklist/ads.ts) still differs from v2 and still says "couples" twice. Does R-47.1 cover the
   classic tree, which only vendors without the new layout see?
3. Benches that pin these words, to amend by label: b143 and b143_v2 (the Ads page), b73/b74 (the Posts room), b256
   (features), b140 and b140_v2 (the Help card lines), and whichever reads the switchboard spec lines. I count them
   when the founder answers Table 1, so each bench is amended once.

## PROOF

### ON 19631372 (app train 6): the full series

Base 19631372 (tree /home/claude/pwa-t6, clean) against the cut (19631372 plus these 17 paths). Every row below is a
line of the series ledger; struck rows are kept and marked. Struck means F-44.370 (a fresh next dev answering every
/vendor/* with 404 for its whole life; the cause is not found) and nothing else; each was rerun at the end of the plan.

#### q6 · quiet, base against cut, the same bench on both trees, one at a time

| bench | base | cut | the cells |
|---|---|---|---|
| b174 | run 1 rc 0 24/0 | run 1 rc 0 34/0 | cut adds 10: 1.1 L1 passes in the helper's self-test · 1.1 L2 passes in the helper's self-test · 1.1 L3 passes in the helper's self-test · 1.1 L4 passes in the helper's self-test · 1.1 L5 passes in the helper's self-test · M5  L1 FAILS on the planted defect · M6  L3 FAILS on the planted defect · M7  L5 FAILS on the planted defect · R1 a floor start after a kill mid-mutation restores the file · R2 both ways: the same floor without its recovery line stops |
| b257 | run 1 rc 0 36/0 | run 1 rc 0 40/0 | cut adds 4: 7.1 a mutation is planted through the guard (a marker naming · 7.2 a run killed mid-mutation leaves it recoverable, and the · 7.3 below the free-space floor nothing is planted, and the c · 7.4 the old journal is retired: set aside and named either w |
| b133 | run 1 rc 0 15/0 | run 1 rc 0 15/0 | IDENTICAL |
| b206 | run 1 rc 0 34/0 | run 1 rc 0 34/0 | IDENTICAL |
| b177 | run 1 rc 0 48/0 | run 1 rc 0 48/0 | IDENTICAL |
| b178 | run 1 rc 0 26/0 | run 1 rc 0 26/0 | IDENTICAL |
| b179 | run 1 rc 0 22/0 | run 1 rc 0 22/0 | IDENTICAL |
| b180 | run 1 rc 0 26/0 | run 1 rc 0 26/0 | IDENTICAL |
| b181 | run 1 rc 0 23/0 | run 1 rc 0 23/0 | IDENTICAL |
| b182 | run 1 rc 0 22/0 | run 1 rc 0 22/0 | IDENTICAL |
| b183 | run 1 rc 0 17/0 | run 1 rc 0 17/0 | IDENTICAL |
| b184 | run 1 rc 143 2/4 (STRUCK, F-44.370) · run 2 rc 0 80/0 | run 1 rc 0 80/0 | IDENTICAL |
| b185 | run 1 rc 0 28/0 | run 1 rc 0 28/0 | IDENTICAL |
| b186 | run 1 rc 0 30/0 | run 1 rc 0 30/0 | IDENTICAL |
| b187 | run 1 rc 0 26/0 | run 1 rc 0 26/0 | IDENTICAL |
| b188 | run 1 rc 0 27/0 | run 1 rc 0 27/0 | IDENTICAL |
| b189 | run 1 rc 0 27/0 | run 1 rc 0 27/0 | IDENTICAL |
| b173 | run 1 rc 0 38/0 | run 1 rc 0 38/0 | IDENTICAL |
| b195 | run 1 rc 0 18/0 | run 1 rc 0 18/0 | IDENTICAL |
| b74 | run 1 rc 3 0/0 (refused: no ../dream-os beside the tree; cloned at dae04b0, rerun) · run 2 rc 0 12/0 | run 1 rc 3 0/0 (refused: no ../dream-os beside the tree; cloned at dae04b0, rerun) · run 2 rc 0 12/0 | IDENTICAL |
| b256 | run 1 rc 0 21/0 | run 1 rc 0 21/0 | IDENTICAL |
| b140_ce46_fe4_page_help_bench_v2 | run 1 rc 0 10/0 | run 1 rc 0 10/0 | IDENTICAL |

#### s6 · the cut, repeated under load (every core held busy by a spin loop for the whole run), one bench at a time

| bench | runs | green | struck (F-44.370, rerun) | red | the count every green run gave |
|---|---|---|---|---|---|
| b174 | 20 | 20 | — | none | 34/0 |
| b257 | 20 | 20 | — | none | 40/0 |
| b177 | 21 | 20 | run 7 | none | 48/0 |
| b173 | 20 | 20 | — | none | 38/0 |
| b74 | 20 | 20 | — | none | 12/0 |
| b256 | 20 | 20 | — | none | 21/0 |
| b178 | 5 | 5 | — | none | 26/0 |
| b179 | 6 | 5 | run 5 | none | 22/0 |
| b180 | 5 | 5 | — | none | 26/0 |
| b181 | 5 | 5 | — | none | 23/0 |
| b182 | 5 | 5 | — | none | 22/0 |
| b183 | 5 | 5 | — | none | 17/0 |
| b184 | 6 | 5 | run 3 | none | 80/0 |
| b185 | 6 | 5 | run 1 | none | 28/0 |
| b186 | 5 | 5 | — | none | 30/0 |
| b187 | 5 | 5 | — | none | 26/0 |
| b188 | 5 | 5 | — | none | 27/0 |
| b189 | 5 | 5 | — | none | 27/0 |

#### w6 · alone, base against cut

| bench | base | cut | the cells |
|---|---|---|---|
| b143_ads1_ads_page_bench_v2 | rc 0 121/0 · 1384 s | rc 0 121/0 · 1380 s | IDENTICAL |
| b140_ce46_fe4_page_help_bench_v2 | rc 1 732/52 (52 × 3.1) · 421 s | rc 1 732/52 (52 × 3.1) · 414 s | IDENTICAL, red cells included |

b140_v2 3.1 is red on BOTH trees, cell for cell, as on every earlier series (w3, w4): "the real faces did not load".
This sandbox refuses fonts.googleapis.com, so next/font serves the fallback face. It is the sandbox, not this
package; on the founder's machine the faces load. Every one of its mutations reddens and is restored by sha on both.


#### F-44.370 in this series (19631372)

5 of 235 runs: q6 b184 base run 1; s6 b177 cut run 7; s6 b179 cut run 5; s6 b184 cut run 3; s6 b185 cut run 1.
1 of them on the BASE tree (q6 b184 base 1), so it is not this package. Each server log is kept with me:
every /vendor/* answered 404 from the first request to the kill; a good run's server log carries the same
fonts.googleapis.com errors, so those are not the difference. The cause is still not found.

### ON 0038eb41 (main's tip): every bench once more, base against cut, and the four benches PTN-A2-1 and HUB-2d brought (b190, b285, b291, b297)

Base 0038eb41 (tree /home/claude/pwa-t7, clean) against the cut (0038eb41 plus these 17 paths). Every row below is a
line of the series ledger; struck rows are kept and marked. Struck means F-44.370 (a fresh next dev answering every
/vendor/* with 404 for its whole life; the cause is not found) and nothing else; each was rerun at the end of the plan.

q7 b174 base run 1 overlapped a fresh-clone test of mine for its first ten seconds; it was green, and run 2 alone was green too.

#### q7 · quiet, base against cut, the same bench on both trees, one at a time

| bench | base | cut | the cells |
|---|---|---|---|
| b174 | run 1 rc 0 24/0 · run 2 rc 0 24/0 | run 1 rc 0 34/0 | cut adds 10: 1.1 L1 passes in the helper's self-test · 1.1 L2 passes in the helper's self-test · 1.1 L3 passes in the helper's self-test · 1.1 L4 passes in the helper's self-test · 1.1 L5 passes in the helper's self-test · M5  L1 FAILS on the planted defect · M6  L3 FAILS on the planted defect · M7  L5 FAILS on the planted defect · R1 a floor start after a kill mid-mutation restores the file · R2 both ways: the same floor without its recovery line stops |
| b257 | run 1 rc 0 36/0 | run 1 rc 0 40/0 | cut adds 4: 7.1 a mutation is planted through the guard (a marker naming · 7.2 a run killed mid-mutation leaves it recoverable, and the · 7.3 below the free-space floor nothing is planted, and the c · 7.4 the old journal is retired: set aside and named either w |
| b133 | run 1 rc 0 15/0 | run 1 rc 0 15/0 | IDENTICAL |
| b206 | run 1 rc 0 34/0 | run 1 rc 0 34/0 | IDENTICAL |
| b177 | run 1 rc 143 6/0 (STRUCK, F-44.370) · run 2 rc 0 48/0 | run 1 rc 0 48/0 | IDENTICAL |
| b178 | run 1 rc 0 26/0 | run 1 rc 143 6/0 (STRUCK, F-44.370) · run 2 rc 0 26/0 | IDENTICAL |
| b179 | run 1 rc 0 22/0 | run 1 rc 0 22/0 | IDENTICAL |
| b180 | run 1 rc 0 26/0 | run 1 rc 0 26/0 | IDENTICAL |
| b181 | run 1 rc 0 23/0 | run 1 rc 0 23/0 | IDENTICAL |
| b182 | run 1 rc 0 22/0 | run 1 rc 0 22/0 | IDENTICAL |
| b183 | run 1 rc 0 17/0 | run 1 rc 0 17/0 | IDENTICAL |
| b184 | run 1 rc 0 80/0 | run 1 rc 0 80/0 | IDENTICAL |
| b185 | run 1 rc 0 28/0 | run 1 rc 0 28/0 | IDENTICAL |
| b186 | run 1 rc 0 30/0 | run 1 rc 0 30/0 | IDENTICAL |
| b187 | run 1 rc 0 26/0 | run 1 rc 0 26/0 | IDENTICAL |
| b188 | run 1 rc 143 3/6 (STRUCK, F-44.370) · run 2 rc 0 27/0 | run 1 rc 0 27/0 | IDENTICAL |
| b189 | run 1 rc 0 27/0 | run 1 rc 0 27/0 | IDENTICAL |
| b173 | run 1 rc 0 38/0 | run 1 rc 0 38/0 | IDENTICAL |
| b195 | run 1 rc 0 18/0 | run 1 rc 0 18/0 | IDENTICAL |
| b74 | run 1 rc 0 12/0 | run 1 rc 0 12/0 | IDENTICAL |
| b256 | run 1 rc 0 21/0 | run 1 rc 0 21/0 | IDENTICAL |
| b190 | run 1 rc 0 27/0 | run 1 rc 0 27/0 | IDENTICAL |
| b285 | run 1 rc 0 50/0 | run 1 rc 0 50/0 | IDENTICAL |
| b291 | run 1 rc 0 55/0 | run 1 rc 0 55/0 | IDENTICAL |
| b297 | run 1 rc 0 32/0 | run 1 rc 0 32/0 | IDENTICAL |
| b140_ce46_fe4_page_help_bench_v2 | run 1 rc 0 10/0 | run 1 rc 0 10/0 | IDENTICAL |
| b140_ce46_fe4_page_help_bench | run 1 rc 0 10/0 | run 1 rc 0 10/0 | IDENTICAL |


#### w7 · alone, base against cut

| bench | base | cut | the cells |
|---|---|---|---|
| b140_ce46_fe4_page_help_bench_v2 | rc 1 732/52 (52 × 3.1) · 426 s | rc 1 732/52 (52 × 3.1) · 427 s | IDENTICAL, red cells included |

b140_v2 3.1 is red on BOTH trees, cell for cell, as on every earlier series (w3, w4): "the real faces did not load".
This sandbox refuses fonts.googleapis.com, so next/font serves the fallback face. It is the sandbox, not this
package; on the founder's machine the faces load. Every one of its mutations reddens and is restored by sha on both.


#### F-44.370 in this series (0038eb41)

3 of 60 runs: q7 b177 base run 1; q7 b178 cut run 1; q7 b188 base run 1.
2 of them on the BASE tree (q7 b177 base 1, q7 b188 base 1), so it is not this package. Each server log is kept with me:
every /vendor/* answered 404 from the first request to the kill; a good run's server log carries the same
fonts.googleapis.com errors, so those are not the difference. The cause is still not found.
