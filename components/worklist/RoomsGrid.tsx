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
      <Pointer />
      <div hidden data-room-count={ROOMS.length} />
      <style>{GRID_CSS}</style>
    </div>
  );
}

const GRID_CSS = `
.wl-pointer{margin-top:22px;padding:16px 16px 14px;border:.5px solid var(--atelier-card-border);border-radius:3px;background:var(--atelier-card-bg);display:flex;flex-direction:column;gap:11px;align-items:flex-start}
.wl-pointertext{font-size:14.5px;font-weight:400;line-height:1.6;color:var(--atelier-ink-soft)}
.wl-pointerbtn{min-height:46px;background:transparent;border:.5px solid var(--atelier-input-border);border-radius:2px;cursor:pointer;padding:12px 18px;font-family:'Jost',sans-serif;font-weight:500;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--atelier-accent-text)}
.wl-pointerbtn:active{background:var(--atelier-row-hover)}
.wl-pointerbtn:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
.wl-bands{padding:18px 14px 28px;flex:1}
.wl-band+.wl-band{margin-top:22px}
.wl-bandlabel{font-family:'Jost',sans-serif;font-weight:500;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--atelier-ink-mute);text-align:center;margin:0 0 11px}
.wl-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.wl-tile{background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;min-height:74px;display:flex;align-items:center;justify-content:center;padding:8px 6px;cursor:pointer}
/* R-37.73 ②: 9px CONVICTED as illegible chrome. 12 is the interactive floor. */
.wl-tname{font-family:'Jost',sans-serif;font-weight:500;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-soft);text-align:center;line-height:1.3}
.wl-tile:active{background:var(--atelier-row-hover);border-color:var(--atelier-accent-text)}
.wl-tile:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
`;
