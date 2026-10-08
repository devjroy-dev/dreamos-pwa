# repo: dreamos-pwa · base 19631372 (app train 6's tip) · CE-47 · PTN-A2-1 app part 1 · THE CALL PAGE · handover

What it is: the page a partner opens from a collab call's email or WhatsApp message, at
thedreamwedding.in/partner/call/<token>. Until this lands, that link opens a missing page (Parts D and E of the
collabs@ guide wait on it, and so does the button of the filed template tdw_partner_call). It comes alone, first, as
ruled (the chair, 8 Oct 2026), and it carries R-47.1 for PTN's app rooms with no separate cut.

## The page (app/partner/call/[token]/page.tsx, new)
- No sign-in. The token in the link is the key. It reads A2-1's public doors on dream-os (on main since 2d349dc):
  GET /api/v2/public/partner/call/:token, POST .../suggest, POST .../stop and .../pause.
- The partner reads the call in whole sentences: who needs what, the vendor's trade, where and when, the pay, the
  vendor's note (the server masks any phone or email in it), and the vendor's Instagram as a link (new tab).
- The partner suggests up to 5 people: a name, a role when the call has more than one, and an optional profile link.
  The tick "These people have agreed to be suggested for this call" goes with them. The server's answer is shown as the
  server wrote it, and the list of people already suggested is read again.
- STOP AND PAUSE NEVER ACT ON OPENING. The call email's own links (?do=stop, ?do=pause) open this page with the
  matching button and a line that asks for a press. Mail scanners open links by themselves, so a scanner's visit must
  change nothing. b297 §4.1 proves no request leaves on opening; one press sends one request.
- A closed call shows the closed line and no form; pause and stop stay.
- A dead, spent or wrong link, and a thin answer ({ ok: true } and nothing else), show one plain line. The page never
  throws and never shows an error page.
- No phone and no email of anyone appears: the server sends none, and b297 §1.3 reads the whole page for them.
- Every handle and website is a link (b297 §1.4). The profile-link hint names no example address for that reason.
- lib/partner/api.ts gains three calls (call, suggest, stopOrPause) and the CallShape type. lib/partner/words.ts gains
  CALL, the page's words.

## Paths, compared on the base
Every path this package changes is byte for byte the same on 19631372 as on ace030f8 (A1 app r4's landing): no other
seat touched them in between (git log ace030f8..19631372 is empty for each). app/partner/call/ does not exist on main.

## THE SERVER'S WORDS ON THIS PAGE
The refusals and confirmations the call page shows come from dream-os (answers.js, partnerPublic.js). Their R-47.1
rewrite rides A2-3's server package (r3's table, re-checked on dae04b0). Until it lands, the page shows today's server
lines, for example "Tick "These people have agreed to be suggested for this call" first."; b297's fixture already
answers with the rewritten server lines.

## R-47.1: every line read, old and new side by side (PTN's app rooms)
Who reads it: partner, vendor, admin or visitor. {..} stands for a filled-in value.

| File | Who reads it | Old line | New line |
|---|---|---|---|
| lib/partner/words.ts | partner | Agencies, fashion houses, brands, wedding planners and studios can get collab calls and post work for wedding vendors. Signing up is free. Your first 3 connections are free. After that it is Rs 2,999 a month. | Agencies, fashion houses, brands, wedding planners and studios can get collab calls and post work for wedding vendors. Signing up is free. Your first 3 connections are free. After that, the partner plan costs Rs 2,999 a month. |
| lib/partner/words.ts | partner | For a freelance stylist, model or photographer. You will join Collab Hub. | This choice is for a freelance stylist, model or photographer. You will join Collab Hub. |
| lib/partner/words.ts | partner | Next: your phone number, your name and a code sent on WhatsApp. Then your organisation and its Instagram handle. | Next, you give your phone number and your name, and TDW sends you a code on WhatsApp. After that, you add your organisation and its Instagram handle. |
| lib/partner/words.ts | partner | Already a partner? | Are you already a partner? |
| lib/partner/words.ts | partner | With the country code, for example +91 98111 00021 | Write the number with the country code, for example +91 98111 00021. |
| lib/partner/words.ts | partner | This shows on your partner page. | What you write here shows on your partner page. |
| lib/partner/words.ts | partner | The handle only, for example modelconnect.in | Write the handle only, for example modelconnect.in. |
| lib/partner/words.ts | partner | For example https://modelconnect.in | Write the full address, for example https://modelconnect.in. |
| lib/partner/words.ts | partner | Calls start soon. When a vendor posts a collab call that fits your cities and people, it shows here and in your email. | TDW emails you each collab call that fits your cities and your people. This tab will list your calls soon. |
| lib/partner/words.ts | partner | Briefs start soon. You will post a brief here, see who applies and pick who to work with. | Briefs are not open yet. When they open, you will post a brief here and choose who to work with. |
| lib/partner/words.ts | partner | Requirements start soon. You will post paid work here, see who applies and pick who to work with. | Requirements are not open yet. When they open, you will post paid work here and choose who to work with. |
| lib/partner/words.ts | partner | Calls come to you, not to your people. For each person you suggest, TDW keeps only their name, role and profile link. TDW never contacts them. | TDW sends calls to your organisation, not to your people. For each person you suggest, TDW keeps only their name, role and profile link. TDW never contacts them. |
| lib/partner/words.ts | partner | They sign in with their own phone and a WhatsApp code. TDW sends them nothing until they sign in. | Each person signs in with their own phone number and a code sent on WhatsApp. TDW sends them nothing until they sign in. |
| lib/partner/words.ts | partner | Only the owner can add people. | Only the owner of this partner account can add people. |
| lib/partner/words.ts | partner | Saved. | Your changes are saved. |
| lib/partner/words.ts | partner | Something went wrong. Please try again. | TDW could not finish this just now. Please try again. |
| lib/partner/words.ts | partner | A request sent to you by The Dream Wedding | The Dream Wedding sent you this request. |
| lib/partner/words.ts | partner | To answer, sign up. Your answer goes to the vendor inside The Dream Wedding. | To answer this request, sign up first. TDW then shows your answer to the vendor. |
| lib/partner/words.ts | partner | An agency, fashion house, brand, wedding planner or studio. Signing up is free. Your first 3 connections are free. | This choice is for an agency, fashion house, brand, wedding planner or studio. Signing up is free. Your first 3 connections are free. |
| lib/partner/words.ts | partner | For a freelance stylist, model or photographer. You will join Collab Hub. It is free. | This choice is for a freelance stylist, model or photographer. You will join Collab Hub, which is free. |
| lib/partner/words.ts | partner | This request has ended. Its date has passed. | This request is closed, because its date has passed. |
| lib/partner/api.ts | partner | Something went wrong. Please try again. | TDW could not finish this just now. Please try again. |
| lib/partner/api.ts | partner | Something went wrong. Please try again. (when the phone has no connection) | TDW could not reach the internet just now. Please try again. |
| app/partner/page.tsx | partner | No name yet | No name given |
| app/admin/partners/page.tsx | admin | Could not read partners. | TDW could not read the partners. Please try again. |
| app/admin/partners/page.tsx | admin | Could not open. | TDW could not open this partner. Please try again. |
| app/admin/partners/page.tsx | admin | That did not work. Try again. | TDW could not finish this just now. Please try again. |
| app/admin/partners/page.tsx | admin | No partners here. | No partner is on this list yet. |
| app/admin/partners/page.tsx | admin | Proved by Instagram login: not yet (waiting for Meta). Blue tick: not read yet. | TDW cannot check an Instagram login yet, because Meta has not approved it. TDW does not read the blue tick yet. |
| app/admin/partners/page.tsx | admin | No name yet | No name given |
| app/admin/partners/page.tsx | admin | Calls go to {email}. | TDW sends calls to {email}. |
| app/admin/partners/page.tsx | admin | Report: {reason}. {note} | A vendor reported this partner for this reason: {reason}. The vendor wrote: {note} |
| app/admin/partners/page.tsx | admin | Blocked: {reason} | TDW blocked this partner for this reason: {reason} |
| app/admin/partners/page.tsx | admin | Block {p.name}? Its page and everything it posted disappear at once. | Do you want to block {p.name}? Its page and everything it posted will disappear at once. |
| app/admin/partners/contacts/page.tsx | admin | Could not read contacts. | TDW could not read the contacts. Please try again. |
| app/admin/partners/contacts/page.tsx | admin | Could not save. | TDW could not save this. Please try again. |
| app/admin/partners/contacts/page.tsx | admin | No contacts yet. | TDW has no contacts yet. |
| app/admin/partners/contacts/page.tsx | admin | Stopped means they replied STOP. TDW never sends them WhatsApp again, and no one at TDW is one tap from messaging them. | A contact marked Stopped replied STOP. TDW never sends that contact a WhatsApp message again. This page shows no WhatsApp or Call button for that contact. |
| app/admin/partners/contacts/page.tsx | admin | The handle only, for example houseofvyas | Write the handle only, for example houseofvyas. |
| app/admin/partners/contacts/page.tsx | admin | For example https://houseofvyas.com | Write the full address, for example https://houseofvyas.com. |
| app/admin/partners/contacts/page.tsx | admin | With the country code, for example +91 98111 00031 | Write the number with the country code, for example +91 98111 00031. |
| app/admin/partners/contacts/page.tsx | admin | Required. | You must fill in this field. |
| app/admin/partners/contacts/page.tsx | admin | They know TDW (WhatsApp may be used) | This contact knows TDW, so TDW may write to them on WhatsApp. |
| app/admin/partners/forward/page.tsx | admin | Could not save the request. | TDW could not save the request. Please try again. |
| app/admin/partners/forward/page.tsx | admin | Could not save. | TDW could not save this. Please try again. |
| app/admin/partners/forward/page.tsx | admin | Or, for a vendor not on TDW, her Instagram handle and her phone below. | If the vendor is not on TDW, write her Instagram handle and her phone number below instead. |
| app/admin/partners/forward/page.tsx | admin | For example a model | For example, write: a model. |
| app/admin/partners/forward/page.tsx | admin | Sent · Not sent yet. Tap to open. | This message is sent. · This message is not sent yet. Tap to open it. |
| app/admin/partners/forward/page.tsx | admin | Send it yourself from TDW's accounts | Send this message yourself from TDW's accounts. |
| app/admin/partners/forward/page.tsx | admin | This contact has no Instagram handle. Add it in Contacts to send from Instagram or Threads. | This contact has no Instagram handle. To send from Instagram or Threads, add the handle in Contacts. |

New lines on the call page (no old line; each is a whole sentence with one idea):
- A collab call sent to you by The Dream Wedding (the page's small heading)
- {vendor} needs {needs}.
- {vendor} is a {trade} on The Dream Wedding.
- The shoot is in {city} on {date}.
- The vendor offers this pay: {pay}.
- The vendor wrote this note:
- You can see the vendor's Instagram here: {link}
- This call is no longer open, because the vendor closed it or its date has passed.
- You have already suggested these people for this call:
- You can suggest up to {max} people. For each person, write their name and, if you have one, a link to their profile.
- You can paste a link to their Instagram profile or their website.
- If the vendor chooses someone, the vendor contacts {partner}, not the person.
- TDW keeps only each person's name, role and profile link. TDW never contacts the people you suggest.
- Getting too many calls? (a heading)
- You can pause calls for one week, or stop them. To get calls again later, sign in and turn them on in Settings.
- You opened the link to pause calls. Press the button below to pause them for one week.
- You opened the link to stop calls. Press the button below to stop them.
- This link does not work. Ask The Dream Wedding for a new one.

Labels on buttons and fields (not sentences, and no sentence is needed there): Suggest someone · Name · Role · Profile link (optional) · Add another person · Remove · Send suggestions · Sending · Pause calls for one week · Stop all calls.

Lines read and KEPT because they already pass: the page heads and labels ("Phone number", "Your name", "Cities",
"Sign in", "Launching soon", "Contacts", "Partners", "Forward a request", "Send each one yourself", the report reasons
and tags such as "Hidden after 3 reports"); "Collab Hub for freelance stylists, models and photographers opens soon.";
"Send a vendor's request to people TDW knows. You send each message yourself."; "{name} is a partner on The Dream
Wedding."; "This page does not exist."; "Write your name."; the city names.

## The founder's lines (kept word for word; they change only on his yes)
| Where | Which | The line as it stands |
|---|---|---|
| lib/partner/words.ts | FEE_LINE | This partner may charge its own fees. TDW takes no fee and has no part in it. |
| lib/partner/words.ts | markMeans | Verified means TDW has seen that the organisation is real: its own website or Instagram, and a call with a named person there. |
| lib/partner/words.ts | markNot | It does not mean TDW vouches for its work, its fees or its people. |
| the mark | check_words | "Verified" / "Unverified" |
| lib/partner/words.ts | whoTitle | Who is signing up? |
| lib/partner/words.ts | meChoice | Just me |
| lib/partner/words.ts | workedWith / report / callsTab | "Worked with" · "Report" · "Calls for you" |
| app/admin/partners/forward/page.tsx | the tick | Tick "She asked for this" first. |
| lib/partner/words.ts | partnerWith | Partner with The Dream Wedding |
| app/admin/partners/page.tsx | the admin tabs and button | "Unverified" · "Verified" · "Mark as verified" |

The Forward page's hand message (version A, the founder's, 8 Oct 2026) is not in this package: it waits on the chair's
yes on {sender}, and it lands with A2-1 app part 2.

## Proofs in the seat's container (base 19631372)
- b297 (new): 32/0. §1 the call in whole sentences; the Instagram link; no phone or email; no plain handle or site.
  §2 suggesting (refusal shown as written; people, role and link sent; the line shown; the list read again). §3 one
  role asks none, two roles ask in words. §4 ?do=pause and ?do=stop send nothing on opening, and one press sends one.
  §5 a closed call. §6 a dead link and a thin answer. Light and dark, 374 x 812.
- b297 --mutate: 6/0, through scripts/lib/mutation_guard.js (kept copy and marker first; restored by sha; no
  marker left). M1 the buttons made to act on opening reddens §4.1; M2 the thin-answer guard dropped reddens §6.2; M3
  the Instagram drawn as plain text reddens §1.2. The series refuses (exit 3) under 512 MB free.
- b297 under TZ=UTC: 32/0.
- b291 (amended by label for the rewritten lines, including the cell that opens a Forward sheet by its row line): 55/0;
  --mutate 4/0.
- b297 has waits on the page and the network (§4.1), so it ran 20 times under load (two busy cores): 20 of 20 green.
  The first series showed one red in 20: run 8 waited past 120 s for the page while next dev compiled the route for the
  first time. The bench now waits on the route itself first (the server answers 200, bounded at 300 s) before any browser
  wait; the second series of 20 was all green.
- Radius, 19631372 against this tree, each alone: b291 55/0, b20_a4 76/76, b72 29/29, adm1_admin 63/0, b140_v2 --source
  green: identical exits and counts on both sides.

## Walk card (after deploy)
1. Open thedreamwedding.in/partner/call/<a token from a real call email>. The call reads in whole sentences.
2. Add a name, tick the box, press "Send suggestions". The line says the vendor can now see them.
3. Open the email's "pause" link. The page asks for a press; nothing changes until it is pressed.
