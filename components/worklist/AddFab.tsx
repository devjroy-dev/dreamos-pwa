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
import { roomHref } from '@/lib/worklist/rooms';
import type { ListSlice } from '@/hooks/vendor/useLastSlice';

// THE ROW SET. `slice` is the AddSheet leg; a row without one carries an `href` instead.
// Both fields are never set on one row — a row with two destinations is a row that will
// take the wrong one.
type AddRow =
  | { id: string; label: string; glyph: string; slice: ListSlice }
  | { id: string; label: string; glyph: string; href: string };

const ROWS: readonly AddRow[] = [
  // ⚠ CALENDAR IS THE THIRD CASE AND IT IS NAMED RATHER THAN HIDDEN. It resolves through
  // `roomHref`, which today returns the DECLARED INTERIM href `/vendor/calendar` — calendar
  // has not crossed (lib/worklist/rooms.ts INTERIM_VENDOR_ROOMS). It is not a `/w/` route
  // and it is not an AddSheet leg; it is a declared interim address, and it becomes a `/w/`
  // route in the same edit that crosses the room, with nothing here to remember.
  { id: 'calendar', label: COPY.addCalendar, glyph: '\u25a6', href: roomHref('calendar') },
  { id: 'lead',     label: COPY.addLead,     glyph: '\u25cb', slice: 'leads' },
  { id: 'client',   label: COPY.addClient,   glyph: '\u25c9', slice: 'clients' },
  { id: 'invoice',  label: COPY.addInvoice,  glyph: '\u25a4', slice: 'invoices' },
  { id: 'expense',  label: COPY.addExpense,  glyph: '\u25a5', slice: 'expenses' },
  { id: 'event',    label: COPY.addEvent,    glyph: '\u25c8', slice: 'events' },
  // Notes has no AddSheet leg — its composer is NotesBody's own `addOpen`, and building a
  // second one here would be a second home for the one surface that writes a note.
  { id: 'note',     label: COPY.addNote,     glyph: '\u25a1', href: '/w/notes?add=1' },
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
      <button type="button" className="wl-fab" aria-label={COPY.addTitle}
              aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
        <span aria-hidden>+</span>
      </button>

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
const FAB_CSS = `
/* ── THE FAB'S SEAT · 56px, bottom-right, ONE GUTTER IN, 16px CLEAR OF THE DOCK ────
   ── THE OFFSET IS MEASURED NOW, NOT REMEMBERED  [relay #3 item 4] ────────────
   The first cut computed the bottom chrome from its parts: nav min-height 52, plus a dock
   of 8+8 padding over a 44px field with a half-pixel border, call it 61. 113. Every other
   thing about the control was right and the gap came out at NINE PIXELS in both modes,
   because 113 is not what the browser paints — the real chrome measures 120, and the seven
   missing pixels live somewhere in a line box I would have kept re-deriving from the
   stylesheet and kept getting wrong.

   THAT IS THE WHOLE LESSON AND IT IS THIS FILE'S OWN NEIGHBOURHOOD: a rule assembled out
   of other rules' declared values is arithmetic about a stylesheet, not a fact about a
   page. The gutter cell, the tile-height cell and the edge cell all exist because
   declarations and paint disagree.

   MEASURED ON THE DEPLOY, 390x844, BOTH MODES: the dock's top edge sits 120px above the
   viewport bottom. 120 + 16 = 136, and the safe-area inset rides on top because it is zero
   on the measuring surface and is not zero on the founder's phone.

   THE NUMBER IS NOT THE PROOF EITHER. C-R18 measures the painted gap every run and reds on
   15..17; if the dock gains a row, this literal goes stale and the cell says so in the
   run rather than in a comment nobody re-derives. */
.wl-fab{position:fixed;right:var(--wl-gutter);bottom:calc(136px + env(safe-area-inset-bottom));z-index:18;width:56px;height:56px;border:none;border-radius:50%;background:var(--atelier-accent-text);color:var(--role-ink-deep);font:var(--wl-t1);line-height:1;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 12px rgba(0,0,0,.28);touch-action:manipulation}
/* ── THE PRESS IS GEOMETRIC, AND THAT IS A RULING RATHER THAN A SHORTCUT ──────
   F-38.14 measured the press FILL to 1.5:1 after 1.1:1 was convicted as an acknowledgement
   nobody could see. That floor is a ratio between a row's pressed fill and the ground it
   sits on, and it does not transfer here: this control is a solid accent disc floating over
   arbitrary content, so a darker accent has no fixed neighbour to be read against and any
   number chosen for it would be a colour nobody measured — which is precisely what the
   Slice Door's retired opacity was.
   So the press is SIZE and DEPTH: 56 to 52.6 (6%) with the shadow pulled in. Both are
   changes to the control itself, both survive on any ground, and C-R18 measures the
   painted rect rather than reading this rule. NO NEW COLOUR TOKEN WAS INVENTED FOR A
   PRESSED STATE, and that refusal is the point of the paragraph. */
.wl-fab:active{transform:scale(.94);box-shadow:0 1px 4px rgba(0,0,0,.28)}
.wl-fab:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:3px}
.wl-addsheet{position:fixed;inset:0;z-index:30;display:flex;flex-direction:column;justify-content:flex-end}
.wl-addscrim{position:absolute;inset:0;background:var(--role-scrim);border:none;cursor:pointer}
.wl-addpanel{position:relative;background:var(--atelier-sheet-bg);border:.5px solid var(--atelier-sheet-border);border-bottom:none;border-radius:12px 12px 0 0;padding:8px var(--wl-gutter) calc(8px + env(safe-area-inset-bottom))}
/* A section eyebrow, the second of the two permitted homes for letter-spaced uppercase. */
.wl-addhead{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);padding:12px 0 8px}
/* 52px is the shell's row height and it clears the 44 tap floor with air. t3 for the
   label: a row is a control, and R-37.73 (2) put the interactive floor at 12px after 9px
   was convicted as illegible chrome. */
.wl-addrow{display:flex;align-items:center;gap:12px;width:100%;min-height:52px;padding:0;background:none;border:none;border-top:.5px solid var(--atelier-card-border);cursor:pointer;text-align:left;touch-action:manipulation}
.wl-addrow:first-of-type{border-top:none}
.wl-addglyph{font:var(--wl-t4);color:var(--atelier-accent-text);width:20px;text-align:center;flex-shrink:0}
.wl-addlabel{font:var(--wl-t3);color:var(--atelier-ink)}
.wl-addrow:active{background:var(--atelier-row-hover)}
.wl-addrow:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:-2px}
`;
