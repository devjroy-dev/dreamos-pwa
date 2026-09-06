"use client";
// components/worklist/AddFab.tsx — R-38.18. ONE CONTROL THAT MAKES THINGS.
//
// ── WHY IT EXISTS ───────────────────────────────────────────────────────────
// Every create in this estate lives inside the room it belongs to: a lead is made from
// Leads, an invoice from Invoices. That is correct as a home and wrong as a path — the
// vendor who wants to log an expense has to remember which room owns expenses, navigate to
// it, and find its own control. Rooms is the directory she is already looking at when she
// has something to add, and this is the one control there that makes anything.
//
// IT IS NOT A SECOND HOME FOR CREATE. Every leg below hands off to the EXISTING surface:
// five go to `components/vendor/AddSheet`, the same component the five list rooms mount,
// with the same `slice` prop they pass; Note opens the composer NotesBody already owns;
// Calendar goes to the calendar room. Nothing here duplicates a form, a validator or a
// vetoed byte. What this file adds is an entrance.
//
// ── ROOMS ONLY, AND THE REASON IS NOT TIDINESS ──────────────────────────────
// R-38.18 scopes it to Rooms. On a room's own surface the room's own control is the right
// one and is already there, so a second floating control would be two doors to one form —
// the disease the tile grid was ruled to end (R-37.87 on the Collab pill). On Today the
// surface is a brief, and a brief is a thing you read.
//
// ── THE COLOUR IS THE ACCENT TOKEN AND NOT A LITERAL  [c-38.11] ─────────────
// `var(--atelier-accent-text)`. The ZIP 4 gold-FAB finding was exactly this control
// painting a hard-coded brass literal that bypassed the variable layer, so a FAB reading a
// token is the cure standing up rather than a preference. NO MINT: the chair named the
// shade at c-38.11, and the accent token is what the rest of the shell's affordances use.
//
// ── THE ORDER IS FROZEN AND IT IS NOT THE ROOMS ORDER ───────────────────────
// Calendar · Lead · Client · Invoice · Expense · Event · Note. Calendar is first because
// checking a date is the thing a vendor reaches for mid-conversation, and the four money
// rows follow the sequence work actually takes. R-37.22's reasoning binds here as it does
// on the tiles: a control that moves under the thumb is a control that cannot be learned.
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddSheet } from '@/components/vendor/AddSheet';
import { WlToast } from '@/components/worklist/WlToast';
import { useToast } from '@/hooks/vendor/useToast';
import { COPY } from '@/lib/worklist/copy';
import { Fab } from '@/components/worklist/Fab';
import { roomHref } from '@/lib/worklist/rooms';
import type { ListSlice } from '@/hooks/vendor/useLastSlice';

// THE ROW SET. `slice` is the AddSheet leg; a row without one carries an `href` instead.
// Both fields are never set on one row — a row with two destinations is a row that will
// take the wrong one.
type AddRow =
  | { id: string; label: string; glyph: string; slice: ListSlice }
  | { id: string; label: string; glyph: string; href: string };

const ROWS: readonly AddRow[] = [
  // ── CALENDAR CROSSED AT §4-2 AND THIS LINE DID NOT CHANGE ─────────────────
  // It said, at R-38.18: 「it is a declared interim address, and it becomes a `/vendor/` route in
  // the same edit that crosses the room, with nothing here to remember.」 That is exactly
  // what happened — `roomHref('calendar')` returns `/vendor/calendar` now because the registry
  // says so, and this file was not touched by the crossing.
  //
  // THE COMMENT IS UPDATED THOUGH, AND THAT IS THE HALF THAT IS EASY TO SKIP. The old note
  // described calendar as interim, and a comment that has stopped being true is worse than
  // no comment: the next reader trusts it and reasons from a room's status that changed two
  // sittings ago. This seat filed F-38.29 three times this arc for exactly the gap between
  // a comment and the line beneath it — here the line was already right and the words were
  // not, which is the same defect wearing the other face.
  { id: 'calendar', label: COPY.addCalendar, glyph: '\u25a6', href: roomHref('calendar') },
  { id: 'lead',     label: COPY.addLead,     glyph: '\u25cb', slice: 'leads' },
  { id: 'client',   label: COPY.addClient,   glyph: '\u25c9', slice: 'clients' },
  { id: 'invoice',  label: COPY.addInvoice,  glyph: '\u25a4', slice: 'invoices' },
  { id: 'expense',  label: COPY.addExpense,  glyph: '\u25a5', slice: 'expenses' },
  { id: 'event',    label: COPY.addEvent,    glyph: '\u25c8', slice: 'events' },
  // Notes has no AddSheet leg — its composer is NotesBody's own `addOpen`, and building a
  // second one here would be a second home for the one surface that writes a note.
  { id: 'note',     label: COPY.addNote,     glyph: '\u25a1', href: '/vendor/notes?add=1' },
];

export function AddFab() {
  const router = useRouter();
  const { toast, show } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [slice, setSlice] = useState<ListSlice | null>(null);

  function take(row: AddRow) {
    setMenuOpen(false);
    if ('slice' in row) setSlice(row.slice);
    else router.push(row.href);
  }

  return (
    <>
      {/* CE-39 S2/6 · F-39.4: Rooms' seat is now every room's seat, so this control draws
          through the one component rather than being the one that happens to look right.
          `aria-expanded` left with the local button: it announced a menu, and two of the
          three FABs open a sheet rather than a menu, so the attribute cannot ride the
          shared seat honestly. The sheet below is a dialog and names itself. */}
      <Fab label={COPY.addTitle} onClick={() => setMenuOpen(true)} />

      {menuOpen && (
        <div className="wl-addsheet" role="dialog" aria-modal="true" aria-label={COPY.addTitle}>
          {/* A sheet with no way out is a trap. The scrim closes, and it is a button so the
              exit is reachable by keyboard as well as by thumb. */}
          <button type="button" className="wl-addscrim" aria-label={COPY.drawerCancel}
                  onClick={() => setMenuOpen(false)} />
          <div className="wl-addpanel">
            <div className="wl-addhead">{COPY.addTitle}</div>
            {ROWS.map((r) => (
              <button type="button" key={r.id} className="wl-addrow" data-add={r.id}
                      onClick={() => take(r)}>
                <span className="wl-addglyph" aria-hidden>{r.glyph}</span>
                <span className="wl-addlabel">{r.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* THE MOUNT IS LOAD-BEARING (honest controls, CE-209). AddSheet reports every
          outcome through `onToast` and nothing else; without a toast on screen a failed
          create looks exactly like a successful one. WlToast rather than Toast, because
          Toast reads `useT()` as JavaScript and would paint Espresso-dark inside /w
          forever without erroring (F-38.3's neighbour, the S2 §3 ④ finding). */}
      {slice && (
        <AddSheet open slice={slice} onClose={() => setSlice(null)} onToast={show} />
      )}
      <WlToast toast={toast} />
      <style>{FAB_CSS}</style>
    </>
  );
}

// ⚠ NO BACKTICKS AND NO CODE MARKS BELOW THIS LINE. Everything after it is inside a JS
// template literal; a backtick written around a selector while explaining that selector
// ends the literal and fails the compile. Six instances this arc. Selectors in words.
//
// ── CE-39 S2/6 · THE SEAT IS NOT IN THIS FILE ANY MORE ──────────────────────
// The wl-fab rule and its press and focus rules moved to WorklistShell's SHELL_CSS, with
// the measurement paragraph that earned the number: three rooms draw a FAB now, and shared
// chrome belongs to the thing every surface is inside rather than to the first component
// that happened to need it. See components/worklist/Fab.tsx for why the rule may not
// travel with the component.
//
// ⚠ AND THIS NOTE LIVES IN A JS COMMENT BECAUSE THE FIRST CUT PUT IT INSIDE THE LITERAL,
// with the selector written in code marks — which ends the literal and fails the compile,
// three lines under the warning that says so. Seventh instance on this arc. `tsc` caught
// it in one run. Selectors in these comments are written in words.
const FAB_CSS = `
.wl-addsheet{position:fixed;inset:0;z-index:30;display:flex;flex-direction:column;justify-content:flex-end}
.wl-addscrim{position:absolute;inset:0;background:var(--role-scrim);border:none;cursor:pointer}
.wl-addpanel{position:relative;background:var(--atelier-sheet-bg);border:.5px solid var(--atelier-sheet-border);border-bottom:none;border-radius:12px 12px 0 0;padding:8px var(--wl-gutter) calc(8px + env(safe-area-inset-bottom))}
/* A section eyebrow, the second of the two permitted homes for letter-spaced uppercase. */
.wl-addhead{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);padding:12px 0 8px}
/* 52px is the shell’s row height and it clears the 44 tap floor with air. t3 for the
   label: a row is a control, and R-37.73 (2) put the interactive floor at 12px after 9px
   was convicted as illegible chrome. */
.wl-addrow{display:flex;align-items:center;gap:12px;width:100%;min-height:52px;padding:0;background:none;border:none;border-top:.5px solid var(--atelier-card-border);cursor:pointer;text-align:left;touch-action:manipulation}
.wl-addrow:first-of-type{border-top:none}
.wl-addglyph{font:var(--wl-t4);color:var(--atelier-accent-text);width:20px;text-align:center;flex-shrink:0}
.wl-addlabel{font:var(--wl-t3);color:var(--atelier-ink)}
.wl-addrow:active{background:var(--atelier-row-hover)}
.wl-addrow:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:-2px}
`;
