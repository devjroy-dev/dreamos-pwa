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
import { useState } from 'react';
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

// R-37.76 ① / R-37.78: the assistant, offered as a row between the bands and the pointer.
// Title is the founder’s byte. Destination is the same vendor line the dock opens, through
// the same declared home — one number, one resolver, no seventh inline literal.
function AskRow() {
  return (
    <button type="button" className="wl-row" onClick={() => window.open(
      `https://wa.me/${waNumberFor('vendor')}?text=${encodeURIComponent('Hi')}`, '_blank', 'noopener')}>
      <span className="wl-rowglyph" aria-hidden>&#9670;</span>
      <span className="wl-rowtext">{COPY.roomsAskTitle}<span className="wl-rowsub">{COPY.roomsAskSub}</span></span>
      <span className="wl-rowchev" aria-hidden>&rsaquo;</span>
    </button>
  );
}

// R-37.81(a): DERIVED, not guessed. Two couple-facing surfaces exist at tip —
//   /vendor/discover/profile  is the EDITOR (its own header: "the spec calls this Profile
//                             Studio", founder-renamed 2026-07-29)
//   /vendor/discover/preview  is the COUPLE VIEW (its own header quotes the founder’s
//                             contract of 2026-07-31: "see what couples see")
// The ruling asks for the couple-view, so this opens /preview. Near-zero wiring, as expected:
// the surface already exists and needed only an affordance.
function ProfileRow() {
  const router = useRouter();
  return (
    <button type="button" className="wl-row" onClick={() => router.push('/vendor/discover/preview')}>
      <span className="wl-rowglyph" aria-hidden>&#9678;</span>
      <span className="wl-rowtext">{COPY.roomsProfileTitle}<span className="wl-rowsub">{COPY.roomsProfileSub}</span></span>
      <span className="wl-rowchev" aria-hidden>&rsaquo;</span>
    </button>
  );
}

// R-37.76 ⑥: the vendor’s own share link, rendered as ITSELF. A link a vendor can see is a
// link he trusts and pastes. Composed through waNumberFor, never inline.
function LinkCard({ handle }: { handle: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://wa.me/${waNumberFor('vendor')}?text=${encodeURIComponent('TDW-' + handle)}`;
  return (
    <div className="wl-card wl-linkcard">
      <h3 className="wl-cardtitle">{COPY.cardLinkTitle}</h3>
      <button type="button" className="wl-linkrow" onClick={() => {
        navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); })
          .catch(() => { /* clipboard denied — the link is still readable, which was the point */ });
      }}>
        <code className="wl-linkcode">{url.replace('https://', '')}</code>
        <span className={'wl-copy' + (copied ? ' on' : '')}>{copied ? COPY.linkCopied : COPY.linkCopy}</span>
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

export function RoomsGrid({ handle }: { handle?: string | null }) {
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
      <div className="wl-stack"><AskRow />
      <ProfileRow />
      {handle && <LinkCard handle={handle} />}
      <Pointer /></div>
      <div hidden data-room-count={ROOMS.length} />
      <style>{GRID_CSS}</style>
    </div>
  );
}

const GRID_CSS = `
/* One rhythm down the column: the rows now sit on the same 16px gutter and carry the same
   card shape as everything below them, instead of running full-bleed against inset cards. */
.wl-row{display:flex;align-items:center;gap:11px;width:calc(100% - 32px);min-height:64px;margin:0 16px 10px;padding:14px 16px;background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;cursor:pointer;text-align:left}
.wl-rowglyph{color:var(--atelier-accent-text);font-size:13px;line-height:1}
.wl-rowtext{font-family:var(--wl-body);font-weight:400;font-size:14.5px;color:var(--atelier-ink-soft);display:flex;flex-direction:column;gap:2px;flex:1}
.wl-rowsub{font-family:var(--wl-label);font-weight:500;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--atelier-ink-mute)}
.wl-rowchev{color:var(--atelier-ink-mute);font-size:18px;line-height:1}
.wl-row:active{background:var(--atelier-row-hover)}
.wl-linkcard{margin:0 16px 10px}
.wl-linkrow{display:flex;align-items:center;gap:9px;width:100%;margin-top:12px;min-height:46px;background:var(--atelier-input-bg);border:.5px solid var(--atelier-card-border);border-radius:2px;padding:11px 12px;cursor:pointer;text-align:left}
.wl-linkcode{font-family:ui-monospace,Menlo,monospace;font-size:12px;color:var(--atelier-accent-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1}
.wl-copy{font-family:var(--wl-label);font-weight:500;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--atelier-ink-mute);flex-shrink:0}
.wl-copy.on{color:var(--atelier-accent-text)}
.wl-linkrow:active{background:var(--atelier-row-hover)}
.wl-pointer{margin:0 16px 10px;padding:17px;border:.5px solid var(--atelier-card-border);border-radius:3px;background:var(--atelier-card-bg);display:flex;flex-direction:column;gap:12px;align-items:flex-start}
.wl-pointertext{font-size:14.5px;font-weight:400;line-height:1.6;color:var(--atelier-ink-soft)}
.wl-pointerbtn{min-height:46px;background:transparent;border:.5px solid var(--atelier-input-border);border-radius:2px;cursor:pointer;padding:12px 18px;font-family:var(--wl-label);font-weight:500;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--atelier-accent-text)}
.wl-pointerbtn:active{background:var(--atelier-row-hover)}
.wl-pointerbtn:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
.wl-bands{padding:18px 14px 28px;flex:1}
.wl-stack{margin-top:20px}
.wl-band+.wl-band{margin-top:22px}
.wl-bandlabel{font-family:var(--wl-label);font-weight:500;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--atelier-ink-mute);text-align:center;margin:0 0 11px}
.wl-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.wl-tile{background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;min-height:74px;display:flex;align-items:center;justify-content:center;padding:8px 6px;cursor:pointer}
/* R-37.73 ②: 9px CONVICTED as illegible chrome. 12 is the interactive floor. */
.wl-tname{font-family:var(--wl-label);font-weight:500;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-soft);text-align:center;line-height:1.3}
.wl-tile:active{background:var(--atelier-row-hover);border-color:var(--atelier-accent-text)}
.wl-tile:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
`;
