// lib/vendor/chatBreak.ts · CE-46/47 · FE-5 · THE SECOND BUBBLE (ELZ-3's cut: a copyable draft arrives as its own message).
// One home for the pure half, read by BOTH layouts' chat hooks (hooks/vendor/useChat.ts, v2/hooks/vendor/useChat.ts):
//   · the stream: dream-os sends {type:'message_break'} before the second part, and that part's first delta begins with
//     "\n\n" (so an app that knows nothing of the break shows both a blank line apart). After a break, the new bubble
//     drops that leading blank line;
//   · the JSON route: `replies` (two or more) are separate bubbles; `reply` stays joined;
//   · history: a stored row carries its parts in `replies` (the door's meta.listener.replies, sent by the history route
//     once ELZ-4's layer C lands); such a row reloads as one bubble per part.
// A server that sends none of this draws exactly today's single bubble (b161 proves it both ways).

/** The first delta after a break, without the blank line that joined it to the part before. */
export function afterBreak(text: string): string {
  return text.replace(/^(\r?\n)+/, '');
}

/** The parts a reply or a stored row should draw as bubbles: its `replies` when there are two or more strings, else null. */
export function partsOf(replies: unknown): string[] | null {
  // layer C's wire (the chair's read, 30 Sept 2026): `replies` is present only for a two-part reply, two or more non-empty
  // strings, each already scrubbed; anything else is drawn as today's single bubble
  return Array.isArray(replies) && replies.length > 1 && replies.every((r) => typeof r === 'string' && r.trim() !== '') ? (replies as string[]) : null;
}

/** A history row as the bubbles it draws: one per part (ids `<row id>#<n>`, stable across reloads), or itself. */
export function historyBubbles<T extends { id: string; text: string; replies?: unknown }>(row: T): Array<T & { text: string }> {
  const parts = partsOf(row.replies);
  if (!parts) return [row];
  return parts.map((text, i) => ({ ...row, id: i === 0 ? row.id : `${row.id}#${i}`, text }));
}
