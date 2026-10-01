// v2/lib/worklist/storefrontRoom.ts · CE-47 · FE-6 L5 · THE REWORKED STOREFRONT'S NEW WORDS, ONE HOME.
// The founder's verdict on FE-6's mock 11 (V16, V22 with the chair's heading "What to add"; V17 withdrawn).
export const SF = {
  strength: (pct: number) => `Profile strength \u00b7 ${pct}%`,   // V16
  photosLive: (n: number, pending: number) => `${n} photos live${pending > 0 ? ` \u00b7 ${pending} waiting` : ''}`,
  whatToAdd: 'What to add',                                         // the chair's change to V22's heading
  add: {                                                            // V22: the row, and the place it shows
    photos: (n: number) => [`Add ${n} more ${n === 1 ? 'photo' : 'photos'}`, 'Shown on your profile and your website'],
    hero: ['Add a cover photo', 'The first picture on your profile'],
    about: ['Write two lines about your work', 'Shown under your name'],
    tags: (n: number) => [`Choose ${n} more ${n === 1 ? 'tag' : 'tags'}`, 'How people find your kind of work'],
    travel: ['Say where you travel', 'Shown on your profile'],
    rate: ['Set a starting price', 'Shown on your profile'],
    ig: ['Add your Instagram', 'Linked from your profile'],
  },
} as const;
