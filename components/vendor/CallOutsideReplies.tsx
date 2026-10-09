'use client';
// components/vendor/CallOutsideReplies.tsx · CE-47 · HUB-2c · ON HER CALL'S REPLIES PAGE, THE PEOPLE FROM OUTSIDE TDW.
// Drawn under her TDW replies, which the page still shows in full. Reads nothing itself: the page passes the door's
// `outside` (lib/vendor/callOutside.ts asOutside).
//   - Instagram and Threads rows: the name, a chip saying where they came from, the day, and where to answer them.
//     NO mark (the chair, 9 Oct 2026): TDW never checks these people, and the chip already says where they came from.
//   - A partner's row: THE SLOT. PTN's PartnerInterestRow.tsx draws it, with the partner mark and its tap card (the
//     chair, 9 Oct 2026: words in PTN's one home). Until that file lands, partner rows are kept, not drawn.
//   - outside_note: the server's sentence, word for word, when her rows or the partners could not be read.
// No text node is typed here: every word is lib/vendor/callOutside.ts's or the server's.
import { REPLIES_WORDS, isSocial, shortDate } from '@/lib/vendor/callOutside';
import type { Outside, PartnerRow, SocialRow } from '@/lib/vendor/callOutside';

/** The rows this screen draws today: Instagram and Threads. Partner rows join when PTN's row lands (the slot). */
export function drawnRows(o: Outside): SocialRow[] { return o.rows.filter(isSocial); }

/** THE SLOT for PTN's PartnerInterestRow.tsx. Draws nothing until that file lands; the page keeps the rows. */
function PartnerSlot({ row }: { row: PartnerRow }) { void row; return null; }

export function CallOutsideReplies({ outside }: { outside: Outside }) {
  const social = drawnRows(outside);
  const partners = outside.rows.filter((r): r is PartnerRow => r.source === 'partner');
  if (!social.length && !outside.note) return null;
  return (
    <section data-call-outside="" aria-label={REPLIES_WORDS.outside} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
      {social.length > 0 && <h2 className="co-label">{REPLIES_WORDS.outside}</h2>}
      {social.map((r) => {
        const day = shortDate(r.when);
        return (
          <div key={r.id} className="co-row" data-call-outside-row={r.source}>
            <div className="co-top">
              <p className="co-name">{r.name}</p>
              <span className="co-chip">{REPLIES_WORDS.chip[r.source]}</span>
            </div>
            {day && <p className="co-day">{day}</p>}
            <p className="co-line">{REPLIES_WORDS.replyThere[r.source]}</p>
          </div>
        );
      })}
      {partners.map((r) => <PartnerSlot key={r.id} row={r} />)}
      {outside.note && <p className="co-note" role="status" data-call-outside-note="">{outside.note}</p>}
      <style>{CO_CSS}</style>
    </section>
  );
}

// The rows as the page's own cards: the card ground and edge, the name at the page's name size, a quiet chip.
// Tokens only. ⚠ NO BACKTICKS BELOW THIS LINE: the CSS is a template literal.
const CO_CSS = `
.co-label{margin:8px 0 0;font:var(--wl-t5);color:var(--atelier-ink-mute)}
.co-row{background:var(--role-sheet);border:.5px solid var(--atelier-card-border);border-radius:12px;padding:16px}
.co-top{display:flex;gap:12px;align-items:flex-start;justify-content:space-between}
.co-name{margin:0;font:var(--wl-t3);color:var(--atelier-ink);overflow-wrap:anywhere;min-width:0}
.co-chip{flex:0 0 auto;font:var(--wl-t5);color:var(--atelier-ink-soft);border:.5px solid var(--atelier-card-border);border-radius:999px;padding:2px 10px;white-space:nowrap}
.co-day{margin:4px 0 0;font:var(--wl-t5);color:var(--atelier-ink-mute)}
.co-line{margin:10px 0 0;font:var(--wl-t4);color:var(--atelier-ink-soft)}
.co-note{margin:4px 0 0;font:var(--wl-t4);color:var(--atelier-ink-mute)}
`;
