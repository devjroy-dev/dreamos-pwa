// /vendor/studio — REDIRECT STUB · TDW_09 PACKAGE 2 (F-09.18 arm (a) + R-X8)
//
// THE HUB PAGE THAT STOOD HERE IS RETIRED. F-09.18's derivation: this door was
// LINK-ORPHANED (zero inbound edges at the IA census — the More sheet linked
// /vendor/team-hub directly, and the nav's "Studio" was a MODE whose activation
// navigated to the calendar), while its name collided with that mode.
// Recognition-over-recall failed twice on one word. The ruled cure, arm (a):
// retire the door; the More sheet already reaches every leaf.
//
// WHERE ITS ROWS WENT (control inventory, this sitting):
//   · the five list rows (Clients/Leads/Invoices/Events/Expenses) — the
//     Business door (/vendor/list) has always owned them; the rows here were a
//     second front on one machinery.
//   · Notes to Self — MOVED to /vendor/more per R-X8, its ruled seat, bytes
//     carried verbatim.
//   · the Team Hub section — /vendor/team-hub is its own route (TDW_04.5 P4
//     F11(c)) and the More sheet's own row already points there.
//
// THE LEAVES STAND: /vendor/studio/notes, /vendor/studio/team,
// /vendor/studio/tasks, /vendor/studio/team-payments are UNTOUCHED — this stub
// replaces only the hub page.tsx. Anyone landing on the retired hub (an old
// deep link, a bookmark) is carried to Team Hub — the destination whose rows
// made this page redundant. Deep-link law: the path answers, never 404s.

import { redirect } from 'next/navigation';

export default function StudioRedirect() {
  redirect('/vendor/team-hub');
}
