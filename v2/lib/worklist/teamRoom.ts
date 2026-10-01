// v2/lib/worklist/teamRoom.ts · CE-47 · FE-6 L5 · THE REWORKED TEAM ROOM'S NEW WORDS, ONE HOME (V7; the chair's pill words).
export const TEAM = {
  members: (n: number) => `Members \u00b7 ${n}`,
  tasksOpen: (n: number) => `Tasks \u00b7 ${n} open`,
  owed: (rs: string) => `Owed \u00b7 ${rs}`,
} as const;
const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** "5 October 2026" from "2026-10-05": the date said in words under a native date field. */
export function dateWords(d: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d || ''); return m ? `${Number(m[3])} ${MONTH[Number(m[2]) - 1]} ${m[1]}` : '';
}
