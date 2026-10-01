// v2/lib/worklist/collabRoom.ts · CE-47 · FE-6 L5 · THE REWORKED COLLAB ROOM'S NEW WORDS, ONE HOME (V1, V2; the pill).
export const COL = {
  newPost: 'New post',                                               // V2: the pill reads "+ New post" (replaces "+ Post")
  addSomeone: 'Add someone',                                         // the Roster tab's pill, the room's existing words
  myPostsOpen: (n: number) => `My posts \u00b7 ${n} open`,           // V1
  opportunities: (n: number) => `Opportunities \u00b7 ${n} new`,     // V1
  roster: (n: number) => `Roster \u00b7 ${n} ${n === 1 ? 'person' : 'people'}`,   // V1
} as const;
