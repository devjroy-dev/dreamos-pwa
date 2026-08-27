"use client";
// components/worklist/RoomsGrid.tsx — the two bands, sixteen tiles, frozen.
//
// THE GRID IS THE DIRECTORY (R-37.61). A room reachable only through the coin is a hidden
// room, and hidden capability one layer above where the eye looks is the whole complaint the
// worklist exists to answer. So Settings and Billing take tiles even though the coin also
// reaches them: coin as shortcut, grid as directory, two homes by standing ruling.
//
// POSITIONS NEVER REORDER. Rider \u2461, R-37.22 cited. Badges will move in Phase 4; tiles
// will not. The order comes from FROZEN_ORDER and nowhere else.
import { useRouter } from 'next/navigation';
import { COPY } from '@/lib/worklist/copy';
import { waNumberFor } from '@/lib/waNumbers';
import { ROOMS, roomsInBand, type Room } from '@/lib/worklist/rooms';

function Tile({ room }: { room: Room }) {
  const router = useRouter();
  const external = room.href.startsWith('/vendor');
  return (
    <button type="button" className="wl-tile" onClick={() => router.push(room.href)}
            data-room={room.id} data-interim={external ? 'true' : undefined}>
      <span className="wl-tname">{room.label}</span>
    </button>
  );
}

// R-37.84 (5): the wa.me row moved to Settings, beside the handle field that mints it.
// A link belongs next to the thing that defines it, not in a directory footer.
function Panel() {
  const router = useRouter();
  const wa = () => window.open(`https://wa.me/${waNumberFor('vendor')}?text=${encodeURIComponent('Hi')}`, '_blank', 'noopener');
  return (
    <div className="wl-panel">
      {/* R-37.82 (2): ONE LINE PER ROW. The caps-tracked subtitles are DELETED — the titles
          carry the meaning alone, and the manual’s cards already teach the rest. */}
      <button type="button" className="wl-prow" onClick={wa}>
        <span className="wl-pglyph" aria-hidden>&#9670;</span>
        <span className="wl-ptitle">{COPY.roomsAskTitle}</span>
        <span className="wl-pchev" aria-hidden>&rsaquo;</span>
      </button>
      <button type="button" className="wl-prow" onClick={() => router.push('/vendor/discover/preview')}>
        <span className="wl-pglyph" aria-hidden>&#9678;</span>
        <span className="wl-ptitle">{COPY.roomsProfileTitle}</span>
        <span className="wl-pchev" aria-hidden>&rsaquo;</span>
      </button>
    </div>
  );
}

function Pointer() {
  const router = useRouter();
  return (
    <div className="wl-pointer">
      <span className="wl-pointertext">{COPY.roomsPointer}</span>
      <button type="button" className="wl-pointerbtn"
              onClick={() => router.push('/w/today')}>{COPY.roomsPointerAction}</button>
    </div>
  );
}

export function RoomsGrid() {
  return (
    <div className="wl-bands">
      <section className="wl-band" aria-label="Your work">
        <div className="wl-bandlabel">&mdash; your work &mdash;</div>
        <div className="wl-tiles">{roomsInBand('work').map((r) => <Tile key={r.id} room={r} />)}</div>
      </section>
      <section className="wl-band" aria-label="Your business">
        <div className="wl-bandlabel">&mdash; your business &mdash;</div>
        <div className="wl-tiles">{roomsInBand('business').map((r) => <Tile key={r.id} room={r} />)}</div>
      </section>
      <Panel />
      <Pointer />
      <div hidden data-room-count={ROOMS.length} />
      <style>{GRID_CSS}</style>
    </div>
  );
}

const GRID_CSS = `
/* R-37.82 (2): the panel is the grid's SIBLING — same card-bg, same .5px border, same 3px
   radius as the tiles above it, flush to the gutter the column owns. It must not read as a
   guest sitting on the grid's page. Rows are separated by hairlines, never by gaps. */
.wl-panel{margin-top:24px;background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;overflow:hidden}
.wl-prow{display:flex;align-items:center;gap:12px;width:100%;min-height:52px;padding:0 14px;background:transparent;border:none;cursor:pointer;text-align:left}
.wl-prow + .wl-prow{border-top:.5px solid var(--atelier-card-border)}
.wl-pglyph{color:var(--role-metal);font-size:12px;line-height:1;flex-shrink:0}
.wl-ptitle{flex:1;font-family:var(--wl-body);font-weight:500;font-size:13px;color:var(--atelier-ink-soft);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wl-pchev{color:var(--atelier-ink-dim);font-size:10px;line-height:1;flex-shrink:0}
.wl-plink{flex:1;font-family:ui-monospace,Menlo,monospace;font-size:11px;color:var(--atelier-ink-dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex-basis:0}
.wl-pcopy{font-family:var(--wl-label);font-weight:500;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--atelier-accent-text);flex-shrink:0}
.wl-pcopy.on{color:var(--role-positive)}
.wl-prow:active{background:var(--atelier-row-hover)}
/* One rhythm down the column: the rows now sit on the same 16px gutter and carry the same
   card shape as everything below them, instead of running full-bleed against inset cards. */
.wl-pointer{margin:24px 0 0;padding:17px;border:.5px solid var(--atelier-card-border);border-radius:3px;background:var(--atelier-card-bg);display:flex;flex-direction:column;gap:12px;align-items:flex-start}
.wl-pointertext{font-size:14.5px;font-weight:400;line-height:1.6;color:var(--atelier-ink-soft)}
.wl-pointerbtn{min-height:46px;background:transparent;border:.5px solid var(--atelier-input-border);border-radius:2px;cursor:pointer;padding:12px 18px;font-family:var(--wl-label);font-weight:500;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--atelier-accent-text)}
.wl-pointerbtn:active{background:var(--atelier-row-hover)}
.wl-pointerbtn:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
/* R-37.82 (1): the column owns the gutter; the bands no longer set their own. */
.wl-bands{padding:18px 0 28px;flex:1}
.wl-stack{margin-top:20px}
.wl-band+.wl-band{margin-top:24px}
.wl-bandlabel{font-family:var(--wl-label);font-weight:500;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--atelier-ink-mute);text-align:center;margin:0 0 8px}
.wl-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.wl-tile{background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;min-height:74px;display:flex;align-items:center;justify-content:center;padding:8px 6px;cursor:pointer}
/* R-37.73 ②: 9px CONVICTED as illegible chrome. 12 is the interactive floor. */
.wl-tname{font-family:var(--wl-label);font-weight:500;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-soft);text-align:center;line-height:1.3}
.wl-tile:active{background:var(--atelier-row-hover);border-color:var(--atelier-accent-text)}
.wl-tile:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
`;
