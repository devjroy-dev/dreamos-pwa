// v2/lib/worklist/contractsRoom.ts · CE-47 · FE-6 L3 · THE REWORKED CONTRACTS ROOM'S NEW WORDS, ONE HOME.
// The founder's verdict on FE-6's mock (CE-46, 30 Sept 2026): W2 (policies as one row), W4 (the agreement page's status
// and next button), W9 ("Read the standard agreement"); the chair's pill "+ New contract". No dashes; full months.
export const CT = {
  add: 'New contract',                                         // the pill reads "+ New contract"
  openCount: (n: number) => `Agreements \u00b7 ${n} open`,
  policies: 'Your contract policies',                          // W2
  policiesUnset: 'Not set up yet. Suggested values are used until you do.',
  setUp: 'Set up',
  readStandard: 'Read the standard agreement',                 // W9
  back: 'Back to Contracts',
  status: { draft: 'Draft', sent: 'Sent \u00b7 not signed yet', signed: 'Signed', cancelled: 'Cancelled', held: 'Date held' } as Record<string, string>,   // W4
  sendAgain: 'Send on WhatsApp again',                         // W4
  signingLink: 'Signing link',
  dates: 'Dates', money: 'Money', fee: 'Fee', deposit: (pct: number) => `Deposit (${pct}%)`, notSet: 'Not set',
  readPdf: 'Read the PDF', edit: 'Edit', cancel: 'Cancel this agreement',
  cancelAsk: 'Cancel this agreement? It cannot be signed after this.', cancelYes: 'Cancel it', keep: 'Keep it',
  noDates: 'No dates yet',
} as const;
