# repo: dreamos-pwa · base 0038eb41 · CE-47 · PTN-A2-4 app · the Forward page: the admin's first name and version A · handover

What it is: the app half of A2-4 (the chair's calls, 8 Oct 2026). On More > Partners > Forward a request, the admin
types a first name once, and each person's message is version A, the founder's words, with that name in it. The admin
can change the text before sending, and opens WhatsApp with the changed text. After forwarding, the page says in one
line whether TDW told the vendor on WhatsApp. One page changes: app/admin/partners/forward/page.tsx.

## The page
- A "You" group with the field "Your first name". The note under it: "TDW puts your first name in each message. This
  phone remembers it." The name is kept in this browser only (localStorage, key tdw_admin_first_name), because the admin
  session is one shared password and holds no name. A browser that blocks storage simply asks again.
- Forward refuses without a name, in the line "Write your first name before you make the messages. TDW puts it in each
  message.", and sends nothing. The name goes to the server as sender. The server makes version A (dream-os A2-4).
- After forwarding: one line [data-vendor-notice], the server's own words (for example "TDW told the vendor on WhatsApp
  that her request has gone to partners.").
- Each person's sheet: the line "You can change the message before you send it.", the text in a box the admin can
  edit, the CopyBox with the (changed) text and its one control, and "Open in WhatsApp", a wa.me link to the contact's
  own number with the changed text. It is drawn only for a contact with a phone who has not replied STOP. A contact who
  replied STOP keeps the message to copy (for Instagram or Threads) and gets no WhatsApp button.
- If the server made no message (no name reached it), the sheet shows the line that asks for the name, never a gap.

## Order with the server
Land with dream-os A2-4 in one train. Apart, this app FIRST is safe: the server at 5058d8c ignores sender and keeps
today's message, and the page shows no notice line. The server first is not (see the server handover).

## R-47.1: every line read, old and new side by side
No line a reader saw before is reworded. The page's new lines:

| File | Who reads it | New line |
|---|---|---|
| app/admin/partners/forward/page.tsx | admin | Write your first name before you make the messages. TDW puts it in each message. |
| app/admin/partners/forward/page.tsx | admin | TDW puts your first name in each message. This phone remembers it. |
| app/admin/partners/forward/page.tsx | admin | You can change the message before you send it. |

Labels, not sentences, kept short on purpose: the group title "You", the field "Your first name", the button "Open in
WhatsApp". The notice line under the list is the server's words (its table is in the server handover).

## The founder's lines (word for word; they change only on his yes)
| Where | The line as it stands |
|---|---|
| the hand message, made by the server (version A, approved 8 Oct 2026) | Hi {name}, this is {sender} from The Dream Wedding. One of our vendors, {vendor}, is looking for {needs} for a shoot on {date} in {city}, and I thought of you. The details are here, and you can suggest someone in a minute: {link} / Happy to answer anything here on WhatsApp too. |
| app/admin/partners/forward/page.tsx, the tick | Tick "She asked for this" first. |
| every other line in the A2-1 app part 1 table | unchanged |

The page never rewords version A. The admin may change it before sending, as the founder allowed; the default stays
word for word.

## Proofs in the seat's container (base 0038eb41), every run under TZ=UTC
- b291 (AMENDED BY LABEL, named here): its fixture now answers with version A; §6.2 and §6.4 read version A; new §11:
  11.1 no first name, nothing sent; 11.2 the name goes with the request and the phone remembers it; 11.3 the notice line;
  11.4 the changed text is in the CopyBox and in "Open in WhatsApp", to the contact's own number; 11.5 a contact who
  replied STOP has the message and no WhatsApp button. 65/0, light and dark.
- b291 --mutate: 6/0. New M3: "Open in WhatsApp" made to ignore STOP reddens §11.5; the page restored byte for byte.
  (b291's move onto scripts/lib/mutation_guard.js is listed for A2-1 app part 2.)
- b291 waits on the page, so it ran 20 times under load (two busy cores). The first series had one red in 20: run 7
  waited past 120 s for /partner/join while next dev compiled the route for the first time. b291 now waits on each route
  itself first (the server answers, bounded at 300 s), as b297 does; the second series was 20 of 20 green.
- tsc --noEmit clean. Radius, 0038eb41 against this tree, each alone: b297, b20_a4, b72, adm1_admin, b140_v2 --source.

## Walk card (after deploy; DEV440 / 9888294440 only)
Use only DEV440's vendor and a contact whose phone is 9888294440 (add one named "Test DEV440" under Contacts if
none exists). Choose no other contact, so no real person is written to.
1. More > Partners > Forward a request, for DEV440's vendor, to the "Test DEV440" contact only. Leave "Your first
   name" empty and press Forward: the page asks for the name.
2. Type your first name and forward. Open the person: the message begins "Hi Test DEV440, this is {your name} from The
   Dream Wedding." Change a word, press "Open in WhatsApp": WhatsApp opens to 9888294440 with the changed text.
3. Reload the page: your first name is still there.
