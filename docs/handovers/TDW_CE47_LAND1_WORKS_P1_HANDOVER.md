# TDW · CE-47 · LAND-1 · tdw.works package 1: More, two pictures, eight slides · handover

Base: dreamos-pwa d733f8a (app train 9). One commit, not pushed. Every change is inside the tdw.works files
(app/works/*, lib/works/*) plus its bench (scripts/b303) and this note. app/layout.tsx, middleware.ts and next.config.ts
are untouched.

## What changes

1. More (app/works/page.tsx, works.css, WorksMotion.tsx)
   - About, Privacy and Terms leave the top bar. One "More" sits beside Sign in, the same solid pill as Sign in.
   - More opens a small menu of About, Privacy and Terms, in 17 px text on the page's own solid ground.
   - The menu closes on Esc (focus back to More), on a tap outside, or on a choice. About opens the About sheet as before.
   - Sign in is unchanged. The same on phone and laptop.
2. The two storefront pictures (lib/works/scenes.ts LOOK_PHOTOS, the one place they are named), in the chair's order:
   ig-5a637b957f1d.jpg, then ig-eca46f60edfc.jpg. They fill her website's two look tiles and Discover's two tiles, through
   next/image as before.
3. Eight slides, live in the app, drawn with the app's own words. The shuffle now holds 26.
   - Leads: "Enquiries · 4 open" (copy.ts headline); each enquiry shows where it came from (Instagram, WhatsApp,
     Website) and what was asked.
   - Clients: "Booked · 3 clients"; events, Booked, Still owed.
   - Book by chat (Ask TDW): her line "Book 14 December for Tara and raise the invoice"; the app's answer "Booked. The
     client, the event and the invoice are ready."; then "Date blocked" for 14 December and invoice INV-0143 Raised.
   - The assistant drafts, she approves:
     - her request, word for word as relayed;
     - the draft, marked "Draft · not sent";
     - the vendor lane's approval line "Send this to Tara? Reply YES or NO." with YES and NO;
     - only then "Sent to Tara · 6:14 pm".
   - Contracts: the room line "Agreements signed on WhatsApp; the date held on deposit"; the states Signed,
     "Sent · not signed yet", Draft and "Deposit received".
   - Team and crew: "Crew, and who works which shoot"; three dates, who is on each.
   - Instagram messages: the room's line "On. People who message your Instagram get a reply in your studio's name.";
     a client's question answered as "Ilavari Studio".
   - The website being made (startCopy.ts): "Building your business", "TDW builds your website from your photos.",
     Connect Instagram or Add my own photos; Your photos Ready, Your website Building, the rest Setting up; "Nothing is
     published until you say yes."
4. The landing slide is drawn at random from leads, clients, book by chat, the draft and contracts (FIRST_POOL,
   pickFirst). Everything after it is fully random as before: no repeat until all 26 have shown, never the same slide
   twice in a row. Waiting on the founder's confirmation.
5. Small things found on the way, in lib/works only:
   - The calendar scene's weekdays were wrong for 2026: 12 October is a Monday and 14 October a Wednesday. Its grid now
     starts on Monday 12, and its tag reads "Mon 12 Oct".
   - The masterclass is "Sunday 1 November" (2 November 2026 is a Monday). 14 December 2026 is a Monday.
   - On the eight new slides, the floating tag sits above the screen's top edge, because it covered her typed line, a crew
     date and the two ways to start. On a phone it is hidden for those eight, because it sat on the caption, which says
     the same thing.

## Proofs (this container)

- tsc --noEmit: exit 0. next build (inside b303): exit 0.
- b303 with a browser, on a production build: 108 pass, 0 fail, 1 skip (photo weights; Cloudinary is unreachable here).
  New cells:
  - 26 scenes, and each new scene's own words;
  - the order rule over 2,000 bags of 26, and 52 live changes in two full bags;
  - the landing slide in the five (1,000 draws in node; 12 visits on the page, and it varies);
  - the two new addresses, in one place;
  - More at 360 and 1440, light and dark: no loose links, More and Sign in in the bar, the menu solid, 16 px or more,
    inside the screen, closing on Esc, outside and a choice;
  - no floating tag on the caption.
  - The earlier run on this package measured the first full view at 4G 0.65 s and slow 4G 1.68 s.
- tdw09_money: 18 pass, 0 fail. Every new amount is "Rs ...".

## For the chair

| # | What | Recommendation |
|---|------|----------------|
| 1 | The app has no Edit button in the approval. She answers YES or NO, and the approval line names the client's number in brackets: "Send this to Tara (+91 …)? Reply YES or NO." The slide leaves the number out so no real person's number is shown. | Keep. If the founder wants "edit" shown, it needs the app's own words for it first. |
| 2 | The two new pictures sit in a real vendor's portfolio folder (vendor_portfolio/a8c52506…) and appear under the invented studio name Ilavari. | Confirm that vendor agreed to her pictures being shown on TDW's own page. |
| 3 | The landing pool of five. | The founder's yes. |
