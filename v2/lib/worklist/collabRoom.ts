// v2/lib/worklist/collabRoom.ts \u00b7 CE-47 \u00b7 THE COLLAB ROOM'S WORDS, ONE HOME.
// FE-6 L5 set the pill and the per-tab lines for My posts | Opportunities | Roster; today's room (CollabRoomBefore.tsx,
// a32fbf4e's screen moved byte for byte) still reads them, for every vendor the Hub is not open to (Rule 1, the chair's
// ruling (a), 7 Oct 2026). HUB-2 adds the Hub's words: Work | People | Mine, opening on Work, Mine with its count.
export const COL = {
  newPost: 'New post',                                               // V2: the pill reads "+ New post" (replaces "+ Post")
  addSomeone: 'Add someone',                                         // the Roster tab's pill, the room's existing words
  myPostsOpen: (n: number) => `My posts \u00b7 ${n} open`,           // V1
  opportunities: (n: number) => `Opportunities \u00b7 ${n} new`,     // V1
  roster: (n: number) => `Roster \u00b7 ${n} ${n === 1 ? 'person' : 'people'}`,   // V1
  // HUB-2 \u00b7 the Hub's room (open vendors only)
  work: 'Work',
  people: 'People',
  mine: 'Mine',
  /** Mine carries a count when something waits for her answer (the chair's ruling): "Mine \u00b7 2". */
  mineWaiting: (n: number) => (n > 0 ? `Mine \u00b7 ${n}` : 'Mine'),
} as const;
