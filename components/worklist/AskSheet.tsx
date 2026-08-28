"use client";
// components/worklist/AskSheet.tsx — R-37.84 ⑦ Arm A: the risen chat, in branch tokens.
//
// THE COSTUME TELLS THE TRUTH AGAIN. R-37.83 stripped the field shape because tapping it
// teleported to WhatsApp. Now the tap opens the chat, so the shape may promise what it
// delivers: the vendor types where he was invited to type, and the answer comes back.
//
// ── R-38.17 · AND THE SHEET SAYS WHERE IT COMES BACK ────────────────────────
// `askSheetNote` — 「TDW replies on WhatsApp.」 The vendor types in-app; the reply arrives
// on her phone. A surface that takes the message and says nothing about where the answer
// goes is wearing the costume again in the other direction: it looks like a thread, and
// the thread is somewhere else. One line, under the head, at t5.
//
// (The old note in this comment named a persona. 「DreamAi」 is banned outright from every
// vendor-facing byte at R-38.17 and the ban is worth honouring in the file's own prose too,
// so that the next reader does not learn the word here and then use it in a string.)
//
// D-2 THROUGHOUT: ChatThread, InputBar, useChat and reportGlitch are all imported at their
// single homes. Nothing here is a copy of anything. The one thing this component adds is the
// ThemeProvider mount — which is not a shim: it is the estate's own provider, and on this
// branch it hands out Graphite and Chalk because ZIP 3 rewrote its token source.
import { useEffect, useRef } from 'react';
import { COPY } from '@/lib/worklist/copy';
import { ThemeProvider } from '@/lib/vendor/ThemeContext';
import { ChatThread } from '@/components/vendor/ChatThread';
import { InputBar } from '@/components/vendor/InputBar';
import { useChat } from '@/hooks/vendor/useChat';
import { reportGlitch } from '@/lib/vendor/api/vendor';

export function AskSheet({ vendorId, mode, onClose }: { vendorId: string; mode: 'dark' | 'light'; onClose: () => void }) {
  const { messages, loading, send } = useChat({ vendorId });
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragFrom = useRef<number | null>(null);

  // Escape closes, and the scrim closes. A sheet with no way out is a trap.
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);

  return (
    /* ── F-38.3 AMENDED (CE-38 S3) · THE PROVIDER STAYS, THE STAIN DOES NOT ────
       This mount was convicted as a SECOND writer of the document ground: it sets
       `documentElement.style.background` and the `theme-light` class, both outside
       React's tree, and neither was undone when the sheet closed. The shell then
       navigated onto a document still wearing the sheet's mode.

       IT IS NOT DROPPED, AND THE REASON IS DERIVED RATHER THAN CAUTIOUS.
       `ChatThread` (12 reads) and `InputBar` (13 reads) both call `useT()`, whose
       context defaults to `DARK` with no throw — so removing the provider would render
       those two SILENTLY dark inside Chalk rather than loudly broken. That is the
       hollow-green shape, and trading a visible one-property stain for it is a worse
       cure than the defect.

       So the teardown lands instead: `ThemeContext` now snapshots the document before
       the pin writes and restores it on unmount, with the clear-set recorded BY the
       writer so the two cannot drift. F-38.50 charters the real cure — those two
       components onto CSS variables — after which no /w surface needs this at all. */
    <ThemeProvider pinned={mode}>
      <div className="wl-asksheet" role="dialog" aria-modal="true" aria-label={COPY.dockAria}>
        <button type="button" className="wl-askscrim" aria-label="Close" onClick={onClose} />
        <div className="wl-askpanel">
          {/* R-37.89: the drag-down affordance. A sheet this tall needs a dismissal the thumb
              finds without aiming for a 44px x in the corner. Pointer-drag past 60px closes;
              the grabber is also a button, so keyboard and screen-reader users get the same exit. */}
          <button type="button" className="wl-askgrab" aria-label="Close" onClick={onClose}
                  onPointerDown={(e) => { dragFrom.current = e.clientY; }}
                  onPointerUp={(e) => { if (dragFrom.current !== null && e.clientY - dragFrom.current > 60) onClose();
                                        dragFrom.current = null; }} />
          {/* THE TITLE WAS AN INLINE LITERAL AND THAT WAS A COPY-LAW BREACH, not a tidy.
              Nothing in the shell may inline a vendor-facing string; a vetoed byte at its
              point of use drifts a character at a time with no instrument watching. It
              reads `dockAria` because the sheet's title and the label of the control that
              opens it are ONE statement about what this is, not two that can disagree. */}
          <div className="wl-askhead"><span className="wl-asktitle">{COPY.dockAria}</span>
            <button type="button" className="wl-askclose" aria-label="Close" onClick={onClose}>&times;</button></div>
          <p className="wl-asknote">{COPY.askSheetNote}</p>
          <div className="wl-askbody" ref={scrollRef}>
            <ChatThread messages={messages} loading={loading} onChipTap={send} scrollRef={scrollRef}
              /* onConfirm/onCancel are required by Props and no-op'd by every caller,
                 including app/vendor/page.tsx:1149-1150 — a contract that has drifted from
                 its component. Matched here rather than papered over; Phase 2 owns the cure. */
              onConfirm={() => {}} onCancel={() => {}}
              onReportGlitch={async () => { await reportGlitch(); }}
              onRetryLast={() => { const last = [...messages].reverse().find((m) => m.role === 'user');
                                   if (last?.text) send(last.text); }} />
          </div>
          <InputBar onSend={send} />
        </div>
      </div>
      <style>{ASK_CSS}</style>
    </ThemeProvider>
  );
}

// ── R-38.4 · THE SHEET HEAD IS t2 ──────────────────────────────────────────
// It was Jost at 12px/.16em uppercase through `--wl-label`. That variable is deleted with
// the family, and the head becomes the section-heading rung: it NAMES the surface rather
// than captioning it, and letter-spaced uppercase survives in exactly two places of which
// a sheet title is neither.
//
// ⚠ THIS EXPLANATION LIVES IN A JS COMMENT AND NOT IN THE CSS, AND THAT IS THE POINT.
// The first cut wrote it as a /* */ comment INSIDE the template literal below — so the
// words 「--wl-label」 were emitted into the served stylesheet, and the audit's
// retired-variable cell reddened on my own tombstone. ZIP 14 ⑧ owned this exact family
// ("I shipped a verify line asserting the absence of a class NAME while my own labelled
// deletion comments named those classes"); this is the same mistake pointing the other
// way, and the gate caught it in one run. A comment about a retirement must not ship to
// the vendor's browser, or it becomes the thing it is describing.
//
// NOTE FOR THE ARM'S TUPLE CELL: this sheet is NOT in the §5 capture set. Its body is
// ChatThread and InputBar, carried components with their own type, and bringing them onto
// the scale is the same sitting that drops this file's ThemeProvider (F-38.3).
const ASK_CSS = `
.wl-asksheet{position:fixed;inset:0;z-index:40;display:flex;flex-direction:column;justify-content:flex-end}
.wl-askscrim{position:absolute;inset:0;background:var(--role-scrim);border:none;cursor:pointer}
/* R-37.89 · THE CHAT IS A WORK SURFACE, NOT A PEEK.
   This rule used to read "max-height:82dvh" — a CAP, not a height. A cap only bites when
   the content is tall, and a fresh thread is empty, so the sheet opened at whatever the
   head + an empty body + the input happened to measure: the render arm caught it at ~35%
   of the viewport. A work surface does not resize itself to how little you have said yet.
   "height" is the fix; the cap stays beneath it as the safety it always was. */
.wl-askpanel{position:relative;display:flex;flex-direction:column;height:85dvh;max-height:85dvh;background:var(--atelier-sheet-bg);border:.5px solid var(--atelier-sheet-border);border-bottom:none;border-radius:12px 12px 0 0;overflow:hidden;padding-bottom:env(safe-area-inset-bottom)}
/* R-37.82's gutter, INSIDE the sheet — the sheet is its own scroll column and owns its inset. */
.wl-askpanel > *{padding-left:var(--wl-gutter);padding-right:var(--wl-gutter)}
.wl-askgrab{flex-shrink:0;align-self:center;width:38px;height:4px;margin:8px 0 2px;padding:0;border:none;border-radius:2px;background:var(--atelier-ink-fade);cursor:grab;touch-action:none}
.wl-askhead{flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:14px 16px 12px;border-bottom:.5px solid var(--atelier-card-border)}
.wl-asktitle{font:var(--wl-t2);color:var(--atelier-accent-text)}
/* R-38.17 the channel note. t5, ink-mute: it is metadata about where the answer lands,
   not a sentence the vendor has to read before typing. It sits under the head's rule so
   the scroll body still starts at the thread. */
.wl-asknote{flex-shrink:0;font:var(--wl-t5);color:var(--atelier-ink-mute);margin:8px 0 0}
.wl-askclose{width:44px;height:44px;margin:-10px -10px -10px 0;background:none;border:none;color:var(--atelier-ink-mute);font-size:22px;line-height:1;cursor:pointer}
.wl-askbody{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;min-height:180px}
`;
