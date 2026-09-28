// docs/review/tools/build-html.mjs · writes the clickable mock-ups in docs/review/html/ from one template.
import fs from 'fs';
import path from 'path';
import { OUT } from './harness.mjs';
const PAGES = [
  { file: 'leads-flow.html', title: 'Enquiry to booked client', start: 'today',
    lede: 'From Home: read the new enquiry, reply, then book it with a package. Today this takes 7 taps and three stacked sheets; proposed, 4 taps, and booking also makes the invoice and the calendar days.',
    steps: [['today', 'Home shows the enquiry and its last message. Tap it.'], ['lead', 'The enquiry: the free date and the conversation come first. Tap Reply, or Book.'], ['book', 'One sheet: pick the package; fee, dates and advance are filled in. Tap Book and make invoice.'], ['client', 'The client page: money, functions with crew, the invoice.']] },
  { file: 'date-flow.html', title: 'Is a date free?', start: 'today',
    lede: 'Today: 8 taps across Home, Rooms, Calendar and a day sheet that never says the word free. Proposed: 2 taps and a plain answer.',
    steps: [['today', 'Tap Check a date on Home.'], ['date', 'Pick the date. The answer says Free or Booked, and who asked for it.'], ['calendar', 'Open in calendar: booked, enquiry and blocked days drawn plainly; tap the month to jump.']] },
  { file: 'crew-flow.html', title: "Today's and this week's events, with crew", start: 'today',
    lede: 'Today: Home lists the events with no crew; the crew is 4 taps away per event, inside the Calendar. Proposed: the crew is on the Home cards, the week is one tap, the event page one more.',
    steps: [['today', 'Home: each event shows its crew, confirmed or not yet replied. Tap This week.'], ['week', 'This week: every function by day, with its crew or a clear No crew yet. Tap an event.'], ['event', 'The event: where, when, the client, the crew, Message crew.']] },
  { file: 'money-flow.html', title: 'Send an invoice, see who owes', start: 'money',
    lede: 'Today: 2 taps to the Invoices room and 8 to send one, with the client typed by hand. Proposed: Money is a tab; send from the client in 3 taps.',
    steps: [['money', 'Money: what is owed, by whom, by due date. Tap a client.'], ['client', 'The client: paid and due in one line. Tap Send reminder.'], ['invoice', 'The invoice and a ready message. Tap Send on WhatsApp.']] },
  { file: 'palettes.html', title: 'Palettes and type', start: 'today', palettes: true,
    lede: 'The three proposed palettes, each dark and light, on the proposed screens. Every button in the phone works. Contrast of every pair: palettes/CONTRAST.md.',
    steps: [['today', 'Today'], ['leads lead book', 'Enquiries'], ['client clients invoice', 'A client']] },
];
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
function page(p) {
  const sw = p.palettes ? `
      <h2>Palette</h2>
      <div class="seg"><button data-set="palette=ledger">Teal Ledger</button><button data-set="palette=slate">Slate and Teal</button><button data-set="palette=indigo">Indigo and Marigold</button></div>
      <h2>Type</h2>
      <div class="seg"><button data-set="type=inter">A: Inter</button><button data-set="type=plex">B: Plex, serif name</button><button data-set="type=today">Today: DM Sans</button></div>` : '';
  const steps = p.steps.map(([id, t], i) => p.palettes ? `<li data-step="${id}"><button data-jump="${id.split(' ')[0]}">${esc(t)}</button></li>` : `<li data-step="${id}"><span>${i + 1}</span>${esc(t)}</li>`).join('\n        ');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(p.title)} · TDW mock-up</title>
<!-- A mock-up for the UX review (docs/review/REPORT.md). Drawn with the app's own shell CSS and fonts, copied in. -->
<link rel="stylesheet" href="fonts/fonts.css">
<link rel="stylesheet" href="shell/shell.css">
<link rel="stylesheet" href="page.css">
</head>
<body>
<div class="layout">
  <aside class="panel">
    <p class="kicker">TDW vendor app · proposal</p>
    <h1>${esc(p.title)}</h1>
    <p class="lede">${esc(p.lede)}</p>
    <h2>${p.palettes ? 'Screens' : 'The steps'}</h2>
    <ol class="steps">
        ${steps}
    </ol>${sw}
    <h2>Theme</h2>
    <div class="seg"><button data-set="mode=dark">Dark</button><button data-set="mode=light">Light</button></div>
    <p class="row"><button class="restart" data-restart>Start again</button> <a href="index.html">All mock-ups</a></p>
  </aside>
  <div class="frame"><div id="phone"></div></div>
</div>
<script>window.TDW_MOCK = ${JSON.stringify({ start: p.start })};</script>
<script src="tokens.js"></script>
<script src="shell/chrome.js"></script>
<script src="screens.js"></script>
<script src="mock.js"></script>
</body>
</html>
`;
}
for (const p of PAGES) fs.writeFileSync(path.join(OUT, 'html', p.file), page(p));
fs.writeFileSync(path.join(OUT, 'html/index.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>TDW mock-ups</title><link rel="stylesheet" href="fonts/fonts.css"><link rel="stylesheet" href="page.css"></head>
<body><main class="index"><p class="kicker">TDW vendor app · UX review</p><h1>Clickable mock-ups</h1>
<p class="lede">Open any page on a phone or a computer. No build step and no server. Mock-ups only; they do not touch the app.</p>
<ul>${PAGES.map((p) => `<li><a href="${p.file}">${esc(p.title)}</a><span>${esc(p.lede)}</span></li>`).join('')}</ul></main></body></html>
`);
console.log('wrote', PAGES.length + 1, 'pages');
