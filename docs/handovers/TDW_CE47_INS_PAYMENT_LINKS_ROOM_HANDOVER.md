# repo: dreamos-pwa · base 0038eb41 · TDW · CE-47 · INS · THE PAYMENT LINKS ROOM + R-47.1 PASS (Insurance room, hub Coming card) · HANDOVER

App train 8 (stacked FE-9, OFF-2, INS, PRO). The server is on main: PAY-A (29fe287), its two gaps (c6eec1d). Built to the
door: until Razorpay approves TDW as a technology partner (ticket 21269027) and the founder sets the four
RAZORPAY_PARTNER_* values, the room shows one line and "Coming soon".

## What it does
- v2/app/vendor/(shell)/payment-links/page.tsx replaces the hub cut's shell page; 'payment_links' leaves PREVIEW_KEYS
  (routes.ts); its own help card replaces the Coming card in place (pageHelp.ts); b222's LANDED gains 'payment_links'
  and its mutation M1 is re-anchored by label.
- Her own Razorpay account: Connect Razorpay (to Razorpay and back to THIS room with ?code=&state=, handed to the
  server once, the address cleaned); Disconnect.
- Her invoices with money owed (the existing list, GET /api/v2/vendor/money/invoices/:vendorId). A tap shows what is
  still owed (the server's own figure) and offers a link for the whole amount, or one per instalment of a package
  invoice. The link is shown with Copy and Send on WhatsApp.
- One switch: part payment on a link for the whole invoice (accept_partial only).
- Payments through links: paid; failed; refunded, with "Take it off the invoice" (her tap only, by Razorpay's refund
  id); received but not yet on a binder invoice; and the founder's question for a payment TDW could not place, with his
  two answers.
- Every list is read tolerantly: a thin answer draws an empty room, never a blank page (b228 2.2).
- v2/lib/solutions/paymentLinks.ts: the room's calls and every word, one home.

## WALK CARD (for WALK-1; simple words)
Use: the founder's test vendor (DEV440) on the new layout.
Switch on first: NOTHING, for steps 1 to 2. Steps 3 onwards need Razorpay's approval of ticket 21269027 and the four
Railway values (RAZORPAY_PARTNER_CLIENT_ID, _CLIENT_SECRET, _WEBHOOK_SECRET, _REDIRECT_URI, the last set to
https://<app>/vendor/payment-links). Until then, stop after step 2.
1. Open More, then Business Solutions. Under "Get paid", tap Payment links.
   See: the line "This room makes payment links for your invoices. Your client pays through the link, and the money goes
   straight to your own Razorpay account. TDW takes no fee." and, under it, "Payment links are not switched on yet. They
   will work here once Razorpay approves TDW as a technology partner." with a "Coming soon" tag.
   Failed if: the screen says "Launching soon." (the room did not land), or it is blank.
2. Tap the "?" at the top. See the room's own card (Connect Razorpay; tap an invoice; Copy or WhatsApp; refunds by your
   tap). Failed if it says the room is not open yet.
   --- after Razorpay's approval and the four values ---
3. Tap "Your Razorpay account is not connected yet." (Connect Razorpay). Razorpay's own screen opens. Log in and allow.
   See: you are back in Payment links with "Your Razorpay account is now connected." and then "Your Razorpay account
   acc_… is connected." Failed if: an error line, or the room still says not connected.
4. Under "Invoices with money owed", tap an invoice from a package. See: "Rs … is still owed on this invoice.", a
   button for the whole amount, and one button per instalment. Tap one instalment's button. See: "The link is ready.
   Copy it, or send it to your client on WhatsApp." with the link. Failed if: no link, or the amount is not that
   instalment's.
5. Open the link on another phone and pay a small instalment with a test card. Within a minute, back in the room, see
   under "Payments through links": "Rs … was paid through a link." In Money, that instalment shows paid. Failed if the
   payment does not appear, or appears twice.
6. Turn "Allow part payment on a link for the whole invoice" On, and back Off. See it read On, then Off.
7. (Optional, needs a refund in Razorpay) Refund that payment in Razorpay. See "Rs … was refunded to your client." with
   "Take it off the invoice". Tap it. See "The refund has been taken off the invoice." and the instalment owed again
   in Money. Failed if the invoice changed before the tap, or did not change after it.

## R-47.1: EVERY LINE A PERSON READS IN THIS PACKAGE, OLD BESIDE NEW
### The hub's Coming card (pageHelp.ts, one home each)
| old | new |
|---|---|
| Nothing connects here yet. It will when this room opens. | This room is not linked to the rest of your account yet. It will be linked when the room opens. |
| This room is not open yet. It reads Coming in Business Solutions until it opens. | This room is not open yet. Business Solutions shows it as Coming until it opens. |
### The Insurance room (insurance.ts, page.tsx)
| old | new | status |
|---|---|---|
| Kinds of cover that fit the business, quotes from insurers, and the policies kept here. | This room shows the kinds of insurance cover that fit your business. It helps you ask insurers for a quote, and it keeps your policies in one place. | THE FOUNDER'S LINE, approved 8 October 20:52 |
| Details confirmed by you. Not checked by TDW. | You confirmed these details. TDW has not checked them. | THE FOUNDER'S LINE, approved 8 October 20:52 |
| Buy a policy from the insurer you choose, here in TDW. TDW will take no fee. | Soon you will be able to buy a policy from the insurer you choose, here in TDW. TDW will take no fee. | THE FOUNDER'S LINE, approved 8 October 20:52 |
| Shown while a policy is in date. It comes off by itself when the last one ends. | The Insured mark shows on your website while a policy is in date. TDW takes it off when your last policy ends. | |
| Five questions, then the kinds of cover that fit, with examples | You answer five questions, and TDW shows the kinds of cover that fit, with examples. | |
| Pick an insurer; TDW puts together a cover enquiry to send them | You pick an insurer, and TDW writes a cover enquiry for you to send to them. | |
| Pick one. TDW puts together a cover enquiry from your answers, your calendar and your weddings on TDW, for you to send them. A to Z, with no ranking. | Please pick one insurer or comparison site from this list. TDW writes a cover enquiry from your answers, your calendar and your weddings on TDW, and you send it to them yourself. The list is in A to Z order and is not a ranking. | |
| These are kinds of cover, not policies. TDW does not recommend an insurer or a policy and takes no fee from any of them. | These are kinds of cover, not policies. TDW does not recommend any insurer or policy. TDW takes no fee from any insurer. | |
| Read from the document. Check each one before saving. | TDW read these details from the document. Please check each one before you save. | |
| A reminder comes on WhatsApp 30 days and 7 days before it ends. | TDW sends you a WhatsApp reminder 30 days and 7 days before the policy ends. | |
Unchanged, already plain: "Each one sets its own price and may charge its own fees. TDW takes nothing." and "Upload a PDF or a
photo." Labels (buttons, row titles, field labels, On/Off, "Coming soon") are not sentences and are unchanged.
### The Payment links room (new; every sentence written under R-47.1)
lede · "Payment links are not switched on yet. They will work here once Razorpay approves TDW as a technology partner." ·
"Your Razorpay account is not connected yet." · "Your Razorpay account <id> is connected." · "No invoice has money owed
right now." · "<Rs …> is still owed on this invoice." · "The link is ready. Copy it, or send it to your client on
WhatsApp." · "When this is on, your client can pay part of the amount through a link for the whole invoice. A link for
one instalment always asks for the full instalment." · "<Rs …> was paid through a link." · "A payment of <Rs …> did not
go through." · "<Rs …> was refunded to your client." · "The refund is not yet taken off the invoice." · "The refund has
been taken off the invoice." · "<Rs …> was received online. TDW is adding it to the invoice." · "TDW is finishing the
connection to your Razorpay account." · "Your Razorpay account is now connected." · "TDW could not finish that. Please
try again." The help card's steps: "Tap Connect Razorpay to link your own Razorpay account. The money from every link
goes straight to that account." · "Tap an invoice with money owed. You can then make a link for the whole amount or for
one instalment." · "Copy the link, or send it to your client on WhatsApp." · "Each payment through a link is marked on
the invoice by itself. A refund is taken off the invoice only when you tap it." · connects: "Payments through links
appear on the same invoices you see in Money."
THE FOUNDER'S LINES, approved 8 October, word for word: "Rs <amount> was received online. TDW could not tell if it is
already counted on this invoice." (sent by the server) · "It is already on the invoice" · "Add it to the invoice" ·
"This payment has already been settled." · "Try again."
Benches amended by label to the new words: b222 (1.11; LANDED; M1), b223 (1.4, 1.8, the fixture, 2.1, 2.3, 2.7).

## R-47.2
Neither the Payment links room nor the Insurance room shows any picture: none.

## PROOF (each alone; b140_v2 strictly alone)
b228 23/0 (four runs) · b223 rc 0 · b222 rc 0 · b122_v2 rc 0 · d1_help_v2 rc 0 · b184 rc 0 · b73 rc 0 · b140_v2
--routes=/vendor/payment-links,/vendor/insurance 37 pass, 2 fail, both 3.1 "the real faces did not load" (this
container's fonts; the founder's floor judges). Lesson 1's list rides beside the ZIP.
