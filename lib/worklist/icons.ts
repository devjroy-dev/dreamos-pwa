// lib/worklist/icons.ts -- CE-45 FE-1 HOME_2 · THE ROOM ICONS, ONE HOME (R-45.21; the chair's (b)(i)).
//
// THE FOUNDER'S WORD (24 Sept 2026, on the mock he approved): "this is truly awesome ... I want this
// implemented". The chair ruled it covers the mock AS IT OPENS: every icon as drawn (R-45.21).
//
// WHERE EVERY STRING BELOW COMES FROM. Each value is the inner markup of one <symbol> in the approved
// mock TDW_CE45_FE1_MOCK_PINS_TOP_AND_ICONS.html (sha256 a0f8de82298867fef84daf370f4ec9f06f57baec48573735fc0db92d9e81ac63),
// copied BYTE FOR BYTE by script, never retyped. b122 carries the 29 sha256s and fails on any drift.
// Stroke-only line drawings on a 24 x 24 box; the colour is NEVER set here: RoomIcon draws them in
// currentColor, and each reader chooses an existing token (ink-dim, role-metal, accent-text).
//
// PROVENANCE. The drawings are the seat's own, except `collabs` (the handshake), which follows the
// shape of Lucide's `handshake` icon, used under the ISC licence (Copyright (c) Lucide Contributors;
// permission to use, copy, modify and distribute with or without fee is granted, provided the
// copyright notice and this permission notice appear in all copies).
//
// KEYS. The 18 registry rooms that sit at the top or on a shelf (ROOMS ids) and the 11 Business
// Solutions rows (RoomKey). `contracts` is ONE key for the room and its row: one route, one drawing.
// The Record is total over IconKey, so a missing or extra key fails tsc.
//
// THE ONLY READER THAT DRAWS THESE IS components/worklist/RoomIcon.tsx. These are constants of our own
// module with no input path, which is why the chair ruled them drawable as markup (b122 pins that no
// icon string reaches the page from anywhere but this table).
import type { RoomKey } from '@/lib/solutions/copy';

export type ShelfRoomIconKey =
  | 'support' | 'storefront' | 'leads' | 'clients' | 'packages' | 'calendar' | 'events' | 'notes'
  | 'invoices' | 'expenses' | 'books' | 'tds' | 'portfolio' | 'team' | 'couture' | 'advisor'
  | 'billing' | 'settings';
export type IconKey = ShelfRoomIconKey | RoomKey;

export const ROOM_ICONS: Readonly<Record<IconKey, string>> = {
  support:       '<rect x="2.5" y="7" width="19" height="13.5" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M2.5 13h19"/>', // sha256 95e1197a1f2dca1f
  storefront:    '<path d="M3 9l1.6-5h14.8L21 9"/><path d="M3 9h18"/><path d="M4.5 9v11h15V9"/><path d="M9.5 20v-6h5v6"/>', // sha256 e5ea1b923a5558b9
  leads:         '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>', // sha256 059e2c68b6403cdc
  clients:       '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', // sha256 1bda18d47fb8fa44
  packages:      '<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>', // sha256 bf2e84808cbba705
  calendar:      '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>', // sha256 b38e3c9c52383b6c
  events:        '<path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z"/><path d="M18.5 15l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8z"/>', // sha256 dd934037f2a933ad
  notes:         '<path d="M15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9z"/><path d="M15 3v6h6"/><path d="M7 13h6M7 17h8"/>', // sha256 abe2523d3b769abc
  invoices:      '<path d="M5 3v18l2.5-1.5L10 21l2-1.5 2 1.5 2.5-1.5L19 21V3l-2.5 1.5L14 3l-2 1.5L10 3 7.5 4.5z"/><path d="M9 9h6M9 13h6"/>', // sha256 fe874e16e1972338
  expenses:      '<path d="M19 7V4.5A1.5 1.5 0 0 0 17.5 3H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5"/><circle cx="16.5" cy="14" r="1.2"/>', // sha256 f842630509e70f78
  books:         '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>', // sha256 1e23399f4e6de079
  tds:           '<path d="M19 5L5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>', // sha256 a7bfcf0c4bca8ceb
  portfolio:     '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>', // sha256 746a7d34ac66f01a
  team:          '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="11" r="2.5"/><path d="M5.5 17a3.5 3.5 0 0 1 7 0"/><path d="M15 10h3M15 14h3"/>', // sha256 802c5e7c0dfb2302
  couture:       '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.12 15.88"/><path d="M14.47 14.48L20 20"/><path d="M8.12 8.12L12 12"/>', // sha256 2792e2f62ef39ed8
  advisor:       '<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>', // sha256 0ed62f224940bf4a
  billing:       '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>', // sha256 d423fd49e9a60fba
  settings:      '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>', // sha256 9b7b6a36015263cc
  website:       '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>', // sha256 cb08d5f0aeb05bfb
  wedding_pages: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M12 18l-2.6-2.5a1.6 1.6 0 0 1 2.6-2 1.6 1.6 0 0 1 2.6 2z"/>', // sha256 59a2b055f42da5ce
  google:        '<path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z"/>', // sha256 d0276301a79248f9
  posts:         '<path d="M3 11v3a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M17 9a4 4 0 0 1 0 6"/><path d="M19.5 6.5a7.5 7.5 0 0 1 0 11"/>', // sha256 78db92c3c05a2740
  dates:         '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M12 13v6M9 16h6"/>', // sha256 e427bc72f8e4db09
  introductions: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>', // sha256 ee5503b6ad5892d8
  referrals:     '<path d="M17 3l4 4-4 4"/><path d="M3 7h18"/><path d="M7 21l-4-4 4-4"/><path d="M21 17H3"/>', // sha256 5fdbd227ab44385f
  // CE-45 IGD-1 cut 1 · R-45.27 A4 (his, 25 Sept 2026) and F-44.164: two overlapping speech bubbles, the seat's own drawing, one
  // stroke, no handset. The drawing it replaces (sha256 155795480dbae672) held a telephone handset inside a bubble, close to
  // WhatsApp's rule against an image confusingly similar to its telephone logo. b122 :119 re-aimed by label.
  number:        '<path d="M8 8V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><path d="M3 10a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3a2 2 0 0 1-2-2z"/>', // sha256 1b6519c8f964bef9
  contracts:     '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M8 17c1.4-2.2 2.4-2.2 3 0s1.6 2.2 3 0"/>', // sha256 e4b2ab227c6fc8fb
  reminders:     '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>', // sha256 980c5f803af7a016
  collabs:       '<path d="M11 17l2 2a1 1 0 1 0 3-3"/><path d="M14 14l2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="M21 3l1 11h-2"/><path d="M3 3L2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>', // sha256 aa200749cd30e7a8
};

/** The drawing for a room id or a row key; null for a key with none (never drawn as a blank box). */
export function iconFor(k: string): string | null {
  return Object.prototype.hasOwnProperty.call(ROOM_ICONS, k) ? ROOM_ICONS[k as IconKey] : null;
}
