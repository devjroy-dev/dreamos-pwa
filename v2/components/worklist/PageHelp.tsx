"use client";
// components/worklist/PageHelp.tsx — THE ROOM'S HEAD, THE "?" ON IT, AND THE CARD IT OPENS.
//
// CE-46 · FE-4 · the "?" on every surface (the founder's ruling of 27 September 2026; the
// chair's Fork A (3), Forks B to H, ruled the same day).
//
// ONE HOME FOR THE ROOM'S NAME. Since TYPE_1b every room opened with its own name as the
// surface's one t1, and ten rooms drew that line themselves at four homes (SliceShell, Notes'
// body, .sol-title in three solutions pages and the five states of OwnNumberFlow, the Advisor's
// wl-advtitle) while 23 rooms drew none (F-44.218). The shell already carried every room's
// name byte in its `title` prop, so the head moves to the shell: WorklistShell mounts RoomHead
// once, above {children}, and no room draws its name any more. The founder's ruling of 24 Sept
// (the name at t1, 16px above it, the first line of the room) now holds on all 33 surfaces by
// construction. The h1 keeps `data-room-title` so b123's 3.5 reads the same element it always
// read.
//
// THE "?" (the founder's placement): on the line of the t1 name, at the line's right edge, a
// 44px target drawn as a thin circle in ink-mute. A first-visit dot in the accent ink sits on it
// until the room's card has been opened once on that phone: a per-phone convenience in
// localStorage, one key per route (lib/worklist/pageHelp.ts helpSeenKey), read in an effect
// after mount and never during render (Next: browser-only APIs stay off the render path).
// Nothing is sent. The chair ruled this per-phone key outside §8's native clause, as the mode's
// own key is (lib/worklist/mode.ts); stated here at the site as the ruling asks.
//
// THE CARD (the founder's shape, his change of 27 Sept: CENTRED). A dialog over the scrim,
// vertically centred in the viewport, inset by one gutter on both sides, content-fit with a
// 60dvh ceiling and its own scroll (Fork C (1)); the dock and the nav stay where they are. It
// holds: the room's name (t2), what the page is (t3, one sentence), what can be done here (t3,
// up to three lines with a line icon each in the accent ink, R-45.21), where it connects (t4,
// ink-mute), and two controls in the `.wl-cardaction` register (t4, sentence case, F5):
// "Ask TDW about this", which opens the Ask TDW sheet with the room's name in the input and
// sends nothing (Fork D (1), F-04.9), and "Got it". Escape, the scrim and Got it close it, and
// focus returns to the "?".
//
// EVERY WORD COMES FROM lib/worklist/pageHelp.ts. Nothing here types a vendor-facing byte
// except the two control labels and the target's aria-label, which live in COPY like every
// other shell string.
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { COPY } from '@/v2/lib/worklist/copy';
import { helpFor, helpSeenKey, type HelpIcon } from '@/v2/lib/worklist/pageHelp';
import { useAsk } from '@/lib/worklist/askContext';

// ── F-44.219 (ruled 28 Sept 2026) · THE TWO EXCEPTION ROOMS ────────────────────────────────────────
// Two surfaces already carried their one t1 by an earlier founder ruling: Calendar's month (his "2") and
// Today's status line (R-38.4: the not-live line, the first-run line, "All clear." on the resting day;
// the working state has none, R-39.13). There the surface's own line IS the head: the room mounts
// <RoomHeadTitle line={...} /> anywhere beneath the shell and RoomHead draws that line at t1 in place of
// the room's name, with the "?" on it; the room's name stays the shell's t5 label above. A `null` line
// (Today working or before its reading settles) draws no title, only the "?", so the page never carries
// a heading R-39.13 forbids. Every other room mounts nothing and the head is the room's name.
// The override is React state, not a prop threaded down, because the month lives in CalendarScreen's
// own state and the status in TodayPage's, and neither should know the shell's insides.
type HeadOverride = { line: string | null | undefined; set: (line: string | null | undefined) => void };
const RoomHeadOverride = createContext<HeadOverride>({ line: undefined, set: () => {} });
export function RoomHeadProvider({ children }: { children: React.ReactNode }) {
  const [line, set] = useState<string | null | undefined>(undefined);
  return <RoomHeadOverride.Provider value={{ line, set }}>{children}</RoomHeadOverride.Provider>;
}
/** Mounted by Calendar and Today only. Sets the head's line while mounted; clears it on unmount. */
export function RoomHeadTitle({ line }: { line: string | null }) {
  const { set } = useContext(RoomHeadOverride);
  useEffect(() => { set(line); return () => set(undefined); }, [line, set]);
  return null;
}

// The line icons: eleven simple strokes, drawn inline so no image is fetched and the ink is a
// token. A name with no drawing falls back to the plain list mark, never to nothing.
const ICON_PATH: Record<HelpIcon, string> = {
  list:     'M4 6h16M4 12h16M4 18h10',
  reply:    'M9 17l-5-5 5-5M4 12h12a4 4 0 0 1 0 8h-1',
  tag:      'M20 12l-8 8-9-9V4h7l10 8zM7.5 7.5h.01',
  add:      'M12 5v14M5 12h14',
  edit:     'M4 20h4l10-10-4-4L4 16v4zM13 7l4 4',
  send:     'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  money:    'M6 4h12M6 8h12M8 8c6 0 6 8 0 8h-2l8 4',
  switch:   'M7 8h10a4 4 0 0 1 0 8H7a4 4 0 0 1 0-8zM15 12h.01',
  share:    'M4 12v8h16v-8M12 3v13M8 7l4-4 4 4',
  read:     'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 12h.01',
};

function Icon({ name }: { name: HelpIcon }) {
  return (
    <svg className="wl-helpicon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={ICON_PATH[name] ?? ICON_PATH.list} />
    </svg>
  );
}

function readSeen(key: string): boolean {
  try { return typeof window !== 'undefined' && window.localStorage.getItem(key) === '1'; } catch { return true; }
}
function writeSeen(key: string) {
  try { window.localStorage.setItem(key, '1'); } catch { /* a phone that refuses storage simply keeps the dot */ }
}

export function RoomHead({ title }: { title: string }) {
  const pathname = usePathname() ?? '/vendor';
  const { line: override } = useContext(RoomHeadOverride);
  // undefined: the room's name; a string: the room's own line (F-44.219); null: no title, the "?" alone
  const headLine = override === undefined ? title : override;
  const help = helpFor(pathname);
  const [open, setOpen] = useState(false);
  // The dot: rendered OFF until the effect reads the phone, so the server and the first client
  // paint agree (no hydration warning), and the dot appears one frame later only where it is due.
  const [first, setFirst] = useState(false);
  const qRef = useRef<HTMLButtonElement>(null);
  const seenKey = helpSeenKey(pathname);
  useEffect(() => { setFirst(!readSeen(seenKey)); }, [seenKey]);

  const close = useCallback(() => {
    setOpen(false);
    // focus returns to the "?" (the walk's own step); after the dialog leaves the tree
    requestAnimationFrame(() => { qRef.current?.focus(); });
  }, []);
  const openCard = useCallback(() => { setOpen(true); if (first) { writeSeen(seenKey); setFirst(false); } }, [first, seenKey]);

  return (
    <>
      <div className="wl-roomhead">
        {headLine !== null ? <h1 data-room-title="" className="wl-roomtitle">{headLine}</h1> : <span className="wl-roomtitle wl-roomtitle-none" aria-hidden="true" />}
        {help && (
          <button ref={qRef} type="button" className="wl-helpq" aria-label={COPY.helpAria}
                  aria-haspopup="dialog" aria-expanded={open} data-first={first ? '1' : '0'} onClick={openCard}>
            <span className="wl-helpqring" aria-hidden="true">?</span>
          </button>
        )}
      </div>
      {open && help && <HelpCard title={title} help={help} onClose={close} />}
    </>
  );
}

function HelpCard({ title, help, onClose }: { title: string; help: NonNullable<ReturnType<typeof helpFor>>; onClose: () => void }) {
  const { openAsk } = useAsk();
  // Escape closes, and the scrim closes. A card with no way out is a trap (AskSheet's own rule).
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  const ask = () => { onClose(); openAsk(COPY.helpAskPrefill(title)); };
  return (
    <div className="wl-help" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="wl-helpscrim" aria-label={COPY.helpClose} onClick={onClose} />
      <div className="wl-helpcard">
        <h2 className="wl-helpname">{title}</h2>
        <p className="wl-helpwhat">{help.what}</p>
        {help.app ? <p className="wl-helpwhat">{help.app}</p> : null}
        {help.can.length > 0 && (
          <ul className="wl-helpdo">
            {help.can.map((c) => <li key={c.line}><Icon name={c.icon} /><span>{c.line}</span></li>)}
          </ul>
        )}
        {help.connects ? <p className="wl-helplink">{help.connects}</p> : null}
        <div className="wl-helpacts">
          <button type="button" className="wl-cardaction wl-helpask" onClick={ask}>{COPY.helpAsk}</button>
          <button type="button" className="wl-cardaction wl-helpgot pri" onClick={onClose}>{COPY.helpGotIt}</button>
        </div>
      </div>
    </div>
  );
}

// ⚠ NO BACKTICKS BELOW THIS LINE (WorklistShell.tsx's own rule): everything after it is inside a
// JS template literal. Selectors in comments are written in words.
// Every colour is a shell token; every text a rung variable; the gutter and the dock offset are
// the grid's own variables. The head row reads the gutter from the main column's rule (every
// direct child of the main column carries it), so the name and the "?" sit on the same x as the
// wordmark, the tiles and the dock field. The dialog is a sibling of the head inside that column and is
// fixed to the viewport, so it sets padding 0 to refuse the column's gutter: the card's own margin IS the
// inset (b140 2.7 caught the doubled 32px on the first run).
export const PAGE_HELP_CSS = `
.wl-roomhead{flex-shrink:0;display:flex;align-items:center;justify-content:space-between;gap:8px}
.wl-roomtitle{font:var(--wl-t1);color:var(--atelier-ink);margin:0;padding:16px 0 8px;min-width:0}
.wl-roomtitle-none{padding:0;flex:1}
.wl-helpq{width:44px;height:44px;min-width:44px;min-height:44px;border:none;background:transparent;display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;margin:0 -11px 0 0;padding:0;touch-action:manipulation}
.wl-helpqring{width:22px;height:22px;border:1px solid var(--atelier-ink-mute);border-radius:50%;display:flex;align-items:center;justify-content:center;font:var(--wl-t4);color:var(--atelier-ink-mute)}
.wl-helpq[data-first="1"]::after{content:"";position:absolute;top:9px;right:9px;width:7px;height:7px;border-radius:50%;background:var(--atelier-accent-text)}
.wl-helpq:active .wl-helpqring{background:var(--atelier-row-hover)}
.wl-helpq:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:-2px}
.wl-help{position:fixed;inset:0;z-index:40;padding:0;display:flex;flex-direction:column;justify-content:center}
.wl-helpscrim{position:absolute;inset:0;background:var(--role-scrim);border:none;cursor:pointer}
.wl-helpcard{position:relative;margin:0 var(--wl-gutter);background:var(--atelier-sheet-bg);border:.5px solid var(--atelier-sheet-border);border-radius:12px;padding:16px;max-height:60dvh;overflow-y:auto;-webkit-overflow-scrolling:touch;box-shadow:0 8px 28px var(--atelier-card-shadow)}
.wl-helpname{font:var(--wl-t2);color:var(--atelier-ink);margin:0 0 8px}
.wl-helpwhat{font:var(--wl-t3);color:var(--atelier-ink-soft);margin:0 0 16px}
.wl-helpdo{list-style:none;margin:0 0 16px;padding:0;display:flex;flex-direction:column;gap:12px}
.wl-helpdo li{display:flex;gap:12px;align-items:flex-start;font:var(--wl-t3);color:var(--atelier-ink)}
.wl-helpicon{width:18px;height:18px;flex-shrink:0;margin-top:0px;stroke:var(--atelier-accent-text);fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.wl-helplink{font:var(--wl-t4);color:var(--atelier-ink-mute);margin:0 0 16px}
.wl-helpacts{display:flex;gap:8px}
.wl-helpacts .wl-cardaction{flex:1;margin-top:0}
.wl-helpacts .pri{background:var(--role-primary);border-color:transparent;color:var(--role-on-primary)}
`;
