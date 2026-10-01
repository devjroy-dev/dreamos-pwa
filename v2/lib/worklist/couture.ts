// v2/lib/worklist/couture.ts · CE-47 · FE-6 L3 · THE COUTURE ROOM'S WORDS, ONE HOME.
// The founder's verdict on FE-6's mock (CE-46, 30 Sept 2026) with W3 and W10; the chair's pill words ("+ New slot").
// No dashes (R-45.30); full months (R-42.13); times through the shared 12-hour clock ("4:00 pm").
export const CO = {
  lockedLine: 'Couture appointments are part of Signature and Prestige.',   // W3
  lockedButton: 'See plans in Billing',                                      // W3 (R-43.16: the line is the tap)
  tabs: { open: 'Open slots', appointments: 'Appointments' },               // W3
  openCount: (n: number) => `Open slots \u00b7 ${n}`,
  apptCount: (n: number) => `Appointments \u00b7 ${n}`,
  add: 'New slot',                                                           // the pill reads "+ New slot"
  addTitle: 'Add a slot',                                                    // W10
  addButton: 'Add slot',
  date: 'Date', time: 'Time', fee: 'Fee',
  minutes: (n: number) => `${n} minutes`,
  state: { open: 'Open', booked: 'Booked', blocked: 'Blocked' } as Record<string, string>,
  remove: 'Remove this slot',
  removeAsk: 'Remove this open slot? Nobody can book it after this.',
  removeYes: 'Remove', keep: 'Keep it',
  noSlots: 'No open slots yet.',
  noAppointments: 'No appointments yet.',
  added: 'Slot added', removed: 'Slot removed', failed: 'That did not work. Try again.',
} as const;
