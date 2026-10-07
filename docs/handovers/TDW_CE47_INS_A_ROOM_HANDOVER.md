# repo: dreamos-pwa · base a32fbf4e2c23 + PRO_P1_APP (layered) · TDW · CE-47 · INS · INS-A · THE INSURANCE ROOM · HANDOVER

The room "Insurance" (Business Solutions › Run the business), app train 3, last on the three shared files (OFF, then PRO,
then INS). Server: dream-os INS-A r3, landed 44c68c6 (0200 run live). Rung **b223**; b222 and b122_v2 amended by label.

## Layer order (app train 3: PRO, then INS; OFF later)
This package is cut ON PRO's bytes. It carries four shared files, each written over PRO's version, whose shas are this
layer's BASE (the train checks them before applying):
  v2/lib/solutions/routes.ts                  base d4906953c18eb99fe2ba2dfec8be45c33c850688fd07a332d352dda3a27c549b
  v2/lib/worklist/pageHelp.ts                 base 0a8b802663540e111f2cee39269f70144498175f8f125f4668c45a211d27fe33
  scripts/b222_ce47_hub_cut_bench.js          base 19af4e04e094bf8ea9f38f81052d27ef081c127b3a362de3ab4a36f54420500b
  scripts/b122_ce45_home_shelves_bench_v2.js  base d3619bbf917246f39c124bb637a7ff9db8808fee533acdab7d8d29caeea646a7 (carried byte-equal)
INS's lines in them: routes.ts, 'insurance' out of PREVIEW_KEYS; pageHelp.ts, the Insurance card in place of the shell
card; b222, LANDED gains 'insurance' after PRO's two; b122_v2 untouched. PRO's other paths are PRO's; not carried here.

## What it does
Replaces the hub cut's shell page at /vendor/insurance, and `insurance` leaves PREVIEW_KEYS in the same edit (b222's
LANDED list gains 'insurance'; b122_v2 2.7 reads that one list). Home: her policies with their states, "Details confirmed
by you. Not checked by TDW." once under them, the Insured switch, Find cover. What cover do I need: five questions, then
the kinds of cover the server returns. Get a quote: the fourteen, A to Z, each labelled Insurer or Comparison site, the
fee note, and the statement row "Buy a policy from the insurer you choose, here in TDW. TDW will take no fee." under
Coming soon (not a control). Tapping one: that insurer's own fee line, her cover brief in a CopyBox, Send on WhatsApp,
Open <insurer>'s website. Add a policy: upload to her own signed address, the server reads it, every field pre-filled for
her to check, Save. One policy: Open document, Replace, Delete.

## WALK CARD (for WALK-1; simple words)
Use: the founder's own test vendor on the new layout (any vendor; nothing here is trade-gated).
Switch on first: migration 0200 is live (yes, run with server train 2); the PRIVATE storage bucket "policies" exists in
Supabase (create it if not: Storage, New bucket, name policies, Public OFF). Without the bucket, step 6 fails at upload.
1. Open More, then Business Solutions. Under "Run the business", tap Insurance.
   See: the title Insurance, the line "Kinds of cover that fit the business, quotes from insurers, and the policies kept
   here.", "On the website" with "Show Insured on my website" reading Off, and "Find cover" with two rows.
   Failed if: the screen says "Launching soon." (the room did not land), or it stays blank.
2. Tap "What cover do I need". Type your work (for example Makeup), a kit value, events a year, tap Yes or No twice, tap
   "Show kinds of cover". See: a list of kinds of cover, each with a short wedding example, and the line "These are kinds
   of cover, not policies. TDW does not recommend an insurer or a policy and takes no fee from any of them."
   Failed if: any insurer or price is named in that list.
3. Tap "Get a quote". See: fourteen names, A to Z (Acko first, United India last), each marked Insurer or Comparison site
   (Policybazaar and InsuranceDekho are Comparison site); under them "Each one sets its own price and may charge its own
   fees. TDW takes nothing."; and a last row "Buy a policy from the insurer you choose, here in TDW. TDW will take no
   fee." with a "Coming soon" tag. Tap that last row: nothing happens. Failed if it opens anything.
4. Tap Digit. See: "This opens Digit's own website. Digit sets its own price and may charge its own fees. TDW takes
   nothing.", then a cover enquiry naming your studio, your weddings counted by The Dream Wedding and your booked days,
   with Copy, Send on WhatsApp and Open Digit's website. Tap Copy and paste it into a note: the full enquiry is there.
   Failed if: the enquiry names a client, or numbers you did not give and TDW does not hold.
5. Close it. Back on the room's first screen tap "Show Insured on my website". See: it reads On. Open your public
   storefront: no Insured mark yet, because no policy is saved. Failed if: a mark shows with no policy.
6. Tap "+ Add a policy", tap "Upload the policy (PDF or photo)", pick a real policy PDF. See: the button reads "Document
   added", the line "Read from the document. Check each one before saving.", and the insurer, kind, amount and end date
   filled in where the document is clear (blank where it is not). Correct anything, tap "Save policy".
   Failed if: Save is refused for a correct policy, or a field you changed comes back different.
7. See: the policy under "Policies" with "In date" (or "Renew soon" if it ends within 30 days), and "Details confirmed by
   you. Not checked by TDW." under the list. Open your public storefront: the Insured mark shows; tap it to read "Policy
   uploaded by <your studio name>, valid until <date>. Details confirmed by <your studio name>; TDW has not verified the
   policy." (The storefront and website slot for the mark is a later INS-A cut on WEB-8's styles; if it is not yet landed,
   skip this check.)
8. Tap the policy. See: its facts, "Not checked by TDW", Open document (opens your PDF), Replace, Delete policy. Tap
   Delete policy. See: it leaves the list; the public mark goes. Failed if the mark stays after the last policy is gone.
