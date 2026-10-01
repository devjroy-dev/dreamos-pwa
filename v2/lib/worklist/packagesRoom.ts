// v2/lib/worklist/packagesRoom.ts · CE-47 · FE-6 L5 · THE REWORKED PACKAGES ROOM'S NEW WORDS, ONE HOME.
// The founder's verdict on FE-6's mock 12 (V20, V21, V23; the chair's pill "+ New package"); the no-"couple" rule.
export const PKG = {
  add: 'New package',                                             // the pill reads "+ New package"
  andMore: (n: number) => `and ${n} more`,                        // V23
  defaultLine: (name: string) => `${name} is your default package.`,   // V20
  price: 'Price', deposit: 'Deposit', delivery: 'Delivery',      // V21
  daysAfter: (n: number) => `${n} days after the event`,
  empty: 'No packages yet. Add one to quote a client.',          // "couple" out (the founder's rule)
} as const;
